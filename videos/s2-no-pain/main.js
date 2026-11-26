// Seri2 #9 — "What If You Never Felt Pain?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 40.59;
const SUBY = 1540;
const RED = '#ff3b4e', GOLD = '#ffc83d', CY = '#4ff0ff', GRN = '#22e07a', PUR = '#9b6bff';

function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function body(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -s * .88, s * .11, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .18, -s * .75, s * .36, s * .42, s * .1); ctx.fill();
  ctx.lineWidth = s * .1; ctx.beginPath(); ctx.moveTo(-s * .08, -s * .36); ctx.lineTo(-s * .1, 0); ctx.moveTo(s * .08, -s * .36); ctx.lineTo(s * .1, 0); ctx.moveTo(-s * .17, -s * .7); ctx.lineTo(-s * .28, -s * .4); ctx.moveTo(s * .17, -s * .7); ctx.lineTo(s * .28, -s * .4); ctx.stroke(); ctx.restore(); }
function siren(x, y, s, on, t) { ctx.save(); ctx.translate(x, y); const lit = on && Math.sin(t * 16) > 0; ctx.fillStyle = '#3a3e48'; ctx.fillRect(-s * .6, s * .2, s * 1.2, s * .25); ctx.fillStyle = lit ? RED : (on ? '#a02030' : '#5a5e68'); if (lit) { ctx.shadowColor = RED; ctx.shadowBlur = 60; }
  ctx.beginPath(); ctx.arc(0, s * .2, s * .5, Math.PI, 0); ctx.fill(); ctx.shadowBlur = 0; if (lit) { ctx.strokeStyle = 'rgba(255,59,78,.6)'; ctx.lineWidth = 8; for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, s * (.6 + i * .25), -2.6, -.5); ctx.stroke(); } } ctx.restore(); }

// ---------- S1 0–2.8: süper güç mü? ----------
function s1(t) {
  darkGrad('#14082a', '#05030a');
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 2.8)), t, shake: 2 }, () => {
    // ışık patlaması
    ctx.save(); ctx.translate(W / 2, 920); for (let i = 0; i < 16; i++) { ctx.rotate(TAU / 16); ctx.fillStyle = i % 2 ? 'rgba(255,200,61,.1)' : 'rgba(155,107,255,.1)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -120); ctx.lineTo(1400, 120); ctx.fill(); } ctx.restore();
    // pelerinli kahraman
    const cw = Math.sin(t * 5) * 30; ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(W / 2 - 110, 600); ctx.quadraticCurveTo(W / 2 - 260 + cw, 1000, W / 2 - 200 + cw, 1320); ctx.lineTo(W / 2 + 200 - cw, 1320); ctx.quadraticCurveTo(W / 2 + 260 - cw, 1000, W / 2 + 110, 600); ctx.fill();
    body(W / 2, 1320, 820, '#2a3a8a'); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(W / 2, 700); ctx.lineTo(W / 2 + 60, 760); ctx.lineTo(W / 2, 830); ctx.lineTo(W / 2 - 60, 760); ctx.fill();
    // ağrı ölçer 0%
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.roundRect(680, 1080, 340, 170, 30); ctx.fill(); ctx.restore(); txt('PAIN', 850, 1130, 44, '#fff', { align: 'center', stroke: 0 }); txt('0%', 850, 1205, 80, GRN, { align: 'center', font: 'Anton', weight: 400, glow: GRN });
  });
  kinetic(['WHAT', 'IF', 'YOU', 'NEVER'], W / 2, 200, 140, t, -.3, { gap: .05 });
  kinetic(['FELT', 'PAIN?'], W / 2, 360, 170, t, .1, { hl: { 'PAIN?': RED } });
  if (t > 1.78) bigText('SUPERPOWER?', W / 2, 520, 100, GOLD, seg(t, 1.78, 2.0), { glow: GOLD });
}

