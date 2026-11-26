// Seri2 #17 — "What If Everyone Had the Same Face?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 44.68;
const SUBY = 1540;
const MAG = '#ff3aa8', CY = '#3ae0ff', LIME = '#b6ff3a', RED = '#ff3b4e';
const SKIN = '#e8b48a';

// Tek tip yüz. o.hair/o.tat/o.hat/o.var (çeşitlilik), o.col
function face(x, y, s, o = {}) { const v = o.var || 0; ctx.save(); ctx.translate(x, y);
  const sk = o.skin || SKIN; ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(0, 0, s * (.36 + v * .05 * Math.sin(o.seed || 0)), s * (.46 + v * .04 * Math.cos(o.seed || 0)), 0, 0, TAU); ctx.fill();
  ctx.fillStyle = sk; ctx.fillRect(-s * .13, s * .38, s * .26, s * .2);
  ctx.fillStyle = o.shirt || '#5a6070'; ctx.beginPath(); ctx.ellipse(0, s * .82, s * .5, s * .3, 0, Math.PI, 0); ctx.fill();
  if (o.hair) { ctx.fillStyle = o.hair; if (o.mohawk) { ctx.beginPath(); for (let i = 0; i < 7; i++) { ctx.lineTo(-s * .12 + i * s * .04, -s * .45 - (i % 2 ? s * .35 : s * .15)); } ctx.lineTo(s * .14, -s * .4); ctx.lineTo(-s * .14, -s * .4); ctx.fill(); } else if (o.afro) { ctx.beginPath(); ctx.arc(0, -s * .3, s * .5, 0, TAU); ctx.fill(); ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(0, s * .02, s * .34, s * .42, 0, 0, TAU); ctx.fill(); } else { ctx.beginPath(); ctx.ellipse(0, -s * .3, s * .4, s * .22, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-s * .4, -s * .32, s * .1, s * .5); ctx.fillRect(s * .3, -s * .32, s * .1, s * .5); } }
  else { ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.ellipse(0, -s * .32, s * .37, s * .18, 0, Math.PI, 0); ctx.fill(); }
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-s * .13, -s * .04, s * .07, s * .045, 0, 0, TAU); ctx.ellipse(s * .13, -s * .04, s * .07, s * .045, 0, 0, TAU); ctx.fill(); ctx.fillStyle = o.eye || '#2a1a0a'; ctx.beginPath(); ctx.arc(-s * .13, -s * .04, s * .03, 0, TAU); ctx.arc(s * .13, -s * .04, s * .03, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = s * .025; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * .2, -s * .13); ctx.lineTo(-s * .07, -s * .12); ctx.moveTo(s * .07, -s * .12); ctx.lineTo(s * .2, -s * .13); ctx.stroke();
  ctx.strokeStyle = 'rgba(120,60,40,.6)'; ctx.beginPath(); ctx.moveTo(0, -s * .02); ctx.lineTo(-s * .03, s * .1); ctx.lineTo(s * .02, s * .11); ctx.stroke(); ctx.strokeStyle = '#a0403a'; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.moveTo(-s * .1, s * .22); ctx.quadraticCurveTo(0, s * (.25 + (o.smile || 0) * .08), s * .1, s * .22); ctx.stroke();
  if (o.tat) { ctx.strokeStyle = o.tat; ctx.lineWidth = s * .02; ctx.beginPath(); ctx.moveTo(s * .2, s * .05); ctx.lineTo(s * .28, s * .15); ctx.lineTo(s * .2, s * .25); ctx.stroke(); ctx.beginPath(); ctx.arc(-s * .22, s * .12, s * .04, 0, TAU); ctx.stroke(); }
  if (o.glasses) { ctx.strokeStyle = o.glasses; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.arc(-s * .13, -s * .04, s * .09, 0, TAU); ctx.moveTo(s * .22, -s * .04); ctx.arc(s * .13, -s * .04, s * .09, 0, TAU); ctx.moveTo(-s * .04, -s * .04); ctx.lineTo(s * .04, -s * .04); ctx.stroke(); }
  ctx.restore(); }
