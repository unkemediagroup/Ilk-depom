// Seri2 #19 — "What If Humans Could Teleport?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 39.56;
const SUBY = 1540;
const VIO = '#b45aff', CY = '#3ae0ff', RED = '#ff3b4e', GOLD = '#ffc83d', GRN = '#3aff8a';

function bg(t, a = '#14082a', b = '#030108') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
// Işınlanma efekti: k 0→1 kişi beliriyor; out: kayboluyor
function warp(x, y, s, k, col = VIO, t = 0) { if (k <= 0 || k >= 1) { if (k >= 1) human(x, y, s); return; }
  ctx.save(); ctx.globalAlpha = 1 - Math.abs(k - .5) * 2; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x, y - s * (.2 + i * .35), s * .5 * (1 - k * .3), s * .12, 0, 0, TAU); ctx.stroke(); }
  ctx.fillStyle = col; ctx.fillRect(x - s * .05, y - s * 1.3, s * .1, s * 1.3); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(x - s, y - s * 1.2 * k, s * 2, s * 1.2 * k + 10); ctx.clip(); human(x, y, s); ctx.restore();
  const R = RN(Math.floor(x)); for (let i = 0; i < 16; i++) { ctx.fillStyle = col; ctx.globalAlpha = 1 - k; ctx.fillRect(x + (R() - .5) * s, y - R() * s * 1.3 - k * 80, 8, 8); } ctx.globalAlpha = 1; }
function portal(x, y, r, t, col = VIO, a = 1) { if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(1, 1.4); for (let i = 0; i < 5; i++) { ctx.rotate(t * (1 + i * .3)); ctx.strokeStyle = i % 2 ? col : CY; ctx.globalAlpha = a * (.9 - i * .14); ctx.lineWidth = 10 - i; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(0, 0, r * (1 - i * .13) * a, 0, Math.PI * 1.6); ctx.stroke(); } ctx.globalAlpha = a * .7; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * a); g.addColorStop(0, '#fff'); g.addColorStop(.4, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * a, 0, TAU); ctx.fill(); ctx.restore(); }

// ---------- S1 0–8.1: kişi ışınlanarak dünya üzerinde zıplar ----------
function s1(t) {
  space(t, 7);
  const hop = Math.floor(t / .9), ph = (t % .9) / .9;
  cam({ zoom: 1.04 + .04 * Math.sin(t * 2), rot: Math.sin(t) * .03, t, shake: 2 + (t > 5.5 && t < 7 ? 12 * Math.abs(Math.sin(t * 12)) : 0) }, () => {
    earth(W / 2, 1000, 360, t, { rot: t * .9 });
    // ışınlanma noktaları arası parlayan yaylar
    const P = [[-.6, -.4], [.5, -.5], [.2, .4], [-.5, .3], [.7, .1], [-.1, -.7], [0, .1], [-.7, -.1], [.4, .6]];
    for (let i = 0; i <= Math.min(hop, 8); i++) { const [a, b] = P[i % 9], [c, d] = P[(i + 1) % 9]; const x1 = W / 2 + a * 300, y1 = 1000 + b * 300, x2 = W / 2 + c * 300, y2 = 1000 + d * 300; const k = i < hop ? 1 : ph; ctx.strokeStyle = VIO; ctx.lineWidth = 6; ctx.shadowColor = VIO; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, Math.min(y1, y2) - 260, lerp(x1, x2, k), lerp(y1, y2, k) - Math.sin(k * Math.PI) * 180); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x1, y1, 10, 0, TAU); ctx.fill(); }
    // ekonomi çöküşü: kırmızı grafik
    if (t > 5.5) { const k = seg(t, 5.5, 6.4), r = seg(t, 6.34, 7.6); ctx.strokeStyle = r > 0 ? GRN : RED; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(120, 560); ctx.lineTo(120 + 420 * k, 560 + 520 * k); if (r > 0) ctx.lineTo(540 + 420 * r, 1080 - 600 * r); ctx.stroke(); }
  });
  kinetic(['WHAT', 'IF', 'YOU', 'COULD'], W / 2, 200, 120, t, -.3, { gap: .05 });
  kinetic(['TELEPORT?'], W / 2, 350, 190, t, .15, { hl: { 'TELEPORT?': VIO } });
  if (t > 3.3) pill('ANYWHERE · INSTANTLY', W / 2, 520, 50, CY, seg(t, 3.3, 3.55));
  if (t > 5.72 && t < 6.34) stampText('COLLAPSE', W / 2, 1330, 110, RED, seg(t, 5.72, 5.95));
  if (t > 6.34) stampText('REBUILD', W / 2, 1330, 110, GRN, seg(t, 6.34, 6.55));
}

