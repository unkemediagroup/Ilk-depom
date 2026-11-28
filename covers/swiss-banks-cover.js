// Kapak: Why Are Swiss Banks So Famous?
const SWR = '#e3242b', GD = C.gold;
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
function padlock(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.arc(0, -s * .22, s * .3, Math.PI, TAU); ctx.lineTo(s * .3, -s * .22); ctx.moveTo(-s * .3, -s * .22); ctx.lineTo(-s * .3, -s * .22); ctx.stroke();
  const g = ctx.createLinearGradient(-s * .5, 0, s * .5, s); g.addColorStop(0, '#fff1a8'); g.addColorStop(1, C.gold2); ctx.fillStyle = g; ctx.shadowColor = GD; ctx.shadowBlur = 60; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .1, s, s * .85, s * .12); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#3a2a10'; ctx.beginPath(); ctx.arc(0, s * .2, s * .1, 0, TAU); ctx.fill(); ctx.fillRect(-s * .04, s * .2, s * .08, s * .22); ctx.restore(); }
window.drawCover = function () {
  bgFinance(7, { tint: 'rgba(227,36,43,.24)', seed: 21, dot: '255,140,150', top: '#1a0507', bot: '#030101' });
  // arkada dağ silueti (Alpler)
  ctx.fillStyle = '#1b1116'; ctx.beginPath(); ctx.moveTo(0, 1500); [[120, 1180], [300, 1320], [520, 1080], [720, 1300], [900, 1140], [1080, 1290]].forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  // kırmızı İsviçre bayrağı (arka plan ışıması)
  ctx.save(); ctx.translate(W / 2, 1000); ctx.rotate(-.08); ctx.fillStyle = SWR; ctx.shadowColor = SWR; ctx.shadowBlur = 90; ctx.beginPath(); ctx.roundRect(-260, -260, 520, 520, 40); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.fillRect(-40, -180, 80, 360); ctx.fillRect(-180, -40, 360, 80); ctx.restore();
  // kilit
  padlock(W / 2 + 230, 1200, 250, GD);
  // başlık
  big('SWISS BANKS', 210, 140, SWR, SWR);
  big('KEEP IT', 370, 140, '#fff');
  big('SECRET', 530, 180, GD, GD);
  // alt rozet: NAME redacted / NO. 7409285
  ctx.save(); ctx.translate(W / 2, 1640); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = GD; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -110, 920, 220, 40); ctx.fill(); ctx.stroke();
  txt('NAME', -230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = '#000'; ctx.fillRect(-340, -6, 220, 60); txt('CLASSIFIED', -230, 25, 36, SWR, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-2, -70, 4, 140);
  txt('NUMBER ONLY', 230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('7409285', 230, 25, 84, GD, { align: 'center', font: 'Anton', weight: 400, glow: GD }); ctx.restore();
  vignette(.5);
};
