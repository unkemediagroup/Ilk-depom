# Urban legends — YT Shorts renderer (1080x1920, 30 fps).
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
            A[k] = eerie(im, sat=.8, contrast=1.15, tint=(-.01, 0, .02))
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

# ---------------------------------------------------------------- URBAN LEGENDS
DUR = 72.9
KEY = {'SHADOWS', 'CHILLING', 'URBAN', 'LEGENDS', 'DREAD', 'MILLIONS', 'TRUE', 'TERRIFYING', 'KUCHISAKE', 'ONNA', 'SLIT-MOUTHED',
       'MALEVOLENT', 'SPIRIT', 'MASK', 'MIDNIGHT', 'BEAUTIFUL', 'INCORRECTLY', 'HORRIFIC', 'SCISSORS', 'SLENDER', 'MAN', 'FOGGY',
       'FACELESS', 'CHILDREN', 'MIST', 'BLIND', 'MUTATED', 'ALLIGATORS', 'SEWERS', 'PARANOIA', 'HORRORS', 'UNKNOWN', 'DARK'}

def alley(t, light=1.):
    im = grad_img((4, 6, 10), (16, 18, 24)); d = ImageDraw.Draw(im)
    d.polygon([(0, 0), (330, 300), (330, 1500), (0, H)], fill=(20, 20, 26, 255))
    d.polygon([(W, 0), (750, 300), (750, 1500), (W, H)], fill=(18, 18, 24, 255))
    for k in range(9):
        y = 340 + k * 120; d.rectangle((40, y, 120, y + 60), fill=(10, 10, 14, 255)); d.rectangle((960, y, 1040, y + 60), fill=(10, 10, 14, 255))
    d.polygon([(330, 1500), (750, 1500), (W, H), (0, H)], fill=(14, 14, 18, 255))
    fl = 1 if rng(int(t * 8)).random() > .12 else .3
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    gd.polygon([(540, 420), (300, 1560), (780, 1560)], fill=(255, 220, 160, int(70 * light * fl)))
    gd.ellipse((490, 380, 590, 460), fill=(255, 230, 180, int(230 * light * fl)))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(26)))
    d = ImageDraw.Draw(im); d.line((540, 420, 540, 300, 620, 260), fill=(30, 30, 34, 255), width=10)
    return im

