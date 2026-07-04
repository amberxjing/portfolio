import { useEffect } from "react";
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
      <ResumePrinter />
    </PageShell>
  );
}
