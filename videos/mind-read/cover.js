// YT Shorts kapak v3 — "What If Humans Could Read Minds?" (1080×1920)
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a0a24'); bg.addColorStop(1, '#020208'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = 860;
  // radar halkaları
  for (let i = 0; i < 4; i++) { ctx.strokeStyle = `rgba(95,240,255,${.35 - i * .06})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, 380 + i * 110, 0, TAU); ctx.stroke(); }
  // beyin ağı: beyin benzeri elips içinde düğümler
  const R = RN(21), nodes = [];
  while (nodes.length < 70) { const x = (R() - .5) * 2, y = (R() - .5) * 2; if (x * x / .85 + y * y / .6 <= 1) nodes.push([cx + x * 420, cy + y * 360]); }
  ctx.lineWidth = 3; nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => { const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (d < 150) { ctx.strokeStyle = `rgba(95,240,255,${.45 * (1 - d / 150)})`; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }));
  nodes.forEach(([x, y], i) => { const p = .5 + .5 * Math.sin(t * 3 + i); ctx.fillStyle = i % 5 === 0 ? '#ff2e45' : '#c8f7ff'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(x, y, 6 + p * 4, 0, TAU); ctx.fill(); }); ctx.shadowBlur = 0;
  // hedef düğüm: kırmızı halka
  const tgt = nodes[0]; ctx.strokeStyle = '#ff2e45'; ctx.lineWidth = 12; ctx.shadowColor = '#ff2e45'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(tgt[0], tgt[1], 80, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.save(); ctx.translate(tgt[0] + 240, tgt[1] - 200); ctx.rotate(-.1); ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.roundRect(-190, -54, 380, 108, 30); ctx.fill(); txt('YOUR SECRET', 0, 3, 64, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  ctx.strokeStyle = '#ffc83d'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(tgt[0] + 170, tgt[1] - 150); ctx.lineTo(tgt[0] + 90, tgt[1] - 60); ctx.stroke();
  // kanca metni
  txt('THEY CAN', W / 2, 330, 170, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 20 });
  txt('HEAR YOU', W / 2, 510, 200, '#5ff0ff', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: '#5ff0ff', blur: 45 });
  // alt başlık
  ctx.save(); ctx.translate(W / 2, 1480); ctx.rotate(.02); txt('WHAT IF MINDS ARE PUBLIC?', 0, 0, fit('WHAT IF MINDS ARE PUBLIC?', 74, 960, 'Anton', 400), '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 }); ctx.restore();
  vignette(.5);
};
