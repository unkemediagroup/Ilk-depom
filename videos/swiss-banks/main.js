// "Why Are Swiss Banks So Famous?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 46.7;
const SUBY = 1530, SW = '#e3242b', SEPIA = '#e9dcc0';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function avatar(x, y, s, col = '#8a97b0') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .32, s * .22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, s * .2, s * .38, s * .3, 0, Math.PI, TAU); ctx.fill(); ctx.restore(); }
function swissFlag(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = SW; ctx.shadowColor = SW; ctx.shadowBlur = 50; ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * .06); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.fillRect(-s * .1, -s * .32, s * .2, s * .64); ctx.fillRect(-s * .32, -s * .1, s * .64, s * .2); ctx.restore(); }
function lips(x, y, s, shut, finger) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#e8b48a'; ctx.beginPath(); ctx.ellipse(0, 0, s * .75, s * .6, 0, 0, TAU); ctx.fill(); const op = 1 - shut;
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.moveTo(-s * .4, 0); ctx.quadraticCurveTo(-s * .2, -s * .18, 0, -s * .1); ctx.quadraticCurveTo(s * .2, -s * .18, s * .4, 0); ctx.quadraticCurveTo(0, s * (.1 + .25 * op), -s * .4, 0); ctx.fill(); if (op > .1) { ctx.fillStyle = '#300'; ctx.beginPath(); ctx.ellipse(0, s * .03, s * .3, s * .1 * op, 0, 0, TAU); ctx.fill(); }
  if (finger > 0) { ctx.save(); ctx.translate(0, (1 - finger) * s); ctx.fillStyle = '#d9a379'; ctx.beginPath(); ctx.roundRect(-s * .07, -s * .45, s * .14, s * .9, s * .07); ctx.fill(); ctx.fillStyle = '#f2d1b8'; ctx.beginPath(); ctx.ellipse(0, -s * .38, s * .05, s * .05, 0, 0, TAU); ctx.fill(); ctx.restore(); } ctx.restore(); }
