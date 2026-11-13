// fin.js — finans/para YT Shorts görsel kiti (Canvas 2D, 1080×1920, her şey t'nin saf fonksiyonu).
// Kullanım: index.html → <canvas id="c">, words.js (WORDS), fin.js, main.js.  main.js içinde window.draw(t) tanımla.
// Kurallar: müzik yok, foley yok, tam ekran (kenar boşluğu yok), her karede hareket, geçişler akıcı.
const cv = document.getElementById('c'), ctx = cv.getContext('2d'), W = 1080, H = 1920;
const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t;
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, eo = x => 1 - Math.pow(1 - x, 3), ei = x => x * x * x;
const eback = x => { const c = 1.70158, d = c + 1; return 1 + d * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const spring = (x, k = 7, z = .45) => x <= 0 ? 0 : 1 - Math.exp(-z * k * x) * Math.cos(k * Math.sqrt(1 - z * z) * x * 1.6);
const seg = (t, a, b) => clamp((t - a) / (b - a));               // 0..1 aralık ilerlemesi
function RN(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const noise1 = (x, s = 1) => Math.sin(x * 1.7 + s) * .5 + Math.sin(x * 3.1 + s * 2.3) * .3 + Math.sin(x * 5.3 + s * 4.1) * .2;

// ---------- palet ----------
const C = {
  bg0: '#06090f', bg1: '#0c1424', grid: 'rgba(120,160,255,.07)',
  green: '#22e07a', green2: '#0f9d58', red: '#ff3b4e', gold: '#ffc83d', gold2: '#e09a12',
  blue: '#3da5ff', violet: '#9b6bff', white: '#ffffff', mute: '#8a97b0', ink: '#0b0f17',
};

// ---------- format ----------
function fmtMoney(v, cur = '$', dec = 0) {
  const a = Math.abs(v); let s;
  if (a >= 1e9) s = (v / 1e9).toFixed(a >= 1e10 ? 0 : 1) + 'B';
  else if (a >= 1e6) s = (v / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M';
  else s = v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return (v < 0 ? '-' : '') + cur + s.replace('-', '');
}
const fmtPct = (v, dec = 0) => (v > 0 ? '+' : '') + v.toFixed(dec) + '%';

// ---------- metin ----------
function txt(s, x, y, size, col = '#fff', o = {}) {
  ctx.save(); ctx.font = `${o.weight || 900} ${size}px ${o.font || 'Montserrat'}`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'middle';
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur || 30; }
  const sw = o.stroke ?? size * .16; ctx.lineJoin = 'round'; ctx.strokeStyle = o.strokeCol || 'rgba(0,0,0,.85)';
  if (sw > 0) { ctx.lineWidth = sw; ctx.strokeText(s, x, y); } ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.restore();
}
function fit(s, size, maxW, font = 'Montserrat', weight = 900) { ctx.font = `${weight} ${size}px ${font}`; return Math.min(size, size * maxW / ctx.measureText(s).width); }

// Kinetik başlık: kelimeler sırayla aşağıdan zıplar; hl = vurgulanacak kelimeler {kelime:renk}
function kinetic(words, x, y, size, t, t0, o = {}) {
  const font = o.font || 'Anton', gap = o.gap ?? .07, hl = o.hl || {};
  ctx.font = `400 ${size}px ${font}`; { const tw = ctx.measureText(words.join(' ')).width, mw = o.maxW || 980; if (tw > mw) { size *= mw / tw; ctx.font = `400 ${size}px ${font}`; } } const sp = ctx.measureText(' ').width, wd = words.map(w => ctx.measureText(w).width);
  const tot = wd.reduce((a, b) => a + b, 0) + sp * (words.length - 1); let cx = x - tot / 2;
  words.forEach((w, i) => { const p = clamp((t - t0 - i * gap) / .28); if (p <= 0) { cx += wd[i] + sp; return; }
    const e = eback(p); ctx.save(); ctx.globalAlpha = clamp(p * 3); ctx.translate(cx + wd[i] / 2, y + (1 - e) * size * .8); ctx.rotate((1 - e) * .15);
    txt(w, 0, 0, size, hl[w] || o.col || '#fff', { font, weight: 400, align: 'center', glow: hl[w], blur: 40 }); ctx.restore(); cx += wd[i] + sp; });
}

// ---------- arka planlar ----------
function bgFinance(t, o = {}) {                       // koyu lacivert + kayan grid + yüzen tanecikler + vinyet
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, o.top || C.bg1); g.addColorStop(1, o.bot || C.bg0); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, H + 800);
  if (o.tint) { const rg = ctx.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, 1100); rg.addColorStop(0, o.tint); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); }
  ctx.strokeStyle = C.grid; ctx.lineWidth = 2; const s = 120, off = (t * 40) % s;
  for (let x = -s; x < W + s; x += s) { ctx.beginPath(); ctx.moveTo(x + off * .3, -100); ctx.lineTo(x + off * .3, H + 100); ctx.stroke(); }
  for (let y = -s; y < H + s; y += s) { ctx.beginPath(); ctx.moveTo(-100, y + off); ctx.lineTo(W + 100, y + off); ctx.stroke(); }
  const R = RN(o.seed || 7); for (let i = 0; i < 40; i++) { const x = R() * W, y = (R() * H - t * (20 + R() * 40)) % H, yy = y < 0 ? y + H : y, r = 1 + R() * 3;
    ctx.fillStyle = `rgba(${o.dot || '120,220,170'},${.15 + R() * .25})`; ctx.beginPath(); ctx.arc(x + Math.sin(t + i) * 10, yy, r, 0, TAU); ctx.fill(); }
  vignette();
}
function vignette(a = .65) { const rg = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .75); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); }

