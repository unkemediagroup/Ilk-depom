// Kapak: How Do the World's Wealthiest Families Protect Their Fortunes?
const TEAL = '#28e0c0';
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
function mansion(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#e9eef5'; ctx.fillRect(-s * .5, -s * .35, s, s * .45); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(-s * .58, -s * .33); ctx.lineTo(0, -s * .62); ctx.lineTo(s * .58, -s * .33); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a3550'; for (let i = 0; i < 4; i++) ctx.fillRect(-s * .42 + i * s * .24, -s * .25, s * .12, s * .14); ctx.fillStyle = C.gold; ctx.fillRect(-s * .08, -s * .06, s * .16, s * .16); ctx.restore(); }
window.drawCover = function () {
  bgFinance(2, { tint: 'rgba(40,224,192,.24)', seed: 5, dot: '120,240,220', top: '#04120f', bot: '#010403' });
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? 'rgba(40,224,192,.07)' : 'rgba(40,224,192,.02)'; ctx.beginPath(); ctx.moveTo(W / 2, 1150); ctx.arc(W / 2, 1150, 1600, i / 18 * TAU, (i + 1) / 18 * TAU); ctx.fill(); }
  // kalkan kubbesi içinde malikane + altın
  const cx = W / 2, by = 1400, r = 470; const g = ctx.createRadialGradient(cx, by, r * .5, cx, by, r); g.addColorStop(0, 'rgba(40,224,192,0)'); g.addColorStop(1, 'rgba(40,224,192,.35)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, by, r, Math.PI, TAU); ctx.fill();
  for (let r2 = 0; r2 < 3; r2++) for (let i = 0; i < 6 - r2; i++) { const x = cx - 330 + r2 * 60 + i * 120; ctx.fillStyle = C.gold2; ctx.fillRect(x, by - 50 - r2 * 46, 100, 40); ctx.fillStyle = C.gold; ctx.fillRect(x + 8, by - 58 - r2 * 46, 84, 10); }
  mansion(cx, by - 150, 420);
  ctx.strokeStyle = 'rgba(140,255,235,.95)'; ctx.lineWidth = 12; ctx.shadowColor = TEAL; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(cx, by, r, Math.PI, TAU); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(140,255,235,.25)'; ctx.lineWidth = 3; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.ellipse(cx, by, r, r * i / 5, 0, Math.PI, TAU); ctx.stroke(); }
  // sekip giden tehditler
  [['LAWSUITS', 150, 900, -.3], ['TAXES', 930, 860, .3]].forEach(([l, x, y, rot]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-110, -60, 220, 120, 14); ctx.fill(); txt(l, 0, 2, 44, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); stampX(x + (x < W / 2 ? 90 : -90), y + 60, 70, 1); });
  ctx.fillStyle = '#1b2235'; ctx.fillRect(0, by, W, 20);
  big('THE RICH', 200, 160, '#fff'); big('OWN NOTHING', 400, 200, TEAL, TEAL); big('(ON PAPER)', 580, 110, '#fff');
  ctx.save(); ctx.translate(W / 2, 1640); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = C.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -100, 920, 200, 40); ctx.fill(); ctx.stroke();
  txt('ON PAPER', -230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('$0', -230, 25, 100, '#9aa7b8', { align: 'center', font: 'Anton', weight: 400 });
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-2, -70, 4, 140);
  txt('IN REALITY', 230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('BILLIONS', 230, 25, 90, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); ctx.restore();
  vignette(.5);
};
