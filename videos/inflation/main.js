// "How Does Inflation Quietly Erode Your Money?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 55.5;
const SUBY = 1530, ICE = '#9fe8ff', ORANGE = '#ff9d1f';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function lockIcon(x, y, s, col, open = 0) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.arc(0, -s * .2 - open * s * .25, s * .32, Math.PI, TAU); ctx.lineTo(s * .32, -s * .05 - open * s * .25); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .1, s, s * .75, s * .12); ctx.fill(); ctx.fillStyle = C.bg0; ctx.beginPath(); ctx.arc(0, s * .22, s * .1, 0, TAU); ctx.fill(); ctx.restore(); }
function ghostHand(x, y, s, grab, t) {                    // görünmez hırsız eli: kesikli parlayan kontur
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.5); ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = 'rgba(170,190,255,.85)'; ctx.shadowColor = '#8fa8ff'; ctx.shadowBlur = 25; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(140,160,255,.08)'; ctx.beginPath(); ctx.moveTo(-s * .25, s * .9); ctx.lineTo(-s * .3, s * .1); const f = 1 - grab * .55;
  for (let i = 0; i < 4; i++) { const fx = -s * .26 + i * s * .17, fl = s * (.55 + (i === 1 || i === 2 ? .1 : 0)) * f; ctx.lineTo(fx, s * .1 - fl); ctx.arc(fx + s * .07, s * .1 - fl, s * .07, Math.PI, 0); ctx.lineTo(fx + s * .14, s * .05); }
  ctx.lineTo(s * .3, s * .1); ctx.lineTo(s * .55, -s * .15 * f); ctx.arc(s * .55 + s * .06, -s * .15 * f, s * .06, Math.PI, 0); ctx.lineTo(s * .35, s * .4); ctx.lineTo(s * .3, s * .9); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function cart(x, y, s, items, t) {                        // alışveriş arabası; items: 0..1 doluluk
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = s * .03; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const R = RN(5), goods = [[C.red, 'a'], [C.gold, 'b'], [C.green, 'a'], ['#fff', 'm'], [ORANGE, 'b'], [C.blue, 'm'], [C.violet, 'a'], [C.red, 'b'], [C.green, 'm']];
  goods.forEach(([col, k], i) => { const on = clamp(items * goods.length - i); if (on <= 0) return; const gx = -s * .32 + (i % 5) * s * .15, gy = -s * .2 - Math.floor(i / 5) * s * .16; ctx.save(); ctx.translate(gx, gy + (1 - eback(on)) * -s * .4); ctx.fillStyle = col;
    if (k === 'a') { ctx.beginPath(); ctx.arc(0, 0, s * .07, 0, TAU); ctx.fill(); } else if (k === 'b') { ctx.beginPath(); ctx.roundRect(-s * .06, -s * .1, s * .12, s * .18, 6); ctx.fill(); } else { ctx.fillRect(-s * .05, -s * .12, s * .1, s * .2); ctx.fillStyle = '#ddd'; ctx.fillRect(-s * .05, -s * .12, s * .1, s * .05); } ctx.restore(); });
  ctx.beginPath(); ctx.moveTo(-s * .6, -s * .45); ctx.lineTo(-s * .45, -s * .45); ctx.lineTo(-s * .38, -s * .1); ctx.moveTo(-s * .42, -s * .3); ctx.lineTo(s * .45, -s * .3); ctx.lineTo(s * .38, s * .08); ctx.lineTo(-s * .34, s * .08); ctx.closePath(); ctx.stroke();
  for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-s * .4 + i * s * .17, -s * .3); ctx.lineTo(-s * .38 + i * s * .15, s * .08); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-s * .34, s * .08); ctx.lineTo(-s * .3, s * .2); ctx.lineTo(s * .35, s * .2); ctx.stroke(); ctx.fillStyle = '#c9d2de'; for (const w of [-.25, .28]) { ctx.beginPath(); ctx.arc(w * s, s * .27, s * .05, 0, TAU); ctx.fill(); } ctx.restore(); }
