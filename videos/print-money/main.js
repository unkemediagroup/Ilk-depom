// "Why Does Printing Money Not Make a Country Rich?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 60.3;
const SUBY = 1530, CYAN = '#2ee6ff', PIX = '#39ff88';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function pizzaBase(r, seed = 1) {                          // merkez (0,0)
  const g = ctx.createRadialGradient(0, 0, r * .2, 0, 0, r); g.addColorStop(0, '#ffd56b'); g.addColorStop(.82, '#f4b23c'); g.addColorStop(.86, '#c9772a'); g.addColorStop(1, '#8f4e17');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  const R = RN(seed); for (let i = 0; i < 14; i++) { const a = R() * TAU, d = Math.sqrt(R()) * r * .7, x = Math.cos(a) * d, y = Math.sin(a) * d; ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(x, y, r * .09, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(120,20,15,.5)'; ctx.beginPath(); ctx.arc(x + r * .02, y + r * .02, r * .03, 0, TAU); ctx.fill(); }
  for (let i = 0; i < 18; i++) { const a = R() * TAU, d = Math.sqrt(R()) * r * .75; ctx.fillStyle = '#3f8a2f'; ctx.beginPath(); ctx.ellipse(Math.cos(a) * d, Math.sin(a) * d, r * .03, r * .015, R() * 3, 0, TAU); ctx.fill(); }
}
function pizza(x, y, r, n, gap, cutP = 1, rot = 0, hl = -1, hlOut = 0) {     // n dilim; gap: dilimlerin ayrılması (px)
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (n <= 1) { pizzaBase(r); ctx.restore(); return; }
  for (let i = 0; i < n; i++) { const a0 = i / n * TAU, a1 = (i + 1) / n * TAU, m = (a0 + a1) / 2, off = gap + (i === hl ? hlOut : 0);
    ctx.save(); ctx.translate(Math.cos(m) * off, Math.sin(m) * off); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r + 2, a0, a1); ctx.closePath(); ctx.save(); ctx.clip(); pizzaBase(r); ctx.restore(); if (i === hl && hlOut > 1) { ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.shadowColor = C.red; ctx.shadowBlur = 20; ctx.stroke(); } ctx.restore(); }
  if (gap < 2) { ctx.strokeStyle = 'rgba(90,40,10,.75)'; ctx.lineWidth = n > 20 ? 2 : 6; for (let i = 0; i < n; i++) { const a = i / n * TAU, l = r * clamp(cutP * 1.4 - (i / n) * .4); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * l, Math.sin(a) * l); ctx.stroke(); } }
  ctx.restore();
}
function trap(x, y, s, close) {                          // ölümcül çene: üst ve alt dişli çene ortada kapanır
  ctx.save(); ctx.translate(x, y); const gap = lerp(s * .42, 0, close);
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(0, sd * gap); const g = ctx.createLinearGradient(0, 0, 0, sd * s * .3); g.addColorStop(0, '#c9d2de'); g.addColorStop(1, '#4b5566');
    ctx.fillStyle = g; ctx.fillRect(-s / 2, sd > 0 ? 0 : -s * .3, s, s * .3); ctx.fillStyle = '#eef3f9'; const n = 9, tw = s / n;
    for (let i = 0; i < n; i++) { const x0 = -s / 2 + i * tw + (sd > 0 ? tw / 2 : 0); ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + tw / 2, -sd * s * .13); ctx.lineTo(x0 + tw, 0); ctx.fill(); }
    ctx.strokeStyle = '#2d3440'; ctx.lineWidth = 6; ctx.strokeRect(-s / 2, sd > 0 ? 0 : -s * .3, s, s * .3); ctx.restore(); }
  ctx.restore();
}
function bread(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#d98b3a'; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .1, s, s * .45, s * .1); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -s * .1, s * .5, s * .3, 0, Math.PI, TAU); ctx.fill(); ctx.strokeStyle = '#f5c27a'; ctx.lineWidth = s * .05; ctx.lineCap = 'round'; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * s * .22 - s * .07, -s * .28); ctx.lineTo(i * s * .22 + s * .07, -s * .12); ctx.stroke(); } ctx.restore(); }
function car(x, y, s, col = C.blue) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .1, s, s * .28, s * .08); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .3, -s * .1); ctx.lineTo(-s * .18, -s * .32); ctx.lineTo(s * .2, -s * .32); ctx.lineTo(s * .32, -s * .1); ctx.fill(); ctx.fillStyle = '#bfe6ff'; ctx.fillRect(-s * .15, -s * .28, s * .14, s * .15); ctx.fillRect(s * .03, -s * .28, s * .14, s * .15); ctx.fillStyle = '#111'; for (const w of [-.3, .3]) { ctx.beginPath(); ctx.arc(w * s, s * .18, s * .11, 0, TAU); ctx.fill(); } ctx.restore(); }
function wrench(x, y, s, col = C.violet) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.7); ctx.fillStyle = col; ctx.fillRect(-s * .07, -s * .1, s * .14, s * .55); ctx.beginPath(); ctx.arc(0, -s * .22, s * .18, 0, TAU); ctx.fill(); ctx.fillStyle = C.bg0; ctx.fillRect(-s * .07, -s * .45, s * .14, s * .2); ctx.restore(); }
function scaleBal(x, y, s, tilt, left, right) {          // terazi: tilt>0 → sağ kefe aşağı
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#8a97b0'; ctx.fillRect(-s * .03, 0, s * .06, s * .75); ctx.fillRect(-s * .25, s * .72, s * .5, s * .06);
  ctx.beginPath(); ctx.arc(0, 0, s * .05, 0, TAU); ctx.fill(); const a = tilt * .32; ctx.save(); ctx.rotate(a); ctx.fillRect(-s * .7, -s * .025, s * 1.4, s * .05); ctx.restore();
  for (const sd of [-1, 1]) { const px = Math.cos(a) * s * .68 * sd, py = Math.sin(a) * s * .68 * sd; ctx.strokeStyle = '#8a97b0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - s * .22, py + s * .35); ctx.moveTo(px, py); ctx.lineTo(px + s * .22, py + s * .35); ctx.stroke();
    ctx.fillStyle = '#5c6779'; ctx.beginPath(); ctx.ellipse(px, py + s * .36, s * .27, s * .05, 0, 0, TAU); ctx.fill(); ctx.save(); ctx.translate(px, py + s * .33); (sd < 0 ? left : right)(); ctx.restore(); }
  ctx.restore();
}
function wheelbarrow(x, y, s, n) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = s * .04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(s * .3, 0); ctx.lineTo(s * .75, -s * .05); ctx.moveTo(-s * .2, s * .1); ctx.lineTo(-s * .25, s * .3); ctx.stroke();
  for (let i = 0; i < n; i++) { const r = Math.floor(i / 4), c = i % 4; ctx.save(); ctx.translate(-s * .28 + c * s * .17 + (r % 2) * s * .06, -s * .12 - r * s * .07); ctx.rotate((c - 1.5) * .05); ctx.fillStyle = r % 2 ? '#5fae6b' : '#6fbd7a'; ctx.fillRect(-s * .09, -s * .035, s * .18, s * .07); ctx.fillStyle = '#e8d9a8'; ctx.fillRect(-s * .02, -s * .035, s * .04, s * .07); ctx.restore(); }
  ctx.fillStyle = '#7a8597'; ctx.beginPath(); ctx.moveTo(-s * .45, -s * .12); ctx.lineTo(s * .38, -s * .12); ctx.lineTo(s * .25, s * .15); ctx.lineTo(-s * .3, s * .15); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(-s * .42, s * .22, s * .12, 0, TAU); ctx.fill(); ctx.fillStyle = '#888'; ctx.beginPath(); ctx.arc(-s * .42, s * .22, s * .04, 0, TAU); ctx.fill(); ctx.restore(); }
