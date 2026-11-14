// 7.video — "What If All the Oceans Disappeared?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 36.99;
const SUBY = 1540;
const SEABED = ['#7a5a3a', '#4a3020'];

// ---------- S1 0–4.32: okyanuslar dev boşluğa akar ----------
function voidHole(x, y, r, t) { for (let i = 0; i < 40; i++) { const a = i / 40 * TAU + t * 2.5, rr = r * (1.2 + (i % 4) * .25); ctx.strokeStyle = `rgba(${i % 2 ? '120,90,255' : '60,160,255'},.45)`; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y, rr, rr * .4, -.3, a, a + .7); ctx.stroke(); }
  const g = ctx.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, '#000'); g.addColorStop(.8, '#000'); g.addColorStop(1, 'rgba(120,90,255,.8)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function s1(t) {
  space(t, 4);
  const dr = seg(t, .6, 3.4);
  cam({ zoom: 1.08 - .06 * seg(t, 0, 4), t, shake: 4 + 6 * dr }, () => {
    const ex = 420, ey = 700, er = 330, vx = 860, vy = 330;
    voidHole(vx, vy, 120 + 40 * dr, t);
    earth(ex, ey, er, t, { rot: t * .4, sea0: lerpC('#2f8ee8', SEABED[0], dr), sea1: lerpC('#0a2f6e', SEABED[1], dr) });
    // su akıntısı spirali
    const R = RN(4); for (let i = 0; i < 160; i++) { const q = (R() + t * .7) % 1; if (dr <= 0) break; const a0 = R() * TAU, sx = ex + Math.cos(a0) * er * .8, sy = ey + Math.sin(a0) * er * .8;
      const k = eio(q), ang = k * 5, x = lerp(sx, vx, k) + Math.cos(ang + a0) * 60 * (1 - k), y = lerp(sy, vy, k) + Math.sin(ang + a0) * 60 * (1 - k);
      ctx.fillStyle = `rgba(80,180,255,${.8 * (1 - k) * Math.min(1, dr * 3)})`; ctx.beginPath(); ctx.arc(x, y, 9 * (1 - k * .7), 0, TAU); ctx.fill(); }
  });
  kinetic(['WHAT', 'IF', 'ALL', 'THE', 'OCEANS'], W / 2, 1200, 130, t, 0, { gap: .06 });
  kinetic(['DISAPPEARED?'], W / 2, 1360, 160, t, 1.7, { hl: { 'DISAPPEARED?': '#7f9cff' } });
  if (t > 3.0) pill('INTO A GIANT VOID', W / 2, 220, 66, C.violet, seg(t, 3.0, 3.3));
}
function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }

// ---------- S2 4.32–8.54: tek kalp atışında %96 ----------
function s2(t) {
  bgFinance(t, { tint: 'rgba(61,165,255,.22)', seed: 6, dot: '120,190,255' });
  cam({ zoom: 1.02 + .03 * Math.max(0, Math.sin((t - 4.88) * 12)) * (t > 4.88 && t < 5.2 ? 1 : 0), t }, () => {
    // EKG
    ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.shadowColor = C.red; ctx.shadowBlur = 20; ctx.beginPath(); const p = seg(t, 4.35, 5.6);
    for (let x = 0; x <= W * p; x += 8) { const u = x / W, y = 330 + (u > .45 && u < .55 ? [-0, -150, 120, -40, 0][Math.floor((u - .45) / .02)] || 0 : 0); ctx.lineTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0;
    // su damlası %96 boşalır
    const dk = seg(t, 6.3, 7.9), cx = W / 2, cy = 960, s = 360;
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy - s * 1.1); ctx.bezierCurveTo(cx + s * .9, cy - s * .1, cx + s * .8, cy + s * .8, cx, cy + s * .8); ctx.bezierCurveTo(cx - s * .8, cy + s * .8, cx - s * .9, cy - s * .1, cx, cy - s * 1.1); ctx.closePath();
    ctx.strokeStyle = '#9fe0ff'; ctx.lineWidth = 12; ctx.stroke(); ctx.clip();
    const lvl = lerp(cy - s * 1.1, cy + s * .8 - s * 1.9 * .04, eio(dk)); ctx.fillStyle = '#2f8ee8'; ctx.beginPath(); ctx.moveTo(cx - s, cy + s); for (let x = cx - s; x <= cx + s; x += 20) ctx.lineTo(x, lvl + Math.sin(x * .03 + t * 6) * 14); ctx.lineTo(cx + s, cy + s); ctx.fill(); ctx.restore();
  });
  counter(0, 96, W / 2, 1440, 190, seg(t, 6.34, 7.2), { fmt: v => '-' + Math.round(v) + '%', col: '#5fd3ff' });
  kinetic(['SINGLE', 'HEARTBEAT'], W / 2, 520, 110, t, 4.6, { hl: { HEARTBEAT: C.red } });
}

