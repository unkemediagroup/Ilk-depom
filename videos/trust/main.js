// "How Do the World's Wealthiest Families Protect Their Fortunes?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 59.5;
const SUBY = 1530, CYAN = '#2ee6ff', TEAL = '#28e0c0';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function avatar(x, y, s, col = '#8a97b0') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .32, s * .22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, s * .2, s * .38, s * .3, 0, Math.PI, TAU); ctx.fill(); ctx.restore(); }
function panel(x, y, w, h, col, fn) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(13,20,36,.92)'; ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 34); ctx.fill(); ctx.stroke(); fn && fn(w, h); ctx.restore(); }
function mansion(x, y, s, col = C.gold) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#e9eef5'; ctx.fillRect(-s * .5, -s * .35, s, s * .45); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s * .58, -s * .33); ctx.lineTo(0, -s * .62); ctx.lineTo(s * .58, -s * .33); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a3550'; for (let i = 0; i < 4; i++) { ctx.fillRect(-s * .42 + i * s * .24, -s * .25, s * .12, s * .14); } ctx.fillStyle = col; ctx.fillRect(-s * .08, -s * .06, s * .16, s * .16); ctx.fillStyle = '#c9d2de'; ctx.fillRect(-s * .55, s * .1, s * 1.1, s * .05); ctx.restore(); }
function bizTower(x, y, s, col = C.blue) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#18213a'; ctx.fillRect(-s * .22, -s * .7, s * .44, s * .8); ctx.fillStyle = col; ctx.fillRect(-s * .22, -s * .74, s * .44, s * .05); for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = 'rgba(255,220,140,.75)'; ctx.fillRect(-s * .17 + c * s * .13, -s * .62 + r * s * .11, s * .08, s * .06); } ctx.restore(); }
function invChart(x, y, s, col = C.green) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#0d1424'; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-s * .45, -s * .55, s * .9, s * .65, 18); ctx.fill(); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = s * .04; ctx.lineJoin = 'round'; ctx.beginPath(); [[-.35, -.05], [-.18, -.18], [-.05, -.12], [.12, -.32], [.33, -.42]].forEach(([a, b], i) => i ? ctx.lineTo(a * s, b * s) : ctx.moveTo(a * s, b * s)); ctx.stroke(); ctx.restore(); }
function briefcase(x, y, s, open) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#3a2a1a'; ctx.strokeStyle = '#7a5a30'; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.roundRect(-s * .18, -s * .44, s * .36, s * .12, 14); ctx.stroke();
  if (open > 0) { const g = ctx.createRadialGradient(0, -s * .3, 0, 0, -s * .3, s * 1.1 * open); g.addColorStop(0, `rgba(40,224,192,${.6 * open})`); g.addColorStop(1, 'rgba(40,224,192,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-s * .5, -s * .3); ctx.lineTo(-s * 1.1, -s * 1.5); ctx.lineTo(s * 1.1, -s * 1.5); ctx.lineTo(s * .5, -s * .3); ctx.fill(); }
  ctx.fillStyle = '#5a3e22'; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .32, s, s * .62, 24); ctx.fill(); ctx.save(); ctx.translate(0, -s * .32); ctx.scale(1, Math.max(-1, 1 - 2 * open)); ctx.fillStyle = '#6b4a2b'; ctx.beginPath(); ctx.roundRect(-s * .5, 0, s, s * .2, 18); ctx.fill(); ctx.restore();
  ctx.fillStyle = C.gold; ctx.fillRect(-s * .08, -s * .26, s * .16, s * .1); ctx.restore(); }
function trustDoc(x, y, w, rot = 0, p = 1) { const h = w * 1.3; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(p, p); ctx.fillStyle = '#f5ecd2'; ctx.shadowColor = TEAL; ctx.shadowBlur = 40; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 12); ctx.fill(); ctx.shadowBlur = 0;
  txt('TRUST', 0, -h * .32, w * .2, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = 'rgba(60,40,10,.35)'; for (let i = 0; i < 6; i++) ctx.fillRect(-w * .36, -h * .12 + i * h * .07, w * (.72 - (i % 3) * .12), h * .025);
  ctx.fillStyle = '#b3122a'; ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = w * (i % 2 ? .1 : .12); ctx.lineTo(w * .25 + Math.cos(a) * r, h * .36 + Math.sin(a) * r); } ctx.fill(); ctx.restore(); }