function priceTag(x, y, s, label, col, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `400 ${s * .4}px Anton`; const w = Math.max(s * 1.1, ctx.measureText(label).width + s * .6), h = s * .62;
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - h * .4, -h / 2); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 - h * .4, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.bg0; ctx.beginPath(); ctx.arc(w / 2 - h * .45, 0, h * .1, 0, TAU); ctx.fill(); txt(label, -h * .2, 2, s * .4, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function flame(x, y, s, t) { for (let i = 0; i < 3; i++) { const k = 1 - i * .3, f = 1 + .25 * Math.sin(t * 40 + i); ctx.fillStyle = ['#ff3b1f', '#ff9d1f', '#fff3a8'][i]; ctx.beginPath(); ctx.moveTo(x - s * .25 * k, y); ctx.quadraticCurveTo(x, y + s * 1.2 * k * f, x + s * .25 * k, y); ctx.fill(); } }
function grayBill(x, y, w, rot, gray, val) { ctx.save(); ctx.filter = `grayscale(${gray}) brightness(${1 - .4 * gray})`; bill(x, y, w, rot, { val }); ctx.restore(); }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–3.65 HOOK: kırmızı alarm, borç saati çıldırmış gibi döner → dev PRINT düğmesine basılır
scene(0, 3.65, 'push', t => {
  const al = .5 + .5 * Math.sin(t * 14); bgFinance(t, { tint: `rgba(255,59,78,${.15 + .2 * al})`, seed: 1, dot: '255,140,150', top: '#1c0609', bot: '#050102' });
  cam({ t, shake: t < 1.6 ? 9 : 3, zoom: 1 + .06 * seg(t, 0, 3.6) }, () => {
    txt('NATIONAL DEBT', W / 2, 520, 70, C.red, { align: 'center', font: 'Anton', weight: 400 });
    const v = 31e12 + t * 7.3e11 + Math.sin(t * 50) * 1e9; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.roundRect(70, 590, 940, 200, 26); ctx.fill(); ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.stroke();
    txt('-$' + Math.floor(v).toLocaleString('en-US'), W / 2, 692, fit('-$' + Math.floor(v).toLocaleString('en-US'), 100, 880, 'Anton', 400), '#ff6b7a', { align: 'center', font: 'Anton', weight: 400, glow: C.red });
    for (let i = 0; i < 2; i++) { ctx.save(); ctx.globalAlpha = al * .8; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(150 + i * 780, 470, 34, 0, TAU); ctx.fill(); ctx.restore(); }
    const bp = seg(t, 1.9, 2.3), press = seg(t, 2.55, 2.7) - seg(t, 2.7, 2.9);
    if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1110); const s = eback(bp); ctx.scale(s, s); ctx.fillStyle = '#0a5a2e'; ctx.beginPath(); ctx.ellipse(0, 40, 300, 90, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = C.green; ctx.shadowColor = C.green; ctx.shadowBlur = 60; ctx.beginPath(); ctx.ellipse(0, 10 + press * 26, 280, 80, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; txt('PRINT $', 0, 6 + press * 26, 96, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); cursor(lerp(W / 2 + 380, W / 2 + 60, eo(seg(t, 2.0, 2.55))), lerp(1400, 1120, eo(seg(t, 2.0, 2.55))), 1, press); }
    if (t > 2.7) moneyRain(t - 2.7, 26, 8);
  });
  kinetic(['JUST', 'PRINT', 'MORE?'], W / 2, 280, 160, t, 1.7, { hl: { 'PRINT': C.green } });
  if (t < 1.7) kinetic(['IN', 'DEBT'], W / 2, 280, 170, t, .05, { hl: { 'DEBT': C.red } });
  flash(t, 0, .25, '255,59,78'); flash(t, 2.7, .15, '57,255,136');
});

// 2) 3.65–8.75: retro oyun ekranı: CHEAT CODE yazılır → ölümcül tuzak kapanır
scene(3.65, 8.75, 'glitch', t => {
  ctx.fillStyle = '#020a05'; ctx.fillRect(0, 0, W, H);
  const red = t > 7.3, d = drift(t);
  cam({ x: d.x, y: d.y, t, shake: t > 7.3 && t < 7.8 ? 14 : 0, zoom: 1 + .05 * seg(t, 3.65, 8.75) }, () => {
    ctx.fillStyle = red ? '#1a0205' : '#03140a'; ctx.strokeStyle = red ? C.red : PIX; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(70, 420, 940, 1000, 40); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.roundRect(70, 420, 940, 1000, 40); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.035)'; for (let y = 420; y < 1420; y += 8) ctx.fillRect(70, y, 940, 3);     // tarama çizgileri
    const col = red ? '#ff5468' : PIX, code = '> MONEY = MONEY x 1000', n = Math.floor(code.length * seg(t, 4.0, 5.2));
    txt('ECONOMY.EXE', 120, 500, 44, col, { weight: 900, stroke: 0 });
    txt(code.slice(0, n) + (Math.floor(t * 4) % 2 ? '█' : ''), 120, 600, 50, col, { weight: 900, stroke: 0 });
    if (t > 5.3) { txt('CHEAT ACTIVATED ✓', 120, 690, 50, col, { weight: 900, stroke: 0 }); txt('WEALTH: ' + (t < 6 ? '+999999' : 'ERROR'), 120, 770, 50, col, { weight: 900, stroke: 0 }); }
    if (!red && t > 5.3) { for (let i = 0; i < 10; i++) { const k = (t * .9 + i * .1) % 1; txt('$', 150 + i * 85, 1350 - k * 500, 70, PIX, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); } }
    const tc = eo(seg(t, 7.3, 7.45)); if (!red || tc < .9) bill(W / 2, 1220, 320, Math.sin(t * 3) * .05, {}); trap(W / 2, 1220, 540, red ? tc : 0);
    if (red) { ctx.fillStyle = `rgba(255,0,40,${.2 * (.5 + .5 * Math.sin(t * 20))})`; ctx.fillRect(70, 420, 940, 1000); txt('GAME OVER', W / 2, 880, 120, '#ff5468', { align: 'center', font: 'Anton', weight: 400, glow: C.red }); }
    ctx.restore();
  });
  kinetic(['CHEAT', 'CODE?'], W / 2, 260, 170, t, 4.4, { hl: { 'CODE?': PIX } });
  if (t > 7.0) { ctx.fillStyle = '#000'; ctx.fillRect(0, 140, W, 260); kinetic(['DEADLY', 'TRAP'], W / 2, 260, 180, t, 7.1, { hl: { 'DEADLY': C.red } }); }
  flash(t, 7.35, .2, '255,59,78');
});

