// Seri2 #1 — "What If Oxygen Disappeared for 5 Seconds?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 47.07;
const SUBY = 1540;
const OX = '#ff3b4e', OX2 = '#ff8a95', SKY = '#5fd3ff';

// ---------- yardımcılar ----------
function atom(x, y, r, col, hi = '#fff') { const g = ctx.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r); g.addColorStop(0, hi); g.addColorStop(.35, col); g.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function o2(x, y, s, a, alpha = 1) { ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(a);
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = s * .07; for (const dy of [-s * .09, s * .09]) { ctx.beginPath(); ctx.moveTo(-s * .45, dy); ctx.lineTo(s * .45, dy); ctx.stroke(); }
  atom(-s * .5, 0, s * .42, OX, '#ffd0d5'); atom(s * .5, 0, s * .42, OX, '#ffd0d5');
  txt('O', -s * .5, s * .02, s * .38, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('O', s * .5, s * .02, s * .38, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); ctx.restore(); }
function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function dust(x, y, w, h, k, seed, col) { const R = RN(seed); for (let i = 0; i < 160; i++) { const px = x + R() * w, py = y + R() * h, q = clamp(k * 1.6 - (1 - (py - y) / h) * .6); if (q <= 0) continue;
  ctx.fillStyle = col; ctx.globalAlpha = 1 - q * .9; const s = 6 + R() * 16; ctx.fillRect(px + (R() - .5) * 160 * q, py + q * q * 700 * (.4 + R()), s * (1 - q * .5), s * (1 - q * .5)); } ctx.globalAlpha = 1; }

// ---------- S1 0–4.74: 5 saniye nefes tut ----------
function face(x, y, s, puff, blue) { ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = lerpC('#f2c49a', '#8fb0e8', blue); ctx.beginPath(); ctx.ellipse(0, 0, s * (.5 + .06 * puff), s * .58, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,90,90,.35)'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * s * (.3 + .06 * puff), s * .12, s * (.12 + .08 * puff), 0, TAU); ctx.fill(); }
  ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = s * .04; ctx.lineCap = 'round'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * s * .26, -s * .1); ctx.lineTo(sx * s * .1, -s * .08); ctx.stroke(); }
  ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.ellipse(0, s * .28, s * .06, s * .04, 0, 0, TAU); ctx.fill(); ctx.restore(); }
function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function s1(t) {
  darkGrad('#0b1430', '#03050c');
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 4.7)), t, shake: 3 + 10 * seg(t, 3.2, 3.5) * (1 - seg(t, 3.5, 4.0)) }, () => {
    // havada süzülen O2 molekülleri — 3.26'da patlar
    const pop = seg(t, 3.26, 3.6), R = RN(4);
    for (let i = 0; i < 14; i++) { const x = R() * W, y = (R() * H - t * (40 + R() * 60)) % H; if (pop < 1) o2(x, y < 0 ? y + H : y, 70 + R() * 50, t * (R() - .5) * 2 + i, (1 - pop) * .7); }
    shards(W / 2, 900, seg(t, 3.26, 4.6), 60, 3, R => R > .5 ? OX : '#fff', 18, 900);
    // büyük yüz: nefes tutuyor
    face(W / 2, 1000, 420, .6 + .4 * Math.sin(t * 6) * .2, seg(t, 1.5, 4.7) * .6);
    // geri sayım halkası
    const k = clamp(t / 4.6), sec = Math.max(0, 5 - Math.floor(t)); ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(W / 2, 1000, 330, 0, TAU); ctx.stroke();
    ctx.strokeStyle = SKY; ctx.shadowColor = SKY; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(W / 2, 1000, 330, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - k)); ctx.stroke(); ctx.shadowBlur = 0;
    txt(sec + 's', W / 2 + 270, 720, 130, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: SKY });
  });
  kinetic(['WHAT', 'IF', 'OXYGEN'], W / 2, 230, 140, t, -.3, { gap: .05, hl: { OXYGEN: OX } });
  kinetic(['VANISHED', 'FOR', '5', 'SECONDS?'], W / 2, 390, 110, t, .1, { gap: .05, hl: { '5': SKY, 'SECONDS?': SKY } });
  if (t > 3.26) bigText('NOTHING HAPPENS?', W / 2, 1420, 110, '#fff', seg(t, 3.26, 3.5));
}

