// YT Shorts kapak — "What If Dinosaurs Never Went Extinct?" (1080×1920)
function rex(x, y, s, t, o = {}) {
  const jaw = o.jaw || 0, walk = o.walk ?? 1, ph = t * (o.speed || 5);
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s); const bob = Math.abs(Math.sin(ph)) * .012 * walk; ctx.translate(0, -bob);
  const col = o.col || '#3f6b3a', dk = o.dark || '#2a4a28';
  // arka bacak
  const leg = (a, c) => { ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = .075; const sw = Math.sin(ph + a) * .09 * walk;
    ctx.beginPath(); ctx.moveTo(-.08, -.36); ctx.lineTo(-.04 + sw, -.2); ctx.lineTo(-.1 + sw * 1.3, -.06); ctx.lineTo(-.02 + sw * 1.6, 0); ctx.stroke();
    ctx.lineWidth = .03; ctx.beginPath(); ctx.moveTo(-.04 + sw * 1.6, 0); ctx.lineTo(.04 + sw * 1.6, 0); ctx.stroke(); };
  leg(Math.PI, dk);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-.62, -.44); ctx.quadraticCurveTo(-.35, -.52, -.05, -.58); ctx.quadraticCurveTo(.12, -.62, .2, -.6);
  ctx.lineTo(.28, -.69); ctx.lineTo(.47, -.66); ctx.lineTo(.53, -.6); ctx.lineTo(.33, -.565);
  // alt çene (açılır)
  ctx.save(); ctx.translate(.3, -.56); ctx.rotate(jaw * .5); ctx.lineTo(.2, .02); ctx.lineTo(.03, .07); ctx.restore();
  ctx.lineTo(.2, -.47); ctx.quadraticCurveTo(.16, -.36, .02, -.3); ctx.quadraticCurveTo(-.12, -.28, -.2, -.34); ctx.quadraticCurveTo(-.4, -.4, -.62, -.44); ctx.closePath(); ctx.fill();
  if (jaw > .05) { ctx.fillStyle = '#7a1f22'; ctx.beginPath(); ctx.moveTo(.33, -.565); ctx.save(); ctx.translate(.3, -.56); ctx.rotate(jaw * .5); ctx.lineTo(.2, .02); ctx.restore(); ctx.lineTo(.3, -.56); ctx.fill();
    ctx.fillStyle = '#f4efe0'; for (let i = 0; i < 5; i++) { const xx = .35 + i * .035; ctx.beginPath(); ctx.moveTo(xx, -.567 + i * -.001); ctx.lineTo(xx + .01, -.54); ctx.lineTo(xx + .02, -.567); ctx.fill(); } }
  // sırt deseni, kol, göz
  ctx.fillStyle = dk; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.ellipse(-.45 + i * .08, -.5 - Math.sin(i * .5) * .05, .025, .012, -.2, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = dk; ctx.lineWidth = .025; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(.15, -.42); ctx.lineTo(.21, -.38 + Math.sin(ph) * .01); ctx.lineTo(.24, -.4); ctx.stroke();
  ctx.fillStyle = o.eye || '#ffcf3a'; ctx.beginPath(); ctx.arc(.37, -.635, .014, 0, TAU); ctx.fill(); ctx.fillStyle = '#000'; ctx.fillRect(.367, -.646, .006, .022);
  leg(0, col);
  ctx.restore();
}
function raptor(x, y, s, t, o = {}) {
  const ph = t * (o.speed || 7), walk = o.walk ?? 1; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const col = o.col || '#6b5a8a', dk = o.dark || '#43375c';
  const leg = (a, c) => { ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = .05; const sw = Math.sin(ph + a) * .1 * walk;
    ctx.beginPath(); ctx.moveTo(-.05, -.4); ctx.lineTo(.0 + sw, -.24); ctx.lineTo(-.1 + sw, -.1); ctx.lineTo(-.02 + sw * 1.5, 0); ctx.stroke(); ctx.lineWidth = .02; ctx.beginPath(); ctx.moveTo(-.02 + sw * 1.5, 0); ctx.lineTo(.06 + sw * 1.5, -.01); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-.01 + sw * 1.5, -.01); ctx.quadraticCurveTo(.0 + sw * 1.5, -.06, .03 + sw * 1.5, -.05); ctx.stroke(); };
  leg(Math.PI, dk);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-.7, -.52); ctx.quadraticCurveTo(-.3, -.5, -.05, -.52); ctx.quadraticCurveTo(.12, -.56, .2, -.72); ctx.quadraticCurveTo(.24, -.8, .3, -.8);
  ctx.lineTo(.48, -.76); ctx.lineTo(.48, -.72); ctx.lineTo(.3, -.7); ctx.quadraticCurveTo(.2, -.6, .14, -.48); ctx.quadraticCurveTo(.05, -.36, -.08, -.38); ctx.quadraticCurveTo(-.3, -.44, -.7, -.52); ctx.closePath(); ctx.fill();
  ctx.fillStyle = dk; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-.2 + i * .05, -.52); ctx.lineTo(-.18 + i * .05, -.58); ctx.lineTo(-.16 + i * .05, -.52); ctx.fill(); }
  ctx.strokeStyle = dk; ctx.lineWidth = .02; ctx.beginPath(); ctx.moveTo(.12, -.5); ctx.lineTo(.2, -.46); ctx.lineTo(.24, -.5); ctx.stroke();
  ctx.fillStyle = o.eye || '#ffd23a'; ctx.beginPath(); ctx.arc(.36, -.765, .013, 0, TAU); ctx.fill(); ctx.fillStyle = '#000'; ctx.fillRect(.357, -.775, .005, .02);
  leg(0, col); ctx.restore();
}
function anky(x, y, s, t, o = {}) {           // zırhlı ankylosaur (yük taşır)
  const ph = t * 3.2; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const col = o.col || '#8a6a3c', dk = '#5a4325';
  ctx.strokeStyle = dk; ctx.lineWidth = .07; ctx.lineCap = 'round';
  for (const [lx, a] of [[-.25, 0], [.2, Math.PI], [-.2, Math.PI], [.25, 0]]) { const sw = Math.sin(ph + a) * .05; ctx.beginPath(); ctx.moveTo(lx, -.18); ctx.lineTo(lx + sw, 0); ctx.stroke(); }
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-.75, -.2); ctx.quadraticCurveTo(-.5, -.22, -.4, -.25); ctx.quadraticCurveTo(-.2, -.5, .1, -.48); ctx.quadraticCurveTo(.35, -.45, .42, -.25);
  ctx.quadraticCurveTo(.5, -.3, .58, -.24); ctx.lineTo(.6, -.16); ctx.lineTo(.42, -.14); ctx.quadraticCurveTo(0, -.08, -.4, -.15); ctx.lineTo(-.75, -.17); ctx.closePath(); ctx.fill();
  ctx.fillStyle = dk; ctx.beginPath(); ctx.ellipse(-.8 + Math.sin(ph) * .02, -.19, .07, .05, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#e8dcc0'; for (let i = 0; i < 9; i++) { const a = Math.PI + .3 + i * .29, px = -.15 + Math.cos(a) * .55 * .62, py = -.2 + Math.sin(a) * .28; ctx.beginPath(); ctx.moveTo(px - .025, py); ctx.lineTo(px + Math.cos(a) * .06, py + Math.sin(a) * .06); ctx.lineTo(px + .025, py); ctx.fill(); }
  ctx.fillStyle = dk; for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.arc(-.3 + i * .09, -.38 + j * .1 - Math.sin(i * .4) * .04, .025, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(.5, -.24, .012, 0, TAU); ctx.fill();
  ctx.restore();
}
function ground(y, col1, col2) { const g = ctx.createLinearGradient(0, y, 0, y + 600); g.addColorStop(0, col1); g.addColorStop(1, col2); ctx.fillStyle = g; ctx.fillRect(-300, y, W + 600, 900); }
function jungle(y, t, seed, col) { const R = RN(seed); ctx.fillStyle = col; for (let i = 0; i < 14; i++) { const x = R() * (W + 200) - 100, h = 200 + R() * 400; ctx.fillRect(x - 10, y - h, 20, h);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI + Math.PI + Math.sin(t + i) * .05; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 80, y - h + Math.sin(a) * 30, 100, 22, a + Math.PI / 2 - 1.2, 0, TAU); ctx.fill(); } } }


