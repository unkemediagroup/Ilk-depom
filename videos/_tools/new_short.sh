#!/bin/bash
# usage: new_short.sh <dir> <audio.mp3> "<whisper prompt>"  → copies template, transcribes to words.js
V=/home/user/Ilk-depom/videos; set -e; mkdir -p $V/$1/voice; cd $V/$1
cp -r $V/foot-asleep/fonts $V/foot-asleep/fonts.css $V/foot-asleep/index.html $V/foot-asleep/render.cjs $V/foot-asleep/prev.cjs .
cp "$2" voice/vo.mp3; ffmpeg -v error -y -i voice/vo.mp3 -ar 16000 -ac 1 voice/vo16.wav
P="$3" nice python3 - <<'P' 2>&1 | grep -v Warning
import json, os, numpy as np, wave
from faster_whisper import WhisperModel
w=wave.open('voice/vo16.wav'); a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
m=WhisperModel('small.en',device='cpu',compute_type='int8')
segs,_=m.transcribe(a,word_timestamps=True,initial_prompt=os.environ['P'])
W=[]
for s in segs:
  for x in s.words:
    t=x.word.strip()
    if W and (t[:1] in ',-%' ): W[-1][0]+=t; W[-1][2]=round(x.end,2); continue
    W.append([t,round(x.start,2),round(x.end,2)])
open('words.js','w').write('window.WORDS='+json.dumps(W)+';')
print(' '.join(f'{a}@{b:.1f}' for a,b,c in W)); print(W[-1][2])
P
rm voice/vo16.wav; ffprobe -v error -show_entries format=duration -of csv=p=0 voice/vo.mp3