function deed(x, y, w, cross, newOwner) { const h = w * .75; ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f5ecd2'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 12); ctx.fill(); ctx.strokeStyle = '#b58b3c'; ctx.lineWidth = 6; ctx.strokeRect(-w * .45, -h * .42, w * .9, h * .84);
  txt('DEED OF OWNERSHIP', 0, -h * .28, w * .07, '#6b4f1d', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('OWNER:', -w * .36, 0, w * .065, '#6b4f1d', { weight: 900, stroke: 0 }); txt('YOU', w * .1, 0, w * .1, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  if (cross > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-w * .05, 0); ctx.lineTo(-w * .05 + w * .32 * eo(cross), 0); ctx.stroke(); }
  if (newOwner > 0) { ctx.save(); ctx.globalAlpha = newOwner; txt('THE TRUST', w * .1, h * .2, w * .085, TEAL, { align: 'center', font: 'Anton', weight: 400, strokeCol: '#06322b' }); ctx.restore(); } ctx.restore(); }
function trustBox(x, y, s, t, glow = 1) { ctx.save(); ctx.translate(x, y); const d = s * .25;
  ctx.fillStyle = '#0f3a34'; ctx.beginPath(); ctx.moveTo(-s / 2, -s / 2); ctx.lineTo(-s / 2 + d, -s / 2 - d); ctx.lineTo(s / 2 + d, -s / 2 - d); ctx.lineTo(s / 2, -s / 2); ctx.fill(); ctx.fillStyle = '#082622'; ctx.beginPath(); ctx.moveTo(s / 2, -s / 2); ctx.lineTo(s / 2 + d, -s / 2 - d); ctx.lineTo(s / 2 + d, s / 2 - d); ctx.lineTo(s / 2, s / 2); ctx.fill();
  ctx.fillStyle = '#12463f'; ctx.shadowColor = TEAL; ctx.shadowBlur = 50 * glow; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.shadowBlur = 0; ctx.strokeStyle = TEAL; ctx.lineWidth = 6; ctx.strokeRect(-s / 2, -s / 2, s, s);
  txt('TRUST', 0, -s * .05, s * .22, TEAL, { align: 'center', font: 'Anton', weight: 400, stroke: 0, glow: TEAL }); txt('LEGAL ENTITY', 0, s * .22, s * .08, '#9ff5e4', { align: 'center', weight: 900, stroke: 0 }); ctx.restore(); }
function dome(x, y, r, t, hit) { ctx.save(); ctx.translate(x, y); const g = ctx.createRadialGradient(0, 0, r * .6, 0, 0, r); g.addColorStop(0, 'rgba(40,224,192,0)'); g.addColorStop(1, `rgba(40,224,192,${.25 + .35 * hit})`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, TAU); ctx.lineTo(r, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = `rgba(120,255,230,${.6 + .4 * hit})`; ctx.lineWidth = 6 + 8 * hit; ctx.shadowColor = TEAL; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, TAU); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(120,255,230,.25)'; ctx.lineWidth = 2; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.ellipse(0, 0, r, r * i / 6, 0, Math.PI, TAU); ctx.stroke(); } ctx.restore(); }
function gavel(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#8a5a2b'; ctx.fillRect(-s * .06, -s * .1, s * .12, s * .8); ctx.fillStyle = '#6b4220'; ctx.beginPath(); ctx.roundRect(-s * .4, -s * .3, s * .8, s * .28, 14); ctx.fill(); ctx.fillStyle = C.gold; ctx.fillRect(-s * .2, -s * .3, s * .06, s * .28); ctx.fillRect(s * .14, -s * .3, s * .06, s * .28); ctx.restore(); }
function bill2(x, y, s, rot, label, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-s * .4, -s * .5, s * .8, s, 10); ctx.fill(); txt(label, 0, -s * .3, s * .15, col, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = '#ccc'; for (let i = 0; i < 4; i++) ctx.fillRect(-s * .3, -s * .1 + i * s * .13, s * .6, s * .05); ctx.restore(); }
function key(x, y, s, rot, col = C.gold) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = col; ctx.lineWidth = s * .12; ctx.beginPath(); ctx.arc(-s * .3, 0, s * .2, 0, TAU); ctx.stroke(); ctx.fillStyle = col; ctx.fillRect(-s * .1, -s * .05, s * .6, s * .1); ctx.fillRect(s * .3, 0, s * .08, s * .18); ctx.fillRect(s * .42, 0, s * .08, s * .13); ctx.restore(); }
function domino(x, y, w, h, ang, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, w * .15); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-w * .35, -h * .52, w * .7, h * .03); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, -h * .75, w * .1, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, -h * .28, w * .1, 0, TAU); ctx.fill(); ctx.restore(); }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–5.0 HOOK: banka hesabı + hisse portföyü panelleri çarparak gelir → "NOT EVEN CLOSE"
scene(0, 6.6, 'push', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 1, dot: '150,200,255' });
  const out = eio(seg(t, 5.1, 5.5)), a1 = eback(seg(t, 0, .45)), a2 = eback(seg(t, 2.3, 2.8));
  cam({ t, shake: t < .4 ? 12 : 0, rot: Math.sin(t) * .01 }, () => {
    panel(lerp(-500, W / 2, a1) - out * 900, 720, 820, 380, C.blue, (w, h) => { txt('BANK ACCOUNT', -w * .42, -h * .3, 50, C.mute, { weight: 900, stroke: 0 }); counter(0, 2.4e9, 0, h * .08, 140, seg(t, .3, 1.6), { col: '#fff', maxW: 700 }); });
    if (a2 > 0) panel(lerp(W + 500, W / 2, a2) + out * 900, 1180, 820, 380, C.green, (w, h) => { txt('STOCK PORTFOLIO', -w * .42, -h * .3, 50, C.mute, { weight: 900, stroke: 0 }); const R = RN(9), cs = []; let p = 100; for (let i = 0; i < 14; i++) { const o = p, c = o + (R() - .4) * 9; cs.push({ o, c, h: Math.max(o, c) + 3, l: Math.min(o, c) - 3 }); p = c; } candles(-w * .42, -h * .15, w * .84, h * .5, cs, seg(t, 2.6, 3.8)); });
  });
  kinetic(['WHERE', 'IS', 'THEIR', 'MONEY?'], W / 2, 260, 140, t, .1, { hl: { 'MONEY?': C.gold } });
  stampText('NOT EVEN CLOSE', W / 2, 960, 120, C.red, seg(t, 5.06, 5.3), -.07);
  flash(t, 0, .2);
});

