// Seri2 #11 — "What If All Trees Disappeared?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 46.92;
const SUBY = 1540;
const LEAF = '#3ad06a', RED = '#ff3b4e', GOLD = '#ffc83d', SKY = '#5fd3ff', SOIL = '#6a4224';

function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function tree(x, y, s, t, k = 1, col = '#2f8a3a') { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#6a4224'; ctx.beginPath(); ctx.moveTo(-s * .06, 0); ctx.lineTo(-s * .04, -s * .5); ctx.lineTo(s * .04, -s * .5); ctx.lineTo(s * .06, 0); ctx.fill();
  const sw = Math.sin(t * 1.5 + x) * s * .02; ctx.fillStyle = col; for (const [dx, dy, r] of [[0, -.75, .3], [-.22, -.58, .22], [.22, -.58, .22], [-.12, -.9, .2], [.14, -.88, .2]]) { ctx.beginPath(); ctx.arc(dx * s + sw, dy * s, r * s, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(-s * .1 + sw, -s * .85, s * .12, 0, TAU); ctx.fill(); ctx.restore(); }

// ---------- S1 0–3.16: tüm ağaçlar bir gecede yok olur ----------
function s1(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#6ac0ff'); g.addColorStop(1, '#d8f0ff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 3.1)), t, shake: 2 + 10 * seg(t, 1.66, 1.9) * (1 - seg(t, 1.9, 2.4)) }, () => {
    ctx.fillStyle = '#5aa83a'; ctx.fillRect(-300, 1150, W + 600, 800);
    const R = RN(3); for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const x = 40 + i * 170 + (r % 2) * 85 + R() * 30, y = 1150 + r * 130, s = 360 + r * 60, t0 = 1.5 + R() * .5, v = seg(t, t0, t0 + .3);
      tree(x, y, s, t, 1 - eo(v), lerpC('#2f8a3a', '#4aa84a', r / 3)); if (v > 0) shards(x, y - s * .7, seg(t, t0, t0 + 1.3), 14, i + r * 9, R2 => R2 > .5 ? '#3ad06a' : '#8ae06a', 14, 380); }
  });
  kinetic(['WHAT', 'IF', 'ALL', 'TREES'], W / 2, 210, 150, t, -.3, { gap: .05, hl: { TREES: LEAF } });
  kinetic(['DISAPPEARED?'], W / 2, 380, 170, t, .1, { hl: { 'DISAPPEARED?': RED } });
  flash(t, 1.66, .15, '255,255,255');
}