function bg(t, a = '#1a0a2a', b = '#05020a') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }

// ---------- S1 0–7.8: farklı yüzler tek yüze kopyalanır ----------
function s1(t) {
  bg(t);
  const m = eio(seg(t, .5, 3.3));
  cam({ zoom: 1.1 - .07 * seg(t, 0, 7.8), t, shake: 2 + 12 * seg(t, 3.0, 3.3) * (1 - seg(t, 3.3, 4)) }, () => {
    const SK = ['#f4d0b0', '#8a5a3a', '#c8946a', '#5a3a2a', '#e8c09a', '#a06a4a', '#f0c8a0', '#704a30', '#d8a078'];
    const HR = ['#e8c050', '#111', '#8a3a1a', '#222', '#c0c0c0', '#3a2a1a', '#ff6a3a', '#111', '#5a3a1a'];
    for (let i = 0; i < 9; i++) { const c = i % 3, r = Math.floor(i / 3), x = 210 + c * 330, y = 620 + r * 380 + Math.sin(t * 2 + i) * 8;
      const sk = m < .5 ? SK[i] : SKIN; const k = 1 - Math.abs(m - .5) * 2; ctx.save(); ctx.translate(x, y); ctx.scale(1 + .1 * k * Math.sin(t * 40 + i), 1); face(0, 0, 300, { skin: sk, hair: m < .5 ? HR[i] : null, afro: i === 3 && m < .5, var: 1 - m, seed: i, shirt: '#5a6070' }); ctx.restore(); }
    if (t > 3.0 && t < 3.5) { ctx.fillStyle = `rgba(255,255,255,${.7 * (1 - seg(t, 3.0, 3.5))})`; ctx.fillRect(-300, -300, W + 600, H + 600); }
  });
  kinetic(['WHAT', 'IF', 'WE', 'ALL', 'HAD'], W / 2, 190, 120, t, -.3, { gap: .05 });
  kinetic(['ONE', 'FACE?'], W / 2, 340, 180, t, .15, { hl: { 'FACE?': MAG } });
  if (t > 5.74) stampText('IDENTITY RESET', W / 2, 1330, 90, MAG, seg(t, 5.74, 6.0));
}

// ---------- S2 7.8–14.9: yüz tanıma, kimlik, pasaport işe yaramaz ----------
function s2(t) {
  bg(t, '#04121a', '#000');
  cam({ zoom: 1.03 + .05 * seg(t, 7.8, 14.9), t, shake: 2 + 10 * seg(t, 13.3, 13.6) * (1 - seg(t, 13.6, 14.3)) }, () => {
    // yüz tanıma kafesi, eşleşme çoklu
    face(W / 2, 720, 460, {});
    const sc = seg(t, 8.0, 9.6); ctx.strokeStyle = CY; ctx.lineWidth = 4; ctx.shadowColor = CY; ctx.shadowBlur = 12; const R = RN(2), P = []; for (let i = 0; i < 22; i++) P.push([W / 2 + (R() - .5) * 300, 720 + (R() - .5) * 380]); for (let i = 0; i < P.length * sc; i++) { const [a, b] = P[i], [c, d] = P[(i + 3) % P.length]; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); ctx.fillStyle = CY; ctx.beginPath(); ctx.arc(a, b, 6, 0, TAU); ctx.fill(); } ctx.shadowBlur = 0;
    const by = 470 + 500 * ((t * .8) % 1); ctx.fillStyle = 'rgba(58,224,255,.35)'; ctx.fillRect(W / 2 - 260, by, 520, 8);
    // kimlik kartları + pasaport
    const ids = [[200, 1180, 10.0, 'ID'], [W / 2, 1220, 10.2, 'ID'], [880, 1180, 11.26, 'PASS']];
    ids.forEach(([x, y, t0, l], i) => { const k = eback(seg(t, t0, t0 + .3)); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate((i - 1) * .12); ctx.fillStyle = l === 'PASS' ? '#1a2a6a' : '#e8eef6'; ctx.beginPath(); ctx.roundRect(-140, -90, 280, 180, 16); ctx.fill(); face(-70, -6, 130, { shirt: '#5a6070' }); txt(l, 50, -40, 40, l === 'PASS' ? GOLDC : '#1a2a4a', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.fillStyle = l === 'PASS' ? '#3a4a8a' : '#c0c8d6'; for (let r = 0; r < 3; r++) ctx.fillRect(10, -10 + r * 30, 100, 12); ctx.restore(); });
  });
  if (t < 9.9) kinetic(['MATCH:'], W / 2, 220, 140, t, 8.0); if (t > 8.9 && t < 13.32) { counter(1, 8000000000, W / 2, 360, 110, seg(t, 8.9, 10.6), { fmt: v => Math.round(v).toLocaleString('en-US'), col: CY }); }
  if (t > 13.32) stampText('USELESS', W / 2, 300, 170, RED, seg(t, 13.32, 13.55));
}
const GOLDC = '#ffc83d';

