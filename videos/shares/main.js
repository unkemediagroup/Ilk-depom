// "Why Do Billionaires Buy Shares Instead of Owning Everything Outright?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 59.5;
const SUBY = 1530, CYAN = '#2ee6ff';
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function shareCert(x, y, w, rot, name) { const h = w * .62; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#f5ecd2'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 10); ctx.fill(); ctx.strokeStyle = '#b58b3c'; ctx.lineWidth = w * .02; ctx.strokeRect(-w * .45, -h * .42, w * .9, h * .84);
  txt('SHARE', 0, -h * .18, w * .14, '#6b4f1d', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt(name, 0, h * .1, w * .07, '#6b4f1d', { align: 'center', weight: 900, stroke: 0 }); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(w * .3, h * .24, w * .06, 0, TAU); ctx.fill(); ctx.restore(); }
function tower(x, y, w, h, t, col = C.blue) { ctx.fillStyle = '#18213a'; ctx.fillRect(x - w / 2, y - h, w, h); for (let r = 0; r < Math.floor(h / 60); r++) for (let c = 0; c < 4; c++) { const on = Math.sin(r * 3.1 + c * 1.7 + Math.floor(t * 2)) > -.2; ctx.fillStyle = on ? 'rgba(255,220,140,.75)' : '#0d1424'; ctx.fillRect(x - w / 2 + 14 + c * (w - 28) / 4, y - h + 20 + r * 60, (w - 28) / 4 - 12, 34); } ctx.fillStyle = col; ctx.fillRect(x - w / 2, y - h - 14, w, 14); }
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function crown(x, y, s, glow = 1) { ctx.save(); ctx.translate(x, y); ctx.shadowColor = C.gold; ctx.shadowBlur = 40 * glow; const g = ctx.createLinearGradient(0, -s * .5, 0, s * .2); g.addColorStop(0, '#fff1a8'); g.addColorStop(1, C.gold2); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-s * .5, s * .2); ctx.lineTo(-s * .55, -s * .35); ctx.lineTo(-s * .25, -s * .05); ctx.lineTo(0, -s * .5); ctx.lineTo(s * .25, -s * .05); ctx.lineTo(s * .55, -s * .35); ctx.lineTo(s * .5, s * .2); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = C.red; for (const [px, py] of [[-.55, -.35], [0, -.5], [.55, -.35]]) { ctx.beginPath(); ctx.arc(px * s, py * s, s * .06, 0, TAU); ctx.fill(); } ctx.fillStyle = C.gold2; ctx.fillRect(-s * .5, s * .1, s, s * .1); ctx.restore(); }
function warnTri(x, y, s, t) { ctx.save(); ctx.translate(x + Math.sin(t * 40) * 4, y); ctx.fillStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(0, -s * .5); ctx.lineTo(s * .55, s * .42); ctx.lineTo(-s * .55, s * .42); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; txt('!', 0, s * .08, s * .55, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function lever(x, y, s, lift, t) {                        // kaldıraç: küçük itme, dev altın yükü kalkar
  const a = lerp(-.22, .26, lift); ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#8a97b0'; ctx.beginPath(); ctx.moveTo(-s * .08, s * .12); ctx.lineTo(s * .08, s * .12); ctx.lineTo(0, 0); ctx.fill();
  ctx.save(); ctx.rotate(a); ctx.fillStyle = '#c9d2de'; ctx.fillRect(-s * .7, -s * .025, s * 1.4, s * .04);
  ctx.save(); ctx.translate(-s * .52, -s * .02); for (let i = 0; i < 3; i++) for (let j = 0; j <= i; j++) goldBarMini(-s * .12 + j * s * .16 - i * s * .08 + s * .08, -i * s * .08, s * .15); ctx.restore();
  ctx.restore(); arrow(Math.cos(a) * s * .62, Math.sin(a) * s * .62 - s * .3, s * .25, false, 1, { col: C.green, w: s * .04 }); txt('SMALL PUSH', Math.cos(a) * s * .62, Math.sin(a) * s * .62 - s * .4, s * .06, C.green, { align: 'center', weight: 900 }); ctx.restore(); }
function goldBarMini(x, y, w) { const h = w * .4; ctx.fillStyle = C.gold2; ctx.fillRect(x - w / 2, y - h, w, h); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w * .38, y - h * 1.5); ctx.lineTo(x - w * .38, y - h * 1.5); ctx.fill(); }
function avatar(x, y, s, col = '#8a97b0') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .32, s * .22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, s * .2, s * .38, s * .3, 0, Math.PI, TAU); ctx.fill(); ctx.restore(); }
function shield(x, y, s, t) { ctx.save(); ctx.translate(x, y); const g = ctx.createLinearGradient(0, -s * .5, 0, s * .6); g.addColorStop(0, '#5fb8ff'); g.addColorStop(1, '#1d4f8f'); ctx.fillStyle = g; ctx.shadowColor = C.blue; ctx.shadowBlur = 50; ctx.beginPath(); ctx.moveTo(0, -s * .55); ctx.lineTo(s * .45, -s * .38); ctx.quadraticCurveTo(s * .45, s * .3, 0, s * .6); ctx.quadraticCurveTo(-s * .45, s * .3, -s * .45, -s * .38); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = s * .03; ctx.stroke(); txt('$', 0, 0, s * .45, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function stairs(x, y, s, lit, t) { for (let i = 0; i < 4; i++) { const sx = x + i * s * .5, sy = y - i * s * .3, on = i < lit; ctx.fillStyle = on ? C.gold : '#253049'; if (on) { ctx.shadowColor = C.gold; ctx.shadowBlur = 25; } ctx.fillRect(sx, sy, s * .5, s * .3 + i * s * .3); ctx.shadowBlur = 0;
    txt(i === 0 ? 'STEP 1' : '?', sx + s * .25, sy + s * .15, s * (i === 0 ? .1 : .15), on ? C.ink : '#8a97b0', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); } }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–4.6 HOOK: imparatorluk kuleleri fırlar, her biri "100% MINE", tepede taç
scene(0, 4.6, 'push', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.2)', seed: 1, dot: '255,210,120', top: '#151005', bot: '#040301' });
  cam({ t, zoom: 1.15 - .15 * eo(seg(t, 0, 4.4)), rot: Math.sin(t) * .01 }, () => {
    const hs = [420, 600, 760, 560, 380]; hs.forEach((h, i) => { const g = eback(seg(t, i * .12, .6 + i * .12)); const x = 140 + i * 200; tower(x, 1420, 170, h * g, t, C.gold);
      if (g > .8) { ctx.fillStyle = C.gold; ctx.fillRect(x - 3, 1420 - h - 90, 6, 80); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(x + 3, 1420 - h - 90); ctx.lineTo(x + 90, 1420 - h - 70); ctx.lineTo(x + 3, 1420 - h - 50); ctx.fill(); } });
    crown(W / 2, 1420 - 760 - 150, 220 * eback(seg(t, 1.1, 1.6)));
    if (t > 2.0) pill('100% MINE', W / 2, 400, 64, C.gold, seg(t, 2.0, 2.4));
  });
  kinetic(['TOTAL', 'OWNERSHIP'], W / 2, 250, 160, t, .1, { hl: { 'OWNERSHIP': C.gold } });
  flash(t, 0, .22, '255,200,61');
});

