// Kapak: Why Do Wealthy People Use Debt?
const GOLD = C.gold, RED = C.red;
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
function link(x, y, a, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.beginPath(); ctx.ellipse(0, 0, 38, 62, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
window.drawCover = function () {
  bgFinance(4, { tint: 'rgba(255,200,61,.22)', seed: 9, dot: '255,210,120', top: '#140c04', bot: '#030201' });
  // sol yarı: yük (zincir + gri), sağ yarı: araç (altın ışın)
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 4, H); ctx.clip(); ctx.fillStyle = 'rgba(40,44,60,.55)'; ctx.fillRect(0, 0, W / 2, H); ctx.restore();
  const rg = ctx.createRadialGradient(W * .75, 1000, 60, W * .75, 1000, 620); rg.addColorStop(0, 'rgba(255,200,61,.45)'); rg.addColorStop(1, 'rgba(255,200,61,0)'); ctx.fillStyle = rg; ctx.fillRect(W / 2, 0, W / 2, H);
  // zincir halkaları (sol)
  for (let i = 0; i < 9; i++) link(120 + i * 42, 1050 + Math.sin(i * .9) * 80, (i % 2 ? .5 : -.5) + Math.sin(i) * .2, '#7d8696');
  // ağır ağırlık (sol)
  ctx.fillStyle = '#4b5566'; ctx.beginPath(); ctx.arc(270, 1260, 130, 0, TAU); ctx.fill(); txt('DEBT', 270, 1260, 70, RED, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  // altın külçe yığını (sağ)
  for (let r = 0; r < 3; r++) for (let i = 0; i < 3 - r; i++) { const x = 720 + (i - (2 - r) / 2) * 180, y = 1290 - r * 84; ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.roundRect(x - 85, y - 52, 170, 52, 10); ctx.fill(); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.roundRect(x - 80, y - 66, 160, 22, 8); ctx.fill(); }
  txt('LEVERAGE', 720, 1450, 72, GOLD, { align: 'center', font: 'Anton', weight: 400, glow: GOLD, blur: 40 });
  // ayırıcı
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(W / 2 - 3, 560, 6, 1000);
  // başlık
  big('DEBT IS', 230, 150, '#fff');
  big('A BURDEN', 400, 150, RED, RED);
  big('A TOOL FOR', 560, 120, '#fff');
  big('THE RICH', 720, 190, GOLD, GOLD);
  // alt rozet: LOAN $ / TAX $0
  ctx.save(); ctx.translate(W / 2, 1640); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -110, 920, 220, 40); ctx.fill(); ctx.stroke();
  txt('TAX-FREE LOAN', -230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('$0', -230, 25, 110, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green });
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-2, -70, 4, 140);
  txt('STOCK IS', 230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('COLLATERAL', 230, 25, 74, GOLD, { align: 'center', font: 'Anton', weight: 400, glow: GOLD }); ctx.restore();
  vignette(.5);
};
