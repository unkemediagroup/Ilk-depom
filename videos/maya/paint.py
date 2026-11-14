# Procedural "painted" Maya plates used when archive photos are unavailable.
import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

PW, PH = 1400, 2400

def grad(top, bot, pw=PW, ph=PH, p=1.0):
    y = np.linspace(0, 1, ph)[:, None, None] ** p
    a = np.array(top, np.float32) + (np.array(bot, np.float32) - np.array(top, np.float32)) * y
    return Image.fromarray(np.repeat(a, pw, 1).astype(np.uint8)).convert('RGBA')

def canopy(im, y0, col, seed, n=90, rmin=50, rmax=140, jitter=120):
    d = ImageDraw.Draw(im); r = random.Random(seed)
    for _ in range(n):
        x = r.random() * PW; y = y0 + r.random() * jitter; rr = rmin + r.random() * (rmax - rmin)
        c = tuple(max(0, min(255, int(v * (.8 + .4 * r.random())))) for v in col)
        d.ellipse((x - rr, y - rr * .8, x + rr, y + rr * .8), fill=c + (255,))
    d.rectangle((0, y0 + jitter * .6, PW, PH), fill=col + (255,))

def mist(im, y, a=120, h=260, col=(230, 220, 200)):
    m = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(m).rectangle((0, y, PW, y + h), fill=col + (a,))
    im.alpha_composite(m.filter(ImageFilter.GaussianBlur(h * .6)))

def rays(im, cx, cy, col=(255, 210, 140), a=60):
    m = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(m); r = random.Random(1)
    for k in range(14):
        ang = math.pi / 2 + (r.random() - .5) * 1.6; w = .02 + r.random() * .05
        d.polygon([(cx, cy), (cx + math.cos(ang - w) * 3000, cy + math.sin(ang - w) * 3000), (cx + math.cos(ang + w) * 3000, cy + math.sin(ang + w) * 3000)], fill=col + (a,))
    im.alpha_composite(m.filter(ImageFilter.GaussianBlur(30)))

def pyramid(im, cx, base, w, h, steps, col, light, comb=True, ruined=0., seed=0):
    d = ImageDraw.Draw(im); r = random.Random(seed)
    sh = h / steps
    for k in range(steps):
        ww = w * (1 - k / steps * .62); y1 = base - k * sh; y0 = y1 - sh
        d.rectangle((cx - ww, y0, cx + ww, y1), fill=col + (255,))
        d.rectangle((cx - ww, y0, cx - ww * .2, y0 + sh * .18), fill=light + (255,))          # lit ledge
        d.rectangle((cx + ww * .55, y0 + sh * .18, cx + ww, y1), fill=tuple(int(c * .7) for c in col) + (255,))
        if ruined:
            for _ in range(int(6 * ruined)):
                x = cx - ww + r.random() * ww * 2; yy = y0 + r.random() * sh; s = 8 + r.random() * 26
                d.ellipse((x - s, yy - s * .6, x + s, yy + s * .6), fill=(40 + r.randint(0, 30), 80 + r.randint(0, 40), 40, 255))
    sw = w * .16  # stairs
    d.polygon([(cx - sw, base), (cx + sw, base), (cx + sw * .55, base - h), (cx - sw * .55, base - h)], fill=tuple(int(c * .85) for c in col) + (255,))
    for k in range(40):
        yy = base - k * h / 40; t = k / 40; s = sw * (1 - t * .45)
        d.line((cx - s, yy, cx + s, yy), fill=light + (180,), width=2)
    top = base - h
    tw = w * .28
    d.rectangle((cx - tw, top - h * .16, cx + tw, top), fill=col + (255,))
    d.rectangle((cx - tw * .3, top - h * .11, cx + tw * .3, top), fill=(15, 10, 8, 255))
    if comb:
        d.rectangle((cx - tw * .7, top - h * .34, cx + tw * .7, top - h * .16), fill=tuple(int(c * .9) for c in col) + (255,))
        for k in range(4):
            d.rectangle((cx - tw * .55 + k * tw * .33, top - h * .3, cx - tw * .55 + k * tw * .33 + tw * .15, top - h * .2), fill=(30, 22, 18, 255))

def vines_on(im, seed, n=30, col=(34, 80, 36)):
    d = ImageDraw.Draw(im); r = random.Random(seed)
    for _ in range(n):
        x, y = r.random() * PW, r.random() * PH * .2; ang = math.pi / 2
        for s in range(r.randint(20, 70)):
            ang += (r.random() - .5) * .5; nx, ny = x + math.cos(ang) * 16, y + math.sin(ang) * 16
            d.line((x, y, nx, ny), fill=col + (255,), width=6)
            if s % 3 == 0: d.ellipse((nx - 14, ny - 8, nx + 14, ny + 8), fill=(col[0] + 20, col[1] + 40, col[2] + 10, 255))
            x, y = nx, ny

