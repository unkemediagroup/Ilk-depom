#!/bin/bash
# usage: _tools_build.sh <dir>   (render.py must exist) -> <dir>/<dir>.mp4
# Quality profile (2026-11): 60 fps, light grain, final 1440x2560 (YouTube gives VP9/AV1 to >1080p uploads), ~35 Mbps.
set -e
cd "$(dirname "$0")/$1"; mkdir -p out
# 1) AI-upscale small archive photos once (arch/*.jpg < 2000 px wide)
if [ -d arch ]; then for f in arch/*.jpg; do [ -f "$f" ] || continue
  w=$(python3 -c "from PIL import Image;print(Image.open('$f').width)"); if [ "$w" -lt 1500 ] && [ ! -f "${f%.jpg}.up" ]; then
  python3 ../_tools_upscale.py "$f" "$f" 2000 && touch "${f%.jpg}.up"; fi; done; fi
# 2) quality patches on the renderer: 60 fps, lighter grain, near-lossless intermediate parts
sed -i -E 's/^W, H, FPS = 1080, 1920, 30/W, H, FPS = 1080, 1920, 60/; s/normal\(0, (6|7), \(H, W, 1\)\)/normal(0, 3, (H, W, 1))/; s/(.-crf., .)17(.)/\114\2/' render.py
python3 ../_tools_genmix.py . && python3 mix.py
python3 render.py > out/render.log 2>&1; tail -1 out/render.log
# 3) final: lanczos to 1440x2560 + light sharpen, high bitrate
ffmpeg -v error -y -i out/video.mp4 -i out/mix.wav -map 0:v -map 1:a \
  -vf "scale=1440:2560:flags=lanczos,unsharp=5:5:0.45:5:5:0.0" -r 60 \
  -c:v libx264 -preset slow -profile:v high -level 5.1 -b:v 35M -maxrate 45M -bufsize 70M -pix_fmt yuv420p \
  -c:a aac -b:a 256k -shortest -movflags +faststart "$1.mp4"
ffprobe -v error -show_entries stream=width,height,r_frame_rate -show_entries format=duration,size -of compact "$1.mp4" | head -3
