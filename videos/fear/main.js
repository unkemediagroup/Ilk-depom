// "Overcoming Fear of Failure" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 57.0; window.DUR = DUR;
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
const KEY = /listen|carefully|fear|ghost|head|zero|power|keys|risks|refused|terrified|dreams|bury|comfort|silent|killer|safety|murders|potential|greatness|failure|again|difference|sidelines|refuse|stumble|race|fall|first|end|education|stop|safe|destiny|arena|legendary|stronger|prove/i;
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

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: already running — a ghost claws at his cape; on "carefully" he skids, turns and faces it
    bg(t, .3); flash(t, 0, .12, '255,42,60', .55); const turn = eo(seg(t, 1.0, 1.4)), sp = 1 - turn;
    cam(560, 1250, lerp(1.35, 1.05, eo(seg(t, 0, 1.2))), lerp(-.08, 0, turn), ...shake(t, 1.25, 22));
    const off = (t * 900 * (1 - turn * .6)) % 160; for (let i = -2; i < 10; i++) line(i * 160 - off, 1562, i * 160 - off + 70, 1562, 'rgba(255,255,255,.4)', 4);
    ghost(lerp(230, 120, turn), 1500, .8, t, 1 - .35 * turn, sp * (.7 + .3 * Math.sin(t * 8)));
    A(680, 1560, .95, turn < .5 ? run(t, 18) : mixPose(POSE.hero, P.point, eo(seg(t, 1.3, 1.7))), { flip: turn >= .5, wind: sp, glow: 1.3 });
  },
  head(t, a, b) {          // fear is a ghost in your own head: start on the ghost — pull out to reveal it floats inside HIS hood
    bg(t, .15); const u = eo(seg(t, a + .3, w('head') + .2)); cam(540, lerp(1050, 1050, u), lerp(2.2, .95, u));
    neon(c => { c.moveTo(540, 380); c.lineTo(880, 760); c.lineTo(900, 1260); c.lineTo(780, 1560); c.lineTo(300, 1560); c.lineTo(180, 1260); c.lineTo(200, 760); c.closePath(); }, RED, 8, 40, 'rgba(255,42,60,.04)');
    neon(c => { c.moveTo(250, 1000); c.lineTo(830, 1000); }, '#ffb81f', 10, 30, null, .5 + .5 * u);
    ghost(540, 1300, .5, t, 1, .3 + .3 * Math.sin(t * 4));
  },
  zero(t, a, b) {          // zero power: the ghost swipes — its claw passes through him like smoke; he doesn't flinch
    bg(t, .2); cam(560, 1200, 1.05); floor(); const sw = seg(t, a + .15, a + 1.0);
    A(360, 1560, .95, POSE.hero, { glow: 1.2 }); ghost(860, 1520, .75, t, .9, sw < 1 ? Math.sin(sw * Math.PI) * 1.6 : 0, true);
    if (sw > .3 && sw < 1) for (let i = 0; i < 14; i++) { const q = (sw - .3) / .7; neon(c => { c.arc(420 + hash(i) * 120 - q * 80, 1120 + hash(i + 3) * 120 - q * 120 * hash(i + 5), 8 + 16 * q, 0, 7); }, '#cfd3e0', 2, 8, null, 1 - q); }
    const m = 1 - eo(seg(t, w('zero'), w('power') + .2)); neon(c => { c.roundRect(240, 640, 600, 60, 30); }, '#9a9aa6', 3, 0, '#0c0c10'); neon(c => { c.roundRect(250, 650, Math.max(1, 580 * m), 40, 20); }, '#cfd3e0', 2, 10, '#cfd3e0');
    label('FEAR POWER: ' + Math.round(m * 100) + '%', 540, 760, 60, '#cfd3e0');
  },
  keys(t, a, b) {          // unless you hand it the keys: he holds a gold key out — the ghost reaches — he closes his fist and pulls it back
    bg(t, .2); cam(620, 1150, 1.25); floor(); const back2 = eo(seg(t, w('keys') - .1, w('keys') + .25));
    const k = A(380, 1560, .95, mixPose(mixPose(POSE.hero, Q.holdOut, eo(seg(t, a, a + .4))), Q.clutch, back2), { glow: 1.1 }), [hx, hy] = hand(k, 380, 1560, .95);
    key(hx + 6, hy - 4, .9, back2 * -1.2); ghost(880, 1520, .7, t, .9, lerp(eo(seg(t, a + .3, w('the', 8) + .1)) * 1.15, .2, back2), true);
  },
  risk(t, a, b) {          // the risks you refused: a cliff edge, a gap marked RISK — he walks up, a pebble drops, he steps back
    bg(t, .2); cam(560, 1250, 1.05); const st = w('refused'), x = t < st ? lerp(120, 330, seg(t, a, st)) : lerp(330, 250, eo(seg(t, st + .3, st + 1.0)));
    neon(c => { c.moveTo(-300, 1562); c.lineTo(440, 1562); c.lineTo(420, 2100); }, '#9a9aa6', 5, 6, '#0c0c10'); neon(c => { c.moveTo(1500, 1500); c.lineTo(760, 1500); c.lineTo(790, 2100); }, RED, 5, 24, '#120609');
    label('RISK', 600, 1420, 110, GREY); const pf = seg(t, st, st + 1.2); if (pf > 0 && pf < 1) neon(c => { c.arc(450, 1562 + pf * pf * 600, 10, 0, 7); }, '#9a9aa6', 3, 0, '#9a9aa6');
    A(x, 1560, .85, t < st ? walk(t) : (t < st + .3 ? mixPose(POSE.hero, Q.flinch, eo(seg(t, st, st + .2))) : mixPose(POSE.walkB, POSE.walkA, .5 + .5 * Math.sin(t * 7))));
  },
  mess(t, a, b) {          // terrified of messing up: a grey figure frozen before a blank canvas, brush shaking, one drop falls — he flinches
    bg(t, .08); cam(560, 1200, 1.15); floor(); const fl = eo(seg(t, w('messing'), w('messing') + .3));
    neon(c => { c.moveTo(650, 1562); c.lineTo(720, 900); c.lineTo(790, 1562); c.moveTo(720, 900); c.lineTo(720, 1562); }, '#6a6a76', 4, 0); neon(c => { c.rect(560, 820, 330, 420); }, '#d8d8e4', 4, 14, '#e8e8ee');
    const tr = Math.sin(t * 60) * 5 * (1 - fl); g.save(); g.translate(tr, 0); const k = ayaz(g, 330, 1560, .8, mixPose(Q.brush, Q.flinch, fl), { col: CROWD, glow: .5 }), [hx, hy] = hand(k, 330, 1560, .8); neon(c => { c.moveTo(hx, hy); c.lineTo(hx + 90, hy - 50); }, '#9a9aa6', 5, 0); g.restore();
    const dp = seg(t, w('terrified'), w('messing')); if (dp > 0) neon(c => { c.arc(lerp(530, 560, dp), lerp(1070, 1555, dp * dp), 9, 0, 7); }, RED, 2, 12, RED, dp < 1 ? 1 : .8);
  },
  drawer(t, a, b) {        // dreams you buried to stay comfortable: glowing dream-lanterns pulled down, one by one, shut in a SOMEDAY drawer
    bg(t, .12); cam(540, 1150, 1.0); floor();
    neon(c => { c.rect(560, 1300, 360, 262); c.moveTo(560, 1430); c.lineTo(920, 1430); }, '#8a8a96', 4, 4, '#111117');
    const dw = 1 - eo(seg(t, w('comfortable') - .2, w('comfortable') + .2)), dx = 560 - 0 * dw; neon(c => { c.rect(dx - 260 * dw, 1310, 360, 110); }, '#b8b8c4', 4, 4, '#18181f'); label('SOMEDAY', dx - 260 * dw + 180, 1365, 46, '#b8b8c4');
    let rx = 0; for (let i = 0; i < 3; i++) { const t0 = a + .15 + i * .7, p = eio(seg(t, t0, t0 + .6)), sx = 260 + i * 220, sy = 560 + hash(i) * 120, x = lerp(sx, 560 + 70 + i * 90 - 260 * dw + 60, p), y = lerp(sy + Math.sin(t * 2 + i) * 15, 1360, p);
      if (p >= 1 && dw < .9) continue; neon(c => { c.moveTo(x, y + 60); c.lineTo(x, y + 200 * (1 - p)); }, '#9a9aa6', 2, 0, null, 1 - p);
      neon(c => { c.roundRect(x - 40, y - 55, 80, 110, 30); }, RED, 4, 30, `rgba(255,42,60,${.5 * (1 - p * .6)})`, 1 - p * .5); if (p > 0 && p < 1) rx = x; }
    const k = ayaz(g, 330, 1560, .8, rx ? P.reach : POSE.stand, { col: CROWD, glow: .5 });
  },
  comfort(t, a, b) {       // comfort is a silent killer: a plush armchair — its shadow on the wall grows fangs
    const kl = w('killer'), u = eo(seg(t, kl - .2, kl + .2)); bg(t, .05 + .3 * u); cam(540, 1200, lerp(1.0, 1.12, seg(t, a, b)), 0, ...shake(t, kl, 14)); floor(); flash(t, kl, .1);
    g.save(); g.translate(540, 1100); g.scale(1 + .3 * u, 1 + .3 * u); g.globalAlpha = .9; g.fillStyle = '#000'; g.beginPath(); g.roundRect(-300, -380, 600, 520, 120); g.fill();
    neon(c => { c.moveTo(-150, -230); c.lineTo(-60, -190); c.moveTo(150, -230); c.lineTo(60, -190); }, RED, 8, 30, null, u);
    for (let i = 0; i < 7; i++) neon(c => { const x = -180 + i * 60; c.moveTo(x, -60); c.lineTo(x + 30, -60 + 70 * u); c.lineTo(x + 60, -60); }, '#e8e8ee', 3, 10, '#e8e8ee', u); g.restore();
    neon(c => { c.roundRect(330, 1200, 420, 300, 60); c.moveTo(270, 1340); c.roundRect(270, 1300, 90, 200, 40); c.roundRect(720, 1300, 90, 200, 40); c.moveTo(330, 1500); c.lineTo(320, 1562); c.moveTo(750, 1500); c.lineTo(760, 1562); }, '#b8a0a0', 4, 10, '#1a1416');
    neon(c => { c.roundRect(360, 1380, 360, 90, 30); }, '#c8b0b0', 3, 6, '#221a1c');
  },
  whisper(t, a, b) {       // it whispers safety: soft letters drift into a sleeping grey figure's ear — "safe... safe..."
    bg(t, .06); cam(560, 1250, 1.2); floor(); const sp = { ...POSE.sitTall, lean: .35, head: .6, a1: .1, a2: -.2, f1: -.4, f2: -.5 }, k0 = ayaz(g, -9e4, -9e4, .85, sp, { col: CROWD }), sy = 1560 + k0.hip[1] * .85 + 20;
    neon(c => { c.roundRect(400, sy - 330, 330, 360, 50); c.roundRect(360, sy - 120, 70, 150, 30); c.roundRect(700, sy - 120, 70, 150, 30); c.moveTo(420, sy + 30); c.lineTo(410, 1562); c.moveTo(710, sy + 30); c.lineTo(720, 1562); }, '#b8a0a0', 4, 8, '#1a1416');
    ayaz(g, 560, 1560, .85, sp, { col: CROWD, glow: .5 }); neon(c => { c.roundRect(400, sy - 10, 330, 50, 20); }, '#c8b0b0', 3, 6, '#221a1c');
    for (let i = 0; i < 4; i++) { const q = ((t - a) * 1.2 + i / 4) % 1; label('safe...', lerp(980, 640, q), lerp(820, 1080, q) + Math.sin(q * 9 + i) * 20, 44 - 14 * q, '#cfd3e0', Math.sin(q * Math.PI)); }
  },
  jar(t, a, b) {           // but it murders your potential: a red sprout in a glass jar — the lid drops, the sprout wilts grey
    bg(t, .15); cam(540, 1150, lerp(1.1, 1.25, seg(t, a, b))); const ld = eo(seg(t, w('murders') - .2, w('murders') + .1)), wl = eo(seg(t, w('murders') + .1, w('potential') + .3));
    neon(c => { c.roundRect(340, 900, 400, 560, 40); }, '#c8d4e8', 4, 14, 'rgba(160,180,220,.06)'); neon(c => { c.rect(320, lerp(600, 860, ld), 440, 50); }, '#9a9aa6', 4, 4, '#18181f');
    const col = wl > .5 ? '#6a6a76' : RED; neon(c => { c.moveTo(540, 1460); c.quadraticCurveTo(540 + 120 * wl, 1250, 540 + 260 * wl, 1120 + 300 * wl * wl); }, col, 8, 30 * (1 - wl));
    for (const s2 of [-1, 1]) neon(c => { const lx = 540 + 150 * wl, ly = 1200 + 160 * wl; c.ellipse(lx + s2 * 60, ly + 40 * wl, 60, 26, s2 * (.5 + 1.2 * wl), 0, 7); }, col, 4, 20 * (1 - wl), wl > .5 ? '#18181f' : 'rgba(255,42,60,.35)');
    label('POTENTIAL', 540, 1560, 80, wl > .5 ? GREY : RED);
  },
  greats(t, a, b) {        // every person who ever achieved greatness: grey monuments on pedestals — each tagged with how often it FAILED
    bg(t, .2); cam(lerp(500, 580, seg(t, a, b)), 1250, .95); floor();
    [[180, '1000×'], [420, '326×'], [660, '9000×'], [900, '74×']].forEach(([x, n], i) => { neon(c => { c.rect(x - 90, 1400, 180, 162); }, '#8a8a96', 4, 4, '#121218'); ayaz(g, x, 1400, .55, POSE.hero, { col: { rim: '#9a9aa6', hot: '#c8c8d2', glow: 'rgba(200,200,220,' }, glow: .6 });
      const k = back(seg(t, w('greatness') - .5 + i * .12, w('greatness') - .2 + i * .12)); label('FAILED', x, 1450, 36, RED, k); label(n, x, 1505, 44, WHITE, k); });
  },
  failure(t, a, b) {       // tasted failure, over and over: a FAIL glove knocks him down — he rises — again — then he catches it
    bg(t, .25); const hits = [w('tasted'), w('over', 26), w('over', 27)], ct = w('again') - .1; cam(540, 1200, 1.1, 0, ...shake(t, hits.find(h => t > h && t < h + .4) || -9, 26)); floor();
    let pose = POSE.hero, gx = 1300; for (const h of hits) { const ph = t - h; if (ph > -.2 && ph < .9) { gx = ph < .1 ? lerp(1300, 700, eo(seg(ph, -.2, .1))) : lerp(700, 1300, eo(seg(ph, .1, .4))); pose = ph < .1 ? POSE.hero : mixPose(mixPose(POSE.hero, POSE.kneel, eo(seg(ph, .1, .3))), POSE.hero, eo(seg(ph, .45, .85))); } }
    if (t > ct - .2) { gx = lerp(1300, 760, eo(seg(t, ct - .2, ct))); pose = Q.catch; }
    neon(c => { c.moveTo(gx + 100, 1150); c.lineTo(1400, 1150); }, '#6a6a76', 14, 0); neon(c => { c.roundRect(gx - 40, 1080, 150, 140, 50); }, '#c8c8d2', 5, 14, '#2a2a32'); label('FAIL', gx + 35, 1150, 44, RED);
    A(540, 1560, .95, pose, { glow: 1.1 }); hits.forEach(h => { const ph = seg(t, h + .1, h + .5); if (ph > 0 && ph < 1) neon(c => { c.arc(700, 1150, 40 + 200 * ph, 0, 7); }, WHITE, 3, 10, null, 1 - ph); });
  },
  sidelines(t, a, b) {     // the only difference: he races on the track — behind the SIDELINE rope the others just stand and watch
    bg(t, .2); const u = eio(seg(t, w('people', 30) - .3, w('sidelines') + .3)); cam(540, lerp(1150, 1350, u), lerp(1.1, .9, u));
    const off = ((t - a) * 1100) % 200; for (let i = -1; i < 8; i++) line(i * 200 - off, 1380, i * 200 - off + 100, 1380, 'rgba(255,255,255,.3)', 4);
    line(-300, 1300, 1400, 1300, 'rgba(255,255,255,.4)', 3); A(540, 1300, .65, run(t, 18), { wind: 1 });
    neon(c => { c.moveTo(-300, 1470); for (let x = -300; x < 1400; x += 120) c.quadraticCurveTo(x + 60, 1500, x + 120, 1470); }, RED, 4, 14); label('SIDELINES', 540, 1530, 60, GREY);
    for (let i = 0; i < 6; i++) grey(110 + i * 175, 1820, .45, Q.cross, .9);
  },
  stumble(t, a, b) {       // refused to let a stumble stop their race: he clips a hurdle, a hand to the ground — and keeps running
    bg(t, .25); const st = w('stumble') - .05, ph = seg(t, st, st + .7); cam(540, 1200, 1.1, 0, ...shake(t, st, 18));
    const hx = 760 - (t - a) * 500 + (t > st ? (t - st) * 300 : 0); floor();
    const fall = eo(seg(t, st, st + .4)); g.save(); g.translate(hx, 1562); g.rotate(-1.4 * fall); neon(c => { c.moveTo(0, 0); c.lineTo(0, -230); c.moveTo(-60, -230); c.lineTo(60, -230); c.moveTo(60, -230); c.lineTo(60, 0); }, '#d8d8e4', 6, 10); g.restore();
    const off = ((t - a) * 500) % 160; for (let i = -1; i < 9; i++) line(i * 160 - off, 1600, i * 160 - off + 60, 1600, 'rgba(255,255,255,.2)', 3);
    A(500, 1560, .9, ph > 0 && ph < 1 ? mixPose(mixPose(run(t, 16), Q.stumble, eo(seg(ph, 0, .3))), run(t, 16), eo(seg(ph, .45, 1))) : run(t, 16), { wind: 1 });
  },
  fall(t, a, b) {          // so what if you fall: he drops into the dark — the camera falls with him — superhero landing, the floor cracks
    const ld = w('fall') + .25, d = seg(t, a, ld); bg(t, .2 + .4 * seg(t, ld, ld + .2)); const y = lerp(300, 1560, d * d);
    cam(540, Math.min(y - 300, 1200), 1.0, 0, ...shake(t, ld, 34)); flash(t, ld, .1);
    if (t < ld) for (let i = 0; i < 16; i++) line(80 + hash(i) * 920, y - 400 + ((hash(i + 3) * 1600 + (t - a) * 2600) % 1600) - 800, 80 + hash(i) * 920, y - 400 + ((hash(i + 3) * 1600 + (t - a) * 2600) % 1600) - 640, 'rgba(255,90,110,.4)', 3);
    floor(); A(540, Math.min(y, 1560), .95, t < ld ? POSE.jump : mixPose(POSE.kneel, POSE.hero, eo(seg(t, ld + .5, b))), { wind: t < ld ? 1 : .2, glow: 1.3 });
    const cr = eo(seg(t, ld, ld + .3)); if (cr > 0) for (let i = 0; i < 8; i++) { const an = Math.PI + (i + .5) / 8 * Math.PI; neon(c => { c.moveTo(540, 1562); c.lineTo(540 + Math.cos(an) * 360 * cr, 1562 - Math.sin(an) * 40 * cr + 20); }, RED, 4, 20); }
  },
  plane(t, a, b) {         // doesn't work on the first try: paper plane one nosedives and crumples — plane two soars off-frame
    bg(t, .2); cam(560, 1200, 1.05); floor(); const r1 = a + .55, r2 = w('try') - .1;
    let pose = POSE.hero; if (t < r1) pose = mixPose(POSE.hero, Q.windup, eo(seg(t, a, r1 - .1))); else if (t < r1 + .4) pose = mixPose(Q.windup, Q.release, eo(seg(t, r1, r1 + .12)));
    else if (t < r2) pose = mixPose(Q.release, Q.windup, eo(seg(t, r2 - .7, r2 - .1))); else pose = mixPose(Q.windup, Q.release, eo(seg(t, r2, r2 + .12)));
    const k = A(260, 1560, .9, pose), [hx, hy] = hand(k, 260, 1560, .9);
    const pl = (x, y, r, cr = 0) => { g.save(); g.translate(x, y); g.rotate(r); neon(c => { c.moveTo(60, 0); c.lineTo(-50, -30 * (1 - cr)); c.lineTo(-30, 0); c.lineTo(-50, 30 * (1 - cr)); c.closePath(); }, RED, 4, 20, 'rgba(255,42,60,.25)'); g.restore(); };
    if (t < r1 + .05) pl(hx, hy, -.3); else { const p = seg(t, r1, r1 + .8); pl(lerp(hx, 720, p), 1100 + 460 * p * p - 120 * Math.sin(p * Math.PI) , p * 1.2, seg(p, .95, 1)); if (p >= 1) label('✗', 720, 1480, 90, GREY); }
    if (t > r2 - .7) { if (t < r2 + .05) pl(hx, hy, -.3); else { const p = seg(t, r2, r2 + 1.1); pl(lerp(hx, 1400, p), lerp(hy, 500, p) - 80 * Math.sin(p * 6), -.6); } }
    label('TRY 1', 720, 1520, 44, GREY, t > r1 + .8 ? 1 : 0);
  },
  theend(t, a, b) {        // that is not your end: an old film's THE END card — his fist punches straight through it
    const pc = w('end') - .05, u = seg(t, pc, pc + .6); bg(t, .1 + .4 * u); cam(540, 960, lerp(1.0, 1.1, seg(t, a, b)), 0, ...shake(t, pc, 30)); flash(t, pc, .1);
    shatter(c => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#16161c'; c.fillRect(60, 560, 960, 800); c.strokeStyle = '#d8d8e4'; c.lineWidth = 6; c.strokeRect(90, 590, 900, 740);
      c.font = 'italic 900 150px Montserrat'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#d8d8e4'; c.fillText('THE END', 540, 960); c.restore(); }, u, 540, 960, 4);
    if (u > 0) { const k = eo(seg(u, 0, .3)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const fy = lerp(1500, 860, k); neon(c => { c.roundRect(490, fy + 100, 100, 1200, 30); }, RED, 6, 30, '#0a0306'); neon(c => { c.roundRect(450, fy - 40, 180, 160, 40); for (let i = 1; i < 4; i++) { c.moveTo(450 + i * 45, fy - 40); c.lineTo(450 + i * 45, fy + 20); } }, RED, 6, 50, '#1a0508'); neon(c => { c.moveTo(490, fy + 160); c.lineTo(590, fy + 160); }, '#ffb81f', 8, 20); g.restore(); }
  },
  lessons(t, a, b) {       // it's your education: the shards land as stairs — LESSON 1, 2, 3 — and he climbs them
    bg(t, .25); cam(560, 1150, 1.0); floor();
    for (let i = 0; i < 3; i++) { const k = back(seg(t, a + i * .15, a + .3 + i * .15)); g.save(); g.translate(420 + i * 210, 1562 - i * 130); g.scale(1, k); neon(c => { c.rect(0, -130, 210, 130 + i * 130); }, RED, 4, 20, '#14070a'); g.restore(); label('LESSON ' + (i + 1), 525 + i * 210, 1620 - i * 130, 36, WHITE, k); }
    const p = seg(t, a + .4, b - .1), x = lerp(250, 900, p), st = Math.max(0, Math.min(3, Math.floor((x - 380) / 210) + 1)), y = 1562 - st * 130;
    A(x, y, .75, walk(t));
  },
  safe(t, a, b) {          // stop playing it safe: sealed in a vault marked SAFE — he kicks the door off its hinges
    const kk = w('safe') - .1, op = eo(seg(t, kk, kk + .35)); bg(t, .1 + .5 * op, 900, 1200); cam(560, 1200, 1.05, 0, ...shake(t, kk, 30)); floor();
    neon(c => { c.rect(100, 700, 760, 862); }, '#8a8a96', 6, 6, '#0c0c10'); label('SAFE', 480, 800, 90, GREY);
    if (op > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,42,60,${.3 * op})`; g.beginPath(); g.moveTo(860, 900); g.lineTo(1400, 700); g.lineTo(1400, 1700); g.lineTo(860, 1562); g.fill(); g.restore(); }
    g.save(); g.translate(860, 900); g.scale(1 - 1.4 * op, 1); neon(c => { c.rect(-20, 0, 40 + 0, 662); c.arc(0, 330, 0, 0, 7); }, '#c8c8d2', 6, 10, '#22222a'); g.restore();
    const dw = 1 - op * .9; neon(c => { c.rect(860 + 200 * op, 900 - 60 * op, 120 * dw, 662); }, '#c8c8d2', 6, 10, '#22222a', 1);
    A(lerp(640, 680, op), 1560, .9, t < kk - .3 ? POSE.hero : mixPose(POSE.hero, Q.kick, eo(seg(t, kk - .3, kk)) - eo(seg(t, kk + .3, kk + .6))), { glow: 1.2 });
  },
  whatif(t, a, b) {        // stop letting "what if" steal your destiny: a shadow hand snatches the red star from his palm — he grabs it back
    bg(t, .25); cam(540, 1150, 1.1); floor(); const sn = w('steal'), gb = w('destiny');
    const k = A(560, 1560, .95, t < gb ? mixPose(Q.palm, Q.flinch, eo(seg(t, sn, sn + .2)) * .4) : mixPose(Q.palm, Q.grab, 1 - eo(seg(t, gb + .3, gb + .8))), { glow: 1.1 }), [px, py] = hand(k, 560, 1560, .95);
    const tx = t < sn ? lerp(-300, px - 40, eo(seg(t, a + .2, sn))) : t < gb ? lerp(px - 40, 150, eo(seg(t, sn, sn + .5))) : lerp(150, px - 40, eo(seg(t, gb, gb + .3)));
    const ty = t < gb ? lerp(py - 160, 560, eo(seg(t, sn, sn + .5))) : lerp(560, py - 160, eo(seg(t, gb, gb + .3)));
    const hold = t > sn - .05 && t < gb + .3; if (t < gb + .5) { neon(c => { c.moveTo(-400, tx < 0 ? py - 300 : 400); c.quadraticCurveTo(tx - 200, ty - 200, tx, ty); }, '#4a4a55', 30, 0, null, .95); neon(c => { c.arc(tx, ty, 50, 0, 7); }, '#5a5a66', 4, 0, '#121218'); label('WHAT IF?', tx - 30, ty - 110, 50, '#9a9aa6'); }
    const sx = hold ? tx + 20 : px, sy = hold ? ty - 10 : py - 70, sr = 50 + 8 * Math.sin(t * 6);
    neon(c => { for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? sr * .45 : sr; c[i ? 'lineTo' : 'moveTo'](sx + Math.cos(an) * r, sy + Math.sin(an) * r); } c.closePath(); }, RED, 4, 40, 'rgba(255,42,60,.6)');
    if (t > gb + .3) label('DESTINY', px, py - 170, 50, RED, eo(seg(t, gb + .3, gb + .5)));
  },
  arena(t, a, b) {         // step into the arena: the iron gate grinds up, light floods in, he walks into it
    const up = eo(seg(t, a, a + .7)); bg(t, .2 + .6 * up, 540, 800); cam(540, 1200, lerp(1.0, 1.15, seg(t, a, b)));
    g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(0, 400, 0, 1560); lg.addColorStop(0, `rgba(255,60,80,${.5 * up})`); lg.addColorStop(1, 'rgba(255,60,80,0)'); g.fillStyle = lg; g.fillRect(200, 400, 680, 1162); g.restore();
    neon(c => { c.moveTo(200, 1562); c.lineTo(200, 600); c.arc(540, 600, 340, Math.PI, 0); c.lineTo(880, 1562); }, '#9a9aa6', 10, 6); floor();
    const gy = -1000 * up; for (let i = 0; i < 7; i++) neon(c => { c.moveTo(240 + i * 100, 400 + gy); c.lineTo(240 + i * 100, 1562 + gy); }, '#8a8a96', 10, 4, null, 1 - up * .9); neon(c => { c.moveTo(200, 1100 + gy); c.lineTo(880, 1100 + gy); }, '#8a8a96', 10, 4, null, 1 - up * .9);
    A(540, 1560, lerp(.95, .8, seg(t, a + .4, b)), walk(t), { glow: 1.4 });
  },
  face(t, a, b) {          // face the fear head-on: the ghost from the opening, huge — he walks straight at it and it shrinks to smoke
    bg(t, .2); cam(540, 1200, 1.0); floor(); const p = seg(t, a, w('on', 49.9) + .1), gs = lerp(1.6, .2, eo(p));
    if (p < 1) ghost(800, 1560, gs, t, 1 - seg(p, .8, 1), .3, true);
    if (p > .8) for (let i = 0; i < 10; i++) { const q = seg(t, a + (w('on', 49.9) + .1 - a) * .8, b); neon(c => { c.arc(800 + (hash(i) - .5) * 200 * q, 1500 - q * 300 * hash(i + 2), 10 + 30 * q, 0, 7); }, '#cfd3e0', 2, 8, null, 1 - q); }
    A(lerp(200, 560, p), 1560, .95, p < 1 ? walk(t) : POSE.hero, { glow: 1.3 });
  },
  build(t, a, b) {         // build something legendary: he walks out over the abyss — a red bridge forms under every step
    const p = seg(t, a + .1, w('legendary') + .2), x = lerp(200, 880, p), done = eo(seg(t, w('legendary'), w('legendary') + .4));
    bg(t, .2 + .4 * done); cam(lerp(400, 680, p), 1250, .9);
    neon(c => { c.moveTo(-400, 1562); c.lineTo(220, 1562); c.lineTo(200, 2300); }, '#9a9aa6', 5, 6, '#0c0c10'); neon(c => { c.moveTo(1500, 1562); c.lineTo(940, 1562); c.lineTo(960, 2300); }, '#9a9aa6', 5, 6, '#0c0c10');
    for (let i = 0; i < 12; i++) { const px = 220 + i * 60; if (px > x + 50 && done < 1) continue; neon(c => { c.rect(px, 1562, 56, 26); }, RED, 4, 20 + 30 * done, 'rgba(255,42,60,.4)'); }
    if (done > 0) neon(c => { c.moveTo(220, 1480); c.lineTo(940, 1480); }, RED, 4, 30, null, done);
    A(x, 1560, .85, p < 1 ? walk(t) : POSE.victory, { glow: 1.2 + done });
  },
  stronger(t, a, b) {      // stronger than your fears: tug of war with the ghost — one heave and it's yanked off its feet and bursts
    const yk = w('fears') - .1, u = eo(seg(t, yk, yk + .3)); bg(t, .25 + .4 * u); cam(540, 1200, 1.05, 0, ...shake(t, yk, 26)); floor();
    const k = A(300 - 30 * u, 1560, .95, Q.pull, { glow: 1.2 + u }), [hx, hy] = hand(k, 300 - 30 * u, 1560, .95), gx = lerp(860, 520, u) + Math.sin(t * 8) * 10 * (1 - u);
    if (u < 1) ghost(gx, 1520 - 80 * u, .7, t, 1, 1.0, true); const rx = gx - 120 * .7 - 260 * .7 - 50 * .7, ry = 1520 - 260 * .7;
    neon(c => { c.moveTo(hx, hy); c.quadraticCurveTo((hx + rx) / 2, Math.max(hy, ry) + 30 * (1 - u), u < 1 ? rx : hx + 80, u < 1 ? ry : hy + 40); }, '#c8b8a0', 7, 6);
    if (u > 0) sparks(g, gx, 1300, t - yk - .25, { seed: 6, scale: 1.2, n: 120, life: 1 });
  },
  prove(t, a, b) {         // now go prove it: he explodes into a sprint toward the light — hourglass turns, the sky bursts red
    bg(t, 1.1, 540, 1100); cam(540, 1200, lerp(1.05, 1.2, seg(t, a, b)), 0, ...shake(t, w('prove'), 24)); flash(t, w('prove'), .1);
    const off = ((t - a) * 1300) % 200; for (let i = -1; i < 8; i++) line(i * 200 - off, 1562, i * 200 - off + 110, 1562, 'rgba(255,90,110,.6)', 5);
    for (let i = 0; i < 10; i++) { const d = ((i / 10 + (t - a) * 1.4) % 1); line(1100 - d * 1400, 700 + hash(i) * 800, 1100 - d * 1400 + 160, 700 + hash(i) * 800, 'rgba(255,42,60,.3)', 3); }
    A(540, 1560, .95, run(t, 18), { wind: 1, glow: 1.6 });
    [[w('prove'), 540, 800, 1, 1.5], [w('prove') + .35, 230, 640, 2, 1.1], [w('prove') + .6, 850, 600, 3, 1.1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 140, life: 1.3 }));
  },
};
const SC = [];
function scenes() {
  const T = [0, w('fear'), w('it', 5), w('unless'), w('think'), w('because'), w('how'), w('comfort'), w('it', 19), w('but'), w('every'), w('tasted'), w('the', 28.5), w('that', 32), w('so'), w('so', 36.5), w('that', 39), w('that', 40.8), w('stop', 43), w('stop', 44.5), w('step'), w('face'), w('and', 50.2), w('you', 52.5), w('now'), DUR];
  const N = ['hook', 'head', 'zero', 'keys', 'risk', 'mess', 'drawer', 'comfort', 'whisper', 'jar', 'greats', 'failure', 'sidelines', 'stumble', 'fall', 'plane', 'theend', 'lessons', 'safe', 'whatif', 'arena', 'face', 'build', 'stronger', 'prove'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('prove') - .2, w('prove') + .4));   // the peak ritual on "prove"
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
  await Promise.all(['150px Anton', '900 96px Montserrat', 'italic 900 150px Montserrat'].map(f => document.fonts.load(f)));
  window.READY = true;
})();
