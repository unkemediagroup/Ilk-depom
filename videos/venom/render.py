# Venomous animals — YT Shorts renderer (1080x1920, 30 fps).
# Usage: python3 render.py [--preview t1,t2,...] [--workers N]
import json, math, os, subprocess, sys, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps, ImageEnhance

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

def msnow(base, t, n=120, speed=40., alpha=1., col=(200, 230, 240)):
    """Marine snow drifting slowly; positive speed = camera descending (snow rises)."""
    d = ImageDraw.Draw(base)
    for i in range(n):
        a, b, c = MO[i]
        sz = .8 + c * 2.6
        x = (a * W + 14 * math.sin(t * (.3 + c) + i)) % W
        y = (b * (H + 60) - speed * (.4 + c) * t) % (H + 60) - 30
        d.ellipse((x - sz, y - sz, x + sz, y + sz), fill=col + (int((50 + 120 * c) * alpha),))


# ================================================================ ISLANDS
DUR = 69.95
KEY = {'ABANDONED', 'GHOST', 'TOWNS', 'HOSPITALS', 'FORBIDDEN', 'RUINS', 'HAUNTING', 'HASHIMA', 'JAPAN', 'FORTRESS', 'THOUSANDS',
       'DESERTED', 'OVERNIGHT', 'DECAYING', 'EMPTY', 'CRUMBLING', 'WAVES', 'POVEGLIA', 'ITALY', 'QUARANTINED', 'PLAGUE', 'ASYLUM',
       'GRIM', 'HAUNTED', 'BANNING', 'SPIRITO', 'ROSS', 'ROTTING', 'BRUTAL', 'PENAL', 'COLONIES', 'DARK', 'SECRETS', 'FLEE', 'RUSH', 'UNKNOWN', 'EERIE'}

def eerie(im, sat=.55, contrast=1.15, tint=(-.02, .02, .04)):
    a = np.asarray(im.convert('RGB'), dtype=np.float32) / 255.
    lum = a @ np.array([.299, .587, .114], np.float32)
    a = lum[..., None] + (a - lum[..., None]) * sat
    a = (a - .5) * contrast + .5 + np.array(tint, np.float32)
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).convert('RGBA')

def load_assets():
    A = {}
    A['grain'] = [np.random.default_rng(k).normal(0, 7, (H, W, 1)).astype(np.float32) for k in range(6)]
    yy, xx = np.mgrid[0:H, 0:W]; rr2 = np.sqrt(((xx - W / 2) / (W * .62)) ** 2 + ((yy - H / 2) / (H * .58)) ** 2)
    A['vig'] = (1 - .7 * np.clip(rr2 - .4, 0, 1) ** 1.2)[..., None].astype(np.float32)
    import glob
    for p in sorted(glob.glob(os.path.join(HERE, 'arch', '*'))):
        k = os.path.splitext(os.path.basename(p))[0]
        try:
            im = Image.open(p).convert('RGB')
            if im.width > 2600: im = im.resize((2600, int(im.height * 2600 / im.width)), Image.LANCZOS)
            A[k] = eerie(im, sat=1.05, contrast=1.1, tint=(0, 0, 0))
        except Exception: pass
    return A

def pick(A, *keys):
    for k in keys:
        if k in A: return k
    return None

def shot(A, keys, t, t0, t1, z0=1.05, z1=1.3, cx=.5, cy=.5, cx1=None, cy1=None):
    k = pick(A, *keys)
    if k is None:
        im = Image.new('RGBA', (W, H), (14, 18, 22, 255)); return im
    kk = eio((t - t0) / max(.01, t1 - t0))
    return cover(A[k], t, lerp(z0, z1, kk), lerp(cx, cx if cx1 is None else cx1, kk), lerp(cy, cy if cy1 is None else cy1, kk))

def tag(im, t, txt, t0):
    a = eo((t - t0 - .25) / .4)
    if a > 0: put(im, text_img(txt, 'oswald', 28, (220, 230, 235, 255), 0, track=4, shadow=4), W / 2, 1265, 1, a * .85)

