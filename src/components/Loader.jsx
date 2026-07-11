import React from "react";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 justify-center py-6">
      <span className="w-3 h-3 bg-bubble border-2 border-ink animate-bounce" />
      <span className="w-3 h-3 bg-skyline border-2 border-ink animate-bounce [animation-delay:0.15s]" />
      <span className="w-3 h-3 bg-sun border-2 border-ink animate-bounce [animation-delay:0.3s]" />
      <span className="font-pixel text-[10px] text-ink/60 ml-2">{label}</span>
    </div>
  );
}
