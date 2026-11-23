// ================= BRAIN TRICKS — long-form 16:9 scenes (world = 1920×1080, centre 960,540) =================
const CX = 960, CY = 540;
function bgDeep(s, hue) {                                                      // cinematic deep background with volumetric haze + bokeh
  const g = ctx.createRadialGradient(CX, CY - 60, 60, CX, CY, 1300); g.addColorStop(0, hue ? hue[0] : '#2a1424'); g.addColorStop(.55, hue ? hue[1] : '#140a14'); g.addColorStop(1, '#05030a');
  ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  const R = RN(77); for (let i = 0; i < 26; i++) { const x = R() * 2600 - 340 + Math.sin(s * .2 + i) * 40, y = R() * 1500 - 200 + Math.cos(s * .17 + i) * 30, r = 20 + R() * 70, a = .05 + R() * .08; const b = ctx.createRadialGradient(x, y, 0, x, y, r); b.addColorStop(0, `rgba(255,220,200,${a})`); b.addColorStop(1, 'rgba(255,220,200,0)'); ctx.fillStyle = b; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
}
function spark(x, y, r, a, col = '255,245,210') { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(.35, `rgba(${col},${a * .45})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function label(t, x, y, size = 40, col = '#fff', align = 'center') { ctx.textAlign = align; txt(t, x, y, size, col, 'rgba(0,0,0,.85)', Math.max(6, size / 5), '900'); }

function brain3d(u, s, o) {                                                    // big hero brain: rim light, region glows, travelling sparks
  bgDeep(s, o.hue); const sc = 1.25 + .02 * Math.sin(s * .8), bx = CX, by = CY + 30;
  const halo = ctx.createRadialGradient(bx, by, 200, bx, by, 760); halo.addColorStop(0, 'rgba(255,150,170,.22)'); halo.addColorStop(1, 'rgba(255,150,170,0)'); ctx.fillStyle = halo; ctx.fillRect(bx - 800, by - 800, 1600, 1600);
  brainAt(bx, by, sc, s, o.glows || [[-160, -100, 260, 0], [90, -20, 220, 1.7], [-40, 90, 200, 3.1]], o.seed || 3);
  ctx.save(); brainShape(bx, by, sc); ctx.clip(); const rim = ctx.createLinearGradient(bx - 500, by - 400, bx + 500, by + 300); rim.addColorStop(0, 'rgba(255,255,255,.22)'); rim.addColorStop(.4, 'rgba(255,255,255,0)'); rim.addColorStop(1, 'rgba(120,40,80,.35)'); ctx.fillStyle = rim; ctx.fillRect(bx - 700, by - 600, 1400, 1200); ctx.restore();
  const R = RN(9); for (let i = 0; i < 14; i++) { const a0 = R() * TAU, a1 = a0 + 1 + R() * 2, rr = 360 + R() * 220, ph = (s * (.25 + R() * .3) + R()) % 1, a = lerp(a0, a1, ph); spark(bx + Math.cos(a) * rr, by + Math.sin(a) * rr * .72, 34, .9); }
  if (o.mismatch) { const p = (s * .9) % 1; for (const [dx, col] of [[-1, '255,210,120'], [1, '150,200,255']]) { const x = bx + dx * 260, y = by + 120 + 30 * Math.sin(s * 3 + dx); spark(x, y, 150, .55 + .4 * Math.sin(s * 6 + (dx > 0 ? 1.3 : 0)), col); } }
  if (o.text) { label(o.text, CX, 140, 64, '#ffd23f'); }
}
function snakes(u, s, o) {                                                     // Kitaoka-style peripheral drift illusion (static pattern that seems to rotate)
  ctx.fillStyle = '#7a7a7a'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const cols = ['#0a0a0a', '#1f3fa8', '#ffffff', '#f2d22a'], rot = (o.spin || 0) * s;
  const disc = (x, y, R0) => { for (let ring = 0; ring < 5; ring++) { const r = R0 * (1 - ring * .18), n = 18 + ring * 2; for (let k = 0; k < n; k++) { const a = k / n * TAU + rot * (ring % 2 ? 1 : -1) + ring * .3; for (let q = 0; q < 4; q++) { const a0 = a + q * TAU / n / 4, a1 = a0 + TAU / n / 4; ctx.fillStyle = cols[q]; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.arc(x, y, r * .82, a1, a0, true); ctx.closePath(); ctx.fill(); } } } };
  for (let i = -1; i < 4; i++) for (let j = -1; j < 3; j++) disc(260 + i * 480 + (j % 2) * 240, 160 + j * 420, 230);
}
function checker(u, s, o) {                                                    // Adelson checker-shadow illusion: A and B are the same grey
  ctx.fillStyle = '#5d6a5e'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const ox = CX - 30, oy = 240, a = 150, sq = (i, j) => [[ox + (i - j) * a * .9, oy + (i + j) * a * .52], [ox + (i + 1 - j) * a * .9, oy + (i + 1 + j) * a * .52], [ox + (i - j) * a * .9, oy + (i + 2 + j) * a * .52], [ox + (i - j - 1) * a * .9, oy + (i + 1 + j) * a * .52]];
  const shade = (i, j) => { const dx = i - 3.3, dy = j - 2.8, sh = Math.exp(-(dx * dx + dy * dy) / 2.6) * .5; return sh; };
  const A = [0, 3], B = [3, 3]; const same = 112;
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { const light = (i + j) % 2 === 0, base = light ? 205 : 118, sh = shade(i, j); let v = Math.round(base * (1 - sh));
    if (i === A[0] && j === A[1]) v = same; if (i === B[0] && j === B[1]) v = same;
    const p = sq(i, j); ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.beginPath(); p.forEach((q, k) => k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); }
  const mbq = sq(3, 3), bc = [(mbq[0][0] + mbq[2][0]) / 2, (mbq[0][1] + mbq[2][1]) / 2], cyl = [bc[0] + 250, bc[1] - 40];
  const cg = ctx.createLinearGradient(cyl[0] - 110, 0, cyl[0] + 110, 0); cg.addColorStop(0, '#2e7a3a'); cg.addColorStop(.6, '#5cc06a'); cg.addColorStop(1, '#1f5a2a'); ctx.fillStyle = cg; ctx.fillRect(cyl[0] - 110, cyl[1] - 300, 220, 300); ctx.beginPath(); ctx.ellipse(cyl[0], cyl[1], 110, 42, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#7ad888'; ctx.beginPath(); ctx.ellipse(cyl[0], cyl[1] - 300, 110, 42, 0, 0, TAU); ctx.fill();
  const ca = sq(...A), cb = sq(...B), mid = q => [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2]; const ma = mid(ca), mb = mid(cb);
  label('A', ma[0], ma[1] + 16, 52, '#fff'); label('B', mb[0], mb[1] + 16, 52, '#fff');
  if (o.reveal) { const k = clamp(u * 2.2 - .2); ctx.fillStyle = `rgba(${same},${same},${same},${k})`; ctx.fillRect(ma[0] - 24, ma[1] + 30, 48, (mb[1] - ma[1]) - 60); ctx.fillRect(ma[0] - 24, mb[1] - 40, mb[0] - ma[0] + 24, 48); if (k > .9) label('SAME COLOUR!', CX + 520, 200, 70, '#ffd23f'); }
}
function mullerLyer(u, s, o) {
  bgDeep(s, ['#1d2a3a', '#0e1520']); const y1 = 380, y2 = 700, L = 620, x0 = CX - L / 2;
  const line = (y, out) => { tube([[x0, y], [x0 + L, y]], 16, '#f2f2f2'); for (const [x, d] of [[x0, -1], [x0 + L, 1]]) { const f = out ? d : -d; tube([[x, y], [x + f * 110, y - 90]], 14, '#f2f2f2'); tube([[x, y], [x + f * 110, y + 90]], 14, '#f2f2f2'); } };
  line(y1, false); line(y2, true);
  const k = clamp(u * 2 - .6); if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.setLineDash([16, 12]); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; for (const x of [x0, x0 + L]) { ctx.beginPath(); ctx.moveTo(x, y1 - 140); ctx.lineTo(x, y2 + 140); ctx.stroke(); } ctx.setLineDash([]); label('EXACTLY THE SAME LENGTH', CX, 170, 60, '#ffd23f'); ctx.restore(); } else label('WHICH LINE IS LONGER?', CX, 170, 60, '#fff');
}
function room(u, s, o) {                                                       // warm room; déjà-vu echoes (ghost copies that lag behind)
  const draw = (off, a) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(off, 0);
    const w = ctx.createLinearGradient(0, 0, 0, 760); w.addColorStop(0, '#5a4636'); w.addColorStop(1, '#3a2a20'); ctx.fillStyle = w; ctx.fillRect(-2400, -2400, 6800, 3160); ctx.fillStyle = '#2a1c14'; ctx.fillRect(-2400, 760, 6800, 2000);
    ctx.fillStyle = '#9fc4d8'; ctx.fillRect(1180, 150, 420, 380); const sun = ctx.createLinearGradient(1180, 150, 1600, 530); sun.addColorStop(0, 'rgba(255,240,200,.9)'); sun.addColorStop(1, 'rgba(160,200,230,.6)'); ctx.fillStyle = sun; ctx.fillRect(1180, 150, 420, 380); ctx.fillStyle = '#3a2a20'; ctx.fillRect(1380, 150, 20, 380); ctx.fillRect(1180, 330, 420, 20);
    ctx.fillStyle = 'rgba(255,230,170,.12)'; ctx.beginPath(); ctx.moveTo(1180, 530); ctx.lineTo(1600, 530); ctx.lineTo(1300, 1080); ctx.lineTo(700, 1080); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6a4030'; ctx.fillRect(300, 560, 420, 40); ctx.fillRect(320, 600, 30, 220); ctx.fillRect(670, 600, 30, 220); ctx.fillStyle = '#8a5a3a'; ctx.beginPath(); ctx.roundRect(330, 420, 380, 150, 30); ctx.fill();
    ctx.fillStyle = '#c9a060'; ctx.beginPath(); ctx.moveTo(840, 520); ctx.lineTo(920, 360); ctx.lineTo(1000, 520); ctx.closePath(); ctx.fill(); ctx.fillRect(912, 520, 16, 260); spark(920, 450, 220, .5, '255,210,140');
    ctx.fillStyle = '#2e5a32'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(1700 + Math.cos(i) * 40, 640 - i * 30, 26, 70, i - 3, 0, TAU); ctx.fill(); } ctx.fillStyle = '#8a5a3a'; ctx.fillRect(1650, 700, 110, 110);
    ctx.restore(); };
  draw(0, 1); if (o.echo) { const k = .5 + .5 * Math.sin(s * 2.2); draw(26 + 14 * k, .22); draw(-30 - 10 * k, .16); ctx.fillStyle = `rgba(180,140,255,${.08 + .06 * k})`; ctx.fillRect(-2400, -2400, 6800, 6000); }
  if (o.text) label(o.text, CX, 160, 70, '#ffd23f');
}
function waves(u, s, o) {                                                      // two brain signals drifting out of sync
  bgDeep(s, ['#14202e', '#0a1018']); const prog = clamp(u * 1.2);
  const tr = (y, col, lab, shift) => { const p = []; for (let x = 140; x <= 140 + 1640 * prog; x += 6) { const t = (x - 140) / 200 + s * 1.5; p.push([x, y - Math.sin(t * 2 + shift) * 70 - Math.exp(-Math.pow(((x - 140) / 1640 - .6) * 12, 2)) * 110]); } tube(p, 8, col); const q = p[p.length - 1]; if (q) spark(q[0], q[1], 60, 1); ctx.textAlign = 'left'; txt(lab, 140, y - 150, 44, col, 'rgba(0,0,0,.9)', 8, '900'); };
  tr(380, '#ffd27a', 'FAMILIARITY', 0); tr(780, '#8ec5ff', 'MEMORY', o.sync ? 0 : 1.6);
  if (!o.sync && prog > .5) { ctx.fillStyle = 'rgba(255,80,80,.14)'; ctx.fillRect(1000, 220, 260, 680); label('MISMATCH', 1130, 200, 46, '#ff6a6a'); }
}
function pocket(u, s, o) {                                                     // jeans pocket with phone; real or phantom buzz
  const g = ctx.createLinearGradient(0, 0, 1920, 1080); g.addColorStop(0, '#2c4a78'); g.addColorStop(1, '#1a2c4c'); ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 3; for (let i = -60; i < 120; i++) { ctx.beginPath(); ctx.moveTo(i * 30, -300); ctx.lineTo(i * 30 + 900, 1400); ctx.stroke(); }
  const buzz = o.buzz ? (Math.sin(s * 60) * 6) * (((s % 1.4) < .5) ? 1 : 0) : 0;
  ctx.save(); ctx.translate(CX + buzz, CY); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.roundRect(-190, -330, 380, 660, 50); ctx.fill(); ctx.fillStyle = '#16181c'; ctx.beginPath(); ctx.roundRect(-170, -320, 340, 640, 44); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#2f528a'; ctx.beginPath(); ctx.moveTo(500, 260); ctx.quadraticCurveTo(CX, 420, 1420, 260); ctx.lineTo(1500, 1200); ctx.lineTo(420, 1200); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#d9a24a'; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(520, 300); ctx.quadraticCurveTo(CX, 455, 1400, 300); ctx.stroke(); ctx.setLineDash([]);
  if (o.buzz && (s % 1.4) < .55) for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(255,240,200,${.7 - i * .2})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(CX, CY, 360 + i * 70 + (s % 1.4) * 200, -2.6, -.5); ctx.stroke(); }
  if (o.text) label(o.text, CX, 150, 72, o.phantom ? '#ff8a8a' : '#ffd23f');
}
function phoneScreen(u, s, o) {
  bgDeep(s, ['#1a2430', '#0a1018']); const x = CX - 230, y = 90;
  ctx.fillStyle = '#0c0d10'; ctx.beginPath(); ctx.roundRect(x - 20, y - 20, 500, 940, 70); ctx.fill(); const sg = ctx.createLinearGradient(0, y, 0, y + 900); sg.addColorStop(0, '#24324a'); sg.addColorStop(1, '#0f1626'); ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(x, y, 460, 900, 56); ctx.fill();
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = '400 150px Anton'; ctx.fillText('9:41', CX, y + 260);
  const k = eo(clamp(u * 3)); ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.beginPath(); ctx.roundRect(x + 30, y + 420, 400, 120, 28); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '800 36px Montserrat'; ctx.fillText(o.msg || 'No new notifications', CX, y + 492); ctx.restore();
  if (o.cross) { const a = clamp(u * 3 - 1); ctx.save(); ctx.globalAlpha = a; tube([[x + 40, y + 380], [x + 420, y + 580]], 18, '#ff5a5a'); tube([[x + 420, y + 380], [x + 40, y + 580]], 18, '#ff5a5a'); ctx.restore(); }
}
function skinTouch(u, s, o) {                                                  // skin section: fabric brushing the surface, touch receptors firing
  bgDeep(s, ['#2a1a1c', '#120a0c']); const top = 420;
  const g = ctx.createLinearGradient(0, top, 0, 1200); g.addColorStop(0, '#e2b39a'); g.addColorStop(.18, '#e9b8a6'); g.addColorStop(.2, '#d48f92'); g.addColorStop(1, '#9a4e5c'); ctx.fillStyle = g; ctx.fillRect(-2400, top, 6800, 2000);
  ctx.fillStyle = '#d8a88a'; for (let x = -200; x < 2200; x += 90) { ctx.beginPath(); ctx.arc(x, top + 120, 46, 0, Math.PI); ctx.fill(); }
  const R = RN(3); for (let i = 0; i < 22; i++) tube(wavy(R() * 2400 - 200, top + 300 + R() * 500, R() * .4 - .2, 500, 14, 5), 7, 'rgba(244,226,190,.45)');
  for (let i = 0; i < 7; i++) { const x = 160 + i * 260, p = [[x, 1200], [x + 30, top + 500], [x - 10, top + 220], [x + 20, top + 110]]; tube(p, 14, '#efd9a2'); ctx.fillStyle = '#f3e2b4'; ctx.beginPath(); ctx.ellipse(x + 20, top + 150, 26, 44, 0, 0, TAU); ctx.fill();
    const ph = (s * .9 + i * .23) % 1; if (o.fire) { const q = [lerp(x + 20, x, ph), lerp(top + 120, 1200, ph)]; spark(q[0], q[1], 70, 1 - ph * .4); } }
  for (let i = 0; i < 9; i++) { const y = top - 30 - i * 16, p = []; for (let x = -200; x <= 2200; x += 30) p.push([x + (s * 120) % 60, y + Math.sin(x * .01 + s * 2 + i) * 10]); tube(p, 10, i % 2 ? '#3a5a8a' : '#2c4a78'); }
  if (o.text) label(o.text, CX, 140, 64, '#ffd23f');
}
function clockWarp(u, s, o) {                                                  // stretching clock: time felt fast or slow
  bgDeep(s, ['#2a2014', '#120c06']); const sp = o.slow ? .15 : 3.2, sx = 1 + (o.slow ? .25 * Math.sin(s * 1.2) : 0);
  ctx.save(); ctx.translate(CX, CY); ctx.scale(sx, 1 / sx); ctx.rotate(o.slow ? .05 * Math.sin(s) : 0);
  const fg = ctx.createRadialGradient(-60, -60, 20, 0, 0, 400); fg.addColorStop(0, '#fff6e2'); fg.addColorStop(1, '#d8c49a'); ctx.fillStyle = '#6a4a20'; ctx.beginPath(); ctx.arc(0, 0, 400, 0, TAU); ctx.fill(); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, 0, 370, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2a1a10'; ctx.font = '400 64px Anton'; ctx.textAlign = 'center'; for (let i = 1; i <= 12; i++) { const a = i / 12 * TAU - Math.PI / 2; ctx.fillText(String(i), Math.cos(a) * 300, Math.sin(a) * 300 + 22); }
  const m = s * sp; tube([[0, 0], [Math.cos(m - Math.PI / 2) * 280, Math.sin(m - Math.PI / 2) * 280]], 14, '#1a120c'); tube([[0, 0], [Math.cos(m / 12 - Math.PI / 2) * 190, Math.sin(m / 12 - Math.PI / 2) * 190]], 20, '#1a120c'); tube([[0, 0], [Math.cos(m * 6 - Math.PI / 2) * 320, Math.sin(m * 6 - Math.PI / 2) * 320]], 6, '#c41c26');
  ctx.fillStyle = '#c41c26'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.restore();
  if (!o.slow) for (let i = 0; i < 6; i++) { ctx.strokeStyle = `rgba(255,230,180,${.25 - i * .03})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(CX, CY, 440 + i * 30, s * 3 + i, s * 3 + i + 1.2); ctx.stroke(); }
  if (o.text) label(o.text, CX, 100, 66, '#ffd23f');
}
function shards(u, s, o) {                                                     // frightening moment in slow motion: shards frozen in the air, every detail sharp
  bgDeep(s, ['#1a2a3a', '#0a121a']); const R = RN(11);
  for (let i = 0; i < 70; i++) { const a = R() * TAU, d = 60 + R() * 900, v = .04 * (o.fast ? 6 : 1), x = CX + Math.cos(a) * d * (1 + s * v), y = CY + Math.sin(a) * d * .7 * (1 + s * v), r = 18 + R() * 50, rot = R() * TAU + s * .2;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const g = ctx.createLinearGradient(-r, -r, r, r); g.addColorStop(0, 'rgba(220,240,255,.85)'); g.addColorStop(1, 'rgba(120,170,210,.35)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-r, -r * .3); ctx.lineTo(r * .7, -r); ctx.lineTo(r, r * .6); ctx.lineTo(-r * .4, r); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
  if (o.focus) { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + s * .2; ctx.strokeStyle = 'rgba(255,210,63,.8)'; ctx.lineWidth = 4; ctx.strokeRect(CX + Math.cos(a) * 420 - 60, CY + Math.sin(a) * 280 - 60, 120, 120); } }
  if (o.text) label(o.text, CX, 140, 64, '#ffd23f');
}
function polaroid(x, y, w, rot, scene, a = 1, glitch = 0) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-w / 2 + 14, -w * .6 + 18, w, w * 1.2); ctx.fillStyle = '#f4efe6'; ctx.fillRect(-w / 2, -w * .6, w, w * 1.2);
  const iw = w * .86, ix = -iw / 2, iy = -w * .6 + w * .07; ctx.save(); ctx.beginPath(); ctx.rect(ix, iy, iw, iw); ctx.clip();
  const sky = ctx.createLinearGradient(0, iy, 0, iy + iw); sky.addColorStop(0, scene.sky); sky.addColorStop(1, '#f6e2c0'); ctx.fillStyle = sky; ctx.fillRect(ix, iy, iw, iw); ctx.fillStyle = scene.ground; ctx.fillRect(ix, iy + iw * .65, iw, iw * .35);
  ctx.fillStyle = scene.obj; ctx.beginPath(); scene.kind === 'car' ? ctx.roundRect(ix + iw * .2, iy + iw * .5, iw * .6, iw * .18, 12) : ctx.arc(ix + iw * .5, iy + iw * .45, iw * .16, 0, TAU); ctx.fill(); if (scene.kind === 'car') { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(ix + iw * .32, iy + iw * .69, iw * .06, 0, TAU); ctx.arc(ix + iw * .68, iy + iw * .69, iw * .06, 0, TAU); ctx.fill(); }
  if (glitch > 0) { for (let k = 0; k < 6; k++) { const yy = iy + ((k * 97 + glitch * 300) % iw); ctx.fillStyle = `rgba(${k % 2 ? 255 : 80},${k % 2 ? 80 : 200},255,.35)`; ctx.fillRect(ix + Math.sin(k + glitch * 20) * 30, yy, iw, 10 + k * 3); } }
  ctx.restore(); ctx.restore();
}
const SCN = [{ sky: '#8ec5e8', ground: '#7aa860', obj: '#c43a3a', kind: 'car' }, { sky: '#f0b080', ground: '#c8a060', obj: '#ffd23f', kind: 'sun' }, { sky: '#9ab8d8', ground: '#5a8a5a', obj: '#3a6ac8', kind: 'car' }, { sky: '#d8c8f0', ground: '#8a7a9a', obj: '#ffffff', kind: 'sun' }];
function memories(u, s, o) {                                                   // floating memory photos in depth; reconstruction swaps details
  bgDeep(s, ['#221a30', '#0e0a16']); const R = RN(21), items = [];
  for (let i = 0; i < 16; i++) items.push({ x: R() * 2200 - 140, y: R() * 1100 - 20, z: .4 + R() * .9, r: (R() - .5) * .5, k: Math.floor(R() * 4) });
  items.sort((a, b) => a.z - b.z); for (const it of items) { const x = it.x + Math.sin(s * .3 + it.r * 9) * 40 * it.z, y = it.y + Math.cos(s * .25 + it.x) * 20 * it.z; const sw = o.swap && ((s * .7 + it.x * .001) % 2) > 1.6 ? (it.k + 1) % 4 : it.k; polaroid(x, y, 300 * it.z, it.r + Math.sin(s * .4 + it.z) * .05, SCN[sw], .35 + it.z * .5, o.swap ? (s % 1.7 < .2 ? s : 0) : 0); }
  if (o.text) label(o.text, CX, 130, 66, '#ffd23f');
}
function headSil(x, y, sc, col) { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, -120, 120, 150, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.lineTo(80, 60); ctx.quadraticCurveTo(220, 90, 260, 260); ctx.lineTo(-260, 260); ctx.quadraticCurveTo(-220, 90, -80, 60); ctx.closePath(); ctx.fill(); ctx.restore(); }
function twoMinds(u, s, o) {                                                   // two people, same event, different memories
  bgDeep(s, ['#1e2232', '#0c0e16']); headSil(520, 820, 1.2, '#0a0a10'); headSil(1400, 820, 1.2, '#0a0a10');
  for (const [x, k, d] of [[520, 0, -1], [1400, 2, 1]]) { for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(x + d * (60 + i * 40), 520 - i * 50, 10 + i * 6, 0, TAU); ctx.fill(); } polaroid(x + d * 160, 260, 330, d * .06 + Math.sin(s + x) * .03, SCN[k]); }
  label('SAME EVENT,', CX, 110, 56, '#fff'); label('DIFFERENT MEMORIES', CX, 185, 56, '#ffd23f');
}
function pill(u, s, o) {                                                       // a 3D capsule spinning: the placebo
  bgDeep(s, ['#203040', '#0a1018']); ctx.save(); ctx.translate(CX, CY - 30); ctx.rotate(-.5 + Math.sin(s * .8) * .25); const sq = .55 + .45 * Math.abs(Math.cos(s * 1.4));
  ctx.scale(1, sq); const L = 520, R0 = 130; for (const [x0, c1, c2] of [[-L / 2, '#f4f6f8', '#b8c0c8'], [0, '#4a8ae0', '#1a4a90']]) { const g = ctx.createLinearGradient(0, -R0, 0, R0); g.addColorStop(0, c1); g.addColorStop(.5, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0, -R0, L / 2, R0 * 2, x0 < 0 ? [R0, 0, 0, R0] : [0, R0, R0, 0]); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.roundRect(-L / 2 + 40, -R0 + 26, L - 80, 30, 15); ctx.fill(); ctx.restore();
  spark(CX + 200, CY - 120, 160, .35 + .2 * Math.sin(s * 3)); if (o.text) label(o.text, CX, 830, 80, '#ffd23f');
}
function synapse(u, s, o) {                                                    // nerve terminal releasing messenger molecules onto receptors
  bgDeep(s, ['#2a1622', '#100810']); const g = ctx.createRadialGradient(CX, 200, 40, CX, 200, 560); g.addColorStop(0, '#f2d6c8'); g.addColorStop(1, '#c8988a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(CX, 120, 620, 400, 0, 0, Math.PI); ctx.fill();
  const R = RN(5); for (let i = 0; i < 16; i++) { const x = CX - 460 + R() * 920, y = 180 + R() * 260; ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(x, y, 34, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,220,140,.9)'; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(x + Math.cos(k) * 14, y + Math.sin(k * 1.7) * 14, 5, 0, TAU); ctx.fill(); } }
  const pg = ctx.createLinearGradient(0, 760, 0, 1100); pg.addColorStop(0, '#e2b0b8'); pg.addColorStop(1, '#a8606e'); ctx.fillStyle = pg; ctx.fillRect(-2400, 760, 6800, 1000);
  for (let x = 200; x < 1800; x += 120) { ctx.fillStyle = '#7a5aa8'; ctx.beginPath(); ctx.roundRect(x - 22, 730, 44, 70, 12); ctx.fill(); ctx.fillStyle = '#1a1020'; ctx.fillRect(x - 6, 730, 12, 24); }
  for (let i = 0; i < 60; i++) { const ph = (s * .5 + R()) % 1, x0 = CX - 400 + R() * 800, tx = 200 + Math.round(R() * 13) * 120, x = lerp(x0, tx, eio(ph)), y = lerp(560, 740, eio(ph)); ctx.fillStyle = o.endo ? 'rgba(140,230,190,.95)' : 'rgba(255,220,140,.95)'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); if (ph > .9) spark(x, y + 20, 50, 1, o.endo ? '160,255,200' : '255,230,160'); }
  if (o.text) label(o.text, CX, 660, 56, o.endo ? '#9effd0' : '#ffd23f');
}
function arm(u, s, o) {                                                        // forearm being scratched (nails sweep), itch redness
  const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, '#2a2028'); g.addColorStop(1, '#141016'); ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  const ag = ctx.createLinearGradient(0, 330, 0, 760); ag.addColorStop(0, '#f0c4a6'); ag.addColorStop(.5, '#d99b7c'); ag.addColorStop(1, '#a86a50'); ctx.fillStyle = ag; ctx.beginPath(); ctx.moveTo(-200, 300); ctx.quadraticCurveTo(CX, 280, 2120, 360); ctx.lineTo(2120, 800); ctx.quadraticCurveTo(CX, 780, -200, 760); ctx.closePath(); ctx.fill();
  const R = RN(4); ctx.strokeStyle = 'rgba(90,60,40,.5)'; ctx.lineWidth = 2; for (let i = 0; i < 160; i++) { const x = R() * 2200 - 100, y = 340 + R() * 400; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 10, y - 8, x + 24, y - 4); ctx.stroke(); }
  const sx = CX + Math.sin(s * 9) * 120 * (o.scratch ? 1 : 0); if (o.scratch) { ctx.fillStyle = 'rgba(220,70,70,.28)'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.roundRect(CX - 170, 460 + k * 34, 340, 12, 6); ctx.fill(); } }
  if (o.bump) { ctx.fillStyle = 'rgba(210,80,80,.5)'; ctx.beginPath(); ctx.arc(1200, 560, 46 + 6 * Math.sin(s * 4), 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,200,200,.5)'; ctx.beginPath(); ctx.arc(1190, 548, 14, 0, TAU); ctx.fill(); }
  if (o.scratch) { ctx.save(); ctx.translate(sx, 360); const hg = ctx.createLinearGradient(0, -400, 0, 120); hg.addColorStop(0, '#b77a5c'); hg.addColorStop(1, '#e2ac8e'); ctx.fillStyle = hg; ctx.beginPath(); ctx.roundRect(-150, -520, 300, 460, 120); ctx.fill(); for (let f = 0; f < 4; f++) { ctx.fillStyle = '#e2ac8e'; ctx.beginPath(); ctx.roundRect(-140 + f * 72, -120, 60, 200, 30); ctx.fill(); ctx.fillStyle = '#f6dcd0'; ctx.beginPath(); ctx.roundRect(-132 + f * 72, 40, 44, 34, 14); ctx.fill(); } ctx.restore(); }
  if (o.mosquito) { const x = 1180 + Math.sin(s * 3) * 30, y = 420 + Math.cos(s * 4) * 20; ctx.strokeStyle = '#222'; ctx.lineWidth = 4; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 60 + k * 24, y + 70); ctx.stroke(); } ctx.fillStyle = '#2a2a2a'; ctx.beginPath(); ctx.ellipse(x, y, 60, 18, -.3, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(200,220,240,.5)'; ctx.beginPath(); ctx.ellipse(x - 10, y - 40, 50, 18, -1, 0, TAU); ctx.fill(); const a = clamp(u * 3 - 1); tube([[x - 150, y - 120], [x + 150, y + 120]], 24 * a, 'rgba(255,70,70,.95)'); tube([[x + 150, y - 120], [x - 150, y + 120]], 24 * a, 'rgba(255,70,70,.95)'); }
  if (o.text) label(o.text, CX, 170, 62, '#ffd23f');
}
function ear(u, s, o) {                                                        // outer ear + sound waves + glowing cochlea
  bgDeep(s, ['#2a1a20', '#100a0c']); const ex = 1240, ey = 540;
  for (let i = 0; i < 6; i++) { const ph = (s * .6 + i / 6) % 1; ctx.strokeStyle = `rgba(255,230,190,${.6 * (1 - ph)})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(ex - 200, ey, 120 + ph * 900, Math.PI * .75, Math.PI * 1.25); ctx.stroke(); }
  const g = ctx.createRadialGradient(ex - 40, ey - 80, 30, ex, ey, 360); g.addColorStop(0, '#f0c2a2'); g.addColorStop(1, '#b77656'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ex, ey - 320); ctx.bezierCurveTo(ex + 260, ey - 340, ex + 280, ey - 40, ex + 180, ey + 120); ctx.bezierCurveTo(ex + 120, ey + 220, ex + 140, ey + 330, ex + 40, ey + 330); ctx.bezierCurveTo(ex - 60, ey + 330, ex - 90, ey + 200, ex - 60, ey + 100); ctx.bezierCurveTo(ex - 130, ey - 60, ex - 110, ey - 300, ex, ey - 320); ctx.fill();
  ctx.strokeStyle = 'rgba(140,70,50,.6)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(ex - 10, ey - 230); ctx.bezierCurveTo(ex + 170, ey - 250, ex + 190, ey - 30, ex + 90, ey + 80); ctx.stroke(); ctx.fillStyle = '#3a1a14'; ctx.beginPath(); ctx.ellipse(ex + 20, ey + 20, 40, 56, 0, 0, TAU); ctx.fill();
  if (o.cochlea) { ctx.save(); ctx.translate(560, 540); ctx.strokeStyle = '#efd0b8'; ctx.lineWidth = 34; ctx.beginPath(); for (let t = 0; t < 14; t += .05) { const r = 230 * Math.exp(-t * .17); const x = Math.cos(t) * r, y = Math.sin(t) * r; t ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); const t = (s * 3) % 14, r = 230 * Math.exp(-t * .17); spark(Math.cos(t) * r, Math.sin(t) * r, 90, 1); ctx.restore(); label('COCHLEA', 560, 860, 44, '#efd0b8'); }
  if (o.text) label(o.text, 560, 220, 64, '#ffd23f');
}
function fan(u, s, o) {                                                        // whirring fan; noise → brain hears a voice
  bgDeep(s, ['#1a2430', '#0a1018']); const fx = 560, fy = 520;
  ctx.strokeStyle = '#9aa4ae'; ctx.lineWidth = 6; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(fx, fy, 300, i / 12 * TAU, i / 12 * TAU + .4); ctx.stroke(); } ctx.beginPath(); ctx.arc(fx, fy, 320, 0, TAU); ctx.stroke();
  ctx.save(); ctx.translate(fx, fy); ctx.rotate(s * 14); for (let b = 0; b < 3; b++) { ctx.rotate(TAU / 3); ctx.fillStyle = 'rgba(200,215,225,.55)'; ctx.beginPath(); ctx.ellipse(130, 0, 140, 60, .3, 0, TAU); ctx.fill(); } ctx.restore(); ctx.fillStyle = '#c8d0d8'; ctx.beginPath(); ctx.arc(fx, fy, 50, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a6068'; ctx.fillRect(fx - 20, fy + 320, 40, 260);
  const R = RN(3); for (let i = 0; i < 90; i++) { const ph = (s * .5 + R()) % 1, x = lerp(fx + 330, 1500, ph), y = fy + (R() - .5) * 500 * (1 - ph * .7); ctx.fillStyle = `rgba(255,240,210,${.6 * (1 - ph)})`; ctx.fillRect(x, y, 6, 6); }
  const p = []; for (let x = 1300; x < 1800; x += 6) p.push([x, fy + Math.sin(x * .07 + s * 9) * 60 * Math.exp(-Math.pow((x - 1550) / 160, 2))]); tube(p, 6, '#ffd27a');
  if (o.voice) { const a = clamp(u * 3 - .5); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(1350, 240, 420, 140, 50); ctx.fill(); ctx.beginPath(); ctx.moveTo(1460, 370); ctx.lineTo(1420, 430); ctx.lineTo(1500, 375); ctx.fill(); ctx.fillStyle = '#111'; ctx.font = '400 72px Anton'; ctx.textAlign = 'center'; ctx.fillText(o.voice, 1560, 335); ctx.restore(); }
}
function court(u, s, o) {                                                      // count the passes… and miss the gorilla
  const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, '#3a3a3e'); g.addColorStop(1, '#202024'); ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  const fl = ctx.createLinearGradient(0, 560, 0, 1080); fl.addColorStop(0, '#b88a54'); fl.addColorStop(1, '#8a6034'); ctx.fillStyle = fl; ctx.fillRect(-2400, 600, 6800, 2000); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(CX, 860, 520, 120, 0, 0, TAU); ctx.stroke();
  const P = [[520, 'w'], [820, 'b'], [1100, 'w'], [1380, 'b'], [680, 'b'], [1240, 'w']];
  const person = (x, y, col, sc, ph) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); const leg = Math.sin(ph) * 18; ctx.fillStyle = '#222'; ctx.fillRect(-26 + leg * .5, 60, 20, 140); ctx.fillRect(6 - leg * .5, 60, 20, 140); ctx.fillStyle = col === 'w' ? '#f2f2f2' : '#121212'; ctx.beginPath(); ctx.roundRect(-46, -80, 92, 150, 20); ctx.fill(); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.arc(0, -120, 38, 0, TAU); ctx.fill(); ctx.restore(); };
  P.forEach(([x, c], i) => person(x + Math.sin(s * 1.3 + i * 2) * 50, 640 + (i % 2) * 70, c, 1.2, s * 6 + i));
  const pi = Math.floor(s / .8) % 3, pf = (s % .8) / .8, wi = [0, 2, 5][pi], wj = [0, 2, 5][(pi + 1) % 3]; const ax = P[wi][0] + Math.sin(s * 1.3 + wi * 2) * 50, bx2 = P[wj][0] + Math.sin(s * 1.3 + wj * 2) * 50; const bxp = lerp(ax, bx2, pf), byp = 560 - Math.sin(pf * Math.PI) * 120;
  ctx.fillStyle = '#e07a2a'; ctx.beginPath(); ctx.arc(bxp, byp, 30, 0, TAU); ctx.fill();
  if (o.gorilla) { const gx = lerp(-200, 2100, clamp(u * 1.05)), gy = 700; ctx.save(); ctx.translate(gx, gy); ctx.fillStyle = '#1a1614'; ctx.beginPath(); ctx.ellipse(0, -40, 110, 150, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, -210, 64, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a4a40'; ctx.beginPath(); ctx.ellipse(0, -196, 36, 28, 0, 0, TAU); ctx.fill(); for (const d of [-1, 1]) { ctx.fillStyle = '#1a1614'; ctx.beginPath(); ctx.roundRect(d * 90 - 28, -120, 56, 230 + Math.sin(s * 6 + d) * 20, 26); ctx.fill(); ctx.beginPath(); ctx.roundRect(d * 40 - 30, 80, 60, 140, 26); ctx.fill(); } ctx.restore(); }
  if (o.focus) { const v = ctx.createRadialGradient(bxp, byp, 60, bxp, byp, 520); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.78)'); ctx.fillStyle = v; ctx.fillRect(-2400, -2400, 6800, 6000); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(bxp, byp, 70, 0, TAU); ctx.stroke(); ctx.textAlign = 'right'; txt('PASSES: ' + (Math.floor(s / .8) + 3), 1840, 110, 64, '#ffd23f', 'rgba(0,0,0,.9)', 10, '400', 'Anton'); }
  if (o.text) label(o.text, CX, 140, 66, '#ffd23f');
}
function dream(u, s, o) {                                                      // bedroom at night with a dream drifting above the sleeper
  const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, '#141a34'); g.addColorStop(1, '#0a0c1a'); ctx.fillStyle = g; ctx.fillRect(-2400, -2400, 6800, 6000);
  ctx.fillStyle = '#c8d6f0'; ctx.beginPath(); ctx.arc(1600, 200, 80, 0, TAU); ctx.fill(); spark(1600, 200, 300, .3, '200,215,255');
  ctx.fillStyle = '#3a3050'; ctx.beginPath(); ctx.roundRect(300, 720, 1320, 220, 40); ctx.fill(); ctx.fillStyle = '#e8e2f0'; ctx.beginPath(); ctx.roundRect(340, 650, 300, 110, 50); ctx.fill(); ctx.fillStyle = '#5a6aa8'; ctx.beginPath(); ctx.moveTo(560, 760); ctx.bezierCurveTo(800, 640, 1300, 660, 1600, 740); ctx.lineTo(1600, 800); ctx.lineTo(560, 800); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.ellipse(500, 670, 80, 64, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1c14'; ctx.beginPath(); ctx.ellipse(470, 640, 80, 50, 0, Math.PI, TAU); ctx.fill();
  for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(600 + i * 60, 560 - i * 60, 14 + i * 8, 0, TAU); ctx.fill(); }
  const k = o.fade ? 1 - clamp(u * 1.3) : 1; ctx.save(); ctx.globalAlpha = k; const cl = ctx.createRadialGradient(1060, 300, 40, 1060, 300, 420); cl.addColorStop(0, 'rgba(230,220,255,.95)'); cl.addColorStop(1, 'rgba(180,170,240,.0)'); ctx.fillStyle = cl; ctx.fillRect(560, -120, 1000, 840);
  ctx.save(); ctx.translate(1060, 300); ctx.rotate(Math.sin(s * .5) * .2); ctx.fillStyle = '#e2a040'; ctx.beginPath(); ctx.ellipse(-150, -40, 70, 34, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-90, -40); ctx.lineTo(-50, -70); ctx.lineTo(-50, -10); ctx.fill(); ctx.strokeStyle = '#6a5ac8'; ctx.lineWidth = 12; for (let st = 0; st < 5; st++) { ctx.beginPath(); ctx.moveTo(40 + st * 34, 120 - st * 34); ctx.lineTo(74 + st * 34, 120 - st * 34); ctx.lineTo(74 + st * 34, 86 - st * 34); ctx.stroke(); } ctx.restore(); clockMini(960 + Math.sin(s) * 40, 200, 70, s); ctx.restore();
  if (o.text) label(o.text, CX, 120, 56, '#ffd23f');
}
function clockMini(x, y, r, s) { ctx.save(); ctx.translate(x, y); ctx.scale(1.3, .8); ctx.fillStyle = '#f6eed8'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); tube([[0, 0], [Math.cos(s * 2) * r * .8, Math.sin(s * 2) * r * .8]], 6, '#222'); ctx.restore(); }
function puzzle(u, s, o) {                                                     // reality assembled from tiles by the brain
  bgDeep(s, ['#1e2a3a', '#0a0e16']); const n = 8, m = 5, tw = 200, th = 160, x0 = CX - n * tw / 2, y0 = CY - m * th / 2, R = RN(8);
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const d = R(), k = eio(clamp(u * 1.6 - d * .6)), sx = x0 + i * tw, sy = y0 + j * th, fx = sx + (R() - .5) * 1600, fy = sy + (R() - .5) * 1200, x = lerp(fx, sx, k), y = lerp(fy, sy, k);
    ctx.save(); ctx.globalAlpha = .3 + .7 * k; ctx.beginPath(); ctx.rect(x, y, tw - 4, th - 4); ctx.clip(); ctx.translate(x - sx, y - sy); const sky = ctx.createLinearGradient(0, y0, 0, y0 + m * th); sky.addColorStop(0, '#f0a070'); sky.addColorStop(.6, '#f6d8a8'); sky.addColorStop(.61, '#4a7a4a'); sky.addColorStop(1, '#2a4a2a'); ctx.fillStyle = sky; ctx.fillRect(x0, y0, n * tw, m * th); ctx.fillStyle = '#ffe9a0'; ctx.beginPath(); ctx.arc(x0 + 1100, y0 + 330, 90, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a3a5a'; ctx.beginPath(); ctx.moveTo(x0, y0 + 500); ctx.lineTo(x0 + 400, y0 + 240); ctx.lineTo(x0 + 800, y0 + 500); ctx.fill(); ctx.restore(); }
  if (o.text) label(o.text, CX, 100, 62, '#ffd23f');
}
function finale(u, s, o) {                                                     // ending cards: question / subscribe / comment
  brain3d(u, s, { glows: [[-160, -100, 300, 0], [90, -20, 260, 1.7], [-40, 90, 240, 3.1]] }); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const k = eo(clamp(u * 4));
  if (o.mode === 'q') { ctx.save(); ctx.globalAlpha = k; label('HOW MUCH OF YOUR REALITY', CX, 420, 84, '#fff'); label('IS REAL… AND HOW MUCH', CX, 540, 84, '#fff'); label('IS YOUR BRAIN?', CX, 690, 120, '#ffd23f'); ctx.restore(); }
  if (o.mode === 'sub') { ctx.save(); ctx.globalAlpha = k; label('BODY HACKS', CX, 400, 140, '#fff'); const p = 1 + .04 * Math.sin(s * 6); ctx.translate(CX, 600); ctx.scale(p, p); ctx.fillStyle = '#e0303a'; ctx.beginPath(); ctx.roundRect(-330, -80, 660, 160, 80); ctx.fill(); txt('SUBSCRIBE', 0, 34, 96, '#fff', 'rgba(0,0,0,.3)', 8, '400', 'Anton'); ctx.restore(); }
  if (o.mode === 'com') { ctx.save(); ctx.globalAlpha = k; label('WHICH BRAIN TRICK', CX, 360, 100, '#fff'); label('HAVE YOU EXPERIENCED?', CX, 490, 100, '#fff'); const p = 1 + .05 * Math.sin(s * 5); ctx.translate(CX, 690); ctx.scale(p, p); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-560, -80, 1120, 160, 40); ctx.fill(); txt('💬 TELL US IN THE COMMENTS', 0, 22, 58, '#111', 'rgba(0,0,0,0)', 0, '900'); ctx.restore(); }
}
function chapterCard(u, s, o) {                                                // chapter title: huge extruded number, title slam, progress dots
  const c = o.c; brain3d(u, s, { glows: [[-160, -100, 260, 0]], hue: ['#241428', '#0e0812'] }); ctx.fillStyle = 'rgba(4,2,8,.62)'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const k = eo(clamp(s / .5)), k2 = eo(clamp((s - .25) / .5)), num = c.n === 0 ? '' : c.n === 11 ? '' : String(c.n).padStart(2, '0');
  if (num) { ctx.save(); ctx.translate(560, 590); const sc = 1.35 - .35 * k; ctx.scale(sc, sc); ctx.globalAlpha = k; ctx.font = '400 520px Anton'; ctx.textAlign = 'center'; for (let d = 18; d > 0; d--) { ctx.fillStyle = `rgb(${110 - d * 3},${30},${40})`; ctx.fillText(num, d * 1.6, d * 1.6 + 180); } const ng = ctx.createLinearGradient(0, -260, 0, 180); ng.addColorStop(0, '#fff2b0'); ng.addColorStop(.5, '#ffd23f'); ng.addColorStop(1, '#e08a1a'); ctx.fillStyle = ng; ctx.fillText(num, 0, 180); ctx.restore(); }
  const tx = num ? 1040 : CX, al = num ? 'left' : 'center';
  ctx.save(); ctx.globalAlpha = k2; ctx.translate((1 - k2) * 120, 0); ctx.textAlign = al; const words = c.title.split(' '); let lines = [], cur = ''; for (const w of words) { if ((cur + ' ' + w).trim().length > 12 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } lines.push(cur);
  lines.forEach((ln, i) => txt(ln, tx, 470 + i * 140 - (lines.length - 1) * 50, 140, '#fff', '#000', 16, '400', 'Anton'));
  if (c.sub) { ctx.font = '800 38px Montserrat'; ctx.fillStyle = '#f3c9c0'; const sub = c.sub.slice(0, Math.floor(c.sub.length * clamp((s - .5) / 1.2))); const maxW = num ? 800 : 1500, ws2 = sub.split(' '); let ln = '', yy = 470 + lines.length * 140 - (lines.length - 1) * 50 + 10; for (const w of ws2) { if (ctx.measureText(ln + ' ' + w).width > maxW && ln) { ctx.fillText(ln, tx, yy); ln = w; yy += 52; } else ln = (ln + ' ' + w).trim(); } ctx.fillText(ln, tx, yy); }
  ctx.restore();
  const sw = (s * 900) % 3200 - 600; const sg = ctx.createLinearGradient(sw - 200, 0, sw + 200, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,240,220,.08)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(-2400, -2400, 6800, 6000);
  if (c.n >= 1 && c.n <= 10) for (let i = 1; i <= 10; i++) { const x = CX - 5 * 70 + (i - .5) * 70, on = i <= c.n; ctx.fillStyle = on ? (i === c.n ? '#ffd23f' : 'rgba(255,210,63,.6)') : 'rgba(255,255,255,.2)'; ctx.beginPath(); ctx.arc(x, 980, i === c.n ? 16 : 11, 0, TAU); ctx.fill(); }
}
function hook(u, s, o) {                                                       // opening: the drift illusion behind a glowing brain + slam text
  snakes(u, s, { spin: .05 }); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-2400, -2400, 6800, 6000);
  const halo = ctx.createRadialGradient(CX, CY, 100, CX, CY, 700); halo.addColorStop(0, 'rgba(20,6,14,.9)'); halo.addColorStop(1, 'rgba(20,6,14,0)'); ctx.fillStyle = halo; ctx.fillRect(-2400, -2400, 6800, 6000);
  brainAt(CX, CY + 40, 1.05, s, [[-160, -100, 260, 0], [90, -20, 220, 1.7]], 3);
}
