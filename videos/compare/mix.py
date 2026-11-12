# The creator's own voice, as delivered (no music, no effects) → out/mix.wav
import os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
y, sr = sf.read(os.path.join(HERE, 'voice', 'vo.wav'), dtype='float32')
if y.ndim > 1: y = y.mean(1)
N = int(30.2 * sr); y = np.pad(y, (0, max(0, N - len(y))))[:N]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); sf.write(os.path.join(HERE, 'out', 'mix.wav'), np.stack([y, y], 1), sr); print('ok')
