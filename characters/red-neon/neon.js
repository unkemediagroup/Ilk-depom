// RED NEON — the channel's signature character (2D canvas, no dependencies).
// A flat black silhouette with a vivid red neon rim and glow; plain round head, no face; thick pill-shaped limbs;
// short red ticks down the spine. Profile view facing +x. Local space: feet on y = 0, up is −y, standing height ≈ 600.
//
//   import { drawNeon, POSE, mixPose, sparks } from './neon.js';
//   drawNeon(ctx, x, y, scale, POSE.stand, { flip: false, glow: 1 });
//   sparks(ctx, x, y, t - t0, { seed: 3, scale: 1 });   // red firework burst when the character wins

export const COL = {
  body: '#07070b',          // silhouette fill
  rim: '#ff2338',           // neon line (reference rgb ≈ 220,45,55, pushed a little brighter)
  hot: '#ff9aa2',           // thin hot core inside the neon line
  glow: 'rgba(255,20,48,',  // bloom colour (alpha appended)
};
// proportions (units), measured from the reference and normalised to a 600-unit standing height
export const DIM = { head: 43, neck: 14, torso: 178, torsoW0: 82, torsoW1: 72, thigh: 152, shin: 150, legW: 40, upper: 112, fore: 106, armW: 32, foot: 30 };

