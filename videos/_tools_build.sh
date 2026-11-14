#!/bin/bash
# usage: _tools_build.sh <dir>   (render.py must exist) -> <dir>/<dir>.mp4
set -e
cd "$(dirname "$0")/$1"; mkdir -p out
python3 ../_tools_genmix.py . && python3 mix.py
python3 render.py > out/render.log 2>&1; tail -1 out/render.log
ffmpeg -v error -y -i out/video.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v libx264 -preset medium -b:v 9M -maxrate 12M -bufsize 18M -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$1.mp4"
ffprobe -v error -show_entries format=duration,size -of csv=p=0 "$1.mp4"
