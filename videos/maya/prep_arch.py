# Crop archive scans (remove page mats / card borders) into raw/NN.jpg in the order render.py expects.
import numpy as np, os
from PIL import Image, ImageFilter
def autocrop(p, pad=.02, thr=28):
    im = Image.open(p).convert('RGB'); W0, H0 = im.size; im = im.crop((int(W0 * .1), int(H0 * .08), int(W0 * .9), int(H0 * .92)))
    g = np.asarray(im.convert('L').filter(ImageFilter.GaussianBlur(4)), np.float32)
    paper = np.median(np.concatenate([g[:20].ravel(), g[-20:].ravel(), g[:, :20].ravel(), g[:, -20:].ravel()]))
    dark = (paper - g) > thr
    rows = np.where(dark.mean(1) > .35)[0]; cols = np.where(dark.mean(0) > .35)[0]
    if len(rows) < 10 or len(cols) < 10: return im
    y0, y1, x0, x1 = rows[0], rows[-1], cols[0], cols[-1]
    h, w = y1 - y0, x1 - x0
    return im.crop((int(x0 + w * pad), int(y0 + h * pad), int(x1 - w * pad), int(y1 - h * pad)))
def frac(p, box):
    im = Image.open(p).convert('RGB'); W, H = im.size
    return im.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
os.makedirs('raw', exist_ok=True)
plan = [('tikal1923.jpg', 'card'), ('cat129.jpg', 'auto'), ('cat49.jpg', 'auto'), ('cat41.jpg', 'auto'), ('castillo1932.jpg', (.13, .1, .88, .95)),
        ('cat117.jpg', 'auto'), ('jaguar1923.jpg', 'card'), ('palenque1923.jpg', 'card'), ('relief1923.jpg', 'card'),
        ('met309404.jpg', None), ('met318345.jpg', None)]
for i, (f, how) in enumerate(plan):
    p = os.path.join('arch', f)
    if how == 'auto': im = autocrop(p)
    elif how == 'card': im = frac(p, (.07, .07, .93, .8)) if 'jaguar' not in f else frac(p, (.08, .08, .95, .92))
    elif how is None: im = Image.open(p).convert('RGB')
    else: im = frac(p, how)
    if f == 'cat129.jpg': im = im.transpose(Image.ROTATE_270)
    im.save('raw/%02d.jpg' % i, quality=93); print(i, f, im.size)
