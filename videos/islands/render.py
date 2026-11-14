# Abandoned islands — YT Shorts renderer (1080x1920, 30 fps).
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

# ---------------------------------------------------------------- scenes
def sc_hook(A, t):  # 0 – 5.3
    im = shot(A, ['hashima0', 'hashima1', 'hashima2'], t, 0, 5.3, 1.5, 1.1, .5, .5)
    topshade(im); flicker(im, t)
    put(im, text_img("THE WORLD'S MOST MYSTERIOUS", 'oswald', 48, (220, 230, 235, 255), 0, track=6, shadow=4), W / 2, 260, 1, eo((t - .1) / .3))
    slam(im, 'ABANDONED', t, .15, 400, 210, col=(255, 60, 50))
    slam(im, 'ISLANDS', t, .5, 570, 200)
    if t > 2.6: slam(im, 'WHY DID EVERYONE LEAVE?', t, 2.66, 720, 76, col=(255, 230, 200))
    msnow(im, t, 40, speed=-30, alpha=.4, col=(220, 220, 220))
    scan(im, t)
    flash(im, pulse(t, 0, .2))
    return im

def sc_reclaim(A, t):  # 5.3 – 11.8
    if t < 8.5:
        im = shot(A, ['ross0', 'ross1', 'loc_kalaupapa'], t, 5.3, 8.5, 1.05, 1.3, .5, .5); topshade(im)
        slam(im, 'NATURE', t, 5.6, 330, 170); slam(im, 'TOOK IT BACK', t, 6.25, 490, 150, col=(150, 220, 160))
        if t > 7.1: label(im, 'GHOST TOWNS', 640, t, 7.2, size=56, col=(255, 255, 255))
    elif t < 10.0:
        im = shot(A, ['loc_hall', 'loc_hosp1'], t, 8.5, 10.0, 1.05, 1.35, .5, .5); topshade(im)
        slam(im, 'DESOLATE', t, 8.54, 330, 170); slam(im, 'HOSPITALS', t, 8.8, 490, 170, col=(150, 220, 200))
        tag(im, t, 'ABANDONED HOSPITAL · ELLIS ISLAND · LOC', 8.5)
    else:
        im = shot(A, ['ross2', 'ross1', 'ross0'], t, 10.0, 11.8, 1.2, 1.0, .5, .5); topshade(im)
        slam(im, 'FORBIDDEN', t, 10.04, 330, 180, col=(255, 60, 50)); slam(im, 'RUINS', t, 10.5, 500, 200)
    flicker(im, t); scan(im, t)
    flash(im, max(pulse(t, 5.3, 5.45), pulse(t, 8.5, 8.6), pulse(t, 10.0, 10.1)))
    return im