// ---------- S2 3.16–7.7: yaşanmaz çorak arazi ----------
function s2(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9a8a7a'); g.addColorStop(1, '#d8c0a0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, x: -(t - 3.16) * 20, t, shake: 2 }, () => {
    ctx.fillStyle = '#b89a70'; ctx.beginPath(); ctx.moveTo(-300, H); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, 1100 + Math.sin(x * .005) * 60); ctx.lineTo(W + 300, H); ctx.fill();
    ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 4; const R = RN(5); for (let i = 0; i < 40; i++) { let x = R() * W, y = 1150 + R() * 600; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (R() - .5) * 100; y += R() * 40; ctx.lineTo(x, y); } ctx.stroke(); }
    for (let i = 0; i < 90; i++) { const y = R() * H, x = ((R() * W * 2 + t * 600 * (.5 + R())) % (W + 400)) - 200; ctx.strokeStyle = `rgba(160,130,100,${.2 + R() * .3})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 80, y + 4); ctx.stroke(); }
    // kurumuş kemik ve boş yuva
    ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.ellipse(400, 1260, 70, 18, .2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(330, 1250, 22, 0, TAU); ctx.arc(470, 1275, 22, 0, TAU); ctx.fill();
  });
  kinetic(['UNINHABITABLE'], W / 2, 260, 140, t, 4.9, { hl: { UNINHABITABLE: RED } });
  if (t > 5.86) stampText('WASTELAND', W / 2, 1420, 150, '#5a3a20', seg(t, 5.86, 6.1));
}

// ---------- S3 7.7–14.16: ağaç CO2 emer, O2 verir ----------
function s3(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0c2a1a'); g.addColorStop(1, '#04100a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, t, shake: 1 }, () => {
    ctx.fillStyle = '#2a4a2a'; ctx.fillRect(-300, 1350, W + 600, 700);
    tree(W / 2, 1350, 900, t, eback(seg(t, 7.7, 8.2)), '#2f9a4a');
    // CO2 içeri (gri), O2 dışarı (mavi)
    for (let i = 0; i < 14; i++) { const q = ((t * .5 + i / 14) % 1); if (t > 7.9) { const a = i / 14 * TAU, d = lerp(600, 200, q); ctx.fillStyle = `rgba(120,120,130,${Math.sin(q * Math.PI)})`; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * d, 900 + Math.sin(a) * d * .7, 22, 0, TAU); ctx.fill(); }
      if (t > 10.72) { const a = i / 14 * TAU + .2, d = lerp(220, 650, q); ctx.fillStyle = `rgba(95,211,255,${Math.sin(q * Math.PI)})`; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * d, 800 + Math.sin(a) * d * .7, 26, 0, TAU); ctx.fill(); ctx.stroke(); } }
  });
  pill('CO2 IN', 260, 470, 70, '#8a8a92', seg(t, 9.26, 9.5)); pill('O2 OUT', 820, 470, 70, SKY, seg(t, 12.2, 12.45));
  kinetic(['TREES', 'ABSORB'], W / 2, 230, 150, t, 7.7, { hl: { ABSORB: LEAF } });
}

// ---------- S4 14.16–22.5: sera gazı fırlar, sıcaklık yükselir ----------
function s4(t) {
  const h = eio(seg(t, 15.6, 20.6));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#1a2a3a', '#4a0a08', h)); g.addColorStop(1, lerpC('#0a1018', '#200402', h)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, t, shake: 2 + 8 * h }, () => {
    earth(W / 2, 1000, 330, t, { rot: t * .3 });
    // sera tabakası: kalınlaşan gri kubbe, ısı okları içerde seker
    ctx.strokeStyle = `rgba(160,150,140,${.3 + .6 * h})`; ctx.lineWidth = 20 + 60 * h; ctx.beginPath(); ctx.arc(W / 2, 1000, 470, 0, TAU); ctx.stroke();
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t * .3, q = ((t * .8 + i / 6) % 1); ctx.strokeStyle = `rgba(255,120,40,${.9 * Math.sin(q * Math.PI) * h})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * 340, 1000 + Math.sin(a) * 340); ctx.lineTo(W / 2 + Math.cos(a) * (340 + 110 * q), 1000 + Math.sin(a) * (340 + 110 * q)); ctx.stroke(); }
    // CO2 çubuğu
    ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(900, 420, 80, 400); ctx.fillStyle = RED; ctx.shadowColor = RED; ctx.shadowBlur = 20; ctx.fillRect(900, 820 - 400 * (.25 + .75 * eo(seg(t, 15.4, 16.6))), 80, 400 * (.25 + .75 * eo(seg(t, 15.4, 16.6)))); ctx.shadowBlur = 0; txt('CO2', 940, 870, 44, '#fff', { align: 'center', font: 'Anton', weight: 400 });
    // termometre
    ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.roundRect(100, 420, 70, 400, 35); ctx.fill(); ctx.beginPath(); ctx.arc(135, 840, 60, 0, TAU); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(135, 840, 44, 0, TAU); ctx.fill(); ctx.fillRect(117, 820 - 360 * (.2 + .8 * eo(seg(t, 19.1, 20.6))), 36, 360 * (.2 + .8 * eo(seg(t, 19.1, 20.6))) + 20);
  });
  kinetic(['GREENHOUSE', 'GASES'], W / 2, 230, 140, t, 15.3);
  if (t > 16.36) stampText('SKYROCKET', W / 2, 1440, 140, RED, seg(t, 16.36, 16.6));
}

// ---------- S5 22.5–26.78: kökler toprağı tutan dev ağlar ----------
function s5(t) {
  darkGrad('#1a0e06', '#0a0402');
  const gr = eo(seg(t, 22.6, 24.6));
  cam({ zoom: 1.04, t, shake: 1 }, () => {
    const g = ctx.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, '#7ac8ff'); g.addColorStop(1, '#cfeaff'); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, 900);
    ctx.fillStyle = '#4aa83a'; ctx.fillRect(-300, 600, W + 600, 40);
    const R0 = RN(2); for (let i = 0; i < 260; i++) { ctx.fillStyle = ['#6a4224', '#5a3a20', '#7a5230'][i % 3]; ctx.beginPath(); ctx.arc(R0() * W, 640 + R0() * 1200, 10 + R0() * 16, 0, TAU); ctx.fill(); }
    tree(W / 2, 620, 700, t, 1, '#2f8a3a');
    // kök ağı
    ctx.strokeStyle = '#c9934a'; ctx.lineCap = 'round'; const draw = (x, y, a, len, w, d) => { if (d > 6) return; const p = clamp(gr * 7 - d), ex = x + Math.cos(a) * len * p, ey = y + Math.sin(a) * len * p; if (p <= 0) return; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke(); if (p >= 1) { draw(ex, ey, a - .5, len * .78, w * .7, d + 1); draw(ex, ey, a + .5, len * .78, w * .7, d + 1); } };
    draw(W / 2, 640, Math.PI / 2, 170, 30, 0);
    // ağ ışıltısı
    ctx.strokeStyle = `rgba(255,220,140,${.3 * gr})`; ctx.lineWidth = 3; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(80, 800 + i * 120); ctx.lineTo(1000, 800 + i * 120 + (i % 2 ? 40 : -40)); ctx.stroke(); }
  });
  kinetic(['UNDERGROUND', 'NETS'], W / 2, 230, 140, t, 23.8, { hl: { NETS: GOLD } });
}

