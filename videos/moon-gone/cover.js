// YT Shorts kapak — "What If the Moon Suddenly Disappeared?" (1080×1920)
function wave(front, base, h, t) {
  if (h < 5) return;
  const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, '#5fd3ff'); g.addColorStop(.4, '#1676c9'); g.addColorStop(1, '#062a5c');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W + 900, base + 400); ctx.lineTo(W + 900, base - h * .35);
  ctx.bezierCurveTo(front + h * 1.2, base - h * .55, front + h * .75, base - h * 1.05, front + h * .25, base - h);
  ctx.bezierCurveTo(front - h * .1, base - h * .97, front - h * .32, base - h * .82, front - h * .3, base - h * .62);
  ctx.bezierCurveTo(front - h * .22, base - h * .52, front - h * .08, base - h * .6, front - h * .02, base - h * .68);
  ctx.bezierCurveTo(front + h * .02, base - h * .45, front + h * .02, base - h * .15, front - h * .2, base + 400); ctx.closePath(); ctx.fill();
  const tg = ctx.createRadialGradient(front - h * .08, base - h * .72, 0, front - h * .08, base - h * .72, h * .3); tg.addColorStop(0, 'rgba(0,15,40,.7)'); tg.addColorStop(1, 'rgba(0,15,40,0)');
  ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(front - h * .08, base - h * .72, h * .3, 0, TAU); ctx.fill();
  // köpük
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = h * .035; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(front + h * .75, base - h * .9); ctx.bezierCurveTo(front + h * .5, base - h * 1.03, front, base - h * 1.0, front - h * .28, base - h * .78); ctx.stroke();
  const R = RN(21); ctx.fillStyle = 'rgba(235,250,255,.8)';
  for (let i = 0; i < 70; i++) { const a = R(), px = front - h * .2 + (R() - .3) * h * .7 + Math.sin(t * 3 + i) * 20, py = base - h * (.8 + R() * .3) - ((t * 200 + R() * 300) % 260);
    ctx.beginPath(); ctx.arc(px, py, 3 + a * 9, 0, TAU); ctx.fill(); }
  // dalga yüzü çizgileri
  ctx.strokeStyle = 'rgba(180,235,255,.25)'; ctx.lineWidth = 6;
  for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(front + h * (.2 + i * .15), base - h * (.97 - i * .1)); ctx.quadraticCurveTo(front + h * (.1 + i * .14), base - h * .45, front + h * (.15 + i * .18), base); ctx.stroke(); }
}
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  space(t, 1, { top: '#05030c', bot: '#1a0610' });
  const rg = ctx.createRadialGradient(W / 2, 560, 100, W / 2, 560, 900); rg.addColorStop(0, 'rgba(255,120,60,.35)'); rg.addColorStop(1, 'rgba(255,40,60,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  // parçalanan ay
  ring2(W / 2, 560, .35, 900, '#ffd9a0', 34); ring2(W / 2, 560, .6, 900, 'rgba(255,200,140,.8)', 20);
  moon(W / 2, 560, 340, { crack: 1, rot: .2, glow: 1.4 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g2 = ctx.createRadialGradient(W / 2, 560, 0, W / 2, 560, 200); g2.addColorStop(0, 'rgba(255,200,120,.9)'); g2.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(W / 2, 560, 200, 0, TAU); ctx.fill(); ctx.restore();
  shards(W / 2, 560, .32, 90, 11, R => R > .5 ? '#d6d6cf' : '#ffcf8a', 34, 1300);
  // tsunami + şehir
  ctx.fillStyle = '#0d1d3a'; ctx.fillRect(0, 1880, W, 60);
  skyline(1900, 1, { seed: 13, tall: 380, col: '#120d1c' });
  wave(700, 1960, 760, 1);
  // başlık
  txt('WHAT IF THE', W / 2, 965, 110, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('MOON', W / 2, 1170, 270, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: 'rgba(255,200,120,.6)', blur: 30 });
  ctx.save(); ctx.translate(W / 2, 1400); ctx.rotate(-.04); txt('VANISHED?', 0, 0, fit('VANISHED?', 230, 1000, 'Anton', 400), '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 30, glow: '#ff2e45', blur: 60 }); ctx.restore();
  ctx.save(); ctx.translate(820, 190); ctx.rotate(.12); ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.roundRect(-210, -62, 420, 124, 30); ctx.fill(); txt('1 MILE TSUNAMI', 0, 4, 54, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  vignette(.55);
};
