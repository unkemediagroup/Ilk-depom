// Seri2 #7 — "What If the Internet Shut Down Forever?" — 1080×1920, 60 fps, kodla çizim.
window.DUR = 48.77;
const SUBY = 1540;
const NET = '#4ff0ff', RED = '#ff3b4e', GOLD = '#ffc83d', GRN = '#22e07a';

function darkGrad(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
function wifi(x, y, s, col, cross) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = s * .1; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, 0, s * i * .3, -Math.PI * .75, -Math.PI * .25); ctx.stroke(); } ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * .02, s * .08, 0, TAU); ctx.fill();
  if (cross > 0) { ctx.strokeStyle = RED; ctx.lineWidth = s * .12; ctx.beginPath(); ctx.moveTo(-s * .55, -s * .95); ctx.lineTo(-s * .55 + s * 1.1 * clamp(cross), -s * .95 + s * 1.1 * clamp(cross)); ctx.stroke(); } ctx.restore(); }
function offline(s, x, y, size, p) { if (p <= 0) return; ctx.save(); ctx.globalAlpha = clamp(p * 3); ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.beginPath(); ctx.roundRect(x - size * 3.2, y - size * .9, size * 6.4, size * 1.8, size * .4); ctx.fill(); txt(s, x, y, size, RED, { align: 'center', font: 'Anton', weight: 400, stroke: 0, glow: RED }); ctx.restore(); }

// ---------- S1 0–2.86: küresel ağ kararır ----------
function s1(t) {
  space(t, 2);
  const off = seg(t, 1.4, 1.75);
  cam({ zoom: 1.12 - .08 * eo(seg(t, 0, 2.8)), t, shake: t > 1.4 && t < 2.2 ? 20 * (1 - seg(t, 1.4, 2.2)) : 3 }, () => {
    const cx = W / 2, cy = 900, r = 400; earth(cx, cy, r, t, { rot: t * .3, dark: lerp(.6, .95, off) });
    // ağ bağlantıları ve paketler
    const R = RN(5), nodes = Array.from({ length: 18 }, () => { const a = R() * TAU, d = R() * r * .9; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d * .9]; });
    ctx.lineWidth = 3; nodes.forEach((a, i) => { const b = nodes[(i * 7 + 3) % nodes.length]; ctx.strokeStyle = `rgba(79,240,255,${.7 * (1 - off)})`; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 120, b[0], b[1]); ctx.stroke();
      if (off < 1) { const q = (t * .8 + i * .13) % 1; const mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - 120, x = (1 - q) * (1 - q) * a[0] + 2 * (1 - q) * q * mx + q * q * b[0], y = (1 - q) * (1 - q) * a[1] + 2 * (1 - q) * q * my + q * q * b[1]; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); } });
    nodes.forEach(([x, y]) => { ctx.fillStyle = off < .5 ? NET : '#2a3040'; ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); });
    wifi(cx, 1430, 260, off > .5 ? '#6a7280' : NET, seg(t, 1.5, 1.9));
  });
  kinetic(['WHAT', 'IF', 'THE', 'INTERNET'], W / 2, 210, 130, t, -.3, { gap: .05, hl: { INTERNET: NET } });
  kinetic(['SHUT', 'DOWN', 'FOREVER?'], W / 2, 370, 130, t, .1, { hl: { 'FOREVER?': RED } });
  flash(t, 1.4, .2, '79,240,255');
}

// ---------- S2 2.86–5.9: medeniyet donar ----------
function s2(t) {
  darkGrad('#0a1424', '#02050a');
  const fr = seg(t, 3.82, 4.4);
  cam({ zoom: 1.03 + .04 * fr, t, shake: 2 }, () => {
    skyline(1300, t * (1 - fr), { seed: 31, tall: 700, col: '#1a2440' }); ctx.fillStyle = '#0a101c'; ctx.fillRect(-300, 1300, W + 600, 700);
    // donmuş arabalar
    for (let i = 0; i < 4; i++) { const x = ((i * 300 + 3.82 * 300 * (1 - fr) + t * 300 * (1 - fr)) % 1400) - 150; ctx.fillStyle = ['#ff3b4e', '#3da5ff', '#ffc83d', '#22e07a'][i]; ctx.beginPath(); ctx.roundRect(x, 1330, 180, 60, 16); ctx.fill(); }
    // büyük duraklat simgesi + buz
    ctx.save(); ctx.globalAlpha = fr; ctx.fillStyle = 'rgba(200,240,255,.15)'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.shadowColor = NET; ctx.shadowBlur = 40; ctx.beginPath(); ctx.roundRect(W / 2 - 150, 600, 100, 340, 20); ctx.fill(); ctx.beginPath(); ctx.roundRect(W / 2 + 50, 600, 100, 340, 20); ctx.fill(); ctx.restore();
    const R = RN(4); ctx.strokeStyle = `rgba(220,245,255,${.7 * fr})`; ctx.lineWidth = 4; for (let i = 0; i < 40; i++) { const c = i % 4, x = c % 2 ? W : 0, y = c > 1 ? H : 0, a = (c === 0 ? 0 : c === 1 ? Math.PI / 2 : c === 2 ? -Math.PI / 2 : Math.PI) + R() * Math.PI / 2, l = (100 + R() * 300) * fr; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); }
  });
  kinetic(['CIVILIZATION'], W / 2, 230, 150, t, 2.86);
  if (t > 3.82) stampText('FROZEN', W / 2, 1100, 150, NET, seg(t, 3.82, 4.1));
}

