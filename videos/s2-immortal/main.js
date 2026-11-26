// Seri2 #3 — "What If Humans Became Immortal?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 46.76;
const SUBY = 1540;
const GOLD = '#ffc83d', RED = '#ff3b4e';

function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function infinity(x, y, s, p, col, lw) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 40; ctx.beginPath();
  const n = Math.floor(200 * p); for (let i = 0; i <= n; i++) { const a = i / 200 * TAU, d = 1 + Math.sin(a) ** 2; ctx.lineTo(x + s * Math.cos(a) / d, y + s * Math.sin(a) * Math.cos(a) / d); } ctx.stroke(); ctx.restore(); }
function hourglass(x, y, s, t, br) { ctx.save(); ctx.translate(x, y); ctx.rotate(br * .4);
  ctx.fillStyle = '#8a5a2a'; ctx.fillRect(-s * .4, -s * .62, s * .8, s * .08); ctx.fillRect(-s * .4, s * .54, s * .8, s * .08);
  ctx.strokeStyle = 'rgba(200,240,255,.8)'; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.moveTo(-s * .32, -s * .54); ctx.quadraticCurveTo(-s * .3, -s * .05, -s * .04, 0); ctx.quadraticCurveTo(-s * .3, s * .05, -s * .32, s * .54); ctx.moveTo(s * .32, -s * .54); ctx.quadraticCurveTo(s * .3, -s * .05, s * .04, 0); ctx.quadraticCurveTo(s * .3, s * .05, s * .32, s * .54); ctx.stroke();
  const k = (t * .15) % 1; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(-s * .25 * (1 - k), -s * .5 + s * .4 * k); ctx.lineTo(s * .25 * (1 - k), -s * .5 + s * .4 * k); ctx.lineTo(0, -s * .05); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-s * .28, s * .52); ctx.lineTo(s * .28, s * .52); ctx.lineTo(0, s * .52 - s * .35 * k); ctx.fill(); if (br < .1) { ctx.fillRect(-s * .01, -s * .05, s * .02, s * .55); } ctx.restore(); }

// ---------- S1 0–4.92: kum saati kırılır → sonsuzluk ----------
function s1(t) {
  darkGrad('#1a0e2a', '#05040a');
  const br = seg(t, .94, 1.3), inf = eo(seg(t, 1.2, 2.6));
  cam({ zoom: 1.12 - .1 * eo(seg(t, 0, 4.9)), t, shake: t > .94 && t < 1.6 ? 20 * (1 - seg(t, .94, 1.6)) : 3 }, () => {
    if (br < 1) hourglass(W / 2, 900, 640, t, br); else shards(W / 2, 900, seg(t, 1.3, 2.8), 70, 4, R => R > .5 ? GOLD : '#c8f0ff', 22, 1000);
    if (br > 0 && br < 1) shards(W / 2, 900, br, 50, 4, R => R > .5 ? GOLD : '#c8f0ff', 22, 600);
    infinity(W / 2, 900, 420, inf, GOLD, 34);
    // ödül kupası 3.44
    const k = eback(seg(t, 3.44, 3.8)); if (k > 0) { ctx.save(); ctx.translate(W / 2, 1230); ctx.scale(k, k); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(-90, -120); ctx.lineTo(90, -120); ctx.quadraticCurveTo(90, 10, 0, 30); ctx.quadraticCurveTo(-90, 10, -90, -120); ctx.fill(); ctx.fillRect(-16, 30, 32, 50); ctx.fillRect(-60, 80, 120, 24);
      ctx.strokeStyle = GOLD; ctx.lineWidth = 14; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 100, -70, 40, sx > 0 ? -1.6 : 1.6, sx > 0 ? 1.6 : -1.6 + TAU, sx < 0); ctx.stroke(); } ctx.restore(); }
  });
  kinetic(['WHAT', 'IF', 'HUMANS', 'BECAME'], W / 2, 220, 130, t, -.3, { gap: .05 });
  kinetic(['IMMORTAL?'], W / 2, 390, 200, t, .2, { hl: { 'IMMORTAL?': GOLD } });
  if (t > 1.16) pill('NO AGING · NO DISEASE', W / 2, 560, 54, '#22e07a', seg(t, 1.16, 1.4));
  flash(t, .94, .2, '255,220,140');
}

