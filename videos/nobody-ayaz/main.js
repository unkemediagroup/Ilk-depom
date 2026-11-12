// "Nobody Is Coming to Save You" — the Red Neon figure in a black void. 1080×1920, 30 fps, the user's voice only.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround, mixMode } from './neon.js';
// AYAZ: every draw gets the frame time (cape + embers), the current mood colour and the hourglass turn
let MOOD = 'kul', HG = 0;
const drawNeon = (gg, x, y, s, pose, o = {}) => ayaz(gg, x, y, s, pose, { t: window.__t || 0, mode: MOOD, hourglass: HG, ...o });
const ground = (x, y, s, grow = 1) => emberGround(g, x, y, s, grow, { mode: MOOD });
const W = 1080, H = 1920, DUR = 29.0; window.DUR = DUR;
const cv = document.getElementById('c'), g = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return [c, c.getContext('2d')]; };
const [tmp, tg] = mk(), [txc, xg] = mk();
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => clamp((t - a) / (b - a)), lerp = (a, b, u) => a + (b - a) * u;
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); }, eo = x => 1 - Math.pow(1 - clamp(x), 3), ei = x => Math.pow(clamp(x), 3), eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = x => { x = clamp(x); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const RED = '#ff2a3c', GOLD = '#ffb81f', WHITE = '#f6f7fb';
const SHADOW = { rim: '#34343e', hot: '#4a4a55', glow: 'rgba(80,80,100,' };   // the crowd: grey, round, no cape
let WD = [];
const at = w => { const x = WD.find(q => q[0].toLowerCase().replace(/[^a-z]/g, '') === w); return x ? x[1] : 0; };

// ---------------- helpers ----------------
function neon(path, col, w = 4, glow = 22, fill = null, a = 1) {
  g.save(); g.globalAlpha *= a; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); path(g);
  if (fill) { g.fillStyle = fill; g.fill(); }
  g.shadowColor = col; g.shadowBlur = glow; g.strokeStyle = col; g.lineWidth = w; g.stroke();
  g.shadowBlur = 0; g.globalAlpha *= .7; g.strokeStyle = '#fff'; g.lineWidth = Math.max(1, w * .3); g.stroke(); g.restore();
}
function void_(t, glow = .0, cx = W / 2, cy = H * .55) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.shadowBlur = 0; g.fillStyle = '#010102'; g.fillRect(0, 0, W, H);
  if (glow > 0) { const r = g.createRadialGradient(cx, cy, 0, cx, cy, 900); r.addColorStop(0, `rgba(255,20,48,${.28 * glow})`); r.addColorStop(1, 'rgba(255,20,48,0)'); g.fillStyle = r; g.fillRect(0, 0, W, H); }
  for (let i = 0; i < 70; i++) { const x = (hash(i) * W + t * 12 * (1 + hash(i + 9))) % W, y = (hash(i + 3) * H - t * 30 * (.4 + hash(i + 5)) + H * 9) % H; g.fillStyle = `rgba(255,90,110,${.05 + .08 * hash(i + 7)})`; g.fillRect(x, y, 2.5, 2.5); }
}
const cam = (cx, cy, z, rot = 0, sx = 0, sy = 0) => { g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W / 2 + sx, H / 2 + sy); g.rotate(rot); g.scale(z, z); g.translate(-cx, -cy); };
const shake = (t, t0, amp = 22, d = .4) => { const u = seg(t, t0, t0 + d); if (u <= 0 || u >= 1) return [0, 0]; return [Math.sin(t * 91) * amp * (1 - u), Math.cos(t * 77) * amp * (1 - u)]; };
function spot(x, top, bottom, w, a = .5) {   // a cone of light from above onto the floor
  const gr = g.createLinearGradient(0, top, 0, bottom); gr.addColorStop(0, `rgba(255,220,225,${a * .02})`); gr.addColorStop(1, `rgba(255,60,80,${a * .22})`);
  g.fillStyle = gr; g.beginPath(); g.moveTo(x - 40, top); g.lineTo(x + 40, top); g.lineTo(x + w, bottom); g.lineTo(x - w, bottom); g.fill();
  g.save(); g.translate(x, bottom); g.scale(1, .18); const r = g.createRadialGradient(0, 0, 0, 0, 0, w * 1.2); r.addColorStop(0, `rgba(255,40,70,${a * .6})`); r.addColorStop(1, 'rgba(255,40,70,0)'); g.fillStyle = r; g.fillRect(-w * 1.3, -w * 1.3, w * 2.6, w * 2.6); g.restore();
}
function bolt(t0, t, x0, y0, x1, y1, seed, col = '#ffffff') {     // lightning: jagged bolt + screen flash
  const u = t - t0; if (u < 0 || u > .32) return;
  const a = u < .06 ? 1 : u < .12 ? .25 : u < .18 ? .9 : 1 - seg(u, .18, .32);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = `rgba(255,235,240,${.35 * a})`; g.fillRect(0, 0, W, H);
  const pts = [[x0, y0]]; for (let i = 1; i < 14; i++) { const k = i / 14; pts.push([lerp(x0, x1, k) + (hash(seed + i) - .5) * 160, lerp(y0, y1, k)]); } pts.push([x1, y1]);
  neon(c => { pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); }, col === '#ffffff' ? '#ff4060' : col, 6, 50, null, a);
  neon(c => { pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); }, '#ffffff', 2.5, 20, null, a);
  g.restore();
}
// shatter: whatever is drawn by fn into the text layer, broken into shards that fly apart from (cx,cy)
function shatter(fn, u, cx, cy, seed = 1) {
  xg.setTransform(1, 0, 0, 1, 0, 0); xg.clearRect(0, 0, W, H); fn(xg);
  if (u <= 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(txc, 0, 0); g.restore(); return; }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const n = 9, m = 16;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const x0 = i * W / n, y0 = j * H / m, id = i * m + j + seed * 1000, dx = x0 + W / n / 2 - cx, dy = y0 + H / m / 2 - cy, d = Math.hypot(dx, dy) + 1;
    const sp = (500 + hash(id) * 900) * u, rot = (hash(id + 1) - .5) * 6 * u;
    for (let tri = 0; tri < 2; tri++) {
      g.save(); g.globalAlpha = 1 - ei(u);
      g.translate(x0 + dx / d * sp + W / n / 2, y0 + dy / d * sp + H / m / 2 + 400 * u * u); g.rotate(rot + tri); g.translate(-(x0 + W / n / 2), -(y0 + H / m / 2));
      g.beginPath(); if (tri) { g.moveTo(x0, y0); g.lineTo(x0 + W / n, y0); g.lineTo(x0, y0 + H / m); } else { g.moveTo(x0 + W / n, y0); g.lineTo(x0 + W / n, y0 + H / m); g.lineTo(x0, y0 + H / m); }
      g.clip(); g.drawImage(txc, 0, 0); g.restore();
    }
  }
  g.restore();
}
function bigText(c, lines, y, size, cols, glow = true) {
  c.save(); c.font = `${size}px Anton`; c.textAlign = 'center'; c.textBaseline = 'middle';
  lines.forEach((ln, i) => { c.shadowColor = cols[i] === RED ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.6)'; c.shadowBlur = glow ? 40 : 0; c.fillStyle = cols[i]; c.fillText(ln, W / 2, y + i * size * 1.02); });
  c.restore();
}

// ---------------- extra poses for this film ----------------
const P = {
  lookUp: { ...POSE.stand, head: -.45, a1: .15, f1: .1 },
  turn: { ...POSE.stand, head: .25, lean: .06 },
  squat: { lean: .55, head: .05, a1: -.35, a2: -.05, f1: -.3, f2: -.05, q1: -1.35, k1: 1.85, q2: -1.25, k2: 1.75, y: 135 },
  press: { lean: -.06, head: -.25, a1: -3.08, a2: -.04, f1: -3.12, f2: -.02, q1: -.2, k1: .2, q2: .25, k2: .15 },
  clean: { lean: .1, head: -.05, a1: .45, a2: -3.0, f1: .4, f2: -2.95, q1: -.6, k1: .9, q2: -.5, k2: .8, y: 60 },
  climbA: { lean: .35, head: -.25, a1: -2.6, a2: -.2, f1: -.8, f2: -1.0, q1: -1.25, k1: 1.5, q2: .2, k2: .3, y: 0 },
  climbB: { lean: .32, head: -.25, a1: -.8, a2: -1.0, f1: -2.6, f2: -.2, q1: .2, k1: .3, q2: -1.25, k2: 1.5, y: 0 },
};
const runPose = t => mixPose(POSE.runA, POSE.runB, .5 + .5 * Math.sin(t * 15));

// ---------------- captions (word pop, keywords red) ----------------
const KEY = /nobody|save|tomorrow|week|stars|harsh|truth|own|terrify|free|life|waiting|grinding|excuses|rescue|hero|heavy|alone|go|get|it/i;
let CH = [];
function buildCaps() { let cur = []; for (const w of WD) { cur.push(w); if (cur.length >= 3 || /[,.?!]$/.test(w[0])) { CH.push(cur); cur = []; } } if (cur.length) CH.push(cur);
  window.CAPS = CH.map((c, i) => ({ t0: c[0][1], t1: CH[i + 1] ? CH[i + 1][0][1] : DUR, text: c.map(w => w[0]).join(' ') })); }
function captions(t, y = 360) {
  const c = CH.find((c, i) => t >= c[0][1] - .03 && t < (CH[i + 1] ? CH[i + 1][0][1] - .03 : DUR)); if (!c || t > 27.45) return;
  g.setTransform(1, 0, 0, 1, 0, 0); g.font = '900 96px Montserrat'; g.textBaseline = 'middle';
  const words = c.map(w => w[0].toUpperCase()), ws = words.map(w => g.measureText(w).width + 34), total = ws.reduce((a, b) => a + b, 0) - 34;
  const fit = Math.min(1, 980 / total); g.save(); g.translate(W / 2, y); g.scale(fit, fit); g.translate(-W / 2, -y);
  let x = W / 2 - total / 2;
  words.forEach((w, i) => { const k = back(seg(t, c[i][1] - .02, c[i][1] + .15)); const ww = ws[i] - 34;
    if (k > 0) { const hot = KEY.test(w); g.save(); g.translate(x + ww / 2, y); g.scale(k, k); g.textAlign = 'center';
      g.lineWidth = 14; g.strokeStyle = 'rgba(0,0,0,.9)'; g.lineJoin = 'round'; g.strokeText(w, 0, 0);
      g.shadowColor = hot ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.5)'; g.shadowBlur = hot ? 30 : 14; g.fillStyle = hot ? RED : WHITE; g.fillText(w, 0, 0); g.restore(); }
    x += ws[i]; });
  g.restore();
}

// ---------------- scenes (each 1–3 s) ----------------
const SC = [];
function scenes() {
  const T = [0, at('not'), WD.find((w, i) => i > 7 && w[0].toLowerCase().startsWith('not'))[1], at('and'), WD.find(w => w[0] === 'The')[1], at('entirely'), at('but'), at('let'), WD.filter(w => w[0] === 'The')[1][1], WD.find(w => w[0] === 'is' && w[1] > 15)[1], WD.find(w => w[0] === 'you' && w[1] > 17)[1], at('grinding'), WD.find(w => w[0] === 'Stop')[1], WD.find(w => w[0] === 'stop' && w[1] > 21)[1], WD.find(w => w[0] === 'and' && w[1] > 23)[1], WD.filter(w => w[0] === 'The')[2][1], at('now'), DUR];
  const N = ['void', 'tomorrow', 'week', 'stars', 'alone', 'own', 'shadows', 'free', 'kneel', 'rise', 'run', 'grind', 'excuses', 'rescue', 'hero', 'lift', 'go'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
const F = {
  void(t, a, b) {          // alone under one light; a hard zoom in on "save"
    void_(t, .3); const z = lerp(.55, 1.05, eio(seg(t, a, a + 1.4))) * (t > at('save') ? 1.08 : 1); const [sx, sy] = shake(t, at('save'), 16);
    cam(540, 1150, z, 0, sx, sy); spot(540, 200, 1500, 330, .9 * ss(seg(t, a, a + .4)));
    ground(540, 1500, 1.0, seg(t, a, a + 1.2) * .5); drawNeon(g, 540, 1500, 1.0, P.lookUp, { glow: 1.1 });
    bolt(a + .02, t, 300, -100, 520, 900, 3);
  },
  tomorrow(t, a, b) {      // close on the head; a far light in the dark goes out
    void_(t, .15); const z = lerp(2.3, 2.55, seg(t, a, b)); cam(560, 930, z, -.06);
    const off = seg(t, a + .35, a + .45); g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    neon(c => { c.arc(860, 520, 26, 0, 7); }, '#ffe9b0', 4, 60 * (1 - off), `rgba(255,230,170,${1 - off})`, 1 - off * .9); g.restore();
    drawNeon(g, 540, 1500, 1.0, mixPose(P.lookUp, P.turn, ss(seg(t, a, a + .5))), { glow: 1.1 });
  },
  week(t, a, b) {          // dutch angle: sitting with the head in the hands
    void_(t, .2); cam(560, 1300, lerp(1.25, 1.4, seg(t, a, b)), lerp(.2, .14, seg(t, a, b)));
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-500, 1500); g.lineTo(1600, 1500); g.stroke();
    // sitting on the floor, arms around the knees, head sinking onto them (a small breath of motion)
    const sink = ss(seg(t, a, a + .7)), br = Math.sin(t * 3) * .03;
    drawNeon(g, 500, 1500, 1.0, { lean: lerp(.35, .62, sink) + br, head: lerp(.3, .85, sink), a1: -.55, a2: -1.05, f1: -.45, f2: -1.15, q1: -1.05, k1: 2.45, q2: -.95, k2: 2.35, y: 262 }, { glow: .9 });
  },
  stars(t, a, b) {         // stars line up… and shatter
    void_(t, .1); cam(540, 900, lerp(1.0, 1.1, seg(t, a, b)));
    const al = eio(seg(t, at('align') - .5, at('align'))), br = seg(t, at('align') + .3, at('align') + 1.0);
    for (let i = 0; i < 26; i++) { const x0 = hash(i) * 1000 + 40, y0 = 250 + hash(i + 1) * 900, x1 = 120 + i * 33, y1 = 640 + Math.sin(i * .5) * 8;
      let x = lerp(x0, x1, al), y = lerp(y0, y1, al); if (br > 0) { x += (hash(i + 2) - .5) * 900 * br; y += 1200 * br * br; }
      const tw = .6 + .4 * Math.sin(t * 6 + i); neon(c => { c.moveTo(x - 9, y); c.lineTo(x + 9, y); c.moveTo(x, y - 9); c.lineTo(x, y + 9); }, '#ffffff', 3, 18 * tw, null, 1 - br); }
    drawNeon(g, 540, 1620, .62, P.lookUp, { glow: 1 });
    if (br > 0) bolt(at('align') + .3, t, 540, 600, 540, 1300, 9);
  },
  alone(t, a, b) {         // the pull-back: one dot of red in an endless dark, shadows circling
    void_(t, 0); const z = lerp(1.6, .32, eo(seg(t, a, b))); cam(540, 1250, z, lerp(0, .5, seg(t, a, b)));
    for (let i = 0; i < 6; i++) { const ang = i / 6 * Math.PI * 2 + t * .8, r = 900; drawNeon(g, 540 + Math.cos(ang) * r, 1500 + Math.sin(ang) * r * .3, 1.0, POSE.stand, { col: SHADOW, glow: .5, flip: Math.cos(ang) > 0 }); }
    spot(540, 600, 1500, 220, .7); drawNeon(g, 540, 1500, 1.0, POSE.hero, { glow: 1.2 });
  },
  own(t, a, b) {           // top-down spin on the single lit point
    void_(t, .25, 540, 980); cam(540, 980, lerp(1.4, 1.2, seg(t, a, b)), Math.sin(t * 2.2) * .14);
    for (let r = 1; r < 6; r++) neon(c => { c.arc(540, 960, r * 140 + (t * 120) % 140, 0, 7); }, '#ff2338', 2, 16, null, .25 / r);
    drawNeon(g, 540, 1200, .95, { ...POSE.stand, head: .35 }, { glow: 1.1 });
  },
  shadows(t, a, b) {       // giant shadows loom over him, lightning
    void_(t, .1); const [sx, sy] = shake(t, at('terrify'), 26); cam(540, 1250, lerp(1.0, 1.15, seg(t, a, b)), 0, sx, sy);
    const lean = ss(seg(t, a, b));
    [[-140, 3.0, 1], [1220, 3.2, -1], [540, 3.8, 1]].forEach(([x, s, f], i) => drawNeon(g, x + f * lean * 120 * (i === 2 ? 0 : 1), 1560 + (i === 2 ? 900 - 300 * lean : 0), s, { ...POSE.stand, lean: .35 * lean, head: .4, a1: -1.6 * lean, f1: -1.3 * lean }, { col: SHADOW, glow: .7, flip: f < 0 }));
    drawNeon(g, 540, 1560, .8, POSE.kneel, { glow: .9 });
    bolt(at('terrify') - .05, t, 200, -50, 620, 1100, 21); bolt(at('you') > 0 ? WD.find(w => w[0] === 'you,')[1] : a + 1.2, t, 900, -50, 560, 1100, 33);
  },
  free(t, a, b) {          // the core ignites: red light tears the dark, shadows shatter
    const k = eo(seg(t, at('set') - .1, at('set') + .4)); void_(t, .6 + k);
    const [sx, sy] = shake(t, at('free'), 30); cam(540, 1150, lerp(1.25, 1.05, k), 0, sx, sy);
    for (let i = 0; i < 48; i++) { const ang = i / 48 * Math.PI * 2 + hash(i) * .1, L = 2000 * k; neon(c => { c.moveTo(540 + Math.cos(ang) * 80, 1000 + Math.sin(ang) * 80); c.lineTo(540 + Math.cos(ang) * L, 1000 + Math.sin(ang) * L); }, RED, 6 + hash(i + 3) * 10, 40, null, .5 * k); }
    shatter(c => { c.setTransform(1, 0, 0, 1, 0, 0); c.save(); c.translate(-40, 0); [[-160, 3.0], [1240, 3.2]].forEach(([x, s], i) => { const pg = g; c.translate(0, 0); }); c.restore();
      c.fillStyle = '#0a0a10'; c.globalAlpha = .9; c.beginPath(); c.ellipse(120, 900, 260, 900, .1, 0, 7); c.ellipse(980, 900, 260, 900, -.1, 0, 7); c.fill(); }, seg(t, at('free') - .1, at('free') + .9), 540, 1000, 3);
    drawNeon(g, 540, 1460, 1.0, mixPose(POSE.kneel, POSE.victory, eo(seg(t, at('set'), at('set') + .3))), { glow: 1.6 });
    sparks(g, 540, 1000, t - at('free') + .05, { seed: 4, scale: 1.4, n: 140, life: 1.4 });
  },
  kneel(t, a, b) {         // low angle: on one knee, the ember still burning
    void_(t, .35, 540, 1300); cam(560, 1200, lerp(1.6, 1.8, seg(t, a, b)), -.08);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-500, 1500); g.lineTo(1600, 1500); g.stroke();
    drawNeon(g, 540, 1500, 1.0, { ...POSE.kneel, head: lerp(.45, -.1, ss(seg(t, a, b))) }, { glow: 1.2 + .3 * Math.sin(t * 8) });
  },
  rise(t, a, b) {          // stands up — crane up as he rises
    void_(t, .4); const u = eio(seg(t, a + .1, a + 1.2)); cam(540, lerp(1350, 1150, u), lerp(1.4, 1.1, u));
    spot(540, 100, 1500, 300, .8 * u); ground(540, 1500, 1.0, u); drawNeon(g, 540, 1500, 1.0, mixPose(POSE.kneel, { ...POSE.hero, head: -.15 }, u), { glow: 1.3 });
  },
  run(t, a, b) {           // starts running: tracking shot, dark shapes stream past
    void_(t, .2); const u = seg(t, a, b), x = 540 + (t - a) * 60; cam(x + 60, 1150, 1.15);
    for (let i = 0; i < 14; i++) { const px = ((i * 260 - t * 900) % 3600 + 3600) % 3600 - 600 + x - 540; g.fillStyle = '#0b0b12'; g.fillRect(px, 1500 - 300 - hash(i) * 500, 70 + hash(i + 1) * 90, 300 + hash(i) * 500); }
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 1500, 1500); g.lineTo(x + 1500, 1500); g.stroke();
    drawNeon(g, x, 1500, 1.0, mixPose(POSE.walkA, runPose(t), ss(seg(t, a, a + .6))), { glow: 1.2 });
  },
  grind(t, a, b) {         // "grinding": close, fast, speed lines
    void_(t, .45); cam(540, 1150, lerp(1.55, 1.7, seg(t, a, b)), -.05, ...shake(t, a, 14));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 30; i++) { const y = hash(i) * H, x = ((hash(i + 1) * W - t * 2600) % (W + 400) + W + 400) % (W + 400) - 200; neon(c => { c.moveTo(x, y); c.lineTo(x + 260, y); }, i % 3 ? '#ffffff' : RED, 2, 10, null, .35); } g.restore();
    drawNeon(g, 540, 1500, 1.0, runPose(t * 1.3), { glow: 1.4 });
  },
  excuses(t, a, b) {       // runs straight through a wall of EXCUSES — it shatters
    void_(t, .3); const hit = at('excuses') + .25, u = seg(t, hit, hit + .9); cam(540, 1150, lerp(1.0, 1.08, seg(t, a, b)), 0, ...shake(t, hit, 26));
    shatter(c => { c.fillStyle = 'rgba(30,30,40,.95)'; c.fillRect(620, 520, 300, 1120); bigText(c, ['EXCUSES'], 980, 150, ['#8a8a99'], false); }, u, 700, 1050, 7);
    drawNeon(g, lerp(150, 980, seg(t, a, b)), 1500, .95, runPose(t * 1.2), { glow: 1.3 });
  },
  rescue(t, a, b) {        // a rope of light drops… he climbs the cliff himself
    void_(t, .25); cam(560, 1050, lerp(1.0, 1.12, seg(t, a, b)), .04);
    const drop = eo(seg(t, a, a + .45)), fade = seg(t, at('rescue'), at('rescue') + .5);
    neon(c => { c.moveTo(300, -200); c.lineTo(300 + Math.sin(t * 3) * 10, lerp(-200, 1100, drop)); }, '#fff2c8', 5, 40, null, 1 - fade);
    g.fillStyle = '#07070c'; g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(560, 1700); g.lineTo(980, 300); g.lineTo(1400, 300); g.lineTo(1400, 1700); g.closePath(); g.fill(); g.stroke();
    const u = seg(t, a + .2, b), ph = Math.floor((t - a) * 3.3) % 2, x = lerp(560, 760, u), y = lerp(1640, 1000, u);
    drawNeon(g, x - 30, y, .9, ph ? P.climbA : P.climbB, { glow: 1.25 });
  },
  hero(t, a, b) {          // summit: arms up, a pillar of red light, fireworks
    const k = eo(seg(t, a, a + .5)); void_(t, .5 + .5 * k, 540, 1000); cam(540, lerp(1400, 1150, k), lerp(1.3, 1.0, k));
    neon(c => { c.moveTo(540, -400); c.lineTo(540, 1350); }, RED, 120 * k, 120, null, .25 * k);
    g.fillStyle = '#07070c'; g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-300, 1900); g.lineTo(540, 1350); g.lineTo(1380, 1900); g.closePath(); g.fill(); g.stroke();
    ground(540, 1350, 1.0, k); drawNeon(g, 540, 1350, 1.0, mixPose(POSE.hero, POSE.victory, eo(seg(t, at('hero') - .2, at('hero') + .1))), { glow: 1.6 });
    [[at('hero'), 540, 600, 1, 1.4], [at('hero') + .35, 250, 450, 2, 1], [at('hero') + .55, 830, 420, 3, 1]].forEach(([t0, x, y, s, sc]) => sparks(g, x, y, t - t0, { seed: s, scale: sc, n: 120, life: 1.4 }));
  },
  lift(t, a, b) {          // the heavy lifting: squat, then press a huge plate overhead
    void_(t, .35); const strike = at('alone') - .1, [sx, sy] = shake(t, strike, 34, .5);
    cam(540, t > strike ? 1000 : 1200, t > strike ? 1.05 : 1.25, 0, sx, sy);
    let pose; if (t < at('lifting')) pose = P.squat; else if (t < strike) pose = mixPose(P.squat, P.clean, eo(seg(t, at('lifting'), at('lifting') + .45))); else pose = mixPose(P.clean, P.press, eo(seg(t, strike, strike + .12)));
    ground(540, 1500, 1.0, 1); const k = drawNeon(g, 540, 1500, 1.0, pose, { glow: 1.3 });
    const hx = 540 + (k.A1.wr[0] + k.A2.wr[0]) / 2, hy = 1500 + (k.A1.wr[1] + k.A2.wr[1]) / 2;
    neon(c => { c.arc(hx + 18, hy, 100, 0, 7); }, '#e8e8f0', 6, 24, 'rgba(10,10,16,.85)'); neon(c => { c.arc(hx + 18, hy, 26, 0, 7); }, '#e8e8f0', 3.5, 12, '#151520');
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-500, 1502); g.lineTo(1600, 1502); g.stroke();
    if (t > strike) sparks(g, hx, hy, t - strike, { seed: 12, scale: 1.0, n: 90, life: 1.1 });
  },
  go(t, a, b) {            // NOW — GO GET IT: flash, slam, sprint into the light
    const k = eo(seg(t, a, a + .3)); void_(t, 1.2);
    bolt(a - .02, t, 540, -100, 540, 900, 41);
    cam(540, 1150, lerp(.9, 1.15, seg(t, a, b)), 0, ...shake(t, at('go'), 30));
    drawNeon(g, lerp(380, 700, seg(t, a, b)), 1720, .75, runPose(t * 1.4), { glow: 1.7 });
    g.setTransform(1, 0, 0, 1, 0, 0);
    const tIt = WD.find(w => w[0].startsWith('it!'))[1], w1 = back(seg(t, at('go') - .05, at('go') + .2)), w2 = back(seg(t, at('get') - .05, at('get') + .2)), w3 = back(seg(t, tIt - .05, tIt + .2));
    [[w1, 'GO', 430, WHITE], [w2, 'GET', 670, WHITE], [w3, 'IT.', 910, RED]].forEach(([s, txt, y, col]) => { if (s <= 0) return; g.save(); g.translate(540, y); g.scale(s, s); g.font = '260px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = col === RED ? 'rgba(255,30,60,1)' : 'rgba(255,255,255,.7)'; g.shadowBlur = 50; g.fillStyle = col; g.fillText(txt, 0, 0); g.restore(); });
    sparks(g, 540, 900, t - tIt, { seed: 51, scale: 1.4, n: 150, life: 1.5 }); sparks(g, 250, 700, t - at('get'), { seed: 52, scale: 1, n: 90, life: 1.2 });
  },
};
function render(t) {
  window.__t = t;
  const ign = seg(t, at('set') - .1, at('set') + .4), pk = eio(seg(t, at('hero') - .3, at('hero') + .3));
  MOOD = ign < 1 ? mixMode('kul', 'kor', ign) : mixMode('kor', 'altin', pk * (1 - .45 * seg(t, at('lifting'), at('lifting') + .6)));
  HG = pk;
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  captions(t);
  // every cut: a quick whip smear + red flash
  let d = 9, tc = 0; for (const s of SC) if (s[1] > 0 && Math.abs(t - s[1]) < d) { d = Math.abs(t - s[1]); tc = s[1]; }
  if (d < .1) { const u = 1 - d / .1; g.setTransform(1, 0, 0, 1, 0, 0); tg.clearRect(0, 0, W, H); tg.drawImage(cv, 0, 0);
    for (let k = 1; k <= 5; k++) { g.globalAlpha = .2 * u; g.drawImage(tmp, 0, (t < tc ? -1 : 1) * k * 40 * u); }
    g.globalAlpha = .22 * u * u; g.fillStyle = RED; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  g.setTransform(1, 0, 0, 1, 0, 0); const vg = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.7)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
window.render = render; window.TEXTS = () => [];
(async () => {
  WD = await (await fetch('voice/words.json')).json(); scenes(); buildCaps(); window.SC = SC;
  await Promise.all(['900 96px Montserrat', '260px Anton'].map(f => document.fonts.load(f)));
  window.READY = true;
})();