// ---------- S2 4.74–8.78: tüm gezegen çöker ----------
function s2(t) {
  space(t, 7, { top: '#100406', bot: '#2a0810' });
  const c = seg(t, 6.84, 8.6);
  cam({ zoom: 1.02 + .1 * seg(t, 4.74, 8.7), t, shake: 4 + 22 * Math.sin(c * Math.PI) }, () => {
    const cx = W / 2, cy = 860, r = 400;
    if (c < .35) earth(cx, cy, r, t, { rot: t * .3 });
    else { // dünya dilimlere ayrılıp uzaklaşır
      for (let i = 0; i < 8; i++) { const a0 = i / 8 * TAU, a1 = a0 + TAU / 8, mid = (a0 + a1) / 2, d = (c - .35) * 260; ctx.save(); ctx.translate(Math.cos(mid) * d, Math.sin(mid) * d); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath(); ctx.clip();
        earth(cx, cy, r, t, { rot: t * .3 }); ctx.fillStyle = 'rgba(255,90,40,.25)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300); g.addColorStop(0, 'rgba(255,220,140,.9)'); g.addColorStop(1, 'rgba(255,80,30,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 300, 0, TAU); ctx.fill(); }
    // çatlak çizgileri
    const ck = seg(t, 5.6, 6.9); if (ck > 0 && c < .4) { ctx.strokeStyle = '#ffb35a'; ctx.lineWidth = 8; ctx.shadowColor = '#ff6a00'; ctx.shadowBlur = 25; const R = RN(6);
      for (let k = 0; k < 8; k++) { let a = k / 8 * TAU, x = cx, y = cy; ctx.beginPath(); ctx.moveTo(x, y); for (let i = 0; i < 9 * ck; i++) { a += (R() - .5) * .5; x += Math.cos(a) * 48; y += Math.sin(a) * 48; ctx.lineTo(x, y); } ctx.stroke(); } ctx.shadowBlur = 0; }
    shards(cx, cy, seg(t, 6.84, 8.7), 80, 9, R => R > .5 ? '#ffb35a' : '#5a3a2a', 22, 1100);
  });
  kinetic(['IN', 'REALITY...'], W / 2, 230, 150, t, 4.74);
  if (t > 6.84) stampText('INSTANT COLLAPSE', W / 2, 1420, 100, OX, seg(t, 6.84, 7.1));
}

// ---------- S3 8.78–13.86: oksijen betonun yapıştırıcısı ----------
const LAT = (() => { const out = []; for (let r = 0; r < 9; r++) for (let c = 0; c < 7; c++) { const x = 140 + c * 135 + (r % 2) * 67, y = 470 + r * 110; out.push([x, y, (r + c) % 2 ? 'O' : (r % 3 ? 'Si' : 'Ca')]); } return out; })();
function s3(t) {
  darkGrad('#1a1a1e', '#07070a');
  const hi = seg(t, 11.16, 11.6), gone = seg(t, 12.62, 13.5);
  cam({ zoom: 1.06 - .04 * seg(t, 8.8, 13.8), rot: Math.sin(t * .6) * .02, t, shake: 2 + 12 * gone }, () => {
    // beton blok kesiti → mikroskop dairesi
    ctx.save(); ctx.beginPath(); ctx.arc(W / 2, 900, 470, 0, TAU); ctx.clip(); ctx.fillStyle = '#2a2a30'; ctx.fillRect(0, 0, W, H);
    // bağlar
    ctx.strokeStyle = `rgba(255,255,255,${.35 * (1 - gone)})`; ctx.lineWidth = 6; LAT.forEach((a, i) => LAT.forEach((b, j) => { if (j <= i) return; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (d < 160 && (a[2] === 'O') !== (b[2] === 'O')) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }));
    LAT.forEach(([x, y, k], i) => { if (k === 'O') { if (gone >= 1) return; const p = 1 + .35 * hi * Math.max(0, Math.sin(t * 10 + i)); ctx.save(); ctx.globalAlpha = 1 - gone; ctx.shadowColor = OX; ctx.shadowBlur = 30 * hi; atom(x, y - gone * 60, 30 * p, OX, '#ffd0d5'); ctx.restore(); }
      else { const fall = gone * gone * (500 + (i % 5) * 120); atom(x + Math.sin(i) * 40 * gone, y + fall, 42, '#9aa2b0', '#eef2f8'); } });
    ctx.restore();
    ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(W / 2, 900, 480, 0, TAU); ctx.stroke();
  });
  kinetic(['OXYGEN', '='], W / 2, 220, 140, t, 8.8, { hl: { OXYGEN: OX } });
  if (t > 11.16) bigText('THE GLUE OF CONCRETE', W / 2, 360, 100, OX2, seg(t, 11.16, 11.45), { glow: OX });
  if (t > 12.62) stampText('NO GLUE', W / 2, 1440, 110, OX, seg(t, 12.62, 12.9));
}

// ---------- S4 13.86–19.78: baraj, köprü, gökdelen toza döner ----------
function dam(x, y, s, k, t) { if (k >= 1) return; ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = '#2a6ac9'; ctx.fillRect(x - s * .9, y - s * .9, s * .55, s * .9); ctx.fillStyle = '#9aa2b0'; ctx.beginPath(); ctx.moveTo(x - s * .4, y - s); ctx.lineTo(x - s * .25, y - s); ctx.lineTo(x + s * .25, y); ctx.lineTo(x - s * .45, y); ctx.fill(); ctx.restore(); }
function bridge(x, y, s, k) { if (k >= 1) return; ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = '#b9c2d0'; ctx.fillRect(x - s, y - s * .35, s * 2, s * .08); ctx.fillRect(x - s * .55, y - s * .9, s * .08, s * .9); ctx.fillRect(x + s * .47, y - s * .9, s * .08, s * .9);
  ctx.strokeStyle = '#b9c2d0'; ctx.lineWidth = 6; for (const px of [-s * .51, s * .51]) for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x + px, y - s * .9); ctx.lineTo(x + px + (px < 0 ? -1 : 1) * i * s * .09 * (i < 6 ? 1 : 0), y - s * .35); ctx.moveTo(x + px, y - s * .9); ctx.lineTo(x + px - (px < 0 ? -1 : 1) * i * s * .09, y - s * .35); ctx.stroke(); } ctx.restore(); }