def pin(im, t, t0, name, sub, y=300):
    a = eo((t - t0) / .35)
    if a <= 0: return
    d = ImageDraw.Draw(im); cx = W / 2
    pr = 22 + 8 * math.sin((t - t0) * 6)
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((cx - pr * 2, y - pr * 2, cx + pr * 2, y + pr * 2), fill=(255, 60, 50, int(120 * a)))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(14)))
    d.ellipse((cx - 16, y - 16, cx + 16, y + 16), fill=(255, 60, 50, int(255 * a)), outline=(255, 255, 255, int(255 * a)), width=4)
    put(im, text_img(name, 'bebas', 170, (255, 255, 255, 255), 0, shadow=8), cx, y + 130, lerp(1.4, 1, eo((t - t0) / .25)), a)
    put(im, text_img(sub, 'oswald', 40, (255, 120, 100, 255), 0, track=8, shadow=4), cx, y + 240, 1, eo((t - t0 - .2) / .3))

def flicker(im, t, amt=.08):
    r = rng(int(t * 30) * 7).random()
    if r < .08: darken(im, amt * 3)
    elif r < .2: darken(im, amt)

def scan(im, t):
    """VHS-ish horizontal glitch band."""
    r = rng(int(t * 30) * 13)
    if r.random() < .12:
        y = int(r.random() * H); h = 20 + int(r.random() * 60); off = int((r.random() - .5) * 60)
        band = im.crop((0, y, W, min(H, y + h)))
        im.paste(band, (off, y))

def bars(im, t, t0):
    k = eo((t - t0) / .35)
    if k <= 0: return
    d = ImageDraw.Draw(im)
    for i in range(7):
        x = 80 + i * 155; d.rectangle((x, -20 + (1 - k) * -H, x + 34, H * k), fill=(20, 20, 22, 255))
    d.rectangle((0, 900, W, 940), fill=(24, 24, 26, int(255 * k)))

def stamp(im, t, t0, txt, x, y, rot=-10, col=(220, 30, 30)):
    if t < t0: return
    k = seg(t, t0, t0 + .18)
    st = text_img(txt, 'bebas', 170, col + (255,), 0)
    box = Image.new('RGBA', (st.width + 40, st.height), (0, 0, 0, 0)); bd = ImageDraw.Draw(box)
    bd.rectangle((6, 24, box.width - 6, box.height - 16), outline=col + (255,), width=10); box.alpha_composite(st, (20, 0))
    put(im, box, x, y, lerp(2.0, 1, eo(k)), eo(k * 1.5) * .92, rot)

def waves(im, t, k=1.):
    d = ImageDraw.Draw(im)
    for i in range(10):
        ph = ((t * .6 + i / 10) % 1)
        y = H - 300 + 40 * math.sin(i) - ph * 200
        a = int(160 * (1 - ph) * k)
        pts = [(x, y + 18 * math.sin(x / 70 + t * 3 + i)) for x in range(-20, W + 40, 40)]
        d.line(pts, fill=(230, 240, 245, a), width=6)

def grad_img(top, bot, p=1.):
    y = np.linspace(0, 1, H)[:, None, None] ** p
    a = np.array(top, np.float32) + (np.array(bot, np.float32) - np.array(top, np.float32)) * y
    return Image.fromarray(np.repeat(a, W, 1).astype(np.uint8)).convert('RGBA')

def longship(scale=1., col=(14, 12, 12), sail=(120, 30, 26)):
    w, h = int(900 * scale), int(700 * scale)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im); s = scale
    base = 560 * s
    hull = [(40 * s, base - 120 * s)] + [(x * s, base - 20 * s + 40 * s * math.sin(math.pi * (x - 80) / 740)) for x in range(80, 821, 20)] + [(860 * s, base - 130 * s)]
    d.polygon(hull + [(800 * s, base - 70 * s), (100 * s, base - 70 * s)], fill=col + (255,))
    d.line([(40 * s, base - 120 * s), (20 * s, base - 230 * s), (50 * s, base - 300 * s), (95 * s, base - 290 * s), (70 * s, base - 250 * s)], fill=col + (255,), width=int(26 * s))  # dragon prow
    d.line([(860 * s, base - 130 * s), (885 * s, base - 240 * s), (865 * s, base - 270 * s)], fill=col + (255,), width=int(22 * s))
    for k in range(11):  # shields
        x = 140 * s + k * 62 * s; c = [(150, 30, 26), (200, 170, 60), (30, 50, 90)][k % 3]
        d.ellipse((x - 26 * s, base - 105 * s, x + 26 * s, base - 53 * s), fill=c + (255,), outline=col + (255,), width=int(4 * s))
    d.line((450 * s, base - 80 * s, 450 * s, 40 * s), fill=col + (255,), width=int(12 * s))
    d.polygon([(250 * s, 70 * s), (650 * s, 70 * s), (620 * s, 380 * s), (280 * s, 380 * s)], fill=sail + (255,))
    for k in range(4): d.rectangle((280 * s + k * 90 * s, 72 * s, 320 * s + k * 90 * s, 378 * s), fill=(200, 190, 170, 255))
    for k in range(9): d.line((150 * s + k * 75 * s, base - 60 * s, 110 * s + k * 75 * s, base + 60 * s), fill=col + (255,), width=int(6 * s))  # oars
    return im

