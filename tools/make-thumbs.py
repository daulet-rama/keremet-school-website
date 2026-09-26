#!/usr/bin/env python3
"""Small previews for document scans (ui.docList thumbs).

For every JPG/PNG in public/assets/docs/ writes public/assets/docs/thumbs/<name>.webp: 240x320 (3:4, cropped
from the top like the card shows it), WebP quality 72, ~10-20 KB. The document link still opens the full scan.
Run after adding or replacing a scan:  python tools/make-thumbs.py   (needs Pillow: pip install pillow)
"""
from pathlib import Path
from PIL import Image, ImageOps

DOCS = Path(__file__).resolve().parent.parent / 'public' / 'assets' / 'docs'
OUT = DOCS / 'thumbs'
W, H = 240, 320

OUT.mkdir(exist_ok=True)
for src in sorted(DOCS.iterdir()):
    if src.suffix.lower() not in ('.jpg', '.jpeg', '.png'):
        continue
    dst = OUT / (src.stem + '.webp')
    if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
        continue
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert('RGB')
        im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.0))
        im.save(dst, 'WEBP', quality=72, method=6)
    print(f'{dst.relative_to(DOCS.parent.parent.parent)}  {dst.stat().st_size // 1024} KB')
