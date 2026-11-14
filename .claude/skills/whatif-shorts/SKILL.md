---
name: whatif-shorts
description: "What If" (Ya ... olsaydı?) senaryolu YT Shorts videoları üretir (1080×1920, 30 fps). Kullanıcı metin + ses dosyasını verir; bu skill görselleri kodla çizip (Canvas 2D animasyon, sayaç, grafik, kamera, geçiş, kelime kelime altyazı) MP4 çıkarır. Kullanıcı "what if videosu", metin + ses, ya da birden çok metin/ses gönderdiğinde kullan.
---
# What If Shorts

Kullanıcı **metin + sesi hazır verir**; iş: **görsel + kurgu + render**. Ana karakter (AYAZ / Kırmızı Neon) KULLANILMAZ.

## Kurallar (kullanıcı tercihleri — tüm kanallardan)
- **Hook (ilk 3 sn):** ilk karede hareket + "WHAT IF …?" kancası dev yazıyla; 1. saniyede güçlü aksiyon (patlama, çarpışma, sayaç). Yavaş açılış yok.
- **Sürekli hareket:** her karede animasyon, bol kamera (zoom/pan/shake/punch), akan geçişler (whip/iris/push/glitch); durağan plan yok.
- **Her cümle kendi somut görseli**; senaryonun sonucu ekranda *gösterilir* (dünya durur → okyanus kayar, ay yok → gelgit çöker…). Sayılar sesle aynı anda büyük sayaç/grafik (`at('word')`).
- **Görsel çeşitlilik:** her videoda yeni metaforlar; önceki videoların sahne kalıplarını tekrar etme.
- **Tam ekran**, kenar boşluğu/çerçeve yok. Altyazı görüntü üstünde, y≈1530 (Shorts arayüzünden uzak).
- **Ses:** yalnızca kullanıcının sesi; **müzik yok, foley yok** (müziği kendisi ekler). -14 LUFS.
- Nesneler kadrajı doldursun; robotik/tek easing hareket yok; kartlar düz ve jenerik olmasın.
- Bilimsel iddialar savunulabilir olsun; rakamları gerçekten hesapla.
- **Çalışırken anlatma; video bitince açıklama yazma** — yalnızca dosya + tek satır. Başarısız olan varsa sadece onu yaz.

## Akış (tek video)
1. `videos/<ad>/` oluştur; `kit/` içeriğini kopyala (fin.js, fonts/, fonts.css, index.html, render.cjs, prev.cjs, words.py, mux.sh, .gitignore); sesi `voice/vo.mp3` yap.
2. `pip install -q faster-whisper` → `python3 words.py voice/vo.mp3` → `words.js` + `.srt` (bu ortamda çalışıyor, ~20 sn).
3. `main.js`: `window.DUR` = ses süresi; sahneler + `window.draw(t)`. Örnek tam kurgu: `ref/ornek-kurgu-main.js`.
4. Kontrol: `node prev.cjs 0.2 3 7 …` ve `node prev.cjs strip 4 6 0.2` → kareleri incele (taşma, boş ekran, okunmazlık). Kritik sahneyi tam render'dan ÖNCE şeritle kontrol et.
5. `node render.cjs 4` → `./mux.sh voice/vo.mp3 <ad>.mp4`. `out/` commit edilmez.
6. `CREDITS`, NOTLAR.md'ye bir satır, commit + push; videoyu kullanıcıya gönder.

## Toplu iş (birden çok metin + ses)
- Önce **tüm sesleri Whisper'la yazıya dök**, her sesi içeriğine göre kendi metniyle eşleştir (sıra/dosya adına güvenme);
  eşleşmeyen ya da aynı ses iki kez geldiyse üretmeden önce kullanıcıya sor.
- `videos/_sira.md` dosyasına sıra tablosu yaz (No | Başlık | Ses dosyası | Klasör | Durum) ve her video bitince güncelle + push —
  bağlam özetlense bile sıra kaybolmaz.
- Videoları **geliş sırasıyla, birer birer** bitir; biten her videoyu hemen gönder. Dosya adı `NN-<ad>.mp4` (NN = sıra no).

## kit/fin.js parçaları
- Arka plan: `bgFinance(t,{tint,seed,dot})`, `vignette()`
- Grafik/istatistik: `lineChart`, `candles`, `bars`, `hbars`, `ring`, `donut`, `statCard`, `arrow`, `tag`
- Nesne: `coin`, `bill`, `moneyRain`, `cashStack`, `piggy` (+ `ref/ornek-kurgu-main.js` içinde konuya özel çizim örnekleri)
- Metin: `kinetic` (kelime kelime başlık), `counter`, `txt`, `fit`, `fmtMoney`, `fmtPct`
- Kamera/geçiş: `cam`, `whip`, `motionStreak`, `flash`, `punch`, `iris`
- Altyazı: `subs(t,y)`, `at(word)`; easing: `eo, eio, ei, eback, spring, seg`; palet `C`.
- What If için uzay/dünya/doğa/şehir/insan çizimleri videoya özel `main.js`'te yazılır; tekrar kullanılacaklar kite taşınır.

## Referanslar (`ref/`)
- `ornek-kurgu-main.js` — finans kanalından tam bir 59 sn kurgu (12 sahne, geçişler, kelimeye kilitli zamanlama).
- `anatomi-canvas/main.js` — Body Hacks kanalından: hücre/doku/organ çizim yardımcıları (vücutla ilgili what-if'ler için).
- `foto-pil/` — Tarih kanalından gerçek fotoğraf/arşiv görüntülü hat: `render.py` (PIL+numpy, Ken Burns, damga/pin/slam),
  `genmix.py` + `mix_template.py` (sentez ambient — yalnızca kullanıcı müzik isterse), `build.sh`, fontlar (.woff).
  Gerçek görüntü kaynakları: LOC, Met Open Access, NOAA (Wikimedia sık 429 verir). Pexels bağlı görünüyor ama anahtar geçersiz
  (2026-11-14: 401) — kullanıcı anahtarı yenilerse foto + video için kullan. Varsayılan: kodla çizim.

## Diğer araçlar
Lemo-Opuscar, HyperFrames (`npx hyperframes`), onetake (ticari olmayan lisans!), gbro-collage-broll, `yt-shorts-master-generator`,
`.claude/agents/` ajanları — gerektiğinde ek stil için.
