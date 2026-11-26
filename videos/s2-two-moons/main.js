// Seri2 #10 — "What If Earth Had Two Moons?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 40.99;
const SUBY = 1540;
const MOON2 = '#ffb07a', RED = '#ff3b4e', GOLD = '#ffc83d', SEA = '#2a7ad8', LAVA = '#ff6a1a';

function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function moon2(x, y, r, t) { ctx.save(); ctx.translate(x, y); const gl = ctx.createRadialGradient(0, 0, r * .8, 0, 0, r * 1.8); gl.addColorStop(0, 'rgba(255,170,110,.4)'); gl.addColorStop(1, 'rgba(255,170,110,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, r * 1.8, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, '#ffe0c0'); g.addColorStop(1, '#a8603a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(120,60,30,.35)'; const R = RN(12); for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((R() - .5) * r * 1.2, (R() - .5) * r * 1.2, r * (.08 + R() * .14), 0, TAU); ctx.fill(); } ctx.restore(); }
function hills(y, col, seed) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-300, H); const R = RN(seed); for (let x = -300; x <= W + 300; x += 60) ctx.lineTo(x, y + Math.sin(x * .006 + seed) * 70 + R() * 20); ctx.lineTo(W + 300, H); ctx.fill(); }

// ---------- S1 0–2.7: ikinci ay yakalanır ----------
function s1(t) {
  space(t, 3, { top: '#04061a', bot: '#0e1638' });
  const cap = eo(seg(t, 0, 1.9));
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 2.6)), t, shake: 2 + 10 * seg(t, 1.6, 1.9) * (1 - seg(t, 1.9, 2.4)) }, () => {
    earth(W / 2, 1000, 300, t, { rot: t * .3 });
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.setLineDash([16, 14]); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(W / 2, 1000, 470, 160, -.2, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    const a1 = t * .8; moon(W / 2 + Math.cos(a1) * 470, 1000 + Math.sin(a1) * 160 * .9, 70, { glow: .7 });
    // ikinci ay uzaydan gelip yörüngeye oturur
    const a2 = Math.PI + t * .8, tx = W / 2 + Math.cos(a2) * 470, ty = 1000 + Math.sin(a2) * 150; moon2(lerp(-150, tx, cap), lerp(300, ty, cap), 64, t);
    if (cap < 1) { ctx.strokeStyle = 'rgba(255,176,122,.5)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-150, 300); ctx.quadraticCurveTo(200, 500, lerp(-150, tx, cap), lerp(300, ty, cap)); ctx.stroke(); }
    ring2(tx, ty, seg(t, 1.8, 2.6), 300, MOON2, 10);
  });
  kinetic(['WHAT', 'IF', 'EARTH', 'HAD'], W / 2, 210, 140, t, -.3, { gap: .05 });
  kinetic(['TWO', 'MOONS?'], W / 2, 370, 180, t, .1, { hl: { TWO: MOON2, 'MOONS?': '#fff' } });
}

// ---------- S2 2.7–8.18: gece gökyüzü parlar, karanlık biter ----------
function s2(t) {
  const br = eio(seg(t, 3.3, 5.0));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#02040e', '#1a2a5a', br)); g.addColorStop(1, lerpC('#0a0e24', '#4a5a8a', br)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, t, shake: 1 }, () => {
    const R = RN(4); for (let i = 0; i < 120; i++) { ctx.fillStyle = `rgba(255,255,255,${(.3 + R() * .6) * (1 - br * .7)})`; ctx.beginPath(); ctx.arc(R() * W, R() * 900, R() * 2.2, 0, TAU); ctx.fill(); }
    moon(330, 420, 130, { glow: 1 + br }); moon2(760, 330, 110 * (.6 + .4 * br), t);
    hills(1150, lerpC('#05081a', '#2a3a5a', br), 2); hills(1300, lerpC('#03050e', '#1a2440', br), 5);
    // yere düşen ikili gölgeli insan
    ctx.save(); ctx.translate(W / 2, 1300); ctx.fillStyle = '#05060c'; ctx.beginPath(); ctx.arc(0, -230, 34, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-40, -195, 80, 120, 20); ctx.fill(); ctx.fillRect(-32, -80, 24, 80); ctx.fillRect(8, -80, 24, 80);
    ctx.fillStyle = `rgba(0,0,0,${.4 * br})`; ctx.save(); ctx.transform(1, 0, -.8, .25, 0, 0); ctx.fillRect(-40, -300, 80, 300); ctx.restore(); ctx.save(); ctx.transform(1, 0, .9, .25, 0, 0); ctx.fillRect(-40, -300, 80, 300); ctx.restore(); ctx.restore();
  });
  kinetic(['NIGHT', 'SKY'], W / 2, 620, 150, t, 2.8);
  if (t > 4.32) bigText('2× BRIGHTER', W / 2, 780, 120, GOLD, seg(t, 4.32, 4.6), { glow: GOLD });
  if (t > 6.26) stampText('NO MORE DARKNESS', W / 2, 1440, 100, '#fff', seg(t, 6.26, 6.5));
}
function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }

// ---------- S3 8.18–11.9: bedeli felaket ----------
function s3(t) {
  darkGrad('#1a0408', '#060102');
  const p = seg(t, 8.6, 10.9);
  cam({ zoom: 1.04, t, shake: 2 + 12 * seg(t, 10.34, 10.7) }, () => {
    // terazi: güzellik vs bedel
    const ang = -.35 * eio(p); ctx.save(); ctx.translate(W / 2, 780); ctx.rotate(ang); ctx.strokeStyle = '#cfd8ea'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-380, 0); ctx.lineTo(380, 0); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#9aa7c0'; ctx.beginPath(); ctx.moveTo(W / 2 - 40, 1300); ctx.lineTo(W / 2 + 40, 1300); ctx.lineTo(W / 2, 780); ctx.fill();
    const L = [W / 2 - Math.cos(ang) * 380, 780 - Math.sin(ang) * 380], Rr = [W / 2 + Math.cos(ang) * 380, 780 + Math.sin(ang) * 380];
    moon(L[0], L[1] + 160, 80, { glow: .8 }); moon2(L[0] + 70, L[1] + 140, 60, t); txt('BEAUTY', L[0], L[1] + 290, 56, GOLD, { align: 'center', font: 'Anton', weight: 400 });
    ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(Rr[0] - 110, Rr[1] + 70, 220, 200, 20); ctx.fill(); txt('$$$', Rr[0], Rr[1] + 170, 80, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('PRICE', Rr[0], Rr[1] + 320, 56, RED, { align: 'center', font: 'Anton', weight: 400 });
  });
  kinetic(['BUT...'], W / 2, 240, 180, t, 8.18);
  if (t > 10.34) stampText('CATASTROPHIC', W / 2, 1440, 120, RED, seg(t, 10.34, 10.6));
}

// ---------- S4 11.9–22.38: 8 kat gelgit dalgaları kıyı şehirlerini siler ----------
function s4(t) {
  const late = t > 17.6;
  if (!late) { space(t, 6);
    cam({ zoom: 1.03, t, shake: 2 }, () => {
      const pull = seg(t, 12.5, 14.3); earth(W / 2, 1000, 260, t, { rot: t * .3 });
      ctx.save(); ctx.translate(W / 2, 1000); ctx.fillStyle = 'rgba(70,160,255,.4)'; ctx.beginPath(); ctx.ellipse(0, 0, 260 * (1.05 + .5 * pull), 260 * (1.05 - .1 * pull), 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#9fe0ff'; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
      moon(W / 2 - 440, 1000, 70, { glow: .6 }); moon2(W / 2 + 440, 1000, 64, t);
      for (const sx of [-1, 1]) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.setLineDash([14, 12]); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(W / 2 + sx * 370, 1000); ctx.lineTo(W / 2 + sx * 300, 1000); ctx.stroke(); ctx.setLineDash([]); } });
    const hh = Math.round(lerp(1, 8, eo(seg(t, 15.88, 16.8)))); txt(hh + '×', W / 2, 1420, 200, SEA, { align: 'center', font: 'Anton', weight: 400, glow: '#3da5ff' });
    kinetic(['COMBINED', 'PULL'], W / 2, 230, 150, t, 12.1, { hl: { PULL: MOON2 } }); if (t > 15.16) bigText('HIGHER TIDES', W / 2, 380, 100, '#fff', seg(t, 15.16, 15.4)); return; }
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a3a6a'); g.addColorStop(1, '#6a7aa0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const k = ei(seg(t, 18.6, 21.9));
  cam({ zoom: 1.04, t, shake: 4 + 14 * k }, () => {
    skyline(1200, t, { seed: 11, tall: 600, col: '#1a2240', fall: bx => clamp(k * 1.6 - bx / W) });
    // dev dalga soldan
    const fx = lerp(-700, W + 300, k), h = 800; ctx.fillStyle = SEA; ctx.beginPath(); ctx.moveTo(-600, H); ctx.lineTo(-600, 1200 - h); ctx.quadraticCurveTo(fx - 100, 1200 - h - 60, fx, 1200 - h * .6); ctx.quadraticCurveTo(fx + 60, 1200 - h * .3, fx + 40, H); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(-600, 1200 - h); ctx.quadraticCurveTo(fx - 100, 1200 - h - 60, fx, 1200 - h * .6); ctx.stroke();
    ctx.fillStyle = '#0e1430'; ctx.fillRect(-300, 1200, W + 600, 700);
  });
  pill('TOKYO', 220, 420, 64, RED, seg(t, 19.82, 20.05)); pill('MIAMI', 540, 520, 64, GOLD, seg(t, 20.58, 20.8)); pill('LONDON', 860, 420, 64, '#3da5ff', seg(t, 21.2, 21.4));
  kinetic(['COASTAL', 'CITIES'], W / 2, 230, 150, t, 18.6);
}

