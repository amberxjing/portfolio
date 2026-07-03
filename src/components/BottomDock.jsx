import { FileText, Home, Mail, PanelsTopLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomDock() {
  const location = useLocation();
  const activeItem =
    location.pathname.startsWith("/work")
      ? "Work"
      : location.pathname === "/resume"
        ? "Resume"
        : location.pathname === "/contact"
          ? "Contact"
          : "Home";

  return (
    <nav className="bottom-dock" aria-label="Primary navigation">
      <Link className={`dock-item ${activeItem === "Home" ? "active" : ""}`} to="/" aria-label="Home">
        <Home size={16} strokeWidth={2} />
        <span>Home</span>
      </Link>
      <Link
        className={`dock-item ${activeItem === "Work" ? "active" : ""}`}
        to="/work"
        aria-label="Work"
      >
        <PanelsTopLeft size={16} strokeWidth={2} />
        <span>Work</span>
      </Link>
      <Link className={`dock-item ${activeItem === "Resume" ? "active" : ""}`} to="/resume" aria-label="Resume">
        <FileText size={16} strokeWidth={2} />
        <span>Resume</span>
      </Link>
      <Link className={`dock-item ${activeItem === "Contact" ? "active" : ""}`} to="/contact" aria-label="Contact">
        <Mail size={16} strokeWidth={2} />
        <span>Contact</span>
      </Link>
    </nav>
  );
}