// ---------- S2 8.1–16.6: araba, uçak, gemi, petrol iflas ----------
function s2(t) {
  bg(t, '#0a1222', '#000');
  const items = [['CAR', 8.32, '#3a7aff'], ['PLANE', 9.0, '#e8eef6'], ['SHIP', 10.08, '#ff8a2a'], ['OIL', 10.78, '#222']];
  cam({ zoom: 1.03 + .05 * seg(t, 8.1, 16.6), t, shake: 2 + 10 * seg(t, 11.9, 12.2) * (1 - seg(t, 12.2, 13)) }, () => {
    items.forEach(([l, t0, c], i) => { const x = 280 + (i % 2) * 520, y = 640 + Math.floor(i / 2) * 470, k = eback(seg(t, t0, t0 + .3)); if (k <= 0) return; const fall = eio(seg(t, 11.9 + i * .1, 13.2 + i * .1));
      ctx.save(); ctx.translate(x, y + fall * 60); ctx.rotate(fall * (i % 2 ? .4 : -.4)); ctx.scale(k * 1.12, k * 1.12); ctx.globalAlpha = 1 - fall * .55;
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(-220, -190, 440, 380, 30); ctx.fill();
      if (l === 'CAR') { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(-160, -20, 320, 80, 20); ctx.fill(); ctx.beginPath(); ctx.roundRect(-90, -80, 180, 70, 24); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-90, 60, 34, 0, TAU); ctx.arc(90, 60, 34, 0, TAU); ctx.fill(); }
      if (l === 'PLANE') { ctx.rotate(-.3); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, 0, 180, 30, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-70, -130); ctx.lineTo(10, -130); ctx.lineTo(50, 0); ctx.lineTo(10, 130); ctx.lineTo(-70, 130); ctx.fill(); ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-180, -60); ctx.lineTo(-140, -60); ctx.lineTo(-120, 0); ctx.fill(); }
      if (l === 'SHIP') { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-190, 0); ctx.lineTo(190, 0); ctx.lineTo(150, 80); ctx.lineTo(-150, 80); ctx.fill(); const cc = ['#3a7aff', RED, GOLD, GRN]; for (let j = 0; j < 4; j++) { ctx.fillStyle = cc[j]; ctx.fillRect(-160 + j * 70, -60, 64, 60); } ctx.fillStyle = '#e8eef6'; ctx.fillRect(110, -120, 60, 120); }
      if (l === 'OIL') { ctx.fillStyle = '#3a3c44'; ctx.fillRect(-120, -140, 240, 260); ctx.fillStyle = GOLD; ctx.fillRect(-120, -60, 240, 30); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(0, -140, 120, 26, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(0, 130); ctx.quadraticCurveTo(-30, 170, 0, 180); ctx.quadraticCurveTo(30, 170, 0, 130); ctx.fill(); }
      ctx.restore(); txt(l, x, y + 160 + fall * 60, 50, '#fff', { align: 'center', font: 'Anton', weight: 400 });
      if (fall > .3) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 18; ctx.globalAlpha = clamp(fall * 2 - .6); ctx.beginPath(); ctx.moveTo(x - 150, y - 150); ctx.lineTo(x + 150, y + 150); ctx.moveTo(x + 150, y - 150); ctx.lineTo(x - 150, y + 150); ctx.stroke(); ctx.restore(); } });
  });
  if (t < 11.9) kinetic(['GOODBYE'], W / 2, 240, 170, t, 8.2, { hl: { GOODBYE: VIO } });
  else stampText('BANKRUPT', W / 2, 260, 170, RED, seg(t, 11.9, 12.15));
  if (t > 14.74) bigText('NO TRANSPORT NEEDED', W / 2, 1380, 80, CY, seg(t, 14.74, 15.0));
}

