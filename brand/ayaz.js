// AYAZ (kor rengi) — the channel's signature character. 2D canvas, no dependencies.
// DROP-IN replacement for the old characters/red-neon/neon.js: same exports, same pose angles, same 600-unit rig.
// AYAZ = angular black silhouette, pointed hood with one gold visor line, torn two-layer cape shedding embers,
// crystal torso (wide shoulders, narrow waist), framed gold hourglass on the chest, two gold bands on each forearm.
// Colour: ember red rim (#ff2a3c) + gold accents (#ffb81f). Profile view facing +x; feet on y = 0, up is −y.
//
//   import { drawNeon, POSE, mixPose, sparks, emberGround } from './neon.js';   // (copy this file into the video as neon.js)
//   drawNeon(ctx, x, y, scale, POSE.stand, { t, glow: 1, wind: 0, hourglass: 0, mode: 'kor' });   // AYAZ
//   drawNeon(ctx, x, y, scale, POSE.stand, { col: {rim:'#3a3a44', hot:'#55555f', glow:'rgba(90,90,110,'} });   // crowd: plain round figure
//   emberGround(ctx, x, y, scale, grow01, { mode: 'kor' });   // the floor cracks and glows where he stands
//   sparks(ctx, x, y, t - t0, { seed: 3 });                    // red + gold burst when he wins

// colour modes. 'kor' is the channel colour; the others are mood modes — the silhouette never changes.
export const MODES = {
  kor:   { body: '#07070b', rim: '#ff2a3c', hot: '#ff9aa2', glow: 'rgba(255,26,48,',   acc: '#ffb81f', accGlow: 'rgba(255,184,31,' },
  altin: { body: '#07070b', rim: '#ffc21a', hot: '#fff3c4', glow: 'rgba(255,190,30,',  acc: '#ffffff', accGlow: 'rgba(255,255,255,' },   // peak / victory
  kul:   { body: '#07070b', rim: '#7d7d88', hot: '#a5a5ae', glow: 'rgba(125,125,140,', acc: '#ff3a2a', accGlow: 'rgba(255,58,42,' },     // burnt out, only the accents still burn
  buz:   { body: '#05080c', rim: '#19e3ff', hot: '#c8f8ff', glow: 'rgba(25,227,255,',  acc: '#ffffff', accGlow: 'rgba(255,255,255,' },
};
export const COL = MODES.kor;
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const shade = (h, k) => { const [r, g, b] = hexRgb(h); return `rgb(${r * k | 0},${g * k | 0},${b * k | 0})`; };
// blend two modes (0..1) — e.g. kor → altin at the peak of the video
export function mixMode(a, b, u) {
  const A = typeof a === 'string' ? MODES[a] : a, B = typeof b === 'string' ? MODES[b] : b, o = {};
  const mh = (x, y) => { const p = hexRgb(x), q = hexRgb(y); return '#' + p.map((v, i) => Math.round(v + (q[i] - v) * u).toString(16).padStart(2, '0')).join(''); };
  const mg = (x, y) => { const p = x.match(/\d+/g).map(Number), q = y.match(/\d+/g).map(Number); return `rgba(${p.map((v, i) => Math.round(v + (q[i] - v) * u)).join(',')},`; };
  for (const k of ['body', 'rim', 'hot', 'acc']) o[k] = mh(A[k], B[k]);
  o.glow = mg(A.glow, B.glow); o.accGlow = mg(A.accGlow, B.accGlow); return o;
}
// proportions (units), measured from the reference and normalised to a 600-unit standing height
export const DIM = { head: 43, neck: 14, torso: 178, torsoW0: 82, torsoW1: 72, thigh: 152, shin: 150, legW: 40, upper: 112, fore: 106, armW: 32, foot: 30 };

