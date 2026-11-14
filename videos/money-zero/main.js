// 6.video — "What If Money Suddenly Became Worthless?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 40.91;
const SUBY = 1540;
const GREY = '#9a9a92';

// ---------- S1 0–3.56: para yağmuru → değeri sıfıra iner ----------
function s1(t) {
  const die = seg(t, 1.6, 2.4);
  bgFinance(t, { tint: `rgba(${Math.round(lerp(34, 255, die))},${Math.round(lerp(224, 59, die))},${Math.round(lerp(122, 78, die))},.25)`, seed: 2 });
  cam({ zoom: 1.08 - .06 * seg(t, 0, 3.5), t, shake: 4 + 16 * Math.sin(die * Math.PI) }, () => {
    const R = RN(3); for (let i = 0; i < 26; i++) { const sp = 380 + R() * 500, x = R() * W, y = ((t + R() * 10) * sp) % (H + 400) - 200;
      bill(x + Math.sin(t * 2 + i) * 60, y, 200 + R() * 110, Math.sin(t * 1.5 + i) * .8, { flip: Math.cos(t * 3 + i), col: die > R() ? GREY : '#7fc98a' }); }
    // dev banknot ortada: $100 → $0
    const v = Math.round(100 * (1 - eio(die))); ctx.save(); ctx.translate(W / 2, 760); ctx.rotate(Math.sin(t * 2) * .05);
    bill(0, 0, 820, 0, { val: String(v), col: die > .5 ? GREY : '#7fc98a' }); ctx.restore();
    if (die > 0) { ctx.save(); ctx.globalAlpha = die; const R2 = RN(6); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 6; for (let k = 0; k < 6; k++) { let x = W / 2 + (R2() - .5) * 600, y = 600; ctx.beginPath(); ctx.moveTo(x, y); for (let i = 0; i < 6; i++) { x += (R2() - .5) * 90; y += 55; ctx.lineTo(x, y); } ctx.stroke(); } ctx.restore(); }
  });
  kinetic(['WHAT', 'IF', 'MONEY'], W / 2, 1170, 150, t, 0, { gap: .06 });
  kinetic(['BECAME', 'WORTHLESS?'], W / 2, 1340, 140, t, 1.1, { hl: { 'WORTHLESS?': C.red } });
  if (t > 2.26) pill('OVERNIGHT', W / 2, 260, 80, C.violet, seg(t, 2.26, 2.5));
  flash(t, 1.66, .2, '255,80,80');
}

