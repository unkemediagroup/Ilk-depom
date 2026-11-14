// 2.video — "What If the Earth Stopped Spinning?" — 1080×1920, 30 fps, kodla çizim.
window.DUR = 37.56;
const SUBY = 1540;

// ---------- S1 0–3.0: hızla dönen dünya FREN yapar ----------
function spinRate(t) { return t < 1.38 ? 3.2 : 3.2 * Math.exp(-(t - 1.38) * 9); }
function spinAngle(t) { return t < 1.38 ? t * 3.2 : 1.38 * 3.2 + 3.2 * (1 - Math.exp(-(t - 1.38) * 9)) / 9; }
function s1(t) {
  space(t, 2, { drift: 40 });
  const stop = seg(t, 1.38, 1.6);
  cam({ zoom: 1.12 - .1 * eo(seg(t, 0, 1.4)) + .06 * Math.sin(stop * Math.PI), t, shake: t > 1.38 && t < 2.2 ? 26 * (1 - seg(t, 1.38, 2.2)) : 4 }, () => {
    const cx = W / 2, cy = 700, r = 420;
    // dönüş hız çizgileri
    const sp = spinRate(t) / 3.2; ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = `rgba(140,210,255,${.5 * sp})`; ctx.lineCap = 'round';
    for (let i = 0; i < 14; i++) { const a0 = i / 14 * TAU + t * 4, rr = r * (1.12 + (i % 4) * .07); ctx.lineWidth = 8 - (i % 4); ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * .3, -.35, a0, a0 + 1.2 * sp); ctx.stroke(); }
    ctx.restore();
    earth(cx, cy, r, t, { rot: spinAngle(t) });
    // fren kıvılcımları
    if (stop > 0) { shards(cx + r * .9, cy + 80, seg(t, 1.38, 2.6), 60, 5, R => R > .5 ? '#ffd36b' : '#ff6a2e', 14, 900); ring2(cx, cy, seg(t, 1.38, 2.2), 1000, '#ff6a2e', 26); }
  });
  kinetic(['WHAT', 'IF', 'THE', 'EARTH'], W / 2, 1230, 150, t, 0, { gap: .06 });
  kinetic(['STOPPED', 'SPINNING?'], W / 2, 1390, 160, t, 1.35, { hl: { STOPPED: C.red } });
  flash(t, 1.38, .25, '255,160,90');
}

// ---------- S2 3.0–4.86: hız göstergesi 1,040 → 0 ----------
function gauge(cx, cy, r, v, vmax, t) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.fillStyle = '#0d1426'; ctx.beginPath(); ctx.arc(0, 0, r * 1.08, 0, TAU); ctx.fill();
  ctx.lineWidth = r * .1; const a0 = Math.PI * .75, a1 = Math.PI * 2.25;
  ctx.strokeStyle = '#1d2a48'; ctx.beginPath(); ctx.arc(0, 0, r * .9, a0, a1); ctx.stroke();
  const g = ctx.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, C.green); g.addColorStop(.6, C.gold); g.addColorStop(1, C.red);
  ctx.strokeStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * .9, a0, a0 + (a1 - a0) * v / vmax); ctx.stroke();
  for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * i / 10; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .72, Math.sin(a) * r * .72); ctx.lineTo(Math.cos(a) * r * .8, Math.sin(a) * r * .8); ctx.stroke(); }
  const na = a0 + (a1 - a0) * v / vmax + Math.sin(t * 60) * .01; ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(na) * r * .78, Math.sin(na) * r * .78); ctx.stroke();
  ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.arc(0, 0, r * .1, 0, TAU); ctx.fill();
  ctx.restore();
}
function s2(t) {
  bgFinance(t, { tint: 'rgba(255,59,78,.2)', seed: 3, dot: '255,140,140' });
  const k = eio(seg(t, 3.1, 4.3)), v = 1040 * (1 - k);
  cam({ zoom: 1 + .08 * seg(t, 3, 4.86), t, shake: 8 * (1 - k) }, () => {
    gauge(W / 2, 820, 400, v, 1100, t);
    txt(Math.round(v).toLocaleString('en-US'), W / 2, 1000, 170, '#fff', { align: 'center', font: 'Anton', weight: 400 });
    txt('MPH', W / 2, 1120, 60, C.mute, { align: 'center', stroke: 0 });
  });
  kinetic(['ROTATION'], W / 2, 220, 150, t, 3.25);
  if (t > 4.3) stampText('HALTED', W / 2, 1360, 150, C.red, seg(t, 4.3, 4.6));
}

