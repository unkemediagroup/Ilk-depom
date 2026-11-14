# Viking war traditions — YT Shorts renderer (1080x1920, 30 fps).
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
            A[k] = eerie(im, sat=.85, tint=(.02, 0, -.02))
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

# ---------------------------------------------------------------- VIKINGS
DUR = 71.6
KEY = {'VIKING', 'LONGSHIPS', 'MIST', 'STEEL', 'FIRE', 'TERROR', 'BREAK', 'BLADE', 'BERSERKERS', 'FEROCIOUS', 'BEAR', 'WOLF',
       'FURY', 'TRANCE-LIKE', 'BITING', 'HOWLING', 'PAIN', 'CHILLING', 'BRUTAL', 'HUMAN', 'SACRIFICE', 'BLÓT', 'SLAUGHTERED', 'ODIN',
       'HORRIFYING', 'BLOOD', 'EAGLE', 'GRUESOME', 'RIBS', 'SEVERED', 'SPINE', 'WINGS', 'ALIVE', 'SAVAGE', 'FANATICISM', 'HERBS',
       'SURVIVAL', 'UNKNOWN', 'DARK', 'LEGENDS', 'BLOOD-SOAKED'}

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

def sea_scene(t, t0, emerge=True):
    lt = t - t0
    im = grad_img((40, 30, 34), (190, 120, 90), 1.3)
    sun = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sun).ellipse((340, 760, 740, 1160), fill=(255, 180, 120, 160))
    im.alpha_composite(sun.filter(ImageFilter.GaussianBlur(60)))
    d = ImageDraw.Draw(im); d.rectangle((0, 1150, W, H), fill=(30, 30, 36, 255))
    for k in range(40):
        y = 1160 + k * 20; d.line([(x, y + 4 * math.sin(x / 50 + t * 2 + k)) for x in range(0, W + 30, 30)], fill=(120, 90, 80, 90), width=2)
    if not hasattr(sea_scene, 'ships'): sea_scene.ships = [longship(.55), longship(.8), longship(1.15)]
    for i, (x0, y, sh, dl) in enumerate([(-300, 1060, 0, 0.0), (520, 1120, 1, .25), (60, 1260, 2, .5)]):
        sp = sea_scene.ships[sh]; x = x0 + lt * 40 * (i + 1) * .5
        a = eo((lt - dl) / 1.6) if emerge else 1
        put(im, sp, x + sp.width / 2, y - sp.height / 2 + 60 + 8 * math.sin(t * 1.5 + i), 1, a)
    mist(im, 1000, int(170 * (1 - .5 * eo(lt / 3))), 260)
    mist(im, 1250, 120, 240)
    return im

def shieldwall(t):
    im = grad_img((20, 14, 12), (70, 34, 22))
    fire = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(fire).ellipse((-200, 300, 1300, 1100), fill=(255, 110, 30, 120))
    im.alpha_composite(fire.filter(ImageFilter.GaussianBlur(160)))
    d = ImageDraw.Draw(im); r = rng(5)
    for row, (y, rad) in enumerate([(980, 120), (1180, 150), (1430, 190)]):
        n = int(W / (rad * 1.6)) + 2
        for k in range(n):
            x = -rad * .3 + k * rad * 1.6 + (rad * .8 if row % 2 else 0)
            c = [(150, 30, 26), (200, 170, 60), (30, 50, 90), (120, 100, 70)][r.randint(0, 3)]
            d.ellipse((x - rad, y - rad, x + rad, y + rad), fill=c + (255,), outline=(30, 20, 14, 255), width=10)
            d.line((x - rad * .9, y, x + rad * .9, y), fill=(30, 20, 14, 140), width=8); d.line((x, y - rad * .9, x, y + rad * .9), fill=(30, 20, 14, 140), width=8)
            d.ellipse((x - rad * .25, y - rad * .25, x + rad * .25, y + rad * .25), fill=(150, 150, 140, 255), outline=(40, 40, 36, 255), width=5)
        for k in range(n):  # spear tips above the wall
            x = k * rad * 1.6 + 40
            d.line((x, y - rad - 40, x + 30, y - rad - 380), fill=(30, 22, 16, 255), width=10)
            d.polygon([(x + 22, y - rad - 380), (x + 50, y - rad - 450), (x + 40, y - rad - 370)], fill=(170, 170, 160, 255))
    return im

