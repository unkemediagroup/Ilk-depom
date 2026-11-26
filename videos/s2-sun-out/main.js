// Seri2 #2 — "What If the Sun Suddenly Went Out?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 46.45;
const SUBY = 1540;
const SUN = '#ffd23a', ICE = '#9fe0ff';

function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function sunBall(x, y, r, t, k = 1) { if (k <= 0) return; ctx.save(); ctx.translate(x, y);
  const g = ctx.createRadialGradient(0, 0, r * .2, 0, 0, r * 2.4); g.addColorStop(0, `rgba(255,250,220,${k})`); g.addColorStop(.35, `rgba(255,190,50,${.9 * k})`); g.addColorStop(1, 'rgba(255,90,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 2.4, 0, TAU); ctx.fill();
  ctx.fillStyle = `rgba(255,236,150,${k})`; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = `rgba(255,140,40,${.5 * k})`; ctx.lineWidth = r * .06; for (let i = 0; i < 7; i++) { const a = i * .9 + t * .4; ctx.beginPath(); ctx.arc(Math.cos(a) * r * .4, Math.sin(a) * r * .4, r * (.2 + (i % 3) * .08), 0, TAU); ctx.stroke(); }
  ctx.restore(); }
function sw(x, y, s, on) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.roundRect(-s * .3, -s * .5, s * .6, s, s * .08); ctx.fill(); ctx.fillStyle = '#c9d2de'; ctx.beginPath(); ctx.roundRect(-s * .17, -s * .34, s * .34, s * .68, s * .06); ctx.fill();
  const y0 = lerp(-s * .2, s * .2, on); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(-s * .15, y0 - s * .13, s * .3, s * .26, s * .05); ctx.fill(); ctx.shadowBlur = 0;
  txt(on > .5 ? 'OFF' : 'ON', 0, s * .62, s * .16, on > .5 ? '#ff3b4e' : '#22e07a', { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }

// ---------- S1 0–2.28: güneşin şalteri kapanır ----------
function s1(t) {
  const off = seg(t, .64, .72);
  space(t, 3, { top: '#06040c', bot: '#140a10' });
  if (off < 1) { ctx.fillStyle = `rgba(255,160,40,${.35 * (1 - off)})`; ctx.fillRect(0, 0, W, H); }
  cam({ zoom: 1.14 - .1 * eo(seg(t, 0, 2.2)), t, shake: t > .64 && t < 1.4 ? 22 * (1 - seg(t, .64, 1.4)) : 3 }, () => {
    sunBall(W / 2, 760, 300 * (1 + .03 * Math.sin(t * 30)), t, 1 - off);
    if (off > 0) { ctx.strokeStyle = `rgba(255,200,120,${.6 * (1 - seg(t, .72, 2.0))})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(W / 2, 760, 300, 0, TAU); ctx.stroke(); ring2(W / 2, 760, seg(t, .64, 1.6), 900, 'rgba(255,200,120,.8)', 20); }
    sw(W / 2, 1160, 260, eio(seg(t, .5, .66)));
    // parmak
  });
  kinetic(['WHAT', 'IF', 'THE', 'SUN'], W / 2, 220, 150, t, -.3, { gap: .05 });
  kinetic(['WENT', 'OUT?'], W / 2, 390, 170, t, .2, { hl: { 'OUT?': SUN } });
}

// ---------- S2 2.28–8.9: 8 dakika 20 saniye kimse bilmez ----------
function s2(t) {
  space(t, 5);
  const p = seg(t, 2.4, 8.2), dk = Math.min(500, Math.floor(500 * eio(p))), mm = Math.floor(dk / 60), ss = dk % 60;
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    // güneşin karanlık hayaleti solda, dünya sağda
    ctx.strokeStyle = 'rgba(255,200,120,.35)'; ctx.setLineDash([16, 14]); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(140, 900, 170, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    earth(900, 900, 150, t, { rot: t * .5, light: Math.PI });
    // son ışık dalgası yolda
    const lx = lerp(330, 740, eio(p)); const g = ctx.createLinearGradient(lx - 400, 0, lx, 0); g.addColorStop(0, 'rgba(255,210,80,0)'); g.addColorStop(1, 'rgba(255,230,140,.95)'); ctx.fillStyle = g; ctx.fillRect(Math.max(310, lx - 400), 880, Math.min(400, lx - 310), 40);
    ctx.fillStyle = '#fff'; ctx.shadowColor = SUN; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(lx, 900, 22, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    txt('150 MILLION KM', W / 2, 1010, 50, 'rgba(255,255,255,.6)', { align: 'center', stroke: 0 });
    // dünya halkı habersiz: güneş gözlüklü gülen yüzler
    for (let i = 0; i < 3; i++) { const x = 760 + i * 110, y = 1180; ctx.fillStyle = '#ffd890'; ctx.beginPath(); ctx.arc(x, y, 44, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.fillRect(x - 34, y - 14, 30, 16); ctx.fillRect(x + 4, y - 14, 30, 16); ctx.strokeStyle = '#111'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y + 8, 18, .2, Math.PI - .2); ctx.stroke(); }
  });
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.roundRect(190, 360, 700, 240, 40); ctx.fill(); ctx.restore();
  txt(String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0'), W / 2, 460, 170, SUN, { align: 'center', font: 'Anton', weight: 400, glow: '#ff9a2e' });
  txt('MIN : SEC', W / 2, 565, 40, '#fff', { align: 'center', stroke: 6 });
  kinetic(['NOBODY', 'WOULD', 'KNOW'], W / 2, 220, 130, t, 2.28, { hl: { KNOW: SUN } });
}

// ---------- S3 8.9–14.3: son ışın → zifiri karanlık ----------
function s3(t) {
  const dk = eio(seg(t, 10.3, 12.9));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#4aa0f0', '#000000', dk)); g.addColorStop(1, lerpC('#ffd8a0', '#05060c', dk)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04 + .06 * dk, t, shake: 2 + 8 * seg(t, 10.3, 10.6) * (1 - seg(t, 10.6, 11.2)) }, () => {
    if (dk < 1) sunBall(W / 2, lerp(380, 380, dk), 140, t, 1 - dk);
    // son ışın şehre çarpar
    if (t > 9.6 && t < 10.6) { const k = seg(t, 9.6, 10.34); ctx.strokeStyle = 'rgba(255,240,180,.9)'; ctx.lineWidth = 30 * (1 - k * .5); ctx.shadowColor = SUN; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(W / 2, 380); ctx.lineTo(W / 2 + 200 * k, 380 + 900 * k); ctx.stroke(); ctx.shadowBlur = 0; }
    skyline(1350, t, { seed: 17, tall: 600, col: lerpC('#3a4a6a', '#05060c', dk) });
    ctx.fillStyle = lerpC('#2a3a2a', '#020204', dk); ctx.fillRect(-300, 1350, W + 600, 700);
    if (dk > .6) { const R = RN(3); for (let i = 0; i < 80; i++) { ctx.fillStyle = `rgba(255,255,255,${(dk - .6) * 2 * R()})`; ctx.beginPath(); ctx.arc(R() * W, R() * 1100, 1 + R() * 2, 0, TAU); ctx.fill(); } }
  });
  kinetic(['THE', 'FINAL', 'RAY'], W / 2, 230, 150, t, 9.1, { hl: { RAY: SUN } });
  if (t > 12.58) bigText('PITCH-BLACK', W / 2, 1440, 140, '#fff', seg(t, 12.58, 12.85), { glow: '#3a3aff' });
}

// ---------- S4 14.3–21.78: Dünya yörüngeden kopar, 67,000 mph ----------
function s4(t) {
  space(t, 9, { drift: 20 });
  const br = seg(t, 15.16, 21.6), cx = W / 2, cy = 900, R0 = 380;
  cam({ zoom: 1.02 - .25 * eio(br), t, shake: 3 }, () => {
    ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.setLineDash([18, 14]); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255,200,120,.35)'; ctx.setLineDash([12, 12]); ctx.beginPath(); ctx.arc(cx, cy, 90, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    // kopma noktasına kadar yörüngede, sonra teğet doğrultuda dümdüz
    const a0 = -Math.PI / 2 + (Math.min(t, 15.16) - 14.3) * 1.2, ex0 = cx + Math.cos(a0) * R0, ey0 = cy + Math.sin(a0) * R0, tx = -Math.sin(a0), ty = Math.cos(a0), d = br * 1500;
    const ex = ex0 + tx * d, ey = ey0 + ty * d;
    if (br > 0) { ctx.strokeStyle = 'rgba(95,211,255,.7)'; ctx.lineWidth = 8; ctx.setLineDash([24, 12]); ctx.beginPath(); ctx.moveTo(ex0, ey0); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(95,211,255,.9)'; ctx.save(); ctx.translate(ex + tx * 80, ey + ty * 80); ctx.rotate(Math.atan2(ty, tx)); ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-20, -24); ctx.lineTo(-20, 24); ctx.fill(); ctx.restore(); }
    earth(ex, ey, 70, t, { rot: t, light: 0, dark: .6 });
  });
  if (t > 18.7) { counter(0, 67000, W / 2, 1330, 150, seg(t, 18.7, 20.6), { fmt: v => Math.round(v).toLocaleString('en-US'), col: '#5fd3ff' }); txt('MILES PER HOUR', W / 2, 1440, 50, '#fff', { align: 'center', stroke: 8 }); }
  kinetic(['BREAKS', 'FREE'], W / 2, 220, 170, t, 15.16, { hl: { FREE: '#5fd3ff' } });
  if (t > 17.76) bigText('INTO DEEP SPACE', W / 2, 380, 100, '#fff', seg(t, 17.76, 18.0));
}

// ---------- S5 21.78–28.88: fotosentez durur, bitkiler ölür ----------
function sunflower(x, y, s, wilt, t) { ctx.save(); ctx.translate(x, y);
  const stem = lerpC('#3a9a4a', '#6a5a2a', wilt); ctx.strokeStyle = stem; ctx.lineWidth = s * .05; ctx.lineCap = 'round';
  const hx = Math.sin(wilt * 1.4) * s * .45, hy = -s + wilt * s * .45; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(0, -s * .6, hx, hy); ctx.stroke();
  ctx.fillStyle = stem; for (const sx of [-1, 1]) { ctx.save(); ctx.translate(0, -s * .35); ctx.rotate(sx * (1.1 + wilt * .7)); ctx.beginPath(); ctx.ellipse(0, -s * .12, s * .06, s * .14, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.translate(hx, hy); ctx.rotate(wilt * 1.6); const n = 16; for (let i = 0; i < n; i++) { if (i / n < wilt * .8 && i % 2) continue; ctx.save(); ctx.rotate(i / n * TAU); ctx.fillStyle = lerpC('#ffd23a', '#8a6a3a', wilt); ctx.beginPath(); ctx.ellipse(0, -s * .2, s * .05, s * .12, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = lerpC('#5a3a1a', '#2a1a0a', wilt); ctx.beginPath(); ctx.arc(0, 0, s * .12, 0, TAU); ctx.fill(); ctx.restore(); }
function s5(t) {
  const wl = eio(seg(t, 25.3, 28.4));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0c14'); g.addColorStop(1, '#1a140c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    // fotosentez döngüsü: CO2 + H2O + ışık → şeker (ışık kesildi)
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-300, 1350, W + 600, 700);
    for (let i = 0; i < 3; i++) sunflower(250 + i * 290, 1360, 620 - i * 40, clamp(wl * 1.2 - i * .1), t);
    const lightOn = 1 - seg(t, 22.4, 23.0); for (let k = 0; k < 6; k++) { const q = ((t * 1.2 + k / 6) % 1); ctx.strokeStyle = `rgba(255,220,100,${lightOn * Math.sin(q * Math.PI)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(100 + k * 170, 280 + q * 300); ctx.lineTo(140 + k * 170, 360 + q * 300); ctx.stroke(); }
  });
  kinetic(['PHOTOSYNTHESIS'], W / 2, 220, 140, t, 23.4, { hl: { PHOTOSYNTHESIS: '#3ad06a' } });
  if (t > 24.38) stampText('STOPS', W / 2, 380, 120, '#ff3b4e', seg(t, 24.38, 24.6));
  if (t > 27.18) { const day = 1 + Math.floor(seg(t, 27.18, 28.6) * 6); txt('DAY ' + day, W / 2, 1440, 120, '#ffc83d', { align: 'center', font: 'Anton', weight: 400 }); }
}

// ---------- S6 28.88–32.92: bir haftada donma altı ----------
function s6(t) {
  bgFinance(t, { tint: 'rgba(95,211,255,.2)', seed: 6, dot: '160,220,255', top: '#06101c', bot: '#02050a' });
  const p = seg(t, 29.2, 31.8), days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    days.forEach((d, i) => { const x = 110 + i * 143, on = p * 7 > i, temp = Math.round(lerp(15, -18, (i + 1) / 7)); ctx.fillStyle = on ? lerpC('#ffb35a', '#3da5ff', i / 6) : 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x - 60, 600, 120, 420, 24); ctx.fill();
      txt(d, x, 650, 34, '#fff', { align: 'center', stroke: 0 }); if (on) txt(temp + '°', x, 820, 54, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      if (on && temp < 0) { ctx.strokeStyle = 'rgba(230,250,255,.95)'; ctx.lineWidth = 6; for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 30, 940 - Math.sin(a) * 30); ctx.lineTo(x + Math.cos(a) * 30, 940 + Math.sin(a) * 30); ctx.stroke(); } } });
    // donma çizgisi
    ctx.strokeStyle = '#9fe0ff'; ctx.setLineDash([16, 12]); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(40, 900); ctx.lineTo(1040, 900); ctx.stroke(); ctx.setLineDash([]); txt('0°C', 980, 870, 40, ICE, { align: 'center', stroke: 6 });
  });
  kinetic(['WITHIN', 'A', 'WEEK'], W / 2, 230, 150, t, 28.88, { hl: { WEEK: ICE } });
  if (t > 31.28) bigText('BELOW FREEZING', W / 2, 1300, 120, ICE, seg(t, 31.28, 31.55), { glow: '#3da5ff' });
}

