// YT Shorts kapak — "What If Humans Never Needed Sleep?" (1080×1920)
function eye(x, y, w, open, t, o = {}) {           // badem göz; open 0..1
  const h = w * .42 * open; ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.6, -w / 2, 0); ctx.closePath();
  ctx.save(); ctx.clip(); ctx.fillStyle = '#f4f1ea'; ctx.fillRect(-w, -w, 2 * w, 2 * w);
  const px = (o.look || 0) * w * .12, ir = w * .2, g = ctx.createRadialGradient(px, 0, ir * .2, px, 0, ir); g.addColorStop(0, o.iris1 || '#7fe0ff'); g.addColorStop(1, o.iris2 || '#0d5a8a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, 0, ir, 0, TAU); ctx.fill(); ctx.fillStyle = '#05070c'; ctx.beginPath(); ctx.arc(px, 0, ir * (o.pupil || .38), 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(px - ir * .35, -ir * .35, ir * .18, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(200,60,60,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 10, (i - 3) * 6); ctx.quadraticCurveTo(-w * .35, (i - 3) * 14, -w * .28, (i - 3) * 10); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = '#1a0f0a'; ctx.lineWidth = w * .035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6 - 4, w / 2, 0); ctx.stroke();
  if (open < .15) { ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, w * .12, w / 2, 0); ctx.stroke(); for (let i = 0; i < 6; i++) { const a = -w * .35 + i * w * .14; ctx.beginPath(); ctx.moveTo(a, w * .07); ctx.lineTo(a - 10, w * .14); ctx.stroke(); } }
  ctx.restore();
}
function brain(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1 + .015 * Math.sin(t * 3), 1 + .015 * Math.sin(t * 3 + 1));
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 60; }
  ctx.fillStyle = o.col || '#f2a3b6'; ctx.beginPath(); ctx.ellipse(-s * .26, 0, s * .52, s * .4, -.08, 0, TAU); ctx.ellipse(s * .26, 0, s * .52, s * .4, .08, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(s * .3, s * .35, s * .22, s * .13, .3, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = o.line || 'rgba(150,40,80,.55)'; ctx.lineWidth = s * .025; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -s * .38); ctx.bezierCurveTo(-s * .05, -s * .1, s * .05, s * .1, 0, s * .36); ctx.stroke();
  const R = RN(5); for (let i = 0; i < 16; i++) { const sx = (R() - .5) * s * 1.3, sy = (R() - .5) * s * .6; ctx.beginPath(); ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + s * .1, sy - s * .12, sx + s * .18, sy + s * .1, sx + s * .26 * (R() > .5 ? 1 : -.6), sy - s * .02); ctx.stroke(); }
  ctx.restore();
}
function clockFace(x, y, r, t, ring) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f2f4f8'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = ring || '#ff3b4e'; ctx.lineWidth = r * .1; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.strokeStyle = '#222'; ctx.lineWidth = r * .04; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .78, Math.sin(a) * r * .78); ctx.lineTo(Math.cos(a) * r * .88, Math.sin(a) * r * .88); ctx.stroke(); }
  ctx.strokeStyle = '#111'; ctx.lineCap = 'round'; ctx.lineWidth = r * .07; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(t * .5 - 1.57) * r * .45, Math.sin(t * .5 - 1.57) * r * .45); ctx.stroke();
  ctx.lineWidth = r * .04; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(t * 6 - 1.57) * r * .7, Math.sin(t * 6 - 1.57) * r * .7); ctx.stroke(); ctx.restore();
}


window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bg = ctx.createRadialGradient(W / 2, 600, 0, W / 2, 600, 1300); bg.addColorStop(0, '#3a1430'); bg.addColorStop(1, '#05040a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // ışık patlaması ışınları
  ctx.save(); ctx.translate(W / 2, 640); for (let i = 0; i < 24; i++) { ctx.rotate(TAU / 24); ctx.fillStyle = i % 2 ? 'rgba(255,200,80,.08)' : 'rgba(255,80,120,.06)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -120); ctx.lineTo(1400, 120); ctx.fill(); } ctx.restore();
  // yüz + kocaman açık, kan çanağı gözler
  ctx.fillStyle = '#c8916a'; ctx.beginPath(); ctx.ellipse(W / 2, 640, 620, 430, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(W / 2, 640, 620, 430, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#3a2416'; ctx.lineWidth = 28; ctx.lineCap = 'round';
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(W / 2 + sx * 110, 380); ctx.quadraticCurveTo(W / 2 + sx * 250, 300, W / 2 + sx * 400, 370); ctx.stroke(); }
  for (const sx of [-1, 1]) { eye(W / 2 + sx * 240, 590, 360, 1.15, 0, { pupil: .16, iris1: '#ffe27a', iris2: '#e0590e' });
    ctx.strokeStyle = 'rgba(200,30,40,.7)'; ctx.lineWidth = 3; const R = RN(sx > 0 ? 3 : 7); for (let i = 0; i < 9; i++) { const a = R() * TAU; ctx.beginPath(); let x = W / 2 + sx * 240 + Math.cos(a) * 170, y = 590 + Math.sin(a) * 60; ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x -= Math.cos(a) * 20 + (R() - .5) * 14; y -= Math.sin(a) * 8 + (R() - .5) * 10; ctx.lineTo(x, y); } ctx.stroke(); } }
  // kırılan Zzz
  txt('Zzz', 860, 200, 150, 'rgba(180,200,255,.9)', { align: 'center', font: 'Anton', weight: 400, stroke: 12 }); stampX(860, 200, 220, 1);
  // çalar saat sol üst, sallanıyor
  ctx.save(); ctx.translate(200, 230); ctx.rotate(-.18); clockFace(0, 0, 130, 2); ctx.fillStyle = '#ff3b4e'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 85, -120, 46, Math.PI, 0); ctx.fill(); } ctx.restore();
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(200, 230, 170 + i * 30, -2.6, -1.9); ctx.stroke(); }
  // +8 HOURS rozeti
  ctx.save(); ctx.translate(W / 2, 1030); ctx.rotate(-.05); ctx.fillStyle = '#22e07a'; ctx.beginPath(); ctx.roundRect(-230, -60, 460, 120, 60); ctx.fill(); txt('+8 HOURS / DAY', 0, 4, 58, '#05140c', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  // başlık
  txt('WHAT IF HUMANS', W / 2, 1200, 120, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  ctx.save(); ctx.translate(W / 2, 1400); ctx.rotate(-.03); txt('NEVER', 0, 0, 240, '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 26, glow: '#ff2e45', blur: 50 }); ctx.restore();
  txt('NEEDED SLEEP?', W / 2, 1620, fit('NEEDED SLEEP?', 190, 1000, 'Anton', 400), '#ffc83d', { align: 'center', font: 'Anton', weight: 400, stroke: 22, glow: '#ff8a00', blur: 30 });
  vignette(.5);
};
