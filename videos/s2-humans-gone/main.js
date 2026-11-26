// Seri2 #8 — "What If All Humans Vanished Today?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 46.52;
const SUBY = 1540;
const GRN = '#3ad06a', RED = '#ff3b4e', GOLD = '#ffc83d', SKY = '#5fd3ff', RAD = '#c8ff3a';

function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function vine(x0, y0, len, p, t, seed) { const R = RN(seed); ctx.strokeStyle = '#2f8a3a'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); let x = x0, y = y0; ctx.moveTo(x, y); const n = Math.floor(20 * p);
  for (let i = 0; i < n; i++) { x += Math.sin(i * .8 + seed) * 18; y -= len / 20; ctx.lineTo(x, y); } ctx.stroke(); ctx.fillStyle = '#3ad06a'; const R2 = RN(seed + 1); for (let i = 0; i < n; i += 2) { ctx.beginPath(); ctx.ellipse(x0 + Math.sin(i * .8 + seed) * 18 + (i % 4 ? 16 : -16), y0 - i * len / 20, 16, 9, i % 4 ? .5 : -.5, 0, TAU); ctx.fill(); } }

// ---------- S1 0–3.44: herkes bir anda yok olur ----------
function s1(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5ab0f0'); g.addColorStop(1, '#d8ecff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 3.4)), t, shake: 2 + 10 * seg(t, 1.44, 1.7) * (1 - seg(t, 1.7, 2.2)) }, () => {
    skyline(1200, t, { seed: 41, tall: 650, col: '#5a6a8a' }); ctx.fillStyle = '#5a5a62'; ctx.fillRect(-300, 1200, W + 600, 700); ctx.fillStyle = '#7a7a82'; ctx.fillRect(-300, 1200, W + 600, 50);
    const R = RN(4); for (let i = 0; i < 16; i++) { const x = 40 + i * 66 + R() * 30, y = 1300 + (i % 3) * 60, s = 220 + R() * 60, t0 = 1.2 + R() * .6, v = seg(t, t0, t0 + .35);
      if (v < 1) { ctx.save(); ctx.globalAlpha = 1 - v; ctx.translate(x, y); ctx.scale(1 - v * .5, 1 + v * .3); ctx.fillStyle = ['#2a3a5a', '#5a2a3a', '#2a5a3a', '#5a4a2a'][i % 4]; ctx.beginPath(); ctx.arc(0, -s * .88, s * .11, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .15, -s * .75, s * .3, s * .42, s * .08); ctx.fill(); ctx.fillRect(-s * .12, -s * .35, s * .1, s * .35); ctx.fillRect(s * .02, -s * .35, s * .1, s * .35); ctx.restore(); }
      if (v > 0) shards(x, y - s * .5, seg(t, t0, t0 + 1.3), 12, i, R2 => R2 > .5 ? '#fff' : '#9fd0ff', 8, 180); }
  });
  kinetic(['WHAT', 'IF', 'ALL', 'HUMANS'], W / 2, 210, 140, t, -.3, { gap: .05 });
  kinetic(['VANISHED', 'TODAY?'], W / 2, 370, 150, t, .1, { hl: { 'TODAY?': SKY } });
  flash(t, 1.44, .2, '255,255,255');
}