// ---------- S2 4.92–10.92: sonsuz yüzyıllar ----------
function book(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#3d7cff'; ctx.beginPath(); ctx.roundRect(-s * .4, -s * .3, s * .8, s * .6, 10); ctx.fill(); ctx.fillStyle = '#f2ebe0'; ctx.fillRect(-s * .34, -s * .24, s * .32, s * .5); ctx.fillRect(s * .02, -s * .24, s * .32, s * .5); ctx.fillStyle = '#9aa2b0'; for (let i = 0; i < 4; i++) { ctx.fillRect(-s * .3, -s * .16 + i * s * .1, s * .24, 6); ctx.fillRect(s * .06, -s * .16 + i * s * .1, s * .24, 6); } ctx.restore(); }
function s2(t) {
  bgFinance(t, { tint: 'rgba(255,200,61,.2)', seed: 3, dot: '255,220,140' });
  const yr = Math.round(lerp(2026, 3026, eio(seg(t, 5.0, 6.4))));
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    const items = [[6.48, 'MASTER EVERY SKILL', 280, 0], [7.92, 'EXPLORE THE WORLD', 800, 1], [9.2, 'ACCUMULATE WEALTH', 540, 2]];
    items.forEach(([t0, lab, x, k], i) => { if (t < t0) return; const p = eback(seg(t, t0, t0 + .4)); const y = i < 2 ? 760 : 1120; ctx.save(); ctx.translate(x, y); ctx.scale(p, p);
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.arc(0, 0, 190, 0, TAU); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.stroke();
      if (k === 0) book(0, -10, 250); else if (k === 1) earth(0, -10, 120, t, { rot: t, light: 0 }); else { cashStack(0, 60, 220, 8); coin(-90, -60, 50, t * 4); coin(90, -80, 44, t * 5); }
      ctx.restore(); txt(lab, x, y + 240, fit(lab, 46, 470), '#fff', { align: 'center', stroke: 8 }); });
  });
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.roundRect(240, 340, 600, 200, 40); ctx.fill(); ctx.restore();
  txt('YEAR ' + yr, W / 2, 440, 120, GOLD, { align: 'center', font: 'Anton', weight: 400, glow: '#ff9a2e' });
  kinetic(['ENDLESS', 'CENTURIES'], W / 2, 220, 140, t, 5.2, { hl: { CENTURIES: GOLD } });
}

// ---------- S3 10.92–16.08: cennet → kabus ----------
function s3(t) {
  const n = eio(seg(t, 13.3, 15.2));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#5ab8ff', '#2a0408', n)); g.addColorStop(.6, lerpC('#bfe8ff', '#8a1a10', n)); g.addColorStop(1, lerpC('#e8d090', '#1a0604', n)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04 + .08 * n, t, shake: 2 + 10 * Math.sin(n * Math.PI) }, () => {
    const sun = ctx.createRadialGradient(780, 380, 20, 780, 380, 300); sun.addColorStop(0, lerpC('#fff8c0', '#ff4020', n)); sun.addColorStop(1, 'rgba(255,200,100,0)'); ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(780, 380, 300, 0, TAU); ctx.fill();
    // ada + palmiye
    ctx.fillStyle = lerpC('#2a8ad8', '#3a0a0a', n); ctx.fillRect(-300, 1150, W + 600, 900);
    ctx.fillStyle = lerpC('#f2d890', '#4a2a1a', n); ctx.beginPath(); ctx.ellipse(W / 2, 1180, 420, 90, 0, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = lerpC('#8a5a2a', '#1a0a06', n); ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(W / 2, 1120); ctx.quadraticCurveTo(W / 2 + 60, 900, W / 2 + 20, 700); ctx.stroke();
    ctx.fillStyle = lerpC('#3a9a4a', '#2a1a10', n); for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(W / 2 + 20, 700); ctx.rotate(i / 6 * TAU + Math.sin(t * 2) * .05); ctx.beginPath(); ctx.ellipse(110, 0, 120, 26, .3, 0, TAU); ctx.fill(); ctx.restore(); }
    // kabus: kara bulutlar + şimşek
    if (n > .3) { for (let i = 0; i < 8; i++) { ctx.fillStyle = `rgba(30,10,10,${(n - .3) * 1.2})`; ctx.beginPath(); ctx.arc(((i * 170 + t * 60) % 1300) - 100, 200 + (i % 3) * 70, 150, 0, TAU); ctx.fill(); }
      if ((t * 2) % 1 < .08) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.beginPath(); let x = 300, y = 200; ctx.moveTo(x, y); while (y < 1100) { x += (Math.sin(y) * 60); y += 90; ctx.lineTo(x, y); } ctx.stroke(); } }
  });
  if (n < .5) bigText('PARADISE', W / 2, 260, 190, '#fff', seg(t, 11.0, 11.3), { glow: '#5ab8ff' });
  else stampText('NIGHTMARE', W / 2, 260, 170, RED, seg(t, 14.72, 15.0));
  kinetic(['IN', 'A', 'FEW', 'GENERATIONS'], W / 2, 1420, 100, t, 11.8);
}

