// Seri2 #4 — "What If Gravity Doubled on Earth?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 41.95;
const SUBY = 1540;
const GR = '#b06bff', HOT = '#ff3b4e', LIME = '#a8ff3a';

function lerpC(a, b, k) { const p = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), q = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); }
function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function downArrows(t, a, col = GR) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; for (let i = 0; i < 7; i++) { const x = 90 + i * 150, y = ((t * 500 + i * 230) % 1900) - 100; ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.lineTo(x + 30, y); ctx.lineTo(x + 30, y + 60); ctx.lineTo(x + 55, y + 60); ctx.lineTo(x, y + 120); ctx.lineTo(x - 55, y + 60); ctx.lineTo(x - 30, y + 60); ctx.fill(); } ctx.restore(); }
function person(x, y, s, o = {}) { // (x,y)=ayak; o.sq: ezilme (0..1), o.wide, o.short
  const sq = o.sq || 0, wd = 1 + (o.wide || 0), sh = 1 - (o.short || 0); ctx.save(); ctx.translate(x, y); ctx.scale(wd * (1 + sq * .15), sh * (1 - sq * .18));
  const col = o.col || '#e8d8c8'; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -s * .88, s * .11, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-s * .17, -s * .75, s * .34, s * .42, s * .1); ctx.fill();
  const kb = o.knee || 0; ctx.lineWidth = s * .11 * (1 + (o.musc || 0)); ctx.beginPath(); ctx.moveTo(-s * .08, -s * .36); ctx.lineTo(-s * .12 - kb * s * .1, -s * .18); ctx.lineTo(-s * .1, 0); ctx.moveTo(s * .08, -s * .36); ctx.lineTo(s * .12 + kb * s * .1, -s * .18); ctx.lineTo(s * .1, 0); ctx.stroke();
  ctx.lineWidth = s * .08 * (1 + (o.musc || 0)); const ar = o.arms ?? 0; ctx.beginPath(); ctx.moveTo(-s * .17, -s * .7); ctx.lineTo(-s * .28, -s * (.42 + ar * .4)); ctx.moveTo(s * .17, -s * .7); ctx.lineTo(s * .28, -s * (.42 + ar * .4)); ctx.stroke(); ctx.restore(); }

// ---------- S1 0–2.12: yerçekimi ikiye katlanır ----------
function s1(t) {
  darkGrad('#14082a', '#04030a');
  const sl = eback(seg(t, .64, .95)), d = seg(t, .64, 1.1);
  downArrows(t, .25 + .5 * d);
  cam({ zoom: 1.15 - .1 * eo(seg(t, 0, 2.1)) + .06 * Math.sin(d * Math.PI), t, shake: t > .64 && t < 1.5 ? 24 * (1 - seg(t, .64, 1.5)) : 3 }, () => {
    // dev tartı
    ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.roundRect(W / 2 - 300, 1080, 600, 140, 40); ctx.fill(); ctx.fillStyle = '#1a1e2a'; ctx.beginPath(); ctx.roundRect(W / 2 - 150, 1110, 300, 80, 20); ctx.fill();
    const kg = Math.round(lerp(70, 140, eio(d))); txt(kg + ' KG', W / 2, 1152, 66, kg > 100 ? HOT : LIME, { align: 'center', font: 'Anton', weight: 400, stroke: 0, glow: kg > 100 ? HOT : LIME });
    person(W / 2, 1080, 560, { sq: d });
    // 1G → 2G rozeti
    ctx.save(); ctx.translate(W / 2, 560); ctx.scale(1 + .3 * Math.sin(sl * Math.PI), 1 + .3 * Math.sin(sl * Math.PI)); txt(d > .5 ? '2G' : '1G', 0, 0, 260, d > .5 ? GR : '#fff', { align: 'center', font: 'Anton', weight: 400, glow: GR, blur: 60 }); ctx.restore();
  });
  kinetic(['WHAT', 'IF', 'GRAVITY'], W / 2, 220, 150, t, -.3, { gap: .05, hl: { GRAVITY: GR } });
  kinetic(['DOUBLED?'], W / 2, 380, 170, t, .2, { hl: { 'DOUBLED?': HOT } });
  flash(t, .64, .2, '176,107,255');
}

