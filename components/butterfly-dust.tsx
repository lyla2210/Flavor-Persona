"use client";

import { motion } from "framer-motion";

export function ButterflyDust() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => {
        const size = 2 + (index % 3);
        const left = 8 + ((index * 13) % 84);
        const top = 10 + ((index * 17) % 76);
        const duration = 2.8 + (index % 5) * 0.7;

        return (
          <motion.span
            key={index}
            className="absolute rounded-full bg-amber-100/80 shadow-[0_0_12px_rgba(255,237,186,0.8)]"
            style={{ width: size, height: size, left: `${left}%`, top: `${top}%` }}
            animate={{
              opacity: [0.1, 0.95, 0.12],
              y: [0, -10, 8, 0],
              x: [0, 6, -4, 0],
              scale: [0.8, 1.4, 1, 0.8],
            }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: index * 0.08 }}
          />
        );
      })}
    </div>
  );
}
