// "One Year Can Change Everything" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 28.1; window.DUR = DUR;
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
const KEY = /one|year|rewrite|reality|lie|transformation|lifetime|cut|excuses|ruthlessly|eliminate|distractions|daily|execution|12|months|different|world|become|waiting|consistency|wasting|time|start|reinvention|today/i;
function captions(t, y = 300) {
  if (t > DUR - .9) return;
  let i = WD.findIndex((z, j) => t >= z[1] - .02 && (!WD[j + 1] || t < WD[j + 1][1] - .02)); if (i < 0) return;
  const [word, a] = WD[i], k = back(seg(t, a - .02, a + .12)), s = word.toUpperCase().replace(/[^A-Z0-9'!?]/g, '').replace(/(\d)S$/, '$1s');
  g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W / 2, y); g.scale(k, k); g.rotate((i % 2 ? 1 : -1) * .03);
  g.font = '150px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; const ww = g.measureText(s).width, f = Math.min(1, 940 / ww); g.scale(f, f);
  const hot = KEY.test(s); g.lineWidth = 18; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.strokeText(s, 0, 0);
  g.shadowColor = hot ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.5)'; g.shadowBlur = hot ? 36 : 14; g.fillStyle = hot ? RED : WHITE; g.fillText(s, 0, 0); g.restore();
}

// ---------------- poses & helpers ----------------
const P = {
  land: { ...POSE.kneel, head: -.05, a1: .5, a2: -.3, f1: -1.2, f2: -.2, y: 130 },
  pen: { ...POSE.hero, lean: .35, head: .2, a1: -1.1, a2: -.4, f1: -1.0, f2: -.5, q1: -.6, k1: .45, q2: .45, k2: .2, y: 25 },
  kick: { ...POSE.hero, lean: -.2, head: -.05, a1: .5, a2: -.4, f1: -.6, f2: -.5, q1: -1.5, k1: .1, q2: .2, k2: .15 },
  bound: { ...POSE.stand, head: .3, a1: .15, a2: -.1, f1: .05, f2: -.1 },
  slash: { ...POSE.hero, lean: .3, head: .1, a1: .9, a2: -.2, f1: -.6, f2: -1.2, q1: -.55, k1: .35, q2: .4, k2: .15, y: 20 },
  slashUp: { ...POSE.hero, lean: -.05, head: -.1, a1: -2.5, a2: -.2, f1: -.4, f2: -1.2, q1: -.3, k1: .2, q2: .3, k2: .1 },
  rope: { ...POSE.hero, head: .05, a1: -.35, a2: -.9, f1: -.25, f2: -.95, q1: -.1, k1: .25, q2: .1, k2: .25 },
  hop: { ...POSE.hero, lean: .2, head: -.05, a1: -.6, a2: -.6, f1: .5, f2: -.5, q1: -.9, k1: 1.1, q2: .2, k2: .9, y: 0 },
  grab: { ...POSE.hero, lean: -.05, head: -.3, a1: -2.6, a2: -.15, f1: -2.4, f2: -.25 },
};
const walk = t => mixPose(POSE.walkA, POSE.walkB, .5 + .5 * Math.sin(t * 7));
const CROWD = { rim: '#34343e', hot: '#4a4a55', glow: 'rgba(80,80,100,' };
const grey = (x, y, s, pose, a = 1) => { g.save(); g.globalAlpha *= a; ayaz(g, x, y, s, pose, { col: CROWD, glow: .5 }); g.restore(); };
const head = (k, x, y, s) => [x + k.head[0] * s, y + k.head[1] * s];

