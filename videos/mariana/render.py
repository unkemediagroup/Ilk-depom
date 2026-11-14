# Mariana Trench — YT Shorts renderer (1080x1920, 30 fps).
# Usage: python3 render.py [--preview t1,t2,...] [--workers N]
import json, math, os, subprocess, sys, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
DUR = 76.3
FD = os.path.join(HERE, 'fonts')

# ---------------------------------------------------------------- helpers
_fc = {}
def F(name, size):
    k = (name, size)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(os.path.join(FD, {'bebas': 'bebas-neue-latin-400-normal.woff',
            'oswald': 'oswald-latin-700-normal.woff', 'type': 'special-elite-latin-400-normal.woff',
            'inter': 'inter-latin-900-normal.woff', 'inter7': 'inter-latin-700-normal.woff'}[name]), size)
    return _fc[k]

def cl(x, a=0., b=1.): return a if x < a else b if x > b else x
def eo(x): x = cl(x); return 1 - (1 - x) ** 3
def eio(x): x = cl(x); return 3 * x * x - 2 * x * x * x
def back(x, s=1.7): x = cl(x); x -= 1; return x * x * ((s + 1) * x + s) + 1
def seg(t, a, b): return cl((t - a) / (b - a)) if b > a else float(t >= a)
def pulse(t, a, b): return 0. if t < a else 1 - seg(t, a, b)
def lerp(a, b, x): return a + (b - a) * x

_tc = {}
def text_img(txt, font, size, fill=(255, 255, 255), stroke=0, sfill=(0, 0, 0), shadow=0, track=0):
    k = (txt, font, size, fill, stroke, sfill, shadow, track)
    if k in _tc: return _tc[k]
    f = F(font, size)
    if track:
        ws = [f.getbbox(c)[2] - f.getbbox(c)[0] if c != ' ' else size * .25 for c in txt]
        tw = int(sum(ws) + track * (len(txt) - 1))
    else:
        bb = f.getbbox(txt, stroke_width=stroke); tw = bb[2] - bb[0]
    asc, desc = f.getmetrics()
    pad = stroke + shadow * 3 + 10
    im = Image.new('RGBA', (int(tw + pad * 2), asc + desc + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    def draw(dd, off, col, scol):
        if track:
            x = pad
            for c, w_ in zip(txt, ws):
                if c != ' ': dd.text((x - f.getbbox(c)[0] + off, pad + off), c, font=f, fill=col, stroke_width=stroke, stroke_fill=scol)
                x += w_ + track
        else:
            dd.text((pad - f.getbbox(txt, stroke_width=stroke)[0] + off, pad + off), txt, font=f, fill=col, stroke_width=stroke, stroke_fill=scol)
    if shadow:
        sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); draw(ImageDraw.Draw(sh), shadow, (0, 0, 0, 200), (0, 0, 0, 200))
        im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(shadow)))
        d = ImageDraw.Draw(im)
    draw(d, 0, fill, sfill)
    _tc[k] = im
    return im

def put(base, im, cx, cy, scale=1., alpha=1., rot=0.):
    if alpha <= 0.003 or scale <= 0.01: return
    if abs(scale - 1) > .005:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.BILINEAR)
    if rot: im = im.rotate(rot, Image.BILINEAR, expand=True)
    if alpha < .997:
        a = im.getchannel('A').point(lambda v: int(v * alpha)); im = im.copy(); im.putalpha(a)
    base.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2))) if (0 <= int(cx - im.width / 2) and 0 <= int(cy - im.height / 2) and int(cx - im.width / 2) + im.width <= base.width and int(cy - im.height / 2) + im.height <= base.height) else paste_clip(base, im, int(cx - im.width / 2), int(cy - im.height / 2))

def paste_clip(base, im, x, y):
    x0, y0 = max(0, x), max(0, y); x1, y1 = min(base.width, x + im.width), min(base.height, y + im.height)
    if x1 <= x0 or y1 <= y0: return
    base.alpha_composite(im.crop((x0 - x, y0 - y, x1 - x, y1 - y)), (x0, y0))

def glow(im, r, k=1.):
    g = im.filter(ImageFilter.GaussianBlur(r))
    if k != 1: g.putalpha(g.getchannel('A').point(lambda v: min(255, int(v * k))))
    out = Image.new('RGBA', im.size, (0, 0, 0, 0)); out.alpha_composite(g); out.alpha_composite(im); return out

def cover(src, t, z=1., cx=.5, cy=.5):
    """Ken-burns crop of src to W x H. z>=1 zoom. cx,cy = focus in src (0..1)."""
    sw, sh = src.size
    s = max(W / sw, H / sh) * z
    cw, ch = W / s, H / s
    x0 = cl(cx * sw - cw / 2, 0, sw - cw); y0 = cl(cy * sh - ch / 2, 0, sh - ch)
    return src.transform((W, H), Image.EXTENT, (x0, y0, x0 + cw, y0 + ch), Image.BILINEAR)

def grade(im, shadow=(6, 12, 22), high=(222, 236, 248), contrast=1.25):
    g = ImageOps.autocontrast(im.convert('L'), cutoff=1)
    g = g.point(lambda v: int(cl(((v / 255 - .5) * contrast + .5)) * 255))
    return ImageOps.colorize(g, shadow, high).convert('RGBA')

def rng(seed): return random.Random(seed)

# ---------------------------------------------------------------- captions
WORDS = json.load(open(os.path.join(HERE, 'words.json')))
ws = []
for w in WORDS:
    t_ = w['w']
    if t_.startswith('-') and ws: ws[-1]['w'] += t_; ws[-1]['e'] = w['e']; continue
    ws.append(dict(w=t_, s=w['s'], e=w['e']))
