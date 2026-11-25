// ===== 2.video — HYPNIC JERK (portrait world 1080×1920) =====
function bedJerk(u, s, o) {                                                    // bedroom at night; body jerks under the blanket
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#121a34'); g.addColorStop(1, '#070a16'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.fillStyle = '#c8d6f0'; ctx.beginPath(); ctx.arc(860, 330, 70, 0, TAU); ctx.fill(); spark(860, 330, 320, .3, '200,215,255');
  ctx.fillStyle = '#2a3260'; ctx.fillRect(620, 220, 360, 300); ctx.strokeStyle = '#4a5490'; ctx.lineWidth = 12; ctx.strokeRect(620, 220, 360, 300); ctx.beginPath(); ctx.moveTo(800, 220); ctx.lineTo(800, 520); ctx.moveTo(620, 370); ctx.lineTo(980, 370); ctx.stroke();
  const jt = o.jerkAt !== undefined ? s - o.jerkAt : -9, j = jt >= 0 && jt < .7 ? Math.sin(Math.min(1, jt / .12) * Math.PI / 2) * Math.exp(-jt * 6) : 0, sh = j * 22;
  ctx.save(); ctx.translate(Math.sin(s * 80) * sh, Math.cos(s * 70) * sh);
  ctx.fillStyle = '#3a3050'; ctx.beginPath(); ctx.roundRect(40, 1180, 1000, 260, 40); ctx.fill(); ctx.fillStyle = '#2a2240'; ctx.fillRect(60, 1440, 40, 200); ctx.fillRect(980, 1440, 40, 200); ctx.fillRect(40, 1000, 60, 440);
  ctx.fillStyle = '#e8e2f0'; ctx.beginPath(); ctx.roundRect(110, 1080, 280, 120, 50); ctx.fill();
  const lift = j * 70; ctx.fillStyle = '#5a6aa8'; ctx.beginPath(); ctx.moveTo(300, 1210 - lift * .6); ctx.bezierCurveTo(520, 1080 - lift, 820, 1110 - lift * .8, 1030, 1190); ctx.lineTo(1030, 1260); ctx.lineTo(300, 1260); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(380 + i * 150, 1150 - lift * .8); ctx.quadraticCurveTo(420 + i * 150, 1200, 400 + i * 150, 1250); ctx.stroke(); }
  ctx.save(); ctx.translate(250, 1090 - lift * .5); ctx.rotate(-j * .25); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.ellipse(0, 0, 90, 72, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1c14'; ctx.beginPath(); ctx.ellipse(-30, -30, 90, 56, -.2, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = '#4a2a20'; ctx.lineWidth = 6; if (j > .15 || o.awake) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(40, -6, 13, 0, TAU); ctx.fill(); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(42, -6, 6, 0, TAU); ctx.fill(); } else { ctx.beginPath(); ctx.moveTo(26, -4); ctx.quadraticCurveTo(40, 4, 54, -4); ctx.stroke(); } ctx.restore();
  ctx.restore();
  if (j > .05) { for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .35; ctx.strokeStyle = `rgba(255,230,120,${j})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(250 + Math.cos(a) * 130, 1000 + Math.sin(a) * 130); ctx.lineTo(250 + Math.cos(a) * 220, 1000 + Math.sin(a) * 220); ctx.stroke(); } ctx.textAlign = 'center'; ctx.save(); ctx.globalAlpha = Math.min(1, j * 3); txt('JOLT!', 640, 820, 200, '#fff', '#8c0e18', 26, '400', 'Anton'); ctx.restore(); }
  if (!o.awake && j < .05) { for (let i = 0; i < 3; i++) { const ph = (s * .4 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; ctx.textAlign = 'center'; txt('Z', 380 + ph * 140 + i * 12, 960 - ph * 260, 60 + i * 22, '#e8eefc', 'rgba(0,0,0,.6)', 8, '400', 'Anton'); ctx.restore(); } }
}
function seventy(u, s) {
  bgDeep(s, ['#1e2232', '#0c0e16']); const k = Math.floor(clamp(u * 1.4) * 7.999);
  for (let i = 0; i < 10; i++) { const x = 200 + (i % 5) * 170, y = 820 + Math.floor(i / 5) * 420, on = i < k, col = on ? '#ffd23f' : 'rgba(255,255,255,.22)'; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - 110, 50, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 65, y - 50, 130, 190, 50); ctx.fill(); if (on) spark(x, y, 140, .25, '255,210,63'); }
  ctx.textAlign = 'center'; txt(Math.round(clamp(u * 1.4) * 70) + '%', 540, 560, 230, '#fff', '#8c0e18', 26, '400', 'Anton'); txt('OF PEOPLE', 540, 1720, 90, '#ffd23f', '#000', 14, '400', 'Anton');
}
function cliffFall(u, s) {                                                     // dream: stepping off a cliff, falling
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a2a5a'); g.addColorStop(.6, '#5a4a7a'); g.addColorStop(1, '#1a1428'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const R = RN(3); for (let i = 0; i < 80; i++) { ctx.fillStyle = `rgba(255,255,255,${.3 + R() * .5})`; ctx.fillRect(R() * 1080, R() * 1000, 3, 3); }
  ctx.fillStyle = '#14101c'; ctx.beginPath(); ctx.moveTo(-200, 700); ctx.lineTo(420, 700); ctx.lineTo(380, 900); ctx.lineTo(430, 1200); ctx.lineTo(360, 2000); ctx.lineTo(-200, 2000); ctx.closePath(); ctx.fill();
  const f = eio(clamp(u * 1.1)), x = lerp(470, 700, f), y = lerp(560, 1500, f * f), rot = f * 2.2;
  for (let i = 1; i < 6; i++) { ctx.strokeStyle = `rgba(255,255,255,${.25 - i * .04})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 30 + i * 12, y - 120 - i * 50); ctx.lineTo(x - 30 + i * 12, y - 60 - i * 50); ctx.stroke(); }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#0a0812'; ctx.beginPath(); ctx.arc(0, -110, 40, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-34, -70, 68, 130, 26); ctx.fill();
  const fl = Math.sin(s * 14) * .5; for (const d of [-1, 1]) { tube([[d * 30, -50], [d * 110, -110 + fl * 60 * d], [d * 150, -190 + fl * 40]], 22, '#0a0812'); tube([[d * 18, 60], [d * 60, 150 + fl * 30 * d], [d * 50, 240]], 24, '#0a0812'); } ctx.restore();
  ctx.textAlign = 'center'; txt('"I\'M FALLING!"', 540, 540, 110, '#fff', '#3a1a5a', 16, '400', 'Anton');
}
function alarm(u, s, o) {                                                      // brain flashes red: false alarm
  brain3d(u, s, { glows: [[-40, -40, 360, 0]] }); const on = (s * 3) % 1 < .5; ctx.fillStyle = `rgba(220,20,40,${on ? .32 : .08})`; ctx.fillRect(-2400, -2400, 6800, 6000);
  for (let i = 0; i < 2; i++) { ctx.strokeStyle = `rgba(255,80,80,${on ? .9 : .3})`; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(960, 560, 640 + i * 70, 0, TAU); ctx.stroke(); }
  ctx.textAlign = 'center'; txt(o.text || 'EMERGENCY!', 960, 130, 120, '#fff', '#8c0e18', 18, '400', 'Anton');
}
function triggers3(u, s) {
  bgDeep(s, ['#2a1a14', '#100a08']);
  const tile = (y, i, title, draw) => { const k = eo(clamp(u * 3 - i * .7)); ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 300, 0); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(90, y - 170, 900, 340, 40); ctx.fill(); draw(280, y); ctx.textAlign = 'left'; txt(title, 470, y + 30, 100, '#fff', '#000', 14, '400', 'Anton'); ctx.restore(); };
  tile(560, 0, 'STRESS', (x, y) => { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(x + 20, y - 130); ctx.lineTo(x - 70, y + 20); ctx.lineTo(x, y + 20); ctx.lineTo(x - 30, y + 140); ctx.lineTo(x + 80, y - 20); ctx.lineTo(x + 10, y - 20); ctx.closePath(); ctx.fill(); });
  tile(960, 1, 'CAFFEINE', (x, y) => { ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.roundRect(x - 90, y - 90, 180, 190, [10, 10, 50, 50]); ctx.fill(); ctx.strokeStyle = '#f2ece4'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(x + 100, y, 46, -1.4, 1.4); ctx.stroke(); ctx.fillStyle = '#5a3420'; ctx.beginPath(); ctx.ellipse(x, y - 84, 82, 16, 0, 0, TAU); ctx.fill(); for (let i = 0; i < 3; i++) tube(wavy(x - 40 + i * 40, y - 120, -Math.PI / 2, 90, 10 + Math.sin(s * 3 + i) * 4, 6), 6, 'rgba(255,255,255,.5)'); });
  tile(1360, 2, 'TIREDNESS', (x, y) => { ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.ellipse(x, y, 110, 60, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a22'; ctx.beginPath(); ctx.arc(x, y + 10, 40, 0, TAU); ctx.fill(); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.ellipse(x, y - 30, 120, 50, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(x - 120, y - 32, 240, 30); });
}
