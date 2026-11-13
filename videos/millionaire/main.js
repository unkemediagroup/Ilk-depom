// "How Much Money Do You Really Need to Become a Millionaire?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
// Hesap: aylık $450, yıllık %7 (aylık bileşik), 40 yıl → ≈ $1.18M; yatırılan $216K.
window.DUR = 55.9;
const SUBY = 1530, CYAN = '#2ee6ff', SNOW = '#e8f4ff';
const SERIES = (() => { const r = .07 / 12, out = []; let fv = 0, c = 0; for (let m = 0; m <= 480; m++) { if (m % 12 === 0) out.push([c, fv]); fv = fv * (1 + r) + 450; c += 450; } return out; })(); // 41 yıl noktası [katkı, toplam]

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function payslip(x, y, w, rot, amt) { const h = w * 1.25; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#f4f1e8'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 8); ctx.fill(); ctx.fillStyle = C.blue; ctx.fillRect(-w / 2, -h / 2, w, h * .16); txt('PAYCHECK', 0, -h * .42, w * .12, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  ctx.fillStyle = '#ccc'; for (let i = 0; i < 4; i++) ctx.fillRect(-w * .38, -h * .2 + i * h * .1, w * .76, h * .04); txt(amt, 0, h * .32, w * .16, C.green2, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function polygraph(x, y, w, h, t, wild) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f4f1e8'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = 'rgba(255,90,100,.25)'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + i * h / 8); ctx.lineTo(w / 2, -h / 2 + i * h / 8); ctx.stroke(); }
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = ['#222', '#1d4f8f', C.red][k]; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const u = i / 120, xx = -w / 2 + u * w, tt = t * 3 - (1 - u) * 3, amp = (tt > 4.6 ? wild : .12) * h * .13; const yy = -h * .3 + k * h * .3 + Math.sin(tt * 9 + k * 2 + i * .7) * amp * (.6 + .4 * Math.sin(i * 1.3)); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  ctx.fillStyle = '#333'; ctx.fillRect(w / 2 - 6, -h / 2, 12, h); ctx.restore(); }
function slot(x, y, w, t, stop, final) { const h = w * .42; ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#b3122a'; ctx.beginPath(); ctx.roundRect(-w / 2 - 30, -h / 2 - 90, w + 60, h + 180, 40); ctx.fill(); ctx.fillStyle = C.gold; ctx.fillRect(-w / 2 - 30, -h / 2 - 90, w + 60, 60); txt('HOW MUCH?', 0, -h / 2 - 60, 46, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  const rw = w / 4; for (let i = 0; i < 4; i++) { const rx = -w / 2 + i * rw; ctx.save(); ctx.beginPath(); ctx.rect(rx + 8, -h / 2, rw - 16, h); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(rx, -h / 2, rw, h); const st = clamp(stop * 4 - i);
    if (st >= 1) txt(final[i], rx + rw / 2, 6, h * .55, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); else { const off = (t * 1400 + i * 200) % (h * .8); for (let k = -1; k < 3; k++) txt(String((Math.floor(t * 20) + k + i * 3) % 10), rx + rw / 2, -h / 2 + off + k * h * .8 - h * .2, h * .55, '#555', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); } ctx.restore(); }
  ctx.fillStyle = '#888'; ctx.fillRect(w / 2 + 40, -h / 2, 16, h * .8); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(w / 2 + 48, -h / 2 - 10, 26, 0, TAU); ctx.fill(); ctx.restore(); }