function groceryBag(x, y, s, fill = 1) { ctx.save(); ctx.translate(x, y); const it = [[-s * .18, -s * .55, C.green, 'leaf'], [s * .12, -s * .62, '#fff', 'milk'], [-s * .02, -s * .5, C.red, 'apple'], [s * .25, -s * .48, '#d98b3a', 'bread']];
  it.forEach(([ix, iy, col, k], i) => { if (clamp(fill * 4 - i) <= 0) return; ctx.fillStyle = col; if (k === 'milk') { ctx.fillRect(ix - s * .08, iy - s * .1, s * .16, s * .3); ctx.fillStyle = C.blue; ctx.fillRect(ix - s * .08, iy, s * .16, s * .06); } else if (k === 'apple') { ctx.beginPath(); ctx.arc(ix, iy + s * .1, s * .11, 0, TAU); ctx.fill(); } else if (k === 'bread') { ctx.beginPath(); ctx.ellipse(ix, iy + s * .1, s * .14, s * .09, -.3, 0, TAU); ctx.fill(); } else { ctx.beginPath(); ctx.ellipse(ix, iy, s * .07, s * .2, -.3, 0, TAU); ctx.fill(); } });
  const g = ctx.createLinearGradient(0, -s * .4, 0, s * .4); g.addColorStop(0, '#c89a62'); g.addColorStop(1, '#9c7444'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-s * .38, -s * .38); ctx.lineTo(s * .38, -s * .38); ctx.lineTo(s * .32, s * .42); ctx.lineTo(-s * .32, s * .42); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(-s * .38, -s * .38, s * .76, s * .06); ctx.restore(); }