// ---------- grafikler ----------
// Büyüyen çizgi grafik. data: sayı dizisi. p: 0..1 çizim ilerlemesi. Uçta parlayan nokta + değer etiketi.
function lineChart(x, y, w, h, data, p, o = {}) {
  const col = o.col || C.green, mn = o.min ?? Math.min(...data), mx = o.max ?? Math.max(...data), n = data.length - 1;
  const px = i => x + i / n * w, py = v => y + h - (v - mn) / (mx - mn || 1) * h;
  if (o.axes !== false) { ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2; for (let k = 0; k <= 4; k++) { const yy = y + h * k / 4; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); } }
  const last = p * n, li = Math.floor(last), fr = last - li; if (p <= 0) return;
  const pts = []; for (let i = 0; i <= li; i++) pts.push([px(i), py(data[i])]); if (li < n) pts.push([lerp(px(li), px(li + 1), fr), lerp(py(data[li]), py(data[li + 1]), fr)]);
  if (o.fill !== false) { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, col + '66'); g.addColorStop(1, col + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(pts[0][0], y + h); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.lineTo(pts[pts.length - 1][0], y + h); ctx.fill(); }
  ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 25; ctx.strokeStyle = col; ctx.lineWidth = o.lw || 10; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke(); ctx.restore();
  const e = pts[pts.length - 1]; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(e[0], e[1], 12 + Math.sin(p * 40) * 2, 0, TAU); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(e[0], e[1], 22 + (p * 30 % 1) * 20, 0, TAU); ctx.globalAlpha = 1 - (p * 30 % 1); ctx.stroke(); ctx.globalAlpha = 1;
  if (o.label) { const v = li < n ? lerp(data[li], data[li + 1], fr) : data[n]; tag(o.label(v), e[0], e[1] - 70, col); }
}
function tag(s, x, y, col = C.green, size = 46) {         // yuvarlak köşeli değer balonu
  ctx.font = `900 ${size}px Montserrat`; const w = ctx.measureText(s).width + 44, h = size + 30, xx = clamp(x - w / 2, 20, W - w - 20);
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(xx, y - h / 2, w, h, h / 2); ctx.fill(); txt(s, xx + w / 2, y + 2, size, C.ink, { align: 'center', stroke: 0 });
}
// Mum grafik (borsa). candles: [{o,h,l,c}]. p: kaç mumun göründüğü (0..1).
function candles(x, y, w, h, cs, p, o = {}) {
  const mn = Math.min(...cs.map(c => c.l)), mx = Math.max(...cs.map(c => c.h)), py = v => y + h - (v - mn) / (mx - mn) * h, bw = w / cs.length;
  cs.forEach((c, i) => { const q = clamp(p * cs.length - i); if (q <= 0) return; const up = c.c >= c.o, col = up ? C.green : C.red, cx = x + bw * (i + .5);
    const oo = py(c.o), cc = lerp(oo, py(c.c), eo(q)); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, lerp(oo, py(c.h), q)); ctx.lineTo(cx, lerp(oo, py(c.l), q)); ctx.stroke();
    ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fillRect(cx - bw * .32, Math.min(oo, cc), bw * .64, Math.max(4, Math.abs(cc - oo))); ctx.shadowBlur = 0; });
}
// Çubuk grafik. items: [{label, value, col}]. Dikey; değerler sayaçla büyür.
function bars(x, y, w, h, items, p, o = {}) {
  const mx = o.max || Math.max(...items.map(i => i.value)), bw = w / items.length;
  items.forEach((it, i) => { const q = eback(clamp(p * 1.4 - i * .12)), bh = h * it.value / mx * q, bx = x + bw * i + bw * .14, ww = bw * .72, col = it.col || C.green;
    const g = ctx.createLinearGradient(0, y + h - bh, 0, y + h); g.addColorStop(0, col); g.addColorStop(1, col + '55'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(bx, y + h - bh, ww, bh, [18, 18, 0, 0]); ctx.fill();
    if (q > .05) txt((o.fmt || fmtMoney)(it.value * clamp(q)), bx + ww / 2, y + h - bh - 50, o.vsize || 48, '#fff', { align: 'center' });
    txt(it.label, bx + ww / 2, y + h + 55, o.lsize || 40, C.mute, { align: 'center', weight: 800 }); });
}
// Yatay yarış çubukları (karşılaştırma). items: [{label, value, col}]
function hbars(x, y, w, rowH, items, p, o = {}) {
  const mx = o.max || Math.max(...items.map(i => i.value));
  items.forEach((it, i) => { const q = eo(clamp(p * 1.3 - i * .1)), yy = y + i * rowH, bw = w * it.value / mx * q, col = it.col || C.green;
    txt(it.label, x, yy, 40, '#fff', { weight: 800 }); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(x, yy + 30, w, rowH * .42, 16); ctx.fill();
    ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(x, yy + 30, Math.max(1, bw), rowH * .42, 16); ctx.fill(); ctx.shadowBlur = 0;
    txt((o.fmt || fmtMoney)(it.value * q), x + w, yy, 44, col, { align: 'right' }); });
}
// Halka yüzde göstergesi
function ring(x, y, r, pct, p, o = {}) {
  const col = o.col || C.gold, v = pct * eo(p); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = r * .18; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * v / 100); ctx.stroke(); ctx.restore();
  txt(Math.round(v) + '%', x, y - (o.sub ? r * .1 : 0), r * .5, '#fff', { align: 'center', font: 'Anton', weight: 400 }); if (o.sub) txt(o.sub, x, y + r * .35, r * .16, C.mute, { align: 'center', weight: 800 });
}
// Pasta/donut dilimleri. parts: [{v, col, label}]
function donut(x, y, r, parts, p, o = {}) {
  const tot = parts.reduce((a, b) => a + b.v, 0); let a = -Math.PI / 2; const end = -Math.PI / 2 + TAU * eio(p);
  parts.forEach(pt => { const da = TAU * pt.v / tot, a2 = Math.min(a + da, end); if (a2 > a) { ctx.fillStyle = pt.col; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, a, a2); ctx.closePath(); ctx.fill();
      if (o.labels && a2 >= a + da - .01) { const m = a + da / 2; txt(pt.label, x + Math.cos(m) * r * .68, y + Math.sin(m) * r * .68, r * .13, '#fff', { align: 'center' }); } } a += da; });
  if (o.hole !== 0) { ctx.fillStyle = o.holeCol || C.bg0; ctx.beginPath(); ctx.arc(x, y, r * (o.hole || .55), 0, TAU); ctx.fill(); }
}
// Büyük sayaç (count-up). Değer slot makinesi gibi titreyerek durur.
function counter(v0, v1, x, y, size, p, o = {}) {
  const e = o.ease ? o.ease(p) : eo(p), v = lerp(v0, v1, e), f = o.fmt || fmtMoney, col = o.col || C.green;
  const kick = 1 + .06 * Math.sin(p * 30) * (1 - p); ctx.save(); ctx.translate(x, y); ctx.scale(kick, kick);
  const s = fit(f(v1), size, o.maxW || 980, 'Anton', 400); txt(f(v), 0, 0, s, col, { align: 'center', font: 'Anton', weight: 400, glow: col, blur: 45 }); ctx.restore();
}
// Trend oku (yukarı yeşil / aşağı kırmızı)
function arrow(x, y, len, up, p, o = {}) {
  const col = o.col || (up ? C.green : C.red), d = up ? -1 : 1, l = len * eo(p), w = o.w || 40; if (p <= 0 || l < w * 1.5) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.fillStyle = col;
  ctx.fillRect(-w / 2, 0, w, d * Math.max(0, l - w * 1.2)); ctx.beginPath(); ctx.moveTo(-w * 1.4, d * (l - w * 1.4)); ctx.lineTo(w * 1.4, d * (l - w * 1.4)); ctx.lineTo(0, d * l); ctx.fill(); ctx.restore();
}
// Bilgi kartı (istatistik tile)
function statCard(x, y, w, h, title, value, p, o = {}) {
  const e = eback(clamp(p)), col = o.col || C.green; ctx.save(); ctx.globalAlpha = clamp(p * 3); ctx.translate(x + w / 2, y + h / 2 + (1 - e) * 120); ctx.scale(.85 + .15 * e, .85 + .15 * e);
  ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.strokeStyle = col + '88'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 36); ctx.fill(); ctx.stroke();
  txt(title, 0, -h * .22, Math.min(44, h * .2), C.mute, { align: 'center', weight: 800, stroke: 0 }); txt(value, 0, h * .14, fit(value, h * .42, w * .86, 'Anton', 400), col, { align: 'center', font: 'Anton', weight: 400, glow: col });
  ctx.restore();
}

