// 1.video — "What If the Moon Suddenly Disappeared?" (The Void Scenario) — 1080×1920, 30 fps, kodla çizim.
window.DUR = 35.47;
const SUBY = 1540;

// ---------------- ortak çizimler ----------------
function space(t, seed = 1, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, o.top || '#05060f'); g.addColorStop(1, o.bot || '#0b1030');
  ctx.fillStyle = g; ctx.fillRect(-500, -500, W + 1000, H + 1000);
  if (o.neb !== false) { const R0 = RN(seed + 50); for (let i = 0; i < 4; i++) { const x = R0() * W, y = R0() * H, r = 500 + R0() * 500, rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, i % 2 ? 'rgba(90,60,200,.16)' : 'rgba(40,110,220,.14)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(x - r, y - r, r * 2, r * 2); } }
  const R = RN(seed), drift = o.drift ?? 12;
  for (let i = 0; i < (o.n || 260); i++) { const x = (R() * (W + 400) - 200 + t * drift * (.3 + R())) % (W + 400) - 100, y = R() * (H + 200) - 100, r = R() * R() * 3.2 + .4, tw = .55 + .45 * Math.sin(t * (2 + R() * 4) + i);
    ctx.fillStyle = `rgba(${R() > .85 ? '255,220,180' : '220,230,255'},${(.35 + R() * .65) * tw})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
}
// kıtalar: boylam/enlem üzerinde rastgele yürüyen daire kümeleri
const CONT = (() => { const R = RN(42), out = []; for (let c = 0; c < 7; c++) { let lon = R() * TAU, lat = (R() - .5) * 2.2; for (let i = 0; i < 34; i++) { lon += (R() - .5) * .32; lat = clamp(lat + (R() - .5) * .28, -1.35, 1.35); out.push([lon, lat, .1 + R() * .17, c]); } } return out; })();
function earth(x, y, r, t, o = {}) {
  const rot = o.rot ?? t * .35;
  ctx.save(); ctx.translate(x, y);
  const halo = ctx.createRadialGradient(0, 0, r * .9, 0, 0, r * 1.35); halo.addColorStop(0, 'rgba(90,170,255,.45)'); halo.addColorStop(1, 'rgba(90,170,255,0)');
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, r * 1.35, 0, TAU); ctx.fill();
  ctx.rotate(o.tilt || 0);
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
  const sea = ctx.createRadialGradient(-r * .35, -r * .35, r * .1, 0, 0, r); sea.addColorStop(0, o.sea0 || '#2f8ee8'); sea.addColorStop(1, o.sea1 || '#0a2f6e');
  ctx.fillStyle = sea; ctx.fillRect(-r, -r, r * 2, r * 2);
  for (const [lon, lat, s, c] of CONT) { const l = lon + rot, z = Math.cos(lat) * Math.cos(l); if (z < -.1) continue;
    const px = r * Math.cos(lat) * Math.sin(l), py = -r * Math.sin(lat), rr = r * s;
    ctx.fillStyle = Math.abs(lat) > 1.28 ? '#e8f2ff' : (o.land || ['#3f9b4c', '#5aa84a', '#a08a4a', '#4c8f3e'][c % 4]);
    ctx.beginPath(); ctx.ellipse(px, py, rr * Math.max(.15, z), rr * Math.max(.4, Math.sqrt(Math.max(0, 1 - Math.sin(lat) ** 2 * .3))), 0, 0, TAU); ctx.fill(); }
  // bulutlar
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const l = i * .7 + rot * 1.3, la = Math.sin(i * 2.1) * .9, z = Math.cos(la) * Math.cos(l); if (z < 0) continue;
    ctx.lineWidth = r * .035; ctx.beginPath(); const px = r * Math.cos(la) * Math.sin(l), py = -r * Math.sin(la); ctx.moveTo(px - r * .14 * z, py); ctx.lineTo(px + r * .14 * z, py + r * .02); ctx.stroke(); }
  if (o.pings) o.pings(r, rot);
  ctx.restore();
  ctx.rotate(-(o.tilt || 0));
  const sh = ctx.createLinearGradient(-r * .2, 0, r * 1.05, 0); sh.addColorStop(0, 'rgba(0,0,10,0)'); sh.addColorStop(1, 'rgba(0,0,10,.82)');
  ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(150,210,255,.7)'; ctx.lineWidth = r * .02; ctx.beginPath(); ctx.arc(0, 0, r * 1.005, 0, TAU); ctx.stroke();
  if (o.axis) { ctx.rotate(o.tilt || 0); ctx.strokeStyle = o.axisCol || '#ffffff'; ctx.lineWidth = 7; ctx.setLineDash([26, 14]); ctx.beginPath(); ctx.moveTo(0, -r * 1.45); ctx.lineTo(0, r * 1.45); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = o.axisCol || '#fff'; ctx.beginPath(); ctx.arc(0, -r * 1.45, 12, 0, TAU); ctx.fill(); }
  ctx.restore();
}
const CRAT = (() => { const R = RN(9); return Array.from({ length: 22 }, () => [(R() - .5) * 1.5, (R() - .5) * 1.5, .05 + R() * .16]).filter(c => Math.hypot(c[0], c[1]) + c[2] < .95); })();
function moon(x, y, r, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  const gl = ctx.createRadialGradient(0, 0, r * .8, 0, 0, r * 1.8); gl.addColorStop(0, `rgba(230,235,255,${.35 * (o.glow ?? 1)})`); gl.addColorStop(1, 'rgba(230,235,255,0)');
  ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, r * 1.8, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(-r * .35, -r * .35, r * .1, 0, 0, r); g.addColorStop(0, '#f4f4ef'); g.addColorStop(.7, '#bdbdb6'); g.addColorStop(1, '#7c7c78');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  for (const [cx, cy, cr] of CRAT) { ctx.fillStyle = 'rgba(90,90,95,.35)'; ctx.beginPath(); ctx.arc(cx * r, cy * r, cr * r, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = r * .012; ctx.beginPath(); ctx.arc(cx * r + 2, cy * r + 2, cr * r, 3.6, 5.6); ctx.stroke(); }
  if (o.crack > 0) { const R = RN(3); ctx.strokeStyle = '#ffe2b0'; ctx.shadowColor = '#ff8a3d'; ctx.shadowBlur = 30; ctx.lineCap = 'round';
    for (let k = 0; k < 9; k++) { let a = R() * TAU, px = 0, py = 0; ctx.lineWidth = r * (.03 - k * .002); ctx.beginPath(); ctx.moveTo(0, 0);
      const n = Math.floor(7 * clamp(o.crack * 1.3 - k * .06)); for (let i = 0; i < n; i++) { a += (R() - .5) * .9; px += Math.cos(a) * r * .15; py += Math.sin(a) * r * .15; ctx.lineTo(px, py); } ctx.stroke(); } }
  ctx.restore();
}
function dashedGhost(x, y, r, t, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(200,215,255,.55)'; ctx.lineWidth = 6; ctx.setLineDash([22, 18]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); }
function shards(x, y, p, n, seed, col, sz = 18, spd = 900) { if (p <= 0 || p >= 1) return; const R = RN(seed); for (let i = 0; i < n; i++) { const a = R() * TAU, v = spd * (.3 + R()), d = v * eo(p), s = sz * (.4 + R()) * (1 - p * .7);
    ctx.save(); ctx.globalAlpha = 1 - p; ctx.translate(x + Math.cos(a) * d, y + Math.sin(a) * d + p * p * 200); ctx.rotate(p * 8 * (R() - .5) * 3); ctx.fillStyle = typeof col === 'function' ? col(R()) : col;
    ctx.beginPath(); ctx.moveTo(-s, -s * .6); ctx.lineTo(s, -s * .3); ctx.lineTo(s * .2, s); ctx.closePath(); ctx.fill(); ctx.restore(); } }
function ring2(x, y, p, r1, col, w = 10) { if (p <= 0 || p >= 1) return; ctx.save(); ctx.globalAlpha = 1 - p; ctx.strokeStyle = col; ctx.lineWidth = w * (1 - p) + 1; ctx.beginPath(); ctx.arc(x, y, r1 * eo(p), 0, TAU); ctx.stroke(); ctx.restore(); }
function glitch(amt, seed) { if (amt <= .02) return; const R = RN(seed); for (let i = 0; i < 10; i++) { const y = R() * H, h = 20 + R() * 120, dx = (R() - .5) * 160 * amt;
  ctx.drawImage(cv, 0, y, W, h, dx, y, W, h); } ctx.fillStyle = `rgba(255,40,70,${.12 * amt})`; ctx.fillRect(0, 0, W, H); }
function skyline(y, t, o = {}) {
  const R = RN(o.seed || 5); let x = -40; const out = [];
  while (x < W + 40) { const w = 60 + R() * 90, h = 120 + R() * (o.tall || 380); out.push([x, w, h, R()]); x += w + 6; }
  for (const [bx, w, h, s] of out) { const k = o.fall ? o.fall(bx + w / 2) : 0; if (k >= 1) continue;
    ctx.save(); ctx.translate(bx + w / 2, y + k * h * .6); ctx.rotate(-k * .7 * (s > .5 ? 1 : .6)); ctx.globalAlpha = 1 - k * .6;
    ctx.fillStyle = o.col || '#0c1226'; ctx.fillRect(-w / 2, -h, w, h);
    const R2 = RN(Math.floor(s * 1e5)); for (let wy = -h + 18; wy < -14; wy += 28) for (let wx = -w / 2 + 10; wx < w / 2 - 14; wx += 22) if (R2() > .45) { ctx.fillStyle = `rgba(255,${200 + R2() * 40},120,${.5 + .4 * Math.sin(t * 3 + wx + wy)})`; ctx.fillRect(wx, wy, 10, 14); }
    ctx.restore(); }
}
function bigText(s, x, y, size, col, p, o = {}) { if (p <= 0) return; const e = eback(clamp(p)); ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.globalAlpha = clamp(p * 3);
  txt(s, 0, 0, fit(s, size, o.maxW || (x < 500 ? 620 : 980), 'Anton', 400), col, { align: 'center', font: 'Anton', weight: 400, glow: o.glow, blur: 50 }); ctx.restore(); }

// ---------------- S1 0–3.4: ay çatlar ve yok olur (hook) ----------------
function s1(t) {
  space(t, 1);
  const z = 1.18 - .18 * eo(seg(t, 0, 1.4));
  cam({ zoom: z, t, shake: t > 1.35 && t < 2.1 ? 22 * (1 - seg(t, 1.35, 2.1)) : 3 }, () => {
    earth(W / 2, 2650, 1250, t, { rot: t * .15 + 2 });
    const k = seg(t, 1.4, 1.95), r = 300 * (1 - ei(k) * .999) * (1 + .04 * Math.sin(t * 40) * seg(t, .9, 1.4));
    if (k < 1) moon(W / 2 + Math.sin(t * 50) * 6 * seg(t, .8, 1.4), 640, r, { crack: seg(t, .15, 1.4), rot: t * .1 });
    dashedGhost(W / 2, 640, 300, t, seg(t, 1.9, 2.4));
    shards(W / 2, 640, seg(t, 1.4, 3.2), 70, 11, R => R > .5 ? '#d6d6cf' : '#ffcf8a', 26, 1100);
    ring2(W / 2, 640, seg(t, 1.4, 2.3), 900, '#ffd9a0', 30);
  });
  kinetic(['WHAT', 'IF', 'THE', 'MOON'], W / 2, 1140, 150, t, 0, { gap: .06 });
  kinetic(['VANISHED?'], W / 2, 1310, 190, t, 1.35, { hl: { 'VANISHED?': C.red } });
  flash(t, 1.4, .3, '255,230,200');
}

// ---------------- S2 3.4–6.5: gece gökyüzü çapasını kaybeder ----------------
function anchor(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = '#cfd8ea'; ctx.lineWidth = s * .09; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -s * .55, s * .13, 0, TAU); ctx.moveTo(0, -s * .42); ctx.lineTo(0, s * .5); ctx.moveTo(-s * .3, -s * .2); ctx.lineTo(s * .3, -s * .2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, s * .52, .35, Math.PI - .35); ctx.stroke();
  ctx.fillStyle = '#cfd8ea'; for (const sx of [-1, 1]) { const a = sx > 0 ? .35 : Math.PI - .35, px = Math.cos(a) * s * .52, py = Math.sin(a) * s * .52; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + sx * s * .14, py - s * .2); ctx.lineTo(px - sx * s * .06, py - s * .12); ctx.fill(); } ctx.restore(); }
function s2(t) {
  const lt = t - 3.36;
  cam({ zoom: 1.08 - .06 * seg(t, 3.3, 6.5), y: -30 * lt, t }, () => {
    ctx.save(); ctx.translate(W / 2, 1500); ctx.rotate(lt * .05); ctx.translate(-W / 2, -1500); space(t, 4, { top: '#020310', bot: '#121a3f', n: 340, drift: 0 }); ctx.restore();
    dashedGhost(W / 2, 560, 230, t, 1);
    txt('?', W / 2, 560, 200, 'rgba(200,215,255,.5)', { align: 'center', font: 'Anton', weight: 400, stroke: 0 });
    // zincire bağlı çapa — "anchor" kelimesinde kopar
    const brk = 5.72, fall = seg(t, brk, brk + 1.1), sw = Math.sin(t * 2.4) * .12 * (1 - fall);
    ctx.save(); ctx.translate(W / 2, 700); ctx.rotate(sw);
    for (let i = 0; i < 7; i++) { const yy = i * 46, drop = i > 4 ? ei(fall) * 900 : 0; ctx.strokeStyle = '#9aa7c0'; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(0, yy + drop, i % 2 ? 6 : 16, 24, 0, 0, TAU); ctx.stroke(); }
    anchor(0, 300 + 200 + ei(fall) * 1000, 420, fall * 1.2);
    ctx.restore();
    shards(W / 2, 1050, seg(t, brk, brk + .8), 18, 4, '#cfd8ea', 12, 400);
    const gr = ctx.createLinearGradient(0, 1250, 0, H); gr.addColorStop(0, 'rgba(10,14,35,0)'); gr.addColorStop(.3, '#070a18'); ctx.fillStyle = gr; ctx.fillRect(-200, 1250, W + 400, 900);
    skyline(1720, t, { seed: 8, tall: 300 });
  });
  // kronometre
  const sec = Math.min(3, Math.floor(seg(t, 3.4, 4.6) * 3.99));
  ctx.save(); ctx.globalAlpha = seg(t, 3.36, 3.6); txt('00:0' + sec, W / 2, 190, 130, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold, blur: 30 });
  txt('SECONDS', W / 2, 300, 50, '#fff', { align: 'center', stroke: 8 }); ctx.restore();
  bigText('ANCHOR LOST', W / 2, 1310, 150, C.red, seg(t, 5.72, 6.0), { glow: C.red });
}

// ---------------- S3 6.5–9.3: okyanuslar — gelgit şişkinliği çöker ----------------
function s3(t) {
  space(t, 6, { top: '#0a0208', bot: '#1d0610' });
  const alarm = .5 + .5 * Math.sin(t * 9); ctx.fillStyle = `rgba(255,30,50,${.1 + .1 * alarm})`; ctx.fillRect(0, 0, W, H);
  cam({ zoom: 1 + .1 * seg(t, 6.5, 9.3), t, shake: t > 8.2 ? 10 : 2 }, () => {
    const cx = W / 2, cy = 900, r = 380;
    // gelgit su kabuğu: ay yönünde uzamış → "oceans" anında serbest kalıp çalkalanır
    const rel = seg(t, 8.24, 9.4), osc = rel > 0 ? Math.cos(rel * 18) * Math.exp(-rel * 2.5) : 1;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.5);
    ctx.fillStyle = 'rgba(70,170,255,.42)'; ctx.beginPath(); ctx.ellipse(0, 0, r * (1.08 + .18 * osc), r * (1.08 - .07 * osc), 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(160,220,255,.8)'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
    earth(cx, cy, r, t, { rot: t * .5 });
    for (let i = 0; i < 3; i++) ring2(cx, cy, seg(t, 8.24 + i * .25, 9.3 + i * .25), 900, 'rgba(120,200,255,.9)', 14);
  });
  kinetic(['THE', 'REAL'], W / 2, 260, 120, t, 6.6);
  kinetic(['NIGHTMARE'], W / 2, 410, 200, t, 7.2, { hl: { NIGHTMARE: C.red } });
  bigText('OCEANS', W / 2, 1430, 170, C.blue, seg(t, 8.24, 8.55), { glow: C.blue });
}

// ---------------- S4 9.3–15.4: mil yüksekliğinde tsunami ----------------
function wave(front, base, h, t) {
  if (h < 5) return;
  const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, '#5fd3ff'); g.addColorStop(.4, '#1676c9'); g.addColorStop(1, '#062a5c');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W + 900, base + 400); ctx.lineTo(W + 900, base - h * .35);
  ctx.bezierCurveTo(front + h * 1.2, base - h * .55, front + h * .75, base - h * 1.05, front + h * .25, base - h);
  ctx.bezierCurveTo(front - h * .1, base - h * .97, front - h * .32, base - h * .82, front - h * .3, base - h * .62);
  ctx.bezierCurveTo(front - h * .22, base - h * .52, front - h * .08, base - h * .6, front - h * .02, base - h * .68);
  ctx.bezierCurveTo(front + h * .02, base - h * .45, front + h * .02, base - h * .15, front - h * .2, base + 400); ctx.closePath(); ctx.fill();
  const tg = ctx.createRadialGradient(front - h * .08, base - h * .72, 0, front - h * .08, base - h * .72, h * .3); tg.addColorStop(0, 'rgba(0,15,40,.7)'); tg.addColorStop(1, 'rgba(0,15,40,0)');
  ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(front - h * .08, base - h * .72, h * .3, 0, TAU); ctx.fill();
  // köpük
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = h * .035; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(front + h * .75, base - h * .9); ctx.bezierCurveTo(front + h * .5, base - h * 1.03, front, base - h * 1.0, front - h * .28, base - h * .78); ctx.stroke();
  const R = RN(21); ctx.fillStyle = 'rgba(235,250,255,.8)';
  for (let i = 0; i < 70; i++) { const a = R(), px = front - h * .2 + (R() - .3) * h * .7 + Math.sin(t * 3 + i) * 20, py = base - h * (.8 + R() * .3) - ((t * 200 + R() * 300) % 260);
    ctx.beginPath(); ctx.arc(px, py, 3 + a * 9, 0, TAU); ctx.fill(); }
  // dalga yüzü çizgileri
  ctx.strokeStyle = 'rgba(180,235,255,.25)'; ctx.lineWidth = 6;
  for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(front + h * (.2 + i * .15), base - h * (.97 - i * .1)); ctx.quadraticCurveTo(front + h * (.1 + i * .14), base - h * .45, front + h * (.15 + i * .18), base); ctx.stroke(); }
}
function s4a(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#1a0e1f'); sky.addColorStop(.55, '#6b2a2e'); sky.addColorStop(1, '#0a0d1a'); ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, H + 600);
  const base = 1720, rise = eo(seg(t, 9.4, 11.6)), hit = seg(t, 12.6, 13.9);
  const h = 260 + 1080 * rise, front = lerp(W + 250, 640, eo(seg(t, 9.4, 11.6))) - 1300 * eio(hit);
  cam({ zoom: 1.05 - .08 * rise + .05 * hit, t, shake: 4 + 16 * rise + 30 * Math.sin(hit * Math.PI) }, () => {
    ctx.fillStyle = '#0d1d3a'; ctx.fillRect(-300, base - 30, W + 600, 600);
    skyline(base, t, { seed: 13, tall: 420, col: '#120d1c', fall: bx => hit > 0 ? clamp((bx - front + h * .1) / 320) : 0 });
    wave(front, base, h, t);
    shards(front - h * .1, base - 200, seg(t, 12.7, 13.9), 40, 33, '#0c1226', 30, 700);
  });
  // yükseklik ölçer
  const ft = Math.round(5280 * eo(seg(t, 10.1, 11.4)));
  ctx.save(); ctx.globalAlpha = seg(t, 9.6, 9.9) * (1 - seg(t, 13.6, 13.9));
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.roundRect(50, 150, 460, 240, 30); ctx.fill();
  txt(ft.toLocaleString('en-US') + ' FT', 280, 235, fit(ft.toLocaleString('en-US') + ' FT', 110, 420, 'Anton', 400), '#5fd3ff', { align: 'center', font: 'Anton', weight: 400, glow: '#5fd3ff' });
  txt(ft >= 5280 ? '= 1 MILE HIGH' : 'WAVE HEIGHT', 280, 335, 44, '#fff', { align: 'center', stroke: 7 }); ctx.restore();
  bigText('MEGA-TSUNAMI', W / 2, 470, 150, '#fff', seg(t, 11.2, 11.5), { glow: '#5fd3ff' });
  flash(t, 12.64, .25, '200,240,255');
}
function s4b(t) { // dünya çapında kıyı alarmları
  space(t, 14);
  cam({ zoom: 1 + .12 * seg(t, 13.6, 15.5), t, shake: 3 }, () => {
    earth(W / 2, 880, 430, t, { rot: t * .6, pings: (r, rot) => { const R = RN(77); for (let i = 0; i < 26; i++) { const c = CONT[Math.floor(R() * CONT.length)], l = c[0] + rot, z = Math.cos(c[1]) * Math.cos(l); if (z < .1) continue;
      const px = r * Math.cos(c[1]) * Math.sin(l), py = -r * Math.sin(c[1]), p = ((t * .9 + R()) % 1); if (t < 13.9 + i * .03) continue;
      ctx.strokeStyle = `rgba(255,60,80,${1 - p})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(px, py, 8 + p * 60, 0, TAU); ctx.stroke(); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(px, py, 9, 0, TAU); ctx.fill(); } } });
  });
  kinetic(['COASTAL', 'CITIES'], W / 2, 260, 140, t, 13.4);
  bigText('WORLDWIDE', W / 2, 1420, 190, C.red, seg(t, 14.08, 14.4), { glow: C.red });
}

