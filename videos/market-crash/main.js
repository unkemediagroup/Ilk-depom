// "Where Do Billions of Dollars Go When Stock Markets Crash?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 58.7;
const SUBY = 1530, CYAN = '#2ee6ff';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function alarmClock(x, y, s, t, ring) { ctx.save(); ctx.translate(x + (ring ? Math.sin(t * 60) * 8 : 0), y); ctx.rotate(ring ? Math.sin(t * 45) * .06 : 0); ctx.fillStyle = '#c9d2de'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * s * .32, -s * .4, s * .16, 0, TAU); ctx.fill(); } ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, s * .45, 0, TAU); ctx.fill(); ctx.fillStyle = '#f4f1e8'; ctx.beginPath(); ctx.arc(0, 0, s * .37, 0, TAU); ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = s * .03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s * .26); ctx.moveTo(0, 0); ctx.lineTo(s * .18, s * .05); ctx.stroke(); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * s * .3, s * .38); ctx.lineTo(sd * s * .38, s * .5); ctx.stroke(); }
  if (ring) { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 6; for (const sd of [-1, 1]) for (let k = 1; k <= 2; k++) { ctx.beginPath(); ctx.arc(0, 0, s * (.55 + k * .12), sd < 0 ? Math.PI * .85 : -Math.PI * .15, sd < 0 ? Math.PI * 1.15 : Math.PI * .15); ctx.stroke(); } } ctx.restore(); }
function phone(x, y, h, fn, rot = 0) { const w = h * .5; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#0d1220'; ctx.strokeStyle = '#3a4a6a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .14); ctx.fill(); ctx.stroke(); ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, w * .1); ctx.clip(); ctx.fillStyle = '#071021'; ctx.fillRect(-w / 2, -h / 2, w, h); fn && fn(w - 28, h - 28); ctx.restore(); ctx.restore(); }
function eraser(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#ff8fb1'; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .2, s * .6, s * .4, 12); ctx.fill(); ctx.fillStyle = '#3a6fd1'; ctx.beginPath(); ctx.roundRect(s * .05, -s * .2, s * .45, s * .4, 12); ctx.fill(); ctx.restore(); }
function flashlight(x, y, s, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#3a4352'; ctx.beginPath(); ctx.roundRect(-s * .6, -s * .1, s * .5, s * .2, 10); ctx.fill(); ctx.fillStyle = '#5c6779'; ctx.beginPath(); ctx.moveTo(-s * .1, -s * .1); ctx.lineTo(0, -s * .16); ctx.lineTo(0, s * .16); ctx.lineTo(-s * .1, s * .1); ctx.fill(); ctx.restore(); }
function poof(x, y, r, k) { if (k <= 0 || k >= 1) return; const R = RN(7); for (let i = 0; i < 18; i++) { const a = R() * TAU, d = r * (.3 + .7 * eo(k)) * (.5 + R() * .5); ctx.fillStyle = `rgba(200,205,220,${(1 - k) * .7})`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * .7 - k * 80, r * (.18 + .2 * R()) * (1 + k), 0, TAU); ctx.fill(); }
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, d = r * 1.2 * eo(k); ctx.fillStyle = `rgba(255,240,170,${1 - k})`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 8, 0, TAU); ctx.fill(); } }
function hologram(x, y, s, t, flick) { ctx.save(); const g = ctx.createLinearGradient(x, y + s * 1.1, x, y - s * .6); g.addColorStop(0, 'rgba(46,230,255,.35)'); g.addColorStop(1, 'rgba(46,230,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - s * .12, y + s * 1.1); ctx.lineTo(x - s * .7, y - s * .5); ctx.lineTo(x + s * .7, y - s * .5); ctx.lineTo(x + s * .12, y + s * 1.1); ctx.fill();
  ctx.fillStyle = '#2a3550'; ctx.beginPath(); ctx.ellipse(x, y + s * 1.12, s * .35, s * .08, 0, 0, TAU); ctx.fill(); const a = (.85 + .15 * Math.sin(t * 20) * flick) * (Math.sin(t * 37) > .92 && flick > .5 ? .35 : 1); ctx.globalAlpha = a; txt('$', x, y, s, CYAN, { align: 'center', font: 'Anton', weight: 400, glow: CYAN, blur: 60, stroke: 0 });
  ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let yy = y - s * .5; yy < y + s * .5; yy += 10) ctx.fillRect(x - s * .5, yy + (t * 40) % 10, s, 4); ctx.restore(); }