def masked_woman(t, k=1.):
    im = Image.new('RGBA', (700, 1300), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    a = int(255 * k)
    d.polygon([(350, 220), (120, 1300), (580, 1300)], fill=(26, 22, 26, a), outline=(110, 90, 90, a))                  # long coat
    d.line((350, 220, 120, 1300), fill=(150, 120, 110, a), width=4); d.line((350, 220, 580, 1300), fill=(150, 120, 110, a), width=4)
    d.ellipse((260, 60, 440, 280), fill=(225, 214, 200, a))                                  # face
    d.polygon([(250, 60), (450, 60), (520, 500), (180, 500)], fill=(10, 8, 10, a))           # hair
    d.ellipse((268, 70, 432, 270), fill=(225, 214, 200, a))
    d.rounded_rectangle((270, 170, 430, 268), 30, fill=(245, 245, 240, a))                    # surgical mask
    d.line((270, 190, 228, 160), fill=(245, 245, 240, a), width=5); d.line((430, 190, 472, 160), fill=(245, 245, 240, a), width=5)
    for x in (310, 390): d.ellipse((x - 16, 128, x + 16, 150), fill=(20, 10, 10, a))
    for k2 in range(3): d.line((285, 200 + k2 * 22, 415, 200 + k2 * 22), fill=(210, 210, 205, a), width=3)
    return im

def scissors(scale=1.):
    im = Image.new('RGBA', (500, 700), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for s in (-1, 1):
        d.polygon([(250, 360), (250 + s * 30, 330), (250 - s * 70, 20), (250 - s * 50, 10)], fill=(210, 215, 220, 255))
        d.ellipse((250 + s * 70 - 70, 440, 250 + s * 70 + 70, 600), outline=(150, 20, 20, 255), width=24)
        d.line((250, 360, 250 + s * 70, 450), fill=(150, 20, 20, 255), width=24)
    d.ellipse((235, 345, 265, 375), fill=(80, 80, 86, 255))
    return im

def slender(im, t, a=1., x=W / 2, y=1250, h=1100):
    s = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(s); c = (8, 8, 10, int(255 * a))
    d.ellipse((x - 46, y - h, x + 46, y - h + 120), fill=(220, 222, 224, int(255 * a)))     # blank face
    d.rectangle((x - 70, y - h + 120, x + 70, y - h + 600), fill=c)
    d.polygon([(x - 70, y - h + 140), (x - 150, y - h + 680), (x - 120, y - h + 690), (x - 60, y - h + 260)], fill=c)
    d.polygon([(x + 70, y - h + 140), (x + 150, y - h + 680), (x + 120, y - h + 690), (x + 60, y - h + 260)], fill=c)
    d.rectangle((x - 60, y - h + 600, x - 15, y), fill=c); d.rectangle((x + 15, y - h + 600, x + 60, y), fill=c)
    d.polygon([(x - 12, y - h + 130), (x + 12, y - h + 130), (x, y - h + 260)], fill=(240, 240, 240, int(255 * a)))
    im.alpha_composite(s.filter(ImageFilter.GaussianBlur(1.5)))

def sewer(t):
    im = Image.new('RGBA', (W, H), (4, 5, 4, 255)); d = ImageDraw.Draw(im)
    for k in range(12, 0, -1):
        s = k / 12; w, h = 1300 * s, 1500 * s; cx, cy = W / 2, 900
        c = int(10 + 50 * s)
        d.rounded_rectangle((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), int(w * .45), outline=(c, int(c * .8), int(c * .6), 255), width=int(40 * s) + 2)
        for b in range(8):
            ang = math.pi * (b / 8); bx = cx + math.cos(ang) * w * .48; by = cy - h * .25 - math.sin(ang) * h * .25
            d.line((bx, by, bx + 10 * s, by + 18 * s), fill=(c - 6, int(c * .7), int(c * .5), 255), width=3)
    d.polygon([(0, H), (W, H), (W / 2 + 60, 1000), (W / 2 - 60, 1000)], fill=(24, 30, 20, 255))
    for k in range(30):
        y = 1010 + k * 30 + (t * 40 % 30); w2 = 60 + k * 30
        d.line((W / 2 - w2, y, W / 2 + w2, y), fill=(60, 74, 50, 120), width=2)
    return im

def eyes(im, t, t0, pts=((380, 1250), (700, 1350))):
    a = eo((t - t0) / .5) * (0.7 + .3 * math.sin(t * 3))
    if a <= 0: return
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for x, y in pts:
        for dx in (-26, 26): gd.ellipse((x + dx - 16, y - 9, x + dx + 16, y + 9), fill=(230, 230, 200, int(255 * a)))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(6))); im.alpha_composite(g)

def sc_hook(A, t):  # 0 – 10.2
    if t < 4.3:
        im = alley(t); put(im, masked_woman(t, eo((t - .3) / 1.2)), W / 2, 1520, 1.3)
        darken(im, .15); topshade(im)
        put(im, text_img("THE WORLD'S MOST TERRIFYING", 'oswald', 48, (220, 225, 235, 255), 0, track=6, shadow=4), W / 2, 260, 1, eo((t - .1) / .3))
        slam(im, 'URBAN', t, .2, 410, 230, col=(255, 60, 50)); slam(im, 'LEGENDS', t, .55, 600, 200)
    else:
        im = shot(A, ['grandst'], t, 4.3, 10.2, 1.1, 1.4, .5, .5); darken(im, .3); topshade(im); flicker(im, t, .1)
        slam(im, 'DEEPLY ROOTED', t, 4.82, 330, 150, out=7.2)
        if t > 7.2: slam(im, 'MILLIONS', t, 7.36, 330, 220, col=(255, 60, 50)); slam(im, 'SWEAR THEY ARE TRUE', t, 7.88, 500, 100)
        tag(im, t, 'GRAND STREET, NEW YORK, AT NIGHT · 1889 · LOC', 4.4)
    scan(im, t); flash(im, max(pulse(t, 0, .2), pulse(t, 4.3, 4.4)))
    return im

