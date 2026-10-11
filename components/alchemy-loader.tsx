"use client";

import { motion } from "framer-motion";

export function AlchemyLoader() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center">
      <div className="relative flex h-36 w-36 items-center justify-center">
        <motion.div
          className="absolute h-36 w-36 rounded-full border border-white/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute h-24 w-24 rounded-full border border-amber-200/40"
          animate={{ rotate: -360, scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-16 w-16 rounded-full bg-gradient-to-br from-amber-200/70 via-rose-200/60 to-violet-300/60 blur-sm"
          animate={{ scale: [0.92, 1.18, 0.92], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="space-y-2">
        <p className="font-serif text-2xl tracking-[0.18em] text-mist/90">正在为你调配灵魂原液...</p>
        <p className="text-sm uppercase tracking-[0.3em] text-white/45">ALCHEMIZING YOUR INNER ELIXIR</p>
      </div>
    </div>
  );
}
