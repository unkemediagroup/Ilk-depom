// "How Do Our Wounds Actually Heal?" — anatomical micro-world, drawn in code (Canvas 2D), 1080×1920, 30 fps.
const cv = document.getElementById('c'), ctx = cv.getContext('2d'), W = 1080, H = 1920;
window.DUR = 42.4;
const TAU = Math.PI * 2, clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t;
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, eo = x => 1 - Math.pow(1 - x, 3), ei = x => x * x * x;
function RN(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hx = c => [1, 3, 5].map(i => parseInt(c.substr(i, 2), 16));
const mix = (a, b, t) => { const p = hx(a), q = hx(b); return `rgb(${p.map((v, i) => Math.round(lerp(v, q[i], clamp(t)))).join(',')})`; };

// ---------------- cells (anatomical colours) ----------------
function rbc(x, y, r, rot = 0, sq = .62, bright = 1, alpha = 1) {            // erythrocyte: bright oxygenated red -> dark when trapped
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, sq);
  const g = ctx.createRadialGradient(0, 0, r * .05, 0, 0, r);
  g.addColorStop(0, mix('#6a0a13', '#a50f1a', bright)); g.addColorStop(.4, mix('#7e0c16', '#c8151f', bright)); g.addColorStop(.82, mix('#8a0e18', '#e5333b', bright)); g.addColorStop(1, '#5a060d');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore();
}
function plt(x, y, r, rot = 0, sp = 0) {                                       // platelet: creamy yellowish-white, spiky when activated
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const g = ctx.createRadialGradient(-r * .25, -r * .25, r * .1, 0, 0, r * 1.3);
  g.addColorStop(0, '#fff7dc'); g.addColorStop(.6, '#efdca3'); g.addColorStop(1, '#b89a58');
  ctx.fillStyle = g; ctx.beginPath(); const n = 16;
  for (let i = 0; i <= n; i++) { const a = i / n * TAU, rr = r * (i % 2 ? 1 : 1 + .7 * sp); const px = Math.cos(a) * rr * 1.25, py = Math.sin(a) * rr * .8; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(150,115,50,.55)';
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(Math.cos(i * 1.9) * r * .4, Math.sin(i * 2.7) * r * .25, r * .09, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function neutro(x, y, r, sx = 1) {                                             // neutrophil: pale blue-white, multilobed violet nucleus
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1 / Math.sqrt(sx));
  const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, '#f1f4f8'); g.addColorStop(.7, '#cfd7e4'); g.addColorStop(1, '#8f9db4');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.fillStyle = '#6b4f93'; for (const [a, b] of [[-.35, -.2], [.05, .15], [.38, -.1], [.1, -.42]]) { ctx.beginPath(); ctx.arc(a * r, b * r, r * .26, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(120,130,160,.35)'; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(Math.cos(i * 2.3) * r * .65, Math.sin(i * 1.7) * r * .6, r * .05, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function bact(x, y, len, rot, col = 0) {                                       // bacillus: yellow-green rod
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const w = len * .34;
  const g = ctx.createLinearGradient(0, -w, 0, w); g.addColorStop(0, mix('#d4e06a', '#a9a98a', col)); g.addColorStop(.5, mix('#a8bf3a', '#8c8f70', col)); g.addColorStop(1, mix('#5f7421', '#6c6f58', col));
  ctx.fillStyle = g; ctx.strokeStyle = 'rgba(60,80,15,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-len / 2, -w, len, w * 2, w); ctx.fill(); ctx.stroke(); ctx.restore();
}
function blob(x, y, r, s, amp = .08, pods = []) {                              // amoeboid outline path
  ctx.beginPath(); const n = 56;
  for (let i = 0; i <= n; i++) {
    const a = i / n * TAU; let rr = r * (1 + amp * Math.sin(4 * a + s * 1.6) + amp * .7 * Math.sin(7 * a - s * 2.1) + .04 * Math.sin(3 * a + s));
    for (const [pa, pl] of pods) { let d = Math.atan2(Math.sin(a - pa), Math.cos(a - pa)); rr += r * pl * Math.exp(-d * d / .09); }
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
}
function tube(pts, w, col) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
function wavy(x, y, a, len, amp, k) { const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24, l = t * len, o = Math.sin(t * k) * amp; pts.push([x + Math.cos(a) * l - Math.sin(a) * o, y + Math.sin(a) * l + Math.cos(a) * o]); } return pts; }

// ---------------- backgrounds ----------------
function tissueBG(seed, dens = 1) {                                            // interstitial tissue: pink matrix with cream collagen
  const g = ctx.createLinearGradient(0, -300, 0, 2300); g.addColorStop(0, '#e0a0a0'); g.addColorStop(.5, '#bd6670'); g.addColorStop(1, '#8c3e4a');
  ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600); const R = RN(seed);
  for (let i = 0; i < 70; i++) { const x = R() * 2600 - 700, y = R() * 3000 - 500, r = 60 + R() * 120, gg = ctx.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, 'rgba(140,50,64,.30)'); gg.addColorStop(1, 'rgba(140,50,64,0)'); ctx.fillStyle = gg; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  for (let i = 0; i < 60 * dens; i++) { const p = wavy(R() * 2400 - 600, R() * 2800 - 400, R() * TAU, 500 + R() * 800, 18 + R() * 24, 4 + R() * 4); tube(p, 6 + R() * 8, 'rgba(244,226,190,.42)'); tube(p, 2, 'rgba(255,250,235,.45)'); }
}
function skinBase() {                                                          // finger-pad skin, friction ridges
  const g = ctx.createLinearGradient(0, -400, 0, 2400); g.addColorStop(0, '#e9b799'); g.addColorStop(.5, '#d79d7d'); g.addColorStop(1, '#bd8162');
  ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600); const cx = 520, cy = 1000;
  for (let r = 14; r < 2600; r += 30) {
    ctx.beginPath(); for (let k = 0; k <= 120; k++) { const a = k / 120 * TAU, rr = r * (1 + .05 * Math.sin(3 * a + r * .012) + .03 * Math.sin(5 * a - r * .02)); const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 1.3; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath(); ctx.strokeStyle = 'rgba(150,88,62,.5)'; ctx.lineWidth = 9; ctx.stroke(); ctx.save(); ctx.translate(-2, -3); ctx.strokeStyle = 'rgba(255,222,198,.3)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  }
  const R = RN(5); ctx.fillStyle = 'rgba(120,62,46,.55)'; for (let i = 0; i < 220; i++) { const a = R() * TAU, r = 60 + R() * 1500; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.3, 2.5 + R() * 2, 0, TAU); ctx.fill(); }
}

function vessel(u, s, o) {                                                     // inside a vessel: RBCs + platelets, breach in the wall
  const g0 = ctx.createLinearGradient(0, 300, 0, 1700); g0.addColorStop(0, '#d89399'); g0.addColorStop(1, '#a04a58'); ctx.fillStyle = g0; ctx.fillRect(-2200, -2000, 5600, 6000);
  const R0 = RN(41); for (let i = 0; i < 30; i++) tube(wavy(R0() * 2400 - 600, R0() * 2400 - 200, R0() * TAU, 600, 20, 5), 7, 'rgba(244,226,190,.35)');
  const mode = o.mode, br = mode !== 'flow', c = mode === 'plug' ? eio(clamp(u * 1.2)) * 70 : mode === 'fibrin' ? 70 : 0, yT = 760 + c, yB = 1160 - c;
  const lum = () => { ctx.beginPath(); ctx.moveTo(-400, yT); if (br) { ctx.lineTo(440, yT); ctx.lineTo(470, 560); ctx.lineTo(610, 560); ctx.lineTo(640, yT); } ctx.lineTo(1500, yT); ctx.lineTo(1500, yB); ctx.lineTo(-400, yB); ctx.closePath(); };
  lum(); ctx.lineJoin = 'round'; ctx.strokeStyle = '#a84d59'; ctx.lineWidth = 130; ctx.stroke(); ctx.strokeStyle = '#c86f78'; ctx.lineWidth = 80; ctx.stroke(); ctx.strokeStyle = '#f0b6ac'; ctx.lineWidth = 22; ctx.stroke();
  const lg = ctx.createLinearGradient(0, yT, 0, yB); lg.addColorStop(0, '#7c0c16'); lg.addColorStop(.5, '#a3101b'); lg.addColorStop(1, '#6a0912'); lum(); ctx.fillStyle = lg; ctx.fill();
  ctx.save(); lum(); ctx.clip(); const R = RN(o.seed || 3), leak = 1 - (mode === 'plug' ? clamp((u - .25) * 1.5) : mode === 'fibrin' ? 1 : 0);
  for (let i = 0; i < 42; i++) { const sp = 150 + R() * 110, x = ((R() * 1800 + sp * s) % 1800) - 300, y = yT + 45 + R() * (yB - yT - 90), r = 30 + R() * 8, tm = br && mode === 'fibrin' && x > 330 && x < 760;
    if (tm) continue; if (br && R() < .5 && R() < leak && x > 300 && x < 540) { const k = clamp((x - 300) / 240); rbc(x, lerp(y, 590, eio(k) * .9), r, i + s * 2, .62 + .3 * Math.sin(s * 5 + i), 1); } else rbc(x, y, r, i + s * 2.2, .55 + .3 * Math.abs(Math.sin(s * 3 + i)), 1); }
  ctx.restore();
  if (br) {                                                                    // platelets & fibrin at the breach
    const P = RN(8), n = 54; for (let i = 0; i < n; i++) { const mx = 480 + P() * 120, my = 580 + P() * (yT - 520), sx = -150 - P() * 200, sy = yT + 80 + P() * (yB - yT - 160), a = mode === 'fibrin' ? 9 : .1 + i / n * 1.6, k = mode === 'fibrin' ? 1 : eio(clamp((s - a) / .7)); if (k <= 0 && mode !== 'fibrin') { plt(sx + (s * 260) % 1200 * 0 - 500, sy, 20, i, 0); continue; }
      const px = lerp(sx + 280 * clamp(s - a + .7), mx, k), py = lerp(sy, my, k); if (mode !== 'fibrin' || true) plt(px, py, 22, i + k * 2, k); }
    if (mode === 'fibrin') { const F = RN(12), N = 200; ctx.lineWidth = 3; for (let i = 0; i < N; i++) { const ax = 390 + F() * 300, ay = 540 + F() * (yT - 420), an = F() * TAU, l = 50 + F() * 110; if (i > u * 1.2 * N) continue; ctx.save(); ctx.beginPath(); ctx.rect(380, 500, 320, yT - 440); ctx.clip(); ctx.strokeStyle = 'rgba(240,214,206,.82)'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + Math.cos(an) * l, ay + Math.sin(an) * l); ctx.stroke(); ctx.restore(); }
      const T = RN(55); for (let i = 0; i < 26; i++) rbc(420 + T() * 240, 600 + T() * (yT - 540), 30, T() * 7, .58, .1, clamp(u * 2 - i / 40)); ctx.save(); lum(); ctx.clip(); ctx.fillStyle = 'rgba(66,8,18,' + (.4 * u) + ')'; ctx.fillRect(300, 500, 460, 500); ctx.restore(); }
  } else { const Q = RN(61); for (let i = 0; i < 9; i++) plt(((Q() * 1800 + 200 * s) % 1800) - 300, yT + 70 + Q() * (yB - yT - 140), 22, s + i, 0); neutro(((300 + 130 * s) % 1500) - 200, 960, 56); }
}
function dropAt(x, y, r, a) { if (a <= 0 || r <= .5) return; const gl = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4); gl.addColorStop(0, 'rgba(225,240,120,' + .55 * a + ')'); gl.addColorStop(1, 'rgba(225,240,120,0)'); ctx.fillStyle = gl; ctx.fillRect(x - r * 2.6, y - r * 2.6, r * 5.2, r * 5.2); ctx.fillStyle = 'rgba(238,250,150,' + .92 * a + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,230,' + .6 * a + ')'; ctx.beginPath(); ctx.arc(x - r * .3, y - r * .3, r * .3, 0, TAU); ctx.fill(); }
function eye(u, s, o = {}) {                                                           // human eye, tear film glint
  const g = ctx.createLinearGradient(0, 400, 0, 1600); g.addColorStop(0, '#d9a88c'); g.addColorStop(1, '#b98066'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const cx = 540, cy = 960, bl = o.bl ? o.bl(s) : (o.noblink ? 0 : Math.max(0, Math.sin(clamp((s - 1.3) / .25) * Math.PI))), op = 1 - bl * .95;
  const lid = () => { ctx.beginPath(); ctx.moveTo(40, cy); ctx.bezierCurveTo(260, cy - 330 * op, 820, cy - 330 * op, 1040, cy); ctx.bezierCurveTo(820, cy + 260 * op, 260, cy + 260 * op, 40, cy); ctx.closePath(); };
  ctx.strokeStyle = 'rgba(120,70,55,.6)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(30, cy - 40); ctx.bezierCurveTo(260, cy - 420, 820, cy - 420, 1050, cy - 40); ctx.stroke();
  lid(); const sg = ctx.createRadialGradient(cx, cy, 100, cx, cy, 560); sg.addColorStop(0, '#f6f2ec'); sg.addColorStop(.75, '#ece2da'); sg.addColorStop(1, '#d9a9a0'); ctx.fillStyle = sg; ctx.fill();
  ctx.save(); lid(); ctx.clip(); const R = RN(6); for (let i = 0; i < 14; i++) { const side = i % 2 ? 1 : -1, p = wavy(cx + side * (520 - R() * 60), cy + (R() - .5) * 200, side > 0 ? Math.PI + (R() - .5) * .6 : (R() - .5) * .6, 140 + R() * 120, 10, 5); tube(p, 3, 'rgba(190,40,50,.55)'); }
  const ix = cx + Math.sin(s * .6) * 30, ir = 200; const ig = ctx.createRadialGradient(ix, cy, 40, ix, cy, ir); ig.addColorStop(0, '#a8793e'); ig.addColorStop(.35, '#7a5230'); ig.addColorStop(.85, '#4e3219'); ig.addColorStop(1, '#2a1a0e'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(ix, cy, ir, 0, TAU); ctx.fill();
  for (let i = 0; i < 90; i++) { const a = i / 90 * TAU; ctx.strokeStyle = i % 2 ? 'rgba(200,150,90,.35)' : 'rgba(40,24,12,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ix + Math.cos(a) * 80, cy + Math.sin(a) * 80); ctx.lineTo(ix + Math.cos(a + .05) * (ir - 8), cy + Math.sin(a + .05) * (ir - 8)); ctx.stroke(); }
  ctx.fillStyle = '#060404'; ctx.beginPath(); ctx.arc(ix, cy, o.pupil ? o.pupil(u) : 78, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.roundRect(ix - 110, cy - 120, 60, 44, 10); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(ix + 70, cy + 60, 14, 0, TAU); ctx.fill();
  const tf = ctx.createLinearGradient(0, cy - 300, 0, cy + 300); tf.addColorStop(0, 'rgba(255,255,255,.12)'); tf.addColorStop(.5, 'rgba(255,255,255,0)'); tf.addColorStop(1, 'rgba(200,230,255,.18)'); ctx.fillStyle = tf; ctx.fillRect(0, cy - 400, W, 800);
  if (o.film) { for (let i = 0; i < 3; i++) { const x = ((s * 260 + i * 400) % 1300) - 150; const fg = ctx.createLinearGradient(x - 90, 0, x + 90, 0); fg.addColorStop(0, 'rgba(255,255,255,0)'); fg.addColorStop(.5, 'rgba(225,240,255,' + .32 * o.film + ')'); fg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = fg; ctx.fillRect(x - 90, cy - 400, 180, 800); } }
  ctx.restore();
  lid(); ctx.strokeStyle = '#8c5a4a'; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = 'rgba(230,245,255,.75)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(200, cy + 140 * op); ctx.bezierCurveTo(400, cy + 205 * op, 680, cy + 205 * op, 880, cy + 140 * op); ctx.stroke();
  ctx.strokeStyle = '#2a1a14'; ctx.lineWidth = 6; for (let i = 0; i < 34; i++) { const t = .08 + i / 34 * .84, m = 1 - t, x = m * m * m * 40 + 3 * m * m * t * 260 + 3 * m * t * t * 820 + t * t * t * 1040, y = m * m * m * cy + 3 * m * m * t * (cy - 330 * op) + 3 * m * t * t * (cy - 330 * op) + t * t * t * cy; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + (t - .5) * 60, y - 50, x + (t - .5) * 110, y - 80); ctx.stroke(); }
  const dk = o.tear ? clamp((s - .4) / 1.8) : 0; if (dk > 0) { const dx = 890, dy = cy + 150 + dk * 260; const dg = ctx.createRadialGradient(dx - 8, dy - 8, 2, dx, dy, 30); dg.addColorStop(0, 'rgba(255,255,255,.9)'); dg.addColorStop(1, 'rgba(160,210,240,.45)'); ctx.fillStyle = dg; ctx.beginPath(); ctx.moveTo(dx, dy - 50); ctx.quadraticCurveTo(dx + 30, dy, dx, dy + 26); ctx.quadraticCurveTo(dx - 30, dy, dx, dy - 50); ctx.fill(); }
}
// ---------------- tear-film scenes ----------------
const CEP = 1250;                                                              // corneal epithelium top (world y)
function film(u, s, o) {                                                       // cross-section: corneal epithelium + mucin + aqueous + lipid
  const aT = 560, lT = 500, R = RN(7);
  ctx.fillStyle = '#0c1418'; ctx.fillRect(-2200, -2200, 5600, 2200 + lT);
  const air = ctx.createLinearGradient(0, -200, 0, lT); air.addColorStop(0, 'rgba(60,80,95,.3)'); air.addColorStop(1, 'rgba(120,140,150,.25)'); ctx.fillStyle = air; ctx.fillRect(-2200, -400, 5600, lT + 400);
  const wave = x => Math.sin(x * .01 + s * 2) * 6;
  ctx.beginPath(); ctx.moveTo(-2200, CEP); for (let x = -600; x <= 1700; x += 20) ctx.lineTo(x, lT + wave(x)); ctx.lineTo(3400, lT); ctx.lineTo(3400, CEP); ctx.closePath();
  const aq = ctx.createLinearGradient(0, lT, 0, CEP); aq.addColorStop(0, 'rgba(170,205,225,.55)'); aq.addColorStop(1, 'rgba(190,220,235,.6)'); ctx.fillStyle = aq; ctx.fill();
  for (let x = -600; x <= 1700; x += 40) { const hue = (x * .4 + s * 80) % 360; ctx.fillStyle = `hsla(${40 + Math.sin(hue / 57) * 25},70%,62%,.85)`; ctx.fillRect(x, lT + wave(x) - 22, 42, 26); }
  const mg = ctx.createLinearGradient(0, CEP - 140, 0, CEP); mg.addColorStop(0, 'rgba(230,236,240,0)'); mg.addColorStop(1, 'rgba(232,238,242,.75)'); ctx.fillStyle = mg; ctx.fillRect(-2200, CEP - 140, 5600, 140);
  for (let x = -600; x < 1700; x += 26) { const p = []; for (let y = CEP; y > CEP - 120 - Math.sin(x) * 20; y -= 12) p.push([x + Math.sin(y * .1 + x + s * 2) * 6, y]); tube(p, 3, 'rgba(245,248,250,.7)'); }
  ctx.fillStyle = '#c9d4da'; ctx.fillRect(-2200, CEP, 5600, 2000);
  for (let r = 0; r < 5; r++) for (let x = -600 + (r % 2) * 50; x < 1700; x += 100) { const y = CEP + 20 + r * 70, w = 96 - r * 6; ctx.fillStyle = r === 0 ? '#dde5ea' : '#cfd9df'; ctx.strokeStyle = 'rgba(120,140,155,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, 64, 14); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(110,100,150,.55)'; ctx.beginPath(); ctx.ellipse(x + w / 2, y + 32, 16, 11, 0, 0, TAU); ctx.fill(); }
  if (o.mol) { const M = RN(3); for (let i = 0; i < 70; i++) { const x = M() * 2000 - 400 + Math.sin(s * 1.5 + i) * 20, y = lT + 50 + M() * (CEP - lT - 200) + Math.cos(s * 1.3 + i) * 16; ctx.fillStyle = 'rgba(235,245,255,.85)'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(200,215,230,.9)'; ctx.beginPath(); ctx.arc(x - 9, y + 6, 5, 0, TAU); ctx.arc(x + 9, y + 6, 5, 0, TAU); ctx.fill(); } }
  if (o.dust) { const D = RN(11); for (let i = 0; i < 30; i++) { const ph = (s * .35 + D()) % 1, x = lerp(-300, 1500, ph) + D() * 300, y = lT + 80 + D() * 500 + Math.sin(s * 2 + i) * 20, r = 10 + D() * 26; ctx.save(); ctx.translate(x, y); ctx.rotate(s + i); ctx.fillStyle = ['#7d6a58', '#8f8579', '#5e5148'][i % 3]; ctx.beginPath(); for (let k = 0; k < 7; k++) { const a = k / 7 * TAU, rr = r * (.6 + .5 * Math.abs(Math.sin(k * 3.7 + i))); k ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.restore(); }
    for (let i = 0; i < 9; i++) { const y = lT + 120 + i * 60, ph = (s * .9 + i * .3) % 1; ctx.strokeStyle = 'rgba(255,255,255,' + .45 * (1 - ph) + ')'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-200 + ph * 1400, y); ctx.lineTo(80 + ph * 1400, y); ctx.stroke(); } }
  if (o.germs) { const B = RN(21); for (let i = 0; i < 14; i++) { const x = 120 + B() * 840, y = lT + 120 + B() * 520, ti = .2 + B() * 2.2, k = clamp((s - ti) / 1.0); for (let j = 0; j < 8; j++) { const a = j / 8 * TAU + s, d = lerp(150, 40, clamp((s - ti + 1) / 1)); ctx.fillStyle = 'rgba(240,240,225,.9)'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 7, 0, TAU); ctx.fill(); }
      if (k >= 1) continue; ctx.save(); ctx.globalAlpha = 1 - k * k; ctx.translate(x, y); ctx.scale(1.3 - k * .6, 1.3 - k * .6); bact(0, 0, 80, B() * TAU + Math.sin(s * (3 + k * 18)) * (.2 + k), k); ctx.restore(); } }
  if (o.labels) { ctx.textAlign = 'left'; const L = [['OIL LAYER', 80, lT - 50, .05, '#f2d27a'], ['WATER LAYER', 80, lT + 330, .25, '#cfe6f4'], ['MUCUS LAYER', 80, CEP - 40, .45, '#ffffff'], ['EYE SURFACE (CORNEA)', 80, CEP + 200, .6, '#ffffff']]; for (const [t, x, y, k, c] of L) { const a = eo(clamp((u - k) * 6)); ctx.save(); ctx.globalAlpha = a; ctx.translate(-60 * (1 - a), 0); txt(t, x, y, 44, c, 'rgba(0,0,0,.9)', 10); ctx.restore(); } }
}
function gland(u, s) {                                                         // lacrimal gland: acini secrete, ducts carry tears
  tissueBG(83, .4); const R = RN(5), ac = [];
  for (let i = 0; i < 16; i++) ac.push([R() * 1100 - 20, 300 + R() * 1300, 90 + R() * 50]);
  for (const [x, y, r] of ac) tube([[x, y], [lerp(x, 540, .5), lerp(y, 1750, .4)], [540, 1900]], 26, '#e9b6b0');
  for (const [x, y, r] of ac) tube([[x, y], [lerp(x, 540, .5), lerp(y, 1750, .4)], [540, 1900]], 12, 'rgba(190,220,235,.9)');
  for (const [x, y, r] of ac) { for (let k = 0; k < 7; k++) { const a = k / 7 * TAU, cx = x + Math.cos(a) * r * .55, cy = y + Math.sin(a) * r * .55, g = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, r * .5); g.addColorStop(0, '#f1c2bd'); g.addColorStop(1, '#c97c86'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * .48, 0, TAU); ctx.fill(); ctx.fillStyle = '#7e4a72'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r * .2, cy + Math.sin(a) * r * .2, 9, 0, TAU); ctx.fill(); }
    ctx.fillStyle = 'rgba(200,230,245,.9)'; ctx.beginPath(); ctx.arc(x, y, r * .22, 0, TAU); ctx.fill(); }
  for (const [x, y] of ac) for (let j = 0; j < 3; j++) { const ph = (s * .6 + j / 3 + x * .001) % 1, q = ph < .5 ? [lerp(x, lerp(x, 540, .5), ph * 2), lerp(y, lerp(y, 1750, .4), ph * 2)] : [lerp(lerp(x, 540, .5), 540, ph * 2 - 1), lerp(lerp(y, 1750, .4), 1900, ph * 2 - 1)]; ctx.fillStyle = 'rgba(225,242,255,.95)'; ctx.beginPath(); ctx.arc(q[0], q[1], 9, 0, TAU); ctx.fill(); }
}
function optics(u, s, o) {                                                     // side view of the eye: rays focus (smooth) or scatter (rough)
  ctx.fillStyle = '#0b0f14'; ctx.fillRect(-2200, -2200, 5600, 6600); const cx = 620, cy = 960, R0 = 420;
  ctx.fillStyle = '#efe9e2'; ctx.beginPath(); ctx.arc(cx, cy, R0 + 18, 0, TAU); ctx.fill();
  const rg = ctx.createRadialGradient(cx + 120, cy, 60, cx, cy, R0); rg.addColorStop(0, '#2a0e0c'); rg.addColorStop(.75, '#5e1d16'); rg.addColorStop(.96, '#c4573a'); rg.addColorStop(1, '#e07a4a'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(200,225,240,.35)'; ctx.beginPath(); ctx.ellipse(cx - R0 + 10, cy, 70, 230, 0, Math.PI / 2, Math.PI * 1.5); ctx.fill();
  ctx.fillStyle = '#6b4526'; ctx.fillRect(cx - R0 + 50, cy - 230, 22, 150); ctx.fillRect(cx - R0 + 50, cy + 80, 22, 150);
  ctx.fillStyle = 'rgba(240,230,190,.55)'; ctx.beginPath(); ctx.ellipse(cx - R0 + 140, cy, 60, 110, 0, 0, TAU); ctx.fill();
  const fx = cx + R0 - 6, rough = o.rough ? o.rough(u) : 0, R = RN(4);
  for (let i = 0; i < 9; i++) { const y0 = cy - 160 + i * 40, a = clamp(u * 3 - i * .05), sx = -300, ex = cx - R0 - 60, j = rough * (R() - .5) * 600, ex2 = fx, ey2 = cy + j + rough * (i - 4) * 50;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,240,200,.9)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(sx, y0); ctx.lineTo(ex, y0); ctx.lineTo(cx - R0 + 140, lerp(y0, cy, .25)); ctx.lineTo(ex2, ey2); ctx.stroke(); ctx.restore(); }
  const gl = ctx.createRadialGradient(fx, cy, 0, fx, cy, 60 + rough * 200); gl.addColorStop(0, 'rgba(255,250,220,' + (1 - rough * .7) + ')'); gl.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = gl; ctx.fillRect(fx - 300, cy - 300, 600, 600);
  ctx.fillStyle = 'rgba(190,220,240,.85)'; ctx.beginPath(); ctx.ellipse(cx - R0 - 8, cy, 14 + rough * 6, 250, 0, 0, TAU); ctx.fill();
  if (rough > 0) for (let i = 0; i < 20; i++) { ctx.fillStyle = 'rgba(160,140,120,' + rough + ')'; ctx.beginPath(); ctx.arc(cx - R0 - 20 + R() * 20, cy - 230 + i * 24, 7, 0, TAU); ctx.fill(); }
}
function sharp(u, s) {                                                         // what the retina gets: blur → sharp
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#f2efe8'); g.addColorStop(1, '#dcd6cb'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const bl = (1 - eio(clamp(u * 1.6))) * 22; ctx.save(); if (bl > .5) ctx.filter = `blur(${bl}px)`; ctx.textAlign = 'center'; ctx.fillStyle = '#111';
  const rows = [['E', 300], ['F P', 190], ['T O Z', 130], ['L P E D', 95], ['P E C F D', 70], ['E D F C Z P', 52]]; let y = 520; for (const [t, sz] of rows) { ctx.font = `900 ${sz}px Montserrat`; ctx.fillText(t, 540, y); y += sz * 1.15 + 30; }
  ctx.restore();
}
function wiper(u, s) {                                                         // eyelid sweeps across the cornea, laying a fresh tear film
  ctx.fillStyle = '#0c1418'; ctx.fillRect(-2200, -2200, 5600, 6600); const sy = 1150, ph = clamp(s / 2.3), lx = lerp(-150, 1350, eio(ph));
  ctx.fillStyle = '#c9d4da'; ctx.fillRect(-2200, sy, 5600, 1200);
  for (let r = 0; r < 4; r++) for (let x = -600 + (r % 2) * 50; x < 1700; x += 100) { const y = sy + 16 + r * 70; ctx.fillStyle = '#d6dfe4'; ctx.strokeStyle = 'rgba(120,140,155,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, 92, 62, 14); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(110,100,150,.55)'; ctx.beginPath(); ctx.ellipse(x + 46, y + 31, 15, 10, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(170,205,225,.75)'; ctx.fillRect(-2200, sy - 90, lx + 2200, 90); ctx.fillStyle = 'rgba(240,205,120,.95)'; ctx.fillRect(-2200, sy - 98, lx + 2200, 12);
  const R = RN(4); for (let x = lx; x < 1700; x += 40) { const h = 14 + R() * 30; ctx.fillStyle = 'rgba(170,205,225,.5)'; ctx.beginPath(); ctx.ellipse(x + 20, sy, 22, h, 0, Math.PI, TAU); ctx.fill(); }
  for (let i = 0; i < 26; i++) { const x0 = R() * 1600 - 100, x = Math.max(x0, lx + 30 + (i % 5) * 18), y = sy - 20 - R() * 60; ctx.fillStyle = ['#7d6a58', '#8f8579', '#5e5148'][i % 3]; ctx.beginPath(); ctx.arc(x, y, 9 + R() * 10, 0, TAU); ctx.fill(); }
  ctx.save(); ctx.translate(lx, sy - 100); const lg = ctx.createLinearGradient(0, -700, 0, 0); lg.addColorStop(0, '#c98d72'); lg.addColorStop(1, '#ddaa90'); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(-2400, -700); ctx.lineTo(-60, -700); ctx.bezierCurveTo(90, -500, 120, -120, 40, 0); ctx.lineTo(-2400, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e48e92'; ctx.beginPath(); ctx.moveTo(-2400, -70); ctx.lineTo(10, -70); ctx.quadraticCurveTo(60, -30, 40, 0); ctx.lineTo(-2400, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2a1a14'; ctx.lineWidth = 7; for (let i = 0; i < 8; i++) { const x = 60 - i * 22; ctx.beginPath(); ctx.moveTo(x, -140 + i * 6); ctx.quadraticCurveTo(x + 90, -170, x + 150, -240); ctx.stroke(); } ctx.restore();
  ctx.textAlign = 'center'; txt('FRESH TEAR FILM', Math.max(260, lx - 330), sy - 160, 40, '#cfe6f4', 'rgba(0,0,0,.85)', 9);
}
function windshield(u, s) {
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#22303a'); g.addColorStop(1, '#0e161c'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.fillStyle = '#3a4b57'; ctx.beginPath(); ctx.moveTo(60, 1500); ctx.lineTo(160, 420); ctx.lineTo(920, 420); ctx.lineTo(1020, 1500); ctx.closePath(); ctx.fill();
  const ph = (s / 1.6) % 1, ang = -Math.PI * .92 + Math.sin(ph * Math.PI) * Math.PI * .84, px = 540, py = 1480, L = 880; const R = RN(5);
  ctx.save(); ctx.beginPath(); ctx.moveTo(60, 1500); ctx.lineTo(160, 420); ctx.lineTo(920, 420); ctx.lineTo(1020, 1500); ctx.closePath(); ctx.clip();
  for (let i = 0; i < 120; i++) { const x = R() * 960 + 60, y = R() * 1080 + 420, a = Math.atan2(y - py, x - px), born = R(); const swept = ph < .5 ? a < ang : a > ang; if (swept && born < .7) continue; ctx.fillStyle = 'rgba(200,225,240,.7)'; ctx.beginPath(); ctx.arc(x, y, 6 + R() * 10, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(x - 3, y - 3, 3, 0, TAU); ctx.fill(); }
  ctx.restore(); ctx.strokeStyle = '#111'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang) * L, py + Math.sin(ang) * L); ctx.stroke(); ctx.strokeStyle = '#6a6a6a'; ctx.lineWidth = 10; ctx.stroke();
}
function joint(u, s, o) {                                                      // finger joint: cartilage, synovial fluid, gas bubble pops
  tissueBG(91, .4); const cx = 540 + (o.myth ? Math.sin(s * 40) * 4 : 0), cy = 960, gap = o.myth ? 8 : 70 + (o.pull ? eio(clamp(u * 1.5)) * 50 : 0);
  ctx.fillStyle = 'rgba(236,222,214,.9)'; ctx.beginPath(); ctx.ellipse(cx, cy, 420, 260 + gap, 0, 0, TAU); ctx.fill();
  const sf = ctx.createRadialGradient(cx, cy, 20, cx, cy, 380); sf.addColorStop(0, 'rgba(245,232,170,.95)'); sf.addColorStop(1, 'rgba(232,212,150,.9)'); ctx.fillStyle = sf; ctx.beginPath(); ctx.ellipse(cx, cy, 380, 220 + gap, 0, 0, TAU); ctx.fill();
  for (const d of [-1, 1]) { const y0 = cy + d * (gap + 20); ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.moveTo(cx - 260, y0 + d * 1200); ctx.lineTo(cx - 260, y0 + d * 80); ctx.quadraticCurveTo(cx, y0 - d * 70, cx + 260, y0 + d * 80); ctx.lineTo(cx + 260, y0 + d * 1200); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#dfeaf0'; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(cx - 250, y0 + d * 95); ctx.quadraticCurveTo(cx, y0 - d * 50, cx + 250, y0 + d * 95); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 6; ctx.stroke();
    const R = RN(d + 5); ctx.fillStyle = 'rgba(190,160,110,.5)'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(cx - 230 + R() * 460, y0 + d * (160 + R() * 700), 6 + R() * 12, 0, TAU); ctx.fill(); } }
  if (o.gas) { const G = RN(12); for (let i = 0; i < 60; i++) { const x = cx + (G() - .5) * 640, y = cy + (G() - .5) * 2 * gap * .9, a = .5 + .4 * Math.sin(s * 3 + i); ctx.fillStyle = 'rgba(255,255,255,' + a + ')'; ctx.beginPath(); ctx.arc(x + Math.sin(s * 2 + i) * 6, y, 5, 0, TAU); ctx.fill(); } ctx.textAlign = 'center'; txt('CO₂ · O₂ · N₂', cx, cy - gap - 140, 44, '#fff', 'rgba(0,0,0,.85)', 9); }
  if (o.labels) { ctx.textAlign = 'left'; txt('SYNOVIAL FLUID', 80, cy + 10, 46, '#f6e6a8', 'rgba(0,0,0,.9)', 10); txt('CARTILAGE', 80, cy - gap - 120, 40, '#dfeaf0', 'rgba(0,0,0,.9)', 9); txt('JOINT CAPSULE', 700, cy + gap + 330, 38, '#fff', 'rgba(0,0,0,.9)', 9); }
  if (o.myth || o.nobub) return;
  const bk = o.pull ? clamp(u * 1.6) : clamp((s % 2.2) / 1.6), pop = o.pull && u > .7 ? clamp((u - .7) / .1) : 0, br = 30 + 90 * eo(bk);
  if (pop < 1) { ctx.save(); ctx.globalAlpha = 1 - pop; const bg = ctx.createRadialGradient(cx - br * .3, cy - br * .3, 4, cx, cy, br); bg.addColorStop(0, 'rgba(255,255,255,.9)'); bg.addColorStop(.7, 'rgba(235,240,245,.35)'); bg.addColorStop(1, 'rgba(200,210,220,.7)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx, cy, br * (1 + pop * .5), 0, TAU); ctx.fill(); ctx.restore(); }
  if (pop > 0) { for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; ctx.strokeStyle = 'rgba(255,255,255,' + (1 - pop) + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 120 * pop, cy + Math.sin(a) * 120 * pop); ctx.lineTo(cx + Math.cos(a) * 240 * pop, cy + Math.sin(a) * 240 * pop); ctx.stroke(); } }
}
function film2(u, s, o) {
  film(u, s, o); const lT = 500;
  if (o.focus) { const y = o.focus === 'oil' ? lT - 10 : o.focus === 'water' ? 870 : CEP - 70, h = o.focus === 'oil' ? 70 : o.focus === 'water' ? 620 : 150, a = .5 + .35 * Math.sin(s * 5); ctx.strokeStyle = 'rgba(255,215,90,' + a + ')'; ctx.lineWidth = 8; ctx.setLineDash([26, 16]); ctx.strokeRect(-300, y - h / 2, 1700, h); ctx.setLineDash([]); }
  if (o.evap) { const M = RN(15); for (let i = 0; i < 40; i++) { const x = M() * 1500 - 200, sp = .45 + M() * .4, ph = (s * sp + M()) % 1, y = ph < .55 ? lerp(1000, lT + 14, ph / .55) : lT + 14 + 260 * ((ph - .55) / .45) * (1 - (ph - .55) / .9); ctx.fillStyle = 'rgba(235,245,255,.9)'; ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(200,215,230,.95)'; ctx.beginPath(); ctx.arc(x - 10, y + 7, 6, 0, TAU); ctx.arc(x + 10, y + 7, 6, 0, TAU); ctx.fill(); if (ph > .53 && ph < .6) { ctx.strokeStyle = 'rgba(255,230,140,.9)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, lT + 4, 26, Math.PI, TAU); ctx.stroke(); } }
    for (let i = 0; i < 8; i++) { const ph = (s * .3 + i / 8) % 1; ctx.fillStyle = 'rgba(220,235,245,' + .35 * (1 - ph) + ')'; ctx.beginPath(); ctx.arc(-100 + i * 170, lT - 60 - ph * 300, 8, 0, TAU); ctx.fill(); } }
  if (o.o2) { const M = RN(19); for (let i = 0; i < 36; i++) { const x = M() * 1500 - 200, ph = (s * (.3 + M() * .2) + M()) % 1, y = lerp(lT - 200, CEP + 60, ph), a = ph > .85 ? (1 - ph) / .15 : 1; ctx.save(); ctx.globalAlpha = a; if (i % 3) { ctx.fillStyle = 'rgba(215,232,255,.95)'; ctx.beginPath(); ctx.arc(x - 9, y, 13, 0, TAU); ctx.arc(x + 9, y, 13, 0, TAU); ctx.fill(); ctx.fillStyle = '#35507a'; ctx.font = '900 13px Montserrat'; ctx.textAlign = 'center'; ctx.fillText('O₂', x, y + 5); } else { ctx.fillStyle = 'rgba(250,236,200,.95)'; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a2 = k / 6 * TAU; k ? ctx.lineTo(x + Math.cos(a2) * 15, y + Math.sin(a2) * 15) : ctx.moveTo(x + Math.cos(a2) * 15, y + Math.sin(a2) * 15); } ctx.closePath(); ctx.fill(); } ctx.restore(); } }
  if (o.spread) { const fr = lerp(-250, 1500, eio(clamp(u * 1.15))); ctx.fillStyle = '#0c1418'; ctx.fillRect(fr, -2200, 3000, 2200 + lT - 30); const air = ctx.createLinearGradient(0, lT, 0, CEP); air.addColorStop(0, '#16212a'); air.addColorStop(1, '#1e2a32'); ctx.fillStyle = air; ctx.beginPath(); ctx.moveTo(fr + 40, lT - 30); ctx.quadraticCurveTo(fr - 20, CEP - 220, fr + 120, CEP - 160); ctx.lineTo(3400, CEP - 160); ctx.lineTo(3400, lT - 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(232,238,242,.6)'; ctx.fillRect(fr + 120, CEP - 160, 3000, 30); }
}
function meibom(u, s) {                                                        // eyelid section: meibomian glands release oil at the lid margin
  tissueBG(97, .3); ctx.fillStyle = '#efe2d6'; ctx.fillRect(250, -2200, 600, 3900);
  ctx.fillStyle = '#d7a184'; ctx.fillRect(-2200, -2200, 2450, 3900); ctx.fillStyle = '#e48e92'; ctx.fillRect(850, -2200, 80, 3900);
  for (const gx of [420, 680]) { tube([[gx, 0], [gx, 1650]], 40, '#e8cf9a'); tube([[gx, 0], [gx, 1650]], 18, '#f6dc8a');
    for (let y = 60; y < 1500; y += 120) for (const d of [-1, 1]) { const x = gx + d * 85, g = ctx.createRadialGradient(x - 10, y - 10, 6, x, y, 58); g.addColorStop(0, '#fbebc0'); g.addColorStop(1, '#d9b06a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 56, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,250,225,.75)'; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + Math.cos(k * 1.3) * 26, y + Math.sin(k * 2.1) * 24, 9, 0, TAU); ctx.fill(); } tube([[x, y], [gx, y + 30]], 12, '#f6dc8a'); }
    for (let j = 0; j < 8; j++) { const ph = (s * .5 + j / 8 + gx * .001) % 1; ctx.fillStyle = 'rgba(245,214,120,.95)'; ctx.beginPath(); ctx.arc(gx, lerp(100, 1700, ph), 12, 0, TAU); ctx.fill(); } }
  ctx.fillStyle = '#c98d72'; ctx.beginPath(); ctx.moveTo(-2200, 1700); ctx.lineTo(820, 1700); ctx.quadraticCurveTo(940, 1720, 930, 1640); ctx.lineTo(930, 1700); ctx.lineTo(3400, 1700); ctx.lineTo(3400, 3000); ctx.lineTo(-2200, 3000); ctx.closePath(); ctx.fillStyle = '#0c1418'; ctx.fillRect(-2200, 1700, 5600, 1500);
  ctx.strokeStyle = '#2a1a14'; ctx.lineWidth = 9; for (let i = 0; i < 6; i++) { const x = 300 + i * 40; ctx.beginPath(); ctx.moveTo(x, 1700); ctx.quadraticCurveTo(x - 40, 1850, x - 140, 1950); ctx.stroke(); }
  for (const gx of [420, 680]) for (let j = 0; j < 4; j++) { const ph = (s * .45 + j / 4) % 1; ctx.fillStyle = 'rgba(245,214,120,' + (1 - ph * .5) + ')'; ctx.beginPath(); ctx.ellipse(gx + ph * 520, 1700 + 14 + ph * 20, 20 + ph * 30, 10, 0, 0, TAU); ctx.fill(); }
  ctx.textAlign = 'left'; txt('OIL (MEIBUM)', 940, 1800, 40, '#f6dc8a', 'rgba(0,0,0,.9)', 9);
}
function yawn(u, s, o) {                                                       // a wide yawn, close up
  const g = ctx.createLinearGradient(0, 300, 0, 1700); g.addColorStop(0, '#e1ab8f'); g.addColorStop(1, '#c58767'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const op = o.op(u, s), cx = 540, cy = 960, w = 300 + op * 40, h = 30 + op * 300;
  ctx.fillStyle = 'rgba(150,90,70,.35)'; ctx.beginPath(); ctx.ellipse(cx, cy + h + 220, 360, 120, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(160,100,80,.35)'; ctx.beginPath(); ctx.ellipse(cx, cy - h - 260, 160, 80, 0, 0, TAU); ctx.fill();
  const mouth = (k) => { ctx.beginPath(); ctx.moveTo(cx - w - 30 * k, cy); ctx.bezierCurveTo(cx - w * .6, cy - h - 60 * k, cx + w * .6, cy - h - 60 * k, cx + w + 30 * k, cy); ctx.bezierCurveTo(cx + w * .6, cy + h + 70 * k, cx - w * .6, cy + h + 70 * k, cx - w - 30 * k, cy); ctx.closePath(); };
  mouth(1); ctx.fillStyle = '#b9545e'; ctx.fill(); mouth(0); const ig = ctx.createRadialGradient(cx, cy + h * .3, 20, cx, cy, w); ig.addColorStop(0, '#2a080c'); ig.addColorStop(1, '#6a1c24'); ctx.fillStyle = ig; ctx.fill();
  ctx.save(); mouth(0); ctx.clip(); ctx.fillStyle = '#f1ebdf'; for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.roundRect(cx + i * 46 - 20, cy - h - 10 + Math.abs(i) * 8, 40, 60, 10); ctx.fill(); ctx.beginPath(); ctx.roundRect(cx + i * 46 - 20, cy + h - 50 - Math.abs(i) * 8, 40, 60, 10); ctx.fill(); }
  ctx.fillStyle = '#c9646e'; ctx.beginPath(); ctx.ellipse(cx, cy + h - 20, w * .65, h * .45 + 20, 0, Math.PI, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,200,200,.25)'; ctx.beginPath(); ctx.ellipse(cx - 60, cy + h - 70, 80, 20, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#d27a84'; ctx.beginPath(); ctx.ellipse(cx, cy - h * .25, 22, 34 * op + 4, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.fillStyle = 'rgba(255,230,225,.35)'; ctx.beginPath(); ctx.ellipse(cx - 60, cy + h + 40, 120, 14, 0, 0, TAU); ctx.fill();
  if (o.pool) { ctx.save(); mouth(0); ctx.clip(); const lv = o.pool(u), py = cy + h + 10 - lv * h * 1.4; const pg = ctx.createLinearGradient(0, py, 0, cy + h); pg.addColorStop(0, 'rgba(235,245,250,.8)'); pg.addColorStop(1, 'rgba(200,220,230,.55)'); ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(cx - w, py + Math.sin(s * 3) * 3); for (let x = cx - w; x <= cx + w; x += 20) ctx.lineTo(x, py + Math.sin(x * .03 + s * 3) * 4); ctx.lineTo(cx + w, cy + h + 80); ctx.lineTo(cx - w, cy + h + 80); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(cx - 120 + i * 50, py + 14 + (i % 2) * 8, 5, 0, TAU); ctx.fill(); } ctx.restore(); }
  if (o.drool) { const k = clamp(s / 2.5), x = cx + w * .75, y0 = cy + h * .5; const g2 = ctx.createLinearGradient(x - 20, 0, x + 20, 0); g2.addColorStop(0, 'rgba(220,235,245,.5)'); g2.addColorStop(.5, 'rgba(255,255,255,.85)'); g2.addColorStop(1, 'rgba(220,235,245,.5)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.moveTo(x - 10, y0); ctx.quadraticCurveTo(x + 6, y0 + 150 * k, x - 4, y0 + 260 * k); ctx.arc(x, y0 + 260 * k, 22 * k + 6, Math.PI, 0, true); ctx.quadraticCurveTo(x + 26, y0 + 150 * k, x + 10, y0); ctx.closePath(); ctx.fill(); }
}
function pair(u, s, o) {                                                       // someone yawns (top) → you yawn (bottom)
  for (const [top, yc, f] of [[-1400, 480, o.a], [960, 1440, o.b]]) { ctx.save(); ctx.beginPath(); ctx.rect(-900, top, 2900, top < 0 ? 960 - top : 2400); ctx.clip(); ctx.translate(540, yc); ctx.scale(.6, .6); ctx.translate(-540, -960); yawn(u, s, { op: f }); ctx.restore(); }
  ctx.fillStyle = '#0c0c0c'; ctx.fillRect(-600, 950, 2300, 20); ctx.textAlign = 'left'; txt('SOMEONE', 70, 860, 46, '#fff', 'rgba(0,0,0,.85)', 10); txt('YOU', 70, 1060, 46, '#ffd23f', 'rgba(0,0,0,.85)', 10);
  if (o.arc) { const k = clamp((s - .2) / 1.2); for (let i = 0; i < 3; i++) { const ph = (k + i * .2) % 1; ctx.strokeStyle = 'rgba(255,240,200,' + (1 - ph) * .8 + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(860, 960, 40 + ph * 160, 0, TAU); ctx.stroke(); } }
}
function brainShape(cx, cy, sc) { ctx.beginPath(); ctx.moveTo(cx - 380 * sc, cy + 40 * sc); ctx.bezierCurveTo(cx - 420 * sc, cy - 260 * sc, cx - 120 * sc, cy - 360 * sc, cx + 60 * sc, cy - 330 * sc); ctx.bezierCurveTo(cx + 300 * sc, cy - 320 * sc, cx + 440 * sc, cy - 120 * sc, cx + 400 * sc, cy + 80 * sc); ctx.bezierCurveTo(cx + 380 * sc, cy + 200 * sc, cx + 200 * sc, cy + 230 * sc, cx + 80 * sc, cy + 190 * sc); ctx.bezierCurveTo(cx - 60 * sc, cy + 260 * sc, cx - 300 * sc, cy + 240 * sc, cx - 380 * sc, cy + 40 * sc); ctx.closePath(); }
function brainAt(cx, cy, sc, s, glows, seed = 3) {
  ctx.fillStyle = '#c9a29c'; ctx.beginPath(); ctx.ellipse(cx + 250 * sc, cy + 230 * sc, 150 * sc, 95 * sc, -.2, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(140,90,88,.6)'; ctx.lineWidth = 4 * sc; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(cx + 250 * sc, cy + 230 * sc, (140 - i * 10) * sc, (85 - i * 14) * sc, -.2, Math.PI * .9, Math.PI * 2.1); ctx.stroke(); }
  tube([[cx + 130 * sc, cy + 180 * sc], [cx + 150 * sc, cy + 420 * sc]], 70 * sc, '#d2b0a8');
  brainShape(cx, cy, sc); const g = ctx.createRadialGradient(cx - 80 * sc, cy - 120 * sc, 40 * sc, cx, cy, 460 * sc); g.addColorStop(0, '#efcfc8'); g.addColorStop(.6, '#ddb1aa'); g.addColorStop(1, '#bf8c86'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); brainShape(cx, cy, sc); ctx.clip(); const R = RN(seed); for (let i = 0; i < 34; i++) { const p = wavy(cx + (R() - .5) * 820 * sc, cy + (R() - .5) * 600 * sc, R() * TAU, (120 + R() * 220) * sc, 22 * sc, 6); tube(p, 7 * sc, 'rgba(150,95,92,.55)'); tube(p.map(q => [q[0] - 3 * sc, q[1] - 4 * sc]), 3 * sc, 'rgba(255,235,230,.4)'); }
  for (const [gx, gy, gr, ph] of glows) { const a = .55 + .4 * Math.sin(s * 5 + ph), x = cx + gx * sc, y = cy + gy * sc, r = gr * sc; const gl = ctx.createRadialGradient(x, y, 0, x, y, r); gl.addColorStop(0, 'rgba(255,245,200,' + a + ')'); gl.addColorStop(.4, 'rgba(255,200,120,' + a * .6 + ')'); gl.addColorStop(1, 'rgba(255,180,100,0)'); ctx.fillStyle = gl; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  ctx.restore(); brainShape(cx, cy, sc); ctx.strokeStyle = 'rgba(120,70,70,.7)'; ctx.lineWidth = 5 * sc; ctx.stroke();
}
function darkBG() { const g = ctx.createRadialGradient(540, 900, 100, 540, 900, 1300); g.addColorStop(0, '#2a1218'); g.addColorStop(1, '#0a0507'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600); }
function brain(u, s, o) { darkBG(); brainAt(540, 900, 1.1, s, o.glows || [[-180, -80, 220, 0], [60, 40, 180, 1.5], [-40, -200, 160, 3]]); }
function bonds(u, s, o) {
  darkBG(); const k = o.k || 1; for (let i = 0; i < 9; i++) { const y = 700 + i * 30, ph = (s * .8 + i * .11) % 1; const p = []; for (let x = 330; x <= 750; x += 20) p.push([x, y + Math.sin(x * .02 + s * 3 + i) * 18 * k]); tube(p, 5, 'rgba(255,220,160,' + (.35 + .3 * Math.sin(s * 4 + i)) * k + ')'); const x = lerp(330, 750, ph); ctx.fillStyle = 'rgba(255,250,220,.95)'; ctx.beginPath(); ctx.arc(x, y + Math.sin(x * .02 + s * 3 + i) * 18 * k, 8, 0, TAU); ctx.fill(); }
  ctx.save(); ctx.translate(250, 820); ctx.scale(-1, 1); brainAt(0, 0, .5, s, [[-200, -60, 200, 0]]); ctx.restore(); brainAt(830, 820, .5, s, [[-200, -60, 200, 1]], 7);
}
function neurons(u, s) {                                                       // a firing neural network
  darkBG(); const R = RN(12), N = [];
  for (let i = 0; i < 22; i++) N.push([R() * 1300 - 110, R() * 1900 + 10]);
  for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) { const d = Math.hypot(N[i][0] - N[j][0], N[i][1] - N[j][1]); if (d > 430) continue; const mx = (N[i][0] + N[j][0]) / 2 + (R() - .5) * 120, my = (N[i][1] + N[j][1]) / 2 + (R() - .5) * 120; const p = []; for (let t = 0; t <= 1; t += .05) { const m = 1 - t; p.push([m * m * N[i][0] + 2 * m * t * mx + t * t * N[j][0], m * m * N[i][1] + 2 * m * t * my + t * t * N[j][1]]); } tube(p, 7, 'rgba(225,200,160,.55)');
    const ph = (s * (.6 + R() * .5) + R()) % 1, q = p[Math.floor(ph * (p.length - 1))]; const gl = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 46); gl.addColorStop(0, 'rgba(255,250,220,.95)'); gl.addColorStop(1, 'rgba(255,220,150,0)'); ctx.fillStyle = gl; ctx.fillRect(q[0] - 46, q[1] - 46, 92, 92); }
  for (const [x, y] of N) { const g = ctx.createRadialGradient(x - 10, y - 10, 4, x, y, 46); g.addColorStop(0, '#f4dcc8'); g.addColorStop(1, '#b98a7a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 42, 0, TAU); ctx.fill(); ctx.fillStyle = '#7e5a7a'; ctx.beginPath(); ctx.arc(x + 4, y + 4, 15, 0, TAU); ctx.fill(); }
}
function phone(u, s) {
  darkBG(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.roundRect(240, 380, 600, 1160, 70); ctx.fill(); ctx.strokeStyle = '#444'; ctx.lineWidth = 8; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(268, 410, 544, 1100, 50); ctx.clip(); ctx.translate(540, 960); ctx.scale(.62, .62); ctx.translate(-540, -960); yawn(u, s, { op: (u2, s2) => Math.max(0, Math.sin(clamp(s2 / 1.8) * Math.PI)) ** .7 }); ctx.restore();
}
function sound(u, s) {
  darkBG(); for (let i = 0; i < 46; i++) { const x = 120 + i * 18.5, env = Math.exp(-Math.pow((i - 23) / 12, 2)), h = 30 + env * 420 * (.5 + .5 * Math.abs(Math.sin(s * 7 + i * .7))) * clamp(s * 2); ctx.fillStyle = 'rgba(255,215,160,.9)'; ctx.beginPath(); ctx.roundRect(x, 960 - h / 2, 11, h, 6); ctx.fill(); }
  for (let i = 0; i < 3; i++) { const ph = (s * .7 + i / 3) % 1; ctx.strokeStyle = 'rgba(255,230,190,' + (1 - ph) * .6 + ')'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(540, 960, 200 + ph * 500, 0, TAU); ctx.stroke(); }
  ctx.textAlign = 'center'; txt('"AAAHH-HMM…"', 540, 1320, 60, '#fff', 'rgba(0,0,0,.85)', 10, '400', 'Anton');
}
function diaphragm(u, s, o) {                                                  // thorax: lungs over a dome-shaped diaphragm that spasms (hiccup)
  darkBG(); const sp = o.breath ? 0 : (() => { const c = (s + (o.off || 0)) % (o.per || 1.6); return c < .12 ? eo(c / .12) : Math.exp(-(c - .12) * 6); })(), dy = o.breath ? 45 * (.5 + .5 * Math.sin(s * 2.4)) : 70 * sp;
  ctx.fillStyle = 'rgba(230,214,200,.55)'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(540, 520 + i * 110, 470 - i * 8, 26, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(232,220,205,.6)'; ctx.stroke(); }
  for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(540 + d * 40, 420); ctx.bezierCurveTo(540 + d * 420, 360, 540 + d * 470, 900, 540 + d * 430, 1230 + dy * .6); ctx.lineTo(540 + d * 80, 1150 + dy * .6); ctx.closePath(); const g = ctx.createRadialGradient(540 + d * 260, 800, 50, 540 + d * 260, 800, 460); g.addColorStop(0, '#f0b4b6'); g.addColorStop(1, '#c97a82'); ctx.fillStyle = g; ctx.fill(); ctx.fillStyle = 'rgba(150,70,80,.25)'; for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.arc(540 + d * (150 + (i * 37) % 260), 560 + (i * 53) % 600, 10, 0, TAU); ctx.fill(); } }
  tube([[540, 260], [540, 640]], 60, '#e6d6cf'); for (let y = 280; y < 640; y += 34) tube([[514, y], [566, y]], 10, 'rgba(200,180,170,.9)');
  ctx.beginPath(); ctx.moveTo(40, 1450 + dy); ctx.bezierCurveTo(200, 1050 + dy, 880, 1050 + dy, 1040, 1450 + dy); ctx.lineTo(1040, 1500 + dy); ctx.bezierCurveTo(880, 1120 + dy, 200, 1120 + dy, 40, 1500 + dy); ctx.closePath(); const mg = ctx.createLinearGradient(0, 1100, 0, 1500); mg.addColorStop(0, '#b0454e'); mg.addColorStop(1, '#7e2a33'); ctx.fillStyle = mg; ctx.fill();
  ctx.fillStyle = '#e9e0d6'; ctx.beginPath(); ctx.ellipse(540, 1166 + dy, 190, 34, 0, 0, TAU); ctx.fill();
  if (o.air && sp > .05) { for (let i = 0; i < 5; i++) { const ph = (1 - sp + i * .15) % 1; ctx.fillStyle = 'rgba(220,235,245,' + .8 * sp + ')'; ctx.beginPath(); ctx.moveTo(540, 300 + ph * 300); ctx.lineTo(520, 270 + ph * 300); ctx.lineTo(560, 270 + ph * 300); ctx.closePath(); ctx.fill(); } }
  if (o.labels) { ctx.textAlign = 'left'; txt('LUNGS', 120, 760, 44, '#fff', 'rgba(0,0,0,.85)', 9); txt('DIAPHRAGM', 120, 1330 + dy, 50, '#ffd23f', 'rgba(0,0,0,.85)', 10); }
  if (!o.nohic && sp > .4) { ctx.textAlign = 'center'; ctx.save(); ctx.globalAlpha = sp; txt('HIC!', 540 + Math.sin(s * 9) * 10, 360, 120, '#fff', '#8c0e18', 18, '400', 'Anton'); ctx.restore(); }
}
function muscle(u, s, o) {                                                     // striated skeletal muscle fibres (diaphragm), sudden twitch
  darkBG(); const rl = o.relax ? eio(clamp(u * 1.3)) : 0, tw = o.twitch ? (() => { const c = (s - (o.at || 1.0)); return c < 0 ? 0 : c < .1 ? eo(c / .1) : Math.exp(-(c - .1) * 4); })() : 0, sq = 1 - .22 * tw + .12 * rl;
  for (let i = 0; i < 7; i++) { const y = 420 + i * 170, h = 150; ctx.save(); ctx.translate(540, y); ctx.scale(sq, 1 + .12 * tw - .1 * rl); ctx.globalAlpha = 1 - .25 * rl; const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#c45a5f'); g.addColorStop(.5, '#a8434a'); g.addColorStop(1, '#7e2a33'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-900, -h / 2, 1800, h, 70); ctx.fill();
    ctx.strokeStyle = 'rgba(60,10,20,.45)'; ctx.lineWidth = 6; for (let x = -900; x < 900; x += 34) { ctx.beginPath(); ctx.moveTo(x, -h / 2 + 8); ctx.lineTo(x, h / 2 - 8); ctx.stroke(); } ctx.strokeStyle = 'rgba(255,200,200,.18)'; ctx.lineWidth = 3; for (let x = -883; x < 900; x += 34) { ctx.beginPath(); ctx.moveTo(x, -h / 2 + 8); ctx.lineTo(x, h / 2 - 8); ctx.stroke(); }
    ctx.fillStyle = 'rgba(110,70,120,.7)'; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(-700 + k * 280 + i * 40, -h / 2 + 16, 30, 9, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
  if (o.nerve) { const p = [[-200, 200], [200, 300], [400, 420], [540, 500]]; tube(p, 34, '#ead6a2'); tube(p, 20, '#f7ecca'); const k = clamp((s - (o.at || 1) + .7) / .7); if (k < 1) { const q = [lerp(-200, 540, k), lerp(200, 500, k)]; const gl = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 90); gl.addColorStop(0, 'rgba(255,255,230,1)'); gl.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = gl; ctx.fillRect(q[0] - 90, q[1] - 90, 180, 180); } }
  if (tw > .2) { ctx.save(); ctx.globalAlpha = tw; ctx.textAlign = 'center'; txt('SPASM!', 540 + Math.sin(s * 30) * 8, 1180, 130, '#fff', '#8c0e18', 18, '400', 'Anton'); ctx.restore(); }
}
function glottis(u, s, o) {                                                    // vocal folds seen from above, snapping shut
  darkBG(); const cx = 540, cy = 980, c = (s + (o.off || 0)) % 1.6, cl = c < .08 ? eo(c / .08) : c < .4 ? 1 : Math.max(0, 1 - (c - .4) / .3), op = 1 - cl;
  ctx.fillStyle = '#c96f78'; ctx.beginPath(); ctx.ellipse(cx, cy, 440, 560, 0, 0, TAU); ctx.fill(); const mg = ctx.createRadialGradient(cx, cy - 100, 50, cx, cy, 560); mg.addColorStop(0, 'rgba(240,170,170,.6)'); mg.addColorStop(1, 'rgba(120,40,50,.5)'); ctx.fillStyle = mg; ctx.fill();
  ctx.fillStyle = '#d98a8f'; ctx.beginPath(); ctx.ellipse(cx, cy - 420, 260, 120, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1a0508'; ctx.beginPath(); ctx.moveTo(cx, cy - 300); ctx.lineTo(cx - 170 * op - 4, cy + 300); ctx.lineTo(cx + 170 * op + 4, cy + 300); ctx.closePath(); ctx.fill();
  for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx, cy - 300); ctx.lineTo(cx + d * (170 * op + 4), cy + 300); ctx.lineTo(cx + d * (170 * op + 70), cy + 300); ctx.lineTo(cx + d * 60, cy - 300); ctx.closePath(); const g = ctx.createLinearGradient(cx, 0, cx + d * 200, 0); g.addColorStop(0, '#f6efe6'); g.addColorStop(1, '#ddd0c4'); ctx.fillStyle = g; ctx.fill(); }
  for (const d of [-1, 1]) { ctx.fillStyle = '#c9707a'; ctx.beginPath(); ctx.ellipse(cx + d * (190 * op + 120), cy + 360, 70, 50, 0, 0, TAU); ctx.fill(); }
  if (o.hic && cl > .5 && c < .5) { ctx.save(); ctx.globalAlpha = cl; ctx.textAlign = 'center'; txt('HIC!', cx, cy - 330, 170, '#fff', '#8c0e18', 22, '400', 'Anton'); for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,240,210,' + (.7 - i * .2) + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 480 + i * 60 + c * 400, -2.4, -.7); ctx.stroke(); } ctx.restore(); }
  if (o.labels) { ctx.textAlign = 'left'; txt('VOCAL CORDS', 80, cy + 520, 48, '#fff', 'rgba(0,0,0,.85)', 10); }
}
function belly(u, s, o) {                                                      // stomach swelling under the diaphragm (eating fast / fizzy drinks)
  darkBG(); const sw = eio(clamp(u * 1.3)), push = sw * 60;
  ctx.beginPath(); ctx.moveTo(40, 650 - push); ctx.bezierCurveTo(200, 250 - push, 880, 250 - push, 1040, 650 - push); ctx.lineTo(1040, 700 - push); ctx.bezierCurveTo(880, 320 - push, 200, 320 - push, 40, 700 - push); ctx.closePath(); ctx.fillStyle = '#9a3a43'; ctx.fill();
  ctx.save(); ctx.translate(540, 1020); ctx.scale(1 + sw * .25, 1 + sw * .2); ctx.beginPath(); ctx.moveTo(-110, -460); ctx.bezierCurveTo(-240, -380, -310, -120, -240, 180); ctx.bezierCurveTo(-180, 500, 100, 600, 260, 430); ctx.bezierCurveTo(360, 320, 310, 180, 220, 170); ctx.bezierCurveTo(160, 165, 80, 210, 20, 110); ctx.bezierCurveTo(-40, -20, 0, -220, 20, -460); ctx.closePath();
  const g = ctx.createLinearGradient(-300, -400, 300, 500); g.addColorStop(0, '#e29a8e'); g.addColorStop(.5, '#cf7870'); g.addColorStop(1, '#a24850'); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#7e3238'; ctx.lineWidth = 6; ctx.stroke(); ctx.clip();
  if (o.food) { const R = RN(4); for (let i = 0; i < 30; i++) { ctx.fillStyle = ['#c9a06a', '#b98a55', '#d8b47a'][i % 3]; ctx.beginPath(); ctx.ellipse(-180 + R() * 300, 100 + R() * 330 - ((s * 80 * R()) % 60), 30 + R() * 20, 18 + R() * 10, R() * 3, 0, TAU); ctx.fill(); } }
  if (o.fizz) { const R = RN(9); for (let i = 0; i < 70; i++) { const ph = (s * (.4 + R() * .4) + R()) % 1, x = -200 + R() * 360 + Math.sin(s * 3 + i) * 10, y = lerp(450, -300, ph), r = 6 + R() * 16; ctx.strokeStyle = 'rgba(240,250,255,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.arc(x - r * .3, y - r * .3, r * .3, 0, TAU); ctx.fill(); } }
  ctx.restore();
  for (let i = 0; i < 4; i++) { const x = 300 + i * 160, a = .5 + .4 * Math.sin(s * 6 + i); ctx.fillStyle = 'rgba(255,240,210,' + a * sw + ')'; ctx.beginPath(); ctx.moveTo(x, 640 - push); ctx.lineTo(x - 26, 700 - push); ctx.lineTo(x + 26, 700 - push); ctx.closePath(); ctx.fill(); }
  ctx.textAlign = 'left'; txt('DIAPHRAGM', 80, 560 - push, 44, '#ffd23f', 'rgba(0,0,0,.85)', 9); txt('STOMACH', 80, 1300, 44, '#fff', 'rgba(0,0,0,.85)', 9);
}
function goose(u, s, o) {                                                      // skin surface: hair follicles, bumps rise, hairs stand up
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#e3b394'); g.addColorStop(1, '#c78d6c'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const k = eio(clamp(o.k ? o.k(u) : u * 1.2)), R = RN(6);
  for (let i = 0; i < 70; i++) { const x = R() * 1500 - 200, y = R() * 2300 - 200, r = 34 + R() * 14;
    if (k > 0) { const bg = ctx.createRadialGradient(x - r * .3, y - r * .4, 2, x, y, r * (1 + k * .3)); bg.addColorStop(0, 'rgba(250,215,190,' + .7 * k + ')'); bg.addColorStop(.7, 'rgba(225,170,140,' + .4 * k + ')'); bg.addColorStop(1, 'rgba(160,100,75,' + .45 * k + ')'); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, r * (1 + k * .3), 0, TAU); ctx.fill(); }
    ctx.fillStyle = 'rgba(110,60,45,.7)'; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill();
    const a = lerp(.35, 1.45, k) + (R() - .5) * .3, L = 70 + R() * 50; ctx.strokeStyle = 'rgba(70,45,32,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(-a) * L * .6 + 10, y + Math.sin(-a) * L * .6, x + Math.cos(-a) * L, y + Math.sin(-a) * L); ctx.stroke(); }
  const c = ctx.createLinearGradient(0, 0, 0, 1920); c.addColorStop(0, 'rgba(170,200,230,' + .14 * k + ')'); c.addColorStop(1, 'rgba(170,200,230,0)'); ctx.fillStyle = c; ctx.fillRect(-2200, -2200, 5600, 6600);
}
function follicle(u, s, o) {                                                   // skin cross-section: hair follicle + arrector pili muscle
  const k = o.k ? o.k(u, s) : 0, top = 640, cx = 520;
  ctx.fillStyle = '#16232c'; ctx.fillRect(-2200, -2200, 5600, 2200 + top);
  const bump = x => top - 60 * k * Math.exp(-Math.pow((x - cx) / 170, 2)), ep = x => bump(x) + 120;
  const band = (t, b, f) => { ctx.beginPath(); for (let x = -600; x <= 1700; x += 20) ctx.lineTo(x, t(x)); for (let x = 1700; x >= -600; x -= 20) ctx.lineTo(x, b(x)); ctx.closePath(); ctx.fillStyle = f; ctx.fill(); };
  let g = ctx.createLinearGradient(0, top, 0, 2200); g.addColorStop(0, '#dc9a9a'); g.addColorStop(.6, '#c06a74'); g.addColorStop(1, '#a35060'); band(ep, x => 3000, g);
  const R = RN(31); ctx.save(); band(ep, x => 3000, 'rgba(0,0,0,0)'); ctx.clip(); for (let i = 0; i < 40; i++) tube(wavy(R() * 2400 - 600, 900 + R() * 1300, R() * .5 - .25, 400 + R() * 500, 16, 5), 7, 'rgba(244,226,190,.42)');
  for (let i = 0; i < 30; i++) { const x = R() * 2000 - 400, y = 1700 + R() * 400; ctx.fillStyle = '#efd89a'; ctx.strokeStyle = 'rgba(200,150,80,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 40, 0, TAU); ctx.fill(); ctx.stroke(); } ctx.restore();
  g = ctx.createLinearGradient(0, top - 60, 0, top + 120); g.addColorStop(0, '#d9a688'); g.addColorStop(1, '#e9b7a2'); band(bump, ep, g);
  // follicle sheath (angled), bulb, sebaceous gland
  const ang = lerp(.55, .12, k), fx = cx, fy = bump(cx), L = 760, bx = fx - Math.sin(ang) * L, by = fy + Math.cos(ang) * L;
  tube([[fx, fy], [bx, by]], 110, '#e6b9a8'); tube([[fx, fy], [bx, by]], 54, '#c58f7e'); ctx.fillStyle = '#c98473'; ctx.beginPath(); ctx.ellipse(bx, by + 20, 80, 70, ang, 0, TAU); ctx.fill(); ctx.fillStyle = '#a3505c'; ctx.beginPath(); ctx.ellipse(bx, by + 40, 34, 30, 0, 0, TAU); ctx.fill();
  const sgx = lerp(fx, bx, .3) + 80, sgy = lerp(fy, by, .3); ctx.fillStyle = '#f0dba0'; ctx.beginPath(); ctx.ellipse(sgx, sgy, 70, 50, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,245,210,.8)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(sgx - 30 + (i % 3) * 30, sgy - 15 + Math.floor(i / 3) * 30, 12, 0, TAU); ctx.fill(); }
  // hair shaft
  const hl = o.hair || 900, hx = fx + Math.sin(ang * 1.6) * hl * (o.hair ? 1 : 1), hy = fy - Math.cos(ang * 1.6 + .0) * hl; tube([[bx, by], [fx, fy], [lerp(fx, hx, .5) + 30, lerp(fy, hy, .5)], [hx, hy]].map((p, i) => i ? p : p), o.thin ? 10 : 22, '#3a2416'); tube([[fx, fy], [hx, hy]], o.thin ? 3 : 6, 'rgba(160,110,80,.6)');
  // arrector pili: smooth muscle from follicle (mid) to upper dermis
  const ax = lerp(fx, bx, .55), ay = lerp(fy, by, .55), ex = fx + 340, ey = ep(fx + 340) + 40, mid = [lerp(ax, ex, .5) + 20 * (1 - k), lerp(ay, ey, .5) + 60 * (1 - k)], w = 50 + 26 * k;
  tube([[ax, ay], mid, [ex, ey]], w + 10, '#8e3a46'); tube([[ax, ay], mid, [ex, ey]], w, mix('#b4505c', '#cc5664', k));
  for (let i = 1; i < 6; i++) { const t = i / 6, q = [lerp(lerp(ax, mid[0], t), lerp(mid[0], ex, t), t), lerp(lerp(ay, mid[1], t), lerp(mid[1], ey, t), t)]; ctx.fillStyle = '#6e3050'; ctx.beginPath(); ctx.ellipse(q[0], q[1], 16 - 3 * k, 6 + 2 * k, Math.atan2(ey - ay, ex - ax), 0, TAU); ctx.fill(); }
  if (o.labels) { ctx.textAlign = 'left'; txt('HAIR FOLLICLE', bx - 60, by + 160, 42, '#fff', 'rgba(0,0,0,.85)', 9); txt('ARRECTOR PILI MUSCLE', ex - 520, ey + 170, 40, '#ffd23f', 'rgba(0,0,0,.85)', 9); }
  if (k > .3) for (let i = 0; i < 3; i++) { const a = .3 + i * .25; ctx.strokeStyle = 'rgba(255,240,210,' + .8 * k + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex + 40, ey - 20 + i * 30); ctx.lineTo(ex + 90, ey - 30 + i * 30); ctx.stroke(); }
}
function fur(u, s, o) {                                                        // dense ancestral body hair: flat → raised, trapping warm air
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a3a46'); g.addColorStop(1, '#141d24'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const k = o.k ? o.k(u) : 0, sy = 1300; ctx.fillStyle = '#c98d6c'; ctx.fillRect(-2200, sy, 5600, 1500); ctx.fillStyle = '#b77a5a'; ctx.fillRect(-2200, sy, 5600, 30);
  if (o.warm) { const wg = ctx.createLinearGradient(0, sy - 420 * k, 0, sy); wg.addColorStop(0, 'rgba(255,170,90,0)'); wg.addColorStop(1, 'rgba(255,170,90,.45)'); ctx.fillStyle = wg; ctx.fillRect(-2200, sy - 420 * k, 5600, 420 * k);
    for (let i = 0; i < 10; i++) { const ph = (s * .5 + i * .1) % 1, x = -200 + i * 160, y = lerp(300, sy - 440 * k - 10, ph); ctx.strokeStyle = 'rgba(170,210,240,' + .8 * (1 - ph * .5) + ')'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y - 60); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = 'rgba(170,210,240,.8)'; ctx.beginPath(); ctx.moveTo(x - 16, y - 6); ctx.lineTo(x + 16, y - 6); ctx.lineTo(x, y + 16); ctx.closePath(); ctx.fill(); } }
  const R = RN(3); for (let i = 0; i < 260; i++) { const x = R() * 2000 - 450, L = 300 + R() * 200, a = lerp(.2, 1.35, k) + (R() - .5) * .35, cx = x + Math.cos(a) * L * .55 + Math.sin(s * 2 + i) * 6, cy = sy - Math.sin(a) * L * .55; ctx.strokeStyle = ['#3a2416', '#4a2e1c', '#2e1c10'][i % 3]; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, sy); ctx.quadraticCurveTo(cx - 20, cy + 10, x + Math.cos(a) * L, sy - Math.sin(a) * L); ctx.stroke(); }
  if (o.warm) { ctx.textAlign = 'center'; txt('WARM AIR', 540, sy - 150, 56, '#ffd2a0', 'rgba(0,0,0,.85)', 10); txt('COLD AIR', 540, 470, 50, '#cfe6f4', 'rgba(0,0,0,.85)', 10); }
}
function bigger(u, s) {                                                        // bristling hair makes a body outline look bigger
  const g = ctx.createRadialGradient(540, 900, 100, 540, 900, 1200); g.addColorStop(0, '#3a2a22'); g.addColorStop(1, '#120c0a'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const k = eio(clamp(u * 1.3)), cx = 540, cy = 980, rx = 300, ry = 420;
  for (let i = 0; i < 260; i++) { const a = i / 260 * TAU, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, L = 40 + 120 * k + Math.sin(i * 7) * 14, b = a + (1 - k) * 1.1; ctx.strokeStyle = i % 2 ? '#4a2e1c' : '#3a2416'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(b) * L, y + Math.sin(b) * L); ctx.stroke(); }
  ctx.fillStyle = '#9a6a52'; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fill();
  ctx.setLineDash([20, 16]); ctx.strokeStyle = 'rgba(255,220,120,' + .9 * k + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(cx, cy, rx + 150 * k, ry + 150 * k, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  for (const d of [-1, 1]) { const x = cx + d * (rx + 170 * k + 40); ctx.fillStyle = 'rgba(255,220,120,' + k + ')'; ctx.beginPath(); ctx.moveTo(x + d * 60, cy); ctx.lineTo(x, cy - 34); ctx.lineTo(x, cy + 34); ctx.closePath(); ctx.fill(); }
}
function darkRoom(u, s, o) {                                                   // a dark room: blurry & black → clearer (scotopic grey-blue)
  const k = o.k(u), bl = (1 - k) * 16; ctx.save(); if (bl > .5) ctx.filter = `blur(${bl}px)`;
  ctx.fillStyle = '#3a4250'; ctx.fillRect(-2200, -2200, 5600, 3400); ctx.fillStyle = '#2a303a'; ctx.fillRect(-2200, 1200, 5600, 3000);
  ctx.fillStyle = '#4c5666'; ctx.fillRect(620, 260, 340, 420); ctx.fillStyle = '#7d8ba0'; ctx.fillRect(640, 280, 140, 180); ctx.fillRect(800, 280, 140, 180); ctx.fillRect(640, 480, 140, 180); ctx.fillRect(800, 480, 140, 180);
  ctx.fillStyle = '#222831'; ctx.fillRect(60, 360, 360, 840); ctx.fillStyle = '#5a6474'; ctx.beginPath(); ctx.arc(380, 800, 14, 0, TAU); ctx.fill();
  ctx.fillStyle = '#20252d'; ctx.fillRect(560, 980, 460, 40); ctx.fillRect(590, 1020, 30, 320); ctx.fillRect(960, 1020, 30, 320); ctx.fillStyle = '#3e4652'; ctx.beginPath(); ctx.moveTo(740, 980); ctx.lineTo(780, 820); ctx.lineTo(860, 820); ctx.lineTo(900, 980); ctx.closePath(); ctx.fill(); ctx.fillRect(812, 820, 16, -120);
  ctx.fillStyle = '#1c2128'; ctx.fillRect(160, 1050, 260, 40); ctx.fillRect(160, 760, 40, 330); ctx.fillRect(170, 1090, 30, 260); ctx.fillRect(390, 1090, 30, 260);
  if (o.cat) { const x = lerp(-150, 1250, (s * .28) % 1), y = 1380; ctx.fillStyle = '#14171c'; ctx.beginPath(); ctx.ellipse(x, y, 110, 50, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x + 110, y - 40, 40, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 90, y - 70); ctx.lineTo(x + 100, y - 110); ctx.lineTo(x + 115, y - 75); ctx.moveTo(x + 120, y - 75); ctx.lineTo(x + 140, y - 110); ctx.lineTo(x + 145, y - 65); ctx.fill(); tube([[x - 100, y], [x - 170, y - 60], [x - 190, y - 140]], 14, '#14171c'); for (const d of [-60, -20, 40, 80]) tube([[x + d, y + 30], [x + d + 10 * Math.sin(s * 8 + d), y + 100]], 16, '#14171c'); }
  ctx.restore(); ctx.fillStyle = 'rgba(0,0,6,' + (.93 - .62 * k) + ')'; ctx.fillRect(-2200, -2200, 5600, 6600);
  if (o.blurTxt) { ctx.textAlign = 'center'; ctx.save(); ctx.globalAlpha = .9; txt(k < .5 ? 'BLURRY…' : 'CLEARER!', 540, 1560, 70, '#fff', 'rgba(0,0,0,.85)', 12, '400', 'Anton'); ctx.restore(); }
}
function eyeDark(u, s, o) { eye(u, s, o); const d = o.dark ? o.dark(u, s) : 0; if (d > 0) { ctx.fillStyle = 'rgba(0,2,10,' + d + ')'; ctx.fillRect(-2200, -2200, 5600, 6600); }
  if (o.rays) { for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 - .9 + i * .225, ph = (s * .9 + i * .13) % 1, r = lerp(700, 120, ph); ctx.strokeStyle = 'rgba(255,240,200,' + .8 * (1 - ph * .6) + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * r, 960 + Math.sin(a) * r * 1.1 + 600); ctx.lineTo(540 + Math.cos(a) * (r - 120), 960 + Math.sin(a) * (r - 120) * 1.1 + 600); ctx.stroke(); } } }
function retina(u, s, o) {                                                     // photoreceptors: rods (rhodopsin rosy-purple) & cones
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a1416'); g.addColorStop(1, '#1a0c0e'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const regen = o.regen ? o.regen(u) : 1, top = 360, bot = 1500;
  ctx.fillStyle = '#3b1d14'; ctx.fillRect(-2200, top - 140, 5600, 140); ctx.fillStyle = 'rgba(80,40,25,.9)'; for (let x = -600; x < 1700; x += 60) { ctx.beginPath(); ctx.arc(x, top - 70, 26, 0, TAU); ctx.fill(); }
  for (let i = 0, x = -560; x < 1700; x += 64, i++) { const cone = i % 5 === 2; const flash = o.photons ? Math.max(0, 1 - (((s * 1.3 + i * .37) % 2.2) / .35)) : 0;
    if (cone) { const cg = ctx.createLinearGradient(x, 0, x + 50, 0); cg.addColorStop(0, '#d9b08a'); cg.addColorStop(1, '#b88a66'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(x + 25, top + 140); ctx.lineTo(x + 6, top + 330); ctx.lineTo(x + 44, top + 330); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.roundRect(x + 4, top + 330, 42, 360, 14); ctx.fill(); }
    else { const og = ctx.createLinearGradient(x, 0, x + 40, 0); const c1 = mix('#efe2b8', '#c0708e', regen), c2 = mix('#d8c89a', '#93506c', regen); og.addColorStop(0, c1); og.addColorStop(1, c2); ctx.fillStyle = og; ctx.beginPath(); ctx.roundRect(x + 8, top, 34, 330, 12); ctx.fill(); ctx.strokeStyle = 'rgba(60,20,30,.35)'; ctx.lineWidth = 2; for (let y = top + 10; y < top + 330; y += 12) { ctx.beginPath(); ctx.moveTo(x + 10, y); ctx.lineTo(x + 40, y); ctx.stroke(); }
      ctx.fillStyle = '#d7b7a8'; ctx.beginPath(); ctx.roundRect(x + 12, top + 330, 26, 360, 10); ctx.fill(); }
    ctx.fillStyle = '#7a4a6a'; ctx.beginPath(); ctx.ellipse(x + 25, top + 800 + (i % 3) * 40, 20, 26, 0, 0, TAU); ctx.fill(); tube([[x + 25, top + 690], [x + 25, top + 780 + (i % 3) * 40]], 8, '#d7b7a8'); tube([[x + 25, top + 830 + (i % 3) * 40], [x + 25, bot]], 6, 'rgba(215,183,168,.7)');
    if (flash > 0) { const gl = ctx.createRadialGradient(x + 25, top + 160, 0, x + 25, top + 160, 120); gl.addColorStop(0, 'rgba(255,250,220,' + flash + ')'); gl.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 100, top + 40, 250, 240); tube([[x + 25, top + 300], [x + 25, top + 300 + 900 * (1 - flash)]], 10, 'rgba(255,245,200,' + flash + ')'); } }
  if (o.photons) { const P = RN(4); for (let i = 0; i < 26; i++) { const ph = (s * .6 + P()) % 1, x = P() * 1500 - 200; ctx.fillStyle = 'rgba(255,250,225,' + (1 - ph) + ')'; ctx.beginPath(); ctx.arc(x, lerp(bot + 300, top + 160, ph), 9, 0, TAU); ctx.fill(); } }
  if (o.labels) { ctx.textAlign = 'left'; txt('ROD CELLS', 70, top + 400, 50, '#e9b3c8', 'rgba(0,0,0,.9)', 10); txt('CONE CELLS', 70, top + 760, 40, '#e6c49a', 'rgba(0,0,0,.9)', 9); }
  if (o.rhod) { ctx.textAlign = 'center'; txt(regen > .5 ? 'RHODOPSIN REBUILDS' : 'LIGHT-BLEACHED', 540, top + 200, 32, '#e9b3c8', 'rgba(0,0,0,.9)', 10); }
}
function adaptGraph(u, s, o) {                                                 // dark-adaptation curve: cones then rods, plateau ~30 min
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#0d1624'); g.addColorStop(1, '#16202e'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const x0 = 160, x1 = 960, y0 = 1180, y1 = 470; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y1 - 40); ctx.lineTo(x0, y0); ctx.lineTo(x1 + 30, y0); ctx.stroke();
  ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '800 32px Montserrat'; for (const m of [0, 10, 20, 30]) ctx.fillText(m + ' min', lerp(x0, x1, m / 30), y0 + 50); ctx.save(); ctx.translate(x0 - 50, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('SENSITIVITY', 0, 0); ctx.restore();
  const f = m => m < 8 ? .35 * (1 - Math.exp(-m / 2)) : .35 * (1 - Math.exp(-4)) + .62 * (1 - Math.exp(-(m - 8) / 6)), prog = o.full ? 1 : eio(clamp(u * 1.1)), p = [];
  for (let m = 0; m <= 30 * prog; m += .3) p.push([lerp(x0, x1, m / 30), lerp(y0, y1, f(m))]); tube(p, 10, '#a8c4f0'); if (p.length) { const q = p[p.length - 1]; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(q[0], q[1], 14, 0, TAU); ctx.fill(); }
  ctx.textAlign = 'left'; if (prog > .2) txt('CONES', lerp(x0, x1, 2 / 30), lerp(y0, y1, .3) - 30, 36, '#e6c49a', 'rgba(0,0,0,.85)', 8); if (prog > .5) txt('RODS TAKE OVER', lerp(x0, x1, 11 / 30), lerp(y0, y1, .6) - 20, 36, '#e9b3c8', 'rgba(0,0,0,.85)', 8);
  if (o.full) { const a = .5 + .5 * Math.sin(s * 5); ctx.strokeStyle = 'rgba(255,210,63,' + a + ')'; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x1, y1 - 60); ctx.stroke(); ctx.setLineDash([]); ctx.textAlign = 'center'; txt('~30 MIN', x1 - 40, y1 - 90, 64, '#ffd23f', 'rgba(0,0,0,.9)', 12, '400', 'Anton'); }
}
function heart(u, s, o) {                                                      // anatomical heart, beating
  darkBG(); const c = (s % .85) / .85, beat = c < .12 ? eo(c / .12) : c < .3 ? 1 - (c - .12) / .18 * .7 : .3 * (1 - (c - .3) / .7), sc = 1 + .06 * beat;
  ctx.save(); ctx.translate(540, 960); ctx.scale(sc, sc); ctx.rotate(.3);
  tube([[-230, -230], [-240, -560]], 90, '#5d6f9a'); tube([[30, -260], [20, -470], [170, -570], [300, -470], [320, -300]], 110, '#c4646a'); tube([[60, -480], [70, -620]], 40, '#c4646a'); tube([[150, -560], [170, -680]], 36, '#c4646a');
  tube([[-60, -250], [-110, -430], [-260, -470]], 96, '#6d7fa8');
  ctx.beginPath(); ctx.moveTo(-40, 420); ctx.bezierCurveTo(-240, 300, -340, 80, -320, -120); ctx.bezierCurveTo(-310, -250, -200, -320, -60, -300); ctx.bezierCurveTo(80, -330, 260, -300, 320, -160); ctx.bezierCurveTo(360, 0, 260, 220, -40, 420); ctx.closePath();
  const hg = ctx.createRadialGradient(-60, -80, 40, 0, 0, 480); hg.addColorStop(0, '#b24a50'); hg.addColorStop(.6, '#8e2a33'); hg.addColorStop(1, '#5e1820'); ctx.fillStyle = hg; ctx.fill();
  ctx.fillStyle = '#9a3c48'; ctx.beginPath(); ctx.ellipse(-250, -180, 110, 90, -.3, 0, TAU); ctx.fill();
  tube([[-300, -100], [-120, -230], [140, -250], [300, -150]], 34, 'rgba(236,206,130,.75)');
  tube([[-60, -240], [-40, -60], [-20, 140], [-40, 380]], 15, '#c41c26'); tube([[-120, -230], [-250, -50], [-260, 150]], 12, '#c41c26'); tube([[20, -60], [150, 60], [220, 140]], 10, '#6d4a7a'); tube([[-20, 100], [-120, 220]], 8, '#c41c26');
  ctx.fillStyle = 'rgba(255,220,220,.12)'; ctx.beginPath(); ctx.ellipse(-150, -60, 80, 160, -.3, 0, TAU); ctx.fill(); ctx.restore();
  if (o.night) { ctx.fillStyle = 'rgba(10,20,50,.45)'; ctx.fillRect(-2200, -2200, 5600, 6600); ctx.textAlign = 'center'; for (let i = 0; i < 3; i++) { const ph = (s * .4 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; txt('Z', 860 + ph * 100 + i * 10, 560 - ph * 260, 60 + i * 20, '#e8eefc', 'rgba(0,0,0,.6)', 8, '400', 'Anton'); ctx.restore(); } }
  if (o.counter) { const v = Math.round(o.counter[0] * eio(clamp(u * 1.4))); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-2200, -2200, 5600, 6600); ctx.textAlign = 'center'; txt(v.toLocaleString('en-US'), 540, 980, o.counter[2] || 170, '#fff', '#8c0e18', 24, '400', 'Anton'); txt(o.counter[1], 540, 1090, 50, '#ffd23f', 'rgba(0,0,0,.9)', 10, '900'); }
  if (!o.counter && beat > .7) { ctx.textAlign = 'center'; ctx.save(); ctx.globalAlpha = beat; txt('BA-DUM', 540, 1560, 70, '#fff', '#8c0e18', 12, '400', 'Anton'); ctx.restore(); }
}
function chambers(u, s, o) {                                                   // frontal section: RA/RV (deoxygenated) + LA/LV (oxygenated)
  darkBG(); const c = (s % .9) / .9, aC = c < .15 ? Math.sin(c / .15 * Math.PI) : 0, vC = c > .18 && c < .5 ? Math.sin((c - .18) / .32 * Math.PI) : 0;
  ctx.save(); ctx.translate(540, 980); ctx.rotate(.15);
  tube([[100, -330], [110, -520], [260, -600], [380, -500]], 100, '#b85a62'); tube([[-60, -300], [-90, -520], [-260, -560]], 90, '#7a5070'); tube([[-300, -250], [-310, -560]], 80, '#6a4a68');
  ctx.beginPath(); ctx.moveTo(-20, 440); ctx.bezierCurveTo(-280, 300, -400, 60, -380, -150); ctx.bezierCurveTo(-370, -300, -220, -360, -40, -330); ctx.bezierCurveTo(120, -360, 330, -330, 390, -170); ctx.bezierCurveTo(430, 30, 300, 260, -20, 440); ctx.closePath(); const hg = ctx.createRadialGradient(0, 0, 60, 0, 0, 500); hg.addColorStop(0, '#9a3640'); hg.addColorStop(1, '#6a1e26'); ctx.fillStyle = hg; ctx.fill();
  const ch = (x, y, rx, ry, col, k) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx * (1 - .14 * k), ry * (1 - .14 * k), 0, 0, TAU); ctx.fill(); };
  ch(-200, -170, 130, 110, '#5e1424', aC); ch(190, -180, 120, 100, '#c2141e', aC); ch(-170, 120, 150, 230, '#5e1424', vC); ch(150, 110, 120, 240, '#c2141e', vC);
  ctx.fillStyle = 'rgba(240,225,210,.9)'; for (const [x, y, a] of [[-180, -50, aC > 0 ? .9 : 0], [170, -55, aC > 0 ? .9 : 0]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(a ? .5 : 0); ctx.fillRect(-60, -6, 50, 12); ctx.rotate(a ? -1 : 0); ctx.fillRect(10, -6, 50, 12); ctx.restore(); }
  const R = RN(4); for (let i = 0; i < 40; i++) { const right = i < 20, ph = (s * .8 + R()) % 1, x0 = right ? -200 : 190, x1 = right ? -170 : 150, y = lerp(-220, 200, ph) + Math.sin(i) * 30, x = lerp(x0, x1, ph) + (R() - .5) * 120; rbc(x, y, 16, i + s, .6, right ? .15 : 1, .9); }
  if (o.elec) { const k = (s % 1.4) / 1.4, sa = [-260, -260]; const glow = (x, y, r, a) => { const gl = ctx.createRadialGradient(x, y, 0, x, y, r); gl.addColorStop(0, 'rgba(255,250,210,' + a + ')'); gl.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = gl; ctx.fillRect(x - r, y - r, r * 2, r * 2); };
    glow(sa[0], sa[1], 70, .6 + .4 * Math.sin(s * 9)); if (k < .35) { const r = 60 + k / .35 * 420; ctx.strokeStyle = 'rgba(255,245,190,' + (1 - k / .35) + ')'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(sa[0], sa[1], r, -.3, 1.4); ctx.stroke(); }
    if (k > .35 && k < .5) glow(-10, -20, 60, 1); if (k > .5) { const t = (k - .5) / .5; for (const p of [[[-10, -20], [-10, 300], [-150, 380], [-300, 200]], [[-10, -20], [-10, 300], [150, 360], [300, 150]]]) { const n = Math.floor(t * (p.length - 1) * 10) / 10, seg = Math.min(p.length - 2, Math.floor(n)), f = n - seg; const pts = p.slice(0, seg + 1).concat([[lerp(p[seg][0], p[seg + 1][0], f), lerp(p[seg][1], p[seg + 1][1], f)]]); tube(pts, 12, 'rgba(255,245,190,.95)'); } }
    ctx.textAlign = 'left'; txt('SA NODE', sa[0] - 120, sa[1] - 110, 40, '#ffe9a8', 'rgba(0,0,0,.9)', 9); }
  if (o.labels) { ctx.textAlign = 'center'; const L = [['RIGHT\nATRIUM', -200, -170], ['LEFT\nATRIUM', 190, -180], ['RIGHT\nVENTRICLE', -170, 130], ['LEFT\nVENTRICLE', 150, 120]]; L.forEach(([t, x, y], i) => { const a = eo(clamp((u - i * .15) * 5)); ctx.save(); ctx.globalAlpha = a; t.split('\n').forEach((ln, j) => txt(ln, x, y + j * 40 - 10, 34, '#fff', 'rgba(0,0,0,.9)', 8)); ctx.restore(); }); }
  ctx.restore();
}
function ecg(u, s) {
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#07130e'); g.addColorStop(1, '#0b1a14'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.strokeStyle = 'rgba(80,160,110,.15)'; ctx.lineWidth = 2; for (let x = -200; x < 1300; x += 60) { ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, 1600); ctx.stroke(); } for (let y = 300; y < 1600; y += 60) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(1300, y); ctx.stroke(); }
  const pqrst = d => { const b = d % 1; return .12 * Math.exp(-Math.pow((b - .15) / .03, 2)) - .15 * Math.exp(-Math.pow((b - .28) / .008, 2)) + 1 * Math.exp(-Math.pow((b - .3) / .012, 2)) - .25 * Math.exp(-Math.pow((b - .32) / .01, 2)) + .25 * Math.exp(-Math.pow((b - .55) / .05, 2)); };
  const head = (s * 380) % 1400 - 200, p = []; for (let x = -200; x <= head; x += 4) p.push([x, 960 - 330 * pqrst((x + 200) / 330)]); tube(p, 8, '#6dff9e'); const q = p[p.length - 1]; if (q) { const gl = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 60); gl.addColorStop(0, 'rgba(180,255,200,1)'); gl.addColorStop(1, 'rgba(120,255,160,0)'); ctx.fillStyle = gl; ctx.fillRect(q[0] - 60, q[1] - 60, 120, 120); }
  ctx.textAlign = 'right'; txt('♥ 72 BPM', 1000, 420, 64, '#6dff9e', 'rgba(0,0,0,.8)', 8, '400', 'Anton');
}
function cardio(u, s) {                                                        // branched cardiomyocytes with intercalated discs, contracting in sync
  darkBG(); const c = (s % .9) / .9, k = c < .25 ? Math.sin(c / .25 * Math.PI) : 0, sq = 1 - .12 * k;
  ctx.save(); ctx.translate(540, 960); ctx.scale(sq, 1 + .06 * k); ctx.translate(-540, -960); const R = RN(8);
  for (let r = 0; r < 7; r++) for (let cI = 0; cI < 4; cI++) { const x = -260 + cI * 400 + (r % 2) * 200, y = 380 + r * 180, w = 380, h = 130;
    const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, '#c45a5f'); g.addColorStop(.5, '#a8434a'); g.addColorStop(1, '#7e2a33'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y - h / 2, w, h, 30); ctx.fill();
    if (cI % 2) { ctx.beginPath(); ctx.moveTo(x + 200, y + 40); ctx.lineTo(x + 300, y + 130); ctx.lineTo(x + 350, y + 120); ctx.lineTo(x + 260, y + 30); ctx.fill(); }
    ctx.strokeStyle = 'rgba(60,10,20,.4)'; ctx.lineWidth = 5; for (let xx = x + 20; xx < x + w - 10; xx += 26) { ctx.beginPath(); ctx.moveTo(xx, y - h / 2 + 10); ctx.lineTo(xx, y + h / 2 - 10); ctx.stroke(); }
    ctx.fillStyle = '#6e3a6e'; ctx.beginPath(); ctx.ellipse(x + w / 2, y, 34, 20, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#f2d6a8'; ctx.lineWidth = 8; ctx.beginPath(); for (let yy = y - h / 2 + 6; yy < y + h / 2 - 6; yy += 14) ctx.lineTo(x + w - 4 + ((yy / 14) % 2 ? 8 : -8), yy); ctx.stroke(); }
  ctx.restore(); if (k > .5) { ctx.fillStyle = 'rgba(255,240,200,' + (k - .5) * .5 + ')'; ctx.fillRect(-2200, -2200, 5600, 6600); }
  ctx.textAlign = 'left'; txt('HEART MUSCLE CELLS', 80, 1580, 46, '#fff', 'rgba(0,0,0,.85)', 10);
}
function tank(u, s) {                                                          // 7,500 litres a day
  darkBG(); const lv = eio(clamp(u * 1.1)), x0 = 200, x1 = 880, y0 = 1500, y1 = 520;
  ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(x0, y1, x1 - x0, y0 - y1); const top = lerp(y0, y1 + 60, lv);
  const bg = ctx.createLinearGradient(0, top, 0, y0); bg.addColorStop(0, '#d01a24'); bg.addColorStop(1, '#7d0912'); ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, top); for (let x = x0; x <= x1; x += 20) ctx.lineTo(x, top + Math.sin(x * .03 + s * 4) * 10); ctx.lineTo(x1, y0); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(x0, top, x1 - x0, y0 - top); ctx.clip(); const R = RN(3); for (let i = 0; i < 40; i++) rbc(x0 + R() * (x1 - x0), top + 30 + ((R() * 900 + s * 40) % 900), 22, i + s, .6, 1, .7); ctx.restore();
  ctx.strokeStyle = 'rgba(230,240,250,.6)'; ctx.lineWidth = 10; ctx.strokeRect(x0, y1, x1 - x0, y0 - y1);
  ctx.textAlign = 'center'; txt(Math.round(7500 * lv).toLocaleString('en-US') + ' L', 540, 1060, 150, '#fff', 'rgba(0,0,0,.85)', 22, '400', 'Anton'); txt('EVERY DAY', 540, 470, 56, '#ffd23f', 'rgba(0,0,0,.9)', 10);
}
function gut(u, s) {                                                           // small-intestine loops with a glowing enteric nerve net
  darkBG(); const R = RN(5);
  for (let i = 0; i < 9; i++) { const y = 420 + i * 130, p = []; for (let x = 120; x <= 960; x += 20) p.push([x, y + Math.sin(x * .012 + i * 1.4 + s * .6) * 50]); if (i % 2) p.reverse(); tube(p, 120, '#b8646a'); tube(p, 100, '#d9897e'); tube(p.map(q => [q[0], q[1] - 22]), 16, 'rgba(255,215,200,.45)'); }
  for (let i = 0; i < 9; i++) { const y = 420 + i * 130, p = []; for (let x = 120; x <= 960; x += 20) p.push([x, y + Math.sin(x * .012 + i * 1.4 + s * .6) * 50]); tube(p, 4, 'rgba(255,240,200,.55)'); for (let k = 0; k < 3; k++) { const ph = (s * .5 + k / 3 + i * .1) % 1, q = p[Math.floor(ph * (p.length - 1))]; const gl = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 50); gl.addColorStop(0, 'rgba(255,250,220,.95)'); gl.addColorStop(1, 'rgba(255,230,160,0)'); ctx.fillStyle = gl; ctx.fillRect(q[0] - 50, q[1] - 50, 100, 100); } }
}
function counted(u, s, o) { o.base(u, s, o); const v = Math.round(o.n * eio(clamp(u * 1.3))); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-2200, -2200, 5600, 6600); ctx.textAlign = 'center'; txt(v.toLocaleString('en-US'), 540, 980, o.size || 150, '#fff', '#8c0e18', 22, '400', 'Anton'); txt(o.label, 540, 1080, 48, '#ffd23f', 'rgba(0,0,0,.9)', 10); }
function entericWall(u, s, o) {                                                // gut wall section: villi, submucosa, circular & longitudinal muscle, myenteric plexus
  darkBG(); const lum = 300, muc = 640, sub = 900, circ = 1080, plex = 1240, lon = 1300, ser = 1460;
  const g0 = ctx.createLinearGradient(0, 0, 0, lum); g0.addColorStop(0, '#2a1a10'); g0.addColorStop(1, '#4a3418'); ctx.fillStyle = g0; ctx.fillRect(-2200, -2200, 5600, 2200 + muc);
  for (let x = -600; x < 1700; x += 90) { const h = 300 + Math.sin(x * .05) * 30, sw = Math.sin(s * 2 + x * .02) * 10; ctx.beginPath(); ctx.moveTo(x, muc); ctx.quadraticCurveTo(x - 10 + sw, muc - h, x + 35 + sw, muc - h); ctx.quadraticCurveTo(x + 80 + sw, muc - h, x + 70, muc); ctx.closePath(); const vg = ctx.createLinearGradient(0, muc - h, 0, muc); vg.addColorStop(0, '#f2aab0'); vg.addColorStop(1, '#d97a87'); ctx.fillStyle = vg; ctx.fill(); tube([[x + 35, muc], [x + 35 + sw * .6, muc - h + 40]], 8, 'rgba(200,30,40,.7)'); }
  let g = ctx.createLinearGradient(0, muc, 0, sub); g.addColorStop(0, '#e0a0a6'); g.addColorStop(1, '#d3949a'); ctx.fillStyle = g; ctx.fillRect(-2200, muc, 5600, sub - muc);
  ctx.fillStyle = '#e7c9c0'; ctx.fillRect(-2200, sub, 5600, circ - sub); const R = RN(4); for (let i = 0; i < 30; i++) tube(wavy(R() * 2000 - 400, sub + 30 + R() * 120, R() * .4 - .2, 300, 10, 4), 6, 'rgba(244,226,190,.6)');
  tube([[-600, sub + 90], [1700, sub + 90]], 28, '#c41c26');
  const pc = o.peri ? (s * .6) % 1 : -1; for (const [y0, y1, dir] of [[circ, plex, 0], [lon, ser, 1]]) { for (let x = -600; x < 1700; x += dir ? 120 : 40) { const sq = o.peri ? Math.exp(-Math.pow((x / 1100 - pc) * 6, 2)) : 0; ctx.fillStyle = dir ? '#a8434a' : '#b84f57'; ctx.beginPath(); dir ? ctx.ellipse(x + 60, (y0 + y1) / 2, 56, (y1 - y0) / 2 - 4, 0, 0, TAU) : ctx.ellipse(x + 20, (y0 + y1) / 2, 18 - 4 * sq, (y1 - y0) / 2 - 4, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#6e3050'; ctx.beginPath(); ctx.ellipse(dir ? x + 60 : x + 20, (y0 + y1) / 2, dir ? 18 : 5, dir ? 5 : 14, 0, 0, TAU); ctx.fill(); } }
  ctx.fillStyle = '#d9a088'; ctx.fillRect(-2200, plex - 4, 5600, lon - plex + 8);
  const P = []; for (let x = -560; x < 1700; x += 170) P.push([x + (R() - .5) * 40, (plex + lon) / 2]); for (let k = 0; k < P.length - 1; k++) tube([P[k], P[k + 1]], 10, '#f2dfa8'); for (const [x, y] of P) { tube([[x, y], [x + 30, sub + 60]], 5, 'rgba(242,223,168,.8)'); tube([[x, y], [x - 50, muc - 40]], 4, 'rgba(242,223,168,.6)'); ctx.fillStyle = '#f6e6b4'; ctx.beginPath(); ctx.ellipse(x, y, 46, 26, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#8a6a8a'; for (let n = 0; n < 4; n++) { ctx.beginPath(); ctx.arc(x - 24 + n * 16, y, 6, 0, TAU); ctx.fill(); } }
  for (let k = 0; k < 4; k++) { const ph = (s * .45 + k / 4) % 1, x = lerp(-560, 1600, ph); const gl = ctx.createRadialGradient(x, (plex + lon) / 2, 0, x, (plex + lon) / 2, 90); gl.addColorStop(0, 'rgba(255,250,220,.95)'); gl.addColorStop(1, 'rgba(255,230,160,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 90, (plex + lon) / 2 - 90, 180, 180); }
  ctx.fillStyle = '#efd0c4'; ctx.fillRect(-2200, ser, 5600, 40); ctx.fillStyle = '#1a0c10'; ctx.fillRect(-2200, ser + 40, 5600, 2000);
  if (o.labels) { ctx.textAlign = 'left'; const L = [['VILLI (LINING)', 80, 420, 0], ['MUSCLE LAYERS', 80, circ + 60, .2], ['NERVE NETWORK', 80, plex + 30, .4]]; for (const [t, x, y, k] of L) { const a = eo(clamp((u - k) * 6)); ctx.save(); ctx.globalAlpha = a; txt(t, x, y, 46, k === .4 ? '#ffe9a8' : '#fff', 'rgba(0,0,0,.9)', 10); ctx.restore(); } }
}
function peri(u, s) {                                                          // peristalsis: a contraction ring pushes food along
  darkBG(); const cy = 960, pc = (s * .35) % 1; const top = [], bot = [];
  for (let x = -300; x <= 1400; x += 10) { const d = x / 1700 - pc + .18, sq = Math.exp(-Math.pow(d * 9, 2)), r = 230 - 140 * sq; top.push([x, cy - r]); bot.push([x, cy + r]); }
  ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - 60) : ctx.moveTo(p[0], p[1] - 60)); for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1] + 60); ctx.closePath(); ctx.fillStyle = '#b84f57'; ctx.fill();
  ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath(); ctx.fillStyle = '#e7a2a8'; ctx.fill();
  const bx = (pc + .05) * 1700 - 300 + 120; ctx.fillStyle = '#8a6a3a'; ctx.beginPath(); ctx.ellipse(bx, cy, 150, 120, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(200,170,110,.6)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(bx - 80 + i * 30, cy - 40 + (i % 3) * 30, 14, 0, TAU); ctx.fill(); }
  for (let x = -300; x <= 1400; x += 80) { const d = x / 1700 - pc + .18, sq = Math.exp(-Math.pow(d * 9, 2)); if (sq > .3) { ctx.fillStyle = 'rgba(255,245,200,' + sq * .8 + ')'; ctx.beginPath(); ctx.arc(x, cy - 230 + 140 * sq - 40, 14, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x, cy + 230 - 140 * sq + 40, 14, 0, TAU); ctx.fill(); } }
  ctx.textAlign = 'center'; txt('→ FOOD MOVES ALONG', 540, 640, 48, '#fff', 'rgba(0,0,0,.85)', 10);
}
function axis(u, s, o) {                                                       // body silhouette: brain ↔ gut via vagus nerve, blood (hormones), immune cells
  darkBG(); ctx.fillStyle = 'rgba(200,170,160,.12)'; ctx.beginPath(); ctx.arc(540, 360, 190, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(470, 540); ctx.lineTo(610, 540); ctx.lineTo(820, 700); ctx.lineTo(800, 1500); ctx.lineTo(280, 1500); ctx.lineTo(260, 700); ctx.closePath(); ctx.fill();
  brainAt(540, 360, .38, s, [[0, 0, 200, 0]]);
  ctx.save(); ctx.beginPath(); ctx.rect(330, 1050, 420, 400); ctx.clip(); for (let i = 0; i < 6; i++) { const y = 1100 + i * 62, p = []; for (let x = 340; x <= 740; x += 20) p.push([x, y + Math.sin(x * .03 + i) * 16]); tube(p, 52, '#b8646a'); tube(p, 40, '#d9897e'); } ctx.restore();
  const vag = [[520, 470], [500, 640], [490, 820], [510, 980], [480, 1080]], art = [[600, 470], [610, 700], [600, 900], [620, 1080]];
  tube(art, 22, '#a30f1a'); tube(vag, 14, '#f2dfa8');
  const along = (p, t) => { const n = (p.length - 1) * t, k = Math.min(p.length - 2, Math.floor(n)), f = n - k; return [lerp(p[k][0], p[k + 1][0], f), lerp(p[k][1], p[k + 1][1], f)]; };
  for (let k = 0; k < 4; k++) { const ph = (s * .5 + k / 4) % 1, up = k % 2, q = along(vag, up ? 1 - ph : ph); const a = o.mode === 'nerve' || !o.mode ? 1 : .35; const gl = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 46); gl.addColorStop(0, 'rgba(255,250,220,' + a + ')'); gl.addColorStop(1, 'rgba(255,230,160,0)'); ctx.fillStyle = gl; ctx.fillRect(q[0] - 46, q[1] - 46, 92, 92); }
  if (o.mode === 'horm') for (let k = 0; k < 8; k++) { const ph = (s * .4 + k / 8) % 1, q = along(art, 1 - ph); ctx.fillStyle = 'rgba(250,215,120,.95)'; ctx.beginPath(); ctx.arc(q[0], q[1], 12, 0, TAU); ctx.fill(); }
  if (o.mode === 'immune') for (let k = 0; k < 4; k++) { const ph = (s * .35 + k / 4) % 1, q = along(art, 1 - ph); neutro(q[0] + 40, q[1], 22); }
  ctx.textAlign = 'left'; if (o.mode === 'nerve' && !o.vagus) { txt('BRAIN', 760, 380, 40, '#fff', 'rgba(0,0,0,.85)', 8); txt('GUT', 760, 1250, 40, '#fff', 'rgba(0,0,0,.85)', 8); } if (o.vagus) txt('VAGUS NERVE', 150, 800, 36, '#ffe9a8', 'rgba(0,0,0,.85)', 8);
}
function microbiome(u, s) {                                                    // gut bacteria near the villi, releasing signalling molecules
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a1a10'); g.addColorStop(1, '#4a3418'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  for (let x = -600; x < 1700; x += 120) { const h = 520, sw = Math.sin(s * 2 + x * .02) * 14, b = 1750; ctx.beginPath(); ctx.moveTo(x, b); ctx.quadraticCurveTo(x - 10 + sw, b - h, x + 50 + sw, b - h); ctx.quadraticCurveTo(x + 110 + sw, b - h, x + 100, b); ctx.closePath(); const vg = ctx.createLinearGradient(0, b - h, 0, b); vg.addColorStop(0, '#f2aab0'); vg.addColorStop(1, '#d97a87'); ctx.fillStyle = vg; ctx.fill(); }
  const R = RN(7); for (let i = 0; i < 46; i++) { const x = R() * 1400 - 150 + Math.sin(s + i) * 20, y = 300 + R() * 900 + Math.cos(s * .8 + i) * 16, t = i % 3;
    if (t === 0) bact(x, y, 60, R() * TAU + s * .3, 0); else if (t === 1) { ctx.fillStyle = '#9fb06a'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(x + k * 22, y, 12, 0, TAU); ctx.fill(); } } else { ctx.fillStyle = '#b8a77a'; ctx.beginPath(); ctx.ellipse(x, y, 26, 18, R() * 3, 0, TAU); ctx.fill(); }
    const ph = (s * .6 + R()) % 1; ctx.fillStyle = 'rgba(255,240,170,' + (1 - ph) + ')'; ctx.beginPath(); ctx.arc(x + ph * 60, y + ph * 260, 7, 0, TAU); ctx.fill(); }
}
function glowAt(x, y, r, a) { const gl = ctx.createRadialGradient(x, y, 0, x, y, r); gl.addColorStop(0, 'rgba(255,250,220,' + a + ')'); gl.addColorStop(.4, 'rgba(255,230,160,' + a * .5 + ')'); gl.addColorStop(1, 'rgba(255,220,140,0)'); ctx.fillStyle = gl; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function oneNeuron(u, s) {                                                     // soma + dendrites + myelinated axon, impulse runs down it
  darkBG(); const sx = 300, sy = 520, R = RN(6);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, p = [[sx, sy]]; let x = sx, y = sy; for (let k = 0; k < 5; k++) { x += Math.cos(a + (R() - .5) * .8) * 70; y += Math.sin(a + (R() - .5) * .8) * 70; p.push([x, y]); } tube(p, 22, '#d9b8a8'); tube(p.slice(2), 10, '#e8cbbb'); }
  const ax = []; for (let t = 0; t <= 1; t += .02) ax.push([lerp(sx, 860, t) + Math.sin(t * 7) * 60, lerp(sy, 1650, t)]);
  tube(ax, 22, '#d9b8a8'); for (let k = 2; k < ax.length - 3; k += 6) tube(ax.slice(k, k + 5), 64, '#f3e6c4'); 
  const g = ctx.createRadialGradient(sx - 30, sy - 30, 10, sx, sy, 120); g.addColorStop(0, '#f0d4c6'); g.addColorStop(1, '#c9988a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, 110, 0, TAU); ctx.fill(); ctx.fillStyle = '#7e5a7a'; ctx.beginPath(); ctx.arc(sx + 10, sy + 10, 40, 0, TAU); ctx.fill();
  for (let k = 0; k < 2; k++) { const ph = (s * .7 + k * .5) % 1, q = ax[Math.floor(ph * (ax.length - 1))]; glowAt(q[0], q[1], 120, 1); }
  for (let i = 0; i < ax.length - 1; i += 6) { const q = ax[i]; ctx.fillStyle = 'rgba(80,40,60,.6)'; ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, TAU); ctx.fill(); }
  const e = ax[ax.length - 1]; for (let i = 0; i < 4; i++) { const a = -.6 + i * .4; tube([e, [e[0] + Math.cos(a + 1.2) * 120, e[1] + Math.sin(a + 1.2) * 120]], 10, '#d9b8a8'); }
}
function membrane(u, s, o) {                                                   // lipid bilayer with Na+ / K+ channels
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a1a20'); g.addColorStop(1, '#1a1014'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const yT = 860, yB = 1100; ctx.fillStyle = 'rgba(230,200,150,.18)'; ctx.fillRect(-2200, yT, 5600, yB - yT);
  const chX = [100, 420, 740, 1060];
  for (let x = -600; x < 1700; x += 34) { if (chX.some(c => Math.abs(x - c) < 70)) continue; for (const [y, d] of [[yT, 1], [yB, -1]]) { tube([[x - 6, y + d * 20], [x - 8, y + d * 110]], 5, 'rgba(230,205,150,.8)'); tube([[x + 6, y + d * 20], [x + 8, y + d * 110]], 5, 'rgba(230,205,150,.8)'); ctx.fillStyle = '#e8c890'; ctx.beginPath(); ctx.arc(x, y, 17, 0, TAU); ctx.fill(); } }
  const ph = o.phase ? o.phase(u, s) : 'idle';
  chX.forEach((cx, i) => { const na = i % 2 === 0, open = (ph === 'na' && na) || (ph === 'k' && !na) || ph === 'both'; const w = open ? 30 : 6; ctx.fillStyle = na ? '#8a6aa8' : '#6a8aa8'; ctx.beginPath(); ctx.roundRect(cx - 60 - w, yT - 30, 60, yB - yT + 60, 26); ctx.fill(); ctx.beginPath(); ctx.roundRect(cx + w, yT - 30, 60, yB - yT + 60, 26); ctx.fill(); ctx.textAlign = 'center'; txt(na ? 'Na⁺ CHANNEL' : 'K⁺ CHANNEL', cx, yB + 130, 28, '#fff', 'rgba(0,0,0,.85)', 6, '800'); });
  const R = RN(9), ion = (x, y, na, a) => { ctx.save(); ctx.globalAlpha = a; const gg = ctx.createRadialGradient(x - 6, y - 6, 2, x, y, 22); gg.addColorStop(0, na ? '#ffe3a0' : '#e0c8ff'); gg.addColorStop(1, na ? '#d99a3a' : '#8a5ad0'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, 20, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1a10'; ctx.font = '900 16px Montserrat'; ctx.textAlign = 'center'; ctx.fillText(na ? 'Na⁺' : 'K⁺', x, y + 6); ctx.restore(); };
  for (let i = 0; i < 40; i++) { const na = i % 2 === 0, x = R() * 1500 - 200 + Math.sin(s * 2 + i) * 14, out = na ? R() * 600 + 200 : yB + 60 + R() * 500; ion(x, na ? out : out + Math.cos(s + i) * 10, na, 1); }
  for (let i = 0; i < 4; i++) { const cx = chX[i], na = i % 2 === 0, open = (ph === 'na' && na) || (ph === 'k' && !na) || ph === 'both'; if (!open) continue; for (let k = 0; k < 3; k++) { const p = (s * 1.2 + k / 3) % 1, y = na ? lerp(yT - 160, yB + 160, p) : lerp(yB + 160, yT - 160, p); ion(cx, y, na, 1); } }
  if (o.labels) { ctx.textAlign = 'left'; txt('OUTSIDE THE CELL', 60, 440, 44, '#fff', 'rgba(0,0,0,.85)', 9); txt('CELL MEMBRANE', 60, yT - 60, 40, '#e8c890', 'rgba(0,0,0,.85)', 9); txt('INSIDE THE NEURON', 60, 1700, 44, '#fff', 'rgba(0,0,0,.85)', 9); }
  if (o.charge) { ctx.textAlign = 'center'; for (let x = -100; x < 1300; x += 140) { txt('+', x, yT - 220, 70, '#ffd23f', 'rgba(0,0,0,.7)', 8, '900'); txt('−', x + 70, yB + 300, 70, '#a8c4f0', 'rgba(0,0,0,.7)', 8, '900'); } txt('−70 mV', 540, 600, 120, '#fff', '#8c0e18', 18, '400', 'Anton'); }
}
function apGraph(u, s) {                                                       // membrane voltage: rest −70 → spike +40 → undershoot → rest
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#0d1624'); g.addColorStop(1, '#16202e'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const x0 = 240, x1 = 980, v2y = v => lerp(1250, 520, (v + 90) / 140); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, 480); ctx.lineTo(x0, 1280); ctx.lineTo(x1 + 20, 1280); ctx.stroke();
  ctx.setLineDash([12, 10]); ctx.strokeStyle = 'rgba(255,255,255,.25)'; for (const v of [-70, 0, 40]) { ctx.beginPath(); ctx.moveTo(x0, v2y(v)); ctx.lineTo(x1, v2y(v)); ctx.stroke(); } ctx.setLineDash([]);
  ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '800 30px Montserrat'; for (const v of [-70, 0, 40]) ctx.fillText(v + ' mV', x0 - 14, v2y(v) + 10);
  const V = t => t < .3 ? -70 : t < .4 ? -70 + 110 * eo((t - .3) / .1) : t < .52 ? 40 - 125 * eio((t - .4) / .12) : t < .8 ? -85 + 15 * eio((t - .52) / .28) : -70, prog = clamp(u * 1.25), p = [];
  for (let t = 0; t <= prog; t += .004) p.push([lerp(x0, x1, t), v2y(V(t))]); tube(p, 9, '#ffe9a8'); const q = p[p.length - 1]; if (q) glowAt(q[0], q[1], 70, 1);
  ctx.textAlign = 'center'; if (prog > .42) txt('SPIKE!', lerp(x0, x1, .36), v2y(40) - 40, 60, '#ffd23f', 'rgba(0,0,0,.9)', 10, '400', 'Anton'); if (prog > .3) txt('Na⁺ IN', lerp(x0, x1, .24), v2y(5), 34, '#ffe3a0', 'rgba(0,0,0,.9)', 8); if (prog > .55) txt('K⁺ OUT', lerp(x0, x1, .6), v2y(5), 34, '#e0c8ff', 'rgba(0,0,0,.9)', 8);
}
function axonRace(u, s) {                                                      // myelinated axon, saltatory impulse racing through
  darkBG(); const R = RN(4);
  for (let r = 0; r < 4; r++) { const y = 560 + r * 260; tube([[-700, y], [1800, y]], 30, '#d9b8a8'); for (let x = -700 + r * 40; x < 1800; x += 240) { ctx.fillStyle = '#f3e6c4'; ctx.beginPath(); ctx.roundRect(x, y - 44, 210, 88, 40); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x + 20, y - 34, 170, 14); }
    for (let k = 0; k < 2; k++) { const ph = (s * 1.6 + r * .23 + k * .5) % 1, x = lerp(-700, 1800, ph); glowAt(x, y, 120, 1); tube([[x - 300, y], [x, y]], 12, 'rgba(255,245,200,.6)'); } }
}
function bone(u, s, o) {                                                       // compact bone: osteons with concentric lamellae and central canals
  darkBG(); const R = RN(7);
  ctx.fillStyle = '#e9dcc1'; ctx.fillRect(-2200, -2200, 5600, 6600);
  for (let i = 0; i < 26; i++) { const x = R() * 1500 - 200, y = R() * 2200 - 150, r = 150 + R() * 60;
    for (let k = 7; k >= 0; k--) { ctx.fillStyle = k % 2 ? '#e2d2b2' : '#efe4cc'; ctx.beginPath(); ctx.arc(x, y, r * (k + 1) / 8, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#7a2a30'; ctx.beginPath(); ctx.arc(x, y, r * .14, 0, TAU); ctx.fill(); ctx.fillStyle = '#c41c26'; ctx.beginPath(); ctx.arc(x - 4, y, r * .05, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(120,90,60,.7)'; for (let k = 0; k < 10; k++) { const a = k * 1.7, d = r * (.35 + (k % 3) * .2); ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, 9, 4, a + Math.PI / 2, 0, TAU); ctx.fill(); } }
  if (o.steel) { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-2200, -2200, 5600, 6600); const sg = ctx.createLinearGradient(0, 1300, 0, 1560); sg.addColorStop(0, '#c9ced4'); sg.addColorStop(.5, '#8a9098'); sg.addColorStop(1, '#5a6068'); ctx.fillStyle = sg; ctx.fillRect(-300, 1300, 1700, 80); ctx.fillRect(-300, 1480, 1700, 80); ctx.fillRect(-300, 1300, 1700, 260); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-300, 1310, 1700, 12); ctx.textAlign = 'center'; txt('BONE  vs  STEEL', 540, 1260, 70, '#fff', 'rgba(0,0,0,.9)', 12, '400', 'Anton'); }
}
function femurPath() { ctx.beginPath(); ctx.moveTo(420, 300); ctx.bezierCurveTo(300, 220, 260, 380, 360, 440); ctx.bezierCurveTo(420, 470, 470, 520, 480, 600); ctx.lineTo(470, 1350); ctx.bezierCurveTo(470, 1430, 380, 1460, 380, 1560); ctx.bezierCurveTo(380, 1680, 520, 1700, 560, 1640); ctx.bezierCurveTo(600, 1700, 760, 1690, 740, 1560); ctx.bezierCurveTo(730, 1460, 640, 1430, 630, 1350); ctx.lineTo(640, 600); ctx.bezierCurveTo(650, 500, 760, 470, 760, 380); ctx.bezierCurveTo(760, 260, 560, 240, 420, 300); ctx.closePath(); }
function femur(u, s, o) {                                                      // long bone; optional longitudinal cut (compact shell, spongy ends, marrow)
  darkBG(); femurPath(); const g = ctx.createLinearGradient(380, 0, 760, 0); g.addColorStop(0, '#cdbd9a'); g.addColorStop(.45, '#f1e7d0'); g.addColorStop(1, '#bfae8a'); ctx.fillStyle = g; ctx.fill();
  if (o.cut) { ctx.save(); femurPath(); ctx.clip(); ctx.fillStyle = '#e9dcc1'; ctx.fillRect(0, 0, 1080, 1920); ctx.fillStyle = '#e8c070'; ctx.beginPath(); ctx.roundRect(500, 620, 110, 720, 40); ctx.fill(); ctx.fillStyle = 'rgba(200,40,50,.55)'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(510 + (i * 37) % 90, 640 + (i * 53) % 680, 9, 0, TAU); ctx.fill(); }
    const R = RN(3); ctx.strokeStyle = '#d6c3a0'; ctx.lineWidth = 7; for (const [cx, cy] of [[540, 400], [560, 1540]]) for (let i = 0; i < 60; i++) { const a = R() * TAU, l = 30 + R() * 50, x = cx + (R() - .5) * 320, y = cy + (R() - .5) * 220; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); }
    ctx.fillStyle = 'rgba(190,50,60,.5)'; for (const [cx, cy] of [[540, 400], [560, 1540]]) for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(cx + (R() - .5) * 300, cy + (R() - .5) * 200, 8, 0, TAU); ctx.fill(); } ctx.restore();
    ctx.textAlign = 'left'; txt('COMPACT BONE', 680, 900, 38, '#fff', 'rgba(0,0,0,.9)', 8); txt('MARROW', 680, 1000, 38, '#e8c070', 'rgba(0,0,0,.9)', 8); txt('SPONGY BONE', 680, 440, 38, '#fff', 'rgba(0,0,0,.9)', 8); }
  femurPath(); ctx.strokeStyle = 'rgba(120,100,70,.8)'; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(505, 620, 24, 700);
}
function balance(u, s, o) {                                                    // scale: same weight, bone bigger/lighter vs dense steel
  darkBG(); const tilt = o.heavy ? .18 * eio(clamp(u * 1.5)) : .04 * Math.sin(s * 3) * (1 - u), cx = 540, cy = 760;
  ctx.fillStyle = '#5a6068'; ctx.fillRect(cx - 14, cy, 28, 700); ctx.fillRect(cx - 200, cy + 690, 400, 30);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(tilt); ctx.fillStyle = '#9aa0a8'; ctx.fillRect(-420, -10, 840, 20); ctx.restore();
  const pan = (d) => { const x = cx + Math.cos(tilt) * 400 * d, y = cy + Math.sin(tilt) * 400 * d; tube([[x, y], [x - 120, y + 300]], 4, '#9aa0a8'); tube([[x, y], [x + 120, y + 300]], 4, '#9aa0a8'); ctx.fillStyle = '#7a8088'; ctx.fillRect(x - 160, y + 300, 320, 20); return [x, y + 300]; };
  const [bx, by] = pan(-1), [sx, sy] = pan(1);
  const bs = o.heavy ? 150 : 210, ss = o.heavy ? 210 : 120;
  ctx.fillStyle = '#e9dcc1'; ctx.fillRect(bx - bs / 2, by - bs, bs, bs); const R = RN(2); for (let i = 0; i < 6; i++) { const x = bx - bs / 2 + 20 + R() * (bs - 40), y = by - bs + 20 + R() * (bs - 40); for (let k = 3; k > 0; k--) { ctx.fillStyle = k % 2 ? '#e2d2b2' : '#efe4cc'; ctx.beginPath(); ctx.arc(x, y, k * 7, 0, TAU); ctx.fill(); } ctx.fillStyle = '#7a2a30'; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
  const sg = ctx.createLinearGradient(sx - ss / 2, sy - ss, sx + ss / 2, sy); sg.addColorStop(0, '#d4d9de'); sg.addColorStop(.5, '#8a9098'); sg.addColorStop(1, '#5a6068'); ctx.fillStyle = sg; ctx.fillRect(sx - ss / 2, sy - ss, ss, ss);
  ctx.textAlign = 'center'; txt('BONE', bx, by + 90, 52, '#f1e7d0', 'rgba(0,0,0,.9)', 10); txt('STEEL', sx, sy + 90, 52, '#c9ced4', 'rgba(0,0,0,.9)', 10);
  if (o.heavy) txt('HEAVY!', sx, sy - ss - 40, 70, '#ffd23f', 'rgba(0,0,0,.9)', 12, '400', 'Anton'); else txt('SAME WEIGHT', cx, 560, 60, '#ffd23f', 'rgba(0,0,0,.9)', 12, '400', 'Anton');
}
function cube(u, s, o) {                                                       // one cubic inch of bone under a huge load
  darkBG(); const p = eio(clamp(u * 1.4)), cx = 540, cy = 1200, a = 230;
  const face = (pts, col) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  face([[cx - a, cy - a * .5], [cx, cy - a], [cx + a, cy - a * .5], [cx, cy]], '#f1e7d0'); face([[cx - a, cy - a * .5], [cx, cy], [cx, cy + a * 1.1], [cx - a, cy + a * .6]], '#d9c9a8'); face([[cx + a, cy - a * .5], [cx, cy], [cx, cy + a * 1.1], [cx + a, cy + a * .6]], '#c4b38e');
  const R = RN(5); for (let i = 0; i < 10; i++) { const u2 = R(), v2 = R(), x = cx - a + u2 * a + v2 * 0, y = cy - a * .5 + u2 * a * .5 + v2 * a * 1.0; for (let k = 3; k > 0; k--) { ctx.fillStyle = k % 2 ? 'rgba(200,180,140,.6)' : 'rgba(240,230,205,.6)'; ctx.beginPath(); ctx.ellipse(x, y, k * 9, k * 7, 0, 0, TAU); ctx.fill(); } }
  const wy = lerp(200, cy - a - 10, p); ctx.fillStyle = '#3a3f46'; ctx.beginPath(); ctx.roundRect(cx - 380, wy - 360, 760, 360, 30); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(cx - 360, wy - 340, 720, 30); ctx.textAlign = 'center'; txt('19,000 LB', cx, wy - 150, 110, '#fff', 'rgba(0,0,0,.6)', 10, '400', 'Anton');
  if (p > .95) for (let i = 0; i < 6; i++) { const ang = Math.PI + i * .6; tube([[cx + Math.cos(ang) * 300, cy - a + Math.sin(ang) * -40], [cx + Math.cos(ang) * 380, cy - a + Math.sin(ang) * -60]], 6, 'rgba(255,240,200,.7)'); }
  ctx.textAlign = 'left'; txt('1 CUBIC INCH', 60, cy + 40, 54, '#ffd23f', 'rgba(0,0,0,.9)', 10);
}
function composite(u, s, o) {                                                  // collagen fibrils (cream, banded) + mineral crystals (pale grey plates)
  darkBG(); const bend = o.bend ? Math.sin(s * 2.5) * 60 : 0, R = RN(4);
  for (let r = 0; r < 9; r++) { const y0 = 420 + r * 130, p = []; for (let x = -300; x <= 1400; x += 20) p.push([x, y0 + bend * Math.sin((x + 300) / 1700 * Math.PI)]);
    tube(p, 70, '#e9d8b4'); tube(p, 50, '#f3e6c8'); for (let k = 0; k < p.length; k += 3) { const q = p[k]; ctx.fillStyle = 'rgba(180,150,100,.45)'; ctx.fillRect(q[0] - 3, q[1] - 30, 6, 60); }
    if (o.mineral) for (let k = 2; k < p.length; k += 4) { const q = p[k]; ctx.save(); ctx.globalAlpha = o.mineral(u); ctx.translate(q[0], q[1] + 65); ctx.rotate(R() * .3); const mg = ctx.createLinearGradient(-20, -10, 20, 10); mg.addColorStop(0, '#ffffff'); mg.addColorStop(1, '#c8ccd0'); ctx.fillStyle = mg; ctx.fillRect(-26, -9, 52, 18); ctx.restore(); } }
  ctx.textAlign = 'left'; txt('COLLAGEN', 80, 1680, 52, '#f3e6c8', 'rgba(0,0,0,.9)', 10); if (o.mineral && o.mineral(u) > .3) txt('+ MINERAL CRYSTALS', 80, 1760, 46, '#ffffff', 'rgba(0,0,0,.9)', 10);
}
function skeleton(u, s, o) {                                                   // simple anatomical skeleton: stand or run/jump
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#0f1820'); g.addColorStop(1, '#1a2430'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.fillStyle = '#2a3440'; ctx.fillRect(-2200, 1640, 5600, 600); if (o.run) { ctx.fillStyle = 'rgba(255,255,255,.15)'; for (let x = -600 - (s * 700) % 200; x < 1700; x += 200) ctx.fillRect(x, 1660, 100, 10); for (let i = 0; i < 6; i++) { const x = ((-s * 900 + i * 300) % 1800 + 1800) % 1800 - 400; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x, 400 + i * 160, 260, 6); } }
  const run = o.run, ph = s * 4.2, jump = run ? Math.max(0, Math.sin(ph / 2)) ** 3 * 120 : 0, bx = run ? 540 + Math.sin(s) * 40 : 540, by = 960 - jump + (run ? Math.abs(Math.sin(ph)) * -16 : 0), B = '#efe4cc', B2 = '#d4c4a0';
  const limb = (x, y, a1, a2, l1, l2, w) => { const k = [x + Math.sin(a1) * l1, y + Math.cos(a1) * l1], e = [k[0] + Math.sin(a1 + a2) * l2, k[1] + Math.cos(a1 + a2) * l2]; tube([[x, y], k], w + 6, B2); tube([[x, y], k], w, B); tube([k, e], w + 2, B2); tube([k, e], w - 4, B); ctx.fillStyle = B; ctx.beginPath(); ctx.arc(k[0], k[1], w * .8, 0, TAU); ctx.fill(); return e; };
  const sw = run ? Math.sin(ph) : 0;
  const lf1 = limb(bx - 40, by + 280, .5 * sw, run ? Math.max(0, -sw) * 1.2 : 0, 250, 250, 26); const lf2 = limb(bx + 40, by + 280, -.5 * sw, run ? Math.max(0, sw) * 1.2 : 0, 250, 250, 26);
  for (const f of [lf1, lf2]) { ctx.fillStyle = B; ctx.beginPath(); ctx.ellipse(f[0] + 30, f[1] + 10, 50, 16, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = B2; ctx.beginPath(); ctx.ellipse(bx, by + 260, 120, 60, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#1a2430'; ctx.beginPath(); ctx.ellipse(bx, by + 270, 50, 30, 0, 0, TAU); ctx.fill();
  for (let i = 0; i < 16; i++) { ctx.fillStyle = B; ctx.beginPath(); ctx.roundRect(bx - 16, by - 210 + i * 29, 32, 22, 6); ctx.fill(); }
  for (let i = 0; i < 7; i++) { ctx.strokeStyle = B; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(bx, by - 140 + i * 40, 130 - i * 4, 34, 0, Math.PI * .05, Math.PI * .95); ctx.stroke(); ctx.beginPath(); ctx.ellipse(bx, by - 140 + i * 40, 130 - i * 4, 34, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
  limb(bx - 140, by - 190, -.3 - .6 * sw, run ? -1.2 : -.1, 210, 200, 20); limb(bx + 140, by - 190, .3 + .6 * sw, run ? 1.2 : .1, 210, 200, 20); tube([[bx - 150, by - 200], [bx + 150, by - 200]], 16, B);
  ctx.fillStyle = B; ctx.beginPath(); ctx.ellipse(bx, by - 330, 95, 110, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#1a2430'; ctx.beginPath(); ctx.ellipse(bx - 36, by - 340, 22, 26, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(bx + 36, by - 340, 22, 26, 0, 0, TAU); ctx.fill(); ctx.fillStyle = B2; ctx.beginPath(); ctx.roundRect(bx - 50, by - 260, 100, 50, 12); ctx.fill();
  if (o.glow) { const a = .5 + .4 * Math.sin(s * 4); ctx.strokeStyle = 'rgba(255,210,63,' + a + ')'; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.strokeRect(bx - 230, by - 470, 460, 1080); ctx.setLineDash([]); }
}
function throat(u, s, o) {                                                     // sagittal throat: epiglottis closes the airway while food passes into the oesophagus
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#1a0c10'); g.addColorStop(1, '#2a1218'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  let c = ((s + (o.off || 0)) % 2.6) / 2.6, cl = c > .25 && c < .7 ? 1 : c > .15 && c <= .25 ? (c - .15) / .1 : c >= .7 && c < .8 ? 1 - (c - .7) / .1 : 0; if (o.mode === 'breath') { cl = 0; c = 0; } if (o.mode === 'closed') { cl = 1; c = .2 + .5 * ((s * .45) % 1); }
  tube([[300, 200], [380, 700], [450, 900]], 230, '#b8646a'); tube([[300, 200], [380, 700], [450, 900]], 180, '#e09a9e');
  tube([[420, 950], [400, 1300], [400, 1900]], 150, '#c9a2a0'); for (let y = 1000; y < 1900; y += 60) tube([[340, y], [460, y]], 18, '#efe4d8');
  tube([[560, 950], [640, 1300], [660, 1900]], 150, '#b8646a'); tube([[560, 950], [640, 1300], [660, 1900]], 70, '#d9897e');
  ctx.save(); ctx.translate(470, 880); ctx.rotate(-.9 + cl * 1.55); ctx.fillStyle = '#e8a0a6'; ctx.beginPath(); ctx.ellipse(0, -60, 34, 110, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#d98a8f'; ctx.beginPath(); ctx.ellipse(230, 620, 200, 120, -.6, 0, TAU); ctx.fill();
  const bp = c < .15 ? 0 : clamp((c - .15) / .6), bxy = bp < .5 ? [lerp(330, 470, bp * 2), lerp(400, 900, bp * 2)] : [lerp(470, 640, (bp - .5) * 2), lerp(900, 1500, (bp - .5) * 2)]; if (o.mode !== 'breath') { ctx.fillStyle = o.liquid ? 'rgba(170,215,240,.85)' : '#8a6a3a'; ctx.beginPath(); ctx.ellipse(bxy[0], bxy[1], 70, o.liquid ? 80 : 55, 0, 0, TAU); ctx.fill(); }
  if (cl < .1) for (let k = 0; k < 6; k++) { const ph = (s * .9 + k / 4) % 1; ctx.fillStyle = 'rgba(210,235,250,' + (1 - ph) * .8 + ')'; ctx.beginPath(); ctx.arc(lerp(330, 400, ph), lerp(500, 1500, ph), 14, 0, TAU); ctx.fill(); }
  ctx.textAlign = 'left'; txt('AIRWAY', 120, 1260, 44, '#cfe6f4', 'rgba(0,0,0,.9)', 9); txt('FOOD PIPE', 720, 1260, 44, '#f2b8a0', 'rgba(0,0,0,.9)', 9); txt('EPIGLOTTIS', 560, 820, 40, '#ffe9a8', 'rgba(0,0,0,.9)', 9); if (cl > .9 && o.lock) { ctx.textAlign = 'center'; txt('🔒 LOCKED', 400, 1080, 50, '#ffd23f', 'rgba(0,0,0,.9)', 10, '400', 'Anton'); }
}
function breathGraph(u, s) {                                                   // breathing trace with a short pause (swallow apnea)
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#0d1624'); g.addColorStop(1, '#16202e'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const x0 = 80, x1 = 1000, y = 980, prog = clamp(u * 1.15), p = []; const pause = [.48, .62];
  for (let t = 0; t <= prog; t += .003) { const env = 1 - clamp(1 - Math.abs(t - (pause[0] + pause[1]) / 2) / .09) ** .5; p.push([lerp(x0, x1, t), y - Math.sin(t * 28) * 170 * env]); } tube(p, 9, '#a8c4f0'); const q = p[p.length - 1]; if (q) glowAt(q[0], q[1], 60, 1);
  if (prog > pause[0]) { ctx.fillStyle = 'rgba(255,210,63,.15)'; ctx.fillRect(lerp(x0, x1, pause[0]), y - 260, lerp(x0, x1, pause[1]) - lerp(x0, x1, pause[0]), 520); ctx.textAlign = 'center'; txt('SWALLOW', lerp(x0, x1, (pause[0] + pause[1]) / 2), y - 290, 46, '#ffd23f', 'rgba(0,0,0,.9)', 10, '400', 'Anton'); txt('NO BREATH', lerp(x0, x1, (pause[0] + pause[1]) / 2), y + 330, 38, '#fff', 'rgba(0,0,0,.9)', 8); }
  ctx.textAlign = 'left'; txt('BREATHING', 80, 600, 48, '#a8c4f0', 'rgba(0,0,0,.85)', 10);
}
function iceWater(u, s) {                                                      // a basin of ice water, cubes and bubbles
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#9fd0e4'); g.addColorStop(.5, '#3a8aa8'); g.addColorStop(1, '#0f3a4c'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  for (let i = 0; i < 16; i++) { const p = []; for (let x = -600; x <= 1700; x += 50) p.push([x, i * 140 - 100 + Math.sin(x * .008 + s * 1.4 + i) * 30]); tube(p, 8, 'rgba(255,255,255,.08)'); }
  const R = RN(5); for (let i = 0; i < 9; i++) { const x = 100 + R() * 880, y = 300 + R() * 1300 + Math.sin(s * 1.2 + i) * 20, sz = 120 + R() * 80, r = R() * .8 + Math.sin(s * .7 + i) * .1; ctx.save(); ctx.translate(x, y); ctx.rotate(r); const cg = ctx.createLinearGradient(-sz / 2, -sz / 2, sz / 2, sz / 2); cg.addColorStop(0, 'rgba(255,255,255,.85)'); cg.addColorStop(.5, 'rgba(210,235,245,.55)'); cg.addColorStop(1, 'rgba(160,210,230,.7)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(-sz / 2, -sz / 2, sz, sz, 18); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-sz / 2 + 14, -sz / 2 + 14, sz * .4, 10); ctx.restore(); }
  for (let i = 0; i < 40; i++) { const x = R() * 1300 - 100, y = ((R() * 2200 - s * (80 + R() * 100)) % 2200 + 2200) % 2200 - 100, r = 4 + R() * 10; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); }
  ctx.textAlign = 'center'; txt('10 SECONDS', 540, 1120, 90, '#fff', 'rgba(0,40,60,.9)', 14, '400', 'Anton');
}
function fingerPull(u, s, o) {                                                 // finger side view: middle segment pulled, joint gap, POP!
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a1a18'); g.addColorStop(1, '#140c0c'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const pull = o.pull ? o.pull(u, s) : 0, popT = o.popAt !== undefined ? s - o.popAt : -1, cy = 960;
  const seg = (x0, x1, col) => { const gg = ctx.createLinearGradient(0, cy - 150, 0, cy + 150); gg.addColorStop(0, '#e2aa8c'); gg.addColorStop(.5, '#d79a7b'); gg.addColorStop(1, '#b77658'); ctx.fillStyle = gg; ctx.beginPath(); ctx.roundRect(x0, cy - 140, x1 - x0, 280, 130); ctx.fill(); };
  seg(-400, 600, 0); seg(440 + pull * 30, 1500, 0); ctx.fillStyle = '#d29576'; ctx.fillRect(470, 960 - 120, 100 + pull * 30, 240);
  ctx.strokeStyle = 'rgba(140,80,60,.5)'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(500 + i * 14, cy - 120); ctx.quadraticCurveTo(520 + i * 14, cy, 500 + i * 14, cy + 120); ctx.stroke(); }
  ctx.fillStyle = '#f0c4b8'; ctx.beginPath(); ctx.roundRect(1100 + pull * 30, cy - 150, 330, 70, 30); ctx.fill();
  if (pull > .1) { ctx.fillStyle = '#ffd23f'; for (const d of [-1, 1]) { const x = d < 0 ? 300 : 900 + pull * 30; ctx.beginPath(); ctx.moveTo(x + d * 80, cy - 260); ctx.lineTo(x, cy - 300); ctx.lineTo(x, cy - 220); ctx.closePath(); ctx.fill(); tube([[x, cy - 260], [x - d * 120, cy - 260]], 16, '#ffd23f'); } }
  if (popT >= 0 && popT < .8) { const k = popT / .8; ctx.save(); ctx.globalAlpha = 1 - k; ctx.textAlign = 'center'; ctx.translate(560, cy - 300); ctx.scale(1 + k * .4, 1 + k * .4); txt('POP!', 0, 0, 200, '#fff', '#8c0e18', 26, '400', 'Anton'); ctx.restore(); for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,240,210,' + (1 - k) * .8 + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(560, cy, 200 + i * 80 + k * 300, 0, TAU); ctx.stroke(); } }
}
function gauge(u, s) {                                                         // joint pressure drops
  darkBG(); const cx = 540, cy = 1050, r = 360, v = 1 - eio(clamp(u * 2)), a = Math.PI * (1 + .1) + v * Math.PI * .8;
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 40; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.strokeStyle = '#a8c4f0'; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 1.1, a); ctx.stroke();
  tube([[cx, cy], [cx + Math.cos(a) * (r - 60), cy + Math.sin(a) * (r - 60)]], 16, '#ffd23f'); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, TAU); ctx.fill();
  ctx.textAlign = 'center'; txt('JOINT PRESSURE', cx, cy + 140, 54, '#fff', 'rgba(0,0,0,.9)', 10); txt(v < .3 ? 'LOW!' : 'NORMAL', cx, cy - 120, 80, v < .3 ? '#ffd23f' : '#a8c4f0', 'rgba(0,0,0,.9)', 12, '400', 'Anton');
}
// ================= BRAIN TRICKS — long-form 16:9 scenes (world = 1920×1080, centre 960,540) =================
const CX = 960, CY = 540;
function bgDeep(s, hue) {                                                      // cinematic deep background with volumetric haze + bokeh
  const g = ctx.createRadialGradient(CX, CY - 60, 60, CX, CY, 1300); g.addColorStop(0, hue ? hue[0] : '#2a1424'); g.addColorStop(.55, hue ? hue[1] : '#140a14'); g.addColorStop(1, '#05030a');
  ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  const R = RN(77); for (let i = 0; i < 26; i++) { const x = R() * 2600 - 340 + Math.sin(s * .2 + i) * 40, y = R() * 1500 - 200 + Math.cos(s * .17 + i) * 30, r = 20 + R() * 70, a = .05 + R() * .08; const b = ctx.createRadialGradient(x, y, 0, x, y, r); b.addColorStop(0, `rgba(255,220,200,${a})`); b.addColorStop(1, 'rgba(255,220,200,0)'); ctx.fillStyle = b; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
}
function spark(x, y, r, a, col = '255,245,210') { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(.35, `rgba(${col},${a * .45})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function label(t, x, y, size = 40, col = '#fff', align = 'center') { ctx.textAlign = align; txt(t, x, y, size, col, 'rgba(0,0,0,.85)', Math.max(6, size / 5), '900'); }

function brain3d(u, s, o) {                                                    // big hero brain: rim light, region glows, travelling sparks
  bgDeep(s, o.hue); const sc = 1.25 + .02 * Math.sin(s * .8), bx = CX, by = CY + 30;
  const halo = ctx.createRadialGradient(bx, by, 200, bx, by, 760); halo.addColorStop(0, 'rgba(255,150,170,.22)'); halo.addColorStop(1, 'rgba(255,150,170,0)'); ctx.fillStyle = halo; ctx.fillRect(bx - 800, by - 800, 1600, 1600);
  brainAt(bx, by, sc, s, o.glows || [[-160, -100, 260, 0], [90, -20, 220, 1.7], [-40, 90, 200, 3.1]], o.seed || 3);
  ctx.save(); brainShape(bx, by, sc); ctx.clip(); const rim = ctx.createLinearGradient(bx - 500, by - 400, bx + 500, by + 300); rim.addColorStop(0, 'rgba(255,255,255,.22)'); rim.addColorStop(.4, 'rgba(255,255,255,0)'); rim.addColorStop(1, 'rgba(120,40,80,.35)'); ctx.fillStyle = rim; ctx.fillRect(bx - 700, by - 600, 1400, 1200); ctx.restore();
  const R = RN(9); for (let i = 0; i < 14; i++) { const a0 = R() * TAU, a1 = a0 + 1 + R() * 2, rr = 360 + R() * 220, ph = (s * (.25 + R() * .3) + R()) % 1, a = lerp(a0, a1, ph); spark(bx + Math.cos(a) * rr, by + Math.sin(a) * rr * .72, 34, .9); }
  if (o.mismatch) { const p = (s * .9) % 1; for (const [dx, col] of [[-1, '255,210,120'], [1, '150,200,255']]) { const x = bx + dx * 260, y = by + 120 + 30 * Math.sin(s * 3 + dx); spark(x, y, 150, .55 + .4 * Math.sin(s * 6 + (dx > 0 ? 1.3 : 0)), col); } }
  if (o.text) { label(o.text, CX, 140, 64, '#ffd23f'); }
}
function snakes(u, s, o) {                                                     // Kitaoka-style peripheral drift illusion (static pattern that seems to rotate)
  ctx.fillStyle = '#7a7a7a'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const cols = ['#0a0a0a', '#1f3fa8', '#ffffff', '#f2d22a'], rot = (o.spin || 0) * s;
  const disc = (x, y, R0) => { for (let ring = 0; ring < 5; ring++) { const r = R0 * (1 - ring * .18), n = 18 + ring * 2; for (let k = 0; k < n; k++) { const a = k / n * TAU + rot * (ring % 2 ? 1 : -1) + ring * .3; for (let q = 0; q < 4; q++) { const a0 = a + q * TAU / n / 4, a1 = a0 + TAU / n / 4; ctx.fillStyle = cols[q]; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.arc(x, y, r * .82, a1, a0, true); ctx.closePath(); ctx.fill(); } } } };
  for (let i = -1; i < 4; i++) for (let j = -1; j < 3; j++) disc(260 + i * 480 + (j % 2) * 240, 160 + j * 420, 230);
}
function checker(u, s, o) {                                                    // Adelson checker-shadow illusion: A and B are the same grey
  ctx.fillStyle = '#5d6a5e'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const ox = CX - 30, oy = 240, a = 150, sq = (i, j) => [[ox + (i - j) * a * .9, oy + (i + j) * a * .52], [ox + (i + 1 - j) * a * .9, oy + (i + 1 + j) * a * .52], [ox + (i - j) * a * .9, oy + (i + 2 + j) * a * .52], [ox + (i - j - 1) * a * .9, oy + (i + 1 + j) * a * .52]];
  const shade = (i, j) => { const dx = i - 3.3, dy = j - 2.8, sh = Math.exp(-(dx * dx + dy * dy) / 2.6) * .5; return sh; };
  const A = [0, 3], B = [3, 3]; const same = 112;
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { const light = (i + j) % 2 === 0, base = light ? 205 : 118, sh = shade(i, j); let v = Math.round(base * (1 - sh));
    if (i === A[0] && j === A[1]) v = same; if (i === B[0] && j === B[1]) v = same;
    const p = sq(i, j); ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.beginPath(); p.forEach((q, k) => k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); }
  const mbq = sq(3, 3), bc = [(mbq[0][0] + mbq[2][0]) / 2, (mbq[0][1] + mbq[2][1]) / 2], cyl = [bc[0] + 250, bc[1] - 40];
  const cg = ctx.createLinearGradient(cyl[0] - 110, 0, cyl[0] + 110, 0); cg.addColorStop(0, '#2e7a3a'); cg.addColorStop(.6, '#5cc06a'); cg.addColorStop(1, '#1f5a2a'); ctx.fillStyle = cg; ctx.fillRect(cyl[0] - 110, cyl[1] - 300, 220, 300); ctx.beginPath(); ctx.ellipse(cyl[0], cyl[1], 110, 42, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#7ad888'; ctx.beginPath(); ctx.ellipse(cyl[0], cyl[1] - 300, 110, 42, 0, 0, TAU); ctx.fill();
  const ca = sq(...A), cb = sq(...B), mid = q => [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2]; const ma = mid(ca), mb = mid(cb);
  label('A', ma[0], ma[1] + 16, 52, '#fff'); label('B', mb[0], mb[1] + 16, 52, '#fff');
  if (o.reveal) { const k = clamp(u * 2.2 - .2); ctx.fillStyle = `rgba(${same},${same},${same},${k})`; ctx.fillRect(ma[0] - 24, ma[1] + 30, 48, (mb[1] - ma[1]) - 60); ctx.fillRect(ma[0] - 24, mb[1] - 40, mb[0] - ma[0] + 24, 48); if (k > .9) label('SAME COLOUR!', CX + 520, 200, 70, '#ffd23f'); }
}
function mullerLyer(u, s, o) {
  bgDeep(s, ['#1d2a3a', '#0e1520']); const y1 = 380, y2 = 700, L = 620, x0 = CX - L / 2;
  const line = (y, out) => { tube([[x0, y], [x0 + L, y]], 16, '#f2f2f2'); for (const [x, d] of [[x0, -1], [x0 + L, 1]]) { const f = out ? d : -d; tube([[x, y], [x + f * 110, y - 90]], 14, '#f2f2f2'); tube([[x, y], [x + f * 110, y + 90]], 14, '#f2f2f2'); } };
  line(y1, false); line(y2, true);
  const k = clamp(u * 2 - .6); if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.setLineDash([16, 12]); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; for (const x of [x0, x0 + L]) { ctx.beginPath(); ctx.moveTo(x, y1 - 140); ctx.lineTo(x, y2 + 140); ctx.stroke(); } ctx.setLineDash([]); label('EXACTLY THE SAME LENGTH', CX, 170, 60, '#ffd23f'); ctx.restore(); } else label('WHICH LINE IS LONGER?', CX, 170, 60, '#fff');
}
function room(u, s, o) {                                                       // warm room; déjà-vu echoes (ghost copies that lag behind)
  const draw = (off, a) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(off, 0);
    const w = ctx.createLinearGradient(0, 0, 0, 760); w.addColorStop(0, '#5a4636'); w.addColorStop(1, '#3a2a20'); ctx.fillStyle = w; ctx.fillRect(-2400, -2400, 6800, 3160); ctx.fillStyle = '#2a1c14'; ctx.fillRect(-2400, 760, 6800, 2000);
    ctx.fillStyle = '#9fc4d8'; ctx.fillRect(1180, 150, 420, 380); const sun = ctx.createLinearGradient(1180, 150, 1600, 530); sun.addColorStop(0, 'rgba(255,240,200,.9)'); sun.addColorStop(1, 'rgba(160,200,230,.6)'); ctx.fillStyle = sun; ctx.fillRect(1180, 150, 420, 380); ctx.fillStyle = '#3a2a20'; ctx.fillRect(1380, 150, 20, 380); ctx.fillRect(1180, 330, 420, 20);
    ctx.fillStyle = 'rgba(255,230,170,.12)'; ctx.beginPath(); ctx.moveTo(1180, 530); ctx.lineTo(1600, 530); ctx.lineTo(1300, 1080); ctx.lineTo(700, 1080); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6a4030'; ctx.fillRect(300, 560, 420, 40); ctx.fillRect(320, 600, 30, 220); ctx.fillRect(670, 600, 30, 220); ctx.fillStyle = '#8a5a3a'; ctx.beginPath(); ctx.roundRect(330, 420, 380, 150, 30); ctx.fill();
    ctx.fillStyle = '#c9a060'; ctx.beginPath(); ctx.moveTo(840, 520); ctx.lineTo(920, 360); ctx.lineTo(1000, 520); ctx.closePath(); ctx.fill(); ctx.fillRect(912, 520, 16, 260); spark(920, 450, 220, .5, '255,210,140');
    ctx.fillStyle = '#2e5a32'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(1700 + Math.cos(i) * 40, 640 - i * 30, 26, 70, i - 3, 0, TAU); ctx.fill(); } ctx.fillStyle = '#8a5a3a'; ctx.fillRect(1650, 700, 110, 110);
    ctx.restore(); };
  draw(0, 1); if (o.echo) { const k = .5 + .5 * Math.sin(s * 2.2); draw(26 + 14 * k, .22); draw(-30 - 10 * k, .16); ctx.fillStyle = `rgba(180,140,255,${.08 + .06 * k})`; ctx.fillRect(-2400, -2400, 6800, 6000); }
  if (o.text) label(o.text, CX, 160, 70, '#ffd23f');
}
function waves(u, s, o) {                                                      // two brain signals drifting out of sync
  bgDeep(s, ['#14202e', '#0a1018']); const prog = clamp(u * 1.2);
  const tr = (y, col, lab, shift) => { const p = []; for (let x = 140; x <= 140 + 1640 * prog; x += 6) { const t = (x - 140) / 200 + s * 1.5; p.push([x, y - Math.sin(t * 2 + shift) * 70 - Math.exp(-Math.pow(((x - 140) / 1640 - .6) * 12, 2)) * 110]); } tube(p, 8, col); const q = p[p.length - 1]; if (q) spark(q[0], q[1], 60, 1); ctx.textAlign = 'left'; txt(lab, 140, y - 150, 44, col, 'rgba(0,0,0,.9)', 8, '900'); };
  tr(380, '#ffd27a', 'FAMILIARITY', 0); tr(780, '#8ec5ff', 'MEMORY', o.sync ? 0 : 1.6);
  if (!o.sync && prog > .5) { ctx.fillStyle = 'rgba(255,80,80,.14)'; ctx.fillRect(1000, 220, 260, 680); label('MISMATCH', 1130, 200, 46, '#ff6a6a'); }
}
function pocket(u, s, o) {                                                     // jeans pocket with phone; real or phantom buzz
  const g = ctx.createLinearGradient(0, 0, 1920, 1080); g.addColorStop(0, '#2c4a78'); g.addColorStop(1, '#1a2c4c'); ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 3; for (let i = -60; i < 120; i++) { ctx.beginPath(); ctx.moveTo(i * 30, -300); ctx.lineTo(i * 30 + 900, 1400); ctx.stroke(); }
  const buzz = o.buzz ? (Math.sin(s * 60) * 6) * (((s % 1.4) < .5) ? 1 : 0) : 0;
  ctx.save(); ctx.translate(CX + buzz, CY); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.roundRect(-190, -330, 380, 660, 50); ctx.fill(); ctx.fillStyle = '#16181c'; ctx.beginPath(); ctx.roundRect(-170, -320, 340, 640, 44); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#2f528a'; ctx.beginPath(); ctx.moveTo(500, 260); ctx.quadraticCurveTo(CX, 420, 1420, 260); ctx.lineTo(1500, 1200); ctx.lineTo(420, 1200); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#d9a24a'; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(520, 300); ctx.quadraticCurveTo(CX, 455, 1400, 300); ctx.stroke(); ctx.setLineDash([]);
  if (o.buzz && (s % 1.4) < .55) for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(255,240,200,${.7 - i * .2})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(CX, CY, 360 + i * 70 + (s % 1.4) * 200, -2.6, -.5); ctx.stroke(); }
  if (o.text) label(o.text, CX, 150, 72, o.phantom ? '#ff8a8a' : '#ffd23f');
}
function phoneScreen(u, s, o) {
  bgDeep(s, ['#1a2430', '#0a1018']); const x = CX - 230, y = 90;
  ctx.fillStyle = '#0c0d10'; ctx.beginPath(); ctx.roundRect(x - 20, y - 20, 500, 940, 70); ctx.fill(); const sg = ctx.createLinearGradient(0, y, 0, y + 900); sg.addColorStop(0, '#24324a'); sg.addColorStop(1, '#0f1626'); ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(x, y, 460, 900, 56); ctx.fill();
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = '400 150px Anton'; ctx.fillText('9:41', CX, y + 260);
  const k = eo(clamp(u * 3)); ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.beginPath(); ctx.roundRect(x + 30, y + 420, 400, 120, 28); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '800 36px Montserrat'; ctx.fillText(o.msg || 'No new notifications', CX, y + 492); ctx.restore();
  if (o.cross) { const a = clamp(u * 3 - 1); ctx.save(); ctx.globalAlpha = a; tube([[x + 40, y + 380], [x + 420, y + 580]], 18, '#ff5a5a'); tube([[x + 420, y + 380], [x + 40, y + 580]], 18, '#ff5a5a'); ctx.restore(); }
}
function skinTouch(u, s, o) {                                                  // skin section: fabric brushing the surface, touch receptors firing
  bgDeep(s, ['#2a1a1c', '#120a0c']); const top = 420;
  const g = ctx.createLinearGradient(0, top, 0, 1200); g.addColorStop(0, '#e2b39a'); g.addColorStop(.18, '#e9b8a6'); g.addColorStop(.2, '#d48f92'); g.addColorStop(1, '#9a4e5c'); ctx.fillStyle = g; ctx.fillRect(-2400, top, 6800, 2000);
  ctx.fillStyle = '#d8a88a'; for (let x = -200; x < 2200; x += 90) { ctx.beginPath(); ctx.arc(x, top + 120, 46, 0, Math.PI); ctx.fill(); }
  const R = RN(3); for (let i = 0; i < 22; i++) tube(wavy(R() * 2400 - 200, top + 300 + R() * 500, R() * .4 - .2, 500, 14, 5), 7, 'rgba(244,226,190,.45)');
  for (let i = 0; i < 7; i++) { const x = 160 + i * 260, p = [[x, 1200], [x + 30, top + 500], [x - 10, top + 220], [x + 20, top + 110]]; tube(p, 14, '#efd9a2'); ctx.fillStyle = '#f3e2b4'; ctx.beginPath(); ctx.ellipse(x + 20, top + 150, 26, 44, 0, 0, TAU); ctx.fill();
    const ph = (s * .9 + i * .23) % 1; if (o.fire) { const q = [lerp(x + 20, x, ph), lerp(top + 120, 1200, ph)]; spark(q[0], q[1], 70, 1 - ph * .4); } }
  for (let i = 0; i < 9; i++) { const y = top - 30 - i * 16, p = []; for (let x = -200; x <= 2200; x += 30) p.push([x + (s * 120) % 60, y + Math.sin(x * .01 + s * 2 + i) * 10]); tube(p, 10, i % 2 ? '#3a5a8a' : '#2c4a78'); }
  if (o.text) label(o.text, CX, 140, 64, '#ffd23f');
}
function clockWarp(u, s, o) {                                                  // stretching clock: time felt fast or slow
  bgDeep(s, ['#2a2014', '#120c06']); const sp = o.slow ? .15 : 3.2, sx = 1 + (o.slow ? .25 * Math.sin(s * 1.2) : 0);
  ctx.save(); ctx.translate(CX, CY); ctx.scale(sx, 1 / sx); ctx.rotate(o.slow ? .05 * Math.sin(s) : 0);
  const fg = ctx.createRadialGradient(-60, -60, 20, 0, 0, 400); fg.addColorStop(0, '#fff6e2'); fg.addColorStop(1, '#d8c49a'); ctx.fillStyle = '#6a4a20'; ctx.beginPath(); ctx.arc(0, 0, 400, 0, TAU); ctx.fill(); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, 0, 370, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2a1a10'; ctx.font = '400 64px Anton'; ctx.textAlign = 'center'; for (let i = 1; i <= 12; i++) { const a = i / 12 * TAU - Math.PI / 2; ctx.fillText(String(i), Math.cos(a) * 300, Math.sin(a) * 300 + 22); }
  const m = s * sp; tube([[0, 0], [Math.cos(m - Math.PI / 2) * 280, Math.sin(m - Math.PI / 2) * 280]], 14, '#1a120c'); tube([[0, 0], [Math.cos(m / 12 - Math.PI / 2) * 190, Math.sin(m / 12 - Math.PI / 2) * 190]], 20, '#1a120c'); tube([[0, 0], [Math.cos(m * 6 - Math.PI / 2) * 320, Math.sin(m * 6 - Math.PI / 2) * 320]], 6, '#c41c26');
  ctx.fillStyle = '#c41c26'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.restore();
  if (!o.slow) for (let i = 0; i < 6; i++) { ctx.strokeStyle = `rgba(255,230,180,${.25 - i * .03})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(CX, CY, 440 + i * 30, s * 3 + i, s * 3 + i + 1.2); ctx.stroke(); }
  if (o.text) label(o.text, CX, 100, 66, '#ffd23f');
}
function shards(u, s, o) {                                                     // frightening moment in slow motion: shards frozen in the air, every detail sharp
  bgDeep(s, ['#1a2a3a', '#0a121a']); const R = RN(11);
  for (let i = 0; i < 70; i++) { const a = R() * TAU, d = 60 + R() * 900, v = .04 * (o.fast ? 6 : 1), x = CX + Math.cos(a) * d * (1 + s * v), y = CY + Math.sin(a) * d * .7 * (1 + s * v), r = 18 + R() * 50, rot = R() * TAU + s * .2;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const g = ctx.createLinearGradient(-r, -r, r, r); g.addColorStop(0, 'rgba(220,240,255,.85)'); g.addColorStop(1, 'rgba(120,170,210,.35)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-r, -r * .3); ctx.lineTo(r * .7, -r); ctx.lineTo(r, r * .6); ctx.lineTo(-r * .4, r); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
  if (o.focus) { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + s * .2; ctx.strokeStyle = 'rgba(255,210,63,.8)'; ctx.lineWidth = 4; ctx.strokeRect(CX + Math.cos(a) * 420 - 60, CY + Math.sin(a) * 280 - 60, 120, 120); } }
  if (o.text) label(o.text, CX, 140, 64, '#ffd23f');
}
function polaroid(x, y, w, rot, scene, a = 1, glitch = 0) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-w / 2 + 14, -w * .6 + 18, w, w * 1.2); ctx.fillStyle = '#f4efe6'; ctx.fillRect(-w / 2, -w * .6, w, w * 1.2);
  const iw = w * .86, ix = -iw / 2, iy = -w * .6 + w * .07; ctx.save(); ctx.beginPath(); ctx.rect(ix, iy, iw, iw); ctx.clip();
  const sky = ctx.createLinearGradient(0, iy, 0, iy + iw); sky.addColorStop(0, scene.sky); sky.addColorStop(1, '#f6e2c0'); ctx.fillStyle = sky; ctx.fillRect(ix, iy, iw, iw); ctx.fillStyle = scene.ground; ctx.fillRect(ix, iy + iw * .65, iw, iw * .35);
  ctx.fillStyle = scene.obj; ctx.beginPath(); scene.kind === 'car' ? ctx.roundRect(ix + iw * .2, iy + iw * .5, iw * .6, iw * .18, 12) : ctx.arc(ix + iw * .5, iy + iw * .45, iw * .16, 0, TAU); ctx.fill(); if (scene.kind === 'car') { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(ix + iw * .32, iy + iw * .69, iw * .06, 0, TAU); ctx.arc(ix + iw * .68, iy + iw * .69, iw * .06, 0, TAU); ctx.fill(); }
  if (glitch > 0) { for (let k = 0; k < 6; k++) { const yy = iy + ((k * 97 + glitch * 300) % iw); ctx.fillStyle = `rgba(${k % 2 ? 255 : 80},${k % 2 ? 80 : 200},255,.35)`; ctx.fillRect(ix + Math.sin(k + glitch * 20) * 30, yy, iw, 10 + k * 3); } }
  ctx.restore(); ctx.restore();
}
const SCN = [{ sky: '#8ec5e8', ground: '#7aa860', obj: '#c43a3a', kind: 'car' }, { sky: '#f0b080', ground: '#c8a060', obj: '#ffd23f', kind: 'sun' }, { sky: '#9ab8d8', ground: '#5a8a5a', obj: '#3a6ac8', kind: 'car' }, { sky: '#d8c8f0', ground: '#8a7a9a', obj: '#ffffff', kind: 'sun' }];
function memories(u, s, o) {                                                   // floating memory photos in depth; reconstruction swaps details
  bgDeep(s, ['#221a30', '#0e0a16']); const R = RN(21), items = [];
  for (let i = 0; i < 16; i++) items.push({ x: R() * 2200 - 140, y: R() * 1100 - 20, z: .4 + R() * .9, r: (R() - .5) * .5, k: Math.floor(R() * 4) });
  items.sort((a, b) => a.z - b.z); for (const it of items) { const x = it.x + Math.sin(s * .3 + it.r * 9) * 40 * it.z, y = it.y + Math.cos(s * .25 + it.x) * 20 * it.z; const sw = o.swap && ((s * .7 + it.x * .001) % 2) > 1.6 ? (it.k + 1) % 4 : it.k; polaroid(x, y, 300 * it.z, it.r + Math.sin(s * .4 + it.z) * .05, SCN[sw], .35 + it.z * .5, o.swap ? (s % 1.7 < .2 ? s : 0) : 0); }
  if (o.text) label(o.text, CX, 130, 66, '#ffd23f');
}
function headSil(x, y, sc, col) { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, -120, 120, 150, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.lineTo(80, 60); ctx.quadraticCurveTo(220, 90, 260, 260); ctx.lineTo(-260, 260); ctx.quadraticCurveTo(-220, 90, -80, 60); ctx.closePath(); ctx.fill(); ctx.restore(); }
function twoMinds(u, s, o) {                                                   // two people, same event, different memories
  bgDeep(s, ['#1e2232', '#0c0e16']); headSil(520, 820, 1.2, '#0a0a10'); headSil(1400, 820, 1.2, '#0a0a10');
  for (const [x, k, d] of [[520, 0, -1], [1400, 2, 1]]) { for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(x + d * (60 + i * 40), 520 - i * 50, 10 + i * 6, 0, TAU); ctx.fill(); } polaroid(x + d * 160, 260, 330, d * .06 + Math.sin(s + x) * .03, SCN[k]); }
  label('SAME EVENT,', CX, 110, 56, '#fff'); label('DIFFERENT MEMORIES', CX, 185, 56, '#ffd23f');
}
function pill(u, s, o) {                                                       // a 3D capsule spinning: the placebo
  bgDeep(s, ['#203040', '#0a1018']); ctx.save(); ctx.translate(CX, CY - 30); ctx.rotate(-.5 + Math.sin(s * .8) * .25); const sq = .55 + .45 * Math.abs(Math.cos(s * 1.4));
  ctx.scale(1, sq); const L = 520, R0 = 130; for (const [x0, c1, c2] of [[-L / 2, '#f4f6f8', '#b8c0c8'], [0, '#4a8ae0', '#1a4a90']]) { const g = ctx.createLinearGradient(0, -R0, 0, R0); g.addColorStop(0, c1); g.addColorStop(.5, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0, -R0, L / 2, R0 * 2, x0 < 0 ? [R0, 0, 0, R0] : [0, R0, R0, 0]); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.roundRect(-L / 2 + 40, -R0 + 26, L - 80, 30, 15); ctx.fill(); ctx.restore();
  spark(CX + 200, CY - 120, 160, .35 + .2 * Math.sin(s * 3)); if (o.text) label(o.text, CX, 830, 80, '#ffd23f');
}
function synapse(u, s, o) {                                                    // nerve terminal releasing messenger molecules onto receptors
  bgDeep(s, ['#2a1622', '#100810']); const g = ctx.createRadialGradient(CX, 200, 40, CX, 200, 560); g.addColorStop(0, '#f2d6c8'); g.addColorStop(1, '#c8988a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(CX, 120, 620, 400, 0, 0, Math.PI); ctx.fill();
  const R = RN(5); for (let i = 0; i < 16; i++) { const x = CX - 460 + R() * 920, y = 180 + R() * 260; ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(x, y, 34, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,220,140,.9)'; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(x + Math.cos(k) * 14, y + Math.sin(k * 1.7) * 14, 5, 0, TAU); ctx.fill(); } }
  const pg = ctx.createLinearGradient(0, 760, 0, 1100); pg.addColorStop(0, '#e2b0b8'); pg.addColorStop(1, '#a8606e'); ctx.fillStyle = pg; ctx.fillRect(-2400, 760, 6800, 1000);
  for (let x = 200; x < 1800; x += 120) { ctx.fillStyle = '#7a5aa8'; ctx.beginPath(); ctx.roundRect(x - 22, 730, 44, 70, 12); ctx.fill(); ctx.fillStyle = '#1a1020'; ctx.fillRect(x - 6, 730, 12, 24); }
  for (let i = 0; i < 60; i++) { const ph = (s * .5 + R()) % 1, x0 = CX - 400 + R() * 800, tx = 200 + Math.round(R() * 13) * 120, x = lerp(x0, tx, eio(ph)), y = lerp(560, 740, eio(ph)); ctx.fillStyle = o.endo ? 'rgba(140,230,190,.95)' : 'rgba(255,220,140,.95)'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); if (ph > .9) spark(x, y + 20, 50, 1, o.endo ? '160,255,200' : '255,230,160'); }
  if (o.text) label(o.text, CX, 660, 56, o.endo ? '#9effd0' : '#ffd23f');
}
function arm(u, s, o) {                                                        // forearm being scratched (nails sweep), itch redness
  const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, '#2a2028'); g.addColorStop(1, '#141016'); ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  const ag = ctx.createLinearGradient(0, 330, 0, 760); ag.addColorStop(0, '#f0c4a6'); ag.addColorStop(.5, '#d99b7c'); ag.addColorStop(1, '#a86a50'); ctx.fillStyle = ag; ctx.beginPath(); ctx.moveTo(-200, 300); ctx.quadraticCurveTo(CX, 280, 2120, 360); ctx.lineTo(2120, 800); ctx.quadraticCurveTo(CX, 780, -200, 760); ctx.closePath(); ctx.fill();
  const R = RN(4); ctx.strokeStyle = 'rgba(90,60,40,.5)'; ctx.lineWidth = 2; for (let i = 0; i < 160; i++) { const x = R() * 2200 - 100, y = 340 + R() * 400; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 10, y - 8, x + 24, y - 4); ctx.stroke(); }
  const sx = CX + Math.sin(s * 9) * 120 * (o.scratch ? 1 : 0); if (o.scratch) { ctx.fillStyle = 'rgba(220,70,70,.28)'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.roundRect(CX - 170, 460 + k * 34, 340, 12, 6); ctx.fill(); } }
  if (o.bump) { ctx.fillStyle = 'rgba(210,80,80,.5)'; ctx.beginPath(); ctx.arc(1200, 560, 46 + 6 * Math.sin(s * 4), 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,200,200,.5)'; ctx.beginPath(); ctx.arc(1190, 548, 14, 0, TAU); ctx.fill(); }
  if (o.scratch) { ctx.save(); ctx.translate(sx, 360); const hg = ctx.createLinearGradient(0, -400, 0, 120); hg.addColorStop(0, '#b77a5c'); hg.addColorStop(1, '#e2ac8e'); ctx.fillStyle = hg; ctx.beginPath(); ctx.roundRect(-150, -520, 300, 460, 120); ctx.fill(); for (let f = 0; f < 4; f++) { ctx.fillStyle = '#e2ac8e'; ctx.beginPath(); ctx.roundRect(-140 + f * 72, -120, 60, 200, 30); ctx.fill(); ctx.fillStyle = '#f6dcd0'; ctx.beginPath(); ctx.roundRect(-132 + f * 72, 40, 44, 34, 14); ctx.fill(); } ctx.restore(); }
  if (o.mosquito) { const x = 1180 + Math.sin(s * 3) * 30, y = 420 + Math.cos(s * 4) * 20; ctx.strokeStyle = '#222'; ctx.lineWidth = 4; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 60 + k * 24, y + 70); ctx.stroke(); } ctx.fillStyle = '#2a2a2a'; ctx.beginPath(); ctx.ellipse(x, y, 60, 18, -.3, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(200,220,240,.5)'; ctx.beginPath(); ctx.ellipse(x - 10, y - 40, 50, 18, -1, 0, TAU); ctx.fill(); const a = clamp(u * 3 - 1); tube([[x - 150, y - 120], [x + 150, y + 120]], 24 * a, 'rgba(255,70,70,.95)'); tube([[x + 150, y - 120], [x - 150, y + 120]], 24 * a, 'rgba(255,70,70,.95)'); }
  if (o.text) label(o.text, CX, 170, 62, '#ffd23f');
}
function ear(u, s, o) {                                                        // outer ear + sound waves + glowing cochlea
  bgDeep(s, ['#2a1a20', '#100a0c']); const ex = 1240, ey = 540;
  for (let i = 0; i < 6; i++) { const ph = (s * .6 + i / 6) % 1; ctx.strokeStyle = `rgba(255,230,190,${.6 * (1 - ph)})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(ex - 200, ey, 120 + ph * 900, Math.PI * .75, Math.PI * 1.25); ctx.stroke(); }
  const g = ctx.createRadialGradient(ex - 40, ey - 80, 30, ex, ey, 360); g.addColorStop(0, '#f0c2a2'); g.addColorStop(1, '#b77656'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ex, ey - 320); ctx.bezierCurveTo(ex + 260, ey - 340, ex + 280, ey - 40, ex + 180, ey + 120); ctx.bezierCurveTo(ex + 120, ey + 220, ex + 140, ey + 330, ex + 40, ey + 330); ctx.bezierCurveTo(ex - 60, ey + 330, ex - 90, ey + 200, ex - 60, ey + 100); ctx.bezierCurveTo(ex - 130, ey - 60, ex - 110, ey - 300, ex, ey - 320); ctx.fill();
  ctx.strokeStyle = 'rgba(140,70,50,.6)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(ex - 10, ey - 230); ctx.bezierCurveTo(ex + 170, ey - 250, ex + 190, ey - 30, ex + 90, ey + 80); ctx.stroke(); ctx.fillStyle = '#3a1a14'; ctx.beginPath(); ctx.ellipse(ex + 20, ey + 20, 40, 56, 0, 0, TAU); ctx.fill();
  if (o.cochlea) { ctx.save(); ctx.translate(560, 540); ctx.strokeStyle = '#efd0b8'; ctx.lineWidth = 34; ctx.beginPath(); for (let t = 0; t < 14; t += .05) { const r = 230 * Math.exp(-t * .17); const x = Math.cos(t) * r, y = Math.sin(t) * r; t ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); const t = (s * 3) % 14, r = 230 * Math.exp(-t * .17); spark(Math.cos(t) * r, Math.sin(t) * r, 90, 1); ctx.restore(); label('COCHLEA', 560, 860, 44, '#efd0b8'); }
  if (o.text) label(o.text, 560, 220, 64, '#ffd23f');
}
function fan(u, s, o) {                                                        // whirring fan; noise → brain hears a voice
  bgDeep(s, ['#1a2430', '#0a1018']); const fx = 560, fy = 520;
  ctx.strokeStyle = '#9aa4ae'; ctx.lineWidth = 6; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(fx, fy, 300, i / 12 * TAU, i / 12 * TAU + .4); ctx.stroke(); } ctx.beginPath(); ctx.arc(fx, fy, 320, 0, TAU); ctx.stroke();
  ctx.save(); ctx.translate(fx, fy); ctx.rotate(s * 14); for (let b = 0; b < 3; b++) { ctx.rotate(TAU / 3); ctx.fillStyle = 'rgba(200,215,225,.55)'; ctx.beginPath(); ctx.ellipse(130, 0, 140, 60, .3, 0, TAU); ctx.fill(); } ctx.restore(); ctx.fillStyle = '#c8d0d8'; ctx.beginPath(); ctx.arc(fx, fy, 50, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a6068'; ctx.fillRect(fx - 20, fy + 320, 40, 260);
  const R = RN(3); for (let i = 0; i < 90; i++) { const ph = (s * .5 + R()) % 1, x = lerp(fx + 330, 1500, ph), y = fy + (R() - .5) * 500 * (1 - ph * .7); ctx.fillStyle = `rgba(255,240,210,${.6 * (1 - ph)})`; ctx.fillRect(x, y, 6, 6); }
  const p = []; for (let x = 1300; x < 1800; x += 6) p.push([x, fy + Math.sin(x * .07 + s * 9) * 60 * Math.exp(-Math.pow((x - 1550) / 160, 2))]); tube(p, 6, '#ffd27a');
  if (o.voice) { const a = clamp(u * 3 - .5); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(1350, 240, 420, 140, 50); ctx.fill(); ctx.beginPath(); ctx.moveTo(1460, 370); ctx.lineTo(1420, 430); ctx.lineTo(1500, 375); ctx.fill(); ctx.fillStyle = '#111'; ctx.font = '400 72px Anton'; ctx.textAlign = 'center'; ctx.fillText(o.voice, 1560, 335); ctx.restore(); }
}
function court(u, s, o) {                                                      // count the passes… and miss the gorilla
  const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, '#3a3a3e'); g.addColorStop(1, '#202024'); ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  const fl = ctx.createLinearGradient(0, 560, 0, 1080); fl.addColorStop(0, '#b88a54'); fl.addColorStop(1, '#8a6034'); ctx.fillStyle = fl; ctx.fillRect(-2400, 600, 6800, 2000); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(CX, 860, 520, 120, 0, 0, TAU); ctx.stroke();
  const P = [[520, 'w'], [820, 'b'], [1100, 'w'], [1380, 'b'], [680, 'b'], [1240, 'w']];
  const person = (x, y, col, sc, ph) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); const leg = Math.sin(ph) * 18; ctx.fillStyle = '#222'; ctx.fillRect(-26 + leg * .5, 60, 20, 140); ctx.fillRect(6 - leg * .5, 60, 20, 140); ctx.fillStyle = col === 'w' ? '#f2f2f2' : '#121212'; ctx.beginPath(); ctx.roundRect(-46, -80, 92, 150, 20); ctx.fill(); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.arc(0, -120, 38, 0, TAU); ctx.fill(); ctx.restore(); };
  P.forEach(([x, c], i) => person(x + Math.sin(s * 1.3 + i * 2) * 50, 640 + (i % 2) * 70, c, 1.2, s * 6 + i));
  const pi = Math.floor(s / .8) % 3, pf = (s % .8) / .8, wi = [0, 2, 5][pi], wj = [0, 2, 5][(pi + 1) % 3]; const ax = P[wi][0] + Math.sin(s * 1.3 + wi * 2) * 50, bx2 = P[wj][0] + Math.sin(s * 1.3 + wj * 2) * 50; const bxp = lerp(ax, bx2, pf), byp = 560 - Math.sin(pf * Math.PI) * 120;
  ctx.fillStyle = '#e07a2a'; ctx.beginPath(); ctx.arc(bxp, byp, 30, 0, TAU); ctx.fill();
  if (o.gorilla) { const gx = lerp(-200, 2100, clamp(u * 1.05)), gy = 700; ctx.save(); ctx.translate(gx, gy); ctx.fillStyle = '#1a1614'; ctx.beginPath(); ctx.ellipse(0, -40, 110, 150, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, -210, 64, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a4a40'; ctx.beginPath(); ctx.ellipse(0, -196, 36, 28, 0, 0, TAU); ctx.fill(); for (const d of [-1, 1]) { ctx.fillStyle = '#1a1614'; ctx.beginPath(); ctx.roundRect(d * 90 - 28, -120, 56, 230 + Math.sin(s * 6 + d) * 20, 26); ctx.fill(); ctx.beginPath(); ctx.roundRect(d * 40 - 30, 80, 60, 140, 26); ctx.fill(); } ctx.restore(); }
  if (o.focus) { const v = ctx.createRadialGradient(bxp, byp, 60, bxp, byp, 520); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.78)'); ctx.fillStyle = v; ctx.fillRect(-2400, -2400, 6800, 6000); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(bxp, byp, 70, 0, TAU); ctx.stroke(); ctx.textAlign = 'right'; txt('PASSES: ' + (Math.floor(s / .8) + 3), 1840, 110, 64, '#ffd23f', 'rgba(0,0,0,.9)', 10, '400', 'Anton'); }
  if (o.text) label(o.text, CX, 140, 66, '#ffd23f');
}
function dream(u, s, o) {                                                      // bedroom at night with a dream drifting above the sleeper
  const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, '#141a34'); g.addColorStop(1, '#0a0c1a'); ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  ctx.fillStyle = '#c8d6f0'; ctx.beginPath(); ctx.arc(1600, 200, 80, 0, TAU); ctx.fill(); spark(1600, 200, 300, .3, '200,215,255');
  ctx.fillStyle = '#3a3050'; ctx.beginPath(); ctx.roundRect(300, 720, 1320, 220, 40); ctx.fill(); ctx.fillStyle = '#e8e2f0'; ctx.beginPath(); ctx.roundRect(340, 650, 300, 110, 50); ctx.fill(); ctx.fillStyle = '#5a6aa8'; ctx.beginPath(); ctx.moveTo(560, 760); ctx.bezierCurveTo(800, 640, 1300, 660, 1600, 740); ctx.lineTo(1600, 800); ctx.lineTo(560, 800); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.ellipse(500, 670, 80, 64, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1c14'; ctx.beginPath(); ctx.ellipse(470, 640, 80, 50, 0, Math.PI, TAU); ctx.fill();
  for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(600 + i * 60, 560 - i * 60, 14 + i * 8, 0, TAU); ctx.fill(); }
  const k = o.fade ? 1 - clamp(u * 1.3) : 1; ctx.save(); ctx.globalAlpha = k; const cl = ctx.createRadialGradient(1060, 300, 40, 1060, 300, 420); cl.addColorStop(0, 'rgba(230,220,255,.95)'); cl.addColorStop(1, 'rgba(180,170,240,.0)'); ctx.fillStyle = cl; ctx.fillRect(560, -120, 1000, 840);
  ctx.save(); ctx.translate(1060, 300); ctx.rotate(Math.sin(s * .5) * .2); ctx.fillStyle = '#e2a040'; ctx.beginPath(); ctx.ellipse(-150, -40, 70, 34, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-90, -40); ctx.lineTo(-50, -70); ctx.lineTo(-50, -10); ctx.fill(); ctx.strokeStyle = '#6a5ac8'; ctx.lineWidth = 12; for (let st = 0; st < 5; st++) { ctx.beginPath(); ctx.moveTo(40 + st * 34, 120 - st * 34); ctx.lineTo(74 + st * 34, 120 - st * 34); ctx.lineTo(74 + st * 34, 86 - st * 34); ctx.stroke(); } ctx.restore(); clockMini(960 + Math.sin(s) * 40, 200, 70, s); ctx.restore();
  if (o.text) label(o.text, CX, 120, 56, '#ffd23f');
}
function clockMini(x, y, r, s) { ctx.save(); ctx.translate(x, y); ctx.scale(1.3, .8); ctx.fillStyle = '#f6eed8'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); tube([[0, 0], [Math.cos(s * 2) * r * .8, Math.sin(s * 2) * r * .8]], 6, '#222'); ctx.restore(); }
function puzzle(u, s, o) {                                                     // reality assembled from tiles by the brain
  bgDeep(s, ['#1e2a3a', '#0a0e16']); const n = 8, m = 5, tw = 200, th = 160, x0 = CX - n * tw / 2, y0 = CY - m * th / 2, R = RN(8);
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const d = R(), k = eio(clamp(u * 1.6 - d * .6)), sx = x0 + i * tw, sy = y0 + j * th, fx = sx + (R() - .5) * 1600, fy = sy + (R() - .5) * 1200, x = lerp(fx, sx, k), y = lerp(fy, sy, k);
    ctx.save(); ctx.globalAlpha = .3 + .7 * k; ctx.beginPath(); ctx.rect(x, y, tw - 4, th - 4); ctx.clip(); ctx.translate(x - sx, y - sy); const sky = ctx.createLinearGradient(0, y0, 0, y0 + m * th); sky.addColorStop(0, '#f0a070'); sky.addColorStop(.6, '#f6d8a8'); sky.addColorStop(.61, '#4a7a4a'); sky.addColorStop(1, '#2a4a2a'); ctx.fillStyle = sky; ctx.fillRect(x0, y0, n * tw, m * th); ctx.fillStyle = '#ffe9a0'; ctx.beginPath(); ctx.arc(x0 + 1100, y0 + 330, 90, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a3a5a'; ctx.beginPath(); ctx.moveTo(x0, y0 + 500); ctx.lineTo(x0 + 400, y0 + 240); ctx.lineTo(x0 + 800, y0 + 500); ctx.fill(); ctx.restore(); }
  if (o.text) label(o.text, CX, 100, 62, '#ffd23f');
}
function finale(u, s, o) {                                                     // ending cards: question / subscribe / comment
  brain3d(u, s, { glows: [[-160, -100, 300, 0], [90, -20, 260, 1.7], [-40, 90, 240, 3.1]] }); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const k = eo(clamp(u * 4));
  if (o.mode === 'q') { ctx.save(); ctx.globalAlpha = k; label('HOW MUCH OF YOUR REALITY', CX, 420, 84, '#fff'); label('IS REAL… AND HOW MUCH', CX, 540, 84, '#fff'); label('IS YOUR BRAIN?', CX, 690, 120, '#ffd23f'); ctx.restore(); }
  if (o.mode === 'sub') { ctx.save(); ctx.globalAlpha = k; label('BODY HACKS', CX, 400, 140, '#fff'); const p = 1 + .04 * Math.sin(s * 6); ctx.translate(CX, 600); ctx.scale(p, p); ctx.fillStyle = '#e0303a'; ctx.beginPath(); ctx.roundRect(-330, -80, 660, 160, 80); ctx.fill(); txt('SUBSCRIBE', 0, 34, 96, '#fff', 'rgba(0,0,0,.3)', 8, '400', 'Anton'); ctx.restore(); }
  if (o.mode === 'com') { ctx.save(); ctx.globalAlpha = k; label('WHICH BRAIN TRICK', CX, 360, 100, '#fff'); label('HAVE YOU EXPERIENCED?', CX, 490, 100, '#fff'); const p = 1 + .05 * Math.sin(s * 5); ctx.translate(CX, 690); ctx.scale(p, p); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-560, -80, 1120, 160, 40); ctx.fill(); txt('💬 TELL US IN THE COMMENTS', 0, 22, 58, '#111', 'rgba(0,0,0,0)', 0, '900'); ctx.restore(); }
}
function chapterCard(u, s, o) {                                                // chapter title: huge extruded number, title slam, progress dots
  const c = o.c; brain3d(u, s, { glows: [[-160, -100, 260, 0]], hue: ['#241428', '#0e0812'] }); ctx.fillStyle = 'rgba(4,2,8,.62)'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const k = eo(clamp(s / .5)), k2 = eo(clamp((s - .25) / .5)), num = c.n === 0 ? '' : c.n === 11 ? '' : String(c.n).padStart(2, '0');
  if (num) { ctx.save(); ctx.translate(560, 590); const sc = 1.35 - .35 * k; ctx.scale(sc, sc); ctx.globalAlpha = k; ctx.font = '400 520px Anton'; ctx.textAlign = 'center'; for (let d = 18; d > 0; d--) { ctx.fillStyle = `rgb(${110 - d * 3},${30},${40})`; ctx.fillText(num, d * 1.6, d * 1.6 + 180); } const ng = ctx.createLinearGradient(0, -260, 0, 180); ng.addColorStop(0, '#fff2b0'); ng.addColorStop(.5, '#ffd23f'); ng.addColorStop(1, '#e08a1a'); ctx.fillStyle = ng; ctx.fillText(num, 0, 180); ctx.restore(); }
  const tx = num ? 1040 : CX, al = num ? 'left' : 'center';
  ctx.save(); ctx.globalAlpha = k2; ctx.translate((1 - k2) * 120, 0); ctx.textAlign = al; const words = c.title.split(' '); let lines = [], cur = ''; for (const w of words) { if ((cur + ' ' + w).trim().length > 12 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } lines.push(cur);
  lines.forEach((ln, i) => txt(ln, tx, 470 + i * 140 - (lines.length - 1) * 50, 140, '#fff', '#000', 16, '400', 'Anton'));
  if (c.sub) { ctx.font = '800 38px Montserrat'; ctx.fillStyle = '#f3c9c0'; const sub = c.sub.slice(0, Math.floor(c.sub.length * clamp((s - .5) / 1.2))); const maxW = num ? 800 : 1500, ws2 = sub.split(' '); let ln = '', yy = 470 + lines.length * 140 - (lines.length - 1) * 50 + 10; for (const w of ws2) { if (ctx.measureText(ln + ' ' + w).width > maxW && ln) { ctx.fillText(ln, tx, yy); ln = w; yy += 52; } else ln = (ln + ' ' + w).trim(); } ctx.fillText(ln, tx, yy); }
  ctx.restore();
  const sw = (s * 900) % 3200 - 600; const sg = ctx.createLinearGradient(sw - 200, 0, sw + 200, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,240,220,.08)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(-2400, -2400, 6800, 6000);
  if (c.n >= 1 && c.n <= 10) for (let i = 1; i <= 10; i++) { const x = CX - 5 * 70 + (i - .5) * 70, on = i <= c.n; ctx.fillStyle = on ? (i === c.n ? '#ffd23f' : 'rgba(255,210,63,.6)') : 'rgba(255,255,255,.2)'; ctx.beginPath(); ctx.arc(x, 980, i === c.n ? 16 : 11, 0, TAU); ctx.fill(); }
}
function hook(u, s, o) {                                                       // opening: the drift illusion behind a glowing brain + slam text
  snakes(u, s, { spin: .05 }); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const halo = ctx.createRadialGradient(CX, CY, 100, CX, CY, 700); halo.addColorStop(0, 'rgba(20,6,14,.9)'); halo.addColorStop(1, 'rgba(20,6,14,0)'); ctx.fillStyle = halo; ctx.fillRect(-2400, -2400, 6800, 6000);
  brainAt(CX, CY + 40, 1.05, s, [[-160, -100, 260, 0], [90, -20, 220, 1.7]], 3);
}
// ===== 2.video — HYPNIC JERK (portrait world 1080×1920) =====
function bedJerk(u, s, o) {                                                    // bedroom at night; body jerks under the blanket
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#121a34'); g.addColorStop(1, '#070a16'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.fillStyle = '#c8d6f0'; ctx.beginPath(); ctx.arc(860, 330, 70, 0, TAU); ctx.fill(); spark(860, 330, 320, .3, '200,215,255');
  ctx.fillStyle = '#2a3260'; ctx.fillRect(620, 220, 360, 300); ctx.strokeStyle = '#4a5490'; ctx.lineWidth = 12; ctx.strokeRect(620, 220, 360, 300); ctx.beginPath(); ctx.moveTo(800, 220); ctx.lineTo(800, 520); ctx.moveTo(620, 370); ctx.lineTo(980, 370); ctx.stroke();
  const jt = o.jerkAt !== undefined ? s - o.jerkAt : -9, j = jt >= 0 && jt < .7 ? Math.sin(Math.min(1, jt / .12) * Math.PI / 2) * Math.exp(-jt * 6) : 0, sh = j * 22;
  ctx.save(); ctx.translate(Math.sin(s * 80) * sh, Math.cos(s * 70) * sh);
  ctx.fillStyle = '#3a3050'; ctx.beginPath(); ctx.roundRect(40, 1180, 1000, 260, 40); ctx.fill(); ctx.fillStyle = '#2a2240'; ctx.fillRect(60, 1440, 40, 200); ctx.fillRect(980, 1440, 40, 200); ctx.fillRect(40, 1000, 60, 440);
  ctx.fillStyle = '#e8e2f0'; ctx.beginPath(); ctx.roundRect(110, 1080, 280, 120, 50); ctx.fill();
  const lift = j * 70; ctx.fillStyle = '#5a6aa8'; ctx.beginPath(); ctx.moveTo(300, 1210 - lift * .6); ctx.bezierCurveTo(520, 1080 - lift, 820, 1110 - lift * .8, 1030, 1190); ctx.lineTo(1030, 1260); ctx.lineTo(300, 1260); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(380 + i * 150, 1150 - lift * .8); ctx.quadraticCurveTo(420 + i * 150, 1200, 400 + i * 150, 1250); ctx.stroke(); }
  ctx.save(); ctx.translate(250, 1090 - lift * .5); ctx.rotate(-j * .25); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.ellipse(0, 0, 90, 72, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1c14'; ctx.beginPath(); ctx.ellipse(-30, -30, 90, 56, -.2, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = '#4a2a20'; ctx.lineWidth = 6; if (j > .15 || o.awake) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(40, -6, 13, 0, TAU); ctx.fill(); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(42, -6, 6, 0, TAU); ctx.fill(); } else { ctx.beginPath(); ctx.moveTo(26, -4); ctx.quadraticCurveTo(40, 4, 54, -4); ctx.stroke(); } ctx.restore();
  ctx.restore();
  if (j > .05) { for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .35; ctx.strokeStyle = `rgba(255,230,120,${j})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(250 + Math.cos(a) * 130, 1000 + Math.sin(a) * 130); ctx.lineTo(250 + Math.cos(a) * 220, 1000 + Math.sin(a) * 220); ctx.stroke(); } ctx.textAlign = 'center'; ctx.save(); ctx.globalAlpha = Math.min(1, j * 3); txt('JOLT!', 640, 820, 200, '#fff', '#8c0e18', 26, '400', 'Anton'); ctx.restore(); }
  if (!o.awake && j < .05) { for (let i = 0; i < 3; i++) { const ph = (s * .4 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; ctx.textAlign = 'center'; txt('Z', 380 + ph * 140 + i * 12, 960 - ph * 260, 60 + i * 22, '#e8eefc', 'rgba(0,0,0,.6)', 8, '400', 'Anton'); ctx.restore(); } }
}
function seventy(u, s) {
  bgDeep(s, ['#1e2232', '#0c0e16']); const k = Math.floor(clamp(u * 1.4) * 7.999);
  for (let i = 0; i < 10; i++) { const x = 200 + (i % 5) * 170, y = 820 + Math.floor(i / 5) * 420, on = i < k, col = on ? '#ffd23f' : 'rgba(255,255,255,.22)'; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - 110, 50, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 65, y - 50, 130, 190, 50); ctx.fill(); if (on) spark(x, y, 140, .25, '255,210,63'); }
  ctx.textAlign = 'center'; txt(Math.round(clamp(u * 1.4) * 70) + '%', 540, 560, 230, '#fff', '#8c0e18', 26, '400', 'Anton'); txt('OF PEOPLE', 540, 1720, 90, '#ffd23f', '#000', 14, '400', 'Anton');
}
function cliffFall(u, s) {                                                     // dream: stepping off a cliff, falling
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a2a5a'); g.addColorStop(.6, '#5a4a7a'); g.addColorStop(1, '#1a1428'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const R = RN(3); for (let i = 0; i < 80; i++) { ctx.fillStyle = `rgba(255,255,255,${.3 + R() * .5})`; ctx.fillRect(R() * 1080, R() * 1000, 3, 3); }
  ctx.fillStyle = '#14101c'; ctx.beginPath(); ctx.moveTo(-200, 700); ctx.lineTo(420, 700); ctx.lineTo(380, 900); ctx.lineTo(430, 1200); ctx.lineTo(360, 2000); ctx.lineTo(-200, 2000); ctx.closePath(); ctx.fill();
  const f = eio(clamp(u * 1.1)), x = lerp(470, 700, f), y = lerp(560, 1500, f * f), rot = f * 2.2;
  for (let i = 1; i < 6; i++) { ctx.strokeStyle = `rgba(255,255,255,${.25 - i * .04})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 30 + i * 12, y - 120 - i * 50); ctx.lineTo(x - 30 + i * 12, y - 60 - i * 50); ctx.stroke(); }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#0a0812'; ctx.beginPath(); ctx.arc(0, -110, 40, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-34, -70, 68, 130, 26); ctx.fill();
  const fl = Math.sin(s * 14) * .5; for (const d of [-1, 1]) { tube([[d * 30, -50], [d * 110, -110 + fl * 60 * d], [d * 150, -190 + fl * 40]], 22, '#0a0812'); tube([[d * 18, 60], [d * 60, 150 + fl * 30 * d], [d * 50, 240]], 24, '#0a0812'); } ctx.restore();
  ctx.textAlign = 'center'; txt('"I\'M FALLING!"', 540, 540, 110, '#fff', '#3a1a5a', 16, '400', 'Anton');
}
function alarm(u, s, o) {                                                      // brain flashes red: false alarm
  brain3d(u, s, { glows: [[-40, -40, 360, 0]] }); const on = (s * 3) % 1 < .5; ctx.fillStyle = `rgba(220,20,40,${on ? .32 : .08})`; ctx.fillRect(-2400, -2400, 6800, 6000);
  for (let i = 0; i < 2; i++) { ctx.strokeStyle = `rgba(255,80,80,${on ? .9 : .3})`; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(960, 560, 640 + i * 70, 0, TAU); ctx.stroke(); }
  ctx.textAlign = 'center'; txt(o.text || 'EMERGENCY!', 960, 130, 120, '#fff', '#8c0e18', 18, '400', 'Anton');
}
function triggers3(u, s) {
  bgDeep(s, ['#2a1a14', '#100a08']);
  const tile = (y, i, title, draw) => { const k = eo(clamp(u * 3 - i * .7)); ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 300, 0); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(90, y - 170, 900, 340, 40); ctx.fill(); draw(280, y); ctx.textAlign = 'left'; txt(title, 470, y + 30, 100, '#fff', '#000', 14, '400', 'Anton'); ctx.restore(); };
  tile(560, 0, 'STRESS', (x, y) => { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(x + 20, y - 130); ctx.lineTo(x - 70, y + 20); ctx.lineTo(x, y + 20); ctx.lineTo(x - 30, y + 140); ctx.lineTo(x + 80, y - 20); ctx.lineTo(x + 10, y - 20); ctx.closePath(); ctx.fill(); });
  tile(960, 1, 'CAFFEINE', (x, y) => { ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.roundRect(x - 90, y - 90, 180, 190, [10, 10, 50, 50]); ctx.fill(); ctx.strokeStyle = '#f2ece4'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(x + 100, y, 46, -1.4, 1.4); ctx.stroke(); ctx.fillStyle = '#5a3420'; ctx.beginPath(); ctx.ellipse(x, y - 84, 82, 16, 0, 0, TAU); ctx.fill(); for (let i = 0; i < 3; i++) tube(wavy(x - 40 + i * 40, y - 120, -Math.PI / 2, 90, 10 + Math.sin(s * 3 + i) * 4, 6), 6, 'rgba(255,255,255,.5)'); });
  tile(1360, 2, 'TIREDNESS', (x, y) => { ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.ellipse(x, y, 110, 60, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a22'; ctx.beginPath(); ctx.arc(x, y + 10, 40, 0, TAU); ctx.fill(); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.ellipse(x, y - 30, 120, 50, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(x - 120, y - 32, 240, 30); });
}
// ===== 11.video — FOOT FALLS ASLEEP (portrait world 1080×1920) =====
function pins(x, y, rw, rh, n, s, a, seed = 2) {                                  // pins & needles sparkles
  const R = RN(seed); for (let i = 0; i < n; i++) { const px = x + (R() - .5) * rw, py = y + (R() - .5) * rh, ph = (s * (1.5 + R() * 2) + R()) % 1, al = a * Math.sin(ph * Math.PI);
    ctx.save(); ctx.translate(px, py); ctx.rotate(R() * 3); ctx.strokeStyle = `rgba(255,240,140,${al})`; ctx.lineWidth = 5; const r = 10 + R() * 22; for (let k = 0; k < 4; k++) { const an = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(-Math.cos(an) * r, -Math.sin(an) * r); ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); ctx.stroke(); } ctx.restore(); }
}
function floorBG(s) { const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a3a5a'); g.addColorStop(.62, '#3a4a6a'); g.addColorStop(.63, '#8a5a3a'); g.addColorStop(1, '#5a3a24'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 4; for (let x = -400; x < 1500; x += 160) { ctx.beginPath(); ctx.moveTo(x, 1210); ctx.lineTo(x - 300, 2400); ctx.stroke(); } }
function sitter(x, y, sc, s, o) {                                                // front view person sitting cross-legged; o.up 0..1 stands up
  const up = o.up || 0, skin = '#d9a07a', shirt = '#3a7ac8', pant = '#2a2a3a';
  ctx.save(); ctx.translate(x, y - up * 380 * sc); ctx.scale(sc, sc);
  if (up < .5) { ctx.fillStyle = pant; ctx.beginPath(); ctx.ellipse(-120, 40, 190, 70, .12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(120, 40, 190, 70, -.12, 0, TAU); ctx.fill();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(190, 70, 70, 34, -.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-190, 70, 70, 34, .3, 0, TAU); ctx.fill(); }
  else { tube([[-50, 0], [-60, 380]], 80, pant); tube([[50, 0], [60, 380]], 80, pant); ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(-80, 400, 70, 30, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(80, 400, 70, 30, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = shirt; ctx.beginPath(); ctx.roundRect(-120, -330, 240, 340, 70); ctx.fill();
  tube([[-110, -290], [-170, -130], [-120, 10]], 50, shirt); tube([[110, -290], [170, -130], [120, 10]], 50, shirt);
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, -420, 95, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.arc(0, -440, 98, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  ctx.strokeStyle = '#3a2216'; ctx.lineWidth = 8; ctx.lineCap = 'round'; const wince = o.wince ? 1 : 0;
  for (const d of [-1, 1]) { ctx.beginPath(); if (wince) { ctx.moveTo(d * 50, -440); ctx.lineTo(d * 25, -425); ctx.lineTo(d * 50, -410); } else { ctx.arc(d * 35, -425, 9, 0, TAU); } ctx.stroke(); }
  ctx.beginPath(); if (wince) { ctx.moveTo(-30, -360); ctx.quadraticCurveTo(0, -380 + Math.sin(s * 20) * 6, 30, -360); } else { ctx.moveTo(-25, -370); ctx.quadraticCurveTo(0, -355, 25, -370); } ctx.stroke();
  ctx.restore();
}
function crossLegs(u, s, o) {
  floorBG(s); const up = o.stand ? eio(clamp((s - .6) / 1.2)) : 0; sitter(540, 1300, 1.15, s, { up, wince: o.wince || up > .5 });
  const fx = up > .5 ? 632 : 760, fy = up > .5 ? 1290 + 0 : 1380; if (o.pins) { spark(fx, fy, 240, .35, '255,230,120'); pins(fx, fy, 300, 200, 26, s, .95); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 640, 110, '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function footShape() { ctx.beginPath(); ctx.moveTo(300, 300); ctx.lineTo(560, 300); ctx.lineTo(600, 980); ctx.bezierCurveTo(820, 1040, 960, 1100, 960, 1200); ctx.bezierCurveTo(960, 1290, 820, 1300, 600, 1290); ctx.bezierCurveTo(380, 1290, 250, 1260, 260, 1120); ctx.closePath(); }
function footClose(u, s, o) {                                                    // big foot; numb grey, pins & needles, or normal
  bgDeep(s, ['#1e2a3a', '#0a0e16']); const dead = o.dead !== undefined ? o.dead : 0, k = typeof dead === 'function' ? dead(u) : dead;
  footShape(); const fg = ctx.createLinearGradient(300, 300, 900, 1300); fg.addColorStop(0, '#e0a882'); fg.addColorStop(1, '#c98a68'); ctx.fillStyle = fg; ctx.fill();
  ctx.save(); footShape(); ctx.clip(); ctx.fillStyle = `rgba(120,130,150,${.75 * k})`; ctx.fillRect(0, 0, 1200, 1400); ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 6; footShape(); ctx.stroke();
  if (o.pins) pins(680, 1100, 600, 380, 40, s, o.pins === 2 ? .7 : 1, 5);
  if (o.words) { const W = ['NUMB', 'HEAVY', 'BUZZING']; const i = Math.min(2, Math.floor(s / .9)), a = eo(clamp((s - i * .9) * 4)); ctx.save(); ctx.translate(540, 620); ctx.scale(.6 + .4 * a, .6 + .4 * a); ctx.textAlign = 'center'; txt(W[i] + '!', 0, 0, 150, ['#c8d0e0', '#ffd23f', '#ff8a5a'][i], '#000', 20, '400', 'Anton'); ctx.restore(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 600, 120, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function bloodMyth(u, s) {                                                       // blood keeps flowing → myth busted
  bgDeep(s, ['#3a1418', '#12060a']); const p = wavy(-200, 980, 0, 1500, 30, 4); tube(p, 260, '#7a1a22'); tube(p, 220, '#b8303a'); tube(p.map(q => [q[0], q[1] - 70]), 30, 'rgba(255,255,255,.15)');
  const R = RN(3); for (let i = 0; i < 26; i++) { const x = ((R() * 1600 + s * 260) % 1600) - 300, y = 980 + Math.sin((x + 200) / 1500 * 4) * 30 + (R() - .5) * 140; ctx.fillStyle = '#e04a50'; ctx.beginPath(); ctx.ellipse(x, y, 34, 22, R() * 3, 0, TAU); ctx.fill(); ctx.fillStyle = '#a8202a'; ctx.beginPath(); ctx.ellipse(x, y, 14, 8, 0, 0, TAU); ctx.fill(); }
  ctx.textAlign = 'center'; txt('CUT OFF BLOOD FLOW?', 540, 620, 96, '#fff', '#000', 14, '400', 'Anton');
  const k = eo(clamp((u - .35) * 4)); if (k > 0) { ctx.save(); ctx.translate(540, 1000); ctx.rotate(-.15); ctx.scale(1.6 - .6 * k, 1.6 - .6 * k); ctx.globalAlpha = k; ctx.strokeStyle = '#ff3a3a'; ctx.lineWidth = 18; ctx.beginPath(); ctx.roundRect(-300, -110, 600, 220, 30); ctx.stroke(); txt('MYTH', 0, 60, 170, '#ff3a3a', 'rgba(0,0,0,.5)', 10, '400', 'Anton'); ctx.restore(); }
}
// nerve cable; o.press: weight squishing it; o.block: pulses stop; o.chaos: hyperactive firing; o.release: weight lifts
function nerve(u, s, o) {
  bgDeep(s, ['#1a2240', '#080a16']); const cy = 1100, rel = o.release ? eio(clamp((s - .3) / .9)) : 0, pr = (o.press ? eio(clamp(s / .8)) : 0) * (1 - rel);
  const pts = []; for (let x = -300; x <= 1400; x += 10) { const d = (x - 540) / 140, sq = Math.exp(-d * d) * pr; pts.push([x, cy + Math.sin(x * .006 + s) * 10, 1 - .7 * sq]); }
  const band = (w, col) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - w * p[2]) : ctx.moveTo(p[0], p[1] - w * p[2])); for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + w * pts[i][2]); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  band(90, '#c8a44a'); band(70, '#f2d27a'); for (let f = -2; f <= 2; f++) { ctx.strokeStyle = 'rgba(160,120,40,.5)'; ctx.lineWidth = 5; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] + f * 24 * p[2]) : ctx.moveTo(p[0], p[1] + f * 24 * p[2])); ctx.stroke(); }
  ctx.textAlign = 'left'; label('BRAIN ←', 120, cy - 150, 46, '#cfe0ff', 'left'); ctx.textAlign = 'right'; label('→ TOES', 960, cy - 150, 46, '#cfe0ff', 'right');
  const pulse = (x, col, r = 80) => { const y = cy + Math.sin(x * .006 + s) * 10; spark(x, y, r, .95, col); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); };
  if (o.chaos) { const R = RN(11); for (let i = 0; i < 26; i++) { const sp = 300 + R() * 900, dir = R() < .5 ? 1 : -1, x = ((R() * 1700 + dir * s * sp) % 1700 + 1700) % 1700 - 300; pulse(x, i % 2 ? '255,230,120' : '255,140,90', 60 + R() * 60); }
    pins(540, cy, 1100, 320, 30, s, .9, 8); ctx.textAlign = 'center'; txt('TINGLE!!', 540 + Math.sin(s * 30) * 6, 640, 150, '#ffd23f', '#8c0e18', 22, '400', 'Anton'); }
  else { for (let k = 0; k < 4; k++) { for (const dir of [1, -1]) { let x = dir > 0 ? ((s * 420 + k * 425) % 1700) - 300 : 1400 - ((s * 420 + k * 425 + 200) % 1700); const blocked = o.block && pr > .5; if (blocked && ((dir > 0 && x > 440) || (dir < 0 && x < 640))) continue; pulse(x, dir > 0 ? '200,230,255' : '255,230,160'); } } }
  if (pr > .01) { const wy = cy - 90 * (1 - .7 * pr) - 360; ctx.fillStyle = '#4a4a56'; ctx.beginPath(); ctx.roundRect(390, wy, 300, 360, 30); ctx.fill(); ctx.fillStyle = '#5a5a66'; ctx.fillRect(390, wy, 300, 60); ctx.textAlign = 'center'; txt('PRESSURE', 540, wy + 230, 60, '#fff', '#000', 8, '400', 'Anton');
    for (const d of [-1, 1]) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(540 + d * 200, wy - 120); ctx.lineTo(540 + d * 200, wy - 30); ctx.lineTo(540 + d * 180, wy - 60); ctx.stroke(); } }
  if (o.block && pr > .5) { ctx.save(); ctx.globalAlpha = clamp((pr - .5) * 3); ctx.strokeStyle = '#ff3a3a'; ctx.lineWidth = 20; ctx.beginPath(); ctx.arc(540, cy + 190, 60, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(498, cy + 148); ctx.lineTo(582, cy + 232); ctx.stroke(); ctx.restore(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 600, 110, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function bodyLine(u, s) {                                                        // brain → spine → toes wiring, messages both ways
  bgDeep(s, ['#1a2240', '#080a16']); const P = [[540, 600], [540, 780], [540, 1060], [500, 1160], [480, 1400], [470, 1640], [560, 1720]];
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.arc(540, 600, 130, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(400, 740, 280, 420, 90); ctx.fill(); tube([[490, 1160], [470, 1700]], 110, 'rgba(255,255,255,.08)'); tube([[590, 1160], [610, 1700]], 110, 'rgba(255,255,255,.08)');
  ctx.fillStyle = '#e8a0b0'; ctx.beginPath(); ctx.ellipse(540, 580, 90, 70, 0, 0, TAU); ctx.fill(); tube(P, 16, '#f2d27a');
  const at = ph => { const n = P.length - 1, f = ph * n, i = Math.min(n - 1, Math.floor(f)), t = f - i; return [lerp(P[i][0], P[i + 1][0], t), lerp(P[i][1], P[i + 1][1], t)]; };
  for (let k = 0; k < 3; k++) { let p = at((s * .7 + k / 3) % 1); spark(p[0], p[1], 70, .95, '200,230,255'); p = at(1 - (s * .7 + k / 3 + .15) % 1); spark(p[0], p[1], 70, .95, '255,220,140'); }
  ctx.textAlign = 'left'; label('BRAIN', 660, 590, 50, '#e8a0b0', 'left'); label('TOES', 640, 1740, 50, '#f2d27a', 'left');
  ctx.textAlign = 'center'; txt('ELECTRICAL CABLES', 540, 470, 90, '#ffd23f', '#000', 14, '400', 'Anton');
}
const SEG = [
  { t: 0, fn: crossLegs, o: { pins: 1 }, cam: [540, 1150, .85, 600, 1150, 1.0, 0, .02], mag: [1, 1], big2: ['WHY DOES YOUR FOOT', 'FALL ASLEEP?!'] },
  { t: 3.1, fn: footClose, o: { dead: 1, words: 1, pins: 1 }, cam: [600, 960, 1.0, 640, 1000, 1.2, .02, -.02], mag: [1, 1], tag: ['PINS AND NEEDLES', 'numb, heavy, buzzing'] },
  { t: 7.6, fn: bloodMyth, o: {}, cam: [540, 980, 1.0, 560, 980, 1.15, 0, .02], mag: [1, 1], tag: ['POPULAR MYTH', 'it\'s not your blood flow'] },
  { t: 12.2, fn: nerve, o: { press: 1, text: 'SQUISHED NERVES' }, cam: [540, 1040, 1.0, 540, 1040, 1.15, -.02, .02], mag: [1, 1], tag: ['THE REAL CAUSE', 'squished nerves'] },
  { t: 14.8, fn: bodyLine, o: {}, cam: [540, 1000, .95, 540, 1000, 1.05, 0, .01], mag: [1, 1], tag: ['NERVES', 'tiny electrical cables'] },
  { t: 17.6, fn: nerve, o: { text: 'CONSTANT MESSAGES', col: '#cfe0ff' }, cam: [540, 1040, 1.0, 600, 1040, 1.15, .02, -.01], mag: [1, 1], tag: ['NERVES', 'brain ↔ toes, nonstop'] },
  { t: 20.4, fn: nerve, o: { press: 1, text: 'SUSTAINED PRESSURE' }, cam: [540, 1020, .95, 540, 1040, 1.15, 0, .02], mag: [1, 1], tag: ['PRESSURE', 'compresses the nerve pathway'] },
  { t: 25.4, fn: nerve, o: { press: 1, block: 1, text: 'SIGNALS BLOCKED', col: '#ff6a6a' }, cam: [540, 1060, 1.0, 540, 1060, 1.1, -.02, .02], mag: [1, 1], tag: ['BLOCKED', 'signals can\'t get through'] },
  { t: 27.3, fn: footClose, o: { dead: 1, text: 'FEELS DEAD', col: '#c8d0e0' }, cam: [600, 1000, 1.0, 620, 1000, 1.15, .02, -.02], mag: [1, 1], tag: ['NUMB FOOT', 'feels completely dead'] },
  { t: 29.7, fn: crossLegs, o: { stand: 1 }, cam: [540, 1100, .9, 560, 1000, 1.05, 0, .01], mag: [1, 1], tag: ['STAND UP', 'release the pressure'] },
  { t: 31.5, fn: nerve, o: { press: 1, release: 1, text: 'RELEASED!' }, cam: [540, 1040, 1.0, 540, 1040, 1.15, 0, .02], mag: [1, 1], tag: ['NERVES WAKE UP', 'suddenly'] },
  { t: 34.5, fn: nerve, o: { chaos: 1 }, cam: [540, 1040, 1.05, 560, 1040, 1.2, .02, -.03], mag: [1, 1], tag: ['CHAOTIC FIRING', 'hyperactive signals, all at once'] },
  { t: 38.2, fn: footClose, o: { dead: u => .5 * (1 - u), pins: 1 }, cam: [620, 1000, 1.05, 600, 980, 1.2, -.02, .02], mag: [1, 1], tag: ['INTENSE TINGLING', ''] },
  { t: 40.4, fn: footClose, o: { text: 'BACK TO NORMAL', col: '#7aff9a', pins: 2 }, cam: [600, 980, 1.0, 560, 960, 1.1, 0, .01], mag: [1, 1], tag: ['NORMAL SIGNALS', 'return'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
function drawSeg(sg, t, punch) {
  const d = sg.t1 - sg.t, s = t - sg.t, u = clamp(s / d, 0, 1.04), k = eio(clamp(s / d)), c = sg.cam, shake = 5;
  const z = lerp(c[2], c[5], k) * (1 + .3 * punch), x = lerp(c[0], c[3], k) + Math.sin(t * 7) * shake / z, y = lerp(c[1], c[4], k) + Math.cos(t * 5.3) * shake / z, r = lerp(c[6], c[7], k) + .01 * Math.sin(t * 2);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(r); ctx.scale(z, z); ctx.translate(-x, -y); sg.fn(u, s, sg.o); ctx.restore();
}
function segAt(t) { for (let i = SEG.length - 1; i >= 0; i--) if (t >= SEG[i].t) return i; return 0; }

// ---------------- overlays ----------------
function txt(str, x, y, size, fill, stroke = 'rgba(0,0,0,.8)', sw = 12, font = '900', fam = 'Montserrat') { ctx.font = `${font} ${size}px ${fam}`; ctx.lineJoin = 'round'; ctx.lineWidth = sw; ctx.strokeStyle = stroke; ctx.strokeText(str, x, y); ctx.fillStyle = fill; ctx.fillText(str, x, y); }
const CHUNKS = (() => { const out = []; let cur = []; WORDS.forEach((w, i) => { cur.push(w); const end = /[.,?!]$/.test(w[0]) || cur.length >= 4; if (end) { out.push(cur); cur = []; } }); if (cur.length) out.push(cur); return out; })();
function subs(t) {
  const ch = CHUNKS.find(c => t >= c[0][1] - .05 && t < c[c.length - 1][2] + .25); if (!ch) return;
  ctx.textAlign = 'left'; ctx.font = '900 76px Montserrat'; const ws0 = ch.map(w => w[0].replace(/[.,]$/, '').toUpperCase()).join(' '); const fs = Math.min(76, 76 * 960 / ctx.measureText(ws0).width); ctx.font = `900 ${fs}px Montserrat`; const ws = ch.map(w => w[0].replace(/[.,]$/, '').toUpperCase()), sp = ctx.measureText(' ').width, wd = ws.map(w => ctx.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  let x = (W - tot) / 2; const y = 1450, pop = clamp((t - ch[0][1] + .05) / .12); ctx.save(); ctx.translate(W / 2, y); ctx.scale(1 + .08 * (1 - pop), 1 + .08 * (1 - pop)); ctx.translate(-W / 2, -y);
  ws.forEach((w, i) => { const on = t >= ch[i][1] - .02 && t < ch[i][2] + .02; txt(w, x, y, fs, on ? '#ffd23f' : '#ffffff'); x += wd[i] + sp; }); ctx.restore();
}
function chip(sg, i, t) {
  if (!sg.tag) return; const prev = SEG[i - 1], newTag = !prev || !prev.tag || prev.tag[0] !== sg.tag[0], k = newTag ? eo(clamp((t - sg.t) / .35)) : 1, k2 = eo(clamp((t - sg.t) / .3));
  ctx.save(); ctx.translate(-420 * (1 - k), 0); ctx.fillStyle = 'rgba(8,4,6,.62)'; ctx.beginPath(); ctx.roundRect(48, 210, 640, 128, 20); ctx.fill(); ctx.fillStyle = '#e0303a'; ctx.fillRect(48, 210, 12, 128);
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = '900 44px Montserrat'; ctx.fillText(sg.tag[0], 84, 264); ctx.globalAlpha = k2; ctx.fillStyle = '#f3c9c0'; ctx.font = '800 32px Montserrat'; ctx.fillText(sg.tag[1], 84, 312); ctx.restore();
}
function mag(sg, t) { const d = sg.t1 - sg.t, k = eio(clamp((t - sg.t) / d)), v = Math.exp(lerp(Math.log(sg.mag[0]), Math.log(sg.mag[1]), k)); ctx.textAlign = 'right'; txt('×' + Math.round(v), W - 54, 262, 40, 'rgba(255,255,255,.92)', 'rgba(0,0,0,.6)', 8); ctx.font = '800 22px Montserrat'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText('MAGNIFICATION', W - 54, 292); }
function overlays(sg, i, t) {
  const s = t - sg.t; ctx.textAlign = 'center';
  if (sg.big) { const k = eo(clamp(s / .25)), pop = 1 + .5 * (1 - k); ctx.save(); ctx.translate(W / 2, 880); ctx.rotate(-.04); ctx.scale(pop, pop); txt(sg.big[0], 0, -30, 130, '#fff', '#8c0e18', 24, '400', 'Anton'); txt(sg.big[1], 0, 110, 170, '#ffd23f', '#8c0e18', 28, '400', 'Anton'); ctx.restore(); }
  if (sg.big2) { const k = eo(clamp(s / .4)); ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 500 + (1 - k) * -40); txt(sg.big2[0], 0, 0, 96, '#fff', '#000', 14, '400', 'Anton'); txt(sg.big2[1], 0, 60, 40, '#ffd23f', 'rgba(0,0,0,.9)', 9, '800'); ctx.restore(); }
  if (sg.q) { const k = eo(clamp((s - .5) / .5)); ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 640); const p = 1 + .06 * Math.sin(t * 6); ctx.scale(p * (1.3 - .3 * k), p * (1.3 - .3 * k)); txt('?', 0, 0, 380, '#ffd23f', '#000', 28, '400', 'Anton'); ctx.restore(); }
  if (sg.cta) { const k = eo(clamp(s / .4)); ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 560); txt('BODY HACKS', 0, 0, 150, '#fff', '#8c0e18', 22, '400', 'Anton'); ctx.restore();
    if (sg.cta === 2) { const k2 = eo(clamp((s - .2) / .4)), p = 1 + .04 * Math.sin(t * 6); ctx.save(); ctx.translate(W / 2, 760); ctx.scale(p * k2, p * k2); ctx.fillStyle = '#e0303a'; ctx.beginPath(); ctx.roundRect(-300, -62, 600, 124, 62); ctx.fill(); txt('FOLLOW', 0, 32, 84, '#fff', 'rgba(0,0,0,.35)', 8, '400', 'Anton'); ctx.restore(); } else { ctx.save(); ctx.globalAlpha = k; txt('MORE AMAZING BODY FACTS', W / 2, 660, 44, '#ffd23f', '#000', 10, '800'); ctx.restore(); } }
}
function grade(t) {
  const v = ctx.createRadialGradient(W / 2, H / 2, 420, W / 2, H / 2, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,0,4,.72)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  const b = ctx.createLinearGradient(0, 1150, 0, 1760); b.addColorStop(0, 'rgba(0,0,0,0)'); b.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = b; ctx.fillRect(0, 1150, W, 770);
  const R = RN(Math.floor(t * 30)); ctx.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 160; i++) ctx.fillRect(R() * W, R() * H, 2, 2);
}
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const i = segAt(t), sg = SEG[i], k = clamp((t - sg.t) / .22);
  if (i > 0 && k < 1) { drawSeg(SEG[i - 1], t, 0); ctx.globalAlpha = eo(k); }
  drawSeg(sg, t, i > 0 ? Math.pow(1 - k, 2) : 0); ctx.globalAlpha = 1;
  grade(t); chip(sg, i, t); mag(sg, t); overlays(sg, i, t); subs(t);
  if (t > DUR - .35) { ctx.fillStyle = 'rgba(0,0,0,' + clamp((t - (DUR - .35)) / .35) + ')'; ctx.fillRect(0, 0, W, H); }
};
draw(0);
