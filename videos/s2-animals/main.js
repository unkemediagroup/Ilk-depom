// Seri2 #6 — "What If Animals Could Talk?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 41.95;
const SUBY = 1540;
const GRN = '#3ad06a', RED = '#ff3b4e', GOLD = '#ffc83d', SKY = '#5fd3ff';

function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function say(s, x, y, size, p, col = '#fff', ink = '#111', tx = 0) { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.font = `900 ${size}px Montserrat`; const w = ctx.measureText(s).width + size * 1.1, h = size * 1.9;
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, size * .5); ctx.fill(); ctx.beginPath(); ctx.moveTo(tx - size * .4, h / 2 - 2); ctx.lineTo(tx + size * .3, h / 2 - 2); ctx.lineTo(tx - size * .5, h / 2 + size * .8); ctx.fill();
  txt(s, 0, 2, size, ink, { align: 'center', weight: 900, stroke: 0 }); ctx.restore(); }
// ---- hayvanlar (yan görünüş, sağa bakar; (x,y) = ayak) ----
function legs(s, col, t, n = 4) { ctx.fillStyle = col; for (let i = 0; i < n; i++) { const x = -s * .32 + i * s * .2, sw = Math.sin(t * 6 + i * 1.7) * s * .02; ctx.fillRect(x + sw, -s * .22, s * .07, s * .22); } }
function cow(x, y, s, t, talk = 0) { ctx.save(); ctx.translate(x, y); legs(s, '#2a2a2a', t);
  ctx.fillStyle = '#f4f4f0'; ctx.beginPath(); ctx.roundRect(-s * .45, -s * .6, s * .8, s * .42, s * .14); ctx.fill(); ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.ellipse(-s * .2, -s * .45, s * .12, s * .08, .3, 0, TAU); ctx.ellipse(s * .12, -s * .35, s * .1, s * .07, -.2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#f4f4f0'; ctx.beginPath(); ctx.ellipse(s * .45, -s * .62, s * .16, s * .2, -.3, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffb0b8'; ctx.beginPath(); ctx.ellipse(s * .55, -s * .5, s * .11, s * .08 + talk * s * .04, -.3, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.arc(s * .5, -s * .7, s * .025, 0, TAU); ctx.fill(); ctx.fillStyle = '#e8d8a0'; ctx.beginPath(); ctx.moveTo(s * .35, -s * .78); ctx.lineTo(s * .3, -s * .9); ctx.lineTo(s * .4, -s * .8); ctx.fill(); ctx.restore(); }
function pig(x, y, s, t, talk = 0) { ctx.save(); ctx.translate(x, y); legs(s * .8, '#e88aa0', t);
  ctx.fillStyle = '#ffa8c0'; ctx.beginPath(); ctx.ellipse(-s * .02, -s * .38, s * .42, s * .25, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(s * .36, -s * .45, s * .17, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ff7a9a'; ctx.beginPath(); ctx.ellipse(s * .5, -s * .42, s * .07, s * .06 + talk * s * .03, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a2a3a'; ctx.beginPath(); ctx.arc(s * .48, -s * .43, s * .012, 0, TAU); ctx.arc(s * .53, -s * .43, s * .012, 0, TAU); ctx.arc(s * .38, -s * .52, s * .02, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ff8aa8'; ctx.beginPath(); ctx.moveTo(s * .3, -s * .6); ctx.lineTo(s * .26, -s * .72); ctx.lineTo(s * .36, -s * .62); ctx.fill();
  ctx.strokeStyle = '#ff8aa8'; ctx.lineWidth = s * .02; ctx.beginPath(); ctx.arc(-s * .46, -s * .45, s * .04, 0, TAU * .8); ctx.stroke(); ctx.restore(); }
function chicken(x, y, s, t, talk = 0) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#e8a030'; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.moveTo(-s * .05, -s * .2); ctx.lineTo(-s * .05, 0); ctx.moveTo(s * .08, -s * .2); ctx.lineTo(s * .08, 0); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, -s * .38, s * .25, s * .2, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(s * .2, -s * .6, s * .12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .2, -s * .42); ctx.lineTo(-s * .36, -s * .62); ctx.lineTo(-s * .26, -s * .36); ctx.fill();
  ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(s * .17, -s * .74, s * .05, 0, TAU); ctx.arc(s * .23, -s * .75, s * .05, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffb030'; ctx.beginPath(); ctx.moveTo(s * .3, -s * .62); ctx.lineTo(s * .4, -s * .6 + talk * s * .03); ctx.lineTo(s * .3, -s * .56); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(s * .23, -s * .63, s * .018, 0, TAU); ctx.fill(); ctx.restore(); }
function lion(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#c0782a'; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; ctx.beginPath(); ctx.arc(Math.cos(a) * s * .28, -s * .5 + Math.sin(a) * s * .28, s * .12, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#e8b050'; ctx.beginPath(); ctx.arc(0, -s * .5, s * .24, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -s * .15, s * .3, s * .18, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2a1a0a'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * s * .09, -s * .55, s * .03, s * .015, 0, 0, TAU); ctx.fill(); } ctx.beginPath(); ctx.moveTo(-s * .05, -s * .45); ctx.lineTo(s * .05, -s * .45); ctx.lineTo(0, -s * .4); ctx.fill();
  ctx.strokeStyle = '#2a1a0a'; ctx.lineWidth = s * .015; ctx.beginPath(); ctx.arc(0, -s * .32, s * .07, Math.PI + .4, -.4); ctx.stroke(); ctx.restore(); }
function dog(x, y, s, t, talk = 0) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#b07a48'; ctx.beginPath(); ctx.ellipse(0, -s * .25, s * .3, s * .26, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -s * .62, s * .22, 0, TAU); ctx.fill(); ctx.fillStyle = '#7a4a28'; for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * s * .2, -s * .68); ctx.rotate(sx * .3); ctx.beginPath(); ctx.ellipse(0, s * .1, s * .07, s * .16, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#f2e0c8'; ctx.beginPath(); ctx.ellipse(0, -s * .52, s * .12, s * .09 + talk * s * .03, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(0, -s * .58, s * .04, 0, TAU); ctx.arc(-s * .08, -s * .7, s * .025, 0, TAU); ctx.arc(s * .08, -s * .7, s * .025, 0, TAU); ctx.fill();
  // ağrıyan pati (bandaj)
  ctx.fillStyle = '#b07a48'; ctx.fillRect(-s * .22, -s * .1, s * .12, s * .1); ctx.fillRect(s * .1, -s * .1, s * .12, s * .1); ctx.fillStyle = '#fff'; ctx.fillRect(-s * .23, -s * .06, s * .14, s * .05); ctx.restore(); }
function dolphin(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2) * .15); const g = ctx.createLinearGradient(0, -s * .2, 0, s * .2); g.addColorStop(0, '#5a7a9a'); g.addColorStop(1, '#c9d8e8'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(s * .5, 0); ctx.quadraticCurveTo(s * .2, -s * .2, -s * .4, -s * .04); ctx.lineTo(-s * .55, -s * .16); ctx.lineTo(-s * .5, 0); ctx.lineTo(-s * .55, s * .14); ctx.lineTo(-s * .4, s * .04); ctx.quadraticCurveTo(s * .2, s * .14, s * .5, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -s * .13); ctx.lineTo(-s * .06, -s * .3); ctx.lineTo(s * .1, -s * .12); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(s * .3, -s * .04, s * .02, 0, TAU); ctx.fill(); ctx.restore(); }
function elephant(x, y, s, t) { ctx.save(); ctx.translate(x, y); legs(s, '#7a8494', t * .5); ctx.fillStyle = '#8a94a4'; ctx.beginPath(); ctx.ellipse(-s * .05, -s * .45, s * .4, s * .26, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(s * .35, -s * .55, s * .2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#7a8494'; ctx.beginPath(); ctx.ellipse(s * .25, -s * .52, s * .13, s * .18, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#8a94a4'; ctx.lineWidth = s * .08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(s * .5, -s * .5); ctx.quadraticCurveTo(s * .62, -s * .25, s * .55 + Math.sin(t * 3) * s * .05, -s * .1); ctx.stroke();
  ctx.fillStyle = '#f4f0e0'; ctx.beginPath(); ctx.moveTo(s * .45, -s * .42); ctx.lineTo(s * .62, -s * .38); ctx.lineTo(s * .47, -s * .36); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(s * .42, -s * .62, s * .02, 0, TAU); ctx.fill(); ctx.restore(); }
function birdB(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#3da5ff'; const f = Math.sin(t * 14); ctx.beginPath(); ctx.ellipse(0, 0, s * .3, s * .14, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(s * .26, -s * .08, s * .1, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2a7ad8'; ctx.beginPath(); ctx.moveTo(-s * .05, 0); ctx.quadraticCurveTo(-s * .1, -s * .45 * f, -s * .38, -s * .4 * f); ctx.quadraticCurveTo(-s * .15, -s * .05, s * .1, 0); ctx.fill(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(s * .34, -s * .1); ctx.lineTo(s * .46, -s * .06); ctx.lineTo(s * .34, -s * .03); ctx.fill(); ctx.restore(); }

// ---------- S1 0–3.6: konuşan inek ----------
function s1(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#7ac8ff'); g.addColorStop(.65, '#cfeeff'); g.addColorStop(.66, '#6ab84a'); g.addColorStop(1, '#3a7a2a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const tk = Math.max(0, Math.sin(t * 14)) * seg(t, .3, 3.4);
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 3.5)), t, shake: 2 + 8 * seg(t, 2.0, 2.3) * (1 - seg(t, 2.3, 2.8)) }, () => {
    ctx.fillStyle = '#8a5a2a'; for (let i = 0; i < 8; i++) ctx.fillRect(i * 150, 1150, 20, 200); ctx.fillRect(0, 1190, W, 16); ctx.fillRect(0, 1260, W, 16);
    cow(470, 1450, 900, t, tk);
  });
  say('HELLO, HUMAN.', 640, 590, 64, seg(t, .3, .6), '#fff', '#111', -120);
  if (t > 2.0) say('WE NEED TO TALK.', 600, 760, 52, seg(t, 2.0, 2.3), GOLD, '#111', -120);
  kinetic(['WHAT', 'IF', 'ANIMALS'], W / 2, 200, 140, t, -.3, { gap: .05 });
  kinetic(['COULD', 'TALK?'], W / 2, 360, 170, t, .15, { hl: { 'TALK?': GRN } });
}

// ---------- S2 3.6–7.26: doğayla ilişki sonsuza dek değişir ----------
function s2(t) {
  space(t, 4);
  cam({ zoom: 1.03, rot: t * .05, t, shake: 2 }, () => {
    earth(W / 2, 900, 300, t, { rot: t * .4 });
    const an = [cow, pig, chicken, lion, dolphin, elephant, birdB, dog];
    an.forEach((f, i) => { const a = i / an.length * TAU + t * .4, x = W / 2 + Math.cos(a) * 470, y = 900 + Math.sin(a) * 470; f(x, y + 60, 200, t); say(['MOO?', 'OINK!', 'HEY!', 'GRR...', 'HELLO!', 'LISTEN!', 'TWEET!', 'WOOF!'][i], x, y - 110, 30, seg(t, 3.8 + i * .2, 4.1 + i * .2), '#fff'); });
  });
  kinetic(['CHANGED', 'FOREVER'], W / 2, 230, 150, t, 5.5, { hl: { FOREVER: GRN } });
}

// ---------- S3 7.26–16.38: et/süt sektörü ahlaki kriz, yalvaran hayvanlar ----------
function s3(t) {
  const pleas = t > 10.6;
  if (!pleas) { darkGrad('#2a1a1a', '#0a0606');
    cam({ zoom: 1.04, t, shake: 2 + 12 * seg(t, 9.7, 10.0) * (1 - seg(t, 10.0, 10.5)) }, () => {
      ctx.fillStyle = '#4a4a52'; ctx.fillRect(140, 650, 800, 600); ctx.fillStyle = '#3a3a42'; ctx.beginPath(); ctx.moveTo(140, 650); ctx.lineTo(340, 500); ctx.lineTo(540, 650); ctx.lineTo(740, 500); ctx.lineTo(940, 650); ctx.fill(); ctx.fillRect(780, 360, 80, 290);
      ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.roundRect(260, 760, 560, 140, 20); ctx.fill(); txt('MEAT & DAIRY CO.', W / 2, 832, 56, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      ctx.fillStyle = '#ffd890'; for (let i = 0; i < 4; i++) ctx.fillRect(220 + i * 180, 980, 100, 120);
      stampX(W / 2, 900, 520, seg(t, 9.7, 10.1)); });
    kinetic(['MORAL', 'CRISIS'], W / 2, 260, 170, t, 9.5, { hl: { CRISIS: RED } }); return; }
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a1a1a'); g.addColorStop(1, '#120606'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    ctx.fillStyle = '#2a1a14'; ctx.fillRect(-300, 1350, W + 600, 700);
    const k1 = eback(seg(t, 11.2, 11.5)), k2 = eback(seg(t, 11.98, 12.3)), k3 = eback(seg(t, 12.5, 12.8));
    if (k1 > 0) { ctx.save(); ctx.translate(250, 1350); ctx.scale(k1, k1); cow(0, 0, 420, t, Math.max(0, Math.sin(t * 12))); ctx.restore(); }
    if (k2 > 0) { ctx.save(); ctx.translate(560, 1350); ctx.scale(k2, k2); pig(0, 0, 360, t, Math.max(0, Math.sin(t * 13))); ctx.restore(); }
    if (k3 > 0) { ctx.save(); ctx.translate(860, 1350); ctx.scale(k3, k3); chicken(0, 0, 340, t, Math.max(0, Math.sin(t * 15))); ctx.restore(); }
    // gözyaşları
    for (const [x, y, k] of [[310, 1060, k1], [640, 1150, k2], [935, 1150, k3]]) if (k > .5) { const q = (t * 1.3) % 1; ctx.fillStyle = `rgba(120,200,255,${1 - q})`; ctx.beginPath(); ctx.arc(x, y + q * 80, 9, 0, TAU); ctx.fill(); }
  });
  say('PLEASE...', 270, 790, 46, seg(t, 11.3, 11.6), '#fff'); say('SPARE ME!', 560, 920, 46, seg(t, 12.0, 12.3), '#ffa8c0'); say('I WANT TO LIVE', 820, 1020, 38, seg(t, 12.6, 12.9), GOLD);
  kinetic(['BEGGING', 'FOR', 'THEIR', 'LIVES'], W / 2, 260, 120, t, 13.2, { hl: { LIVES: RED } });
  if (t > 14.76) bigText('IN PLAIN ENGLISH', W / 2, 420, 100, '#fff', seg(t, 14.76, 15.0));
}

// ---------- S4 16.38–23.76: hayvanat bahçeleri ve sirkler kapanır ----------
function s4(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a1a3a'); g.addColorStop(1, '#0a0610'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03 + .06 * seg(t, 19.0, 23.7), t, shake: 2 + 10 * seg(t, 17.48, 17.8) * (1 - seg(t, 17.8, 18.3)) }, () => {
    // sirk çadırı arkada
    ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.moveTo(120, 900); ctx.lineTo(540, 380); ctx.lineTo(960, 900); ctx.fill(); ctx.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(540, 380); ctx.lineTo(220 + i * 220, 900); ctx.lineTo(320 + i * 220, 900); ctx.fill(); }
    ctx.fillStyle = '#3a2a3a'; ctx.fillRect(-300, 1300, W + 600, 700);
    // kafesteki üzgün aslan
    lion(W / 2, 1290, 560, t); ctx.strokeStyle = '#9aa2b0'; ctx.lineWidth = 16; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(200 + i * 85, 820); ctx.lineTo(200 + i * 85, 1300); ctx.stroke(); } ctx.fillStyle = '#6a7280'; ctx.fillRect(180, 800, 720, 30);
    stampText('CLOSED', W / 2, 640, 150, RED, seg(t, 17.48, 17.75));
  });
  say("I'M SO BORED", 360, 1050, 44, seg(t, 21.72, 22.0), '#fff'); say('SO LONELY...', 760, 960, 44, seg(t, 22.38, 22.65), SKY);
  kinetic(['ZOOS', '&', 'CIRCUSES'], W / 2, 230, 140, t, 16.4, { hl: { CIRCUSES: GOLD } });
}

