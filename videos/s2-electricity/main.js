// Seri2 #15 — "What If Electricity Stopped Working Forever?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 45.42;
const SUBY = 1540;
const VOLT = '#ffe23a', CY = '#4ad8ff', RED = '#ff3b4e', FIRE = '#ff8a2a';

function dark(t, top = '#0a0f22', bot = '#000') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function bolt(x1, y1, x2, y2, seed, col = VOLT, w = 8) { const R = RN(seed); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); for (let i = 1; i < 10; i++) { const k = i / 10; ctx.lineTo(lerp(x1, x2, k) + (R() - .5) * 90, lerp(y1, y2, k) + (R() - .5) * 40); } ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function bulb(x, y, s, on, t) { ctx.save(); ctx.translate(x, y); if (on > 0) { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.2); g.addColorStop(0, `rgba(255,226,58,${.5 * on})`); g.addColorStop(1, 'rgba(255,226,58,0)'); ctx.fillStyle = g; ctx.fillRect(-s * 2.5, -s * 2.5, s * 5, s * 5); }
  ctx.fillStyle = on > 0 ? lerpRGB('#3a3a44', '#fff6b0', on) : '#2a2a34'; ctx.strokeStyle = '#8a8a99'; ctx.lineWidth = s * .04; ctx.beginPath(); ctx.arc(0, -s * .2, s * .5, Math.PI * .8, Math.PI * .2); ctx.lineTo(s * .22, s * .4); ctx.lineTo(-s * .22, s * .4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#777'; ctx.fillRect(-s * .22, s * .4, s * .44, s * .3); ctx.restore(); }
function lerpRGB(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return 'rgb(' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k)))).join(',') + ')'; }
function flicker(t, t0) { if (t < t0) return 1; const d = t - t0; if (d > .6) return 0; return Math.sin(d * 90) > .2 ? 1 - d : 0; }

// ---------- S1 0–6.2: güneş fırtınası çarpar, dünya kararır ----------
function s1(t) {
  dark(t, '#140818', '#000');
  const hit = seg(t, .6, 2.0), off = seg(t, 3.94, 4.9);
  cam({ zoom: 1.05 + .1 * hit, t, shake: 2 + 18 * seg(t, 1.6, 2.1) * (1 - seg(t, 2.1, 3)) + 14 * seg(t, 3.9, 4.2) * (1 - seg(t, 4.2, 5)) }, () => {
    // güneş sol üst + plazma kolu
    const sx = W + 80, sy = 640; const g = ctx.createRadialGradient(sx, sy, 50, sx, sy, 420); g.addColorStop(0, '#fff6c0'); g.addColorStop(.4, '#ff9a2a'); g.addColorStop(1, 'rgba(255,60,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, 420, 0, TAU); ctx.fill();
    for (let i = 0; i < 26; i++) { const q = clamp(hit * 1.4 - i * .02), a = 2.6 + (i % 5 - 2) * .06; ctx.fillStyle = `rgba(255,${120 + i * 4},40,${.7 * (1 - q * .4)})`; ctx.beginPath(); ctx.arc(sx + Math.cos(a) * q * 900 + (i % 3) * 30, sy + Math.sin(a) * q * 900, 30 - i * .6, 0, TAU); ctx.fill(); }
    // dünya: ışıklar sönüyor
    earth(400, 1080, 330, t, { rot: t * .3 });
    const R = RN(4), on = 1 - off; for (let i = 0; i < 60; i++) { const a = R() * TAU, r = Math.sqrt(R()) * 300; if (R() > on) continue; ctx.fillStyle = VOLT; ctx.shadowColor = VOLT; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(400 + Math.cos(a) * r, 1080 + Math.sin(a) * r, 4, 0, TAU); ctx.fill(); } ctx.shadowBlur = 0;
    if (t > 1.6 && t < 3.9) for (let i = 0; i < 3; i++) bolt(400 + (i - 1) * 200, 760, 400 + (i - 1) * 120, 1230, Math.floor(t * 20) + i, CY, 6);
    if (off > 0) { ctx.fillStyle = `rgba(0,0,0,${.55 * off})`; ctx.beginPath(); ctx.arc(400, 1080, 332, 0, TAU); ctx.fill(); }
  });
  kinetic(['WHAT', 'IF', 'ELECTRICITY'], W / 2, 200, 120, t, -.3, { gap: .05, hl: { ELECTRICITY: VOLT } });
  kinetic(['DIED?'], W / 2, 350, 200, t, .15, { hl: { 'DIED?': RED } });
  if (t > 1.96) pill('SOLAR STORM', 300, 520, 52, FIRE, seg(t, 1.96, 2.2));
  if (t > 4.82) stampText('FOREVER', W / 2, 1420, 130, RED, seg(t, 4.82, 5.05));
}

// ---------- S2 6.2–10.28: 200 yıl geri sarma ----------
function s2(t) {
  dark(t, '#20140a', '#050302');
  const rw = eio(seg(t, 6.4, 9.6)), yr = Math.round(lerp(2025, 1825, rw));
  cam({ zoom: 1.03 + .05 * rw, rot: -rw * .04, t, shake: 3 }, () => {
    // geri dönen dev saat
    ctx.save(); ctx.translate(W / 2, 900); ctx.strokeStyle = '#c9a77a'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 340, 0, TAU); ctx.stroke(); for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i / 12 * TAU); ctx.fillStyle = '#c9a77a'; ctx.fillRect(-6, -320, 12, 40); ctx.restore(); }
    ctx.save(); ctx.rotate(-t * 9); ctx.fillStyle = '#fff'; ctx.fillRect(-6, -280, 12, 280); ctx.restore(); ctx.save(); ctx.rotate(-t * 1.5); ctx.fillStyle = VOLT; ctx.fillRect(-10, -190, 20, 190); ctx.restore(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill();
    // geri sarma okları
    for (let k = 0; k < 2; k++) { ctx.save(); ctx.rotate(-t * 2 + k * Math.PI); ctx.strokeStyle = FIRE; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, 0, 420, -.6, .6); ctx.stroke(); ctx.fillStyle = FIRE; ctx.beginPath(); ctx.moveTo(Math.cos(-.6) * 420, Math.sin(-.6) * 420); ctx.lineTo(Math.cos(-.6) * 420 + 40, Math.sin(-.6) * 420 + 30); ctx.lineTo(Math.cos(-.6) * 420 - 30, Math.sin(-.6) * 420 + 40); ctx.fill(); ctx.restore(); }
    ctx.restore();
  });
  txt(String(yr), W / 2, 1420, 200, rw > .95 ? FIRE : '#fff', { align: 'center', font: 'Anton', weight: 400 });
  kinetic(['REWIND'], W / 2, 260, 170, t, 6.25, { hl: { REWIND: FIRE } });
  if (t > 8.28) pill('200 YEARS', W / 2, 440, 64, '#fff', seg(t, 8.28, 8.5));
}

