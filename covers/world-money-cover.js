// Kapak: Where Is Most of the World's Money Actually Located?
const CY = '#2ee6ff';
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
window.drawCover = function () {
  bgFinance(2, { tint: 'rgba(46,230,255,.26)', seed: 6, dot: '120,230,255', top: '#04131c', bot: '#010306' });
  // binary yağmuru
  ctx.font = '800 38px Montserrat'; ctx.textAlign = 'center'; const R = RN(21); for (let c = 0; c < 22; c++) for (let k = 0; k < 40; k++) { if (R() < .55) continue; ctx.fillStyle = `rgba(46,230,255,${.08 + R() * .25})`; ctx.fillText(R() < .2 ? '$' : (R() < .5 ? '1' : '0'), 25 + c * 50, k * 48); }
  // dünya
  const cx = W / 2, cy = 1110, r = 320; const g = ctx.createRadialGradient(cx, cy, r * .8, cx, cy, r * 1.6); g.addColorStop(0, 'rgba(46,230,255,.4)'); g.addColorStop(1, 'rgba(46,230,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  globe(cx, cy, r, 1.3);
  // dünyadan pikselleşerek dağılan banknot
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 640, H); ctx.clip(); bill(560, 1110, 500, -.12); ctx.restore();
  const P = RN(4); for (let i = 0; i < 90; i++) { const x = 640 + P() * 420, y = 1000 + (P() - .5) * 300 - (x - 640) * .25; ctx.fillStyle = P() < .5 ? CY : '#7fc98a'; ctx.globalAlpha = 1 - (x - 640) / 440; const s = 10 + P() * 22; ctx.fillRect(x, y, s, s); } ctx.globalAlpha = 1;
  // başlık
  big('92% OF ALL', 220, 160, '#fff'); big('MONEY', 450, 250, CY, CY); big("ISN'T REAL", 690, 170, '#fff');
  // alt rozet: %8 nakit / %92 dijital
  ctx.save(); ctx.translate(W / 2, 1600); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = CY; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -110, 920, 220, 40); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.green; ctx.beginPath(); ctx.roundRect(-410, -40, 820 * .08, 80, [20, 0, 0, 20]); ctx.fill(); ctx.fillStyle = CY; ctx.shadowColor = CY; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-410 + 820 * .08, -40, 820 * .92, 80, [0, 20, 20, 0]); ctx.fill(); ctx.shadowBlur = 0;
  txt('CASH 8%', -410, -78, 40, C.green, { font: 'Anton', weight: 400, stroke: 0 }); txt('DIGITAL 92%', 410, -78, 40, CY, { align: 'right', font: 'Anton', weight: 400, stroke: 0 }); txt('JUST NUMBERS ON A SCREEN', 0, 2, 44, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  vignette(.45);
};