window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#1a0a1e'); sky.addColorStop(.45, '#c8452a'); sky.addColorStop(.62, '#ff9a4a'); sky.addColorStop(1, '#2a1208'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  // ıskalayan asteroit
  ctx.save(); ctx.translate(880, 150); ctx.rotate(-.5); const g = ctx.createLinearGradient(0, 0, 420, 0); g.addColorStop(0, 'rgba(255,230,150,.95)'); g.addColorStop(1, 'rgba(255,90,30,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(420, 0); ctx.lineTo(0, 50); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#4a3c34'; ctx.beginPath(); ctx.arc(880, 150, 55, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(250, 330); ctx.rotate(-.1); ctx.fillStyle = '#22e07a'; ctx.beginPath(); ctx.roundRect(-150, -48, 300, 96, 24); ctx.fill(); txt('MISSED!', 0, 4, 64, '#05140c', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  // şehir silueti (uzakta)
  skyline(1150, 1, { seed: 33, tall: 360, col: '#3a1a1e' });
  ctx.save(); ctx.globalAlpha = .9; jungle(1180, 0, 4, '#2a3a1e'); ctx.restore();
  ground(1150, '#3a2a16', '#140a04');
  // kükreyen dev T-Rex
  rex(400, 1210, 1050, 0, { walk: 0, jaw: 1, col: '#3f7a3a', dark: '#24481f', eye: '#ffd23a' });
  // küçük insan
  ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 20; human(940, 1150, 150); ctx.restore();
  // kükreme dalgaları
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(255,255,255,${.6 - i * .15})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(990, 610, 70 + i * 50, -.7, .7); ctx.stroke(); }
  // başlık
  txt('WHAT IF', W / 2, 1300, 110, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 14 });
  txt('DINOSAURS', W / 2, 1480, fit('DINOSAURS', 230, 1000, 'Anton', 400), '#7fe05a', { align: 'center', font: 'Anton', weight: 400, stroke: 24, glow: '#3ad06a', blur: 40 });
  ctx.save(); ctx.translate(W / 2, 1690); ctx.rotate(-.03); txt('NEVER WENT EXTINCT?', 0, 0, fit('NEVER WENT EXTINCT?', 150, 1010, 'Anton', 400), '#ff2e45', { align: 'center', font: 'Anton', weight: 400, stroke: 20, glow: '#ff2e45', blur: 45 }); ctx.restore();
  vignette(.5);
};