// ---------- S3 10.28–15.6: telefon, bilgisayar, hastane makinesi ölür ----------
function phone(x, y, s, on) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#15161c'; ctx.beginPath(); ctx.roundRect(-s * .3, -s * .55, s * .6, s * 1.1, s * .08); ctx.fill(); ctx.fillStyle = on ? '#3a7aff' : '#050508'; ctx.beginPath(); ctx.roundRect(-s * .26, -s * .5, s * .52, s * 1, s * .05); ctx.fill(); if (on) { ctx.fillStyle = '#fff'; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.roundRect(-s * .2 + j * s * .15, -s * .4 + i * s * .17, s * .1, s * .1, s * .02); ctx.fill(); } } ctx.restore(); }
function laptop(x, y, s, on) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#3a3c44'; ctx.fillRect(-s * .5, -s * .6, s, s * .62); ctx.fillStyle = on ? '#1ad8a0' : '#050508'; ctx.fillRect(-s * .45, -s * .55, s * .9, s * .52); if (on) { ctx.fillStyle = 'rgba(0,0,0,.4)'; for (let i = 0; i < 5; i++) ctx.fillRect(-s * .38, -s * .48 + i * s * .09, s * (.3 + (i * 37 % 40) / 100), s * .04); } ctx.fillStyle = '#5a5c66'; ctx.beginPath(); ctx.moveTo(-s * .58, s * .1); ctx.lineTo(s * .58, s * .1); ctx.lineTo(s * .5, 0); ctx.lineTo(-s * .5, 0); ctx.fill(); ctx.restore(); }
function ecg(x, y, w, h, t, on) { ctx.save(); ctx.fillStyle = '#0e1418'; ctx.beginPath(); ctx.roundRect(x - 20, y - h / 2 - 20, w + 40, h + 40, 20); ctx.fill(); ctx.strokeStyle = on ? '#3aff7a' : '#2a3a2a'; ctx.lineWidth = 6; ctx.shadowColor = '#3aff7a'; ctx.shadowBlur = on ? 14 : 0; ctx.beginPath(); for (let i = 0; i <= 100; i++) { const xx = x + i / 100 * w, ph = (i / 100 * 3 + t * 1.2) % 1; let v = 0; if (on) v = ph > .45 && ph < .5 ? -1 : ph > .5 && ph < .55 ? .6 : 0; i ? ctx.lineTo(xx, y + v * h * .45) : ctx.moveTo(xx, y); } ctx.stroke(); ctx.restore(); }
function s3(t) {
  dark(t, '#0c1020', '#020204');
  const dead = t > 13.14;
  cam({ zoom: 1.04 + (dead ? .06 * seg(t, 13.14, 13.6) : 0), t, shake: 2 + (dead ? 12 * (1 - seg(t, 13.14, 13.8)) : 0) }, () => {
    const p1 = eback(seg(t, 10.28, 10.6)), p2 = eback(seg(t, 11.12, 11.4)), p3 = eback(seg(t, 11.82, 12.1));
    const f1 = flicker(t, 13.14), f2 = flicker(t, 13.3), f3 = flicker(t, 13.5);
    if (p1 > 0) { ctx.save(); ctx.translate(260, 780); ctx.scale(p1, p1); phone(0, 0, 380, f1 > 0); ctx.restore(); }
    if (p2 > 0) { ctx.save(); ctx.translate(760, 760); ctx.scale(p2, p2); laptop(0, 0, 440, f2 > 0); ctx.restore(); }
    if (p3 > 0) { ctx.save(); ctx.translate(W / 2, 1180); ctx.scale(p3, p3); ecg(-380, 0, 760, 200, t, f3 > 0); ctx.restore(); }
  });
  pill('PHONE', 260, 470, 50, CY, seg(t, 10.28, 10.5)); pill('COMPUTER', 760, 470, 50, '#1ad8a0', seg(t, 11.12, 11.35)); pill('HOSPITAL', W / 2, 1400, 50, '#3aff7a', seg(t, 11.82, 12.05));
  if (dead) bigText('DEAD.', W / 2, 260, 200, RED, seg(t, 13.14, 13.35), { glow: RED });
  else kinetic(['EVERY', 'DEVICE'], W / 2, 260, 150, t, 10.0, { hl: { DEVICE: VOLT } });
}

