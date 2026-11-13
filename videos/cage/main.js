// "Your Comfort Zone Is Your Biggest Enemy" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 43.4; window.DUR = DUR;
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
const KEY = /safety|silent|cage|comfortable|protecting|murdering|potential|growth|comfort|never|room|easy|cozy|couch|familiar|routine|trading|extraordinary|future|temporary|relief|excellence|warm|fear|sweat|uncertainty|stop|settling|fine|painful|built|more|surviving|break|chains|step|discomfort|greatness|waiting|claim/i;
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

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: frame one — a steel cage is already falling; it SLAMS down over him, he grabs the bars
    bg(t, .3); const sl = .3, cy = t < sl ? lerp(600, 1562, ei(seg(t, 0, sl))) : 1562; flash(t, 0, .1, '255,42,60', .55); flash(t, sl, .1);
    cam(540, 1200, lerp(1.3, 1.05, eo(seg(t, 0, 1.4))), 0, ...shake(t, sl, 36, .5)); floor();
    A(540, 1560, .95, t < sl + .2 ? mixPose(POSE.hero, Q.flinch, eo(seg(t, 0, sl))) : mixPose(Q.flinch, C2.grip, eo(seg(t, sl + .2, sl + .6))), { glow: 1.3 }); cageDraw(540, cy, 700, 1000);
    if (t > sl) for (let i = 0; i < 8; i++) { const q = seg(t, sl, sl + .5); neon(c => { c.arc(200 + i * 95, 1562 - 30 * q, 10 + 30 * q, 0, 7); }, '#9a9aa6', 2, 0, null, 1 - q); }
    label('SAFETY', 540, 500, 90, GREY, back(seg(t, .6, .9)));
  },
  protect(t, a, b) {       // you think staying comfortable protects you: a grey figure lounges inside a cushioned cage — a lock labelled PROTECTED
    bg(t, .12); cam(540, 1250, lerp(1.0, 1.08, seg(t, a, b))); floor();
    for (let i = 0; i < 4; i++) neon(c => { c.roundRect(260 + i * 140, 1460, 130, 100, 40); }, '#8a7a7a', 3, 0, '#1c1618'); grey(560, 1562, .7, C2.lounge, 1);
    cageDraw(540, 1562, 700, 1000); neon(c => { c.roundRect(860, 1150, 90, 80, 10); c.moveTo(875, 1150); c.arc(905, 1150, 30, Math.PI, 0); }, '#d8d8e4', 4, 10, '#18181f'); label('PROTECTED', 905, 1290, 40, GREY);
  },
  bird(t, a, b) {          // quietly murdering your potential: a red bird in a little cage — its glow drains grey, a feather drifts down
    const u = eo(seg(t, a + .3, w('potential') + .2)); bg(t, .2 * (1 - u)); cam(540, 1050, 1.15); neon(c => { c.moveTo(540, 300); c.lineTo(540, 560); }, '#9a9aa6', 3, 0);
    cageDraw(540, 1300, 460, 640, 1, '#b8b8c4'); const col = u > .5 ? '#7a7a86' : RED, bob = Math.sin(t * (6 - 5 * u)) * 10 * (1 - u);
    g.save(); g.translate(540, 1080 + bob + 120 * u); g.rotate(.3 * u); neon(c => { c.ellipse(0, 0, 80, 55, 0, 0, 7); c.moveTo(110, -40); c.arc(80, -40, 30, 0, 7); c.moveTo(108, -42); c.lineTo(140, -34); c.lineTo(108, -26); c.moveTo(-70, 0); c.lineTo(-150, -30 + 50 * u); c.lineTo(-140, 20); }, col, 4, 30 * (1 - u), u > .5 ? '#16161c' : 'rgba(255,42,60,.35)');
    neon(c => { c.moveTo(-10, -10); c.quadraticCurveTo(10, -80 + 70 * u, 50, -30); }, col, 4, 20 * (1 - u)); g.restore(); neon(c => { c.moveTo(380, 1300); c.lineTo(700, 1300); }, '#b8b8c4', 5, 0);
    const fq = seg(t, w('murdering'), b); if (fq > 0) neon(c => { const fx = 560 + Math.sin(fq * 9) * 60, fy = 1100 + fq * 700; c.ellipse(fx, fy, 30, 9, Math.sin(fq * 9) * .6, 0, 7); }, '#9a9aa6', 3, 0, '#3a3a46');
    label('POTENTIAL', 540, 1430, 60, u > .5 ? GREY : RED);
  },
  room(t, a, b) {          // growth and comfort can't share a room: a grey sofa in a small room — a red vine grows and bursts the walls apart
    const gr = eo(seg(t, a + .2, w('room'))), br = eo(seg(t, w('room'), w('room') + .4)); bg(t, .15 + .5 * br); cam(540, 1150, 1.0, 0, ...shake(t, w('room'), 26));
    for (const s2 of [-1, 1]) { g.save(); g.translate(s2 * 500 * br, -200 * br * br); g.rotate(s2 * .3 * br); neon(c => { s2 < 0 ? (c.moveTo(540, 600), c.lineTo(160, 600), c.lineTo(160, 1562), c.lineTo(540, 1562)) : (c.moveTo(540, 600), c.lineTo(920, 600), c.lineTo(920, 1562), c.lineTo(540, 1562)); }, '#8a8a96', 6, 4); g.restore(); }
    couch(380, 1562, .55); label('COMFORT', 380, 1300, 44, GREY); label('GROWTH', 740, 1480 - 820 * gr, 50, RED);
    neon(c => { c.moveTo(740, 1562); for (let i = 1; i <= 20; i++) { const q = i / 20 * gr; c.lineTo(740 + Math.sin(i * .9) * 50 * q, 1562 - 900 * q * (1 + br * .4)); } }, RED, 8, 30);
    for (let i = 0; i < 6; i++) { const q = seg(gr, i / 7, i / 7 + .2); if (q > 0) neon(c => { const ly = 1562 - 900 * (i + 1) / 7 * gr, lx = 740 + Math.sin((i + 1) * 2.6) * 50 * gr, s2 = i % 2 ? 1 : -1; c.ellipse(lx + s2 * 50 * q, ly, 50 * q, 20 * q, s2 * .4, 0, 7); }, RED, 3, 20, 'rgba(255,42,60,.4)'); }
  },
  easy(t, a, b) {          // choosing the easy way out: two doors — EASY glows soft and downhill, HARD is steep and red — the grey figure takes EASY
    bg(t, .15); cam(540, 1200, 1.0); floor();
    neon(c => { c.rect(160, 950, 280, 612); }, '#b8b8c4', 4, 20, 'rgba(200,200,215,.12)'); label('EASY', 300, 900, 64, '#b8b8c4');
    neon(c => { c.rect(640, 950, 280, 612); }, RED, 5, 30, '#14070a'); label('HARD', 780, 900, 64, RED); neon(c => { for (let i = 0; i < 5; i++) { c.moveTo(660 + i * 50, 1560 - i * 110); c.lineTo(710 + i * 50, 1560 - i * 110); c.lineTo(710 + i * 50, 1450 - i * 110); } }, RED, 3, 10, null, .6);
    const p = seg(t, a, b - .2), x = p < .45 ? lerp(540, 540, p) : lerp(540, 300, seg(p, .45, 1)); grey(x, 1560, .7, p < .45 ? mixPose(POSE.stand, { ...POSE.stand, head: -.3 }, Math.sin(t * 3) * .5 + .5) : walk(t), 1 - seg(p, .85, 1), p >= .45);
  },
  couch(t, a, b) {         // the cozy couch: the cushions swallow him like quicksand
    const s = eo(seg(t, a, b)); bg(t, .1); cam(540, 1300, 1.15); floor(); couch(540, 1562, 1.0, s);
    g.save(); g.beginPath(); g.rect(-400, 0, 2000, 1460 + 30 * s); g.clip(); grey(520, 1560 - 140 + 260 * s, .75, { ...POSE.sitTall, lean: -.3, a1: -.2, f1: -.6, y: 152 }, 1); g.restore();
    neon(c => { c.roundRect(240, 1452 + 30 * s, 600, 30, 15); }, '#b8a8a8', 3, 6, '#221c1e');
  },
  routine(t, a, b) {       // the familiar routine: a grey figure running in a hamster wheel labelled ROUTINE — going nowhere
    bg(t, .12); cam(540, 1150, 1.0); floor(); const rot = (t - a) * 4; wheel(540, 1150, 360, rot); label('ROUTINE', 540, 700, 70, GREY);
    grey(540, 1150 + 330, .7, run(t, 16), 1);
  },
  trade(t, a, b) {         // trading your extraordinary future for temporary relief: his glowing FUTURE slides across the counter; a pillow comes back — and puffs to dust
    bg(t, .15); cam(540, 1150, 1.05); floor(); const sw = eo(seg(t, w('trading'), w('future') + .3)), rp = seg(t, w('relief') + .1, w('relief') + .7);
    neon(c => { c.rect(200, 1300, 680, 40); c.rect(240, 1340, 600, 222); }, '#8a8a96', 4, 4, '#121218');
    grey(130, 1560, .75, C2.hold, 1); grey(950, 1560, .75, C2.hold, 1, true);
    const fx = lerp(280, 800, sw); neon(c => { c.arc(fx, 1220, 70, 0, 7); }, RED, 5, 50, 'rgba(255,42,60,.5)'); label('FUTURE', fx, 1100, 44, RED);
    const px = lerp(800, 280, sw); if (rp < 1) { g.save(); g.globalAlpha = 1 - rp; neon(c => { c.roundRect(px - 60, 1250, 120, 50, 20); }, '#b8b8c4', 3, 6, '#22222a'); g.restore(); label('RELIEF', px, 1200, 34, GREY, 1 - rp); }
    if (rp > 0) for (let i = 0; i < 16; i++) { const an = i / 16 * 7; neon(c => { c.arc(px + Math.cos(an) * 120 * rp, 1270 + Math.sin(an) * 60 * rp - 80 * rp, 6, 0, 7); }, '#9a9aa6', 2, 0, null, 1 - rp); }
  },
  cozy(t, a, b) {          // excellence doesn't hide where it's warm and cozy: he sweeps a lantern over a cozy fireside room — nothing there
    bg(t, .15); cam(540, 1250, 1.0); floor();
    neon(c => { c.rect(720, 1250, 260, 312); c.rect(760, 1330, 180, 232); }, '#9a8c8c', 4, 4, '#1a1517'); for (let i = 0; i < 4; i++) neon(c => { c.moveTo(800 + i * 30, 1562); c.quadraticCurveTo(810 + i * 30 + Math.sin(t * 9 + i) * 15, 1470, 805 + i * 30, 1420 - Math.abs(Math.sin(t * 7 + i)) * 40); }, '#ff9a4a', 4, 20, null, .8);
    couch(420, 1562, .5); const k = A(200, 1560, .85, C2.lamp, { glow: 1 }), [hx, hy] = hand(k, 200, 1560, .85), an = -.3 + .5 * Math.sin((t - a) * 2.2);
    neon(c => { c.roundRect(hx - 20, hy, 40, 60, 8); }, '#ffb81f', 3, 20, '#3a2a10'); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,215,122,.12)'; g.beginPath(); g.moveTo(hx, hy + 30); g.lineTo(hx + 900 * Math.cos(an - .2), hy + 30 + 900 * Math.sin(an - .2)); g.lineTo(hx + 900 * Math.cos(an + .2), hy + 30 + 900 * Math.sin(an + .2)); g.fill(); g.restore();
    label('EXCELLENCE?', 540, 900, 70, GREY, .5 + .5 * Math.sin(t * 4));
  },
  otherside(t, a, b) {     // it lives on the other side of fear, sweat and uncertainty: he punches through three walls — beyond them, a red crown of light
    const ws = [w('fear'), w('sweat'), w('uncertainty')], p = seg(t, a, b), x = lerp(150, 1500, eio(p)); bg(t, .25 + .4 * seg(t, ws[2], b)); cam(x + 150, 1200, .95); floor();
    ['FEAR', 'SWEAT', 'UNCERTAINTY'].forEach((n, i) => { const wx = 500 + i * 330, br = seg(t, ws[i] - .05, ws[i] + .5); if (br >= 1) return;
      shatter(c => { const M = g.getTransform(); c.setTransform(M); c.fillStyle = '#16161c'; c.fillRect(wx, 800, 70, 762); c.strokeStyle = '#9a9aa6'; c.lineWidth = 4; c.strokeRect(wx, 800, 70, 762); c.save(); c.translate(wx + 35, 1180); c.rotate(-Math.PI / 2); c.font = '54px Anton'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#c8c8d2'; c.fillText(n, 0, 0); c.restore(); }, br, 540, 1200, i + 7);
      if (i === 1 && br <= 0) for (let d = 0; d < 6; d++) drop(wx + 35, 820 + ((t * 300 + d * 130) % 740), 10, .7); });
    neon(c => { const cx = 1650, cy = 1100; c.moveTo(cx - 120, cy + 60); c.lineTo(cx - 120, cy - 40); c.lineTo(cx - 60, cy + 10); c.lineTo(cx, cy - 80); c.lineTo(cx + 60, cy + 10); c.lineTo(cx + 120, cy - 40); c.lineTo(cx + 120, cy + 60); c.closePath(); }, RED, 6, 60, 'rgba(255,42,60,.4)'); label('EXCELLENCE', 1650, 1260, 60, RED);
    A(x, 1560, .9, run(t, 15), { wind: 1, glow: 1.3 });
  },
  fine(t, a, b) {          // stop settling for "fine": a gauge — PAIN … FINE … GREAT — the needle drifts down and settles on FINE
    bg(t, .12); cam(540, 1100, 1.05); const nd = lerp(-.3, 0, eo(seg(t, a, w('fine')))) + Math.sin(t * 2) * .02;
    neon(c => { c.arc(540, 1250, 380, Math.PI, 0); }, '#9a9aa6', 6, 6); for (let i = 0; i <= 10; i++) { const an = Math.PI + i / 10 * Math.PI; neon(c => { c.moveTo(540 + Math.cos(an) * 340, 1250 + Math.sin(an) * 340); c.lineTo(540 + Math.cos(an) * 380, 1250 + Math.sin(an) * 380); }, '#9a9aa6', 4, 0); }
    label('PAIN', 220, 1310, 50, GREY); label('FINE', 540, 820, 60, GREY); label('GREAT', 860, 1310, 50, RED);
    const an = -Math.PI / 2 + nd * Math.PI; neon(c => { c.moveTo(540, 1250); c.lineTo(540 + Math.cos(an) * 320, 1250 + Math.sin(an) * 320); }, WHITE, 7, 20); neon(c => { c.arc(540, 1250, 26, 0, 7); }, WHITE, 3, 10, '#18181f');
    grey(540, 1700, .45, { ...POSE.sitTall, y: 152 }, .9);
  },
  painful(t, a, b) {       // just because it isn't painful: a grey figure wrapped head to toe in bubble wrap and a padded helmet, standing perfectly still
    bg(t, .1); cam(540, 1200, lerp(1.0, 1.15, seg(t, a, b))); floor(); grey(540, 1560, .9, POSE.stand, 1);
    for (let i = 0; i < 40; i++) { const x = 540 + (hash(i) - .5) * 200, y = 1000 + hash(i + 3) * 560; neon(c => { c.arc(x, y, 18, 0, 7); }, '#b8c4d8', 2, 6, 'rgba(180,196,216,.08)'); }
    neon(c => { c.roundRect(430, 900, 220, 180, 60); }, '#b8c4d8', 4, 10, 'rgba(180,196,216,.1)'); label('NO PAIN', 540, 800, 64, GREY); label('NO GAIN', 540, 1700, 64, RED, seg(t, w('painful'), w('painful') + .3));
  },
  week(t, a, b) {          // built for more than surviving the week: grey figures crawl over MON…FRI tiles — he sprints over them, his capacity meter blazing
    bg(t, .25); const p = seg(t, a, b), x = lerp(100, 1200, p); cam(lerp(500, 800, p), 1250, .95); floor();
    ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach((d, i) => { neon(c => { c.rect(150 + i * 220, 1562, 200, 60); }, '#8a8a96', 3, 0, '#121218'); label(d, 250 + i * 220, 1592, 40, GREY); });
    grey(300 + (t - a) * 30, 1560, .6, C2.crawl, .9); grey(700 + (t - a) * 30, 1560, .6, C2.crawl, .9);
    A(x, 1560, .9, run(t, 16), { wind: 1, glow: 1.4 }); label('BUILT FOR MORE', lerp(500, 800, p), 760, 80, RED, back(seg(t, w('more') - .1, w('more') + .2)));
  },
  breakwheel(t, a, b) {    // break the chains of your routine: he's the one in the ROUTINE wheel now — he runs faster, faster — and bursts out through it
    const bk = w('chains') - .1, u = seg(t, bk, bk + .6); bg(t, .25 + .5 * u); cam(540, 1150, 1.0, 0, ...shake(t, bk, 34)); floor(); flash(t, bk, .1);
    const rot = (t - a) * (4 + 14 * seg(t, a, bk)); if (u <= 0) wheel(540, 1150, 360, rot); else shatter(c => { const M = g.getTransform(); c.setTransform(M); c.strokeStyle = '#9a9aa6'; c.lineWidth = 6; c.beginPath(); c.arc(540, 1150, 360, 0, 7); c.moveTo(870, 1150); c.arc(540, 1150, 330, 0, 7); c.stroke(); }, u, 540, 1150, 3);
    label('ROUTINE', 540, 700, 70, GREY, 1 - u); A(lerp(540, 820, eo(u)), lerp(1480, 1560, eo(u)), .7, u > 0 ? mixPose(POSE.jump, POSE.hero, seg(u, .4, 1)) : run(t, 18), { wind: 1, glow: 1.3 + u });
  },
  discomfort(t, a, b) {    // step into the discomfort: soft grey cushions end at a line — beyond it jagged red rock; he steps across
    bg(t, .25); cam(540, 1250, 1.0); const st = w('step') + .2; line(540, 1300, 540, 1700, 'rgba(255,255,255,.4)', 3);
    for (let i = 0; i < 4; i++) neon(c => { c.roundRect(-60 + i * 150, 1520, 140, 50, 22); }, '#8a7a7a', 3, 0, '#1c1618');
    neon(c => { c.moveTo(540, 1562); for (let x = 540; x < 1300; x += 60) { c.lineTo(x + 30, 1500 - 40 * hash(x)); c.lineTo(x + 60, 1562); } }, RED, 4, 24, '#1a0508');
    label('COMFORT', 280, 1680, 50, GREY); label('DISCOMFORT', 800, 1680, 50, RED);
    A(lerp(330, 760, eo(seg(t, a, b))), lerp(1520, 1510, seg(t, a, b)), .85, walk(t), { glow: 1.3 });
  },
  door(t, a, b) {          // greatness is waiting on the other side: a huge door swings open — beyond it stands a giant, glowing version of him
    const op = eo(seg(t, a, a + 1)); bg(t, .2 + .6 * op, 760, 1000); cam(600, 1200, lerp(.95, 1.05, seg(t, a, b))); floor();
    g.save(); g.beginPath(); g.rect(520, 500, 520, 1062); g.clip(); g.globalAlpha = .3 + .4 * op; A(780, 1560, 1.25, POSE.victory, { glow: 2 }); g.restore();
    neon(c => { c.rect(520, 500, 520, 1062); }, '#9a9aa6', 6, 6); g.save(); g.translate(520, 0); g.scale(1 - .85 * op, 1); neon(c => { c.rect(0, 500, 520, 1062); }, '#9a9aa6', 6, 6, '#141419'); g.restore();
    A(lerp(150, 380, seg(t, a, b)), 1560, .9, walk(t), { glow: 1.2 });
  },
  claim(t, a, b) {         // GO CLAIM IT: he leaps and closes his fist around the glowing orb — the hourglass turns, sparks erupt
    const gr = w('claim') + .15, u = seg(t, gr, gr + .3); bg(t, 1.1, 540, 900); cam(540, 1100, 1.05, 0, ...shake(t, gr, 26)); flash(t, gr, .1); floor();
    const y = 1560 - 380 * Math.sin(Math.PI * seg(t, a, a + .9)), k = A(540, y, .9, t < a + .9 ? POSE.jump : POSE.victory, { wind: 1, glow: 1.6 }), [hx, hy] = hand(k, 540, y, .9);
    const ox = u > 0 ? hx : 560, oy = u > 0 ? hy - 30 : 640; neon(c => { c.arc(ox, oy, 60 + 10 * Math.sin(t * 8), 0, 7); }, RED, 5, 60, 'rgba(255,42,60,.6)'); label('GREATNESS', ox, oy - 110, 44, RED, 1 - u);
    [[gr, 540, 700, 1, 1.4], [gr + .25, 240, 560, 2, 1.1], [gr + .45, 840, 520, 3, 1.1]].forEach(([t0, x2, yy, s2, sc]) => sparks(g, x2, yy, t - t0, { seed: s2, scale: sc, n: 140, life: 1.2 }));
  },
};
const SC = [];
function scenes() {
  const T = [0, w('you'), w('but'), w('growth'), w('every'), w('the', 14), w('the', 15), w('you', 16.5), w('excellence'), w('it', 23.5), w('stop'), w('just'), w('you', 32), w('break'), w('step'), w('your', 39), w('go'), DUR];
  const N = ['hook', 'protect', 'bird', 'room', 'easy', 'couch', 'routine', 'trade', 'cozy', 'otherside', 'fine', 'painful', 'week', 'breakwheel', 'discomfort', 'door', 'claim'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('go') - .1, w('claim') + .4));   // the peak ritual: the hourglass turns on "go claim it"
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