// ---------- S2 3.44–6.64: Dünya ayak izimizi siler ----------
function s2(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9fd8ff'); g.addColorStop(1, '#6ab84a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const er = eio(seg(t, 4.64, 6.4));
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    ctx.fillStyle = '#5a9a3a'; ctx.fillRect(-300, 600, W + 600, 1400);
    // betondan ayak izi
    ctx.save(); ctx.translate(W / 2, 1000); ctx.fillStyle = '#9aa2b0'; ctx.beginPath(); ctx.ellipse(0, 120, 190, 270, 0, 0, TAU); ctx.fill(); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(-150 + i * 75, -230 + Math.abs(i - 1.5) * 25, 40, 55, 0, 0, TAU); ctx.fill(); }
    // çimen soldan sağa üzerini kaplar
    ctx.beginPath(); ctx.rect(-400, -500, 800 * er, 1100); ctx.clip(); ctx.fillStyle = '#5a9a3a'; ctx.fillRect(-400, -500, 800, 1100); ctx.strokeStyle = '#3a7a2a'; ctx.lineWidth = 6; for (let i = 0; i < 60; i++) { const x = -380 + i * 13, y = -300 + (i * 37) % 700; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y - 30); ctx.stroke(); } ctx.restore();
    for (let i = 0; i < 6; i++) { const k = eback(seg(t, 5.0 + i * .15, 5.5 + i * .15)); if (k > 0) { ctx.fillStyle = ['#ff6a8a', '#ffd23a', '#fff'][i % 3]; ctx.beginPath(); ctx.arc(300 + i * 90, 900 + (i % 2) * 200, 20 * k, 0, TAU); ctx.fill(); } }
  });
  kinetic(['ERASING', 'OUR', 'FOOTPRINT'], W / 2, 260, 130, t, 4.5, { hl: { FOOTPRINT: GRN } });
}

// ---------- S3 6.64–12.34: ışıklar söner, santraller yakıtsız ----------
function s3(t) {
  darkGrad('#05081a', '#010208');
  const out = seg(t, 8.8, 10.4), fu = 1 - eo(seg(t, 10.0, 11.2));
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    const R0 = RN(2); for (let i = 0; i < 100; i++) { ctx.fillStyle = `rgba(255,255,255,${.3 + R0() * .5})`; ctx.beginPath(); ctx.arc(R0() * W, R0() * 700, R0() * 2, 0, TAU); ctx.fill(); }
    // gece şehri: pencereler tek tek söner
    const R = RN(8); for (let b = 0; b < 9; b++) { const x = b * 125, w = 110, h = 400 + R() * 600; ctx.fillStyle = '#0c1020'; ctx.fillRect(x, 1350 - h, w, h);
      for (let y = 1350 - h + 20; y < 1330; y += 44) for (let xx = x + 12; xx < x + w - 20; xx += 30) { const th = R(); if (th > .35) { const on = th > out * 1.3 - .05 + Math.sin(t * 40 + xx) * .02 * out; ctx.fillStyle = on ? 'rgba(255,220,120,.9)' : 'rgba(40,40,60,.6)'; ctx.fillRect(xx, y, 16, 22); } } }
    ctx.fillStyle = '#05060c'; ctx.fillRect(-300, 1350, W + 600, 700);
  });
  // yakıt göstergesi
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.roundRect(240, 380, 600, 160, 40); ctx.fill(); ctx.restore(); txt('FUEL', 330, 460, 54, '#fff', { align: 'center', font: 'Anton', weight: 400 });
  ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(420, 430, 380, 60); ctx.fillStyle = fu < .25 ? RED : GOLD; ctx.fillRect(420, 430, 380 * fu, 60);
  kinetic(['WITHIN', 'HOURS'], W / 2, 230, 150, t, 6.64);
  if (t > 9.1) stampText('LIGHTS OUT', W / 2, 1440, 120, GOLD, seg(t, 9.1, 9.35));
}

