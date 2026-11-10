#!/bin/sh
# Rebuild: LIB = lemo-opuscar library root. Needs ffmpeg 7+, Node 20+, the library's .venv and instrument packs.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=${LIB:-$(cd "$HERE/../.." && pwd)}; export LIB; cd "$LIB"
node core/render/video.mjs "$HERE" --fps 24 --size 1080x1920 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/cues.json" "$HERE/nobody.srt"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/nobody.mp4" 24 0
