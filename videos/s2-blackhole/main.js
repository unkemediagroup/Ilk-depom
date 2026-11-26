// Seri2 #13 — "What If a Black Hole Entered Our Solar System?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 37.56;
const SUBY = 1540;
const DISK = '#ffb35a', RED = '#ff3b4e', ICE = '#9fe0ff', PUR = '#9b6bff';

function bh(x, y, r, t, o = {}) { ctx.save(); ctx.translate(x, y);
  // arka disk yarısı
  ctx.save(); ctx.scale(1, .3); for (let i = 0; i < 26; i++) { const rr = r * (1.4 + i * .06), a = t * (2 - i * .04); ctx.strokeStyle = `rgba(255,${150 + i * 3},${60 + i * 4},${.5 - i * .015})`; ctx.lineWidth = r * .07; ctx.beginPath(); ctx.arc(0, 0, rr, Math.PI + a % 1 * 0, TAU); ctx.stroke(); } ctx.restore();
  // fotonsal halka (lens)
  const g = ctx.createRadialGradient(0, 0, r * .9, 0, 0, r * 1.5); g.addColorStop(0, 'rgba(255,220,160,.9)'); g.addColorStop(.3, 'rgba(255,140,60,.35)'); g.addColorStop(1, 'rgba(255,100,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 1.5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  // ön disk yarısı
  ctx.save(); ctx.scale(1, .3); for (let i = 0; i < 26; i++) { const rr = r * (1.4 + i * .06); ctx.strokeStyle = `rgba(255,${170 + i * 3},${80 + i * 4},${.7 - i * .02})`; ctx.lineWidth = r * .07; ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI); ctx.stroke(); } ctx.restore();
  // dönen sıcak noktalar
  for (let i = 0; i < 12; i++) { const a = t * 3 + i * .52, rr = r * (1.5 + (i % 4) * .2); ctx.fillStyle = 'rgba(255,240,200,.9)'; ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr * .3, r * .03, 0, TAU); ctx.fill(); }
  ctx.restore(); }
function planet(x, y, r, c1, c2, ring) { const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  if (ring) { ctx.strokeStyle = 'rgba(230,210,170,.8)'; ctx.lineWidth = r * .15; ctx.beginPath(); ctx.ellipse(x, y, r * 1.8, r * .45, -.3, 0, TAU); ctx.stroke(); } }
function sunS(x, y, r) { const g = ctx.createRadialGradient(x, y, r * .2, x, y, r * 2.2); g.addColorStop(0, '#fff6c0'); g.addColorStop(.35, '#ffc83d'); g.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, TAU); ctx.fill(); }