// 2) 5.0–10.55: en zengin aileler — nesilden nesile akan altın soy ağacı
scene(6.6, 10.55, 'cut', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.16)', seed: 2, dot: '255,210,120', top: '#140f05', bot: '#040301' });
  cam({ x: d.x, y: d.y, rot: d.rot, t, zoom: 1 + .05 * seg(t, 6.6, 10.5) }, () => {
    const L = [[[W / 2, 600]], [[300, 900], [780, 900]], [[160, 1220], [420, 1220], [660, 1220], [920, 1220]]];
    for (let g = 0; g < 2; g++) L[g].forEach(([x, y], i) => L[g + 1].forEach(([x2, y2], j) => { if (g === 1 && Math.floor(j / 2) !== i) return; const p = seg(t, 7.1 + g * .5, 7.6 + g * .5); if (p <= 0) return; ctx.strokeStyle = 'rgba(255,200,61,.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y + 60); ctx.lineTo(lerp(x, x2, p), lerp(y + 60, y2 - 70, p)); ctx.stroke();
      if (t > 8.2) { const k = (t * .8 + i * .3 + j * .2) % 1; coin(lerp(x, x2, k), lerp(y + 60, y2 - 70, k), 18, t * 8 + j); } }));
    L.forEach((row, g) => row.forEach(([x, y], i) => { const a = eback(seg(t, 6.7 + g * .5, 7.2 + g * .5)); if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.fillStyle = 'rgba(255,200,61,.15)'; ctx.beginPath(); ctx.arc(0, 0, 85, 0, TAU); ctx.fill(); avatar(0, 10, 110, C.gold); ctx.restore(); }));
    txt('GEN 1', 120, 600, 40, C.mute, { font: 'Anton', weight: 400 }); txt('GEN 2', 60, 780, 40, C.mute, { font: 'Anton', weight: 400 }); txt('GEN 3', 60, 1340, 40, C.mute, { font: 'Anton', weight: 400 });
  });
  kinetic(['WEALTHIEST', 'FAMILIES'], W / 2, 260, 150, t, 7.4, { hl: { 'FAMILIES': C.gold } });
});

