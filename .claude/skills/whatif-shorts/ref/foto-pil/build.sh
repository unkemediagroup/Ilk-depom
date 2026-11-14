#!/bin/bash
# kullanım: build.sh <video klasörü>   (içinde render.py + voice.mp3 olmalı) -> <klasör>/<ad>.mp4
# Not: mix.py sentez ambient müzik üretir; kullanıcı müzik istemiyorsa bu adımı atla ve sesi doğrudan mux et.
set -e
K="$(cd "$(dirname "$0")" && pwd)"; cd "$1"; N="$(basename "$PWD")"; mkdir -p out
python3 "$K/genmix.py" . && python3 mix.py
python3 render.py > out/render.log 2>&1; tail -1 out/render.log
ffmpeg -v error -y -i out/video.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v libx264 -preset medium -b:v 9M -maxrate 12M -bufsize 18M -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$N.mp4"
ffprobe -v error -show_entries format=duration,size -of csv=p=0 "$N.mp4"
