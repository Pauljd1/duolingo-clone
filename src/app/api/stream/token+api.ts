import crypto from "crypto";

function generateStreamToken(userId: string): string {
  const apiSecret = process.env.STREAM_API_SECRET;
  if (!apiSecret) throw new Error("STREAM_API_SECRET is not configured");

  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");

  const payload = Buffer.from(
    JSON.stringify({
      user_id: userId,
      iss: "stream-video-go",
      sub: `user/${userId}`,
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId || typeof userId !== "string") {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const token = generateStreamToken(userId);
    return Response.json({ token });
  } catch (err) {
    console.error("[stream/token]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
