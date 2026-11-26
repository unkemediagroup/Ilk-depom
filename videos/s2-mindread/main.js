// Seri2 #5 — "What If Everyone Could Read Minds?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 43.55;
const SUBY = 1540;
const PK = '#ff4fa3', CY = '#4ff0ff', RED = '#ff3b4e', GOLD = '#ffc83d';

function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function bub(s, x, y, size, p, col = '#fff', ink = '#111', tail = 1) { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.font = `800 ${size}px Montserrat`; const w = ctx.measureText(s).width + size * 1.1, h = size * 1.9;
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); if (tail) { ctx.beginPath(); ctx.arc(-w * .2, h * .72, size * .22, 0, TAU); ctx.arc(-w * .27, h * 1.05, size * .12, 0, TAU); ctx.fill(); }
  txt(s, 0, 2, size, ink, { align: 'center', weight: 800, stroke: 0 }); ctx.restore(); }
function walker(x, y, s, t, ph, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round'; const a = Math.sin(t * 7 + ph) * .3;
  ctx.beginPath(); ctx.arc(0, -s * .88, s * .11, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .15, -s * .75, s * .3, s * .42, s * .08); ctx.fill();
  ctx.lineWidth = s * .09; ctx.beginPath(); ctx.moveTo(-s * .06, -s * .36); ctx.lineTo(-s * .06 + a * s * .3, 0); ctx.moveTo(s * .06, -s * .36); ctx.lineTo(s * .06 - a * s * .3, 0); ctx.stroke(); ctx.restore(); }
const THO = ['UGLY SHOES', 'I HATE MY JOB', 'IS HE LYING?', 'SO HUNGRY', 'NICE CAR... NOT', 'I CHEATED', 'WHO FARTED?', 'LATE AGAIN', 'BORING', 'STOP STARING'];

// ---------- S1 0–6.7: kalabalık caddede herkesin düşünceleri ----------
function s1(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a1040'); g.addColorStop(1, '#3a1a3a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 6.6)), x: -t * 12, t, shake: 2 }, () => {
    skyline(1100, t, { seed: 22, tall: 520, col: '#120a28' }); ctx.fillStyle = '#2a2238'; ctx.fillRect(-300, 1100, W + 600, 900);
    const R = RN(6); for (let i = 0; i < 14; i++) { const r = i % 2, x = ((R() * 1500 + t * (60 + R() * 60) * (r ? 1 : -1)) % 1500 + 1500) % 1500 - 200, y = 1200 + r * 160 + R() * 40;
      walker(x, y, 300 + r * 60, t, i, ['#e8d8c8', '#c9a77a', '#8a5a3a', '#f2c49a'][i % 4]);
      const t0 = .1 + i * .35, life = t - t0; if (life > 0) bub(THO[i % THO.length], x + 60, y - 430 - r * 40, 40, seg(t, t0, t0 + .3), i % 3 ? '#fff' : PK); }
  });
  kinetic(['WHAT', 'IF', 'EVERYONE', 'COULD'], W / 2, 200, 120, t, -.3, { gap: .05 });
  kinetic(['READ', 'MINDS?'], W / 2, 350, 170, t, .15, { hl: { 'MINDS?': PK } });
}

// ---------- S2 6.7–11.2: toplumun kibar maskesi parçalanır ----------
function mask(x, y, s, crack, t) { ctx.save(); ctx.translate(x, y);
  const g = ctx.createLinearGradient(-s, -s, s, s); g.addColorStop(0, '#fff6e8'); g.addColorStop(1, '#d8c8b0'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -s * .62); ctx.bezierCurveTo(s * .62, -s * .62, s * .6, s * .2, 0, s * .66); ctx.bezierCurveTo(-s * .6, s * .2, -s * .62, -s * .62, 0, -s * .62); ctx.fill();
  ctx.fillStyle = '#1a0a14'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * s * .2, -s * .12, s * .1, s * .06, sx * .2, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = '#1a0a14'; ctx.lineWidth = s * .035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, s * .1, s * .2, .3, Math.PI - .3); ctx.stroke();
  ctx.fillStyle = 'rgba(255,120,150,.4)'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * s * .3, s * .08, s * .07, 0, TAU); ctx.fill(); }
  if (crack > 0) { ctx.strokeStyle = RED; ctx.lineWidth = s * .015; ctx.shadowColor = RED; ctx.shadowBlur = 20; const R = RN(3); for (let k = 0; k < 6; k++) { let a = k / 6 * TAU, px = 0, py = 0; ctx.beginPath(); ctx.moveTo(0, 0); for (let i = 0; i < 6 * crack; i++) { a += (R() - .5) * .8; px += Math.cos(a) * s * .1; py += Math.sin(a) * s * .1; ctx.lineTo(px, py); } ctx.stroke(); } }
  ctx.restore(); }
