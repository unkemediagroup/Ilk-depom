// "Did you know your body can heal itself?" — Watercolor Brush, 1080×1920.
// One tall journal page in world coordinates (x 0–1080, y 0–3100); the camera tilts down it.
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
window.DUR = 50.5;

// ---------- palette ----------
const ACC = '#c8442a';                                   // vermilion: the cut, the healed line, the answer's underline
const SKIN = '#e6b498', SKIN2 = '#cf8f73', SKIN3 = '#b8735a', NAIL = '#efcbbd', NAIL2 = '#f6e4da', NEWSKIN = '#e9a891';
const CLOT = '#8e2a22', PLT = '#a5352a';
const IVORY = '#e9dcc1', IVORY2 = '#cdb68e', IVORY3 = '#a88f66', CALLUS = '#9fb4c4', CALLUS2 = '#7f97a9';
const LIV = '#9c4535', LIV2 = '#7b3227', LIV3 = '#b9644c';

// ---------- timeline (seconds) — voice starts from voice/dur.json, laid out by hand ----------
const VO = [
  ['L1', 0.40, 'Did you know your body can heal itself?'],
  ['L2', 4.00, 'Cut your finger, and within seconds,\nplatelets rush in to plug the leak.'],
  ['L3', 8.80, 'Over the next few days, new skin cells\ncrawl across the gap, until it closes.'],
  ['L4', 16.60, 'Break a bone, and your body builds a bridge\nacross the crack, then turns it back into solid bone.'],
  ['L4b', 22.70, 'Many breaks heal in about 6 to 8 weeks.'],
  ['L5', 27.00, 'Your liver can do something even stranger.'],
  ['L6', 29.90, 'Surgeons can remove up to 2/3 of a healthy liver,\nand it grows back.'],
  ['L7', 37.60, 'Skin, bone, liver.\nEvery day, your body is quietly repairing itself.'],
  ['L8', 44.60, 'That little scar? Proof that it works.'],
];
let VDUR = {};                                            // filled from voice/dur.json
const T = {
  finger: [0.2, 2.4], q1: [0.3, 1.5], q2: [1.35, 2.35], cut: [2.9, 3.25],
  plt: [4.8, 7.6], clot: [6.8, 8.2], heal: [9.2, 13.0], skinNote: [10.4, 14.0],
  bone: [14.6, 16.6], crack: [16.8, 17.15], bridge: [18.6, 20.6], ossify: [20.8, 23.6], boneNote: [22.8, 25.9],
  liver: [26.4, 28.6], erase: [30.6, 31.8], regrow: [32.2, 36.2], livNote1: [31.4, 34.9], livNote2: [34.4, 38.0],
  wideNotes: [38.8, 42.6], qErase: [44.9, 45.5], a1: [45.5, 46.4], a2: [46.2, 47.2], under: [47.3, 48.0],
};

// ---------- camera: y centre and log-zoom, monotone keyframes ----------
const camY = monotone([[0, 860], [3.4, 862], [8.0, 930], [13.9, 936], [16.8, 2300], [25.6, 2306], [27.6, 3200], [37.0, 3204], [38.4, 2900], [40.4, 1880], [42.4, 1876], [44.9, 760], [50.5, 756]]);
const camZ = monotone([[0, Math.log(1.0)], [3.4, Math.log(1.02)], [8.0, Math.log(1.3)], [13.9, Math.log(1.33)], [15.3, Math.log(.86)], [16.8, Math.log(1.0)], [25.6, Math.log(1.12)], [26.6, Math.log(.92)], [27.6, Math.log(1.0)], [37.0, Math.log(1.07)], [38.4, Math.log(.5)], [40.4, Math.log(.31)], [42.4, Math.log(.32)], [44.9, Math.log(1.12)], [50.5, Math.log(1.18)]]);
const CX = 540;
const cam = t => ({ y: camY(t), z: Math.exp(camZ(t)) });
const toScr = (t, wx, wy) => { const c = cam(t); return [(wx - CX) * c.z + W / 2, (wy - c.y) * c.z + H / 2, c.z]; };
const worldXf = t => { const c = cam(t); ctx.setTransform(c.z, 0, 0, c.z, W / 2 - CX * c.z, H / 2 - c.y * c.z); };
const screenXf = () => ctx.setTransform(1, 0, 0, 1, 0, 0);

