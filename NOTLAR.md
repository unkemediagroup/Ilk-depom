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
- 2026-11-13: Finans Shorts kanalı başladı. Diğer kanallardaki genel tercihler/dersler (AYAZ karakteri hariç) CLAUDE.md'ye aktarıldı; yeni skill `.claude/skills/finans-shorts` (fin.js: grafik, para, sayaç, istatistik, geçiş, altyazı). Kullanıcı metin+ses verecek, sadece görsel+render istenir. Referans: https://youtu.be/fTTGALaRZoc (ortamda YouTube engelli, izlenemedi).
- 2026-11-13: İlk finans Shorts: `videos/bank-secret/` — "Bankalar paranı nasıl kullanıyor" (61.3 sn, kullanıcının sesi, müziksiz; 13 sahne: kasa kapısı hook→EMPTY, bankaya akan para + milyon sayacı, spot ışığında finans ağı, $1,000 yatırım + kasaya X, rezerv donut, ipotek/iş/kart kredileri, %1 vs %8/12/20 çubuklar, PURE PROFIT farkı, para destelerinden imparatorluk + kumbaraya bozuk para, dev ?, aynı paranın bankalar arası döngüsü, dünya radarı, SUBSCRIBE CTA). words.py PyAV hatası için ffmpeg ile çözüyor.
- 2026-11-13: Finans Shorts #2: `videos/world-money/` — "Where Is Most of the World's Money Actually Located?" (56 sn, kullanıcının sesi, müziksiz; 12 sahne: uzaydan dünyaya dalış + yörüngede para halkası, perspektifli kasa: altın külçe piramidi + desteler, görüntü parçalanır WRONG, noktalı dünya haritası + düşen iğneler + büyüteç, banknot/bozuk para → 10×10 waffle %8, kareler dijitale döner %92 + binary yağmuru, ekrandaki sayılar → sunucu odası, POS'ta kart + transfer / 'MONEY MOVED $0', veritabanı tablosu güncellenir, rakamlar dev ?'e toplanır, para basma makinesi + değer çubuğu erir, CTA). Geliştirmeler: altyazı y=1530 (Shorts arayüzünden uzak), sürekli kamera kayması, yeni geçişler (push/glitch/cut-shatter). Yardımcı çizimler kite (fin.js) taşındı; pill() ortalama hatası düzeltildi.
- 2026-11-13: Finans Shorts #3: `videos/print-money/` — "Why Does Printing Money Not Make a Country Rich?" (60.3 sn, kullanıcının sesi, müziksiz; 11 sahne: kırmızı alarm + çıldıran borç saati + PRINT $ düğmesi, retro oyun ekranında CHEAT CODE → dişli çene kapanır GAME OVER, PRINTING ≠ RICH, terazi: kağıt para vs mal/hizmet, pizza 8 → 100 dilim, para arzı x5 / mallar aynı + banknot değeri erir, roket fiyat eğrisi + değersiz kumbara, HYPERINFLATION: 100T banknot + el arabası dolusu para = 1 ekmek, çöken ekonomi çubukları, 3B sallanan kart, ödenmiş ekstre + karttan bankaya akan paralar ?, CTA).
