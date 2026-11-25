// ===== 9.video — TIME SLOWS IN DANGER (portrait) =====
function carCrash(u, s, o) {
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#1a2a3a'); g.addColorStop(.6, '#2a3a4a'); g.addColorStop(.62, '#2a2a2e'); g.addColorStop(1, '#141416'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.strokeStyle = 'rgba(255,220,100,.6)'; ctx.lineWidth = 12; ctx.setLineDash([60, 50]); ctx.beginPath(); ctx.moveTo(-200, 1500); ctx.lineTo(1300, 1500); ctx.stroke(); ctx.setLineDash([]);
  const slow = o.slow ? .12 : 1, ph = clamp(o.slow ? .55 + u * .1 : u * 1.2), x = lerp(-500, 520, ph), impact = clamp((ph - .8) / .2);
  const car = (cx, col, d) => { ctx.save(); ctx.translate(cx, 1330); ctx.scale(d, 1); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-220, -40, 440, 110, 30); ctx.fill(); ctx.beginPath(); ctx.roundRect(-120, -120, 240, 100, 40); ctx.fill(); ctx.fillStyle = 'rgba(180,220,255,.6)'; ctx.fillRect(-100, -105, 90, 70); ctx.fillRect(10, -105, 90, 70); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-130, 75, 50, 0, TAU); ctx.arc(130, 75, 50, 0, TAU); ctx.fill(); spark(220, 0, 80, .8, '255,250,200'); ctx.restore(); };
  car(1140 - (x + 500) * .35, '#3a6ac8', -1); car(x, '#c43a3a', 1);
  if (impact > 0) { spark(760, 1300, 400 * impact, .8, '255,240,200'); const R = RN(5); for (let i = 0; i < 40; i++) { const a = R() * TAU, d = impact * (100 + R() * 500); ctx.fillStyle = 'rgba(220,240,255,.85)'; ctx.save(); ctx.translate(760 + Math.cos(a) * d, 1300 + Math.sin(a) * d * .6); ctx.rotate(a + s * slow); ctx.fillRect(-14, -6, 28, 12); ctx.restore(); } }
  if (o.slow) { ctx.textAlign = 'center'; txt('SLOW MOTION', 640, 960, 100, '#fff', '#000', 16, '400', 'Anton'); txt('0.1×', 640, 1080, 90, '#ffd23f', '#000', 14, '400', 'Anton'); }
}
function camNo(u, s) {
  bgDeep(s, ['#1e2232', '#0c0e16']); ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.roundRect(240, 760, 520, 360, 40); ctx.fill(); ctx.fillStyle = '#3a3a44'; ctx.beginPath(); ctx.moveTo(760, 860); ctx.lineTo(900, 780); ctx.lineTo(900, 1100); ctx.lineTo(760, 1020); ctx.closePath(); ctx.fill();
  const lg = ctx.createRadialGradient(470, 940, 10, 470, 940, 140); lg.addColorStop(0, '#5a8aff'); lg.addColorStop(1, '#0a0a14'); ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(470, 940, 130, 0, TAU); ctx.fill(); ctx.fillStyle = '#e0303a'; ctx.beginPath(); ctx.arc(700, 810, 20 * (.6 + .4 * Math.sin(s * 8)), 0, TAU); ctx.fill();
  ctx.textAlign = 'center'; txt('1000 FPS?', 540, 560, 120, '#fff', '#000', 16, '400', 'Anton'); const a = clamp(u * 3 - .6); ctx.save(); ctx.globalAlpha = a; tube([[200, 700], [900, 1200]], 30, '#ff5a5a'); tube([[900, 700], [200, 1200]], 30, '#ff5a5a'); ctx.restore();
}
function funnel(u, s, o) {                                                     // normal brain filters; in danger everything goes through
  bgDeep(s, ['#1a2a3a', '#0a121a']); const open = o.danger ? 1 : 0;
  ctx.fillStyle = 'rgba(200,220,240,.18)'; ctx.beginPath(); ctx.moveTo(140, 700); ctx.lineTo(940, 700); ctx.lineTo(540 + 80 + open * 220, 1150); ctx.lineTo(540 - 80 - open * 220, 1150); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(200,220,240,.6)'; ctx.lineWidth = 6; ctx.stroke();
  const R = RN(3); for (let i = 0; i < 70; i++) { const ph = (s * .45 + R()) % 1, keep = o.danger || i % 7 === 0, x0 = 140 + R() * 800, y = lerp(300, keep ? 1650 : 1100, ph); const x = y < 700 ? x0 : lerp(x0, 540 + (R() - .5) * (160 + open * 400), clamp((y - 700) / 450)); if (!keep && y > 1050) continue; ctx.fillStyle = ['#ffd23f', '#8ec5ff', '#ff8a8a', '#9effd0'][i % 4]; ctx.beginPath(); ctx.arc(x, y, keep ? 13 : 10, 0, TAU); ctx.fill(); }
  ctx.textAlign = 'center'; txt(o.danger ? 'DANGER: RECORD EVERYTHING' : 'NORMAL: FILTER IT OUT', 540, 560, 80, o.danger ? '#ff6a6a' : '#fff', '#000', 14, '400', 'Anton');
}
function filmStrip(u, s, o) {                                                  // memory density: few frames vs a dense reel
  bgDeep(s, ['#221a30', '#0e0a16']); const n = o.dense ? 14 : 4, h = 1000 / n;
  ctx.fillStyle = '#111'; ctx.fillRect(330, 420, 420, 1060); for (let i = 0; i < 26; i++) { ctx.fillStyle = '#333'; ctx.fillRect(345, 430 + i * 40, 24, 20); ctx.fillRect(711, 430 + i * 40, 24, 20); }
  const off = (s * 120) % h; ctx.save(); ctx.beginPath(); ctx.rect(380, 440, 320, 1020); ctx.clip(); for (let i = -1; i < n + 1; i++) { const y = 440 + i * h + off; const sc = SCN[(i + 8) % 4]; ctx.fillStyle = sc.sky; ctx.fillRect(390, y + 6, 300, h - 12); ctx.fillStyle = sc.ground; ctx.fillRect(390, y + 6 + (h - 12) * .65, 300, (h - 12) * .35); ctx.fillStyle = sc.obj; ctx.beginPath(); ctx.arc(540, y + h * .45, Math.min(h * .25, 60), 0, TAU); ctx.fill(); } ctx.restore();
  ctx.textAlign = 'center'; txt(o.dense ? 'DENSE MEMORY' : 'NORMAL MEMORY', 540, 1610, 90, o.dense ? '#ffd23f' : '#fff', '#000', 14, '400', 'Anton'); if (o.dense && u > .4) txt('= FEELS LONGER', 540, 1730, 90, '#ffd23f', '#000', 14, '400', 'Anton');
}