def sc_hashima(A, t):  # 11.8 – 31.6
    if t < 16.3:
        im = shot(A, ['hashima1', 'hashima0', 'hashima2'], t, 11.8, 16.3, 1.0, 1.35, .5, .5); darken(im, .25)
        slam(im, 'ONE OF THE', t, 11.85, 330, 110, out=13.6); slam(im, 'MOST HAUNTING', t, 12.36, 450, 140, col=(255, 60, 50), out=13.6)
        if t > 13.7: pin(im, t, 13.74, 'HASHIMA', 'NAGASAKI · JAPAN', 360)
    elif t < 23.3:
        im = shot(A, ['hashima0', 'hashima2', 'hashima1'], t, 16.3, 23.3, 1.6, 1.15, .5, .5); topshade(im)
        slam(im, 'CONCRETE FORTRESS', t, 17.36, 320, 120, out=19.1)
        if t > 19.1:
            n = int(lerp(0, 5259, eo((t - 19.16) / 1.2)))
            put(im, text_img(f'{n:,}', 'bebas', 220, (255, 255, 255, 255), 0, shadow=8), W / 2, 380, 1, eo((t - 19.16) / .2))
            put(im, text_img('PEOPLE ON 6 HECTARES', 'oswald', 46, (255, 200, 180, 255), 0, track=6, shadow=4), W / 2, 520, 1, eo((t - 19.6) / .3))
        if t > 21.0: stamp(im, t, 21.04, 'DESERTED · 1974', W / 2, 760, -8)
    elif t < 28.7:
        keys = ['gunkan0', 'gunkan1', 'gunkan20', 'gunkan2', 'gunkan21', 'loc_hall']
        if t < 25.4: im = shot(A, keys, t, 23.3, 25.4, 1.1, 1.35, .5, .5)
        elif t < 27.2: im = shot(A, ['loc_hall', 'gunkan1', 'gunkan21', 'gunkan0'], t, 25.4, 27.2, 1.0, 1.3, .5, .5)
        else: im = shot(A, ['gunkan20', 'gunkan2', 'hashima2', 'hashima0'], t, 27.2, 28.7, 1.15, 1.35, .5, .5)
        topshade(im); flicker(im, t, .12)
        if t < 25.4: slam(im, 'LEFT BEHIND', t, 23.4, 330, 160, col=(255, 230, 200))
        elif t < 27.2: slam(im, 'EMPTY HALLWAYS', t, 25.44, 330, 140)
        else: slam(im, 'CRUMBLING', t, 27.32, 330, 180, col=(255, 60, 50))
    else:
        im = shot(A, ['hashima2', 'hashima0', 'hashima1'], t, 28.7, 31.6, 1.1, 1.3, .5, .6); topshade(im)
        waves(im, t)
        slam(im, 'BATTERED BY', t, 29.1, 330, 140); slam(im, 'THE WAVES', t, 29.86, 480, 180, col=(150, 210, 240))
        dx, dy = shake(t, 29.9, 14, .6)
        if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    scan(im, t)
    flash(im, max(pulse(t, 11.8, 11.95), pulse(t, 16.3, 16.4), pulse(t, 23.3, 23.4), pulse(t, 25.4, 25.5), pulse(t, 27.2, 27.3), pulse(t, 28.7, 28.8)))
    return im

def sc_poveglia(A, t):  # 31.6 – 45.9
    if t < 34.3:
        im = shot(A, ['poveglia2', 'poveglia1', 'poveglia0'], t, 31.6, 34.3, 1.3, 1.05, .5, .5); darken(im, .25)
        pin(im, t, 32.38, 'POVEGLIA', 'VENICE LAGOON · ITALY', 360)
    elif t < 40.2:
        k1 = ['poveglia3', 'poveglia0'] if t < 36.2 else ['poveglia0', 'loc_hosp1', 'poveglia1']
        im = shot(A, k1, t, 34.3 if t < 36.2 else 36.2, 36.2 if t < 36.2 else 40.2, 1.05, 1.3, .5, .5); topshade(im); flicker(im, t, .1)
        if t < 36.2:
            slam(im, 'PLAGUE', t, 35.08, 330, 220, col=(255, 60, 50)); label(im, 'QUARANTINE STATION', 480, t, 34.42, size=52)
            tag(im, t, 'PLAGUE INSCRIPTION · POVEGLIA', 34.3)
        else:
            slam(im, 'MENTAL ASYLUM', t, 36.6, 330, 150, out=37.9)
            if t > 37.9: slam(im, 'THOUSANDS', t, 37.92, 330, 190, col=(255, 60, 50)); slam(im, 'SUFFERED', t, 38.48, 490, 170)
            tag(im, t, 'ABANDONED HOSPITAL · POVEGLIA', 36.2)
    else:
        im = shot(A, ['poveglia4', 'poveglia1', 'poveglia2'], t, 40.2, 45.9, 1.05, 1.35, .5, .5); topshade(im); flicker(im, t, .12)
        if t < 43.6:
            slam(im, 'HAUNTED', t, 42.74, 330, 220, col=(255, 60, 50)); label(im, 'THE SOIL ITSELF', 500, t, 41.6, size=56)
        else:
            stamp(im, t, 43.72, 'NO VISITORS', W / 2, 520, -9)
    scan(im, t)
    flash(im, max(pulse(t, 31.6, 31.75), pulse(t, 34.3, 34.4), pulse(t, 36.2, 36.3), pulse(t, 40.2, 40.3)))
    return im

