# Score, foley and voice for "Did you know your body can heal itself?" → out/mix.wav (48 kHz stereo)
# Run from anywhere; LIB is the library root (two levels up in clone mode).
import json, os, sys
import numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, LIB); os.chdir(LIB)
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, bp, lp, hp, noise, brown, click, thump, whoosh, compress, limit, t_, env_exp

ev = json.load(open(os.path.join(HERE, 'events.json')))
DUR = ev['dur']; EV = ev['ev']
N = int(DUR * SR) + SR
music = np.zeros((N, 2), np.float32); fx = np.zeros((N, 2), np.float32); vox = np.zeros((N, 2), np.float32)
S.seed(7)

# ---------------- score: 80 bpm, bar = 3 s, D major ----------------
Q = .75; BAR = 3.0
CH = {'D': ['D', 'F#', 'A'], 'Bm': ['B', 'D', 'F#'], 'G': ['G', 'B', 'D'], 'A': ['A', 'C#', 'E']}
PROG = ['D', 'D', 'D', 'Bm', 'G', 'A', 'D', 'Bm', 'G', 'D', 'G', 'A', 'Bm', 'G', 'A', 'D', 'D']   # one chord per bar
SILENCE = (25.6, 27.0)
def put(buf, x, at, g=1.0, pan=0.0):
    if SILENCE[0] - .05 < at < SILENCE[1] - .05: return       # nothing starts inside the breath
    add(buf, x, at, g, pan)
def kal(p, at, v=.7, g=.5, pan=-.15): put(music, P.pluck('kalimba', p, 2.2, vel=v), at, g, pan)
MOTIF = [('D5', 0), ('F#5', 1), ('A5', 2), ('F#5', 3), ('E5', 4), ('A4', 5), ('D5', 6)]
def motif(t0, g=.5, inst='kal'):
    for p, b in MOTIF:
        if inst == 'kal': kal(p, t0 + b * Q, .72, g)
        else: put(music, S.note('flute', p, Q * (2.6 if b == 6 else .95), vel=.5, attack=.04), t0 + b * Q, g, .2)
# kalimba alone: bars 0-1, again after the silence (bar 9)
motif(0.0); motif(27.0, .55)
# harp arpeggios in 8ths + soft upright chords
def harp_bar(b, g=.32):
    ch = CH[PROG[b]]; seq = [ch[0] + '4', ch[1] + '4', ch[2] + '4', ch[0] + '5'] * 2
    for i, p in enumerate(seq):
        put(music, S.note('harp', p, .9, vel=.5 + .1 * (i % 2 == 0)), b * BAR + i * Q / 2, g, .25)
def piano_bar(b, g=.22, bass=False):
    ch = CH[PROG[b]]
    for k, p in enumerate([ch[0] + '3', ch[1] + '4', ch[2] + '4']): put(music, S.note('upright', p, 2.6, vel=.42), b * BAR + k * .02, g, -.1)
    if bass: put(music, S.note('upright', ch[0] + '2', 2.8, vel=.55), b * BAR, g * 1.1, 0)
for b in (2, 3, 4): harp_bar(b); piano_bar(b)
for b in (5, 6, 7): harp_bar(b); piano_bar(b, bass=True)
for b in (5, 6, 7):                                                    # flute: long chord tones
    ch = CH[PROG[b]]; put(music, S.note('flute', ch[1] + '5', 2.7, vel=.45, attack=.25), b * BAR + .05, .32, .2)
# bar 8 (24-27): harp thins out before the breath
ch = CH['G']
for i, p in enumerate([ch[0] + '4', ch[1] + '4', ch[2] + '4']): put(music, S.note('harp', p, 1.2, vel=.42), 24 + i * Q / 2, .26, .25)
# first sound after the silence: one glockenspiel note with the voice
add(music, S.note('glockenspiel', 'A6', 2.5, vel=.55), 27.0, .32, .1)
# regrowth: the music rebuilds bar by bar (bars 10-11), glockenspiel ticks on the new lobes
harp_bar(10, .28); harp_bar(11, .32); piano_bar(11)
for tt, p in [(32.25, 'D6'), (33.75, 'F#6'), (35.25, 'A6')]: add(music, S.note('glockenspiel', p, 1.5, vel=.45), tt, .26, .15)
# full but gentle: bars 12-14, flute restates the motif
for b in (12, 13, 14): harp_bar(b, .3); piano_bar(b, bass=True)
motif(36.0, .34, inst='flute')
# ending: open D chord ringing out under the title; the brush lift gets the last glockenspiel
for k, p in enumerate(['D3', 'A3', 'F#4', 'A4', 'D5']): add(music, S.note('upright', p, 5.0, vel=.45), 45.0 + k * .06, .24, -.1 + k * .05)
for k, p in enumerate(['D4', 'A4', 'D5', 'F#5']): add(music, S.note('harp', p, 4.0, vel=.45), 45.0 + .3 + k * .18, .26, .25)
add(music, S.note('flute', 'A5', 3.5, vel=.4, attack=.4), 45.2, .22, .2)
kal('D6', 47.3, .6, .4)
music = S.room(music, size=.5, mix=.2)