// ---------- S3 4.86–12.1: civatalı olmayan her şey fırlar ----------
function tree(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#5a3a22'; ctx.fillRect(-s * .06, -s * .5, s * .12, s * .5); ctx.fillStyle = '#2f8f4a'; for (const [a, b, r] of [[0, -.7, .32], [-.22, -.55, .24], [.22, -.55, .24]]) { ctx.beginPath(); ctx.arc(a * s, b * s, r * s, 0, TAU); ctx.fill(); } ctx.restore(); }
function car(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .32, s, s * .22, 10); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .3, -s * .5, s * .55, s * .22, 14); ctx.fill(); ctx.fillStyle = '#9fd4ff'; ctx.fillRect(-s * .22, -s * .45, s * .18, s * .12); ctx.fillRect(s * .02, -s * .45, s * .16, s * .12); ctx.fillStyle = '#111'; for (const sx of [-.3, .3]) { ctx.beginPath(); ctx.arc(sx * s, -s * .1, s * .1, 0, TAU); ctx.fill(); } ctx.restore(); }
function bolt(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#c9d2de'; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s); } ctx.fill(); ctx.fillStyle = '#7b8798'; ctx.beginPath(); ctx.arc(0, 0, s * .45, 0, TAU); ctx.fill(); ctx.restore(); }
function s3(t) {
  const go = seg(t, 8.32, 9.3), fly = t > 8.32 ? (t - 8.32) : 0, vfly = ei(clamp(fly / 1.2)) * 1 + Math.max(0, fly - 1.2) * 1;
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#5fa8ff'); sky.addColorStop(1, '#d6ecff'); ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, H + 600);
  // bulutlar sağa kayar
  ctx.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 6; i++) { const x = ((i * 260 + t * 30 + vfly * 2600) % 1600) - 260, y = 180 + i * 90; ctx.beginPath(); ctx.ellipse(x, y, 130, 40, 0, 0, TAU); ctx.ellipse(x + 70, y - 25, 80, 40, 0, 0, TAU); ctx.fill(); }
  cam({ zoom: 1.04, t, shake: 3 + 22 * go, rot: -.03 * go }, () => {
    const gy = 1300;
    ctx.fillStyle = '#3b6b33'; ctx.fillRect(-300, gy, W + 600, 900); ctx.fillStyle = '#2a2f3a'; ctx.fillRect(-300, gy + 60, W + 600, 90);
    ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 8; ctx.setLineDash([50, 40]); ctx.beginPath(); ctx.moveTo(-300, gy + 105); ctx.lineTo(W + 300, gy + 105); ctx.stroke(); ctx.setLineDash([]);
    // okyanus kenarı (solda) sağa doğru dalga olarak fırlar
    const ow = 280 + 1400 * eo(seg(t, 8.6, 11.5));
    ctx.fillStyle = '#1f73c9'; ctx.beginPath(); ctx.moveTo(-300, gy + 400); ctx.lineTo(-300, gy - 40 - 300 * go); ctx.quadraticCurveTo(ow * .6, gy - 380 * go - 60, ow, gy + 20); ctx.lineTo(ow, gy + 400); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-300, gy - 40 - 300 * go); ctx.quadraticCurveTo(ow * .6, gy - 380 * go - 60, ow, gy + 20); ctx.stroke();
    const items = [[300, 'b', 340, '#2b3550'], [520, 't', 260], [700, 'c', 210, '#ff3b4e'], [860, 'b', 460, '#3a2f50'], [1010, 't', 240], [440, 'c', 200, '#3da5ff']];
    items.forEach(([x0, k, s, col], i) => {
      const tr = t < 8.32 ? Math.sin(t * 40 + i) * 3 * seg(t, 5.0, 8.2) : 0, d = vfly * (1800 + i * 300), lift = Math.max(0, vfly) * (180 + i * 60), rot = vfly * (1.5 + i * .4);
      ctx.save(); ctx.translate(x0 + d + tr, gy - lift); ctx.rotate(rot);
      if (k === 'b') { ctx.fillStyle = col; ctx.fillRect(-s * .22, -s, s * .44, s); ctx.fillStyle = 'rgba(255,220,140,.8)'; for (let yy = -s + 20; yy < -20; yy += 40) for (let xx = -s * .22 + 14; xx < s * .2; xx += 34) ctx.fillRect(xx, yy, 16, 20); }
      else if (k === 't') tree(0, 0, s, t); else car(0, 0, s, col);
      ctx.restore();
      if (t < 8.32 && t > 5.44) bolt(x0 + tr, gy + 30, 22 * eback(seg(t, 5.44 + i * .05, 5.8 + i * .05)) * (1 - seg(t, 8.1, 8.32)));
    });
    // fırlatılan civatalar
    if (t > 8.32) shards(700, gy, seg(t, 8.32, 9.5), 30, 9, '#c9d2de', 14, 800);
  });
  motionStreak(go * 1.2);
  // hız sayacı
  if (t > 9.4) { const v = Math.round(1000 * eo(seg(t, 9.5, 10.9))); ctx.save(); ctx.globalAlpha = seg(t, 9.4, 9.6);
    ctx.fillStyle = 'rgba(10,14,30,.75)'; ctx.beginPath(); ctx.roundRect(110, 230, 860, 300, 50); ctx.fill();
    txt((v >= 1000 ? '1,000+' : v.toLocaleString('en-US')), W / 2, 350, 180, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold });
    txt('MILES PER HOUR', W / 2, 470, 56, '#fff', { align: 'center', stroke: 8 }); ctx.restore(); }
  else { kinetic(['NOT', 'BOLTED', 'DOWN'], W / 2, 330, 140, t, 4.9, { hl: { BOLTED: C.red } }); }
  bigText('BUILDINGS', 300, 640, 100, '#fff', seg(t, 6.58, 6.8) * (1 - seg(t, 8.2, 8.4)), { maxW: 520 });
  bigText('OCEANS', 780, 760, 110, '#5fd3ff', seg(t, 7.34, 7.56) * (1 - seg(t, 8.2, 8.4)), { maxW: 520 });
}

