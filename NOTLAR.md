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

## 2026-11-14: Zengin yaşamı YT Shorts serisi
- Kullanıcı metin + ses yollayacak; her video sırasıyla `videos/zengin/1.video.mp4`, `2.video.mp4`… olarak adlandırılacak.
- Görseller: gerçek fotoğraf öncelikli (animasyon yalnızca zorunluysa). Ana karakter kullanılmaz.
- Ortam: Pexels proxy anahtarı geçersiz (401), kullanıcı yeni anahtar formunu reddetti. Openverse/Unsplash/Pixabay engelli;
  Wikimedia Commons erişilebilir (API zaman zaman rate-limit). Gerekirse izin ekranda istenecek.
- ffmpeg 9: `pip install imageio-ffmpeg`.
- **Pexels API yerine (kullanıcı: "Pexels kodunu es geç"):** HuggingFace üzerinden gerçek Pexels medyası (erişim açık, hızlı):
  - Fotoğraf: `ujin-song/pexels-image-60k` (58.5k foto, MIT). İndeks `tools/pexels_index.jsonl.gz` (caption+queries),
    indirme `python3 tools/pexels_fetch.py <index.jsonl> <outdir> <id>...` (row-group paralel aralık isteği, ~15 sn/grup).
  - Video: `zengxianyu/open-sora-pexels-subset` (9.750 klip, çoğu 1080×1920/4K). İndeks `tools/pexels_video_index.json.gz`,
    indirme `python3 tools/pexels_video_fetch.py <index.json> <outdir> <sample_id>...`.
  - Yedek: Wikimedia Commons (web sayfası açık, API/upload ortak IP yüzünden sık 429).
- 2026-11-14 izinler (kullanıcı onayladı): ortama incompetech.com, archive.org, fonts.googleapis/gstatic, pixabay eklendi
  (pixabay Cloudflare yüzünden 403). Müzik: `tools/fetch_music.sh` → `assets/music/` (Kevin MacLeod, CC BY 4.0, açıklamaya kredi yaz).
  Fontlar: `assets/fonts/` (Anton, Bebas Neue, Montserrat, Playfair Display). Altyazı zamanlaması: faster-whisper `medium` (HF'den iner).
  Ortama setup script eklendi: pip paketleri + müzikler her yeni oturumda otomatik kurulur.
