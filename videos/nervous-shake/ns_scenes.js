// ===== 7.video — NERVOUS SHAKING (portrait) =====
function handsShake(u, s, o) {
  bgDeep(s, ['#2a1e1a', '#100a08']); const a = o.calm ? 1 - eio(clamp(u * 1.3)) : 1, sx = Math.sin(s * 47) * 10 * a, sy = Math.cos(s * 53) * 7 * a;
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(Math.sin(s * 31) * .015 * a);
  ctx.fillStyle = '#f4f0e6'; ctx.beginPath(); ctx.roundRect(260, 640, 560, 720, 18); ctx.fill(); ctx.fillStyle = 'rgba(60,60,80,.5)'; for (let i = 0; i < 9; i++) ctx.fillRect(320, 720 + i * 66, 300 + (i * 70) % 160, 14);
  for (const d of [-1, 1]) { const x = 540 + d * 300; const g = ctx.createLinearGradient(x - 120, 0, x + 120, 0); g.addColorStop(0, '#b77656'); g.addColorStop(.5, '#e0a888'); g.addColorStop(1, '#b77656'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - 120, 1250, 240, 900, 100); ctx.fill(); ctx.beginPath(); ctx.ellipse(x - d * 40, 1180, 140, 120, d * .3, 0, TAU); ctx.fill();
    for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.roundRect(x - d * 150 - (d > 0 ? 0 : 0) + (d < 0 ? 30 : -150), 1030 + f * 60, 150, 48, 24); ctx.fill(); } ctx.beginPath(); ctx.ellipse(x - d * 30, 1020, 40, 90, d * .5, 0, TAU); ctx.fill(); }
  ctx.restore();
  if (a > .1) { ctx.strokeStyle = `rgba(255,230,150,${.8 * a})`; ctx.lineWidth = 8; for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(540 + d * 330, 1150, 210 + i * 40, d > 0 ? -.6 : Math.PI - .6, d > 0 ? .6 : Math.PI + .6); ctx.stroke(); } }
  if (o.voice) { const p = []; for (let x = 100; x <= 980; x += 6) p.push([x, 600 + Math.sin(x * .06 + s * 20) * 60 * Math.sin(x * .012) * (1 + Math.sin(s * 37 + x) * .25 * a)]); tube(p, 8, '#ffd27a'); ctx.textAlign = 'center'; txt('SHAKY VOICE', 540, 480, 70, '#fff', '#000', 12, '400', 'Anton'); }
}
function stage(u, s, o) {
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#120c18'); g.addColorStop(1, '#06040a'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.fillStyle = 'rgba(255,240,200,.12)'; ctx.beginPath(); ctx.moveTo(480, -100); ctx.lineTo(600, -100); ctx.lineTo(860, 1250); ctx.lineTo(220, 1250); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,240,200,.18)'; ctx.beginPath(); ctx.ellipse(540, 1250, 330, 60, 0, 0, TAU); ctx.fill();
  const sh = o.shake ? Math.sin(s * 40) * 5 : 0; headSil(540 + sh, 1060, .9, '#1a1420'); ctx.fillStyle = '#2a2230'; ctx.beginPath(); ctx.roundRect(390, 1000, 300, 260, 16); ctx.fill(); ctx.fillStyle = '#3a3040'; ctx.fillRect(360, 990, 360, 26);
  for (let i = 0; i < 7; i++) headSil(80 + i * 155, 1820 + (i % 2) * 30, .55, '#000');
  ctx.fillStyle = 'rgba(80,140,255,.25)'; ctx.fillRect(200, 300, 680, 380); ctx.strokeStyle = 'rgba(160,200,255,.5)'; ctx.lineWidth = 6; ctx.strokeRect(200, 300, 680, 380);
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 520, 96, '#ffd23f', '#000', 14, '400', 'Anton'); }
}
function predator(u, s) {
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#0e1a10'); g.addColorStop(1, '#040804'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  for (let i = 0; i < 40; i++) { const x = (i * 97) % 1100, h = 300 + (i * 53) % 400; tube([[x, 1920], [x + Math.sin(s + i) * 20, 1920 - h]], 14, '#1a3a1a'); }
  const z = 1 + .08 * eio(clamp(u)); ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.fillStyle = '#0a0a06'; ctx.beginPath(); ctx.ellipse(0, 0, 330, 270, 0, 0, TAU); ctx.fill(); for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 230, -220, 80, 90, d * .4, 0, TAU); ctx.fill(); }
  const bl = (s % 3) < .12 ? .1 : 1; for (const d of [-1, 1]) { spark(d * 120, -40, 110, .7); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(d * 120, -40, 50, 34 * bl, d * -.2, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(d * 120, -40, 10, 30 * bl, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#e8e2d8'; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 34 - 14, 130); ctx.lineTo(i * 34 + 14, 130); ctx.lineTo(i * 34, 180 + (Math.abs(i) === 2 ? 40 : 0)); ctx.closePath(); ctx.fill(); } ctx.restore();
  ctx.textAlign = 'center'; txt('PREDATOR!', 540, 640, 120, '#ff6a6a', '#000', 18, '400', 'Anton');
}
function amyg(u, s) { brain3d(u, s, { glows: [[40, 80, 140, 0]] }); spark(1000, 620, 160, .7 + .3 * Math.sin(s * 8), '255,90,90'); ctx.textAlign = 'center'; txt('AMYGDALA', 1000, 860, 70, '#ff8a8a', '#000', 12, '400', 'Anton'); }
function vesselAdr(u, s, o) { vessel(u, s, { mode: 'flow', seed: 9 }); const R = RN(4); for (let i = 0; i < 40; i++) { const x = ((R() * 1800 + 320 * s) % 1800) - 300, y = 800 + R() * 330; spark(x, y, 30, 1, '255,215,80'); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); } ctx.textAlign = 'center'; txt(o.text || 'ADRENALINE', 540, 620, 110, '#ffd23f', '#000', 16, '400', 'Anton'); }
function heartFast(u, s) { heart(u, s * 1.7, {}); }
function energy(u, s, o) {
  stage(u, s, { shake: o.shake }); const R = RN(2); for (let i = 0; i < 14; i++) { const a = R() * TAU + s * (1 + R()), r = 260 + 60 * Math.sin(s * 3 + i); const x = 540 + Math.cos(a) * r, y = 900 + Math.sin(a) * r * 1.2; ctx.strokeStyle = 'rgba(255,220,80,.9)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 20, y + 30); ctx.lineTo(x - 5, y + 40); ctx.lineTo(x + 18, y + 75); ctx.stroke(); }
  ctx.textAlign = 'center'; txt(o.text || 'NOWHERE TO GO', 540, 780, 78, '#ffd23f', '#000', 14, '400', 'Anton');
}
