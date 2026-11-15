"""Create a self-contained review document, with optional browser assertions."""

from pathlib import Path
import argparse
import base64
import re

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "docs" / "archive" / "static-site"
parser = argparse.ArgumentParser()
parser.add_argument("--qa", action="store_true")
parser.add_argument("--no-js", action="store_true")
parser.add_argument("--presentation", action="store_true")
args = parser.parse_args()


def data_uri(path):
    mime = {".webp": "image/webp", ".woff2": "font/woff2"}[path.suffix]
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


html = (SOURCE / "index.html").read_text(encoding="utf-8")
css = (SOURCE / "styles.css").read_text(encoding="utf-8")
css = re.sub(r'url\("(assets/[^\"]+)"\)', lambda m: f'url("{data_uri(SOURCE / m[1])}")', css)
html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>{css}</style>")
html = html.replace('<script src="script.js" defer></script>', "")
html = html.replace('src="assets/textile-study.webp"', f'src="{data_uri(SOURCE / "assets/textile-study.webp")}"')
scripts = ""
if not args.no_js:
    scripts = "<script>" + (SOURCE / "script.js").read_text(encoding="utf-8") + "</script>"
if args.qa:
    qa = """
    (async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      const root = document.getElementById('navodhai-redesign');
      const reports = [];
      const check = (name, pass) => { reports.push({name, pass}); if (!pass) console.error('REVIEW FAILED: ' + name); };
      const picker = root.querySelector('#enquiry-helper');
      const fallback = root.querySelector('#service-fallback');
      const radios = [...root.querySelectorAll('input[name=topic]')];
      const scriptPresent = !picker.hidden;
      check('enhanced-or-fallback-state', scriptPresent ? fallback.hidden : !fallback.hidden);
      if (scriptPresent) {
        for (const radio of radios) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
          const topic = {blouse:'blouse making',dress:'dress making',customisation:'customisation'}[radio.value];
          const expected = `Hi Navodhai, I'd like to enquire about ${topic}. Can we discuss my requirements?`;
          const link = new URL(root.querySelector('#topic-whatsapp').href);
          check(radio.value + '-message', root.querySelector('#message-text').textContent === expected && link.searchParams.get('text') === expected && link.pathname === '/917845952592');
        }
        radios[0].checked = true;
        radios[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      for (const animation of document.getAnimations()) animation.cancel();
      check('native-disclosures', root.querySelectorAll('details > summary').length === 3);
      check('anchors', [...root.querySelectorAll('a[href^="#"]')].every(link => document.getElementById(link.hash.slice(1))));
      check('no-overflow', document.documentElement.scrollWidth <= innerWidth);
      const rootSize = document.documentElement.style.fontSize;
      document.documentElement.style.fontSize = '200%';
      check('enlarged-text-no-overflow', document.documentElement.scrollWidth <= innerWidth);
      document.documentElement.style.fontSize = rootSize;
      console.log('DESIGN_REVIEW ' + JSON.stringify({width:innerWidth, reports, fontsLoaded:document.fonts.check('600 24px "Bricolage Grotesque"') && document.fonts.check('400 16px "Instrument Sans"')}));
    })().catch(error => console.error('REVIEW ERROR: ' + error.message));
    """
    scripts += f"<script>{qa}</script>"
html = html.replace("</body>", scripts + "</body>")
out = ROOT / ".impeccable" / "review" / "redesign"
out.mkdir(parents=True, exist_ok=True)
filename = "no-js-review.html" if args.no_js else "interactive-review.html"
if args.presentation:
    filename = "presentation-page.html"
(out / filename).write_text(html, encoding="utf-8")
print(out / filename)
