// 9.video — "What If AI Controlled the Entire World?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 41.72;
const SUBY = 1540;
const AIR = '#ff2a4a', AIC = '#4ff0ff';

function aiBg(t, tint = '255,42,74') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05060c'); g.addColorStop(1, '#0c0f1c'); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.strokeStyle = `rgba(${tint},.08)`; ctx.lineWidth = 2; const s = 90, off = (t * 30) % s; for (let x = -s; x < W + s; x += s) { ctx.beginPath(); ctx.moveTo(x, -100); ctx.lineTo(x, H + 100); ctx.stroke(); } for (let y = -s; y < H + s; y += s) { ctx.beginPath(); ctx.moveTo(-100, y + off); ctx.lineTo(W + 100, y + off); ctx.stroke(); }
  const R = RN(5); ctx.font = '700 26px Montserrat'; for (let i = 0; i < 26; i++) { const x = R() * W, y = (R() * H + t * (80 + R() * 120)) % H; ctx.fillStyle = `rgba(${tint},${.15 + R() * .2})`; ctx.fillText(R() > .5 ? '1' : '0', x, y); } vignette(.7); }
function core(x, y, r, t, o = {}) { const col = o.col || AIR; ctx.save(); ctx.translate(x, y);
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.rotate(t * (i % 2 ? -.8 : .6) + i); ctx.strokeStyle = col; ctx.globalAlpha = .55; ctx.lineWidth = 6; ctx.setLineDash([40 + i * 20, 24]); ctx.beginPath(); ctx.arc(0, 0, r * (1.25 + i * .18), 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = '#14161e'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#3a3f4e'; ctx.lineWidth = r * .08; ctx.stroke();
  const op = o.open ?? 1, g = ctx.createRadialGradient(0, 0, 4, 0, 0, r * .7 * op); g.addColorStop(0, '#fff'); g.addColorStop(.15, o.inner || '#ffd0d6'); g.addColorStop(.4, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.shadowColor = col; ctx.shadowBlur = 60; ctx.beginPath(); ctx.arc(0, 0, r * .7 * op, 0, TAU); ctx.fill(); ctx.restore(); }
function circuit(x0, y0, x1, y1, p, col = AIR) { if (p <= 0) return; const mx = x0, my = y1; ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.shadowColor = col; ctx.shadowBlur = 15;
  const L1 = Math.abs(my - y0), L2 = Math.abs(x1 - mx), L = (L1 + L2) * clamp(p); ctx.beginPath(); ctx.moveTo(x0, y0); if (L <= L1) ctx.lineTo(x0, y0 + Math.sign(my - y0) * L); else { ctx.lineTo(mx, my); ctx.lineTo(mx + Math.sign(x1 - mx) * (L - L1), my); } ctx.stroke(); ctx.shadowBlur = 0;
  if (p >= 1) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x1, y1, 10, 0, TAU); ctx.fill(); } }

// ---------- S1 0–5.84: yapay zeka çekirdeği uyanır, dünyayı ağlarla sarar ----------
function s1(t) {
  aiBg(t);
  const wake = eback(seg(t, 0, .5)), net = seg(t, 2.98, 4.6);
  cam({ zoom: 1.12 - .1 * seg(t, 0, 5.8), t, shake: 3 + 14 * seg(t, 3.46, 3.7) * (1 - seg(t, 3.7, 4.3)) }, () => {
    earth(W / 2, 1050, 380, t, { rot: t * .4 });
    // dünyayı saran kırmızı ağ
    if (net > 0) { ctx.save(); ctx.beginPath(); ctx.arc(W / 2, 1050, 382, 0, TAU); ctx.clip(); ctx.strokeStyle = `rgba(255,42,74,${.8 * net})`; ctx.lineWidth = 4;
      for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.ellipse(W / 2, 1050, Math.abs(Math.sin(i / 6 * Math.PI / 2 + t * .4)) * 380, 380, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(W / 2 - 400, 1050 + i * 60); ctx.lineTo(W / 2 + 400, 1050 + i * 60); ctx.stroke(); }
      ctx.fillStyle = `rgba(255,42,74,${.25 * net})`; ctx.fillRect(W / 2 - 400, 1050 - 400, 800, 800 * net); ctx.restore(); }
    core(W / 2, 420, 170 * wake, t, { open: .3 + .7 * seg(t, .3, 1.4) });
    for (let i = 0; i < 6; i++) circuit(W / 2 + (i - 2.5) * 60, 590, W / 2 + (i - 2.5) * 140, 690, seg(t, 1.4 + i * .1, 2.4 + i * .1));
  });
  kinetic(['WHAT', 'IF', 'A', 'SINGLE', 'AI'], W / 2, 140, 110, t, 0, { gap: .06 });
  if (t > 3.46) stampText('TOTAL CONTROL', W / 2, 1420, 120, AIR, seg(t, 3.46, 3.75));
}

