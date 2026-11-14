// 11.video — "What If Ancient Civilizations Had Modern Technology?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 38.69;
const SUBY = 1540;
const NEO = '#4ff0ff', SAND = '#e8b56a';

function desertSky(t, top = '#1a0e2a', bot = '#f08a4a') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(.6, bot); g.addColorStop(1, '#3a1a0a'); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function pyramid(x, y, s, o = {}) { const h = s * .62, p = o.built ?? 1; ctx.save(); ctx.translate(x, y);
  ctx.save(); ctx.beginPath(); ctx.rect(-s, -h * p, 2 * s, h * p + 2); ctx.clip();
  ctx.fillStyle = '#d9a35a'; ctx.beginPath(); ctx.moveTo(-s / 2, 0); ctx.lineTo(0, -h); ctx.lineTo(0, 0); ctx.fill(); ctx.fillStyle = '#a8763a'; ctx.beginPath(); ctx.moveTo(s / 2, 0); ctx.lineTo(0, -h); ctx.lineTo(0, 0); ctx.fill();
  ctx.strokeStyle = 'rgba(90,60,30,.35)'; ctx.lineWidth = 2; for (let i = 1; i < 18; i++) { const yy = -h * i / 18, w = s / 2 * (1 - i / 18); ctx.beginPath(); ctx.moveTo(-w, yy); ctx.lineTo(w, yy); ctx.stroke(); }
  if (o.neon) { ctx.strokeStyle = NEO; ctx.shadowColor = NEO; ctx.shadowBlur = 25; ctx.lineWidth = 5; ctx.globalAlpha = o.neon; ctx.beginPath(); ctx.moveTo(-s / 2, 0); ctx.lineTo(0, -h); ctx.lineTo(s / 2, 0); ctx.stroke();
    for (let i = 0; i < 6; i++) { const yy = -h * (i + 1) / 7, w = s / 2 * (1 - (i + 1) / 7); ctx.beginPath(); ctx.moveTo(-w, yy); ctx.lineTo(-w * .3, yy); ctx.lineTo(-w * .3 + 20, yy - 20); ctx.stroke(); ctx.beginPath(); ctx.moveTo(w * .2, yy); ctx.lineTo(w, yy); ctx.stroke(); } }
  ctx.restore(); ctx.restore(); }
function dunes(y, t, cols = ['#c98a4a', '#a86a34']) { cols.forEach((c, k) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-300, H + 300); for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, y + k * 140 + Math.sin(x * .004 + k * 2 + t * .05) * 60); ctx.lineTo(W + 300, H + 300); ctx.fill(); }); }

// ---------- S1 0–5.04: piramit neonla uyanır ----------
function s1(t) {
  desertSky(t);
  const sunG = ctx.createRadialGradient(W / 2, 1000, 20, W / 2, 1000, 500); sunG.addColorStop(0, 'rgba(255,230,160,.9)'); sunG.addColorStop(1, 'rgba(255,140,60,0)'); ctx.fillStyle = sunG; ctx.fillRect(0, 400, W, 1200);
  const on = seg(t, .2, 2.4);
  cam({ zoom: 1.15 - .12 * eo(seg(t, 0, 5)), t, shake: 3 + 10 * seg(t, 2.42, 2.7) * (1 - seg(t, 2.7, 3.2)) }, () => {
    pyramid(W / 2 - 330, 1210, 520); pyramid(W / 2 + 120, 1220, 900, { neon: on });
    // tepeden yükselen hologram ışını
    const hb = seg(t, 2.42, 3.0); if (hb > 0) { const g = ctx.createLinearGradient(0, 0, 0, 660); g.addColorStop(0, 'rgba(79,240,255,0)'); g.addColorStop(1, `rgba(79,240,255,${.6 * hb})`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W / 2 + 120, 662); ctx.lineTo(W / 2 - 120, 0); ctx.lineTo(W / 2 + 360, 0); ctx.fill();
      ring2(W / 2 + 120, 662, ((t - 2.42) * .8) % 1, 500, NEO, 10); }
    dunes(1200, t);
  });
  kinetic(['WHAT', 'IF', 'ANCIENT', 'CIVILIZATIONS'], W / 2, 170, 110, t, 0, { gap: .05 });
  kinetic(['HAD', 'MODERN', 'TECH?'], W / 2, 310, 140, t, 1.6, { hl: { 'TECH?': NEO } });
  if (t > 3.1) { const y = Math.round(lerp(2026, -3000, eo(seg(t, 3.1, 4.2)))); txt(y < 0 ? (-y) + ' BC' : y + ' AD', W / 2, 1420, 140, SAND, { align: 'center', font: 'Anton', weight: 400, glow: '#ff8a3a' }); }
}