// ---------- S4 15.6–24.3: pompalar, motorlar durur, milyarlar mahsur ----------
function car(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .25, s, s * .25, s * .05); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .3, -s * .42, s * .55, s * .2, s * .06); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-s * .3, 0, s * .1, 0, TAU); ctx.arc(s * .3, 0, s * .1, 0, TAU); ctx.fill(); ctx.restore(); }
function s4(t) {
  dark(t, '#141622', '#05060a');
  const lateS = t > 21.2;
  cam({ zoom: 1.03 + (lateS ? .08 * seg(t, 21.2, 24) : 0), x: lerp(60, -60, seg(t, 15.6, 24.3)), t, shake: 2 }, () => {
    // benzin pompası (söner)
    const on = 1 - seg(t, 16.3, 16.7);
    ctx.save(); ctx.translate(230, 900); ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.roundRect(-110, -320, 220, 380, 20); ctx.fill(); ctx.fillStyle = on > .5 ? '#7affb0' : '#101010'; ctx.fillRect(-80, -280, 160, 90); if (on > .5) txt('$ 4.19', 0, -235, 44, '#063', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); else txt('---', 0, -235, 44, '#333', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
    ctx.strokeStyle = '#222'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(110, -150); ctx.quadraticCurveTo(200, -40, 160, 40); ctx.stroke(); ctx.restore();
    // tıkalı otoyol: arabalar durmuş
    ctx.fillStyle = '#2a2c34'; ctx.fillRect(-300, 1060, W + 600, 220); ctx.fillStyle = '#ffd23a'; for (let i = 0; i < 12; i++) ctx.fillRect(-200 + i * 140, 1166, 70, 10);
    const mv = 1 - seg(t, 17.26, 18.0), cols = ['#3a7aff', '#ff8a2a', '#1ad8a0', '#c87aff', '#e8e8f0', '#ff3b4e'];
    for (let i = 0; i < 7; i++) car(((-150 + i * 210 + t * 300 * mv) % 1500 + 1500) % 1500 - 200, 1150 - (i % 2) * 60 + 60, 220, cols[i % 6]);
    // motor dişlisi durur
    ctx.save(); ctx.translate(800, 650); ctx.rotate(t * 4 * mv + 17.26 * 4 * (1 - mv)); ctx.fillStyle = '#6a6c78'; for (let i = 0; i < 10; i++) { ctx.save(); ctx.rotate(i / 10 * TAU); ctx.fillRect(-22, -160, 44, 50); ctx.restore(); } ctx.beginPath(); ctx.arc(0, 0, 125, 0, TAU); ctx.fill(); ctx.fillStyle = '#14161e'; ctx.beginPath(); ctx.arc(0, 0, 45, 0, TAU); ctx.fill(); ctx.restore();
    // insan kalabalığı mahsur
    if (lateS) { const R = RN(8), k = seg(t, 21.2, 22.2); for (let i = 0; i < 40; i++) { if (R() > k) continue; human(R() * W, 1300 + R() * 120, 70 + R() * 30); } }
  });
  if (!lateS) { pill('GAS PUMPS', 230, 480, 52, RED, seg(t, 16.04, 16.25)); } if (!lateS) pill('MOTORS', 800, 420, 52, '#9aa2b0', seg(t, 17.26, 17.45));
  if (t > 18.62 && !lateS) bigText('TRANSPORT HALTS', W / 2, 260, 110, VOLT, seg(t, 18.62, 18.9));
  if (lateS) { counter(0, 8, W / 2, 260, 190, seg(t, 21.3, 21.9), { fmt: v => Math.round(v) + 'B', col: RED }); stampText('STRANDED', W / 2, 420, 90, '#fff', seg(t, 21.84, 22.1)); }
}

// ---------- S5 24.3–32.6: buzdolabı ölür, gıda/ilaç bozulur, yağma ----------
function s5(t) {
  const loot = t > 30.4;
  dark(t, loot ? '#2a0a0a' : '#0e121c', '#020202');
  cam({ zoom: 1.03 + (loot ? .06 : 0), t, shake: 2 + (loot ? 8 * Math.max(0, Math.sin(t * 6)) : 0) }, () => {
    if (!loot) {
      // açık buzdolabı, iç ışık söner, yiyecekler çürür (renk kayar)
      const off = seg(t, 24.9, 25.4), rot = seg(t, 26.6, 29.4);
      ctx.save(); ctx.translate(W / 2, 880); ctx.fillStyle = '#d8dde6'; ctx.beginPath(); ctx.roundRect(-300, -480, 600, 960, 30); ctx.fill(); ctx.fillStyle = lerpRGB('#fffbe0', '#1a1c22', off); ctx.fillRect(-260, -440, 520, 880); ctx.fillStyle = 'rgba(150,160,170,.6)'; for (let i = 1; i < 4; i++) ctx.fillRect(-260, -440 + i * 220, 520, 10);
      const food = [['#ff3b4e', -170, -330, 60], ['#ffd23a', 30, -340, 50], ['#5ac83a', 170, -320, 55], ['#ffffff', -150, -110, 50], ['#ff8a2a', 60, -100, 70], ['#4ad8ff', -160, 120, 45], ['#ff3b4e', 80, 120, 60], ['#e8c8a0', -40, 330, 80]];
      food.forEach(([c, x, y, r], i) => { ctx.fillStyle = lerpRGB(c, '#4a5a2a', rot); ctx.beginPath(); ctx.ellipse(x, y, r * (1 - rot * .2), r * (1 - rot * .35), 0, 0, TAU); ctx.fill(); if (rot > .3) { ctx.fillStyle = `rgba(120,160,60,${rot})`; ctx.beginPath(); ctx.arc(x + r * .3, y - r * .2, r * .25 * rot, 0, TAU); ctx.fill(); } });
      // ilaç şişesi
      ctx.fillStyle = '#ff8a2a'; ctx.fillRect(140, 290, 70, 100); ctx.fillStyle = '#fff'; ctx.fillRect(135, 270, 80, 26); ctx.restore();
      // sinekler
      if (rot > .3) { const R = RN(6); for (let i = 0; i < 10; i++) { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(W / 2 + Math.sin(t * 5 + i * 2) * (180 + R() * 120), 860 + Math.cos(t * 6 + i) * 220, 8, 0, TAU); ctx.fill(); } }
    } else {
      // vitrin kırılır, kalabalık dükkâna koşar
      ctx.fillStyle = '#2a2024'; ctx.fillRect(100, 600, 880, 650); ctx.fillStyle = '#3a4a5a'; ctx.fillRect(160, 700, 760, 500);
      txt('SHOP', W / 2, 660, 70, '#ffd23a', { align: 'center', font: 'Anton', weight: 400 });
      shards(W / 2, 850, seg(t, 30.72, 31.6), 40, 3, '#bfe8ff', 26, 800);
      const R = RN(2); for (let i = 0; i < 18; i++) { const x = lerp(-100 + R() * 300, 400 + R() * 400, eo(seg(t, 30.8 + i * .04, 32.4))), y = 1250 + R() * 120; human(x, y, 110); }
      for (let i = 0; i < 3; i++) { ctx.save(); ctx.globalAlpha = .3 + .2 * Math.sin(t * 9 + i); ctx.fillStyle = i % 2 ? RED : '#3a7aff'; ctx.beginPath(); ctx.arc(150 + i * 400, 200, 220, 0, TAU); ctx.fill(); ctx.restore(); }
    }
  });
  if (!loot) { if (t > 26.62) pill('FOOD', 220, 300, 56, '#5ac83a', seg(t, 26.62, 26.85)); if (t > 27.06) pill('MEDICINE', 780, 300, 56, FIRE, seg(t, 27.06, 27.3)); if (t > 28.1) stampText('SPOILED IN DAYS', W / 2, 1420, 90, RED, seg(t, 28.1, 28.35)); else kinetic(['NO', 'COLD'], W / 2, 180, 110, t, 24.6, { hl: { COLD: CY } }); }
  else { kinetic(['PANIC'], W / 2, 260, 200, t, 30.5, { hl: { PANIC: RED } }); if (t > 31.48) stampText('LOOTING', W / 2, 1320, 110, '#fff', seg(t, 31.48, 31.7)); }
}

// ---------- S6 32.6–37.6: şehirler yaşanmaz: su yok, kanalizasyon taşar ----------
function s6(t) {
  dark(t, '#141418', '#030304');
  cam({ zoom: 1.03 + .05 * seg(t, 32.6, 37.6), t, shake: 2 }, () => {
    skyline(1000, t, { seed: 13, tall: 520, col: '#1a1c24' });
    // kuru musluk: son damla
    ctx.save(); ctx.translate(300, 1200); ctx.fillStyle = '#9aa2b0'; ctx.fillRect(-120, -30, 200, 50); ctx.fillRect(40, -30, 50, 110); ctx.fillRect(-30, -80, 60, 60); const dq = (t * .7) % 1; ctx.fillStyle = CY; ctx.beginPath(); ctx.arc(65, 90 + dq * 200, 12 * (1 - dq), 0, TAU); ctx.fill(); ctx.restore();
    // taşan kanalizasyon
    const sw = seg(t, 35.86, 37.3); ctx.fillStyle = '#4a4a2a'; ctx.beginPath(); ctx.moveTo(-300, H); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, 1350 - sw * 220 + Math.sin(x * .02 + t * 3) * 14); ctx.lineTo(W + 300, H); ctx.fill();
    ctx.fillStyle = '#2a2c34'; ctx.beginPath(); ctx.ellipse(760, 1300 - sw * 220, 120, 30, 0, 0, TAU); ctx.fill();
    // kafatası tabelası
    if (t > 33.18) { const k = eback(seg(t, 33.18, 33.5)); ctx.save(); ctx.translate(780, 900); ctx.scale(k, k); ctx.fillStyle = '#ffd23a'; ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(150, 110); ctx.lineTo(-150, 110); ctx.fill(); txt('!', 0, 30, 170, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
  });
  bigText('UNLIVABLE', W / 2, 260, 150, RED, seg(t, 33.18, 33.45), { glow: RED });
  pill('NO WATER', 300, 1420, 54, CY, seg(t, 34.92, 35.15)); pill('SEWAGE', 780, 1420, 54, '#a8a85a', seg(t, 35.86, 36.1));
}

// ---------- S7 37.6–45.42: kırsala göç, ateş, mum, at, el emeği ----------
function s7(t) {
  const night = t > 42;
  dark(t, night ? '#1a0e06' : '#3a5a8a', night ? '#050200' : '#c9a77a');
  cam({ zoom: 1.03 + .06 * seg(t, 42, 45.4), x: lerp(-80, 80, seg(t, 37.6, 45.4)), t, shake: 1 }, () => {
    if (!night) {
      ctx.fillStyle = '#5aa83a'; ctx.beginPath(); ctx.moveTo(-300, 1100); ctx.quadraticCurveTo(W / 2, 950, W + 300, 1100); ctx.lineTo(W + 300, H); ctx.lineTo(-300, H); ctx.fill();
      ctx.fillStyle = '#c9a03a'; for (let r = 0; r < 6; r++) ctx.fillRect(-200, 1180 + r * 70, W + 400, 30);
      skyline(1080, t, { seed: 21, tall: 200, col: 'rgba(30,30,40,.6)' });
      // göç eden aile kuyruğu
      for (let i = 0; i < 14; i++) { const q = (seg(t, 37.8, 42) * 1.2 + i * .07) % 1.2; human(lerp(-100, 1150, q), 1150 + (i % 3) * 30, 110 - (i % 4) * 10); }
    } else {
      // kamp ateşi + mum + at + el emeği
      ctx.fillStyle = '#1a1008'; ctx.fillRect(-300, 1250, W + 600, 700);
      const fl = .8 + .2 * Math.sin(t * 17); const g = ctx.createRadialGradient(W / 2, 1150, 0, W / 2, 1150, 600); g.addColorStop(0, `rgba(255,140,40,${.45 * fl})`); g.addColorStop(1, 'rgba(255,140,40,0)'); ctx.fillStyle = g; ctx.fillRect(-300, 500, W + 600, 1300);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = ['#ffe23a', '#ff8a2a', '#ff3b2a'][i % 3]; ctx.beginPath(); ctx.moveTo(W / 2 - 90 + i * 45, 1250); ctx.quadraticCurveTo(W / 2 - 110 + i * 45 + Math.sin(t * 9 + i) * 20, 1100, W / 2 - 70 + i * 45 + Math.sin(t * 11 + i) * 25, 1000 - (i % 2) * 80); ctx.quadraticCurveTo(W / 2 - 50 + i * 45, 1150, W / 2 - 40 + i * 45, 1250); ctx.fill(); }
      ctx.fillStyle = '#5a3a1a'; ctx.save(); ctx.translate(W / 2, 1260); ctx.rotate(.2); ctx.fillRect(-130, -15, 260, 30); ctx.rotate(-.4); ctx.fillRect(-130, -15, 260, 30); ctx.restore();
      if (t > 43.18) { const k = eback(seg(t, 43.18, 43.5)); ctx.save(); ctx.translate(180, 1240); ctx.scale(k, k); ctx.fillStyle = '#f0e6d0'; ctx.fillRect(-25, -160, 50, 160); ctx.fillStyle = '#ffd23a'; ctx.shadowColor = '#ffd23a'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.ellipse(0, -195, 14 + Math.sin(t * 13) * 2, 30, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      if (t > 44.1) { const k = eback(seg(t, 44.1, 44.4)); ctx.save(); ctx.translate(790, 1240); ctx.scale(k, k); ctx.fillStyle = '#8a5a2a'; ctx.beginPath(); ctx.ellipse(0, -180, 140, 60, 0, 0, TAU); ctx.fill(); ctx.save(); ctx.translate(120, -230); ctx.rotate(-.7); ctx.fillRect(-25, -110, 60, 130); ctx.restore(); ctx.beginPath(); ctx.ellipse(170, -330, 40, 70, -.9, 0, TAU); ctx.fill(); for (const lx of [-110, -60, 70, 120]) ctx.fillRect(lx, -150, 22, 150 - Math.max(0, Math.sin(t * 6 + lx)) * 20); ctx.restore(); }
    }
  });
  if (!night) { kinetic(['MASS', 'MIGRATION'], W / 2, 260, 140, t, 37.7, { hl: { MIGRATION: VOLT } }); if (t > 38.98) pill('→ FARMLAND', W / 2, 440, 60, '#5ac83a', seg(t, 38.98, 39.2)); }
  else { pill('FIRE', 300, 300, 64, FIRE, seg(t, 42.3, 42.5)); pill('CANDLES', 560, 400, 60, '#ffd23a', seg(t, 43.18, 43.4)); pill('HORSES', 820, 300, 64, '#c9a77a', seg(t, 44.1, 44.3)); if (t > 44.8) stampText('MANUAL LABOR', W / 2, 560, 100, '#fff', seg(t, 44.8, 45.05)); }
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 6.2, 10.28, 15.6, 24.3, 32.6, 37.6, 99], S = [s1, s2, s3, s4, s5, s6, s7];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 3.94 && t < 4.2 ? 1 : 0) + (t > 13.14 && t < 13.4 ? .8 : 0) + (t > 30.72 && t < 30.9 ? .6 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