// ---------- S1 0–6.26: kara delik yaklaşır, güneş sistemi parçalanır ----------
function s1(t) {
  space(t, 3, { drift: 20, top: '#020208', bot: '#0a0614' });
  const sys = t > 3.6;
  cam({ zoom: sys ? 1.0 : 1.3 - .25 * eo(seg(t, 0, 3.5)), t, shake: 3 + 10 * seg(t, 3.9, 5.0) }, () => {
    if (!sys) bh(W / 2, 900, 220, t);
    else { // güneş sistemi yörüngeleri sağdan gelen kara deliğe doğru bükülür
      const k = eio(seg(t, 3.9, 6.0)), bx = lerp(1300, 900, k), by = 400;
      sunS(420, 1000, 60);
      [[150, '#9fe0ff', 12], [230, '#3d7cff', 18], [330, '#ff7a3a', 14], [470, '#e8b070', 38], [600, '#e8d8a0', 32]].forEach(([r, col, pr], i) => {
        ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 3; ctx.beginPath(); for (let a = 0; a <= TAU + .01; a += .05) { let x = 420 + Math.cos(a) * r, y = 1000 + Math.sin(a) * r * .55; const dx = bx - x, dy = by - y, d = Math.hypot(dx, dy); const pull = k * 140 * r / 600 * Math.exp(-d / 500); x += dx / d * pull; y += dy / d * pull; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        const a = t * (1.2 - i * .18) + i, x = 420 + Math.cos(a) * r, y = 1000 + Math.sin(a) * r * .55; planet(x, y, pr, '#fff', col, i === 4); });
      bh(bx, by, 150, t); }
  });
  kinetic(['WHAT', 'IF', 'A', 'BLACK', 'HOLE'], W / 2, 210, 140, t, -.3, { gap: .05, hl: { BLACK: DISK, HOLE: DISK } });
  kinetic(['ENTERED', 'OUR', 'SOLAR', 'SYSTEM?'], W / 2, 370, 110, t, .15);
  if (sys && t > 4.6) stampText('TORN APART', W / 2, 1440, 130, RED, seg(t, 4.6, 4.9));
}

// ---------- S2 6.26–12.9: buzlu kuyruklu yıldızlar mermi gibi fırlatılır ----------
function comet(x, y, s, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); const g = ctx.createLinearGradient(0, 0, -s * 6, 0); g.addColorStop(0, 'rgba(200,240,255,.95)'); g.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(-s * 6, 0); ctx.lineTo(0, s); ctx.fill(); ctx.fillStyle = '#e8f8ff'; ctx.beginPath(); ctx.arc(0, 0, s, 0, TAU); ctx.fill(); ctx.restore(); }
function s2(t) {
  space(t, 6);
  const fl = seg(t, 7.94, 12.6);
  cam({ zoom: 1.03, t, shake: 3 + 8 * fl }, () => {
    // dış kenar (Oort) halkası
    ctx.strokeStyle = 'rgba(159,224,255,.25)'; ctx.lineWidth = 60; ctx.beginPath(); ctx.arc(W / 2, 1150, 700, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    sunS(W / 2, 1150, 50); planet(W / 2 + 160, 1180, 16, '#fff', '#3d7cff');
    bh(lerp(-200, 250, seg(t, 6.3, 8.0)), 360, 110, t);
    const R = RN(5); for (let i = 0; i < 30; i++) { const t0 = 7.9 + R() * 3.5, q = seg(t, t0, t0 + 1.2); if (q <= 0 || q >= 1) continue; const a0 = Math.PI * (1.1 + R() * .8), sx = W / 2 + Math.cos(a0) * 700, sy = 1150 + Math.sin(a0) * 700;
      const x = lerp(sx, W / 2 + (R() - .5) * 300, eo(q)), y = lerp(sy, 1150 + (R() - .5) * 200, eo(q)); comet(x, y, 12, Math.atan2(1150 - sy, W / 2 - sx)); }
  });
  kinetic(['TRILLIONS', 'OF', 'ICY', 'COMETS'], W / 2, 230, 120, t, 8.1, { hl: { COMETS: ICE } });
  if (t > 11.22) bigText('COSMIC BULLETS', W / 2, 1440, 130, ICE, seg(t, 11.22, 11.5), { glow: '#3da5ff' });
}

// ---------- S3 12.9–19.2: Jüpiter ve Satürn yörüngeden sökülür ----------
function s3(t) {
  space(t, 9);
  const yk = eio(seg(t, 13.7, 16.0)), wob = seg(t, 16.3, 18.6);
  cam({ zoom: 1.02, t, shake: 3 + 10 * Math.sin(yk * Math.PI) }, () => {
    const cx = W / 2, cy = 1000; sunS(cx, cy, 70);
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; for (const r of [240, 460, 560]) { ctx.beginPath(); ctx.ellipse(cx, cy, r, r * .55, 0, 0, TAU); ctx.stroke(); }
    bh(900, 300, 120, t);
    // Jüpiter + Satürn kara deliğe doğru savrulur (iz bırakarak)
    for (const [r, a0, rad, c, ring] of [[460, 2.2, 60, '#d8a060', false], [560, 2.9, 50, '#e8d8a0', true]]) { const a = a0 + t * .3, x0 = cx + Math.cos(a) * r, y0 = cy + Math.sin(a) * r * .55, x = lerp(x0, 880, yk * .8), y = lerp(y0, 320, yk * .8);
      ctx.strokeStyle = 'rgba(255,180,90,.5)'; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x) / 2 - 150, (y0 + y) / 2 + 100, x, y); ctx.stroke(); ctx.setLineDash([]); planet(x, y, rad, '#fff8e0', c, ring); }
    // Dünya yörüngesi titrer
    const ea = t * .9, wr = 240 + Math.sin(t * 9) * 40 * wob; planet(cx + Math.cos(ea) * wr, cy + Math.sin(ea) * wr * .55, 22, '#fff', '#3d7cff');
    ctx.strokeStyle = `rgba(255,59,78,${wob})`; ctx.lineWidth = 5; ctx.beginPath(); for (let a = 0; a <= TAU; a += .05) { const rr = 240 + Math.sin(a * 5 + t * 6) * 40 * wob; a ? ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .55) : ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .55); } ctx.closePath(); ctx.stroke();
  });
  kinetic(['JUPITER', '&', 'SATURN'], W / 2, 220, 140, t, 13.5, { hl: { JUPITER: DISK, SATURN: '#e8d8a0' } });
  if (t > 16.34) bigText("EARTH'S ORBIT UNSTABLE", W / 2, 1440, 96, RED, seg(t, 16.34, 16.6), { glow: RED });
}

