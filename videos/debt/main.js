// "Why Do Wealthy People Use Debt?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 56.5;
const SUBY = 1530, SEA = '#1d6fd1';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function avatar(x, y, s, col = '#8a97b0') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .32, s * .22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, s * .2, s * .38, s * .3, 0, Math.PI, TAU); ctx.fill(); ctx.restore(); }
function mousetrap(x, y, s, snap, bait) {                 // tahta fare kapanı; snap 0 kurulu → 1 kapandı
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#c8955a'; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .08, s, s * .2, 10); ctx.fill(); ctx.fillStyle = '#a8763f'; ctx.fillRect(-s / 2, s * .08, s, s * .04);
  if (bait) card(s * .12, -s * .1, s * .3, -.2); ctx.fillStyle = '#d6dde8'; ctx.fillRect(-s * .05, -s * .1, s * .1, s * .04);
  const a = lerp(-Math.PI * .95, -.06, snap); ctx.save(); ctx.translate(-s * .1, -s * .08); ctx.rotate(a); ctx.strokeStyle = '#d6dde8'; ctx.lineWidth = s * .025; ctx.strokeRect(0, -s * .2, s * .5, s * .4); ctx.restore();
  ctx.strokeStyle = '#9aa7b8'; ctx.lineWidth = s * .02; ctx.beginPath(); ctx.arc(-s * .1, -s * .08, s * .05, 0, TAU); ctx.stroke(); ctx.restore(); }
function board(x, y, s, t) { const c = s / 8; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { ctx.fillStyle = (i + j) % 2 ? '#2a3550' : '#c9d2de'; ctx.fillRect(x + i * c, y + j * c, c, c); } ctx.strokeStyle = C.gold; ctx.lineWidth = 6; ctx.strokeRect(x, y, s, s); }
function knight(x, y, s, col = C.gold) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(-s * .35, s * .5); ctx.lineTo(s * .35, s * .5); ctx.lineTo(s * .25, s * .1); ctx.quadraticCurveTo(s * .35, -s * .25, s * .05, -s * .5); ctx.lineTo(-s * .05, -s * .38); ctx.quadraticCurveTo(-s * .35, -s * .3, -s * .38, -s * .02); ctx.lineTo(-s * .1, -s * .05); ctx.quadraticCurveTo(-s * .3, s * .15, -s * .25, s * .3); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(s * .02, -s * .25, s * .05, 0, TAU); ctx.fill(); ctx.fillRect(-s * .42, s * .45, s * .84, s * .1); ctx.restore(); }
function yacht(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.6) * .03); ctx.fillStyle = '#f4f7fb'; ctx.beginPath(); ctx.moveTo(-s * .55, 0); ctx.lineTo(s * .6, 0); ctx.lineTo(s * .45, s * .16); ctx.lineTo(-s * .45, s * .16); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#1b2235'; ctx.fillRect(-s * .5, s * .04, s * 1.02, s * .03);
  ctx.fillStyle = '#e3e9f1'; ctx.beginPath(); ctx.moveTo(-s * .35, 0); ctx.lineTo(-s * .3, -s * .14); ctx.lineTo(s * .3, -s * .14); ctx.lineTo(s * .42, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .2, -s * .14); ctx.lineTo(-s * .15, -s * .26); ctx.lineTo(s * .15, -s * .26); ctx.lineTo(s * .24, -s * .14); ctx.fill();
  ctx.fillStyle = '#2a3d5e'; for (let i = 0; i < 6; i++) ctx.fillRect(-s * .26 + i * s * .09, -s * .11, s * .06, s * .05); for (let i = 0; i < 3; i++) ctx.fillRect(-s * .1 + i * s * .09, -s * .23, s * .06, s * .05); ctx.restore(); }
