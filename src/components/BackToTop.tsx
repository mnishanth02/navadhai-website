import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > Math.min(window.innerHeight * 0.6, 480));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <a
      className="back-to-top"
      href="#top"
      aria-label="Back to top"
      title="Back to top"
      hidden={!visible}
    >
      <ArrowUp size={20} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}
