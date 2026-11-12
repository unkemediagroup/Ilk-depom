// "Your 20s Are Your Foundation" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 29.8; window.DUR = DUR;
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
const KEY = /20s|playground|waste|concrete|foundation|future|night|skills|sacrifice|partying|hard|lesson|compounding|interest|30s|youth|rehearsal|habits|today|circle|discipline|master|now|conquer|dreams|watch|else|build|fiercely/i;
function captions(t, y = 300) {
  if (t > DUR - .9) return;
  let i = WD.findIndex((z, j) => t >= z[1] - .02 && (!WD[j + 1] || t < WD[j + 1][1] - .02)); if (i < 0) return;
  const [word, a] = WD[i], k = back(seg(t, a - .02, a + .12)), s = word.toUpperCase().replace(/[^A-Z0-9'!?]/g, '').replace(/(\d)S$/, '$1s');
  g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W / 2, y); g.scale(k, k); g.rotate((i % 2 ? 1 : -1) * .03);
  g.font = '150px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; const ww = g.measureText(s).width, f = Math.min(1, 940 / ww); g.scale(f, f);
  const hot = KEY.test(s); g.lineWidth = 18; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.strokeText(s, 0, 0);
  g.shadowColor = hot ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.5)'; g.shadowBlur = hot ? 36 : 14; g.fillStyle = hot ? RED : WHITE; g.fillText(s, 0, 0); g.restore();
}

// ---------------- poses ----------------
const P = {
  hamUp: { ...POSE.hero, lean: -.05, head: .1, a1: -2.7, a2: -.6, f1: -.5, f2: -.6, q1: -.35, k1: .25, q2: .3, k2: .1 },
  hamDn: { ...POSE.hero, lean: .45, head: .35, a1: -.9, a2: -.1, f1: -.6, f2: -.2, q1: -.55, k1: .6, q2: .35, k2: .2, y: 40 },
  desk: { ...POSE.sitTall, lean: .35, head: .3, a1: -1.2, a2: -.7, f1: -1.1, f2: -.8 },
  lift: { ...POSE.hero, lean: -.04, head: -.2, a1: -3.05, a2: -.05, f1: -3.1, f2: -.03, q1: -.2, k1: .2, q2: .25, k2: .15 },
  squat: { lean: .55, head: .05, a1: -.35, a2: -.05, f1: -.3, f2: -.05, q1: -1.35, k1: 1.85, q2: -1.25, k2: 1.75, y: 135 },
  hit: { ...POSE.fall || POSE.kneel },
  rip: { ...POSE.hero, lean: -.1, head: -.2, a1: -2.3, a2: -.4, f1: -1.9, f2: -.6 },
  chop: { ...POSE.hero, lean: .5, head: .3, a1: -.7, a2: -.05, f1: -.3, f2: -1.2, q1: -.75, k1: .8, q2: .5, k2: .2, y: 60 },
  chopUp: { ...POSE.hero, lean: -.05, head: -.1, a1: -2.9, a2: -.3, f1: -.4, f2: -1.2, q1: -.45, k1: .3, q2: .4, k2: .1 },
  plant: { ...POSE.hero, lean: .2, head: -.1, a1: -2.1, a2: -.3, f1: -1.9, f2: -.5, q1: -.5, k1: .4, q2: .35, k2: .1 },
  couch: { ...POSE.sitTall, lean: -.35, head: .15, a1: .2, a2: -.6, f1: .1, f2: -.7 },
};
const walk = t => mixPose(POSE.walkA, POSE.walkB, .5 + .5 * Math.sin(t * 7));
const CROWD = { rim: '#34343e', hot: '#4a4a55', glow: 'rgba(80,80,100,' };
const grey = (x, y, s, pose, a = 1) => { g.save(); g.globalAlpha *= a; ayaz(g, x, y, s, pose, { col: CROWD, glow: .5 }); g.restore(); };
function hammer(k, x, y, s, up) { const [hx, hy] = hand(k, x, y, s), an = up ? -1.9 : .2; neon(c => { c.moveTo(hx, hy); c.lineTo(hx + Math.cos(an) * 160 * s, hy + Math.sin(an) * 160 * s); }, '#c8c8d2', 8, 10); g.save(); g.translate(hx + Math.cos(an) * 160 * s, hy + Math.sin(an) * 160 * s); g.rotate(an); g.scale(s, s); neon(c => { c.rect(-20, -42, 40, 84); }, '#c8c8d2', 5, 14, '#15151c'); g.restore(); }

