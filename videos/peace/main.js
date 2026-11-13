// "Protect Your Peace" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 52.6; window.DUR = DUR;
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
const KEY = /greatest|battle|enemies|critics|chaos|energy|thieves|steal|calm|argue|fool|toxicity|storm|head|remote|control|emotions|stop|cheap|distractions|rent|mind|strength|loud|roar|calmly|protect|boundaries|cup|bleeding|thousand|leaks|guard|fiercely|cut|noise|silence|negativity|peace|life|success|walk|drama|step|power|unstoppable|become/i;
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

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: a volley of arrows already in the air — CLANG, CLANG — his red shield takes every hit
    bg(t, .3); flash(t, 0, .12, '255,42,60', .55); const hits = [.12, .55, .9, 1.3, 1.7]; cam(560, 1200, lerp(1.4, 1.05, eo(seg(t, 0, 1.2))), 0, ...shake(t, hits.find(h => t > h && t < h + .3) || -9, 22)); floor();
    const k = A(420, 1560, .95, E.shieldUp, { glow: 1.3 }), [hx, hy] = hand(k, 420, 1560, .95), sx = hx + 40, sy = hy - 20; shield(sx, sy, 120);
    hits.forEach((h, i) => { const q = seg(t, h - .3, h), yy = sy - 60 + i * 30; if (q < 1) arrow(lerp(1400, sx + 120, q), lerp(yy - 200, yy, q), Math.PI + .15); else { const f = seg(t, h, h + .6); arrow(sx + 140 + f * 200, yy + f * f * 500, Math.PI + .15 + f * 4, 1 - f); if (f < .3) neon(c => { c.arc(sx + 110, yy, 30 + 100 * f, 0, 7); }, '#ffd77a', 4, 20, null, 1 - f / .3); } });
  },
  enemies(t, a, b) {       // not against your enemies: a line of grey soldiers advances — a red X slams through them
    bg(t, .15); cam(540, 1200, 1.0); floor(); const x2 = eo(seg(t, w('enemies') - .05, w('enemies') + .25));
    for (let i = 0; i < 5; i++) { const x = 1100 - i * 0 + i * 150 - (t - a) * 160 - 400; grey(x, 1560, .65, walk(t + i), .9, true); neon(c => { c.moveTo(x - 40, 1250); c.lineTo(x - 160, 1060); }, '#8a8a96', 6, 0); }
    if (x2 > 0) neon(c => { c.moveTo(150, 900); c.lineTo(150 + 780 * x2, 900 + 700 * x2); c.moveTo(930, 900); c.lineTo(930 - 780 * x2, 900 + 700 * x2); }, RED, 16, 40);
  },
  critics(t, a, b) {       // your critics: grey figures, thumbs down, holding up 1/10 and BOO cards
    bg(t, .12); cam(540, 1200, lerp(1.1, 1.0, seg(t, a, b))); floor();
    ['1/10', 'BOO', '0/10'].forEach((s2, i) => { const x = 230 + i * 310, k = ayaz(g, x, 1560, .7, E.thumbs, { col: CROWD, glow: .5 }), [hx, hy] = hand(k, x, 1560, .7);
      neon(c => { c.moveTo(hx, hy - 10); c.lineTo(hx, hy + 40); }, '#9a9aa6', 8, 0); neon(c => { c.roundRect(x - 110, 860 + i * 20, 220, 130, 10); c.moveTo(x, 990 + i * 20); c.lineTo(x, 1080); }, '#d8d8e4', 4, 8, '#e8e8ee'); g.font = '70px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#18181f'; g.fillText(s2, x, 925 + i * 20); });
  },
  chaos(t, a, b) {         // the chaos of the world: alarms, sirens, headlines, arrows — all spinning in a grey whirlwind
    bg(t, .15); cam(540, 1100, 1.0, Math.sin(t * 3) * .05); const W2 = ['ALARM', 'BREAKING', 'CRASH', '!!!', 'SALE', 'NOW!', 'URGENT'];
    for (let i = 0; i < 14; i++) { const an = t * (1.5 + hash(i)) + i, r = 160 + hash(i + 3) * 380, x = 540 + Math.cos(an) * r, y = 1100 + Math.sin(an) * r * 1.2; if (i % 2) label(W2[i % 7], x, y, 40 + 30 * hash(i), '#9a9aa6'); else neon(c => { c.arc(x, y, 30, 0, 7); c.moveTo(x, y); c.lineTo(x + Math.cos(t * 9 + i) * 26, y + Math.sin(t * 9 + i) * 26); }, '#9a9aa6', 3, 0, '#16161c'); }
    neon(c => { for (let k = 0; k < 3; k++) { c.moveTo(540 + 100, 1100); c.arc(540, 1100, 100 + k * 60, 0, Math.PI * 1.6); } }, '#5a5a66', 3, 0);
  },
  thieves(t, a, b) {       // energy thieves stealing your inner calm: he meditates, a calm red orb at his chest — grey thieves sneak in and plug hoses into it, draining
    bg(t, .2); cam(540, 1250, 1.05); floor(); const dr = seg(t, w('steal'), b), kk = A(540, 1560, .9, E.medit, { glow: 1.2 - .5 * dr }), ox = 540 + (kk.hip[0] + kk.shoulder[0]) / 2 * .9 + 40, oy = 1560 + (kk.hip[1] * .3 + kk.shoulder[1] * .7) * .9;
    neon(c => { c.arc(ox, oy, 70 * (1 - .6 * dr), 0, 7); }, RED, 4, 50 * (1 - dr * .7), `rgba(255,42,60,${.5 - .35 * dr})`);
    [[150, 1], [930, -1]].forEach(([x0, s2], i) => { const ap = eo(seg(t, a + .2 + i * .3, a + 1.2 + i * .3)), x = lerp(x0 - s2 * 400, x0, ap); grey(x, 1560, .65, ap < 1 ? walk(t) : E.give, 1, s2 < 0);
      if (ap >= 1) { const hk = ayaz(g, -9e4, -9e4, .65, E.give, { col: CROWD, flip: s2 < 0 }), hx = x + hk.A1.wr[0] * .65 * (s2 < 0 ? 1 : 1), hy = 1560 + hk.A1.wr[1] * .65; neon(c => { c.moveTo(hx, hy); c.quadraticCurveTo((hx + ox) / 2, oy + 200, ox - s2 * 50, oy); }, '#6a6a76', 10, 0);
        for (let d = 0; d < 5; d++) { const q = ((t - a) * 1.6 + d / 5) % 1; const px = lerp(ox - s2 * 50, hx, q), py = lerp(oy, hy, q) + 200 * Math.sin(q * Math.PI) * .5; neon(c => { c.arc(px, py, 8, 0, 7); }, RED, 2, 12, RED); } } });
    label('INNER CALM', ox, oy - 160, 44, RED, 1 - dr * .6);
  },
  fool(t, a, b) {          // arguing with a fool: two shouting bubbles of scribble slam into each other — a grey cloud of nonsense swallows both
    bg(t, .15); cam(540, 1200, 1.05); floor(); A(260, 1560, .85, E.shout, { glow: 1 - .4 * seg(t, a, b) }); grey(820, 1560, .85, E.shout, 1, true); label('FOOL', 820, 1660, 50, GREY);
    for (const s2 of [-1, 1]) { const p = seg(t, a, a + .6), x = lerp(540 + s2 * 280, 540 + s2 * 110, eo(p)); neon(c => { c.ellipse(x, 900, 170, 120, 0, 0, 7); c.moveTo(x - s2 * 40, 1010); c.lineTo(x - s2 * 10, 1080); c.lineTo(x + s2 * 30, 1015); }, s2 < 0 ? RED : '#9a9aa6', 4, 10, '#0c0c10');
      g.save(); g.strokeStyle = s2 < 0 ? RED : '#9a9aa6'; g.lineWidth = 4; g.beginPath(); for (let i = 0; i < 14; i++) g[i ? 'lineTo' : 'moveTo'](x - 110 + i * 17, 900 + Math.sin(i * 2.7 + t * 20) * 50); g.stroke(); g.restore(); }
  },
  toxic(t, a, b) {         // reacting to toxicity: a grey toxic cloud with a skull drifts in — he flinches as it engulfs him
    bg(t, .1); cam(540, 1200, 1.05); floor(); const p = eo(seg(t, a, b - .2)), cx = lerp(1000, 600, p);
    A(380, 1560, .9, mixPose(POSE.hero, Q.flinch, eo(seg(t, w('toxicity') - .2, w('toxicity') + .2))));
    for (let i = 0; i < 9; i++) { const an = i / 9 * 7 + t * .7; neon(c => { c.arc(cx + Math.cos(an) * 180, 1050 + Math.sin(an) * 130, 110 + 20 * Math.sin(t * 3 + i), 0, 7); }, '#6a6a76', 3, 0, 'rgba(40,40,48,.45)'); }
    neon(c => { c.arc(cx, 1030, 60, 0, 7); c.moveTo(cx - 40, 1090); c.lineTo(cx + 40, 1090); c.lineTo(cx + 30, 1120); c.lineTo(cx - 30, 1120); c.closePath(); }, '#c8c8d2', 4, 10, '#18181f'); neon(c => { c.arc(cx - 22, 1025, 14, 0, 7); c.moveTo(cx + 36, 1025); c.arc(cx + 22, 1025, 14, 0, 7); }, '#000', 1, 0, '#000');
  },
  headstorm(t, a, b) {     // someone else's storm living in your head: a head in profile — inside it, a storm cloud spins and lightning cracks
    bg(t, .12); cam(540, 1000, lerp(1.05, 1.15, seg(t, a, b))); headOutline(480, 1050, 2.0);
    g.save(); g.translate(500, 900); for (let i = 0; i < 6; i++) { const an = t * 2 + i; neon(c => { c.arc(Math.cos(an) * 90, Math.sin(an) * 40, 90, 0, 7); }, '#6a6a76', 3, 0, 'rgba(30,30,38,.8)'); } g.restore();
    if ((t * 3) % 1 < .25) bolt(510, 960, 260, Math.floor(t * 3)); rain(t, 0); for (let i = 0; i < 12; i++) { const x = 380 + hash(i) * 260, y = 960 + ((t * 600 + hash(i + 2) * 300) % 300); line(x, y, x - 10, y + 30, 'rgba(200,205,225,.5)', 3); }
    label('THEIR STORM', 500, 1500, 60, GREY);
  },
  remote(t, a, b) {        // handing them the remote control: he gives a grey figure the remote — click: ANGER, click: FEAR — his body jerks to each button
    bg(t, .2); cam(540, 1200, 1.0); floor(); const gv = w('handing') + .2, clicks = [w('control'), w('to', 18.3), w('emotions')], ph = clicks.filter(c => t > c).length;
    const poses = [POSE.hero, POSE.despair, Q.flinch, P.guard]; const k = A(300, 1560, .85, t < gv + .2 ? mixPose(POSE.hero, E.give, eo(seg(t, a, gv))) : poses[ph % 4], { glow: 1 }); const gk = ayaz(g, 800, 1560, .85, t > gv ? E.press : POSE.stand, { col: CROWD, glow: .5, flip: true });
    const [rx, ry] = t < gv ? hand(k, 300, 1560, .85) : hand(gk, 800, 1560, .85); neon(c => { c.roundRect(rx - 20, ry - 70, 40, 90, 8); c.moveTo(rx, ry - 50); c.arc(rx, ry - 50, 6, 0, 7); }, '#c8c8d2', 3, 8, '#18181f');
    const lb = ['', 'ANGER', 'FEAR', 'DOUBT'][ph]; if (ph) { label(lb, 540, 820, 100, RED, back(seg(t, clicks[ph - 1], clicks[ph - 1] + .2))); flash(t, clicks[ph - 1], .08); }
  },
  rent(t, a, b) {          // cheap distractions renting space in your mind: rooms in a head — grey phone, bell and chat icons move in — NOT FOR RENT slams down
    bg(t, .15); cam(540, 1050, 1.0); headOutline(480, 1100, 2.2); const st = w('mind') - .1;
    for (let r = 0; r < 2; r++) for (let c2 = 0; c2 < 2; c2++) neon(c => { c.rect(260 + c2 * 210, 650 + r * 230, 200, 220); }, '#5a5a66', 3, 0, '#101016');
    label('FOR RENT', 470, 560, 54, GREY, 1 - seg(t, st, st + .1));
    for (let i = 0; i < 4; i++) { const q = eo(seg(t, a + i * .5, a + .6 + i * .5)), tx = 360 + (i % 2) * 210, ty = 760 + Math.floor(i / 2) * 230, x = lerp(1200, tx, q), y = lerp(500 + i * 200, ty, q);
      [() => neon(c => { c.roundRect(x - 35, y - 60, 70, 120, 14); }, '#9a9aa6', 4, 6, '#18181f'), () => neon(c => { c.moveTo(x - 45, y + 35); c.quadraticCurveTo(x - 40, y - 60, x, y - 60); c.quadraticCurveTo(x + 40, y - 60, x + 45, y + 35); c.closePath(); }, '#9a9aa6', 4, 6, '#18181f'), () => neon(c => { c.roundRect(x - 60, y - 40, 120, 80, 20); c.moveTo(x - 20, y + 40); c.lineTo(x - 40, y + 70); c.lineTo(x, y + 40); }, '#9a9aa6', 4, 6, '#18181f'), () => neon(c => { c.arc(x, y, 50, 0, 7); }, '#9a9aa6', 4, 6, '#18181f')][i](); label('$1', x + 55, y - 55, 34, GREY); }
    if (t > st) { const k = back(seg(t, st, st + .25)); g.save(); g.translate(540, 1150); g.rotate(-.15); g.scale(k * 1.0 + (1 - k) * 2.5, k * 1.0 + (1 - k) * 2.5); neon(c => { c.roundRect(-330, -80, 660, 160, 16); }, RED, 8, 40, 'rgba(20,4,8,.9)'); label('NOT FOR RENT', 0, 4, 100, RED); g.restore(); }
  },
  roarback(t, a, b) {      // not how loud you can roar back: his roar spikes a volume meter into the red — then a calm hand crosses it out
    bg(t, .25); cam(540, 1150, 1.0, 0, Math.sin(t * 50) * 6 * (t < w('roar') + .3), 0); floor(); const x2 = eo(seg(t, w('back') - .05, w('back') + .3));
    A(300, 1560, .85, E.shout, { glow: 1.3 }); for (let i = 0; i < 10; i++) { const h = (200 + 500 * hash(i + Math.floor(t * 12))) * (1 - x2 * .8); neon(c => { c.rect(500 + i * 52, 1500 - h, 40, h); }, i > 6 ? RED : '#c8c8d2', 3, 14, i > 6 ? 'rgba(255,42,60,.4)' : '#18181f'); }
    label('LOUDER?', 760, 820, 90, GREY); if (x2 > 0) neon(c => { c.moveTo(560, 830); c.lineTo(560 + 420 * x2, 810); }, RED, 14, 30);
  },
  boundary(t, a, b) {      // calmly protecting your boundaries: he traces a glowing circle around himself — grey hands shove at it and bounce off
    bg(t, .2); cam(540, 1250, 1.0); const dr = eo(seg(t, a, a + .9)); floor();
    neon(c => { c.ellipse(540, 1562, 330, 70, 0, Math.PI, Math.PI + Math.PI * 2 * dr); }, RED, 6, 40); if (dr >= 1) neon(c => { c.ellipse(540, 1450, 330, 450, 0, Math.PI, 0); }, RED, 3, 30, 'rgba(255,42,60,.06)', .7);
    A(540, 1560, .85, dr < 1 ? { ...POSE.hero, a1: -.6, f1: -.4 } : POSE.hero, { glow: 1.2 });
    [[90, 1], [990, -1]].forEach(([x0, s2], i) => { const ph = ((t - a - 1) * 1.4 + i * .5) % 1, x = t < a + 1 ? x0 : x0 + s2 * (60 * Math.sin(ph * Math.PI)); grey(x, 1560, .7, mixPose(walk(t), POSE.push, .7), 1, s2 < 0); if (t > a + 1 && ph > .4 && ph < .6) neon(c => { c.arc(540 - s2 * 330, 1300, 40, 0, 7); }, RED, 4, 30, null, 1 - Math.abs(ph - .5) * 10); });
    label('BOUNDARY', 540, 1660, 54, RED, dr);
  },
  pour(t, a, b) {          // you cannot pour from a cup that is empty: he tips his cup over another — a few dry drops, nothing
    bg(t, .15); cam(560, 1150, 1.15); floor(); const tp = eo(seg(t, a, a + .5));
    const k = A(400, 1560, .85, mixPose(E.give, E.pour, tp)), [hx, hy] = hand(k, 400, 1560, .85);
    g.save(); g.translate(hx + 30, hy - 30); g.rotate(1.9 * tp); neon(c => { c.moveTo(-50, -60); c.lineTo(50, -60); c.lineTo(35, 60); c.lineTo(-35, 60); c.closePath(); }, '#c8c8d2', 4, 10, '#18181f'); g.restore();
    neon(c => { c.moveTo(640, 1420); c.lineTo(760, 1420); c.lineTo(745, 1562); c.lineTo(655, 1562); c.closePath(); }, '#9a9aa6', 4, 4, '#121218'); label('EMPTY', 700, 1350, 44, GREY, seg(t, a + .8, a + 1.1));
    for (let i = 0; i < 2; i++) { const q = seg(t, a + .5 + i * .4, a + .9 + i * .4); if (q > 0 && q < 1) drop(lerp(hx + 70, 700, q), lerp(hy, 1420, q * q), 8); }
  },
  leaks(t, a, b) {         // bleeding out through a thousand leaks: close on the cup — hole after hole pops open, red streams spray out
    bg(t, .2); cam(540, 1050, 1.0); const n = Math.floor(4 + 60 * eio(seg(t, a, w('leaks')))), lv = 1 - .7 * seg(t, a, b);
    neon(c => { c.moveTo(250, 600); c.lineTo(830, 600); c.lineTo(760, 1450); c.lineTo(320, 1450); c.closePath(); }, '#c8c8d2', 6, 14, '#14141a');
    g.save(); g.beginPath(); g.moveTo(250, 600); g.lineTo(830, 600); g.lineTo(760, 1450); g.lineTo(320, 1450); g.clip(); g.fillStyle = 'rgba(255,42,60,.45)'; g.fillRect(200, 1450 - 850 * lv, 700, 900); g.restore();
    for (let i = 0; i < n; i++) { const yy = 700 + hash(i) * 720, sd = hash(i + 3) > .5 ? 1 : -1, wx = lerp(lerp(250, 320, (yy - 600) / 850), lerp(830, 760, (yy - 600) / 850), sd > 0 ? 1 : 0); if (yy < 1450 - 850 * lv) continue;
      neon(c => { c.arc(wx, yy, 6, 0, 7); }, '#000', 1, 0, '#000'); const q = ((t * 3 + hash(i + 5)) % 1); neon(c => { c.moveTo(wx, yy); c.quadraticCurveTo(wx + sd * 120, yy, wx + sd * (140 + 40 * q), yy + 300 * q); }, RED, 3, 14, null, .8); }
    label(n + ' LEAKS', 540, 1560, 70, WHITE);
  },
  guard(t, a, b) {         // guard your space fiercely: he holds the doorway of his glowing space — a grey intruder steps up and gets shoved back
    bg(t, .25); cam(540, 1200, 1.05, 0, ...shake(t, w('fiercely') - .1, 22)); floor(); const sv = eo(seg(t, w('fiercely') - .15, w('fiercely') + .15));
    neon(c => { c.rect(160, 900, 300, 662); }, RED, 5, 30, 'rgba(255,42,60,.18)'); label('MY SPACE', 310, 860, 50, RED);
    A(540, 1560, .9, t < w('fiercely') - .15 ? P.guard : mixPose(POSE.push, P.guard, seg(t, w('fiercely') + .2, b)), { glow: 1.3 });
    grey(lerp(980, 780, eo(seg(t, a, a + 1.0))) + 260 * sv, 1560, .85, sv > 0 ? Q.flinch : walk(t), 1, true);
  },
  cutnoise(t, a, b) {      // cut off the noise: a fat grey cable crackling with static plugs into the side of his head — one chop, it snaps, silence
    bg(t, .2); const ct = w('noise') - .1, u = eo(seg(t, ct, ct + .25)); cam(560, 1150, 1.05, 0, ...shake(t, ct, 26)); floor(); flash(t, ct, .08);
    const k = A(360, 1560, .9, t < ct - .25 ? POSE.hero : mixPose(E.chop, Q.punch, eo(seg(t, ct - .1, ct + .05))), { glow: 1.2 }), hx = 360 + k.shoulder[0] * .9 + 30, hy = 1560 + k.shoulder[1] * .9 - 90, cx = hx + 240;
    if (u <= 0) neon(c => { c.moveTo(hx, hy); c.quadraticCurveTo(900, hy + 60, 1300, hy - 200); }, '#6a6a76', 14, 0);
    else { neon(c => { c.moveTo(hx, hy); c.quadraticCurveTo(hx + 120, hy + 40, cx - 20, hy + 40 + 300 * u); }, '#6a6a76', 14, 0); neon(c => { c.moveTo(1300, hy - 200); c.quadraticCurveTo(1000, hy, cx + 40, hy + 60 + 260 * u); }, '#6a6a76', 14, 0); sparks(g, cx, hy + 40, t - ct, { seed: 4, scale: .7, n: 50, life: .6 }); }
    if (u <= 0) for (let i = 0; i < 4; i++) neon(c => { const x = 1200 - i * 140 - ((t * 500) % 140); c.moveTo(x, hy - 120); for (let q = 0; q < 6; q++) c.lineTo(x - q * 18, hy - 120 + (q % 2 ? -40 : 40)); }, '#c8c8d2', 3, 10);
    label('NOISE', 900, hy - 260, 70, GREY, 1 - u);
  },
  tvoff(t, a, b) {         // silence the negativity: an old TV screaming grey static and NEGATIVITY — click — it collapses to a line, a dot, gone
    bg(t, .15); cam(540, 1050, 1.0); const off = seg(t, w('negativity') + .1, w('negativity') + .5);
    neon(c => { c.roundRect(170, 700, 740, 580, 40); c.moveTo(400, 700); c.lineTo(320, 560); c.moveTo(680, 700); c.lineTo(760, 560); }, '#9a9aa6', 6, 6, '#0c0c10');
    const sx = off < .5 ? 1 : 1 - (off - .5) * 2, sy = off < .5 ? 1 - off * 1.96 : .02; if (sx > .01) { g.save(); g.beginPath(); g.rect(540 - 320 * sx, 990 - 240 * sy, 640 * sx, 480 * sy); g.clip();
      for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(200,200,210,${hash(i + Math.floor(t * 30) * 7) * .5})`; g.fillRect(220 + hash(i * 3 + Math.floor(t * 30)) * 640, 750 + hash(i * 5 + Math.floor(t * 30)) * 480, 10, 6); }
      label('NEGATIVITY', 540, 990, 110, '#d8d8e4'); g.restore(); }
    if (off > 0 && off < 1) neon(c => { c.ellipse(540, 990, 320 * sx + 4, 6, 0, 0, 7); }, WHITE, 3, 30, WHITE);
  },
  lotus(t, a, b) {         // protect your peace like your life depends on it: a small red lotus — grey wind tears at it, he shelters it with both hands
    bg(t, .25); cam(560, 1150, 1.2); floor(); const k = A(540, 1560, .9, E.cup, { glow: 1.2 }), [hx, hy] = hand(k, 540, 1560, .9), [h2x, h2y] = hand(k, 540, 1560, .9, false);
    lotus((hx + h2x) / 2 + 10, Math.min(hy, h2y) - 10, .7 + .05 * Math.sin(t * 3), 1);
    for (let i = 0; i < 16; i++) { const q = ((t - a) * 1.4 + hash(i)) % 1, x = lerp(1200, -100, q), y = 900 + hash(i + 2) * 600; if (x < hx + 80 && x > hx - 100 && Math.abs(y - hy) < 160) continue; line(x, y, x + 120, y + 10, 'rgba(160,160,175,.5)', 3); }
    label('PEACE', (hx + h2x) / 2, Math.min(hy, h2y) - 190, 54, RED);
  },
  success(t, a, b) {       // because your success does: from his cupped hands the lotus light climbs into a tall glowing tree
    const u = eo(seg(t, a, b)); bg(t, .3 + .6 * u, 540, 900); cam(540, lerp(1150, 1000, u), lerp(1.2, .9, u)); floor();
    const k = A(540, 1560, .9, E.cup, { glow: 1.3 + u }), [hx, hy] = hand(k, 540, 1560, .9), [h2x, h2y] = hand(k, 540, 1560, .9, false), bx = (hx + h2x) / 2 + 10, by = Math.min(hy, h2y) - 10;
    lotus(bx, by, .7, 1); neon(c => { c.moveTo(bx, by - 60); c.lineTo(bx, by - 60 - 700 * u); }, RED, 8, 40);
    for (let i = 0; i < 6; i++) { const q = seg(u, .2 + i * .1, .5 + i * .1); if (q <= 0) continue; const yy = by - 160 - i * 100, s2 = i % 2 ? 1 : -1; neon(c => { c.moveTo(bx, yy); c.quadraticCurveTo(bx + s2 * 120 * q, yy - 40, bx + s2 * 220 * q, yy - 100 * q); }, RED, 5, 30); neon(c => { c.arc(bx + s2 * 220 * q, yy - 100 * q, 26 * q, 0, 7); }, '#ffb81f', 3, 20, 'rgba(255,184,31,.6)'); }
    label('SUCCESS', 540, by - 860 * u, 80, RED, seg(u, .7, 1));
  },
  drama(t, a, b) {         // walk away from the drama: behind him a grey stage of masks and brawling figures — he walks out, never looking back
    bg(t, .15); cam(540, 1250, 1.0); floor();
    neon(c => { c.rect(40, 700, 600, 600); }, '#5a5a66', 4, 0, '#0c0c10'); for (const [x, sm] of [[200, 1], [460, -1]]) neon(c => { c.ellipse(x, 850, 70, 90, 0, 0, 7); c.moveTo(x - 40, 900 + sm * 10); c.quadraticCurveTo(x, 900 - sm * 30, x + 40, 900 + sm * 10); }, '#8a8a96', 4, 4, '#16161c');
    label('DRAMA', 340, 1060, 80, GREY); for (let i = 0; i < 3; i++) grey(140 + i * 180, 1300, .45, i % 2 ? Q.punch : Q.flinch, .9, i % 2 === 0); neon(c => { c.rect(40, 1300, 600, 30); }, '#5a5a66', 4, 0, '#121218');
    A(lerp(600, 1000, seg(t, a, b)), 1560, .9, walk(t), { glow: 1.2 });
  },
  power(t, a, b) {         // step into your power: his foot lands in a red circle on the ground — it flares up into a column of light
    const st = a + .25, u = eo(seg(t, st, st + .4)); bg(t, .3 + .5 * u, 540, 1500); cam(540, 1250, 1.05, 0, ...shake(t, st, 20)); flash(t, st, .08); floor();
    neon(c => { c.ellipse(560, 1562, 220 + 60 * u, 50 + 10 * u, 0, 0, 7); }, RED, 6, 40 + 40 * u, `rgba(255,42,60,${.2 + .3 * u})`);
    if (u > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,42,60,${.25 * u})`; g.fillRect(560 - 250, 1562 - 1300 * u, 500, 1300 * u); g.restore(); }
    A(lerp(320, 560, eo(seg(t, a, st))), 1560, .9, t < st ? walk(t) : POSE.hero, { glow: 1.2 + u });
  },
  protect(t, a, b) {       // protect your peace: he plants the shield from the opening — the lotus glowing safe behind it
    bg(t, .35); cam(540, 1200, 1.05, 0, ...shake(t, a + .2, 14)); floor(); lotus(330, 1562, .9);
    const k = A(560, 1560, .9, E.shieldUp, { glow: 1.4 }), [hx, hy] = hand(k, 560, 1560, .9); shield(hx + 40, hy - 20, 120 * back(seg(t, a, a + .3)));
  },
  unstoppable(t, a, b) {   // and watch how unstoppable you become: the hourglass turns, he breaks into a run, sparks erupt
    bg(t, 1.1, 540, 1100); cam(540, 1200, lerp(1.0, 1.15, seg(t, a, b)), 0, ...shake(t, w('unstoppable'), 22));
    const off = ((t - a) * 1200) % 200; for (let i = -1; i < 8; i++) line(i * 200 - off, 1562, i * 200 - off + 110, 1562, 'rgba(255,90,110,.6)', 5);
    A(540, 1560, .95, t < w('unstoppable') ? mixPose(POSE.hero, P.gaze, .4) : run(t, 17), { wind: 1, glow: 1.6 });
    [[w('unstoppable'), 540, 780, 1, 1.4], [w('become'), 240, 600, 2, 1.1], [w('become') + .3, 840, 560, 3, 1.1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 140, life: 1.3 }));
  },
};
const SC = [];
function scenes() {
  const T = [0, w('not'), w('your', 3.5), w('or', 4), w('it', 6), w('every'), w('react'), w('or', 13), w('you', 16), w('stop'), w('true'), w('its', 26), w('you', 30), w('that', 31), w('guard'), w('cut'), w('silence'), w('and', 40), w('because'), w('walk'), w('step'), w('protect', 48), w('and', 49), DUR];
  const N = ['hook', 'enemies', 'critics', 'chaos', 'thieves', 'fool', 'toxic', 'headstorm', 'remote', 'rent', 'roarback', 'boundary', 'pour', 'leaks', 'guard', 'cutnoise', 'tvoff', 'lotus', 'success', 'drama', 'power', 'protect', 'unstoppable'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('and', 49) - .1, w('unstoppable') + .3));   // the peak ritual: the hourglass turns on "watch how unstoppable"
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
