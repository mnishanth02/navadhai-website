// Historical inspection for the rejected draft and its .button class.
(() => {
  const width = document.documentElement.clientWidth;
  const overflow = [...document.querySelectorAll("body *")].filter((element) => {
    if (element.closest("svg") || element.classList.contains("skip-link")) return false;
    const rect = element.getBoundingClientRect();
    return rect.width && (rect.right > width + 1 || rect.left < -1);
  }).map((element) => ({ tag: element.tagName, className: element.className }));
  return {
    viewport: { width: innerWidth, height: innerHeight, deviceScaleFactor: devicePixelRatio },
    documentWidth: document.documentElement.scrollWidth,
    overflow,
    scripts: document.scripts.length,
    requests: performance.getEntriesByType("resource").map(({ name, transferSize, decodedBodySize }) => ({ name, transferSize, decodedBodySize })),
    headings: [...document.querySelectorAll("h1,h2,h3")].map((element) => ({ tag: element.tagName, text: element.textContent })),
    links: [...document.querySelectorAll("a")].map((element) => ({ text: element.textContent.trim(), href: element.getAttribute("href") })),
    bodyFont: getComputedStyle(document.body).fontFamily,
    h1: { size: getComputedStyle(document.querySelector("h1")).fontSize, lineHeight: getComputedStyle(document.querySelector("h1")).lineHeight },
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    buttonTransition: getComputedStyle(document.querySelector(".button")).transitionDuration,
    userAgent: navigator.userAgent,
  };
})()
