// "Where Does Your Bank Money Really Go?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps, ses: kullanıcı.
window.DUR = 61.3;
const SUBY = 1660;

// ---------------- yardımcı çizimler ----------------
function steel(x, y, r) { const g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g.addColorStop(0, '#e8eef6'); g.addColorStop(.55, '#9aa7b8'); g.addColorStop(1, '#4b5566'); return g; }
function vaultDoor(x, y, r, spin, open) {             // open: 0 kapalı → 1 menteşeden tamamen açık
  ctx.save(); ctx.translate(x - r, y); ctx.scale(Math.max(.02, 1 - open * .93), 1); ctx.translate(r, 0);
  ctx.fillStyle = steel(0, 0, r); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#3a4352'; ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(0, 0, r * .86, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * .55, 0, TAU); ctx.stroke();
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; ctx.fillStyle = '#2d3440'; ctx.beginPath(); ctx.arc(Math.cos(a) * r * .93, Math.sin(a) * r * .93, r * .035, 0, TAU); ctx.fill(); }
  ctx.save(); ctx.rotate(spin); ctx.strokeStyle = '#d6dde8'; ctx.lineWidth = r * .07; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * .48, Math.sin(a) * r * .48); ctx.stroke(); ctx.fillStyle = '#c33'; ctx.beginPath(); ctx.arc(Math.cos(a) * r * .5, Math.sin(a) * r * .5, r * .06, 0, TAU); ctx.fill(); }
  ctx.fillStyle = steel(0, 0, r * .15); ctx.beginPath(); ctx.arc(0, 0, r * .14, 0, TAU); ctx.fill(); ctx.restore();
  ctx.restore();
}
function bank(x, y, s, o = {}) {                       // klasik banka binası; (x,y) = zemin ortası, s = genişlik
  ctx.save(); ctx.translate(x, y); const h = s * .78, col = o.col || '#e9eef5', sh = o.shade || '#aeb8c8';
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 80; }
  ctx.fillStyle = sh; ctx.fillRect(-s * .55, -s * .06, s * 1.1, s * .06); ctx.fillRect(-s * .5, -s * .11, s, s * .05);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s * .55, -h * .78); ctx.lineTo(0, -h); ctx.lineTo(s * .55, -h * .78); ctx.closePath(); ctx.fill();
  ctx.fillRect(-s * .5, -h * .78, s, s * .06); ctx.shadowBlur = 0;
  for (let i = 0; i < 5; i++) { const cx = -s * .4 + i * s * .2; const g = ctx.createLinearGradient(cx - s * .05, 0, cx + s * .05, 0); g.addColorStop(0, sh); g.addColorStop(.5, col); g.addColorStop(1, sh); ctx.fillStyle = g; ctx.fillRect(cx - s * .045, -h * .78 + s * .06, s * .09, h * .78 - s * .17); }
  txt(o.label || 'BANK', 0, -h * .855, s * .085, '#2a3344', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.arc(0, -h * .86 - s * .0, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
function house(x, y, s, col = C.blue) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s * .5, -s * .1); ctx.lineTo(0, -s * .55); ctx.lineTo(s * .5, -s * .1); ctx.closePath(); ctx.fill(); ctx.fillRect(-s * .36, -s * .12, s * .72, s * .5); ctx.fillStyle = C.ink; ctx.fillRect(-s * .09, s * .1, s * .18, s * .28); ctx.fillRect(-s * .28, -s * .02, s * .13, s * .12); ctx.fillRect(s * .15, -s * .02, s * .13, s * .12); ctx.restore(); }
function factory(x, y, s, col = C.violet) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s * .5, s * .38); ctx.lineTo(-s * .5, -s * .1); ctx.lineTo(-s * .2, s * .05); ctx.lineTo(-s * .2, -s * .1); ctx.lineTo(s * .1, s * .05); ctx.lineTo(s * .1, -s * .1); ctx.lineTo(s * .22, -s * .04); ctx.lineTo(s * .22, -s * .5); ctx.lineTo(s * .38, -s * .5); ctx.lineTo(s * .38, s * .0); ctx.lineTo(s * .5, s * .05); ctx.lineTo(s * .5, s * .38); ctx.closePath(); ctx.fill(); ctx.fillStyle = C.ink; for (let i = 0; i < 3; i++) ctx.fillRect(-s * .4 + i * s * .3, s * .14, s * .14, s * .12); ctx.restore(); }
function card(x, y, s, rot = 0, col1 = '#ff5a6a', col2 = '#a3122a') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const w = s, h = s * .63, g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, col1); g.addColorStop(1, col2); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, s * .06); ctx.fill(); ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.roundRect(-w * .38, -h * .15, w * .16, h * .24, 6); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 4; i++) ctx.fillRect(-w * .38 + i * w * .2, h * .2, w * .15, h * .07); ctx.restore(); }
function safeBox(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = steel(0, 0, s); ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * .06); ctx.fill(); ctx.strokeStyle = '#3a4352'; ctx.lineWidth = s * .03; ctx.strokeRect(-s * .4, -s * .4, s * .8, s * .8); ctx.fillStyle = '#2d3440'; ctx.beginPath(); ctx.arc(0, 0, s * .16, 0, TAU); ctx.fill(); ctx.fillStyle = '#c9d2de'; ctx.beginPath(); ctx.arc(0, 0, s * .1, 0, TAU); ctx.fill(); ctx.restore(); }
function stampX(x, y, s, p) { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y); ctx.scale(2.2 - 1.2 * e, 2.2 - 1.2 * e); ctx.globalAlpha = clamp(p * 4); ctx.strokeStyle = C.red; ctx.lineWidth = s * .14; ctx.lineCap = 'round'; ctx.shadowColor = C.red; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(-s / 2, -s / 2); ctx.lineTo(s / 2, s / 2); ctx.moveTo(s / 2, -s / 2); ctx.lineTo(-s / 2, s / 2); ctx.stroke(); ctx.restore(); }
function stampText(s, x, y, size, col, p, rot = -.12) { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(2.4 - 1.4 * e, 2.4 - 1.4 * e); ctx.globalAlpha = clamp(p * 4); ctx.font = `400 ${size}px Anton`; const w = ctx.measureText(s).width + size * .6; ctx.strokeStyle = col; ctx.lineWidth = size * .09; ctx.beginPath(); ctx.roundRect(-w / 2, -size * .72, w, size * 1.44, size * .2); ctx.stroke(); txt(s, 0, 0, size, col, { align: 'center', font: 'Anton', weight: 400, stroke: 0, glow: col }); ctx.restore(); }
function globe(x, y, r, t) { ctx.save(); ctx.translate(x, y); const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, '#1d4f8f'); g.addColorStop(1, '#071a33'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip(); ctx.strokeStyle = 'rgba(120,200,255,.45)'; ctx.lineWidth = 3;
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(0, i * r * .27, Math.sqrt(1 - Math.pow(i * .27, 2)) * r, r * .04, 0, 0, TAU); ctx.stroke(); }
  for (let i = 0; i < 8; i++) { const a = ((i / 8 + t * .05) % 1) * Math.PI; ctx.beginPath(); ctx.ellipse(0, 0, Math.abs(Math.cos(a)) * r, r, 0, 0, TAU); ctx.stroke(); }
  ctx.restore(); ctx.strokeStyle = 'rgba(120,200,255,.8)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.restore(); }