def wolf(t, moon=True):
    im = grad_img((10, 6, 8), (60, 14, 14))
    if moon:
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((240, 380, 840, 980), fill=(220, 40, 30, 200))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(70)))
        ImageDraw.Draw(im).ellipse((330, 470, 750, 890), fill=(210, 60, 40, 255))
    d = ImageDraw.Draw(im)
    pts = [(80, H), (180, 1500), (300, 1330), (420, 1220), (470, 1050), (520, 900), (560, 760), (610, 720), (640, 640), (690, 700),
           (720, 640), (735, 760), (720, 820), (760, 880), (720, 960), (680, 1010), (720, 1180), (800, 1400), (900, H)]
    d.polygon(pts, fill=(8, 6, 6, 255))
    d.rectangle((0, 1750, W, H), fill=(8, 6, 6, 255))
    return im

def grove(t):
    im = grad_img((6, 8, 8), (24, 20, 16))
    d = ImageDraw.Draw(im); r = rng(9)
    for k in range(26):
        x = r.random() * W; w = 30 + r.random() * 70; c = 10 + r.randint(0, 16)
        d.rectangle((x, 0, x + w, H), fill=(c, c + 2, c, 255))
        for j in range(5):
            yy = r.random() * H * .6; d.line((x + w / 2, yy, x + w / 2 + r.uniform(-200, 200), yy - r.uniform(50, 200)), fill=(c, c + 2, c, 255), width=10)
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for x, y in [(220, 1300), (860, 1250), (540, 1450)]:
        fl = .8 + .2 * math.sin(t * 13 + x)
        gd.ellipse((x - 140, y - 220, x + 140, y + 60), fill=(255, 120, 30, int(200 * fl)))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(50)))
    d = ImageDraw.Draw(im)
    for x, y in [(220, 1300), (860, 1250), (540, 1450)]:
        d.rectangle((x - 8, y, x + 8, y + 400), fill=(30, 20, 12, 255))
        fl = 12 * math.sin(t * 11 + x)
        d.polygon([(x - 30, y), (x + 30, y), (x + fl * .5, y - 110 - fl)], fill=(255, 200, 80, 255))
    return im

def runestone(t, wings=0.):
    im = grad_img((8, 6, 6), (30, 10, 10))
    if wings > 0:
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
        for s in (-1, 1):
            for k in range(7):
                ang = math.radians(-60 + k * 18) ; L = (420 - k * 30) * wings
                x0, y0 = W / 2 + s * 40, 900
                pts = [(x0, y0), (x0 + s * math.cos(ang) * L, y0 + math.sin(ang) * L - 80), (x0 + s * math.cos(ang + .2) * L * .9, y0 + math.sin(ang + .2) * L * .9)]
                gd.polygon(pts, fill=(170 - k * 10, 10, 10, 230))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(3)))
        gl = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(gl).ellipse((100, 500, 980, 1300), fill=(200, 0, 0, int(90 * wings)))
        im.alpha_composite(gl.filter(ImageFilter.GaussianBlur(120)))
    d = ImageDraw.Draw(im)
    if wings > 0:  # kneeling silhouette, back to camera
        d.ellipse((W / 2 - 60, 680, W / 2 + 60, 800), fill=(6, 4, 4, 255))
        d.polygon([(W / 2 - 110, 1200), (W / 2 - 90, 820), (W / 2 + 90, 820), (W / 2 + 110, 1200)], fill=(6, 4, 4, 255))
    else:
        d.rounded_rectangle((300, 520, 780, 1700), 200, fill=(70, 66, 60, 255))
        r = rng(2)
        f = F('type', 70)
        runes = 'ᚠᚢᚦᚨᚱᚲ'
        for k in range(12):
            x = 360 + (k % 2) * 210; y = 640 + (k // 2) * 160
            d.line((x + 40, y, x + 40, y + 110), fill=(150, 20, 20, 255), width=10)
            d.line((x + 40, y + 20, x + 40 + r.choice([-40, 40]), y + 60), fill=(150, 20, 20, 255), width=10)
            d.line((x + 140, y + 10, x + 140, y + 110), fill=(150, 20, 20, 255), width=10)
            d.line((x + 140, y + 10, x + 180, y + 50), fill=(150, 20, 20, 255), width=10)
    return im

def mushrooms(t):
    im = grad_img((6, 10, 8), (26, 34, 24)); d = ImageDraw.Draw(im)
    for x, y, s in [(330, 1300, 1.3), (720, 1380, 1.0), (520, 1520, .8)]:
        d.rectangle((x - 30 * s, y, x + 30 * s, y + 300 * s), fill=(235, 230, 215, 255))
        d.pieslice((x - 180 * s, y - 150 * s, x + 180 * s, y + 150 * s), 180, 360, fill=(210, 30, 24, 255))
        r = rng(int(x))
        for _ in range(9):
            a = r.uniform(math.pi, 2 * math.pi); rr = r.uniform(40, 150) * s
            d.ellipse((x + math.cos(a) * rr - 14 * s, y + math.sin(a) * rr * .8 - 10 * s, x + math.cos(a) * rr + 14 * s, y + math.sin(a) * rr * .8 + 10 * s), fill=(245, 240, 225, 255))
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((100, 900, 980, 1700), fill=(160, 60, 200, int(70 + 40 * math.sin(t * 4))))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(120)))
    return im

