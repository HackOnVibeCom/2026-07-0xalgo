import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ICONS = ["📱", "💬", "🔍"];
const LABELS = ["Scene 1 — The Scroll", "Scene 2 — The Signal", "Scene 3 — The Moment"];

export default function DiscoveryFeed({ rawText, streaming }) {
  if (!rawText) return null;
  const scenes = rawText.split("---SCENE---").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <SectionTitle>Discovery Simulation</SectionTitle>
      <p className="font-body text-xs text-ink/40 -mt-3 mb-3">
        ⚠ Illustrative simulation — not real testimonials, reviews, or endorsements.
      </p>
      <div className="grid gap-4">
        <AnimatePresence>
          {scenes.map((scene, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white border-[3px] border-ink shadow-pixel p-5"
            >
              <div className="absolute -top-3 -left-3 w-9 h-9 flex items-center justify-center bg-sun border-[3px] border-ink text-lg">
                {ICONS[i % ICONS.length]}
              </div>
              <p className="font-pixel text-[9px] text-skylineDeep mb-2 ml-4">
                {LABELS[i % LABELS.length]}
              </p>
              <p className="font-body text-sm text-ink/80 leading-relaxed ml-4">
                {scene}
                {streaming && i === scenes.length - 1 && (
                  <span className="inline-block w-2 h-4 bg-ink ml-1 animate-blink align-middle" />
                )}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-3 h-3 bg-skyline border-2 border-ink" />
      <h2 className="font-pixel text-xs text-ink tracking-wide">{children}</h2>
      <span className="flex-1 h-[3px] bg-ink/10" />
    </div>
  );
}
