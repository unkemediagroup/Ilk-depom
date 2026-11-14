// "What Happens If a Billionaire Loses Their Money?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 57.25;
const SUBY = 1530, TEAL = '#28e0c0';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function avatar(x, y, s, col = '#8a97b0') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .32, s * .22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, s * .2, s * .38, s * .3, 0, Math.PI, TAU); ctx.fill(); ctx.restore(); }
function hq(x, y, w, h, t, col = C.red, label = 'CORP') { ctx.fillStyle = '#18213a'; ctx.fillRect(x - w / 2, y - h, w, h); for (let r = 0; r < Math.floor(h / 70); r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = Math.sin(r * 3.1 + c * 1.7 + Math.floor(t * 2)) > -.3 ? 'rgba(255,220,140,.7)' : '#0d1424'; ctx.fillRect(x - w / 2 + 16 + c * (w - 32) / 4, y - h + 30 + r * 70, (w - 32) / 4 - 14, 40); }
  ctx.fillStyle = col; ctx.fillRect(x - w / 2, y - h - 60, w, 60); txt(label, x, y - h - 30, 44, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }
function crumble(x, y, w, h, k, seed) { const R = RN(seed); const n = 30; for (let i = 0; i < n; i++) { const bx = x - w / 2 + R() * w, by = y - R() * h, vx = (R() - .5) * 500, e = k; ctx.save(); ctx.translate(bx + vx * e, by + (y - by) * eio(e) + 200 * e * e * R()); ctx.rotate((R() - .5) * 5 * e); ctx.fillStyle = R() < .3 ? 'rgba(255,220,140,.6)' : '#18213a'; ctx.fillRect(-40, -30, 80, 60); ctx.restore(); }
  if (k > .1) { ctx.fillStyle = `rgba(150,150,170,${.5 * Math.sin(k * Math.PI)})`; ctx.beginPath(); ctx.ellipse(x, y, w * (1 + k), 140 * k, 0, 0, TAU); ctx.fill(); } }
function wreckBall(px, py, len, ang, r) { const bx = px + Math.sin(ang) * len, by = py + Math.cos(ang) * len; ctx.strokeStyle = '#8a97b0'; ctx.lineWidth = 8; ctx.setLineDash([18, 8]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
  const g = ctx.createRadialGradient(bx - r * .3, by - r * .3, r * .1, bx, by, r); g.addColorStop(0, '#6b7383'); g.addColorStop(1, '#14181f'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill(); return [bx, by]; }
function parachute(x, y, s, col, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2) * .08); const g = ctx.createLinearGradient(-s, -s, s, 0); g.addColorStop(0, '#fff1a8'); g.addColorStop(1, col); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -s * .6, s * .8, Math.PI, TAU); for (let i = 4; i >= 0; i--) ctx.quadraticCurveTo(-s * .8 + (i + .5) * s * .32, -s * .5, -s * .8 + i * s * .32, -s * .6); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 3; for (const a of [-.8, -.4, .4, .8]) { ctx.beginPath(); ctx.moveTo(a * s, -s * .6); ctx.lineTo(0, s * .15); ctx.stroke(); } avatar(0, s * .4, s * .5, col); txt('$', 0, -s * .9, s * .4, '#7a5a00', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function ledBoard(x, y, w, h, msg, t, col = C.red) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#05070b'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 20); ctx.fill(); ctx.strokeStyle = '#2a3550'; ctx.lineWidth = 8; ctx.stroke(); ctx.beginPath(); ctx.rect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28); ctx.clip();
  ctx.font = `900 ${h * .5}px Montserrat`; const mw = ctx.measureText(msg).width + 200, off = (t * 380) % mw; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 25; ctx.textBaseline = 'middle'; for (let k = 0; k < 3; k++) ctx.fillText(msg, w / 2 - off + k * mw - mw, 4); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let i = -w / 2; i < w / 2; i += 8) ctx.fillRect(i, -h / 2, 3, h); ctx.restore(); }