// 3) 10.55–14.2: gizli silah banka değil — evrak çantasından TRUST çıkar
scene(10.55, 14.2, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(40,224,192,.18)', seed: 3, dot: '120,240,220', top: '#04120f', bot: '#010403' });
  const op = eio(seg(t, 12.7, 13.2)); cam({ t, zoom: 1 + .08 * seg(t, 10.55, 14.2) }, () => { briefcase(W / 2, 1250, 620, op); if (op > .3) trustDoc(W / 2, lerp(1100, 780, eo(seg(t, 12.9, 13.6))), 330, Math.sin(t * 2) * .04, eback(seg(t, 12.9, 13.4))); });
  if (t < 12.7) { kinetic(['SECRET', 'WEAPON'], W / 2, 270, 170, t, 10.7, { hl: { 'SECRET': TEAL } }); const bp = seg(t, 11.4, 11.8); if (bp > 0) pill("ISN'T A BANK", W / 2, 440, 60, C.red, bp); }
  else kinetic(["IT'S", 'A', 'TRUST'], W / 2, 270, 180, t, 12.8, { hl: { 'TRUST': TEAL } });
  flash(t, 13.3, .18, '40,224,192');
});

// 4) 14.2–17.95: yeterince zenginleşince serveti yasal olarak "sahiplenmeyi" bırakırsın
scene(14.2, 17.95, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 4, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => deed(W / 2, 900, 860, seg(t, 16.0, 16.6), seg(t, 16.9, 17.4)));
  kinetic(['STOP', 'OWNING', 'IT'], W / 2, 270, 170, t, 15.5, { hl: { 'OWNING': C.red } });
  if (t > 15.9) pill('LEGALLY', W / 2, 430, 56, C.gold, seg(t, 15.9, 16.3));
});

// 5) 17.95–24.55: malikaneler, işletmeler, yatırımlar → ayrı tüzel kişilik: TRUST kutusu
scene(17.95, 24.55, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(40,224,192,.14)', seed: 5, dot: '120,240,220' });
  const bp = eback(seg(t, 22.4, 23.0));
  cam({ x: d.x, y: d.y, t, zoom: punch(t, 23.7, .07) }, () => {
    if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1180); ctx.scale(bp, bp); trustBox(0, 0, 420, t, 1); ctx.restore(); }
    const items = [[19.54, (x, y, s) => mansion(x, y, s), 'MANSIONS', 210], [20.42, (x, y, s) => bizTower(x, y, s), 'BUSINESSES', 540], [21.18, (x, y, s) => invChart(x, y, s), 'INVESTMENTS', 870]];
    items.forEach(([tt, fn, lab, x0], i) => { const a = eback(seg(t, tt - .2, tt + .25)); if (a <= 0) return; const go = eio(seg(t, 22.9 + i * .2, 23.6 + i * .2)), x = lerp(x0, W / 2, go), y = lerp(780, 1180, go), s = lerp(330, 110, go) * a;
      ctx.save(); ctx.globalAlpha = 1 - go * .9; fn(x, y, s); if (go < .2) txt(lab, x, y + 110, 40, '#fff', { align: 'center', weight: 900 }); ctx.restore(); });
  });
  kinetic(['TRANSFER', 'EVERYTHING'], W / 2, 270, 150, t, 18.4, { hl: { 'EVERYTHING': TEAL } });
  if (t > 22.5) pill('SEPARATE LEGAL ENTITY', W / 2, 430, 50, TEAL, seg(t, 22.5, 22.9));
});

