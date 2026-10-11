"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Locale } from "@/lib/quiz-data";

type Props = {
  isActive: boolean;
  locale?: Locale;
};

export function PourTransition({ isActive, locale = "zh" }: Props) {
  const label = locale === "zh" ? "倾注中" : "POURING";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="pour-transition"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          <motion.div
            initial={{ y: "-132%", scaleX: 0.82 }}
            animate={{ y: "-10%", scaleX: 1 }}
            exit={{ y: "12%", opacity: 0 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="pour-stream"
          />

          <motion.div
            initial={{ scaleY: 0.02 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 1.02 }}
            transition={{ duration: 0.92, ease: [0.2, 0.9, 0.22, 1] }}
            className="pour-fill"
          >
            <motion.div
              className="pour-surface"
              animate={{ x: [0, 14, -10, 0], scaleX: [1, 1.05, 0.97, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pour-foam foam-left"
              animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pour-foam foam-right"
              animate={{ y: [0, -14, 0], x: [0, -12, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.24, delay: 0.28 }}
            className="pour-text"
          >
            {label}
          </motion.div>

          <motion.span
            className="pour-drop drop-one"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-30, 180, 420, 620], x: [0, -24, -12, -30] }}
            transition={{ duration: 0.9, ease: "easeIn", times: [0, 0.12, 0.6, 1] }}
          />
          <motion.span
            className="pour-drop drop-two"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-20, 200, 430, 640], x: [0, 18, 36, 22] }}
            transition={{ duration: 1.02, ease: "easeIn", delay: 0.08, times: [0, 0.12, 0.62, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
