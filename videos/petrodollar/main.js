// "How Did the Dollar Become the World's Strongest Currency?" — finans Shorts, kodla çizim (fin.js), 1080×1920, 30 fps.
window.DUR = 59.65;
const SUBY = 1530, OIL = '#1a1410', RETRO = ['#ff6b35', '#f7c548', '#2ec4b6', '#e71d36'];

// ---------------- yardımcı çizimler ----------------
function drift(t, amp = 1) { return { x: Math.sin(t * .7) * 14 * amp, y: Math.cos(t * .5) * 12 * amp, rot: Math.sin(t * .4) * .012 * amp }; }
function cursor(x, y, s = 1, press = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - .15 * press), s * (1 - .15 * press)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 68); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 62); ctx.lineTo(72, 60); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }
function crown(x, y, s) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(-s * .5, s * .2); ctx.lineTo(-s * .55, -s * .35); ctx.lineTo(-s * .25, -s * .05); ctx.lineTo(0, -s * .5); ctx.lineTo(s * .25, -s * .05); ctx.lineTo(s * .55, -s * .35); ctx.lineTo(s * .5, s * .2); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = C.red; for (const [a, b] of [[-.55, -.35], [0, -.5], [.55, -.35]]) { ctx.beginPath(); ctx.arc(a * s, b * s, s * .06, 0, TAU); ctx.fill(); } ctx.restore(); }
function bigDollar(x, y, s, col = C.green, glow = 1) { txt('$', x, y, s, col, { align: 'center', font: 'Anton', weight: 400, glow: col, blur: 60 * glow }); }
function striker(x, y, h, lvl, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-40, -h, 80, h); const marks = ['WEAK', 'OK', 'STRONG', 'KING']; marks.forEach((m, i) => { const yy = -h * (i + 1) / 4.3; ctx.fillStyle = RETRO[i]; ctx.fillRect(-250, yy - 38, 200, 76); txt(m, -150, yy, 44, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); });
  ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(0, -h - 40, 60, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(0, -40 - (h - 80) * lvl, 32, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#5a6375'; ctx.fillRect(-120, -20, 240, 40); ctx.restore(); }
function sunburst(x, y, t) { for (let i = 0; i < 24; i++) { ctx.fillStyle = i % 2 ? 'rgba(247,197,72,.18)' : 'rgba(255,107,53,.12)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, 2200, i / 24 * TAU + t * .1, (i + 1) / 24 * TAU + t * .1); ctx.fill(); } }
function bulb(x, y, s, on) { ctx.save(); ctx.translate(x, y); if (on) { const g = ctx.createRadialGradient(0, -s * .2, 0, 0, -s * .2, s * 1.2); g.addColorStop(0, 'rgba(255,240,150,.6)'); g.addColorStop(1, 'rgba(255,240,150,0)'); ctx.fillStyle = g; ctx.fillRect(-s * 1.2, -s * 1.4, s * 2.4, s * 2.4); }
  ctx.fillStyle = on ? '#fff3a8' : '#444'; ctx.beginPath(); ctx.arc(0, -s * .25, s * .4, Math.PI * .8, Math.PI * .2 + TAU); ctx.lineTo(s * .15, s * .25); ctx.lineTo(-s * .15, s * .25); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#8a97b0'; ctx.fillRect(-s * .16, s * .25, s * .32, s * .2); ctx.restore(); }
function hand(x, y, s, dir, col) { ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = col; ctx.fillRect(-s * 1.2, -s * .22, s * .9, s * .44); ctx.fillStyle = '#e8b48a'; ctx.beginPath(); ctx.roundRect(-s * .35, -s * .28, s * .7, s * .56, s * .2); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.roundRect(s * .25, -s * .26 + i * s * .14, s * .32, s * .12, s * .06); ctx.fill(); } ctx.restore(); }
function scroll(x, y, w, p) { const h = w * .62 * p; ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f5ecd2'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = '#c8a86a'; ctx.beginPath(); ctx.roundRect(-w / 2 - 20, -h / 2 - 22, w + 40, 44, 22); ctx.fill(); ctx.beginPath(); ctx.roundRect(-w / 2 - 20, h / 2 - 22, w + 40, 44, 22); ctx.fill();
  if (p > .6) { ctx.save(); ctx.globalAlpha = (p - .6) / .4; txt('AGREEMENT', 0, -h * .25, w * .09, '#3a2a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = 'rgba(60,40,10,.35)'; for (let i = 0; i < 3; i++) ctx.fillRect(-w * .35, -h * .02 + i * h * .12, w * .7, h * .04); ctx.restore(); } ctx.restore(); }
function jet(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#9aa7b8'; ctx.beginPath(); ctx.moveTo(s * .6, 0); ctx.lineTo(s * .2, -s * .06); ctx.lineTo(-s * .05, -s * .45); ctx.lineTo(-s * .18, -s * .45); ctx.lineTo(-s * .05, -s * .06); ctx.lineTo(-s * .4, -s * .05); ctx.lineTo(-s * .5, -s * .2); ctx.lineTo(-s * .58, -s * .2); ctx.lineTo(-s * .52, 0);
  ctx.lineTo(-s * .58, s * .2); ctx.lineTo(-s * .5, s * .2); ctx.lineTo(-s * .4, s * .05); ctx.lineTo(-s * .05, s * .06); ctx.lineTo(-s * .18, s * .45); ctx.lineTo(-s * .05, s * .45); ctx.lineTo(s * .2, s * .06); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ff9d1f'; ctx.beginPath(); ctx.moveTo(-s * .52, -s * .04); ctx.lineTo(-s * .8 - Math.random() * 0, 0); ctx.lineTo(-s * .52, s * .04); ctx.fill(); ctx.restore(); }
function derrick(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.moveTo(-s * .3, 0); ctx.lineTo(0, -s); ctx.lineTo(s * .3, 0); for (let i = 1; i < 5; i++) { const yy = -s * i / 5, ww = s * .3 * (1 - i / 5); ctx.moveTo(-ww, yy); ctx.lineTo(ww, yy - s * .2); } ctx.stroke(); ctx.restore(); }
function barrel(x, y, s, label) { ctx.save(); ctx.translate(x, y); const g = ctx.createLinearGradient(-s * .4, 0, s * .4, 0); g.addColorStop(0, '#0d1220'); g.addColorStop(.5, '#2a3550'); g.addColorStop(1, '#0d1220'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-s * .4, -s * .55, s * .8, s * 1.1, s * .08); ctx.fill(); ctx.fillStyle = '#3a4a6a'; for (const yy of [-.3, .3]) ctx.fillRect(-s * .4, yy * s - s * .03, s * .8, s * .06);
  ctx.fillStyle = '#05070b'; ctx.beginPath(); ctx.ellipse(0, -s * .55, s * .4, s * .08, 0, 0, TAU); ctx.fill(); txt('OIL', 0, -s * .02, s * .2, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); if (label) txt(label, 0, s * .17, s * .1, C.green, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function pump(x, y, s, val) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.red; ctx.beginPath(); ctx.roundRect(-s * .3, -s * .9, s * .6, s * .9, 20); ctx.fill(); ctx.fillStyle = '#05070b'; ctx.fillRect(-s * .22, -s * .8, s * .44, s * .22); txt(val, s * .18, -s * .69, s * .1, C.green, { align: 'right', font: 'Anton', weight: 400, stroke: 0 }); txt('FUEL', 0, -s * .38, s * .1, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
  ctx.strokeStyle = '#1b2235'; ctx.lineWidth = s * .04; ctx.beginPath(); ctx.moveTo(s * .3, -s * .5); ctx.quadraticCurveTo(s * .6, -s * .3, s * .45, 0); ctx.stroke(); ctx.fillStyle = '#9aa7b8'; ctx.fillRect(-s * .35, -s * .02, s * .7, s * .06); ctx.restore(); }
function throne(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#7a1020'; ctx.beginPath(); ctx.roundRect(-s * .35, -s * 1.05, s * .7, s * .8, [s * .3, s * .3, 0, 0]); ctx.fill(); ctx.fillStyle = C.gold2; ctx.fillRect(-s * .45, -s * .3, s * .9, s * .12); ctx.fillRect(-s * .45, -s * .3, s * .1, s * .5); ctx.fillRect(s * .35, -s * .3, s * .1, s * .5); ctx.fillRect(-s * .5, -s * .45, s * .12, s * .3); ctx.fillRect(s * .38, -s * .45, s * .12, s * .3); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(0, -s * 1.05, s * .08, 0, TAU); ctx.fill(); ctx.restore(); }
function pumpjack(x, y, s, t) { ctx.save(); ctx.translate(x, y); const a = Math.sin(t * 2.4) * .3; ctx.fillStyle = '#2a3550'; ctx.beginPath(); ctx.moveTo(-s * .1, 0); ctx.lineTo(0, -s * .55); ctx.lineTo(s * .1, 0); ctx.fill(); ctx.save(); ctx.translate(0, -s * .55); ctx.rotate(a); ctx.fillStyle = C.gold; ctx.fillRect(-s * .5, -s * .05, s * .9, s * .1); ctx.beginPath(); ctx.moveTo(-s * .5, -s * .15); ctx.quadraticCurveTo(-s * .7, 0, -s * .5, s * .15); ctx.fill();
  ctx.strokeStyle = '#8a97b0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-s * .62, 0); ctx.lineTo(-s * .62, s * .55 - Math.sin(a) * s * .5); ctx.stroke(); ctx.restore(); ctx.fillStyle = '#1b2235'; ctx.fillRect(-s * .7, -4, s * 1.2, 8); ctx.restore(); }
function alps(y, t, snow = 1) { ctx.fillStyle = '#26324c'; ctx.beginPath(); ctx.moveTo(-50, y); [[120, y - 380], [300, y - 180], [520, y - 560], [720, y - 260], [900, y - 440], [1130, y - 120]].forEach(([x, yy]) => ctx.lineTo(x, yy)); ctx.lineTo(1130, y); ctx.fill();
  ctx.fillStyle = `rgba(240,248,255,${snow})`; [[120, y - 380, 70], [520, y - 560, 110], [900, y - 440, 80]].forEach(([x, yy, w]) => { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x - w, yy + w * 1.1); ctx.lineTo(x - w * .3, yy + w * .8); ctx.lineTo(x + w * .2, yy + w * 1.1); ctx.lineTo(x + w * .8, yy + w * .9); ctx.closePath(); ctx.fill(); }); }
function keyhole(x, y, s, glow) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = steelG(s); ctx.beginPath(); ctx.arc(0, 0, s, 0, TAU); ctx.fill(); ctx.strokeStyle = '#3a4352'; ctx.lineWidth = s * .06; ctx.stroke(); ctx.fillStyle = glow ? C.gold : '#05070b'; if (glow) { ctx.shadowColor = C.gold; ctx.shadowBlur = 40; } ctx.beginPath(); ctx.arc(0, -s * .15, s * .2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .1, -s * .05); ctx.lineTo(s * .1, -s * .05); ctx.lineTo(s * .16, s * .45); ctx.lineTo(-s * .16, s * .45); ctx.fill(); ctx.restore(); }
function steelG(s) { const g = ctx.createRadialGradient(-s * .35, -s * .4, s * .1, 0, 0, s); g.addColorStop(0, '#e8eef6'); g.addColorStop(.55, '#9aa7b8'); g.addColorStop(1, '#4b5566'); return g; }
function lockIcon(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.arc(0, -s * .2, s * .32, Math.PI, TAU); ctx.moveTo(s * .32, -s * .2); ctx.lineTo(s * .32, -s * .05); ctx.moveTo(-s * .32, -s * .2); ctx.lineTo(-s * .32, -s * .05); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .1, s, s * .75, s * .12); ctx.fill(); ctx.restore(); }

// ---------------- sahneler ----------------
const S = []; const scene = (s, e, tr, fn) => S.push({ s, e, tr, fn });

// 1) 0–5.2 HOOK: dev ekonomi — çubuklar fırlar, en uzunu $
scene(0, 5.2, 'push', t => {
  bgFinance(t, { tint: 'rgba(34,224,122,.18)', seed: 1 });
  cam({ t, zoom: lerp(1.3, 1, eo(seg(t, 0, 1))), shake: t < .4 ? 10 : 0 }, () => {
    const hs = [.45, .62, 1, .55, .38], cols = ['#3a4a6a', '#3a4a6a', C.green, '#3a4a6a', '#3a4a6a']; hs.forEach((h, i) => { const g = eback(clamp(seg(t, i * .1, .8 + i * .1))), x = 150 + i * 195, hh = 820 * h * g; ctx.fillStyle = cols[i]; if (i === 2) { ctx.shadowColor = C.green; ctx.shadowBlur = 40; } ctx.beginPath(); ctx.roundRect(x - 75, 1400 - hh, 150, hh, [16, 16, 0, 0]); ctx.fill(); ctx.shadowBlur = 0; });
    if (t > .9) bigDollar(540, 1400 - 820 - 110, 200 * eback(seg(t, .9, 1.3)));
    txt('ECONOMY SIZE', W / 2, 1450, 44, C.mute, { align: 'center', font: 'Anton', weight: 400 });
  });
  kinetic(['MASSIVE', 'ECONOMY?'], W / 2, 270, 170, t, 2.8, { hl: { 'ECONOMY?': C.green } });
  if (t < 2.8) kinetic(['US', 'DOLLAR', 'POWER'], W / 2, 270, 170, t, .05, { hl: { 'DOLLAR': C.green } });
  flash(t, 0, .2, '34,224,122');
});

// 2) 5.2–7.8: hikâyenin sadece yarısı — dev $ ikiye bölünür
scene(5.2, 7.8, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,200,61,.16)', seed: 2, dot: '255,210,120' });
  const sp = eio(seg(t, 5.8, 6.4));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2, H); ctx.clip(); ctx.translate(-sp * 60, sp * 40); ctx.rotate(-sp * .08); bigDollar(W / 2, 950, 760); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(W / 2, 0, W / 2, H); ctx.clip(); ctx.globalAlpha = 1 - sp * .85; ctx.translate(sp * 160, sp * 200); ctx.rotate(sp * .2); bigDollar(W / 2, 950, 760, '#5c6779', .2); ctx.restore();
  if (sp > .5) { pill('50%', W / 2 - 220, 1350, 70, C.gold, seg(t, 6.3, 6.6)); txt('?', W / 2 + 240, 980, 300, '#5c6779', { align: 'center', font: 'Anton', weight: 400 }); }
  kinetic(['HALF', 'THE', 'STORY'], W / 2, 270, 180, t, 6.0, { hl: { 'HALF': C.gold } });
});

// 3) 7.8–12.05: dünyanın en güçlü para birimi nasıl oldu? — panayır güç ölçer
scene(7.8, 12.05, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,107,53,.16)', seed: 3, dot: '255,180,120' });
  const hitT = 10.4, lvl = t < hitT ? 0 : Math.min(1, Math.sin(clamp((t - hitT) / 1.1) * Math.PI * .5) * 1.05);
  cam({ x: d.x, y: d.y, t, shake: t > hitT && t < hitT + .3 ? 10 : 0 }, () => {
    striker(620, 1420, 900, lvl, t);
    const ha = t < 10.0 ? lerp(0, -1.4, eio(seg(t, 8.8, 9.9))) : lerp(-1.4, 0, ei(seg(t, 10.0, hitT))); ctx.save(); ctx.translate(380, 1400); ctx.rotate(ha); ctx.fillStyle = '#8a5a2b'; ctx.fillRect(0, -12, 230, 24); ctx.fillStyle = C.green; ctx.beginPath(); ctx.roundRect(200, -80, 90, 160, 20); ctx.fill(); txt('$', 245, 4, 70, C.ink, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    if (lvl > .97) { crown(620, 380, 130); }
  });
  kinetic(["WORLD'S", 'STRONGEST'], W / 2, 270, 160, t, 8.4, { hl: { 'STRONGEST': '#ff6b35' } });
});

// 4) 12.05–16.05: 1970'lerde dahiyane bir hamle — retro güneş + ampul
scene(12.05, 16.05, 'zoom', t => {
  ctx.fillStyle = '#2b1408'; ctx.fillRect(0, 0, W, H); sunburst(W / 2, 1000, t);
  const on = t > 13.4; bulb(W / 2, 760, 260, on);
  ctx.save(); ctx.translate(W / 2, 1180); ctx.rotate(-.05); const p = eback(seg(t, 14.4, 14.9)); ctx.scale(p, p); RETRO.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(-380, -60 + i * 28 - 40, 760, 22); }); txt('1970s', 0, 0, 200, '#fff', { align: 'center', font: 'Anton', weight: 400, strokeCol: '#2b1408' }); ctx.restore();
  kinetic(['GENIUS', 'MOVE'], W / 2, 270, 190, t, 13.3, { hl: { 'GENIUS': '#f7c548' } });
  flash(t, 13.4, .15, '255,240,150');
});

// 5) 16.05–19.95: tarihi anlaşma — el sıkışma + parşömen
scene(16.05, 19.95, 'iris', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.16)', seed: 5, dot: '255,210,120' });
  cam({ x: d.x, y: d.y, t }, () => {
    scroll(W / 2, 1180, 700, eio(seg(t, 17.3, 18.0)));
    const hp = eio(seg(t, 16.2, 17.0)), shake = Math.sin(t * 14) * 12 * seg(t, 17.0, 17.4) * (1 - seg(t, 18.6, 19.0));
    hand(lerp(-100, W / 2 - 60, hp), 760 + shake, 180, 1, '#1d3f8f'); hand(lerp(W + 100, W / 2 + 60, hp), 760 + shake, 180, -1, '#0f6b3a');
    txt('USA', 170, 560, 60, '#7fb2ff', { align: 'center', font: 'Anton', weight: 400 }); txt('SAUDI ARABIA', 830, 560, 52, '#5be38f', { align: 'center', font: 'Anton', weight: 400 });
  });
  kinetic(['HISTORIC', 'DEAL'], W / 2, 270, 180, t, 16.4, { hl: { 'DEAL': C.gold } });
});

// 6) 19.95–23.95: Amerika askerî koruma sağladı — petrol kulelerinin üstünde jetler
scene(19.95, 23.95, 'whipL', t => {
  bgFinance(t, { tint: 'rgba(255,157,31,.16)', seed: 6, dot: '255,190,120', top: '#1a1206', bot: '#050301' });
  ctx.fillStyle = '#c99a52'; ctx.beginPath(); ctx.moveTo(0, 1250); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 1250 + Math.sin(x * .01 + 1) * 30); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  [[220, 1260, 380], [540, 1250, 460], [860, 1265, 360]].forEach(([x, y, s]) => derrick(x, y, s));
  const dp = seg(t, 21.0, 22.0); if (dp > 0) { ctx.strokeStyle = `rgba(61,165,255,${.8 * dp})`; ctx.lineWidth = 10; ctx.shadowColor = C.blue; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(W / 2, 1300, 520 * eo(dp), Math.PI, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
  for (let i = 0; i < 3; i++) { const k = ((t - 20.2) * .35 + i * .12) % 1.4; jet(lerp(-200, W + 300, k), 600 + i * 90 - k * 60, 220, -.05); }
  kinetic(['MILITARY', 'PROTECTION'], W / 2, 270, 150, t, 20.6, { hl: { 'PROTECTION': C.blue } });
});

// 7) 23.95–28.45: karşılığında petrol YALNIZCA dolarla satılır
scene(23.95, 28.45, 'whipU', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(34,224,122,.15)', seed: 7 });
  cam({ x: d.x, y: d.y, t, zoom: punch(t, 25.88, .08) }, () => {
    barrel(W / 2, 1000, 460, t > 25.8 ? 'ONLY IN $' : '');
    const syms = [['€', 200, 680], ['¥', 880, 700], ['£', 220, 1240], ['₣', 880, 1260]]; syms.forEach(([s, x, y], i) => { const a = eback(seg(t, 24.6 + i * .15, 25.0 + i * .15)); if (a <= 0) return; txt(s, x, y, 150 * a, '#8a97b0', { align: 'center', font: 'Anton', weight: 400 }); stampX(x, y - 10, 160, seg(t, 26.2 + i * .1, 26.5 + i * .1)); });
    if (t > 26.9) { bigDollar(W / 2, 560, 220 * eback(seg(t, 26.9, 27.4))); }
  });
  kinetic(['SELL', 'OIL', 'IN', 'DOLLARS'], W / 2, 270, 150, t, 24.3, { hl: { 'DOLLARS': C.green, 'OIL': '#ff9d1f' } });
});

// 8) 28.45–35.95: tüm dünya petrole muhtaç — her ülke yakıt için dolar biriktirir
scene(28.45, 35.95, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(61,165,255,.14)', seed: 8, dot: '150,200,255' });
  const cx = W / 2, cy = 960; cam({ t, rot: Math.sin(t * .5) * .02 }, () => {
    pump(cx, cy + 140, 300, '$' + Math.floor(t * 37 % 100).toString().padStart(2, '0') + '.' + Math.floor(t * 300 % 100).toString().padStart(2, '0'));
    const cols = [C.red, C.blue, C.gold, C.violet, '#ff8a3d', C.green, '#ff5a8a', '#2ec4b6'];
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - Math.PI / 2 + t * .06, x = cx + Math.cos(a) * 400, y = cy + Math.sin(a) * 420, ap = eback(seg(t, 29.0 + i * .1, 29.4 + i * .1)); if (ap <= 0) continue;
      ctx.save(); ctx.translate(x, y); ctx.scale(ap, ap); ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(-62, -10, 124, 20); ctx.restore();
      const n = Math.floor(10 * eo(seg(t, 32.6, 35.4))); for (let k = 0; k < n; k++) { ctx.fillStyle = k % 2 ? '#5fae6b' : '#6fbd7a'; ctx.fillRect(x + 72, y + 40 - k * 12, 80, 10); }
      if (t > 30.2) { const k = (t * .8 + i / 8) % 1; ctx.fillStyle = OIL; ctx.beginPath(); ctx.arc(lerp(cx, x, k), lerp(cy, y, k), 12, 0, TAU); ctx.fill(); } }
  });
  if (t < 31.4) kinetic(['WORLD', 'NEEDS', 'OIL'], W / 2, 270, 170, t, 28.7, { hl: { 'OIL': '#ff9d1f' } });
  else kinetic(['STOCKPILE', 'DOLLARS'], W / 2, 270, 150, t, 32.8, { hl: { 'DOLLARS': C.green } });
});

