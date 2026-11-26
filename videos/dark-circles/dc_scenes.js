// ===== 15.video — DARK CIRCLES (portrait world 1080×1920) =====
function faceFront(u, s, o) {                                                    // big front face, two eyes, dark circles (o.dark 0..1), visible veins
  const d = typeof o.dark === 'function' ? o.dark(u) : (o.dark || 0);
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a2438'); g.addColorStop(1, '#0e0a14'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.fillStyle = '#e2ad8a'; ctx.beginPath(); ctx.ellipse(540, 1000, 440, 600, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.ellipse(540, 560, 470, 300, 0, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(540, 560, 470, 140, 0, 0, Math.PI); ctx.fill();
  const lidOpen = o.sleepy ? .45 + .1 * Math.sin(s * 1.5) : 1;
  for (const ex of [360, 720]) { const ey = 900;
    const dc = ctx.createRadialGradient(ex, ey + 95, 10, ex, ey + 95, 170); dc.addColorStop(0, `rgba(80,40,110,${.75 * d})`); dc.addColorStop(1, 'rgba(80,40,110,0)'); ctx.fillStyle = dc; ctx.beginPath(); ctx.ellipse(ex, ey + 95, 170, 85, 0, 0, TAU); ctx.fill();
    if (o.veins) { ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey + 95, 160, 75, 0, 0, TAU); ctx.clip(); const R = RN(ex); for (let i = 0; i < 7; i++) { const p = wavy(ex - 150 + R() * 60, ey + 60 + R() * 70, (R() - .5) * .6, 200 + R() * 100, 8, 5); tube(p, 3 + 2 * d, `rgba(90,50,150,${.2 + .3 * d})`); } ctx.restore(); }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex, ey, 105, 55 * lidOpen, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a20'; ctx.beginPath(); ctx.arc(ex + Math.sin(s * .7) * 10, ey + (1 - lidOpen) * 10, 40, 0, TAU); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(ex + Math.sin(s * .7) * 10, ey + (1 - lidOpen) * 10, 18, 0, TAU); ctx.fill();
    ctx.fillStyle = '#d29a78'; ctx.beginPath(); ctx.ellipse(ex, ey - 55 * lidOpen, 115, 60, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(ex - 115, ey - 60 - 55 * lidOpen + 60 * (1 - lidOpen), 230, 60 * (1 - lidOpen) + 5);
    ctx.strokeStyle = '#3a2216'; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(ex, ey, 108, 57 * lidOpen, 0, Math.PI, TAU); ctx.stroke();
    ctx.strokeStyle = '#2a1a12'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - 100, ey - 120); ctx.quadraticCurveTo(ex, ey - (o.sleepy ? 120 : 150), ex + 100, ey - 125); ctx.stroke(); }
  ctx.strokeStyle = '#c08a6a'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(540, 960); ctx.quadraticCurveTo(500, 1120, 560, 1160); ctx.stroke();
  ctx.strokeStyle = '#8a3a3a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(430, 1300); ctx.quadraticCurveTo(540, o.sleepy ? 1290 : 1340, 650, 1300); ctx.stroke();
  if (o.ice) { const k = eo(clamp(u * 2)); for (const ex of [360, 720]) { ctx.save(); ctx.translate(ex, 1000 + (1 - k) * 300); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(180,230,255,.85)'; ctx.beginPath(); ctx.roundRect(-120, -40, 240, 90, 30); ctx.fill(); spark(0, 0, 160, .4, '200,240,255'); ctx.restore(); } }
  if (o.zz) { for (let i = 0; i < 3; i++) { const ph = (s * .45 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; ctx.textAlign = 'center'; txt('Z', 900 + ph * 100, 600 - ph * 200, 60 + i * 20, '#e8eefc', 'rgba(0,0,0,.6)', 8, '400', 'Anton'); ctx.restore(); } }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 520, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function notBruise(u, s) {                                                       // bruise? pigment? → crossed out
  faceFront(u, s, { dark: 1, sleepy: 1 });
  ['BRUISES?', 'PIGMENT?'].forEach((t, i) => { const a = eo(clamp(u * 3 - i * .7)), c = eo(clamp(u * 3 - i * .7 - 1)), x = i ? 780 : 300; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; txt(t, x, 540, 90, '#fff', '#000', 14, '400', 'Anton'); if (c > 0) tube([[x - 190, 510], [x - 190 + 380 * c, 510]], 16, '#ff3a3a'); ctx.restore(); });
}
// skin cross-section; o.thin: under-eye skin (thin, no fat); o.pool: capillaries swollen; o.light: light passing through
function skinSection(u, s, o) {
  bgDeep(s, ['#2a1424', '#0e060c']); const top = o.thin ? 700 : 520, th = o.thin ? 50 : 230, fat = o.thin ? 0 : 260;
  ctx.fillStyle = '#e8b896'; ctx.fillRect(-300, top, 1700, th); ctx.fillStyle = '#d99a7a'; ctx.fillRect(-300, top + th * .3, 1700, th * .7);
  if (fat) { const R = RN(2); ctx.fillStyle = '#f2dc9a'; ctx.fillRect(-300, top + th, 1700, fat); for (let i = 0; i < 30; i++) { ctx.strokeStyle = 'rgba(200,170,90,.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(R() * 1100, top + th + 30 + R() * (fat - 60), 30 + R() * 20, 0, TAU); ctx.stroke(); } }
  const vy = top + th + fat + 110, sw = o.pool ? (typeof o.pool === 'function' ? o.pool(u) : 1) : 0;
  ctx.fillStyle = '#5a2030'; ctx.fillRect(-300, top + th + fat, 1700, 500);
  for (let i = 0; i < 3; i++) { const y = vy + i * 120, p = wavy(-300, y, 0, 1700, 20, 3 + i); tube(p, 40 + sw * 30, `rgb(${Math.round(lerp(190, 90, sw))},${Math.round(lerp(40, 40, sw))},${Math.round(lerp(60, 140, sw))})`);
    const R = RN(i + 3); for (let k = 0; k < 10; k++) { const ph = (s * (.25 * (1 - sw * .85)) + R()) % 1, x = -300 + ph * 1700; ctx.fillStyle = sw > .5 ? '#7a3a9a' : '#ff5a6a'; ctx.beginPath(); ctx.ellipse(x, y + Math.sin((x + 300) / 1700 * (3 + i) * Math.PI) * 20, 16, 10, 0, 0, TAU); ctx.fill(); } }
  if (o.light) { for (let i = 0; i < 5; i++) { const x = 200 + i * 170; ctx.strokeStyle = 'rgba(255,250,200,.6)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x - 120, top - 300); ctx.lineTo(x, vy); ctx.lineTo(x + 120, top - 300); ctx.stroke(); } const pulse = .5 + .5 * Math.sin(s * 4); ctx.fillStyle = `rgba(120,60,180,${.35 + .2 * pulse})`; ctx.fillRect(-300, top, 1700, th); }
  ctx.textAlign = 'left'; label(o.thin ? 'UNDER-EYE SKIN  < 0.5 mm' : 'NORMAL SKIN', 80, top - 40, 46, '#fff', 'left'); if (fat) label('FAT LAYER', 80, top + th + fat / 2 + 15, 40, '#8a6a20', 'left'); label('CAPILLARIES', 80, vy + 330, 40, '#ffb0c0', 'left');
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 500, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function causes3(u, s) {
  bgDeep(s, ['#1e1a2e', '#0a0812']);
  const tile = (y, i, title, draw) => { const k = eo(clamp(u * 3.2 - i * .75)); ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 300, 0); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(90, y - 140, 900, 280, 40); ctx.fill(); draw(270, y); ctx.textAlign = 'left'; txt(title, 450, y + 30, 90, '#fff', '#000', 14, '400', 'Anton'); ctx.restore(); };
  tile(520, 0, 'EXHAUSTED', (x, y) => { ctx.strokeStyle = '#f2ece4'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(x - 100, y); ctx.quadraticCurveTo(x, y + 60, x + 100, y); ctx.stroke(); txt('z', x + 100, y - 50, 70, '#fff', '#000', 8, '400', 'Anton'); });
  tile(830, 1, 'DEHYDRATED', (x, y) => { ctx.fillStyle = 'rgba(120,180,255,.3)'; ctx.beginPath(); ctx.moveTo(x, y - 110); ctx.bezierCurveTo(x + 90, y, x + 70, y + 100, x, y + 100); ctx.bezierCurveTo(x - 70, y + 100, x - 90, y, x, y - 110); ctx.fill(); ctx.strokeStyle = '#7ab0ff'; ctx.lineWidth = 8; ctx.stroke(); });
  tile(1140, 2, 'STRESSED', (x, y) => { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(x + 20, y - 120); ctx.lineTo(x - 60, y + 15); ctx.lineTo(x, y + 15); ctx.lineTo(x - 25, y + 125); ctx.lineTo(x + 70, y - 15); ctx.lineTo(x + 10, y - 15); ctx.closePath(); ctx.fill(); });
}
function fixes3(u, s) {
  bgDeep(s, ['#14283a', '#08121c']);
  const tile = (y, i, title, draw) => { const k = eo(clamp(u * 3.6 - i * .9)); ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 300, 0); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(90, y - 140, 900, 280, 40); ctx.fill(); draw(270, y); ctx.textAlign = 'left'; txt(title, 450, y + 30, 90, '#7aff9a', '#000', 14, '400', 'Anton'); ctx.restore(); };
  tile(520, 0, 'SLEEP', (x, y) => { ctx.fillStyle = '#e8eefc'; ctx.beginPath(); ctx.arc(x, y, 90, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(20,40,60,1)'; ctx.beginPath(); ctx.arc(x + 45, y - 30, 85, 0, TAU); ctx.fill(); });
  tile(830, 1, 'WATER', (x, y) => { ctx.fillStyle = 'rgba(200,230,255,.35)'; ctx.beginPath(); ctx.moveTo(x - 80, y - 120); ctx.lineTo(x + 80, y - 120); ctx.lineTo(x + 60, y + 130); ctx.lineTo(x - 60, y + 130); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#5ab0f0'; ctx.fillRect(x - 70, y - 30 + Math.sin(s * 4) * 6, 140, 150); });
  tile(1140, 2, 'COOL IT DOWN', (x, y) => { ctx.fillStyle = 'rgba(180,230,255,.9)'; ctx.beginPath(); ctx.roundRect(x - 90, y - 70, 180, 140, 26); ctx.fill(); spark(x, y, 140, .4, '200,240,255'); });
}