def warp(im, t, amt=8):
    a = np.asarray(im); off = (amt * np.sin(np.arange(H) / 40 + t * 5)).astype(int)
    out = np.empty_like(a)
    for y in range(0, H, 8): out[y:y + 8] = np.roll(a[y:y + 8], off[y], axis=1)
    return Image.fromarray(out)

def embers(im, t, n=90):
    motes(im, t, n, col=(255, 140, 50), rise=-200, drift=20, size=1.2, ember=True)

def sc_hook(A, t):  # 0 – 3.2
    im = sea_scene(t, 0)
    topshade(im)
    put(im, text_img('THE MOST TERRIFYING', 'oswald', 52, (230, 220, 210, 255), 0, track=6, shadow=4), W / 2, 260, 1, eo((t - .1) / .3))
    slam(im, 'VIKING', t, .2, 410, 230, col=(255, 60, 50))
    slam(im, 'WAR TRADITIONS', t, .6, 590, 140)
    flash(im, pulse(t, 0, .2))
    return im

def sc_steel(A, t):  # 3.2 – 5.7
    if t < 4.5:
        im = shot(A, ['sword'], t, 3.2, 4.5, 1.6, 1.3, .5, .25, .5, .5)
        slam(im, 'STEEL', t, 4.0, 360, 260, col=(220, 230, 240))
        tag(im, t, 'VIKING SWORD · 10TH CENTURY · THE MET', 3.3)
    else:
        im = sea_scene(t, 0, False); darken(im, .2); embers(im, t, 140)
        slam(im, 'FIRE', t, 4.7, 360, 280, col=(255, 120, 40))
    flash(im, max(pulse(t, 3.2, 3.3), pulse(t, 4.5, 4.6)))
    return im

def sc_terror(A, t):  # 5.7 – 12.1
    im = shot(A, ['norsemen'], t, 5.7, 12.1, 1.15, 1.6, .4, .5, .6, .5); topshade(im); flicker(im, t, .08)
    slam(im, 'PSYCHOLOGICAL', t, 6.12, 330, 150, out=9.9); slam(im, 'TERROR', t, 6.92, 490, 230, col=(255, 60, 50), out=9.9)
    if t > 9.9: slam(im, 'BEFORE A BLADE', t, 10.0, 330, 140); slam(im, 'WAS DRAWN', t, 10.42, 470, 170, col=(255, 60, 50))
    tag(im, t, '"LANDING OF THE NORSEMEN" · LOC', 5.8)
    flash(im, pulse(t, 5.7, 5.85))
    return im