def sc_kuchi(A, t):  # 10.2 – 37.2
    if t < 13.4:
        im = shot(A, ['taira'], t, 10.2, 13.4, 1.6, 1.9, .55, .5); darken(im, .3); topshade(im)
        slam(im, 'MOST TERRIFYING', t, 10.88, 330, 150, col=(255, 60, 50))
        tag(im, t, 'KUNIYOSHI · GHOSTS OF THE TAIRA, 1840s · THE MET', 10.3)
    elif t < 16.5:
        im = shot(A, ['catdemon'], t, 13.4, 16.5, 1.7, 2.1, .62, .45); darken(im, .25); topshade(im)
        pin(im, t, 13.48, 'KUCHISAKE-ONNA', 'JAPAN', 300)
        if t > 15.0: label(im, 'THE SLIT-MOUTHED WOMAN', 640, t, 15.0, size=52, col=(255, 200, 190))
        tag(im, t, 'KUNIYOSHI · GHOST STORY PRINT, c. 1850 · THE MET', 13.5)
    elif t < 25.8:
        im = alley(t); x = W / 2 + 40 * math.sin(t * .4); put(im, masked_woman(t), x, 1520 - (t - 16.5) * 4, 1.3 + (t - 16.5) * .03)
        flicker(im, t, .1)
        if t < 19.4: slam(im, 'MALEVOLENT SPIRIT', t, 16.82, 300, 140, col=(255, 60, 50))
        elif t < 21.7: slam(im, 'SURGICAL MASK', t, 18.34, 300, 160, col=(240, 240, 240))
        else: slam(im, 'MIDNIGHT', t, 20.86, 300, 220, col=(150, 170, 255)); label(im, 'ONE QUESTION…', 470, t, 22.42, size=60)
    elif t < 29.3:
        im = Image.new('RGBA', (W, H), (0, 0, 0, 255)); put(im, masked_woman(t), W / 2, 1850, 1.8)
        darken(im, .3)
        put(im, text_img('"AM I', 'type', 150, (240, 230, 220, 255), 0, shadow=8), W / 2, 260, 1, eo((t - 25.88) / .3))
        put(im, text_img('BEAUTIFUL?"', 'type', 150, (255, 60, 50, 255), 0, shadow=8), W / 2, 430, lerp(1.2, 1, eo((t - 26.38) / .3)), eo((t - 26.38) / .3))
        if t > 27.4: label(im, 'ANSWER WRONG…', 590, t, 27.94, size=64, col=(255, 255, 255))
    else:
        im = alley(t, .3); darken(im, .3)
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((140, 600, 940, 1400), fill=(200, 0, 0, int(80 + 50 * math.sin(t * 8))))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(120)))
        if t > 34.0: put(im, scissors(), W / 2, 1050, back((t - 34.36) / .3) * 1.1, 1, -20 + 15 * math.sin(t * 6))
        slam(im, 'HORRIFIC', t, 30.3, 300, 220, col=(255, 60, 50), out=34.2)
        if t < 34.2: label(im, 'EAR-TO-EAR SMILE', 470, t, 30.84, size=60)
        else: slam(im, 'SEALS YOUR FATE', t, 34.2, 300, 150, col=(255, 255, 255))
        dx, dy = shake(t, 30.3, 24)
        if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    scan(im, t)
    flash(im, max(pulse(t, 10.2, 10.35), pulse(t, 13.4, 13.5), pulse(t, 16.5, 16.6), pulse(t, 25.8, 25.9), pulse(t, 29.3, 29.4)))
    return im

