// 8.video — "What If Humans Could Read Minds?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 34.35;
const SUBY = 1540;
const NEON = '#c86bff', CYAN = '#5ff0ff';

// profil kafa (sağa bakar), (x,y) = boyun tabanı, s = yükseklik
function head(x, y, s, dir = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  ctx.beginPath(); ctx.moveTo(-.18, 0); ctx.lineTo(-.2, -.25); ctx.bezierCurveTo(-.42, -.35, -.45, -.85, -.12, -1); ctx.bezierCurveTo(.2, -1.08, .38, -.85, .36, -.62);
  ctx.lineTo(.44, -.48); ctx.lineTo(.37, -.45); ctx.lineTo(.38, -.36); ctx.lineTo(.34, -.33); ctx.lineTo(.35, -.26); ctx.bezierCurveTo(.3, -.2, .18, -.2, .12, -.2); ctx.lineTo(.12, 0); ctx.closePath();
  ctx.fillStyle = o.fill || '#0d0a18'; ctx.fill(); if (o.line) { ctx.strokeStyle = o.line; ctx.lineWidth = .012; ctx.shadowColor = o.line; ctx.shadowBlur = 25; ctx.stroke(); ctx.shadowBlur = 0; }
  if (o.brain) { const g = ctx.createRadialGradient(-.02, -.68, .02, -.02, -.68, .3); g.addColorStop(0, o.brain); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(-.02, -.68, .28, .22, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = o.brain; ctx.lineWidth = .01; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(-.02, -.68, .2 - i * .03, .15 - i * .02, i * .5, 0, Math.PI * 1.3); ctx.stroke(); } }
  ctx.restore();
}
function bubble(s, x, y, size, p, col = '#fff', ink = '#111') { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.font = `800 ${size}px Montserrat`; const w = ctx.measureText(s).width + size * 1.2, h = size * 2;
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.beginPath(); ctx.arc(-w * .3, h * .7, size * .25, 0, TAU); ctx.arc(-w * .38, h * 1.05, size * .14, 0, TAU); ctx.fill();
  txt(s, 0, 2, size, ink, { align: 'center', weight: 800, stroke: 0 }); ctx.restore(); }
function waves(x0, y0, x1, y1, t, col, n = 5) { const d = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0); ctx.save(); ctx.translate(x0, y0); ctx.rotate(a);
  for (let i = 0; i < n; i++) { const q = ((t * .9 + i / n) % 1); ctx.strokeStyle = col; ctx.globalAlpha = Math.sin(q * Math.PI); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(q * d, 0, 60 + 40 * Math.sin(q * Math.PI), -.7, .7); ctx.stroke(); } ctx.restore(); }
function darkBg(t, c1 = '#0b0618', c2 = '#1a0b2e') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const R = RN(3); for (let i = 0; i < 50; i++) { ctx.fillStyle = `rgba(200,140,255,${.15 + R() * .25})`; ctx.beginPath(); ctx.arc(R() * W, (R() * H - t * 30 * (1 + R())) % H + (R() < 0 ? H : 0), 1 + R() * 3, 0, TAU); ctx.fill(); } }

// ---------- S1 0–3.8: iki kafa arasında zihin dalgaları ----------
function s1(t) {
  darkBg(t);
  cam({ zoom: 1.1 - .08 * seg(t, 0, 3.8), t, shake: 3 + 10 * seg(t, 1.5, 1.8) * (1 - seg(t, 1.8, 2.4)) }, () => {
    head(220, 1050, 760, 1, { line: NEON, brain: 'rgba(200,107,255,.8)' }); head(860, 1050, 760, -1, { line: CYAN, brain: 'rgba(95,240,255,.8)' });
    waves(260, 560, 820, 560, t, NEON); waves(820, 600, 260, 600, t + .5, CYAN);
    bubble('?', 230, 230, 90, seg(t, .5, .8), NEON, '#fff'); bubble('!', 850, 230, 90, seg(t, 1.56, 1.8), CYAN, '#111');
  });
  kinetic(['WHAT', 'IF', 'HUMANS', 'COULD'], W / 2, 1210, 130, t, 0, { gap: .06 });
  kinetic(['READ', 'MINDS?'], W / 2, 1370, 160, t, 1.4, { hl: { 'MINDS?': NEON } });
  flash(t, 1.56, .2, '200,107,255');
}

