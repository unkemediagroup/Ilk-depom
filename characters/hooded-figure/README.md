# Motivasyon karakteri: Kapüşonlu Figür

Kullanıcının motivasyon videolarının sabit karakteri. "Motivasyon videosu yapacağız" denince BU karakter kullanılır.
İlk kullanım: `videos/nobody/` ("Nobody Is Coming to Save You").

## Tasarım (değiştirme)
- Profilden, sağa bakan, kapüşonlu, zayıf bir figür. Siyah siluet + beyaz bıçak halesi + ışık alan kenarda tek ince kesik.
- Yüz: kapüşonun içinde beyaz profil, siyah göz ve kaş.
- Tek renk vurgusu: göğsündeki turuncu kor (#C8502A) — "içindeki ateş". Karakterin imzası.
- Görsel referans: `ref_fire.jpg`, `ref_climb.jpg`.

## Kod
- `fig.js`: `drawFig(g, M, pose, t)` ve hazır pozlar `POSE` (stand, sit, open, walkA/B, climbA/B, hero, squat, press) + `mix(A, B, u)` ile poz geçişi.
  Ayaklar (0,0)'da, yukarı −y, ~620 birim boy. Dönen noktalar: `chest`, `handN`, `handF`, `head`.
- `rig.js`, `engine/`: Lemo-Opuscar Woodcut motoru (MIT). `fig.js` bunlara bağlı.
