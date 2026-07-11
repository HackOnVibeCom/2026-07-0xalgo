import React from "react";
import { motion } from "framer-motion";
import PixelAvatar from "./PixelAvatar.jsx";

export default function PersonaCard({ persona, onRegenerate, altLabel }) {
  if (!persona) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: -1 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 16 }}
      className="relative bg-white border-[3px] border-ink shadow-pixelLg p-6 w-full max-w-md mx-auto"
    >
      <div className="absolute -top-4 -right-3 bg-mint border-[3px] border-ink px-3 py-1 font-pixel text-[9px] rotate-3">
        {altLabel || "PLAYER CARD"}
      </div>

      <div className="flex items-start gap-4">
        <PixelAvatar seed={persona.name + persona.role} size={84} />
        <div className="flex-1 min-w-0">
          <h3 className="font-pixel text-sm text-ink leading-relaxed">{persona.name}</h3>
          <p className="font-body text-sm text-ink/60 mt-1">
            {persona.age} · {persona.role}
          </p>
        </div>
      </div>

      <div className="mt-4 font-body text-sm text-ink/80 leading-relaxed">
        {persona.dailyRoutine}
      </div>

      <div className="mt-3 bg-grid border-2 border-ink p-3">
        <p className="font-body text-xs font-bold uppercase text-bubbleDeep mb-1">
          Frustration this app solves
        </p>
        <p className="font-body text-sm text-ink/80">{persona.frustration}</p>
      </div>

      <div className="mt-3">
        <p className="font-body text-xs font-bold uppercase text-ink/50 mb-1.5">
          Hangs out on
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(persona.platforms || []).map((p) => (
            <span
              key={p}
              className="text-xs font-body font-bold bg-skyline/10 text-skylineDeep border border-skyline px-2 py-0.5"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-body text-xs font-bold uppercase text-ink/50">
            Scroll-Stop Power
          </span>
          <span className="font-pixel text-[10px] text-bubbleDeep">
            {persona.scrollStopPower}/10
          </span>
        </div>
        <div className="h-3 bg-grid border-2 border-ink">
          <div
            className="h-full bg-bubble"
            style={{ width: `${(persona.scrollStopPower || 0) * 10}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(persona.traits || []).map((t) => (
          <span
            key={t}
            className="text-[10px] font-pixel px-2 py-1 bg-sun border-2 border-ink"
          >
            {t}
          </span>
        ))}
      </div>

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="mt-5 w-full border-2 border-ink bg-white font-body text-xs font-bold uppercase py-2 active:translate-y-[2px] transition-transform"
        >
          ⟳ Generate alternate persona
        </button>
      )}
    </motion.div>
  );
}
