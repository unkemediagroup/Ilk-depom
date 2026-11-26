// ===== 20.video — HOLDING IN A SNEEZE (portrait world 1080×1920); needs sun-sneeze faceSide/sunGlow =====
function gauge2(x, y, r, v, lab, s) {                                            // half-dial gauge, v 0..1
  ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, TAU); ctx.stroke();
  const g = ctx.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, '#5ad07a'); g.addColorStop(.6, '#ffd23f'); g.addColorStop(1, '#ff3a3a'); ctx.strokeStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, Math.PI + Math.PI * v); ctx.stroke();
  const a = Math.PI + Math.PI * v + (v > .9 ? Math.sin(s * 40) * .04 : 0); tube([[0, 0], [Math.cos(a) * (r - 30), Math.sin(a) * (r - 30)]], 14, '#fff'); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill();
  ctx.textAlign = 'center'; label(lab, 0, 70, 40, '#fff'); ctx.restore(); }
function holdFace(u, s, o) {                                                     // side face pinching nose + clamping mouth; pressure rising
  bgDeep(s, ['#2a1a2a', '#0e080e']); const p = typeof o.p === 'function' ? o.p(u) : (o.p || 0), sh = p > .7 ? (p - .7) * 30 : 0;
  ctx.save(); ctx.translate(Math.sin(s * 50) * sh, Math.cos(s * 43) * sh);
  faceSide(420, 1080, 1.2, s, { squint: p > .3 ? 1 : 0 });
  ctx.fillStyle = `rgba(255,60,80,${.15 + .5 * p})`; ctx.beginPath(); ctx.ellipse(560, 1150, 110 + p * 30, 80 + p * 20, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#d29a78'; ctx.beginPath(); ctx.roundRect(640, 1070, 130, 70, 30); ctx.fill(); ctx.beginPath(); ctx.roundRect(650, 1160, 120, 60, 30); ctx.fill();
  tube([[760, 1130], [880, 1300], [900, 1500]], 90, '#d29a78'); ctx.fillStyle = '#c9886a'; ctx.beginPath(); ctx.roundRect(610, 1250, 190, 150, 60); ctx.fill(); tube([[760, 1380], [860, 1550], [870, 1800]], 100, '#3a7ac8');
  ctx.restore();
  if (o.gauge) gauge2(540, 640, 200, p, 'HEAD PRESSURE', s);
  if (o.bomb) { const k = eo(clamp(u * 3)); ctx.save(); ctx.translate(820, 640); ctx.scale(k, k); ctx.fillStyle = '#1a1a22'; ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.fill(); ctx.fillStyle = '#3a3a44'; ctx.fillRect(-30, -140, 60, 40); tube([[0, -140], [30, -200], [80, -210]], 10, '#c8a060'); spark(80, -210, 60 + 20 * Math.sin(s * 30), .95, '255,200,80'); ctx.restore(); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 480, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function speedSneeze(u, s) {                                                     // full sneeze blast + speedometer 100+ mph
  bgDeep(s, ['#1e2a3a', '#0a1016']); const d = s - .6, ach = d >= 0 ? Math.exp(-Math.pow((d - .25) * 3, 2)) : 0;
  faceSide(360, 1080, 1.1, s, { pre: d < 0 ? 1 : 0, achoo: ach });
  if (d > 0) { const R = RN(4), k = clamp(d * 1.2); for (let i = 0; i < 80; i++) { const a = -.45 + (R() - .5) * .9, r = k * (100 + R() * 1100); ctx.fillStyle = `rgba(200,235,255,${(1 - k * .7) * .9})`; ctx.beginPath(); ctx.arc(600 + Math.cos(a) * r, 1270 + Math.sin(a) * r, 5 + R() * 12, 0, TAU); ctx.fill(); }
    for (let i = 0; i < 6; i++) { const y = 1180 + i * 40, x0 = 640 + ((s * 1400 + i * 170) % 700); tube([[x0, y], [x0 + 160, y - 40]], 8, 'rgba(255,255,255,.6)'); } }
  const v = clamp(d * 1.5); gauge2(540, 640, 200, v * .95, 'AIR SPEED', s); ctx.textAlign = 'center'; txt(Math.round(v * 100) + (v > .99 ? '+' : '') + ' MPH', 820, 820, 90, '#ffd23f', '#000', 14, '400', 'Anton');
}
// side head showing airways; o.mode: 'out' (normal sneeze exits) | 'back' (blocked: air forced into sinuses & ear tubes)
function airHead(u, s, o) {
  bgDeep(s, ['#2a1424', '#0e060c']); const p = o.mode === 'back' ? .5 + .5 * Math.sin(s * 8) : 0;
  ctx.fillStyle = '#e8b896'; ctx.beginPath(); ctx.moveTo(140, 400); ctx.bezierCurveTo(500, 220, 800, 360, 820, 640); ctx.lineTo(950, 980); ctx.quadraticCurveTo(960, 1030, 860, 1050); ctx.lineTo(860, 1120); ctx.quadraticCurveTo(900, 1200, 800, 1260); ctx.quadraticCurveTo(600, 1420, 360, 1380); ctx.lineTo(260, 1700); ctx.lineTo(-100, 1700); ctx.lineTo(-100, 500); ctx.closePath(); ctx.fill();
  const sin = [[600, 640, 90, 60], [640, 900, 80, 70]], ear = [200, 900];
  for (const [x, y, rx, ry] of sin) { ctx.fillStyle = o.mode === 'back' ? `rgba(255,${Math.round(120 - 60 * p)},80,.85)` : 'rgba(200,120,120,.5)'; ctx.beginPath(); ctx.ellipse(x, y, rx * (1 + .15 * p), ry * (1 + .15 * p), 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#b8605a'; ctx.beginPath(); ctx.moveTo(560, 960); ctx.quadraticCurveTo(860, 960, 920, 1020); ctx.quadraticCurveTo(760, 1080, 560, 1060); ctx.closePath(); ctx.fill();
  tube([[540, 1020], [420, 1100], [400, 1400], [380, 1700]], 60, '#b8605a'); tube([[470, 1020], [300, 960], ear], 22, o.mode === 'back' ? '#ff6a5a' : '#c87a7a');
  ctx.fillStyle = '#c98a68'; ctx.beginPath(); ctx.ellipse(ear[0], ear[1], 50, 80, 0, 0, TAU); ctx.fill(); if (o.mode === 'back') { ctx.strokeStyle = `rgba(255,60,60,${.5 + .5 * p})`; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(ear[0], ear[1], 60 + p * 20, 90 + p * 20, 0, 0, TAU); ctx.stroke(); }
  const flow = (P, col, rev) => { const ph = (s * 1.4) % 1; for (let k = 0; k < 3; k++) { const f = (ph + k / 3) % 1, t = rev ? 1 - f : f, n = P.length - 1, ff = t * n, i = Math.min(n - 1, Math.floor(ff)), tt = ff - i; spark(lerp(P[i][0], P[i + 1][0], tt), lerp(P[i][1], P[i + 1][1], tt), 70, .95, col); } };
  if (o.mode === 'out') { flow([[400, 1500], [420, 1100], [700, 1010], [1100, 1000]], '200,235,255'); flow([[400, 1500], [440, 1150], [780, 1180], [1100, 1240]], '200,235,255'); ctx.textAlign = 'center'; label('100+ MPH →', 900, 900, 50, '#cfe0ff'); }
  if (o.mode === 'back') { flow([[400, 1500], [440, 1100], [640, 900]], '255,120,80'); flow([[400, 1500], [460, 1060], [600, 640]], '255,120,80'); flow([[400, 1500], [470, 1020], [300, 960], ear], '255,120,80');
    for (const [x, y] of [[930, 1010], [870, 1190]]) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#ff3a3a'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-40, -40); ctx.lineTo(40, 40); ctx.moveTo(40, -40); ctx.lineTo(-40, 40); ctx.stroke(); ctx.restore(); }
    ctx.textAlign = 'center'; label('SINUSES', 640, 540, 44, '#ffb0a0'); label('EUSTACHIAN TUBE', 300, 820, 40, '#ffb0a0'); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, o.ty || 1520 - 1100, o.size || 100, o.col || '#ffd23f', '#000', 16, '400', 'Anton'); }
}
function risks(u, s) {                                                           // possible damage list
  bgDeep(s, ['#3a1418', '#12060a']); const L = [['EARDRUMS', 'can rupture'], ['EYE VESSELS', 'can pop'], ['THROAT', 'can be damaged'], ['RIB', 'rare: fracture'], ['BRAIN', 'rare: aneurysm']];
  L.forEach(([t, d], i) => { const k = eo(clamp(u * 4 - i * .6)), y = 450 + i * 150; ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 300, 0); ctx.fillStyle = i > 2 ? 'rgba(255,60,60,.14)' : 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(90, y - 62, 900, 124, 30); ctx.fill(); ctx.fillStyle = '#ff5a5a'; ctx.beginPath(); ctx.arc(170, y, 34, 0, TAU); ctx.fill(); ctx.textAlign = 'center'; txt('!', 170, y + 22, 60, '#fff', 'rgba(0,0,0,0)', 0, '400', 'Anton'); ctx.textAlign = 'left'; txt(t, 240, y + 20, 70, '#fff', '#000', 12, '400', 'Anton'); ctx.textAlign = 'right'; label(d, 960, y + 14, 36, i > 2 ? '#ff9a9a' : '#ffd0c0', 'right'); ctx.restore(); });
}
function elbow(u, s) {                                                           // sneeze into your elbow: safe
  bgDeep(s, ['#14304a', '#08121c']); const d = s - .5, ach = d >= 0 ? Math.exp(-Math.pow((d - .25) * 3, 2)) : 0;
  faceSide(380, 1080, 1.1, s, { pre: d < 0 ? 1 : 0, achoo: ach });
  tube([[200, 1700], [420, 1450], [700, 1300]], 130, '#3a7ac8'); tube([[700, 1300], [760, 1150], [640, 1080]], 120, '#3a7ac8'); ctx.fillStyle = '#d29a78'; ctx.beginPath(); ctx.arc(640, 1080, 60, 0, TAU); ctx.fill();
  if (d > 0) { const R = RN(4), k = clamp(d * 2); for (let i = 0; i < 40; i++) { const a = -.4 + (R() - .5) * 1.4, r = k * (40 + R() * 120); ctx.fillStyle = `rgba(200,235,255,${(1 - k) * .9})`; ctx.beginPath(); ctx.arc(640 + Math.cos(a) * r * .5, 1250 + Math.sin(a) * r * .5, 5 + R() * 8, 0, TAU); ctx.fill(); } }
  const k2 = eo(clamp(u * 2 - .6)); ctx.save(); ctx.globalAlpha = k2; ctx.strokeStyle = '#7aff9a'; ctx.lineWidth = 24; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(760, 560); ctx.lineTo(830, 630); ctx.lineTo(960, 480); ctx.stroke(); ctx.restore();
  ctx.textAlign = 'center'; txt('LET IT OUT!', 460, 560, 100, '#7aff9a', '#000', 16, '400', 'Anton');
}
