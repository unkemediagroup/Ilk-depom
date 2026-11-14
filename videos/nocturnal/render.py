# Nocturnal animals — YT Shorts renderer (1080x1920, 30 fps).
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
            A[k] = eerie(im, sat=1.0, contrast=1.1, tint=(0, 0, .02))
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

# ---------------------------------------------------------------- CAVE
DUR = 68.3
KEY = {'SECRET', 'UNCHARTED', 'CAVE', 'THOUSANDS', 'REWRITING', 'HISTORY', 'DARKNESS', 'UNTOUCHED', 'CHAMBER', 'GLOWING',
       'HANDPRINTS', 'STAR', 'MAPS', 'PREDATE', 'NIGHTMARE', 'MARVEL', 'VAULT', 'SARCOPHAGUS', 'BLACK', 'CRYSTAL', 'ELECTROMAGNETIC',
       'DRAINED', 'BATTERIES', 'TELESCOPE', 'ENTITY', 'SEALED', 'TOMB', 'UNKNOWN', 'ANCIENT', 'MYSTERIES'}

def torch(im, t, cx, cy, r=520, dark=.82):
    """Darken everything except a flashlight circle."""
    m = Image.new('L', (W, H), int(255 * dark)); ImageDraw.Draw(m).ellipse((cx - r, cy - r, cx + r, cy + r), fill=0)
    m = m.filter(ImageFilter.GaussianBlur(r * .45))
    blk = Image.new('RGBA', (W, H), (0, 0, 0, 255)); blk.putalpha(m); im.alpha_composite(blk)

