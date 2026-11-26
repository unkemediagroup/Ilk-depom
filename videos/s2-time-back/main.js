// Seri2 #20 — "What If Time Ran Backwards for 24 Hours?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 40.52;
const SUBY = 1540;
const AMB = '#ffb43a', TEAL = '#2affd0', RED = '#ff3b4e', GRN = '#3aff8a', PINK = '#ff4ab0';

function bg(t, a = '#1a0e06', b = '#050200') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
// geri sarma VHS çizgileri
function vhs(t, a = .5) { ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 5; i++) { const y = ((t * -700 + i * 420) % H + H) % H; ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(-300, y, W + 600, 14); } ctx.restore(); txt('◀◀ REWIND', 60, 80, 44, '#fff', { align: 'left', font: 'Anton', weight: 400 }); }
function clock(x, y, r, ang, col = AMB) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#f4eadb'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = r * .06; ctx.stroke(); for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i / 12 * TAU); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-r * .02, -r * .9, r * .04, r * .14); ctx.restore(); }
  ctx.save(); ctx.rotate(ang / 12); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-r * .04, -r * .5, r * .08, r * .5); ctx.restore(); ctx.save(); ctx.rotate(ang); ctx.fillStyle = col; ctx.fillRect(-r * .025, -r * .8, r * .05, r * .8); ctx.restore(); ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.arc(0, 0, r * .07, 0, TAU); ctx.fill(); ctx.restore(); }