def sc_slender(A, t):  # 37.2 – 48.2
    im = shot(A, ['woods'], t, 37.2, 48.2, 1.05, 1.35, .5, .4); darken(im, .35)
    mist(im, 900, 120, 500, (190, 195, 200)); mist(im, 1300, 150, 400, (190, 195, 200))
    a = eo((t - 39.2) / 1.5) * (0.85 + .15 * math.sin(t * 2))
    jump = 0 if t < 44.0 else 1
    slender(im, t, a * (.6 if jump else 1), x=W / 2 + (220 if jump else -60), y=1350 if not jump else 1500, h=1000 if not jump else 1250)
    mist(im, 1500, 120, 300, (190, 195, 200))
    flicker(im, t, .1)
    if t < 40.9: slam(im, 'ACROSS THE ATLANTIC', t, 37.42, 300, 110);
    if 39.1 < t < 42.3: pin(im, t, 39.14, 'SLENDER MAN', 'FOGGY WOODS', 300)
    if 42.3 < t < 45.8: slam(im, 'TALL. FACELESS.', t, 42.88, 300, 170, col=(240, 240, 240))
    if t > 45.8: slam(im, 'LURES CHILDREN', t, 45.84, 300, 150, col=(255, 60, 50)); label(im, 'INTO THE MIST', 450, t, 46.98, size=60)
    tag(im, t, 'WOODS · PHOTOGRAPH, 1866 · THE MET', 37.3)
    scan(im, t); flash(im, max(pulse(t, 37.2, 37.35), .6 * pulse(t, 44.0, 44.08)))
    return im

def sc_sewer(A, t):  # 48.2 – 56.8
    if t < 52.4:
        im = sewer(t); torch(im, t, W / 2 + 160 * math.sin(t * 1.2), 950, 520, .7); eyes(im, t, 50.5)
        slam(im, 'NEW YORK', t, 49.82, 300, 220, col=(150, 210, 150)); label(im, 'UNDERGROUND TUNNELS', 470, t, 49.0, size=56)
    else:
        im = shot(A, ['albino2', 'albino'], t, 52.4, 56.8, 1.05, 1.35, .45, .55); darken(im, .25); topshade(im)
        slam(im, 'BLIND, MUTATED', t, 51.92 if t > 52.4 else 99, 300, 150, col=(240, 240, 230))
        slam(im, 'ALLIGATORS', t, 53.14, 450, 210, col=(255, 60, 50))
        tag(im, t, 'ALBINO ALLIGATOR · C. M. HIGHSMITH · LOC', 52.5)
    scan(im, t); flash(im, max(pulse(t, 48.2, 48.35), pulse(t, 52.4, 52.5)))
    return im

def sc_question(A, t):  # 56.8 – 66.6
    keys = ['taira', 'woods', 'albino', 'grandst', 'catdemon']
    if t < 61.5:
        i = int((t - 56.8) / .6) % len(keys)
        im = shot(A, [keys[i]], t, 56.8 + i * .6, 57.4 + i * .6, 1.3, 1.1, .5, .5); darken(im, .5)
        slam(im, 'CAMPFIRE STORIES?', t, 58.22, 330, 140, out=60.0)
        if t > 60.0: slam(im, 'COLLECTIVE', t, 60.02, 330, 170); slam(im, 'PARANOIA?', t, 60.44, 500, 190, col=(255, 200, 80))
    else:
        im = alley(t, .5); slender(im, t, .5, x=880, y=1500, h=900); put(im, masked_woman(t, .6), 260, 1450, .9)
        slam(im, 'OR REAL', t, 62.22, 330, 190); slam(im, 'HORRORS?', t, 62.94, 500, 220, col=(255, 60, 50))
    flicker(im, t, .12); scan(im, t)
    return im

def sc_end(A, t):  # 66.6 – end
    im = alley(t, .7); put(im, masked_woman(t, .8), W / 2, 1600, 1.3); darken(im, .45)
    slam(im, 'WHAT DO', t, 66.65, 330, 150)
    slam(im, 'YOU THINK?', t, 66.9, 480, 200, col=(255, 60, 50))
    a = back((t - 67.1) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 68.4) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 68.4) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    flash(im, pulse(t, 66.6, 66.8))
    return im

SCENES = [(0, 10.2, sc_hook), (10.2, 37.2, sc_kuchi), (37.2, 48.2, sc_slender), (48.2, 56.8, sc_sewer), (56.8, 66.6, sc_question), (66.6, 99, sc_end)]

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
