// "Where Is Most of the World's Money Actually Located?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 55.95;
const SUBY = 1530, CYAN = '#2ee6ff';

// ---------------- yardımcı çizimler ----------------
function goldBar(x, y, w, sh = 0) {                        // izometrik külçe; sh = parıltı fazı
  const h = w * .28, d = w * .32; ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#b8780a'; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 - d * .3, -h); ctx.lineTo(-w / 2 + d * .3, -h); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(-w / 2, -h - d * .5, w / 2, -h); g.addColorStop(0, '#fff1a8'); g.addColorStop(.5, C.gold); g.addColorStop(1, C.gold2); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-w / 2 + d * .3, -h); ctx.lineTo(w / 2 - d * .3, -h); ctx.lineTo(w / 2 - d * .55, -h - d * .45); ctx.lineTo(-w / 2 + d * .55, -h - d * .45); ctx.closePath(); ctx.fill();
  if (sh > 0 && sh < 1) { ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.translate(lerp(-w, w, sh), 0); ctx.rotate(.5); ctx.fillRect(-w * .06, -w, w * .12, w * 2); ctx.restore(); }
  ctx.restore();
}
function goldPyramid(cx, by, w, rows, p, sh) { let k = 0; for (let r = 0; r < rows; r++) { const n = rows - r; for (let i = 0; i < n; i++) { const q = eback(clamp(p * (rows * (rows + 1) / 2) * .35 - k * .35)); k++; if (q <= 0) continue; goldBar(cx + (i - (n - 1) / 2) * w * .92, by - r * w * .36 - (1 - q) * 300, w, sh - r * .08); } } }
function dotMap(x, y, w, t, hl = -1) {                     // noktalı dünya haritası (kaba kıtalar)
  const blobs = [[.18, .32, .13, .16], [.26, .66, .07, .17], [.49, .3, .07, .09], [.52, .58, .09, .18], [.7, .33, .18, .14], [.82, .72, .07, .06]];
  const hgt = w * .55, st = w / 46; for (let gx = 0; gx < 46; gx++) for (let gy = 0; gy < 26; gy++) { const u = gx / 46, v = gy / 26; const inn = blobs.some(([bx, by, rx, ry]) => Math.pow((u - bx) / rx, 2) + Math.pow((v - by) / ry, 2) < 1 + .3 * Math.sin(gx * 1.7 + gy * 2.3));
    if (!inn) continue; const tw = .5 + .5 * Math.sin(t * 3 + gx * .7 + gy * .4); ctx.fillStyle = `rgba(61,165,255,${.35 + .45 * tw})`; ctx.beginPath(); ctx.arc(x + gx * st, y + gy * hgt / 26, st * .32, 0, TAU); ctx.fill(); } }