// 3) 8.75–12.25: soru kartı — PRINTING ≠ RICH, banknotlar griye döner
scene(8.75, 12.25, 'whipU', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.15)', seed: 3, dot: '255,210,120' });
  const R = RN(12); for (let i = 0; i < 12; i++) { const x = R() * W, y = ((t * (200 + R() * 200) + R() * 1800) % 2200) - 200; grayBill(x, y, 220, Math.sin(t + i), clamp((y - 400) / 900), '100'); }
  cam({ t, zoom: punch(t, 11.3, .1) }, () => {
    kinetic(['PRINTING', 'MONEY'], W / 2, 640, 170, t, 9.6, { hl: { 'MONEY': C.green } });
    const np = seg(t, 10.3, 10.7); if (np > 0) { ctx.save(); ctx.translate(W / 2, 880); ctx.rotate((1 - eback(np)) * 3); ctx.scale(eback(np), eback(np)); txt('≠', 0, 0, 260, C.red, { align: 'center', font: 'Anton', weight: 400, glow: C.red }); ctx.restore(); }
    kinetic(['RICH'], W / 2, 1110, 230, t, 11.2, { hl: { 'RICH': C.gold } });
  });
});

// 4) 12.25–18.5: zenginlik kağıtta değil, arkasındaki mal ve hizmette (terazi)
scene(12.25, 18.5, 'zoom', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.14)', seed: 4, dot: '190,160,255' });
  const gp = seg(t, 16.0, 17.3), tilt = lerp(-.6, .9, eio(seg(t, 16.3, 17.5))) + Math.sin(t * 3) * .03 * (1 - gp);
  cam({ x: d.x, y: d.y, rot: d.rot, t, zoom: 1.05 }, () => {
    scaleBal(W / 2, 700, 520, tilt, () => { ctx.scale(.72, .72); const n = Math.floor(9 * eo(seg(t, 13.6, 14.6))); for (let i = 0; i < n; i++) bill((i % 3 - 1) * 70, -i * 18, 190, (i % 2 ? .1 : -.1), { val: '100' }); txt('PAPER', 0, -n * 18 - 90, 52, '#fff', { align: 'center', font: 'Anton', weight: 400 }); },
      () => { ctx.scale(.72, .72); if (gp <= 0) { txt('?', 0, -60, 90, C.mute, { align: 'center', font: 'Anton', weight: 400 }); return; } const q = i => eback(clamp(gp * 2 - i * .25)); ctx.save(); ctx.scale(q(0), q(0)); house(-90, -70, 150, C.blue); ctx.restore(); ctx.save(); ctx.translate(90, -40); ctx.scale(q(1), q(1)); bread(0, 0, 130); ctx.restore(); ctx.save(); ctx.translate(-30, -180); ctx.scale(q(2), q(2)); car(0, 0, 170, C.red); ctx.restore(); ctx.save(); ctx.translate(100, -190); ctx.scale(q(3), q(3)); wrench(0, 0, 120); ctx.restore();
        txt('GOODS & SERVICES', 0, -320, 46, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); });
  });
  kinetic(['REAL', 'WEALTH', '='], W / 2, 280, 150, t, 12.4, { hl: { 'WEALTH': C.gold } });
  stampText('REAL VALUE', W / 2, 1420, 90, C.gold, seg(t, 17.4, 17.8), -.05);
});

