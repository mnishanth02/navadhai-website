import { useEffect, useRef, type RefObject } from "react";
import { useSpring } from "motion/react";
import * as m from "motion/react-m";

const follow = { stiffness: 170, damping: 30, mass: 0.6 };
const fade = { stiffness: 250, damping: 35, mass: 0.5 };

type HeroLightProps = {
  surfaceRef: RefObject<HTMLElement | null>;
  endRef: RefObject<HTMLElement | null>;
  enabled: boolean;
};

export function HeroLight({ surfaceRef, endRef, enabled }: HeroLightProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, follow);
  const y = useSpring(0, follow);
  const opacity = useSpring(0, fade);

  useEffect(() => {
    const surface = surfaceRef.current;
    const end = endRef.current;
    const field = fieldRef.current;
    if (!surface || !end || !field || !enabled) return;

    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forced = window.matchMedia("(forced-colors: active)");
    let active = false;
    let bounds: { left: number; top: number; width: number; height: number } | null = null;

    function measure() {
      const start = surface!.getBoundingClientRect();
      const height = Math.max(0, end!.getBoundingClientRect().bottom - start.top);
      // One canvas spans the header and hero without changing their landmarks.
      field!.style.height = `${height}px`;
      return { left: start.left, top: start.top, width: start.width, height };
    }

    function reset() {
      active = false;
      bounds = null;
      x.stop();
      y.stop();
      opacity.jump(0);
    }

    function leave() {
      active = false;
      bounds = null;
      x.stop();
      y.stop();
      opacity.set(0);
    }

    function move(event: PointerEvent) {
      if (
        event.pointerType !== "mouse" ||
        !pointer.matches ||
        reduced.matches ||
        forced.matches ||
        document.hidden
      ) {
        reset();
        return;
      }
      // Cache geometry while tracking; only transform/opacity change per move.
      bounds ??= measure();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.left + bounds.width ||
        event.clientY < bounds.top ||
        event.clientY >= bounds.top + bounds.height
      ) {
        if (active) leave();
        return;
      }
      const nextX = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
      const nextY = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
      if (!active) {
        // Start at the entry point rather than flying in from the page corner.
        x.jump(nextX);
        y.jump(nextY);
        active = true;
      } else {
        x.set(nextX);
        y.set(nextY);
      }
      opacity.set(1);
    }

    const intersection =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            if (!entries[0]?.isIntersecting) reset();
          });
    const sizes = new Map<Element, { width: number; height: number }>();
    const resize =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver((entries) => {
            for (const entry of entries) {
              const next = entry.contentRect;
              const size = sizes.get(entry.target);
              if (size && (size.width !== next.width || size.height !== next.height)) reset();
              sizes.set(entry.target, { width: next.width, height: next.height });
            }
          });

    surface.addEventListener("pointermove", move, { passive: true });
    surface.addEventListener("pointerleave", leave);
    surface.addEventListener("pointercancel", reset);
    window.addEventListener("scroll", leave, { passive: true, capture: true });
    window.addEventListener("resize", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    pointer.addEventListener("change", reset);
    reduced.addEventListener("change", reset);
    forced.addEventListener("change", reset);
    intersection?.observe(surface);
    resize?.observe(surface);
    resize?.observe(end);

    return () => {
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", leave);
      surface.removeEventListener("pointercancel", reset);
      window.removeEventListener("scroll", leave, true);
      window.removeEventListener("resize", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      pointer.removeEventListener("change", reset);
      reduced.removeEventListener("change", reset);
      forced.removeEventListener("change", reset);
      intersection?.disconnect();
      resize?.disconnect();
      reset();
    };
  }, [surfaceRef, endRef, enabled, x, y, opacity]);

  return (
    <div className="hero-light-field" aria-hidden="true" ref={fieldRef}>
      <m.div className="hero-light" style={{ x, y, opacity }}>
        <div className="hero-light-wash" />
      </m.div>
    </div>
  );
}