for w in ws:
    if w['w'].lower().startswith('mega-drought'): w['w'] = 'megadrought'
KEY = {'MAYA', 'PYRAMIDS', 'EMPIRE', 'VANISH', 'VINES', 'EMPTY', 'SOUL', 'BEHIND', 'CATASTROPHIC', 'TERRIFYING', 'STALAGMITES',
       'MEGADROUGHT', 'CENTURY-LONG', 'WATER', 'FAMINE', 'BRUTAL', 'APOCALYPTIC', 'CIVIL', 'WARS', 'BLOOD', 'ABANDONED', 'DYING',
       'CATASTROPHE', 'SUICIDE', 'RUIN', 'UNKNOWN', 'COLLAPSED', 'COSMOS', 'DRIED'}
def norm(t): return ''.join(c for c in t.upper() if c.isalnum() or c in "-°'").strip("'")
groups = []; cur = []
for i, w in enumerate(ws):
    cur.append(w)
    gap = ws[i + 1]['s'] - w['e'] if i + 1 < len(ws) else 9
    if w['w'][-1] in ',.?!' or len(cur) >= 3 or gap > .3 or len(''.join(x['w'] for x in cur)) > 16:
        groups.append(cur); cur = []
if cur: groups.append(cur)
for i, g in enumerate(groups):
    g0 = g[0]['s'] - .06
    g1 = min(groups[i + 1][0]['s'] - .06, g[-1]['e'] + .5) if i + 1 < len(groups) else g[-1]['e'] + .8
    groups[i] = dict(words=g, a=g0, b=g1)
def draw_caption(base, t, y=1390):
    for g in groups:
        if g['a'] <= t < g['b']: break
    else: return
    lt = t - g['a']
    pop = 1 + .14 * (1 - eo(lt / .14))
    size = 92
    parts = []
    for w in g['words']:
        n = norm(w['w']); act = w['s'] - .04 <= t
        cur_w = w['s'] - .04 <= t < w['e'] + .12
        if n in KEY: col = (255, 60, 50) if act else (255, 255, 255)
        else: col = (255, 214, 64) if cur_w else (255, 255, 255)
        disp = w['w'].upper().rstrip(',.')
        parts.append(text_img(disp, 'inter', size, col, 9, (0, 0, 0), shadow=6))
    gapx = 4
    tw = sum(p.width for p in parts) - gapx * (len(parts) - 1)
    line = Image.new('RGBA', (tw, max(p.height for p in parts)), (0, 0, 0, 0)); x = 0
    for p in parts: line.alpha_composite(p, (x, 0)); x += p.width - 26 + gapx
    line = line.crop((0, 0, max(1, x + 26), line.height))
    sc = pop * min(1., 980 / line.width)
    put(base, line, W / 2, y, sc)

# ---------------------------------------------------------------- particles
SN = [(rng(i).random(), rng(i + 999).random(), rng(i + 77).random()) for i in range(220)]
def snow(base, t, n=140, wind=40., fall=120., big=1., streak=0., alpha=1.):
    d = ImageDraw.Draw(base)
    for i in range(n):
        a, b, c = SN[i]
        sz = (1.2 + c * 4.5) * big
        sp = fall * (.5 + c)
        x = (a * (W + 200) + wind * (.5 + c) * t + 30 * math.sin(t * (.6 + c) + i)) % (W + 200) - 100
        y = (b * (H + 100) + sp * t) % (H + 100) - 50
        al = int((90 + 150 * c) * alpha)
        if streak > 0:
            d.line((x, y, x - wind * .06 * streak * (.5 + c), y - sp * .06 * streak), fill=(235, 242, 255, al), width=max(1, int(sz * .8)))
        else:
            d.ellipse((x - sz, y - sz, x + sz, y + sz), fill=(235, 242, 255, al))

def flash(base, a, col=(255, 255, 255)):
    if a <= 0: return
    base.alpha_composite(Image.new('RGBA', (W, H), col + (int(255 * cl(a)),)))

def darken(base, a): flash(base, a, (0, 0, 0))

def label(base, txt, y, t, t0, size=54, col=(170, 210, 240), font='oswald', track=6, bar=True):
    a = eo((t - t0) / .35)
    if a <= 0: return
    im = text_img(txt, font, size, col + (255,), 0, track=track)
    x = W / 2
    put(base, im, x, y + 20 * (1 - a), 1, a)
    if bar:
        d = ImageDraw.Draw(base); bw = (im.width / 2 + 10) * a
        d.line((x - bw, y + im.height / 2 + 4, x + bw, y + im.height / 2 + 4), fill=(255, 60, 50, int(255 * a)), width=5)

def slam(base, txt, t, t0, y, size=200, col=(255, 255, 255), font='bebas', stroke=0, rot=0., out=None):
    if t < t0: return
    a = eo((t - t0) / .18); s = lerp(1.7, 1, eo((t - t0) / .22))
    if out is not None: a *= 1 - seg(t, out, out + .2)
    put(base, text_img(txt, font, size, col + (255,), stroke, (0, 0, 0), shadow=8), W / 2, y, s, a, rot)

def shake(t, t0, amp=18, dur=.35):
    k = seg(t, t0, t0 + dur)
    if k <= 0 or k >= 1: return 0, 0
    e = (1 - k) ** 2 * amp
    return e * math.sin(t * 90), e * math.cos(t * 77)

