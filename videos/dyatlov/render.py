# Dyatlov Pass — YT Shorts renderer (1080x1920, 30 fps). Frame-by-frame PIL + numpy, piped to ffmpeg.
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

# ---------------------------------------------------------------- assets
def load_assets():
    A = {}
    tent = Image.open(os.path.join(HERE, 'raw', '00.jpg')).convert('RGB')
    A['tent'] = grade(tent.resize((tent.width * 2, tent.height * 2), Image.LANCZOS))
    mem = Image.open(os.path.join(HERE, 'raw', '01.jpg')).convert('RGB')
    A['faces'] = grade(mem.crop((990, 640, 2160, 1990)), shadow=(10, 12, 18), high=(232, 236, 240), contrast=1.15)
    cf = os.path.join(HERE, 'raw2', '00.jpg')
    try: A['case'] = grade(Image.open(cf).convert('RGB'), shadow=(20, 16, 12), high=(236, 226, 205), contrast=1.1)
    except Exception: A['case'] = None
    # night sky
    y = np.linspace(0, 1, H)[:, None]
    top = np.array([4, 7, 16]); bot = np.array([28, 40, 62])
    sky = (top + (bot - top) * y[..., None] ** 1.4).repeat(W, 1).astype(np.uint8)
    sky = Image.fromarray(sky).convert('RGBA'); d = ImageDraw.Draw(sky); r = rng(3)
    for _ in range(260):
        x, yy, b = r.random() * W, r.random() * H * .6, r.random()
        s = .8 + b * 1.6; c = int(120 + 135 * b)
        d.ellipse((x - s, yy - s, x + s, yy + s), fill=(c, c, min(255, c + 20)))
    A['sky'] = sky
    # mountain layers (wider than frame for parallax)
    A['mtn'] = []
    MW = 1500
    cols = [(52, 66, 90), (34, 45, 66), (20, 28, 44), (9, 13, 22)]
    for i, (base_y, amp, col) in enumerate([(820, 260, cols[0]), (1000, 300, cols[1]), (1200, 260, cols[2]), (1420, 200, cols[3])]):
        r = rng(10 + i); xs = np.arange(MW)
        ph = [r.random() * 6.28 for _ in range(6)]
        ridge = sum(amp / (k + 1) ** 1.25 * np.sin(xs / MW * 6.28 * (k + 1) * (1.1 + i * .3) + ph[k]) for k in range(6))
        if i == 1: ridge -= 260 * np.exp(-((xs - MW * .55) / 190) ** 2)  # the "dead mountain" peak
        jag = np.cumsum(np.random.default_rng(20 + i).normal(0, 3.2, MW)); jag -= np.convolve(jag, np.ones(160) / 160, 'same'); ridge = base_y + ridge + jag * (1.4 - i * .25)
        im = Image.new('RGBA', (MW, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(im)
        dd.polygon([(0, H)] + [(int(x), float(ridge[x])) for x in range(0, MW, 4)] + [(MW, H)], fill=col + (255,))
        # snow highlight along the ridge
        snow = tuple(min(255, c + 70 - i * 14) for c in col)
        for x in range(0, MW - 4, 4):
            dd.line([(x, ridge[x] + 2), (x + 4, ridge[x + 4] + 2)], fill=snow + (200,), width=3)
        A['mtn'].append((im, ridge))
    # map terrain
    r = np.random.default_rng(5)
    n = r.random((60, 34)); n = np.array(Image.fromarray((n * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)) / 255.
    n2 = np.array(Image.fromarray((r.random((240, 135)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)) / 255.
    hgt = n * .75 + n2 * .25
    base = np.stack([200 + 30 * hgt, 212 + 28 * hgt, 226 + 22 * hgt], -1)
    cont = (np.abs(((hgt * 14) % 1) - .5) < .03)
    base[cont] = base[cont] * .78
    A['map'] = Image.fromarray(base.clip(0, 255).astype(np.uint8)).convert('RGBA')
    # xray ribcage
    xr = Image.new('RGBA', (900, 1100), (0, 0, 0, 0)); d = ImageDraw.Draw(xr); C = (120, 230, 255, 255)
    cx = 450
    for k in range(13):  # spine
        yy = 80 + k * 70; d.rounded_rectangle((cx - 26, yy, cx + 26, yy + 52), 12, outline=C, width=6)
    for k in range(10):  # ribs
        yy = 190 + k * 66; w = 300 - abs(k - 3) * 18 - (k > 6) * (k - 6) * 30
        d.arc((cx - w, yy - 40, cx + w, yy + 140), 200, 340, fill=C, width=10)
    d.ellipse((cx - 330, 40, cx - 200, 120), outline=C, width=8); d.ellipse((cx + 200, 40, cx + 330, 120), outline=C, width=8)
    d.line((cx - 180, 70, cx - 40, 110), fill=C, width=10); d.line((cx + 180, 70, cx + 40, 110), fill=C, width=10)
    A['xray'] = glow(xr, 14, 1.6)
    # body outline (for "no external wounds")
    bo = Image.new('RGBA', (700, 1300), (0, 0, 0, 0)); d = ImageDraw.Draw(bo); C2 = (235, 240, 245, 255)
    d.ellipse((260, 20, 440, 220), outline=C2, width=7)
    d.line([(320, 215), (310, 270), (150, 320), (110, 700), (150, 710), (200, 400), (215, 760), (240, 1260), (330, 1260), (350, 820),
            (370, 1260), (460, 1260), (485, 760), (500, 400), (550, 710), (590, 700), (550, 320), (390, 270), (380, 215)], fill=C2, width=7, joint='curve')
    A['body'] = glow(bo, 8, 1.2)
    # paper
    pr = np.random.default_rng(9).normal(0, 9, (1500, 1050))
    paper = np.stack([226 + pr, 216 + pr, 192 + pr], -1).clip(0, 255).astype(np.uint8)
    A['paper'] = Image.fromarray(paper).convert('RGBA')
    # grain + vignette
    gr = np.random.default_rng(1)
    A['grain'] = [gr.normal(0, 7, (H, W, 1)).astype(np.float32) for _ in range(6)]
    yy, xx = np.mgrid[0:H, 0:W]; rr = np.sqrt(((xx - W / 2) / (W * .62)) ** 2 + ((yy - H / 2) / (H * .58)) ** 2)
    A['vig'] = (1 - .62 * np.clip(rr - .45, 0, 1) ** 1.3)[..., None].astype(np.float32)
    return A

# ---------------------------------------------------------------- words / captions
WORDS = json.load(open(os.path.join(HERE, 'words.json')))
FIX = {'Kholatsyakhl,': 'Kholat Syakhl,', '-30': 'minus 30°', '-speed': None, 'barefooted': 'barefoot'}
ws = []
for w in WORDS:
    t = w['w']
    if t == 'minus': continue
    if t == '-speed': ws[-1]['w'] += '-speed'; ws[-1]['e'] = w['e']; continue
    t = FIX.get(t, t)
    if t == 'minus 30°': t = '-30°C'
    ws.append(dict(w=t, s=w['s'], e=w['e']))
KEY = {'ALIVE', 'DEAD', 'MOUNTAIN', 'HORRIFYING', 'SLASHED', 'INSIDE', 'BAREFOOT', '-30°C', 'BLIZZARD', 'NIGHTMARE', 'BODIES',
       'CATASTROPHIC', 'TRAUMA', 'CAR', 'CRASH', 'ZERO', 'TONGUE', 'MISSING', 'RADIATION', 'AVALANCHE', 'CLASSIFIED', 'WEAPON',
       'SINISTER', 'NONE', 'ANCIENT', 'UNKNOWN', 'FROZE', 'DEATH'}
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

def sc_hook(A, t):  # 0 – 2.6 : tent photo, punch zoom, "WHAT HAPPENED HERE?"
    z = lerp(1.9, 1.35, eo(t / 2.4)); im = cover(A['tent'], t, z, .62, .55)
    topshade(im)
    d = ImageDraw.Draw(im)
    a = eo((t - .5) / .4)
    if a > 0:  # red circle around the slashed tent
        cx, cy, r = 760, 1010, 260 * lerp(1.4, 1, a)
        for k in range(3): d.ellipse((cx - r - k * 2, cy - r * .62 - k * 2, cx + r + k * 2, cy + r * .62 + k * 2), outline=(255, 50, 40, int(230 * a)), width=7)
    slam(im, 'WHAT HAPPENED', t, .12, 380, 150, stroke=0)
    slam(im, 'HERE?', t, .45, 530, 230, col=(255, 60, 50))
    put(im, text_img('DYATLOV PASS · 1959', 'oswald', 46, (200, 225, 245, 255), 0, track=8, shadow=4), W / 2, 250, 1, eo((t - .9) / .4))
    flash(im, pulse(t, 0, .18))
    return im

def sc_faces(A, t):  # 2.6 – 9.0 : nine hikers -> none came back
    lt = t - 2.6
    z = lerp(1.0, 1.22, eio(lt / 6.4))
    src = A['faces']
    im = Image.new('RGBA', (W, H), (8, 10, 14, 255))
    fw = int(W * 1.04 * z); fh = int(fw * src.height / src.width)
    fimg = src.resize((fw, fh), Image.BILINEAR)
    # after "none" faces drain to dark red-tinted
    k = seg(t, 6.4, 7.6)
    if k > 0:
        dk = Image.new('RGBA', fimg.size, (40, 0, 0, int(170 * k))); fimg = Image.alpha_composite(fimg, dk)
    put(im, fimg, W / 2, 1000, 1)
    darken(im, .25)
    # counter
    n = 9
    slam(im, '9', t, 2.62, 360, 300, col=(255, 255, 255), out=6.3)
    slam(im, 'EXPERIENCED HIKERS', t, 2.85, 520, 96, col=(170, 210, 240), out=6.3)
    if t >= 6.4:
        slam(im, '0', t, 6.42, 360, 300, col=(255, 60, 50))
        slam(im, 'CAME BACK ALIVE', t, 7.0, 520, 104, col=(255, 255, 255))
    flash(im, .8 * pulse(t, 2.6, 2.75))
    flash(im, .5 * pulse(t, 6.42, 6.6), (255, 40, 30))
    return im

def mountains(A, t, cam=0., zoom=1., tent=0., peak_red=0.):
    im = A['sky'].copy()
    if peak_red > 0:
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((W * .2, 380, W * .8, 1000), fill=(160, 10, 10, int(160 * peak_red)))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(120)))
    for i, (layer, ridge) in enumerate(A['mtn']):
        par = (i + 1) * .5
        ox = -(layer.width - W) / 2 + cam * par * 60
        y_off = (zoom - 1) * (i + 1) * 120
        if abs(zoom - 1) > .01:
            sc = 1 + (zoom - 1) * (i + 1) * .35
            L = layer.resize((int(layer.width * sc), int(layer.height * sc)), Image.BILINEAR)
            paste_clip(im, L, int(-(L.width - W) / 2 + cam * par * 60), int(-(L.height - H) * .5 + y_off * 0))
        else:
            paste_clip(im, layer, int(ox), int(y_off))
        if i == 1 and tent > 0:  # tent with lamp on the slope of layer 1
            tx = int(layer.width * .66 + ox); ty = int(ridge[int(layer.width * .66)] + 70 + y_off)
            if abs(zoom - 1) > .01:
                sc = 1 + (zoom - 1) * (i + 1) * .35
                tx = int((layer.width * .66) * sc - (layer.width * sc - W) / 2 + cam * par * 60); ty = int((ridge[int(layer.width * .66)] + 70) * sc - (layer.height * sc - H) * .5)
            g = Image.new('RGBA', (400, 400), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
            fl = .8 + .2 * math.sin(t * 13) * math.sin(t * 7.3)
            gd.ellipse((110, 110, 290, 290), fill=(255, 150, 60, int(150 * tent * fl)))
            im.alpha_composite(g.filter(ImageFilter.GaussianBlur(40)), (tx - 200, ty - 220))
            ImageDraw.Draw(im).polygon([(tx - 60, ty), (tx + 60, ty), (tx, ty - 55)], fill=(255, 196, 120, int(255 * tent)))
            ImageDraw.Draw(im).line((tx - 4, ty, tx + 4, ty - 40), fill=(120, 60, 20, int(255 * tent)), width=3)
    return im

def sc_mountain(A, t):  # 9.0 – 20.9
    lt = t - 9.0
    zoom = lerp(1.0, 1.35, eio(lt / 11.9))
    im = mountains(A, t, cam=lerp(-1.5, 1.5, eio(lt / 11.9)), zoom=zoom, tent=1 - seg(t, 18.6, 19.4), peak_red=seg(t, 18.8, 19.6))
    snow(im, t, 110, wind=60, fall=90)
    label(im, 'NORTHERN URALS · USSR', 300, t, 9.2)
    label(im, 'FEBRUARY 1959', 380, t, 9.6, size=44, col=(220, 230, 240), bar=False)
    if 15.1 <= t < 18.85:
        slam(im, 'KHOLAT SYAKHL', t, 15.15, 640, 170)
        put(im, text_img('(local Mansi name)', 'type', 46, (200, 215, 230, 255), 0, shadow=3), W / 2, 760, 1, eo((t - 15.6) / .4))
    if t >= 18.85:
        g = seg(t, 18.85, 19.25)
        jit = (rng(int(t * 30)).random() - .5) * 40 * (1 - g)
        put(im, text_img('"DEAD MOUNTAIN"', 'bebas', 190, (255, 55, 45, 255), 0, shadow=10), W / 2 + jit, 660, lerp(1.5, 1, eo(g)), eo(g * 2))
    flash(im, .9 * pulse(t, 9.0, 9.2), (0, 0, 0))
    flash(im, .35 * pulse(t, 18.9, 19.15), (255, 30, 20))
    return im

def sc_search(A, t):  # 20.9 – 26.9 : search party (photo, left side men)
    lt = t - 20.9
    z = lerp(1.25, 1.55, eio(lt / 6))
    im = cover(A['tent'], t, z, lerp(.22, .3, lt / 6), .5)
    darken(im, .15); topshade(im)
    snow(im, t, 60, wind=20, fall=60, alpha=.6)
    label(im, 'THE SEARCH PARTY', 300, t, 21.0)
    label(im, 'FEB 26, 1959', 380, t, 21.4, size=44, col=(220, 230, 240), bar=False)
    if t > 25.2:
        k = seg(t, 25.25, 25.9); darken(im, .55 * k)
        slam(im, 'THEN THEY FOUND IT', t, 25.3, 620, 120, col=(255, 255, 255))
    flash(im, .7 * pulse(t, 20.9, 21.05))
    return im

def sc_tent(A, t):  # 26.9 – 30.1 : tent slashed from the inside
    lt = t - 26.9
    im = cover(A['tent'], t, lerp(2.3, 2.6, lt / 3.2), .66, .62); topshade(im)
    d = ImageDraw.Draw(im)
    # slashes cut across the tent fabric
    cuts = [((520, 820), (860, 1180), 27.85), ((600, 760), (940, 1080), 28.25), ((470, 960), (780, 1260), 28.65)]
    for (x0, y0), (x1, y1), tc in cuts:
        k = eo((t - tc) / .18)
        if k <= 0: continue
        xe, ye = lerp(x0, x1, k), lerp(y0, y1, k)
        d.line((x0, y0, xe, ye), fill=(255, 40, 30, 255), width=14)
        d.line((x0, y0, xe, ye), fill=(255, 220, 210, 255), width=4)
    label(im, 'CUT OPEN FROM THE INSIDE', 300, t, 28.9, size=58, col=(255, 90, 80))
    flash(im, 1 - seg(t, 26.9, 27.05))
    return im

def foot(d, x, y, left, a, s=1.):
    col = (40, 55, 75, int(a * 230))
    d.ellipse((x - 20 * s, y - 42 * s, x + 20 * s, y + 42 * s), fill=col)
    for k in range(5):
        tx = x + ((k - 2) * 10 if left else (2 - k) * 10) * s
        d.ellipse((tx - 6 * s, y - 62 * s - (4 - abs(k - 1.5) * 3) * s, tx + 6 * s, y - 50 * s), fill=col)

def sc_blizzard(A, t):  # 30.1 – 37.0
    lt = t - 30.1
    im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    y = np.linspace(0, 1, H)[:, None]
    # snowy ground seen from above, blue-grey
    arr = np.zeros((H, W, 3), np.uint8); arr[:] = (150, 165, 185)
    im = Image.fromarray(arr).convert('RGBA')
    d = ImageDraw.Draw(im)
    scroll = lt * 260
    for k in range(40):  # running footprints, going down the slope
        fy = 2100 - k * 150 + scroll - 1000
        if -100 < fy < H + 100:
            appear = seg(t, 30.2 + k * .17, 30.35 + k * .17)
            foot(d, W / 2 + (60 if k % 2 else -60) + 50 * math.sin(k * .6), fy, k % 2 == 0, appear)
    darken(im, .25)
    snow(im, t, 200, wind=900, fall=500, big=1.2, streak=1.5)
    # thermometer
    k = eo((t - 32.5) / 1.1)
    temp = int(lerp(-5, -30, k))
    if t > 32.4:
        slam(im, f'{temp}°C', t, 32.5, 760, 260, col=(150, 220, 255))
    if t < 34.5:
        slam(im, 'BAREFOOT', t, 31.3, 330, 170, col=(255, 255, 255), out=34.4)
    else:
        slam(im, 'BOOTS. COATS.', t, 34.6, 300, 120, col=(255, 255, 255))
        slam(im, 'ALL LEFT BEHIND', t, 35.4, 420, 120, col=(255, 60, 50))
    flash(im, 1 - seg(t, 30.1, 30.3))
    return im

def sc_map(A, t):  # 37.0 – 41.6 : bodies scattered
    lt = t - 37.0
    z = lerp(1.0, 1.15, eio(lt / 4.6))
    im = A['map'].resize((int(W * z), int(H * z)), Image.BILINEAR).crop((int(W * (z - 1) / 2), int(H * (z - 1) / 2), int(W * (z - 1) / 2) + W, int(H * (z - 1) / 2) + H))
    d = ImageDraw.Draw(im)
    P = [(760, 470), (660, 680), (560, 880), (430, 1060), (380, 1110)]
    tent, cedar, ravine = P[0], P[3], (330, 1200)
    # dashed path
    k = eo((t - 37.4) / 1.6); pts = []
    for i in range(len(P) - 1):
        for s in np.linspace(0, 1, 20): pts.append((lerp(P[i][0], P[i + 1][0], s), lerp(P[i][1], P[i + 1][1], s)))
    n = int(len(pts) * k)
    for i in range(0, n - 1, 2): d.line((pts[i], pts[i + 1]), fill=(30, 40, 60, 255), width=8)
    def marker(p, txt, tc, red=True):
        a = eo((t - tc) / .25)
        if a <= 0: return
        r = 24 * back((t - tc) / .3)
        d.ellipse((p[0] - r, p[1] - r, p[0] + r, p[1] + r), fill=(220, 30, 30, int(255 * a)) if red else (30, 40, 60, int(255 * a)), outline=(255, 255, 255, int(255 * a)), width=5)
        put(im, text_img(txt, 'oswald', 44, (20, 26, 40, 255), 0, track=3), p[0] + (190 if p[0] < 600 else -190), p[1], 1, a)
    marker(tent, 'TENT', 37.2, red=False)
    for i, (p, tc) in enumerate([((455, 1030), 38.75), ((400, 1080), 38.95), ((610, 780), 39.6), ((700, 600), 39.85), ((520, 960), 40.1)]):
        a = eo((t - tc) / .2)
        if a > 0:
            r = 16 * back((t - tc) / .3); d.ellipse((p[0] - r, p[1] - r, p[0] + r, p[1] + r), fill=(220, 30, 30, int(255 * a)), outline=(255, 255, 255, int(255 * a)), width=4)
    marker(cedar, 'CEDAR TREE', 38.6)
    marker(ravine, 'RAVINE', 40.3)
    put(im, text_img('1.5 KM', 'bebas', 110, (200, 30, 30, 255), 0), 800, 820, 1, eo((t - 38.3) / .3))
    label(im, 'BODIES SCATTERED IN THE SNOW', 300, t, 38.7, size=56, col=(30, 40, 60))
    flash(im, 1 - seg(t, 37.0, 37.15))
    return im

def sc_xray(A, t):  # 41.6 – 48.9
    lt = t - 41.6
    im = Image.new('RGBA', (W, H), (2, 8, 14, 255))
    sc = lerp(1.0, 1.08, lt / 7.3)
    put(im, A['xray'], W / 2, 960, sc * .88, .9)
    # scanline
    sy = 500 + ((lt * 600) % 1200)
    d = ImageDraw.Draw(im); d.rectangle((0, sy - 3, W, sy + 3), fill=(140, 240, 255, 120))
    # fractures appear on "catastrophic internal trauma"
    r = rng(4)
    for i in range(7):
        tc = 44.1 + i * .18
        k = eo((t - tc) / .2)
        if k <= 0: continue
        x, y = 300 + r.random() * 480, 650 + r.random() * 600
        pts = [(x, y)]
        for _ in range(4): x += (r.random() - .5) * 80; y += (r.random() - .3) * 60; pts.append((x, y))
        pts = pts[:max(2, int(len(pts) * k))]
        d.line(pts, fill=(255, 50, 40, 255), width=7)
    if t < 45.9:
        label(im, 'CATASTROPHIC', 300, t, 44.0, size=70, col=(255, 90, 80))
        label(im, 'INTERNAL TRAUMA', 390, t, 44.8, size=70, col=(255, 255, 255), bar=False)
    else:
        # speed lines for "car crash"
        rr = rng(int(t * 10))
        for i in range(30):
            y = rr.random() * H; L = 200 + rr.random() * 500; x = (rr.random() * W * 2 + lt * 3000) % (W + L) - L
            d.line((x, y, x + L, y), fill=(200, 240, 255, 90), width=3)
        slam(im, '= HIGH-SPEED', t, 46.9, 330, 140, col=(255, 255, 255))
        slam(im, 'CAR CRASH', t, 47.5, 470, 170, col=(255, 60, 50))
    dx, dy = shake(t, 47.55, 30)
    flash(im, 1 - seg(t, 41.6, 41.75), (140, 230, 255))
    return im, dx, dy

def sc_skin(A, t):  # 48.9 – 54.0
    im = Image.new('RGBA', (W, H), (10, 14, 20, 255))
    put(im, A['body'], W / 2, 1120, .95, .9)
    d = ImageDraw.Draw(im)
    for i, (txt, tc) in enumerate([('EXTERNAL BRUISES', 50.4), ('VISIBLE WOUNDS', 51.4)]):
        a = eo((t - tc) / .3)
        if a <= 0: continue
        y = 1520 + i * 0
    slam(im, 'BUT THEIR SKIN?', t, 49.0, 330, 130, col=(255, 255, 255), out=50.3)
    if t > 50.3:
        slam(im, 'ZERO', t, 50.35, 360, 260, col=(255, 60, 50))
        label(im, 'EXTERNAL BRUISES', 520, t, 50.9, size=64, col=(220, 235, 245), bar=False)
    # scanning box around body
    k = eo((t - 49.2) / .6)
    if k > 0:
        bx = 330 * k
        for c in [(W / 2 - bx, 700), (W / 2 + bx, 700), (W / 2 - bx, 1580), (W / 2 + bx, 1580)]:
            sx = 1 if c[0] < W / 2 else -1; sy = 1 if c[1] < 1000 else -1
            d.line((c[0], c[1], c[0] + 60 * sx, c[1]), fill=(120, 230, 255, 255), width=6)
            d.line((c[0], c[1], c[0], c[1] + 60 * sy), fill=(120, 230, 255, 255), width=6)
    flash(im, 1 - seg(t, 48.9, 49.05))
    return im

def sc_file(A, t):  # 54.0 – 57.9 : case file, tongue missing
    lt = t - 54.0
    im = Image.new('RGBA', (W, H), (14, 12, 10, 255))
    if A['case'] is not None:
        bg = cover(A['case'], t, lerp(1.1, 1.25, lt / 4), .5, .4); im.alpha_composite(bg); darken(im, .55)
    pap = A['paper'].copy(); d = ImageDraw.Draw(pap)
    lines = ['CRIMINAL CASE  No. 1959', 'AUTOPSY REPORT', '', 'SUBJECT: HIKER, FEMALE, 20', 'LOCATION: RAVINE', 'CAUSE: ????????', '', 'TONGUE:']
    for i, ln in enumerate(lines):
        tc = 54.1 + i * .22
        n = int(len(ln) * cl((t - tc) / .25))
        d.text((80, 110 + i * 96), ln[:n], font=F('type', 58), fill=(30, 26, 22))
    d.line((80, 210, 970, 210), fill=(30, 26, 22), width=3)
    rot = lerp(-4, -2.5, lt / 4)
    put(im, pap, W / 2 + 20, 1050, .92, eo(lt / .25), rot)
    if t > 55.7:  # stamp
        k = seg(t, 55.72, 55.9)
        st = text_img('MISSING', 'bebas', 230, (210, 25, 25, 255), 0)
        box = Image.new('RGBA', (st.width + 40, st.height), (0, 0, 0, 0)); bd = ImageDraw.Draw(box)
        bd.rectangle((6, 30, box.width - 6, box.height - 20), outline=(210, 25, 25, 255), width=12); box.alpha_composite(st, (20, 0))
        put(im, box, W / 2 + 120, 1500, lerp(2.2, 1, eo(k)), eo(k * 1.5) * .92, -12)
    slam(im, 'STRANGER STILL…', t, 54.05, 330, 120, col=(255, 255, 255), out=55.6)
    if t > 55.6: slam(im, 'HER TONGUE', t, 55.62, 330, 150, col=(255, 60, 50))
    dx, dy = shake(t, 55.75, 26)
    flash(im, 1 - seg(t, 54.0, 54.15))
    return im, dx, dy

def trefoil(size, col):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im); c = size / 2; R = size * .48; r = size * .1
    for a in (-90, 30, 150):
        d.pieslice((c - R, c - R, c + R, c + R), a - 30, a + 30, fill=col)
    d.ellipse((c - r * 1.5, c - r * 1.5, c + r * 1.5, c + r * 1.5), fill=(0, 0, 0, 0))
    d.ellipse((c - r, c - r, c + r, c + r), fill=col)
    return im

def sc_rad(A, t):  # 57.9 – 61.6
    lt = t - 57.9
    im = Image.new('RGBA', (W, H), (10, 10, 4, 255))
    pul = .5 + .5 * math.sin(lt * 9)
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((140, 640, 940, 1440), fill=(255, 210, 0, int(60 + 60 * pul)))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(120)))
    if not hasattr(sc_rad, 'tf'): sc_rad.tf = glow(trefoil(560, (255, 214, 0, 255)), 20, 1.4)
    put(im, sc_rad.tf, W / 2, 1040, back(lt / .45) * (1 + .03 * pul), 1, -lt * 12)
    # geiger counter readout
    v = lerp(0.1, 9.8, eo((t - 58.6) / 2.0)) + (rng(int(t * 30)).random() - .5) * .4 * (t > 58.6)
    put(im, text_img(f'{max(0, v):05.2f} µSv/h'.replace('µ', 'u'), 'oswald', 76, (255, 220, 60, 255), 0, shadow=4), W / 2, 1520, 1, eo((t - 58.5) / .3))
    slam(im, 'RADIATION', t, 58.85, 360, 220, col=(255, 214, 0))
    label(im, 'ON THEIR CLOTHES', 520, t, 59.5, size=60, col=(255, 255, 255), bar=False)
    flash(im, 1 - seg(t, 57.9, 58.05), (255, 230, 120))
    return im

def sc_theories(A, t):  # 61.6 – 70.4
    if t < 63.6:  # avalanche
        lt = t - 61.6
        im = mountains(A, t, cam=-1, zoom=1.25)
        d = ImageDraw.Draw(im)
        k = eo((t - 62.3) / 1.1)
        off = 420 * k
        slab = [(250 + off * .3, 900 + off), (720 + off * .3, 860 + off), (760 + off * .3, 960 + off), (210 + off * .3, 1010 + off)]
        d.polygon(slab, fill=(230, 238, 248, 255))
        snow(im, t, 160, wind=-200, fall=400, big=1.6, alpha=k)
        label(im, 'THEORY 1', 300, t, 61.7, size=48)
        slam(im, 'AVALANCHE?', t, 62.3, 430, 190, col=(255, 255, 255))
        flash(im, 1 - seg(t, 61.6, 61.75))
        return im
    if t < 66.5:  # military test
        lt = t - 63.6
        im = mountains(A, t, cam=.5, zoom=1.0)
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
        for i in range(3):
            p = cl((lt - i * .35) / 2.4)
            if p <= 0: continue
            x = 180 + i * 300 + p * 260; y = 1150 - math.sin(p * 2.6) * 760
            gd.ellipse((x - 70, y - 70, x + 70, y + 70), fill=(255, 140, 40, 200))
            for s in range(12):
                q = cl(p - s * .025); xx = 180 + i * 300 + q * 260; yy = 1150 - math.sin(q * 2.6) * 760
                gd.ellipse((xx - 30 + s, yy - 30 + s, xx + 30 - s, yy + 30 - s), fill=(255, 120, 40, 120 - s * 9))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(22)))
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(4)))
        label(im, 'THEORY 2', 300, t, 63.7, size=48)
        slam(im, 'SECRET', t, 63.85, 420, 170, col=(255, 255, 255))
        slam(im, 'WEAPON TEST?', t, 65.4, 560, 170, col=(255, 140, 40))
        put(im, text_img('CLASSIFIED', 'bebas', 120, (220, 30, 30, 255), 0), W / 2 + 160, 1560, lerp(1.8, 1, eo((t - 63.9) / .2)), eo((t - 63.9) / .2) * .85, 10)
        flash(im, 1 - seg(t, 63.6, 63.75))
        return im
    lt = t - 66.5  # something ancient
    im = mountains(A, t, cam=0, zoom=lerp(1.0, 1.3, eio(lt / 3.9)), peak_red=.6 + .4 * math.sin(lt * 3) ** 2)
    darken(im, .3)
    # fog
    snow(im, t, 70, wind=30, fall=30, big=2.2, alpha=.4)
    label(im, 'THEORY 3', 300, t, 66.6, size=48)
    slam(im, 'OR SOMETHING', t, 66.75, 430, 150, col=(255, 255, 255))
    if t > 67.8:
        g = seg(t, 67.85, 68.3); jit = (rng(int(t * 30)).random() - .5) * 50 * (1 - g)
        put(im, text_img('FAR WORSE…', 'bebas', 190, (255, 45, 40, 255), 0, shadow=10), W / 2 + jit, 590, lerp(1.4, 1, eo(g)), eo(g * 2))
    flash(im, 1 - seg(t, 66.5, 66.7), (0, 0, 0))
    return im