// ---------- S2 2.12–6.42: herkes iki kat ağır ----------
function s2(t) {
  darkGrad('#1a1030', '#05040a');
  const sq = eo(seg(t, 4.28, 5.3));
  downArrows(t, .2);
  cam({ zoom: 1.03, t, shake: 2 + 8 * seg(t, 4.6, 5.0) * (1 - seg(t, 5.0, 5.6)) }, () => {
    ctx.fillStyle = '#2a2440'; ctx.fillRect(-300, 1250, W + 600, 700);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const x = 110 + i * 172 + r * 86, y = 1250 + r * 120; person(x, y, 300 - r * 30, { sq, col: ['#e8d8c8', '#c9a77a', '#8a5a3a', '#f2c49a'][(i + r) % 4], knee: sq * .6 }); }
  });
  counter(1, 2, W / 2, 620, 300, seg(t, 4.28, 5.2), { fmt: v => v.toFixed(1) + '×', col: HOT });
  txt('HEAVIER', W / 2, 820, 90, '#fff', { align: 'center', font: 'Anton', weight: 400 });
  kinetic(['EVERY', 'SINGLE', 'PERSON'], W / 2, 260, 130, t, 2.12);
}

// ---------- S3 6.42–11.16: omuzlarında bir yetişkin taşımak ----------
function s3(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffb07a'); g.addColorStop(1, '#ff7a5a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const up = eo(seg(t, 6.42, 7.4)), rider = eback(seg(t, 7.84, 8.3)), wob = Math.sin(t * 4) * .03;
  cam({ zoom: 1.04, t, shake: 2 + 4 * rider }, () => {
    ctx.fillStyle = '#4a3a3a'; ctx.fillRect(-300, 1350, W + 600, 700);
    ctx.save(); ctx.translate(W / 2, 1350); ctx.rotate(wob); ctx.translate(-W / 2, -1350);
    person(W / 2, 1350, 600 * (.7 + .3 * up), { knee: .5 * rider + (1 - up) * .8, col: '#2a2440', arms: .9 * rider });
    if (rider > 0) { ctx.save(); ctx.translate(W / 2, 1350 - 600 * .72 - 20); ctx.scale(rider, rider); person(0, 0, 420, { col: '#5a4a8a', knee: 1.2 }); ctx.restore(); }
    // ter damlaları
    if (rider > .5) for (let i = 0; i < 4; i++) { const q = ((t * 1.2 + i / 4) % 1); ctx.fillStyle = `rgba(120,200,255,${1 - q})`; ctx.beginPath(); ctx.arc(W / 2 + (i % 2 ? 90 : -90), 760 + q * 120, 12, 0, TAU); ctx.fill(); }
    ctx.restore();
  });
  kinetic(['STANDING', 'UP', '='], W / 2, 220, 140, t, 6.42);
  if (t > 7.84) bigText('+1 ADULT ON YOUR SHOULDERS', W / 2, 370, 76, '#fff', seg(t, 7.84, 8.1));
  if (t > 9.3) stampText('ALL DAY LONG', W / 2, 1450, 100, HOT, seg(t, 9.3, 9.6));
}