def mist(im, y, a=140, h=300, col=(200, 196, 190)):
    m = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(m).rectangle((-100, y, W + 100, y + h), fill=col + (a,))
    im.alpha_composite(m.filter(ImageFilter.GaussianBlur(h * .5)))

def warp(im, t, amt=8):
    a = np.asarray(im); off = (amt * np.sin(np.arange(H) / 40 + t * 5)).astype(int)
    out = np.empty_like(a)
    for y in range(0, H, 8): out[y:y + 8] = np.roll(a[y:y + 8], off[y], axis=1)
    return Image.fromarray(out)

def embers(im, t, n=90):
    motes(im, t, n, col=(255, 140, 50), rise=-200, drift=20, size=1.2, ember=True)

# ---------------------------------------------------------------- VENOM
DUR = 75.0
KEY = {'VENOM', 'LETHAL', 'DROP', 'MINUTES', 'TERRIFYING', 'GOLDEN', 'POISON', 'DART', 'FROG', 'COLOMBIA', 'BATRACHOTOXIN',
       'KILL', '10', 'TOXIC', 'BOX', 'JELLYFISH', 'HARPOONS', 'NEUROTOXIN', 'HEART', 'ZERO', 'SURVIVAL', 'STONEFISH',
       'EXCRUCIATING', 'PAIN', 'SPINES', 'TAIPAN', 'SNAKE', '100', 'STRIKE', 'HORRIFIC', 'TOXINS', 'DETERRENT', 'UNKNOWN', 'DEADLY'}

_cc = {}
def vclip(name, t, t0, speed=1.):
    d = os.path.join(HERE, 'clips', name)
    if name not in _cc: _cc[name] = len(os.listdir(d))
    i = min(_cc[name], max(1, int((t - t0) * 30 * speed) + 1))
    return Image.open(os.path.join(d, '%04d.jpg' % i)).convert('RGBA')

def ocean_bg(t):
    im = grad_img((6, 40, 70), (0, 4, 12), .8)
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for k in range(7):
        x = 200 + k * 130 + 40 * math.sin(t * .5 + k)
        gd.polygon([(x, -50), (x + 60, -50), (x + 260, 1300), (x + 120, 1300)], fill=(120, 200, 255, 26))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(30)))
    return im

def boxjelly(t, scale=1.):
    w, h = int(700 * scale), int(1300 * scale)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im); s = scale
    pul = 1 + .06 * math.sin(t * 3)
    bw, bh = 420 * s * pul, 360 * s / pul
    cx, top = w / 2, 60 * s
    d.rounded_rectangle((cx - bw / 2, top, cx + bw / 2, top + bh), int(110 * s), fill=(150, 210, 255, 70), outline=(190, 235, 255, 200), width=int(6 * s))
    d.rounded_rectangle((cx - bw / 2 + 50 * s, top + 40 * s, cx + bw / 2 - 50 * s, top + bh - 30 * s), int(80 * s), fill=(170, 220, 255, 50))
    for k in range(4): d.ellipse((cx - 30 * s + (k - 1.5) * 70 * s, top + bh * .45, cx + 30 * s + (k - 1.5) * 70 * s, top + bh * .45 + 50 * s), fill=(255, 220, 160, 90))
    for side in (-1, 1):
        for j in range(5):
            x0 = cx + side * (bw / 2 - 20 * s) - side * j * 10 * s; y0 = top + bh - 10 * s
            pts = [(x0 + side * 14 * j * s + 45 * s * math.sin(t * 1.6 + y / (110 * s) + j * .7), y0 + y) for y in np.arange(0, 820 * s, 16 * s)]
            d.line(pts, fill=(200, 235, 255, 150), width=max(3, int(6 * s)))
    return glow(im, 16 * s, 1.5)

