// ===== 18.video — DEHYDRATION HEADACHE (portrait world 1080×1920) =====
function glass(x, y, sc, fill, s) { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = 'rgba(200,230,255,.25)'; ctx.beginPath(); ctx.moveTo(-90, -140); ctx.lineTo(90, -140); ctx.lineTo(70, 140); ctx.lineTo(-70, 140); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(220,240,255,.8)'; ctx.lineWidth = 6; ctx.stroke();
  if (fill > 0) { const ly = 140 - 270 * fill; ctx.save(); ctx.beginPath(); ctx.moveTo(-90, -140); ctx.lineTo(90, -140); ctx.lineTo(70, 140); ctx.lineTo(-70, 140); ctx.closePath(); ctx.clip(); ctx.fillStyle = '#4aa8f0'; ctx.beginPath(); ctx.moveTo(-100, ly); for (let x = -100; x <= 100; x += 10) ctx.lineTo(x, ly + Math.sin(x * .06 + s * 5) * 6); ctx.lineTo(100, 150); ctx.lineTo(-100, 150); ctx.closePath(); ctx.fill(); ctx.restore(); } ctx.restore(); }
function painFace(u, s, o) {                                                     // face holding throbbing head
  bgDeep(s, o.relief ? ['#14304a', '#08121c'] : ['#3a1418', '#12060a']); const thr = o.relief ? 0 : .5 + .5 * Math.sin(s * 5);
  if (!o.relief) for (let i = 0; i < 3; i++) { const ph = (s * .9 + i / 3) % 1; ctx.strokeStyle = `rgba(255,70,70,${.7 * (1 - ph)})`; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(540, 900, 420 + ph * 160, 500 + ph * 160, 0, 0, TAU); ctx.stroke(); }
  ctx.save(); ctx.translate(540, 960); ctx.scale(1 + .015 * thr, 1 + .015 * thr); ctx.translate(-540, -960);
  ctx.fillStyle = '#e2ad8a'; ctx.beginPath(); ctx.ellipse(540, 960, 380, 470, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.ellipse(540, 620, 400, 230, 0, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = '#3a2216'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (const x of [400, 680]) { if (o.relief) { ctx.beginPath(); ctx.arc(x, 890, 26, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } else { ctx.beginPath(); ctx.moveTo(x - 50, 870); ctx.lineTo(x + 50, 890); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 60, 800 + (x < 540 ? 20 : -20)); ctx.lineTo(x + 60, 800 + (x < 540 ? -20 : 20)); ctx.stroke(); } }
  ctx.beginPath(); if (o.relief) { ctx.moveTo(450, 1170); ctx.quadraticCurveTo(540, 1230, 630, 1170); } else { ctx.moveTo(450, 1200); ctx.quadraticCurveTo(540, 1150, 630, 1200); } ctx.stroke(); ctx.restore();
  if (!o.relief) { for (const d of [-1, 1]) { ctx.save(); ctx.translate(540 + d * 400, 760); ctx.rotate(d * .3); ctx.fillStyle = '#d29a78'; ctx.beginPath(); ctx.roundRect(-60, -90, 120, 180, 50); ctx.fill(); ctx.restore(); }
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .35; ctx.strokeStyle = `rgba(255,90,60,${.4 + .6 * thr})`; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * 470, 900 + Math.sin(a) * 520); ctx.lineTo(540 + Math.cos(a) * 560, 900 + Math.sin(a) * 610); ctx.stroke(); } }
  if (o.glass !== undefined) glass(870, 1300, 1, typeof o.glass === 'function' ? o.glass(u) : o.glass, s);
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 560, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
// head cross-section: skull ring, meninges (3 membranes), fluid, brain; o.shrink pulls brain away, o.tension shows pain
function headX(u, s, o) {
  bgDeep(s, ['#2a1420', '#0e060a']); const cx = 540, cy = 1000, R = 360;
  const sk = typeof o.shrink === 'function' ? o.shrink(u) : (o.shrink || 0);
  ctx.fillStyle = '#efe6d6'; ctx.beginPath(); ctx.arc(cx, cy, R + 70, 0, TAU); ctx.fill(); ctx.fillStyle = '#d8ccb6'; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (R + 35), cy + Math.sin(a) * (R + 35), 8, 0, TAU); ctx.fill(); }
  ctx.fillStyle = `rgba(140,200,255,${.35 * (1 - sk * .7)})`; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.fillStyle = '#1a0c12'; ctx.globalAlpha = sk * .6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
  const br = R - 30 - sk * 70, by = cy + sk * 50;
  ctx.strokeStyle = '#c84a6a'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R - 6, 0, TAU); ctx.stroke();
  const anch = 12, hot = o.tension ? (.5 + .5 * Math.sin(s * 8)) : 0;
  for (let i = 0; i < anch; i++) { const a = i / anch * TAU + .2, x0 = cx + Math.cos(a) * (R - 8), y0 = cy + Math.sin(a) * (R - 8), x1 = cx + Math.cos(a) * br, y1 = by + Math.sin(a) * br; const st = Math.hypot(x1 - x0, y1 - y0) / 90; ctx.strokeStyle = o.tension ? `rgba(255,${Math.round(200 - 140 * st)},80,${.6 + .4 * hot})` : 'rgba(240,180,200,.7)'; ctx.lineWidth = 8 + (o.tension ? 4 * hot : 0); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); if (o.tension && Math.sin(a) < .2) spark((x0 + x1) / 2, (y0 + y1) / 2, 70 + 30 * hot, .8, '255,90,60'); }
  ctx.save(); ctx.translate(cx, by); const bs = br / 360; ctx.scale(bs, bs); ctx.fillStyle = '#e8a0b0'; ctx.beginPath(); ctx.arc(0, 0, 360, 0, TAU); ctx.fill(); ctx.strokeStyle = '#c87088'; ctx.lineWidth = 12; const Rn = RN(2); for (let i = 0; i < 16; i++) { ctx.beginPath(); const a = Rn() * TAU, r = 60 + Rn() * 240; ctx.arc(Math.cos(a) * r * .4, Math.sin(a) * r * .4, 40 + Rn() * 60, a, a + 2.4); ctx.stroke(); } ctx.restore();
  if (o.labels) { ctx.textAlign = 'left'; label('SKULL', 80, cy - R - 80, 46, '#efe6d6', 'left'); ctx.textAlign = 'right'; label('MENINGES', 1000, cy - R - 80, 46, '#ff8aa8', 'right'); tube([[930, cy - R - 64], [cx + (R - 6) * .7, cy - (R - 6) * .7]], 6, '#ff8aa8'); ctx.textAlign = 'center'; label('BRAIN', cx, by + 16, 56, '#fff'); }
  if (o.noPain) { ctx.textAlign = 'center'; label('0 PAIN RECEPTORS', cx, by + 16, 56, '#fff'); }
  if (o.water) { const R2 = RN(9); for (let i = 0; i < 18; i++) { const ph = (s * .8 + R2()) % 1, a = R2() * TAU, r = lerp(R + 300, R - 40, ph); ctx.fillStyle = `rgba(90,176,240,${Math.sin(ph * Math.PI)})`; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 16, 0, TAU); ctx.fill(); } }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 420, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function waterBrain(u, s) {                                                      // brain silhouette filling to 75% water
  bgDeep(s, ['#14304a', '#08121c']); const cx = 540, cy = 980, k = eo(clamp(u * 2.5)) * .75;
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, 380, 300, 0, 0, TAU); ctx.clip(); ctx.fillStyle = '#e8a0b0'; ctx.fillRect(0, 0, 1200, 2000); const ly = cy + 300 - 600 * k; ctx.fillStyle = 'rgba(74,168,240,.85)'; ctx.beginPath(); ctx.moveTo(100, ly); for (let x = 100; x <= 1000; x += 20) ctx.lineTo(x, ly + Math.sin(x * .02 + s * 4) * 14); ctx.lineTo(1000, 1400); ctx.lineTo(100, 1400); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.strokeStyle = '#c87088'; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(cx, cy, 380, 300, 0, 0, TAU); ctx.stroke();
  ctx.textAlign = 'center'; txt(Math.round(k * 100) + '%', cx, cy + 50, 200, '#fff', '#0a3a6a', 22, '400', 'Anton'); txt('WATER', cx, 560, 120, '#7ad0ff', '#000', 16, '400', 'Anton');
}
function fluidDrop(u, s) {                                                       // blood & fluid volume gauge dropping
  bgDeep(s, ['#2a1a14', '#0e0806']); const k = eio(clamp(u * 1.4)), lv = 1 - .45 * k;
  for (const [x, lab, col] of [[340, 'BLOOD', '#e03a4a'], [740, 'FLUID', '#4aa8f0']]) { ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.roundRect(x - 110, 640, 220, 620, 50); ctx.fill(); const top = 1240 - 580 * lv; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 90, top); for (let xx = x - 90; xx <= x + 90; xx += 10) ctx.lineTo(xx, top + Math.sin(xx * .08 + s * 5) * 8); ctx.lineTo(x + 90, 1240); ctx.quadraticCurveTo(x, 1260, x - 90, 1240); ctx.closePath(); ctx.fill(); ctx.textAlign = 'center'; label(lab, x, 1320, 48, col); }
  ctx.save(); ctx.globalAlpha = k; tube([[540, 700], [540, 1100]], 26, '#ff6a5a'); ctx.fillStyle = '#ff6a5a'; ctx.beginPath(); ctx.moveTo(480, 1080); ctx.lineTo(600, 1080); ctx.lineTo(540, 1180); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.textAlign = 'center'; txt('VOLUME DROPS', 540, 520, 110, '#ffd23f', '#000', 16, '400', 'Anton');
}
