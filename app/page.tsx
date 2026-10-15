"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CocktailCursor } from "@/components/cocktail-cursor";
import { PersonaRadar } from "@/components/persona-radar";
import { PourTransition } from "@/components/pour-transition";
import {
  clearLicenseUnlock,
  getUnlockedCode,
  isLicenseUnlocked,
  redeemLicenseCode,
} from "@/lib/license";
import { blurbForType, buildShareText } from "@/lib/persona-copy";
import { Locale, Mbti, Pole, questions } from "@/lib/quiz-data";
import { AnswerRecord, computeDimensionScores, computeMbti, shuffleQuestions } from "@/lib/quiz-logic";
import { sounds } from "@/lib/sounds";

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
    tapToFlipBack: "再次点击收起",
    radarTitle: "风味雷达",
    save: "save / 保存",
    share: "share / 分享文案",
    shared: "文案已复制，可贴到小红书",
    saved: "卡片已开始下载",
    retake: "re-brew / 再调一杯",
    loading: "正在调配中",
    licenseLabel: "授权码",
    licensePlaceholder: "输入购买后收到的授权码",
    licenseUnlock: "解锁工坊",
    licenseHint: "购买后卖家会发给你一串码，输入即可解锁（可反复使用）",
    licenseUnlocked: "已解锁，可以开始蒸馏",
    licenseClear: "清除授权",
    licenseEmpty: "请先输入授权码",
    licenseInvalid: "授权码无效，请核对后重试",
    licenseNetwork: "网络异常，请稍后重试",
    licenseUnconfigured: "服务端未配置授权码，请在 Vercel 添加 LICENSE_SECRET 后重新部署",
    licenseChecking: "校验中…",
    soundOn: "音效开",
    soundOff: "音效关",
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
    tapToFlipBack: "Tap again to fold",
    radarTitle: "Flavor Radar",
    save: "save / 保存",
    share: "share / copy caption",
    shared: "Caption copied — paste anywhere",
    saved: "Card download started",
    retake: "re-brew / 再调一杯",
    loading: "Distilling",
    licenseLabel: "Access code",
    licensePlaceholder: "Enter the code from your order",
    licenseUnlock: "Unlock atelier",
    licenseHint: "Enter the reusable code from your seller to unlock",
    licenseUnlocked: "Unlocked — you can start distilling",
    licenseClear: "Clear unlock",
    licenseEmpty: "Please enter an access code",
    licenseInvalid: "Invalid code — please check and try again",
    licenseNetwork: "Network error — please try again",
    licenseUnconfigured: "Server has no LICENSE_SECRET — add it in Vercel and redeploy",
    licenseChecking: "Checking…",
    soundOn: "Sound on",
    soundOff: "Sound off",
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
  const [unlocked, setUnlocked] = useState(false);
  const [unlockedCode, setUnlockedCode] = useState<string | null>(null);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [isCheckingLicense, setIsCheckingLicense] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [selectedKey, setSelectedKey] = useState<"A" | "B" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const releaseTimerRef = useRef<number | null>(null);
  const coverTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const transitionLockRef = useRef(false);

  const copy = uiCopy[locale];
  const total = deck.length;
  const current = deck[index];
  const isTransitioning = isPouring || pendingAction !== null;
  const radarAxes = computeDimensionScores(answers);

  useEffect(() => {
    setUnlocked(isLicenseUnlocked());
    setUnlockedCode(getUnlockedCode());
    setSoundMuted(sounds.isMuted());
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2200);
  };

  const pulse = (pattern: number | number[] = 12) => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  };

  const toggleLocale = () => {
    if (isTransitioning) return;
    void sounds.unlock();
    sounds.play("soft");
    setLocale((value) => (value === "zh" ? "en" : "zh"));
  };

  const toggleSound = () => {
    void sounds.unlock();
    const next = sounds.toggleMuted();
    setSoundMuted(next);
    if (!next) sounds.play("soft");
  };

  const licenseErrorMessage = (reason: "empty" | "invalid" | "network" | "unconfigured") => {
    if (reason === "empty") return copy.licenseEmpty;
    if (reason === "network") return copy.licenseNetwork;
    if (reason === "unconfigured") return copy.licenseUnconfigured;
    return copy.licenseInvalid;
  };

  const handleUnlock = async (event?: FormEvent) => {
    event?.preventDefault();
    if (isTransitioning || isCheckingLicense) return;

    void sounds.unlock();
    setIsCheckingLicense(true);
    setLicenseError(null);

    const result = await redeemLicenseCode(licenseInput);
    setIsCheckingLicense(false);

    if (!result.ok) {
      sounds.play("error");
      setLicenseError(licenseErrorMessage(result.reason));
      return;
    }

    sounds.play("unlock");
    setLicenseInput("");
    setUnlocked(true);
    setUnlockedCode(result.code);
  };

  const handleClearLicense = () => {
    if (isTransitioning) return;
    sounds.play("soft");
    clearLicenseUnlock();
    setUnlocked(false);
    setUnlockedCode(null);
    setLicenseError(null);
  };

  const releaseTransition = () => {
    transitionLockRef.current = false;
    setPendingAction(null);
    setIsPouring(false);
  };

  const runTransition = (action: PendingAction) => {
    if (transitionLockRef.current) return;
    transitionLockRef.current = true;
    void sounds.unlock();
    sounds.play("pour");
    pulse([10, 30, 14]);
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
        setSelectedKey(null);
        setStage("quiz");
      }

      if (pendingAction.type === "advance") {
        setAnswers(pendingAction.nextAnswers);
        setIndex(pendingAction.nextIndex);
        setSelectedKey(null);
      }

      if (pendingAction.type === "result") {
        setAnswers(pendingAction.nextAnswers);
        setResult(pendingAction.nextResult);
        setIsFlipped(false);
        setSelectedKey(null);
        setStage("result");
      }

      if (pendingAction.type === "reset") {
        setDeck(shuffleQuestions(questions));
        setAnswers({});
        setIndex(0);
        setResult(null);
        setIsFlipped(false);
        setSelectedKey(null);
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
    if (!unlocked) return;
    runTransition({ type: "start" });
  };

  const choose = (pole: Pole, key: "A" | "B") => {
    if (!current || transitionLockRef.current || selectedKey) return;

    sounds.play("tap");
    pulse(8);
    setSelectedKey(key);
    const nextAnswers = { ...answers, [current.id]: pole };
    const isLast = index === total - 1;

    window.setTimeout(() => {
      if (isLast) {
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
    }, 160);
  };

  const saveCard = () => {
    if (!result || transitionLockRef.current) return;
    sounds.play("save");
    pulse(10);
    const link = document.createElement("a");
    link.href = `/assets/${result}.jpg`;
    link.download = `${result}.jpg`;
    link.click();
    showToast(copy.saved);
  };

  const shareResult = async () => {
    if (!result) return;
    const text = buildShareText(result, radarAxes, locale);
    sounds.play("soft");

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: `Flavor Persona · ${result}`, text });
        showToast(copy.shared);
        return;
      }
    } catch {
      // Fall through to clipboard when share is cancelled or unsupported.
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast(copy.shared);
    } catch {
      showToast(copy.shared);
    }
  };

  const handleFlipCard = () => {
    if (isTransitioning) return;
    const next = !isFlipped;
    sounds.play("flip");
    pulse(next ? [8, 20, 12] : 8);
    setIsFlipped(next);
    if (next) {
      window.setTimeout(() => sounds.play("reveal"), 420);
    }
  };

  return (
    <main className="persona-shell">
      <CocktailCursor />
      <PourTransition isActive={isPouring} locale={locale} />

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            className="persona-toast"
            initial={{ opacity: 0, y: 16, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            transition={{ duration: 0.28 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={`sound-toggle ${soundMuted ? "is-muted" : ""}`}
        onClick={toggleSound}
        aria-pressed={!soundMuted}
        aria-label={soundMuted ? copy.soundOff : copy.soundOn}
      >
        <span className="sound-toggle__icon" aria-hidden="true">
          {soundMuted ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 10v4h3l4 3V7L7 10H4z" />
              <path d="M16 9l5 6M21 9l-5 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 10v4h3l4 3V7L7 10H4z" />
              <path d="M15.5 9.5a4 4 0 010 5" />
              <path d="M17.8 7a7 7 0 010 10" />
            </svg>
          )}
        </span>
        <span className="sound-toggle__label">{soundMuted ? copy.soundOff : copy.soundOn}</span>
      </button>

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
                {!unlocked ? (
                  <form className="license-gate" onSubmit={handleUnlock}>
                    <label className="license-label" htmlFor="license-code">
                      {copy.licenseLabel}
                    </label>
                    <input
                      id="license-code"
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      value={licenseInput}
                      onChange={(event) => {
                        setLicenseInput(event.target.value);
                        if (licenseError) setLicenseError(null);
                      }}
                      placeholder={copy.licensePlaceholder}
                      className="license-input"
                      disabled={isTransitioning || isCheckingLicense}
                    />
                    {licenseError && <p className="license-error">{licenseError}</p>}
                    <p className="license-hint">{copy.licenseHint}</p>
                    <motion.button
                      type="submit"
                      className="pill-button interactive-pill"
                      disabled={isTransitioning || isCheckingLicense}
                      whileTap={{ scale: 0.985 }}
                    >
                      <span className="button-fizz fizz-left" />
                      <span className="button-fizz fizz-middle" />
                      <span className="button-fizz fizz-right" />
                      <span className="button-label">
                        {isCheckingLicense ? copy.licenseChecking : copy.licenseUnlock}
                      </span>
                    </motion.button>
                  </form>
                ) : (
                  <>
                    <p className="license-status">
                      {copy.licenseUnlocked}
                      {unlockedCode ? ` · ${unlockedCode}` : ""}
                    </p>
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
                    <button
                      type="button"
                      onClick={handleClearLicense}
                      className="license-clear"
                      disabled={isTransitioning}
                    >
                      {copy.licenseClear}
                    </button>
                  </>
                )}

                <button type="button" onClick={toggleLocale} className="pill-button secondary-pill" disabled={isTransitioning}>
                  {copy.language}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "quiz" && current && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="quiz-screen"
          >
            <div className="quiz-wrap">
              <div className="quiz-topline">
                <motion.p
                  className="quiz-brand"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {copy.brand}
                </motion.p>
                <button type="button" className="quiz-locale" onClick={toggleLocale} disabled={isTransitioning}>
                  {copy.languageValue}
                </button>
              </div>

              <motion.div
                className="quiz-panel"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="quiz-progress-row">
                  <p className="quiz-step">
                    {copy.progress} {index + 1} / {total}
                  </p>
                  <div className="quiz-progress-track">
                    <motion.div
                      className="quiz-progress-fill"
                      initial={false}
                      animate={{ width: `${((index + 1) / total) * 100}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    className="quiz-body"
                    initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="quiz-copy">
                      <p className="quiz-category">{current.prompt[locale]}</p>
                      <h2 className="quiz-scene">{current.scene[locale]}</h2>
                    </div>

                    <div className="quiz-options">
                      {current.options.map((opt, optionIndex) => (
                        <motion.button
                          key={`${current.id}-${opt.key}`}
                          type="button"
                          onClick={() => choose(opt.pole, opt.key)}
                          className={`option-card ${selectedKey === opt.key ? "is-selected" : ""}`}
                          disabled={isTransitioning || selectedKey !== null}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{
                            opacity: selectedKey && selectedKey !== opt.key ? 0.45 : 1,
                            y: 0,
                            scale: selectedKey === opt.key ? 1.015 : 1,
                          }}
                          transition={{ delay: 0.08 + optionIndex * 0.07, duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={selectedKey ? undefined : { y: -4, scale: 1.01 }}
                          whileTap={selectedKey ? undefined : { scale: 0.985 }}
                        >
                          <span className="option-key">{opt.key}</span>
                          <span className="option-text">{opt.text[locale]}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.section>
        )}

        {stage === "result" && result && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`result-screen ${isFlipped ? "is-revealed" : ""}`}
          >
            <div className="result-wrap">
              <AnimatePresence mode="popLayout">
                {isFlipped && (
                  <PersonaRadar key="radar" axes={radarAxes} title={copy.radarTitle} locale={locale} />
                )}
              </AnimatePresence>

              <motion.div
                className="result-heading"
                animate={{ opacity: isFlipped ? 0.85 : 1, y: isFlipped ? -4 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="result-type-label">{result}</p>
                <p className="result-type-blurb">{blurbForType(result, locale)}</p>
              </motion.div>

              <motion.div
                className={`result-card-stage ${isFlipped ? "is-flipped" : ""}`}
                layout
                animate={{
                  scale: isFlipped ? 0.88 : 1,
                  y: isFlipped ? 8 : 0,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              >
                <motion.div
                  className="result-glow"
                  animate={
                    isFlipped
                      ? { opacity: 0.18, scale: 1.05 }
                      : { opacity: [0.38, 0.62, 0.38], scale: [0.98, 1.02, 0.98] }
                  }
                  transition={
                    isFlipped
                      ? { duration: 0.4 }
                      : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                  }
                />

                <motion.button
                  type="button"
                  className={`flip-card ${isFlipped ? "is-flipped" : ""}`}
                  onClick={handleFlipCard}
                  disabled={isTransitioning}
                  aria-label={isFlipped ? copy.tapToFlipBack : copy.tapToFlip}
                  whileHover={{ scale: isFlipped ? 1.01 : 1.015 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flip-face flip-face-back">
                    <motion.span
                      className="flip-face-kicker"
                      animate={{ opacity: [0.55, 1, 0.55] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {copy.brand}
                    </motion.span>
                    <span className="flip-face-type">{result}</span>
                    <motion.span
                      className="flip-face-label"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {copy.tapToFlip}
                    </motion.span>
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
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    key="result-actions"
                    className="result-actions"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.button
                      type="button"
                      onClick={saveCard}
                      className="pill-button interactive-pill save-button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <span className="button-fizz fizz-left" />
                      <span className="button-fizz fizz-middle" />
                      <span className="button-fizz fizz-right" />
                      <span className="button-label">{copy.save}</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => void shareResult()}
                      className="pill-button interactive-pill secondary-pill save-button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.34 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <span className="button-fizz fizz-left" />
                      <span className="button-fizz fizz-middle" />
                      <span className="button-fizz fizz-right" />
                      <span className="button-label">{copy.share}</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => runTransition({ type: "reset" })}
                      className="pill-button interactive-pill secondary-pill save-button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <span className="button-fizz fizz-left" />
                      <span className="button-fizz fizz-middle" />
                      <span className="button-fizz fizz-right" />
                      <span className="button-label">{copy.retake}</span>
                    </motion.button>
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
