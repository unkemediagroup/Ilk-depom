// YT Shorts kapak v2 — "What If Humans Could Read Minds?" (1080×1920)
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const cx = W / 2, cy = 900, R = 470;
  // arka plan: koyu kırmızı-siyah
  const bg = ctx.createRadialGradient(cx, cy, 80, cx, cy, 1100); bg.addColorStop(0, '#2a0610'); bg.addColorStop(1, '#030106');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // arka planda dönen ışın
  ctx.save(); ctx.translate(cx, cy); for (let i = 0; i < 18; i++) { ctx.rotate(TAU / 18); ctx.fillStyle = i % 2 ? 'rgba(255,60,90,.07)' : 'rgba(180,90,255,.06)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -140); ctx.lineTo(1400, 140); ctx.fill(); } ctx.restore();
  // göz (badem)
  const w = 1000, h = 520;
  ctx.save(); ctx.beginPath(); ctx.moveTo(cx - w / 2, cy); ctx.quadraticCurveTo(cx, cy - h * 1.05, cx + w / 2, cy); ctx.quadraticCurveTo(cx, cy + h * 1.05, cx - w / 2, cy); ctx.closePath(); ctx.clip();
  const sc = ctx.createRadialGradient(cx, cy, 200, cx, cy, 560); sc.addColorStop(0, '#fff7f0'); sc.addColorStop(1, '#c9b8b0'); ctx.fillStyle = sc; ctx.fillRect(0, 0, W, H);
  // damar
  ctx.strokeStyle = 'rgba(200,40,60,.55)'; ctx.lineWidth = 3; const Rn = RN(11);
  for (let i = 0; i < 26; i++) { const a = Rn() * TAU, r0 = 320; ctx.beginPath(); let x = cx + Math.cos(a) * r0, y = cy + Math.sin(a) * r0 * .5; ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += Math.cos(a + (Rn() - .5)) * 40; y += Math.sin(a + (Rn() - .5)) * 25; ctx.lineTo(x, y); } ctx.stroke(); }
  // iris
  const ir = 300, ig = ctx.createRadialGradient(cx - 60, cy - 60, 40, cx, cy, ir); ig.addColorStop(0, '#d9a2ff'); ig.addColorStop(.55, '#7a3cff'); ig.addColorStop(1, '#0fd6ff');
  ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(cx, cy, ir, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 4; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 130, cy + Math.sin(a) * 130); ctx.lineTo(cx + Math.cos(a) * ir, cy + Math.sin(a) * ir); ctx.stroke(); }
  // iris içinde dönen düşünce kelimeleri
  const words = ['I\'M BORED', 'LIE?', 'WHO FARTED', 'HELP', 'PIZZA', 'NICE SHIRT'];
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .4);
  for (let i = 0; i < words.length; i++) { const a = i / words.length * TAU; ctx.save(); ctx.rotate(a); ctx.translate(0, -205); ctx.rotate(Math.PI / 2); txt(words[i], 0, 0, 30, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 6 }); ctx.restore(); }
  ctx.restore();
  // bebek
  ctx.fillStyle = '#05000a'; ctx.beginPath(); ctx.arc(cx, cy, 120, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(cx - 50, cy - 60, 26, 0, TAU); ctx.fill();
  // üst kirpik
  ctx.strokeStyle = '#120408'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - w / 2 - 10, cy + 2); ctx.quadraticCurveTo(cx, cy - h * 1.05 - 10, cx + w / 2 + 10, cy + 2); ctx.stroke();
  ctx.restore();
  // alt kirpik kalın çizgi
  ctx.strokeStyle = '#120408'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(cx - w / 2, cy); ctx.quadraticCurveTo(cx, cy + h * 1.05, cx + w / 2, cy); ctx.stroke();
  // kanca metni (üst güvenli alan altında)
  txt('NO SECRETS', W / 2, 330, 170, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 20 });
  txt('LEFT.', W / 2, 500, 210, '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: '#ff2e45', blur: 50 });
  // alt etiket
  ctx.save(); ctx.translate(W / 2, 1420); ctx.rotate(-.04); ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.roundRect(-300, -66, 600, 132, 40); ctx.fill(); txt('READ MINDS?', 0, 4, 96, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  vignette(.55);
};
