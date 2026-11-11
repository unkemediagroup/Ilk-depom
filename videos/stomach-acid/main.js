// "How Do Our Wounds Actually Heal?" — anatomical micro-world, drawn in code (Canvas 2D), 1080×1920, 30 fps.
const cv = document.getElementById('c'), ctx = cv.getContext('2d'), W = 1080, H = 1920;
window.DUR = 62.12;
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

// ---------------- skin cut / closure ----------------
const GP = t => { const a = [-150, 560], b = [250, 860], c = [780, 1040], d = [1230, 1400], m = 1 - t; return [m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * d[0], m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * d[1]]; };
const GN = t => { const p = GP(Math.max(0, t - .01)), q = GP(Math.min(1, t + .01)); const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [-dy / l, dx / l]; };
function groove(open, heal, scar, s) {
  const N = 60, M = Math.floor(open * N), wm = 66; if (M < 2) return;
  const wAt = i => wm * Math.pow(Math.sin(Math.PI * i / N), .55) * (1 - heal);
  const side = k => { const o = []; for (let i = 0; i <= M; i++) { const t = i / N, p = GP(t), n = GN(t), w = wAt(i) * k; o.push([p[0] + n[0] * w, p[1] + n[1] * w]); } return o; };
  const L = side(1), Rr = side(-1);
  if (heal < .98) {
    ctx.beginPath(); L.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = Rr.length - 1; i >= 0; i--) ctx.lineTo(Rr[i][0], Rr[i][1]); ctx.closePath();
    ctx.fillStyle = mix(mix('#4a0710', '#a3101a', clamp((s - .2) / 1.2)), '#ec9aa2', clamp(heal * 1.6)); ctx.fill();
    ctx.lineJoin = 'round'; ctx.strokeStyle = mix('#eaa392', '#e9a0a6', heal); ctx.lineWidth = 7; ctx.stroke();
  }
  if (open >= 1 && heal < .6) {                                                // blood welling up
    const R = RN(9); for (let i = 3; i < N - 2; i += 3) { const t = i / N, p = GP(t), k = eo(clamp((s - .15 - R() * .6) / 1.1)) * (1 - heal * 1.7); if (k <= 0) continue; const r = (6 + 14 * R()) * k + wAt(i) * .18;
      const g = ctx.createRadialGradient(p[0] - r * .3, p[1] - r * .3, r * .1, p[0], p[1], r); g.addColorStop(0, '#f0525a'); g.addColorStop(.5, '#cf1822'); g.addColorStop(1, '#7d0912'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); }
  }
  if (heal > 0 && heal < 1) {                                                  // migrating epithelial cells (pink)
    for (let i = 2; i < N - 1; i += 2) { const t = i / N, p = GP(t), n = GN(t), w = wAt(i); for (const k of [-1, 1]) for (let j = 0; j < 3; j++) { const off = Math.max(0, w * .9 - j * 26 + 10), x = p[0] + n[0] * off * k, y = p[1] + n[1] * off * k;
      const g = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, 24); g.addColorStop(0, '#f6b6bb'); g.addColorStop(1, '#d9737f'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 22, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(140,60,90,.55)'; ctx.beginPath(); ctx.arc(x + 2, y + 2, 5, 0, TAU); ctx.fill(); } }
  }
  if (heal >= 1) {                                                             // scar maturing: pink line fades into skin
    const pts = []; for (let i = 0; i <= N; i++) pts.push(GP(i / N)); ctx.save(); ctx.globalAlpha = 1 - scar * .9;
    tube(pts, 30 * (1 - scar * .5), mix('#e68f98', '#d9a088', scar)); ctx.restore();
  }
}

function skinScene(u, s, o) {
  skinBase(); if (o.cut === 'live') { const open = clamp(s / .28); groove(open, 0, 0, s);
    if (o.cut === 'live' && s < .38) { const t = clamp(s / .28), p = GP(t); const g = ctx.createLinearGradient(p[0] - 160, p[1] - 90, p[0] + 160, p[1] + 90); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(235,245,255,' + (.95 * (1 - s / .38)) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - 220, p[1] - 150, 440, 300); } }
  if (o.heal !== undefined) groove(1, o.heal(u), o.scar ? o.scar(u) : 0, s + 2);
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
function stomach(u, s, o) {
  ctx.fillStyle = '#12070a'; ctx.fillRect(-2200, -2200, 5600, 6600); const g = ctx.createRadialGradient(540, 950, 100, 540, 950, 1100); g.addColorStop(0, 'rgba(120,30,40,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const body = () => { ctx.beginPath(); ctx.moveTo(430, 560); ctx.bezierCurveTo(300, 640, 230, 900, 300, 1200); ctx.bezierCurveTo(360, 1520, 640, 1620, 800, 1450); ctx.bezierCurveTo(900, 1340, 850, 1200, 760, 1190); ctx.bezierCurveTo(700, 1185, 620, 1230, 560, 1130); ctx.bezierCurveTo(500, 1000, 540, 800, 560, 560); ctx.closePath(); };
  tube([[470, 200], [495, 600]], 96, '#c9766f'); tube([[780, 1330], [1000, 1380], [1200, 1330]], 80, '#c9766f');
  body(); const sg = ctx.createLinearGradient(250, 600, 850, 1500); sg.addColorStop(0, '#e29a8e'); sg.addColorStop(.5, '#cf7870'); sg.addColorStop(1, '#a24850'); ctx.fillStyle = sg; ctx.fill(); ctx.strokeStyle = '#7e3238'; ctx.lineWidth = 6; ctx.stroke();
  ctx.save(); body(); ctx.clip(); for (let i = 0; i < 14; i++) { const p = wavy(240, 640 + i * 70, .6 + Math.sin(i) * .15, 760, 20, 6); tube(p, 9, 'rgba(255,200,190,.28)'); tube(p.map(q => [q[0] + 3, q[1] + 8]), 5, 'rgba(110,30,40,.35)'); }
  for (let i = 0; i < 7; i++) tube(wavy(300 + i * 40, 650, 1.1 + i * .05, 780, 16, 4), 6, 'rgba(190,30,40,.8)'); ctx.restore();
  const hl = ctx.createRadialGradient(400, 900, 20, 400, 900, 380); hl.addColorStop(0, 'rgba(255,235,225,.35)'); hl.addColorStop(1, 'rgba(255,235,225,0)'); body(); ctx.fillStyle = hl; ctx.fill();
  if (o && o.red) { body(); ctx.fillStyle = 'rgba(150,10,20,' + (.45 * clamp(u * 2) + .12 * Math.sin(s * 7)) + ')'; ctx.fill(); const gl = ctx.createRadialGradient(480, 1100, 20, 480, 1100, 520); gl.addColorStop(0, 'rgba(255,60,40,' + .5 * u + ')'); gl.addColorStop(1, 'rgba(255,60,40,0)'); ctx.fillStyle = gl; ctx.fillRect(-200, 500, 1400, 1300); }
}
// ---------------- stomach-specific scenes ----------------
const CT = 1180, CHh = 230, STEP = 92;
function dropAt(x, y, r, a) { if (a <= 0 || r <= .5) return; const gl = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4); gl.addColorStop(0, 'rgba(225,240,120,' + .55 * a + ')'); gl.addColorStop(1, 'rgba(225,240,120,0)'); ctx.fillStyle = gl; ctx.fillRect(x - r * 2.6, y - r * 2.6, r * 5.2, r * 5.2); ctx.fillStyle = 'rgba(238,250,150,' + .92 * a + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,230,' + .6 * a + ')'; ctx.beginPath(); ctx.arc(x - r * .3, y - r * .3, r * .3, 0, TAU); ctx.fill(); }
function lin(u, s, o) {                                                       // gastric surface lining, side view
  const m = o.mucus === undefined ? 1 : o.mucus, yTop = CT - 300 * m, dm = o.damage ? o.damage(u) : 0, R = RN(14);
  let g = ctx.createLinearGradient(0, -400, 0, CT); g.addColorStop(0, '#171007'); g.addColorStop(1, '#4a3d14'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 2200 + CT);
  if (m > 0) { g = ctx.createLinearGradient(0, yTop, 0, CT); g.addColorStop(0, 'rgba(250,236,170,.3)'); g.addColorStop(.35, 'rgba(244,226,160,.78)'); g.addColorStop(1, 'rgba(238,208,134,.92)'); ctx.fillStyle = g; ctx.fillRect(-2200, yTop, 5600, CT - yTop);
    for (let i = 0; i < 46; i++) tube(wavy(R() * 2000 - 400, yTop + R() * (CT - yTop), R() * .6 - .3, 200 + R() * 200, 10, 4), 3, 'rgba(255,248,215,.45)');
    if (o.ph) { g = ctx.createLinearGradient(0, yTop, 0, CT); g.addColorStop(0, 'rgba(210,235,90,.4)'); g.addColorStop(1, 'rgba(245,160,175,.45)'); ctx.fillStyle = g; ctx.fillRect(-2200, yTop, 5600, CT - yTop); } }
  if (o.bic && m > 0) { const B = RN(51); for (let i = 0; i < 90; i++) { const k = Math.pow(B(), .55), x = B() * 1500 - 200, y = lerp(CT - 10, yTop + 20, k) - ((s * 18 + i * 7) % 40), a = .55 + .35 * Math.sin(s * 4 + i); ctx.fillStyle = 'rgba(190,225,255,' + a + ')'; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(40,90,150,.9)'; ctx.font = '800 9px Montserrat'; ctx.textAlign = 'center'; ctx.fillText('HCO₃', x, y + 3); } }
  ctx.fillStyle = '#c4616f'; ctx.fillRect(-2200, CT + CHh, 5600, 1500);
  for (let i = 0, x = -480; x < 1700; x += STEP, i++) { const th = R(), bad = dm > th, k = bad ? clamp((dm - th) * 3) : 0, top = CT + k * 70 * R();
    const g2 = ctx.createLinearGradient(x, CT, x + 80, CT); g2.addColorStop(0, mix('#f2a3ab', '#9a8680', k)); g2.addColorStop(1, mix('#d97a87', '#6e5650', k)); ctx.fillStyle = g2; ctx.strokeStyle = '#a84a5c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x, top, 84, CT + CHh - top, [18 - k * 14, 18 - k * 14, 4, 4]); ctx.fill(); ctx.stroke();
    ctx.fillStyle = mix('#8a4a78', '#4a3040', k); ctx.beginPath(); ctx.ellipse(x + 42, CT + 160, 20, 34, 0, 0, TAU); ctx.fill();
    if (o.granules) for (let j = 0; j < 4; j++) { const ph = (s * .5 + R() + j * .25) % 1; ctx.fillStyle = 'rgba(248,226,150,' + (1 - ph * .8) + ')'; ctx.beginPath(); ctx.arc(x + 20 + j * 14 + Math.sin(j + i) * 6, lerp(CT + 70, CT - 20 - ph * 100, ph), 8 + 4 * (1 - ph), 0, TAU); ctx.fill(); }
    if (dm > .5 && R() < dm - .3) rbc(x + 42, CT + 10 - ((s * 60 + i * 30) % 120), 14, i, .6, 1, .9);
  }
  if (o.junc) for (let x = -480 + 84; x < 1700; x += STEP) { const gl = ctx.createLinearGradient(x - 12, 0, x + 20, 0); gl.addColorStop(0, 'rgba(255,245,200,0)'); gl.addColorStop(.5, 'rgba(255,245,200,.55)'); gl.addColorStop(1, 'rgba(255,245,200,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 12, CT - 4, 32, 120);
    for (let y = CT; y < CT + 100; y += 14) { ctx.fillStyle = '#fff7df'; ctx.beginPath(); ctx.roundRect(x - 1 - (y / 14 % 2 ? 6 : 0), y, 14, 7, 3); ctx.fill(); } }
  const A = RN(88), nA = o.rate || 40; for (let i = 0; i < nA; i++) {
    const jx = o.junc ? -480 + 84 + STEP * Math.floor(A() * 20) + 4 : A() * 1500 - 200, sp = .22 + A() * .2, ph = (s * sp + A()) % 1, r = 16 + A() * 12, y0 = -100; let x = jx, y, a = 1, rr = r;
    if (o.junc || o.bounce) { const fl = o.junc ? CT - 4 : yTop, dn = .6; if (ph < dn) y = lerp(y0, fl, ph / dn); else { const b = (ph - dn) / (1 - dn); y = fl - 160 * Math.sin(b * Math.PI) * (1 - b * .3); x += Math.sin(b * 3) * 20; a = 1 - b * .7; } }
    else { y = lerp(y0, m > 0 ? CT : CT - 4, ph); if (m > 0 && y > yTop) { const f = clamp((y - yTop) / (CT - yTop)); rr = r * (1 - f * 1.15); a = 1 - f; } else if (m <= 0 && ph > .93) a = 1 - (ph - .93) / .07; }
    dropAt(x, y, rr, a); }
  if (o.labels) { const L = [['1  MUCUS + BICARBONATE', 120, 1010, .15], ['2  TIGHT JUNCTIONS', 120, 1215, .4], ['3  CONSTANT RENEWAL', 120, 1420, .65]]; ctx.textAlign = 'left'; for (const [t, x, y, k] of L) { const a = eo(clamp((u - k) * 6)); ctx.save(); ctx.globalAlpha = a; ctx.translate(-80 * (1 - a), 0); txt(t, x, y, 46, '#fff', 'rgba(0,0,0,.85)', 10, '900'); ctx.restore(); } }
  if (o.ph) { ctx.textAlign = 'left'; txt('pH 2', 90, yTop + 50, 44, '#e9f58a', '#000', 8); txt('pH 7', 90, CT - 20, 44, '#ffd5da', '#000', 8); }
}
function pit(u, s) {                                                           // gastric gland: parietal cells secrete HCl
  tissueBG(61, .5); tube([[540, 2400], [540, -400]], 120, '#c97a85'); tube([[540, 2400], [540, -400]], 78, '#3a3412'); const R = RN(7);
  for (let i = 0; i < 12; i++) { const side = i % 2 ? 1 : -1, y = 2200 - i * 260, x = 540 + side * 150, par = i % 3 !== 2, r = par ? 96 : 66;
    const g = ctx.createRadialGradient(x - 20, y - 20, 8, x, y, r); g.addColorStop(0, par ? '#f6b79a' : '#cdb4d6'); g.addColorStop(1, par ? '#d6784f' : '#8f72a6'); ctx.fillStyle = g; ctx.strokeStyle = 'rgba(100,40,40,.8)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = par ? '#7a4a6a' : '#5a3f78'; ctx.beginPath(); ctx.arc(x + side * 24, y + 8, r * .3, 0, TAU); ctx.fill();
    if (par) for (let j = 0; j < 7; j++) { const ph = (s * .55 + j / 7 + i * .13) % 1, dx = lerp(x - side * r * .5, 540, eo(ph)), dy = y + Math.sin(j * 2 + i) * 20 - ph * 30; dropAt(dx, dy, 14 * (1 - ph * .3), 1 - ph * .3); } }
  for (let i = 0; i < 26; i++) { const ph = (s * .35 + i * .21) % 1; dropAt(540 + Math.sin(i * 3) * 24, lerp(2300, -300, ph), 16, .9); }
}
function acidSea(u, s) {
  const g = ctx.createLinearGradient(0, -300, 0, 2300); g.addColorStop(0, '#201c07'); g.addColorStop(1, '#52491a'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600); const R = RN(5);
  for (let i = 0; i < 80; i++) { const r = 20 + R() * 70, x = R() * 1800 - 360 + Math.sin(s * .8 + i) * 40, y = ((R() * 2800 - 400 + s * (40 + R() * 80)) % 2800) - 400; dropAt(x, y, r, .55 + .4 * R()); if (i < 6) { ctx.textAlign = 'center'; txt('HCl', x, y + 12, 34, 'rgba(60,70,10,.85)', 'rgba(255,255,230,.5)', 4, '900'); } }
}
function protein(u, s) {
  const g = ctx.createLinearGradient(0, 0, 0, 2000); g.addColorStop(0, '#2a1d0e'); g.addColorStop(1, '#4e381a'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600); const R = RN(9);
  for (let c = 0; c < 8; c++) { const cx = 180 + (c % 3) * 360 + (R() - .5) * 80, cy = 520 + Math.floor(c / 3) * 480 + (R() - .5) * 80, d = R() * 1.2, k1 = eio(clamp((s - d) / 1.0)), k2 = clamp((s - d - 1.0) / .9), n = 26, cuts = [8, 17];
    if (k2 > 0 && k2 < .35) { ctx.fillStyle = 'rgba(255,255,220,' + (.8 * (1 - k2 * 3)) + ')'; for (const ci of cuts) { ctx.beginPath(); ctx.arc(cx + (ci - 13) * 22, cy, 40 * k2 * 3, 0, TAU); ctx.fill(); } }
    for (let j = 0; j < n; j++) { const a = j * .62, rr = 28 + j * 3.4, cxp = cx + Math.cos(a) * rr, cyp = cy + Math.sin(a) * rr * .8, lxp = cx + (j - 13) * 22, lyp = cy + Math.sin(j * .9) * 14, seg = j < cuts[0] ? 0 : j < cuts[1] ? 1 : 2;
      const x = lerp(cxp, lxp, k1) + (seg - 1) * 70 * k2 + Math.sin(s * 2 + c + seg) * 8 * k2, y = lerp(cyp, lyp, k1) + (seg - 1) * 40 * k2 * (c % 2 ? 1 : -1);
      const col = ['#d9a45a', '#c8843a', '#e8c07a'][j % 3]; ctx.fillStyle = col; ctx.strokeStyle = 'rgba(70,40,10,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); ctx.stroke(); } }
  for (let i = 0; i < 30; i++) dropAt(R() * 1400 - 150, ((R() * 2400 + s * 60) % 2400) - 200, 10 + R() * 8, .5);
}
function microbes(u, s) {
  const g = ctx.createLinearGradient(0, 0, 0, 2000); g.addColorStop(0, '#201c07'); g.addColorStop(1, '#4a4216'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600); const R = RN(21);
  for (let i = 0; i < 60; i++) dropAt(R() * 1500 - 200, ((R() * 2600 + s * 90) % 2600) - 300, 14 + R() * 30, .45);
  for (let i = 0; i < 16; i++) { const x = 140 + R() * 800, y = 380 + R() * 1200, rot = R() * TAU, ti = .15 + R() * 1.7, k = clamp((s - ti) / .9); if (k >= 1) continue; ctx.save(); ctx.globalAlpha = 1 - k * k; ctx.translate(x + Math.sin(s * 3 + i) * 10, y + Math.cos(s * 2.4 + i) * 10); const sc = 1.6 - k * .9; ctx.scale(sc, sc); bact(0, 0, 90, rot + Math.sin(s * (3 + k * 20)) * (.2 + k), k); ctx.restore();
    if (k > 0) for (let j = 0; j < 7; j++) { const a = j * 1.1 + i; ctx.fillStyle = 'rgba(150,160,100,' + (.8 * (1 - k)) + ')'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * k * 90, y + Math.sin(a) * k * 90, 6, 0, TAU); ctx.fill(); } }
}
function renew(u, s) {                                                         // gastric gland wall: stem-cell division, upward migration, shedding at the surface
  tissueBG(73, .4); let g = ctx.createLinearGradient(0, 0, 0, 2000); g.addColorStop(0, '#2a2208'); g.addColorStop(1, '#4a3d14'); ctx.fillStyle = g; ctx.fillRect(400, -2200, 280, 6600);
  const RH = 150, v = (s * 70) % RH; for (const side of [-1, 1]) for (let k = -2; k < 16; k++) { const y = 2000 - k * RH - v, age = clamp((2000 - y) / 1700), sh = clamp((470 - y) / 220), x = 540 + side * (150 + 118 * sh) , a = 1 - sh; if (a <= 0) continue;
    const col = age < .72 ? mix('#e8b6c0', '#f2a3ab', age / .72) : mix('#f2a3ab', '#a8908a', (age - .72) * 3.5); ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - sh * 60 * (side)); ctx.rotate(sh * side * 1.2); ctx.fillStyle = col; ctx.strokeStyle = '#a84a5c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-side * 0 - 80, -64, 160, 128, 24); ctx.fill(); ctx.stroke(); ctx.fillStyle = mix('#8a4a78', '#4a3040', clamp((age - .72) * 4)); ctx.beginPath(); ctx.ellipse(-side * 20, 0, 26, 36, 0, 0, TAU); ctx.fill();
    if (age > .55 && age < .8) { ctx.fillStyle = 'rgba(248,226,150,.9)'; for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(side * 40, -30 + j * 28, 9, 0, TAU); ctx.fill(); } } ctx.restore(); }
  for (const side of [-1, 1]) { const cyc = (s * .5) % 1, sy = 1900; for (const d of [-1, 1]) { ctx.fillStyle = '#f0b0ba'; ctx.strokeStyle = '#a84a5c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(540 + side * 150, sy + d * cyc * 56, 70 - cyc * 8, 50, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#8a4a78'; ctx.beginPath(); ctx.ellipse(540 + side * 150, sy + d * cyc * 56, 26, 26, 0, 0, TAU); ctx.fill(); } }
  const A = RN(3); for (let i = 0; i < 16; i++) { const ph = (s * .3 + A()) % 1; dropAt(430 + A() * 220, lerp(100, 1800, ph), 14, .7); }
}
function fingers(u, s) {
  skinBase(); ctx.fillStyle = 'rgba(232,206,192,' + (.3 * u) + ')'; ctx.fillRect(-2200, -2200, 5600, 6600);
  for (let i = -3; i < 20; i++) { const y = i * 130 + Math.sin(i) * 20, a = clamp(u * 1.4 - ((i + 3) % 5) * .08), pts = []; for (let x = -400; x <= 1500; x += 60) pts.push([x, y + Math.sin(x * .012 + i * 1.3) * 34 + Math.sin(x * .03 + i) * 10]);
    ctx.save(); ctx.globalAlpha = a; tube(pts.map(p => [p[0], p[1] + 12]), 18, 'rgba(255,235,220,.4)'); tube(pts, 20, 'rgba(110,60,48,.55)'); tube(pts.map(p => [p[0], p[1] - 10]), 8, 'rgba(255,240,225,.5)'); ctx.restore(); }
  const R = RN(2); for (let i = 0; i < 40; i++) { const x = R() * 1300 - 100, y = R() * 2000 - 50 + ((s * 30 * R()) % 60), r = 14 + R() * 38; const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.7, 'rgba(180,215,235,.25)'); g.addColorStop(1, 'rgba(120,170,210,.35)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
}
const SEG = [
  { t: 0, fn: stomach, o: {}, cam: [520, 900, .85, 400, 1050, 1.25, 0, -.03], mag: [1, 6] },
  { t: 3.0, fn: lin, o: { mucus: 0, rate: 30 }, cam: [540, 1000, .9, 540, 1150, 1.4, -.02, .02], mag: [6, 200], q: true },
  { t: 5.4, fn: pit, o: {}, cam: [540, 1400, 1.0, 540, 700, 1.2, 0, .04], mag: [200, 500], tag: ['HYDROCHLORIC ACID', 'parietal cells make it'] },
  { t: 8.2, fn: acidSea, o: {}, cam: [540, 960, 1.0, 540, 960, 1.5, 0, .06], mag: [500, 900], tag: ['EXTREME ACIDITY', 'pH 1.5 – 3.5'] },
  { t: 10.6, fn: protein, o: {}, cam: [540, 960, 1.25, 540, 960, .9, -.03, .03], mag: [900, 1200], tag: ['DIGESTION', 'food proteins are broken down'] },
  { t: 12.8, fn: microbes, o: {}, cam: [540, 960, 1.0, 540, 960, 1.4, -.05, .05], mag: [1200, 1500], tag: ['DEFENCE', 'acid destroys harmful microbes'] },
  { t: 15.4, fn: lin, o: { mucus: 1, rate: 30 }, cam: [540, 1000, 1.7, 540, 1000, .75, 0, 0], mag: [800, 30], big: ['BUT HERE\'S THE', 'INCREDIBLE PART!'] },
  { t: 17.7, fn: lin, o: { mucus: 1, junc: false, labels: true, rate: 24 }, cam: [540, 1120, .68, 540, 1180, 1.05, 0, 0], mag: [30, 200], },
  { t: 20.5, fn: lin, o: { mucus: 1, granules: true, rate: 24 }, cam: [540, 1180, 2.1, 540, 1040, 1.4, .02, -.02], mag: [400, 1000], tag: ['DEFENCE 1 · MUCUS', 'special cells release a gel layer'] },
  { t: 23.5, fn: lin, o: { mucus: 1, bic: true, rate: 30 }, cam: [500, 1000, 1.4, 560, 1070, 2.0, 0, .03], mag: [1000, 2000], tag: ['DEFENCE 1 · MUCUS', 'bicarbonate neutralizes acid'] },
  { t: 26.0, fn: lin, o: { mucus: 1, bic: true, ph: true, rate: 30 }, cam: [540, 1090, 1.3, 540, 1190, 1.9, .03, -.02], mag: [2000, 1200], tag: ['DEFENCE 1 · MUCUS', 'pH 2 at the top → pH 7 at the cells'] },
  { t: 29.0, fn: lin, o: { mucus: 1, bic: true, bounce: true, rate: 36 }, cam: [540, 1000, .9, 540, 1100, 1.25, 0, 0], mag: [400, 150], tag: ['PROTECTIVE BARRIER', 'acid never reaches the cells'] },
  { t: 31.5, fn: lin, o: { mucus: 1, bic: true, bounce: true, rate: 36 }, cam: [540, 1250, 1.9, 540, 1250, 1.3, .12, .06], mag: [900, 500], tag: ['PROTECTIVE BARRIER', 'the cells stay safe'] },
  { t: 34.0, fn: lin, o: { mucus: .5, rate: 24 }, cam: [540, 1150, 1.8, 540, 1100, .75, 0, 0], mag: [500, 40], big: ['BUT THAT\'S', 'NOT ALL!'] },
  { t: 35.4, fn: lin, o: { mucus: .2, junc: true, rate: 22 }, cam: [540, 1230, 2.7, 560, 1230, 3.3, 0, .02], mag: [2000, 4000], tag: ['DEFENCE 2 · TIGHT JUNCTIONS', 'cells locked together'] },
  { t: 38.2, fn: lin, o: { mucus: .2, junc: true, rate: 26 }, cam: [620, 1150, 3.0, 480, 1200, 2.3, .05, -.05], mag: [4000, 2500], tag: ['DEFENCE 2 · TIGHT JUNCTIONS', 'no acid leaks between cells'] },
  { t: 40.8, fn: renew, o: {}, cam: [540, 1400, 1.0, 540, 900, 1.25, 0, .03], mag: [300, 700], tag: ['DEFENCE 3 · RENEWAL', 'stem cells make new cells'] },
  { t: 43.5, fn: renew, o: {}, cam: [540, 600, 1.5, 540, 520, 1.8, -.03, .03], mag: [700, 1200], tag: ['DEFENCE 3 · RENEWAL', 'damaged surface cells are replaced'] },
  { t: 46.2, fn: lin, o: { mucus: 0, damage: u => clamp(u * 1.3), rate: 40 }, cam: [540, 1200, 1.5, 540, 1260, 2.0, 0, .03], mag: [800, 1500], tag: ['WITHOUT DEFENCE', 'acid burns into the lining'] },
  { t: 49.0, fn: stomach, o: { red: 1 }, cam: [520, 950, 1.0, 400, 1100, 1.6, 0, -.04], mag: [1, 30], big2: ['YOUR BIGGEST ENEMY', 'unprotected stomach lining'] },
  { t: 52.2, fn: fingers, o: {}, cam: [540, 1000, 1.0, 560, 980, 1.6, 0, .03], mag: [1, 20], big2: ['WHY DO FINGERS', 'WRINKLE IN WATER?'] },
  { t: 55.4, fn: vessel, o: { mode: 'flow', seed: 9 }, cam: [540, 960, 1.0, 540, 960, 1.3, 0, .1], mag: [100, 400], big2: ['WANT THE ANSWER?', 'WATCH OUR NEXT VIDEO'] },
  { t: 58.3, fn: vessel, o: { mode: 'flow', seed: 13 }, cam: [540, 960, 1.3, 540, 960, .85, .1, .2], mag: [400, 20], cta: 2 },
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
  if (sg.big2) { const k = eo(clamp(s / .4)); ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 500 + (1 - k) * -40); txt(sg.big2[0], 0, 0, 96, '#fff', '#000', 14, '400', 'Anton'); ctx.font = '800 36px Montserrat'; ctx.fillStyle = '#ffd23f'; ctx.fillText(sg.big2[1], 0, 56); ctx.restore(); }
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