// 5) 18.5–31.6: pizza: 8 dilim → aynı pizza 100 dilim
scene(18.5, 31.6, 'iris', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,157,31,.16)', seed: 5, dot: '255,190,120', top: '#170d05', bot: '#050302' });
  const inP = eback(seg(t, 18.6, 19.3)), rot = t * .15;
  const zk = eio(seg(t, 29.4, 30.4)), zm = lerp(1, 2.2, zk), ma = (25.5 / 100) * TAU + t * .15, sp = [W / 2 + Math.cos(ma) * (260 + 140), 900 + Math.sin(ma) * (260 + 140)];
  cam({ x: d.x, y: d.y, t }, () => {
    const cx = W / 2, cy = 900, r = 400 * inP;
    if (t < 23.7) { const cut = seg(t, 20.6, 21.3), gap = 22 * eo(seg(t, 21.3, 21.9)); pizza(cx, cy, r, t < 20.6 ? 1 : 8, gap, cut, rot);
      if (t > 21.4) { txt('8', cx + 300, 470, 180, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); txt('SLICES', cx + 300, 590, 50, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
      if (t > 22.3) pill('SAME AMOUNT OF FOOD', cx, 1400, 48, C.gold, seg(t, 22.3, 22.7)); }
    else { const cut = seg(t, 25.6, 26.4), gap = 10 * eo(seg(t, 26.6, 27.3)), out = t > 29.3 ? 330 * eo(seg(t, 29.3, 30.0)) : 0; pizza(cx, cy, r, t < 25.6 ? 1 : 100, gap, cut, rot, 25, out);
      if (t > 26.2) { counter(8, 100, cx + 290, 470, 170, seg(t, 25.8, 26.4), { col: C.red, fmt: v => Math.round(v) + '' }); txt('SLICES', cx + 290, 590, 50, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
      if (t > 27.4 && t < 29.3) { stampText('MORE FOOD?  NO', cx, 1400, 76, C.red, seg(t, 27.5, 27.9), -.05); } }
  });
  if (t < 23.7) kinetic(['IMAGINE', 'A', 'PIZZA'], W / 2, 270, 160, t, 18.7, { hl: { 'PIZZA': C.gold } });
  else if (t < 29.3) kinetic(['SAME', 'PIZZA'], W / 2, 270, 170, t, 24.3, { hl: { 'SAME': C.gold } });
  else { kinetic(['TINY', '&', 'USELESS'], W / 2, 270, 160, t, 29.5, { hl: { 'USELESS': C.red } }); pill('1/100 OF A PIZZA', W / 2, 1400, 54, C.red, seg(t, 30.3, 30.7)); }
  flash(t, 25.84, .15, '255,200,61');
});

// 6) 31.6–37.55: para arzı fırlar, mallar aynı kalır → banknotun değeri erir
scene(31.6, 37.55, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.14)', seed: 6, dot: '150,200,255' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    if (t < 35.5) {
      const base = 1300, mp = eo(seg(t, 32.3, 33.6)), gp = eo(seg(t, 33.8, 34.4));
      const mh = lerp(160, 760, mp); ctx.fillStyle = C.green; ctx.shadowColor = C.green; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(170, base - mh, 300, mh, [20, 20, 0, 0]); ctx.fill(); ctx.shadowBlur = 0;
      for (let i = 0; i < Math.floor(mh / 70); i++) bill(320, base - 40 - i * 70, 240, Math.sin(i * 1.7) * .08, { val: '100' });
      ctx.fillStyle = 'rgba(255,200,61,.85)'; ctx.beginPath(); ctx.roundRect(610, base - 160, 300, 160, [20, 20, 0, 0]); ctx.fill(); bread(700, base - 60, 100); car(830, base - 40, 120, '#2a3550');
      txt('MONEY', 320, base + 60, 56, C.green, { align: 'center', font: 'Anton', weight: 400 }); txt('GOODS', 760, base + 60, 56, C.gold, { align: 'center', font: 'Anton', weight: 400 });
      if (gp > 0) { pill('x5', 320, base - mh - 70, 64, C.green, gp); pill('SAME', 760, base - 230, 54, C.gold, gp); }
      kinetic(['PRINT', 'MORE', 'CASH'], W / 2, 280, 160, t, 32.0, { hl: { 'CASH': C.green } });
    } else {
      const v = seg(t, 35.9, 37.2), val = Math.round(lerp(100, 5, eio(v))); grayBill(W / 2, 860, 760 * (1 - .35 * eio(v)), Math.sin(t * 2) * .04, v, String(val));
      txt('VALUE: $' + val, W / 2, 1300, 110, mixCol(v), { align: 'center', font: 'Anton', weight: 400, glow: mixCol(v) }); arrow(W / 2 + 400, 1000, 300 * eo(v), false, v);
      kinetic(['LOSES', 'VALUE'], W / 2, 280, 170, t, 35.7, { hl: { 'VALUE': C.red } });
    }
  });
});
const mixCol = v => v < .4 ? C.green : (v < .75 ? C.gold : C.red);