function qmark(x, y, size, t, col = C.gold) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * .08); txt('?', 0, 0, size, col, { align: 'center', font: 'Anton', weight: 400, glow: col, blur: 60 }); ctx.restore(); }
function flyBill(x0, y0, x1, y1, p, w, seed) { if (p <= 0 || p >= 1) return; const e = eio(p), arc = Math.sin(p * Math.PI) * (-260 + seed % 3 * 120); bill(lerp(x0, x1, e) + Math.sin(p * 9 + seed) * 30, lerp(y0, y1, e) + arc, w * (1 - .45 * e), Math.sin(p * 7 + seed) * .9, { flip: Math.cos(p * 10 + seed) }); }
function pill(s, x, y, size, col, p) { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y); ctx.scale(e, e); tag(s, 0, 0, col, size); ctx.restore(); }

// ---------------- sahneler (lt = sahne içi süre, t = global) ----------------
const S = [];
const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) HOOK 0–3.9: kasa kapısı çarparak gelir, "Think again" ile açılır → BOŞ
scene(0, 3.9, 'up', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 1, dot: '150,190,255' });
  const inP = eo(seg(t, 0, .45)), open = eio(seg(t, 2.85, 3.5)), sh = t < .6 ? 18 * (1 - t / .6) : (t > 2.9 && t < 3.3 ? 10 : 0);
  cam({ zoom: (1.5 - .5 * inP) * (1 + .1 * seg(t, 1, 2.9)), t, shake: sh }, () => {
    const cx = W / 2, cy = 820, r = 400;
    ctx.fillStyle = '#05070c'; ctx.beginPath(); ctx.arc(cx, cy, r * 1.02, 0, TAU); ctx.fill();          // kasa içi (boş)
    if (open > .05) { ctx.save(); ctx.globalAlpha = open; txt('EMPTY', cx, cy - 20, 150, C.red, { align: 'center', font: 'Anton', weight: 400, glow: C.red, blur: 50 });
      const R = RN(9); for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(200,200,220,${.3 * R()})`; ctx.beginPath(); ctx.arc(cx + (R() - .5) * 600, cy + (R() - .5) * 600 - t * 20 * R(), 2 + R() * 4, 0, TAU); ctx.fill(); } ctx.restore(); }
    ctx.strokeStyle = '#5c6779'; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(cx, cy, r + 18, 0, TAU); ctx.stroke();
    vaultDoor(cx, cy, r, t * .6 + seg(t, 2.3, 2.9) * 4, open);
    const lab = seg(t, 1.6, 2.1); if (lab > 0 && open < .5) pill('YOUR $1,000', cx, cy + r + 120, 60, C.green, lab);
  });
  if (t < 2.85) kinetic(['YOUR', 'MONEY', 'IS', 'SAFE?'], W / 2, 220, 130, t, .1, { hl: { 'SAFE?': C.gold } });
  else kinetic(['THINK', 'AGAIN.'], W / 2, 220, 160, t, 2.9, { hl: { 'AGAIN.': C.red } });
  flash(t, 0, .25); flash(t, 3.0, .2, '255,59,78');
});

// 2) 3.9–7.9: banka senin paranı yutar, MILLIONS sayacı
scene(3.9, 7.9, 'left', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 2, dot: '255,210,120' });
  const g = seg(t, 5.9, 7.2); lineChart(-20, 360, 1120, 700, [1, 1.3, 1.2, 1.8, 2.4, 2.2, 3.4, 4.6, 6.2, 8.8, 12], eio(seg(t, 4.0, 7.6)), { col: C.gold, axes: false, lw: 8 });
  cam({ zoom: punch(t, 5.96, .1) * (1 + .05 * seg(t, 3.9, 7.9)), t }, () => {
    bank(W / 2, 1380, 700, { glow: 'rgba(255,200,61,.6)' });
    for (let i = 0; i < 9; i++) flyBill(-150 + (i % 2) * 1380, 1500 - i * 40, W / 2, 1220, seg(t, 4.3 + i * .22, 5.1 + i * .22), 230, i);
  });
  if (t >= 5.9) counter(0, 4800000, W / 2, 330, 190, seg(t, 5.9, 7.6), { col: C.gold, fmt: v => fmtMoney(v) });
  if (t < 5.9) kinetic(['USING', 'YOUR', 'CASH'], W / 2, 330, 140, t, 4.6, { hl: { 'CASH': C.green } });
  flash(t, 5.96, .15, '255,200,61');
});

// 3) 7.9–11.3: GİZLİ GERÇEK — spot ışığı finans ağını açığa çıkarır
scene(7.9, 11.3, 'zoom', t => {
  ctx.fillStyle = '#04060a'; ctx.fillRect(0, 0, W, H);
  const sx = W / 2 + Math.sin(t * 1.8) * 200, sy = 950 + Math.cos(t * 1.3) * 260, rad = 430 + 260 * seg(t, 9.6, 10.8);
  ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, rad, 0, TAU); ctx.clip();
  bgFinance(t, { tint: 'rgba(34,224,122,.25)', seed: 3 });
  const R = RN(31), nodes = []; for (let i = 0; i < 16; i++) nodes.push([100 + R() * 880, 380 + R() * 1100]);
  ctx.strokeStyle = 'rgba(34,224,122,.5)'; ctx.lineWidth = 4; nodes.forEach((a, i) => { const b = nodes[(i * 5 + 3) % 16]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    const k = (t * .7 + i * .13) % 1; coin(lerp(a[0], b[0], k), lerp(a[1], b[1], k), 22, t * 6 + i); });
  nodes.forEach((n, i) => { ctx.fillStyle = i % 4 ? C.green : C.gold; ctx.beginPath(); ctx.arc(n[0], n[1], 18, 0, TAU); ctx.fill(); });
  ctx.restore();
  const rg = ctx.createRadialGradient(sx, sy, rad * .7, sx, sy, rad); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, 'rgba(0,0,0,.9)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(sx, sy, rad, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx, sy, rad, 0, TAU); ctx.stroke();
  kinetic(['THE', 'HIDDEN', 'TRUTH'], W / 2, 250, 165, t, 8.4, { hl: { 'HIDDEN': C.green } });
});

// 4) 11.3–15.9: $1,000 yatır → kasaya kilitlenmez (X)
scene(11.3, 15.9, 'up', t => {
  bgFinance(t, { tint: 'rgba(34,224,122,.16)', seed: 4 });
  txt('DEPOSIT', W / 2, 250, 90, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  counter(0, 1000, W / 2, 420, 230, seg(t, 11.98, 12.9), { col: C.green });
  for (let i = 0; i < 10; i++) { const p = eo(seg(t, 11.5 + i * .12, 12.1 + i * .12)); if (p <= 0) continue; bill(lerp(-300 + (i % 2) * 1680, W / 2, p), lerp(1500, 800 - i * 22, p), 440, lerp((i % 2 ? 1 : -1) * 1.2, (i - 5) * .02, p), { val: '100' }); }
  const sp = seg(t, 13.5, 14.0); if (sp > 0) { ctx.save(); ctx.globalAlpha = sp; safeBox(W / 2, 1180, 330 * eback(sp)); ctx.restore();
    txt('LOCKED AWAY?', W / 2, 1420, 70, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
  stampX(W / 2, 1180, 380, seg(t, 15.1, 15.4));
  flash(t, 15.15, .15, '255,59,78');
});

// 5) 15.9–19.9: kanunen yalnızca küçük bir kısmı elde tutulur
scene(15.9, 19.9, 'left', t => {
  bgFinance(t, { tint: 'rgba(155,107,255,.16)', seed: 5, dot: '190,160,255' });
  kinetic(['BY', 'LAW'], W / 2, 250, 150, t, 16.0, { hl: { 'LAW': C.violet } });
  const go = seg(t, 18.1, 19.0);
  for (let i = 0; i < 10; i++) { const x = 170 + (i % 5) * 185, y = 560 + Math.floor(i / 5) * 230, keep = i === 0, p = keep ? 0 : eio(clamp(go * 1.6 - (i - 1) * .07));
    const a = eo(seg(t, 16.0 + i * .05, 16.5 + i * .05)); if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha = 1 - p * .9; ctx.translate(x + p * 900, y - p * 250); ctx.rotate(p * 1.5); ctx.scale(a, a); bill(0, 0, 170, 0, { val: '100' }); ctx.restore(); }
  const kp = seg(t, 18.4, 18.9); if (kp > 0) { ctx.strokeStyle = C.gold; ctx.lineWidth = 8; ctx.shadowColor = C.gold; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(170 - 110, 560 - 65, 220, 130, 18); ctx.stroke(); ctx.shadowBlur = 0; pill('ON HAND', 170 + 40, 430, 44, C.gold, kp); }
  donut(W / 2, 1220, 280, [{ v: 1, col: C.gold }, { v: 9, col: '#2a3550' }], seg(t, 16.6, 17.6));
  const lp = seg(t, 18.5, 19.2); donut(W / 2, 1220, 280 * (1 + .04 * Math.sin(t * 8) * lp), [{ v: 1, col: C.gold }, { v: 9, col: C.green }], lp > 0 ? 1 : 0, {});
  txt(lp > 0 ? 'LENT OUT' : 'TINY FRACTION', W / 2, 1220, 52, lp > 0 ? C.green : C.gold, { align: 'center', font: 'Anton', weight: 400 });
});

// 6) 19.9–28.4: geri kalanı → ipotek, iş kredisi, kredi kartı
scene(19.9, 28.4, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.15)', seed: 6, dot: '150,190,255' });
  if (t < 22.1) { qmark(W / 2, 760, 600 * eback(seg(t, 20.0, 20.5)), t); kinetic(['THE', 'REST?'], W / 2, 260, 160, t, 20.4, { hl: { 'REST?': C.gold } }); return; }
  const bx = W / 2, by = 620; cam({ zoom: punch(t, 22.86, .07), t }, () => {
    bank(bx, by + 260, 560, { glow: 'rgba(61,165,255,.5)' });
    txt('LEND', bx, 210, 150, C.blue, { align: 'center', font: 'Anton', weight: 400, glow: C.blue });
    const targets = [[200, 1240, 25.66, 'MORTGAGE', C.blue], [540, 1300, 26.56, 'BUSINESS', C.violet], [880, 1240, 27.52, 'CREDIT', C.red]];
    targets.forEach(([x, y, tt, lab, col], k) => {
      for (let i = 0; i < 4; i++) flyBill(bx, by + 60, x, y - 40, seg(t, 22.9 + k * .35 + i * .3, 23.8 + k * .35 + i * .3) % 1.0001, 150, i + k);
      const p = seg(t, tt - .15, tt + .3); ctx.save(); ctx.translate(x, y); ctx.scale(eback(p), eback(p)); ctx.globalAlpha = clamp(p * 3);
      ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-150, -150, 300, 300, 36); ctx.fill(); ctx.stroke();
      if (k === 0) house(0, -20, 200, col); else if (k === 1) factory(0, -20, 220, col); else card(0, -30, 220, -.15 + Math.sin(t * 3) * .05);
      txt(lab, 0, 105, 42, '#fff', { align: 'center', weight: 900 }); ctx.restore();
      if (p > 0) { ctx.strokeStyle = col + '88'; ctx.setLineDash([16, 14]); ctx.lineDashOffset = -t * 60; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx, by + 60); ctx.lineTo(x, y - 150); ctx.stroke(); ctx.setLineDash([]); }
    });
  });
});

// 7) 28.4–30.7: "here is where they win"
scene(28.4, 30.7, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.25)', seed: 7, dot: '255,210,120' });
  const R = RN(77); for (let i = 0; i < 26; i++) { const a = R() * TAU, sp = 400 + R() * 900, k = seg(t, 29.7, 30.7), d = sp * eo(k); if (k > 0) coin(W / 2 + Math.cos(a) * d, 900 + Math.sin(a) * d + 500 * k * k, 34 + R() * 20, t * 8 + i); }
  bank(W / 2, 1250, 560 * (1 + .05 * Math.sin(t * 6)), { glow: 'rgba(255,200,61,.9)' });
  kinetic(['WHERE', 'THEY', 'WIN'], W / 2, 330, 175, t, 28.9, { hl: { 'WIN': C.gold } });
  flash(t, 29.8, .2, '255,200,61');
});

// 8) 30.7–39.2: sana %1, borçluya %8 / %12 / %20
scene(30.7, 39.2, 'up', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.12)', seed: 8, dot: '255,140,150' });
  txt(t < 34.6 ? 'YOU GET' : 'THEY CHARGE', W / 2, 230, 110, t < 34.6 ? C.mute : C.red, { align: 'center', font: 'Anton', weight: 400 });
  const base = 1430, sc = 52, items = [[1, 32.08, 'YOUR\nSAVINGS', '#7f8aa3'], [8, 36.38, 'MORTGAGE', C.gold], [12, 37.22, 'BUSINESS', '#ff8a3d'], [20, 38.12, 'CREDIT\nCARD', C.red]];
  cam({ zoom: punch(t, 38.12, .08), t, shake: t > 38.1 && t < 38.5 ? 7 : 0 }, () => {
    items.forEach(([v, tt, lab, col], i) => { const x = 165 + i * 250, p = seg(t, tt - .1, tt + .5), e = eback(p), h = v * sc * e;
      ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(x - 85, base - 20 * sc, 170, 20 * sc);
      if (p > 0) { const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, col); g.addColorStop(1, col + '44'); ctx.fillStyle = g; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(x - 85, base - Math.max(h, 8), 170, Math.max(h, 8), [16, 16, 0, 0]); ctx.fill(); ctx.shadowBlur = 0;
        txt(Math.round(v * clamp(p * 1.3)) + '%', x, base - Math.max(h, 8) - 60, 78, col, { align: 'center', font: 'Anton', weight: 400, glow: col }); }
      lab.split('\n').forEach((l, j) => txt(l, x, base + 55 + j * 46, 38, i ? '#fff' : C.mute, { align: 'center', weight: 900 }));
    });
    if (t < 34.6) { const p = seg(t, 32.6, 33.2); pill('TINY', 165 + 120, base - 300, 50, '#7f8aa3', p); }
  });
});

// 9) 39.2–42.7: aradaki fark = SAF KÂR
scene(39.2, 42.7, 'left', t => {
  bgFinance(t, { tint: 'rgba(34,224,122,.22)', seed: 9 });
  const top = 470, bot = 1250, p = eio(seg(t, 39.4, 40.6));
  ctx.fillStyle = '#7f8aa3'; ctx.fillRect(140, bot, 800 * p, 26); txt('YOU 1%', 140, bot + 70, 50, C.mute, { weight: 900 });
  ctx.fillStyle = C.red; ctx.fillRect(140, top, 800 * p, 26); txt('BORROWERS 20%', 140, top - 50, 50, C.red, { weight: 900 });
  const f = seg(t, 40.2, 41.0); if (f > 0) { const g = ctx.createLinearGradient(0, top, 0, bot); g.addColorStop(0, 'rgba(34,224,122,.55)'); g.addColorStop(1, 'rgba(34,224,122,.15)'); ctx.fillStyle = g; ctx.fillRect(140, bot - (bot - top - 26) * eo(f), 800, (bot - top - 26) * eo(f));
    moneyRainBox(t, 140, top + 26, 800, bot - top - 26, f); }
  stampText('PURE PROFIT', W / 2, (top + bot) / 2, 120, C.green, seg(t, 41.6, 42.0));
  arrow(980, bot - 20, (bot - top - 60) * eo(f), true, f, { w: 30 });
  flash(t, 41.66, .15, '34,224,122');
});
function moneyRainBox(t, x, y, w, h, a) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.globalAlpha = a; const R = RN(19); for (let i = 0; i < 14; i++) { const sp = 200 + R() * 300, yy = y + ((t * sp + R() * 900) % (h + 200)) - 100; bill(x + R() * w, yy, 150, Math.sin(t * 2 + i) * .8, { flip: Math.cos(t * 3 + i) }); } ctx.restore(); }

// 10) 42.7–48.0: senin paranla imparatorluk kurarlar, sana bozuk para
scene(42.7, 48.0, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.16)', seed: 10, dot: '255,210,120' });
  const grow = eo(seg(t, 43.0, 46.0)), camY = -260 * grow;
  cam({ y: -camY * .0, zoom: 1 - .12 * grow, t }, () => {
    const heights = [16, 26, 40, 56, 34, 20]; heights.forEach((n, i) => { const k = Math.floor(n * clamp(grow * 1.3 - i * .05)); cashStack(140 + i * 160, 1480, 150, k); });
    const topY = 1480 - 56 * 150 * .09 * clamp(grow * 1.3 - .15); bank(140 + 3 * 160, topY - 10, 300 * clamp(grow * 2 - .6), { label: 'EMPIRE', glow: 'rgba(255,200,61,.8)' });
  });
  kinetic(['THEIR', 'EMPIRE'], W / 2, 250, 170, t, 45.0, { hl: { 'EMPIRE': C.gold } });
  if (t < 45.0) kinetic(['YOUR', 'OWN', 'CASH'], W / 2, 250, 150, t, 43.4, { hl: { 'CASH': C.green } });
  const pp = seg(t, 46.2, 47.6); if (pp > 0) { piggy(W / 2 + 330, 1330, 150); for (let i = 0; i < 3; i++) { const k = seg(t, 46.3 + i * .25, 47.0 + i * .25); if (k > 0 && k < 1) coin(W / 2 + 40 + 290 * k, 700 + 600 * k * k - 160 * Math.sin(k * Math.PI), 22, t * 9 + i); }
    pill('PENNIES', W / 2 + 230, 1130, 46, '#b87333', seg(t, 46.9, 47.3)); }
});

// 11) 48.0–50.7: çok daha büyük soru
scene(48.0, 50.7, 'iris', t => {
  ctx.fillStyle = '#030408'; ctx.fillRect(0, 0, W, H); bgFinance(t, { tint: 'rgba(155,107,255,.22)', seed: 11, dot: '190,160,255' });
  const z = 1 + .35 * seg(t, 48.0, 50.7); cam({ zoom: z, t, shake: 3 }, () => qmark(W / 2, 880, 900 * eback(seg(t, 48.1, 48.7)), t, C.violet));
  kinetic(['A', 'MUCH', 'BIGGER', 'QUESTION'], W / 2, 250, 130, t, 48.9, { hl: { 'BIGGER': C.violet } });
});

// 12) 50.7–56.6: aynı para tekrar tekrar döner → dünyadaki paranın çoğu nerede?
scene(50.7, 56.6, 'up', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.18)', seed: 12, dot: '150,190,255' });
  if (t < 54.2) {
    const cx = W / 2, cy = 900, rr = 390, pos = [0, 1, 2, 3].map(i => [cx + Math.cos(i / 4 * TAU - Math.PI / 2) * rr, cy + Math.sin(i / 4 * TAU - Math.PI / 2) * rr]);
    ctx.strokeStyle = 'rgba(61,165,255,.4)'; ctx.lineWidth = 8; ctx.setLineDash([20, 16]); ctx.lineDashOffset = -t * 120; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    pos.forEach(([x, y]) => bank(x, y + 110, 260));
    const loops = (t - 51.3) * 1.4, a = loops * TAU - Math.PI / 2; if (loops > 0) bill(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 190, a + Math.PI / 2);
    const n = Math.max(1, Math.floor(loops * 4) + 1); txt('SAME $1,000', cx, cy - 30, 70, C.green, { align: 'center', font: 'Anton', weight: 400 }); txt('LENT ×' + n, cx, cy + 60, 80, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold });
    kinetic(['OVER', 'AND', 'OVER'], W / 2, 250, 160, t, 52.9, { hl: { 'OVER': C.blue } });
  } else {
    const p = eback(seg(t, 54.2, 54.8)); cam({ zoom: p, t }, () => { globe(W / 2, 880, 420, t);
      const R = RN(5); for (let i = 0; i < 7; i++) { const a = R() * TAU, d = R() * 300, k = (t * 1.5 + i * .3) % 1; ctx.strokeStyle = `rgba(255,200,61,${1 - k})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * d, 880 + Math.sin(a) * d, 20 + k * 60, 0, TAU); ctx.stroke(); }
      const sw = (t * 1.2) % 1 * TAU; ctx.save(); ctx.beginPath(); ctx.moveTo(W / 2, 880); ctx.arc(W / 2, 880, 420, sw, sw + .5); ctx.closePath(); ctx.fillStyle = 'rgba(34,224,122,.25)'; ctx.fill(); ctx.restore(); });
    qmark(W / 2 + 330, 520, 260 * eback(seg(t, 55.4, 55.9)), t);
    kinetic(['WHERE', 'IS', 'THE', 'MONEY?'], W / 2, 250, 140, t, 54.3, { hl: { 'MONEY?': C.gold } });
  }
});

