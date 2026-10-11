"use client";

import { motion } from "framer-motion";

type AuraScore = {
  warm: number;
  cool: number;
  dreamy: number;
  earthy: number;
  gold: number;
  violet: number;
};

type Props = {
  progress: number;
  aura: AuraScore;
};

function buildGradient(progress: number, aura: AuraScore) {
  const warm = 18 + aura.warm * 8;
  const cool = 16 + aura.cool * 7;
  const dreamy = 20 + aura.dreamy * 7;
  const earthy = 14 + aura.earthy * 6;
  const gold = 16 + aura.gold * 7;
  const violet = 16 + aura.violet * 7;

  return `
    radial-gradient(circle at ${20 + progress * 40}% ${18 + progress * 20}%, rgba(255, 176, 139, ${Math.min(0.34, warm / 100)}), transparent 30%),
    radial-gradient(circle at ${78 - progress * 18}% 16%, rgba(128, 108, 235, ${Math.min(0.34, violet / 100)}), transparent 28%),
    radial-gradient(circle at 50% ${72 - progress * 18}%, rgba(255, 214, 160, ${Math.min(0.3, gold / 100)}), transparent 30%),
    radial-gradient(circle at 18% 76%, rgba(247, 127, 112, ${Math.min(0.28, warm / 100)}), transparent 24%),
    radial-gradient(circle at 84% 72%, rgba(125, 197, 224, ${Math.min(0.24, cool / 100)}), transparent 26%),
    linear-gradient(135deg, rgba(24, 18, 34, 1), rgba(38, 22, 47, ${0.82 + dreamy / 200}), rgba(28, 22, 30, ${0.9 + earthy / 300}))
  `;
}

export function LiquidBackdrop({ progress, aura }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-12%] blur-3xl"
        animate={{
          background: buildGradient(progress, aura),
          transform: [
            "scale(1) rotate(0deg)",
            "scale(1.08) rotate(4deg)",
            "scale(1.03) rotate(-3deg)",
            "scale(1) rotate(0deg)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-10%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-white/10 blur-[120px]"
        animate={{ x: [0, 80, -30, 0], y: [0, 40, 80, 0], scale: [1, 1.18, 0.92, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8%] right-[-6%] h-[26rem] w-[26rem] rounded-full bg-amber-100/10 blur-[120px]"
        animate={{ x: [0, -90, 20, 0], y: [0, -60, -20, 0], scale: [1, 0.94, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_28%),linear-gradient(to_bottom,transparent,rgba(7,5,12,0.46))]" />
    </div>
  );
}
