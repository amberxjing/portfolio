import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import OrbitImages from "./OrbitImages.jsx";
import "./HomeOrbitSection.css";

const orbitItems = [
  {
    label: "01",
    src: new URL("../../asset/轨迹/1.png", import.meta.url).href,
    visualLabel: "新闻\n传播",
    meta: "中山大学本科",
    title: "新闻传播",
    description: "从传播、叙事和信息组织开始，建立理解用户、表达观点和拆解内容结构的基础。",
  },
  {
    label: "02",
    src: new URL("../../asset/轨迹/ 2.png", import.meta.url).href,
    visualLabel: "交互\n设计",
    meta: "中山大学研究生",
    title: "交互设计",
    description: "系统学习用户研究、交互逻辑和体验方法，把表达能力转向产品问题和流程设计。",
  },
  {
    label: "03",
    src: new URL("../../asset/轨迹/3.png", import.meta.url).href,
    visualLabel: "大厂\n练习生",
    meta: "网易游戏实习",
    title: "大厂练习生",
    description: "在真实业务里完成从学生到职业设计师的切换，开始处理复杂中台和团队协作问题。",
  },
  {
    label: "04",
    src: new URL("../../asset/轨迹/4.png", import.meta.url).href,
    visualLabel: "大厂\n设计师",
    meta: "网易游戏 UX 设计师",
    title: "大厂设计师",
    description: "负责游戏电商、支付增长和 AI 提效工具，把复杂业务目标落到可执行的产品体验里。",
  },
  {
    label: "05",
    src: new URL("../../asset/轨迹/5.png", import.meta.url).href,
    visualLabel: "To Be\nContinue",
    meta: "Next Chapter",
    title: "To Be Continue",
    description: "继续把 AI、产品设计和个人表达结合起来，探索更高杠杆的设计工作方式。",
  },
];

export default function HomeOrbitSection() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 94%", "start 18%"],
  });
  const easedProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  });
  const panelWidth = useTransform(easedProgress, [0, 1], ["58%", "100%"]);
  const panelRadius = useTransform(easedProgress, [0, 1], ["34px", "30px"]);
  const panelY = useTransform(easedProgress, [0, 1], [44, 0]);

  return (
    <section className="home-orbit-section" aria-labelledby="home-orbit-title" ref={sectionRef}>
      <motion.div
        className="home-orbit-panel"
        style={{
          borderRadius: prefersReducedMotion ? 30 : panelRadius,
          y: prefersReducedMotion ? 0 : panelY,
          width: prefersReducedMotion ? "100%" : panelWidth,
        }}
      >
        <div className="home-orbit-head">
          <p className="intro-kicker">/ Growth Path</p>
          <div className="home-orbit-title-row">
            <ArrowLeft size={26} strokeWidth={2} aria-hidden="true" />
            <h2 id="home-orbit-title">Growth Orbit</h2>
            <ArrowRight size={26} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>

        <OrbitImages
          className="home-orbit"
          images={orbitItems}
          altPrefix="Growth stage"
          baseWidth={1320}
          baseHeight={680}
          radiusX={520}
          radiusY={176}
          rotation={-7}
          duration={34}
          itemSize={230}
          responsive
          centerContent={
            <Link className="home-orbit-link" to="/work">My Work</Link>
          }
        />
      </motion.div>
    </section>
  );
}