// 6) 24.55–32.6: davalar, alacaklılar, veraset vergisi kalkana çarpıp sekiyor
scene(24.55, 32.6, 'iris', t => {
  bgFinance(t, { tint: 'rgba(40,224,192,.16)', seed: 6, dot: '120,240,220', top: '#05120f', bot: '#010403' });
  const hits = [27.75, 29.1, 30.15]; let hit = 0; hits.forEach(h => { const k = seg(t, h, h + .4); if (k > 0 && k < 1) hit = Math.max(hit, 1 - k); });
  cam({ t, shake: hit * 10 }, () => {
    trustBox(W / 2, 1150, 340, t, .8); dome(W / 2, 1360, 470, t, hit); ctx.fillStyle = '#1b2235'; ctx.fillRect(0, 1360, W, 30);
    const ob = [[27.78, -1, (x, y, r) => gavel(x, y, 230, r), 'LAWSUITS', C.red], [29.12, 1, (x, y, r) => bill2(x, y, 240, r, 'DEBT', C.red), 'CREDITORS', '#ff8a3d'], [30.16, -1, (x, y, r) => bill2(x, y, 240, r, 'TAX %', C.violet), 'INHERITANCE TAX', C.violet]];
    ob.forEach(([tt, sd, fn, lab, col], i) => { const k = seg(t, tt - .9, tt + 1.0); if (k <= 0 || k >= 1) return; const hitK = .45; let x, y, r;
      if (k < hitK) { const e = k / hitK; x = lerp(W / 2 + sd * 560, W / 2 + sd * 330, e); y = lerp(500 + i * 120, 950, e); r = e * 2 * sd; }
      else { const e = (k - hitK) / (1 - hitK); x = W / 2 + sd * (330 + 700 * e); y = 950 - 600 * e + 900 * e * e; r = 2 * sd + e * 6 * sd; }
      fn(x, y, r); if (k < .6) txt(lab, clamp(x, 240, W - 240), y - 130, 46, col, { align: 'center', font: 'Anton', weight: 400 }); });
    if (hit > 0) { const R = RN(Math.floor(t * 10)); for (let i = 0; i < 14; i++) { const a = R() * Math.PI + Math.PI, rr = 470 + R() * 60 * hit; ctx.fillStyle = `rgba(160,255,240,${hit})`; ctx.fillRect(W / 2 + Math.cos(a) * rr, 1360 + Math.sin(a) * rr, 8, 8); } }
  });
  if (t < 27.6) kinetic(["DOESN'T", 'OWN', 'IT'], W / 2, 270, 170, t, 25.0, { hl: { 'OWN': TEAL } });
  else kinetic(["CAN'T", 'TOUCH', 'IT'], W / 2, 270, 170, t, 27.7, { hl: { 'TOUCH': TEAL } });
});

// 7) 32.6–36.65: trust her şeye sahip — aile sadece kullanır (anahtarlar)
scene(32.6, 36.65, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 7, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    trustBox(W / 2, 700, 300, t, .9); pill('OWNS', W / 2 + 270, 560, 50, TEAL, seg(t, 33.2, 33.6));
    const fp = seg(t, 34.6, 35.2); [[260, 1250], [W / 2, 1300], [820, 1250]].forEach(([x, y], i) => { const a = eback(clamp(fp * 2 - i * .3)); if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(a, a); avatar(0, 0, 150, [C.gold, C.blue, C.violet][i]); ctx.restore();
      const k = seg(t, 35.4 + i * .1, 36.0 + i * .1); if (k > 0) { ctx.strokeStyle = 'rgba(255,200,61,.5)'; ctx.setLineDash([12, 10]); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(W / 2, 880); ctx.lineTo(lerp(W / 2, x, k), lerp(880, y - 140, k)); ctx.stroke(); ctx.setLineDash([]); key(lerp(W / 2, x, eo(k)), lerp(880, y - 150, eo(k)), 90, t * 2 + i); } });
    if (t > 35.8) pill('JUST USES IT', W / 2, 1440, 50, C.gold, seg(t, 35.8, 36.2));
  });
  kinetic(['TRUST', 'OWNS', 'ALL'], W / 2, 270, 170, t, 32.8, { hl: { 'ALL': TEAL } });
});

