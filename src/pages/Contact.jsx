import { Check, Github, Mail, Phone } from "lucide-react";
import { useState } from "react";
import DotField from "../components/DotField.jsx";
import PageShell from "../components/PageShell.jsx";

const SHOW_DOT_FIELD_BACKGROUND = true;

const contactItems = [
  {
    label: "Email",
    value: "amberxjing@163.com",
    href: "",
    copyValue: "amberxjing@163.com",
    icon: Mail
  },
  {
    label: "Phone",
    value: "15975544212",
    href: "",
    copyValue: "15975544212",
    icon: Phone
  },
  {
    label: "GitHub",
    value: "github.com/amberxjing",
    href: "https://github.com/amberxjing",
    copyValue: "",
    icon: Github
  }
];

export default function Contact() {
  const [copied, setCopied] = useState("");
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  const copyText = async (value, label) => {
    if (!value) return;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  };

  const moveEyes = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = Math.max(-1, Math.min(1, (event.clientX - centerX) / (rect.width / 2)));
    const y = Math.max(-1, Math.min(1, (event.clientY - centerY) / (rect.height / 2)));
    setEyeOffset({ x: x * 4, y: y * 3 });
  };

  return (
    <PageShell className="contact-page">
      <div className="contact-background" aria-hidden="true">
        {SHOW_DOT_FIELD_BACKGROUND ? (
          <DotField
            dotRadius={2}
            dotSpacing={18}
            cursorRadius={440}
            bulgeStrength={58}
            glowRadius={180}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom="rgba(20, 22, 23, 0.24)"
            gradientTo="rgba(226, 117, 0, 0.2)"
            glowColor="rgba(226, 117, 0, 0.36)"
          />
        ) : null}
      </div>
      <section
        className="contact-layout"
        onPointerMove={moveEyes}
        onPointerLeave={() => setEyeOffset({ x: 0, y: 0 })}
      >
        <div className="contact-hero">
          <span
            className="contact-eyes"
            aria-hidden="true"
            style={{
              "--eye-x": `${eyeOffset.x}px`,
              "--eye-y": `${eyeOffset.y}px`
            }}
          >
            <span className="contact-eye">
              <span className="contact-pupil" />
            </span>
            <span className="contact-eye">
              <span className="contact-pupil" />
            </span>
          </span>
          <h1>Contact Me</h1>
          <div className="contact-card-list">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="contact-icon">
                    <Icon size={16} />
                  </span>
                  <span className="contact-copy">
                    <strong>{item.label}</strong>
                    <em>{item.value}</em>
                  </span>
                </>
              );

              return item.href ? (
                <article className="contact-card-frame" key={item.label}>
                  <a
                    className="contact-card"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${item.label}`}
                  >
                    {content}
                  </a>
                </article>
              ) : (
                <article className="contact-card-frame" key={item.label}>
                  <button
                    className="contact-card"
                    type="button"
                    onClick={() => copyText(item.copyValue, item.label)}
                    aria-label={`Copy ${item.label}`}
                  >
                    {content}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      {copied ? (
        <div className="copy-toast" role="status" aria-live="polite">
          <Check size={15} />
          <span>{copied} copied</span>
        </div>
      ) : null}
    </PageShell>
  );
}
