"""Check the static draft's contact, navigation, privacy and size contracts."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit
import gzip
import json


SITE = Path(__file__).resolve().parent


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.assets = []
        self.meta = {}
        self.scripts = 0
        self.forms = 0
        self.headings = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.assets.append(attrs["href"])
        if tag in ("img", "script", "iframe", "source"):
            self.assets.append(attrs.get("src", ""))
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property"))] = attrs.get("content")
        if tag == "script":
            self.scripts += 1
        if tag == "form":
            self.forms += 1
        if tag in ("h1", "h2", "h3"):
            self.headings.append(tag)


def main():
    source = (SITE / "index.html").read_text(encoding="utf-8")
    page = Page()
    page.feed(source)
    assert len(page.ids) == len(set(page.ids)), "Duplicate document IDs"
    assert page.headings.count("h1") == 1, "Expected one primary heading"
    assert not page.scripts and not page.forms, "The page must be static and form-free"
    assert page.meta.get("robots") == "noindex, nofollow", "Draft must remain noindex"
    assert "og:url" not in page.meta, "The public domain is not known"
    assert 'rel="canonical"' not in source, "Do not invent a canonical domain"
    assert "Disallow: /" in (SITE / "robots.txt").read_text(), "Draft crawling policy missing"

    whatsapp = []
    for href in page.links:
        assert href and href != "#", "Empty/placeholder link"
        url = urlsplit(href)
        if href.startswith("#"):
            assert unquote(url.fragment) in page.ids, f"Broken anchor: {href}"
        elif url.netloc == "wa.me":
            assert url.scheme == "https" and url.path == "/917845952592", "Wrong WhatsApp number"
            assert parse_qs(url.query).get("text") == [
                "Hi, I'd like to discuss a custom outfit."
            ], "Wrong prefilled message"
            whatsapp.append(href)
        elif url.scheme == "mailto":
            assert url.path == "manjulajayanthi1@gmail.com", "Wrong email destination"
        elif url.scheme == "tel":
            assert url.path == "+917845952592", "Wrong phone destination"
        else:
            raise AssertionError(f"Unexpected destination: {href}")

    assert len(whatsapp) == 2 and len(set(whatsapp)) == 1, "Enquiry links must match"
    assert "mailto:manjulajayanthi1@gmail.com" in page.links, "Email alternative missing"
    assert "tel:+917845952592" in page.links, "Phone link missing"
    assert "Coimbatore, Tamil Nadu" in source, "Confirmed service area missing"
    for asset in page.assets:
        assert asset and not urlsplit(asset).scheme, f"Unexpected external asset: {asset}"
        target = (SITE / asset).resolve()
        assert target.is_relative_to(SITE.resolve()) and target.is_file(), f"Missing asset: {asset}"

    files = [SITE / name for name in ("index.html", "styles.css", "robots.txt")]
    assert {path.suffix for path in files} <= {".html", ".css", ".txt"}, "Unexpected draft output"
    sizes = {
        str(path.relative_to(SITE)): {
            "raw_bytes": path.stat().st_size,
            "gzip_bytes": len(gzip.compress(path.read_bytes(), mtime=0)),
        }
        for path in files
    }
    raw_total = sum(value["raw_bytes"] for value in sizes.values())
    gzip_total = sum(value["gzip_bytes"] for value in sizes.values())
    assert raw_total < 350_000, "Raw bytes exceed even the compressed-transfer budget"
    print(json.dumps({"result": "pass", "files": sizes, "raw_total": raw_total,
                      "gzip_total": gzip_total, "runtime_javascript_bytes": 0}, indent=2))
    print("Gzip bytes are estimates, not evidence that a public host enables compression.")


if __name__ == "__main__":
    main()
