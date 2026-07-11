import React from "react";
import { motion } from "framer-motion";

function scoreColor(score) {
  if (score >= 8) return "bg-mint";
  if (score >= 5) return "bg-sun";
  return "bg-bubble";
}

function scoreLabel(score) {
  if (score >= 8) return "Strong";
  if (score >= 5) return "Needs tuning";
  return "Weak fit";
}

function DimensionBar({ label, value }) {
  const safeValue = Math.max(0, Math.min(10, Number(value) || 0));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-body text-[11px] uppercase text-ink/50">{label}</span>
        <span className="font-pixel text-[9px] text-ink/60">{safeValue}/10</span>
      </div>
      <div className="h-2 bg-grid border border-ink/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue * 10}%` }}
          transition={{ duration: 0.45 }}
          className={`h-full ${scoreColor(safeValue)}`}
        />
      </div>
    </div>
  );
}

export default function CritiqueMeter({ critique, loading, onApplyFix }) {
  if (loading) {
    return (
      <p className="font-body text-xs text-ink/40 mt-3 animate-pulse">
        scoring against the persona's actual instincts...
      </p>
    );
  }
  if (!critique) return null;

  const score = Number(critique.score) || 0;
  const fix = critique.fix || "";
  const dimensions = critique.dimensions || {};

  return (
    <div className="mt-4 border-t-2 border-dashed border-ink/20 pt-3">
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="font-body text-xs font-bold uppercase text-ink/50">
          Would they actually share this?
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="font-pixel text-[10px]">{score}/10</span>
          <span className={`text-[10px] px-2 py-0.5 border border-ink font-pixel ${scoreColor(score)}`}>
            {scoreLabel(score)}
          </span>
        </span>
      </div>
      <div className="h-2.5 bg-grid border-2 border-ink mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(10, score)) * 10}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full ${scoreColor(score)}`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 mt-3">
        <DimensionBar label="Authenticity" value={dimensions.authenticity} />
        <DimensionBar label="Conversion" value={dimensions.conversionPotential} />
      </div>

      <p className="font-body text-xs text-ink/70 mt-3 italic">"{critique.verdict}"</p>
      {fix && <p className="font-body text-xs text-skylineDeep mt-1">💡 {fix}</p>}

      {fix && !fix.toLowerCase().startsWith("none") && (
        <button
          onClick={onApplyFix}
          className="mt-3 px-3 py-1.5 border-2 border-ink bg-white font-body text-xs font-bold active:translate-y-[2px] transition-transform"
        >
          ✦ Regenerate using this fix
        </button>
      )}
    </div>
  );
}
