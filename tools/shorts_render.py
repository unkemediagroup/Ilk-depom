"""Gerçek fotoğraf/video + kelime kelime altyazılı YouTube Shorts render'ı (1080x1920, 30fps).
Kullanım: python3 shorts_render.py spec.json
spec: {"voice": "ses.mp3", "words": "words.json", "music": "x.mp3", "music_db": -21, "out": "1.video.mp4",
       "hook": {"text": "...", "gold": ["WORD"], "end": 2.4},
       "shots": [{"src": "a.jpg"|"b.mp4", "start": 0, "mode": "cover"|"fit", "zoom": [1.0,1.12], "pan": [0,0,0,-0.05],
                  "focus": [0.5,0.4], "tag": "ELON MUSK", "clip_start": 0}],
       "cta": {"start": 32.9, "text": "SUBSCRIBE", "sub": "BEYOND LUXURY STYLE"}, "highlight": ["MUSK", ...]}"""
import json, sys, os, subprocess, math, re
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 1080, 1920, 30
FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "fonts")
FFMPEG = __import__("imageio_ffmpeg").get_ffmpeg_exe()
GOLD = (255, 198, 58)

spec = json.load(open(sys.argv[1]))
base = os.path.dirname(os.path.abspath(sys.argv[1]))
P = lambda p: p if os.path.isabs(p) else os.path.join(base, p)

def font(name, size, wght=None):
    f = ImageFont.truetype(os.path.join(FONTS, name), size)
    if wght:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f

F_CAP = font("Montserrat.ttf", 86, 900)
F_TAG = font("Montserrat.ttf", 46, 800)
F_HOOK = font("Anton-Regular.ttf", 112)
F_CTA = font("Anton-Regular.ttf", 120)
F_CTA2 = font("Montserrat.ttf", 50, 800)

words = json.load(open(P(spec["words"])))
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", P(spec["voice"])], capture_output=True, text=True).stdout) + 0.6
N = int(dur * FPS)
shots = spec["shots"]
for i, s in enumerate(shots): s["end"] = shots[i + 1]["start"] if i + 1 < len(shots) else dur

def ease(t): return 0.5 - 0.5 * math.cos(math.pi * min(max(t, 0), 1))

# ---------- sources ----------
def cover(img, w, h, focus=(0.5, 0.5)):
    ih, iw = img.shape[:2]; s = max(w / iw, h / ih)
    nw, nh = int(iw * s + 0.5), int(ih * s + 0.5)
    r = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
    x = int((nw - w) * focus[0]); y = int((nh - h) * focus[1])
    return r[y:y + h, x:x + w]

