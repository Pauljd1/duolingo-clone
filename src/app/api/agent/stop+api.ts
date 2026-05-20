const VISION_AGENT_URL = process.env.VISION_AGENT_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { callId?: string; sessionId?: string };
    const { callId, sessionId } = body;

    if (!callId || typeof callId !== "string") {
      return Response.json({ error: "callId is required" }, { status: 400 });
    }
    if (!sessionId || typeof sessionId !== "string") {
      return Response.json({ error: "sessionId is required" }, { status: 400 });
    }

    // POST /calls/{call_id}/sessions/{session_id}/close
    // This is the sendBeacon-compatible closure endpoint that works with POST.
    await fetch(
      `${VISION_AGENT_URL}/calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}/close`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    ).catch((err) => {
      console.warn("[agent/stop] could not reach Vision Agent server:", err);
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[agent/stop]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
