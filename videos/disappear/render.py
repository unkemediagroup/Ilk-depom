# Disappearances — YT Shorts renderer (1080x1920, 30 fps).
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
            A[k] = eerie(im)
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

# ---------------------------------------------------------------- DISAPPEARANCES
DUR = 75.3
KEY = {'VANISHED', 'CHILLING', 'ZERO', 'HAUNTING', 'ROANOKE', '1587', 'DISAPPEARED', 'CROATOAN', 'GHOSTLY', 'MARY', 'CELESTE',
       'ABANDONED', 'SOUL', 'MISSING', 'STORM', 'FLIGHT', '19', 'BERMUDA', 'TRIANGLE', '1945', 'TRACE', 'DARK', 'FORCES', 'ANOMALIES', 'UNKNOWN', 'SHIPS'}

def post_card(t, t0):
    """Wooden post with CROATOAN carved letter by letter."""
    im = Image.new('RGBA', (W, H), (12, 14, 10, 255)); d = ImageDraw.Draw(im)
    r = rng(3)
    for k in range(60):  # forest bg
        x = r.random() * W; w = 20 + r.random() * 60
        d.rectangle((x, 0, x + w, H), fill=(18 + r.randint(0, 14), 22 + r.randint(0, 14), 16, 255))
    px0, px1 = 300, 780
    wood = Image.new('RGBA', (px1 - px0, H), (0, 0, 0, 0)); wd = ImageDraw.Draw(wood)
    for x in range(0, px1 - px0, 3):
        g = 96 + int(16 * math.sin(x / 19) + 9 * math.sin(x / 5.3))
        wd.line([(x + 6 * math.sin(y / 140 + x / 50), y) for y in range(0, H + 40, 40)], fill=(g, int(g * .72), int(g * .48), 255), width=3)
    for _ in range(6):
        kx, ky = r.uniform(60, px1 - px0 - 60), r.uniform(100, H - 100)
        wd.ellipse((kx - 18, ky - 40, kx + 18, ky + 40), outline=(58, 40, 24, 255), width=5)
    im.alpha_composite(wood, (px0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((px0, 0, px0 + 30, H), fill=(40, 30, 20, 180)); d.rectangle((px1 - 40, 0, px1, H), fill=(30, 22, 14, 200))
    word = 'CROATOAN'
    n = int(len(word) * cl((t - t0) / 1.6)) if t >= t0 else 0
    f = F('type', 175)
    for i, ch in enumerate(word[:n]):
        y = 150 + i * 150; bb = f.getbbox(ch); x = W / 2 - (bb[2] - bb[0]) / 2 - bb[0]
        d.text((x + 5, y + 5), ch, font=f, fill=(170, 130, 84, 255))
        d.text((x, y), ch, font=f, fill=(30, 18, 10, 255))
    return im

def table_card(t):
    im = Image.new('RGBA', (W, H), (20, 16, 12, 255)); d = ImageDraw.Draw(im)
    d.rectangle((0, 1100, W, H), fill=(70, 46, 28, 255))
    for k in range(14): d.line((0, 1100 + k * 60, W, 1100 + k * 60 + 10), fill=(56, 36, 22, 255), width=4)
    d.ellipse((240, 1150, 840, 1450), fill=(220, 214, 196, 255)); d.ellipse((330, 1200, 750, 1400), fill=(150, 92, 52, 255))
    d.rectangle((880, 1060, 960, 1300), fill=(200, 200, 190, 160))
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for i in range(12):  # steam
        ph = ((t * .35 + i / 12) % 1); x = 540 + 60 * math.sin(ph * 7 + i); y = 1250 - ph * 700
        gd.ellipse((x - 50 - ph * 60, y - 50, x + 50 + ph * 60, y + 50), fill=(230, 230, 225, int(110 * (1 - ph))))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(26)))
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((150, 500, 950, 1300), fill=(255, 180, 90, 60))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(120)))
    return im