// ---------------- scenes ----------------
const F = {
  hook(t, a, b) {          // HOOK: a slot counter spins through 365 days, slams on 1 YEAR; he lands in front of it — ground cracks
    const hit = w('year') + .02; bg(t, .4 + .6 * seg(t, hit, hit + .2)); cam(540, 1100, lerp(1.25, 1.05, eo(seg(t, a, b))), 0, ...shake(t, hit, 36, .5));
    if (t < .1) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(255,42,60,${.4 * (1 - t / .1)})`; g.fillRect(0, 0, W, H); g.restore(); }
    neon(c => { c.roundRect(170, 560, 740, 420, 40); }, '#d8d8e4', 6, 24, 'rgba(12,12,16,.95)');
    g.save(); g.beginPath(); g.rect(180, 570, 720, 400); g.clip();
    if (t < hit) { const sp = (t - a) * 4200; for (let i = -2; i < 3; i++) { const y = 770 + i * 240 + sp % 240; label(String(365 - ((Math.floor(sp / 240) * 7 + i * 53) % 365)), 540, y, 220, '#9a9aa6'); } }
    else label('1 YEAR', 540, 770, 210, RED, back(seg(t, hit, hit + .2)));
    g.restore();
    const ly = t < hit ? lerp(-300, 1560, ei(seg(t, a, hit))) : 1560;
    A(540, ly, 1.0, t < hit ? POSE.jump : mixPose(P.land, POSE.hero, eo(seg(t, hit + .45, b))), { glow: 1.4 });
    if (t >= hit) { ground(540, 1560, 1.0, 1); const ck = eo(seg(t, hit, hit + .25)); neon(c => { c.moveTo(540, 1562); c.lineTo(540 - 380 * ck, 1590); c.lineTo(540 - 470 * ck, 1570); c.moveTo(540, 1562); c.lineTo(540 + 360 * ck, 1600); c.lineTo(540 + 480 * ck, 1575); }, RED, 5, 24); sparks(g, 540, 1540, t - hit, { seed: 2, scale: 1.2, n: 120, life: .9 }); }
    line(-300, 1562, 1400, 1562);
  },
  pen(t, a, b) {           // a grey, scribbled world; he hauls a giant glowing pen onto his shoulder
    bg(t, .1); cam(540, 1150, lerp(1.1, 1.0, seg(t, a, b)), .02);
    for (let i = 0; i < 9; i++) { const x = 60 + i * 115, hh = 200 + hash(i) * 380; neon(c => { c.rect(x, 1560 - hh, 90, hh); for (let k = 0; k < 6; k++) { c.moveTo(x + 8, 1560 - hh + 20 + k * 40); c.lineTo(x + 82, 1560 - hh + 40 + k * 38); } }, '#4a4a56', 2, 0, 'rgba(14,14,18,.9)'); }
    label('REALITY', 540, 700, 110, GREY);
    const k = A(330, 1560, .95, P.pen), [hx, hy] = hand(k, 330, 1560, .95), an = -.55;
    g.save(); g.translate(hx, hy); g.rotate(an); neon(c => { c.rect(-260, -32, 520, 64); c.moveTo(260, -32); c.lineTo(360, 0); c.lineTo(260, 32); }, RED, 5, 24, 'rgba(255,42,60,.25)'); g.restore();
    line(-300, 1562, 1400, 1562);
  },
  redraw(t, a, b) {        // REWRITE: the pen sweeps across — the grey world is wiped and redrawn in red
    bg(t, .3); const u = eio(seg(t, a + .05, b - .3)), px = lerp(-100, 1180, u); cam(540, 1150, 1.0, 0);
    g.save(); g.beginPath(); g.rect(px, 0, W + 400, H); g.clip();
    for (let i = 0; i < 9; i++) { const x = 60 + i * 115, hh = 200 + hash(i) * 380; neon(c => { c.rect(x, 1560 - hh, 90, hh); }, '#4a4a56', 2, 0, 'rgba(14,14,18,.9)'); } g.restore();
    g.save(); g.beginPath(); g.rect(-400, 0, px + 400, H); g.clip();
    neon(c => { c.moveTo(-100, 1560); c.lineTo(160, 1100); c.lineTo(330, 1300); c.lineTo(560, 820); c.lineTo(780, 1220); c.lineTo(940, 1000); c.lineTo(1200, 1560); }, RED, 5, 26, 'rgba(255,42,60,.1)');
    neon(c => { c.arc(560, 700, 90, 0, 7); }, RED, 5, 30, 'rgba(255,42,60,.2)');
    for (let i = 0; i < 10; i++) { const an = Math.PI + i / 9 * Math.PI; neon(c => { c.moveTo(560 + Math.cos(an) * 120, 700 + Math.sin(an) * 120); c.lineTo(560 + Math.cos(an) * 170, 700 + Math.sin(an) * 170); }, RED, 4, 16); }
    g.restore();
    g.save(); g.translate(px, 1260); g.rotate(-.35); neon(c => { c.rect(-260, -32, 520, 64); c.moveTo(260, -32); c.lineTo(360, 0); c.lineTo(260, 32); }, RED, 5, 30, 'rgba(255,42,60,.35)'); g.restore();
    sparks(g, px + 300, 1140, (t - a) % .3, { seed: Math.floor((t - a) / .3), scale: .5, n: 24, life: .35 });
    line(-300, 1562, 1400, 1562); A(px - 220, 1560, .85, walk(t), { wind: .4 });
  },
  sign(t, a, b) {          // a road sign: TRANSFORMATION → A LIFETIME, the road disappears to the horizon; a red LIE stamp slams on it
    bg(t, .15); cam(540, 1100, lerp(1.0, 1.08, seg(t, a, b)));
    neon(c => { c.moveTo(380, 1920); c.lineTo(530, 900); c.moveTo(700, 1920); c.lineTo(550, 900); }, '#5a5a66', 4, 0);
    for (let i = 0; i < 12; i++) { const d = ((i / 12 + (t - a) * .3) % 1), y = lerp(900, 1920, d * d); line(540 - 4, y, 540 + 4, y + 30 * d, 'rgba(200,200,215,.5)', 2 + 5 * d); }
    neon(c => { c.moveTo(540, 1250); c.lineTo(540, 900); }, '#8a8a96', 8, 4); neon(c => { c.roundRect(170, 520, 740, 360, 20); }, '#c8c8d2', 5, 14, 'rgba(22,22,28,.96)');
    label('TRANSFORMATION', 540, 620, 86, WHITE); label('→ A LIFETIME', 540, 760, 96, '#b8b8c4');
    const sk = back(seg(t, w('lie') - .02, w('lie') + .18)); if (sk > 0) { g.save(); g.translate(560, 690); g.rotate(-.18); g.scale(sk * 1.4 - .4 * Math.min(1, sk), sk * 1.4 - .4 * Math.min(1, sk));
      neon(c => { c.roundRect(-200, -100, 400, 200, 20); }, RED, 10, 30); label('LIE', 0, 6, 170, RED); g.restore(); }
    A(860, 1600, .55, { ...POSE.hero, head: -.2 }); 
  },
  kick(t, a, b) {          // he kicks the sign — it topples into the dark
    bg(t, .2); const hit = a + .45, fall = ei(seg(t, hit, hit + .7)); cam(540, 1180, 1.1, 0, ...shake(t, hit, 26));
    line(-300, 1562, 1400, 1562);
    g.save(); g.translate(700, 1560); g.rotate(fall * 1.35); neon(c => { c.moveTo(0, 0); c.lineTo(0, -350); }, '#8a8a96', 8, 4); neon(c => { c.roundRect(-250, -650, 500, 300, 20); }, '#c8c8d2', 5, 14, 'rgba(22,22,28,.96)'); g.save(); g.translate(0, -500); label('LIFETIME', 0, 0, 90, '#b8b8c4'); g.restore(); g.restore();
    A(430, 1560, .95, t < hit - .15 ? POSE.hero : t < hit ? mixPose(POSE.hero, P.kick, eo(seg(t, hit - .15, hit))) : mixPose(P.kick, POSE.hero, eo(seg(t, hit + .2, hit + .6))));
    sparks(g, 640, 1250, t - hit, { seed: 8, scale: .8, n: 60, life: .7 });
  },
  ropes(t, a, b) {         // EXCUSES: ropes stake him to the ground — one blade stroke cuts them all
    bg(t, .2); const cut = w('excuses') + .1, u = seg(t, cut, cut + .6); cam(540, 1180, lerp(1.2, 1.08, seg(t, a, b)), 0, ...shake(t, cut, 22));
    line(-300, 1562, 1400, 1562);
    const k = A(540, 1560, .95, t < cut - .2 ? P.bound : t < cut ? mixPose(P.bound, P.slashUp, eo(seg(t, cut - .2, cut - .05))) : mixPose(P.slashUp, P.slash, eo(seg(t, cut - .05, cut + .08))));
    [[160, 1560, 470, 1150], [920, 1560, 610, 1150], [250, 1560, 500, 1350], [840, 1560, 590, 1350]].forEach(([x0, y0, x1, y1], i) => { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      if (u <= 0) neon(c => { c.moveTo(x0, y0); c.lineTo(x1, y1); }, '#d8c49a', 9, 12); else { neon(c => { c.moveTo(x0, y0); c.quadraticCurveTo(mx, my + 200 * u, lerp(mx, x0, u * .5), lerp(my, y0, u * .5) + 100 * u); }, '#d8c49a', 9, 12, null, 1 - u * .5); }
      neon(c => { c.moveTo(x0 - 14, y0); c.lineTo(x0, y0 - 40); c.lineTo(x0 + 14, y0); }, '#8a8a96', 4, 4); });
    if (t > cut - .05 && t < cut + .25) neon(c => { c.arc(540, 1350, 330, -2.2, .4); }, '#ffffff', 10, 40, null, 1 - seg(t, cut, cut + .25));
    label('EXCUSES', 540, 760, 120, '#a89878', 1 - u);
  },
  zap(t, a, b) {           // DISTRACTIONS: a phone, a TV, a controller circle him — his visor fires and they burst one by one
    bg(t, .2); cam(540, 1180, 1.05, 0); line(-300, 1562, 1400, 1562);
    const items = [['phone', 830, 860, w('ruthlessly') + .1], ['tv', 250, 760, w('eliminate') + .15], ['pad', 840, 1180, w('distractions') + .1]];
    const tgt = items.find(it => t >= it[3] - .35 && t < it[3] + .2);
    const fl = tgt ? tgt[1] < 540 : false, k = A(540, 1560, .95, { ...POSE.hero, head: tgt ? -.15 : 0 }, { flip: fl }), vx = 540 + (fl ? -1 : 1) * (k.head[0] + 18) * .95, vy = 1560 + (k.head[1] - 5) * .95;
    items.forEach(([kind, x, y, tz]) => { const fx = x + Math.sin(t * 2 + x) * 20, fy = y + Math.cos(t * 2.4 + x) * 16; g.save(); g.translate(fx, fy); g.scale(1.35, 1.35); g.translate(-fx, -fy);
      if (t < tz) { if (kind === 'phone') neon(c => { c.roundRect(fx - 55, fy - 95, 110, 190, 18); }, '#c8c8d2', 4, 12, 'rgba(25,25,32,.95)');
        if (kind === 'tv') neon(c => { c.roundRect(fx - 120, fy - 80, 240, 160, 14); c.moveTo(fx - 40, fy - 120); c.lineTo(fx, fy - 80); c.lineTo(fx + 40, fy - 120); }, '#c8c8d2', 4, 12, 'rgba(25,25,32,.95)');
        if (kind === 'pad') neon(c => { c.ellipse(fx, fy, 120, 60, 0, 0, 7); c.moveTo(fx - 70, fy - 10); c.lineTo(fx - 40, fy - 10); c.moveTo(fx - 55, fy - 25); c.lineTo(fx - 55, fy + 5); }, '#c8c8d2', 4, 12, 'rgba(25,25,32,.95)');
        if (t > tz - .3) neon(c => { c.moveTo(vx, vy); c.lineTo(fx, fy); }, RED, 8, 40, null, seg(t, tz - .3, tz - .2)); }
      else sparks(g, fx, fy, t - tz, { seed: Math.round(x), scale: .8, n: 70, life: .7 }); g.restore(); });
  },
  daily(t, a, b) {         // DAILY EXECUTION: he skips rope, steady rhythm; the day counter races up
    bg(t, .25); cam(540, 1250, lerp(1.25, 1.12, seg(t, a, b))); line(-300, 1562, 1400, 1562);
    const ph = ((t - a) / .38) % 1, air = Math.sin(ph * Math.PI) * 60, k = A(540, 1560 - air, .95, mixPose(P.rope, { ...P.rope, q1: -.3, k1: .6, q2: -.1, k2: .6 }, Math.sin(ph * Math.PI)));
    const [h1x, h1y] = hand(k, 540, 1560 - air, .95), ang = ph * Math.PI * 2, top = 1560 - air - 640, bot = 1575;
    // the rope loops from both hands over the head and under the feet: its far point travels round an ellipse
    const ry = (bot - top) / 2, cy2 = (bot + top) / 2, apx = 540 + Math.sin(ang) * 170, apy = cy2 - Math.cos(ang) * ry, front = Math.cos(ang) < 0 ? 1 : 0;
    neon(c => { c.moveTo(h1x, h1y); c.bezierCurveTo(h1x + (apx - h1x) * 1.3, h1y + (apy - h1y) * 1.3, apx + (apx - 540) * .3, apy + (apy - cy2) * .25, apx, apy); c.bezierCurveTo(apx - (apx - 540) * .3 - 60, apy + (apy - cy2) * .25, h1x - 60 + (apx - h1x) * 1.3, h1y + (apy - h1y) * 1.3, h1x - 30, h1y + 6); }, RED, 5, 24, null, .95);
    const day = Math.min(365, Math.floor(seg(t, a, b) * 365) + 1); label('DAY ' + day, 540, 820, 150, day > 300 ? RED : WHITE);
  },
  orbit(t, a, b) {         // 12 MONTHS: a red planet makes one full lap around a sun, month by month
    bg(t, .2); cam(540, 1000, lerp(.95, 1.05, seg(t, a, b)));
    neon(c => { c.arc(540, 1000, 90, 0, 7); }, '#ffd0d4', 5, 50, 'rgba(255,42,60,.5)'); neon(c => { c.ellipse(540, 1000, 420, 300, 0, 0, 7); }, '#4a4a56', 2, 0);
    const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], u = eio(seg(t, a, b - .1));
    M.forEach((m, i) => { const an = -Math.PI / 2 + i / 12 * Math.PI * 2; label(m, 540 + Math.cos(an) * 520, 1000 + Math.sin(an) * 390, 38, i / 12 <= u ? RED : GREY); });
    const an = -Math.PI / 2 + u * Math.PI * 2; neon(c => { c.arc(540, 1000, 420, -Math.PI / 2, an); }, RED, 6, 26);
    neon(c => { c.arc(540 + Math.cos(an) * 420, 1000 + Math.sin(an) * 300, 40, 0, 7); }, RED, 4, 30, '#1a0508');
    A(540 + Math.cos(an) * 420, 1000 + Math.sin(an) * 300 - 38, .22, POSE.hero);
  },
  world(t, a, b) {         // a completely different world: the grey wasteland flips to a red-lit new land
    const u = eo(seg(t, w('different') - .1, w('world') + .2)); bg(t, .1 + .7 * u, 540, 1200); cam(540, 1150, lerp(1.05, .95, seg(t, a, b)));
    g.save(); g.globalAlpha = 1 - u; neon(c => { c.moveTo(-100, 1560); for (let x = -100; x <= 1200; x += 60) c.lineTo(x, 1500 + hash(x) * 60); c.lineTo(1200, 1560); }, '#4a4a56', 3, 0); for (let i = 0; i < 4; i++) neon(c => { c.moveTo(150 + i * 250, 1560); c.lineTo(150 + i * 250, 1300); c.lineTo(110 + i * 250, 1260); c.moveTo(150 + i * 250, 1380); c.lineTo(190 + i * 250, 1330); }, '#4a4a56', 4, 0); g.restore();
    g.save(); g.globalAlpha = u; neon(c => { c.arc(540, 1250, 220 * u, Math.PI, 0); }, RED, 6, 50, 'rgba(255,42,60,.3)');
    neon(c => { c.moveTo(-100, 1560); c.lineTo(200, 1250); c.lineTo(380, 1400); c.lineTo(600, 1150); c.lineTo(820, 1380); c.lineTo(1200, 1200); c.lineTo(1200, 1560); }, RED, 4, 24, 'rgba(255,42,60,.12)'); g.restore();
    line(-300, 1562, 1400, 1562); A(540, 1560, .9, { ...POSE.hero, head: -.25 }); ground(540, 1560, .9, u);
  },
  future(t, a, b) {        // the person you want to become waits across a chasm — a bigger, blazing version of him
    bg(t, .3); cam(540, 1150, lerp(.95, 1.05, seg(t, a, b)));
    neon(c => { c.moveTo(-200, 1560); c.lineTo(330, 1560); c.lineTo(330, 1920); c.moveTo(1300, 1560); c.lineTo(760, 1560); c.lineTo(760, 1920); }, '#8a8a96', 4, 8, '#0d0d12');
    g.save(); g.filter = 'brightness(1.5)'; A(860, 1560, 1.15, POSE.victory, { glow: 2.2 }); g.filter = 'none'; g.restore();
    label('WHO YOU WANT TO BE', 760, 620, 54, RED, back(seg(t, w('become') - .05, w('become') + .2)));
    A(220, 1560, .8, { ...POSE.hero, head: -.15 });
  },
  stones(t, a, b) {        // CONSISTENCY: a stone appears with every step — he hops across the gap to his future self
    bg(t, .35); const n = 4, hopT = (b - a - .3) / n; cam(lerp(420, 620, seg(t, a, b)), 1150, 1.0);
    neon(c => { c.moveTo(-200, 1560); c.lineTo(330, 1560); c.lineTo(330, 1920); c.moveTo(1300, 1560); c.lineTo(760, 1560); c.lineTo(760, 1920); }, '#8a8a96', 4, 8, '#0d0d12');
    const xs = [250, 410, 520, 630, 760, 800];
    for (let i = 1; i <= n; i++) { const k2 = back(seg(t, a + (i - 1) * hopT - .1, a + (i - 1) * hopT + .1)); if (k2 > 0 && i < 5) { g.save(); g.translate(xs[i], 1575); g.scale(k2, k2); neon(c => { c.ellipse(0, 0, 60, 22, 0, 0, 7); }, RED, 4, 20, 'rgba(255,42,60,.25)'); g.restore(); } }
    label('CONSISTENCY', 545, 1720, 70, RED, back(seg(t, w('consistency') - .05, w('consistency') + .2)));
    g.save(); g.filter = 'brightness(1.5)'; A(900, 1560, 1.05, POSE.victory, { glow: 2.2 }); g.filter = 'none'; g.restore();
    const i = Math.min(n, Math.floor((t - a) / hopT)), f = clamp(((t - a) / hopT) % 1 * 1.25), from = xs[i], to = xs[Math.min(i + 1, xs.length - 1)];
    const done = i >= n, x = done ? xs[n] : lerp(from, to, eio(f)), y = done ? 1560 : 1560 - Math.sin(f * Math.PI) * 120 + (i > 0 && i < 5 ? 0 : 0);
    A(x, y, .8, done ? POSE.hero : f > 0 && f < 1 ? P.hop : POSE.hero);
  },
  clock(t, a, b) {         // STOP WASTING TIME: the hands spin wildly — he grabs the minute hand and stops it dead
    bg(t, .25); const grab = w('time') - .05; cam(540, 1050, 1.05, 0, ...shake(t, grab, 24));
    neon(c => { c.arc(540, 820, 360, 0, 7); }, '#d8d8e4', 6, 24, 'rgba(14,14,18,.95)'); for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; neon(c => { c.moveTo(540 + Math.cos(an) * 320, 820 + Math.sin(an) * 320); c.lineTo(540 + Math.cos(an) * 345, 820 + Math.sin(an) * 345); }, '#d8d8e4', 5, 10); }
    const spin = t < grab ? (t - a) * 30 : (grab - a) * 30; neon(c => { c.moveTo(540, 820); c.lineTo(540 + Math.cos(spin / 12) * 180, 820 + Math.sin(spin / 12) * 180); }, '#d8d8e4', 10, 10);
    neon(c => { c.moveTo(540, 820); c.lineTo(540 + Math.cos(spin) * 300, 820 + Math.sin(spin) * 300); }, t < grab ? '#d8d8e4' : RED, 7, 20);
    A(540, 1560, .95, t < grab ? POSE.hero : P.grab, { glow: 1.2 }); line(-300, 1562, 1400, 1562);
    if (t >= grab) sparks(g, 540 + Math.cos(spin) * 300, 820 + Math.sin(spin) * 300, t - grab, { seed: 31, scale: .8, n: 60, life: .6 });
  },
  start(t, a, b) {         // START TODAY: a great door marked DAY 1 swings open, light floods out — he walks in; the hourglass turns
    const op = eo(seg(t, a + .2, w('reinvention'))), rv = w('reinvention'); bg(t, .4 + .8 * op, 540, 1000); cam(540, 1150, lerp(1.0, 1.25, seg(t, rv, b)), 0, ...shake(t, rv, 14));
    g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(540, 700, 540, 1560); lg.addColorStop(0, `rgba(255,42,60,${.5 * op})`); lg.addColorStop(1, `rgba(255,42,60,${.15 * op})`); g.fillStyle = lg; g.fillRect(340, 560, 400, 1000);
    g.beginPath(); g.moveTo(340, 1560); g.lineTo(740, 1560); g.lineTo(1100, 1920); g.lineTo(-20, 1920); g.fillStyle = `rgba(255,42,60,${.18 * op})`; g.fill(); g.restore();
    neon(c => { c.rect(340, 560, 400, 1000); }, '#d8d8e4', 6, 24);
    g.save(); g.translate(340, 560); g.scale(Math.cos(op * 1.35), 1); neon(c => { c.rect(0, 0, 400, 1000); }, '#c8c8d2', 5, 14, '#121218'); label('DAY 1', 200, 420, 120, RED, Math.cos(op * 1.35) > .2 ? 1 : 0); g.restore();
    line(-300, 1562, 1400, 1562); const wx = lerp(980, 560, seg(t, a + .6, b - .3));
    A(wx, 1560, .9, wx > 570 ? walk(t) : POSE.hero, { flip: true, glow: 1.3 }); ground(wx, 1560, .9, 1);
    sparks(g, 540, 900, t - rv, { seed: 61, scale: 1.3, n: 140, life: 1.3 });
  },
};
const SC = [];
function scenes() {
  const T = [0, w('that'), w('rewrite'), w('stop'), w('takes', 7), w('if'), w('ruthlessly'), w('and', 12.5), w('12'), w('completely', 16.5), w('the', 18.5), w('waiting'), w('stop', 23), w('start'), DUR];
  const N = ['hook', 'pen', 'redraw', 'sign', 'kick', 'ropes', 'zap', 'daily', 'orbit', 'world', 'future', 'stones', 'clock', 'start'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('reinvention') - .2, w('reinvention') + .4));   // the peak ritual on "reinvention"
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  if (n !== 'hook') captions(t, 220);
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
