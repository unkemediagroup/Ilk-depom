# 2.5D "3D photo" camera move from a still + its depth map.
# import: from parallax import Parallax; P = Parallax(pil_img, depth=None); frame = P.frame(k, W, H, move='push')  (k in 0..1)
# CLI demo: python3 parallax.py in.jpg out.mp4 [seconds=6] [move=push|pan|orbit] [W=1440] [H=2560] [fps=60]
import sys, os, math, subprocess, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from depth import depth_map
class Parallax:
    def __init__(self, img, depth=None, strength=.045):
        self.img = np.asarray(img.convert('RGB'))
        self.d = depth if depth is not None else depth_map(img)
        self.d = cv2.GaussianBlur(self.d, (0, 0), 3)
        self.s = strength
    def frame(self, k, W=1440, H=2560, move='push', zoom0=1.08, zoom1=1.22):
        e = .5 - .5 * math.cos(math.pi * min(1, max(0, k)))
        h, w = self.d.shape
        scale = max(W / w, H / h)
        z = zoom0 + (zoom1 - zoom0) * e
        if move == 'pan': dx, dy = (e - .5) * 2, 0
        elif move == 'orbit': dx, dy = math.sin(e * math.pi * 1.2 - .6), .3 * math.cos(e * math.pi)
        else: dx, dy = 0, -.4 * (e - .5)
        gx, gy = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
        cx, cy = w / 2, h / 2
        sx = (gx - W / 2) / (scale * z) + cx; sy = (gy - H / 2) / (scale * z) + cy
        dd = cv2.remap(self.d, sx, sy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        amp = self.s * w
        push = (z - zoom0) * (dd - .5) * .9 if move == 'push' else 0
        mx = sx - dx * amp * (dd - .5) - push * (gx - W / 2) / (scale * z)
        my = sy - dy * amp * (dd - .5) - push * (gy - H / 2) / (scale * z)
        return cv2.remap(self.img, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
if __name__ == '__main__':
    src, out = sys.argv[1], sys.argv[2]
    sec = float(sys.argv[3]) if len(sys.argv) > 3 else 6; move = sys.argv[4] if len(sys.argv) > 4 else 'push'
    W = int(sys.argv[5]) if len(sys.argv) > 5 else 1440; H = int(sys.argv[6]) if len(sys.argv) > 6 else 2560; fps = int(sys.argv[7]) if len(sys.argv) > 7 else 60
    P = Parallax(Image.open(src)); n = int(sec * fps)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                          '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    for i in range(n): p.stdin.write(P.frame(i / max(1, n - 1), W, H, move).tobytes())
    p.stdin.close(); p.wait(); print('ok', out)
