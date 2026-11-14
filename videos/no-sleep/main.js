// 3.video — "What If Humans Never Needed Sleep?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 34.19;
const SUBY = 1540;

// ---------- yardımcılar ----------
function eye(x, y, w, open, t, o = {}) {           // badem göz; open 0..1
  const h = w * .42 * open; ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.6, -w / 2, 0); ctx.closePath();
  ctx.save(); ctx.clip(); ctx.fillStyle = '#f4f1ea'; ctx.fillRect(-w, -w, 2 * w, 2 * w);
  const px = (o.look || 0) * w * .12, ir = w * .2, g = ctx.createRadialGradient(px, 0, ir * .2, px, 0, ir); g.addColorStop(0, o.iris1 || '#7fe0ff'); g.addColorStop(1, o.iris2 || '#0d5a8a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, 0, ir, 0, TAU); ctx.fill(); ctx.fillStyle = '#05070c'; ctx.beginPath(); ctx.arc(px, 0, ir * (o.pupil || .38), 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(px - ir * .35, -ir * .35, ir * .18, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(200,60,60,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 10, (i - 3) * 6); ctx.quadraticCurveTo(-w * .35, (i - 3) * 14, -w * .28, (i - 3) * 10); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = '#1a0f0a'; ctx.lineWidth = w * .035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6 - 4, w / 2, 0); ctx.stroke();
  if (open < .15) { ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, w * .12, w / 2, 0); ctx.stroke(); for (let i = 0; i < 6; i++) { const a = -w * .35 + i * w * .14; ctx.beginPath(); ctx.moveTo(a, w * .07); ctx.lineTo(a - 10, w * .14); ctx.stroke(); } }
  ctx.restore();
}
function brain(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1 + .015 * Math.sin(t * 3), 1 + .015 * Math.sin(t * 3 + 1));
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 60; }
  ctx.fillStyle = o.col || '#f2a3b6'; ctx.beginPath(); ctx.ellipse(-s * .26, 0, s * .52, s * .4, -.08, 0, TAU); ctx.ellipse(s * .26, 0, s * .52, s * .4, .08, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(s * .3, s * .35, s * .22, s * .13, .3, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = o.line || 'rgba(150,40,80,.55)'; ctx.lineWidth = s * .025; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -s * .38); ctx.bezierCurveTo(-s * .05, -s * .1, s * .05, s * .1, 0, s * .36); ctx.stroke();
  const R = RN(5); for (let i = 0; i < 16; i++) { const sx = (R() - .5) * s * 1.3, sy = (R() - .5) * s * .6; ctx.beginPath(); ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + s * .1, sy - s * .12, sx + s * .18, sy + s * .1, sx + s * .26 * (R() > .5 ? 1 : -.6), sy - s * .02); ctx.stroke(); }
  ctx.restore();
}
function clockFace(x, y, r, t, ring) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f2f4f8'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = ring || '#ff3b4e'; ctx.lineWidth = r * .1; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.strokeStyle = '#222'; ctx.lineWidth = r * .04; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .78, Math.sin(a) * r * .78); ctx.lineTo(Math.cos(a) * r * .88, Math.sin(a) * r * .88); ctx.stroke(); }
  ctx.strokeStyle = '#111'; ctx.lineCap = 'round'; ctx.lineWidth = r * .07; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(t * .5 - 1.57) * r * .45, Math.sin(t * .5 - 1.57) * r * .45); ctx.stroke();
  ctx.lineWidth = r * .04; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(t * 6 - 1.57) * r * .7, Math.sin(t * 6 - 1.57) * r * .7); ctx.stroke(); ctx.restore();
}

