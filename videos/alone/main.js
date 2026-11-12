// "The Power of Being Alone" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 28.6; window.DUR = DUR;
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
const KEY = /stop|running|solitude|terrified|alone|thoughts|noise|distractions|fake|growth|silence|embrace|validation|crowds|discover|really|unshakable|strength|punishment|ultimate|superpower|mastery/i;
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
  skid: { ...POSE.hero, lean: -.35, head: -.1, a1: .6, a2: -.5, f1: -.9, f2: -.6, q1: -.75, k1: .35, q2: .45, k2: .55, y: 40 },
  face: { ...POSE.hero, lean: .08, head: 0, a1: .3, a2: -.3, f1: -.25, f2: -.3 },
  tremble: { ...POSE.stand, lean: .3, head: .55, a1: -2.3, a2: -1.9, f1: -2.2, f2: -2.0, q1: -.2, k1: .35, q2: .1, k2: .3, y: 20 },
  hunch: { ...POSE.stand, lean: .35, head: .7, a1: -.6, a2: -1.4, f1: -.5, f2: -1.5 },
  meditate: { lean: .02, head: .12, a1: -.35, a2: -1.2, f1: -.3, f2: -1.25, q1: -1.45, k1: 2.6, q2: -1.35, k2: 2.5, y: 300 },
  embrace: { ...POSE.hero, lean: -.12, head: -.35, a1: -1.95, a2: .2, f1: -1.2, f2: .2 },
  sign: { ...POSE.stand, head: -.1, a1: -2.7, a2: -.2, f1: -2.6, f2: -.25 },
  float: { ...POSE.hero, lean: -.05, head: -.25, a1: -2.2, a2: .1, f1: -1.15, f2: .1, q1: -.05, k1: .3, q2: .15, k2: .35 },
};
const run = (t, f = 15) => mixPose(POSE.runA, POSE.runB, .5 + .5 * Math.sin(t * f));
const walk = t => mixPose(POSE.walkA, POSE.walkB, .5 + .5 * Math.sin(t * 7));
const CROWD = { rim: '#34343e', hot: '#4a4a55', glow: 'rgba(80,80,100,' };
const grey = (x, y, s, pose, a = 1, flip = false) => { g.save(); g.globalAlpha *= a; ayaz(g, x, y, s, pose, { col: CROWD, glow: .5, flip }); g.restore(); };
// a black mass with a jagged grey rim that crawls forward (silence / solitude as a wave)
function voidMass(x, top, bot, t, a = 1) {
  neon(c => { c.moveTo(x - 2000, top); for (let y = top; y <= bot; y += 20) c.lineTo(x + Math.sin(y / 60 + t * 6) * 40 + Math.sin(y / 23 - t * 9) * 16, y); c.lineTo(x - 2000, bot); c.closePath(); }, '#6a6a7a', 4, 26, '#000', a);
  for (let i = 0; i < 14; i++) { const y = top + hash(i) * (bot - top), L = 60 + 120 * hash(i + 1); neon(c => { c.moveTo(x + 20, y); c.quadraticCurveTo(x + L * .6, y - 30 + Math.sin(t * 7 + i) * 30, x + L, y + Math.sin(t * 5 + i) * 20); }, '#6a6a7a', 3, 10, null, .6 * a); }
}
function speaker(x, y, s, t) { neon(c => { c.roundRect(x - 70 * s, y - 110 * s, 140 * s, 220 * s, 14 * s); }, '#8a8a96', 4, 8, '#121218'); for (const [dy, r] of [[-45, 32], [45, 46]]) { const p = 1 + .12 * Math.sin(t * 40); neon(c => { c.arc(x, y + dy * s, r * s * p, 0, 7); }, '#8a8a96', 3, 6); } }

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: frame one is already a sprint — a wall of black silence chasing him; on "solitude" he skids, turns, faces it
    const st = w('solitude'); bg(t, .25);
    if (t < st) { const sp = (t - a); cam(560 + sp * 80, 1180, 1.25 - sp * .1, -.05, ...shake(t, a, 14, 1.2));
      for (let i = 0; i < 30; i++) { const y = 700 + hash(i) * 1000, x = ((hash(i + 1) * W * 1.5 - (t - a) * 2400) % (W + 600) + W + 600) % (W + 600) - 300; neon(c => { c.moveTo(x, y); c.lineTo(x + 180, y); }, i % 4 ? '#ffffff' : RED, 2, 8, null, .35); }
      line(-500, 1562, 1800, 1562); voidMass(lerp(240, 400, sp / (st - a)), 250, 1750, t);
      if (t < .12) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(255,42,60,${.35 * (1 - t / .12)})`; g.fillRect(0, 0, W, H); g.restore(); }   // a red hit on frame one
      A(620 + sp * 100, 1560, .95, run(t, 18), { wind: 1, glow: 1.3 }); }
    else { const u = seg(t, st, st + .35), z = lerp(1.0, 1.3, eo(seg(t, st + .3, b))); cam(lerp(600, 520, eo(u)), lerp(1180, 1080, eo(seg(t, st + .3, b))), z, 0, ...shake(t, st, 34, .5));
      line(-500, 1562, 1800, 1562); voidMass(420 + 20 * Math.sin(t * 2), 300, 1700, t); label('SOLITUDE', 330, 1000, 110, '#c8c8d2', back(seg(t, st + .15, st + .45)), Math.PI / 2 * 0);
      A(720, 1560, .95, mixPose(P.skid, P.face, eo(seg(t, st + .15, st + .5))), { flip: t > st + .25, glow: 1.4 });
      for (let i = 0; i < 6; i++) sparks(g, 690 + i * 8, 1555, t - st - i * .02, { seed: 3 + i, scale: .5, n: 20, life: .5 }); }
  },
  terrified(t, a, b) {     // a grey figure alone in a small room — trembling, hands over his head
    bg(t, .05); cam(540, 1250, lerp(1.35, 1.2, seg(t, a, b)), .04);
    neon(c => { c.rect(240, 800, 600, 760); }, '#4a4a56', 4, 0, 'rgba(14,14,20,.9)'); neon(c => { c.moveTo(540, 800); c.lineTo(540, 840); }, '#4a4a56', 3, 0);
    neon(c => { c.ellipse(540, 860, 30, 12, 0, 0, 7); }, '#d8d8e4', 3, 30, 'rgba(230,230,245,.4)', .7 + .3 * Math.sin(t * 30));
    const tr = Math.sin(t * 45) * 5; grey(540 + tr, 1560, .8, P.tremble);
  },
  thoughts(t, a, b) {      // alone with his own thoughts: dark scribbles swarm and thicken around his head
    bg(t, .03); cam(540, 1150, lerp(1.6, 1.85, seg(t, a, b)), -.03);
    grey(540, 1560, .85, P.hunch); const hx = 560, hy = 1050, n = Math.floor(6 + 30 * seg(t, a, b));
    for (let i = 0; i < n; i++) { const an = i * 2.4 + t * (1.5 + hash(i)), r = 110 + 80 * hash(i + 2);
      neon(c => { const x0 = hx + Math.cos(an) * r, y0 = hy + Math.sin(an) * r * .7; c.moveTo(x0, y0); for (let k = 1; k < 8; k++) c.lineTo(x0 + Math.cos(an * 3 + k) * 26 * k * .4, y0 + Math.sin(an * 2 + k * 1.7) * 22); }, '#7a7a88', 2.5, 6, null, .8); }
  },
  noise(t, a, b) {         // so they surround themselves with noise: speakers drop in on every side, shock waves
    bg(t, .08); const nz = w('noise'); cam(540, 1150, 1.05, 0, ...shake(t, nz, 20, .8));
    line(-300, 1562, 1400, 1562); grey(540, 1560, .8, P.hunch);
    [[180, 1320, 0], [900, 1320, .15], [200, 860, .3], [880, 860, .45]].forEach(([x, y, d], i) => { const k = eo(seg(t, a + d, a + d + .3)); if (k <= 0) return; speaker(x, lerp(y - 600, y, k), 1.1, t);
      if (t > nz) for (let r = 0; r < 3; r++) { const ph = ((t - nz) * 1.6 + r / 3) % 1; neon(c => { c.arc(x, y, 130 + ph * 300, (i % 2 ? Math.PI * .6 : -Math.PI * .4), (i % 2 ? Math.PI * 1.4 : Math.PI * .4)); }, '#9a9aa6', 3, 8, null, 1 - ph); } });
  },
  distract(t, a, b) {      // distractions ping in around him; then flat cardboard "friends" are propped up around him
    bg(t, .08); cam(540, 1150, lerp(1.05, 1.15, seg(t, a, b)), .02); const fk = w('fake');
    line(-300, 1562, 1400, 1562); grey(540, 1560, .8, P.hunch);
    const pings = [[260, 900, 'NEW MESSAGE'], [820, 1000, '99+'], [300, 1150, 'LIVE NOW'], [800, 760, 'TRENDING'], [270, 640, 'LIKE?']];
    if (t < fk) pings.forEach(([x, y, s2], i) => { const k = back(seg(t, a + i * .12, a + .2 + i * .12)); if (k <= 0) return; g.save(); g.translate(x, y + Math.sin(t * 5 + i) * 8); g.scale(k, k);
      neon(c => { c.roundRect(-150, -42, 300, 84, 30); }, '#d8d8e4', 3, 14, 'rgba(30,30,40,.95)'); neon(c => { c.arc(-118, 0, 14, 0, 7); }, RED, 3, 12, RED); label(s2, 14, 0, 40, WHITE); g.restore(); });
    else [[230, 1560], [860, 1560], [380, 1560], [720, 1560]].forEach(([x, y], i) => { const k = eo(seg(t, fk + i * .1, fk + .3 + i * .1)); if (k <= 0) return;
      g.save(); g.translate(x, y); g.scale(1, k); neon(c => { c.moveTo(-70, 0); c.lineTo(-70, -330); c.arc(0, -400, 70, Math.PI, 0); c.lineTo(70, 0); c.closePath(); }, '#8a7a5a', 4, 6, 'rgba(60,50,34,.9)');
      neon(c => { c.arc(0, -400, 30, .2, Math.PI - .2); }, '#c8b890', 3, 4); neon(c => { c.moveTo(0, 0); c.lineTo(40, 60); }, '#8a7a5a', 4, 0); g.restore(); });
  },
  silence(t, a, b) {       // silence: everything is gone. He sits, still. A red sprout grows beside him.
    bg(t, .15); cam(540, 1400, lerp(1.5, 1.35, seg(t, a, b)));
    line(-300, 1562, 1400, 1562, 'rgba(255,255,255,.2)'); A(470, 1560, .85, P.meditate, { glow: .9 });
    const gr = eo(seg(t, w('growth') - .1, w('silence') + .5)), sx = 760; if (gr > 0) {
      neon(c => { c.moveTo(sx, 1560); c.quadraticCurveTo(sx - 20, 1560 - 120 * gr, sx + 10, 1560 - 260 * gr); }, RED, 5, 20);
      [[.45, -1], [.7, 1], [.9, -1]].forEach(([h, d], i) => { const lk = seg(gr, h - .2, h + .1); if (lk <= 0) return; const ly = 1560 - 260 * h * gr; neon(c => { c.moveTo(sx, ly); c.quadraticCurveTo(sx + d * 60 * lk, ly - 40 * lk, sx + d * 90 * lk, ly - 10 * lk); c.quadraticCurveTo(sx + d * 50 * lk, ly + 10 * lk, sx, ly); }, RED, 3, 16, 'rgba(255,42,60,.3)'); }); }
  },
  embrace(t, a, b) {       // embrace solitude: arms open wide, a ring of light opens around him
    bg(t, .35); const k = eo(seg(t, w('embrace') - .1, w('embrace') + .4)); cam(540, 1180, lerp(1.25, 1.05, k));
    for (let r = 0; r < 4; r++) { const rr = (180 + r * 160) * k + ((t * 60) % 160) * k; neon(c => { c.arc(540, 1180, rr, 0, 7); }, RED, 3, 18, null, .35 / (r + 1)); }
    line(-300, 1562, 1400, 1562); A(540, 1560, .95, mixPose(POSE.hero, P.embrace, k), { glow: 1 + .4 * k }); ground(540, 1560, .95, k);
  },
  crowds(t, a, b) {        // the crowd holds up score cards for approval — he turns his back and walks off
    bg(t, .15); const turn = w('crowds') - .2; cam(540, 1250, 1.0, 0);
    line(-300, 1562, 1400, 1562); const cards = ['8/10', 'LIKE?', '👍', 'RATE', '5/10'];
    for (let i = 0; i < 5; i++) { const x = 120 + i * 110, drop = seg(t, turn + .4 + i * .08, turn + .8 + i * .08);
      grey(x, 1560, .6, mixPose(P.sign, POSE.stand, drop)); const cy = lerp(1560 - 600 * .6 - 40, 1600, ei(drop));
      g.save(); g.translate(x + 30, cy); g.rotate(drop * 1.2); neon(c => { c.rect(-60, -50, 120, 70); }, '#c8c8d2', 3, 6, '#f0f0f4'); g.font = '40px Anton'; g.fillStyle = '#18181f'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(cards[i], 0, -15); g.restore(); }
    const ax = t < turn ? 860 : lerp(860, 1100, seg(t, turn + .2, b)); A(ax, 1560, .8, t < turn ? { ...POSE.hero, head: -.1 } : walk(t), { flip: t < turn, wind: t < turn ? 0 : .3 });
  },
  discover(t, a, b) {      // who you really are: a grey shell cracks off him — red underneath
    bg(t, .3); const br = w('really') - .05, u = seg(t, br, br + .8); cam(540, 1180, lerp(1.4, 1.2, seg(t, a, b)), 0, ...shake(t, br, 18));
    line(-300, 1562, 1400, 1562); A(540, 1560, .95, POSE.hero, { glow: 1 + u });
    const M = g.getTransform();
    shatter(c => { c.setTransform(M); c.save(); c.filter = 'grayscale(1) brightness(.55)'; ayaz(c, 540, 1560, .95, POSE.hero, { t: T0, mode: 'kor', glow: .3 }); c.filter = 'none'; c.restore();
      if (t > br - .5) { c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.moveTo(520, 1100); c.lineTo(560, 1180); c.lineTo(530, 1260); c.lineTo(570, 1330); c.stroke(); } }, u, 540, 1200, 18);
    if (u > 0) sparks(g, 540, 1200, t - br, { seed: 18, scale: .8, n: 70, life: .8 });
  },
  quake(t, a, b) {         // unshakeable: the world quakes — ground cracks, rocks fall — he alone doesn't move
    bg(t, .3); const q = w('unshakable'), amp = 26 * seg(t, q - .3, q + .1) * (1 - seg(t, b - .5, b)), sx = Math.sin(t * 61) * amp, sy = Math.cos(t * 47) * amp;
    cam(540, 1180, 1.1, 0, sx, sy); line(-300, 1562, 1400, 1562);
    const ck = eo(seg(t, q, q + .6)); neon(c => { c.moveTo(-100, 1562); c.lineTo(lerp(-100, 300, ck), 1600); c.lineTo(lerp(-100, 420, ck), 1580); c.moveTo(1300, 1562); c.lineTo(lerp(1300, 760, ck), 1610); c.lineTo(lerp(1300, 650, ck), 1585); }, '#c8c8d2', 4, 14);
    for (let i = 0; i < 12; i++) { const t0 = a + .1 + hash(i) * 2.2, fy = ei(seg(t, t0, t0 + .65)); if (fy <= 0) continue; const x = 100 + hash(i + 5) * 880; if (Math.abs(x - 540) < 170) continue;
      const r = 40 + 50 * hash(i + 8), y = fy < 1 ? lerp(200, 1562 - r * .6, fy) : 1562 - r * .6, rot = hash(i + 9) * 6 + fy * 2;   // rocks fall, land and stay
      g.save(); g.translate(x, y); g.rotate(rot); neon(c => { c.moveTo(-r, 0); c.lineTo(-r * .4, -r * .8); c.lineTo(r * .6, -r * .6); c.lineTo(r, r * .2); c.lineTo(r * .2, r * .7); c.lineTo(-r * .7, r * .5); c.closePath(); }, '#8a8a96', 4, 8, '#141419'); g.restore();
      if (fy >= 1 && t < t0 + .9) sparks(g, x, 1560, t - t0 - .65, { seed: 40 + i, scale: .4, n: 16, life: .4 }); }
    cam(540, 1180, 1.1);  // he alone stays perfectly still
    A(540, 1560, .95, POSE.hero, { glow: 1.3 }); ground(540, 1560, .95, 1);
  },
  bars(t, a, b) {          // being alone isn't a punishment: cell bars drop around him — then melt away
    bg(t, .25); const pn = w('punishment'), drop = eo(seg(t, a, a + .35)), melt = seg(t, pn + .25, pn + .9); cam(540, 1180, lerp(1.15, 1.05, seg(t, a, b)), 0, ...shake(t, a + .35, 16, .3));
    line(-300, 1562, 1400, 1562); A(540, 1560, .95, POSE.hero);
    for (let i = 0; i < 7; i++) { const x = 300 + i * 80, top = lerp(-400, 760, drop) + melt * 900 * (0.6 + hash(i) * .6); if (top > 1560) continue;
      neon(c => { c.moveTo(x, top); c.lineTo(x + Math.sin(i + t * 3) * 30 * melt, 1560); }, '#9a9aa6', 8, 10, null, 1 - melt * .7); }
    if (melt <= 0) neon(c => { c.moveTo(270, lerp(-400, 760, drop)); c.lineTo(810, lerp(-400, 760, drop)); }, '#9a9aa6', 10, 10);
    label('PUNISHMENT', 540, 640, 110, GREY, back(seg(t, pn - .05, pn + .2)) * (1 - melt));
  },
  power(t, a, b) {         // the ultimate superpower: he rises off the ground, the hourglass turns, light pours out
    const sp = w('superpower'), k = eo(seg(t, sp - .3, sp + .6)); bg(t, .5 + .7 * k, 540, 1000); cam(540, lerp(1180, 1000, k), lerp(1.1, .95, k), Math.sin(t * 1.2) * .03);
    for (let i = 0; i < 36; i++) { const an = i / 36 * Math.PI * 2 + t * .2, L = 1500 * k; neon(c => { c.moveTo(540 + Math.cos(an) * 160, 1150 + Math.sin(an) * 160); c.lineTo(540 + Math.cos(an) * L, 1150 + Math.sin(an) * L); }, RED, 4 + hash(i) * 8, 24, null, .35 * k); }
    line(-300, 1562, 1400, 1562, 'rgba(255,255,255,.25)'); ground(540, 1560, .95, 1);
    A(540, 1560 - 200 * k - Math.sin(t * 2) * 12 * k, .95, mixPose(POSE.hero, P.float, k), { glow: 1.2 + .6 * k, wind: .4 });
    label('SELF-MASTERY', 540, 560, 150, RED, back(seg(t, w('self') - .05, w('self') + .25)));
    sparks(g, 540, 1150, t - sp, { seed: 5, scale: 1.4, n: 150, life: 1.4 }); sparks(g, 260, 700, t - w('self'), { seed: 6, scale: 1, n: 90, life: 1.2 }); sparks(g, 820, 700, t - w('self') - .2, { seed: 7, scale: 1, n: 90, life: 1.2 });
  },
};
const SC = [];
function scenes() {
  const T = [0, w('most'), w('alone'), w('so'), w('distractions'), w('but'), w('when'), w('you', 15.5), w('you', 18), w('and', 20), w('being', 22), w('its'), DUR];
  const N = ['hook', 'terrified', 'thoughts', 'noise', 'distract', 'silence', 'embrace', 'crowds', 'discover', 'quake', 'bars', 'power'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('superpower') - .2, w('superpower') + .4));   // the peak ritual on "superpower"
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  if (n !== 'power') captions(t, 220);
  let d = 9, tc = 0; for (const s of SC) if (s[1] > 0 && Math.abs(t - s[1]) < d) { d = Math.abs(t - s[1]); tc = s[1]; }
  if (d < .1 && tc !== w('but')) { const u = 1 - d / .1; g.setTransform(1, 0, 0, 1, 0, 0); tg.clearRect(0, 0, W, H); tg.drawImage(cv, 0, 0);
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
