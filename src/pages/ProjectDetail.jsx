import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { projects } from "../data/projects.js";

function CaseVideo({ media }) {
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame || shouldLoad) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px" }
    );

    observer.observe(frame);

    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !videoRef.current) {
      return;
    }

    videoRef.current.play().catch(() => {});
  }, [shouldLoad]);

  const video = (
    <video
      ref={videoRef}
      src={shouldLoad ? media.src : undefined}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label={media.label}
    />
  );

  const canvasTone = media.canvas ?? "dark";

  return (
    <figure
      className={`case-video-frame case-video-${media.variant} case-video-canvas-${canvasTone}`}
      key={media.src}
      ref={frameRef}
    >
      {media.variant === "phone" ? (
        <div className="case-video-device" aria-label="iPhone preview">
          {!media.hideNotch && <span className="case-video-notch" aria-hidden="true" />}
          <div className="case-video-screen">{video}</div>
        </div>
      ) : (
        <div className="case-video-plain-player">{video}</div>
      )}
    </figure>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug) ?? projects[0];
  const caseMedia = project.caseImages?.flatMap((image, index) => {
    const media = [{ type: "image", src: image, imageIndex: index }];
    const videos = project.caseVideos?.filter((video) => video.insertAfter === index) ?? [];

    media.push(...videos.map((video) => ({ type: "video", ...video })));

    return media;
  });

  return (
    <PageShell className="detail-page">
      <Link className="back-link" to="/work">
        <ArrowLeft size={17} />
        Back to work
      </Link>
      {caseMedia?.length ? (
        <section className="case-image-flow" aria-label={`${project.title} project images`}>
          {caseMedia.map((media) =>
            media.type === "video" ? (
              <CaseVideo media={media} key={media.src} />
            ) : (
              <figure className="case-image-frame" key={media.src}>
                <img
                  src={media.src}
                  alt={`${project.title} page ${media.imageIndex + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )
          )}
        </section>
      ) : (
        <section className="case-template">
          {["Project Background", "My Role", "Design Process", "Final Solution", "Result & Reflection"].map((title) => (
            <article key={title}>
              <span className="template-index">
                0{["Project Background", "My Role", "Design Process", "Final Solution", "Result & Reflection"].indexOf(title) + 1}
              </span>
              <div>
                <h2>{title}</h2>
                <p>
                  This section is reserved for the real case study content. Add context, screenshots, decision-making notes,
                  and measurable outcomes when the project material is ready.
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </PageShell>
  );
}