# ---------------- foley ----------------
rng = np.random.default_rng(5)
def pencil(d=.35):
    n = noise(d); g = (rng.random(len(n)) < .02).astype(float); g = np.convolve(g, np.hanning(240), 'same')
    return bp(n, 2500, 7000) * (.25 + g) * np.minimum(1, t_(d) / .02) * np.minimum(1, (d - t_(d)) / .05)
def brushy(d, soft=0):
    n = bp(noise(d), 700, 4200 if not soft else 2400); tt = t_(d)
    trem = .7 + .3 * np.sin(2 * np.pi * (5 + rng.random() * 2) * tt)
    return n * trem * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** .6
def rustle(d):
    tt = t_(d); f = bp(noise(d), 400, 3000) * np.sin(np.pi * tt / d) ** 1.2
    return f * (.6 + .4 * np.abs(np.sin(2 * np.pi * 3.1 * tt)))
def mist(d): tt = t_(d); return lp(noise(d), 1400) * np.sin(np.pi * tt / d) ** 1.5
def crack():
    x = np.zeros(int(.5 * SR)); x[:len(click(1.3))] += click(1.3, 1.0)
    n = hp(noise(.18), 1500) * env_exp(.18, .03); x[600:600 + len(n)] += n * .8
    return x
for e in EV:
    t, ty, d = e['t'], e['type'], e.get('d', .35)
    pan = float(rng.uniform(-.3, .3))
    if ty == 'pencil': add(fx, pencil(d), t, .10, pan)
    elif ty == 'brush': add(fx, brushy(d, e.get('soft', 0)), t, .07 if e.get('soft') else .09, pan)
    elif ty == 'slash': add(fx, whoosh(.3, .8 if e.get('soft') else 1), t, .16 if e.get('soft') else .3, -.2)
    elif ty == 'tick': add(fx, click(2.2, .5), t, .05, pan)
    elif ty == 'crack': add(fx, crack(), t, .45, 0)
    elif ty == 'knock': add(fx, thump(.7, 160), t, .3, 0)
    elif ty == 'rustle': add(fx, rustle(d), t, .1, 0)
    elif ty == 'mist': add(fx, mist(d), t, .14, -.1)
# room tone under everything (it is all that is left in the breath)
bed = lp(brown(DUR + 1), 600); bed = bed / (np.abs(bed).max() + 1e-9) * .012
fx[:len(bed), 0] += bed[:N]; fx[:len(bed), 1] += bed[:N]

# ---------------- voice ----------------
duck = np.zeros(N)
for e in EV:
    if e['type'] != 'vo': continue
    y, sr = sf.read(os.path.join(HERE, 'voice', e['id'] + '.wav'), dtype='float32')
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR); y = compress(y / (np.abs(y).max() + 1e-9) * .9, thr=.12, ratio=4)
    add(vox, y, e['t'], 1.0, 0)
    a, b = int(e['t'] * SR), int((e['t'] + len(y) / SR) * SR); duck[max(0, a - 2400):b + 7200] = 1
k = np.hanning(int(.25 * SR)); k /= k.sum(); duck = np.convolve(duck, k, 'same')
music *= (1 - .45 * duck)[:, None]                                  # about -5 dB under the voice

# balance by RMS: voice ~10 dB over the music
def rms(x): x = x[np.abs(x).max(1) > 1e-4]; return float(np.sqrt((x ** 2).mean())) if len(x) else 1e-9
vg = (rms(music) * 10 ** (10 / 20)) / rms(vox)
mix = music + fx + vox * vg
mix = mix / (np.abs(mix).max() + 1e-9) * 10 ** (7 / 20)             # push about 7 dB into a stereo-linked limiter
from scipy.ndimage import maximum_filter1d, uniform_filter1d
n_ = int(.005 * SR); m_ = maximum_filter1d(np.abs(mix).max(1), size=2 * n_ + 1)
g_ = uniform_filter1d(np.minimum(1, .9 / np.maximum(m_, 1e-9)), size=n_); mix = mix * g_[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix[:int(DUR * SR)].astype(np.float32), SR)
print('mix.wav', round(DUR, 2), 's; voice gain', round(vg, 2))
print('\n'.join(S.credits(['harp', 'upright', 'flute', 'glockenspiel'])))
