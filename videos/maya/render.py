# Maya collapse — YT Shorts renderer (1080x1920, 30 fps).
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


# ================================================================ MAYA — assets, captions, scenes
DUR = 82.68

def grade_color(im, warm=1.0, sat=1.1, contrast=1.18, dark=0.0):
    a = np.asarray(im.convert('RGB'), dtype=np.float32) / 255.
    lum = a @ np.array([.299, .587, .114], np.float32)
    a = lum[..., None] + (a - lum[..., None]) * sat
    a = (a - .5) * contrast + .5
    # teal shadows / amber highlights
    sh = np.clip(1 - lum * 1.6, 0, 1)[..., None]; hi = np.clip((lum - .45) * 1.8, 0, 1)[..., None]
    a = a + sh * np.array([-.03, .02, .05]) * warm + hi * np.array([.07, .02, -.06]) * warm
    a = a * (1 - dark)
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).convert('RGBA')

def redgrade(im):
    g = ImageOps.autocontrast(im.convert('L'), cutoff=1)
    return ImageOps.colorize(g, (14, 0, 0), (255, 120, 80)).convert('RGBA')

def loadimg(i, maxw=2400):
    for ext in ('.jpg', '.jpeg', '.png'):
        p = os.path.join(HERE, 'raw', '%02d%s' % (i, ext))
        if os.path.exists(p):
            im = Image.open(p).convert('RGB')
            if im.width > maxw: im = im.resize((maxw, int(im.height * maxw / im.width)), Image.LANCZOS)
            return im
    p = os.path.join(HERE, 'painted', '%02d.jpg' % i)
    return Image.open(p).convert('RGB') if os.path.exists(p) else None

