// "Nobody Is Coming to Save You" — new cut: every line becomes its own literal image. AYAZ, red (kor) only. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 29.0; window.DUR = DUR;
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

// ---------------- extra poses ----------------
const P = {
  flare: { ...POSE.hero, head: -.4, a1: -2.9, a2: -.1 },
  bench: { ...POSE.sitTall, head: .3, a1: -.2, a2: -1.1, f1: -.1, f2: -1.2 },
  benchUp: { ...POSE.sitTall, head: -.35, a1: -.2, a2: -1.1, f1: -.1, f2: -1.2 },
  lookUp: { ...POSE.hero, head: -.45 },
  fear: { ...POSE.hero, lean: -.12, head: .25, a1: -1.2, a2: -1.2, f1: -1.0, f2: -1.4 },
  bound: { ...POSE.stand, head: .45, a1: .05, a2: -.1, f1: .02, f2: -.1 },
  burst: { ...POSE.victory, lean: -.15 },
  hamUp: { ...POSE.hero, lean: -.05, head: .1, a1: -2.7, a2: -.6, f1: -.5, f2: -.6, q1: -.35, k1: .25, q2: .3, k2: .1 },
  hamDn: { ...POSE.hero, lean: .45, head: .35, a1: -.9, a2: -.1, f1: -.6, f2: -.2, q1: -.55, k1: .6, q2: .35, k2: .2, y: 40 },
  punch: { ...POSE.hero, lean: .25, head: 0, a1: -1.57, a2: 0, f1: .4, f2: -1.4, q1: -.5, k1: .3, q2: .4, k2: .1, y: 20 },
  guard: { ...POSE.hero, lean: .1, a1: -.6, a2: -1.9, f1: -.4, f2: -1.9 },
  carryA: { lean: .3, head: .15, a1: -2.6, a2: -1.2, f1: -2.5, f2: -1.25, q1: -.55, k1: .45, q2: .35, k2: .35, y: 15 },
  carryB: { lean: .3, head: .15, a1: -2.6, a2: -1.2, f1: -2.5, f2: -1.25, q1: .25, k1: .5, q2: -.55, k2: .4, y: 15 },
  stepUp: { ...POSE.hero, lean: .2, a1: .4, f1: -.5, q1: -1.0, k1: .9, q2: .3, k2: .2 },
};
const run = t => mixPose(POSE.runA, POSE.runB, .5 + .5 * Math.sin(t * 15));

// ---------------- captions: one huge word at a time, centred, alternating colour ----------------
const KEY = /nobody|save|tomorrow|week|stars|align|harsh|truth|own|alone|terrify|free|life|waiting|grinding|excuses|rescue|hero|heavy|lifting|go|get|it/i;
function captions(t, y = 300) {
  if (t > 27.5) return;
  let i = WD.findIndex((z, j) => t >= z[1] - .02 && (!WD[j + 1] || t < WD[j + 1][1] - .02)); if (i < 0) return;
  const [word, a] = WD[i], k = back(seg(t, a - .02, a + .12)), s = word.toUpperCase().replace(/[^A-Z'!?]/g, '');
  g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W / 2, y); g.scale(k, k); g.rotate((i % 2 ? 1 : -1) * .03);
  g.font = '150px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; const ww = g.measureText(s).width, f = Math.min(1, 940 / ww); g.scale(f, f);
  const hot = KEY.test(s); g.lineWidth = 18; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.strokeText(s, 0, 0);
  g.shadowColor = hot ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.5)'; g.shadowBlur = hot ? 36 : 14; g.fillStyle = hot ? RED : WHITE; g.fillText(s, 0, 0); g.restore();
}

