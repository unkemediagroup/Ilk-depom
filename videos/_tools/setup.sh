#!/bin/bash
# One-time setup of the shared video tools (safe to re-run). Models go to videos/_models (git-ignored).
set -e
D="$(cd "$(dirname "$0")/.." && pwd)"; M="$D/_models"; mkdir -p "$M"
python3 -c "import onnxruntime, rembg, cv2" 2>/dev/null || pip install -q onnxruntime rembg opencv-python-headless
[ -f "$M/realesrgan_x4.onnx" ] || curl -sL -o "$M/realesrgan_x4.onnx" https://huggingface.co/imgdesignart/realesrgan-x4-onnx/resolve/main/onnx/model.onnx
[ -f "$M/depth_anything_v2_small.onnx" ] || curl -sL -o "$M/depth_anything_v2_small.onnx" https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx
echo "video tools ready: $(ls "$M")"
