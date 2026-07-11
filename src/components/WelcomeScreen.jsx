import React from "react";
import { motion } from "framer-motion";
import { sfx } from "../lib/sound.js";

const STEPS = [
  {
    icon: "🧑",
    title: "1. Persona",
    body: "AI invents one specific, believable target user — not a vague segment."
  },
  {
    icon: "🔍",
    title: "2. Simulation",
    body: "It simulates how that exact person stumbles onto your app in their day."
  },
  {
    icon: "📝",
    title: "3. Content",
    body: "Posts, launch copy, and a video script — written from what they'd actually notice."
  }
];

export default function WelcomeScreen({ onStart, onSeeExample }) {
  return (
    <div className="max-w-2xl w-full mx-auto flex flex-col items-center text-center gap-8 px-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/85 backdrop-blur-sm border-[3px] border-ink shadow-pixelLg p-6 sm:p-8 w-full"
      >
        <p className="font-body text-base sm:text-lg text-ink/80 leading-relaxed">
          Most launch tools write promo copy from{" "}
          <span className="font-bold text-bubbleDeep">your</span> point of view.
          <br />
          LaunchTwin writes it from{" "}
          <span className="font-bold text-skylineDeep">your user's.</span>
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          {STEPS.map((s) => (
            <motion.div
              key={s.title}
              whileHover={{ y: -4, rotate: -1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="bg-grid border-2 border-ink p-4 flex flex-col items-center gap-2 cursor-default"
            >
              <span className="text-2xl">{s.icon}</span>
              <p className="font-pixel text-[9px] text-ink">{s.title}</p>
              <p className="font-body text-xs text-ink/70 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-7">
          <button
            onClick={() => {
              sfx.success();
              onStart();
            }}
            className="flex-1 bg-bubble border-[3px] border-ink text-white font-pixel text-[10px] py-4 shadow-pixel active:translate-y-[3px] active:shadow-none transition-all"
          >
            ▶ NEW GAME
          </button>
          <button
            onClick={() => {
              sfx.click();
              onSeeExample();
            }}
            className="flex-1 bg-white border-[3px] border-ink text-ink font-pixel text-[10px] py-4 shadow-pixelSm active:translate-y-[2px] active:shadow-none transition-all"
          >
            👀 SEE EXAMPLE
          </button>
        </div>
        <p className="mt-3 text-xs text-ink/40 font-body">
          "See example" loads a pre-built sample campaign — no API calls, no waiting.
        </p>
        <p className="mt-4 font-pixel text-[8px] text-bubbleDeep animate-blink">
          ▸ INSERT COIN TO CONTINUE
        </p>
      </motion.div>
    </div>
  );
}
