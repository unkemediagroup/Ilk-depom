// "How Do the World's Wealthiest Countries Make Their Money?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 56.3;
const SUBY = 1530, CYAN = '#2ee6ff';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function avatar(x, y, s, col = '#8a97b0') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .32, s * .22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, s * .2, s * .38, s * .3, 0, Math.PI, TAU); ctx.fill(); ctx.restore(); }
function funnel(x, y, s) { ctx.save(); ctx.translate(x, y); const g = ctx.createLinearGradient(-s / 2, 0, s / 2, 0); g.addColorStop(0, '#5c6779'); g.addColorStop(.5, '#c9d2de'); g.addColorStop(1, '#5c6779'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-s / 2, 0); ctx.lineTo(s / 2, 0); ctx.lineTo(s * .08, s * .45); ctx.lineTo(s * .08, s * .7); ctx.lineTo(-s * .08, s * .7); ctx.lineTo(-s * .08, s * .45); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a3550'; ctx.beginPath(); ctx.ellipse(0, 0, s / 2, s * .07, 0, 0, TAU); ctx.fill(); ctx.restore(); }
function treasury(x, y, s, fill) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#8a97b0'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .5, s, s * .5, 20); ctx.stroke(); ctx.save(); ctx.beginPath(); ctx.roundRect(-s / 2, -s * .5, s, s * .5, 20); ctx.clip(); ctx.fillStyle = C.gold; ctx.fillRect(-s / 2, -s * .5 * fill, s, s * .5 * fill); ctx.restore(); txt('TREASURY', 0, s * .1, s * .1, C.mute, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
function thermo(x, y, h, lvl, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.roundRect(-50, -h, 100, h, 50); ctx.fill(); ctx.beginPath(); ctx.arc(0, 30, 90, 0, TAU); ctx.fill(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(0, 30, 70, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-30, -h * lvl, 60, h * lvl + 30, 30); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = C.gold; ctx.setLineDash([16, 10]); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-160, -h * .92); ctx.lineTo(160, -h * .92); ctx.stroke(); ctx.setLineDash([]); txt('RICH', 200, -h * .92, 50, C.gold, { font: 'Anton', weight: 400 }); ctx.restore(); }
function circuit(t, p, col = CYAN) { const R = RN(5); ctx.save(); ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 0; i < 26; i++) { let x = W / 2, y = 900; const pts = [[x, y]]; let a = Math.floor(R() * 4) * Math.PI / 2; for (let k = 0; k < 5; k++) { const l = 80 + R() * 160; x += Math.cos(a) * l; y += Math.sin(a) * l; pts.push([x, y]); a += (R() < .5 ? 1 : -1) * Math.PI / 4; }
  const q = clamp(p * 1.5 - i * .02); if (q <= 0) continue; ctx.strokeStyle = col + 'aa'; ctx.beginPath(); const n = Math.max(1, Math.floor(pts.length * q)); for (let k = 0; k < n; k++) k ? ctx.lineTo(pts[k][0], pts[k][1]) : ctx.moveTo(pts[k][0], pts[k][1]); ctx.stroke(); const e = pts[n - 1]; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(e[0], e[1], 10, 0, TAU); ctx.fill();
  const pk = (t * .8 + i * .07) % 1, pi = Math.floor(pk * (n - 1)); if (n > 1) { const a1 = pts[pi], b1 = pts[Math.min(pi + 1, n - 1)], f = pk * (n - 1) - pi; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lerp(a1[0], b1[0], f), lerp(a1[1], b1[1], f), 7, 0, TAU); ctx.fill(); } } ctx.restore(); }