// ---------- S4 16.08–22.32: nüfus patlaması ----------
const POP = Array.from({ length: 40 }, (_, i) => 8 + Math.pow(i / 39, 2.2) * 32);
function s4(t) {
  bgFinance(t, { tint: 'rgba(255,59,78,.18)', seed: 7, dot: '255,140,140' });
  const p = seg(t, 18.2, 21.6);
  cam({ zoom: 1.03 + .06 * p, t, shake: 2 + 10 * seg(t, 20.9, 21.3) }, () => {
    // insan noktaları ekranı doldurur
    const R = RN(9), n = Math.floor(40 + 900 * eio(p)); for (let i = 0; i < n; i++) { const x = R() * W, y = 400 + R() * 950; ctx.fillStyle = ['#ffd36b', '#ff8a8a', '#5fd3ff', '#fff'][i % 4]; ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(x, y - 10, 8, 0, TAU); ctx.fill(); ctx.fillRect(x - 6, y - 2, 12, 18); } ctx.globalAlpha = 1;
    lineChart(110, 520, 860, 760, POP, p, { col: RED, min: 0, max: 42 });
    const ly = 520 + 760 - 760 * 14 / 42; ctx.strokeStyle = '#ffc83d'; ctx.setLineDash([22, 14]); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(110, ly); ctx.lineTo(970, ly); ctx.stroke(); ctx.setLineDash([]);
    txt('SUSTAINABLE LIMIT', 540, ly - 40, 44, GOLD, { align: 'center', stroke: 8 });
  });
  txt(lerp(8, 40, eio(p)).toFixed(1) + ' BILLION', W / 2, 400, 110, RED, { align: 'center', font: 'Anton', weight: 400, glow: RED });
  kinetic(['NOBODY', 'DIES'], W / 2, 220, 150, t, 16.2, { hl: { DIES: RED } });
  if (t > 20.1) stampText('EXPLODES', W / 2, 1430, 130, RED, seg(t, 20.1, 20.4));
}

// ---------- S5 22.32–26.62: kıtlık ----------
function s5(t) {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 8, dot: '255,140,140' });
  const rows = [['FOOD', 24.14, '#ffb35a'], ['WATER', 24.82, '#5fd3ff'], ['LIVING SPACE', 25.42, '#22e07a']];
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    rows.forEach(([lab, t0, col], i) => { const y = 620 + i * 260, v = 1 - eio(seg(t, t0, t0 + .9)); txt(lab, 120, y - 60, 70, '#fff', { font: 'Anton', weight: 400 });
      ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.roundRect(120, y, 840, 90, 45); ctx.fill(); ctx.fillStyle = v < .3 ? RED : col; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 25; ctx.beginPath(); ctx.roundRect(120, y, Math.max(90, 840 * v), 90, 45); ctx.fill(); ctx.shadowBlur = 0;
      txt(Math.round(v * 100) + '%', 920, y - 60, 70, v < .3 ? RED : '#fff', { align: 'right', font: 'Anton', weight: 400 }); });
  });
  kinetic(['CATASTROPHIC', 'SHORTAGES'], W / 2, 260, 110, t, 22.4, { hl: { SHORTAGES: RED } });
}