// ---------- S2 3.56–6.82: piyasalar çöker ----------
const CRASH = (() => { const R = RN(21), out = []; let p = 100; for (let i = 0; i < 26; i++) { const o = p, c = o + (i < 6 ? (R() - .4) * 8 : -(4 + R() * 12)); out.push({ o, c, h: Math.max(o, c) + R() * 4, l: Math.min(o, c) - R() * 5 }); p = c; } return out; })();
function s2(t) {
  bgFinance(t, { tint: 'rgba(255,59,78,.22)', seed: 4, dot: '255,120,130' });
  const p = seg(t, 3.7, 6.4);
  cam({ zoom: 1.02 + .1 * p, rot: -.04 * p, t, shake: 3 + 10 * seg(t, 5.6, 6.6) }, () => {
    candles(80, 420, 920, 900, CRASH, p);
    ctx.strokeStyle = 'rgba(255,59,78,.5)'; ctx.setLineDash([16, 12]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(80, 420); ctx.lineTo(1000, 1320 * p + 420 * (1 - p)); ctx.stroke(); ctx.setLineDash([]);
  });
  counter(0, -99, W / 2, 1420, 170, seg(t, 4.6, 6.0), { fmt: v => Math.round(v) + '%', col: C.red });
  kinetic(['GLOBAL', 'MARKETS'], W / 2, 200, 130, t, 4.5);
  if (t > 5.84) stampText('COLLAPSE', W / 2, 330, 110, C.red, seg(t, 5.84, 6.1));
}

// ---------- S3 6.82–8.32: bankalar kapılarını kilitler ----------
function s3(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a1f2e'); g.addColorStop(1, '#05070c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const sl = eback(seg(t, 7.2, 7.55));
  cam({ zoom: 1.04, t, shake: t > 7.45 && t < 8 ? 20 : 2 }, () => {
    bank(W / 2, 1300, 900, { glow: 'rgba(255,59,78,.5)' });
    // inen kepenk
    ctx.save(); ctx.beginPath(); ctx.rect(W / 2 - 400, 680, 800, 560); ctx.clip(); ctx.fillStyle = '#6a7180'; ctx.fillRect(W / 2 - 400, 680, 800, 560 * clamp(sl));
    ctx.strokeStyle = '#4a505c'; ctx.lineWidth = 6; for (let y = 700; y < 680 + 560 * clamp(sl); y += 34) { ctx.beginPath(); ctx.moveTo(W / 2 - 400, y); ctx.lineTo(W / 2 + 400, y); ctx.stroke(); } ctx.restore();
    // zincir + asma kilit
    const lk = seg(t, 7.6, 7.9); if (lk > 0) { ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = 12; for (let i = 0; i < 12; i++) { const x = W / 2 - 400 + i * 70 * lk; ctx.beginPath(); ctx.ellipse(x, 960 + (i % 2) * 10, 30, 16, (i % 2) * 1.2, 0, TAU); ctx.stroke(); }
      ctx.save(); ctx.translate(W / 2, 1000); ctx.scale(eback(lk), eback(lk)); ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(0, -40, 60, Math.PI, 0); ctx.stroke(); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.roundRect(-90, -40, 180, 150, 20); ctx.fill(); ctx.restore(); }
  });
  stampText('CLOSED', W / 2, 330, 160, C.red, seg(t, 7.66, 7.95));
}

// ---------- S4 8.32–11.68: ticaret durma noktasına gelir ----------
function gear(x, y, r, a, n, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? r : r * .82, aa = i / (n * 2) * TAU; ctx.lineTo(Math.cos(aa - .12) * rr, Math.sin(aa - .12) * rr); ctx.lineTo(Math.cos(aa + .12) * rr, Math.sin(aa + .12) * rr); } ctx.fill(); ctx.fillStyle = '#0b0f17'; ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, TAU); ctx.fill(); ctx.restore(); }
function s4(t) {
  bgFinance(t, { tint: 'rgba(255,200,61,.15)', seed: 8, dot: '255,210,140' });
  // dişliler yavaşlayıp durur
  const k = clamp((t - 8.32) / 2.36), ang = 6 * (k - k * k / 2) * 2.36;            // hız 1 → 0 (10.68'de durur)
  cam({ zoom: 1.04, t, shake: t > 10.68 && t < 11.1 ? 20 : 2 + 4 * (1 - k) }, () => {
    gear(380, 700, 260, ang, 14, '#ffc83d'); gear(720, 930, 190, -ang * 1.37 + .1, 10, '#e09a12'); gear(800, 520, 130, -ang * 2 + .2, 8, '#c9d2de');
    if (k < 1) shards(560, 820, ((t * 3) % 1), 10, Math.floor(t * 3), '#ffd36b', 8, 200);
    // POS terminali
    ctx.save(); ctx.translate(W / 2, 1240); ctx.fillStyle = '#2a3344'; ctx.beginPath(); ctx.roundRect(-200, -150, 400, 280, 30); ctx.fill(); ctx.fillStyle = t > 9.46 ? '#3a0d12' : '#0d2a1a'; ctx.fillRect(-160, -120, 320, 120);
    txt(t > 9.46 ? 'DECLINED' : 'PAY $4.99', 0, -60, 54, t > 9.46 ? C.red : C.green, { align: 'center', font: 'Anton', weight: 400, stroke: 0, glow: t > 9.46 ? C.red : C.green });
    ctx.fillStyle = '#4a5568'; for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.roundRect(-140 + i * 100, 20 + j * 50, 80, 36, 8); ctx.fill(); } ctx.restore();
  });
  kinetic(['MODERN', 'COMMERCE'], W / 2, 200, 130, t, 8.5);
  if (t > 10.68) stampText('HALT', W / 2, 1430, 150, C.red, seg(t, 10.68, 10.95));
}

