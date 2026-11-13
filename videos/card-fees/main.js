// "How Do Credit Cards Make Money for Banks?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 54.75;
const SUBY = 1530, CYAN = '#2ee6ff';

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function dime(x, y, r, spin) { const sx = Math.cos(spin); ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#7d8696'; ctx.beginPath(); ctx.ellipse(r * .08 * Math.sign(sx || 1), 0, Math.max(2, r * Math.abs(sx)) + 3, r, 0, 0, TAU); ctx.fill(); ctx.scale(Math.max(.04, Math.abs(sx)), 1);
  const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#c4ccd8'); g.addColorStop(1, '#8a94a5'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#6c7586'; ctx.lineWidth = r * .06; ctx.beginPath(); ctx.arc(0, 0, r * .84, 0, TAU); ctx.stroke(); txt('10¢', 0, r * .04, r * .62, '#4b5466', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function crack(x, y, p, seed = 3) { if (p <= 0) return; const R = RN(seed); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 12; ctx.lineCap = 'round';
  for (let i = 0; i < 11; i++) { let a = i / 11 * TAU + R() * .4, px = x, py = y; const len = (300 + R() * 700) * eo(p); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px, py); let l = 0;
    while (l < len) { const st = 40 + R() * 70; a += (R() - .5) * .7; px += Math.cos(a) * st; py += Math.sin(a) * st; l += st; ctx.lineTo(px, py); if (R() < .25) { ctx.moveTo(px, py); const b = a + (R() - .5) * 2; ctx.lineTo(px + Math.cos(b) * 80, py + Math.sin(b) * 80); ctx.moveTo(px, py); } } ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(x, y, 60 * eo(p), 0, TAU); ctx.fill(); ctx.restore(); }