function fireBills(x, y, s, t, k) { const R = RN(4); for (let i = 0; i < 10; i++) bill(x + (R() - .5) * s, y - R() * s * .25, s * .5, (R() - .5) * .8, {}); for (let i = 0; i < 26; i++) { const ph = (t * 1.4 + R()) % 1, fx = x + (R() - .5) * s * .9, fy = y - s * .1 - ph * s * .8 * k; ctx.fillStyle = ['#ff3b1f', '#ff9d1f', '#ffd36b'][i % 3]; ctx.globalAlpha = (1 - ph) * k; ctx.beginPath(); ctx.ellipse(fx, fy, 26 * (1 - ph) + 8, 50 * (1 - ph) + 10, 0, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
function wallet(x, y, s, col = '#3a2a1a') { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .35, s, s * .7, s * .08); ctx.fill(); ctx.fillStyle = '#5a3e22'; ctx.beginPath(); ctx.roundRect(s * .1, -s * .14, s * .45, s * .28, s * .05); ctx.fill(); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(s * .3, 0, s * .05, 0, TAU); ctx.fill(); bill(0, -s * .38, s * .7, -.05, {}); ctx.restore(); }
function lockIcon(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.arc(0, -s * .2, s * .32, Math.PI, TAU); ctx.moveTo(s * .32, -s * .2); ctx.lineTo(s * .32, -s * .05); ctx.moveTo(-s * .32, -s * .2); ctx.lineTo(-s * .32, -s * .05); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .1, s, s * .75, s * .12); ctx.fill(); ctx.restore(); }
function brickWall(x, top, bottom, w, p) { const bh = 56, rows = Math.ceil((bottom - top) / bh); for (let r = 0; r < rows; r++) { const q = eback(clamp(p * rows * .35 - r * .35 + rows * .0)); const ri = rows - 1 - r; if (q <= 0) continue; const yy = bottom - (r + 1) * bh; for (let c = 0; c < 2; c++) { const xx = x - w / 2 + (r % 2 ? -w / 4 : 0) + c * w / 2; ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, yy - 400, w, 800); ctx.clip(); ctx.translate(0, (1 - q) * -300); ctx.fillStyle = (r + c) % 3 ? '#a8432c' : '#bb5236'; ctx.fillRect(xx + 3, yy + 3, w / 2 - 6, bh - 6); ctx.restore(); } } }
function mansion(x, y, s, col = C.gold) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#e9eef5'; ctx.fillRect(-s * .5, -s * .35, s, s * .45); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s * .58, -s * .33); ctx.lineTo(0, -s * .62); ctx.lineTo(s * .58, -s * .33); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a3550'; for (let i = 0; i < 4; i++) ctx.fillRect(-s * .42 + i * s * .24, -s * .25, s * .12, s * .14); ctx.fillStyle = col; ctx.fillRect(-s * .08, -s * .06, s * .16, s * .16); ctx.restore(); }
function trustDoc(x, y, w) { const h = w * 1.3; ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f5ecd2'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 10); ctx.fill(); txt('TRUST', 0, -h * .3, w * .22, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = 'rgba(60,40,10,.35)'; for (let i = 0; i < 5; i++) ctx.fillRect(-w * .35, -h * .08 + i * h * .08, w * .7, h * .03); ctx.fillStyle = '#b3122a'; ctx.beginPath(); ctx.arc(w * .22, h * .35, w * .1, 0, TAU); ctx.fill(); ctx.restore(); }
function island(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#1d6fd1'; ctx.beginPath(); ctx.ellipse(0, s * .1, s * .7, s * .12, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#f1d38a'; ctx.beginPath(); ctx.ellipse(0, 0, s * .45, s * .12, 0, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = s * .05; ctx.beginPath(); ctx.moveTo(0, -s * .05); ctx.quadraticCurveTo(s * .08, -s * .35, -s * .02, -s * .6); ctx.stroke(); ctx.fillStyle = C.green; for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(-s * .02, -s * .6); ctx.rotate(-Math.PI / 2 + (i - 2) * .6 + Math.sin(t * 2) * .05); ctx.beginPath(); ctx.ellipse(s * .2, 0, s * .22, s * .05, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = C.gold; ctx.fillRect(s * .1, -s * .14, s * .16, s * .1); txt('$', s * .18, -s * .09, s * .08, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function sprout(x, y, s, g, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#5a3e22'; ctx.beginPath(); ctx.ellipse(0, 0, s * .45, s * .1, 0, 0, TAU); ctx.fill(); const h = s * g; ctx.strokeStyle = C.green; ctx.lineWidth = s * .06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(Math.sin(t * 2) * 20, -h * .5, 0, -h); ctx.stroke();
  ctx.fillStyle = C.green; for (const sd of [-1, 1]) { ctx.save(); ctx.translate(0, -h * .7); ctx.rotate(sd * .7); ctx.scale(g, g); ctx.beginPath(); ctx.ellipse(sd * s * .18, 0, s * .2, s * .08, 0, 0, TAU); ctx.fill(); ctx.restore(); } if (g > .6) coin(0, -h - s * .1, s * .14 * g, t * 4); ctx.restore(); }
function mask(x, y, s, sad, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, s * .4, s * .5, 0, 0, TAU); ctx.fill(); ctx.fillStyle = C.ink; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * s * .15, -s * .1, s * .09, s * .05, sd * (sad ? -.4 : .4), 0, TAU); ctx.fill(); } ctx.strokeStyle = C.ink; ctx.lineWidth = s * .05; ctx.beginPath(); if (sad) ctx.arc(0, s * .3, s * .15, Math.PI * 1.15, Math.PI * 1.85); else ctx.arc(0, s * .12, s * .15, Math.PI * .15, Math.PI * .85); ctx.stroke(); ctx.restore(); }
function podium(x, y, w, t, p) { const hs = [260, 380, 190], order = [1, 0, 2], syms = ['€', '$', '¥'], cols = ['#c9d2de', C.gold, '#cd7f32']; for (let i = 0; i < 3; i++) { const h = hs[i] * eo(clamp(p * 1.6 - order[i] * .25)), px = x + (i - 1) * w / 3; ctx.fillStyle = cols[i]; ctx.fillRect(px - w / 6 + 6, y - h, w / 3 - 12, h); txt(String([2, 1, 3][i]), px, y - h + 50, 70, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  if (h > 40) { const sc = i === 1 ? 1.4 : 1; txt(syms[i], px, y - h - 90 * sc + Math.sin(t * 3 + i) * 8, 130 * sc, cols[i], { align: 'center', font: 'Anton', weight: 400, glow: cols[i] }); } } }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–5.0 HOOK: yıkım topu şirket kulesine çarpar — BANKRUPT
scene(0, 5.0, 'push', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.16)', seed: 1, dot: '255,140,150' });
  const hit = 2.5, swing = t < hit ? lerp(-1.1, .25, eio(seg(t, 0, hit))) : .25 + Math.sin((t - hit) * 6) * .1 * Math.exp(-(t - hit) * 2), k = seg(t, hit, hit + 1.8);
  cam({ t, shake: t > hit && t < hit + .6 ? 18 : 0, zoom: lerp(1.2, 1, eo(seg(t, 0, 1.5))) }, () => {
    if (k < .05) hq(W / 2 + 120, 1420, 420, 880, t, C.red, 'COMPANY'); else crumble(W / 2 + 120, 1420, 420, 880, k, 7);
    wreckBall(W / 2 - 360, 260, 900, swing, 150);
    if (t > hit + .2) stampText('BANKRUPT', W / 2, 860, 130, C.red, seg(t, hit + .2, hit + .5), -.1);
  });
  kinetic(['LOSE', 'EVERYTHING?'], W / 2, 280, 160, t, 3.6, { hl: { 'EVERYTHING?': C.red } });
  if (t < 3.6) kinetic(['COMPANY', 'BANKRUPT'], W / 2, 280, 150, t, .1, { hl: { 'BANKRUPT': C.red } });
  flash(t, 0, .2, '255,59,78'); flash(t, hit, .15);
});