function snowball(x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const g = ctx.createRadialGradient(-r * .35, -r * .35, r * .1, 0, 0, r); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#a9c6e8'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.fillStyle = C.gold; for (let i = 0; i < 6; i++) { const a = i * 1.1, d = r * .55; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * .12, 0, TAU); ctx.fill(); } txt('$', 0, r * .03, r * .5, '#5a7ea8', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function jar(x, y, s, fill, label) { ctx.save(); ctx.translate(x, y); ctx.save(); ctx.beginPath(); ctx.roundRect(-s * .4, -s * .7, s * .8, s * .85, s * .12); ctx.clip(); const fh = s * .85 * fill; const g = ctx.createLinearGradient(0, s * .15 - fh, 0, s * .15); g.addColorStop(0, '#fff3a8'); g.addColorStop(1, C.gold2); ctx.fillStyle = g; ctx.fillRect(-s * .4, s * .15 - fh, s * .8, fh); ctx.restore();
  ctx.strokeStyle = 'rgba(200,230,255,.85)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-s * .4, -s * .7, s * .8, s * .85, s * .12); ctx.stroke(); ctx.fillStyle = '#8a97b0'; ctx.fillRect(-s * .3, -s * .8, s * .6, s * .1);
  ctx.fillStyle = 'rgba(6,9,15,.85)'; ctx.beginPath(); ctx.roundRect(-s * .3, -s * .35, s * .6, s * .2, 12); ctx.fill(); txt(label, 0, -s * .25, s * .07, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function hourglass(x, y, s, p, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#8a5a2b'; ctx.fillRect(-s * .42, -s * .62, s * .84, s * .07); ctx.fillRect(-s * .42, s * .55, s * .84, s * .07);
  const glass = () => { ctx.beginPath(); ctx.moveTo(-s * .34, -s * .55); ctx.lineTo(s * .34, -s * .55); ctx.quadraticCurveTo(s * .34, -s * .1, s * .05, 0); ctx.quadraticCurveTo(s * .34, s * .1, s * .34, s * .55); ctx.lineTo(-s * .34, s * .55); ctx.quadraticCurveTo(-s * .34, s * .1, -s * .05, 0); ctx.quadraticCurveTo(-s * .34, -s * .1, -s * .34, -s * .55); ctx.closePath(); };
  ctx.save(); glass(); ctx.clip(); ctx.fillStyle = C.gold; const top = s * .5 * (1 - p); ctx.fillRect(-s * .4, -top, s * .8, top); ctx.beginPath(); ctx.moveTo(-s * .34, s * .55); ctx.lineTo(0, s * .55 - s * .5 * p); ctx.lineTo(s * .34, s * .55); ctx.fill(); if (p < 1) ctx.fillRect(-3, 0, 6, s * .55); ctx.restore();
  glass(); ctx.strokeStyle = 'rgba(200,230,255,.85)'; ctx.lineWidth = 7; ctx.stroke(); ctx.restore(); }
function rocket(x, y, s, t, label) { ctx.save(); ctx.translate(x, y); for (let i = 0; i < 3; i++) { const k = 1 - i * .3, f = 1 + .25 * Math.sin(t * 40 + i); ctx.fillStyle = ['#ff3b1f', '#ff9d1f', '#fff3a8'][i]; ctx.beginPath(); ctx.moveTo(-s * .16 * k, s * .5); ctx.quadraticCurveTo(0, s * (.5 + .6 * k * f), s * .16 * k, s * .5); ctx.fill(); }
  ctx.fillStyle = '#e9eef5'; ctx.beginPath(); ctx.moveTo(0, -s * .6); ctx.quadraticCurveTo(s * .25, -s * .3, s * .2, s * .5); ctx.lineTo(-s * .2, s * .5); ctx.quadraticCurveTo(-s * .25, -s * .3, 0, -s * .6); ctx.fill(); ctx.fillStyle = C.red; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * s * .18, s * .2); ctx.lineTo(sd * s * .38, s * .55); ctx.lineTo(sd * s * .18, s * .5); ctx.fill(); }
  ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(0, -s * .2, s * .09, 0, TAU); ctx.fill(); txt(label, 0, s * .2, s * .13, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function zzz(x, y, t) { for (let i = 0; i < 3; i++) { const k = (t * .6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(k * Math.PI); txt('Z', x + k * 120, y - k * 200, 60 + k * 40, '#aab8ff', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); } }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–3.6 HOOK: "1 milyon dolar kazanman mı gerekiyor?" — maaş bordroları yağar
scene(0, 3.6, 'push', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 1, dot: '150,200,255' });
  const R = RN(3); for (let i = 0; i < 10; i++) { const x = R() * W, sp = 500 + R() * 600, y = ((t * sp + R() * 2000) % 2300) - 200; payslip(x, y, 170, Math.sin(t * 2 + i) * .6, '$' + (2 + Math.floor(R() * 7)) + ',000'); }
  cam({ t, shake: t < .5 ? 14 : 0, zoom: lerp(1.6, 1, eback(seg(t, 0, .5))) }, () => { ctx.fillStyle = 'rgba(6,9,15,.85)'; ctx.beginPath(); ctx.roundRect(70, 760, 940, 300, 40); ctx.fill(); txt('EARN', W / 2, 820, 60, C.mute, { align: 'center', font: 'Anton', weight: 400 }); counter(0, 1e6, W / 2, 950, 180, seg(t, .1, 1.6), { col: C.green, fmt: v => '$' + Math.round(v).toLocaleString('en-US') }); });
  kinetic(['BECOME', 'A', 'MILLIONAIRE?'], W / 2, 270, 140, t, 1.9, { hl: { 'MILLIONAIRE?': C.gold } });
  flash(t, 0, .2);
});

