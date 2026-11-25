// YT Shorts kapak — "What If AI Controlled the Entire World?" (metne göre: tek AI, altyapı, savaş/yoksulluk yok, özgürlük yok)
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bg = ctx.createRadialGradient(540, 860, 80, 540, 860, 1100); bg.addColorStop(0, '#0c1630'); bg.addColorStop(1, '#020309'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // dijital ızgara
  ctx.strokeStyle = 'rgba(79,240,255,.08)'; ctx.lineWidth = 2; for (let x = 0; x <= W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y <= H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const cx = 540, cy = 860, r = 220;
  // altyapı devre hatları (her yöne)
  ctx.strokeStyle = 'rgba(79,240,255,.55)'; ctx.lineWidth = 5; ctx.shadowColor = '#4ff0ff'; ctx.shadowBlur = 14;
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + Math.PI / 8, x1 = cx + Math.cos(a) * (r + 60), y1 = cy + Math.sin(a) * (r + 60), x2 = cx + Math.cos(a) * 520, y2 = cy + Math.sin(a) * 520; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y1 + (i % 2 ? 0 : 0)); ctx.lineTo(x2, y2); ctx.stroke(); ctx.fillStyle = '#4ff0ff'; ctx.beginPath(); ctx.arc(x2, y2, 12, 0, TAU); ctx.fill(); }
  ctx.shadowBlur = 0;
  // AI gözü: dönen halkalar + kırmızı çekirdek
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * (i % 2 ? -.5 : .7) + i); ctx.strokeStyle = 'rgba(255,42,74,.7)'; ctx.lineWidth = 8 - i * 2; ctx.setLineDash([40 + i * 20, 24]); ctx.beginPath(); ctx.arc(0, 0, r + 40 + i * 42, 0, TAU); ctx.stroke(); ctx.restore(); }
  const g = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, r); g.addColorStop(0, '#fff'); g.addColorStop(.18, '#ffd0d6'); g.addColorStop(.45, '#ff2a4a'); g.addColorStop(1, '#2a0408');
  ctx.fillStyle = '#14161e'; ctx.beginPath(); ctx.arc(cx, cy, r + 14, 0, TAU); ctx.fill(); ctx.fillStyle = g; ctx.shadowColor = '#ff2a4a'; ctx.shadowBlur = 70; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#05000a'; ctx.beginPath(); ctx.arc(cx, cy, 60, 0, TAU); ctx.fill();
  // kafes: özgürlük yok
  ctx.strokeStyle = 'rgba(79,240,255,.9)'; ctx.lineWidth = 14; ctx.shadowColor = '#4ff0ff'; ctx.shadowBlur = 30; ctx.lineCap = 'round';
  for (let i = 0; i <= 7; i++) { const x = cx - 210 + i * 60; ctx.beginPath(); ctx.moveTo(x, 1000); ctx.lineTo(x, 1400); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(cx - 230, 1000); ctx.lineTo(cx + 230, 1000); ctx.moveTo(cx - 230, 1400); ctx.lineTo(cx + 230, 1400); ctx.stroke(); ctx.shadowBlur = 0;
  // kafes içindeki insan
  ctx.save(); ctx.shadowColor = 'rgba(160,220,255,.9)'; ctx.shadowBlur = 24; human(cx, 1380, 300); ctx.restore();
  // yan etiketler: AI'nın vaatleri
  txt('NO WAR', 230, 720, 74, '#4ff0ff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('NO POVERTY', 830, 720, 70, '#4ff0ff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('NO CRASHES', 830, 880, 70, '#4ff0ff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('NO FREEDOM', 240, 1180, 76, '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 16, glow: '#ff2e45', blur: 30 });
  // kanca metni
  txt('ONE AI', W / 2, 330, 170, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 20 });
  txt('RULES ALL', W / 2, 510, 200, '#4ff0ff', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: '#4ff0ff', blur: 45 });
  // alt etiket
  ctx.save(); ctx.translate(W / 2, 1490); ctx.rotate(-.03); ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.roundRect(-400, -62, 800, 124, 40); ctx.fill(); txt('TOTAL CONTROL', 0, 4, 92, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  vignette(.55);
};
