// 5.video — "What If Humans Lived on Mars?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 38.43;
const SUBY = 1540;

// ---------- yardımcılar ----------
const MCR = (() => { const R = RN(17); return Array.from({ length: 30 }, () => [R() * TAU, (R() - .5) * 2.4, .04 + R() * .12]); })();
function mars(x, y, r, t, o = {}) {
  const rot = o.rot ?? t * .2; ctx.save(); ctx.translate(x, y);
  const halo = ctx.createRadialGradient(0, 0, r * .95, 0, 0, r * 1.25); halo.addColorStop(0, 'rgba(255,140,90,.35)'); halo.addColorStop(1, 'rgba(255,140,90,0)'); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, r * 1.25, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
  const g = ctx.createRadialGradient(-r * .35, -r * .35, r * .1, 0, 0, r); g.addColorStop(0, '#f08a52'); g.addColorStop(.6, '#c4512b'); g.addColorStop(1, '#6a1f10'); ctx.fillStyle = g; ctx.fillRect(-r, -r, 2 * r, 2 * r);
  for (const [lon, lat, s] of MCR) { const l = lon + rot, z = Math.cos(lat) * Math.cos(l); if (z < 0) continue; const px = r * Math.cos(lat) * Math.sin(l), py = -r * Math.sin(lat) * .9;
    ctx.fillStyle = 'rgba(90,25,10,.35)'; ctx.beginPath(); ctx.ellipse(px, py, r * s * Math.max(.2, z), r * s, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(120,35,15,.35)'; ctx.beginPath(); ctx.ellipse(Math.sin(rot) * r * .3, r * .1, r * .7, r * .08, -.15, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff1e6'; ctx.beginPath(); ctx.ellipse(0, -r * .96, r * .35, r * .1, 0, 0, TAU); ctx.fill();
  if (o.lights) o.lights(r, rot);
  ctx.restore();
  const sh = ctx.createLinearGradient(-r * .2, 0, r * 1.05, 0); sh.addColorStop(0, 'rgba(0,0,10,0)'); sh.addColorStop(1, 'rgba(0,0,10,.75)'); ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.restore();
}
function astro(x, y, s, t, o = {}) {      // astronot; (x,y) = ayak, s = boy
  ctx.save(); ctx.translate(x, y); const st = o.stretch || 1; ctx.scale(1 / Math.sqrt(st), st);
  const sw = Math.sin(t * (o.walk ? 6 : 0)) * .3;
  ctx.strokeStyle = '#e8ecf2'; ctx.lineCap = 'round'; ctx.lineWidth = s * .13;
  ctx.beginPath(); ctx.moveTo(-s * .08, -s * .45); ctx.lineTo(-s * .1 - sw * s * .1, -s * .03); ctx.moveTo(s * .08, -s * .45); ctx.lineTo(s * .1 + sw * s * .1, -s * .03); ctx.stroke();
  ctx.lineWidth = s * .1; const ar = o.arms ?? .3; ctx.beginPath(); ctx.moveTo(-s * .17, -s * .78); ctx.lineTo(-s * .27, -s * (.55 + ar * .4)); ctx.moveTo(s * .17, -s * .78); ctx.lineTo(s * .27, -s * (.55 + ar * .4)); ctx.stroke();
  ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.roundRect(-s * .2, -s * .86, s * .4, s * .36, s * .06); ctx.fill();
  ctx.fillStyle = '#f4f6fa'; ctx.beginPath(); ctx.roundRect(-s * .18, -s * .86, s * .36, s * .44, s * .1); ctx.fill();
  ctx.fillStyle = '#ff6a2e'; ctx.fillRect(-s * .06, -s * .76, s * .12, s * .06);
  ctx.fillStyle = '#f4f6fa'; ctx.beginPath(); ctx.arc(0, -s * .95, s * .16, 0, TAU); ctx.fill();
  const v = ctx.createLinearGradient(0, -s * 1.05, 0, -s * .88); v.addColorStop(0, '#ffcf6b'); v.addColorStop(1, '#a8550f'); ctx.fillStyle = o.visor || v; ctx.beginPath(); ctx.ellipse(s * .03, -s * .96, s * .11, s * .08, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(-s * .01, -s * .99, s * .03, s * .015, -.4, 0, TAU); ctx.fill();
  ctx.restore();
}
function marsGround(y, t, seed = 2) { const g = ctx.createLinearGradient(0, y, 0, y + 700); g.addColorStop(0, '#c4512b'); g.addColorStop(1, '#5a1a0c'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); const R = RN(seed); for (let x = -300; x <= W + 300; x += 90) ctx.lineTo(x, y + (R() - .5) * 40); ctx.lineTo(W + 300, H + 300); ctx.fill();
  ctx.fillStyle = 'rgba(80,20,8,.5)'; for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.ellipse(R() * W, y + 60 + R() * 500, 30 + R() * 60, 10 + R() * 14, 0, 0, TAU); ctx.fill(); } }
function marsSky(top = '#f2b38a', bot = '#c7663e') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function dust(t, n, a = .5, spd = 900, seed = 4) { const R = RN(seed); for (let i = 0; i < n; i++) { const y = R() * H, x = ((R() * W * 2 + t * spd * (.5 + R())) % (W + 400)) - 200, l = 40 + R() * 120;
  ctx.strokeStyle = `rgba(230,120,70,${a * (.3 + R() * .7)})`; ctx.lineWidth = 3 + R() * 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y + l * .1); ctx.stroke(); } }

// ---------- S1 0–3.42: roket Mars'a dalar ----------
function rocketV(x, y, s, a, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  const f = 1 + .35 * Math.sin(t * 50); const g = ctx.createLinearGradient(0, s * .5, 0, s * (1.4 * f)); g.addColorStop(0, '#fff3c0'); g.addColorStop(.4, '#ff9a2e'); g.addColorStop(1, 'rgba(255,60,20,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-s * .16, s * .45); ctx.lineTo(0, s * 1.4 * f); ctx.lineTo(s * .16, s * .45); ctx.fill();
  ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.moveTo(0, -s * .6); ctx.quadraticCurveTo(s * .2, -s * .3, s * .18, s * .45); ctx.lineTo(-s * .18, s * .45); ctx.quadraticCurveTo(-s * .2, -s * .3, 0, -s * .6); ctx.fill();
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-s * .18, s * .15); ctx.lineTo(-s * .36, s * .5); ctx.lineTo(-s * .18, s * .45); ctx.fill(); ctx.beginPath(); ctx.moveTo(s * .18, s * .15); ctx.lineTo(s * .36, s * .5); ctx.lineTo(s * .18, s * .45); ctx.fill();
  ctx.fillStyle = '#3da5ff'; ctx.beginPath(); ctx.arc(0, -s * .15, s * .08, 0, TAU); ctx.fill(); ctx.restore(); }
function s1(t) {
  space(t, 5, { drift: 60 });
  const dive = eio(seg(t, 1.6, 3.4));
  cam({ zoom: 1 + 1.2 * dive, y: 400 * dive, t, shake: 5 + 10 * dive }, () => {
    mars(W / 2, 1150, 520, t, { rot: t * .3 });
    const p = seg(t, 0, 2.2); rocketV(lerp(180, 560, eo(p)), lerp(250, 820, eo(p)), 260, 2.5 + Math.sin(t * 3) * .05, t);
  });
  kinetic(['WHAT', 'IF', 'HUMANS'], W / 2, 210, 140, t, 0, { gap: .06 });
  kinetic(['LIVED', 'ON', 'MARS?'], W / 2, 380, 160, t, 1.3, { hl: { 'MARS?': '#ff7a3a' } });
  flash(t, 2.16, .2, '255,170,120');
}

// ---------- S2 3.42–6.44: atmosfer + manyetik kalkan soyulur ----------
function fieldLines(cx, cy, r, a, col) { ctx.strokeStyle = col; ctx.lineWidth = 4; for (let k = 1; k <= 4; k++) { const L = r * (1.2 + k * .35); for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + sx * L * .55, cy, L * .55, L * .42, 0, 0, TAU); ctx.globalAlpha = a * (1 - k * .15); ctx.stroke(); } } ctx.globalAlpha = 1; }
function s2(t) {
  space(t, 9);
  const brk = seg(t, 5.52, 6.2);
  cam({ zoom: 1.02, t, shake: 3 + 18 * Math.sin(brk * Math.PI) }, () => {
    earth(220, 300, 130, t, { rot: t * .5 }); fieldLines(220, 300, 130, .7, '#5fd3ff');
    txt('EARTH', 220, 500, 44, '#9fe0ff', { align: 'center', stroke: 6 });
    const cx = W / 2 + 60, cy = 960, r = 330;
    // kalkan balonu kırılır
    if (brk < 1) { ctx.save(); ctx.globalAlpha = (1 - brk) * seg(t, 3.5, 3.9); ctx.strokeStyle = '#5fd3ff'; ctx.lineWidth = 10; ctx.shadowColor = '#5fd3ff'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(cx, cy, r * 1.45, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(95,211,255,.08)'; ctx.fill(); ctx.restore(); }
    if (t > 5.52) { ctx.save(); ctx.strokeStyle = '#bff0ff'; ctx.lineWidth = 6; const R = RN(3); for (let k = 0; k < 10; k++) { const a = R() * TAU; ctx.globalAlpha = 1 - brk; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 1.45, cy + Math.sin(a) * r * 1.45); ctx.lineTo(cx + Math.cos(a + .2) * r * 1.2, cy + Math.sin(a + .2) * r * 1.2); ctx.stroke(); } ctx.restore();
      shards(cx, cy, seg(t, 5.52, 6.5), 60, 7, '#9fe8ff', 20, 900); }
    // atmosfer parçacıkları güneş rüzgarıyla süpürülür
    const R = RN(5), strip = seg(t, 3.5, 5.0); for (let i = 0; i < 160; i++) { const a = R() * TAU, d = r * (1.04 + R() * .12), q = clamp(strip * 1.3 - R() * .3);
      ctx.fillStyle = `rgba(150,210,255,${.65 * (1 - q)})`; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d + q * (500 + R() * 600), cy + Math.sin(a) * d, 5 + R() * 6, 0, TAU); ctx.fill(); }
    mars(cx, cy, r, t, { rot: t * .2 });
  });
  kinetic(['STRIPPED'], 700, 300, 130, t, 3.42, { hl: { STRIPPED: C.red }, maxW: 600 });
  bigText('NO ATMOSPHERE', W / 2, 1420, 110, '#9fe0ff', seg(t, 4.34, 4.6) * (1 - seg(t, 5.1, 5.25)));
  bigText('NO MAGNETIC SHIELD', W / 2, 1420, 100, C.red, seg(t, 5.2, 5.45), { glow: C.red });
}

