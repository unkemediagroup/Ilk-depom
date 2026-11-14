// 14.video — "What If Parallel Universes Were Real?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 35.0;
const SUBY = 1540;
const MV = '#b06bff', MC = '#4ff0ff', MG = '#ffcf6b';

function you(x, y, s, col = '#0c0a18', o = {}) { ctx.save(); ctx.translate(x, y); if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 30; } ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(0, -s * .88, s * .12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .17, -s * .74, s * .34, s * .44, s * .1); ctx.fill(); ctx.fillRect(-s * .14, -s * .32, s * .11, s * .32); ctx.fillRect(s * .03, -s * .32, s * .11, s * .32);
  ctx.lineWidth = s * .08; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * .16, -s * .68); ctx.lineTo(-s * .24, -s * .38 + (o.arm || 0) * s * .1); ctx.moveTo(s * .16, -s * .68); ctx.lineTo(s * .24, -s * .38 - (o.arm || 0) * s * .3); ctx.stroke(); ctx.restore(); }
function bubbleU(x, y, r, t, hue) { const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, `hsla(${hue},90%,75%,.5)`); g.addColorStop(1, `hsla(${hue},90%,40%,.12)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = `hsla(${hue},90%,75%,.8)`; ctx.lineWidth = 3; ctx.stroke(); const R = RN(hue | 0); for (let i = 0; i < 12; i++) { ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(x + (R() - .5) * r * 1.3, y + (R() - .5) * r * 1.3, 1 + R() * 2.5, 0, TAU); ctx.fill(); } }
function cosmos(t, seed = 1) { space(t, seed, { top: '#06030f', bot: '#140828' }); }

// ---------- S1 0–2.46: aynalanan sen'ler, evren baloncukları ----------
function s1(t) {
  cosmos(t, 3);
  cam({ zoom: 1.1 - .08 * seg(t, 0, 2.4), rot: Math.sin(t * .8) * .03, t, shake: 3 + 8 * seg(t, 1.74, 1.95) * (1 - seg(t, 1.95, 2.4)) }, () => {
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * .5, r = 330 + 40 * Math.sin(t * 2 + i); bubbleU(W / 2 + Math.cos(a) * r, 760 + Math.sin(a) * r * 1.1, 70 + (i % 3) * 20, t, i * 36); }
    const n = 1 + Math.floor(seg(t, .2, 1.8) * 6); for (let k = n - 1; k >= 0; k--) { const off = (k - (n - 1) / 2) * 120; ctx.save(); ctx.globalAlpha = k === Math.floor((n - 1) / 2) ? 1 : .55; you(W / 2 + off, 1020, 380 - Math.abs(off) * .25, `hsl(${260 + k * 25},70%,${k === Math.floor((n - 1) / 2) ? 85 : 55}%)`, { glow: `hsl(${260 + k * 25},90%,60%)` }); ctx.restore(); }
  });
  kinetic(['WHAT', 'IF', 'PARALLEL'], W / 2, 1200, 140, t, 0, { gap: .06 });
  kinetic(['UNIVERSES', 'WERE', 'REAL?'], W / 2, 1360, 120, t, .85, { hl: { 'REAL?': MV } });
  flash(t, 1.74, .15, '176,107,255');
}

// ---------- S2 2.46–7.52: her seçim dallanan bir gerçeklik ----------
function s2(t) {
  cosmos(t, 5);
  const gr = seg(t, 3.0, 6.6);
  cam({ zoom: 1.05 - .1 * gr, y: 120 * gr, t, shake: 2 }, () => {
    // dallanan yol ağacı
    const draw = (x, y, a, len, d, p0) => { const p = clamp(gr * 5 - d * .8); if (p <= 0 || d > 5) return; const ex = x + Math.cos(a) * len * p, ey = y + Math.sin(a) * len * p;
      ctx.strokeStyle = `hsl(${260 - d * 30},90%,${60 + d * 4}%)`; ctx.lineWidth = 18 - d * 2.6; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke(); ctx.shadowBlur = 0;
      if (p >= 1) { if (d === 5) bubbleU(ex, ey, 26, t, d * 50 + x * .3); draw(ex, ey, a - .45, len * .75, d + 1); draw(ex, ey, a + .45, len * .75, d + 1); } };
    draw(W / 2, 1450, -Math.PI / 2, 330, 0);
    // yol ayrımı tabelası
    if (t > 3.42 && t < 4.8) { const k = eback(seg(t, 3.42, 3.7)); ctx.save(); ctx.translate(W / 2, 1150); ctx.scale(k, k); ctx.fillStyle = '#8a5a2a'; ctx.fillRect(-8, -60, 16, 200); ctx.fillStyle = MG; ctx.beginPath(); ctx.moveTo(-200, -120); ctx.lineTo(-20, -120); ctx.lineTo(0, -95); ctx.lineTo(-20, -70); ctx.lineTo(-200, -70); ctx.fill(); ctx.fillStyle = MC; ctx.beginPath(); ctx.moveTo(200, -60); ctx.lineTo(20, -60); ctx.lineTo(0, -35); ctx.lineTo(20, -10); ctx.lineTo(200, -10); ctx.fill();
      txt('A', -110, -95, 40, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('B', 110, -35, 40, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
    you(W / 2, 1460, 220, '#e8e0ff', { glow: MV });
  });
  kinetic(['EVERY', 'SINGLE', 'CHOICE'], W / 2, 200, 140, t, 2.6, { hl: { CHOICE: MG } });
  if (t > 5.22) bigText('ALTERNATE REALITY', W / 2, 360, 110, MV, seg(t, 5.22, 5.5), { glow: MV });
}

// ---------- S3 7.52–11.96: kozmik pencere — sonsuz sen ----------
function s3(t) {
  cosmos(t, 9);
  const op = eio(seg(t, 8.4, 9.2));
  cam({ zoom: 1 + .35 * seg(t, 9.6, 11.9), t, shake: 2 }, () => {
    const cx = W / 2, cy = 820, R = 430;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * op, 0, TAU); ctx.clip(); ctx.fillStyle = '#050010'; ctx.fillRect(0, 0, W, H);
    for (let k = 14; k >= 0; k--) { const d = ((k + (t * 1.5) % 1)), s = 520 * Math.pow(.78, d), a = Math.max(0, 1 - d / 14);
      ctx.strokeStyle = `hsla(${260 + d * 12},90%,65%,${a * .7})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, s * .8, 0, TAU); ctx.stroke();
      ctx.save(); ctx.globalAlpha = a; you(cx, cy + s * .55, s, `hsl(${260 + d * 12},70%,${30 + a * 50}%)`); ctx.restore(); }
    ctx.restore();
    // pencere çerçevesi
    ctx.strokeStyle = MG; ctx.lineWidth = 26; ctx.shadowColor = MG; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(cx, cy, R * op + 6, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .2; ctx.fillStyle = MG; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (R * op + 40), cy + Math.sin(a) * (R * op + 40), 10, 0, TAU); ctx.fill(); }
  });
  kinetic(['COSMIC', 'WINDOW'], W / 2, 200, 150, t, 8.5, { hl: { WINDOW: MG } });
  if (t > 9.86) bigText('INFINITE VERSIONS', W / 2, 1420, 120, MC, seg(t, 9.86, 10.1), { glow: MC });
}