function pin(x, y, s, p, col = C.red) { if (p <= 0) return; const drop = 1 - eback(clamp(p)); ctx.save(); ctx.translate(x, y - drop * 500); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, drop * 500, s * .35 * (1 - drop * .5), s * .1, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 25; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-s * .5, -s * .6, -s * .5, -s * 1.2, 0, -s * 1.2); ctx.bezierCurveTo(s * .5, -s * 1.2, s * .5, -s * .6, 0, 0); ctx.fill(); ctx.shadowBlur = 0;
  txt('?', 0, -s * .85, s * .5, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function rack(x, y, w, h, t, seed) { ctx.fillStyle = '#121a2a'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill(); ctx.strokeStyle = '#2a3856'; ctx.lineWidth = 3; ctx.stroke(); const n = Math.floor(h / (w * .16));
  for (let i = 0; i < n; i++) { const yy = y + 10 + i * (h - 20) / n; ctx.fillStyle = '#1c2740'; ctx.fillRect(x + w * .08, yy, w * .84, (h - 20) / n - 6);
    for (let j = 0; j < 3; j++) { const on = Math.sin(t * (5 + j * 3) + i * 7.1 + seed * 3.3 + j) > .2; ctx.fillStyle = on ? (j === 2 ? C.green : CYAN) : '#203050'; ctx.beginPath(); ctx.arc(x + w * (.18 + j * .1), yy + ((h - 20) / n - 6) / 2, w * .025, 0, TAU); ctx.fill(); } } }
function phone(x, y, h, fn, rot = 0) { const w = h * .5; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#0d1220'; ctx.strokeStyle = '#3a4a6a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .14); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, w * .1); ctx.clip(); ctx.fillStyle = '#071021'; ctx.fillRect(-w / 2, -h / 2, w, h); fn && fn(w - 28, h - 28); ctx.restore(); ctx.restore(); }
function screenNums(x, y, w, h, t, col = CYAN) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.font = '800 34px Montserrat'; ctx.textAlign = 'left'; const R = RN(4), rows = Math.ceil(h / 46) + 2, off = (t * 140) % 46;
  for (let i = 0; i < rows; i++) { const v = (R() * 99999).toFixed(2), sgn = R() > .4; ctx.fillStyle = sgn ? col : '#ff6b7a'; ctx.globalAlpha = .55; ctx.fillText((sgn ? '+' : '-') + '$' + v, x + 20 + (i % 3) * w * .33, y + i * 46 - off); } ctx.restore(); }
function binaryRain(t, a = 1, col = CYAN) { ctx.save(); ctx.globalAlpha = a; ctx.font = '800 38px Montserrat'; ctx.textAlign = 'center'; const R = RN(21);
  for (let c = 0; c < 22; c++) { const x = 25 + c * 50, sp = 300 + R() * 500, ph = R() * 3000; for (let k = 0; k < 14; k++) { const y = ((t * sp + ph) % 2400) - k * 46 - 200; if (y < -50 || y > H) continue; ctx.fillStyle = k === 0 ? '#fff' : col; ctx.globalAlpha = a * (1 - k / 14) * .8; ctx.fillText((Math.floor(t * 12 + c * 7 + k * 3) % 3 === 0) ? '$' : ((c * 13 + k * 7 + Math.floor(t * 8)) % 2 ? '1' : '0'), x, y); } } ctx.restore(); }
function terminal(x, y, s, approved) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#1b2235'; ctx.beginPath(); ctx.roundRect(-s * .4, -s * .6, s * .8, s * 1.2, s * .08); ctx.fill(); ctx.strokeStyle = '#3a4a6a'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = approved ? C.green : '#0a3b4a'; ctx.beginPath(); ctx.roundRect(-s * .3, -s * .5, s * .6, s * .34, 12); ctx.fill(); txt(approved ? 'APPROVED' : 'TAP CARD', 0, -s * .33, s * .085, approved ? C.ink : CYAN, { align: 'center', stroke: 0 });
  for (let i = 0; i < 9; i++) { ctx.fillStyle = '#2c3654'; ctx.beginPath(); ctx.roundRect(-s * .27 + (i % 3) * s * .2, -s * .06 + Math.floor(i / 3) * s * .17, s * .14, s * .12, 8); ctx.fill(); } ctx.restore(); }
function printer(x, y, s, t, run) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#2b3550'; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .35, s, s * .6, 30); ctx.fill(); ctx.fillStyle = '#3d4a6e'; ctx.fillRect(-s * .42, -s * .5, s * .84, s * .18);
  for (let i = 0; i < 2; i++) { ctx.save(); ctx.translate(-s * .2 + i * s * .4, -s * .05); ctx.rotate(t * 8 * run); ctx.fillStyle = '#8a97b0'; ctx.beginPath(); ctx.arc(0, 0, s * .12, 0, TAU); ctx.fill(); ctx.fillStyle = '#2b3550'; for (let k = 0; k < 4; k++) { ctx.rotate(TAU / 4); ctx.fillRect(-s * .015, 0, s * .03, s * .1); } ctx.restore(); }
  ctx.fillStyle = '#10141f'; ctx.fillRect(-s * .38, s * .2, s * .76, s * .05); ctx.fillStyle = run ? C.red : '#555'; ctx.beginPath(); ctx.arc(s * .4, -s * .25, s * .03, 0, TAU); ctx.fill(); ctx.restore(); }
