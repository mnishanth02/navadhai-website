"""Download only the two selected Latin font subsets and their licence notices."""

from pathlib import Path
import re
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[3]
DEST = ROOT / "docs" / "archive" / "static-site" / "assets" / "fonts"
DEST.mkdir(parents=True, exist_ok=True)
URL = (
    "https://fonts.googleapis.com/css2?"
    "family=Bricolage+Grotesque:opsz,wght@12..96,600&"
    "family=Instrument+Sans:wght@400..600&display=swap"
)
request = Request(URL, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"})
css = urlopen(request, timeout=30).read().decode()
names = {
    "Bricolage Grotesque": ("bricolage-latin.woff2", "bricolagegrotesque"),
    "Instrument Sans": ("instrument-latin.woff2", "instrumentsans"),
}
for block in re.findall(r"/\* latin \*/\s*(@font-face\s*\{.*?\})", css, re.S):
    family = re.search(r"font-family:\s*'([^']+)'", block).group(1)
    source = re.search(r"url\((https:[^)]+)\)", block).group(1)
    filename, folder = names[family]
    (DEST / filename).write_bytes(urlopen(source, timeout=30).read())
    licence_url = f"https://raw.githubusercontent.com/google/fonts/main/ofl/{folder}/OFL.txt"
    (DEST / f"{folder}-OFL.txt").write_bytes(urlopen(licence_url, timeout=30).read())
    print(f"{family}: {(DEST / filename).stat().st_size} bytes; licence saved")
assert all((DEST / value[0]).is_file() for value in names.values()), "Missing selected font subset"