// 2) 4.6–9.65: en akıllıları asla %100'e sahip olmaz — pasta dilimlere ayrılır
scene(4.6, 9.65, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 2, dot: '150,200,255' });
  const sp = seg(t, 7.1, 8.3);
  cam({ x: d.x, y: d.y, rot: d.rot, t, zoom: punch(t, 7.1, .08) }, () => {
    const parts = [{ v: 20, col: C.gold, label: 'FOUNDER' }, { v: 22, col: C.blue, label: '' }, { v: 18, col: C.violet, label: '' }, { v: 15, col: '#ff8a3d', label: '' }, { v: 13, col: C.green, label: '' }, { v: 12, col: '#ff5a8a', label: '' }];
    if (sp <= 0) { donut(W / 2, 960, 380, [{ v: 1, col: C.gold }], 1, { hole: 0 }); txt('100%', W / 2, 960, 170, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }
    else { const tot = 100; let a = -Math.PI / 2; parts.forEach((p, i) => { const da = TAU * p.v / tot, m = a + da / 2, off = 50 * eo(sp) + (i === 0 ? 40 * eo(sp) : 0); ctx.save(); ctx.translate(Math.cos(m) * off, Math.sin(m) * off); ctx.fillStyle = p.col; ctx.beginPath(); ctx.moveTo(W / 2, 960); ctx.arc(W / 2, 960, 380, a, a + da); ctx.closePath(); ctx.fill(); ctx.restore(); a += da; });
      txt('20%', W / 2 + 130, 760, 80, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }
  });
  if (t < 7.0) kinetic(['THE', 'SMARTEST', 'ONES'], W / 2, 260, 160, t, 4.9, { hl: { 'SMARTEST': C.blue } });
  else kinetic(['NEVER', 'OWN', '100%'], W / 2, 260, 170, t, 7.0, { hl: { 'NEVER': C.red } });
});