function sheetTable(x, y, w, rows, t, flashT) { const rh = 120; ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.beginPath(); ctx.roundRect(x, y, w, rh * (rows.length + 1), 24); ctx.fill();
  txt('ACCOUNT', x + 40, y + rh / 2, 40, C.mute, { weight: 800, stroke: 0 }); txt('BALANCE', x + w - 40, y + rh / 2, 40, C.mute, { weight: 800, stroke: 0, align: 'right' });
  rows.forEach(([name, a, b, col], i) => { const yy = y + rh * (i + 1), k = seg(t, flashT + i * .15, flashT + .6 + i * .15); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x + 20, yy, w - 40, 2);
    if (k > 0 && k < 1) { ctx.fillStyle = col + Math.round(80 * (1 - k)).toString(16).padStart(2, '0'); ctx.fillRect(x + 10, yy + 6, w - 20, rh - 12); }
    txt(name, x + 40, yy + rh / 2, 48, '#fff', { weight: 900, stroke: 0 }); txt(fmtMoney(lerp(a, b, eo(k)), '$', 2), x + w - 40, yy + rh / 2, 52, k > 0 ? col : '#fff', { align: 'right', font: 'Anton', weight: 400, stroke: 0 }); }); }
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–3.0 HOOK: uzaydan dünyaya dalış, etrafında dönen para halkası
scene(0, 3.0, 'push', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.2)', seed: 1, dot: '150,200,255' });
  const z = lerp(3.2, 1, eo(seg(t, 0, .9))) * (1 + .08 * seg(t, .9, 3));
  cam({ zoom: z, rot: (1 - eo(seg(t, 0, .9))) * .4, t }, () => {
    const cx = W / 2, cy = 860, r = 330, items = [];
    for (let i = 0; i < 18; i++) { const a = t * .9 + i / 18 * TAU, x = cx + Math.cos(a) * 470, y = cy + Math.sin(a) * 120 - Math.cos(a) * 40, front = Math.sin(a) > 0; items.push({ a, x, y, front, i }); }
    const drawIt = o => { const sc = .7 + .3 * Math.sin(o.a); if (o.i % 3 === 0) coin(o.x, o.y, 44 * sc, t * 6 + o.i); else bill(o.x, o.y, 170 * sc, Math.cos(o.a) * .4, { flip: Math.cos(t * 2 + o.i) }); };
    items.filter(o => !o.front).forEach(drawIt);
    const g = ctx.createRadialGradient(cx, cy, r * .8, cx, cy, r * 1.5); g.addColorStop(0, 'rgba(61,165,255,.35)'); g.addColorStop(1, 'rgba(61,165,255,0)'); ctx.fillStyle = g; ctx.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); ctx.fillStyle = '#071a33'; ctx.fillRect(cx - r, cy - r, r * 2, r * 2); dotMap(cx - r * 1.6 + ((t * 60) % (r * 1.6)), cy - r * .55, r * 3.2, t); dotMap(cx - r * 3.2 + ((t * 60) % (r * 1.6)), cy - r * .55, r * 3.2, t);
    const sh = ctx.createRadialGradient(cx - r * .4, cy - r * .4, r * .2, cx, cy, r); sh.addColorStop(0, 'rgba(255,255,255,.12)'); sh.addColorStop(1, 'rgba(0,0,20,.7)'); ctx.fillStyle = sh; ctx.fillRect(cx - r, cy - r, r * 2, r * 2); ctx.restore();
    items.filter(o => o.front).forEach(drawIt);
  });
  kinetic(['ALL', 'THE', 'MONEY', 'ON', 'EARTH'], W / 2, 290, 140, t, .2, { hl: { 'MONEY': C.gold } });
  flash(t, 0, .3);
});

