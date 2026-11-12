// "Discipline Over Motivation" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 28.4; window.DUR = DUR;
const cv = document.getElementById('c'), g = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return [c, c.getContext('2d')]; };
const [tmp, tg] = mk(), [txc, xg] = mk();
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => clamp((t - a) / (b - a)), lerp = (a, b, u) => a + (b - a) * u;
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); }, eo = x => 1 - Math.pow(1 - clamp(x), 3), ei = x => Math.pow(clamp(x), 3), eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = x => { x = clamp(x); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const RED = '#ff2a3c', WHITE = '#f6f7fb', GREY = '#5a5a66';
let T0 = 0, HG = 0;
const A = (x, y, s, pose, o = {}) => ayaz(g, x, y, s, pose, { t: T0, mode: 'kor', hourglass: HG, ...o });   // AYAZ — always red
const ground = (x, y, s, grow = 1) => emberGround(g, x, y, s, grow, { mode: 'kor' });
let WD = [];
const w = (q, after = -1) => { const x = WD.find(z => z[0].toLowerCase().replace(/[^a-z]/g, '') === q && z[1] > after); return x ? x[1] : 0; };

// ---------------- drawing helpers ----------------
function neon(path, col, wd = 4, glow = 22, fill = null, a = 1) {
  g.save(); g.globalAlpha *= a; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); path(g);
  if (fill) { g.fillStyle = fill; g.fill(); }
  g.shadowColor = col; g.shadowBlur = glow; g.strokeStyle = col; g.lineWidth = wd; g.stroke();
  g.shadowBlur = 0; g.globalAlpha *= .65; g.strokeStyle = '#fff'; g.lineWidth = Math.max(1, wd * .3); g.stroke(); g.restore();
}
function bg(t, glow = .15, cx = W / 2, cy = H * .55) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.shadowBlur = 0; g.fillStyle = '#030305'; g.fillRect(0, 0, W, H);
  const r = g.createRadialGradient(cx, cy, 0, cx, cy, 1000); r.addColorStop(0, `rgba(255,26,48,${.25 * glow})`); r.addColorStop(1, 'rgba(255,26,48,0)'); g.fillStyle = r; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 50; i++) { const x = (hash(i) * W + t * 10 * (1 + hash(i + 9))) % W, y = (hash(i + 3) * H - t * 25 * (.4 + hash(i + 5)) + H * 9) % H; g.fillStyle = `rgba(255,80,100,${.05 + .07 * hash(i + 7)})`; g.fillRect(x, y, 2.5, 2.5); }
}
const cam = (cx, cy, z, rot = 0, sx = 0, sy = 0) => { g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W / 2 + sx, H / 2 + sy); g.rotate(rot); g.scale(z, z); g.translate(-cx, -cy); };
const shake = (t, t0, amp = 22, d = .4) => { const u = seg(t, t0, t0 + d); if (u <= 0 || u >= 1) return [0, 0]; return [Math.sin(t * 91) * amp * (1 - u), Math.cos(t * 77) * amp * (1 - u)]; };
const line = (x0, y0, x1, y1, col = 'rgba(255,255,255,.35)', wd = 3) => { g.strokeStyle = col; g.lineWidth = wd; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
function label(txt, x, y, size, col = WHITE, k = 1, rot = 0, font = 'Anton') {
  if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); g.font = `${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = col === RED ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.4)'; g.shadowBlur = 26; g.fillStyle = col; g.fillText(txt, 0, 0); g.restore();
}
function shatter(fn, u, cx, cy, seed = 1) {
  xg.setTransform(1, 0, 0, 1, 0, 0); xg.clearRect(0, 0, W, H); fn(xg);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  if (u <= 0) { g.drawImage(txc, 0, 0); g.restore(); return; }
  const n = 9, m = 16;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const x0 = i * W / n, y0 = j * H / m, id = i * m + j + seed * 1000, dx = x0 + W / n / 2 - cx, dy = y0 + H / m / 2 - cy, d = Math.hypot(dx, dy) + 1, sp = (500 + hash(id) * 900) * u, rot = (hash(id + 1) - .5) * 6 * u;
    for (let tri = 0; tri < 2; tri++) { g.save(); g.globalAlpha = 1 - ei(u); g.translate(x0 + dx / d * sp + W / n / 2, y0 + dy / d * sp + H / m / 2 + 400 * u * u); g.rotate(rot + tri); g.translate(-(x0 + W / n / 2), -(y0 + H / m / 2));
      g.beginPath(); if (tri) { g.moveTo(x0, y0); g.lineTo(x0 + W / n, y0); g.lineTo(x0, y0 + H / m); } else { g.moveTo(x0 + W / n, y0); g.lineTo(x0 + W / n, y0 + H / m); g.lineTo(x0, y0 + H / m); } g.clip(); g.drawImage(txc, 0, 0); g.restore(); } }
  g.restore();
}
const hand = (k, x, y, s, near = true) => { const p = near ? k.A1.wr : k.A2.wr; return [x + p[0] * s, y + p[1] * s]; };

// ---------------- captions: one huge word at a time, centred, alternating colour ----------------
const KEY = /motivation|liar|excited|week|abandons|hard|discipline|care|feel|exhausted|work|nobody|watching|forward|fire|out|change|habits|empires|ready|acting|mission|action|momentum|mood/i;
function captions(t, y = 300) {
  if (t > DUR - .9) return;
  let i = WD.findIndex((z, j) => t >= z[1] - .02 && (!WD[j + 1] || t < WD[j + 1][1] - .02)); if (i < 0) return;
  const [word, a] = WD[i], k = back(seg(t, a - .02, a + .12)), s = word.toUpperCase().replace(/[^A-Z'!?]/g, '');
  g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W / 2, y); g.scale(k, k); g.rotate((i % 2 ? 1 : -1) * .03);
  g.font = '150px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; const ww = g.measureText(s).width, f = Math.min(1, 940 / ww); g.scale(f, f);
  const hot = KEY.test(s); g.lineWidth = 18; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.strokeText(s, 0, 0);
  g.shadowColor = hot ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.5)'; g.shadowBlur = hot ? 36 : 14; g.fillStyle = hot ? RED : WHITE; g.fillText(s, 0, 0); g.restore();
}

// ---------------- poses ----------------
const P = {
  hold: { ...POSE.hero, head: -.3, a1: -2.95, a2: -.05 },
  hang1: { lean: -.05, head: -.3, a1: -3.0, a2: 0, f1: -2.4, f2: -.4, q1: -.3, k1: .5, q2: .2, k2: .6 },
  fall: { lean: -.25, head: -.4, a1: -2.3, a2: -.4, f1: -1.6, f2: -.6, q1: -.6, k1: 1.0, q2: .3, k2: .8 },
  land: { ...POSE.kneel, head: .2 },
  lie: { lean: 0, head: 0, a1: .05, a2: 0, f1: 0, f2: 0, q1: 0, k1: 0, q2: 0, k2: 0 },
  sitUp: { ...POSE.sitFloor, head: .1, a1: -.2, a2: -.4, f1: -.1, f2: -.5 },
  guard: { ...POSE.hero, lean: .12, a1: -.6, a2: -1.9, f1: -.4, f2: -1.9, q1: -.4, k1: .2, q2: .35, k2: .1 },
  jab: { ...POSE.hero, lean: .28, a1: -1.57, a2: 0, f1: -.4, f2: -1.9, q1: -.55, k1: .3, q2: .4, k2: .1, y: 15 },
  cross: { ...POSE.hero, lean: .32, a1: -.6, a2: -1.9, f1: -1.57, f2: 0, q1: -.55, k1: .3, q2: .4, k2: .1, y: 15 },
  smash: { ...POSE.hero, lean: .3, a1: -2.6, a2: -.3, f1: -2.4, f2: -.4, q1: -.5, k1: .3, q2: .4, k2: .15 },
  smashDn: { ...POSE.hero, lean: .6, head: .3, a1: -1.2, a2: -.1, f1: -1.1, f2: -.2, q1: -.7, k1: .7, q2: .45, k2: .2, y: 50 },
  point: { ...POSE.hero, head: -.1, a1: -1.6, a2: -.05 },
};
const run = t => mixPose(POSE.runA, POSE.runB, .5 + .5 * Math.sin(t * 15));
const walk = t => mixPose(POSE.walkA, POSE.walkB, .5 + .5 * Math.sin(t * 7));
function face(x, y, r, kind, a = 1) {      // a grey mood face (tired / sad / meh / excited)
  neon(c => { c.arc(x, y, r, 0, 7); }, '#9a9aa6', 4, 10, 'rgba(25,25,32,.9)', a);
  neon(c => { if (kind === 'tired') { c.moveTo(x - r * .5, y - r * .15); c.lineTo(x - r * .15, y - r * .15); c.moveTo(x + r * .15, y - r * .15); c.lineTo(x + r * .5, y - r * .15); } else { c.moveTo(x - r * .3 + 4, y - r * .2); c.arc(x - r * .3, y - r * .2, 4, 0, 7); c.moveTo(x + r * .3 + 4, y - r * .2); c.arc(x + r * .3, y - r * .2, 4, 0, 7); }
    if (kind === 'sad' || kind === 'tired') c.arc(x, y + r * .55, r * .35, Math.PI * 1.15, Math.PI * 1.85); else if (kind === 'meh') { c.moveTo(x - r * .3, y + r * .35); c.lineTo(x + r * .3, y + r * .35); } else c.arc(x, y + r * .1, r * .4, .2, Math.PI - .2); }, '#c8c8d2', 3.5, 8, null, a);
}

// ---------------- scenes ----------------
const F = {
  liar(t, a, b) {          // a neon MOTIVATION sign sputters out — a red LIAR burns underneath
    bg(t, .15); cam(540, 900, lerp(1.0, 1.12, seg(t, a, b)), -.03, ...shake(t, w('liar'), 22));
    const fl = t < w('liar') ? (Math.sin(t * 40) > -.3 || t < .3 ? 1 : .15) : 1 - seg(t, w('liar'), w('liar') + .15);
    g.save(); g.globalAlpha = fl; neon(c => { c.roundRect(120, 560, 840, 220, 30); }, '#d8d8e4', 5, 24); label('MOTIVATION', 540, 672, 140, '#e6e6f0'); g.restore();
    const lk = back(seg(t, w('liar') - .02, w('liar') + .2)); if (lk > 0) { neon(c => { c.moveTo(150, 900); c.lineTo(400, 960); c.lineTo(330, 1010); c.lineTo(700, 1060); }, RED, 3, 20, null, lk); label('LIAR', 540, 1000, 260, RED, lk, -.05); }
    A(880, 1650, .55, { ...POSE.hero, head: -.4 }); ground(880, 1650, .55, .4);
  },
  week(t, a, b) {          // hype for a week: a battery charges to 100%, the days tick by
    bg(t, .2); cam(540, 960, lerp(1.05, .98, seg(t, a, b)));
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], p = seg(t, a + .1, b - .1), lvl = p < .55 ? eo(p / .55) : 1 - (p - .55) / .45 * .9;
    neon(c => { c.roundRect(330, 520, 420, 820, 40); c.rect(470, 480, 140, 40); }, '#d8d8e4', 6, 18, 'rgba(255,255,255,.03)');
    const hh = 760 * lvl; g.save(); g.fillStyle = p < .55 ? 'rgba(220,230,255,.5)' : `rgba(255,42,60,${.6})`; g.shadowColor = g.fillStyle; g.shadowBlur = 30; g.fillRect(360, 1310 - hh, 360, hh); g.restore();
    label(Math.round(lvl * 100) + '%', 540, 930, 120, p < .55 ? WHITE : RED);
    days.forEach((d, i) => { const on = p * 7 > i; label(d, 140 + i * 133, 1460, 52, on ? (i === Math.floor(p * 7) ? RED : WHITE) : GREY); });
    A(900, 1720, .45, p < .55 ? POSE.jump : { ...POSE.hero, head: .4 });
  },
  balloon(t, a, b) {       // a grey MOTIVATION balloon lifts him… and pops the second things get hard
    bg(t, .15); const pop = w('hard') - .05, up = eo(seg(t, a, pop)), fall = ei(seg(t, pop, pop + .45));
    cam(540, lerp(1150, 900, up) + 300 * fall, 1.05, .02, ...shake(t, pop + .45, 30));
    const y = lerp(1560, 1100, up) + 460 * fall, rx = 540 + Math.sin(t * 2) * 15;
    line(-400, 1560, 1500, 1560); for (let i = 0; i < 9; i++) neon(c => { c.moveTo(-100 + i * 150, 1560); c.lineTo(-40 + i * 150, 1500); c.lineTo(20 + i * 150, 1560); }, '#8a8a96', 3, 6);
    if (t < pop) { neon(c => { c.moveTo(rx + 10, y - 560); c.quadraticCurveTo(rx + 40, y - 450, rx + 15, y - 330); }, '#9a9aa6', 2, 4); neon(c => { c.ellipse(rx + 10, y - 700, 170, 200, 0, 0, 7); }, '#c8c8d2', 5, 24, 'rgba(200,200,215,.12)'); label('MOTIVATION', rx + 10, y - 700, 54, '#c8c8d2'); }
    else { sparks(g, rx + 10, 400, t - pop, { seed: 9, scale: 1.0, n: 70, life: .7 }); label('POP!', rx + 10, 420, 120, WHITE, back(seg(t, pop, pop + .15)) * (1 - seg(t, pop + .5, pop + .8))); }
    A(rx, y, .9, t < pop ? P.hang1 : t < pop + .45 ? P.fall : P.land); if (t > pop + .45) ground(rx, 1560, .9, seg(t, pop + .45, pop + .9));
  },
  feel(t, a, b) {          // tired, sad, meh — the feelings bounce off him; he keeps walking
    bg(t, .2); const x = lerp(250, 760, seg(t, a, b)); cam(x + 60, 1200, 1.15);
    line(-500, 1560, 2000, 1560); A(x, 1560, .9, walk(t), { wind: .3 });
    // each mood flies in at him, hits his chest and bounces off; he never breaks stride
    [['tired', .55], ['sad', 1.25], ['meh', 1.95]].forEach(([k, d], i) => { const hit = a + d, inn = eo(seg(t, hit - .45, hit)), u = seg(t, hit, hit + .6); if (inn <= 0) return;
      const px = u > 0 ? x + 110 + 380 * u : x + lerp(560, 110, inn), py = u > 0 ? 1180 - 420 * u + 700 * u * u : lerp(1000, 1180, inn) + Math.sin(t * 6 + i) * 10;
      face(px, py, 74, k, 1 - u * .6); if (u > 0 && u < .3) sparks(g, x + 90, 1180, t - hit, { seed: 90 + i, scale: .5, n: 24, life: .4 }); });
  },
  alarm(t, a, b) {         // 5:00 AM: the alarm screams, he gets up anyway
    bg(t, .15); cam(540, 1100, lerp(1.2, 1.05, seg(t, a, b)), 0, ...shake(t, a + .1, 10, 1.2));
    const ring = Math.sin(t * 60) * 6 * (1 - seg(t, a + 1.2, a + 1.4));
    g.save(); g.translate(540 + ring, 800); neon(c => { c.arc(0, 0, 150, 0, 7); }, RED, 6, 30, 'rgba(255,42,60,.12)'); neon(c => { c.arc(-110, -130, 50, Math.PI, 0); c.moveTo(60, -130); c.arc(110, -130, 50, Math.PI, 0); }, RED, 5, 20);
    label('5:00', 0, 10, 110, WHITE); g.restore(); label('EXHAUSTED', 540, 1060, 70, GREY, eo(seg(t, w('exhausted') - .1, w('exhausted') + .2)));
    neon(c => { c.rect(160, 1430, 760, 40); c.moveTo(180, 1470); c.lineTo(180, 1560); c.moveTo(900, 1470); c.lineTo(900, 1560); c.moveTo(160, 1430); c.lineTo(160, 1360); }, '#8a8a96', 4, 6);
    const u = seg(t, a + .3, b - .3);
    if (u < .45) { g.save(); g.translate(560, 1420); g.rotate(-Math.PI / 2); A(0, 0, .75, P.lie); g.restore(); }
    else if (u < .75) A(560, 1430, .75, mixPose(P.sitUp, POSE.sitTall, ss((u - .45) / .3)));
    else { A(lerp(560, 760, (u - .75) / .25), 1560, .75, mixPose(POSE.sitTall, POSE.hero, eo((u - .75) / .25))); ground(760, 1560, .75, .6); }
  },
  work(t, a, b) {          // nobody watching: empty stands, 0 viewers — he hits the bag anyway
    bg(t, .2); cam(540, 1150, lerp(1.05, 1.18, seg(t, a, b)));
    for (let r = 0; r < 5; r++) for (let i = 0; i < 9; i++) neon(c => { c.rect(70 + i * 110, 560 + r * 80, 80, 46); }, '#3a3a44', 2, 0, null, .9);
    label('0 VIEWERS', 540, 480, 64, GREY, eo(seg(t, w('nobody') - .1, w('nobody') + .2)));
    line(-300, 1560, 1400, 1560); const ph = (t - a) / .3, i = Math.floor(ph), hitK = Math.sin(clamp(ph % 1) * Math.PI);
    const sw = Math.sin((t - a) * 9) * .12 + hitK * .18; g.save(); g.translate(760, 860); g.rotate(sw); neon(c => { c.moveTo(0, 0); c.lineTo(0, 120); }, '#9a9aa6', 4, 6); neon(c => { c.roundRect(-75, 120, 150, 380, 50); }, '#c8c8d2', 5, 16, '#141419'); g.restore();
    A(430, 1560, .95, mixPose(P.guard, i % 2 ? P.cross : P.jab, hitK)); if (hitK > .9) sparks(g, 700, 1150, (ph % 1) * .3 - .15, { seed: 30 + i, scale: .5, n: 24, life: .4 });
  },
  fire(t, a, b) {          // walking beside a torch… the fire goes out — he keeps moving, footsteps still burn
    const out = seg(t, w('out') - .5, w('out') + .1); bg(t, .45 * (1 - out) + .05); const x = lerp(200, 900, seg(t, a, b)); cam(x + 50, 1200, 1.12);
    line(-500, 1560, 2200, 1560); for (let i = 0; i < 12; i++) { const fx = 220 + i * 90; if (fx < x - 40) emberGround(g, fx, 1560, .35, 1, { mode: 'kor', seed: i }); }
    const tx = 620, fh = 1 - out; neon(c => { c.moveTo(tx, 1560); c.lineTo(tx, 1260); }, '#9a9aa6', 8, 6);
    if (fh > 0) for (let i = 0; i < 7; i++) { const fy = 1250 - i * 30 * fh - Math.abs(Math.sin(t * 9 + i)) * 30 * fh; neon(c => { c.ellipse(tx + Math.sin(t * 11 + i) * 14, fy, 40 * fh * (1 - i / 9), 70 * fh * (1 - i / 9), 0, 0, 7); }, i < 3 ? RED : '#ff9a4a', 4, 30, `rgba(255,${80 + i * 20},40,.25)`, fh); }
    else for (let i = 0; i < 5; i++) neon(c => { const sy = 1240 - ((t * 120 + i * 60) % 300); c.arc(tx + Math.sin(t * 2 + i) * 30, sy, 18 + i * 4, 0, 7); }, '#55555f', 2, 4, null, .6);
    A(x, 1560, .85, walk(t), { wind: .3 });
  },
  change(t, a, b) {        // feelings change: the weather flips sun → cloud → rain → storm
    bg(t, .15); cam(540, 960, 1.05, Math.sin(t * 3) * .03); const k = Math.floor(seg(t, a, b) * 4), c0 = [540, 760];
    if (k === 0) { neon(c => { c.arc(...c0, 120, 0, 7); }, '#d8d8e4', 5, 24); for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2 + t; neon(c => { c.moveTo(c0[0] + Math.cos(an) * 160, c0[1] + Math.sin(an) * 160); c.lineTo(c0[0] + Math.cos(an) * 220, c0[1] + Math.sin(an) * 220); }, '#d8d8e4', 5, 14); } }
    else { neon(c => { c.arc(440, 780, 110, Math.PI * .8, Math.PI * 1.9); c.arc(600, 720, 140, Math.PI * 1.1, Math.PI * 2); c.arc(720, 800, 90, Math.PI * 1.4, Math.PI * .4); c.lineTo(330, 890); c.closePath(); }, '#9a9aa6', 5, 16, 'rgba(30,30,38,.9)');
      if (k >= 2) for (let i = 0; i < 18; i++) { const x = 330 + (i * 47) % 420, y = 920 + ((t * 900 + i * 80) % 500); neon(c => { c.moveTo(x, y); c.lineTo(x - 10, y + 40); }, '#9ab0ff', 3, 8); }
      if (k === 3) neon(c => { c.moveTo(560, 880); c.lineTo(500, 1050); c.lineTo(580, 1040); c.lineTo(520, 1250); }, '#ffffff', 6, 40); }
    A(540, 1620, .7, { ...POSE.hero, head: -.25 }); ground(540, 1620, .7, .6);
  },
  empire(t, a, b) {        // habits build empires: daily blocks multiply into a red skyline
    bg(t, .35); const u = seg(t, a, b); cam(540, lerp(1350, 1050, eo(u)), lerp(1.4, .62, eo(u)));
    line(-1400, 1560, 2500, 1560);
    for (let i = 0; i < 17; i++) { const x = -700 + i * 145, hgt = 200 + hash(i + 3) * 900, grow = eo(seg(t, a + .1 + Math.abs(i - 8) * .07, a + .9 + Math.abs(i - 8) * .07)), hh = hgt * grow;
      if (hh <= 2) continue; neon(c => { c.rect(x, 1560 - hh, 120, hh); }, RED, 4, 20, 'rgba(255,42,60,.14)');
      for (let r = 1560 - 60; r > 1560 - hh + 30; r -= 70) for (let q = 0; q < 2; q++) neon(c => { c.rect(x + 22 + q * 48, r - 30, 26, 30); }, '#ff8a96', 2, 8, null, .7); }
    A(540, 1560, .7, POSE.hero); ground(540, 1560, .7, 1);
    label('EMPIRES', 540, 380 + (1 - eo(u)) * 0, 0, RED, 0);
  },
  ready(t, a, b) {         // "feel ready": a loading bar stuck at 99% — he smashes it
    bg(t, .2); const hit = w('ready') + .25, u = seg(t, hit, hit + .8); cam(540, 1050, lerp(1.1, 1.0, seg(t, a, b)), 0, ...shake(t, hit, 32));
    shatter(c => { c.save(); c.strokeStyle = '#d8d8e4'; c.lineWidth = 6; c.shadowColor = '#fff'; c.shadowBlur = 16; c.strokeRect(160, 720, 760, 120); c.fillStyle = 'rgba(220,225,240,.55)'; c.fillRect(176, 736, 728 * .99, 88);
      c.font = '90px Anton'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#e6e6f0'; c.fillText('READY… 99%', 540, 620); c.restore(); }, u, 540, 780, 61);
    if (u <= 0) neon(c => { c.arc(540, 960, 40, t * 8, t * 8 + 4.5); }, '#d8d8e4', 6, 16);
    A(470, 1560, .95, t < hit - .2 ? POSE.hero : t < hit ? P.smash : P.smashDn); line(-300, 1560, 1400, 1560);
    sparks(g, 540, 780, t - hit, { seed: 62, scale: 1.1, n: 110, life: 1.0 });
  },
  mission(t, a, b) {       // a mission: the route draws itself across the map to a flag — he sets off
    bg(t, .25); const sp = w('someone'), u = seg(t, a, sp), v = seg(t, sp, b);
    cam(lerp(540, 620, v), lerp(1000, 1150, v), lerp(1.0, 1.1, v));
    g.save(); g.globalAlpha = .25; for (let x = 0; x <= W; x += 90) line(x, 200, x, 1400, '#ff6070', 1); for (let y = 200; y <= 1400; y += 90) line(0, y, W, y, '#ff6070', 1); g.restore();
    g.save(); g.translate(0, 290); neon(c => { c.moveTo(560, 600); c.lineTo(760, 330); c.lineTo(960, 600); c.moveTo(680, 440); c.lineTo(740, 470); c.lineTo(800, 430); }, '#9a9aa6', 4, 8);
    neon(c => { c.moveTo(760, 330); c.lineTo(760, 220); c.lineTo(860, 250); c.lineTo(760, 280); }, RED, 5, 26, 'rgba(255,42,60,.6)'); g.restore();
    const pts = [[160, 1380], [300, 1250], [250, 1110], [460, 1020], [420, 900], [620, 840], [760, 650]], n = pts.length - 1, q = eo(u) * n;
    neon(c => { c.moveTo(...pts[0]); for (let i = 1; i <= Math.floor(q); i++) c.lineTo(...pts[i]); const f = q % 1, i0 = Math.floor(q); if (i0 < n) c.lineTo(lerp(pts[i0][0], pts[i0 + 1][0], f), lerp(pts[i0][1], pts[i0 + 1][1], f)); }, RED, 7, 30);
    const ck = back(seg(t, w('mission') - .05, w('mission') + .2)); if (ck > 0) { g.save(); g.translate(760, 590); g.scale(ck, ck); neon(c => { c.arc(0, 0, 120, 0, 7); c.moveTo(-170, 0); c.lineTo(-60, 0); c.moveTo(60, 0); c.lineTo(170, 0); c.moveTo(0, -170); c.lineTo(0, -60); c.moveTo(0, 60); c.lineTo(0, 170); }, RED, 5, 26); g.restore(); }
    A(lerp(160, 420, v), 1560, .85, v > 0 ? walk(t) : P.point, { wind: v > 0 ? .3 : 0 }); line(-300, 1560, 1400, 1560);
  },
  momentum(t, a, b) {      // action creates momentum: he shoves a giant wheel — it rolls faster and faster
    const mt = w('momentum'), sp = 1 + 6 * seg(t, a + .2, b); bg(t, .4 + .4 * seg(t, mt, mt + .3)); cam(560, 1150, lerp(1.05, 1.2, seg(t, a, b)), 0, ...shake(t, mt, 20));
    const rot = (t - a) * (t - a) * sp, wx = 700 + (t - a) * (t - a) * 160;
    for (let i = 0; i < 26; i++) { const y = 900 + hash(i) * 700, x = ((hash(i + 1) * W - t * 300 * sp) % (W + 400) + W + 400) % (W + 400) - 200; neon(c => { c.moveTo(x, y); c.lineTo(x + 120 + 30 * sp, y); }, i % 3 ? '#ffffff' : RED, 2, 8, null, .3 * seg(t, a + .3, b)); }
    line(-300, 1560, 2400, 1560); g.save(); g.translate(wx, 1300); g.rotate(rot); neon(c => { c.arc(0, 0, 260, 0, 7); }, '#d8d8e4', 7, 24, '#101016'); for (let i = 0; i < 8; i++) neon(c => { c.moveTo(0, 0); c.lineTo(Math.cos(i * Math.PI / 4) * 250, Math.sin(i * Math.PI / 4) * 250); }, RED, 4, 14); g.restore();
    A(wx - 420, 1560, .95, mixPose(POSE.push, run(t * 1.2), seg(t, a + .6, b)), { glow: 1.3 });
    sparks(g, wx - 300, 1150, t - mt, { seed: 71, scale: 1.0, n: 90, life: 1.1 });
  },
  final(t, a, b) {         // ACTION > MOOD
    bg(t, 1.0); cam(540, 1150, lerp(1.0, 1.1, seg(t, a, b)), 0, ...shake(t, w('mood'), 26));
    label('ACTION', 540, 560, 230, RED, back(seg(t, a, a + .2))); label('>', 540, 760, 200, WHITE, back(seg(t, a + .12, a + .32)));
    label('MOOD', 540, 950, 200, GREY, back(seg(t, w('mood') - .05, w('mood') + .15)), -.06);
    if (t > w('mood') + .1) neon(c => { c.moveTo(330, 960); c.lineTo(750, 940); }, RED, 16, 30, null, eo(seg(t, w('mood') + .1, w('mood') + .25)));
    A(540, 1620, .75, POSE.victory, { glow: 1.5 }); ground(540, 1620, .75, 1);
    sparks(g, 540, 760, t - a - .1, { seed: 81, scale: 1.3, n: 140, life: 1.4 }); sparks(g, 250, 1100, t - w('mood'), { seed: 82, scale: .9, n: 80, life: 1.1 }); sparks(g, 830, 1100, t - w('mood') - .1, { seed: 83, scale: .9, n: 80, life: 1.1 });
  },
};
const SC = [];
function scenes() {
  const T = [0, w('it'), w('and'), w('discipline'), w('discipline', 9), w('does'), w('and', 14), w('feelings'), w('but'), w('stop'), w('and', 22), w('action'), w('not', 26.5), DUR];
  const N = ['liar', 'week', 'balloon', 'feel', 'alarm', 'work', 'fire', 'change', 'empire', 'ready', 'mission', 'momentum', 'final'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('momentum') - .2, w('momentum') + .4));     // the peak ritual: the hourglass turns on "momentum"
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  captions(t, 260);
  let d = 9, tc = 0; for (const s of SC) if (s[1] > 0 && Math.abs(t - s[1]) < d) { d = Math.abs(t - s[1]); tc = s[1]; }
  if (d < .1) { const u = 1 - d / .1; g.setTransform(1, 0, 0, 1, 0, 0); tg.clearRect(0, 0, W, H); tg.drawImage(cv, 0, 0);
    for (let k = 1; k <= 5; k++) { g.globalAlpha = .2 * u; g.drawImage(tmp, (t < tc ? -1 : 1) * k * 40 * u, 0); }
    g.globalAlpha = .2 * u * u; g.fillStyle = RED; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  g.setTransform(1, 0, 0, 1, 0, 0); const vg = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.7)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
window.render = render; window.TEXTS = () => [];
(async () => {
  WD = await (await fetch('voice/words.json')).json(); scenes(); window.SC = SC;
  await Promise.all(['150px Anton', '900 96px Montserrat'].map(f => document.fonts.load(f)));
  window.READY = true;
})();
