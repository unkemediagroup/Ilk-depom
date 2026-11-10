---
name: omniroute
description: OmniRoute AI gateway/router kullanımı. Kullanıcı OmniRoute, AI gateway, sağlayıcı yönlendirme, fallback veya ücretsiz AI katmanlarından bahsettiğinde kullan.
---

# OmniRoute

Açık kaynak AI gateway/router (npm: `omniroute`). Claude Code, Codex, Cursor,
Cline, Copilot gibi araçları tek bir OpenAI uyumlu endpoint üzerinden ~380 AI
sağlayıcısına bağlar; limit/çökme durumunda otomatik fallback yapar.

## Durum
- Her cloud oturumunda SessionStart hook'u (`.claude/hooks/session-start.sh`)
  eksikse `npm install -g omniroute` ile kurar. Komut: `omniroute`.
- Sunucu otomatik BAŞLATILMAZ. Gerektiğinde `omniroute` ile başlat,
  `omniroute --version` ile sürümü kontrol et.
- Panel: `http://localhost:20128`, API: `http://localhost:20128/v1`.
- Güvenli başlatma: `OMNIROUTE_SERVER_HOST=127.0.0.1 omniroute serve`
  (varsayılan 0.0.0.0 ve API anahtarsız dinler).
- Headless mod: `omniroute serve --headless`.

## Kurallar
- Sağlayıcı API anahtarlarını repoya veya sohbete yazma; gerekirse
  `request_credential` aracıyla güvenli form aç.
- Ücretsiz kotalar sağlayıcılara aittir; kullanıcı kendi hesaplarını bağlar.
- Claude Code'un kendi model bağlantısını kullanıcı istemeden değiştirme.
