// "Nobody Is Coming to Save You" — the Red Neon figure in a black void. 1080×1920, 30 fps, the user's voice only.
import { drawNeon as neonFig, skeleton, POSE, mixPose, sparks } from './neon.js';
const W = 1080, H = 1920, DUR = 29.0; window.DUR = DUR;
const cv = document.getElementById('c'), g = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return [c, c.getContext('2d')]; };
const [tmp, tg] = mk(), [txc, xg] = mk();
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => clamp((t - a) / (b - a)), lerp = (a, b, u) => a + (b - a) * u;
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); }, eo = x => 1 - Math.pow(1 - clamp(x), 3), ei = x => Math.pow(clamp(x), 3), eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = x => { x = clamp(x); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const RED = '#ffa21f', GOLD = '#ffd36b', WHITE = '#f4efe6';   // RED now = molten amber (Ash & Fire)
const SHADOW = { rim: '#3a3a48', hot: '#55556a', glow: 'rgba(90,90,120,', body: '#020203' };
let WD = [];
// the forged figure: our character's silhouette as fire-blackened iron, molten gold/amber leaking from its edges and cracks
const FORGE = { rim: '#ff9a1a', hot: '#fff0b8', glow: 'rgba(255,130,15,', body: '#0e0c0b' };
function crackLine(c, p0, p1, seed, jag = 7) { const n = 7; c.moveTo(p0[0], p0[1]); for (let i = 1; i <= n; i++) { const u = i / n, j = i < n ? (Math.sin(seed * 12.9 + i * 7.3) * jag) : 0; const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1; c.lineTo(p0[0] + dx * u - dy / L * j, p0[1] + dy * u + dx / L * j); } }
function drawNeon(gg, x, y, sc, pose, o = {}) {
  if (o.col) return neonFig(gg, x, y, sc, pose, o);                      // shadows and others keep their own look
  const glow = o.glow ?? 1, k = neonFig(gg, x, y, sc, pose, { ...o, col: FORGE, glow: glow * .9 });
  const P = (p, f = .5, q = [0, 0]) => [x + (p[0] + (q[0] - p[0]) * f) * sc, y + (p[1] + (q[1] - p[1]) * f) * sc];
  const pulse = .75 + .25 * Math.sin(performance.now ? (window.__t || 0) * 9 : 0);
  gg.save(); gg.lineCap = 'round'; gg.lineJoin = 'round'; gg.globalCompositeOperation = 'lighter';
  const draw = (fn, w) => { gg.beginPath(); fn(gg); gg.shadowColor = 'rgba(255,150,20,.95)'; gg.shadowBlur = 16 * glow; gg.strokeStyle = `rgba(255,150,30,${.9 * pulse})`; gg.lineWidth = w * sc * 2.2; gg.stroke(); gg.shadowBlur = 0; gg.strokeStyle = 'rgba(255,240,170,.95)'; gg.lineWidth = w * sc * .8; gg.stroke(); };
  // a main fissure up the torso, branching toward the shoulder; molten seams on every limb and the skull
  draw(c => { crackLine(c, P(k.hip, .1, k.shoulder), P(k.hip, .85, k.shoulder), 1, 9); crackLine(c, P(k.hip, .55, k.shoulder), P(k.shoulder, .6, k.A1.el), 2, 6); }, 3.2);
  draw(c => { crackLine(c, P(k.sh, .2, k.A1.el), P(k.A1.el, .7, k.A1.wr), 3, 4); crackLine(c, P(k.hip, .25, k.L1.knee), P(k.L1.knee, .6, k.L1.ank), 4, 5); crackLine(c, P(k.hip, .3, k.L2.knee), P(k.L2.knee, .5, k.L2.ank), 5, 5); }, 2.4);
  draw(c => { const hd = [x + k.head[0] * sc, y + k.head[1] * sc]; crackLine(c, [hd[0] - 18 * sc, hd[1] - 28 * sc], [hd[0] + 10 * sc, hd[1] + 22 * sc], 6, 6); }, 2.2);
  // an inner furnace glow in the chest
  const ch = P(k.hip, .62, k.shoulder), r = gg.createRadialGradient(ch[0], ch[1], 0, ch[0], ch[1], 70 * sc); r.addColorStop(0, `rgba(255,200,80,${.55 * glow})`); r.addColorStop(1, 'rgba(255,120,10,0)');
  gg.fillStyle = r; gg.fillRect(ch[0] - 80 * sc, ch[1] - 80 * sc, 160 * sc, 160 * sc);
  gg.restore(); return k;
}
const at = w => { const x = WD.find(q => q[0].toLowerCase().replace(/[^a-z]/g, '') === w); return x ? x[1] : 0; };

// ---------------- helpers ----------------
function neon(path, col, w = 4, glow = 22, fill = null, a = 1) {
  g.save(); g.globalAlpha *= a; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); path(g);
  if (fill) { g.fillStyle = fill; g.fill(); }
  g.shadowColor = col; g.shadowBlur = glow; g.strokeStyle = col; g.lineWidth = w; g.stroke();
  g.shadowBlur = 0; g.globalAlpha *= .7; g.strokeStyle = '#fff'; g.lineWidth = Math.max(1, w * .3); g.stroke(); g.restore();
}
function void_(t, glow = .0, cx = W / 2, cy = H * .55) {
  window.__t = t; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.shadowBlur = 0;
  const bgr = g.createRadialGradient(W / 2, H * .5, 80, W / 2, H * .5, H * .8); bgr.addColorStop(0, '#1b1a19'); bgr.addColorStop(1, '#070707'); g.fillStyle = bgr; g.fillRect(0, 0, W, H);
  if (glow > 0) { const r = g.createRadialGradient(cx, cy, 0, cx, cy, 900); r.addColorStop(0, `rgba(255,120,15,${.24 * glow})`); r.addColorStop(1, 'rgba(255,120,15,0)'); g.fillStyle = r; g.fillRect(0, 0, W, H); }
  for (let i = 0; i < 90; i++) { const x = (hash(i) * W + t * 14 * (1 + hash(i + 9)) + Math.sin(t + i) * 20) % W, y = (hash(i + 3) * H + t * 26 * (.4 + hash(i + 5)) + H * 9) % H; g.fillStyle = `rgba(170,165,158,${.06 + .1 * hash(i + 7)})`; g.save(); g.translate(x, y); g.rotate(t + i); g.fillRect(-3, -1.5, 6, 3); g.restore(); }
  for (let i = 0; i < 26; i++) { const x = (hash(i + 50) * W + Math.sin(t * 1.3 + i) * 30) % W, y = (hash(i + 53) * H - t * 120 * (.5 + hash(i + 55)) + H * 9) % H; g.fillStyle = `rgba(255,${150 + 80 * hash(i + 57) | 0},40,${.35 + .4 * hash(i + 58)})`; g.shadowColor = 'rgba(255,140,20,.9)'; g.shadowBlur = 8; g.fillRect(x, y, 3, 3); } g.shadowBlur = 0;
}
const cam = (cx, cy, z, rot = 0, sx = 0, sy = 0) => { g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W / 2 + sx, H / 2 + sy); g.rotate(rot); g.scale(z, z); g.translate(-cx, -cy); };
const shake = (t, t0, amp = 22, d = .4) => { const u = seg(t, t0, t0 + d); if (u <= 0 || u >= 1) return [0, 0]; return [Math.sin(t * 91) * amp * (1 - u), Math.cos(t * 77) * amp * (1 - u)]; };
function spot(x, top, bottom, w, a = .5) {   // a cone of light from above onto the floor
  const gr = g.createLinearGradient(0, top, 0, bottom); gr.addColorStop(0, `rgba(255,235,200,${a * .02})`); gr.addColorStop(1, `rgba(255,150,40,${a * .22})`);
  g.fillStyle = gr; g.beginPath(); g.moveTo(x - 40, top); g.lineTo(x + 40, top); g.lineTo(x + w, bottom); g.lineTo(x - w, bottom); g.fill();
  g.save(); g.translate(x, bottom); g.scale(1, .18); const r = g.createRadialGradient(0, 0, 0, 0, 0, w * 1.2); r.addColorStop(0, `rgba(255,140,25,${a * .6})`); r.addColorStop(1, 'rgba(255,140,25,0)'); g.fillStyle = r; g.fillRect(-w * 1.3, -w * 1.3, w * 2.6, w * 2.6); g.restore();
}
function bolt(t0, t, x0, y0, x1, y1, seed, col = '#ffffff') {     // lightning: jagged bolt + screen flash
  const u = t - t0; if (u < 0 || u > .32) return;
  const a = u < .06 ? 1 : u < .12 ? .25 : u < .18 ? .9 : 1 - seg(u, .18, .32);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = `rgba(255,236,205,${.35 * a})`; g.fillRect(0, 0, W, H);
  const pts = [[x0, y0]]; for (let i = 1; i < 14; i++) { const k = i / 14; pts.push([lerp(x0, x1, k) + (hash(seed + i) - .5) * 160, lerp(y0, y1, k)]); } pts.push([x1, y1]);
  neon(c => { pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); }, col === '#ffffff' ? '#ffb040' : col, 6, 50, null, a);
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
  lines.forEach((ln, i) => { c.shadowColor = cols[i] === RED ? 'rgba(255,150,25,1)' : 'rgba(255,255,255,.6)'; c.shadowBlur = glow ? 40 : 0; c.fillStyle = cols[i]; c.fillText(ln, W / 2, y + i * size * 1.02); });
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
      g.shadowColor = hot ? 'rgba(255,150,25,1)' : 'rgba(255,255,255,.5)'; g.shadowBlur = hot ? 30 : 14; g.fillStyle = hot ? RED : WHITE; g.fillText(w, 0, 0); g.restore(); }
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
    drawNeon(g, 540, 1500, 1.0, P.lookUp, { glow: 1.1 });
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
    spot(540, 600, 1500, 220, .7); drawNeon(g, 540, 1500, 1.0, POSE.stand, { glow: 1.2 });
  },
  own(t, a, b) {           // top-down spin on the single lit point
    void_(t, .25, 540, 980); cam(540, 980, lerp(1.4, 1.2, seg(t, a, b)), Math.sin(t * 2.2) * .14);
    for (let r = 1; r < 6; r++) neon(c => { c.arc(540, 960, r * 140 + (t * 120) % 140, 0, 7); }, '#ffa21f', 2, 16, null, .25 / r);
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
    spot(540, 100, 1500, 300, .8 * u); drawNeon(g, 540, 1500, 1.0, mixPose(POSE.kneel, { ...POSE.stand, head: -.15 }, u), { glow: 1.3 });
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
    drawNeon(g, 540, 1350, 1.0, mixPose(POSE.stand, POSE.victory, eo(seg(t, at('hero') - .2, at('hero') + .1))), { glow: 1.6 });
    [[at('hero'), 540, 600, 1, 1.4], [at('hero') + .35, 250, 450, 2, 1], [at('hero') + .55, 830, 420, 3, 1]].forEach(([t0, x, y, s, sc]) => sparks(g, x, y, t - t0, { seed: s, scale: sc, n: 120, life: 1.4 }));
  },
  lift(t, a, b) {          // the heavy lifting: squat, then press a huge plate overhead
    void_(t, .35); const strike = at('alone') - .1, [sx, sy] = shake(t, strike, 34, .5);
    cam(540, t > strike ? 1000 : 1200, t > strike ? 1.05 : 1.25, 0, sx, sy);
    let pose; if (t < at('lifting')) pose = P.squat; else if (t < strike) pose = mixPose(P.squat, P.clean, eo(seg(t, at('lifting'), at('lifting') + .45))); else pose = mixPose(P.clean, P.press, eo(seg(t, strike, strike + .12)));
    const k = drawNeon(g, 540, 1500, 1.0, pose, { glow: 1.3 });
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
    [[w1, 'GO', 430, WHITE], [w2, 'GET', 670, WHITE], [w3, 'IT.', 910, RED]].forEach(([s, txt, y, col]) => { if (s <= 0) return; g.save(); g.translate(540, y); g.scale(s, s); g.font = '260px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = col === RED ? 'rgba(255,150,25,1)' : 'rgba(255,255,255,.7)'; g.shadowBlur = 50; g.fillStyle = col; g.fillText(txt, 0, 0); g.restore(); });
    sparks(g, 540, 900, t - tIt, { seed: 51, scale: 1.4, n: 150, life: 1.5 }); sparks(g, 250, 700, t - at('get'), { seed: 52, scale: 1, n: 90, life: 1.2 });
  },
};
function render(t) {
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  captions(t);
  // every cut: a quick whip smear + red flash
  let d = 9, tc = 0; for (const s of SC) if (s[1] > 0 && Math.abs(t - s[1]) < d) { d = Math.abs(t - s[1]); tc = s[1]; }
  if (d < .1) { const u = 1 - d / .1; g.setTransform(1, 0, 0, 1, 0, 0); tg.clearRect(0, 0, W, H); tg.drawImage(cv, 0, 0);
    for (let k = 1; k <= 5; k++) { g.globalAlpha = .2 * u; g.drawImage(tmp, 0, (t < tc ? -1 : 1) * k * 40 * u); }
    g.globalAlpha = .22 * u * u; g.fillStyle = '#ff8a10'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  g.setTransform(1, 0, 0, 1, 0, 0); const vg = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.7)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
window.render = render; window.TEXTS = () => [];
(async () => {
  WD = await (await fetch('voice/words.json')).json(); scenesCrowd(); buildCaps(); window.SC = SC;
  await Promise.all(['900 96px Montserrat', '260px Anton'].map(f => document.fonts.load(f)));
  window.READY = true;
})();

// ===================== "Shadow Crowd": the crowd stands still, the forged figure breaks through =====================
const CROWD = { rim: '#34343c', hot: '#4a4a54', glow: 'rgba(60,60,72,', body: '#0a0a0c' };
const BOW = { ...POSE.stand, head: .62, lean: .12, a1: .06, f1: -.02 };
// crowd members: rows in depth (back rows smaller and higher), deterministic
const MEM = []; for (let r = 4; r >= 0; r--) for (let i = 0; i < 30; i++) { const x = -1500 + i * 150 + (r % 2) * 75 + (hash(i * 7 + r) - .5) * 40; MEM.push({ x, r, y: 1500 - r * 75, s: 1 - r * .13, id: i * 10 + r }); }
// fall(x) → topple angle for a member at x; push(x,y) → lean away from a blast point
function crowd(o = {}) {
  for (const m of MEM) {
    if (o.skip && Math.abs(m.x - o.skip) < 70 && m.r === 1) continue;
    let ang = 0; if (o.fall) ang = o.fall(m); if (o.push) ang += o.push(m);
    if (o.cullX && (m.x < o.cullX[0] || m.x > o.cullX[1])) continue;
    g.save(); g.translate(m.x, m.y); g.rotate(ang); neonFig(g, 0, 0, m.s * .9, { ...BOW, head: BOW.head + (hash(m.id) - .5) * .2 }, { col: CROWD, glow: m.r < 2 ? .35 : 0 }); g.restore();
  }
}
// the hero: a dull shadow like the rest, then the molten version burns through (ign 0..1)
function hero(x, y, sc, pose, ign) {
  if (ign < 1) neonFig(g, x, y, sc, pose, { col: CROWD, glow: .35 });
  if (ign <= 0) return null;
  g.save(); g.globalAlpha = ign; const k = drawNeon(g, x, y, sc, pose, { glow: .4 + ign }); g.restore(); return k;
}
const HX = 540, HY = 1425, HS = .9 * (1 - .13);   // the hero stands in row 1
const fallBy = (rx, dir = 1) => m => m.r <= 2 && rx > m.x - 40 ? (hash(m.id + 5) < .3 ? -1 : 1) * dir * (.55 + .5 * hash(m.id + 3)) * eo(clamp((rx - m.x + 40) / 300)) : 0;   // knocked aside, staggered
const C2 = {
  c1(t, a, b) { void_(t, .1); cam(540, 1250, lerp(.5, .72, eo(seg(t, a, b)))); crowd({ skip: HX }); hero(HX, HY, HS, BOW, 0); bolt(a + .02, t, 200, -100, 600, 900, 3); },
  c2(t, a, b) { void_(t, .15, 540, 1100); const [sx, sy] = shake(t, a, 20); cam(560, 1100, lerp(1.0, 1.9, eio(seg(t, a, a + .5))), -.04, sx, sy); crowd({ skip: HX, cullX: [-200, 1300] }); hero(HX, HY, HS, BOW, .08); },
  c3(t, a, b) { void_(t, .1); cam(lerp(1500, 200, eio(seg(t, a, b))), 1200, 1.35, .05); crowd({ skip: HX }); hero(HX, HY, HS, BOW, .08); },
  c4(t, a, b) { void_(t, .1); cam(560, 1080, lerp(1.45, 1.6, seg(t, a, b)), -.09); crowd({ skip: HX, cullX: [-300, 1400] }); hero(HX, HY, HS, BOW, .1); bolt(a + .02, t, 760, -100, 560, 900, 13); },
  c5(t, a, b) { void_(t, .05); cam(540, 1000, lerp(.8, .9, seg(t, a, b)));
    const al = eio(seg(t, at('align') - .5, at('align')));
    for (let i = 0; i < 26; i++) { const x0 = hash(i) * 1000 + 40, y0 = 150 + hash(i + 1) * 650, x1 = 120 + i * 33, y1 = 420 + Math.sin(i * .5) * 8, x = lerp(x0, x1, al), y = lerp(y0, y1, al);
      neon(c => { c.moveTo(x - 9, y); c.lineTo(x + 9, y); c.moveTo(x, y - 9); c.lineTo(x, y + 9); }, '#ffffff', 3, 16 * (.6 + .4 * Math.sin(t * 6 + i))); }
    crowd({ skip: HX }); hero(HX, HY, HS, BOW, .1); },
  c6(t, a, b) { void_(t, .1); const br = seg(t, a + .05, a + .8); cam(540, 1050, lerp(.9, 1.05, seg(t, a, b)), 0, ...shake(t, a + .05, 18));
    for (let i = 0; i < 26; i++) { const x = 120 + i * 33 + (hash(i + 2) - .5) * 900 * br, y = 420 + 1200 * br * br; neon(c => { c.moveTo(x - 9, y); c.lineTo(x + 9, y); c.moveTo(x, y - 9); c.lineTo(x, y + 9); }, '#ffffff', 3, 16, null, 1 - br); }
    crowd({ skip: HX }); hero(HX, HY, HS, BOW, .1); bolt(a + .05, t, 540, 300, 540, 1250, 9); },
  c7(t, a, b) {   // from above: a sea of bowed heads, one faint ember in the middle
    void_(t, .05); cam(540, 960, lerp(1.0, 1.25, seg(t, a, b)), lerp(-.2, .1, seg(t, a, b)));
    for (let r = -9; r <= 9; r++) for (let c = -6; c <= 6; c++) { const x = 540 + c * 150 + (r % 2) * 75, y = 960 + r * 150; if (r === 0 && c === 0) continue;
      neon(cc => { cc.ellipse(x, y, 44, 44, 0, 0, 7); }, '#33333b', 3, 0, '#0b0b0d'); neon(cc => { cc.ellipse(x, y + 52, 70, 26, 0, 0, 7); }, '#2a2a31', 3, 0, '#0b0b0d'); }
    const pul = .25 + .15 * Math.sin(t * 6); neon(cc => { cc.ellipse(540, 960, 44, 44, 0, 0, 7); }, RED, 4, 30 * pul, '#120b06', .5 + pul); },
  c8(t, a, b) { void_(t, .05); cam(540, 1300, lerp(1.1, .3, eo(seg(t, a, b))), lerp(0, .08, seg(t, a, b))); crowd({ skip: HX }); hero(HX, HY, HS, BOW, .15); },
  c9(t, a, b) {   // he sinks to one knee… and the first cracks start to glow
    void_(t, .25 * seg(t, a, b), 540, 1250); const ign = ss(seg(t, a + .6, b)) * .55; cam(560, 1180, lerp(1.6, 1.8, seg(t, a, b)), .03, ...shake(t, at('terrify'), 16));
    crowd({ skip: HX, cullX: [-200, 1300] }); hero(HX, HY, HS, mixPose(BOW, POSE.kneel, eo(seg(t, a, a + .5))), ign);
    bolt(at('terrify') - .04, t, 300, -100, 540, 1000, 21); },
  c10(t, a, b) {  // set free: the furnace bursts, the shadows around him are blown back
    const k = eo(seg(t, at('set') - .1, at('set') + .35)); void_(t, .6 + k); const [sx, sy] = shake(t, at('free'), 30); cam(540, 1150, lerp(1.35, 1.0, k), 0, sx, sy);
    for (let i = 0; i < 48; i++) { const ang = i / 48 * Math.PI * 2, L = 2000 * k; neon(c => { c.moveTo(HX + Math.cos(ang) * 80, 1150 + Math.sin(ang) * 80); c.lineTo(HX + Math.cos(ang) * L, 1150 + Math.sin(ang) * L); }, RED, 6 + hash(i + 3) * 10, 40, null, .45 * k); }
    crowd({ skip: HX, push: m => { const d = m.x - HX; return Math.sign(d) * k * .5 * Math.max(0, 1 - Math.abs(d) / 700); } });
    hero(HX, HY, HS, mixPose(POSE.kneel, POSE.victory, eo(seg(t, at('set'), at('set') + .3))), .55 + .45 * k);
    sparks(g, HX, 1150, t - at('free') + .05, { seed: 4, scale: 1.4, n: 140, life: 1.4 }); },
  c11(t, a, b) {  // side angle: he alone lifts his head, the crowd stays bowed
    void_(t, .35, 540, 1250); cam(lerp(420, 640, seg(t, a, b)), 1150, 1.55, -.05); crowd({ skip: HX, cullX: [-300, 1400] }); hero(HX, HY, HS, { ...POSE.stand, head: lerp(.5, -.2, ss(seg(t, a, a + .8))) }, 1); },
  c12(t, a, b) {  // low angle crane: standing tall, burning, above the bowed heads
    void_(t, .5, 540, 1100); const u = eio(seg(t, a, a + .8)); cam(540, lerp(1380, 1180, u), lerp(1.45, 1.15, u), .04);
    spot(HX, 0, HY, 260, .9 * u); crowd({ skip: HX, cullX: [-300, 1400] }); hero(HX, HY - 20 * u, HS * 1.06, { ...POSE.stand, head: -.15, lean: -.04 }, 1); },
  c13(t, a, b) {  // he breaks into a run straight through the crowd — they topple in his wake
    void_(t, .35); const rx = HX + (t - a) * 520; cam(rx + 120, 1200, 1.15, 0); crowd({ skip: HX, fall: fallBy(rx) });
    hero(rx, HY, HS, mixPose(POSE.walkA, runPose(t), ss(seg(t, a, a + .4))), 1); },
  c14(t, a, b) {  // closer, faster: sparks trail, bodies go down
    void_(t, .45); const rx = HX + (t - SC.find(s => s[0] === 'c13')[1]) * 560; cam(rx + 80, 1250, 1.6, -.05, ...shake(t, a, 12)); crowd({ skip: HX, fall: fallBy(rx) });
    hero(rx, HY, HS, runPose(t * 1.3), 1); for (let i = 0; i < 6; i++) sparks(g, rx - 40, HY - 300, t - a - i * .2, { seed: 70 + i, scale: .5, n: 30, life: .7 }); },
  c15(t, a, b) {  // a wall of shadows — he shoulders through and it shatters
    void_(t, .4); const hit = at('excuses') + .2, u = seg(t, hit, hit + .9); cam(540, 1150, lerp(1.0, 1.1, seg(t, a, b)), 0, ...shake(t, hit, 30));
    shatter(c => { c.save(); for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) neonFig(c, 640 + i * 70 + r * 30, 1500 - r * 40, .8, { ...BOW, head: .5 + .1 * Math.sin(i + r) }, { col: CROWD, glow: .3 }); c.restore(); }, u, 700, 1150, 7);
    hero(lerp(120, 960, seg(t, a, b)), 1500, .95, runPose(t * 1.3), 1);
    if (u > 0) sparks(g, 700, 1150, t - hit, { seed: 15, scale: 1.1, n: 110, life: 1.1 }); },
  c16(t, a, b) {  // he climbs alone; the crowd far below never moves
    void_(t, .25); cam(560, 1050, lerp(1.0, 1.12, seg(t, a, b)), .04);
    g.save(); g.translate(0, 330); g.scale(.45, .45); g.translate(-200, 1300); crowd(); g.restore();
    const drop = eo(seg(t, a, a + .45)), fade = seg(t, at('rescue'), at('rescue') + .5); neon(c => { c.moveTo(300, -200); c.lineTo(300 + Math.sin(t * 3) * 10, lerp(-200, 1100, drop)); }, '#fff2c8', 5, 40, null, 1 - fade);
    g.fillStyle = '#0d0c0b'; g.strokeStyle = 'rgba(255,200,140,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(560, 1700); g.lineTo(980, 300); g.lineTo(1400, 300); g.lineTo(1400, 1700); g.closePath(); g.fill(); g.stroke();
    const u = seg(t, a + .2, b), ph = Math.floor((t - a) * 3.3) % 2; hero(lerp(530, 730, u), lerp(1640, 1000, u), .9, ph ? P.climbA : P.climbB, 1); },
  c17(t, a, b) {  // the lonely summit above a dark sea of bowed heads
    const k = eo(seg(t, a, a + .5)); void_(t, .5 + .5 * k, 540, 1000); cam(540, lerp(1400, 1150, k), lerp(1.3, 1.0, k));
    neon(c => { c.moveTo(540, -400); c.lineTo(540, 1350); }, RED, 120 * k, 120, null, .25 * k);
    g.save(); g.translate(0, 420); g.scale(.5, .5); g.translate(540, 1500); crowd(); g.restore();
    g.fillStyle = '#0d0c0b'; g.strokeStyle = 'rgba(255,200,140,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(140, 2100); g.lineTo(540, 1350); g.lineTo(940, 2100); g.closePath(); g.fill(); g.stroke();
    hero(540, 1350, 1.0, mixPose(POSE.stand, POSE.victory, eo(seg(t, at('hero') - .2, at('hero') + .1))), 1);
    [[at('hero'), 540, 600, 1, 1.4], [at('hero') + .35, 250, 450, 2, 1], [at('hero') + .55, 830, 420, 3, 1]].forEach(([t0, x, y, s2, sc]) => sparks(g, x, y, t - t0, { seed: s2, scale: sc, n: 120, life: 1.4 })); },
};
function scenesCrowd() {
  const w = (q, after = -1) => WD.find(x => x[0].toLowerCase().replace(/[^a-z]/g, '') === q && x[1] > after)[1];
  const T = [0, w('save'), w('not'), w('not', 3), w('and'), w('align'), w('the', 6), w('entirely'), w('but'), w('let'), w('the', 13), w('is', 15), w('you', 17), w('grinding'), w('stop', 20), w('stop', 21.5), w('and', 23), w('the', 25), w('now'), DUR];
  const N = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'lift', 'go'];
  Object.assign(F, C2); N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