function priceTag(x, y, s, label, col, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `400 ${s * .4}px Anton`; const w = Math.max(s * 1.1, ctx.measureText(label).width + s * .6), h = s * .62;
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - h * .4, -h / 2); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 - h * .4, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.bg0; ctx.beginPath(); ctx.arc(w / 2 - h * .45, 0, h * .1, 0, TAU); ctx.fill(); txt(label, -h * .2, 2, s * .4, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function battery(x, y, w, lvl, label) { const h = w * .48; ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(w / 2 + 6, -h * .2, 22, h * .4);
  const col = lvl > .95 ? C.green : (lvl > .85 ? C.gold : C.red); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-w / 2 + 16, -h / 2 + 16, (w - 32) * lvl, h - 32, 12); ctx.fill(); ctx.shadowBlur = 0;
  txt(Math.round(lvl * 100) + '%', 0, 4, h * .45, '#fff', { align: 'center', font: 'Anton', weight: 400 }); if (label) txt(label, 0, h / 2 + 60, 52, C.mute, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
function iceBlock(x, y, s, melt, t) {                     // melt 0..1 — içinde donmuş $100
  const h = s * (1 - .7 * melt), w = s * (1 - .2 * melt); ctx.save(); ctx.translate(x, y);
  const pw = s * (.4 + 1.1 * melt); const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, pw); pg.addColorStop(0, 'rgba(159,232,255,.45)'); pg.addColorStop(1, 'rgba(159,232,255,0)'); ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(0, 10, pw, pw * .18, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.moveTo(-w / 2, 0); for (let i = 0; i <= 12; i++) { const xx = -w / 2 + i * w / 12; ctx.lineTo(xx, -h + Math.sin(i * 1.7 + t) * 10 * melt + (i % 2 ? 8 : 0) * melt); } ctx.lineTo(w / 2, 0); ctx.closePath(); ctx.clip();
  ctx.save(); ctx.translate(0, -s * .45); ctx.globalAlpha = .75; bill(0, 0, s * .82, -.08, { val: '100' }); ctx.restore();
  const g = ctx.createLinearGradient(-w / 2, -h, w / 2, 0); g.addColorStop(0, 'rgba(225,250,255,.65)'); g.addColorStop(.5, 'rgba(159,232,255,.38)'); g.addColorStop(1, 'rgba(90,180,230,.55)'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -s, w, s);
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-w * .35, -h * .9); ctx.lineTo(-w * .15, -h * .7); ctx.stroke(); ctx.restore();
  for (let i = 0; i < 7; i++) { const k = (t * 1.3 + i / 7) % 1, dx = -w / 2 + (i + .5) * w / 7; ctx.fillStyle = `rgba(159,232,255,${(1 - k) * melt * 1.5})`; ctx.beginPath(); ctx.ellipse(dx, k * 60 - 10, 7, 11, 0, 0, TAU); ctx.fill(); }
  ctx.restore(); }
function shareCert(x, y, w, rot, name) { const h = w * .62; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#f5ecd2'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 10); ctx.fill(); ctx.strokeStyle = '#b58b3c'; ctx.lineWidth = w * .02; ctx.strokeRect(-w * .45, -h * .42, w * .9, h * .84);
  txt('SHARE', 0, -h * .18, w * .14, '#6b4f1d', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt(name, 0, h * .1, w * .07, '#6b4f1d', { align: 'center', weight: 900, stroke: 0 }); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(w * .3, h * .24, w * .06, 0, TAU); ctx.fill(); ctx.restore(); }
function tower(x, y, w, h, t, col = C.blue) { ctx.fillStyle = '#18213a'; ctx.fillRect(x - w / 2, y - h, w, h); for (let r = 0; r < Math.floor(h / 60); r++) for (let c = 0; c < 4; c++) { const on = Math.sin(r * 3.1 + c * 1.7 + Math.floor(t * 2)) > -.2; ctx.fillStyle = on ? 'rgba(255,220,140,.75)' : '#0d1424'; ctx.fillRect(x - w / 2 + 14 + c * (w - 28) / 4, y - h + 20 + r * 60, (w - 28) / 4 - 12, 34); } ctx.fillStyle = col; ctx.fillRect(x - w / 2, y - h - 14, w, 14); }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–3.4 HOOK: banka uygulaması — "SAFE" — sonra kilit açılır
scene(0, 3.4, 'push', t => {
  bgFinance(t, { tint: 'rgba(34,224,122,.18)', seed: 1 });
  const inP = eo(seg(t, 0, .6));
  ctx.save(); ctx.translate(W / 2, 930 + (1 - inP) * 700); ctx.rotate((1 - inP) * .6 + Math.sin(t * 1.4) * .02);
  ctx.fillStyle = '#0d1220'; ctx.strokeStyle = '#3a4a6a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-300, -560, 600, 1120, 70); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#071021'; ctx.beginPath(); ctx.roundRect(-270, -530, 540, 1060, 50); ctx.fill();
  txt('MY BANK', -220, -440, 44, C.mute, { weight: 900, stroke: 0 }); txt('SAVINGS', -220, -330, 52, '#fff', { weight: 900, stroke: 0 });
  counter(0, 10000, 0, -200, 120, seg(t, .3, 1.3), { col: C.green, fmt: v => fmtMoney(v, '$', 2), maxW: 480 });
  const op = seg(t, 2.6, 3.0); lockIcon(0, 60, 150, op > 0 ? C.red : C.green, eback(op)); txt(op > 0 ? 'SAFE?' : 'SAFE ✓', 0, 270, 80, op > 0 ? C.red : C.green, { align: 'center', font: 'Anton', weight: 400, glow: op > 0 ? C.red : C.green });
  for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.beginPath(); ctx.roundRect(-230, 360 + i * 50, 460, 34, 10); ctx.fill(); }
  ctx.restore();
  kinetic(['SAVINGS', '=', 'SAFE?'], W / 2, 220, 150, t, .1, { hl: { 'SAFE?': C.green } });
  flash(t, 0, .2); flash(t, 3.0, .15, '255,59,78');
});

// 2) 3.4–8.65: görünmez hırsız her gün servetini çalıyor
scene(3.4, 8.65, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(110,130,255,.16)', seed: 2, dot: '150,170,255', top: '#080a1c', bot: '#020208' });
  const day = Math.max(1, Math.floor((t - 3.6) * 70)), steal = seg(t, 5.0, 8.4);
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    const n = Math.round(lerp(30, 10, steal)); for (let k = 0; k < 3; k++) cashStack(W / 2 - 240 + k * 240, 1330, 220, n - Math.abs(k - 1) * 4);
    for (let i = 0; i < 4; i++) { const k = ((t - 5.4) * .9 - i * .25); if (k > 0 && k < 1) { const e = eio(k); ctx.save(); ctx.globalAlpha = 1 - e * .8; bill(lerp(W / 2, 1150, e), lerp(1150, 650, e) - Math.sin(e * Math.PI) * 100, 260, e * 2); ctx.restore(); } }
    const hp = (t - 5.0) * .9 % 1; if (t > 4.8) ghostHand(lerp(1100, W / 2 + 120, Math.sin(hp * Math.PI)), lerp(900, 1130, Math.sin(hp * Math.PI)), 330, clamp(Math.sin(hp * Math.PI) * 2 - 1), t);
    ctx.save(); ctx.globalAlpha = seg(t, 6.9, 7.3); txt('DAY ' + day, W / 2, 620, 120, '#aab8ff', { align: 'center', font: 'Anton', weight: 400, glow: '#8fa8ff' }); ctx.restore();
  });
  if (t < 6.0) kinetic(['INVISIBLE', 'THIEF'], W / 2, 260, 165, t, 4.7, { hl: { 'THIEF': '#aab8ff' } });
  else kinetic(['EVERY', 'SINGLE', 'DAY'], W / 2, 260, 165, t, 7.0, { hl: { 'DAY': C.red } });
});