const PI = Math.PI;
// pose angles in radians. 0 = limb hanging straight down; negative = swings forward (+x).
// lean: torso tilt (+ forward), head: nod (+ down), a1/a2 near shoulder/elbow, f1/f2 far arm, q1/k1 near hip/knee, q2/k2 far leg, y: drop the hips
export const POSE = {
  stand:   { lean: .03, head: .05, a1: .1, a2: -.12, f1: -.05, f2: -.15, q1: -.03, k1: .05, q2: .05, k2: .04 },
  despair: { armsFront: 1, lean: .85, head: .35, a1: -4.25, a2: 2.55, f1: -2.71, f2: -.5, q1: -1.62, k1: 1.62, q2: -1.5, k2: 1.55, y: 152 },   // the reference: seated, head in hands
  sitFloor: { lean: .35, head: .35, a1: -.75, a2: -.6, f1: -.6, f2: -.7, q1: -1.25, k1: 2.35, q2: -1.15, k2: 2.25, y: 250 },
  hang:    { lean: 0, head: -.1, a1: -3.05, a2: -.04, f1: -3.12, f2: .02, q1: -.18, k1: .45, q2: -.05, k2: .5 },
  top:     { lean: .05, head: -.15, a1: .55, a2: -3.7, f1: .5, f2: -3.65, q1: -.3, k1: .55, q2: -.12, k2: .6 },
  sitTall: { lean: .1, head: -.05, a1: -.55, a2: -.9, f1: -.45, f2: -1.0, q1: -1.57, k1: 1.57, q2: -1.5, k2: 1.5, y: 152 },
  walkA:   { lean: .1, head: .02, a1: .45, a2: -.25, f1: -.45, f2: -.35, q1: -.42, k1: .22, q2: .3, k2: .35 },
  walkB:   { lean: .1, head: .02, a1: -.45, a2: -.35, f1: .45, f2: -.25, q1: .3, k1: .35, q2: -.42, k2: .22 },
  runA:    { lean: .35, head: -.05, a1: .9, a2: -1.5, f1: -1.1, f2: -1.4, q1: -1.15, k1: .9, q2: .55, k2: 1.4, y: 20 },
  runB:    { lean: .35, head: -.05, a1: -1.1, a2: -1.4, f1: .9, f2: -1.5, q1: .55, k1: 1.4, q2: -1.15, k2: .9, y: 20 },
  push:    { lean: .7, head: -.25, a1: -1.45, a2: -.15, f1: -1.35, f2: -.25, q1: -.7, k1: .45, q2: .55, k2: .15, y: 40 },
  kneel:   { lean: .25, head: .45, a1: .2, a2: -.4, f1: .05, f2: -.5, q1: -1.5, k1: 1.55, q2: .1, k2: 1.65, y: 120 },
  victory: { lean: -.12, head: -.45, a1: -2.55, a2: .15, f1: -3.65, f2: -.1, q1: -.15, k1: .1, q2: .2, k2: .05 },
  jump:    { lean: -.05, head: -.35, a1: -2.5, a2: .25, f1: -2.9, f2: -.15, q1: -1.0, k1: 1.7, q2: -.55, k2: 1.5, y: -60 },
};
// AYAZ's default stance: feet apart, near arm back so the hourglass shows. Prefer this over `stand` for hero shots.
POSE.hero = { lean: .02, head: 0, a1: .3, a2: -.22, f1: -.22, f2: -.2, q1: -.13, k1: .08, q2: .15, k2: .06 };
export const mixPose = (A, B, u) => { const o = {}; for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) o[k] = (A[k] ?? 0) + ((B[k] ?? 0) - (A[k] ?? 0)) * u; return o; };