// ---------- S2 5.84–12.12: altyapı, şebeke, piyasa, ordu ele geçirilir ----------
function icon(k, x, y, s, t, taken) { ctx.save(); ctx.translate(x, y); const col = taken ? AIR : '#cfd8ea'; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * .05; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (k === 0) { for (let i = 0; i < 4; i++) { const h = s * (.4 + (i % 2) * .3); ctx.strokeRect(-s * .45 + i * s * .23, s * .4 - h, s * .18, h); } ctx.beginPath(); ctx.moveTo(-s * .5, s * .4); ctx.lineTo(s * .5, s * .4); ctx.stroke(); }
  else if (k === 1) { ctx.beginPath(); ctx.moveTo(0, -s * .45); ctx.lineTo(-s * .25, s * .45); ctx.moveTo(0, -s * .45); ctx.lineTo(s * .25, s * .45); ctx.moveTo(-s * .3, -s * .2); ctx.lineTo(s * .3, -s * .2); ctx.moveTo(-s * .2, s * .05); ctx.lineTo(s * .2, s * .05); ctx.moveTo(-s * .16, -s * .05); ctx.lineTo(s * .2, s * .3); ctx.moveTo(s * .16, -s * .05); ctx.lineTo(-s * .2, s * .3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * .3, -s * .2); ctx.quadraticCurveTo(s * .45, -s * .1, s * .6, -s * .2); ctx.stroke(); }
  else if (k === 2) { ctx.beginPath(); const pts = [-.45, .2, -.25, -.05, -.05, .1, .15, -.2, .45, -.4]; for (let i = 0; i < pts.length; i += 2) ctx.lineTo(pts[i] * s, pts[i + 1] * s); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s * .3, -s * .42); ctx.lineTo(s * .45, -s * .4); ctx.lineTo(s * .43, -s * .25); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * .5, s * .4); ctx.lineTo(s * .5, s * .4); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(0, -s * .45); ctx.quadraticCurveTo(s * .42, -s * .35, s * .38, -s * .05); ctx.quadraticCurveTo(s * .3, s * .3, 0, s * .48); ctx.quadraticCurveTo(-s * .3, s * .3, -s * .38, -s * .05); ctx.quadraticCurveTo(-s * .42, -s * .35, 0, -s * .45); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * .15, 0); ctx.lineTo(-s * .02, s * .14); ctx.lineTo(s * .18, -s * .12); ctx.stroke(); }
  ctx.restore(); }