// ---------- S3 16.6–25.2: şehir emlak çöker, dağ köyü → Tokyo ofisi 1 sn ----------
function s3(t) {
  const late = t > 21.0;
  bg(t, late ? '#5aa0e8' : '#100a1a', late ? '#c9e8ff' : '#000');
  cam({ zoom: 1.03, x: late ? lerp(0, 0, 1) : 0, t, shake: 2 + (!late ? 10 * seg(t, 18.88, 19.2) * (1 - seg(t, 19.2, 20)) : 0) }, () => {
    if (!late) { skyline(1250, t, { seed: 31, tall: 700, col: '#2a2440' });
      // fiyat etiketi düşer
      const d = eio(seg(t, 18.6, 19.6)), v = lerp(2400000, 300000, d); ctx.save(); ctx.translate(W / 2, 700 + d * 300); ctx.rotate(-.1 + d * .3); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(-260, -80); ctx.lineTo(220, -80); ctx.lineTo(300, 0); ctx.lineTo(220, 80); ctx.lineTo(-260, 80); ctx.fill(); txt('$' + Math.round(v).toLocaleString('en-US'), -10, 4, 70, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
      ctx.strokeStyle = RED; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(120, 450); ctx.lineTo(lerp(120, 960, d), lerp(450, 1150, d)); ctx.stroke(); }
    else { // bölünmüş ekran: sol dağ köyü, sağ Tokyo ofisi
      ctx.fillStyle = '#7ab85a'; ctx.fillRect(-300, 1100, W / 2 + 300, 900); ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.moveTo(-200, 1100); ctx.lineTo(150, 500); ctx.lineTo(500, 1100); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(90, 600); ctx.lineTo(150, 500); ctx.lineTo(210, 600); ctx.fill(); ctx.fillStyle = '#8a5a3a'; ctx.fillRect(120, 1000, 160, 110); ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.moveTo(100, 1000); ctx.lineTo(200, 920); ctx.lineTo(300, 1000); ctx.fill();
      ctx.fillStyle = '#1a1a30'; ctx.fillRect(W / 2, -300, W / 2 + 300, H + 600); ctx.save(); ctx.beginPath(); ctx.rect(W / 2, -300, W, H + 600); ctx.clip(); skyline(1100, t, { seed: 5, tall: 600, col: '#3a2a5a' }); ctx.restore(); ctx.fillStyle = '#ff3aa8'; ctx.globalAlpha = .7; ctx.fillRect(W / 2 + 60, 700, 80, 300); ctx.fillStyle = CY; ctx.fillRect(W / 2 + 220, 650, 60, 350); ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 6, -300, 12, H + 600);
      const k1 = seg(t, 22.42, 23.0), k2 = seg(t, 24.0, 24.5); warp(200, 1100, 240, 1 - k1, VIO); portal(200, 980, 120, t, VIO, k1 * (1 - k2)); portal(800, 980, 120, t, CY, k1 * (1 - k2)); warp(800, 1100, 240, k2, CY);
    }
  });
  if (!late) { kinetic(['CITY', 'PRICES'], W / 2, 240, 160, t, 16.8, { hl: { PRICES: GOLD } }); if (t > 18.88) stampText('PLUMMET', W / 2, 420, 120, RED, seg(t, 18.88, 19.1)); }
  else { pill('VILLAGE', 250, 300, 60, GRN, seg(t, 21.1, 21.35)); pill('TOKYO', 810, 300, 60, '#ff3aa8', seg(t, 23.68, 23.9)); if (t > 24.28) bigText('1 SECOND', W / 2, 1330, 140, '#fff', seg(t, 24.28, 24.5), { glow: VIO }); }
}

// ---------- S4 25.2–31.2: sınırlar, hapishaneler, kasalar = anlamsız ----------
function s4(t) {
  bg(t, '#1a1008', '#000');
  cam({ zoom: 1.03 + .04 * seg(t, 25.2, 31.2), t, shake: 2 + 8 * seg(t, 29.72, 30) * (1 - seg(t, 30, 30.8)) }, () => {
    // üç bölme: sınır duvarı, hapis parmaklıkları, kasa — kişi içinden ışınlanır
    const cols = [[200, 26.9, 'BORDER'], [W / 2, 27.46, 'PRISON'], [880, 28.1, 'VAULT']];
    cols.forEach(([x, t0, l], i) => { const k = eback(seg(t, t0, t0 + .3)); if (k <= 0) return; ctx.save(); ctx.translate(x, 950); ctx.scale(k * 1.05, k * 1.25);
      if (l === 'BORDER') { ctx.fillStyle = '#8a8a8a'; for (let j = 0; j < 6; j++) ctx.fillRect(-150 + j * 50, -300, 40, 400); ctx.strokeStyle = '#ccc'; ctx.lineWidth = 4; for (let j = 0; j < 8; j++) { ctx.beginPath(); ctx.arc(-150 + j * 40, -310, 16, 0, TAU); ctx.stroke(); } }
      if (l === 'PRISON') { ctx.fillStyle = '#3a3c44'; ctx.fillRect(-150, -300, 300, 400); ctx.fillStyle = '#9aa2b0'; for (let j = 0; j < 7; j++) ctx.fillRect(-140 + j * 45, -300, 14, 400); }
      if (l === 'VAULT') { ctx.fillStyle = '#9aa2b0'; ctx.beginPath(); ctx.arc(0, -100, 170, 0, TAU); ctx.fill(); ctx.fillStyle = '#6a7080'; ctx.beginPath(); ctx.arc(0, -100, 120, 0, TAU); ctx.fill(); ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 14; ctx.save(); ctx.translate(0, -100); ctx.rotate(t); for (let j = 0; j < 3; j++) { ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.stroke(); } ctx.restore(); }
      ctx.restore();
      // ışınlanıp duvarın öbür yanına geçen kişi
      const p = seg(t, t0 + .4, t0 + 1.2); if (p > 0) { warp(x - 60, 1180, 170, 1 - clamp(p * 2), VIO); warp(x + 60, 1180, 170, clamp(p * 2 - 1), GRN); }
      txt(l, x, 1260, 50, '#fff', { align: 'center', font: 'Anton', weight: 400 });
      if (t > 29.72) { const c = seg(t, 29.72 + i * .08, 30.0 + i * .08); ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x - 140, 600); ctx.lineTo(x - 140 + 280 * c, 600 + 380 * c); ctx.moveTo(x + 140, 600); ctx.lineTo(x + 140 - 280 * c, 600 + 380 * c); ctx.stroke(); } });
  });
  kinetic(['BUT...'], W / 2, 240, 170, t, 25.4, { hl: { 'BUT...': GOLD } });
  if (t > 29.72) stampText('OBSOLETE', W / 2, 430, 130, RED, seg(t, 29.72, 29.95));
}

