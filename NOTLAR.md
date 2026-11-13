# Oturum Notları

Tarih: 2026-11-10

## Ortam kontrolleri
- Node.js: v22.23.4, npm: 10.9.9
- Python: 3.13.18, pip: 24.0

## OmniRoute kurulumu
- Komut: `npm install -g omniroute`
- Sürüm: 3.8.53, çalıştırma komutu: `omniroute`
- Not: Container geçici; oturum bitince global kurulum silinir.
  Kalıcı olması için setup script'ine eklenebilir.

## OmniRoute nedir?
Açık kaynak (yazar: Diego Souza) bir "AI gateway / router". Claude Code, Codex,
Cursor, Cline, Copilot gibi araçları tek bir OpenAI uyumlu endpoint üzerinden
yüzlerce (~380) AI sağlayıcısına bağlar.

- **Tek endpoint:** Tüm sağlayıcılar için tek API adresi/anahtar.
- **Otomatik fallback:** Bir sağlayıcı limite takılırsa/çökerse diğerine geçer.
- **Ücretsiz katmanları birleştirme:** Birçok sağlayıcının free tier'ını
  tek yerden kullanma, kota takibi (dashboard).
- **Routing stratejileri:** ~20 farklı yönlendirme stratejisi.
- **Token sıkıştırma:** RTK + Caveman ile token tasarrufu iddiası.
- **Ek özellikler:** MCP/A2A desteği, dashboard, PWA/desktop, headless mod
  (`serve --headless`).

Uyarı: Ücretsiz kotalar her sağlayıcıya aittir; kendi hesaplarınızı bağlamanız
ve her sağlayıcının kullanım şartlarına uymanız gerekir.

## Kalıcılık ayarları (eklendi)
- `CLAUDE.md`: kullanıcı tercihleri her oturumda otomatik yüklenir.
- `.claude/skills/omniroute/SKILL.md`: OmniRoute yeteneği.
- `.claude/hooks/session-start.sh` + `.claude/settings.json`: her cloud oturumunda
  OmniRoute eksikse otomatik kurulur (sunucu başlatılmaz).
- Hook'un varsayılan branch'e merge edilmesi sonrası tüm yeni oturumlar kullanır.

- `claude-code-setup` eklentisi settings.json ile etkinleştirildi (bkz. CLAUDE.md).

- agency-agents kuruldu: 92 ajan `.claude/agents/` altında (engineering, testing, project-management, design).

- 2026-11-10: İlk Shorts videosu üretildi: `videos/body-heals/body-heals.mp4` (Lemo-Opuscar, Watercolor Brush).
- Kullanıcı geri bildirimi: animasyonlar beğenildi; çizim sesleri (cızırtı) ve sıkıcı anlatım beğenilmedi. Lemo-Opuscar eklenti olarak kalıcı kaydedildi.
- onetake skill eklendi (`.claude/skills/onetake`, ticari olmayan lisans).
- gbro-collage-broll skill eklendi (MIT, Gemini API anahtarı gerekir).
- HyperFrames eklentisi eklendi (Apache-2.0).
- 2026-11-10: "Nobody Is Coming to Save You" Shorts videosu: `videos/nobody/` (Woodcut Print, kullanıcının sesi, 29.6 sn).
- İmza karakter kaydedildi: `characters/red-neon/` (Kırmızı Neon).
- "Motivation / Discipline / Obsession" videosu (Kırmızı Neon, sessiz, 27 sn): `videos/obsession/`.
- 2026-11-11: "How Do Our Wounds Actually Heal?" Shorts (Kırmızı Neon + neon mikro dünya, TTS am_puck, müziksiz, 35.8 sn): `videos/wounds/`.
- 2026-11-11: "Nobody Is Coming to Save You" (Kırmızı Neon, siyah evren, kullanıcının sesi, 29 sn, senaryo tablosu SCRIPT.md): `videos/nobody-red/`.
- 2026-11-11: "Nobody Is Coming to Save You" Kül ve Ateş versiyonu (erimiş altın çatlaklı figür, kömür karası zemin): `videos/nobody-forge/`.
- 2026-11-11: "Nobody Is Coming to Save You" Gölge Kitle & Kül-Ateş versiyonu (4 sütunlu senaryo): `videos/nobody-crowd/`.
- 2026-11-12: PR #2 (AYAZ, kor rengi) bu branch'e birleştirildi; Kırmızı Neon (`characters/red-neon/`) silindi. Motivasyon videolarında ana karakter artık AYAZ (`characters/ayaz/ayaz.js` + `ayaz-karakter` skill).
- 2026-11-12: AYAZ ile ilk video "Nobody Is Coming to Save You": `videos/nobody-ayaz/` (kül→kor→zirvede altın ritüeli).
- 2026-11-12: AYAZ (sadece kırmızı) ile yeni kurgu: her cümle kendi somut görseli (fişek, takvim, NO yıldızları, zincir, blueprint, çekiç, bahane baloncukları, merdiven): `videos/nobody-ayaz2/`. Önceki AYAZ kurgusu beğenilmedi.
- 2026-11-12: "Discipline Over Motivation" (AYAZ kırmızı, cümle başına somut görsel, 28.4 sn): `videos/discipline/`.
- 2026-11-12: "Your 20s Are Your Foundation" (AYAZ kırmızı, 29.8 sn): `videos/twenties/`.
- 2026-11-12: "Stop Comparing Your Life to Others" (AYAZ kırmızı, 30.2 sn, yeni görsel dil: kitaplar, sosyal medya akışı, film şeridi, ilerleme çubukları, şerit metre, dünkü-ben hayaleti, koşu kulvarı): `videos/compare/`.
- 2026-11-12: "The Power of Being Alone" (AYAZ, güçlü hook: ilk karede koşu + kovalayan sessizlik dalgası; 28.6 sn): `videos/alone/`.
- 2026-11-12: "One Year Can Change Everything" (AYAZ; hook: dönen 365 sayacı → 1 YEAR + kahraman inişi; 28.1 sn): `videos/oneyear/`.
- 2026-11-12: "Your Habits Create Your Future" (AYAZ; hook: GOALS çizgisine yetişemeyen sıçrayış; 29.2 sn): `videos/habits/`.
- 2026-11-12: `videos/early/` — "Why Successful People Wake Up Early" (59 sn, AYAZ kırmızı, 26 sahne, müzik yok; Tim Cook satırı logosuz anonim figürle).
- 2026-11-12: `videos/fear/` — "Overcoming Fear of Failure" (57 sn, AYAZ kırmızı, 25 sahne, hayalet = korku ana motifi; ses dosyasında metin 2 kez okunmuştu, ilk okuma kullanıldı).
- 2026-11-12: `videos/moment/` — "Stop Waiting for the Perfect Moment" (45 sn, AYAZ kırmızı, 21 sahne: su altı hook, sıra fişi, tren, yanan REALITY duvarı, kum dolu yumruk, megafonlar, atlama kulesi→kanat→bulut, kum saatine crash-zoom).
- 2026-11-13: `videos/drip/` — "The Silent Power of Consistency" (50.6 sn, AYAZ kırmızı, 21 sahne: gazete hook, ayak izi izi, gişe, damla→kaya, DAY duvarları; ses dosyasında metin 2 kez okunmuştu, ilk okuma kullanıldı).
- 2026-11-13: `videos/peace/` — "Protect Your Peace" (52.6 sn, AYAZ kırmızı, 23 sahne: kalkan-ok hook, enerji hırsızları, kumanda, kiralık zihin odaları, delik bardak, kablo kesme, TV kapanma, nilüfer→ağaç).
