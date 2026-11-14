"""HF'deki ujin-song/pexels-image-60k veri setinden yalnızca metin sütunlarını okuyup arama indeksi kurar."""
import sys, json, pyarrow.parquet as pq
from concurrent.futures import ThreadPoolExecutor
from huggingface_hub import HfFileSystem
fs = HfFileSystem()
REPO = "datasets/ujin-song/pexels-image-60k/data"
OUT = sys.argv[1]
files = sorted(f for f in fs.ls(REPO, detail=False) if f.endswith(".parquet"))
def read(f):
    for i in range(4):
        try:
            with fs.open(f, block_size=2**20) as h:
                pf = pq.ParquetFile(h)
                rows = []
                for rg in range(pf.num_row_groups):
                    t = pf.read_row_group(rg, columns=["id","width","height","scraped_caption","queries"]).to_pylist()
                    for j, r in enumerate(t):
                        r.update(file=f, rg=rg, row=j); rows.append(r)
                return rows
        except Exception as e:
            err = e
    print("FAIL", f, err, file=sys.stderr); return []
with ThreadPoolExecutor(12) as ex, open(OUT, "w") as o:
    for n, rows in enumerate(ex.map(read, files)):
        for r in rows: o.write(json.dumps(r) + "\n")
        print(n, len(rows), file=sys.stderr, flush=True)