function waves(y, t, col = SEA) { const g = ctx.createLinearGradient(0, y, 0, H); g.addColorStop(0, col); g.addColorStop(1, '#06162e'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * .02 + t * 2) * 14 + Math.sin(x * .05 - t * 3) * 6); ctx.lineTo(W, H); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 4; ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * .02 + t * 2) * 14 + Math.sin(x * .05 - t * 3) * 6); ctx.stroke(); }
function pacPie(x, y, r, bite, label) { ctx.save(); ctx.translate(x, y); const a = bite * TAU; ctx.fillStyle = C.green; ctx.shadowColor = C.green; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, -Math.PI / 2 + a, -Math.PI / 2 + TAU); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; txt(label, -r * .12, r * .1, r * .26, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function govBite(x, y, r, open, t) { ctx.save(); ctx.translate(x, y); const m = .1 + .5 * open; ctx.fillStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, Math.PI + m, Math.PI - m + TAU); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(-r * .05, -r * .5, r * .1, 0, TAU); ctx.fill(); txt('TAX', r * .25, r * .25, r * .32, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function machine(x, y, w, h, t, run) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#2b3550'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 30); ctx.fill(); ctx.strokeStyle = C.gold; ctx.lineWidth = 6; ctx.stroke(); txt('BANK', 0, -h * .3, w * .16, C.gold, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(-w * .25 + i * w * .25, h * .05); ctx.rotate(t * 5 * run * (i % 2 ? -1 : 1)); ctx.fillStyle = '#8a97b0'; ctx.beginPath(); for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, rr = w * (k % 2 ? .07 : .09); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.fill(); ctx.fillStyle = '#2b3550'; ctx.beginPath(); ctx.arc(0, 0, w * .03, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#10141f'; ctx.fillRect(-w / 2 - 10, -h * .05, 20, h * .25); ctx.fillRect(w / 2 - 10, -h * .05, 20, h * .25); ctx.fillStyle = run ? C.green : '#555'; ctx.beginPath(); ctx.arc(w * .38, -h * .32, 14, 0, TAU); ctx.fill(); ctx.restore(); }
function cert(x, y, w, rot) { const h = w * .62; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#f5ecd2'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 8); ctx.fill(); ctx.strokeStyle = '#b58b3c'; ctx.lineWidth = w * .02; ctx.strokeRect(-w * .44, -h * .4, w * .88, h * .8); txt('STOCK', 0, -h * .05, w * .16, '#6b4f1d', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(w * .3, h * .22, w * .05, 0, TAU); ctx.fill(); ctx.restore(); }
function envelope(x, y, w, open) { const h = w * .65; ctx.save(); ctx.translate(x, y); if (open > .3) { ctx.save(); ctx.translate(0, -h * 1.0 * eo(clamp((open - .3) / .7))); ctx.fillStyle = '#fff'; ctx.fillRect(-w * .42, -h * .4, w * .84, h * .75); txt('LOAN ≠ INCOME', 0, -h * .12, w * .075, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
  ctx.fillStyle = '#e8d6b0'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = '#d9c296'; ctx.beginPath(); ctx.moveTo(-w / 2, h / 2); ctx.lineTo(0, 0); ctx.lineTo(w / 2, h / 2); ctx.fill();
  ctx.save(); ctx.translate(0, -h / 2); ctx.scale(1, 1 - 2 * clamp(open / .3)); ctx.fillStyle = '#cdb383'; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(0, h * .55); ctx.lineTo(w / 2, 0); ctx.fill(); ctx.restore();
  if (open < .3) { ctx.fillStyle = '#b3122a'; ctx.beginPath(); ctx.arc(0, h * .05, w * .07, 0, TAU); ctx.fill(); txt('SECRET', 0, h * .3, w * .08, '#6b4f1d', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); } ctx.restore(); }
function calculator(x, y, s, disp) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#1b2235'; ctx.beginPath(); ctx.roundRect(-s * .35, -s * .5, s * .7, s, 30); ctx.fill(); ctx.strokeStyle = '#3a4a6a'; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = '#b8f5c8'; ctx.fillRect(-s * .28, -s * .42, s * .56, s * .2); txt(disp, s * .24, -s * .32, s * .1, '#123', { align: 'right', font: 'Anton', weight: 400, stroke: 0 });
  for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 4 === 3 ? '#ff8a3d' : '#2c3654'; ctx.beginPath(); ctx.roundRect(-s * .27 + (i % 4) * s * .14, -s * .15 + Math.floor(i / 4) * s * .19, s * .11, s * .15, 10); ctx.fill(); } ctx.restore(); }
function anvil(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#4b5566'; ctx.beginPath(); ctx.moveTo(-s * .5, -s * .3); ctx.lineTo(s * .35, -s * .3); ctx.quadraticCurveTo(s * .6, -s * .3, s * .65, -s * .15); ctx.lineTo(s * .3, -s * .1); ctx.lineTo(s * .2, s * .1); ctx.lineTo(s * .35, s * .25); ctx.lineTo(-s * .35, s * .25); ctx.lineTo(-s * .2, s * .1); ctx.lineTo(-s * .3, -s * .1); ctx.closePath(); ctx.fill(); txt('DEBT', 0, -s * .14, s * .18, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function hammer(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#8a5a2b'; ctx.fillRect(-s * .05, -s * .1, s * .1, s * .7); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-s * .32, -s * .3, s * .64, s * .22, 10); ctx.fill(); ctx.shadowBlur = 0; txt('DEBT', 0, -s * .19, s * .13, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function chip(x, y, r, col, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(1, .45); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = r * .14; ctx.setLineDash([r * .3, r * .3]); ctx.lineDashOffset = rot * r; ctx.beginPath(); ctx.arc(0, 0, r * .86, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
function die(x, y, s, rot, n) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * .18); ctx.fill(); ctx.fillStyle = C.red; const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[n];
  P.forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a * s * .26, b * s * .26, s * .09, 0, TAU); ctx.fill(); }); ctx.restore(); }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–3.5 HOOK: kredi kartı yemli fare kapanı — ŞAK!