// ---------- para nesneleri ----------
// Altın para; spin: dönüş açısı (radyan). Kenardan dönme efekti cos ile.
function coin(x, y, r, spin = 0, o = {}) {
  const sx = Math.cos(spin), face = sx >= 0; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.ellipse(r * .08 * Math.sign(sx || 1), 0, Math.max(2, r * Math.abs(sx)) + 2, r, 0, 0, TAU); ctx.fill();
  ctx.scale(Math.max(.04, Math.abs(sx)), 1); const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, '#fff3b0'); g.addColorStop(.5, C.gold); g.addColorStop(1, C.gold2);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#b8780a'; ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(0, 0, r * .8, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#9a5f00'; ctx.font = `400 ${r * 1.1}px Anton`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.sym || '$', 0, r * .05); ctx.restore();
}
// Banknot (dolar benzeri yeşil kağıt)
function bill(x, y, w, rot = 0, o = {}) {
  const h = w * .45; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, o.flip ?? 1);
  ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 20; ctx.fillStyle = o.col || '#7fc98a'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .03); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = '#2f6b3a'; ctx.lineWidth = w * .015; ctx.strokeRect(-w * .44, -h * .38, w * .88, h * .76);
  ctx.fillStyle = '#cde9cf'; ctx.beginPath(); ctx.ellipse(0, 0, w * .14, h * .3, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2f6b3a'; ctx.font = `400 ${h * .42}px Anton`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.sym || '$', 0, h * .02);
  ctx.font = `400 ${h * .22}px Anton`; ctx.fillText(o.val || '100', -w * .34, -h * .24); ctx.fillText(o.val || '100', w * .34, h * .24); ctx.restore();
}
// Para yağmuru: t'ye göre deterministik düşen banknot + paralar
function moneyRain(t, n = 30, seed = 3, o = {}) {
  const R = RN(seed); for (let i = 0; i < n; i++) { const sp = 300 + R() * 500, x0 = R() * W, ph = R() * 10, y = ((t + ph) * sp) % (H + 400) - 200, sw = Math.sin(t * 2 + i) * 60;
    if (R() < (o.coins ?? .35)) coin(x0 + sw, y, 30 + R() * 30, t * (4 + R() * 6) + i); else bill(x0 + sw, y, 180 + R() * 120, Math.sin(t * 1.5 + i) * .8, { flip: Math.cos(t * 3 + i) }); }
}
// Para destesi (büyüyen yığın). n: deste sayısı
function cashStack(x, y, w, n, o = {}) {
  for (let i = 0; i < n; i++) { const yy = y - i * w * .09; ctx.fillStyle = i % 2 ? '#5fae6b' : '#6fbd7a'; ctx.beginPath(); ctx.roundRect(x - w / 2, yy - w * .08, w, w * .08, 6); ctx.fill();
    ctx.fillStyle = '#e8d9a8'; ctx.fillRect(x - w * .08, yy - w * .08, w * .16, w * .08); }
}
// Kumbara (domuz)
function piggy(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 200, s / 200); const col = o.col || '#ff8fb1', dk = '#d4567f';
  ctx.fillStyle = dk; [-90, -40, 40, 90].forEach(lx => { ctx.beginPath(); ctx.roundRect(lx - 18, 80, 36, 70, 10); ctx.fill(); });
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, 200, 150, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-60, -130); ctx.lineTo(-20, -200); ctx.lineTo(10, -130); ctx.fill();
  ctx.fillStyle = dk; ctx.beginPath(); ctx.ellipse(205, 10, 45, 55, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#7a1f3d'; [-12, 12].forEach(d => { ctx.beginPath(); ctx.arc(205, 10 + d * 1.6, 10, 0, TAU); ctx.fill(); });
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(110, -50, 14, 0, TAU); ctx.fill(); ctx.fillStyle = '#7a1f3d'; ctx.fillRect(-60, -152, 120, 14); ctx.restore();
}

