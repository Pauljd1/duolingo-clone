import Constants from "expo-constants";
import { Platform } from "react-native";

export const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY ?? "";

export const AGENT_USER_ID = "luna-language-teacher";

function getServerBaseUrl(): string {
  // Explicit env var wins in every mode — set this to your machine's LAN IP
  // when testing on a physical device, e.g. http://192.168.1.42:8081
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (!__DEV__) return "";

  // hostUri is the Metro server address injected by the Expo dev client.
  // On physical devices it should be the machine's LAN IP, but fall back
  // to platform-specific loopback addresses for emulators.
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri && !hostUri.startsWith("localhost")) {
    return `http://${hostUri}`;
  }

  // Android emulator reaches the host machine via this special alias
  if (Platform.OS === "android") return "http://10.0.2.2:8081";
  return "http://localhost:8081";
}

// ── Agent helpers ─────────────────────────────────────────────────────────────

/** Returns the Vision Agent session ID needed to stop the session later. */
export async function startAgent(
  callId: string,
  lessonId: string
): Promise<string> {
  const url = `${getServerBaseUrl()}/api/agent/start`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callId, lessonId }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data as { error?: string }).error ?? `Agent start failed: ${res.status}`);
    }
    const data = await res.json() as { sessionId?: string };
    if (!data.sessionId) throw new Error("Agent start returned no sessionId");
    return data.sessionId;
  } finally {
    clearTimeout(timer);
  }
}

export async function stopAgent(callId: string, sessionId: string): Promise<void> {
  const url = `${getServerBaseUrl()}/api/agent/stop`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callId, sessionId }),
      signal: controller.signal,
    });
  } catch {
    // best-effort
  } finally {
    clearTimeout(timer);
  }
}

// ── Stream token ──────────────────────────────────────────────────────────────

export async function fetchStreamToken(userId: string): Promise<string> {
  const url = `${getServerBaseUrl()}/api/stream/token`;
  console.log("[stream] fetching token from", url);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Token request failed: ${res.status}`);
    const data: { token?: string; error?: string } = await res.json();
    if (!data.token) throw new Error(data.error ?? "No token received");
    console.log("[stream] token received");
    return data.token;
  } finally {
    clearTimeout(timer);
  }
}