// 3) 9.65–14.85: Neden hisse? — hisse senetleri iskambil gibi yelpaze açılır
scene(9.65, 14.85, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.18)', seed: 3, dot: '190,160,255' });
  const fp = eio(seg(t, 10.9, 11.9));
  cam({ x: d.x, y: d.y, t }, () => { for (let i = 0; i < 7; i++) { const a = (i - 3) * .2 * fp; ctx.save(); ctx.translate(W / 2, 1350); ctx.rotate(a); shareCert(0, -470, 360, 0, 'CLASS ' + 'ABCDEFG'[i]); ctx.restore(); } });
  qmark(W - 160, 560, 220 * eback(seg(t, 13.6, 14.1)), t, C.violet);
  kinetic(['WHY', 'BUY', 'SHARES'], W / 2, 260, 170, t, 10.0, { hl: { 'SHARES': C.violet } });
  if (t > 12.6) { ctx.fillStyle = 'rgba(6,9,15,.85)'; ctx.fillRect(0, 380, W, 140); txt('INSTEAD OF OWNING IT ALL?', W / 2, 450, 64, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
});

// 4) 14.85–17.95: risk ve kaldıraç
scene(14.85, 17.95, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 4, dot: '255,210,120' });
  const rp = eback(seg(t, 16.0, 16.4)); if (rp > 0) { ctx.save(); ctx.translate(W / 2, 700); ctx.scale(rp, rp); warnTri(0, 0, 300, t); ctx.restore(); }
  if (t > 16.5) lever(W / 2, 1240, 640, eio(seg(t, 17.0, 17.8)), t);
  kinetic(['RISK', '&', 'LEVERAGE'], W / 2, 280, 160, t, 15.9, { hl: { 'RISK': C.red, 'LEVERAGE': C.green }, gap: .3 });
});