// ---------- kamera & geçişler ----------
// cam({x,y,zoom,rot,shake}) — sahne çizimini sarar. fn() içinde normal koordinat kullan.
function cam(o, fn) { ctx.save(); const sh = o.shake || 0, t = o.t || 0; ctx.translate(W / 2 + (o.x || 0) + noise1(t * 20, 1) * sh, H / 2 + (o.y || 0) + noise1(t * 20, 5) * sh); ctx.rotate(o.rot || 0); ctx.scale(o.zoom || 1, o.zoom || 1); ctx.translate(-W / 2, -H / 2); fn(); ctx.restore(); }
// Whip geçiş: t0 anında sahne A'dan B'ye hızlı kayma. Döner: {k, off} → çizimde kullan.
// Örnek: const w = whip(t, 10.0); if (w.k < 1) cam({y: w.offA}, A); if (w.k > 0) cam({y: w.offB}, B);
function whip(t, t0, d = .28, dir = 1, dist = H) { const k = eio(seg(t, t0 - d / 2, t0 + d / 2)); return { k, offA: -dir * dist * k, offB: dir * dist * (1 - k), blur: Math.sin(k * Math.PI) }; }
function motionStreak(amount, col = '255,255,255') { if (amount <= .02) return; ctx.fillStyle = `rgba(${col},${.1 * amount})`; for (let i = 0; i < 40; i++) { const y = (i * 211) % H, x = (i * 397) % W; ctx.fillRect(x - 400, y, 500 + (i % 5) * 120, 3 + amount * 10); } }
function flash(t, t0, d = .18, col = '255,255,255') { const k = seg(t, t0, t0 + d); if (k > 0 && k < 1) { ctx.fillStyle = `rgba(${col},${(1 - k) * .85})`; ctx.fillRect(0, 0, W, H); } }
// Zoom-punch: vurgu anında kısa ölçek darbesi (sahne ölçeğine çarp)
const punch = (t, t0, amt = .08) => { const k = seg(t, t0, t0 + .35); return k <= 0 || k >= 1 ? 1 : 1 + amt * Math.sin(k * Math.PI) * (1 - k); };
// Daire maskeli geçiş (iris): fnA arkada, fnB yarıçapla açılır
function iris(t, t0, d, fnA, fnB, cx = W / 2, cy = H / 2) { const k = eio(seg(t, t0, t0 + d)); if (k < 1) fnA(); if (k > 0) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, k * 2300, 0, TAU); ctx.clip(); fnB(); ctx.restore(); } }