function tower(x, y, w, h, k, t) { if (k >= 1) return; ctx.save(); ctx.globalAlpha = 1 - k; const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#3a4a6a'); g.addColorStop(1, '#1a2238'); ctx.fillStyle = g; ctx.fillRect(x - w / 2, y - h, w, h); ctx.fillRect(x - 6, y - h - 120, 12, 120);
  ctx.fillStyle = 'rgba(255,220,140,.8)'; for (let yy = y - h + 30; yy < y - 20; yy += 46) for (let xx = x - w / 2 + 18; xx < x + w / 2 - 20; xx += 34) if ((xx * 7 + yy) % 5 > 1) ctx.fillRect(xx, yy, 16, 22); ctx.restore(); }
function s4(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ff9a5a'); g.addColorStop(.55, '#ffd0a0'); g.addColorStop(1, '#3a2a20'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const kd = seg(t, 15.08, 16.0), kb = seg(t, 16.0, 16.9), kt = seg(t, 16.64, 17.9);
  cam({ zoom: 1.04, x: lerp(220, -220, eio(seg(t, 14.2, 17.5))), t, shake: 3 + 18 * Math.max(Math.sin(kd * Math.PI), Math.sin(kb * Math.PI), Math.sin(kt * Math.PI)) }, () => {
    ctx.fillStyle = '#4a3a2a'; ctx.fillRect(-600, 1300, W + 1200, 700);
    dam(-40, 1300, 700, kd, t); dust(-560, 600, 800, 700, kd, 2, '#9aa2b0');
    bridge(560, 1300, 520, kb); dust(40, 830, 1040, 470, kb, 5, '#b9c2d0');
    tower(1180, 1300, 340, 1100, kt, t); dust(1010, 200, 340, 1100, kt, 8, '#3a4a6a');
    if (kd > 0 && kd < 1) { ctx.fillStyle = 'rgba(42,106,201,.8)'; ctx.fillRect(-440, 1300 - 460 * (1 - kd), 900 * kd, 460 * (1 - kd)); }
  });
  // 1 saniye sayacı
  const ms = Math.round(1000 * clamp((t - 13.86) / 1.0)); ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.roundRect(240, 150, 600, 200, 40); ctx.fill(); ctx.restore();
  txt('0.' + String(Math.min(999, ms)).padStart(3, '0') + 's', W / 2, 250, 130, ms >= 1000 ? OX : '#fff', { align: 'center', font: 'Anton', weight: 400, glow: OX });
  pill('DAMS', W / 2, 450, 64, '#5fd3ff', seg(t, 15.08, 15.3)); pill('BRIDGES', W / 2, 560, 64, '#ffc83d', seg(t, 16.0, 16.2)); pill('SKYSCRAPERS', W / 2, 670, 64, '#ff8a3a', seg(t, 16.64, 16.85));
  if (t > 18.62) stampText('DUST', W / 2, 1420, 150, '#fff', seg(t, 18.62, 18.9));
}