function tablet(x, y, w, h, p) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#6c7586'; ctx.beginPath(); ctx.moveTo(-w / 2, h / 2); ctx.lineTo(-w / 2, -h * .3); ctx.quadraticCurveTo(-w / 2, -h / 2, -w * .3, -h / 2); ctx.lineTo(w * .3, -h / 2); ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h * .3); ctx.lineTo(w / 2, h / 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#4b5466'; ctx.lineWidth = 8; ctx.stroke(); txt('RULE #1', 0, -h * .28, w * .12, '#dfe5ee', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); if (p > 0) { const s = 'TOTAL SECRECY', n = Math.ceil(s.length * p); txt(s.slice(0, n), 0, h * .08, w * .1, '#fff', { align: 'center', font: 'Anton', weight: 400, strokeCol: '#2a3040', glow: C.gold, blur: 20 * p }); } ctx.restore(); }
function redact(x, y, w, rows, p) { ctx.fillStyle = '#f4f1e8'; ctx.fillRect(x - w / 2, y, w, rows * 70 + 60); for (let i = 0; i < rows; i++) { const lw = w * (.85 - (i % 3) * .15); ctx.fillStyle = '#bbb'; ctx.fillRect(x - w / 2 + 30, y + 40 + i * 70, lw - 60, 16); const k = clamp(p * rows - i); if (k > 0) { ctx.fillStyle = '#05070b'; ctx.fillRect(x - w / 2 + 24, y + 28 + i * 70, (lw - 48) * eo(k), 40); } } }
function newspaper(x, y, w, rot, p) { const h = w * 1.25; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(p, p); ctx.fillStyle = SEPIA; ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.fill(); txt('THE DAILY LEDGER', 0, -h * .42, w * .07, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = '#3a2a10'; ctx.fillRect(-w * .45, -h * .37, w * .9, 4);
  txt('1934', 0, -h * .27, w * .16, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('NEW SECRECY LAW', 0, -h * .14, w * .085, '#7a1020', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = 'rgba(58,42,16,.35)'; for (let c = 0; c < 2; c++) for (let i = 0; i < 9; i++) ctx.fillRect(-w * .44 + c * w * .46, -h * .04 + i * h * .05, w * .42, h * .02); ctx.restore(); }
function handcuffs(x, y, s, close) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = s * .08; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * s * .45, 0, s * .3, sd < 0 ? -.3 - close * 1.2 : Math.PI + .3 + close * 1.2, sd < 0 ? TAU - .3 : Math.PI - .3 + TAU, false); ctx.stroke(); } ctx.lineWidth = s * .05; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(-s * .12 + i * s * .12, -s * .02, s * .07, s * .04, 0, 0, TAU); ctx.stroke(); } ctx.restore(); }
function acctCard(x, y, w, t, p, np) { const h = w * .6; ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#10141f'; ctx.strokeStyle = C.gold; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 30); ctx.fill(); ctx.stroke(); swissFlag(-w * .36, -h * .3, w * .1);
  txt('PRIVATE ACCOUNT', -w * .26, -h * .3, w * .055, C.gold, { font: 'Anton', weight: 400, stroke: 0 }); txt('NAME:', -w * .42, -h * .05, w * .05, C.mute, { weight: 900, stroke: 0 }); txt('JOHN SMITH', -w * .2, -h * .05, w * .06, '#fff', { weight: 900, stroke: 0 }); ctx.fillStyle = '#000'; ctx.fillRect(-w * .22, -h * .13, w * .62 * eo(np), h * .16); if (np > .9) txt('CLASSIFIED', w * .09, -h * .05, w * .05, SW, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  txt('NO.', -w * .42, h * .22, w * .05, C.mute, { weight: 900, stroke: 0 }); const digits = '7 4 0 9 2 8 1'; const n = Math.ceil(digits.length * p); txt(digits.slice(0, n).split('').map((c, i) => c === ' ' ? ' ' : (i < n - 1 || p >= 1 ? c : String(Math.floor(t * 30) % 10))).join(''), -w * .2, h * .22, w * .1, '#fff', { font: 'Anton', weight: 400, stroke: 0, glow: C.gold, blur: 20 }); ctx.restore(); }
function lighthouse(x, y, s, t) { ctx.save(); ctx.translate(x, y); const a = t * 1.2, bx = Math.cos(a); ctx.fillStyle = `rgba(255,240,170,${.22 + .1 * Math.abs(bx)})`; ctx.beginPath(); ctx.moveTo(0, -s * 1.05); ctx.lineTo(bx * s * 3, -s * 1.35); ctx.lineTo(bx * s * 3, -s * .75); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#fff' : SW; ctx.beginPath(); const y0 = -i * s * .22, w0 = s * (.22 - i * .025), w1 = s * (.22 - (i + 1) * .025); ctx.moveTo(-w0, y0); ctx.lineTo(w0, y0); ctx.lineTo(w1, y0 - s * .22); ctx.lineTo(-w1, y0 - s * .22); ctx.fill(); }
  ctx.fillStyle = '#2a3550'; ctx.fillRect(-s * .14, -s * 1.12, s * .28, s * .2); ctx.fillStyle = '#fff3a8'; ctx.fillRect(-s * .1, -s * 1.1, s * .2, s * .14); ctx.fillStyle = SW; ctx.beginPath(); ctx.moveTo(-s * .16, -s * 1.12); ctx.lineTo(0, -s * 1.25); ctx.lineTo(s * .16, -s * 1.12); ctx.fill(); ctx.restore(); }
function boat(x, y, s, t, label, icon) { ctx.save(); ctx.translate(x, y + Math.sin(t * 2 + x) * 6); ctx.rotate(Math.sin(t * 1.7 + x) * .05); ctx.fillStyle = '#e9eef5'; ctx.beginPath(); ctx.moveTo(-s * .5, 0); ctx.lineTo(s * .5, 0); ctx.lineTo(s * .35, s * .2); ctx.lineTo(-s * .35, s * .2); ctx.fill(); ctx.fillStyle = '#8a5a2b'; ctx.fillRect(-3, -s * .6, 6, s * .6); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(3, -s * .58); ctx.lineTo(s * .4, -s * .1); ctx.lineTo(3, -s * .1); ctx.fill();
  icon && icon(-s * .2, -s * .25, s * .3); txt(label, 0, s * .4, s * .16, '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
function crownS(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(-s * .5, s * .2); ctx.lineTo(-s * .55, -s * .35); ctx.lineTo(-s * .25, -s * .05); ctx.lineTo(0, -s * .5); ctx.lineTo(s * .25, -s * .05); ctx.lineTo(s * .55, -s * .35); ctx.lineTo(s * .5, s * .2); ctx.closePath(); ctx.fill(); ctx.restore(); }
function umbrella(x, y, r, open, col = SW) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, r * .9); ctx.arc(-r * .1, r * .9, r * .1, 0, Math.PI); ctx.stroke(); const w = r * open; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-w, 0); ctx.quadraticCurveTo(-w, -r * .8 * open, 0, -r * .85 * open); ctx.quadraticCurveTo(w, -r * .8 * open, w, 0);
  for (let i = 3; i >= -3; i--) ctx.quadraticCurveTo(i * w / 3 + w / 6, -r * .12, i * w / 3, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-r * .05, -r * .5 * open, r * .1, r * .3 * open); ctx.fillRect(-r * .15, -r * .4 * open, r * .3, r * .1 * open); ctx.restore(); }
