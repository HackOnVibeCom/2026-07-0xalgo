import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="w-full flex flex-col items-center text-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-3 bg-white border-[3px] border-ink shadow-pixel px-5 py-2 mb-5"
      >
        <span className="w-3 h-3 bg-bubble border-2 border-ink animate-blink" />
        <span className="font-pixel text-[10px] text-ink tracking-widest">
          PLAYER ONE: FOUND A NEW APP
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-pixel text-2xl sm:text-4xl leading-relaxed text-ink"
        style={{ textShadow: "3px 3px 0px rgba(255,255,255,0.9)" }}
      >
        LAUNCH<span className="text-bubble">TWIN</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-4 max-w-xl text-lg text-ink/70 font-body"
      >
        Meet the exact person who'll download your app —{" "}
        <span className="text-skylineDeep font-bold">then watch them market it for you.</span>
      </motion.p>
    </header>
  );
}
