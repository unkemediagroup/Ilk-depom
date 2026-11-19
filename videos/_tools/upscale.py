# AI upscale (Real-ESRGAN x4, ONNX, CPU) for low-res archive photos.
# usage: python3 _tools_upscale.py in.jpg out.jpg [min_width=2000]
# Images already >= min_width wide are copied unchanged.
import sys, os, numpy as np, onnxruntime as ort
from PIL import Image
inp, out = sys.argv[1], sys.argv[2]; minw = int(sys.argv[3]) if len(sys.argv) > 3 else 2000
im = Image.open(inp).convert('RGB')
if im.width >= minw: im.save(out, quality=95); print('skip', im.size); sys.exit()
if im.width * 4 > 4 * minw: im = im.resize((minw // 2, int(im.height * (minw // 2) / im.width)), Image.LANCZOS)
sess = ort.InferenceSession(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_models', 'realesrgan_x4.onnx'), providers=['CPUExecutionProvider'])
name = sess.get_inputs()[0].name
a = np.asarray(im, np.float32) / 255.
T, O = 64, 8; S = T - 2 * O
h, w = a.shape[:2]
pad = np.pad(a, ((O, O + T), (O, O + T), (0, 0)), mode='reflect')
res = np.zeros((h * 4, w * 4, 3), np.float32)
for y in range(0, h, S):
    for x in range(0, w, S):
        tile = pad[y:y + T, x:x + T].transpose(2, 0, 1)[None]
        o = sess.run(None, {name: tile})[0][0].transpose(1, 2, 0)
        oy, ox = min(S, h - y) * 4, min(S, w - x) * 4
        res[y * 4:y * 4 + oy, x * 4:x * 4 + ox] = o[O * 4:O * 4 + oy, O * 4:O * 4 + ox]
img = Image.fromarray((np.clip(res, 0, 1) * 255).astype(np.uint8))
if img.width > 2600: img = img.resize((2600, int(img.height * 2600 / img.width)), Image.LANCZOS)
img.save(out, quality=95); print('upscaled', im.size, '->', img.size)
