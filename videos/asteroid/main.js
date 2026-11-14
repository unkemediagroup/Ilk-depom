// 13.video — "What If an Asteroid Hit Earth Tomorrow?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 38.03;
const SUBY = 1540;
const FIRE = '#ff7a2e';

function rock(x, y, r, t, o = {}) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * (o.spin ?? .6));
  if (o.trail) { ctx.save(); ctx.rotate(-t * (o.spin ?? .6) + (o.trailA ?? -2.4)); const g = ctx.createLinearGradient(0, 0, r * 6, 0); g.addColorStop(0, 'rgba(255,230,150,.95)'); g.addColorStop(.3, 'rgba(255,120,40,.7)'); g.addColorStop(1, 'rgba(255,60,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -r * 1.1); ctx.lineTo(r * 6, 0); ctx.lineTo(0, r * 1.1); ctx.fill(); ctx.restore(); }
  const R = RN(o.seed || 3); ctx.fillStyle = '#4a3c34'; ctx.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, rr = r * (.82 + R() * .3); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2e2420'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc((R() - .5) * r, (R() - .5) * r, r * (.1 + R() * .12), 0, TAU); ctx.fill(); }
  if (o.hot) { ctx.strokeStyle = `rgba(255,140,40,${o.hot})`; ctx.lineWidth = r * .08; ctx.shadowColor = FIRE; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(0, 0, r * .95, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
  ctx.restore(); }

// ---------- S1 0–3.44: YARIN — dev asteroit gelir ----------
function s1(t) {
  space(t, 13, { drift: 50 });
  const app = ei(seg(t, .3, 3.4));
  cam({ zoom: 1.04 + .1 * app, t, shake: 3 + 14 * app }, () => {
    earth(W / 2, 1700, 1000, t, { rot: t * .1 + 4, light: Math.PI / 2, term: -.4, dark: .7 });
    rock(lerp(860, W / 2 + 40, app), lerp(260, 700, app), lerp(70, 380, app), t, { trail: true, trailA: -2.3, hot: .3 + .7 * app });
  });
  // takvim: YARIN
  const cf = eback(seg(t, 0, .4)); ctx.save(); ctx.translate(230, 300); ctx.scale(cf, cf); ctx.rotate(-.08); ctx.fillStyle = '#fff'; ctx.fillRect(-140, -140, 280, 280); ctx.fillStyle = C.red; ctx.fillRect(-140, -140, 280, 70);
  txt('TOMORROW', 0, -105, 38, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt(t > 2.16 ? '!' : '15', 0, 40, 130, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
  kinetic(['WHAT', 'IF', 'AN', 'ASTEROID'], W / 2, 1180, 140, t, 0, { gap: .06 });
  kinetic(['HIT', 'EARTH', 'TOMORROW?'], W / 2, 1340, 130, t, 1.55, { hl: { 'TOMORROW?': C.red } });
}

// ---------- S2 3.44–5.12: atmosfere giriş + geri sayım ----------
function s2(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a0e2a'); g.addColorStop(1, '#ff9a4a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const p = seg(t, 3.44, 5.12);
  cam({ zoom: 1 + .3 * ei(p), t, shake: 6 + 20 * p }, () => {
    skyline(1500, t, { seed: 3, tall: 400, col: '#1a1020' }); ctx.fillStyle = '#120a14'; ctx.fillRect(-300, 1500, W + 600, 600);
    // plazma kılıfı içinde asteroit
    const x = lerp(900, W / 2, p), y = lerp(200, 900, ei(p)), r = lerp(90, 260, p);
    ctx.save(); ctx.translate(x, y); const pg = ctx.createRadialGradient(0, 0, r * .5, 0, 0, r * 2); pg.addColorStop(0, 'rgba(255,240,200,.9)'); pg.addColorStop(1, 'rgba(255,100,30,0)'); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, r * 2, 0, TAU); ctx.fill(); ctx.restore();
    rock(x, y, r, t, { trail: true, trailA: -2.2, hot: 1 });
  });
  const n = 3 - Math.floor(p * 3); if (n > 0) { const k = (p * 3) % 1; ctx.save(); ctx.translate(W / 2, 400); ctx.scale(1.4 - .4 * eo(k), 1.4 - .4 * eo(k)); ctx.globalAlpha = 1 - k * .5; txt(String(n), 0, 0, 300, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: C.red }); ctx.restore(); }
  kinetic(['SECONDS', 'TO', 'IMPACT'], W / 2, 1300, 120, t, 3.5, { hl: { IMPACT: C.red } });
}

// ---------- S3 5.12–8.9: kör edici flaş + şok dalgası ----------
function s3(t) {
  const fl = 1 - seg(t, 5.14, 5.9), sw = seg(t, 6.4, 8.6);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffcf8a'); g.addColorStop(1, '#ff6a2e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, t, shake: 4 + 30 * Math.sin(sw * Math.PI) }, () => {
    // ufukta mantar bulutu
    const k = eo(seg(t, 5.14, 8.0)); ctx.fillStyle = '#6a3a2a'; ctx.fillRect(W / 2 - 60, 1100 - 600 * k, 120, 600 * k); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; ctx.fillStyle = i % 2 ? '#ff8a3a' : '#a8442a'; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * 260 * k, 1100 - 600 * k + Math.sin(a) * 110 * k, 190 * k, 0, TAU); ctx.fill(); }
    // şok dalgası duvarı yaklaşır, binaları yıkar
    const front = lerp(1100, 1700, eio(sw));
    ctx.fillStyle = 'rgba(160,100,70,.85)'; ctx.beginPath(); ctx.ellipse(W / 2, 1150, (front - 1100) * 2.4 + 50, (front - 1100) * .9 + 20, 0, 0, TAU); ctx.fill();
    skyline(1650, t, { seed: 29, tall: 500, col: '#1a1020', fall: bx => sw > 0 ? clamp(sw * 1.6 - Math.abs(bx - W / 2) / 900) : 0 });
    ctx.fillStyle = '#120a14'; ctx.fillRect(-300, 1650, W + 600, 500);
  });
  if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${fl})`; ctx.fillRect(0, 0, W, H); }
  if (t > 5.4 && t < 6.3) bigText('BLINDING FLASH', W / 2, 300, 130, '#111', seg(t, 5.4, 5.6));
  if (t > 6.4) { kinetic(['SHOCKWAVE'], W / 2, 260, 180, t, 6.4, { hl: { SHOCKWAVE: C.red } }); bigText('UNIMAGINABLE FORCE', W / 2, 420, 90, '#fff', seg(t, 7.18, 7.4)); }
}

// ---------- S4 8.9–11.06: bir kıtayı yok eder ----------
function s4(t) {
  space(t, 17, { top: '#120406', bot: '#2a080c' });
  const k = eo(seg(t, 8.9, 10.6));
  cam({ zoom: 1.03 + .06 * k, t, shake: 4 + 10 * (1 - k) }, () => {
    earth(W / 2, 860, 430, t, { rot: 1.2, pings: (r) => { const g = ctx.createRadialGradient(-r * .1, -r * .15, 0, -r * .1, -r * .15, r * .8 * k); g.addColorStop(0, '#fff3c0'); g.addColorStop(.3, '#ff7a2e'); g.addColorStop(.7, 'rgba(120,20,10,.9)'); g.addColorStop(1, 'rgba(60,10,5,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(-r * .1, -r * .15, r * .8 * k, 0, TAU); ctx.fill(); ctx.strokeStyle = `rgba(255,200,120,${1 - k})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(-r * .1, -r * .15, r * 1.1 * k, 0, TAU); ctx.stroke(); } });
  });
  kinetic(['OBLITERATE'], W / 2, 220, 170, t, 8.9, { hl: { OBLITERATE: C.red } });
  if (t > 10.2) stampText('ENTIRE CONTINENT', W / 2, 1420, 100, '#fff', seg(t, 10.2, 10.45));
}

