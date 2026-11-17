// Kapak: Why Does Printing Money Not Make a Country Rich?
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
function press(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#2b3550'; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .35, s, s * .6, 30); ctx.fill(); ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.stroke(); ctx.fillStyle = '#3d4a6e'; ctx.fillRect(-s * .42, -s * .5, s * .84, s * .18);
  for (let i = 0; i < 2; i++) { ctx.save(); ctx.translate(-s * .2 + i * s * .4, -s * .05); ctx.rotate(i * .4); ctx.fillStyle = '#8a97b0'; ctx.beginPath(); ctx.arc(0, 0, s * .12, 0, TAU); ctx.fill(); ctx.fillStyle = '#2b3550'; for (let k = 0; k < 4; k++) { ctx.rotate(TAU / 4); ctx.fillRect(-s * .015, 0, s * .03, s * .1); } ctx.restore(); }
  ctx.fillStyle = '#10141f'; ctx.fillRect(-s * .38, s * .2, s * .76, s * .05); ctx.fillStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(s * .4, -s * .25, s * .04, 0, TAU); ctx.fill(); ctx.restore(); }
window.drawCover = function () {
  bgFinance(4, { tint: 'rgba(255,59,78,.28)', seed: 11, dot: '255,140,150', top: '#1c0609', bot: '#030101' });
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,59,78,.07)' : 'rgba(255,59,78,.02)'; ctx.beginPath(); ctx.moveTo(W / 2, 1000); ctx.arc(W / 2, 1000, 1600, i / 18 * TAU, (i + 1) / 18 * TAU); ctx.fill(); }
  // basılan ve gri/değersizleşen banknotlar
  const R = RN(5); for (let i = 0; i < 14; i++) { const x = 60 + R() * 960, y = 780 + R() * 560, gray = clamp((y - 780) / 560); ctx.save(); ctx.filter = `grayscale(${gray}) brightness(${1 - .45 * gray})`; bill(x, y, 230, (R() - .5) * 1.4, { val: '100' }); ctx.restore(); }
  press(W / 2, 1040, 520);
  // fırlayan banknot şeridi
  for (let i = 0; i < 5; i++) bill(W / 2 + (i - 2) * 30, 1180 + i * 40, 300, (i - 2) * .12);
  // başlık
  big('PRINT MORE', 200, 150, '#fff'); big('MONEY', 440, 250, C.green, C.green); big('= RICH?', 690, 200, C.red, C.red);
  // alt rozet: değer erimesi
  ctx.save(); ctx.translate(W / 2, 1610); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-440, -110, 880, 220, 40); ctx.fill(); ctx.stroke();
  txt('$100', -250, 0, 120, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green }); arrow(-40, 0, 170, false, 1, { rot: -Math.PI / 2, col: '#fff', w: 30 });
  txt('$5', 230, 0, 140, C.red, { align: 'center', font: 'Anton', weight: 400, glow: C.red }); txt('VALUE', 0, -78, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  vignette(.5);
};
