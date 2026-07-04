import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./OrbitImages.css";

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx, cy, radius) {
  return generateEllipsePath(cx, cy, radius, radius);
}

function normalizeItem(item, index, altPrefix) {
  if (typeof item === "string") {
    return {
      src: item,
      alt: `${altPrefix} ${index + 1}`,
      label: String(index + 1).padStart(2, "0"),
      title: `${altPrefix} ${index + 1}`,
      meta: "Selected work",
      description: "",
    };
  }

  return {
    label: item.label ?? String(index + 1).padStart(2, "0"),
    alt: item.alt ?? `${altPrefix} ${index + 1}`,
    meta: item.meta ?? "Selected work",
    title: item.title ?? `${altPrefix} ${index + 1}`,
    description: item.description ?? "",
    visualLabel: item.visualLabel ?? item.title ?? `${altPrefix} ${index + 1}`,
    src: item.src,
  };
}

const preloadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    const settle = () => resolve();

    image.onload = () => {
      if (typeof image.decode === "function") {
        image.decode().catch(() => {}).finally(settle);
        return;
      }
      settle();
    };
    image.onerror = settle;
    image.src = src;

    if (image.complete) {
      image.onload();
    }
  });

export default function OrbitImages({
  images = [],
  altPrefix = "Orbiting image",
  shape = "ellipse",
  baseWidth = 1400,
  baseHeight = 700,
  radiusX = 540,
  radiusY = 170,
  radius = 280,
  rotation = -7,
  duration = 32,
  itemSize = 108,
  direction = "normal",
  fill = true,
  responsive = true,
  className = "",
  showPath = true,
  pathColor = "rgba(255, 255, 255, 0.22)",
  pathWidth = 6,
  centerContent,
}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [scale, setScale] = useState(1);
  const [activeIndex, setActiveIndex] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [assetsReady, setAssetsReady] = useState(false);

  const items = useMemo(
    () => images.map((item, index) => normalizeItem(item, index, altPrefix)),
    [altPrefix, images],
  );

  const imageSources = useMemo(
    () => [...new Set(items.map((item) => item.src).filter(Boolean))],
    [items],
  );

  const path = useMemo(() => {
    const cx = baseWidth / 2;
    const cy = baseHeight / 2;
    if (shape === "circle") return generateCirclePath(cx, cy, radius);
    return generateEllipsePath(cx, cy, radiusX, radiusY);
  }, [baseWidth, baseHeight, radius, radiusX, radiusY, shape]);

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return undefined;

    const updateScale = () => {
      if (!containerRef.current) return;
      setScale(containerRef.current.clientWidth / baseWidth);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [baseWidth, responsive]);

  useEffect(() => {
    let isMounted = true;

    if (imageSources.length === 0) {
      setAssetsReady(true);
      return undefined;
    }

    setAssetsReady(false);
    Promise.all(imageSources.map(preloadImage)).then(() => {
      if (isMounted) {
        setAssetsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [imageSources]);

  const clearActiveItem = () => {
    setActiveIndex(null);
    setTooltip(null);
  };

  const activateItem = (index) => {
    const itemElement = itemRefs.current[index];
    const containerElement = containerRef.current;
    if (!itemElement || !containerElement) return;

    setActiveIndex(index);

    window.requestAnimationFrame(() => {
      const itemRect = itemElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();
      const isRightSide = itemRect.left + itemRect.width / 2 > containerRect.left + containerRect.width * 0.55;
      const offset = 18;
      const x = isRightSide
        ? itemRect.left - containerRect.left - offset
        : itemRect.right - containerRect.left + offset;

      setTooltip({
        item: items[index],
        placement: isRightSide ? "left" : "right",
        x,
        y: itemRect.top - containerRect.top + itemRect.height / 2,
      });
    });
  };

  return (
    <div
      className={`orbit-images ${assetsReady ? "is-ready" : "is-loading"} ${activeIndex !== null ? "is-paused has-active" : ""} ${className}`}
      aria-busy={!assetsReady}
      ref={containerRef}
      style={{ aspectRatio: `${baseWidth} / ${baseHeight}` }}
    >
      <div
        className="orbit-images-scaler"
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: responsive ? `translate(-50%, -50%) scale(${scale})` : undefined,
        }}
      >
        <div className="orbit-images-rotation" style={{ transform: `rotate(${rotation}deg)` }}>
          {showPath ? (
            <svg
              className="orbit-images-path"
              viewBox={`0 0 ${baseWidth} ${baseHeight}`}
              aria-hidden="true"
            >
              <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth} />
            </svg>
          ) : null}

          {items.map((item, index) => {
            const itemOffset = fill && items.length > 0 ? index / items.length : 0;
            const animationDelay = direction === "reverse"
              ? duration * itemOffset * -1
              : duration * (1 - itemOffset) * -1;

            return (
              <div
                className={`orbit-images-item ${activeIndex === index ? "is-active" : ""}`}
                key={`${item.title}-${item.label}`}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                style={{
                  "--orbit-item-size": `${itemSize}px`,
                  animationDelay: `${animationDelay}s`,
                  animationDirection: direction,
                  animationDuration: `${duration}s`,
                  offsetPath: `path("${path}")`,
                  zIndex: activeIndex === index ? 5 : 2,
                }}
              >
                <button
                  className="orbit-images-button"
                  type="button"
                  aria-label={item.title}
                  onBlur={clearActiveItem}
                  onClick={() => activateItem(index)}
                  onFocus={() => activateItem(index)}
                  onMouseEnter={() => activateItem(index)}
                  onMouseLeave={clearActiveItem}
                  onPointerEnter={() => activateItem(index)}
                  onPointerLeave={clearActiveItem}
                >
                  <span
                    className="orbit-images-content"
                    style={{ "--orbit-counter-rotation": `${-rotation}deg` }}
                  >
                    {item.src ? (
                      <img
                        className="orbit-images-img"
                        src={item.src}
                        alt={item.alt}
                        loading="eager"
                        decoding="async"
                        fetchpriority={index === 0 ? "high" : "auto"}
                        draggable={false}
                      />
                    ) : (
                      <span className="orbit-images-text-visual" aria-hidden="true">
                        {item.visualLabel.split("\n").map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {centerContent ? <div className="orbit-images-center">{centerContent}</div> : null}

      {tooltip ? (
        <aside
          className={`orbit-images-card orbit-images-card-${tooltip.placement}`}
          style={{ left: tooltip.x, top: tooltip.y }}
          aria-live="polite"
        >
          <span>{tooltip.item.meta}</span>
          <strong>{tooltip.item.title}</strong>
          <p>{tooltip.item.description}</p>
        </aside>
      ) : null}
    </div>
  );
}
