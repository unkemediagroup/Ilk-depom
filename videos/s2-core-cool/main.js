// Seri2 #18 — "What If Earth's Core Froze?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 39.92;
const SUBY = 1540;
const LAVA = '#ff6a1a', ICE = '#8ad8ff', FLD = '#5affc8', RED = '#ff3b4e', MARS = '#c8582a';
function mix(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return 'rgb(' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k)))).join(',') + ')'; }

// Kesitli Dünya: kabuk / manto / dış çekirdek / iç çekirdek. cool: 0 sıcak → 1 donmuş
function cutEarth(x, y, r, t, cool = 0) { ctx.save(); ctx.translate(x, y);
  const L = [[1, '#3a7a3a', '#3a3a3a'], [.92, '#c8582a', '#6a5a5a'], [.55, LAVA, '#5a7a9a'], [.3, '#ffe23a', '#c8ecff']];
  L.forEach(([k, a, b], i) => { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * k); g.addColorStop(0, mix(a, b, cool)); g.addColorStop(1, mix(i === 0 ? '#2a6a8a' : a, b, cool)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * k, 0, TAU); ctx.fill(); });
  // çekirdek dönüş çizgileri / donunca çatlaklar
  if (cool < .6) { ctx.strokeStyle = `rgba(255,255,200,${.6 * (1 - cool)})`; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(0, 0, r * (.33 + i * .035), t * (3 - i * .3) * (1 - cool), t * (3 - i * .3) * (1 - cool) + 1.2); ctx.stroke(); } }
  if (cool > .4) { const R = RN(5); ctx.strokeStyle = `rgba(255,255,255,${cool})`; ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { let a = R() * TAU, rr = r * .05; ctx.beginPath(); ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); for (let k = 0; k < 5; k++) { a += (R() - .5) * .6; rr += r * .1 * cool; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.stroke(); } }
  ctx.restore(); }
// Manyetik alan çizgileri (dipol)
function field(x, y, r, t, a = 1, col = FLD) { if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.lineWidth = 4; ctx.setLineDash([30, 18]); ctx.lineDashOffset = -t * 60;
  for (let i = 1; i <= 5; i++) { const L = r * (1 + i * .45); for (const sd of [-1, 1]) { ctx.beginPath(); for (let k = 0; k <= 60; k++) { const th = lerp(.18, Math.PI - .18, k / 60), rr = L * Math.sin(th) ** 2; const px = sd * rr * Math.sin(th), py = -rr * Math.cos(th); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); } }
  ctx.restore(); }
