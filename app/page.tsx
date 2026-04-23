"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CocktailCursor } from "@/components/cocktail-cursor";
import { PourTransition } from "@/components/pour-transition";
import { Locale, Mbti, Pole, questions } from "@/lib/quiz-data";
import { AnswerRecord, computeMbti, shuffleQuestions } from "@/lib/quiz-logic";

type Stage = "intro" | "quiz" | "result";

type PendingAction =
  | { type: "start" }
  | { type: "advance"; nextAnswers: AnswerRecord; nextIndex: number }
  | { type: "result"; nextAnswers: AnswerRecord; nextResult: Mbti }
  | { type: "reset" };

const DEFAULT_BASE_MBTI: Mbti = "INFP";
const TRANSITION_COVER_MS = 720;
const TRANSITION_RELEASE_MS = 220;

const uiCopy = {
  zh: {
    brand: "Flavor Persona",
    homeTitle: "你的人格原液",
    homeBody:
      "我们将 16 种 MBTI 原型萃取为流动的液体，走进这间工坊，信任你的感官。让这一杯萃取液，揭示你生命最真实的底色。",
    start: "开始蒸馏 / Start",
    language: "语言 / Language",
    languageValue: "中文",
    progress: "题",
    tapToFlip: "点击翻开卡片",
    save: "save / 保存",
    retake: "re-brew / 再调一杯",
    loading: "正在调配中",
  },
  en: {
    brand: "Flavor Persona",
    homeTitle: "Your Personality Elixir",
    homeBody:
      "We distill the 16 MBTI archetypes into flowing flavor. Step into the atelier, trust your senses, and let this one glass reveal the truest undertone of your nature.",
    start: "Start / 开始蒸馏",
    language: "Language / 语言",
    languageValue: "English",
    progress: "Question",
    tapToFlip: "Tap To Reveal",
    save: "save / 保存",
    retake: "re-brew / 再调一杯",
    loading: "Distilling",
  },
} as const;

