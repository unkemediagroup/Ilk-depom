// Kapak: What Happens If a Billionaire Loses Their Money?
const RD = C.red, GR = C.green;
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
function flames(x, y, w, t) { for (let i = 0; i < 7; i++) { const fx = x + (i - 3) * w / 7, f = .8 + .25 * Math.sin(t * 14 + i * 1.9), hh = 180 * f; ctx.fillStyle = ['#ff3b1f', '#ff9d1f', '#fff3a8'][i % 3]; ctx.beginPath(); ctx.moveTo(fx - 40, y); ctx.quadraticCurveTo(fx, y - hh * .9, fx + 40, y); ctx.fill(); } }
window.drawCover = function () {
  bgFinance(5, { tint: 'rgba(255,59,78,.24)', seed: 13, dot: '255,140,150', top: '#1c0609', bot: '#030101' });
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,59,78,.07)' : 'rgba(255,59,78,.02)'; ctx.beginPath(); ctx.moveTo(W / 2, 1040); ctx.arc(W / 2, 1040, 1600, i / 18 * TAU, (i + 1) / 18 * TAU); ctx.fill(); }
  // ortada sağlam kasa (kişisel servet)
  const vx = W / 2, vy = 1010, vr = 250; ctx.save(); ctx.shadowColor = C.gold; ctx.shadowBlur = 70; ctx.fillStyle = 'rgba(255,200,61,.18)'; ctx.beginPath(); ctx.arc(vx, vy, vr + 60, 0, TAU); ctx.fill(); ctx.restore();
  vaultDoor(vx, vy, vr, .4, 0);
  // alt-solda yanan başkalarının parası
  for (let i = 0; i < 4; i++) bill(190 + i * 70, 1390 - i * 14, 240, -.25 + i * .15, { val: '100' });
  flames(250, 1360, 360, 1.2);
  txt("OTHER PEOPLE'S", 250, 1480, 44, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  // başlık
  big('LOSE IT ALL?', 210, 130, '#fff');
  big('THEY LOSE', 360, 130, RD, RD);
  big("OTHER PEOPLE'S", 500, 118, '#fff');
  big('MONEY', 640, 170, GOLD_(), GOLD_());
  // alt rozet: COMPANY BANKRUPT / PERSONAL UNTOUCHED
  ctx.save(); ctx.translate(W / 2, 1640); ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.strokeStyle = RD; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-460, -110, 920, 220, 40); ctx.fill(); ctx.stroke();
  txt('COMPANY', -230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('BANKRUPT', -230, 25, 80, RD, { align: 'center', font: 'Anton', weight: 400, glow: RD });
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-2, -70, 4, 140);
  txt('PERSONAL', 230, -52, 40, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('UNTOUCHED', 230, 25, 80, GR, { align: 'center', font: 'Anton', weight: 400, glow: GR }); ctx.restore();
  vignette(.5);
};
function GOLD_() { return C.gold; }