// 5) 17.95–26.25: tek başına sahiplik = tüm risk sende → çöküş, servet sıfır
scene(17.95, 26.25, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,59,78,.15)', seed: 5, dot: '255,140,150' });
  const cr = seg(t, 23.2, 24.2), sh = t > 23.2 && t < 24.6 ? 16 : 0;
  cam({ x: d.x, y: d.y, t, shake: sh }, () => {
    if (t < 23.0) { tower(W / 2, 1380, 300, 640, t, C.gold); avatar(W / 2, 1460, 110, C.gold); pill('100% YOURS', W / 2, 620, 56, C.gold, seg(t, 18.6, 19.0));
      const wp = seg(t, 20.6, 21.4); if (wp > 0) { warnTri(W / 2 - 300, 900, 140 * eback(wp), t); warnTri(W / 2 + 300, 1000, 120 * eback(wp), t); pill('100% OF THE RISK', W / 2, 1230, 54, C.red, wp); } }
    else { const R = RN(4); for (let i = 0; i < 18; i++) { const fx = W / 2 + (R() - .5) * 300, fy = 740 + R() * 640, e = eio(cr); ctx.save(); ctx.translate(fx + (R() - .5) * 700 * e, fy + 900 * e * e * R()); ctx.rotate((R() - .5) * 4 * e); ctx.fillStyle = '#18213a'; ctx.fillRect(-60, -40, 120, 80); ctx.fillStyle = 'rgba(255,220,140,.6)'; ctx.fillRect(-40, -20, 30, 24); ctx.restore(); }
      const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; if (u > eo(cr)) break; pts.push([120 + u * 840, 560 + (u < .35 ? -u * 120 : -42 + Math.pow((u - .35) / .65, 1.6) * 520)]); } ctx.save(); ctx.strokeStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 25; ctx.lineWidth = 12; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
      ctx.fillStyle = 'rgba(6,9,15,.8)'; ctx.fillRect(160, 1180, 760, 200); txt('YOUR WEALTH', W / 2, 1225, 44, C.mute, { align: 'center', weight: 900, stroke: 0 }); counter(5e9, 0, W / 2, 1320, 110, seg(t, 24.2, 25.4), { col: C.red, ease: eio }); }
  });
  if (t < 20.4) kinetic(['OWN', 'IT', 'ALONE'], W / 2, 260, 170, t, 18.1, { hl: { 'ALONE': C.gold } });
  else if (t < 23.0) kinetic(['ALL', 'THE', 'RISK'], W / 2, 260, 170, t, 20.6, { hl: { 'RISK': C.red } });
  else kinetic(['IT', 'CRASHES'], W / 2, 260, 180, t, 23.1, { hl: { 'CRASHES': C.red } });
  flash(t, 23.3, .18, '255,59,78');
});

// 6) 26.25–32.45: hisse sat → başkalarının parası şirketi büyütür
scene(26.25, 32.45, 'iris', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.15)', seed: 6 });
  const gp = eio(seg(t, 29.0, 31.8)), cx = W / 2;
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    tower(cx, 1300, 280, lerp(380, 820, gp), t, C.green); txt('YOUR COMPANY', cx, 1350, 40, C.mute, { align: 'center', weight: 900 });
    const inv = [[150, 760], [140, 1080], [190, 1360], [930, 760], [940, 1080], [890, 1360], [300, 560], [780, 560]];
    inv.forEach(([x, y], i) => { const a = eback(seg(t, 27.4 + i * .1, 27.9 + i * .1)); if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(a, a); avatar(0, 0, 110, [C.blue, C.violet, '#ff8a3d', C.gold][i % 4]); ctx.restore();
      if (t > 28.6) { const k = (t * .9 + i * .17) % 1; coin(lerp(x, cx, k), lerp(y, 1300 - lerp(380, 820, gp) + 60, k) - Math.sin(k * Math.PI) * 80, 24, t * 8 + i); }
      if (t < 28.6 && t > 27.0) { const k = seg(t, 27.0, 28.4); shareCert(lerp(cx, x, eo(k)), lerp(1100, y, eo(k)), 130, k * 3, ''); } });
  });
  if (t < 28.9) kinetic(['SELL', 'SHARES'], W / 2, 260, 180, t, 26.6, { hl: { 'SHARES': C.green } });
  else { kinetic(["OTHER", "PEOPLE'S", 'MONEY'], W / 2, 260, 140, t, 29.4, { hl: { 'MONEY': C.green } }); pill('OPM', W / 2, 410, 60, C.green, seg(t, 30.4, 30.8)); }
});