def engraving(im):
    """Sepia lithograph look: grayscale, hatch lines, paper."""
    g = np.asarray(im.convert('L'), np.float32) / 255.
    yy, xx = np.mgrid[0:g.shape[0], 0:g.shape[1]]
    hatch = ((xx + yy) % 9 < 4).astype(np.float32); hatch2 = ((xx - yy) % 11 < 4).astype(np.float32)
    v = np.where(g < .35, g * .6 * (1 - .5 * hatch * hatch2), np.where(g < .6, g * (1 - .25 * hatch), g))
    noise = np.random.default_rng(3).normal(0, .04, g.shape)
    v = np.clip(v + noise, 0, 1)
    paper = np.array([238, 222, 190], np.float32); ink = np.array([60, 40, 26], np.float32)
    out = ink + (paper - ink) * v[..., None]
    return Image.fromarray(out.astype(np.uint8)).convert('RGBA')

def tikal():
    im = grad((70, 40, 60), (250, 160, 80), p=1.3); d = ImageDraw.Draw(im)
    d.ellipse((520, 820, 880, 1180), fill=(255, 230, 170, 255))
    rays(im, 700, 1000)
    canopy(im, 1500, (60, 70, 60), 2, 60, 80, 160, 60)
    mist(im, 1300, 140)
    pyramid(im, 700, 1900, 430, 1150, 9, (88, 70, 58), (190, 150, 110), seed=1)
    mist(im, 1700, 120)
    canopy(im, 1820, (24, 46, 30), 3, 100, 70, 170)
    canopy(im, 2050, (12, 26, 16), 4, 80, 90, 200)
    return im

def palenque():
    im = grad((150, 175, 160), (210, 200, 160)); mist(im, 900, 160)
    canopy(im, 1100, (60, 100, 70), 5, 70, 80, 160)
    pyramid(im, 520, 1800, 380, 620, 5, (120, 112, 96), (200, 190, 160), comb=False, ruined=1, seed=2)
    d = ImageDraw.Draw(im)
    d.rectangle((780, 1350, 1300, 1800), fill=(130, 120, 100, 255))
    for k in range(5): d.rectangle((820 + k * 100, 1450, 870 + k * 100, 1800), fill=(40, 34, 28, 255))
    mist(im, 1500, 120)
    canopy(im, 1850, (30, 60, 36), 6, 110, 70, 170)
    vines_on(im, 7, 40)
    return im

def courtyard():
    im = grad((210, 210, 200), (170, 160, 140)); d = ImageDraw.Draw(im)
    canopy(im, 500, (90, 100, 90), 8, 80, 90, 200)
    d.rectangle((150, 900, 1250, 1700), fill=(150, 140, 120, 255))
    for k in range(6): d.rectangle((200 + k * 180, 1150, 290 + k * 180, 1700), fill=(40, 34, 30, 255))
    d.rectangle((150, 900, 1250, 1000), fill=(120, 110, 95, 255))
    for k in range(10):
        d.rectangle((100 + k * 125, 1700 + (k % 2) * 30, 200 + k * 125, 1780), fill=(110, 100, 85, 255))
    d.rectangle((0, 1780, PW, PH), fill=(140, 130, 110, 255))
    r = random.Random(9)
    for _ in range(60):  # rubble
        x, y = r.random() * PW, 1800 + r.random() * 500; s = 15 + r.random() * 50
        d.polygon([(x - s, y), (x, y - s * .7), (x + s, y), (x, y + s * .3)], fill=(100 + r.randint(0, 40),) * 3 + (255,))
    vines_on(im, 10, 50, (50, 60, 45))
    # tiny explorer figure
    d.ellipse((980, 1600, 1010, 1630), fill=(30, 26, 22, 255)); d.rectangle((985, 1630, 1005, 1700), fill=(30, 26, 22, 255))
    return engraving(im)