// ---------- S3 6.44–9.4: güneş radyasyonu ----------
function trefoil(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#ffd23a'; ctx.beginPath(); ctx.arc(0, 0, s, 0, TAU); ctx.fill(); ctx.fillStyle = '#111';
  for (let i = 0; i < 3; i++) { const a = i * TAU / 3 - Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(a - .5) * s * .22, Math.sin(a - .5) * s * .22); ctx.arc(0, 0, s * .85, a - .5, a + .5); ctx.arc(0, 0, s * .22, a + .5, a - .5, true); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, 0, s * .15, 0, TAU); ctx.fill(); ctx.restore(); }
function s3(t) {
  marsSky('#3a1208', '#8a3418');
  const hit = seg(t, 7.88, 8.3);
  cam({ zoom: 1.04, t, shake: 3 + 8 * hit }, () => {
    const sx = 140, sy = 200, sg = ctx.createRadialGradient(sx, sy, 20, sx, sy, 420); sg.addColorStop(0, '#fff8d0'); sg.addColorStop(.3, '#ffb12e'); sg.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 420, 0, TAU); ctx.fill();
    marsGround(1320, t);
    astro(640, 1320, 560, t, { arms: .9 });
    // dalgalı radyasyon ışınları
    for (let k = 0; k < 7; k++) { const q = ((t * 1.3 + k / 7) % 1), ang = .78 + (k - 3) * .07; ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang);
      ctx.strokeStyle = `rgba(180,255,90,${.85 * Math.sin(q * Math.PI)})`; ctx.lineWidth = 7; ctx.shadowColor = '#b4ff5a'; ctx.shadowBlur = 20; ctx.beginPath();
      for (let d = 0; d < 1400 * q; d += 12) ctx.lineTo(d, Math.sin(d * .05 - t * 20) * 18); ctx.stroke(); ctx.restore(); }
    if (hit > 0) { ctx.fillStyle = `rgba(180,255,90,${.15 + .1 * Math.sin(t * 20)})`; ctx.beginPath(); ctx.arc(640, 1050, 280, 0, TAU); ctx.fill(); }
  });
  trefoil(870, 360, 110 * eback(seg(t, 7.3, 7.7)), t);
  const msv = Math.round(700 * eo(seg(t, 8.2, 9.2)));
  if (t > 8.2) { txt(msv + ' mSv', W / 2, 1440, 120, '#b4ff5a', { align: 'center', font: 'Anton', weight: 400, glow: '#7aff3a' }); }
  kinetic(['SOLAR', 'RADIATION'], W / 2, 640, 120, t, 7.8, { hl: { RADIATION: '#b4ff5a' } });
}

