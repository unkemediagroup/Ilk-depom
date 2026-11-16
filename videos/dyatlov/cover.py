# YT Shorts cover (1080x1920) for the Dyatlov video.
import importlib.util, os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('r', os.path.join(HERE, 'render.py')); r = importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
W, H = 1080, 1920
tent = r.grade(Image.open(os.path.join(HERE, 'raw', '00.jpg')).convert('RGB').resize((1618, 1280), Image.LANCZOS))
im = r.cover(tent, 0, 1.45, .62, .55)
# darken top & bottom for text
g = np.zeros((H, W, 4), np.uint8)
a = np.clip(1 - np.linspace(0, 1, 900) ** 1.1, 0, 1) * 235; g[:900, :, 3] = a[:, None]
b = np.clip(np.linspace(0, 1, 700) ** 1.3, 0, 1) * 235; g[H - 700:, :, 3] = b[:, None]
im.alpha_composite(Image.fromarray(g))
# red glow + circle on the slashed tent
gl = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(gl).ellipse((420, 860, 1060, 1260), fill=(255, 30, 20, 70))
im.alpha_composite(gl.filter(ImageFilter.GaussianBlur(60)))
d = ImageDraw.Draw(im)
for k in range(3): d.ellipse((470 - k * 3, 880 - k * 3, 1040 + k * 3, 1220 + k * 3), outline=(255, 45, 35, 255), width=9)
# arrow
d.line((300, 760, 470, 930), fill=(255, 45, 35, 255), width=22); d.polygon([(500, 960), (420, 930), (470, 880)], fill=(255, 45, 35, 255))
def put(img, x, y): im.alpha_composite(img, (int(x - img.width / 2), int(y - img.height / 2)))
put(r.text_img('DYATLOV PASS · 1959', 'oswald', 58, (210, 230, 250, 255), 0, track=10, shadow=5), W / 2, 150)
put(r.text_img('9 HIKERS', 'bebas', 250, (255, 255, 255, 255), 10, (0, 0, 0), shadow=12), W / 2, 330)
put(r.text_img('NONE SURVIVED', 'bebas', 190, (255, 50, 40, 255), 10, (0, 0, 0), shadow=12), W / 2, 530)
put(r.text_img('WHAT REALLY', 'bebas', 170, (255, 255, 255, 255), 10, (0, 0, 0), shadow=12), W / 2, 1530)
put(r.text_img('HAPPENED?', 'bebas', 240, (255, 210, 60, 255), 10, (0, 0, 0), shadow=12), W / 2, 1710)
im.convert('RGB').save(os.path.join(HERE, 'cover.jpg'), quality=95); print('ok')
