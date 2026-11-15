"""Check the redesigned static page's contacts, fallback, assets and budgets."""

import argparse
import gzip
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit
import re


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.assets = []
        self.nodes = {}
        self.scripts = 0
        self.forms = 0
        self.h1_count = 0
        self.meta = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
            self.nodes[attrs["id"]] = attrs
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.assets.append(attrs["href"])
        if tag in ("img", "script"):
            self.assets.append(attrs.get("src", ""))
        if tag == "img":
            assert attrs.get("alt"), "Content image needs an alternative"
            assert attrs.get("width") and attrs.get("height"), "Reserve image dimensions"
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property"))] = attrs.get("content")
        self.scripts += tag == "script"
        self.forms += tag == "form"
        self.h1_count += tag == "h1"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", default="docs/archive/static-site")
    directory = Path(__file__).resolve().parents[3] / parser.parse_args().directory
    source = (directory / "index.html").read_text(encoding="utf-8")
    css = (directory / "styles.css").read_text(encoding="utf-8")
    page = Page()
    page.feed(source)
    assert len(page.ids) == len(set(page.ids)), "Duplicate IDs"
    assert page.h1_count == 1 and page.forms == 0, "Unexpected page structure or collector form"
    assert page.scripts == 1, "Only the small first-party enhancement script is expected"
    assert page.meta.get("robots") == "noindex, nofollow", "Public launch has not been configured"
    assert "og:url" not in page.meta and 'rel="canonical"' not in source, "Do not invent a domain"
    assert "hidden" in page.nodes["enquiry-helper"], "Hide enhanced controls until initialisation"
    assert "hidden" not in page.nodes["service-fallback"], "Fallback must be visible without scripts"
    assert "Conceptual tailoring illustration." in source, "Artwork status must be visible"

    messages = set()
    for href in page.links:
        assert href and href != "#", "Placeholder link"
        url = urlsplit(href)
        if href.startswith("#"):
            assert unquote(url.fragment) in page.ids, f"Missing anchor: {href}"
        elif url.netloc == "wa.me":
            assert url.scheme == "https" and url.path == "/917845952592", "Wrong WhatsApp destination"
            text = parse_qs(url.query).get("text", [""])[0]
            assert text.startswith("Hi Navodhai,"), "Missing understandable prefilled message"
            messages.add(text)
        elif url.scheme == "mailto":
            assert url.path == "manjulajayanthi1@gmail.com", "Wrong email"
        elif url.scheme == "tel":
            assert url.path == "+917845952592", "Wrong phone"
        else:
            raise AssertionError(f"Unexpected destination: {href}")
    for topic in ("blouse making", "dress making", "customisation"):
        assert f"Hi Navodhai, I'd like to enquire about {topic}. Can we discuss my requirements?" in messages, "Missing topic fallback"
    assert "mailto:manjulajayanthi1@gmail.com" in page.links
    assert "tel:+917845952592" in page.links and "Coimbatore, Tamil Nadu" in source

    assets = {"index.html", *page.assets, *re.findall(r'url\("(assets/[^\"]+)"\)', css)}
    sizes = {}
    for asset in sorted(assets):
        assert not urlsplit(asset).scheme, f"External initial asset: {asset}"
        path = (directory / asset).resolve()
        assert path.is_relative_to(directory.resolve()) and path.is_file(), f"Missing asset: {asset}"
        content = path.read_bytes()
        sizes[asset] = {"raw": len(content), "transfer_estimate": len(gzip.compress(content, mtime=0)) if path.suffix in (".html", ".css", ".js") else len(content)}
    transfer = sum(value["transfer_estimate"] for value in sizes.values())
    fonts = sum(value["raw"] for name, value in sizes.items() if name.endswith(".woff2"))
    assert transfer < 450_000, "Initial resource budget exceeded"
    assert fonts < 120_000, "Font budget exceeded"
    assert sizes["script.js"]["transfer_estimate"] < 15_000, "JavaScript budget exceeded"
    print(json.dumps({"result": "pass", "directory": str(directory), "files": sizes, "estimated_initial_transfer": transfer, "font_bytes": fonts}, indent=2))
    print("Transfer estimates require actual host compression; no hosted speed result is claimed.")


if __name__ == "__main__":
    main()