def load_assets():
    A = {}
    names = ['tikal', 'palenque', 'cath_pal', 'cath_stela', 'chichen', 'stalag', 'jaguar', 'ruins86']
    for i, n in enumerate(names):
        im = loadimg(i)
        A[n] = grade_color(im) if im is not None else None
        A[n + '_raw'] = im
    A['war'] = redgrade(A['jaguar_raw'] if A['jaguar_raw'] is not None else A['tikal_raw'])
    A['stela_red'] = redgrade(loadimg(8))
    def card(im, w=520):
        im = im.copy(); im.thumbnail((w, int(w * 1.6)))
        c = Image.new('RGBA', (im.width + 24, im.height + 24), (240, 230, 210, 255)); c.paste(im, (12, 12))
        sh = Image.new('RGBA', (c.width + 80, c.height + 80), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle((40, 50, c.width + 40, c.height + 50), fill=(0, 0, 0, 200))
        sh = sh.filter(ImageFilter.GaussianBlur(18)); sh.alpha_composite(c, (40, 40)); return sh
    A['chahk'] = card(loadimg(9), 400) if loadimg(9) is not None else None
    A['king'] = card(loadimg(10), 480) if loadimg(10) is not None else None
    # night sky
    y = np.linspace(0, 1, H)[:, None]
    top = np.array([3, 6, 18]); bot = np.array([40, 28, 60])
    sky = (top + (bot - top) * y[..., None] ** 1.3).repeat(W, 1).astype(np.uint8)
    sky = Image.fromarray(sky).convert('RGBA'); d = ImageDraw.Draw(sky); r = rng(3)
    for _ in range(420):
        x, yy, b = r.random() * W, r.random() * H * .75, r.random()
        s = .7 + b * 1.8; c = int(110 + 145 * b)
        d.ellipse((x - s, yy - s, x + s, yy + s), fill=(c, c, min(255, c + 25)))
    A['sky'] = sky
    # stepped pyramid silhouette
    py = Image.new('RGBA', (1000, 900), (0, 0, 0, 0)); d = ImageDraw.Draw(py)
    for k in range(9):
        w = 480 - k * 46; yb = 900 - k * 78
        d.rectangle((500 - w, yb - 78, 500 + w, yb), fill=(10, 8, 14, 255))
    d.rectangle((420, 900 - 9 * 78 - 120, 580, 900 - 9 * 78), fill=(10, 8, 14, 255))
    d.rectangle((455, 900 - 9 * 78 - 80, 545, 900 - 9 * 78), fill=(255, 170, 70, 255))
    d.polygon([(470, 0), (530, 0), (560, 900), (440, 900)], fill=(10, 8, 14, 255))  # stairs ridge
    A['pyr'] = py
    # cracked earth
    r = np.random.default_rng(11)
    n = np.array(Image.fromarray((r.random((90, 52)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)) / 255.
    base = np.stack([150 + 50 * n, 105 + 35 * n, 62 + 20 * n], -1)
    earth = Image.fromarray(base.clip(0, 255).astype(np.uint8)).convert('RGBA'); d = ImageDraw.Draw(earth)
    pts = [(r.random() * W, r.random() * H) for _ in range(140)]
    rr = rng(5); A['cracks'] = []
    for (x, y) in pts:
        seg_ = [(x, y)]
        for _ in range(rr.randint(3, 7)):
            x += (rr.random() - .5) * 170; y += (rr.random() - .5) * 170; seg_.append((x, y))
        A['cracks'].append(seg_)
    A['earth'] = earth
    # Maya lowlands rough map
    A['grain'] = [np.random.default_rng(k).normal(0, 6, (H, W, 1)).astype(np.float32) for k in range(6)]
    yy, xx = np.mgrid[0:H, 0:W]; rr2 = np.sqrt(((xx - W / 2) / (W * .62)) ** 2 + ((yy - H / 2) / (H * .58)) ** 2)
    A['vig'] = (1 - .6 * np.clip(rr2 - .45, 0, 1) ** 1.3)[..., None].astype(np.float32)
    return A

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

# ---------------------------------------------------------------- scenes
def archtag(im, t, txt, t0):
    a = eo((t - t0 - .3) / .4)
    if a > 0: put(im, text_img(txt, 'oswald', 30, (255, 236, 205, 255), 0, track=4, shadow=4), W / 2, 1265, 1, a * .9)

def sc_hook(A, t):  # 0 – 5.9 : Tikal temple, title
    im = photo(A, 'palenque', t, 0, 5.9, 1.5, 1.12, .45, .45, .3, .38)
    topshade(im)
    slam(im, 'WHY DID THE MAYA', t, .1, 380, 130)
    slam(im, 'COLLAPSE?', t, .4, 530, 230, col=(255, 70, 45))
    put(im, text_img('10 MILLION PEOPLE · GONE', 'oswald', 50, (255, 225, 170, 255), 0, track=6, shadow=4), W / 2, 250, 1, eo((t - 1.0) / .4))
    if t > 3.3: label(im, 'TULUM · F. CATHERWOOD, 1844', 1660, t, 3.4, size=44, col=(255, 230, 190), bar=False)
    motes(im, t, 40)
    flash(im, pulse(t, 0, .18))
    return im

def sc_cosmos(A, t):  # 5.9 – 11.8 : astronomers, empire
    lt = t - 5.9
    im = A['sky'].copy()
    d = ImageDraw.Draw(im)
    cx, cy = W / 2, 760
    # rotating calendar rings
    for k, (R, nt, sp) in enumerate([(430, 60, .12), (360, 20, -.2), (290, 13, .3), (210, 52, -.08)]):
        a = eo((lt - k * .25) / .8)
        if a <= 0: continue
        col = (255, 196, 110, int(170 * a))
        d.ellipse((cx - R, cy - R, cx + R, cy + R), outline=col, width=3)
        for j in range(nt):
            ang = j / nt * 2 * math.pi + lt * sp
            r0 = R - (16 if j % 5 else 30)
            d.line((cx + math.cos(ang) * r0, cy + math.sin(ang) * r0, cx + math.cos(ang) * R, cy + math.sin(ang) * R), fill=col, width=3)
    # orbiting Venus
    ang = lt * .9; vx, vy = cx + math.cos(ang) * 360, cy + math.sin(ang) * 360
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((vx - 26, vy - 26, vx + 26, vy + 26), fill=(255, 240, 200, 255))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(14))); im.alpha_composite(g.filter(ImageFilter.GaussianBlur(3)))
    put(im, A['pyr'], W / 2, H - 330 + 40 * (1 - eo(lt / 1.2)), .95)
    motes(im, t, 50, rise=-20)
    slam(im, 'MASTERS OF THE', t, 6.75, 300, 110, col=(255, 255, 255), out=8.25)
    slam(im, 'COSMOS', t, 7.45, 420, 190, col=(255, 196, 110), out=8.25)
    if t > 8.3:
        slam(im, 'AN EMPIRE', t, 8.35, 300, 130)
        slam(im, 'OF GENIUS', t, 9.7, 430, 170, col=(255, 196, 110))
    flash(im, pulse(t, 5.9, 6.05))
    return im

def sc_vanish(A, t):  # 11.8 – 15.5 : jungle swallows it
    lt = t - 11.8
    im = photo(A, 'tikal', t, 11.8, 15.5, 1.05, 1.3, .5, .5, .45, .4)
    archtag(im, t, 'TIKAL · PHOTO, 1923', 11.9)
    vines(im, t, 12.2, 16, seed=4)
    darken(im, .45 * seg(t, 13.5, 15.3))
    slam(im, '…THEN IT', t, 12.5, 360, 130)
    slam(im, 'VANISHED', t, 12.78, 500, 220, col=(255, 70, 45))
    flash(im, pulse(t, 11.8, 11.95))
    return im

def sc_spanish(A, t):  # 15.5 – 25.6 : found centuries later
    if t < 20.1:
        im = photo(A, 'cath_pal', t, 15.5, 20.1, 1.2, 1.45, .4, .6, .5, .5)
        topshade(im)
        label(im, '1500s', 300, t, 15.7, size=70, col=(255, 210, 150)); archtag(im, t, 'COPÁN · F. CATHERWOOD, 1844', 15.6)
        label(im, 'SPANISH CONQUISTADORS ARRIVE', 395, t, 16.2, size=46, col=(255, 255, 255), bar=False)
        motes(im, t, 30)
        flash(im, pulse(t, 15.5, 15.65))
        return im
    im = photo(A, 'cath_stela', t, 20.1, 25.6, 1.15, 1.45, .5, .5, .45, .4)
    topshade(im)
    slam(im, 'EMPTY CITIES', t, 20.4, 360, 160, out=22.85); archtag(im, t, 'STELA, COPÁN · 1844', 20.2)
    if t > 22.85:
        slam(im, 'NOT ONE', t, 22.9, 330, 140)
        slam(im, 'SOUL LEFT', t, 23.8, 480, 190, col=(255, 70, 45))
    motes(im, t, 30)
    flash(im, pulse(t, 20.1, 20.25))
    return im

def sc_question(A, t):  # 25.6 – 27.9
    lt = t - 25.6
    im = photo(A, 'chichen', t, 25.6, 27.9, 1.3, 1.05, .5, .5, .5, .5)
    darken(im, .5)
    slam(im, 'WHAT', t, 25.7, 560, 200)
    slam(im, 'HAPPENED?', t, 25.95, 740, 230, col=(255, 70, 45))
    flash(im, pulse(t, 25.6, 25.75))
    return im

def sc_theory_old(A, t):  # 27.9 – 36.7
    if t < 32.3:
        im = A['sky'].copy(); darken(im, .3)
        put(im, A['pyr'], W / 2, H - 380, 1.0, .9)
        cards = [('INVASION?', 29.0, -1), ('VOLCANO?', 29.6, 1), ('PLAGUE?', 30.4, -1)]
        for i, (txt, tc, sd) in enumerate(cards):
            a = eo((t - tc) / .3)
            if a <= 0: continue
            card = Image.new('RGBA', (700, 170), (0, 0, 0, 0)); cd = ImageDraw.Draw(card)
            cd.rounded_rectangle((0, 0, 700, 170), 24, fill=(235, 222, 196, 245))
            card.alpha_composite(text_img(txt, 'bebas', 130, (40, 30, 24, 255), 0), (40, 6))
            x = W / 2 + sd * 500 * (1 - a)
            put(im, card, x, 560 + i * 230, 1, a, sd * 3)
            k = seg(t, tc + .6, tc + .8)
            if k > 0:
                dd = ImageDraw.Draw(im)
                dd.line((x - 330, 560 + i * 230 - 50, x - 330 + 660 * k, 560 + i * 230 + 50 * (2 * k - 1)), fill=(220, 30, 30, 255), width=14)
        label(im, 'ONE SINGLE CATASTROPHE?', 300, t, 28.1, size=58, col=(255, 210, 150))
        flash(im, pulse(t, 27.9, 28.05))
        return im
    # descent beneath the ruins
    lt = t - 32.3
    im = Image.new('RGBA', (W, H), (0, 0, 0, 255)); d = ImageDraw.Draw(im)
    off = eio(lt / 3.6) * 1400
    cols = [(92, 70, 48), (74, 55, 38), (58, 42, 30), (44, 31, 22), (32, 22, 16), (22, 15, 11), (14, 9, 7)]
    for i in range(14):
        y0 = 300 + i * 260 - off
        d.rectangle((0, y0, W, y0 + 260), fill=cols[min(i // 2, 6)] + (255,))
        rr = rng(i)
        for _ in range(30):
            x = rr.random() * W; yy = y0 + rr.random() * 260; s = 3 + rr.random() * 10
            d.ellipse((x - s, yy - s * .6, x + s, yy + s * .6), fill=tuple(c + 18 for c in cols[min(i // 2, 6)]) + (255,))
    # buried skull-glow / truth
    gl = seg(t, 34.4, 35.3)
    if gl > 0:
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((240, 700, 840, 1300), fill=(255, 90, 40, int(160 * gl)))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(110)))
    label(im, 'THE TRUTH WAS BURIED', 330, t, 32.5, size=60, col=(255, 220, 170))
    slam(im, 'FAR MORE', t, 34.6, 620, 150)
    slam(im, 'TERRIFYING', t, 35.25, 780, 200, col=(255, 70, 45))
    return im

def sc_stalag(A, t):  # 36.7 – 41.8
    lt = t - 36.7
    im = photo(A, 'stalag', t, 36.7, 41.8, 1.15, 1.45, .5, .5, .5, .45)
    darken(im, .25); topshade(im)
    # growth-ring scan line + isotope chart
    d = ImageDraw.Draw(im)
    k = eo((t - 38.6) / 2.6)
    if k > 0:
        x0, y0, w, h = 110, 1560, 860, 220
        d.rounded_rectangle((x0 - 20, y0 - 40, x0 + w + 20, y0 + h + 20), 20, fill=(0, 0, 0, 160))
        rr = rng(2); pts = []
        for i in range(int(80 * k)):
            yv = .35 + .15 * math.sin(i * .5) + (rr.random() - .5) * .2 + (.4 if i > 50 else 0) * min(1, (i - 50) / 10 if i > 50 else 0)
            pts.append((x0 + i / 80 * w, y0 + h * yv * .9))
        if len(pts) > 1: d.line(pts, fill=(255, 200, 90, 255), width=5)
        put(im, text_img('RAINFALL RECORD · 800–1000 AD', 'oswald', 30, (255, 230, 190, 255), 0, track=3), W / 2, y0 - 12, 1)
    slam(im, 'CAVE', t, 37.9, 340, 150, out=41.6); archtag(im, t, 'BOLONCHÉN WATER CAVE · 1844', 36.8)
    slam(im, 'STALAGMITES', t, 38.3, 480, 170, col=(255, 196, 110), out=41.6)
    label(im, 'NATURE\'S CLIMATE DIARY', 610, t, 39.4, size=50, col=(255, 255, 255), bar=False)
    flash(im, pulse(t, 36.7, 36.85))
    return im

def sc_drought(A, t):  # 41.8 – 48.3
    lt = t - 41.8
    im = A['earth'].copy(); d = ImageDraw.Draw(im)
    for i, cr in enumerate(A['cracks']):
        k = seg(t, 41.9 + (i % 40) * .05, 42.9 + (i % 40) * .05)
        if k <= 0: continue
        n = max(2, int(len(cr) * k)); d.line(cr[:n], fill=(45, 28, 16, 255), width=6)
    # heat
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((300, -300, 780, 180), fill=(255, 240, 200, 220))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(120)))
    sc = 1 + .08 * eio(lt / 6.5)
    if sc > 1.001:
        im = im.resize((int(W * sc), int(H * sc)), Image.BILINEAR).crop((int(W * (sc - 1) / 2), int(H * (sc - 1) / 2), int(W * (sc - 1) / 2) + W, int(H * (sc - 1) / 2) + H))
    topshade(im, .6)
    slam(im, 'MEGADROUGHT', t, 41.85, 380, 200, col=(255, 230, 190))
    if t > 42.3:
        yrs = int(lerp(0, 100, eo((t - 42.3) / 1.6)))
        put(im, text_img(f'{yrs}+ YEARS', 'bebas', 140, (255, 70, 45, 255), 0, shadow=8), W / 2, 560, 1, eo((t - 42.3) / .3))
    if t > 43.9: label(im, 'RESERVOIRS DRY', 760, t, 43.95, size=64, col=(255, 255, 255), bar=True)
    if t > 45.5: label(im, 'CROPS WITHERED', 860, t, 45.55, size=64, col=(255, 255, 255), bar=True)
    motes(im, t, 40, col=(255, 230, 190), rise=-10, alpha=.6)
    flash(im, pulse(t, 41.8, 41.95), (255, 240, 210))
    return im

CITIES = [('TIKAL', 560, 980), ('CALAKMUL', 520, 800), ('PALENQUE', 250, 900), ('COPAN', 700, 1250), ('CARACOL', 690, 1060),
          ('YAXCHILAN', 360, 1020), ('UXMAL', 600, 560), ('DOS PILAS', 470, 1090)]
def sc_famine(A, t):  # 48.3 – 53.4 : map, cities going dark
    lt = t - 48.3
    im = Image.new('RGBA', (W, H), (16, 24, 22, 255)); d = ImageDraw.Draw(im)
    # rough Yucatan + lowlands outline
    land = [(150, 1540), (140, 1160), (230, 900), (380, 790), (420, 560), (560, 470), (760, 500), (860, 680), (840, 880),
            (780, 1060), (800, 1240), (900, 1430), (760, 1580), (420, 1570)]
    dry = seg(t, 48.8, 51.0)
    lc = tuple(int(lerp(a, b, dry)) for a, b in zip((40, 92, 52), (130, 96, 58)))
    d.polygon(land, fill=lc + (255,), outline=(200, 190, 150, 255))
    # lakes drying
    for (lx, ly, r) in [(520, 1030, 60), (400, 900, 40), (650, 880, 35)]:
        rr_ = r * (1 - dry * .9)
        d.ellipse((lx - rr_, ly - rr_ * .6, lx + rr_, ly + rr_ * .6), fill=(60, 140, 190, 255))
    for i, (nm, x, y) in enumerate(CITIES):
        a = eo((t - 48.4 - i * .08) / .3)
        dead = seg(t, 50.4 + i * .2, 50.7 + i * .2)
        col = tuple(int(lerp(c1, c2, dead)) for c1, c2 in zip((255, 220, 120), (200, 25, 25)))
        r = 13 * a
        d.ellipse((x - r, y - r, x + r, y + r), fill=col + (255,), outline=(255, 255, 255, int(255 * a)), width=3)
        put(im, text_img(nm, 'oswald', 30, (240, 235, 220, 255), 0, track=2, shadow=3), x, y - 34, 1, a)
    put(im, text_img('MAYA LOWLANDS', 'oswald', 40, (200, 220, 200, 255), 0, track=8), W / 2, 1660, 1, eo(lt / .4))
    slam(im, 'LAKES DRIED UP', t, 48.7, 300, 130, out=50.35)
    if t > 50.35: slam(im, 'FAMINE', t, 50.4, 320, 220, col=(255, 70, 45))
    flash(im, pulse(t, 48.3, 48.45))
    return im

def sc_war(A, t):  # 53.4 – 59.7 : civil war
    lt = t - 53.4
    im = photo(A, 'war', t, 53.4, 59.7, 1.2, 1.55, .5, .5, .5, .45)
    darken(im, .2)
    motes(im, t, 120, col=(255, 140, 50), rise=-180, drift=20, size=1.2, ember=True)
    topshade(im)
    slam(im, 'TURNED ON', t, 53.4, 330, 130, out=54.7)
    slam(im, 'EACH OTHER', t, 53.8, 470, 170, col=(255, 70, 45), out=54.7)
    if 54.7 < t < 56.55:
        slam(im, 'BRUTAL', t, 54.72, 420, 260, col=(255, 60, 40))
    if t > 56.55:
        slam(im, 'CIVIL', t, 56.6, 380, 230, col=(255, 255, 255))
        slam(im, 'WAR', t, 57.05, 580, 300, col=(255, 60, 40))
        put(im, text_img('APOCALYPTIC', 'oswald', 60, (255, 210, 170, 255), 0, track=12, shadow=4), W / 2, 270, 1, eo((t - 56.0) / .3))
    dx, dy = shake(t, 57.05, 26)
    flash(im, pulse(t, 53.4, 53.55), (255, 90, 40))
    return im, dx, dy

def sc_dynasty(A, t):  # 59.7 – 62.6 : dynasties collapsed
    lt = t - 59.7
    base = photo(A, 'stela_red', t, 59.7, 62.6, 1.2, 1.35, .5, .5, .45, .45)
    k = eo((t - 60.56) / .5)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    if k <= 0: im = base
    else:  # split the stela diagonally
        mask = Image.new('L', (W, H), 0); ImageDraw.Draw(mask).polygon([(0, 0), (W, 0), (W, 820), (0, 1160)], fill=255)
        top = Image.new('RGBA', (W, H), (0, 0, 0, 0)); top.paste(base, (0, 0), mask)
        bot = Image.new('RGBA', (W, H), (0, 0, 0, 0)); bot.paste(base, (0, 0), ImageOps.invert(mask))
        im.alpha_composite(top.transform((W, H), Image.AFFINE, (1, 0, 40 * k, 0, 1, 60 * k), Image.BILINEAR))
        im.alpha_composite(bot.transform((W, H), Image.AFFINE, (1, 0, -40 * k, 0, 1, -60 * k), Image.BILINEAR))
    topshade(im)
    slam(im, 'DYNASTIES', t, 59.85, 340, 180)
    slam(im, 'FELL', t, 60.56, 500, 230, col=(255, 60, 40))
    dx, dy = shake(t, 60.6, 24)
    flash(im, pulse(t, 59.7, 59.85), (255, 60, 30))
    return im, dx, dy

def sc_abandon(A, t):  # 62.6 – 68.3
    lt = t - 62.6
    im = photo(A, 'ruins86', t, 62.6, 68.3, 1.05, 1.3, .5, .5, .5, .5)
    archtag(im, t, 'PALENQUE PALACE · 1923', 62.7)
    vines(im, t, 63.2, 18, seed=9)
    topshade(im)
    slam(im, 'TEMPLES', t, 63.4, 340, 170)
    slam(im, 'ABANDONED', t, 63.9, 490, 190, col=(255, 196, 110))
    if t > 65.2:
        pop = int(lerp(0, 90, eo((t - 65.2) / 1.6)))
        put(im, text_img(f'POPULATION -{pop}%', 'bebas', 120, (255, 70, 45, 255), 0, shadow=8), W / 2, 680, 1, eo((t - 65.2) / .3))
        put(im, text_img('(estimated, southern lowlands)', 'type', 34, (255, 235, 210, 255), 0, shadow=3), W / 2, 770, 1, eo((t - 65.6) / .3))
    motes(im, t, 40)
    darken(im, .5 * seg(t, 67.6, 68.3))
    flash(im, pulse(t, 62.6, 62.75))
    return im

def tree(d, x, y, s, alive):
    if alive >= 1:
        d.rectangle((x - 8 * s, y - 120 * s, x + 8 * s, y), fill=(50, 34, 22, 255))
        for k, (ox, oy, r) in enumerate([(0, -170, 70), (-45, -130, 55), (45, -130, 55), (0, -110, 60)]):
            d.ellipse((x + (ox - r) * s, y + (oy - r) * s, x + (ox + r) * s, y + (oy + r) * s), fill=(28, 72 + k * 8, 34, 255))
    else:
        d.rectangle((x - 9 * s, y - 26 * s, x + 9 * s, y), fill=(70, 48, 30, 255)); d.ellipse((x - 9 * s, y - 32 * s, x + 9 * s, y - 20 * s), fill=(150, 112, 72, 255))

def sc_theories(A, t):  # 68.3 – 76.75
    if t < 70.65:  # climate
        im = A['earth'].copy(); d = ImageDraw.Draw(im)
        for cr in A['cracks']: d.line(cr, fill=(45, 28, 16, 255), width=6)
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); pul = .8 + .2 * math.sin(t * 6)
        ImageDraw.Draw(g).ellipse((240, 500, 840, 1100), fill=(255, 150, 40, int(230 * pul)))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(90)))
        ImageDraw.Draw(im).ellipse((390, 650, 690, 950), fill=(255, 235, 170, 255))
        label(im, 'THEORY 1', 300, t, 68.4, size=48)
        if A['chahk'] is not None:
            put(im, A['chahk'], W / 2 + 230, 1060 + 20 * math.sin(t), back((t - 68.6) / .5) * .85, 1, 6)
            put(im, text_img('CHAAHK · RAIN GOD', 'oswald', 34, (255, 235, 200, 255), 0, track=4, shadow=4), W / 2 + 230, 1300, 1, eo((t - 69.0) / .3))
        slam(im, 'CLIMATE', t, 69.3, 420, 180)
        slam(im, 'CATASTROPHE?', t, 69.65, 570, 150, col=(255, 140, 40))
        flash(im, pulse(t, 68.3, 68.45))
        return im
    if t < 73.4:  # deforestation
        lt = t - 70.65
        im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
        y = np.linspace(0, 1, H)[:, None]
        sky = (np.array([60, 40, 30]) + (np.array([190, 120, 70]) - np.array([60, 40, 30])) * y[..., None] ** .8).repeat(W, 1).astype(np.uint8)
        im = Image.fromarray(sky).convert('RGBA'); d = ImageDraw.Draw(im)
        d.rectangle((0, 1250, W, H), fill=(92, 68, 44, 255))
        r = rng(8); trees = sorted([(r.random() * W, 1160 + r.random() * 360, .7 + r.random() * .7, r.random()) for _ in range(34)], key=lambda q: q[1])
        for x, yy, s, o in trees:
            tree(d, x, yy, s, 1 if t < 71.1 + o * 1.8 else 0)
        label(im, 'THEORY 2', 300, t, 70.7, size=48)
        slam(im, 'ECOLOGICAL', t, 71.6, 420, 170)
        slam(im, 'SUICIDE?', t, 72.2, 570, 200, col=(255, 70, 45))
        flash(im, pulse(t, 70.65, 70.8))
        return im
    lt = t - 73.4  # something else
    im = A['sky'].copy(); darken(im, .25)
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((140, 700, 940, 1500), fill=(170, 20, 30, int(140 + 60 * math.sin(lt * 3) ** 2)))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(140)))
    put(im, A['pyr'], W / 2, H - 420, lerp(1.0, 1.25, eio(lt / 3.4)))
    label(im, 'THEORY 3', 300, t, 73.45, size=48)
    if A['king'] is not None:
        put(im, A['king'], W / 2, 1060, lerp(.75, .9, lt / 3.3), eo((t - 74.3) / .5) * .9)
    slam(im, 'OR SOMETHING', t, 73.5, 430, 150)
    if t > 74.0:
        gg = seg(t, 74.0, 74.45); jit = (rng(int(t * 30)).random() - .5) * 50 * (1 - gg)
        put(im, text_img('ELSE…?', 'bebas', 220, (255, 45, 40, 255), 0, shadow=10), W / 2 + jit, 600, lerp(1.4, 1, eo(gg)), eo(gg * 2))
    motes(im, t, 40, col=(255, 120, 90), alpha=.6)
    flash(im, pulse(t, 73.4, 73.6), (0, 0, 0))
    return im

