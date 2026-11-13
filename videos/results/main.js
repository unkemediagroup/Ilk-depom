// "Let Your Results Speak" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 45.4; window.DUR = DUR;
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
const KEY = /stop|screaming|rooftops|posting|grand|plans|empty|promises|loud|declarations|exhausted|talk|loudest|least|wasting|energy|convince|potential|masters|silence|applause|validation|heads|absorb|pressure|undeniable|success|shatter|doubt|actions|shockwave|relentless|execution|critics|choke|words|start|building|results/i;
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

const R2 = {
  scream: { ...POSE.hero, lean: -.25, head: -.5, a1: -2.4, a2: -2.6, f1: -2.6, f2: -2.9, q1: -.4, k1: .2, q2: .4, k2: .1 },
  phone: { ...POSE.stand, head: .5, a1: -.7, a2: -.6, f1: -1.9, f2: -1.8 },
  trumpet: { ...POSE.stand, lean: -.1, head: -.2, a1: -1.4, a2: -1.2, f1: -1.7, f2: -1.4 },
  slump: { ...POSE.stand, lean: .4, head: .8, a1: .1, a2: -.1, f1: 0, f2: -.1 },
  present: { ...POSE.hero, lean: .1, head: -.1, a1: -2.0, a2: -.6, f1: -2.2, f2: -1.3 },
  build: { ...POSE.hero, lean: .3, head: .4, a1: -1.1, a2: -.9, f1: -1.4, f2: -1.2, q1: -.6, k1: .5, q2: .4, k2: .3 },
  holdUp: { ...POSE.hero, lean: .05, head: .6, a1: -2.9, a2: -2.8, f1: -3.1, f2: -3.0, q1: -.6, k1: .8, q2: .5, k2: .7, y: 40 },
  stomp: { ...POSE.hero, lean: .1, head: .2, a1: -.5, a2: .3, f1: -1.0, f2: -.1, q1: -1.2, k1: .2, q2: .15, k2: .1 },
  choke: { ...POSE.stand, lean: .5, head: .6, a1: -1.6, a2: -1.2, f1: -2.8, f2: -2.6 },
};
function gear(x, y, r, n, rot, col = RED, glow = 24, fill = '#14070a') { neon(c => { for (let i = 0; i < n * 2; i++) { const a0 = rot + i / (n * 2) * Math.PI * 2, a1 = rot + (i + 1) / (n * 2) * Math.PI * 2, rr = i % 2 ? r : r + r * .22; c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a0) * rr, y + Math.sin(a0) * rr); c.lineTo(x + Math.cos(a1) * rr, y + Math.sin(a1) * rr); } c.closePath(); c.moveTo(x + r * .35, y); c.arc(x, y, r * .35, 0, 7); }, col, 4, glow, fill); }
function bubble(x, y, w2, h, txt, col = '#c8c8d2', a = 1, sz = 50) { g.save(); g.globalAlpha *= a; neon(c => { c.roundRect(x - w2 / 2, y - h / 2, w2, h, 30); c.moveTo(x - 20, y + h / 2); c.lineTo(x - 40, y + h / 2 + 40); c.lineTo(x + 10, y + h / 2); }, col, 4, 8, '#0c0c10'); label(txt, x, y, sz, col); g.restore(); }

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: a grey figure on a rooftop SCREAMS — giant jagged words blast straight at the lens
    bg(t, .3); flash(t, 0, .12, '255,42,60', .55); cam(540, 1150, lerp(1.25, 1.0, eo(seg(t, 0, .8))), 0, Math.sin(t * 70) * 10, Math.cos(t * 60) * 8);
    for (let i = 0; i < 6; i++) neon(c => { c.rect(-100 + i * 220, 1400 - 200 * hash(i), 200, 800); }, '#3a3a46', 3, 0, '#0b0b10'); neon(c => { c.rect(300, 1300, 480, 700); }, '#5a5a66', 4, 0, '#101016');
    grey(540, 1300, .7, R2.scream, 1);
    ['GONNA', 'BIG', 'SOON!!!'].forEach((s2, i) => { const q = ((t - a) * 1.3 + i / 3) % 1; g.save(); g.translate(540 + (i - 1) * 260 * q, 1000 - 400 * q); g.scale(.3 + 2.2 * q, .3 + 2.2 * q); g.rotate((i - 1) * .2); label(s2, 0, 0, 70, '#d8d8e4', 1 - q * q); g.restore(); });
  },
  balloons(t, a, b) {      // about what you're going to do: the boasts float up like balloons — GONNA, SOMEDAY, NEXT YEAR — and pop, one by one
    bg(t, .45); cam(540, 1100, 1.0); floor(1700); grey(540, 1700, .6, { ...POSE.stand, head: -.6 }, .9);
    ['GONNA', 'SOMEDAY', 'NEXT YEAR', 'SOON'].forEach((s2, i) => { const t0 = a + .9 + i * .28, x = 230 + i * 210, y = 1300 - (t - a) * 220 - i * 60 + Math.sin(t * 2 + i) * 20; if (t < t0) { neon(c => { c.ellipse(x, y, 100, 120, 0, 0, 7); c.moveTo(x, y + 120); c.quadraticCurveTo(x + 20, y + 250, x - 10, y + 380); }, '#9a9aa6', 4, 8, '#16161c'); label(s2, x, y, 34, '#c8c8d2'); }
      else { const q = seg(t, t0, t0 + .3); if (q < 1) for (let k = 0; k < 8; k++) { const an = k / 8 * 7; neon(c => { c.moveTo(x + Math.cos(an) * 60, y + Math.sin(an) * 60); c.lineTo(x + Math.cos(an) * (80 + 120 * q), y + Math.sin(an) * (80 + 120 * q)); }, WHITE, 3, 10, null, 1 - q); } } });
  },
  post(t, a, b) {          // stop posting grand plans: a phone — MY GRAND PLAN!!! — POST — the like counter sits on zero
    bg(t, .15); cam(540, 1050, 1.1); neon(c => { c.roundRect(300, 560, 480, 900, 50); }, '#c8c8d2', 5, 14, 'rgba(10,10,14,.97)');
    neon(c => { c.roundRect(340, 680, 400, 380, 20); }, '#9a9aa6', 3, 0, '#16161c'); label('MY GRAND', 540, 800, 64, WHITE); label('PLAN!!!', 540, 880, 64, WHITE); label('♥ 0', 400, 1010, 40, GREY);
    const tp = seg(t, w('posting') - .1, w('posting') + .2); neon(c => { c.roundRect(420, 1140, 240, 80, 40); }, RED, 4, 20, tp > .5 ? '#ff2a3c' : '#2a0a10'); label('POST', 540, 1180, 44, WHITE);
    neon(c => { c.ellipse(560, lerp(1400, 1200, Math.sin(tp * Math.PI)), 50, 70, 0, 0, 7); }, '#8a8a96', 4, 0, '#22222a');
  },
  empty(t, a, b) {         // empty promises: a gift box labelled PROMISE springs open — nothing inside but a single grey moth
    bg(t, .15); cam(540, 1250, 1.15); floor(); const op = back(seg(t, a + .2, a + .5));
    neon(c => { c.rect(380, 1300, 320, 262); c.moveTo(540, 1300); c.lineTo(540, 1562); }, RED, 4, 20, '#14070a'); label('PROMISE', 540, 1440, 50, WHITE);
    g.save(); g.translate(380, 1300); g.rotate(-1.4 * op); neon(c => { c.rect(-10, -60, 340, 60); }, RED, 4, 20, '#14070a'); g.restore();
    const mq = seg(t, a + .4, b); if (mq > 0) { const mx = 540 + Math.sin(mq * 12) * 80, my = 1280 - mq * 400, fl = Math.sin(t * 40) * .6; neon(c => { c.ellipse(mx - 20, my, 30, 14, -fl, 0, 7); c.ellipse(mx + 20, my, 30, 14, fl, 0, 7); }, '#9a9aa6', 2, 4, '#22222a'); }
  },
  declare(t, a, b) {       // loud declarations: a grey herald blasts a trumpet, a scroll unrolls — I DECLARE…
    bg(t, .15); cam(540, 1200, 1.05); floor(); const k = ayaz(g, 300, 1560, .85, R2.trumpet, { col: CROWD, glow: .5 }), [hx, hy] = hand(k, 300, 1560, .85);
    neon(c => { c.moveTo(hx, hy); c.lineTo(hx + 180, hy - 40); c.lineTo(hx + 260, hy - 110); c.lineTo(hx + 280, hy + 20); c.lineTo(hx + 180, hy - 20); }, '#ffd77a', 4, 20, 'rgba(255,215,122,.15)');
    const u = eo(seg(t, a + .1, b - .2)); neon(c => { c.rect(560, 760, 380, 60 + 520 * u); }, '#d8c8a0', 4, 8, '#e8e0cc'); label('I DECLARE', 750, 860, 56, '#3a2a10', u > .2 ? 1 : 0);
    for (let i = 0; i < 5; i++) if (u > .3 + i * .1) { g.fillStyle = '#9a8a6a'; g.fillRect(600, 930 + i * 60, 300, 12); }
    for (let i = 0; i < 3; i++) { const q = ((t - a) * 2 + i / 3) % 1; neon(c => { c.arc(hx + 270, hy - 40, 40 + q * 200, -.7, .7); }, '#ffd77a', 3, 10, null, 1 - q); }
  },
  exhausted(t, a, b) {     // a world exhausted by talk: a grey globe in earmuffs, sagging under a growing heap of speech bubbles
    bg(t, .1); cam(540, 1150, 1.0); const p = seg(t, a, b);
    neon(c => { c.arc(540, 1250, 260, 0, 7); c.moveTo(380, 1150); c.quadraticCurveTo(480, 1100, 560, 1180); c.quadraticCurveTo(650, 1250, 720, 1200); c.moveTo(420, 1350); c.quadraticCurveTo(520, 1400, 640, 1340); }, '#8a8a96', 5, 6, '#121218');
    neon(c => { c.moveTo(280, 1250); c.arc(540, 1250, 270, Math.PI, 0); }, '#6a6a76', 6, 0); for (const s2 of [-1, 1]) neon(c => { c.arc(540 + s2 * 270, 1250, 50, 0, 7); }, '#9a9aa6', 4, 0, '#22222a');
    label('z', 640, 980 - (t * 60) % 80, 50, '#6a6a76');
    const n = Math.floor(2 + 12 * p); for (let i = 0; i < n; i++) { const x = 300 + hash(i) * 480, y = 940 - i * 45 - (i === n - 1 ? 200 * (1 - (p * 12 % 1)) : 0); bubble(x, y, 180, 80, ['BLAH', 'TALK', 'HYPE', 'SOON'][i % 4], '#9a9aa6', 1, 34); }
  },
  loudest(t, a, b) {       // the loudest are doing the least: a grey figure shouting — VOLUME 100% — WORK DONE 2%
    bg(t, .15); cam(540, 1200, 1.05); floor(); grey(320, 1560, .85, R2.scream, 1);
    for (let i = 0; i < 3; i++) { const q = ((t - a) * 2 + i / 3) % 1; neon(c => { c.arc(340, 1050, 60 + q * 400, -1.2, .4); }, '#9a9aa6', 4, 0, null, 1 - q); }
    const bar = (y, lb, v, col) => { label(lb, 780, y - 60, 44, col); neon(c => { c.roundRect(600, y - 25, 360, 50, 25); }, '#5a5a66', 3, 0, '#0c0c10'); neon(c => { c.roundRect(605, y - 20, Math.max(8, 350 * v), 40, 20); }, col, 2, 14, col); };
    bar(1150, 'VOLUME', eo(seg(t, a, a + .5)), '#d8d8e4'); bar(1400, 'WORK DONE', .02 * eo(seg(t, w('least') - .3, w('least'))), RED); label(Math.round(2 * eo(seg(t, w('least') - .3, w('least')))) + '%', 780, 1480, 54, RED, seg(t, w('least') - .3, w('least')));
  },
  convince(t, a, b) {      // wasting energy trying to convince everyone: frantic pitch at a chart MY POTENTIAL — his battery drains to empty
    bg(t, .15); cam(540, 1150, 1.0); floor(); const dr = seg(t, a, b);
    neon(c => { c.rect(520, 700, 460, 360); c.moveTo(560, 1000); c.lineTo(660, 960); c.lineTo(760, 990); c.lineTo(900, 760); c.moveTo(880, 760); c.lineTo(900, 760); c.lineTo(905, 785); }, '#c8c8d2', 4, 8, '#0c0c10'); label('MY POTENTIAL', 750, 650, 50, GREY);
    grey(340, 1560, .85, mixPose(R2.present, { ...R2.present, a1: -1.6 }, .5 + .5 * Math.sin(t * 10)), 1);
    neon(c => { c.roundRect(160, 820, 90, 170, 12); c.rect(185, 805, 40, 15); }, '#9a9aa6', 4, 0, '#0c0c10'); const lv = 1 - dr; neon(c => { c.rect(170, 980 - 150 * lv, 70, 150 * lv); }, lv < .3 ? RED : '#c8c8d2', 2, 10, lv < .3 ? RED : '#c8c8d2'); label('ENERGY', 205, 1040, 34, GREY);
    for (let i = 0; i < 4; i++) { const q = ((t * 2 + i / 4) % 1); drop(300 + (i % 2) * 90, 1000 + q * 150, 8, (1 - q) * .8); }
  },
  silence(t, a, b) {       // the true masters work in absolute silence: alone at night he sets one gear against another — they mesh and turn, no sound
    bg(t, .25); cam(560, 1200, 1.0); floor(); const pl = eo(seg(t, a + .2, a + 1.2)), rot = seg(t, a + 1.2, b) * 4;
    gear(700, 1220, 130, 10, rot); const gx = lerp(400, 700 - 130 * 2.05 * .72 - 30, pl), gy = lerp(1050, 1300, pl); gear(gx + 120, gy, 90, 7, -rot * 1.45 + .2);
    const k = A(gx - 120, 1560, .85, R2.build, { glow: 1.2 });
    neon(c => { c.moveTo(850, 700); c.lineTo(880, 700); c.lineTo(920, 660); c.lineTo(920, 780); c.lineTo(880, 740); c.lineTo(850, 740); c.closePath(); c.moveTo(950, 680); c.lineTo(1010, 760); c.moveTo(1010, 680); c.lineTo(950, 760); }, '#9a9aa6', 4, 0); 
  },
  applause(t, a, b) {      // they don't need applause: grey clapping hands drift round him — he never looks up from the work
    bg(t, .2); cam(560, 1200, 1.0); floor(); const rot = (t - a) * 3; gear(700, 1220, 130, 10, rot); gear(470, 1300, 90, 7, -rot * 1.45 + .2);
    A(320, 1560, .85, R2.build, { glow: 1.2 });
    for (let i = 0; i < 5; i++) { const an = t * .8 + i * 1.25, x = 540 + Math.cos(an) * 380, y = 900 + Math.sin(an) * 240, cl = Math.abs(Math.sin(t * 9 + i)) * 20, fd = 1 - seg(t, w('applause'), b);
      for (const s2 of [-1, 1]) neon(c => { c.ellipse(x + s2 * (20 + cl), y, 28, 50, s2 * .3, 0, 7); }, '#9a9aa6', 3, 0, '#1a1a20', fd); }
  },
  stamp(t, a, b) {         // they don't need validation: a giant VALIDATED stamp swings down at him — he steps aside, it slams the empty floor
    const sl = w('validation') + .05, u = ei(seg(t, a + .2, sl)); bg(t, .2); cam(540, 1200, 1.0, 0, ...shake(t, sl, 22)); floor();
    A(lerp(540, 820, eo(seg(t, a + .3, sl - .1))), 1560, .85, walk(t), { glow: 1.2 });
    const sy = lerp(500, 1400, u); neon(c => { c.rect(470, sy - 300, 60, 200); c.roundRect(360, sy - 120, 280, 120, 20); c.rect(380, sy, 240, 30); }, '#ffd77a', 4, 20, '#2a2410');
    if (t > sl) { const q = seg(t, sl, sl + .4); g.save(); g.globalAlpha = 1 - q * .5; label('VALIDATED', 500, 1600, 64, '#ffd77a'); g.restore(); }
  },
  press(t, a, b) {         // heads down, absorb the pressure: a massive press plate descends onto his raised hands — knees bend, his glow rises
    const ab = w('absorb'), dn = eo(seg(t, a, ab)); bg(t, .2 + .5 * seg(t, ab, b)); cam(540, 1150, 1.05, 0, ...(t > ab ? [Math.sin(t * 50) * 5, 0] : shake(t, ab - .2, 20))); floor();
    const pz = { ...POSE.hero, lean: .05, head: .6, a1: -2.9, a2: -2.8, f1: -3.1, f2: -3.0, q1: -.35 - .3 * seg(t, ab, b), k1: .4 + .5 * seg(t, ab, b), q2: .3, k2: .4 + .4 * seg(t, ab, b), y: 30 * seg(t, ab, b) };
    const pp = mixPose(POSE.hero, pz, eo(seg(t, a, a + .6))), k = ayaz(g, -9e4, -9e4, .9, pp, { t: T0 }), hy = 1560 + Math.min(k.A1.wr[1], k.A2.wr[1]) * .9 - 20, y = lerp(200, hy, dn);
    neon(c => { c.rect(200, y - 120, 680, 120); c.rect(500, y - 1000, 80, 880); }, '#9a9aa6', 6, 6, '#16161c'); label('PRESSURE', 540, y - 60, 70, '#c8c8d2');
    A(540, 1560, .9, pp, { glow: 1 + seg(t, ab, b) * 1.2 });
  },
  monolith(t, a, b) {      // undeniable success shatters every doubt: a wall of grey "?" bricks — a red monolith punches up through it, bricks flying
    const sh = w('shatter') - .1, up = eo(seg(t, w('success') - .3, sh + .3)), br = seg(t, sh, sh + .9); bg(t, .2 + .6 * up); cam(540, 1150, 1.0, 0, ...shake(t, sh, 30));
    for (let r = 0; r < 6; r++) for (let c2 = 0; c2 < 5; c2++) { const id = r * 5 + c2, bx = 130 + c2 * 165 + (r % 2) * 40, by = 800 + r * 125, dx = (bx + 80 - 540) * br * 2, dy = -300 * br + 900 * br * br * (.5 + hash(id)); g.save(); g.translate(bx + 80 + dx, by + 55 + dy); g.rotate(br * (hash(id + 3) - .5) * 6);
      neon(c => { c.rect(-75, -55, 150, 110); }, '#8a8a96', 3, 0, '#16161c', 1 - br * .5); label('?', 0, 0, 60, '#9a9aa6', 1 - br * .5); g.restore(); }
    neon(c => { c.moveTo(440, 1700); c.lineTo(440, 1700 - 1100 * up); c.lineTo(540, 1600 - 1250 * up); c.lineTo(640, 1700 - 1100 * up); c.lineTo(640, 1700); }, RED, 6, 60, 'rgba(255,42,60,.5)'); label('SUCCESS', 540, 1700 - 600 * up, 50, WHITE, up);
  },
  shockwave(t, a, b) {     // your actions become a shockwave: one stomp — a ripple runs through the ground and bowls the grey crowd over like wheat
    const sp = w('shockwave') - .1, wv = (t - sp) * 900; bg(t, .25); cam(540, 1250, .95, 0, ...shake(t, sp, 26)); floor(); flash(t, sp, .08);
    A(540, 1560, .9, t < sp - .3 ? POSE.hero : mixPose(R2.stomp, POSE.hero, eo(seg(t, sp, sp + .4))), { glow: 1.4 });
    for (let i = 0; i < 10; i++) { const x = 40 + i * 110; if (Math.abs(x - 540) < 120) continue; const d = Math.abs(x - 540), hit = wv - d, k = hit > 0 && hit < 400 ? Math.sin(hit / 400 * Math.PI) : 0; g.save(); g.translate(x, 1560); g.rotate(Math.sign(x - 540) * 1.2 * k); grey(0, 0, .5, POSE.stand, .9, x < 540); g.restore(); }
    if (t > sp) neon(c => { c.moveTo(540 - wv, 1562); c.quadraticCurveTo(540 - wv + 60, 1530, 540 - wv + 120, 1562); c.moveTo(540 + wv, 1562); c.quadraticCurveTo(540 + wv - 60, 1530, 540 + wv - 120, 1562); }, RED, 6, 30);
  },
  execution(t, a, b) {     // relentless execution: his machine runs — gears turning, finished glowing blocks rolling off a conveyor nonstop
    bg(t, .3); cam(540, 1200, 1.0); floor(); const rot = (t - a) * 5; gear(300, 1050, 140, 10, rot); gear(490, 1150, 90, 7, -rot * 1.5); gear(380, 1300, 70, 6, rot * 1.9);
    neon(c => { c.roundRect(520, 1300, 560, 50, 25); }, '#9a9aa6', 4, 0, '#121218'); for (let i = 0; i < 5; i++) { const x = 540 + ((t - a) * 300 + i * 130) % 650; neon(c => { c.rect(x, 1220, 80, 80); }, RED, 4, 24, 'rgba(255,42,60,.4)'); }
    A(180, 1560, .7, R2.build, { glow: 1.2 }); label('EXECUTION', 760, 1450, 60, RED);
  },
  choke(t, a, b) {         // critics choke on their own words: grey critics shout HE'LL FAIL — the letters reverse straight back into their mouths, they cough
    bg(t, .15); cam(540, 1200, 1.0); floor(); const rv = eo(seg(t, w('choke') - .1, w('words') + .2));
    [[280, 'FAIL'], [800, 'NO WAY']].forEach(([x, s2], i) => { grey(x, 1560, .8, rv > .5 ? mixPose(POSE.stand, R2.choke, (rv - .5) * 2) : R2.scream, 1, i === 1);
      const bx = lerp(x + (i ? -60 : 60), x, rv), by = lerp(900, 1180, rv), sc = 1 - rv * .9; g.save(); g.translate(bx, by); g.scale(sc, sc); bubble(0, 0, 300, 120, s2, '#c8c8d2', 1, 64); g.restore(); });
    label('CRITICS', 540, 1700, 54, GREY);
  },
  mic(t, a, b) {           // stop talking: he walks past the mic stand and flips it off — it topples
    const fl = w('talking', 40) + .1, u = ei(seg(t, fl, fl + .4)); bg(t, .2); cam(540, 1200, 1.05, 0, ...shake(t, fl + .4, 16)); floor();
    g.save(); g.translate(700, 1562); g.rotate(1.3 * u); neon(c => { c.moveTo(-60, 0); c.lineTo(60, 0); c.moveTo(0, 0); c.lineTo(0, -560); c.roundRect(-30, -660, 60, 110, 30); }, '#c8c8d2', 5, 10, '#18181f'); g.restore();
    A(lerp(300, 520, seg(t, a, fl)), 1560, .9, t < fl - .1 ? walk(t) : mixPose(Q.punch, POSE.hero, seg(t, fl + .1, b)), { glow: 1.2 }); label('OFF', 760, 900, 70, GREY, u);
  },
  build(t, a, b) {         // start building: in a blur of moves he locks gear after gear into a giant machine
    bg(t, .4); cam(540, 1150, lerp(1.0, .9, seg(t, a, b))); floor(); const n = Math.floor(1 + 5 * seg(t, a, b - .1)), rot = (t - a) * 4;
    [[540, 1100, 180, 12], [280, 900, 110, 8], [800, 880, 110, 8], [300, 1330, 90, 7], [790, 1330, 90, 7]].forEach(([x, y, r, nn], i) => { if (i < n) gear(x, y, r * back(seg(t, a + i * .2, a + i * .2 + .25)), nn, (i % 2 ? -1 : 1) * rot * (180 / r)); });
    A(540, 1560, .8, mixPose(R2.build, POSE.hero, .5 + .5 * Math.sin(t * 14)), { glow: 1.4 });
  },
  results(t, a, b) {       // let your results do the talking: the machine roars to life and the sky erupts — he just stands there, arms crossed, silent
    bg(t, 1.1, 540, 900); const rot = (t - a) * 6; cam(540, 1200, lerp(.9, 1.0, seg(t, a, b)), 0, ...shake(t, w('results'), 22)); floor();
    [[540, 1000, 180, 12], [280, 800, 110, 8], [800, 780, 110, 8]].forEach(([x, y, r, nn], i) => gear(x, y, r, nn, (i % 2 ? -1 : 1) * rot * (180 / r), RED, 50));
    A(540, 1560, .95, Q.cross, { glow: 1.7 }); ground(540, 1560, .95, 1); label('RESULTS', 540, 1720, 90, WHITE, back(seg(t, w('results') - .1, w('results') + .2)));
    [[w('results'), 540, 600, 1, 1.4], [w('talking', 43) - .1, 220, 520, 2, 1.1], [w('talking', 43) + .2, 860, 480, 3, 1.1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 140, life: 1.2 }));
  },
};
const SC = [];
function scenes() {
  const T = [0, w('about'), w('stop', 3), w('empty'), w('loud'), w('a', 8), w('the', 11), w('while'), w('the', 19.5), w('they', 23), w('they', 24.9), w('they', 26), w('and', 29), w('let', 33), w('let', 36), w('your', 38), w('stop', 40), w('start'), w('let', 43), DUR];
  const N = ['hook', 'balloons', 'post', 'empty', 'declare', 'exhausted', 'loudest', 'convince', 'silence', 'applause', 'stamp', 'press', 'monolith', 'shockwave', 'execution', 'choke', 'mic', 'build', 'results'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('results') - .1, w('results') + .5));   // the peak ritual: the hourglass turns on "results"
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
