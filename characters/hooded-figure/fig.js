// A lone hooded figure in profile, facing +x. Local space: feet at (0,0), y up is negative, ~620 tall.
// Each body part is a carved capsule cached once (hatching in local space, so it never boils).
import * as WC from './engine/index.js';
import { part, drawPart, mul, T, R, about, put, ap } from './rig.js';

export const LKEY = WC.light(.8, -.45, .3);
const cap = (L, w0, w1 = w0, n = 10) => {          // capsule from (0,0) down to (0,L)
  const P = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI + Math.PI * i / n; P.push([Math.cos(a) * w0 / 2, Math.sin(a) * w0 / 2]); }
  for (let i = 0; i <= n; i++) { const a = Math.PI * i / n; P.push([Math.cos(a) * w1 / 2, L + Math.sin(a) * w1 / 2]); }
  return P.map(([x, y]) => [-x, y]);
};
const DEF = {
  thigh: { poly: cap(140, 62, 50), solid: true, halo: 4, feats: [{ pts: [[24, 12], [19, 128]], w: 3 }] },
  shin: { poly: cap(140, 48, 40), solid: true, halo: 4, feats: [{ pts: [[17, 12], [14, 128]], w: 3 }] },
  foot: { poly: [[-18, -10], [12, -14], [52, -8], [62, 6], [56, 14], [-18, 14]], solid: true, halo: 4 },
  upper: { poly: cap(124, 44, 38), solid: true, halo: 4, feats: [{ pts: [[15, 12], [13, 112]], w: 3 }] },
  fore: { poly: cap(116, 38, 30), solid: true, halo: 4, feats: [{ pts: [[12, 12], [9, 104]], w: 3 }] },
  hand: { poly: WC.ellipse(0, 14, 15, 19, 16), white: true, outline: 2.6, sp: 3, R: 8, lo: .5, halo: 2 },
  torso: { solid: true, halo: 4, cp: [[-46, 0], [-50, -70], [-48, -150], [-36, -220], [-6, -250], [30, -246], [50, -210], [56, -140], [52, -60], [46, 0]], a0: Math.PI / 2, sp: 7, R: 40,
    feats: [{ cp: [[44, -206], [52, -140], [46, -40]], w: 3 }, { cp: [[-40, -40], [6, -32], [46, -36]], w: 3 }] },
  hood: { solid: true, halo: 4, cp: [[-40, -10], [-50, -60], [-40, -104], [-6, -128], [34, -122], [58, -96], [64, -62], [56, -30], [40, -6], [0, 4]], sp: 6, R: 30, a0: .3,
    feats: [{ cp: [[52, -96], [30, -70], [26, -30]], w: 2.6 }] },
  face: { cp: [[30, -92], [48, -86], [56, -66], [62, -54], [56, -48], [56, -36], [44, -20], [30, -24], [24, -56]], white: true, outline: 2.6, sp: 3, R: 10, lo: .45, halo: 0, dir: 'contour',
    feats: [{ dot: [46, -66, 3.4, 2.6] }, { cp: [[40, -74], [50, -76]], w: 3.4 }] },
};
const fp = n => part('H.' + n, { light: LKEY, seed: n.length * 11 + n.charCodeAt(0), ...DEF[n] });

