# Score under the user's voice for "Nobody Is Coming to Save You" → out/mix.wav. No carving foley (user rule).
import os, sys, json
import numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, LIB); os.chdir(LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, thump, compress
from scipy.ndimage import maximum_filter1d, uniform_filter1d

DUR = 29.6; N = int(DUR * SR) + SR
mus = np.zeros((N, 2), np.float32); vox = np.zeros((N, 2), np.float32)
S.seed(11)
def n(inst, p, at, dur, vel=.6, g=.5, pan=0., **kw): add(mus, S.note(inst, p, dur, vel=vel, **kw), at, g, pan)
def hit(inst, at, vel=.8, g=.6, pan=0., var=None): add(mus, S.hit(inst, var, vel), at, g, pan)
B = .625                                                   # 96 bpm
# 0–10.3: night drone, a slow heartbeat on the frame drum
n('contrabass', 'D2', 0.0, 10.6, .55, .55, attack=.8); n('cellos', 'A2', 0.3, 10.2, .45, .35, -.2, attack=1.2); n('cellos', 'D3', 3.0, 7.4, .4, .3, .2, attack=1.5)
for k in range(8): hit('frame_drum', 2.0 + k * 2 * B * 1.6, .45, .25, -.1)
n('violas', 'F3', 6.9, 3.6, .4, .25, .3, attack=1.0)                       # "the harsh truth": a minor third creeps in
# 10.3–14.2: the turn — strings rise on "let it set you free"
n('contrabass', 'Bb1', 10.4, 2.0, .5, .5, attack=.4); n('cellos', 'F3', 10.4, 2.0, .45, .35, attack=.5)
for p, g in [('D3', .5), ('A3', .4), ('F4', .3)]: n('cellos' if p < 'F' else 'violas', p, 12.46, 1.9, .6, g, attack=.25)
n('violins', 'A4', 12.46, 1.9, .55, .3, .25, attack=.3); n('violins', 'D5', 12.9, 1.5, .55, .26, -.25, attack=.3)
hit('timpani', 12.9, .6, .45); hit('gong2', 13.26, .35, .2, 0, 'small')
# 14.3–18.0: pizzicato pulse, building
for k in range(12):
    t = 14.32 + k * B / 2 * 1.2
    n('cellos_pizz', ['D3', 'D3', 'A3', 'D3', 'F3', 'D3'][k % 6], t, .4, .6, .35, -.15)
    if k % 2 == 0: n('contrabass_pizz', 'D2', t, .5, .65, .4)
n('violas', 'A3', 14.3, 3.7, .45, .25, .2, attack=.8); n('violins', 'D4', 16.0, 2.0, .45, .2, -.2, attack=.6)
# 18.0–22.3: the grind — spiccato drive, a bass-drum hit on every "stop"/"start"
CH = [('D', ['D3', 'F3', 'A3']), ('Bb', ['Bb2', 'D3', 'F3']), ('F', ['F3', 'A3', 'C4']), ('C', ['C3', 'E3', 'G3'])]
for k in range(int((22.3 - 18.0) / (B / 2))):
    t = 18.0 + k * B / 2; ch = CH[min(3, int((t - 18.0) / 1.08))][1]
    n('cellos_spic', ch[k % 3], t, .25, .62 + .1 * (k % 2 == 0), .3, -.1)
    if k % 4 == 0: n('contrabass_pizz', ch[0][:-1] + '2', t, .5, .7, .4)
for t in (18.16, 19.22, 20.84): hit('gran_cassa', t, .85, .55); hit('timpani', t, .7, .35)
for i, (nm, ch) in enumerate(CH): n('horn', ch[2], 18.0 + i * 1.08, 1.1, .5, .25, .2, attack=.15)
# 22.4–25.6: the summit — full strings, a timpani roll into "hero", the tam-tam on it
hit('gran_cassa', 22.44, .85, .55)
for p, g, pan in [('D2', .5, 0), ('D3', .4, -.2), ('A3', .35, .2), ('D4', .3, -.3), ('F4', .28, .3), ('A4', .26, 0)]:
    n('contrabass' if p == 'D2' else 'cellos' if p in ('D3', 'A3') else 'violins', p, 22.44, 3.4, .6, g, pan, attack=.4)
n('horn', 'D4', 23.4, 2.2, .6, .35, .1, attack=.3); n('horn', 'A3', 23.4, 2.2, .55, .3, -.1, attack=.3)
for k in range(14): hit('timpani', 23.4 + k * .057, .35 + k * .035, .3)
hit('gong', 25.18, .7, .4); hit('gran_cassa', 25.18, .9, .55)
n('violins', 'F#5', 25.18, 1.2, .6, .3, -.2, attack=.1); n('violins', 'D5', 25.18, 1.2, .6, .3, .2, attack=.1)
# 26.1–27.6: the lift — low hit on the strike, then near silence before the shout
n('contrabass', 'D2', 26.1, 1.2, .5, .4, attack=.2)
hit('gran_cassa', 26.48, .9, .55); hit('timpani', 26.48, .8, .4)
# 27.7: the biggest hit on "Now", open D chord ringing to the end
hit('gran_cassa', 27.7, 1.0, .65); hit('timpani', 27.7, .9, .45); hit('gong', 27.7, .8, .45)
for p, g, pan in [('D2', .55, 0), ('D3', .45, -.2), ('A3', .4, .2), ('D4', .32, -.3), ('F#4', .3, .3), ('A4', .3, 0), ('D5', .28, -.1)]:
    n('contrabass' if p == 'D2' else 'cellos' if p in ('D3', 'A3') else 'violins', p, 27.7, 1.9, .7, g, pan, attack=.05)
n('horn', 'D4', 27.7, 1.9, .7, .4, .1, attack=.05); n('horn', 'A3', 27.7, 1.9, .65, .35, -.1, attack=.05)
hit('timpani', 28.48, .6, .3); hit('timpani', 28.8, .6, .3); hit('gran_cassa', 29.08, .85, .5)
mus = S.room(mus, size=.6, mix=.22)
# low thump when the stone lands overhead (the only effect)
add(mus, thump(.9, 70), 26.5, .35, 0)
# breath before "Now": pull the music down 27.1→27.65
tt = np.arange(N) / SR
mus *= np.where((tt > 27.1) & (tt < 27.68), 1 - .85 * np.clip((tt - 27.1) / .3, 0, 1), 1)[:, None]
mus *= np.clip((DUR - tt) / .35, 0, 1)[:, None]                       # short fade at the very end

# the user's voice, as delivered (light leveling only)
y, sr = sf.read(os.path.join(HERE, 'voice', 'vo.wav'), dtype='float32')
if y.ndim > 1: y = y.mean(1)
if sr != SR: y = soxr.resample(y, sr, SR)
y = compress(y / (np.abs(y).max() + 1e-9) * .9, thr=.25, ratio=2.5)
add(vox, y, 0.0, 1.0, 0)
env = uniform_filter1d(maximum_filter1d(np.abs(vox[:, 0]), int(.05 * SR)), int(.12 * SR))
duck = np.clip(env / .05, 0, 1)
mus *= (1 - .6 * duck)[:, None]                                      # about -8 dB under the voice
def rms(x): x = x[np.abs(x).max(1) > 1e-4]; return float(np.sqrt((x ** 2).mean()))
vg = rms(mus) * 10 ** (10 / 20) / rms(vox)
mix = mus + vox * vg
mix = mix / np.abs(mix).max() * 10 ** (6 / 20)
m_ = maximum_filter1d(np.abs(mix).max(1), int(.005 * SR) * 2 + 1)
mix = mix * uniform_filter1d(np.minimum(1, .9 / np.maximum(m_, 1e-9)), int(.005 * SR))[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix[:int(DUR * SR)].astype(np.float32), SR)
print('mix ok, voice gain', round(vg, 2))
print('\n'.join(S.credits(['contrabass', 'cellos', 'violas', 'violins', 'cellos_pizz', 'cellos_spic', 'horn', 'timpani', 'gran_cassa', 'gong', 'gong2', 'frame_drum'])))
