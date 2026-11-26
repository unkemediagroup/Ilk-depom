// ===== 16.video — TEETH CHATTER (portrait world 1080×1920) =====
function snowBG(s, a = 1) { const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#1a3a5a'); g.addColorStop(1, '#0a1828'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const R = RN(5); for (let i = 0; i < 90; i++) { const x = (R() * 1500 + Math.sin(s + i) * 40) - 200, y = ((R() * 2200 + s * (80 + R() * 120)) % 2300) - 200, r = 3 + R() * 9; ctx.fillStyle = `rgba(255,255,255,${(.4 + R() * .5) * a})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } }
function chatter(s, f) { return Math.abs(Math.sin(s * f)); }                    // 0..1 jaw opening
function coldFace(u, s, o) {                                                     // front face in the cold, teeth chattering, breath fog
  snowBG(s); const sh = o.calm ? 0 : 6, jx = Math.sin(s * 47) * sh, j = o.calm ? .1 : chatter(s, o.fast ? 22 : 16);
  ctx.save(); ctx.translate(jx, 0);
  ctx.fillStyle = '#c84a4a'; ctx.beginPath(); ctx.ellipse(540, 600, 400, 260, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(140, 590, 800, 60); ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.arc(540, 330, 60, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e8b8a0'; ctx.beginPath(); ctx.ellipse(540, 980, 380, 460, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,90,110,.35)'; for (const x of [330, 750]) { ctx.beginPath(); ctx.ellipse(x, 1030, 90, 55, 0, 0, TAU); ctx.fill(); } ctx.beginPath(); ctx.arc(540, 1020, 40, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#3a2216'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (const x of [400, 680]) { ctx.beginPath(); ctx.moveTo(x - 45, 880); ctx.lineTo(x + 45, 880); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 50, 820 - (x < 540 ? -10 : 10)); ctx.lineTo(x + 50, 820 + (x < 540 ? -10 : 10)); ctx.stroke(); }
  const my = 1180, op = 20 + j * 46; ctx.fillStyle = '#5a1a22'; ctx.beginPath(); ctx.roundRect(400, my - 40, 280, 80 + op, 30); ctx.fill();
  ctx.fillStyle = '#fff'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.roundRect(410 + i * 44, my - 36, 40, 44, 8); ctx.fill(); ctx.beginPath(); ctx.roundRect(410 + i * 44, my + 4 + op, 40, 40, 8); ctx.fill(); }
  ctx.restore();
  if (j > .85 && !o.calm) { ctx.save(); ctx.globalAlpha = (j - .85) / .15; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { const a = (i - 1) * .4; ctx.beginPath(); ctx.moveTo(540 + d * (190 + Math.cos(a) * 20), my + 20 + Math.sin(a) * 60); ctx.lineTo(540 + d * (250 + Math.cos(a) * 40), my + 20 + Math.sin(a) * 100); ctx.stroke(); } ctx.restore(); }
  for (let i = 0; i < 4; i++) { const ph = (s * .5 + i / 4) % 1; ctx.fillStyle = `rgba(230,240,255,${.35 * (1 - ph)})`; ctx.beginPath(); ctx.arc(540 + ph * 80 + Math.sin(s + i) * 20, 1300 + ph * 160, 50 + ph * 120, 0, TAU); ctx.fill(); }
  if (!o.calm) { ctx.textAlign = 'center'; ctx.save(); ctx.translate(880 + Math.sin(s * 30) * 6, 1300); ctx.rotate(.15); txt('CLACK!', 0, 0, 90, '#fff', '#1a4a7a', 14, '400', 'Anton'); ctx.restore(); ctx.save(); ctx.translate(190 - Math.sin(s * 28) * 6, 1270); ctx.rotate(-.15); txt('CLACK!', 0, 0, 70, '#fff', '#1a4a7a', 12, '400', 'Anton'); ctx.restore(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 560, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function heaterOn(u, s) {                                                        // emergency heating system: siren + flames inside a body silhouette
  snowBG(s, .5); const on = (s * 2.5) % 1 < .5, cx = 540;
  ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.arc(cx, 560, 120, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(cx - 210, 700, 420, 620, 120); ctx.fill();
  const k = eo(clamp(u * 2)); for (let i = 0; i < 7; i++) { const x = cx - 150 + i * 50, h = (90 + 60 * Math.sin(s * 9 + i * 1.7)) * k; const g = ctx.createLinearGradient(0, 1200 - h * 2, 0, 1200); g.addColorStop(0, 'rgba(255,220,80,0)'); g.addColorStop(.5, 'rgba(255,140,40,.9)'); g.addColorStop(1, 'rgba(255,60,30,.95)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 30, 1200); ctx.quadraticCurveTo(x - 20, 1200 - h, x + Math.sin(s * 7 + i) * 10, 1200 - h * 2); ctx.quadraticCurveTo(x + 20, 1200 - h, x + 30, 1200); ctx.fill(); }
  spark(cx, 1050, 400, .4 * k, '255,150,60'); ctx.fillStyle = on ? '#ff3a3a' : '#7a1a1a'; ctx.beginPath(); ctx.arc(cx, 330, 50, Math.PI, TAU); ctx.fill(); ctx.fillRect(cx - 60, 330, 120, 20); if (on) spark(cx, 310, 200, .6, '255,60,60');
  ctx.textAlign = 'center'; txt('HEATING: ON', 540, 900, 100, '#ffa040', '#000', 16, '400', 'Anton');
}
function coreTemp(u, s) {                                                        // body core 98.6°F thermometer
  snowBG(s, .4); const cx = 400;
  ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.arc(cx, 560, 110, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(cx - 190, 690, 380, 600, 110); ctx.fill();
  for (const [x, y, rx, ry, c] of [[cx + 50, 820, 70, 60, '#e03a4a'], [cx - 70, 830, 70, 110, '#e88aa0'], [cx + 70, 860, 70, 110, '#e88aa0'], [cx, 1040, 120, 70, '#c87a5a'], [cx, 1160, 140, 60, '#d9a07a']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); }
  spark(cx, 960, 300, .35 + .1 * Math.sin(s * 3), '255,170,90');
  const tx = 820; ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.roundRect(tx - 40, 600, 80, 560, 40); ctx.fill(); ctx.beginPath(); ctx.arc(tx, 1180, 80, 0, TAU); ctx.fill(); ctx.fillStyle = '#e03a3a'; ctx.beginPath(); ctx.arc(tx, 1180, 60, 0, TAU); ctx.fill(); const lv = 1180 - lerp(80, 420, eo(clamp(u * 2))); ctx.fillRect(tx - 22, lv, 44, 1180 - lv);
  ctx.textAlign = 'center'; txt('98.6°F', 820, 540, 120, '#fff', '#8c0e18', 18, '400', 'Anton'); label('(37°C)', 820, 1330, 50, '#ffd23f'); label('CORE ORGANS', cx, 1370, 46, '#ffb0a0');
}
function sensors(u, s, o) {                                                      // skin sensors detect cold, signal races up to hypothalamus
  snowBG(s, .7); const top = 1150;
  ctx.fillStyle = '#e8b896'; ctx.fillRect(-300, top, 1700, 120); ctx.fillStyle = '#d99a7a'; ctx.fillRect(-300, top + 120, 1700, 500);
  const xs = [200, 420, 640, 860]; for (const x of xs) { const f = .5 + .5 * Math.sin(s * 8 + x); ctx.fillStyle = '#7ad0ff'; ctx.beginPath(); ctx.arc(x, top + 60, 26, 0, TAU); ctx.fill(); spark(x, top + 60, 90, .6 * f, '122,208,255'); tube([[x, top + 60], [x, top - 220 - (x % 3) * 30], [540, 620]], 8, 'rgba(122,208,255,.5)'); }
  for (let k = 0; k < xs.length; k++) { const ph = (s * .9 + k / 4) % 1, x = xs[k], P = [[x, top + 60], [x, top - 220 - (x % 3) * 30], [540, 620]], f = ph * 2, i = Math.min(1, Math.floor(f)), t = f - i; spark(lerp(P[i][0], P[i + 1][0], t), lerp(P[i][1], P[i + 1][1], t), 70, .95, '160,230,255'); }
  ctx.fillStyle = '#e8a0b0'; ctx.beginPath(); ctx.ellipse(540, 560, 220, 150, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(540, 620, 36, 0, TAU); ctx.fill(); spark(540, 620, 200, .6 + .3 * Math.sin(s * 10), '255,210,63');
  ctx.textAlign = 'left'; label('SKIN SENSORS', 80, top - 30, 46, '#7ad0ff', 'left'); ctx.textAlign = 'center'; label('HYPOTHALAMUS', 540, 800, 48, '#ffd23f');
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 1000, 90, o.col || '#7ad0ff', '#000', 14, '400', 'Anton'); }
}
function shiverMuscle(u, s, o) {                                                 // muscle fibres contracting rapidly → heat
  bgDeep(s, ['#3a1410', '#120604']); const q = Math.abs(Math.sin(s * 18)), cy = 980;
  for (let i = 0; i < 9; i++) { const y = cy - 320 + i * 80, w = 1 - .12 * q * (i % 2 ? 1 : .7); const g = ctx.createLinearGradient(0, y - 30, 0, y + 30); g.addColorStop(0, '#e06a6a'); g.addColorStop(.5, '#b83a40'); g.addColorStop(1, '#8a2228'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(540 - 470 * w, y - 32, 940 * w, 64, 32); ctx.fill(); ctx.strokeStyle = 'rgba(255,220,220,.3)'; ctx.lineWidth = 3; for (let x = -440; x < 440; x += 40) { ctx.beginPath(); ctx.moveTo(540 + x * w, y - 26); ctx.lineTo(540 + x * w, y + 26); ctx.stroke(); } }
  const k = eo(clamp(u * 2)); for (let i = 0; i < 8; i++) { const ph = (s * .8 + i / 8) % 1, x = 140 + i * 115; ctx.strokeStyle = `rgba(255,${150 + i * 10},60,${.8 * (1 - ph) * k})`; ctx.lineWidth = 10; ctx.beginPath(); const y0 = cy - 380 - ph * 300; ctx.moveTo(x, y0); ctx.bezierCurveTo(x - 30, y0 - 40, x + 30, y0 - 80, x, y0 - 120); ctx.stroke(); }
  spark(540, cy, 520, .35 * k, '255,140,60'); ctx.textAlign = 'center'; txt(o.text || 'SHIVERING = HEAT', 540, 520, 100, '#ffa040', '#000', 16, '400', 'Anton');
}
function jawSide(u, s, o) {                                                      // side skull: small packed jaw muscles near the brain, jaw bouncing
  snowBG(s, .4); const j = chatter(s, 18), cx = 460, cy = 980;
  ctx.fillStyle = '#efe6d6'; ctx.beginPath(); ctx.ellipse(cx, cy - 160, 330, 300, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx + 200, cy - 20); ctx.lineTo(cx + 330, cy + 60); ctx.lineTo(cx + 310, cy + 150); ctx.lineTo(cx + 60, cy + 150); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(232,160,176,.6)'; ctx.beginPath(); ctx.ellipse(cx - 20, cy - 220, 250, 190, 0, 0, TAU); ctx.fill(); ctx.textAlign = 'center'; label('BRAIN', cx - 20, cy - 220, 46, '#fff');
  ctx.fillStyle = '#2a2026'; ctx.beginPath(); ctx.ellipse(cx + 190, cy - 60, 60, 50, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(cx + 20, cy + 60); ctx.rotate(j * .12); ctx.fillStyle = '#efe6d6'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40, 240); ctx.lineTo(310, 260); ctx.lineTo(320, 170); ctx.lineTo(90, 150); ctx.lineTo(60, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.roundRect(120 + i * 40, 128, 32, 40, 6); ctx.fill(); } ctx.restore();
  ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.roundRect(cx + 140 + i * 40, cy + 150, 32, 40, 6); ctx.fill(); }
  const q = .5 + .5 * Math.sin(s * 36); ctx.fillStyle = `rgba(220,60,70,${.65 + .25 * q})`; ctx.beginPath(); ctx.ellipse(cx + 80, cy + 120, 70 - q * 6, 150, -.2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx + 10, cy - 60, 80, 110 - q * 6, .3, 0, TAU); ctx.fill(); spark(cx + 60, cy + 40, 220, .35 + .3 * q, '255,90,90');
  ctx.textAlign = 'left'; label('JAW MUSCLES', cx + 170, cy + 310, 46, '#ff8a8a', 'left'); tube([[cx + 250, cy + 270], [cx + 130, cy + 210]], 6, '#ff8a8a');
  if (j > .9) { ctx.textAlign = 'center'; txt('CLICK!', 920, cy + 140, 80, '#fff', '#1a4a7a', 12, '400', 'Anton'); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 470, o.size || 96, o.col || '#ffd23f', '#000', 14, '400', 'Anton'); }
}
