// Seri2 #14 — "What If Humans Could Breathe Underwater?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 41.40;
const SUBY = 1540;
const AQ = '#3affe0', SEA = '#1a6ad8', RED = '#ff3b4e', GOLD = '#ffc83d';

function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function ocean(t, d = 0) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#2a9ae8', '#04142a', d)); g.addColorStop(1, lerpC('#062a5a', '#000208', d)); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  for (let i = 0; i < 6; i++) { const x = i * 200 + Math.sin(t * .4 + i) * 60; ctx.save(); ctx.globalAlpha = .08 * (1 - d); ctx.fillStyle = '#e8f8ff'; ctx.beginPath(); ctx.moveTo(x - 30, -100); ctx.lineTo(x + 30, -100); ctx.lineTo(x + 220, H); ctx.lineTo(x + 80, H); ctx.fill(); ctx.restore(); }
  const R = RN(3); for (let i = 0; i < 40; i++) { const x = R() * W + Math.sin(t + i) * 20, y = ((R() * H - t * (40 + R() * 60)) % H + H) % H; ctx.strokeStyle = 'rgba(220,250,255,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 3 + R() * 8, 0, TAU); ctx.stroke(); } }
function diver(x, y, s, t, ph = 0, col = '#0e2238') { const k = Math.sin(t * 5 + ph); ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(0, 0, s * .26, s * .08, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(s * .34, -s * .02, s * .08, 0, TAU); ctx.fill();
  ctx.lineWidth = s * .07; ctx.beginPath(); ctx.moveTo(-s * .2, 0); ctx.lineTo(-s * .5, k * s * .1); ctx.moveTo(-s * .2, s * .03); ctx.lineTo(-s * .5, -k * s * .1 + s * .03); ctx.moveTo(s * .2, -s * .02); ctx.lineTo(s * .45 + k * s * .05, -s * .14); ctx.stroke();
  ctx.strokeStyle = AQ; ctx.lineWidth = s * .012; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(s * .28, -s * .03 + i * s * .02, s * .025, -1, 1); ctx.stroke(); } ctx.restore(); }

// ---------- S1 0–3.2: boyunda açılan solungaçlar ----------
function s1(t) {
  ocean(t, .2);
  const op = .5 + .5 * Math.sin(t * 5);
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 3.1)), t, shake: 2 }, () => {
    // profil boyun + çene yakın plan
    ctx.fillStyle = '#e8b48a'; ctx.beginPath(); ctx.moveTo(200, H); ctx.lineTo(260, 900); ctx.quadraticCurveTo(300, 520, 520, 420); ctx.quadraticCurveTo(760, 380, 860, 520); ctx.lineTo(820, 640); ctx.quadraticCurveTo(700, 700, 640, 760); ctx.lineTo(700, H); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.ellipse(470, 1050, 220, 330, 0, 0, TAU); ctx.fill();
    // solungaç yarıkları
    for (let i = 0; i < 4; i++) { const y = 900 + i * 85, w = 230 - i * 20, h = 10 + 22 * op; ctx.fillStyle = '#7a1a2a'; ctx.beginPath(); ctx.ellipse(470, y, w / 2, h, -.15, 0, TAU); ctx.fill(); ctx.strokeStyle = AQ; ctx.lineWidth = 5; ctx.shadowColor = AQ; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(470, y, w / 2, h, -.15, Math.PI, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
    // kabarcıklar solungaçtan çıkar
    for (let i = 0; i < 12; i++) { const q = ((t * .9 + i / 12) % 1); ctx.strokeStyle = `rgba(220,250,255,${1 - q})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(600 + q * 300 + Math.sin(q * 8 + i) * 20, 1000 - q * 600 + (i % 4) * 60, 10 + (i % 3) * 8, 0, TAU); ctx.stroke(); }
  });
  kinetic(['WHAT', 'IF', 'HUMANS', 'HAD'], W / 2, 210, 140, t, -.3, { gap: .05 });
  kinetic(['GILLS?'], W / 2, 380, 210, t, .2, { hl: { 'GILLS?': AQ } });
}

// ---------- S2 3.2–8.68: gezegenin %71'i yeni arka bahçemiz ----------
function s2(t) {
  space(t, 4);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    earth(W / 2, 880, 330, t, { rot: t * .4 });
    donut(W / 2, 880, 450, [{ v: 71, col: SEA }, { v: 29, col: '#5a8a3a' }], seg(t, 3.2, 4.2), { hole: .8, holeCol: 'rgba(0,0,0,0)' });
    counter(0, 71, W / 2, 1440, 200, seg(t, 3.2, 3.9), { fmt: v => Math.round(v) + '%', col: AQ });
    // çit = arka bahçe
    if (t > 7.06) { const k = eback(seg(t, 7.06, 7.4)); ctx.save(); ctx.translate(W / 2, 1290); ctx.scale(k, k); ctx.fillStyle = '#fff'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-320 + i * 80, 0); ctx.lineTo(-320 + i * 80, -90); ctx.lineTo(-295 + i * 80, -120); ctx.lineTo(-270 + i * 80, -90); ctx.lineTo(-270 + i * 80, 0); ctx.fill(); } ctx.fillRect(-330, -70, 700, 16); ctx.fillRect(-330, -30, 700, 16); ctx.restore(); }
  });
  kinetic(['OFF-LIMITS', '→', 'BACKYARD'], W / 2, 230, 120, t, 4.8, { hl: { BACKYARD: AQ } });
}

// ---------- S3 8.68–16.26: kıta sahanlığında su altı şehirleri ----------
function s3(t) {
  ocean(t, .3);
  const bld = eo(seg(t, 11.6, 14.0)), mig = seg(t, 9.6, 12.2);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    // kesit: kara → sahanlık → derinlik
    ctx.fillStyle = '#c9a77a'; ctx.beginPath(); ctx.moveTo(-300, 600); ctx.lineTo(200, 600); ctx.lineTo(260, 700); ctx.lineTo(820, 820); ctx.lineTo(1000, 1450); ctx.lineTo(W + 300, 1500); ctx.lineTo(W + 300, H); ctx.lineTo(-300, H); ctx.fill();
    ctx.fillStyle = '#87c6ff'; ctx.fillRect(-300, -300, 500, 900); ctx.fillStyle = '#5aa83a'; ctx.fillRect(-300, 580, 500, 30); skyline(590, t, { seed: 7, tall: 260, col: '#3a4a6a' });
    // kalabalık aşağı iner
    for (let i = 0; i < 10; i++) { const q = clamp(mig * 1.5 - i * .05), x = lerp(40 + i * 15, 300 + i * 50, q), y = lerp(580, 700 + i * 12, q); ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.arc(x, y - 22, 8, 0, TAU); ctx.fill(); ctx.fillRect(x - 6, y - 14, 12, 18); }
    // cam kuleler sahanlıkta
    for (let i = 0; i < 6; i++) { const x = 300 + i * 90, base = 700 + (x - 260) * .21, h = (180 + (i % 3) * 120) * bld; ctx.fillStyle = 'rgba(58,255,224,.18)'; ctx.strokeStyle = AQ; ctx.lineWidth = 4; ctx.shadowColor = AQ; ctx.shadowBlur = 16; ctx.beginPath(); ctx.roundRect(x, base - h, 70, h, [30, 30, 0, 0]); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,240,180,.8)'; for (let y = base - h + 30; y < base - 10; y += 40) ctx.fillRect(x + 20, y, 30, 14); }
    // tüp yollar
    if (bld > .5) { ctx.strokeStyle = 'rgba(58,255,224,.5)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(335, 640); ctx.quadraticCurveTo(560, 560, 785, 700); ctx.stroke(); }
  });
  kinetic(['OVERPOPULATION'], W / 2, 230, 130, t, 8.7); if (t > 10.16) stampText('GONE', 820, 380, 120, RED, seg(t, 10.16, 10.4));
  if (t > 14.4) bigText('CONTINENTAL SHELVES', W / 2, 1440, 100, AQ, seg(t, 14.4, 14.65), { glow: AQ });
}

// ---------- S4 16.26–22.2: batıklar, hazineler, hendekler = turistik yerler ----------
function s4(t) {
  ocean(t, .55);
  cam({ zoom: 1.03, x: lerp(120, -120, seg(t, 16.3, 22.1)), t, shake: 1 }, () => {
    ctx.fillStyle = '#3a3040'; ctx.fillRect(-400, 1250, W + 800, 700);
    // batık gemi
    ctx.save(); ctx.translate(380, 1240); ctx.rotate(-.18); ctx.fillStyle = '#4a3a2a'; ctx.beginPath(); ctx.moveTo(-320, -80); ctx.lineTo(300, -80); ctx.lineTo(240, 40); ctx.lineTo(-260, 40); ctx.fill(); ctx.fillRect(-40, -380, 18, 300); ctx.fillStyle = 'rgba(200,190,170,.5)'; ctx.beginPath(); ctx.moveTo(-22, -360); ctx.lineTo(160, -220); ctx.lineTo(-22, -140); ctx.fill(); ctx.restore();
    // hazine sandığı
    const k = eback(seg(t, 17.02, 17.4)); if (k > 0) { ctx.save(); ctx.translate(780, 1250); ctx.scale(k, k); ctx.fillStyle = '#8a5a2a'; ctx.fillRect(-110, -110, 220, 110); ctx.save(); ctx.translate(-110, -110); ctx.rotate(-.7); ctx.fillRect(0, -50, 220, 50); ctx.restore(); ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 40; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(-80 + i * 27, -115 - (i % 2) * 15, 18, 0, TAU); ctx.fill(); } ctx.restore(); }
    // tur rehberi + turist grubu
    for (let i = 0; i < 5; i++) diver(200 + i * 150 + Math.sin(t + i) * 20, 720 + (i % 2) * 110, 340, t, i, i === 0 ? '#ff8a3a' : '#0e2238');
    ctx.fillStyle = '#ff8a3a'; ctx.fillRect(100, 600, 8, 90); ctx.beginPath(); ctx.roundRect(100, 560, 160, 60, 10); ctx.fill(); txt('TOURS', 180, 592, 34, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  });
  pill('SHIPWRECKS', 260, 420, 54, '#c9a77a', seg(t, 16.26, 16.5)); pill('TREASURES', 800, 420, 54, GOLD, seg(t, 17.02, 17.25)); pill('TRENCHES', W / 2, 520, 54, AQ, seg(t, 18.02, 18.25));
  if (t > 20.04) bigText('TOURIST HOTSPOTS', W / 2, 260, 120, '#fff', seg(t, 20.04, 20.3), { glow: AQ });
}

// ---------- S5 22.2–33.76: yeni tehlikeler: besin zincirinin tepesi değiliz ----------
function shark(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#5a6a7a'; ctx.beginPath(); ctx.moveTo(s * .55, 0); ctx.quadraticCurveTo(s * .2, -s * .2, -s * .4, -s * .05); ctx.lineTo(-s * .6, -s * .2 + Math.sin(t * 8) * s * .05); ctx.lineTo(-s * .5, 0); ctx.lineTo(-s * .6, s * .18); ctx.lineTo(-s * .4, s * .06); ctx.quadraticCurveTo(s * .2, s * .16, s * .55, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -s * .14); ctx.lineTo(-s * .1, -s * .38); ctx.lineTo(s * .12, -s * .13); ctx.fill(); ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.moveTo(s * .55, 0); ctx.quadraticCurveTo(s * .2, s * .14, -s * .3, s * .05); ctx.quadraticCurveTo(s * .2, s * .04, s * .55, 0); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(s * .38, -s * .04, s * .02, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(s * .4 + i * s * .025, s * .04); ctx.lineTo(s * .41 + i * s * .025, s * .07); ctx.lineTo(s * .42 + i * s * .025, s * .04); ctx.fill(); } ctx.restore(); }
function s5(t) {
  const late = t > 29.8;
  ocean(t, late ? .85 : .6);
  cam({ zoom: 1.03 + (late ? .1 * seg(t, 30.1, 30.8) : 0), t, shake: 2 + (late ? 14 * seg(t, 30.16, 30.5) * (1 - seg(t, 30.5, 31.2)) : 0) }, () => {
    if (!late) { // besin zinciri merdiveni: insan düşer
      const lv = ['SHARKS', 'SQUIDS', 'HUMANS', 'FISH', 'PLANKTON']; const fall = eio(seg(t, 27.3, 28.4));
      lv.forEach((l, i) => { const y = 520 + i * 180, isH = l === 'HUMANS'; ctx.fillStyle = isH ? 'rgba(255,200,61,.25)' : 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.roundRect(240, y - 60, 600, 120, 20); ctx.fill(); txt(l, W / 2, y, 64, isH ? GOLD : '#fff', { align: 'center', font: 'Anton', weight: 400 }); });
      // insan simgesi zirveden düşer
      const hy = lerp(330, 880, fall); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(900, hy - 50, 28, 0, TAU); ctx.fill(); ctx.fillRect(880, hy - 20, 40, 70); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(870, 280); ctx.lineTo(930, 280); ctx.lineTo(900, 240); ctx.fill();
      txt('TOP', 900, 210, 40, '#fff', { align: 'center', font: 'Anton', weight: 400 });
    } else { // köpekbalığı hücumu, dev mürekkep balığı dokunaçları, zehirli denizanası
      const ch = eo(seg(t, 30.16, 30.9)); shark(lerp(1400, 560, ch), 820, 900 * (1 + .4 * ch), t);
      const sq = seg(t, 30.9, 31.6); if (sq > 0) for (let k = 0; k < 5; k++) { ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 50 - k * 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-50 + k * 70, H); for (let i = 0; i < 10 * sq; i++) ctx.lineTo(-50 + k * 70 + Math.sin(i * .7 + t * 3 + k) * 80, H - i * 80); ctx.stroke(); }
      const jl = seg(t, 31.96, 32.4); if (jl > 0) for (let i = 0; i < 3; i++) { const x = 720 + i * 120, y = 1250 + Math.sin(t * 2 + i) * 20; ctx.fillStyle = `rgba(200,120,255,${.7 * jl})`; ctx.shadowColor = '#c87aff'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.ellipse(x, y, 60, 40, 0, Math.PI, 0); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(200,120,255,${.6 * jl})`; ctx.lineWidth = 4; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - 45 + k * 30, y); for (let j = 1; j < 8; j++) ctx.lineTo(x - 45 + k * 30 + Math.sin(t * 3 + j + k) * 10, y + j * 20); ctx.stroke(); } }
    }
  });
  if (!late) { kinetic(['NEW', 'DANGERS'], W / 2, 230, 170, t, 24.5, { hl: { DANGERS: RED } }); if (t > 27.56) stampText('NOT THE TOP', W / 2, 1400, 120, RED, seg(t, 27.56, 27.8)); }
  else { pill('SHARKS', 260, 300, 60, '#9aa2b0', seg(t, 30.16, 30.4)); pill('GIANT SQUIDS', 540, 400, 56, RED, seg(t, 30.9, 31.1)); pill('VENOM', 830, 300, 60, '#c87aff', seg(t, 31.96, 32.2)); }
}