// ---------- S6 26.62–31.82: doğum yasağı ----------
function s6(t) {
  darkGrad('#1a1e2a', '#05060a');
  cam({ zoom: 1.04, t, shake: 2 + 14 * seg(t, 27.98, 28.3) * (1 - seg(t, 28.3, 28.8)) }, () => {
    // beşik
    ctx.save(); ctx.translate(W / 2, 980); ctx.rotate(Math.sin(t * 2) * .03); ctx.fillStyle = '#f2ebe0'; ctx.beginPath(); ctx.roundRect(-300, -60, 600, 200, 40); ctx.fill(); ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 14; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-260 + i * 74, -60); ctx.lineTo(-260 + i * 74, -220); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-300, -220); ctx.lineTo(300, -220); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 160, 300, 1.2, Math.PI - 1.2); ctx.stroke(); ctx.restore();
    // resmi mühür
    stampText('BANNED', W / 2, 920, 190, RED, seg(t, 27.98, 28.3), -.18);
    // tokmak
    const g = seg(t, 26.7, 27.2), a = -1.1 + 1.1 * eio(seg(t, 27.6, 27.95)); ctx.save(); ctx.translate(850, 560); ctx.rotate(a); ctx.fillStyle = '#6a3a1a'; ctx.fillRect(-14, 0, 28, 240); ctx.fillStyle = '#8a5a2a'; ctx.beginPath(); ctx.roundRect(-90, -50, 180, 100, 30); ctx.fill(); ctx.restore();
  });
  kinetic(['GOVERNMENTS'], W / 2, 220, 150, t, 26.62);
  kinetic(['BAN', 'CHILDBIRTH'], W / 2, 380, 130, t, 27.9, { hl: { CHILDBIRTH: RED } });
  if (t > 29.78) bigText('TO PREVENT STARVATION', W / 2, 1420, 90, '#ffb35a', seg(t, 29.78, 30.05));
}

// ---------- S7 31.82–38.78: servet en yaşlılarda kilitli, sıfır yükselme ----------
function s7(t) {
  const lad = t > 34.9;
  bgFinance(t, { tint: 'rgba(255,200,61,.2)', seed: 11, dot: '255,220,140' });
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    if (!lad) { // altın yığını üstünde yaşlı + kilit
      for (let r = 0; r < 5; r++) for (let c = 0; c < 6 - r; c++) { const x = W / 2 - (5 - r) * 70 + c * 140, y = 1250 - r * 70; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(x - 60, y); ctx.lineTo(x + 60, y); ctx.lineTo(x + 46, y - 60); ctx.lineTo(x - 46, y - 60); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x - 40, y - 54, 50, 10); }
      ctx.save(); ctx.translate(W / 2, 900); ctx.fillStyle = '#c9c4b4'; ctx.beginPath(); ctx.arc(0, -170, 50, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a5a6a'; ctx.beginPath(); ctx.roundRect(-70, -120, 140, 170, 30); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, -140, 40, 24, 0, 0, Math.PI); ctx.fill();
      ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(90, -60); ctx.lineTo(110, 60); ctx.moveTo(90, -60); ctx.quadraticCurveTo(90, -90, 60, -80); ctx.stroke(); txt('AGE 400', 0, -260, 50, GOLD, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore();
      const lk = eback(seg(t, 32.34, 32.7)); if (lk > 0) { ctx.save(); ctx.translate(W / 2 + 280, 1050); ctx.scale(lk, lk); ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(0, -70, 70, Math.PI, 0); ctx.stroke(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.roundRect(-100, -70, 200, 160, 24); ctx.fill(); ctx.restore(); }
    } else { // gençler: kırık merdiven
      ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(400, 1350); ctx.lineTo(400, 450); ctx.moveTo(680, 1350); ctx.lineTo(680, 450); ctx.stroke();
      for (let i = 0; i < 9; i++) { const y = 1300 - i * 100; if (i > 1) { ctx.strokeStyle = 'rgba(255,59,78,.5)'; ctx.setLineDash([10, 12]); } ctx.beginPath(); ctx.moveTo(400, y); ctx.lineTo(680, y); ctx.stroke(); ctx.setLineDash([]); }
      ctx.save(); ctx.shadowColor = '#5fd3ff'; ctx.shadowBlur = 20; human(540, 1300 - (Math.sin(t * 3) > 0 ? 0 : 20), 220); ctx.restore();
      txt('0%', 850, 760, 220, RED, { align: 'center', font: 'Anton', weight: 400, glow: RED });
    }
  });
  if (!lad) kinetic(['WEALTH', 'LOCKED', 'FOREVER'], W / 2, 260, 120, t, 31.9, { hl: { LOCKED: GOLD } });
  else { kinetic(['YOUNGER', 'PEOPLE'], W / 2, 260, 140, t, 35.3); if (t > 36.58) bigText('ZERO UPWARD MOBILITY', W / 2, 1440, 96, RED, seg(t, 36.58, 36.85), { glow: RED }); }
}

