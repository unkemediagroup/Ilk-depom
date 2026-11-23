// YT Shorts kapak — "What If All the Oceans Disappeared?" (1080×1920)
function voidHole(x, y, r, t) { for (let i = 0; i < 40; i++) { const a = i / 40 * TAU + t * 2.5, rr = r * (1.2 + (i % 4) * .25); ctx.strokeStyle = `rgba(${i % 2 ? '120,90,255' : '60,160,255'},.45)`; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y, rr, rr * .4, -.3, a, a + .7); ctx.stroke(); }
  const g = ctx.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, '#000'); g.addColorStop(.8, '#000'); g.addColorStop(1, 'rgba(120,90,255,.8)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function _s1(t) {
  space(t, 4);
  const dr = seg(t, .6, 3.4);
  cam({ zoom: 1.08 - .06 * seg(t, 0, 4), t, shake: 4 + 6 * dr }, () => {
    const ex = 420, ey = 700, er = 330, vx = 860, vy = 330;
    voidHole(vx, vy, 120 + 40 * dr, t);
    earth(ex, ey, er, t, { rot: t * .4, sea0: lerpC('#2f8ee8', SEABED[0], dr), sea1: lerpC('#0a2f6e', SEABED[1], dr) });
    // su akıntısı spirali
    const R = RN(4); for (let i = 0; i < 160; i++) { const q = (R() + t * .7) % 1; if (dr <= 0) break; const a0 = R() * TAU, sx = ex + Math.cos(a0) * er * .8, sy = ey + Math.sin(a0) * er * .8;
      const k = eio(q), ang = k * 5, x = lerp(sx, vx, k) + Math.cos(ang + a0) * 60 * (1 - k), y = lerp(sy, vy, k) + Math.sin(ang + a0) * 60 * (1 - k);
      ctx.fillStyle = `rgba(80,180,255,${.8 * (1 - k) * Math.min(1, dr * 3)})`; ctx.beginPath(); ctx.arc(x, y, 9 * (1 - k * .7), 0, TAU); ctx.fill(); }
  });
  kinetic(['WHAT', 'IF', 'ALL', 'THE', 'OCEANS'], W / 2, 1200, 130, t, 0, { gap: .06 });
  kinetic(['DISAPPEARED?'], W / 2, 1360, 160, t, 1.7, { hl: { 'DISAPPEARED?': '#7f9cff' } });
  if (t > 3.0) pill('INTO A GIANT VOID', W / 2, 220, 66, C.violet, seg(t, 3.0, 3.3));
}
function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }

function ship(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#2a3344'; ctx.beginPath(); ctx.moveTo(-s * .5, -s * .12); ctx.lineTo(s * .55, -s * .12); ctx.lineTo(s * .42, s * .08); ctx.lineTo(-s * .44, s * .08); ctx.fill();
  ctx.fillStyle = '#c0392b'; ctx.fillRect(-s * .44, s * .02, s * .86, s * .06); ctx.fillStyle = '#e8eef6'; ctx.fillRect(-s * .38, -s * .26, s * .24, s * .14); ctx.fillRect(s * .1, -s * .3, s * .3, s * .18);
  const cols = ['#ff3b4e', '#3da5ff', '#ffc83d']; for (let i = 0; i < 6; i++) { ctx.fillStyle = cols[i % 3]; ctx.fillRect(-s * .12 + (i % 3) * s * .07, -s * .24 + Math.floor(i / 3) * s * .06, s * .065, s * .055); } ctx.restore(); }

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // üst: uzay, kuruyan dünya + boşluk
  space(t, 4, { top: '#04030c', bot: '#140a20' });
  const ex = 430, ey = 480, er = 330, vx = 880, vy = 200;
  voidHole(vx, vy, 150, 1);
  earth(ex, ey, er, 0, { rot: 1.6, sea0: '#8a6a44', sea1: '#4a3020' });
  // okyanus suyu girdaba akar
  const R = RN(4); for (let i = 0; i < 220; i++) { const q = R(), a0 = R() * TAU, sx = ex + Math.cos(a0) * er * .8, sy = ey + Math.sin(a0) * er * .8, k = eio(q), ang = k * 5;
    const x = lerp(sx, vx, k) + Math.cos(ang + a0) * 70 * (1 - k), y = lerp(sy, vy, k) + Math.sin(ang + a0) * 70 * (1 - k); ctx.fillStyle = `rgba(80,180,255,${.9 * (1 - k * .7)})`; ctx.beginPath(); ctx.arc(x, y, 11 * (1 - k * .7), 0, TAU); ctx.fill(); }
  // alt: kurumuş deniz tabanı, mahsur gemi
  const g = ctx.createLinearGradient(0, 860, 0, H); g.addColorStop(0, '#e8a868'); g.addColorStop(1, '#6a3a1a'); ctx.fillStyle = g; ctx.fillRect(0, 860, W, H);
  ctx.fillStyle = '#8a5a34'; ctx.beginPath(); ctx.moveTo(-10, 860); ctx.lineTo(180, 900); ctx.lineTo(230, 1180); ctx.lineTo(-10, 1220); ctx.fill(); ctx.beginPath(); ctx.moveTo(W + 10, 860); ctx.lineTo(900, 900); ctx.lineTo(860, 1180); ctx.lineTo(W + 10, 1220); ctx.fill();
  ctx.fillStyle = '#b07a48'; ctx.fillRect(0, 1150, W, 800); const R2 = RN(7); ctx.strokeStyle = '#6a4224'; ctx.lineWidth = 5;
  for (let i = 0; i < 30; i++) { let x = R2() * W, y = 1170 + R2() * 700; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (R2() - .5) * 140; y += R2() * 50; ctx.lineTo(x, y); } ctx.stroke(); }
  ship(560, 1130, 760, .2);
  // %96 rozeti
  ctx.save(); ctx.translate(820, 760); ctx.rotate(.1); ctx.fillStyle = '#3da5ff'; ctx.beginPath(); ctx.roundRect(-210, -62, 420, 124, 30); ctx.fill(); txt('-96% WATER', 0, 4, 64, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  // başlık
  txt('WHAT IF ALL THE', W / 2, 1360, 110, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('OCEANS', W / 2, 1530, 220, '#5fd3ff', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: '#1f8fff', blur: 40 });
  ctx.save(); ctx.translate(W / 2, 1735); ctx.rotate(-.03); txt('DISAPPEARED?', 0, 0, fit('DISAPPEARED?', 190, 1000, 'Anton', 400), '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: '#ff2e45', blur: 50 }); ctx.restore();
  vignette(.45);
};