// ---------- S5 11.68–15.58: nakit → değersiz kağıt parçaları ----------
function s5(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2b2a26'); g.addColorStop(1, '#0d0c0a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const tr = seg(t, 12.32, 13.4), blow = seg(t, 13.52, 15.5);
  cam({ zoom: 1.05, t, shake: 3 }, () => {
    if (tr < 1) { ctx.save(); ctx.translate(W / 2, 800); ctx.scale(1 - .2 * tr, 1 - .55 * tr); ctx.rotate(Math.sin(t * 20) * .05 * tr); bill(0, 0, 820, 0, { col: tr > .5 ? '#c9c4b4' : '#7fc98a' }); ctx.restore(); }
    // parçalara ayrılır, rüzgarla savrulur
    if (tr > .6) { const R = RN(14); for (let i = 0; i < 70; i++) { const ox = (R() - .5) * 700, oy = (R() - .5) * 300, d = blow * (600 + R() * 900), a = -.3 + R() * .6;
      ctx.save(); ctx.translate(W / 2 + ox + Math.cos(a) * d, 800 + oy + Math.sin(a) * d - blow * blow * 300 + Math.sin(t * 4 + i) * 20); ctx.rotate(t * (2 + R() * 4) * (R() > .5 ? 1 : -1));
      ctx.fillStyle = R() > .3 ? '#d8d2c0' : '#9fb79a'; ctx.beginPath(); ctx.moveTo(-30, -20); ctx.lineTo(28 + R() * 20, -14); ctx.lineTo(20, 24); ctx.lineTo(-24, 18); ctx.closePath(); ctx.fill(); ctx.restore(); } }
  });
  kinetic(['PAPER', 'CASH'], W / 2, 220, 160, t, 11.68, { hl: { CASH: C.green } });
  bigText('WORTHLESS PAPER', W / 2, 1420, 120, '#d8d2c0', seg(t, 14.28, 14.55));
}

