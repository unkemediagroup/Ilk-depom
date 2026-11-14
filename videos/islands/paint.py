# Code-drawn plates of Hashima (no free photo source reachable): island fortress + decaying apartment room.
import math, random, numpy as np
from PIL import Image, ImageDraw, ImageFilter

def sky(w, h):
    y = np.linspace(0, 1, h)[:, None, None]
    a = np.array([30, 36, 44], np.float32) + (np.array([110, 118, 120], np.float32) - [30, 36, 44]) * y ** 1.4
    im = Image.fromarray(np.repeat(a, w, 1).astype(np.uint8)).convert('RGBA')
    r = np.random.default_rng(1); n = r.random((h // 40, w // 40)); cl = Image.fromarray((n * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    c = Image.new('RGBA', (w, h), (20, 22, 26, 0)); c.putalpha(cl.point(lambda v: int(v * .55)))
    im.alpha_composite(c); return im

def island(w=2400, h=1800, close=False):
    im = sky(w, h); d = ImageDraw.Draw(im); r = random.Random(4)
    sea_y = int(h * .72)
    x0, x1 = int(w * .08), int(w * .92)
    if close: x0, x1 = -200, w + 200
    # buildings
    x = x0
    while x < x1:
        bw = r.randint(120, 300) if not close else r.randint(260, 520)
        bh = r.randint(250, 760) if not close else r.randint(600, 1250)
        top = sea_y - 80 - bh
        g = r.randint(70, 105); col = (g, g + 2, g + 4, 255)
        d.rectangle((x, top, x + bw, sea_y), fill=col)
        d.rectangle((x + bw - bw // 6, top, x + bw, sea_y), fill=(g - 25, g - 24, g - 22, 255))
        ww, wh = (14, 18) if not close else (30, 40)
        for yy in range(top + 20, sea_y - 100, wh + 16):
            for xx in range(x + 12, x + bw - 30, ww + 14):
                v = r.random()
                c = (18, 20, 22, 255) if v < .75 else ((40, 40, 38, 255) if v < .95 else (8, 8, 10, 255))
                d.rectangle((xx, yy, xx + ww, yy + wh), fill=c)
        for _ in range(int(bw * bh / 9000)):  # stains
            sx, sy = x + r.random() * bw, top + r.random() * bh
            d.line((sx, sy, sx + r.uniform(-4, 4), sy + r.uniform(30, 160)), fill=(40, 38, 34, 120), width=r.randint(2, 6))
        x += bw + r.randint(-20, 10)
    # sea wall
    d.polygon([(x0 - 60, sea_y - 90), (x1 + 60, sea_y - 90), (x1 + 120, sea_y + 40), (x0 - 120, sea_y + 40)], fill=(64, 64, 62, 255))
    # sea
    y = np.linspace(0, 1, h - sea_y)[:, None, None]
    a = np.array([40, 52, 60], np.float32) + (np.array([12, 18, 24], np.float32) - [40, 52, 60]) * y
    sea = Image.fromarray(np.repeat(a, w, 1).astype(np.uint8)).convert('RGBA'); im.paste(sea, (0, sea_y + 30))
    d = ImageDraw.Draw(im)
    for k in range(60):
        yy = sea_y + 40 + k * (h - sea_y) / 60; amp = 4 + k * .6
        d.line([(xx, yy + amp * math.sin(xx / 40 + k)) for xx in range(0, w, 20)], fill=(150, 165, 170, 70), width=2)
    sp = Image.new('RGBA', im.size, (0, 0, 0, 0)); sd = ImageDraw.Draw(sp)
    for _ in range(50):  # spray at the wall
        sx = r.uniform(x0, x1); s = r.uniform(30, 140)
        sd.ellipse((sx - s, sea_y - s * 1.2, sx + s, sea_y + s * .3), fill=(220, 225, 228, 70))
    im.alpha_composite(sp.filter(ImageFilter.GaussianBlur(25)))
    return im.filter(ImageFilter.SMOOTH)

def room(w=1600, h=2400):
    r = random.Random(7)
    im = Image.new('RGBA', (w, h), (80, 82, 74, 255)); d = ImageDraw.Draw(im)
    for _ in range(900):  # peeling paint
        x, y = r.random() * w, r.random() * h * .72; s = r.uniform(10, 90)
        g = r.randint(55, 120); d.ellipse((x, y, x + s, y + s * r.uniform(.4, 1.2)), fill=(g, g + 4, g - 6, 255))
    d.rectangle((0, int(h * .72), w, h), fill=(58, 48, 38, 255))           # floor
    for k in range(18): d.line((0, h * .72 + k * 40, w, h * .72 + k * 40 + 30), fill=(46, 38, 30, 255), width=3)
    # window with light
    d.rectangle((900, 380, 1450, 1200), fill=(200, 210, 210, 255))
    for k in range(1, 3): d.line((900 + k * 183, 380, 900 + k * 183, 1200), fill=(50, 50, 46, 255), width=14)
    d.line((900, 790, 1450, 790), fill=(50, 50, 46, 255), width=14)
    for _ in range(6):
        x = r.uniform(900, 1450); d.line((x, 380, x + r.uniform(-60, 60), 1200), fill=(60, 60, 56, 255), width=4)  # cracks
    # old CRT television
    d.rounded_rectangle((260, 1300, 820, 1760), 30, fill=(60, 50, 40, 255))
    d.rounded_rectangle((300, 1340, 650, 1660), 40, fill=(28, 34, 36, 255))
    d.ellipse((690, 1380, 760, 1450), fill=(30, 26, 22, 255)); d.ellipse((690, 1500, 760, 1570), fill=(30, 26, 22, 255))
    d.line((380, 1300, 300, 1120), fill=(40, 36, 30, 255), width=8); d.line((560, 1300, 650, 1100), fill=(40, 36, 30, 255), width=8)
    d.rectangle((300, 1760, 330, 1820), fill=(40, 34, 28, 255)); d.rectangle((750, 1760, 780, 1820), fill=(40, 34, 28, 255))
    for _ in range(140):  # debris
        x, y = r.uniform(0, w), r.uniform(h * .74, h); s = r.uniform(6, 40)
        g = r.randint(70, 140); d.polygon([(x, y), (x + s, y - s * .3), (x + s * .7, y + s * .4)], fill=(g, g - 6, g - 14, 255))
    g = Image.new('RGBA', (w, h), (0, 0, 0, 0)); ImageDraw.Draw(g).polygon([(900, 380), (1450, 380), (1200, h), (300, h)], fill=(230, 230, 210, 50))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(60)))
    return im.filter(ImageFilter.SMOOTH)

if __name__ == '__main__':
    island().convert('RGB').save('arch/hashima0.jpg', quality=92)
    island(1800, 2400, close=True).convert('RGB').save('arch/hashima1.jpg', quality=92)
    room().convert('RGB').save('arch/gunkan0.jpg', quality=92)
