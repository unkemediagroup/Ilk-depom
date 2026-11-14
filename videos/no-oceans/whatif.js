// What If ortak çizimleri (1.video'dan): space, earth, moon, dashedGhost, shards, ring2, glitch, skyline, bigText, human, cta
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
  if (o.shade !== false) { ctx.save(); ctx.rotate(o.light || 0); const sh = ctx.createLinearGradient(-r * (o.term ?? .2), 0, r * 1.05, 0); sh.addColorStop(0, 'rgba(0,0,10,0)'); sh.addColorStop(1, `rgba(0,0,10,${o.dark ?? .82})`);
  ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore(); }
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

function human(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#05060c'; ctx.beginPath(); ctx.arc(0, -s * .9, s * .12, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-s * .16, -s * .76); ctx.lineTo(s * .16, -s * .76); ctx.lineTo(s * .12, -s * .35); ctx.lineTo(s * .14, 0); ctx.lineTo(s * .04, 0); ctx.lineTo(0, -s * .3); ctx.lineTo(-s * .04, 0); ctx.lineTo(-s * .14, 0); ctx.lineTo(-s * .12, -s * .35); ctx.closePath(); ctx.fill();
  ctx.lineWidth = s * .07; ctx.strokeStyle = '#05060c'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * .15, -s * .72); ctx.lineTo(-s * .22, -s * .38); ctx.moveTo(s * .15, -s * .72); ctx.lineTo(s * .22, -s * .38); ctx.stroke(); ctx.restore(); }
// CTA: t0 = 'Drop' kelimesi, ts = 'subscribe', tv = 'The' (Void); theo = 6 yorum; o.bg = arka plan rengi
function cta(t, t0, ts, tv, THEO, o = {}) {
  bgFinance(t, { tint: o.tint || 'rgba(120,80,255,.22)', seed: o.seed || 9, dot: o.dot || '170,150,255' });
  // yorum balonları
  THEO.forEach((s, i) => { const q0 = t0 + .2 + i * .3, p = seg(t, q0, q0 + .4); if (p <= 0) return; const e = eback(p), y = 330 + i * 150 - (t - q0) * 25, x = i % 2 ? 600 : 470;
    ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.globalAlpha = clamp(p * 3) * (1 - seg(t, ts + .5, ts + .9));
    ctx.font = '800 46px Montserrat'; const w = ctx.measureText(s).width + 150; ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.roundRect(-w / 2, -50, w, 100, 50); ctx.fill();
    ctx.fillStyle = ['#ff3b4e', '#3da5ff', '#22e07a', '#ffc83d', '#9b6bff', '#ff8a3d'][i]; ctx.beginPath(); ctx.arc(-w / 2 + 52, 0, 30, 0, TAU); ctx.fill();
    txt(s, -w / 2 + 100, 2, 46, '#111', { weight: 800, stroke: 0 }); ctx.restore(); });
  // abone ol butonu — "subscribe"
  const sp = seg(t, ts - .6, ts - .2), press = seg(t, ts, ts + .18), done = t > ts + .18;
  if (sp > 0 && t < ts + .8) { ctx.save(); ctx.translate(W / 2, 1290); const sc = eback(sp) * (1 - .08 * Math.sin(press * Math.PI)); ctx.scale(sc, sc);
    ctx.fillStyle = done ? '#3a3f4b' : '#ff1e3c'; ctx.beginPath(); ctx.roundRect(-300, -75, 600, 150, 75); ctx.fill();
    txt(done ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4, 66, '#fff', { align: 'center', stroke: 0 }); ctx.restore();
    const hx = lerp(900, 600, eio(seg(t, ts - .5, ts))), hy = lerp(1600, 1330, eio(seg(t, ts - .5, ts))) + 12 * Math.sin(press * Math.PI);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 26, hy + 90); ctx.lineTo(hx + 44, hy + 58); ctx.lineTo(hx + 82, hy + 92); ctx.lineTo(hx + 96, hy + 76); ctx.lineTo(hx + 60, hy + 44); ctx.lineTo(hx + 92, hy + 32); ctx.closePath(); ctx.fill(); ctx.stroke();
    ring2(W / 2, 1290, seg(t, ts + .1, ts + .7), 500, '#ff1e3c', 14); }
  // The Void Scenario logosu — kara delik
  const lp = seg(t, tv - .1, tv + .5);
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