// 2) 3.0–7.25: devasa kasalar: altın piramidi + para tepeleri, kamera ileri kayar
scene(3.0, 7.25, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.2)', seed: 2, dot: '255,210,120', top: '#1a1408', bot: '#060402' });
  cam({ zoom: 1 + .12 * seg(t, 3, 7.25), x: d.x, y: d.y, rot: d.rot, t }, () => {
    ctx.strokeStyle = 'rgba(255,200,61,.18)'; ctx.lineWidth = 3; for (let i = 0; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(W / 2, 700); ctx.lineTo(-600 + i * 190, 1500); ctx.stroke(); }       // perspektif zemin
    for (let i = 0; i < 6; i++) { const yy = 700 + Math.pow(i / 6, 2) * 800; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
    const cs = seg(t, 5.6, 6.2); [[170, 1340, 9], [910, 1340, 9], [260, 1150, 6], [820, 1150, 6]].forEach(([x, y, n], i) => cashStack(x, y, 180 - i * 10, Math.floor(n * 1.8 * eo(clamp(cs * 1.5 - i * .15)))));
    goldPyramid(W / 2, 1320, 200, 4, seg(t, 3.4, 6.2), (t - 6.3) * 1.4);
    if (t > 6.3) { const R = RN(3); for (let i = 0; i < 12; i++) { const a = R() * TAU, k = (t * 1.3 + R()) % 1; ctx.fillStyle = `rgba(255,240,180,${1 - k})`; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * 300 * k, 1100 + Math.sin(a) * 200 * k, 6 * (1 - k), 0, TAU); ctx.fill(); } }
  });
  kinetic(['GIANT', 'VAULTS'], W / 2, 290, 170, t, 4.2, { hl: { 'VAULTS': C.gold } });
  if (t > 5.7) pill(t > 6.3 ? 'CASH + GOLD' : 'CASH', W / 2, 470, 60, C.gold, seg(t, 5.7, 6.0));
});

// 3) 7.25–9.5: "completely wrong" → görüntü parçalanır
scene(7.25, 9.5, 'cut', t => {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); const k = eo(seg(t, 8.0, 9.4)), R = RN(42);
  for (let gx = 0; gx < 4; gx++) for (let gy = 0; gy < 6; gy++) { const tx = gx * W / 4, ty = gy * H / 6, vx = (R() - .5) * 1400, vy = (R() - .3) * 1600, rot = (R() - .5) * 2;
    ctx.save(); ctx.translate(tx + W / 8 + vx * k, ty + H / 12 + vy * k * k); ctx.rotate(rot * k); ctx.translate(-tx - W / 8, -ty - H / 12); ctx.beginPath(); ctx.rect(tx + 2, ty + 2, W / 4 - 4, H / 6 - 4); ctx.clip(); ctx.globalAlpha = 1 - k * .6; S[1].fn(Math.min(t, 7.25)); ctx.restore(); }
  if (t < 8.0) { const g = Math.sin(t * 90) > .3; if (g) { ctx.fillStyle = 'rgba(255,0,60,.25)'; ctx.fillRect(0, (t * 3000) % H, W, 120); ctx.fillStyle = 'rgba(0,255,255,.18)'; ctx.fillRect(0, (t * 1700 + 600) % H, W, 60); } }
  stampText('WRONG', W / 2, 820, 200, C.red, seg(t, 8.45, 8.8));
  flash(t, 8.0, .2, '255,59,78');
});

// 4) 9.5–13.3: Dünyadaki paranın çoğu NEREDE? harita + düşen iğneler
scene(9.5, 13.3, 'zoom', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 4, dot: '150,200,255' });
  cam({ zoom: 1.05 + .1 * seg(t, 9.5, 13.3), x: d.x, y: d.y, t }, () => {
    dotMap(40, 620, 1000, t);
    [[260, 860, 10.0], [560, 820, 10.5], [790, 880, 11.0], [600, 1060, 11.4], [300, 1100, 11.8], [880, 1130, 12.2]].forEach(([x, y, tt]) => pin(x, y, 110, seg(t, tt, tt + .45)));
    const sx = W / 2 + Math.sin(t * 2.2) * 330, sy = 960 + Math.cos(t * 1.7) * 160; ctx.strokeStyle = '#fff'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(sx, sy, 120, 0, TAU); ctx.stroke(); ctx.lineCap = 'round'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(sx + 85, sy + 85); ctx.lineTo(sx + 190, sy + 190); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.arc(sx, sy, 114, 0, TAU); ctx.fill();
  });
  kinetic(['WHERE', 'IS', 'IT', 'REALLY?'], W / 2, 300, 150, t, 9.7, { hl: { 'REALLY?': C.red } });
});

