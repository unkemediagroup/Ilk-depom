# Unexplained phenomena — YT Shorts renderer (1080x1920, 30 fps).
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
            A[k] = eerie(im, sat=1.0, contrast=1.1, tint=(0, 0, 0))
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

# ---------------------------------------------------------------- PHENOMENA
DUR = 69.0
KEY = {'DARK', 'TERRIFYING', 'SECRETS', 'FAILED', 'EERIE', 'TAOS', 'HUM', 'LOW-FREQUENCY', 'DRONING', 'UNDERGROUND', 'UNDETECTABLE',
       'HESSDALEN', 'LIGHTS', 'NORWAY', 'PLASMA', 'DEFYING', 'PHYSICS', 'SPONTANEOUS', 'COMBUSTION', 'DIE-OFFS', 'DEAD', 'BIRDS',
       'POISON', 'DISEASE', 'HIDDEN', 'FORCES', 'UNKNOWN', 'UNEXPLAINED', 'MYSTERIES'}

def ridge(seed, base, amp, w=W):
    r = np.random.default_rng(seed); xs = np.arange(w)
    y = base + sum(amp / (k + 1) ** 1.3 * np.sin(xs / w * 6.28 * (k + 1) * 1.2 + r.random() * 6) for k in range(6))
    y += np.cumsum(r.normal(0, 2.2, w)); y -= np.convolve(y - base, np.ones(120) / 120, 'same') * .6
    return y

def night_valley(t, snow=False):
    im = grad_img((4, 6, 16), (24, 30, 52), 1.2); d = ImageDraw.Draw(im); r = rng(3)
    for _ in range(300):
        x, y, b = r.random() * W, r.random() * H * .6, r.random(); s = .7 + b * 1.6; c = int(110 + 140 * b)
        d.ellipse((x - s, y - s, x + s, y + s), fill=(c, c, min(255, c + 20), 255))
    for i, (base, amp, col) in enumerate([(980, 260, (22, 28, 44)), (1180, 220, (14, 18, 30)), (1420, 160, (8, 10, 18))]):
        rg = ridge(10 + i, base, amp)
        d.polygon([(0, H)] + [(x, float(rg[x])) for x in range(0, W, 4)] + [(W, H)], fill=col + (255,))
        if snow and i < 2:
            for x in range(0, W - 4, 4): d.line((x, rg[x] + 2, x + 4, rg[x + 4] + 2), fill=(120, 130, 150, 200), width=3)
    return im

def town(im, t, lights=True):
    d = ImageDraw.Draw(im); r = rng(12)
    x = 40
    while x < W:
        w = r.randint(90, 180); h = r.randint(70, 150); y = 1560
        d.rectangle((x, y - h, x + w, y), fill=(10, 10, 14, 255))
        if lights and r.random() < .6:
            d.rectangle((x + w * .3, y - h * .6, x + w * .3 + 22, y - h * .6 + 26), fill=(255, 190, 90, 255))
        x += w + r.randint(20, 80)
    d.rectangle((0, 1560, W, H), fill=(10, 10, 14, 255))

def soundrings(im, t, cx=W / 2, cy=1580, col=(120, 200, 255), n=6, speed=260):
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for k in range(n):
        ph = ((t * speed / 900) + k / n) % 1; R = 60 + ph * 900
        gd.ellipse((cx - R, cy - R * .35, cx + R, cy + R * .35), outline=col + (int(200 * (1 - ph)),), width=6)
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(3)))

def waveform(im, t, y=760, amp=60, col=(120, 220, 255), f=2.2, noise=.0):
    d = ImageDraw.Draw(im); pts = []
    for x in range(60, W - 60, 6):
        v = math.sin(x / 40 * f + t * 9) * .7 + math.sin(x / 13 + t * 4) * .3 + (rng(int(x + t * 300)).random() - .5) * noise
        pts.append((x, y + v * amp * math.sin(math.pi * (x - 60) / (W - 120))))
    d.line(pts, fill=col + (255,), width=6)