function solarWind(t, a, x0 = -200, hitX = null, n = 30) { const R = RN(8); for (let i = 0; i < n; i++) { const y = R() * H, sp = 900 + R() * 700, q = ((t * sp / 1400 + R()) % 1), x = x0 + q * 1600; if (hitX !== null && x > hitX(y)) continue; ctx.strokeStyle = `rgba(255,200,80,${.7 * a})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 90, y); ctx.stroke(); } }
function stars(t) { ctx.fillStyle = '#02030a'; ctx.fillRect(-300, -300, W + 600, H + 600); const R = RN(1); for (let i = 0; i < 120; i++) { ctx.fillStyle = `rgba(255,255,255,${.3 + .5 * R()})`; ctx.fillRect(R() * W, R() * H, 3, 3); } }

// ---------- S1 0–9.3: yerin altına dalış → dönen çekirdek dinamosu → kalkan ----------
function s1(t) {
  stars(t);
  const dive = eio(seg(t, 0, 2.4)), out = eio(seg(t, 4.2, 6.2));
  const z = lerp(lerp(2.6, 1, dive), .62, out);
  cam({ zoom: z, rot: (1 - dive) * .3, t, shake: 2 + 10 * (1 - dive) }, () => {
    if (t > 6.4) solarWind(t, seg(t, 6.4, 7), -200, y => W / 2 - 560 + Math.abs(y - 960) * .25);
    cutEarth(W / 2, 960, 380, t, 0);
    field(W / 2, 960, 380, t, seg(t, 4.4, 6.0));
    if (t > 6.66) { ctx.save(); ctx.strokeStyle = FLD; ctx.lineWidth = 16; ctx.shadowColor = FLD; ctx.shadowBlur = 40; ctx.globalAlpha = .7 + .3 * Math.sin(t * 8); ctx.beginPath(); ctx.arc(W / 2 + 120, 960, 760, Math.PI * .72, Math.PI * 1.28); ctx.stroke(); ctx.restore(); }
  });
  kinetic(['WHAT', 'IF', "EARTH'S", 'CORE'], W / 2, 200, 120, t, -.3, { gap: .05 });
  kinetic(['FROZE?'], W / 2, 350, 210, t, .15, { hl: { 'FROZE?': ICE } });
  if (t > 3.74) pill('DYNAMO', W / 2, 1420, 64, LAVA, seg(t, 3.74, 4.0));
  if (t > 6.66 && t < 9.3) stampText('SHIELD', 230, 560, 90, FLD, seg(t, 6.66, 6.9));
}

// ---------- S2 9.3–15.5: çekirdek donar, kalkan söner ----------
function s2(t) {
  stars(t);
  const cool = eio(seg(t, 10.0, 12.0)), fld = 1 - seg(t, 13.5, 14.2);
  cam({ zoom: 1.2 - .25 * seg(t, 9.3, 15.5), t, shake: 2 + 14 * seg(t, 11.0, 11.4) * (1 - seg(t, 11.4, 12.2)) + 12 * seg(t, 13.6, 13.9) * (1 - seg(t, 13.9, 14.6)) }, () => {
    cutEarth(W / 2, 960, 420, t, cool);
    field(W / 2, 960, 420, t, fld * (fld > .2 ? 1 : Math.sin(t * 80) > 0 ? 1 : 0));
    // buz kristalleri çekirdekte
    if (cool > .3) { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .2; ctx.save(); ctx.translate(W / 2 + Math.cos(a) * 60 * cool, 960 + Math.sin(a) * 60 * cool); ctx.rotate(a); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(70 * cool, 0); ctx.moveTo(40 * cool, 0); ctx.lineTo(55 * cool, -15); ctx.moveTo(40 * cool, 0); ctx.lineTo(55 * cool, 15); ctx.stroke(); ctx.restore(); } }
  });
  // termometre
  txt(cool > .5 ? 'SOLID' : 'MOLTEN', W / 2, 1420, 140, cool > .5 ? ICE : LAVA, { align: 'center', font: 'Anton', weight: 400 });
  if (t < 12.12) kinetic(['CORE', 'COOLS'], W / 2, 240, 170, t, 9.5, { hl: { COOLS: ICE } });
  else if (t < 13.72) kinetic(['SHIELD:'], W / 2, 240, 170, t, 12.15, { hl: { 'SHIELD:': FLD } });
  if (t > 13.72) stampText('GONE', W / 2, 300, 200, RED, seg(t, 13.72, 13.95));
}

// ---------- S3 15.5–24.3: güneş rüzgârı atmosferi söker, okyanuslar kaynar → Mars ----------
function s3(t) {
  stars(t);
  const m = eio(seg(t, 19.5, 23.4)), atm = 1 - seg(t, 16.5, 21);
  cam({ zoom: 1.04, t, shake: 3 }, () => {
    // güneş solda
    const g = ctx.createRadialGradient(-120, 600, 40, -120, 600, 500); g.addColorStop(0, '#fff6c0'); g.addColorStop(.4, '#ffb04a'); g.addColorStop(1, 'rgba(255,120,0,0)'); ctx.fillStyle = g; ctx.fillRect(-300, 0, 900, 1300);
    solarWind(t, 1, -200, null, 45);
    // gezegen: mavi-yeşil → kızıl Mars
    const px = 640, py = 960, r = 330;
    // atmosfer halesi soyulur (kuyruk sağa)
    if (atm > 0) { for (let i = 0; i < 18; i++) { const q = ((t * .6 + i / 18) % 1); ctx.fillStyle = `rgba(120,190,255,${.35 * atm * (1 - q)})`; ctx.beginPath(); ctx.arc(px + r * .7 + q * 600, py + Math.sin(i * 2.3) * r * .7 * (1 - q * .3), 30 + q * 40, 0, TAU); ctx.fill(); } ctx.strokeStyle = `rgba(120,190,255,${.6 * atm})`; ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(px, py, r + 20, 0, TAU); ctx.stroke(); }
    const gg = ctx.createRadialGradient(px - 100, py - 100, 20, px, py, r); gg.addColorStop(0, mix('#4a9ae8', '#e8884a', m)); gg.addColorStop(1, mix('#0a3a7a', '#6a2a10', m)); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.clip(); ctx.fillStyle = mix('#3a9a4a', '#a8481a', m); for (const [dx, dy, s] of [[-120, -80, 140], [100, 60, 110], [-40, 160, 90]]) { ctx.beginPath(); ctx.ellipse(px + dx + Math.sin(t * .3) * 20, py + dy, s, s * .7, .5, 0, TAU); ctx.fill(); }
    if (m > .4) { ctx.fillStyle = 'rgba(60,20,10,.4)'; const R = RN(3); for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(px + (R() - .5) * 2 * r, py + (R() - .5) * 2 * r, 10 + R() * 30, 0, TAU); ctx.fill(); } } ctx.restore();
    // okyanus buharı
    const st = seg(t, 18.28, 20.5) * (1 - seg(t, 21.5, 23)); if (st > 0) for (let i = 0; i < 14; i++) { const q = ((t * .8 + i / 14) % 1); ctx.fillStyle = `rgba(255,255,255,${.5 * st * (1 - q)})`; ctx.beginPath(); ctx.arc(px - 200 + (i % 7) * 70, py - r - q * 260, 20 + q * 40, 0, TAU); ctx.fill(); }
  });
  if (t < 18.28) kinetic(['SOLAR', 'WINDS', 'HIT'], W / 2, 240, 150, t, 15.7, { hl: { HIT: '#ffb04a' } });
  else if (t < 21.58) bigText('OCEANS BOIL', W / 2, 240, 140, '#fff', seg(t, 18.28, 18.55), { glow: '#ffb04a' });
  else { bigText('JUST LIKE MARS', W / 2, 240, 130, MARS, seg(t, 22.9, 23.15), { glow: MARS }); if (t < 22.9) stampText('DEAD ROCK', W / 2, 260, 130, RED, seg(t, 21.58, 21.8)); }
  // atmosfer yüzdesi
  counter(100, 1 + 99 * atm, W / 2, 1420, 120, 1, { fmt: v => 'AIR ' + Math.round(v) + '%', col: '#8ac8ff' });
}

// ---------- S4 24.3–35.2: tektonik durur: volkan söner, sismograf düz, dağlar aşınır ----------
function s4(t) {
  const late = t > 29.4;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, late ? '#c8a07a' : '#2a1a1a'); g.addColorStop(1, late ? '#6a4a3a' : '#0a0404'); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  cam({ zoom: 1.03, t, shake: !late ? 3 + 10 * Math.max(0, 1 - seg(t, 27.2, 28.6)) * Math.abs(Math.sin(t * 9)) : 1 }, () => {
    if (!late) {
      // volkan: lav fışkırması söner
      const fire = 1 - seg(t, 27.78, 28.8); ctx.fillStyle = '#3a2a2a'; ctx.beginPath(); ctx.moveTo(60, 1300); ctx.lineTo(420, 700); ctx.lineTo(560, 700); ctx.lineTo(980, 1300); ctx.fill();
      if (fire > 0) { for (let i = 0; i < 20; i++) { const q = ((t * 1.2 + i / 20) % 1), a = -Math.PI / 2 + (i % 7 - 3) * .15; ctx.fillStyle = `rgba(255,${100 + i * 6},30,${fire * (1 - q)})`; ctx.beginPath(); ctx.arc(490 + Math.cos(a) * q * 500, 700 + Math.sin(a) * q * 500 + q * q * 300, 22 * (1 - q * .5), 0, TAU); ctx.fill(); } ctx.fillStyle = `rgba(255,106,26,${fire})`; ctx.beginPath(); ctx.moveTo(430, 700); ctx.lineTo(550, 700); ctx.lineTo(620, 900); ctx.lineTo(520, 1000); ctx.fill(); }
      else { ctx.fillStyle = 'rgba(150,150,150,.4)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(490 + Math.sin(t + i) * 30, 650 - i * 60, 40 + i * 10, 0, TAU); ctx.fill(); } }
      // sismograf
      ctx.fillStyle = '#f4eadb'; ctx.fillRect(80, 1330, 920, 150); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); for (let x = 0; x <= 900; x += 6) { const tt = t - (900 - x) / 300, amp = 55 * Math.max(0, 1 - seg(tt, 27.2, 28.6)); ctx.lineTo(90 + x, 1405 + Math.sin(tt * 40) * amp * Math.sin(tt * 7)); } ctx.stroke();
    } else {
      // dağların zamanla aşınması (time-lapse)
      const er = eio(seg(t, 30.5, 33.6)); const R = RN(4);
      for (let k = 0; k < 3; k++) { ctx.fillStyle = ['#8a7a6a', '#6a5a4a', '#4a3a2a'][k]; ctx.beginPath(); ctx.moveTo(-300, 1350); for (let x = -300; x <= W + 300; x += 40) { const pk = Math.max(0, 1 - Math.abs(((x + k * 200) % 600) - 300) / 300); ctx.lineTo(x, 1350 - (pk * (500 - k * 120) + 30) * (1 - er * .92) - k * 60); } ctx.lineTo(W + 300, 1350); ctx.fill(); }
      ctx.fillStyle = '#5a4030'; ctx.fillRect(-300, 1340, W + 600, 700);
      // yıl sayacı
      counter(0, 100, W / 2, 1440, 110, seg(t, 30.5, 33.6), { fmt: v => Math.round(v) + 'M YEARS', col: '#fff' });
      // yağmur/rüzgâr çizgileri (aşınma)
      ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 3; for (let i = 0; i < 40; i++) { const x = (R() * W + t * 400) % W, y = (R() * 1300 + t * 900) % 1300; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 20, y + 50); ctx.stroke(); }
    }
  });
  if (!late) { kinetic(['TECTONICS', 'STOP'], W / 2, 240, 140, t, 24.5, { hl: { STOP: RED } }); pill('NO QUAKES', 260, 440, 54, '#fff', seg(t, 27.22, 27.45)); pill('NO VOLCANOES', 780, 440, 54, LAVA, seg(t, 27.78, 28.0)); }
  else { kinetic(['MOUNTAINS', 'ERODE'], W / 2, 240, 140, t, 29.6, { hl: { ERODE: '#fff' } }); if (t > 31.06) stampText('FLAT', W / 2, 420, 150, '#3a2a1a', seg(t, 31.06, 31.3)); }
}

// ---------- S5 35.2–39.92: auroralar kaybolur, pusulalar çıldırır ----------
function s5(t) {
  stars(t);
  const fade = seg(t, 35.98, 37.0), cmp = t > 37.4;
  cam({ zoom: 1.03 + .06 * seg(t, 37.4, 39.9), t, shake: 2 }, () => {
    // aurora perdeleri
    for (let k = 0; k < 4; k++) { ctx.save(); ctx.globalAlpha = (1 - fade) * .55; const gc = ctx.createLinearGradient(0, 200, 0, 1000); gc.addColorStop(0, 'rgba(180,80,255,0)'); gc.addColorStop(.5, k % 2 ? '#5affc8' : '#3aff7a'); gc.addColorStop(1, 'rgba(58,255,122,0)'); ctx.fillStyle = gc; ctx.beginPath(); ctx.moveTo(-200, 1000); for (let x = -200; x <= W + 200; x += 30) ctx.lineTo(x, 300 + k * 80 + Math.sin(x * .006 + t * 1.5 + k) * 120); for (let x = W + 200; x >= -200; x -= 30) ctx.lineTo(x, 900 + k * 40 + Math.sin(x * .006 + t * 1.5 + k) * 60); ctx.fill(); ctx.restore(); }
    // tepe siluetleri
    ctx.fillStyle = '#05060a'; ctx.beginPath(); ctx.moveTo(-300, H); ctx.lineTo(-300, 1150); for (let x = -300; x <= W + 300; x += 60) ctx.lineTo(x, 1150 - Math.abs(Math.sin(x * .004)) * 140); ctx.lineTo(W + 300, H); ctx.fill();
    // pusula
    const k = eback(seg(t, 37.58, 37.9)); if (k > 0) { ctx.save(); ctx.translate(W / 2, 760); ctx.scale(k, k); ctx.fillStyle = '#c9a77a'; ctx.beginPath(); ctx.arc(0, 0, 300, 0, TAU); ctx.fill(); ctx.fillStyle = '#f4eadb'; ctx.beginPath(); ctx.arc(0, 0, 260, 0, TAU); ctx.fill(); ['N', 'E', 'S', 'W'].forEach((l, i) => { const a = i * Math.PI / 2 - Math.PI / 2; txt(l, Math.cos(a) * 210, Math.sin(a) * 210, 60, '#3a2a1a', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); });
      const sp = t > 38.82 ? (t - 38.82) * 25 + Math.sin(t * 13) : Math.sin(t * 9) * .8; ctx.rotate(sp); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(28, 0); ctx.lineTo(-28, 0); ctx.fill(); ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(28, 0); ctx.lineTo(-28, 0); ctx.fill(); ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fill(); ctx.restore(); }
  });
  if (!cmp) kinetic(['AURORAS', 'FADE'], W / 2, 240, 150, t, 35.3, { hl: { FADE: '#5affc8' } });
  else if (t > 38.82) stampText('USELESS', W / 2, 240, 150, RED, seg(t, 38.82, 39.05));
  else kinetic(['COMPASSES'], W / 2, 240, 140, t, 37.45);
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 9.3, 15.5, 24.3, 35.2, 99], S = [s1, s2, s3, s4, s5];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 13.72 && t < 14.0 ? .9 : 0) + (t > 21.58 && t < 21.75 ? .5 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
