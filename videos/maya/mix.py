# Dark tribal-ambient score + cinematic hits for the Maya short, mixed under the voice -> out/mix.wav
# No foley: only music, low wind bed and impact/riser accents.
import os, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000; DUR = 82.68; N = int((DUR + 1) * SR)
rng = np.random.default_rng(7)
t = np.arange(N) / SR

def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x, axis=0)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x, axis=0)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x, axis=0)
def hz(n): return 440 * 2 ** ((n - 69) / 12)
def add(buf, x, at, g=1., pan=0.):
    i = int(at * SR); x = x[:max(0, len(buf) - i)]
    if x.ndim == 1: x = np.stack([x * (1 - pan) ** .5 * 1.0, x * (1 + pan) ** .5 * 1.0], 1) / 1.2
    buf[i:i + len(x)] += x * g

mus = np.zeros((N, 2))
# --- drone pad: D minor progression, slow swells
PROG = [(0, [33, 45, 48, 52]), (5.9, [29, 41, 45, 48]), (11.8, [31, 43, 46, 50]), (15.5, [33, 45, 48, 52]),
        (25.6, [28, 40, 44, 47]), (27.9, [33, 45, 48, 52]), (36.7, [29, 41, 45, 48]), (41.8, [26, 38, 41, 45]),
        (48.3, [28, 40, 44, 47]), (53.4, [33, 45, 48, 51]), (59.7, [29, 41, 44, 48]), (62.6, [31, 43, 46, 50]),
        (68.3, [28, 40, 44, 47]), (73.4, [29, 41, 44, 48]), (76.75, [33, 45, 48, 52]), (DUR + 1, [])]
for (a, notes), (b, _) in zip(PROG[:-1], PROG[1:]):
    L = int((b - a + 1.5) * SR); tt = np.arange(L) / SR
    env = np.minimum(1, tt / 1.2) * np.minimum(1, np.maximum(0, (b - a + 1.5 - tt)) / 1.5)
    x = np.zeros(L)
    for k, n in enumerate(notes):
        f = hz(n)
        for det in (-.12, .12):
            ph = rng.random() * 6.28
            saw = sum(np.sin(2 * np.pi * f * (1 + det / 100) * h * tt + ph * h) / h for h in range(1, 7))
            x += saw * (.5 if k == 0 else .28)
    x = lp(x, 900) * env * (0.85 + .15 * np.sin(2 * np.pi * .13 * tt))
    add(mus, x, max(0, a - .3), .055, 0)
# --- sub drone
mus[:, 0] += .05 * np.sin(2 * np.pi * hz(26) * t) * np.minimum(1, t / 2); mus[:, 1] += .05 * np.sin(2 * np.pi * hz(26) * t + .3) * np.minimum(1, t / 2)

# --- eerie music-box / piano notes (sparse)
def bell(f, d=3.):
    tt = np.arange(int(d * SR)) / SR
    return sum(np.sin(2 * np.pi * f * m * tt) * a * np.exp(-tt * (2.2 + m)) for m, a in [(1, 1), (2.01, .4), (3.02, .18), (4.2, .08)])
MEL = [69, 72, 76, 74, 72, 69, 67, 64]
for i, tt0 in enumerate(np.arange(5.9, 53, 1.8)):
    if 41.8 <= tt0 < 48.3: continue
    add(mus, bell(hz(MEL[i % len(MEL)])), tt0, .05, (-.4 if i % 2 else .4))

# --- heartbeat pulse during the autopsy part
def thump(f0=55, d=.35, g=1.):
    tt = np.arange(int(d * SR)) / SR; f = f0 * (1 + 1.5 * np.exp(-tt * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 11) * g
def tom(f0=90, d=.5):
    tt = np.arange(int(d * SR)) / SR; f = f0 * (1 + .6 * np.exp(-tt * 25))
    return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7))
beat = .5
PAT = [(0, 1, 70), (.75, .5, 95), (1.0, .8, 70), (1.5, .5, 110), (1.75, .4, 95)]
for s0, s1, g in [(36.7, 48.3, .14), (48.3, 53.4, .18), (53.4, 68.3, .24)]:
    bt = s0
    while bt < s1 - .1:
        for off, v, f in PAT:
            if bt + off < s1: add(mus, tom(f), bt + off, g * v, (-.3 if f > 80 else .2))
        bt += 2.0 if s0 < 53 else 1.6

# --- impacts on the slams
def boom(d=2.2):
    tt = np.arange(int(d * SR)) / SR
    f = 32 + 70 * np.exp(-tt * 9)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6)
    nz = lp(rng.normal(0, 1, len(tt)), 1800) * np.exp(-tt * 9) * .35
    return np.tanh((s + nz) * 1.6)
HITS = [(.1, 1), (.4, .7), (5.9, .5), (12.78, 1), (15.5, .5), (20.4, .6), (23.8, .8), (25.7, 1), (29.0, .4), (29.6, .4), (30.4, .4),
        (34.6, .9), (36.7, .5), (41.85, 1), (48.7, .6), (50.4, 1), (53.4, .6), (57.05, 1.1), (60.56, 1), (63.4, .6), (69.3, .6), (71.6, .6), (73.5, .8), (74.0, 1), (76.8, .8)]
for at, g in HITS: add(mus, boom(), at, .32 * g)

# --- risers / reverse swells into big moments
def riser(d):
    tt = np.arange(int(d * SR)) / SR; x = rng.normal(0, 1, len(tt))
    x = bp(x, 400, 5000) * (tt / d) ** 2.5
    return x
for at, d in [(12.78, 1.4), (25.7, 1.6), (41.85, 1.8), (57.05, 1.6), (68.3, 2.0), (74.0, 1.4)]:
    add(mus, riser(d), at - d, .1)

# --- wind bed (louder in the blizzard)
wind = lp(hp(rng.normal(0, 1, N), 150), 700)
wenv = .03 + .05 * np.clip((t - 41.8) * 2, 0, 1) * np.clip((48.3 - t) * 2, 0, 1)
wenv *= 1 + .35 * np.sin(2 * np.pi * .21 * t)
mus[:, 0] += wind * wenv; mus[:, 1] += np.roll(wind, 2400) * wenv

# --- end fade
mus *= np.clip((DUR + .2 - t) / 2.5, 0, 1)[:, None]

# --- voice + ducking
v, vsr = sf.read(os.path.join(HERE, 'voice16.wav')) if False else (None, None)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(HERE, 'voice.mp3'), '-ar', str(SR), '-ac', '1', os.path.join(HERE, 'out', 'voice48.wav')], check=True)
v, _ = sf.read(os.path.join(HERE, 'out', 'voice48.wav'))
voice = np.zeros(N); voice[:len(v)] = v[:N]
voice = hp(voice, 80)
env = np.abs(voice); env = lp(env, 6)
env = env / (env.max() + 1e-9)
duck = 1 - .45 * np.clip(env * 4, 0, 1)
mix = mus * duck[:, None] * .33 + np.stack([voice, voice], 1) * 1.0
mix /= np.abs(mix).max() * 1.05
sf.write(os.path.join(HERE, 'out', 'mix_raw.wav'), mix.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(HERE, 'out', 'mix_raw.wav'), '-af', 'loudnorm=I=-14:TP=-1.2:LRA=9',
                '-ar', str(SR), os.path.join(HERE, 'out', 'mix.wav')], check=True)
print('mix ok')