// ---------- S2 3.8–6.22: mahremiyet kilidi parçalanır ----------
function s2(t) {
  darkBg(t, '#120614', '#2a0a1e');
  const br = seg(t, 4.88, 5.1);
  cam({ zoom: 1.04 + .08 * Math.sin(br * Math.PI), t, shake: br > 0 && br < 1 ? 26 : 3 }, () => {
    if (br < 1) { ctx.save(); ctx.translate(W / 2, 820 + Math.sin(t * 3) * 10); ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 56; ctx.beginPath(); ctx.arc(0, -150, 170, Math.PI, 0); ctx.lineTo(170, -60); ctx.moveTo(-170, -150); ctx.lineTo(-170, -60); ctx.stroke();
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.roundRect(-260, -80, 520, 420, 50); ctx.fill(); txt('PRIVACY', 0, 130, 100, '#5a3d00', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
    shards(W / 2, 900, seg(t, 4.88, 6.0), 80, 5, R => R > .5 ? C.gold : '#d8dee8', 30, 1100);
    for (let i = 0; i < 3; i++) ring2(W / 2, 900, seg(t, 4.88 + i * .15, 5.8 + i * .15), 1000, NEON, 20);
  });
  if (t > 4.08) stampText('VANISHED', W / 2, 1380, 140, C.red, seg(t, 4.9, 5.2));
  kinetic(['SINGLE', 'HEARTBEAT'], W / 2, 220, 120, t, 4.7, { hl: { HEARTBEAT: C.red } });
}

// ---------- S3 6.22–10.24: sırlar, yalanlar, kibar maskeler yok olur ----------
function folder(x, y, s, open) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#c9934a'; ctx.beginPath(); ctx.roundRect(-s / 2, -s * .35, s, s * .7, 14); ctx.fill(); ctx.fillRect(-s / 2, -s * .45, s * .35, s * .14);
  ctx.save(); ctx.translate(-s / 2, -s * .35); ctx.rotate(-open * 1.2); ctx.fillStyle = '#e0aa5a'; ctx.beginPath(); ctx.roundRect(0, 0, s, s * .7, 14); ctx.fill(); ctx.restore();
  txt('TOP SECRET', 0, 0, s * .12, C.red, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function mask(x, y, s, crack, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f2ebe0'; ctx.beginPath(); ctx.ellipse(0, 0, s * .4, s * .5, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#111'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * s * .15, -s * .1, s * .07, s * .05, 0, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = crack > .5 ? C.red : '#111'; ctx.lineWidth = s * .03; ctx.lineCap = 'round'; ctx.beginPath(); const smile = 1 - 2 * clamp(crack * 1.5); ctx.moveTo(-s * .18, s * .18); ctx.quadraticCurveTo(0, s * .18 + s * .16 * smile, s * .18, s * .18); ctx.stroke();
  if (crack > 0) { ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = s * .015; ctx.beginPath(); ctx.moveTo(0, -s * .5); const R = RN(2); let yy = -s * .5, xx = 0; while (yy < -s * .5 + s * crack) { xx += (R() - .5) * s * .12; yy += s * .08; ctx.lineTo(xx, yy); } ctx.stroke(); }
  ctx.restore(); }
function s3(t) {
  darkBg(t, '#0e0a14', '#241226');
  cam({ zoom: 1.03, t, shake: 3 }, () => {
    const op = seg(t, 7.34, 7.8), fo = 1 - seg(t, 8.5, 8.8); if (fo > 0) { ctx.save(); ctx.globalAlpha = fo; folder(W / 2, 820, 640 * eback(seg(t, 6.3, 6.7)), op); ctx.restore(); }
    if (op > .4) { for (let i = 0; i < 5; i++) { const q = seg(t, 7.5 + i * .1, 8.6 + i * .1); if (q <= 0) continue; ctx.save(); ctx.translate(W / 2 + (i - 2) * q * 260, 700 - q * 500 + q * q * 600); ctx.rotate(q * 4); ctx.globalAlpha = 1 - q; ctx.fillStyle = '#fff'; ctx.fillRect(-60, -80, 120, 160); ctx.fillStyle = '#111'; ctx.fillRect(-40, -50, 80, 10); ctx.fillRect(-40, -20, 60, 10); ctx.restore(); } }
    bubble('LIES', W / 2, 420, 110, seg(t, 8.26, 8.5), '#fff'); stampX(W / 2, 420, 240, seg(t, 8.45, 8.7));
    const mk = seg(t, 8.78, 9.6); if (t > 8.7) mask(W / 2, 1050, 520 * eback(seg(t, 8.7, 9.0)), mk, t);
  });
  kinetic(['DESTROYING'], W / 2, 220, 150, t, 6.4, { hl: { DESTROYING: C.red } });
  if (t > 8.78) bigText('POLITE DECEPTIONS', W / 2, 1420, 100, '#fff', seg(t, 8.9, 9.2));
}

// ---------- S4 10.24–13.08: her gizli düşünce yüksek sesle ----------
const THOUGHTS = ['I am so bored', 'Nice shirt... NOT', 'Is he lying?', 'I forgot her name', 'I want pizza', 'Who farted?'];
function s4(t) {
  darkBg(t, '#08101c', '#14243a');
  cam({ zoom: 1.04 + .04 * Math.sin(t * 4), t, shake: t > 11.6 ? 8 : 2 }, () => {
    for (let i = 0; i < 6; i++) { const x = 180 + (i % 3) * 360, y = 820 + Math.floor(i / 3) * 520; head(x - 40, y + 260, 420, i % 2 ? -1 : 1, { line: i % 2 ? CYAN : NEON, brain: i % 2 ? 'rgba(95,240,255,.7)' : 'rgba(200,107,255,.7)' });
      bubble(THOUGHTS[i], x, y - 210 + Math.sin(t * 3 + i) * 8, 34, seg(t, 10.3 + i * .2, 10.6 + i * .2), i % 2 ? CYAN : '#fff'); }
    if (t > 11.6) for (let i = 0; i < 3; i++) ring2(W / 2, 1000, ((t - 11.6) * 1.4 + i / 3) % 1, 1100, 'rgba(255,255,255,.6)', 12);
  });
  kinetic(['EVERY', 'HIDDEN', 'THOUGHT'], W / 2, 210, 120, t, 10.24, { hl: { HIDDEN: NEON } });
  if (t > 11.6) stampText('LOUD & CLEAR', W / 2, 380, 110, CYAN, seg(t, 11.6, 11.9));
}

// ---------- S5 13.08–17.3: mutlak şeffaflık → suç biter ----------
function cuffs(x, y, s, open) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = s * .08; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * s * .35, 0, s * .25, sx > 0 ? open : 0, TAU - (sx < 0 ? open : 0)); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-s * .1, 0); ctx.lineTo(s * .1, 0); ctx.stroke(); ctx.restore(); }
function s5(t) {
  darkBg(t, '#06141a', '#0d2a2e');
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    // cam kafa (tamamen saydam)
    ctx.save(); ctx.globalAlpha = .9; head(W / 2 - 40, 1050, 820, 1, { fill: 'rgba(160,240,255,.1)', line: CYAN, brain: 'rgba(95,240,255,.9)' }); ctx.restore();
    ring(W / 2 + 230, 380, 140, 100 * (1 - eo(seg(t, 14.74, 15.6))), 1, { col: C.red, sub: 'CRIME' });
  });
  kinetic(['ABSOLUTE'], W / 2, 1270, 120, t, 13.26); kinetic(['TRANSPARENCY'], W / 2, 1410, 120, t, 13.78, { hl: { TRANSPARENCY: CYAN } });
  if (t > 15.78) { ctx.save(); ctx.globalAlpha = seg(t, 15.78, 16.0); txt('MISUNDERSTANDINGS', W / 2, 160, fit('MISUNDERSTANDINGS', 90, 900, 'Anton', 400), '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(80, 165); ctx.lineTo(80 + 920 * seg(t, 16.0, 16.4), 155); ctx.stroke(); ctx.restore(); }
}

// ---------- S6 17.3–21.52: yargıların ağırlığı, karanlık dürtüler ----------
function s6(t) {
  darkBg(t, '#14040a', '#2a0612');
  const dn = eo(seg(t, 17.9, 18.5)), dark = seg(t, 19.9, 20.8);
  cam({ zoom: 1.04, t, shake: 3 + (t > 18.4 && t < 18.9 ? 22 : 0) }, () => {
    const sq = 1 - .12 * seg(t, 18.4, 18.6); ctx.save(); ctx.translate(W / 2, 1400); ctx.scale(1 + (1 - sq) * .4, sq); ctx.translate(-W / 2, -1400);
    head(W / 2 - 30, 1400, 760, 1, { line: '#ff5a6a', brain: `rgba(255,${Math.round(90 - 60 * dark)},${Math.round(110 - 80 * dark)},.9)` }); ctx.restore();
    // ağırlık: JUDGMENTS
    const wy = lerp(-300, 530, dn); ctx.fillStyle = '#2a2e36'; ctx.beginPath(); ctx.moveTo(W / 2 - 300, wy + 220); ctx.lineTo(W / 2 - 220, wy); ctx.lineTo(W / 2 + 220, wy); ctx.lineTo(W / 2 + 300, wy + 220); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a606c'; ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(W / 2, wy, 70, Math.PI, 0); ctx.stroke(); txt('JUDGMENTS', W / 2, wy + 125, 70, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
    // karanlık dürtüler: kırmızı dumanlı dokunaçlar
    if (dark > 0) for (let k = 0; k < 7; k++) { ctx.strokeStyle = `rgba(255,30,60,${.6 * dark})`; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); let x = W / 2 - 40, y = 920; ctx.moveTo(x, y);
      for (let i = 0; i < 14 * dark; i++) { const a = -Math.PI / 2 + (k - 3) * .35 + Math.sin(t * 3 + i * .6 + k) * .5; x += Math.cos(a) * 40; y += Math.sin(a) * 40; ctx.lineTo(x, y); } ctx.stroke(); }
  });
  kinetic(['UNFILTERED'], W / 2, 210, 150, t, 17.3, { hl: { UNFILTERED: '#ff5a6a' } });
  if (t > 19.98) bigText('DARKEST IMPULSES', W / 2, 360, 110, C.red, seg(t, 19.98, 20.25), { glow: C.red });
}

