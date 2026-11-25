# Body Hacks Shorts kuyruğu (sırayla: render → finalize → kullanıcıya gönder → sonraki)
Pipeline: `bash videos/_tools/shorts_pipeline.sh <abs dir> <DUR> <N>.video.mp4`, sonra `rm -rf <dir>/out/frames <dir>/out/raw.mp4`.
Sahne yapısı: `<x>_scenes.js` + `seg.js`; main.js = b_head.js(DUR) + ear-ring/b_bt.js + hypnic-jerk/hj_scenes.js + scenes + seg + ear-ring/b_tail.js.

| # | klasör | durum |
|---|--------|-------|
| 1-10 | … | gönderildi |
| 11 | foot-asleep (42.4) | render |
| 12 | deja-vu | words hazır, sahne yazılacak |
| 13 | own-voice | words hazır |
| 14 | butterflies | words hazır |
| 15 | dark-circles | words hazır |
| 16 | teeth-chatter | words hazır |
| 17 | spicy-hot | words |
| 18 | dehydration-headache | words |
| 19 | nail-spots | words |
| 20 | hold-sneeze | words |