def sc_berserk(A, t):  # 12.1 – 21.9
    if t < 16.4:
        im = shieldwall(t); embers(im, t, 60)
        if t < 14.9: slam(im, 'THE SHIELD WALL', t, 13.24, 330, 140)
        else: slam(im, 'BERSERKERS', t, 15.04, 380, 230, col=(255, 60, 50))
        dx, dy = shake(t, 15.1, 26)
        if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    else:
        im = wolf(t, moon=False); embers(im, t, 50)
        slam(im, 'BEAR & WOLF', t, 17.96, 330, 170, col=(255, 255, 255), out=20.9); slam(im, 'PELTS', t, 18.9, 490, 200, col=(255, 60, 50), out=20.9)
        if t > 20.9:
            pul = .5 + .5 * math.sin(t * 14); flash(im, .18 * pul, (255, 0, 0))
            slam(im, 'TRANCE-LIKE', t, 21.0, 330, 170); slam(im, 'FURY', t, 21.62, 500, 260, col=(255, 60, 50))
    flash(im, max(pulse(t, 12.1, 12.25), pulse(t, 16.4, 16.5)))
    return im

def sc_beast(A, t):  # 21.9 – 28.9
    if t < 23.8:
        im = shot(A, ['axe'], t, 21.9, 23.8, 1.4, 1.1, .4, .5); darken(im, .35); flash(im, .15, (120, 0, 0))
        slam(im, 'BITING', t, 22.54, 330, 230, col=(255, 60, 50)); slam(im, 'THEIR SHIELDS', t, 22.9, 510, 150)
        tag(im, t, 'VIKING AXE HEAD · 11TH C. · THE MET', 22.0)
    elif t < 25.8:
        im = wolf(t, moon=True)
        slam(im, 'HOWLING', t, 23.9, 330, 240, col=(255, 255, 255)); label(im, 'LIKE WILD BEASTS', 500, t, 24.6, size=60, col=(255, 120, 100))
    else:
        im = shieldwall(t); darken(im, .35); embers(im, t, 200)
        slam(im, 'IMMUNE TO', t, 26.4, 330, 170); slam(im, 'PAIN & FIRE', t, 27.3, 500, 200, col=(255, 140, 40))
    dx, dy = shake(t, 22.6, 22)
    if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    flash(im, max(pulse(t, 21.9, 22.0), pulse(t, 23.8, 23.9), pulse(t, 25.8, 25.9)))
    return im

def sc_blot(A, t):  # 28.9 – 42.3
    if t < 33.5:
        im = grove(t); motes(im, t, 40, col=(255, 160, 80), rise=-60)
        slam(im, 'EVEN MORE', t, 29.0, 330, 130, out=31.5); slam(im, 'CHILLING…', t, 29.56, 460, 170, col=(255, 60, 50), out=31.5)
        if t > 31.5: slam(im, 'HUMAN', t, 31.58, 330, 220, col=(255, 60, 50)); slam(im, 'SACRIFICE', t, 31.94, 510, 200)
    elif t < 38.6:
        k = A['uppsala']; w, h = k.size
        if not hasattr(sc_blot, 'u'): sc_blot.u = A['uppsala'].crop((int(w * .05), int(h * .08), int(w * .49), int(h * .9)))
        im = cover(sc_blot.u, t, lerp(1.05, 1.3, eio((t - 33.5) / 5)), .5, .5); flash(im, .25, (90, 0, 0)); topshade(im)
        slam(im, 'BLÓT', t, 33.8, 360, 280, col=(255, 60, 50))
        if t > 36.4: label(im, 'SLAUGHTERED IN SACRED GROVES', 560, t, 36.68, size=50, col=(255, 230, 200))
        tag(im, t, 'OLD UPPSALA · ROYAL MOUNDS OF THE NORSE GODS · 1902 · LOC', 33.6)
    else:
        im = shot(A, ['bracteate'], t, 38.6, 42.3, 1.1, 1.45, .5, .5); darken(im, .2); topshade(im)
        slam(im, 'TO APPEASE', t, 38.76, 330, 140, out=39.8);
        if t > 39.8: slam(im, 'ODIN', t, 39.88, 380, 300, col=(255, 200, 80))
        if t > 40.8: label(im, 'GOD OF WAR & DEATH', 560, t, 40.84, size=54)
        tag(im, t, 'GOLD BRACTEATE · 400–600 CE · THE MET', 38.7)
    flicker(im, t, .06)
    flash(im, max(pulse(t, 28.9, 29.05), pulse(t, 33.5, 33.6), pulse(t, 38.6, 38.7)))
    return im