// ---------- S7 21.52–25.14: ilişkiler yırtılır, toplum parçalanır ----------
function heartPath(s) { ctx.beginPath(); ctx.moveTo(0, s * .35); ctx.bezierCurveTo(-s * .9, -s * .2, -s * .45, -s * .85, 0, -s * .4); ctx.bezierCurveTo(s * .45, -s * .85, s * .9, -s * .2, 0, s * .35); ctx.closePath(); }
function s7(t) {
  darkBg(t, '#100612', '#22081a');
  const tear = eo(seg(t, 21.52, 22.5)), frac = seg(t, 23.26, 24.4);
  cam({ zoom: 1.03, t, shake: 3 + 14 * Math.sin(seg(t, 21.5, 22.0) * Math.PI) + 10 * Math.sin(frac * Math.PI) }, () => {
    if (t < 23.2) for (const sx of [-1, 1]) { ctx.save(); ctx.translate(W / 2 + sx * 160 * tear, 820 + tear * 60); ctx.rotate(sx * .3 * tear); ctx.beginPath(); ctx.rect(sx < 0 ? -500 : 0, -500, 500, 1000); ctx.clip();
      heartPath(560); ctx.fillStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 50; ctx.fill(); ctx.restore(); }
    else { // toplum ağı parçalanır
      const R = RN(9), nodes = Array.from({ length: 22 }, (_, i) => { const a = R() * TAU, r = 120 + R() * 360; return [W / 2 + Math.cos(a) * r, 860 + Math.sin(a) * r, a]; });
      const off = (n) => [n[0] + Math.cos(n[2]) * 260 * frac, n[1] + Math.sin(n[2]) * 260 * frac];
      ctx.strokeStyle = `rgba(95,240,255,${.6 * (1 - frac)})`; ctx.lineWidth = 4; nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => { if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 260) { const p = off(a), q = off(b); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); } }));
      nodes.forEach((n, i) => { const p = off(n); ctx.save(); ctx.translate(p[0], p[1]); ctx.fillStyle = i % 3 ? CYAN : NEON; ctx.beginPath(); ctx.arc(0, -26, 16, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 6, 20, 24, 0, Math.PI, 0); ctx.fill(); ctx.restore(); });
      if (frac > 0) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.shadowColor = '#fff'; ctx.shadowBlur = 20; const R2 = RN(5); for (let k = 0; k < 4; k++) { let x = W / 2, y = 860, a = k * 1.6 + .3; ctx.beginPath(); ctx.moveTo(x, y); for (let i = 0; i < 9 * frac; i++) { a += (R2() - .5) * .7; x += Math.cos(a) * 55; y += Math.sin(a) * 55; ctx.lineTo(x, y); } ctx.stroke(); } ctx.shadowBlur = 0; } }
  });
  if (t < 23.2) kinetic(['RELATIONSHIPS'], W / 2, 220, 130, t, 21.86, { hl: { RELATIONSHIPS: C.red } });
  else { kinetic(['FRACTURE'], W / 2, 220, 170, t, 23.26, { hl: { FRACTURE: '#fff' } }); bigText('GLOBAL SOCIETY', W / 2, 1420, 120, CYAN, seg(t, 23.64, 23.9)); }
}