function house(x, y, s, col = C.blue) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s * .5, -s * .1); ctx.lineTo(0, -s * .55); ctx.lineTo(s * .5, -s * .1); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#e9eef5'; ctx.fillRect(-s * .38, -s * .12, s * .76, s * .5); ctx.fillStyle = '#2a3550'; ctx.fillRect(-s * .09, s * .1, s * .18, s * .28); ctx.fillRect(-s * .3, -s * .02, s * .14, s * .12); ctx.fillRect(s * .16, -s * .02, s * .14, s * .12); ctx.restore(); }
function tag(x, y, label, col, rot, p = 1) { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(p, p); ctx.font = '400 70px Anton'; const w = ctx.measureText(label).width + 100, h = 100; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - 34, -h / 2); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 - 34, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill(); txt(label, -12, 3, 70, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function thief(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#2a3040'; ctx.beginPath(); ctx.arc(0, -s * .32, s * .24, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, s * .2, s * .38, s * .3, 0, Math.PI, TAU); ctx.fill(); ctx.fillStyle = '#05070b'; ctx.fillRect(-s * .24, -s * .38, s * .48, s * .1); ctx.fillStyle = '#fff'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * s * .1, -s * .33, s * .035, 0, TAU); ctx.fill(); } ctx.restore(); }
function paddle(x, y, s, num, raise) { ctx.save(); ctx.translate(x, y - raise * s * .5); ctx.fillStyle = '#8a5a2b'; ctx.fillRect(-s * .04, 0, s * .08, s * .6); ctx.fillStyle = '#f4f1e8'; ctx.beginPath(); ctx.arc(0, -s * .1, s * .26, 0, TAU); ctx.fill(); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.stroke(); txt(num, 0, -s * .09, s * .2, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function sellBtn(x, y, s, press) { ctx.save(); ctx.translate(x, y); ctx.scale(1 - .1 * press, 1 - .1 * press); ctx.fillStyle = '#7a0f1c'; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .2 + 8, s, s * .4, s * .2); ctx.fill(); ctx.fillStyle = C.red; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .2 + press * 8, s, s * .4, s * .2); ctx.fill(); txt('SELL', 0, press * 8 + 2, s * .2, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function bubble(x, y, r, pop, t, label) { ctx.save(); ctx.translate(x, y); if (pop <= 0) { const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(.8, 'rgba(46,230,255,.12)'); g.addColorStop(1, 'rgba(46,230,255,.5)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * (1 + .02 * Math.sin(t * 6)), 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(160,240,255,.8)'; ctx.lineWidth = 4; ctx.stroke(); txt(label, 0, 0, r * .16, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
  else if (pop < 1) { for (let i = 0; i < 20; i++) { const a = i / 20 * TAU, d = r * (1 + pop * .8); ctx.strokeStyle = `rgba(160,240,255,${1 - pop})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(Math.cos(a) * d * .85, Math.sin(a) * d * .85); ctx.lineTo(Math.cos(a) * d, Math.sin(a) * d); ctx.stroke(); } } ctx.restore(); }
function burnPaper(x, y, w, b, t) { const h = w * 1.2; ctx.save(); ctx.translate(x, y); ctx.beginPath(); const n = 30; ctx.moveTo(-w / 2, h / 2); ctx.lineTo(w / 2, h / 2); for (let i = 0; i <= n; i++) { const xx = w / 2 - i * w / n, yy = -h / 2 + h * b + Math.sin(i * 1.7 + t * 6) * 18 * (b > 0 ? 1 : 0); ctx.lineTo(xx, Math.max(-h / 2, yy)); } ctx.closePath(); ctx.save(); ctx.clip();
  ctx.fillStyle = '#f4f1e8'; ctx.fillRect(-w / 2, -h / 2, w, h); txt('STOCK', 0, -h * .3, w * .14, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('PORTFOLIO', 0, -h * .16, w * .1, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = '#bbb'; for (let i = 0; i < 6; i++) ctx.fillRect(-w * .38, i * h * .08 - h * .03, w * .76, h * .025); ctx.restore();
  if (b > 0 && b < 1) { for (let i = 0; i <= n; i += 2) { const xx = w / 2 - i * w / n, yy = -h / 2 + h * b + Math.sin(i * 1.7 + t * 6) * 18; const f = .7 + .3 * Math.sin(t * 30 + i); ctx.fillStyle = '#ff9d1f'; ctx.beginPath(); ctx.ellipse(xx, yy - 20 * f, 14, 34 * f, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.ellipse(xx, yy - 10 * f, 7, 18 * f, 0, 0, TAU); ctx.fill(); } } ctx.restore(); }
function goldBarBig(x, y, w, t) { const h = w * .28, d = w * .32; ctx.save(); ctx.translate(x, y); ctx.shadowColor = C.gold; ctx.shadowBlur = 60; ctx.fillStyle = '#b8780a'; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 - d * .3, -h); ctx.lineTo(-w / 2 + d * .3, -h); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
  const g = ctx.createLinearGradient(-w / 2, -h - d * .5, w / 2, -h); g.addColorStop(0, '#fff1a8'); g.addColorStop(.5, C.gold); g.addColorStop(1, C.gold2); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-w / 2 + d * .3, -h); ctx.lineTo(w / 2 - d * .3, -h); ctx.lineTo(w / 2 - d * .55, -h - d * .45); ctx.lineTo(-w / 2 + d * .55, -h - d * .45); ctx.closePath(); ctx.fill();
  const sh = (t * .5) % 1.6; if (sh < 1) { ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.translate(lerp(-w, w, sh), 0); ctx.rotate(.5); ctx.fillRect(-w * .05, -w, w * .1, w * 2); ctx.restore(); } txt('GOLD', 0, -h * .45, h * .45, '#7a4f00', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–4.55 HOOK: çalar saat → telefonda SON DAKİKA: PİYASA ÇÖKTÜ
scene(0, 4.55, 'push', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.16)', seed: 1, dot: '255,140,150' });
  if (t < 1.6) cam({ t, zoom: lerp(1.3, 1, eo(seg(t, 0, .6))) }, () => alarmClock(W / 2, 900, 520, t, true));
  else { const p = eback(seg(t, 1.6, 2.1)); phone(W / 2, 960 + (1 - p) * 700, 1000, (w, h) => { ctx.fillStyle = C.red; ctx.fillRect(-w / 2, -h / 2 + 60, w, 120); txt('BREAKING', 0, -h / 2 + 120, 64, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      txt('STOCK MARKET', 0, -h / 2 + 260, 58, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('CRASHES', 0, -h / 2 + 340, 80, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0, glow: C.red });
      const cp = seg(t, 2.6, 3.9), pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; if (u > cp) break; pts.push([-w * .42 + u * w * .84, -40 + (u < .5 ? -u * 60 : -30 + Math.pow((u - .5) * 2, 1.5) * 300) + Math.sin(i * 1.9) * 12]); } ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
      if (t > 3.4) txt('-$' + Math.floor(lerp(0, 2.1e12, seg(t, 3.4, 4.5))).toLocaleString('en-US'), 0, h / 2 - 120, 44, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }, (1 - p) * .3); }
  kinetic(['WAKE', 'UP...'], W / 2, 270, 180, t, .05, { hl: { 'UP...': C.gold } });
  flash(t, 0, .2, '255,59,78'); flash(t, 3.42, .15, '255,59,78');
});

// 2) 4.55–6.7: milyarlar silinir — dev silgi
scene(4.55, 6.7, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.14)', seed: 2, dot: '255,140,150' });
  const e = eio(seg(t, 4.8, 6.4)), ex = lerp(-200, W + 200, e);
  for (let r = 0; r < 4; r++) { ctx.save(); ctx.beginPath(); ctx.rect(ex, 0, W, H); ctx.clip(); txt('$' + ['1,200,000,000', '840,000,000', '2,000,000,000', '650,000,000'][r], W / 2, 700 + r * 170, 100, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green }); ctx.restore(); }
  for (let i = 0; i < 20; i++) { const R = RN(i + 3), k = clamp((e - R() * .9) * 4); if (k > 0 && k < 1) { ctx.fillStyle = `rgba(255,143,177,${1 - k})`; ctx.fillRect(lerp(-200, W + 200, R() * .9) + k * 40, 700 + R() * 520 + k * 200, 14, 8); } }
  eraser(ex, 960 + Math.sin(t * 22) * 60, 520, .2);
  kinetic(['WIPED', 'OUT'], W / 2, 270, 190, t, 4.7, { hl: { 'WIPED': C.red } });
});

// 3) 6.7–11.55: milyarlar nereye gider? — karanlıkta el feneriyle arama
scene(6.7, 11.55, 'zoom', t => {
  ctx.fillStyle = '#020306'; ctx.fillRect(0, 0, W, H);
  const a = Math.sin(t * 1.3) * .5 - Math.PI / 2, bx = W / 2, by = 1460, ex = bx + Math.cos(a) * 1500, ey = by + Math.sin(a) * 1500;
  ctx.save(); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex + Math.cos(a + Math.PI / 2) * 380, ey + Math.sin(a + Math.PI / 2) * 380); ctx.lineTo(ex - Math.cos(a + Math.PI / 2) * 380, ey - Math.sin(a + Math.PI / 2) * 380); ctx.closePath(); ctx.clip();
  bgFinance(t, { tint: 'rgba(255,240,170,.18)', seed: 3, dot: '255,240,170' }); txt('EMPTY', 640, 760, 120, '#5c6779', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('?', 300, 600, 160, '#5c6779', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('?', 860, 1000, 160, '#5c6779', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  ctx.fillStyle = 'rgba(255,240,170,.18)'; ctx.fillRect(0, 0, W, H); ctx.restore(); flashlight(bx, by, 300, a);
  kinetic(['WHERE', 'DOES', 'IT', 'GO?'], W / 2, 270, 160, t, 7.2, { hl: { 'GO?': C.gold } });
});

// 4) 11.55–16.45: hiçbir yere — puf diye yok olur
scene(11.55, 16.45, 'whipU', t => {
  bgFinance(t, { tint: 'rgba(155,107,255,.16)', seed: 4, dot: '190,160,255' });
  const v = seg(t, 15.0, 15.6); if (v < .3) { ctx.save(); ctx.globalAlpha = 1 - v / .3; cashStack(W / 2, 1200, 520, 14); ctx.restore(); } poof(W / 2, 1050, 380, seg(t, 15.0, 16.2));
  if (t < 14.5) kinetic(['NOWHERE.'], W / 2, 270, 200, t, 13.3, { hl: { 'NOWHERE.': C.violet } });
  else kinetic(['IT', 'VANISHES'], W / 2, 270, 190, t, 14.6, { hl: { 'VANISHES': C.violet } });
  flash(t, 15.1, .12, '200,180,255');
});

// 5) 16.45–20.75: borsa serveti büyük ölçüde algılanan değerin yanılsaması — titreşen hologram $
scene(16.45, 20.75, 'iris', t => {
  bgFinance(t, { tint: 'rgba(46,230,255,.16)', seed: 5, dot: '120,230,255', top: '#04121c', bot: '#010407' });
  hologram(W / 2, 900, 520, t, seg(t, 18.4, 19.0)); if (t > 19.5) pill('PERCEIVED VALUE', W / 2, 1380, 54, CYAN, seg(t, 19.5, 19.9));
  kinetic(['AN', 'ILLUSION'], W / 2, 270, 190, t, 18.0, { hl: { 'ILLUSION': CYAN } });
});

// 6) 20.75–26.45: 500 bin dolarlık ev — piyasa çöker, kimse paranı çalmadı
scene(20.75, 26.45, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.14)', seed: 6, dot: '150,200,255' });
  const dp = eio(seg(t, 24.0, 24.9)), v = Math.round(lerp(500, 350, dp));
  cam({ x: d.x, y: d.y, t, shake: t > 24.0 && t < 24.6 ? 7 : 0 }, () => {
    house(W / 2, 1050, 560); tag(W / 2 + 230, 640, '$' + v + ',000', dp > .05 ? C.red : C.green, -.12 + Math.sin(t * 8) * .03 * dp, eback(seg(t, 21.6, 22.1)));
    if (dp > 0) arrow(W / 2 + 420, 760, 260, false, dp);
    const tp = seg(t, 25.3, 25.7); if (tp > 0) { ctx.save(); ctx.globalAlpha = tp; thief(220, 1300, 220); ctx.restore(); stampX(220, 1270, 220, seg(t, 25.6, 25.9)); pill('NO ONE STOLE IT', W / 2 + 140, 1320, 46, '#fff', seg(t, 25.7, 26.1)); }
  });
  kinetic(['$500K', 'HOUSE'], W / 2, 270, 190, t, 21.0, { hl: { '$500K': C.green } });
});

// 7) 26.45–30.75: insanlar artık o yüksek fiyatı ödemek istemiyor — açık artırma kürekleri iner
scene(26.45, 30.75, 'push', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 7, dot: '255,210,120' });
  const bids = [500, 450, 400, 350], bi = Math.min(3, Math.floor(seg(t, 27.4, 30.0) * 4));
  cam({ x: d.x, y: d.y, t }, () => {
    txt('CURRENT BID', W / 2, 520, 50, C.mute, { align: 'center', font: 'Anton', weight: 400 }); txt('$' + bids[bi] + ',000', W / 2, 650, 140, bi ? C.red : C.green, { align: 'center', font: 'Anton', weight: 400, glow: bi ? C.red : C.green });
    for (let i = 0; i < 5; i++) { const down = seg(t, 27.6 + i * .35, 28.0 + i * .35); paddle(150 + i * 195, 1240, 260, String(10 + i * 7), 1 - eio(down)); }
  });
  kinetic(['NOT', 'WILLING', 'TO', 'PAY'], W / 2, 270, 160, t, 27.3, { hl: { 'PAY': C.red } });
});

// 8) 30.75–38.95: hisseler de aynı — panik, herkes satar, algılanan değer baloncuğu patlar
scene(30.75, 38.95, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.15)', seed: 8, dot: '255,140,150' });
  const R = RN(11); const nb = Math.floor(18 * eo(seg(t, 33.4, 35.0)));
  if (t < 35.8) { for (let i = 0; i < nb; i++) { const x = 140 + (i % 4) * 265, y = 560 + Math.floor(i / 4) * 200, pr = (Math.sin(t * 8 + i * 1.7) > .3) ? 1 : 0; sellBtn(x, y, 220, pr); } if (t > 31.0 && nb < 2) bubble(W / 2, 950, 330, 0, t, 'PERCEIVED VALUE'); }
  else { bubble(W / 2, 950, 330, seg(t, 36.7, 37.2), t, 'PERCEIVED VALUE'); if (t > 37.2) { ctx.save(); ctx.globalAlpha = seg(t, 37.2, 37.6); txt('THIN AIR', W / 2, 950, 120, '#8a97b0', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); } }
  if (t < 33.3) kinetic(['STOCKS', 'TOO'], W / 2, 270, 190, t, 31.0, { hl: { 'STOCKS': C.red } });
  else if (t < 35.8) kinetic(['PANIC', 'SELLING'], W / 2, 270, 180, t, 33.5, { hl: { 'PANIC': C.red } });
  else kinetic(['POP!'], W / 2, 270, 200, t, 36.7, { hl: { 'POP!': CYAN } });
  flash(t, 36.75, .12, '160,240,255');
});

// 9) 38.95–42.45: para hiç fiziksel olarak var olmadı — kesikli hayalet $
scene(38.95, 42.45, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(155,107,255,.14)', seed: 9, dot: '190,160,255' });
  ctx.save(); ctx.setLineDash([24, 18]); ctx.lineDashOffset = -t * 60; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(200,210,230,.8)'; ctx.font = '400 760px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeText('$', W / 2, 950); ctx.restore();
  stampText('NEVER EXISTED', W / 2, 1320, 90, C.red, seg(t, 40.2, 40.5), -.06);
  kinetic(['NEVER', 'PHYSICAL'], W / 2, 270, 180, t, 39.2, { hl: { 'NEVER': C.red } });
});

// 10) 42.45–48.45: kâğıt servet saniyeler içinde yanar — zenginler kalıcı güvenli liman arar (altın)
scene(42.45, 48.45, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.15)', seed: 10, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, t }, () => { burnPaper(300, 960, 400, eio(seg(t, 43.4, 45.0)), t); txt('PAPER', 300, 1300, 60, '#8a97b0', { align: 'center', font: 'Anton', weight: 400 });
    const gp = eback(seg(t, 46.6, 47.2)); if (gp > 0) { ctx.save(); ctx.translate(780, 1100); ctx.scale(gp, gp); goldBarBig(0, 0, 380, t); ctx.restore(); txt('PERMANENT', 780, 1300, 60, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); } });
  if (t < 45.6) kinetic(['GONE', 'IN', 'SECONDS'], W / 2, 270, 170, t, 43.4, { hl: { 'SECONDS': C.red } });
  else kinetic(['SAFE', 'HAVEN'], W / 2, 270, 190, t, 46.9, { hl: { 'HAVEN': C.gold } });
});

// 11) 48.45–54.35: altın neden binlerce yıldır değerli? — zaman çizgisi boyunca yuvarlanan altın para
scene(48.45, 54.35, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.2)', seed: 11, dot: '255,210,120', top: '#151005', bot: '#040301' });
  const p = eio(seg(t, 51.3, 53.8)); ctx.strokeStyle = 'rgba(255,200,61,.5)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(100, 1100); ctx.lineTo(980, 1100); ctx.stroke();
  ['3000 BC', '0 AD', '1500', 'TODAY'].forEach((l, i) => { const x = 100 + i * 293; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(x, 1100, 14, 0, TAU); ctx.fill(); txt(l, x, 1170, 44, i === 3 ? C.gold : '#c9d2de', { align: 'center', font: 'Anton', weight: 400 }); });
  coin(lerp(100, 980, p), 1000, 80, p * 30); if (t > 49.0) qmark(W / 2, 720, 260 * eback(seg(t, 49.0, 49.5)), t, C.gold);
  if (t < 51.2) kinetic(['BIGGER', 'QUESTION'], W / 2, 270, 170, t, 49.0, { hl: { 'BIGGER': C.gold } });
  else kinetic(['WHY', 'GOLD?'], W / 2, 270, 200, t, 51.3, { hl: { 'GOLD?': C.gold } });
});

// 12) 54.35–58.7: CTA
scene(54.35, 58.7, 'push', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 12, dot: '255,140,150' });
  goldBarBig(W / 2, 860, 420, t); pill('NEXT: WHY GOLD NEVER LOSES ITS VALUE', W / 2, 1010, 38, C.gold, seg(t, 54.6, 55.0));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 54.5, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 56.2, 56.6), press = seg(t, 56.9, 57.05) - seg(t, 57.05, 57.2), done = t > 57.05;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 56.3, 56.9))), lerp(1480, 1260, eo(seg(t, 56.3, 56.9))), 1, press);
    if (done) { const k = seg(t, 57.05, 58.1); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 57.05, .15);
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
    ctx.fillStyle = `rgba(255,59,78,${.12 * a})`; ctx.fillRect(0, 0, W, H); return; }
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
