# İmza karakter: Kırmızı Neon

Kanalın ana ve imza karakteri. Tüm videolarda (motivasyon, karşılaştırma vb.) ana karakter BU.
İzleyici videoya denk geldiğinde karakterden kanalı tanımalı; tasarımın ana formatı değişmez.

Referans: `reference.png` (kullanıcının gönderdiği; yalnızca karakter esas alınır, sahne/ortam değil).
Model sayfası: `model-sheet.jpg`.

## Ana format (değiştirilemez)
- Düz **siyah siluet** (#07070b), iç detay yok. **Kafa: yüzsüz düz daire.**
- Uzuvlar **kalın, uçları yuvarlak hap** şeklinde; bacaklar kollardan biraz kalın; ayak ucu öne çıkan küçük yumru.
- Tüm siluetin etrafında **tek neon kırmızı kontur** + dışa taşan **kırmızı parıltı**. Öndeki uzuvların kendi konturu var.
- **İmza detay:** sırtta (gövdenin arka kenarında) kısa kırmızı çentikler, omurga/fermuar gibi.
- Oran: kafa ≈ boyun 1/7'si; tıknaz gövde. Profilden çizilir (yön `flip` ile çevrilebilir).
- Renk: kırmızı referanstan (~rgb 220,45,55) biraz daha canlı: `#ff2338`, ince sıcak çekirdek `#ff9aa2`.

## Serbest olanlar
- Daha detaylı/güzel çizim, daha canlı renk ve parlama; yeni açılar ve pozlar.
- **Başarı anı:** karakterin etrafına havai fişek gibi **kırmızı kıvılcımlar** saçılır (`sparks()`).
- Karşılaştırma videolarında diğer karakterler başka renkte olmalı; kırmızı neon yalnızca bizim karakterimiz.

## Kod — `neon.js` (bağımlılıksız, Canvas 2D)
- `drawNeon(ctx, x, y, scale, pose, {flip, glow})` → karakteri çizer, eklem noktalarını döndürür.
- `POSE`: despair (referans: masada, eller başta), sitTall, stand, walkA/B, runA/B, push, kneel, jump, victory.
- `mixPose(A, B, u)` poz geçişi (akıcı animasyon için her karede ara değer).
- `sparks(ctx, x, y, age, {seed, scale})` kırmızı havai fişek; `floorGlow(...)` yerdeki kırmızı ışık havuzu.
- Ayaklar y=0'da, yukarı −y, ayakta boy ≈ 600 birim.

## Bilinen eksik
- `neon.js` şu an yalnızca PROFİL görünüm. Barfiks gibi önden görülen hareketler için **önden görünüm rig'i** gerekir
  (simetrik gövde, iki kol yanlara/yukarı, dirsekler dışa; aynı siyah siluet + kırmızı neon kontur + yüzsüz yuvarlak kafa).
  Sırttaki kırmızı çentikler önden görünmez; önden görünümde göğüs ortasına dikey çentik dizisi düşünülebilir.
