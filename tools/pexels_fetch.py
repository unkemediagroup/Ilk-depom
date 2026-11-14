"""Kullanım: python3 pexels_fetch.py INDEX.jsonl OUTDIR ID [ID ...]
HF'deki Pexels veri setinden istenen fotoğrafları (row-group'u paralel aralık istekleriyle) indirir -> OUTDIR/<id>.jpg"""
import sys, json, os, subprocess, collections, tempfile, pyarrow.parquet as pq
from concurrent.futures import ThreadPoolExecutor
idx, out, ids = sys.argv[1], sys.argv[2], {int(x) for x in sys.argv[3:]}
os.makedirs(out, exist_ok=True)
need = collections.defaultdict(list)
for l in open(idx):
    r = json.loads(l)
    if r["id"] in ids and not os.path.exists(f"{out}/{r['id']}.jpg"):
        need[(r["file"], r["rg"])].append(r)
def url(f):
    p = f.replace("datasets/ujin-song/pexels-image-60k/", "")
    h = subprocess.run(["curl","-sI","-m","30",f"https://huggingface.co/datasets/ujin-song/pexels-image-60k/resolve/main/{p}"],capture_output=True,text=True).stdout
    loc = [l.split(" ",1)[1].strip() for l in h.splitlines() if l.lower().startswith("location:")][-1]
    size = int([l.split(":")[1] for l in h.splitlines() if l.lower().startswith("x-linked-size")][0])
    return loc, size
def rng(u, a, b):
    for _ in range(5):
        d = subprocess.run(["curl","-s","-m","120","-r",f"{a}-{b}",u],capture_output=True).stdout
        if len(d) == b - a + 1: return d
    raise RuntimeError("range fail")
for (f, rg), rows in need.items():
    u, size = url(f)
    tail = rng(u, size - 65536, size - 1)
    flen = int.from_bytes(tail[-8:-4], "little")
    footer = tail if flen + 8 <= 65536 else rng(u, size - flen - 8, size - 1)
    with tempfile.NamedTemporaryFile(suffix=".parquet", delete=False) as t: tmp = t.name
    with open(tmp, "wb") as w:
        w.truncate(size); w.seek(size - len(footer)); w.write(footer)
    md = pq.ParquetFile(tmp).metadata.row_group(rg)
    lo = min(md.column(i).dictionary_page_offset or md.column(i).data_page_offset for i in range(md.num_columns))
    hi = max((md.column(i).dictionary_page_offset or md.column(i).data_page_offset) + md.column(i).total_compressed_size for i in range(md.num_columns))
    lo = min(lo, md.column(0).data_page_offset); step = 8 << 20
    parts = [(a, min(a + step, hi) - 1) for a in range(lo, hi, step)]
    with ThreadPoolExecutor(12) as ex: datas = list(ex.map(lambda p: rng(u, *p), parts))
    with open(tmp, "r+b") as w:
        for (a, _), d in zip(parts, datas): w.seek(a); w.write(d)
    t = pq.ParquetFile(tmp).read_row_group(rg, columns=["image", "id"]).to_pylist()
    for r in rows:
        open(f"{out}/{r['id']}.jpg", "wb").write(t[r["row"]]["image"]["bytes"]); print("ok", r["id"])
    os.remove(tmp)
