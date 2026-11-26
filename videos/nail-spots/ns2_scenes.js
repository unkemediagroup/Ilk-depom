// ===== 19.video — WHITE SPOTS ON FINGERNAILS (portrait world 1080×1920) =====
function nailPath(cx, top, w, h) { ctx.beginPath(); ctx.moveTo(cx - w / 2, top + h); ctx.lineTo(cx - w / 2, top + w * .45); ctx.quadraticCurveTo(cx - w / 2, top, cx, top); ctx.quadraticCurveTo(cx + w / 2, top, cx + w / 2, top + w * .45); ctx.lineTo(cx + w / 2, top + h); ctx.quadraticCurveTo(cx, top + h + 40, cx - w / 2, top + h); ctx.closePath(); }
function fingerTop(u, s, o) {                                                    // big fingertip seen from above with nail & white spots
  bgDeep(s, o.hue || ['#2a2030', '#0e0a12']); const cx = 540, ty = o.tapY ? o.tapY(s) : 0;
  ctx.save(); ctx.translate(0, ty + 100);
  ctx.fillStyle = '#e2ad8a'; ctx.beginPath(); ctx.roundRect(cx - 230, 420, 460, 1700, [220, 220, 40, 40]); ctx.fill(); ctx.strokeStyle = 'rgba(160,100,70,.4)'; ctx.lineWidth = 8; for (const y of [1500, 1560]) { ctx.beginPath(); ctx.moveTo(cx - 200, y); ctx.quadraticCurveTo(cx, y + 30, cx + 200, y); ctx.stroke(); }
  const top = 520, w = 340, h = 560; nailPath(cx, top, w, h); const ng = ctx.createLinearGradient(0, top, 0, top + h); ng.addColorStop(0, '#fbeee8'); ng.addColorStop(.18, '#f6c6c0'); ng.addColorStop(1, '#eba6a4'); ctx.fillStyle = ng; ctx.fill(); ctx.strokeStyle = 'rgba(180,110,100,.6)'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(cx, top + h - 40, 120, 50, 0, Math.PI, TAU); ctx.fill();
  ctx.save(); nailPath(cx, top, w, h); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(cx - 120, top, 40, h);
  if (o.spots) { const g = o.grow ? clamp(o.grow(u)) : 1, pts = [[-60, .55], [40, .4], [90, .62], [-20, .3]]; for (const [dx, f] of pts) { const yy = top + h - (h * (1 - f)) * g - 30; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(cx + dx, yy, 22, 12, 0, 0, TAU); ctx.fill(); spark(cx + dx, yy, 40, .4, '255,255,255'); } }
  ctx.restore(); ctx.restore();
  if (o.ring) { const p = .5 + .5 * Math.sin(s * 4); ctx.strokeStyle = `rgba(255,210,63,${.5 + .5 * p})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx + 15, top + 400 + ty, 200 + p * 20, 0, TAU); ctx.stroke(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 480, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function calciumMyth(u, s) {
  bgDeep(s, ['#1e2a3a', '#0a1016']); ctx.save(); ctx.translate(540, 1000); ctx.rotate(-.08);
  ctx.fillStyle = '#f2f2f6'; ctx.beginPath(); ctx.moveTo(-170, -200); ctx.lineTo(0, -330); ctx.lineTo(170, -200); ctx.lineTo(170, 330); ctx.lineTo(-170, 330); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#4a8ad8'; ctx.fillRect(-170, -60, 340, 180); ctx.textAlign = 'center'; txt('MILK', 0, 60, 90, '#fff', 'rgba(0,0,0,0)', 0, '400', 'Anton'); ctx.restore();
  ctx.textAlign = 'center'; txt('LACK OF CALCIUM?', 540, 540, 100, '#fff', '#000', 14, '400', 'Anton');
  const k = eo(clamp((u - .4) * 4)); if (k > 0) { ctx.save(); ctx.translate(540, 1000); ctx.rotate(-.15); ctx.scale(1.6 - .6 * k, 1.6 - .6 * k); ctx.globalAlpha = k; ctx.strokeStyle = '#ff3a3a'; ctx.lineWidth = 18; ctx.beginPath(); ctx.roundRect(-300, -110, 600, 220, 30); ctx.stroke(); txt('MYTH', 0, 60, 170, '#ff3a3a', 'rgba(0,0,0,.5)', 10, '400', 'Anton'); ctx.restore(); }
}
function pct99(u, s) {
  bgDeep(s, ['#2a1a2a', '#0e080e']); const k = eo(clamp(u * 1.6)); ctx.textAlign = 'center'; txt(Math.round(k * 99) + '%', 540, 900, 300, '#fff', '#5a2a7a', 30, '400', 'Anton');
  txt('TINY BRUISES', 540, 1100, 110, '#ffd23f', '#000', 16, '400', 'Anton'); label('from minor physical trauma', 540, 1200, 50, '#e8d0ff');
}
function oops3(u, s) {                                                           // three everyday bumps
  bgDeep(s, ['#2a1a14', '#100a08']);
  const tile = (y, i, title, draw) => { const k = eo(clamp(u * 3 - i * .7)); ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 300, 0); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(90, y - 140, 900, 280, 40); ctx.fill(); draw(270, y); ctx.textAlign = 'left'; txt(title, 450, y + 30, 86, '#fff', '#000', 14, '400', 'Anton'); ctx.restore(); };
  tile(520, 0, 'DESK TAP', (x, y) => { ctx.fillStyle = '#8a5a3a'; ctx.fillRect(x - 120, y + 40, 240, 40); const b = Math.abs(Math.sin(s * 6)) * 60; ctx.fillStyle = '#e2ad8a'; ctx.beginPath(); ctx.roundRect(x - 30, y - 120 - b + 60, 60, 120, 30); ctx.fill(); if (b < 10) spark(x, y + 40, 80, .8, '255,220,120'); });
  tile(830, 1, 'JAMMED', (x, y) => { ctx.fillStyle = '#7a5a3a'; ctx.fillRect(x - 120, y - 20, 240, 120); ctx.fillStyle = '#5a3a24'; ctx.fillRect(x - 120, y - 20, 240, 20); ctx.fillStyle = '#e2ad8a'; ctx.beginPath(); ctx.roundRect(x - 30, y - 140, 60, 130, 30); ctx.fill(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 8; for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + d * 50, y - 60); ctx.lineTo(x + d * 90, y - 90); ctx.stroke(); } });
  tile(1140, 2, 'MANICURE', (x, y) => { ctx.fillStyle = '#e2ad8a'; ctx.beginPath(); ctx.roundRect(x - 40, y - 100, 80, 200, 40); ctx.fill(); ctx.fillStyle = '#ff5a8a'; ctx.beginPath(); ctx.roundRect(x - 30, y - 92, 60, 70, [30, 30, 8, 8]); ctx.fill(); ctx.save(); ctx.translate(x + 70, y - 40 + Math.sin(s * 5) * 10); ctx.rotate(-.6); ctx.fillStyle = '#c0c0d0'; ctx.fillRect(-10, -100, 20, 200); ctx.restore(); });
}
// side cross-section: matrix under cuticle makes nail; a damaged pocket rides outward with growth
function nailSide(u, s, o) {
  bgDeep(s, ['#2a1a20', '#0e080a']); const y0 = 980;
  ctx.fillStyle = '#e2ad8a'; ctx.beginPath(); ctx.moveTo(-200, y0 - 60); ctx.lineTo(820, y0 - 60); ctx.quadraticCurveTo(1000, y0 + 40, 820, y0 + 260); ctx.lineTo(-200, y0 + 260); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c87a6a'; ctx.beginPath(); ctx.ellipse(220, y0 + 10, 130, 60, 0, 0, TAU); ctx.fill(); ctx.textAlign = 'center'; label('NAIL MATRIX', 220, y0 + 150, 42, '#ffd0c0');
  ctx.fillStyle = '#f6d0c8'; ctx.beginPath(); ctx.moveTo(200, y0 - 40); ctx.lineTo(900, y0 - 70); ctx.lineTo(905, y0 - 120); ctx.lineTo(200, y0 - 100); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(160,100,90,.6)'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = '#d29a78'; ctx.beginPath(); ctx.ellipse(170, y0 - 80, 110, 50, -.1, 0, TAU); ctx.fill();
  const g = o.grow ? clamp(o.grow(u)) : 0, px = lerp(260, 820, g); if (o.pocket) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(px, y0 - 84 - g * 10, 34, 14, 0, 0, TAU); ctx.fill(); spark(px, y0 - 84, 70, .7); }
  if (o.grow) { for (let i = 0; i < 3; i++) { const ph = (s * .5 + i / 3) % 1; ctx.strokeStyle = `rgba(255,210,63,${.8 * Math.sin(ph * Math.PI)})`; ctx.lineWidth = 8; const x = 320 + ph * 480; ctx.beginPath(); ctx.moveTo(x - 30, y0 - 180); ctx.lineTo(x, y0 - 160); ctx.lineTo(x - 30, y0 - 140); ctx.stroke(); } }
  if (o.ruler) { ctx.fillStyle = '#f2e4b0'; ctx.fillRect(200, y0 + 330, 700, 90); ctx.fillStyle = '#3a2a10'; for (let i = 0; i <= 28; i++) ctx.fillRect(200 + i * 25, y0 + 330, 4, i % 4 ? 30 : 55); ctx.textAlign = 'center'; const m = Math.min(3, (o.wk || 0) + Math.floor(u * 2.2)); txt(['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEKS LATER…'][m], 540, 560, 110, '#ffd23f', '#000', 16, '400', 'Anton'); label('~3 mm / MONTH', 550, y0 + 395, 46, '#3a2a10'); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 560, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