// 7) 37.55–41.35: fiyatlar roket gibi; birikim değersiz
scene(37.55, 41.35, 'push', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 7, dot: '255,140,150' });
  const rp = eio(seg(t, 37.8, 39.3)), price = Math.pow(10, lerp(0, 6, rp));
  cam({ t, shake: t > 38.2 && t < 39.3 ? 8 : 2, y: lerp(0, 120, rp) }, () => {
    const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; if (u > rp) break; pts.push([100 + u * 880, 1350 - Math.pow(u, 4) * 900]); }
    ctx.save(); ctx.strokeStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 25; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
    const e = pts[pts.length - 1] || [100, 1350]; bread(e[0] - 40, e[1] + 130, 120); flame(e[0] - 40, e[1] + 200, 90, t); priceTag(e[0] - 60, e[1] - 30, 140, fmtMoney(price), C.gold, -.15);
    const sp = seg(t, 39.4, 39.8); if (sp > 0) { ctx.save(); ctx.globalAlpha = sp; piggy(260, 1180, 150); txt('SAVINGS', 260, 1000, 50, '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); stampText('WORTHLESS', 330, 1170, 70, C.red, seg(t, 40.3, 40.6), -.2); }
  });
  kinetic(['PRICES', 'SKYROCKET'], W / 2, 270, 150, t, 37.7, { hl: { 'SKYROCKET': C.red } });
  flash(t, 40.34, .12, '255,59,78');
});

