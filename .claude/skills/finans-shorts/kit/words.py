# python3 words.py voice/vo.mp3  → words.js (kelime zamanları) + <ad>.srt   (pip install faster-whisper)
import sys, json, os, subprocess, numpy as np
from faster_whisper import WhisperModel
src = sys.argv[1]; m = WhisperModel(os.environ.get('WMODEL', 'small.en'), device='cpu', compute_type='int8')
pcm = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout, np.int16).astype(np.float32) / 32768  # PyAV sürüm hatasını atlar
segs, _ = m.transcribe(pcm, word_timestamps=True, language=os.environ.get('WLANG', 'en'))
W = [[w.word.strip(), round(w.start, 2), round(w.end, 2)] for s in segs for w in s.words]
open('words.js', 'w').write('const WORDS = ' + json.dumps(W) + ';\n')
def ts(x): h, r = divmod(x, 3600); mm, s = divmod(r, 60); return f"{int(h):02}:{int(mm):02}:{int(s):02},{int(round((s % 1) * 1000)):03}"
out, cur = [], []
for w in W:
    cur.append(w)
    if w[0][-1:] in '.,?!' or len(cur) >= 4: out.append(cur); cur = []
if cur: out.append(cur)
open(os.path.basename(os.getcwd()) + '.srt', 'w').write('\n'.join(f"{i+1}\n{ts(c[0][1])} --> {ts(c[-1][2])}\n{' '.join(x[0] for x in c)}\n" for i, c in enumerate(out)))
print(len(W), 'words; dur', W[-1][2] if W else 0)
