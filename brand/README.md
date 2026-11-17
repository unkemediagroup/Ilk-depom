# Kanal görselleri (AYAZ, kor rengi)

- `logo-800x800.png` — YouTube profil resmi (800×800; daire kırpmaya uygun). `logo-1600.png` yüksek çözünürlüklü kopya.
- `banner-2560x1440.png` — YouTube kanal banner'ı (2560×1440). Yazı ve AYAZ'ın gövdesi ortadaki 1546×423 güvenli alanda;
  TV görünümünde tam boy AYAZ + gri kalabalık görünür.
- Kaynak: `brand.html` (Canvas, `ayaz.js`), render: `NODE_PATH=$(npm root -g) node render.cjs .`
- Kanal adı henüz yazılmadı (bilinmiyor); banner'da slogan var: DISCIPLINE OVER MOTIVATION / MOTIVATION SHORTS.
- `cover-nobody-1080x1920.png`, `cover-discipline-1080x1920.png`, `cover-twenties-1080x1920.png` — Shorts kapakları (kaynak `thumbs.html`, render: `NODE_PATH=$(npm root -g) node render_thumbs.cjs .`).