// 8) 41.35–46.3: HİPERENFLASYON — el arabası dolusu para, ekonomi çöker
scene(41.35, 46.3, 'glitch', t => {
  const d = drift(t, 1.4); bgFinance(t, { tint: 'rgba(255,59,78,.15)', seed: 8, dot: '255,140,150', top: '#150608', bot: '#030102' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    if (t < 43.8) { wheelbarrow(W / 2 + 40, 980, 820, Math.floor(26 * eo(seg(t, 41.6, 42.8)))); txt('= 1 LOAF OF BREAD', W / 2, 1300, 70, '#fff', { align: 'center', font: 'Anton', weight: 400 }); bread(W / 2 + 330, 1210, 100);
      bill(W / 2, 560, 600, -.05, { val: '100T' }); txt('100,000,000,000,000', W / 2, 700, 46, C.gold, { align: 'center', weight: 900 }); }
    else { const k = seg(t, 43.9, 45.6), hs = [520, 610, 700, 760, 820]; hs.forEach((h, i) => { const fall = eio(clamp(k * 1.6 - i * .15)), hh = h * (1 - .85 * fall), x = 140 + i * 175;
        ctx.save(); ctx.translate(x + 70, 1350); ctx.rotate(fall * (i % 2 ? .3 : -.25)); ctx.fillStyle = mixCol(fall); ctx.beginPath(); ctx.roundRect(-70, -hh, 140, hh, [14, 14, 0, 0]); ctx.fill(); ctx.restore();
        if (fall > .1) for (let j = 0; j < 4; j++) { ctx.fillStyle = 'rgba(255,90,100,.6)'; ctx.fillRect(x + 20 + j * 30, 1350 - h * .5 + fall * 400 + j * 30 * fall, 26, 26); } });
      txt('ECONOMY', W / 2, 1430, 60, C.mute, { align: 'center', font: 'Anton', weight: 400 }); }
  });
  stampText('HYPERINFLATION', W / 2, 270, 110, C.red, seg(t, 42.1, 42.5), -.04);
  if (t > 43.8) kinetic(['DESTROYED'], W / 2, 430, 120, t, 43.9, { hl: { 'DESTROYED': '#fff' } });
});