// 5) 13.3–21.7: fiziksel nakit (banknot + bozuk para) → 10×10 karede yalnızca %8'den az
const WG = { x: 160, y: 520, s: 76 };
function waffle(t, nCash, cashCol, restCol, restAlpha, digit) { for (let i = 0; i < 100; i++) { const r = Math.floor(i / 10), c = i % 10, x = WG.x + c * WG.s, y = WG.y + (9 - r) * WG.s, cash = i < nCash, pop = eback(clamp((t - 18.3 - i * .006) / .3));
    if (pop <= 0) continue; ctx.save(); ctx.translate(x + WG.s / 2, y + WG.s / 2); ctx.scale(pop, pop); ctx.fillStyle = cash ? cashCol : restCol; ctx.globalAlpha = cash ? 1 : restAlpha; if (cash) { ctx.shadowColor = cashCol; ctx.shadowBlur = 25; }
    ctx.beginPath(); ctx.roundRect(-WG.s * .42, -WG.s * .42, WG.s * .84, WG.s * .84, 10); ctx.fill(); ctx.shadowBlur = 0; if (digit && !cash) { ctx.globalAlpha = 1; txt(((i * 7 + Math.floor(t * 10)) % 2) ? '1' : '0', 0, 2, 40, '#c9fbff', { align: 'center', stroke: 0, weight: 900 }); } ctx.restore(); } }
scene(13.3, 21.7, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.16)', seed: 5 });
  cam({ x: d.x, y: d.y, rot: d.rot, zoom: punch(t, 18.88, .07), t }, () => {
    if (t < 18.3) {
      kinetic(['PHYSICAL', 'CASH'], W / 2, 300, 170, t, 14.8, { hl: { 'CASH': C.green } });
      const bp = seg(t, 16.3, 16.8), cp = seg(t, 16.9, 17.4);
      for (let i = 0; i < 5; i++) { const q = eback(clamp(bp * 1.6 - i * .12)); if (q > 0) bill(W / 2 - 120 + i * 18, 800 - i * 40 + (1 - q) * 600, 520, -.15 + i * .07); }
      for (let i = 0; i < 7; i++) { const q = eback(clamp(cp * 1.6 - i * .1)); if (q > 0) coin(220 + i * 110, 1180 - Math.abs(Math.sin(t * 6 + i)) * 40 * (1 - cp) + (1 - q) * 500, 58, t * 5 + i); }
      if (t > 17.8) { const k = eio(seg(t, 17.8, 18.3)); ctx.fillStyle = `rgba(6,9,15,${k})`; ctx.fillRect(0, 0, W, H); }
    } else {
      waffle(t, 8, C.green, '#334055', .55, false);
      txt('= ALL THE MONEY ON EARTH', W / 2, WG.y + 10 * WG.s + 70, 46, C.mute, { align: 'center', weight: 900 });
      ctx.save(); ctx.globalAlpha = seg(t, 18.8, 19.1); txt('LESS THAN', W / 2, 280, 70, '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore();
      if (t > 18.8) counter(0, 8, W / 2, 420, 190, seg(t, 18.8, 19.5), { col: C.green, fmt: v => Math.round(v) + '%' });
      const lp = seg(t, 19.6, 20.0); if (lp > 0) { ctx.strokeStyle = C.green; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(WG.x + 4 * WG.s, WG.y + 10 * WG.s); ctx.lineTo(WG.x + 4 * WG.s - 60, WG.y + 10 * WG.s + 0); ctx.stroke(); ctx.setLineDash([]); pill('PAPER + COINS', WG.x + 2 * WG.s, WG.y + 9.5 * WG.s - 80, 40, C.green, lp); }
    }
  });
});