// ---------- S8 25.14–29.02: hiçbir düşüncenin gizli kalmadığı dünya ----------
function s8(t) {
  darkBg(t);
  const z = seg(t, 25.14, 29.0);
  cam({ zoom: 1.6 - .7 * eo(z), t, shake: 2 }, () => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 6; c++) { const x = 90 + c * 180 + (r % 2) * 90 - 60, y = 420 + r * 230, k = (r * 6 + c) % 3;
      head(x, y + 110, 200, (r + c) % 2 ? 1 : -1, { line: k ? NEON : CYAN, brain: k ? 'rgba(200,107,255,.8)' : 'rgba(95,240,255,.8)' }); }
    // ortadaki her şeyi gören göz
    const ey = 860, op = eback(seg(t, 26.7, 27.2)); if (op > 0) { ctx.save(); ctx.translate(W / 2, ey); ctx.scale(op, op); ctx.fillStyle = 'rgba(0,0,0,.75)'; ctx.beginPath(); ctx.arc(0, 0, 260, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-200, 0); ctx.quadraticCurveTo(0, -150, 200, 0); ctx.quadraticCurveTo(0, 150, -200, 0); ctx.fill(); const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 80); g.addColorStop(0, '#000'); g.addColorStop(.4, NEON); g.addColorStop(1, '#3a0a5a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(Math.sin(t * 2) * 30, 0, 80, 0, TAU); ctx.fill(); ctx.restore(); }
  });
  kinetic(['COULD', 'HUMANITY'], W / 2, 180, 120, t, 25.14); kinetic(['HANDLE', 'IT?'], W / 2, 320, 150, t, 25.64, { hl: { 'IT?': NEON } });
  if (t > 27.14) bigText('NO THOUGHT HIDDEN', W / 2, 1420, 110, '#fff', seg(t, 27.14, 27.4), { glow: NEON });
}

const THEO = ['Total chaos in a week', 'No more politicians', 'Marriages would end', 'World peace at last', 'I would hide in a cave', 'Poker would be over'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 3.8, 6.22, 10.24, 13.08, 17.3, 21.52, 25.14, 29.02, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8, null];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i] ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 29.02), 29.02, 30.54, 31.1, THEO, { tint: 'rgba(200,107,255,.2)' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 4.88 && t < 5.05 ? 1 : 0) + (t > 21.52 && t < 21.7 ? .7 : 0) + (t > 23.26 && t < 23.45 ? .7 : 0), Math.floor(t * 30));
  flash(t, 4.88, .18, '255,80,120');
  subs(t, SUBY);
};