// ---------- S3 5.9–14.86: borsa çöker, bankalar kilitlenir, ATM'ler durur ----------
const CS = (() => { const R = RN(3), o = []; let p = 100; for (let i = 0; i < 22; i++) { const a = p, c = a + (i < 5 ? (R() - .4) * 6 : -(3 + R() * 10)); o.push({ o: a, c, h: Math.max(a, c) + R() * 3, l: Math.min(a, c) - R() * 4 }); p = c; } return o; })();
function s3(t) {
  bgFinance(t, { tint: 'rgba(255,59,78,.18)', seed: 6, dot: '255,140,140' });
  const ph = t < 9.2 ? 0 : t < 11.3 ? 1 : 2;
  cam({ zoom: 1.03, t, shake: 2 + 10 * seg(t, 8.2, 8.5) * (1 - seg(t, 8.5, 9.0)) }, () => {
    if (ph === 0) { candles(90, 480, 900, 820, CS, seg(t, 6.6, 8.6)); if (t > 8.22) stampText('CRASH', W / 2, 1420, 160, RED, seg(t, 8.22, 8.5)); }
    else if (ph === 1) { vaultDoor(W / 2, 900, 380, 1.5 - 1.5 * eio(seg(t, 9.4, 10.5)), 0); const lk = eback(seg(t, 10.28, 10.6)); if (lk > 0) { ctx.save(); ctx.translate(W / 2, 900); ctx.scale(lk, lk); ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 36; ctx.beginPath(); ctx.arc(0, -80, 90, Math.PI, 0); ctx.stroke(); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.roundRect(-130, -80, 260, 210, 30); ctx.fill(); ctx.restore(); } }
    else { // ATM
      ctx.fillStyle = '#3a4252'; ctx.beginPath(); ctx.roundRect(W / 2 - 300, 480, 600, 900, 40); ctx.fill(); ctx.fillStyle = '#0a0e18'; ctx.fillRect(W / 2 - 230, 560, 460, 300);
      const blink = Math.sin(t * 8) > 0; txt('OUT OF', W / 2, 660, 80, blink ? RED : '#7a2a30', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('SERVICE', W / 2, 770, 80, blink ? RED : '#7a2a30', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
      ctx.fillStyle = '#1a1e28'; ctx.fillRect(W / 2 - 180, 1000, 360, 30); ctx.fillStyle = '#5a6272'; for (let i = 0; i < 12; i++) ctx.fillRect(W / 2 - 150 + (i % 3) * 110, 1080 + Math.floor(i / 3) * 60, 80, 40);
      stampX(W / 2, 1015, 160, seg(t, 12.78, 13.1)); }
  });
  kinetic(['WITHIN', 'HOURS'], W / 2, 220, 150, t, 5.9);
  if (ph === 1) bigText('BANKS LOCK UP', W / 2, 380, 120, GOLD, seg(t, 9.4, 9.7)); if (ph === 2) bigText('NO CASH', W / 2, 380, 140, RED, seg(t, 12.4, 12.65), { glow: RED });
}

// ---------- S4 14.86–23.22: tedarik zinciri, boş raflar, 3 gün ----------
function s4(t) {
  const shelves = t > 17.9;
  if (!shelves) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5a8ad8'); g.addColorStop(1, '#c8dcf0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    cam({ zoom: 1.03, t, shake: 2 }, () => { ctx.fillStyle = '#3a3a42'; ctx.fillRect(-300, 1200, W + 600, 700);
      const st = seg(t, 16.96, 17.6), x = lerp(-200, 280, eo(seg(t, 14.9, 16.6))); ctx.fillStyle = '#eef2f8'; ctx.fillRect(x, 900, 520, 300); ctx.fillStyle = RED; ctx.fillRect(x + 520, 980, 180, 220); ctx.fillStyle = '#9fd0ff'; ctx.fillRect(x + 580, 1000, 100, 70);
      ctx.fillStyle = '#111'; for (const wx of [x + 100, x + 400, x + 600]) { ctx.beginPath(); ctx.arc(wx, 1210, 45, 0, TAU); ctx.fill(); }
      // barkod + GPS kayboldu
      ctx.fillStyle = '#111'; for (let i = 0; i < 24; i++) ctx.fillRect(x + 80 + i * 14, 980, (i % 3 + 1) * 3, 120); offline('NO TRACKING', W / 2, 600, 70, st); });
    kinetic(['SUPPLY', 'CHAINS'], W / 2, 220, 160, t, 14.9, { hl: { CHAINS: GOLD } }); return; }
  darkGrad('#f2ecd8', '#c8bca0');
  const em = eio(seg(t, 18.6, 21.0));
  cam({ zoom: 1.04, t, shake: 2 }, () => {
    for (let r = 0; r < 4; r++) { const y = 460 + r * 250; ctx.fillStyle = '#8a7a6a'; ctx.fillRect(60, y + 170, 960, 20);
      const R = RN(r + 3); for (let i = 0; i < 12; i++) { if (R() < em * 1.1) continue; const x = 80 + i * 78; ctx.fillStyle = ['#ff3b4e', '#3da5ff', '#ffc83d', '#22e07a', '#ff8a3a', '#9b6bff'][(i + r) % 6]; ctx.beginPath(); ctx.roundRect(x, y + 50, 64, 120, 10); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(x + 8, y + 80, 48, 20); } }
    pill('PHARMACY', 830, 380, 50, GRN, seg(t, 19.26, 19.5));
  });
  kinetic(['GROCERY', 'STORES'], W / 2, 220, 150, t, 18.28);
  if (t > 20.82) { stampText('EMPTY', W / 2, 1300, 150, RED, seg(t, 20.82, 21.1)); offline('IN 3 DAYS', W / 2, 1450, 70, seg(t, 21.58, 21.8)); }
}