// ---------- S1 0–2.78: kapalı göz Zzz → gözler fal taşı gibi açılır ----------
function s1(t) {
  const op = eback(seg(t, 1.45, 1.75)), dark = 1 - seg(t, 1.45, 1.6) * .5;
  const bg = ctx.createRadialGradient(W / 2, 700, 0, W / 2, 700, 1300); bg.addColorStop(0, op > 0 ? '#3a2a20' : '#151022'); bg.addColorStop(1, '#05040a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.15 - .1 * eo(seg(t, 0, 1.4)) + .12 * Math.sin(seg(t, 1.45, 1.9) * Math.PI), t, shake: t > 1.45 && t < 2.2 ? 20 : 3 }, () => {
    ctx.fillStyle = '#c8916a'; ctx.beginPath(); ctx.ellipse(W / 2, 760, 640, 470, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(W / 2, 760, 640, 470, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#3a2416'; ctx.lineWidth = 24; ctx.lineCap = 'round';
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(W / 2 + sx * 120, 520 - op * 40); ctx.quadraticCurveTo(W / 2 + sx * 250, 470 - op * 70, W / 2 + sx * 380, 530 - op * 30); ctx.stroke(); }
    eye(W / 2 - 230, 690, 300, Math.max(.05, op), t, { pupil: op > .5 ? .2 : .38 }); eye(W / 2 + 230, 690, 300, Math.max(.05, op), t, { pupil: op > .5 ? .2 : .38 });
    // Zzz yükselir, açılınca patlar
    ['Z', 'z', 'Z'].forEach((z, i) => { const p = ((t * .6 + i * .33) % 1); if (op > 0) return; txt(z, 760 + i * 70 + p * 80, 420 - p * 260, 90 + i * 25, `rgba(180,200,255,${1 - p})`, { font: 'Anton', weight: 400, stroke: 0 }); });
    shards(860, 340, seg(t, 1.45, 2.4), 30, 3, '#b4c8ff', 18, 700);
  });
  // çalar saat sallanır
  const sh = Math.sin(t * 50) * .15; ctx.save(); ctx.translate(890, 250); ctx.rotate(sh); clockFace(0, 0, 120, t * 4); ctx.fillStyle = '#ff3b4e';
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 80, -110, 42, Math.PI, 0); ctx.fill(); } ctx.restore();
  kinetic(['WHAT', 'IF', 'HUMANS'], W / 2, 1200, 130, t, 0, { gap: .06, maxW: 650 });
  kinetic(['NEVER', 'NEEDED', 'SLEEP?'], W / 2, 1370, 140, t, .7, { hl: { 'SLEEP?': C.red } });
  flash(t, 1.5, .2, '255,240,200');
}