// 6) 21.7–28.9: geri kalan %92 tamamen dijital
scene(21.7, 28.9, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(46,230,255,.18)', seed: 6, dot: '120,230,255', top: '#04131c', bot: '#02060a' });
  binaryRain(t, .25 + .35 * seg(t, 27.6, 28.4));
  cam({ x: d.x, y: d.y, zoom: 1 + .05 * seg(t, 21.7, 28.9) * punch(t, 25.46, .08), t }, () => {
    const dig = seg(t, 22.0, 24.6); ctx.save(); waffle(30, 8, C.green, CYAN, .25 + .65 * dig, dig > .3); ctx.restore();
    if (t < 25.2) { ctx.save(); ctx.globalAlpha = 1 - seg(t, 24.8, 25.2); kinetic(["DOESN'T", 'EXIST'], W / 2, 300, 150, t, 22.3, { hl: { 'EXIST': CYAN } }); txt('PHYSICALLY', W / 2, 430, 64, C.mute, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
    else { txt('OVER', W / 2, 270, 70, '#fff', { align: 'center', font: 'Anton', weight: 400 }); counter(8, 92, W / 2, 420, 200, seg(t, 25.4, 26.4), { col: CYAN, fmt: v => Math.round(v) + '%' }); }
    if (t > 27.7) stampText('DIGITAL', W / 2, WG.y + 5 * WG.s, 150, CYAN, seg(t, 28.3, 28.6), .1);
  });
});

// 7) 28.9–35.9: ekranda sayılar → sunucu odası; merkez bankaları ve finans kurumları
scene(28.9, 35.9, 'push', t => {
  bgFinance(t, { tint: 'rgba(46,230,255,.12)', seed: 7, dot: '120,230,255', top: '#060c18', bot: '#020409' });
  const pull = eio(seg(t, 31.3, 32.8));
  cam({ zoom: lerp(1, .62, pull), y: lerp(0, -40, pull), t }, () => {
    for (let side = -1; side <= 1; side += 2) for (let i = 0; i < 5; i++) { const x = W / 2 + side * (620 + i * 260) - 100, y = 700 - i * 40, h = 900 + i * 80; rack(x, y, 200, h, t, i + side * 9); }
    for (let i = 0; i < 4; i++) { const x = W / 2 + (i - 1.5) * 240 - 100; if (Math.abs(i - 1.5) < 1) continue; }
    ctx.fillStyle = '#0d1424'; ctx.strokeStyle = CYAN; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(90, 520, 900, 760, 30); ctx.fill(); ctx.stroke();      // monitör
    screenNums(110, 540, 860, 720, t);
    ctx.fillStyle = 'rgba(13,20,36,.85)'; ctx.fillRect(220, 760, 640, 200); counter(0, 1284500.75, W / 2, 860, 120, seg(t, 29.9, 31.2), { col: CYAN, fmt: v => fmtMoney(v, '$', 2).replace('M', 'M'), ease: x => x });
    ctx.fillStyle = '#1b2235'; ctx.fillRect(470, 1280, 140, 120); ctx.fillRect(330, 1390, 420, 26);
    if (pull > .5) { for (let i = 0; i < 26; i++) { const k = (t * .8 + i / 26) % 1, side = i % 2 ? 1 : -1; ctx.fillStyle = CYAN; ctx.globalAlpha = Math.sin(k * Math.PI); ctx.fillRect(W / 2 + side * lerp(460, 1500, k), 1200 - i * 30, 30, 8); ctx.globalAlpha = 1; } }
  });
  if (t < 31.3) kinetic(['NUMBERS', 'ON', 'A', 'SCREEN'], W / 2, 300, 140, t, 29.4, { hl: { 'NUMBERS': CYAN } });
  else { txt('SERVERS', W / 2, 290, 170, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: CYAN }); }
  pill('CENTRAL BANKS', W / 2, 1180, 56, C.gold, seg(t, 33.3, 33.7)); pill('FINANCIAL INSTITUTIONS', W / 2, 1300, 50, C.blue, seg(t, 34.3, 34.7));
});