// ---------- S5 23.76–30.44: evcil hayvanlar nerelerinin acıdığını söyler ----------
function s5(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#e8f6ff'); g.addColorStop(1, '#9fd8ff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    // veteriner masası + çapraz işaret
    ctx.fillStyle = '#c9d2de'; ctx.fillRect(140, 1200, 800, 60); ctx.fillRect(200, 1260, 40, 200); ctx.fillRect(840, 1260, 40, 200);
    ctx.fillStyle = GRN; ctx.fillRect(820, 300, 60, 180); ctx.fillRect(760, 360, 180, 60);
    dog(W / 2 - 60, 1200, 620, t, Math.max(0, Math.sin(t * 12)) * seg(t, 25.3, 28.0));
    // patiyi gösteren ok
    if (t > 26.46) { ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.shadowColor = RED; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(W / 2 - 180, 1160, 70, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
    // kalp + tik
    if (t > 28.88) { const k = eback(seg(t, 28.88, 29.2)); ctx.save(); ctx.translate(820, 900); ctx.scale(k, k); ctx.fillStyle = GRN; ctx.beginPath(); ctx.arc(0, 0, 90, 0, TAU); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-10, 30); ctx.lineTo(45, -30); ctx.stroke(); ctx.restore(); }
  });
  say('MY LEFT PAW HURTS', 560, 640, 50, seg(t, 25.5, 25.8), '#fff', '#111', -60);
  kinetic(['THE', 'BRIGHT', 'SIDE'], W / 2, 230, 140, t, 23.8, { hl: { BRIGHT: GOLD } });
  if (t > 28.26) bigText('EFFORTLESS VET CARE', W / 2, 1440, 100, '#1a4a2a', seg(t, 28.26, 28.5), { glow: '#fff' });
}