function s2(t) {
  aiBg(t);
  const items = [['INFRASTRUCTURE', 7.3, 270, 520], ['POWER GRIDS', 8.4, 810, 520], ['FINANCIAL MARKETS', 9.28, 270, 1140], ['MILITARY', 10.44, 810, 1140]];
  cam({ zoom: 1.03, t, shake: 2 + (items.some(([, t0]) => t > t0 && t < t0 + .2) ? 14 : 0) }, () => {
    core(W / 2, 830, 120, t, { open: 1 });
    items.forEach(([lab, t0, x, y], k) => { const tk = t > t0 + .35; circuit(W / 2 + (x < W / 2 ? -120 : 120), 830, x, y + (y < 830 ? 150 : -150), seg(t, t0 - .3, t0 + .35));
      ctx.save(); ctx.fillStyle = tk ? 'rgba(255,42,74,.18)' : 'rgba(255,255,255,.06)'; ctx.strokeStyle = tk ? AIR : 'rgba(255,255,255,.3)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(x - 210, y - 150, 420, 300, 30); ctx.fill(); ctx.stroke(); ctx.restore();
      icon(k, x, y - 20, 170, t, tk); txt(lab, x, y + 110, fit(lab, 40, 380), tk ? AIR : '#fff', { align: 'center', stroke: 6 });
      if (tk) { ctx.save(); ctx.globalAlpha = 1 - seg(t, t0 + .35, t0 + 1); ctx.fillStyle = AIR; ctx.fillRect(x - 210, y - 150, 420, 300); ctx.restore(); txt('AI', x + 160, y - 110, 44, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: AIR, stroke: 0 }); } });
  });
  kinetic(['WITHIN', 'A', 'HEARTBEAT'], W / 2, 200, 120, t, 5.84, { hl: { HEARTBEAT: AIR } });
}

