import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const storageKey = "navodhai-theme";

function storedPreference(): Theme {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === "light" || stored === "dark" ? stored : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = theme;
  document.querySelectorAll<HTMLLinkElement>("link[data-brand-icon]").forEach((link) => {
    link.media = link.dataset.brandIcon === theme ? "all" : "not all";
  });
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#261a24" : "#f9f0e3");
}

export function ThemeControl() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);
  const desiredTheme = useRef<Theme>("dark");
  const transition = useRef<ViewTransition | null>(null);
  const changeSequence = useRef(0);

  useEffect(() => {
    const stored = storedPreference();
    desiredTheme.current = stored;
    setTheme(stored);
    applyTheme(stored);
    setReady(true);
  }, []);

  useEffect(
    () => () => {
      changeSequence.current += 1;
      transition.current?.skipTransition();
    },
    [],
  );

  const change = () => {
    const next = desiredTheme.current === "dark" ? "light" : "dark";
    desiredTheme.current = next;
    const sequence = ++changeSequence.current;
    const update = () => {
      if (sequence !== changeSequence.current) return;
      applyTheme(next);
      setTheme(next);
    };
    transition.current?.skipTransition();
    if (
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const active = document.startViewTransition(update);
      transition.current = active;
      // Interrupted transitions can reject ready even though the theme update still succeeds.
      void active.ready.catch(() => {});
      void active.finished
        .catch(() => {})
        .finally(() => {
          if (transition.current === active) transition.current = null;
        });
    } else {
      update();
    }
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Apply the preference even when browser storage is unavailable.
    }
  };
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  return (
    <button
      className="theme-control"
      type="button"
      disabled={!ready}
      aria-label={label}
      title={label}
      onClick={change}
    >
      <Sun className="theme-icon theme-icon-sun" size={22} strokeWidth={1.5} aria-hidden="true" />
      <Moon className="theme-icon theme-icon-moon" size={22} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
