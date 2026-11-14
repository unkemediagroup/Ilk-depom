---
name: finans-shorts
description: Finans/para YT Shorts videoları üretir (1080×1920). Kullanıcı metin + sesini verir; bu skill görselleri (grafikler, para yağmuru, sayaçlar, istatistik kartları, borsa mumları, geçişler, kelime kelime altyazı) kodla çizip MP4 çıkarır. "finans videosu", "para videosu", "yatırım/birikim/borsa shorts", kullanıcı ses + metin verdiğinde kullan.
---
# Finans Shorts

Kullanıcı **metin ve sesi hazır verir**; senin işin yalnızca **görsel + kurgu + render**. Ana karakter (AYAZ) KULLANILMAZ.

## Kurallar (kullanıcı tercihleri)
- İzleyiciyi sıkmayan, **sürekli hareketli** görseller: grafikler, para görselleri, geçişli istatistikler, sayaçlar.
- **İlk karede hareket** (hook): flaş, para yağmuru, hızla dolan sayaç; yavaş açılış yok.
- Her cümle kendi somut görselini alır; sayılar ekranda **büyük sayaç/grafik** olarak, sesle aynı anda (`at('word')` ile kelime zamanına kilitle).
- Görseller her videoda farklı olsun; aynı sahne kalıbını tekrar etme.
- **Müzik yok, foley/cızırtı yok** — yalnızca kullanıcının sesi (müziği kendisi ekler). Tam ekran, kenar boşluğu yok.
- Akıcı: her karede hareket, bol kamera (zoom/shake/punch), sahneler arası whip/iris geçiş. Durağan plan az.
- Rakamlar doğru olsun (bileşik faiz vb. gerçekten hesapla); yatırım tavsiyesi/garanti getiri vaadi ekleme.
- Çalışırken anlatma; bitince kısa Türkçe özet.

## Akış
1. `videos/<ad>/` oluştur, `kit/` içeriğini (fin.js, fonts/, fonts.css, index.html, render.cjs, prev.cjs, words.py, mux.sh) kopyala; sesi `voice/` altına koy.
2. Kelime zamanları: `pip install faster-whisper` → `python3 words.py voice/vo.mp3` → `words.js` + `.srt`
   (huggingface erişimi gerekir; yoksa metin + ses süresinden elle `WORDS` yaz).
3. `SCRIPT.md`: Zaman | Seslendirme | Görsel tablosu (her cümleye ayrı görsel).
4. `main.js`: `window.DUR` = ses süresi; sahneleri yaz, `window.draw(t)` içinde birleştir (örnek: `kit/main.js`).
5. Kontrol: `node prev.cjs 0.2 3 7 ...` ve `node prev.cjs strip 4 6 0.2` → kareleri büyütüp incele (taşma, okunmazlık, boş ekran).
6. Render: `node render.cjs 4` → `./mux.sh voice/vo.mp3 <ad>.mp4` (-14 LUFS, poster.jpg). `out/` commit edilmez.
7. `CREDITS` (fontlar OFL, ses kullanıcıya ait), NOTLAR.md'ye satır ekle, commit + push.

## fin.js parçaları
- Arka plan: `bgFinance(t,{tint,seed,dot})`, `vignette()`
- Grafik: `lineChart` (büyüyen çizgi + değer etiketi), `candles` (borsa mumları), `bars`, `hbars` (yarış/karşılaştırma), `ring` (yüzde halkası), `donut`, `statCard`, `arrow` (trend), `tag`
- Para: `coin` (dönen altın), `bill` (banknot), `moneyRain`, `cashStack`, `piggy`
- Metin: `kinetic` (kelime kelime zıplayan başlık, vurgu renkleri), `counter` (count-up sayaç), `txt`, `fit`, `fmtMoney`, `fmtPct`
- Kamera/geçiş: `cam`, `whip`, `motionStreak`, `flash`, `punch`, `iris`
- Altyazı: `subs(t,y)` (aktif kelime altın, sayılar yeşil), `at(word)` kelime zamanı
- Easing: `eo, eio, ei, eback, spring, seg`; palet `C` (yeşil=kazanç, kırmızı=kayıp, altın=vurgu).

## Ortam notu
- Playwright/Chromium hazır; ffmpeg sistemde. Lemo-Opuscar / HyperFrames / onetake gerekirse ek stil için kullanılabilir.