// ---------- helpers ----------
function washPoly(c, pts, fill, a, passes = 3, jit = 4) {
  for (let p = 0; p < passes; p++) {
    c.beginPath(); pts.forEach(([x, y], i) => { const xx = x + rnd(-jit, jit), yy = y + rnd(-jit, jit); i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); });
    c.closePath(); c.globalAlpha = a / passes * 1.6; c.fillStyle = fill; c.fill();
  }
  c.globalAlpha = 1;
}
const ell = (cx, cy, rx, ry, n = 48, a0 = 0, a1 = Math.PI * 2) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
const fade2 = (t, a, b, fi = .5, fo = .5) => ss(seg(t, a, a + fi)) * (1 - ss(seg(t, b - fo, b)));
// a pre-rendered wash (built under a fixed seed) is a sprite; a stroke list paints in by progress
function washSprite(x0, y0, x1, y1, fn) {
  const c2 = document.createElement('canvas'); c2.width = x1 - x0; c2.height = y1 - y0;
  const g = c2.getContext('2d'); g.translate(-x0, -y0); fn(g); return { cv: c2, x0, y0 };
}
const drawSpr = (s, a = 1) => { if (a <= 0) return; ctx.globalAlpha = a; ctx.drawImage(s.cv, s.x0, s.y0); ctx.globalAlpha = 1; };
// a wavy vertical brush-edge reveal of a sprite: shown where y < front(x)
function revealSpr(s, p, dir = 'down', a = 1) {
  if (p <= 0) return; if (p >= 1) return drawSpr(s, a);
  const w = s.cv.width, h = s.cv.height; ctx.save(); ctx.beginPath();
  if (dir === 'down') { ctx.moveTo(s.x0, s.y0); for (let x = 0; x <= w; x += 20) ctx.lineTo(s.x0 + x, s.y0 + h * p + 26 * (fbm(x / 90 + 3) - .5)); ctx.lineTo(s.x0 + w, s.y0); }
  else { ctx.moveTo(s.x0, s.y0); for (let y = 0; y <= h; y += 20) ctx.lineTo(s.x0 + w * p + 26 * (fbm(y / 90 + 7) - .5), s.y0 + y); ctx.lineTo(s.x0, s.y0 + h); }
  ctx.closePath(); ctx.clip(); drawSpr(s, a); ctx.restore();
}

