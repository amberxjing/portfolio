import { Download } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import printBackSrc from "../../asset/print-back.png";
import printFrontSrc from "../../asset/print-front.png";
import resumeSrc from "../../asset/resume.jpg";
import styles from "./ResumePrinter.module.css";

const RESUME_PRINTER_TUNING = {
  // paperStartY: paper starts below the mask, hidden inside the machine.
  paperStartY: 560,
  // paperEndY: final printed paper position inside the mask.
  paperEndY: 0,
  // printDuration: main print animation length, in seconds.
  printDuration: 3,
  // sceneMaxWidth: max visual width of the whole typewriter scene.
  sceneMaxWidth: "660px",
  // paperWidth: width of the DOM resume sheet.
  paperWidth: "clamp(250px, 66%, 500px)",
  // paperExitY: vertical mask bottom, aligned near the typewriter paper slot.
  paperExitY: "68%",
};

const PRINT_DELAY = 0.3;
const OVERSHOOT_Y = -18;

export default function ResumePrinter({ tuning = RESUME_PRINTER_TUNING }) {
  const shouldReduceMotion = useReducedMotion();
  const [isComplete, setIsComplete] = useState(Boolean(shouldReduceMotion));
  const paperTextureSrc = `${import.meta.env.BASE_URL}assets/paper-texture.png`;

  const settings = useMemo(() => ({ ...RESUME_PRINTER_TUNING, ...tuning }), [tuning]);
  const isPrinting = !isComplete && !shouldReduceMotion;

  useEffect(() => {
    setIsComplete(Boolean(shouldReduceMotion));
  }, [shouldReduceMotion]);

  const paperY = shouldReduceMotion
    ? settings.paperEndY
    : [settings.paperStartY, settings.paperEndY + OVERSHOOT_Y, settings.paperEndY];

  const paperTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        delay: PRINT_DELAY,
        duration: settings.printDuration,
        times: [0, 0.92, 1],
        ease: [0.22, 0.61, 0.36, 1],
      };

  const machineShake = isPrinting
    ? {
        x: [0, 0.7, -0.6, 0.5, 0],
        y: [0, -0.4, 0.5, -0.2, 0],
      }
    : { x: 0, y: 0 };

  const machineTransition = isPrinting
    ? {
        delay: PRINT_DELAY,
        duration: 0.18,
        repeat: Infinity,
        ease: "linear",
      }
    : { duration: 0.18 };

  return (
    <section className={styles.shell} aria-label="Animated resume printer">
      <div
        className={styles.scene}
        style={{
          "--scene-max-width": settings.sceneMaxWidth,
          "--paper-width": settings.paperWidth,
          "--paper-exit-y": settings.paperExitY,
          "--paper-texture-url": `url("${paperTextureSrc}")`,
        }}
      >
        <motion.img
          className={`${styles.typewriterLayer} ${styles.typewriterBack}`}
          src={printBackSrc}
          alt=""
          aria-hidden="true"
          animate={machineShake}
          transition={machineTransition}
        />

        <div className={styles.paperViewport} aria-hidden={!isComplete}>
          <motion.article
            className={`${styles.resumePaper} ${isComplete ? styles.isComplete : ""}`}
            initial={{ y: shouldReduceMotion ? settings.paperEndY : settings.paperStartY }}
            animate={{ y: paperY }}
            transition={paperTransition}
            onAnimationComplete={() => setIsComplete(true)}
            aria-label="Resume preview"
            aria-busy={!isComplete}
          >
            <div className={styles.paperSurface}>
              <img className={styles.resumeImage} src={resumeSrc} alt="Amber Xu resume" loading="lazy" decoding="async" />
              <a className={styles.paperDownload} href={resumeSrc} download>
                <span className={styles.paperDownloadButton}>
                  <Download size={16} />
                  Download Resume
                </span>
              </a>
            </div>
          </motion.article>
        </div>

        <motion.img
          className={`${styles.typewriterLayer} ${styles.typewriterFront}`}
          src={printFrontSrc}
          alt=""
          aria-hidden="true"
          animate={machineShake}
          transition={machineTransition}
        />
      </div>
    </section>
  );
}
