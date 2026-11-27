# Proje Notları (Claude için)

## Kullanıcı tercihleri
- **Çalışırken anlatma:** Video/iş yaparken adım adım açıklama yazma; sadece bitince kısa özet.
- **Müzik:** Videolara müzik KOYMA (kullanıcı sonradan ekler); kendi seslendirmesini verirse onu kullan. Foley/cızırtı yok.
- **Tam ekran video:** Görüntü ekranın TAMAMINI kaplasın. Kağıt kenar boşluğu / beyaz sayfa / çerçeve YOK.
  Altyazılar görüntünün üzerinde, okunur şekilde.
- **Daha akıcı ve hareketli:** Kesik kesik değil; animasyon akıcı (her karede hareket, "on twos" yok),
  bol kamera hareketi, sahneler arası kesintisiz/akan geçişler, durağan plan az.
- **Motivasyon karakteri bu kanalda KULLANILMAZ** ("Kırmızı Neon" yalnızca motivasyon kanalına ait; `characters/` alınmadı).
  Body Hacks kanalı için ayrı görsel kimlik/karakter gerekirse kullanıcıya sor.
- **Kısa iletişim:** Yaptıklarını uzun uzun açıklama. İşi en iyi şekilde yap, sonunda yalnızca kısa bir özet ver.
- **Videolarda ses:** Çizim/boyama sırasında cızırtı, kalem, fırça hışırtısı gibi efektler İSTEMİYOR. Bu tür foley'i
  ya hiç koyma ya da neredeyse duyulmayacak kadar kıs; ses temiz olsun (anlatım + müzik ön planda).
- **Videolarda anlatım:** Sıkıcı olmasın. Daha enerjik, merak uyandıran, akıcı bir anlatım; güçlü kanca, daha canlı ses
  ve tempo; düz ders anlatımı gibi olmasın.
- Lemo-Opuscar animasyonlarını beğendi; video işlerinde bu kütüphaneyi kullan.
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
- Türkçe/İngilizce TTS: Kokoro-82M (kokoro-onnx, Apache-2.0; model `core/tts/kokoro-v1.0.onnx`, ses örn. `am_puck`).
  Kullanıcı kendi sesini verirse onu kullan. CREDITS dosyasına ses/font/araç lisanslarını yaz.
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

## Video dersleri (motivasyon kanalından, genel — tekrarlama)
Bir videoda beğenilmeyen hatalar: (1) hareketin açısı yanlış çizildi — açıyı varsayma, örnek/gerçek hayata bak
(ör. barfiks önden); (2) tek açılı rig — hareket başka açı gerektiriyorsa ayrı rig yaz; (3) nesne/el teması ve ana
hareket okunmuyordu; (4) karakter/nesneler kadraja göre çok küçük, ekran boş; (5) robotik hareket — hepsi aynı easing,
kişilik/ritim yok; (6) hikâye anları zayıf, kartlar düz ve jenerik; (7) tam render'dan ÖNCE kritik hareketin kısa
testini render et, kare şeridiyle (0.1–0.2 sn, büyütülmüş) örnekle karşılaştır, sonra devam et.
Sağlık/vücut konularında bilgi doğruluğu esas: iddialar bilimsel olarak savunulabilir olsun, tıbbi tavsiye/tedavi vaadi verme.

## Body Hacks kanalı (bu repo)
- YT Shorts sağlık ve vücut hileleri kanalı. Video araçları: Lemo-Opuscar, HyperFrames, onetake, gbro-collage-broll,
  agency-agents ajanları, `yt-shorts-master-generator` yeteneği. Örnek çıktı: `videos/body-heals/`.
- Kullanıcı konu verince video yaptırılacak.

## Ortam
- Node 22 / npm 10, Python 3.13 / pip 24 kurulu.
- Çalışma branch'i: `claude/node-version-check-dka4rk`. PR yalnızca istenirse aç.

Ayrıntılı geçmiş: `NOTLAR.md`