// ---------- S1 0–7.5: kahve fincandan cezveye geri uçar, duvar saati geri sayar ----------
function s1(t) {
  bg(t, '#2a1608', '#0a0402');
  cam({ zoom: 1.08 - .05 * seg(t, 0, 7.5), rot: -.02 * Math.sin(t * 2), t, shake: 2 }, () => {
    // masa
    ctx.fillStyle = '#6a3e1e'; ctx.fillRect(-300, 1180, W + 600, 800);
    // cezve (pot) sağ üstte, fincan solda; kahve kolon halinde geri uçar
    ctx.fillStyle = '#c0c8d6'; ctx.save(); ctx.translate(700, 960); ctx.beginPath(); ctx.moveTo(-120, -160); ctx.lineTo(120, -160); ctx.lineTo(150, 120); ctx.lineTo(-150, 120); ctx.fill(); ctx.fillRect(140, -80, 120, 30); ctx.beginPath(); ctx.moveTo(-120, -160); ctx.lineTo(-180, -200); ctx.lineTo(-110, -130); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#f4f4f4'; ctx.save(); ctx.translate(300, 1120); ctx.beginPath(); ctx.moveTo(-130, -140); ctx.lineTo(130, -140); ctx.lineTo(100, 60); ctx.lineTo(-100, 60); ctx.fill(); ctx.strokeStyle = '#f4f4f4'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(140, -50, 50, -1.2, 1.2); ctx.stroke(); const lvl = 1 - seg(t, 2.9, 4.4); ctx.fillStyle = '#4a2a10'; ctx.fillRect(-122, -130 + 170 * (1 - lvl), 244, 170 * lvl); ctx.restore();
    const fly = seg(t, 2.9, 4.4); if (fly > 0 && fly < 1) for (let i = 0; i < 26; i++) { const q = clamp(fly * 1.6 - i * .025); if (q <= 0 || q >= 1) continue; const x = lerp(300, 560, q), y = lerp(1000, 800, q) - Math.sin(q * Math.PI) * 220; ctx.fillStyle = '#5a3212'; ctx.beginPath(); ctx.arc(x + Math.sin(i) * 14, y + Math.cos(i * 2) * 14, 16, 0, TAU); ctx.fill(); }
    // buhar ters yönde (aşağı iner)
    for (let i = 0; i < 4; i++) { const q = ((t * .6 + i / 4) % 1); ctx.strokeStyle = `rgba(255,255,255,${.4 * q})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(260 + i * 25, 700 + q * 260); ctx.quadraticCurveTo(300 + Math.sin(t * 3 + i) * 40, 650 + q * 260, 280 + i * 25, 600 + q * 260); ctx.stroke(); }
    // duvar saati geri döner
    const ang = 5.68 < t ? -(t - 5.68) * 8 : 0; clock(830, 600, 150, ang, RED);
  });
  vhs(t, .4);
  kinetic(['WHAT', 'IF', 'TIME', 'RAN'], W / 2, 200, 120, t, -.3, { gap: .05 });
  kinetic(['BACKWARDS?'], W / 2, 360, 170, t, .15, { hl: { 'BACKWARDS?': AMB } });
  if (t > 5.94) stampText('TICK ← TOCK', 300, 620, 70, RED, seg(t, 5.94, 6.2));
}

// ---------- S2 7.5–15.2: 24 saat geri, bilinç sabit ----------
function s2(t) {
  bg(t, '#08121a', '#000');
  const back = seg(t, 8.04, 14.6);
  cam({ zoom: 1.03 + .06 * back, rot: -back * .1, t, shake: 2 }, () => {
    // 24 saatlik dairesel kadran: gece/gündüz geri döner
    ctx.save(); ctx.translate(W / 2, 880); const R = 380; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU - Math.PI / 2; ctx.fillStyle = i >= 6 && i < 18 ? 'rgba(255,180,58,.35)' : 'rgba(60,90,200,.35)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, a, a + TAU / 24 - .01); ctx.fill(); }
    const a = -Math.PI / 2 - back * TAU; ctx.strokeStyle = AMB; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, R + 40, -Math.PI / 2, a, true); ctx.stroke();
    ctx.save(); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = '#fff'; ctx.fillRect(-8, -R, 16, R); ctx.restore();
    // ortada beyin (bilinç sağlam) — parlar
    ctx.fillStyle = PINK; ctx.shadowColor = PINK; ctx.shadowBlur = 30 + 15 * Math.sin(t * 5); ctx.beginPath(); ctx.ellipse(-40, 0, 90, 110, 0, 0, TAU); ctx.ellipse(40, 0, 90, 110, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(120,0,60,.6)'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-40, -60 + i * 40, 50, .2, 2.6); ctx.stroke(); ctx.beginPath(); ctx.arc(40, -60 + i * 40, 50, .5, 2.9); ctx.stroke(); }
    ctx.restore();
  });
  vhs(t, .3);
  const h = Math.round(lerp(0, 24, back)); txt('-' + h + 'H', W / 2, 1440, 170, AMB, { align: 'center', font: 'Anton', weight: 400 });
  kinetic(['24', 'HOURS', 'REVERSED'], W / 2, 240, 130, t, 7.7, { hl: { REVERSED: AMB } });
  if (t > 10.48) pill('YOUR MIND: INTACT', W / 2, 400, 54, PINK, seg(t, 10.48, 10.7));
}

// ---------- S3 15.2–23.6: sözler geri, para geri, hatalar yok olur ----------
function s3(t) {
  bg(t, '#140a20', '#030108');
  cam({ zoom: 1.03, t, shake: 2 }, () => {
    // 1) konuşma balonu: harfler ağza geri emilir
    const wq = seg(t, 15.5, 17.6); ctx.save(); ctx.translate(230, 700); ctx.scale(1.5, 1.5); ctx.fillStyle = 'rgba(255,74,176,.55)'; ctx.beginPath(); ctx.arc(0, 60, 120, 0, TAU); ctx.fill(); human(0, 160, 170); const word = 'SORRY!'; for (let i = 0; i < word.length; i++) { const q = clamp(wq * 1.4 - (word.length - i) * .06), x = lerp(120 + i * 55, 20, q), y = lerp(-80, 50, q); ctx.globalAlpha = 1 - q; txt(word[i], x, y, 70, '#fff', { align: 'center', font: 'Anton', weight: 400 }); } ctx.globalAlpha = 1; ctx.restore();
    // 2) dolarlar cüzdana geri uçar → banka bakiyesi artar
    const mq = seg(t, 18.26, 20.6); ctx.save(); ctx.translate(790, 700); ctx.scale(1.4, 1.4); ctx.fillStyle = '#2a4a2a'; ctx.beginPath(); ctx.roundRect(-150, -60, 300, 160, 20); ctx.fill(); txt('BANK', 0, 20, 50, GRN, { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      for (let i = 0; i < 8; i++) { const q = clamp(mq * 1.5 - i * .06); if (q <= 0 || q >= 1) continue; ctx.save(); ctx.translate(lerp(-300 + i * 30, 0, q), lerp(-300 - i * 20, 20, q)); ctx.rotate(q * 6 + i); ctx.fillStyle = '#5ac85a'; ctx.fillRect(-50, -25, 100, 50); ctx.fillStyle = '#2a6a2a'; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill(); ctx.restore(); } ctx.restore();
    if (t > 18.26) counter(120, 2400, 790, 960, 100, mq, { fmt: v => '$' + Math.round(v).toLocaleString('en-US'), col: GRN });
    // 3) hata: kırık vazo kendini birleştirir
    const vq = eio(seg(t, 21.3, 22.9)); ctx.save(); ctx.translate(W / 2, 1220); ctx.scale(1.5, 1.5); const P = [[-60, -60], [60, -60], [-60, 40], [60, 40]]; P.forEach(([dx, dy], i) => { ctx.save(); ctx.translate(dx * (1 + 2.6 * (1 - vq)), dy * (1 + 1.6 * (1 - vq)) + (1 - vq) * 60); ctx.rotate((1 - vq) * (i - 1.5)); ctx.fillStyle = '#3a8ad8'; ctx.beginPath(); ctx.moveTo(-55, -50); ctx.lineTo(55, -50); ctx.lineTo(55, 50); ctx.lineTo(-55, 50); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-55, -10, 110, 12); ctx.restore(); }); if (vq > .98) ring2(0, 0, seg(t, 22.9, 23.5), 260, TEAL, 10); ctx.restore();
  });
  vhs(t, .3);
  pill('WORDS UNSPOKEN', 290, 420, 50, '#fff', seg(t, 15.68, 15.9)); pill('MONEY BACK', 780, 420, 50, GRN, seg(t, 18.46, 18.7));
  if (t > 21.58) pill('MISTAKES', W / 2, 1030, 54, RED, seg(t, 21.58, 21.8));
  if (t > 22.72) stampText('UNDONE', W / 2, 1340, 110, TEAL, seg(t, 22.72, 22.95));
}

// ---------- S4 23.6–31.6: kazalar geri, fırtınalar açık gökyüzüne ----------
function s4(t) {
  const late = t > 26.2;
  const sky = seg(t, 27.4, 28.6);
  bg(t, late ? lerpCol('#2a2a3a', '#5ab0ff', sky) : '#141820', late ? lerpCol('#0a0a14', '#c9e8ff', sky) : '#05060a');
  cam({ zoom: 1.03 + (late ? 0 : .08 * seg(t, 24.6, 26.2)), t, shake: 2 + (!late ? 10 * Math.abs(Math.sin(t * 7)) * seg(t, 24.6, 25.0) * (1 - seg(t, 25.6, 26.2)) : 0) }, () => {
    if (!late) { // iki araba çarpışmadan geri ayrılır
      ctx.fillStyle = '#2a2c34'; ctx.fillRect(-300, 1000, W + 600, 300); ctx.fillStyle = '#ffd23a'; for (let i = 0; i < 10; i++) ctx.fillRect(-200 + i * 160, 1146, 80, 10);
      const u = eio(seg(t, 25.58, 26.2)); const gap = 10 + 200 * u;
      const car = (x, col, dir, dent) => { ctx.save(); ctx.translate(x, 1120); ctx.scale(dir * 1.3, 1.3); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-170, 40); ctx.lineTo(-170, -30); ctx.lineTo(-90, -40); ctx.lineTo(-40, -100); ctx.lineTo(80, -100); ctx.lineTo(130 - dent * 40, -40); ctx.lineTo(170 - dent * 50, -20 + dent * 20); ctx.lineTo(170 - dent * 40, 40); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-100, 45, 34, 0, TAU); ctx.arc(110, 45, 34, 0, TAU); ctx.fill(); ctx.restore(); };
      car(W / 2 - gap / 2 - 221, '#3a7aff', 1, 1 - u); car(W / 2 + gap / 2 + 221, RED, -1, 1 - u);
      shards(W / 2, 1080, 1 - seg(t, 24.6, 25.6), 30, 4, '#bfe8ff', 18, 500);
    } else { // fırtına bulutu geri sarılır → açık gökyüzü
      const sk = sky; ctx.fillStyle = lerpCol('#3a3c4a', '#ffffff', sk); for (let i = 0; i < 7; i++) { const x = 100 + i * 150 + Math.sin(t + i) * 20, y = 600 + (i % 2) * 80; ctx.globalAlpha = 1 - sk * .7; ctx.beginPath(); ctx.arc(x, y, 130 * (1 - sk * .5), 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
      if (sk < .5) { const R = RN(Math.floor(t * 20)); for (let i = 0; i < 30; i++) { const x = R() * W, y = 700 + ((R() * 800 - t * 900) % 800 + 800) % 800; ctx.strokeStyle = 'rgba(150,180,255,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 10, y - 50); ctx.stroke(); } if (Math.sin(t * 9) > .8) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(500, 700); ctx.lineTo(450, 900); ctx.lineTo(540, 920); ctx.lineTo(480, 1150); ctx.stroke(); } }
      if (sk > 0) { ctx.fillStyle = '#fff2a0'; ctx.shadowColor = '#ffd23a'; ctx.shadowBlur = 80 * sk; ctx.beginPath(); ctx.arc(800, 400, 120 * eback(sk), 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
      ctx.fillStyle = '#5aa83a'; ctx.fillRect(-300, 1250, W + 600, 800);
      // kaza işareti tersine döner
      const k = seg(t, 29.42, 30.7); if (k > 0) { ctx.save(); ctx.translate(W / 2, 1350); ctx.rotate(-k * TAU); ctx.fillStyle = k > .9 ? GRN : RED; ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(80, 60); ctx.lineTo(-80, 60); ctx.fill(); ctx.restore(); }
    }
  });
  vhs(t, .3);
  if (!late) { kinetic(['CRASHES', 'UN-CRASH'], W / 2, 260, 140, t, 24.0, { hl: { 'UN-CRASH': TEAL } }); }
  else { if (t < 29.32) kinetic(['STORMS', 'REWIND'], W / 2, 260, 140, t, 26.4, { hl: { REWIND: AMB } }); else bigText('TRAGEDIES UNDONE', W / 2, 260, 110, '#fff', seg(t, 29.42, 29.7), { glow: GRN }); }
}
function lerpCol(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return 'rgb(' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k)))).join(',') + ')'; }

// ---------- S5 31.6–40.52: zaman ileri akar → insanlığın hile kodu: yarını bilmek ----------
function s5(t) {
  bg(t, '#04101a', '#000');
  const fw = seg(t, 32.72, 33.8), code = t > 35.6;
  cam({ zoom: 1.03 + .08 * seg(t, 35.6, 40.5), t, shake: 2 + 14 * seg(t, 32.72, 33.0) * (1 - seg(t, 33.0, 33.8)) }, () => {
    if (!code) { clock(W / 2, 880, 330, (t - 32.72) * 6 * (fw > 0 ? 1 : -1), GRN); ring2(W / 2, 880, fw, 700, GRN, 16); }
    else { // gelecek gazetesi / hile kodu terminali
      ctx.save(); ctx.translate(W / 2, 880); ctx.rotate(Math.sin(t) * .03); ctx.fillStyle = '#0a1a10'; ctx.strokeStyle = GRN; ctx.lineWidth = 8; ctx.shadowColor = GRN; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-420, -380, 840, 760, 30); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      const L = ['> LOAD tomorrow.log', '  09:14  STOCK +38%', '  13:02  STORM PATH →', '  17:45  LOTTERY 7·19·23', '  21:30  CRASH AVOIDED', '> FUTURE: KNOWN ✓'];
      const n = seg(t, 36.0, 39.6) * L.length; L.forEach((l, i) => { if (i > n) return; const part = i + 1 > n ? l.slice(0, Math.floor((n - i) * l.length)) : l; txt(part, -380, -290 + i * 110, 48, i === 5 ? AMB : GRN, { align: 'left', font: 'Anton', weight: 400, stroke: 0 }); });
      if (Math.floor(t * 3) % 2) { ctx.fillStyle = GRN; ctx.fillRect(-380 + 20, 330, 30, 8); } ctx.restore();
    }
  });
  if (!code) { kinetic(['TIME', 'RESUMES'], W / 2, 260, 160, t, 31.8, { hl: { RESUMES: GRN } }); if (t > 33.44) pill('▶▶ FORWARD', W / 2, 1420, 64, GRN, seg(t, 33.44, 33.65)); }
  else { bigText('CHEAT CODE', W / 2, 260, 170, AMB, seg(t, 36.24, 36.5), { glow: AMB }); if (t > 39.36) stampText('NEXT 24H', W / 2, 1420, 110, '#fff', seg(t, 39.36, 39.6)); }
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 7.5, 15.2, 23.6, 31.6, 99], S = [s1, s2, s3, s4, s5];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 7.64 && t < 7.85 ? .6 : 0) + (t > 32.72 && t < 32.95 ? .8 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