// ---------- S2 2.78–5.8: 24 saatlik kadran, +8 saat ----------
function s2(t) {
  bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 4, dot: '255,220,140' });
  const cx = W / 2, cy = 820, r = 380, add = eio(seg(t, 3.4, 4.2));
  cam({ zoom: 1 + .06 * seg(t, 2.78, 5.8), rot: Math.sin(t * 1.3) * .02, t }, () => {
    ctx.lineWidth = 110; ctx.lineCap = 'butt';
    ctx.strokeStyle = '#ffc83d'; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * 16 / 24); ctx.stroke();
    ctx.strokeStyle = '#1d2450'; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + TAU * 16 / 24, -Math.PI / 2 + TAU); ctx.stroke();
    ctx.strokeStyle = '#22e07a'; ctx.shadowColor = '#22e07a'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + TAU * 16 / 24, -Math.PI / 2 + TAU * (16 + 8 * add) / 24); ctx.stroke(); ctx.shadowBlur = 0;
    for (let i = 0; i < 24; i++) { const a = -Math.PI / 2 + i / 24 * TAU; ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (r - 55), cy + Math.sin(a) * (r - 55)); ctx.lineTo(cx + Math.cos(a) * (r + 55), cy + Math.sin(a) * (r + 55)); ctx.stroke(); }
    // ay ikonu karanlık bölümde → kaybolur
    const ma = -Math.PI / 2 + TAU * 20 / 24; moon(cx + Math.cos(ma) * r, cy + Math.sin(ma) * r, 40 * (1 - add), { glow: .3 });
    const hrs = Math.round(16 + 8 * add); txt(hrs + 'H', cx, cy - 20, 200, '#fff', { align: 'center', font: 'Anton', weight: 400 }); txt('AWAKE', cx, cy + 110, 60, C.mute, { align: 'center', stroke: 0 });
  });
  pill('+8 HOURS', W / 2, 260, 90, C.green, seg(t, 3.44, 3.8));
  // takvim sayfaları uçuşur
  if (t > 4.2) for (let i = 0; i < 6; i++) { const p = seg(t, 4.3 + i * .2, 5.2 + i * .2); if (p <= 0) continue; ctx.save(); ctx.translate(W / 2 + p * 600 * (i % 2 ? 1 : -1), 1360 - p * 300); ctx.rotate(p * 3 * (i % 2 ? 1 : -1)); ctx.globalAlpha = 1 - p;
    ctx.fillStyle = '#fff'; ctx.fillRect(-90, -90, 180, 180); ctx.fillStyle = C.red; ctx.fillRect(-90, -90, 180, 45); txt(String(12 + i), 0, 25, 80, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
  if (t > 4.2) { ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 90, 1270, 180, 180); ctx.fillStyle = C.red; ctx.fillRect(W / 2 - 90, 1270, 180, 45); txt('18', W / 2, 1385, 80, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }
}

// ---------- S3 5.8–10.2: yorgunluk yok, karanlıkta kayıp yok ----------
function battery(x, y, w, lvl, t) { const h = w * .5; ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#fff'; ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 24); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(w / 2 + 6, -h * .2, 26, h * .4);
  ctx.fillStyle = C.green; ctx.shadowColor = C.green; ctx.shadowBlur = 30; for (let i = 0; i < 5; i++) if (lvl > i / 5) ctx.fillRect(-w / 2 + 22 + i * (w - 44) / 5, -h / 2 + 22, (w - 44) / 5 - 12, h - 44); ctx.restore();
  txt(Math.round(lvl * 100) + '%', x, y + h * .5 + 90, 110, C.green, { align: 'center', font: 'Anton', weight: 400 }); }
function s3(t) {
  const night = seg(t, 7.8, 8.4);
  if (night < 1) { bgFinance(t, { tint: 'rgba(34,224,122,.2)', seed: 6 });
    cam({ zoom: 1 + .05 * Math.sin(t * 2), t }, () => {
      battery(W / 2, 520, 620, 1, t);
      [['FATIGUE', 5.96, 980], ['EXHAUSTION', 6.92, 1200]].forEach(([w, t0, y]) => { if (t < t0) return; txt(w, W / 2, y, fit(w, 130, 800, 'Anton', 400), '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.save(); ctx.globalAlpha = seg(t, t0 + .2, t0 + .4); ctx.strokeStyle = C.red; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(W / 2 - 360, y + 10); ctx.lineTo(W / 2 - 360 + 720 * seg(t, t0 + .2, t0 + .45), y - 10); ctx.stroke(); ctx.restore(); });
    }); kinetic(['NO'], W / 2, 220, 160, t, 5.8, { hl: { NO: C.red } }); }
  if (night > 0) { ctx.save(); ctx.globalAlpha = night;
    space(t, 8, { top: '#03040e', bot: '#151a3c' });
    cam({ zoom: 1.1 - .08 * seg(t, 7.9, 10.2), t }, () => { skyline(1450, t, { seed: 21, tall: 700, col: '#0b1028' }); });
    const lit = seg(t, 8.5, 9.6); ctx.fillStyle = `rgba(255,200,90,${.18 * lit})`; ctx.fillRect(0, 900, W, 600);
    txt(String(Math.round(8 * (1 - eo(seg(t, 8.1, 9.2))))), W / 2, 400, 260, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold });
    txt('HOURS LOST', W / 2, 580, 70, '#fff', { align: 'center', stroke: 10 });
    if (t > 9.44) stampText('ZERO', W / 2, 760, 120, C.green, seg(t, 9.44, 9.7));
    ctx.restore(); }
}

// ---------- S4 10.26–13.85: üretkenlik roket gibi ----------
const PROD = Array.from({ length: 40 }, (_, i) => 10 + Math.pow(1.13, i) * 3 + Math.sin(i * 1.3) * 3);
function rocket(x, y, s, a, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  const f = 1 + .3 * Math.sin(t * 40); ctx.fillStyle = '#ffb12e'; ctx.beginPath(); ctx.moveTo(-s * .55, -s * .14); ctx.lineTo(-s * (.55 + .5 * f), 0); ctx.lineTo(-s * .55, s * .14); ctx.fill();
  ctx.fillStyle = '#ff4d2e'; ctx.beginPath(); ctx.moveTo(-s * .55, -s * .08); ctx.lineTo(-s * (.55 + .3 * f), 0); ctx.lineTo(-s * .55, s * .08); ctx.fill();
  ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.moveTo(s * .55, 0); ctx.quadraticCurveTo(s * .2, -s * .22, -s * .55, -s * .17); ctx.lineTo(-s * .55, s * .17); ctx.quadraticCurveTo(s * .2, s * .22, s * .55, 0); ctx.fill();
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-s * .3, -s * .17); ctx.lineTo(-s * .55, -s * .38); ctx.lineTo(-s * .55, -s * .15); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .3, s * .17); ctx.lineTo(-s * .55, s * .38); ctx.lineTo(-s * .55, s * .15); ctx.fill();
  ctx.fillStyle = '#3da5ff'; ctx.beginPath(); ctx.arc(s * .1, 0, s * .08, 0, TAU); ctx.fill(); ctx.restore(); }
function s4(t) {
  bgFinance(t, { tint: 'rgba(61,165,255,.2)', seed: 11, dot: '120,180,255' });
  const p = eio(seg(t, 10.5, 12.9));
  cam({ zoom: 1 + .1 * p, y: -60 * p, t, shake: 3 + 8 * seg(t, 11.2, 12.9) }, () => {
    lineChart(90, 420, 900, 900, PROD, p, { col: C.green });
    const n = PROD.length - 1, mx = Math.max(...PROD), mn = Math.min(...PROD), L = p * n, li = Math.min(n - 1, Math.floor(L)), fr = L - li, Y = v => 420 + 900 - (v - mn) / (mx - mn) * 900;
    const px = 90 + 900 * L / n, py = lerp(Y(PROD[li]), Y(PROD[li + 1]), fr), ang = Math.atan2(Y(PROD[li + 1]) - Y(PROD[li]), 900 / n); if (p > .02) rocket(px + 40, py - 60, 170, ang, t);
  });
  kinetic(['PRODUCTIVITY'], W / 2, 200, 150, t, 10.3);
  if (t > 11.22) bigText('SKYROCKETS', W / 2, 1420, 150, C.green, seg(t, 11.22, 11.5), { glow: C.green });
}

// ---------- S5 13.88–19.85: ürpertici gerçek — beyin temizlenemez ----------
function s5(t) {
  const cold = seg(t, 13.9, 14.6);
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#04101c'); bg.addColorStop(1, '#0c1f2e'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const R = RN(2); for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(160,220,255,${.2 + R() * .3})`; ctx.beginPath(); ctx.arc((R() * W + t * 20) % W, (R() * H + t * 60 * (1 + R())) % H, 2 + R() * 3, 0, TAU); ctx.fill(); }
  const tox = seg(t, 16.4, 18.2), mem = seg(t, 18.3, 19.8);
  cam({ zoom: 1.05 + .08 * seg(t, 14, 19.8), t, shake: 2 + 10 * mem }, () => {
    brain(W / 2, 760, 560, t, { col: lerpCol('#f2a3b6', '#8a6f9e', tox), glow: tox > .3 ? 'rgba(160,60,255,.8)' : 'rgba(255,150,180,.5)' });
    // toksin birikimi (mor beta-amiloid lekeleri)
    const RT = RN(9); for (let i = 0; i < 90; i++) { const q = clamp(tox * 1.4 - RT() * .4); if (q <= 0) continue; const x = W / 2 + (RT() - .5) * 900, y = 760 + (RT() - .5) * 420;
      ctx.fillStyle = `rgba(150,60,220,${.75 * q})`; ctx.beginPath(); ctx.arc(x, y, (6 + RT() * 16) * q, 0, TAU); ctx.fill(); }
    // temizleme dalgası iptal
    if (t > 17.0 && t < 18.3) { ctx.save(); ctx.globalAlpha = 1 - seg(t, 17.8, 18.3); ctx.strokeStyle = '#5fd3ff'; ctx.lineWidth = 14; ctx.beginPath(); for (let x = 140; x < 940; x += 20) ctx.lineTo(x, 1130 + Math.sin(x * .03 + t * 8) * 26); ctx.stroke(); ctx.restore(); stampX(W / 2, 1130, 170, seg(t, 17.6, 17.9)); }
    // hafıza kartları beyinden saçılır
    for (let i = 0; i < 10; i++) { const q = seg(t, 18.4 + i * .06, 19.6 + i * .06); if (q <= 0) continue; const a = i / 10 * TAU + .3, d = eo(q) * 520;
      ctx.save(); ctx.translate(W / 2 + Math.cos(a) * d, 760 + Math.sin(a) * d * .8); ctx.rotate(q * 4 * (i % 2 ? 1 : -1)); ctx.globalAlpha = 1 - q * .7;
      ctx.fillStyle = '#e8f4ff'; ctx.fillRect(-60, -42, 120, 84); ctx.fillStyle = '#3da5ff'; ctx.fillRect(-48, -30, 60, 10); ctx.fillStyle = '#9fb3c8'; ctx.fillRect(-48, -10, 96, 8); ctx.fillRect(-48, 6, 76, 8); ctx.restore(); }
  });
  ctx.save(); ctx.globalAlpha = cold; ctx.fillStyle = '#ffc83d'; const wy = 180; ctx.beginPath(); ctx.moveTo(W / 2, wy - 70); ctx.lineTo(W / 2 + 80, wy + 70); ctx.lineTo(W / 2 - 80, wy + 70); ctx.closePath(); ctx.fill(); txt('!', W / 2, wy + 22, 90, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  kinetic(['CHILLING', 'REALITY'], W / 2, 360, 130, t, 15.0, { hl: { CHILLING: '#7fd0ff' } });
  bigText('NO NEURO-DETOX', W / 2, 1380, 120, '#c58bff', seg(t, 17.14, 17.4) * (1 - seg(t, 18.2, 18.35)), { glow: '#9b6bff' });
  bigText('MEMORY LOSS', W / 2, 1380, 130, C.red, seg(t, 18.4, 18.7), { glow: C.red });
}
function lerpCol(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return `rgb(${p.map((v, i) => Math.round(lerp(v, q[i], clamp(k)))).join(',')})`; }

// ---------- S6 19.86–24.3: rüyalar yok → aklımızı mı kaybederiz? ----------
function s6(t) {
  space(t, 30, { top: '#0e0420', bot: '#24063a' });
  const ICON = [(s) => moon(0, 0, s * .3, { glow: .2 }), (s) => { ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.arc(0, 0, s * .28, 0, TAU); ctx.fill(); }, (s) => { ctx.fillStyle = '#7fe0ff'; ctx.beginPath(); ctx.moveTo(-s * .3, s * .2); ctx.quadraticCurveTo(0, -s * .5, s * .3, s * .2); ctx.fill(); }];
  cam({ zoom: 1 + .05 * Math.sin(t), t, shake: 3 + 18 * seg(t, 23.0, 23.6) }, () => {
    for (let i = 0; i < 10; i++) { const t0 = 19.9 + i * .12, pop = 21.0 + i * .13, p = seg(t, t0, t0 + .5); if (p <= 0) continue; const x = 200 + (i * 331) % 700, y = 1250 - (i * 97) % 700 - (t - t0) * 90, r = 150 + (i % 3) * 35;
      if (t < pop) { ctx.save(); ctx.translate(x, y); ctx.scale(eback(p), eback(p)); ctx.strokeStyle = 'rgba(200,170,255,.9)'; ctx.lineWidth = 6; ctx.fillStyle = 'rgba(150,100,255,.18)'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke(); ICON[i % 3](r); ctx.restore(); }
      else shards(x, y, seg(t, pop, pop + .7), 14, i, '#c8a8ff', 12, 300); }
    if (t > 22.4) { const k = seg(t, 22.4, 23.0); brain(W / 2, 760, 520 * eback(k), t, { col: '#d48bb0' });
      const ck = seg(t, 23.04, 23.5); if (ck > 0) { ctx.strokeStyle = '#ff3b4e'; ctx.lineWidth = 10; ctx.shadowColor = '#ff3b4e'; ctx.shadowBlur = 30; ctx.beginPath(); let y = 500, x = W / 2; ctx.moveTo(x, y); const R = RN(4); while (y < 500 + 520 * ck) { x += (R() - .5) * 90; y += 50; ctx.lineTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0; }
      for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(W / 2, 760); ctx.rotate(t * (2 + i)); ctx.strokeStyle = `rgba(255,80,120,${.4 * seg(t, 23.0, 23.4)})`; ctx.lineWidth = 6; ctx.beginPath(); for (let a = 0; a < 12; a += .2) ctx.lineTo(Math.cos(a) * a * 26 * (1 + i * .3), Math.sin(a) * a * 26 * (1 + i * .3)); ctx.stroke(); ctx.restore(); } }
  });
  if (t < 22.3) kinetic(['NO', 'DREAMS'], W / 2, 250, 170, t, 19.9, { hl: { DREAMS: '#c58bff' } });
  else kinetic(['LOSE', 'OUR', 'MINDS?'], W / 2, 250, 160, t, 22.9, { hl: { 'MINDS?': C.red } });
}

// ---------- S7 24.3–28.6: ya da durdurulamaz süper medeniyet ----------
function s7(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#020b1a'); g.addColorStop(.6, '#0a2a4a'); g.addColorStop(1, '#03060f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const rise = eo(seg(t, 24.5, 26.5));
  cam({ zoom: 1.08 - .08 * rise, y: 40 * (1 - rise), t }, () => {
    // ufuk ızgarası
    ctx.strokeStyle = 'rgba(0,220,255,.35)'; ctx.lineWidth = 3; for (let i = 0; i < 14; i++) { const y = 1450 + Math.pow(i / 14, 2) * 470 + (t * 40 % 30); ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(W + 200, y); ctx.stroke(); }
    for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 30, 1450); ctx.lineTo(W / 2 + i * 260, H + 50); ctx.stroke(); }
    // yükselen neon kuleler
    const R = RN(14); for (let i = 0; i < 13; i++) { const x = 40 + i * 80 + R() * 20, w = 50 + R() * 50, h = (300 + R() * 750) * clamp(rise * 1.5 - R() * .5), hue = R() > .5 ? '0,220,255' : '190,110,255';
      const gg = ctx.createLinearGradient(0, 1450 - h, 0, 1450); gg.addColorStop(0, `rgba(${hue},.9)`); gg.addColorStop(1, 'rgba(10,20,40,.9)'); ctx.fillStyle = gg; ctx.fillRect(x, 1450 - h, w, h);
      ctx.fillStyle = `rgba(${hue},1)`; ctx.shadowColor = `rgba(${hue},1)`; ctx.shadowBlur = 20; ctx.fillRect(x, 1450 - h, w, 6); ctx.shadowBlur = 0; }
    // hologram beyin
    const hb = seg(t, 25.7, 26.3); if (hb > 0) { ctx.save(); ctx.globalAlpha = hb * (.75 + .25 * Math.sin(t * 12)); brain(W / 2, 560, 420 * eback(hb), t, { col: 'rgba(0,220,255,.35)', line: 'rgba(160,250,255,.9)', glow: '#00e0ff' }); ctx.restore();
      for (let i = 0; i < 3; i++) ring2(W / 2, 560, ((t - 25.7) * .8 + i / 3) % 1, 600, 'rgba(0,220,255,.7)', 8); }
  });
  kinetic(['EVOLVE?'], W / 2, 210, 170, t, 24.95, { hl: { 'EVOLVE?': '#00e0ff' } });
  bigText('UNSTOPPABLE', W / 2, 1360, 140, '#fff', seg(t, 25.78, 26.0) * (1 - seg(t, 26.6, 26.75)), { glow: '#00e0ff' });
  bigText('HYPER-ADVANCED', W / 2, 1360, 130, '#00e0ff', seg(t, 26.74, 27.0), { glow: '#00e0ff' });
}

