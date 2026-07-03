import { motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SAMPLE_STEP = 3;
const CANVAS_PAD = 170;
const FRICTION = 0.935;
const EXPLODE_BASE = 2.4;
const REASSEMBLE_LERP = 0.095;
const SETTLE_THRESHOLD = 0.52;
const TAU = Math.PI * 2;

function isTouchOnlyDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse) and (hover: none)").matches;
}

function sampleParticlesFromDOM(label) {
  const labelRect = label.getBoundingClientRect();
  const width = Math.max(Math.ceil(labelRect.width), 1);
  const height = Math.max(Math.ceil(labelRect.height), 1);
  const text = label.textContent ?? "";

  if (!text.trim()) {
    return { particles: [], width, height, pad: CANVAS_PAD };
  }

  const styles = window.getComputedStyle(label);
  const canvas = document.createElement("canvas");
  const canvasWidth = width + CANVAS_PAD * 2;
  const canvasHeight = height + CANVAS_PAD * 2;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const particles = [];

  if (!ctx) {
    return { particles, width, height, pad: CANVAS_PAD };
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.fillStyle = "#000000";
  ctx.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
  ctx.textBaseline = "top";
  if ("letterSpacing" in ctx) {
    ctx.letterSpacing = styles.letterSpacing;
  }
  ctx.fillText(text, CANVAS_PAD, CANVAS_PAD);

  const pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
  for (let y = 0; y < canvasHeight; y += SAMPLE_STEP) {
    for (let x = 0; x < canvasWidth; x += SAMPLE_STEP) {
      const alpha = pixels[(y * canvasWidth + x) * 4 + 3];
      if (alpha > 42) {
        const originX = x + (Math.random() - 0.5) * 2.2;
        const originY = y + (Math.random() - 0.5) * 2.2;
        particles.push({
          x: originX,
          y: originY,
          originX,
          originY,
          vx: 0,
          vy: 0,
          size: 0.55 + Math.random() * 1.25,
          alpha: Math.min(0.92, 0.24 + (alpha / 255) * 0.72),
          phase: Math.random() * TAU,
          drift: 0.18 + Math.random() * 0.82,
        });
      }
    }
  }

  return { particles, width, height, pad: CANVAS_PAD };
}

function explodeParticles(particles, originX, originY) {
  particles.forEach((particle) => {
    const dx = particle.originX - originX;
    const dy = particle.originY - originY;
    const distance = Math.hypot(dx, dy) || 1;
    const wave = Math.sin(particle.phase) * 1.8;
    const force = EXPLODE_BASE + Math.random() * 2.8 + distance * 0.006;

    particle.vx = (dx / distance) * force + (-dy / distance) * wave + (Math.random() - 0.5) * 1.5;
    particle.vy = (dy / distance) * force + (dx / distance) * wave + (Math.random() - 0.5) * 1.5;
  });
}

export default function ParticleText({ children, className = "", style, disabled = false, ...rest }) {
  const containerRef = useRef(null);
  const labelRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const frameRef = useRef(0);
  const modeRef = useRef("idle");
  const metricsRef = useRef({ width: 0, height: 0, pad: CANVAS_PAD, dpr: 1, color: "#141617" });
  const [interactive, setInteractive] = useState(() => !isTouchOnlyDevice());

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse) and (hover: none)");
    const sync = () => setInteractive(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const stopAnimation = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const particles = particlesRef.current;
    const { width, height, pad, dpr, color } = metricsRef.current;
    if (!canvas || !particles.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = (width + pad * 2) * dpr;
    const canvasHeight = (height + pad * 2) * dpr;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.scale(dpr, dpr);

    if (modeRef.current === "scattered") {
      particles.forEach((particle) => {
        particle.vx *= FRICTION;
        particle.vy *= FRICTION;
        particle.vx += Math.sin(particle.phase + particle.y * 0.018) * 0.018 * particle.drift;
        particle.vy += Math.cos(particle.phase + particle.x * 0.014) * 0.012 * particle.drift;
        particle.x += particle.vx;
        particle.y += particle.vy;
      });
    }

    if (modeRef.current === "reassembling") {
      let settled = true;
      particles.forEach((particle) => {
        const dx = particle.originX - particle.x;
        const dy = particle.originY - particle.y;
        if (Math.abs(dx) > SETTLE_THRESHOLD || Math.abs(dy) > SETTLE_THRESHOLD) {
          settled = false;
        }
        particle.x += dx * REASSEMBLE_LERP;
        particle.y += dy * REASSEMBLE_LERP;
        particle.vx = 0;
        particle.vy = 0;
      });

      if (settled) {
        modeRef.current = "idle";
        stopAnimation();
        canvas.style.opacity = "0";
        if (labelRef.current) {
          labelRef.current.style.opacity = "1";
        }
        return;
      }
    }

    particles.forEach((particle) => {
      if (modeRef.current === "scattered") {
        ctx.globalAlpha = particle.alpha * 0.2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.originX, particle.originY, Math.max(0.45, particle.size * 0.72), 0, TAU);
        ctx.fill();
      }

      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, TAU);
      ctx.fill();
    });

    ctx.restore();
    frameRef.current = requestAnimationFrame(drawFrame);
  }, [stopAnimation]);

  const startAnimation = useCallback(() => {
    stopAnimation();
    drawFrame();
  }, [drawFrame, stopAnimation]);

  const prepareParticles = useCallback(() => {
    const label = labelRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!label || !canvas || !container) return false;

    const sampled = sampleParticlesFromDOM(label);
    if (!sampled.particles.length) return false;

    const styles = window.getComputedStyle(container);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pad = sampled.pad;
    const canvasWidth = sampled.width + pad * 2;
    const canvasHeight = sampled.height + pad * 2;

    particlesRef.current = sampled.particles;
    metricsRef.current = {
      width: sampled.width,
      height: sampled.height,
      pad,
      dpr,
      color: styles.color,
    };

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.left = `-${pad}px`;
    canvas.style.top = `-${pad}px`;

    return true;
  }, []);

  const handlePointerEnter = useCallback(
    (event) => {
      if (modeRef.current !== "idle") return;
      if (!prepareParticles()) return;

      const canvas = canvasRef.current;
      const label = labelRef.current;
      if (!canvas || !label) return;

      const rect = canvas.getBoundingClientRect();
      const pad = metricsRef.current.pad;
      explodeParticles(
        particlesRef.current,
        event.clientX - rect.left,
        event.clientY - rect.top,
      );

      modeRef.current = "scattered";
      canvas.style.opacity = "1";
      label.style.opacity = "0";
      startAnimation();
    },
    [prepareParticles, startAnimation],
  );

  const handlePointerLeave = useCallback(() => {
    if (modeRef.current === "idle") return;
    modeRef.current = "reassembling";
    startAnimation();
  }, [startAnimation]);

  useLayoutEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  if (disabled || !interactive) {
    return (
      <motion.span className={className} style={style} {...rest}>
        {children}
      </motion.span>
    );
  }

  return (
    <motion.span
      ref={containerRef}
      className={`particle-text ${className}`.trim()}
      style={style}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      {...rest}
    >
      <span ref={labelRef} className="particle-text-label">
        {children}
      </span>
      <canvas ref={canvasRef} className="particle-text-canvas" aria-hidden="true" />
    </motion.span>
  );
}
