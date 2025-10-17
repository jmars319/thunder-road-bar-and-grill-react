#!/usr/bin/env python3
"""Generate a multi-resolution favicon.ico from available PNG files in public/.

Searches for common PNG sizes (16,32,48,64,96,128,192,256). Uses Pillow to
combine them into a single ICO file at frontend/public/favicon.ico.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'public'
SIZES = [16, 32, 48, 64, 96, 128, 192, 256]

def find_png_for_size(size):
    candidates = [f'favicon-{size}x{size}.png', f'{size}.png']
    for name in candidates:
        p = ROOT / name
        if p.exists():
            return p
    return None

def main():
    images = []
    for s in SIZES:
        p = find_png_for_size(s)
        if p:
            try:
                img = Image.open(p).convert('RGBA')
                if img.size != (s, s):
                    img = img.resize((s, s), Image.LANCZOS)
                images.append(img)
            except Exception as e:
                print(f'Failed to load {p}: {e}', file=sys.stderr)

    if not images:
        print('No source PNGs found for favicon generation.', file=sys.stderr)
        sys.exit(1)

    out = ROOT / 'favicon.ico'
    # Save first image with sizes parameter to include all
    images[0].save(out, format='ICO', sizes=[im.size for im in images])
    print(f'Wrote {out} with {len(images)} sizes')

if __name__ == '__main__':
    main()
