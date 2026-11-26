// ===== 17.video — SPICY FOOD FEELS HOT (portrait world 1080×1920) =====
function chili(x, y, sc, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); const g = ctx.createLinearGradient(-60, -200, 60, 200); g.addColorStop(0, '#ff4a3a'); g.addColorStop(1, '#a8141a'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-50, -170); ctx.bezierCurveTo(-90, 0, -40, 160, 30, 230); ctx.bezierCurveTo(10, 120, 70, -20, 50, -170); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-25, -60, 10, 70, .1, 0, TAU); ctx.fill();
  ctx.fillStyle = '#3a8a2a'; ctx.beginPath(); ctx.ellipse(0, -175, 70, 26, 0, 0, TAU); ctx.fill(); tube([[0, -190], [20, -250], [60, -270]], 18, '#3a8a2a'); ctx.restore(); }
function flames(x, y, w, h, s, a = 1) { for (let i = 0; i < 7; i++) { const fx = x - w / 2 + i * w / 6, fh = h * (.6 + .4 * Math.sin(s * 9 + i * 1.9)); const g = ctx.createLinearGradient(0, y - fh, 0, y); g.addColorStop(0, 'rgba(255,230,90,0)'); g.addColorStop(.4, `rgba(255,150,40,${.9 * a})`); g.addColorStop(1, `rgba(255,60,30,${a})`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(fx - 40, y); ctx.quadraticCurveTo(fx - 30, y - fh * .5, fx + Math.sin(s * 7 + i) * 14, y - fh); ctx.quadraticCurveTo(fx + 30, y - fh * .5, fx + 40, y); ctx.fill(); } }
function hotFace(u, s, o) {                                                      // face front: bite chili, fire breath, sweat & flush
  bgDeep(s, ['#3a1a10', '#140806']); const fl = o.flush ? (typeof o.flush === 'function' ? o.flush(u) : 1) : .3;
  ctx.fillStyle = `rgb(${Math.round(lerp(226, 240, fl))},${Math.round(lerp(173, 110, fl))},${Math.round(lerp(138, 100, fl))})`; ctx.beginPath(); ctx.ellipse(540, 960, 380, 470, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.ellipse(540, 620, 400, 230, 0, Math.PI, TAU); ctx.fill();
  ctx.fillStyle = `rgba(255,40,60,${.25 + .4 * fl})`; for (const x of [330, 750]) { ctx.beginPath(); ctx.ellipse(x, 1020, 100, 60, 0, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = '#3a2216'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (const x of [400, 680]) { if (o.fire) { ctx.beginPath(); ctx.moveTo(x - 50, 860); ctx.lineTo(x, 885); ctx.lineTo(x + 50, 860); ctx.stroke(); } else { ctx.fillStyle = '#3a2216'; ctx.beginPath(); ctx.arc(x, 880, 16, 0, TAU); ctx.fill(); } }
  const my = 1170; ctx.fillStyle = '#5a1a22'; ctx.beginPath(); ctx.ellipse(540, my, o.fire ? 120 : 70, o.fire ? 80 : 26, 0, 0, TAU); ctx.fill();
  if (o.bite) { const k = eio(clamp(u * 1.6)); chili(lerp(900, 640, k), lerp(1250, 1160, k), 1.2, -1.2 + k * .2); }
  if (o.fire) { ctx.save(); ctx.translate(540, my + 20); ctx.rotate(Math.PI); flames(0, 0, 220, 420, s, 1); ctx.restore(); spark(540, my + 200, 300, .4, '255,140,40'); }
  if (o.sweat) { const R = RN(7); for (let i = 0; i < 8; i++) { const ph = (s * (.4 + R() * .3) + R()) % 1, x = 220 + R() * 640, y = 620 + R() * 300 + ph * 260; ctx.fillStyle = `rgba(160,220,255,${.9 * (1 - ph)})`; ctx.beginPath(); ctx.moveTo(x, y - 30); ctx.quadraticCurveTo(x + 20, y, x, y + 14); ctx.quadraticCurveTo(x - 20, y, x, y - 30); ctx.fill(); } }
  if (o.endo) { const R = RN(3); for (let i = 0; i < 16; i++) { const a = R() * TAU + s * .4, r = 480 + Math.sin(s * 2 + i) * 40, x = 540 + Math.cos(a) * r, y = 960 + Math.sin(a) * r * 1.1; ctx.save(); ctx.translate(x, y); ctx.rotate(s + i); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); for (let k = 0; k < 10; k++) { const rr = k % 2 ? 10 : 26; ctx.lineTo(Math.cos(k * Math.PI / 5) * rr, Math.sin(k * Math.PI / 5) * rr); } ctx.closePath(); ctx.fill(); ctx.restore(); spark(x, y, 60, .5, '255,210,63'); } }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 400, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function roomTemp(u, s) {                                                        // chili next to a thermometer: room temperature
  bgDeep(s, ['#1e2a3a', '#0a1016']); chili(380, 1000, 2, -.25 + Math.sin(s * 1.5) * .05);
  const tx = 800; ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.roundRect(tx - 40, 640, 80, 520, 40); ctx.fill(); ctx.beginPath(); ctx.arc(tx, 1180, 80, 0, TAU); ctx.fill(); ctx.fillStyle = '#5ab0f0'; ctx.beginPath(); ctx.arc(tx, 1180, 60, 0, TAU); ctx.fill(); const lv = 1180 - lerp(60, 230, eo(clamp(u * 2))); ctx.fillRect(tx - 22, lv, 44, 1180 - lv);
  ctx.textAlign = 'center'; txt('72°F', tx, 590, 100, '#5ab0f0', '#000', 14, '400', 'Anton'); txt('ROOM TEMPERATURE', 540, 1340 - 20, 70, '#fff', '#000', 12, '400', 'Anton');
}
function capMolecule(x, y, sc, s) {                                             // stylised capsaicin: ring + zig-zag tail
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(Math.sin(s * 1.3) * .2);
  const ring = []; for (let i = 0; i < 6; i++) ring.push([-160 + Math.cos(i * Math.PI / 3) * 60, Math.sin(i * Math.PI / 3) * 60]); tube([...ring, ring[0]], 12, '#e8e8f0');
  const tail = [[-100, 0]]; for (let i = 1; i < 8; i++) tail.push([-100 + i * 45, i % 2 ? -30 : 30]); tube(tail, 12, '#e8e8f0');
  for (const p of [...ring, ...tail.slice(1)]) { ctx.fillStyle = '#ff5a3a'; ctx.beginPath(); ctx.arc(p[0], p[1], 16, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#5ab0f0'; ctx.beginPath(); ctx.arc(-220, -60, 18, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-100, -90, 18, 0, TAU); ctx.fill(); ctx.restore(); }
function capsaicin(u, s) { bgDeep(s, ['#3a1410', '#120604']); chili(300, 1250, 1.2, -.4); const k = eo(clamp(u * 1.5)); for (let i = 0; i < 5; i++) { const a = i * 1.3 + s * .3, d = k * (200 + i * 80); capMolecule(320 + Math.cos(a) * d * 1.4 + d * .6, 1100 - Math.abs(Math.sin(a)) * d - d * .5, .6 + (i === 2 ? .5 : 0), s + i); }
  ctx.textAlign = 'center'; txt('CAPSAICIN', 540, 520, 150, '#ff6a3a', '#000', 20, '400', 'Anton'); }
// tongue surface with TRPV1 channels; o.bind: capsaicin docks & gate opens; o.alarm: signals race away
function tongue(u, s, o) {
  bgDeep(s, ['#3a1418', '#12060a']); const top = 1000;
  ctx.fillStyle = '#e07a8a'; ctx.beginPath(); ctx.moveTo(-300, top); for (let x = -300; x <= 1400; x += 60) ctx.quadraticCurveTo(x + 30, top - 40, x + 60, top); ctx.lineTo(1400, 1900); ctx.lineTo(-300, 1900); ctx.closePath(); ctx.fill();
  const R = RN(4); for (let i = 0; i < 40; i++) { ctx.fillStyle = 'rgba(255,170,180,.6)'; ctx.beginPath(); ctx.arc(R() * 1100, top + 60 + R() * 500, 6 + R() * 10, 0, TAU); ctx.fill(); }
  const bk = o.bind ? eo(clamp(u * 2)) : 0, xs = [220, 540, 860];
  for (const x of xs) { const open = o.open ? 1 : bk; ctx.fillStyle = '#7a3ac8'; ctx.beginPath(); ctx.roundRect(x - 70 - open * 16, top - 90, 60, 220, 24); ctx.fill(); ctx.beginPath(); ctx.roundRect(x + 10 + open * 16, top - 90, 60, 220, 24); ctx.fill();
    if (o.bind) { capMolecule(x - 10 + 40, lerp(top - 420, top - 160, bk), .5, s + x); }
    if (open > .5) { for (let k = 0; k < 4; k++) { const ph = (s * 1.2 + k / 4) % 1; ctx.fillStyle = `rgba(255,220,90,${1 - ph})`; ctx.beginPath(); ctx.arc(x + Math.sin(k * 2 + s) * 10, lerp(top - 80, top + 200, ph), 12, 0, TAU); ctx.fill(); } spark(x, top + 150, 120, .6 * open, '255,180,60'); }
    if (o.alarm && open > .5) { const ph = (s * .9 + x / 1000) % 1; tube([[x, top + 150], [x, top + 300], [540, 1700]], 8, 'rgba(255,90,60,.6)'); const P = [[x, top + 150], [x, top + 300], [540, 1700]], f = ph * 2, i = Math.min(1, Math.floor(f)), t = f - i; spark(lerp(P[i][0], P[i + 1][0], t), lerp(P[i][1], P[i + 1][1], t), 80, .95, '255,90,60'); } }
  ctx.textAlign = 'center'; label('TRPV1 HEAT SENSORS', 540, top + 220 + 40, 46, '#d0a8ff');
  if (o.text) { txt(o.text, 540, o.ty || 560, o.size || 110, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function threshold(u, s, o) {                                                    // gauge: sensor fires above 109°F; capsaicin drags the line down to body temp
  bgDeep(s, ['#2a1410', '#100604']); const x0 = 260, y0 = 1250, y1 = 620, val = t => lerp(y0, y1, (t - 65) / 70);
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x0 - 60, y1 - 40, 120, y0 - y1 + 80, 60); ctx.fill();
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#5ab0f0'); g.addColorStop(.5, '#ffd23f'); g.addColorStop(1, '#ff3a3a'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0 - 30, y1, 60, y0 - y1, 30); ctx.fill();
  for (const t of [70, 80, 90, 120, 130]) { ctx.fillStyle = '#fff'; ctx.fillRect(x0 + 40, val(t) - 2, 30, 4); ctx.textAlign = 'left'; label(t + '°', x0 + 80, val(t) + 14, 34, 'rgba(255,255,255,.7)', 'left'); }
  const thr = o.lower ? lerp(109, 98.6, eio(clamp(u * 1.8))) : 109, ty = val(thr);
  ctx.strokeStyle = '#ff3a3a'; ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.beginPath(); ctx.moveTo(x0 - 80, ty); ctx.lineTo(980, ty); ctx.stroke(); ctx.setLineDash([]);
  ctx.textAlign = 'right'; label('PAIN ALARM ' + thr.toFixed(thr < 100 ? 1 : 0) + '°F', 980, ty - 24, 48, '#ff6a6a', 'right');
  const by = val(98.6); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0 - 80, by); ctx.lineTo(980, by); ctx.stroke(); ctx.textAlign = 'right'; label('YOUR MOUTH ~98.6°F', 980, by + 56, 40, '#cfe0ff', 'right');
  if (o.lower && thr < 100) { const on = (s * 3) % 1 < .5; ctx.fillStyle = `rgba(255,30,30,${on ? .25 : .08})`; ctx.fillRect(-2200, -2200, 5600, 6600); ctx.textAlign = 'center'; txt('BURN ALARM!', 600, 560, 110, '#fff', '#8c0e18', 18, '400', 'Anton'); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 480, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