// 2) 3.6–7.15: kişisel finansın en büyük yalanı — yalan makinesi çıldırır
scene(3.6, 7.15, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,59,78,.16)', seed: 2, dot: '255,140,150' });
  cam({ x: d.x, y: d.y, t, shake: t > 4.6 && t < 5.4 ? 8 : 0 }, () => { polygraph(W / 2, 960, 920, 560, t, 1); txt('LIE DETECTOR', W / 2, 620, 50, C.mute, { align: 'center', font: 'Anton', weight: 400 }); });
  stampText('LIE', W / 2, 960, 260, C.red, seg(t, 4.75, 5.05), -.1);
  kinetic(['BIGGEST', 'LIE'], W / 2, 270, 180, t, 4.2, { hl: { 'LIE': C.red } });
  flash(t, 4.8, .15, '255,59,78');
});

// 3) 7.15–11.1: gerçekte ne kadar gerekli? — slot makinesi döner
scene(7.15, 11.1, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.16)', seed: 3, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => slot(W / 2 - 20, 950, 760, t, seg(t, 9.6, 10.6), ['?', '?', '?', '?']));
  kinetic(['HOW', 'MUCH', 'DO', 'YOU', 'NEED?'], W / 2, 270, 140, t, 7.4, { hl: { 'NEED?': C.gold } });
});

// 4) 11.1–17.15: sandığından çok daha az — bileşik faiz kar topu
scene(11.1, 17.15, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(160,210,255,.2)', seed: 4, dot: '200,230,255', top: '#0a1424', bot: '#02050a' });
  const p = eio(seg(t, 13.6, 16.8)), x = lerp(120, 860, p), y0 = 820, y1 = 1360, y = lerp(y0, y1, p), r = lerp(70, 240, p * p);
  cam({ t, x: -(x - W / 2) * .25 }, () => {
    { const sg = ctx.createLinearGradient(0, y0, 0, H); sg.addColorStop(0, '#5f7fa8'); sg.addColorStop(.25, '#2a3d5e'); sg.addColorStop(1, '#0c1424'); ctx.fillStyle = sg; } ctx.beginPath(); ctx.moveTo(-300, y0 + 40); ctx.lineTo(W + 300, y1 + 260); ctx.lineTo(W + 300, H); ctx.lineTo(-300, H); ctx.fill(); ctx.strokeStyle = SNOW; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-300, y0 + 40); ctx.lineTo(W + 300, y1 + 260); ctx.stroke();
    
    snowball(x, y + 40 - r + (y1 - y0) * 0 + r * .0, r, p * 14);
  });
  if (t < 13.4) { kinetic(['A', 'LOT', 'LESS'], W / 2, 270, 180, t, 11.9, { hl: { 'LESS': C.green } }); }
  else { kinetic(['COMPOUND', 'INTEREST'], W / 2, 270, 150, t, 15.4, { hl: { 'COMPOUND': SNOW } }); if (t < 15.4) kinetic(['SIMPLE', 'MATH', 'TRICK'], W / 2, 270, 150, t, 13.9, { hl: { 'MATH': C.gold } }); }
  if (t > 16.0) pill('A = P(1 + r)ᵗ', W / 2, 460, 56, SNOW, seg(t, 16.0, 16.4));
});