// ---------- S5 22.38–29.98: kabukta sürtünme: depremler + volkanlar ----------
function s5(t) {
  darkGrad('#2a0a04', '#0a0201');
  const vol = seg(t, 26.7, 28.0);
  cam({ zoom: 1.04, t, shake: 6 + 10 * Math.max(0, Math.sin(t * 9)) * seg(t, 25.5, 26.2) + 10 * vol }, () => {
    // yer kabuğu kesiti
    for (let i = 0; i < 5; i++) { ctx.fillStyle = ['#6a4a2a', '#5a3a20', '#4a2e18', '#3a1a0c', '#5a1a08'][i]; ctx.fillRect(-300, 1000 + i * 120, W + 600, 120); }
    const mg = ctx.createLinearGradient(0, 1480, 0, 1920); mg.addColorStop(0, LAVA); mg.addColorStop(1, '#8a1a00'); ctx.fillStyle = mg; ctx.fillRect(-300, 1480, W + 600, 500);
    // fay çatlakları
    ctx.strokeStyle = '#ffb35a'; ctx.lineWidth = 6; ctx.shadowColor = LAVA; ctx.shadowBlur = 20; const R = RN(5); for (let k = 0; k < 5; k++) { let x = 150 + k * 200, y = 1000; ctx.beginPath(); ctx.moveTo(x, y); for (let i = 0; i < 8 * seg(t, 23.0 + k * .3, 25.6); i++) { x += (R() - .5) * 60; y += 60; ctx.lineTo(x, y); } ctx.stroke(); } ctx.shadowBlur = 0;
    // volkan
    ctx.fillStyle = '#3a2418'; ctx.beginPath(); ctx.moveTo(W / 2 - 420, 1000); ctx.lineTo(W / 2 - 100, 560); ctx.lineTo(W / 2 + 100, 560); ctx.lineTo(W / 2 + 420, 1000); ctx.fill();
    if (vol > 0) { for (let i = 0; i < 40; i++) { const q = ((t * .8 + i / 40) % 1), a = -Math.PI / 2 + (Math.sin(i * 7) * .6), d = q * 700 * vol; ctx.fillStyle = `rgba(255,${120 + (i % 3) * 40},40,${1 - q})`; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * d, 560 + Math.sin(a) * d + q * q * 400, 18 * (1 - q * .5), 0, TAU); ctx.fill(); }
      for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(60,40,40,${.6 * vol})`; ctx.beginPath(); ctx.arc(W / 2 + Math.sin(i + t) * 60, 460 - i * 70, 80 + i * 20, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = LAVA; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(W / 2 - 60, 570); ctx.quadraticCurveTo(W / 2 - 200, 760, W / 2 - 300, 1000 * vol + 570 * (1 - vol)); ctx.stroke(); }
  });
  kinetic(['NONSTOP', 'EARTHQUAKES'], W / 2, 230, 130, t, 24.8, { hl: { EARTHQUAKES: LAVA } });
  if (t > 26.7) bigText('VOLCANIC ERUPTIONS', W / 2, 380, 100, '#fff', seg(t, 26.7, 26.95), { glow: LAVA });
}

// ---------- S6 29.98–35.6: iki ay çarpışır, ateş yağmuru ----------
function s6(t) {
  space(t, 9);
  const col = seg(t, 30.4, 31.5), rain = seg(t, 32.9, 35.5);
  cam({ zoom: 1.04, t, shake: 4 + 26 * Math.sin(seg(t, 31.44, 32.4) * Math.PI) }, () => {
    if (col < 1) { moon(lerp(150, 500, eio(col)), 520, 120, { glow: .8 }); moon2(lerp(930, 580, eio(col)), 520, 110, t); }
    else { const R = RN(4); for (let i = 0; i < 80; i++) { const a = R() * TAU, d = (t - 31.5) * (200 + R() * 500); ctx.fillStyle = R() > .5 ? '#d8d6cf' : MOON2; ctx.beginPath(); ctx.arc(540 + Math.cos(a) * d, 520 + Math.sin(a) * d * .6, 6 + R() * 18, 0, TAU); ctx.fill(); }
      const fg = ctx.createRadialGradient(540, 520, 10, 540, 520, 400); fg.addColorStop(0, `rgba(255,240,200,${1 - seg(t, 31.5, 32.8)})`); fg.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(540, 520, 400, 0, TAU); ctx.fill(); }
    earth(W / 2, 1650, 650, t, { rot: t * .2, light: Math.PI / 2, term: -.4, dark: .5 });
    // ateşli asteroitler dünyaya yağar
    if (rain > 0) { const R = RN(8); for (let i = 0; i < 40; i++) { const q = ((t * .9 + R()) % 1), x = 100 + R() * 880, y = lerp(500, 1250, q); if (q > rain * 1.2) continue; ctx.strokeStyle = 'rgba(255,170,60,.8)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x - 30, y - 120); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = '#fff3c0'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); } }
  });
  flash(t, 31.44, .3, '255,230,200');
  kinetic(['MOONS', 'COLLIDE'], W / 2, 230, 170, t, 30.6, { hl: { COLLIDE: RED } });
  if (t > 33.86) bigText('BILLIONS OF ASTEROIDS', W / 2, 380, 96, '#ffb35a', seg(t, 33.86, 34.1), { glow: LAVA });
}

// ---------- S7 35.6–40.99: yüzey yaşamı silinir, Satürn gibi halka ----------
function s7(t) {
  space(t, 12);
  const rg = eio(seg(t, 37.8, 40.0));
  cam({ zoom: 1.04 - .04 * rg, rot: -.15, t, shake: 2 }, () => {
    const cx = W / 2, cy = 900;
    // halkanın arka yarısı
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .28); for (let i = 0; i < 10; i++) { ctx.strokeStyle = `rgba(${i % 2 ? '220,200,170' : '180,150,120'},${.6 * rg})`; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(0, 0, 480 + i * 22, Math.PI, TAU); ctx.stroke(); } ctx.restore();
    earth(cx, cy, 360, t, { rot: t * .3, sea0: '#5a4a3a', sea1: '#2a1a10', land: '#3a2a1a' });
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .28); for (let i = 0; i < 10; i++) { ctx.strokeStyle = `rgba(${i % 2 ? '220,200,170' : '180,150,120'},${.7 * rg})`; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(0, 0, 480 + i * 22, 0, Math.PI); ctx.stroke(); } ctx.restore();
  });
  if (t < 38.1) { kinetic(['SURFACE', 'LIFE'], W / 2, 230, 160, t, 36.3); if (t > 35.78) stampText('WIPED OUT', W / 2, 1440, 130, RED, seg(t, 35.78, 36.05)); }
  else { kinetic(['A', 'SATURN-LIKE', 'RING'], W / 2, 230, 130, t, 38.7, { hl: { RING: GOLD } }); }
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 2.7, 8.18, 11.9, 22.38, 29.98, 35.6, 99], S = [s1, s2, s3, s4, s5, s6, s7];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 10.34 && t < 10.5 ? .7 : 0) + (t > 31.44 && t < 31.7 ? 1 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
