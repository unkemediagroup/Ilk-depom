# Dark ambient score + cinematic hits for the Dyatlov short, mixed under the voice -> out/mix.wav
# No foley: only music, low wind bed and impact/riser accents.
import os, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000; DUR = 76.3; N = int((DUR + 1) * SR)
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
PROG = [(0, [38, 50, 53, 57]), (9, [38, 50, 53, 57]), (20.9, [34, 46, 50, 53]), (30.1, [31, 43, 46, 50]),
        (37, [33, 45, 49, 52]), (41.6, [38, 50, 53, 57]), (48.9, [34, 46, 50, 53]), (54, [31, 43, 46, 50]),
        (57.9, [33, 45, 49, 52]), (61.6, [38, 50, 53, 56]), (66.5, [34, 46, 49, 53]), (70.4, [38, 50, 53, 57]), (DUR + 1, [])]
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
MEL = [74, 77, 76, 72, 74, 69, 70, 69]
for i, tt0 in enumerate(np.arange(9.0, 61, 2.4)):
    if 41.6 <= tt0 < 48.9 or 30.1 <= tt0 < 37: continue
    add(mus, bell(hz(MEL[i % len(MEL)])), tt0, .05, (-.4 if i % 2 else .4))

# --- heartbeat pulse during the autopsy part
def thump(f0=55, d=.35, g=1.):
    tt = np.arange(int(d * SR)) / SR; f = f0 * (1 + 1.5 * np.exp(-tt * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 11) * g
bt = 37.2
while bt < 61.4:
    add(mus, thump(), bt, .2); add(mus, thump(50, .3), bt + .26, .12)
    bt += .92 if bt < 54 else .78

# --- impacts on the slams
def boom(d=2.2):
    tt = np.arange(int(d * SR)) / SR
    f = 32 + 70 * np.exp(-tt * 9)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6)
    nz = lp(rng.normal(0, 1, len(tt)), 1800) * np.exp(-tt * 9) * .35
    return np.tanh((s + nz) * 1.6)
HITS = [(.12, 1), (2.62, .8), (6.42, 1.1), (15.15, .6), (18.85, 1), (25.3, .7), (26.9, .8), (30.1, .6), (32.5, .6), (41.6, .7),
        (47.5, 1), (50.35, .9), (55.72, 1), (58.85, .8), (61.6, .7), (63.85, .7), (66.75, 1), (70.5, .9)]
for at, g in HITS: add(mus, boom(), at, .32 * g)

# --- risers / reverse swells into big moments
def riser(d):
    tt = np.arange(int(d * SR)) / SR; x = rng.normal(0, 1, len(tt))
    x = bp(x, 400, 5000) * (tt / d) ** 2.5
    return x
for at, d in [(6.42, 1.4), (18.85, 1.6), (41.6, 1.2), (61.6, 2.0), (70.4, 1.5)]:
    add(mus, riser(d), at - d, .1)

# --- wind bed (louder in the blizzard)
wind = lp(hp(rng.normal(0, 1, N), 150), 700)
wenv = .035 + .06 * np.clip((t - 30.1) * 2, 0, 1) * np.clip((37 - t) * 2, 0, 1)
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
