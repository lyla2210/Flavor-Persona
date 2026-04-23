"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function CocktailCursor() {
  const x = useMotionValue(-120);
  const y = useMotionValue(-120);
  const rotate = useMotionValue(-14);
  const scale = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.35 });
  const springRotate = useSpring(rotate, { stiffness: 220, damping: 18, mass: 0.42 });
  const springScale = useSpring(scale, { stiffness: 260, damping: 20, mass: 0.42 });
  const liquidRotate = useTransform(springRotate, (value) => value * -0.38);
  const liquidShift = useTransform(springRotate, (value) => clamp(value * -0.18, -3.5, 3.5));

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");

    const updateEnabled = () => {
      setEnabled(mediaQuery.matches);
    };

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("has-cocktail-cursor");
      return;
    }

    document.body.classList.add("has-cocktail-cursor");

    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;

    const handleMove = (event: PointerEvent) => {
      const nextX = event.clientX + 18;
      const nextY = event.clientY + 18;
      const deltaX = hasMoved ? event.clientX - lastX : 0;
      const deltaY = hasMoved ? event.clientY - lastY : 0;

      hasMoved = true;
      lastX = event.clientX;
      lastY = event.clientY;

      x.set(nextX);
      y.set(nextY);
      rotate.set(clamp(-14 + deltaX * 0.7 + deltaY * 0.16, -30, 12));
      scale.set(1);
    };

    const handleLeave = () => {
      scale.set(0);
    };

    const handleEnter = () => {
      if (hasMoved) {
        scale.set(1);
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("pointerenter", handleEnter);

    return () => {
      document.body.classList.remove("has-cocktail-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("pointerenter", handleEnter);
    };
  }, [enabled, rotate, scale, x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      className="cocktail-cursor"
      aria-hidden="true"
      style={{ x: springX, y: springY, rotate: springRotate, scale: springScale }}
    >
      <div className="cocktail-cursor__bowl">
        <motion.div
          className="cocktail-cursor__liquid"
          style={{ rotate: liquidRotate, y: liquidShift }}
        />
        <div className="cocktail-cursor__shine" />
        <div className="cocktail-cursor__olive" />
        <div className="cocktail-cursor__straw" />
      </div>
      <div className="cocktail-cursor__stem" />
      <div className="cocktail-cursor__base" />
    </motion.div>
  );
}
