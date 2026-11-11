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
- 2026-11-11: Motivasyon kanalındaki genel video tercihleri/dersleri (karakter hariç) Body Hacks kanalı için CLAUDE.md'ye aktarıldı. Ajan/skill/eklentiler zaten main'de.
- 2026-11-11: Body Hacks 'How Do Our Wounds Actually Heal?' (kodla çizilmiş anatomik mikro dünya, kullanıcının sesi, müziksiz, 42 sn): `videos/wounds-heal/` (render: node render.cjs, ffmpeg ile mux).
- 2026-11-11: Body Hacks 'Why Doesn't Your Stomach Digest Itself?' (kodla anatomik çizim, kullanıcının sesi, müziksiz, 62 sn): `videos/stomach-acid/` (render.cjs + ffmpeg mux).
- 2026-11-11: Body Hacks 'Why Do Your Fingers Wrinkle in Water?' (kodla anatomik çizim, kullanıcının sesi, müziksiz, 41 sn): `videos/fingers-wrinkle/`.
- 2026-11-11: Body Hacks 'Why Are Our Eyes Always Wet?' (kodla anatomik çizim, kullanıcının sesi, müziksiz, 47 sn): `videos/tear-film/`.
- 2026-11-11: Body Hacks gözyaşı filmi 2. versiyon (3 katman, teaser: esneme) (56 sn): `videos/tear-film-2/`. Not: istem başlığı 'joints popping' yazıyordu ama metin/ses gözyaşı filmiydi; sese göre yapıldı.
- 2026-11-11: Body Hacks 'Why Is Yawning Contagious?' (kullanıcının sesi, müziksiz, 40 sn, teaser: hıçkırık): `videos/yawning/`.
- 2026-11-11: Body Hacks 'Why Do We Get Hiccups?' (kullanıcının sesi, müziksiz, 41 sn, teaser: tüy diken): `videos/hiccups/`.
- 2026-11-11: Body Hacks 'Why Do We Get Goosebumps?' (kullanıcının sesi, müziksiz, 44 sn, teaser: uykuda salya): `videos/goosebumps/`.
- 2026-11-11: Body Hacks 'Why Does Saliva Flow While Sleeping?' (kullanıcının sesi, müziksiz, 48 sn, teaser: karanlıkta görme): `videos/drool/`.
- 2026-11-11: Body Hacks 'Why Do Our Eyes See Better in the Dark?' (kullanıcının sesi, müziksiz, 45 sn, teaser: kalp atışı): `videos/dark-vision/`.
- 2026-11-11: Body Hacks 'How Many Times Does Your Heart Beat in a Day?' (kullanıcının sesi, müziksiz, 57 sn, teaser: ikinci beyin bağırsak): `videos/heartbeat/`.
- 2026-11-11: Body Hacks 'Why Is the Gut Called the Second Brain?' (kullanıcının sesi, müziksiz, 47 sn, teaser: vücut elektriği): `videos/gut-brain/`.
