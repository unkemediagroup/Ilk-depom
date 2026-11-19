# Depth map (Depth-Anything-V2-Small, Apache-2.0, ONNX/CPU). Near = bright.
# CLI: python3 depth.py in.jpg out_depth.png      |  import: from depth import depth_map; d = depth_map(pil_img) -> float32 HxW in [0,1]
import os, sys, numpy as np, onnxruntime as ort
from PIL import Image
_S = None
def depth_map(img, size=518):
    global _S
    if _S is None:
        _S = ort.InferenceSession(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_models', 'depth_anything_v2_small.onnx'), providers=['CPUExecutionProvider'])
    im = img.convert('RGB'); w, h = im.size
    s = size / max(w, h); nw, nh = max(14, int(w * s) // 14 * 14), max(14, int(h * s) // 14 * 14)
    a = (np.asarray(im.resize((nw, nh), Image.BICUBIC), np.float32) / 255. - [.485, .456, .406]) / [.229, .224, .225]
    d = _S.run(None, {'pixel_values': a.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
    d = (d - d.min()) / (d.max() - d.min() + 1e-6)
    return np.asarray(Image.fromarray((d * 65535).astype(np.uint16)).resize((w, h), Image.BICUBIC), np.float32) / 65535.
if __name__ == '__main__':
    d = depth_map(Image.open(sys.argv[1])); Image.fromarray((d * 255).astype(np.uint8)).save(sys.argv[2]); print('ok', d.shape)
