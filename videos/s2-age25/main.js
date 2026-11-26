// Seri2 #12 — "What If Humans Never Aged Past 25?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 40.99;
const SUBY = 1540;
const MINT = '#3affc0', RED = '#ff3b4e', GOLD = '#ffc83d', PUR = '#9b6bff', SKY = '#5fd3ff';

function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function guy(x, y, s, col, o = {}) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round'; const run = o.run || 0, ph = o.ph || 0;
  ctx.beginPath(); ctx.arc(0, -s * .88, s * .11, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .16, -s * .75, s * .32, s * .42, s * .09); ctx.fill(); ctx.lineWidth = s * .09;
  const a = Math.sin(ph) * run; ctx.beginPath(); ctx.moveTo(-s * .06, -s * .36); ctx.lineTo(-s * .06 + a * s * .35, -s * .16); ctx.lineTo(-s * .06 + a * s * .3, 0); ctx.moveTo(s * .06, -s * .36); ctx.lineTo(s * .06 - a * s * .35, -s * .16); ctx.lineTo(s * .06 - a * s * .3, 0);
  ctx.moveTo(-s * .15, -s * .7); ctx.lineTo(-s * .26 - a * s * .2, -s * .45); ctx.moveTo(s * .15, -s * .7); ctx.lineTo(s * .26 + a * s * .2, -s * .45); ctx.stroke();
  if (o.badge) { ctx.fillStyle = o.badgeCol || GOLD; ctx.beginPath(); ctx.roundRect(-s * .2, -s * .6, s * .4, s * .14, s * .04); ctx.fill(); txt(o.badge, 0, -s * .53, s * .08, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }
  if (o.tie) { ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, -s * .74); ctx.lineTo(s * .04, -s * .5); ctx.lineTo(0, -s * .45); ctx.lineTo(-s * .04, -s * .5); ctx.fill(); } ctx.restore(); }

// ---------- S1 0–3.38: yaş sayacı 25'te kilitlenir ----------
function s1(t) {
  darkGrad('#0a1a2a', '#020608');
  const age = Math.min(25, Math.floor(lerp(16, 25.9, eo(seg(t, 0, 2.0))))), lock = eback(seg(t, 2.0, 2.4));
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 3.3)), t, shake: 2 + 12 * seg(t, 2.0, 2.2) * (1 - seg(t, 2.2, 2.7)) }, () => {
    // pasta + mumlar
    ctx.fillStyle = '#ff8ab8'; ctx.beginPath(); ctx.roundRect(W / 2 - 300, 1050, 600, 230, 30); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(W / 2 - 300, 1030, 600, 60, 30); ctx.fill(); ctx.fillStyle = '#ffd0e0'; ctx.fillRect(W / 2 - 320, 1270, 640, 30);
    const n = Math.min(10, Math.ceil(age / 2.5)); for (let i = 0; i < n; i++) { const x = W / 2 - 250 + i * 55; ctx.fillStyle = ['#3da5ff', GOLD, MINT, PUR][i % 4]; ctx.fillRect(x, 920, 22, 110); const fl = 1 + .2 * Math.sin(t * 20 + i); ctx.fillStyle = '#ffb030'; ctx.beginPath(); ctx.ellipse(x + 11, 900, 10 * fl, 22 * fl, 0, 0, TAU); ctx.fill(); }
    // dev yaş + kilit
    txt(String(age), W / 2, 680, 330, age >= 25 ? MINT : '#fff', { align: 'center', font: 'Anton', weight: 400, glow: MINT, blur: 60 });
    if (lock > 0) { ctx.save(); ctx.translate(W / 2 + 260, 560); ctx.scale(lock, lock); ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(0, -40, 50, Math.PI, 0); ctx.stroke(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.roundRect(-70, -40, 140, 110, 18); ctx.fill(); ctx.restore(); }
  });
  kinetic(['WHAT', 'IF', 'YOU', 'NEVER'], W / 2, 210, 140, t, -.3, { gap: .05 });
  kinetic(['AGED', 'PAST', '25?'], W / 2, 370, 160, t, .15, { hl: { '25?': MINT } });
  flash(t, 2.0, .15, '58,255,192');
}

