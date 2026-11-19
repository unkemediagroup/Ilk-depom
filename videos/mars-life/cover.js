// YT Shorts kapak — "What If Humans Lived on Mars?" (1080×1920)
const MCR = (() => { const R = RN(17); return Array.from({ length: 30 }, () => [R() * TAU, (R() - .5) * 2.4, .04 + R() * .12]); })();
function mars(x, y, r, t, o = {}) {
  const rot = o.rot ?? t * .2; ctx.save(); ctx.translate(x, y);
  const halo = ctx.createRadialGradient(0, 0, r * .95, 0, 0, r * 1.25); halo.addColorStop(0, 'rgba(255,140,90,.35)'); halo.addColorStop(1, 'rgba(255,140,90,0)'); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, r * 1.25, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
  const g = ctx.createRadialGradient(-r * .35, -r * .35, r * .1, 0, 0, r); g.addColorStop(0, '#f08a52'); g.addColorStop(.6, '#c4512b'); g.addColorStop(1, '#6a1f10'); ctx.fillStyle = g; ctx.fillRect(-r, -r, 2 * r, 2 * r);
  for (const [lon, lat, s] of MCR) { const l = lon + rot, z = Math.cos(lat) * Math.cos(l); if (z < 0) continue; const px = r * Math.cos(lat) * Math.sin(l), py = -r * Math.sin(lat) * .9;
    ctx.fillStyle = 'rgba(90,25,10,.35)'; ctx.beginPath(); ctx.ellipse(px, py, r * s * Math.max(.2, z), r * s, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(120,35,15,.35)'; ctx.beginPath(); ctx.ellipse(Math.sin(rot) * r * .3, r * .1, r * .7, r * .08, -.15, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff1e6'; ctx.beginPath(); ctx.ellipse(0, -r * .96, r * .35, r * .1, 0, 0, TAU); ctx.fill();
  if (o.lights) o.lights(r, rot);
  ctx.restore();
  const sh = ctx.createLinearGradient(-r * .2, 0, r * 1.05, 0); sh.addColorStop(0, 'rgba(0,0,10,0)'); sh.addColorStop(1, 'rgba(0,0,10,.75)'); ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.restore();
}
function astro(x, y, s, t, o = {}) {      // astronot; (x,y) = ayak, s = boy
  ctx.save(); ctx.translate(x, y); const st = o.stretch || 1; ctx.scale(1 / Math.sqrt(st), st);
  const sw = Math.sin(t * (o.walk ? 6 : 0)) * .3;
  ctx.strokeStyle = '#e8ecf2'; ctx.lineCap = 'round'; ctx.lineWidth = s * .13;
  ctx.beginPath(); ctx.moveTo(-s * .08, -s * .45); ctx.lineTo(-s * .1 - sw * s * .1, -s * .03); ctx.moveTo(s * .08, -s * .45); ctx.lineTo(s * .1 + sw * s * .1, -s * .03); ctx.stroke();
  ctx.lineWidth = s * .1; const ar = o.arms ?? .3; ctx.beginPath(); ctx.moveTo(-s * .17, -s * .78); ctx.lineTo(-s * .27, -s * (.55 + ar * .4)); ctx.moveTo(s * .17, -s * .78); ctx.lineTo(s * .27, -s * (.55 + ar * .4)); ctx.stroke();
  ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.roundRect(-s * .2, -s * .86, s * .4, s * .36, s * .06); ctx.fill();
  ctx.fillStyle = '#f4f6fa'; ctx.beginPath(); ctx.roundRect(-s * .18, -s * .86, s * .36, s * .44, s * .1); ctx.fill();
  ctx.fillStyle = '#ff6a2e'; ctx.fillRect(-s * .06, -s * .76, s * .12, s * .06);
  ctx.fillStyle = '#f4f6fa'; ctx.beginPath(); ctx.arc(0, -s * .95, s * .16, 0, TAU); ctx.fill();
  const v = ctx.createLinearGradient(0, -s * 1.05, 0, -s * .88); v.addColorStop(0, '#ffcf6b'); v.addColorStop(1, '#a8550f'); ctx.fillStyle = o.visor || v; ctx.beginPath(); ctx.ellipse(s * .03, -s * .96, s * .11, s * .08, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(-s * .01, -s * .99, s * .03, s * .015, -.4, 0, TAU); ctx.fill();
  ctx.restore();
}
function marsGround(y, t, seed = 2) { const g = ctx.createLinearGradient(0, y, 0, y + 700); g.addColorStop(0, '#c4512b'); g.addColorStop(1, '#5a1a0c'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); const R = RN(seed); for (let x = -300; x <= W + 300; x += 90) ctx.lineTo(x, y + (R() - .5) * 40); ctx.lineTo(W + 300, H + 300); ctx.fill();
  ctx.fillStyle = 'rgba(80,20,8,.5)'; for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.ellipse(R() * W, y + 60 + R() * 500, 30 + R() * 60, 10 + R() * 14, 0, 0, TAU); ctx.fill(); } }
function marsSky(top = '#f2b38a', bot = '#c7663e') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function dust(t, n, a = .5, spd = 900, seed = 4) { const R = RN(seed); for (let i = 0; i < n; i++) { const y = R() * H, x = ((R() * W * 2 + t * spd * (.5 + R())) % (W + 400)) - 200, l = 40 + R() * 120;
  ctx.strokeStyle = `rgba(230,120,70,${a * (.3 + R() * .7)})`; ctx.lineWidth = 3 + R() * 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y + l * .1); ctx.stroke(); } }

function dome(cx, cy, r, t, kids) {
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.closePath(); ctx.clip();
  const g = ctx.createLinearGradient(0, cy - r, 0, cy); g.addColorStop(0, '#bfeaff'); g.addColorStop(1, '#4fa86a'); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, r);
  for (let i = 0; i < 9; i++) { const x = cx - r * .8 + i * r * .2, h = 60 + (i % 3) * 30; ctx.fillStyle = '#2f8f4a'; ctx.beginPath(); ctx.arc(x, cy - h, 34, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a22'; ctx.fillRect(x - 5, cy - h, 10, h); }
  ctx.fillStyle = '#1a2a1a'; kids.forEach(([dx, s], i) => { const x = cx + dx * r + Math.sin(t * 1.5 + i) * 30; ctx.save(); ctx.translate(x, cy); ctx.scale(1, 1); ctx.fillStyle = '#1a2a1a';
    ctx.beginPath(); ctx.arc(0, -s * .9, s * .1, 0, TAU); ctx.fill(); ctx.fillRect(-s * .08, -s * .8, s * .16, s * .5); ctx.fillRect(-s * .07, -s * .3, s * .05, s * .3); ctx.fillRect(s * .02, -s * .3, s * .05, s * .3); ctx.restore(); });
  ctx.restore();
  ctx.strokeStyle = 'rgba(220,245,255,.9)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = 'rgba(220,245,255,.35)'; ctx.lineWidth = 3; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, r * i / 6, r, 0, Math.PI, 0); ctx.stroke(); }
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  space(t, 5, { top: '#05030a', bot: '#2a0c06' });
  // dev Mars yukarıda
  mars(W / 2 + 120, 430, 520, 0, { rot: 1.4 });
  // Dünya küçük, uzakta
  earth(150, 140, 70, 0, { rot: 1 });
  // yüzey + kubbe şehri
  const g = ctx.createLinearGradient(0, 900, 0, H); g.addColorStop(0, '#c4512b'); g.addColorStop(1, '#3a1208'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-50, H); ctx.lineTo(-50, 1000); ctx.quadraticCurveTo(540, 900, W + 50, 1000); ctx.lineTo(W + 50, H); ctx.fill();
  dome(W / 2 + 230, 1070, 230, 2, [[-.5, 90], [.1, 120], [.5, 70]]);
  dome(170, 1060, 150, 3, [[0, 80]]);
  dust(1.5, 60, .5, 900, 4);
  // uzun ince Marslı + astronot
  ctx.save(); ctx.translate(380, 1100); ctx.scale(.75, 1.35); ctx.shadowColor = '#ff7a3a'; ctx.shadowBlur = 40; ctx.fillStyle = '#ffd7c2'; ctx.beginPath(); ctx.arc(0, -560, 70, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-85, -480, 170, 280, 50); ctx.fill(); ctx.fillRect(-70, -220, 55, 220); ctx.fillRect(15, -220, 55, 220);
  ctx.lineWidth = 42; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffd7c2'; ctx.beginPath(); ctx.moveTo(-90, -450); ctx.lineTo(-150, -260); ctx.moveTo(90, -450); ctx.lineTo(170, -620); ctx.stroke(); ctx.restore();
  astro(560, 1100, 300, 0, { arms: .3 });
  // rozet
  ctx.save(); ctx.translate(820, 1200); ctx.rotate(.08); ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.roundRect(-190, -50, 380, 100, 26); ctx.fill(); txt('1/3 GRAVITY', 0, 4, 58, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  // başlık
  txt('WHAT IF HUMANS', W / 2, 1335, 110, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('LIVED ON', W / 2, 1475, 140, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 18 });
  ctx.save(); ctx.translate(W / 2, 1730); ctx.rotate(-.03); txt('MARS?', 0, 0, 260, '#ff5a2e', { align: 'center', font: 'Anton', weight: 400, stroke: 28, glow: '#ff3a00', blur: 55 }); ctx.restore();
  vignette(.45);
};
