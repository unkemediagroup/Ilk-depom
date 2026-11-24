// Kapak: How Much Money Do You Really Need to Have to Become a Millionaire?
const GOLD = C.gold, GRN = C.green;
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
window.drawCover = function () {
  bgFinance(3, { tint: 'rgba(34,224,122,.26)', seed: 7, dot: '120,230,170', top: '#06170e', bot: '#010503' });
  // arka plan ışın demeti
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? 'rgba(34,224,122,.07)' : 'rgba(34,224,122,.02)'; ctx.beginPath(); ctx.moveTo(W / 2, 1100); ctx.arc(W / 2, 1100, 1600, i / 18 * TAU, (i + 1) / 18 * TAU); ctx.fill(); }
  // başlık
  big("YOU DON'T NEED", 230, 150, '#fff');
  big('$1,000,000', 410, 210, GRN, GRN);
  big('JUST TIME', 600, 190, GOLD, GOLD);
  // yükselen büyüme eğrisi + bayrak
  const ser = []; const r = .07 / 12; let fv = 0; for (let m = 0; m <= 480; m++) { if (m % 12 === 0) ser.push(fv); fv = fv * (1 + r) + 450; }
  lineChart(110, 800, 860, 470, ser, 1, { col: GRN, axes: false, min: 0, max: 1.25e6, lw: 14 });
  // $1M çizgisi
  ctx.strokeStyle = GOLD; ctx.setLineDash([18, 12]); ctx.lineWidth = 5; const yM = 800 + 470 * (1 - 1e6 / 1.25e6); ctx.beginPath(); ctx.moveTo(110, yM); ctx.lineTo(970, yM); ctx.stroke(); ctx.setLineDash([]);
  txt('$1M', 130, yM - 30, 46, GOLD, { font: 'Anton', weight: 400 });
  // bayrak
  ctx.fillStyle = GOLD; ctx.fillRect(950, yM - 170, 8, 170); ctx.beginPath(); ctx.moveTo(958, yM - 170); ctx.lineTo(1040, yM - 145); ctx.lineTo(958, yM - 120); ctx.fill();
  // altın paralar
  for (let i = 0; i < 6; i++) coin(260 + i * 120, 1310 - (i % 2) * 40, 40, i * .6);
  // alt rozet: YOU $216K / MARKET $800K
  ctx.save(); ctx.translate(W / 2, 1640); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = GRN; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -110, 920, 220, 40); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#4da6ff'; ctx.beginPath(); ctx.roundRect(-410, -40, 820 * .2, 80, [20, 0, 0, 20]); ctx.fill(); ctx.fillStyle = GRN; ctx.shadowColor = GRN; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-410 + 820 * .2, -40, 820 * .8, 80, [0, 20, 20, 0]); ctx.fill(); ctx.shadowBlur = 0;
  txt('YOU $216K', -410, -78, 40, '#4da6ff', { font: 'Anton', weight: 400, stroke: 0 }); txt('MARKET $800K', 410, -78, 40, GRN, { align: 'right', font: 'Anton', weight: 400, stroke: 0 });
  txt('$450 / MONTH · 40 YEARS', 0, 2, 44, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  vignette(.5);
};