// 9) 35.95–41.95: sonsuz küresel talep — $ tahta oturur, para kralı
scene(35.95, 41.95, 'push', t => {
  const d = drift(t); bgFinance(t, { tint: 'rgba(255,200,61,.2)', seed: 9, dot: '255,210,120', top: '#151005', bot: '#040301' });
  cam({ x: d.x, y: d.y, t, zoom: punch(t, 40.48, .08) }, () => {
    if (t < 38.6) { const p = eio(seg(t, 36.4, 38.4)); lineChart(120, 560, 840, 760, [1, 1.3, 1.5, 2, 2.6, 3.4, 4.6, 6.4, 9, 13], p, { col: C.green, axes: false, label: () => 'DEMAND' }); txt('∞', 900, 520, 160, C.green, { align: 'center', font: 'Anton', weight: 400, glow: C.green }); }
    else { throne(W / 2, 1340, 620); bigDollar(W / 2, 1000, 380); crown(W / 2, 700 - (1 - eback(seg(t, 40.3, 40.8))) * 400, 220 * clamp(seg(t, 40.2, 40.4) * 5)); }
  });
  if (t < 38.6) kinetic(['ENDLESS', 'DEMAND'], W / 2, 270, 170, t, 37.0, { hl: { 'ENDLESS': C.green } });
  else kinetic(['KING', 'OF', 'MONEY'], W / 2, 270, 180, t, 40.4, { hl: { 'KING': C.gold } });
});