function cloud(x, y, s, label, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#3a4352'; [[-s * .3, 0, s * .3], [0, -s * .15, s * .38], [s * .32, 0, s * .28]].forEach(([a, b, r]) => { ctx.beginPath(); ctx.arc(a, b, r, 0, TAU); ctx.fill(); }); ctx.fillRect(-s * .6, 0, s * 1.2, s * .28); txt(label, 0, s * .06, s * .2, col, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function zipMouth(x, y, s, z) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#e8b48a'; ctx.beginPath(); ctx.ellipse(0, 0, s * .75, s * .55, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.ellipse(0, 0, s * .45, s * .14, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = s * .03; const zx = lerp(-s * .45, s * .45, z); for (let i = 0; i < 18; i++) { const xx = -s * .43 + i * s * .05; if (xx > zx) break; ctx.beginPath(); ctx.moveTo(xx, -s * .04); ctx.lineTo(xx + s * .025, s * .04); ctx.stroke(); } ctx.fillStyle = '#dfe5ee'; ctx.beginPath(); ctx.roundRect(zx - s * .04, -s * .05, s * .08, s * .22, 6); ctx.fill(); ctx.restore(); }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–3.1 HOOK: İsviçre bayrağı döner ve çarpar, etrafında altın
scene(0, 3.1, 'push', t => {
  bgFinance(t, { tint: 'rgba(227,36,43,.22)', seed: 1, dot: '255,140,150' });
  const p = eback(seg(t, 0, .5)); cam({ t, shake: t < .5 ? 12 : 0, zoom: punch(t, .45, .1) }, () => { swissFlag(W / 2, 900, 520 * p, (1 - p) * 3);
    const R = RN(2); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .5, r = 420 + Math.sin(t * 2 + i) * 30; coin(W / 2 + Math.cos(a) * r, 900 + Math.sin(a) * r * .9, 34, t * 6 + i); } });
  kinetic(['SWISS', 'BANKS'], W / 2, 270, 200, t, .05, { hl: { 'SWISS': SW } });
  if (t > 1.6) pill('SO FAMOUS?', W / 2, 1390, 64, C.gold, seg(t, 1.6, 2.0));
  flash(t, 0, .2, '227,36,43');
});

// 2) 3.1–8.3: tek mutlak kural — taş tablet + "şşş"
scene(3.1, 8.3, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 2, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => { if (t < 6.6) tablet(W / 2, 960, 700, 820, seg(t, 5.0, 6.4)); else { lips(W / 2, 960, 520, eio(seg(t, 6.7, 7.1)), eback(seg(t, 6.8, 7.3))); txt('SHHH...', W / 2, 1360, 90, '#fff', { align: 'center', font: 'Anton', weight: 400 }); } });
  if (t < 6.6) kinetic(['ONE', 'ABSOLUTE', 'RULE'], W / 2, 270, 150, t, 3.6, { hl: { 'RULE': C.gold } });
  else kinetic(['TOTAL', 'SECRECY'], W / 2, 270, 180, t, 6.8, { hl: { 'SECRECY': SW } });
});