// ---------- S6 30.44–38.22: yaban hayatı kaçak avcıları ve kirliliği ihbar eder ----------
function s6(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8ad0ff'); g.addColorStop(.5, '#e8f0c8'); g.addColorStop(.5, '#1f73c9'); g.addColorStop(1, '#0a3a6a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    // savan: fil + kuş üstte, denizde yunus
    ctx.fillStyle = '#c9a04a'; ctx.fillRect(-300, 880, W + 600, 80);
    const ke = eback(seg(t, 33.7, 34.0)), kd = eback(seg(t, 32.82, 33.1)), kb = eback(seg(t, 34.42, 34.7));
    if (ke > 0) { ctx.save(); ctx.translate(700, 900); ctx.scale(ke, ke); elephant(0, 0, 520, t); ctx.restore(); }
    if (kb > 0) birdB(250, 480 + Math.sin(t * 3) * 30, 220 * kb, t);
    if (kd > 0) { ctx.save(); ctx.translate(380, 1220); ctx.scale(kd, kd); dolphin(0, 0, 480, t); ctx.restore(); }
    // plastik çöp
    for (let i = 0; i < 6; i++) { ctx.fillStyle = ['#ff8a3a', '#fff', '#3ad06a'][i % 3]; ctx.save(); ctx.translate(650 + i * 60, 1100 + (i % 2) * 70 + Math.sin(t + i) * 10); ctx.rotate(i + t * .3); ctx.fillRect(-18, -30, 36, 60); ctx.restore(); }
    // polis sireni / bildirim
    if (t > 36.44) { const k = eback(seg(t, 36.44, 36.8)); ctx.save(); ctx.translate(880, 330); ctx.scale(k, k); ctx.fillStyle = '#1a2a4a'; ctx.beginPath(); ctx.roundRect(-150, -90, 300, 180, 30); ctx.fill(); ctx.fillStyle = Math.sin(t * 20) > 0 ? RED : '#3d7cff'; ctx.beginPath(); ctx.arc(0, -10, 50, Math.PI, 0); ctx.fill(); txt('REPORTED', 0, 50, 44, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
  });
  say('PLASTIC HERE!', 400, 1060, 40, seg(t, 33.0, 33.3), '#fff'); say('POACHERS AT 3PM!', 650, 560, 40, seg(t, 33.9, 34.2), GOLD); say('I SAW THEM!', 250, 330, 40, seg(t, 34.6, 34.9), '#fff');
  kinetic(['WILDLIFE'], W / 2, 180, 150, t, 30.5, { hl: { WILDLIFE: GRN } });
}

