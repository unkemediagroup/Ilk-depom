# İmza karakter: AYAZ (kor rengi)

Kanalın ana ve imza karakteri. **Eski "Kırmızı Neon" (`characters/red-neon/`) karakterinin yerini aldı.**
Tüm motivasyon videolarında ana karakter BU. Model sayfası: `model-sheet.jpg`.

## Ana format (değiştirilemez)
- **Köşeli** siyah siluet; yuvarlak çizgi yok. Kafa: **sivri altıgen kukuleta**, yüz yerine **tek altın vizör çizgisi**.
- **Yırtık, çift katlı pelerin**; uçlarından kor kıymıkları kopar (koşarken iz bırakır).
- **Kristal gövde:** geniş omuz, dar bel, ince faset çizgileri.
- Göğüste **çerçeveli altın kum saati** (mesaj: "zaman akıyor, sen ne yapıyorsun?"). Zirve anında **ters döner**.
- Ön kollarda **çift altın bant**.
- Bastığı yer **kor gibi çatlar** (`emberGround`).
- Renk: kontur **kor kırmızısı `#ff2a3c`**, vurgular **altın `#ffb81f`**, gövde `#07070b`.
- Kalabalık / rakipler: gri, **yuvarlak**, pelerinsiz, kukuletasız düz figür (`{col: …}` ile çizilir).

## Renk modları (siluet hiç değişmez)
`kor` (ana, varsayılan) · `altin` (zirve/zafer) · `kul` (tükenmişlik; sadece vurgular yanar) · `buz` (alternatif).
Tipik yolculuk: `kul` → `kor` → zirvede `mixMode('kor','altin',u)` + kum saati dönüşü + `sparks`.

## Kod — `ayaz.js` (bağımlılıksız, Canvas 2D) — `neon.js` ile BİREBİR UYUMLU
Yeni videoda bu dosyayı video klasörüne **`neon.js` adıyla kopyala**; mevcut `main.js` kalıpları aynen çalışır.
- `drawNeon(ctx, x, y, scale, pose, {flip, glow, t, wind, hourglass, mode, cape, embers})` → AYAZ'ı çizer.
  - `t`: saniye (pelerin dalgası + kıymıklar; her karede ver). `wind`: 0 durgun … 1 koşu (verilmezse pozdaki `lean`'den).
  - `hourglass`: 0..1 (yarım tur). `mode`: `'kor'|'altin'|'kul'|'buz'` ya da `mixMode(...)` sonucu.
  - `{col: {...}}` verilirse (kalabalık) eski düz yuvarlak figür çizilir.
- `POSE` (eski pozların hepsi + **`hero`**: ayaklar açık duruş, kum saati görünür), `mixPose(A,B,u)`, `skeleton`.
- `emberGround(ctx, x, y, scale, grow01, {mode, spread, seed})`, `sparks(...)` (kırmızı+altın), `floorGlow(...)`.
- Ayaklar y=0, yukarı −y, ayakta boy ≈ 600 birim. Yalnızca profil görünüm.
- SVG tasarım kaynakları (karakter sayfası, renk modları, tanıtım klibi): `ayaz.html`.