// 2) 5.0–8.6: ultra zenginler normal insanlar gibi batmaz — altın paraşüt
scene(5.0, 8.6, 'whipU', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 2, dot: '150,200,255', top: '#0d1b33', bot: '#04080f' });
  for (let i = 0; i < 14; i++) { const k = (t * 1.5 + i / 14) % 1; ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(60 + i * 72, H - k * H, 4, 90); }
  const fall = seg(t, 5.2, 8.6); avatar(280, lerp(500, 1500, fall * fall), 150, '#7a8597'); txt('NORMAL', 280, lerp(500, 1500, fall * fall) - 140, 46, '#bbb', { align: 'center', font: 'Anton', weight: 400 });
  parachute(760, 760 + Math.sin(t * 1.5) * 30, 300, C.gold, t); txt('ULTRA-RICH', 760, 1090, 52, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold });
  kinetic(["DON'T", 'GO', 'BROKE'], W / 2, 280, 180, t, 5.6, { hl: { 'BROKE': C.red } });
});

// 3) 8.6–12.3: soru — LED pano kayar
scene(8.6, 12.3, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.14)', seed: 3, dot: '255,140,150' });
  cam({ t, rot: -.04, zoom: 1 + .05 * seg(t, 8.6, 12.3) }, () => { ledBoard(W / 2, 780, 1000, 220, 'BILLIONAIRE LOSES IT ALL ▼▼▼', t, C.red); ledBoard(W / 2, 1080, 1000, 220, 'WHAT HAPPENS NEXT? ? ?', t * 1.2 + 3, C.gold); });
  qmark(W / 2, 1360, 200 * eback(seg(t, 10.8, 11.3)), t, C.gold);
  kinetic(['WHAT', 'HAPPENS?'], W / 2, 280, 180, t, 9.0, { hl: { 'HAPPENS?': C.gold } });
});

