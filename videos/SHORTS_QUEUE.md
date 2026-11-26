# Body Hacks Shorts kuyruğu (sırayla: render → finalize → kullanıcıya gönder → sonraki)
Pipeline: `bash videos/_tools/shorts_pipeline.sh <abs dir> <DUR> <N>.video.mp4`, sonra `rm -rf <dir>/out/frames <dir>/out/raw.mp4`.
Sahne yapısı: `<x>_scenes.js` + `seg.js`; main.js = b_head.js(DUR) + ear-ring/b_bt.js + hypnic-jerk/hj_scenes.js + scenes + seg + ear-ring/b_tail.js.

| # | klasör | durum |
|---|--------|-------|
| 1-20 | … | HEPSİ gönderildi |
