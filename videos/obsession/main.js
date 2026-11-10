// "Motivation / Discipline / Obsession" — signature Red Neon character. 1080×1920, 30 fps, silent (music added by the user).
import { drawNeon, skeleton, POSE, mixPose, sparks, floorGlow, DIM } from './neon.js';
const W = 1080, H = 1920, DUR = 27.0; window.DUR = DUR;
const cv = document.getElementById('c'), g = cv.getContext('2d');
const [off, o2] = (() => { const c = document.createElement('canvas'); c.width = W; c.height = H; return [c, c.getContext('2d')]; })();
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => clamp((t - a) / (b - a)), lerp = (a, b, u) => a + (b - a) * u;
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); }, eo = x => 1 - Math.pow(1 - clamp(x), 3), eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = x => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const RED = '#ff2338', WHITE = '#f4f5f8';
const OTHER = { motivation: { rim: '#e9eef6', hot: '#ffffff', glow: 'rgba(220,230,255,' }, discipline: { rim: '#3f8cff', hot: '#b8d6ff', glow: 'rgba(50,130,255,' } };

// ---------------- background: deep navy-black, soft vignette, faint drifting dust ----------------
function bg(t, tint = 0) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  const gr = g.createRadialGradient(W / 2, H * .45, 100, W / 2, H * .5, H * .75);
  gr.addColorStop(0, '#121420'); gr.addColorStop(1, '#030407'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (tint > 0) { const r = g.createRadialGradient(W / 2, H * .55, 0, W / 2, H * .55, 900); r.addColorStop(0, `rgba(255,20,48,${.22 * tint})`); r.addColorStop(1, 'rgba(255,20,48,0)'); g.fillStyle = r; g.fillRect(0, 0, W, H); }
  for (let i = 0; i < 40; i++) { const h = Math.sin(i * 91.7) * 43758.5, u = h - Math.floor(h), v = (Math.sin(i * 17.3) * 9631.2) % 1; const x = (u * W + t * 8 * (1 + i % 3)) % W, y = (Math.abs(v) * H - t * 14 * (1 + i % 2) + H * 4) % H; g.fillStyle = `rgba(200,210,255,${.05 + .05 * (i % 3)})`; g.fillRect(x, y, 2, 2); }
}