// ---------- altyazı (kelime kelime, aktif kelime altın) ----------
// WORDS: [["word", start, end], ...] (faster-whisper çıktısı, words.js içinde `const WORDS = [...]`)
const CHUNKS = (() => { const out = []; let cur = []; (typeof WORDS !== 'undefined' ? WORDS : []).forEach(w => { cur.push(w); if (/[.,?!]$/.test(w[0]) || cur.length >= 3) { out.push(cur); cur = []; } }); if (cur.length) out.push(cur); return out; })();
function subs(t, y = 1480, o = {}) {
  const ch = CHUNKS.find(c => t >= c[0][1] - .05 && t < c[c.length - 1][2] + .2); if (!ch) return;
  const ws = ch.map(w => w[0].replace(/[.,]$/, '').toUpperCase()); ctx.font = '900 84px Montserrat'; const fs = Math.min(84, 84 * 960 / ctx.measureText(ws.join(' ')).width); ctx.font = `900 ${fs}px Montserrat`;
  const sp = ctx.measureText(' ').width, wd = ws.map(w => ctx.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  let x = (W - tot) / 2; const pop = clamp((t - ch[0][1] + .05) / .12); ctx.save(); ctx.translate(W / 2, y); ctx.scale(1 + .1 * (1 - pop), 1 + .1 * (1 - pop)); ctx.translate(-W / 2, -y);
  ws.forEach((w, i) => { const on = t >= ch[i][1] - .02 && t < ch[i][2] + .02, isNum = /[$%\d]/.test(w); txt(w, x, y, fs, on ? (isNum ? C.green : C.gold) : '#fff', { stroke: fs * .2 }); x += wd[i] + sp; }); ctx.restore();
}
// Kelimenin sesteki zamanını bul (görsel vuruşları sese kilitlemek için): at('million') → start sn
function at(word, nth = 0) { const k = word.toLowerCase(); const hits = (typeof WORDS !== 'undefined' ? WORDS : []).filter(w => w[0].toLowerCase().replace(/[^a-z0-9$%']/g, '').startsWith(k)); return hits[nth] ? hits[nth][1] : null; }
