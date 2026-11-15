import { useEffect, useRef, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react";
import type { TopicId } from "./content";
import { IdeaSection } from "./components/IdeaSection";
import { Hero } from "./components/Hero";
import { ContactClosing } from "./components/ContactClosing";
import { BackToTop } from "./components/BackToTop";
import { BrandHeader } from "./components/BrandHeader";
import { OrderingSection } from "./components/OrderingSection";
import { HeroLight } from "./components/HeroLight";

function Boutique() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [selected, setSelected] = useState<TopicId>("blouse");
  const reduceMotion = useReducedMotion();
  const canAnimate = enhanced && reduceMotion !== true;
  useEffect(() => setEnhanced(true), []);

  return (
    <div
      className="boutique-page"
      ref={surfaceRef}
      data-navodhai-app
      data-hydrated={enhanced ? "true" : "false"}
      data-motion={enhanced ? (reduceMotion ? "reduced" : "full") : "static"}
    >
      <HeroLight surfaceRef={surfaceRef} endRef={heroRef} enabled={canAnimate} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <BrandHeader />
      <main id="main" tabIndex={-1}>
        <Hero
          surfaceRef={heroRef}
          enhanced={enhanced}
          canAnimate={canAnimate}
          selected={selected}
          onSelect={setSelected}
        />
        <IdeaSection />
        <OrderingSection />
      </main>
      <ContactClosing />
      <BackToTop />
    </div>
  );
}

export function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.18, ease: "easeOut" }}>
        <Boutique />
      </MotionConfig>
    </LazyMotion>
  );
}
