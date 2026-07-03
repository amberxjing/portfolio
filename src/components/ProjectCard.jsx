import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link className={`project-card tone-${project.tone}`} to={`/work/${project.slug}`}>
      <div className="project-visual" aria-hidden="true">
        <span>{project.category}</span>
        <strong>{project.year}</strong>
      </div>
      <div className="project-copy">
        <div>
          <p>{project.category}</p>
          <h3>{project.title}</h3>
        </div>
        <ArrowUpRight size={20} />
      </div>
      <p className="project-summary">{project.summary}</p>
      <span className="project-role">{project.role}</span>
    </Link>
  );
}