scene(0, 3.5, 'push', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.18)', seed: 1, dot: '255,140,150' });
  const snap = eio(seg(t, 2.4, 2.55));
  cam({ t, zoom: lerp(1.35, 1, eo(seg(t, 0, 1.2))) * punch(t, 2.5, .1), shake: t > 2.45 && t < 2.9 ? 16 : 0 }, () => mousetrap(W / 2, 1050, 820, snap, true));
  kinetic(['DEBT', 'IS', 'A', 'TRAP'], W / 2, 280, 170, t, .05, { hl: { 'TRAP': C.red } });
  if (t > 2.5) stampText('SNAP!', W / 2, 700, 130, C.red, seg(t, 2.5, 2.7), -.1);
  flash(t, 0, .2, '255,59,78'); flash(t, 2.5, .15);
});

// 2) 3.5–8.0: ultra zenginler bilerek kullanır — satranç atı (DEBT) hamle yapar
scene(3.5, 8.0, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.16)', seed: 2, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, rot: d.rot, t, zoom: 1.02 }, () => {
    ctx.save(); ctx.translate(W / 2, 1000); ctx.transform(1, 0, -.25, .6, 0, 0); board(-420, -420, 840, t); ctx.restore();
    const j = eio(seg(t, 5.3, 6.0)), kx = lerp(W / 2 - 150, W / 2 + 120, j), ky = lerp(1080, 850, j) - Math.sin(j * Math.PI) * 260; knight(kx, ky - 120, 260); txt('DEBT', kx, ky + 60, 48, C.gold, { align: 'center', font: 'Anton', weight: 400 });
    if (t > 6.6) { for (let i = 0; i < 8; i++) { const k = (t * 1.2 + i / 8) % 1; coin(kx + Math.cos(i) * 200 * k, ky - 120 - 260 * k, 24, t * 7 + i); } }
  });
  kinetic(['ON', 'PURPOSE'], W / 2, 280, 180, t, 5.4, { hl: { 'PURPOSE': C.gold } });
  if (t < 5.4) kinetic(['ULTRA', 'RICH'], W / 2, 280, 180, t, 3.8, { hl: { 'RICH': C.gold } });
});

