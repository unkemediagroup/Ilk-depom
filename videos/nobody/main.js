// "Nobody Is Coming to Save You" — Woodcut Print, 1080×1920, 24 fps, voice by the user.
import * as WC from './engine/index.js';
import { mulberry } from '/core/lib.js';
import { curl, peelState } from './trans.js';
import { drawFig, POSE, mix } from './fig.js';
import { mul, T, S as SC, put } from './rig.js';

const W = 1080, H = 1920, DUR = 29.6; window.DUR = DUR;
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const [mask, m] = WC.canvas(W, H), [colr, c] = WC.canvas(W, H);
const [bufA, a2] = WC.canvas(W, H), [bufB, b2] = WC.canvas(W, H), [bufC, c2] = WC.canvas(W, H);
let PR;
const ORANGE = '#C8502A';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => clamp((t - a) / (b - a));
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); }, eo = x => 1 - Math.pow(1 - clamp(x), 3), eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a, b, u) => a + (b - a) * u;

// ---------- the block (plate) and its ragged edge; the paper margin never moves ----------
const PX = 54, PY = 120, PW = 972, PH = 1310;
const BLOCK = (() => {
  const r = mulberry(7), P = [], j = () => (r() - .5) * 5;
  for (let x = 0; x <= PW; x += 12) P.push([PX + x, PY + j()]);
  for (let y = 0; y <= PH; y += 12) P.push([PX + PW + j(), PY + y]);
  for (let x = PW; x >= 0; x -= 12) P.push([PX + x, PY + PH + j()]);
  for (let y = PH; y >= 0; y -= 12) P.push([PX + j(), PY + y]);
  return P;
})();
const clipBlock = g => { g.beginPath(); WC.pathOf(g, BLOCK); g.clip(); };

// ---------- timeline (from the voice's word timings) ----------
const SC_T = [0, 6.6, 10.3, 14.2, 18.0, 22.3, 26.1, 27.55, DUR];
const IMP = [18.0, 19.22, 20.84, 21.32];               // hard cuts on "stop", "start", "Stop", "excuses"
const CAPS = [
  [0.00, 'Nobody is coming to save you.'],
  [2.04, 'Not tomorrow, not next week,\nand not when the stars finally align.'],
  [6.88, 'The harsh truth is that\nyou are entirely on your own.'],
  [10.38, 'But instead of letting that terrify you,\nlet it set you free.'],
  [14.32, 'The moment you realize no one else\nis going to build the life you want,'],
  [18.04, 'you stop waiting\nand start grinding.'],
  [20.84, 'Stop making excuses,'],
  [22.44, 'stop hoping for a rescue,\nand become your own hero.'],
  [26.20, 'The heavy lifting is yours alone.'],
  [27.70, 'Now go get it!'],
];
window.CAPS = CAPS;

// ---------- lazily built, cached carvings (every worker builds its own on first use) ----------
const C = {}; const once = (k, f) => C[k] || (C[k] = f());
const camM = (fx, fy, z, sx = 0, sy = 0) => mul(T(PX + PW / 2 + sx, PY + PH / 2 + sy), mul(SC(z), T(-fx, -fy)));
const shake = (t, t0, amp, dur = .35) => { const u = seg(t, t0, t0 + dur); if (u <= 0 || u >= 1) return [0, 0]; const k = amp * (1 - u); return [Math.sin(t * 97) * k, Math.cos(t * 83) * k]; };
const groundCuts = (y0, y1, seed, wmax = 9) => {
  const r = mulberry(seed), out = [];
  for (let y = y0; y < y1; y += 16 + (y - y0) * .04) {
    const w = 1.5 + (y - y0) / (y1 - y0) * wmax;
    out.push(...WC.cutAlong([[-300, y + r() * 4], [500, y + (r() - .5) * 8], [1300, y + r() * 4]], { w, kind: w > 8 ? 'u' : 'v', seg: [40, 160], gap: [6, 30], seed: r() * 999 }));
  }
  return out;
};