def rockwall(seed=1, tint=(70, 58, 48)):
    r = np.random.default_rng(seed)
    n = np.array(Image.fromarray((r.random((48, 27)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)) / 255.
    n2 = np.array(Image.fromarray((r.random((192, 108)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)) / 255.
    v = (n * .7 + n2 * .3)[..., None]
    a = np.array(tint, np.float32) * (.55 + .7 * v)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert('RGBA')

# ---------------------------------------------------------------- NOCTURNAL ANIMALS
DUR = 76.3
KEY = {'DARKNESS', 'BIZARRE', 'NOCTURNAL', 'CREATURES', 'SHADOWS', 'SURVIVE', 'NIGHT', 'EERIE', 'AYE-AYE', 'LEMUR', 'MADAGASCAR',
       'GLOWING', 'EYES', 'BAT-LIKE', 'EARS', 'SKELETAL', 'FINGER', 'TAP', 'LARVAE', 'SURREAL', 'SUNDA', 'COLUGO', 'FLYING', 'GLIDES',
       'SKIN', 'GRAVITY', 'STAR-NOSED', 'MOLE', 'BLIND', '22', 'TENTACLES', '25,000', 'RECEPTORS', 'MILLISECONDS', 'OTHERWORLDLY', 'UNKNOWN'}

def night_forest(t, moon=True):
    im = grad_img((4, 8, 20), (14, 24, 34), 1.1); d = ImageDraw.Draw(im); r = rng(2)
    for _ in range(200):
        x, y, b = r.random() * W, r.random() * H * .5, r.random(); s = .6 + b * 1.4; c = int(110 + 140 * b)
        d.ellipse((x - s, y - s, x + s, y + s), fill=(c, c, min(255, c + 20), 255))
    if moon:
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((640, 180, 960, 500), fill=(220, 230, 255, 120))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(60))); ImageDraw.Draw(im).ellipse((700, 240, 900, 440), fill=(235, 238, 230, 255))
    d = ImageDraw.Draw(im)
    for k in range(9):
        x = -80 + k * 150 + r.random() * 60; w = 40 + r.random() * 50
        d.rectangle((x, 300 + r.random() * 300, x + w, H), fill=(6, 10, 10, 255))
        for j in range(6):
            yy = 500 + r.random() * 900; d.line((x + w / 2, yy, x + w / 2 + r.uniform(-220, 220), yy - r.uniform(40, 200)), fill=(6, 10, 10, 255), width=12)
    d.rectangle((0, 1700, W, H), fill=(4, 6, 6, 255))
    motes(im, t, 30, col=(190, 255, 140), rise=-8, alpha=.8)  # fireflies
    return im

def ayeaye(t, tap=0.):
    im = Image.new('RGBA', (1000, 1100), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    fur = (52, 46, 40, 255)
    d.ellipse((260, 520, 760, 1100), fill=fur)                                           # body
    for x in range(260, 760, 14): d.line((x, 560, x + 10 * math.sin(x), 520), fill=(80, 74, 66, 255), width=3)  # shaggy fur
    for s in (-1, 1):                                                                    # huge ears
        d.polygon([(500 + s * 90, 300), (500 + s * 370, 60), (500 + s * 330, 420)], fill=(30, 26, 24, 255))
        d.polygon([(500 + s * 120, 300), (500 + s * 330, 120), (500 + s * 300, 380)], fill=(70, 50, 50, 255))
    d.ellipse((330, 230, 670, 600), fill=(70, 64, 56, 255))                              # head
    d.ellipse((440, 470, 560, 560), fill=(200, 170, 150, 255))                           # snout
    for s in (-1, 1):                                                                    # glowing eyes
        d.ellipse((500 + s * 95 - 62, 330, 500 + s * 95 + 62, 454), fill=(250, 200, 60, 255))
        d.ellipse((500 + s * 95 - 22, 352, 500 + s * 95 + 22, 432), fill=(10, 8, 6, 255))
    fx, fy = 760, 720                                                                    # the finger
    ang = -1.0 + .35 * math.sin(tap * 20)
    pts = [(fx, fy), (fx + 90, fy - 40), (fx + 90 + math.cos(ang) * 220, fy - 40 + math.sin(ang) * 220)]
    d.line(pts, fill=(40, 34, 30, 255), width=14); d.line(pts[1:], fill=(170, 150, 130, 255), width=5)
    return glow(im, 6, .5)

def colugo(t):
    im = Image.new('RGBA', (1000, 800), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    flap = 20 * math.sin(t * 2)
    body = (60, 52, 44, 255)
    d.polygon([(500, 220), (60, 300 + flap), (80, 520 + flap), (300, 700), (500, 760), (700, 700), (920, 520 + flap), (940, 300 + flap)], fill=(78, 68, 58, 235))
    for x in range(100, 900, 40): d.line((500, 450, x, 330 + flap * .5 + abs(x - 500) * .15), fill=(100, 90, 78, 200), width=3)
    d.ellipse((430, 160, 570, 300), fill=body); d.ellipse((440, 290, 560, 700), fill=body)
    for s in (-1, 1): d.ellipse((500 + s * 34 - 18, 200, 500 + s * 34 + 18, 236), fill=(240, 220, 160, 255))
    return im

def starmole(t):
    im = Image.new('RGBA', (1000, 800), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.ellipse((300, 260, 900, 640), fill=(92, 76, 70, 255))
    d.ellipse((380, 560, 520, 660), fill=(200, 140, 140, 255)); d.ellipse((700, 560, 840, 660), fill=(200, 140, 140, 255))
    cx, cy = 260, 440
    for k in range(22):
        a = k / 22 * 2 * math.pi; L = 80 + 15 * math.sin(t * 9 + k * 1.3)
        d.line((cx, cy, cx + math.cos(a) * L, cy + math.sin(a) * L), fill=(250, 140, 170, 255), width=18)
        d.ellipse((cx + math.cos(a) * L - 10, cy + math.sin(a) * L - 10, cx + math.cos(a) * L + 10, cy + math.sin(a) * L + 10), fill=(255, 170, 190, 255))
    d.ellipse((cx - 30, cy - 30, cx + 30, cy + 30), fill=(255, 150, 175, 255))
    d.ellipse((330, 360, 420, 520), fill=(110, 90, 84, 255))
    return im

def tunnel_bg(t):
    im = Image.new('RGBA', (W, H), (40, 28, 20, 255)); d = ImageDraw.Draw(im); r = rng(3)
    for _ in range(400):
        x, y, s = r.random() * W, r.random() * H, r.uniform(4, 22); c = r.randint(40, 80)
        d.ellipse((x - s, y - s * .7, x + s, y + s * .7), fill=(c, int(c * .72), int(c * .5), 255))
    d.ellipse((60, 700, 1020, 1380), fill=(18, 12, 8, 255))
    return im

def sc_hook(A, t):  # 0 – 12.2
    if t < 7.9:
        im = night_forest(t); put(im, ayeaye(t), W / 2, 1300, lerp(.9, 1.05, eo(t / 7.9)), eo(t / .6))
        topshade(im)
        put(im, text_img('THE MOST BIZARRE', 'oswald', 54, (210, 230, 250, 255), 0, track=6, shadow=4), W / 2, 260, 1, eo((t - .1) / .3))
        slam(im, 'NOCTURNAL', t, .2, 410, 220, col=(250, 200, 60)); slam(im, 'ANIMALS', t, .5, 590, 200)
        if t > 3.6: label(im, 'THEY COME ALIVE AT NIGHT', 760, t, 3.7, size=52, col=(190, 255, 140))
    else:
        im = shot(A, ['fruitbat'], t, 7.9, 12.2, 1.0, 1.15, .45, .45); darken(im, .3); topshade(im)
        slam(im, 'BIZARRE TRAITS', t, 8.6, 330, 170, col=(250, 200, 60)); label(im, 'TO SURVIVE THE NIGHT', 500, t, 10.58, size=56)
        tag(im, t, 'BHAWANI DAS · GREAT INDIAN FRUIT BAT, c. 1777 · THE MET', 8.0)
    flash(im, max(pulse(t, 0, .2), pulse(t, 7.9, 8.0)))
    return im

def sc_aye(A, t):  # 12.2 – 29.6
    im = night_forest(t, moon=t < 22)
    z = 1.0 if t < 18 else (1.35 if t < 22 else 1.15)
    put(im, ayeaye(t, max(0, t - 26.0)), W / 2, 1250 if t < 18 else 1150, z)
    if t < 15.9: slam(im, 'MASTERS OF', t, 13.28, 330, 170); slam(im, 'THE NIGHT', t, 14.12, 500, 200, col=(150, 180, 255))
    elif t < 18.4: pin(im, t, 14.86 if t < 15.9 else 15.9, 'AYE-AYE', 'MADAGASCAR', 300)
    elif t < 20.7: slam(im, 'GLOWING EYES', t, 19.32, 300, 190, col=(250, 200, 60))
    elif t < 21.9: slam(im, 'BAT-LIKE EARS', t, 20.78, 300, 190)
    elif t < 26.1: slam(im, 'SKELETAL', t, 23.64, 300, 220, col=(255, 70, 50)); slam(im, 'MIDDLE FINGER', t, 24.26, 480, 160)
    else: slam(im, 'TAP… TAP…', t, 26.2, 300, 200, col=(250, 200, 60)); label(im, 'FISHING OUT LARVAE', 470, t, 27.58, size=56)
    if 26.1 < t < 28.5:
        k = (t * 6) % 1
        if k < .15: flash(im, .12)
    flash(im, max(pulse(t, 12.2, 12.35), pulse(t, 18.4, 18.5)))
    return im

def sc_colugo(A, t):  # 29.6 – 45.0
    im = night_forest(t)
    k = (t - 29.6) / 15.4
    put(im, colugo(t), lerp(-200, W + 200, k), 900 + 200 * math.sin(k * 3), lerp(.6, 1.0, math.sin(k * math.pi)))
    if t < 32.4: slam(im, 'EQUALLY SURREAL', t, 29.82, 300, 160, col=(190, 255, 140))
    elif t < 34.7: pin(im, t, 31.2 if t < 32.4 else 32.4, 'SUNDA COLUGO', 'SOUTHEAST ASIA', 300)
    elif t < 37.3: slam(im, '"FLYING LEMUR"', t, 34.8, 300, 180, col=(150, 180, 255))
    elif t < 41.9: slam(im, 'GLIDES SILENTLY', t, 35.02, 300, 170); label(im, 'ON A WEB OF SKIN', 460, t, 38.68, size=58)
    else: slam(im, 'DEFYING', t, 42.18, 300, 200); slam(im, 'GRAVITY', t, 42.66, 480, 220, col=(250, 200, 60))
    flash(im, pulse(t, 29.6, 29.75))
    return im

def sc_mole(A, t):  # 45.0 – 62.7
    im = tunnel_bg(t)
    z = 1.0 if t < 51.5 else (1.6 if t < 56 else 1.25)
    cx = W / 2 if t < 51.5 else (W / 2 + 250 if t < 56 else W / 2 + 100)
    put(im, starmole(t), cx, 1050, z)
    if 51.5 <= t < 56:  # tentacle count
        put(im, text_img('22', 'bebas', 260, (255, 150, 175, 255), 0, shadow=8), W / 2, 420, lerp(1.4, 1, eo((t - 51.96) / .2)), eo((t - 51.96) / .2))
        label(im, 'PINK TENTACLES', 600, t, 53.56, size=60)
    if t < 48.0: slam(im, 'THEN THERE IS…', t, 45.16, 300, 140)
    elif t < 51.5: pin(im, t, 48.0, 'STAR-NOSED MOLE', 'NORTH AMERICA · BLIND', 300)
    elif t >= 56:
        n = int(lerp(0, 25000, eo((t - 56.22) / 1.2)))
        put(im, text_img(f'{n:,}', 'bebas', 230, (255, 255, 255, 255), 0, shadow=8), W / 2, 380, 1, eo((t - 56.22) / .2))
        label(im, 'SENSORY RECEPTORS', 540, t, 57.68, size=60)
        if t > 60.9: slam(im, 'IN MILLISECONDS', t, 61.0, 700, 120, col=(250, 200, 60))
    flash(im, max(pulse(t, 45.0, 45.15), pulse(t, 51.5, 51.6), pulse(t, 56.0, 56.1)))
    return im

def sc_question(A, t):  # 62.7 – 69.7
    i = int((t - 62.7) / .8) % 3
    im = night_forest(t)
    put(im, [ayeaye(t), colugo(t), starmole(t)][i], W / 2, 1200, 1.0); darken(im, .35)
    slam(im, 'OTHERWORLDLY', t, 63.3, 330, 200, col=(190, 255, 140)); slam(im, 'ADAPTATIONS?', t, 64.08, 520, 170)
    if t > 66.8: label(im, 'WHILE THE WORLD SLEEPS', 680, t, 67.0, size=56)
    scan(im, t)
    return im

def sc_end(A, t):  # 69.7 – end
    im = shot(A, ['moon'], t, 69.7, DUR, 1.3, 1.1, .5, .5); darken(im, .4)
    slam(im, 'WHAT DO', t, 69.75, 330, 150)
    slam(im, 'YOU THINK?', t, 70.0, 480, 200, col=(250, 200, 60))
    a = back((t - 70.2) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 71.6) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 71.6) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    tag(im, t, 'FULL MOON · NASA', 69.8)
    flash(im, pulse(t, 69.7, 69.9))
    return im

SCENES = [(0, 12.2, sc_hook), (12.2, 29.6, sc_aye), (29.6, 45.0, sc_colugo), (45.0, 62.7, sc_mole), (62.7, 69.7, sc_question), (69.7, 99, sc_end)]

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