// 3) 8.3–15.95: 1934 yasası — sırrı ifşa eden bankacıya suç (gazete + kelepçe)
scene(8.3, 15.95, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(233,220,192,.12)', seed: 3, dot: '230,210,170', top: '#17130c', bot: '#050403' });
  cam({ x: d.x, y: d.y, t }, () => {
    if (t < 11.9) { newspaper(W / 2, 980, 760, -.06 + Math.sin(t) * .02, eback(seg(t, 8.4, 9.0)) * (1 + .15 * seg(t, 9.0, 11.9))); }
    else { avatar(W / 2 - 150, 1180, 360, '#5c6779'); ctx.save(); ctx.globalAlpha = seg(t, 12.3, 12.6); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(W / 2 - 40, 620, 460, 200, 40); ctx.fill(); ctx.beginPath(); ctx.moveTo(W / 2 + 20, 810); ctx.lineTo(W / 2 - 40, 900); ctx.lineTo(W / 2 + 90, 815); ctx.fill(); txt('CLIENT: J. SM...', W / 2 + 190, 720, 46, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); stampX(W / 2 + 190, 720, 200, seg(t, 13.7, 14.0));
      handcuffs(W / 2 + 220, 1200, 260, eio(seg(t, 14.2, 14.7))); if (t > 12.4) stampText('CRIMINAL OFFENSE', W / 2, 1380, 70, SW, seg(t, 12.4, 12.7), -.05); }
  });
  if (t < 11.9) kinetic(['STRICT', 'LAW'], W / 2, 270, 190, t, 10.2, { hl: { 'LAW': SEPIA } });
  else kinetic(['NEVER', 'REVEAL'], W / 2, 270, 180, t, 13.8, { hl: { 'REVEAL': SW } });
});

// 4) 15.95–22.35: tamamen anonim hesap — isim değil sadece numara
scene(15.95, 22.35, 'zoom', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.16)', seed: 4, dot: '255,210,120', top: '#14100a', bot: '#040302' });
  cam({ x: d.x, y: d.y, rot: d.rot, t, zoom: punch(t, 20.46, .07) }, () => acctCard(W / 2, 960, 900, t, seg(t, 19.6, 20.9), seg(t, 21.3, 21.8)));
  if (t < 19.4) kinetic(['ANONYMOUS', 'ACCOUNT'], W / 2, 270, 150, t, 17.8, { hl: { 'ANONYMOUS': C.gold } });
  else kinetic(['NUMBER,', 'NOT', 'NAME'], W / 2, 270, 170, t, 20.4, { hl: { 'NUMBER,': C.gold } });
});

// 5) 22.35–31.95: güvenli liman — deniz feneri, gelen tekneler; vergi/dava/hükümet bulutları şemsiyeye çarpar
scene(22.35, 31.95, 'iris', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.14)', seed: 5, dot: '150,200,255', top: '#08142a', bot: '#020509' });
  if (t < 28.5) {
    const g = ctx.createLinearGradient(0, 1250, 0, H); g.addColorStop(0, '#1d4f8f'); g.addColorStop(1, '#06162e'); ctx.fillStyle = g; ctx.fillRect(0, 1250, W, H); lighthouse(880, 1260, 520, t);
    const bt = [[24.72, 'BILLIONAIRES', (x, y, s) => { txt('$', x, y, s, C.green, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }], [25.72, 'ROYALS', (x, y, s) => crownS(x, y, s)], [26.36, 'POLITICIANS', (x, y, s) => { ctx.fillStyle = '#8a5a2b'; ctx.fillRect(x - s * .3, y - s * .2, s * .6, s * .5); }]];
    bt.forEach(([tt, lab, ic], i) => { const k = eo(seg(t, tt - .5, tt + 1.4)); if (k <= 0) return; boat(lerp(-300, 150 + i * 240, k), 1240 - i * 10, 270, t, lab, ic); });
    txt('SAFE HAVEN', 880, 520, 70, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold });
    kinetic(['SAFE', 'HAVEN'], W / 2, 270, 190, t, 23.4, { hl: { 'HAVEN': C.gold } });
  } else {
    const R = RN(9); for (let i = 0; i < 60; i++) { const x = R() * W, k = (t * 1.8 + R()) % 1; ctx.strokeStyle = 'rgba(160,190,230,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 600 + k * 500); ctx.lineTo(x - 10, 640 + k * 500); ctx.stroke(); }
    [[29.0, 'TAXES', 220, 560], [30.0, 'LAWSUITS', 560, 500], [30.8, 'GOVERNMENTS', 880, 580]].forEach(([tt, lab, x, y]) => { const a = eback(seg(t, tt - .2, tt + .25)); if (a > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(a, a); cloud(0, 0, 300, lab, '#ff8a95'); ctx.restore(); } });
    umbrella(W / 2, 1080, 440, eback(seg(t, 28.6, 29.0))); for (let i = 0; i < 5; i++) { const xx = W / 2 - 300 + i * 150; ctx.fillStyle = C.gold; ctx.fillRect(xx - 60, 1330 - (i % 2) * 40, 120, 40 + (i % 2) * 40); }
    txt('HIDDEN WEALTH', W / 2, 1420, 54, C.gold, { align: 'center', font: 'Anton', weight: 400 });
    kinetic(['HIDE', 'FROM'], W / 2, 270, 190, t, 28.6, { hl: { 'HIDE': SW } });
  }
});