// 5) 17.15–25.65: 20'lerinde başla, ayda $400–500 endeks fonuna → 1 milyon çizgisini geç
scene(17.15, 25.65, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.14)', seed: 5 });
  cam({ x: d.x, y: d.y, t }, () => {
    if (t < 22.8) {
      const age = Math.round(lerp(25, 25, 0)); ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.beginPath(); ctx.roundRect(140, 470, 800, 170, 30); ctx.fill(); txt('START AT', W / 2, 520, 44, C.mute, { align: 'center', font: 'Anton', weight: 400 }); txt('AGE ' + age, W / 2, 595, 90, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: C.green });
      const jp = seg(t, 19.0, 22.8); jar(W / 2, 1320, 520, .08 + .5 * jp, 'INDEX FUND'); for (let i = 0; i < 8; i++) { const k = ((t - 19.0) * 1.4 - i * .35); if (k > 0 && k < 1) coin(W / 2 + Math.sin(i * 2.1) * 80, lerp(700, 1050, k * k), 40, t * 6 + i); }
      if (t > 19.3) pill('$400–500 / MONTH', W / 2, 760, 54, C.green, seg(t, 19.3, 19.7));
    } else {
      const p = eio(seg(t, 22.9, 24.8)), x0 = 120, x1 = 960, yT = 640, yB = 1360, mx = 1.2e6, n = SERIES.length - 1, px = i => x0 + i / n * (x1 - x0), py = v => yB - v / mx * (yB - yT);
      ctx.strokeStyle = C.gold; ctx.setLineDash([16, 12]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, py(1e6)); ctx.lineTo(x1, py(1e6)); ctx.stroke(); ctx.setLineDash([]); txt('$1,000,000', x0, py(1e6) - 34, 42, C.gold, { font: 'Anton', weight: 400 });
      lineChart(x0, yT, x1 - x0, yB - yT, SERIES.map(s => s[1]), p, { col: C.green, min: 0, max: mx, axes: false, label: v => fmtMoney(v) });
      txt('AGE 25', x0, yB + 50, 40, C.mute, { font: 'Anton', weight: 400 }); txt('AGE 65', x1, yB + 50, 40, C.mute, { align: 'right', font: 'Anton', weight: 400 });
      if (t > 24.4) { const fx = px(n * .93), fy = py(1e6); ctx.fillStyle = C.gold; ctx.fillRect(fx - 4, fy - 160, 8, 160); ctx.beginPath(); ctx.moveTo(fx + 4, fy - 160); ctx.lineTo(fx + 100 * eback(seg(t, 24.4, 24.8)), fy - 130); ctx.lineTo(fx + 4, fy - 100); ctx.fill(); }
    }
  });
  if (t < 22.8) kinetic(['START', 'IN', 'YOUR', '20s'], W / 2, 270, 150, t, 17.3, { hl: { '20s': C.green } });
  else kinetic(['CROSS', '$1M'], W / 2, 270, 180, t, 23.0, { hl: { '$1M': C.gold } });
  flash(t, 24.45, .15, '255,200,61');
});

