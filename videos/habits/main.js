// "Your Habits Create Your Future" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 29.2; window.DUR = DUR;
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
const w = (q, after = -1) => { const x = WD.find(z => z[0].toLowerCase().replace(/[^a-z0-9]/g, '') === q && z[1] > after); return x ? x[1] : 0; };

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
const KEY = /rise|goals|fall|habits|small|daily|choice|empire|future|digging|grave|potential|success|miraculous|compound|interest|discipline|lazy|chaotic|uninspired|too|upgrade|control|actions|force|destiny|change/i;
function captions(t, y = 300) {
  if (t > DUR - .9) return;
  let i = WD.findIndex((z, j) => t >= z[1] - .02 && (!WD[j + 1] || t < WD[j + 1][1] - .02)); if (i < 0) return;
  const [word, a] = WD[i], k = back(seg(t, a - .02, a + .12)), s = word.toUpperCase().replace(/[^A-Z0-9'!?]/g, '').replace(/(\d)S$/, '$1s');
  g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W / 2, y); g.scale(k, k); g.rotate((i % 2 ? 1 : -1) * .03);
  g.font = '150px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; const ww = g.measureText(s).width, f = Math.min(1, 940 / ww); g.scale(f, f);
  const hot = KEY.test(s); g.lineWidth = 18; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.strokeText(s, 0, 0);
  g.shadowColor = hot ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.5)'; g.shadowBlur = hot ? 36 : 14; g.fillStyle = hot ? RED : WHITE; g.fillText(s, 0, 0); g.restore();
}

// ---------------- poses & helpers ----------------
const P = {
  crouch: { ...POSE.hero, lean: .45, head: -.25, a1: .6, a2: -.3, f1: .5, f2: -.3, q1: -1.0, k1: 1.5, q2: -.85, k2: 1.4, y: 110 },
  reachUp: { ...POSE.hero, lean: -.05, head: -.5, a1: -2.9, a2: -.05, f1: -2.6, f2: -.2, q1: -.1, k1: .5, q2: .25, k2: .7 },
  falling: { lean: -.3, head: -.3, a1: -2.6, a2: -.5, f1: -2.1, f2: -.6, q1: -.7, k1: .9, q2: -.2, k2: .7 },
  land: { ...POSE.kneel, head: .1, a1: .4, a2: -.3, f1: -1.1, f2: -.2, y: 125 },
  point: { ...POSE.hero, head: 0, a1: -1.55, a2: -.05 },
  shovelUp: { ...POSE.stand, lean: .2, head: .3, a1: -1.6, a2: -.9, f1: -1.3, f2: -1.0, q1: -.4, k1: .4, q2: .3, k2: .2, y: 20 },
  shovelDn: { ...POSE.stand, lean: .7, head: .4, a1: -.6, a2: -.3, f1: -.4, f2: -.5, q1: -.7, k1: .9, q2: .3, k2: .5, y: 70 },
  wish: { ...POSE.stand, lean: -.15, head: -.55, a1: -2.3, a2: -1.6, f1: -2.2, f2: -1.7 },
  push: { ...POSE.push },
  couch: { ...POSE.sitTall, lean: -.4, head: .2, a1: .25, a2: -.5, f1: .1, f2: -.6 },
  blank: { ...POSE.stand, head: .1, a1: .08, a2: -.05, f1: .02, f2: -.05 },
  wheel: { ...POSE.hero, lean: .15, head: -.05, a1: -1.4, a2: -.6, f1: -1.3, f2: -.7 },
  lever: { ...POSE.hero, lean: .55, head: .1, a1: -.9, a2: -.1, f1: -.8, f2: -.2, q1: -.8, k1: .6, q2: .6, k2: .2, y: 40 },
  leverUp: { ...POSE.hero, lean: -.1, head: -.1, a1: -2.2, a2: -.3, f1: -2.0, f2: -.4 },
};
const run = (t, f = 15) => mixPose(POSE.runA, POSE.runB, .5 + .5 * Math.sin(t * f));
const walk = t => mixPose(POSE.walkA, POSE.walkB, .5 + .5 * Math.sin(t * 7));
const CROWD = { rim: '#34343e', hot: '#4a4a55', glow: 'rgba(80,80,100,' };
const grey = (x, y, s, pose, a = 1, flip = false) => { g.save(); g.globalAlpha *= a; ayaz(g, x, y, s, pose, { col: CROWD, glow: .5, flip }); g.restore(); };

