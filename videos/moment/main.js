// "Stop Waiting for the Perfect Moment" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 45.0; window.DUR = DUR;
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
const KEY = /breath|waiting|permission|never|sign|look|excuses|life|passing|calendar|today|safe|stars|align|risk|victory|shook|room|messy|plan|shaking|hands|burning|desire|change|reality|storm|run|rain|illusion|control|doubts|loud|potential|deafening|stop|edge|jump|adapt|conquer|moment|now/i;
function captions(t, y = 300) {
  if (t > DUR - .9) return;
  let i = WD.findIndex((z, j) => t >= z[1] - .02 && (!WD[j + 1] || t < WD[j + 1][1] - .02)); if (i < 0) return;
  const [word, a] = WD[i], k = back(seg(t, a - .02, a + .12)), s = word.toUpperCase().replace(/[^A-Z0-9:'!?]/g, '').replace(/(\d)S$/, '$1s');
  g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W / 2, y); g.scale(k, k); g.rotate((i % 2 ? 1 : -1) * .03);
  g.font = '150px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; const ww = g.measureText(s).width, f = Math.min(1, 940 / ww); g.scale(f, f);
  const hot = KEY.test(s); g.lineWidth = 18; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.strokeText(s, 0, 0);
  g.shadowColor = hot ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.5)'; g.shadowBlur = hot ? 36 : 14; g.fillStyle = hot ? RED : WHITE; g.fillText(s, 0, 0); g.restore();
}