// ---------- S6 33.76–41.4: yeniden çizilen sınırlar, su altı savaşları ----------
function sub(x, y, s, dir, col) { ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, s * .5, s * .14, 0, 0, TAU); ctx.fill(); ctx.fillRect(-s * .08, -s * .26, s * .18, s * .14); ctx.fillRect(-s * .55, -s * .1, s * .08, s * .2); ctx.fillStyle = '#ffd890'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s * .2 + i * s * .12, 0, s * .025, 0, TAU); ctx.fill(); } ctx.restore(); }
function s6(t) {
  ocean(t, .8);
  const war = t > 36.5;
  cam({ zoom: 1.03, t, shake: 2 + (war ? 6 * Math.max(0, Math.sin(t * 7)) : 0) }, () => {
    ctx.fillStyle = '#2a2430'; ctx.fillRect(-300, 1250, W + 600, 700);
    // parlayan mineral yumruları
    const R = RN(5); for (let i = 0; i < 14; i++) { const x = 60 + R() * 960, y = 1270 + R() * 200; ctx.fillStyle = ['#3affe0', '#ffc83d', '#c87aff'][i % 3]; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 20 + 15 * Math.sin(t * 3 + i); ctx.beginPath(); ctx.arc(x, y, 18 + R() * 14, 0, TAU); ctx.fill(); } ctx.shadowBlur = 0;
    // yeniden çizilen sınırlar
    const bd = seg(t, 34.0, 35.8); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.setLineDash([26, 18]); ctx.lineDashOffset = -t * 50; for (const [x0, a] of [[360, .2], [720, -.15]]) { ctx.beginPath(); ctx.moveTo(x0, 400); ctx.lineTo(x0 + Math.sin(a) * 900 * bd, 400 + 900 * bd); ctx.stroke(); } ctx.setLineDash([]);
    // denizaltılar karşı karşıya + torpidolar
    sub(240 + Math.sin(t * 1.5) * 30, 880, 360, 1, '#3a4a6a'); sub(840 - Math.sin(t * 1.5) * 30, 980, 360, -1, '#6a3a3a');
    if (war) for (let i = 0; i < 4; i++) { const q = ((t * .9 + i / 4) % 1), dir = i % 2 ? -1 : 1, x = dir > 0 ? lerp(420, 900, q) : lerp(660, 180, q), y = dir > 0 ? 880 : 980; ctx.fillStyle = '#d8dee8'; ctx.fillRect(x - 30, y - 8, 60, 16); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - dir * 30, y); ctx.lineTo(x - dir * 160, y); ctx.stroke(); }
  });
  kinetic(['BORDERS', 'REDRAWN'], W / 2, 230, 150, t, 33.8, { hl: { REDRAWN: RED } });
  if (war) stampText('UNDERWATER WARS', W / 2, 620, 100, RED, seg(t, 36.8, 37.1));
  if (t > 39.02) bigText('MINERALS & TERRITORY', W / 2, 400, 90, AQ, seg(t, 39.02, 39.3), { glow: AQ });
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 3.2, 8.68, 16.26, 22.2, 33.76, 99], S = [s1, s2, s3, s4, s5, s6];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 30.16 && t < 30.35 ? .8 : 0) + (t > 36.8 && t < 37.0 ? .6 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
