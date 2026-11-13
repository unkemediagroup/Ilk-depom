// "Become Someone Your Younger Self Would Admire" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 52.0; window.DUR = DUR;
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
const KEY = /think|back|kid|wide|eyes|impossible|dreams|heart|hope|today|lost|fire|impress|strangers|chasing|approvals|boxes|never|wild|ambitions|safe|compromises|inner|child|waiting|promises|fierce|unstoppable|protector|fear|story|stand|shake|dust|living|younger|proud|honor|past|future|become|happen/i;
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


const D = {
  tired: { lean: .55, head: .6, a1: .25, a2: .15, f1: .1, f2: .05, q1: -.3, k1: .3, q2: .25, k2: .25 },
  windA: { ...POSE.walkA, lean: .5, head: .1 }, windB: { ...POSE.walkB, lean: .5, head: .1 },
  gem: { ...POSE.stand, head: .3, a1: -1.0, a2: -.1, f1: -1.5, f2: -.2 },
  coin: { ...POSE.hero, head: .3, a1: -1.1, a2: -.1, f1: -1.0, f2: -.2 },
  net: { ...POSE.runA, a1: -2.4, f1: -2.6 }, netB: { ...POSE.runB, a1: -2.0, f1: -2.4 },
  blind: { ...POSE.stand, head: -.25, a1: -1.3, a2: -1.2, f1: -1.4, f2: -1.3 },
};
const walkD = t => mixPose(D.windA, D.windB, .5 + .5 * Math.sin(t * 6));
function trail(t, x, y) { for (let i = 0; i < 40; i++) { const fx = x - 70 - i * 75 - ((t * 140) % 75); if (fx < x - 3000) break; neon(c => { c.ellipse(fx, y + 4, 26, 8, 0, 0, 7); }, RED, 3, 20, 'rgba(255,42,60,.55)', Math.max(.25, 1 - i * .03)); } }
function rock(x, y, w2, h, split = 0) { for (const s2 of [-1, 1]) { g.save(); g.translate(x + s2 * 60 * split, y); g.rotate(s2 * .08 * split); g.beginPath(); s2 < 0 ? g.rect(-w2, -h - 50, w2, h + 100) : g.rect(0, -h - 50, w2, h + 100); g.clip();
  neon(c => { c.moveTo(-w2, 0); c.lineTo(-w2 + 40, -h * .8); c.lineTo(-w2 * .4, -h); c.lineTo(w2 * .5, -h * .95); c.lineTo(w2 - 30, -h * .7); c.lineTo(w2, 0); c.closePath(); }, '#9a9aa6', 5, 6, '#1a1a20'); g.restore(); } }
function drop(x, y, r, a = 1) { neon(c => { c.moveTo(x, y - r * 2); c.quadraticCurveTo(x + r * 1.1, y - r * .2, x, y + r); c.quadraticCurveTo(x - r * 1.1, y - r * .2, x, y - r * 2); }, RED, 3, 30, 'rgba(255,42,60,.6)', a); }
function paper(x, y, s, rot, txt) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = '#e8e8ee'; g.fillRect(-300, -200, 600, 400); g.strokeStyle = '#18181f'; g.lineWidth = 4; g.strokeRect(-280, -180, 560, 360);
  g.fillStyle = '#18181f'; g.font = '34px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('THE DAILY NEWS', 0, -140); g.fillRect(-260, -110, 520, 4); g.font = '96px Anton'; g.fillStyle = '#c0182a'; g.fillText(txt, 0, -30); for (let i = 0; i < 4; i++) { g.fillStyle = '#9a9aa6'; g.fillRect(-260, 60 + i * 28, 240, 10); g.fillRect(20, 60 + i * 28, 240, 10); } g.restore(); }

