import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
  console.warn(
    "\n⚠️  GROQ_API_KEY is not set. Copy .env.example to .env and add your key from https://console.groq.com/keys\n"
  );
}

function requireKey(res) {
  if (!GROQ_API_KEY) {
    res.status(500).json({
      error: "GROQ_API_KEY missing on server. Add it to your .env file and restart the server."
    });
    return false;
  }
  return true;
}

function stringifyFeatures(features) {
  if (!Array.isArray(features) || features.length === 0) return "n/a";
  return features.join(", ");
}

function appContext({ appName, appDescription, appCategory, launchStage, keyFeatures }) {
  return [
    `App name: ${appName || "n/a"}`,
    `Description: ${appDescription || "n/a"}`,
    `Category: ${appCategory || "n/a"}`,
    `Launch stage: ${launchStage || "n/a"}`,
    `Key features: ${stringifyFeatures(keyFeatures)}`
  ].join("\n");
}

// ---------- Non-streaming JSON helper ----------
async function groqJSON(systemPrompt, userPrompt) {
  const r = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.8,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    })
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Groq API error (${r.status}): ${text}`);
  }
  const data = await r.json();
  const raw = data.choices?.[0]?.message?.content || "{}";
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }
}

// ---------- Streaming text helper ----------
async function groqStreamToResponse(systemPrompt, userPrompt, res) {
  const upstream = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.85,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: true
    })
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "stream failed");
    res.status(500).end(`Groq stream error: ${text}`);
    return;
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  const decoder = new TextDecoder();
  let buffer = "";

  for await (const chunk of upstream.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.replace(/^data:\s*/, "");
      if (payload === "[DONE]") {
        res.end();
        return;
      }
      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) res.write(delta);
      } catch {
        // ignore malformed keepalive lines
      }
    }
  }
  res.end();
}

// ---------- Prompt builders ----------
const PERSONA_SYSTEM = `You are a sharp consumer-insights strategist for mobile app launches. Given an app, launch stage, and rough target-user description, invent ONE specific, believable persona. Respond ONLY with a JSON object, no prose, no markdown fences, matching exactly this shape:
{
  "name": "string, first name only",
  "age": number,
  "role": "short occupation/life-stage phrase",
  "dailyRoutine": "1-2 sentences on a typical day",
  "frustration": "the specific everyday frustration this app solves for them",
  "platforms": ["3-4 short platform/community names they actually spend time on"],
  "trustTriggers": "1 sentence: what makes them trust a recommendation vs. ignore an ad",
  "scrollStopPower": number between 1-10,
  "traits": ["4 short single-word or two-word personality traits"]
}`;

const SCENES_SYSTEM = `You are writing a short discovery simulation - 3 vivid, realistic vignettes of a specific persona stumbling onto a specific mobile app in everyday life. Each vignette is 2-4 sentences, concrete and specific (name platform, moment, and what catches their eye). Reflect the launch stage naturally. Separate the 3 scenes with a line containing exactly: ---SCENE---
Do not add headers, numbering, or other formatting. Do not add a preamble or closing remarks.`;

const CONTENT_SYSTEM_BY_CHANNEL = {
  reddit: `You write Reddit posts that never sound like ads. Given a persona and an app, write ONE Reddit post (title + body) as if a genuine community member is sharing something useful, matched to a relevant subreddit. Include a realistic subreddit suggestion at the top like "r/suggested_subreddit". No hashtags, no emoji spam, no marketing language. Keep it under 150 words. Output plain text only.`,
  producthunt: `You write Product Hunt launch copy. Given a persona and an app, write: a tagline (under 10 words), a 3-sentence maker comment in first person, and 3 short FAQ-style bullet Q&As anticipating this persona's concerns. Output plain text only, no markdown headers.`,
  xthread: `You write X/Twitter launch threads. Given a persona and an app, write ONE concise thread with exactly 5 posts, each prefixed as "1/5".."5/5". Keep every line human, specific, and non-salesy. Include one soft CTA only in post 5/5. No hashtags unless they are highly relevant and at most one. Output plain text only.`,
  video: `You write short-form video scripts (TikTok/Reels style). Given a persona and an app, write a 15-second script as a shot list: 4-5 numbered shots, each with a one-line visual direction and spoken line/caption. Hook must land in the first 2 seconds. Output plain text only.`
};