// ---------- S2 3.38–7.48: sonsuza kadar zirvede ----------
function s2(t) {
  bgFinance(t, { tint: 'rgba(58,255,192,.2)', seed: 4, dot: '120,255,200' });
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    guy(330, 1350, 760, '#2a3a5a');
    [['PHYSICAL', 4.84, SKY], ['COGNITIVE', 5.52, PUR]].forEach(([l, t0, col], i) => { const y = 650 + i * 280, v = eo(seg(t, t0, t0 + .6)); txt(l, 620, y - 60, 54, '#fff', { font: 'Anton', weight: 400 });
      ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.roundRect(620, y, 380, 70, 35); ctx.fill(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 25; ctx.beginPath(); ctx.roundRect(620, y, 380 * v, 70, 35); ctx.fill(); ctx.shadowBlur = 0; txt(Math.round(v * 100) + '%', 1000, y - 60, 54, col, { align: 'right', font: 'Anton', weight: 400 }); });
    // sonsuzluk
    ctx.save(); ctx.strokeStyle = MINT; ctx.lineWidth = 16; ctx.shadowColor = MINT; ctx.shadowBlur = 30; ctx.beginPath(); for (let i = 0; i <= 200 * seg(t, 6.0, 6.8); i++) { const a = i / 200 * TAU, d = 1 + Math.sin(a) ** 2; ctx.lineTo(810 + 170 * Math.cos(a) / d, 1250 + 170 * Math.sin(a) * Math.cos(a) / d); } ctx.stroke(); ctx.restore();
  });
  kinetic(['PEAK', 'FOREVER'], W / 2, 240, 170, t, 5.9, { hl: { FOREVER: MINT } });
}

// ---------- S3 7.48–14.08: kırışıklık, beyaz saç, Alzheimer → geçmişin efsaneleri ----------
function s3(t) {
  darkGrad('#1a140c', '#060402');
  const items = [['WRINKLES', 7.48], ['GRAY HAIR', 8.26], ["ALZHEIMER'S", 9.38], ['AGE DISEASES', 10.34]];
  const mus = seg(t, 11.98, 12.8);
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    items.forEach(([l, t0], i) => { const p = eback(seg(t, t0, t0 + .3)); if (p <= 0) return; const x = 290 + (i % 2) * 500, y = 640 + Math.floor(i / 2) * 420;
      ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.globalAlpha = 1 - mus * .5; ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.roundRect(-210, -150, 420, 300, 20); ctx.fill();
      ctx.strokeStyle = '#8a6a4a'; ctx.lineWidth = 6; ctx.strokeRect(-190, -130, 380, 260); txt(l, 0, 0, fit(l, 64, 340, 'Anton', 400), '#3a2a1a', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
      stampX(x, y, 180, seg(t, t0 + .4, t0 + .7)); });
    // müze camı
    if (mus > 0) { ctx.save(); ctx.globalAlpha = mus; ctx.strokeStyle = 'rgba(200,240,255,.8)'; ctx.lineWidth = 10; ctx.strokeRect(60, 450, 960, 820); ctx.fillStyle = 'rgba(200,240,255,.08)'; ctx.fillRect(60, 450, 960, 820); ctx.fillStyle = GOLD; ctx.fillRect(360, 1290, 360, 70); txt('MUSEUM', W / 2, 1325, 50, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
  });
  if (t > 11.98) bigText('MYTHS OF THE PAST', W / 2, 260, 110, GOLD, seg(t, 11.98, 12.25), { glow: GOLD });
  else kinetic(['GONE', 'FOREVER'], W / 2, 260, 150, t, 7.6, { hl: { GONE: RED } });
}

// ---------- S4 14.08–20.98: yüzyıllarca gelişen sporcular ----------
function s4(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a3a6a'); g.addColorStop(1, '#3a1a2a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const yr = Math.round(lerp(2026, 2526, eio(seg(t, 17.6, 19.6))));
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    // stadyum ışıkları + pist
    for (const x of [160, 920]) { ctx.fillStyle = '#d8dee8'; ctx.fillRect(x - 6, 300, 12, 500); const lg = ctx.createRadialGradient(x, 300, 10, x, 300, 400); lg.addColorStop(0, 'rgba(255,255,220,.6)'); lg.addColorStop(1, 'rgba(255,255,220,0)'); ctx.fillStyle = lg; ctx.fillRect(x - 400, 0, 800, 800); }
    ctx.fillStyle = '#c0392b'; ctx.fillRect(-300, 1100, W + 600, 400); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-300, 1130 + i * 90); ctx.lineTo(W + 300, 1130 + i * 90); ctx.stroke(); }
    for (let i = 0; i < 3; i++) guy(((i * 360 + t * 500) % 1400) - 150, 1210 + i * 90, 380, ['#3da5ff', GOLD, MINT][i], { run: .9, ph: t * 14 + i });
    // rekor kronometresi
    const sec = (9.58 - 1.2 * eo(seg(t, 17.6, 19.6))).toFixed(2); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.roundRect(240, 560, 600, 200, 40); ctx.fill(); txt(sec + 's', W / 2, 660, 120, GOLD, { align: 'center', font: 'Anton', weight: 400, glow: GOLD });
  });
  txt('YEAR ' + yr, W / 2, 470, 70, '#fff', { align: 'center', font: 'Anton', weight: 400 });
  kinetic(['WILDLY', 'COMPETITIVE'], W / 2, 230, 130, t, 14.5, { hl: { COMPETITIVE: GOLD } });
  if (t > 17.84) bigText('CENTURIES OF TRAINING', W / 2, 1440, 100, '#fff', seg(t, 17.84, 18.1));
}