// ---------- S5 11.06–15.16: trilyonlarca ton yanan enkaz üst atmosfere ----------
function s5(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#050512'); g.addColorStop(.6, '#2a1a3a'); g.addColorStop(1, '#ff6a2e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.02, t, shake: 4 }, () => {
    // atmosfer katmanları
    [['STRATOSPHERE', 900], ['MESOSPHERE', 600], ['UPPER ATMOSPHERE', 300]].forEach(([l, y], i) => { ctx.strokeStyle = 'rgba(140,200,255,.35)'; ctx.setLineDash([20, 14]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); ctx.setLineDash([]); txt(l, 40, y - 30, 34, i === 2 && t > 13.7 ? C.gold : 'rgba(200,220,255,.7)', { stroke: 0 }); });
    // krater + fırlatılan yanan kayalar (parabolik)
    ctx.fillStyle = '#2a1a14'; ctx.fillRect(-300, 1350, W + 600, 700); ctx.fillStyle = '#ff7a2e'; ctx.beginPath(); ctx.ellipse(W / 2, 1350, 260, 60, 0, 0, Math.PI); ctx.fill();
    const R = RN(6); for (let i = 0; i < 60; i++) { const t0 = 11.1 + R() * 2.5, q = seg(t, t0, t0 + 2.4); if (q <= 0 || q >= 1) continue; const vx = (R() - .5) * 900, vy = 1600 + R() * 900;
      const x = W / 2 + vx * q, y = 1350 - vy * q + 1200 * q * q; ctx.fillStyle = `rgba(255,${120 + R() * 100},40,1)`; ctx.shadowColor = FIRE; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(x, y, 8 + R() * 18, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,140,60,.4)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - vx * .05, y + (vy - 2400 * q) * .05); ctx.stroke(); }
  });
  const v = eo(seg(t, 11.3, 12.4)); ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.roundRect(150, 1050, 780, 230, 40); ctx.fill(); ctx.restore();
  txt(Math.round(5 * v) + ',000,000,000,000', W / 2, 1140, fit('5,000,000,000,000', 100, 720, 'Anton', 400), C.gold, { align: 'center', font: 'Anton', weight: 400, glow: FIRE }); txt('TONS OF BURNING DEBRIS', W / 2, 1230, 40, '#fff', { align: 'center', stroke: 6 });
}