function gauge(x, y, r, val, label) {                    // 0..1 hız göstergesi
  ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round'; ctx.lineWidth = r * .14; const a0 = Math.PI * .8, a1 = Math.PI * 2.2;
  ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.arc(0, 0, r, a0, a1); ctx.stroke();
  const g = ctx.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, C.green); g.addColorStop(.5, C.gold); g.addColorStop(1, C.red); ctx.strokeStyle = g; ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(0, 0, r, a0, a1); ctx.stroke(); ctx.globalAlpha = 1;
  for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10); ctx.strokeStyle = '#8a97b0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .72, Math.sin(a) * r * .72); ctx.lineTo(Math.cos(a) * r * .82, Math.sin(a) * r * .82); ctx.stroke(); }
  const a = lerp(a0, a1, val); ctx.strokeStyle = '#fff'; ctx.lineWidth = r * .05; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * .78, Math.sin(a) * r * .78); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r * .09, 0, TAU); ctx.fill();
  txt(label, 0, r * .55, r * .2, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function shop(x, y, w, col, name, open = 1) {             // vitrinli dükkan; (x,y) zemin ortası
  const h = w * 1.05; ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#1d2538'; ctx.fillRect(-w / 2, -h, w, h); ctx.fillStyle = '#2a3550'; ctx.fillRect(-w / 2, -h, w, h * .18);
  txt(name, 0, -h * .91, w * .12, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  const st = 8; for (let i = 0; i < st; i++) { ctx.fillStyle = i % 2 ? '#fff' : col; ctx.beginPath(); ctx.moveTo(-w / 2 + i * w / st, -h * .82); ctx.lineTo(-w / 2 + (i + 1) * w / st, -h * .82); ctx.lineTo(-w / 2 + (i + 1) * w / st, -h * .7); ctx.arc(-w / 2 + (i + .5) * w / st, -h * .7, w / st / 2, 0, Math.PI); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = `rgba(255,220,140,${.35 * open})`; ctx.fillRect(-w * .42, -h * .6, w * .5, h * .45); ctx.strokeStyle = '#3a4a6a'; ctx.lineWidth = 6; ctx.strokeRect(-w * .42, -h * .6, w * .5, h * .45);
  ctx.fillStyle = '#0d1220'; ctx.fillRect(w * .14, -h * .6, w * .26, h * .6); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(w * .2, -h * .3, w * .02, 0, TAU); ctx.fill(); ctx.restore(); }
function scissors(x, y, s, open, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); for (const sd of [-1, 1]) { ctx.save(); ctx.rotate(sd * open * .45);
    ctx.fillStyle = '#d6dde8'; ctx.beginPath(); ctx.moveTo(0, -s * .04); ctx.lineTo(s * .75, 0); ctx.lineTo(0, s * .04); ctx.closePath(); ctx.fill(); ctx.strokeStyle = C.red; ctx.lineWidth = s * .05; ctx.beginPath(); ctx.ellipse(-s * .28, sd * s * .1, s * .15, s * .09, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(0, 0, s * .04, 0, TAU); ctx.fill(); ctx.restore(); }
function receipt(x, y, w, p, lines) { const full = 90 + lines.length * 74 + 40, h = full * eo(p); ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y, w, h); ctx.clip(); ctx.fillStyle = '#f4f1e8'; ctx.fillRect(x - w / 2, y, w, full);
  txt('RECEIPT', x, y + 50, 44, '#333', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.strokeStyle = '#bbb'; ctx.setLineDash([8, 8]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - w / 2 + 20, y + 85); ctx.lineTo(x + w / 2 - 20, y + 85); ctx.stroke(); ctx.setLineDash([]);
  lines.forEach(([a, b, col], i) => { txt(a, x - w / 2 + 30, y + 125 + i * 74, 40, col || '#333', { weight: 900, stroke: 0 }); txt(b, x + w / 2 - 30, y + 125 + i * 74, 44, col || '#333', { align: 'right', font: 'Anton', weight: 400, stroke: 0 }); }); ctx.restore();
  ctx.fillStyle = '#f4f1e8'; ctx.beginPath(); for (let i = 0; i <= 14; i++) ctx.lineTo(x - w / 2 + i * w / 14, y + h + (i % 2 ? 14 : 0)); ctx.lineTo(x + w / 2, y + h - 2); ctx.lineTo(x - w / 2, y + h - 2); ctx.fill(); }
function flow(x0, y0, w0, x1, y1, w1, col, p, a = .7) {   // sankey bant (yukarıdan aşağı)
  if (p <= 0) return; const yE = lerp(y0, y1, p), xm = lerp(x0, x1, eio(p)), wm = lerp(w0, w1, p); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 25; ctx.beginPath();
  const cy = (y0 + yE) / 2; ctx.moveTo(x0 - w0 / 2, y0); ctx.bezierCurveTo(x0 - w0 / 2, cy, xm - wm / 2, cy, xm - wm / 2, yE); ctx.lineTo(xm + wm / 2, yE); ctx.bezierCurveTo(xm + wm / 2, cy, x0 + w0 / 2, cy, x0 + w0 / 2, y0); ctx.closePath(); ctx.fill(); ctx.restore(); }
function silo(x, y, w, h, fill, t) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#8a97b0'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, [w * .3, w * .3, 16, 16]); ctx.stroke(); ctx.save(); ctx.clip();
  const fh = h * fill, g = ctx.createLinearGradient(0, -fh, 0, 0); g.addColorStop(0, '#fff3a8'); g.addColorStop(.3, C.gold); g.addColorStop(1, C.gold2); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-w / 2, 0);
  for (let i = 0; i <= 20; i++) ctx.lineTo(-w / 2 + i * w / 20, -fh + Math.sin(t * 6 + i) * 8); ctx.lineTo(w / 2, 0); ctx.fill();
  const R = RN(2); ctx.fillStyle = 'rgba(184,120,10,.6)'; for (let i = 0; i < 40; i++) { const yy = -R() * fh; ctx.beginPath(); ctx.ellipse(-w / 2 + R() * w, yy, 22, 8, 0, 0, TAU); ctx.fill(); } ctx.restore(); ctx.restore(); }
function erodeBill(x, y, w, e, t) {                      // e: 0 sağlam → 1 tamamen ufalanmış
  const h = w * .45; ctx.save(); ctx.beginPath(); const n = 60, R = RN(9), jit = []; for (let i = 0; i < n; i++) jit.push(R());
  for (let i = 0; i < n; i++) { const a = i / n * TAU, cs = Math.cos(a), sn = Math.sin(a), k = 1 / Math.max(Math.abs(cs) / (w / 2), Math.abs(sn) / (h / 2)), rr = k * (1 - e * (.55 + .45 * jit[i])) ; ctx.lineTo(x + cs * rr, y + sn * rr); } ctx.closePath(); ctx.clip(); bill(x, y, w, 0, { val: '100' }); ctx.restore();
  const R2 = RN(13); for (let i = 0; i < 70; i++) { const k = ((t * .5 + R2()) % 1) * e, sx = x + (R2() - .5) * w, sy = y + (R2() - .5) * h; ctx.fillStyle = `rgba(127,201,138,${(1 - k) * .9 * Math.min(1, e * 4)})`; ctx.fillRect(sx + k * 700, sy - k * 260 + Math.sin(t * 3 + i) * 20, 10, 10); } }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–3.1 HOOK: 12 ay boyunca PAID ✓ damgaları peş peşe
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
scene(0, 3.1, 'push', t => {
  bgFinance(t, { tint: 'rgba(34,224,122,.2)', seed: 1 });
  cam({ t, zoom: 1.08 - .08 * eo(seg(t, 0, 3)), rot: Math.sin(t * 1.2) * .015 }, () => {
    MON.forEach((m, i) => { const x = 210 + (i % 3) * 330, y = 520 + Math.floor(i / 3) * 210, p = seg(t, i * .19, i * .19 + .25), e = eback(p);
      ctx.save(); ctx.translate(x, y + (1 - e) * 80); ctx.globalAlpha = clamp(p * 3); ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.strokeStyle = 'rgba(34,224,122,.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-140, -80, 280, 160, 24); ctx.fill(); ctx.stroke();
      txt(m, 0, -28, 54, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('PAID ✓', 0, 38, 46, C.green, { align: 'center', weight: 900, stroke: 0, glow: C.green }); ctx.restore(); });
    pill('BALANCE: $0', W / 2, 1400, 64, C.green, seg(t, 2.3, 2.7));
  });
  kinetic(['PAID', 'IN', 'FULL'], W / 2, 280, 170, t, .05, { hl: { 'FULL': C.green } });
  flash(t, 0, .2, '34,224,122');
});

// 2) 3.1–7.65: banka senden 10 kuruş bile kazanmıyor... YANLIŞ (ekran çatlar)
scene(3.1, 7.65, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 2, dot: '150,200,255' });
  const w = t > 6.7;
  cam({ x: d.x, y: d.y, t, shake: w && t < 7.2 ? 22 * (1 - seg(t, 6.7, 7.2)) : 0, zoom: punch(t, 6.72, .12) }, () => {
    bank(W / 2 - 180, 1260, 420); dime(W / 2 + 250, 900, 150, t * 3);
    ctx.save(); ctx.globalAlpha = seg(t, 4.0, 4.4); txt('PROFIT FROM YOU:', W / 2, 520, 64, C.mute, { align: 'center', font: 'Anton', weight: 400 }); txt(w ? '???' : '$0.00', W / 2, 640, 130, w ? C.red : C.green, { align: 'center', font: 'Anton', weight: 400, glow: w ? C.red : C.green }); ctx.restore();
  });
  if (t < 6.7) kinetic(['NOT', 'A', 'DIME?'], W / 2, 280, 170, t, 4.2, { hl: { 'DIME?': '#c4ccd8' } });
  else { ctx.fillStyle = `rgba(255,0,40,${.25 * (1 - seg(t, 6.7, 7.6))})`; ctx.fillRect(0, 0, W, H); crack(W / 2 + 120, 860, seg(t, 6.72, 6.95)); stampText('WRONG', W / 2, 300, 200, C.red, seg(t, 6.72, 7.0), -.08); }
  flash(t, 6.72, .18, '255,59,78');
});