// ---------- S4 9.42–11.16: dondurucu soğuk ----------
function s4(t) {
  marsSky('#1a2a44', '#6a5a70');
  const fr = seg(t, 9.6, 11.0);
  cam({ zoom: 1.08 - .05 * fr, t, shake: Math.sin(t * 50) * 4 }, () => {
    marsGround(1350, t, 5);
    ctx.fillStyle = `rgba(230,245,255,${.55 * fr})`; ctx.fillRect(-300, 1350, W + 600, 700);
    // dev termometre
    const tx = W / 2, top = 330, bot = 1180; ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.roundRect(tx - 60, top, 120, bot - top, 60); ctx.fill(); ctx.beginPath(); ctx.arc(tx, bot + 40, 120, 0, TAU); ctx.fill();
    const lvl = lerp(top + 200, bot - 30, eo(fr)); ctx.fillStyle = '#3da5ff'; ctx.beginPath(); ctx.arc(tx, bot + 40, 90, 0, TAU); ctx.fill(); ctx.fillRect(tx - 32, lvl, 64, bot + 40 - lvl);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = '#9aa7c0'; ctx.fillRect(tx + 70, top + 60 + i * 90, 50, 8); }
  });
  // köşelerde buz kristalleri
  const R = RN(11); ctx.strokeStyle = `rgba(230,250,255,${.8 * fr})`; ctx.lineWidth = 4;
  for (let i = 0; i < 40; i++) { const corner = i % 4, cx = corner % 2 ? W : 0, cy = corner > 1 ? H : 0, a = R() * Math.PI / 2 + (corner === 1 ? Math.PI / 2 : corner === 2 ? -Math.PI / 2 : corner === 3 ? Math.PI : 0), l = (100 + R() * 350) * fr;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l); ctx.stroke(); }
  txt(Math.round(-63 * eo(fr)) + '°C', W / 2, 1460, 170, '#bfe6ff', { align: 'center', font: 'Anton', weight: 400, glow: '#3da5ff' });
  kinetic(['SUBZERO'], W / 2, 200, 170, t, 9.42, { hl: { SUBZERO: '#7fd0ff' } });
}