def sc_eagle(A, t):  # 42.3 – 56.8
    if t < 46.5:
        im = runestone(t); flicker(im, t, .1)
        slam(im, 'MOST HORRIFYING', t, 42.9, 300, 130, col=(255, 255, 255), out=45.0)
        if t > 45.0: slam(im, 'THE BLOOD', t, 45.08, 300, 190, col=(255, 60, 50)); slam(im, 'EAGLE', t, 45.58, 460, 230)
    elif t < 50.2:
        im = shot(A, ['sigurd'], t, 46.5, 50.2, 1.2, 1.5, .5, .4); darken(im, .25); flash(im, .12, (90, 0, 0)); topshade(im)
        slam(im, 'GRUESOME', t, 46.7, 330, 200, col=(255, 60, 50)); label(im, 'TOLD IN NORSE SAGAS', 490, t, 48.98, size=56)
        tag(im, t, 'BURNE-JONES · "KING SIGURD", 1862 · THE MET', 46.6)
    else:
        k = eo((t - 52.9) / 2.2)
        im = runestone(t, wings=max(.05, k))
        if t < 52.9: slam(im, 'RIBS SEVERED', t, 50.82, 300, 170, col=(255, 255, 255))
        else: slam(im, 'LIKE WINGS', t, 53.9, 300, 190, col=(255, 60, 50))
        if t > 56.0: slam(im, 'STILL ALIVE', t, 56.1, 1650, 150, col=(255, 255, 255))
        dx, dy = shake(t, 55.0, 18, .6)
        if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    flash(im, max(pulse(t, 42.3, 42.45), pulse(t, 46.5, 46.6), pulse(t, 50.2, 50.3)))
    return im

def sc_theories(A, t):  # 56.8 – 65.8
    if t < 61.2:
        im = shot(A, ['bracteate'], t, 56.8, 61.2, 1.5, 1.2, .5, .5); darken(im, .5)
        slam(im, 'SAVAGE TRADITIONS', t, 57.96, 330, 120, out=59.6)
        if t > 59.6: slam(im, 'RELIGIOUS', t, 59.7, 330, 190); slam(im, 'FANATICISM?', t, 60.04, 500, 170, col=(255, 200, 80))
    elif t < 62.7:
        im = warp(mushrooms(t), t)
        slam(im, 'MIND-ALTERING', t, 61.34, 330, 160, col=(210, 140, 255)); slam(im, 'HERBS?', t, 61.94, 500, 230)
    else:
        im = sea_scene(t, 59.0, False); darken(im, .25)
        slam(im, 'OR PURE', t, 62.8, 330, 150); slam(im, 'SURVIVAL?', t, 63.16, 490, 230, col=(255, 60, 50))
    scan(im, t)
    flash(im, max(pulse(t, 56.8, 56.95), pulse(t, 61.2, 61.3), pulse(t, 62.7, 62.8)))
    return im

def sc_end(A, t):  # 65.8 – end
    im = sea_scene(t, 60.0, False); darken(im, .4)
    slam(im, 'WHAT DO', t, 65.85, 330, 150)
    slam(im, 'YOU THINK?', t, 66.1, 480, 200, col=(255, 60, 50))
    a = back((t - 66.3) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 67.6) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 67.6) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    flash(im, pulse(t, 65.8, 66.0))
    return im

SCENES = [(0, 3.2, sc_hook), (3.2, 5.7, sc_steel), (5.7, 12.1, sc_terror), (12.1, 21.9, sc_berserk), (21.9, 28.9, sc_beast),
          (28.9, 42.3, sc_blot), (42.3, 56.8, sc_eagle), (56.8, 65.8, sc_theories), (65.8, 99, sc_end)]

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