// ---------- S5 23.22–32.22: hastaneler, şebeke, su arıtma ----------
function s5(t) {
  darkGrad('#0a141a', '#020508');
  const grid = t > 26.2;
  cam({ zoom: 1.03, t, shake: 2 + (grid ? 6 * Math.max(0, Math.sin(t * 9)) * seg(t, 28.3, 29) : 0) }, () => {
    if (!grid) { // hasta monitörü
      ctx.fillStyle = '#2a3442'; ctx.beginPath(); ctx.roundRect(160, 480, 760, 620, 40); ctx.fill(); ctx.fillStyle = '#04080c'; ctx.fillRect(200, 520, 680, 460);
      ctx.strokeStyle = GRN; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 210; x < 870; x += 6) { const u = ((x / 660 + t * .5) % 1); ctx.lineTo(x, 650 + (u > .45 && u < .5 ? -80 * Math.sin((u - .45) / .05 * Math.PI) : 0)); } ctx.stroke();
      if (t > 23.82) { ctx.fillStyle = 'rgba(255,59,78,.15)'; ctx.fillRect(200, 760, 680, 200); txt('PATIENT RECORDS', W / 2, 820, 50, '#fff', { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); txt('NOT FOUND', W / 2, 900, 70, RED, { align: 'center', font: 'Anton', weight: 400, stroke: 0, glow: RED }); }
      // hastane haçı
      ctx.fillStyle = RED; ctx.fillRect(500, 1160, 80, 220); ctx.fillRect(430, 1230, 220, 80);
    } else { // elektrik direği kıvılcım + su vanası
      ctx.strokeStyle = '#9aa2b0'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(300, 1350); ctx.lineTo(380, 500); ctx.lineTo(460, 1350); ctx.moveTo(320, 1100); ctx.lineTo(440, 1100); ctx.moveTo(340, 850); ctx.lineTo(420, 850); ctx.moveTo(250, 600); ctx.lineTo(510, 600); ctx.stroke();
      ctx.strokeStyle = '#3a3a42'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(250, 600); ctx.quadraticCurveTo(-100, 700, -200, 640); ctx.moveTo(510, 600); ctx.quadraticCurveTo(800, 700, 1200, 640); ctx.stroke();
      if (Math.sin(t * 17) > .6) shards(510, 600, (t * 3) % 1, 16, Math.floor(t * 3), '#fff27a', 10, 260);
      // su arıtma tankı
      ctx.fillStyle = '#4a6a8a'; ctx.beginPath(); ctx.roundRect(640, 950, 340, 400, 30); ctx.fill(); ctx.fillStyle = '#3da5ff'; const lv = 1 - .7 * seg(t, 28.3, 31.5); ctx.fillRect(660, 1330 - 360 * lv, 300, 360 * lv);
      ctx.save(); ctx.translate(810, 920); ctx.rotate(t * (1 - seg(t, 28.3, 29.5)) * 3); ctx.strokeStyle = RED; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.moveTo(-50, 0); ctx.lineTo(50, 0); ctx.moveTo(0, -50); ctx.lineTo(0, 50); ctx.stroke(); ctx.restore();
      offline('OFFLINE', W / 2, 380, 90, seg(t, 29.66, 30.0)); }
  });
  if (!grid) kinetic(['HOSPITALS'], W / 2, 230, 170, t, 23.22, { hl: { HOSPITALS: RED } });
  else kinetic(['POWER', '&', 'WATER'], W / 2, 230, 150, t, 26.42, { hl: { WATER: '#3da5ff' } });
}

