# Subject cut-out with rembg (MIT; isnet-general-use model, auto-downloaded on first use).
# CLI: python3 cutout.py in.jpg out.png   |  import: from cutout import cutout; rgba = cutout(pil_img)
import sys
from PIL import Image
_SESS = None
def cutout(img, model='isnet-general-use'):
    global _SESS
    from rembg import remove, new_session
    if _SESS is None: _SESS = new_session(model)
    return remove(img.convert('RGB'), session=_SESS)
if __name__ == '__main__':
    cutout(Image.open(sys.argv[1])).save(sys.argv[2]); print('ok')
