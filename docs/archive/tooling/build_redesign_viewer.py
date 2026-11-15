"""Wrap the real self-contained page in desktop/phone review viewports."""

from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[3]
REVIEW = ROOT / ".impeccable" / "review" / "redesign"
page = (REVIEW / "presentation-page.html").read_text(encoding="utf-8")
page = page.replace('href="https://wa.me/', 'target="_blank" rel="noopener noreferrer" href="https://wa.me/')
shell = (Path(__file__).with_name("redesign-viewer-shell.html")).read_text(encoding="utf-8")
(REVIEW / "design-viewer.html").write_text(shell.replace("<!-- PAGE_SOURCE -->", escape(page, quote=True)), encoding="utf-8")
print(REVIEW / "design-viewer.html")
