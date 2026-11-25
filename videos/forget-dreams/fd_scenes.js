// ===== 8.video — FORGETTING DREAMS (portrait) =====
function countdown(u, s) {
  bgDeep(s, ['#1a1a3a', '#08081a']); const n = Math.max(0, Math.round(60 - u * 60)), k = 1 - u;
  ctx.save(); ctx.globalAlpha = .25 + .75 * k; const cl = ctx.createRadialGradient(540, 760, 40, 540, 760, 420); cl.addColorStop(0, 'rgba(230,220,255,.95)'); cl.addColorStop(1, 'rgba(180,170,240,0)'); ctx.fillStyle = cl; ctx.fillRect(100, 340, 880, 840); clockMini(540, 720, 90 * (.5 + k), s); ctx.fillStyle = '#e2a040'; ctx.beginPath(); ctx.ellipse(380, 860, 70 * k + 10, 34 * k + 6, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(540, 760, 380, -Math.PI / 2, -Math.PI / 2 + TAU * k); ctx.stroke();
  ctx.textAlign = 'center'; txt(n + 's', 540, 1360, 220, '#fff', '#3a1a5a', 24, '400', 'Anton');
}
function neBar(u, s) {
  bgDeep(s, ['#14202e', '#0a1018']); const k = eio(clamp(u * 1.5)); const bar = (x, h, col, lab) => { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x - 110, 600, 220, 760); ctx.fillStyle = col; ctx.fillRect(x - 110, 1360 - h, 220, h); ctx.textAlign = 'center'; txt(lab, x, 1440, 60, '#fff', '#000', 10, '400', 'Anton'); };
  bar(300, 700 * k, '#ffd27a', 'AWAKE'); bar(780, 20 * k, '#a8c4f0', 'REM SLEEP'); ctx.textAlign = 'center'; txt('NOREPINEPHRINE', 540, 548, 90, '#ffd23f', '#000', 14, '400', 'Anton'); if (u > .5) txt('≈ 0', 780, 1240, 110, '#a8c4f0', '#000', 14, '400', 'Anton');
}
function transfer(u, s) {
  bgDeep(s, ['#221a30', '#0e0a16']); const box = (y, lab, col) => { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(160, y - 160, 760, 320, 40); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.stroke(); ctx.textAlign = 'center'; txt(lab, 540, y + 25, 80, col, '#000', 12, '400', 'Anton'); };
  box(560, 'SHORT-TERM', '#a8c4f0'); box(1260, 'PERMANENT STORAGE', '#ffd27a');
  for (let i = 0; i < 5; i++) { const ph = (s * .8 + i / 5) % 1, y = lerp(740, 960, ph); ctx.fillStyle = `rgba(200,220,255,${1 - ph})`; ctx.beginPath(); ctx.arc(480 + i * 30, y, 14, 0, TAU); ctx.fill(); }
  const a = clamp(u * 3 - .5); ctx.save(); ctx.globalAlpha = a; tube([[420, 870], [660, 1030]], 26, '#ff5a5a'); tube([[660, 870], [420, 1030]], 26, '#ff5a5a'); ctx.restore();
}
function pfcOff(u, s, o) { brain3d(u, s, { glows: [[150, 40, 200, 0]] }); const off = eio(clamp(u * 2)); ctx.save(); brainShape(960, 570, 1.25); ctx.clip(); ctx.fillStyle = `rgba(10,10,30,${.55 * off})`; ctx.fillRect(400, 0, 420, 1100); ctx.restore(); ctx.textAlign = 'center'; txt('PREFRONTAL CORTEX', 700, 130, 72, '#fff', '#000', 12, '400', 'Anton'); txt(off > .5 ? 'OFFLINE' : '…', 700, 230, 96, '#ff6a6a', '#000', 14, '400', 'Anton'); }
function notebook(u, s) {
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#2a2030'); g.addColorStop(1, '#100a12'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.save(); ctx.translate(540, 1000); ctx.rotate(-.06); ctx.fillStyle = '#f6f0e2'; ctx.beginPath(); ctx.roundRect(-380, -480, 760, 960, 20); ctx.fill(); ctx.strokeStyle = 'rgba(120,150,200,.4)'; ctx.lineWidth = 3; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.moveTo(-340, -380 + i * 62); ctx.lineTo(340, -380 + i * 62); ctx.stroke(); }
  const lines = ['MY DREAM:', 'flying over a city', 'a giant clock…', 'my old school'], prog = clamp(u * 1.3) * 4; ctx.fillStyle = '#1a2a6a'; ctx.font = '800 44px Montserrat'; ctx.textAlign = 'left'; lines.forEach((l, i) => { const c = clamp(prog - i); if (c > 0) ctx.fillText(l.slice(0, Math.floor(l.length * c)), -320, -330 + i * 124); });
  const li = Math.min(3, Math.floor(prog)), lc = clamp(prog - li), px = -320 + ctx.measureText(lines[li].slice(0, Math.floor(lines[li].length * lc))).width, py = -330 + li * 124; ctx.restore();
  ctx.save(); ctx.translate(540, 1000); ctx.rotate(-.06); ctx.translate(px, py - 10); ctx.rotate(.6); ctx.fillStyle = '#e0a020'; ctx.fillRect(-14, -300, 28, 300); ctx.fillStyle = '#f2d2a0'; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.lineTo(0, 36); ctx.closePath(); ctx.fill(); ctx.restore();
}
function slateWipe(u, s) {
  bgDeep(s, ['#1e2232', '#0c0e16']); const w = eio(clamp(u * 1.9)), ex = lerp(-100, 1250, w);
  ctx.save(); ctx.beginPath(); ctx.rect(ex, 0, 2000, 1920); ctx.clip(); polaroid(540, 900, 640, -.04, SCN[1]); ctx.restore();
  ctx.fillStyle = '#c8a06a'; ctx.beginPath(); ctx.roundRect(ex - 90, 600, 180, 600, 30); ctx.fill(); ctx.fillStyle = '#5a6aa8'; ctx.fillRect(ex - 90, 1000, 180, 200);
  if (w > .9) { ctx.textAlign = 'center'; txt('READY FOR', 540, 860, 110, '#fff', '#000', 16, '400', 'Anton'); txt('REAL-WORLD INFO', 540, 1000, 110, '#ffd23f', '#000', 16, '400', 'Anton'); }
}