const E = {
  shieldUp: { ...POSE.hero, lean: .15, head: .1, a1: -1.4, a2: .3, f1: -2.0, f2: -.2, q1: -.55, k1: .35, q2: .45, k2: .15 },
  medit: { lean: 0, head: .1, a1: .35, a2: -.35, f1: -1.0, f2: -1.6, q1: -1.45, k1: 2.6, q2: -1.6, k2: 2.7, y: 270 },
  shout: { ...POSE.hero, lean: .15, head: -.15, a1: -1.0, a2: .4, f1: -1.7, f2: .2 },
  give: { ...POSE.stand, lean: .1, head: .2, a1: -1.3, a2: -.1, f1: -1.35, f2: -.2 },
  press: { ...POSE.stand, head: .3, a1: -.9, a2: -.1, f1: -1.7, f2: -.2 },
  thumbs: { ...POSE.stand, a1: -1.3, a2: .1, f1: .2, f2: -.2 },
  pour: { ...POSE.hero, head: .3, a1: -1.6, a2: -.2, f1: -2.6, f2: -.3 },
  chop: { ...POSE.hero, lean: .2, head: .2, a1: -2.6, a2: .3, f1: -2.2, f2: -.2, q1: -.5, k1: .3, q2: .4, k2: .1 },
  cup: { ...POSE.hero, lean: .1, head: .45, a1: -.9, a2: -1.0, f1: -1.75, f2: -1.85 },
};
function shield(x, y, r, a = 1) { neon(c => { c.arc(x, y, r, 0, 7); }, RED, 6, 40, 'rgba(40,6,12,.92)', a); neon(c => { c.arc(x, y, r * .7, 0, 7); c.moveTo(x, y - r * .45); c.lineTo(x + r * .3, y); c.lineTo(x, y + r * .45); c.lineTo(x - r * .3, y); c.closePath(); }, '#ffb81f', 4, 20, null, a); }
function arrow(x, y, an, a = 1) { g.save(); g.translate(x, y); g.rotate(an); neon(c => { c.moveTo(-160, 0); c.lineTo(0, 0); c.moveTo(-20, -14); c.lineTo(0, 0); c.lineTo(-20, 14); c.moveTo(-160, 0); c.lineTo(-180, -14); c.moveTo(-160, 0); c.lineTo(-180, 14); }, '#c8c8d2', 4, 8, null, a); g.restore(); }
function headOutline(x, y, s, col = '#8a8a96', fill = '#0c0c10') { g.save(); g.translate(x, y); g.scale(s, s); neon(c => { c.moveTo(-60, 300); c.lineTo(-60, 200); c.bezierCurveTo(-260, 180, -260, -260, 0, -280); c.bezierCurveTo(240, -280, 300, -60, 220, 60); c.lineTo(260, 120); c.lineTo(200, 140); c.lineTo(190, 220); c.lineTo(80, 230); c.lineTo(80, 300); }, col, 5, 8, fill); g.restore(); }
function lotus(x, y, s, k = 1) { for (let i = -2; i <= 2; i++) { g.save(); g.translate(x, y); g.rotate(i * .38 * k); neon(c => { c.moveTo(0, 0); c.quadraticCurveTo(-40 * s, -90 * s, 0, -150 * s * (1 - Math.abs(i) * .12)); c.quadraticCurveTo(40 * s, -90 * s, 0, 0); }, RED, 4, 30, 'rgba(255,42,60,.35)'); g.restore(); } }

const C2 = {
  grip: { ...POSE.hero, lean: .1, head: .1, a1: -1.5, a2: -1.3, f1: -1.9, f2: -1.7, q1: -.3, k1: .2, q2: .3, k2: .1 },
  lounge: { lean: -.55, head: -.1, a1: .4, a2: -2.6, f1: -.2, f2: -3.6, q1: -1.5, k1: .3, q2: -1.4, k2: .5, y: 230 },
  hold: { ...POSE.stand, head: .2, a1: -1.2, a2: -.1, f1: -1.4, f2: -.2 },
  lamp: { ...POSE.hero, head: .15, a1: -1.4, a2: -.1, f1: -1.5, f2: -.2 },
  crawl: { lean: 1.35, head: -.9, a1: -1.6, a2: -1.2, f1: -1.5, f2: -1.2, q1: -.8, k1: 2.0, q2: -.5, k2: 2.1, y: 170 },
};
function cageDraw(x, y, w2, h, a = 1, col = '#c8c8d2') { neon(c => { for (let i = 0; i <= 8; i++) { const bx = x - w2 / 2 + i * w2 / 8; c.moveTo(bx, y - h); c.lineTo(bx, y); } c.moveTo(x - w2 / 2, y - h); c.quadraticCurveTo(x, y - h - 120, x + w2 / 2, y - h); c.moveTo(x - w2 / 2, y); c.lineTo(x + w2 / 2, y); c.moveTo(x, y - h - 90); c.lineTo(x, y - h - 400); }, col, 5, 12, null, a); }
function couch(x, y, s, sink = 0) { g.save(); g.translate(x, y); g.scale(s, s); neon(c => { c.roundRect(-300, -260, 600, 170, 50); c.roundRect(-340, -170, 90, 170, 40); c.roundRect(250, -170, 90, 170, 40); c.moveTo(-280, 0); c.lineTo(-280, 30); c.moveTo(280, 0); c.lineTo(280, 30); }, '#9a8c8c', 4, 8, '#1a1517'); neon(c => { c.roundRect(-250, -110 + 30 * sink, 500, 110, 30); }, '#b8a8a8', 3, 6, '#221c1e'); g.restore(); }
function wheel(x, y, r, rot, a = 1) { g.save(); g.translate(x, y); g.globalAlpha *= a; neon(c => { c.arc(0, 0, r, 0, 7); c.moveTo(r - 30, 0); c.arc(0, 0, r - 30, 0, 7); for (let i = 0; i < 16; i++) { const an = rot + i / 16 * 7; c.moveTo(Math.cos(an) * (r - 30), Math.sin(an) * (r - 30)); c.lineTo(Math.cos(an) * r, Math.sin(an) * r); } c.moveTo(0, 0); c.lineTo(-r * .5, r + 60); c.moveTo(0, 0); c.lineTo(r * .5, r + 60); }, '#9a9aa6', 5, 8); g.restore(); }