def sc_end(A, t):  # 76.75 – end
    lt = t - 76.75
    im = photo(A, 'tikal', t, 76.75, DUR, 1.5, 1.25, .5, .5, .5, .5)
    darken(im, .45)
    slam(im, 'WHAT DO', t, 76.8, 330, 150)
    slam(im, 'YOU THINK?', t, 77.05, 480, 200, col=(255, 70, 45))
    a = back((t - 77.6) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 79.4) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 79.4) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    motes(im, t, 30)
    flash(im, pulse(t, 76.75, 76.95))
    return im

SCENES = [(0, 5.9, sc_hook), (5.9, 11.8, sc_cosmos), (11.8, 15.5, sc_vanish), (15.5, 25.6, sc_spanish), (25.6, 27.9, sc_question),
          (27.9, 36.7, sc_theory_old), (36.7, 41.8, sc_stalag), (41.8, 48.3, sc_drought), (48.3, 53.4, sc_famine), (53.4, 59.7, sc_war),
          (59.7, 62.6, sc_dynasty), (62.6, 68.3, sc_abandon), (68.3, 76.75, sc_theories), (76.75, 99, sc_end)]

def frame(A, t):
    for a, b, fn in SCENES:
        if a <= t < b: break
    r = fn(A, t)
    dx = dy = 0
    if isinstance(r, tuple): r, dx, dy = r
    im = r
    sdx, sdy = shake(t, 12.8, 18); dx += sdx; dy += sdy
    sdx, sdy = shake(t, 50.4, 16); dx += sdx; dy += sdy
    if dx or dy: im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
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