// 13) 56.6–61.3: CTA — gerçek için abone ol
scene(56.6, 61.3, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 13, dot: '255,140,150' });
  vaultDoor(W / 2, 780, 330, t * 1.5, .15 + .1 * Math.sin(t * 2));
  ctx.save(); ctx.globalAlpha = .9; txt('?', W / 2 + 120, 780, 260, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold, blur: 60 }); ctx.restore();
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 250, 150, t, 56.8, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 58.9, 59.4), press = seg(t, 59.6, 59.8) - seg(t, 59.8, 60.0), done = t > 59.75;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1300); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s);
    ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    const hx = lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 59.0, 59.6))), hy = lerp(1600, 1340, eo(seg(t, 59.0, 59.6)));    // imleç
    ctx.save(); ctx.translate(hx, hy); ctx.scale(1 - .15 * press, 1 - .15 * press); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore();
    if (done) { const k = seg(t, 59.75, 60.6); for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; coin(W / 2 + Math.cos(a) * 500 * eo(k), 1300 + Math.sin(a) * 300 * eo(k), 26 * (1 - k * .5), t * 8 + i); } } }
  const np = seg(t, 60.3, 60.8); if (np > 0) pill('NEXT VIDEO →', W / 2, 1500, 56, C.gold, np);
  flash(t, 59.75, .15);
});

