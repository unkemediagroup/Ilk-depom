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
- 2026-11-13: Finans Shorts #4: `videos/card-fees/` — "How Do Credit Cards Make Money for Banks?" (54.75 sn, kullanıcının sesi, müziksiz; 12 sahne: 12 ay PAID ✓ kartları, 10¢ + ekran çatlaması WRONG, faiz göstergesi %0 ama banka kârı artar, paralaks dükkan sokağı + spot, temassız ödeme dalgaları, büyüteçle HIDDEN FEE %2–3, INTERCHANGE FEE halkası, fiş + sankey akışı $100 → $97 mağaza / $3 banka, milyarlarca işlem sayacı + altınla dolan silo, makas banknottan pay keser, kumbara, ufalanan banknot (enflasyon), CTA).
- 2026-11-13: Finans Shorts #5: `videos/inflation/` — "How Does Inflation Quietly Erode Your Money?" (55.5 sn, kullanıcının sesi, müziksiz; 12 sahne: banka uygulaması SAFE ✓ → kilit açılır, görünmez hırsız eli (kesikli kontur) desteleri çalar + DAY sayacı, kum gibi dağılan INFLATION yazısı, bakiye $100 sabit / alışveriş arabası boşalır, $100 = market torbası, zaman çizgisi + fiyat etiketi $100→$110 (+10%), alım gücü pili %100→%91, nominal düz vs reel düşen çizgi (10 yıl %4 örnek), içinde $100 donmuş eriyen buz, zengin portföy pastası, şirket kulesi + hisse senetleri + mum grafik, CTA).
- 2026-11-13: Finans Shorts #6: `videos/shares/` — "Why Do Billionaires Buy Shares..." (59.5 sn, kullanıcının sesi, müziksiz; 12 sahne: bayraklı imparatorluk kuleleri + taç (100% MINE), %100 pasta dilimlere ayrılır (kurucu %20), hisse senetleri iskambil yelpazesi, uyarı üçgeni + kaldıraç altın yükü kaldırır, tek başına sahiplik = tüm risk → kule çöker + servet sayacı $0, yatırımcı ikonlarından şirkete para akar (OPM), hisse %20 vs oy gücü %60 çubukları + taç, hisse teminatı → $1B kredi / vergi $0 / SELL kilitli, riski paylaşan halka + taçlı kurucu, STEP 1 merdiveni, altın üstünde kalkan, CTA). Not: inflation sesi aynı dosya olarak 2. kez gönderildi; kullanıcıya soruldu, yeni konuya geçildi.
- 2026-11-13: Finans Shorts #7: `videos/trust/` — "How Do the World's Wealthiest Families Protect Their Fortunes?" (59.5 sn, kullanıcının sesi, müziksiz; 12 sahne: banka hesabı + hisse paneli çarpar → NOT EVEN CLOSE, 3 nesilli altın soy ağacı, evrak çantasından mühürlü TRUST belgesi, tapuda OWNER: YOU üstü çizilir → THE TRUST, malikane/işletme/yatırım TRUST küpüne akar, enerji kalkanından seken dava tokmağı/borç/veraset vergisi, trust sahip–aile anahtarla kullanır, bölünmüş ekran: kağıtta $0 BROKE / gerçekte $12B, altın sonsuzluk + GEN 1-5 çubukları, büyüyen domino zinciri (STEP ONE), $1,000,000 sayacı + hedef bayrağı, CTA).
- 2026-11-13: Finans Shorts #8: `videos/millionaire/` — "How Much Money Do You Really Need to Become a Millionaire?" (55.9 sn, kullanıcının sesi, müziksiz; 11 sahne: bordro yağmuru + EARN $1,000,000 sayacı, yalan makinesi + LIE damgası, slot makinesi ????, yokuştan büyüyerek inen kar topu (compound interest), INDEX FUND kavanozu + aylık $400–500, $1M çizgisini geçen gerçek hesaplı eğri ($450/ay, %7, 40 yıl ≈ $1.18M), katkı ($216K) vs toplam alan grafiği, %20 SEN / %80 PİYASA çubuğu + Zzz, kum saati, ters dönen kural tabelası, DEBT roketi, CTA).
- 2026-11-14: Finans Shorts #9: `videos/debt/` — "Why Do Wealthy People Use Debt?" (56.5 sn, kullanıcının sesi, müziksiz; 12 sahne: kredi kartı yemli fare kapanı SNAP!, perspektif satranç tahtasında DEBT atı hamlesi, TAX füzesinden kaçan altın yığını (DODGED), dalgalarda yat + $50M etiketi + SELL ✗, satış pastasını ısıran TAX pac-man (-$10M sermaye kazancı), hisseleri yutan BANK makinesi → nakit kredi, SECRET zarfı (LOAN ≠ INCOME) + hesap makinesi TAX 0.00, %3 faiz vs %10 büyüme yarışan çubuklar (örnek oranlar), üst/alt bölünmüş: örsü taşıyan ortalama kişi (BURDEN) / altın çekiç (TOOL), poker fişleri + zarlar, net değer çöküşü, CTA).
- 2026-11-14: Finans Shorts #10: `videos/billionaire-broke/` — "What Happens If a Billionaire Loses Their Money?" (57 sn; yıkım topu → BANKRUPT, altın paraşüt, LED kayan pano, kilitli cüzdan vs yanan başkalarının parası, tuğla duvar (kişisel/iş), çöken şirket, malikane+trust+offshore ada UNTOUCHED, $40B→0 kağıt servet + yatırımcı ağı + filiz NEXT VENTURE, oyun planı STRATEGY vs trajedi maskesi, dönen dev $, para birimi kürsüsü $/€/¥, CTA). Kullanıcı: video sonrası açıklama istemiyor (CLAUDE.md'ye eklendi).
- 2026-11-14: Finans Shorts #11: `videos/petrodollar/` — "How Did the Dollar Become the World's Strongest Currency?" (59.6 sn; ekonomi çubukları + $, ikiye bölünen $ (half the story), panayır güç ölçeri KING + taç, retro 1970s güneş + ampul, el sıkışma + AGREEMENT parşömeni (USA/SAUDI ARABIA), çöl petrol kuleleri + jetler + koruma kalkanı, OIL varili ONLY IN $ / €¥£₣ çarpı, yakıt pompası etrafında dolar biriktiren ülkeler, DEMAND ∞ eğrisi → tahtta taçlı $, pompa krikoları + skyline, taç Alplere uçar + kilit, anahtar deliği + ACCOUNT #00042, CTA).
- 2026-11-14: Finans Shorts #12: `videos/swiss-banks/` — "Why Are Swiss Banks So Famous?" (46.7 sn; dönen İsviçre bayrağı + altın halka, taş tablet RULE #1 TOTAL SECRECY, şşş dudak+parmak, sepya 1934 gazete, bankacı + CRIMINAL OFFENSE + kelepçe, anonim hesap kartı (isim karartılır, numara yazılır), deniz feneri SAFE HAVEN + milyarder/kraliyet/politikacı tekneleri, vergi/dava/hükümet bulutları + kırmızı şemsiye, fermuarlı ağız + altın kuleler, gizemli ülke sıralaması, CTA).
- 2026-11-14: Finans Shorts #13: `videos/rich-countries/` — "How Do the World's Wealthiest Countries Make Their Money?" (56 sn; vergi hunisi → hazine, RICH çizgisine ulaşamayan termometre NOT ENOUGH, devre kartı küresel sistem, US FINANCIAL NETWORK gişesinden geçen bölge kamyonları, petrol okyanusu platformları → gezegene enerji kablosu, İrlanda/Lüksemburg mıknatısları + TAX CUT % + MEGA CORP kuleleri, GLOBAL RULES kitabı OWNED, piyasa ipine bağlı ülke kuklaları, çöküş eğrisi + para girdabı, CTA).
