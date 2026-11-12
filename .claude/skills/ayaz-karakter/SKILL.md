---
name: ayaz-karakter
description: Motivasyon YouTube Shorts kanalının imza ana karakteri AYAZ (kor rengi). Motivasyon/hikâye videosu, Shorts, stickman/neon karakter sahnesi, "ana karakter", "imza karakter", "Kırmızı Neon", "AYAZ" geçtiğinde ve yt-shorts-master-generator ile video üretirken MUTLAKA kullan.
---

# AYAZ — kanalın ana karakteri

Kullanıcı kararı (2026-11-12): kanalın imza karakteri artık **AYAZ, kor renginde**. Eski "Kırmızı Neon"
(yuvarlak kafalı hap figür, `characters/red-neon/`) ve `yt-shorts-master-generator` içindeki
"gölge silüet + kırmızı neon #ff2a2a" tarifi **geçersiz**; onların yerine bu karakter çizilir.

## Yapılacaklar
1. `characters/ayaz/README.md` dosyasını oku (ana format, renk modları, API).
2. Yeni video klasörüne `characters/ayaz/ayaz.js` dosyasını **`neon.js` adıyla kopyala**
   (aynı `drawNeon / POSE / mixPose / sparks / floorGlow` arayüzü; eski videoların `main.js` kalıbı aynen çalışır).
3. Ana karakteri `drawNeon(g, x, y, s, pose, { t, glow, mode })` ile çiz; **her karede `t` ver** (pelerin + kıymıklar canlı kalsın).
   Durağan planlarda `POSE.hero` kullan. Ayak bastığı sahnelerde `emberGround(...)` ekle.
4. Kalabalık / %99 figürleri `drawNeon(..., { col: { rim:'#34343e', hot:'#4a4a55', glow:'rgba(80,80,100,' } })` ile çiz:
   gri, yuvarlak, pelerinsiz. Kor kırmızısı + altın yalnızca AYAZ'a aittir.
5. Zirve anı ritüeli (her videoda aynı): kum saati döner (`hourglass` 0→1), renk `mixMode('kor','altin',u)` ile altına kayar,
   `sparks(...)` patlar. Düşüş/tükenmişlik sahnesinde `mode:'kul'`.
6. Tipografide vurgu rengi: `#ff2a3c` (anahtar kelime) ve `#ffb81f` (ikincil).

## Değiştirme
Siluet sabittir: sivri kukuleta + vizör + pelerin + kum saati + kol bantları. Renk yalnızca duyguya göre mod olarak değişir.
Dosyalar bu branch'te yoksa: `git fetch origin claude/happy-noether-3j6cdy && git checkout origin/claude/happy-noether-3j6cdy -- characters/ayaz .claude/skills/ayaz-karakter`
