import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FallingText from "../components/FallingText.jsx";
import HomeOrbitSection from "../components/HomeOrbitSection.jsx";
import PageShell from "../components/PageShell.jsx";
import ParticleText from "../components/ParticleText.jsx";

const hideMissingPortraitImage = (event) => {
  event.currentTarget.style.opacity = "0";
};

const ANCHOR_SCROLL_DURATION = 1450;
const INTRO_TITLE_PREFIX = "Hi 👋，我是";
const INTRO_TITLE_NAME = "Amber";
const INTRO_TITLE = `${INTRO_TITLE_PREFIX}${INTRO_TITLE_NAME}`;
const INTRO_TITLE_CHARACTERS = Array.from(INTRO_TITLE);
const INTRO_TITLE_PREFIX_LENGTH = Array.from(INTRO_TITLE_PREFIX).length;
const TYPEWRITER_START_DELAY = 260;
const TYPEWRITER_INTERVAL = 118;
const INTRO_REVEAL_TRANSITION = { duration: 0.58, ease: [0.21, 0.6, 0.35, 1] };
const fallingKeywords = [
  "AI-native UX",
  "UI Design",
  "Agent UX",
  "Product",
  "Interaction",
  "System",
  "Flow",
  "Prototype",
  "Data",
  "Motion",
  "Coding",
  "Strategy",
];
const easeInOutQuart = (value) =>
  value < 0.5 ? 8 * value * value * value * value : 1 - Math.pow(-2 * value + 2, 4) / 2;