# ---------------------------------------------------------------- scenes
_TOP = None
def topshade(im, k=.75):
    global _TOP
    if _TOP is None:
        g = np.zeros((H, W, 4), np.uint8); a = np.clip(1 - np.linspace(0, 1, 800) ** 1.2, 0, 1) * 255
        g[:800, :, 3] = a[:, None]; _TOP = Image.fromarray(g)
    if k >= .99: im.alpha_composite(_TOP)
    else:
        t2 = _TOP.copy(); t2.putalpha(_TOP.getchannel('A').point(lambda v: int(v * k))); im.alpha_composite(t2)


# ---------------------------------------------------------------- maya particles
MO = [(rng(i).random(), rng(i + 999).random(), rng(i + 77).random()) for i in range(240)]
def motes(base, t, n=60, col=(255, 210, 140), rise=-30., drift=12., size=1., alpha=1., ember=False):
    d = ImageDraw.Draw(base)
    for i in range(n):
        a, b, c = MO[i]
        sz = (1.5 + c * 4) * size
        x = (a * W + drift * math.sin(t * (.4 + c) + i * 1.7) * 6 + (t * 25 * c if ember else 0)) % W
        y = (b * (H + 100) + rise * (.4 + c) * t) % (H + 100) - 50
        fl = .55 + .45 * math.sin(t * (2 + c * 5) + i)
        al = int((80 + 170 * c) * alpha * fl)
        d.ellipse((x - sz, y - sz, x + sz, y + sz), fill=col + (al,))

def vines(base, t, t0, n=10, seed=1, col=(30, 70, 30)):
    """Vines growing in from the frame edges."""
    k = cl((t - t0) / 3.0)
    if k <= 0: return
    d = ImageDraw.Draw(base); r = rng(seed)
    for v in range(n):
        side = v % 4
        if side == 0: x, y, ang = r.random() * W, -20, math.pi / 2
        elif side == 1: x, y, ang = r.random() * W, H + 20, -math.pi / 2
        elif side == 2: x, y, ang = -20, r.random() * H, 0
        else: x, y, ang = W + 20, r.random() * H, math.pi
        L = int(60 * eo(k * (0.7 + r.random() * .6)))
        wd = 16 + r.random() * 10; cshade = tuple(int(c * (.7 + .5 * r.random())) for c in col)
        for s in range(L):
            ang += (r.random() - .5) * .5; nx, ny = x + math.cos(ang) * 14, y + math.sin(ang) * 14
            d.line((x, y, nx, ny), fill=cshade + (255,), width=int(max(3, wd * (1 - s / 70))))
            if s % 5 == 2:
                lx, ly = nx + math.cos(ang + 1.6) * 22, ny + math.sin(ang + 1.6) * 22
                d.ellipse((lx - 15, ly - 9, lx + 15, ly + 9), fill=(cshade[0] + 20, cshade[1] + 40, cshade[2] + 15, 255))
            if s % 5 == 4:
                lx, ly = nx + math.cos(ang - 1.6) * 22, ny + math.sin(ang - 1.6) * 22
                d.ellipse((lx - 14, ly - 8, lx + 14, ly + 8), fill=(cshade[0] + 10, cshade[1] + 30, cshade[2] + 10, 255))
            x, y = nx, ny

def photo(A, key, t, t0, t1, z0, z1, cx0=.5, cx1=.5, cy0=.5, cy1=.5):
    k = eio((t - t0) / (t1 - t0))
    return cover(A[key], t, lerp(z0, z1, k), lerp(cx0, cx1, k), lerp(cy0, cy1, k))

KEY = {'PITCH-BLACK', 'ABYSS', 'MARIANA', 'TRENCH', '11', 'ALIEN', 'CHALLENGER', 'DEEP', 'CRUSHING', '8', 'TONS', 'FLATTEN',
       'PAPER', 'DARKNESS', 'FREEZING', 'EXTREME', 'HOSTILE', 'PHANTOM-LIKE', 'GHOSTFISH', 'GIANT', 'AMPHIPODS', 'VOLCANOES',
       'SULFUR', 'VENTS', 'SUNLIGHT', 'MYSTERIOUS', 'SECRETS', 'UNEXPLORED', 'UNKNOWN'}

# ================================================================ MARIANA — assets
DUR = 59.48
DEPTH = 10935

def load_assets():
    A = {}
    A['grain'] = [np.random.default_rng(k).normal(0, 6, (H, W, 1)).astype(np.float32) for k in range(6)]
    yy, xx = np.mgrid[0:H, 0:W]; rr2 = np.sqrt(((xx - W / 2) / (W * .62)) ** 2 + ((yy - H / 2) / (H * .58)) ** 2)
    A['vig'] = (1 - .7 * np.clip(rr2 - .4, 0, 1) ** 1.2)[..., None].astype(np.float32)
    # abyss background
    y = np.linspace(0, 1, H)[:, None]
    ab = (np.array([4, 18, 34]) + (np.array([0, 3, 8]) - np.array([4, 18, 34])) * y[..., None] ** .7).repeat(W, 1)
    A['abyss'] = Image.fromarray(ab.astype(np.uint8)).convert('RGBA')
    # tall ocean column for the dive (surface -> black)
    CH = H * 4
    y = np.linspace(0, 1, CH)[:, None]
    cols = np.array([[90, 190, 230], [20, 90, 150], [6, 34, 70], [2, 10, 24], [0, 2, 6]], np.float32)
    idx = np.clip(y * 4, 0, 3.999); i0 = idx.astype(int)[:, 0]; f = (idx - i0[:, None])
    col = cols[i0] * (1 - f) + cols[i0 + 1] * f
    A['column'] = Image.fromarray(np.repeat(col[:, None, :], W, 1).astype(np.uint8)).convert('RGBA')
    # seafloor silhouette
    r = np.random.default_rng(4); xs = np.arange(W)
    fl = 1500 + sum(60 / (k + 1) * np.sin(xs / W * 6.28 * (k + 1) + r.random() * 6) for k in range(6))
    fl += np.cumsum(r.normal(0, 2, W)); fl -= np.convolve(fl - 1500, np.ones(80) / 80, 'same') * 0
    floor = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(floor)
    d.polygon([(0, H)] + [(int(x), float(fl[x])) for x in range(0, W, 3)] + [(W, H)], fill=(10, 16, 22, 255))
    for x in range(0, W - 3, 3): d.line((x, fl[x], x + 3, fl[x + 3]), fill=(40, 70, 90, 255), width=3)
    A['floor'] = floor
    return A