function s2(t) {
  darkGrad('#14061a', '#050208');
  const cr = seg(t, 8.4, 9.88), br = seg(t, 9.88, 11.2);
  cam({ zoom: 1.04 + .05 * cr, t, shake: 2 + 22 * Math.sin(br * Math.PI) }, () => {
    if (br <= 0) mask(W / 2, 880, 720, cr, t);
    else { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, d = eo(br) * 500; ctx.save(); ctx.translate(Math.cos(a) * d, Math.sin(a) * d + br * br * 300); ctx.beginPath(); ctx.moveTo(W / 2, 880); ctx.arc(W / 2, 880, 600, a, a + TAU / 6); ctx.closePath(); ctx.clip(); mask(W / 2, 880, 720, 1, t); ctx.restore(); }
      // arkasındaki gerçek: kırmızı kaos düşünceleri
      ctx.save(); ctx.globalAlpha = br; bub('I CAN\'T STAND YOU', W / 2, 820, 46, 1, RED, '#fff', 0); bub('FAKE SMILE', W / 2, 960, 46, 1, '#fff', '#111', 0); ctx.restore(); }
  });
  kinetic(["SOCIETY'S", 'POLITE', 'MASK'], W / 2, 230, 120, t, 7.0, { hl: { MASK: GOLD } });
  if (t > 9.88) stampText('SHATTERED', W / 2, 1420, 130, RED, seg(t, 9.88, 10.15));
}