def orbs(im, t, t0):
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    cols = [(255, 160, 60), (255, 255, 240), (110, 170, 255), (255, 200, 120), (140, 200, 255)]
    pts = []
    for i, c in enumerate(cols):
        a = eo((t - t0 - i * .35) / .6)
        if a <= 0: continue
        x = W / 2 + 330 * math.sin(t * (.35 + i * .13) + i * 2.1) + 80 * math.sin(t * 1.7 + i)
        y = 700 + 230 * math.sin(t * (.27 + i * .09) + i * 1.3)
        fl = .75 + .25 * math.sin(t * (5 + i) + i)
        R = (62 + i * 8) * fl
        gd.ellipse((x - R * 3, y - R * 3, x + R * 3, y + R * 3), fill=c + (int(90 * a),))
        pts.append((x, y, R, c, a))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(50)))
    d = ImageDraw.Draw(im)
    for x, y, R, c, a in pts:
        d.ellipse((x - R, y - R, x + R, y + R), fill=c + (int(255 * a),))
        d.ellipse((x - R * .5, y - R * .5, x + R * .5, y + R * .5), fill=(255, 255, 255, int(255 * a)))
    # reflection on snow valley
    return im

def chair(t):
    im = grad_img((10, 8, 8), (40, 30, 24)); d = ImageDraw.Draw(im)
    d.rectangle((0, 1350, W, H), fill=(42, 32, 26, 255))
    d.rounded_rectangle((300, 800, 780, 1360), 40, fill=(70, 30, 26, 255))
    d.rounded_rectangle((240, 1050, 360, 1420), 30, fill=(60, 26, 22, 255)); d.rounded_rectangle((720, 1050, 840, 1420), 30, fill=(60, 26, 22, 255))
    d.rectangle((330, 1100, 750, 1250), fill=(52, 22, 18, 255))
    d.ellipse((380, 1150, 700, 1260), fill=(70, 66, 62, 255))  # ash
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for i in range(14):
        ph = ((t * .3 + i / 14) % 1); x = 540 + 80 * math.sin(ph * 6 + i); y = 1180 - ph * 900
        gd.ellipse((x - 60 - ph * 80, y - 60, x + 60 + ph * 80, y + 60), fill=(120, 110, 104, int(120 * (1 - ph))))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(30)))
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((350, 1050, 730, 1300), fill=(255, 110, 30, int(90 + 50 * math.sin(t * 9))))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(50)))
    return im

def birds_fall(t, t0):
    im = grad_img((70, 80, 96), (190, 180, 170), 1.1); d = ImageDraw.Draw(im)
    rg = ridge(5, 1650, 60); d.polygon([(0, H)] + [(x, float(rg[x])) for x in range(0, W, 6)] + [(W, H)], fill=(40, 40, 44, 255))
    for i in range(70):
        a, b, c = MO[i]
        x0 = (a * W * 1.2 + (t - t0) * 120 * (.5 + c)) % (W + 100) - 50
        y0 = 200 + b * 700
        fall = max(0., t - (t0 + 2.0 + c * .8))
        y = y0 + fall * fall * 700
        if y > 1700: continue
        rot = min(1, fall * 2)
        s = 10 + c * 10
        if rot < .5:
            flap = math.sin(t * 14 + i) * s * .6
            d.line((x0 - s, y - flap, x0, y, x0 + s, y - flap), fill=(20, 20, 24, 255), width=4)
        else:
            d.ellipse((x0 - s * .5, y - s * .3, x0 + s * .5, y + s * .3), fill=(20, 20, 24, 255))
            d.line((x0, y, x0 + s * .4, y - s), fill=(20, 20, 24, 255), width=3)
    for i in range(70):  # dead birds on ground
        a, b, c = MO[i + 70]
        if t > t0 + 3.0 + c * 1.5:
            x = a * W; y = 1700 + b * 160; s = 8 + c * 8
            d.ellipse((x - s, y - s * .4, x + s, y + s * .4), fill=(18, 18, 20, 255))
    return im