// 8) 35.9–41.4: kart okut / transfer → fiziksel para hareket etmez, sadece veri
scene(35.9, 41.4, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.15)', seed: 8, dot: '190,160,255' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    if (t < 39.0) {
      const sw = eio(seg(t, 36.5, 37.1)); terminal(330, 1000, 640, t > 37.1); card(lerp(840, 340, sw), lerp(780, 800, sw), 400, lerp(.4, -.1, sw));
      if (t > 37.1) { const k = seg(t, 37.1, 37.6); ctx.strokeStyle = `rgba(34,224,122,${1 - k})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(330, 840, 140 + 220 * k, 0, TAU); ctx.stroke(); }
      const tp = seg(t, 37.7, 38.1); if (tp > 0) { ctx.save(); ctx.globalAlpha = tp; phone(830, 1120, 480, (w, h) => { txt('SENT', 0, -40, 54, C.green, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('$250', 0, 40, 70, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }); ctx.restore(); }
      kinetic(['SWIPE', '&', 'TRANSFER'], W / 2, 300, 140, t, 36.2, { hl: { 'SWIPE': C.violet } });
    } else {
      bill(W / 2, 880, 560, 0); const m = seg(t, 39.6, 40.6);
      for (let i = 0; i < 16; i++) { const k = (t * 1.2 + i / 16) % 1; ctx.fillStyle = CYAN; ctx.globalAlpha = Math.sin(k * Math.PI) * m; ctx.font = '900 40px Montserrat'; ctx.textAlign = 'center'; ctx.fillText(i % 2 ? '1' : '0', lerp(-40, W + 40, k), 620 + (i % 4) * 30); ctx.fillText(i % 2 ? '0' : '1', lerp(W + 40, -40, k), 1140 + (i % 4) * 30); } ctx.globalAlpha = 1;
      txt('MONEY MOVED:', W / 2, 1300, 60, C.mute, { align: 'center', font: 'Anton', weight: 400 }); stampText('$0', W / 2, 1420, 110, C.red, seg(t, 40.5, 40.8), -.06);
      kinetic(['NO', 'PHYSICAL', 'MONEY'], W / 2, 300, 140, t, 39.0, { hl: { 'NO': C.red } });
    }
  });
});

// 9) 41.4–43.95: sadece bir veritabanı güncellemesi
scene(41.4, 43.95, 'iris', t => {
  bgFinance(t, { tint: 'rgba(34,224,122,.14)', seed: 9 });
  cam({ zoom: 1.12 + .06 * seg(t, 41.4, 43.95), t }, () => sheetTable(80, 640, 920, [['YOU', 1250, 1000, C.red], ['STORE', 8400, 8650, C.green], ['BANK FEE', 0, 0.35, C.gold]], t, 42.6));
  kinetic(['DATABASE', 'UPDATE'], W / 2, 300, 150, t, 41.6, { hl: { 'UPDATE': C.green } });
  const cur = Math.floor(t * 2) % 2; if (cur) { ctx.fillStyle = C.green; ctx.fillRect(W / 2 + 330, 1110, 8, 60); }
});

// 10) 43.95–48.9: rakamlar dev bir soru işaretinde toplanır
scene(43.95, 48.9, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(46,230,255,.14)', seed: 10, dot: '120,230,255', top: '#04101a', bot: '#010306' });
  const k = eio(seg(t, 44.6, 46.6)), R = RN(8); ctx.font = '900 46px Montserrat'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const qp = []; for (let i = 0; i < 110; i++) { const u = i / 110; let x, y; if (u < .75) { const a = lerp(-Math.PI * .95, Math.PI * .45, u / .75); x = W / 2 + Math.cos(a) * 230; y = 720 + Math.sin(a) * 230; if (u > .6) { x = lerp(W / 2 + Math.cos(Math.PI * .3) * 230, W / 2, (u - .6) / .15); y = lerp(720 + Math.sin(Math.PI * .3) * 230, 1060, (u - .6) / .15); } } else { x = W / 2; y = lerp(1060, 1140, (u - .75) / .25); } qp.push([x, y]); }
  qp.push([W / 2, 1290], [W / 2 - 30, 1290], [W / 2 + 30, 1290], [W / 2, 1260], [W / 2, 1320]);
  qp.forEach(([tx, ty], i) => { const sx = R() * W, sy = R() * H, a = t * 2 + i, x = lerp(sx + Math.sin(a) * 60, tx, k), y = lerp(sy + Math.cos(a) * 60, ty, k); ctx.fillStyle = i % 5 ? CYAN : C.gold; ctx.shadowColor = CYAN; ctx.shadowBlur = 15 * k; ctx.fillText(i % 3 ? (i % 2 ? '1' : '0') : '$', x, y); });
  ctx.shadowBlur = 0; ctx.textBaseline = 'alphabetic';
  kinetic(['A', 'MUCH', 'BIGGER', 'QUESTION'], W / 2, 300, 130, t, 46.5, { hl: { 'BIGGER': C.gold } });
  if (t < 46.5) kinetic(['JUST', 'DIGITAL', 'NUMBERS'], W / 2, 300, 130, t, 44.2, { hl: { 'DIGITAL': CYAN } });
});

// 11) 48.9–52.0: para basmak neden ülkeyi zengin etmez?
scene(48.9, 52.0, 'whipU', t => {
  const d = drift(t, 1.5); bgFinance(t, { tint: 'rgba(255,59,78,.18)', seed: 11, dot: '255,140,150' });
  cam({ x: d.x, y: d.y, t, shake: t > 49.5 && t < 50.4 ? 6 : 0 }, () => {
    printer(W / 2, 880, 560, t, t > 49.4 ? 1 : 0);
    if (t > 49.4) for (let i = 0; i < 14; i++) { const k = ((t - 49.4) * 2.2 - i * .18); if (k > 0 && k < 1.6) { const kk = Math.min(k, 1); bill(W / 2 + Math.sin(i * 2.3) * 220 * kk, 1020 + kk * 380 + Math.max(0, k - 1) * 600, 300, Math.sin(i + k * 3) * .5, { val: '100' }); } }
    const vp = seg(t, 50.3, 51.6); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(140, 1340, 800, 40, 20); ctx.fill(); ctx.fillStyle = mixV(vp); ctx.beginPath(); ctx.roundRect(140, 1340, 800 * (1 - .85 * eio(vp)), 40, 20); ctx.fill();
    txt('VALUE?', 140, 1300, 44, C.mute, { weight: 900 });
  });
  kinetic(['PRINT', 'MORE', 'MONEY', '=', 'RICH?'], W / 2, 300, 130, t, 49.1, { hl: { 'RICH?': C.red } });
  const qp = seg(t, 50.8, 51.2); if (qp > 0) qmark(W - 170, 560, 240 * eback(qp), t, C.red);
});
const mixV = p => p < .5 ? C.green : (p < .8 ? C.gold : C.red);

// 12) 52.0–55.95: CTA — dijital ekranda abone ol
scene(52.0, 55.95, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 12, dot: '255,140,150' }); binaryRain(t, .18, '#ff6b7a');
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 300, 150, t, 52.1, { hl: { 'TRUTH': C.gold } });
  printer(W / 2, 760, 440, t, 1); pill('NEXT: PRINTING MONEY', W / 2, 1040, 48, C.gold, seg(t, 52.8, 53.2));
  const bp = seg(t, 53.7, 54.1), press = seg(t, 54.3, 54.45) - seg(t, 54.45, 54.6), done = t > 54.45;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1260); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    const hx = lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 53.8, 54.3))), hy = lerp(1500, 1270, eo(seg(t, 53.8, 54.3)));
    ctx.save(); ctx.translate(hx, hy); ctx.scale(1 - .15 * press, 1 - .15 * press); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore();
    if (done) { const k = seg(t, 54.45, 55.4); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; bill(W / 2 + Math.cos(a) * 520 * eo(k), 1230 + Math.sin(a) * 330 * eo(k), 110 * (1 - k * .4), a); } } }
  flash(t, 54.45, .15);
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
    ctx.fillStyle = `rgba(46,230,255,${.18 * a})`; ctx.fillRect(0, 0, W, H); return; }
  iris(t, b - TD / 2, TD, () => drawScene(i - 1, t), () => drawScene(i, t));
}
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  let i = S.findIndex(s => t < s.e); if (i < 0) i = S.length - 1;
  if (i > 0 && t < S[i].s + TD / 2) transition(i, t);
  else if (i < S.length - 1 && t > S[i].e - TD / 2) transition(i + 1, t);
  else drawScene(i, t);
  subs(t, SUBY);
};
