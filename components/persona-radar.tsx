"use client";

import { motion } from "framer-motion";
import { labelPole } from "@/lib/persona-copy";
import { Locale } from "@/lib/quiz-data";
import { AxisScore } from "@/lib/quiz-logic";

type PersonaRadarProps = {
  axes: AxisScore[];
  title: string;
  locale: Locale;
};

const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_R = 96;
const LEVELS = [0.25, 0.5, 0.75, 1];

function polarPoint(index: number, total: number, radius: number) {
  const angle = (-Math.PI / 2) + (index * (Math.PI * 2)) / total;
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  };
}

function polygonPath(radii: number[]) {
  return radii
    .map((radius, index) => {
      const point = polarPoint(index, radii.length, radius);
      return `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
    })
    .join(" ")
    .concat(" Z");
}

export function PersonaRadar({ axes, title, locale }: PersonaRadarProps) {
  const values = axes.map((axis) => {
    // Keep weak preferences visible; map 0.5–1 → 0.42–1
    return MAX_R * (0.42 + (axis.strength - 0.5) * 1.16);
  });

  const valuePath = polygonPath(values);
  const labelOffset = MAX_R + 34;

  return (
    <motion.div
      className="persona-radar"
      initial={{ opacity: 0, y: -18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="persona-radar__title">{title}</p>

      <svg className="persona-radar__svg" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={title}>
        {LEVELS.map((level) => (
          <motion.path
            key={level}
            d={polygonPath(Array(axes.length).fill(MAX_R * level))}
            className="persona-radar__grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 + level * 0.12, duration: 0.35 }}
          />
        ))}

        {axes.map((_, index) => {
          const tip = polarPoint(index, axes.length, MAX_R);
          return (
            <line
              key={`axis-${index}`}
              x1={CENTER}
              y1={CENTER}
              x2={tip.x}
              y2={tip.y}
              className="persona-radar__spoke"
            />
          );
        })}

        <motion.path
          d={valuePath}
          className="persona-radar__fill"
          initial={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.28, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />

        <motion.path
          d={valuePath}
          className="persona-radar__stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.9, ease: "easeOut" }}
        />

        {axes.map((axis, index) => {
          const point = polarPoint(index, axes.length, values[index]);
          return (
            <motion.circle
              key={`dot-${axis.dimension}`}
              cx={point.x}
              cy={point.y}
              r={4.5}
              className="persona-radar__dot"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.45 + index * 0.08, type: "spring", stiffness: 260, damping: 18 }}
            />
          );
        })}

        {axes.map((axis, index) => {
          const label = polarPoint(index, axes.length, labelOffset);
          const leftActive = axis.preferred === axis.left;

          return (
            <motion.g
              key={`label-${axis.dimension}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.07, duration: 0.35 }}
            >
              <text x={label.x} y={label.y - 4} textAnchor="middle" className="persona-radar__label">
                {labelPole(axis.preferred, locale)} {axis.percent}%
              </text>
              <text x={label.x} y={label.y + 14} textAnchor="middle" className="persona-radar__sublabel">
                <tspan className={leftActive ? "is-active" : "persona-radar__sublabel-mute"}>{axis.left}</tspan>
                <tspan className="persona-radar__sublabel-mute"> / </tspan>
                <tspan className={!leftActive ? "is-active" : "persona-radar__sublabel-mute"}>{axis.right}</tspan>
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="persona-radar__legend">
        {axes.map((axis, index) => (
          <motion.span
            key={axis.dimension}
            className="persona-radar__chip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62 + index * 0.06 }}
          >
            <strong>
              {axis.preferred} · {labelPole(axis.preferred, locale)}
            </strong>
            <em>
              {axis.leftCount}:{axis.rightCount}
            </em>
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
