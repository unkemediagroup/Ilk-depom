// ===== 13.video — YOUR VOICE ON RECORDINGS (portrait world 1080×1920); needs sun-sneeze faceSide =====
function waveform(x, y, w, h, s, low, col) { ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const t = i / 120, xx = x + t * w, env = Math.sin(t * Math.PI), f = low ? 6 : 18, v = Math.sin(t * f * TAU + s * 8) * (low ? 1 : .55) + Math.sin(t * f * 3.1 * TAU - s * 11) * (low ? .25 : .45); i ? ctx.lineTo(xx, y + v * h * env) : ctx.moveTo(xx, y + v * h * env); } ctx.stroke(); }
function phoneRec(u, s, o) {
  bgDeep(s, ['#1a2a3a', '#080e16']);
  ctx.save(); ctx.translate(540, 1080); ctx.scale(.8, .8); ctx.rotate(-.06 + Math.sin(s * 1.2) * .03); ctx.fillStyle = '#0c0d10'; ctx.beginPath(); ctx.roundRect(-260, -480, 520, 960, 70); ctx.fill(); ctx.strokeStyle = '#3a3a44'; ctx.lineWidth = 8; ctx.stroke();
  const sg = ctx.createLinearGradient(0, -440, 0, 440); sg.addColorStop(0, '#2a3a6a'); sg.addColorStop(1, '#141a30'); ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(-230, -440, 460, 880, 50); ctx.fill();
  ctx.fillStyle = '#ff4a5a'; ctx.beginPath(); ctx.arc(0, -300, 50, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-14, -330, 28, 50, 14); ctx.fill(); ctx.textAlign = 'center'; label('VOICE MEMO', 0, -200, 36, '#fff');
  ctx.save(); ctx.beginPath(); ctx.rect(-220, -150, 440, 300); ctx.clip(); waveform(-220, 0, 440, 110, s, false, '#7ad0ff'); ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-180, 250, 360, 10); ctx.fillStyle = '#7ad0ff'; ctx.fillRect(-180, 250, 360 * ((u * .9) % 1), 10); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-30, 320); ctx.lineTo(40, 360); ctx.lineTo(-30, 400); ctx.closePath(); ctx.fill(); ctx.restore();
  for (let i = 0; i < 3; i++) { const ph = (s * .8 + i / 3) % 1; ctx.strokeStyle = `rgba(122,208,255,${.7 * (1 - ph)})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(540, 1080, 460 + ph * 220, -.6, .6); ctx.stroke(); ctx.beginPath(); ctx.arc(540, 1080, 460 + ph * 220, Math.PI - .6, Math.PI + .6); ctx.stroke(); }
  if (o.text) { const k = eo(clamp(u * 4)); ctx.save(); ctx.translate(540 + Math.sin(s * 22) * (o.shake ? 6 : 0), 560); ctx.scale(.6 + .4 * k, .6 + .4 * k); ctx.textAlign = 'center'; txt(o.text, 0, 0, 120, o.col || '#ffd23f', '#000', 18, '400', 'Anton'); ctx.restore(); }
}
function airWaves(x0, y0, x1, y1, s, col, n = 5) { const d = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0); for (let i = 0; i < n; i++) { const ph = (s * .7 + i / n) % 1; ctx.save(); ctx.translate(x0 + Math.cos(a) * d * ph, y0 + Math.sin(a) * d * ph); ctx.rotate(a); ctx.strokeStyle = `rgba(${col},${.9 * Math.sin(ph * Math.PI)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(-40, 0, 60 + ph * 40, -.7, .7); ctx.stroke(); ctx.restore(); } }
function speakerListener(u, s, o) {                                              // you talk; a friend hears you through the air
  bgDeep(s, ['#1e2a3a', '#0a1016']);
  for (const [x, col, d] of [[250, '#3a7ac8', 1], [830, '#c84a6a', -1]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - 120, 1060, 240, 400, 80); ctx.fill(); ctx.fillStyle = '#d9a07a'; ctx.beginPath(); ctx.arc(x, 940, 105, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.arc(x, 920, 108, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    ctx.fillStyle = '#3a2216'; ctx.beginPath(); ctx.arc(x + d * 50, 935, 11, 0, TAU); ctx.fill(); if (d > 0) { ctx.beginPath(); ctx.ellipse(x + d * 66, 990, 18, 8 + (Math.sin(s * 10) > 0 ? 10 : 0), 0, 0, TAU); ctx.fill(); } else { ctx.strokeStyle = '#3a2216'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x - 80, 995); ctx.quadraticCurveTo(x - 60, 1005, x - 40, 995); ctx.stroke(); }
    ctx.fillStyle = '#c98a68'; ctx.beginPath(); ctx.ellipse(x - d * 70, 950, 26, 40, 0, 0, TAU); ctx.fill(); }
  if (o.waves) { airWaves(330, 990, 860, 950, s, '122,208,255', 6); const v = Math.sin(s * 30) * 10; ctx.fillStyle = '#ffd23f'; spark(900, 950, 90, .5 + .3 * Math.sin(s * 30), '255,210,63'); ctx.textAlign = 'center'; label('EARDRUM', 900, 840, 40, '#ffd23f'); }
  if (o.q) { ctx.textAlign = 'center'; txt('?', 250 + Math.sin(s * 3) * 10, 720, 160, '#ffd23f', '#000', 18, '400', 'Anton'); }
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 560, 96, '#fff', '#000', 14, '400', 'Anton'); }
}
// side head with the two hearing paths: air (blue, mouth → around → ear) and bone (orange, through the skull)
function twoPaths(u, s, o) {
  const HY = 1150;
  bgDeep(s, ['#2a1a2a', '#0e080e']); faceSide(470, HY, 1.15, s, {});
  const mx = 470 + 215 * 1.15, my = HY + 175 * 1.15, ex = 470 - 210 * 1.15, ey = HY - 40 * 1.15, air = o.mode !== 'bone', bone = o.mode !== 'air' && o.mode !== 'rec';
  if (air) { const P = []; for (let i = 0; i <= 30; i++) { const t = i / 30, a = lerp(.4, -Math.PI * .9, t), r = 420 + Math.sin(t * Math.PI) * 120; P.push([470 + 40 + Math.cos(a) * r, HY + 40 + Math.sin(a) * r * .9]); } ctx.save(); ctx.setLineDash([30, 24]); ctx.lineDashOffset = -s * 120; tube(P, 12, o.mode === 'air' || o.mode === 'rec' ? 'rgba(122,208,255,.95)' : 'rgba(122,208,255,.7)'); ctx.restore(); const ph = (s * .6) % 1, q = P[Math.floor(ph * 30)]; spark(q[0], q[1], 80, .95, '122,208,255'); ctx.textAlign = 'center'; label('AIR', P[15][0], P[15][1] - 50, 52, '#7ad0ff'); }
  if (bone || o.mode === 'rec') { ctx.save(); ctx.beginPath(); ctx.ellipse(470 - 60, HY - 60, 330, 360, 0, 0, TAU); ctx.clip(); const al = o.mode === 'rec' ? .25 : 1; for (let i = 0; i < 6; i++) { const ph = (s * 1.1 + i / 6) % 1; ctx.strokeStyle = `rgba(255,150,70,${al * .9 * (1 - ph)})`; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(mx - 60, my - 60, 40 + ph * 520, 0, TAU); ctx.stroke(); } ctx.restore();
    ctx.textAlign = 'center'; if (o.mode !== 'rec') label('BONE', 420, 1300, 52, '#ffa060'); }
  if (o.mode === 'rec') { ctx.save(); ctx.translate(380, 1000); ctx.globalAlpha = eo(clamp(u * 3)); tube([[-220, -220], [220, 220]], 34, '#ff3a3a'); tube([[220, -220], [-220, 220]], 34, '#ff3a3a'); ctx.restore(); }
  spark(ex, ey, 130, .5 + .3 * Math.sin(s * 12), bone && air ? '255,220,150' : air ? '122,208,255' : '255,150,70');
  if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 560, o.size || 96, '#ffd23f', '#000', 14, '400', 'Anton'); }
}
function freqBars(u, s, o) {                                                     // equalizer: bone conduction boosts the lows
  bgDeep(s, ['#2a1a10', '#0e0806']); const n = 12, k = eio(clamp(u * 2 - .2));
  for (let i = 0; i < n; i++) { const low = 1 - i / (n - 1), base = 160 + 60 * Math.sin(s * 6 + i * 1.3), boost = low * low * 520 * k, h = base + boost, x = 130 + i * 72;
    const g = ctx.createLinearGradient(0, 1250 - h, 0, 1250); g.addColorStop(0, low > .5 ? '#ffa060' : '#7ad0ff'); g.addColorStop(1, 'rgba(255,255,255,.15)'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, 1250 - h, 52, h, 14); ctx.fill(); }
  ctx.textAlign = 'left'; label('LOW', 130, 1320, 44, '#ffa060', 'left'); ctx.textAlign = 'right'; label('HIGH', 950, 1320, 44, '#7ad0ff', 'right');
  ctx.textAlign = 'center'; txt(o.text || 'LOW FREQUENCIES ↑', 540, 560, 96, '#ffa060', '#000', 14, '400', 'Anton');
}
function compare(u, s) {                                                         // in your head (deep) vs recording (thin)
  bgDeep(s, ['#1a1a2a', '#08080e']);
  ctx.fillStyle = 'rgba(255,160,96,.12)'; ctx.beginPath(); ctx.roundRect(90, 600, 900, 320, 40); ctx.fill(); ctx.fillStyle = 'rgba(122,208,255,.12)'; ctx.beginPath(); ctx.roundRect(90, 980, 900, 320, 40); ctx.fill();
  waveform(140, 780, 800, 120, s, true, '#ffa060'); waveform(140, 1160, 800, 70, s, false, '#7ad0ff');
  ctx.textAlign = 'left'; label('IN YOUR HEAD', 130, 650, 44, '#ffa060', 'left'); label('ON A RECORDING', 130, 1030, 44, '#7ad0ff', 'left');
  const W = ['DEEPER', 'RICHER', 'WARMER'], i = Math.min(2, Math.floor(u * 3.6)), a = eo(clamp((u * 3.6 - i) * 3)); ctx.save(); ctx.translate(540, 500); ctx.scale(.6 + .4 * a, .6 + .4 * a); ctx.textAlign = 'center'; txt(W[i], 0, 0, 130, '#ffd23f', '#000', 18, '400', 'Anton'); ctx.restore();
}