// ---------- geometry ----------
const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const down = (L, a) => rot(0, L, a);                        // a limb of length L hanging, rotated by a
// a pill (capsule) between two points with end widths w0, w1, as a closed path
function pill(g, p0, p1, w0, w1 = w0) {
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], a = Math.atan2(dy, dx);
  g.moveTo(p0[0] + Math.cos(a + PI / 2) * w0 / 2, p0[1] + Math.sin(a + PI / 2) * w0 / 2);
  g.arc(p0[0], p0[1], w0 / 2, a + PI / 2, a + 3 * PI / 2);
  g.arc(p1[0], p1[1], w1 / 2, a - PI / 2, a + PI / 2);
  g.closePath();
}
// solve the skeleton for a pose → named segments
export function skeleton(P0) {
  const P = { ...POSE.stand, ...P0 }, D = DIM;
  const hip = [0, -(D.thigh + D.shin + D.legW * .3) + (P.y || 0)];
  const leg = (q, k) => { const knee = add(hip, down(D.thigh, q)), ank = add(knee, down(D.shin, q + k)); const fa = -(q + k) * .35; const toe = add(ank, rot(D.foot, 0, fa)); return { knee, ank, toe }; };
  const L1 = leg(P.q1, P.k1), L2 = leg(P.q2, P.k2);
  const shoulder = add(hip, rot(0, -D.torso, P.lean)), neck = add(hip, rot(0, -(D.torso + D.neck), P.lean));
  const head = add(neck, rot(0, -D.head, P.lean + P.head));
  const sh = add(shoulder, rot(-4, 6, P.lean));
  const arm = (a, e) => { const el = add(sh, down(D.upper, P.lean + a)), wr = add(el, down(D.fore, P.lean + a + e)); return { el, wr }; };
  return { P, hip, shoulder, neck, head, sh, L1, L2, A1: arm(P.a1, P.a2), A2: arm(P.f1, P.f2) };
}

