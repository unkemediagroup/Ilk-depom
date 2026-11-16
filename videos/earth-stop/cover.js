// YT Shorts kapak — "What If the Earth Stopped Spinning?" (1080×1920)
function gauge(cx, cy, r, v, vmax, t) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.fillStyle = '#0d1426'; ctx.beginPath(); ctx.arc(0, 0, r * 1.08, 0, TAU); ctx.fill();
  ctx.lineWidth = r * .1; const a0 = Math.PI * .75, a1 = Math.PI * 2.25;
  ctx.strokeStyle = '#1d2a48'; ctx.beginPath(); ctx.arc(0, 0, r * .9, a0, a1); ctx.stroke();
  const g = ctx.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, C.green); g.addColorStop(.6, C.gold); g.addColorStop(1, C.red);
  ctx.strokeStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * .9, a0, a0 + (a1 - a0) * v / vmax); ctx.stroke();
  for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * i / 10; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .72, Math.sin(a) * r * .72); ctx.lineTo(Math.cos(a) * r * .8, Math.sin(a) * r * .8); ctx.stroke(); }
  const na = a0 + (a1 - a0) * v / vmax + Math.sin(t * 60) * .01; ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(na) * r * .78, Math.sin(na) * r * .78); ctx.stroke();
  ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.arc(0, 0, r * .1, 0, TAU); ctx.fill();
  ctx.restore();
}
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  space(t, 2, { top: '#05030c', bot: '#200608' });
  const cx = W / 2, cy = 640, r = 400;
  const rg = ctx.createRadialGradient(cx, cy, r * .8, cx, cy, r * 2); rg.addColorStop(0, 'rgba(255,90,40,.45)'); rg.addColorStop(1, 'rgba(255,40,40,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  // dönüş izleri (fren izi gibi kopuk)
  ctx.save(); ctx.translate(cx, cy); ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a0 = i / 12 * TAU, rr = r * (1.12 + (i % 4) * .08); ctx.strokeStyle = i % 3 ? 'rgba(140,210,255,.55)' : 'rgba(255,120,60,.8)'; ctx.lineWidth = 12 - (i % 4) * 2; ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * .32, -.35, a0, a0 + .9); ctx.stroke(); }
  ctx.restore();
  earth(cx, cy, r, 0, { rot: 2.2 });
  // fren kıvılcımları sağ kenardan
  shards(cx + r * .85, cy + 120, .28, 90, 5, R => R > .5 ? '#ffd36b' : '#ff6a2e', 18, 900);
  ring2(cx, cy, .3, 1000, '#ff6a2e', 30);
  // DUR tabelası çerçevesi: kırmızı STOP sekizgeni sol üstte
  ctx.save(); ctx.translate(190, 210); ctx.rotate(-.12); ctx.fillStyle = '#e8213a'; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + TAU / 16; ctx.lineTo(Math.cos(a) * 140, Math.sin(a) * 140); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 12; ctx.stroke();
  txt('STOP', 0, 6, 86, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  // hız göstergesi sağ üstte
  ctx.save(); ctx.translate(860, 200); ctx.scale(.42, .42); gauge(0, 0, 400, 0, 1100, 0); ctx.restore();
  txt('1,000 MPH → 0', 860, 400, 50, '#ffc83d', { align: 'center', font: 'Anton', weight: 400, stroke: 10 });
  // başlık
  txt('WHAT IF THE', W / 2, 1150, 110, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('EARTH', W / 2, 1340, 250, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: 'rgba(120,200,255,.6)', blur: 30 });
  ctx.save(); ctx.translate(W / 2, 1560); ctx.rotate(-.04); txt('STOPPED', 0, 0, 230, '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 28, glow: '#ff2e45', blur: 55 }); ctx.restore();
  txt('SPINNING?', W / 2, 1755, 150, '#ffc83d', { align: 'center', font: 'Anton', weight: 400, stroke: 20, glow: '#ff8a00', blur: 30 });
  vignette(.5);
};