// ---------- S4 12.34–20.46: metro tünelleri sular altında ----------
function s4(t) {
  darkGrad('#1a1a1e', '#050506');
  const fl = eio(seg(t, 14.0, 19.6));
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    // yüzey sokak
    ctx.fillStyle = '#3a3a42'; ctx.fillRect(-300, 520, W + 600, 60); skyline(520, t, { seed: 9, tall: 300, col: '#2a2a34' });
    // tünel kesiti
    ctx.fillStyle = '#4a4038'; ctx.fillRect(-300, 580, W + 600, 1400); ctx.fillStyle = '#2a2420'; ctx.beginPath(); ctx.roundRect(80, 760, 920, 560, [280, 280, 20, 20]); ctx.fill();
    ctx.fillStyle = '#8a8a92'; ctx.fillRect(80, 1300, 920, 20);
    // metro treni
    ctx.fillStyle = '#c9d2de'; ctx.beginPath(); ctx.roundRect(150, 1030, 780, 260, 30); ctx.fill(); ctx.fillStyle = '#3da5ff'; for (let i = 0; i < 6; i++) ctx.fillRect(190 + i * 120, 1070, 90, 90); ctx.fillStyle = RED; ctx.fillRect(150, 1200, 780, 20);
    // su yükselir
    ctx.save(); ctx.beginPath(); ctx.roundRect(80, 760, 920, 560, [280, 280, 20, 20]); ctx.clip(); const wy = 1320 - 560 * fl; ctx.fillStyle = 'rgba(40,120,200,.75)'; ctx.beginPath(); ctx.moveTo(80, 1330); for (let x = 80; x <= 1000; x += 20) ctx.lineTo(x, wy + Math.sin(x * .03 + t * 4) * 10); ctx.lineTo(1000, 1330); ctx.fill(); ctx.restore();
    // pompa (devre dışı)
    ctx.fillStyle = '#5a6272'; ctx.fillRect(900, 640, 120, 100); stampX(960, 690, 70, seg(t, 18.86, 19.2));
  });
  pill('NEW YORK', 300, 400, 56, GOLD, seg(t, 16.3, 16.55)); pill('LONDON', 780, 400, 56, RED, seg(t, 16.94, 17.2));
  kinetic(['3', 'DAYS'], W / 2, 230, 170, t, 12.4, { hl: { '3': SKY } });
  if (t > 17.58) stampText('FLOODED', W / 2, 1440, 140, SKY, seg(t, 17.58, 17.85));
}