// 8) 36.65–42.35: kağıt üstünde iflas, gerçekte milyarları kontrol eder (bölünmüş ekran)
scene(36.65, 42.35, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.12)', seed: 8, dot: '255,210,120' });
  const sw = eio(seg(t, 39.4, 40.0)), split = lerp(W, W / 2, sw);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, split, H); ctx.clip(); ctx.fillStyle = 'rgba(40,40,50,.6)'; ctx.fillRect(0, 0, W, H);
  const cx = split / 2; ctx.save(); ctx.translate(cx, 900); ctx.rotate(-.05); ctx.fillStyle = '#e8e8e8'; ctx.beginPath(); ctx.roundRect(-210, -280, 420, 560, 12); ctx.fill(); txt('NET WORTH', 0, -190, 44, '#555', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('$0', 0, -40, 150, '#888', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = '#bbb'; for (let i = 0; i < 4; i++) ctx.fillRect(-150, 80 + i * 40, 300, 14); ctx.restore();
  txt('ON PAPER', cx, 1280, 70, '#bbb', { align: 'center', font: 'Anton', weight: 400 }); stampText('BROKE', cx, 1050, 90, C.red, seg(t, 38.4, 38.7), -.15); ctx.restore();
  if (sw > 0) { ctx.save(); ctx.beginPath(); ctx.rect(split, 0, W - split, H); ctx.clip(); const rx = split + (W - split) / 2; const g = ctx.createRadialGradient(rx, 900, 0, rx, 900, 500); g.addColorStop(0, 'rgba(255,200,61,.35)'); g.addColorStop(1, 'rgba(255,200,61,0)'); ctx.fillStyle = g; ctx.fillRect(split, 0, W, H);
    for (let i = 0; i < 4; i++) for (let j = 0; j <= i; j++) { const k = eback(seg(t, 40.0 + (i * 2 + j) * .04, 40.4 + (i * 2 + j) * .04)); if (k > 0) coin(rx + (j - i / 2) * 70, 1150 - (3 - i) * 60 - (1 - k) * 300, 34, t * 4 + i + j); }
    txt('IN REALITY', rx, 1280, 70, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); counter(0, 12e9, rx, 760, 110, seg(t, 40.2, 41.3), { col: C.gold, maxW: 480 }); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.fillRect(split - 3, 0, 6, H); }
  if (t < 39.4) kinetic(['LEGALLY', 'BROKE'], W / 2, 270, 180, t, 37.0, { hl: { 'BROKE': C.red } });
  else kinetic(['CONTROLS', 'BILLIONS'], W / 2, 270, 160, t, 39.9, { hl: { 'BILLIONS': C.gold } });
});

// 9) 42.35–45.65: eski para sonsuza dek zengin kalır — sonsuzluk + nesil grafiği
scene(42.35, 45.65, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.2)', seed: 9, dot: '255,210,120', top: '#151005', bot: '#040301' });
  const p = seg(t, 42.6, 44.4); ctx.save(); ctx.strokeStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 40; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); const n = Math.floor(200 * eio(p));
  for (let i = 0; i <= n; i++) { const a = i / 200 * TAU, x = W / 2 + 360 * Math.cos(a) / (1 + Math.sin(a) ** 2), y = 820 + 360 * Math.sin(a) * Math.cos(a) / (1 + Math.sin(a) ** 2); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
  const gp = seg(t, 43.6, 45.3); bars(130, 1060, 820, 280, [1, 2, 3, 4, 5].map(i => ({ label: 'GEN ' + i, value: Math.pow(1.6, i), col: C.gold })), gp, { fmt: () => '', lsize: 34 });
  kinetic(['OLD', 'MONEY', 'FOREVER'], W / 2, 270, 160, t, 43.0, { hl: { 'FOREVER': C.gold } });
});

// 10) 45.65–51.95: nesiller boyu servet bir adımla başlar — domino zinciri
scene(45.65, 51.95, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.15)', seed: 10, dot: '190,160,255' });
  cam({ x: d.x, y: d.y, t, zoom: lerp(1.15, .95, eio(seg(t, 47.5, 50.0))) }, () => {
    ctx.fillStyle = '#1b2235'; ctx.fillRect(0, 1400, W, 40);
    for (let i = 0; i < 6; i++) { const h = 110 * Math.pow(1.45, i), w = h * .42, x = 110 + i * 170 + Math.pow(i, 1.4) * 14, fall = eio(seg(t, 48.6 + i * .32, 49.0 + i * .32)), col = i === 0 ? C.gold : ['#e9eef5', '#d6dde8', '#c9d2de', '#b8c2d2', '#a8b3c6'][i - 1]; domino(x, 1400, w, h, fall * 1.1, col); }
    if (t > 48.2) pill('STEP ONE', 120, 1180, 46, C.gold, seg(t, 48.2, 48.6));
  });
  kinetic(['GENERATIONAL', 'WEALTH'], W / 2, 270, 130, t, 46.0, { hl: { 'WEALTH': C.gold } });
  if (t > 50.4) { ctx.fillStyle = 'rgba(6,9,15,.88)'; ctx.fillRect(0, 160, W, 230); kinetic(['BIGGER', 'QUESTION'], W / 2, 270, 170, t, 50.5, { hl: { 'BIGGER': C.violet } }); }
});