// ---------- S6 26.78–36.12: yağmur toprağı süpürür, çamur kayması, çöl ----------
function s6(t) {
  const late = t > 32.9, ms = eio(seg(t, 31.0, 32.6));
  if (!late) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a4250'); g.addColorStop(1, '#7a8090'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    cam({ zoom: 1.04, t, shake: 2 + 16 * Math.sin(ms * Math.PI) }, () => {
      // eğimli yamaç
      ctx.fillStyle = '#7a5230'; ctx.beginPath(); ctx.moveTo(-300, 500); ctx.lineTo(W + 300, 1300); ctx.lineTo(W + 300, H); ctx.lineTo(-300, H); ctx.fill();
      // kayan toprak
      ctx.fillStyle = '#5a3a1a'; ctx.beginPath(); const sx = lerp(0, 600, ms); ctx.moveTo(-300 + sx, 500 + sx * .62); for (let i = 0; i <= 10; i++) { const x = -300 + sx + i * 90, y = 500 + (sx + i * 90 + 300) * .62 - 80 - Math.sin(i * .9 + t * 6) * 20; ctx.lineTo(x, y); } ctx.lineTo(sx + 600, 1300 + sx * .2); ctx.lineTo(sx - 300, 1200); ctx.fill();
      // evler
      for (let i = 0; i < 3; i++) { const x = 650 + i * 140, y = 1080 + i * 90; ctx.save(); ctx.translate(x, y); ctx.rotate(ms * (.3 + i * .1)); ctx.fillStyle = '#e8d8c0'; ctx.fillRect(-50, -80, 100, 80); ctx.fillStyle = '#b04a3a'; ctx.beginPath(); ctx.moveTo(-60, -80); ctx.lineTo(0, -130); ctx.lineTo(60, -80); ctx.fill(); ctx.restore(); }
      // yağmur
      ctx.strokeStyle = 'rgba(200,220,255,.6)'; ctx.lineWidth = 3; const R = RN(4); for (let i = 0; i < 140; i++) { const x = R() * W, y = ((R() * H + t * 1600) % H); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 40); ctx.stroke(); } });
    kinetic(['HEAVY', 'RAINS'], W / 2, 230, 160, t, 27.8, { hl: { RAINS: SKY } }); if (t > 31.72) stampText('MUDSLIDES', W / 2, 1440, 140, '#ffb35a', seg(t, 31.72, 32.0)); return; }
  const d = eio(seg(t, 33.2, 35.2));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#8ad0ff', '#f2c890', d)); g.addColorStop(1, lerpC('#d8f0ff', '#e8b070', d)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    ctx.fillStyle = lerpC('#5aa83a', '#d8a060', d); ctx.fillRect(-300, 800, W + 600, 1200);
    for (let r = 0; r < 12; r++) { const y = 820 + r * 60 + r * r * 3; ctx.strokeStyle = lerpC('#3a8a2a', '#c09050', d); ctx.lineWidth = 10 + r; ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(W + 100, y); ctx.stroke(); }
    if (d > .5) { ctx.fillStyle = `rgba(200,150,90,${d - .5})`; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(200 + i * 200, 1000 + (i % 2) * 120, 160, 40, 0, 0, TAU); ctx.fill(); } }
  });
  kinetic(['FARMLAND'], W / 2, 230, 170, t, 33.0); if (t > 34.22) bigText('BARREN DESERTS', W / 2, 400, 110, '#7a3a1a', seg(t, 34.22, 34.5), { glow: '#fff' });
}