def radar(t, t0):
    """Bermuda Triangle map + radar blips that vanish."""
    im = Image.new('RGBA', (W, H), (4, 16, 18, 255)); d = ImageDraw.Draw(im)
    cx, cy, R = W / 2, 1000, 470
    for k in range(1, 6): d.ellipse((cx - R * k / 5, cy - R * k / 5, cx + R * k / 5, cy + R * k / 5), outline=(40, 140, 110, 160), width=2)
    d.line((cx - R, cy, cx + R, cy), fill=(40, 140, 110, 120), width=2); d.line((cx, cy - R, cx, cy + R), fill=(40, 140, 110, 120), width=2)
    P = {'MIAMI': (cx - 300, cy + 60), 'BERMUDA': (cx + 260, cy - 340), 'SAN JUAN': (cx + 220, cy + 330)}
    k = eo((t - t0) / .8)
    pts = list(P.values()); pts.append(pts[0])
    for i in range(3):
        a, b = pts[i], pts[i + 1]
        d.line((a[0], a[1], lerp(a[0], b[0], k), lerp(a[1], b[1], k)), fill=(255, 60, 50, 255), width=6)
    for nm, (x, y) in P.items():
        d.ellipse((x - 10, y - 10, x + 10, y + 10), fill=(255, 255, 255, 255))
        put(im, text_img(nm, 'oswald', 34, (200, 240, 220, 255), 0, track=4), x, y + 40, 1, k)
    ang = (t * 2.2) % (2 * math.pi)
    sw = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sw).pieslice((cx - R, cy - R, cx + R, cy + R), math.degrees(ang) - 40, math.degrees(ang), fill=(60, 255, 170, 70))
    im.alpha_composite(sw.filter(ImageFilter.GaussianBlur(6)))
    # 5 bombers + rescue plane blips
    blips = [(cx - 120 + i * 30, cy - 40 - i * 18) for i in range(5)]
    gone = 59.42
    for i, (x, y) in enumerate(blips):
        a = 1 - seg(t, 53.8 + i * .25, 54.1 + i * .25)
        if a > 0: d.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(255, 220, 80, int(255 * a)))
    if t > 56.9:
        a = (1 - seg(t, gone, gone + .3)) * eo((t - 56.9) / .3)
        x, y = cx - 260 + (t - 56.9) * 60, cy + 160
        d.ellipse((x - 12, y - 12, x + 12, y + 12), fill=(120, 200, 255, int(255 * a)))
        put(im, text_img('RESCUE PLANE', 'oswald', 30, (120, 200, 255, 255), 0, track=3), x, y + 36, 1, a)
    return im

def sc_hook(A, t):  # 0 – 5.9
    im = shot(A, ['dutchman'], t, 0, 5.9, 1.55, 1.15, .5, .35); topshade(im); flicker(im, t)
    put(im, text_img("HISTORY'S MOST MYSTERIOUS", 'oswald', 48, (220, 230, 235, 255), 0, track=6, shadow=4), W / 2, 260, 1, eo((t - .1) / .3))
    slam(im, 'DISAPPEARANCES', t, .15, 400, 170, col=(255, 60, 50))
    slam(im, 'GONE.', t, 1.0, 590, 240)
    slam(im, 'NO TRACE.', t, 1.6, 780, 150, col=(150, 210, 240))
    scan(im, t); flash(im, pulse(t, 0, .2))
    return im

def sc_vanish(A, t):  # 5.9 – 13.0
    if t < 8.9:
        im = shot(A, ['storm'], t, 5.9, 8.9, 1.1, 1.35, .5, .5); topshade(im)
        slam(im, 'SHIPS. EXPLORERS.', t, 5.95, 330, 120); slam(im, 'VANISHED', t, 6.74, 480, 220, col=(255, 60, 50))
    else:
        im = shot(A, ['ghostship'], t, 8.9, 13.0, 1.05, 1.3, .5, .4); topshade(im)
        slam(im, 'CHILLING CLUES', t, 9.72, 330, 140, out=11.2)
        if t > 11.2: slam(im, 'ZERO', t, 11.3, 330, 240, col=(255, 60, 50)); slam(im, 'ANSWERS', t, 11.74, 520, 170)
    flicker(im, t); scan(im, t)
    flash(im, max(pulse(t, 5.9, 6.05), pulse(t, 8.9, 9.0)))
    return im

def sc_roanoke(A, t):  # 13.0 – 29.2
    if t < 17.8:
        im = shot(A, ['vdare_baptism'], t, 13.0, 17.8, 1.2, 1.45, .5, .45); darken(im, .3)
        slam(im, 'MOST HAUNTING', t, 13.74, 330, 130, out=15.1)
        if t > 15.1: pin(im, t, 15.22, 'ROANOKE', 'NORTH CAROLINA · 1587', 360)
        tag(im, t, '"BAPTISM OF VIRGINIA DARE" · 1883 · LOC', 13.1)
    elif t < 23.5:
        im = shot(A, ['vdare'], t, 17.8, 23.5, 1.1, 1.4, .5, .4); darken(im, .25); topshade(im)
        n = int(lerp(0, 115, eo((t - 18.2) / 1.2)))
        put(im, text_img(f'{n}', 'bebas', 260, (255, 255, 255, 255), 0, shadow=8), W / 2, 380, 1, eo((t - 18.2) / .2))
        put(im, text_img('ENGLISH SETTLERS', 'oswald', 50, (255, 220, 190, 255), 0, track=8, shadow=4), W / 2, 540, 1, eo((t - 19.0) / .3))
        if t > 20.5:
            fade = seg(t, 20.56, 22.0); darken(im, .6 * fade)
            stamp(im, t, 20.6, 'DISAPPEARED', W / 2, 800, -8)
        tag(im, t, 'VIRGINIA DARE · FIRST ENGLISH CHILD BORN IN AMERICA', 17.9)
    else:
        im = post_card(t, 26.4)
        slam(im, 'ONE CLUE.', t, 23.6, 200, 120, out=26.3)
        if t > 27.6: flash(im, .25 * pulse(t, 27.68, 27.9), (255, 60, 50))
    flicker(im, t, .06); scan(im, t)
    flash(im, max(pulse(t, 13.0, 13.15), pulse(t, 17.8, 17.9), pulse(t, 23.5, 23.6)))
    return im

