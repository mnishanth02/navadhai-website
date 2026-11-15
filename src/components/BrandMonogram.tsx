import gold from "../assets/brand/monogram-gold-export.png";

export function BrandMonogram() {
  return (
    <svg
      className="brand-monogram"
      role="img"
      aria-label="Navodhai monogram"
      width={64}
      height={64}
      viewBox="33 47 135 113"
      focusable="false"
    >
      {/* Frame the existing PNG's alpha bounds; retain its exact artwork and colours. */}
      <image href={gold} width={200} height={200} aria-hidden="true" />
    </svg>
  );
}
