// Kapak: How Did the Dollar Become the World's Strongest Currency?
const OR = '#ff9d1f', GR = C.green;
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
function barrelBig(x, y, s) { ctx.save(); ctx.translate(x, y);
  const g = ctx.createLinearGradient(-s * .5, 0, s * .5, 0); g.addColorStop(0, '#0a0e18'); g.addColorStop(.5, '#2a3550'); g.addColorStop(1, '#0a0e18');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .65, s, s * 1.3, s * .1); ctx.fill();
  ctx.fillStyle = '#3a4a6a'; for (const yy of [-.45, .45]) ctx.fillRect(-s * .5, yy * s - s * .03, s, s * .06);
  ctx.fillStyle = '#05070b'; ctx.beginPath(); ctx.ellipse(0, -s * .65, s * .5, s * .1, 0, 0, TAU); ctx.fill();
  // yeşil $ etiketi
  ctx.fillStyle = GR; ctx.shadowColor = GR; ctx.shadowBlur = 60; ctx.beginPath(); ctx.roundRect(-s * .36, -s * .2, s * .72, s * .48, 16); ctx.fill(); ctx.shadowBlur = 0;
  txt('$', 0, s * .04, s * .42, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  // taç
  ctx.save(); ctx.translate(0, -s * .8); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 50; ctx.beginPath(); ctx.moveTo(-s * .4, 0); ctx.lineTo(-s * .45, -s * .3); ctx.lineTo(-s * .18, -s * .08); ctx.lineTo(0, -s * .42); ctx.lineTo(s * .18, -s * .08); ctx.lineTo(s * .45, -s * .3); ctx.lineTo(s * .4, 0); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
  ctx.restore(); }
window.drawCover = function () {
  bgFinance(6, { tint: 'rgba(255,157,31,.28)', seed: 17, dot: '255,190,120', top: '#1a0d04', bot: '#030201' });
  // retro güneş ışınları
  for (let i = 0; i < 24; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,157,31,.09)' : 'rgba(255,107,53,.05)'; ctx.beginPath(); ctx.moveTo(W / 2, 1140); ctx.arc(W / 2, 1140, 1700, i / 24 * TAU, (i + 1) / 24 * TAU); ctx.fill(); }
  const sg = ctx.createRadialGradient(W / 2, 1140, 60, W / 2, 1140, 380); sg.addColorStop(0, 'rgba(247,197,72,.7)'); sg.addColorStop(1, 'rgba(247,197,72,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
  barrelBig(W / 2, 1140, 440);
  // başlık
  big('HOW DID THE', 200, 110, '#fff');
  big('DOLLAR', 330, 180, '#fff');
  big('BECOME KING?', 500, 160, OR, OR);
  // alt rozet: OIL → $
  ctx.save(); ctx.translate(W / 2, 1640); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = OR; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -110, 920, 220, 40); ctx.fill(); ctx.stroke();
  txt('OIL', -230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('SOLD IN', -230, 25, 60, OR, { align: 'center', font: 'Anton', weight: 400, glow: OR, blur: 30 });
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-2, -70, 4, 140);
  txt('ONLY', 230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('$', 230, 25, 110, GR, { align: 'center', font: 'Anton', weight: 400, glow: GR }); ctx.restore();
  vignette(.5);
};