// 3) 8.65–12.15: INFLATION — harfler kum gibi dağılır
scene(8.65, 12.15, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,157,31,.18)', seed: 3, dot: '255,190,120', top: '#170c03', bot: '#050200' });
  const k = seg(t, 10.6, 12.1); cam({ t, zoom: 1 + .1 * seg(t, 8.65, 12.15) }, () => {
    ctx.save(); ctx.globalAlpha = 1 - k * .8; txt('INFLATION', W / 2, 880, fit('INFLATION', 240, 980, 'Anton', 400) * eback(seg(t, 9.6, 10.0)), ORANGE, { align: 'center', font: 'Anton', weight: 400, glow: ORANGE, blur: 60 }); ctx.restore();
    const R = RN(4); for (let i = 0; i < 160; i++) { const x0 = 80 + R() * 920, y0 = 780 + R() * 200, sp = .4 + R(); const q = clamp(k * 1.5 - (x0 - 80) / 920 * .5) * sp; if (q <= 0) continue; ctx.fillStyle = `rgba(255,157,31,${1 - q})`; ctx.fillRect(x0 + q * 600, y0 - q * 300 + Math.sin(t * 4 + i) * 20 * q, 9, 9); }
  });
  ctx.save(); ctx.globalAlpha = seg(t, 10.2, 10.6); txt('QUIETLY ERODES', W / 2, 1120, 90, '#fff', { align: 'center', font: 'Anton', weight: 400 }); txt('YOUR MONEY', W / 2, 1230, 90, '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore();
});

// 4) 12.15–17.75: hesabındaki para aynı kalır — alabildiğin şeyler azalır
scene(12.15, 17.75, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.12)', seed: 4 });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.strokeStyle = 'rgba(34,224,122,.6)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(140, 460, 800, 260, 36); ctx.fill(); ctx.stroke();
    txt('ACCOUNT BALANCE', W / 2, 520, 46, C.mute, { align: 'center', weight: 900, stroke: 0 }); txt('$100', W / 2, 630, 150, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green });
    if (t > 13.4) pill('STILL $100 ✓', W / 2, 760, 46, C.green, seg(t, 13.4, 13.8));
    const shrink = eio(seg(t, 15.2, 16.9)); cart(W / 2, 1200, 640, 1 - shrink * .67, t);
    if (t > 15.2) txt('WHAT IT BUYS', W / 2, 1420, 60, shrink > .3 ? C.red : '#fff', { align: 'center', font: 'Anton', weight: 400 });
  });
  if (t < 14.9) kinetic(["DOESN'T", 'TAKE', 'CASH'], W / 2, 280, 150, t, 12.3, { hl: { 'CASH': C.green } });
  else kinetic(['DESTROYS', 'WHAT', 'IT', 'BUYS'], W / 2, 280, 140, t, 15.1, { hl: { 'DESTROYS': C.red } });
});

// 5) 17.75–22.55: bugün $100 = bir torba market alışverişi
scene(17.75, 22.55, 'iris', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.15)', seed: 5, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, t }, () => {
    const bp = eback(seg(t, 18.3, 18.8)); ctx.save(); ctx.translate(290, 950); ctx.scale(bp, bp); ctx.rotate(-.12); bill(0, 0, 440, 0, { val: '100' }); ctx.restore();
    const ep = seg(t, 19.5, 19.9); if (ep > 0) txt('=', W / 2 + 10, 950, 200 * eback(ep), '#fff', { align: 'center', font: 'Anton', weight: 400 });
    const gp = eback(seg(t, 20.2, 20.7)); ctx.save(); ctx.translate(820, 1060); ctx.scale(gp, gp); groceryBag(0, 0, 400, seg(t, 20.3, 21.0)); ctx.restore();
    if (t > 21.1) priceTag(820, 760, 150, '$100', C.gold, -.12);
  });
  kinetic(['TODAY'], W / 2, 280, 200, t, 17.9, { hl: { 'TODAY': C.gold } });
  if (t > 21.6) pill('EXACTLY $100', W / 2, 1380, 60, C.gold, seg(t, 21.6, 22.0));
});