// ---------- S2 2.8–8.76: tek uyarı sistemi kapanır ----------
function s2(t) {
  darkGrad('#0a0a1a', '#020206');
  const off = seg(t, 6.9, 7.4);
  cam({ zoom: 1.04, t, shake: 2 + 8 * seg(t, 6.9, 7.1) * (1 - seg(t, 7.1, 7.6)) }, () => {
    // vücut + sinir ağı
    ctx.save(); ctx.globalAlpha = .35; body(W / 2, 1400, 1050, '#4a5a8a'); ctx.restore();
    const R = RN(3); const tips = Array.from({ length: 14 }, () => [W / 2 + (R() - .5) * 600, 600 + R() * 780]);
    tips.forEach(([x, y], i) => { ctx.strokeStyle = off > .5 ? 'rgba(100,100,120,.5)' : 'rgba(79,240,255,.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W / 2, 470); ctx.quadraticCurveTo((W / 2 + x) / 2 + 40, (470 + y) / 2, x, y); ctx.stroke();
      if (off < 1) { const q = ((t * 1.2 + i * .17) % 1); const xx = lerp(x, W / 2, q), yy = lerp(y, 470, q); ctx.fillStyle = `rgba(255,255,255,${1 - off})`; ctx.beginPath(); ctx.arc(xx, yy, 8, 0, TAU); ctx.fill(); } });
    ctx.fillStyle = off > .5 ? '#5a5e68' : '#ff8aa8'; ctx.beginPath(); ctx.ellipse(W / 2, 450, 110, 85, 0, 0, TAU); ctx.fill();
    siren(840, 360, 120, off < .5, t);
    // ŞALTER: OFF
    if (off > 0) { ctx.save(); ctx.translate(240, 360); ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.roundRect(-70, -110, 140, 220, 20); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.roundRect(-35, lerp(-80, 10, eio(off)), 70, 70, 12); ctx.fill(); txt('OFF', 0, 150, 44, RED, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
  });
  kinetic(['PAIN', '=', 'ALARM'], W / 2, 230, 150, t, 4.3, { hl: { ALARM: RED } });
  if (t > 6.66) bigText('AGAINST SELF-DESTRUCTION', W / 2, 1440, 84, '#fff', seg(t, 6.66, 6.9));
}

// ---------- S3 8.76–14.66: yanan ocakta el ----------
function s3(t) {
  darkGrad('#1a1008', '#060302');
  const burn = seg(t, 11.2, 13.4);
  cam({ zoom: 1.04 + .08 * burn, t, shake: 2 + 6 * burn }, () => {
    // ocak
    ctx.fillStyle = '#2a2e36'; ctx.fillRect(100, 1100, 880, 400); ctx.fillStyle = '#14161c'; ctx.beginPath(); ctx.ellipse(W / 2, 1100, 300, 70, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 14; i++) { const x = W / 2 - 260 + i * 40, h = 90 + 50 * Math.sin(t * 12 + i * 1.7); const g = ctx.createLinearGradient(0, 1100 - h, 0, 1100); g.addColorStop(0, 'rgba(120,200,255,0)'); g.addColorStop(.5, 'rgba(80,150,255,.9)'); g.addColorStop(1, '#ff8a3a'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 20, 1100); ctx.quadraticCurveTo(x, 1100 - h, x + 20, 1100); ctx.fill(); }
    // el — çekilmiyor
    ctx.save(); ctx.translate(W / 2 + 40, 980); ctx.fillStyle = lerpC('#e8b48a', '#7a2a1a', burn); ctx.beginPath(); ctx.roundRect(-160, -60, 320, 120, 50); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.roundRect(-150 + i * 80, -130, 60, 100, 30); ctx.fill(); } ctx.fillRect(140, -50, 400, 100); ctx.restore();
    // duman
    if (burn > 0) for (let i = 0; i < 8; i++) { const q = ((t * .7 + i / 8) % 1); ctx.fillStyle = `rgba(120,120,120,${.5 * (1 - q) * burn})`; ctx.beginPath(); ctx.arc(W / 2 - 100 + i * 40 + Math.sin(q * 6 + i) * 30, 900 - q * 500, 30 + q * 60, 0, TAU); ctx.fill(); }
    // "acımıyor" düşüncesi
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(640, 520, 340, 140, 60); ctx.fill(); txt('feels fine.', 810, 590, 46, '#111', { align: 'center', weight: 800, stroke: 0 });
  });
  kinetic(['BURNING', 'STOVE'], W / 2, 230, 160, t, 10.9, { hl: { STOVE: '#ff8a3a' } });
  if (t > 13.02) stampText('SKIN SCORCHING', W / 2, 1440, 110, RED, seg(t, 13.02, 13.3));
}

// ---------- S4 14.66–20.94: kırık bilekle günlerce yürümek (röntgen) ----------
function s4(t) {
  darkGrad('#020a14', '#000204');
  const cr = seg(t, 15.94, 19.0), day = 1 + Math.floor(seg(t, 16.3, 18.8) * 6);
  cam({ zoom: 1.04, t, shake: 2 + 4 * Math.max(0, Math.sin(t * 6)) }, () => {
    // röntgen çerçevesi
    ctx.strokeStyle = 'rgba(79,240,255,.4)'; ctx.lineWidth = 6; ctx.strokeRect(140, 380, 800, 1060);
    const step = Math.sin(t * 6) * .1; ctx.save(); ctx.translate(W / 2, 420); ctx.rotate(step);
    ctx.fillStyle = 'rgba(200,230,255,.18)'; ctx.beginPath(); ctx.roundRect(-110, 0, 220, 860, 100); ctx.fill();
    ctx.fillStyle = '#e8f6ff'; ctx.shadowColor = '#9fe0ff'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(-34, 20, 68, 680, 30); ctx.fill(); ctx.beginPath(); ctx.roundRect(40, 60, 30, 620, 15); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 760, 110, 60, 0, 0, TAU); ctx.fill(); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.roundRect(60 + i * 14, 780, 120, 24, 12); ctx.fill(); } ctx.shadowBlur = 0;
    // kırık çatlak büyür
    ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.shadowColor = RED; ctx.shadowBlur = 25; ctx.beginPath(); ctx.moveTo(-34, 640); const R = RN(5); let x = -34, y = 640; for (let i = 0; i < 10 * cr; i++) { x += 9; y += (R() - .5) * 40; ctx.lineTo(x, y); } ctx.stroke(); if (cr > .7) { ctx.beginPath(); ctx.moveTo(-10, 620); ctx.lineTo(20, 700); ctx.lineTo(-5, 720); ctx.stroke(); } ctx.shadowBlur = 0; ctx.restore();
  });
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.roundRect(700, 420, 260, 140, 30); ctx.fill(); ctx.restore(); txt('DAY ' + day, 830, 490, 70, CY, { align: 'center', font: 'Anton', weight: 400 });
  kinetic(['BROKEN', 'ANKLE'], W / 2, 230, 170, t, 15.4, { hl: { ANKLE: RED } });
  if (t > 17.78) stampText('SHATTERED', W / 2, 1440, 130, RED, seg(t, 17.78, 18.05));
}

