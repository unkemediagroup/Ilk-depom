// 10.video — "What If the Sun Disappeared for 24 Hours?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 33.72;
const SUBY = 1540;
const ICE = '#9fe0ff';

function sun(x, y, r, t, k = 1) { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + t * .3, l = r * (1.3 + .25 * Math.sin(t * 4 + i * 1.7)); ctx.strokeStyle = 'rgba(255,190,60,.5)'; ctx.lineWidth = r * .08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05); ctx.lineTo(Math.cos(a) * l, Math.sin(a) * l); ctx.stroke(); }
  const g = ctx.createRadialGradient(0, 0, r * .1, 0, 0, r * 2.2); g.addColorStop(0, '#fffbe0'); g.addColorStop(.35, '#ffd23a'); g.addColorStop(.45, 'rgba(255,140,30,.6)'); g.addColorStop(1, 'rgba(255,90,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(0, 0, r * .45, 0, TAU); ctx.fill(); ctx.restore(); }
function frost(a) { if (a <= 0) return; const R = RN(13); ctx.save(); ctx.strokeStyle = `rgba(220,245,255,${.8 * a})`; ctx.lineWidth = 3;
  for (let i = 0; i < 70; i++) { const c = i % 4, cx = c % 2 ? W : 0, cy = c > 1 ? H : 0, base = [0, Math.PI / 2, -Math.PI / 2, Math.PI][c], an = base + R() * Math.PI / 2, l = (120 + R() * 420) * a;
    ctx.beginPath(); ctx.moveTo(cx, cy); const ex = cx + Math.cos(an) * l, ey = cy + Math.sin(an) * l; ctx.lineTo(ex, ey); for (const s of [-1, 1]) { ctx.moveTo(cx + Math.cos(an) * l * .6, cy + Math.sin(an) * l * .6); ctx.lineTo(cx + Math.cos(an) * l * .6 + Math.cos(an + s * .7) * l * .2, cy + Math.sin(an) * l * .6 + Math.sin(an + s * .7) * l * .2); } ctx.stroke(); }
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .8); g.addColorStop(0, 'rgba(160,220,255,0)'); g.addColorStop(1, `rgba(160,220,255,${.35 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }

// ---------- S1 0–4.04: güneş söner, 24 saat sayacı ----------
function s1(t) {
  const off = seg(t, 1.44, 1.75);
  space(t, 7, { top: '#020208', bot: '#080a1a' });
  if (off < 1) { ctx.fillStyle = `rgba(255,150,40,${.25 * (1 - off)})`; ctx.fillRect(0, 0, W, H); }
  cam({ zoom: 1.1 - .08 * seg(t, 0, 4), t, shake: t > 1.44 && t < 2.2 ? 20 * (1 - seg(t, 1.44, 2.2)) : 4 }, () => {
    sun(W / 2, 520, 260, t, (1 - ei(off)) * (1 + .05 * Math.sin(t * 30) * seg(t, .8, 1.44)));
    if (off > 0) { ring2(W / 2, 520, seg(t, 1.44, 2.3), 1000, '#ffd23a', 30); shards(W / 2, 520, seg(t, 1.44, 3.0), 60, 4, R => R > .5 ? '#ffd23a' : '#ff8a3a', 16, 900); }
    dashedGhost(W / 2, 520, 120, t, seg(t, 1.9, 2.4));
    earth(W / 2, 1900, 900, t, { rot: t * .1 + 2, light: Math.PI / 2, term: -.3, dark: lerp(.4, .95, off) });
  });
  kinetic(['WHAT', 'IF', 'THE', 'SUN'], W / 2, 1040, 140, t, 0, { gap: .06 });
  kinetic(['VANISHED?'], W / 2, 1200, 180, t, 1.35, { hl: { 'VANISHED?': '#ffd23a' } });
  if (t > 2.34) { const sec = Math.floor(seg(t, 2.34, 4.04) * 3); ctx.save(); ctx.globalAlpha = seg(t, 2.34, 2.6); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.roundRect(170, 140, 740, 200, 40); ctx.fill();
    txt('23:59:5' + (9 - sec), W / 2, 245, 130, ICE, { align: 'center', font: 'Anton', weight: 400, glow: '#3da5ff' }); ctx.restore(); }
  flash(t, 1.44, .25, '255,240,200');
}

// ---------- S2 4.04–6.4: hemen donmaz ----------
function s2(t) {
  space(t, 9);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    earth(W / 2, 860, 380, t, { rot: t * .4, dark: .5 });
    // buz küpü konturu → üstü çizilir
    const k = eback(seg(t, 5.32, 5.7)); if (k > 0) { ctx.save(); ctx.translate(W / 2, 860); ctx.scale(k, k); ctx.strokeStyle = ICE; ctx.lineWidth = 12; ctx.shadowColor = ICE; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-460, -460, 920, 920, 60); ctx.stroke(); ctx.restore(); }
    stampX(W / 2, 860, 500, seg(t, 5.62, 5.95));
  });
  kinetic(["WOULDN'T", 'INSTANTLY'], W / 2, 220, 130, t, 4.3);
  if (t > 5.32) bigText('FREEZE SOLID', W / 2, 1420, 130, ICE, seg(t, 5.32, 5.6), { glow: '#3da5ff' });
}

// ---------- S3 6.4–11.12: ışık kaybı → dondurucu karanlık ----------
function s3(t) {
  const dk = eio(seg(t, 6.6, 9.6));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#4aa0f0', '#020208', dk)); g.addColorStop(1, lerpC('#cfe8ff', '#0a0f22', dk)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (dk > .3) { ctx.save(); ctx.globalAlpha = (dk - .3) / .7; space(t, 15, { top: 'rgba(0,0,0,0)', bot: 'rgba(0,0,0,0)', neb: false, drift: 0 }); ctx.restore(); }
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    if (dk < 1) sun(W / 2, lerp(380, 1500, dk), 160, t, 1 - dk);
    // tepeler + ağaçlar + göl
    for (let k = 0; k < 2; k++) { ctx.fillStyle = lerpC(['#4f9a4a', '#2f7a3a'][k], ['#0c1a14', '#060e0a'][k], dk); ctx.beginPath(); ctx.moveTo(-300, H); for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, 1150 + k * 150 + Math.sin(x * .006 + k * 2) * 80); ctx.lineTo(W + 300, H); ctx.fill(); }
    ctx.fillStyle = lerpC('#5fb0ff', '#bfe8ff', seg(t, 9.4, 10.8)); ctx.beginPath(); ctx.ellipse(W / 2, 1430, 360, 70, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 7; i++) { const x = 80 + i * 160, y = 1240 + (i % 2) * 70; ctx.fillStyle = lerpC('#2a6a2a', '#0a140e', dk); ctx.beginPath(); ctx.moveTo(x, y - 200); ctx.lineTo(x - 60, y); ctx.lineTo(x + 60, y); ctx.fill(); }
  });
  frost(seg(t, 9.44, 11.0));
  kinetic(['LOSS', 'OF', 'LIGHT'], W / 2, 220, 150, t, 6.5);
  if (t > 8.94) bigText('TOTAL FREEZING DARKNESS', W / 2, 400, 90, ICE, seg(t, 8.94, 9.2), { glow: '#3da5ff' });
}
function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }

// ---------- S4 11.12–15.08: sıcaklık çakılır, fotosentez durur ----------
const TEMP = Array.from({ length: 25 }, (_, h) => 15 - 35 * (1 - Math.exp(-h / 9)));
function leaf(x, y, s, life, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.5 + Math.sin(t * 2) * .05); const col = lerpC('#8a8a80', '#3ad06a', life);
  ctx.fillStyle = col; ctx.shadowColor = life > .5 ? '#3ad06a' : 'transparent'; ctx.shadowBlur = 40 * life; ctx.beginPath(); ctx.moveTo(0, -s * .5); ctx.quadraticCurveTo(s * .4, -s * .1, 0, s * .5); ctx.quadraticCurveTo(-s * .4, -s * .1, 0, -s * .5); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = lerpC('#5a5a52', '#1f8a3f', life); ctx.lineWidth = s * .02; ctx.beginPath(); ctx.moveTo(0, -s * .45); ctx.lineTo(0, s * .6); ctx.stroke(); for (let i = 0; i < 5; i++) { const yy = -s * .3 + i * s * .14; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(s * .2, yy - s * .1); ctx.moveTo(0, yy); ctx.lineTo(-s * .2, yy - s * .1); ctx.stroke(); } ctx.restore(); }
function s4(t) {
  bgFinance(t, { tint: 'rgba(61,165,255,.2)', seed: 4, dot: '160,210,255', top: '#06101c', bot: '#02050a' });
  const p = seg(t, 11.3, 12.6), ph = seg(t, 12.76, 14.4);
  cam({ zoom: 1.02, t, shake: 2 }, () => {
    if (t < 12.7) { lineChart(100, 400, 880, 700, TEMP, p, { col: ICE }); txt(Math.round(lerp(15, TEMP[24], eo(p))) + '°C', W / 2, 1250, 170, ICE, { align: 'center', font: 'Anton', weight: 400, glow: '#3da5ff' }); }
    else { leaf(W / 2, 850, 560, 1 - ph, t);
      for (let i = 0; i < 5; i++) { const q = ((t * 1.2 + i / 5) % 1); ctx.save(); ctx.globalAlpha = (1 - ph) * Math.sin(q * Math.PI); ctx.strokeStyle = '#ffd23a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(150 + i * 60, 200 + q * 400); ctx.lineTo(200 + i * 60, 260 + q * 400); ctx.stroke(); ctx.restore(); }
      stampText('HALTED', W / 2, 1300, 130, C.red, seg(t, 14.0, 14.3)); }
  });
  if (t < 12.7) kinetic(['TEMPERATURES', 'PLUMMET'], W / 2, 220, 120, t, 11.3, { hl: { PLUMMET: ICE } });
  else kinetic(['PHOTOSYNTHESIS'], W / 2, 220, 140, t, 13.4, { hl: { PHOTOSYNTHESIS: C.green } });
}

// ---------- S5 15.08–17.86: uydular ve iletişim çıldırır ----------
function sat(x, y, s, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#c9d2de'; ctx.fillRect(-s * .15, -s * .12, s * .3, s * .24); ctx.fillStyle = '#2f5aa8'; ctx.fillRect(-s * .6, -s * .08, s * .4, s * .16); ctx.fillRect(s * .2, -s * .08, s * .4, s * .16);
  ctx.strokeStyle = '#8a95a6'; ctx.lineWidth = 3; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s * .6 + i * s * .1, -s * .08); ctx.lineTo(-s * .6 + i * s * .1, s * .08); ctx.moveTo(s * .2 + i * s * .1, -s * .08); ctx.lineTo(s * .2 + i * s * .1, s * .08); ctx.stroke(); } ctx.restore(); }
function s5(t) {
  space(t, 22);
  const hw = seg(t, 16.6, 17.2);
  cam({ zoom: 1.03, t, shake: 3 + 12 * hw }, () => {
    earth(W / 2, 980, 330, t, { rot: t * .3, dark: .9 });
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + t * (.6 + i * .1), r = 470 + i * 40, x = W / 2 + Math.cos(a) * r + hw * Math.sin(t * 13 + i) * 60, y = 980 + Math.sin(a) * r * .45 + hw * Math.cos(t * 11 + i) * 60;
      sat(x, y, 140, a + hw * t * (3 + i)); if (hw < .5) { ctx.strokeStyle = 'rgba(95,240,255,.5)'; ctx.setLineDash([10, 10]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(W / 2, 980); ctx.stroke(); ctx.setLineDash([]); } }
  });
  // sinyal çubukları
  ctx.save(); ctx.translate(820, 220); for (let i = 0; i < 4; i++) { const on = hw < .3 || Math.sin(t * 30 + i) > .6; ctx.fillStyle = on ? C.green : 'rgba(255,255,255,.2)'; ctx.fillRect(i * 50, -i * 30, 36, 40 + i * 30); } ctx.restore();
  kinetic(['SATELLITES'], 380, 220, 120, t, 15.08, { maxW: 600 });
  if (t > 16.94) stampText('HAYWIRE', W / 2, 1420, 140, C.red, seg(t, 16.94, 17.2));
}

// ---------- S6 17.86–23.38: kitlesel panik, boş yıldızlı boşluğa bakmak ----------
function looker(x, y, s, t, i) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#05060c'; ctx.beginPath(); ctx.arc(0, -s * .88, s * .12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .16, -s * .76, s * .32, s * .46, s * .08); ctx.fill(); ctx.fillRect(-s * .13, -s * .32, s * .1, s * .32); ctx.fillRect(s * .03, -s * .32, s * .1, s * .32);
  // el feneri ışını yukarı
  const a = -Math.PI / 2 + Math.sin(t * 1.5 + i * 1.7) * .4; ctx.translate(s * .2, -s * .6); ctx.rotate(a); const g = ctx.createLinearGradient(0, 0, 900, 0); g.addColorStop(0, 'rgba(255,240,180,.45)'); g.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(900, -90); ctx.lineTo(900, 90); ctx.fill(); ctx.restore(); }
function s6(t) {
  const zoomOut = eo(seg(t, 20.2, 23.3));
  space(t, 31, { top: '#000004', bot: '#0a0c1c', n: 500, drift: 4 });
  cam({ zoom: 1 + .1 * Math.sin(t * .5), y: -500 * zoomOut, t, shake: t < 19.8 ? 6 : 2 }, () => {
    skyline(1300, t, { seed: 61, tall: 300, col: '#05060c' });
    const hg = ctx.createLinearGradient(0, 1150, 0, 1470); hg.addColorStop(0, 'rgba(70,90,160,0)'); hg.addColorStop(1, 'rgba(90,110,190,.75)'); ctx.fillStyle = hg; ctx.fillRect(-300, 1150, W + 600, 320);
    ctx.fillStyle = '#030408'; ctx.fillRect(-300, 1465, W + 600, 1200);
    for (let i = 0; i < 9; i++) looker(70 + i * 120 + (t < 19.8 ? Math.sin(t * 9 + i) * 20 : 0), 1470, 260 + (i % 3) * 30, t, i);
  });
  if (t < 20.1) { kinetic(['MASS', 'PANIC'], W / 2, 260, 180, t, 18.1, { hl: { PANIC: C.red } }); }
  else { kinetic(['STARING', 'INTO'], W / 2, 260, 120, t, 20.2); bigText('AN EMPTY VOID', W / 2, 420, 140, '#fff', seg(t, 21.16, 21.45), { glow: '#7f8cff' }); }
}

// ---------- S7 23.38–27.76: Dünya tek günü atlatabilir mi? ----------
function s7(t) {
  space(t, 40);
  const day = seg(t, 23.4, 27.0), fr = seg(t, 26.8, 27.7);
  cam({ zoom: 1.03 + .06 * fr, t, shake: 2 + 6 * fr }, () => {
    const cx = W / 2, cy = 860; ctx.lineWidth = 50; ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.arc(cx, cy, 440, 0, TAU); ctx.stroke();
    ctx.strokeStyle = ICE; ctx.shadowColor = '#3da5ff'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(cx, cy, 440, -Math.PI / 2, -Math.PI / 2 + TAU * day); ctx.stroke(); ctx.shadowBlur = 0;
    for (let i = 0; i < 24; i++) { const a = -Math.PI / 2 + i / 24 * TAU; ctx.fillStyle = i < day * 24 ? ICE : 'rgba(255,255,255,.3)'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * 520, cy + Math.sin(a) * 520, 8, 0, TAU); ctx.fill(); }
    earth(cx, cy, 330, t, { rot: t * .5, dark: .85, sea0: lerpC('#2f8ee8', '#cfeaff', day), sea1: lerpC('#0a2f6e', '#6aa8d8', day), land: lerpC('#3f9b4c', '#e8f4ff', day) });
    txt(Math.round(day * 24) + 'H', cx, cy, 150, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#000' });
  });
  frost(fr);
  kinetic(['A', 'SINGLE', 'DAY?'], W / 2, 200, 150, t, 24.3, { hl: { 'DAY?': ICE } });
  if (t > 26.6) bigText('FREEZE IN THE DARK?', W / 2, 1430, 110, ICE, seg(t, 26.6, 26.9), { glow: '#3da5ff' });
}

const THEO = ['We would survive easily', 'Plants would die fast', 'Best stargazing ever', 'Total global panic', 'Oceans keep us warm', 'Just sleep it off'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 4.04, 6.4, 11.12, 15.08, 17.86, 23.38, 27.76, 99], S = [s1, s2, s3, s4, s5, s6, s7, null];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i] ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 27.76), 27.76, 29.9, 30.46, THEO, { tint: 'rgba(255,200,60,.18)', dot: '255,220,140' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 1.44 && t < 1.6 ? .8 : 0) + (t > 16.94 && t < 17.8 ? .7 * (Math.sin(t * 20) > 0 ? 1 : .3) : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