// 6) 25.65–33.95: çılgın kısım — 1 milyonun yalnızca ~200 bini senin paran (katkı vs toplam alan grafiği)
function stackChart(t, pA, pB, hlB) { const x0 = 120, x1 = 960, yT = 600, yB = 1340, mx = 1.2e6, n = SERIES.length - 1, px = i => x0 + i / n * (x1 - x0), py = v => yB - v / mx * (yB - yT);
  const area = (k, col, p) => { const m = Math.floor(n * p); if (m < 1) return; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(px(0), yB); for (let i = 0; i <= m; i++) ctx.lineTo(px(i), py(SERIES[i][k])); ctx.lineTo(px(m), yB); ctx.closePath(); ctx.fill(); };
  area(1, `rgba(34,224,122,${.35 + .45 * hlB})`, pB); area(0, 'rgba(61,165,255,.95)', pA);
  ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, yB); ctx.lineTo(x1, yB); ctx.stroke(); return { px, py, n }; }
scene(25.65, 33.95, 'iris', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.14)', seed: 6, dot: '150,200,255' });
  cam({ x: d.x, y: d.y, t, zoom: punch(t, 31.32, .07) }, () => {
    const g = stackChart(t, eio(seg(t, 29.6, 31.2)), 1, 0); txt('TOTAL ≈ $1.18M', 960, 560, 50, C.green, { align: 'right', font: 'Anton', weight: 400 });
    if (t > 31.2) { pill('YOUR CASH ≈ $216K', W / 2, 1220, 56, C.blue, seg(t, 31.2, 31.6)); }
    txt('$450/MO · 7%/YR · 40 YEARS', W / 2, 1420, 38, C.mute, { align: 'center', weight: 900 });
  });
  if (t < 29.3) kinetic(['THE', 'CRAZY', 'PART'], W / 2, 270, 180, t, 26.0, { hl: { 'CRAZY': C.red } });
  else { txt('YOU ONLY PUT IN', W / 2, 240, 70, '#fff', { align: 'center', font: 'Anton', weight: 400 }); counter(0, 200000, W / 2, 370, 150, seg(t, 30.9, 31.8), { col: C.blue, fmt: v => '$' + Math.round(v).toLocaleString('en-US') }); }
});

// 7) 33.95–39.15: kalan ~800 bini piyasa tamamen pasif üretti (20/80 çubuk + uyuyan Z'ler)
scene(33.95, 39.15, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.2)', seed: 7 });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    const p = eo(seg(t, 34.4, 35.4)), q = eo(seg(t, 36.0, 37.0)); const x = 120, w = 840, y = 820;
    ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x, y, w, 200, 30); ctx.fill();
    ctx.fillStyle = C.blue; ctx.beginPath(); ctx.roundRect(x, y, w * .2 * p, 200, [30, 0, 0, 30]); ctx.fill(); if (p > .5) txt('YOU', x + w * .1, y + 100, 56, '#fff', { align: 'center', font: 'Anton', weight: 400 });
    if (q > 0) { ctx.fillStyle = C.green; ctx.shadowColor = C.green; ctx.shadowBlur = 40; ctx.beginPath(); ctx.roundRect(x + w * .2, y, w * .8 * q, 200, [0, 30, 30, 0]); ctx.fill(); ctx.shadowBlur = 0; txt('THE MARKET', x + w * .2 + w * .4 * q, y + 100, 64, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }
    txt('20%', x + w * .1, y - 50, 60, C.blue, { align: 'center', font: 'Anton', weight: 400 }); if (q > .5) txt('80%', x + w * .6, y - 50, 60, C.green, { align: 'center', font: 'Anton', weight: 400 });
    if (t > 36.0) counter(0, 800000, W / 2, 1200, 170, seg(t, 36.0, 37.0), { col: C.green, fmt: v => '+$' + Math.round(v).toLocaleString('en-US') });
    if (t > 37.6) { pill('PASSIVELY', W / 2, 1380, 56, '#aab8ff', seg(t, 37.6, 38.0)); zzz(W / 2 + 330, 1420, t); }
  });
  kinetic(['STOCK', 'MARKET', 'GENERATED'], W / 2, 270, 140, t, 34.2, { hl: { 'GENERATED': C.green } });
});

