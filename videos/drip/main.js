// "The Silent Power of Consistency" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 50.6; window.DUR = DUR;
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
const KEY = /intensity|headlines|consistency|history|massive|breakthrough|today|refuse|stop|fail|talent|quit|messy|middle|blinded|illusion|overnight|success|climax|toll|grind|power|roar|drips|drop|water|weak|time|cuts|solid|rock|blueprint|tired|work|nobody|watching|relentless|quiet|discipline|terrify|doubts|chasing|motivation|unstoppable|force|execution|coming|keep|going/i;
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

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: BOOM — a front page spins out of a red blast straight at the lens: OVERNIGHT HIT!
    bg(t, .5); flash(t, 0, .14, '255,42,60', .6); const u = eo(seg(t, 0, .9)); cam(540, 960, 1.0, 0, ...shake(t, 0, 30, .5));
    for (let i = 0; i < 14; i++) { const an = i / 14 * 7, r = 100 + 900 * seg(t, 0, .6); neon(c => { c.moveTo(540 + Math.cos(an) * r * .3, 960 + Math.sin(an) * r * .3); c.lineTo(540 + Math.cos(an) * r, 960 + Math.sin(an) * r); }, RED, 6, 30, null, 1 - seg(t, .3, .9)); }
    paper(540, 1000, lerp(.1, 1.6, u) + .05 * Math.sin(t * 3), (1 - u) * 12 + Math.sin(t * 2) * .05, 'OVERNIGHT HIT!');
  },
  history(t, a, b) {       // consistency makes history: he walks on — every footstep he has ever taken stays lit behind him, a trail out of frame
    bg(t, .2); const x = 560 + (t - a) * 140; cam(x - 60, 1250, 1.0); floor(); trail(t, x, 1560);
    label('HISTORY', x - 400, 1430, 70, RED, eo(seg(t, w('history') - .1, w('history') + .3)));
    A(x, 1560, .95, walk(t), { glow: 1.2 });
  },
  breakthrough(t, a, b) {  // no earth-shattering breakthrough: in a thought bubble a planet cracks open — then the bubble pops
    bg(t, .15); cam(540, 1150, 1.0); floor(); const pop = seg(t, w('today') - .05, w('today') + .25), cr = eo(seg(t, w('shattering') - .2, w('shattering') + .4));
    A(300, 1560, .8, P.gaze);
    if (pop < 1) { const k = 1 - pop; g.save(); g.globalAlpha = k; [[380, 1060, 20], [440, 960, 32]].forEach(([x, y, r]) => neon(c => { c.arc(x, y, r, 0, 7); }, '#d8d8e4', 3, 8, '#0c0c10'));
      neon(c => { c.ellipse(640, 700, 360 * (1 + pop * .5), 260 * (1 + pop * .5), 0, 0, 7); }, '#d8d8e4', 4, 10, '#0c0c10');
      for (const s2 of [-1, 1]) { g.save(); g.translate(640 + s2 * 50 * cr, 700); g.rotate(s2 * .15 * cr); g.beginPath(); s2 < 0 ? g.rect(-200, -200, 200, 400) : g.rect(0, -200, 200, 400); g.clip(); neon(c => { c.arc(0, 0, 160, 0, 7); c.moveTo(-120, -40); c.quadraticCurveTo(-40, -90, 20, -30); c.moveTo(-60, 60); c.quadraticCurveTo(40, 30, 110, 80); }, '#9a9aa6', 4, 10, '#16161c'); g.restore(); }
      if (cr > 0) neon(c => { c.moveTo(640, 520); c.lineTo(620, 620); c.lineTo(660, 700); c.lineTo(625, 790); c.lineTo(640, 880); }, RED, 5, 30, null, cr); g.restore(); }
    if (pop > 0 && pop < 1) for (let i = 0; i < 12; i++) { const an = i / 12 * 7; neon(c => { c.arc(640 + Math.cos(an) * 400 * eo(pop), 700 + Math.sin(an) * 300 * eo(pop), 8, 0, 7); }, '#d8d8e4', 2, 6, null, 1 - pop); }
  },
  wind(t, a, b) {          // just refuse to stop: a gale of STOP signs flies at him — he leans into it and keeps walking
    bg(t, .2); cam(540, 1200, 1.05, 0, Math.sin(t * 40) * 4, 0); const off = ((t - a) * 160) % 200; floor();
    for (let i = -1; i < 8; i++) line(i * 200 - off, 1580, i * 200 - off + 80, 1580, 'rgba(255,255,255,.25)', 3);
    for (let i = 0; i < 18; i++) { const q = ((t - a) * 1.1 + hash(i)) % 1, x = lerp(1300, -300, q), y = 500 + hash(i + 4) * 1000 + Math.sin(q * 10 + i) * 40; line(x, y, x + 200, y, 'rgba(255,255,255,.18)', 2);
      if (i % 3 === 0) { g.save(); g.translate(x, y); g.rotate(q * 9 + i); neon(c => { for (let k = 0; k < 8; k++) { const an = k / 8 * 7 + .39; c[k ? 'lineTo' : 'moveTo'](Math.cos(an) * 60, Math.sin(an) * 60); } c.closePath(); }, '#9a9aa6', 3, 0, '#2a2a32'); g.font = '30px Anton'; g.fillStyle = '#d8d8e4'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('STOP', 0, 0); g.restore(); } }
    A(480, 1560, .95, walkD(t), { wind: 1, glow: 1.3 });
  },
  talent(t, a, b) {        // not because they lack talent: the grey figure holds a glowing TALENT gem — it's right there
    bg(t, .12); cam(540, 1150, lerp(1.05, 1.2, seg(t, a, b))); floor();
    const k = ayaz(g, 460, 1560, .85, D.gem, { col: CROWD, glow: .5 }), [hx, hy] = hand(k, 460, 1560, .85), gy = hy - 70 + Math.sin(t * 3) * 6;
    neon(c => { c.moveTo(hx, gy - 60); c.lineTo(hx + 45, gy - 20); c.lineTo(hx, gy + 50); c.lineTo(hx - 45, gy - 20); c.closePath(); c.moveTo(hx - 45, gy - 20); c.lineTo(hx + 45, gy - 20); }, RED, 4, 40, 'rgba(255,42,60,.45)');
    label('TALENT ✓', hx, gy - 140, 64, RED, back(seg(t, w('talent') - .1, w('talent') + .2)));
  },
  middle(t, a, b) {        // they quit in the messy middle: the road from START to FINISH knots into a tangle — the grey walker turns back
    bg(t, .12); cam(540, 1150, 1.0); const p = seg(t, a, w('middle') + .2), back2 = eo(seg(t, w('middle') + .2, b));
    line(80, 1300, 1000, 1300, 'rgba(255,255,255,.4)', 6); label('START', 120, 1380, 44, GREY); label('FINISH', 960, 1380, 44, RED);
    g.save(); g.strokeStyle = '#8a8a96'; g.lineWidth = 4; g.beginPath(); for (let i = 0; i < 40; i++) { const an = i * 1.7, r = 40 + 90 * hash(i); g[i ? 'lineTo' : 'moveTo'](560 + Math.cos(an) * r * 1.6, 1240 + Math.sin(an) * r * .8); } g.stroke(); g.restore(); label('MESSY MIDDLE', 560, 1080, 52, GREY);
    const x = back2 > 0 ? lerp(400, 160, back2) : lerp(140, 400, p); ayaz(g, x, 1300, .45, walk(t), { col: CROWD, glow: .5, flip: back2 > 0 });
  },
  overnight(t, a, b) {     // blinded by the illusion of overnight success: a glittering mirage billboard under a moon — he walks toward it, hands out
    bg(t, .1); cam(540, 1150, lerp(1.0, 1.15, seg(t, a, b))); floor();
    neon(c => { c.arc(860, 420, 60, 0, 7); }, '#d8d8e4', 3, 24, 'rgba(220,220,235,.15)'); const sh = .5 + .5 * Math.sin(t * 9);
    g.save(); g.globalAlpha = .7 + .3 * sh; neon(c => { c.roundRect(160, 620, 760, 360, 30); }, '#ffd77a', 5, 40, 'rgba(255,215,122,.08)'); label('OVERNIGHT', 540, 740, 110, '#ffd77a'); label('SUCCESS', 540, 880, 110, '#ffd77a'); g.restore();
    for (let i = 0; i < 6; i++) line(160 + i * 140 + Math.sin(t * 4 + i) * 20, 1000, 200 + i * 140 + Math.sin(t * 4 + i) * 20, 1500, 'rgba(255,215,122,.08)', 6);
    const x = lerp(260, 420, seg(t, a, b)); ayaz(g, x, 1560, .8, mixPose(D.blind, POSE.walkA, .3 + .3 * Math.sin(t * 6)), { col: CROWD, glow: .5 });
    neon(c => { const k0 = ayaz(g, -9e4, -9e4, .8, D.blind, { col: CROWD }); c.moveTo(x + k0.head[0] * .8 - 40, 1560 + k0.head[1] * .8); c.lineTo(x + k0.head[0] * .8 + 40, 1560 + k0.head[1] * .8); }, '#ffd77a', 10, 20);
  },
  toll(t, a, b) {          // the toll of the daily grind: a toll gate — the grey one walks into it and bounces off; he drops the coin, it swings open
    bg(t, .2); cam(560, 1250, .95); floor(); const pay = w('daily') - .4, op = eo(seg(t, pay + .2, pay + .6));
    neon(c => { c.rect(500, 1050, 50, 512); c.rect(760, 1050, 50, 512); }, '#8a8a96', 4, 6, '#121218'); neon(c => { c.roundRect(420, 880, 470, 150, 16); }, RED, 4, 20, '#14070a'); label('TOLL', 655, 925, 50, RED); label('THE DAILY GRIND', 655, 985, 40, WHITE);
    neon(c => { c.rect(512, 1240, 26, 10); }, '#ffb81f', 2, 10);
    g.save(); g.translate(760, 0); g.scale(1 - .9 * op, 1); for (let i = 0; i < 5; i++) neon(c => { c.moveTo(-210 + i * 48, 1200); c.lineTo(-210 + i * 48, 1562); }, '#c8c8d2', 5, 8); neon(c => { c.moveTo(-210, 1220); c.lineTo(0, 1220); c.moveTo(-210, 1540); c.lineTo(0, 1540); }, '#c8c8d2', 5, 8); g.restore();
    const bk = seg(t, a + .8, a + 1.1), gx = t < a + .8 ? lerp(-100, 440, seg(t, a, a + .8)) : t < a + 1.4 ? lerp(440, 360, eo(bk)) : lerp(360, -200, seg(t, a + 1.4, a + 2.3));
    if (gx > -150) ayaz(g, gx, 1560, .7, t < a + .8 ? walk(t) : t < a + 1.4 ? Q.flinch : walk(t), { col: CROWD, glow: .5, flip: t > a + 1.4 }); if (bk > 0 && bk < 1) label('✗', 520, 1150, 80, GREY, 1 - bk);
    const ax = t < pay ? lerp(-150, 430, seg(t, a + 1.6, pay)) : t < pay + .5 ? 430 : lerp(430, 1000, seg(t, pay + .5, b)), k = A(ax, 1560, .8, t < pay - .15 ? walk(t) : (t < pay + .45 ? D.coin : walk(t)));
    if (t > pay - .15 && t < pay + .2) { const [hx, hy] = hand(k, ax, 1560, .8), q = seg(t, pay - .1, pay + .15); neon(c => { c.arc(lerp(hx, 525, q), lerp(hy, 1245, q), 16, 0, 7); }, '#ffb81f', 4, 20, '#ffb81f'); }
  },
  roar(t, a, b) {          // true power doesn't roar: giant shaking ROAR letters — they crumble to dust and silence
    const cr = seg(t, w('roar') - .05, w('roar') + .6); bg(t, .3 * (1 - cr)); cam(540, 1000, 1.0, 0, ...(cr <= 0 ? [Math.sin(t * 70) * 12, Math.cos(t * 60) * 8] : [0, 0]));
    shatter(c => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.font = '330px Anton'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#d8d8e4'; c.shadowColor = 'rgba(255,255,255,.5)'; c.shadowBlur = 30; c.fillText('ROAR', 540, 1000); c.restore(); }, cr, 540, 1400, 5);
    if (cr > .3) { floor(); A(540, 1560, .9, POSE.hero, { glow: .6 + .4 * seg(cr, .3, 1) }); }
  },
  drips(t, a, b) {         // it drips: a single red drop swells on the tip of a dark stone — and lets go
    bg(t, .15); cam(540, lerp(900, 1050, seg(t, a, b)), 1.4);
    neon(c => { c.moveTo(200, 300); c.lineTo(500, 300); c.lineTo(540, 640); c.lineTo(580, 300); c.lineTo(880, 300); c.lineTo(880, 100); c.lineTo(200, 100); c.closePath(); }, '#8a8a96', 5, 4, '#16161c');
    const sw = eo(seg(t, a, a + .5)), fl = seg(t, a + .55, b + .2); drop(540, 650 + 20 * sw + fl * fl * 900, 10 + 16 * sw);
  },
  weak(t, a, b) {          // a single drop feels weak: it hits the rock — a tiny splash, nothing — WEAK?
    bg(t, .1); cam(540, 1250, 1.1); const hit = a + .35; rock(540, 1562, 380, 320); floor();
    if (t < hit) drop(540, lerp(700, 1220, seg(t, a, hit)), 22); else { const q = seg(t, hit, hit + .5); for (const s2 of [-1, 1]) neon(c => { c.arc(540 + s2 * 50 * q, 1236 - 60 * Math.sin(q * Math.PI), 8, 0, 7); }, RED, 2, 12, RED, 1 - q); }
    label('WEAK?', 540, 900, 90, GREY, eo(seg(t, w('weak') - .1, w('weak') + .2)));
  },
  time(t, a, b) {          // given enough time: time-lapse — drops rain down, the counter races to a million, a groove deepens
    bg(t, .2); cam(540, 1250, 1.1); const p = seg(t, a, b); rock(540, 1562, 380, 320); floor();
    neon(c => { c.moveTo(540 - 40 * p, 1242); c.quadraticCurveTo(540, 1242 + 220 * p, 540 + 40 * p, 1242); }, RED, 4, 20 * p, '#0a0306');
    for (let i = 0; i < 6; i++) { const q = ((t - a) * 4 + i / 6) % 1; drop(540, lerp(700, 1240, q), 12, 1 - q * .3); }
    const n = Math.floor(Math.pow(10, 6 * eio(p))); label(n.toLocaleString('en-US') + ' DROPS', 540, 900, 80, WHITE);
  },
  cut(t, a, b) {           // it cuts right through solid rock: the stone splits in two, red light blasts through the crack
    const sp = w('rock') - .1, u = eo(seg(t, sp, sp + .4)); bg(t, .2 + .8 * u, 540, 1350); cam(540, 1250, 1.05, 0, ...shake(t, sp, 30)); flash(t, sp, .1);
    if (u > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,60,80,${.5 * u})`; g.fillRect(540 - 70 * u, 300, 140 * u, 1300); g.restore(); }
    rock(540, 1562, 380, 320, u); floor(); for (let i = 0; i < 3; i++) { const q = ((t - a) * 4 + i / 3) % 1; if (u < .2) drop(540, lerp(700, 1240, q), 12); }
    neon(c => { c.moveTo(540, 1242); c.lineTo(540, 1242 + 320 * Math.min(1, seg(t, a, sp) + u)); }, RED, 5, 30);
  },
  blueprint(t, a, b) {     // that is your blueprint: lines draw themselves — a schematic of HIM, annotated "1 DROP / DAY"
    bg(t, .1); cam(540, 1100, 1.0); for (let i = 0; i < 12; i++) { line(i * 100, 0, i * 100, 1920, 'rgba(255,42,60,.08)', 2); } for (let i = 0; i < 20; i++) line(0, i * 100, 1080, i * 100, 'rgba(255,42,60,.08)', 2);
    const d = eo(seg(t, a, b - .3)); g.save(); g.globalAlpha = .4 + .6 * d; A(540, 1500, .95, POSE.hero, { glow: .6 }); g.restore();
    neon(c => { c.moveTo(860, 600); c.lineTo(860, 1500); c.moveTo(830, 600); c.lineTo(890, 600); c.moveTo(830, 1500); c.lineTo(890, 1500); }, WHITE, 3, 6, null, d); label('1 DROP / DAY', 540, 1640, 70, WHITE, d); 
  },
  tired(t, a, b) {         // show up when you're tired: he drags himself forward, shoulders slumped — then straightens into the lit doorway
    bg(t, .15); cam(560, 1200, 1.05); floor(); const up = eo(seg(t, w('tired') + .1, b));
    neon(c => { c.rect(760, 900, 240, 662); }, RED, 5, 30, `rgba(255,42,60,${.15 + .3 * up})`); label('SHOW UP', 880, 840, 50, RED);
    A(lerp(260, 600, seg(t, a, b)), 1560, .9, mixPose(mixPose(D.tired, { ...D.tired, q1: .2, k1: .4, q2: -.35, k2: .2 }, .5 + .5 * Math.sin(t * 4)), walk(t), up), { glow: .8 + .5 * up });
  },
  nobody(t, a, b) {        // the work when nobody is watching: an empty grandstand — he pushes a huge block across, alone
    bg(t, .15); cam(540, 1250, 1.0); floor();
    for (let r = 0; r < 4; r++) neon(c => { c.moveTo(-100, 700 + r * 110); c.lineTo(1200, 700 + r * 110); for (let i = 0; i < 12; i++) { c.moveTo(i * 100, 700 + r * 110); c.lineTo(i * 100 + 30, 650 + r * 110); } }, '#3a3a46', 3, 0);
    label('0 WATCHING', 540, 1700, 60, GREY); const bx = lerp(560, 700, seg(t, a, b));
    neon(c => { c.rect(bx, 1250, 320, 312); }, '#9a9aa6', 5, 6, '#18181f'); A(bx - 150, 1560, .9, mixPose(POSE.push, { ...POSE.push, q1: -.4, q2: .3 }, .5 + .5 * Math.sin(t * 5)), { glow: 1.2 });
  },
  terrify(t, a, b) {       // quiet discipline terrifies your doubts: he walks steady — the grey doubt-shadows flinch and flee
    bg(t, .25); cam(540, 1200, 1.0); floor(); const tf = w('terrify') - .1, u = seg(t, tf, b);
    A(lerp(200, 380, seg(t, a, b)), 1560, .9, walk(t), { glow: 1.2 + u });
    for (let i = 0; i < 4; i++) { const x0 = 620 + i * 130, x = x0 + u * u * 900 * (1 + i * .3); g.save(); ayaz(g, x, 1560, .6, u > 0 ? run(t, 18) : mixPose(POSE.stand, Q.flinch, .3 + .3 * Math.sin(t * 3 + i)), { col: CROWD, glow: .5 }); g.restore(); label('?', x, 1090, 60, '#9a9aa6'); }
    label('DOUBTS', 820, 900, 60, GREY, 1 - u);
  },
  chase(t, a, b) {         // stop chasing bursts of motivation: a grey figure swings a net at sky-bursts — each one fizzles out
    bg(t, .35); neon(c => { c.arc(860, 460, 50, 0, 7); }, '#d8d8e4', 3, 20, 'rgba(220,220,235,.12)'); cam(540, 1150, 1.0); floor();
    for (let i = 0; i < 4; i++) { const t0 = a + i * .6, q = seg(t, t0, t0 + .7), bx = 250 + i * 200, by = 750 + hash(i) * 200; if (q > 0 && q < 1) { for (let k = 0; k < 10; k++) { const an = k / 10 * 7; neon(c => { c.moveTo(bx + Math.cos(an) * 30 * q, by + Math.sin(an) * 30 * q); c.lineTo(bx + Math.cos(an) * 160 * q, by + Math.sin(an) * 160 * q + 80 * q * q); }, '#ffd77a', 3, 20, null, 1 - q); } label('MOTIVATION', bx, by - 190 * q, 46, '#ffd77a', 1 - q); } }
    const x = lerp(150, 900, seg(t, a, b)), k = ayaz(g, x, 1560, .7, mixPose(D.net, D.netB, .5 + .5 * Math.sin(t * 15)), { col: CROWD, glow: .5 }), [hx, hy] = hand(k, x, 1560, .7);
    neon(c => { c.moveTo(hx, hy); c.lineTo(hx + 40, hy - 160); c.ellipse(hx + 60, hy - 210, 60, 45, .3, 0, 7); }, '#9a9aa6', 4, 0);
  },
  force(t, a, b) {         // an unstoppable force through daily execution: walls marked DAY 1, DAY 2, DAY 3 burst as he walks through — no slowing
    bg(t, .3); const p = seg(t, a, b), x = lerp(150, 1500, p); cam(x + 200, 1200, 1.0); floor();
    for (let i = 0; i < 5; i++) { const wx = 500 + i * 300, br = seg(x + 40, wx - 40, wx + 60); if (br >= 1) continue;
      shatter(c => { const M = g.getTransform(); c.setTransform(M); c.fillStyle = '#18181f'; c.fillRect(wx, 1000, 60, 562); c.strokeStyle = '#9a9aa6'; c.lineWidth = 4; c.strokeRect(wx, 1000, 60, 562); c.save(); c.translate(wx + 30, 1280); c.rotate(-Math.PI / 2); c.font = '50px Anton'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#d8d8e4'; c.fillText('DAY ' + (i + 1), 0, 0); c.restore(); }, br * .9, 540, 1280, i + 2); }
    A(x, 1560, .9, run(t, 13), { wind: 1, glow: 1.4 });
  },
  coming(t, a, b) {        // your time is coming: the hourglass on his chest turns — light rises behind him
    const k = eo(seg(t, a, b)); bg(t, .4 + .6 * k, 540, 1500); cam(540, lerp(1050, 1150, k), lerp(1.6, 1.15, k));
    floor(); A(540, 1560, .95, mixPose(POSE.hero, P.gaze, .5), { glow: 1.3 + k }); ground(540, 1560, .95, k);
  },
  keep(t, a, b) {          // keep going: on he walks into the light, his trail of red footprints behind him — sparks burst overhead
    bg(t, 1.1, 900, 1200); const x = 540 + (t - a) * 140; cam(x - 60, 1250, lerp(1.0, .92, seg(t, a, b)), 0, ...shake(t, w('going'), 18)); floor(); trail(t, x, 1560);
    A(x, 1560, .95, walk(t), { glow: 1.6 });
    [[w('keep'), x, 800, 1, 1.4], [w('going') + .1, x - 300, 640, 2, 1.1], [w('going') + .4, x + 300, 600, 3, 1.1]].forEach(([t0, x2, y, s2, sc]) => sparks(g, x2, y, t - t0, { seed: s2, scale: sc, n: 140, life: 1.3 }));
  },
};
const SC = [];
function scenes() {
  const T = [0, w('but'), w('you'), w('you', 7), w('most'), w('but', 13), w('blinded'), w('they', 18), w('but', 22), w('it', 24), w('a', 25.5), w('yet'), w('it', 29), w('that'), w('show'), w('put'), w('let'), w('stop', 41), w('become'), w('your', 47.5), w('keep'), DUR];
  const N = ['hook', 'history', 'breakthrough', 'wind', 'talent', 'middle', 'overnight', 'toll', 'roar', 'drips', 'weak', 'time', 'cut', 'blueprint', 'tired', 'nobody', 'terrify', 'chase', 'force', 'coming', 'keep'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('your', 47.5), w('coming') + .3));   // the peak ritual: the hourglass turns on "your time is coming"
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