// carved backlight: horizontal cuts whose width follows a tone field, so black silhouettes read against it
const glow = (key, x0, y0, x1, y1, tone, sp = 10) => once(key, () => WC.hatch(new WC.Region([WC.rect(x0, y0, x1 - x0, y1 - y0)], { res: 3 }), { dir: WC.dirAngle(0), tone, sp, lo: .12, hi: .92, kind: 'v', seg: [40, 160], seed: key.length * 13 }));
// ---------- scene 1: waiting on the doorstep under stars ----------
function sc1(t) {
  const z = lerp(1.0, 1.14, ss(seg(t, 0, 6.6)));
  const M = camM(486, 820, z);
  put(m, M, () => {
    const stars = once('stars', () => { const r = mulberry(21), P = []; for (let i = 0; i < 120; i++) P.push([r() * 972, 20 + r() * 720, 2 + r() * 4.5, Math.floor(r() * 4)]); return P; });
    const out = [0, 2.04, 3.06, 4.36, 5.74];                 // each "not" inks a group back in; "align" takes the rest
    WC.drawStrokes(m, glow('gl1', -200, 640, 1200, 1186, (x, y) => .15 + .75 * ((y - 640) / 546) ** 1.4), { t: 1e9 });
    const vis = stars.filter(s => t < out[s[3] + 1] || (s[3] === 0 && t < out[4]));
    WC.drawStrokes(m, WC.flecks(vis.map(s => [s[0], s[1], s[2]]), { seed: 3 }), { t: 1e9 });
    // the house wall with a closed door (frame in a frame)
    const wall = once('wall', () => WC.shape([WC.rect(-60, 640, 330, 560)], { dir: Math.PI / 2, sp: 10, light: WC.light(.9, -.2, .4), halo: 5, seed: 4, lo: .2, hi: .7 }));
    wall.draw(m);
    const door = once('door', () => [...WC.cutAlong([[60, 1170], [60, 760], [230, 760], [230, 1170]], { w: 5, kind: 'k', seg: [80, 200], seed: 8 }),
      ...[100, 140, 180].flatMap((x, i) => WC.cutAlong([[x, 790], [x, 1150]], { w: 2.2, seg: [60, 160], gap: [6, 20], seed: 30 + i }))]);
    WC.drawStrokes(m, door, { t: 1e9 });
    const ground = once('g1', () => groundCuts(1185, 1340, 5));
    WC.drawStrokes(m, ground, { t: 1e9 });
    const step = once('step', () => WC.shape([WC.rect(230, 1040, 420, 145)], { dir: 0, sp: 8, light: WC.light(.3, -.9, .3), halo: 5, seed: 9, lo: .35, hi: .95 }));
    step.draw(m);
    drawFig(m, mul(T(470, 1186), SC(.95)), { ...POSE.sit, head: lerp(-.42, -.2, ss(seg(t, 5.8, 6.5))) });
  });
}
// ---------- scene 2: tiny, alone in the dark ----------
function sc2(t) {
  const z = lerp(2.8, 1.0, eio(seg(t, 6.6, 9.8)));
  const M = camM(486, 980 - 70, z);
  put(m, M, () => {
    const hz = once('hz', () => [...WC.cutAlong([[-600, 982], [200, 980], [800, 984], [1600, 981]], { w: u => 2 + 3 * Math.sin(Math.PI * u), kind: 'k', seg: [120, 400], gap: [2, 10], seed: 12 }),
      ...WC.flecks(Array.from({ length: 26 }, (_, i) => { const r = mulberry(40 + i); return [-500 + r() * 2000, 1000 + r() * 300, 1.5 + r() * 2]; }), { seed: 6 })]);
    WC.drawStrokes(m, glow('gl2', -700, 820, 1700, 982, (x, y) => .05 + .8 * ((y - 820) / 162) ** 2, 7), { t: 1e9 });
    WC.drawStrokes(m, hz, { t: 1e9 });
    drawFig(m, mul(T(486, 982), SC(.2)), POSE.stand);
  });
}
// ---------- scene 3: the fire lights in the chest ----------
function sc3(t) {
  const u = ss(seg(t, 12.3, 12.9));
  const pose = mix({ ...POSE.stand, head: .38, lean: .1 }, POSE.open, u);
  const M = camM(486, 860, lerp(1.0, 1.04, seg(t, 10.3, 14.2)));
  const FM = mul(T(470, 1290), SC(1.42));
  let pts;
  put(m, M, () => {
    if (t < 13.3) WC.drawStrokes(m, glow('gl3', -100, 200, 1100, 1292, (x, y) => Math.max(0, .78 - Math.hypot(x - 480, (y - 820) * .7) / 620)), { t: 1e9 });
    const g3 = once('g3', () => groundCuts(1292, 1500, 15, 6));
    WC.drawStrokes(m, g3, { t: 1e9 });
    // carved light bursting from the chest, behind the figure
    const meas = drawFig(NULLG, FM, pose);
    if (t > 12.4) {
      const rr = once('rays3', () => WC.rays(0, 0, { n: 70, r0: 130, r1: [700, 1500], w: 18, jit: .7, seed: 9, reveal: { t0: 12.45, t1: 13.5, jit: .3 } }));
      put(m, T(...meas.chest), () => WC.drawStrokes(m, rr, { t }));
    }
    pts = drawFig(m, FM, pose);
    // an ember carved into the chest: the one colour shows only through these cuts
    const k = ss(seg(t, 12.5, 13.3));
    if (k > 0) {
      const em = once('ember', () => WC.rays(0, 0, { n: 18, r0: 4, r1: [26, 62], w: 9, seed: 31 }));
      put(m, T(...pts.chest), () => { m.save(); m.scale(k, k); WC.drawStrokes(m, em, { t: 1e9 }); m.restore(); });
    }
  });
  const k = ss(seg(t, 12.5, 13.6));
  if (k > 0) {
    put(c, M, () => {
      const [x, y] = pts.chest, gr = c.createRadialGradient(x, y, 0, x, y, 900 * k);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.35, 'rgba(0,0,0,.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gr; c.fillRect(x - 1200, y - 1200, 2400, 2400);
    });
  }
}
const NULLG = (() => { const q = document.createElement('canvas'); q.width = q.height = 2; return q.getContext('2d'); })();
// ---------- scene 4: takes up the gouge and carves its own road ----------
function sc4(t) {
  const lt = t - 14.2, fx = 120 + 118 * lt;
  const M = camM(fx + 170, 900, 1.05);
  const step = Math.floor(lt * 12) / 12, ph = (step / .72) % 1;      // characters on twos
  const pose = mix(POSE.walkA, POSE.walkB, ph < .5 ? ss(ph * 2) : 1 - ss((ph - .5) * 2));
  put(m, M, () => {
    const ridge = once('ridge', () => [...WC.cutAlong([[-200, 820], [200, 760], [420, 640], [560, 700], [760, 560], [980, 690], [1300, 640], [1700, 760]], { w: 3, kind: 'k', seg: [90, 240], gap: [2, 8], seed: 41 }),
      ...WC.hatch(new WC.Region([[[-200, 820], [200, 760], [420, 640], [560, 700], [760, 560], [980, 690], [1300, 640], [1700, 760], [1700, 830], [-200, 830]]], { res: 2 }), { dir: WC.dirAngle(.15), tone: () => .35, sp: 9, lo: .2, hi: .6, seed: 42 })]);
    WC.drawStrokes(m, glow('gl4', -300, 240, 1900, 830, (x, y) => .1 + .75 * ((y - 240) / 590) ** 1.3), { t: 1e9 });
    WC.drawStrokes(m, ridge, { t: 1e9 });
    const g4 = once('g4', () => groundCuts(1215, 1500, 25, 7));
    WC.drawStrokes(m, g4, { t: 1e9 });
    const pts = drawFig(m, mul(T(fx, 1150), SC(.88)), pose);
    // the gouge: a long shaft from the hands to the ground ahead; its tip carves the road
    const tip = [fx + 230, 1158];
    const shaft = WC.cutAlong([pts.handN, tip], { w: 7, kind: 'v', seg: [400, 500], gap: [0, 1], seed: 50 });
    WC.drawStrokes(m, WC.cutAlong([pts.handN, tip].map(([x, y]) => [x + 4, y - 4]), { w: 2, seg: [400, 500], seed: 51 }), { t: 1e9, color: '#fff' });
    m.strokeStyle = '#000'; m.lineWidth = 9; m.lineCap = 'round'; m.beginPath(); m.moveTo(...pts.handN); m.lineTo(...tip); m.stroke();
    const road = once('road', () => WC.cutAlong([[-400, 1170], [300, 1166], [900, 1172], [1500, 1168]], { w: 20, kind: 'u', seg: [60, 140], gap: [1, 4], seed: 52 }));
    WC.drawStrokes(m, road.filter(s => s.p[s.p.length - 2] < tip[0] - 6), { t: 1e9 });
    WC.drawStrokes(m, WC.flecks(Array.from({ length: 6 }, (_, i) => [tip[0] - 10 - i * 9 + Math.sin(t * 30 + i) * 6, tip[1] - 12 - (i % 3) * 8, 3]), { seed: Math.floor(t * 12) }), { t: 1e9 });
  });
}
// ---------- scene 5: the climb, one impression per "stop" ----------
function sc5(t) {
  let i = 0; while (i < IMP.length - 1 && t >= IMP[i + 1]) i++;
  const us = [.18, .42, .62, .8][i], slope = u => [lerp(-80, 1060, u), lerp(1420, 260, u)];
  const [x, y] = slope(us), z = 1.18 + i * .04;
  const M = camM(x + 40, y - 220, z);
  put(m, M, () => {
    const sky = once('sky5', () => WC.hatch(new WC.Region([[[-600, -400], [1600, -400], [1600, 1600], [-600, 1600]]], { res: 3 }), { dir: WC.dirAngle(0), tone: (x, y) => .55 + .4 * (1 - y / 1600), sp: 11, lo: .3, hi: .95, kind: 'u', seed: 61 }));
    WC.drawStrokes(m, sky, { t: 1e9 });
    const mtn = once('mtn5', () => WC.shape([[[-400, 1480], [-80, 1420], [1060, 260], [1400, 200], [1600, 1700], [-400, 1700]]], { dir: WC.dirAngle(-.79), sp: 9, light: WC.light(.7, -.6, .4), halo: 7, seed: 62, lo: .2, hi: .7 }));
    mtn.draw(m);
    // notches cut into the slope behind the climber: the grind, piling up
    const n = 6 + i * 6;
    for (let k = 0; k < n; k++) { const [sx, sy] = slope(us - .02 - k * .028); if (us - .02 - k * .028 < 0) break; WC.fillPoly(m, [[[sx - 14, sy + 2], [sx + 14, sy - 12], [sx + 16, sy + 8]]], '#fff'); }
    drawFig(m, mul(T(x, y + 6), SC(.9)), i % 2 ? POSE.climbB : POSE.climbA);
  });
}
// ---------- scene 6: summit, carved sun, the colour at its peak ----------
function sc6(t) {
  const fy = lerp(1120, 820, eio(seg(t, 22.3, 24.0)));
  const M = camM(486, fy, 1.08);
  const sun = [486, 640];
  put(m, M, () => {
    const rr = once('rays6', () => WC.rays(sun[0], sun[1], { n: 96, r0: 170, r1: [700, 1500], w: 20, jit: .6, seed: 71, reveal: { t0: 22.5, t1: 24.6, jit: .25 } }));
    WC.drawStrokes(m, rr, { t });
    const disc = once('disc', () => WC.hatch(new WC.Region([WC.ellipse(sun[0], sun[1], 150, 150, 64)], { res: 2 }), { dir: WC.dirAngle(0), tone: () => .95, sp: 7, lo: .5, hi: 1, kind: 'u', seed: 72, reveal: { t0: 22.4, t1: 23.2, key: (x, y) => Math.hypot(x - sun[0], y - sun[1]) / 150 } }));
    WC.drawStrokes(m, disc, { t });
    const peak = once('peak', () => WC.shape([[[-300, 1600], [-300, 1300], [486, 840], [1272, 1300], [1272, 1600]]], { dir: 'contour', sp: 9, light: WC.light(-.4, -.7, .45), halo: 8, seed: 73, lo: .25, hi: .8 }));
    peak.draw(m);
    const u = ss(seg(t, 24.1, 24.5));
    drawFig(m, mul(T(486, 846), SC(.82)), mix(POSE.climbB, POSE.hero, u));
  });
  const k = ss(seg(t, 22.6, 25.2)) * (1 - .55 * ss(seg(t, 25.4, 26.1)));
  if (k > 0) put(c, M, () => {
    const gr = c.createRadialGradient(sun[0], sun[1], 0, sun[0], sun[1], 1300 * k);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.25, 'rgba(0,0,0,.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = gr; c.fillRect(-1000, -1000, 3000, 3000);
  });
}
// ---------- scene 7: the heavy lifting ----------
function sc7(t) {
  const strike = 26.46, snap = t >= strike ? 1.12 : 1.0;
  const [sx, sy] = shake(t, strike + .1, 14);
  const M = camM(486, t >= strike ? 700 : 900, snap, sx, sy);
  let pose;
  if (t < 26.25) pose = POSE.squat;
  else if (t < strike) pose = { ...POSE.squat, sitY: 120 + 25 * ss(seg(t, 26.25, strike)), lean: .6 };     // anticipation: sink
  else pose = mix({ ...POSE.squat, sitY: 145 }, POSE.press, eo(seg(t, strike, strike + .09)));              // two-frame strike
  if (t > strike + .1) pose = { ...POSE.press, sitY: 6 * Math.max(0, Math.sin((t - strike - .1) * 18)) * (1 - seg(t, strike + .1, strike + .6)) };
  let pts;
  put(m, M, () => {
    WC.drawStrokes(m, glow('gl7', -200, 0, 1200, 1230, (x, y) => Math.max(0, .82 - Math.hypot(x - 486, (y - 760) * .8) / 700)), { t: 1e9 });
    const g7 = once('g7', () => groundCuts(1230, 1500, 35, 8));
    WC.drawStrokes(m, g7, { t: 1e9 });
    pts = drawFig(m, mul(T(470, 1228), SC(1.05)), pose);
    const stone = once('stone', () => WC.shape([WC.ellipse(0, 0, 190, 120, 40)], { dir: 'contour', sp: 8, light: WC.light(.5, -.75, .45), halo: 7, seed: 81, lo: .3, hi: .85 }));
    const cx = (pts.handN[0] + pts.handF[0]) / 2 + 10, cy = (pts.handN[1] + pts.handF[1]) / 2 + (t >= strike ? -70 : 30);
    put(m, T(cx, cy), () => stone.draw(m));
    const em = once('ember7', () => WC.rays(0, 0, { n: 14, r0: 3, r1: [20, 44], w: 8, seed: 32 }));
    put(m, T(...pts.chest), () => WC.drawStrokes(m, em, { t: 1e9 }));
  });
  put(c, M, () => { const [x, y] = pts.chest, gr = c.createRadialGradient(x, y, 0, x, y, 70); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(x - 80, y - 80, 160, 160); });
}
// ---------- scene 8: the mirrored block is pulled as a true print ----------
function title(g, mirror) {
  g.save(); g.font = '260px "IM Fell English SC"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff';
  g.translate(PX + PW / 2, PY + PH / 2); if (mirror) g.scale(-1, 1);
  [['GO', -330], ['GET', 0], ['IT', 330]].forEach(([s, y]) => g.fillText(s, 0, y));
  g.restore();
}