// ---------- drawing ----------
// draw a group of parts as one neon-rimmed silhouette: glow → neon rim → black fill (internal seams vanish)
function neonGroup(g, build, s, glow, C = COL) {
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); build(g);
  if (glow > 0) {
    g.shadowColor = C.glow + (.95 * glow) + ')'; g.shadowBlur = 34 * s * glow; g.strokeStyle = C.glow + (.55 * glow) + ')'; g.lineWidth = 14 * s; g.stroke();
    g.shadowBlur = 12 * s * glow; g.strokeStyle = C.rim; g.lineWidth = 9 * s; g.stroke();
  }
  g.shadowBlur = 0; g.strokeStyle = C.rim; g.lineWidth = 7 * s; g.stroke();
  g.strokeStyle = C.hot; g.lineWidth = 1.6 * s; g.globalAlpha = .55; g.stroke(); g.globalAlpha = 1;
  g.fillStyle = C.body; g.fill('nonzero');
  g.restore();
}
export function drawPlain(g, x, y, scale, pose, o = {}) {
  const k = skeleton(pose), D = DIM, glow = o.glow ?? 1, s = 1 / scale, C = { ...COL, ...(o.col || {}) };   // o.col: other characters (never red: red is ours)
  g.save(); g.translate(x, y); g.scale(o.flip ? -scale : scale, scale);
  // far arm and far leg (behind; a pose with armsFront brings the far arm forward, e.g. hands on the head)
  const farArm = () => neonGroup(g, c => { pill(c, k.sh, k.A2.el, D.armW, D.armW * .95); pill(c, k.A2.el, k.A2.wr, D.armW * .95, D.armW * .9); }, s * .9, glow * .8, C);
  if (!k.P.armsFront) farArm();
  neonGroup(g, c => { pill(c, k.hip, k.L2.knee, D.legW, D.legW * .95); pill(c, k.L2.knee, k.L2.ank, D.legW * .95, D.legW * .85); pill(c, k.L2.ank, k.L2.toe, D.legW * .7, D.legW * .55); }, s * .9, glow * .8, C);
  // body: torso + head + near leg as one silhouette
  neonGroup(g, c => {
    pill(c, k.hip, k.shoulder, D.torsoW1, D.torsoW0);
    c.moveTo(k.head[0] + D.head, k.head[1]); c.arc(k.head[0], k.head[1], D.head, 0, PI * 2);
    pill(c, k.neck, add(k.neck, rot(0, 6, k.P.lean)), D.armW * .9);
    pill(c, k.hip, k.L1.knee, D.legW, D.legW * .95); pill(c, k.L1.knee, k.L1.ank, D.legW * .95, D.legW * .85); pill(c, k.L1.ank, k.L1.toe, D.legW * .7, D.legW * .55);
  }, s, glow, C);
  // signature: short red ticks down the spine (the back edge of the torso)
  g.save(); g.strokeStyle = C.rim; g.lineWidth = 2.4 * s; g.shadowColor = C.glow + '.9)'; g.shadowBlur = 6 * s * glow; g.lineCap = 'round';
  const back = rot(-1, 0, k.P.lean), dir = rot(0, -1, k.P.lean);
  for (let i = 1; i <= 9; i++) {
    const u = i / 10, c = add(k.hip, [dir[0] * D.torso * u + back[0] * (D.torsoW1 / 2 - 2), dir[1] * D.torso * u + back[1] * (D.torsoW1 / 2 - 2)]);
    g.beginPath(); g.moveTo(c[0], c[1]); g.lineTo(c[0] - back[0] * 9, c[1] - back[1] * 9); g.stroke();
  }
  g.restore();
  if (k.P.armsFront) farArm();
  // near arm in front, with its own rim
  neonGroup(g, c => { pill(c, k.sh, k.A1.el, D.armW, D.armW * .95); pill(c, k.A1.el, k.A1.wr, D.armW * .95, D.armW * .9); }, s, glow, C);
  g.restore();
  return k;
}
// ================= AYAZ =================
const AD = { armW: 29, legW: 33, sh: 90, waist: 56, hood: 2.3 };
// an angular bar (square-capped quad) between two points
function bar(g, p0, p1, w0, w1 = w0, ext = .45) {
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, nx = -uy, ny = ux, e0 = w0 * ext, e1 = w1 * ext;
  g.moveTo(p0[0] - ux * e0 + nx * w0 / 2, p0[1] - uy * e0 + ny * w0 / 2);
  g.lineTo(p1[0] + ux * e1 + nx * w1 / 2, p1[1] + uy * e1 + ny * w1 / 2);
  g.lineTo(p1[0] + ux * e1 - nx * w1 / 2, p1[1] + uy * e1 - ny * w1 / 2);
  g.lineTo(p0[0] - ux * e0 - nx * w0 / 2, p0[1] - uy * e0 - ny * w0 / 2);
  g.closePath();
}
const poly = (g, pts) => { pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); };
function sharpGroup(g, build, s, glow, C) {
  g.save(); g.lineJoin = 'miter'; g.miterLimit = 6; g.lineCap = 'butt'; const W = Math.max(13, 7 * s);   // rim: 6.5 units each side, never under 3.5 px
  g.beginPath(); build(g);
  if (glow > 0) {
    g.shadowColor = C.glow + (.95 * glow) + ')'; g.shadowBlur = 34 * s * glow; g.strokeStyle = C.glow + (.55 * glow) + ')'; g.lineWidth = W * 1.7; g.stroke();
    g.shadowBlur = 12 * s * glow; g.strokeStyle = C.rim; g.lineWidth = W * 1.2; g.stroke();
  }
  g.shadowBlur = 0; g.strokeStyle = C.rim; g.lineWidth = W; g.stroke();
  g.fillStyle = C.body; g.fill('nonzero');
  g.restore();
}
const accent = (g, C, s, glow, w, fn) => { g.save(); g.strokeStyle = C.acc; g.fillStyle = C.acc; g.lineWidth = w; g.lineCap = 'butt'; g.lineJoin = 'miter'; g.shadowColor = C.accGlow + '.9)'; g.shadowBlur = 10 * s * Math.max(.4, glow); fn(); g.restore(); };
const hsh = i => { const x = Math.sin(i * 127.1 + 3.7) * 43758.5453; return x - Math.floor(x); };