// 4) 12.3–18.1: kendi parasını değil başkalarının parasını kaybeder
scene(12.3, 18.1, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.12)', seed: 4 });
  cam({ x: d.x, y: d.y, t }, () => {
    wallet(280, 900, 300); lockIcon(280, 1110, 110, C.green); txt('OWN CASH', 280, 1260, 56, C.green, { align: 'center', font: 'Anton', weight: 400 }); if (t > 14.3) pill('SAFE', 280, 640, 50, C.green, seg(t, 14.3, 14.7));
    const fp = seg(t, 15.8, 16.6); for (let i = 0; i < 5; i++) avatar(640 + (i % 3) * 140, 640 + Math.floor(i / 3) * 150, 110, ['#5c6779', '#6b7383'][i % 2]); fireBills(780, 1150, 380, t, fp);
    txt("OTHER PEOPLE'S", 780, 1260, 48, C.red, { align: 'center', font: 'Anton', weight: 400 }); txt('MONEY', 780, 1320, 48, C.red, { align: 'center', font: 'Anton', weight: 400 });
    ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(W / 2 - 40, 560, 4, 800);
  });
  if (t < 15.9) kinetic(['NEVER', 'THEIR', 'OWN'], W / 2, 280, 170, t, 13.4, { hl: { 'OWN': C.green } });
  else kinetic(["OTHERS'", 'MONEY'], W / 2, 280, 170, t, 16.0, { hl: { "OTHERS'": C.red } });
});

// 5) 18.1–23.8: krizden çok önce kişisel servet ile iş riski arasına yasal duvar örülür
const WALL = { x: W / 2, top: 560, bottom: 1400, w: 110 };
function personalSide(t, show) { mansion(260, 1300, 320); if (show >= 1) { trustDoc(150, 820, 140); } if (show >= 2) island(330, 950, 260, t); txt('PERSONAL', 260, 1380, 50, C.gold, { align: 'center', font: 'Anton', weight: 400 }); }
scene(18.1, 23.8, 'iris', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.12)', seed: 5, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, t }, () => { personalSide(t, 0); hq(800, 1340, 280, 620, t, C.red, 'BUSINESS'); txt('RISK', 800, 1390, 50, C.red, { align: 'center', font: 'Anton', weight: 400 }); brickWall(WALL.x, WALL.top, WALL.bottom, WALL.w, seg(t, 20.2, 22.8)); });
  kinetic(['LEGALLY', 'SEPARATE'], W / 2, 280, 160, t, 20.2, { hl: { 'SEPARATE': C.gold } });
  if (t < 20.2) kinetic(['BEFORE', 'THE', 'CRASH'], W / 2, 280, 160, t, 18.3, { hl: { 'CRASH': C.red } });
});

