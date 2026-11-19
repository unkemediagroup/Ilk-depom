#!/bin/bash
# Channel-agnostic upload master for YouTube Shorts: any rendered mp4 -> 1440x2560, deband+dither, -14 LUFS, ~35 Mbps.
# usage: finalize.sh in.mp4 out.mp4      (keeps source fps; 60 fps sources stay 60)
set -e
IN="$1"; OUT="$2"
FPS=$(ffprobe -v error -select_streams v -show_entries stream=r_frame_rate -of csv=p=0 "$IN")
HAS_A=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$IN" | head -1)
if [ -z "$HAS_A" ]; then echo "WARNING: $IN has NO audio track"; AF=(-an); else
  # two-pass loudness to -14 LUFS / -1 dBTP
  J=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
  g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
  AF=(-af "loudnorm=I=-14:TP=-1.0:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" -ar 48000 -c:a aac -b:a 256k); fi
ffmpeg -v error -y -i "$IN" -vf "scale=1440:2560:flags=lanczos,gradfun=1.2:16,unsharp=5:5:0.35:5:5:0.0" -r "$FPS" \
  -c:v libx264 -preset slow -profile:v high -level 5.1 -b:v 35M -maxrate 45M -bufsize 70M -pix_fmt yuv420p "${AF[@]}" -movflags +faststart "$OUT"
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate -show_entries format=duration,bit_rate -of compact "$OUT"