// 9) 46.3–50.75: başka büyük soru — kart 3B dönerek gelir
scene(46.3, 50.75, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(155,107,255,.2)', seed: 9, dot: '190,160,255' });
  const sp = Math.sin(t * 1.8) * .9, sx = Math.cos(sp), inP = eback(seg(t, 46.6, 47.3));
  ctx.save(); ctx.translate(W / 2, 880); ctx.scale(Math.max(.05, Math.abs(sx)) * inP, inP); if (sx >= 0) card(0, 0, 700, -.08, '#7c5cff', '#2b136b'); else { ctx.fillStyle = '#2b136b'; ctx.beginPath(); ctx.roundRect(-350, -220, 700, 441, 42); ctx.fill(); ctx.fillStyle = '#111'; ctx.fillRect(-350, -150, 700, 80); } ctx.restore();
  qmark(W / 2 + 330, 560, 260 * eback(seg(t, 49.4, 49.9)), t, C.violet);
  kinetic(['EVERYDAY', 'MONEY'], W / 2, 280, 150, t, 46.6, { hl: { 'EVERYDAY': C.violet } });
  if (t > 48.4) { ctx.fillStyle = 'rgba(6,9,15,.9)'; ctx.fillRect(0, 160, W, 240); kinetic(['ANOTHER', 'HUGE', 'QUESTION'], W / 2, 280, 135, t, 48.5, { hl: { 'HUGE': C.gold } }); }
});

