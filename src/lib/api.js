// All calls go through our own Express server (see /server/index.js), which
// holds the GROQ_API_KEY server-side. The browser never sees the key.

const isHackOnVibeHost =
  typeof window !== "undefined" && window.location.hostname.endsWith("hackonvibe.com");
const BASE = import.meta.env.VITE_API_BASE || (isHackOnVibeHost ? "https://launch-twin.vercel.app/api" : "/api");

async function parseError(res, path) {
  const text = await res.text().catch(() => "Unknown error");
  let maybeJson;
  try {
    maybeJson = JSON.parse(text);
  } catch {
    maybeJson = null;
  }
  const detail = maybeJson?.error || text || `HTTP ${res.status}`;
  throw new Error(`${path} failed (${res.status}): ${detail}`);
}

async function postJSON(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    await parseError(res, path);
  }
  return res.json();
}

// Reads a plain chunked-text stream from the server and calls onChunk(text)
// as pieces arrive — this is what drives the terminal "typing" effect.
async function streamText(path, body, onChunk) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok || !res.body) {
    await parseError(res, path);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    full += chunk;
    onChunk(chunk, full);
  }
  return full;
}

export const api = {
  generatePersona: (payload) => postJSON("/persona", payload),
  generateScenes: (payload, onChunk) => streamText("/scenes", payload, onChunk),
  generateContent: (payload, onChunk) => streamText("/content", payload, onChunk),
  generateCritique: (payload) => postJSON("/critique", payload),
  generateCalendar: (payload) => postJSON("/calendar", payload)
};
