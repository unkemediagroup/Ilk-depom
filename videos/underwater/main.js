// 12.video — "What If Humans Could Breathe Underwater?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 42.84;
const SUBY = 1540;
const AQ = '#4fe0ff';

function sea(t, depth = 0) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#2a9ad8', '#020814', depth)); g.addColorStop(1, lerpC('#0a3a6a', '#000206', depth)); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  if (depth < .7) for (let i = 0; i < 7; i++) { const x = i * 180 + Math.sin(t * .5 + i) * 60; ctx.save(); ctx.globalAlpha = .1 * (1 - depth); ctx.fillStyle = '#d8f4ff'; ctx.beginPath(); ctx.moveTo(x - 30, -100); ctx.lineTo(x + 30, -100); ctx.lineTo(x + 200, H); ctx.lineTo(x + 60, H); ctx.fill(); ctx.restore(); }
  const R = RN(8); for (let i = 0; i < 50; i++) { const x = R() * W + Math.sin(t + i) * 20, y = (R() * H - t * (30 + R() * 50)) % H; ctx.fillStyle = `rgba(200,240,255,${.15 + R() * .25})`; ctx.beginPath(); ctx.arc(x, y < 0 ? y + H : y, 2 + R() * 3, 0, TAU); ctx.fill(); } }
function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function swimmer(x, y, s, t, o = {}) {       // yatay yüzücü (sağa), solungaçlı
  const k = Math.sin(t * 6 + (o.ph || 0)); ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -1 : 1, 1); ctx.rotate(o.rot || 0);
  const col = o.col || '#1a3550'; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = s * .09; ctx.beginPath(); ctx.moveTo(-s * .2, 0); ctx.lineTo(-s * .45, k * s * .06); ctx.lineTo(-s * .65, k * s * .12); ctx.moveTo(-s * .2, s * .02); ctx.lineTo(-s * .45, -k * s * .06 + s * .03); ctx.lineTo(-s * .65, -k * s * .12 + s * .03); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, s * .24, s * .08, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(s * .33, -s * .02, s * .08, 0, TAU); ctx.fill();
  ctx.lineWidth = s * .055; ctx.beginPath(); ctx.moveTo(s * .18, -s * .03); ctx.lineTo(s * .4 + k * s * .05, -s * .12); ctx.lineTo(s * .58, -s * .08 - k * s * .05); ctx.stroke();
  if (o.gills !== false) { ctx.strokeStyle = AQ; ctx.shadowColor = AQ; ctx.shadowBlur = 15; ctx.lineWidth = s * .012; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(s * .27, s * .0 + i * s * .02 - s * .02, s * .03, -1, 1); ctx.stroke(); } ctx.shadowBlur = 0; }
  ctx.restore(); }