// ---------- S6 15.16–18.78: küresel ateş fırtınası güneşi örter ----------
function s6(t) {
  const blk = seg(t, 17.3, 18.6);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#ff8a3a', '#1a0e0a', blk)); g.addColorStop(1, lerpC('#a8221a', '#0a0404', blk)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, t, shake: 5 }, () => {
    // güneş + üzerine kayan duman
    ctx.fillStyle = `rgba(255,240,200,${1 - blk})`; ctx.beginPath(); ctx.arc(W / 2, 360, 140, 0, TAU); ctx.fill();
    for (let i = 0; i < 14; i++) { const x = ((i * 160 + t * 120) % 1600) - 300, y = 200 + (i % 4) * 90 + 260 * (1 - blk) * -1 + 260; ctx.fillStyle = `rgba(40,30,30,${.4 + .55 * blk})`; ctx.beginPath(); ctx.arc(x, y, 180 + (i % 3) * 40, 0, TAU); ctx.fill(); }
    // yanan orman
    for (let i = 0; i < 12; i++) { const x = i * 95 + 20; ctx.fillStyle = '#1a0a08'; ctx.beginPath(); ctx.moveTo(x, 1000); ctx.lineTo(x - 60, 1350); ctx.lineTo(x + 60, 1350); ctx.fill();
      const hh = 220 + 120 * Math.sin(t * 9 + i * 1.3); const fg = ctx.createLinearGradient(0, 1350 - hh - 150, 0, 1350); fg.addColorStop(0, 'rgba(255,230,120,0)'); fg.addColorStop(.5, 'rgba(255,130,40,.9)'); fg.addColorStop(1, '#c0201a'); ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(x - 80, 1350); ctx.quadraticCurveTo(x + Math.sin(t * 7 + i) * 30, 1350 - hh - 150, x + 80, 1350); ctx.fill(); }
    ctx.fillStyle = '#0a0404'; ctx.fillRect(-300, 1350, W + 600, 700);
  });
  kinetic(['GLOBAL', 'FIRESTORM'], W / 2, 700, 140, t, 15.5, { hl: { FIRESTORM: FIRE } });
  if (t > 17.44) bigText('SUN BLOCKED', W / 2, 860, 120, '#fff', seg(t, 17.44, 17.7));
}
function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }

// ---------- S7 18.78–22.72: yıllarca donan zehirli karanlık ----------
function s7(t) {
  ctx.fillStyle = '#05080a'; ctx.fillRect(0, 0, W, H);
  const R = RN(4); for (let i = 0; i < 12; i++) { const x = ((R() * W + t * 40 * (R() + .3)) % (W + 600)) - 300, y = 300 + R() * 1100; const g = ctx.createRadialGradient(x, y, 0, x, y, 400); g.addColorStop(0, 'rgba(110,160,60,.25)'); g.addColorStop(1, 'rgba(110,160,60,0)'); ctx.fillStyle = g; ctx.fillRect(x - 400, y - 400, 800, 800); }
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    skyline(1350, t, { seed: 44, tall: 400, col: '#0a0e10' }); ctx.fillStyle = '#7a8894'; ctx.fillRect(-300, 1350, W + 600, 700);
    for (let i = 0; i < 120; i++) { const x = (R() * W + Math.sin(t + i) * 30), y = (R() * H + t * (80 + R() * 80)) % H; ctx.fillStyle = 'rgba(230,240,245,.7)'; ctx.beginPath(); ctx.arc(x, y, 2 + R() * 4, 0, TAU); ctx.fill(); }
  });
  const yr = 1 + Math.floor(seg(t, 19.84, 22.6) * 5); txt('YEAR ' + yr, W / 2, 260, 170, '#cfe9ff', { align: 'center', font: 'Anton', weight: 400, glow: '#3da5ff' });
  if (t > 20.5) pill('FREEZING', 330, 460, 70, '#9fe0ff', seg(t, 20.5, 20.8)); if (t > 21.34) pill('TOXIC', 760, 460, 70, '#a8e04a', seg(t, 21.34, 21.6));
  bigText('DARKNESS', W / 2, 1200, 160, '#fff', seg(t, 21.68, 21.95), { glow: '#000' });
}

// ---------- S8 22.72–25.04: dünya çapında tarım yok olur ----------
function s8(t) {
  const die = seg(t, 22.9, 24.2);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lerpC('#7ac0ff', '#1a1c20', die)); g.addColorStop(1, lerpC('#ffe8a8', '#2a2a2a', die)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    for (let r = 0; r < 6; r++) for (let i = 0; i < 18; i++) { const x = i * 64 + (r % 2) * 32, y = 900 + r * 110, h = 260 + r * 30, bend = die * (.9 + .3 * Math.sin(i + r)); ctx.strokeStyle = lerpC('#e8c050', '#5a5a52', die); ctx.lineWidth = 6 + r;
      ctx.beginPath(); ctx.moveTo(x, y + h); ctx.quadraticCurveTo(x, y + h * .4, x + Math.sin(bend) * h * .6 + Math.sin(t * 2 + i) * 6 * (1 - die), y + h - Math.cos(bend) * h); ctx.stroke();
      ctx.fillStyle = lerpC('#f2d060', '#6a6a60', die); ctx.beginPath(); ctx.ellipse(x + Math.sin(bend) * h * .6, y + h - Math.cos(bend) * h, 10, 24, bend, 0, TAU); ctx.fill(); }
  });
  kinetic(['AGRICULTURE'], W / 2, 260, 160, t, 23.1, { hl: { AGRICULTURE: C.gold } });
  if (t > 23.82) stampText('WIPED OUT', W / 2, 460, 130, C.red, seg(t, 23.82, 24.1));
}