// ---------------- scenes ----------------
const F = {
  rise(t, a, b) {          // HOOK: frame one, he is already leaping at a blazing GOALS line far above — and falls short
    bg(t, .3); const gl = w('goals'), ph = seg(t, 0, 1.9), up = ph < .5 ? Math.sin(ph / .5 * Math.PI / 2) : Math.cos((ph - .5) / .5 * Math.PI / 2), y = 1560 - 380 * up;
    cam(540, 1080, 1.0, 0, ...shake(t, 0, 16, .35));
    if (t < .1) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(255,42,60,${.4 * (1 - t / .1)})`; g.fillRect(0, 0, W, H); g.restore(); }
    neon(c => { c.moveTo(-100, 470); c.lineTo(1200, 470); }, RED, 8, 40); label('GOALS', 860, 410, 90, RED, Math.max(.6, back(seg(t, gl - .05, gl + .2))));
    for (let i = 0; i < 6; i++) neon(c => { c.moveTo(540 + (i - 2.5) * 70, 490); c.lineTo(540 + (i - 2.5) * 70, 560 + 25 * Math.sin(t * 6 + i)); }, RED, 3, 14, null, .4);
    line(-300, 1562, 1400, 1562);
    const pose = t < .1 ? P.crouch : ph < 1 ? mixPose(P.reachUp, P.falling, ph > .5 ? (ph - .5) * 2 : 0) : mixPose(P.land, POSE.hero, eo(seg(t, 1.9, 2.5)));
    const k = A(540, ph < 1 ? y : 1560, .8, pose, { glow: 1.3 }), tip = (ph < 1 ? y : 1560) + Math.min(k.A1.wr[1], k.A2.wr[1]) * .8;
    if (ph < 1 && up > .6) { neon(c => { c.moveTo(560, tip - 10); c.lineTo(560, 490); }, '#ffffff', 2, 10, null, .5 * up); label('?', 640, (tip + 490) / 2, 70, WHITE, up); }   // the gap he cannot close
    if (t > 1.9) ground(540, 1560, .8, seg(t, 1.9, 2.3));
  },
  fall(t, a, b) {          // …you FALL to the level of your habits: through the floors, down to the one called HABITS
    const fl = w('fall'), u = ei(seg(t, a, w('habits'))), y = lerp(-600, 2900, u); bg(t, .2); cam(540, Math.min(y, 2900) - 200, 1.0, 0, ...shake(t, w('habits'), 32));
    [['GOALS', -400], ['DREAMS', 500], ['PLANS', 1400], ['WISHES', 2200]].forEach(([nm, fy]) => { line(-300, fy, 1400, fy, 'rgba(255,255,255,.3)'); label(nm, 860, fy - 60, 64, GREY); });
    neon(c => { c.moveTo(-300, 3100); c.lineTo(1400, 3100); }, RED, 8, 30); for (let i = 0; i < 12; i++) neon(c => { c.rect(-50 + i * 100, 3100, 90, 50); }, RED, 3, 10, 'rgba(255,42,60,.2)');
    label('HABITS', 540, 3260, 140, RED, back(seg(t, w('habits') - .05, w('habits') + .2)));
    const landed = t >= w('habits'); A(540, landed ? 3100 : Math.min(y, 3100), .95, landed ? mixPose(P.land, POSE.hero, eo(seg(t, w('habits') + .3, b))) : P.falling, { glow: 1.2 });
    if (!landed) for (let i = 0; i < 12; i++) neon(c => { const x = 200 + hash(i) * 680, yy = y - 600 - ((t * 2400 + i * 140) % 1400); c.moveTo(x, yy); c.lineTo(x, yy - 160); }, '#ffffff', 2, 6, null, .3);
    else { ground(540, 3100, .95, 1); sparks(g, 540, 3090, t - w('habits'), { seed: 4, scale: 1.0, n: 90, life: .8 }); }
  },
  choice(t, a, b) {        // every small daily choice: three forks fly by — he takes the red road each time
    bg(t, .2); const n = 3, d = (b - a) / n, i = Math.min(n - 1, Math.floor((t - a) / d)), u = ((t - a) / d) % 1; cam(540, 1250, 1.1, Math.sin(i * 2) * .04);
    const pairs = [['PHONE', 'GYM'], ['SNOOZE', 'RUN'], ['SCROLL', 'READ']][i];
    neon(c => { c.moveTo(540, 1920); c.lineTo(540, 1300); c.lineTo(160, 900); c.moveTo(540, 1300); c.lineTo(920, 900); }, '#5a5a66', 10, 0);
    neon(c => { c.moveTo(540, 1300); c.lineTo(lerp(540, 920, seg(u, .25, .7)), lerp(1300, 900, seg(u, .25, .7))); }, RED, 12, 30);
    label(pairs[0], 220, 820, 80, GREY); label(pairs[1], 860, 820, 80, RED, back(seg(u, .2, .4)));
    label('DAY ' + (i + 1), 540, 520, 70, WHITE);
    const px = lerp(540, 860, eio(seg(u, .3, .95))), py = lerp(1560, 1000, eio(seg(u, .3, .95))), s2 = lerp(.7, .4, eio(seg(u, .3, .95)));
    A(px, py, s2, u < .3 ? POSE.hero : walk(t), { wind: .3 });
  },
  empire(t, a, b) {        // building the empire: red bricks fly in from everywhere and lock into a crown above him
    bg(t, .4); cam(540, 1080, lerp(1.0, .95, seg(t, a, b)));
    const crown = []; for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 7; c2++) crown.push([270 + c2 * 80, 900 - r * 60]); for (const [cx, h] of [[270, 3], [510, 4], [750, 3]]) for (let r = 0; r < h; r++) crown.push([cx, 660 - r * 60]);
    crown.forEach(([x, y], i) => { const t0 = a + i * ((b - a - .6) / crown.length), k = eo(seg(t, t0, t0 + .35)); if (k <= 0) return; const fx = lerp(540 + Math.cos(i * 2.4) * 900, x, k), fy = lerp(1100 + Math.sin(i * 2.4) * 900, y, k);
      neon(c => { c.rect(fx - 36, fy - 26, 72, 52); }, RED, 3, 14, 'rgba(255,42,60,.22)'); });
    line(-300, 1562, 1400, 1562); A(540, 1560, .85, mixPose(POSE.hero, POSE.victory, eo(seg(t, b - .7, b - .3)))); ground(540, 1560, .85, 1);
  },
  grave(t, a, b) {         // …or digging the grave of your potential: a grey figure digs his own hole, a headstone rises
    bg(t, .05); cam(540, 1300, lerp(1.1, 1.2, seg(t, a, b)));
    const dug = seg(t, a, b), depth = 60 + 360 * dug; neon(c => { c.moveTo(-200, 1450); c.lineTo(300, 1450); c.lineTo(300, 1450 + depth); c.lineTo(780, 1450 + depth); c.lineTo(780, 1450); c.lineTo(1300, 1450); }, '#6a6a76', 4, 0, '#0a0a0d');
    const ph = ((t - a) / .55) % 1, up = ph < .5; grey(540, 1450 + depth, .7, up ? mixPose(P.shovelDn, P.shovelUp, eo(ph * 2)) : mixPose(P.shovelUp, P.shovelDn, eo((ph - .5) * 2)));
    for (let i = 0; i < 6; i++) { const q = ((t - a) / .55 + i / 6) % 1; neon(c => { c.arc(lerp(560, 880 + i * 30, q), 1450 + depth - 200 - Math.sin(q * Math.PI) * 300, 10, 0, 7); }, '#6a6a76', 3, 0, '#2a2a30', 1 - q); }
    const hs = eo(seg(t, w('grave') - .1, w('grave') + .4)); neon(c => { c.moveTo(860, 1450); c.lineTo(860, 1450 - 260 * hs); c.arc(960, 1450 - 260 * hs, 100, Math.PI, 0); c.lineTo(1060, 1450); }, '#9a9aa6', 5, 10, '#141419');
    if (hs > .6) label('POTENTIAL', 960, 1450 - 160 * hs, 38, '#b8b8c4');
  },
  miracle(t, a, b) {       // success isn't a miracle: he waits for a shooting star — it fizzles out
    bg(t, .05); cam(540, 1150, lerp(1.0, 1.08, seg(t, a, b)));
    for (let i = 0; i < 30; i++) neon(c => { c.arc(hash(i + 3) * W, 250 + hash(i + 4) * 700, 1.6, 0, 7); }, '#ffffff', 1.5, 6, '#fff', .6);
    const s = seg(t, a + .1, w('event')), sx = lerp(950, 300, s), sy = lerp(300, 700, s), dead = seg(t, w('event'), w('event') + .5);
    neon(c => { c.moveTo(sx, sy); c.lineTo(sx + 220, sy - 140); }, '#ffffff', 4 * (1 - dead), 24, null, 1 - dead); neon(c => { c.arc(sx, sy, 12, 0, 7); }, '#ffffff', 4, 30, '#fff', 1 - dead);
    if (dead > 0) for (let i = 0; i < 5; i++) neon(c => { c.arc(sx + Math.sin(i) * 30, sy + 40 + i * 30 * dead, 6, 0, 7); }, '#6a6a76', 2, 0, null, 1 - dead);
    label('MIRACLE?', 540, 900, 110, GREY, back(seg(t, w('miraculous') - .05, w('miraculous') + .2)) * (1 - seg(t, b - .3, b)));
    if (dead > .3) neon(c => { c.moveTo(300, 905); c.lineTo(780, 895); }, RED, 12, 24, null, eo(seg(dead, .3, .6)));
    line(-300, 1562, 1400, 1562); grey(400, 1560, .8, P.wish);
  },
  snowball(t, a, b) {      // compound interest: he pushes a small red ball down a slope — it grows with every turn
    bg(t, .3); const u = seg(t, a, b); cam(lerp(450, 750, u), lerp(1050, 1400, u), lerp(1.05, .85, u), -.12);
    neon(c => { c.moveTo(-200, 900); c.lineTo(1500, 1900); }, '#9a9aa6', 4, 6); const slope = x => 900 + (x + 200) * (1000 / 1700);
    const bx = lerp(250, 1150, eio(u)), r = lerp(40, 260, Math.pow(u, 1.6)), by = slope(bx) - r * 1.16, rot = (bx - 250) / Math.max(r, 40);
    g.save(); g.translate(bx, by); g.rotate(rot); neon(c => { c.arc(0, 0, r, 0, 7); for (let i = 0; i < 6; i++) { c.moveTo(0, 0); c.lineTo(Math.cos(i * 1.05) * r * .9, Math.sin(i * 1.05) * r * .9); } }, RED, 5, 30, 'rgba(255,42,60,.18)'); g.restore();
    const ax = Math.min(bx - r - 70, lerp(150, 700, eio(u))); A(ax, slope(ax), .8, mixPose(P.push, run(t, 10), .3), { wind: .4 });
    label('DISCIPLINE', bx, by, Math.max(30, r * .32), WHITE, seg(t, w('discipline') - .1, w('discipline') + .1));
  },
  lazy(t, a, b) {          // lazy: a grey figure sinks into a couch, lit only by a flickering screen
    bg(t, .05); cam(540, 1350, lerp(1.25, 1.15, seg(t, a, b)), .03);
    neon(c => { c.roundRect(160, 1420, 520, 80, 30); c.rect(160, 1500, 520, 60); c.roundRect(130, 1380, 70, 180, 20); c.roundRect(640, 1380, 70, 180, 20); }, '#55555f', 4, 6, '#0d0d12');
    grey(420, 1510, .75, P.couch); const fl = .5 + .5 * Math.sin(t * 23) * Math.sin(t * 7);
    neon(c => { c.roundRect(760, 1150, 260, 170, 14); }, '#9a9aa6', 4, 20, `rgba(160,170,210,${.15 + .2 * fl})`);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(160,170,210,${.05 + .08 * fl})`; g.beginPath(); g.moveTo(760, 1150); g.lineTo(760, 1320); g.lineTo(200, 1560); g.lineTo(200, 1300); g.fill(); g.restore();
  },
  chaos(t, a, b) {         // chaotic: a tangle of scribbles swallows him — uninspired: the bulb above him dies
    bg(t, .05); const ui = w('uninspired'); cam(540, 1250, 1.15, 0, ...shake(t, a, 10, .5)); line(-300, 1562, 1400, 1562);
    grey(540, 1560, .8, P.blank);
    if (t < ui + .2) { const n = 26; for (let i = 0; i < n; i++) neon(c => { let x = 540 + Math.sin(i * 7.1 + t * 3) * 300, y = 1200 + Math.cos(i * 3.3 + t * 2) * 300; c.moveTo(x, y); for (let k = 0; k < 8; k++) { x += Math.sin(i + k * 2.3 + t * 4) * 90; y += Math.cos(i * 1.7 + k * 1.9 + t * 3) * 90; c.lineTo(x, y); } }, '#7a7a88', 2.5, 4, null, .8 * (1 - seg(t, ui, ui + .2))); }
    const on = t < ui ? 1 : (Math.sin(t * 60) > .3 && t < ui + .4 ? .6 : 0); neon(c => { c.arc(540, 800, 60, 0, 7); c.moveTo(510, 860); c.lineTo(510, 900); c.lineTo(570, 900); c.lineTo(570, 860); }, '#d8d8e4', 4, 30 * on, `rgba(230,230,245,${.3 * on})`);
    neon(c => { c.moveTo(540, 600); c.lineTo(540, 740); }, '#6a6a76', 3, 0);
  },
  mirror(t, a, b) {        // "your future will be too": a mirror shows the same grey slump, older and darker — it cracks
    bg(t, .05); cam(540, 1150, lerp(1.0, 1.1, seg(t, a, b)));
    neon(c => { c.ellipse(540, 1050, 300, 440, 0, 0, 7); }, '#c8c8d2', 6, 20, 'rgba(160,170,200,.06)');
    g.save(); g.beginPath(); g.ellipse(540, 1050, 290, 430, 0, 0, 7); g.clip(); grey(540, 1430, .8, { ...POSE.sitTall, lean: .4, head: .7, a1: .2, a2: -.6, f1: .1, f2: -.6 }, .7); g.restore();
    label('FUTURE', 540, 1560, 90, GREY, back(seg(t, w('future') - .05, w('future') + .2)));
    const ck = eo(seg(t, w('too') - .05, w('too') + .2)); if (ck > 0) neon(c => { c.moveTo(540, 1050); c.lineTo(540 + 120 * ck, 820); c.lineTo(600 + 80 * ck, 700); c.moveTo(540, 1050); c.lineTo(420 - 60 * ck, 1250); c.moveTo(540, 1050); c.lineTo(700 + 60 * ck, 1150); }, '#ffffff', 3, 16);
  },
  upgrade(t, a, b) {       // UPGRADE YOUR HABITS: a level bar slams to MAX — LEVEL UP bursts around him
    bg(t, .4); const lv = eo(seg(t, a + .1, w('habits', 23) + .2)); cam(540, 1150, lerp(1.1, 1.0, seg(t, a, b)), 0, ...shake(t, w('habits', 23) + .2, 18));
    neon(c => { c.roundRect(170, 720, 740, 80, 40); }, '#d8d8e4', 4, 14, 'rgba(15,15,20,.9)'); g.save(); g.shadowColor = RED; g.shadowBlur = 24; g.fillStyle = RED; g.beginPath(); g.roundRect(178, 728, 724 * lv, 64, 32); g.fill(); g.restore();
    label('LV ' + (1 + Math.round(lv * 98)), 540, 630, 90, lv > .98 ? RED : WHITE);
    if (lv > .98) label('LEVEL UP!', 540, 900, 120, RED, back(seg(t, w('habits', 23) + .2, w('habits', 23) + .4)));
    for (let r = 0; r < 3; r++) { const ph = seg(t, w('habits', 23) + .2 + r * .1, w('habits', 23) + .8 + r * .1); if (ph > 0 && ph < 1) neon(c => { c.arc(540, 1250, 120 + ph * 500, 0, 7); }, RED, 4, 20, null, 1 - ph); }
    line(-300, 1562, 1400, 1562); A(540, 1560, .95, POSE.victory, { glow: 1 + lv }); ground(540, 1560, .95, lv);
  },
  control(t, a, b) {       // take control: he grabs a big wheel and hauls it round — the whole horizon tilts with him
    bg(t, .3); const turn = Math.sin(seg(t, a, b) * Math.PI) * .9; cam(540, 1150, 1.1, turn * .18);
    neon(c => { c.moveTo(-300, 1400); c.lineTo(1400, 1400); }, '#6a6a76', 3, 0);
    g.save(); g.translate(640, 1050); g.rotate(turn * 2.2); neon(c => { c.arc(0, 0, 230, 0, 7); c.arc(0, 0, 40, 0, 7); for (let i = 0; i < 3; i++) { c.moveTo(Math.cos(i * 2.09) * 40, Math.sin(i * 2.09) * 40); c.lineTo(Math.cos(i * 2.09) * 225, Math.sin(i * 2.09) * 225); } }, RED, 7, 30, 'rgba(255,42,60,.1)'); g.restore();
    A(330, 1560, .9, P.wheel, { glow: 1.2 }); line(-300, 1562, 1400, 1562);
  },
  destiny(t, a, b) {       // FORCE YOUR DESTINY TO CHANGE: he yanks a giant rail lever — the track switches, a red line blazes to the horizon
    const pull = w('force'), sw = eo(seg(t, pull, pull + .3)); bg(t, .5 + .7 * sw, 540, 900); cam(540, 1150, lerp(1.0, 1.1, seg(t, a, b)), 0, ...shake(t, pull + .2, 30));
    neon(c => { c.moveTo(540, 1920); c.lineTo(540, 1350); c.lineTo(200, 800); }, '#5a5a66', 12, 0, null, 1 - .6 * sw);
    neon(c => { c.moveTo(540, 1350); c.lineTo(lerp(200, 880, sw), 800); }, sw > .5 ? RED : '#5a5a66', 12, 30 * sw);
    neon(c => { c.moveTo(880, 800); c.lineTo(lerp(880, 1000, sw), lerp(800, 500, sw)); }, RED, 12, 40, null, sw);
    label('DESTINY', 760, 700, 130, RED, back(seg(t, w('destiny') - .05, w('destiny') + .2)));
    g.save(); g.translate(400, 1560); g.rotate(lerp(-.6, .6, sw)); neon(c => { c.moveTo(0, 0); c.lineTo(0, -320); }, '#c8c8d2', 10, 10); neon(c => { c.arc(0, -330, 28, 0, 7); }, RED, 5, 20, 'rgba(255,42,60,.5)'); g.restore();
    neon(c => { c.rect(350, 1540, 100, 40); }, '#8a8a96', 4, 4, '#121218');
    A(250, 1560, .9, t < pull ? P.leverUp : mixPose(P.leverUp, P.lever, sw), { glow: 1.3 }); line(-300, 1562, 1400, 1562);
    sparks(g, 540, 1350, t - pull - .2, { seed: 70, scale: 1.0, n: 100, life: 1.0 }); sparks(g, 880, 700, t - w('destiny'), { seed: 71, scale: 1.3, n: 140, life: 1.3 });
  },
};
const SC = [];
function scenes() {
  const T = [0, w('you', 2), w('every'), w('is', 7), w('or'), w('success'), w('its'), w('if'), w('chaotic'), w('your', 21), w('upgrade'), w('take'), w('and', 26), DUR];
  const N = ['rise', 'fall', 'choice', 'empire', 'grave', 'miracle', 'snowball', 'lazy', 'chaos', 'mirror', 'upgrade', 'control', 'destiny'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('destiny') - .2, w('destiny') + .4));   // the peak ritual on "destiny"
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  captions(t, 220);
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