// ---------- S4 11.16–17.5: ağaçlar, köprüler, çatılar çöker ----------
function s4(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#7ab8ff'); g.addColorStop(1, '#dff0ff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const kt = seg(t, 11.28, 12.0), kb = seg(t, 12.22, 13.2), kr = seg(t, 13.7, 14.7);
  cam({ zoom: 1.03, t, shake: 2 + 16 * Math.max(Math.sin(kt * Math.PI), Math.sin(kb * Math.PI), Math.sin(kr * Math.PI)) }, () => {
    ctx.fillStyle = '#5a8a3a'; ctx.fillRect(-300, 1200, W + 600, 800);
    downArrows(t, .15);
    // ağaç kırılır
    ctx.save(); ctx.translate(180, 1200); ctx.fillStyle = '#6a4224'; ctx.fillRect(-18, -260, 36, 260); ctx.translate(0, -260); ctx.rotate(1.4 * ei(kt)); ctx.fillRect(-14, -200, 28, 200); ctx.fillStyle = '#3a8a3a'; ctx.beginPath(); ctx.arc(0, -230, 110, 0, TAU); ctx.arc(-70, -170, 80, 0, TAU); ctx.arc(70, -170, 80, 0, TAU); ctx.fill(); ctx.restore();
    // eski köprü sarkar ve kırılır
    const sag = 180 * eio(kb), brk = kb > .6; ctx.fillStyle = '#9a8a6a'; ctx.fillRect(340, 980, 40, 220); ctx.fillRect(700, 980, 40, 220); ctx.strokeStyle = '#8a6a4a'; ctx.lineWidth = 24;
    if (!brk) { ctx.beginPath(); ctx.moveTo(340, 980); ctx.quadraticCurveTo(540, 980 + sag * 2, 740, 980); ctx.stroke(); } else { const d = (kb - .6) * 2.5; ctx.beginPath(); ctx.moveTo(340, 980); ctx.lineTo(520, 1060 + 300 * d); ctx.moveTo(740, 980); ctx.lineTo(560, 1060 + 300 * d); ctx.stroke(); }
    // ev çatısı çöker
    ctx.fillStyle = '#e8d8c0'; ctx.fillRect(820, 1000, 240, 200); ctx.fillStyle = '#6a3a2a'; ctx.fillRect(900, 1100, 60, 100);
    ctx.fillStyle = '#b04a3a'; ctx.beginPath(); const rd = 150 * eio(kr); ctx.moveTo(800, 1000); ctx.lineTo(940, 860 + rd); ctx.lineTo(1080, 1000); ctx.fill();
    if (kr > .5) shards(940, 1000, seg(t, 14.0, 15.0), 30, 6, '#b04a3a', 14, 400);
  });
  pill('TREES', 200, 520, 60, '#3ad06a', seg(t, 11.16, 11.4)); pill('BRIDGES', 540, 620, 60, GOLD_(), seg(t, 12.04, 12.3)); pill('ROOFS', 880, 520, 60, HOT, seg(t, 13.7, 13.95));
  if (t > 14.66) stampText('COLLAPSE', W / 2, 330, 150, HOT, seg(t, 14.66, 14.95));
}
function GOLD_() { return '#ffc83d'; }

// ---------- S5 17.5–25.0: kalp iki kat çalışır, bayılma ----------
function heart(x, y, s, beat, col) { const k = 1 + .14 * beat; ctx.save(); ctx.translate(x, y); ctx.scale(k * s / 100, k * s / 100); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 40;
  ctx.beginPath(); ctx.moveTo(0, 35); ctx.bezierCurveTo(-90, -20, -45, -85, 0, -40); ctx.bezierCurveTo(45, -85, 90, -20, 0, 35); ctx.fill(); ctx.restore(); }