// ---------- S5 11.16–13.48: üçte bir yerçekimi ----------
function s5(t) {
  marsSky();
  cam({ zoom: 1.02, t, shake: 2 }, () => {
    marsGround(1360, t, 7);
    // dev zıplama yayı
    const ph = ((t - 11.2) / 1.15) % 1, jh = Math.sin(ph * Math.PI) * 820, x = 260 + ((t - 11.2) * 300) % 600;
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.setLineDash([16, 14]); ctx.lineWidth = 5; ctx.beginPath(); for (let k = 0; k <= 20; k++) { const q = k / 20; ctx.lineTo(x - ph * 300 + q * 300, 1360 - Math.sin(q * Math.PI) * 820); } ctx.stroke(); ctx.setLineDash([]);
    astro(x, 1360 - jh, 300, t, { arms: 1 });
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, 1370, 90 * (1 - jh / 1200), 18, 0, 0, TAU); ctx.fill();
  });
  const g = seg(t, 11.34, 11.9); ctx.save(); ctx.globalAlpha = g; ctx.fillStyle = 'rgba(30,8,4,.6)'; ctx.beginPath(); ctx.roundRect(560, 170, 460, 320, 40); ctx.fill();
  txt('1/3', 790, 290, 150, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#ff7a3a' }); txt('GRAVITY  0.38 G', 790, 420, 40, C.gold, { align: 'center', stroke: 6 }); ctx.restore();
}