// ---------- S5 20.98–25.22: toplum baş aşağı döner ----------
function s5(t) {
  const fl = eio(seg(t, 22.6, 23.8));
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ff9a5a'); g.addColorStop(1, '#5a2a6a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, rot: Math.PI * fl, t, shake: 2 + 14 * Math.sin(fl * Math.PI) }, () => {
    skyline(1250, t, { seed: 14, tall: 700, col: '#2a1a3a' }); ctx.fillStyle = '#1a1024'; ctx.fillRect(-500, 1250, W + 1000, 800);
    // nüfus piramidi (yaşlı üstte → ters)
    for (let i = 0; i < 6; i++) { const w = 120 + i * 60; ctx.fillStyle = i < 3 ? MINT : PUR; ctx.fillRect(W / 2 - w, 1350 + i * 60, w * 2, 50); }
  });
  kinetic(['HOWEVER...'], W / 2, 240, 170, t, 21.0);
  if (t > 22.98) stampText('UPSIDE DOWN', W / 2, 1440, 120, RED, seg(t, 22.98, 23.25));
}

// ---------- S6 25.22–31.16: emeklilik yok, yüzlerce yıl çalış ----------
function s6(t) {
  darkGrad('#14181e', '#05060a');
  const yrs = Math.round(lerp(0, 300, eo(seg(t, 27.68, 29.4))));
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    // RETIREMENT tabelası düşer
    const f = eio(seg(t, 25.94, 26.6)); ctx.save(); ctx.translate(W / 2, lerp(520, 1500, f * f)); ctx.rotate(f * 1.2); ctx.fillStyle = '#3a9a4a'; ctx.beginPath(); ctx.roundRect(-300, -70, 600, 140, 20); ctx.fill(); txt('RETIREMENT →', 0, 4, 64, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore();
    // masa başında çalışan
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(220, 1150, 640, 40); ctx.fillRect(250, 1190, 30, 180); ctx.fillRect(800, 1190, 30, 180); ctx.fillStyle = '#1a1e2a'; ctx.beginPath(); ctx.roundRect(470, 960, 260, 180, 10); ctx.fill(); ctx.fillStyle = '#3da5ff'; ctx.fillRect(490, 980, 220, 140);
    guy(380, 1300, 420, '#2a3a5a', { tie: true });
    // takvim yaprakları uçuşur
    for (let i = 0; i < 6; i++) { const q = ((t * .9 + i / 6) % 1); ctx.save(); ctx.translate(850 + q * 200, 900 - q * 500); ctx.rotate(q * 3); ctx.globalAlpha = 1 - q; ctx.fillStyle = '#fff'; ctx.fillRect(-45, -45, 90, 90); ctx.fillStyle = RED; ctx.fillRect(-45, -45, 90, 22); ctx.restore(); }
  });
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.roundRect(230, 560, 620, 180, 40); ctx.fill(); txt(yrs + ' YEARS', W / 2, 650, 120, GOLD, { align: 'center', font: 'Anton', weight: 400, glow: GOLD });
  kinetic(['NO', 'RETIREMENT'], W / 2, 240, 150, t, 25.22, { hl: { RETIREMENT: RED } });
  if (t > 29.52) bigText('TO FUND AN ENDLESS LIFE', W / 2, 1440, 90, '#fff', seg(t, 29.52, 29.8));
}