// ---------- S6 32.22–39.82: sosyal medya yok → yalnızlık ve panik ----------
function phone(x, y, s, t, dead) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#14161e'; ctx.beginPath(); ctx.roundRect(-s * .3, -s * .58, s * .6, s * 1.16, s * .08); ctx.fill(); ctx.fillStyle = '#05070c'; ctx.fillRect(-s * .26, -s * .5, s * .52, s * 1.0);
  const apps = [['#ff3b8a', 'SOCIAL'], ['#ff3b4e', 'STREAM'], ['#22e07a', 'CHAT'], ['#3da5ff', 'NEWS'], ['#ffc83d', 'SHOP'], ['#9b6bff', 'GAMES']];
  apps.forEach(([c, l], i) => { const ax = -s * .14 + (i % 2) * s * .28, ay = -s * .32 + Math.floor(i / 2) * s * .26, d = clamp(dead * 3 - i * .35); ctx.fillStyle = d > .5 ? '#3a3e48' : c; ctx.beginPath(); ctx.roundRect(ax - s * .1, ay - s * .1, s * .2, s * .2, s * .05); ctx.fill(); txt(l, ax, ay + s * .14, s * .035, '#fff', { align: 'center', stroke: 0 }); });
  if (dead > .3) { ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(-s * .26, s * .3, s * .52, s * .16); txt('NO CONNECTION', 0, s * .38, s * .05, RED, { align: 'center', font: 'Anton', weight: 400, stroke: 0 }); } ctx.restore(); }
function s6(t) {
  const late = t > 35.6;
  darkGrad(late ? '#1a0a14' : '#0a0a1a', '#020206');
  cam({ zoom: 1.03, t, shake: 2 + (late ? 8 * seg(t, 38.44, 38.8) : 0) }, () => {
    if (!late) phone(W / 2, 900, 900, t, seg(t, 32.32, 35.0));
    else { // pencerelerde yalnız insanlar
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const x = 160 + c * 380, y = 420 + r * 260, on = (r * 3 + c) % 4 !== 0; ctx.fillStyle = '#2a2230'; ctx.fillRect(x - 160, y - 110, 320, 230); ctx.fillStyle = on ? '#3a3040' : '#1a141e'; ctx.fillRect(x - 140, y - 90, 280, 190);
        ctx.fillStyle = '#05040a'; ctx.beginPath(); ctx.arc(x + Math.sin(t * 2 + r + c) * 30, y - 10, 26, 0, TAU); ctx.fill(); ctx.fillRect(x - 30 + Math.sin(t * 2 + r + c) * 30, y + 16, 60, 84);
        if (t > 38.44 && (r + c) % 2) { ctx.fillStyle = RED; txt('!', x + 80, y - 50, 70, RED, { align: 'center', font: 'Anton', weight: 400 }); } } }
  });
  if (!late) kinetic(['NO', 'SOCIAL', 'MEDIA'], W / 2, 220, 150, t, 32.22, { hl: { MEDIA: '#ff3b8a' } });
  else { kinetic(['BILLIONS', 'ISOLATED'], W / 2, 220, 140, t, 36.0, { hl: { ISOLATED: NET } }); if (t > 38.44) stampText('PANIC', W / 2, 1440, 150, RED, seg(t, 38.44, 38.7)); }
}