// ---------- S6 13.48–17.2: uzun, ince varlıklara dönüşmek ----------
function s6(t) {
  bgFinance(t, { tint: 'rgba(255,90,60,.22)', seed: 13, dot: '255,150,120', top: '#1a0806', bot: '#060203' });
  const st = eio(seg(t, 14.1, 16.2));
  cam({ zoom: 1.02, t, shake: 2 + 6 * Math.sin(seg(t, 14.08, 14.4) * Math.PI) }, () => {
    // DNA sarmalı arkada
    for (let i = 0; i < 40; i++) { const y = 200 + i * 32, a = t * 3 + i * .4, x1 = 180 + Math.sin(a) * 90, x2 = 180 - Math.sin(a) * 90;
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      ctx.fillStyle = Math.cos(a) > 0 ? '#ff7a3a' : '#3da5ff'; ctx.beginPath(); ctx.arc(x1, y, 9, 0, TAU); ctx.arc(x2, y, 9, 0, TAU); ctx.fill(); }
    // insan silueti uzar
    ctx.save(); ctx.translate(620, 1400); ctx.scale(1 - .3 * st, 1 + .45 * st); ctx.shadowColor = '#ff7a3a'; ctx.shadowBlur = 40 * st; ctx.fillStyle = '#ffd7c2'; ctx.globalAlpha = .95;
    ctx.beginPath(); ctx.arc(0, -560, 70, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-85, -480, 170, 280, 50); ctx.fill(); ctx.fillRect(-70, -220, 55, 220); ctx.fillRect(15, -220, 55, 220);
    ctx.lineWidth = 42; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffd7c2'; ctx.beginPath(); ctx.moveTo(-90, -450); ctx.lineTo(-130, -240); ctx.moveTo(90, -450); ctx.lineTo(130, -240); ctx.stroke(); ctx.restore();
    // cetvel
    const hm = 1.8 + .9 * st, hp = 630 * (1 + .45 * st); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(900, 1400); ctx.lineTo(900, 1400 - hp); ctx.stroke();
    for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(900, 1400 - hp * i / 10); ctx.lineTo(i % 5 ? 930 : 950, 1400 - hp * i / 10); ctx.stroke(); }
    txt(hm.toFixed(1) + ' M', 900, 1400 - hp - 60, 80, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold });
  });
  kinetic(['MUTATE'], W / 2, 200, 180, t, 14.0, { hl: { MUTATE: '#ff7a3a' } });
  bigText('TOWERING & SLENDER', W / 2, 1460, 100, '#fff', seg(t, 14.74, 15.0), { glow: '#ff7a3a' });
}