// ---------------- act 1 (0–14.2 s): three bars ----------------
const FLOOR = 1300, BAR = 860, PANEL = [[190, 'MOTIVATION', OTHER.motivation], [540, 'DISCIPLINE', OTHER.discipline], [890, 'OBSESSION', null]], SC = .5;
// rep curve: 0 hang → 1 chin over the bar, smooth in and out
const rep = (t, t0, per) => { if (t < t0) return 0; const u = ((t - t0) / per) % 1; return u < .5 ? eio(u * 2) : 1 - eio((u - .5) * 2); };
function hangAt(cx, pose, col, o = {}) {           // draw a character hanging with both hands on the bar at (cx, BAR)
  const k = skeleton(pose), hx = (k.A1.wr[0] + k.A2.wr[0]) / 2, hy = (k.A1.wr[1] + k.A2.wr[1]) / 2;
  return drawNeon(g, cx - hx * SC, BAR + 8 - hy * SC + (o.dy || 0), SC, pose, { col, glow: o.glow ?? 1 });
}
function bars(t, a) {
  for (const [cx, label] of PANEL) {
    const k = eo(seg(t, a.t0 + (cx - 190) / 350 * .25, a.t0 + .5 + (cx - 190) / 350 * .25));
    g.strokeStyle = `rgba(200,205,215,${.85 * k})`; g.lineWidth = 9; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 125, FLOOR); g.lineTo(cx - 125, lerp(FLOOR, BAR, k)); g.moveTo(cx + 125, FLOOR); g.lineTo(cx + 125, lerp(FLOOR, BAR, k)); g.stroke();
    if (k > .6) { g.beginPath(); g.moveTo(cx - 132, BAR); g.lineTo(lerp(cx - 132, cx + 132, seg(k, .6, 1)), BAR); g.stroke(); }
    const lk = back(seg(t, a.t0 + .2 + (cx - 190) / 350 * .35, a.t0 + .6 + (cx - 190) / 350 * .35));
    if (lk > 0) { g.save(); g.translate(cx, 760); g.scale(lk, lk); g.font = '62px Anton'; g.textAlign = 'center'; g.fillStyle = label === 'OBSESSION' ? RED : WHITE;
      if (label === 'OBSESSION') { g.shadowColor = 'rgba(255,30,60,.8)'; g.shadowBlur = 24; } g.fillText(label, 0, 0); g.restore(); }
  }
  g.strokeStyle = 'rgba(230,232,240,.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, FLOOR + 4); g.lineTo(W, FLOOR + 4); g.stroke();
}
function standAt(cx, pose, col, glow = 1) { return drawNeon(g, cx, FLOOR, SC, pose, { col, glow }); }
function act1(t) {
  // camera: slow push in, then a whip zoom into the OBSESSION bar
  const z = lerp(1, 1.06, seg(t, 0, 13.4)) * Math.pow(9, eio(seg(t, 13.4, 14.2))), fx = lerp(W / 2, 890, eio(seg(t, 12.8, 14.0))), fy = lerp(1040, 1000, seg(t, 12.8, 14));
  g.setTransform(z, 0, 0, z, W / 2 - fx * z, H / 2 + 60 - fy * z);
  floorGlow(g, 890, FLOOR, .9, .25 + .25 * seg(t, 9, 13));
  bars(t, { t0: 0 });
  // MOTIVATION: jumps up, a few slow reps, lets go at 3.6, shrugs, walks off and sits down
  {
    const cx = 190, C = OTHER.motivation;
    if (t < .7) standAt(cx, mixPose(POSE.stand, { ...POSE.stand, a1: -2.6, f1: -2.7, y: 30 }, ss(seg(t, .3, .7))), C);
    else if (t < 3.6) hangAt(cx, mixPose(POSE.hang, POSE.top, rep(t, .9, 1.5) * (t < 3.0 ? 1 : .35)), C);
    else if (t < 4.0) { const u = seg(t, 3.6, 4.0); hangAt(cx, POSE.hang, C, { dy: 260 * u * u }); }
    else if (t < 5.0) standAt(cx, mixPose({ ...POSE.stand, y: 40 }, { ...POSE.stand, head: .35, a1: .25, f1: .2 }, ss(seg(t, 4.0, 4.6))), C);
    else if (t < 6.4) { const u = seg(t, 5.0, 6.4), ph = Math.floor(t * 30) / 30; standAt(lerp(cx, cx - 70, eio(u)), mixPose(POSE.walkA, POSE.walkB, .5 + .5 * Math.sin(ph * 7.5)), C); }
    else standAt(cx - 70, mixPose(POSE.stand, POSE.sitFloor, ss(seg(t, 6.4, 7.1))), C);
    if (t > 9.4 && t < 12.6) { const k = back(seg(t, 9.4, 9.7)) * (1 - ss(seg(t, 12.3, 12.6))); g.save(); g.translate(cx - 40, 1040); g.scale(k, k); g.font = '700 40px Inter'; g.textAlign = 'center'; g.fillStyle = WHITE; g.fillText('Nah.', 0, 0); g.restore(); }
  }
  // DISCIPLINE: the same steady rep, every time
  { const cx = 540, C = OTHER.discipline;
    if (t < .8) standAt(cx, mixPose(POSE.stand, { ...POSE.stand, a1: -2.6, f1: -2.7, y: 30 }, ss(seg(t, .4, .8))), C);
    else hangAt(cx, mixPose(POSE.hang, POSE.top, rep(t, 1.0, 1.25)), C); }
  // OBSESSION (us): fast reps, slips and falls hard, gets straight back up and goes harder; sparks on every rep at the end
  { const cx = 890;
    if (t < .9) standAt(cx, mixPose(POSE.stand, { ...POSE.stand, a1: -2.6, f1: -2.7, y: 30 }, ss(seg(t, .5, .9))));
    else if (t < 6.8) hangAt(cx, mixPose(POSE.hang, POSE.top, rep(t, 1.0, .8)));
    else if (t < 7.25) { const u = seg(t, 6.8, 7.25); hangAt(cx, mixPose(POSE.hang, { ...POSE.hang, a1: -2.6, f1: -3.4 }, u), null, { dy: 380 * u * u }); }
    else if (t < 8.4) {                     // flat on the floor, red glow flickers
      g.save(); g.translate(cx + 40, FLOOR - 22); g.rotate(-Math.PI / 2 * (1 - .06 * Math.sin(t * 9) * seg(t, 7.25, 7.6))); drawNeon(g, 0, 0, SC, { ...POSE.stand, a1: -.6, f1: .4, q1: -.3, k1: .5 }, { glow: .55 + .45 * Math.abs(Math.sin(t * 13)) }); g.restore();
    } else if (t < 9.1) standAt(cx, mixPose({ ...POSE.kneel }, POSE.stand, eo(seg(t, 8.4, 9.0))));
    else if (t < 9.4) { const u = seg(t, 9.1, 9.4); standAt(cx, mixPose({ ...POSE.stand, y: 60 }, { ...POSE.stand, a1: -2.7, f1: -2.8, y: -120 }, eo(u))); }
    else if (t < 13.4) { const per = lerp(.62, .45, seg(t, 9.4, 13)); hangAt(cx, mixPose(POSE.hang, POSE.top, rep(t, 9.4, per)));
      for (let k = 0; k < 9; k++) { const tk = 10.6 + k * .32; sparks(g, cx, BAR - 40, t - tk, { seed: 10 + k, scale: .35 + k * .05, n: 30 + k * 6, life: 1 }); } }
    else hangAt(cx, POSE.top);
    if (t > 12.9) sparks(g, cx, BAR - 60, t - 12.9, { seed: 77, scale: 1.1, n: 120, life: 1.4 });
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
}

// ---------------- act 2 (14.0–27 s): kinetic type with the character ----------------
function word(txt, x, y, size, t, t0, o = {}) {   // a word that springs in, optional red marker behind it
  const k = back(seg(t, t0, t0 + .32)); if (k <= 0) return 0;
  g.save(); g.font = `${size}px ${o.font || 'Anton'}`; g.textAlign = o.align || 'center'; g.textBaseline = 'middle';
  const w = g.measureText(txt).width;
  if (o.mark) { const m = eo(seg(t, t0 + .25, t0 + .55)), x0 = (o.align === 'left' ? x : x - w / 2) - 14; g.fillStyle = RED; g.shadowColor = 'rgba(255,30,60,.7)'; g.shadowBlur = 26;
    g.beginPath(); g.moveTo(x0, y - size * .38); g.lineTo(x0 + (w + 28) * m, y - size * .42); g.lineTo(x0 + (w + 28) * m, y + size * .36); g.lineTo(x0, y + size * .4); g.fill(); g.shadowBlur = 0; }
  g.translate(x, y); g.scale(k, k); g.globalAlpha = clamp(k * 2);
  g.fillStyle = o.color || WHITE; if (o.glow) { g.shadowColor = 'rgba(255,30,60,.85)'; g.shadowBlur = 30; } g.fillText(txt, 0, 0);
  g.restore(); return w;
}
const fadeOut = (t, a, b) => 1 - ss(seg(t, a, b));
function card1(t) {        // the definition
  const A = fadeOut(t, 17.6, 18.0); g.globalAlpha = A;
  const k = eo(seg(t, 14.1, 14.6)), dy = lerp(80, 0, k);
  g.globalAlpha = A * k; g.font = '150px "DM Serif Display"'; g.fillStyle = WHITE; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('obsession', 110, 640 + dy);
  g.font = 'italic 48px "DM Serif Display"'; g.fillStyle = 'rgba(244,245,248,.75)'; g.fillText('/əbˈsɛʃ(ə)n/  noun', 116, 730 + dy);
  g.globalAlpha = A; g.strokeStyle = RED; g.lineWidth = 6; g.shadowColor = 'rgba(255,30,60,.8)'; g.shadowBlur = 18;
  g.beginPath(); g.moveTo(116, 790); g.lineTo(116 + 840 * eo(seg(t, 14.5, 15.1)), 790); g.stroke(); g.shadowBlur = 0;
  const lines = ['what lazy people call', 'the work of the dedicated.'];
  g.font = '58px "DM Serif Display"'; g.fillStyle = WHITE;
  lines.forEach((ln, i) => { const r = seg(t, 15.0 + i * .7, 15.7 + i * .7); g.save(); g.beginPath(); g.rect(110, 840 + i * 80, 900 * eo(r), 90); g.clip(); g.fillText(ln, 116, 900 + i * 80); g.restore(); });
  g.globalAlpha = 1;
  // the character keeps repping on a bar under the text
  const bx = 540, by = 1240; g.strokeStyle = 'rgba(200,205,215,.8)'; g.lineWidth = 8; g.lineCap = 'round';
  g.beginPath(); g.moveTo(bx - 120, by); g.lineTo(bx + 120, by); g.stroke();
  const pose = mixPose(POSE.hang, POSE.top, rep(t, 14.2, .55)), sk = skeleton(pose), hx = (sk.A1.wr[0] + sk.A2.wr[0]) / 2, hy = (sk.A1.wr[1] + sk.A2.wr[1]) / 2;
  g.globalAlpha = A; drawNeon(g, bx - hx * .55, by + 8 - hy * .55, .55, pose); g.globalAlpha = 1;
}
function card2(t) {        // Motivation starts it. / Obsession finishes it.
  const A = fadeOut(t, 21.2, 21.55); if (A <= 0) return; g.globalAlpha = A;
  const drift = (t - 18) * 6;
  word('MOTIVATION', 540, 620 - drift, 140, t, 18.0); word('STARTS IT.', 540, 760 - drift, 140, t, 18.35);
  word('OBSESSION', 540, 1010 - drift, 160, t, 19.2, { color: '#fff', mark: true }); word('FINISHES IT.', 540, 1170 - drift, 140, t, 19.55, { color: RED, glow: true });
  // the character sprints across underneath
  const u = seg(t, 19.0, 21.4), ph = Math.floor(t * 30) / 30;
  drawNeon(g, lerp(-150, 1250, u), 1720, .62, mixPose(POSE.runA, POSE.runB, .5 + .5 * Math.sin(ph * 13)));
  g.globalAlpha = 1;
}
function card3(t) {        // Keep going until it looks easy.
  const A = fadeOut(t, 23.9, 24.25); if (A <= 0) return; g.globalAlpha = A;
  const s = 1 + (t - 21.4) * .02; g.save(); g.translate(540, 900); g.scale(s, s); g.translate(-540, -900);
  word('KEEP', 540, 600, 190, t, 21.5); word('GOING', 540, 790, 190, t, 21.75, { mark: true });
  word('UNTIL IT', 540, 980, 120, t, 22.4); word('LOOKS EASY.', 540, 1110, 130, t, 22.65, { color: RED, glow: true });
  g.restore();
  // the character pushes a heavy block across the floor
  const u = seg(t, 21.5, 24.2), x = lerp(150, 560, eio(u));
  g.fillStyle = '#0b0c12'; g.strokeStyle = 'rgba(220,225,235,.85)'; g.lineWidth = 4; g.beginPath(); g.rect(x + 120, 1390, 210, 180); g.fill(); g.stroke();
  drawNeon(g, x, 1570, .5, mixPose(POSE.push, { ...POSE.push, q1: .4, q2: -.6, k1: .2, k2: .45 }, .5 + .5 * Math.sin(t * 7)));
  g.strokeStyle = 'rgba(230,232,240,.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 1572); g.lineTo(W, 1572); g.stroke();
  g.globalAlpha = 1;
}
function card4(t) {        // the win
  const k = eo(seg(t, 24.2, 24.8));
  floorGlow(g, 540, 1420, 1.4, .55 * k);
  const jump = Math.max(0, Math.sin(Math.PI * seg(t, 24.35, 24.95))) * 180;
  const pose = t < 24.35 ? mixPose(POSE.stand, { ...POSE.stand, y: 70, a1: .4, f1: .4 }, ss(seg(t, 24.15, 24.35))) : t < 24.95 ? POSE.jump : mixPose(POSE.jump, POSE.victory, eo(seg(t, 24.95, 25.2)));
  drawNeon(g, 540, 1420 - jump, .8, pose, { glow: 1.25 });
  g.strokeStyle = 'rgba(230,232,240,.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 1424); g.lineTo(W, 1424); g.stroke();
  [[24.7, 540, 820, 1, 2.0], [25.05, 300, 640, 21, 1.4], [25.3, 800, 600, 22, 1.4], [25.7, 420, 470, 23, 1.2], [26.0, 700, 760, 24, 1.3]].forEach(([t0, x, y, seed, sc]) => sparks(g, x, y, t - t0, { seed, scale: sc, n: 110, life: 1.6 }));
  word('STAY', 540, 430, 200, t, 24.9); word('OBSESSED.', 540, 640, 200, t, 25.15, { color: RED, glow: true });
}

function render(t) {
  if (t < 14.15) { bg(t, seg(t, 9, 13)); act1(t); }
  else { bg(t, t > 24 ? 1 : .4); g.setTransform(1, 0, 0, 1, 0, 0);
    if (t < 18.05) card1(t); else if (t < 21.6) card2(t); else if (t < 24.3) card3(t); else card4(t); }
  // whip transitions: a red flash and a horizontal smear across each cut
  for (const [tc, d] of [[14.15, .22], [18.0, .2], [21.55, .2], [24.25, .2]]) {
    const u = 1 - Math.abs(t - tc) / d; if (u <= 0) continue;
    g.setTransform(1, 0, 0, 1, 0, 0); o2.setTransform(1, 0, 0, 1, 0, 0); o2.clearRect(0, 0, W, H); o2.drawImage(cv, 0, 0);
    for (let i = 1; i <= 6; i++) { g.globalAlpha = .18 * u; g.drawImage(off, (t < tc ? -1 : 1) * i * 28 * u, 0); }
    g.globalAlpha = .35 * u * u; g.fillStyle = RED; g.fillRect(0, 0, W, H); g.globalAlpha = 1;
  }
}
window.render = render;
window.TEXTS = () => [];
(async () => { await Promise.all(['62px Anton', '150px "DM Serif Display"', 'italic 48px "DM Serif Display"', '700 40px Inter'].map(f => document.fonts.load(f))); window.READY = true; })();