// ---------- S7 31.16–40.99: üst koltuklar hiç boşalmaz, nesil çatışması ----------
function s7(t) {
  darkGrad('#1a0c1e', '#050208');
  const clash = seg(t, 35.18, 36.0);
  cam({ zoom: 1.03, t, shake: 2 + 8 * Math.max(0, Math.sin(t * 10)) * clash }, () => {
    // kurumsal merdiven
    ctx.strokeStyle = '#9aa2b0'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(480, 1350); ctx.lineTo(480, 540); ctx.moveTo(600, 1350); ctx.lineTo(600, 540); ctx.stroke(); for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(480, 1300 - i * 100); ctx.lineTo(600, 1300 - i * 100); ctx.stroke(); }
    // tepedeki taht + 200 yaşındaki yönetici
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.roundRect(360, 420, 360, 160, 20); ctx.fill(); ctx.fillRect(390, 260, 300, 170);
    guy(540, 560, 460, '#3a2a4a', { badge: 'AGE 200', badgeCol: '#fff', tie: true });
    const lk = eback(seg(t, 33.6, 34.0)); if (lk > 0) { ctx.save(); ctx.translate(780, 470); ctx.scale(lk * 1.4, lk * 1.4); ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, -30, 36, Math.PI, 0); ctx.stroke(); ctx.fillStyle = RED; ctx.beginPath(); ctx.roundRect(-50, -30, 100, 80, 12); ctx.fill(); ctx.restore(); }
    // altta bekleyen yeni gelenler
    for (let i = 0; i < 5; i++) guy(140 + i * 200 + (i > 1 ? 80 : 0), 1360, 300, '#2a5a4a', { badge: 'AGE 25', badgeCol: MINT });
    // çatışma şimşekleri
    if (clash > 0) { ctx.strokeStyle = `rgba(255,59,78,${clash})`; ctx.lineWidth = 10; ctx.shadowColor = RED; ctx.shadowBlur = 30; const R = RN(Math.floor(t * 8)); for (let k = 0; k < 3; k++) { let x = 540 + (k - 1) * 120, y = 620; ctx.beginPath(); ctx.moveTo(x, y); while (y < 1050) { x += (R() - .5) * 80; y += 60; ctx.lineTo(x, y); } ctx.stroke(); } ctx.shadowBlur = 0; }
  });
  kinetic(['SENIOR', 'ROLES'], W / 2, 210, 150, t, 31.2, { hl: { ROLES: GOLD } });
  if (t > 33.6 && t < 35.1) bigText('NEVER OPEN UP', W / 2, 1440, 110, RED, seg(t, 33.6, 33.85));
  if (t > 35.64) stampText('GENERATION WAR', W / 2, 1440, 110, RED, seg(t, 35.64, 35.9));
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 3.38, 7.48, 14.08, 20.98, 25.22, 31.16, 99], S = [s1, s2, s3, s4, s5, s6, s7];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 22.98 && t < 23.2 ? .6 : 0) + (t > 35.64 && t < 35.85 ? .8 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