// ---------- S5 20.94–27.42: garip pozisyonda uyumak → doku hasarı ----------
function s5(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0e1438'); g.addColorStop(1, '#04061a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const cut = seg(t, 24.04, 25.0), dm = seg(t, 25.5, 26.6);
  cam({ zoom: 1.04, t, shake: 1 }, () => {
    // yatak
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(80, 1100, 920, 60); ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.roundRect(100, 980, 880, 130, 30); ctx.fill(); ctx.fillStyle = '#9ac8ff'; ctx.beginPath(); ctx.roundRect(120, 920, 200, 90, 30); ctx.fill();
    // uyuyan kişi, kol altında bükülü
    ctx.fillStyle = '#3a4a8a'; ctx.beginPath(); ctx.roundRect(320, 900, 560, 110, 50); ctx.fill(); ctx.fillStyle = '#e8b48a'; ctx.beginPath(); ctx.arc(240, 920, 70, 0, TAU); ctx.fill();
    const armC = lerpC('#e8b48a', '#6a4aa8', dm); ctx.strokeStyle = armC; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(360, 940); ctx.lineTo(300, 1060); ctx.lineTo(470, 1070); ctx.stroke();
    // kan akışı okları
    for (let i = 0; i < 6; i++) { const q = ((t * 1.2 + i / 6) % 1) * (1 - cut); const x = lerp(360, 470, q), y = q < .5 ? lerp(940, 1060, q * 2) : 1060 + (q - .5) * 20; ctx.fillStyle = `rgba(255,59,78,${1 - cut})`; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); }
    if (cut > 0) stampX(390, 1010, 120, cut);
    for (let i = 0; i < 3; i++) txt('Z', 210 + i * 50, 800 - i * 50 - ((t * 30) % 40), 50 + i * 10, 'rgba(255,255,255,.6)', { font: 'Anton', weight: 400, stroke: 0 });
    // ay
    ctx.fillStyle = '#f2f0e0'; ctx.beginPath(); ctx.arc(860, 340, 80, 0, TAU); ctx.fill(); ctx.fillStyle = '#0e1438'; ctx.beginPath(); ctx.arc(890, 320, 70, 0, TAU); ctx.fill();
  });
  kinetic(['AWKWARD', 'POSITION'], W / 2, 230, 150, t, 22.3, { hl: { POSITION: PUR } });
  if (t > 24.04) bigText('CIRCULATION CUT', W / 2, 400, 110, RED, seg(t, 24.04, 24.3), { glow: RED });
  if (t > 25.52) stampText('TISSUE DAMAGE', W / 2, 1440, 110, PUR, seg(t, 25.52, 25.8));
}

