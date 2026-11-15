import { useEffect, type RefObject } from "react";
import { useAnimationControls } from "motion/react";
import * as m from "motion/react-m";
import { Check, MapPin } from "lucide-react";
import artwork from "../assets/textile-study-cutout.webp";
import { business, enquiryMessage, topics, whatsappHref } from "../content";
import type { TopicId } from "../content";
import { WhatsAppIcon } from "./WhatsAppIcon";

const names = { blouse: "Blouse", dress: "Dress", customisation: "Customise" } as const;
const marks: Record<TopicId, string> = {
  blouse: "M199 298 280 277M176 689 187 779",
  dress: "M1017 99 966 207M1126 810 1153 906",
  customisation: "M434 834Q664 553 909 808",
};

type HeroProps = {
  surfaceRef: RefObject<HTMLElement | null>;
  enhanced: boolean;
  canAnimate: boolean;
  selected: TopicId;
  onSelect: (topic: TopicId) => void;
};

export function Hero({ surfaceRef, enhanced, canAnimate, selected, onSelect }: HeroProps) {
  const topic = topics.find((item) => item.id === selected) ?? topics[0];
  const message = enquiryMessage(topic);
  const line = useAnimationControls();

  useEffect(() => {
    if (!canAnimate) {
      line.set({ pathLength: 1, opacity: 1 });
      return;
    }
    line.set({ pathLength: 0, opacity: 0.6 });
    void line.start({ pathLength: 1, opacity: 1, transition: { duration: 0.36, ease: "easeOut" } });
    return () => line.stop();
  }, [canAnimate, line, selected]);

  const pose = canAnimate
    ? { rotate: selected === "dress" ? 1 : -0.7, y: selected === "customisation" ? -6 : -3 }
    : { rotate: 0, y: 0 };

  return (
    <section className="opening" aria-labelledby="hero-title" ref={surfaceRef}>
      <div className="opening-layout wrap">
        <div className="opening-intro">
          <h1 className="opening-title" id="hero-title">
            <span className="opening-title-line">Be a</span>{" "}
            <span className="opening-title-line">princess.</span>
          </h1>
          <p className="opening-description">Blouse &amp; dress making.</p>
          <p className="opening-locality">
            <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
            {business.serviceArea}
          </p>
        </div>
        <div className="opening-art">
          <m.div
            className="textile-composition"
            initial={false}
            animate={pose}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <img
              src={artwork}
              width={1448}
              height={1086}
              alt="Conceptual textile study: plum, ivory and dusty rose pattern pieces joined by a gold thread."
              fetchPriority="high"
              decoding="async"
            />
            <svg className="textile-marks" viewBox="0 0 1448 1086" aria-hidden="true">
              <m.path
                d={marks[selected]}
                fill="none"
                stroke="var(--color-antique-gold)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={false}
                animate={line}
              />
            </svg>
          </m.div>
        </div>
        <div className="opening-enquiry">
          <div className="opening-picker">
            <p id="piece-label">Choose your piece.</p>
            <div className="piece-options" role="group" aria-labelledby="piece-label">
              {topics.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="piece-choice"
                  disabled={!enhanced}
                  aria-pressed={selected === item.id}
                  onClick={() => onSelect(item.id)}
                >
                  {names[item.id]}
                  <Check className="piece-check" size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <m.a
            className="action opening-action"
            href={whatsappHref(message)}
            aria-label="Enquire on WhatsApp"
            data-testid="hero-whatsapp"
            whileHover={canAnimate ? { y: -2 } : undefined}
            whileTap={canAnimate ? { scale: 0.985 } : undefined}
          >
            <WhatsAppIcon />
            Enquire
          </m.a>
        </div>
      </div>
    </section>
  );
}