def fit_layout(img, scale_w=1.0):
    bg = cover(img, W // 4, H // 4); bg = cv2.GaussianBlur(bg, (0, 0), 9)
    bg = cv2.resize(bg, (W, H), interpolation=cv2.INTER_LINEAR); bg = (bg * 0.45).astype(np.uint8)
    ih, iw = img.shape[:2]; fw = int(W * scale_w); fh = int(ih * fw / iw)
    fg = cv2.resize(img, (fw, fh), interpolation=cv2.INTER_AREA if fw < iw else cv2.INTER_CUBIC)
    if fw > iw * 1.05:  # hafif keskinleştirme
        bl = cv2.GaussianBlur(fg, (0, 0), 1.2); fg = cv2.addWeighted(fg, 1.5, bl, -0.5, 0)
    y = int(H * 0.40 - fh / 2); x = (W - fw) // 2
    y0, y1 = max(y, 0), min(y + fh, H); x0, x1 = max(x, 0), min(x + fw, W)
    bg[y0:y1, x0:x1] = fg[y0 - y:y1 - y, x0 - x:x1 - x]
    return bg

class Shot:
    def __init__(self, s):
        self.s = s; src = P(s["src"]); self.video = src.lower().endswith((".mp4", ".mov"))
        pad = 1.18  # zoom/pan payı
        self.CW, self.CH = int(W * pad), int(H * pad)
        if self.video:
            self.cap = cv2.VideoCapture(src); self.vfps = self.cap.get(cv2.CAP_PROP_FPS) or 30
            self.cap.set(cv2.CAP_PROP_POS_MSEC, s.get("clip_start", 0) * 1000); self.vt = 0; self.last = None
        else:
            img = cv2.imread(src)
            self.canvas = self.prep(img)
    def prep(self, img):
        if self.s.get("mode", "cover") == "fit":
            c = fit_layout(img, self.s.get("fit_w", 1.0)); return cv2.resize(c, (self.CW, self.CH), interpolation=cv2.INTER_CUBIC)
        return cover(img, self.CW, self.CH, self.s.get("focus", (0.5, 0.5)))
    def frame(self, t):  # t: shot içi saniye
        if self.video:
            want = t * self.s.get("speed", 1.0)
            while self.last is None or self.vt <= want:
                ok, f = self.cap.read()
                if not ok: break
                self.last = f; self.vt += 1 / self.vfps
            src = self.prep(self.last)
        else: src = self.canvas
        L = self.s["end"] - self.s["start"]; p = ease(t / L) if L > 0 else 0
        z0, z1 = self.s.get("zoom", [1.0, 1.1]); z = z0 + (z1 - z0) * p
        pan = self.s.get("pan", [0, 0, 0, 0]); px = pan[0] + (pan[2] - pan[0]) * p; py = pan[1] + (pan[3] - pan[1]) * p
        # src (CW x CH) -> W x H, ölçek: W/CW * z
        sc = W / self.CW * z * 1.0
        M = np.float32([[sc, 0, W / 2 - sc * (self.CW / 2 + px * self.CW)], [0, sc, H / 2 - sc * (self.CH / 2 + py * self.CH)]])
        return cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

# ---------- overlays (PIL RGBA) ----------
def text_img(txt, f, fill, stroke=8, sc=(0, 0, 0)):
    b = f.getbbox(txt, stroke_width=stroke); w, h = b[2] - b[0] + 20, b[3] - b[1] + 20
    im = Image.new("RGBA", (w, h)); d = ImageDraw.Draw(im)
    d.text((10 - b[0], 10 - b[1]), txt, font=f, fill=fill, stroke_width=stroke, stroke_fill=sc); return im

def shadowed(im, r=10, a=150):
    sh = Image.new("RGBA", (im.width + 4 * r, im.height + 4 * r)); al = im.split()[3].point(lambda v: v * a // 255)
    sh.paste((0, 0, 0, 255), (2 * r, 2 * r + 6), al); sh = sh.filter(ImageFilter.GaussianBlur(r)); sh.alpha_composite(im, (2 * r, 2 * r)); return sh

# altyazı grupları: en fazla 3 kelime / 16 karakter, noktalama sonrası böl
groups, cur = [], []
for w in words:
    cur.append(w)
    txt = " ".join(x[2] for x in cur)
    if len(cur) >= 3 or len(txt) > 14 or re.search(r"[.,?!]$", w[2]):
        groups.append(cur); cur = []
if cur: groups.append(cur)
HL = {h.upper() for h in spec.get("highlight", [])}
def clean(w): return re.sub(r"^[-]", "", w).upper()
def caption_layer(t):
    g = next((g for g in groups if g[0][0] - 0.05 <= t < (g[-1][1] + 0.25)), None)
    if not g: return None, 0
    toks = [clean(x[2]) for x in g]
    parts = []
    for i, (x, tok) in enumerate(zip(g, toks)):
        active = x[0] - 0.03 <= t
        key = re.sub(r"[^A-Z]", "", tok)
        col = GOLD if (key in HL or (active and t < x[1] + 0.05)) else (255, 255, 255)
        if not active: col = (255, 255, 255)
        parts.append(text_img(tok, F_CAP, col, 9))
    sp = 18; tw = sum(p.width for p in parts) + sp * (len(parts) - 1)
    lines = [parts] if tw <= W - 80 else [parts[:-1], parts[-1:]] if len(parts) > 1 else [parts]
    lw = [sum(p.width for p in l) + sp * (len(l) - 1) for l in lines]; lh = parts[0].height
    im = Image.new("RGBA", (max(lw) + 20, lh * len(lines) + 10 * len(lines)))
    for li, l in enumerate(lines):
        x = (im.width - lw[li]) // 2
        for p in l: im.alpha_composite(p, (x, li * (lh + 10))); x += p.width + sp
    age = t - g[0][0]; pop = 1 + 0.12 * max(0, 1 - age / 0.12) if age < 0.12 else 1.0
    return shadowed(im), pop

tag_cache = {}
def tag_img(txt):
    if txt in tag_cache: return tag_cache[txt]
    b = F_TAG.getbbox(txt); w, h = b[2] - b[0] + 56, b[3] - b[1] + 34
    im = Image.new("RGBA", (w, h)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 14, fill=(12, 12, 12, 225), outline=GOLD + (255,), width=4)
    d.text((28 - b[0], 17 - b[1]), txt, font=F_TAG, fill=GOLD)
    tag_cache[txt] = shadowed(im); return tag_cache[txt]

hook = spec.get("hook")
hook_imgs = None
if hook:
    lines = hook["text"].split("|"); hook_imgs = []
    for ln in lines:
        ws = ln.split(); ims = [text_img(w, F_HOOK, GOLD if w.strip("?!.,") in hook.get("gold", []) else (255, 255, 255), 10) for w in ws]
        tw = sum(i.width for i in ims) + 14 * (len(ims) - 1); row = Image.new("RGBA", (tw, max(i.height for i in ims))); x = 0
        for i in ims: row.alpha_composite(i, (x, 0)); x += i.width + 14
        hook_imgs.append(shadowed(row))

cta = spec.get("cta")
def paste(frame_rgba, im, cx, cy, scale=1.0, alpha=1.0):
    if scale != 1.0: im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.LANCZOS)
    if alpha < 1.0:
        a = im.split()[3].point(lambda v: int(v * alpha)); im = im.copy(); im.putalpha(a)
    frame_rgba.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))