// 3) 8.0–13.8: neden borç? — vergiden kaçınmak: TAX füzesinden altın yığını yana kayar
scene(8.0, 13.8, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.15)', seed: 3, dot: '190,160,255' });
  const mp = seg(t, 11.0, 12.6), dodge = Math.sin(clamp((t - 11.6) / 1.0) * Math.PI);
  cam({ x: d.x, y: d.y, t }, () => {
    const sx = W / 2 + dodge * 260; for (let r = 0; r < 4; r++) for (let i = 0; i < 4 - r; i++) { ctx.save(); ctx.translate(sx + (i - (3 - r) / 2) * 150, 1260 - r * 70); goldBarS(0, 0, 140); ctx.restore(); }
    if (mp > 0 && mp < 1) { const mx = lerp(-200, W + 300, mp), my = 1150; ctx.save(); ctx.translate(mx, my); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(140, 0); ctx.lineTo(60, -50); ctx.lineTo(-120, -50); ctx.lineTo(-120, 50); ctx.lineTo(60, 50); ctx.closePath(); ctx.fill(); txt('TAX', 0, 2, 64, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      for (let i = 0; i < 3; i++) { ctx.fillStyle = ['#ff9d1f', '#ffd36b', '#fff'][i]; ctx.beginPath(); ctx.moveTo(-120, -30 + i * 10); ctx.lineTo(-120 - 120 * (1 - i * .3) * (1 + .2 * Math.sin(t * 40)), 0); ctx.lineTo(-120, 30 - i * 10); ctx.fill(); } ctx.restore(); motionStreak(.5); }
    if (t > 12.4) pill('DODGED', W / 2, 950, 60, C.green, seg(t, 12.4, 12.8));
  });
  if (t < 10.7) kinetic(['WHY', 'USE', 'DEBT?'], W / 2, 280, 180, t, 8.2, { hl: { 'DEBT?': C.violet } });
  else kinetic(['AVOID', 'TAXES'], W / 2, 280, 180, t, 11.0, { hl: { 'TAXES': C.red } });
});
function goldBarS(x, y, w) { const h = w * .28; ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w * .4, y - h); ctx.lineTo(x - w * .4, y - h); ctx.fill(); const g = ctx.createLinearGradient(x - w / 2, y - h * 1.6, x + w / 2, y - h); g.addColorStop(0, '#fff1a8'); g.addColorStop(1, C.gold); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w * .4, y - h); ctx.lineTo(x + w * .4, y - h); ctx.lineTo(x + w * .3, y - h * 1.6); ctx.lineTo(x - w * .3, y - h * 1.6); ctx.fill(); }

// 4) 13.8–18.45: milyarder dev bir yat ister — ama hissesini SATMAZ
scene(13.8, 18.45, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.2)', seed: 4, dot: '150,200,255', top: '#0b1a33', bot: '#03070f' });
  cam({ t, x: lerp(120, -60, seg(t, 13.8, 18.4)) }, () => { waves(1180, t); yacht(W / 2, 1150, 820, t); priceTag2(W / 2 + 230, 760, '$50M', seg(t, 15.4, 15.9)); });
  if (t > 16.4) { ctx.fillStyle = 'rgba(6,9,15,.88)'; ctx.beginPath(); ctx.roundRect(140, 420, 800, 260, 36); ctx.fill(); cert(330, 550, 260, -.08); ctx.fillStyle = '#3a3f4b'; ctx.beginPath(); ctx.roundRect(560, 500, 300, 100, 50); ctx.fill(); txt('SELL', 710, 552, 64, '#8a97b0', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); stampX(710, 552, 140, seg(t, 16.86, 17.2)); }
  kinetic(['MASSIVE', 'YACHT'], W / 2, 280, 180, t, 14.3, { hl: { 'YACHT': '#9fd3ff' } });
});
function priceTag2(x, y, label, p) { if (p <= 0) return; ctx.save(); ctx.translate(x, y); const e = eback(p); ctx.scale(e, e); ctx.rotate(-.12); ctx.font = '400 80px Anton'; const w = ctx.measureText(label).width + 110, h = 110; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - 40, -h / 2); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 - 40, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill(); txt(label, -14, 4, 80, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }

// 5) 18.45–23.35: satsaydı devlet sermaye kazancı vergisiyle büyük bir ısırık alırdı
scene(18.45, 23.35, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,59,78,.16)', seed: 5, dot: '255,140,150' });
  const b = eo(seg(t, 21.3, 21.9)), gx = lerp(W + 400, W / 2 + 330, eo(seg(t, 20.0, 21.2)));
  cam({ x: d.x, y: d.y, t, shake: t > 21.3 && t < 21.9 ? 8 : 0 }, () => {
    pacPie(W / 2 - 60, 880, 310, .2 * b, 'SALE $50M'); govBite(gx, 880, 180, .5 + .5 * Math.sin(t * 12), t);
    if (t > 21.8) { txt('CAPITAL GAINS TAX', W / 2, 1265, 56, C.red, { align: 'center', font: 'Anton', weight: 400 }); counter(0, -10e6, W / 2, 1375, 110, seg(t, 21.8, 22.6), { col: C.red, fmt: v => '-$' + Math.abs(Math.round(v)).toLocaleString('en-US') }); }
  });
  kinetic(['IF', 'THEY', 'SOLD...'], W / 2, 280, 180, t, 18.6, { hl: { 'SOLD...': C.red } });
});

// 6) 23.35–28.1: hisseyi teminat göster → bankadan dev kredi (makine)
scene(23.35, 28.1, 'iris', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 6, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, t }, () => {
    machine(W / 2, 980, 440, 380, t, t > 25.4 ? 1 : 0);
    for (let i = 0; i < 4; i++) { const k = seg(t, 24.6 + i * .25, 25.4 + i * .25); if (k > 0 && k < 1) cert(lerp(-150, W / 2 - 230, eio(k)), 1000 - i * 6, 200, (1 - k) * .5); }
    if (t > 25.4) { ctx.save(); ctx.globalAlpha = seg(t, 25.4, 25.7); txt('COLLATERAL', 200, 760, 44, C.gold, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
    const out = seg(t, 26.1, 27.6); if (out > 0) { const n = Math.floor(18 * out); for (let i = 0; i < n; i++) cashStackOne(W / 2 + 360 + (i % 3) * 0, 1260 - Math.floor(i / 3) * 34 - (i % 3) * 12 + (i % 3) * 12, i); bill(lerp(W / 2 + 230, W / 2 + 360, (t * 2) % 1), 1000, 160, 0); }
    if (t > 26.7) pill('MASSIVE LOAN', W / 2 + 230, 700, 52, C.green, seg(t, 26.7, 27.1));
  });
  kinetic(['STOCK', '→', 'LOAN'], W / 2, 280, 180, t, 23.6, { hl: { 'LOAN': C.green } });
});
function cashStackOne(x, y, i) { ctx.fillStyle = i % 2 ? '#5fae6b' : '#6fbd7a'; ctx.beginPath(); ctx.roundRect(x - 110, y - 30, 220, 30, 6); ctx.fill(); ctx.fillStyle = '#e8d9a8'; ctx.fillRect(x - 18, y - 30, 36, 30); }

// 7) 28.1–33.35: sır — borç alınan para vergisiz (zarf + hesap makinesi)
scene(28.1, 33.35, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.16)', seed: 7 });
  cam({ x: d.x, y: d.y, rot: d.rot, t, zoom: punch(t, 31.84, .08) }, () => {
    envelope(W / 2, 900, 700, eio(seg(t, 29.2, 30.4)));
    if (t > 31.0) calculator(W / 2 + 280, 1270, 300 * eback(seg(t, 31.0, 31.4)), 'TAX: 0.00');
  });
  if (t < 30.2) kinetic(['THE', 'SECRET'], W / 2, 280, 180, t, 28.4, { hl: { 'SECRET': C.gold } });
  else kinetic(['TAX-FREE'], W / 2, 280, 200, t, 31.0, { hl: { 'TAX-FREE': C.green } });
});