// ---------- S5 20.46–28.68: nükleer santrallerde erime ----------
function trefoil(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#ffd23a'; ctx.beginPath(); ctx.arc(0, 0, s, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; for (let i = 0; i < 3; i++) { const a = i * TAU / 3 - Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(a - .5) * s * .22, Math.sin(a - .5) * s * .22); ctx.arc(0, 0, s * .85, a - .5, a + .5); ctx.arc(0, 0, s * .22, a + .5, a - .5, true); ctx.fill(); } ctx.beginPath(); ctx.arc(0, 0, s * .15, 0, TAU); ctx.fill(); ctx.restore(); }
function s5(t) {
  const glob = t > 26.0, md = seg(t, 25.0, 26.4);
  if (!glob) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#6a8ab0', '#3a1a10', md)); g.addColorStop(1, lerpC('#c0d0e0', '#a04a1a', md)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    cam({ zoom: 1.04, t, shake: 2 + 18 * md }, () => {
      ctx.fillStyle = '#4a4a42'; ctx.fillRect(-300, 1300, W + 600, 700);
      for (const [x, s] of [[330, 1], [750, .85]]) { ctx.fillStyle = '#c9c4b8'; ctx.beginPath(); ctx.moveTo(x - 200 * s, 1300); ctx.quadraticCurveTo(x - 110 * s, 1000, x - 150 * s, 700 + (1 - s) * 200); ctx.lineTo(x + 150 * s, 700 + (1 - s) * 200); ctx.quadraticCurveTo(x + 110 * s, 1000, x + 200 * s, 1300); ctx.fill();
        // buhar → buharlaşma
        const ev = seg(t, 23.9, 25.0); for (let i = 0; i < 8; i++) { const q = ((t * .5 + i / 8) % 1); ctx.fillStyle = `rgba(255,255,255,${.6 * (1 - q) * (1 - ev * .8)})`; ctx.beginPath(); ctx.arc(x + Math.sin(i + t) * 40, 680 + (1 - s) * 200 - q * 500, 60 + q * 80, 0, TAU); ctx.fill(); } }
      // soğutma suyu göstergesi
      const wl = 1 - eio(seg(t, 22.0, 24.6)); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.roundRect(900, 500, 120, 500, 30); ctx.fill(); ctx.fillStyle = wl < .25 ? RED : SKY; ctx.fillRect(915, 985 - 470 * wl, 90, 470 * wl);
      if (md > 0) { const gl = ctx.createRadialGradient(540, 1200, 50, 540, 1200, 700); gl.addColorStop(0, `rgba(200,255,60,${.7 * md})`); gl.addColorStop(1, 'rgba(255,80,20,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 400, W, 1500); trefoil(540, 1000, 160 * eback(md)); } });
    kinetic(['COOLING', 'WATER'], W / 2, 230, 150, t, 21.8, { hl: { WATER: SKY } }); if (t > 23.9) bigText('EVAPORATES', W / 2, 380, 110, '#fff', seg(t, 23.9, 24.15)); return; }
  space(t, 7, { top: '#1a0606', bot: '#0a0202' });
  cam({ zoom: 1.03, t, shake: 4 }, () => { earth(W / 2, 900, 420, t, { rot: t * .5, dark: .7, pings: (r, rot) => { const R = RN(5); for (let i = 0; i < 20; i++) { const a = R() * TAU, la = (R() - .5) * 1.8, l = a + rot, z = Math.cos(la) * Math.cos(l); if (z < .1) continue; const px = r * Math.cos(la) * Math.sin(l), py = -r * Math.sin(la), p = (t * 1.3 + R()) % 1;
      ctx.strokeStyle = `rgba(200,255,60,${1 - p})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(px, py, 10 + p * 60, 0, TAU); ctx.stroke(); ctx.fillStyle = RAD; ctx.beginPath(); ctx.arc(px, py, 10, 0, TAU); ctx.fill(); } } }); });
  kinetic(['MASSIVE', 'MELTDOWNS'], W / 2, 230, 140, t, 26.0, { hl: { MELTDOWNS: RAD } });
  if (t > 26.96) bigText('ACROSS THE GLOBE', W / 2, 1440, 110, '#fff', seg(t, 26.96, 27.2));
}

// ---------- S6 28.68–36.48: 25 yıl: sarmaşık ve ağaçlar şehri yutar ----------
function s6(t) {
  const gr = eio(seg(t, 29.4, 35.2));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#7a8aa0', '#8ad0a0', gr)); g.addColorStop(1, lerpC('#c0c8d0', '#d8f0c8', gr)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.06 - .04 * gr, t, shake: 1 }, () => {
    const R = RN(6); const blds = []; for (let i = 0; i < 6; i++) { const x = i * 185, w = 160, h = 500 + R() * 400; blds.push([x, w, h]); ctx.fillStyle = lerpC('#6a6a72', '#5a6a5a', gr); ctx.fillRect(x, 1250 - h, w, h); ctx.fillStyle = 'rgba(30,40,50,.6)'; for (let y = 1250 - h + 30; y < 1230; y += 60) for (let xx = x + 20; xx < x + w - 30; xx += 45) ctx.fillRect(xx, y, 26, 34); }
    blds.forEach(([x, w, h], i) => { vine(x + 20, 1250, h * .9, clamp(gr * 1.3 - i * .05), t, i * 3); vine(x + w - 25, 1250, h * .7, clamp(gr * 1.3 - .1 - i * .05), t, i * 3 + 1); });
    // asfalt çatlar, ağaçlar büyür
    ctx.fillStyle = lerpC('#4a4a52', '#4a6a3a', gr); ctx.fillRect(-300, 1250, W + 600, 700);
    for (let i = 0; i < 5; i++) { const k = clamp(gr * 1.6 - i * .15), x = 120 + i * 210; if (k <= 0) continue; ctx.fillStyle = '#6a4224'; ctx.fillRect(x - 14, 1260 - 360 * k, 28, 360 * k); ctx.fillStyle = '#2f8a3a'; ctx.beginPath(); ctx.arc(x, 1260 - 360 * k, 120 * k, 0, TAU); ctx.arc(x - 70 * k, 1260 - 300 * k, 90 * k, 0, TAU); ctx.arc(x + 70 * k, 1260 - 300 * k, 90 * k, 0, TAU); ctx.fill(); }
  });
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.roundRect(300, 300, 480, 170, 40); ctx.fill(); ctx.restore();
  txt('YEAR ' + Math.round(25 * eo(seg(t, 28.86, 29.6))), W / 2, 385, 110, '#fff', { align: 'center', font: 'Anton', weight: 400 });
  if (t > 34.74) bigText('THRIVING FORESTS', W / 2, 1440, 110, '#1a4a2a', seg(t, 34.74, 35.0), { glow: '#fff' });
}

// ---------- S7 36.48–46.52: 10.000 yıl: yalnızca dev taş yapılar kalır ----------
function pyramid(x, y, s) { ctx.fillStyle = '#d9a35a'; ctx.beginPath(); ctx.moveTo(x - s / 2, y); ctx.lineTo(x, y - s * .62); ctx.lineTo(x, y); ctx.fill(); ctx.fillStyle = '#a8763a'; ctx.beginPath(); ctx.moveTo(x + s / 2, y); ctx.lineTo(x, y - s * .62); ctx.lineTo(x, y); ctx.fill(); }
function rushmore(x, y, s) { ctx.fillStyle = '#8a8a82'; ctx.beginPath(); ctx.moveTo(x - s * .6, y); ctx.lineTo(x - s * .45, y - s * .55); ctx.lineTo(x - s * .1, y - s * .7); ctx.lineTo(x + s * .3, y - s * .62); ctx.lineTo(x + s * .6, y - s * .3); ctx.lineTo(x + s * .65, y); ctx.fill();
  for (let i = 0; i < 4; i++) { const hx = x - s * .36 + i * s * .24, hy = y - s * .42; ctx.fillStyle = '#a8a8a0'; ctx.beginPath(); ctx.ellipse(hx, hy, s * .085, s * .12, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#6a6a62'; ctx.fillRect(hx - s * .04, hy - s * .02, s * .025, s * .012); ctx.fillRect(hx + s * .015, hy - s * .02, s * .025, s * .012); ctx.fillRect(hx - s * .008, hy + s * .02, s * .016, s * .04); } }
function s7(t) {
  const cr = seg(t, 39.0, 41.2), late = t > 43.6;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f2b070'); g.addColorStop(1, '#c87a3a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04 - .04 * seg(t, 36.5, 46.5), t, shake: 2 + 10 * Math.sin(cr * Math.PI) }, () => {
    ctx.fillStyle = '#d89a5a'; ctx.beginPath(); ctx.moveTo(-300, H); for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, 1200 + Math.sin(x * .006) * 50); ctx.lineTo(W + 300, H); ctx.fill();
    if (!late) { const R = RN(4); for (let i = 0; i < 7; i++) { const x = 60 + i * 150, h = (400 + R() * 400) * (1 - cr), w = 120; if (h > 5) { ctx.fillStyle = 'rgba(110,100,90,.9)'; ctx.fillRect(x, 1200 - h, w, h); } }
      if (cr > 0) { const R2 = RN(7); for (let i = 0; i < 200; i++) { const x = R2() * W, y0 = 500 + R2() * 700, q = clamp(cr * 1.4 - R2() * .4); ctx.fillStyle = `rgba(110,100,90,${1 - q})`; ctx.fillRect(x, y0 + q * q * 600, 10, 10); } } }
    else { pyramid(330, 1210, 560 * eback(seg(t, 44.6, 45.0))); pyramid(560, 1210, 380 * eback(seg(t, 44.8, 45.2))); rushmore(830, 1210, 440 * eback(seg(t, 45.6, 46.0))); }
  });
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.roundRect(220, 300, 640, 170, 40); ctx.fill(); ctx.restore();
  txt('YEAR ' + Math.round(10000 * eo(seg(t, 36.74, 37.8))).toLocaleString('en-US'), W / 2, 385, 110, '#fff', { align: 'center', font: 'Anton', weight: 400 });
  if (!late && t > 40.8) stampText('CRUMBLED', W / 2, 1440, 130, RED, seg(t, 40.8, 41.05));
  if (late) bigText('ONLY STONE REMAINS', W / 2, 1440, 100, '#fff', seg(t, 43.6, 43.85), { glow: '#8a4a1a' });
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 3.44, 6.64, 12.34, 20.46, 28.68, 36.48, 99], S = [s1, s2, s3, s4, s5, s6, s7];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 1.44 && t < 1.6 ? .6 : 0) + (t > 25.0 && t < 25.3 ? 1 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