// ---------- S7 17.2–26.68: yer altı biyo-kubbeler, dışarıda toz fırtınası ----------
function dome(cx, cy, r, t, kids) {
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.closePath(); ctx.clip();
  const g = ctx.createLinearGradient(0, cy - r, 0, cy); g.addColorStop(0, '#bfeaff'); g.addColorStop(1, '#4fa86a'); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, r);
  for (let i = 0; i < 9; i++) { const x = cx - r * .8 + i * r * .2, h = 60 + (i % 3) * 30; ctx.fillStyle = '#2f8f4a'; ctx.beginPath(); ctx.arc(x, cy - h, 34, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a22'; ctx.fillRect(x - 5, cy - h, 10, h); }
  ctx.fillStyle = '#1a2a1a'; kids.forEach(([dx, s], i) => { const x = cx + dx * r + Math.sin(t * 1.5 + i) * 30; ctx.save(); ctx.translate(x, cy); ctx.scale(1, 1); ctx.fillStyle = '#1a2a1a';
    ctx.beginPath(); ctx.arc(0, -s * .9, s * .1, 0, TAU); ctx.fill(); ctx.fillRect(-s * .08, -s * .8, s * .16, s * .5); ctx.fillRect(-s * .07, -s * .3, s * .05, s * .3); ctx.fillRect(s * .02, -s * .3, s * .05, s * .3); ctx.restore(); });
  ctx.restore();
  ctx.strokeStyle = 'rgba(220,245,255,.9)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = 'rgba(220,245,255,.35)'; ctx.lineWidth = 3; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, r * i / 6, r, 0, Math.PI, 0); ctx.stroke(); }
}
function s7(t) {
  const up = eio(seg(t, 23.6, 24.6));                 // kamera yüzeye çıkar
  ctx.fillStyle = '#2a0c06'; ctx.fillRect(0, 0, W, H);
  cam({ y: lerp(-380, 520, up), zoom: 1.02, t, shake: 2 + 10 * seg(t, 24.6, 25.4) }, () => {
    // yüzey + fırtına (üstte)
    ctx.save(); ctx.beginPath(); ctx.rect(-300, -900, W + 600, 1420); ctx.clip(); marsSky('#b8552c', '#e08a52'); dust(t, 120 * (.3 + .7 * seg(t, 24.4, 25.3)), .7, 1300, 9); ctx.restore();
    ctx.fillStyle = '#7a2a14'; ctx.fillRect(-300, 500, W + 600, 30);
    // katmanlar
    for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#5a1e0e', '#4a170a', '#3a1208', '#2a0c06'][i]; ctx.fillRect(-300, 530 + i * 160, W + 600, 160); }
    // gözetleme penceresi ve asansör şaftı
    ctx.fillStyle = '#1a1f2a'; ctx.fillRect(W / 2 - 40, 520, 80, 700); ctx.strokeStyle = '#7ff0ff'; ctx.lineWidth = 4; for (let y = 560; y < 1220; y += 50) { ctx.beginPath(); ctx.moveTo(W / 2 - 40, y); ctx.lineTo(W / 2 + 40, y + 25); ctx.stroke(); }
    // kubbeler (nesiller: farklı boylar)
    const k0 = seg(t, 19.2, 19.8), k = eback(k0);
    if (k0 > 0) { ctx.save(); ctx.translate(W / 2, 1600); ctx.scale(k, k); ctx.translate(-W / 2, -1600);
      dome(300, 1600, 280, t, [[-.5, 120], [-.1, 90], [.4, 150]]); dome(820, 1600, 260, t, [[-.4, 160], [.2, 70], [.5, 110]]); ctx.restore(); }
    else { const g = seg(t, 17.5, 18.9); ctx.fillStyle = 'rgba(127,240,255,.12)'; ctx.beginPath(); ctx.ellipse(W / 2, 1450, 520, 260, 0, 0, TAU); ctx.fill();
      [[-.32, 220, 17.4], [0, 340, 17.9], [.32, 480, 18.4]].forEach(([dx, sz, t0]) => { const e = eback(seg(t, t0, t0 + .5)); if (e > 0) astro(W / 2 + dx * 900, 1600, sz * e * (1 + .15 * g), t, { arms: .2 }); }); }
    ctx.fillStyle = '#1e0904'; ctx.fillRect(-300, 1600, W + 600, 600);
    // hava geri dönüşüm halkası
    const ar = seg(t, 20.9, 21.4); if (ar > 0) { ctx.save(); ctx.translate(560, 1170); ctx.rotate(t * 2); ctx.strokeStyle = `rgba(127,240,255,${ar})`; ctx.lineWidth = 12; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, 110, i * TAU / 3, i * TAU / 3 + 1.5); ctx.stroke(); const a = i * TAU / 3 + 1.5; ctx.fillStyle = '#7ff0ff'; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 140, Math.sin(a) * 140); ctx.lineTo(Math.cos(a) * 80, Math.sin(a) * 80); ctx.lineTo(Math.cos(a + .35) * 110, Math.sin(a + .35) * 110); ctx.fill(); } ctx.restore(); txt('O2', 560, 1172, 70, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
    // su borusu damlaları
    const wa = seg(t, 22.2, 22.6); if (wa > 0) { ctx.strokeStyle = '#3da5ff'; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(-50, 900); ctx.lineTo(160, 900); ctx.lineTo(160, 1060); ctx.stroke();
      for (let i = 0; i < 4; i++) { const q = ((t * 1.5 + i / 4) % 1); ctx.fillStyle = `rgba(95,200,255,${wa})`; ctx.beginPath(); ctx.arc(160, 1080 + q * 200, 14, 0, TAU); ctx.fill(); } }
  });
  if (t < 23.6) { kinetic(['UNDERGROUND'], W / 2, 210, 150, t, 19.0); bigText('BIO-DOMES', W / 2, 360, 120, '#7ff0b0', seg(t, 19.78, 20.05), { glow: '#3ad08a' }); }
  if (t < 19.0) kinetic(['GENERATIONS'], W / 2, 210, 150, t, 17.2, { hl: { GENERATIONS: C.gold } });
  if (t > 24.4) { kinetic(['RED', 'DUST', 'STORMS'], W / 2, 1360, 140, t, 24.4, { hl: { RED: C.red } }); }
}