export const POSE = {
  stand: { lean: .02, head: 0, a1: .08, a2: -.15, f1: -.06, f2: -.15, q1: -.04, k1: .06, q2: .06, k2: .04 },
  sit: { lean: .18, head: -.42, a1: -.5, a2: -1.2, f1: -.4, f2: -1.3, q1: -1.5, k1: 1.5, q2: -1.42, k2: 1.45, sitY: 150 },
  open: { lean: -.08, head: -.3, a1: .45, a2: -.1, f1: -.35, f2: -.1, q1: -.05, k1: .05, q2: .1, k2: .05 },
  walkA: { lean: .14, head: .05, a1: -.7, a2: -.6, f1: -.55, f2: -.8, q1: -.42, k1: .3, q2: .3, k2: .18, tool: 1 },
  walkB: { lean: .14, head: .05, a1: -.62, a2: -.7, f1: -.5, f2: -.85, q1: .28, k1: .42, q2: -.38, k2: .2, tool: 1 },
  climbA: { lean: .45, head: -.15, a1: -2.2, a2: -.2, f1: -.4, f2: -.6, q1: -1.2, k1: 1.3, q2: .25, k2: .25 },
  climbB: { lean: .42, head: -.15, a1: -.5, a2: -.6, f1: -2.3, f2: -.2, q1: .2, k1: .3, q2: -1.15, k2: 1.25 },
  hero: { lean: -.1, head: -.35, a1: -2.85, a2: -.15, f1: .25, f2: -.2, q1: -.25, k1: .1, q2: .25, k2: .05 },
  squat: { lean: .55, head: .1, a1: -.9, a2: -.25, f1: -.85, f2: -.3, q1: -1.35, k1: 1.75, q2: -1.2, k2: 1.6, sitY: 120 },
  press: { lean: -.06, head: -.2, a1: -2.95, a2: -.12, f1: -2.85, f2: -.12, q1: -.25, k1: .2, q2: .3, k2: .2 },
};
export const mix = (A, B, u) => { const o = {}; for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) o[k] = typeof (A[k] ?? B[k]) === 'number' ? (A[k] ?? 0) + ((B[k] ?? 0) - (A[k] ?? 0)) * u : (u < .5 ? A[k] : B[k]); return o; };

// joints (local, before posing): hip at (0,-280), knee 140 below, shoulder on the torso
const HIP = [0, -280], SH = [4, -232], NECK = [8, -250];
// draw the figure with matrix M (feet origin); returns world points of interest
export function drawFig(g, M, pose, t = 1e9) {
  const P = { ...POSE.stand, ...pose };
  M = mul(M, T(0, P.sitY || 0));
  const legM = (q, k) => { const th = mul(T(...HIP), R(q)), sh = mul(th, mul(T(0, 140), R(k))), ft = mul(sh, mul(T(0, 140), R(-q - k))); return [th, sh, ft]; };
  const [nT, nS, nF] = legM(P.q1, P.k1), [fT, fS, fF] = legM(P.q2, P.k2);
  const root = mul(M, mul(T(...HIP), mul(R(P.lean), T(0, 0))));   // torso local origin at hip
  const armM = (a, e) => { const up = mul(root, mul(T(...SH), R(a))), fo = mul(up, mul(T(0, 124), R(e))), ha = mul(fo, T(0, 116)); return [up, fo, ha]; };
  const [aU, aF, aH] = armM(P.a1, P.a2), [bU, bF, bH] = armM(P.f1, P.f2);
  // far side first
  put(g, bU, () => drawPart(g, fp('upper'), t)); put(g, bF, () => drawPart(g, fp('fore'), t)); put(g, bH, () => drawPart(g, fp('hand'), t));
  put(g, mul(M, fT), () => drawPart(g, fp('thigh'), t)); put(g, mul(M, fS), () => drawPart(g, fp('shin'), t)); put(g, mul(M, fF), () => drawPart(g, fp('foot'), t));
  put(g, root, () => drawPart(g, fp('torso'), t));
  const head = mul(root, mul(T(...NECK), R(P.head)));
  put(g, head, () => { drawPart(g, fp('hood'), t); drawPart(g, fp('face'), t); });
  put(g, mul(M, nT), () => drawPart(g, fp('thigh'), t)); put(g, mul(M, nS), () => drawPart(g, fp('shin'), t)); put(g, mul(M, nF), () => drawPart(g, fp('foot'), t));
  put(g, aU, () => drawPart(g, fp('upper'), t)); put(g, aF, () => drawPart(g, fp('fore'), t)); put(g, aH, () => drawPart(g, fp('hand'), t));
  return { chest: ap(root, 14, -150), handN: ap(aH, 0, 14), handF: ap(bH, 0, 14), head: ap(head, 20, -70), handNM: aH, handFM: bH };
}
