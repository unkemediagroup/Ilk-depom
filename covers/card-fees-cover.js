// Kapak: How Do Credit Cards Make Money for Banks?
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
function ccard(x, y, w, rot) { const h = w * .63; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.shadowColor = 'rgba(155,107,255,.8)'; ctx.shadowBlur = 80; const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, '#9b6bff'); g.addColorStop(1, '#2b136b'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .06); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.roundRect(-w * .38, -h * .18, w * .15, h * .24, 10); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 6; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(-w * .12, -h * .06, i * 18, -.7, .7); ctx.stroke(); }
  txt('4532  ••••  ••••  0097', 0, h * .2, w * .065, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('PAID IN FULL ✓', -w * .4, h * .38, w * .045, '#b8f5c8', { weight: 900, stroke: 0 }); ctx.restore(); }
window.drawCover = function () {
  bgFinance(2, { tint: 'rgba(155,107,255,.28)', seed: 5, dot: '190,160,255', top: '#0f0820', bot: '#030108' });
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? 'rgba(155,107,255,.07)' : 'rgba(155,107,255,.02)'; ctx.beginPath(); ctx.moveTo(W / 2, 1040); ctx.arc(W / 2, 1040, 1600, i / 18 * TAU, (i + 1) / 18 * TAU); ctx.fill(); }
  // karttan bankaya akan sikkeler
  ccard(420, 1000, 700, -.16);
  for (let i = 0; i < 7; i++) { const k = i / 6; coin(lerp(700, 900, k), lerp(1150, 1180, k) - Math.sin(k * Math.PI) * 200, 38, 0); }
  bank(860, 1420, 330, { glow: 'rgba(255,200,61,1)' });
  // başlık
  big('PAID IN FULL?', 200, 150, '#fff'); big('THE BANK STILL', 400, 160, '#fff'); big('PROFITS', 620, 240, C.gold, C.gold);
  // alt rozet: $100 → $97 mağaza / $3 banka
  ctx.save(); ctx.translate(W / 2, 1640); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = C.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-470, -100, 940, 200, 40); ctx.fill(); ctx.stroke();
  txt('$100', -330, 0, 100, '#fff', { align: 'center', font: 'Anton', weight: 400 }); arrow(-175, 0, 120, false, 1, { rot: -Math.PI / 2, col: '#fff', w: 24 });
  txt('STORE', 70, -55, 36, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('$97', 70, 22, 100, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green });
  txt('BANK', 300, -55, 36, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('$3', 300, 22, 110, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); ctx.restore();
  vignette(.5);
};