// 6) 31.95–36.85: sadece ağızlarını kapalı tutarak efsanevi imparatorluk — fermuar + yükselen altın kule
scene(31.95, 36.85, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 6, dot: '255,210,120', top: '#151005', bot: '#040301' });
  cam({ x: d.x, y: d.y, t }, () => {
    const g = eo(seg(t, 32.4, 34.4)); for (let i = 0; i < 5; i++) { const h = [380, 560, 760, 520, 340][i] * g; ctx.fillStyle = C.gold2; ctx.fillRect(130 + i * 170, 1400 - h, 140, h); ctx.fillStyle = 'rgba(255,240,170,.5)'; for (let r = 0; r < h / 60; r++) ctx.fillRect(150 + i * 170, 1380 - h + 30 + r * 60 - 30 + 30, 100, 20); }
    zipMouth(W / 2, 720, 380, eio(seg(t, 35.0, 35.9)));
  });
  if (t < 34.6) kinetic(['LEGENDARY', 'EMPIRE'], W / 2, 270, 150, t, 32.3, { hl: { 'EMPIRE': C.gold } });
  else kinetic(['MOUTHS', 'SHUT'], W / 2, 270, 190, t, 35.0, { hl: { 'SHUT': SW } });
});

// 7) 36.85–42.65: daha büyük soru — dünyanın en zengin ülkeleri parayı nasıl kazanır? (gizemli sıralama)
scene(36.85, 42.65, 'zoom', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.15)', seed: 7 });
  cam({ x: d.x, y: d.y, t }, () => {
    const vals = [1, .86, .74, .63, .55]; vals.forEach((v, i) => { const y = 600 + i * 160, p = eo(clamp(seg(t, 39.6, 41.4) * 1.6 - i * .12)); txt('#' + (i + 1), 140, y + 50, 64, i ? '#fff' : C.gold, { align: 'center', font: 'Anton', weight: 400 });
      ctx.fillStyle = '#3a4352'; ctx.beginPath(); ctx.arc(250, y + 50, 46, 0, TAU); ctx.fill(); txt('?', 250, y + 52, 60, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      ctx.fillStyle = i ? C.green : C.gold; ctx.beginPath(); ctx.roundRect(320, y + 20, Math.max(1, 640 * v * p), 60, 30); ctx.fill(); });
  });
  if (t < 39.5) kinetic(['BIGGER', 'QUESTION'], W / 2, 270, 170, t, 37.2, { hl: { 'BIGGER': C.gold } });
  else kinetic(['RICHEST', 'COUNTRIES'], W / 2, 270, 160, t, 39.7, { hl: { 'RICHEST': C.green } });
});

// 8) 42.65–46.7: CTA
scene(42.65, 46.7, 'iris', t => {
  bgFinance(t, { tint: 'rgba(227,36,43,.2)', seed: 8, dot: '255,140,150' });
  ctx.save(); ctx.translate(W / 2, 740); const R = RN(3); for (let i = 0; i < 3; i++) { ctx.fillStyle = C.gold; ctx.beginPath(); ctx.roundRect(-200 + i * 140 - 50, 120 - [120, 200, 160][i], 100, [120, 200, 160][i], 10); ctx.fill(); } txt('?', 0, -80, 200, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); ctx.restore();
  pill('NEXT: HOW THE RICHEST COUNTRIES MAKE MONEY', W / 2, 1010, 36, C.gold, seg(t, 42.9, 43.3));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 42.8, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 44.3, 44.7), press = seg(t, 45.0, 45.15) - seg(t, 45.15, 45.3), done = t > 45.15;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 44.4, 45.0))), lerp(1480, 1260, eo(seg(t, 44.4, 45.0))), 1, press);
    if (done) { const k = seg(t, 45.15, 46.2); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 45.15, .15);
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
    ctx.fillStyle = `rgba(227,36,43,${.12 * a})`; ctx.fillRect(0, 0, W, H); return; }
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