const CRITIQUE_SYSTEM = `You are a blunt but constructive marketing critic. Given a persona and a piece of promotional content written for them, score how likely THIS persona is to genuinely stop, engage, and share it. Respond ONLY with JSON:
{
  "score": number 1-10,
  "verdict": "one short sentence, in the persona's imagined voice or about their reaction",
  "fix": "one short actionable suggestion to improve it, or 'None - this lands.' if score is 8+",
  "dimensions": {
    "authenticity": number 1-10,
    "conversionPotential": number 1-10
  }
}`;

const CALENDAR_SYSTEM = `You are a lean startup marketing planner advising a SOLO indie developer with a $0 budget - no agency, no paid ads, no influencer contracts. Given a persona and an app, produce a realistic 7-day launch calendar made only of actions one person can do alone with a laptop. Also include a short list of immediate first-user actions. Respond ONLY with JSON:
{
  "days": [
    { "day": "Day 1", "focus": "short phrase", "action": "one concrete, zero-budget, solo-doable sentence" }
    // ...exactly 7 entries total
  ],
  "firstUserActions": ["3-5 concrete actions under 100 characters each"]
}`;

// ---------- Routes ----------

app.post("/api/persona", async (req, res) => {
  if (!requireKey(res)) return;
  try {
    const { targetUser } = req.body;
    const user = `${appContext(req.body)}\nRough target user: ${targetUser || "n/a"}`;
    const persona = await groqJSON(PERSONA_SYSTEM, user);
    res.json(persona);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/scenes", async (req, res) => {
  if (!requireKey(res)) return;
  try {
    const { persona } = req.body;
    const user = `${appContext(req.body)}\nPersona: ${JSON.stringify(persona)}`;
    await groqStreamToResponse(SCENES_SYSTEM, user, res);
  } catch (e) {
    res.status(500).end(e.message);
  }
});

app.post("/api/content", async (req, res) => {
  if (!requireKey(res)) return;
  try {
    const { channel, persona, tone, scenes, extraInstruction } = req.body;
    const systemPrompt = CONTENT_SYSTEM_BY_CHANNEL[channel];
    if (!systemPrompt) {
      res.status(400).end("Unknown channel");
      return;
    }
    const toneNote = tone ? `\nDesired tone: ${tone}.` : "";
    const refinement = extraInstruction ? `\nRefinement request: ${extraInstruction}` : "";
    const user = `${appContext(req.body)}\nPersona: ${JSON.stringify(
      persona
    )}\nDiscovery context: ${scenes || "n/a"}${toneNote}${refinement}`;
    await groqStreamToResponse(systemPrompt, user, res);
  } catch (e) {
    res.status(500).end(e.message);
  }
});

app.post("/api/critique", async (req, res) => {
  if (!requireKey(res)) return;
  try {
    const { persona, content, channel } = req.body;
    const user = `Persona: ${JSON.stringify(persona)}\nChannel: ${channel}\nContent:\n${content}`;
    const critique = await groqJSON(CRITIQUE_SYSTEM, user);
    res.json(critique);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/calendar", async (req, res) => {
  if (!requireKey(res)) return;
  try {
    const { persona } = req.body;
    const user = `${appContext(req.body)}\nPersona: ${JSON.stringify(persona)}`;
    const calendar = await groqJSON(CALENDAR_SYSTEM, user);
    res.json(calendar);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, model: GROQ_MODEL }));

// Export for Vercel serverless (`api/index.js`). Only bind a port locally.
export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8787;
  app.listen(PORT, () => {
    console.log(`🕹️  LaunchTwin API running on http://localhost:${PORT}`);
  });
}