// ---------- S4 12.1–16.7: küresel şok dalgası ----------
function s4(t) {
  space(t, 7, { top: '#140308', bot: '#2a0a10' });
  const cx = W / 2, cy = 860, r = 430;
  cam({ zoom: 1 + .08 * seg(t, 12.1, 16.7), t, shake: 6 + 14 * seg(t, 13.6, 14.4) * (1 - seg(t, 15.8, 16.7)) }, () => {
    earth(cx, cy, r, t, { rot: 1.3, land: '#6b5a3a' });
    // yüzeyde ilerleyen kırmızı şok cephesi (meridyen yayı)
    const p = (seg(t, 12.6, 15.2));
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
    for (let k = 0; k < 3; k++) { const q = clamp(p * 1.2 - k * .15); if (q <= 0 || q >= 1) continue; const xx = Math.cos(Math.PI * (1 - q)) * r;
      ctx.strokeStyle = `rgba(255,${120 - k * 40},60,${.9 - k * .25})`; ctx.lineWidth = 40 - k * 10; ctx.shadowColor = '#ff4d2e'; ctx.shadowBlur = 40;
      ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(xx) + 4, r, 0, xx < 0 ? Math.PI / 2 : -Math.PI / 2, xx < 0 ? Math.PI * 1.5 : Math.PI / 2); ctx.stroke(); }
    // arkasında yanmış iz
    const burn = ctx.createLinearGradient(cx - r, 0, cx - r + 2 * r * p, 0); burn.addColorStop(0, 'rgba(60,10,5,.75)'); burn.addColorStop(1, 'rgba(255,90,40,.35)'); ctx.fillStyle = burn; ctx.fillRect(cx - r, cy - r, 2 * r * p, 2 * r);
    ctx.restore();
    for (let i = 0; i < 4; i++) ring2(cx, cy, seg(t, 12.6 + i * .6, 13.9 + i * .6), 1100, 'rgba(255,90,60,.9)', 18);
    // çatlaklar — devastation
    const ck = seg(t, 15.44, 15.9); if (ck > 0) { const R = RN(4); ctx.strokeStyle = '#ffb35a'; ctx.lineWidth = 7; ctx.shadowColor = '#ff6a00'; ctx.shadowBlur = 25;
      for (let k = 0; k < 7; k++) { let a = R() * TAU, x = cx, y = cy; ctx.beginPath(); ctx.moveTo(x, y); for (let i = 0; i < 8 * ck; i++) { a += (R() - .5) * .8; x += Math.cos(a) * 60; y += Math.sin(a) * 60; ctx.lineTo(x, y); } ctx.stroke(); } ctx.shadowBlur = 0; }
  });
  kinetic(['GLOBAL'], W / 2, 210, 130, t, 13.2, { col: '#fff' });
  kinetic(['SHOCKWAVE'], W / 2, 360, 190, t, 13.7, { hl: { SHOCKWAVE: C.red } });
  if (t > 15.44) stampText('DEVASTATION', W / 2, 1400, 120, C.red, seg(t, 15.44, 15.75));
}