// ---------- S6 15.58–20.2: ilkel takas ekonomisi ----------
function can(x, y, s) { ctx.save(); ctx.translate(x, y); const g = ctx.createLinearGradient(-s * .3, 0, s * .3, 0); g.addColorStop(0, '#8a939f'); g.addColorStop(.5, '#e8eef6'); g.addColorStop(1, '#6a737f'); ctx.fillStyle = g; ctx.fillRect(-s * .3, -s * .4, s * .6, s * .8);
  ctx.fillStyle = '#d9472b'; ctx.fillRect(-s * .3, -s * .22, s * .6, s * .44); txt('BEANS', 0, 0, s * .14, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = '#b8c0cc'; ctx.beginPath(); ctx.ellipse(0, -s * .4, s * .3, s * .07, 0, 0, TAU); ctx.fill(); ctx.restore(); }
function bottle(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(120,200,255,.85)'; ctx.beginPath(); ctx.roundRect(-s * .2, -s * .3, s * .4, s * .75, s * .08); ctx.fill(); ctx.fillRect(-s * .08, -s * .48, s * .16, s * .2); ctx.fillStyle = '#3da5ff'; ctx.fillRect(-s * .1, -s * .55, s * .2, s * .08);
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-s * .14, -s * .2, s * .05, s * .5); txt('H2O', 0, s * .1, s * .14, '#0b3a66', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function jerry(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#d0312d'; ctx.beginPath(); ctx.roundRect(-s * .32, -s * .38, s * .64, s * .8, s * .06); ctx.fill(); ctx.fillStyle = '#a3221f'; ctx.beginPath(); ctx.moveTo(-s * .2, -s * .3); ctx.lineTo(s * .2, s * .3); ctx.moveTo(s * .2, -s * .3); ctx.lineTo(-s * .2, s * .3); ctx.lineWidth = s * .05; ctx.strokeStyle = '#a3221f'; ctx.stroke();
  ctx.fillStyle = '#ffc83d'; ctx.fillRect(s * .1, -s * .52, s * .12, s * .16); ctx.fillStyle = '#d0312d'; ctx.fillRect(-s * .28, -s * .5, s * .26, s * .1); txt('FUEL', 0, s * .3, s * .12, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function hand(x, y, s, dir, col) { ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = col; ctx.fillRect(-600, -s * .16, 600 - s * .2, s * .32); ctx.beginPath(); ctx.roundRect(-s * .3, -s * .25, s * .5, s * .5, s * .15); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-s * .05, -s * .32, s * .35, s * .14, s * .07); ctx.fill(); ctx.restore(); }
function s6(t) {
  bgFinance(t, { tint: 'rgba(200,140,60,.22)', seed: 10, dot: '230,180,120', top: '#1e140a', bot: '#080502' });
  const sw = eio(seg(t, 18.9, 19.9));
  cam({ zoom: 1.03, t, shake: 3 }, () => {
    const lx = lerp(300, 780, sw), rx = lerp(780, 300, sw), y0 = 800 + Math.sin(sw * Math.PI) * -160;
    hand(lerp(70, 160, seg(t, 15.7, 16.4)), 1000, 260, 1, '#d6a27a'); hand(lerp(1010, 920, seg(t, 15.7, 16.4)), 1000, 260, -1, '#8a5a3c');
    can(lx, y0 + 30, 260); bottle(rx, 1600 - y0 - 30, 260);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.lineDashOffset = -t * 60;
    ctx.beginPath(); ctx.arc(W / 2, 800, 330, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.beginPath(); ctx.arc(W / 2, 800, 330, Math.PI * .1, Math.PI * .9); ctx.stroke(); ctx.setLineDash([]);
  });
  stampX(W / 2, 330, 120, seg(t, 15.84, 16.2)); txt('$', W / 2, 330, 160, '#fff', { align: 'center', font: 'Anton', weight: 400 }); stampX(W / 2, 330, 120, seg(t, 15.84, 16.2));
  kinetic(['BRUTAL', 'BARTER'], W / 2, 1300, 140, t, 18.9, { hl: { BARTER: C.gold } });
  bigText('ECONOMY', W / 2, 1430, 90, '#fff', seg(t, 19.78, 20.0));
}

// ---------- S7 20.2–24.74: yeni para birimleri ----------
function s7(t) {
  bgFinance(t, { tint: 'rgba(255,200,61,.25)', seed: 12, dot: '255,220,140' });
  cam({ zoom: 1.02 + .04 * Math.sin(t * 2), t, shake: 2 }, () => {
    const items = [[can, 20.72, 280, 520], [bottle, 21.74, 800, 520], [jerry, 22.56, W / 2, 980]];
    items.forEach(([f, t0, x, y], i) => { const p = eback(seg(t, t0, t0 + .4)); if (p <= 0) return;
      ctx.save(); ctx.translate(x, y + Math.sin(t * 3 + i) * 12); ctx.scale(p, p); ctx.fillStyle = 'rgba(255,200,61,.18)'; ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.gold; ctx.lineWidth = 12; ctx.shadowColor = C.gold; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; f(0, 0, 300); ctx.restore();
      pill(['= $1,000', '= $5,000', '= $9,999'][i], x, y + 290, 54, C.green, seg(t, t0 + .3, t0 + .6)); });
  });
  kinetic(['NEW', 'CURRENCIES'], W / 2, 200, 150, t, 23.3, { hl: { CURRENCIES: C.gold } });
}

// ---------- S8 24.74–27.74: panik ve kaynak savaşları ----------
function runner(x, y, s, t, ph) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#0a0a0e'; ctx.strokeStyle = '#0a0a0e'; ctx.lineCap = 'round'; const a = Math.sin(t * 12 + ph);
  ctx.beginPath(); ctx.arc(s * .08, -s * .92, s * .1, 0, TAU); ctx.fill(); ctx.lineWidth = s * .12; ctx.beginPath(); ctx.moveTo(s * .04, -s * .8); ctx.lineTo(-s * .04, -s * .45); ctx.stroke();
  ctx.lineWidth = s * .08; ctx.beginPath(); ctx.moveTo(-s * .04, -s * .45); ctx.lineTo(-s * .04 + a * s * .2, -s * .22); ctx.lineTo(a * s * .25, 0); ctx.moveTo(-s * .04, -s * .45); ctx.lineTo(-s * .04 - a * s * .2, -s * .22); ctx.lineTo(-a * s * .25 - s * .1, 0);
  ctx.moveTo(s * .03, -s * .72); ctx.lineTo(s * .03 + a * s * .2, -s * .5); ctx.moveTo(s * .03, -s * .72); ctx.lineTo(s * .03 - a * s * .2, -s * .52); ctx.stroke(); ctx.restore(); }
function s8(t) {
  const al = .5 + .5 * Math.sin(t * 10); const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a0508'); g.addColorStop(.6, '#ff5a2e'); g.addColorStop(1, '#1a0204'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = `rgba(255,0,30,${.15 * al})`; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.05, t, shake: 10 }, () => {
    skyline(1150, t, { seed: 41, tall: 450, col: '#14060a' });
    const gl = ctx.createLinearGradient(0, 1100, 0, 1460); gl.addColorStop(0, 'rgba(255,120,30,0)'); gl.addColorStop(1, 'rgba(255,150,50,.95)'); ctx.fillStyle = gl; ctx.fillRect(-300, 1100, W + 600, 360);
    for (let i = 0; i < 12; i++) { const x = i * 95 + 20, hh = 160 + 90 * Math.sin(t * 8 + i * 1.3); const fg = ctx.createLinearGradient(0, 1150 - hh, 0, 1200); fg.addColorStop(0, 'rgba(255,220,100,0)'); fg.addColorStop(.5, 'rgba(255,120,30,.9)'); fg.addColorStop(1, '#a3121a'); ctx.fillStyle = fg;
      ctx.beginPath(); ctx.moveTo(x - 60, 1200); ctx.quadraticCurveTo(x, 1150 - hh, x + 60, 1200); ctx.fill(); }
    ctx.fillStyle = '#0a0406'; ctx.fillRect(-300, 1455, W + 600, 700);
    for (let i = 0; i < 9; i++) { const x = ((i * 150 + (t - 24.7) * (380 + i * 30)) % 1400) - 150; runner(x, 1460, 200 + (i % 3) * 40, t, i); }
    ctx.fillStyle = '#3da5ff'; ctx.beginPath(); ctx.roundRect(W / 2 - 80, 1280, 160, 180, 20); ctx.fill(); txt('H2O', W / 2, 1370, 48, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  });
  kinetic(['NATIONWIDE'], W / 2, 210, 130, t, 24.9); kinetic(['PANIC'], W / 2, 360, 190, t, 25.55, { hl: { PANIC: C.red } });
  if (t > 26.6) stampText('RESOURCE WARS', W / 2, 700, 110, '#fff', seg(t, 26.6, 26.9));
}

// ---------- S9 27.74–31.5: küllerden adil bir medeniyet ----------
function s9(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0e0c10'); g.addColorStop(1, '#2a1a12'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const R = RN(19); for (let i = 0; i < 120; i++) { const x = R() * W + Math.sin(t + i) * 30, y = (R() * H - t * (40 + R() * 70)) % H; ctx.fillStyle = `rgba(${R() > .7 ? '255,140,60' : '160,150,140'},${.3 + R() * .5})`; ctx.beginPath(); ctx.arc(x, y < 0 ? y + H : y, 2 + R() * 4, 0, TAU); ctx.fill(); }
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    // kül yığını + filiz + yükselen dengeli terazi
    ctx.fillStyle = '#3a3532'; ctx.beginPath(); ctx.ellipse(W / 2, 1320, 520, 140, 0, Math.PI, 0); ctx.fill();
    const gr = eo(seg(t, 28.2, 29.6)); ctx.strokeStyle = '#3ad08a'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(W / 2, 1220); ctx.quadraticCurveTo(W / 2 - 30, 1220 - 300 * gr, W / 2, 1220 - 560 * gr); ctx.stroke();
    if (gr > .3) { ctx.fillStyle = '#5ae0a0'; for (const sx of [-1, 1]) { ctx.save(); ctx.translate(W / 2, 1220 - 380 * gr); ctx.rotate(sx * .9); ctx.beginPath(); ctx.ellipse(sx * 80 * gr, 0, 90 * gr, 36 * gr, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
    const fair = seg(t, 29.06, 29.6); if (fair > 0) { ctx.save(); ctx.translate(W / 2, 660); ctx.scale(eback(fair), eback(fair)); ctx.strokeStyle = C.gold; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-280, 0); ctx.lineTo(280, 0); ctx.stroke();
      for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 280, 0); ctx.lineTo(sx * 220, 140); ctx.moveTo(sx * 280, 0); ctx.lineTo(sx * 340, 140); ctx.stroke(); ctx.beginPath(); ctx.arc(sx * 280, 140, 70, 0, Math.PI); ctx.stroke(); } ctx.restore(); }
  });
  kinetic(['REBUILD?'], W / 2, 220, 170, t, 28.1, { hl: { 'REBUILD?': '#5ae0a0' } });
  // "CAPITALISM" yanıp küle döner
  const burn = seg(t, 31.0, 31.6); if (t > 30.4) { ctx.save(); ctx.globalAlpha = 1 - burn; txt('CAPITALISM', W / 2, 1430, fit('CAPITALISM', 130, 900, 'Anton', 400), burn > 0 ? '#ff8a3a' : '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#ff5a00' }); ctx.restore(); shards(W / 2, 1430, burn, 40, 3, '#8a8580', 10, 300); }
}