def stela():
    im = grad((190, 200, 185), (140, 140, 120)); d = ImageDraw.Draw(im)
    canopy(im, 300, (80, 100, 80), 11, 90, 100, 220)
    d.rounded_rectangle((470, 650, 930, 2050), 40, fill=(170, 160, 140, 255), outline=(60, 50, 40, 255), width=6)
    r = random.Random(12)
    d.ellipse((560, 720, 840, 980), fill=(120, 110, 95, 255), outline=(50, 40, 30, 255), width=6)  # face
    d.rectangle((620, 820, 660, 850), fill=(40, 32, 26, 255)); d.rectangle((740, 820, 780, 850), fill=(40, 32, 26, 255))
    for row in range(8):
        for col in range(2):
            x0 = 520 + col * 200; y0 = 1040 + row * 120
            d.rounded_rectangle((x0, y0, x0 + 170, y0 + 100), 20, outline=(60, 50, 40, 255), width=5)
            for _ in range(3):
                a, b = x0 + 20 + r.random() * 110, y0 + 15 + r.random() * 60
                d.ellipse((a, b, a + 30, b + 25), outline=(60, 50, 40, 255), width=4)
    d.rectangle((0, 2050, PW, PH), fill=(120, 110, 90, 255))
    vines_on(im, 13, 40, (50, 60, 45))
    return engraving(im)

def chichen():
    im = grad((20, 18, 40), (170, 70, 50), p=1.6)
    d = ImageDraw.Draw(im)
    pyramid(im, 700, 1700, 560, 760, 9, (60, 44, 40), (150, 90, 70), comb=False, seed=3)
    d.rectangle((0, 1700, PW, PH), fill=(30, 22, 20, 255))
    canopy(im, 1950, (14, 18, 14), 14, 60, 80, 180)
    return im

def cave():
    im = Image.new('RGBA', (PW, PH), (10, 8, 6, 255)); d = ImageDraw.Draw(im)
    g = Image.new('RGBA', (PW, PH), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((200, 700, 1200, 1900), fill=(200, 140, 70, 200))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(220)))
    r = random.Random(15)
    for k in range(26):  # stalactites
        x = r.random() * PW; L = 200 + r.random() * 600; w = 30 + r.random() * 70
        d.polygon([(x - w, 0), (x + w, 0), (x, L)], fill=(int(90 + r.random() * 60), int(66 + r.random() * 40), 44, 255))
    for k in range(18):  # stalagmites with growth bands
        x = r.random() * PW; L = 300 + r.random() * 900; w = 50 + r.random() * 100; b = PH - r.random() * 200
        d.polygon([(x - w, b), (x + w, b), (x + w * .15, b - L), (x - w * .15, b - L)], fill=(int(150 + r.random() * 60), int(110 + r.random() * 40), 70, 255))
        for j in range(12):
            yy = b - j * L / 12; ww = w * (1 - j / 12 * .85)
            d.line((x - ww, yy, x + ww, yy), fill=(90, 60, 36, 200), width=3)
    d.ellipse((200, 2150, 1200, 2500), fill=(16, 12, 9, 255))
    return im

def night_city():
    im = grad((6, 6, 16), (60, 24, 20), p=1.2); d = ImageDraw.Draw(im)
    pyramid(im, 700, 1900, 430, 1100, 9, (40, 28, 26), (120, 70, 50), seed=4)
    r = random.Random(16)
    g = Image.new('RGBA', (PW, PH), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for _ in range(14):
        x, y = r.random() * PW, 1700 + r.random() * 500
        gd.ellipse((x - 120, y - 160, x + 120, y + 60), fill=(255, 120, 30, 200))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(50)))
    canopy(im, 1950, (14, 10, 8), 17, 70, 80, 180)
    # spear silhouettes
    for _ in range(26):
        x = r.random() * PW; y = 2050 + r.random() * 250
        d.line((x, y, x + (r.random() - .5) * 200, y - 500), fill=(8, 6, 5, 255), width=8)
    return im

def ruins():
    im = grad((120, 150, 130), (200, 190, 150)); mist(im, 700, 150)
    canopy(im, 900, (50, 90, 60), 18, 80, 80, 180)
    pyramid(im, 700, 1900, 520, 900, 7, (110, 104, 88), (180, 170, 140), comb=True, ruined=3, seed=5)
    canopy(im, 1300, (36, 76, 44), 19, 30, 60, 120, 500)  # trees growing on it
    mist(im, 1600, 120)
    canopy(im, 1950, (22, 48, 28), 20, 100, 80, 190)
    vines_on(im, 21, 30)
    return im

PLATES = [tikal, palenque, courtyard, stela, chichen, cave, night_city, ruins]
if __name__ == '__main__':
    import os, sys
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'painted'); os.makedirs(out, exist_ok=True)
    for i, f in enumerate(PLATES):
        f().convert('RGB').filter(ImageFilter.SMOOTH).save(os.path.join(out, '%02d.jpg' % i), quality=92); print(i, f.__name__)
