import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import ResumePrinter from "../components/ResumePrinter.jsx";

export default function Resume() {
  useEffect(() => {
    document.body.classList.add("resume-route");

    return () => {
      document.body.classList.remove("resume-route");
    };
  }, []);

  return (
    <PageShell className="resume-page">
      <Link className="back-link" to="/">
        <ArrowLeft size={17} />
        Back home
      </Link>
      <ResumePrinter />
    </PageShell>
  );
}