function fish(x, y, s, col, t, dir = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, s * .5, s * .25, 0, 0, TAU); ctx.fill(); const w = Math.sin(t * 10) * s * .1; ctx.beginPath(); ctx.moveTo(-s * .45, 0); ctx.lineTo(-s * .8, -s * .25 + w); ctx.lineTo(-s * .8, s * .25 + w); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s * .28, -s * .06, s * .06, 0, TAU); ctx.fill(); ctx.restore(); }
function bubbles(x, y, t, n = 8, seed = 1) { const R = RN(seed); for (let i = 0; i < n; i++) { const q = (R() + t * .8) % 1; ctx.strokeStyle = `rgba(220,250,255,${.8 * (1 - q)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + Math.sin(q * 8 + i) * 20, y - q * 400, 6 + R() * 14, 0, TAU); ctx.stroke(); } }

// ---------- S1 0–4.04: suya dalış, solungaçlar parlar ----------
function s1(t) {
  const dive = eo(seg(t, 0, 1.2));
  sea(t, .1);
  cam({ zoom: 1.12 - .1 * seg(t, 0, 4), y: lerp(-500, 0, dive), t, shake: t < .6 ? 14 : 2 }, () => {
    // yüzey çizgisi ve sıçrama
    ctx.fillStyle = '#9ad8ff'; ctx.fillRect(-300, -800, W + 600, 1000); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.beginPath(); for (let x = -300; x <= W + 300; x += 20) ctx.lineTo(x, 200 + Math.sin(x * .02 + t * 4) * 12); ctx.stroke();
    shards(W / 2, 200, seg(t, 0, 1.2), 40, 2, '#e8f8ff', 14, 500);
    swimmer(lerp(W / 2, W / 2 + 60, dive), lerp(300, 820, dive), 700, t, { rot: lerp(1.3, -.1, dive) });
    bubbles(W / 2 + 280, 800, t, 10, 3);
    const gl = seg(t, 2.4, 2.8); if (gl > 0) { ring2(W / 2 + 290, 800, ((t - 2.4) * 1.2) % 1, 300, AQ, 8); }
  });
  kinetic(['WHAT', 'IF', 'HUMANS', 'COULD'], W / 2, 1180, 130, t, 0, { gap: .06 });
  kinetic(['BREATHE', 'UNDERWATER?'], W / 2, 1340, 130, t, 1.6, { hl: { 'UNDERWATER?': AQ } });
}

// ---------- S2 4.04–8.02: kalabalık kara şehirlerini terk et ----------
function s2(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffb07a'); g.addColorStop(1, '#ff7a5a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const go = seg(t, 6.24, 8.0);
  cam({ zoom: 1.03, x: -200 * eio(go), t, shake: 3 }, () => {
    skyline(1150, t, { seed: 71, tall: 650, col: '#2a2440' });
    ctx.fillStyle = '#3a3048'; ctx.fillRect(-300, 1150, W + 900, 800);
    // deniz sağda
    ctx.fillStyle = '#1f73c9'; ctx.fillRect(W + 60, 1100, 700, 900); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = W + 60; x < W + 760; x += 20) ctx.lineTo(x, 1100 + Math.sin(x * .03 + t * 4) * 10); ctx.stroke();
    // kalabalık noktaları → denize akar
    const R = RN(5); for (let i = 0; i < 220; i++) { const x0 = R() * W, y0 = 1180 + R() * 280, d = clamp(go * 1.4 - R() * .4); const x = lerp(x0, W + 200 + R() * 400, eio(d)), y = y0 + Math.sin(t * 8 + i) * 3;
      ctx.fillStyle = ['#ffd36b', '#fff', '#ff8a8a', AQ][i % 4]; ctx.beginPath(); ctx.arc(x, y - 18, 7, 0, TAU); ctx.fill(); ctx.fillRect(x - 5, y - 10, 10, 20); }
  });
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.roundRect(170, 170, 740, 220, 40); ctx.fill(); ctx.restore();
  counter(0, 8.1, W / 2, 260, 120, seg(t, 4.3, 5.2), { fmt: v => v.toFixed(1) + ' BILLION', col: C.red }); txt('ON CROWDED LAND', W / 2, 350, 40, '#fff', { align: 'center', stroke: 6 });
  if (t > 6.24) stampText('ABANDON', W / 2, 620, 140, '#fff', seg(t, 6.24, 6.5));
}

// ---------- S3 8.02–12.22: derin okyanusa dalış ----------
function jelly(x, y, s, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 20); const p = 1 + .1 * Math.sin(t * 4); ctx.fillStyle = 'rgba(255,120,220,.55)'; ctx.shadowColor = '#ff7ae0'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.ellipse(0, 0, s * .5 * p, s * .35 / p, 0, Math.PI, 0); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,160,230,.6)'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-s * .4 + i * s * .16, 0); for (let k = 1; k < 8; k++) ctx.lineTo(-s * .4 + i * s * .16 + Math.sin(t * 3 + k + i) * 10, k * s * .12); ctx.stroke(); } ctx.restore(); }
function s3(t) {
  const d = eio(seg(t, 8.1, 12.0));
  sea(t, d);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    for (let i = 0; i < 8; i++) fish(((i * 170 + t * 120 * (i % 2 ? 1 : -1)) % 1400 + 1400) % 1400 - 150, 300 + i * 120 + d * -200, 90, ['#ffb35a', '#ffd36b', '#ff7a5a'][i % 3], t, i % 2 ? 1 : -1);
    if (d > .4) { jelly(260, 1100, 220, t); jelly(820, 800, 170, t + 1); }
    swimmer(W / 2, 700 + d * 300, 600, t, { rot: .5, col: '#0e2238' });
    // derinlik ölçer
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(1000, 300, 10, 1100); ctx.fillStyle = AQ; ctx.beginPath(); ctx.arc(1005, 300 + 1100 * d, 22, 0, TAU); ctx.fill();
  });
  txt('-' + Math.round(4000 * d).toLocaleString('en-US') + ' M', 760, 300 + 1100 * d * .9 + 0, 70, AQ, { align: 'center', font: 'Anton', weight: 400, glow: AQ });
  kinetic(['COLONIZE'], W / 2, 220, 170, t, 8.02, { hl: { COLONIZE: AQ } });
  if (t > 9.44) bigText('UNTOUCHED MYSTERIES', W / 2, 1420, 100, '#fff', seg(t, 9.44, 9.7), { glow: AQ });
}

// ---------- S4 12.22–16.26: su altı metropolleri + mercan resifleri ----------
function coral(x, y, s, col, t) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineCap = 'round'; const br = (l, a, w, d) => { if (d > 4) return; ctx.lineWidth = w; const ex = Math.cos(a) * l, ey = Math.sin(a) * l; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke(); ctx.save(); ctx.translate(ex, ey); br(l * .72, a - .45 + Math.sin(t + d) * .05, w * .7, d + 1); br(l * .72, a + .45, w * .7, d + 1); ctx.restore(); };
  br(s, -Math.PI / 2, s * .14, 0); ctx.restore(); }
function s4(t) {
  sea(t, .45);
  cam({ zoom: 1.08 - .08 * seg(t, 12.2, 16.2), t, shake: 1 }, () => {
    const R = RN(4), rise = eo(seg(t, 12.3, 13.8));
    for (let i = 0; i < 9; i++) { const x = 60 + i * 120, h = (260 + R() * 600) * rise; ctx.fillStyle = 'rgba(79,224,255,.18)'; ctx.strokeStyle = AQ; ctx.lineWidth = 4; ctx.shadowColor = AQ; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(x, 1350 - h, 90, h, [45, 45, 0, 0]); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,240,180,.8)'; for (let y = 1350 - h + 40; y < 1330; y += 50) ctx.fillRect(x + 25, y, 40, 18); }
    ctx.strokeStyle = 'rgba(79,224,255,.7)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(W / 2, 1350, 560 * rise, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = '#3a2a3a'; ctx.fillRect(-300, 1350, W + 600, 700);
    const cr = eback(seg(t, 14.96, 15.5)); if (cr > 0) [['#ff5a8a', 100], ['#ffb35a', 260], ['#c86bff', 820], ['#ff7a5a', 980], ['#5ae0a0', 560]].forEach(([c, x]) => coral(x, 1360, 160 * cr, c, t));
    for (let i = 0; i < 4; i++) swimmer(((i * 300 + t * 160) % 1400) - 150, 450 + i * 130, 220, t + i, { ph: i, col: '#0e2238' });
  });
  kinetic(['UNDERWATER'], W / 2, 220, 150, t, 12.4); kinetic(['METROPOLISES'], W / 2, 370, 130, t, 13.6, { hl: { METROPOLISES: AQ } });
}

// ---------- S5 16.26–20.88: aşırı nüfus ve kaynak kıtlığı çözülür ----------
function s5(t) {
  bgFinance(t, { tint: 'rgba(79,224,255,.22)', seed: 6, dot: '140,230,255' });
  cam({ zoom: 1.02, t, shake: 2 }, () => {
    ring(W / 2, 640, 260, 100 - 70 * eo(seg(t, 17.6, 18.8)), 1, { col: lerpC('#ff3b4e', '#22e07a', seg(t, 17.6, 18.8)), sub: 'OVERCROWDED' });
    hbars(110, 1050, 860, 120, [{ label: 'FOOD', value: 100 * eo(seg(t, 19.1, 20.0)) + 10, col: C.green }, { label: 'WATER', value: 100 * eo(seg(t, 19.3, 20.2)) + 10, col: AQ }, { label: 'MINERALS', value: 90 * eo(seg(t, 19.5, 20.4)) + 10, col: C.gold }], 1, { max: 110, fmt: v => Math.round(v) + '%' });
  });
  kinetic(['INSTANTLY', 'SOLVED'], W / 2, 200, 140, t, 16.7, { hl: { SOLVED: C.green } });
}

// ---------- S6 20.88–26.44: insanlık ikiye bölünür ----------
function s6(t) {
  const sp = eo(seg(t, 21.2, 21.9)), gap = 20 * sp;
  // üst: kara
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H / 2 - gap); ctx.clip(); ctx.translate(0, -60 * sp);
  const g = ctx.createLinearGradient(0, 0, 0, H / 2); g.addColorStop(0, '#ffcf9a'); g.addColorStop(1, '#ff9a6a'); ctx.fillStyle = g; ctx.fillRect(0, -100, W, H);
  skyline(900, t, { seed: 9, tall: 400, col: '#3a2440' }); ctx.fillStyle = '#4a3a2a'; ctx.fillRect(0, 900, W, 200);
  for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(140 + i * 160, 900); ctx.fillStyle = '#1a1020'; human(0, 0, 160); ctx.restore(); }
  ctx.restore();
  // alt: deniz
  ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 + gap, W, H); ctx.clip(); ctx.translate(0, 60 * sp);
  const g2 = ctx.createLinearGradient(0, H / 2, 0, H); g2.addColorStop(0, '#1f73c9'); g2.addColorStop(1, '#041a3a'); ctx.fillStyle = g2; ctx.fillRect(0, H / 2 - 100, W, H);
  for (let i = 0; i < 5; i++) swimmer(((i * 260 + t * 140) % 1400) - 150, 1150 + i * 70, 260, t + i, { col: '#0e2238' }); ctx.restore();
  // ayrılık çatlağı
  if (sp > 0) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.shadowColor = '#fff'; ctx.shadowBlur = 20; ctx.beginPath(); const R = RN(4); ctx.moveTo(0, H / 2); for (let x = 0; x <= W * sp; x += 60) ctx.lineTo(x, H / 2 + (R() - .5) * 40); ctx.stroke(); ctx.shadowBlur = 0; }
  bigText('LAND DWELLERS', W / 2, 220, 120, '#fff', seg(t, 23.62, 23.9), { glow: '#ff8a3a' });
  bigText('AQUATIC HUMANS', W / 2, 1100, 120, AQ, seg(t, 25.08, 25.35), { glow: AQ });
  if (t < 23.5) kinetic(['TWO', 'DISTINCT', 'WORLDS'], W / 2, 220, 130, t, 21.7);
}

// ---------- S7 26.44–30.82: okyanus toprakları için çatışma ----------
function s7(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a1a3a'); g.addColorStop(1, '#1a0a14'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, t, shake: 3 + 8 * seg(t, 28.2, 28.6) }, () => {
    // okyanus haritası + kesik sınırlar
    ctx.fillStyle = '#1f5a9a'; ctx.beginPath(); ctx.roundRect(60, 360, 960, 960, 40); ctx.fill();
    ctx.fillStyle = '#3a6a3a'; ctx.beginPath(); ctx.ellipse(160, 500, 160, 120, 0, 0, TAU); ctx.ellipse(950, 1200, 200, 150, 0, 0, TAU); ctx.fill();
    const bd = seg(t, 27.76, 28.6); ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.setLineDash([24, 16]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(60, 840); ctx.lineTo(60 + 960 * bd, 840 + Math.sin(bd * 6) * 80); ctx.stroke(); ctx.beginPath(); ctx.moveTo(540, 360); ctx.lineTo(540 + Math.sin(bd * 5) * 60, 360 + 960 * bd); ctx.stroke(); ctx.setLineDash([]);
    // bayraklar
    [[300, 620, '#ffc83d'], [780, 620, AQ], [300, 1080, '#ff8a3a'], [780, 1080, '#c86bff']].forEach(([x, y, c], i) => { const k = eback(seg(t, 29.26 + i * .1, 29.6 + i * .1)); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#ddd'; ctx.fillRect(-4, -120, 8, 120); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(4, -120); ctx.lineTo(100, -95 + Math.sin(t * 6) * 6); ctx.lineTo(4, -70); ctx.fill(); ctx.restore(); });
    // çatışan denizaltılar
    for (const [x, dir] of [[300 + Math.sin(t * 2) * 40, 1], [780 - Math.sin(t * 2) * 40, -1]]) { ctx.save(); ctx.translate(x, 840); ctx.scale(dir, 1); ctx.fillStyle = '#2a3344'; ctx.beginPath(); ctx.ellipse(0, 0, 120, 36, 0, 0, TAU); ctx.fill(); ctx.fillRect(-20, -66, 50, 40); ctx.restore(); }
    if (t > 28.24) { stampX(W / 2, 840, 120, seg(t, 28.24, 28.5)); ring2(W / 2, 840, ((t - 28.24) * 1.2) % 1, 300, C.red, 10); }
  });
  kinetic(['GEOPOLITICAL'], W / 2, 180, 130, t, 27.0); kinetic(['CONFLICTS'], W / 2, 300, 120, t, 28.2, { hl: { CONFLICTS: C.red } });
}

// ---------- S8 30.82–37.36: derin maviyi fethetmek mi, ezici basınç ve canavarlar mı? ----------
function angler(x, y, s, t, jaw) { ctx.save(); ctx.translate(x, y);
  const lx = s * .35, ly = -s * .55; ctx.strokeStyle = '#2a2a3a'; ctx.lineWidth = s * .02; ctx.beginPath(); ctx.moveTo(s * .1, -s * .3); ctx.quadraticCurveTo(s * .2, -s * .7, lx, ly); ctx.stroke();
  ctx.fillStyle = '#d8fff0'; ctx.shadowColor = '#7affd0'; ctx.shadowBlur = 60; ctx.beginPath(); ctx.arc(lx, ly, s * .05 * (1 + .2 * Math.sin(t * 8)), 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#14141e'; ctx.beginPath(); ctx.ellipse(0, 0, s * .5, s * .38, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(s * .45, -s * .05); ctx.lineTo(s * .05, s * .02 - jaw * s * .1); ctx.lineTo(s * .45, s * .1 + jaw * s * .25); ctx.fill();
  ctx.fillStyle = '#e8eef6'; for (let i = 0; i < 7; i++) { const tx = s * .1 + i * s * .05; ctx.beginPath(); ctx.moveTo(tx, -s * .02); ctx.lineTo(tx + s * .02, s * .06 + jaw * s * .05); ctx.lineTo(tx + s * .04, -s * .02); ctx.fill(); ctx.beginPath(); ctx.moveTo(tx, s * .1 + jaw * s * .2); ctx.lineTo(tx + s * .02, s * .02 + jaw * s * .1); ctx.lineTo(tx + s * .04, s * .1 + jaw * s * .2); ctx.fill(); }
  ctx.fillStyle = '#ffd23a'; ctx.beginPath(); ctx.arc(s * .1, -s * .16, s * .04, 0, TAU); ctx.fill(); ctx.fillStyle = '#14141e'; ctx.beginPath(); ctx.moveTo(-s * .45, 0); ctx.lineTo(-s * .75, -s * .25); ctx.lineTo(-s * .75, s * .25); ctx.fill(); ctx.restore(); }
function s8(t) {
  const deep = seg(t, 33.2, 34.6);
  sea(t, .55 + .45 * deep);
  cam({ zoom: 1.03 + .1 * seg(t, 34.8, 36.5), t, shake: 2 + 14 * seg(t, 33.72, 34.2) * (1 - seg(t, 34.4, 34.9)) + 16 * seg(t, 36.0, 36.4) }, () => {
    if (deep < 1) { ctx.save(); ctx.globalAlpha = 1 - deep; ctx.fillStyle = '#3a2a3a'; ctx.fillRect(-300, 1300, W + 600, 700); ctx.fillStyle = '#ddd'; ctx.fillRect(W / 2 - 6, 900, 12, 400); ctx.fillStyle = AQ; ctx.beginPath(); ctx.moveTo(W / 2 + 6, 900); ctx.lineTo(W / 2 + 200, 940 + Math.sin(t * 5) * 10); ctx.lineTo(W / 2 + 6, 1000); ctx.fill(); swimmer(W / 2 - 220, 1000, 420, t, { rot: -.2, col: '#c9e8ff' }); ctx.restore(); }
    // basınç göstergesi
    if (t > 33.6 && t < 34.9) { ctx.save(); ctx.translate(W / 2, 700); ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.arc(0, 0, 250, 0, TAU); ctx.fill(); ctx.strokeStyle = '#111'; ctx.lineWidth = 8; ctx.stroke(); const a = Math.PI * .75 + Math.PI * 1.5 * eo(seg(t, 33.72, 34.3)) + Math.sin(t * 50) * .03; ctx.strokeStyle = C.red; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 200, Math.sin(a) * 200); ctx.stroke();
      txt(Math.round(1100 * eo(seg(t, 33.72, 34.3))) + ' ATM', 0, 120, 60, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
      const ck = seg(t, 34.1, 34.5); if (ck > 0) { ctx.strokeStyle = '#111'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(W / 2 - 200, 600); ctx.lineTo(W / 2 - 60, 700); ctx.lineTo(W / 2 + 40, 640); ctx.lineTo(W / 2 + 200 * ck, 780); ctx.stroke(); } }
    // fener balığı canavarı yüzücüyü yutar
    if (t > 34.6) { const ap = eo(seg(t, 34.6, 35.6)), jaw = .3 + .7 * Math.max(0, Math.sin((t - 35.0) * 4)); angler(lerp(-500, 420, ap), 820, 1100, t, t > 36.0 ? 1 - seg(t, 36.0, 36.2) : jaw);
      if (t < 36.1) swimmer(860, 820 + Math.sin(t * 3) * 20, 300, t * 2, { flip: true, col: '#c9e8ff' }); }
  });
  if (t < 33.2) kinetic(['CONQUER', 'THE', 'DEEP', 'BLUE?'], W / 2, 220, 120, t, 31.4, { hl: { 'BLUE?': AQ } });
  else if (t < 34.7) bigText('CRUSHING PRESSURE', W / 2, 220, 110, C.red, seg(t, 33.72, 34.0), { glow: C.red });
  else bigText('ABYSSAL MONSTERS', W / 2, 220, 120, '#7affd0', seg(t, 34.82, 35.1), { glow: '#7affd0' });
}

const THEO = ['I would move to the sea', 'Atlantis 2.0', 'Sharks would be pets', 'Ocean wars incoming', 'Land would be empty', 'Nope, too scary'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 4.04, 8.02, 12.22, 16.26, 20.88, 26.44, 30.82, 37.36, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8, null];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i] ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 37.36), 37.36, 38.96, 39.5, THEO, { tint: 'rgba(79,224,255,.2)', dot: '140,230,255' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 21.2 && t < 21.4 ? .7 : 0) + (t > 36.0 && t < 36.3 ? 1 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
