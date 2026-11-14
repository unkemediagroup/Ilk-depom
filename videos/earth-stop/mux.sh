#!/bin/bash
# ./mux.sh <ses dosyası> <çıktı.mp4>   — kareler + kullanıcının sesi (müzik/efekt YOK), -14 LUFS, Shorts uyumlu
set -e; A=$1; O=${2:-out.mp4}
ffmpeg -y -loglevel error -framerate 30 -i out/frames/f%05d.jpg -i "$A" -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -movflags +faststart \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest "$O"
ffmpeg -y -loglevel error -ss 1.2 -i "$O" -frames:v 1 -q:v 3 poster.jpg; echo "ok $O"
