# Gemini image generation (key is injected by the network proxy as x-goog-api-key).
# usage: python3 _tools_gemini_img.py "<prompt>" out.png [aspect=9:16] [model]
import sys, json, base64, urllib.request, urllib.error, time
prompt, out = sys.argv[1], sys.argv[2]
aspect = sys.argv[3] if len(sys.argv) > 3 else '9:16'
models = [sys.argv[4]] if len(sys.argv) > 4 else ['gemini-3.1-flash-image', 'gemini-3-pro-image', 'gemini-2.5-flash-image']
body = {"contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}}}
for m in models:
    for attempt in range(3):
        try:
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent",
                                         data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
            d = json.load(urllib.request.urlopen(req, timeout=180))
            for c in d.get('candidates', []):
                for p in c.get('content', {}).get('parts', []):
                    if 'inlineData' in p:
                        open(out, 'wb').write(base64.b64decode(p['inlineData']['data'])); print('ok', m, out); sys.exit(0)
            print('no image from', m, str(d)[:300]); break
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]; print('http', e.code, m, msg)
            if e.code in (429, 503): time.sleep(15 * (attempt + 1)); continue
            break
sys.exit(1)