// ---------- S7 39.82–48.77: analog dünya: kağıt, nakit, yüz yüze ----------
function s7(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffcf8a'); g.addColorStop(1, '#c88a4a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1.4 - .12 * seg(t, 39.8, 48.7), y: 80, t, shake: 1 }, () => {
    // pazar tezgahları
    for (let i = 0; i < 3; i++) { const x = 180 + i * 360; ctx.fillStyle = ['#c0392b', '#2a7ad8', '#3a9a4a'][i]; ctx.beginPath(); ctx.moveTo(x - 160, 760); ctx.lineTo(x + 160, 760); ctx.lineTo(x + 140, 700); ctx.lineTo(x - 140, 700); ctx.fill(); ctx.fillStyle = '#fff'; for (let k = 0; k < 4; k++) ctx.fillRect(x - 140 + k * 80, 700, 40, 60);
      ctx.fillStyle = '#8a5a2a'; ctx.fillRect(x - 150, 950, 300, 40); ctx.fillRect(x - 140, 760, 14, 200); ctx.fillRect(x + 126, 760, 14, 200);
      for (let k = 0; k < 5; k++) { ctx.fillStyle = ['#ff8a3a', '#ffd23a', '#3ad06a', '#ff3b4e', '#9b6bff'][(k + i) % 5]; ctx.beginPath(); ctx.arc(x - 110 + k * 55, 930, 22, 0, TAU); ctx.fill(); } }
    ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-300, 1250, W + 600, 700);
    // yüz yüze konuşan insanlar
    for (let i = 0; i < 4; i++) { const x = 170 + i * 250; ctx.save(); ctx.translate(x, 1250); ctx.scale(i % 2 ? -1 : 1, 1); ctx.fillStyle = ['#2a3a5a', '#5a2a3a', '#2a5a3a', '#5a4a2a'][i]; ctx.beginPath(); ctx.arc(0, -260, 40, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(-50, -215, 100, 140, 26); ctx.fill(); ctx.fillRect(-40, -80, 30, 80); ctx.fillRect(10, -80, 30, 80); ctx.restore(); }
    // kağıt defter + nakit
    if (t > 44.82) { const k = eback(seg(t, 44.82, 45.2)); ctx.save(); ctx.translate(320, 1340); ctx.scale(k * .8, k * .8); ctx.rotate(-.1); ctx.fillStyle = '#f4efe0'; ctx.fillRect(-150, -90, 300, 180); ctx.fillStyle = '#8a7a6a'; for (let i = 0; i < 5; i++) ctx.fillRect(-120, -60 + i * 30, 240, 6); ctx.restore(); }
    if (t > 46.12) { const k = eback(seg(t, 46.12, 46.5)); ctx.save(); ctx.translate(760, 1340); ctx.scale(k * .8, k * .8); bill(0, 0, 320, .1); coin(-120, -60, 46, t * 4); ctx.restore(); }
  });
  kinetic(['ANALOG', 'WORLD'], W / 2, 230, 170, t, 43.2, { hl: { ANALOG: '#8a3a1a' } });
  if (t < 43.2) kinetic(['REBUILD'], W / 2, 230, 170, t, 42.6);
  if (t > 47.3) bigText('FACE-TO-FACE', W / 2, 420, 110, '#fff', seg(t, 47.3, 47.55), { glow: '#8a3a1a' });
}

window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const B = [0, 2.86, 5.9, 14.86, 23.22, 32.22, 39.82, 99], S = [s1, s2, s3, s4, s5, s6, s7];
  const w = B.slice(1, -1).map((s, i) => whip(t, s, .3, i % 2 ? -1 : 1));
  for (let i = 0; i < S.length; i++) { const a = B[i], b = B[i + 1]; if (t < a - .2 || t > b + .2) continue;
    const off = t < a + (b - a) / 2 ? (i > 0 ? w[i - 1].offB : 0) : (i < w.length ? w[i].offA : 0);
    cam({ y: off }, () => S[i](clamp(t, a, b + .2))); }
  motionStreak(Math.max(...w.map(x => x.blur)));
  glitch((t > 1.4 && t < 1.7 ? 1 : 0) + (t > 8.22 && t < 8.4 ? .7 : 0) + (t > 32.32 && t < 32.5 ? .6 : 0), Math.floor(t * 60));
  subs(t, SUBY);
};
