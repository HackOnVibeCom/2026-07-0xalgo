import React, { useState } from "react";
import { sfx } from "../lib/sound.js";

const TONES = ["Authentic", "Hype", "Professional", "Playful"];
const LAUNCH_STAGES = ["Pre-launch", "Just launched", "Early users"];

function normalizeFeatures(value) {
  return value
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export default function InputPanel({ onGenerate, loading }) {
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appLink, setAppLink] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [tone, setTone] = useState("Authentic");
  const [appCategory, setAppCategory] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [launchStage, setLaunchStage] = useState("Just launched");

  const canSubmit =
    appName.trim() && appDescription.trim() && targetUser.trim() && appCategory.trim() && !loading;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    sfx.success();
    onGenerate({
      appName,
      appDescription,
      appLink,
      targetUser,
      tone,
      appCategory,
      keyFeatures: normalizeFeatures(keyFeatures),
      launchStage
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-panel border-[3px] border-ink shadow-pixelLg p-6 sm:p-8 max-w-2xl w-full mx-auto"
    >
      <div className="absolute -top-4 left-6 bg-sun border-[3px] border-ink px-3 py-1 font-pixel text-[9px]">
        NEW GAME
      </div>

      <div className="grid gap-5 mt-3">
        <Field label="App name">
          <input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. DriftPlan"
            className="retro-input"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="App category">
            <input
              value={appCategory}
              onChange={(e) => setAppCategory(e.target.value)}
              placeholder="e.g. Education, Fitness, Productivity"
              className="retro-input"
            />
          </Field>

          <Field label="Launch stage">
            <select
              value={launchStage}
              onChange={(e) => setLaunchStage(e.target.value)}
              className="retro-input"
            >
              {LAUNCH_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="App Store / Play Store link (optional)">
          <input
            value={appLink}
            onChange={(e) => setAppLink(e.target.value)}
            placeholder="https://apps.apple.com/... (leave blank if unlisted)"
            className="retro-input"
          />
        </Field>

        <Field label="What does it do?">
          <textarea
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            placeholder="One or two sentences — what problem does it solve, and how?"
            rows={3}
            className="retro-input resize-none"
          />
        </Field>

        <Field label="Key features (comma-separated)">
          <input
            value={keyFeatures}
            onChange={(e) => setKeyFeatures(e.target.value)}
            placeholder="e.g. AI tutor chats, daily streaks, adaptive quizzes"
            className="retro-input"
          />
        </Field>

        <Field label="Who is this for?">
          <input
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            placeholder="e.g. busy parents who want quick healthy dinner ideas"
            className="retro-input"
          />
        </Field>

        <Field label="Tone">
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => {
                  sfx.click();
                  setTone(t);
                }}
                className={`px-3 py-1.5 border-2 border-ink font-body text-sm font-bold transition-transform active:translate-y-[2px] ${
                  tone === t ? "bg-skyline text-white shadow-pixelSm" : "bg-white text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-7 w-full bg-bubble disabled:bg-ink/20 disabled:cursor-not-allowed border-[3px] border-ink text-white font-pixel text-xs py-4 shadow-pixel active:translate-y-[3px] active:shadow-none transition-all"
      >
        {loading ? "SIMULATING..." : "▶ START CAMPAIGN"}
      </button>
      <p className="mt-3 text-xs text-ink/50 text-center font-body">
        Press start to generate persona, scenes, channel content, critiques, and a 7-day launch plan.
      </p>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block font-body text-xs font-bold uppercase tracking-wide text-ink/60 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