def sc_celeste(A, t):  # 29.2 – 47.7
    if t < 35.2:
        im = shot(A, ['brig'], t, 29.2, 35.2, 1.05, 1.4, .5, .5); darken(im, .2)
        slam(im, 'DECADES LATER…', t, 29.3, 330, 120, out=31.4)
        if t > 31.4: pin(im, t, 31.56, 'MARY CELESTE', 'ATLANTIC OCEAN · 1872', 360)
        tag(im, t, 'G. LE GRAY · BRIG ON THE WATER, 1856 · THE MET', 29.3)
    elif t < 38.2:
        im = shot(A, ['moonship'], t, 35.2, 38.2, 1.2, 1.45, .45, .5); topshade(im)
        slam(im, 'ABANDONED', t, 35.5, 330, 200, col=(255, 60, 50)); label(im, 'SAILS STILL SET', 500, t, 36.6, size=56)
    elif t < 42.6:
        im = table_card(t); topshade(im)
        slam(im, 'FOOD STILL', t, 38.32, 300, 140, out=40.1); slam(im, 'ON THE TABLE', t, 38.8, 440, 140, col=(255, 200, 130), out=40.1)
        if t > 40.1: slam(im, 'NOT A SOUL', t, 40.28, 440, 160, col=(255, 60, 50)); label(im, 'ON BOARD', 570, t, 41.4, size=56)
    else:
        im = shot(A, ['brig'], t, 42.6, 47.7, 1.5, 1.2, .5, .55); darken(im, .35)
        stamp(im, t, 43.4, 'LIFEBOAT: MISSING', W / 2, 420, -7)
        if t > 44.4: label(im, 'NO STORM DAMAGE', 700, t, 45.16, size=64, col=(255, 255, 255))
    flicker(im, t, .06); scan(im, t)
    flash(im, max(pulse(t, 29.2, 29.35), pulse(t, 35.2, 35.3), pulse(t, 38.2, 38.3), pulse(t, 42.6, 42.7)))
    return im

def sc_flight(A, t):  # 47.7 – 62.9
    if t < 50.1:
        im = shot(A, ['avenger1'], t, 47.7, 50.1, 1.05, 1.3, .5, .5); darken(im, .3)
        pin(im, t, 48.56, 'FLIGHT 19', 'U.S. NAVY · 1945', 360)
    elif t < 53.4:
        im = shot(A, ['avengers5'], t, 50.1, 53.4, 1.0, 1.25, .5, .45); topshade(im)
        slam(im, '5 NAVY BOMBERS', t, 50.6, 330, 140)
        tag(im, t, 'GRUMMAN TBF AVENGERS IN FORMATION · LOC', 50.2)
    else:
        im = radar(t, 53.5)
        if t < 56.0: slam(im, 'BERMUDA TRIANGLE', t, 53.5, 330, 130, col=(255, 60, 50))
        elif t < 59.3: slam(im, 'THE RESCUE PLANE…', t, 56.2, 330, 120)
        else: slam(im, 'ALSO VANISHED', t, 59.42, 330, 150, col=(255, 60, 50)); label(im, 'NOT A SINGLE TRACE', 470, t, 60.74, size=56)
    scan(im, t)
    flash(im, max(pulse(t, 47.7, 47.85), pulse(t, 50.1, 50.2), pulse(t, 53.4, 53.5)))
    return im

def sc_question(A, t):  # 62.9 – 69.1
    keys = ['dutchman', 'avengers5', 'brig', 'vdare_baptism', 'ghostship', 'storm', 'moonship']
    i = int((t - 62.9) / .5) % len(keys)
    im = shot(A, [keys[i]], t, 62.9 + i * .5, 63.4 + i * .5, 1.25, 1.1, .5, .5); darken(im, .45)
    slam(im, 'DARK FORCES?', t, 63.36, 330, 170, col=(255, 60, 50), out=64.55)
    if t > 64.55: slam(im, 'ANOMALIES?', t, 64.62, 330, 200)
    if t > 67.3: slam(im, 'INTO THE UNKNOWN', t, 67.52, 520, 130, col=(150, 210, 240))
    flicker(im, t, .15); scan(im, t)
    return im

def sc_end(A, t):  # 69.1 – end
    im = shot(A, ['dutchman'], t, 69.1, DUR, 1.35, 1.1, .5, .4); darken(im, .45)
    slam(im, 'WHAT DO', t, 69.15, 330, 150)
    slam(im, 'YOU THINK?', t, 69.4, 480, 200, col=(255, 60, 50))
    a = back((t - 69.6) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 70.9) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 70.9) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    flash(im, pulse(t, 69.1, 69.3))
    return im

SCENES = [(0, 5.9, sc_hook), (5.9, 13.0, sc_vanish), (13.0, 29.2, sc_roanoke), (29.2, 47.7, sc_celeste), (47.7, 62.9, sc_flight),
          (62.9, 69.1, sc_question), (69.1, 99, sc_end)]

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
