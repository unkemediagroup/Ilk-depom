# Proje Notları (Claude için)

## Kullanıcı tercihleri
- **Kısa iletişim:** Yaptıklarını uzun uzun açıklama. İşi en iyi şekilde yap, sonunda yalnızca kısa bir özet ver.
- **Videolarda ses:** Çizim/boyama sırasında cızırtı, kalem, fırça hışırtısı gibi efektler İSTEMİYOR. Bu tür foley'i
  ya hiç koyma ya da neredeyse duyulmayacak kadar kıs; ses temiz olsun (anlatım + müzik ön planda).
- **Videolarda anlatım:** Sıkıcı olmasın. Daha enerjik, merak uyandıran, akıcı bir anlatım; güçlü kanca, daha canlı ses
  ve tempo; düz ders anlatımı gibi olmasın.
- Lemo-Opuscar animasyonlarını beğendi; video işlerinde bu kütüphaneyi kullan.
- **Tam ekran video:** Görüntü ekranın TAMAMINI kaplasın. Kağıt kenar boşluğu / beyaz sayfa / çerçeve YOK
  (Woodcut'taki "paper margin" kuralını uygulama). Altyazılar görüntünün üzerinde, okunur şekilde.
- **Daha akıcı ve hareketli:** Kesik kesik değil; karakter animasyonu akıcı (her karede hareket, "on twos" yok),
  bol kamera hareketi, sahneler arası kesintisiz/akan geçişler, durağan plan az.
- Kullanıcı Türkçe konuşur; Türkçe ve kısa yanıt ver.
- Kullanıcı konuşmaların kaybolmasını istemez: önemli kararları ve bilgileri
  bu dosyaya / `NOTLAR.md`'ye yaz, commit et ve branch'e push et.
- Kullanıcı OmniRoute'un her oturumda hazır olmasını ister (bkz. `.claude/skills/omniroute`).
  Hook kurulumu yapar; sunucu otomatik başlatılmaz.
- Kullanıcı claude-mem denedi; cloud container geçici olduğu için kalıcı değil.
  Kalıcılık dosyalarla (CLAUDE.md, NOTLAR.md) sağlanır.

## OmniRoute paneli
- Panel / API adresi: `http://localhost:20128` (API: `http://localhost:20128/v1`).
- Başlatma: `OMNIROUTE_SERVER_HOST=127.0.0.1 omniroute serve` (yalnızca yerel erişim;
  varsayılan 0.0.0.0 + API anahtarsız olduğu için güvensiz).

## Eklentiler
- `claude-code-setup` (Anthropic resmi eklentisi): Projeyi analiz edip uygun
  hook, skill, MCP sunucusu ve subagent önerileri üretir
  (skill: `claude-automation-recommender`). `.claude/settings.json` içinde
  etkinleştirildi. Kullanım: "projem için Claude Code otomasyonları öner".

## Agency Agents (uzman ajanlar)
- Kaynak: https://github.com/msitarzewski/agency-agents (commit 8ae6164, MIT).
- `.claude/agents/` altında 92 ajan kurulu: engineering, testing,
  project-management, design. Uygun işte ilgili ajanı kullan
  (örn. frontend, backend, test, UI tasarım).
- Diğer bölümler (marketing, security, product, sales, specialized vb.) kullanıcı
  isterse eklenir:
  `git clone --depth 1 https://github.com/msitarzewski/agency-agents` ardından
  `./scripts/install.sh --tool claude-code --division <bölüm> --path <proje>/.claude/agents --no-interactive`
- Not: ajan sayısı arttıkça her oturumun bağlamı şişer; yalnızca gerekenleri ekle.

## Video üretimi (Lemo-Opuscar)
- Eklenti olarak kalıcı kurulu: `lemo-opuscar@lemolab` (`.claude/settings.json`).
- Kütüphane: https://github.com/lemomo-ai/lemo-opuscar (MIT) — kodla film stilleri; talimatlar AGENTS.md / DIRECTOR.md / TECHNIQUE.md.
- İlk video: `videos/body-heals/` ("Did you know your body can heal itself?", Watercolor Brush, 1080×1920, 50.5 s, İngilizce ses + altyazı).
- Bu container'da çalıştırma notları: `PLAYWRIGHT_CHROME=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`;
  sistem ffmpeg'i 6.1 → pip `imageio-ffmpeg` (ffmpeg 9) PATH'e konur; asset paketleri GitHub release'inden iner;
  Whisper (asr_check) çalışır: "Ilk-depom" cloud ortamı huggingface.co ve CDN adreslerine izin veriyor (Default ortamda engelli).
- Microscope Story gibi gerçek görüntü isteyen stiller burada zor; kodla çizilen stiller (Watercolor, Whiteboard…) tercih edilir.

## onetake (skill)
- `.claude/skills/onetake/` — https://github.com/feitangyuan/onetake (commit abb6d17), kesintisiz "tek plan" ürün/tanıtım
  hareketli videoları (10–60 sn). Örnek videolar (mp4/gif) ve 3 MB üstü dosyalar repoya alınmadı.
- **Lisans: PolyForm Noncommercial** — yalnızca ticari olmayan kullanım. Para kazanılan / müşteri işi için ücretli
  Pro lisans gerekir; ticari bir işte kullanmadan önce kullanıcıyı uyar.
- Gereken: python3 + playwright (chromium), numpy, scipy, Pillow, matplotlib.

## gbro-collage-broll (skill)
- `.claude/skills/gbro-collage-broll/` — https://github.com/pyang5166/gbro-collage-broll (commit a1a4ee2, MIT).
  ~5 sn'lik bir cümleden 9:16 yarım-ton kağıt kolaj B-roll klibi (720×1280, 5 sn, sessiz).
- Gereken: `GEMINI_API_KEY` (ücretli, kullanım başına) ve görsel üretim aracı (Codex `image_gen`; Claude Code'da yok,
  alternatif gerekir). Anahtar repoya/sohbete yazılmaz, `request_credential` ile alınır.

## HyperFrames (eklenti)
- `hyperframes@hyperframes` eklentisi `.claude/settings.json`'da açık — https://github.com/heygen-com/hyperframes (Apache-2.0).
  HTML'den video üretir (ürün tanıtımı, altyazı, overlay, hareket); 9 skill, ana skill `/hyperframes:hyperframes`.
- Render için CLI: `npx hyperframes` (npm'den iner). Ücretsiz; Studio'nun Pro planı ayrıca ücretli modeller ekler.

## Ortam
- Node 22 / npm 10, Python 3.13 / pip 24 kurulu.
- Çalışma branch'i: `claude/node-version-check-dka4rk`. PR yalnızca istenirse aç.

Ayrıntılı geçmiş: `NOTLAR.md`
