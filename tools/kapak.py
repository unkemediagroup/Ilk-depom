"""Shorts kapak üretici (1080x1920). Kullanım: python3 kapak.py kapak.json
{"hero":"a.jpg","hero_focus":[0.5,0.2],"hero_h":1250,"bg":"b.jpg","bg_focus":[0.5,0.6],
 "lines":[["TEXT","white|gold",size],...],"text_y":1040,"badge":"SECRET LOOPHOLES","badge_y":900,
 "corner":"?","out":"x.jpg"}"""
import sys, json, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import numpy as np
W, H = 1080, 1920
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "fonts") + "/"
c = json.load(open(sys.argv[1])); base = os.path.dirname(os.path.abspath(sys.argv[1]))
P = lambda p: p if os.path.isabs(p) else os.path.join(base, p)
COL = {"white": (255, 255, 255), "gold": (255, 198, 58), "red": (235, 40, 50)}
def cover(im, w, h, f):
    s = max(w / im.width, h / im.height); im = im.resize((int(im.width * s + .5), int(im.height * s + .5)), Image.LANCZOS)
    x = int((im.width - w) * f[0]); y = int((im.height - h) * f[1]); return im.crop((x, y, x + w, y + h))
canvas = ImageEnhance.Brightness(cover(Image.open(P(c["bg"])).convert("RGB"), W, H, c.get("bg_focus", [.5, .6]))).enhance(c.get("bg_bright", .55))
hh = c.get("hero_h", 1250)
m = cover(Image.open(P(c["hero"])).convert("RGB"), W, hh, c.get("hero_focus", [.5, .2]))
m = ImageEnhance.Contrast(m).enhance(1.08).filter(ImageFilter.UnsharpMask(2, 80, 2))
ys = np.arange(hh)[:, None] * np.ones((1, W)); mask = (255 * np.clip((hh - ys) / 380, 0, 1)).astype("uint8")
canvas.paste(m, (0, 0), Image.fromarray(mask))
a = np.array(canvas).astype(np.float32); yy = np.linspace(0, 1, H)[:, None, None]; xx = np.linspace(-1, 1, W)[None, :, None]
a *= (1 - 0.55 * np.clip((yy - .55) / .45, 0, 1)) * (1 - .25 * xx ** 2)
canvas = Image.fromarray(a.clip(0, 255).astype("uint8")).convert("RGBA")
def txt(s, font, fill, stroke=12):
    b = font.getbbox(s, stroke_width=stroke); w, h = b[2] - b[0] + 60, b[3] - b[1] + 60
    im = Image.new("RGBA", (w, h)); ImageDraw.Draw(im).text((30 - b[0], 30 - b[1]), s, font=font, fill=fill, stroke_width=stroke, stroke_fill=(0, 0, 0))
    sh = Image.new("RGBA", (w, h)); sh.paste((0, 0, 0, 200), (0, 0), im.split()[3]); sh = sh.filter(ImageFilter.GaussianBlur(14))
    out = Image.new("RGBA", (w, h)); out.alpha_composite(sh, (0, 10)); out.alpha_composite(im); return out
def fitfont(s, sz, maxw=1000):
    while True:
        f = ImageFont.truetype(F + "Anton-Regular.ttf", sz)
        if f.getbbox(s, stroke_width=12)[2] <= maxw or sz < 40: return f
        sz -= 4
y = c.get("text_y", 1040)
for s, col, sz in c["lines"]:
    im = txt(s, fitfont(s, sz), COL.get(col, col)); canvas.alpha_composite(im, ((W - im.width) // 2, y)); y += im.height - 48
if c.get("badge"):
    fb = ImageFont.truetype(F + "Montserrat.ttf", 52); fb.set_variation_by_axes([900]); s = c["badge"]
    b = fb.getbbox(s); bw, bh = b[2] - b[0] + 70, b[3] - b[1] + 40
    bd = Image.new("RGBA", (bw, bh)); d = ImageDraw.Draw(bd)
    d.rounded_rectangle((0, 0, bw - 1, bh - 1), 16, fill=COL.get(c.get("badge_col", "red")) + (255,)); d.text((35 - b[0], 20 - b[1]), s, font=fb, fill="white")
    bd = bd.rotate(-6, expand=True, resample=Image.BICUBIC); canvas.alpha_composite(bd, (W - bd.width - 40, c.get("badge_y", 900)))
if c.get("corner"):
    q = txt(c["corner"], ImageFont.truetype(F + "Anton-Regular.ttf", c.get("corner_size", 260)), COL["gold"])
    canvas.alpha_composite(q.rotate(12, expand=True, resample=Image.BICUBIC), tuple(c.get("corner_xy", [40, 60])))
canvas.convert("RGB").save(P(c["out"]), quality=93); print(P(c["out"]))