// ---------------- the scenes ----------------
const F = {
  flare(t, a, b) {          // he fires a red distress flare into the sky… nothing answers
    bg(t, .2); const z = lerp(1.25, 1.0, eo(seg(t, a, a + 1.2))); cam(540, 1150, z, -.03);
    line(-400, 1500, 1500, 1500); ground(400, 1500, 1, .4);
    const k = A(400, 1500, 1.0, mixPose(POSE.hero, P.flare, eo(seg(t, a, a + .3))));
    const [hx, hy] = hand(k, 400, 1500, 1.0), u = seg(t, a + .3, a + 1.3), fx = lerp(hx, 700, eo(u)), fy = lerp(hy, 250, eo(u));
    if (u > 0) { for (let i = 0; i < 18; i++) { const q = Math.max(0, u - i * .02); neon(c => { c.arc(lerp(hx, 700, eo(q)), lerp(hy, 250, eo(q)) + i * 4, 4, 0, 7); }, RED, 3, 16, RED, (1 - i / 18) * .7); }
      neon(c => { c.arc(fx, fy, 14 + 6 * Math.sin(t * 30), 0, 7); }, '#ffd0d4', 4, 60, RED, 1 - seg(t, a + 1.6, b)); }
    if (t > a + 1.3) { const fk = 1 - seg(t, a + 1.3, b); g.save(); g.globalAlpha = fk * .5; label('NO ANSWER', 700, 600, 70, GREY, 1); g.restore(); }
  },
  tomorrow(t, a, b) {       // a giant calendar page: TOMORROW — slashed with a red X
    bg(t, .15); cam(540, 960, lerp(1.08, 1.0, seg(t, a, b)), .04, ...shake(t, a + .45, 18));
    neon(c => { c.roundRect(170, 520, 740, 760, 30); }, WHITE, 5, 20, 'rgba(255,255,255,.05)'); neon(c => { c.rect(170, 520, 740, 150); }, RED, 4, 20, 'rgba(255,42,60,.5)');
    for (let i = 0; i < 2; i++) neon(c => { c.arc(330 + i * 420, 520, 20, 0, 7); }, WHITE, 4, 10, '#030305');
    label('TOMORROW', 540, 920, 120, WHITE); const x = eo(seg(t, a + .35, a + .6));
    neon(c => { c.moveTo(220, 720); c.lineTo(lerp(220, 860, x), lerp(720, 1230, x)); if (x > .5) { const y2 = (x - .5) * 2; c.moveTo(860, 720); c.lineTo(lerp(860, 220, y2), lerp(720, 1230, y2)); } }, RED, 22, 40);
    A(840, 1700, .55, P.bench);
  },
  week(t, a, b) {           // pages tear off one after another — days fly by, he is still waiting on the bench
    bg(t, .12); cam(540, 1000, lerp(1.0, 1.12, seg(t, a, b)));
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], p = (t - a) / (b - a) * 7;
    for (let i = 6; i >= 0; i--) { const off = clamp(p - i), x = 540 + off * 900, r = off * 1.2; if (off >= 1) continue;
      g.save(); g.translate(x, 900); g.rotate(r); g.translate(-540, -900); neon(c => { c.roundRect(250, 560, 580, 620, 26); }, WHITE, 4, 14, '#0b0b10'); label(days[i], 540, 870, 150, i === 6 ? RED : WHITE); g.restore(); }
    line(-200, 1520, 1300, 1520); neon(c => { c.rect(330, 1380, 420, 24); c.moveTo(360, 1404); c.lineTo(360, 1520); c.moveTo(720, 1404); c.lineTo(720, 1520); }, GREY, 4, 6);
    A(540, 1520, .62, P.bench);
  },
  stars(t, a, b) {          // the stars line up… and spell NO
    bg(t, .08); cam(540, 900, lerp(1.0, 1.08, seg(t, a, b)));
    const NO = [[200, 380], [200, 520], [200, 660], [270, 450], [340, 560], [410, 380], [410, 520], [410, 660], [610, 380], [680, 360], [760, 380], [790, 520], [760, 660], [680, 680], [610, 660], [580, 520]];
    const al = eio(seg(t, w('align') - .9, w('align') - .1));
    NO.forEach(([x1, y1], i) => { const x0 = hash(i) * 1000 + 40, y0 = 200 + hash(i + 1) * 700, x = lerp(x0, x1 + 40, al), y = lerp(y0, y1, al), tw = .6 + .4 * Math.sin(t * 6 + i);
      neon(c => { c.moveTo(x - 11, y); c.lineTo(x + 11, y); c.moveTo(x, y - 11); c.lineTo(x, y + 11); }, '#ffffff', 3.5, 18 * tw); });
    if (al > .95) { const lk = seg(t, w('align') - .1, w('align') + .3); neon(c => { c.moveTo(240, 660); c.lineTo(240, 380); c.lineTo(450, 660); c.lineTo(450, 380); c.moveTo(720, 360); c.bezierCurveTo(880, 380, 880, 680, 720, 680); c.bezierCurveTo(560, 680, 560, 380, 720, 360); }, RED, 6, 34, null, lk); }
    for (let i = 0; i < 30; i++) neon(c => { c.arc(hash(i + 70) * W, 150 + hash(i + 71) * 900, 1.6, 0, 7); }, '#ffffff', 1.5, 6, '#fff', .5);
    A(540, 1560, .7, P.lookUp); ground(540, 1560, .7, .3);
  },
  search(t, a, b) {         // a rescue searchlight sweeps over him — and moves on
    bg(t, .05); cam(540, 1150, lerp(1.2, 1.05, seg(t, a, b)));
    const ang = lerp(-.7, .9, eio(seg(t, a, b))), sx = 540 + Math.tan(ang) * 1300;
    g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(540, 100, sx, 1500); gr.addColorStop(0, 'rgba(230,240,255,.35)'); gr.addColorStop(1, 'rgba(230,240,255,.05)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(520, 100); g.lineTo(560, 100); g.lineTo(sx + 260, 1520); g.lineTo(sx - 260, 1520); g.fill(); g.restore();
    neon(c => { c.ellipse(540, 100, 60, 26, 0, 0, 7); }, '#dfe6ff', 3, 20, 'rgba(200,210,255,.3)');
    line(-300, 1520, 1400, 1520); A(540, 1520, .9, mixPose(POSE.hero, P.lookUp, ss(seg(t, a, a + .8))));
  },
  island(t, a, b) {         // pull back: one lit rock in an endless void
    bg(t, .1); const z = lerp(1.3, .38, eo(seg(t, a, b))); cam(540, 1250, z, lerp(0, .25, seg(t, a, b)));
    neon(c => { c.moveTo(320, 1520); c.lineTo(760, 1520); c.lineTo(660, 1700); c.lineTo(540, 1780); c.lineTo(420, 1690); c.closePath(); }, '#888896', 4, 10, '#0b0b10');
    ground(540, 1520, 1, 1); A(540, 1520, 1.0, POSE.hero);
    for (let r = 1; r < 7; r++) neon(c => { c.ellipse(540, 1560, r * 260 + (T0 * 160) % 260, (r * 260 + (T0 * 160) % 260) * .22, 0, 0, 7); }, RED, 2, 12, null, .3 / r);
  },
  fear(t, a, b) {           // the dark opens its eyes; he raises his guard
    const k = eo(seg(t, a, a + 1.2)); bg(t, .1); cam(540, 1150, lerp(1.0, 1.15, seg(t, a, b)), 0, ...shake(t, w('terrify'), 24));
    for (let i = 0; i < 2; i++) { const ex = 330 + i * 420, ey = 720, op = eo(seg(t, a + .2 + i * .15, a + .7 + i * .15)), bl = Math.abs(Math.sin(t * 2.3)) > .985 ? .1 : 1;
      neon(c => { c.ellipse(ex, ey, 150, 70 * op * bl, 0, 0, 7); }, '#d8d8e4', 5, 30, 'rgba(255,255,255,.08)'); neon(c => { c.ellipse(ex + Math.sin(t) * 20, ey, 34, 34 * op * bl, 0, 0, 7); }, '#d8d8e4', 4, 20, '#0d0d12'); }
    g.save(); g.globalAlpha = .55 * k; g.fillStyle = '#000'; g.beginPath(); g.ellipse(540, 1250, 900, 500, 0, Math.PI, 0); g.fill(); g.restore();
    line(-300, 1560, 1400, 1560); A(540, 1560, .85, mixPose(POSE.hero, P.fear, eo(seg(t, a + .3, a + .8))));
  },
  chains(t, a, b) {         // wrapped in chains — he flexes and they shatter
    const hit = w('free') - .05, k = eo(seg(t, w('set') - .1, hit)); bg(t, .3 + .7 * seg(t, hit, hit + .3)); cam(540, 1150, lerp(1.35, 1.1, k), 0, ...shake(t, hit, 32));
    shatter(c => { if (t >= hit + .9) return; for (let i = 0; i < 7; i++) { const y = 900 + i * 85, sw = Math.sin(i * 1.7);
      c.save(); c.translate(540, y); c.rotate(.18 * sw); for (let j = -5; j <= 5; j++) { c.beginPath(); c.ellipse(j * 52, 0, 30, 16, 0, 0, 7); c.lineWidth = 9; c.strokeStyle = '#9a9aa6'; c.shadowColor = '#000'; c.shadowBlur = 6; c.stroke(); } c.restore(); } },
      seg(t, hit, hit + .9), 540, 1150, 5);
    A(540, 1560, 1.0, mixPose(P.bound, P.burst, eo(seg(t, hit - .05, hit + .15))), { glow: 1 + seg(t, hit, hit + .3) });
    for (let i = 0; i < 40; i++) { const an = i / 40 * Math.PI * 2, L = 1600 * seg(t, hit, hit + .4); neon(c => { c.moveTo(540 + Math.cos(an) * 90, 1150 + Math.sin(an) * 90); c.lineTo(540 + Math.cos(an) * L, 1150 + Math.sin(an) * L); }, RED, 6, 30, null, .4 * (1 - seg(t, hit + .5, b))); }
    sparks(g, 540, 1150, t - hit, { seed: 5, scale: 1.4, n: 140, life: 1.3 });
  },
  blueprint(t, a, b) {      // the plan draws itself: the life he wants, as a blueprint tower
    bg(t, .12); cam(540, 1000, lerp(.95, 1.08, seg(t, a, b)), -.02);
    g.save(); g.globalAlpha = .18; for (let x = 0; x <= W; x += 60) line(x, 0, x, H, '#ff6070', 1); for (let y = 0; y <= H; y += 60) line(0, y, W, y, '#ff6070', 1); g.restore();
    const p = seg(t, a + .1, b - .2), seg2 = [[[300, 1500], [300, 600]], [[780, 1500], [780, 600]], [[300, 600], [540, 380]], [[540, 380], [780, 600]], ...Array.from({ length: 6 }, (_, i) => [[300, 1500 - i * 150], [780, 1500 - i * 150]]), ...Array.from({ length: 5 }, (_, i) => [[420, 1450 - i * 150], [420, 1350 - i * 150]])];
    seg2.forEach(([[x0, y0], [x1, y1]], i) => { const q = clamp(p * seg2.length - i); if (q <= 0) return; neon(c => { c.moveTo(x0, y0); c.lineTo(lerp(x0, x1, q), lerp(y0, y1, q)); }, RED, 3, 16); });
    label('THE LIFE YOU WANT', 540, 470, 60, WHITE, eo(seg(t, w('life') - .1, w('life') + .2)));
    A(900, 1560, .55, { ...POSE.hero, head: -.2, a1: -1.4, a2: -.2 });
  },
  build(t, a, b) {          // waiting stops: hammer up, hammer down — blocks stack with every blow
    bg(t, .25); const ph = (t - a) / .42, up = (ph % 1) < .55, i = Math.floor(ph); cam(540, 1150, 1.2, 0, ...shake(t, a + (i + .55) * .42, 14, .2));
    const k = A(380, 1520, 1.0, up ? mixPose(P.hamDn, P.hamUp, eo((ph % 1) / .55)) : mixPose(P.hamUp, P.hamDn, eo(((ph % 1) - .55) / .2)));
    const [hx, hy] = hand(k, 380, 1520, 1.0), an = up ? -1.9 : .2; neon(c => { c.moveTo(hx, hy); c.lineTo(hx + Math.cos(an) * 160, hy + Math.sin(an) * 160); }, '#c8c8d2', 8, 10); g.save(); g.translate(hx + Math.cos(an) * 160, hy + Math.sin(an) * 160); g.rotate(an); neon(c => { c.rect(-20, -42, 40, 84); }, '#c8c8d2', 5, 14, '#15151c'); g.restore();
    line(-300, 1520, 1500, 1520); const n = Math.min(9, i + 2);
    for (let j = 0; j < n; j++) { const drop = j === n - 1 ? 1 - eo(seg(t, a + (n - 2) * .42 + .55 * .42, a + (n - 2) * .42 + .7 * .42)) : 0; neon(c => { c.rect(620, 1430 - j * 92 - drop * 200, 260, 88); }, RED, 4, 18, 'rgba(255,42,60,.25)'); }
    sparks(g, 640, 1440 - (n - 1) * 92, t - (a + (i + .7) * .42), { seed: 20 + i, scale: .5, n: 30, life: .5 });
  },
  excuses(t, a, b) {        // excuses float around him in bubbles — he punches through them one by one
    bg(t, .2); cam(540, 1100, lerp(1.05, 1.15, seg(t, a, b)));
    const E = [['TOO TIRED', 270, 700], ['NO TIME', 800, 820], ['MAYBE LATER', 300, 1000], ['NOT TODAY', 790, 1140]];
    E.forEach(([s2, x, y], i) => { const hit = a + .25 + i * .32, u = seg(t, hit, hit + .5), fl = Math.sin(t * 2 + i) * 14;
      if (u <= 0) { neon(c => { c.roundRect(x - 210, y - 70 + fl, 420, 140, 60); }, '#9a9aa6', 4, 10, 'rgba(20,20,26,.9)'); label(s2, x, y + fl, 60, '#b8b8c4'); }
      else { shatter(c => { c.save(); c.fillStyle = 'rgba(20,20,26,.9)'; c.strokeStyle = '#9a9aa6'; c.lineWidth = 4; c.beginPath(); c.roundRect(x - 210, y - 70 + fl, 420, 140, 60); c.fill(); c.stroke(); c.font = '60px Anton'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#b8b8c4'; c.fillText(s2, x, y + fl); c.restore(); }, u, x, y, 40 + i);
        sparks(g, x, y, t - hit, { seed: 40 + i, scale: .6, n: 40, life: .7 }); } });
    const i = clamp(Math.floor((t - a - .1) / .32), 0, 3), tgt = E[i], pp = Math.sin(clamp((t - a - .1) / .32 % 1) * Math.PI);
    A(540, 1560, .8, mixPose(P.guard, P.punch, pp), { flip: tgt[1] < 540 });
    line(-300, 1560, 1400, 1560);
  },
  rescue(t, a, b) {         // a ladder of light comes down — he pushes it away and builds his own steps
    bg(t, .2); cam(560, 1050, lerp(1.0, 1.1, seg(t, a, b)), .03);
    const drop = eo(seg(t, a, a + .45)), gone = seg(t, w('rescue'), w('rescue') + .5);
    g.save(); g.globalAlpha = 1 - gone; for (let i = 0; i < 12; i++) { const y = lerp(-400, 1300, drop) - i * 90; neon(c => { c.moveTo(230, y); c.lineTo(370, y); }, '#fff2d0', 3, 18); } neon(c => { c.moveTo(230, -400); c.lineTo(230, lerp(-400, 1300, drop)); c.moveTo(370, -400); c.lineTo(370, lerp(-400, 1300, drop)); }, '#fff2d0', 3, 22); g.restore();
    const st = Math.floor(seg(t, a + .3, b) * 6); for (let j = 0; j <= st; j++) neon(c => { c.rect(480 + j * 90, 1520 - (j + 1) * 80, 90, (j + 1) * 80); }, RED, 4, 14, 'rgba(255,42,60,.2)');
    line(-300, 1520, 1400, 1520); const j = Math.max(0, st - 1), u = (seg(t, a + .3, b) * 6) % 1;
    A(470 + j * 90 + u * 90, 1520 - j * 80, .75, st < 1 ? mixPose(POSE.hero, POSE.push, eo(seg(t, a + .2, a + .5))) : P.stepUp);
  },
  hero(t, a, b) {           // on top of the tower he built: the hourglass turns, red fireworks
    const k = eo(seg(t, a, a + .5)); bg(t, .5 + .5 * k, 540, 900); cam(540, lerp(1350, 1050, k), lerp(1.25, .95, k));
    for (let j = 0; j < 8; j++) neon(c => { c.rect(380, 1320 + j * 92, 320, 88); }, RED, 4, 16, 'rgba(255,42,60,.18)');
    neon(c => { c.moveTo(540, -400); c.lineTo(540, 1320); }, RED, 110 * k, 110, null, .22 * k);
    ground(540, 1320, 1, k); A(540, 1320, 1.0, mixPose(POSE.hero, POSE.victory, eo(seg(t, w('hero') - .2, w('hero') + .1))), { glow: 1.4 });
    [[w('hero'), 540, 600, 1, 1.4], [w('hero') + .3, 260, 450, 2, 1], [w('hero') + .5, 820, 420, 3, 1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 120, life: 1.4 }));
  },
  carry(t, a, b) {          // the heavy lifting: a giant block on his shoulders, up endless stairs
    bg(t, .3); const sc = (t - a) * 140; cam(560, 880, 1.15, -.14, ...shake(t, w('alone'), 20));
    for (let j = -3; j < 14; j++) { const x = 140 + j * 120 - sc % 120, y = 1650 - j * 70 + (sc % 120) * 70 / 120; neon(c => { c.moveTo(x, y); c.lineTo(x + 120, y); c.lineTo(x + 120, y - 70); }, '#8a8a96', 4, 6); }
    const ph = Math.sin((t - a) * 6), k = A(500, 1300, .85, mixPose(P.carryA, P.carryB, .5 + .5 * ph));
    const [hx, hy] = hand(k, 500, 1300, .85); neon(c => { c.rect(hx - 290, hy - 320, 560, 320); }, '#c8c8d2', 6, 18, '#101016');
    label('YOURS', hx - 10, hy - 160, 130, RED, eo(seg(t, w('yours') - .05, w('yours') + .2)));
  },
  go(t, a, b) {             // GO — GET — IT: he charges at the camera through the screen
    bg(t, 1.0); const z = lerp(.7, 2.6, ei(seg(t, a, b))); cam(540, 1150, z, 0, ...shake(t, w('go'), 30));
    A(540, 1560, 1.0, run(t * 1.4), { glow: 1.6 }); ground(540, 1560, 1, 1);
    g.setTransform(1, 0, 0, 1, 0, 0); const tIt = WD.find(z2 => z2[0].startsWith('it!'))[1];
    [[w('go'), 'GO', 430, WHITE], [w('get'), 'GET', 680, WHITE], [tIt, 'IT.', 930, RED]].forEach(([t0, s2, y, col]) => label(s2, 540, y, 270, col, back(seg(t, t0 - .05, t0 + .2))));
    sparks(g, 540, 930, t - tIt, { seed: 51, scale: 1.4, n: 150, life: 1.5 });
    if (t > b - .25) { g.fillStyle = `rgba(255,42,60,${seg(t, b - .25, b)})`; g.fillRect(0, 0, W, H); }
  },
};
const SC = [];
function scenes() {
  const T = [0, w('not'), w('not', 3), w('and'), w('the', 6), w('entirely'), w('but'), w('let'), w('the', 13), w('you', 17), w('stop', 20), w('stop', 21.5), w('and', 23), w('the', 25), w('now'), DUR];
  const N = ['flare', 'tomorrow', 'week', 'stars', 'search', 'island', 'fear', 'chains', 'blueprint', 'build', 'excuses', 'rescue', 'hero', 'carry', 'go'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('hero') - .3, w('hero') + .3));
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  captions(t);
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