def sc_hook(A, t):  # 0 – 8.4
    im = shot(A, ['iss066e116300'], t, 0, 9.9, 1.6, 1.2, .55, .6); topshade(im)
    put(im, text_img('UNEXPLAINED', 'bebas', 220, (120, 255, 190, 255), 0, shadow=8), W / 2, 380, lerp(1.6, 1, eo(t / .25)), eo(t / .2))
    slam(im, 'NATURAL PHENOMENA', t, .35, 540, 120)
    slam(im, "SCIENCE STILL CAN'T EXPLAIN", t, .9, 660, 70, col=(255, 200, 120))
    if t > 7.3: stamp(im, t, 8.66, 'AND FAILED', W / 2, 900, -8)
    tag(im, t, 'EARTH AT NIGHT FROM THE ISS · NASA', .4)
    scan(im, t); flash(im, pulse(t, 0, .2))
    return im

def sc_taos(A, t):  # 9.9 – 27.0  (scene starts 8.4 for continuity)
    lt = t - 8.4
    if t < 20.8:
        im = night_valley(t); town(im, t); soundrings(im, t)
        if t < 12.2: slam(im, 'ONE OF THE MOST', t, 10.1, 330, 120); slam(im, 'EERIE', t, 10.64, 470, 230, col=(120, 220, 255))
        elif t < 13.5: pin(im, t, 12.24, 'THE TAOS HUM', 'NEW MEXICO · & WORLDWIDE', 360)
        else:
            waveform(im, t, 520, 70, f=1.2)
            slam(im, 'LOW-FREQUENCY', t, 13.82, 300, 150, col=(120, 220, 255))
            if t > 16.1: label(im, 'NON-STOP DRONING', 680, t, 16.16, size=56)
            if t > 17.6: label(im, 'HEARD IN ISOLATED TOWNS', 770, t, 17.82, size=46, col=(255, 210, 160), bar=False)
        dx = 4 * math.sin(t * 60); im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, 0), Image.BILINEAR)
    elif t < 24.4:
        im = grad_img((10, 8, 6), (50, 36, 24)); d = ImageDraw.Draw(im)
        for k in range(10): d.rectangle((0, 900 + k * 100, W, 1000 + k * 100), fill=(40 - k * 3, 30 - k * 2, 20 - k, 255))
        soundrings(im, t, W / 2, 1400, (255, 160, 80), 7, 360)
        slam(im, 'LIKE A DIESEL ENGINE', t, 21.54, 300, 110)
        slam(im, 'UNDERGROUND', t, 23.24, 450, 190, col=(255, 140, 60))
        dx = 6 * math.sin(t * 70); im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, 0), Image.BILINEAR)
    else:
        im = grad_img((6, 8, 12), (18, 22, 30)); d = ImageDraw.Draw(im)
        cx, cy = W / 2, 900
        d.rounded_rectangle((cx - 90, cy - 260, cx + 90, cy + 60), 90, fill=(70, 74, 80, 255), outline=(200, 205, 210, 255), width=8)
        for k in range(8): d.line((cx - 70, cy - 220 + k * 32, cx + 70, cy - 220 + k * 32), fill=(40, 44, 50, 255), width=6)
        d.arc((cx - 160, cy - 120, cx + 160, cy + 160), 0, 180, fill=(200, 205, 210, 255), width=10)
        d.line((cx, cy + 160, cx, cy + 300), fill=(200, 205, 210, 255), width=10); d.line((cx - 100, cy + 300, cx + 100, cy + 300), fill=(200, 205, 210, 255), width=10)
        waveform(im, t, 1180, 2, col=(90, 100, 110))
        k = eo((t - 24.6) / .3)
        if k > 0:
            d.line((cx - 230 * k, cy - 330 * k, cx + 230 * k, cy + 330 * k), fill=(255, 50, 40, 255), width=22)
        slam(im, 'UNDETECTABLE', t, 24.58, 330, 190, col=(255, 60, 50))
        label(im, 'BY ANY MICROPHONE', 470, t, 25.6, size=54)
    scan(im, t)
    flash(im, max(pulse(t, 9.9, 10.05), pulse(t, 20.8, 20.9), pulse(t, 24.4, 24.5)))
    return im

