# Voice only (no music, no effects — user rule) → out/mix.wav
import json, os, sys
import numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000
ev = json.load(open(os.path.join(HERE, 'events.json'))); N = int(ev['dur'] * SR)
out = np.zeros(N, np.float32)
for e in ev['ev']:
    y, sr = sf.read(os.path.join(HERE, 'voice', e['id'] + '.wav'), dtype='float32')
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR); a = int(e['t'] * SR); out[a:a + len(y)] += y[:max(0, N - a)]
out = out / (np.abs(out).max() + 1e-9) * .9
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), np.stack([out, out], 1), SR); print('voice mix ok')