// 8) 33.35–40.65: küçük faiz öderken yatırımları daha hızlı büyür (yarışan çubuklar + fark)
scene(33.35, 40.65, 'push', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.14)', seed: 8 });
  cam({ x: d.x, y: d.y, t }, () => {
    hbars(120, 600, 840, 300, [{ label: 'LOAN INTEREST', value: 3, col: C.red }, { label: 'INVESTMENT GROWTH', value: 10, col: C.green }], seg(t, 33.9, 37.6), { max: 10, fmt: v => v.toFixed(1) + '%/yr' });
    const gp = seg(t, 38.2, 39.0); if (gp > 0) { ctx.strokeStyle = C.gold; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(120 + 840 * .3, 760); ctx.lineTo(120 + 840 * .3, 1140); ctx.moveTo(960, 1060); ctx.lineTo(960, 1140); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,200,61,.25)'; ctx.fillRect(120 + 840 * .3, 1110, 840 * .7 * eo(gp), 40); txt('THEY KEEP THE DIFFERENCE', W / 2, 1240, 50, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); }
    txt('EXAMPLE RATES', W / 2, 1340, 34, C.mute, { align: 'center', weight: 900 });
  });
  if (t < 35.8) kinetic(['TINY', 'INTEREST'], W / 2, 280, 180, t, 33.6, { hl: { 'TINY': C.red } });
  else kinetic(['FAR', 'MORE', 'MONEY'], W / 2, 280, 170, t, 37.9, { hl: { 'MONEY': C.green } });
});

// 9) 40.65–45.75: ortalama insan için yük, zengin için alet (üst/alt bölünmüş)
scene(40.65, 45.75, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.1)', seed: 9, dot: '255,210,120' });
  const sp = eio(seg(t, 43.2, 43.8)), mid = lerp(H, 980, sp);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, mid); ctx.clip(); ctx.fillStyle = 'rgba(60,60,70,.35)'; ctx.fillRect(0, 0, W, H);
  const bob = Math.sin(t * 3) * 10; avatar(W / 2, 760 + bob * .5, 200, '#7a8597'); anvil(W / 2, 560 + bob, 360); txt('BURDEN', W / 2 + 330, 760, 70, '#bbb', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore();
  if (sp > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, mid, W, H - mid); ctx.clip(); const g = ctx.createLinearGradient(0, mid, 0, H); g.addColorStop(0, 'rgba(255,200,61,.25)'); g.addColorStop(1, 'rgba(255,200,61,0)'); ctx.fillStyle = g; ctx.fillRect(0, mid, W, H);
    const sw = Math.sin(t * 7); hammer(W / 2 - 200, 1180 + sw * 20, 280, -.6 + sw * .4); for (let i = 0; i < 4; i++) { const k = eback(seg(t, 44.0 + i * .2, 44.4 + i * .2)); if (k > 0) cashStackOne(W / 2 + 160, 1400 - i * 34 * k, i); } txt('TOOL', W / 2 + 330, 1240, 80, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.fillRect(0, mid - 3, W, 6); }
  txt('AVERAGE PEOPLE', W / 2, 270, 90, '#fff', { align: 'center', font: 'Anton', weight: 400 }); if (sp > 0) { ctx.save(); ctx.globalAlpha = sp; txt('THE RICH', W / 2, 1030, 70, C.gold, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
});

// 10) 45.75–49.45: yüksek riskli oyun — fişler ve zarlar
scene(45.75, 49.45, 'zoom', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.18)', seed: 10, top: '#06200f', bot: '#010603' });
  cam({ x: d.x, y: d.y, t }, () => {
    const cols = [C.red, '#1b2235', C.blue, C.gold]; for (let s = 0; s < 4; s++) { const n = Math.floor(12 * eo(seg(t, 46.0 + s * .15, 46.8 + s * .15))); for (let i = 0; i < n; i++) chip(260 + s * 190, 1300 - i * 22, 80, cols[s], t + i); }
    const rp = seg(t, 46.6, 48.0); for (let k = 0; k < 2; k++) { const e = eo(rp); die(lerp(-100, 400 + k * 280, e), 760 + Math.abs(Math.sin(e * 9)) * -120 * (1 - e), 160, (1 - e) * 12 + k, rp < 1 ? 1 + (Math.floor(t * 15) + k) % 6 : [6, 1][k]); }
    if (t > 48.4) qmark(W - 160, 620, 220 * eback(seg(t, 48.4, 48.9)), t, C.gold);
  });
  kinetic(['HIGH', 'STAKES', 'GAME'], W / 2, 280, 170, t, 46.0, { hl: { 'STAKES': C.red } });
});

