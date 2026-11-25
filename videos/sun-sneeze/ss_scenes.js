// ===== 10.video — PHOTIC SNEEZE REFLEX (portrait world 1080×1920) =====
function sunGlow(x, y, r, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,252,230,${a})`); g.addColorStop(.25, `rgba(255,236,160,${a * .8})`); g.addColorStop(1, 'rgba(255,200,80,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function sunRays(x, y, r0, r1, n, s, a, w = 16) { ctx.save(); ctx.strokeStyle = `rgba(255,236,150,${a})`; ctx.lineWidth = w; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const an = i / n * TAU + s * .3, l = r1 + Math.sin(s * 4 + i) * 30; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0); ctx.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l); ctx.stroke(); } ctx.restore(); }
function person(x, y, sc, col, squint) {                                        // simple side-facing figure, head tilts back on squint
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = col;
  ctx.beginPath(); ctx.roundRect(-60, -260, 120, 300, 50); ctx.fill(); tube([[-30, 30], [-40, 260]], 46, col); tube([[30, 30], [50, 260]], 46, col);
  tube([[-50, -230], [-120, -90], [-110, 20]], 36, col); tube([[50, -230], [100, -300], [60, -380]], 34, col);
  ctx.save(); ctx.translate(0, -330); ctx.rotate(-squint * .35); ctx.beginPath(); ctx.arc(0, 0, 80, 0, TAU); ctx.fill(); ctx.restore(); ctx.restore();
}
function doorway(u, s, o) {                                                      // dark building → bright sunlight
  const k = eio(clamp(u * 1.6)), g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#8fd0ff'); g.addColorStop(1, '#f6e2a8'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  sunGlow(820, 520, 900 + k * 500, 1); sunRays(820, 520, 160, 520 + k * 200, 14, s, .55);
  ctx.fillStyle = '#7aa84a'; ctx.fillRect(-2200, 1500, 5600, 2000);
  const dx = lerp(0, -140, k); ctx.fillStyle = '#16121c'; ctx.fillRect(-2200 + dx, -2200, 2440, 6600); ctx.fillStyle = '#05040a'; ctx.fillRect(160 + dx, 700, 80, 820);
  const px = lerp(180, 620, k), sq = clamp((u - .45) * 3); person(px, 1240, 1.25, '#1a1420', sq);
  ctx.fillStyle = `rgba(255,252,235,${.1 + .3 * k * (.85 + .15 * Math.sin(s * 9))})`; ctx.fillRect(-2200, -2200, 5600, 6600);
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 1000, 110, '#fff', '#a0500a', 18, '400', 'Anton'); }
}
function faceSide(x, y, sc, s, o) {                                              // side-profile face; eyes squint, nose tickles, ACHOO
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const ach = o.achoo || 0, tilt = -.18 * (o.pre || 0) + .22 * ach; ctx.rotate(tilt);
  ctx.fillStyle = '#e0a882'; ctx.beginPath(); ctx.moveTo(-220, -360); ctx.bezierCurveTo(60, -440, 220, -260, 210, -120); ctx.lineTo(300, -30); ctx.quadraticCurveTo(310, 10, 230, 20); ctx.lineTo(240, 90); ctx.quadraticCurveTo(250, 130, 210, 150); ctx.quadraticCurveTo(230, 230, 150, 280); ctx.quadraticCurveTo(0, 340, -120, 300); ctx.lineTo(-160, 520); ctx.lineTo(-420, 520); ctx.lineTo(-380, 0); ctx.quadraticCurveTo(-400, -300, -220, -360); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.moveTo(-260, -340); ctx.bezierCurveTo(40, -460, 200, -330, 200, -230); ctx.quadraticCurveTo(40, -300, -120, -240); ctx.quadraticCurveTo(-260, -160, -380, 20); ctx.quadraticCurveTo(-420, -260, -260, -340); ctx.fill();
  ctx.fillStyle = '#c98a68'; ctx.beginPath(); ctx.ellipse(-210, -40, 50, 80, 0, 0, TAU); ctx.fill();
  const sq = Math.max(o.squint || 0, ach); ctx.strokeStyle = '#3a2216'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  if (sq > .5) { ctx.beginPath(); ctx.moveTo(80, -110); ctx.lineTo(150, -90); ctx.lineTo(90, -70); ctx.stroke(); }
  else { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(120, -95, 34, 22 * (1 - sq), 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#4a3020'; ctx.beginPath(); ctx.arc(132, -95, 14 * (1 - sq * .5), 0, TAU); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(60, -150); ctx.quadraticCurveTo(120, -170 + sq * 20, 170, -145); ctx.stroke();
  if (ach > .3) { ctx.fillStyle = '#5a1a1a'; ctx.beginPath(); ctx.ellipse(215, 175, 30, 38 * ach, 0, 0, TAU); ctx.fill(); } else { ctx.beginPath(); ctx.moveTo(180, 175); ctx.quadraticCurveTo(205, 185, 225, 170); ctx.stroke(); }
  ctx.restore();
}
function sneezeFace(u, s, o) {
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#ffd77a'); g.addColorStop(1, '#ff9a4a'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  sunGlow(980, 300, 900, .9); sunRays(980, 300, 150, 560, 12, s, .5);
  const at = o.at !== undefined ? o.at : 9, d = s - at, ach = d >= 0 ? Math.exp(-Math.pow((d - .25) * 3, 2)) : 0, pre = d < 0 ? clamp(1 + d / 1.8) : clamp(1 - d * 2);
  const sh = ach * 18; faceSide(420 + Math.sin(s * 60) * sh, 1060 + Math.cos(s * 50) * sh + ach * 40, 1.25, s, { squint: o.squint ? 1 : pre, pre, achoo: ach });
  if (pre > .2 && d < 0) { for (let i = 0; i < 3; i++) { ctx.save(); ctx.globalAlpha = pre * (.5 + .5 * Math.sin(s * 8 + i)); ctx.textAlign = 'center'; txt('!', 830 + i * 40, 700 - i * 30, 70 + i * 16, '#fff', '#a0300a', 10, '400', 'Anton'); ctx.restore(); } }
  if (d > 0) { const R = RN(4), k = clamp(d * 1.5); for (let i = 0; i < 70; i++) { const a = -.5 + (R() - .5) * 1.1, r = k * (120 + R() * 900); ctx.fillStyle = `rgba(200,235,255,${(1 - k) * .9})`; ctx.beginPath(); ctx.arc(720 + Math.cos(a) * r, 1240 + Math.sin(a) * r, 6 + R() * 12, 0, TAU); ctx.fill(); }
    ctx.save(); ctx.translate(700, 760); const kk = eo(clamp(d * 4)); ctx.scale(.4 + .6 * kk, .4 + .6 * kk); ctx.rotate(-.08 + Math.sin(s * 20) * .02 * ach); ctx.textAlign = 'center'; txt('ACHOO!', 0, 0, 190, '#fff', '#c0300a', 26, '400', 'Anton'); ctx.restore(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 560, 100, '#fff', '#a0300a', 16, '400', 'Anton'); }
}
function oneInFour(u, s) {
  bgDeep(s, ['#3a2a10', '#140c04']); const k = eo(clamp(u * 2));
  for (let i = 0; i < 4; i++) { const x = 180 + i * 240, y = 980, on = i === 2, a = eo(clamp(u * 4 - i * .4)); ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - a) * 120);
    if (on) { sunGlow(x, y - 140, 300, .7 * k); sunRays(x, y - 140, 120, 240, 10, s, .6 * k, 10); }
    const col = on ? '#ffd23f' : 'rgba(255,255,255,.25)'; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - 140, 70, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 90, y - 50, 180, 280, 70); ctx.fill(); ctx.restore(); }
  ctx.textAlign = 'center'; txt('1 IN 4', 540, 640, 230, '#fff', '#8c4a0e', 26, '400', 'Anton'); txt('PEOPLE', 540, 1310, 100, '#ffd23f', '#000', 14, '400', 'Anton');
}
function dnaTrait(u, s, o) {                                                     // spinning DNA helix + reflex name
  bgDeep(s, ['#1a2a4a', '#08101c']); const cx = 540;
  for (let i = 0; i < 26; i++) { const y = 620 + i * 34, a = i * .45 + s * 2, x1 = cx + Math.cos(a) * 230, x2 = cx - Math.cos(a) * 230, z = Math.sin(a), hot = i >= 11 && i <= 14;
    ctx.strokeStyle = hot ? 'rgba(255,210,63,.9)' : 'rgba(255,255,255,.35)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
    ctx.fillStyle = z > 0 ? '#5ab0ff' : '#2a5a9a'; ctx.beginPath(); ctx.arc(x1, y, 16 + z * 5, 0, TAU); ctx.fill(); ctx.fillStyle = z > 0 ? '#2a5a9a' : '#5ab0ff'; ctx.beginPath(); ctx.arc(x2, y, 16 - z * 5, 0, TAU); ctx.fill(); if (hot) spark(cx, y, 120, .3, '255,210,63'); }
  ctx.textAlign = 'center'; const k = eo(clamp(u * 2.5 - .3)); ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 40); txt(o.text || 'GENETIC', 540, 520, 110, '#ffd23f', '#000', 16, '400', 'Anton'); ctx.restore();
}
// head cross-section: eye, optic nerve to brain, trigeminal branch in the nose
const OPT = [[640, 760], [520, 770], [400, 740], [300, 700]], TRI = [[330, 820], [440, 850], [560, 900], [690, 960], [760, 1010]];
function headSection(u, s, o) {
  bgDeep(s, ['#2a1424', '#0e060c']);
  ctx.fillStyle = '#e8b896'; ctx.beginPath(); ctx.moveTo(140, 400); ctx.bezierCurveTo(500, 220, 800, 360, 820, 640); ctx.lineTo(950, 980); ctx.quadraticCurveTo(960, 1030, 860, 1050); ctx.lineTo(860, 1120); ctx.quadraticCurveTo(900, 1200, 800, 1260); ctx.quadraticCurveTo(600, 1420, 360, 1380); ctx.lineTo(260, 1700); ctx.lineTo(-100, 1700); ctx.lineTo(-100, 500); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d99a9a'; ctx.beginPath(); ctx.moveTo(160, 440); ctx.bezierCurveTo(400, 300, 600, 360, 620, 560); ctx.bezierCurveTo(560, 700, 300, 720, 160, 680); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(140,60,70,.5)'; ctx.lineWidth = 6; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(200 + i * 80, 470 + Math.sin(i) * 20); ctx.quadraticCurveTo(240 + i * 80, 560, 210 + i * 80, 650); ctx.stroke(); }
  ctx.fillStyle = '#b8605a'; ctx.beginPath(); ctx.moveTo(620, 880); ctx.quadraticCurveTo(860, 900, 900, 1020); ctx.quadraticCurveTo(760, 1080, 620, 1040); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(700, 760, 70, 0, TAU); ctx.fill(); ctx.fillStyle = '#3a6ac8'; ctx.beginPath(); ctx.arc(740, 760, 34, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(752, 760, o.light ? 10 : 18, 0, TAU); ctx.fill();
  const showO = o.optic, glowO = o.light ? .5 + .5 * Math.sin(s * 14) : 0;
  if (showO) { tube(OPT, 30, '#f2d27a'); if (glowO) { tube(OPT, 30, `rgba(255,250,200,${glowO})`); spark(OPT[3][0], OPT[3][1], 160, .5 * glowO); } }
  const glowT = o.dust ? .5 + .5 * Math.sin(s * 10) : o.leak ? clamp((s - 1.2) * 2) * (.5 + .5 * Math.sin(s * 16)) : 0;
  tube(TRI, 24, '#ffe9a8'); if (glowT) { tube(TRI, 24, `rgba(255,120,80,${glowT})`); spark(TRI[4][0], TRI[4][1], 160, .6 * glowT, '255,140,90'); }
  const pulse = (pts, ph, col) => { const n = pts.length - 1, f = ph * n, i = Math.min(n - 1, Math.floor(f)), t = f - i, x = lerp(pts[i][0], pts[i + 1][0], t), y = lerp(pts[i][1], pts[i + 1][1], t); spark(x, y, 90, .95, col); };
  if (o.light) { for (let k = 0; k < 2; k++) pulse(OPT, (s * 1.2 + k / 2) % 1, '255,250,200'); sunGlow(1100, 600, 500, .8); sunRays(1100, 600, 0, 900, 6, s * .2, .3, 30); }
  if (o.leak && s > 1.2) { for (let k = 0; k < 2; k++) pulse([...TRI].reverse(), 1 - (s * 1.1 + k / 2) % 1, '255,140,90'); }
  if (o.dust) { const R = RN(3); for (let i = 0; i < 30; i++) { const ph = (s * .4 + R()) % 1, x = lerp(1000, 760, ph) + Math.sin(s * 3 + i) * 20, y = 1000 + (R() - .5) * 120; ctx.fillStyle = i % 3 ? '#8a7a5a' : '#6ac85a'; ctx.beginPath(); ctx.arc(x, y, 6 + R() * 10, 0, TAU); ctx.fill(); } }
  ctx.textAlign = 'left'; if (showO) label('OPTIC NERVE', 340, 650, 48, '#f2d27a', 'left'); label('TRIGEMINAL NERVE', 250, 1000, 48, '#ffe9a8', 'left');
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 1250, 96, '#ffd23f', '#000', 14, '400', 'Anton'); }
}
function cables(u, s, o) {                                                       // two nerves side by side as cables; signal jumps across
  bgDeep(s, ['#1a1428', '#08060c']); const yA = 820, yB = 1100;
  const cab = (y, col, lab) => { const p = wavy(-200, y, 0, 1500, 14, 3); tube(p, 120, 'rgba(0,0,0,.4)'); tube(p, 100, col); tube(p.map(q => [q[0], q[1] - 24]), 18, 'rgba(255,255,255,.35)'); ctx.textAlign = 'left'; label(lab, 160, y - 90, 50, col, 'left'); };
  cab(yA, '#f2d27a', 'OPTIC'); cab(yB, '#ffb48a', 'TRIGEMINAL');
  if (o.leak) { const ph = (s * .9) % 1, x = lerp(-100, 1200, ph); spark(x, yA, 200, .95); const jump = clamp((ph - .4) * 4) * clamp((.85 - ph) * 6);
    if (jump > 0) { ctx.strokeStyle = `rgba(255,250,200,${jump})`; ctx.lineWidth = 10; ctx.beginPath(); let yy = yA + 50; ctx.moveTo(560, yy); for (let i = 1; i <= 6; i++) { yy = lerp(yA + 50, yB - 50, i / 6); ctx.lineTo(560 + (i % 2 ? 40 : -40) * Math.sin(s * 40), yy); } ctx.stroke(); spark(560, (yA + yB) / 2, 260, jump * .8); }
    if (ph > .55) { const x2 = lerp(560, 1250, (ph - .55) / .45); spark(x2, yB, 200, .95, '255,140,90'); } ctx.textAlign = 'center'; txt('SIGNAL LEAKS!', 540, 580, 110, '#fff', '#8c0e18', 18, '400', 'Anton'); }
  else { const gap = .5 + .5 * Math.sin(s * 2); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 8; tube([[540, yA + 60], [540, yB - 60]], 8, '#ffd23f'); for (const y of [yA + 60, yB - 60]) { ctx.beginPath(); ctx.moveTo(510, y + (y < 960 ? 30 : -30)); ctx.lineTo(540, y); ctx.lineTo(570, y + (y < 960 ? 30 : -30)); ctx.stroke(); }
    ctx.textAlign = 'center'; txt('RIGHT NEXT TO EACH OTHER', 540, 580, 80, '#ffd23f', '#000', 12, '400', 'Anton'); }
}
function sunEye(u, s) {                                                          // eye floods with light, pupil snaps small
  const k = eo(clamp(u * 2.2)); eye(u, s, { noblink: 1 }); ctx.fillStyle = `rgba(255,248,215,${.55 * k})`; ctx.fillRect(-2200, -2200, 5600, 6600);
  sunGlow(540, 400, 600 + k * 900, .9 * k); sunRays(540, 400, 140, 700 + k * 300, 16, s, .5 * k, 20);
  ctx.textAlign = 'center'; txt('BRIGHT LIGHT!', 540, 1220, 120, '#fff', '#a0500a', 18, '400', 'Anton');
}
function tickled(u, s) {                                                        // brain thinks: something tickles the nose
  brain3d(u, s, { glows: [[-120, 40, 300, 0]] }); ctx.textAlign = 'center';
  const k = eo(clamp(u * 3)); ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.beginPath(); ctx.roundRect(560, 120, 800, 220, 60); ctx.fill(); ctx.beginPath(); ctx.moveTo(800, 330); ctx.lineTo(760, 420); ctx.lineTo(880, 330); ctx.fill();
  txt('NOSE TICKLE?!', 960, 260, 100, '#c0300a', 'rgba(255,255,255,0)', 0, '400', 'Anton'); ctx.restore();
  const R = RN(8); for (let i = 0; i < 10; i++) { const a = R() * TAU, r = 520 + Math.sin(s * 2 + i) * 30; ctx.save(); ctx.translate(960 + Math.cos(a) * r, 560 + Math.sin(a) * r * .7); ctx.rotate(s * 2 + i); ctx.strokeStyle = 'rgba(255,240,200,.75)'; ctx.lineWidth = 6; tube(wavy(-60, 0, 0, 120, 14, 6), 6, 'rgba(255,240,200,.8)'); ctx.restore(); }
  txt('TRICKED!', 960, 900, 130, '#ffd23f', '#000', 18, '400', 'Anton');
}
