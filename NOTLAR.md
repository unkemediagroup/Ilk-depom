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
- 2026-11-14: What If Shorts kanalı başladı (branch `claude/adoring-rubin-zhzsfa`). Diğer sohbetlerin yetenekleri (ana karakter hariç) aktarıldı: `finans-shorts` skill + kit, yeni `whatif-shorts` skill (kit + finans/body-hacks/tarih referansları), genel tercihler ve dersler CLAUDE.md'de. Whisper + Canvas render hattı test edildi. Pexels anahtarı geçersiz (401).
- 2026-11-14: What If #1: `videos/moon-gone/1.video.mp4` — "What If the Moon Suddenly Disappeared?" (35.5 sn, kullanıcının sesi, müziksiz; çatlayıp parçalanan ay hook, kopan çapa, gelgit kabuğu çalkalanır, 1 mil tsunami şehri yutar, dünya çapı kıyı alarmları, 23.4° eksen → topaç gibi sallanma, buz/ateş bölünmüş iklim + CHAOS, ay'sız gökte yalnız insan, yorum balonları + SUBSCRIBE + The Void Scenario kara delik logosu).
- 2026-11-14: What If #2: `videos/earth-stop/2.video.mp4` (37.6 sn). Ortak çizimler kit'e `whatif.js` olarak taşındı (space, earth, moon, shards, cta…).
- 2026-11-14: What If #3: `videos/no-sleep/3.video.mp4` (34.2 sn).
- 2026-11-14: What If #4: `videos/dinosaurs/4.video.mp4` (35.8 sn; rex/raptor/anky çizimleri main.js içinde).
- 2026-11-14: What If #5: `videos/mars-life/5.video.mp4` (38.4 sn). 2–5 tek mesajda (4 metin+ses) geldi, sırayla üretildi.
- 2026-11-14: What If #6: `videos/money-zero/6.video.mp4` — "What If Money Suddenly Became Worthless?" (40 sn).
- 2026-11-14: What If #7: `videos/no-oceans/7.video.mp4` — "What If All the Oceans Disappeared?" (37 sn).
- 2026-11-14: What If #8: `videos/mind-read/8.video.mp4` — "What If Humans Could Read Minds?" (34 sn).
- 2026-11-14: What If #9: `videos/ai-rule/9.video.mp4` — "What If AI Controlled the Entire World?" (41 sn).
- 2026-11-14: What If #10: `videos/sun-gone/10.video.mp4` — "What If the Sun Disappeared for 24 Hours?" (33 sn).
- 2026-11-14: What If #11: `videos/ancient-tech/11.video.mp4` — "What If Ancient Civilizations Had Modern Technology?" (38 sn).
- 2026-11-14: What If #12: `videos/underwater/12.video.mp4` — "What If Humans Could Breathe Underwater?" (42 sn).
- 2026-11-14: What If #13: `videos/asteroid/13.video.mp4` — "What If an Asteroid Hit Earth Tomorrow?" (38 sn).
- 2026-11-14: What If #14: `videos/multiverse/14.video.mp4` — "What If Parallel Universes Were Real?" (35 sn).
- 2026-11-16: 1.video için YT Shorts kapağı: `videos/moon-gone/1.video-kapak.jpg` (cover.js).
- 2026-11-16: 2.video kapağı: `videos/earth-stop/2.video-kapak.jpg`.
- 2026-11-17: 3.video kapağı: `videos/no-sleep/3.video-kapak.jpg`. Not: kit index.html zaten whatif.js içerir; cover.html'de sadece main.js→cover.js değiştir.
- 2026-11-17: 4.video kapağı: `videos/dinosaurs/4.video-kapak.jpg`.
- 2026-11-19: 5.video kapağı: `videos/mars-life/5.video-kapak.jpg`.
- 2026-11-21: 6.video kapağı: `videos/money-zero/6.video-kapak.jpg`.
- 2026-11-23: 7.video kapağı: `videos/no-oceans/7.video-kapak.jpg`.
- 2026-11-23: Caveman skill'leri kuruldu (kullanıcı: 'her code kanalına kur'), kaynak branch claude/magical-mccarthy-tcjaz8 a61130e.
- 2026-11-24: 8.video kapağı: `videos/mind-read/8.video-kapak.jpg`.
- 2026-11-25: 9.video kapağı: `videos/ai-rule/9.video-kapak.jpg` (metne göre).
- 2026-11-26: Seri2 #1 `videos/s2-oxygen/1.video.mp4` (60fps, 1440p finalize; mp4 git dışı, raw.mp4 da). Not: finalize çıktısı ~200MB > GitHub 100MB sınırı.
- 2026-11-26: Seri2 1–10 teslim edildi (60fps, 1440p finalize; büyük mp4'ler git dışı). 10.video transkriptinde Whisper boşluğu elle düzeltildi.
