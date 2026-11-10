# Proje Notları (Claude için)

## Kullanıcı tercihleri
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

## Ortam
- Node 22 / npm 10, Python 3.13 / pip 24 kurulu.
- Çalışma branch'i: `claude/node-version-check-dka4rk`. PR yalnızca istenirse aç.

Ayrıntılı geçmiş: `NOTLAR.md`