// ---------- S10 31.5–35.46: kalıcı kanunsuz kaos ----------
function s10(t) {
  ctx.fillStyle = '#0a0204'; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1 + .25 * seg(t, 31.5, 35.4), rot: (t - 31.5) * .15, t, shake: 6 + 10 * seg(t, 33.6, 34.4) }, () => {
    // aşağı inen sarmal
    for (let i = 0; i < 26; i++) { const r = 900 * Math.pow(.86, i) * (1 + ((t * .8) % 1) * .16), a = t * 1.5 + i * .5; ctx.strokeStyle = i % 2 ? 'rgba(255,59,78,.75)' : 'rgba(40,10,14,.9)'; ctx.lineWidth = 50 * Math.pow(.86, i);
      ctx.beginPath(); ctx.arc(W / 2, 800, r, a, a + 4.5); ctx.stroke(); }
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(W / 2, 800, 40, 0, TAU); ctx.fill();
  });
  kinetic(['DESCEND', 'INTO'], W / 2, 220, 130, t, 32.5);
  if (t > 33.66) stampText('LAWLESS CHAOS', W / 2, 1400, 120, C.red, seg(t, 33.66, 34.0));
}

const THEO = ['Gold would rule again', 'Bitcoin to the rescue', 'Stock up on beans', 'A fairer world', 'Total anarchy', 'Back to the stone age'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const w = [3.56, 6.82, 8.32, 11.68, 15.58, 20.2, 24.74, 27.74, 31.5, 35.46].map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  const S = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, null], B = [0, 3.56, 6.82, 8.32, 11.68, 15.58, 20.2, 24.74, 27.74, 31.5, 35.46, 99];
  for (let i = 0; i < 11; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = (t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < 10 ? w[i].offA : 0));
    cam({ y: off }, () => i < 10 ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 35.46), 35.46, 36.94, 37.52, THEO, { tint: 'rgba(34,224,122,.18)' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 1.66 && t < 1.9 ? 1 : 0) + (t > 33.66 && t < 33.9 ? .8 : 0) + (t > 5.84 && t < 6.0 ? .6 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