def frog(t, scale=1.):
    w, h = int(900 * scale), int(800 * scale)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im); s = scale
    gold = (250, 196, 30); dark = (190, 120, 10)
    # back legs
    d.ellipse((60 * s, 430 * s, 360 * s, 660 * s), fill=dark + (255,)); d.ellipse((540 * s, 430 * s, 840 * s, 660 * s), fill=dark + (255,))
    d.ellipse((20 * s, 600 * s, 260 * s, 700 * s), fill=gold + (255,)); d.ellipse((640 * s, 600 * s, 880 * s, 700 * s), fill=gold + (255,))
    # body
    d.ellipse((190 * s, 220 * s, 710 * s, 660 * s), fill=gold + (255,))
    d.ellipse((260 * s, 150 * s, 640 * s, 430 * s), fill=gold + (255,))
    # front legs
    d.line((300 * s, 520 * s, 230 * s, 690 * s), fill=gold + (255,), width=int(46 * s)); d.line((600 * s, 520 * s, 670 * s, 690 * s), fill=gold + (255,), width=int(46 * s))
    for x in (230, 670):
        for k in (-1, 0, 1): d.ellipse(((x + k * 30 - 14) * s, 680 * s, (x + k * 30 + 14) * s, 712 * s), fill=gold + (255,))
    # eyes
    for x in (330, 570):
        d.ellipse(((x - 70) * s, 130 * s, (x + 70) * s, 270 * s), fill=dark + (255,))
        d.ellipse(((x - 56) * s, 144 * s, (x + 56) * s, 256 * s), fill=(14, 10, 8, 255))
        d.ellipse(((x - 30) * s, 160 * s, (x - 6) * s, 184 * s), fill=(255, 255, 255, 230))
    # glossy highlight
    hl = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(hl).ellipse((330 * s, 280 * s, 560 * s, 380 * s), fill=(255, 250, 210, 150))
    im.alpha_composite(hl.filter(ImageFilter.GaussianBlur(20 * s)))
    return im

def jungle_bg(t):
    im = grad_img((10, 30, 16), (4, 14, 8)); g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g); r = rng(4)
    for _ in range(40):
        x, y, s = r.random() * W, r.random() * H, 40 + r.random() * 160
        gd.ellipse((x - s, y - s, x + s, y + s), fill=(40 + r.randint(0, 60), 120 + r.randint(0, 80), 40, 90))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(40)))
    d = ImageDraw.Draw(im)
    d.polygon([(-100, 1500), (300, 1150), (900, 1100), (1200, 1300), (1150, 1700), (200, 1800)], fill=(30, 110, 40, 255))
    d.line((-100, 1500, 1150, 1300), fill=(60, 150, 60, 255), width=10)
    return im

def snake(t, t0, strike=0.):
    im = grad_img((120, 70, 40), (210, 150, 90), 1.2); d = ImageDraw.Draw(im)
    rg = [1500 + 40 * math.sin(x / 120) for x in range(0, W + 10, 10)]
    d.polygon([(0, H)] + [(x * 10, rg[x]) for x in range(len(rg))] + [(W, H)], fill=(160, 100, 56, 255))
    k = strike
    pts = []
    for i in range(80):
        u = i / 79
        x = 100 + u * 720 + 170 * math.sin(u * 9 + t * 1.5) * (1 - u * .6)
        y = 1250 - u * 560 + 70 * math.sin(u * 5 + t)
        pts.append((x, y))
    hx, hy = pts[-1]
    hx2, hy2 = hx + k * 240, hy - k * 200
    pts.append((hx2, hy2))
    for i in range(len(pts) - 1):
        wdt = 110 - i * .5
        d.line((pts[i], pts[i + 1]), fill=(86, 66, 40, 255), width=int(wdt))
    for i in range(0, len(pts) - 1, 2):
        x, y = pts[i]; d.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(60, 44, 26, 255))
    d.ellipse((hx2 - 80, hy2 - 58, hx2 + 100, hy2 + 58), fill=(70, 50, 30, 255))
    d.ellipse((hx2 + 24, hy2 - 30, hx2 + 52, hy2 - 6), fill=(10, 8, 6, 255))
    if math.sin(t * 9) > .3: d.line((hx2 + 100, hy2, hx2 + 170, hy2 + 10, hx2 + 195, hy2 - 8), fill=(200, 30, 40, 255), width=8)
    return im