const THEO = ['We would go insane', 'Infinite productivity!', 'Coffee companies broke', 'Dreams are essential', 'Hyper-evolution', 'Night shift forever'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const w1 = whip(t, 2.78, .3), w2 = whip(t, 5.8, .3, -1), w3 = whip(t, 10.26, .3), w4 = whip(t, 28.6, .3, -1);
  if (t < 2.98) cam({ y: w1.offA }, () => s1(t));
  if (t > 2.58 && t < 6.0) cam({ y: t < 4.3 ? w1.offB : w2.offA }, () => s2(Math.max(t, 2.78)));
  if (t > 5.6 && t < 10.46) cam({ y: t < 8 ? w2.offB : w3.offA }, () => s3(Math.max(t, 5.8)));
  if (t > 10.06 && t < 14.3) cam({ y: w3.offB }, () => s4(Math.max(t, 10.26)));
  if (t >= 13.88 && t < 20.1) iris(t, 13.88, .45, () => s4(t), () => s5(t), W / 2, 760);
  if (t >= 19.86 && t < 24.6) { const k = seg(t, 19.86, 20.1); if (k < 1) s5(t); ctx.save(); ctx.globalAlpha = k; s6(t); ctx.restore(); }
  if (t >= 24.34 && t < 28.8) iris(t, 24.34, .4, () => s6(t), () => cam({ y: w4.offA }, () => s7(t)), W / 2, 1450);
  if (t > 28.4) cam({ y: w4.offB }, () => cta(Math.max(t, 28.6), 28.6, 30.36, 30.94, THEO, { tint: 'rgba(0,200,255,.18)', dot: '120,220,255' }));
  motionStreak(Math.max(w1.blur, w2.blur, w3.blur, w4.blur));
  glitch((t > 13.88 && t < 14.1 ? .8 : 0) + (t > 23.04 && t < 23.5 ? 1 : 0) + (t > 18.3 && t < 18.5 ? .7 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