// 10) 41.95–45.45: petrol ve küresel güç üstüne kurulu imparatorluk — pompa kriko sırası
scene(41.95, 45.45, 'glitch', t => {
  bgFinance(t, { tint: 'rgba(255,157,31,.15)', seed: 10, dot: '255,190,120' });
  for (let i = 0; i < 6; i++) { ctx.fillStyle = '#18213a'; const h = 300 + (i * 97) % 300; ctx.fillRect(80 + i * 160, 1080 - h, 130, h); }
  bigDollar(W / 2, 640, 240 * eback(seg(t, 42.4, 42.9)));
  for (let i = 0; i < 4; i++) pumpjack(170 + i * 250, 1360, 300, t + i * .7); ctx.fillStyle = '#1b2235'; ctx.fillRect(0, 1360, W, 40);
  kinetic(['OIL', '+', 'POWER'], W / 2, 270, 190, t, 42.4, { hl: { 'OIL': '#ff9d1f', 'POWER': C.blue } });
});

// 11) 45.45–50.65: serveti gizli tutmakta taç başka ülkeye geçer — taç Alplere uçar
scene(45.45, 50.65, 'whipL', t => {
  bgFinance(t, { tint: 'rgba(160,210,255,.16)', seed: 11, dot: '200,230,255', top: '#0a1424', bot: '#02050a' });
  alps(1420, t); const cf = eio(seg(t, 48.4, 49.9));
  bigDollar(260, 820, 260, C.green, .6); crown(lerp(260, 660, cf), lerp(620, 780, cf) - Math.sin(cf * Math.PI) * 220, 150);
  if (cf > .9) { lockIcon(660, 980, 120, C.gold); }
  kinetic(['KEEPING', 'IT', 'SECRET'], W / 2, 270, 160, t, 46.4, { hl: { 'SECRET': '#9fd3ff' } });
});