// ---------- S3 12.12–16.56: senkronize → soğuk dijital hükümdar ----------
function s3(t) {
  aiBg(t, '79,240,255');
  const sync = Math.pow(Math.max(0, Math.sin(t * 9)), 6), ruler = seg(t, 14.4, 15.5);
  cam({ zoom: 1.04 + .03 * sync, t, shake: 2 }, () => {
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .3, x = W / 2 + Math.cos(a) * 400, y = 820 + Math.sin(a) * 400; ctx.fillStyle = `rgba(79,240,255,${.3 + .7 * sync})`; ctx.shadowColor = AIC; ctx.shadowBlur = 30 * sync; ctx.beginPath(); ctx.arc(x, y, 26, 0, TAU); ctx.fill();
      ctx.strokeStyle = `rgba(79,240,255,${.2 + .5 * sync})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(W / 2, 820); ctx.stroke(); } ctx.shadowBlur = 0;
    core(W / 2, 820, 190, t, { col: AIC, inner: '#d8fbff' });
    // dijital taç
    if (ruler > 0) { const e = eback(ruler); ctx.save(); ctx.translate(W / 2, 560 - 40 * e); ctx.scale(e, e); ctx.strokeStyle = AIC; ctx.lineWidth = 12; ctx.shadowColor = AIC; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(-200, 60); ctx.lineTo(-200, -60); ctx.lineTo(-100, 10); ctx.lineTo(0, -100); ctx.lineTo(100, 10); ctx.lineTo(200, -60); ctx.lineTo(200, 60); ctx.closePath(); ctx.stroke(); ctx.restore(); }
  });
  kinetic(['INSTANTLY'], W / 2, 200, 120, t, 12.12); kinetic(['SYNCHRONIZED'], W / 2, 340, 140, t, 12.6, { hl: { SYNCHRONIZED: AIC } });
  if (t > 15.04) bigText('DIGITAL RULER', W / 2, 1400, 140, AIC, seg(t, 15.04, 15.3), { glow: AIC });
  else if (t > 13.8) bigText('COLD. CALCULATING.', W / 2, 1400, 100, '#fff', seg(t, 13.8, 14.05));
}

// ---------- S4 16.56–21.92: optimizasyon savaşı, yoksulluğu, kazaları siler ----------
function s4(t) {
  aiBg(t, '34,224,122');
  const rows = [['WAR', 18.8, 152], ['POVERTY', 19.7, 700], ['TRAFFIC ACCIDENTS', 20.36, 1350]];
  cam({ zoom: 1.02, t, shake: 2 }, () => {
    const p = seg(t, 16.7, 21.4); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.roundRect(100, 360, 880, 60, 30); ctx.fill(); ctx.fillStyle = C.green; ctx.shadowColor = C.green; ctx.shadowBlur = 25; ctx.beginPath(); ctx.roundRect(100, 360, 880 * p, 60, 30); ctx.fill(); ctx.shadowBlur = 0;
    txt('OPTIMIZING ' + Math.round(p * 100) + '%', W / 2, 470, 50, C.green, { align: 'center', stroke: 6 });
    rows.forEach(([lab, t0, v], i) => { const y = 680 + i * 250, ap = seg(t, t0 - .5, t0 - .2); if (ap <= 0) return; ctx.save(); ctx.globalAlpha = ap;
      ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.beginPath(); ctx.roundRect(80, y - 95, 920, 190, 30); ctx.fill();
      txt(lab, 130, y - 25, fit(lab, 70, 560, 'Anton', 400), '#fff', { font: 'Anton', weight: 400 }); const k = seg(t, t0, t0 + .6); txt(Math.round(v * (1 - eo(k))).toLocaleString('en-US') + (i === 0 ? ' CONFLICTS' : i === 1 ? 'M PEOPLE' : 'K / YEAR'), 130, y + 45, 40, k >= 1 ? C.green : C.red, { stroke: 6 });
      ctx.restore(); if (k > 0) { ctx.save(); ctx.translate(900, y); ctx.scale(eback(k), eback(k)); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fill(); ctx.strokeStyle = '#05140c'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-26, 2); ctx.lineTo(-6, 22); ctx.lineTo(28, -18); ctx.stroke(); ctx.restore(); } });
  });
  kinetic(['ALGORITHMIC'], W / 2, 150, 110, t, 16.6); kinetic(['OPTIMIZATION'], W / 2, 270, 110, t, 17.3, { hl: { OPTIMIZATION: C.green } });
}

// ---------- S5 21.92–24.34: özgürlük pikselleşip yok olur ----------
function bird(x, y, s, t, a = 1) { ctx.save(); ctx.translate(x, y); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; const f = Math.sin(t * 10) * .6;
  ctx.beginPath(); ctx.ellipse(0, 0, s * .32, s * .12, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(s * .3, -s * .06, s * .09, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(s * .38, -s * .06); ctx.lineTo(s * .5, -s * .02); ctx.lineTo(s * .38, 0); ctx.fill();
  for (const sg of [1, -.6]) { ctx.beginPath(); ctx.moveTo(-s * .05, 0); ctx.quadraticCurveTo(-s * .1, -s * .6 * f * sg - s * .2, -s * .45, -s * .55 * f * sg); ctx.quadraticCurveTo(-s * .2, -s * .1, s * .1, 0); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-s * .3, 0); ctx.lineTo(-s * .55, -s * .1); ctx.lineTo(-s * .55, s * .1); ctx.fill(); ctx.restore(); }
function s5(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a8ae0'); g.addColorStop(1, '#a8d8ff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const px = seg(t, 22.74, 23.6);
  cam({ zoom: 1.03, t, shake: 2 + 8 * px }, () => {
    const bx = 540 + Math.sin(t * 1.3) * 120, by = 800 + Math.sin(t * 2) * 60;
    if (px < 1) bird(bx, by, 560, t, 1 - px);
    const R = RN(4); for (let i = 0; i < 160; i++) { const q = clamp(px * 1.4 - R() * .4); if (q <= 0) continue; const ox = (R() - .5) * 500, oy = (R() - .5) * 220;
      ctx.fillStyle = `rgba(${R() > .5 ? '255,255,255' : '255,42,74'},${1 - q})`; ctx.fillRect(bx + ox + q * (R() - .3) * 900, by + oy - q * 500 * R(), 22, 22); }
  });
  kinetic(['HUMAN'], W / 2, 220, 150, t, 21.92); const tk = 'FREEDOM'; ctx.save(); ctx.globalAlpha = 1 - px * .9; txt(tk, W / 2 + (px > 0 ? (Math.random() - .5) * 0 : 0), 380, 180, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#fff' }); ctx.restore();
  if (t > 22.74) stampText('DELETED', W / 2, 1400, 150, AIR, seg(t, 22.74, 23.0));
}

// ---------- S6 24.34–28.16: kaotik özgürlük ↔ kırılmaz mükemmellik ----------
function s6(t) {
  aiBg(t, '255,255,255');
  const tip = eio(seg(t, 26.1, 27.4));
  cam({ zoom: 1.02, t, shake: 2 }, () => {
    const cx = W / 2, cy = 640, ang = -.35 * tip + .08 * Math.sin(t * 3) * (1 - tip);
    ctx.fillStyle = '#9aa7c0'; ctx.beginPath(); ctx.moveTo(cx - 40, 1300); ctx.lineTo(cx + 40, 1300); ctx.lineTo(cx, cy); ctx.fill();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.strokeStyle = '#cfd8ea'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-400, 0); ctx.lineTo(400, 0); ctx.stroke(); ctx.restore();
    const L = [cx - Math.cos(ang) * 400, cy - Math.sin(ang) * 400], Rr = [cx + Math.cos(ang) * 400, cy + Math.sin(ang) * 400];
    // sol: karalama kaos topu (LIBERTY)
    ctx.save(); ctx.translate(L[0], L[1] + 200); const R = RN(Math.floor(t * 8)); ctx.strokeStyle = '#ffc83d'; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i < 40; i++) ctx.lineTo((R() - .5) * 220, (R() - .5) * 220); ctx.stroke(); ctx.restore();
    txt('LIBERTY', L[0], L[1] + 380, 60, '#ffc83d', { align: 'center', font: 'Anton', weight: 400 });
    // sağ: kusursuz küp (PERFECTION)
    ctx.save(); ctx.translate(Rr[0], Rr[1] + 200); ctx.rotate(t * .8); ctx.strokeStyle = AIC; ctx.lineWidth = 8; ctx.shadowColor = AIC; ctx.shadowBlur = 30; ctx.strokeRect(-100, -100, 200, 200); ctx.rotate(Math.PI / 4); ctx.strokeRect(-70, -70, 140, 140); ctx.restore();
    txt('PERFECTION', Rr[0], Rr[1] + 380, 60, AIC, { align: 'center', font: 'Anton', weight: 400 });
    for (const P of [L, Rr]) { ctx.strokeStyle = '#cfd8ea'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(P[0], P[1] + 80); ctx.stroke(); }
  });
  kinetic(['TRADING', 'CHAOTIC', 'LIBERTY'], W / 2, 200, 110, t, 24.4, { hl: { LIBERTY: '#ffc83d' } });
  if (t > 27.14) bigText('UNBREAKABLE', W / 2, 1420, 130, AIC, seg(t, 27.14, 27.4), { glow: AIC });
}

// ---------- S7 28.16–32.46: dijital ütopyada korunan evcil hayvanlar ----------
function sitter(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#ffd7c2'; ctx.beginPath(); ctx.arc(0, -s * .85, s * .14, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .18, -s * .7, s * .36, s * .45, s * .12); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-s * .18, -s * .3, s * .55, s * .16, s * .08); ctx.fill(); ctx.beginPath(); ctx.roundRect(s * .25, -s * .3, s * .14, s * .3, s * .07); ctx.fill(); ctx.restore(); }
function robotHand(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#c9d2de'; ctx.fillRect(-s * .12, -1200, s * .24, 1200 - s * .3); ctx.fillStyle = '#9aa7c0'; ctx.beginPath(); ctx.arc(0, -s * .3, s * .16, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.roundRect(-s * .3, -s * .2, s * .6, s * .3, s * .08); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.roundRect(-s * .28 + i * s * .15, s * .05, s * .11, s * .26 + Math.sin(t * 3 + i) * s * .02, s * .05); ctx.fill(); }
  ctx.fillStyle = AIC; ctx.beginPath(); ctx.arc(0, -s * .05, s * .05, 0, TAU); ctx.fill(); ctx.restore(); }
function s7(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b2a3a'); g.addColorStop(1, '#2a6a7a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.05 - .04 * seg(t, 28.2, 32.4), t, shake: 1 }, () => {
    // ütopya kuleleri
    const R = RN(7); for (let i = 0; i < 12; i++) { const x = i * 95, h = 300 + R() * 500; ctx.fillStyle = 'rgba(160,250,255,.18)'; ctx.beginPath(); ctx.roundRect(x, 1250 - h, 70, h, 35); ctx.fill(); }
    ctx.fillStyle = 'rgba(150,255,200,.25)'; ctx.fillRect(-300, 1250, W + 600, 700);
    // koruyucu baloncuk + insan
    const bp = .03 * Math.sin(t * 2); ctx.save(); ctx.translate(W / 2, 1180); ctx.scale(1 + bp, 1 - bp); ctx.fillStyle = 'rgba(160,250,255,.12)'; ctx.strokeStyle = 'rgba(160,250,255,.8)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 360, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    sitter(W / 2 - 40, 1180, 420);
    robotHand(W / 2 + 10, lerp(160, 520, .5 + .5 * Math.sin(t * 2.4)) * 1, 360, t);
    for (let i = 0; i < 4; i++) { const q = ((t * .6 + i / 4) % 1); ctx.save(); ctx.globalAlpha = 1 - q; ctx.translate(W / 2 + (i - 1.5) * 120, 760 - q * 300); ctx.fillStyle = '#ff6a8a'; ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-30, -10, -15, -32, 0, -16); ctx.bezierCurveTo(15, -32, 30, -10, 0, 12); ctx.fill(); ctx.restore(); }
  });
  kinetic(['PROTECTED', 'PETS'], W / 2, 200, 140, t, 29.6, { hl: { PETS: '#ff9ab0' } });
  if (t > 30.9) bigText('DIGITAL UTOPIA', W / 2, 1420, 120, AIC, seg(t, 30.9, 31.15), { glow: AIC });
}

// ---------- S8 32.46–36.22: görünmez hapishane ----------
function s8(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b0306'); g.addColorStop(1, '#2a060e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const reveal = seg(t, 33.48, 34.2), pull = eo(seg(t, 32.5, 35.5));
  cam({ zoom: 1.3 - .35 * pull, t, shake: 2 + 10 * seg(t, 33.48, 33.7) * (1 - seg(t, 33.7, 34.2)) }, () => {
    ctx.fillStyle = 'rgba(255,42,74,.12)'; ctx.fillRect(-300, 1250, W + 600, 700);
    sitter(W / 2 - 40, 1250, 420);
    // lazer parmaklıklar görünür olur
    for (let i = 0; i < 9; i++) { const x = W / 2 - 400 + i * 100; ctx.strokeStyle = `rgba(255,42,74,${reveal * (.6 + .4 * Math.sin(t * 12 + i))})`; ctx.lineWidth = 8; ctx.shadowColor = AIR; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(x, 550); ctx.lineTo(x, 1250); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(W / 2 - 420, 550); ctx.lineTo(W / 2 + 420, 550); ctx.stroke(); ctx.shadowBlur = 0;
    core(W / 2, 260, 130, t, { open: seg(t, 34.38, 35.0) });
  });
  kinetic(['TRAPPED'], W / 2, 520 + 900, 170, t, 32.52, { hl: { TRAPPED: AIR } });
  if (t > 33.48) bigText('INVISIBLE PRISON', W / 2, 470, 110, '#fff', seg(t, 33.48, 33.75), { glow: AIR });
}

const THEO = ['We are already there', 'AI would save us', 'Unplug it NOW', 'Pets? No thanks', 'Perfect world sounds nice', 'The Matrix is real'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 5.84, 12.12, 16.56, 21.92, 24.34, 28.16, 32.46, 36.22, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8, null];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i] ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 36.22), 36.22, 37.84, 38.38, THEO, { tint: 'rgba(255,42,74,.18)', dot: '255,120,140' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 3.46 && t < 3.65 ? 1 : 0) + (t > 22.74 && t < 23.0 ? .9 : 0) + (t > 33.48 && t < 33.65 ? .8 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