// 6) 23.8–27.25: imparatorluk çöker, şirket iflas eder — enkaz duvarda durur
scene(23.8, 27.25, 'cut', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.16)', seed: 6, dot: '255,140,150' });
  const k = eio(seg(t, 24.7, 26.4));
  cam({ t, shake: t > 24.7 && t < 25.8 ? 12 : 0 }, () => { personalSide(t, 0); if (k < .05) hq(800, 1340, 280, 620, t, C.red, 'BUSINESS'); else { ctx.save(); ctx.beginPath(); ctx.rect(WALL.x + WALL.w / 2, 0, W, H); ctx.clip(); crumble(800, 1340, 280, 620, k, 3); ctx.restore(); } brickWall(WALL.x, WALL.top, WALL.bottom, WALL.w, 1);
    if (t > 26.0) stampText('BANKRUPT', 800, 900, 80, C.red, seg(t, 26.0, 26.3), .1); });
  kinetic(['EMPIRE', 'COLLAPSES'], W / 2, 280, 160, t, 24.0, { hl: { 'COLLAPSES': C.red } });
  flash(t, 24.72, .15, '255,59,78');
});

// 7) 27.25–33.75: malikaneler, gizli trustlar, offshore hesaplar — DOKUNULMAZ
scene(27.25, 33.75, 'zoom', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 7, dot: '255,210,120', top: '#151005', bot: '#040301' });
  cam({ x: d.x, y: d.y, t, zoom: punch(t, 32.38, .08) }, () => {
    const a1 = eback(seg(t, 27.9, 28.4)), a2 = eback(seg(t, 29.2, 29.7)), a3 = eback(seg(t, 30.2, 30.7));
    if (a1 > 0) { ctx.save(); ctx.translate(W / 2, 760); ctx.scale(a1, a1); mansion(0, 0, 440); ctx.restore(); txt('MANSIONS', W / 2, 840, 48, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
    if (a2 > 0) { ctx.save(); ctx.translate(250, 1130); ctx.scale(a2, a2); trustDoc(0, 0, 200); ctx.restore(); txt('HIDDEN TRUSTS', 250, 1310, 44, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
    if (a3 > 0) { ctx.save(); ctx.translate(800, 1210); ctx.scale(a3, a3); island(0, 0, 360, t); ctx.restore(); txt('OFFSHORE', 800, 1310, 44, '#fff', { align: 'center', font: 'Anton', weight: 400 }); }
    const u = seg(t, 31.6, 32.4); if (u > 0) { ctx.strokeStyle = `rgba(40,224,192,${u})`; ctx.lineWidth = 10; ctx.shadowColor = TEAL; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(70, 470, 940, 900, 50); ctx.stroke(); ctx.shadowBlur = 0; }
    stampText('UNTOUCHED', W / 2, 990, 110, TEAL, seg(t, 32.3, 32.6), -.06);
  });
  kinetic(['PRIVATE', 'WEALTH'], W / 2, 280, 170, t, 27.5, { hl: { 'WEALTH': C.gold } });
});

// 8) 33.75–40.35: kağıt üstündeki servet sıfırlansa da yatırımcı ağı bir sonraki girişimi fonlar
scene(33.75, 40.35, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.14)', seed: 8 });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    if (t < 36.0) { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(160, 640, 760, 300, 30); ctx.fill(); txt('NET WORTH (ON PAPER)', W / 2, 700, 44, C.mute, { align: 'center', font: 'Anton', weight: 400 }); counter(40e9, 0, W / 2, 830, 140, seg(t, 34.2, 35.4), { col: C.red, ease: eio }); }
    else { const nodes = [[160, 640], [920, 640], [120, 980], [960, 980], [260, 1300], [820, 1300], [540, 560]]; const cx = W / 2, cy = 1020, np = seg(t, 36.2, 37.6);
      nodes.forEach(([x, y], i) => { const q = clamp(np * 1.6 - i * .1); if (q <= 0) return; ctx.strokeStyle = `rgba(34,224,122,${.7 * q})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, cx, q), lerp(y, cy, q)); ctx.stroke(); avatar(x, y + 20, 110, C.blue);
        if (t > 37.8) { const k = (t * .9 + i * .14) % 1; coin(lerp(x, cx, k), lerp(y, cy, k), 22, t * 7 + i); } });
      sprout(cx, cy + 120, 360, eio(seg(t, 38.0, 39.6)), t); if (t > 38.6) pill('NEXT VENTURE', cx, cy + 220, 50, C.green, seg(t, 38.6, 39.0)); }
  });
  if (t < 36.0) kinetic(['LOST', 'ON', 'PAPER'], W / 2, 280, 170, t, 34.0, { hl: { 'PAPER': C.red } });
  else kinetic(['INVESTORS', 'FUND', 'AGAIN'], W / 2, 280, 140, t, 36.3, { hl: { 'AGAIN': C.green } });
});

// 9) 40.35–44.65: iflas bir strateji, trajedi değil — maske + oyun planı
scene(40.35, 44.65, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.16)', seed: 9, dot: '190,160,255' });
  cam({ x: d.x, y: d.y, t }, () => {
    ctx.fillStyle = '#0e2a1a'; ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(160, 520, 760, 560, 30); ctx.fill(); ctx.stroke();
    const p = seg(t, 41.6, 42.8); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    [[300, 900], [420, 640], [560, 980]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 34, 0, TAU); ctx.stroke(); }); [[700, 680], [820, 900]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x - 30, y - 30); ctx.lineTo(x + 30, y + 30); ctx.moveTo(x + 30, y - 30); ctx.lineTo(x - 30, y + 30); ctx.stroke(); });
    if (p > 0) { ctx.strokeStyle = C.gold; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(300, 900); ctx.quadraticCurveTo(480, 600, lerp(300, 860, p), lerp(900, 600, p)); ctx.stroke(); ctx.setLineDash([]); }
    txt('STRATEGY', W / 2, 1150, 80, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold });
    mask(160, 1340, 200, true, '#8a97b0'); stampX(160, 1340, 180, seg(t, 43.0, 43.3)); txt('TRAGEDY', 380, 1340, 54, '#8a97b0', { font: 'Anton', weight: 400 });
  });
  kinetic(['BANKRUPTCY', '=', 'STRATEGY'], W / 2, 280, 130, t, 40.6, { hl: { 'STRATEGY': C.gold } });
});

// 10) 44.65–48.6: küresel servet → daha büyük soru — dev dönen dolar
scene(44.65, 48.6, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(34,224,122,.2)', seed: 10 });
  const sx = Math.cos(t * 2.4); ctx.save(); ctx.translate(W / 2, 900); ctx.scale(Math.max(.05, Math.abs(sx)), 1); txt('$', 0, 0, 760 * eback(seg(t, 44.8, 45.4)), C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green, blur: 80 }); ctx.restore();
  if (t < 46.5) kinetic(['GLOBAL', 'WEALTH'], W / 2, 280, 180, t, 45.0, { hl: { 'GLOBAL': C.green } });
  else kinetic(['BIGGER', 'QUESTION'], W / 2, 280, 170, t, 46.6, { hl: { 'BIGGER': C.gold } });
});

// 11) 48.6–52.55: dolar nasıl dünyanın en güçlü para birimi oldu? — kürsü
scene(48.6, 52.55, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 11, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, t }, () => { podium(W / 2, 1400, 900, t, seg(t, 49.2, 50.6)); if (t > 51.2) crown2(W / 2, 760 - 110 + Math.sin(t * 3) * 8, 160 * eback(seg(t, 51.2, 51.7))); });
  kinetic(["WORLD'S", 'STRONGEST'], W / 2, 280, 160, t, 50.8, { hl: { 'STRONGEST': C.gold } });
  if (t < 50.8) kinetic(['THE', 'DOLLAR'], W / 2, 280, 180, t, 49.4, { hl: { 'DOLLAR': C.green } });
});
function crown2(x, y, s) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(-s * .5, s * .2); ctx.lineTo(-s * .55, -s * .35); ctx.lineTo(-s * .25, -s * .05); ctx.lineTo(0, -s * .5); ctx.lineTo(s * .25, -s * .05); ctx.lineTo(s * .55, -s * .35); ctx.lineTo(s * .5, s * .2); ctx.closePath(); ctx.fill(); ctx.restore(); }

// 12) 52.55–57.25: CTA
scene(52.55, 57.25, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 12, dot: '255,140,150' });
  txt('$', W / 2, 740, 300, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green }); crown2(W / 2, 560 + Math.sin(t * 3) * 6, 140);
  pill('NEXT: HOW THE DOLLAR BECAME KING', W / 2, 1010, 44, C.gold, seg(t, 52.8, 53.2));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 52.7, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 54.8, 55.2), press = seg(t, 55.5, 55.65) - seg(t, 55.65, 55.8), done = t > 55.65;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 54.9, 55.5))), lerp(1480, 1260, eo(seg(t, 54.9, 55.5))), 1, press);
    if (done) { const k = seg(t, 55.65, 56.7); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 55.65, .15);
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