// o: { flip, glow, t (seconds, drives cape + embers), wind (0 still … 1 running, default from the pose), hourglass (0..1 = half-turn),
//      mode ('kor' | 'altin' | 'kul' | 'buz' | a colour object), cape (false hides it), embers (false hides them) }
export function drawAyaz(g, x, y, scale, pose, o = {}) {
  const k = skeleton(pose), D = DIM, glow = o.glow ?? 1, s = 1 / scale, t = o.t ?? 0;
  const C = { ...MODES.kor, ...(typeof o.mode === 'string' ? MODES[o.mode] : o.mode || {}) };
  const lean = k.P.lean, wind = o.wind ?? Math.min(1, Math.max(0, lean * 2.2));
  const dir = rot(0, -1, lean), front = rot(1, 0, lean);
  g.save(); g.translate(x, y); g.scale(o.flip ? -scale : scale, scale);
  // ---- cape (two torn layers, behind everything) + embers shed from its tips
  if (o.cape !== false) {
    const n = k.neck, h = k.hip, tx = -(1 + wind * .45), ty = .28 - wind * .36, amp = 10 + wind * 20, wv = i => Math.sin(t * (4 + wind * 5) + i * 1.3) * amp;
    const c1 = [[n[0] + 8, n[1] + 4], [n[0] + tx * 255, n[1] + 95 + ty * 180 + wv(0)], [n[0] + tx * 172, n[1] + 165 + ty * 145 + wv(1) * .6], [n[0] + tx * 232, n[1] + 265 + ty * 130 + wv(2)],
      [n[0] + tx * 136, n[1] + 248 + ty * 80 + wv(3) * .5], [n[0] + tx * 155, n[1] + 345 + ty * 70 + wv(4)], [h[0] - 12, h[1] - 40]];
    const c2 = [[n[0] + 4, n[1] + 10], [n[0] + tx * 150, n[1] + 105 + ty * 120 + wv(1)], [n[0] + tx * 100, n[1] + 160 + ty * 90 + wv(2) * .5], [n[0] + tx * 132, n[1] + 228 + ty * 80 + wv(3)], [h[0] - 16, h[1] - 70]];
    g.save(); g.lineJoin = 'miter'; g.miterLimit = 8;
    g.beginPath(); poly(g, c1); g.shadowColor = C.glow + (.8 * glow) + ')'; g.shadowBlur = 22 * s * glow; g.strokeStyle = C.rim; g.lineWidth = 6 * s; g.stroke(); g.shadowBlur = 0; g.fillStyle = shade(C.rim, .15); g.fill();
    g.strokeStyle = C.rim; g.globalAlpha = .3; g.lineWidth = 2.5 * s; g.beginPath(); g.moveTo(...c1[0]); g.lineTo(...c1[2]); g.moveTo(...c1[0]); g.lineTo(...c1[4]); g.stroke(); g.globalAlpha = 1;
    g.beginPath(); poly(g, c2); g.strokeStyle = C.rim; g.lineWidth = 4.5 * s; g.stroke(); g.fillStyle = shade(C.rim, .3); g.fill();
    if (o.embers !== false) {
      g.globalCompositeOperation = 'lighter';
      [c1[1], c1[3], c1[5]].forEach((tp, i) => { for (let j = 0; j < 4; j++) {
        const ph = (t * .55 + i * .37 + j / 4) % 1, px = tp[0] + tx * ph * (150 + wind * 220) + Math.sin(ph * 6 + i) * 12, py = tp[1] + ty * ph * 60 - ph * (40 + 30 * hsh(i * 7 + j)) + j * 14, r = (1 - ph) * 11 + 2;
        g.globalAlpha = (1 - ph) * .9; g.fillStyle = j % 2 ? C.acc : C.rim; g.beginPath(); g.moveTo(px, py - r); g.lineTo(px + r * .6, py); g.lineTo(px, py + r); g.lineTo(px - r * .6, py); g.closePath(); g.fill();
      } });
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    }
    g.restore();
  }
  const limbArm = (A, ss2, gl) => sharpGroup(g, c => { bar(c, k.sh, A.el, AD.armW, AD.armW * .95); bar(c, A.el, A.wr, AD.armW * .95, AD.armW * .9); }, ss2, gl, C);
  const bands = A => accent(g, C, s, glow, 6, () => { const ax = A.wr[0] - A.el[0], ay = A.wr[1] - A.el[1], l = Math.hypot(ax, ay) || 1, nx = -ay / l, ny = ax / l, hw = AD.armW * .46;
    [.48, .7].forEach(f => { const cx = A.el[0] + ax * f, cy = A.el[1] + ay * f; g.beginPath(); g.moveTo(cx - nx * hw, cy - ny * hw); g.lineTo(cx + nx * hw, cy + ny * hw); g.stroke(); }); });
  const leg = (c, L) => { bar(c, k.hip, L.knee, AD.legW, AD.legW * .95); bar(c, L.knee, L.ank, AD.legW * .95, AD.legW * .85); bar(c, L.ank, L.toe, AD.legW * .72, AD.legW * .6, .3); };
  // ---- far arm + far leg
  const farArm = () => { limbArm(k.A2, s * .9, glow * .8); bands(k.A2); };
  if (!k.P.armsFront) farArm();
  sharpGroup(g, c => leg(c, k.L2), s * .9, glow * .8, C);
  // ---- body: crystal torso + hood + near leg as one silhouette
  const sA = add(k.shoulder, [front[0] * AD.sh / 2 + dir[0] * 10, front[1] * AD.sh / 2 + dir[1] * 10]), sB = add(k.shoulder, [-front[0] * AD.sh / 2 + dir[0] * 10, -front[1] * AD.sh / 2 + dir[1] * 10]);
  const wA = add(k.hip, [front[0] * AD.waist / 2 - dir[0] * 12, front[1] * AD.waist / 2 - dir[1] * 12]), wB = add(k.hip, [-front[0] * AD.waist / 2 - dir[0] * 12, -front[1] * AD.waist / 2 - dir[1] * 12]);
  const ha = lean + k.P.head, hood = [[-24, -12], [-10, -31], [15, -22], [24, 1], [9, 21], [-15, 16]].map(p => add(k.head, rot(p[0] * AD.hood, p[1] * AD.hood, ha)));
  sharpGroup(g, c => { poly(c, [sB, sA, wA, wB]); poly(c, hood); bar(c, k.neck, k.shoulder, 30, 30, .2); leg(c, k.L1); }, s, glow, C);
  // facets (crystal lines) on torso and hood
  g.save(); g.strokeStyle = C.rim; g.globalAlpha = .32; g.lineWidth = 2.5 * s; g.beginPath();
  const mid = add(k.hip, [dir[0] * D.torso * .45 + front[0] * 22, dir[1] * D.torso * .45 + front[1] * 22]);
  g.moveTo(...sB); g.lineTo(...mid); g.lineTo(...wB);
  const hf = p => add(k.head, rot(p[0] * AD.hood, p[1] * AD.hood, ha)); g.moveTo(...hf([-10, -31])); g.lineTo(...hf([-1, -9])); g.lineTo(...hf([-15, 16])); g.stroke(); g.restore();
  // visor: one line of light
  accent(g, C, s, glow * 1.4, 10, () => { g.beginPath(); g.moveTo(...hf([2, -4])); g.lineTo(...hf([22.5, -1])); g.stroke(); });
  // hourglass on the chest (o.hourglass 0..1 turns it over)
  const hc = add(k.hip, [dir[0] * D.torso * .6 + front[0] * 20, dir[1] * D.torso * .6 + front[1] * 20]);
  g.save(); g.translate(hc[0], hc[1]); g.rotate(lean + (o.hourglass || 0) * PI); g.scale(1.1, 1.1);
  accent(g, C, s, glow, 5, () => { g.beginPath(); g.moveTo(-19, -26); g.lineTo(19, -26); g.moveTo(-19, 26); g.lineTo(19, 26); g.stroke();
    g.lineWidth = 3; g.beginPath(); g.moveTo(-15, -24); g.lineTo(15, -24); g.lineTo(0, 0); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-15, 24); g.lineTo(15, 24); g.lineTo(0, 0); g.closePath(); g.stroke();
    g.setLineDash([4, 3]); g.lineDashOffset = -t * 30; g.beginPath(); g.moveTo(0, 2); g.lineTo(0, 21); g.stroke(); });
  g.restore();
  if (k.P.armsFront) farArm();
  // ---- near arm in front
  limbArm(k.A1, s, glow); bands(k.A1);
  g.restore();
  return k;
}
// the signature entry point. Our hero is AYAZ; anything drawn with o.col (crowd, rivals) is a plain round figure with no hood/cape.
export function drawNeon(g, x, y, scale, pose, o = {}) { return o.col && !o.ayaz ? drawPlain(g, x, y, scale, pose, o) : drawAyaz(g, x, y, scale, pose, o); }