// 11) 51.95–55.45: milyoner olmak için gerçekten ne kadar gerekir? — hedef çubuğu
scene(51.95, 55.45, 'iris', t => {
  bgFinance(t, { tint: 'rgba(34,224,122,.18)', seed: 11 });
  cam({ t, zoom: punch(t, 54.66, .08) }, () => {
    counter(0, 1e6, W / 2, 760, 200, seg(t, 52.2, 54.6), { col: C.green, fmt: v => '$' + Math.round(v).toLocaleString('en-US'), ease: x => eio(x) });
    const p = eio(seg(t, 52.2, 54.6)); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(120, 1000, 840, 60, 30); ctx.fill(); ctx.fillStyle = C.green; ctx.shadowColor = C.green; ctx.shadowBlur = 25; ctx.beginPath(); ctx.roundRect(120, 1000, Math.max(30, 840 * p), 60, 30); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = C.gold; ctx.fillRect(950, 880, 8, 180); ctx.beginPath(); ctx.moveTo(958, 880); ctx.lineTo(1040, 905); ctx.lineTo(958, 930); ctx.fill();
    qmark(W / 2, 1260, 220 * eback(seg(t, 54.5, 55.0)), t, C.gold);
  });
  kinetic(['HOW', 'MUCH', 'DO', 'YOU', 'NEED?'], W / 2, 270, 140, t, 52.1, { hl: { 'NEED?': C.green } });
});

// 12) 55.45–59.5: CTA
scene(55.45, 59.5, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 12, dot: '255,140,150' });
  trustDoc(W / 2, 720, 300, Math.sin(t * 1.5) * .05); pill('NEXT: HOW MUCH TO BECOME A MILLIONAIRE', W / 2, 1010, 36, C.gold, seg(t, 55.6, 56.0));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 55.6, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 57.2, 57.6), press = seg(t, 57.8, 57.95) - seg(t, 57.95, 58.1), done = t > 57.95;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 57.3, 57.8))), lerp(1480, 1260, eo(seg(t, 57.3, 57.8))), 1, press);
    if (done) { const k = seg(t, 57.95, 59.0); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 57.95, .15);
});

// ---------------- birleştirici ----------------
const TD = .36;
function drawScene(i, t) { ctx.save(); S[i].fn(t); ctx.restore(); }
function transition(i, t) {
  const b = S[i].s, k = eio(seg(t, b - TD / 2, b + TD / 2)), type = S[i].tr;
  if (type === 'cut') { drawScene(t < b ? i - 1 : i, t); return; }
  if (type === 'whipL' || type === 'whipU') { const up = type === 'whipU', dist = up ? H : W, dx = up ? 0 : 1, dy = up ? 1 : 0;
    if (k < 1) cam({ x: -dx * dist * k, y: -dy * dist * k }, () => drawScene(i - 1, t)); if (k > 0) cam({ x: dx * dist * (1 - k), y: dy * dist * (1 - k) }, () => drawScene(i, t)); motionStreak(Math.sin(k * Math.PI)); return; }
  if (type === 'push') { if (k < 1) cam({ zoom: 1 + 3 * k * k }, () => drawScene(i - 1, t)); if (k > 0) { ctx.save(); ctx.globalAlpha = k; cam({ zoom: .5 + .5 * k }, () => drawScene(i, t)); ctx.restore(); } return; }
  if (type === 'zoom') { if (k < 1) cam({ zoom: 1 + k * 2.5 }, () => drawScene(i - 1, t)); if (k > 0) { ctx.save(); ctx.globalAlpha = k; cam({ zoom: .6 + .4 * k }, () => drawScene(i, t)); ctx.restore(); } ctx.fillStyle = `rgba(255,255,255,${.2 * Math.sin(k * Math.PI)})`; ctx.fillRect(0, 0, W, H); return; }
  if (type === 'glitch') { drawScene(k < .5 ? i - 1 : i, t); const a = Math.sin(k * Math.PI), R = RN(Math.floor(t * 30)); for (let j = 0; j < 9; j++) { const y = R() * H, h = 30 + R() * 140, dx = (R() - .5) * 260 * a; ctx.drawImage(cv, 0, y, W, h, dx, y, W, h); }
    ctx.fillStyle = `rgba(40,224,192,${.12 * a})`; ctx.fillRect(0, 0, W, H); return; }
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
