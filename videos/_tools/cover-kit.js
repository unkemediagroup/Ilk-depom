// YT Shorts kapak kiti: videonun kendi sahnesini (yazısız) arka plan olarak çizer + büyük başlık.
// cover.html sırası: words.js fin.js whatif.js main.js ../_tools/cover-kit.js cover.js
const _MAIN = window.draw;
function cleanScene(t, noTxt) {
  const keep = { kinetic, bigText, stampText, pill, subs, counter, glitch, motionStreak, txt };
  const no = () => {}; kinetic = bigText = stampText = pill = subs = counter = glitch = motionStreak = no; if (noTxt) txt = no;
  try { _MAIN(t); } finally { ({ kinetic, bigText, stampText, pill, subs, counter, glitch, motionStreak, txt } = keep); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
// o: { t, top, big, bot, col, badge, badgeCol, y }
function coverPage(o) {
  cleanScene(o.t, o.noTxt);
  if (o.pre) o.pre();
  const y = o.y || 1180;
  const g = ctx.createLinearGradient(0, y - 520, 0, y + 420); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.35, 'rgba(0,0,0,.62)'); g.addColorStop(.75, 'rgba(0,0,0,.62)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, y - 520, W, 940);
  const F = { align: 'center', font: 'Anton', weight: 400 };
  txt(o.top, W / 2, y - 250, fit(o.top, 110, 980, 'Anton', 400), '#fff', { ...F, stroke: 14 });
  txt(o.big, W / 2, y - 40, fit(o.big, 250, 1010, 'Anton', 400), '#fff', { ...F, stroke: 24, glow: 'rgba(255,255,255,.35)', blur: 30 });
  ctx.save(); ctx.translate(W / 2, y + 190); ctx.rotate(-.035); txt(o.bot, 0, 0, fit(o.bot, 190, 1000, 'Anton', 400), o.col || '#ff2e45', { ...F, stroke: 26, glow: o.col || '#ff2e45', blur: 50 }); ctx.restore();
  if (o.badge) { ctx.save(); ctx.translate(o.bx || 780, o.by || 200); ctx.rotate(.1); ctx.font = '400 56px Anton'; const w = ctx.measureText(o.badge).width + 80; ctx.fillStyle = o.badgeCol || '#ffc83d'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-w / 2, -62, w, 124, 30); ctx.fill(); ctx.shadowBlur = 0; txt(o.badge, 0, 4, 56, '#111', { ...F, stroke: 0 }); ctx.restore(); }
  vignette(.5);
}
