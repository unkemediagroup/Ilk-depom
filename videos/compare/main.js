// "Stop Comparing Your Life to Others" — every line its own literal image. AYAZ, red (kor) only. Voice by the creator, no music. 1080×1920, 30 fps.
import { drawNeon as ayaz, POSE, mixPose, sparks, emberGround } from './neon.js';
const W = 1080, H = 1920, DUR = 30.2; window.DUR = DUR;
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
const KEY = /comparing|chapter|1|20|social|highlight|reel|victories|behind|scenes|struggles|doubts|failures|measure|timeline|rob|peace|momentum|journey|unique|own|beat|yesterday|run|race/i;
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
  read: { ...POSE.hero, head: .35, a1: -1.3, a2: -1.1, f1: -1.2, f2: -1.2 },
  phone: { ...POSE.hero, head: .3, a1: -1.0, a2: -1.5, f1: .1, f2: -.2 },
  slump: { ...POSE.stand, lean: .22, head: .7, a1: .1, a2: -.05, f1: .05, f2: -.05 },
  brace: { ...POSE.hero, lean: .55, head: .1, a1: -.9, a2: -1.5, f1: .3, f2: -.6, q1: -.75, k1: .5, q2: .55, k2: .2, y: 30 },
  braceB: { ...POSE.hero, lean: .55, head: .1, a1: -.9, a2: -1.5, f1: .3, f2: -.6, q1: .35, k1: .5, q2: -.65, k2: .3, y: 30 },
  head2: { ...POSE.hero, lean: .1, head: .45, a1: -2.6, a2: -1.6, f1: -2.4, f2: -1.7 },
  measure: { ...POSE.hero, head: .15, a1: -1.4, a2: -.1, f1: -1.3, f2: -.2 },
  reach: { ...POSE.hero, lean: -.1, head: -.1, a1: -1.9, a2: -.1, f1: .2, f2: -.3 },
};
const walk = t => mixPose(POSE.walkA, POSE.walkB, .5 + .5 * Math.sin(t * 7));
const run = (t, f = 15) => mixPose(POSE.runA, POSE.runB, .5 + .5 * Math.sin(t * f));
const CROWD = { rim: '#34343e', hot: '#4a4a55', glow: 'rgba(80,80,100,' };
const grey = (x, y, s, pose, a = 1) => { g.save(); g.globalAlpha *= a; ayaz(g, x, y, s, pose, { col: CROWD, glow: .5 }); g.restore(); };
// "you, yesterday": AYAZ's own silhouette, drained to grey and half transparent
const ghost = (x, y, s, pose, a = .5) => { g.save(); g.globalAlpha *= a; g.filter = 'grayscale(1) brightness(.75)'; ayaz(g, x, y, s, pose, { t: T0, mode: 'kor', glow: .4 }); g.filter = 'none'; g.restore(); };
function book(x, y, wd, ht, thick, title, col, pagesFlip = 0) {
  neon(c => { c.moveTo(x - wd, y); c.lineTo(x, y + 30); c.lineTo(x + wd, y); c.lineTo(x + wd, y - ht); c.lineTo(x, y - ht + 30); c.lineTo(x - wd, y - ht); c.closePath(); c.moveTo(x, y + 30); c.lineTo(x, y - ht + 30); }, col, 4, 16, 'rgba(18,18,24,.95)');
  for (let i = 0; i < thick; i++) line(x - wd + 6, y + 6 + i * 6, x, y + 36 + i * 6, 'rgba(200,200,215,.35)', 2);
  if (pagesFlip > 0) for (let i = 0; i < 4; i++) { const ph = (pagesFlip * 4 + i * .25) % 1; g.save(); g.translate(x, y + 30); g.scale(Math.cos(ph * Math.PI), 1); neon(c => { c.moveTo(0, 0); c.lineTo(wd * .95, -30); c.lineTo(wd * .95, -ht + 6); c.lineTo(0, -ht + 36); c.closePath(); }, '#9a9aa6', 2, 4, 'rgba(30,30,38,.9)', .8); g.restore(); }
  label(title, x - wd / 2, y - ht / 2 + 15, 54, col === RED ? RED : '#b8b8c4', 1, .05);
}

