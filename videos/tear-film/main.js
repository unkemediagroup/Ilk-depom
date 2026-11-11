// "How Do Our Wounds Actually Heal?" — anatomical micro-world, drawn in code (Canvas 2D), 1080×1920, 30 fps.
const cv = document.getElementById('c'), ctx = cv.getContext('2d'), W = 1080, H = 1920;
window.DUR = 46.68;
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
  ctx.fillStyle = '#060404'; ctx.beginPath(); ctx.arc(ix, cy, 78, 0, TAU); ctx.fill();
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
  tissueBG(91, .4); const cx = 540, cy = 960, gap = 70 + (o.pull ? eio(clamp(u * 1.5)) * 50 : 0);
  ctx.fillStyle = 'rgba(236,222,214,.9)'; ctx.beginPath(); ctx.ellipse(cx, cy, 420, 260 + gap, 0, 0, TAU); ctx.fill();
  const sf = ctx.createRadialGradient(cx, cy, 20, cx, cy, 380); sf.addColorStop(0, 'rgba(245,232,170,.95)'); sf.addColorStop(1, 'rgba(232,212,150,.9)'); ctx.fillStyle = sf; ctx.beginPath(); ctx.ellipse(cx, cy, 380, 220 + gap, 0, 0, TAU); ctx.fill();
  for (const d of [-1, 1]) { const y0 = cy + d * (gap + 20); ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.moveTo(cx - 260, y0 + d * 1200); ctx.lineTo(cx - 260, y0 + d * 80); ctx.quadraticCurveTo(cx, y0 - d * 70, cx + 260, y0 + d * 80); ctx.lineTo(cx + 260, y0 + d * 1200); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#dfeaf0'; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(cx - 250, y0 + d * 95); ctx.quadraticCurveTo(cx, y0 - d * 50, cx + 250, y0 + d * 95); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 6; ctx.stroke();
    const R = RN(d + 5); ctx.fillStyle = 'rgba(190,160,110,.5)'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(cx - 230 + R() * 460, y0 + d * (160 + R() * 700), 6 + R() * 12, 0, TAU); ctx.fill(); } }
  const bk = o.pull ? clamp(u * 1.6) : clamp((s % 2.2) / 1.6), pop = o.pull && u > .7 ? clamp((u - .7) / .1) : 0, br = 30 + 90 * eo(bk);
  if (pop < 1) { ctx.save(); ctx.globalAlpha = 1 - pop; const bg = ctx.createRadialGradient(cx - br * .3, cy - br * .3, 4, cx, cy, br); bg.addColorStop(0, 'rgba(255,255,255,.9)'); bg.addColorStop(.7, 'rgba(235,240,245,.35)'); bg.addColorStop(1, 'rgba(200,210,220,.7)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx, cy, br * (1 + pop * .5), 0, TAU); ctx.fill(); ctx.restore(); }
  if (pop > 0) { for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; ctx.strokeStyle = 'rgba(255,255,255,' + (1 - pop) + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 120 * pop, cy + Math.sin(a) * 120 * pop); ctx.lineTo(cx + Math.cos(a) * 240 * pop, cy + Math.sin(a) * 240 * pop); ctx.stroke(); } }
}
const SEG = [
  { t: 0, fn: eye, o: { noblink: 1, film: .6 }, cam: [540, 960, .8, 560, 940, 1.25, -.02, .02], mag: [1, 3] },
  { t: 2.2, fn: eye, o: { noblink: 1, film: 1 }, cam: [560, 960, 1.6, 600, 940, 3.0, .02, -.02], mag: [3, 20], tag: ['INVISIBLE LAYER', 'coating your eye right now'] },
  { t: 4.6, fn: eye, o: { bl: s => Math.max(0, Math.sin(clamp((s - .7) / .3) * Math.PI)), film: .5 }, cam: [540, 980, 1.1, 520, 960, .9, .03, -.02], mag: [2, 1] },
  { t: 6.3, fn: film, o: { labels: 1 }, cam: [540, 850, 1.0, 540, 900, 1.15, 0, .02], mag: [2000, 4000], tag: ['THE TEAR FILM', '3 ultra-thin layers'] },
  { t: 8.6, fn: gland, o: {}, cam: [540, 900, 1.0, 540, 1200, 1.3, -.03, .03], mag: [200, 500], tag: ['TEAR GLANDS', 'refill it all day long'] },
  { t: 10.9, fn: film, o: { mol: 1 }, cam: [540, 820, 1.6, 540, 860, 2.1, .02, -.02], mag: [5000, 9000], tag: ['KEEPS EYES MOIST', 'a constant layer of water'] },
  { t: 12.8, fn: film, o: { dust: 1 }, cam: [540, 820, 1.1, 560, 840, 1.5, -.02, .02], mag: [3000, 5000], tag: ['CLEANS', 'washes away dust & particles'] },
  { t: 15.1, fn: film, o: { germs: 1 }, cam: [540, 860, 1.3, 540, 840, 1.7, .03, -.03], mag: [5000, 8000], tag: ['PROTECTS', 'enzymes like lysozyme fight germs'] },
  { t: 18.3, fn: optics, o: { rough: u => 1 - eio(clamp(u * 1.4)) }, cam: [540, 960, .95, 560, 960, 1.15, 0, 0], mag: [2, 3], tag: ['SMOOTH SURFACE', 'light enters clearly'] },
  { t: 21.0, fn: optics, o: {}, cam: [900, 960, 2.0, 700, 960, 1.3, .02, -.02], mag: [5, 3], tag: ['SMOOTH SURFACE', 'focused on the retina'] },
  { t: 22.9, fn: sharp, o: {}, cam: [540, 960, 1.15, 540, 960, 1.0, -.03, 0], mag: [1, 1], tag: ['SHARP IMAGES', 'thanks to a smooth film'] },
  { t: 25.3, fn: eye, o: { bl: s => Math.max(0, Math.sin(clamp((s - .6) / .5) * Math.PI)), film: .7 }, cam: [540, 960, 1.0, 540, 960, 1.4, .02, -.02], mag: [1, 3], tag: ['EVERY BLINK', 'spreads a fresh layer'] },
  { t: 27.5, fn: wiper, o: {}, cam: [540, 980, .95, 540, 1000, 1.1, 0, .02], mag: [3000, 3000], tag: ['EVERY BLINK', 'the eyelid sweeps the film'] },
  { t: 29.9, fn: windshield, o: {}, cam: [540, 960, 1.0, 540, 980, 1.2, -.02, .02], mag: [1, 1], tag: ['LIKE A', 'windshield wiper'] },
  { t: 32.0, fn: eye, o: { bl: s => Math.max(0, Math.sin(clamp((s - 1.4) / .9) * Math.PI)), film: .8 }, cam: [540, 960, 1.4, 540, 960, .95, 0, .03], mag: [3, 1], big2: ['ONE SINGLE BLINK', '~15–20 times every minute'] },
  { t: 36.0, fn: joint, o: {}, cam: [540, 960, .9, 540, 960, 1.3, -.03, .03], mag: [5, 30], big2: ['WHY DO JOINTS', 'MAKE POPPING SOUNDS?'] },
  { t: 39.9, fn: joint, o: { pull: 1 }, cam: [540, 960, 1.4, 540, 960, 1.9, .03, -.02], mag: [30, 80], big2: ['WANT THE ANSWER?', 'WATCH OUR NEXT VIDEO'] },
  { t: 42.6, fn: vessel, o: { mode: 'flow', seed: 13 }, cam: [540, 960, 1.3, 540, 960, .85, .1, .2], mag: [400, 20], cta: 2 },
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