// ---------- S2 5.04–10.04: plazma lazer + anti-gravite vinçleri ----------
function block(x, y, s, glow) { ctx.fillStyle = '#d9a35a'; ctx.fillRect(x - s / 2, y - s * .3, s, s * .6); ctx.strokeStyle = 'rgba(90,60,30,.5)'; ctx.lineWidth = 3; ctx.strokeRect(x - s / 2, y - s * .3, s, s * .6);
  if (glow) { ctx.strokeStyle = NEO; ctx.shadowColor = NEO; ctx.shadowBlur = 20; ctx.lineWidth = 4; ctx.strokeRect(x - s / 2 - 6, y - s * .3 - 6, s + 12, s * .6 + 12); ctx.shadowBlur = 0; } }
function drone(x, y, s, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 8); ctx.fillStyle = '#2a3344'; ctx.beginPath(); ctx.ellipse(0, 0, s * .5, s * .14, 0, 0, TAU); ctx.fill(); ctx.fillStyle = NEO; ctx.shadowColor = NEO; ctx.shadowBlur = 25; ctx.beginPath(); ctx.ellipse(0, s * .08, s * .3, s * .05, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  const g = ctx.createLinearGradient(0, 0, 0, s * 1.4); g.addColorStop(0, 'rgba(79,240,255,.5)'); g.addColorStop(1, 'rgba(79,240,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-s * .25, s * .1); ctx.lineTo(-s * .4, s * 1.4); ctx.lineTo(s * .4, s * 1.4); ctx.lineTo(s * .25, s * .1); ctx.fill(); ctx.restore(); }
function s2(t) {
  desertSky(t, '#2a1a3a', '#e89a5a');
  const lz = seg(t, 7.32, 8.4), lift = eio(seg(t, 8.48, 9.9));
  cam({ zoom: 1.05, x: -(t - 5) * 10, t, shake: 2 + (lz > 0 && lz < 1 ? 5 : 0) }, () => {
    pyramid(W / 2 + 80, 1250, 980, { built: .72 });
    dunes(1240, t);
    // lazer ile taş kesimi
    if (t < 8.5) { block(300, 1180, 260, false); ctx.save(); ctx.strokeStyle = '#ff3b6b'; ctx.lineWidth = 10; ctx.shadowColor = '#ff3b6b'; ctx.shadowBlur = 30; ctx.globalAlpha = lz > 0 && lz < 1 ? 1 : 0; ctx.beginPath(); ctx.moveTo(60, 420); ctx.lineTo(170 + 260 * lz, 1180); ctx.stroke(); ctx.restore();
      if (lz > 0 && lz < 1) shards(170 + 260 * lz, 1180, (t * 4) % 1, 14, Math.floor(t * 4), '#ffd36b', 8, 250); }
    // anti-gravite drone bloğu tepeye taşır
    const bx = lerp(300, W / 2 + 80, lift), by = lerp(1100, 680, lift) - Math.sin(lift * Math.PI) * 200;
    if (t >= 8.4) { drone(bx, by - 230, 260, t); block(bx, by, 260, true); }
    else drone(300, 700 + Math.sin(t * 2) * 30, 260, t);
  });
  kinetic(['GREAT', 'PYRAMIDS'], W / 2, 200, 140, t, 5.3, { hl: { PYRAMIDS: SAND } });
  if (t > 7.32 && t < 8.48) pill('PLASMA LASERS', W / 2, 360, 70, '#ff3b6b', seg(t, 7.32, 7.6));
  if (t > 8.48) pill('ANTI-GRAVITY CRANES', W / 2, 360, 66, NEO, seg(t, 8.48, 8.75));
}

// ---------- S3 10.04–14.48: Roma, hızlı tren + uydu ağı ----------
function aqueduct(y, t) { ctx.fillStyle = '#c9a77a'; ctx.fillRect(-300, y - 300, W + 600, 70); for (let x = -300; x < W + 300; x += 160) { ctx.fillRect(x, y - 240, 30, 240); ctx.save(); ctx.beginPath(); ctx.arc(x + 95, y - 140, 65, Math.PI, 0); ctx.fillStyle = '#c9a77a'; ctx.fillRect(x + 30, y - 240, 130, 100); ctx.restore(); }
  ctx.fillStyle = 'rgba(0,0,0,0)'; }
function arch(x, y) { ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(x, y, 65, Math.PI, 0); ctx.rect(x - 65, y, 130, 140); ctx.fill(); ctx.restore(); }
function train(x, y, len, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(len - 200, -60); ctx.quadraticCurveTo(len, -55, len + 40, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c0392b'; ctx.fillRect(0, -18, len - 40, 10); ctx.fillStyle = '#2a3344'; for (let i = 0; i < len / 90 - 2; i++) ctx.fillRect(40 + i * 90, -48, 60, 22); ctx.fillStyle = NEO; ctx.beginPath(); ctx.ellipse(len - 60, -40, 70, 14, .3, 0, TAU); ctx.fill(); ctx.restore(); }
function s3(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0e1a3a'); g.addColorStop(1, '#e8a06a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const tr = seg(t, 11.2, 12.2), sat = seg(t, 12.3, 12.8);
  cam({ zoom: 1.03, t, shake: 2 + 10 * Math.sin(tr * Math.PI) }, () => {
    // uydu + ağ
    if (sat > 0) { ctx.save(); ctx.translate(W / 2 + Math.sin(t) * 40, 300); ctx.scale(eback(sat), eback(sat)); ctx.fillStyle = '#c9d2de'; ctx.fillRect(-40, -30, 80, 60); ctx.fillStyle = '#2f5aa8'; ctx.fillRect(-170, -20, 120, 40); ctx.fillRect(50, -20, 120, 40); ctx.restore();
      for (let i = 0; i < 5; i++) { const tx = 120 + i * 210, p = seg(t, 12.6 + i * .1, 13.1 + i * .1); ctx.strokeStyle = `rgba(79,240,255,${.8 * p})`; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 60; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W / 2, 330); ctx.lineTo(lerp(W / 2, tx, p), lerp(330, 1000, p)); ctx.stroke(); ctx.setLineDash([]); } }
    // kolezyum silueti
    ctx.fillStyle = '#b08a5a'; ctx.beginPath(); ctx.ellipse(W / 2, 1010, 520, 90, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(W / 2 - 520, 760, 1040, 250); ctx.fillStyle = '#6a4a2a'; for (let r = 0; r < 3; r++) for (let c = 0; c < 13; c++) { ctx.beginPath(); ctx.roundRect(W / 2 - 500 + c * 78, 790 + r * 75, 46, 56, [20, 20, 0, 0]); ctx.fill(); }
    // su kemeri + hızlı tren
    ctx.fillStyle = '#9a7a52'; ctx.fillRect(-300, 1180, W + 600, 40); for (let x = -260; x < W + 300; x += 150) { ctx.fillRect(x, 1220, 34, 260); }
    ctx.fillStyle = 'rgba(79,240,255,.6)'; ctx.fillRect(-300, 1170, W + 600, 8);
    train(lerp(-1700, 1500, eio(tr)), 1172, 1400, t);
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-300, 1480, W + 600, 500);
  });
  motionStreak(Math.sin(tr * Math.PI) * .8);
  kinetic(['ROME'], W / 2, 640, 170, t, 10.3, { hl: { ROME: '#ffd36b' } });
  if (t > 11.42) pill('BULLET TRAINS', W / 2, 1330, 60, C.red, seg(t, 11.42, 11.7));
  if (t > 12.32) pill('SATELLITE NETWORK', W / 2, 470, 56, NEO, seg(t, 12.32, 12.6));
}

// ---------- S4 14.48–21.72: tarih yeniden yazılır, antik roketler ----------
function s4(t) {
  const rl = seg(t, 17.56, 19.4);
  desertSky(t, '#0a0a1e', '#a85a3a');
  cam({ zoom: 1.04 + .06 * rl, y: 300 * eio(seg(t, 18.0, 20.5)), t, shake: 3 + 18 * seg(t, 17.56, 18.2) * (1 - seg(t, 18.8, 19.6)) }, () => {
    // zigurat fırlatma rampası
    ctx.fillStyle = '#b07a48'; for (let i = 0; i < 5; i++) ctx.fillRect(W / 2 - 360 + i * 60, 1320 - i * 90, 720 - i * 120, 90); dunes(1300, t);
    const ry = 870 - 2400 * ei(rl); ctx.save(); ctx.translate(W / 2, ry);
    const f = 1 + .3 * Math.sin(t * 50); if (rl > 0) { const fg = ctx.createLinearGradient(0, 200, 0, 200 + 500 * f); fg.addColorStop(0, '#fff3c0'); fg.addColorStop(.4, '#ff9a2e'); fg.addColorStop(1, 'rgba(255,60,20,0)'); ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(-60, 200); ctx.lineTo(0, 200 + 500 * f); ctx.lineTo(60, 200); ctx.fill(); }
    ctx.fillStyle = '#e8c27a'; ctx.beginPath(); ctx.moveTo(0, -260); ctx.lineTo(70, -120); ctx.lineTo(70, 200); ctx.lineTo(-70, 200); ctx.lineTo(-70, -120); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3da5ff'; ctx.beginPath(); ctx.arc(0, -60, 26, 0, TAU); ctx.fill(); ctx.fillStyle = '#c0392b'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 70, 80); ctx.lineTo(sx * 140, 220); ctx.lineTo(sx * 70, 200); ctx.fill(); }
    ctx.strokeStyle = '#7a4a1a'; ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-50, -20 + i * 70); ctx.lineTo(50, -20 + i * 70); ctx.stroke(); } ctx.restore();
    if (rl > 0) { const R = RN(3); for (let i = 0; i < 40; i++) { const q = (R() + t * .7) % 1; ctx.fillStyle = `rgba(220,200,180,${.5 * (1 - q)})`; ctx.beginPath(); ctx.arc(W / 2 + (R() - .5) * 900 * q, 1100 + q * 100, 40 + q * 120, 0, TAU); ctx.fill(); } }
  });
  // tarih şeridi yeniden yazılır
  if (t < 17.5) { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 160, W, 300); const p = seg(t, 15.0, 17.0);
    [['3000 BC', 'PYRAMIDS'], ['300 BC', 'ROCKETS?!'], ['1760', 'INDUSTRY']].forEach(([y, l], i) => { const x = 200 + i * 340; txt(y, x, 260, 64, i === 1 ? NEO : '#fff', { align: 'center', font: 'Anton', weight: 400 }); txt(l, x, 350, 36, i === 1 && p > .5 ? NEO : C.mute, { align: 'center', stroke: 0 }); });
    ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(400, 350); ctx.lineTo(400 + 280 * seg(t, 15.4, 16.0), 350); ctx.stroke(); ctx.restore();
    kinetic(['HISTORY'], W / 2, 600, 170, t, 14.5); bigText('REWRITTEN', W / 2, 760, 130, NEO, seg(t, 15.52, 15.8), { glow: NEO }); }
  else { kinetic(['ROCKETS', 'INTO', 'SPACE'], W / 2, 220, 130, t, 17.6, { hl: { SPACE: NEO } }); if (t > 20.22) bigText('BEFORE THE INDUSTRIAL REVOLUTION', W / 2, 1420, 70, '#fff', seg(t, 20.22, 20.5)); }
}