export default function HomePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [locale, setLocale] = useState<Locale>("zh");
  const [isPouring, setIsPouring] = useState(false);
  const [deck, setDeck] = useState(() => shuffleQuestions(questions));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [result, setResult] = useState<Mbti | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isStartHovered, setIsStartHovered] = useState(false);
  const releaseTimerRef = useRef<number | null>(null);
  const coverTimerRef = useRef<number | null>(null);
  const transitionLockRef = useRef(false);

  const copy = uiCopy[locale];
  const total = deck.length;
  const current = deck[index];
  const isTransitioning = isPouring || pendingAction !== null;

  const toggleLocale = () => {
    if (isTransitioning) return;
    setLocale((value) => (value === "zh" ? "en" : "zh"));
  };

  const releaseTransition = () => {
    transitionLockRef.current = false;
    setPendingAction(null);
    setIsPouring(false);
  };

  const runTransition = (action: PendingAction) => {
    if (transitionLockRef.current) return;
    transitionLockRef.current = true;
    setPendingAction(action);
    setIsPouring(true);
  };

  useEffect(() => {
    if (!pendingAction || !isPouring) return;

    coverTimerRef.current = window.setTimeout(() => {
      if (pendingAction.type === "start") {
        setDeck(shuffleQuestions(questions));
        setAnswers({});
        setIndex(0);
        setResult(null);
        setIsFlipped(false);
        setStage("quiz");
      }

      if (pendingAction.type === "advance") {
        setAnswers(pendingAction.nextAnswers);
        setIndex(pendingAction.nextIndex);
      }

      if (pendingAction.type === "result") {
        setAnswers(pendingAction.nextAnswers);
        setResult(pendingAction.nextResult);
        setIsFlipped(false);
        setStage("result");
      }

      if (pendingAction.type === "reset") {
        setDeck(shuffleQuestions(questions));
        setAnswers({});
        setIndex(0);
        setResult(null);
        setIsFlipped(false);
        setStage("intro");
      }

      releaseTimerRef.current = window.setTimeout(() => {
        releaseTransition();
      }, TRANSITION_RELEASE_MS);
    }, TRANSITION_COVER_MS);

    return () => {
      if (coverTimerRef.current !== null) {
        window.clearTimeout(coverTimerRef.current);
        coverTimerRef.current = null;
      }

      if (releaseTimerRef.current !== null) {
        window.clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
    };
  }, [isPouring, pendingAction]);

  const handleStart = () => {
    runTransition({ type: "start" });
  };

  const choose = (pole: Pole) => {
    if (!current || transitionLockRef.current) return;

    const nextAnswers = { ...answers, [current.id]: pole };

    if (index === total - 1) {
      runTransition({
        type: "result",
        nextAnswers,
        nextResult: computeMbti(DEFAULT_BASE_MBTI, nextAnswers),
      });
      return;
    }

    runTransition({
      type: "advance",
      nextAnswers,
      nextIndex: index + 1,
    });
  };

  const saveCard = () => {
    if (!result || transitionLockRef.current) return;
    const link = document.createElement("a");
    link.href = `/assets/${result}.jpg`;
    link.download = `${result}.jpg`;
    link.click();
  };

  return (
    <main className="persona-shell">
      <CocktailCursor />
      <PourTransition isActive={isPouring} />

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="home-screen"
          >
            <div className="home-panel">
              <div className="home-orb orb-1" />
              <div className="home-orb orb-2" />
              <div className="home-orb orb-3" />
              <div className="home-orb orb-4" />
              <div className="home-orb orb-5" />
              <div className="home-orb orb-6" />
              <div className="home-orb orb-7" />

              <p className="home-brand">{copy.brand}</p>

              <div className="home-copy">
                <h1 className="home-title">{copy.homeTitle}</h1>
                <p className="home-description">{copy.homeBody}</p>
              </div>

              <div className="home-actions">
                <motion.button
                  type="button"
                  onClick={handleStart}
                  className={`pill-button start-button ${isStartHovered ? "is-hovered" : ""}`}
                  disabled={isTransitioning}
                  whileTap={{ scale: 0.985 }}
                  onHoverStart={() => setIsStartHovered(true)}
                  onHoverEnd={() => setIsStartHovered(false)}
                >
                  <span className="button-fizz fizz-left" />
                  <span className="button-fizz fizz-middle" />
                  <span className="button-fizz fizz-right" />
                  <span className="button-label">{copy.start}</span>
                </motion.button>

                <button type="button" onClick={toggleLocale} className="pill-button secondary-pill" disabled={isTransitioning}>
                  {copy.language}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "quiz" && current && (
          <motion.section
            key={`quiz-${current.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="quiz-screen"
          >
            <div className="quiz-wrap">
              <div className="quiz-topline">
                <p className="quiz-brand">{copy.brand}</p>
                <button type="button" className="quiz-locale" onClick={toggleLocale} disabled={isTransitioning}>
                  {copy.languageValue}
                </button>
              </div>

              <div className="quiz-panel">
                <div className="quiz-progress-row">
                  <p className="quiz-step">
                    {copy.progress} {index + 1} / {total}
                  </p>
                  <div className="quiz-progress-track">
                    <motion.div
                      className="quiz-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${((index + 1) / total) * 100}%` }}
                      transition={{ duration: 0.42, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="quiz-copy">
                  <p className="quiz-category">{current.prompt[locale]}</p>
                  <h2 className="quiz-scene">{current.scene[locale]}</h2>
                </div>

                <div className="quiz-options">
                  {current.options.map((opt) => (
                    <motion.button
                      key={opt.key}
                      type="button"
                      onClick={() => choose(opt.pole)}
                      className="option-card"
                      disabled={isTransitioning}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="option-key">{opt.key}</span>
                      <span className="option-text">{opt.text[locale]}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "result" && result && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="result-screen"
          >
            <div className="result-wrap">
              <p className="result-type-label">{result}</p>

              <div className={`result-card-stage ${isFlipped ? "is-flipped" : ""}`}>
                <motion.div
                  className="result-glow"
                  animate={
                    isFlipped
                      ? { opacity: 0, scale: 1 }
                      : { opacity: [0.38, 0.62, 0.38], scale: [0.98, 1.02, 0.98] }
                  }
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />

                <button
                  type="button"
                  className={`flip-card ${isFlipped ? "is-flipped" : ""}`}
                  onClick={() => {
                    if (isTransitioning) return;
                    setIsFlipped((value) => !value);
                  }}
                  disabled={isTransitioning}
                  aria-label={copy.tapToFlip}
                >
                  <div className="flip-face flip-face-back">
                    <span className="flip-face-kicker">{copy.brand}</span>
                    <span className="flip-face-type">{result}</span>
                    <span className="flip-face-label">{copy.tapToFlip}</span>
                  </div>

                  <div className="flip-face flip-face-front">
                    <Image
                      src={`/assets/${result}.jpg`}
                      alt={`${result} flavor persona`}
                      width={750}
                      height={1783}
                      unoptimized
                      className="result-image"
                      priority
                    />
                  </div>
                </button>
              </div>

              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    key="result-actions"
                    className="result-actions"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    <button type="button" onClick={saveCard} className="pill-button interactive-pill save-button">
                      <span className="button-fizz fizz-left" />
                      <span className="button-fizz fizz-middle" />
                      <span className="button-fizz fizz-right" />
                      <span className="button-label">{copy.save}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => runTransition({ type: "reset" })}
                      className="pill-button interactive-pill secondary-pill save-button"
                    >
                      <span className="button-fizz fizz-left" />
                      <span className="button-fizz fizz-middle" />
                      <span className="button-fizz fizz-right" />
                      <span className="button-label">{copy.retake}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
