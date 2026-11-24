// YT Shorts kapak v4 — "What If Humans Could Read Minds?" (metne göre: gizlilik biter, yalanlar ve sahte nezaket ifşa olur)
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bg = ctx.createRadialGradient(540, 900, 80, 540, 900, 1100); bg.addColorStop(0, '#3a0a10'); bg.addColorStop(1, '#050204'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const cx = 540, cy = 1000, rx = 320, ry = 400;
  // kırılma ışığı
  const glow = ctx.createRadialGradient(cx, cy, 60, cx, cy, 620); glow.addColorStop(0, 'rgba(255,60,80,.55)'); glow.addColorStop(1, 'rgba(255,60,80,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  // zigzag çatlak noktaları
  const crack = []; const R = RN(9); for (let i = 0; i <= 14; i++) { const y = cy - ry + i * (2 * ry) / 14; crack.push([cx + (i % 2 ? 1 : -1) * (12 + R() * 22), y]); }
  // maske yarıları (çatlak boyunca kayık)
  const half = (side) => { ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy - ry - 10); crack.forEach(p => ctx.lineTo(p[0] + (side < 0 ? 0 : 0), p[1])); ctx.lineTo(cx, cy + ry + 10); ctx.lineTo(side < 0 ? cx - rx - 40 : cx + rx + 40, cy + ry + 10); ctx.lineTo(side < 0 ? cx - rx - 40 : cx + rx + 40, cy - ry - 10); ctx.closePath(); ctx.clip();
    ctx.translate(side * 26, side * -6);
    ctx.fillStyle = '#f4eee6'; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fill();
    // sahte gülümseme
    ctx.strokeStyle = '#2a1410'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - 170, cy + 150); ctx.quadraticCurveTo(cx, cy + 260, cx + 170, cy + 150); ctx.stroke();
    ctx.fillStyle = '#2a1410'; ctx.beginPath(); ctx.ellipse(cx - 120, cy - 60, 34, 52, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx + 120, cy - 60, 34, 52, 0, 0, TAU); ctx.fill();
    ctx.restore(); };
  half(-1); half(1);
  // çatlaktan sızan kırmızı ışık
  ctx.save(); ctx.strokeStyle = '#ff2e45'; ctx.lineWidth = 10; ctx.shadowColor = '#ff2e45'; ctx.shadowBlur = 40; ctx.beginPath(); crack.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
  // düşünce balonları (yalan, yargı, dürtü, gizli sözler)
  const bubbles = [['I LIED', 250, 690, '#ffc83d'], ['YOU\'RE BORING', 830, 780, '#5ff0ff'], ['DARK IMPULSE', 250, 1230, '#ff7aa8'], ['JUDGING YOU', 830, 1300, '#c8a0ff']];
  bubbles.forEach(([s, x, y, col], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate(i % 2 ? .06 : -.06); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-200, -60, 400, 120, 60); ctx.fill(); ctx.beginPath(); ctx.arc(i % 2 ? -150 : 150, 90, 20, 0, TAU); ctx.arc(i % 2 ? -190 : 190, 130, 10, 0, TAU); ctx.fill(); txt(s, 0, 4, 64, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); });
  // kanca metni
  txt('PRIVACY', W / 2, 330, 180, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 20 });
  txt('IS DEAD', W / 2, 500, 200, '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: '#ff2e45', blur: 50 });
  // alt etiket
  ctx.save(); ctx.translate(W / 2, 1470); ctx.rotate(-.03); ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.roundRect(-440, -62, 880, 124, 40); ctx.fill(); txt('EVERY LIE EXPOSED', 0, 4, 92, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  vignette(.5);
};
