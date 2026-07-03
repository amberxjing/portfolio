import { useEffect, useMemo, useRef, useState } from "react";
import Matter from "matter-js";
import "./FallingText.css";

function getTokens(text) {
  const splitPattern = text.includes("\n") ? /\n+/ : /\s+/;

  return text
    .split(splitPattern)
    .map((token) => token.trim())
    .filter(Boolean);
}

function isHighlighted(token, highlightWords) {
  return highlightWords.some((word) => token.toLowerCase().startsWith(word.toLowerCase()));
}

function shouldReduceMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function FallingText({
  className = "",
  text = "",
  highlightWords = [],
  highlightClass = "highlighted",
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = "1rem",
  wordSpacing = "2px",
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const animationFrameRef = useRef(0);
  const [effectStarted, setEffectStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(shouldReduceMotion);
  const tokens = useMemo(() => getTokens(text), [text]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    if (trigger === "auto") {
      setEffectStarted(true);
      return undefined;
    }

    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setEffectStarted(true);
          observer.disconnect();
        },
        { threshold: 0.32 },
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }

    return undefined;
  }, [prefersReducedMotion, trigger]);

  useEffect(() => {
    if (!effectStarted || prefersReducedMotion) return undefined;

    const container = containerRef.current;
    const textTarget = textRef.current;
    const canvasContainer = canvasContainerRef.current;
    if (!container || !textTarget || !canvasContainer) return undefined;

    const containerRect = container.getBoundingClientRect();
    const width = Math.max(containerRect.width, 1);
    const height = Math.max(containerRect.height, 1);

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body, Events } = Matter;
    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainer,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    });

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    const floor = Bodies.rectangle(width / 2, height - 32, width, 64, boundaryOptions);
    const leftWall = Bodies.rectangle(24, height / 2, 48, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width - 24, height / 2, 48, height, boundaryOptions);
    const ceiling = Bodies.rectangle(width / 2, -24, width, 48, boundaryOptions);

    const wordBodies = [...textTarget.querySelectorAll(".falling-text-word")].map((element) => {
      const rect = element.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: "transparent" },
        restitution: 0.76,
        frictionAir: 0.015,
        friction: 0.18,
      });

      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4.5,
        y: -Math.random() * 1.8,
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);

      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.transform = "translate(-50%, -50%)";
      return { body, element };
    });

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
    render.mouse = mouse;
    mouse.element.removeEventListener("wheel", mouse.mousewheel);
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    mouse.element.removeEventListener("touchmove", mouse.mousemove);
    mouse.element.removeEventListener("touchstart", mouse.mousedown);
    mouse.element.removeEventListener("touchend", mouse.mouseup);

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...wordBodies.map(({ body }) => body),
    ]);

    const syncWords = () => {
      wordBodies.forEach(({ body, element }) => {
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const cos = Math.abs(Math.cos(body.angle));
        const sin = Math.abs(Math.sin(body.angle));
        const visualWidth = elementWidth * cos + elementHeight * sin;
        const visualHeight = elementWidth * sin + elementHeight * cos;
        const minX = visualWidth / 2 + 16;
        const maxX = width - visualWidth / 2 - 16;
        const minY = visualHeight / 2 + 24;
        const maxY = height - visualHeight / 2 - 42;
        const nextX = Math.min(Math.max(body.position.x, minX), maxX);
        const nextY = Math.min(Math.max(body.position.y, minY), maxY);
        const movedX = nextX !== body.position.x;
        const movedY = nextY !== body.position.y;

        if (movedX || movedY) {
          Body.setPosition(body, { x: nextX, y: nextY });
          Body.setVelocity(body, {
            x: movedX ? 0 : body.velocity.x * 0.82,
            y: movedY ? 0 : body.velocity.y * 0.82,
          });
        }

        element.style.left = `${body.position.x}px`;
        element.style.top = `${body.position.y}px`;
        element.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
    };

    const runner = Runner.create();
    Events.on(engine, "afterUpdate", syncWords);
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
      }
      Events.off(engine, "afterUpdate", syncWords);
      Render.stop(render);
      Runner.stop(runner);
      render.canvas?.remove();
      World.clear(engine.world, false);
      Engine.clear(engine);
      wordBodies.forEach(({ element }) => {
        element.removeAttribute("style");
      });
    };
  }, [
    backgroundColor,
    effectStarted,
    gravity,
    mouseConstraintStiffness,
    prefersReducedMotion,
    wireframes,
  ]);

  const handleTrigger = () => {
    if (effectStarted || prefersReducedMotion) return;
    if (trigger === "click" || trigger === "hover") {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${effectStarted ? "is-active" : ""} ${className}`.trim()}
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
    >
      <div
        ref={textRef}
        className="falling-text-target"
        style={{
          fontSize,
          gap: wordSpacing,
        }}
        aria-label={text}
      >
        {tokens.map((token, index) => (
          <span
            className={`falling-text-word ${
              isHighlighted(token, highlightWords) ? highlightClass : ""
            }`.trim()}
            key={`${token}-${index}`}
          >
            {token}
          </span>
        ))}
      </div>
      <div ref={canvasContainerRef} className="falling-text-canvas" aria-hidden="true" />
    </div>
  );
}
