# Dark tribal-ambient score + cinematic hits for the cave short, mixed under the voice -> out/mix.wav
# No foley: only music, low wind bed and impact/riser accents.
import os, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000; DUR = 77.7; N = int((DUR + 1) * SR)
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
PROG = [(0.0, [26, 38, 41, 45]), (5.9, [22, 34, 38, 41]), (14.6, [24, 36, 39, 43]), (31.9, [21, 33, 36, 40]), (49.2, [26, 38, 41, 45]), (62.4, [22, 34, 38, 41]), (71.9, [24, 36, 39, 43]), (DUR + 1, [])]
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
def ping(f=1180, d=3.5):
    tt = np.arange(int(d * SR)) / SR
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.2) * np.minimum(1, tt / .01)
    out = x.copy()
    for k, g in [(.32, .35), (.71, .2), (1.15, .1)]:
        i = int(k * SR); out[i:] += x[:len(x) - i] * g
    return out

MEL = [62, 65, 69, 67, 65, 62, 60, 57]
for i, tt0 in enumerate([t_ for t_ in np.arange(5.9, 65.7, 1.7)]):
    add(mus, bell(hz(MEL[i % len(MEL)] + 12)), tt0, .035, (-.4 if i % 2 else .4))

# --- heartbeat pulse during the autopsy part
def thump(f0=55, d=.35, g=1.):
    tt = np.arange(int(d * SR)) / SR; f = f0 * (1 + 1.5 * np.exp(-tt * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 11) * g
def tom(f0=90, d=.5):
    tt = np.arange(int(d * SR)) / SR; f = f0 * (1 + .6 * np.exp(-tt * 25))
    return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7))
beat = .5
PAT = [(0, 1, 70), (.75, .5, 95), (1.0, .8, 70), (1.5, .5, 110), (1.75, .4, 95)]
for s0, s1, g in []:
    bt = s0
    while bt < s1 - .1:
        for off, v, f in PAT:
            if bt + off < s1: add(mus, tom(f), bt + off, g * v, (-.3 if f > 80 else .2))
        bt += 2.0

# --- impacts on the slams
def boom(d=2.2):
    tt = np.arange(int(d * SR)) / SR
    f = 32 + 70 * np.exp(-tt * 9)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6)
    nz = lp(rng.normal(0, 1, len(tt)), 1800) * np.exp(-tt * 9) * .35
    return np.tanh((s + nz) * 1.6)
HITS = [(0.2, 1.0), (16.7, 0.7), (20.46, 0.7), (23.7, 1.0), (26.32, 0.7), (29.38, 0.7), (32.36, 1.0), (34.5, 0.7), (36.54, 0.7), (43.36, 1.0), (46.06, 0.7), (50.7, 0.7), (55.08, 1.0), (57.48, 0.7), (60.66, 0.7), (64.62, 1.0), (67.88, 0.7), (71.95, 0.7)]
for at, g in HITS: add(mus, boom(), at, .32 * g)

# --- risers / reverse swells into big moments
def riser(d):
    tt = np.arange(int(d * SR)) / SR; x = rng.normal(0, 1, len(tt))
    x = bp(x, 400, 5000) * (tt / d) ** 2.5
    return x
for at, d in [(26.32, 1.4), (36.54, 1.4), (55.08, 1.4), (67.88, 1.4)]:
    add(mus, riser(d), at - d, .1)

# --- wind bed (louder in the blizzard)
wind = lp(hp(rng.normal(0, 1, N), 150), 700)
wenv = .04 + 0 * t
wenv *= 1 + .35 * np.sin(2 * np.pi * .21 * t)
mus[:, 0] += wind * wenv; mus[:, 1] += np.roll(wind, 2400) * wenv

# --- low hum (Taos)
hum_env = 0 * t
hum = (np.sin(2 * np.pi * 42 * t) + .5 * np.sin(2 * np.pi * 63.3 * t)) * hum_env * .05
mus[:, 0] += hum; mus[:, 1] += hum
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
