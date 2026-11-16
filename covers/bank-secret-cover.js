// Kapak: How Do Banks Make Money From Our Deposits?
function big(s, y, size, col, glow) { const f = fit(s, size, 1000, 'Anton', 400); txt(s, W / 2, y, f, col, { align: 'center', font: 'Anton', weight: 400, glow, blur: 50, stroke: f * .14 }); }
window.drawCover = function () {
  bgFinance(3.2, { tint: 'rgba(255,200,61,.30)', seed: 2, dot: '255,210,120', top: '#1a1206', bot: '#030201' });
  // arkada ışık hüzmeleri
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,200,61,.07)' : 'rgba(255,200,61,.02)'; ctx.beginPath(); ctx.moveTo(W / 2, 1020); ctx.arc(W / 2, 1020, 1600, i / 18 * TAU, (i + 1) / 18 * TAU); ctx.fill(); }
  // bankaya uçan banknotlar
  const fly = [[120, 760, -.6, 260], [930, 700, .5, 240], [80, 1180, -.3, 230], [990, 1150, .4, 250], [220, 560, -.9, 200], [860, 520, .8, 200]];
  fly.forEach(([x, y, r, w]) => bill(x, y, w, r));
  bank(W / 2, 1300, 760, { glow: 'rgba(255,200,61,1)' });
  for (let i = 0; i < 10; i++) coin(260 + (i % 5) * 140, 1360 + Math.floor(i / 5) * 60 + (i % 2) * 20, 46, (i % 3) * .25);
  // üst başlık
  big('THE BANK IS', 210, 140, '#fff'); big('USING YOUR', 375, 160, '#fff'); big('MONEY', 595, 240, C.green, C.green);
  // alt karşılaştırma rozetleri
  const badge = (x, top, val, col) => { ctx.save(); ctx.translate(x, 1590); ctx.fillStyle = 'rgba(6,9,15,.88)'; ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-220, -120, 440, 240, 40); ctx.fill(); ctx.stroke();
    txt(top, 0, -62, 48, C.mute, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt(val, 0, 40, 130, col, { align: 'center', font: 'Anton', weight: 400, glow: col, blur: 40 }); ctx.restore(); };
  badge(280, 'YOU GET', '1%', '#9aa7b8'); badge(800, 'THEY CHARGE', '20%', C.red);
  txt('VS', W / 2, 1590, 70, C.gold, { align: 'center', font: 'Anton', weight: 400 });
  vignette(.5);
};