// ---------- S5 19.78–27.18: hava basıncı %21 düşer → kulak zarı yırtılır ----------
function ear(x, y, s, burst, t) { ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#e8b48a'; ctx.beginPath(); ctx.moveTo(-s * .2, -s * .6); ctx.bezierCurveTo(s * .5, -s * .9, s * .7, -s * .1, s * .3, s * .3); ctx.bezierCurveTo(s * .2, s * .55, -s * .1, s * .65, -s * .2, s * .4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#b07a58'; ctx.lineWidth = s * .05; ctx.beginPath(); ctx.moveTo(-s * .05, -s * .45); ctx.bezierCurveTo(s * .35, -s * .6, s * .45, -s * .1, s * .15, s * .15); ctx.stroke();
  // kulak kanalı + zar
  ctx.fillStyle = '#5a2a20'; ctx.beginPath(); ctx.ellipse(-s * .05, 0, s * .12, s * .08, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#7a3a30'; ctx.fillRect(-s * .7, -s * .06, s * .65, s * .12);
  const bulge = 1 + .5 * clamp(burst * 2); ctx.strokeStyle = burst > .5 ? OX : '#ffd0c0'; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.ellipse(-s * .72, 0, s * .03 * bulge * 2, s * .14, 0, 0, TAU); ctx.stroke();
  if (burst > .5) { ctx.strokeStyle = OX; ctx.lineWidth = s * .015; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ctx.beginPath(); ctx.moveTo(-s * .72, 0); ctx.lineTo(-s * .72 + Math.cos(a) * s * .2 * (burst - .5) * 2, Math.sin(a) * s * .2 * (burst - .5) * 2); ctx.stroke(); } }
  ctx.restore(); }
function s5(t) {
  bgFinance(t, { tint: 'rgba(95,211,255,.2)', seed: 5, dot: '120,200,255' });
  const earT = t > 24.2;
  cam({ zoom: 1.03, t, shake: earT ? 4 + 18 * seg(t, 24.6, 25.2) * (1 - seg(t, 25.2, 26.2)) : 2 }, () => {
    if (!earT) {
      donut(W / 2, 780, 320, [{ v: 78, col: '#3d7cff', label: 'N₂ 78%' }, { v: 21 * (1 - seg(t, 22.8, 23.6)) + .01, col: OX, label: 'O₂ 21%' }, { v: 1, col: '#9aa2b0', label: '' }], seg(t, 19.9, 21.4), { holeCol: '#0c1424', labels: false });
      txt('N2 78%', W / 2 - 120, 1150, 64, '#9ec0ff', { align: 'center', font: 'Anton', weight: 400 }); txt('O2 21%', W / 2 + 150, 1150, 64, seg(t, 22.8, 23.6) > .5 ? 'rgba(255,59,78,.3)' : OX, { align: 'center', font: 'Anton', weight: 400 });
      const pr = Math.round(lerp(1013, 800, eo(seg(t, 22.8, 23.8)))); txt(pr + ' hPa', W / 2, 780, 96, '#fff', { align: 'center', font: 'Anton', weight: 400 });
      if (t > 22.8) stampText('-21% PRESSURE', W / 2, 1320, 90, OX, seg(t, 22.8, 23.1));
    } else { ear(W / 2 + 80, 900, 900, seg(t, 24.68, 25.4), t); for (let i = 0; i < 3; i++) ring2(W / 2 - 560, 900, seg(t, 24.68 + i * .2, 25.8 + i * .2), 700, OX, 16); }
  });
  if (!earT) kinetic(['AIR', 'PRESSURE'], W / 2, 220, 150, t, 21.66, { hl: { PRESSURE: SKY } });
  else { kinetic(['EVERY', 'EARDRUM'], W / 2, 220, 150, t, 25.2, { hl: { EARDRUM: OX } }); if (t > 24.68) bigText('RUPTURED', W / 2, 1430, 130, OX, seg(t, 24.68, 25.0), { glow: OX }); }
}

