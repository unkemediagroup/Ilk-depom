// Seri2 #16 — "What If Pangea Never Broke Apart?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 43.06;
const SUBY = 1540;
const SAND = '#e8a64a', HOT = '#ff5a2a', SEA = '#1a6ad8', GRN = '#4ac85a', RED = '#ff3b4e';

// Pangea silueti (yerel koordinatlarda, ~±1 birim)
const PG = (() => { const R = RN(17), pts = []; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU, r = .75 + .18 * Math.sin(a * 3 + 1) + .1 * Math.sin(a * 7) + (R() - .5) * .08; pts.push([Math.cos(a) * r, Math.sin(a) * r * 1.15]); } return pts; })();
function pangea(x, y, s, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); PG.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath();
  if (o.inner) { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, .95); g.addColorStop(0, o.inner); g.addColorStop(.55, o.inner); g.addColorStop(.75, GRN); g.addColorStop(1, '#2a8a3a'); ctx.fillStyle = g; } else ctx.fillStyle = GRN;
  ctx.fill(); ctx.lineWidth = .012; ctx.strokeStyle = '#eaffd0'; ctx.stroke(); ctx.restore(); }
function seaBG(t) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0e3a7a'); g.addColorStop(1, '#041430'); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 3; for (let i = 0; i < 16; i++) { ctx.beginPath(); for (let x = -300; x < W + 300; x += 30) ctx.lineTo(x, i * 130 + Math.sin(x * .01 + t + i) * 12); ctx.stroke(); } }

// ---------- S1 0–9.6: kıtalar geri birleşir → tek süper kıta ----------
function s1(t) {
  seaBG(t);
  const j = eio(seg(t, 0, 4.6));
  cam({ zoom: 1.08 - .06 * j, rot: (1 - j) * .1, t, shake: 2 + 16 * seg(t, 4.3, 4.6) * (1 - seg(t, 4.6, 5.4)) }, () => {
    // altı parça dağınıktan merkeze kayar, sonra tek Pangea
    if (j < 1) { const P = [[-1, -1.1, .4], [1, -1, -.5], [-1.1, .3, .7], [1.1, .4, -.3], [-.4, 1.2, .2], [.6, 1.25, -.6]]; P.forEach(([dx, dy, r], i) => { ctx.save(); ctx.translate(W / 2 + dx * 420 * (1 - j), 900 + dy * 420 * (1 - j)); ctx.rotate(r * (1 - j)); ctx.beginPath(); ctx.rect(-1, -1, 2, 2); ctx.save(); ctx.translate(-W / 2 - dx * 0, -900); ctx.restore(); ctx.restore();
        ctx.save(); ctx.translate(W / 2 + dx * 420 * (1 - j), 900 + dy * 420 * (1 - j)); ctx.rotate(r * (1 - j)); ctx.beginPath(); const a0 = i / 6 * TAU, a1 = (i + 1) / 6 * TAU; ctx.moveTo(0, 0); for (let k = 0; k <= 10; k++) { const a = lerp(a0, a1, k / 10), idx = Math.floor(a / TAU * 64) % 64, [px, py] = PG[idx]; ctx.lineTo(px * 400, py * 400); } ctx.closePath(); ctx.fillStyle = GRN; ctx.fill(); ctx.strokeStyle = '#eaffd0'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }); }
    else pangea(W / 2, 900, 400);
    if (t > 4.4) ring2(W / 2, 900, seg(t, 4.4, 5.4), 700, '#eaffd0', 14);
  });
  kinetic(['WHAT', 'IF', 'CONTINENTS', 'NEVER'], W / 2, 200, 110, t, -.3, { gap: .05 });
  kinetic(['SPLIT?'], W / 2, 340, 200, t, .2, { hl: { 'SPLIT?': SAND } });
  if (t > 5.96) bigText('ONE SUPERCONTINENT', W / 2, 1420, 90, GRN, seg(t, 5.96, 6.25), { glow: GRN });
  if (t > 7.7) pill('ONE OCEAN', W / 2, 520, 60, '#6ab0ff', seg(t, 7.7, 7.95));
}

