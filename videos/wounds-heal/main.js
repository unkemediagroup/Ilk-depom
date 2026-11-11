// "How Do Our Wounds Actually Heal?" — anatomical micro-world, drawn in code (Canvas 2D), 1080×1920, 30 fps.
const cv = document.getElementById('c'), ctx = cv.getContext('2d'), W = 1080, H = 1920;
window.DUR = 42.03;
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

// ---------------- scenes ----------------
function skinScene(u, s, o) {
  skinBase(); if (o.cut === 'live') { const open = clamp(s / .28); groove(open, 0, 0, s);
    if (o.cut === 'live' && s < .38) { const t = clamp(s / .28), p = GP(t); const g = ctx.createLinearGradient(p[0] - 160, p[1] - 90, p[0] + 160, p[1] + 90); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(235,245,255,' + (.95 * (1 - s / .38)) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - 220, p[1] - 150, 440, 300); } }
  if (o.heal !== undefined) groove(1, o.heal(u), o.scar ? o.scar(u) : 0, s + 2);
}
function crossSection(u, s, o) {
  const clot = o.clot(u), cx = 540, topY = 520;
  let g = ctx.createLinearGradient(0, 0, 0, 2000); g.addColorStop(0, '#d89aa0'); g.addColorStop(.45, '#bd6670'); g.addColorStop(1, '#8e4150'); ctx.fillStyle = g; ctx.fillRect(-2200, -1500, 5600, 6000);
  const R = RN(31); for (let i = 0; i < 40; i++) tube(wavy(R() * 2400 - 600, 700 + R() * 700, R() * .4 - .2, 500 + R() * 500, 14, 5), 7, 'rgba(244,226,190,.45)');
  for (let i = 0; i < 40; i++) { const x = R() * 2600 - 700, y = 1450 + R() * 500, r = 38 + R() * 24; ctx.fillStyle = '#efd89a'; ctx.strokeStyle = 'rgba(200,150,80,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); }  // fat
  g = ctx.createLinearGradient(0, topY, 0, topY + 150); g.addColorStop(0, '#d6a68a'); g.addColorStop(.4, '#e8b4a0'); g.addColorStop(1, '#e19d98'); ctx.fillStyle = g; ctx.fillRect(-2200, topY, 5600, 150);
  ctx.fillStyle = '#b98768'; ctx.fillRect(-2200, topY - 26, 5600, 26);
  for (const vx of [-120, 220, 880, 1220]) { ctx.fillStyle = '#e5aaa3'; ctx.beginPath(); ctx.arc(vx, 1000, 70, 0, TAU); ctx.fill(); ctx.fillStyle = '#9a0f1a'; ctx.beginPath(); ctx.arc(vx, 1000, 52, 0, TAU); ctx.fill(); for (let i = 0; i < 5; i++) rbc(vx + Math.cos(i * 1.7 + s) * 24, 1000 + Math.sin(i * 2.3) * 22, 14, i, .6, 1); }
  // wedge gap
  ctx.beginPath(); ctx.moveTo(cx - 130, topY - 26); ctx.lineTo(cx + 130, topY - 26); ctx.lineTo(cx + 46, 1060); ctx.lineTo(cx - 46, 1060); ctx.closePath();
  const bl = ctx.createLinearGradient(0, topY, 0, 1060); bl.addColorStop(0, mix('#c4121d', '#3a0a10', clot)); bl.addColorStop(1, mix('#8c0e18', '#52121a', clot)); ctx.fillStyle = bl; ctx.fill();
  ctx.strokeStyle = '#e9a493'; ctx.lineWidth = 6; ctx.stroke();
  if (clot > .3) { ctx.fillStyle = '#2e080d'; ctx.beginPath(); ctx.ellipse(cx, topY - 30, 150, 36 * clot, 0, Math.PI, TAU); ctx.fill(); }
  const Q = RN(77); for (let i = 0; i < 26; i++) { const ph = (s * .35 + Q() * 3) % 1, x = cx + (Q() - .5) * 120 * (1 - ph * .3), y = lerp(1000, topY - 20, ph); rbc(x, y, 13, i + s, .6, 1 - clot, (1 - clot) * (1 - ph * .5)); }
  const lab = (t, x, y, tx, ty, k) => { if (u < k) return; const a = clamp((u - k) * 6); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = '800 34px Montserrat'; ctx.textAlign = 'left'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.strokeText(t, tx + 8, ty + 12); ctx.fillText(t, tx + 8, ty + 12); ctx.restore(); };
  if (!o.nolab) { lab('EPIDERMIS', 440, topY + 70, 700, topY + 120, .1); lab('DERMIS', 330, 800, 700, 830, .25); lab('WOUND', 540, 900, 640, 960, .4); }
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
function inflam(u, s) {
  tissueBG(11); const yy = y => y;
  tube([[40, -300], [40, 2300]], 230, '#e7a9a2'); tube([[40, -300], [40, 2300]], 176, '#8a0e18'); const R = RN(4);
  for (let i = 0; i < 16; i++) rbc(50 + (R() - .5) * 90, ((R() * 2600 - 300 - 200 * s) % 2600 + 2600) % 2600 - 300, 32, i + s * 2, .6, 1);
  const B = RN(19), nb = 10 + Math.floor(clamp(s / 2) * 8);                          // bacteria multiply
  const bpos = []; for (let i = 0; i < 18; i++) bpos.push([760 + (B() - .5) * 280, 1080 + (B() - .5) * 300, B() * TAU]);
  for (let i = 0; i < nb; i++) { const b = bpos[i]; bact(b[0] + Math.sin(s * 3 + i) * 6, b[1] + Math.cos(s * 2.6 + i * 2) * 6, 52, b[2] + Math.sin(s * 2 + i) * .3); }
  for (let i = 0; i < 26; i++) { const ph = (s * .6 + i * .13) % 1; ctx.fillStyle = 'rgba(200,220,100,' + (.55 * (1 - ph)) + ')'; ctx.beginPath(); ctx.arc(lerp(700, 150, ph) + Math.sin(i * 3) * 40, lerp(1080, 700 + (i % 5) * 120, ph) + Math.cos(i * 2) * 30, 6, 0, TAU); ctx.fill(); }
  const N = RN(23); for (let i = 0; i < 6; i++) { const y0 = 500 + i * 230, d = i * .28, k = eio(clamp((s - d) / 1.9)), tx = 640 + N() * 120, ty = 980 + (i - 2.5) * 70 + N() * 40;
    const x = lerp(60, tx, k) + Math.sin(s * 4 + i) * 6 * k, y = lerp(y0, ty, k) + Math.cos(s * 3 + i) * 5 * k, sq = 1 + .5 * Math.exp(-Math.pow((k - .12) / .1, 2)); neutro(x, y, 52, sq); }
}
function phago(u, s, o) {
  tissueBG(o.bg || 27, .7); const R = RN(o.seed || 6);
  const cells = o.cells; for (const [cx0, cy0, rad] of cells) {
    const cx = cx0 + Math.sin(s * .9 + cx0) * 14, cy = cy0 + Math.cos(s * .8 + cy0) * 12, tg = []; const nT = o.n;
    for (let i = 0; i < nT; i++) { const a = R() * TAU, d = rad * (1.6 + R() * .8), te = .35 + i * (o.span / nT) + R() * .2; tg.push({ a, d, te, sz: o.kind === 'bact' ? 54 : 26 + R() * 24, rot: R() * TAU }); }
    const pods = tg.map(t => { const k = clamp((s - t.te + .7) / .7) * (1 - clamp((s - t.te - .5) / .5)); return [t.a, .55 * k]; });
    const gg = ctx.createRadialGradient(cx - rad * .3, cy - rad * .3, rad * .1, cx, cy, rad * 1.2); gg.addColorStop(0, '#f6e8de'); gg.addColorStop(.7, '#d6b9ae'); gg.addColorStop(1, '#a07e78');
    for (const t of tg) { const k = eio(clamp((s - t.te) / .65)); if (k >= 1) continue; const px = lerp(cx + Math.cos(t.a) * t.d, cx + Math.cos(t.a) * rad * .35, k), py = lerp(cy + Math.sin(t.a) * t.d, cy + Math.sin(t.a) * rad * .35, k); if (k < .5) o.kind === 'bact' ? bact(px + Math.sin(s * 6) * 4, py, t.sz, t.rot + Math.sin(s * 3) * .3) : deb(px, py, t.sz, t.rot); }
    blob(cx, cy, rad, s, .07, pods); ctx.fillStyle = gg; ctx.fill(); ctx.strokeStyle = 'rgba(120,80,76,.75)'; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = '#7c5a8d'; ctx.beginPath(); ctx.ellipse(cx - rad * .15, cy + rad * .1, rad * .34, rad * .24, .5, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(190,150,160,.5)'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(cx + Math.cos(i * 2.4) * rad * .55, cy + Math.sin(i * 1.9) * rad * .5, rad * .06, 0, TAU); ctx.fill(); }
    for (const t of tg) { const k = clamp((s - t.te) / .65); if (k < .5) continue; const dig = clamp((s - t.te - .5) / 1.4), vx = cx + Math.cos(t.a) * rad * .4, vy = cy + Math.sin(t.a) * rad * .4, vr = (t.sz * .6 + 14) * (1 - dig * .6); if (dig >= 1) continue;
      ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(vx, vy, vr, 0, TAU); ctx.fill(); ctx.stroke(); ctx.save(); ctx.globalAlpha = 1 - dig; o.kind === 'bact' ? bact(vx, vy, t.sz * .8, t.rot, dig) : deb(vx, vy, t.sz * .6, t.rot); ctx.restore(); }
  }
}
function deb(x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#6f5a4a'; ctx.strokeStyle = '#3f3026'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 7; i++) { const a = i / 7 * TAU, rr = r * (.7 + .5 * Math.abs(Math.sin(i * 5.1))); i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function fibro(u, s) {
  tissueBG(23, .35); const F = [[260, 760, .5, 0], [820, 1000, -.3, .3], [420, 1320, -.6, .6], [880, 1500, .4, .9], [560, 540, -.2, 1.2]];
  F.forEach(([x, y, a, d], i) => { const k = eo(clamp((s - d * .5) / .9)), pc = clamp((s - d * .5 - .5) / 1.6), ex = x + (i % 2 ? 300 : -300) * (1 - k);
    for (let j = 0; j < 4; j++) { const an = a + (j - 1.5) * .7 + Math.PI * (j > 1 ? 1 : 0) * 0, pts = wavy(ex, y, a + (j - 1.5) * .8, 420 + j * 60, 22, 5).slice(0, 2 + Math.floor(pc * 23)); tube(pts, 14, 'rgba(236,214,170,.95)'); tube(pts, 5, 'rgba(255,250,235,.9)'); }
    ctx.save(); ctx.translate(ex, y); ctx.rotate(a + .2 + Math.sin(s * 1.5 + i) * .05); const g = ctx.createLinearGradient(0, -50, 0, 50); g.addColorStop(0, '#f1cbbb'); g.addColorStop(1, '#c58a7e'); ctx.fillStyle = g; ctx.strokeStyle = 'rgba(110,60,60,.7)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-190, 0); ctx.bezierCurveTo(-90, -62, 90, -62, 190, 0); ctx.bezierCurveTo(90, 62, -90, 62, -190, 0); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#8b5a7e'; ctx.beginPath(); ctx.ellipse(0, 0, 62, 32, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#d7b8cf'; ctx.beginPath(); ctx.arc(-8, 4, 10, 0, TAU); ctx.fill(); ctx.restore(); });
}
function angio(u, s) {
  tissueBG(35, .6); const P = t => { const m = 1 - t; return [m * m * 500 + 2 * m * t * 380 + t * t * 700, m * m * 1750 + 2 * m * t * 1000 + t * t * 380]; }, P2 = t => { const m = 1 - t; return [m * m * 620 + 2 * m * t * 900 + t * t * 880, m * m * 1500 + 2 * m * t * 1100 + t * t * 760]; };
  tube([[-300, 1760], [1400, 1760]], 190, '#ecb0a8'); tube([[-300, 1760], [1400, 1760]], 140, '#a30f1a'); const R = RN(2); for (let i = 0; i < 12; i++) rbc(((R() * 1700 + 220 * s) % 1700) - 300, 1760 + (R() - .5) * 80, 32, i + s, .6, 1);
  const sprout = (f, p, w, ts) => { const pr = clamp(eio(clamp((s - ts) / 1.6))), n = Math.floor(pr * 40); if (n < 2) return; const pts = []; for (let i = 0; i <= n; i++) pts.push(f(i / 40)); tube(pts, w + 44, '#f0b9b1'); tube(pts, w, mix('#b8808a', '#bd1520', clamp((pr - .2) * 1.3)));
    if (pr > .3) { const Q = RN(3); for (let i = 0; i < 5; i++) { const t = ((s * .35 + i / 5) % 1) * pr, q = f(t); rbc(q[0], q[1], 26, t * 20, .6, 1); } }
    const hd = f(n / 40); ctx.fillStyle = '#d9a0b8'; ctx.strokeStyle = '#8a4a6a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(hd[0], hd[1], 38, 30, 0, 0, TAU); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .5 + Math.sin(s * 3 + i) * .2; ctx.strokeStyle = 'rgba(210,150,180,.9)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hd[0], hd[1]); ctx.lineTo(hd[0] + Math.cos(a) * 80, hd[1] + Math.sin(a) * 80); ctx.stroke(); } };
  sprout(P, 70, 70, .05); sprout(P2, 56, 56, .7);
}
function stomach(u, s) {
  ctx.fillStyle = '#12070a'; ctx.fillRect(-2200, -2200, 5600, 6600); const g = ctx.createRadialGradient(540, 950, 100, 540, 950, 1100); g.addColorStop(0, 'rgba(120,30,40,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const body = () => { ctx.beginPath(); ctx.moveTo(430, 560); ctx.bezierCurveTo(300, 640, 230, 900, 300, 1200); ctx.bezierCurveTo(360, 1520, 640, 1620, 800, 1450); ctx.bezierCurveTo(900, 1340, 850, 1200, 760, 1190); ctx.bezierCurveTo(700, 1185, 620, 1230, 560, 1130); ctx.bezierCurveTo(500, 1000, 540, 800, 560, 560); ctx.closePath(); };
  tube([[470, 200], [495, 600]], 96, '#c9766f'); tube([[780, 1330], [1000, 1380], [1200, 1330]], 80, '#c9766f');
  body(); const sg = ctx.createLinearGradient(250, 600, 850, 1500); sg.addColorStop(0, '#e29a8e'); sg.addColorStop(.5, '#cf7870'); sg.addColorStop(1, '#a24850'); ctx.fillStyle = sg; ctx.fill(); ctx.strokeStyle = '#7e3238'; ctx.lineWidth = 6; ctx.stroke();
  ctx.save(); body(); ctx.clip(); for (let i = 0; i < 14; i++) { const p = wavy(240, 640 + i * 70, .6 + Math.sin(i) * .15, 760, 20, 6); tube(p, 9, 'rgba(255,200,190,.28)'); tube(p.map(q => [q[0] + 3, q[1] + 8]), 5, 'rgba(110,30,40,.35)'); }
  for (let i = 0; i < 7; i++) tube(wavy(300 + i * 40, 650, 1.1 + i * .05, 780, 16, 4), 6, 'rgba(190,30,40,.8)'); ctx.restore();
  const hl = ctx.createRadialGradient(400, 900, 20, 400, 900, 380); hl.addColorStop(0, 'rgba(255,235,225,.35)'); hl.addColorStop(1, 'rgba(255,235,225,0)'); body(); ctx.fillStyle = hl; ctx.fill();
}
function lining(u, s) {
  const g = ctx.createLinearGradient(0, 0, 0, 1000); g.addColorStop(0, '#1d1209'); g.addColorStop(1, '#4a3b16'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 3200);
  const mg = ctx.createLinearGradient(0, 880, 0, 1180); mg.addColorStop(0, 'rgba(250,236,170,.35)'); mg.addColorStop(.4, 'rgba(244,226,160,.78)'); mg.addColorStop(1, 'rgba(236,205,130,.9)'); ctx.fillStyle = mg; ctx.fillRect(-2200, 880, 5600, 300);
  const M = RN(14); for (let i = 0; i < 40; i++) tube(wavy(M() * 2000 - 400, 900 + M() * 260, M() * .6 - .3, 200 + M() * 200, 10, 4), 3, 'rgba(255,248,215,.45)');
  ctx.fillStyle = '#c4616f'; ctx.fillRect(-2200, 1180, 5600, 1500); for (let x = -480; x < 1700; x += 92) { const g2 = ctx.createLinearGradient(x, 1180, x + 80, 1180); g2.addColorStop(0, '#f2a3ab'); g2.addColorStop(1, '#d97a87'); ctx.fillStyle = g2; ctx.strokeStyle = '#a84a5c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x, 1180, 84, 230, [18, 18, 4, 4]); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#8a4a78'; ctx.beginPath(); ctx.ellipse(x + 42, 1340, 20, 34, 0, 0, TAU); ctx.fill(); }
  const A = RN(88); for (let i = 0; i < 44; i++) { const x = A() * 1500 - 200, sp = 240 + A() * 160, y = -100 + ((A() * 1000 + sp * s) % 1100), fade = y < 880 ? 1 : clamp(1 - (y - 880) / 200), r = 18 + A() * 14; if (fade <= 0) continue;
    const gl = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4); gl.addColorStop(0, 'rgba(225,240,120,' + .6 * fade + ')'); gl.addColorStop(1, 'rgba(225,240,120,0)'); ctx.fillStyle = gl; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); ctx.fillStyle = 'rgba(235,248,150,' + .9 * fade + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
}

// ---------------- timeline ----------------
const CH = (a) => a;
const SEG = [
  { t: 0, fn: skinScene, o: {}, cam: [540, 1000, 1.0, 560, 960, 2.3, 0, .05], mag: [1, 12] },
  { t: 2.9, fn: skinScene, o: { cut: 'live' }, cam: [540, 980, 2.2, 520, 980, 1.5, .05, -.03], mag: [12, 25] },
  { t: 5.3, fn: crossSection, o: { clot: u => 0 }, cam: [540, 800, 1.0, 540, 1000, 2.7, 0, 0], mag: [25, 150] },
  { t: 8.0, fn: vessel, o: { mode: 'plug', seed: 3 }, cam: [540, 860, 1.4, 540, 780, 1.9, 0, -.06], mag: [150, 400], tag: ['1 · HEMOSTASIS', 'platelets plug the leak'] },
  { t: 10.4, fn: vessel, o: { mode: 'fibrin', seed: 5 }, cam: [520, 780, 1.9, 540, 900, 1.2, -.05, .04], mag: [400, 600], tag: ['1 · HEMOSTASIS', 'fibrin mesh seals the clot'] },
  { t: 13.0, fn: inflam, o: {}, cam: [480, 980, 1.0, 700, 1040, 1.5, 0, .03], mag: [200, 800], tag: ['2 · INFLAMMATION', 'immune cells rush in'] },
  { t: 15.8, fn: phago, o: { cells: [[540, 960, 190]], n: 6, span: 1.8, kind: 'bact' }, cam: [540, 960, 1.0, 540, 960, 1.45, .02, -.03], mag: [800, 1500], tag: ['2 · INFLAMMATION', 'macrophages eat the germs'] },
  { t: 18.2, fn: phago, o: { cells: [[330, 760, 130], [760, 1060, 150], [440, 1420, 120]], n: 5, span: 1.3, kind: 'deb', seed: 17, bg: 29 }, cam: [540, 1000, 1.4, 540, 1080, .85, .06, -.04], mag: [1500, 600], tag: ['2 · INFLAMMATION', 'clearing damaged cells'] },
  { t: 19.9, fn: crossSection, o: { clot: u => 1, nolab: 1 }, cam: [540, 880, 2.0, 540, 900, .78, 0, 0], mag: [600, 40], big: 'BUT THAT\'S NOT ALL!' },
  { t: 21.4, fn: fibro, o: {}, cam: [540, 960, .9, 640, 900, 1.35, -.03, .03], mag: [200, 1000], tag: ['3 · PROLIFERATION', 'fibroblasts build collagen'] },
  { t: 24.0, fn: angio, o: {}, cam: [600, 1350, 1.0, 620, 820, 1.35, .03, -.03], mag: [300, 900], tag: ['3 · PROLIFERATION', 'new blood vessels sprout'] },
  { t: 26.2, fn: skinScene, o: { cut: 'done', heal: u => eio(u) }, cam: [540, 980, 2.0, 600, 1010, 1.55, -.03, .02], mag: [30, 20], tag: ['3 · PROLIFERATION', 'new skin closes the gap'] },
  { t: 28.2, fn: skinScene, o: { cut: 'done', heal: u => 1, scar: u => eio(u) }, cam: [560, 1000, 1.6, 540, 980, .6, .02, .1], mag: [30, 1], tag: ['4 · REMODELLING', 'the scar matures and fades'] },
  { t: 30.9, fn: stomach, o: {}, cam: [520, 900, .85, 360, 1160, 2.0, 0, -.04], mag: [1, 40], big2: 'STOMACH ACID?' },
  { t: 33.6, fn: lining, o: {}, cam: [540, 1000, 1.0, 540, 1100, 1.35, -.02, .02], mag: [200, 600], q: true },
  { t: 36.4, fn: vessel, o: { mode: 'flow', seed: 9 }, cam: [540, 960, 1.0, 540, 960, 1.3, 0, .12], mag: [100, 400], cta: 1 },
  { t: 39.2, fn: vessel, o: { mode: 'flow', seed: 13 }, cam: [540, 960, 1.3, 540, 960, .85, .12, .2], mag: [400, 20], cta: 2 },
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
  if (sg.big) { const k = eo(clamp(s / .25)), pop = 1 + .5 * (1 - k); ctx.save(); ctx.translate(W / 2, 880); ctx.rotate(-.04); ctx.scale(pop, pop); txt('BUT THAT\'S', 0, -30, 130, '#fff', '#8c0e18', 24, '400', 'Anton'); txt('NOT ALL!', 0, 110, 170, '#ffd23f', '#8c0e18', 28, '400', 'Anton'); ctx.restore(); }
  if (sg.big2) { const k = eo(clamp(s / .4)); ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 330 + (1 - k) * -40); txt('STOMACH ACID', 0, 0, 96, '#fff', '#000', 14, '400', 'Anton'); ctx.font = '800 36px Montserrat'; ctx.fillStyle = '#ffd23f'; ctx.fillText('pH 1.5 – 3.5', 0, 56); ctx.restore(); }
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