// 6) 22.55–27.55: fiyatlar artar — aynı torba gelecek yıl $110
scene(22.55, 27.55, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,59,78,.15)', seed: 6, dot: '255,140,150' });
  const pr = eio(seg(t, 25.0, 26.0)), v = Math.round(lerp(100, 110, pr));
  cam({ x: d.x, y: d.y, t, zoom: punch(t, 25.68, .08) }, () => {
    const tl = seg(t, 23.0, 24.4); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(160, 640); ctx.lineTo(160 + 760 * eo(tl), 640); ctx.stroke();
    txt('TODAY', 160, 580, 50, C.mute, { font: 'Anton', weight: 400 }); if (tl > .9) txt('NEXT YEAR', 920, 580, 50, '#fff', { align: 'right', font: 'Anton', weight: 400 });
    const mx = lerp(160, 920, eio(seg(t, 24.4, 26.4))); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(mx, 640, 22, 0, TAU); ctx.fill();
    groceryBag(W / 2, 1180, 420, 1); priceTag(W / 2 + 40, 860, 170 * (1 + .1 * pr), '$' + v, pr > .05 ? C.red : C.gold, -.1 + Math.sin(t * 8) * .03 * pr);
    if (pr > 0) arrow(W / 2 + 330, 1000, 280, true, pr, { col: C.red });
    if (t > 26.4) pill('+10%', W / 2 - 300, 860, 64, C.red, seg(t, 26.4, 26.8));
  });
  kinetic(['PRICES', 'RISE'], W / 2, 280, 180, t, 22.9, { hl: { 'RISE': C.red } });
});

// 7) 27.55–32.45: $100 değişmedi — alım gücü (pil) azaldı
scene(27.55, 32.45, 'push', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.13)', seed: 7, dot: '255,210,120' });
  const lv = lerp(1, .91, eio(seg(t, 30.6, 31.8)));
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    bill(W / 2, 700, 640, Math.sin(t * 1.2) * .03, { val: '100' }); if (t > 29.0) pill('SAME $100 BILL', W / 2, 920, 50, C.green, seg(t, 29.0, 29.4));
    battery(W / 2, 1200, 560, lv, 'BUYING POWER');
    if (lv < .97) { ctx.save(); ctx.globalAlpha = .9; for (let i = 0; i < 6; i++) { const k = (t * 1.4 + i / 6) % 1; ctx.fillStyle = C.red; ctx.fillRect(W / 2 + 290 + k * 120, 1200 - 50 + i * 18, 18, 6); } ctx.restore(); }
  });
  if (t < 30.4) kinetic(["DIDN'T", 'CHANGE'], W / 2, 280, 170, t, 28.4, { hl: { 'CHANGE': C.green } });
  else kinetic(['LOST', 'ITS', 'POWER'], W / 2, 280, 170, t, 30.5, { hl: { 'POWER': C.red } });
});

// 8) 32.45–36.65: hiç harcamadan fakirleşmek — nominal düz, reel değer düşüyor
scene(32.45, 36.65, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,59,78,.13)', seed: 8, dot: '255,140,150' });
  const p = eio(seg(t, 32.8, 35.6)), x0 = 120, x1 = 960, y0 = 640, yb = 1300;
  cam({ x: d.x, y: d.y, t }, () => {
    ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 2; for (let k = 0; k <= 4; k++) { ctx.beginPath(); ctx.moveTo(x0, y0 + k * (yb - y0) / 4); ctx.lineTo(x1, y0 + k * (yb - y0) / 4); ctx.stroke(); }
    const nom = [], real = []; for (let i = 0; i <= 10; i++) { nom.push(10000); real.push(10000 / Math.pow(1.04, i)); }
    lineChart(x0, y0, x1 - x0, yb - y0, nom, p, { col: C.green, min: 6000, max: 10500, axes: false, fill: false, lw: 8 });
    lineChart(x0, y0, x1 - x0, yb - y0, real, p, { col: C.red, min: 6000, max: 10500, axes: false, lw: 10, label: v => fmtMoney(v) });
    txt('YOUR BALANCE', x0, y0 - 40, 42, C.green, { weight: 900 }); if (p > .5) txt('WHAT IT\'S WORTH', x0, yb + 50, 42, C.red, { weight: 900 });
    txt('10 YEARS · 4% INFLATION', W / 2, yb + 130, 40, C.mute, { align: 'center', weight: 900 });
  });
  kinetic(['GETTING', 'POORER'], W / 2, 280, 170, t, 32.7, { hl: { 'POORER': C.red } });
  if (t > 34.6) pill('$0 SPENT', W / 2, 470, 56, '#fff', seg(t, 34.6, 35.0));
});