// ---------- S2 9.6–19.2: iç kısım = kavurucu mega çöl ----------
function s2(t) {
  const heat = seg(t, 13.2, 17);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpH('#6ab0ff', '#ffb04a', heat)); g.addColorStop(1, lerpH('#c9a77a', '#8a2a0a', heat)); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  cam({ zoom: 1.03 + .08 * seg(t, 9.6, 19), t, shake: 1 }, () => {
    // güneş
    ctx.fillStyle = '#fff2a0'; ctx.shadowColor = '#ffb04a'; ctx.shadowBlur = 120; ctx.beginPath(); ctx.arc(W / 2, 600, 140 + 30 * heat, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    // kumul katmanları
    for (let k = 0; k < 4; k++) { ctx.fillStyle = lerpH(['#f0c070', '#e8a64a', '#d08a3a', '#b0662a'][k], '#7a2a10', heat * .5); ctx.beginPath(); ctx.moveTo(-300, H); for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, 950 + k * 170 + Math.sin(x * .006 + k * 2 + t * .2 * (k + 1)) * 60); ctx.lineTo(W + 300, H); ctx.fill(); }
    // kurumuş bulutlar yarıda kesilir (nem iç kısma ulaşamaz)
    const R = RN(3); for (let i = 0; i < 5; i++) { const q = seg(t, 9.8 + i * .2, 12.6), x = lerp(-200, 300 + R() * 200, q), a = 1 - seg(t, 11.6 + i * .1, 12.7); if (a <= 0) continue; ctx.fillStyle = `rgba(255,255,255,${.85 * a})`; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(x + k * 55, 380 + i * 70 - (k % 2) * 20, 50, 0, TAU); ctx.fill(); } }
    // sıcaklık dalgalanması + kafatası/iskelet
    if (heat > 0) { ctx.strokeStyle = `rgba(255,255,255,${.25 * heat})`; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { ctx.beginPath(); for (let y = 1400; y > 800; y -= 20) ctx.lineTo(100 + i * 130 + Math.sin(y * .03 + t * 6) * 14, y); ctx.stroke(); } }
    if (t > 15.36) { const k = eback(seg(t, 15.36, 15.7)); ctx.save(); ctx.translate(780, 1260); ctx.scale(k, k); ctx.fillStyle = '#f4eadb'; ctx.beginPath(); ctx.arc(0, -60, 70, Math.PI, 0); ctx.lineTo(50, 10); ctx.lineTo(-50, 10); ctx.fill(); ctx.fillStyle = '#3a1a0a'; ctx.beginPath(); ctx.arc(-26, -55, 18, 0, TAU); ctx.arc(26, -55, 18, 0, TAU); ctx.fill(); ctx.restore(); }
  });
  if (t < 13.2) kinetic(['NO', 'RAIN', 'INSIDE'], W / 2, 220, 140, t, 9.9, { hl: { RAIN: '#6ab0ff' } });
  else { bigText('MEGA-DESERT', W / 2, 220, 150, HOT, seg(t, 14.82, 15.1), { glow: HOT }); }
  if (t > 16.92) counter(40, 60, W / 2, 1400, 170, seg(t, 16.92, 18.4), { fmt: v => Math.round(v) + '°C', col: '#fff' });
}