def sc_end(A, t):  # 70.4 – end
    lt = t - 70.4
    im = cover(A['tent'], t, lerp(1.6, 1.3, eo(lt / 5.9)), .6, .55)
    darken(im, .45)
    slam(im, 'WHAT REALLY', t, 70.5, 330, 150)
    slam(im, 'HAPPENED?', t, 70.75, 480, 200, col=(255, 60, 50))
    # comment bubble
    a = back((t - 71.5) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 210), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        bd.rounded_rectangle((0, 0, 900, 170), 40, fill=(255, 255, 255, 240)); bd.polygon([(110, 165), (170, 165), (95, 210)], fill=(255, 255, 255, 240))
        b.alpha_composite(text_img('YOUR THEORY? COMMENT!', 'inter', 52, (20, 20, 25, 255), 0), (50, 34))
        put(im, b, W / 2, 770, a)
    a = back((t - 73.25) / .45)
    if a > 0:
        b = Image.new('RGBA', (900, 170), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
        pul = 1 + .04 * math.sin((t - 73.2) * 8)
        bd.rounded_rectangle((0, 0, 900, 170), 85, fill=(225, 25, 25, 255))
        b.alpha_composite(text_img('SUBSCRIBE · THE UNKNOWN', 'inter', 50, (255, 255, 255, 255), 0), (60, 42))
        put(im, b, W / 2, 1010, a * pul)
    flash(im, 1 - seg(t, 70.4, 70.6))
    return im

SCENES = [(0, 2.6, sc_hook), (2.6, 9.0, sc_faces), (9.0, 20.9, sc_mountain), (20.9, 26.9, sc_search), (26.9, 30.1, sc_tent),
          (30.1, 37.0, sc_blizzard), (37.0, 41.6, sc_map), (41.6, 48.9, sc_xray), (48.9, 54.0, sc_skin), (54.0, 57.9, sc_file),
          (57.9, 61.6, sc_rad), (61.6, 70.4, sc_theories), (70.4, 99, sc_end)]

def frame(A, t):
    for a, b, fn in SCENES:
        if a <= t < b: break
    r = fn(A, t)
    dx = dy = 0
    if isinstance(r, tuple): r, dx, dy = r
    im = r
    sdx, sdy = shake(t, 6.45, 22); dx += sdx; dy += sdy
    sdx, sdy = shake(t, 18.9, 16); dx += sdx; dy += sdy
    if dx or dy:
        im = im.transform((W, H), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BILINEAR)
    if fn not in (sc_blizzard, sc_rad, sc_map, sc_file, sc_xray, sc_skin):
        snow(im, t + 3, 50, wind=50, fall=140, alpha=.7)
    draw_caption(im, t)
    arr = np.asarray(im.convert('RGB'), dtype=np.float32)
    arr = arr * A['vig'] + A['grain'][int(t * FPS) % 6]
    # cool letterbox-free fade in/out
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
