#!/bin/bash
# usage: shorts_pipeline.sh <video_dir> <duration_s> <out_name.mp4>   (60 fps render → raw → finalize 1440x2560)
set -e
T="$(cd "$(dirname "$0")" && pwd)"; cd "$1"; D="$2"; OUT="$3"
rm -rf out/frames; N=$(python3 -c "print(int($D*60))"); Q=$((N/4+1))
for k in 0 1 2 3; do a=$((k*Q)); b=$(((k+1)*Q)); [ $b -gt $N ] && b=$N; node render.cjs $a $b & done; wait
ffmpeg -v error -y -framerate 60 -i out/frames/f%05d.jpg -i voice/vo.mp3 -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p -c:a aac -b:a 256k -ar 48000 -shortest out/raw.mp4
bash "$T/finalize.sh" out/raw.mp4 "$OUT"
ls -la "$OUT"