// ---------- S3 11.2–17.42: yalan, ihanet, yargı ifşa ----------
function s3(t) {
  darkGrad('#0c0a1a', '#03020a');
  const cards = [['LIE', 11.66, 220, '#ff8a3a'], ['BETRAYAL', 12.78, 540, RED], ['JUDGMENT', 14.28, 860, PK]];
  cam({ zoom: 1.03, t, shake: 2 + 10 * seg(t, 15.14, 15.4) * (1 - seg(t, 15.4, 15.9)) }, () => {
    cards.forEach(([lab, t0, x, col], i) => { const f = eio(seg(t, t0, t0 + .5)), sx = Math.cos(f * Math.PI); ctx.save(); ctx.translate(x, 900 + Math.sin(t * 2 + i) * 14); ctx.scale(Math.abs(sx), 1);
      ctx.fillStyle = sx > 0 ? '#2a2440' : col; ctx.shadowColor = sx > 0 ? 'transparent' : col; ctx.shadowBlur = 40; ctx.beginPath(); ctx.roundRect(-140, -220, 280, 440, 24); ctx.fill(); ctx.shadowBlur = 0;
      if (sx > 0) { ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 4; ctx.strokeRect(-110, -190, 220, 380); txt('?', 0, 0, 160, 'rgba(255,255,255,.4)', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); }
      else txt(lab, 0, 0, fit(lab, 70, 240, 'Anton', 400), '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); });
  });
  kinetic(['EVERY', 'HIDDEN...'], W / 2, 260, 150, t, 11.2);
  if (t > 15.14) stampText('EXPOSED', W / 2, 1420, 150, RED, seg(t, 15.14, 15.4));
}

// ---------- S4 17.42–20.52: evlilikler, arkadaşlıklar ----------
function ringG(x, y, r, col) { ctx.strokeStyle = col; ctx.lineWidth = r * .22; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; }
function s4(t) {
  darkGrad('#1a0610', '#050104');
  const rc = seg(t, 17.96, 18.6), fd = seg(t, 19.3, 20.4);
  cam({ zoom: 1.03, t, shake: 2 + 14 * Math.sin(rc * Math.PI) }, () => {
    // yüzükler ayrılır, kırılır
    const sp = 120 + 160 * eo(rc); ringG(W / 2 - 90 - sp * .5, 650, 140, GOLD); ringG(W / 2 + 90 + sp * .5, 650, 140, '#d8dee8');
    if (rc > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(W / 2, 480); ctx.lineTo(W / 2 - 30, 580); ctx.lineTo(W / 2 + 20, 660); ctx.lineTo(W / 2 - 10, 820); ctx.stroke(); }
    // el sıkışma toza dönüşür
    const R = RN(4); for (let i = 0; i < 160; i++) { const ox = (R() - .5) * 520, oy = (R() - .5) * 160, q = clamp(fd * 1.4 - (ox + 260) / 520 * .4); ctx.fillStyle = i % 2 ? '#f2c49a' : '#c9a77a'; ctx.globalAlpha = 1 - q; ctx.fillRect(W / 2 + ox + q * 300, 1150 + oy - q * 400 * R(), 14, 14); } ctx.globalAlpha = 1;
  });
  bigText('MARRIAGES COLLAPSE', W / 2, 260, 100, RED, seg(t, 17.42, 17.7), { glow: RED });
  if (t > 19.08) bigText('FRIENDSHIPS DISSOLVE', W / 2, 1420, 90, '#fff', seg(t, 19.08, 19.35));
}

// ---------- S5 20.52–27.72: siyaset kaosa düşer, blöf yok ----------
function leader(x, y, s, col, dir) { ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .9, s * .12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .2, -s * .76, s * .4, s * .5, s * .08); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, -s * .72); ctx.lineTo(s * .04, -s * .45); ctx.lineTo(0, -s * .4); ctx.lineTo(-s * .04, -s * .45); ctx.fill(); ctx.restore(); }
function s5(t) {
  darkGrad('#0a1428', '#02050c');
  const flip = seg(t, 22.5, 23.3), bl = seg(t, 24.74, 25.0);
  cam({ zoom: 1.03, t, shake: 2 + 18 * Math.sin(flip * Math.PI) }, () => {
    // bayraklar
    for (const [x, c1, c2] of [[230, '#3d7cff', '#fff'], [850, RED, GOLD]]) { ctx.fillStyle = '#ccc'; ctx.fillRect(x - 4, 420, 8, 300); ctx.fillStyle = c1; ctx.fillRect(x + 4, 420, 140, 45); ctx.fillStyle = c2; ctx.fillRect(x + 4, 465, 140, 45); }
    leader(250, 1150, 420, '#2a3a5a', 1); leader(830, 1150, 420, '#4a2a2a', -1);
    // masa devrilir
    ctx.save(); ctx.translate(W / 2, 1120); ctx.rotate(-flip * .5); ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-330, -30, 660, 50); ctx.fillRect(-300, 20, 30, 160); ctx.fillRect(270, 20, 30, 160); ctx.fillStyle = '#fff'; ctx.fillRect(-60, -46, 120, 18); ctx.restore();
    if (flip > 0) shards(W / 2, 1100, flip, 30, 5, '#fff', 14, 500);
    bub('WE\'RE BLUFFING', 260, 640, 34, seg(t, 23.4, 23.7), '#fff'); bub('NO REAL DEAL', 820, 640, 34, seg(t, 24.0, 24.3), PK);
  });
  kinetic(['GLOBAL', 'POLITICS'], W / 2, 220, 140, t, 20.6);
  if (t > 22.5) stampText('CHAOS', W / 2, 1420, 150, RED, seg(t, 22.5, 22.75));
  if (t > 24.74) bigText('NO MORE BLUFFS', W / 2, 360, 100, CY, bl, { glow: CY });
}