// 10) 50.75–55.65: borcu zamanında ödesen bile — kart bankaya nasıl para kazandırır?
scene(50.75, 55.65, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.14)', seed: 10 });
  cam({ x: d.x, y: d.y, t }, () => {
    const pp = seg(t, 51.2, 51.7); ctx.save(); ctx.globalAlpha = pp; ctx.fillStyle = '#0d1424'; ctx.strokeStyle = '#3a4a6a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(160, 470, 760, 520, 40); ctx.fill(); ctx.stroke();
    txt('CARD STATEMENT', 220, 550, 44, C.mute, { weight: 900, stroke: 0 }); txt('BALANCE', 220, 650, 50, '#fff', { weight: 900, stroke: 0 }); txt(fmtMoney(lerp(1840, 0, eio(seg(t, 51.8, 52.5))), '$', 2), 860, 650, 64, C.green, { align: 'right', font: 'Anton', weight: 400, stroke: 0 });
    txt('INTEREST', 220, 750, 50, '#fff', { weight: 900, stroke: 0 }); txt('$0.00', 860, 750, 64, C.green, { align: 'right', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    stampText('PAID ON TIME ✓', W / 2, 880, 70, C.green, seg(t, 52.3, 52.6), -.05);
    const bp = seg(t, 53.2, 53.6); if (bp > 0) { ctx.save(); ctx.globalAlpha = bp; card(250, 1250, 260, -.15); bank(830, 1380, 300, { glow: 'rgba(255,200,61,.6)' });
      for (let i = 0; i < 6; i++) { const k = (t * .9 + i / 6) % 1; coin(lerp(330, 760, k), 1240 - Math.sin(k * Math.PI) * 180, 26, t * 7 + i); } qmark(W / 2 + 20, 1110, 140, t); ctx.restore(); }
  });
  kinetic(['HOW', 'DO', 'THEY', 'PROFIT?'], W / 2, 280, 150, t, 53.3, { hl: { 'PROFIT?': C.gold } });
  if (t < 53.3) kinetic(['PAID', 'IN', 'FULL'], W / 2, 280, 160, t, 51.0, { hl: { 'FULL': C.green } });
});

// 11) 55.65–60.3: CTA
scene(55.65, 60.3, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 11, dot: '255,140,150' });
  ctx.save(); ctx.translate(W / 2, 760); ctx.rotate(Math.sin(t * 1.5) * .06); card(0, 0, 560, -.1); ctx.restore();
  pill('NEXT: CREDIT CARD SECRETS', W / 2, 1010, 46, C.gold, seg(t, 56.2, 56.6));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 280, 150, t, 55.8, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 57.9, 58.3), press = seg(t, 58.6, 58.75) - seg(t, 58.75, 58.9), done = t > 58.75;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1240); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 58.0, 58.6))), lerp(1480, 1250, eo(seg(t, 58.0, 58.6))), 1, press);
    if (done) { const k = seg(t, 58.75, 59.8); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1240 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 58.75, .15);
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
    ctx.fillStyle = `rgba(57,255,136,${.15 * a})`; ctx.fillRect(0, 0, W, H); return; }
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
