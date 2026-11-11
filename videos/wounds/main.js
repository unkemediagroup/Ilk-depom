// "How Do Our Wounds Actually Heal?" — neon micro-world + the signature Red Neon character. 1080×1920, 30 fps, voice only.
import { drawNeon, POSE, mixPose, sparks } from './neon.js';
const W = 1080, H = 1920;
const cv = document.getElementById('c'), g = cv.getContext('2d');
const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H; const tg = tmp.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => clamp((t - a) / (b - a)), lerp = (a, b, u) => a + (b - a) * u;
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); }, eo = x => 1 - Math.pow(1 - clamp(x), 3), eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = x => { x = clamp(x); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const C = { red: '#ff2338', blood: '#ff3048', clot: '#ffcf6e', imm: '#bff4ff', bac: '#63ff7d', tissue: '#ff7fbf', skin: '#ff9a72', acid: '#7dff3a', white: '#f6f7fb', gold: '#ffd24a' };

// ---------------- timeline from the voice ----------------
let VD = {}, WD = {}, ST = {}, DUR = 35;
const ORDER = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'];
const GAP = { L5: .25, L6: .25, L8: .25 };
const wt = (id, word) => { const w = WD[id].find(x => x[0].toLowerCase().replace(/[^a-z']/g, '').startsWith(word)); return ST[id] + Math.max(0, w ? w[1] : 0); };
let SC = [];
function schedule() {
  let t = .15; for (const id of ORDER) { t += GAP[id] || 0; ST[id] = t; t += VD[id] + .2; }
  DUR = window.DUR = +(t + .55).toFixed(2);
  SC = [
    ['hook', 0], ['cut', ST.L2], ['dive', wt('L2', 'incredible')],
    ['clot', ST.L3], ['shield', wt('L3', 'stop')],
    ['rush', ST.L4], ['fight', wt('L4', 'fighting')], ['clean', wt('L4', 'clearing')],
    ['notall', ST.L5], ['tissue', ST.L6], ['vessels', wt('L6', 'building')], ['skin', wt('L6', 'creating')],
    ['auto', ST.L7], ['acid', ST.L8], ['cta', ST.L9], ['end', DUR],
  ];
}
const scAt = t => { let i = 0; while (i < SC.length - 2 && t >= SC[i + 1][1]) i++; return i; };

// ---------------- neon drawing helpers ----------------
function neon(path, col, w = 4, glow = 22, fill = null, a = 1) {
  g.save(); g.globalAlpha *= a; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); path(g);
  if (fill) { g.fillStyle = fill; g.fill(); }
  g.shadowColor = col; g.shadowBlur = glow; g.strokeStyle = col; g.lineWidth = w; g.stroke();
  g.shadowBlur = 0; g.globalAlpha *= .7; g.strokeStyle = '#fff'; g.lineWidth = Math.max(1, w * .3); g.stroke(); g.restore();
}
const circ = (x, y, r) => c => { c.moveTo(x + r, y); c.arc(x, y, r, 0, 7); };
function blob(x, y, r, t, seed, k = .16, n = 40) { return c => { for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, rr = r * (1 + k * Math.sin(a * 3 + t * 3 + seed) + k * .6 * Math.sin(a * 5 - t * 2.3 + seed * 2)); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); }; }
function bg(t, tint = '#120612', k = 1) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.shadowBlur = 0;
  const gr = g.createRadialGradient(W / 2, H * .5, 50, W / 2, H * .5, H * .8); gr.addColorStop(0, tint); gr.addColorStop(1, '#020206');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { const x = (hash(i) * W + t * 20 * (1 + hash(i + 9))) % W, y = (hash(i + 3) * H - t * 40 * (.5 + hash(i + 5)) + H * 9) % H; g.fillStyle = `rgba(255,120,150,${.06 + .1 * hash(i + 7)})`; g.fillRect(x, y, 3, 3); }
}
const cam = (cx, cy, z, rot = 0) => { g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W / 2, H / 2); g.rotate(rot); g.scale(z, z); g.translate(-cx, -cy); };
const shake = (t, t0, amp = 18, d = .35) => { const u = seg(t, t0, t0 + d); if (u <= 0 || u >= 1) return [0, 0]; return [Math.sin(t * 91) * amp * (1 - u), Math.cos(t * 77) * amp * (1 - u)]; };

// ---------------- the wound world (one continuous cross-section of skin) ----------------
// skin surface y=700, epidermis to 780, dermis below; the cut is a V from x 400..680 down to y 1180
const SURF = 700, EPI = 780, CUT = [[400, SURF], [500, 940], [540, 1180], [585, 930], [680, SURF]];
const inCut = (x, y) => { if (y < SURF || y > 1180) return false; const u = (y - SURF) / 480; const l = lerp(400, 540, Math.pow(u, .8)), r = lerp(680, 540, Math.pow(u, .8)); return x > l && x < r; };
function skinLayers(t, close = 0) {
  // close: 0 = open wound, 1 = healed (edges meet)
  const cx = 540, sh = 140 * (1 - close);
  const L = (x0, x1) => c => { c.moveTo(x0, SURF); c.lineTo(x1, SURF); };
  // dermis glow bands
  for (let i = 0; i < 6; i++) { const y = 860 + i * 110; neon(c => { c.moveTo(-400, y + 8 * Math.sin(t + i)); for (let x = -400; x <= 1500; x += 40) c.lineTo(x, y + 8 * Math.sin(x / 120 + t * .8 + i)); }, '#5a1030', 2, 10, null, .6); }
  // epidermis: left and right slabs slide together as it heals
  const slab = (x0, x1) => c => { c.rect(x0, SURF, x1 - x0, EPI - SURF); };
  neon(slab(-400, cx - sh), C.skin, 4, 20, 'rgba(255,120,90,.10)'); neon(slab(cx + sh, 1500), C.skin, 4, 20, 'rgba(255,120,90,.10)');
  for (let x = -380; x < 1500; x += 44) for (let r = 0; r < 2; r++) { const xx = x + r * 22; if (Math.abs(xx - cx) < sh + 16) continue; neon(blob(xx, SURF + 22 + r * 36, 15, t * .4, xx * .01 + r, .12, 14), '#ff8f70', 2, 8, 'rgba(255,110,80,.15)', .8); }
  if (close < 1) neon(c => { c.moveTo(cx - sh, SURF); for (const [x, y] of CUT.slice(1, -1)) c.lineTo(lerp(cx, x, 1 - close), lerp(SURF, y, 1 - close)); c.lineTo(cx + sh, SURF); }, C.red, 5, 30, `rgba(120,0,20,${.55 * (1 - close)})`);
}
function rbc(x, y, r, rot, a = 1) { neon(c => { c.ellipse(x, y, r, r * .62, rot, 0, 7); }, C.blood, 3.5, 18, 'rgba(120,0,20,.85)', a); neon(c => { c.ellipse(x, y, r * .45, r * .25, rot, 0, 7); }, '#ff8090', 2, 6, null, a * .8); }
function bloodCells(t, t0, trapK) {
  for (let i = 0; i < 46; i++) {
    const sx = 540 + (hash(i) - .5) * 220, sy = 980 + hash(i + 1) * 180, ang = -Math.PI / 2 + (hash(i + 2) - .5) * 2.2, sp = 120 + hash(i + 3) * 260;
    const age = Math.max(0, t - t0 - hash(i + 4) * .8), stop = trapK > 0 ? Math.min(age, lerp(2.5, .6 + hash(i) * .5, trapK)) : age;
    const x = sx + Math.cos(ang) * sp * stop * .6 + Math.sin(t * 2 + i) * 6, y = sy + Math.sin(ang) * sp * stop * .6 + 40 * stop * stop * .2;
    rbc(x, y, 22 + hash(i + 5) * 8, i + t * (1 - trapK), clamp(age * 3));
  }
}
function platelets(t, t0, t1) {
  for (let i = 0; i < 36; i++) {
    const a = hash(i + 40) * Math.PI * 2, from = [540 + Math.cos(a) * 700, 950 + Math.sin(a) * 700], to = [lerp(430, 650, hash(i + 41)), lerp(760, 1120, hash(i + 42))];
    const u = eio(seg(t, t0 + hash(i + 43) * .5, t0 + .6 + hash(i + 43) * .5));
    if (u <= 0) continue;
    const x = lerp(from[0], to[0], u), y = lerp(from[1], to[1], u);
    neon(blob(x, y, 9, t, i, .3, 10), '#ffe0f0', 2.5, 14, 'rgba(255,200,230,.35)');
  }
}
function fibrin(t, t0, k) {      // a glowing mesh woven across the gap
  const n = Math.floor(28 * eo(seg(t, t0, t0 + 1.4)));
  for (let i = 0; i < n; i++) { const y0 = lerp(740, 1150, hash(i + 60)), y1 = lerp(740, 1150, hash(i + 61));
    neon(c => { c.moveTo(lerp(380, 450, hash(i + 62)), y0); c.quadraticCurveTo(540, (y0 + y1) / 2 + (hash(i + 63) - .5) * 120, lerp(630, 700, hash(i + 64)), y1); }, C.clot, 2.2, 14, null, .85 * k); }
}
function immune(x, y, r, t, seed, a = 1) {
  neon(blob(x, y, r, t, seed, .14, 48), C.imm, 4, 26, 'rgba(120,200,255,.16)', a);
  for (let j = 0; j < 3; j++) neon(blob(x + Math.cos(j * 2.1 + seed) * r * .32, y + Math.sin(j * 2.1 + seed) * r * .32, r * .22, t * 1.4, seed + j, .2, 14), '#7fd4ff', 2.5, 10, 'rgba(60,140,255,.3)', a);
}
function bacterium(x, y, rot, t, a = 1, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  neon(c => { c.moveTo(-34, -16); c.lineTo(34, -16); c.arc(34, 0, 16, -Math.PI / 2, Math.PI / 2); c.lineTo(-34, 16); c.arc(-34, 0, 16, Math.PI / 2, Math.PI * 1.5); }, C.bac, 3.5, 20, 'rgba(40,160,60,.35)', a);
  for (let k = -1; k <= 1; k++) neon(c => { c.moveTo(-50, k * 8); for (let q = 1; q <= 8; q++) c.lineTo(-50 - q * 8, k * 8 + Math.sin(q + t * 14 + k) * 6); }, C.bac, 2, 8, null, a * .8);
  g.restore();
}
function tissue(t, k) {           // pink collagen weaving up from the bottom of the wound
  const top = lerp(1190, 760, k);
  g.save(); g.beginPath(); g.moveTo(400, SURF); for (const [x, y] of CUT.slice(1)) g.lineTo(x, y); g.closePath(); g.clip(); const fg = g.createLinearGradient(0, 1180, 0, top); fg.addColorStop(0, 'rgba(255,90,170,.45)'); fg.addColorStop(1, 'rgba(255,90,170,.1)'); g.fillStyle = fg; g.fillRect(380, top, 320, 1190 - top); g.restore();
  for (let i = 0; i < 40; i++) { const y = 1180 - i * 11; if (y < top) break;
    neon(c => { let first = true; for (let x = 380; x <= 700; x += 12) { if (!inCut(x, y)) continue; const yy = y + Math.sin(x / 18 + i + t * 2) * 5; first ? c.moveTo(x, yy) : c.lineTo(x, yy); first = false; } }, C.tissue, 2.6, 12, null, .9); }
}
function vessels(t, k) {          // branching capillaries grow through the new tissue
  const br = (x, y, a, len, d, s) => { if (d > 4) return; const L = len * clamp(k * 5 - d * 1.1); if (L <= 1) return; const x2 = x + Math.cos(a) * L, y2 = y + Math.sin(a) * L;
    neon(c => { c.moveTo(x, y); c.quadraticCurveTo((x + x2) / 2 + Math.sin(d + s) * 12, (y + y2) / 2, x2, y2); }, C.red, 7 - d * 1.2, 22, null, 1);
    if (L >= len * .98) { br(x2, y2, a - .5 - hash(s) * .3, len * .72, d + 1, s * 2); br(x2, y2, a + .45 + hash(s + 1) * .3, len * .7, d + 1, s * 2 + 1); } };
  br(-200, 1050, -.12, 260, 0, 3); br(1280, 1000, Math.PI + .1, 260, 0, 7); br(540, 1500, -Math.PI / 2, 220, 0, 11);
}

// ---------------- captions: big bold chunks, word by word, keywords in red ----------------
const KEY = /repair|system|cut|incredible|clot|bleeding|wound|immune|rush|bacteria|damaged|all!|tissue|blood|vessels|skin|close|thinking|stomach|acid|answer|next|video|follow|amazing/i;
let CHUNKS = [];
function buildCaps() {
  for (const id of ORDER) { if (id === 'L5') continue; let cur = []; const flush = () => { if (cur.length) CHUNKS.push(cur); cur = []; };
    for (const [w, a, b] of WD[id]) { cur.push([w, ST[id] + Math.max(0, a), ST[id] + b]); if (cur.length >= 3 || /[,.?!]$/.test(w)) flush(); } flush(); }
  window.CAPS = CHUNKS.map((c, i) => ({ t0: c[0][1], t1: CHUNKS[i + 1] ? Math.min(CHUNKS[i + 1][0][1], c[c.length - 1][2] + .7) : c[c.length - 1][2] + .7, text: c.map(w => w[0]).join(' ') }));
}
function captions(t, y = 520) {
  const c = CHUNKS.find((c, i) => t >= c[0][1] - .03 && t < (CHUNKS[i + 1] ? CHUNKS[i + 1][0][1] - .03 : c[c.length - 1][2] + .7)); if (!c) return;
  g.setTransform(1, 0, 0, 1, 0, 0); g.font = '900 92px Montserrat'; g.textBaseline = 'middle';
  const words = c.map(w => w[0].toUpperCase()), ws = words.map(w => g.measureText(w + ' ').width + 22), total = ws.reduce((a, b) => a + b, 0);
  let x = W / 2 - total / 2; const lines = total > 960 ? 2 : 1;
  words.forEach((w, i) => {
    const [, a] = c[i], k = back(seg(t, a - .02, a + .16)); if (k <= 0) { x += ws[i]; return; }
    let px = x, py = y; if (lines === 2) { const half = Math.ceil(words.length / 2); const row = i < half ? 0 : 1, rw = (row ? words.slice(half) : words.slice(0, half)).reduce((s, q) => s + g.measureText(q + ' ').width + 22, 0);
      px = W / 2 - rw / 2 + (row ? words.slice(half, i) : words.slice(0, i)).reduce((s, q) => s + g.measureText(q + ' ').width + 22, 0); py = y - 56 + row * 112; }
    const hot = KEY.test(w), ww = g.measureText(w).width;
    g.save(); g.translate(px + ww / 2, py); g.scale(k, k); g.textAlign = 'center';
    g.lineWidth = 14; g.strokeStyle = 'rgba(0,0,0,.85)'; g.lineJoin = 'round'; g.strokeText(w, 0, 0);
    g.shadowColor = hot ? 'rgba(255,30,60,.95)' : 'rgba(255,255,255,.55)'; g.shadowBlur = hot ? 28 : 14; g.fillStyle = hot ? C.red : C.white; g.fillText(w, 0, 0);
    g.restore(); x += ws[i];
  });
}

// ---------------- scenes ----------------
function sHook(t, a) {             // the character, a scan reveals the glowing "repair system"
  bg(t, '#1a0610'); const z = lerp(.95, 1.25, eo(seg(t, a, a + 2.2))); cam(540, 1050, z, Math.sin(t * 1.3) * .02);
  const ring = (r, sp, n, col) => { for (let i = 0; i < n; i++) { const ang = i / n * Math.PI * 2 + t * sp; const x = 540 + Math.cos(ang) * r, y = 1000 + Math.sin(ang) * r * .35;
    neon(c => { c.moveTo(x - 14, y); c.lineTo(x + 14, y); c.moveTo(x, y - 14); c.lineTo(x, y + 14); }, col, 5, 20); } };
  ring(380, .9, 10, C.red); ring(300, -1.3, 7, '#ff8aa0');
  neon(c => { c.ellipse(540, 1330, 330, 70, 0, 0, 7); }, C.red, 3, 30, null, .7);
  drawNeon(g, 540, 1330, 1.05, mixPose(POSE.stand, POSE.victory, ss(seg(t, a + .9, a + 1.3))), { glow: 1.3 });
  const sy = lerp(600, 1400, seg(t, a + .1, a + 1.2)); neon(c => { c.moveTo(250, sy); c.lineTo(830, sy); }, '#ffffff', 3, 40, null, 1 - seg(t, a + 1.0, a + 1.3));
  if (t > a + 1.25) sparks(g, 540, 820, t - a - 1.25, { seed: 5, scale: 1.2, n: 90, life: 1.2 });
}
function sCut(t, a, b) {           // a neon blade slashes the forearm
  bg(t, '#1d0508'); const [sx, sy] = shake(t, a + .55, 26); const z = lerp(1.7, 1.95, seg(t, a, b)); cam(560 - sx, 900 - sy, z);
  const hit = t > a + .55, pose = hit ? mixPose({ ...POSE.stand, a1: -1.5, a2: -.05 }, { ...POSE.stand, a1: -.6, a2: -1.6, lean: -.1 }, eo(seg(t, a + .55, a + .8))) : { ...POSE.stand, a1: -1.5, a2: -.05 };
  const k = drawNeon(g, 420, 1330, 1.0, pose, { glow: 1.2 });
  const arm = [420 + (k.A1.el[0] + k.A1.wr[0]) / 2, 1330 + (k.A1.el[1] + k.A1.wr[1]) / 2];
  const bu = seg(t, a + .35, a + .6); if (bu > 0 && bu < 1) neon(c => { const x = lerp(arm[0] - 260, arm[0] + 260, bu); c.moveTo(x - 90, arm[1] - 120 + bu * 40); c.lineTo(x + 90, arm[1] + 120 - bu * 40); }, '#ffffff', 8, 50);
  if (hit) { neon(c => { c.moveTo(arm[0] - 34, arm[1] - 10); c.lineTo(arm[0] + 34, arm[1] + 12); }, C.red, 7, 34);
    for (let i = 0; i < 12; i++) { const age = t - a - .6 - i * .05; if (age < 0) continue; neon(circ(arm[0] + (hash(i) - .5) * 40, arm[1] + age * 520 * age + 10, 5 + hash(i + 1) * 4), C.red, 3, 16, C.red); }
    if (t < a + .7) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(255,255,255,${.6 * (1 - seg(t, a + .55, a + .7))})`; g.fillRect(0, 0, W, H); } }
}
function sDive(t, a, b) {          // zoom through the cut into the body
  const u = eio(seg(t, a, a + .7));
  bg(t, '#250510'); cam(540, 930, lerp(.5, 1.55, u), lerp(.6, 0, u));
  skinLayers(t); bloodCells(t, a + .2, 0);
  g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 40; i++) { const ang = hash(i + 90) * Math.PI * 2, r0 = 200 + ((t * 900 + hash(i + 91) * 900) % 900); const k2 = 1 - u;
    if (k2 <= 0) break; neon(c => { c.moveTo(W / 2 + Math.cos(ang) * r0, H / 2 + Math.sin(ang) * r0); c.lineTo(W / 2 + Math.cos(ang) * (r0 + 140), H / 2 + Math.sin(ang) * (r0 + 140)); }, '#ff6680', 3, 14, null, k2); }
}
function sClot(t, a, b, shield) {  // platelets plug the gap, fibrin mesh, bleeding stops
  bg(t, '#210510'); const z = shield ? lerp(1.75, 1.95, eo(seg(t, a, b))) : lerp(1.5, 1.7, seg(t, a, b)); cam(540, shield ? 880 : 930, z, shield ? -.03 : .03);
  skinLayers(t); const t0 = SC.find(s => s[0] === 'clot')[1];
  bloodCells(t, t0 - 1.5, ss(seg(t, t0 + .4, t0 + 2)));
  platelets(t, t0, b); fibrin(t, t0 + .5, 1);
  if (shield) { const k = eo(seg(t, a, a + .7)); neon(c => { c.moveTo(380, SURF - 6); c.quadraticCurveTo(540, SURF - 80 * k, 700, SURF - 6); c.lineTo(700, SURF + 30); c.quadraticCurveTo(540, SURF - 40 * k, 380, SURF + 30); c.closePath(); }, '#ff5a3c', 5, 30, 'rgba(120,20,10,.85)', k);
    if (t > a + .5) { g.setTransform(1, 0, 0, 1, 0, 0); g.font = '900 64px Montserrat'; g.textAlign = 'center'; const kk = back(seg(t, a + .5, a + .75)); g.save(); g.translate(540, 1500); g.scale(kk, kk); g.shadowColor = C.gold; g.shadowBlur = 30; g.fillStyle = C.gold; g.fillText('BLEEDING STOPPED', 0, 0); g.restore(); } }
}
function sImmune(t, a, b, mode) {  // immune cells rush in, eat bacteria, clear debris
  const T0 = SC.find(s => s[0] === 'rush')[1], tf = SC.find(s => s[0] === 'fight')[1], tc = SC.find(s => s[0] === 'clean')[1];
  bg(t, '#0a1020'); const z = mode === 'rush' ? lerp(1.35, 1.55, seg(t, a, b)) : mode === 'fight' ? lerp(1.9, 2.1, seg(t, a, b)) : lerp(1.7, 1.5, seg(t, a, b));
  cam(mode === 'fight' ? 560 : 540, mode === 'fight' ? 900 : 950, z, mode === 'rush' ? .04 : -.02);
  skinLayers(t); fibrin(t, -10, .55);
  const bac = []; for (let i = 0; i < 7; i++) { const life = tf + .35 + i * .3; const x = 450 + hash(i + 120) * 200 + Math.sin(t * 2 + i) * 30, y = 820 + hash(i + 121) * 300 + Math.cos(t * 1.7 + i) * 24; bac.push([x, y, life, i]); }
  for (const [x, y, life, i] of bac) { if (t > life + .25) continue; const dying = seg(t, life, life + .25); bacterium(x, y, t * .8 + i, t, 1 - dying, 1 - .7 * dying);
    if (dying > 0) sparks(g, x, y, t - life, { seed: 200 + i, scale: .35, n: 24, life: .6 }); }
  // debris: broken grey cells, swallowed during "clearing"
  for (let i = 0; i < 9; i++) { const life = tc + .2 + i * .14, d = seg(t, life, life + .3); if (d >= 1) continue; const x = 430 + hash(i + 150) * 220, y = 760 + hash(i + 151) * 380;
    neon(c => { c.moveTo(x - 20, y); c.lineTo(x - 5, y - 18); c.lineTo(x + 14, y - 6); c.lineTo(x + 6, y + 14); c.closePath(); }, '#9aa0b4', 2.5, 8, 'rgba(80,80,100,.4)', 1 - d); }
  for (let i = 0; i < 5; i++) { const side = i % 2 ? 1 : -1, arrive = eo(seg(t, T0 + i * .12, T0 + .55 + i * .12));
    const home = [lerp(side > 0 ? 1300 : -220, 450 + hash(i + 130) * 190, arrive), lerp(700 + i * 110, 820 + hash(i + 131) * 320, arrive)];
    let [x, y] = home; const tgt = bac[i] && t > tf ? bac[i] : null; if (tgt) { const k = eio(seg(t, tgt[2] - .3, tgt[2])); x = lerp(x, tgt[0], k * (1 - seg(t, tgt[2] + .2, tgt[2] + .6))); y = lerp(y, tgt[1], k * (1 - seg(t, tgt[2] + .2, tgt[2] + .6))); }
    if (arrive < 1) for (let q = 1; q < 5; q++) neon(c => { c.moveTo(x - side * q * 40, y); c.lineTo(x - side * (q * 40 + 30), y); }, C.imm, 2, 8, null, (1 - arrive) * .6);
    immune(x, y, 64 + hash(i + 132) * 16, t, i); }
}
function sNotAll(t, a, b) {        // punch card
  bg(t, '#2a0510'); g.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < 28; i++) { const ang = i / 28 * Math.PI * 2 + t * .8; neon(c => { c.moveTo(W / 2 + Math.cos(ang) * 200, H / 2 + Math.sin(ang) * 200); c.lineTo(W / 2 + Math.cos(ang) * 1400, H / 2 + Math.sin(ang) * 1400); }, C.red, 10, 30, null, .25); }
  const [sx, sy] = shake(t, a + .05, 20, .4); const k = back(seg(t, a, a + .22));
  g.save(); g.translate(W / 2 + sx, 820 + sy); g.scale(k, k); g.font = '190px Anton'; g.textAlign = 'center'; g.shadowColor = 'rgba(255,255,255,.6)'; g.shadowBlur = 20; g.fillStyle = C.white; g.fillText("BUT THAT'S", 0, -110);
  g.shadowColor = 'rgba(255,30,60,1)'; g.shadowBlur = 40; g.fillStyle = C.red; g.fillText('NOT ALL!', 0, 100); g.restore();
  drawNeon(g, W / 2, 1600 - Math.sin(Math.PI * seg(t, a, b)) * 160, .75, POSE.jump, { glow: 1.3 });
}
function sRebuild(t, a, b, mode) { // new tissue → vessels → skin closes, then out to the healed arm
  const tt = SC.find(s => s[0] === 'tissue')[1], tv = SC.find(s => s[0] === 'vessels')[1], tk = SC.find(s => s[0] === 'skin')[1], end = SC.find(s => s[0] === 'auto')[1];
  bg(t, '#200614');
  const close = eio(seg(t, tk + .1, tk + 1.3)), out = eio(seg(t, end - .55, end));
  const z = mode === 'tissue' ? lerp(1.95, 1.7, seg(t, a, b)) : mode === 'vessels' ? lerp(1.05, 1.2, seg(t, a, b)) : lerp(1.5, .3, out);
  cam(540, mode === 'vessels' ? 1010 : 930, z, mode === 'tissue' ? -.04 : mode === 'vessels' ? .03 : out * .4);
  skinLayers(t, close);
  if (close < 1) tissue(t, eo(seg(t, tt, tt + 2.0)) * (1 - close * .6));
  vessels(t, seg(t, tv, tv + 1.8));
  if (mode === 'skin' && close > .9) { neon(c => { c.moveTo(500, SURF - 4); c.lineTo(580, SURF - 4); }, '#ffb39a', 3, 12, null, .7); sparks(g, 540, SURF - 20, t - tk - 1.25, { seed: 9, scale: .9, n: 80, life: 1.3 }); }
}
function sAuto(t, a, b) {          // carefree: the healed character strolls on
  bg(t, '#140610'); const z = lerp(1.45, 1.6, seg(t, a, b)); cam(560, 1040, z);
  for (let i = 0; i < 8; i++) { const x = ((i * 200 - t * 260) % 1600 + 1600) % 1600 - 260; neon(c => { c.moveTo(x, 1342); c.lineTo(x + 90, 1342); }, '#ffffff', 3, 12, null, .35); }
  const ph = .5 + .5 * Math.sin(t * 7.5); const k = drawNeon(g, 540, 1340, .95, mixPose(POSE.walkA, POSE.walkB, ph), { glow: 1.2 });
  const arm = [540 + (k.A1.el[0] + k.A1.wr[0]) / 2, 1340 + (k.A1.el[1] + k.A1.wr[1]) / 2];
  const ck = back(seg(t, a + .2, a + .5)); g.save(); g.translate(arm[0] + 60, arm[1] - 120); g.scale(ck, ck);
  neon(c => { c.moveTo(-28, 0); c.lineTo(-6, 22); c.lineTo(32, -26); }, C.bac, 9, 30); g.restore();
  // the "thought" bubble stays empty: no thinking needed
  const bk = back(seg(t, a + .7, a + 1.0)); g.save(); g.translate(540 + k.head[0] + 170, 1340 + k.head[1] - 160); g.scale(bk * .8, bk * .8);
  neon(c => { c.ellipse(0, 0, 120, 80, 0, 0, 7); }, '#ffffff', 4, 20, 'rgba(255,255,255,.05)', .9);
  neon(circ(-90, 110, 18), '#ffffff', 3, 12, null, .9); neon(circ(-120, 160, 10), '#ffffff', 3, 12, null, .9);
  g.font = '900 70px Montserrat'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = C.white; g.fillText('zzz', 0, 4); g.restore();
}
function sAcid(t, a, b) {          // teaser: the stomach and its acid
  bg(t, '#08140a'); const z = lerp(.95, 1.12, seg(t, a, b)); cam(540, 1020, z, Math.sin(t * 2) * .03);
  const stom = c => { c.moveTo(430, 560); c.bezierCurveTo(420, 700, 260, 760, 300, 1000); c.bezierCurveTo(340, 1260, 640, 1320, 780, 1180); c.bezierCurveTo(900, 1060, 860, 860, 720, 860); c.bezierCurveTo(600, 860, 560, 760, 560, 560); };
  g.save(); g.beginPath(); stom(g); g.closePath(); g.clip();
  const lv = 980 + Math.sin(t * 3) * 12; g.fillStyle = 'rgba(80,255,40,.22)'; g.fillRect(200, lv, 800, 600);
  neon(c => { c.moveTo(200, lv); for (let x = 200; x <= 1000; x += 20) c.lineTo(x, lv + Math.sin(x / 40 + t * 5) * 10); }, C.acid, 4, 24);
  for (let i = 0; i < 18; i++) { const y = lv + 260 - ((t * 160 + hash(i) * 400) % 300), x = 330 + hash(i + 1) * 440; if (y > lv) neon(circ(x + Math.sin(t * 3 + i) * 8, y, 6 + hash(i + 2) * 8), C.acid, 2.5, 14); }
  g.restore();
  neon(c => { stom(c); }, '#ff7fb0', 6, 30);
  const qk = back(seg(t, a + .3, a + .6)); g.save(); g.translate(560, 1450); g.scale(qk * (1 + .05 * Math.sin(t * 8)), qk * (1 + .05 * Math.sin(t * 8)));
  g.font = '260px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = C.acid; g.shadowBlur = 40; g.fillStyle = C.acid; g.fillText('?', 0, 0); g.restore();
  drawNeon(g, 200, 1700, .75, { ...POSE.stand, head: -.3, a1: -2.2, a2: -1.4 }, { glow: 1.1 });
}
function sCTA(t, a, b) {           // watch next + follow
  bg(t, '#1d0510'); cam(540, 960, lerp(1.0, 1.08, seg(t, a, b)), Math.sin(t * 1.7) * .02);
  const up = eio(seg(t, ST.L10, ST.L10 + .35)), k1 = back(seg(t, a + .05, a + .35)) * lerp(1, .7, up); g.save(); g.translate(540, lerp(820, 640, up)); g.scale(k1, k1);
  neon(c => { c.roundRect(-330, -120, 660, 240, 40); }, '#ffffff', 5, 26, 'rgba(255,255,255,.05)');
  neon(c => { c.moveTo(-230, -60); c.lineTo(-130, 0); c.lineTo(-230, 60); c.closePath(); }, C.red, 5, 26, 'rgba(255,35,56,.6)');
  g.font = '86px Anton'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = C.white; g.fillText('NEXT VIDEO', -90, 4); g.restore();
  const tf = ST.L10 + .3, k2 = back(seg(t, tf, tf + .3)), pulse = 1 + .06 * Math.sin((t - tf) * 9);
  if (k2 > 0) { g.save(); g.translate(540, 1110); g.scale(k2 * pulse, k2 * pulse);
    neon(c => { c.roundRect(-260, -80, 520, 160, 80); }, C.red, 6, 40, 'rgba(255,35,56,.9)');
    g.font = '900 78px Montserrat'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('FOLLOW', 0, 4); g.restore();
    for (let r = 0; r < 3; r++) { const ph = ((t - tf) * .9 + r / 3) % 1; neon(c => { c.roundRect(-260 - ph * 120 + 540, 1030 - ph * 60, 520 + ph * 240, 160 + ph * 120, 80); }, C.red, 3, 20, null, 1 - ph); } }
  drawNeon(g, 270, 1760, .8, mixPose(POSE.stand, { ...POSE.stand, a1: -2.3, a2: -.1, head: -.25 }, ss(seg(t, a + .2, a + .5))), { glow: 1.2 });
  // "amazing facts about your body": neon organ icons burst out around the button
  const ta = wt('L10', 'amazing');
  const icons = [[c => { c.moveTo(0, 30); c.bezierCurveTo(-60, -10, -40, -60, 0, -30); c.bezierCurveTo(40, -60, 60, -10, 0, 30); }, C.red],
    [c => { c.ellipse(0, 0, 50, 38, 0, 0, 7); c.moveTo(0, -38); c.bezierCurveTo(-10, -10, 10, 10, 0, 38); }, '#ff9ad0'],
    [c => { c.moveTo(-50, -8); c.lineTo(50, -8); c.moveTo(-50, 8); c.lineTo(50, 8); c.moveTo(-58, -18); c.arc(-58, -8, 12, -Math.PI / 2, Math.PI / 2, true); c.moveTo(58, -18); c.arc(58, -8, 12, -Math.PI / 2, Math.PI / 2); }, '#ffffff'],
    [c => { c.ellipse(-16, 0, 26, 44, .2, 0, 7); c.ellipse(16, 0, 26, 44, -.2, 0, 7); }, '#ff7b5a'],
    [c => { c.arc(0, 0, 40, 0, 7); c.moveTo(-22, -8); c.arc(-10, -8, 12, Math.PI, 0); c.moveTo(2, 8); c.arc(14, 8, 12, Math.PI, 0); }, '#c9a0ff']];
  icons.forEach(([p, col], i) => { const k = back(seg(t, ta + i * .09, ta + .3 + i * .09)); if (k <= 0) return; const ang = -Math.PI / 2 + (i - 2) * .55 + Math.sin(t * 2 + i) * .05, r = 330;
    g.save(); g.translate(540 + Math.cos(ang) * r * 1.2, 1150 + Math.sin(ang) * r * .9 + 40); g.scale(k * 1.2, k * 1.2); g.rotate(Math.sin(t * 3 + i) * .15); neon(p, col, 5, 24, null, 1); g.restore(); });
  sparks(g, 540, 1110, t - tf - .25, { seed: 31, scale: 1.1, n: 110, life: 1.5 }); sparks(g, 300, 700, t - DUR + 1.1, { seed: 32, scale: .8, n: 70, life: 1.1 });
}

const FN = { hook: sHook, cut: sCut, dive: sDive, clot: (t, a, b) => sClot(t, a, b, false), shield: (t, a, b) => sClot(t, a, b, true),
  rush: (t, a, b) => sImmune(t, a, b, 'rush'), fight: (t, a, b) => sImmune(t, a, b, 'fight'), clean: (t, a, b) => sImmune(t, a, b, 'clean'),
  notall: sNotAll, tissue: (t, a, b) => sRebuild(t, a, b, 'tissue'), vessels: (t, a, b) => sRebuild(t, a, b, 'vessels'), skin: (t, a, b) => sRebuild(t, a, b, 'skin'),
  auto: sAuto, acid: sAcid, cta: sCTA };
function render(t) {
  const i = scAt(t), [name, a] = SC[i], b = SC[i + 1][1];
  FN[name](t, a, b);
  if (name !== 'notall') captions(t, name === 'cta' ? 420 : 470);
  // whip transition on every cut: horizontal smear + a quick flash of light
  const tc = SC.map(s => s[1]).filter(x => x > 0 && x < DUR).reduce((p, x) => Math.abs(t - x) < Math.abs(t - p) ? x : p, -9), d = Math.abs(t - tc);
  if (d < .12) { const u = 1 - d / .12; g.setTransform(1, 0, 0, 1, 0, 0); tg.clearRect(0, 0, W, H); tg.drawImage(cv, 0, 0);
    for (let k = 1; k <= 5; k++) { g.globalAlpha = .22 * u; g.drawImage(tmp, (t < tc ? -1 : 1) * k * 36 * u, 0); }
    g.globalAlpha = .25 * u * u; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  // vignette
  g.setTransform(1, 0, 0, 1, 0, 0); const vg = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
window.render = render; window.TEXTS = () => [];
(async () => {
  VD = await (await fetch('voice/dur.json')).json(); WD = await (await fetch('voice/words.json')).json();
  schedule(); buildCaps();
  window.EV = ORDER.map(id => ({ t: ST[id], type: 'vo', id })); window.SC = SC; window.ST = ST;
  await Promise.all(['900 92px Montserrat', '190px Anton'].map(f => document.fonts.load(f)));
  window.READY = true;
})();