// ---------------- S5 15.4–18.4 / S6 18.4–21.4: eksen eğikliği → topaç gibi sallanma ----------------
function tiltAt(t) { const w = seg(t, 18.44, 21.4); return (23.4 + 40 * w * Math.sin(t * 5.5) * (.6 + .4 * Math.sin(t * 2.1)) + Math.sin(t * 30) * 2 * seg(t, 17.6, 18.4)) * Math.PI / 180; }
function top_(x, y, s, t, k) { // ölmekte olan topaç
  const wob = .1 + .55 * k, a = Math.sin(t * 7) * wob; ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  const g = ctx.createLinearGradient(-s * .5, 0, s * .5, 0); g.addColorStop(0, '#ff4d5e'); g.addColorStop(.5, '#ffd36b'); g.addColorStop(1, '#a3122a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * .5, -s * .6); ctx.quadraticCurveTo(0, -s * .85, s * .5, -s * .6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { const o = ((t * 9 + i / 3) % 1) - .5; ctx.beginPath(); ctx.moveTo(o * s * .9, -s * .62); ctx.lineTo(o * s * .4, -s * .3); ctx.stroke(); }
  ctx.fillStyle = '#ddd'; ctx.fillRect(-8, -s * .95, 16, s * .25); ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(x, y + 6, s * .4, 14, 0, 0, TAU); ctx.fill();
}
function s5(t) {
  space(t, 21);
  const tl = tiltAt(t), wob = seg(t, 18.44, 21.4);
  cam({ zoom: 1 + .06 * Math.sin(t * .8), x: Math.sin(t * 4) * 30 * wob, t, shake: 4 + 14 * wob }, () => {
    const ex = W / 2, ey = 860, r = 360;
    // ayın çekim bağı — "gravity"de kaybolur
    const gone = seg(t, 16.1, 16.8), mx = 930, my = 300;
    if (gone < 1) { ctx.save(); ctx.globalAlpha = 1 - gone; ctx.strokeStyle = 'rgba(200,220,255,.6)'; ctx.lineWidth = 4; ctx.setLineDash([18, 16]); ctx.lineDashOffset = -t * 60;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(mx, my); ctx.quadraticCurveTo((mx + ex) / 2 + i * 30, (my + ey) / 2, ex + i * 60, ey - r * .6); ctx.stroke(); } ctx.setLineDash([]);
      moon(mx, my, 90 * (1 - ei(gone)), { glow: .6 }); ctx.restore(); }
    dashedGhost(mx, my, 90, t, gone * (1 - wob));
    earth(ex, ey, r, t, { rot: t * 1.4, tilt: tl, axis: true, axisCol: wob > .05 ? C.red : '#fff' });
    // açı yayı
    ctx.save(); ctx.translate(ex, ey); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.setLineDash([10, 10]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -r * 1.6); ctx.lineTo(0, -r * 1.2); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, r * 1.3, -Math.PI / 2, -Math.PI / 2 + tl, tl < 0); ctx.stroke(); ctx.restore();
  });
  const deg = Math.abs(tl * 180 / Math.PI);
  txt((wob > .02 ? deg.toFixed(0) : deg.toFixed(1)) + '°', W / 2, 1360, 150, wob > .05 ? C.red : C.gold, { align: 'center', font: 'Anton', weight: 400, glow: wob > .05 ? C.red : C.gold });
  bigText('AXIAL TILT', W / 2, 200, 130, '#fff', seg(t, 17.1, 17.4) * (1 - seg(t, 18.3, 18.5)));
  bigText("MOON'S GRAVITY", W / 2, 200, 110, '#cfd8ff', seg(t, 15.5, 15.8) * (1 - seg(t, 17.0, 17.2)));
  if (wob > 0) { bigText('WOBBLE!', W / 2, 200, 170, C.red, seg(t, 19.3, 19.6), { glow: C.red });
    const k = seg(t, 19.9, 20.3); if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.roundRect(700, 1060, 330, 330, 40); ctx.fill(); top_(865, 1340, 220, t, seg(t, 20, 21.4)); ctx.restore(); } }
}

