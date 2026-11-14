// 4.video — "What If Dinosaurs Never Went Extinct?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 35.79;
const SUBY = 1540;

// ---------- dinozorlar (sağa bakar; (x,y) = ayak zemini ortası; s = boy uzunluğu) ----------
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

// ---------- S1 0–3.0: asteroit ıskalar, T-Rex kükrer ----------
function s1(t) {
  space(t, 3, { top: '#0a0612', bot: '#2a0f1a' });
  const p = seg(t, 0, 1.7), miss = seg(t, 1.2, 1.9);
  cam({ zoom: 1.05, t, shake: t > 1.76 ? 18 * (1 - seg(t, 1.76, 3.0)) : 4 }, () => {
    earth(W / 2, 900, 360, t, { rot: t * .3 + 1, land: '#5b8a3a' });
    // asteroit: dünyaya doğru, son anda sapar
    const ax = lerp(-150, 520, eo(p)) + ei(miss) * 900, ay = lerp(-150, 520, eo(p)) - ei(miss) * 650;
    const ang = Math.atan2(520 + 150, 520 + 150) - miss * 1.4;
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(ang + Math.PI);
    const g = ctx.createLinearGradient(0, 0, 600, 0); g.addColorStop(0, 'rgba(255,200,90,.95)'); g.addColorStop(1, 'rgba(255,60,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(600, 0); ctx.lineTo(0, 60); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#5a4a40'; ctx.beginPath(); ctx.arc(ax, ay, 70, 0, TAU); ctx.fill(); ctx.fillStyle = '#3a2e28'; ctx.beginPath(); ctx.arc(ax - 18, ay + 10, 18, 0, TAU); ctx.arc(ax + 22, ay - 15, 12, 0, TAU); ctx.fill();
    if (t > 1.3) stampText('MISSED!', W / 2, 400, 130, C.green, seg(t, 1.3, 1.6), .1);
  });
  // T-Rex kafası alttan kükreyerek girer
  const r = eback(seg(t, 1.7, 2.2)); if (r > 0) rex(W / 2 - 300, 2350 - r * 420, 1500, t, { jaw: .7 + .2 * Math.sin(t * 20), walk: 0 });
  kinetic(['WHAT', 'IF', 'DINOSAURS'], W / 2, 1210, 140, t, 0, { gap: .06 });
  kinetic(['NEVER', 'WENT', 'EXTINCT?'], W / 2, 1380, 140, t, .9, { hl: { 'EXTINCT?': C.red } });
  flash(t, 1.76, .2, '255,220,180');
}

// ---------- S2 3.0–5.2: memelilerin tacı ezilir ----------
function crown(x, y, s, col = C.gold) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(-s / 2, s * .3); ctx.lineTo(-s / 2, -s * .2); ctx.lineTo(-s * .25, s * .05); ctx.lineTo(0, -s * .35); ctx.lineTo(s * .25, s * .05); ctx.lineTo(s / 2, -s * .2); ctx.lineTo(s / 2, s * .3); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, s * .12, s * .07, 0, TAU); ctx.fill(); ctx.restore(); }
function foot(x, y, s, a = 1) { ctx.save(); ctx.translate(x, y); ctx.globalAlpha = a; ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.ellipse(0, s * .15, s * .28, s * .3, 0, 0, TAU); ctx.fill();
  for (const [dx, r] of [[-.32, -.5], [0, 0], [.32, .5]]) { ctx.save(); ctx.rotate(r * .5); ctx.beginPath(); ctx.ellipse(0, -s * .32, s * .1, s * .3, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .06, -s * .6); ctx.lineTo(0, -s * .8); ctx.lineTo(s * .06, -s * .6); ctx.fill(); ctx.restore(); } ctx.restore(); }