// ---------- S3 14.9–20.4: bankalar/havalimanları: parmak izi + DNA ----------
function s3(t) {
  bg(t, '#0a1a12', '#000');
  const dna = t > 18.5;
  cam({ zoom: 1.04, rot: Math.sin(t * .8) * .02, t, shake: 2 }, () => {
    if (!dna) { // dev parmak izi taranır
      ctx.save(); ctx.translate(W / 2, 880); const p = seg(t, 17.6, 18.4); ctx.strokeStyle = LIME; ctx.lineWidth = 9; ctx.shadowColor = LIME; ctx.shadowBlur = 14 * p; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.ellipse(Math.sin(i) * 6, i * 4, 40 + i * 24, 60 + i * 28, .1, Math.PI * (1.05 + .05 * Math.sin(i * 3)), Math.PI * (1.95 + .05 * Math.cos(i))); ctx.stroke(); } ctx.shadowBlur = 0;
      const sy = -420 + 840 * ((t * .7) % 1); ctx.fillStyle = 'rgba(182,255,58,.4)'; ctx.fillRect(-420, sy, 840, 10); ctx.restore();
      // banka + uçak simgeleri
      const b = eback(seg(t, 15.38, 15.7)), a = eback(seg(t, 16.08, 16.4));
      if (b > 0) { ctx.save(); ctx.translate(180, 470); ctx.scale(b, b); ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.moveTo(-110, -40); ctx.lineTo(0, -110); ctx.lineTo(110, -40); ctx.fill(); for (let i = 0; i < 4; i++) ctx.fillRect(-90 + i * 52, -30, 24, 100); ctx.fillRect(-120, 70, 240, 20); ctx.restore(); }
      if (a > 0) { ctx.save(); ctx.translate(900, 470); ctx.scale(a, a); ctx.rotate(-.3); ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.ellipse(0, 0, 130, 24, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-60, -110); ctx.lineTo(10, -110); ctx.lineTo(40, 0); ctx.lineTo(10, 110); ctx.lineTo(-60, 110); ctx.fill(); ctx.restore(); }
    } else { // DNA sarmalı
      for (let i = 0; i < 26; i++) { const y = 420 + i * 40, ph = t * 3 + i * .45, x1 = W / 2 + Math.sin(ph) * 260, x2 = W / 2 - Math.sin(ph) * 260, z = Math.cos(ph); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); ctx.fillStyle = z > 0 ? LIME : MAG; ctx.beginPath(); ctx.arc(x1, y, 18, 0, TAU); ctx.fill(); ctx.fillStyle = z > 0 ? MAG : LIME; ctx.beginPath(); ctx.arc(x2, y, 18, 0, TAU); ctx.fill(); }
    }
  });
  if (!dna) { pill('BANKS', 180, 640, 52, '#fff', seg(t, 15.38, 15.6)); pill('AIRPORTS', 900, 640, 52, '#fff', seg(t, 16.08, 16.3)); if (t > 17.86) bigText('FINGERPRINTS', W / 2, 1420, 110, LIME, seg(t, 17.86, 18.1), { glow: LIME }); else kinetic(['NEW', 'ID'], W / 2, 220, 150, t, 15.0, { hl: { ID: LIME } }); }
  else { bigText('DNA SCANS', W / 2, 240, 160, LIME, seg(t, 18.82, 19.05), { glow: LIME }); }
}

