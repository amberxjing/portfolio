import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CategoryTabs from "../components/CategoryTabs.jsx";
import PageShell from "../components/PageShell.jsx";
import { categories, projects } from "../data/projects.js";

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <PageShell className="work-page">
      <section className="work-hero">
        <p className="work-updated">/ Updated July 2026</p>
        <h1>
          Portfolio <span>Work</span>
        </h1>
      </section>

      <CategoryTabs categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />

      <section className="portfolio-grid" aria-label="Portfolio work samples">
        {visibleProjects.map((project, index) => (
          <motion.article
            className={`portfolio-card tone-${project.tone}`}
            key={project.slug}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, transition: { duration: 0.26, ease: [0.21, 0.6, 0.35, 1] } }}
            transition={{ duration: 0.44, delay: index * 0.06, ease: [0.21, 0.6, 0.35, 1] }}
          >
            <Link to={`/work/${project.slug}`} aria-label={`Open ${project.title}`}>
              {project.coverImage ? (
                <div className="portfolio-visual portfolio-image-visual" aria-hidden="true">
                  <img src={project.coverImage} alt="" loading="lazy" decoding="async" />
                </div>
              ) : (
                <div className={`portfolio-visual cover-${project.cover}`} aria-hidden="true">
                  <div className="portfolio-scene">
                    <span className="mock-sale">October Sale</span>
                    <span className="mock-label">{project.category}</span>
                  </div>
                </div>
              )}
              <div className="portfolio-card-copy">
                <p>{project.category}</p>
                <h2>{project.title}</h2>
              </div>
            </Link>
          </motion.article>
        ))}
      </section>
    </PageShell>
  );
}
