// YT Shorts kapak — "What If Humans Could Read Minds?" (1080×1920)
const NEON = '#c86bff', CYAN = '#5ff0ff';
// profil kafa (sağa bakar), (x,y) = boyun tabanı, s = yükseklik
function head(x, y, s, dir = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  ctx.beginPath(); ctx.moveTo(-.18, 0); ctx.lineTo(-.2, -.25); ctx.bezierCurveTo(-.42, -.35, -.45, -.85, -.12, -1); ctx.bezierCurveTo(.2, -1.08, .38, -.85, .36, -.62);
  ctx.lineTo(.44, -.48); ctx.lineTo(.37, -.45); ctx.lineTo(.38, -.36); ctx.lineTo(.34, -.33); ctx.lineTo(.35, -.26); ctx.bezierCurveTo(.3, -.2, .18, -.2, .12, -.2); ctx.lineTo(.12, 0); ctx.closePath();
  ctx.fillStyle = o.fill || '#0d0a18'; ctx.fill(); if (o.line) { ctx.strokeStyle = o.line; ctx.lineWidth = .012; ctx.shadowColor = o.line; ctx.shadowBlur = 25; ctx.stroke(); ctx.shadowBlur = 0; }
  if (o.brain) { const g = ctx.createRadialGradient(-.02, -.68, .02, -.02, -.68, .3); g.addColorStop(0, o.brain); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(-.02, -.68, .28, .22, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = o.brain; ctx.lineWidth = .01; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(-.02, -.68, .2 - i * .03, .15 - i * .02, i * .5, 0, Math.PI * 1.3); ctx.stroke(); } }
  ctx.restore();
}
function bubble(s, x, y, size, p, col = '#fff', ink = '#111') { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.font = `800 ${size}px Montserrat`; const w = ctx.measureText(s).width + size * 1.2, h = size * 2;
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.beginPath(); ctx.arc(-w * .3, h * .7, size * .25, 0, TAU); ctx.arc(-w * .38, h * 1.05, size * .14, 0, TAU); ctx.fill();
  txt(s, 0, 2, size, ink, { align: 'center', weight: 800, stroke: 0 }); ctx.restore(); }
function waves(x0, y0, x1, y1, t, col, n = 5) { const d = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0); ctx.save(); ctx.translate(x0, y0); ctx.rotate(a);
  for (let i = 0; i < n; i++) { const q = ((t * .9 + i / n) % 1); ctx.strokeStyle = col; ctx.globalAlpha = Math.sin(q * Math.PI); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(q * d, 0, 60 + 40 * Math.sin(q * Math.PI), -.7, .7); ctx.stroke(); } ctx.restore(); }
function darkBg(t, c1 = '#0b0618', c2 = '#1a0b2e') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const R = RN(3); for (let i = 0; i < 50; i++) { ctx.fillStyle = `rgba(200,140,255,${.15 + R() * .25})`; ctx.beginPath(); ctx.arc(R() * W, (R() * H - t * 30 * (1 + R())) % H + (R() < 0 ? H : 0), 1 + R() * 3, 0, TAU); ctx.fill(); } }


window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  darkBg(t);
  // iki kafa, aralarında zihin dalgaları
  head(250, 1000, 820, 1, { line: NEON, brain: 'rgba(200,107,255,.9)' });
  head(830, 1000, 820, -1, { line: CYAN, brain: 'rgba(95,240,255,.9)' });
  waves(300, 620, 780, 620, t, NEON); waves(780, 660, 300, 660, t + .5, CYAN);
  bubble('?', 260, 250, 110, 1, NEON, '#fff'); bubble('!', 820, 250, 110, 1, CYAN, '#111');
  // başlık
  txt('WHAT IF HUMANS', W / 2, 1290, 120, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('COULD READ', W / 2, 1440, 130, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 18 });
  ctx.save(); ctx.translate(W / 2, 1640); ctx.rotate(-.03); txt('MINDS?', 0, 0, 280, NEON, { align: 'center', font: 'Anton', weight: 400, stroke: 26, glow: NEON, blur: 55 }); ctx.restore();
  vignette(.5);
};