// ---------- S7 32.92–40.9: bir yıl sonra −100°, okyanus yüzeyi donar ----------
function s7(t) {
  const ice = eo(seg(t, 37.7, 40.4));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#000'); g.addColorStop(.4, '#0a1428'); g.addColorStop(1, '#021028'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    const sea = 900; ctx.fillStyle = '#0a3a6a'; ctx.fillRect(-300, sea, W + 600, 1100);
    // buz tabakası kalınlaşır
    const th = 40 + 220 * ice; const ig = ctx.createLinearGradient(0, sea, 0, sea + th); ig.addColorStop(0, '#f2fbff'); ig.addColorStop(1, '#8fd0f0'); ctx.fillStyle = ig; ctx.fillRect(-300, sea, W + 600, th * (.2 + .8 * ice));
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 3; const R = RN(5); for (let i = 0; i < 20 * ice; i++) { let x = R() * W, y = sea + R() * th * .8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (R() - .5) * 120, y + R() * 40); ctx.stroke(); }
    // altta yüzen balıklar
    for (let i = 0; i < 5; i++) { const x = ((i * 240 + t * 60) % 1300) - 100, y = 1300 + i * 70; ctx.fillStyle = '#ffb35a'; ctx.beginPath(); ctx.ellipse(x, y, 50, 22, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 45, y); ctx.lineTo(x - 80, y - 24); ctx.lineTo(x - 80, y + 24); ctx.fill(); }
    // kar
    for (let i = 0; i < 100; i++) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc((R() * W + Math.sin(t + i) * 30), (R() * sea + t * 80) % sea, 2 + R() * 3, 0, TAU); ctx.fill(); }
  });
  txt('YEAR 1', W / 2, 220, 120, '#fff', { align: 'center', font: 'Anton', weight: 400 });
  counter(0, -100, W / 2, 470, 220, seg(t, 35.0, 36.6), { fmt: v => Math.round(v) + '°', col: ICE });
  if (t > 37.76) bigText('OCEANS FREEZE', W / 2, 1440, 120, '#fff', seg(t, 37.76, 38.0), { glow: '#3da5ff' });
}

