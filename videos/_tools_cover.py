# Generic Shorts cover: python3 _tools_cover.py <projdir> <image> <zoom> <cx> <cy> "<small top>" "<line1>" "<line2 (accent)>" "<bottom1>" "<bottom2 (accent2)>" [accent rgb] [accent2 rgb]
import importlib.util, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
d, img, z, cx, cy, top, l1, l2, b1, b2 = sys.argv[1:11]
acc = tuple(int(x) for x in (sys.argv[11] if len(sys.argv) > 11 else '255,50,40').split(','))
acc2 = tuple(int(x) for x in (sys.argv[12] if len(sys.argv) > 12 else '255,210,60').split(','))
spec = importlib.util.spec_from_file_location('r', os.path.join(d, 'render.py')); r = importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
W, H = 1080, 1920
src = Image.open(os.path.join(d, img)).convert('RGB')
if src.width < 1600: src = src.resize((1600, int(src.height * 1600 / src.width)), Image.LANCZOS)
g0 = r.grade_color(src) if hasattr(r, 'grade_color') else (r.eerie(src) if hasattr(r, 'eerie') else src.convert('RGBA'))
im = r.cover(g0, 0, float(z), float(cx), float(cy))
g = np.zeros((H, W, 4), np.uint8)
a = np.clip(1 - np.linspace(0, 1, 900) ** 1.1, 0, 1) * 235; g[:900, :, 3] = a[:, None]
b = np.clip(np.linspace(0, 1, 750) ** 1.3, 0, 1) * 240; g[H - 750:, :, 3] = b[:, None]
im.alpha_composite(Image.fromarray(g))
def put(img, x, y, maxw=1010):
    if img.width > maxw: img = img.resize((maxw, int(img.height * maxw / img.width)), Image.LANCZOS)
    im.alpha_composite(img, (int(x - img.width / 2), int(y - img.height / 2)))
put(r.text_img(top, 'oswald', 58, (230, 225, 210, 255), 0, track=10, shadow=5), W / 2, 150)
put(r.text_img(l1, 'bebas', 220, (255, 255, 255, 255), 10, (0, 0, 0), shadow=12), W / 2, 330)
put(r.text_img(l2, 'bebas', 250, acc + (255,), 10, (0, 0, 0), shadow=12), W / 2, 540)
put(r.text_img(b1, 'bebas', 160, (255, 255, 255, 255), 10, (0, 0, 0), shadow=12), W / 2, 1540)
put(r.text_img(b2, 'bebas', 210, acc2 + (255,), 10, (0, 0, 0), shadow=12), W / 2, 1720)
im.convert('RGB').save(os.path.join(d, 'cover.jpg'), quality=95); print('ok')
