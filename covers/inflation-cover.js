// Kapak: How Does Inflation Quietly Erode Your Money?
const ICE = '#9fe8ff', OR = '#ff9d1f';
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
function iceBlock(x, y, s, melt) { const h = s * (1 - .45 * melt), w = s * (1 - .1 * melt); ctx.save(); ctx.translate(x, y);
  const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, s); pg.addColorStop(0, 'rgba(159,232,255,.55)'); pg.addColorStop(1, 'rgba(159,232,255,0)'); ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(0, 10, s * 1.05, s * .2, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.moveTo(-w / 2, 0); for (let i = 0; i <= 12; i++) ctx.lineTo(-w / 2 + i * w / 12, -h + Math.sin(i * 1.7) * 14 + (i % 2 ? 12 : 0)); ctx.lineTo(w / 2, 0); ctx.closePath(); ctx.clip();
  ctx.save(); ctx.translate(0, -h * .5); bill(0, 0, s * .8, -.08, { val: '100' }); ctx.restore();
  const g = ctx.createLinearGradient(-w / 2, -h, w / 2, 0); g.addColorStop(0, 'rgba(225,250,255,.55)'); g.addColorStop(.5, 'rgba(159,232,255,.3)'); g.addColorStop(1, 'rgba(90,180,230,.5)'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -s, w, s);
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-w * .38, -h * .88); ctx.lineTo(-w * .18, -h * .66); ctx.stroke(); ctx.restore();
  for (let i = 0; i < 8; i++) { const dx = -w / 2 + (i + .5) * w / 8; ctx.fillStyle = 'rgba(159,232,255,.85)'; ctx.beginPath(); ctx.ellipse(dx, 16 + (i % 3) * 22, 9, 15, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
window.drawCover = function () {
  bgFinance(3, { tint: 'rgba(255,157,31,.26)', seed: 9, dot: '255,190,120', top: '#1a0d04', bot: '#030201' });
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,157,31,.07)' : 'rgba(255,157,31,.02)'; ctx.beginPath(); ctx.moveTo(W / 2, 1100); ctx.arc(W / 2, 1100, 1600, i / 18 * TAU, (i + 1) / 18 * TAU); ctx.fill(); }
  // yükselen fiyat okları
  arrow(150, 1250, 380, true, 1, { col: C.red, w: 40 }); arrow(930, 1200, 320, true, 1, { col: C.red, w: 36 });
  iceBlock(W / 2, 1360, 640, .3);
  big('YOUR SAVINGS', 210, 150, '#fff'); big('ARE', 360, 120, '#fff'); big('MELTING', 560, 250, OR, OR);
  ctx.save(); ctx.translate(W / 2, 1620); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = OR; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -100, 920, 200, 40); ctx.fill(); ctx.stroke();
  txt('BUYING POWER', -230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('100%', -360, 25, 72, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green }); txt('→', -235, 22, 64, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('91%', -110, 25, 84, C.red, { align: 'center', font: 'Anton', weight: 400, glow: C.red }); ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(40, -70, 4, 140); txt('GROCERIES', 250, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('$100 → $110', 250, 25, 64, C.gold, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore();
  vignette(.5);
};