// ---------- S8 26.68–32.92: fetih mi, mezar mı? ----------
function s8(t) {
  space(t, 25);
  const tomb = seg(t, 29.44, 31.0);
  cam({ zoom: 1.02 + .08 * tomb, t, shake: 3 }, () => {
    const cx = W / 2, cy = 860, r = 440, R = RN(31), spots = Array.from({ length: 30 }, () => [R() * TAU, (R() - .5) * 2, R()]);
    mars(cx, cy, r, t, { rot: t * .25, lights: (rr, rot) => spots.forEach(([lon, lat, k]) => { const on = seg(t, 27.0 + k * 1.6, 27.3 + k * 1.6) * (1 - clamp(tomb * 1.4 - k * .3)); if (on <= 0) return;
      const l = lon + rot, z = Math.cos(lat) * Math.cos(l); if (z < .1) return; const px = rr * Math.cos(lat) * Math.sin(l), py = -rr * Math.sin(lat) * .9;
      ctx.fillStyle = `rgba(127,240,255,${on})`; ctx.shadowColor = '#7ff0ff'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(px, py, 10 * z, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }) });
    // bayrak
    const fl = eback(seg(t, 27.62, 28.0)) * (1 - tomb); if (fl > 0) { ctx.save(); ctx.translate(cx - 60, cy - r + 10); ctx.scale(fl, fl); ctx.fillStyle = '#ddd'; ctx.fillRect(-6, -260, 12, 260); ctx.fillStyle = '#7ff0ff'; ctx.beginPath(); ctx.moveTo(6, -260); for (let x = 0; x <= 180; x += 10) ctx.lineTo(6 + x, -260 + Math.sin(x * .05 + t * 6) * 10); for (let x = 180; x >= 0; x -= 10) ctx.lineTo(6 + x, -160 + Math.sin(x * .05 + t * 6) * 10); ctx.fill(); ctx.restore(); }
    // mezar taşı (miğferli)
    if (tomb > 0) { const k = eback(tomb); ctx.save(); ctx.translate(cx, cy - r + 200); ctx.scale(k * .85, k * .85); ctx.fillStyle = '#6a6f7a'; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-150, -260); ctx.arc(0, -260, 150, Math.PI, 0); ctx.lineTo(150, 0); ctx.fill();
      txt('R.I.P', 0, -280, 80, '#2a2e36', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('HUMANITY', 0, -170, 40, '#2a2e36', { align: 'center', stroke: 0 }); ctx.restore();
      ctx.save(); ctx.globalAlpha = tomb; dust(t, 80, .6, 1100, 3); ctx.restore(); }
  });
  if (t < 29.4) { kinetic(['CONQUER'], W / 2, 220, 160, t, 27.6, { hl: { CONQUER: '#7ff0ff' } }); kinetic(['THE', 'RED', 'PLANET?'], W / 2, 1420, 120, t, 28.2, { hl: { RED: C.red } }); }
  else { bigText('PLANETARY TOMB?', W / 2, 1420, 120, C.red, seg(t, 31.2, 31.6), { glow: C.red }); }
}

const THEO = ['We would become Martians', 'Terraform it first!', 'Domes forever', 'Mars is a death trap', 'New human species', 'Elon already packing'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const w1 = whip(t, 3.42, .3), w2 = whip(t, 6.44, .3, -1), w3 = whip(t, 9.42, .3), w4 = whip(t, 11.16, .3, -1), w5 = whip(t, 13.48, .3), w6 = whip(t, 17.2, .3, -1), w7 = whip(t, 32.92, .3);
  if (t < 3.62) cam({ y: w1.offA }, () => s1(t));
  if (t > 3.22 && t < 6.64) cam({ y: t < 5 ? w1.offB : w2.offA }, () => s2(Math.max(t, 3.42)));
  if (t > 6.24 && t < 9.62) cam({ y: t < 8 ? w2.offB : w3.offA }, () => s3(Math.max(t, 6.44)));
  if (t > 9.22 && t < 11.36) cam({ y: t < 10.3 ? w3.offB : w4.offA }, () => s4(Math.max(t, 9.42)));
  if (t > 10.96 && t < 13.68) cam({ y: t < 12.3 ? w4.offB : w5.offA }, () => s5(Math.max(t, 11.16)));
  if (t > 13.28 && t < 17.4) cam({ y: t < 15 ? w5.offB : w6.offA }, () => s6(Math.max(t, 13.48)));
  if (t > 17.0 && t < 26.9) cam({ y: w6.offB }, () => s7(Math.max(t, 17.2)));
  if (t >= 26.68 && t < 33.12) iris(t, 26.68, .45, () => s7(t), () => cam({ y: w7.offA }, () => s8(t)), W / 2, 860);
  if (t > 32.72) cam({ y: w7.offB }, () => cta(Math.max(t, 32.92), 32.92, 34.46, 35.04, THEO, { tint: 'rgba(255,110,60,.2)', dot: '255,160,120' }));
  motionStreak(Math.max(w1.blur, w2.blur, w3.blur, w4.blur, w5.blur, w6.blur, w7.blur));
  glitch((t > 14.08 && t < 14.35 ? 1 : 0) + (t > 29.44 && t < 29.6 ? .7 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