// ---------- S6 27.42–37.0: gerçek tıbbi durum; sessiz iç alarmlar ----------
function s6(t) {
  const inner = t > 31.6;
  darkGrad('#0c1218', '#020406');
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    if (!inner) { // tıbbi dosya
      ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.roundRect(170, 500, 740, 800, 30); ctx.fill(); ctx.fillStyle = '#c9b48a'; ctx.fillRect(170, 500, 740, 90); txt('MEDICAL FILE', W / 2, 545, 50, '#3a2a1a', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      txt('CONGENITAL', W / 2, 700, 64, '#2a1a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('INSENSITIVITY', W / 2, 790, 64, '#2a1a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('TO PAIN', W / 2, 880, 64, RED, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      ctx.fillStyle = '#8a7a6a'; for (let i = 0; i < 5; i++) ctx.fillRect(240, 980 + i * 50, 600 - i * 60, 12);
      body(830, 1260, 260, '#5a8ad8'); txt('REAL', 300, 1220, 60, RED, { align: 'center', font: 'Anton', weight: 400 });
    } else { // vücut içi: apandisit + iç kanama, alarmlar sessiz
      ctx.save(); ctx.globalAlpha = .4; body(W / 2, 1450, 1150, '#5a6a8a'); ctx.restore();
      const a1 = seg(t, 34.32, 34.7), a2 = seg(t, 35.34, 35.7);
      ctx.fillStyle = `rgba(255,59,78,${.5 + .5 * Math.sin(t * 8)})`; ctx.beginPath(); ctx.ellipse(W / 2 + 70, 1060, 40, 70, .4, 0, TAU); ctx.fill(); if (a1 > 0) pill('APPENDICITIS', 830, 1150, 50, RED, a1);
      if (a2 > 0) { const R = RN(4); for (let i = 0; i < 30; i++) { ctx.fillStyle = '#c0102a'; ctx.beginPath(); ctx.arc(W / 2 - 80 + (R() - .5) * 140 * a2, 920 + (R() - .5) * 140 * a2, 10 + R() * 10, 0, TAU); ctx.fill(); } pill('INTERNAL BLEEDING', 300, 820, 46, RED, a2); }
      siren(850, 430, 130, false, t); stampX(850, 430, 150, seg(t, 33.12, 33.5)); }
  });
  if (!inner) kinetic(['A', 'REAL', 'CONDITION'], W / 2, 230, 140, t, 27.5, { hl: { REAL: RED } });
  else kinetic(['SILENT', 'ALARMS'], W / 2, 230, 160, t, 32.4, { hl: { ALARMS: RED } });
}

// ---------- S7 37.0–40.59: acı = koruma görevlisi ----------
function s7(t) {
  darkGrad('#0a1a14', '#020604');
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    // kalkan
    const k = eback(seg(t, 37.2, 37.7)); ctx.save(); ctx.translate(W / 2, 880); ctx.scale(k, k); ctx.fillStyle = 'rgba(34,224,122,.15)'; ctx.strokeStyle = GRN; ctx.lineWidth = 18; ctx.shadowColor = GRN; ctx.shadowBlur = 50;
    ctx.beginPath(); ctx.moveTo(0, -420); ctx.quadraticCurveTo(380, -360, 360, -40); ctx.quadraticCurveTo(320, 300, 0, 460); ctx.quadraticCurveTo(-320, 300, -360, -40); ctx.quadraticCurveTo(-380, -360, 0, -420); ctx.fill(); ctx.stroke(); ctx.restore();
    // koruma görevlisi (güneş gözlüklü) önde
    body(W / 2, 1260, 640, '#111'); ctx.fillStyle = '#000'; ctx.fillRect(W / 2 - 55, 690, 110, 26); ctx.strokeStyle = '#6a7280'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W / 2 + 60, 700); ctx.quadraticCurveTo(W / 2 + 80, 760, W / 2 + 60, 790); ctx.stroke();
    // kalp atışı
    const b = 1 + .12 * Math.pow(Math.max(0, Math.sin(t * 7)), 6); ctx.save(); ctx.translate(W / 2 - 20, 880); ctx.scale(b, b); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-70, -15, -35, -70, 0, -32); ctx.bezierCurveTo(35, -70, 70, -15, 0, 30); ctx.fill(); ctx.restore();
  });
  kinetic(['PAIN', "ISN'T", 'YOUR', 'ENEMY'], W / 2, 230, 130, t, 37.1, { hl: { ENEMY: RED } });
  if (t > 39.02) bigText("IT'S YOUR BODYGUARD", W / 2, 1440, 100, GRN, seg(t, 39.02, 39.3), { glow: GRN });
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 2.8, 8.76, 14.66, 20.94, 27.42, 37.0, 99], S = [s1, s2, s3, s4, s5, s6, s7];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 6.9 && t < 7.1 ? .7 : 0) + (t > 17.78 && t < 18.0 ? .8 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