const KS = .5;   // the younger self: a small AYAZ
const K = (x, y, pose, o = {}) => A(x, y, KS, pose, { glow: 1.1, ...o });
const Y = {
  lookDown: { ...POSE.stand, head: .55, a1: .1, a2: -.1 },
  lookUp: { ...POSE.stand, head: -.6, lean: -.05 },
  dream: { ...POSE.victory, head: -.5 },
  heartH: { ...POSE.stand, head: .3, a1: -.9, a2: -1.0, f1: -1.7, f2: -1.8 },
  torch: { ...POSE.stand, head: .2, a1: -1.2, a2: -.1, f1: -1.9, f2: -.2 },
  juggle: { ...POSE.stand, head: -.4, a1: -1.0, a2: -1.2, f1: -2.4, f2: -2.6 },
  squeezed: { lean: .9, head: .7, a1: -.6, a2: -.4, f1: -2.2, f2: -2.0, q1: -1.6, k1: 2.5, q2: -1.4, k2: 2.6, y: 150 },
  kite: { ...POSE.stand, head: -.4, a1: -2.3, a2: -.1, f1: -2.5, f2: -.2 },
  curl: { lean: .9, head: .9, a1: -.4, a2: -.5, f1: -1.8, f2: -1.9, q1: -1.9, k1: 2.7, q2: -1.8, k2: 2.8, y: 290 },
  pinky: { ...POSE.stand, head: .2, a1: -1.4, a2: -.1, f1: -1.5, f2: -.2 },
  spread: { ...POSE.hero, lean: -.05, head: 0, a1: -1.6, a2: -1.5, f1: -1.6, f2: -1.5, q1: -.4, k1: .2, q2: .4, k2: .1 },
  write: { ...POSE.hero, lean: .3, head: .5, a1: -1.0, a2: -.1, f1: -1.6, f2: -.2 },
  shakeA: { ...POSE.hero, lean: -.1, a1: .6, a2: -.6, f1: .3, f2: -.8 }, shakeB: { ...POSE.hero, lean: .1, a1: -.6, a2: .6, f1: -.8, f2: .3 },
  bump: { ...POSE.kneel, a1: -1.5, f1: -1.5 }, kbump: { ...POSE.stand, a1: -1.5, f1: -1.5 },
};
function boxDraw(x, y, w2, h, col = '#b8a080') { neon(c => { c.rect(x - w2 / 2, y - h, w2, h); c.moveTo(x - w2 / 2, y - h); c.lineTo(x - w2 / 2 - 60, y - h - 70); c.moveTo(x + w2 / 2, y - h); c.lineTo(x + w2 / 2 + 60, y - h - 70); }, col, 4, 4, 'rgba(26,22,18,.55)'); }
function heart(x, y, s) { neon(c => { c.moveTo(x, y + 40 * s); c.bezierCurveTo(x - 90 * s, y - 20 * s, x - 50 * s, y - 80 * s, x, y - 40 * s); c.bezierCurveTo(x + 50 * s, y - 80 * s, x + 90 * s, y - 20 * s, x, y + 40 * s); }, RED, 4, 40, 'rgba(255,42,60,.55)'); }

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: "Think back" — the picture rewinds: tracking lines tear across, ◀◀, he races backwards through time
    bg(t, .3); flash(t, 0, .12, '255,42,60', .55); cam(540, 1200, 1.1, 0, Math.sin(t * 80) * 10, 0); floor();
    const off = ((t - a) * 2500) % 200; for (let i = -1; i < 8; i++) line(i * 200 + off, 1562, i * 200 + off + 80, 1562, 'rgba(255,255,255,.4)', 4);
    A(540, 1560, .95, run(-t, 20), { flip: true, wind: 1, glow: 1.3 });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 4; i++) { const y = (hash(i + Math.floor(t * 20)) * H); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, y, W, 20 + 30 * hash(i)); } g.restore();
    label('◀◀', 540, 800, 160, WHITE, .5 + .5 * (Math.sin(t * 14) > 0));
  },
  look(t, a, b) {          // look at the kid you used to be: he turns — and there's the small version of himself, looking right back up
    bg(t, .2); cam(560, lerp(1150, 1300, eio(seg(t, a, b))), lerp(1.0, 1.15, seg(t, a, b))); floor();
    A(360, 1560, .95, mixPose(POSE.hero, Y.lookDown, eo(seg(t, a, a + .5))), { glow: 1.1 }); K(720, 1560, Y.lookUp, { flip: true });
  },
  eyes(t, a, b) {          // wide eyes: close on the little one — two bright sparks glint on the visor
    bg(t, .25); const k0 = ayaz(g, -9e4, -9e4, KS, Y.lookUp, { t: T0, flip: true }), sx = 540 + k0.shoulder[0] * KS, sy = 1560 + k0.shoulder[1] * KS - 50;
    cam(540, 1400, lerp(1.7, 2.0, seg(t, a, b))); floor(); K(640, 1560, Y.lookUp, { flip: true, glow: 1.6 });
    for (let i = 0; i < 10; i++) { const an = i / 10 * 7 + t * .8, r = 260 + 20 * Math.sin(t * 5 + i); neon(c => { c.moveTo(540 + Math.cos(an) * r, 1380 + Math.sin(an) * r - 8); c.lineTo(540 + Math.cos(an) * r, 1380 + Math.sin(an) * r + 8); c.moveTo(540 + Math.cos(an) * r - 8, 1380 + Math.sin(an) * r); c.lineTo(540 + Math.cos(an) * r + 8, 1380 + Math.sin(an) * r); }, WHITE, 2, 16, null, .5 + .5 * Math.sin(t * 6 + i)); }
  },
  dreams(t, a, b) {        // impossible dreams: arms up, chalk doodles swirl round him — rocket, crown, planet, dragon-kite
    bg(t, .3); cam(540, 1300, 1.25); floor(); K(540, 1560, Y.dream, { glow: 1.4 });
    for (let i = 0; i < 4; i++) { const an = t * 1.6 + i * 1.57, x = 540 + Math.cos(an) * 280, y = 1250 + Math.sin(an) * 140, ap = eo(seg(t, a + i * .15, a + .4 + i * .15));
      g.save(); g.globalAlpha = ap; [() => neon(c => { c.moveTo(x, y - 60); c.lineTo(x + 25, y); c.lineTo(x + 25, y + 40); c.lineTo(x - 25, y + 40); c.lineTo(x - 25, y); c.closePath(); c.moveTo(x - 25, y + 40); c.lineTo(x - 40, y + 60); c.moveTo(x + 25, y + 40); c.lineTo(x + 40, y + 60); }, WHITE, 3, 14),
        () => neon(c => { c.moveTo(x - 50, y + 25); c.lineTo(x - 50, y - 20); c.lineTo(x - 25, y + 5); c.lineTo(x, y - 35); c.lineTo(x + 25, y + 5); c.lineTo(x + 50, y - 20); c.lineTo(x + 50, y + 25); c.closePath(); }, '#ffb81f', 3, 14),
        () => neon(c => { c.arc(x, y, 35, 0, 7); c.moveTo(x + 70, y); c.ellipse(x, y, 70, 16, -.3, 0, 7); }, WHITE, 3, 14),
        () => neon(c => { c.moveTo(x, y - 50); c.lineTo(x + 35, y); c.lineTo(x, y + 50); c.lineTo(x - 35, y); c.closePath(); c.moveTo(x, y + 50); c.quadraticCurveTo(x + 30, y + 90, x - 10, y + 130); }, RED, 3, 14)][i](); g.restore(); }
  },
  hope(t, a, b) {          // a heart full of hope: he holds a glowing heart against his chest — it beats
    bg(t, .3); cam(540, 1350, 1.4); floor(); const k = K(540, 1560, Y.heartH), [hx, hy] = hand(k, 540, 1560, KS), [h2x, h2y] = hand(k, 540, 1560, KS, false); const bt = 1 + .12 * Math.pow(Math.abs(Math.sin(t * 5)), 6);
    heart((hx + h2x) / 2 + 20, (hy + h2y) / 2 - 10, .55 * bt); label('HOPE', 540, 1100, 60, RED);
  },
  say(t, a, b) {           // what would they say if they saw you today: the kid tilts his head at the grown man — a big "?" — the man looks away
    bg(t, .15); cam(540, 1250, 1.05); floor(); A(330, 1560, .95, mixPose(Y.lookDown, { ...POSE.stand, head: -.1 }, eo(seg(t, w('today') - .3, w('today')))), { glow: .9, flip: t > w('today') });
    K(760, 1560, { ...Y.lookUp, head: -.6 + .2 * Math.sin(t * 3) }, { flip: true }); neon(c => { c.ellipse(820, 1080, 90, 70, 0, 0, 7); c.moveTo(790, 1140); c.lineTo(770, 1190); c.lineTo(820, 1148); }, WHITE, 3, 10, '#0c0c10'); label('?', 820, 1085, 90, RED);
  },
  lookup(t, a, b) {        // would they look up to you: low angle — the boy looks up; the man stands tall against the light
    bg(t, .6, 540, 600); cam(540, 1250, lerp(1.0, 1.08, seg(t, a, b)), .04); floor(); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,60,80,.12)'; g.beginPath(); g.moveTo(540, 300); g.lineTo(200, 1560); g.lineTo(880, 1560); g.fill(); g.restore();
    A(560, 1560, 1.15, POSE.hero, { glow: 1.5 }); K(200, 1600, Y.lookUp, {});
  },
  fire(t, a, b) {          // or wonder where you lost your fire: the torch in his hand gutters out into a thin line of smoke
    const u = eo(seg(t, w('lost') - .2, w('fire') + .2)); bg(t, .25 * (1 - u)); cam(500, 1200, 1.15); floor();
    const k = A(420, 1560, .95, Y.torch, { glow: 1.1 - .5 * u }), [hx, hy] = hand(k, 420, 1560, .95); neon(c => { c.moveTo(hx, hy + 40); c.lineTo(hx + 10, hy - 110); }, '#8a8a96', 8, 0);
    for (let i = 0; i < 6; i++) neon(c => { c.moveTo(hx - 15 + i * 6, hy - 110); c.quadraticCurveTo(hx + Math.sin(t * 12 + i) * 25, hy - 170, hx + i * 4 - 10, hy - 170 - (120 + Math.abs(Math.sin(t * 9 + i)) * 50) * (1 - u)); }, i % 2 ? '#ff9a4a' : RED, 4, 24, null, 1 - u);
    if (u > .5) for (let i = 0; i < 3; i++) { const q = ((t * .8 + i / 3) % 1); neon(c => { c.arc(hx + 10 + Math.sin(q * 6 + i) * 20, hy - 120 - q * 400, 10 + 20 * q, 0, 7); }, '#8a8a96', 2, 0, null, (1 - q) * (u - .5) * 2); }
    K(760, 1560, { ...Y.lookUp, head: -.3 }, { flip: true });
  },
  impress(t, a, b) {       // trying to impress strangers: he juggles glowing balls, frantic — grey strangers walk past with their backs turned
    bg(t, .2); cam(540, 1200, 1.0); floor(); const k = A(540, 1560, .9, mixPose(Y.juggle, { ...Y.juggle, a1: -1.2, a2: -1.0 }, .5 + .5 * Math.sin(t * 9)), { glow: 1.1 }), [hx, hy] = hand(k, 540, 1560, .9);
    for (let i = 0; i < 3; i++) { const p = ((t * 1.8) + i / 3) % 1, x = hx - 40 + Math.sin(p * Math.PI * 2) * 120, y = hy - 60 - Math.sin(p * Math.PI) * 360; neon(c => { c.arc(x, y, 26, 0, 7); }, RED, 3, 24, 'rgba(255,42,60,.5)'); }
    for (let i = 0; i < 4; i++) { const x = ((i * 330 - (t - a) * 180) % 1400 + 1400) % 1400 - 160; grey(x, 1560, .65, walk(t + i), .9, true); } label('STRANGERS', 540, 1700, 54, GREY);
  },
  approval(t, a, b) {      // chasing approvals: a gold APPROVED stamp flutters off ahead — he lunges after it, always a step behind
    bg(t, .2); const p = seg(t, a, b), x = lerp(150, 760, p); cam(lerp(500, 640, p), 1200, 1.0); floor();
    const sx = x + 300 + Math.sin(t * 5) * 60, sy = 1100 + Math.sin(t * 7) * 80; g.save(); g.translate(sx, sy); g.rotate(Math.sin(t * 4) * .4); neon(c => { c.arc(0, 0, 80, 0, 7); }, '#ffd77a', 5, 30, 'rgba(255,215,122,.15)'); label('APPROVED', 0, 0, 30, '#ffd77a'); g.restore();
    A(x, 1560, .9, run(t, 16), { wind: 1 });
  },
  boxes(t, a, b) {         // fitting into boxes we were never meant for: he's crammed into a cardboard box far too small — the lid pushes him down
    const lid = eo(seg(t, a + .3, w('never'))); bg(t, .15); cam(540, 1300, 1.2, 0, ...shake(t, w('never'), 10)); floor();
    A(540, 1560, .7, Y.squeezed, { glow: .9 }); boxDraw(540, 1562, 400, 300); g.save(); g.translate(540, 1562 - 300 - 120 * (1 - lid)); neon(c => { c.rect(-220, -20, 440, 30); }, '#b8a080', 4, 4, '#1a1612'); g.restore(); label('FIT IN', 540, 1500, 50, '#b8a080');
  },
  kite(t, a, b) {          // trading wild ambitions for safe compromises: his red kite loops wild in the sky — then folds into a dull grey square and drops
    const cp = eo(seg(t, w('safe') - .2, w('compromises') + .3)); bg(t, .25 * (1 - cp) + .05); cam(540, 1100, 1.0); floor();
    const k = A(300, 1560, .9, Y.kite, { glow: 1.1 }), [hx, hy] = hand(k, 300, 1560, .9);
    const kx = lerp(680 + Math.sin(t * 2.4) * 180, 520, cp), ky = lerp(600 + Math.cos(t * 3.1) * 140, 1450, cp * cp);
    neon(c => { c.moveTo(hx, hy); c.quadraticCurveTo((hx + kx) / 2, (hy + ky) / 2 + 200 * (1 - cp), kx, ky); }, '#c8c8d2', 2, 0);
    g.save(); g.translate(kx, ky); g.rotate(Math.sin(t * 3) * .6 * (1 - cp)); const col = cp > .5 ? '#7a7a86' : RED;
    neon(c => { const s2 = 1 - .3 * cp; c.moveTo(0, -110 * s2); c.lineTo(70 * s2 + 20 * cp, 0); c.lineTo(0, 110 * s2 * (1 - cp * .4)); c.lineTo(-70 * s2 - 20 * cp, 0); c.closePath(); c.moveTo(0, 110 * s2); c.quadraticCurveTo(40, 180, -10, 260 * (1 - cp)); }, col, 4, 30 * (1 - cp), cp > .5 ? '#22222a' : 'rgba(255,42,60,.35)'); g.restore();
    label(cp > .5 ? 'SAFE' : 'WILD', kx, ky - 170, 54, cp > .5 ? GREY : RED);
  },
  inner(t, a, b) {         // deep down your inner child is still waiting: X-ray into his chest — curled up inside a glowing core, the boy waits
    const u = eo(seg(t, a, w('child'))); bg(t, .25); const k0 = ayaz(g, -9e4, -9e4, .95, POSE.stand, { t: T0 }), cx = 540 + (k0.shoulder[0] + k0.hip[0]) / 2 * .95, cy = 1560 + (k0.shoulder[1] * .6 + k0.hip[1] * .4) * .95;
    cam(lerp(540, cx, u), lerp(1200, cy, u), lerp(1.0, 3.2, u)); floor(); A(540, 1560, .95, POSE.stand, { glow: .8 });
    if (u > .3) { const r = 120 * seg(u, .3, 1); neon(c => { c.arc(cx, cy, r, 0, 7); }, RED, 3, 40, 'rgba(8,2,4,.95)'); g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.clip(); A(cx, cy + 70, .18, Y.curl, { glow: 1.4 }); g.restore(); }
  },
  promises(t, a, b) {      // stop breaking promises to yourself: a glowing cord of knotted promises runs from his hand to the boy's — knot after knot snaps
    bg(t, .2); cam(540, 1250, 1.05); floor(); const k = A(300, 1560, .9, Y.pinky), [hx, hy] = hand(k, 300, 1560, .9), kk = K(800, 1560, Y.pinky, { flip: true }), [kx, ky] = hand(kk, 800, 1560, KS);
    const sn = seg(t, w('breaking') - .2, w('yourself') + .3), n = 6;
    for (let i = 0; i < n; i++) { const q0 = i / n, q1 = (i + 1) / n, broke = sn > (i + .5) / n; const p = q => [lerp(hx, kx, q), lerp(hy, ky, q) + 60 * Math.sin(q * Math.PI)];
      const [x0, y0] = p(q0 + .02), [x1, y1] = p(q1 - .02); if (!broke) neon(c => { c.moveTo(x0, y0); c.lineTo(x1, y1); }, RED, 3, 20); else neon(c => { c.moveTo(x0, y0); c.lineTo(x0 + 10, y0 + 80); c.moveTo(x1, y1); c.lineTo(x1 - 10, y1 + 80); }, '#6a6a76', 3, 0);
      const [mx, my] = p((q0 + q1) / 2); neon(c => { c.arc(mx, my + (broke ? 200 * Math.min(1, (sn - (i + .5) / n) * 4) : 0), 12, 0, 7); }, broke ? '#6a6a76' : RED, 3, broke ? 0 : 20, broke ? '#22222a' : RED); }
    label('PROMISES', 540, 1050, 60, RED, 1 - sn * .7);
  },
  protector(t, a, b) {     // become the fierce protector of your own dreams: grey shadows creep in — he spreads his arms and cape like a wall in front of the boy and his dream
    const fz = w('fierce'); bg(t, .25 + .3 * seg(t, fz, fz + .3)); cam(540, 1250, 1.0, 0, ...shake(t, fz, 18)); floor();
    K(220, 1560, Y.dream); neon(c => { c.ellipse(220, 1050, 80, 60, 0, 0, 7); }, WHITE, 3, 14, '#0c0c10'); neon(c => { c.moveTo(220, 1010); c.lineTo(240, 1050); c.lineTo(240, 1080); c.lineTo(200, 1080); c.lineTo(200, 1050); c.closePath(); }, RED, 3, 14);
    const k0 = ayaz(g, -9e4, -9e4, .95, Y.spread, { t: T0 }), sx = 520 + k0.shoulder[0] * .95, sy = 1560 + k0.shoulder[1] * .95, op = eo(seg(t, fz - .2, fz + .2));
    neon(c => { c.moveTo(sx, sy); c.lineTo(sx + 160 * op, sy - 260 * op); c.lineTo(sx + 220 * op, sy + 200 * op); c.lineTo(sx + 120 * op, sy + 520 * op); c.lineTo(sx, sy + 420); c.closePath(); }, RED, 5, 40, 'rgba(255,42,60,.3)');
    A(520, 1560, .95, mixPose(POSE.hero, Y.spread, op), { glow: 1.2 + op });
    for (let i = 0; i < 3; i++) { const pk = ((t - a) * .8 + i * .33) % 1, x = 1100 - 300 * Math.sin(pk * Math.PI) * (op > .5 ? .5 : 1); grey(x, 1560, .65, mixPose(walk(t + i), Q.flinch, op), .8, true); }
    label('DREAMS', 220, 950, 44, WHITE);
  },
  story(t, a, b) {         // stop letting fear write your story: a grey shadow hand writes "I CAN'T" — he grabs the quill and writes over it in red: I WILL
    const gb = w('write') - .1, rw = seg(t, gb + .2, b - .2); bg(t, .2); cam(560, 1150, 1.05); 
    neon(c => { c.moveTo(140, 900); c.lineTo(540, 940); c.lineTo(940, 900); c.lineTo(940, 1450); c.lineTo(540, 1490); c.lineTo(140, 1450); c.closePath(); c.moveTo(540, 940); c.lineTo(540, 1490); }, '#d8d8e4', 4, 8, '#e8e8ee');
    g.save(); g.font = '90px Anton'; g.textAlign = 'center'; g.fillStyle = '#4a4a55'; const cant = "I CAN'T"; g.fillText(cant.slice(0, Math.ceil(cant.length * seg(t, a, gb))), 740, 1220); g.restore();
    if (rw > 0) { neon(c => { c.moveTo(600, 1190); c.lineTo(600 + 280 * Math.min(1, rw * 3), 1180); }, RED, 10, 20); g.save(); g.font = '110px Anton'; g.textAlign = 'center'; g.fillStyle = RED; g.shadowColor = RED; g.shadowBlur = 20; g.fillText('I WILL'.slice(0, Math.ceil(6 * rw)), 340, 1250); g.restore(); }
    const qx = rw > 0 ? lerp(220, 520, rw) : lerp(620, 900, seg(t, a, gb)), qy = rw > 0 ? 1180 : 1150; neon(c => { c.moveTo(qx, qy + 40); c.lineTo(qx + 60, qy - 140); c.quadraticCurveTo(qx + 120, qy - 200, qx + 90, qy - 260); }, rw > 0 ? RED : '#9a9aa6', 4, 14);
    if (rw <= 0) neon(c => { c.moveTo(1300, 600); c.quadraticCurveTo(1100, 900, qx + 60, qy - 120); }, '#3a3a46', 34, 0); else A(lerp(150, 380, rw) - 80, 1900, 1.0, Y.write, { glow: 1.3 });
    label('FEAR', 1000, 760, 50, GREY, 1 - rw);
  },
  standup(t, a, b) {       // STAND UP: down on the floor — one explosive move and he's on his feet
    const u = eo(seg(t, a + .1, a + .45)); bg(t, .3 + .3 * u); cam(540, 1250, 1.1, 0, ...shake(t, a + .45, 18)); floor();
    A(540, 1560, .95, mixPose(POSE.sitFloor, POSE.hero, u), { glow: 1.2 + u });
  },
  dust(t, a, b) {          // shake off the dust: he shakes hard — a cloud of grey dust bursts off his shoulders and cape
    const u = seg(t, a, b); bg(t, .35); cam(540, 1250, 1.1, 0, Math.sin(t * 60) * 8 * (1 - u), 0); floor();
    A(540, 1560, .95, mixPose(Y.shakeA, Y.shakeB, .5 + .5 * Math.sin(t * 30)), { glow: 1.3 });
    for (let i = 0; i < 40; i++) { const an = hash(i) * 7, r = 100 + 500 * u * (.5 + hash(i + 2)), x = 540 + Math.cos(an) * r, y = 1200 + Math.sin(an) * r * .8 - 100 * u; neon(c => { c.arc(x, y, 8 + 14 * hash(i + 4), 0, 7); }, '#8a8a96', 2, 0, 'rgba(138,138,150,.4)', 1 - u); }
  },
  living(t, a, b) {        // start living: he strides forward and colour floods the grey world around his steps
    const p = seg(t, a, b), x = lerp(150, 940, p); bg(t, .3 + .4 * p); cam(540, 1200, 1.0); floor();
    for (let i = 0; i < 9; i++) { const bx = 60 + i * 120, lit = bx < x; neon(c => { c.rect(bx, 1300 - 140 * hash(i), 90, 262 + 140 * hash(i)); }, lit ? RED : '#3a3a46', 3, lit ? 24 : 0, lit ? 'rgba(255,42,60,.18)' : '#0c0c10'); }
    A(x, 1560, .9, walk(t), { glow: 1.4 });
  },
  proud(t, a, b) {         // that younger version of you, proud: the boy jumps for joy, fists in the air
    bg(t, .5); cam(540, 1350, 1.3); floor(); const j = Math.abs(Math.sin((t - a) * 5)), y = 1560 - 120 * j;
    K(540, y, mixPose(POSE.hero, POSE.victory, .6 + .4 * j), { glow: 1.6 }); label('PROUD', 540, 1050, 90, RED, back(seg(t, w('proud') - .1, w('proud') + .2)));
    for (let i = 0; i < 8; i++) { const an = i / 8 * 7 + t; neon(c => { c.moveTo(540 + Math.cos(an) * 220, 1350 + Math.sin(an) * 220); c.lineTo(540 + Math.cos(an) * 260, 1350 + Math.sin(an) * 260); }, '#ffb81f', 3, 14, null, j); }
  },
  honor(t, a, b) {         // honor your past, own your future: he kneels and fist-bumps the boy — then rises and points ahead
    const ow = w('own', 46); bg(t, .4); cam(540, 1300, 1.15); floor(); const bp = eo(seg(t, a, a + .35)), up = eo(seg(t, ow - .1, ow + .3));
    A(380, 1560, .9, up > 0 ? mixPose(Y.bump, P.point, up) : mixPose(POSE.hero, Y.bump, bp), { glow: 1.2 + up }); K(620, 1560, up > 0 ? mixPose(Y.kbump, Y.lookUp, up) : Y.kbump, { flip: true });
    if (bp >= 1 && up <= 0) { const q = seg(t, a + .35, a + .7); if (q < 1) neon(c => { c.arc(545, 1400, 20 + 80 * q, 0, 7); }, '#ffb81f', 4, 24, null, 1 - q); }
    label(t < ow ? 'PAST' : 'FUTURE', 540, 1000, 80, RED);
  },
  mirror(t, a, b) {        // become someone they would look up to: he strikes the victory pose — beside him, the boy copies it exactly
    bg(t, .7, 540, 900); cam(540, 1250, lerp(1.0, 1.08, seg(t, a, b))); floor(); const v = eo(seg(t, a, a + .5)), kv = eo(seg(t, a + .5, a + 1.0));
    A(420, 1560, 1.0, mixPose(POSE.hero, POSE.victory, v), { glow: 1.5 }); K(760, 1560, mixPose(Y.lookUp, POSE.victory, kv), { glow: 1.4 }); ground(420, 1560, 1.0, v);
  },
  go(t, a, b) {            // GO MAKE IT HAPPEN: the two of them sprint side by side into the light — hourglass turns, sparks burst
    bg(t, 1.1, 540, 900); cam(540, 1250, lerp(1.05, 1.15, seg(t, a, b)), 0, ...shake(t, w('happen'), 20));
    const off = ((t - a) * 1300) % 200; for (let i = -1; i < 8; i++) line(i * 200 - off, 1562, i * 200 - off + 110, 1562, 'rgba(255,90,110,.6)', 5);
    A(420, 1560, .95, run(t, 17), { wind: 1, glow: 1.6 }); K(760, 1560, run(t + .3, 20), { wind: 1, glow: 1.5 });
    [[w('make'), 540, 760, 1, 1.4], [w('happen'), 240, 600, 2, 1.1], [w('happen') + .3, 840, 560, 3, 1.1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 140, life: 1.2 }));
  },
};
const SC = [];
function scenes() {
  const T = [0, w('look'), w('the', 2.5), w('impossible'), w('and', 5.5), w('what'), w('would', 9.5), w('or', 10.7), w('we'), w('chasing'), w('fitting'), w('we', 21), w('but'), w('waiting', 28), w('waiting', 31), w('its'), w('stand'), w('shake'), w('and', 41), w('younger'), w('honor'), w('become', 47), w('go'), DUR];
  const N = ['hook', 'look', 'eyes', 'dreams', 'hope', 'say', 'lookup', 'fire', 'impress', 'approval', 'boxes', 'kite', 'inner', 'promises', 'protector', 'story', 'standup', 'dust', 'living', 'proud', 'honor', 'mirror', 'go'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('go') - .1, w('happen') + .3));   // the peak ritual: the hourglass turns on "go make it happen"
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