// ---------- S4 20.4–26.4: polis kalabalıkta suçluyu bulamaz ----------
function s4(t) {
  bg(t, '#140a0a', '#000');
  cam({ zoom: 1.05 + .06 * seg(t, 20.4, 26.4), x: Math.sin(t * 1.4) * 60, t, shake: 2 }, () => {
    // kalabalık: aynı yüzler, biri suçlu (kırmızı) karışır
    const R = RN(11), shf = seg(t, 22.0, 23.2); for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const i = r * 6 + c, x = 90 + c * 180 + (r % 2) * 90 + Math.sin(t * 2 + i) * 10 + (R() - .5) * 40 * shf, y = 560 + r * 230; face(x, y, 190 + r * 15, { shirt: i === 9 && shf < .5 ? RED : '#5a6070' }); }
    // dürbün/hedef nişanı dolaşır
    const tx = W / 2 + Math.sin(t * 2.2) * 330, ty = 900 + Math.cos(t * 1.7) * 280; ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(tx, ty, 120, 0, TAU); ctx.moveTo(tx - 170, ty); ctx.lineTo(tx + 170, ty); ctx.moveTo(tx, ty - 170); ctx.lineTo(tx, ty + 170); ctx.stroke();
  });
  kinetic(['WHO', 'DID', 'IT?'], W / 2, 220, 160, t, 20.5, { hl: { 'IT?': RED } });
  if (t > 23.8) { const k = eback(seg(t, 23.8, 24.1)); ctx.save(); ctx.translate(W / 2, 1420); ctx.scale(k, k); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-400, -70, 800, 140, 70); ctx.fill(); txt('"HE HAD... A FACE."', 0, 0, 60, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
  if (t > 25.32) stampText('IMPOSSIBLE', W / 2, 400, 110, RED, seg(t, 25.32, 25.55));
}

// ---------- S5 26.4–33.8: güzellik yerine davranış, karakter, ses ----------
function s5(t) {
  bg(t, '#1a1030', '#06040c');
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    // terazi: sol kefe BEAUTY (yükselir), sağ kefe ACTIONS/CHARACTER/VOICE (ağırlaşır)
    const tilt = .35 * eio(seg(t, 28.4, 31.5)); ctx.save(); ctx.translate(W / 2, 640); ctx.scale(1.15, 1.15); ctx.fillStyle = '#c9b6ff'; ctx.fillRect(-12, 0, 24, 560); ctx.fillRect(-140, 540, 280, 30); ctx.rotate(tilt); ctx.fillRect(-300, -10, 600, 20);
    for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 290, 0); ctx.rotate(-tilt); ctx.strokeStyle = '#c9b6ff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-120, 220); ctx.moveTo(0, 0); ctx.lineTo(120, 220); ctx.stroke(); ctx.fillStyle = '#8a72d8'; ctx.beginPath(); ctx.ellipse(0, 220, 150, 26, 0, 0, Math.PI); ctx.fill();
      if (sd < 0) { ctx.fillStyle = '#ffc83d'; ctx.font = '120px sans-serif'; ctx.textAlign = 'center'; txt('BEAUTY', 0, 170, 70, '#ffc83d', { align: 'center', font: 'Anton', weight: 400 }); if (t > 32.68) { ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-110, 140); ctx.lineTo(110, 200); ctx.stroke(); } }
      else { const it = [['ACTIONS', 29.4, LIME], ['CHARACTER', 30.34, CY], ['VOICE', 31.06, MAG]]; it.forEach(([l, t0, c], i) => { const k = eback(seg(t, t0, t0 + .3)); if (k <= 0) return; ctx.save(); ctx.translate(0, 190 - i * 62); ctx.scale(k, k); ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(-150, -28, 300, 56, 14); ctx.fill(); txt(l, 0, 2, 44, '#111', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }); }
      ctx.restore(); }
    ctx.restore();
    // ses dalgası (voice)
    if (t > 31.06) { ctx.strokeStyle = MAG; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 80; x < W - 80; x += 8) ctx.lineTo(x, 1420 + Math.sin(x * .05 + t * 12) * 40 * Math.sin((x - 80) / (W - 160) * Math.PI)); ctx.stroke(); }
  });
  kinetic(['JUDGED', 'BY', 'WHO', 'YOU', 'ARE'], W / 2, 230, 110, t, 26.7, { hl: { ARE: LIME } });
}