// ---------------- S7 21.4–25.7: iklim parçalanır → kaos ----------------
function s7(t) {
  const lt = t - 21.44, split = eo(seg(t, 21.44, 22.0));
  // üst: donmuş dünya / alt: yanan dünya
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H / 2 - 8 * split); ctx.clip();
  const ic = ctx.createLinearGradient(0, 0, 0, H / 2); ic.addColorStop(0, '#cfe9ff'); ic.addColorStop(1, '#3b78b8'); ctx.fillStyle = ic; ctx.fillRect(0, 0, W, H);
  const R = RN(5); ctx.fillStyle = '#fff'; for (let i = 0; i < 90; i++) { const x = (R() * W + Math.sin(t + i) * 40 + t * 120) % W, y = (R() * H / 2 + t * (90 + R() * 160)) % (H / 2); ctx.beginPath(); ctx.arc(x, y, 3 + R() * 6, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#e8f6ff'; ctx.beginPath(); ctx.moveTo(0, 960); for (let x = 0; x <= W; x += 90) ctx.lineTo(x, 800 + Math.sin(x * .02) * 60 - (x % 180 ? 90 : 0)); ctx.lineTo(W, 960); ctx.fill();
  txt('-70°C', 400, 420, 200, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#7fd0ff', strokeCol: '#1b4f8a' });
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 + 8 * split, W, H); ctx.clip();
  const fi = ctx.createLinearGradient(0, H / 2, 0, H); fi.addColorStop(0, '#ff9a2e'); fi.addColorStop(1, '#5a0b0b'); ctx.fillStyle = fi; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 14; i++) { const x = i * 85 + Math.sin(t * 6 + i) * 18, hh = 180 + 110 * Math.sin(t * 7 + i * 1.7); const g = ctx.createLinearGradient(0, H - hh - 200, 0, H);
    g.addColorStop(0, 'rgba(255,230,120,0)'); g.addColorStop(.5, 'rgba(255,140,40,.9)'); g.addColorStop(1, 'rgba(200,30,20,1)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 70, H); ctx.quadraticCurveTo(x - 10, H - hh, x + Math.sin(t * 9 + i) * 30, H - hh - 200); ctx.quadraticCurveTo(x + 20, H - hh, x + 70, H); ctx.fill(); }
  txt('+60°C', 400, 1260, 200, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#ff6a00', strokeCol: '#6a1200' });
  ctx.restore();
  // ortada termometre çılgınca savrulur
  const sw = Math.sin(t * 6) * (.6 + .4 * Math.sin(t * 2.3));
  ctx.save(); ctx.translate(880 + Math.sin(t * 13) * 10, H / 2);
  ctx.fillStyle = '#f2f4f8'; ctx.beginPath(); ctx.roundRect(-34, -330, 68, 560, 34); ctx.fill(); ctx.beginPath(); ctx.arc(0, 260, 70, 0, TAU); ctx.fill();
  const col = sw > 0 ? '#ff3b2e' : '#2f8ee8', lvl = 260 - (290 + sw * 260); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 260, 52, 0, TAU); ctx.fill(); ctx.fillRect(-18, lvl, 36, 260 - lvl);
  ctx.restore();
  // çatlak — "shattering"
  const ck = seg(t, 21.44, 21.8); if (ck > 0) { ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.shadowColor = '#fff'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.moveTo(0, H / 2); const R2 = RN(8);
    for (let x = 0; x <= W * ck; x += 60) ctx.lineTo(x, H / 2 + (R2() - .5) * 70); ctx.stroke(); ctx.restore(); }
  bigText('CLIMATE', 400, 640, 120, '#fff', seg(t, 22.3, 22.6) * (1 - seg(t, 24.4, 24.6)));
  bigText('SHATTERED', 400, 1120, 130, '#fff', seg(t, 22.5, 22.8) * (1 - seg(t, 24.4, 24.6)), { glow: '#ff6a00' });
  // kaos
  const ch = seg(t, 24.58, 24.9); if (ch > 0) { ctx.fillStyle = `rgba(0,0,0,${.55 * ch})`; ctx.fillRect(0, 0, W, H); stampText('CHAOS', W / 2, H / 2 - 120, 230, C.red, ch); }
}

// ---------------- S8 25.7–29.2: insanlık hayatta kalabilir mi? ----------------
function human(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#05060c'; ctx.beginPath(); ctx.arc(0, -s * .9, s * .12, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-s * .16, -s * .76); ctx.lineTo(s * .16, -s * .76); ctx.lineTo(s * .12, -s * .35); ctx.lineTo(s * .14, 0); ctx.lineTo(s * .04, 0); ctx.lineTo(0, -s * .3); ctx.lineTo(-s * .04, 0); ctx.lineTo(-s * .14, 0); ctx.lineTo(-s * .12, -s * .35); ctx.closePath(); ctx.fill();
  ctx.lineWidth = s * .07; ctx.strokeStyle = '#05060c'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * .15, -s * .72); ctx.lineTo(-s * .22, -s * .38); ctx.moveTo(s * .15, -s * .72); ctx.lineTo(s * .22, -s * .38); ctx.stroke(); ctx.restore(); }
function s8(t) {
  const lt = t - 25.7;
  cam({ zoom: 1.15 - .12 * eo(seg(t, 25.7, 29.2)), y: 40 - lt * 20, t, shake: 2 }, () => {
    space(t, 31, { top: '#02030a', bot: '#1a1030', n: 420, drift: 6 });
    dashedGhost(W / 2, 520, 200, t, .8);
    // şimşek
    const lz = (t * 1.3) % 1; if (lz < .08) { ctx.strokeStyle = 'rgba(220,220,255,.9)'; ctx.lineWidth = 6; ctx.shadowColor = '#aab4ff'; ctx.shadowBlur = 30; ctx.beginPath(); const R = RN(Math.floor(t * 1.3)); let x = 150 + R() * 780, y = 0; ctx.moveTo(x, y);
      while (y < 1200) { x += (R() - .5) * 120; y += 60 + R() * 80; ctx.lineTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(180,190,255,.12)'; ctx.fillRect(-200, -200, W + 400, H + 400); }
    // kayalık
    ctx.fillStyle = '#07080f'; ctx.beginPath(); ctx.moveTo(-200, H + 200); ctx.lineTo(-200, 1330); ctx.lineTo(200, 1280); ctx.lineTo(420, 1250); ctx.lineTo(640, 1262); ctx.lineTo(760, 1330); ctx.lineTo(1000, 1420); ctx.lineTo(W + 200, 1400); ctx.lineTo(W + 200, H + 200); ctx.fill();
    ctx.save(); ctx.shadowColor = 'rgba(160,180,255,.9)'; ctx.shadowBlur = 40; human(540, 1256, 330); ctx.restore();
    ctx.strokeStyle = 'rgba(255,200,120,.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 1080, 220 + Math.sin(t * 3) * 10, 0, TAU); ctx.stroke();
  });
  kinetic(['COULD', 'HUMANITY'], W / 2, 210, 130, t, 25.75);
  kinetic(['SURVIVE?'], W / 2, 370, 190, t, 26.9, { hl: { 'SURVIVE?': C.gold } });
  bigText('MOONLESS WORLD', W / 2, 1420, 120, '#cfd8ff', seg(t, 28.5, 28.8), { glow: '#7f8cff' });
}

// ---------------- S9 29.2–35.47: CTA ----------------
const THEO = ['Underground cities!', 'Build an artificial moon', 'Humans would adapt', 'Everyone to Mars', 'Earth would be fine', 'Game over for us'];
function s9(t) {
  bgFinance(t, { tint: 'rgba(120,80,255,.22)', seed: 9, dot: '170,150,255' });
  // yorum balonları
  THEO.forEach((s, i) => { const t0 = 29.4 + i * .3, p = seg(t, t0, t0 + .4); if (p <= 0) return; const e = eback(p), y = 330 + i * 150 - (t - t0) * 25, x = i % 2 ? 600 : 470;
    ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.globalAlpha = clamp(p * 3) * (1 - seg(t, 32.0, 32.4));
    ctx.font = '800 46px Montserrat'; const w = ctx.measureText(s).width + 150; ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.roundRect(-w / 2, -50, w, 100, 50); ctx.fill();
    ctx.fillStyle = ['#ff3b4e', '#3da5ff', '#22e07a', '#ffc83d', '#9b6bff', '#ff8a3d'][i]; ctx.beginPath(); ctx.arc(-w / 2 + 52, 0, 30, 0, TAU); ctx.fill();
    txt(s, -w / 2 + 100, 2, 46, '#111', { weight: 800, stroke: 0 }); ctx.restore(); });
  // abone ol butonu — "subscribe"
  const sp = seg(t, 30.9, 31.3), press = seg(t, 31.52, 31.7), done = t > 31.7;
  if (sp > 0 && t < 32.3) { ctx.save(); ctx.translate(W / 2, 1290); const sc = eback(sp) * (1 - .08 * Math.sin(press * Math.PI)); ctx.scale(sc, sc);
    ctx.fillStyle = done ? '#3a3f4b' : '#ff1e3c'; ctx.beginPath(); ctx.roundRect(-300, -75, 600, 150, 75); ctx.fill();
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 66, '#fff', { align: 'center', stroke: 0 }); ctx.restore();
    const hx = lerp(900, 600, eio(seg(t, 31.0, 31.5))), hy = lerp(1600, 1330, eio(seg(t, 31.0, 31.5))) + 12 * Math.sin(press * Math.PI);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 26, hy + 90); ctx.lineTo(hx + 44, hy + 58); ctx.lineTo(hx + 82, hy + 92); ctx.lineTo(hx + 96, hy + 76); ctx.lineTo(hx + 60, hy + 44); ctx.lineTo(hx + 92, hy + 32); ctx.closePath(); ctx.fill(); ctx.stroke();
    ring2(W / 2, 1290, seg(t, 31.6, 32.2), 500, '#ff1e3c', 14); }
  // The Void Scenario logosu — kara delik
  const lp = seg(t, 32.0, 32.6);
  if (lp > 0) { cam({ zoom: .6 + .4 * eback(lp), t, rot: 0 }, () => {
    const cx = W / 2, cy = 760;
    for (let i = 0; i < 46; i++) { const a = i / 46 * TAU + t * (1.2 + (i % 3) * .3), rr = 250 + (i % 5) * 40 + Math.sin(t * 2 + i) * 14;
      ctx.strokeStyle = `rgba(${i % 2 ? '170,120,255' : '255,180,90'},${.35 + .3 * Math.sin(t * 3 + i)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(cx, cy, rr, rr * .32, -.25, a, a + .55); ctx.stroke(); }
    const g = ctx.createRadialGradient(cx, cy, 60, cx, cy, 210); g.addColorStop(0, '#000'); g.addColorStop(.8, '#000'); g.addColorStop(1, 'rgba(255,170,80,.9)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 200, 0, TAU); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(cx, cy, 178, 0, TAU); ctx.fill();
    txt('THE VOID', cx, 1100, 190, '#fff', { align: 'center', font: 'Anton', weight: 400, glow: '#9b6bff', blur: 50 });
    txt('SCENARIO', cx, 1270, 120, C.gold, { align: 'center', font: 'Anton', weight: 400, glow: C.gold2 });
  }); }
}

// ---------------- birleştirme ----------------
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const w1 = whip(t, 3.36, .3), w2 = whip(t, 9.3, .3, -1), w3 = whip(t, 15.45, .3), w4 = whip(t, 29.2, .3, -1);
  if (t < 3.6) cam({ y: w1.offA }, () => s1(t));
  if (t > 3.1 && t < 6.75) cam({ y: w1.offB }, () => s2(Math.max(t, 3.36)));
  if (t >= 6.5 && t < 9.55) iris(t, 6.5, .45, () => s2(t), () => cam({ y: w2.offA }, () => s3(t)), W / 2, 560);
  if (t > 9.05 && t < 14.0) cam({ y: w2.offB }, () => s4a(Math.max(t, 9.3)));
  if (t >= 13.7 && t < 15.7) iris(t, 13.7, .35, () => s4a(t), () => cam({ y: w3.offA }, () => s4b(t)), W / 2, 1500);
  if (t > 15.2 && t < 21.44) cam({ y: w3.offB }, () => s5(Math.max(t, 15.45)));
  if (t >= 21.44 && t < 25.7) s7(t);
  if (t >= 25.7 && t < 29.45) cam({ y: w4.offA }, () => s8(t));
  if (t > 28.95) cam({ y: w4.offB }, () => s9(Math.max(t, 29.2)));
  motionStreak(Math.max(w1.blur, w2.blur, w3.blur, w4.blur));
  glitch(Math.max(1 - seg(t, 21.44, 21.8), 0) * (t >= 21.44 ? 1 : 0) + (t > 25.45 && t < 25.8 ? 1 : 0) + (t > 24.58 && t < 24.8 ? .8 : 0), Math.floor(t * 30));
  flash(t, 21.44, .2); flash(t, 25.7, .15, '255,60,80');
  subs(t, SUBY);
};