// 3) 7.65–12.3: faiz göstergesi 0'da — ama bankanın kârı yine artıyor
scene(7.65, 12.3, 'glitch', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.14)', seed: 3, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    gauge(W / 2, 860, 340, .03 + .02 * Math.sin(t * 9) * seg(t, 10.7, 11.2), 'INTEREST YOU PAY');
    txt('0%', W / 2, 780, 150, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green });
    const pp = seg(t, 9.0, 12.3); if (pp > 0) { ctx.save(); ctx.globalAlpha = clamp(pp * 5); txt('BANK PROFIT', W / 2, 1230, 54, C.mute, { align: 'center', font: 'Anton', weight: 400 }); counter(0, 4.2e9, W / 2, 1340, 120, pp, { col: C.gold, ease: x => x * x }); arrow(W / 2 + 380, 1400, 200, true, pp); ctx.restore(); }
  });
  kinetic(['NO', 'INTEREST?'], W / 2, 280, 170, t, 8.0, { hl: { 'INTEREST?': C.gold } });
  if (t > 10.9) qmark(W - 150, 560, 200 * eback(seg(t, 10.9, 11.3)), t, C.gold);
});

// 4) 12.3–15.35: sır, alışveriş yaptığın dükkanlarda (paralaks sokak)
scene(12.3, 15.35, 'whipU', t => {
  bgFinance(t, { tint: 'rgba(255,157,31,.14)', seed: 4, dot: '255,190,120', top: '#0d1020', bot: '#04050a' });
  const sx = -(t - 12.3) * 260; const names = ['SHOP', 'CAFE', 'MARKET', 'SHOES', 'TECH', 'BOOKS'], cols = [C.red, C.gold, C.green, C.violet, C.blue, '#ff8a3d'];
  for (let i = 0; i < 6; i++) { const x = 300 + i * 420 + sx; ctx.save(); ctx.globalAlpha = .45; shop(x + 120, 1000, 260, cols[(i + 2) % 6], ''); ctx.restore(); }
  for (let i = 0; i < 6; i++) shop(260 + i * 400 + sx * 1.6, 1330, 360, cols[i], names[i]);
  ctx.fillStyle = '#2a3550'; ctx.fillRect(0, 1330, W, 30);
  const sp = seg(t, 13.6, 14.2); if (sp > 0) { const rg = ctx.createRadialGradient(W / 2, 1100, 120, W / 2, 1100, 520); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, `rgba(0,0,0,${.75 * sp})`); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); pill('THE SECRET IS HERE', W / 2, 640, 56, C.gold, sp); }
  kinetic(['THE', 'SECRET'], W / 2, 280, 180, t, 12.4, { hl: { 'SECRET': C.gold } });
});

