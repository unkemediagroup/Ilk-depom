"""python3 transcribe.py ses.mp3 words.json  -> faster-whisper medium kelime zamanları"""
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
raw = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-ar","16000","-ac","1","-f","s16le","-"],capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
m = WhisperModel("medium", device="cpu", compute_type="int8")
seg, _ = m.transcribe(a, word_timestamps=True, language="en")
W = [(round(x.start,2), round(x.end,2), x.word.strip()) for s in seg for x in s.words]
json.dump(W, open(sys.argv[2], "w")); print(" ".join(f"{x[2]}@{x[0]}" for x in W))
