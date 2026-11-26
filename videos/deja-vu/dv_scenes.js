// ===== 12.video — DÉJÀ VU (portrait world 1080×1920) =====
function cafe(s, tint) {                                                         // simple café interior with two people talking
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#3a2a3e'); g.addColorStop(.6, '#5a4048'); g.addColorStop(.61, '#6a4a34'); g.addColorStop(1, '#3a281c'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  for (let i = 0; i < 3; i++) { const x = 200 + i * 340; ctx.fillStyle = 'rgba(255,220,150,.9)'; ctx.beginPath(); ctx.arc(x, 380, 30, 0, TAU); ctx.fill(); spark(x, 380, 200, .35, '255,210,140'); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 350); ctx.stroke(); }
  ctx.fillStyle = '#2a1c2a'; ctx.fillRect(700, 520, 300, 420); ctx.fillStyle = 'rgba(140,200,255,.25)'; ctx.fillRect(720, 540, 260, 380);
  ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.ellipse(540, 1330, 260, 40, 0, 0, TAU); ctx.fill(); ctx.fillRect(525, 1330, 30, 300);
  ctx.fillStyle = '#f2ece4'; ctx.fillRect(420, 1260, 60, 60); ctx.fillRect(610, 1260, 60, 60);
  const talk = Math.sin(s * 9) > 0 ? 1 : 0;
  for (const [x, col, d] of [[230, '#3a7ac8', 1], [850, '#c84a6a', -1]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - 100, 1000, 200, 330, 70); ctx.fill(); ctx.fillStyle = '#d9a07a'; ctx.beginPath(); ctx.arc(x, 900, 85, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.arc(x, 880, 88, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    ctx.fillStyle = '#3a2216'; ctx.beginPath(); ctx.arc(x + d * 40, 900, 9, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + d * 55, 950, 14, d > 0 ? 4 + talk * 8 : 4 + (1 - talk) * 8, 0, 0, TAU); ctx.fill(); }
  if (tint) { ctx.fillStyle = tint; ctx.fillRect(-2200, -2200, 5600, 6600); }
}
function eerie(u, s, o) {                                                        // the moment doubles: ghost copy + chromatic split
  const k = o.calm ? 0 : eio(clamp(u * 1.5)), off = k * (30 + 20 * Math.sin(s * 3));
  ctx.save(); ctx.globalAlpha = 1; cafe(s); ctx.restore();
  if (k > 0) { ctx.save(); ctx.globalAlpha = .35 * k; ctx.globalCompositeOperation = 'screen'; ctx.translate(off, -off * .4); cafe(s - .6, 'rgba(80,200,255,.25)'); ctx.restore();
    ctx.save(); ctx.globalAlpha = .3 * k; ctx.globalCompositeOperation = 'screen'; ctx.translate(-off, off * .4); cafe(s - 1.2, 'rgba(255,80,160,.25)'); ctx.restore();
    const vg = ctx.createRadialGradient(540, 960, 300, 540, 960, 1200); vg.addColorStop(0, 'rgba(40,0,60,0)'); vg.addColorStop(1, `rgba(40,0,60,${.7 * k})`); ctx.fillStyle = vg; ctx.fillRect(-2200, -2200, 5600, 6600);
    if (Math.sin(s * 7) > .85) { const R = RN(Math.floor(s * 20)); for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(200,150,255,.25)`; ctx.fillRect(-200, R() * 1920, 1500, 6 + R() * 30); } } }
  if (o.text) { const a = eo(clamp(u * 3 - .3)); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; txt(o.text, 540 + Math.sin(s * 25) * 4 * k, 620, o.size || 100, '#e8d0ff', '#2a0a3a', 16, '400', 'Anton'); ctx.restore(); }
}
function glitchBrain(u, s, o) {                                                  // brain with temporal lobe glitching
  brain3d(u, s, { glows: [[60, 140, 240, 0], [-200, -80, 160, 1.7]], hue: ['#2a1440', '#0e0618'] });
  if (Math.sin(s * 6) > .6) { const R = RN(Math.floor(s * 24)); for (let i = 0; i < 8; i++) { const y = 300 + R() * 600; ctx.save(); ctx.globalAlpha = .5; ctx.fillStyle = i % 2 ? 'rgba(80,220,255,.5)' : 'rgba(255,80,180,.5)'; ctx.fillRect(560 + R() * 300, y, 300 + R() * 500, 8 + R() * 22); ctx.restore(); } }
  ctx.textAlign = 'center'; label('TEMPORAL LOBE', 1080, 1010, 56, '#ffd23f'); tube([[1060, 950], [1030, 800]], 8, '#ffd23f');
  txt(o.text || 'MEMORY GLITCH', 960, 120, 120, '#e8d0ff', '#2a0a3a', 18, '400', 'Anton');
}
// processing pipeline: SENSES → PRESENT (conscious) → MEMORY.  o.glitch: a signal shortcuts straight into memory first
function pipeline(u, s, o) {
  bgDeep(s, ['#1a1a3a', '#080818']); const box = (y, title, col, sub) => { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(200, y - 110, 680, 220, 40); ctx.fill(); ctx.stroke(); ctx.textAlign = 'center'; txt(title, 540, y + 10, 70, col, '#000', 10, '400', 'Anton'); if (sub) label(sub, 540, y + 70, 34, 'rgba(255,255,255,.75)'); };
  const Y = [480, 800, 1120];
  // icons in senses box
  box(Y[0], 'SENSES', '#7ad0ff', 'eyes · ears · touch'); box(Y[1], 'PRESENT MOMENT', '#ffd23f', o.glitch ? 'still processing…' : 'conscious processing'); box(Y[2], 'LONG-TERM MEMORY', '#d08aff', 'memory banks');
  // loading bar in present
  const lp = o.glitch ? clamp(.15 + u * .5) : (u * 1.6) % 1; ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(300, Y[1] + 92, 480, 14); ctx.fillStyle = '#ffd23f'; ctx.fillRect(300, Y[1] + 92, 480 * lp, 14);
  tube([[540, Y[0] + 110], [540, Y[1] - 110]], 10, 'rgba(255,255,255,.3)'); tube([[540, Y[1] + 110], [540, Y[2] - 110]], 10, 'rgba(255,255,255,.3)');
  const pk = (x, y, col) => { spark(x, y, 90, .95, col); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); };
  if (!o.glitch) { for (let k = 0; k < 2; k++) { const ph = (s * .55 + k / 2) % 1; if (ph < .5) pk(540, lerp(Y[0] + 110, Y[1] - 110, ph * 2), '120,210,255'); else pk(540, lerp(Y[1] + 110, Y[2] - 110, (ph - .5) * 2), '255,210,63'); }
    ctx.textAlign = 'center'; label('1', 600, (Y[0] + Y[1]) / 2 + 14, 50, '#7ad0ff', 'left'); label('2', 600, (Y[1] + Y[2]) / 2 + 14, 50, '#ffd23f', 'left'); }
  else { const P = [[880, Y[0]], [990, Y[0] + 120], [990, Y[2] - 120], [880, Y[2]]]; tube(P, 14, 'rgba(255,80,120,.7)');
    const ph = (s * .7) % 1, n = P.length - 1, f = ph * n, i = Math.min(n - 1, Math.floor(f)), t = f - i; pk(lerp(P[i][0], P[i + 1][0], t), lerp(P[i][1], P[i + 1][1], t), '255,90,140');
    if (ph > .85) { ctx.save(); ctx.globalAlpha = (ph - .85) / .15; ctx.strokeStyle = '#ff5a8a'; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(190, Y[2] - 120, 700, 240, 46); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.translate(1000, (Y[0] + Y[2]) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; label('MISFIRE!', 0, -40, 50, '#ff5a8a'); ctx.restore(); }
}
function earlyArrival(u, s) {                                                    // two signals racing to awareness: memory arrives first
  bgDeep(s, ['#1a1a3a', '#080818']); const L = 140, Rr = 940;
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Rr, 600); ctx.lineTo(Rr, 1240); ctx.stroke(); ctx.textAlign = 'center'; label('AWARENESS', Rr - 60, 560, 40, '#fff');
  const lane = (y, col, lab, sp) => { tube([[L, y], [Rr, y]], 20, 'rgba(255,255,255,.1)'); ctx.textAlign = 'left'; label(lab, L, y - 50, 44, col, 'left'); const x = Math.min(Rr, L + (Rr - L) * clamp(u * sp)); spark(x, y, 100, .95, col === '#d08aff' ? '210,140,255' : '255,210,63'); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fill(); return x >= Rr; };
  const m = lane(760, '#d08aff', 'MEMORY SIGNAL', 2.2), p = lane(1100, '#ffd23f', 'PRESENT SIGNAL', 1.6);
  if (m) { ctx.textAlign = 'center'; txt('1ST', Rr - 40, 700, 60, '#d08aff', '#000', 10, '400', 'Anton'); }
  if (p) { ctx.textAlign = 'center'; txt('2ND', Rr - 40, 1040, 60, '#ffd23f', '#000', 10, '400', 'Anton'); }
  ctx.textAlign = 'center'; txt('A SPLIT SECOND EARLY', 540, 1280, 84, '#fff', '#000', 14, '400', 'Anton');
}