// the floor cracks and glows where AYAZ stands. grow 0..1 (animate it in); spread scales the reach.
export function emberGround(g, x, y, scale, grow = 1, o = {}) {
  if (grow <= 0) return; const C = { ...MODES.kor, ...(typeof o.mode === 'string' ? MODES[o.mode] : o.mode || {}) }, sp = (o.spread ?? 1) * 58, seed = o.seed ?? 0;
  g.save(); g.translate(x, y + 10 * scale); g.scale(scale, scale); g.lineJoin = 'miter'; g.lineCap = 'butt'; g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 11; i++) {
    const ang = i / 11 * PI * 2 + hsh(i + seed) * .4; let px = 0, py = 0; const pts = [[0, 0]], tw = [];
    for (let j = 1; j <= 5; j++) { if (j / 5 > grow + .001) break; const r = sp * (.7 + hsh(i * 9 + j + seed) * .6), a = ang + (hsh(i * 5 + j + seed) - .5) * .9; px += Math.cos(a) * r; py += Math.sin(a) * r * .2; pts.push([px, py]);
      if (j === 2 || j === 4) { const a2 = a + (hsh(i + j + seed) > .5 ? .9 : -.9); tw.push([px, py, px + Math.cos(a2) * sp * .55, py + Math.sin(a2) * sp * .11]); } }
    g.strokeStyle = i % 3 ? C.rim : C.acc; g.lineWidth = i % 3 ? 3 : 4.5; g.globalAlpha = .6 * Math.min(1, grow * 2); g.shadowColor = (i % 3 ? C.glow : C.accGlow) + '.9)'; g.shadowBlur = 14;
    g.beginPath(); pts.forEach((p, n) => n ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); tw.forEach(q => { g.moveTo(q[0], q[1]); g.lineTo(q[2], q[3]); }); g.stroke();
  }
  g.restore();
}