// 11) 49.45–52.45: milyarder parasını kaybederse ne olur? — serbest düşüş
scene(49.45, 52.45, 'whipU', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.22)', seed: 11, dot: '255,140,150', top: '#1c0609', bot: '#050102' });
  const f = eio(seg(t, 50.3, 52.3));
  cam({ t, shake: 6 * f }, () => { const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; if (u > f) break; pts.push([100 + u * 880, 560 + Math.pow(u, 1.8) * 760 + Math.sin(i * 1.7) * 30 * u]); } ctx.save(); ctx.strokeStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 30; ctx.lineWidth = 14; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
    ctx.fillStyle = 'rgba(6,9,15,.85)'; ctx.fillRect(160, 1180, 760, 200); txt('NET WORTH', W / 2, 1225, 44, C.mute, { align: 'center', weight: 900, stroke: 0 }); counter(30e9, 0, W / 2, 1320, 120, f, { col: C.red, ease: x => x }); });
  kinetic(['LOSES', 'IT', 'ALL?'], W / 2, 280, 180, t, 50.8, { hl: { 'ALL?': C.red } });
});

// 12) 52.45–56.5: CTA
scene(52.45, 56.5, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 12, dot: '255,140,150' });
  ctx.save(); ctx.translate(W / 2, 760); ctx.rotate(Math.sin(t * 2) * .1); die(0, 0, 220, 0, 6); ctx.restore(); pill('NEXT: WHEN BILLIONAIRES LOSE IT ALL', W / 2, 1010, 40, C.gold, seg(t, 52.7, 53.1));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 52.6, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 54.0, 54.4), press = seg(t, 54.7, 54.85) - seg(t, 54.85, 55.0), done = t > 54.85;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 54.1, 54.7))), lerp(1480, 1260, eo(seg(t, 54.1, 54.7))), 1, press);
    if (done) { const k = seg(t, 54.85, 55.9); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 54.85, .15);
});

// ---------------- birleştirici ----------------
const TD = .36;
function drawScene(i, t) { ctx.save(); S[i].fn(t); ctx.restore(); }
function transition(i, t) {
  const b = S[i].s, k = eio(seg(t, b - TD / 2, b + TD / 2)), type = S[i].tr;
  if (type === 'whipL' || type === 'whipU') { const up = type === 'whipU', dist = up ? H : W, dx = up ? 0 : 1, dy = up ? 1 : 0;
    if (k < 1) cam({ x: -dx * dist * k, y: -dy * dist * k }, () => drawScene(i - 1, t)); if (k > 0) cam({ x: dx * dist * (1 - k), y: dy * dist * (1 - k) }, () => drawScene(i, t)); motionStreak(Math.sin(k * Math.PI)); return; }
  if (type === 'push') { if (k < 1) cam({ zoom: 1 + 3 * k * k }, () => drawScene(i - 1, t)); if (k > 0) { ctx.save(); ctx.globalAlpha = k; cam({ zoom: .5 + .5 * k }, () => drawScene(i, t)); ctx.restore(); } return; }
  if (type === 'zoom') { if (k < 1) cam({ zoom: 1 + k * 2.5 }, () => drawScene(i - 1, t)); if (k > 0) { ctx.save(); ctx.globalAlpha = k; cam({ zoom: .6 + .4 * k }, () => drawScene(i, t)); ctx.restore(); } ctx.fillStyle = `rgba(255,255,255,${.2 * Math.sin(k * Math.PI)})`; ctx.fillRect(0, 0, W, H); return; }
  if (type === 'glitch') { drawScene(k < .5 ? i - 1 : i, t); const a = Math.sin(k * Math.PI), R = RN(Math.floor(t * 30)); for (let j = 0; j < 9; j++) { const y = R() * H, h = 30 + R() * 140, dx = (R() - .5) * 260 * a; ctx.drawImage(cv, 0, y, W, h, dx, y, W, h); }
    ctx.fillStyle = `rgba(255,200,61,${.12 * a})`; ctx.fillRect(0, 0, W, H); return; }
  iris(t, b - TD / 2, TD, () => drawScene(i - 1, t), () => drawScene(i, t));
}
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  let i = S.findIndex(s => t < s.e); if (i < 0) i = S.length - 1;
  if (i > 0 && t < S[i].s + TD / 2) transition(i, t);
  else if (i < S.length - 1 && t > S[i].e - TD / 2) transition(i + 1, t);
  else drawScene(i, t);
  subs(t, SUBY);
};