// 7) 32.45–37.95: risk dağılır, oy hakkı ile kontrol kalır (hisse %20 / oy %60)
scene(32.45, 37.95, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 7, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, t }, () => {
    const p1 = seg(t, 34.2, 35.0), p2 = seg(t, 35.0, 36.0);
    const bar = (y, label, v, col, p) => { txt(label, 140, y - 60, 50, '#fff', { font: 'Anton', weight: 400 }); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(140, y, 800, 110, 24); ctx.fill(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(140, y, Math.max(1, 800 * v / 100 * eo(p)), 110, 24); ctx.fill(); ctx.shadowBlur = 0; txt(Math.round(v * eo(p)) + '%', 940, y - 60, 70, col, { align: 'right', font: 'Anton', weight: 400, glow: col }); };
    bar(620, 'SHARES OWNED', 20, C.blue, p1); bar(900, 'VOTING POWER', 60, C.gold, p2);
    if (p2 > 0) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.setLineDash([12, 10]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(140 + 400, 580); ctx.lineTo(140 + 400, 1060); ctx.stroke(); ctx.setLineDash([]); txt('50%', 540, 1100, 40, C.mute, { align: 'center', weight: 900 }); }
    const cp = eback(seg(t, 36.3, 36.8)); if (cp > 0) { crown(W / 2, 1300, 230 * cp); }
  });
  if (t < 34.0) kinetic(['SPREAD', 'THE', 'RISK'], W / 2, 260, 170, t, 32.6, { hl: { 'RISK': C.blue } });
  else kinetic(['KEEP', 'CONTROL'], W / 2, 260, 180, t, 34.6, { hl: { 'CONTROL': C.gold } });
});

// 8) 37.95–44.25: hisseleri teminat gösterip milyarlar borç al — satmadan, vergisiz
scene(37.95, 44.25, 'push', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(46,230,255,.13)', seed: 8, dot: '120,230,255' });
  cam({ x: d.x, y: d.y, rot: d.rot, t, zoom: punch(t, 41.28, .08) }, () => {
    for (let i = 0; i < 6; i++) { const q = eback(seg(t, 38.3 + i * .08, 38.8 + i * .08)); if (q > 0) shareCert(280, 1150 - i * 26 - (1 - q) * 300, 330, (i % 2 ? .04 : -.04), 'MY COMPANY'); }
    txt('STOCKS', 280, 1320, 50, C.mute, { align: 'center', font: 'Anton', weight: 400 });
    const lp = seg(t, 39.0, 39.8); if (lp > 0) { arrow(560, 1060, 220 * eo(lp), true, lp, { rot: Math.PI / 2, col: C.green, w: 34 });
      ctx.save(); ctx.translate(820, 1080); const s = eback(lp); ctx.scale(s, s); ctx.fillStyle = '#c89a62'; ctx.beginPath(); ctx.ellipse(0, 40, 170, 150, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-60, -90); ctx.lineTo(60, -90); ctx.lineTo(30, -40); ctx.lineTo(-30, -40); ctx.fill(); txt('$1B', 0, 50, 90, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); txt('LOAN', 820, 1300, 50, C.green, { align: 'center', font: 'Anton', weight: 400 }); }
    const tx = seg(t, 40.7, 41.3); if (tx > 0) { ctx.fillStyle = 'rgba(6,9,15,.85)'; ctx.fillRect(140, 470, 800, 220); txt('TAX ON LOAN', W / 2, 530, 50, C.mute, { align: 'center', font: 'Anton', weight: 400 }); txt('$0', W / 2, 630, 130, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green }); }
    const sl = seg(t, 42.1, 42.5); if (sl > 0) { ctx.save(); ctx.globalAlpha = sl; ctx.fillStyle = '#3a3f4b'; ctx.beginPath(); ctx.roundRect(W / 2 - 200, 1380, 400, 110, 55); ctx.fill(); txt('SELL', W / 2 - 30, 1437, 64, '#8a97b0', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); lockIcon(W / 2 + 110, 1440, 70, C.gold); stampX(W / 2, 1435, 160, seg(t, 42.9, 43.2)); }
  });
  if (t < 40.5) kinetic(['BORROW', 'BILLIONS'], W / 2, 260, 170, t, 38.3, { hl: { 'BILLIONS': C.green } });
  else kinetic(['TAX-FREE'], W / 2, 260, 190, t, 40.6, { hl: { 'TAX-FREE': C.green } });
});
function lockIcon(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.arc(0, -s * .2, s * .32, Math.PI, TAU); ctx.lineTo(s * .32, -s * .05); ctx.moveTo(-s * .32, -s * .2); ctx.lineTo(-s * .32, -s * .05); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .1, s, s * .75, s * .12); ctx.fill(); ctx.restore(); }