// ---------- S7 36.12–43.3: hayvanlar evsiz, besin zinciri çöker ----------
function s7(t) {
  const late = t > 40.4;
  if (late) darkGrad('#1a1408', '#060402'); else darkGrad('#ff9a5a', '#7a3a1a');
  cam({ zoom: 1.03, t, shake: 2 + (late ? 18 * Math.sin(seg(t, 40.66, 41.6) * Math.PI) : 0) }, () => {
    if (!late) { // yuvasız kalan kuş, maymun, baykuş
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(-300, 1250, W + 600, 700);
      // düşen yuva
      const f = eio(seg(t, 37.74, 38.6)); ctx.save(); ctx.translate(540, lerp(700, 1200, f)); ctx.scale(1.6, 1.6); ctx.rotate(f * 2); ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 90, .1, Math.PI - .1); ctx.stroke(); ctx.fillStyle = '#e8f0ff'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(-40 + i * 40, 30, 22, 28, 0, 0, TAU); ctx.fill(); } ctx.restore();
      for (let i = 0; i < 5; i++) { const x = 140 + i * 200, q = ((t * .6 + i / 5) % 1); ctx.fillStyle = '#1a1e2a'; const by = 420 + (i % 2) * 120 + Math.sin(t * 8 + i) * 20, bx = x + q * 80; ctx.beginPath(); ctx.ellipse(bx, by, 80, 28, 0, 0, TAU); ctx.fill(); for (const sg of [1, -1]) { ctx.beginPath(); ctx.moveTo(bx - 10, by); ctx.lineTo(bx - 70, by - sg * 80 * Math.sin(t * 14 + i)); ctx.lineTo(bx + 40, by); ctx.fill(); } }
      // boş tabak = yiyecek yok
      ctx.fillStyle = '#d8dee8'; ctx.beginPath(); ctx.ellipse(850, 1220, 130, 34, 0, 0, TAU); ctx.fill();
    } else { // besin zinciri piramidi çöker
      const c = seg(t, 40.66, 42.2); const lv = [['PLANTS', LEAF, 560], ['INSECTS', GOLD, 440], ['HERBIVORES', '#ff8a3a', 320], ['PREDATORS', RED, 200], ['HUMANS', '#9b6bff', 100]];
      lv.forEach(([l, col, w], i) => { const y = 1250 - i * 150, q = clamp(c * 1.5 - (4 - i) * .1), dx = q * (i % 2 ? 200 : -200), dy = q * q * 900; ctx.save(); ctx.translate(W / 2 + dx, y + dy); ctx.rotate(q * (i % 2 ? .6 : -.6)); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w, -60, w * 2, 120, 20); ctx.fill(); txt(l, 0, 0, 50, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); });
      stampX(W / 2, 1250, 260, seg(t, 40.4, 40.7)); }
  });
  if (!late) { kinetic(['BILLIONS', 'OF', 'ANIMALS'], W / 2, 220, 130, t, 36.12); if (t > 38.2) bigText('HOMELESS & HUNGRY', W / 2, 1440, 100, '#fff', seg(t, 38.2, 38.45)); }
  else kinetic(['FOOD', 'CHAIN', 'COLLAPSES'], W / 2, 230, 120, t, 41.0, { hl: { COLLAPSES: RED } });
}

// ---------- S8 43.3–46.92: insanlar azalan oksijen ve mahsul için savaşır ----------
function s8(t) {
  darkGrad('#2a0a06', '#080202');
  cam({ zoom: 1.04, t, shake: 4 + 6 * Math.max(0, Math.sin(t * 9)) }, () => {
    ctx.fillStyle = '#3a2418'; ctx.fillRect(-300, 1300, W + 600, 700);
    // oksijen tüpü
    const tug = Math.sin(t * 5) * 30; ctx.save(); ctx.translate(W / 2 + tug, 1000); ctx.rotate(Math.PI / 2); ctx.fillStyle = SKY; ctx.beginPath(); ctx.roundRect(-70, -220, 140, 440, 60); ctx.fill(); ctx.fillStyle = '#d8dee8'; ctx.fillRect(-26, -260, 52, 50); txt('O2', 0, 0, 90, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    // iki taraf çekiyor
    for (const sx of [-1, 1]) { ctx.save(); ctx.translate(W / 2 + sx * 380 + tug, 1300); ctx.scale(sx, 1); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-40, -420, 50, 0, TAU); ctx.fill(); ctx.save(); ctx.rotate(-.25); ctx.beginPath(); ctx.roundRect(-110, -370, 120, 220, 30); ctx.fill(); ctx.restore(); ctx.strokeStyle = '#111'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-30, -320); ctx.lineTo(150, -300); ctx.moveTo(-80, -160); ctx.lineTo(-170, 0); ctx.moveTo(-20, -160); ctx.lineTo(60, 0); ctx.stroke(); ctx.restore(); }
    // son buğday başakları
    for (let i = 0; i < 5; i++) { const x = 380 + i * 80; ctx.strokeStyle = '#c9a04a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, 1300); ctx.lineTo(x + Math.sin(t * 2 + i) * 10, 1180); ctx.stroke(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.ellipse(x + Math.sin(t * 2 + i) * 10, 1160, 10, 26, 0, 0, TAU); ctx.fill(); }
  });
  kinetic(['FIGHTING', 'FOR', 'OXYGEN'], W / 2, 260, 140, t, 43.6, { hl: { OXYGEN: SKY } });
  if (t > 46.34) bigText('AND CROPS', W / 2, 420, 110, GOLD, seg(t, 46.34, 46.6));
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 3.16, 7.7, 14.16, 22.5, 26.78, 36.12, 43.3, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 1.66 && t < 1.85 ? .7 : 0) + (t > 40.66 && t < 40.85 ? .7 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