// ---------- S6 33.8–44.68: moda, saç, dövme = kimlik patlaması ----------
function s6(t) {
  bg(t, '#2a0a3a', '#0a0010');
  const bst = seg(t, 40.54, 41.2);
  cam({ zoom: 1.03 + .1 * eo(bst), t, shake: 2 + 18 * bst * (1 - seg(t, 41.2, 42)) }, () => {
    // arka plan ışın patlaması
    if (bst > 0) for (let i = 0; i < 24; i++) { ctx.save(); ctx.translate(W / 2, 900); ctx.rotate(i / 24 * TAU + t * .3); ctx.fillStyle = [MAG, CY, LIME, '#ffc83d'][i % 4]; ctx.globalAlpha = .25 * bst; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -90); ctx.lineTo(1400, 90); ctx.fill(); ctx.restore(); }
    // aynı yüz, üç kişi; sırayla stil eklenir
    const hk = seg(t, 37.5, 37.9), tk = seg(t, 38.66, 39.0), ck = seg(t, 40.0, 40.3), fk = seg(t, 36.42, 36.8);
    const P = [[230, { hair: hk > 0 ? MAG : null, mohawk: true, shirt: fk > 0 ? '#ffc83d' : '#5a6070', tat: tk > 0 ? '#111' : null, glasses: ck > 0 ? CY : null }],
      [W / 2, { hair: hk > 0 ? '#3a7aff' : null, afro: true, shirt: fk > 0 ? LIME : '#5a6070', tat: tk > 0 ? MAG : null, smile: 1 }],
      [850, { hair: hk > 0 ? '#f4f4f4' : null, shirt: fk > 0 ? MAG : '#5a6070', tat: tk > 0 ? CY : null, glasses: ck > 0 ? '#ffc83d' : null }]];
    P.forEach(([x, o], i) => { const bob = Math.sin(t * 4 + i * 2) * (10 + 20 * bst); face(x, 950 + bob, 360, o); });
    // konfeti
    if (bst > 0) { const R = RN(7); for (let i = 0; i < 60; i++) { const x = R() * W, y = ((R() * H + t * (200 + R() * 300)) % H); ctx.fillStyle = [MAG, CY, LIME, '#ffc83d'][i % 4]; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 4 + i); ctx.fillRect(-10, -5, 20, 10); ctx.restore(); } }
  });
  kinetic(['HOW', 'TO', 'TELL', 'APART?'], W / 2, 220, 130, t, 34.0, { hl: { 'APART?': MAG } });
  pill('FASHION', 230, 520, 54, '#ffc83d', seg(t, 36.42, 36.65)); pill('HAIR', W / 2, 600, 54, '#3a7aff', seg(t, 37.5, 37.7)); pill('TATTOOS', 850, 520, 54, MAG, seg(t, 38.66, 38.9));
  if (t > 40.8) bigText('EXPLODES', W / 2, 400, 170, LIME, seg(t, 40.8, 41.05), { glow: LIME });
  if (t > 43.14) stampText('#1 EXPRESSION', W / 2, 1420, 100, '#fff', seg(t, 43.14, 43.4));
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 7.8, 14.9, 20.4, 26.4, 33.8, 99], S = [s1, s2, s3, s4, s5, s6];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 3.0 && t < 3.2 ? .8 : 0) + (t > 13.32 && t < 13.5 ? .7 : 0) + (t > 40.54 && t < 40.7 ? .5 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