# ---------------------------------------------------------------- deep particles
def msnow(base, t, n=120, speed=40., alpha=1., col=(200, 230, 240)):
    """Marine snow drifting slowly; positive speed = camera descending (snow rises)."""
    d = ImageDraw.Draw(base)
    for i in range(n):
        a, b, c = MO[i]
        sz = .8 + c * 2.6
        x = (a * W + 14 * math.sin(t * (.3 + c) + i)) % W
        y = (b * (H + 60) - speed * (.4 + c) * t) % (H + 60) - 30
        d.ellipse((x - sz, y - sz, x + sz, y + sz), fill=col + (int((50 + 120 * c) * alpha),))

def biolum(base, t, n=40, col=(80, 255, 230), alpha=1.):
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(g)
    for i in range(n):
        a, b, c = MO[i + 100]
        x = (a * W + 40 * math.sin(t * .5 + i)) % W; y = (b * H + 30 * math.cos(t * .4 + i * 2)) % H
        fl = max(0, math.sin(t * (1 + c * 2) + i * 3)) ** 3
        s = 4 + c * 8
        d.ellipse((x - s, y - s, x + s, y + s), fill=col + (int(255 * fl * alpha),))
    base.alpha_composite(g.filter(ImageFilter.GaussianBlur(6))); base.alpha_composite(g)

def lightbeam(base, x, y, ang, spread=.35, length=1800, a=70):
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(g)
    d.polygon([(x, y), (x + math.cos(ang - spread) * length, y + math.sin(ang - spread) * length),
               (x + math.cos(ang + spread) * length, y + math.sin(ang + spread) * length)], fill=(200, 230, 255, a))
    base.alpha_composite(g.filter(ImageFilter.GaussianBlur(40)))

def hud(base, t):
    """Depth meter on the right edge."""
    dep = DEPTH * eio(cl(t / 11.8)) if t < 11.8 else DEPTH
    if t > 47.5: dep = DEPTH
    a = eo((t - .2) / .4) * (1 - seg(t, 53.2, 53.5))
    if a <= 0: return
    x = W - 70; d = ImageDraw.Draw(base)
    d.line((x, 560, x, 1160), fill=(120, 220, 255, int(140 * a)), width=3)
    for k in range(12):
        yy = 560 + k * 50; d.line((x - (18 if k % 2 == 0 else 9), yy, x, yy), fill=(120, 220, 255, int(140 * a)), width=3)
    py = 560 + 600 * dep / DEPTH
    d.polygon([(x - 34, py), (x - 54, py - 12), (x - 54, py + 12)], fill=(255, 210, 80, int(255 * a)))
    put(base, text_img(f'{int(dep):,} m', 'oswald', 36, (255, 220, 120, 255), 0, shadow=3), x - 20, 500, 1, a)
    put(base, text_img('DEPTH', 'oswald', 24, (140, 220, 255, 255), 0, track=4), x - 20, 1200, 1, a)

def ring_glow(im, x, y, r, col, a):
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((x - r, y - r, x + r, y + r), fill=col + (int(a),))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(r * .5)))

