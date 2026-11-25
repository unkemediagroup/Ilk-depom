// ===== 3.video — STOMACH GROWL (portrait world 1080×1920) =====
function stomachPath() { ctx.beginPath(); ctx.moveTo(430, 560); ctx.bezierCurveTo(300, 640, 230, 900, 300, 1200); ctx.bezierCurveTo(360, 1520, 640, 1620, 800, 1450); ctx.bezierCurveTo(900, 1340, 850, 1200, 760, 1190); ctx.bezierCurveTo(700, 1185, 620, 1230, 560, 1130); ctx.bezierCurveTo(500, 1000, 540, 800, 560, 560); ctx.closePath(); }
function stomachOrgan(u, s, o) {
  const g = ctx.createRadialGradient(540, 960, 100, 540, 960, 1200); g.addColorStop(0, '#3a1418'); g.addColorStop(1, '#0c0406'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const gr = o.growl ? .5 + .5 * Math.sin(s * 9) : 0, sh = gr * 5; ctx.save(); ctx.translate(Math.sin(s * 50) * sh, Math.cos(s * 43) * sh);
  tube([[470, 200], [495, 600]], 96, '#c9766f'); tube([[780, 1330], [1000, 1380], [1200, 1330]], 80, '#c9766f');
  stomachPath(); const sg = ctx.createLinearGradient(250, 600, 850, 1500); sg.addColorStop(0, '#e29a8e'); sg.addColorStop(.5, '#cf7870'); sg.addColorStop(1, '#a24850'); ctx.fillStyle = sg; ctx.fill(); ctx.strokeStyle = '#7e3238'; ctx.lineWidth = 8; ctx.stroke();
  ctx.save(); stomachPath(); ctx.clip();
  ctx.fillStyle = 'rgba(70,14,22,.55)'; ctx.beginPath(); ctx.ellipse(500, 1080, 200, 400, -.2, 0, TAU); ctx.fill();
  for (let i = 0; i < 12; i++) { const p = wavy(240, 660 + i * 76, .6 + Math.sin(i) * .15, 760, 20, 6); tube(p, 9, 'rgba(255,200,190,.25)'); }
  if (o.slosh) { const lv = 1300 + Math.sin(s * 3) * 25; ctx.fillStyle = 'rgba(230,200,120,.75)'; ctx.beginPath(); ctx.moveTo(200, lv); for (let x = 200; x <= 900; x += 20) ctx.lineTo(x, lv + Math.sin(x * .02 + s * 6) * 26); ctx.lineTo(900, 1700); ctx.lineTo(200, 1700); ctx.closePath(); ctx.fill();
    const R = RN(5); for (let i = 0; i < 26; i++) { const ph = (s * (.4 + R() * .4) + R()) % 1, x = 330 + R() * 400, y = lerp(1500, 800, ph), r = 10 + R() * 30; ctx.strokeStyle = `rgba(255,255,255,${.8 * (1 - ph)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + Math.sin(s * 3 + i) * 14, y, r, 0, TAU); ctx.stroke(); } }
  if (o.wave) { const ph = (s * .45) % 1, y = lerp(560, 1500, ph); const band = ctx.createLinearGradient(0, y - 90, 0, y + 90); band.addColorStop(0, 'rgba(120,20,30,0)'); band.addColorStop(.5, 'rgba(120,20,30,.75)'); band.addColorStop(1, 'rgba(120,20,30,0)'); ctx.fillStyle = band; ctx.fillRect(-200, y - 90, 1500, 180); spark(560, y, 220, .35, '255,220,200'); }
  if (o.clean) { const R = RN(9); for (let i = 0; i < 22; i++) { const x = 280 + R() * 560, y = 640 + R() * 900, k = (s * 1.4 + R()) % 1; ctx.save(); ctx.translate(x, y); ctx.rotate(k * 2); ctx.globalAlpha = Math.sin(k * Math.PI); ctx.fillStyle = '#fff'; ctx.beginPath(); for (let a = 0; a < 8; a++) { const r = a % 2 ? 6 : 26; ctx.lineTo(Math.cos(a * Math.PI / 4) * r, Math.sin(a * Math.PI / 4) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); } }
  ctx.restore();
  const hl = ctx.createRadialGradient(400, 900, 20, 400, 900, 380); hl.addColorStop(0, 'rgba(255,235,225,.3)'); hl.addColorStop(1, 'rgba(255,235,225,0)'); stomachPath(); ctx.fillStyle = hl; ctx.fill();
  ctx.restore();
  if (o.growl) { for (let i = 0; i < 5; i++) { const ph = (s * 1.1 + i / 5) % 1; ctx.strokeStyle = `rgba(255,210,63,${.75 * (1 - ph)})`; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(560, 1080, 560 + ph * 380, -.7, .7); ctx.stroke(); ctx.beginPath(); ctx.arc(560, 1080, 560 + ph * 380, Math.PI - .7, Math.PI + .7); ctx.stroke(); }
    ctx.save(); ctx.translate(560 + Math.sin(s * 20) * 8, 1680); ctx.rotate(Math.sin(s * 6) * .05); ctx.textAlign = 'center'; txt('GRRRRR!', 0, 0, 150, '#ffd23f', '#8c0e18', 22, '400', 'Anton'); ctx.restore(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 470, 96, '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function sweep(u, s) {                                                         // contraction ring sweeping leftovers, mucus and bacteria along the gut
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#1a0c10'); g.addColorStop(1, '#2a1218'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const cy = 960, pc = (s * .32) % 1, top = [], bot = [];
  for (let x = -300; x <= 1400; x += 10) { const d = x / 1700 - pc + .18, sq = Math.exp(-Math.pow(d * 9, 2)), r = 300 - 170 * sq; top.push([x, cy - r]); bot.push([x, cy + r]); }
  ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - 70) : ctx.moveTo(p[0], p[1] - 70)); for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1] + 70); ctx.closePath(); ctx.fillStyle = '#b84f57'; ctx.fill();
  ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath(); ctx.fillStyle = '#e7a2a8'; ctx.fill();
  const front = (pc + .05) * 1700 - 300 + 160, R = RN(7);
  for (let i = 0; i < 34; i++) { const x = front + 40 + R() * 260 + Math.sin(s * 3 + i) * 8, y = cy + (R() - .5) * 380, t = i % 3; if (t === 0) bact(x, y, 46, R() * TAU + s, 0); else if (t === 1) { ctx.fillStyle = 'rgba(240,235,200,.7)'; ctx.beginPath(); ctx.ellipse(x, y, 30, 18, R() * 3, 0, TAU); ctx.fill(); } else { ctx.fillStyle = '#9a7a4a'; ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); } }
  for (let x = -300; x <= 1400; x += 80) { const d = x / 1700 - pc + .18, sq = Math.exp(-Math.pow(d * 9, 2)); if (sq > .3) spark(x, cy - 300 + 170 * sq - 50, 50, sq * .8); }
  ctx.textAlign = 'center'; txt('→ SWEPT AWAY', 540, 520, 90, '#fff', '#000', 14, '400', 'Anton');
}
