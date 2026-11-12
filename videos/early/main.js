// "Why Successful People Wake Up Early" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 59.0; window.DUR = DUR;
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
const KEY = /listen|carefully|life|dreamed|handed|battle|day|conquering|morning|legends|3:45|am|sleep|unfair|advantage|limits|asleep|comfort|excuses|empires|silent|sharp|distractions|pure|power|quiet|winners|forged|bed|snooze|steal|future|permission|right|time|wake|control|world|capable|now|conquer/i;
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

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: frame one is an extreme close-up on his visor — it flares — whip back to him pointing straight at you
    bg(t, .3); flash(t, 0, .12, '255,42,60', .5); const u = eo(seg(t, .05, .9)), k0 = ayaz(g, -9e4, -9e4, 1, P.point, { t: T0 });
    const hx = 540 + (k0.head[0] + 12) * 1.0, hy = 1560 + (k0.head[1] - 4) * 1.0; cam(lerp(hx, 540, u), lerp(hy, 1150, u), lerp(6, 1.05, u), lerp(.2, 0, u), ...shake(t, .9, 18, .3));
    floor(); A(540, 1560, 1.0, mixPose(POSE.hero, P.point, eo(seg(t, .6, 1.0))), { glow: 1.3 });
    if (t < .5) neon(c => { c.moveTo(hx - 120, hy); c.lineTo(hx + 120, hy); }, '#ffd77a', 4, 40, null, 1 - seg(t, .2, .5));
  },
  dream(t, a, b) {         // the life you've dreamed of floats above him in a glowing sphere
    bg(t, .25); cam(540, 1100, lerp(1.0, 1.08, seg(t, a, b)));
    const k = eo(seg(t, a, a + .5)), cy = 720 + Math.sin(t * 2) * 15; neon(c => { c.arc(540, cy, 260 * k, 0, 7); }, RED, 5, 40, 'rgba(255,42,60,.08)');
    g.save(); g.beginPath(); g.arc(540, cy, 250 * k, 0, 7); g.clip(); sun(540, cy + 120, 70, k); neon(c => { c.moveTo(290, cy + 150); c.lineTo(400, cy); c.lineTo(470, cy + 60); c.lineTo(600, cy - 90); c.lineTo(720, cy + 50); c.lineTo(800, cy + 150); }, RED, 4, 20); g.restore();
    floor(); A(540, 1560, .95, P.gaze); ground(540, 1560, .95, .4);
  },
  handed(t, a, b) {        // a gift box on a string comes down to him — and is yanked back up before he can touch it
    bg(t, .15); cam(540, 1150, 1.05); const up = seg(t, w('handed') + .1, w('you', 5.5) + .2), y = up > 0 ? lerp(950, -300, ei(up)) : lerp(-300, 950, eo(seg(t, a, a + .9)));
    neon(c => { c.moveTo(560, -400); c.lineTo(560, y - 90); }, '#9a9aa6', 2, 4);
    neon(c => { c.rect(470, y - 90, 180, 150); c.moveTo(560, y - 90); c.lineTo(560, y + 60); c.moveTo(470, y - 20); c.lineTo(650, y - 20); }, '#c8c8d2', 4, 14, '#141419');
    floor(); A(400, 1560, .95, up > 0 ? mixPose(P.reach, POSE.hero, seg(up, .3, 1)) : mixPose(POSE.hero, P.reach, eo(seg(t, a + .5, a + 1.0))));
  },
  battle(t, a, b) {        // ROUND 1: the bell rings, his first opponent of the day is a hulking grey bed
    bg(t, .25); const bell = w('battle'); cam(540, 1250, lerp(1.0, 1.1, seg(t, a, b)), 0, ...shake(t, bell, 18));
    const rk = back(seg(t, a + .1, a + .4)); g.save(); g.translate(540, 820); g.scale(rk, rk); neon(c => { c.roundRect(-230, -70, 460, 140, 20); }, '#d8d8e4', 5, 20, 'rgba(20,20,26,.95)'); label('ROUND 1', 0, 4, 100, RED); g.restore();
    for (let r = 0; r < 3; r++) { const ph = seg(t, bell + r * .12, bell + .6 + r * .12); if (ph > 0 && ph < 1) neon(c => { c.arc(540, 820, 260 + ph * 300, 0, 7); }, '#d8d8e4', 3, 10, null, 1 - ph); }
    floor(); bed(800, 1562, 1.1); A(330, 1560, .95, P.guard);
  },
  morning(t, a, b) {       // conquering your morning: the bed flipped on its side, he stands on it as the sun cracks the horizon
    const k = eo(seg(t, a + .2, b)); bg(t, .2 + .5 * k, 540, 1450); cam(540, 1250, lerp(1.1, .98, seg(t, a, b)));
    sun(540, 1562, 200, k); floor();
    g.save(); g.translate(540, 1562); g.rotate(-Math.PI / 2 * eo(seg(t, a, a + .4))); bed(0, 0, .9); g.restore();
    A(540, 1562 - 240 * eo(seg(t, a, a + .4)) - 10, .85, mixPose(POSE.hero, POSE.victory, eo(seg(t, w('morning') - .1, w('morning') + .2))));
  },
  city(t, a, b) {          // legends: a sleeping city at night — every window dark but one, red, burning
    bg(t, .08); const u = eo(seg(t, a, b)); cam(lerp(540, 660, u), lerp(1200, 1000, u), lerp(.95, 1.5, u));
    for (let i = 0; i < 10; i++) { const x = 40 + i * 104, h = 400 + hash(i) * 700; neon(c => { c.rect(x, 1562 - h, 90, h); }, '#3a3a46', 2, 0, '#0b0b10');
      for (let r = 0; r < Math.floor(h / 70); r++) for (let q = 0; q < 2; q++) { const lit = i === 6 && r === 6 && q === 0; neon(c => { c.rect(x + 14 + q * 36, 1562 - h + 30 + r * 70, 24, 34); }, lit ? RED : '#22222a', lit ? 3 : 1, lit ? 24 : 0, lit ? 'rgba(255,42,60,.7)' : null); } }
    neon(c => { c.arc(860, 420, 50, 0, 7); }, '#d8d8e4', 3, 20, 'rgba(220,220,235,.12)');
  },
  cook(t, a, b) {          // 3:45 AM: through that window, a lone figure already at the desk — LEGENDS
    bg(t, .15); cam(540, 1150, lerp(1.1, 1.0, seg(t, a, b)));
    neon(c => { c.rect(120, 500, 840, 1100); c.moveTo(540, 500); c.lineTo(540, 1600); c.moveTo(120, 1050); c.lineTo(960, 1050); }, '#9a9aa6', 6, 10);
    g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createRadialGradient(540, 1250, 0, 540, 1250, 520); lg.addColorStop(0, 'rgba(255,42,60,.3)'); lg.addColorStop(1, 'rgba(255,42,60,0)'); g.fillStyle = lg; g.fillRect(120, 500, 840, 1100); g.restore();
    neon(c => { c.rect(330, 1350, 420, 24); c.moveTo(380, 1374); c.lineTo(380, 1600); c.moveTo(700, 1374); c.lineTo(700, 1600); c.moveTo(380, 1460); c.lineTo(500, 1460); c.moveTo(390, 1460); c.lineTo(390, 1600); c.moveTo(490, 1460); c.lineTo(490, 1600); }, '#8a8a96', 4, 4); grey(440, 1500, .6, P.sitDesk);
    const ck = back(seg(t, w('345') - .05, w('345') + .2)); g.save(); g.translate(540, 760); g.scale(ck, ck); neon(c => { c.roundRect(-260, -100, 520, 200, 24); }, RED, 5, 30, 'rgba(10,10,14,.95)'); label('3:45 AM', 0, 6, 130, RED); g.restore();
  },
  sheep(t, a, b) {         // not about losing sleep: counted sheep stop jumping, LOSING SLEEP gets struck out
    bg(t, .1); cam(540, 1250, 1.05); floor();
    neon(c => { c.moveTo(500, 1562); c.lineTo(500, 1420); c.moveTo(620, 1562); c.lineTo(620, 1420); c.moveTo(480, 1450); c.lineTo(640, 1450); c.moveTo(480, 1500); c.lineTo(640, 1500); }, '#8a8a96', 5, 4);
    for (let i = 0; i < 3; i++) { const p = ((t - a) * .9 + i / 3) % 1, x = lerp(150, 950, p), y = 1490 - Math.max(0, Math.sin((p - .3) / .4 * Math.PI)) * 220 * (p > .3 && p < .7 ? 1 : 0);
      neon(c => { c.ellipse(x, y, 70, 46, 0, 0, 7); c.moveTo(x + 55, y - 20); c.arc(x + 75, y - 25, 24, 0, 7); c.moveTo(x - 40, y + 40); c.lineTo(x - 40, y + 70); c.moveTo(x + 40, y + 40); c.lineTo(x + 40, y + 70); }, '#c8c8d2', 4, 10, '#16161c'); }
    label('LOSING SLEEP', 540, 800, 110, GREY); const x2 = eo(seg(t, w('sleep') + .05, w('sleep') + .4)); if (x2 > 0) neon(c => { c.moveTo(150, 810); c.lineTo(150 + 780 * x2, 790); }, RED, 14, 30);
  },
  limits(t, a, b) {        // an unfair advantage over your own limits: he presses up into a glass ceiling marked LIMITS — it shatters
    const br = w('limits') - .05, u = seg(t, br, br + .8); bg(t, .25 + .5 * u); cam(540, 1150, lerp(1.15, 1.0, seg(t, a, b)), 0, ...shake(t, br, 30));
    const k0 = ayaz(g, -9e4, -9e4, .95, P.pushUp, { t: T0 }), hy = 1560 + Math.min(k0.A1.wr[1], k0.A2.wr[1]) * .95;
    shatter(c => { const M = g.getTransform(); c.setTransform(M); c.save(); c.strokeStyle = '#d8e4ff'; c.lineWidth = 6; c.shadowColor = '#9ab0ff'; c.shadowBlur = 16; c.fillStyle = 'rgba(160,180,230,.12)'; c.fillRect(-200, hy - 70, 1500, 70); c.strokeRect(-200, hy - 70, 1500, 70);
      c.font = '70px Anton'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#d8e4ff'; c.fillText('YOUR LIMITS', 540, hy - 35); c.restore(); }, u, 540, 700, 9);
    floor(); A(540, 1560 - 220 * eo(u), .95, mixPose(P.pushUp, POSE.victory, eo(seg(u, .2, .6))), { glow: 1 + u }); sparks(g, 540, hy - 30, t - br, { seed: 10, scale: 1.1, n: 100, life: .9 });
  },
  asleep(t, a, b) {        // the rest of the world fast asleep: rows of grey figures slumped in their beds, z's drifting up
    bg(t, .05); cam(lerp(500, 600, seg(t, a, b)), 1250, .9);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const x = 120 + i * 300 + r * 60, y = 1300 + r * 160; bed(x, y, .5); grey(x - 40, y - 46, .38, { ...P.sleep, q1: -1.5, k1: 1.5, q2: -1.45, k2: 1.45, y: 150 }, .9);
      for (let z = 0; z < 2; z++) { const q = ((t - a) * .6 + z * .5 + i * .2 + r * .3) % 1; label('z', x + 20 + q * 60, y - 260 - q * 160, 40 + 20 * q, '#8a8a96', 1 - q); } }
  },
  cocoon(t, a, b) {        // wrapped in comfort and excuses: a grey figure cocooned in a blanket stitched with those words
    bg(t, .08); cam(540, 1200, lerp(1.2, 1.3, seg(t, a, b)), .04); floor();
    const bre = 1 + .03 * Math.sin(t * 2.4); neon(c => { c.ellipse(540, 1350, 340 * bre, 200 * bre, -.15, 0, 7); }, '#8a8a96', 5, 8, '#15151b');
    neon(c => { c.arc(260, 1250, 60, 0, 7); }, '#6a6a76', 4, 0, '#0d0d12');
    for (let i = 0; i < 5; i++) neon(c => { c.moveTo(300 + i * 100, 1180 + i * 8); c.quadraticCurveTo(320 + i * 100, 1350, 300 + i * 100, 1510 - i * 10); }, '#5a5a66', 2, 0);
    label('COMFORT', 470, 1320, 70, '#b8b8c4', back(seg(t, w('comfort') - .05, w('comfort') + .2)), -.15); label('EXCUSES', 640, 1420, 70, '#b8b8c4', back(seg(t, w('excuses') - .05, w('excuses') + .2)), -.15);
  },
  chess(t, a, b) {         // building their empires: a chessboard in the dark — he slides a red king forward, grey pieces still asleep
    bg(t, .25); cam(540, 1200, lerp(1.0, 1.1, seg(t, a, b)), -.05);
    for (let r = 0; r < 5; r++) for (let c2 = 0; c2 < 6; c2++) { const x = 180 + c2 * 120 + r * 30, y = 1250 + r * 70; neon(c => { c.moveTo(x, y); c.lineTo(x + 120, y); c.lineTo(x + 150, y + 70); c.lineTo(x + 30, y + 70); c.closePath(); }, '#3a3a46', 2, 0, (r + c2) % 2 ? '#141419' : '#0b0b0f'); }
    [[300, 1300], [450, 1300], [700, 1440], [820, 1370]].forEach(([x, y]) => neon(c => { c.moveTo(x - 30, y); c.lineTo(x - 20, y - 70); c.arc(x, y - 90, 24, 0, 7); c.moveTo(x + 20, y - 70); c.lineTo(x + 30, y); c.closePath(); }, '#6a6a76', 3, 0, '#16161c'));
    const kx = lerp(560, 620, eo(seg(t, a + .4, a + 1.2))), ky = lerp(1480, 1380, eo(seg(t, a + .4, a + 1.2)));
    neon(c => { c.moveTo(kx - 45, ky); c.lineTo(kx - 30, ky - 130); c.lineTo(kx + 30, ky - 130); c.lineTo(kx + 45, ky); c.closePath(); c.moveTo(kx, ky - 130); c.lineTo(kx, ky - 200); c.moveTo(kx - 22, ky - 175); c.lineTo(kx + 22, ky - 175); }, RED, 5, 30, 'rgba(255,42,60,.3)');
    A(kx - 220, 1660, .7, P.place); label('EMPIRE', 540, 900, 110, RED, back(seg(t, w('empires') - .05, w('empires') + .2)));
  },
  silent(t, a, b) {        // the silent morning: a still lake, the sky just turning, he stands on the shore
    const k = seg(t, a, b); bg(t, .15 + .2 * k, 540, 1300); cam(540, 1250, lerp(1.0, 1.05, k));
    sun(540, 1400, 160, .4 + .3 * k); neon(c => { c.moveTo(-200, 1400); c.lineTo(1300, 1400); }, '#9a9aa6', 3, 10);
    for (let i = 0; i < 6; i++) line(380 + Math.sin(t + i) * 10, 1440 + i * 40, 700 - Math.sin(t + i) * 10, 1440 + i * 40, `rgba(255,42,60,${.25 - i * .03})`, 3);
    A(220, 1400, .7, P.calm, { glow: .9 });
  },
  sharp(t, a, b) {         // your mind is sharp: he holds a blade up — a glint runs the length of its edge
    bg(t, .25); cam(560, 1100, 1.2, -.05); floor();
    const k = A(420, 1560, .95, P.sword), [hx, hy] = hand(k, 420, 1560, .95), an = -1.2;
    g.save(); g.translate(hx, hy); g.rotate(an); neon(c => { c.moveTo(0, -8); c.lineTo(520, -8); c.lineTo(580, 0); c.lineTo(520, 8); c.lineTo(0, 8); c.closePath(); c.moveTo(-10, -40); c.lineTo(-10, 40); }, '#d8d8e4', 4, 18, '#18181f');
    const gx = seg(t, a + .2, a + .8) * 560; neon(c => { c.moveTo(gx - 40, 0); c.lineTo(gx + 40, 0); }, '#ffffff', 6, 40, null, gx > 0 && gx < 560 ? 1 : 0); g.restore();
  },
  phoneoff(t, a, b) {      // no distractions: the phone's notifications go dark one by one, the screen dies
    bg(t, .1); cam(540, 1050, 1.1);
    neon(c => { c.roundRect(330, 600, 420, 780, 50); }, '#c8c8d2', 5, 20, 'rgba(10,10,14,.97)'); const off = seg(t, a + .2, b - .3);
    for (let i = 0; i < 4; i++) { const v = 1 - seg(off, i * .2, i * .2 + .2); if (v <= 0) continue; g.save(); g.globalAlpha = v; neon(c => { c.roundRect(360, 660 + i * 150, 360, 110, 24); }, '#9a9aa6', 3, 8, 'rgba(30,30,40,.95)'); neon(c => { c.arc(410, 715 + i * 150, 16, 0, 7); }, RED, 3, 12, RED); g.restore(); }
    if (off >= 1) label('OFF', 540, 990, 120, GREY);
  },
  orb(t, a, b) {           // pure power: a crackling orb of light forms between his hands
    const k = eo(seg(t, a, w('power'))); bg(t, .3 + .5 * k); cam(540, 1150, lerp(1.25, 1.1, seg(t, a, b)));
    floor(); const kk = A(540, 1560, .95, P.orb, { glow: 1 + k }), [hx, hy] = hand(kk, 540, 1560, .95), ox = hx + 30, oy = hy - 40;
    neon(c => { c.arc(ox, oy, 30 + 70 * k, 0, 7); }, RED, 5, 60, `rgba(255,42,60,${.4 * k})`);
    for (let i = 0; i < 6; i++) { const an = t * 9 + i; neon(c => { let x = ox, y = oy; c.moveTo(x, y); for (let q = 1; q < 6; q++) { x = ox + Math.cos(an + q * .3) * q * 30 * k + Math.sin(t * 40 + q) * 8; y = oy + Math.sin(an + q * .3) * q * 30 * k; c.lineTo(x, y); } }, '#ffd0d4', 2, 16, null, k); }
  },
  forge(t, a, b) {         // where winners are forged: a red-hot medal pulled from the fire and quenched — a hiss of steam
    bg(t, .3); const q = w('forged') - .1, qu = seg(t, q, q + .6); cam(540, 1250, lerp(1.0, 1.08, seg(t, a, b)), 0, ...shake(t, q, 12));
    floor(); neon(c => { c.moveTo(120, 1562); c.lineTo(160, 1400); c.lineTo(380, 1400); c.lineTo(420, 1562); }, '#8a8a96', 4, 6, '#121218');
    for (let i = 0; i < 8; i++) neon(c => { c.moveTo(180 + i * 25, 1400); c.quadraticCurveTo(200 + i * 25 + Math.sin(t * 9 + i) * 20, 1300, 190 + i * 25, 1230 - Math.abs(Math.sin(t * 7 + i)) * 60); }, i % 2 ? '#ff9a4a' : RED, 4, 24, null, .8);
    neon(c => { c.roundRect(700, 1440, 260, 122, 14); }, '#8a8a96', 4, 4, 'rgba(60,90,140,.3)');
    const pull = eo(seg(t, a + .2, q)), mx = lerp(270, 830, pull), my = q > t ? lerp(1330, 1250, pull) : lerp(1250, 1490, eo(qu));
    A(mx - 300, 1560, .85, P.tongs); neon(c => { c.moveTo(mx - 140, my - 60); c.lineTo(mx - 10, my); }, '#c8c8d2', 6, 6);
    neon(c => { c.arc(mx, my, 50, 0, 7); }, qu > .5 ? '#d8d8e4' : RED, 5, 40 * (1 - qu * .7), qu > .5 ? '#2a2a32' : 'rgba(255,90,60,.8)'); label('WINNER', mx, my, 22, WHITE);
    if (qu > 0) for (let i = 0; i < 10; i++) { const p = (qu * 1.5 + i / 10) % 1; neon(c => { c.arc(780 + i * 20 + Math.sin(p * 9 + i) * 20, 1440 - p * 400, 20 + p * 30, 0, 7); }, '#c8c8d2', 2, 6, null, (1 - p) * .6); }
  },
  ask(t, a, b) {           // "so let me ask you": he turns and points right down the lens — crash zoom
    bg(t, .3); cam(560, 1080, lerp(1.0, 1.9, eo(seg(t, a, a + .4))), lerp(0, -.12, seg(t, a, a + .4)), ...shake(t, a + .4, 14));
    floor(); A(540, 1560, 1.0, P.point, { glow: 1.3 });
  },
  warmbed(t, a, b) {       // the warm bed: soft glowing covers reach out like hands and pull a grey figure back in
    bg(t, .08); cam(540, 1300, lerp(1.1, 1.2, seg(t, a, b))); floor();
    bed(540, 1562, 1.2, 1); const pullIn = eo(seg(t, a + .3, b - .2));
    for (let i = 0; i < 2; i++) neon(c => { const x0 = 400 + i * 160; c.moveTo(x0, 1450); c.quadraticCurveTo(x0 + 40, 1300 - 60 * pullIn, lerp(740, 520, pullIn) + i * 20, lerp(1180, 1400, pullIn)); }, '#ffb070', 8, 20, null, .8);
    grey(lerp(820, 560, pullIn), lerp(1562, 1460, pullIn), .7, mixPose(POSE.stand, P.sleep, pullIn));
  },
  snooze(t, a, b) {        // the snooze button: a grey hand slams it — and the FUTURE slips away into the dark
    bg(t, .1); const pr = w('snooze') + .05; cam(540, 1150, 1.05, 0, ...shake(t, pr, 20));
    const d = eo(seg(t, pr - .2, pr)) - eo(seg(t, pr + .2, pr + .4)); neon(c => { c.ellipse(540, 1250, 300, 90, 0, 0, 7); c.moveTo(240, 1250); c.lineTo(240, 1330); c.moveTo(840, 1250); c.lineTo(840, 1330); c.ellipse(540, 1330, 300, 90, 0, 0, Math.PI); }, '#8a8a96', 4, 6, '#121218');
    neon(c => { c.ellipse(540, 1200 + 40 * d, 230, 70, 0, 0, 7); }, RED, 5, 24, '#2a0a10'); label('SNOOZE', 540, 1200 + 40 * d, 70, WHITE);
    const hy = lerp(400, 1080, d); neon(c => { c.moveTo(540, -200); c.lineTo(540, hy - 60); c.moveTo(470, hy - 60); c.lineTo(610, hy - 60); c.lineTo(600, hy); c.lineTo(480, hy); c.closePath(); }, '#6a6a76', 6, 6, '#121218');
    const sl = ei(seg(t, w('steal'), w('future') + .4)); neon(c => { c.arc(lerp(850, 1300, sl), lerp(700, 400, sl), 70, 0, 7); }, RED, 5, 30, 'rgba(255,42,60,.3)', 1 - sl * .5); label('FUTURE', lerp(850, 1300, sl), lerp(700, 400, sl), 34, WHITE, 1 - sl * .5);
  },
  permission(t, a, b) {    // stop waiting for permission: a form — PERMISSION? — he rips it in half
    bg(t, .2); const rip = w('permission') + .1, u = eo(seg(t, rip, rip + .5)); cam(540, 1100, 1.1, 0, ...shake(t, rip, 18));
    for (const s2 of [-1, 1]) { g.save(); g.translate(540 + s2 * 160 * u, 900 + 200 * u * u); g.rotate(s2 * .5 * u); g.beginPath(); s2 < 0 ? g.rect(-300, -350, 300, 700) : g.rect(0, -350, 300, 700); g.clip();
      neon(c => { c.rect(-280, -330, 560, 660); }, '#d8d8e4', 4, 10, '#e8e8ee'); g.font = '60px Anton'; g.textAlign = 'center'; g.fillStyle = '#18181f'; g.fillText('PERMISSION?', 0, -200); for (let i = 0; i < 6; i++) { g.fillStyle = '#9a9aa6'; g.fillRect(-220, -100 + i * 60, 440, 14); } g.restore(); }
    floor(); A(540, 1560, .8, mixPose(P.tear, { ...P.tear, a1: -1.4, a2: -.2, f1: -1.7, f2: -.3 }, u));
  },
  redlight(t, a, b) {      // stop waiting for the right time: a red light labelled RIGHT TIME? — he walks right through it
    bg(t, .2); cam(540, 1150, 1.05); floor();
    neon(c => { c.moveTo(800, 1562); c.lineTo(800, 900); }, '#8a8a96', 8, 4); neon(c => { c.roundRect(700, 560, 200, 360, 30); }, '#8a8a96', 4, 4, '#101016');
    const go = t > w('time') + .1; neon(c => { c.arc(800, 650, 50, 0, 7); }, go ? '#3a1015' : RED, 4, go ? 0 : 40, go ? '#200a0d' : RED); neon(c => { c.arc(800, 830, 50, 0, 7); }, go ? '#ffffff' : '#2a2a32', 4, go ? 40 : 0, go ? '#ffffff' : '#18181f');
    neon(c => { c.roundRect(640, 960, 320, 80, 12); }, '#8a8a96', 3, 4, '#101016'); label('RIGHT TIME?', 800, 1000, 52, '#b8b8c4'); A(lerp(200, 980, seg(t, a + .2, b)), 1560, .85, walk(t), { wind: .3 });
  },
  wake(t, a, b) {          // WAKE UP: lying flat — he jolts upright in one move, the visor flares; TAKE CONTROL: fist to palm, a shockwave
    bg(t, .3); const up = w('wake', 49), ctl = w('control'); cam(540, 1200, 1.1, 0, ...shake(t, ctl, 26)); floor(); flash(t, up + .15, .12);
    if (t < up + .15) { g.save(); g.translate(680, 1490); g.rotate(-Math.PI / 2); A(0, 0, .85, P.lie); g.restore(); }
    else A(540, 1560, .9, t < ctl ? mixPose(POSE.kneel, POSE.hero, eo(seg(t, up + .15, up + .45))) : mixPose(POSE.hero, P.fist, eo(seg(t, ctl - .1, ctl))), { glow: 1.3 });
    for (let r = 0; r < 3; r++) { const ph = seg(t, ctl + r * .1, ctl + .6 + r * .1); if (ph > 0 && ph < 1) neon(c => { c.ellipse(540, 1200, 100 + ph * 600, 60 + ph * 300, 0, 0, 7); }, RED, 4, 20, null, 1 - ph); }
  },
  world(t, a, b) {         // show the world: he steps into a hard spotlight before a vast grey audience
    bg(t, .3); cam(540, 1200, lerp(.9, 1.0, seg(t, a, b))); 
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) grey(60 + i * 120 + r * 40, 1820 + r * 70, .32, { ...POSE.stand, head: -.3 }, .8);
    g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(540, 200, 540, 1560); lg.addColorStop(0, 'rgba(255,240,240,.05)'); lg.addColorStop(1, 'rgba(255,60,80,.35)'); g.fillStyle = lg; g.beginPath(); g.moveTo(500, 200); g.lineTo(580, 200); g.lineTo(780, 1560); g.lineTo(300, 1560); g.fill(); g.restore();
    neon(c => { c.rect(160, 1562, 760, 60); }, '#8a8a96', 4, 6, '#101016'); A(540, 1560, .95, mixPose(POSE.hero, POSE.victory, eo(seg(t, w('capable') - .2, w('capable') + .2))), { glow: 1.4 });
  },
  now(t, a, b) {           // YOUR TIME IS NOW: the sun breaks the horizon, its rays spell NOW
    const k = eo(seg(t, a, w('now'))); bg(t, .3 + .6 * k, 540, 1300); cam(540, 1150, lerp(1.0, 1.08, seg(t, a, b)));
    sun(540, 1562, 260, k); floor(); label('NOW', 540, 880, 300, RED, back(seg(t, w('now') - .05, w('now') + .25)));
    A(540, 1560, .8, POSE.hero, { glow: 1.2 }); ground(540, 1560, .8, k);
  },
  conquer(t, a, b) {       // GO AND CONQUER: he sprints into the sunrise — the hourglass turns, the sky erupts
    bg(t, 1.2, 540, 1200); cam(540, 1150, lerp(1.05, 1.2, seg(t, a, b)), 0, ...shake(t, w('conquer'), 24));
    sun(540, 1562, 300, 1); floor();
    for (let i = 0; i < 14; i++) { const d = ((i / 14 + (t - a) * 1.6) % 1), y = lerp(1600, 1920, d * d); line(540 - 300 * d, y, 540 + 300 * d, y, 'rgba(255,42,60,.4)', 2 + 4 * d); }
    A(540, 1560, .95, run(t, 17), { wind: 1, glow: 1.6 });
    [[w('conquer'), 540, 820, 1, 1.5], [w('conquer') + .3, 230, 600, 2, 1.1], [w('conquer') + .5, 850, 560, 3, 1.1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 140, life: 1.4 }));
  },
};
const SC = [];
function scenes() {
  const T = [0, w('the'), w('it'), w('it', 6), w('conquering'), w('have'), w('apple'), w('its', 16), w('its', 18.5), w('while'), w('wrapped'), w('they'), w('when'), w('your', 31), w('and', 32), w('you', 34), w('that', 36), w('so'), w('how'), w('and', 42.5), w('stop'), w('stop', 47), w('wake', 49), w('and', 51.5), w('your', 54.5), w('go'), DUR];
  const N = ['hook', 'dream', 'handed', 'battle', 'morning', 'city', 'cook', 'sheep', 'limits', 'asleep', 'cocoon', 'chess', 'silent', 'sharp', 'phoneoff', 'orb', 'forge', 'ask', 'warmbed', 'snooze', 'permission', 'redlight', 'wake', 'world', 'now', 'conquer'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('conquer') - .2, w('conquer') + .4));   // the peak ritual on "conquer"
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