# ---------------------------------------------------------------- creatures
def snailfish(size=1.):
    im = Image.new('RGBA', (700, 320), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    body = (255, 214, 220, 150)
    d.ellipse((40, 70, 300, 250), fill=body)                     # head
    d.polygon([(200, 80), (640, 140), (660, 160), (640, 180), (200, 240)], fill=body)
    d.ellipse((90, 120, 130, 160), fill=(30, 20, 30, 230))          # eye
    for k in range(18): d.line((230 + k * 22, 150, 236 + k * 22, 170), fill=(255, 255, 255, 160), width=4)  # spine
    d.line((220, 160, 640, 160), fill=(255, 255, 255, 150), width=3)
    d.ellipse((150, 140, 220, 200), fill=(255, 120, 140, 160))      # organs
    for k in range(10): d.line((260 + k * 36, 90 - k * 2, 300 + k * 36, 50), fill=(255, 220, 230, 90), width=3)  # fin
    return glow(im, 10, 1.3)

def amphipod():
    im = Image.new('RGBA', (760, 420), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for k in range(9):
        x = 80 + k * 66; h = 150 - abs(k - 3) * 10
        d.ellipse((x, 200 - h, x + 110, 200 + h * .5), fill=(236, 224, 200, 255), outline=(170, 150, 120, 255), width=4)
        d.line((x + 50, 240, x + 30 + (k % 2) * 30, 360), fill=(220, 205, 180, 255), width=7)
        d.line((x + 70, 240, x + 80 - (k % 2) * 20, 380), fill=(220, 205, 180, 255), width=6)
    d.ellipse((20, 120, 160, 250), fill=(240, 228, 205, 255), outline=(170, 150, 120, 255), width=4)
    d.line((30, 150, -10, 20), fill=(220, 205, 180, 255), width=5); d.line((50, 140, 60, 0), fill=(220, 205, 180, 255), width=5)
    d.ellipse((50, 160, 80, 190), fill=(20, 10, 10, 255))
    d.line((700, 190, 750, 130), fill=(220, 205, 180, 255), width=7); d.line((700, 200, 755, 240), fill=(220, 205, 180, 255), width=7)
    return im

def jelly(col):
    im = Image.new('RGBA', (300, 460), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.pieslice((20, 20, 280, 260), 180, 360, fill=col + (150,))
    for k in range(7): d.line((50 + k * 33, 140, 40 + k * 35, 440), fill=col + (110,), width=4)
    return glow(im, 12, 1.6)

def submarine():
    im = Image.new('RGBA', (900, 380), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((60, 120, 820, 320), 100, fill=(240, 190, 30, 255), outline=(60, 40, 0, 255), width=8)
    d.rectangle((360, 40, 560, 140), fill=(230, 180, 25, 255), outline=(60, 40, 0, 255), width=8)
    for k in range(3): d.ellipse((220 + k * 180, 180, 300 + k * 180, 260), fill=(90, 200, 255, 255), outline=(40, 30, 0, 255), width=6)
    d.polygon([(820, 220), (890, 150), (890, 290)], fill=(200, 150, 20, 255))
    d.ellipse((30, 200, 90, 240), fill=(255, 255, 220, 255))
    return im

# ---------------------------------------------------------------- scenes
def sc_dive(A, t):  # 0 – 3.4 : plunge
    k = eio(cl(t / 3.4)) ** .8
    col = A['column']; y0 = int(k * (col.height - H))
    im = col.crop((0, y0, W, y0 + H))
    if t < 1.6: lightbeam(im, W / 2, -200, math.pi / 2, .5, 2400, int(90 * (1 - t / 1.6)))
    msnow(im, t, 160, speed=900 * (1 - k * .6))
    slam(im, 'WHAT LIES AT', t, .1, 640, 140)
    slam(im, 'THE BOTTOM', t, .45, 790, 190, col=(120, 230, 255))
    slam(im, 'OF THE OCEAN?', t, .8, 950, 150)
    flash(im, pulse(t, 0, .2))
    return im

def everest(d, x, base, h, a):
    w = h * .3
    d.polygon([(x - w, base), (x - w * .3, base - h * .65), (x - w * .1, base - h * .6), (x + w * .05, base - h), (x + w * .35, base - h * .55), (x + w, base)], fill=(200, 210, 220, int(255 * a)))
    d.polygon([(x - w * .14, base - h * .78), (x + w * .05, base - h), (x + w * .2, base - h * .8), (x + w * .05, base - h * .84)], fill=(255, 255, 255, int(255 * a)))

def sc_scale(A, t):  # 3.4 – 10.3 : 11 km vs Everest
    lt = t - 3.4
    im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    top, bot = 380, 1700; d = ImageDraw.Draw(im)
    # water column
    for i in range(40):
        y0 = top + i * (bot - top) / 40; c = 1 - i / 40
        d.rectangle((0, y0, W, y0 + (bot - top) / 40 + 1), fill=(int(10 + 50 * c), int(40 + 120 * c), int(80 + 140 * c), 255))
    d.rectangle((0, top - 6, W, top), fill=(200, 240, 255, 255))
    d.text((40, top - 60), 'SEA LEVEL', font=F('oswald', 36), fill=(200, 240, 255))
    # trench walls
    d.polygon([(0, top), (330, top), (430, bot), (0, bot)], fill=(20, 26, 30, 255))
    d.polygon([(W, top), (750, top), (650, bot), (W, bot)], fill=(20, 26, 30, 255))
    d.rectangle((0, bot, W, H), fill=(10, 12, 14, 255))
    # dropping probe line
    k = eo((lt - .2) / 2.4); py = top + (bot - top) * k
    d.line((W / 2, top, W / 2, py), fill=(255, 210, 80, 255), width=4)
    ring_glow(im, W / 2, py, 30, (255, 220, 120), 255)
    # Everest dropped in
    ea = eo((t - 6.0) / .6)
    if ea > 0:
        eh = (bot - top) * 8849 / DEPTH
        everest(d, W / 2, bot, eh * lerp(.4, 1, ea), ea)
        put(im, text_img('MOUNT EVEREST · 8,849 m', 'oswald', 40, (255, 255, 255, 255), 0, shadow=4), W / 2, bot - eh - 50, 1, eo((t - 6.6) / .4))
        if t > 7.4:
            d.line((150, top, 150, bot - eh), fill=(255, 70, 50, 255), width=5)
            put(im, text_img('+2 KM OF WATER', 'bebas', 64, (255, 70, 50, 255), 0, shadow=4), 260, (top + bot - eh) / 2, 1, eo((t - 7.4) / .3), 90)
    put(im, text_img(f'{int(DEPTH * k):,} m', 'bebas', 90, (255, 220, 120, 255), 0, shadow=6), W / 2 + 230, min(py, bot - 60), 1)
    slam(im, 'NEARLY 11 KM', t, 3.5, 230, 150, col=(255, 255, 255))
    flash(im, pulse(t, 3.4, 3.55))
    return im

def sc_pressure(A, t):  # 10.3 – 15.9 : Challenger Deep, gauge
    lt = t - 10.3
    im = A['abyss'].copy(); im.alpha_composite(A['floor'])
    msnow(im, t, 80, speed=30)
    cx, cy, R = W / 2, 980, 300; d = ImageDraw.Draw(im)
    d.ellipse((cx - R - 20, cy - R - 20, cx + R + 20, cy + R + 20), fill=(20, 26, 32, 255), outline=(160, 180, 190, 255), width=10)
    for k in range(41):
        ang = math.radians(135 + k * 270 / 40); r0 = R - (40 if k % 5 == 0 else 20)
        c = (255, 70, 50) if k > 30 else (220, 230, 235)
        d.line((cx + math.cos(ang) * r0, cy + math.sin(ang) * r0, cx + math.cos(ang) * R, cy + math.sin(ang) * R), fill=c + (255,), width=5 if k % 5 == 0 else 3)
    v = eo((t - 12.7) / 1.4) + .015 * math.sin(t * 40) * (t > 14)
    ang = math.radians(135 + 270 * cl(v))
    d.line((cx, cy, cx + math.cos(ang) * (R - 50), cy + math.sin(ang) * (R - 50)), fill=(255, 70, 50, 255), width=12)
    d.ellipse((cx - 30, cy - 30, cx + 30, cy + 30), fill=(200, 200, 200, 255))
    label(im, 'CHALLENGER DEEP', 300, t, 11.3, size=66, col=(120, 230, 255))
    slam(im, '8 TONS', t, 13.86, 450, 190, col=(255, 70, 50))
    put(im, text_img('PER SQUARE INCH', 'oswald', 52, (255, 255, 255, 255), 0, track=6, shadow=4), W / 2, 570, 1, eo((t - 14.7) / .3))
    dx, dy = shake(t, 13.9, 20)
    flash(im, pulse(t, 10.3, 10.45))
    return im, dx, dy

def sc_crush(A, t):  # 15.9 – 20.6 : submarine flattened
    lt = t - 15.9
    im = A['abyss'].copy(); msnow(im, t, 80, speed=20)
    sub = submarine()
    k = eo((t - 17.16) / .45)
    lightbeam(im, W / 2 - 400, 1000, math.pi, .3, 900, int(60 * (1 - k)))
    if k > 0:
        sub = sub.resize((int(sub.width * (1 + .25 * k)), max(10, int(sub.height * (1 - .8 * k)))), Image.BILINEAR)
        d = ImageDraw.Draw(sub); r = rng(3)
        for _ in range(int(14 * k)):
            x = r.random() * sub.width; d.line((x, 0, x + (r.random() - .5) * 60, sub.height), fill=(80, 50, 0, 255), width=4)
    bob = 12 * math.sin(lt * 2) * (1 - k)
    put(im, sub, W / 2, 1000 + bob + 120 * k, 1)
    if k > 0:  # pressure arrows
        d = ImageDraw.Draw(im)
        for s in (-1, 1):
            yy = 1000 + 120 * k + s * (240 - 120 * k)
            for xx in (W / 2 - 220, W / 2, W / 2 + 220):
                d.polygon([(xx - 30, yy - s * 50), (xx + 30, yy - s * 50), (xx, yy)], fill=(255, 70, 50, int(255 * k)))
    slam(im, 'STEEL SUBMARINE', t, 16.0, 330, 120, out=17.1)
    if t > 17.1:
        slam(im, 'FLATTENED', t, 17.16, 360, 210, col=(255, 70, 50))
        slam(im, 'LIKE PAPER', t, 19.6, 540, 150)
    dx, dy = shake(t, 17.2, 34, .5)
    flash(im, pulse(t, 15.9, 16.05))
    return im, dx, dy

def sc_hostile(A, t):  # 20.6 – 25.7
    im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    msnow(im, t, 60, speed=20, alpha=.6)
    items = [('TOTAL DARKNESS', '0% SUNLIGHT', 22.0, (230, 230, 230)), ('FREEZING', '1–4 °C', 22.96, (120, 210, 255)),
             ('CRUSHING', '1,000+ ATM', 24.24, (255, 80, 60))]
    for i, (a_, b_, tc, c) in enumerate(items):
        if t < tc: continue
        y = 560 + i * 300
        put(im, text_img(b_, 'bebas', 170, c + (255,), 0, shadow=6), W / 2, y, lerp(1.5, 1, eo((t - tc) / .2)), eo((t - tc) / .2))
        put(im, text_img(a_, 'oswald', 44, (200, 210, 220, 255), 0, track=8), W / 2, y + 110, 1, eo((t - tc - .1) / .3))
    slam(im, 'AND YET…', t, 20.7, 300, 120, col=(255, 255, 255))
    flash(im, pulse(t, 20.6, 20.75), (0, 0, 0))
    return im

def sc_creatures(A, t):  # 25.7 – 35.4
    lt = t - 25.7
    im = A['abyss'].copy(); darken(im, .3)
    biolum(im, t, 60)
    if t < 31.5:
        for i, (x, y, c, ph) in enumerate([(260, 900, (120, 255, 230), 0), (800, 700, (200, 140, 255), 1.5), (640, 1240, (120, 200, 255), 3)]):
            a = eo((t - 26.9 - i * .4) / .8)
            if a <= 0: continue
            put(im, jelly(c), x + 30 * math.sin(t * .7 + ph), y - lt * 25 + 20 * math.sin(t * 1.3 + ph), .9, a * (.7 + .3 * math.sin(t * 2 + ph)))
        slam(im, 'PHANTOM', t, 28.52, 330, 190, col=(120, 255, 230))
        slam(im, 'CREATURES', t, 29.18, 490, 160)
        if t > 29.98: label(im, 'FOUND NOWHERE ELSE ON EARTH', 620, t, 30.0, size=46, col=(220, 240, 245), bar=False)
    elif t < 33.4:
        if not hasattr(sc_creatures, 'sf'): sc_creatures.sf = snailfish()
        k = eo((t - 31.5) / 1.6)
        lightbeam(im, -100, 600, .4, .3, 1600, 60)
        put(im, sc_creatures.sf, lerp(-300, W / 2, k) + 10 * math.sin(t * 3), 1000 + 20 * math.sin(t * 2), 1.2)
        slam(im, 'GHOST FISH', t, 31.8, 330, 190, col=(255, 210, 220))
        label(im, 'MARIANA SNAILFISH · 8,000 m', 470, t, 32.2, size=40, col=(220, 240, 245), bar=False)
    else:
        if not hasattr(sc_creatures, 'am'): sc_creatures.am = amphipod()
        k = eo((t - 33.4) / .8)
        lightbeam(im, W + 100, 600, math.pi - .4, .3, 1600, 60)
        put(im, sc_creatures.am, W / 2 + 6 * math.sin(t * 9), 1000, lerp(.6, 1.25, k))
        slam(im, 'GIANT', t, 33.6, 300, 170, col=(255, 230, 190))
        slam(im, 'AMPHIPODS', t, 34.04, 450, 170)
        label(im, 'UP TO 34 CM LONG', 580, t, 34.5, size=44, col=(220, 240, 245), bar=False)
    flash(im, pulse(t, 25.7, 25.85))
    return im

def sc_volcano(A, t):  # 35.4 – 42.0
    lt = t - 35.4
    im = A['abyss'].copy(); d = ImageDraw.Draw(im)
    cx, base = W / 2, 1500
    d.polygon([(cx - 520, base), (cx - 110, 1020), (cx + 110, 1020), (cx + 520, base)], fill=(36, 30, 26, 255))
    d.rectangle((0, base, W, H), fill=(22, 18, 16, 255))
    erupt = seg(t, 39.4, 39.8)
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g); r = rng(int(t * 3))
    for i in range(70):
        a, b, c = MO[i]
        ph = ((lt * (.4 + c * .6) + a) % 1)
        x = cx + (b - .5) * 200 * ph * 3; y = 1020 - ph * 900 * (.6 + erupt * .6)
        s = 10 + c * 26
        col = (255, 220, 60) if (t > 41 and i % 3 == 0) else (120, 110, 100)
        gd.ellipse((x - s, y - s, x + s, y + s), fill=col + (int(200 * (1 - ph)),))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(8)))
    if t > 40.9:  # liquid sulfur pool
        k = eo((t - 40.9) / .8)
        ring_glow(im, cx, 1040, 260 * k, (255, 220, 40), 200)
        ImageDraw.Draw(im).ellipse((cx - 160 * k, 1010, cx + 160 * k, 1060), fill=(255, 230, 60, 255))
    msnow(im, t, 60, speed=20, alpha=.6)
    slam(im, 'STRANGER STILL…', t, 35.5, 330, 120, out=38.9)
    if t > 38.9:
        slam(im, 'MUD VOLCANOES', t, 39.14, 330, 150, col=(255, 255, 255))
    if t > 40.9:
        slam(im, 'LIQUID SULFUR', t, 41.1, 490, 160, col=(255, 220, 40))
    dx, dy = shake(t, 39.5, 20, .6)
    flash(im, pulse(t, 35.4, 35.55))
    return im, dx, dy

def sc_vents(A, t):  # 42.0 – 47.5
    lt = t - 42.0
    im = A['abyss'].copy(); d = ImageDraw.Draw(im)
    d.rectangle((0, 1560, W, H), fill=(18, 16, 14, 255))
    chim = [(260, 1560, 420, 90), (560, 1560, 620, 120), (850, 1560, 360, 80)]
    for x, b, h, w in chim:
        d.polygon([(x - w, b), (x - w * .4, b - h), (x + w * .4, b - h), (x + w, b)], fill=(40, 34, 30, 255))
        ring_glow(im, x, b - h, 60, (255, 120, 40), 150)
    smk = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(smk)
    for x, b, h, w in chim:
        for i in range(30):
            ph = ((lt * .5 + i / 30) % 1)
            yy = b - h - ph * 900; xx = x + math.sin(ph * 6 + i) * 40 * ph; s = 30 + ph * 140
            sd.ellipse((xx - s, yy - s, xx + s, yy + s), fill=(20, 18, 18, int(170 * (1 - ph))))
    im.alpha_composite(smk.filter(ImageFilter.GaussianBlur(20)))
    # tube worms
    r = rng(7); d = ImageDraw.Draw(im)
    for i in range(36):
        x = 80 + r.random() * 920; h = 60 + r.random() * 120; sw = 6 * math.sin(t * 2 + i)
        d.line((x, 1600, x + sw, 1600 - h), fill=(230, 225, 210, 255), width=10)
        d.ellipse((x + sw - 14, 1600 - h - 24, x + sw + 14, 1600 - h + 4), fill=(230, 40, 50, 255))
    biolum(im, t, 30, col=(120, 255, 180), alpha=.7)
    slam(im, 'CHEMICAL', t, 42.6, 330, 170, col=(255, 160, 80), out=45.3)
    slam(im, 'VENTS', t, 43.04, 490, 200, out=45.3)
    if t > 45.3:
        slam(im, 'LIFE WITHOUT', t, 45.4, 330, 140)
        slam(im, 'SUNLIGHT', t, 46.3, 480, 200, col=(255, 210, 80))
    flash(im, pulse(t, 42.0, 42.15), (255, 160, 80))
    return im

def sc_unknown(A, t):  # 47.5 – 53.3
    lt = t - 47.5
    im = Image.new('RGBA', (W, H), (0, 2, 6, 255)); d = ImageDraw.Draw(im)
    # canyon walls receding
    for k in range(6):
        s = 1 + k * .45 - lt * .12
        if s <= .05: continue
        c = int(30 / (k + 1))
        d.polygon([(0, 0), (W * .45 / s, H * .3), (W * .45 / s, H * .8), (0, H)], fill=(c, c + 4, c + 8, 255))
        d.polygon([(W, 0), (W - W * .45 / s, H * .3), (W - W * .45 / s, H * .8), (W, H)], fill=(c, c + 4, c + 8, 255))
    ang = math.pi / 2 + .5 * math.sin(lt * .8)
    lightbeam(im, W / 2, 300, ang, .22, 1700, 70)
    # glints in the dark
    for i, (x, y, tc) in enumerate([(300, 1200, 49.5), (760, 1350, 50.2), (540, 1500, 51.0)]):
        a = max(0, math.sin((t - tc) * 3)) if t > tc else 0
        for dx_ in (-14, 14): ring_glow(im, x + dx_, y, 10, (180, 255, 240), 255 * a)
    msnow(im, t, 70, speed=25, alpha=.5)
    slam(im, 'WHAT ELSE', t, 47.6, 330, 170)
    slam(im, 'IS DOWN THERE?', t, 48.3, 480, 150, col=(120, 230, 255))
    if t > 50.9:
        put(im, text_img('80% OF THE OCEAN', 'bebas', 110, (255, 255, 255, 255), 0, shadow=6), W / 2, 1650, 1, eo((t - 51.0) / .3))
        put(im, text_img('STILL UNEXPLORED', 'oswald', 46, (255, 80, 60, 255), 0, track=8, shadow=4), W / 2, 1740, 1, eo((t - 51.3) / .3))
    flash(im, pulse(t, 47.5, 47.7), (0, 0, 0))
    return im

def sc_end(A, t):  # 53.3 – end
    lt = t - 53.3
    im = A['abyss'].copy(); im.alpha_composite(A['floor']); biolum(im, t, 50)
    msnow(im, t, 80, speed=25)
    slam(im, 'WHAT DO', t, 53.35, 330, 150)
    slam(im, 'YOU THINK?', t, 53.6, 480, 200, col=(120, 230, 255))
    a = back((t - 53.6) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 55.1) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 55.1) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    flash(im, pulse(t, 53.3, 53.5))
    return im