function rexLeg(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#3f6b3a'; ctx.beginPath(); ctx.moveTo(-s * .28, -2400); ctx.lineTo(s * .28, -2400); ctx.lineTo(s * .22, -s * .35); ctx.lineTo(s * .45, -s * .05); ctx.lineTo(-s * .45, -s * .05); ctx.lineTo(-s * .22, -s * .35); ctx.fill();
  ctx.fillStyle = '#2a4a28'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(0, -s * .6 - i * s * .35, s * .2, s * .05, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#f4efe0'; for (const dx of [-.36, 0, .36]) { ctx.beginPath(); ctx.moveTo(dx * s - s * .07, -s * .06); ctx.lineTo(dx * s, s * .08); ctx.lineTo(dx * s + s * .07, -s * .06); ctx.fill(); } ctx.restore(); }
function s2(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#ffb35a'); sky.addColorStop(1, '#ff6a3a'); ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, H + 600);
  const st = seg(t, 4.3, 4.5), dn = eio(seg(t, 3.9, 4.35));
  cam({ zoom: 1.02 + .04 * st, t, shake: t > 4.35 && t < 5 ? 26 : 2 }, () => {
    ground(1280, '#6b4a2a', '#2a1a10');
    // memeliler: insan + geyik silüetleri, taç insanın üstünde
    ctx.save(); ctx.globalAlpha = 1 - st; human(420, 1280, 380); ctx.restore();
    if (st < 1) crown(420, 820 + Math.sin(t * 4) * 10, 140);
    else shards(420, 1100, seg(t, 4.35, 5.2), 30, 2, C.gold, 20, 600);
    // dev ayak iner
    rexLeg(440, lerp(-200, 1280, dn), 520);
    if (st > 0) ring2(440, 1280, seg(t, 4.35, 5.0), 900, 'rgba(60,30,10,.8)', 30);
  });
  kinetic(['A', 'WORLD', 'OF'], W / 2, 220, 120, t, 3.3);
  kinetic(['MAMMALS'], W / 2, 370, 170, t, 4.1, { hl: { MAMMALS: C.gold } });
}

// ---------- S3 5.2–10.6: gezegeni paylaşmak — insan vs T-Rex ----------
function s3(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#87c6ff'); sky.addColorStop(1, '#e8f4ff'); ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, H + 600);
  const walkIn = eo(seg(t, 5.4, 8.6)), roar = seg(t, 9.5, 10.4);
  cam({ zoom: 1.05 - .05 * walkIn + .05 * Math.sin(roar * Math.PI), x: -40 * walkIn, t, shake: (t % .55 < .08 && walkIn < 1 ? 10 : 2) + 22 * Math.sin(roar * Math.PI) }, () => {
    ctx.save(); ctx.globalAlpha = .55; jungle(1300, t, 4, '#3a7a4a'); ctx.restore();
    ground(1300, '#5a8a3a', '#2f4a20');
    const rx = lerp(1400, 500, walkIn); rex(rx, 1310, 1100, t, { walk: walkIn < 1 ? 1 : 0, jaw: roar > 0 ? .9 * Math.sin(roar * Math.PI) : 0 });
    ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.8)'; ctx.shadowBlur = 20; human(160, 1310, 190); ctx.restore();
    // ölçek çubukları
    const k = seg(t, 6.9, 7.6); if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(60, 1310); ctx.lineTo(60, 1310 - 190 * eo(k)); ctx.stroke(); txt('1.8 M', 170, 1060, 46, '#fff', { align: 'center' });
      ctx.beginPath(); ctx.moveTo(rx - 660, 560); ctx.lineTo(rx - 660 + 1150 * eo(k), 560); ctx.stroke(); txt('12 M LONG', rx - 80, 500, 70, C.gold, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore(); }
  });
  kinetic(['COLOSSAL'], W / 2, 210, 150, t, 6.85);
  kinetic(['APEX', 'PREDATORS'], W / 2, 360, 140, t, 7.4, { hl: { PREDATORS: C.red } });
  if (t > 9.56) stampText('T-REX', W / 2, 1420, 130, C.red, seg(t, 9.56, 9.85));
}

// ---------- S4 10.6–13.9: süper zeki raptor torunları ----------
function s4(t) {
  bgFinance(t, { tint: 'rgba(155,107,255,.25)', seed: 5, dot: '190,150,255' });
  const iq = Math.round(200 * eo(seg(t, 11.0, 12.6)));
  cam({ zoom: 1.04 + .04 * Math.sin(t), t, shake: 3 }, () => {
    raptor(520, 1380, 1050, t, { walk: .25, speed: 3 });
    // beyin ağı hologramı
    const hx = 860, hy = 450, R = RN(8), nodes = Array.from({ length: 16 }, () => [hx + (R() - .5) * 360, hy + (R() - .5) * 260]);
    const k = seg(t, 10.72, 11.4); ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = 'rgba(0,230,255,.6)'; ctx.lineWidth = 3;
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => { if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 170) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }));
    nodes.forEach(([x, y], i) => { ctx.fillStyle = '#7ff0ff'; ctx.shadowColor = '#00e0ff'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(x, y, 8 + 4 * Math.sin(t * 6 + i), 0, TAU); ctx.fill(); }); ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0,230,255,.4)'; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(900, 590); ctx.lineTo(880, 560); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  });
  ctx.save(); ctx.globalAlpha = seg(t, 11.0, 11.2); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.roundRect(70, 160, 460, 250, 40); ctx.fill();
  txt('IQ ' + iq, 300, 260, 120, '#7ff0ff', { align: 'center', font: 'Anton', weight: 400, glow: '#00e0ff' }); txt('ULTRA-INTELLIGENT', 300, 360, 36, '#fff', { align: 'center', stroke: 6 }); ctx.restore();
  bigText('RAPTOR-DESCENDED', W / 2, 1450, 110, '#c58bff', seg(t, 11.72, 12.0), { glow: '#9b6bff' });
}