// ---------- S3 19.2–24.4: tüm uygarlık dar kıyı şeridine sıkışır ----------
function s3(t) {
  seaBG(t);
  const z = eio(seg(t, 19.3, 20.5));
  cam({ zoom: 1.03 + .1 * seg(t, 21, 24.4), t, shake: 2 }, () => {
    pangea(W / 2, 900, lerp(400, 520, z), { inner: '#e8a64a' });
    // kıyı şeridinde ışık/şehir noktaları
    const R = RN(9), k = seg(t, 19.7, 22.6), sc = lerp(400, 520, z); for (let i = 0; i < 160; i++) { const idx = Math.floor(R() * 64), [px, py] = PG[idx], f = .86 + R() * .1; if (i / 160 > k) continue; ctx.fillStyle = '#ffe23a'; ctx.shadowColor = '#ffe23a'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(W / 2 + px * sc * f, 900 + py * sc * f, 6, 0, TAU); ctx.fill(); } ctx.shadowBlur = 0;
    // sıkışma okları (dışarı doğru itilir)
    if (t > 21.06) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3, r0 = 120, r1 = 300 + 20 * Math.sin(t * 6); ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * r0, 900 + Math.sin(a) * r0); ctx.lineTo(W / 2 + Math.cos(a) * r1, 900 + Math.sin(a) * r1); ctx.stroke(); }
  });
  kinetic(['CRAMMED', 'ON', 'THE', 'COAST'], W / 2, 220, 120, t, 19.4, { hl: { COAST: '#ffe23a' } });
  if (t > 22.74) pill('HABITABLE STRIP', W / 2, 1420, 60, '#ffe23a', seg(t, 22.74, 23));
}

// ---------- S4 24.4–30.7: okyanus yok → dev raylı ağlar ----------
function train(x, y, s, n, col) { ctx.save(); ctx.translate(x, y); for (let i = 0; i < n; i++) { ctx.fillStyle = i ? '#d8dde6' : col; ctx.beginPath(); ctx.roundRect(-i * s * 1.05, -s * .3, s, s * .3, i ? s * .04 : [s * .04, s * .2, s * .04, s * .04]); ctx.fill(); ctx.fillStyle = '#1a2a4a'; for (let k = 0; k < 3; k++) ctx.fillRect(-i * s * 1.05 + s * .12 + k * s * .28, -s * .24, s * .18, s * .1); } ctx.restore(); }
function s4(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5aa0e8'); g.addColorStop(1, '#c9e0ff'); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    ctx.fillStyle = '#7ab85a'; ctx.fillRect(-300, 820, W + 600, 1400);
    // birbirine geçen raylar (perspektif)
    const L = [[700, '#8a6a4a'], [1000, '#6a5a4a'], [1300, '#5a4a3a']];
    L.forEach(([y, c], li) => { ctx.strokeStyle = '#555'; ctx.lineWidth = 6 + li * 3; ctx.beginPath(); ctx.moveTo(-300, y + 120); ctx.lineTo(W + 300, y + 120); ctx.moveTo(-300, y + 150 + li * 10); ctx.lineTo(W + 300, y + 150 + li * 10); ctx.stroke(); ctx.fillStyle = c; for (let x = -300 - (t * 200 * (li + 1)) % 60; x < W + 300; x += 60) ctx.fillRect(x, y + 112, 12 + li * 4, 46 + li * 10); });
    const k = seg(t, 29.2, 29.9); train(((t * 900) % 2600) - 400, 818, 200 * (1 + k * .2), 6, RED); train(W + 600 - ((t * 1100) % 2900), 1118, 250, 5, '#3a7aff'); train(((t * 700 + 900) % 2800) - 500, 1428, 300, 4, '#ffc83d');
    // sınır kapıları (bayraklar)
    for (let i = 0; i < 3; i++) { const x = 200 + i * 340; ctx.fillStyle = '#333'; ctx.fillRect(x, 520, 8, 200); ctx.fillStyle = ['#ff3b4e', '#3a7aff', '#1ac87a'][i]; ctx.fillRect(x + 8, 520, 110, 70); }
  });
  kinetic(['NO', 'OCEANS', 'BETWEEN', 'NATIONS'], W / 2, 220, 110, t, 24.5, { hl: { OCEANS: '#6ab0ff' } });
  if (t > 29.64) stampText('MEGA RAILWAYS', W / 2, 420, 100, '#fff', seg(t, 29.64, 29.9));
}

