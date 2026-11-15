import { business } from "../content";
import { BrandMonogram } from "./BrandMonogram";
import { ThemeControl } from "./ThemeControl";

export function BrandHeader() {
  return (
    <div className="brand-header-slot wrap" id="top">
      <header className="brand-header" aria-label="Navodhai">
        <a className="brand-header-link" href="#top" aria-label="Navodhai home">
          <BrandMonogram />
          <span className="brand-header-name">{business.name}</span>
        </a>
        <ThemeControl />
      </header>
    </div>
  );
}