// ---------- S5 13.92–17.46: devasa canavarlara karşı korunan şehirler ----------
function s5(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0a0f24'); sky.addColorStop(1, '#3a2340'); ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, H + 600);
  cam({ zoom: 1.08 - .06 * seg(t, 13.9, 17.4), t, shake: 3 + (t % 1.1 < .1 ? 8 : 0) }, () => {
    // duvarın ardında yürüyen dev siluetler
    ctx.save(); ctx.globalAlpha = .95; rex(lerp(-500, 700, seg(t, 13.9, 17.5)), 1000, 1500, t, { col: '#120a18', dark: '#0a0610', eye: '#ff3b2e', speed: 3 });
    rex(lerp(1700, 900, seg(t, 14.5, 17.5)), 1000, 1100, t + 1, { col: '#160c1c', dark: '#0a0610', eye: '#ff3b2e', speed: 3.5, flip: true }); ctx.restore();
    // ışıldaklar
    for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + Math.sin(t * .9 + i * 2) * .5, bx = 200 + i * 340; ctx.save(); ctx.translate(bx, 1050); ctx.rotate(a); const g = ctx.createLinearGradient(0, 0, 1400, 0); g.addColorStop(0, 'rgba(255,245,200,.45)'); g.addColorStop(1, 'rgba(255,245,200,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -150); ctx.lineTo(1400, 150); ctx.fill(); ctx.restore(); }
    // dev duvar + elektrik
    ctx.fillStyle = '#3a4252'; ctx.fillRect(-200, 1000, W + 400, 260); ctx.fillStyle = '#2b313d'; for (let x = -200; x < W + 200; x += 120) ctx.fillRect(x, 1000, 8, 260);
    ctx.fillStyle = '#ffd23a'; for (let x = -200; x < W + 200; x += 80) ctx.fillRect(x + ((x / 80) % 2 ? 40 : 0), 1010, 40, 18);
    if (Math.sin(t * 13) > .6) { ctx.strokeStyle = '#7ff0ff'; ctx.lineWidth = 5; ctx.shadowColor = '#00e0ff'; ctx.shadowBlur = 25; ctx.beginPath(); let x = 0; ctx.moveTo(0, 990); const R = RN(Math.floor(t * 13)); while (x < W) { x += 40; ctx.lineTo(x, 990 + (R() - .5) * 40); } ctx.stroke(); ctx.shadowBlur = 0; }
    skyline(1700, t, { seed: 33, tall: 330, col: '#141826' });
  });
  kinetic(['BUSTLING', 'CITIES'], W / 2, 200, 130, t, 14.2);
  if (t > 15.34) stampText('GUARDED', W / 2, 1390, 120, C.gold, seg(t, 15.34, 15.6));
}

// ---------- S6 17.46–22.95: evcilleştirilmiş zırhlı otçullar ----------
function container(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 4; for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(x + w * i / 8, y + 6); ctx.lineTo(x + w * i / 8, y + h - 6); ctx.stroke(); } }
function s6(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#9fd8ff'); sky.addColorStop(1, '#ffe9c2'); ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, H + 600);
  const scroll = (t - 17.46) * 260;
  cam({ zoom: 1.02, t, shake: 2 + (Math.sin(t * 6.4) > .95 ? 6 : 0) }, () => {
    // futuristik şehir arka planda kayar
    const R = RN(4); for (let i = 0; i < 18; i++) { const x = ((i * 140 - scroll * .3) % 2520 + 2520) % 2520 - 300, h = 300 + R() * 500; ctx.fillStyle = 'rgba(80,110,160,.45)'; ctx.fillRect(x, 1250 - h, 110, h); }
    ground(1250, '#c9a46a', '#8a6a3c'); ctx.fillStyle = '#5a5f6a'; ctx.fillRect(-300, 1250, W + 600, 70);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.setLineDash([60, 50]); ctx.lineDashOffset = scroll; ctx.beginPath(); ctx.moveTo(-300, 1285); ctx.lineTo(W + 300, 1285); ctx.stroke(); ctx.setLineDash([]);
    const ax = 560, ay = 1290, s = 900;
    anky(ax, ay, s, t);
    // sırtta konteynerler + sürücü
    const bob = Math.sin(t * 6.4) * 6; ctx.save(); ctx.translate(0, bob);
    container(ax - 330, ay - s * .48 - 170, 300, 120, '#ff3b4e'); container(ax - 20, ay - s * .48 - 150, 260, 110, '#3da5ff'); container(ax - 250, ay - s * .48 - 290, 340, 120, '#ffc83d');
    ctx.save(); ctx.shadowColor = '#fff'; ctx.shadowBlur = 10; human(ax + 330, ay - s * .4, 150); ctx.restore(); ctx.restore();
  });
  kinetic(['DOMESTICATED'], W / 2, 200, 140, t, 18.86, { hl: { DOMESTICATED: C.green } });
  pill('ARMORED', W / 2, 350, 70, C.gold, seg(t, 20.12, 20.4));
  pill('TRANSPORT', W / 2, 460, 70, C.blue, seg(t, 21.36, 21.6));
  pill('LABOR', W / 2, 570, 70, C.red, seg(t, 22.06, 22.3));
  if (t < 18.8) kinetic(['ADVANCED', 'CIVILIZATIONS'], W / 2, 200, 110, t, 17.7);
}