SCENES = [(0, 3.4, sc_dive), (3.4, 10.3, sc_scale), (10.3, 15.9, sc_pressure), (15.9, 20.6, sc_crush), (20.6, 25.7, sc_hostile),
          (25.7, 35.4, sc_creatures), (35.4, 42.0, sc_volcano), (42.0, 47.5, sc_vents), (47.5, 53.3, sc_unknown), (53.3, 99, sc_end)]

def frame(A, t):
    for a, b, fn in SCENES:
        if a <= t < b: break
    r = fn(A, t)
    dx = dy = 0
    if isinstance(r, tuple): r, dx, dy = r
    im = r
    if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    if fn not in (sc_scale, sc_end): hud(im, t)
    draw_caption(im, t)
    arr = np.asarray(im.convert('RGB'), dtype=np.float32)
    arr = arr * A['vig'] + A['grain'][int(t * FPS) % 6]
    if t > DUR - .5: arr *= cl((DUR - t) / .5)
    return np.clip(arr, 0, 255).astype(np.uint8)
def work(args):
    i0, i1, path = args
    A = load_assets()
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', path], stdin=subprocess.PIPE)
    for i in range(i0, i1):
        p.stdin.write(frame(A, i / FPS).tobytes())
    p.stdin.close(); p.wait()
    return path

