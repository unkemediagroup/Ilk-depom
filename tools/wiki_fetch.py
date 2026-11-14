"""python3 wiki_fetch.py OUTDIR "arama 1" "arama 2" ...  -> her aramadan ilk N görseli (960px) indirir: OUTDIR/<slug>_<i>.jpg
Ortam değişkeni N (varsayılan 4), WIDTH (varsayılan 960)."""
import sys, os, re, subprocess, urllib.parse, time, html
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
N = int(os.environ.get("N", 4)); WIDTH = os.environ.get("WIDTH", "960")
UA = "BeyondLuxuryShorts/1.0 (educational shorts)"
def get(u, dst=None):
    a = ["curl", "-sL", "-m", "40", "-A", UA, u] + (["-o", dst] if dst else [])
    return subprocess.run(a, capture_output=not dst, text=not dst).stdout
for q in sys.argv[2:]:
    h = get("https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=" + urllib.parse.quote(q))
    names = []
    for m in re.findall(r'File:([^"&<>]+?\.(?:jpe?g|JPE?G|png|webp))', h):
        n = html.unescape(urllib.parse.unquote(m)).replace(" ", "_").replace("\\u0026", "&")
        if n not in names: names.append(n)
    slug = re.sub(r"\W+", "_", q.lower()).strip("_")
    for i, n in enumerate(names[:N]):
        dst = f"{out}/{slug}_{i}.jpg"
        for k in range(4):
            get(f"https://commons.wikimedia.org/wiki/Special:FilePath/{urllib.parse.quote(n)}?width={WIDTH}", dst)
            if subprocess.run(["file", dst], capture_output=True, text=True).stdout.find("image") > 0: break
            time.sleep(6)
        print(dst, "<-", n, flush=True)