export default function Home() {
  const portraitSrc = `${import.meta.env.BASE_URL}assets/amber-portrait.png`;
  const landingFlowRef = useRef(null);
  const cardAnchorRef = useRef(null);
  const portraitTargetRef = useRef(null);
  const introSectionRef = useRef(null);
  const scrollAnchorLockRef = useRef(false);
  const anchorCooldownUntilRef = useRef(0);
  const touchStartYRef = useRef(0);
  const motionTargetsRef = useRef({ x: 0, y: 0 });
  const [introScrollEnd, setIntroScrollEnd] = useState(1);
  const [hasIntroAnimationStarted, setHasIntroAnimationStarted] = useState(false);
  const [introTypedCount, setIntroTypedCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const isIntroTitleComplete = introTypedCount >= INTRO_TITLE_CHARACTERS.length;

  const measureMotionTargets = useCallback(() => {
    const anchor = cardAnchorRef.current;
    const target = portraitTargetRef.current;
    const intro = introSectionRef.current;
    if (!anchor || !target || !intro) return;

    const anchorRect = anchor.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const introRect = intro.getBoundingClientRect();
    const targetFinalTop = targetRect.top - introRect.top;
    const targetFinalLeft = targetRect.left;
    const nextIntroScrollEnd = Math.max(window.scrollY + introRect.top, 1);

    const nextMotionTargets = {
      x: targetFinalLeft - anchorRect.left,
      y: targetFinalTop - anchorRect.top,
    };

    motionTargetsRef.current = nextMotionTargets;
    setIntroScrollEnd((current) =>
      Math.abs(current - nextIntroScrollEnd) < 1 ? current : nextIntroScrollEnd,
    );
  }, []);

  useLayoutEffect(() => {
    measureMotionTargets();
    const firstFrame = window.requestAnimationFrame(() => {
      measureMotionTargets();
      window.requestAnimationFrame(measureMotionTargets);
    });
    const layoutSettledTimer = window.setTimeout(measureMotionTargets, 250);
    document.fonts?.ready.then(measureMotionTargets);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            measureMotionTargets();
          });

    [landingFlowRef.current, cardAnchorRef.current, portraitTargetRef.current, introSectionRef.current]
      .filter(Boolean)
      .forEach((element) => resizeObserver?.observe(element));
    window.addEventListener("resize", measureMotionTargets);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(layoutSettledTimer);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureMotionTargets);
    };
  }, [measureMotionTargets]);

  const scrollToSectionAnchor = useCallback((section, options = {}) => {
    if (!section || scrollAnchorLockRef.current) return;

    scrollAnchorLockRef.current = true;
    measureMotionTargets();
    const startY = window.scrollY;
    const targetY = startY + section.getBoundingClientRect().top;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const releaseAnchorLock = () => {
      root.style.scrollBehavior = previousScrollBehavior;
      if (options.cooldownAfterMs) {
        anchorCooldownUntilRef.current = window.performance.now() + options.cooldownAfterMs;
      }
      scrollAnchorLockRef.current = false;
    };

    if (prefersReducedMotion) {
      window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
      releaseAnchorLock();
      return;
    }

    const startTime = window.performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / ANCHOR_SCROLL_DURATION, 1);
      const easedProgress = easeInOutQuart(progress);

      window.scrollTo({
        top: startY + (targetY - startY) * easedProgress,
        left: 0,
        behavior: "auto",
      });

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        releaseAnchorLock();
      }
    };

    window.requestAnimationFrame(step);
  }, [measureMotionTargets, prefersReducedMotion]);

  const shouldUseIntroAnchor = () => window.scrollY < 40;

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.deltaY <= 12) return;

      if (shouldUseIntroAnchor()) {
        event.preventDefault();
        scrollToSectionAnchor(introSectionRef.current, { cooldownAfterMs: 1000 });
      }
    };

    const handleTouchStart = (event) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event) => {
      const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
      const swipeDistance = touchStartYRef.current - currentY;
      if (swipeDistance <= 24) return;

      if (shouldUseIntroAnchor()) {
        event.preventDefault();
        scrollToSectionAnchor(introSectionRef.current, { cooldownAfterMs: 1000 });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollToSectionAnchor]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setHasIntroAnimationStarted(true);
      setIntroTypedCount(INTRO_TITLE_CHARACTERS.length);
      return undefined;
    }

    const intro = introSectionRef.current;
    if (!intro || hasIntroAnimationStarted) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.38) return;
        setHasIntroAnimationStarted(true);
        observer.disconnect();
      },
      { threshold: [0.38, 0.55] },
    );

    observer.observe(intro);
    return () => observer.disconnect();
  }, [hasIntroAnimationStarted, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroTypedCount(INTRO_TITLE_CHARACTERS.length);
      return undefined;
    }

    if (!hasIntroAnimationStarted || introTypedCount >= INTRO_TITLE_CHARACTERS.length) {
      return undefined;
    }

    const delay = introTypedCount === 0 ? TYPEWRITER_START_DELAY : TYPEWRITER_INTERVAL;
    const timer = window.setTimeout(() => {
      setIntroTypedCount((current) => Math.min(current + 1, INTRO_TITLE_CHARACTERS.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [hasIntroAnimationStarted, introTypedCount, prefersReducedMotion]);

  const anchoredMoveProgress = useTransform(
    scrollY,
    [0, 0.08, 0.2, 0.38, 0.58, 1].map((point) => point * introScrollEnd),
    [0, 0, 0.24, 0.72, 1, 1],
  );
  const anchoredFlipProgress = useTransform(
    scrollY,
    [0, 0.58, 0.72, 0.9, 1].map((point) => point * introScrollEnd),
    [0, 0, 0.5, 1, 1],
  );
  const anchoredWordProgress = useTransform(
    scrollY,
    [0.12, 0.42].map((point) => point * introScrollEnd),
    [1, 0],
  );
  const anchoredFaceProgress = useTransform(
    scrollY,
    [0.68, 0.88].map((point) => point * introScrollEnd),
    [0, 1],
  );

  const activeMoveProgress = anchoredMoveProgress;
  const activeFlipProgress = anchoredFlipProgress;
  const activeWordProgress = anchoredWordProgress;
  const activeFaceProgress = anchoredFaceProgress;

  // Drive the card from the *live* anchor→target delta, re-measured every scroll frame. Keying the
  // transform on scrollY (not the move-progress, which clamps to 1 at landing and then stops
  // emitting) means it keeps re-evaluating after landing, so at progress === 1 the card stays welded
  // to the intro's right-hand slot and scrolls up together with the About section instead of
  // floating away.
  const readAnchorTargetDelta = useCallback(() => {
    const anchor = cardAnchorRef.current;
    const target = portraitTargetRef.current;
    if (!anchor || !target) return motionTargetsRef.current;
    const anchorRect = anchor.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    return { x: targetRect.left - anchorRect.left, y: targetRect.top - anchorRect.top };
  }, []);
  const portraitX = useTransform(
    [scrollY, activeMoveProgress],
    ([, progress]) => progress * readAnchorTargetDelta().x,
  );
  const portraitY = useTransform(
    [scrollY, activeMoveProgress],
    ([, progress]) => progress * readAnchorTargetDelta().y,
  );

  // TEMP DEBUG — remove after diagnosing card position.
  const portraitRotateY = useTransform(activeFlipProgress, [0, 1], [0, 180]);
  const portraitRotateZ = useTransform(activeMoveProgress, [0, 1], [-1.5, 0]);
  const frontOpacity = useTransform(activeFaceProgress, [0, 1], [1, 0]);
  const backOpacity = useTransform(activeFaceProgress, [0, 1], [0, 1]);
  const wordOpacity = useTransform(activeWordProgress, (value) => Math.max(0, Math.min(1, value)));
  const maskOpacity = useTransform(activeFaceProgress, [0.35, 0.72, 1], [0, 0.88, 1]);

  return (
    <PageShell className="home-page">
      <div
        className="landing-flow"
        ref={landingFlowRef}
      >
        <div className="scroll-portrait-sticky">
          <motion.div
            className="hero-side hero-side-left"
            style={{ opacity: prefersReducedMotion ? 1 : wordOpacity }}
          >
            <span className="hero-kicker-label">Amber Xu</span>
            <ParticleText className="scroll-word scroll-word-left" disabled={prefersReducedMotion}>
              PORT
            </ParticleText>
          </motion.div>
          <div className="scroll-portrait-anchor" ref={cardAnchorRef}>
            <motion.div
              className="scroll-portrait-card"
              style={{
                x: prefersReducedMotion ? 0 : portraitX,
                y: prefersReducedMotion ? 0 : portraitY,
                rotateY: prefersReducedMotion ? 0 : portraitRotateY,
                rotateZ: prefersReducedMotion ? 0 : portraitRotateZ,
              }}
            >
            <motion.div
              className="scroll-portrait-face scroll-portrait-front"
              style={{ opacity: prefersReducedMotion ? 1 : frontOpacity }}
            >
              <span className="scroll-portrait-fallback">Amber</span>
              <img
                src={portraitSrc}
                alt="Amber portrait"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={hideMissingPortraitImage}
              />
            </motion.div>
            <motion.div
              className="scroll-portrait-face scroll-portrait-back"
              style={{ opacity: prefersReducedMotion ? 0 : backOpacity }}
            >
              <span className="scroll-portrait-fallback">Amber</span>
              <img
                src={portraitSrc}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={hideMissingPortraitImage}
              />
              <motion.div
                className="scroll-portrait-mask"
                style={{ opacity: prefersReducedMotion ? 1 : maskOpacity }}
                aria-hidden="true"
              />
              <div className="scroll-portrait-overlay">
                <strong>Amber</strong>
                <span>UXUI Designer</span>
              </div>
            </motion.div>
            </motion.div>
          </div>
          <motion.div
            className="hero-side hero-side-right"
            style={{ opacity: prefersReducedMotion ? 1 : wordOpacity }}
          >
            <span className="hero-kicker-label">UX/UI Designer</span>
            <ParticleText className="scroll-word scroll-word-right" disabled={prefersReducedMotion}>
              FOLIO
            </ParticleText>
          </motion.div>
        </div>
        <div className="scroll-portrait-spacer" aria-hidden="true" />
        <section
          className="intro-section"
          id="home"
          ref={introSectionRef}
        >
          <div className="intro-copy">
            <p className="intro-kicker">/ About Me</p>
            <h1 className="intro-title" aria-label={INTRO_TITLE}>
              <span className="intro-title-ghost" aria-hidden="true">
                {INTRO_TITLE_PREFIX}<span>{INTRO_TITLE_NAME}</span>
              </span>
              <span className="intro-title-text" aria-hidden="true">
                {INTRO_TITLE_CHARACTERS.slice(0, introTypedCount).map((character, index) => (
                  <span
                    className={index >= INTRO_TITLE_PREFIX_LENGTH ? "intro-title-name" : undefined}
                    key={`${character}-${index}`}
                  >
                    {character}
                  </span>
                ))}
                {hasIntroAnimationStarted && !isIntroTitleComplete ? (
                  <span className="intro-title-cursor" aria-hidden="true" />
                ) : null}
              </span>
            </h1>
            <motion.p
              className="intro-lede"
              initial={false}
              animate={
                isIntroTitleComplete
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 16, filter: "blur(8px)" }
              }
              transition={{ ...INTRO_REVEAL_TRANSITION, delay: 0.08 }}
            >
              我是一个拥抱 AI 的体验设计师，欢迎来到我的网站。这是我的小型实验场，放一些作品、想法和我正在折腾的东西。
            </motion.p>
          </div>
          <div className="portrait-wrap portrait-target" ref={portraitTargetRef} aria-hidden="true">
            <span className="portrait-target-label">Amber UXUI Designer</span>
          </div>
        </section>
      </div>
      <HomeOrbitSection />
      <section className="falling-keywords-section" aria-label="Design keywords">
        <FallingText
          className="falling-keywords"
          text={fallingKeywords.join("\n")}
          highlightWords={["AI-native", "Agent", "Product", "Prototype", "Motion", "Strategy"]}
          trigger="hover"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.56}
          fontSize="clamp(20px, 4.2vw, 54px)"
          mouseConstraintStiffness={0.72}
          wordSpacing="clamp(6px, 1vw, 14px)"
        />
      </section>
    </PageShell>
  );
}