// 12) 50.65–55.75: daha büyük soru — İsviçre bankaları neden bu kadar ünlü?
scene(50.65, 55.75, 'zoom', t => {
  bgFinance(t, { tint: 'rgba(160,210,255,.18)', seed: 12, dot: '200,230,255', top: '#0a1424', bot: '#02050a' });
  alps(1450, t); cam({ t, zoom: 1 + .1 * seg(t, 50.65, 55.75) }, () => { keyhole(W / 2, 900, 300, t > 53.5);
    ctx.save(); ctx.translate(W / 2 + 250, 1260); ctx.rotate(-.12); const p = eback(seg(t, 54.0, 54.5)); ctx.scale(p, p); ctx.fillStyle = '#1b2235'; ctx.beginPath(); ctx.roundRect(-200, -70, 400, 140, 18); ctx.fill(); ctx.strokeStyle = C.gold; ctx.lineWidth = 5; ctx.stroke(); txt('ACCOUNT #00042', 0, 0, 40, C.gold, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    qmark(W / 2 - 300, 620, 200 * eback(seg(t, 52.0, 52.5)), t, '#9fd3ff'); });
  if (t < 53.3) kinetic(['BIGGER', 'QUESTION'], W / 2, 270, 170, t, 51.0, { hl: { 'BIGGER': C.gold } });
  else kinetic(['SWISS', 'BANKS?'], W / 2, 270, 190, t, 53.4, { hl: { 'SWISS': '#ff3b4e' } });
});

// 13) 55.75–59.65: CTA
scene(55.75, 59.65, 'iris', t => {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 13, dot: '255,140,150' });
  keyhole(W / 2, 760, 200, true); pill('NEXT: WHY SWISS BANKS ARE SO FAMOUS', W / 2, 1010, 40, C.gold, seg(t, 56.0, 56.4));
  kinetic(['FIND', 'OUT', 'THE', 'TRUTH'], W / 2, 270, 150, t, 55.9, { hl: { 'TRUTH': C.gold } });
  const bp = seg(t, 57.4, 57.8), press = seg(t, 58.1, 58.25) - seg(t, 58.25, 58.4), done = t > 58.25;
  if (bp > 0) { ctx.save(); ctx.translate(W / 2, 1250); const s = eback(bp) * (1 - .08 * press); ctx.scale(s, s); ctx.fillStyle = done ? '#3a3f4b' : '#ff0033'; ctx.shadowColor = '#ff0033'; ctx.shadowBlur = done ? 0 : 50; ctx.beginPath(); ctx.roundRect(-330, -90, 660, 180, 90); ctx.fill(); ctx.shadowBlur = 0;
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 84, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    cursor(lerp(W / 2 + 420, W / 2 + 120, eo(seg(t, 57.5, 58.1))), lerp(1480, 1260, eo(seg(t, 57.5, 58.1))), 1, press);
    if (done) { const k = seg(t, 58.25, 59.3); for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; coin(W / 2 + Math.cos(a) * 520 * eo(k), 1250 + Math.sin(a) * 330 * eo(k), 28 * (1 - k * .4), t * 8 + i); } } }
  flash(t, 58.25, .15);
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
    ctx.fillStyle = `rgba(255,157,31,${.12 * a})`; ctx.fillRect(0, 0, W, H); return; }
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