// ---------- S6 27.18–33.34: motorlar durur, uçaklar düşer ----------
function plane(x, y, s, a, eng) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#eef2f8';
  ctx.beginPath(); ctx.ellipse(0, 0, s * .5, s * .07, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .05, 0); ctx.lineTo(-s * .2, s * .38); ctx.lineTo(-s * .05, s * .38); ctx.lineTo(s * .12, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-s * .05, 0); ctx.lineTo(-s * .2, -s * .38); ctx.lineTo(-s * .05, -s * .38); ctx.lineTo(s * .12, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .38, 0); ctx.lineTo(-s * .5, -s * .16); ctx.lineTo(-s * .44, 0); ctx.fill();
  ctx.fillStyle = '#3da5ff'; for (let i = 0; i < 6; i++) ctx.fillRect(-s * .3 + i * s * .1, -s * .02, s * .04, s * .03);
  if (eng > 0) { ctx.fillStyle = `rgba(255,170,60,${eng})`; for (const dy of [-s * .2, s * .2]) { ctx.beginPath(); ctx.ellipse(-s * .16, dy, s * .08 * eng, s * .03, 0, 0, TAU); ctx.fill(); } }
  ctx.restore(); }
function s6(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a6ac9'); g.addColorStop(1, '#bfe4ff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const st = seg(t, 29.08, 29.5), fall = seg(t, 30.2, 33.3);
  // motor pistonu yakın plan (27.18–29.6)
  if (t < 29.7) { darkGrad('#1a1a22', '#05050a'); cam({ zoom: 1.03, t, shake: 2 + 10 * st }, () => {
      const sp = 1 - st, ph = (t * 14 * sp) + 29.08 * 14 * st; const py = 780 + Math.sin(ph) * 150 * (1 - st * .9);
      ctx.fillStyle = '#4a5260'; ctx.fillRect(W / 2 - 230, 420, 460, 760); ctx.fillStyle = '#2a2e36'; ctx.fillRect(W / 2 - 190, 460, 380, 680);
      const fl = sp * Math.max(0, Math.sin(ph)); if (fl > .1) { const fg = ctx.createRadialGradient(W / 2, 520, 10, W / 2, 520, 220); fg.addColorStop(0, `rgba(255,240,160,${fl})`); fg.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = fg; ctx.fillRect(W / 2 - 190, 460, 380, 300); }
      ctx.fillStyle = '#c9d2de'; ctx.fillRect(W / 2 - 180, py, 360, 160); ctx.fillStyle = '#9aa2b0'; ctx.fillRect(W / 2 - 30, py + 160, 60, 380);
      if (st > 0) stampText('STALL', W / 2, 1340, 150, OX, st); });
    kinetic(['COMBUSTION', 'ENGINES'], W / 2, 230, 120, t, 27.4, { hl: { ENGINES: '#ffb35a' } }); return; }
  cam({ zoom: 1.03 + .08 * fall, t, shake: 3 + 6 * fall }, () => {
    ctx.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 6; i++) { const x = ((i * 260 - t * 40) % 1400 + 1400) % 1400 - 200, y = 300 + i * 220; ctx.beginPath(); ctx.ellipse(x, y, 160, 46, 0, 0, TAU); ctx.ellipse(x + 80, y - 30, 100, 50, 0, 0, TAU); ctx.fill(); }
    for (let i = 0; i < 5; i++) { const x0 = 150 + i * 200, y0 = 300 + (i % 2) * 180, q = clamp(fall * 1.3 - i * .08), a = .2 + q * (1.2 + i * .1), x = x0 + q * 200, y = y0 + q * q * 1500;
      // duman izi
      ctx.strokeStyle = 'rgba(60,60,70,.55)'; ctx.lineWidth = 26 * q; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + q * 100, y0, x - Math.cos(a) * 80, y - Math.sin(a) * 80); ctx.stroke();
      plane(x, y, 260, a, 0); }
  });
  kinetic(['PLANES', 'FALL'], W / 2, 230, 170, t, 30.5, { hl: { FALL: OX } });
}