// ---------- S5 21.72–25.08: kılıç ve kalkan → kuantum teknoloji ----------
function sword(x, y, s, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#d8dee8'; ctx.beginPath(); ctx.moveTo(0, -s * .6); ctx.lineTo(s * .05, -s * .5); ctx.lineTo(s * .05, s * .2); ctx.lineTo(-s * .05, s * .2); ctx.lineTo(-s * .05, -s * .5); ctx.fill();
  ctx.fillStyle = '#b08a3a'; ctx.fillRect(-s * .18, s * .2, s * .36, s * .05); ctx.fillStyle = '#5a3a1a'; ctx.fillRect(-s * .03, s * .25, s * .06, s * .2); ctx.restore(); }
function shield(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.roundRect(-s * .3, -s * .42, s * .6, s * .84, s * .1); ctx.fill(); ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = s * .04; ctx.stroke(); ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.arc(0, 0, s * .1, 0, TAU); ctx.fill(); ctx.restore(); }
function s5(t) {
  bgFinance(t, { tint: 'rgba(79,240,255,.2)', seed: 7, dot: '120,240,255' });
  const sw = eio(seg(t, 22.9, 23.8));
  cam({ zoom: 1.03, t, shake: 2 + 10 * Math.sin(sw * Math.PI) }, () => {
    if (sw < 1) { ctx.save(); ctx.globalAlpha = 1 - sw; ctx.translate(W / 2, 820); ctx.scale(1 - sw * .7, 1 - sw * .7); sword(-160, 0, 700, -.5); shield(180, 40, 520); ctx.restore(); }
    if (sw > 0) { ctx.save(); ctx.globalAlpha = sw; ctx.translate(W / 2, 820); ctx.scale(eback(sw), eback(sw));
      for (let i = 0; i < 3; i++) { ctx.save(); ctx.rotate(i * Math.PI / 3 + t); ctx.strokeStyle = NEO; ctx.lineWidth = 8; ctx.shadowColor = NEO; ctx.shadowBlur = 30; ctx.beginPath(); ctx.ellipse(0, 0, 330, 110, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      for (let i = 0; i < 3; i++) { const a = t * 3 + i * 2.1; ctx.fillStyle = '#fff'; ctx.save(); ctx.rotate(i * Math.PI / 3 + t); ctx.beginPath(); ctx.arc(Math.cos(a) * 330, Math.sin(a) * 110, 18, 0, TAU); ctx.fill(); ctx.restore(); }
      const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 110); g.addColorStop(0, '#fff'); g.addColorStop(.4, NEO); g.addColorStop(1, 'rgba(79,240,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.fill(); ctx.restore(); }
  });
  kinetic(['SWORDS', '&', 'SHIELDS'], W / 2, 220, 140, t, 21.8);
  if (t > 23.22) bigText('QUANTUM TECH', W / 2, 1420, 140, NEO, seg(t, 23.22, 23.5), { glow: NEO });
}

// ---------- S6 25.08–28.24: binyıllar önce yıldızlararası yolculuk ----------
function s6(t) {
  ctx.fillStyle = '#02030a'; ctx.fillRect(0, 0, W, H);
  const warp = seg(t, 26.14, 27.0);
  const R = RN(9); for (let i = 0; i < 220; i++) { const a = R() * TAU, d0 = R(), d = ((d0 + t * (.2 + warp * 1.4)) % 1); const r1 = d * 1200, r2 = r1 + 10 + warp * 200 * d;
    ctx.strokeStyle = `rgba(${R() > .5 ? '200,230,255' : '255,220,170'},${d})`; ctx.lineWidth = 1 + d * 3; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * r1, 820 + Math.sin(a) * r1); ctx.lineTo(W / 2 + Math.cos(a) * r2, 820 + Math.sin(a) * r2); ctx.stroke(); }
  cam({ zoom: 1 + .05 * Math.sin(t * 3), t, shake: 2 + 6 * warp }, () => {
    // altın obelisk yıldız gemisi
    ctx.save(); ctx.translate(W / 2, 860 + Math.sin(t * 2) * 15); ctx.fillStyle = '#e8c27a'; ctx.beginPath(); ctx.moveTo(0, -330); ctx.lineTo(80, -240); ctx.lineTo(110, 260); ctx.lineTo(-110, 260); ctx.lineTo(-80, -240); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b08a3a'; ctx.beginPath(); ctx.moveTo(0, -330); ctx.lineTo(80, -240); ctx.lineTo(110, 260); ctx.lineTo(0, 260); ctx.fill();
    ctx.strokeStyle = NEO; ctx.lineWidth = 6; ctx.shadowColor = NEO; ctx.shadowBlur = 20; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-60, -120 + i * 90); ctx.lineTo(60, -120 + i * 90); ctx.stroke(); }
    const f = 1 + .3 * Math.sin(t * 40); const g = ctx.createLinearGradient(0, 260, 0, 260 + 400 * f); g.addColorStop(0, '#d8fbff'); g.addColorStop(.4, NEO); g.addColorStop(1, 'rgba(79,240,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-90, 260); ctx.lineTo(0, 260 + 400 * f); ctx.lineTo(90, 260); ctx.fill(); ctx.restore();
  });
  kinetic(['INTERSTELLAR'], W / 2, 220, 140, t, 26.1, { hl: { INTERSTELLAR: NEO } });
  if (t > 27.22) bigText('MILLENNIA EARLIER', W / 2, 1420, 120, SAND, seg(t, 27.22, 27.5), { glow: '#ff8a3a' });
}

// ---------- S7 28.24–33.26: ya da imparatorlukları daha hızlı silerdi ----------
function s7(t) {
  const bl = seg(t, 30.24, 30.5);
  desertSky(t, '#1a0606', '#ff5a2e');
  cam({ zoom: 1.04 + .1 * seg(t, 30.24, 33.2), t, shake: 3 + 26 * (bl > 0 ? 1 - seg(t, 30.5, 31.6) : 0) }, () => {
    // patlama bulutu
    if (bl > 0) { const k = eo(seg(t, 30.24, 32.5)); ctx.fillStyle = 'rgba(80,40,30,.9)'; ctx.fillRect(W / 2 - 50 * k - 20, 1200 - 700 * k, 100 * k + 40, 700 * k);
      for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; ctx.fillStyle = i % 2 ? '#ff7a2e' : '#a83a1a'; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * 200 * k, 1200 - 700 * k + Math.sin(a) * 90 * k, 160 * k, 0, TAU); ctx.fill(); }
      ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(W / 2, 1200 - 700 * k, 120 * k, 0, TAU); ctx.fill(); }
    // tapınak sütunları çöker
    const col = seg(t, 30.4, 31.6);
    for (let i = 0; i < 6; i++) { const x = 140 + i * 160, a = col * (i % 2 ? .9 : -.8) * clamp(col * 2 - i * .1); ctx.save(); ctx.translate(x, 1300); ctx.rotate(a); ctx.fillStyle = '#e8dcc0'; ctx.fillRect(-36, -420, 72, 420); ctx.fillStyle = '#c9b48a'; ctx.fillRect(-50, -440, 100, 30); for (let k = -1; k <= 1; k++) { ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(k * 20 - 4, -410, 8, 400); } ctx.restore(); }
    ctx.save(); ctx.translate(W / 2, 860 + 300 * ei(col)); ctx.rotate(.2 * col); ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.moveTo(-540, 0); ctx.lineTo(0, -140); ctx.lineTo(540, 0); ctx.closePath(); ctx.fill(); ctx.restore();
    dunes(1290, t, ['#7a3a1a', '#4a1a0a']);
  });
  flash(t, 30.24, .3, '255,230,180');
  kinetic(['OR', 'WIPED', 'OUT'], W / 2, 220, 160, t, 29.9, { hl: { WIPED: C.red, OUT: C.red } });
  if (t > 31.96) stampText('MUCH FASTER', W / 2, 1420, 110, '#fff', seg(t, 31.96, 32.25));
}

const THEO = ['We would be on Mars by now', 'Rome never falls', 'Aliens taught them', 'They nuked themselves', 'Pyramids = power plants', 'History would be cooler'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 5.04, 10.04, 14.48, 21.72, 25.08, 28.24, 33.26, 99], S = [s1, s2, s3, s4, s5, s6, s7, null];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i] ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 33.26), 33.26, 34.76, 35.34, THEO, { tint: 'rgba(232,181,106,.2)', dot: '255,210,150' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 15.52 && t < 15.75 ? .8 : 0) + (t > 2.42 && t < 2.6 ? .6 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