// ---------- S4 11.96–19.46: üç alternatif hayat ----------
function panel(i, t, t0) { const k = eo(seg(t, t0, t0 + .5)); if (k <= 0) return; const y = 280 + i * 410, x = lerp(i % 2 ? W + 600 : -600, W / 2, k);
  ctx.save(); ctx.translate(x, y); ctx.rotate((1 - k) * (i % 2 ? .2 : -.2)); ctx.beginPath(); ctx.roundRect(-470, -180, 940, 360, 36); ctx.save(); ctx.clip();
  if (i === 0) { const g = ctx.createLinearGradient(0, -180, 0, 180); g.addColorStop(0, '#2a1a40'); g.addColorStop(1, '#6a2a6a'); ctx.fillStyle = g; ctx.fillRect(-470, -180, 940, 360);
    for (let k2 = 0; k2 < 6; k2++) { ctx.fillStyle = `hsla(${k2 * 60},90%,60%,.5)`; ctx.beginPath(); ctx.moveTo(-50 + k2 * 40, -180); ctx.lineTo(-200 + k2 * 80 + Math.sin(t * 3 + k2) * 60, 180); ctx.lineTo(-120 + k2 * 80 + Math.sin(t * 3 + k2) * 60, 180); ctx.fill(); }
    you(-40, 170, 300, '#0c0a18', { arm: Math.sin(t * 8) }); ctx.fillStyle = MG; ctx.save(); ctx.translate(30, 40); ctx.rotate(-.6); ctx.beginPath(); ctx.ellipse(0, 30, 50, 34, 0, 0, TAU); ctx.fill(); ctx.fillRect(-6, -120, 12, 130); ctx.restore();
    txt('ROCKSTAR', 300, 0, 70, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: MV }); }
  else if (i === 1) { const g = ctx.createLinearGradient(0, -180, 0, 180); g.addColorStop(0, '#3a1208'); g.addColorStop(1, '#c4512b'); ctx.fillStyle = g; ctx.fillRect(-470, -180, 940, 360);
    ctx.fillStyle = '#f0e0d0'; ctx.beginPath(); ctx.arc(-300, -100, 40, 0, TAU); ctx.fill(); ctx.fillStyle = '#c9d8ff'; ctx.beginPath(); ctx.arc(-200, -130, 22, 0, TAU); ctx.fill();
    ctx.fillStyle = '#8a3418'; ctx.fillRect(-470, 110, 940, 80); ctx.fillStyle = 'rgba(160,250,255,.35)'; ctx.beginPath(); ctx.arc(200, 110, 110, Math.PI, 0); ctx.fill(); ctx.strokeStyle = MC; ctx.lineWidth = 4; ctx.stroke();
    you(-60, 110, 230, '#eef2f8'); txt('MARS', 280, -90, 70, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#ff7a3a' }); }
  else { ctx.fillStyle = '#e8dcc0'; ctx.fillRect(-470, -180, 940, 360); ctx.fillStyle = '#2a1a10'; ctx.fillRect(-430, -150, 860, 8); ctx.fillRect(-430, -60, 860, 4);
    txt('THE DAILY', 0, -110, 50, '#2a1a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('ROME NEVER FELL', 0, 0, fit('ROME NEVER FELL', 100, 820, 'Anton', 400), '#2a1a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
    ctx.fillStyle = '#8a7a6a'; for (let r = 0; r < 3; r++) ctx.fillRect(-430, 70 + r * 30, 860, 10); }
  ctx.restore(); ctx.strokeStyle = [MV, '#ff7a3a', MG][i]; ctx.lineWidth = 10; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 30; ctx.stroke(); ctx.restore(); }
function s4(t) {
  cosmos(t, 12);
  cam({ zoom: 1.02, t, shake: 2 }, () => { panel(0, t, 12.0); panel(1, t, 14.06); panel(2, t, 16.2); });
  const lab = t < 14.06 ? 'DIFFERENT CAREER' : t < 16.2 ? 'ANOTHER PLANET' : 'OPPOSITE HISTORY';
  ctx.save(); ctx.globalAlpha = .95; txt(lab, W / 2, 1440, fit(lab, 110, 960, 'Anton', 400), '#fff', { align: 'center', font: 'Anton', weight: 400, glow: MV }); ctx.restore();
}

// ---------- S5 19.46–24.32: kuantum mekaniği — sayısız dallanan dünya ----------
function s5(t) {
  cosmos(t, 17);
  const br = seg(t, 21.6, 24.0);
  cam({ zoom: 1.03 + .12 * br, t, shake: 2 + 8 * seg(t, 21.1, 21.4) * (1 - seg(t, 21.4, 21.9)) }, () => {
    // dalga fonksiyonu
    ctx.strokeStyle = MC; ctx.lineWidth = 8; ctx.shadowColor = MC; ctx.shadowBlur = 25; ctx.beginPath(); for (let x = 0; x <= W; x += 8) { const u = (x - W / 2) / 300; ctx.lineTo(x, 520 + Math.exp(-u * u) * Math.sin(x * .05 - t * 8) * 150); } ctx.stroke(); ctx.shadowBlur = 0;
    // parçacık ikiye, dörde, sekize bölünür
    const lv = Math.min(6, Math.floor(br * 7)); for (let l = 0; l <= lv; l++) { const n = 1 << l; for (let i = 0; i < n; i++) { const x = W / 2 + (i - (n - 1) / 2) * (900 / Math.max(1, n - 1 || 1)) * (n > 1 ? 1 : 0), y = 760 + l * 100;
      ctx.fillStyle = `hsl(${260 + l * 20 + i * 3},90%,65%)`; ctx.beginPath(); ctx.arc(x, y, 18 - l * 2, 0, TAU); ctx.fill();
      if (l > 0) { const pn = n >> 1, pi = i >> 1, px = W / 2 + (pi - (pn - 1) / 2) * (900 / Math.max(1, pn - 1 || 1)) * (pn > 1 ? 1 : 0); ctx.strokeStyle = 'rgba(176,107,255,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, y - 100); ctx.lineTo(x, y); ctx.stroke(); } } }
  });
  kinetic(['QUANTUM', 'MECHANICS'], W / 2, 200, 140, t, 19.6, { hl: { QUANTUM: MC } });
  if (t > 21.1) pill('TERRIFYING', W / 2, 340, 64, C.red, seg(t, 21.1, 21.35));
  if (t > 22.58) txt(Math.round(Math.pow(2, 6 * seg(t, 22.58, 24.0) + 1) * 1e6).toLocaleString('en-US') + '+ WORLDS', W / 2, 1450, 72, MG, { align: 'center', font: 'Anton', weight: 400, glow: '#ff8a3a' });
}

// ---------- S6 24.32–29.52: alternatif hayatlara köprü kurabilir miyiz? ----------
function s6(t) {
  cosmos(t, 21);
  const bp = eo(seg(t, 26.92, 28.2));
  cam({ zoom: 1.02, t, shake: 2 }, () => {
    bubbleU(230, 900, 230, t, 200); bubbleU(850, 900, 230, t, 300);
    you(230, 1000, 230, '#e8e0ff', { glow: MC }); ctx.save(); ctx.globalAlpha = .9; you(850, 1000, 230, '#ffd0f0', { glow: MV, arm: 1 }); ctx.restore();
    // ışık köprüsü
    if (bp > 0) { ctx.strokeStyle = MG; ctx.lineWidth = 14; ctx.shadowColor = MG; ctx.shadowBlur = 40; ctx.beginPath(); for (let k = 0; k <= 30 * bp; k++) { const q = k / 30, x = lerp(430, 650, q) + (q > 0 ? 0 : 0), y = 1000 - Math.sin(q * Math.PI) * 220; if (x > 460 || q === 0) ctx.lineTo(lerp(440, 640, q), y); } ctx.stroke(); ctx.shadowBlur = 0;
      for (let k = 0; k < 8; k++) { const q = ((t * .6 + k / 8) % 1) * bp; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lerp(440, 640, q), 1000 - Math.sin(q * Math.PI) * 220, 7, 0, TAU); ctx.fill(); } }
    if (t > 27.36) { const c = seg(t, 27.36, 28.6); ctx.save(); ctx.globalAlpha = 1 - Math.abs(c - .5) * 1.4; you(lerp(330, 750, eio(c)), 1000 - Math.sin(eio(c) * Math.PI) * 220, 120, '#fff', { glow: MG }); ctx.restore(); }
  });
  kinetic(['BUILD', 'A', 'BRIDGE?'], W / 2, 220, 160, t, 26.0, { hl: { 'BRIDGE?': MG } });
  if (t > 28.08) bigText('ALTERNATE LIVES', W / 2, 1420, 120, MV, seg(t, 28.08, 28.35), { glow: MV });
  if (t < 25.9) bigText('THE REAL QUESTION', W / 2, 220, 110, '#fff', seg(t, 24.4, 24.7));
}

const THEO = ['Another me is rich', 'I want to visit one', 'We are in a simulation', 'Too scary to know', 'Quantum bridge 2050', 'One where I am a cat'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 2.46, 7.52, 11.96, 19.46, 24.32, 29.52, 99], S = [s1, s2, s3, s4, s5, s6, null];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i] ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 29.52), 29.52, 31.12, 31.72, THEO, { tint: 'rgba(176,107,255,.2)' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 21.1 && t < 21.3 ? .8 : 0) + (t > 1.74 && t < 1.9 ? .6 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