// ---------- S5 30.7–35.9: savaş ve salgın sınırsız yayılır ----------
function s5(t) {
  ctx.fillStyle = '#0a0606'; ctx.fillRect(-300, -300, W + 600, H + 600);
  const sp = seg(t, 31.9, 35.2);
  cam({ zoom: 1.05 + .06 * sp, t, shake: 3 + 6 * Math.max(0, Math.sin(t * 5)) * seg(t, 31, 32) }, () => {
    pangea(W / 2, 900, 470, { inner: '#e8a64a' });
    // salgın: kırmızı leke kıyı boyunca yayılır
    const R = RN(4); ctx.save(); ctx.globalCompositeOperation = 'source-atop'; ctx.restore();
    for (let i = 0; i < 64; i++) { const d = Math.min(i, 64 - i) / 32; if (d > sp) continue; const [px, py] = PG[(i + 8) % 64]; ctx.fillStyle = `rgba(255,40,60,${.55})`; ctx.shadowColor = RED; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(W / 2 + px * 420, 900 + py * 420, 55 + 15 * Math.sin(t * 5 + i), 0, TAU); ctx.fill(); } ctx.shadowBlur = 0;
    // virüs simgeleri
    for (let i = 0; i < 5; i++) { const a = t * .6 + i * 1.25, x = W / 2 + Math.cos(a) * 330, y = 900 + Math.sin(a) * 380; if (sp <= 0) break; ctx.save(); ctx.translate(x, y); ctx.rotate(t + i); ctx.fillStyle = '#3aff7a'; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill(); for (let k = 0; k < 8; k++) { ctx.rotate(TAU / 8); ctx.fillRect(-4, 26, 8, 16); ctx.beginPath(); ctx.arc(0, 46, 7, 0, TAU); ctx.fill(); } ctx.restore(); }
    // ordu okları (savaş)
    const w = seg(t, 31.04, 31.8); if (w > 0) for (let i = 0; i < 3; i++) { const a0 = i * 2.1, x0 = W / 2 + Math.cos(a0) * 360, y0 = 900 + Math.sin(a0) * 400; ctx.strokeStyle = '#fff'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, W / 2, w * .6), lerp(y0, 900, w * .6)); ctx.stroke(); }
  });
  kinetic(['WARS', '&', 'PANDEMICS'], W / 2, 220, 120, t, 31.0, { hl: { WARS: '#fff', PANDEMICS: '#3aff7a' } });
  if (t > 33.44) stampText('UNSTOPPABLE', W / 2, 1370, 110, RED, seg(t, 33.44, 33.7));
}