// 9) 36.65–40.7: nakit güvenli liman değil — eriyen buz kalıbı
scene(36.65, 40.7, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(159,232,255,.18)', seed: 9, dot: '160,230,255', top: '#06141c', bot: '#020609' });
  cam({ t, zoom: 1 + .08 * seg(t, 36.65, 40.7) }, () => iceBlock(W / 2, 1300, 640, eio(seg(t, 38.6, 40.6)), t));
  if (t < 38.4) { kinetic(['NOT', 'A', 'SAFE', 'HAVEN'], W / 2, 280, 150, t, 36.8, { hl: { 'NOT': C.red } }); }
  else kinetic(['MELTING', 'ICE'], W / 2, 280, 180, t, 38.7, { hl: { 'ICE': ICE } });
});

// 10) 40.7–44.35: zenginler nakit tutmaz — portföy pastası
scene(40.7, 44.35, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 10, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    const p = seg(t, 41.0, 42.4); donut(W / 2, 900, 360, [{ v: 40, col: C.blue, label: 'STOCKS' }, { v: 30, col: C.violet, label: 'BUSINESS' }, { v: 25, col: C.gold, label: 'PROPERTY' }, { v: 5, col: '#4b5566', label: '' }], p, { labels: true, hole: .42 });
    if (p >= 1) { txt('WEALTHY', W / 2, 880, 64, '#fff', { align: 'center', font: 'Anton', weight: 400 }); txt('PORTFOLIO', W / 2, 950, 40, C.mute, { align: 'center', font: 'Anton', weight: 400 }); }
    if (t > 42.8) { pill('CASH: TINY', W / 2 - 230, 520, 50, '#8a97b0', seg(t, 42.8, 43.2)); }
  });
  kinetic(['NEVER', 'HOLD', 'CASH'], W / 2, 280, 170, t, 41.0, { hl: { 'NEVER': C.red } });
});

// 11) 44.35–51.55: daha büyük soru — milyarderler neden hisse alır?
scene(44.35, 51.55, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 11, dot: '150,200,255' });
  cam({ x: d.x, y: d.y, t }, () => {
    if (t < 47.0) { qmark(W / 2, 900, 700 * eback(seg(t, 44.5, 45.1)), t, C.blue); }
    else {
      tower(W / 2, 1380, 420, 760, t); const R = RN(3);
      const sp = seg(t, 48.0, 49.2); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .3, q = eback(clamp(sp * 1.6 - i * .08)); if (q > 0) shareCert(W / 2 + Math.cos(a) * 400 * q, 980 + Math.sin(a) * 330 * q, 210, Math.sin(t + i) * .2, 'CO. #' + (i + 1)); }
      if (t > 49.6) { const cs = []; let pr = 100; const R2 = RN(17); for (let i = 0; i < 16; i++) { const o = pr, c = o + (R2() - .35) * 10; cs.push({ o, c, h: Math.max(o, c) + R2() * 4, l: Math.min(o, c) - R2() * 4 }); pr = c; } ctx.fillStyle = 'rgba(6,9,15,.75)'; ctx.fillRect(80, 470, 920, 300); candles(110, 490, 860, 260, cs, seg(t, 49.6, 51.2)); }
    }
  });
  if (t < 47.0) kinetic(['A', 'MUCH', 'BIGGER', 'QUESTION'], W / 2, 280, 130, t, 45.2, { hl: { 'BIGGER': C.gold } });
  else kinetic(['WHY', 'BUY', 'SHARES?'], W / 2, 280, 170, t, 47.1, { hl: { 'SHARES?': C.blue } });
});

// 12) 51.55–55.5: CTA
scene(51.55, 55.5, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 12, dot: '255,140,150' });
  shareCert(W / 2, 760, 520, Math.sin(t * 1.5) * .06, 'NEXT VIDEO');
  pill('NEXT: WHY BILLIONAIRES BUY SHARES', W / 2, 1010, 40, C.gold, seg(t, 51.8, 52.2));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 290, 150, t, 51.7, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 53.2, 53.6), press = seg(t, 53.9, 54.05) - seg(t, 54.05, 54.2), done = t > 54.05;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 53.3, 53.9))), lerp(1480, 1260, eo(seg(t, 53.3, 53.9))), 1, press);
    if (done) { const k = seg(t, 54.05, 55.1); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 54.05, .15);
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
    ctx.fillStyle = `rgba(143,168,255,${.15 * a})`; ctx.fillRect(0, 0, W, H); return; }
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