// ---------- S4 19.2–26.92: ya fırlatılır ya içine çekilir ----------
function s4(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const e = seg(t, 20.54, 23.8), p = seg(t, 24.36, 26.8);
  // üst yarı: buz gibi yıldızlararası boşluğa fırlatılır
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H / 2 - 8); ctx.clip(); space(t, 11, { top: '#020612', bot: '#061028' });
  cam({ zoom: 1, t, shake: 2 }, () => { const x = lerp(300, 900, eo(e)), y = lerp(560, 300, eo(e)); planet(x, y, 90, '#e8f6ff', lerpC('#3d7cff', '#bfe6ff', e)); if (e > 0) { ctx.strokeStyle = 'rgba(160,220,255,.6)'; ctx.lineWidth = 6; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(200, 620); ctx.lineTo(x - 100, y + 30); ctx.stroke(); ctx.setLineDash([]); }
    ctx.strokeStyle = `rgba(230,250,255,${.8 * e})`; ctx.lineWidth = 3; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 90, y + Math.sin(a) * 90); ctx.lineTo(x + Math.cos(a) * 120, y + Math.sin(a) * 120); ctx.stroke(); } });
  txt('EJECTED', W / 2, 120, 100, ICE, { align: 'center', font: 'Anton', weight: 400, glow: '#3da5ff' }); txt('-270°C', 250, 820, 70, ICE, { align: 'center', font: 'Anton', weight: 400 }); ctx.restore();
  // alt yarı: kara deliğe çekilir
  ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 + 8, W, H); ctx.clip(); space(t, 12, { top: '#0a0408', bot: '#1a0a06' });
  cam({ zoom: 1, t, shake: 2 }, () => { bh(780, 1420, 150, t); const x = lerp(220, 640, ei(p)), y = lerp(1180, 1380, ei(p)); planet(x, y, 70 * (1 - .4 * p), '#fff', '#3d7cff'); });
  txt('PULLED IN', W / 2, 1100, 100, DISK, { align: 'center', font: 'Anton', weight: 400, glow: '#ff6a00' }); ctx.restore();
  ctx.fillStyle = '#fff'; ctx.fillRect(0, H / 2 - 8, W, 16); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.roundRect(W / 2 - 90, H / 2 - 55, 180, 110, 30); ctx.fill(); txt('OR', W / 2, H / 2, 80, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
}
function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }

// ---------- S5 26.92–37.56: gelgit kuvvetleri Dünya'yı söker, parlayan halka, yutulma ----------
function s5(t) {
  space(t, 14, { top: '#020104', bot: '#0a0406' });
  const st = eio(seg(t, 27.3, 30.0)), oc = seg(t, 29.4, 31.0), at = seg(t, 30.56, 32.0), cr = seg(t, 32.96, 34.2), sw = seg(t, 36.32, 37.3);
  cam({ zoom: 1.03 + .2 * sw, t, shake: 4 + 18 * Math.max(cr, sw) }, () => {
    const bx = 780, by = 700; bh(bx, by, 170 * (1 + sw * .3), t);
    // parlayan enkaz halkası
    if (cr > .3) { ctx.save(); ctx.translate(bx, by); ctx.scale(1, .32); const R = RN(3); for (let i = 0; i < 160; i++) { const a = R() * TAU + t * (1.5 + R()), rr = 320 + R() * 160; ctx.fillStyle = `rgba(255,${120 + R() * 120},60,${(cr - .3) * 1.4 * (1 - sw)})`; ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 6 + R() * 10, 0, TAU); ctx.fill(); } ctx.restore(); }
    // gerilen Dünya
    if (sw < 1) { const ex = lerp(280, 560, st), ey = lerp(1150, 900, st); ctx.save(); ctx.translate(ex, ey); ctx.rotate(Math.atan2(by - ey, bx - ex)); ctx.scale(1 + 1.2 * st, 1 - .35 * st); ctx.globalAlpha = 1 - sw; planet(0, 0, 130 * (1 - cr * .5), lerpC('#bfe0ff', '#c87a3a', cr), lerpC('#1a4a9a', '#5a2a10', cr)); ctx.restore();
      // okyanus ve atmosfer şeritleri kara deliğe akar
      const strip = (k, col, w, off) => { if (k <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex, ey + off); ctx.quadraticCurveTo((ex + bx) / 2, ey - 200 + off, lerp(ex, bx - 160, k), lerp(ey, by + 40, k)); ctx.stroke(); };
      strip(oc, 'rgba(61,165,255,.8)', 34, 0); strip(at, 'rgba(200,240,255,.55)', 60, -40);
      if (cr > 0) shards(ex, ey, cr, 50, 4, R => R > .5 ? '#c87a3a' : '#ff8a3a', 18, 500); }
    if (sw > 0) { ctx.fillStyle = `rgba(0,0,0,${sw * .9})`; ctx.fillRect(0, 0, W, H); }
  });
  if (t < 29.3) kinetic(['EXTREME', 'TIDAL', 'FORCES'], W / 2, 230, 130, t, 28.1, { hl: { TIDAL: RED } });
  else if (t < 33.2) { const l = t < 30.56 ? 'OCEANS' : t < 31.46 ? 'ATMOSPHERE' : 'CRUST'; bigText(l, W / 2, 230, 150, l === 'OCEANS' ? '#3da5ff' : l === 'ATMOSPHERE' ? ICE : DISK, 1); }
  else if (t < 36.2) bigText('GLOWING RING', W / 2, 230, 150, DISK, seg(t, 34.22, 34.5), { glow: '#ff6a00' });
  else stampText('SWALLOWED', W / 2, 1440, 140, RED, seg(t, 36.32, 36.6));
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 6.26, 12.9, 19.2, 26.92, 99], S = [s1, s2, s3, s4, s5];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 3.9 && t < 4.1 ? .6 : 0) + (t > 32.96 && t < 33.2 ? .8 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
