import React from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "./DiscoveryFeed.jsx";

export default function LaunchCalendar({ calendar, loading }) {
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <SectionTitle>7-Day Launch Calendar</SectionTitle>
        <p className="font-body text-xs text-ink/40 animate-pulse">plotting the week...</p>
      </div>
    );
  }
  if (!calendar?.days?.length) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <SectionTitle>7-Day Launch Calendar</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-3">
        {calendar.days.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border-[3px] border-ink shadow-pixelSm p-4"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-pixel text-[9px] bg-bubble text-white px-2 py-1">{d.day}</span>
              <span className="font-body text-xs font-bold text-skylineDeep">{d.focus}</span>
            </div>
            <p className="font-body text-sm text-ink/70">{d.action}</p>
          </motion.div>
        ))}
      </div>

      {calendar.firstUserActions?.length > 0 && (
        <div className="mt-4 bg-grid border-[3px] border-ink p-4">
          <p className="font-pixel text-[9px] text-ink mb-2">ZERO-BUDGET FIRST-USER ACTIONS</p>
          <ul className="grid gap-1.5">
            {calendar.firstUserActions.map((action, index) => (
              <li key={`${action}-${index}`} className="font-body text-xs text-ink/80">
                • {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