const PI = Math.PI;
// pose angles in radians. 0 = limb hanging straight down; negative = swings forward (+x).
// lean: torso tilt (+ forward), head: nod (+ down), a1/a2 near shoulder/elbow, f1/f2 far arm, q1/k1 near hip/knee, q2/k2 far leg, y: drop the hips
export const POSE = {
  stand:   { lean: .03, head: .05, a1: .1, a2: -.12, f1: -.05, f2: -.15, q1: -.03, k1: .05, q2: .05, k2: .04 },
  despair: { armsFront: 1, lean: .85, head: .35, a1: -4.25, a2: 2.55, f1: -2.71, f2: -.5, q1: -1.62, k1: 1.62, q2: -1.5, k2: 1.55, y: 152 },   // the reference: seated, head in hands
  sitTall: { lean: .1, head: -.05, a1: -.55, a2: -.9, f1: -.45, f2: -1.0, q1: -1.57, k1: 1.57, q2: -1.5, k2: 1.5, y: 152 },
  walkA:   { lean: .1, head: .02, a1: .45, a2: -.25, f1: -.45, f2: -.35, q1: -.42, k1: .22, q2: .3, k2: .35 },
  walkB:   { lean: .1, head: .02, a1: -.45, a2: -.35, f1: .45, f2: -.25, q1: .3, k1: .35, q2: -.42, k2: .22 },
  runA:    { lean: .35, head: -.05, a1: .9, a2: -1.5, f1: -1.1, f2: -1.4, q1: -1.15, k1: .9, q2: .55, k2: 1.4, y: 20 },
  runB:    { lean: .35, head: -.05, a1: -1.1, a2: -1.4, f1: .9, f2: -1.5, q1: .55, k1: 1.4, q2: -1.15, k2: .9, y: 20 },
  push:    { lean: .7, head: -.25, a1: -1.45, a2: -.15, f1: -1.35, f2: -.25, q1: -.7, k1: .45, q2: .55, k2: .15, y: 40 },
  kneel:   { lean: .25, head: .45, a1: .2, a2: -.4, f1: .05, f2: -.5, q1: -1.5, k1: 1.55, q2: .1, k2: 1.65, y: 120 },
  victory: { lean: -.12, head: -.45, a1: -2.15, a2: .2, f1: -2.95, f2: -.25, q1: -.15, k1: .1, q2: .2, k2: .05 },
  jump:    { lean: -.05, head: -.35, a1: -2.5, a2: .25, f1: -2.9, f2: -.15, q1: -1.0, k1: 1.7, q2: -.55, k2: 1.5, y: -60 },
};
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
function neonGroup(g, build, s, glow) {
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); build(g);
  if (glow > 0) {
    g.shadowColor = COL.glow + (.95 * glow) + ')'; g.shadowBlur = 34 * s * glow; g.strokeStyle = COL.glow + (.55 * glow) + ')'; g.lineWidth = 14 * s; g.stroke();
    g.shadowBlur = 12 * s * glow; g.strokeStyle = COL.rim; g.lineWidth = 9 * s; g.stroke();
  }
  g.shadowBlur = 0; g.strokeStyle = COL.rim; g.lineWidth = 7 * s; g.stroke();
  g.strokeStyle = COL.hot; g.lineWidth = 1.6 * s; g.globalAlpha = .55; g.stroke(); g.globalAlpha = 1;
  g.fillStyle = COL.body; g.fill('nonzero');
  g.restore();
}
export function drawNeon(g, x, y, scale, pose, o = {}) {
  const k = skeleton(pose), D = DIM, glow = o.glow ?? 1, s = 1 / scale;      // line widths stay constant on screen
  g.save(); g.translate(x, y); g.scale(o.flip ? -scale : scale, scale);
  // far arm and far leg (behind; a pose with armsFront brings the far arm forward, e.g. hands on the head)
  const farArm = () => neonGroup(g, c => { pill(c, k.sh, k.A2.el, D.armW, D.armW * .95); pill(c, k.A2.el, k.A2.wr, D.armW * .95, D.armW * .9); }, s * .9, glow * .8);
  if (!k.P.armsFront) farArm();
  neonGroup(g, c => { pill(c, k.hip, k.L2.knee, D.legW, D.legW * .95); pill(c, k.L2.knee, k.L2.ank, D.legW * .95, D.legW * .85); pill(c, k.L2.ank, k.L2.toe, D.legW * .7, D.legW * .55); }, s * .9, glow * .8);
  // body: torso + head + near leg as one silhouette
  neonGroup(g, c => {
    pill(c, k.hip, k.shoulder, D.torsoW1, D.torsoW0);
    c.moveTo(k.head[0] + D.head, k.head[1]); c.arc(k.head[0], k.head[1], D.head, 0, PI * 2);
    pill(c, k.neck, add(k.neck, rot(0, 6, k.P.lean)), D.armW * .9);
    pill(c, k.hip, k.L1.knee, D.legW, D.legW * .95); pill(c, k.L1.knee, k.L1.ank, D.legW * .95, D.legW * .85); pill(c, k.L1.ank, k.L1.toe, D.legW * .7, D.legW * .55);
  }, s, glow);
  // signature: short red ticks down the spine (the back edge of the torso)
  g.save(); g.strokeStyle = COL.rim; g.lineWidth = 2.4 * s; g.shadowColor = COL.glow + '.9)'; g.shadowBlur = 6 * s * glow; g.lineCap = 'round';
  const back = rot(-1, 0, k.P.lean), dir = rot(0, -1, k.P.lean);
  for (let i = 1; i <= 9; i++) {
    const u = i / 10, c = add(k.hip, [dir[0] * D.torso * u + back[0] * (D.torsoW1 / 2 - 2), dir[1] * D.torso * u + back[1] * (D.torsoW1 / 2 - 2)]);
    g.beginPath(); g.moveTo(c[0], c[1]); g.lineTo(c[0] - back[0] * 9, c[1] - back[1] * 9); g.stroke();
  }
  g.restore();
  if (k.P.armsFront) farArm();
  // near arm in front, with its own rim
  neonGroup(g, c => { pill(c, k.sh, k.A1.el, D.armW, D.armW * .95); pill(c, k.A1.el, k.A1.wr, D.armW * .95, D.armW * .9); }, s, glow);
  g.restore();
  return k;
}
// a soft red pool of light on the floor under the character
export function floorGlow(g, x, y, scale, a = .5) {
  const r = 360 * scale, gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, COL.glow + a + ')'); gr.addColorStop(1, COL.glow + '0)');
  g.save(); g.scale(1, .35); g.fillStyle = gr; g.fillRect(x - r, y / .35 - r, r * 2, r * 2); g.restore();
}

// ---------- the win: red fireworks ----------
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
    const fade = 1 - age / tl, col = hue < .7 ? `rgba(255,${40 + hue * 60 | 0},${50 + hue * 40 | 0},` : `rgba(255,${150 + hue * 80 | 0},${150 + hue * 60 | 0},`;
    g.strokeStyle = col + fade + ')'; g.lineWidth = (2.2 + r() * 2.5) * sc;
    g.shadowColor = 'rgba(255,30,60,.9)'; g.shadowBlur = 10 * sc;
    g.beginPath(); g.moveTo(qx, qy); g.lineTo(px, py); g.stroke();
    if ((i + Math.floor(age * 30)) % 5 === 0) { g.fillStyle = col + fade + ')'; g.beginPath(); g.arc(px, py, 2.4 * sc, 0, PI * 2); g.fill(); }
  }
  g.restore();
}