if __name__ == '__main__':
    if '--preview' in sys.argv:
        ts = [float(x) for x in sys.argv[sys.argv.index('--preview') + 1].split(',')]
        A = load_assets(); out = sys.argv[sys.argv.index('--preview') + 2] if len(sys.argv) > sys.argv.index('--preview') + 2 else '/tmp'
        tiles = [Image.fromarray(frame(A, t)).resize((270, 480)) for t in ts]
        sheet = Image.new('RGB', (270 * min(6, len(tiles)), 480 * math.ceil(len(tiles) / 6)))
        for k, tl in enumerate(tiles): sheet.paste(tl, ((k % 6) * 270, (k // 6) * 480))
        sheet.save(out); print(out); sys.exit()
    from multiprocessing import Pool
    N = int(DUR * FPS); nw = int(os.environ.get('WORKERS', 4)); cs = math.ceil(N / nw)
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    jobs = [(k * cs, min(N, (k + 1) * cs), os.path.join(HERE, 'out', f'part{k}.mp4')) for k in range(nw)]
    with Pool(nw) as pool: parts = pool.map(work, jobs)
    with open(os.path.join(HERE, 'out', 'parts.txt'), 'w') as f:
        for p in parts: f.write(f"file '{p}'\n")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', os.path.join(HERE, 'out', 'parts.txt'), '-c', 'copy', os.path.join(HERE, 'out', 'video.mp4')], check=True)
    print('done')
