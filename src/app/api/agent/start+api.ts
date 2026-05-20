import crypto from "crypto";

const VISION_AGENT_URL = process.env.VISION_AGENT_URL ?? "http://localhost:8000";
const STREAM_API_BASE = "https://video.stream-io-api.com/api/v2";

// Server JWT for authorising direct Stream REST calls.
// Uses `server: true` (no user_id) per Stream Video's server-to-server spec.
function generateServerToken(): string {
  const secret = process.env.STREAM_API_SECRET;
  if (!secret) throw new Error("STREAM_API_SECRET is not configured");

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      server: true,
      iss: "stream-video-go",
      sub: "server",
      iat: now,
      exp: now + 60,
    })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${sig}`;
}

// PUT the call in "live" mode so the agent can publish audio.
// audio_room calls start live by default; this is belt-and-suspenders.
async function goLiveCall(callType: string, callId: string): Promise<void> {
  const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY ?? "";
  try {
    const token = generateServerToken();
    // api_key must also be in the query string for Stream's REST API to accept the JWT.
    const url =
      `${STREAM_API_BASE}/video/call/${callType}/${encodeURIComponent(callId)}/go_live` +
      `?api_key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "stream-auth-type": "jwt",
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn(`[agent/start] goLive ${res.status}:`, body);
    }
  } catch (err) {
    // Non-fatal — audio_room is live by default.
    console.warn("[agent/start] goLive skipped:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { callId?: string; lessonId?: string };
    const { callId, lessonId } = body;

    if (!callId || typeof callId !== "string") {
      return Response.json({ error: "callId is required" }, { status: 400 });
    }
    if (!lessonId || typeof lessonId !== "string") {
      return Response.json({ error: "lessonId is required" }, { status: 400 });
    }

    // 1. Ensure the call is in live mode before the agent joins.
    await goLiveCall("audio_room", callId);

    // 2. Start a Vision Agent session for this call.
    //    Endpoint: POST /calls/{call_id}/sessions
    //    The agent reads lesson context from the call's custom data (set by the
    //    mobile app on join) using the getstream Python SDK in agent.py.
    const agentRes = await fetch(
      `${VISION_AGENT_URL}/calls/${encodeURIComponent(callId)}/sessions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_type: "audio_room" }),
      }
    );

    if (!agentRes.ok) {
      const errText = await agentRes.text();
      console.error("[agent/start] Vision Agent error:", agentRes.status, errText);
      return Response.json(
        { error: `Agent server error: ${agentRes.status}` },
        { status: 502 }
      );
    }

    // Return the session_id so the mobile app can reference it when stopping.
    const data = await agentRes.json() as { session_id: string };
    return Response.json({ ok: true, sessionId: data.session_id });
  } catch (err) {
    console.error("[agent/start]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