// ---------- S8 38.78–46.76: saat durur, hırs ölür, sonsuz can sıkıntısı ----------
function s8(t) {
  const late = t > 43.5;
  darkGrad(late ? '#2a2a2e' : '#0e0a18', '#050505');
  cam({ zoom: 1.03 + .05 * seg(t, 38.8, 46.7), t, shake: 2 }, () => {
    if (!late) {
      // tik tak saat yavaşlayıp durur
      const sp = 1 - seg(t, 40.86, 41.8), ang = (Math.min(t, 41.8) - 38.8) * 6 * (1 - seg(t, 40.86, 41.8) * .5);
      ctx.save(); ctx.translate(320, 900); ctx.fillStyle = '#f2f4f8'; ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 20; ctx.stroke();
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.strokeStyle = '#222'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 180, Math.sin(a) * 180); ctx.lineTo(Math.cos(a) * 205, Math.sin(a) * 205); ctx.stroke(); }
      ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang - 1.57) * 190, Math.sin(ang - 1.57) * 190); ctx.stroke(); ctx.restore();
      // hırs alevi söner
      const fl = 1 - eio(seg(t, 42.74, 43.4)); ctx.save(); ctx.translate(780, 1050); ctx.fillStyle = '#eef2f8'; ctx.fillRect(-50, 0, 100, 260);
      if (fl > .02) { const h = 220 * fl * (1 + .1 * Math.sin(t * 20)); const g = ctx.createRadialGradient(0, -h * .4, 5, 0, -h * .4, h * .7); g.addColorStop(0, '#fff3c0'); g.addColorStop(.5, '#ff9a2e'); g.addColorStop(1, 'rgba(255,60,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-50 * fl, 0); ctx.quadraticCurveTo(0, -h * 1.4, 50 * fl, 0); ctx.fill(); }
      else { ctx.strokeStyle = 'rgba(200,200,200,.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); for (let y = 0; y < 300; y += 10) ctx.lineTo(Math.sin(y * .04 + t * 3) * 20, -y); ctx.stroke(); } ctx.restore();
      txt('AMBITION', 780, 1380, 60, '#ffb35a', { align: 'center', font: 'Anton', weight: 400 });
    } else {
      // gri şehir, oturup esneyen insanlar
      skyline(1150, t, { seed: 4, tall: 400, col: '#3a3a40' }); ctx.fillStyle = '#4a4a50'; ctx.fillRect(-300, 1150, W + 600, 700);
      for (let i = 0; i < 5; i++) { const x = 140 + i * 200; ctx.fillStyle = '#6a6a72'; ctx.fillRect(x - 60, 1210, 120, 20); ctx.save(); ctx.translate(x, 1210); ctx.fillStyle = '#9a9aa2'; ctx.beginPath(); ctx.arc(0, -150, 34, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-38, -114, 76, 110, 20); ctx.fill(); ctx.fillStyle = '#2a2a2e'; ctx.beginPath(); ctx.ellipse(0, -140, 10, 12 + 6 * Math.max(0, Math.sin(t * 2 + i)), 0, 0, TAU); ctx.fill(); ctx.restore();
        txt('z', x + 40, 990 - ((t * 40 + i * 30) % 80), 40, 'rgba(255,255,255,.6)', { stroke: 0 }); }
      infinity(W / 2, 700, 260, 1, 'rgba(160,160,170,.6)', 16);
    }
  });
  if (!late) { kinetic(['NO', 'TICKING', 'CLOCK'], W / 2, 240, 140, t, 39.6, { hl: { CLOCK: RED } }); if (t > 42.74) stampText('DIES', 780, 820, 110, RED, seg(t, 42.74, 43.0)); }
  else { kinetic(['ENDLESS', 'BOREDOM'], W / 2, 260, 150, t, 44.8, { hl: { BOREDOM: '#9aa2b0' } }); if (t > 46.04) bigText('STAGNATION', W / 2, 1440, 130, '#fff', seg(t, 46.04, 46.3)); }
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 4.92, 10.92, 16.08, 22.32, 26.62, 31.82, 38.78, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 14.72 && t < 14.95 ? .9 : 0) + (t > 27.98 && t < 28.2 ? .7 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