// ---------- S7 23.0–25.7: dünyaya kim hükmeder? ----------
function s7(t) {
  space(t, 40);
  const sw = Math.sin(t * 3.2) * (1 - seg(t, 24.4, 25.2)) * .9;
  cam({ zoom: 1.02, t, shake: 3 }, () => {
    earth(W / 2, 1050, 340, t, { rot: t * .4 + 2, land: '#5b8a3a' });
    // terazi
    const cx = W / 2, cy = 480; ctx.save(); ctx.translate(cx, cy); ctx.rotate(sw * .25); ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-380, 0); ctx.lineTo(380, 0); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.moveTo(cx - 30, cy + 10); ctx.lineTo(cx + 30, cy + 10); ctx.lineTo(cx, cy - 40); ctx.fill();
    const ly = cy - Math.sin(sw * .25) * 380, ry = cy + Math.sin(sw * .25) * 380;
    ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(cx - 380, ly + 170, 150, 0, TAU); ctx.arc(cx + 380, ry + 170, 150, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.shadowColor = '#fff'; ctx.shadowBlur = 20; human(cx - 380, ly + 280, 200); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(cx + 380, ry + 170, 150, 0, TAU); ctx.clip(); rex(cx + 300, ry + 470, 560, t, { walk: 0, jaw: .3 }); ctx.restore();
    crown(cx + Math.sin(t * 3.2) * 380, 210, 130);
  });
  kinetic(['DOMINATE', 'THE', 'EARTH?'], W / 2, 1520 - 160, 110, t, 24.5, { hl: { 'EARTH?': C.gold } });
}

// ---------- S8 25.7–30.36: gölgelerde saklanmak ----------
function bigEye(x, y, w, open, t) { const h = w * .4 * open; ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.5, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.5, -w / 2, 0); ctx.closePath(); ctx.save(); ctx.clip();
  const g = ctx.createRadialGradient(0, 0, 10, 0, 0, w * .5); g.addColorStop(0, '#fff27a'); g.addColorStop(.5, '#e0a80e'); g.addColorStop(1, '#6a3d00'); ctx.fillStyle = g; ctx.fillRect(-w, -w, 2 * w, 2 * w);
  ctx.strokeStyle = 'rgba(120,60,0,.5)'; ctx.lineWidth = 4; for (let i = 0; i < 30; i++) { const a = i / 30 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 60, Math.sin(a) * 60); ctx.lineTo(Math.cos(a) * w * .45, Math.sin(a) * w * .45); ctx.stroke(); }
  const pw = w * (.04 + .02 * Math.sin(t * 2)); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(Math.sin(t * .7) * 30, 0, pw, w * .36, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.strokeStyle = '#1f2a14'; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.5, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.5, -w / 2, 0); ctx.stroke(); ctx.restore(); }