// a soft red pool of light on the floor under the character
export function floorGlow(g, x, y, scale, a = .5) {
  const r = 360 * scale, gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, COL.glow + a + ')'); gr.addColorStop(1, COL.glow + '0)');
  g.save(); g.scale(1, .35); g.fillStyle = gr; g.fillRect(x - r, y / .35 - r, r * 2, r * 2); g.restore();
}

// ---------- the win: ember fireworks (red + gold) ----------
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// a burst of red sparks with short trails, deterministic in (seed, age). age in seconds since the burst.
export function sparks(g, x, y, age, o = {}) {
  if (age < 0 || age > (o.life ?? 1.6)) return;
  const r = mulberry(o.seed ?? 1), n = o.n ?? 70, sc = o.scale ?? 1, life = o.life ?? 1.6, grav = 520 * sc;
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const a = r() * PI * 2, sp = (260 + r() * 520) * sc, tl = life * (.55 + r() * .45), hue = r();
    if (age > tl) continue;
    const drag = 1 - Math.exp(-2.6 * age), vx = Math.cos(a) * sp, vy = Math.sin(a) * sp - 120 * sc;
    const px = x + vx * drag / 2.6, py = y + vy * drag / 2.6 + .5 * grav * age * age;
    const pa = Math.max(0, age - .05), d2 = 1 - Math.exp(-2.6 * pa), qx = x + vx * d2 / 2.6, qy = y + vy * d2 / 2.6 + .5 * grav * pa * pa;
    const fade = 1 - age / tl, col = hue < .6 ? `rgba(255,${40 + hue * 60 | 0},${50 + hue * 40 | 0},` : `rgba(255,${170 + hue * 60 | 0},${30 + hue * 60 | 0},`;
    g.strokeStyle = col + fade + ')'; g.lineWidth = (2.2 + r() * 2.5) * sc;
    g.shadowColor = 'rgba(255,30,60,.9)'; g.shadowBlur = 10 * sc;
    g.beginPath(); g.moveTo(qx, qy); g.lineTo(px, py); g.stroke();
    if ((i + Math.floor(age * 30)) % 5 === 0) { g.fillStyle = col + fade + ')'; g.beginPath(); g.arc(px, py, 2.4 * sc, 0, PI * 2); g.fill(); }
  }
  g.restore();
}