def sc_hess(A, t):  # 27.0 – 41.4
    im = night_valley(t, snow=True); im = orbs(im, t, 28.0)
    if t < 30.8:
        slam(im, 'THEN THERE IS…', t, 27.1, 300, 120, out=28.5)
        if t > 28.5: pin(im, t, 28.6, 'HESSDALEN LIGHTS', 'NORWAY', 300)
    elif t < 34.1:
        for k, (txt, c, tc) in enumerate([('ORANGE', (255, 160, 60), 32.0), ('WHITE', (255, 255, 240), 32.72), ('BLUE', (110, 170, 255), 33.28)]):
            if t > tc: put(im, text_img(txt, 'bebas', 150, c + (255,), 0, shadow=8), W / 2, 280 + k * 150, lerp(1.4, 1, eo((t - tc) / .2)), eo((t - tc) / .2))
    elif t < 37.9:
        slam(im, 'DANCING', t, 34.12, 300, 200, col=(255, 200, 120)); label(im, 'FOR HOURS', 460, t, 36.8, size=60)
    else:
        slam(im, 'DEFYING', t, 38.06, 300, 200, col=(255, 60, 50)); slam(im, 'PHYSICS', t, 40.24, 470, 220)
    flash(im, pulse(t, 27.0, 27.15))
    return im

def sc_strange(A, t):  # 41.4 – 56.3
    if t < 45.0:
        im = chair(t)
        slam(im, 'STRANGER STILL…', t, 41.56, 300, 120, out=42.8)
        if t > 42.8: slam(im, 'SPONTANEOUS', t, 42.86, 300, 160, col=(255, 140, 50)); slam(im, 'HUMAN COMBUSTION', t, 43.36, 450, 130)
        flicker(im, t, .08)
    elif t < 48.0:
        im = shot(A, ['rooks'], t, 45.0, 48.0, 1.1, 1.35, .5, .45); topshade(im)
        slam(im, 'MASS DIE-OFFS', t, 46.12, 330, 180, col=(255, 60, 50))
        tag(im, t, 'E. CALVERT · "LADY WITH THE ROOKS", 1829 · THE MET', 45.1)
    else:
        im = birds_fall(t, 47.0)
        slam(im, 'THOUSANDS OF BIRDS', t, 48.16, 300, 130, out=49.7)
        if t > 49.7: slam(im, 'DROP DEAD', t, 49.8, 300, 220, col=(255, 60, 50))
        if t > 53.0: label(im, 'NO POISON · NO DISEASE', 480, t, 53.4, size=60, col=(255, 255, 255))
    scan(im, t)
    flash(im, max(pulse(t, 41.4, 41.55), pulse(t, 45.0, 45.1), pulse(t, 48.0, 48.1)))
    return im

def sc_question(A, t):  # 56.3 – 62.6
    im = shot(A, ['iss071e170351'], t, 56.3, 62.6, 1.0, 1.2, .5, .5); darken(im, .2)
    slam(im, 'HIDDEN FORCES', t, 56.64, 330, 160, col=(120, 220, 255), out=59.0)
    if t > 59.0: slam(im, 'BENEATH', t, 59.16, 330, 200); slam(im, 'OUR NOSES?', t, 59.72, 500, 170, col=(255, 60, 50))
    tag(im, t, 'LIGHTNING SEEN FROM THE ISS · NASA', 56.4)
    scan(im, t); flash(im, pulse(t, 56.3, 56.45))
    return im

def sc_end(A, t):  # 62.6 – end
    im = shot(A, ['iss072e159172'], t, 62.6, DUR, 1.4, 1.15, .5, .6); darken(im, .4)
    slam(im, 'WHAT DO', t, 62.65, 330, 150)
    slam(im, 'YOU THINK?', t, 62.9, 480, 200, col=(120, 255, 190))
    a = back((t - 63.1) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 64.5) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 64.5) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    flash(im, pulse(t, 62.6, 62.8))
    return im

SCENES = [(0, 9.9, sc_hook), (9.9, 27.0, sc_taos), (27.0, 41.4, sc_hess), (41.4, 56.3, sc_strange), (56.3, 62.6, sc_question), (62.6, 99, sc_end)]

def frame(A, t):
    for a, b, fn in SCENES:
        if a <= t < b: break
    im = fn(A, t)
    if t < 8.4 and t > 7.0: pass
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