function s5(t) {
  darkGrad('#1a0408', '#050102');
  const faint = t > 22.3, bpm = Math.round(lerp(70, 150, eo(seg(t, 18.28, 19.4))));
  cam({ zoom: 1.03, t, shake: 2 + (faint ? 10 * seg(t, 22.4, 22.9) * (1 - seg(t, 22.9, 23.5)) : 0) }, () => {
    if (!faint) {
      // vücut silueti, kalp, beyne giden kan sütunu
      person(W / 2, 1400, 1000, { col: '#2a1a24' });
      const ph = t * bpm / 60 * TAU, beat = Math.pow(Math.max(0, Math.sin(ph)), 6); heart(W / 2 - 20, 900, 130, beat, HOT);
      const lvl = .55 + .25 * Math.sin(ph) - .25 * seg(t, 19.9, 21.0); ctx.fillStyle = HOT; ctx.fillRect(W / 2 - 14, 880 - 330 * lvl, 28, 330 * lvl);
      ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 4; ctx.strokeRect(W / 2 - 16, 550, 32, 330);
      ctx.fillStyle = lvl < .45 ? 'rgba(160,160,200,.9)' : '#ff8aa8'; ctx.beginPath(); ctx.ellipse(W / 2, 470, 90, 70, 0, 0, TAU); ctx.fill();
      txt(bpm + ' BPM', 820, 640, 90, HOT, { align: 'center', font: 'Anton', weight: 400, glow: HOT });
    } else {
      // bayılan insan + düz EKG
      const f = eio(seg(t, 22.4, 23.2)); ctx.save(); ctx.translate(W / 2, 1300); ctx.rotate(-f * 1.5); person(0, 0, 520, { col: '#e8d8c8' }); ctx.restore();
      ctx.strokeStyle = t > 23.34 ? HOT : LIME; ctx.lineWidth = 8; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 20; ctx.beginPath(); const flat = seg(t, 23.34, 23.6);
      for (let x = 0; x <= W; x += 8) { const u = ((x / W + t * .6) % 1), spike = (u > .45 && u < .52) ? Math.sin((u - .45) / .07 * Math.PI) * -220 * (1 - flat) : 0; ctx.lineTo(x, 600 + spike); } ctx.stroke(); ctx.shadowBlur = 0;
    }
  });
  if (!faint) { kinetic(['YOUR', 'HEART'], W / 2, 220, 150, t, 17.5, { hl: { HEART: HOT } }); bigText('WORKS 2× HARDER', W / 2, 1440, 110, '#fff', seg(t, 18.28, 18.55)); }
  else { kinetic(['FAINTING'], W / 2, 260, 170, t, 22.4); if (t > 23.34) stampText('HEART FAILURE', W / 2, 1430, 110, HOT, seg(t, 23.34, 23.6)); }
}

// ---------- S6 25.0–31.5: kuşlar ve uçaklar zorlanır ----------
function birdF(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#1a1e2a'; const f = Math.sin(t * 28); ctx.beginPath(); ctx.ellipse(0, 0, s * .3, s * .1, 0, 0, TAU); ctx.fill();
  for (const sg of [1, -1]) { ctx.beginPath(); ctx.moveTo(-s * .05, 0); ctx.quadraticCurveTo(-s * .1, -s * .5 * f * sg, -s * .4, -s * .45 * f * sg); ctx.quadraticCurveTo(-s * .15, -s * .08, s * .1, 0); ctx.fill(); } ctx.beginPath(); ctx.arc(s * .3, -s * .05, s * .08, 0, TAU); ctx.fill(); ctx.restore(); }
function jet(x, y, s, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.ellipse(0, 0, s * .5, s * .08, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#c9d2de'; ctx.beginPath(); ctx.moveTo(s * .05, 0); ctx.lineTo(-s * .14, s * .14); ctx.lineTo(-s * .06, s * .14); ctx.lineTo(s * .14, 0); ctx.fill(); ctx.fillStyle = '#eef2f8'; ctx.beginPath(); ctx.moveTo(-s * .38, 0); ctx.lineTo(-s * .5, -s * .18); ctx.lineTo(-s * .44, 0); ctx.fill();
  ctx.fillStyle = '#3da5ff'; for (let i = 0; i < 6; i++) ctx.fillRect(-s * .28 + i * s * .09, -s * .02, s * .04, s * .03); ctx.restore(); }
function s6(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a8ae0'); g.addColorStop(1, '#cfeaff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.03, t, shake: 3 }, () => {
    // kuşlar aşağı çekilir
    for (let i = 0; i < 4; i++) { const x = 200 + i * 220, y = 500 + Math.sin(t * 3 + i) * 40 + seg(t, 26.0, 27.6) * (120 + i * 40); birdF(x, y, 160, t + i); }
    // uçak pist sonunda zorla kalkar
    ctx.fillStyle = '#3a3a42'; ctx.fillRect(-300, 1260, W + 600, 140); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.setLineDash([60, 50]); ctx.lineDashOffset = t * 400; ctx.beginPath(); ctx.moveTo(-300, 1330); ctx.lineTo(W + 300, 1330); ctx.stroke(); ctx.setLineDash([]);
    const lift = seg(t, 29.6, 31.3); jet(W / 2, 1220 - 260 * ei(lift), 520, -.25 * lift);
  });
  // yakıt göstergesi 2×
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.roundRect(140, 820, 800, 200, 40); ctx.fill(); ctx.restore();
  const fu = eo(seg(t, 28.2, 29.0)); txt('FUEL', 240, 920, 60, '#fff', { align: 'center', font: 'Anton', weight: 400 }); ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(340, 890, 560, 60); ctx.fillStyle = '#ffb35a'; ctx.fillRect(340, 890, 280 + 280 * fu, 60);
  txt((1 + fu).toFixed(1) + '×', 760, 830, 70, '#ffb35a', { align: 'center', font: 'Anton', weight: 400 });
  kinetic(['BIRDS', '&', 'AIRPLANES'], W / 2, 230, 130, t, 25.2, { hl: { AIRPLANES: '#3da5ff' } });
  if (t > 26.08) bigText('STRUGGLE TO FLY', W / 2, 380, 100, HOT, seg(t, 26.08, 26.35));
}