# alt/üst karartma (okunabilirlik) + vinyet
yy = np.linspace(0, 1, H)[:, None]
shade = (1 - 0.55 * np.clip((yy - 0.52) / 0.48, 0, 1) ** 1.3) * (1 - 0.35 * np.clip((0.18 - yy) / 0.18, 0, 1))
xx = np.linspace(-1, 1, W)[None, :]; vig = 1 - 0.22 * (xx ** 2) * np.ones((H, 1))
SH = (shade * vig).astype(np.float32)[..., None]

shot_objs = [None] * len(shots)
tmp_video = P(spec["out"]) + ".noaudio.mp4"
proc = subprocess.Popen([FFMPEG, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                         "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", tmp_video], stdin=subprocess.PIPE)
for n in range(N):
    t = n / FPS
    si = max(i for i, s in enumerate(shots) if s["start"] <= t)
    if shot_objs[si] is None: shot_objs[si] = Shot(shots[si])
    s = shots[si]; lt = t - s["start"]
    fr = shot_objs[si].frame(lt).astype(np.float32)
    # geçiş: kesme anında kısa "punch" + parlama
    if lt < 0.12 and si > 0:
        k = 1 - lt / 0.12; fr = fr + (255 - fr) * 0.35 * k
    fr = np.clip(fr * SH, 0, 255).astype(np.uint8)
    img = Image.fromarray(cv2.cvtColor(fr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    if s.get("tag") and lt > 0.15:
        a = min(1, (lt - 0.15) / 0.2); paste(img, tag_img(s["tag"]), W / 2, 330 + 30 * (1 - a), 1.0, a)
    if hook_imgs and t < hook["end"]:
        a = min(1, t / 0.15, (hook["end"] - t) / 0.2); y = 360
        for i, h_im in enumerate(hook_imgs):
            d = max(0, min(1, (t - i * 0.12) / 0.18)); paste(img, h_im, W / 2, y, 0.85 + 0.15 * d, a * d); y += h_im.height - 20
    if cta and t >= cta["start"]:
        lt2 = t - cta["start"]; a = min(1, lt2 / 0.25)
        paste(img, shadowed(text_img(cta["text"], F_CTA, GOLD, 10)), W / 2, 330, 0.9 + 0.1 * a, a)
        paste(img, shadowed(text_img(cta["sub"], F_CTA2, (255, 255, 255), 6)), W / 2, 440, 1, a)
    cap, pop = caption_layer(t)
    if cap is not None: paste(img, cap, W / 2, H * 0.70, pop)
    proc.stdin.write(cv2.cvtColor(np.asarray(img.convert("RGB")), cv2.COLOR_RGB2BGR).tobytes())
proc.stdin.close(); proc.wait()

# ses: anlatım (-14 LUFS civarı) + müzik (ducking)
md = spec.get("music_db", -20)
af = (f"[0:a]loudnorm=I=-14:TP=-1.5:LRA=11,apad=pad_dur=0.6,asplit=2[v][vs];"
      f"[1:a]volume={md}dB,afade=t=in:d=0.8,afade=t=out:st={dur-1.6:.2f}:d=1.6[m];"
      f"[m][vs]sidechaincompress=threshold=0.05:ratio=6:attack=20:release=350[md];"
      f"[v][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]")
subprocess.run([FFMPEG, "-v", "error", "-y", "-i", P(spec["voice"]), "-ss", str(spec.get("music_start", 0)), "-i", P(spec["music"]), "-i", tmp_video,
                "-filter_complex", af, "-map", "2:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                "-t", f"{dur:.2f}", "-movflags", "+faststart", P(spec["out"])], check=True)
os.remove(tmp_video); print("OK", P(spec["out"]), f"{dur:.2f}s")