// ---------------- birleştirici: sahneler + geçişler ----------------
const TD = .34;
function drawScene(i, t) { ctx.save(); S[i].fn(t); ctx.restore(); }
function transition(i, t) {                               // S[i-1] → S[i], sınır S[i].s
  const b = S[i].s, k = eio(seg(t, b - TD / 2, b + TD / 2)), type = S[i].tr;
  if (type === 'up' || type === 'left') { const dir = type === 'up' ? [0, 1] : [1, 0], dist = type === 'up' ? H : W;
    if (k < 1) cam({ x: -dir[0] * dist * k, y: -dir[1] * dist * k }, () => drawScene(i - 1, t)); if (k > 0) cam({ x: dir[0] * dist * (1 - k), y: dir[1] * dist * (1 - k) }, () => drawScene(i, t));
    motionStreak(Math.sin(k * Math.PI)); }
  else if (type === 'zoom') { if (k < 1) { ctx.save(); ctx.globalAlpha = 1; cam({ zoom: 1 + k * 2.5 }, () => drawScene(i - 1, t)); ctx.restore(); }
    if (k > 0) { ctx.save(); ctx.globalAlpha = k; cam({ zoom: .6 + .4 * k }, () => drawScene(i, t)); ctx.restore(); } ctx.fillStyle = `rgba(255,255,255,${.22 * Math.sin(k * Math.PI)})`; ctx.fillRect(0, 0, W, H); }
  else iris(t, b - TD / 2, TD, () => drawScene(i - 1, t), () => drawScene(i, t));
}
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  let i = S.findIndex(s => t < s.e); if (i < 0) i = S.length - 1;
  if (i > 0 && t < S[i].s + TD / 2) transition(i, t);
  else if (i < S.length - 1 && t > S[i].e - TD / 2) transition(i + 1, t);
  else drawScene(i, t);
  subs(t, SUBY);
};
