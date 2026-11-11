// "How Do Our Wounds Actually Heal?" — anatomical micro-world, drawn in code (Canvas 2D), 1080×1920, 30 fps.
const cv = document.getElementById('c'), ctx = cv.getContext('2d'), W = 1080, H = 1920;
window.DUR = 40.83;
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
function fingers(u, s) {
  skinBase(); ctx.fillStyle = 'rgba(232,206,192,' + (.3 * u) + ')'; ctx.fillRect(-2200, -2200, 5600, 6600);
  for (let i = -3; i < 20; i++) { const y = i * 130 + Math.sin(i) * 20, a = clamp(u * 1.4 - ((i + 3) % 5) * .08), pts = []; for (let x = -400; x <= 1500; x += 60) pts.push([x, y + Math.sin(x * .012 + i * 1.3) * 34 + Math.sin(x * .03 + i) * 10]);
    ctx.save(); ctx.globalAlpha = a; tube(pts.map(p => [p[0], p[1] + 12]), 18, 'rgba(255,235,220,.4)'); tube(pts, 20, 'rgba(110,60,48,.55)'); tube(pts.map(p => [p[0], p[1] - 10]), 8, 'rgba(255,240,225,.5)'); ctx.restore(); }
  const R = RN(2); for (let i = 0; i < 40; i++) { const x = R() * 1300 - 100, y = R() * 2000 - 50 + ((s * 30 * R()) % 60), r = 14 + R() * 38; const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.7, 'rgba(180,215,235,.25)'); g.addColorStop(1, 'rgba(120,170,210,.35)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
}
// ---------------- fingers-in-water scenes ----------------
function waterBG(s) {
  const g = ctx.createLinearGradient(0, -400, 0, 2400); g.addColorStop(0, '#2c6f80'); g.addColorStop(.5, '#174a5a'); g.addColorStop(1, '#0a2733'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  for (let i = 0; i < 18; i++) { const p = []; for (let x = -600; x <= 1700; x += 50) p.push([x, i * 150 - 300 + Math.sin(x * .008 + s * 1.3 + i) * 40 + Math.sin(x * .021 - s * 2 + i * 2) * 14]); tube(p, 6 + (i % 3) * 3, 'rgba(190,235,245,.09)'); }
  const R = RN(44); for (let i = 0; i < 40; i++) { const x = R() * 1600 - 260 + Math.sin(s * 2 + i) * 12, y = ((R() * 2600 - s * (60 + R() * 120)) % 2600 + 2600) % 2600 - 300, r = 4 + R() * 14; ctx.strokeStyle = 'rgba(220,245,255,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .35, r * .25, 0, TAU); ctx.fill(); }
}
function fingerUnder(u, s, o) {                                                // side profile of a fingertip underwater, pad wrinkling
  waterBG(s); const wr = o.wr(u), cx = 360, cy = 980, R2 = 210;
  const body = () => { ctx.beginPath(); ctx.moveTo(1700, cy - R2); ctx.lineTo(cx + 40, cy - R2); ctx.bezierCurveTo(cx - 200, cy - R2, cx - 230, cy + R2 * 1.05, cx + 60, cy + R2); ctx.lineTo(1700, cy + R2 + 20); ctx.closePath(); };
  body(); let g = ctx.createLinearGradient(0, cy - R2, 0, cy + R2); g.addColorStop(0, '#e2a98a'); g.addColorStop(.55, mix('#d8987a', '#e6c3b2', wr * .6)); g.addColorStop(1, mix('#b77558', '#cfa591', wr * .5)); ctx.fillStyle = g; ctx.fill();
  ctx.save(); body(); ctx.clip();
  ctx.fillStyle = '#f0c6b8'; ctx.beginPath(); ctx.moveTo(cx + 60, cy - R2 + 4); ctx.bezierCurveTo(cx + 120, cy - R2 - 20, cx + 520, cy - R2 - 30, cx + 600, cy - R2 + 6); ctx.lineTo(cx + 600, cy - R2 + 70); ctx.bezierCurveTo(cx + 420, cy - R2 + 76, cx + 160, cy - R2 + 80, cx + 70, cy - R2 + 50); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,240,235,.6)'; ctx.beginPath(); ctx.ellipse(cx + 560, cy - R2 + 40, 40, 26, 0, 0, TAU); ctx.fill();
  for (let i = 0; i < 16; i++) { const x = cx + 20 + i * 42, a = clamp(wr * 1.3 - (i % 4) * .1); ctx.strokeStyle = 'rgba(120,64,48,' + .6 * a + ')'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x + Math.sin(i) * 10, cy + 30); ctx.quadraticCurveTo(x + 24, cy + 120, x - 6 + Math.sin(i * 2) * 14, cy + R2 + 10); ctx.stroke(); ctx.strokeStyle = 'rgba(255,235,222,' + .45 * a + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 9 + Math.sin(i) * 10, cy + 30); ctx.quadraticCurveTo(x + 33, cy + 120, x + 3 + Math.sin(i * 2) * 14, cy + R2 + 10); ctx.stroke(); }
  for (let i = 0; i < 10; i++) { const p = []; for (let x = cx - 200; x <= 1700; x += 40) p.push([x, cy - 200 + i * 44 + Math.sin(x * .01 + s * 1.5 + i) * 18]); tube(p, 10, 'rgba(210,245,255,.08)'); }
  ctx.restore(); const R = RN(12); for (let i = 0; i < 12; i++) { const a = R() * Math.PI + Math.PI / 2, x = cx + 40 + Math.cos(a) * 250 + R() * 400, y = cy + (R() > .5 ? 1 : -1) * (R2 + 8), r = 8 + R() * 10; ctx.strokeStyle = 'rgba(230,250,255,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y + Math.sin(s * 3 + i) * 2, r, 0, TAU); ctx.stroke(); }
}
// skin layer boundaries as functions of x (buckle → surface folds)
function layers(u, s, o) {
  const B = o.buckle ? o.buckle(u) : 0, vc = o.vc ? o.vc(u) : 0, K = .012, surf = x => 520 + B * 70 * Math.sin(x * K * 1.0 - .8), sc = x => surf(x) + 120 + B * 20, ep = x => sc(x) + 150 + 34 * Math.sin(x * .045) + B * 40 * Math.sin(x * K - .8), dE = 1700;
  if (o.water) { const g = ctx.createLinearGradient(0, -400, 0, 600); g.addColorStop(0, '#174a5a'); g.addColorStop(1, '#2c6f80'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 2900); } else { ctx.fillStyle = '#20121a'; ctx.fillRect(-2200, -2200, 5600, 2900); }
  const band = (top, bot, fill) => { ctx.beginPath(); for (let x = -600; x <= 1700; x += 20) ctx.lineTo(x, top(x)); for (let x = 1700; x >= -600; x -= 20) ctx.lineTo(x, bot(x)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  let g = ctx.createLinearGradient(0, 400, 0, 2200); g.addColorStop(0, '#dc9a9a'); g.addColorStop(.6, '#c06a74'); g.addColorStop(1, '#9a4c58'); band(ep, x => 3000, g);
  const Rr = RN(31); ctx.save(); band(ep, x => 3000, 'rgba(0,0,0,0)'); ctx.clip(); for (let i = 0; i < 46; i++) tube(wavy(Rr() * 2400 - 600, 900 + Rr() * 1300, Rr() * .5 - .25, 400 + Rr() * 500, 16, 5), 7, 'rgba(244,226,190,.42)');
  if (o.septa) for (let x = -560; x < 1700; x += 2 * Math.PI / K) { const xx = x + (.8 + Math.PI * 1.5) / K; tube([[xx, ep(xx)], [xx + 10, 1500], [xx - 10, 2200]], 16, 'rgba(250,236,205,.85)'); tube([[xx, ep(xx)], [xx + 10, 1500], [xx - 10, 2200]], 5, 'rgba(255,255,240,.9)'); }
  ctx.restore();
  g = ctx.createLinearGradient(0, 600, 0, 860); g.addColorStop(0, '#eab9a2'); g.addColorStop(1, '#d99a8e'); band(sc, ep, g);
  ctx.save(); band(sc, ep, 'rgba(0,0,0,0)'); ctx.clip(); for (let x = -600, j = 0; x < 1700; x += 46, j++) for (let k = 0; k < 4; k++) { const y = sc(x) + 22 + k * 36 + (j % 2) * 14; ctx.fillStyle = 'rgba(160,80,90,.45)'; ctx.beginPath(); ctx.ellipse(x, y, 9, 7, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(190,120,110,.35)'; ctx.lineWidth = 2; ctx.strokeRect(x - 22, y - 17, 44, 34); } ctx.restore();
  const sw = o.swell ? o.swell(u) : 0; g = ctx.createLinearGradient(0, 400, 0, 660); g.addColorStop(0, mix('#ead2ad', '#f2e6d2', sw)); g.addColorStop(1, mix('#dcb98f', '#e8d4b8', sw)); band(x => surf(x) - sw * 26, sc, g);
  for (let k = 1; k < 9; k++) { const p = []; for (let x = -600; x <= 1700; x += 30) p.push([x, lerp(surf(x) - sw * 26, sc(x), k / 9)]); tube(p, 2, 'rgba(160,120,80,.35)'); }
  if (o.water) { const W2 = RN(66); for (let i = 0; i < 80; i++) { const x = W2() * 2000 - 400, ph = (s * .4 + W2()) % 1, y = lerp(200, surf(x) + 90 * sw, ph), a = ph < .8 ? 1 : (1 - ph) * 5; ctx.fillStyle = 'rgba(170,220,245,' + .85 * a + ')'; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,' + .6 * a + ')'; ctx.beginPath(); ctx.arc(x - 2, y - 2, 2.5, 0, TAU); ctx.fill(); } }
  // capillary loops in dermal papillae + deeper vessel
  for (let x = -560; x < 1700; x += 2 * Math.PI / .045) { const tx = x + Math.PI / 2 / .045 * 3, top = ep(tx) + 30, w = 26 * (1 - vc * .65); tube([[tx - 22, top + 200], [tx - 18, top + 40], [tx, top + 8], [tx + 18, top + 40], [tx + 22, top + 200]], w + 14, '#e7a6a0'); tube([[tx - 22, top + 200], [tx - 18, top + 40], [tx, top + 8], [tx + 18, top + 40], [tx + 22, top + 200]], w, mix('#c8151f', '#7a2a36', vc * .7)); }
  const vy = 1350; tube([[-600, vy], [1700, vy]], 150 * (1 - vc * .5) + 40, '#e3a39c'); tube([[-600, vy], [1700, vy]], 150 * (1 - vc * .5), '#a30f1a'); const Rv = RN(5); for (let i = 0; i < 12; i++) rbc(((Rv() * 2300 + (220 - 150 * vc) * s) % 2300) - 600, vy + (Rv() - .5) * 60 * (1 - vc * .5), 30, i + s, .6, 1);
  if (o.nerve) { const p = []; for (let x = -600; x <= 1700; x += 30) p.push([x, 1080 + Math.sin(x * .006) * 40]); tube(p, 46, '#e9d59c'); tube(p, 30, '#f6e8bf'); for (let i = 0; i < 4; i++) { const ph = (s * .8 + i / 4) % 1, x = lerp(-600, 1700, ph), y = 1080 + Math.sin(x * .006) * 40; const gl = ctx.createRadialGradient(x, y, 0, x, y, 70); gl.addColorStop(0, 'rgba(255,255,230,.95)'); gl.addColorStop(1, 'rgba(255,255,200,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 70, y - 70, 140, 140); } }
  if (o.labels) { ctx.textAlign = 'left'; const L = [['OUTER KERATIN LAYER', 170, surf(170) + 70, .05], ['EPIDERMIS', 170, sc(170) + 90, .2], ['DERMIS', 170, ep(170) + 130, .35]]; for (const [t, x, y, k] of L) { const a = eo(clamp((u - k) * 6)); ctx.save(); ctx.globalAlpha = a; txt(t, x, y, 40, '#fff', 'rgba(0,0,0,.85)', 9); ctx.restore(); } }
}
function nerve(u, s) {                                                         // myelinated sympathetic fibres with travelling impulses
  tissueBG(17, .5); const N = 5;
  for (let i = 0; i < N; i++) { const y0 = 640 + i * 150, p = []; for (let x = -700; x <= 1800; x += 25) p.push([x, y0 + Math.sin(x * .004 + i) * 60]);
    tube(p, 92, 'rgba(240,222,190,.35)'); tube(p, 66, '#ead6a2'); tube(p, 44, '#f7ecca');
    for (let x = -700 + i * 40; x < 1800; x += 220) { const y = y0 + Math.sin(x * .004 + i) * 60; ctx.fillStyle = '#c9a874'; ctx.beginPath(); ctx.ellipse(x, y, 10, 30, 0, 0, TAU); ctx.fill(); }
    for (let k = 0; k < 2; k++) { const ph = (s * .7 + i * .17 + k * .5) % 1, x = lerp(-700, 1800, ph), y = y0 + Math.sin(x * .004 + i) * 60; const gl = ctx.createRadialGradient(x, y, 0, x, y, 110); gl.addColorStop(0, 'rgba(255,255,235,1)'); gl.addColorStop(.3, 'rgba(255,245,190,.7)'); gl.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 110, y - 110, 220, 220); } }
}
function nmj(u, s) {                                                           // nerve terminals on an arteriole: the vessel squeezes
  tissueBG(29, .5); const vc = eio(clamp(u * 1.3 - .1)), cy = 1100, rl = 210 * (1 - vc * .55), wall = 70 + vc * 40;
  ctx.fillStyle = '#c86a74'; ctx.fillRect(-2200, cy - rl - wall, 5600, (rl + wall) * 2);
  for (let x = -700; x < 1800; x += 48) { ctx.fillStyle = '#b4505c'; ctx.beginPath(); ctx.ellipse(x, cy - rl - wall / 2, 20, wall / 2.2, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, cy + rl + wall / 2, 20, wall / 2.2, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#7e3a52'; ctx.beginPath(); ctx.ellipse(x, cy - rl - wall / 2, 6, 14, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, cy + rl + wall / 2, 6, 14, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#f0b6ac'; ctx.fillRect(-2200, cy - rl - 10, 5600, 10); ctx.fillRect(-2200, cy + rl, 5600, 10);
  const g = ctx.createLinearGradient(0, cy - rl, 0, cy + rl); g.addColorStop(0, '#8a0d18'); g.addColorStop(.5, '#b8121d'); g.addColorStop(1, '#7a0b15'); ctx.fillStyle = g; ctx.fillRect(-2200, cy - rl, 5600, rl * 2);
  const R = RN(8); for (let i = 0; i < 26; i++) rbc(((R() * 2400 + (260 - 170 * vc) * s) % 2400) - 650, cy + (R() - .5) * (rl * 2 - 70), 30, i + s * 2, .6, 1);
  const top = cy - rl - wall; for (let b = 0; b < 4; b++) { const x0 = -100 + b * 380, p = [[x0, 200], [x0 + 60, 500], [x0 + 140, top - 10]]; tube(p, 30, '#ead6a2'); tube(p, 18, '#f7ecca');
    for (let k = 0; k < 5; k++) { const x = x0 + 60 + k * 70, y = top - 6; ctx.fillStyle = '#f2dfa8'; ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU); ctx.fill(); tube([[x0 + 140, top - 10], [x, y]], 8, '#f2dfa8');
      for (let j = 0; j < 3; j++) { const ph = (s * 1.4 + j / 3 + k * .2 + b * .1) % 1; ctx.fillStyle = 'rgba(255,248,200,' + (1 - ph) + ')'; ctx.beginPath(); ctx.arc(x + Math.sin(j * 3 + k) * 14, y + ph * 50, 6, 0, TAU); ctx.fill(); } }
    const ph = (s * .9 + b * .25) % 1, q = ph < .5 ? [lerp(x0, x0 + 60, ph * 2), lerp(200, 500, ph * 2)] : [lerp(x0 + 60, x0 + 140, ph * 2 - 1), lerp(500, top, ph * 2 - 1)]; const gl = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 70); gl.addColorStop(0, 'rgba(255,255,230,1)'); gl.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = gl; ctx.fillRect(q[0] - 70, q[1] - 70, 140, 140); }
}
function capNet(u, s) {                                                        // capillary bed beneath the fingertip, seen from above, narrowing
  tissueBG(37, .6); const vc = eio(clamp(u * 1.2)), R = RN(4), paths = [];
  for (let i = 0; i < 9; i++) { const y0 = 200 + i * 200, p = []; for (let x = -600; x <= 1700; x += 40) p.push([x, y0 + Math.sin(x * .007 + i * 1.7) * 70 + Math.sin(x * .02 + i) * 16]); paths.push(p); }
  for (let i = 0; i < 14; i++) { const x = R() * 1500 - 200, y0 = 200 + Math.floor(R() * 8) * 200, p = []; for (let y = y0; y <= y0 + 200; y += 20) p.push([x + Math.sin(y * .03 + i) * 22, y]); paths.push(p); }
  for (const p of paths) tube(p, 58 * (1 - vc * .55) + 16, '#e6a7a0'); for (const p of paths) tube(p, 58 * (1 - vc * .55), mix('#c8151f', '#8c1f2a', vc * .6));
  for (let k = 0; k < 9; k++) { const p = paths[k]; for (let j = 0; j < 6; j++) { const f = ((s * (.25 - .17 * vc) + j / 6 + k * .07) % 1) * (p.length - 1), a = Math.floor(f), b = Math.min(a + 1, p.length - 1), t = f - a; rbc(lerp(p[a][0], p[b][0], t), lerp(p[a][1], p[b][1], t), 22 * (1 - vc * .3), j + s, .6, 1); } }
}
function ring(u, s) {                                                          // arteriole cross-section: smooth-muscle ring contracts
  tissueBG(53, .5); const vc = eio(clamp(u * 1.25)), cx = 540, cy = 960, rl = 300 * (1 - vc * .6), rm = rl + 110 + vc * 60, ra = rm + 70;
  ctx.fillStyle = '#e2b2a2'; ctx.beginPath(); ctx.arc(cx, cy, ra, 0, TAU); ctx.fill();
  ctx.fillStyle = '#b8525e'; ctx.beginPath(); ctx.arc(cx, cy, rm, 0, TAU); ctx.fill();
  for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + s * .05, r = (rm + rl) / 2; ctx.save(); ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = '#c96470'; ctx.beginPath(); ctx.ellipse(0, 0, 54 - vc * 14, (rm - rl) / 2.6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#7e3a56'; ctx.beginPath(); ctx.ellipse(0, 0, 18, 6 + vc * 4, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#f2b8ae'; ctx.beginPath(); ctx.arc(cx, cy, rl + 12, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, rl); g.addColorStop(0, '#c4161f'); g.addColorStop(1, '#7c0b15'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rl, 0, TAU); ctx.fill();
  const R = RN(2); ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, rl, 0, TAU); ctx.clip(); for (let i = 0; i < 16; i++) { const a = R() * TAU, d = R() * 260; rbc(cx + Math.cos(a + s * .3) * d, cy + Math.sin(a + s * .3) * d, 38, i + s, .55 + .4 * Math.abs(Math.sin(s * 2 + i)), 1); } ctx.restore();
  // inward-pointing squeeze arrows
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3, r1 = ra + 120 - 30 * Math.sin(s * 6), r2 = ra + 30; ctx.save(); ctx.globalAlpha = clamp(u * 4) * .9; tube([[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]], 14, '#fff'); ctx.translate(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.rotate(a + Math.PI); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-10, -20); ctx.lineTo(-10, 20); ctx.closePath(); ctx.fill(); ctx.restore(); }
}
function wetTread(x0, y0, w, h, s, kind, off) {                                // contact patch: grooves channel water away
  ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 40); ctx.clip();
  if (kind === 'tire') { ctx.fillStyle = '#2a2a2c'; ctx.fillRect(x0, y0, w, h); for (let y = y0 - 200 + (s * 300) % 120; y < y0 + h + 120; y += 120) { ctx.strokeStyle = '#141416'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(x0 + w / 2, y); ctx.lineTo(x0 - 20, y + 110); ctx.moveTo(x0 + w / 2, y); ctx.lineTo(x0 + w + 20, y + 110); ctx.stroke(); } ctx.fillStyle = '#141416'; ctx.fillRect(x0 + w / 2 - 14, y0, 28, h); }
  else { const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#e6c3b2'); g.addColorStop(1, '#d4a48e'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h); for (let i = 0; i < 9; i++) { const p = []; for (let x = x0 - 20; x <= x0 + w + 20; x += 30) p.push([x, y0 + 40 + i * (h / 9) + Math.sin(x * .02 + i) * 22]); tube(p, 20, 'rgba(118,64,50,.7)'); tube(p.map(q => [q[0], q[1] - 11]), 6, 'rgba(255,238,226,.55)'); } }
  const R = RN(off); for (let i = 0; i < 40; i++) { const lane = Math.floor(R() * 9), ph = (s * .7 + R()) % 1, dir = R() > .5 ? 1 : -1, x = x0 + w / 2 + dir * ph * (w / 2 + 40), y = kind === 'tire' ? y0 + lane * (h / 9) + 40 + ph * 60 : y0 + 40 + lane * (h / 9) + Math.sin(x * .02 + lane) * 22;
    ctx.fillStyle = 'rgba(160,215,240,' + (.9 - ph * .5) + ')'; ctx.beginPath(); ctx.ellipse(x, y, 16 + ph * 10, 8, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(x - 4, y - 3, 3, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function grip(u, s) {                                                          // wrinkled pad pressing a wet surface: water drains through the grooves
  const g = ctx.createLinearGradient(0, 0, 0, 2000); g.addColorStop(0, '#16303a'); g.addColorStop(1, '#0b1a20'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const press = eio(clamp(u * 1.4)), sy = 1330; ctx.fillStyle = '#6f6c68'; ctx.fillRect(-2200, sy, 5600, 1600); const sg = ctx.createLinearGradient(0, sy, 0, sy + 40); sg.addColorStop(0, 'rgba(255,255,255,.35)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(-2200, sy, 5600, 40);
  ctx.fillStyle = 'rgba(120,190,220,.55)'; ctx.fillRect(-2200, sy - 26 * (1 - press * .7), 5600, 26 * (1 - press * .7));
  const lift = 160 * (1 - press), base = sy - 20 - lift, fx = 540, rx = 330, ry = 280, fy = base - 34 - ry + 40;
  const pad = () => { ctx.beginPath(); ctx.moveTo(fx - rx, -400); ctx.lineTo(fx - rx, fy); for (let a = Math.PI; a >= 0; a -= .02) { const x = fx + Math.cos(a) * rx, y0 = fy + Math.sin(a) * ry, flat = Math.min(y0, base - 34), y = flat + (y0 >= base - 34 ? 34 * Math.abs(Math.sin(x * .02)) : 0); ctx.lineTo(x, y); } ctx.lineTo(fx + rx, -400); ctx.closePath(); };
  pad(); const fg = ctx.createLinearGradient(fx - rx, 0, fx + rx, 0); fg.addColorStop(0, '#b97558'); fg.addColorStop(.4, '#e0a689'); fg.addColorStop(1, '#c4825f'); ctx.fillStyle = fg; ctx.fill();
  ctx.save(); pad(); ctx.clip(); const sh = ctx.createLinearGradient(0, base - 200, 0, base); sh.addColorStop(0, 'rgba(232,200,186,0)'); sh.addColorStop(1, 'rgba(232,200,186,.7)'); ctx.fillStyle = sh; ctx.fillRect(-400, base - 200, 1900, 220);
  for (let x = fx - rx; x < fx + rx; x += Math.PI / .02) { const gx = x; tube([[gx, base - 10], [gx + 10, base - 120]], 10, 'rgba(118,64,50,.45)'); } ctx.restore();
  const R = RN(9); for (let i = 0; i < 46; i++) { const k = Math.floor(R() * 22), gx = -400 + (k + .5) * (Math.PI / .02), ph = (s * .9 + R()) % 1, dir = R() > .5 ? 1 : -1; const x = gx + dir * ph * 260 * press + (R() - .5) * 20, y = base - 26 * (1 - ph) - 6; if (Math.abs(x - fx) > rx + 40 && ph < .2) continue; ctx.fillStyle = 'rgba(160,215,245,' + (.95 - ph * .5) * press + ')'; ctx.beginPath(); ctx.ellipse(x, y, 20, 12, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,' + .8 * press + ')'; ctx.beginPath(); ctx.arc(x - 5, y - 4, 4, 0, TAU); ctx.fill(); }
}
function treads(u, s) {                                                        // tire vs fingertip
  const g = ctx.createLinearGradient(0, 0, 0, 2000); g.addColorStop(0, '#1a2b33'); g.addColorStop(1, '#0d171c'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  wetTread(120, 380, 840, 500, s, 'tire', 3); wetTread(120, 920, 840, 440, s, 'pad', 5);
  ctx.textAlign = 'left'; txt('TIRE', 150, 440, 50, '#fff', 'rgba(0,0,0,.85)', 10, '900'); txt('FINGERTIP', 150, 980, 50, '#fff', 'rgba(0,0,0,.85)', 10, '900');
}
function eye(u, s) {                                                           // human eye, tear film glint
  const g = ctx.createLinearGradient(0, 400, 0, 1600); g.addColorStop(0, '#d9a88c'); g.addColorStop(1, '#b98066'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const cx = 540, cy = 960, bl = Math.max(0, Math.sin(clamp((s - 1.3) / .25) * Math.PI)), op = 1 - bl * .95;
  const lid = () => { ctx.beginPath(); ctx.moveTo(40, cy); ctx.bezierCurveTo(260, cy - 330 * op, 820, cy - 330 * op, 1040, cy); ctx.bezierCurveTo(820, cy + 260 * op, 260, cy + 260 * op, 40, cy); ctx.closePath(); };
  ctx.strokeStyle = 'rgba(120,70,55,.6)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(30, cy - 40); ctx.bezierCurveTo(260, cy - 420, 820, cy - 420, 1050, cy - 40); ctx.stroke();
  lid(); const sg = ctx.createRadialGradient(cx, cy, 100, cx, cy, 560); sg.addColorStop(0, '#f6f2ec'); sg.addColorStop(.75, '#ece2da'); sg.addColorStop(1, '#d9a9a0'); ctx.fillStyle = sg; ctx.fill();
  ctx.save(); lid(); ctx.clip(); const R = RN(6); for (let i = 0; i < 14; i++) { const side = i % 2 ? 1 : -1, p = wavy(cx + side * (520 - R() * 60), cy + (R() - .5) * 200, side > 0 ? Math.PI + (R() - .5) * .6 : (R() - .5) * .6, 140 + R() * 120, 10, 5); tube(p, 3, 'rgba(190,40,50,.55)'); }
  const ix = cx + Math.sin(s * .6) * 30, ir = 200; const ig = ctx.createRadialGradient(ix, cy, 40, ix, cy, ir); ig.addColorStop(0, '#a8793e'); ig.addColorStop(.35, '#7a5230'); ig.addColorStop(.85, '#4e3219'); ig.addColorStop(1, '#2a1a0e'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(ix, cy, ir, 0, TAU); ctx.fill();
  for (let i = 0; i < 90; i++) { const a = i / 90 * TAU; ctx.strokeStyle = i % 2 ? 'rgba(200,150,90,.35)' : 'rgba(40,24,12,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ix + Math.cos(a) * 80, cy + Math.sin(a) * 80); ctx.lineTo(ix + Math.cos(a + .05) * (ir - 8), cy + Math.sin(a + .05) * (ir - 8)); ctx.stroke(); }
  ctx.fillStyle = '#060404'; ctx.beginPath(); ctx.arc(ix, cy, 78, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.roundRect(ix - 110, cy - 120, 60, 44, 10); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(ix + 70, cy + 60, 14, 0, TAU); ctx.fill();
  const tf = ctx.createLinearGradient(0, cy - 300, 0, cy + 300); tf.addColorStop(0, 'rgba(255,255,255,.12)'); tf.addColorStop(.5, 'rgba(255,255,255,0)'); tf.addColorStop(1, 'rgba(200,230,255,.18)'); ctx.fillStyle = tf; ctx.fillRect(0, cy - 400, W, 800); ctx.restore();
  lid(); ctx.strokeStyle = '#8c5a4a'; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = 'rgba(230,245,255,.75)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(200, cy + 140 * op); ctx.bezierCurveTo(400, cy + 205 * op, 680, cy + 205 * op, 880, cy + 140 * op); ctx.stroke();
  ctx.strokeStyle = '#2a1a14'; ctx.lineWidth = 6; for (let i = 0; i < 34; i++) { const t = .08 + i / 34 * .84, m = 1 - t, x = m * m * m * 40 + 3 * m * m * t * 260 + 3 * m * t * t * 820 + t * t * t * 1040, y = m * m * m * cy + 3 * m * m * t * (cy - 330 * op) + 3 * m * t * t * (cy - 330 * op) + t * t * t * cy; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + (t - .5) * 60, y - 50, x + (t - .5) * 110, y - 80); ctx.stroke(); }
  const dk = clamp((s - .4) / 1.8); if (dk > 0) { const dx = 890, dy = cy + 150 + dk * 260; const dg = ctx.createRadialGradient(dx - 8, dy - 8, 2, dx, dy, 30); dg.addColorStop(0, 'rgba(255,255,255,.9)'); dg.addColorStop(1, 'rgba(160,210,240,.45)'); ctx.fillStyle = dg; ctx.beginPath(); ctx.moveTo(dx, dy - 50); ctx.quadraticCurveTo(dx + 30, dy, dx, dy + 26); ctx.quadraticCurveTo(dx - 30, dy, dx, dy - 50); ctx.fill(); }
}
const SEG = [
  { t: 0, fn: fingerUnder, o: { wr: u => u * .4 }, cam: [600, 980, .8, 450, 1000, 1.25, -.04, .02], mag: [1, 2] },
  { t: 2.0, fn: fingers, o: {}, cam: [540, 1000, 1.0, 560, 980, 1.6, .03, -.02], mag: [3, 12] },
  { t: 4.2, fn: layers, o: { water: 1, swell: u => u, labels: 1 }, cam: [540, 760, 1.25, 540, 720, 1.6, 0, .02], mag: [40, 150], tag: ['A COMMON MYTH', 'skin just soaks up water?'] },
  { t: 6.2, fn: layers, o: { water: 1, swell: u => 1 }, cam: [540, 700, 2.2, 540, 900, .9, .03, -.02], mag: [300, 60], big: ['IT\'S NOT', 'JUST WATER!'] },
  { t: 8.4, fn: nerve, o: {}, cam: [400, 960, 1.0, 700, 940, 1.35, -.04, .04], mag: [400, 800], tag: ['NERVOUS SYSTEM', 'nerves send a signal'] },
  { t: 11.0, fn: nmj, o: {}, cam: [540, 760, 1.4, 540, 900, 1.0, 0, .03], mag: [800, 600], tag: ['NERVOUS SYSTEM', 'nerve endings reach the vessels'] },
  { t: 13.2, fn: capNet, o: {}, cam: [540, 960, 1.0, 560, 960, 1.4, .05, -.03], mag: [100, 300], tag: ['TINY BLOOD VESSELS', 'just beneath your skin'] },
  { t: 15.4, fn: ring, o: {}, cam: [540, 960, 1.3, 540, 960, 1.0, 0, .08], mag: [800, 1200], tag: ['VASOCONSTRICTION', 'the vessels narrow'] },
  { t: 17.6, fn: layers, o: { vc: u => eio(u), nerve: 1 }, cam: [540, 1150, 1.1, 540, 1100, 1.5, -.02, .02], mag: [200, 300], tag: ['VASOCONSTRICTION', 'less blood, less volume'] },
  { t: 19.7, fn: layers, o: { vc: u => 1, buckle: u => eio(clamp(u * 1.2)), septa: 1 }, cam: [540, 900, .8, 540, 860, 1.1, 0, 0], mag: [40, 60], tag: ['WRINKLES FORM', 'skin folds over the shrinking pad'] },
  { t: 21.5, fn: fingerUnder, o: { wr: u => 1 }, cam: [520, 1000, 1.6, 600, 980, .9, .04, -.03], mag: [4, 1], big: ['BUT HERE\'S THE', 'FASCINATING PART!'] },
  { t: 23.7, fn: grip, o: {}, cam: [540, 1100, .8, 560, 1230, 1.3, 0, .02], mag: [10, 40], tag: ['BETTER GRIP', 'grooves drain away the water'] },
  { t: 26.0, fn: treads, o: {}, cam: [540, 880, 1.05, 540, 880, .95, -.02, 0], mag: [1, 1], tag: ['LIKE TIRE TREADS', 'channels push water out'] },
  { t: 28.5, fn: grip, o: {}, cam: [700, 1250, 1.8, 540, 1100, .85, .05, 0], mag: [60, 10], tag: ['BETTER GRIP', 'more contact on wet objects'] },
  { t: 30.8, fn: eye, o: {}, cam: [540, 960, .85, 560, 940, 1.3, 0, .02], mag: [1, 3], big2: ['WHY ARE OUR EYES', 'ALWAYS WET?'] },
  { t: 33.9, fn: eye, o: {}, cam: [600, 1000, 1.6, 700, 1080, 2.4, .03, -.02], mag: [3, 10], big2: ['WANT THE ANSWER?', 'WATCH OUR NEXT VIDEO'] },
  { t: 36.6, fn: vessel, o: { mode: 'flow', seed: 13 }, cam: [540, 960, 1.3, 540, 960, .85, .1, .2], mag: [400, 20], cta: 2 },
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