def ecg(im, t, t0, y=900):
    d = ImageDraw.Draw(im); pts = []
    dead = cl((t - t0) / 2.0)
    for x in range(40, W - 40, 4):
        ph = ((x / 300) - t * 1.4) % 1
        v = 0
        if .42 < ph < .46: v = -220
        elif .46 < ph < .5: v = 120
        elif .3 < ph < .36: v = -40
        amp = 1 - dead * (x / W) * 1.6
        pts.append((x, y + v * max(0, amp)))
    d.line(pts, fill=(80, 255, 140, 255), width=6)

def harpoon(im, t, t0):
    k = eo((t - t0) / .6)
    cx, cy, R = W / 2, 900, 360
    d = ImageDraw.Draw(im)
    d.ellipse((cx - R, cy - R, cx + R, cy + R), fill=(10, 30, 50, 240), outline=(200, 235, 255, 255), width=10)
    d.ellipse((cx - 110, cy - 150, cx + 110, cy + 70), outline=(200, 235, 255, 255), width=8)
    for j in range(5):
        a = j * 1.2; d.arc((cx - 60 + j * 4, cy - 110 + j * 12, cx + 60 - j * 4, cy + 10 + j * 8), 0, 300, fill=(150, 210, 255, 200), width=4)
    L = k * 320
    d.line((cx, cy + 70, cx, cy + 70 + L), fill=(255, 80, 60, 255), width=8)
    if k > .1: d.polygon([(cx - 18, cy + 70 + L - 30), (cx + 18, cy + 70 + L - 30), (cx, cy + 70 + L + 10)], fill=(255, 80, 60, 255))
    put(im, text_img('x1000 MAGNIFIED', 'oswald', 30, (200, 235, 255, 255), 0, track=6), cx, cy + R + 40, 1, 1)