// ---------------- poses & helpers ----------------
const P = {
  point: { ...POSE.hero, lean: .08, head: 0, a1: -1.55, a2: -.05 },
  gaze: { ...POSE.hero, head: -.4 },
  reach: { ...POSE.hero, lean: .1, head: -.3, a1: -2.2, a2: -.2 },
  guard: { ...POSE.hero, lean: .15, a1: -.7, a2: -1.9, f1: -.5, f2: -1.9, q1: -.45, k1: .25, q2: .35, k2: .1 },
  lie: { lean: 0, head: 0, a1: .05, a2: 0, f1: 0, f2: 0, q1: 0, k1: 0, q2: 0, k2: 0 },
  sitDesk: { ...POSE.sitTall, lean: .3, head: .25, a1: -1.2, a2: -.7, f1: -1.1, f2: -.8 },
  pushUp: { ...POSE.hero, lean: -.1, head: -.3, a1: -3.0, a2: -.1, f1: -2.9, f2: -.15, q1: -.25, k1: .3, q2: .25, k2: .2 },
  place: { ...POSE.hero, lean: .4, head: .3, a1: -1.0, a2: -.3, f1: -.2, f2: -.5, q1: -.55, k1: .6, q2: .4, k2: .2, y: 40 },
  calm: { ...POSE.hero, head: .1, a1: .2, a2: -.2, f1: -.1, f2: -.2 },
  sword: { ...POSE.hero, lean: .05, head: .05, a1: -1.3, a2: -.4, f1: -1.2, f2: -.5 },
  orb: { ...POSE.hero, lean: .05, head: .3, a1: -1.0, a2: -1.3, f1: -.9, f2: -1.4 },
  tongs: { ...POSE.hero, lean: .2, head: .25, a1: -1.25, a2: -.15, f1: -.3, f2: -.6, q1: -.4, k1: .3, q2: .3, k2: .1 },
  tear: { ...POSE.hero, lean: 0, head: .1, a1: -1.6, a2: -.9, f1: -1.5, f2: -1.0 },
  fist: { ...POSE.hero, lean: .1, head: .1, a1: -1.3, a2: -1.6, f1: -1.2, f2: -1.6 },
  sleep: { ...POSE.sitTall, lean: .9, head: .9, a1: .2, a2: -.4, f1: .1, f2: -.4 },
};
const run = (t, f = 15) => mixPose(POSE.runA, POSE.runB, .5 + .5 * Math.sin(t * f));
const walk = t => mixPose(POSE.walkA, POSE.walkB, .5 + .5 * Math.sin(t * 7));
const CROWD = { rim: '#34343e', hot: '#4a4a55', glow: 'rgba(80,80,100,' };
const grey = (x, y, s, pose, a = 1, flip = false) => { g.save(); g.globalAlpha *= a; ayaz(g, x, y, s, pose, { col: CROWD, glow: .5, flip }); g.restore(); };
const floor = (y = 1562, a = .35) => line(-400, y, 1500, y, `rgba(255,255,255,${a})`);
const flash = (t, t0, d = .1, col = '255,42,60', k = .4) => { if (t < t0 || t > t0 + d) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(${col},${k * (1 - (t - t0) / d)})`; g.fillRect(0, 0, W, H); g.restore(); };
function bed(x, y, s, glow = 0) { g.save(); g.translate(x, y); g.scale(s, s); neon(c => { c.roundRect(-260, -90, 520, 90, 18); c.rect(-280, -150, 30, 150); c.rect(250, -110, 30, 110); }, glow ? '#ffb070' : '#6a6a76', 4, glow ? 24 : 4, glow ? 'rgba(120,60,30,.35)' : '#101016'); neon(c => { c.roundRect(-240, -130, 120, 44, 20); }, glow ? '#ffd0a0' : '#8a8a96', 3, glow ? 14 : 0, '#18181f'); g.restore(); }
function sun(x, y, r, k) { neon(c => { c.arc(x, y, r, Math.PI, 0); }, RED, 6, 50, `rgba(255,42,60,${.3 * k})`, k); for (let i = 0; i < 9; i++) { const an = Math.PI + (i + .5) / 9 * Math.PI; neon(c => { c.moveTo(x + Math.cos(an) * (r + 30), y + Math.sin(an) * (r + 30)); c.lineTo(x + Math.cos(an) * (r + 30 + 90 * k), y + Math.sin(an) * (r + 30 + 90 * k)); }, RED, 4, 18, null, k); } }

const Q = {
  holdOut: { ...POSE.hero, lean: .05, head: .15, a1: -1.25, a2: -.1, f1: -1.45, f2: -.3 },
  clutch: { ...POSE.hero },
  brush: { ...POSE.stand, lean: -.05, head: .1, a1: -1.05, a2: .1, f1: -1.55, f2: -.2 },
  flinch: { ...POSE.stand, lean: -.25, head: -.2, a1: -.6, a2: -.9, f1: -2.2, f2: -2.3, q1: .15, k1: .2, q2: .35, k2: .1 },
  catch: { ...POSE.hero, lean: .2, head: 0, a1: -1.5, a2: -.3, f1: -1.6, f2: -.6, q1: -.5, k1: .3, q2: .4, k2: .1 },
  stumble: { lean: .95, head: -.3, a1: -1.7, a2: -1.3, f1: -1.5, f2: -1.2, q1: -.9, k1: 1.2, q2: .7, k2: .5, y: 90 },
  windup: { ...POSE.hero, lean: -.15, head: -.1, a1: 2.3, a2: -.6, f1: 1.6, f2: -.9, q1: -.4, k1: .2, q2: .35, k2: .1 },
  release: { ...POSE.hero, lean: .3, head: -.1, a1: -1.6, a2: .4, f1: -1.5, f2: .2, q1: -.55, k1: .3, q2: .45, k2: .2 },
  punch: { ...POSE.hero, lean: .2, head: 0, a1: -1.55, a2: .3, f1: -1.55, f2: -1.8, q1: -.5, k1: .3, q2: .4, k2: .1 },
  kick: { ...POSE.hero, lean: -.3, head: 0, a1: .5, a2: -.8, f1: .2, f2: -1.2, q1: -1.45, k1: .05, q2: .15, k2: .1 },
  palm: { ...POSE.hero, head: .3, a1: -1.0, a2: -.1, f1: -1.7, f2: -.2 },
  grab: { ...POSE.hero, lean: -.1, head: -.2, a1: -2.3, a2: -.1, f1: -2.4, f2: -.2, q1: -.3, k1: .2, q2: .3, k2: .1 },
  pull: { lean: -.35, head: -.05, a1: -1.3, a2: -1.15, f1: -1.45, f2: -1.3, q1: -.75, k1: .35, q2: .35, k2: .45 },
  cross: { ...POSE.stand, a1: -.3, a2: -.4, f1: -2.3, f2: -2.4 },
};
// fear: a grey-white ghost; y = bottom of its hem
function ghost(x, y, s, t, a = 1, reach = 0, flip = false) {
  g.save(); g.globalAlpha *= a; g.translate(x, y + Math.sin(t * 3) * 14 * s); g.scale(flip ? -s : s, s);
  neon(c => { c.moveTo(-150, 0); c.lineTo(-150, -380); c.arc(0, -380, 150, Math.PI, 0); c.lineTo(150, 0);
    for (let i = 0; i < 6; i++) { const x0 = 150 - i * 50; c.quadraticCurveTo(x0 - 25, 40 + 20 * Math.sin(t * 6 + i), x0 - 50, 0); } }, '#cfd3e0', 4, 30, 'rgba(190,196,215,.14)');
  neon(c => { c.ellipse(-55, -400, 28, 40, 0, 0, 7); c.moveTo(85, -400); c.ellipse(55, -400, 28, 40, 0, 0, 7); c.moveTo(25, -300); c.ellipse(0, -300, 25, 35, 0, 0, 7); }, '#000', 1, 0, '#000');
  const r = 150 + 260 * reach; neon(c => { c.moveTo(130, -280); c.quadraticCurveTo(130 + r * .5, -330 + Math.sin(t * 5) * 20, 130 + r, -260);
    for (let f = -1; f <= 1; f++) { c.moveTo(130 + r, -260); c.lineTo(130 + r + 50, -260 + f * 30); } }, '#cfd3e0', 5, 20);
  g.restore();
}
function key(x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); neon(c => { c.arc(0, 0, 22, 0, 7); c.moveTo(22, 0); c.lineTo(90, 0); c.lineTo(90, 22); c.moveTo(70, 0); c.lineTo(70, 18); }, '#ffb81f', 5, 24); g.restore(); }
function pole(x0, y0, x1, y1) { line(x0, y0, x1, y1, '#9a9aa6', 6); }

const M = {
  float: { lean: .1, head: .15, a1: -.9, a2: -1.3, f1: -1.6, f2: -1.8, q1: -.5, k1: .7, q2: -.2, k2: .9 },
  tap: { ...POSE.stand, q1: -.25, k1: .35 },
  rub: { ...POSE.stand, lean: .15, head: .2, a1: -1.2, a2: .1, f1: -1.3, f2: -.2 },
  stomp: { ...POSE.hero, lean: .05, head: .1, a1: -.6, a2: .4, f1: -1.2, f2: -.2, q1: -1.5, k1: 1.4, q2: .1, k2: .1 },
  glide: { lean: 1.2, head: -.9, a1: .6, a2: .9, f1: .5, f2: .8, q1: .4, k1: .3, q2: .55, k2: .2 },
  ears: { ...POSE.stand, lean: .2, head: .3, a1: -2.2, a2: -2.4, f1: -3.6, f2: -3.7, q1: -.2, k1: .3, q2: .3, k2: .2 },
  roar: { ...POSE.hero, lean: -.2, head: -.4, a1: -.3, a2: .4, f1: -.1, f2: .3, q1: -.45, k1: .25, q2: .45, k2: .15 },
  edge: { ...POSE.stand, lean: .25, head: .7, a1: .25, a2: -.2, f1: .1, f2: -.3 },
};
function cloud(x, y, s, col = '#5a5a66', fill = '#121218', glow = 4) { g.save(); g.translate(x, y); g.scale(s, s); neon(c => { c.moveTo(-300, 60); c.arc(-200, 0, 100, Math.PI * .5, Math.PI * 1.5); c.arc(-60, -80, 140, Math.PI, 0); c.arc(120, -40, 120, Math.PI * 1.2, Math.PI * .1); c.arc(240, 20, 80, -Math.PI * .6, Math.PI * .5); c.closePath(); }, col, 5, glow, fill); g.restore(); }
function bolt(x, y, len, seed, a = 1) { neon(c => { c.moveTo(x, y); let px = x, py = y; for (let i = 1; i <= 6; i++) { px = x + (hash(seed + i) - .5) * 160; py = y + len * i / 6; c.lineTo(px, py); } }, '#ffe0e4', 5, 40, null, a); }
function rain(t, n = 70, ang = .25, a = .5) { for (let i = 0; i < n; i++) { const x = (hash(i) * 1400 + t * 400 * ang) % 1400 - 160, y = (hash(i + 7) * 2200 + t * 2400) % 2200 - 200; line(x, y, x - 50 * ang, y - 70, `rgba(200,205,225,${a})`, 3); } }

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: plunged underwater — bubbles rush past, he hangs there, holding his breath
    const u = eo(seg(t, 0, 1.0)); bg(t, .25, 540, 600); flash(t, 0, .12, '255,42,60', .55); cam(540, lerp(700, 1150, u), lerp(1.6, 1.0, u), lerp(.15, 0, u));
    g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 100 + i * 180 + Math.sin(t + i) * 30; g.fillStyle = 'rgba(255,60,80,.05)'; g.beginPath(); g.moveTo(x, 450); g.lineTo(x + 60, 450); g.lineTo(x + 200, 2000); g.lineTo(x + 80, 2000); g.fill(); } g.restore();
    neon(c => { c.moveTo(-300, 450); for (let x = -300; x < 1400; x += 80) c.quadraticCurveTo(x + 40, 450 + 18 * Math.sin(t * 4 + x), x + 80, 450); }, '#cfd3e0', 4, 20);
    for (let i = 0; i < 40; i++) { const sp = (1 - u) * 2600 + 300, y = (hash(i + 2) * 2200 - t * sp + 4400) % 2200 - 100, x = hash(i) * 1080 + Math.sin(t * 3 + i) * 20; neon(c => { c.arc(x, y, 6 + 18 * hash(i + 4), 0, 7); }, '#cfd3e0', 2, 6, null, .6); }
    const bob = Math.sin(t * 2) * 20; A(540, 1500 + bob, .95, M.float, { wind: .3, glow: 1.2 });
    const k0 = ayaz(g, -9e4, -9e4, .95, M.float, { t: T0 }), hx = 540 + k0.head[0] * .95, hy = 1500 + bob + k0.head[1] * .95;
    for (let i = 0; i < 3; i++) { const q = seg(t, 1.4 + i * .15, 2.2 + i * .15); if (q > 0 && q < 1) neon(c => { c.arc(hx + 30 + Math.sin(q * 9) * 10, hy - 40 - q * 500, 8 + 6 * i, 0, 7); }, '#cfd3e0', 2, 8); }
  },
  queue(t, a, b) {         // waiting: a queue display — NOW SERVING 001 — his ticket says 999; he taps his foot
    bg(t, .15); cam(540, 1150, lerp(1.0, 1.08, seg(t, a, b))); floor();
    neon(c => { c.roundRect(200, 520, 680, 300, 20); }, '#9a9aa6', 5, 6, '#0b0b10'); label('NOW SERVING', 540, 590, 50, GREY); label('001', 540, 720, 150, RED, .7 + .3 * (Math.sin(t * 10) > 0));
    for (let i = 0; i < 4; i++) grey(170 + i * 150, 1560, .55, { ...POSE.stand, head: .2 }, .8);
    const tk = A(800, 1560, .8, { ...(Math.sin(t * 12) > 0 ? M.tap : POSE.stand), a1: -.9, f1: -1.6 }), [tx, ty] = hand(tk, 800, 1560, .8); neon(c => { c.roundRect(tx - 10, ty - 80, 110, 70, 8); }, '#d8d8e4', 3, 8, '#e8e8ee'); g.font = '44px Anton'; g.textAlign = 'center'; g.fillStyle = '#18181f'; g.fillText('999', tx + 45, ty - 30);
  },
  slip(t, a, b) {          // the permission slip that never signs itself: the pen hovers, trembles, never lands — cobwebs creep in
    bg(t, .12); cam(540, 1100, lerp(1.1, 1.25, seg(t, a, b)));
    neon(c => { c.rect(-200, 1350, 1500, 40); }, '#6a6a76', 4, 0, '#121218');
    neon(c => { c.rect(260, 650, 560, 700); }, '#d8d8e4', 4, 10, '#e8e8ee'); g.font = '60px Anton'; g.textAlign = 'center'; g.fillStyle = '#18181f'; g.fillText('PERMISSION SLIP', 540, 760);
    for (let i = 0; i < 5; i++) { g.fillStyle = '#9a9aa6'; g.fillRect(320, 830 + i * 60, 440, 12); } g.fillStyle = '#18181f'; g.font = '44px Anton'; g.textAlign = 'left'; g.fillText('SIGN:', 320, 1240); g.fillRect(450, 1240, 300, 5);
    const dr = eo(seg(t, w('itself') - .1, w('itself') + .3)), px = 640 + Math.sin(t * 3) * 40, py = lerp(1050 + Math.sin(t * 5) * 30, 1320, dr);
    g.save(); g.translate(px, py); g.rotate(lerp(.5, 1.57, dr)); neon(c => { c.moveTo(0, 0); c.lineTo(-20, -40); c.lineTo(-20, -260); c.lineTo(20, -260); c.lineTo(20, -40); c.closePath(); }, RED, 4, 20, '#1a0508'); g.restore();
    const cw = seg(t, a, b); for (const [cx, cy, sx, sy] of [[260, 650, 1, 1], [820, 650, -1, 1]]) for (let i = 0; i < 5; i++) neon(c => { const r = (40 + i * 35) * cw; c.moveTo(cx + sx * r, cy); c.quadraticCurveTo(cx + sx * r * .6, cy + sy * r * .6, cx, cy + sy * r); c.moveTo(cx, cy); c.lineTo(cx + sx * 200 * cw * Math.cos(i * .35), cy + sy * 200 * cw * Math.sin(i * .35)); }, '#8a8a96', 1.5, 0);
  },
  polish(t, a, b) {        // polishing your excuses: a grey figure buffs a gleaming EXCUSES plaque — round and round
    bg(t, .1); cam(lerp(420, 600, eio(seg(t, a, b))), 1200, 1.1); floor();
    const pz = mixPose(M.rub, { ...M.rub, a1: -1.45, f1: -1.1 }, .5 + .5 * Math.sin(t * 9)), k = ayaz(g, 380, 1560, .85, pz, { col: CROWD, glow: .5 }), [hx, hy] = hand(k, 380, 1560, .85);
    neon(c => { c.rect(640, 1250, 220, 312); }, '#6a6a76', 4, 0, '#121218'); neon(c => { c.roundRect(600, 1010, 300, 240, 30); }, '#e8e8ee', 5, 30, 'rgba(200,205,225,.2)'); label('EXCUSES', 750, 1130, 64, WHITE);
    neon(c => { c.ellipse(hx + 30, hy, 50, 34, .3, 0, 7); }, '#b8b8c4', 3, 0, '#3a3a46');
    for (let i = 0; i < 3; i++) { const q = ((t - a) * 1.5 + i / 3) % 1, sx = 640 + hash(i + Math.floor((t - a) * 1.5)) * 220, sy = 1030 + hash(i + 5) * 200, r = 30 * Math.sin(q * Math.PI); neon(c => { c.moveTo(sx - r, sy); c.lineTo(sx + r, sy); c.moveTo(sx, sy - r); c.lineTo(sx, sy + r); }, WHITE, 3, 20); }
  },
  train(t, a, b) {         // life is passing you by: he stands still on the platform while a train of lit windows thunders past
    bg(t, .15); cam(540, 1200, 1.05, 0, Math.sin(t * 50) * 4, 0); floor(1600, .5);
    const off = (t - a) * 3200; g.save(); g.beginPath(); g.rect(-400, 0, 1900, 1520); g.clip();
    for (let c2 = -1; c2 < 3; c2++) { const x = c2 * 1000 - (off % 1000) + 200; neon(c => { c.roundRect(x, 900, 960, 520, 40); }, '#8a8a96', 5, 6, '#101016');
      for (let i = 0; i < 4; i++) neon(c => { c.rect(x + 50 + i * 230, 980, 180, 200); }, RED, 3, 24, `rgba(255,42,60,${.25 + .3 * hash(i + c2 * 4 + Math.floor(off / 1000) * 9)})`); }
    g.restore(); for (let i = 0; i < 12; i++) line(-200 + hash(i) * 1500 - ((t * 4000) % 1500), 900 + hash(i + 2) * 520, -200 + hash(i) * 1500 - ((t * 4000) % 1500) + 300, 900 + hash(i + 2) * 520, 'rgba(255,255,255,.15)', 2);
    grey(540, 1600, .75, { ...POSE.stand, head: .1 }, 1);
  },
  calendar(t, a, b) {      // the calendar will never say "today is safe": the pages tear off one after another — NOT TODAY, NOT TODAY…
    bg(t, .12); cam(540, 1050, 1.05); neon(c => { c.rect(240, 560, 600, 760); }, '#9a9aa6', 5, 6, '#e8e8ee'); neon(c => { c.rect(240, 560, 600, 140); }, RED, 4, 20, '#2a0a10');
    for (let i = 0; i < 6; i++) { neon(c => { c.arc(300 + i * 96, 560, 14, 0, 7); }, '#5a5a66', 3, 0, '#121218'); }
    const n = Math.floor((t - a) / .55); g.font = '110px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#18181f'; g.fillText('NOT', 540, 920); g.fillText('TODAY', 540, 1080);
    for (let j = Math.max(0, n - 2); j <= n; j++) { const q = seg(t, a + j * .55, a + j * .55 + .6); if (q <= 0 || q >= 1) continue; g.save(); g.translate(540 + q * 700, 1000 - q * 500 + q * q * 200); g.rotate(q * 2); g.globalAlpha = 1 - q; g.fillStyle = '#e8e8ee'; g.fillRect(-300, -310, 600, 620); g.fillStyle = '#18181f'; g.fillText('NOT', 0, -80); g.fillText('TODAY', 0, 80); g.restore(); }
    label('TODAY IS SAFE?', 540, 1440, 70, GREY);
  },
  stars(t, a, b) {         // the stars never align: they drift toward a trophy shape — almost — and scatter
    bg(t, .1, 540, 700); cam(540, 1050, 1.0); floor(1700);
    const T2 = [[440, 600], [640, 600], [620, 760], [540, 830], [460, 760], [540, 950], [470, 1010], [610, 1010], [380, 640], [700, 640]];
    const al = eio(seg(t, a + .3, w('victory') - .1)) * .85, sc = eo(seg(t, w('victory'), w('victory') + .5));
    T2.forEach(([tx, ty], i) => { const rx = 80 + hash(i) * 920, ry = 300 + hash(i + 11) * 900; let x = lerp(rx, tx, al) + Math.sin(t * 2 + i) * 25, y = lerp(ry, ty, al) + Math.cos(t * 2 + i) * 25; x += (x - 540) * sc * 1.5; y += (y - 760) * sc * 1.5;
      const r = 14 + 4 * Math.sin(t * 7 + i); neon(c => { c.moveTo(x - r, y); c.lineTo(x + r, y); c.moveTo(x, y - r); c.lineTo(x, y + r); }, WHITE, 3, 24, null, 1 - sc * .6); });
    label('RISK-FREE VICTORY', 540, 1250, 60, GREY, 1 - sc); if (sc > 0) neon(c => { c.moveTo(250, 1260); c.lineTo(250 + 580 * sc, 1240); }, RED, 10, 24);
    A(540, 1700, .55, P.gaze);
  },
  room(t, a, b) {          // people who shook the room: he stomps on the stage — the chandelier swings, dust rains, the audience jolts
    const st = w('shook') - .05, u = seg(t, st, st + 1.2); bg(t, .25 + .3 * (1 - u) * (u > 0)); cam(540, 1150, 1.0, 0, ...shake(t, st, 40, .8));
    const sw = Math.sin((t - st) * 6) * .25 * (1 - u) * (u > 0); g.save(); g.translate(540, 300); g.rotate(sw); neon(c => { c.moveTo(0, 0); c.lineTo(0, 300); c.moveTo(-160, 330); c.quadraticCurveTo(0, 420, 160, 330); c.moveTo(-160, 330); c.lineTo(0, 300); c.lineTo(160, 330); }, '#d8d8e4', 4, 20); for (let i = 0; i < 5; i++) neon(c => { c.arc(-140 + i * 70, 360 + (i % 2) * 20, 10, 0, 7); }, '#ffd0a0', 3, 20, '#ffd0a0'); g.restore();
    if (u > 0) for (let i = 0; i < 30; i++) { const y = 200 + ((u * 900 + hash(i) * 900)) % 900; g.fillStyle = 'rgba(200,200,210,.4)'; g.fillRect(hash(i + 1) * 1080, y, 4, 4); }
    neon(c => { c.rect(140, 1350, 800, 40); }, '#8a8a96', 4, 6, '#121218'); A(540, 1350, .7, t < st - .3 ? POSE.hero : mixPose(M.stomp, POSE.hero, eo(seg(t, st - .1, st))), { glow: 1.3 });
    for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) grey(110 + i * 145 + r * 60, 1700 + r * 120 + (u > 0 && u < .3 ? -20 * Math.sin(u * 30 + i) : 0), .38, { ...POSE.stand, head: -.3 }, .85);
  },
  plan(t, a, b) {          // a messy plan: a scribble races across the sheet — loops, arrows, crossed-out boxes — he points: GO
    bg(t, .2); cam(540, 1050, 1.05); neon(c => { c.rect(160, 520, 760, 900); }, '#d8d8e4', 4, 8, '#e8e8ee'); label('PLAN', 540, 600, 70, '#18181f');
    const n = Math.floor(seg(t, a, b - .2) * 60); g.save(); g.strokeStyle = '#18181f'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); let x = 260, y = 760; g.moveTo(x, y);
    for (let i = 0; i < n; i++) { x = 220 + hash(i * 3.1) * 640; y = 700 + i * 10 + Math.sin(i) * 80; g.lineTo(x, y); } g.stroke(); g.restore();
    if (n > 30) neon(c => { c.arc(700, 1200, 70, 0, 7); }, RED, 6, 20); if (n > 45) label('GO', 700, 1205, 60, RED);
  },
  shake2(t, a, b) {        // shaking hands: extreme close-up on his gloved hand — trembling — then it locks into a fist
    bg(t, .2); const cl = eo(seg(t, b - .45, b - .15)), k0 = ayaz(g, -9e4, -9e4, .95, Q.holdOut, { t: T0 }), [hx, hy] = hand(k0, 540, 1560, .95);
    cam(lerp(hx, 540, .35), lerp(hy, 1150, .35), 1.9, 0, Math.sin(t * 70) * 10 * (1 - cl), Math.cos(t * 63) * 10 * (1 - cl)); floor();
    A(540, 1560, .95, mixPose(Q.holdOut, { ...Q.holdOut, f1: -1.9 }, cl), { glow: 1 + cl });
  },
  burn(t, a, b) {          // a burning desire to change their reality: a flame in his palm — pressed to the grey REALITY wall, it burns a hole through
    const ch = w('change') - .1, u = eo(seg(t, ch, b)); bg(t, .2 + .8 * u, 700, 1050); cam(560, 1150, 1.05);
    g.save(); g.beginPath(); g.rect(-400, -200, 1900, 2400); g.arc(760, 1050, 1200 * u, 0, 7, true); g.fillStyle = '#26262e'; g.fill('evenodd'); g.restore();
    for (let i = 0; i < 4; i++) g.fillStyle = '#3a3a46', label('REALITY', 300 + (i % 2) * 520, 600 + i * 300, 80, '#3a3a46');
    if (u > 0) for (let i = 0; i < 24; i++) { const an = i / 24 * 7 + t; neon(c => { const r = 1200 * u; c.moveTo(760 + Math.cos(an) * r, 1050 + Math.sin(an) * r); c.lineTo(760 + Math.cos(an) * (r + 40 + 30 * Math.sin(t * 20 + i)), 1050 + Math.sin(an) * (r + 40)); }, '#ff9a4a', 6, 24); }
    floor(); const k = A(420, 1560, .95, mixPose(P.orb, Q.punch, eo(seg(t, ch - .3, ch))), { glow: 1.2 + u }), [hx, hy] = hand(k, 420, 1560, .95), fk = seg(t, a, ch);
    for (let i = 0; i < 6; i++) neon(c => { c.moveTo(hx - 20 + i * 8, hy - 10); c.quadraticCurveTo(hx + Math.sin(t * 12 + i) * 30, hy - 60 * fk - 40, hx + i * 4 - 10, hy - 100 - 140 * fk - Math.abs(Math.sin(t * 9 + i)) * 50); }, i % 2 ? '#ff9a4a' : RED, 4, 24);
  },
  storm(t, a, b) {         // they didn't wait for the storm to clear: a grey figure hides under an awning, waiting; lightning splits the sky
    bg(t, .08); cam(540, 1150, 1.0); floor(); const lt = a + .5; flash(t, lt, .12, '255,230,235', .4);
    cloud(300, 450, 1.2); cloud(800, 380, 1.0); if (t > lt && t < lt + .25) bolt(620, 500, 900, 3); rain(t);
    neon(c => { c.moveTo(560, 1100); c.lineTo(980, 1100); c.lineTo(1020, 1200); c.lineTo(520, 1200); c.closePath(); c.moveTo(600, 1200); c.lineTo(600, 1562); c.moveTo(940, 1200); c.lineTo(940, 1562); }, '#8a8a96', 4, 4, '#121218');
    grey(770, 1560, .6, Q.cross, 1);
  },
  rainrun(t, a, b) {       // they learned to run in the rain: he sprints through the downpour, every footfall a splash
    bg(t, .2); const lt = w('rain'); flash(t, lt, .12, '255,230,235', .4); cam(540, 1250, lerp(1.0, 1.1, seg(t, a, b)), -.03);
    cloud(400, 400, 1.3); if (t > lt && t < lt + .25) bolt(800, 450, 900, 7); rain(t, 100, .6, .55); floor();
    const off = ((t - a) * 1000) % 180; for (let i = -1; i < 9; i++) line(i * 180 - off, 1570, i * 180 - off + 60, 1570, 'rgba(200,205,225,.4)', 3);
    A(540, 1560, .95, run(t, 17), { wind: 1, glow: 1.3 });
    for (let i = 0; i < 2; i++) { const q = ((t - a) * 17 / Math.PI / 2 * 2 + i * .5) % 1; for (let d = -1; d <= 1; d += 2) neon(c => { c.moveTo(500 + i * 60, 1560); c.quadraticCurveTo(500 + i * 60 + d * 40 * q, 1560 - 60 * q, 500 + i * 60 + d * 70 * q, 1560 - 20 * q); }, '#cfd3e0', 3, 10, null, 1 - q); }
  },
  sand(t, a, b) {          // let go of the illusion of control: a clenched fist bleeding sand — it opens, the sand blows away as embers
    bg(t, .2); cam(540, 1000, 1.0); const op = eo(seg(t, w('control') - .15, w('control') + .2));
    neon(c => { c.roundRect(430, 1100, 220, 900, 40); }, RED, 6, 30, '#0a0306');
    g.save(); g.translate(540, 1000); neon(c => { c.roundRect(-150, -100, 300, 240, 50); }, RED, 6, 40, '#14050a');
    for (let i = 0; i < 4; i++) { g.save(); g.translate(-110 + i * 70, -100); g.rotate(lerp(0, (i - 1.5) * .25, op)); neon(c => { c.roundRect(-28, lerp(-10, -200, op), 56, lerp(80, 210, op), 26); }, RED, 5, 30, '#14050a'); g.restore(); }
    g.save(); g.translate(-150, 30); g.rotate(lerp(.4, -.9, op)); neon(c => { c.roundRect(-30, -150, 60, 150, 26); }, RED, 5, 30, '#14050a'); g.restore(); g.restore();
    neon(c => { c.moveTo(450, 1060); c.lineTo(630, 1060); }, '#ffb81f', 6, 20);
    for (let i = 0; i < 70; i++) { const q = ((t - a) * 1.2 + hash(i)) % 1, bl = op; const x = 540 + (hash(i + 3) - .5) * 60 * (1 - bl) + bl * (q * 900 + hash(i + 5) * 200), y = (1 - bl) * (1140 + q * 800) + bl * (900 - q * 700 + hash(i + 8) * 300);
      g.fillStyle = bl > .3 ? `rgba(255,${80 + 100 * hash(i)},60,${1 - q})` : `rgba(220,200,170,${1 - q * .5})`; g.fillRect(x, y, 6, 6); }
    label('CONTROL', 540, 600, 90, GREY, 1 - op);
  },
  doubts(t, a, b) {        // your doubts are loud: grey megaphones close in from every side, blasting NO, CAN'T, WHAT IF
    bg(t, .15); cam(540, 1150, lerp(1.0, 1.1, seg(t, a, b)), 0, Math.sin(t * 60) * 6, 0); floor(); const W2 = ['NO', "CAN'T", 'WHAT IF', 'TOO LATE', 'FAIL'];
    A(540, 1560, .85, M.ears, { glow: .9 });
    W2.forEach((wd, i) => { const an = -Math.PI * .1 - i * Math.PI * .2, r = lerp(800, 560, eo(seg(t, a, a + .5))), mx = 540 + Math.cos(an) * r, my = 1250 + Math.sin(an) * r * .9;
      g.save(); g.translate(mx, my); g.rotate(an + Math.PI); neon(c => { c.moveTo(-80, -30); c.lineTo(80, -90); c.lineTo(80, 90); c.lineTo(-80, 30); c.closePath(); }, '#9a9aa6', 4, 6, '#16161c'); g.restore();
      for (let k = 0; k < 2; k++) { const q = ((t - a) * 2 + k * .5 + i * .2) % 1; neon(c => { c.arc(mx, my, 100 + q * 140, an + Math.PI - .5, an + Math.PI + .5); }, '#9a9aa6', 3, 0, null, 1 - q); }
      label(wd, lerp(mx, 540, .35), lerp(my, 1250, .35), 50, '#b8b8c4'); });
  },
  deafening(t, a, b) {     // but your potential is deafening: he roars — a red shockwave blows every megaphone away
    const rr = w('deafening') - .15, u = eo(seg(t, rr, rr + .6)); bg(t, .3 + .7 * u); cam(540, 1150, lerp(1.1, 1.0, u), 0, ...shake(t, rr, 36)); floor(); flash(t, rr, .12);
    for (let i = 0; i < 5; i++) { const an = -Math.PI * .1 - i * Math.PI * .2, r = 560 + 1200 * u, mx = 540 + Math.cos(an) * r, my = 1250 + Math.sin(an) * r * .9; g.save(); g.translate(mx, my); g.rotate(an + Math.PI + u * 6); neon(c => { c.moveTo(-80, -30); c.lineTo(80, -90); c.lineTo(80, 90); c.lineTo(-80, 30); c.closePath(); }, '#9a9aa6', 4, 6, '#16161c'); g.restore(); }
    A(540, 1560, .9, mixPose(M.ears, M.roar, eo(seg(t, rr - .3, rr))), { glow: 1 + u });
    for (let r = 0; r < 4; r++) { const ph = seg(t, rr + r * .12, rr + .8 + r * .12); if (ph > 0 && ph < 1) neon(c => { c.arc(540, 1150, 80 + ph * 900, 0, 7); }, RED, 6, 30, null, 1 - ph); }
  },
  edge(t, a, b) {          // stop standing on the edge: high dive platform, toes over the lip, the red pool impossibly far below — vertigo
    const u = seg(t, a, b); bg(t, .2, 540, 1900); cam(560, 1100, lerp(1.0, 1.35, eio(u)), lerp(0, -.05, u));
    for (let i = 0; i < 5; i++) line(160 - i * 30, 1100 + i * 180, 160 - i * 30, 2400, 'rgba(160,160,170,.3)', 4);
    neon(c => { c.rect(-300, 1100, 900, 30); }, '#c8c8d2', 5, 8, '#18181f'); neon(c => { c.ellipse(700, 2000, 360 * (1 - u * .3), 40, 0, 0, 7); }, RED, 4, 40, 'rgba(255,42,60,.4)');
    A(560, 1100, .7, M.edge);
  },
  jump(t, a, b) {          // JUMP: he springs off the board
    const p = seg(t, a, b + .4); bg(t, .3, 540, 1900); const x = lerp(560, 760, p), y = 1100 - 300 * Math.sin(p * Math.PI * .8) + 200 * p * p;
    cam(x, y - 100, 1.1, 0, ...shake(t, a, 14)); neon(c => { c.rect(-300, 1100, 900, 30); }, '#c8c8d2', 5, 8, '#18181f');
    A(x, y, .7, mixPose(POSE.kneel, POSE.jump, eo(seg(t, a, a + .2))), { wind: 1, glow: 1.4 });
  },
  adapt(t, a, b) {         // ADAPT: mid-fall his cape snaps open into wings — he glides
    const p = seg(t, a, b); bg(t, .3, 540, 800); cam(540, 1100, 1.0, -.08);
    for (let i = 0; i < 8; i++) { const x = 1300 - ((t * 1400 + hash(i) * 1600) % 1700), y = 400 + hash(i + 3) * 1400; line(x, y, x + 260, y, 'rgba(255,255,255,.2)', 3); }
    cloud(1200 - (t - a) * 900, 1500, .8);
    const op = eo(seg(t, a, a + .25)), kx = 520, ky = 1300 + Math.sin(t * 3) * 20, k = ayaz(g, -9e4, -9e4, .8, M.glide, { t: T0 }), sx = kx + k.shoulder[0] * .8, sy = ky + k.shoulder[1] * .8;
    neon(c => { c.moveTo(sx, sy); c.lineTo(sx - 520 * op, sy - 260 * op); c.lineTo(sx - 380 * op, sy - 120 * op); c.lineTo(sx - 460 * op, sy - 40 * op); c.lineTo(sx - 300 * op, sy + 20 * op); c.closePath(); }, RED, 5, 40, 'rgba(255,42,60,.35)');
    A(kx, ky, .8, M.glide, { wind: 1, glow: 1.5 });
  },
  conquer(t, a, b) {       // AND CONQUER: he lands on top of the storm cloud — lightning cracks beneath his feet
    const ld = a + .3, u = seg(t, ld, ld + .3); bg(t, .4 + .4 * u, 540, 1100); cam(540, 1150, 1.0, 0, ...shake(t, ld, 30)); flash(t, ld, .1);
    cloud(540, 1650, 1.7, '#8a8a96', '#16161c', 10); if (u > 0) { bolt(400, 1700, 500, 11, 1 - seg(t, ld + .3, b)); bolt(700, 1720, 480, 17, 1 - seg(t, ld + .3, b)); }
    A(540, lerp(900, 1560, ei(seg(t, a, ld))), .9, t < ld ? POSE.jump : mixPose(POSE.kneel, POSE.victory, eo(seg(t, ld + .1, ld + .5))), { glow: 1.4 + u });
  },
  now(t, a, b) {           // your moment is right now: crash zoom into the hourglass on his chest — it flips, sparks burst, pull back to him
    const zi = eo(seg(t, a, a + .4)), zo = eio(seg(t, w('now') - .1, w('now') + .5)), k0 = ayaz(g, -9e4, -9e4, .95, POSE.victory, { t: T0 }), hx = 540 + (k0.hip[0] + k0.shoulder[0]) / 2 * .95, hy = 1560 + (k0.hip[1] * .4 + k0.shoulder[1] * .6) * .95;
    bg(t, 1.0, 540, 1100); cam(lerp(540, hx, zi * (1 - zo)), lerp(1150, hy, zi * (1 - zo)), lerp(1.0, 5.5, zi * (1 - zo)) + .1 * zo, 0, ...shake(t, w('now'), 26)); floor();
    A(540, 1560, .95, POSE.victory, { glow: 1.6 }); ground(540, 1560, .95, 1);
    [[w('right'), 540, 800, 1, 1.4], [w('now') + .2, 240, 600, 2, 1.1], [w('now') + .45, 840, 560, 3, 1.1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 140, life: 1.3 }));
  },
};
const SC = [];
function scenes() {
  const T = [0, w('waiting'), w('that'), w('look'), w('life'), w('the', 11), w('the', 14), w('every'), w('started'), w('shaking'), w('burning') - .08, w('they'), w('they', 27.9), w('let'), w('your', 33.5), w('but'), w('stop'), w('jump'), w('adapt'), w('and', 41), w('your', 42), DUR];
  const N = ['hook', 'queue', 'slip', 'polish', 'train', 'calendar', 'stars', 'room', 'plan', 'shake2', 'burn', 'storm', 'rainrun', 'sand', 'doubts', 'deafening', 'edge', 'jump', 'adapt', 'conquer', 'now'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('moment') - .1, w('now')));   // the peak ritual: the hourglass turns on "moment … now"
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