// ---------- S9 25.04–32.72: küçük bir sığınak mı, son bölüm mü? ----------
function s9(t) {
  const book = seg(t, 29.9, 31.6);
  if (book <= 0) {
    ctx.fillStyle = '#1a120c'; ctx.fillRect(0, 0, W, H);
    cam({ zoom: 1.2 - .15 * seg(t, 25, 29.9), t, shake: 2 }, () => {
      ctx.fillStyle = '#0a0a0e'; ctx.fillRect(-300, -300, W + 600, 700); ctx.fillStyle = '#e8eef4'; ctx.fillRect(-300, 380, W + 600, 30);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = ['#3a2a1e', '#2e2218', '#241a12', '#1c140e', '#140e0a'][i]; ctx.fillRect(-300, 410 + i * 180, W + 600, 180); }
      // sığınak
      const bx = W / 2, by = 1100; ctx.fillStyle = '#4a5260'; ctx.beginPath(); ctx.roundRect(bx - 330, by - 200, 660, 360, 40); ctx.fill(); ctx.fillStyle = '#ffd890'; ctx.beginPath(); ctx.roundRect(bx - 300, by - 170, 600, 300, 30); ctx.fill();
      const lg = ctx.createRadialGradient(bx, by - 120, 10, bx, by - 120, 400); lg.addColorStop(0, 'rgba(255,230,160,.6)'); lg.addColorStop(1, 'rgba(255,230,160,0)'); ctx.fillStyle = lg; ctx.fillRect(bx - 400, by - 500, 800, 800);
      ctx.fillStyle = '#ddd'; ctx.fillRect(bx - 20, 410, 40, by - 610);
      for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(bx - 210 + i * 140, by + 130); ctx.fillStyle = '#2a1a10'; human(0, 0, 200 - (i % 2) * 40); ctx.restore(); }
    });
    kinetic(['A', 'SMALL', 'POCKET'], W / 2, 180, 130, t, 25.3, { hl: { POCKET: C.gold } });
    if (t > 27.84) stampText('EXTINCTION EVENT', W / 2, 1420, 100, C.red, seg(t, 28.68, 28.95));
  } else {
    space(t, 50);
    cam({ zoom: 1.03, t, shake: 2 }, () => {
      const cx = W / 2, cy = 860, ang = eio(book) * Math.PI; ctx.fillStyle = '#f0e6d2'; ctx.fillRect(cx, cy - 400, 380, 800); ctx.fillStyle = '#8a7a6a'; for (let i = 0; i < 12; i++) ctx.fillRect(cx + 40, cy - 330 + i * 56, 300, 10);
      txt('THE END', cx + 190, cy + 300, 60, '#2a1a10', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      // kapak soldan sağa kapanır (dünya kapağı sayfaların üstüne)
      const w = -380 * Math.cos(ang), x0 = Math.min(cx, cx + w), cw = Math.abs(w); ctx.fillStyle = '#5a1a14'; ctx.fillRect(x0, cy - 400, cw, 800);
      if (cw > 30) { ctx.save(); ctx.beginPath(); ctx.rect(x0, cy - 400, cw, 800); ctx.clip(); ctx.translate(x0 + cw / 2, cy); ctx.scale(cw / 380, 1); earth(0, 0, 150, t, { rot: t * .3, dark: .6 }); txt('EARTH', 0, -280, 60, C.gold, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
      if (book >= 1) stampText('THE END', cx + 190, cy + 300, 70, C.red, seg(t, 31.6, 31.9));
    });
    kinetic(['THE', 'FINAL', 'CHAPTER?'], W / 2, 220, 140, t, 30.4, { hl: { 'CHAPTER?': C.red } });
  }
}

const THEO = ['Bunkers = survival', 'Nukes could stop it', 'Billionaires to Mars', 'Dinosaurs 2.0', 'Life always finds a way', 'Game over for sure'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 3.44, 5.12, 8.9, 11.06, 15.16, 18.78, 22.72, 25.04, 32.72, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8, s9, null];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i] ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 32.72), 32.72, 34.22, 34.76, THEO, { tint: 'rgba(255,122,46,.2)', dot: '255,170,120' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 6.4 && t < 6.6 ? .8 : 0) + (t > 28.68 && t < 28.85 ? .7 : 0), Math.floor(t * 30));
  subs(t, SUBY);
};
