import React, { useState } from "react";
import { SectionTitle } from "./DiscoveryFeed.jsx";
import CritiqueMeter from "./CritiqueMeter.jsx";
import { sfx } from "../lib/sound.js";

const TABS = [
  { key: "reddit", label: "Reddit Post", icon: "👽" },
  { key: "producthunt", label: "Product Hunt", icon: "🐱" },
  { key: "xthread", label: "X/Twitter Thread", icon: "🧵" },
  { key: "video", label: "Video Script", icon: "🎬" }
];

export default function ContentTerminal({
  content,
  critiques,
  streamingChannel,
  onCopy,
  onRegenerate,
  onApplyFix
}) {
  const [active, setActive] = useState("reddit");
  const text = content[active] || "";
  const isStreaming = streamingChannel === active;

  function speak() {
    if (!text) return;
    sfx.click();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      sfx.success();
      onCopy?.(active);
    } catch {
      onCopy?.("Copy failed");
    }
  }

  function regenerate() {
    if (isStreaming) return;
    sfx.swap();
    onRegenerate?.(active);
  }

  function applyFix() {
    if (isStreaming) return;
    sfx.swap();
    onApplyFix?.(active);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <SectionTitle>Content Kit</SectionTitle>

      <div className="flex gap-2 mb-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              sfx.swap();
              setActive(tab.key);
            }}
            className={`px-3 py-1.5 border-2 border-ink font-body text-xs font-bold flex items-center gap-1.5 transition-transform active:translate-y-[2px] ${
              active === tab.key ? "bg-skyline text-white shadow-pixelSm" : "bg-white text-ink"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {content[tab.key] && tab.key !== active && <span className="w-1.5 h-1.5 rounded-full bg-mint" />}
          </button>
        ))}
      </div>

      <div className="relative bg-ink text-mint border-[3px] border-ink shadow-pixel p-5 crt overflow-hidden">
        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-mint/20">
          <span className="w-2.5 h-2.5 rounded-full bg-bubble" />
          <span className="w-2.5 h-2.5 rounded-full bg-sun" />
          <span className="w-2.5 h-2.5 rounded-full bg-mint" />
          <span className="ml-2 font-body text-xs text-mint/60">launchtwin://{active}.txt</span>
        </div>

        <pre className="font-mono text-[15px] leading-relaxed whitespace-pre-wrap min-h-[120px] max-h-72 overflow-y-auto retro-scrollbar">
          {text || (isStreaming ? "" : "// waiting to generate...")}
          {isStreaming && <span className="inline-block w-2 h-4 bg-mint ml-0.5 animate-blink align-middle" />}
        </pre>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={copy}
            disabled={!text}
            className="px-3 py-1.5 bg-white text-ink border-2 border-mint font-body text-xs font-bold disabled:opacity-30 active:translate-y-[2px] transition-transform"
          >
            ⧉ Copy
          </button>
          <button
            onClick={regenerate}
            disabled={!text || isStreaming}
            className="px-3 py-1.5 bg-white text-ink border-2 border-mint font-body text-xs font-bold disabled:opacity-30 active:translate-y-[2px] transition-transform"
          >
            ⟳ Regenerate
          </button>
          <button
            onClick={applyFix}
            disabled={!text || isStreaming || !critiques?.[active]?.fix || critiques?.[active]?.fix?.toLowerCase?.().startsWith("none")}
            className="px-3 py-1.5 bg-white text-ink border-2 border-mint font-body text-xs font-bold disabled:opacity-30 active:translate-y-[2px] transition-transform"
          >
            ✦ Apply Fix
          </button>
          {active === "video" && (
            <button
              onClick={speak}
              disabled={!text}
              className="px-3 py-1.5 bg-white text-ink border-2 border-mint font-body text-xs font-bold disabled:opacity-30 active:translate-y-[2px] transition-transform"
            >
              ▶ Read aloud
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border-[3px] border-t-0 border-ink p-4">
        <CritiqueMeter
          critique={critiques[active]}
          loading={isStreaming || (text && !critiques[active])}
          onApplyFix={() => onApplyFix?.(active)}
        />
      </div>
    </div>
  );
}