// ---------------- scenes ----------------
const F = {
  ch1(t, a, b) {           // a thin first book — CHAPTER 1 — he's standing on its first page
    bg(t, .2); cam(540, 1150, lerp(1.25, 1.1, seg(t, a, b)), -.03);
    const k = eo(seg(t, a, a + .5)); g.save(); g.translate(500, 1530); g.scale(k, k); g.translate(-500, -1530); book(500, 1530, 280, 440, 2, 'CHAPTER 1', RED); g.restore();
    line(-300, 1562, 1400, 1562); A(890, 1560, .8, P.read); ground(890, 1560, .8, .5);     // standing beside his thin first book
  },
  ch20(t, a, b) {          // someone else's book is huge — CHAPTER 20, pages flying, a grey figure on a podium on top
    bg(t, .1); const u = eo(seg(t, a, a + .6)); cam(540, lerp(1300, 1050, u), lerp(1.2, .7, u));
    book(540, 1600, 420, 900, 18, 'CHAPTER 20', '#c8c8d2', seg(t, a + .3, b));
    neon(c => { c.rect(400, 700, 280, 110); c.rect(440, 620, 200, 80); }, '#9a9aa6', 4, 8, '#121218'); grey(540, 620, .55, POSE.victory);
    A(1030, 1600, .45, { ...POSE.hero, head: -.35 });     // tiny, at the foot of it, looking up
  },
  feed(t, a, b) {          // the phone: a feed of grey victories scrolls past, likes pop
    bg(t, .15); cam(540, 980, lerp(1.0, 1.08, seg(t, a, b)));
    neon(c => { c.roundRect(240, 300, 600, 1240, 70); }, '#d8d8e4', 6, 24, 'rgba(10,10,14,.96)');
    g.save(); g.beginPath(); g.roundRect(262, 330, 556, 1180, 50); g.clip();
    const sc = (t - a) * 520, POSTS = [['TROPHY', POSE.victory], ['NEW CAR', POSE.hero], ['VACATION', POSE.jump], ['PROMOTION', POSE.victory], ['6-PACK', POSE.hero], ['MILLIONS', POSE.jump]];
    for (let i = 0; i < 7; i++) { const y = 360 + i * 420 - sc % 420, idx = (i + Math.floor(sc / 420)) % POSTS.length, [cap, pose] = POSTS[idx];
      neon(c => { c.roundRect(290, y, 500, 380, 24); }, '#5a5a66', 3, 0, 'rgba(26,26,34,.95)'); grey(540, y + 290, .38, pose); label(cap, 540, y + 50, 46, WHITE);
      neon(c => { const hx = 340, hy = y + 340; c.moveTo(hx, hy + 8); c.bezierCurveTo(hx - 22, hy - 10, hx - 8, hy - 26, hx, hy - 12); c.bezierCurveTo(hx + 8, hy - 26, hx + 22, hy - 10, hx, hy + 8); }, '#ffffff', 3, 10); label((12 + idx * 37) + 'K', 410, y + 335, 34, WHITE); }
    g.restore();
    for (let i = 0; i < 6; i++) { const t0 = a + .2 + i * .3, u = seg(t, t0, t0 + .9); if (u <= 0 || u >= 1) continue; label('♥', 860 + Math.sin(i * 2) * 60, lerp(1200, 600, u), 70, WHITE, 1 - u); }
  },
  reel(t, a, b) {          // "highlight reel": a film strip of grey victories rolls by, only the wins
    bg(t, .12); cam(540, 960, 1.05, .12); const sc = (t - a) * 700;
    for (let i = -2; i < 6; i++) { const x = 160 + i * 380 - sc % 380; neon(c => { c.rect(x, 650, 340, 520); }, '#c8c8d2', 4, 14, 'rgba(20,20,26,.9)');
      for (let h = 0; h < 6; h++) { neon(c => { c.rect(x + 20 + h * 52, 610, 30, 24); c.rect(x + 20 + h * 52, 1186, 30, 24); }, '#8a8a96', 2, 0); }
      grey(x + 170, 1090, .5, [POSE.victory, POSE.jump, POSE.hero][((i % 3) + 3) % 3]); }
    label('VICTORIES', 540, 1360, 100, WHITE, back(seg(t, w('victories') - .05, w('victories') + .2)));
  },
  bts(t, a, b) {           // pull back from the phone: it's him, alone in the dark, holding it — BEHIND THE SCENES
    bg(t, .05); const u = eo(seg(t, a, a + .9)); cam(lerp(560, 540, u), lerp(980, 1180, u), lerp(2.6, 1.05, u));
    const k = A(470, 1560, .9, P.phone); const [hx, hy] = hand(k, 470, 1560, .9);
    neon(c => { c.roundRect(hx - 22, hy - 70, 44, 78, 8); }, '#d8d8e4', 3, 20, 'rgba(220,225,240,.5)');
    g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createRadialGradient(hx, hy - 30, 0, hx, hy - 30, 260); lg.addColorStop(0, 'rgba(210,220,255,.3)'); lg.addColorStop(1, 'rgba(210,220,255,0)'); g.fillStyle = lg; g.fillRect(hx - 300, hy - 330, 600, 600); g.restore();
    const ck = back(seg(t, w('behind') - .05, w('behind') + .25)); if (ck > 0) { g.save(); g.translate(760, 860); g.scale(ck * 1.35, ck * 1.35); g.rotate(-.08);
      neon(c => { c.rect(-160, -40, 320, 200); }, '#c8c8d2', 4, 12, '#121218'); g.save(); g.rotate(-.25 * (1 - seg(t, w('scenes'), w('scenes') + .15))); neon(c => { c.rect(-160, -100, 320, 60); }, '#c8c8d2', 4, 12, '#121218'); g.restore();
      label('BEHIND', 0, 30, 60, WHITE); label('THE SCENES', 0, 100, 54, RED); g.restore(); }
    line(-300, 1560, 1400, 1560);
  },
  struggle(t, a, b) {      // struggles (a gale pushes him back), doubts (question marks circle his head), failures (red X's stamp the ground)
    const d1 = w('doubts'), f1 = w('failures'); bg(t, .2); cam(540, 1180, 1.15, 0, ...shake(t, f1, 18));
    line(-300, 1560, 1400, 1560);
    if (t < d1) { for (let i = 0; i < 22; i++) { const y = 700 + hash(i) * 900, x = ((hash(i + 1) * W * 1.4 + (t - a) * 1900) % (W + 400)) - 300; neon(c => { c.moveTo(x, y); c.quadraticCurveTo(x - 80, y - 20, x - 200, y); }, '#9ab0ff', 2, 6, null, .5); }
      A(560 - Math.sin((t - a) * 3) * 10, 1560, .95, mixPose(P.brace, P.braceB, .5 + .5 * Math.sin((t - a) * 5)), { wind: 1 }); }
    else { const k = A(540, 1560, .95, mixPose(P.brace, P.head2, eo(seg(t, d1, d1 + .3)))), hx = 540 + k.head[0] * .95, hy = 1560 + k.head[1] * .95;
      for (let i = 0; i < 4; i++) { const an = t * 3 + i * Math.PI / 2; label('?', hx + Math.cos(an) * 170, hy - 40 + Math.sin(an) * 60, 90, WHITE, eo(seg(t, d1 + i * .08, d1 + .3 + i * .08)) * (1 - seg(t, f1, f1 + .2) * .5)); }
      [[200, 1450], [880, 1380], [320, 1250], [760, 1180]].forEach(([x, y], i) => { const s2 = back(seg(t, f1 + i * .12, f1 + .2 + i * .12)); if (s2 <= 0) return; g.save(); g.translate(x, y); g.scale(s2, s2); g.rotate(.2 * (i % 2 ? 1 : -1));
        neon(c => { c.moveTo(-60, -60); c.lineTo(60, 60); c.moveTo(60, -60); c.lineTo(-60, 60); }, RED, 16, 30); g.restore(); }); }
  },
  bars(t, a, b) {          // two timelines: someone else's bar is far ahead, his barely started
    bg(t, .15); cam(540, 1000, lerp(1.0, 1.06, seg(t, a, b)));
    const p1 = eo(seg(t, a + .1, a + .9)) * .92, p2 = eo(seg(t, a + .3, a + 1.1)) * .18;
    [[640, 'SOMEONE ELSE', p1, '#c8c8d2'], [980, 'YOU', p2, RED]].forEach(([y, nm, p, col]) => { label(nm, 200, y - 80, 52, col === RED ? RED : '#b8b8c4', 1, 0); g.save(); g.textAlign = 'left'; g.restore();
      neon(c => { c.roundRect(100, y, 880, 80, 40); }, col, 4, 12, 'rgba(15,15,20,.9)'); g.save(); g.shadowColor = col; g.shadowBlur = 20; g.fillStyle = col; g.beginPath(); g.roundRect(108, y + 8, 864 * p, 64, 32); g.fill(); g.restore(); label(Math.round(p * 100) + '%', 900, y - 70, 60, col); });
    A(300, 1560, .7, { ...POSE.hero, head: -.2 }); line(-300, 1560, 1400, 1560); grey(800, 1560, .7, POSE.victory, .8);
  },
  ruler(t, a, b) {         // he holds a measuring tape against the other's timeline — it never reaches
    bg(t, .12); cam(540, 1150, lerp(1.1, 1.2, seg(t, a, b)), -.03);
    line(-300, 1560, 1400, 1560); grey(880, 1560, 1.0, POSE.hero); const ext = eo(seg(t, a + .2, b - .3));
    const k = A(260, 1560, .95, P.measure), [hx, hy] = hand(k, 260, 1560, .95), x2 = lerp(hx + 10, 740, ext);
    neon(c => { c.rect(hx - 20, hy - 30, 40, 60); }, '#c8c8d2', 4, 10, '#18181f'); g.save(); g.shadowColor = '#ffcf4a'; g.shadowBlur = 14; g.fillStyle = '#d8b84a'; g.fillRect(hx + 20, hy - 14, x2 - hx - 20, 28); g.restore();
    for (let x = hx + 40; x < x2; x += 30) line(x, hy - 14, x, hy - 2, '#3a2a10', 3);
    label('TIMELINE', 880, 760, 80, '#b8b8c4', back(seg(t, w('timeline') - .05, w('timeline') + .2)));
  },
  rob(t, a, b) {           // a grey hand snatches his peace (a calm orb) and jams his momentum wheel
    const grab = w('peace') - .05, stop = w('momentum'); bg(t, .2); cam(540, 1150, 1.05, 0, ...shake(t, grab, 18));
    line(-300, 1560, 1400, 1560);
    const ox = t < grab ? 540 : lerp(540, 1300, ei(seg(t, grab + .1, grab + .6))), oy = t < grab ? 760 + Math.sin(t * 2) * 12 : lerp(760, 400, ei(seg(t, grab + .1, grab + .6)));
    neon(c => { c.arc(ox, oy, 70, 0, 7); }, '#d8e4ff', 4, 40, 'rgba(210,225,255,.25)'); label('PEACE', ox, oy, 34, WHITE, back(seg(t, w('peace') - .1, w('peace') + .1)));
    const hk = seg(t, grab - .35, grab), hx = lerp(1300, ox + 60, eo(hk)), hy = oy - 20;
    neon(c => { c.moveTo(1400, hy - 40); c.lineTo(hx + 40, hy - 30); c.lineTo(hx, hy - 50); c.lineTo(hx - 20, hy - 20); c.lineTo(hx, hy + 20); c.lineTo(hx + 40, hy + 30); c.lineTo(1400, hy + 40); }, '#6a6a76', 5, 8, '#0c0c10');
    const sp = t < stop ? 4 : 4 * (1 - eo(seg(t, stop, stop + .7))), ang = (t - a) * sp; g.save(); g.translate(280, 1100); g.rotate(ang); neon(c => { c.arc(0, 0, 110, 0, 7); for (let i = 0; i < 6; i++) { c.moveTo(0, 0); c.lineTo(Math.cos(i * Math.PI / 3) * 105, Math.sin(i * Math.PI / 3) * 105); } }, sp > 1 ? RED : '#6a6a76', 5, 18); g.restore();
    label('MOMENTUM', 280, 920, 52, sp > 1 ? RED : GREY, back(seg(t, stop - .05, stop + .2)));
    A(700, 1560, .8, mixPose({ ...POSE.hero }, P.slump, eo(seg(t, grab, b - .2))));
  },
  unique(t, a, b) {        // his own path: a winding red line draws itself just ahead of his feet, unlike any other
    bg(t, .2); const u = seg(t, a, b); cam(lerp(320, 780, u), 1250, 1.15, Math.sin(t) * .03);
    for (let i = 0; i < 4; i++) neon(c => { c.moveTo(-200, 1700 - i * 60); c.lineTo(1500, 1700 - i * 60); }, '#2e2e38', 3, 0, null, .7);
    const pathY = x => 1520 + Math.sin(x / 140) * 50 + Math.sin(x / 47) * 12, px = lerp(160, 1000, u);
    neon(c => { for (let x = 0; x <= px + 60; x += 10) x ? c.lineTo(x, pathY(x)) : c.moveTo(x, pathY(x)); }, RED, 6, 26);
    A(px, pathY(px), .75, walk(t), { wind: .3 });
  },
  hourglass(t, a, b) {     // "your timeline is your own": close-up — the hourglass on his chest turns over (the peak ritual)
    bg(t, .5); const z = lerp(3.4, 3.0, seg(t, a, b)), k = ayaz(g, -9999, -9999, 1, POSE.hero, { t: T0 });   // measure only
    const chest = [540 + (k.hip[0] + (k.shoulder[0] - k.hip[0]) * .62), 1560 + (k.hip[1] + (k.shoulder[1] - k.hip[1]) * .62)];
    cam(chest[0], chest[1], z, Math.sin(t * 1.5) * .04); A(540, 1560, 1.0, POSE.hero);
    for (let r = 1; r < 5; r++) neon(c => { c.arc(chest[0], chest[1], r * 50 + ((t - a) * 60) % 50, 0, 7); }, RED, 2, 14, null, .25 / r);
    sparks(g, chest[0], chest[1], t - (w('own') + .1), { seed: 7, scale: .45, n: 100, life: 1.1 });
  },
  yesterday(t, a, b) {     // the only rival: "you, yesterday" — his own silhouette in grey, a step ahead… then a step behind
    bg(t, .25); const beat = w('beat'), u = seg(t, beat, beat + .8); cam(560, 1150, 1.1, 0);
    for (let i = 0; i < 9; i++) { const x = ((i * 180 - (t - a) * 520) % 1620 + 1620) % 1620 - 270; line(x, 1562, x + 90, 1562, 'rgba(255,255,255,.35)', 3); }
    label('YESTERDAY', lerp(700, 380, eo(u)), 820, 64, GREY, back(seg(t, w('yesterday') - .05, w('yesterday') + .2)));
    ghost(lerp(700, 380, eo(u)), 1560, .9, run(t), .55); A(lerp(420, 700, eo(u)), 1560, .9, run(t + .2), { wind: 1 });
  },
  race(t, a, b) {          // RUN YOUR OWN RACE: one red lane in a track of grey ones; he breaks the tape
    bg(t, .8); const u = seg(t, a, b - .3); cam(540, 1150, lerp(1.0, 1.12, u));
    for (let l = 0; l < 6; l++) { const x0 = 540 + (l - 2.5) * 240, x1 = 540 + (l - 2.5) * 40; neon(c => { c.moveTo(x0, 1920); c.lineTo(x1, 900); }, l === 2 || l === 3 ? RED : '#3a3a44', l === 2 || l === 3 ? 5 : 3, l === 2 || l === 3 ? 24 : 0); }
    for (let i = 0; i < 10; i++) { const d = ((i / 10 + (t - a) * 1.4) % 1), y = lerp(900, 1920, d * d), half = lerp(20, 120, d * d); line(540 - half, y, 540 + half, y, 'rgba(255,42,60,.35)', 2 + 4 * d); }
    const tape = w('race'); if (t < tape) neon(c => { c.moveTo(300, 1280); c.lineTo(780, 1280); }, '#ffffff', 5, 20);
    else { const k = eo(seg(t, tape, tape + .5)); neon(c => { c.moveTo(300, 1280); c.quadraticCurveTo(380, 1280 + 160 * k, 420 - 120 * k, 1500 * k + 1280 * (1 - k)); c.moveTo(780, 1280); c.quadraticCurveTo(700, 1280 + 160 * k, 660 + 120 * k, 1500 * k + 1280 * (1 - k)); }, '#ffffff', 5, 20); }
    A(540, 1560, 1.0, run(t, 17), { wind: 1, glow: 1.4 });
    label('RUN YOUR', 540, 470, 150, WHITE, back(seg(t, w('run') - .05, w('run') + .2))); label('OWN RACE.', 540, 640, 150, RED, back(seg(t, w('own', 28) - .05, w('own', 28) + .2)));
    sparks(g, 540, 1280, t - tape, { seed: 99, scale: 1.2, n: 130, life: 1.3 });
  },
};
const SC = [];
function scenes() {
  const T = [0, w('someone'), w('social'), w('highlight'), w('while'), w('struggles'), w('every'), w('someone', 14), w('you', 16), w('your', 19), w('your', 22), w('and', 23.5), w('run'), DUR];
  const N = ['ch1', 'ch20', 'feed', 'reel', 'bts', 'struggle', 'bars', 'ruler', 'rob', 'unique', 'hourglass', 'yesterday', 'race'];
  N.forEach((n, i) => SC.push([n, T[i], T[i + 1]]));
}
function render(t) {
  T0 = t; HG = eio(seg(t, w('own') - .2, w('own') + .4));     // the peak ritual: the hourglass turns on "your timeline is your OWN"
  let i = 0; while (i < SC.length - 1 && t >= SC[i + 1][1]) i++;
  const [n, a, b] = SC[i]; F[n](t, a, b);
  if (n !== 'race') captions(t, 220);
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