// 5) 15.35–22.85: kartı temassız okut → mağazaya gizli işlem ücreti (%2–3)
scene(15.35, 22.85, 'zoom', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(155,107,255,.15)', seed: 5, dot: '190,160,255' });
  cam({ x: d.x, y: d.y, rot: d.rot, t }, () => {
    if (t < 17.8) {
      const tp = eio(seg(t, 16.2, 16.8)); ctx.save(); ctx.translate(W / 2, 1180); ctx.fillStyle = '#1b2235'; ctx.beginPath(); ctx.roundRect(-230, -150, 460, 300, 30); ctx.fill(); ctx.strokeStyle = '#3a4a6a'; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
      for (let i = 0; i < 3; i++) { const k = ((t - 16.6) * 1.5 + i / 3) % 1; if (t > 16.6) { ctx.strokeStyle = `rgba(46,230,255,${1 - k})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(W / 2, 1180, 80 + k * 260, -Math.PI * .8, -Math.PI * .2); ctx.stroke(); } }
      card(W / 2 + lerp(280, 0, tp), lerp(700, 1000, tp), 440, lerp(.5, -.1, tp));
      kinetic(['SWIPE', 'OR', 'TAP'], W / 2, 280, 170, t, 15.6, { hl: { 'TAP': CYAN } });
    } else {
      shop(840, 1280, 330, C.red, 'STORE'); bank(250, 1280, 330, { glow: 'rgba(255,200,61,.7)' });
      const fp = seg(t, 18.1, 18.9); for (let i = 0; i < 3; i++) { const k = (t * 1.1 + i / 3) % 1; if (fp > 0) coin(lerp(700, 300, k), 920 - Math.sin(k * Math.PI) * 160, 28, t * 7 + i); }
      txt('FEE', W / 2, 820, 60, C.gold, { align: 'center', font: 'Anton', weight: 400 });
      const mg = seg(t, 19.3, 19.9); if (mg > 0) { const mx = lerp(1200, 560, eo(mg)), my = 1000; ctx.save(); ctx.beginPath(); ctx.arc(mx, my, 160, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fill(); ctx.clip(); txt('HIDDEN', mx, my - 40, 56, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('FEE', mx, my + 30, 56, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(mx, my, 160, 0, TAU); ctx.stroke(); ctx.lineCap = 'round'; ctx.lineWidth = 28; ctx.beginPath(); ctx.moveTo(mx + 115, my + 115); ctx.lineTo(mx + 230, my + 230); ctx.stroke(); }
      if (t > 21.0) { ctx.fillStyle = 'rgba(6,9,15,.85)'; ctx.fillRect(0, 380, W, 330); txt('USUALLY ~', W / 2, 450, 60, C.mute, { align: 'center', font: 'Anton', weight: 400 }); const p = seg(t, 21.6, 22.3); txt(Math.round(lerp(0, 2, clamp(p * 2))) + '–' + Math.round(lerp(0, 3, p)) + '%', W / 2, 590, 190, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold }); }
      kinetic(['BANK', 'CHARGES', 'THE', 'STORE'], W / 2, 280, 130, t, 17.9, { hl: { 'STORE': C.red } });
    }
  });
});

// 6) 22.85–25.4: buna "interchange fee" denir
scene(22.85, 25.4, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.22)', seed: 6, dot: '255,210,120' });
  cam({ t, zoom: 1 + .08 * seg(t, 22.85, 25.4) }, () => { ring(W / 2, 1000, 280, 3, seg(t, 23.0, 24.0), { col: C.gold, sub: 'OF EVERY PURCHASE' }); });
  txt('IT\'S CALLED THE', W / 2, 330, 70, C.mute, { align: 'center', font: 'Anton', weight: 400 });
  stampText('INTERCHANGE FEE', W / 2, 520, 110, C.gold, seg(t, 24.2, 24.5), -.04);
  flash(t, 24.22, .15, '255,200,61');
});

// 7) 25.4–32.3: $100 alışveriş → mağazaya $97, bankaya $3 (fiş + sankey)
scene(25.4, 32.3, 'whipL', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.14)', seed: 7 });
  cam({ x: d.x, y: d.y, t }, () => {
    if (t < 27.6) { ctx.save(); ctx.translate(W / 2, 470); ctx.scale(1.4, 1.4); ctx.translate(-W / 2, -470); receipt(W / 2, 470, 620, seg(t, 25.6, 26.8), [['ITEM', '$100.00'], ['TAX', '$0.00'], ['TOTAL', '$100.00', C.red]]); ctx.restore(); card(W / 2 + 320, 1240, 300, -.2 + Math.sin(t * 3) * .05); }
    else {
      const top = 470, f = seg(t, 27.8, 28.9), g = seg(t, 30.4, 31.2);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(W / 2 - 300, top - 80, 600, 100, 50); ctx.fill(); txt('YOU PAY $100', W / 2, top - 30, 56, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      flow(W / 2 - 18, top + 20, 582, 700, 1180, 520, C.green, f); flow(W / 2 + 291, top + 20, 18, 230, 1180, 60, C.gold, g, .95);
      if (f > .9) { shop(700, 1440, 300, C.green, 'STORE'); counter(0, 97, 700, 1080, 150, seg(t, 28.6, 29.3), { col: C.green, fmt: v => '$' + Math.round(v) }); }
      if (g > .5) { bank(230, 1440, 280, { glow: 'rgba(255,200,61,.8)' }); counter(0, 3, 230, 1080, 150, seg(t, 30.8, 31.3), { col: C.gold, fmt: v => '$' + Math.round(v) }); }
    }
  });
  if (t < 27.6) kinetic(['$100', 'ITEM'], W / 2, 280, 180, t, 25.6, { hl: { '$100': C.green } });
  else if (t < 30.3) kinetic(['STORE', 'GETS', '$97'], W / 2, 280, 160, t, 27.8, { hl: { '$97': C.green } });
  else kinetic(['BANK', 'POCKETS', '$3'], W / 2, 280, 150, t, 30.4, { hl: { '$3': C.gold } });
});

// 8) 32.3–40.65: günde milyarlarca işlem → servet (silo dolar, sayaç fırlar)
scene(32.3, 40.65, 'push', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.18)', seed: 8, dot: '255,210,120', top: '#140f04', bot: '#040301' });
  const cp = seg(t, 32.6, 36.0), fill = eio(seg(t, 34.5, 39.5));
  cam({ x: d.x, y: d.y, rot: d.rot, t, zoom: punch(t, 37.66, .07) }, () => {
    txt('TRANSACTIONS TODAY', W / 2, 470, 56, C.mute, { align: 'center', font: 'Anton', weight: 400 });
    txt(Math.floor(Math.pow(10, lerp(0, 9.3, cp))).toLocaleString('en-US'), W / 2, 580, fit('2,000,000,000', 120, 960, 'Anton', 400), '#fff', { align: 'center', font: 'Anton', weight: 400, glow: CYAN });
    silo(W / 2, 1420, 500, 540, fill, t);
    const R = RN(6); for (let i = 0; i < 26; i++) { const k = (t * (1 + R()) + R()) % 1, x0 = R() * W; if (t > 33.2) coin(lerp(x0, W / 2 + (R() - .5) * 300, k), lerp(700, 800 + (1 - fill) * 500, k * k), 22, t * 9 + i); }
    if (t > 36.8) stampText('FORTUNES', W / 2, 760, 110, C.green, seg(t, 37.6, 37.9), -.06);
  });
  if (t < 34.9) kinetic(['×', 'BILLIONS'], W / 2, 280, 180, t, 33.0, { hl: { 'BILLIONS': CYAN } });
  else kinetic(['EVERY', 'SINGLE', 'DAY'], W / 2, 280, 170, t, 35.0, { hl: { 'DAY': C.gold } });
});

// 9) 40.65–43.05: harcarken paydan kesiyorlar (makas banknottan köşe keser)
scene(40.65, 43.05, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.16)', seed: 9, dot: '255,140,150' });
  const c = seg(t, 41.3, 41.8), cut = eio(c);
  ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 900); ctx.lineTo(780, 900); ctx.lineTo(1080 * .98, 1200); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.clip(); bill(W / 2, 960, 900, 0, { val: '100' }); ctx.restore();
  if (c > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(780, 900); ctx.lineTo(W, 900); ctx.lineTo(W, 1200); ctx.closePath(); ctx.translate(cut * 60, cut * 260); ctx.rotate(cut * .3); ctx.clip(); bill(W / 2, 960, 900, 0, { val: '100' }); ctx.restore();
    pill('BANK\'S CUT', 900, 1330, 46, C.gold, seg(t, 41.8, 42.1)); }
  scissors(lerp(1150, 900, eo(seg(t, 40.9, 41.3))) - cut * 120, lerp(760, 900, eo(seg(t, 40.9, 41.3))) + cut * 300, 360, .6 * Math.abs(Math.sin(t * 10)) * (1 - seg(t, 41.8, 42)), 2.3);
  kinetic(['THEY', 'TAKE', 'A', 'CUT'], W / 2, 300, 170, t, 40.8, { hl: { 'CUT': C.red } });
});

// 10) 43.05–47.65: peki biriktirdiğin para? — kumbara + daha büyük soru
scene(43.05, 47.65, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(61,165,255,.16)', seed: 10, dot: '150,200,255' });
  cam({ x: d.x, y: d.y, t }, () => {
    const ip = eback(seg(t, 43.2, 43.8)); ctx.save(); ctx.translate(W / 2 - 40, 980); ctx.scale(ip, ip); piggy(0, 0, 320); ctx.restore();
    for (let i = 0; i < 4; i++) { const k = seg(t, 43.8 + i * .3, 44.3 + i * .3); if (k > 0 && k < 1) coin(W / 2 - 40 + Math.sin(i) * 20, lerp(500, 830, k * k), 46, t * 6 + i); }
    if (t > 45.2) qmark(W / 2 + 330, 640, 300 * eback(seg(t, 45.3, 45.8)), t, C.blue);
  });
  if (t < 45.2) kinetic(['YOUR', 'SAVINGS?'], W / 2, 290, 170, t, 43.3, { hl: { 'SAVINGS?': C.blue } });
  else kinetic(['A', 'MUCH', 'BIGGER', 'QUESTION'], W / 2, 290, 130, t, 45.3, { hl: { 'BIGGER': C.gold } });
});

// 11) 47.65–50.75: enflasyon paranı sessizce aşındırır (banknot ufalanır)
scene(47.65, 50.75, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(255,157,31,.14)', seed: 11, dot: '255,190,120', top: '#140a05', bot: '#040201' });
  cam({ t, zoom: 1 + .1 * seg(t, 47.65, 50.75) }, () => { erodeBill(W / 2, 920, 820, eio(seg(t, 48.4, 50.6)) * .85, t); });
  kinetic(['INFLATION'], W / 2, 290, 190, t, 47.9, { hl: { 'INFLATION': '#ff9d1f' } });
  ctx.save(); ctx.globalAlpha = seg(t, 48.6, 49.0); txt('QUIETLY ERODES', W / 2, 440, 80, '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore();
});

// 12) 50.75–54.75: CTA
scene(50.75, 54.75, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 12, dot: '255,140,150' });
  erodeBill(W / 2, 760, 540, .3 + .1 * Math.sin(t * 2), t);
  pill('NEXT: INFLATION', W / 2, 1010, 54, '#ff9d1f', seg(t, 51.0, 51.4));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 290, 150, t, 50.9, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 52.4, 52.8), press = seg(t, 53.1, 53.25) - seg(t, 53.25, 53.4), done = t > 53.25;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 52.5, 53.1))), lerp(1480, 1260, eo(seg(t, 52.5, 53.1))), 1, press);
    if (done) { const k = seg(t, 53.25, 54.3); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 53.25, .15);
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