def people_icons(im, t, t0, n, y=780, cols=10, size=60, col=(255, 255, 255)):
    d = ImageDraw.Draw(im)
    rows = math.ceil(n / cols); gap = size * 1.25
    x0 = W / 2 - (cols - 1) * gap / 2
    for i in range(n):
        a = cl((t - t0 - i * (1.2 / n)) / .15)
        if a <= 0: continue
        x = x0 + (i % cols) * gap; yy = y + (i // cols) * gap * 1.3
        c = col + (int(255 * a),)
        d.ellipse((x - size * .2, yy - size * .5, x + size * .2, yy - size * .1), fill=c)
        d.rounded_rectangle((x - size * .3, yy - size * .05, x + size * .3, yy + size * .5), int(size * .15), fill=c)

def sc_hook(A, t):  # 0 – 4.6
    im = ocean_bg(t)
    if not hasattr(sc_hook, 'j'): sc_hook.j = boxjelly(0, 1.0)
    put(im, boxjelly(t, 1.5), W / 2, 1150 + 20 * math.sin(t), lerp(1.25, 1.0, eo(t / 4)))
    motes(im, t, 60, col=(180, 230, 255), rise=-15, alpha=.6)
    topshade(im)
    put(im, text_img("THE WORLD'S MOST", 'oswald', 54, (210, 235, 250, 255), 0, track=6, shadow=4), W / 2, 260, 1, eo((t - .1) / .3))
    slam(im, 'VENOMOUS', t, .2, 410, 240, col=(255, 60, 50))
    slam(im, 'ANIMALS', t, .55, 600, 190)
    flash(im, pulse(t, 0, .2))
    return im

def sc_drop(A, t):  # 4.6 – 12.9
    if t < 7.4:
        im = shot(A, ['lionfish'], t, 4.6, 7.4, 1.1, 1.35, .45, .6); topshade(im)
        slam(im, 'SILENT', t, 4.76, 330, 200); slam(im, 'PREDATORS', t, 5.26, 510, 190, col=(255, 60, 50))
        tag(im, t, 'LIONFISH · NOAA', 4.7)
    else:
        im = Image.new('RGBA', (W, H), (4, 4, 6, 255)); d = ImageDraw.Draw(im)
        k = cl((t - 8.6) / .7)
        y = lerp(200, 1100, k * k)
        if k < 1:
            d.ellipse((W / 2 - 28, y - 40, W / 2 + 28, y + 40), fill=(140, 255, 120, 255))
            d.polygon([(W / 2 - 24, y - 20), (W / 2 + 24, y - 20), (W / 2, y - 90)], fill=(140, 255, 120, 255))
        else:
            for j in range(4):
                R = (t - 9.3) * 600 - j * 90
                if R > 0: d.ellipse((W / 2 - R, 1100 - R * .25, W / 2 + R, 1100 + R * .25), outline=(140, 255, 120, int(max(0, 220 - R * .3))), width=6)
        slam(im, 'A SINGLE DROP', t, 8.9, 330, 160, col=(140, 255, 120))
        if t > 10.0: slam(im, 'CAN KILL', t, 10.02, 500, 190); label(im, 'IN MINUTES', 650, t, 11.48, size=64, col=(255, 90, 80))
    flash(im, max(pulse(t, 4.6, 4.75), pulse(t, 7.4, 7.5)))
    return im

def sc_frog(A, t):  # 12.9 – 27.4
    im = jungle_bg(t)
    bob = 6 * math.sin(t * 2)
    put(im, frog(t, 1.15), W / 2, 980 + bob, lerp(.9, 1.1, eio((t - 12.9) / 14.5)))
    motes(im, t, 30, col=(255, 230, 120), rise=-10, alpha=.5)
    if t < 15.7: slam(im, 'MASTERS OF', t, 13.66, 330, 150); slam(im, 'VENOM', t, 15.02, 490, 220, col=(140, 255, 120))
    elif t < 20.0: pin(im, t, 15.84, 'GOLDEN POISON FROG', 'COLOMBIA', 300)
    elif t < 24.0:
        slam(im, 'BATRACHOTOXIN', t, 20.94, 280, 140, col=(255, 200, 40))
        if t > 22.2: put(im, text_img('ENOUGH TO KILL 10 MEN', 'oswald', 54, (255, 255, 255, 255), 0, track=4, shadow=4), W / 2, 400, 1, eo((t - 22.2) / .3))
        people_icons(im, t, 22.4, 10, y=520, size=70, col=(255, 70, 60))
    else:
        slam(im, 'MOST TOXIC', t, 24.84, 300, 190, col=(255, 60, 50)); label(im, 'VERTEBRATE ON EARTH', 460, t, 25.54, size=58)
    flash(im, pulse(t, 12.9, 13.05))
    return im

def sc_jelly(A, t):  # 27.4 – 44.9
    if t < 34.0:
        im = ocean_bg(t); put(im, boxjelly(t, 1.4), W / 2 + 60 * math.sin(t * .4), 1100 + 30 * math.sin(t * .6), 1)
        motes(im, t, 60, col=(180, 230, 255), rise=-15, alpha=.6)
        if t < 30.6: slam(im, 'THE CROWN', t, 28.08, 330, 190, col=(255, 200, 80)); label(im, 'FOR ABSOLUTE LETHALITY', 490, t, 28.62, size=52)
        else: pin(im, t, 30.74, 'BOX JELLYFISH', 'AUSTRALIA', 300)
    elif t < 38.6:
        im = ocean_bg(t); darken(im, .3); harpoon(im, t, 35.94)
        slam(im, 'MICROSCOPIC', t, 35.16, 250, 150, col=(150, 210, 255)); slam(im, 'HARPOONS', t, 35.94, 390, 170, col=(255, 80, 60))
    else:
        im = Image.new('RGBA', (W, H), (2, 8, 6, 255)); ecg(im, t, 39.4)
        secs = max(0, 180 - (t - 39.0) * 60); mm, ss = int(secs // 60), int(secs % 60)
        put(im, text_img(f'{mm}:{ss:02d}', 'bebas', 220, (255, 70, 60, 255), 0, shadow=8), W / 2, 560, 1, 1)
        slam(im, 'STOPS THE HEART', t, 38.74, 300, 130)
        if t > 42.6: slam(im, 'ZERO', t, 42.76, 1150, 230, col=(255, 60, 50)); label(im, 'CHANCE OF SURVIVAL', 1280, t, 43.24, size=50)
    flash(im, max(pulse(t, 27.4, 27.55), pulse(t, 34.0, 34.1), pulse(t, 38.6, 38.7)))
    return im

def sc_stone(A, t):  # 44.9 – 52.2
    if t < 48.4:
        im = shot(A, ['scorpion2'], t, 44.9, 48.4, 1.0, 1.3, .5, .5); topshade(im)
        slam(im, 'STONEFISH', t, 45.86, 330, 220, col=(255, 140, 60)); label(im, 'CAMOUFLAGED ON THE SEAFLOOR', 500, t, 46.82, size=46)
        tag(im, t, 'SCORPIONFISH · STONEFISH RELATIVE · NOAA', 45.0)
    else:
        im = shot(A, ['lionfish'], t, 48.4, 52.2, 1.6, 2.0, .35, .65); flash(im, .12, (120, 0, 0)); topshade(im)
        slam(im, 'EXCRUCIATING', t, 49.24, 300, 170, col=(255, 60, 50)); slam(im, 'PAIN', t, 50.0, 470, 230)
        if t > 51.0: label(im, 'VENOMOUS SPINES', 650, t, 51.0, size=58)
        dx, dy = shake(t, 50.0, 22)
        if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    flash(im, max(pulse(t, 44.9, 45.05), pulse(t, 48.4, 48.5)))
    return im

def sc_snake(A, t):  # 52.2 – 60.3
    k = eo((t - 59.2) / .15) * (1 - seg(t, 59.5, 60.0))
    im = snake(t, 52.2, k)
    if t < 55.5: pin(im, t, 53.54, 'INLAND TAIPAN', 'AUSTRALIA', 300)
    else:
        n = int(lerp(0, 100, eo((t - 57.2) / 1.0)))
        if t > 57.1: put(im, text_img(f'{n}', 'bebas', 240, (255, 60, 50, 255), 0, shadow=8), W / 2, 340, 1, eo((t - 57.2) / .2))
        if t > 57.7: label(im, 'PEOPLE · ONE BITE', 500, t, 57.8, size=56)
    dx, dy = shake(t, 59.2, 30)
    if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    flash(im, max(pulse(t, 52.2, 52.35), .5 * pulse(t, 59.2, 59.3)))
    return im

def sc_question(A, t):  # 60.3 – 68.4
    if t < 63.9:
        im = jungle_bg(t); put(im, frog(t, .8), W / 2, 1200, 1); darken(im, .35)
        slam(im, 'BUILT FOR', t, 61.74, 330, 170); slam(im, 'HUNTING?', t, 62.96, 500, 220, col=(255, 200, 40))
    else:
        im = ocean_bg(t); put(im, boxjelly(t, 1.3), W / 2, 1150, 1); darken(im, .3)
        slam(im, "OR NATURE'S", t, 64.1, 330, 150); slam(im, 'DETERRENT?', t, 65.84, 500, 200, col=(255, 60, 50))
    scan(im, t); flash(im, max(pulse(t, 60.3, 60.45), pulse(t, 63.9, 64.0)))
    return im

def sc_end(A, t):  # 68.4 – end
    im = ocean_bg(t); put(im, boxjelly(t, 1.4), W / 2, 1250, 1); darken(im, .35)
    slam(im, 'WHAT DO', t, 68.45, 330, 150)
    slam(im, 'YOU THINK?', t, 68.7, 480, 200, col=(255, 60, 50))
    a = back((t - 68.9) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 70.4) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 70.4) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    flash(im, pulse(t, 68.4, 68.6))
    return im

SCENES = [(0, 4.6, sc_hook), (4.6, 12.9, sc_drop), (12.9, 27.4, sc_frog), (27.4, 44.9, sc_jelly), (44.9, 52.2, sc_stone),
          (52.2, 60.3, sc_snake), (60.3, 68.4, sc_question), (68.4, 99, sc_end)]

def frame(A, t):
    for a, b, fn in SCENES:
        if a <= t < b: break
    im = fn(A, t)
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