// ---------- S6 27.72–32.82: ceza adaleti — suç saklanamaz ----------
function s6(t) {
  darkGrad('#1a1208', '#060402');
  const gv = seg(t, 31.0, 31.56);
  cam({ zoom: 1.03, t, shake: 2 + 20 * seg(t, 31.56, 31.8) * (1 - seg(t, 31.8, 32.3)) }, () => {
    // mahkeme kürsüsü + sütunlar
    for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(200,170,120,.25)'; ctx.fillRect(100 + i * 260, 300, 60, 700); }
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(140, 980, 800, 380); ctx.fillStyle = '#8a6a3a'; ctx.fillRect(120, 960, 840, 40);
    // şüpheli + itiraf eden düşünce
    walker(W / 2, 960, 380, 0, 0, '#ff8a3a'); ctx.fillStyle = '#fff'; for (let i = 0; i < 4; i++) ctx.fillRect(W / 2 - 60, 650 + i * 50, 120, 10);
    bub('I DID IT.', W / 2 + 80, 470, 54, seg(t, 29.52, 29.9), RED, '#fff');
    // tokmak
    ctx.save(); ctx.translate(880, 900); ctx.rotate(-1.0 + 1.0 * eio(gv)); ctx.fillStyle = '#5a3a1a'; ctx.fillRect(-12, -10, 24, 220); ctx.fillStyle = '#7a5a2a'; ctx.beginPath(); ctx.roundRect(-70, -50, 140, 80, 24); ctx.fill(); ctx.restore();
  });
  kinetic(['CRIMINAL', 'JUSTICE'], W / 2, 220, 140, t, 27.8, { hl: { JUSTICE: GOLD } });
  if (t > 31.56) stampText('GUILTY', W / 2, 1440, 150, RED, seg(t, 31.56, 31.8));
}

// ---------- S7 32.82–38.9: dayanılmaz zihinsel gürültü → yalnızlık ----------
function s7(t) {
  const iso = t > 36.3;
  if (!iso) { darkGrad('#2a0a2a', '#08020a');
    cam({ zoom: 1.03, t, shake: 6 + 8 * seg(t, 33.58, 34.5) }, () => {
      const R = RN(8); for (let i = 0; i < 40; i++) { const x = R() * W, y = 300 + R() * 1100, t0 = 32.9 + R() * 2.5; bub(THO[i % THO.length], x, y, 26 + R() * 20, seg(t, t0, t0 + .25), ['#fff', PK, CY, GOLD][i % 4], '#111', 0); }
      // kulaklarını kapatan kişi
      ctx.save(); ctx.translate(W / 2, 1300); walker(0, 0, 500, 0, 0, '#111'); ctx.strokeStyle = '#111'; ctx.lineWidth = 40; ctx.lineCap = 'round'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 70, -360); ctx.lineTo(sx * 110, -440); ctx.lineTo(sx * 60, -440); ctx.stroke(); } ctx.restore(); });
    const db = Math.round(lerp(40, 140, eo(seg(t, 33.4, 34.6)))); txt(db + ' dB', W / 2, 220, 150, RED, { align: 'center', font: 'Anton', weight: 400, glow: RED });
    if (t > 34.06) bigText('MENTAL NOISE', W / 2, 1420, 120, '#fff', seg(t, 34.06, 34.3)); return; }
  // ıssız dağ kulübesi
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#020410'); g.addColorStop(1, '#1a2440'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.5 - .1 * seg(t, 36.3, 38.9), y: -120, t, shake: 1 }, () => {
    const R = RN(2); for (let i = 0; i < 160; i++) { ctx.fillStyle = `rgba(255,255,255,${.3 + R() * .6})`; ctx.beginPath(); ctx.arc(R() * W, R() * 900, R() * 2.5, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#1e2c50'; ctx.beginPath(); ctx.moveTo(-100, 1300); ctx.lineTo(300, 800); ctx.lineTo(600, 1100); ctx.lineTo(850, 700); ctx.lineTo(1200, 1300); ctx.fill();
    ctx.fillStyle = '#060a14'; ctx.fillRect(-300, 1250, W + 600, 800);
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(470, 1120, 160, 130); ctx.fillStyle = '#2a1a0a'; ctx.beginPath(); ctx.moveTo(450, 1120); ctx.lineTo(550, 1040); ctx.lineTo(650, 1120); ctx.fill(); ctx.fillStyle = '#ffd890'; ctx.shadowColor = '#ffd890'; ctx.shadowBlur = 30; ctx.fillRect(520, 1160, 40, 40); ctx.shadowBlur = 0;
    // uzakta kalan şehir ışıkları
    for (let i = 0; i < 40; i++) { ctx.fillStyle = 'rgba(255,200,120,.6)'; ctx.fillRect(820 + (i % 10) * 18, 1230 - Math.floor(i / 10) * 14, 6, 6); }
  });
  kinetic(['ABANDON', 'CITIES'], W / 2, 260, 150, t, 36.3);
  if (t > 37.98) bigText('ISOLATION', W / 2, 1420, 150, CY, seg(t, 37.98, 38.25), { glow: CY });
}

