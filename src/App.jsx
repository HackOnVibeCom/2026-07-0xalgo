import React, { useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import RetroScene from "./components/RetroScene.jsx";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import InputPanel from "./components/InputPanel.jsx";
import PersonaCard from "./components/PersonaCard.jsx";
import DiscoveryFeed from "./components/DiscoveryFeed.jsx";
import ContentTerminal from "./components/ContentTerminal.jsx";
import LaunchCalendar from "./components/LaunchCalendar.jsx";
import Loader from "./components/Loader.jsx";
import { api } from "./lib/api.js";
import { sfx } from "./lib/sound.js";
import {
  sampleForm,
  samplePersona,
  sampleScenes,
  sampleContent,
  sampleCritiques,
  sampleCalendar
} from "./lib/sampleCampaign.js";

const CHANNELS = ["reddit", "producthunt", "xthread", "video"];
const STAGE_LABELS = {
  persona: "Step 1 of 5 - Building persona",
  scenes: "Step 2 of 5 - Simulating discovery",
  content: "Step 3 of 5 - Writing content kit",
  calendar: "Step 4 of 5 - Building launch calendar"
};
const STAGE_ORDER = ["persona", "scenes", "content", "calendar", "done"];

function splitScenes(raw = "") {
  return raw
    .split("---SCENE---")
    .map((scene) => scene.trim())
    .filter(Boolean);
}

function stringifyList(list) {
  if (!Array.isArray(list) || list.length === 0) return "- n/a";
  return list.map((item) => `- ${item}`).join("\n");
}

function formatCampaignMarkdown({ form, persona, scenesRaw, content, critiques, calendar }) {
  const scenes = splitScenes(scenesRaw);
  const lines = [
    `# LaunchTwin Campaign - ${form?.appName || "Untitled"}`,
    "",
    "## App Snapshot",
    `- Name: ${form?.appName || "n/a"}`,
    `- Category: ${form?.appCategory || "n/a"}`,
    `- Launch stage: ${form?.launchStage || "n/a"}`,
    `- Link: ${form?.appLink || "n/a"}`,
    `- Tone: ${form?.tone || "n/a"}`,
    "",
    "### Description",
    form?.appDescription || "",
    "",
    "### Key Features",
    stringifyList(form?.keyFeatures),
    "",
    "### Target User",
    form?.targetUser || "",
    "",
    `## Persona: ${persona?.name || "Unknown"}`,
    `${persona?.age || "?"} - ${persona?.role || "Unknown"}`,
    persona?.dailyRoutine || "",
    "",
    "### Frustration",
    persona?.frustration || "",
    "",
    "### Platforms",
    stringifyList(persona?.platforms),
    "",
    "## Discovery Scenes",
    ...(scenes.length
      ? scenes.flatMap((scene, idx) => [`### Scene ${idx + 1}`, scene, ""])
      : ["No scenes generated.", ""]),
    "## Content Kit",
    "",
    "### Reddit Post",
    content.reddit || "",
    "",
    "### Product Hunt",
    content.producthunt || "",
    "",
    "### X/Twitter Thread",
    content.xthread || "",
    "",
    "### Video Script",
    content.video || "",
    "",
    "## Critique Scores"
  ];

  CHANNELS.forEach((channel) => {
    const critique = critiques?.[channel];
    if (!critique) return;
    lines.push(`- ${channel}: ${critique.score || 0}/10`);
    if (critique.verdict) lines.push(`  verdict: ${critique.verdict}`);
    if (critique.fix) lines.push(`  fix: ${critique.fix}`);
  });

  lines.push("", "## 7-Day Launch Calendar");
  (calendar?.days || []).forEach((day) => {
    lines.push(`- ${day.day}: ${day.focus} - ${day.action}`);
  });

  if (calendar?.firstUserActions?.length) {
    lines.push("", "## Zero-Budget First User Actions");
    calendar.firstUserActions.forEach((action) => lines.push(`- ${action}`));
  }

  return lines.join("\n");
}

function getFriendlyErrorMessage(error) {
  const raw = error?.message || "Something broke mid-simulation.";
  const lower = raw.toLowerCase();

  if (lower.includes("failed to fetch") || lower.includes("networkerror")) {
    return "Network issue: LaunchTwin could not reach the API. Confirm the dev server is running and retry.";
  }
  if (lower.includes("429") || lower.includes("rate limit")) {
    return "Rate limit reached on the model. Wait 20-30 seconds and retry.";
  }
  if (lower.includes("401") || lower.includes("forbidden") || lower.includes("api key")) {
    return "API key issue: check GROQ_API_KEY in .env, restart the server, then retry.";
  }

  return raw;
}

export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | app
  const [form, setForm] = useState(null);
  const [stage, setStage] = useState("idle"); // idle | persona | scenes | content | calendar | done
  const [persona, setPersona] = useState(null);
  const [scenesRaw, setScenesRaw] = useState("");
  const [scenesStreaming, setScenesStreaming] = useState(false);
  const [content, setContent] = useState({});
  const [streamingChannel, setStreamingChannel] = useState(null);
  const [critiques, setCritiques] = useState({});
  const [calendar, setCalendar] = useState(null);
  const [error, setError] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");

  const stageProgress = useMemo(() => {
    const index = STAGE_ORDER.indexOf(stage);
    const activeIndex = index === -1 ? -1 : index;
    return STAGE_ORDER.map((step, idx) => ({
      key: step,
      done: activeIndex >= idx,
      active: activeIndex === idx
    }));
  }, [stage]);

  function notifyCopy(msg) {
    setCopyStatus(msg);
    setTimeout(() => setCopyStatus(""), 2200);
  }

  async function copyText(value, label) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      sfx.success();
      notifyCopy(`${label} copied.`);
    } catch {
      notifyCopy(`Could not copy ${label.toLowerCase()}.`);
    }
  }

  async function runPipeline(inputForm) {
    setForm(inputForm);
    setError(null);
    setCopyStatus("");
    setPersona(null);
    setScenesRaw("");
    setContent({});
    setCritiques({});
    setCalendar(null);

    try {
      // 1. Persona
      setStage("persona");
      const p = await api.generatePersona(inputForm);
      setPersona(p);

      // 2. Discovery scenes (streamed)
      setStage("scenes");
      setScenesStreaming(true);
      let scenesText = "";
      await api.generateScenes(
        {
          appName: inputForm.appName,
          appDescription: inputForm.appDescription,
          appCategory: inputForm.appCategory,
          keyFeatures: inputForm.keyFeatures,
          launchStage: inputForm.launchStage,
          persona: p
        },
        (_chunk, full) => {
          scenesText = full;
          setScenesRaw(full);
        }
      );
      setScenesStreaming(false);

      // 3. Content kit - generate each channel in sequence, streamed
      setStage("content");
      for (const channel of CHANNELS) {
        setStreamingChannel(channel);
        let channelText = "";
        await api.generateContent(
          {
            channel,
            appName: inputForm.appName,
            appDescription: inputForm.appDescription,
            appCategory: inputForm.appCategory,
            keyFeatures: inputForm.keyFeatures,
            launchStage: inputForm.launchStage,
            persona: p,
            tone: inputForm.tone,
            scenes: scenesText
          },
          (_chunk, full) => {
            channelText = full;
            setContent((prev) => ({ ...prev, [channel]: full }));
          }
        );

        // Keep critique in channel order for stable UX.
        try {
          const crit = await api.generateCritique({ persona: p, content: channelText, channel });
          setCritiques((prev) => ({ ...prev, [channel]: crit }));
        } catch {
          // non-fatal
        }
      }
      setStreamingChannel(null);

      // 4. Calendar
      setStage("calendar");
      const cal = await api.generateCalendar({
        appName: inputForm.appName,
        appDescription: inputForm.appDescription,
        appCategory: inputForm.appCategory,
        keyFeatures: inputForm.keyFeatures,
        launchStage: inputForm.launchStage,
        persona: p
      });
      setCalendar(cal);

      sfx.success();
      setStage("done");
    } catch (e) {
      console.error(e);
      setScenesStreaming(false);
      setStreamingChannel(null);
      setError(getFriendlyErrorMessage(e));
      setStage("idle");
    }
  }

  async function regeneratePersona() {
    if (!form) return;
    sfx.swap();
    setStage("persona");
    setScenesRaw("");
    setContent({});
    setCritiques({});
    setCalendar(null);
    setCopyStatus("");
    try {
      const p = await api.generatePersona(form);
      setPersona(p);
      setStage("idle");
    } catch (e) {
      setError(getFriendlyErrorMessage(e));
      setStage("idle");
    }
  }

  function exportCampaign() {
    const markdown = formatCampaignMarkdown({ form, persona, scenesRaw, content, critiques, calendar });
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form?.appName || "campaign").replace(/\s+/g, "-").toLowerCase()}-launchtwin.md`;
    a.click();
    URL.revokeObjectURL(url);
    sfx.success();
  }

  function loadSampleCampaign() {
    sfx.success();
    setScreen("app");
    setForm(sampleForm);
    setError(null);
    setCopyStatus("");
    setPersona(samplePersona);
    setScenesRaw(sampleScenes);
    setScenesStreaming(false);
    setContent(sampleContent);
    setCritiques(sampleCritiques);
    setCalendar(sampleCalendar);
    setStage("done");
  }

  async function regenerateContent(channel, extraInstruction = "") {
    if (!form || !persona) return;
    setStreamingChannel(channel);
    setError(null);
    setContent((prev) => ({ ...prev, [channel]: "" }));
    setCritiques((prev) => ({ ...prev, [channel]: null }));
    try {
      let channelText = "";
      await api.generateContent(
        {
          channel,
          appName: form.appName,
          appDescription: form.appDescription,
          appCategory: form.appCategory,
          keyFeatures: form.keyFeatures,
          launchStage: form.launchStage,
          persona,
          tone: form.tone,
          scenes: scenesRaw,
          extraInstruction
        },
        (_chunk, full) => {
          channelText = full;
          setContent((prev) => ({ ...prev, [channel]: full }));
        }
      );
      setStreamingChannel(null);
      const crit = await api.generateCritique({ persona, content: channelText, channel });
      setCritiques((prev) => ({ ...prev, [channel]: crit }));
    } catch (e) {
      setStreamingChannel(null);
      setError(getFriendlyErrorMessage(e));
    }
  }

  function applyCritiqueFix(channel) {
    const suggestion = critiques?.[channel]?.fix;
    if (!suggestion || suggestion.toLowerCase().startsWith("none")) return;
    regenerateContent(channel, `Incorporate this critique while keeping the original channel format: ${suggestion}`);
  }

  const busy = stage !== "idle" && stage !== "done";

  if (screen === "welcome") {
    return (
      <div className="min-h-screen pb-24">
        <div className="relative w-full overflow-hidden" style={{ minHeight: "560px" }}>
          <RetroScene className="absolute inset-0" />
          <div className="relative z-10">
            <Header />
            <main className="px-4 flex flex-col items-center gap-10 pb-10">
              <WelcomeScreen onStart={() => setScreen("app")} onSeeExample={loadSampleCampaign} />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <main className="px-4 flex flex-col items-center gap-10">
        <InputPanel onGenerate={runPipeline} loading={busy} />

        {error && (
          <div className="max-w-2xl w-full bg-bubble/10 border-2 border-bubble text-bubbleDeep font-body text-sm px-4 py-3">
            ⚠ {error}
          </div>
        )}

        {(busy || stage === "done") && (
          <div className="max-w-2xl w-full grid grid-cols-5 gap-2 -mt-4">
            {stageProgress.map((step, idx) => (
              <div
                key={step.key}
                className={`border-2 border-ink px-2 py-1 font-pixel text-[8px] text-center ${
                  step.active ? "bg-skyline text-white" : step.done ? "bg-mint text-ink" : "bg-white text-ink/50"
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        )}

        {busy && STAGE_LABELS[stage] && (
          <div className="max-w-2xl w-full flex items-center gap-2 -mt-6">
            <span className="w-2 h-2 bg-skyline border border-ink animate-pulse" />
            <span className="font-pixel text-[9px] text-skylineDeep">{STAGE_LABELS[stage]}</span>
          </div>
        )}

        {copyStatus && (
          <div className="max-w-2xl w-full text-right -mt-6">
            <span className="inline-block text-[10px] font-pixel text-mint bg-ink px-2 py-1">{copyStatus}</span>
          </div>
        )}

        {stage === "persona" && !persona && <Loader label="Building persona..." />}

        {persona && (
          <PersonaCard
            persona={persona}
            onRegenerate={stage === "done" ? regeneratePersona : null}
          />
        )}

        {(scenesRaw || stage === "scenes") && (
          <DiscoveryFeed rawText={scenesRaw} streaming={scenesStreaming} />
        )}

        {(Object.keys(content).length > 0 || stage === "content") && (
          <ContentTerminal
            content={content}
            critiques={critiques}
            streamingChannel={streamingChannel}
            onRegenerate={regenerateContent}
            onApplyFix={applyCritiqueFix}
            onCopy={(channel) => notifyCopy(`${channel} copied.`)}
          />
        )}

        {(calendar || stage === "calendar") && (
          <LaunchCalendar calendar={calendar} loading={stage === "calendar" && !calendar} />
        )}

        {stage === "done" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportCampaign}
              className="bg-mint border-[3px] border-ink font-pixel text-[10px] px-6 py-4 shadow-pixel active:translate-y-[2px] active:shadow-none transition-all"
            >
              ⬇ EXPORT FULL CAMPAIGN (.md)
            </button>
            <button
              onClick={() =>
                copyText(
                  formatCampaignMarkdown({ form, persona, scenesRaw, content, critiques, calendar }),
                  "Full campaign"
                )
              }
              className="bg-white border-[3px] border-ink font-pixel text-[10px] px-6 py-4 shadow-pixelSm active:translate-y-[2px] active:shadow-none transition-all"
            >
              ⧉ COPY CAMPAIGN
            </button>
            <button
              onClick={() => setScreen("welcome")}
              className="bg-white border-[3px] border-ink font-pixel text-[10px] px-6 py-4 shadow-pixelSm active:translate-y-[2px] active:shadow-none transition-all"
            >
              ← START OVER
            </button>
          </div>
        )}
      </main>

      <footer className="text-center mt-16 font-body text-xs text-ink/40">
        Built with Groq · Not affiliated with any app store · HackOnVibe 2026
      </footer>
    </div>
  );
}