// ---------- S3 8.54–11.6: açılan sessiz uçurumlar (kesit) ----------
function seabedProfile(x) { return 700 + 250 * Math.sin(x * .004 + 1) + (x > 380 && x < 700 ? 700 * Math.sin((x - 380) / 320 * Math.PI) : 0); }
function s3(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#f2c58a'); sky.addColorStop(1, '#c98a4a'); ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, H + 600);
  const drop = eio(seg(t, 8.6, 10.2));
  cam({ zoom: 1.12 - .1 * drop, y: -60 * drop, t, shake: 3 }, () => {
    // su seviyesi alçalır
    const wl = lerp(300, 1800, drop); ctx.fillStyle = 'rgba(47,142,232,.85)'; ctx.fillRect(-300, wl, W + 600, 2000);
    ctx.fillStyle = SEABED[0]; ctx.beginPath(); ctx.moveTo(-300, H + 300); for (let x = -300; x <= W + 300; x += 15) ctx.lineTo(x, seabedProfile(x)); ctx.lineTo(W + 300, H + 300); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.moveTo(380, seabedProfile(380)); for (let x = 380; x <= 700; x += 10) ctx.lineTo(x, seabedProfile(x)); ctx.fill();
    // derinlik ölçer
    const dp = seg(t, 9.6, 10.6); if (dp > 0) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(540, 600); ctx.lineTo(540, 600 + 780 * dp); ctx.stroke(); ctx.setLineDash([]);
      txt(Math.round(11000 * eo(dp)).toLocaleString('en-US') + ' M', 760, 1000, 90, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#000' }); }
  });
  kinetic(['GAPING'], W / 2, 200, 170, t, 8.95);
  if (t > 10.2) bigText('ABYSSES', W / 2, 360, 150, '#fff', seg(t, 10.2, 10.45), { glow: '#000' });
}

// ---------- S4 11.6–15.68: kuru deniz tabanında mahsur gemiler ----------
function ship(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#2a3344'; ctx.beginPath(); ctx.moveTo(-s * .5, -s * .12); ctx.lineTo(s * .55, -s * .12); ctx.lineTo(s * .42, s * .08); ctx.lineTo(-s * .44, s * .08); ctx.fill();
  ctx.fillStyle = '#c0392b'; ctx.fillRect(-s * .44, s * .02, s * .86, s * .06); ctx.fillStyle = '#e8eef6'; ctx.fillRect(-s * .38, -s * .26, s * .24, s * .14); ctx.fillRect(s * .1, -s * .3, s * .3, s * .18);
  const cols = ['#ff3b4e', '#3da5ff', '#ffc83d']; for (let i = 0; i < 6; i++) { ctx.fillStyle = cols[i % 3]; ctx.fillRect(-s * .12 + (i % 3) * s * .07, -s * .24 + Math.floor(i / 3) * s * .06, s * .065, s * .055); } ctx.restore(); }
function s4(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#e8b070'); sky.addColorStop(1, '#a8683a'); ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, H + 600);
  const lt = t - 11.6;
  cam({ zoom: 1.0 + .06 * seg(t, 11.6, 15.6), x: -lt * 15, t, shake: 2 }, () => {
    // kanyon duvarları
    ctx.fillStyle = '#8a5a34'; ctx.beginPath(); ctx.moveTo(-300, 400); ctx.lineTo(200, 500); ctx.lineTo(260, 1300); ctx.lineTo(-300, 1400); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W + 300, 350); ctx.lineTo(880, 520); ctx.lineTo(820, 1280); ctx.lineTo(W + 300, 1400); ctx.fill();
    ctx.fillStyle = '#6a4224'; for (let i = 0; i < 8; i++) { ctx.fillRect(-300, 520 + i * 100, 480 + i * 8, 10); ctx.fillRect(860 - i * 6, 560 + i * 90, 600, 10); }
    // kurumuş taban + çatlaklar
    ctx.fillStyle = '#b07a48'; ctx.fillRect(-300, 1250, W + 600, 800); const R = RN(7); ctx.strokeStyle = '#6a4224'; ctx.lineWidth = 4;
    for (let i = 0; i < 24; i++) { let x = R() * W, y = 1270 + R() * 200; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (R() - .5) * 120; y += R() * 40; ctx.lineTo(x, y); } ctx.stroke(); }
    // gemi düşer ve yan yatar
    const fall = eo(seg(t, 11.7, 12.6)), tilt = .22 * eback(seg(t, 12.4, 13.0));
    ship(560, lerp(700, 1220, fall), 700, tilt);
    if (t > 12.5) shards(560, 1260, seg(t, 12.5, 13.4), 30, 3, '#c49060', 14, 500);
    // yankı halkaları
    for (let i = 0; i < 3; i++) { const q = seg(t, 13.76 + i * .3, 15.0 + i * .3); if (q <= 0 || q >= 1) continue; ctx.strokeStyle = `rgba(255,240,220,${.8 * (1 - q)})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(540, 900, 200 + 700 * q, 80 + 280 * q, 0, 0, TAU); ctx.stroke(); }
  });
  kinetic(['TRAPPED'], W / 2, 220, 170, t, 11.68, { hl: { TRAPPED: C.red } });
  if (t > 13.76) bigText('ECHOING CANYONS', W / 2, 1420, 110, '#fff', seg(t, 13.76, 14.0));
}

// ---------- S5 15.68–21.24: iklim düzenleyici yok → ölümcül sıcaklık ----------
function s5(t) {
  const hot = seg(t, 18.6, 20.5);
  const bg = ctx.createRadialGradient(W / 2, 800, 0, W / 2, 800, 1300); bg.addColorStop(0, lerpC('#14203a', '#ff7a2e', hot)); bg.addColorStop(1, lerpC('#05070c', '#3a0806', hot)); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, t, shake: 3 + 8 * hot }, () => {
    earth(W / 2 - 150, 800, 330, t, { rot: t * .5, sea0: SEABED[0], sea1: SEABED[1], land: lerpC('#8a6a3c', '#c2401f', hot) });
    // termometre fırlar
    const tx = 900, top = 360, bot = 1180; ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.roundRect(tx - 45, top, 90, bot - top, 45); ctx.fill(); ctx.beginPath(); ctx.arc(tx, bot + 30, 90, 0, TAU); ctx.fill();
    const lvl = lerp(bot - 60, top + 30, eo(hot)); ctx.fillStyle = '#ff3b2e'; ctx.beginPath(); ctx.arc(tx, bot + 30, 66, 0, TAU); ctx.fill(); ctx.fillRect(tx - 24, lvl, 48, bot + 30 - lvl);
    // ısı dalgaları
    for (let i = 0; i < 8; i++) { ctx.strokeStyle = `rgba(255,200,120,${.35 * hot})`; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 0; x < W; x += 20) ctx.lineTo(x, 1300 + i * 30 + Math.sin(x * .03 + t * 8 + i) * 14); ctx.stroke(); }
  });
  if (t < 18.5) { kinetic(['NO', 'CLIMATE'], W / 2, 210, 150, t, 16.0); kinetic(['REGULATOR'], W / 2, 360, 130, t, 16.7, { hl: { REGULATOR: '#5fd3ff' } }); }
  else { txt('+' + Math.round(70 * eo(hot)) + '°C', W / 2, 260, 190, '#ffcf6b', { align: 'center', font: 'Anton', weight: 400, glow: '#ff3b00' }); }
  if (t > 19.84) bigText('LETHAL EXTREMES', W / 2, 1420, 120, C.red, seg(t, 19.84, 20.1), { glow: C.red });
}

// ---------- S6 21.24–23.02: kalan göller buharlaşır ----------
function s6(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffcf8a'); g.addColorStop(1, '#e07a3a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const ev = eio(seg(t, 21.3, 22.9));
  cam({ zoom: 1.04 + .06 * ev, t, shake: 3 }, () => {
    const sun = ctx.createRadialGradient(W / 2, 250, 30, W / 2, 250, 400); sun.addColorStop(0, '#fff8d0'); sun.addColorStop(.3, '#ffd36b'); sun.addColorStop(1, 'rgba(255,200,80,0)'); ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(W / 2, 250, 400, 0, TAU); ctx.fill();
    ctx.fillStyle = '#b07a48'; ctx.fillRect(-300, 900, W + 600, 1100);
    ctx.fillStyle = '#8a5a34'; ctx.beginPath(); ctx.ellipse(W / 2, 1100, 460, 200, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#3da5ff'; ctx.beginPath(); ctx.ellipse(W / 2, 1100, 440 * (1 - ev), 185 * (1 - ev), 0, 0, TAU); ctx.fill();
    // buhar
    const R = RN(9); for (let i = 0; i < 40; i++) { const q = (R() + t * .8) % 1, x = W / 2 + (R() - .5) * 800 * (1 - ev * .6), y = 1100 - q * 800;
      ctx.fillStyle = `rgba(255,255,255,${.5 * (1 - q) * (1 - ev * .5)})`; ctx.beginPath(); ctx.arc(x + Math.sin(q * 6 + i) * 30, y, 20 + q * 60, 0, TAU); ctx.fill(); }
  });
  kinetic(['EVAPORATING'], W / 2, 620, 140, t, 21.24, { hl: { EVAPORATING: '#fff' } });
  bigText('LAKES', W / 2, 1420, 140, '#3da5ff', seg(t, 22.36, 22.6) * (1 - ev * .6));
}

// ---------- S7 23.02–26.44: cansız tozlu çorak ----------
function tumble(x, y, r, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = '#8a6a3c'; ctx.lineWidth = 4; for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.ellipse(0, 0, r, r * .6, i * .6, 0, TAU); ctx.stroke(); } ctx.restore(); }
function s7(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#c98a5a'); g.addColorStop(.55, '#e8b080'); g.addColorStop(1, '#8a5a34'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const lt = t - 23.02;
  cam({ zoom: 1.0 + .08 * seg(t, 23, 26.4), x: -lt * 40, t, shake: 3 }, () => {
    // kum tepeleri
    for (let k = 0; k < 3; k++) { ctx.fillStyle = ['#d49a64', '#c08550', '#a8703e'][k]; ctx.beginPath(); ctx.moveTo(-300, H); for (let x = -300; x <= W + 400; x += 30) ctx.lineTo(x, 1000 + k * 160 + Math.sin(x * .005 + k * 2) * 90); ctx.lineTo(W + 400, H); ctx.fill(); }
    // iskelet balık kemiği (kurumuş deniz)
    ctx.strokeStyle = '#f0e6d2'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(300, 1320); ctx.lineTo(700, 1320); ctx.stroke(); for (let i = 0; i < 7; i++) { const x = 360 + i * 50; ctx.beginPath(); ctx.moveTo(x, 1320); ctx.lineTo(x + 20, 1260); ctx.moveTo(x, 1320); ctx.lineTo(x + 20, 1380); ctx.stroke(); }
    ctx.fillStyle = '#f0e6d2'; ctx.beginPath(); ctx.moveTo(700, 1320); ctx.lineTo(780, 1270); ctx.lineTo(790, 1370); ctx.fill(); ctx.beginPath(); ctx.moveTo(300, 1320); ctx.lineTo(240, 1280); ctx.lineTo(240, 1360); ctx.fill();
    tumble(((lt * 420) % 1500) - 200, 1180 - Math.abs(Math.sin(lt * 5)) * 80, 70, lt * 6);
  });
  ctx.save(); ctx.globalAlpha = .9; dustStorm(t); ctx.restore();
  kinetic(['LIFELESS'], W / 2, 220, 170, t, 24.3);
  kinetic(['DUSTY', 'WASTELAND'], W / 2, 390, 130, t, 25.1, { hl: { WASTELAND: '#ff5a2e' } });
}
function dustStorm(t) { const R = RN(2); for (let i = 0; i < 90; i++) { const y = R() * H, x = ((R() * W * 2 + t * 900 * (.5 + R())) % (W + 400)) - 200, l = 40 + R() * 120; ctx.strokeStyle = `rgba(170,110,60,${.2 + R() * .4})`; ctx.lineWidth = 3 + R() * 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y + 6); ctx.stroke(); } }

// ---------- S8 26.44–31.38: kavrulmuş dünyaya uyum? ----------
function cactus(x, y, s, g) { if (g <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(1, g); ctx.fillStyle = '#3f8a4a'; ctx.beginPath(); ctx.roundRect(-s * .12, -s, s * .24, s, s * .12); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-s * .42, -s * .62, s * .14, s * .32, s * .07); ctx.fill(); ctx.fillRect(-s * .42, -s * .4, s * .32, s * .12); ctx.beginPath(); ctx.roundRect(s * .28, -s * .78, s * .14, s * .36, s * .07); ctx.fill(); ctx.fillRect(s * .1, -s * .52, s * .32, s * .12);
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(-s * .12, -s * .1 - i * s * .09); ctx.lineTo(-s * .17, -s * .12 - i * s * .09); ctx.moveTo(s * .12, -s * .14 - i * s * .09); ctx.lineTo(s * .17, -s * .16 - i * s * .09); ctx.stroke(); } ctx.restore(); }
function s8(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5a1a0a'); g.addColorStop(.5, '#d8542a'); g.addColorStop(1, '#2a0c06'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.12 - .1 * seg(t, 26.4, 31.4), t, shake: 2 }, () => {
    const sun = ctx.createRadialGradient(W / 2, 520, 50, W / 2, 520, 600); sun.addColorStop(0, '#fff4c0'); sun.addColorStop(.25, '#ffb12e'); sun.addColorStop(1, 'rgba(255,90,30,0)'); ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(W / 2, 520, 600, 0, TAU); ctx.fill();
    ctx.fillStyle = '#3a1608'; ctx.fillRect(-300, 1150, W + 600, 900);
    // altıgen kuru çatlaklar
    ctx.strokeStyle = '#ff7a3a'; ctx.lineWidth = 4; ctx.shadowColor = '#ff4d00'; ctx.shadowBlur = 12; for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) { const x = c * 140 + (r % 2) * 70 - 40, y = 1180 + r * 70 * (1 + r * .15); ctx.beginPath(); ctx.ellipse(x, y, 66 * (1 + r * .15), 30 * (1 + r * .15), 0, 0, TAU); ctx.stroke(); } ctx.shadowBlur = 0;
    cactus(W / 2, 1200, 380, eback(seg(t, 27.8, 28.6)));
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(255,220,160,.25)'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 0; x < W; x += 20) ctx.lineTo(x, 900 + i * 50 + Math.sin(x * .03 + t * 7 + i) * 12); ctx.stroke(); }
  });
  kinetic(['ANY', 'LIVING', 'ORGANISM'], W / 2, 200, 120, t, 26.5);
  kinetic(['ADAPT?'], W / 2, 350, 170, t, 27.86, { hl: { 'ADAPT?': C.green } });
  if (t > 29.88) stampText('SCORCHED EARTH', W / 2, 1420, 110, '#ffcf6b', seg(t, 29.88, 30.15));
}

const THEO = ['Only microbes survive', 'Water wars forever', 'We would need Mars', 'Deep caves = life', 'Game over instantly', 'Desalinate the void'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 4.32, 8.54, 11.6, 15.68, 21.24, 23.02, 26.44, 31.38, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8, null];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i] ? S[i](clamp(t, a, b + .2)) : cta(Math.max(t, 31.38), 31.38, 32.98, 33.54, THEO, { tint: 'rgba(61,165,255,.2)', dot: '120,190,255' })); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 1.8 && t < 2.0 ? .8 : 0) + (t > 19.84 && t < 20.0 ? .6 : 0), Math.floor(t * 30));
  flash(t, 4.88, .15, '255,60,80');
  subs(t, SUBY);
};
