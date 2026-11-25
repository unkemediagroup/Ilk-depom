// ===== 11.video — FOOT FALLS ASLEEP (portrait world 1080×1920) =====
function pins(x, y, rw, rh, n, s, a, seed = 2) {                                  // pins & needles sparkles
  const R = RN(seed); for (let i = 0; i < n; i++) { const px = x + (R() - .5) * rw, py = y + (R() - .5) * rh, ph = (s * (1.5 + R() * 2) + R()) % 1, al = a * Math.sin(ph * Math.PI);
    ctx.save(); ctx.translate(px, py); ctx.rotate(R() * 3); ctx.strokeStyle = `rgba(255,240,140,${al})`; ctx.lineWidth = 5; const r = 10 + R() * 22; for (let k = 0; k < 4; k++) { const an = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(-Math.cos(an) * r, -Math.sin(an) * r); ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); ctx.stroke(); } ctx.restore(); }
}
function floorBG(s) { const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a3a5a'); g.addColorStop(.62, '#3a4a6a'); g.addColorStop(.63, '#8a5a3a'); g.addColorStop(1, '#5a3a24'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 4; for (let x = -400; x < 1500; x += 160) { ctx.beginPath(); ctx.moveTo(x, 1210); ctx.lineTo(x - 300, 2400); ctx.stroke(); } }
function sitter(x, y, sc, s, o) {                                                // front view person sitting cross-legged; o.up 0..1 stands up
  const up = o.up || 0, skin = '#d9a07a', shirt = '#3a7ac8', pant = '#2a2a3a';
  ctx.save(); ctx.translate(x, y - up * 380 * sc); ctx.scale(sc, sc);
  if (up < .5) { ctx.fillStyle = pant; ctx.beginPath(); ctx.ellipse(-120, 40, 190, 70, .12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(120, 40, 190, 70, -.12, 0, TAU); ctx.fill();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(190, 70, 70, 34, -.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-190, 70, 70, 34, .3, 0, TAU); ctx.fill(); }
  else { tube([[-50, 0], [-60, 380]], 80, pant); tube([[50, 0], [60, 380]], 80, pant); ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(-80, 400, 70, 30, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(80, 400, 70, 30, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = shirt; ctx.beginPath(); ctx.roundRect(-120, -330, 240, 340, 70); ctx.fill();
  tube([[-110, -290], [-170, -130], [-120, 10]], 50, shirt); tube([[110, -290], [170, -130], [120, 10]], 50, shirt);
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, -420, 95, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.arc(0, -440, 98, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  ctx.strokeStyle = '#3a2216'; ctx.lineWidth = 8; ctx.lineCap = 'round'; const wince = o.wince ? 1 : 0;
  for (const d of [-1, 1]) { ctx.beginPath(); if (wince) { ctx.moveTo(d * 50, -440); ctx.lineTo(d * 25, -425); ctx.lineTo(d * 50, -410); } else { ctx.arc(d * 35, -425, 9, 0, TAU); } ctx.stroke(); }
  ctx.beginPath(); if (wince) { ctx.moveTo(-30, -360); ctx.quadraticCurveTo(0, -380 + Math.sin(s * 20) * 6, 30, -360); } else { ctx.moveTo(-25, -370); ctx.quadraticCurveTo(0, -355, 25, -370); } ctx.stroke();
  ctx.restore();
}
function crossLegs(u, s, o) {
  floorBG(s); const up = o.stand ? eio(clamp((s - .6) / 1.2)) : 0; sitter(540, 1300, 1.15, s, { up, wince: o.wince || up > .5 });
  const fx = up > .5 ? 632 : 760, fy = up > .5 ? 1290 + 0 : 1380; if (o.pins) { spark(fx, fy, 240, .35, '255,230,120'); pins(fx, fy, 300, 200, 26, s, .95); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 640, 110, '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function footShape() { ctx.beginPath(); ctx.moveTo(300, 300); ctx.lineTo(560, 300); ctx.lineTo(600, 980); ctx.bezierCurveTo(820, 1040, 960, 1100, 960, 1200); ctx.bezierCurveTo(960, 1290, 820, 1300, 600, 1290); ctx.bezierCurveTo(380, 1290, 250, 1260, 260, 1120); ctx.closePath(); }
function footClose(u, s, o) {                                                    // big foot; numb grey, pins & needles, or normal
  bgDeep(s, ['#1e2a3a', '#0a0e16']); const dead = o.dead !== undefined ? o.dead : 0, k = typeof dead === 'function' ? dead(u) : dead;
  footShape(); const fg = ctx.createLinearGradient(300, 300, 900, 1300); fg.addColorStop(0, '#e0a882'); fg.addColorStop(1, '#c98a68'); ctx.fillStyle = fg; ctx.fill();
  ctx.save(); footShape(); ctx.clip(); ctx.fillStyle = `rgba(120,130,150,${.75 * k})`; ctx.fillRect(0, 0, 1200, 1400); ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 6; footShape(); ctx.stroke();
  if (o.pins) pins(680, 1100, 600, 380, 40, s, o.pins === 2 ? .7 : 1, 5);
  if (o.words) { const W = ['NUMB', 'HEAVY', 'BUZZING']; const i = Math.min(2, Math.floor(s / .9)), a = eo(clamp((s - i * .9) * 4)); ctx.save(); ctx.translate(540, 620); ctx.scale(.6 + .4 * a, .6 + .4 * a); ctx.textAlign = 'center'; txt(W[i] + '!', 0, 0, 150, ['#c8d0e0', '#ffd23f', '#ff8a5a'][i], '#000', 20, '400', 'Anton'); ctx.restore(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 600, 120, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function bloodMyth(u, s) {                                                       // blood keeps flowing → myth busted
  bgDeep(s, ['#3a1418', '#12060a']); const p = wavy(-200, 980, 0, 1500, 30, 4); tube(p, 260, '#7a1a22'); tube(p, 220, '#b8303a'); tube(p.map(q => [q[0], q[1] - 70]), 30, 'rgba(255,255,255,.15)');
  const R = RN(3); for (let i = 0; i < 26; i++) { const x = ((R() * 1600 + s * 260) % 1600) - 300, y = 980 + Math.sin((x + 200) / 1500 * 4) * 30 + (R() - .5) * 140; ctx.fillStyle = '#e04a50'; ctx.beginPath(); ctx.ellipse(x, y, 34, 22, R() * 3, 0, TAU); ctx.fill(); ctx.fillStyle = '#a8202a'; ctx.beginPath(); ctx.ellipse(x, y, 14, 8, 0, 0, TAU); ctx.fill(); }
  ctx.textAlign = 'center'; txt('CUT OFF BLOOD FLOW?', 540, 620, 96, '#fff', '#000', 14, '400', 'Anton');
  const k = eo(clamp((u - .35) * 4)); if (k > 0) { ctx.save(); ctx.translate(540, 1000); ctx.rotate(-.15); ctx.scale(1.6 - .6 * k, 1.6 - .6 * k); ctx.globalAlpha = k; ctx.strokeStyle = '#ff3a3a'; ctx.lineWidth = 18; ctx.beginPath(); ctx.roundRect(-300, -110, 600, 220, 30); ctx.stroke(); txt('MYTH', 0, 60, 170, '#ff3a3a', 'rgba(0,0,0,.5)', 10, '400', 'Anton'); ctx.restore(); }
}
// nerve cable; o.press: weight squishing it; o.block: pulses stop; o.chaos: hyperactive firing; o.release: weight lifts
function nerve(u, s, o) {
  bgDeep(s, ['#1a2240', '#080a16']); const cy = 1100, rel = o.release ? eio(clamp((s - .3) / .9)) : 0, pr = (o.press ? eio(clamp(s / .8)) : 0) * (1 - rel);
  const pts = []; for (let x = -300; x <= 1400; x += 10) { const d = (x - 540) / 140, sq = Math.exp(-d * d) * pr; pts.push([x, cy + Math.sin(x * .006 + s) * 10, 1 - .7 * sq]); }
  const band = (w, col) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - w * p[2]) : ctx.moveTo(p[0], p[1] - w * p[2])); for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + w * pts[i][2]); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  band(90, '#c8a44a'); band(70, '#f2d27a'); for (let f = -2; f <= 2; f++) { ctx.strokeStyle = 'rgba(160,120,40,.5)'; ctx.lineWidth = 5; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] + f * 24 * p[2]) : ctx.moveTo(p[0], p[1] + f * 24 * p[2])); ctx.stroke(); }
  ctx.textAlign = 'left'; label('BRAIN ←', 120, cy - 150, 46, '#cfe0ff', 'left'); ctx.textAlign = 'right'; label('→ TOES', 960, cy - 150, 46, '#cfe0ff', 'right');
  const pulse = (x, col, r = 80) => { const y = cy + Math.sin(x * .006 + s) * 10; spark(x, y, r, .95, col); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); };
  if (o.chaos) { const R = RN(11); for (let i = 0; i < 26; i++) { const sp = 300 + R() * 900, dir = R() < .5 ? 1 : -1, x = ((R() * 1700 + dir * s * sp) % 1700 + 1700) % 1700 - 300; pulse(x, i % 2 ? '255,230,120' : '255,140,90', 60 + R() * 60); }
    pins(540, cy, 1100, 320, 30, s, .9, 8); ctx.textAlign = 'center'; txt('TINGLE!!', 540 + Math.sin(s * 30) * 6, 640, 150, '#ffd23f', '#8c0e18', 22, '400', 'Anton'); }
  else { for (let k = 0; k < 4; k++) { for (const dir of [1, -1]) { let x = dir > 0 ? ((s * 420 + k * 425) % 1700) - 300 : 1400 - ((s * 420 + k * 425 + 200) % 1700); const blocked = o.block && pr > .5; if (blocked && ((dir > 0 && x > 440) || (dir < 0 && x < 640))) continue; pulse(x, dir > 0 ? '200,230,255' : '255,230,160'); } } }
  if (pr > .01) { const wy = cy - 90 * (1 - .7 * pr) - 360; ctx.fillStyle = '#4a4a56'; ctx.beginPath(); ctx.roundRect(390, wy, 300, 360, 30); ctx.fill(); ctx.fillStyle = '#5a5a66'; ctx.fillRect(390, wy, 300, 60); ctx.textAlign = 'center'; txt('PRESSURE', 540, wy + 230, 60, '#fff', '#000', 8, '400', 'Anton');
    for (const d of [-1, 1]) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(540 + d * 200, wy - 120); ctx.lineTo(540 + d * 200, wy - 30); ctx.lineTo(540 + d * 180, wy - 60); ctx.stroke(); } }
  if (o.block && pr > .5) { ctx.save(); ctx.globalAlpha = clamp((pr - .5) * 3); ctx.strokeStyle = '#ff3a3a'; ctx.lineWidth = 20; ctx.beginPath(); ctx.arc(540, cy + 190, 60, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(498, cy + 148); ctx.lineTo(582, cy + 232); ctx.stroke(); ctx.restore(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 600, 110, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function bodyLine(u, s) {                                                        // brain → spine → toes wiring, messages both ways
  bgDeep(s, ['#1a2240', '#080a16']); const P = [[540, 600], [540, 780], [540, 1060], [500, 1160], [480, 1400], [470, 1640], [560, 1720]];
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.arc(540, 600, 130, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(400, 740, 280, 420, 90); ctx.fill(); tube([[490, 1160], [470, 1700]], 110, 'rgba(255,255,255,.08)'); tube([[590, 1160], [610, 1700]], 110, 'rgba(255,255,255,.08)');
  ctx.fillStyle = '#e8a0b0'; ctx.beginPath(); ctx.ellipse(540, 580, 90, 70, 0, 0, TAU); ctx.fill(); tube(P, 16, '#f2d27a');
  const at = ph => { const n = P.length - 1, f = ph * n, i = Math.min(n - 1, Math.floor(f)), t = f - i; return [lerp(P[i][0], P[i + 1][0], t), lerp(P[i][1], P[i + 1][1], t)]; };
  for (let k = 0; k < 3; k++) { let p = at((s * .7 + k / 3) % 1); spark(p[0], p[1], 70, .95, '200,230,255'); p = at(1 - (s * .7 + k / 3 + .15) % 1); spark(p[0], p[1], 70, .95, '255,220,140'); }
  ctx.textAlign = 'left'; label('BRAIN', 660, 590, 50, '#e8a0b0', 'left'); label('TOES', 640, 1740, 50, '#f2d27a', 'left');
  ctx.textAlign = 'center'; txt('ELECTRICAL CABLES', 540, 470, 90, '#ffd23f', '#000', 14, '400', 'Anton');
}