def sc_spirito(A, t):  # 45.9 – 49.95
    im = shot(A, ['sanspirito0', 'sanspirito1', 'sanspirito2', 'poveglia2'], t, 45.9, 49.95, 1.3, 1.05, .5, .5); darken(im, .25)
    if t > 48.9: pin(im, t, 48.98, 'SAN SPIRITO', 'VENICE · ITALY', 360)
    else: slam(im, 'FURTHER SOUTH…', t, 45.95, 330, 130)
    scan(im, t); flash(im, pulse(t, 45.9, 46.05))
    return im

def sc_ross(A, t):  # 49.95 – 57.7
    if t < 53.9:
        im = shot(A, ['ross0', 'ross1'], t, 49.95, 53.9, 1.35, 1.05, .5, .5); darken(im, .2)
        if t > 53.2: pin(im, t, 53.24, 'ROSS ISLAND', 'ANDAMAN · INDIA', 360)
        else: slam(im, 'DEEP IN THE OCEAN…', t, 50.6, 330, 120)
    else:
        im = shot(A, ['ross1', 'ross2', 'ross0'], t, 53.9, 57.7, 1.05, 1.35, .5, .5); topshade(im); flicker(im, t, .1)
        slam(im, 'ROTTING REMAINS', t, 54.5, 330, 140, out=55.6)
        if t > 55.6: slam(im, 'PENAL', t, 56.06, 330, 220, col=(255, 60, 50)); slam(im, 'COLONY', t, 56.44, 520, 200)
        tag(im, t, 'COLONIAL RUINS · ROSS ISLAND', 53.9)
    scan(im, t); flash(im, max(pulse(t, 49.95, 50.1), pulse(t, 53.9, 54.0)))
    return im

def sc_question(A, t):  # 57.7 – 63.9 : rapid montage
    keys = [k for k in ['hashima0', 'poveglia0', 'ross0', 'gunkan0', 'poveglia3', 'hashima1', 'ross2', 'loc_hall'] if k in A] or ['_none']
    i = int((t - 57.7) / .45) % len(keys)
    im = shot(A, [keys[i]], t, 57.7 + i * .45, 57.7 + i * .45 + .45, 1.25, 1.1, .5, .5); darken(im, .45)
    slam(im, 'WHAT ARE THEY', t, 57.8, 330, 150, out=60.9); slam(im, 'HIDING?', t, 59.62, 500, 220, col=(255, 60, 50), out=60.9)
    if t > 60.9: slam(im, 'WHY DID THEY', t, 61.0, 330, 150); slam(im, 'FLEE?', t, 61.96, 500, 240, col=(255, 60, 50))
    flicker(im, t, .15); scan(im, t)
    flash(im, .5 * pulse(t, 57.7 + i * .45, 57.7 + i * .45 + .08))
    return im

def sc_end(A, t):  # 63.9 – end
    im = shot(A, ['hashima0', 'hashima1', 'poveglia2'], t, 63.9, DUR, 1.35, 1.1, .5, .5); darken(im, .45)
    slam(im, 'WHAT DO', t, 63.95, 330, 150)
    slam(im, 'YOU THINK?', t, 64.2, 480, 200, col=(255, 60, 50))
    a = back((t - 64.4) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 65.7) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 65.7) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    flash(im, pulse(t, 63.9, 64.1))
    return im

SCENES = [(0, 5.3, sc_hook), (5.3, 11.8, sc_reclaim), (11.8, 31.6, sc_hashima), (31.6, 45.9, sc_poveglia), (45.9, 49.95, sc_spirito),
          (49.95, 57.7, sc_ross), (57.7, 63.9, sc_question), (63.9, 99, sc_end)]

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