// ---------------- scenes ----------------
const F = {
  playground(t, a, b) {    // a grey playground: the swing creaks… he walks past — it crumbles to dust
    bg(t, .12); cam(540, 1150, lerp(1.15, 1.0, seg(t, a, b)), .03);
    const dust = seg(t, w('waste') - .1, w('waste') + .7);
    shatter(c => { c.save(); c.strokeStyle = '#8a8a96'; c.lineWidth = 7; c.shadowColor = '#000'; c.shadowBlur = 4;
      c.beginPath(); c.moveTo(160, 1560); c.lineTo(300, 900); c.lineTo(440, 1560); c.moveTo(300, 900); c.lineTo(640, 900); c.moveTo(500, 1560); c.lineTo(640, 900); c.lineTo(780, 1560); c.stroke();
      const sw = Math.sin(t * 2.5) * .5; c.translate(470, 900); c.rotate(sw); c.beginPath(); c.moveTo(-40, 0); c.lineTo(-40, 380); c.moveTo(40, 0); c.lineTo(40, 380); c.moveTo(-60, 380); c.lineTo(60, 380); c.stroke(); c.restore();
      c.save(); c.strokeStyle = '#8a8a96'; c.lineWidth = 7; c.beginPath(); c.moveTo(820, 1560); c.lineTo(820, 1150); c.lineTo(900, 1150); c.lineTo(1080, 1560); c.stroke(); c.restore(); }, dust, 500, 1250, 3);
    line(-300, 1560, 1400, 1560); A(lerp(-80, 330, seg(t, a, b)), 1560, .8, walk(t), { wind: .3 });
  },
  foundation(t, a, b) {    // concrete pours into a slab; the future rises out of it as a blueprint tower
    bg(t, .25); const fill = eo(seg(t, a, a + 1.0)), rise = eo(seg(t, w('entire') - .2, b)); cam(540, lerp(1350, 1000, rise), lerp(1.1, .72, rise));
    neon(c => { c.rect(140, 1560, 800, 160); }, '#c8c8d2', 5, 18, `rgba(150,150,165,${.35 * fill})`);
    for (let i = 0; i < 18; i++) { const x = 260 + i * 33 + Math.sin(t * 4 + i) * 6, y0 = 900 + ((t * 700 + i * 40) % 600); if (fill < 1) neon(c => { c.moveTo(x, y0); c.lineTo(x, y0 + 30); }, '#a8a8b4', 6, 6, null, 1 - fill); }
    label('FOUNDATION', 540, 1640, 90, WHITE, back(seg(t, w('foundation') - .05, w('foundation') + .2)));
    const fl = Math.floor(rise * 14); for (let j = 0; j < fl; j++) neon(c => { c.rect(300, 1560 - (j + 1) * 90, 480, 86); }, RED, 3, 14, 'rgba(255,42,60,.08)');
    if (rise > .2) label('FUTURE', 540, 1560 - fl * 90 - 90, 120, RED, back(seg(t, w('future') - .05, w('future') + .2)));
    A(150, 1560, .7, POSE.hero); ground(150, 1560, .7, fill);
  },
  night(t, a, b) {         // 2 AM: one desk lamp, building skills — icons light up one by one
    bg(t, .15); cam(540, 1150, lerp(1.05, 1.18, seg(t, a, b)), -.02);
    neon(c => { c.arc(860, 640, 70, 0, 7); }, '#e8e8f2', 4, 30, 'rgba(230,230,245,.15)'); neon(c => { c.arc(890, 620, 66, 0, 7); }, '#030305', 1, 0, '#030305');
    label('2:00 AM', 300, 640, 90, WHITE, back(seg(t, w('night') - .05, w('night') + .2)));
    neon(c => { c.rect(300, 1300, 600, 30); c.moveTo(330, 1330); c.lineTo(330, 1560); c.moveTo(870, 1330); c.lineTo(870, 1560); c.moveTo(780, 1300); c.lineTo(820, 1150); c.lineTo(880, 1170); }, '#8a8a96', 4, 6);
    g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createRadialGradient(860, 1180, 0, 860, 1180, 420); lg.addColorStop(0, 'rgba(255,60,80,.35)'); lg.addColorStop(1, 'rgba(255,60,80,0)'); g.fillStyle = lg; g.fillRect(400, 800, 900, 800); g.restore();
    A(320, 1560, .8, P.desk); line(-300, 1560, 1400, 1560);
    [['</>', 520], ['BOOK', 700], ['GYM', 880]].forEach(([s2, x], i) => { const k = back(seg(t, a + .5 + i * .45, a + .75 + i * .45)); if (k <= 0) return; g.save(); g.translate(x - 160, 860); g.scale(k, k);
      neon(c => { c.roundRect(-70, -60, 140, 120, 20); }, RED, 4, 22, 'rgba(255,42,60,.15)'); label(s2, 0, 0, s2 === '</>' ? 70 : 44, WHITE); g.restore(); });
  },
  party(t, a, b) {         // split screen: a grey party on the left, he works alone on the right
    bg(t, .15); g.setTransform(1, 0, 0, 1, 0, 0);
    g.save(); g.beginPath(); g.rect(0, 0, W / 2 - 4, H); g.clip(); g.translate(0, 0);
    const disco = t * 2; neon(c => { c.arc(270, 620, 70, 0, 7); }, '#c8c8d2', 4, 20, 'rgba(200,200,215,.12)'); for (let i = 0; i < 10; i++) { const an = disco + i * .63; neon(c => { c.moveTo(270, 620); c.lineTo(270 + Math.cos(an) * 600, 620 + Math.abs(Math.sin(an)) * 900); }, '#9a9aa6', 2, 6, null, .25); }
    for (let i = 0; i < 5; i++) { const bob = Math.abs(Math.sin(t * 7 + i)) * 30; grey(60 + i * 105, 1500 - bob, .45, mixPose(POSE.jump, POSE.victory, .5 + .5 * Math.sin(t * 7 + i)), .9); }
    label('PARTY', 270, 420, 90, GREY); g.restore();
    g.save(); g.beginPath(); g.rect(W / 2 + 4, 0, W / 2, H); g.clip();
    const ph = (t - a) / .5, up = (ph % 1) < .55, k = A(720, 1500, .62, up ? mixPose(P.hamDn, P.hamUp, eo((ph % 1) / .55)) : mixPose(P.hamUp, P.hamDn, eo(((ph % 1) - .55) / .2)));
    hammer(k, 720, 1500, .62, up); for (let j = 0; j < 3 + Math.floor(ph / 2); j++) neon(c => { c.rect(860, 1440 - j * 64, 170, 60); }, RED, 3, 14, 'rgba(255,42,60,.2)');
    label('WORK', 810, 420, 90, RED); line(W / 2, 1500, W, 1500); g.restore();
    neon(c => { c.moveTo(W / 2, 0); c.lineTo(W / 2, H); }, RED, 4, 20);
    line(0, 1500, W / 2, 1500);
  },
  lesson(t, a, b) {        // a hard lesson: a block marked FAIL knocks him down — he swallows it and rises
    bg(t, .2); const hit = a + .35, rise = seg(t, a + .9, b - .05); cam(540, 1150, 1.15, 0, ...shake(t, hit, 30));
    const bx = lerp(1300, 700, eo(seg(t, a, hit))), by = 1300; g.save(); g.globalAlpha = 1 - seg(t, a + .9, a + 1.3);
    neon(c => { c.rect(bx - 150, by - 150, 300, 300); }, '#c8c8d2', 6, 18, '#121218'); label('FAIL', bx, by, 100, GREY, 1); g.restore();
    line(-300, 1560, 1400, 1560);
    const pose = t < hit ? POSE.hero : rise <= 0 ? mixPose(POSE.hero, POSE.kneel, eo(seg(t, hit, hit + .2))) : mixPose(POSE.kneel, POSE.hero, eo(rise));
    A(480, 1560, .9, pose, { glow: 1 + rise }); if (rise > 0) { label('LESSON', 480, 820, 110, RED, back(seg(t, a + .9, a + 1.15)) * (1 - seg(t, b - .3, b))); }
    sparks(g, 600, 1250, t - hit, { seed: 11, scale: .9, n: 60, life: .7 });
  },
  compound(t, a, b) {      // compounding interest: age 20 → 30, the curve goes vertical
    bg(t, .3); const u = seg(t, a + .1, b - .2); cam(lerp(500, 600, u), lerp(1100, 950, u), lerp(1.05, .95, u));
    line(140, 1500, 980, 1500, 'rgba(255,255,255,.5)', 4); line(140, 1500, 140, 400, 'rgba(255,255,255,.5)', 4);
    for (let i = 0; i <= 10; i++) label(String(20 + i), 140 + i * 84, 1560, 40, i === 10 ? RED : GREY);
    neon(c => { for (let i = 0; i <= 100; i++) { const q = i / 100; if (q > u) break; const x = 140 + q * 840, y = 1500 - (Math.pow(q, 3.2) * 1050 + q * 40); i ? c.lineTo(x, y) : c.moveTo(x, y); } }, RED, 8, 34);
    const q = u, ex = 140 + q * 840, ey = 1500 - (Math.pow(q, 3.2) * 1050 + q * 40); neon(c => { c.arc(ex, ey, 14, 0, 7); }, '#fff', 4, 30, RED);
    label('30s', 900, 380, 140, RED, back(seg(t, w('30s') - .05, w('30s') + .2)));
    A(ex - 40, ey + 2, .35, POSE.hero);
  },
  rehearsal(t, a, b) {     // a stage sign says REHEARSAL — he rips it down: ON AIR lights up red
    bg(t, .2); const rip = w('rehearsal') + .1, u = seg(t, rip, rip + .6); cam(540, 1150, lerp(1.0, 1.12, seg(t, a, b)), 0, ...shake(t, rip, 22));
    for (let s2 = -1; s2 <= 1; s2 += 2) neon(c => { const x0 = 540 + s2 * 540; c.moveTo(x0, 200); for (let i = 0; i <= 10; i++) c.lineTo(x0 - s2 * (180 + Math.sin(i + t) * 20), 200 + i * 140); c.lineTo(x0, 1600); }, '#8a1020', 4, 14, 'rgba(120,10,25,.55)');
    line(0, 1560, W, 1560); g.save(); g.translate(540, 700 + u * 900); g.rotate(u * 1.2); g.globalAlpha = 1 - u; neon(c => { c.roundRect(-330, -80, 660, 160, 20); }, '#c8c8d2', 5, 14, '#121218'); label('REHEARSAL', 0, 0, 100, GREY); g.restore();
    if (u > .2) { const k = back(seg(t, rip + .15, rip + .4)); g.save(); g.translate(540, 700); g.scale(k, k); neon(c => { c.roundRect(-260, -90, 520, 180, 30); }, RED, 6, 40, 'rgba(255,42,60,.85)'); label('ON AIR', 0, 0, 120, WHITE); g.restore(); }
    A(480, 1560, .9, t < rip ? mixPose(POSE.hero, P.rip, eo(seg(t, a + .3, rip))) : mixPose(P.rip, POSE.hero, eo(seg(t, rip, rip + .4))));
  },
  habits(t, a, b) {        // the habits: a 30-day tracker fills with red checks, day by day
    bg(t, .2); cam(540, 950, lerp(1.0, 1.08, seg(t, a, b)));
    const n = Math.floor(seg(t, a + .05, b - .1) * 30);
    for (let i = 0; i < 30; i++) { const x = 170 + (i % 6) * 148, y = 520 + Math.floor(i / 6) * 150; neon(c => { c.roundRect(x - 55, y - 55, 110, 110, 18); }, i < n ? RED : '#3a3a44', 3, i < n ? 16 : 0, i < n ? 'rgba(255,42,60,.18)' : null);
      if (i < n) neon(c => { c.moveTo(x - 26, y); c.lineTo(x - 6, y + 22); c.lineTo(x + 30, y - 24); }, '#ffffff', 6, 16); }
    A(540, 1700, .55, POSE.hero); ground(540, 1700, .55, .8);
  },
  circle(t, a, b) {        // the circle you keep: slouching grey figures fade out, the upright ones stay
    bg(t, .25); cam(540, 1250, lerp(.95, 1.08, seg(t, a, b)), Math.sin(t * 1.5) * .04);
    const f = seg(t, w('keep') - .4, w('keep') + .2);
    for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2 + .2, x = 540 + Math.cos(an) * 400, y = 1450 + Math.sin(an) * 110, weak = i % 2 === 0;
      grey(x, y, .55 * (1 + Math.sin(an) * .12), weak ? { ...POSE.stand, head: .6, lean: .25 } : { ...POSE.hero, head: -.1 }, weak ? 1 - f : 1); }
    neon(c => { c.ellipse(540, 1450, 400, 110, 0, 0, 7); }, RED, 4, 24, null, .4 + .6 * f);
    A(540, 1450, .7, POSE.hero); ground(540, 1450, .7, .8);
  },
  discipline(t, a, b) {    // discipline mastered now: he chops through a stack of boards
    bg(t, .3); const hit = w('master') + .05, u = seg(t, hit, hit + .7); cam(540, 1250, lerp(1.25, 1.1, seg(t, a, b)), 0, ...shake(t, hit, 30));
    neon(c => { c.rect(560, 1380, 60, 180); c.rect(900, 1380, 60, 180); }, '#8a8a96', 4, 6, '#101016');
    for (let j = 0; j < 4; j++) { const y = 1350 - j * 34; if (u <= 0) neon(c => { c.rect(540, y, 440, 26); }, '#c8c8d2', 4, 8, '#18181f');
      else for (let h = 0; h < 2; h++) { g.save(); g.translate(760 + (h ? 1 : -1) * (110 + 150 * u), y + 13 + 400 * u * u); g.rotate((h ? 1 : -1) * u * (1 + j * .2)); neon(c => { c.rect(-110, -13, 220, 26); }, '#c8c8d2', 4, 8, '#18181f'); g.restore(); } }
    line(-300, 1560, 1400, 1560); A(420, 1560, .95, t < hit - .15 ? mixPose(POSE.hero, P.chopUp, eo(seg(t, a, hit - .15))) : mixPose(P.chopUp, P.chop, eo(seg(t, hit - .15, hit))));
    label('NOW', 760, 900, 160, RED, back(seg(t, w('now') - .05, w('now') + .2))); sparks(g, 760, 1340, t - hit, { seed: 12, scale: 1.0, n: 90, life: .9 });
  },
  conquer(t, a, b) {       // conquer your dreams: he plants the flag on the summit — the hourglass turns
    const k = eo(seg(t, a, a + .5)); bg(t, .5 + .5 * k, 540, 900); cam(540, lerp(1350, 1100, k), lerp(1.2, .95, k));
    neon(c => { c.moveTo(-200, 1900); c.lineTo(540, 1320); c.lineTo(1280, 1900); }, '#9a9aa6', 4, 10, '#0d0d12');
    const pl = eo(seg(t, w('conquer') - .1, w('conquer') + .25)); neon(c => { c.moveTo(660, 1320); c.lineTo(660, lerp(1320, 980, pl)); c.lineTo(660 + 200 * pl, lerp(1320, 1040, pl)); c.lineTo(660, lerp(1320, 1100, pl)); }, RED, 6, 30, `rgba(255,42,60,${.6 * pl})`);
    if (pl > .5) label('DREAMS', 760, 1040, 54, WHITE, seg(t, w('dreams') - .1, w('dreams') + .1));
    A(500, 1320, .9, mixPose(POSE.hero, P.plant, pl), { glow: 1.4 }); ground(500, 1320, .9, k);
    [[w('conquer') + .2, 540, 600, 1, 1.4], [w('dreams'), 260, 480, 2, 1], [w('dreams') + .2, 820, 460, 3, 1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 120, life: 1.3 }));
  },
  watch(t, a, b) {         // …or watch someone else live them: a grey figure on a couch, someone else's flag on the TV
    bg(t, .06); cam(540, 1150, lerp(1.2, 1.05, seg(t, a, b)));
    neon(c => { c.roundRect(220, 620, 640, 400, 20); c.moveTo(540, 1020); c.lineTo(540, 1080); c.moveTo(420, 1080); c.lineTo(660, 1080); }, '#9a9aa6', 5, 16, 'rgba(160,170,200,.12)');
    g.save(); g.beginPath(); g.rect(230, 630, 620, 380); g.clip(); neon(c => { c.moveTo(240, 1000); c.lineTo(540, 780); c.lineTo(840, 1000); c.moveTo(560, 780); c.lineTo(560, 690); c.lineTo(640, 715); c.lineTo(560, 740); }, '#c8c8d2', 4, 8); grey(500, 785, .2, POSE.victory); g.restore();
    label('SOMEONE ELSE', 540, 1210, 70, GREY, back(seg(t, w('someone') - .05, w('someone') + .2)));
    neon(c => { c.roundRect(240, 1400, 600, 90, 30); c.rect(240, 1490, 600, 70); }, '#55555f', 4, 6, '#0d0d12'); grey(470, 1500, .6, P.couch);
    g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(540, 1020, 540, 1500); lg.addColorStop(0, 'rgba(160,170,210,.18)'); lg.addColorStop(1, 'rgba(160,170,210,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(240, 1020); g.lineTo(840, 1020); g.lineTo(1000, 1500); g.lineTo(80, 1500); g.fill(); g.restore();
  },
  build(t, a, b) {         // BUILD FIERCELY: hammer strike, the tower shoots up behind him
    bg(t, 1.0); const hit = w('build', 27) + .1, u = eo(seg(t, hit, hit + .8)); cam(540, lerp(1250, 1050, u), lerp(1.1, .9, u), 0, ...shake(t, hit, 32));
    for (let j = 0; j < Math.floor(u * 12); j++) neon(c => { c.rect(640, 1560 - (j + 1) * 92, 280, 88); }, RED, 4, 18, 'rgba(255,42,60,.2)');
    line(-300, 1560, 1400, 1560); const up = t < hit, k = A(380, 1560, 1.0, up ? mixPose(P.hamDn, P.hamUp, eo(seg(t, a, hit - .05))) : P.hamDn, { glow: 1.5 }); hammer(k, 380, 1560, 1.0, up); ground(380, 1560, 1, 1);
    label('BUILD', 540, 520, 230, WHITE, back(seg(t, w('build', 27) - .05, w('build', 27) + .2))); label('FIERCELY.', 540, 760, 190, RED, back(seg(t, w('fiercely') - .05, w('fiercely') + .2)));
    sparks(g, 640, 1500, t - hit, { seed: 21, scale: 1.3, n: 140, life: 1.3 }); sparks(g, 780, 500, t - w('fiercely') - .2, { seed: 22, scale: 1, n: 100, life: 1.2 });
  },
};
const SC = [];
function scenes() {
  const T = [0, w('they'), w('every'), w('every', 8), w('and', 11), w('is', 13), w('stop'), w('the', 18.5), w('the', 20), w('and', 21), w('will'), w('or'), w('build', 27), DUR];
  const N = ['playground', 'foundation', 'night', 'party', 'lesson', 'compound', 'rehearsal', 'habits', 'circle', 'discipline', 'conquer', 'watch', 'build'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('conquer') - .1, w('conquer') + .5));     // the peak ritual: the hourglass turns on "conquer"
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  if (n !== 'build') captions(t, 260);
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