// 9) 44.25–47.15: riski paylaş, gücü koru
scene(44.25, 47.15, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 9, dot: '255,210,120' });
  const k = eio(seg(t, 44.4, 45.2)); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .4; avatar(W / 2 + Math.cos(a) * 400 * k, 960 + Math.sin(a) * 360 * k, 140, '#5c6779'); if (k > .5) warnTri(W / 2 + Math.cos(a) * 400 * k + 55, 885 + Math.sin(a) * 360 * k, 64, t); }
  const pp = eback(seg(t, 45.6, 46.1)); avatar(W / 2, 960, 170 * Math.max(.6, pp), C.gold); if (pp > 0) crown(W / 2, 780, 170 * pp);
  txt('SHARE THE RISK', W / 2, 270, 110, '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.save(); ctx.globalAlpha = seg(t, 45.5, 45.8); txt('KEEP THE POWER', W / 2, 400, 110, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); ctx.restore();
});

// 10) 47.15–51.95: servet kurmak sadece 1. adım — merdiven
scene(47.15, 51.95, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.16)', seed: 10, dot: '190,160,255' });
  cam({ x: d.x, y: d.y, t }, () => { stairs(25, 1360, 520, seg(t, 48.4, 48.9) > 0 ? 1 : 0, t); if (t > 50.4) qmark(W - 190, 600, 240 * eback(seg(t, 50.4, 50.9)), t, C.violet); });
  if (t < 50.2) kinetic(['JUST', 'STEP', 'ONE'], W / 2, 260, 180, t, 47.4, { hl: { 'ONE': C.gold } });
  else kinetic(['BIGGER', 'QUESTION'], W / 2, 260, 170, t, 50.3, { hl: { 'BIGGER': C.violet } });
});

// 11) 51.95–54.85: en zengin aileler servetlerini nasıl korur? — kalkan
scene(51.95, 54.85, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.2)', seed: 11, dot: '150,200,255' });
  cam({ t, zoom: 1 + .06 * seg(t, 51.95, 54.85) }, () => { for (let r = 0; r < 4; r++) for (let i = 0; i < 4 - r; i++) goldBarMini(W / 2 + (i - (3 - r) / 2) * 170, 1380 - r * 70, 160);
    const sp = eback(seg(t, 53.6, 54.1)); if (sp > 0) { ctx.save(); ctx.translate(W / 2, 950); ctx.scale(sp, sp); shield(0, 0, 520, t); ctx.restore(); } });
  kinetic(['PROTECT', 'FORTUNES?'], W / 2, 260, 150, t, 52.2, { hl: { 'FORTUNES?': C.blue } });
});

// 12) 54.85–59.5: CTA
scene(54.85, 59.5, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 12, dot: '255,140,150' });
  shield(W / 2, 760, 360, t); pill('NEXT: HOW THE RICHEST FAMILIES PROTECT WEALTH', W / 2, 1010, 34, C.gold, seg(t, 55.1, 55.5));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 55.0, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 57.2, 57.6), press = seg(t, 57.9, 58.05) - seg(t, 58.05, 58.2), done = t > 58.05;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 57.3, 57.9))), lerp(1480, 1260, eo(seg(t, 57.3, 57.9))), 1, press);
    if (done) { const k = seg(t, 58.05, 59.1); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 58.05, .15);
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