function s8(t) {
  ctx.fillStyle = '#05070a'; ctx.fillRect(0, 0, W, H);
  // pullu deri dokusu
  const R = RN(6); ctx.strokeStyle = 'rgba(70,110,50,.25)'; ctx.lineWidth = 3; for (let i = 0; i < 160; i++) { const x = R() * W, y = R() * 1100; ctx.beginPath(); ctx.arc(x, y, 20 + R() * 25, 0, Math.PI); ctx.stroke(); }
  const op = eo(seg(t, 27.3, 27.9)), blink = (t > 29.0 && t < 29.25) ? .1 : 1;
  cam({ zoom: 1.15 - .1 * seg(t, 25.7, 30.3), t, shake: 2 + 10 * Math.sin(seg(t, 27.3, 27.9) * Math.PI) }, () => {
    if (op > 0) bigEye(W / 2, 560, 900, op * blink, t);
    // mağara kayalığı + saklanan insan gözleri
    ctx.fillStyle = '#0a0c10'; ctx.beginPath(); ctx.moveTo(-200, H); ctx.lineTo(-200, 1050); ctx.quadraticCurveTo(300, 960, 540, 1100); ctx.quadraticCurveTo(800, 980, W + 200, 1060); ctx.lineTo(W + 200, H); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(540, 1270, 230, 150, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(310, 1270, 460, 40);
    const shk = t > 27.4 ? Math.sin(t * 40) * 3 : 0; ctx.fillStyle = '#fff'; for (const [ex, ey] of [[490, 1230], [590, 1230]]) { ctx.beginPath(); ctx.ellipse(ex + shk, ey, 20, 14 * (Math.sin(t * 1.7) > .97 ? .2 : 1), 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#000'; for (const ex of [490, 590]) { ctx.beginPath(); ctx.arc(ex + shk + 4, 1230, 7, 0, TAU); ctx.fill(); }
  });
  if (t < 27.3) kinetic(['HIDING', 'IN', 'THE', 'SHADOWS?'], W / 2, 260, 120, t, 26.8, { hl: { 'SHADOWS?': '#9aa7c0' } });
  bigText('REPTILIAN RULERS', W / 2, 1420, 120, '#ffd23a', seg(t, 28.5, 28.8), { glow: '#e0a80e' });
}

const THEO = ['Humans would never exist', 'Raptor scientists!', 'Dino-powered trains', 'We would live in walls', 'T-Rex as pets', 'Mammals lose again'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const w1 = whip(t, 3.0, .3), w2 = whip(t, 5.2, .3, -1), w3 = whip(t, 10.6, .3), w4 = whip(t, 17.46, .3, -1), w5 = whip(t, 23.0, .3), w6 = whip(t, 30.36, .3, -1);
  if (t < 3.2) cam({ y: w1.offA }, () => s1(t));
  if (t > 2.8 && t < 5.4) cam({ y: t < 4.1 ? w1.offB : w2.offA }, () => s2(Math.max(t, 3.0)));
  if (t > 5.0 && t < 10.8) cam({ y: t < 8 ? w2.offB : w3.offA }, () => s3(Math.max(t, 5.2)));
  if (t > 10.4 && t < 14.3) cam({ y: w3.offB }, () => s4(Math.max(t, 10.6)));
  if (t >= 13.92 && t < 17.66) iris(t, 13.92, .4, () => s4(t), () => cam({ y: w4.offA }, () => s5(t)), W / 2, 1000);
  if (t > 17.26 && t < 23.2) cam({ y: t < 20 ? w4.offB : w5.offA }, () => s6(Math.max(t, 17.46)));
  if (t > 22.8 && t < 26.1) cam({ y: w5.offB }, () => s7(Math.max(t, 23.0)));
  if (t >= 25.7 && t < 30.56) { const k = seg(t, 25.7, 26.1); if (k < 1) s7(t); ctx.save(); ctx.globalAlpha = k; cam({ y: w6.offA }, () => s8(t)); ctx.restore(); }
  if (t > 30.16) cam({ y: w6.offB }, () => cta(Math.max(t, 30.36), 30.36, 31.92, 32.5, THEO, { tint: 'rgba(90,200,90,.18)', dot: '160,230,140' }));
  motionStreak(Math.max(w1.blur, w2.blur, w3.blur, w4.blur, w5.blur, w6.blur));
  glitch((t > 27.3 && t < 27.5 ? .8 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