// ---------- S7 33.34–39.78: ozon yok → UV yanığı ----------
function s7(t) {
  const beach = t > 35.8;
  if (!beach) { space(t, 12); cam({ zoom: 1.03, t, shake: 2 }, () => {
      const oz = 1 - seg(t, 33.56, 34.4); ctx.strokeStyle = `rgba(95,211,255,${.8 * oz})`; ctx.lineWidth = 40; ctx.shadowColor = SKY; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(W / 2, 1000, 470, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
      if (oz < 1) shards(W / 2, 1000, seg(t, 33.56, 35.0), 70, 4, SKY, 14, 600);
      earth(W / 2, 1000, 400, t, { rot: t * .3, light: Math.PI * 1.2 });
      // UV ışınları
      for (let k = 0; k < 7; k++) { const q = ((t * 1.4 + k / 7) % 1), x0 = 120 + k * 140; ctx.save(); ctx.strokeStyle = `rgba(200,90,255,${Math.sin(q * Math.PI) * (1 - oz * .8)})`; ctx.lineWidth = 8; ctx.shadowColor = '#c85aff'; ctx.shadowBlur = 20; ctx.beginPath();
        for (let y = 0; y < 600 * q; y += 20) ctx.lineTo(x0 + Math.sin(y * .06 + t * 10) * 18, y); ctx.stroke(); ctx.restore(); } });
    kinetic(['NO', 'OZONE'], W / 2, 230, 170, t, 33.4, { hl: { OZONE: SKY } }); if (t > 34.42) bigText('ULTRAVIOLET RAYS', W / 2, 1440, 110, '#d88aff', seg(t, 34.42, 34.7), { glow: '#c85aff' }); return; }
  const burn = seg(t, 37.26, 38.6);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#b06aff'); g.addColorStop(.6, '#ffd0a0'); g.addColorStop(1, '#e8c890'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04, t, shake: 2 + 6 * burn }, () => {
    const sun = ctx.createRadialGradient(W / 2, 260, 20, W / 2, 260, 380); sun.addColorStop(0, '#fff'); sun.addColorStop(.3, '#ffe08a'); sun.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(W / 2, 260, 380, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e8c890'; ctx.fillRect(-300, 1150, W + 600, 900);
    for (let i = 0; i < 4; i++) { const x = 180 + i * 240, s = 300; ctx.save(); ctx.translate(x, 1360); ctx.fillStyle = lerpC('#f2c49a', '#e2382e', burn * (1 - i * .08)); ctx.beginPath(); ctx.arc(0, -s * .88, s * .12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .17, -s * .74, s * .34, s * .44, s * .1); ctx.fill(); ctx.fillRect(-s * .14, -s * .32, s * .1, s * .32); ctx.fillRect(s * .04, -s * .32, s * .1, s * .32);
      ctx.fillStyle = ['#3da5ff', '#ff3b8a', '#22e07a', '#ffc83d'][i]; ctx.fillRect(-s * .17, -s * .4, s * .34, s * .12); ctx.restore();
      if (burn > 0) for (let k = 0; k < 3; k++) { const q = ((t * 1.2 + k / 3 + i * .2) % 1); ctx.strokeStyle = `rgba(255,120,60,${.6 * (1 - q)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 30 + k * 30, 1040 - q * 120); ctx.quadraticCurveTo(x + k * 30, 1000 - q * 160, x - 20 + k * 30, 960 - q * 200); ctx.stroke(); } }
    for (let k = 0; k < 9; k++) { const q = ((t * 1.6 + k / 9) % 1), x0 = 60 + k * 120; ctx.save(); ctx.strokeStyle = `rgba(180,70,255,${Math.sin(q * Math.PI) * .9})`; ctx.lineWidth = 7; ctx.beginPath(); for (let y = 300; y < 300 + 800 * q; y += 20) ctx.lineTo(x0 + Math.sin(y * .05 + t * 10) * 16, y); ctx.stroke(); ctx.restore(); }
  });
  ctx.save(); ctx.fillStyle = 'rgba(40,0,60,.7)'; ctx.beginPath(); ctx.roundRect(260, 520, 560, 180, 40); ctx.fill(); ctx.restore(); txt('UV INDEX ' + Math.round(lerp(5, 40, eo(seg(t, 36.0, 37.6)))), W / 2, 610, 90, '#e0a0ff', { align: 'center', font: 'Anton', weight: 400, glow: '#c85aff' });
  if (t > 37.26) stampText('SEVERE SUNBURN', W / 2, 1440, 100, OX, seg(t, 37.26, 37.55));
}

// ---------- S8 39.78–47.07: kabuk %45 oksijen → zemin parçalanır, serbest düşüş ----------
function s8(t) {
  const sh = seg(t, 44.76, 45.4), ff = seg(t, 45.42, 47.0);
  if (t < 43.4) { darkGrad('#2a1408', '#0a0402'); cam({ zoom: 1.03, t, shake: 2 }, () => {
      // yer kabuğu katmanları + %45 donut
      for (let i = 0; i < 5; i++) { ctx.fillStyle = ['#6a4a2a', '#5a3a20', '#4a2e18', '#3a2412', '#2a1a0c'][i]; ctx.fillRect(0, 1200 + i * 130, W, 130); }
      donut(W / 2, 760, 330, [{ v: 45, col: OX }, { v: 28, col: '#9aa2b0' }, { v: 8, col: '#c9a77a' }, { v: 5, col: '#7a4a2a' }, { v: 14, col: '#4a5260' }], seg(t, 40.8, 42.4), { holeCol: '#1e0e06' });
      counter(0, 45, W / 2, 760, 170, seg(t, 41.42, 42.3), { fmt: v => Math.round(v) + '%', col: OX });
      txt('OXYGEN', W / 2, 870, 54, '#fff', { align: 'center', stroke: 8 }); });
    kinetic(['WORST', 'OF', 'ALL...'], W / 2, 220, 130, t, 39.8); if (t > 40.76) bigText("EARTH'S CRUST", W / 2, 1420, 120, '#ffc83d', seg(t, 40.76, 41.0)); return; }
  // zemin parçalanır, insan boşluğa düşer
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffb07a'); g.addColorStop(1, '#2a0a06'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.04 + .25 * ff, t, shake: 4 + 26 * Math.sin(sh * Math.PI) }, () => {
    // altında karanlık uçurum
    const vg = ctx.createRadialGradient(W / 2, 1500, 50, W / 2, 1500, 900); vg.addColorStop(0, '#000'); vg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = vg; ctx.globalAlpha = sh; ctx.fillRect(0, 900, W, 1100); ctx.globalAlpha = 1;
    // zemin parçaları
    const R = RN(5); for (let i = 0; i < 12; i++) { const x = i * 95, w = 95, q = clamp(sh * 1.4 - R() * .4), dy = q * q * 900 * (.5 + R()), rot = q * (R() - .5) * 1.6;
      ctx.save(); ctx.translate(x + w / 2, 1150 + dy); ctx.rotate(rot); ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-w / 2, 0, w - 4, 90); ctx.fillStyle = '#3a7a3a'; ctx.fillRect(-w / 2, 0, w - 4, 16); ctx.restore(); }
    // düşen insan
    const hy = 1150 + ff * ff * 900; ctx.save(); ctx.translate(W / 2, hy); ctx.rotate(ff * 2.5); ctx.translate(-W / 2, -hy); ctx.save(); ctx.shadowColor = '#fff'; ctx.shadowBlur = 20; human(W / 2, hy, 300); ctx.restore(); ctx.restore();
    // hız çizgileri
    if (ff > 0) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 4; for (let i = 0; i < 20; i++) { const x = (i * 97) % W, y = ((i * 211 - t * 2400) % H + H) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 160); ctx.stroke(); } }
  });
  kinetic(['THE', 'GROUND', 'SHATTERS'], W / 2, 230, 130, t, 43.6, { hl: { SHATTERS: OX } });
  if (t > 45.42) stampText('FREEFALL', W / 2, 1420, 150, '#fff', seg(t, 45.42, 45.7));
  flash(t, 44.76, .2, '255,200,160');
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 4.74, 8.78, 13.86, 19.78, 27.18, 33.34, 39.78, 99], S = [s1, s2, s3, s4, s5, s6, s7, s8];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 6.84 && t < 7.05 ? .9 : 0) + (t > 24.68 && t < 24.9 ? .8 : 0) + (t > 44.76 && t < 45.0 ? 1 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