// ---------- S5 31.2–39.56: enerji kalkanları; hırsız, casus, istilacılar ----------
function s5(t) {
  bg(t, '#020a1a', '#000');
  const on = seg(t, 32.98, 33.7);
  cam({ zoom: 1.03 + .08 * seg(t, 36.9, 39.5), t, shake: 2 + 10 * Math.max(0, Math.sin(t * 9)) * seg(t, 37.6, 38.2) }, () => {
    // kubbe kalkan bina üstünde
    ctx.fillStyle = '#2a3040'; ctx.fillRect(330, 900, 420, 400); ctx.beginPath(); ctx.moveTo(300, 900); ctx.lineTo(540, 760); ctx.lineTo(780, 900); ctx.fill(); ctx.fillStyle = '#4a5468'; for (let i = 0; i < 4; i++) ctx.fillRect(360 + i * 100, 940, 40, 300); ctx.fillStyle = '#1a1c24'; ctx.fillRect(-300, 1300, W + 600, 800);
    if (on > 0) { ctx.save(); ctx.globalAlpha = .25 + .1 * Math.sin(t * 6); ctx.fillStyle = CY; ctx.beginPath(); ctx.arc(540, 1300, 560 * eo(on), Math.PI, 0); ctx.fill(); ctx.globalAlpha = .9; ctx.strokeStyle = CY; ctx.shadowColor = CY; ctx.shadowBlur = 40; ctx.lineWidth = 10; ctx.stroke(); ctx.lineWidth = 2; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(540, 1300, 560 * eo(on) * (i / 8), Math.PI, 0); ctx.stroke(); } ctx.restore(); }
    // dışarıda beliren davetsizler, kalkana çarpıp kıvılcım
    const S = [[120, 34.24, RED], [960, 35.0, '#9aa2b0'], [80, 35.84, GOLD], [1000, 36.4, GOLD], [200, 36.9, GOLD], [880, 37.3, GOLD]];
    S.forEach(([x, t0, c], i) => { const k = seg(t, t0, t0 + .5); if (k <= 0) return; warp(x, 1300, 190, k, c); const hit = seg(t, t0 + .6, t0 + .9); if (hit > 0 && hit < 1) { ctx.save(); ctx.translate(x < 540 ? 70 : 1010, 1050); ctx.globalAlpha = 1 - hit; for (let j = 0; j < 10; j++) { const a = j / 10 * TAU; ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 80 * hit, Math.sin(a) * 80 * hit); ctx.stroke(); } ctx.restore(); } });
    if (t > 35.84) { const R = RN(2), k = seg(t, 35.84, 38.6); for (let i = 0; i < 30; i++) { if (R() > k) continue; human(R() * W, 1450 + R() * 150, 60 + R() * 30); } }
  });
  if (t < 32.98) kinetic(['GOVERNMENTS', 'PANIC'], W / 2, 240, 130, t, 31.5, { hl: { PANIC: RED } });
  else bigText('ENERGY SHIELDS', W / 2, 240, 120, CY, seg(t, 32.98, 33.25), { glow: CY });
  pill('THIEVES', 230, 440, 54, RED, seg(t, 34.24, 34.45)); pill('SPIES', 850, 440, 54, '#9aa2b0', seg(t, 35.0, 35.2)); if (t > 35.84) pill('MILLIONS', W / 2, 560, 60, GOLD, seg(t, 35.84, 36.05));
  if (t > 38.24) stampText('RESTRICTED', W / 2, 700, 110, RED, seg(t, 38.24, 38.5));
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 8.1, 16.6, 25.2, 31.2, 99], S = [s1, s2, s3, s4, s5];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 5.72 && t < 5.9 ? .7 : 0) + (t > 11.9 && t < 12.1 ? .7 : 0) + (t > 22.42 && t < 22.6 ? .4 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