// ---------- S7 38.22–41.95: gezegeni eşit olarak paylaşmak ----------
function s7(t) {
  space(t, 9, { top: '#0a1a2a', bot: '#1a3a2a' });
  const cr = seg(t, 40.58, 41.3);
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    earth(W / 2, 2050, 1000, t, { rot: t * .1 + 1, light: Math.PI / 2, term: -.5, dark: .3 });
    const row = [[human, 300], [cow, 540], [elephant, 820]];
    ctx.save(); ctx.shadowColor = '#fff'; ctx.shadowBlur = 20; human(220, 1120, 330); ctx.restore(); dog(420, 1120, 300, t); cow(660, 1120, 380, t); chicken(900, 1120, 260, t);
    // insanın tacı düşer
    ctx.save(); ctx.translate(220 + cr * 120, 760 + cr * cr * 360); ctx.rotate(cr * 2.5); ctx.globalAlpha = 1 - cr * .6; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(-60, 30); ctx.lineTo(-60, -20); ctx.lineTo(-30, 5); ctx.lineTo(0, -35); ctx.lineTo(30, 5); ctx.lineTo(60, -20); ctx.lineTo(60, 30); ctx.fill(); ctx.restore();
    txt('=', W / 2, 600, 300, GRN, { align: 'center', font: 'Anton', weight: 400, glow: GRN });
  });
  kinetic(['SHARE', 'THE', 'PLANET'], W / 2, 230, 140, t, 38.4, { hl: { PLANET: GRN } });
  if (t > 40.16) bigText('EQUALS, NOT RULERS', W / 2, 1440, 110, '#fff', seg(t, 40.16, 40.4), { glow: GRN });
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 3.6, 7.26, 16.38, 23.76, 30.44, 38.22, 99], S = [s1, s2, s3, s4, s5, s6, s7];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 9.7 && t < 9.9 ? .8 : 0) + (t > 17.48 && t < 17.7 ? .6 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