function tollGate(x, y, s, up, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#2a3550'; ctx.beginPath(); ctx.roundRect(-s * .2, -s * .7, s * .4, s * .7, 16); ctx.fill(); ctx.fillStyle = CYAN; ctx.fillRect(-s * .14, -s * .6, s * .28, s * .14); txt('TOLL', 0, -s * .53, s * .07, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(0, -s * .3, s * .08, 0, TAU); ctx.fill(); txt('$', 0, -s * .29, s * .1, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  ctx.save(); ctx.translate(s * .2, -s * .2); ctx.rotate(-up * 1.3); for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#fff' : C.red; ctx.fillRect(i * s * .1, -s * .025, s * .1, s * .05); } ctx.restore(); ctx.restore(); }
function cargo(x, y, s, col, label) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .3, s * .7, s * .3, 8); ctx.fill(); ctx.beginPath(); ctx.roundRect(s * .22, -s * .22, s * .25, s * .22, 8); ctx.fill(); ctx.fillStyle = '#111'; for (const w of [-.35, .05, .35]) { ctx.beginPath(); ctx.arc(w * s, 0, s * .07, 0, TAU); ctx.fill(); } txt(label, -s * .15, -s * .15, s * .1, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function oilSea(y, t) { const g = ctx.createLinearGradient(0, y, 0, H); g.addColorStop(0, '#2a2016'); g.addColorStop(1, '#050302'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * .015 + t * 1.5) * 18); ctx.lineTo(W, H); ctx.fill(); ctx.strokeStyle = 'rgba(255,190,90,.35)'; ctx.lineWidth = 4; ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * .015 + t * 1.5) * 18); ctx.stroke(); }
function rig(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#5c6779'; ctx.fillRect(-s * .4, -s * .2, s * .8, s * .12); for (const sx of [-.32, .32]) ctx.fillRect(sx * s - s * .03, -s * .1, s * .06, s * .4); ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.moveTo(-s * .15, -s * .2); ctx.lineTo(0, -s * .7); ctx.lineTo(s * .15, -s * .2); ctx.stroke(); ctx.fillStyle = '#ff9d1f'; ctx.beginPath(); ctx.arc(s * .32, -s * .3, s * .05, 0, TAU); ctx.fill(); ctx.restore(); }
function planet(x, y, r, t, lit) { ctx.save(); ctx.translate(x, y); const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, '#3b8be0'); g.addColorStop(1, '#0a2347'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = '#2f8f4e'; [[-.3, -.2, .35], [.35, .15, .3], [-.05, .45, .22]].forEach(([a, b, c]) => { ctx.beginPath(); ctx.arc(a * r + Math.sin(t * .3) * 20, b * r, c * r, 0, TAU); ctx.fill(); });
  if (lit > 0) { const R = RN(3); for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(255,230,140,${lit * (.5 + .5 * Math.sin(t * 5 + i))})`; ctx.beginPath(); ctx.arc((R() - .5) * 1.6 * r, (R() - .5) * 1.6 * r, 5, 0, TAU); ctx.fill(); } } ctx.restore(); ctx.restore(); }
function magnet(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.lineWidth = s * .26; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, s * .35, Math.PI, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * .35, 0); ctx.lineTo(-s * .35, s * .3); ctx.moveTo(s * .35, 0); ctx.lineTo(s * .35, s * .3); ctx.stroke(); ctx.fillStyle = '#d6dde8'; ctx.fillRect(-s * .48, s * .25, s * .26, s * .16); ctx.fillRect(s * .22, s * .25, s * .26, s * .16); ctx.restore(); }
function corp(x, y, s, label) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#18213a'; ctx.fillRect(-s * .22, -s, s * .44, s); ctx.fillStyle = C.blue; ctx.fillRect(-s * .22, -s - 14, s * .44, 14); for (let r = 0; r < 8; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = 'rgba(160,210,255,.6)'; ctx.fillRect(-s * .17 + c * s * .13, -s + 30 + r * s * .11, s * .08, s * .06); } txt(label, 0, s * .1, s * .12, '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
function rulebook(x, y, s, open) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#7a1020'; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .35, s, s * .7, 16); ctx.fill(); ctx.fillStyle = '#f5ecd2'; ctx.fillRect(-s * .46, -s * .31, s * .92 * open, s * .62); ctx.fillStyle = C.gold; ctx.fillRect(-s * .02, -s * .35, s * .04, s * .7);
  txt('GLOBAL', -s * .25, -s * .12, s * .09, open > .5 ? '#3a2a10' : C.gold, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('RULES', -s * .25, s * .02, s * .09, open > .5 ? '#3a2a10' : C.gold, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); if (open > .5) { ctx.fillStyle = 'rgba(60,40,10,.35)'; for (let i = 0; i < 6; i++) ctx.fillRect(s * .06, -s * .22 + i * s * .08, s * .36, s * .03); } ctx.restore(); }
function puppet(x, y, s, t, i, col) { const sw = Math.sin(t * 2.4 + i) * 20; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; for (const dx of [-s * .35, 0, s * .35]) { ctx.beginPath(); ctx.moveTo(x + dx, 420); ctx.lineTo(x + dx + sw, y - s * .5 + (dx ? s * .3 : 0)); ctx.stroke(); }
  ctx.save(); ctx.translate(x + sw, y); ctx.rotate(Math.sin(t * 2.4 + i) * .1); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .3, s * .2, 0, TAU); ctx.fill(); ctx.fillRect(-s * .22, -s * .1, s * .44, s * .5); ctx.fillRect(-s * .4, -s * .1, s * .16, s * .35); ctx.fillRect(s * .24, -s * .1, s * .16, s * .35); ctx.restore(); }
function drain(x, y, r, t, p) { ctx.save(); ctx.translate(x, y); for (let i = 0; i < 6; i++) { ctx.strokeStyle = `rgba(155,107,255,${.18 + i * .1})`; ctx.lineWidth = 8; ctx.beginPath(); for (let k = 0; k <= 60; k++) { const a = k / 60 * TAU * 1.5 + t * 3 + i, rr = r * (1 - k / 60) * (1 - i * .12); k ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * .45) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr * .45); } ctx.stroke(); }
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, 0, r * .18, r * .08, 0, 0, TAU); ctx.fill();
  for (let i = 0; i < 12; i++) { const k = (t * .5 + i / 12) % 1, a = k * TAU * 2 + i, rr = r * (1 - k); if (p > 0) bill(Math.cos(a) * rr, Math.sin(a) * rr * .45 - (1 - k) * 60, 120 * (1 - k * .8), a, { flip: Math.cos(t * 3 + i) }); } ctx.restore(); }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–4.85 HOOK: vatandaşlardan vergi hunisi → hazine
scene(0, 4.85, 'push', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.16)', seed: 1, dot: '255,210,120' });
  cam({ t, zoom: lerp(1.25, 1, eo(seg(t, 0, 1))) }, () => {
    for (let i = 0; i < 7; i++) avatar(120 + i * 140, 560, 110, ['#5c6779', '#6b7383'][i % 2]);
    for (let i = 0; i < 14; i++) { const k = (t * 1.1 + i / 14) % 1, sx = 120 + (i % 7) * 140; coin(lerp(sx, W / 2, k * k), lerp(640, 960, k), 26, t * 6 + i); }
    funnel(W / 2, 880, 560); treasury(W / 2, 1420, 520, .15 + .12 * seg(t, 0, 4.8));
  });
  kinetic(['COLLECTING', 'TAXES?'], W / 2, 270, 150, t, 1.6, { hl: { 'TAXES?': C.gold } });
  if (t < 1.6) kinetic(['RICHEST', 'COUNTRIES'], W / 2, 270, 150, t, .05, { hl: { 'RICHEST': C.gold } });
  flash(t, 0, .2);
});

// 2) 4.85–7.55: yetmez — termometre zenginliğe ulaşamaz
scene(4.85, 7.55, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.16)', seed: 2, dot: '255,140,150' });
  const l = .18 + .05 * Math.sin(t * 9) * seg(t, 6.0, 6.5); thermo(W / 2 - 80, 1360, 800, eo(seg(t, 5.0, 5.9)) * l, C.red);
  stampText('NOT ENOUGH', W / 2, 960, 110, C.red, seg(t, 6.2, 6.5), -.08);
  kinetic(['NOWHERE', 'NEAR'], W / 2, 270, 180, t, 5.2, { hl: { 'NOWHERE': C.red } });
});

// 3) 7.55–13.95: küresel sistemlere hükmetmek — devre kartı dünyası
scene(7.55, 13.95, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(46,230,255,.16)', seed: 3, dot: '120,230,255', top: '#04121c', bot: '#010407' });
  cam({ t, zoom: 1 + .1 * seg(t, 7.55, 13.95), rot: Math.sin(t * .4) * .02 }, () => { circuit(t, seg(t, 10.9, 13.4)); ctx.fillStyle = '#0d1424'; ctx.strokeStyle = CYAN; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(W / 2 - 150, 750, 300, 300, 30); ctx.fill(); ctx.stroke(); txt('$', W / 2, 905, 200, CYAN, { align: 'center', font: 'Anton', weight: 400, glow: CYAN, stroke: 0 }); });
  if (t < 10.8) kinetic(['HOW', 'DO', 'THEY', 'EARN?'], W / 2, 270, 150, t, 7.9, { hl: { 'EARN?': C.gold } });
  else kinetic(['DOMINATE', 'SYSTEMS'], W / 2, 270, 160, t, 11.6, { hl: { 'DOMINATE': CYAN } });
});

// 4) 13.95–22.35: süper güçler finans ağını ve rezerv parayı kontrol eder — herkes iş yapmak için gişe öder
scene(13.95, 22.35, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.15)', seed: 4, dot: '150,200,255' });
  cam({ x: d.x, y: d.y, t }, () => {
    ctx.fillStyle = '#1b2235'; ctx.fillRect(0, 1210, W, 160); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.setLineDash([40, 30]); ctx.lineDashOffset = -t * 200; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 1290); ctx.lineTo(W, 1290); ctx.stroke(); ctx.setLineDash([]);
    const cols = [C.red, C.green, C.violet, '#ff8a3d', C.blue], labs = ['EU', 'ASIA', 'LATAM', 'AFRICA', 'MID-E']; let up = 0;
    for (let i = 0; i < 5; i++) { const ph = ((t - 14.6) * .28 + i * .2) % 1, x = lerp(-200, W + 200, ph); if (t < 14.6) continue; const near = 1 - Math.min(1, Math.abs(x - 640) / 160); up = Math.max(up, near); cargo(x, 1290, 260, cols[i], labs[i]); if (Math.abs(x - 640) < 30) { const k = (x - 610) / 60; coin(640 + 40, 1100 - k * 200, 30, t * 9); } }
    tollGate(640, 1220, 520, eo(up), t); txt('US FINANCIAL NETWORK', W / 2, 640, 56, C.blue, { align: 'center', font: 'Anton', weight: 400, glow: C.blue });
    if (t > 17.4) pill('RESERVE CURRENCY: $', W / 2, 760, 52, C.green, seg(t, 17.4, 17.8));
    if (t > 19.6) { counter(0, 9.9e9, W / 2, 1460 - 470, 100, seg(t, 19.6, 22.2), { col: C.green, fmt: v => '+' + fmtMoney(v), ease: x => x }); }
  });
  if (t < 18.6) kinetic(['SUPERPOWERS'], W / 2, 270, 180, t, 14.3, { hl: { 'SUPERPOWERS': C.blue } });
  else kinetic(['WORLD', 'PAYS', 'THEM'], W / 2, 270, 180, t, 19.6, { hl: { 'PAYS': C.green } });
});

// 5) 22.35–27.15: petrol okyanusları üzerindeki ülkeler gezegeni çalıştıran enerjiyi satar
scene(22.35, 27.15, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,157,31,.16)', seed: 5, dot: '255,190,120', top: '#140c04', bot: '#030201' });
  const lit = seg(t, 25.5, 26.6); planet(W / 2 + 220, 700, 240, t, lit); oilSea(1150, t); [[200, 1150], [480, 1160], [760, 1150]].forEach(([x, y], i) => rig(x, y + Math.sin(t * 1.5 + i) * 10, 300));
  if (t > 24.9) { const p = seg(t, 24.9, 25.6); ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 10; ctx.shadowColor = '#ffd36b'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.moveTo(480, 940); ctx.quadraticCurveTo(560, 820, lerp(480, W / 2 + 60, p), lerp(940, 760, p)); ctx.stroke(); ctx.shadowBlur = 0; }
  kinetic(['OCEANS', 'OF', 'OIL'], W / 2, 270, 180, t, 23.2, { hl: { 'OIL': '#ff9d1f' } });
});

// 6) 27.15–38.45: İrlanda ve Lüksemburg gibi küçük ülkeler: dev vergi indirimiyle mega şirketleri mıknatıs gibi çeker
scene(27.15, 38.45, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.14)', seed: 6 });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    const c1 = eback(seg(t, 29.3, 29.8)), c2 = eback(seg(t, 30.1, 30.6));
    if (c1 > 0) { ctx.save(); ctx.translate(270, 1250); ctx.scale(c1, c1); ctx.fillStyle = '#169b62'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fill(); ctx.restore(); txt('IRELAND', 270, 1360, 50, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
    if (c2 > 0) { ctx.save(); ctx.translate(810, 1250); ctx.scale(c2, c2); ctx.fillStyle = '#00a2e1'; ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fill(); ctx.restore(); txt('LUXEMBOURG', 810, 1360, 50, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
    const mg = seg(t, 32.4, 33.0); if (mg > 0) { magnet(270, 1110, 220 * eback(mg), Math.PI); magnet(810, 1110, 220 * eback(mg), Math.PI); priceTag3(W / 2, 1180, 'TAX CUT %', seg(t, 33.2, 33.7)); }
    const pull = eio(seg(t, 34.4, 37.0)); ['MEGA CORP', 'MEGA CORP', 'MEGA CORP'].forEach((lab, i) => { const x0 = 200 + i * 340, x = lerp(x0, i < 2 ? 270 + i * 0 : 810, pull * .55), y = lerp(780, 860, pull); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 6 + i) * .03 * pull); corp(0, 0, 300, lab); ctx.restore(); });
    if (t > 35.0) { for (let i = 0; i < 12; i++) { const k = (t * 1.1 + i / 12) % 1, tx = i % 2 ? 270 : 810; coin(lerp(200 + (i % 3) * 340, tx, k), lerp(820, 1240, k), 24, t * 7 + i); } }
  });
  if (t < 32.2) kinetic(['TINY', 'COUNTRIES'], W / 2, 270, 170, t, 28.6, { hl: { 'TINY': C.green } });
  else if (t < 34.4) kinetic(['HUGE', 'TAX', 'CUTS'], W / 2, 270, 180, t, 32.5, { hl: { 'CUTS': C.gold } });
  else kinetic(['PULL', 'IN', 'BILLIONS'], W / 2, 270, 170, t, 34.5, { hl: { 'BILLIONS': C.green } });
});
function priceTag3(x, y, label, p) { if (p <= 0) return; ctx.save(); ctx.translate(x, y); const e = eback(p); ctx.scale(e, e); ctx.rotate(-.1); ctx.font = '400 60px Anton'; const w = ctx.measureText(label).width + 90, h = 90; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - 30, -h / 2); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 - 30, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill(); txt(label, -10, 3, 60, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }

// 7) 38.45–42.75: sadece katılmazlar — kuralların sahibidirler
scene(38.45, 42.75, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 7, dot: '255,210,120', top: '#151005', bot: '#040301' });
  cam({ t, zoom: 1 + .06 * seg(t, 38.45, 42.75) }, () => { rulebook(W / 2, 960, 760, eio(seg(t, 39.2, 40.2))); stampText('OWNED', W / 2 + 120, 1220, 110, C.gold, seg(t, 41.3, 41.6), -.1); });
  if (t < 41.0) kinetic(['NOT', 'PLAYERS'], W / 2, 270, 180, t, 38.7, { hl: { 'PLAYERS': C.mute } });
  else kinetic(['THEY', 'OWN', 'THE', 'RULES'], W / 2, 270, 160, t, 41.0, { hl: { 'RULES': C.gold } });
});

// 8) 42.75–46.25: en zengin uluslar bile piyasaların insafında — iplere bağlı kuklalar
scene(42.75, 46.25, 'whipL', t => {
  bgFinance(t, { tint: 'rgba(155,107,255,.18)', seed: 8, dot: '190,160,255' });
  const pts = []; for (let i = 0; i <= 40; i++) pts.push([i / 40 * W, 400 + Math.sin(i * .6 + t * 3) * 30 + Math.sin(i * 1.7) * 18]); ctx.strokeStyle = C.violet; ctx.lineWidth = 10; ctx.shadowColor = C.violet; ctx.shadowBlur = 25; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.shadowBlur = 0; txt('MARKETS', 140, 360, 44, C.violet, { font: 'Anton', weight: 400 });
  [[240, 1050, C.gold], [540, 1100, C.blue], [840, 1050, C.green]].forEach(([x, y, c], i) => puppet(x, y, 300, t, i, c));
  kinetic(['AT', 'THE', 'MERCY'], W / 2, 270, 170, t, 44.4, { hl: { 'MERCY': C.violet } });
});

// 9) 46.25–51.95: piyasa çöktüğünde milyarlar nereye gider? — girdap
scene(46.25, 51.95, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(155,107,255,.2)', seed: 9, dot: '190,160,255', top: '#0c0618', bot: '#020105' });
  const f = eio(seg(t, 49.4, 51.4)); const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; if (u > f) break; pts.push([120 + u * 420, 560 + Math.pow(u, 2) * 520]); } ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.shadowColor = C.red; ctx.shadowBlur = 25; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
  drain(W / 2 + 80, 1180, 420, t, 1); qmark(W - 170, 640, 200 * eback(seg(t, 50.8, 51.3)), t, C.violet);
  if (t < 49.0) kinetic(['BIGGER', 'QUESTION'], W / 2, 270, 170, t, 46.6, { hl: { 'BIGGER': C.gold } });
  else kinetic(['WHERE', 'DOES', 'IT', 'GO?'], W / 2, 270, 160, t, 49.0, { hl: { 'GO?': C.violet } });
});

// 10) 51.95–56.3: CTA
scene(51.95, 56.3, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 10, dot: '255,140,150' });
  ctx.save(); ctx.translate(0, -380); drain(W / 2, 1150, 260, t, 1); ctx.restore(); pill('NEXT: WHERE THE MONEY GOES IN A CRASH', W / 2, 1010, 38, C.gold, seg(t, 52.2, 52.6));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 52.1, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 53.8, 54.2), press = seg(t, 54.5, 54.65) - seg(t, 54.65, 54.8), done = t > 54.65;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 53.9, 54.5))), lerp(1480, 1260, eo(seg(t, 53.9, 54.5))), 1, press);
    if (done) { const k = seg(t, 54.65, 55.7); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 54.65, .15);
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
    ctx.fillStyle = `rgba(155,107,255,${.12 * a})`; ctx.fillRect(0, 0, W, H); return; }
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