// ---------- S6 35.9–43.06: ada yok → kanguru, lemur yok ----------
function roo(x, y, s, t) { const hop = Math.abs(Math.sin(t * 5)) * s * .2; ctx.save(); ctx.translate(x, y - hop); ctx.fillStyle = '#c0703a'; ctx.beginPath(); ctx.ellipse(0, 0, s * .3, s * .42, -.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(s * .2, -s * .48, s * .12, s * .16, .3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(s * .17, -s * .7, s * .04, s * .12, 0, 0, TAU); ctx.fill(); ctx.lineWidth = s * .09; ctx.strokeStyle = '#c0703a'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * .2, s * .25); ctx.quadraticCurveTo(-s * .6, s * .5, -s * .8, s * .35); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, s * .3); ctx.lineTo(s * .28, s * .5); ctx.stroke(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(s * .25, -s * .52, s * .02, 0, TAU); ctx.fill(); ctx.restore(); }
function lemur(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#9aa2b0'; ctx.beginPath(); ctx.ellipse(0, 0, s * .22, s * .32, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, -s * .4, s * .16, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -s * .36, s * .1, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffb000'; ctx.beginPath(); ctx.arc(-s * .06, -s * .43, s * .045, 0, TAU); ctx.arc(s * .06, -s * .43, s * .045, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-s * .06, -s * .43, s * .02, 0, TAU); ctx.arc(s * .06, -s * .43, s * .02, 0, TAU); ctx.fill();
  ctx.lineWidth = s * .1; ctx.lineCap = 'round'; for (let i = 0; i < 9; i++) { ctx.strokeStyle = i % 2 ? '#111' : '#f4f4f4'; const a0 = i / 9, a1 = (i + 1) / 9; ctx.beginPath(); for (const q of [a0, a1]) { const tx = s * .2 + Math.sin(q * 3 + t * 2) * s * .25 + q * s * .3, ty = s * .2 - q * s * 1.1; q === a0 ? ctx.moveTo(tx, ty) : ctx.lineTo(tx, ty); } ctx.stroke(); } ctx.restore(); }
function s6(t) {
  seaBG(t);
  const late = t > 41.2;
  cam({ zoom: 1.03, t, shake: 2 + (late ? 10 * seg(t, 42.3, 42.6) * (1 - seg(t, 42.6, 43)) : 0) }, () => {
    // ağaç dalında evrim: dallar budanır
    const p = seg(t, 36.1, 37.6); ctx.strokeStyle = '#eaffd0'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    const tree = (x, y, a, l, d) => { if (d > 4 || l < 20) return; const x2 = x + Math.cos(a) * l * clamp(p * 5 - d), y2 = y + Math.sin(a) * l * clamp(p * 5 - d); ctx.lineWidth = 14 - d * 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); tree(x2, y2, a - .45, l * .72, d + 1); tree(x2, y2, a + .45, l * .72, d + 1); };
    ctx.save(); ctx.globalAlpha = late ? .25 : .9; tree(W / 2, 1320, -Math.PI / 2, 230, 0); ctx.restore();
    // yalıtılmış adalar → çarpı ile silinir
    if (t > 38.98 && !late) for (let i = 0; i < 3; i++) { const x = 220 + i * 320, y = 640 + (i % 2) * 120, k = eback(seg(t, 38.98 + i * .12, 39.4 + i * .12)); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#e8d08a'; ctx.beginPath(); ctx.ellipse(0, 0, 100, 50, 0, 0, TAU); ctx.fill(); ctx.fillStyle = GRN; ctx.beginPath(); ctx.ellipse(0, -10, 60, 30, 0, 0, TAU); ctx.fill(); ctx.restore(); const x2 = seg(t, 39.6 + i * .1, 39.9 + i * .1); if (x2 > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x - 90, y - 90); ctx.lineTo(x - 90 + 180 * x2, y - 90 + 180 * x2); ctx.moveTo(x + 90, y - 90); ctx.lineTo(x + 90 - 180 * x2, y - 90 + 180 * x2); ctx.stroke(); } }
    if (late) { const a = eback(seg(t, 41.4, 41.8)), b = eback(seg(t, 42.4, 42.8)); if (a > 0) { ctx.save(); ctx.translate(310, 1150); ctx.scale(a, a); roo(0, 0, 620, t); ctx.restore(); } if (b > 0) { ctx.save(); ctx.translate(790, 1150); ctx.scale(b, b); lemur(0, 0, 600, t); ctx.restore(); }
      const c = seg(t, 42.7, 43.0); if (c > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 24; for (const x of [310, 790]) { ctx.beginPath(); ctx.moveTo(x - 200, 900); ctx.lineTo(x - 200 + 400 * c, 900 + 400 * c); ctx.moveTo(x + 200, 900); ctx.lineTo(x + 200 - 400 * c, 900 + 400 * c); ctx.stroke(); } } }
  });
  if (!late) { kinetic(['EVOLUTION', 'REWRITTEN'], W / 2, 220, 130, t, 36.1, { hl: { REWRITTEN: SAND } }); if (t > 38.58) pill('ZERO ISLANDS', W / 2, 1420, 60, RED, seg(t, 38.58, 38.8)); }
  else { kinetic(['NO', 'KANGAROOS'], W / 2, 220, 140, t, 41.3, { hl: { KANGAROOS: '#c0703a' } }); if (t > 42.4) kinetic(['NO', 'LEMURS'], W / 2, 400, 140, t, 42.4, { hl: { LEMURS: '#ffb000' } }); }
}

function lerpH(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return 'rgb(' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k)))).join(',') + ')'; }

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 9.6, 19.2, 24.4, 30.7, 35.9, 99], S = [s1, s2, s3, s4, s5, s6];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 4.4 && t < 4.6 ? .7 : 0) + (t > 31.04 && t < 31.25 ? .7 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