// ---------- hand-written notes (world space), with paper halo ----------
function hand(txt, x, y, p, o = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.font = `600 ${o.size || 60}px Caveat`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(txt).width, x0 = o.align === 'right' ? x - w : o.align === 'center' ? x - w / 2 : x;
  ctx.beginPath(); ctx.rect(x0 - 10, y - (o.size || 60), (w + 20) * eo(p), (o.size || 60) * 2); ctx.clip();
  ctx.shadowColor = rgba(PAPER, .95); ctx.shadowBlur = 14; ctx.fillStyle = rgba(o.col || INK, o.a ?? .9);
  ctx.fillText(txt, x, y); ctx.fillText(txt, x, y); ctx.restore();
  return [x0, y - (o.size || 60) * .6, x0 + w, y + (o.size || 60) * .6];
}
function leader(x0, y0, x1, y1, p, bend = 20, a = .75, lw = 2.6) {
  if (p <= 0) return;
  const pts = qcurve(x0, y0, x1, y1, bend, 18), m = Math.max(1, Math.round(18 * clamp(p)));
  ctx.beginPath(); for (let i = 0; i <= m; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = rgba(INK, a); ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
  if (p >= 1) { ctx.beginPath(); ctx.arc(x1, y1, lw * 1.8, 0, 7); ctx.fillStyle = rgba(INK, a); ctx.fill(); }
}
const NOTES = [];                                          // filled each frame for TEXTS()
function note(t, [t0, t1], ax, ay, lx, ly, txt, o = {}) {
  const f = 1 - ss(seg(t, t1 - .5, t1)); if (t < t0 || f <= 0) return;
  ctx.globalAlpha = f;
  leader(lx + (o.lead ?? 0), ly + (ay < ly ? -1 : 1) * (o.size || 60) * .6, ax, ay, seg(t, t0, t0 + .6), o.bend ?? 22);
  const bb = hand(txt, lx, ly, seg(t, t0 + .3, t0 + 1.0), o);
  ctx.globalAlpha = 1;
  if (bb && t >= t0 + .3) NOTES.push({ id: o.id || txt, text: txt, bb });
}

// ---------- build the specimens (once, fixed seeds) ----------
let PAPER_IMG, FING, NAILS, WRINK, CUT, CLOTS, PLTS, HEAL, SCAR, BONE, CRACK, CALL, OSS, LIVR, LIVOUT, UNDER, MIST;
function build() {
  // --- finger, seen from the back, tip up: x 400–680, tip at y 640, fades out below y 1450
  withSeed(11, () => {
    const L = [];
    const outline = [...ell(540, 780, 140, 140, 30, Math.PI, Math.PI * 2), [684, 1900], [396, 1900]];
    FING = washSprite(360, 600, 720, 1960, g => {
      washPoly(g, outline, SKIN, .55, 4, 3);
      const gr = g.createLinearGradient(0, 1500, 0, 1880); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = gr; g.fillRect(360, 1500, 360, 460);   // the wash thins out to bare paper
    });
    for (let i = 0; i < 6; i++) L.push(mk(qcurve(430 + i * 46 + rnd(-6, 6), 700 + Math.abs(i - 2.5) * 34, 430 + i * 46, 1720 + rnd(-60, 60), rnd(-8, 8), 22), rnd(40, 56), pick([SKIN, SKIN, SKIN2]), { prof: 'brush', nb: 5, a: .45 }));
    L.push(mk(qctrl(640, 690, 692, 1000, 664, 1780, 26), 34, SKIN2, { prof: 'brush', nb: 6, a: .6 }));   // shadow side
    L.push(mk(qctrl(610, 660, 702, 900, 680, 1700, 26), 10, SKIN3, { prof: 'brush', nb: 3, a: .55 }));   // darker edge
    L.push(mk(qctrl(470, 670, 394, 900, 404, 1650, 26), 8, SKIN3, { prof: 'brush', nb: 2, a: .4 }));     // light-side edge
    FING.S = L;
    NAILS = [mk(qcurve(540, 860, 540, 672, 0, 14), 150, NAIL, { prof: 'even', nb: 7, a: .78 }),
             mk(qcurve(476, 690, 604, 690, -14, 14), 18, NAIL2, { prof: 'even', nb: 4, a: .9 }),
             mk(qcurve(466, 862, 614, 862, 16, 16), 6, SKIN3, { prof: 'even', nb: 2, a: .7 }),
             mk(qcurve(470, 700, 470, 850, -6, 12), 6, SKIN2, { prof: 'even', nb: 0, a: .45 })];
    WRINK = [];
    for (let i = 0; i < 4; i++) WRINK.push(mk(qcurve(468 + rnd(-6, 6), 1180 + i * 16, 612 + rnd(-6, 6), 1182 + i * 16, 8 + i * 2, 12), 4.5, INK2, { prof: 'even', nb: 0, a: .35 }));
    CUT = mk(qcurve(432, 982, 650, 1010, -10, 22), 15, ACC, { prof: 'brush', nb: 5, a: .95 });
    CLOTS = [mk(qcurve(440, 984, 644, 1009, -10, 22), 24, CLOT, { prof: 'even', nb: 6, a: .7 })];
    PLTS = [];
    for (let i = 0; i < 64; i++) {
      const u = rnd(.04, .96), ex = lerp(440, 644, u), ey = lerp(984, 1009, u) - 10 * Math.sin(Math.PI * u) + rnd(-7, 7);
      const a = rnd(0, Math.PI * 2), r = rnd(120, 300);
      PLTS.push({ sx: ex + Math.cos(a) * r, sy: ey + Math.sin(a) * r * .8, ex, ey, t0: rnd(0, 1), s: mk(qcurve(-6, 0, 6, rnd(-2, 2), rnd(-3, 3), 5), rnd(8, 13), PLT, { prof: 'leaf', nb: 0, a: rnd(.7, .92) }) });
    }
    HEAL = [];
    for (let i = 0; i < 9; i++) { const x = 432 + i * 25; HEAL.push(mk(qcurve(x, 960 + rnd(-6, 6) + i * 3, x + 40, 1032 + rnd(-6, 6) + i * 3, rnd(-6, 6), 8), 30, pick([NEWSKIN, SKIN, NEWSKIN]), { prof: 'leaf', nb: 4, a: .7 })); }
    SCAR = mk(qcurve(446, 986, 640, 1008, -8, 22), 5, '#d38f79', { prof: 'even', nb: 2, a: .7 });
  });
  // --- bone, horizontal, x 130–950, centre y 1900
  withSeed(23, () => {
    BONE = washSprite(80, 1740, 1000, 2060, g => {
      for (const [x, y, r] of [[200, 1862, 66], [214, 1942, 60], [878, 1858, 62], [866, 1940, 64]]) washPoly(g, ell(x, y, r, r * .95, 36), IVORY, .7, 4, 3);
      washPoly(g, [[230, 1866], [850, 1868], [850, 1936], [230, 1938]], IVORY, .75, 4, 3);
      for (const [x, y, r] of [[214, 1942, 60], [866, 1940, 64]]) washPoly(g, ell(x, y + 10, r * .9, r * .55, 30, 0, Math.PI), IVORY2, .35, 3, 3);
    });
    const L = [];
    L.push(mk(qcurve(180, 1900, 900, 1902, 4, 40), 72, IVORY, { prof: 'even', nb: 8, a: .5 }));
    L.push(mk(qcurve(250, 1928, 830, 1930, -4, 40), 20, IVORY2, { prof: 'even', nb: 6, a: .5 }));   // shadow underside
    for (const [x, y, r, a0, a1] of [[200, 1862, 66, 1.0, 4.6], [214, 1942, 60, 1.6, 3.6], [878, 1858, 62, -1.5, 2.1], [866, 1940, 64, -.5, 1.5]]) {
      L.push(mk(ell(x, y, r - 4, r * .95 - 4, 20, a0, a1), 14, IVORY2, { prof: 'even', nb: 4, a: .55 }));
      L.push(mk(ell(x, y, r + 2, r * .95 + 2, 20, a0, a1), 4.5, INK2, { prof: 'even', nb: 0, a: .6 }));
    }
    L.push(mk(qcurve(262, 1866, 818, 1868, 8, 30), 4.5, INK2, { prof: 'even', nb: 0, a: .55 }));
    L.push(mk(qcurve(268, 1936, 812, 1938, -8, 30), 4.5, INK2, { prof: 'even', nb: 0, a: .65 }));
    BONE.S = L;
    const zz = [[552, 1856], [530, 1878], [558, 1900], [528, 1920], [548, 1946]];
    CRACK = [mk(zz.flatMap((p, i) => i ? qcurve(zz[i - 1][0], zz[i - 1][1], p[0], p[1], 0, 4).slice(1) : [p]), 16, PAPER, { prof: 'even', nb: 0, a: 1, rough: .4 }),
             mk(zz.flatMap((p, i) => i ? qcurve(zz[i - 1][0], zz[i - 1][1], p[0], p[1], 0, 4).slice(1) : [p]).map(([x, y]) => [x + 7, y]), 4, INK, { prof: 'even', nb: 0, a: .8, rough: .4 })];
    CALL = []; clump(CALL, 542, 1900, 58, 80, [CALLUS, CALLUS, CALLUS2], { sx: 1.25, sy: 1.0, l0: 10, l1: 22, w0: 14, w1: 22, a0: .5, a1: .75 });
    OSS = []; clump(OSS, 542, 1900, 56, 90, [IVORY, IVORY, IVORY2], { sx: 1.2, sy: .95, l0: 10, l1: 22, w0: 14, w1: 24, a0: .65, a1: .9 });
  });
  // --- liver, centre (540, 2800), x ≈ 160–920
  withSeed(37, () => {
    const out = [[170, 2700], [260, 2610], [420, 2570], [600, 2585], [780, 2610], [900, 2650], [930, 2690], [880, 2740], [760, 2800], [640, 2870], [520, 2950], [400, 3010], [300, 3010], [210, 2950], [165, 2840]];
    const sm = []; for (let i = 0; i < out.length; i++) { const a = out[i], b = out[(i + 1) % out.length]; for (let k = 0; k < 6; k++) sm.push([lerp(a[0], b[0], k / 6), lerp(a[1], b[1], k / 6)]); }
    LIVOUT = sm;
    LIVR = washSprite(120, 2520, 980, 3060, g => {
      washPoly(g, sm, LIV, .62, 5, 4);
      washPoly(g, sm.filter(([x, y]) => y > 2700).map(([x, y]) => [x, y]).concat([[200, 2900], [500, 2930]]), LIV2, .25, 3, 6);
    });
    const L = [];
    for (let i = 0; i < 7; i++) L.push(mk(qcurve(220 + i * 22 + rnd(-20, 20), 2650 + i * 46 + rnd(-14, 14), 870 - i * 72 + rnd(-30, 30), 2640 + i * 34 + rnd(-14, 14), rnd(-40, 30), 24), rnd(48, 66), pick([LIV, LIV, LIV3]), { prof: 'brush', nb: 6, a: .3 }));
    L.push(mk(qctrl(260, 2990, 520, 2960, 760, 2810, 24), 26, LIV2, { prof: 'even', nb: 6, a: .55 }));
    L.push(mk(qctrl(620, 2590, 600, 2700, 660, 2850, 18), 4, INK2, { prof: 'even', nb: 0, a: .5 }));       // ligament between the lobes
    L.push(mk(qctrl(260, 2640, 460, 2560, 760, 2605, 24), 18, LIV3, { prof: 'even', nb: 5, a: .45 }));    // light on the top
    LIVR.S = L;
  });
  withSeed(51, () => {
    UNDER = mk(qcurve(300, 510, 800, 502, 10, 30), 13, ACC, { prof: 'brush', nb: 5, a: .9 });
    MIST = [];
    for (let i = 0; i < 7; i++) MIST.push(mk(qcurve(150 + rnd(-30, 30), 300 + i * 26, 940 + rnd(-30, 30), 300 + i * 26 + rnd(-10, 10), rnd(-14, 14), 20), 60, PAPER, { prof: 'even', nb: 6, a: .55, rough: .3 }));
  });
}

// ---------- the specimens, drawn in world space ----------
function drawFinger(t) {
  const p = seg(t, ...T.finger);
  if (p <= 0) return;
  revealSpr(FING, eo(p) * 1.05, 'down', .9);
  drawList(ctx, FING.S, seg(t, .4, 2.4));
  drawList(ctx, NAILS, seg(t, 1.2, 2.5)); drawList(ctx, WRINK, seg(t, 1.8, 2.6));
  // the cut: red, then darker clot, then new skin closes it to a pale line
  const healK = ss(seg(t, T.heal[0] + .3, T.heal[1]));
  const cutA = 1 - healK * .92;
  drawS(ctx, CUT, seg(t, ...T.cut), null, cutA);
  // platelets swarm in from all sides and settle along the cut
  if (t > T.plt[0] && t < T.heal[1]) {
    const fo = 1 - ss(seg(t, T.heal[0], T.heal[0] + 2.2));
    for (const q of PLTS) {
      const k = eio(seg(t, T.plt[0] + q.t0 * 1.6, T.plt[0] + q.t0 * 1.6 + 1.1)); if (k <= 0) continue;
      const x = lerp(q.sx, q.ex, k) + Math.sin(t * 3 + q.t0 * 9) * 3 * (1 - k), y = lerp(q.sy, q.ey, k);
      ctx.save(); ctx.translate(x, y); ctx.rotate(q.t0 * 6 + t * (1 - k)); drawS(ctx, q.s, 1, null, ss(k * 3) * fo); ctx.restore();
    }
  }
  drawList(ctx, CLOTS, seg(t, ...T.clot), null, 1 - healK * .95);
  // new skin strokes crawl across from left to right, then soften
  if (t > T.heal[0]) {
    const hp = seg(t, T.heal[0], T.heal[1] - .6), soft = 1 - .45 * ss(seg(t, T.heal[1] - .8, T.heal[1] + .8));
    HEAL.forEach((s, i) => drawS(ctx, s, seg(hp, i / HEAL.length * .8, i / HEAL.length * .8 + .25), null, soft));
    drawS(ctx, SCAR, ss(seg(t, T.heal[1] - .8, T.heal[1] + .4)), null, .75);
  }
}
function drawBone(t) {
  const p = seg(t, ...T.bone); if (p <= 0) return;
  revealSpr(BONE, eo(p) * 1.05, 'right', .92);
  drawList(ctx, BONE.S, p);
  const ossK = ss(seg(t, ...T.ossify));
  drawList(ctx, CALL, seg(t, ...T.bridge), null, 1 - ossK * .85);
  drawList(ctx, CRACK, seg(t, ...T.crack), null, 1 - ossK * .82);
  drawList(ctx, OSS, seg(t, ...T.ossify), null, .9);
}
function liverClip(t) {
  // the removed region (x < edge) is cleared by a rising mist, then the edge sweeps back left as the liver regrows
  const er = eio(seg(t, ...T.erase)), rg = seg(t, ...T.regrow);
  if (er <= 0) return null;
  const edge0 = 667, edgeX = y => lerp(edge0, 90, eio(rg)) + 30 * (fbm(y / 70 + 2) - .5) + (rg > 0 && rg < 1 ? 14 * Math.sin(y / 23 + t * 2) : 0);
  const front = lerp(3080, 2520, er);
  const pts = []; for (let y = 2500; y <= 3080; y += 16) pts.push([y < front + 40 * (fbm(y / 50) - .5) ? -100 : edgeX(y), y]);
  return { pts, edgeX, front, rg, er };
}
function drawLiver(t) {
  const p = seg(t, ...T.liver); if (p <= 0) return;
  const cl = liverClip(t);
  ctx.save();
  if (cl) {
    ctx.beginPath(); ctx.rect(0, 2400, 1100, 800);
    ctx.moveTo(-100, 2500); for (const [x, y] of cl.pts) ctx.lineTo(x, y); ctx.lineTo(-100, 3080); ctx.closePath();
    ctx.clip('evenodd');
  }
  revealSpr(LIVR, eo(p) * 1.05, 'down', .95); drawList(ctx, LIVR.S, p);
  ctx.restore();
  if (!cl) return;
  // pencil ghost of what was taken, then the wet front of new tissue
  const ghost = fade2(t, T.erase[0] + .6, T.regrow[1] + .4, .5, .8);
  if (ghost > 0) {
    ctx.save(); ctx.setLineDash([10, 12]); ctx.lineWidth = 3; ctx.strokeStyle = rgba(INK, .4 * ghost);
    ctx.beginPath(); LIVOUT.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke(); ctx.restore();
  }
  if (cl.rg > 0 && cl.rg < 1) {
    withSeed(900 + Math.floor(t * 12), () => {
      for (let y = 2610; y < 3000; y += 58) { const x = cl.edgeX(y); if (x > 150 && x < 930) drawS(ctx, mk(qcurve(x - 10, y, x + 26, y + 30, 10, 6), 40, LIV, { prof: 'leaf', nb: 3, a: .32 }), 1); }
    });
  }
  // mist band at the rising front while erasing
  if (cl.er > 0 && cl.er < 1) {
    withSeed(700 + Math.floor(t * 12), () => {
      for (let i = 0; i < 5; i++) drawS(ctx, mk(qcurve(150 + rnd(-30, 30), cl.front - 30 + i * 22, 660 + rnd(-40, 20), cl.front - 30 + i * 22 + rnd(-14, 14), rnd(-24, 24), 16), rnd(30, 52), PAPER, { prof: 'brush', nb: 6, a: .38, rough: .4 }), 1);
    });
  }
}

// ---------- question → answer at the top of the page ----------
const TEXTS_NOW = [];
function drawTop(t) {
  const qa = 1 - ss(seg(t, ...T.qErase));
  if (qa > 0) {
    ctx.globalAlpha = qa;
    const b1 = hand('Did you know your body', 540, 330, seg(t, ...T.q1), { size: 84, align: 'center' });
    const b2 = hand('can heal itself?', 540, 430, seg(t, ...T.q2), { size: 84, align: 'center' });
    ctx.globalAlpha = 1;
    if (b1 && b2 && qa >= 1) NOTES.push({ id: 'q', text: 'Did you know your body can heal itself?', bb: [Math.min(b1[0], b2[0]), b1[1], Math.max(b1[2], b2[2]), b2[3]] });
  }
  if (t > T.qErase[0]) drawList(ctx, MIST, seg(t, T.qErase[0] - .1, T.qErase[1] + .2), null, 1 - ss(seg(t, T.qErase[1], T.qErase[1] + .8)));
  if (t >= T.a1[0]) {
    const b1 = hand('Your body', 540, 330, seg(t, ...T.a1), { size: 104, align: 'center' });
    const b2 = hand('heals itself.', 540, 440, seg(t, ...T.a2), { size: 104, align: 'center' });
    drawS(ctx, UNDER, .86 * seg(t, ...T.under));          // the brush lifts before the end of the stroke
    if (b1 && b2) NOTES.push({ id: 'a', text: 'Your body heals itself.', bb: [Math.min(b1[0], b2[0]), b1[1], Math.max(b1[2], b2[2]), b2[3]] });
  }
}

// ---------- subtitles (screen space, on the paper) ----------
const subLines = () => VO.map(([id, t0, txt], i) => {
  const d = VDUR[id] || 2, next = VO[i + 1] ? VO[i + 1][1] : DUR;
  return { id, t0, t1: Math.min(next - .05, t0 + Math.max(1.8, d + .6)), text: txt };
});
let SUBS = [];
function drawSubs(t) {
  for (const s of SUBS) {
    const a = ss(seg(t, s.t0 - .05, s.t0 + .15)) * (1 - ss(seg(t, s.t1 - .15, s.t1))); if (a <= 0) continue;
    const lines = s.text.split('\n'); ctx.save();
    ctx.font = 'italic 500 54px "Cormorant Garamond"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const y0 = 1520 - (lines.length - 1) * 33;
    lines.forEach((ln, i) => {
      ctx.shadowColor = rgba(PAPER, 1); ctx.shadowBlur = 16; ctx.fillStyle = rgba(INK, .82 * a);
      ctx.fillText(ln, W / 2, y0 + i * 66); ctx.fillText(ln, W / 2, y0 + i * 66);
    });
    ctx.restore();
  }
}

// ---------- the frame ----------
function render(t) {
  NOTES.length = 0;
  screenXf(); ctx.globalAlpha = 1; ctx.drawImage(PAPER_IMG, 0, 0);
  worldXf(t);
  drawTop(t); drawFinger(t);
  ctx.save(); ctx.translate(0, 400); drawBone(t); drawLiver(t); ctx.restore();
  // notes beside the specimens
  note(t, T.skinNote, 560, 1006, 540, 1110, 'new skin, in days', { id: 'n1', size: 54, align: 'center', bend: -10 });
  note(t, T.boneNote, 590, 2240, 620, 2100, '6–8 weeks', { id: 'n2', size: 64, bend: 16 });
  note(t, T.livNote1, 420, 3100, 170, 2880, 'up to 2/3 removed', { id: 'n3', size: 64, bend: -16 });
  note(t, T.livNote2, 300, 3360, 500, 3480, '… and it grows back', { id: 'n4', size: 64, bend: 18 });
  // the whole page: one line per entry
  if (t > T.wideNotes[0] && t < T.wideNotes[1]) {
    const f = 1 - ss(seg(t, T.wideNotes[1] - .4, T.wideNotes[1]));
    ctx.globalAlpha = f;
    [['skin · days', 1080, 0], ['bone · weeks', 2080, .25], ['liver · grows back', 2880, .5]].forEach(([s, y, d], i) => {
      const bb = hand(s, 540, y, seg(t, T.wideNotes[0] + d, T.wideNotes[0] + d + .7), { size: 150, align: 'center', col: INK2 });
      if (bb && t >= T.wideNotes[0] + d) NOTES.push({ id: 'w' + i, text: s, bb });
    });
    ctx.globalAlpha = 1;
  }
  screenXf();
  drawSubs(t);
}

// texts on screen at t, in screen pixels, for readcheck
window.TEXTS = t => { render(t); const c = cam(t); return NOTES.map(n => ({ id: n.id, text: n.text, x0: (n.bb[0] - CX) * c.z + W / 2, y0: (n.bb[1] - c.y) * c.z + H / 2, x1: (n.bb[2] - CX) * c.z + W / 2, y1: (n.bb[3] - c.y) * c.z + H / 2 })); };

// sound and cue events for the mixer
window.EV = [
  ...[...'Did you know your body'.split(' ')].map((w, i) => ({ t: T.q1[0] + i * .22, type: 'pencil' })),
  ...[...'can heal itself?'.split(' ')].map((w, i) => ({ t: T.q2[0] + i * .3, type: 'pencil' })),
  { t: T.finger[0], type: 'brush', d: 2.2 }, { t: T.cut[0], type: 'slash' },
  ...Array.from({ length: 10 }, (_, i) => ({ t: T.plt[0] + i * .26, type: 'tick' })),
  { t: T.clot[0], type: 'brush', d: 1.2, soft: 1 }, { t: T.heal[0], type: 'brush', d: 3.6 },
  { t: T.skinNote[0] + .3, type: 'pencil', d: .7 },
  { t: 13.95, type: 'rustle', d: 2.7 }, { t: T.bone[0], type: 'brush', d: 2.0 }, { t: T.crack[0] - .05, type: 'crack' },
  { t: T.bridge[0], type: 'brush', d: 2.0, soft: 1 }, { t: T.ossify[0], type: 'brush', d: 2.6 }, { t: T.ossify[1], type: 'knock' },
  { t: T.boneNote[0] + .3, type: 'pencil', d: .7 },
  { t: T.liver[0], type: 'brush', d: 2.2 }, { t: T.erase[0], type: 'mist', d: 1.4 },
  { t: T.livNote1[0] + .3, type: 'pencil', d: .7 }, { t: T.regrow[0], type: 'brush', d: 4.0 },
  { t: T.livNote2[0] + .3, type: 'pencil', d: .7 },
  { t: 37.0, type: 'rustle', d: 3.0 }, { t: T.wideNotes[0], type: 'pencil', d: 1.4 },
  { t: 42.4, type: 'rustle', d: 2.4 }, { t: T.qErase[0], type: 'mist', d: .9 },
  { t: T.a1[0], type: 'pencil', d: .9 }, { t: T.a2[0], type: 'pencil', d: 1.0 }, { t: T.under[0], type: 'slash', soft: 1 },
  ...VO.map(([id, t0]) => ({ t: t0, type: 'vo', id })),
];
window.render = render;
(async () => {
  try { VDUR = await (await fetch('voice/dur.json')).json(); } catch (e) { VDUR = {}; }
  SUBS = subLines(); window.SUBS = SUBS;
  PAPER_IMG = new Image(); PAPER_IMG.src = 'paper.jpg'; await PAPER_IMG.decode();
  await Promise.all(['600 60px Caveat', 'italic 500 54px "Cormorant Garamond"'].map(f => document.fonts.load(f)));
  build();
  window.READY = true;
})();
