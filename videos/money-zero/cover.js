// YT Shorts kapak — "What If Money Suddenly Became Worthless?" (1080×1920)
function can(x, y, s) { ctx.save(); ctx.translate(x, y); const g = ctx.createLinearGradient(-s * .3, 0, s * .3, 0); g.addColorStop(0, '#8a939f'); g.addColorStop(.5, '#e8eef6'); g.addColorStop(1, '#6a737f'); ctx.fillStyle = g; ctx.fillRect(-s * .3, -s * .4, s * .6, s * .8);
  ctx.fillStyle = '#d9472b'; ctx.fillRect(-s * .3, -s * .22, s * .6, s * .44); txt('BEANS', 0, 0, s * .14, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = '#b8c0cc'; ctx.beginPath(); ctx.ellipse(0, -s * .4, s * .3, s * .07, 0, 0, TAU); ctx.fill(); ctx.restore(); }
function bottle(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(120,200,255,.85)'; ctx.beginPath(); ctx.roundRect(-s * .2, -s * .3, s * .4, s * .75, s * .08); ctx.fill(); ctx.fillRect(-s * .08, -s * .48, s * .16, s * .2); ctx.fillStyle = '#3da5ff'; ctx.fillRect(-s * .1, -s * .55, s * .2, s * .08);
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-s * .14, -s * .2, s * .05, s * .5); txt('H2O', 0, s * .1, s * .14, '#0b3a66', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function jerry(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#d0312d'; ctx.beginPath(); ctx.roundRect(-s * .32, -s * .38, s * .64, s * .8, s * .06); ctx.fill(); ctx.fillStyle = '#a3221f'; ctx.beginPath(); ctx.moveTo(-s * .2, -s * .3); ctx.lineTo(s * .2, s * .3); ctx.moveTo(s * .2, -s * .3); ctx.lineTo(-s * .2, s * .3); ctx.lineWidth = s * .05; ctx.strokeStyle = '#a3221f'; ctx.stroke();
  ctx.fillStyle = '#ffc83d'; ctx.fillRect(s * .1, -s * .52, s * .12, s * .16); ctx.fillStyle = '#d0312d'; ctx.fillRect(-s * .28, -s * .5, s * .26, s * .1); txt('FUEL', 0, s * .3, s * .12, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0608'); g.addColorStop(.6, '#3a0a0c'); g.addColorStop(1, '#120406'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // çöken grafik arkada
  ctx.save(); ctx.strokeStyle = '#ff3b4e'; ctx.lineWidth = 16; ctx.shadowColor = '#ff3b4e'; ctx.shadowBlur = 40; ctx.lineJoin = 'round'; ctx.beginPath();
  const pts = [[40, 200], [160, 160], [260, 260], [360, 220], [470, 420], [560, 380], [660, 620], [760, 600], [860, 900], [1000, 1080]]; pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  ctx.fillStyle = '#ff3b4e'; ctx.beginPath(); ctx.moveTo(1040, 1130); ctx.lineTo(950, 1090); ctx.lineTo(1020, 1020); ctx.fill(); ctx.restore();
  // yanan dev banknot
  ctx.save(); ctx.translate(W / 2, 720); ctx.rotate(-.12);
  bill(0, 0, 900, 0, { val: '0', col: '#9a9a92' });
  const R = RN(5); for (let i = 0; i < 16; i++) { const x = 100 + i * 25 + (R() - .5) * 40, hh = 120 + R() * 220; const fg = ctx.createLinearGradient(0, 200 - hh, 0, 200); fg.addColorStop(0, 'rgba(255,230,120,0)'); fg.addColorStop(.5, 'rgba(255,130,30,.95)'); fg.addColorStop(1, '#c0201a'); ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(x - 60, 210); ctx.quadraticCurveTo(x + (R() - .5) * 60, 200 - hh, x + 60, 210); ctx.fill(); }
  ctx.fillStyle = '#1a0a06'; ctx.beginPath(); ctx.moveTo(100, 210); for (let x = 100; x <= 460; x += 30) ctx.lineTo(x, 190 + Math.sin(x) * 16); ctx.lineTo(460, 210); ctx.fill();
  ctx.restore();
  stampText('$0', 300, 420, 150, '#ff3b4e', 1, -.2);
  // yeni para birimleri
  const its = [[can, 210, 1160], [bottle, 540, 1170], [jerry, 870, 1160]]; its.forEach(([f, x, y]) => { ctx.save(); ctx.fillStyle = 'rgba(255,200,61,.18)'; ctx.beginPath(); ctx.arc(x, y, 140, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ffc83d'; ctx.lineWidth = 8; ctx.shadowColor = '#ffc83d'; ctx.shadowBlur = 30; ctx.stroke(); ctx.restore(); f(x, y, 200); });
  // başlık
  txt('WHAT IF MONEY BECAME', W / 2, 1390, fit('WHAT IF MONEY BECAME', 120, 980, 'Anton', 400), '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  ctx.save(); ctx.translate(W / 2, 1600); ctx.rotate(-.03); txt('WORTHLESS?', 0, 0, fit('WORTHLESS?', 250, 1000, 'Anton', 400), '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 28, glow: '#ff2e45', blur: 55 }); ctx.restore();
  ctx.save(); ctx.translate(W / 2, 1790); ctx.fillStyle = '#9b6bff'; ctx.beginPath(); ctx.roundRect(-210, -52, 420, 104, 52); ctx.fill(); txt('OVERNIGHT', 0, 4, 64, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  vignette(.45);
};
