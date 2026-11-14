"""Kullanım: python3 pexels_video_fetch.py VIDEO_INDEX.json OUTDIR SAMPLE_ID [...]
HF zengxianyu/open-sora-pexels-subset tar shard'larından tek klipleri aralık isteğiyle indirir -> OUTDIR/<video_id>.mp4"""
import sys, json, os, subprocess
idx, out, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
os.makedirs(out, exist_ok=True)
man = json.load(open(idx))["man"]
B = "https://huggingface.co/datasets/zengxianyu/open-sora-pexels-subset/resolve/main/videos/"
def loc(shard):
    h = subprocess.run(["curl","-sI","-m","30",B+shard],capture_output=True,text=True).stdout
    return [l.split(" ",1)[1].strip() for l in h.splitlines() if l.lower().startswith("location:")][-1]
def rng(u,a,b):
    for _ in range(5):
        d = subprocess.run(["curl","-s","-m","180","-r",f"{a}-{b}",u],capture_output=True).stdout
        if len(d) == b-a+1: return d
    raise RuntimeError("range")
headers = {}
def walk(shard, u):
    if shard in headers: return headers[shard]
    res, off = {}, 0
    while True:
        h = rng(u, off, off+511)
        name = h[:100].rstrip(b"\0").decode(errors="ignore")
        if not name: break
        if h[345:500].strip(b"\0"): name = h[345:500].rstrip(b"\0").decode() + "/" + name
        size = int(h[124:136].strip(b"\0 ") or b"0", 8)
        res[name] = (off+512, size); off += 512 + (size+511)//512*512
    headers[shard] = res; return res
for sid in ids:
    r = next(x for x in man if x["sample_id"] == sid)
    dst = f"{out}/{r['video_id']}.mp4"
    if os.path.exists(dst): continue
    u = loc(r["shard"])
    ent = {k:v for k,v in walk(r["shard"], u).items() if sid in k and k.endswith(".mp4")}
    (o, s), = ent.values()
    open(dst,"wb").write(rng(u, o, o+s-1)); print("ok", sid, dst)