// ---------- captions in the bottom margin, letterpress ----------
function captions(t) {
  for (let i = 0; i < CAPS.length; i++) {
    const [t0, s] = CAPS[i], t1 = (CAPS[i + 1] ? CAPS[i + 1][0] : DUR + 1);
    if (t < t0 || t >= t1) continue;
    const a = clamp((t - t0) / .1) * (1 - clamp((t - (t1 - .15)) / .15));
    m.save(); m.globalAlpha = a; m.fillStyle = '#000'; m.font = '58px "IM Fell English"'; m.textAlign = 'center'; m.textBaseline = 'middle';
    const L = s.split('\n'); L.forEach((ln, k) => m.fillText(ln, W / 2, 1540 + (k - (L.length - 1) / 2) * 70)); m.restore();
  }
}

function base(t) {
  m.setTransform(1, 0, 0, 1, 0, 0); m.globalAlpha = 1; m.fillStyle = '#fff'; m.fillRect(0, 0, W, H);
  WC.fillPoly(m, [BLOCK], '#000');
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
}
function impression(t) {   // a hard cut is a new impression: other ink seed, two frames of misregistration
  const cuts = [...SC_T.slice(1, -1), ...IMP.slice(1)];
  let k = 0, last = 0; for (const x of cuts) if (t >= x) { k++; last = x; }
  const fresh = t - last < 2 / 24 && k > 0;
  return { inkSeed: 3 + k * 5, reg: fresh ? [9, -6] : [3, 2] };
}
function render(t) {
  base(t);
  m.save(); clipBlock(m); c.save(); clipBlock(c);
  const sc = [sc1, sc2, sc3, sc4, sc5, sc6, sc7];
  let s = 0; while (s < SC_T.length - 2 && t >= SC_T[s + 1]) s++;
  if (s < 7) sc[s](t);
  m.restore(); c.restore();
  if (s < 7) { captions(t); const im = impression(t); ctx.drawImage(PR.render(mask, colr, { seed: 4, inkSeed: im.inkSeed, reg: im.reg, plate: ORANGE }), 0, 0); return; }
  // scene 8: A = the inked block (mirrored title), B = the pulled print (true title, orange in the cuts)
  m.save(); clipBlock(m); title(m, true); m.restore(); captions(t);
  a2.setTransform(1, 0, 0, 1, 0, 0); a2.drawImage(PR.render(mask, colr, { seed: 4, inkSeed: 61, mode: 'block' }), 0, 0);
  base(t); m.save(); clipBlock(m); title(m, false); m.restore();
  c.save(); clipBlock(c); c.fillStyle = 'rgba(0,0,0,1)'; c.fillRect(0, 0, W, H); c.restore();
  captions(t);
  b2.setTransform(1, 0, 0, 1, 0, 0); b2.drawImage(PR.render(mask, colr, { seed: 4, inkSeed: 67, plate: ORANGE }), 0, 0);
  const u = seg(t, 27.95, 28.55);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u <= 0) { ctx.drawImage(bufA, 0, 0); return; }
  ctx.drawImage(bufB, 0, 0);
  if (u < 1) {
    c2.setTransform(1, 0, 0, 1, 0, 0); c2.fillStyle = '#E6DECB'; c2.fillRect(0, 0, W, H); c2.globalAlpha = .12; c2.save(); c2.translate(W, 0); c2.scale(-1, 1); c2.drawImage(bufB, 0, 0); c2.restore(); c2.globalAlpha = 1;
    const { xf, r } = peelState(u, 170); curl(ctx, bufA, bufC, xf, r, { F: 2600 });
  }
}

window.render = render;
window.TEXTS = t => t >= 27.55 ? [{ id: 'title', text: 'GO GET IT', x0: PX + 200, y0: PY + 200, x1: PX + PW - 200, y1: PY + PH - 200 }] : [];
window.EV = [{ t: 26.5, type: 'thump' }, { t: 27.95, type: 'peel', d: .6 }, ...IMP.map(x => ({ t: x, type: 'imp' }))];
(async () => {
  await Promise.all(['58px "IM Fell English"', '260px "IM Fell English SC"'].map(f => document.fonts.load(f)));
  PR = WC.makePrinter(W, H);
  window.READY = true;
})();
