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