// ---------- S8 40.9–46.45: tek umut yer altında, jeotermal ısı ----------
function s8(t) {
  const dn = eio(seg(t, 41.0, 44.5));
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, y: lerp(400, -520, dn), t, shake: 2 }, () => {
    // donmuş yüzey
    ctx.fillStyle = '#cfe8f5'; ctx.fillRect(-300, 300, W + 600, 80);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = ['#5a3a20', '#4a2e18', '#3a2412', '#2e1a0c', '#3a160a', '#5a1a08'][i]; ctx.fillRect(-300, 380 + i * 280, W + 600, 280); }
    // magma ışığı
    const mg = ctx.createRadialGradient(W / 2, 2350, 100, W / 2, 2350, 900); mg.addColorStop(0, 'rgba(255,150,40,.95)'); mg.addColorStop(1, 'rgba(255,60,20,0)'); ctx.fillStyle = mg; ctx.fillRect(-300, 1400, W + 600, 1200);
    // asansör şaftı + sığınak
    ctx.fillStyle = '#1a1f2a'; ctx.fillRect(W / 2 - 40, 380, 80, 1200); ctx.fillStyle = '#4a5260'; ctx.beginPath(); ctx.roundRect(W / 2 - 380, 1560, 760, 320, 40); ctx.fill();
    ctx.fillStyle = '#ffd890'; ctx.beginPath(); ctx.roundRect(W / 2 - 350, 1590, 700, 260, 30); ctx.fill();
    for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(W / 2 - 260 + i * 130, 1830); human(0, 0, 200 - (i % 2) * 30); ctx.restore(); }
    // ısı dalgaları
    for (let i = 0; i < 4; i++) { ctx.strokeStyle = 'rgba(255,170,80,.5)'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 0; x < W; x += 20) ctx.lineTo(x, 1960 + i * 40 + Math.sin(x * .03 + t * 6 + i) * 12); ctx.stroke(); }
  });
  kinetic(['ONLY', 'HOPE:'], W / 2, 220, 160, t, 41.6, { hl: { 'HOPE:': '#ffb35a' } });
  if (t > 44.12) bigText('GO UNDERGROUND', W / 2, 400, 120, '#ffb35a', seg(t, 44.12, 44.4), { glow: '#ff6a00' });
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 2.28, 8.9, 14.3, 21.78, 28.88, 32.92, 40.9, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > .64 && t < .85 ? .9 : 0) + (t > 15.16 && t < 15.35 ? .6 : 0), Math.floor(t * 60));
  flash(t, .64, .25, '255,240,200');
  subs(t, SUBY);
};
