import { Locale, Mbti, Pole } from "@/lib/quiz-data";
import { AxisScore } from "@/lib/quiz-logic";

const poleLabel: Record<Pole, Record<Locale, string>> = {
  E: { zh: "外向", en: "Extravert" },
  I: { zh: "内向", en: "Introvert" },
  S: { zh: "实感", en: "Sensing" },
  N: { zh: "直觉", en: "Intuition" },
  T: { zh: "思考", en: "Thinking" },
  F: { zh: "情感", en: "Feeling" },
  J: { zh: "计划", en: "Judging" },
  P: { zh: "弹性", en: "Prospecting" },
};

const typeBlurb: Record<Mbti, Record<Locale, string>> = {
  INTJ: { zh: "冷静构局的深酿", en: "A cool, architectural distillate" },
  INTP: { zh: "好奇拆解的澄液", en: "A curious, clarifying draught" },
  ENTJ: { zh: "锋芒推进的烈酿", en: "A decisive, forward burn" },
  ENTP: { zh: "灵感跳跃的气泡", en: "A sparkling leap of ideas" },
  INFJ: { zh: "幽光洞察的夜酿", en: "A luminous night infusion" },
  INFP: { zh: "温柔诗意的原液", en: "A soft, poetic elixir" },
  ENFJ: { zh: "暖意引领的调和", en: "A warm, guiding blend" },
  ENFP: { zh: "明快绽放的花香", en: "A bright, blooming bouquet" },
  ISTJ: { zh: "稳笃可靠的陈酿", en: "A steady, time-honored reserve" },
  ISFJ: { zh: "细心守护的温汤", en: "A careful, comforting cup" },
  ESTJ: { zh: "条理分明的干邑", en: "A structured, clarifying pour" },
  ESFJ: { zh: "热络相待的蜜酿", en: "A hospitable honeyed pour" },
  ISTP: { zh: "利落机敏的冷萃", en: "A sharp, agile cold brew" },
  ISFP: { zh: "感官游走的柔液", en: "A sensory, wandering soft pour" },
  ESTP: { zh: "当场点燃的烈焰", en: "An in-the-moment blaze" },
  ESFP: { zh: "派对中央的甜火", en: "A sweet fire at the center" },
};

export function labelPole(pole: Pole, locale: Locale) {
  return poleLabel[pole][locale];
}

export function blurbForType(type: Mbti, locale: Locale) {
  return typeBlurb[type][locale];
}

export function buildShareText(type: Mbti, axes: AxisScore[], locale: Locale) {
  const radar = axes
    .map((axis) => `${labelPole(axis.preferred, locale)} ${axis.percent}%`)
    .join(locale === "zh" ? " · " : " · ");

  if (locale === "zh") {
    return [
      `我的 Flavor Persona 是 ${type}`,
      blurbForType(type, locale),
      `风味雷达：${radar}`,
      "来调一杯属于你的人格原液。",
    ].join("\n");
  }

  return [
    `My Flavor Persona is ${type}`,
    blurbForType(type, locale),
    `Flavor radar: ${radar}`,
    "Come distill your own personality elixir.",
  ].join("\n");
}