## Ortak video kalite araçları (2026-11-19, kullanıcı tüm kanallar için onayladı)
Tüm Shorts kanallarında (Tarih, Finans, What If, Body Hacks, Beyond, Motivasyon) GEREKTİĞİNDE kullan. Klasör: `videos/_tools/`
- İlk kullanımda: `bash videos/_tools/setup.sh` (onnxruntime, rembg, opencv + modeller → `videos/_models/`, git'e girmez).
- **finalize.sh** — HER videonun son adımı: `bash videos/_tools/finalize.sh in.mp4 out.mp4` → 1440×2560 (YouTube 1440p+ yüklemelere
  VP9/AV1 verir, görüntü belirgin netleşir), gradfun bantlaşma önleme, ses −14 LUFS (2 geçiş), ~35 Mbps. Ses izi yoksa uyarır.
  Kendi motorunda mümkünse 60 fps render et (finalize kaynak fps'i korur).
- **upscale.py** — düşük çözünürlüklü foto/arşiv görseli (genişlik < 1500 px) → Real-ESRGAN x4: `python3 videos/_tools/upscale.py in.jpg out.jpg`.
- **depth.py + parallax.py** — Depth-Anything-V2-Small (Apache-2.0) ile derinlik → fotoğrafa 2.5D "3D foto" kamera hareketi
  (push/pan/orbit). Fotoğraf/stok görsel kullanan sahnelerde düz zoom yerine bunu kullan:
  `python3 videos/_tools/parallax.py foto.jpg klip.mp4 4 push` veya Python'da `Parallax(img).frame(k, W, H, move)`.
- **cutout.py** — rembg (MIT) ile nesne/kişi dekupe (RGBA): öne çıkarma, gölge, ayrı parallax katmanı için.
- **HyperFrames** (eklenti kurulu, `npx hyperframes`): düz vektör grafiklerde (Finans/What If/Body Hacks) derinlik için
  HTML/CSS/GSAP ile blur, 3B dönüş, gölge, glow, ışık efektleriyle render et — "düz şablon" görünümünden kaçın.
- Analizde bulunanlar: kanallar 2–4 Mbps/1080p/30fps yüklüyordu (bantlaşma, yumuşama); Motivasyon `obsession.mp4`'te ses izi YOK;
  Finans sesi −16.7 LUFS (kısık). Örnek test: `videos/_tools/demo_parallax.mp4`.

- **Hook yeteneği:** `.claude/skills/shorts-hook/` — HER kanalda, HER videoda zorunlu: ilk 3 saniye kanca tasarımı + render sonrası kontrol listesi.
## Caveman (token tasarrufu, 2026-11-23, kullanıcı tüm oturumlara istedi)
- Kaynak: https://github.com/JuliusBrussee/caveman (commit b89752f, Apache-2.0; LICENSE/NOTICE `.claude/skills/caveman/` içinde).
- Kurulu skill'ler: `.claude/skills/{caveman,ultracave,megacave,caveman-commit,caveman-review,caveman-compress,caveman-help}`.
- **Varsayılan açık:** Her oturumda yanıtları caveman kurallarıyla ver (önce cevap, dolgu yok, her teknik bilgi korunur,
  kod/komut/yol/sayı birebir). Türkçe yanıtlara da uygula. Güvenlik uyarısı / geri alınamaz işlem / kafası karışan kullanıcı
  → tam cümle. Kapatma: "stop caveman" / "normal mode". Daha kısa: `/caveman ultra`.
- Tam paket (`npx @caveman-ai/cli`: yerel proxy, Auto model seçimi, tool-output sıkıştırma) bilgisayara kurulur; bulut
  container geçici olduğu için kurulmadı.

## Shorts seri üretim kuralı (2026-11-25, kullanıcı)
- Kullanıcı ses + metin sırayla yollar; videoları ATILMA SIRASIYLA hazırla.
- Çıktı adı = ses dosyasının adı: "1.video ses" → `1.video.mp4` (render ve gönderim bu isimle).
- YT Shorts 1080×1920 kaynak, yüksek kalite; son adım `videos/_tools/finalize.sh` (1440×2560). Gönderim ≤400 MB.
- Kullanıcıya yazarken caveman tarzı (kısa).

## Disk yeri kuralı (2026-11-26, kullanıcı)
- Yer kalmazsa: tüm kanallarda EN ESKİ 6–7 videonun çıktı dosyalarını (mp4, out/) silme izni var. Önce yalnızca gerekirse.

## Parçalı gönderim (2026-11-27, kullanıcı)
- İstenirse her videoyu `ffmpeg -c copy -f segment` ile 3 parçaya böl (≤~80 MB), adı `N.video parça K.mp4`. Kalite aynı; sıkıştırılmış küçük sürüm İSTEMİYOR. Numara sırasıyla gönder.