// ---------- S8 38.9–43.55: nöral engelleme kaskı ----------
function s8(t) {
  darkGrad('#04121a', '#010406');
  const hm = eback(seg(t, 39.6, 40.2));
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    // profil kafa
    ctx.save(); ctx.translate(W / 2, 1300); ctx.fillStyle = '#e8c8a8'; ctx.beginPath(); ctx.ellipse(0, -480, 240, 280, 0, 0, TAU); ctx.fill(); ctx.fillRect(-90, -240, 180, 240); ctx.restore();
    // dışarıdan gelen düşünce dalgaları kaskta seker
    for (let i = 0; i < 5; i++) { const q = ((t * .9 + i / 5) % 1), x = lerp(-60, W / 2 - 300, q); ctx.strokeStyle = `rgba(255,79,163,${Math.sin(q * Math.PI)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x, 820, 80, -.7, .7); ctx.stroke();
      const x2 = lerp(W + 60, W / 2 + 300, q); ctx.beginPath(); ctx.arc(x2, 820, 80, Math.PI - .7, Math.PI + .7); ctx.stroke(); }
    if (hm > 0) { ctx.save(); ctx.translate(W / 2, 820); ctx.scale(hm, hm); const g = ctx.createLinearGradient(-280, -260, 280, 100); g.addColorStop(0, '#eef2f8'); g.addColorStop(1, '#7a8494'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 290, Math.PI, 0); ctx.lineTo(290, 60); ctx.lineTo(-290, 60); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = CY; ctx.lineWidth = 8; ctx.shadowColor = CY; ctx.shadowBlur = 30; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(0, 0, 120 + i * 40, Math.PI + .3, -.3); ctx.stroke(); } ctx.restore();
      for (let i = 0; i < 4; i++) ring2(W / 2, 820, ((t - 39.6) * 1.1 + i / 4) % 1, 600, CY, 8); }
    // altın kilit: özel düşünce = lüks
    const lk = eback(seg(t, 42.06, 42.4)); if (lk > 0) { ctx.save(); ctx.translate(880, 1150); ctx.scale(lk * .8, lk * .8); ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(0, -60, 60, Math.PI, 0); ctx.stroke(); ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 40; ctx.beginPath(); ctx.roundRect(-90, -60, 180, 150, 22); ctx.fill(); ctx.restore(); }
  });
  kinetic(['NEURAL-BLOCKING', 'HELMETS'], W / 2, 240, 110, t, 39.4, { hl: { HELMETS: CY } });
  if (t > 42.06) bigText('PRIVATE THOUGHT = LUXURY', W / 2, 1440, 84, GOLD, seg(t, 42.06, 42.3), { glow: GOLD });
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 6.7, 11.2, 17.42, 20.52, 27.72, 32.82, 38.9, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 9.88 && t < 10.1 ? 1 : 0) + (t > 15.14 && t < 15.35 ? .7 : 0) + (t > 22.5 && t < 22.7 ? .7 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