// 8) 39.15–42.95: milyon kazanman gerekmiyor — sadece zaman (kum saati, alt hazne altın)
scene(39.15, 42.95, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 8, dot: '255,210,120', top: '#151005', bot: '#040301' });
  cam({ t, rot: Math.sin(t * .8) * .03 }, () => { hourglass(W / 2, 960, 700, eio(seg(t, 39.3, 42.8)), t); const R = RN(5); for (let i = 0; i < 6; i++) { const k = (t * .9 + R()) % 1; coin(W / 2 + (R() - .5) * 400, 1350 - k * 30, 26, t * 5 + i); } });
  if (t < 41.2) kinetic(["DON'T", 'NEED', '$1M'], W / 2, 270, 170, t, 39.4, { hl: { '$1M': C.red } });
  else kinetic(['JUST', 'TIME'], W / 2, 270, 200, t, 41.5, { hl: { 'TIME': C.gold } });
});

// 9) 42.95–49.35: servet kurulunca kurallar değişir → büyük soru (kural tabelası ters döner)
scene(42.95, 49.35, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.18)', seed: 9, dot: '190,160,255' });
  const fl = eio(seg(t, 44.8, 45.6)), sx = Math.cos(fl * Math.PI);
  cam({ x: d.x, y: d.y, t }, () => { ctx.save(); ctx.translate(W / 2, 900); ctx.scale(Math.max(.03, Math.abs(sx)), 1); ctx.fillStyle = sx > 0 ? '#e9eef5' : C.violet; ctx.beginPath(); ctx.roundRect(-380, -300, 760, 600, 30); ctx.fill();
    const rules = sx > 0 ? ['RULE 1: EARN', 'RULE 2: SAVE', 'RULE 3: INVEST'] : ['NEW RULES', '?', '']; rules.forEach((r, i) => txt(r, 0, -160 + i * 140, i === 0 && sx < 0 ? 90 : 64, sx > 0 ? C.ink : '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 })); ctx.restore(); });
  if (t < 47.6) kinetic(['RULES', 'CHANGE'], W / 2, 270, 180, t, 44.6, { hl: { 'CHANGE': C.violet } });
  else kinetic(['BIGGER', 'QUESTION'], W / 2, 270, 170, t, 47.7, { hl: { 'BIGGER': C.gold } });
});

// 10) 49.35–51.85: zenginler neden borç kullanır? — DEBT roketi para yığınını taşır
scene(49.35, 51.85, 'whipL', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.18)', seed: 10, dot: '255,140,150' });
  const up = eio(seg(t, 50.0, 51.8)); cam({ t, shake: 4 }, () => { rocket(W / 2, lerp(1250, 820, up), 520, t, 'DEBT'); for (let i = 0; i < 10; i++) { const k = (t * 1.6 + i / 10) % 1; ctx.fillStyle = `rgba(255,255,255,${.3 * (1 - k)})`; ctx.fillRect(100 + i * 95, k * H, 4, 80); } });
  kinetic(['WHY', 'USE', 'DEBT?'], W / 2, 270, 180, t, 49.5, { hl: { 'DEBT?': C.red } });
});

// 11) 51.85–55.9: CTA
scene(51.85, 55.9, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 11, dot: '255,140,150' });
  rocket(W / 2, 720 + Math.sin(t * 3) * 20, 340, t, 'DEBT'); pill('NEXT: WHY THE WEALTHY USE DEBT', W / 2, 1010, 42, C.gold, seg(t, 52.0, 52.4));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 52.0, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 53.5, 53.9), press = seg(t, 54.1, 54.25) - seg(t, 54.25, 54.4), done = t > 54.25;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 53.6, 54.1))), lerp(1480, 1260, eo(seg(t, 53.6, 54.1))), 1, press);
    if (done) { const k = seg(t, 54.25, 55.3); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 54.25, .15);
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
