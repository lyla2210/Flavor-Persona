import { Dimension, Mbti, Pole, Question } from "@/lib/quiz-data";

export type AnswerRecord = Record<number, Pole>;

export type AxisScore = {
  dimension: Dimension;
  left: Pole;
  right: Pole;
  leftCount: number;
  rightCount: number;
  preferred: Pole;
  /** Share of answers for the preferred pole, 0.5–1 */
  strength: number;
  /** Preferred share as 0–100 */
  percent: number;
};

const dimensionMap: Record<Question["dimension"], [Pole, Pole]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

const DIMENSIONS = ["EI", "SN", "TF", "JP"] as const;

export function shuffleQuestions<T>(items: T[]) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function computeDimensionScores(answers: AnswerRecord): AxisScore[] {
  return DIMENSIONS.map((dimension) => {
    const [left, right] = dimensionMap[dimension];
    const related = Object.values(answers).filter((value) => value === left || value === right);
    const leftCount = related.filter((value) => value === left).length;
    const rightCount = related.filter((value) => value === right).length;
    const total = leftCount + rightCount;
    const preferred = leftCount === rightCount ? left : leftCount > rightCount ? left : right;
    const preferredCount = total === 0 ? 0 : Math.max(leftCount, rightCount);
    const strength = total === 0 ? 0.5 : preferredCount / total;

    return {
      dimension,
      left,
      right,
      leftCount,
      rightCount,
      preferred,
      strength,
      percent: Math.round(strength * 100),
    };
  });
}

export function computeMbti(baseMbti: Mbti, answers: AnswerRecord) {
  const chars = baseMbti.split("") as Pole[];
  const scores = computeDimensionScores(answers);

  scores.forEach((score, index) => {
    if (score.leftCount === score.rightCount) return;
    chars[index] = score.preferred;
  });

  return chars.join("") as Mbti;
}

export function buildAura(answers: AnswerRecord) {
  const score = {
    warm: 0,
    cool: 0,
    dreamy: 0,
    earthy: 0,
    gold: 0,
    violet: 0,
  };

  Object.entries(answers).forEach(([id, pole]) => {
    const num = Number(id);
    if ([4, 5, 6].includes(num) && pole === "N") score.dreamy += 2;
    if ([7, 8, 9].includes(num) && pole === "F") score.warm += 2;
    if ([1, 2, 3].includes(num) && pole === "I") score.cool += 1;
    if ([1, 2, 3].includes(num) && pole === "E") score.gold += 1;
    if ([4, 5, 6].includes(num) && pole === "S") score.earthy += 1;
    if ([7, 8, 9].includes(num) && pole === "T") score.violet += 1;
  });

  return score;
}

export function hasSpecialToken(answers: AnswerRecord, token: "watch" | "butterfly") {
  const target = answers[9];
  if (token === "watch") return target === "T";
  return target === "F";
}