// ---------- S7 31.5–41.95: evrim: kısa, geniş, kaslı insanlar ----------
function s7(t) {
  darkGrad('#0c1a14', '#020604');
  const ev = eio(seg(t, 33.2, 40.0)), late = t > 40.6;
  downArrows(t, .15 + .35 * seg(t, 40.6, 41.4), late ? HOT : GR);
  cam({ zoom: 1.04, t, shake: 2 + 10 * seg(t, 41.18, 41.5) }, () => {
    // zaman çizgisi
    ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(100, 500); ctx.lineTo(980, 500); ctx.stroke(); ctx.fillStyle = LIME; ctx.beginPath(); ctx.arc(100 + 880 * ev, 500, 18, 0, TAU); ctx.fill();
    txt('TODAY', 100, 450, 36, '#fff', { stroke: 0 }); txt('+ MILLIONS OF YEARS', 980, 450, 36, LIME, { align: 'right', stroke: 0 });
    // bugünkü insan (hayalet) vs evrilmiş insan
    ctx.save(); ctx.globalAlpha = .35; person(320, 1350, 700, { col: '#9aa2b0' }); ctx.restore(); txt('NOW', 320, 1420, 44, '#9aa2b0', { align: 'center', stroke: 0 });
    person(740, 1350, 700, { col: lerpC('#9aa2b0', '#ff9a5a', ev), short: .38 * ev, wide: .45 * ev, musc: .8 * ev, sq: late ? .2 * Math.sin(t * 6) : 0 });
    // ölçü okları
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; const hh = 700 * (1 - .38 * ev); ctx.beginPath(); ctx.moveTo(980, 1350); ctx.lineTo(980, 1350 - hh); ctx.stroke(); txt(Math.round(lerp(175, 120, ev)) + ' cm', 950, 1350 - hh - 40, 44, LIME, { align: 'center', stroke: 6 });
  });
  pill('SHORTER', 190, 640, 48, LIME, seg(t, 36.78, 37.0)); pill('WIDER', 540, 640, 48, '#ffc83d', seg(t, 37.72, 37.95)); pill('MUSCULAR', 880, 640, 48, '#ff9a5a', seg(t, 39.22, 39.45));
  kinetic(['EVOLUTION'], W / 2, 260, 180, t, 33.1, { hl: { EVOLUTION: LIME } });
  if (late) stampText('CRUSHING PULL', W / 2, 1440, 110, HOT, seg(t, 41.18, 41.45));
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 2.12, 6.42, 11.16, 17.5, 25.0, 31.5, 99], S = [s1, s2, s3, s4, s5, s6, s7];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > .64 && t < .85 ? .8 : 0) + (t > 23.34 && t < 23.55 ? .8 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