// ---------- S5 16.74–24.0: sonsuz gündüz / sonsuz gece ----------
function s5(t) {
  const pan = eio(seg(t, 20.1, 21.0));                           // 0: gündüz yüzü, 1: gece yüzü
  space(t, 12, { drift: 0 });
  cam({ x: lerp(160, -160, pan), zoom: 1.0 + .06 * Math.sin(t * .7), t, shake: 3 }, () => {
    const cx = W / 2, cy = 860, r = 420;
    // güneş solda
    const sx = cx - 760, sg = ctx.createRadialGradient(sx, cy, 50, sx, cy, 700); sg.addColorStop(0, '#fff6c8'); sg.addColorStop(.25, '#ffb12e'); sg.addColorStop(1, 'rgba(255,90,20,0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, cy, 700, 0, TAU); ctx.fill();
    earth(cx, cy, r, t, { rot: 1.0, shade: false });
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
    // gündüz yarısı kavrulur
    const hot = seg(t, 18.14, 19.8); ctx.fillStyle = `rgba(255,110,30,${.55 * hot})`; ctx.fillRect(cx - r, cy - r, r, 2 * r);
    for (let i = 0; i < 10; i++) { const yy = cy - r + i * r * .2 + Math.sin(t * 3 + i) * 10; ctx.strokeStyle = `rgba(255,220,150,${.25 * hot})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx - r, yy); for (let x = cx - r; x < cx; x += 30) ctx.lineTo(x, yy + Math.sin(x * .05 + t * 8) * 10); ctx.stroke(); }
    // gece yarısı donar
    const ice = seg(t, 22.0, 23.4); ctx.fillStyle = 'rgba(0,0,15,.85)'; ctx.fillRect(cx, cy - r, r, 2 * r);
    ctx.fillStyle = `rgba(190,230,255,${.55 * ice})`; ctx.beginPath(); ctx.arc(cx + r, cy, r * 1.05 * ice, 0, TAU); ctx.fill();
    const R = RN(6); ctx.strokeStyle = `rgba(230,250,255,${.8 * ice})`; ctx.lineWidth = 4; for (let i = 0; i < 26; i++) { const a = R() * TAU, x = cx + r * .2 + R() * r * .8, y = cy + (R() - .5) * r * 1.8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 60 * ice, y + Math.sin(a) * 60 * ice); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.setLineDash([20, 16]); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy - r - 80); ctx.lineTo(cx, cy + r + 80); ctx.stroke(); ctx.setLineDash([]);
  });
  const hotT = Math.round(120 * eo(seg(t, 18.14, 19.6))), coldT = -Math.round(150 * eo(seg(t, 22.0, 23.2)));
  if (pan < .5) { ctx.save(); ctx.globalAlpha = 1 - pan * 2; if (t > 18.1) txt('+' + hotT + '°C', W / 2, 1360, 190, '#ffcf6b', { align: 'center', font: 'Anton', weight: 400, glow: '#ff6a00' });
    kinetic(['PERPETUAL'], W / 2, 210, 120, t, 18.9); kinetic(['SUNLIGHT'], W / 2, 350, 160, t, 19.3, { hl: { SUNLIGHT: C.gold } }); ctx.restore(); }
  else { ctx.save(); ctx.globalAlpha = pan * 2 - 1; if (t > 22.0) txt(coldT + '°C', W / 2, 1360, 190, '#bfe6ff', { align: 'center', font: 'Anton', weight: 400, glow: '#3da5ff' });
    kinetic(['ETERNAL'], W / 2, 210, 120, t, 22.5); kinetic(['NIGHT'], W / 2, 350, 170, t, 22.9, { hl: { NIGHT: '#7fd0ff' } }); ctx.restore(); }
  if (t < 18.0) bigText('HALF THE PLANET', W / 2, 300, 120, '#fff', seg(t, 16.8, 17.1));
}

// ---------- S6 24.0–27.5: atmosfer soyulur, yaşam silinir ----------
function lifeIcon(i, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#fff';
  if (i === 0) tree(0, s * .45, s, 0); else if (i === 1) { ctx.fillStyle = '#ffb35a'; ctx.beginPath(); ctx.ellipse(0, 0, s * .4, s * .22, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(s * .35, 0); ctx.lineTo(s * .6, -s * .2); ctx.lineTo(s * .6, s * .2); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-s * .22, -s * .05, s * .05, 0, TAU); ctx.fill(); }
  else if (i === 2) { ctx.fillStyle = '#e8d5b5'; human(0, s * .5, s); } else { ctx.fillStyle = '#9b6bff'; ctx.beginPath(); ctx.ellipse(0, 0, s * .2, s * .32, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 6; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * s * .25, -s * .05, s * .22, s * .14, sx * .5, 0, TAU); ctx.stroke(); } }
  ctx.restore(); }
function s6(t) {
  space(t, 18);
  const cx = W / 2, cy = 760, r = 380, strip = seg(t, 24.3, 26.0);
  cam({ zoom: 1.05, t, shake: 5 }, () => {
    // atmosfer katmanı yırtılıp uzaya savrulur
    const R = RN(3);
    for (let i = 0; i < 220; i++) { const a = R() * TAU, d0 = r * (1.03 + R() * .14), q = clamp(strip * 1.3 - R() * .3), d = d0 + q * (300 + R() * 700);
      ctx.fillStyle = `rgba(110,190,255,${(1 - q) * .7})`; ctx.beginPath(); ctx.arc(cx + Math.cos(a + q * .6) * d, cy + Math.sin(a + q * .6) * d, 6 + R() * 8, 0, TAU); ctx.fill(); }
    earth(cx, cy, r, t, { rot: 1.8, sea0: lerp(0, 1, strip) > .5 ? '#5c4a3a' : '#2f8ee8', sea1: strip > .5 ? '#2a1d14' : '#0a2f6e', land: strip > .5 ? '#3a2a20' : undefined });
  });
  bigText('ATMOSPHERE', W / 2, 200, 140, '#7fd0ff', seg(t, 25.14, 25.4) * (1 - seg(t, 25.9, 26.1)));
  // yaşam ikonları silinir
  ['', '', '', ''].forEach((_, i) => { const x = 180 + i * 240, y = 1300, p = seg(t, 25.94 + i * .12, 26.3 + i * .12);
    ctx.save(); ctx.globalAlpha = seg(t, 24.0, 24.4) * (1 - .6 * p); ctx.fillStyle = 'rgba(235,242,255,.92)'; ctx.beginPath(); ctx.arc(x, y, 105, 0, TAU); ctx.fill(); lifeIcon(i, x, y, 150); ctx.restore(); stampX(x, y, 140, p); });
  if (t > 26.5) bigText('LIFE AS WE KNOW IT', W / 2, 220, 110, C.red, seg(t, 26.5, 26.8), { glow: C.red });
}

// ---------- S7 27.5–32.0: kilitli, çatlak dünya — hayatta kalan var mı? ----------
function microbe(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2) * .1);
  ctx.fillStyle = '#c9b48a'; ctx.beginPath(); ctx.ellipse(0, 0, s, s * .55, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(120,90,50,.6)'; ctx.lineWidth = 6; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(i * s * .22, 0, s * .08, s * .5, 0, 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = s * .14; ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { const xx = -s * .6 + i * s * .4, k = Math.sin(t * 8 + i) * s * .1; ctx.beginPath(); ctx.moveTo(xx, s * .4); ctx.lineTo(xx + k, s * .78); ctx.stroke(); }
  ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(s * .85, -s * .1, s * .07, 0, TAU); ctx.fill(); ctx.restore(); }
function padlock(x, y, s, p) { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y - (1 - e) * 200); ctx.globalAlpha = clamp(p * 3);
  ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.arc(0, -s * .2, s * .32, Math.PI, 0); ctx.lineTo(s * .32, s * .1); ctx.moveTo(-s * .32, -s * .2); ctx.lineTo(-s * .32, s * .1); ctx.stroke();
  ctx.fillStyle = C.gold; ctx.beginPath(); ctx.roundRect(-s * .5, 0, s, s * .72, s * .1); ctx.fill(); ctx.fillStyle = '#5a3d00'; ctx.beginPath(); ctx.arc(0, s * .3, s * .1, 0, TAU); ctx.fill(); ctx.fillRect(-s * .04, s * .3, s * .08, s * .2); ctx.restore(); }
function s7(t) {
  space(t, 21, { top: '#04040a', bot: '#1a0d12' });
  cam({ zoom: 1.1 - .08 * seg(t, 27.5, 32), t, shake: 3 }, () => {
    const cx = W / 2, cy = 1900, r = 1250;
    earth(cx, cy, r, t, { rot: 2.4, sea0: '#5c4a3a', sea1: '#2a1d14', land: '#3a2a20', dark: .5 });
    const R = RN(12); ctx.strokeStyle = '#ff7a3a'; ctx.lineWidth = 6; ctx.shadowColor = '#ff4d00'; ctx.shadowBlur = 20;
    for (let k = 0; k < 6; k++) { let x = 100 + k * 180, y = 760; ctx.beginPath(); ctx.moveTo(x, y); for (let i = 0; i < 8; i++) { x += (R() - .5) * 120; y += 60 + R() * 50; ctx.lineTo(x, y); } ctx.stroke(); } ctx.shadowBlur = 0;
    // büyüteç altında mikrop
    const mx = W / 2 + Math.sin(t * .8) * 60, my = 560;
    ctx.save(); ctx.beginPath(); ctx.arc(mx, my, 250, 0, TAU); ctx.clip(); ctx.fillStyle = '#1b1210'; ctx.fillRect(mx - 260, my - 260, 520, 520); microbe(mx, my + 20, 150, t); ctx.restore();
    ctx.strokeStyle = '#c9d2de'; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(mx, my, 262, 0, TAU); ctx.stroke(); ctx.lineWidth = 40; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(mx + 190, my + 190); ctx.lineTo(mx + 330, my + 330); ctx.stroke();
  });
  kinetic(['ANY', 'LIVING', 'ORGANISM?'], W / 2, 170, 120, t, 27.9, { hl: { 'ORGANISM?': C.gold } });
  padlock(W / 2, 1150, 220, seg(t, 30.72, 31.1));
  bigText('LOCKED WORLD', W / 2, 1440, 110, C.gold, seg(t, 30.8, 31.1));
}

const THEO = ['Only bacteria survive', 'Live on the twilight line', 'Humans move underground', 'Earth would be a desert', 'Total extinction', 'We would adapt'];
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const w1 = whip(t, 3.0, .3), w2 = whip(t, 4.86, .3, -1), w3 = whip(t, 16.74, .3), w4 = whip(t, 32.0, .3, -1);
  if (t < 3.2) cam({ y: w1.offA }, () => s1(t));
  if (t > 2.8 && t < 5.05) cam({ y: t < 4 ? w1.offB : w2.offA }, () => s2(Math.max(t, 3.0)));
  if (t > 4.66 && t < 12.45) cam({ y: w2.offB }, () => s3(Math.max(t, 4.86)));
  if (t >= 12.1 && t < 16.95) iris(t, 12.1, .4, () => s3(t), () => cam({ y: w3.offA }, () => s4(t)), W / 2, 860);
  if (t > 16.54 && t < 24.3) cam({ y: w3.offB }, () => s5(Math.max(t, 16.74)));
  if (t >= 24.0 && t < 27.8) iris(t, 24.0, .35, () => s5(t), () => s6(t), W / 2, 760);
  if (t >= 27.5 && t < 32.2) cam({ y: w4.offA }, () => s7(t));
  if (t > 31.8) cam({ y: w4.offB }, () => cta(Math.max(t, 32.0), 32.02, 33.6, 34.18, THEO, { tint: 'rgba(255,120,60,.18)', dot: '255,180,120' }));
  motionStreak(Math.max(w1.blur, w2.blur, w3.blur, w4.blur));
  glitch((t > 27.45 && t < 27.75 ? 1 : 0) + (t > 15.44 && t < 15.6 ? .8 : 0), Math.floor(t * 30));
  flash(t, 27.5, .15, '255,120,60');
  subs(t, SUBY);
};
