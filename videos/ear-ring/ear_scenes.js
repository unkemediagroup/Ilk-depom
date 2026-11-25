// ===== 1.video — WHY DO YOUR EARS RING? (portrait world 1080×1920) =====
function earShape(x, y, sc) { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.beginPath(); ctx.moveTo(0, -320); ctx.bezierCurveTo(260, -340, 280, -40, 180, 120); ctx.bezierCurveTo(120, 220, 140, 330, 40, 330); ctx.bezierCurveTo(-60, 330, -90, 200, -60, 100); ctx.bezierCurveTo(-130, -60, -110, -300, 0, -320); ctx.closePath();
  const g = ctx.createRadialGradient(-40, -80, 30, 0, 0, 380); g.addColorStop(0, '#f0c2a2'); g.addColorStop(.7, '#d39a7a'); g.addColorStop(1, '#a86c50'); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(140,70,50,.55)'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(-10, -230); ctx.bezierCurveTo(170, -250, 190, -30, 90, 80); ctx.stroke(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(40, -150); ctx.bezierCurveTo(130, -150, 130, -40, 70, 0); ctx.stroke();
  const cg = ctx.createRadialGradient(20, 30, 4, 20, 30, 60); cg.addColorStop(0, '#1a0806'); cg.addColorStop(1, '#5a2a1c'); ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(20, 30, 44, 60, 0, 0, TAU); ctx.fill(); ctx.restore(); }
function bigEar(u, s, o) {
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#1a1420'); g.addColorStop(1, '#0a080e'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const hair = ctx.createRadialGradient(300, 700, 50, 300, 700, 900); hair.addColorStop(0, '#3a2a20'); hair.addColorStop(1, '#14100c'); ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(250, 900, 700, 1100, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#c99476'; ctx.beginPath(); ctx.ellipse(-60, 980, 520, 760, 0, 0, TAU); ctx.fill();
  const ring = o.ring ? (o.ring === 'fade' ? 1 - clamp(u * 1.2) : clamp((s - (o.at || 0)) * 3)) : 0, sh = ring * (o.ring === 'fade' ? 0 : 8);
  ctx.save(); ctx.translate(Math.sin(s * 70) * sh, Math.cos(s * 63) * sh); earShape(560, 960, 1.7);
  if (ring > 0) { const cx = 600, cy = 1010; for (let i = 0; i < 7; i++) { const ph = (s * 1.4 + i / 7) % 1; ctx.strokeStyle = `rgba(255,${200 - ph * 120},${170 - ph * 120},${ring * (1 - ph) * .9})`; ctx.lineWidth = 12 - ph * 6; ctx.beginPath(); ctx.arc(cx, cy, 60 + ph * 800, 0, TAU); ctx.stroke(); }
    spark(cx, cy, 260, ring * (.7 + .3 * Math.sin(s * 30)), '255,230,220'); }
  ctx.restore();
  if (o.label) { ctx.textAlign = 'center'; txt(o.label, 540, 1620, 90, '#fff', '#8c0e18', 16, '400', 'Anton'); }
}
function toneWave(u, s, o) {
  bgDeep(s, ['#2a0e18', '#10060a']); const amp = o.decay ? 260 * (1 - eio(clamp(u * 1.1))) : 260, p = [];
  for (let x = -200; x <= 1280; x += 3) p.push([x, 960 + Math.sin(x * .09 - s * 40) * amp * (.85 + .15 * Math.sin(x * .004))]);
  tube(p, 22, 'rgba(255,90,90,.25)'); tube(p, 8, o.decay ? '#9effd0' : '#ff6a6a'); tube(p, 3, '#fff');
  if (!o.decay) { const k = .5 + .5 * Math.sin(s * 9); ctx.textAlign = 'center'; ctx.save(); ctx.translate(540, 520); ctx.scale(1 + .05 * k, 1 + .05 * k); txt('EEEEEEEE', 0, 0, 170, '#fff', '#8c0e18', 22, '400', 'Anton'); ctx.restore(); }
  else if (u > .75) { ctx.textAlign = 'center'; txt('✓ RESET', 540, 560, 130, '#9effd0', '#063a24', 18, '400', 'Anton'); }
}
function crowd(u, s) {
  bgDeep(s, ['#1e2232', '#0c0e16']); const R = RN(4);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = 150 + c * 260 + (r % 2) * 120, y = 640 + r * 300, on = R() < .8, sc = .55;
    headSil(x, y, sc, '#05060a'); if (on) { const ph = (s * 1.3 + R()) % 1; for (let i = 0; i < 3; i++) { const q = (ph + i / 3) % 1; ctx.strokeStyle = `rgba(255,210,63,${.8 * (1 - q)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x + 66, y - 110, 20 + q * 60, -1, 1); ctx.stroke(); } } }
  ctx.textAlign = 'center'; txt('~ ALMOST EVERYONE', 540, 420, 90, '#ffd23f', '#000', 14, '400', 'Anton');
}
function hairCells(u, s, o) {                                                  // organ of Corti: hair cells, stereocilia, tectorial membrane, nerve
  const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#1a2a36'); g.addColorStop(.45, '#24384a'); g.addColorStop(1, '#14080c'); ctx.fillStyle = g; ctx.fillRect(-2200, -2200, 5600, 6600);
  const R = RN(5); for (let i = 0; i < 40; i++) { const x = R() * 1300 - 100, y = R() * 900, r = 20 + R() * 60; spark(x + Math.sin(s + i) * 20, y, r, .08, '190,220,240'); }
  const base = 1120, wave = o.wave ? 1 : .25, dm = o.damage ? clamp(u * 1.5) : 0;
  const tm = ctx.createLinearGradient(0, 560, 0, 720); tm.addColorStop(0, 'rgba(230,225,245,.15)'); tm.addColorStop(1, 'rgba(230,225,245,.55)'); ctx.fillStyle = tm; ctx.beginPath(); ctx.moveTo(-200, 600 + Math.sin(s * 8) * 20 * wave); for (let x = -200; x <= 1300; x += 40) ctx.lineTo(x, 690 + Math.sin(s * 8 + x * .004) * 22 * wave); ctx.lineTo(1300, 560); ctx.lineTo(-200, 560); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d98a92'; ctx.fillRect(-2200, base + 160, 5600, 1400); for (let x = -200; x < 1300; x += 70) { ctx.fillStyle = 'rgba(180,90,110,.5)'; ctx.beginPath(); ctx.arc(x, base + 230 + (x % 140 ? 30 : 0), 22, 0, TAU); ctx.fill(); }
  for (let i = 0; i < 5; i++) { const x = 140 + i * 200, mis = o.misfire && i === 2, ang = Math.sin(s * 8 + i * .6) * .16 * wave, flash = mis ? Math.max(0, Math.sin(s * 23) * Math.sin(s * 7.3)) : 0;
    const cg = ctx.createLinearGradient(x - 70, 0, x + 70, 0); cg.addColorStop(0, mix('#e8a0a8', '#8a7a7c', dm)); cg.addColorStop(1, mix('#c97884', '#6a5a5c', dm)); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(x - 60, 800); ctx.quadraticCurveTo(x - 90, base + 80, x, base + 170); ctx.quadraticCurveTo(x + 90, base + 80, x + 60, 800); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7a4a6a'; ctx.beginPath(); ctx.ellipse(x, base + 40, 30, 36, 0, 0, TAU); ctx.fill();
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { const sx = x - 45 + k * 30, h = 70 + r * 45, br = dm > .2 && R() < dm * .7, a = ang + (br ? (R() - .5) * 1.6 * dm : 0); if (dm > .5 && R() < dm * .4) continue; ctx.save(); ctx.translate(sx + r * 4, 800); ctx.rotate(a); ctx.fillStyle = mix('#f2e6d4', '#9a9088', dm); ctx.beginPath(); ctx.roundRect(-6, -h, 12, h, 6); ctx.fill(); ctx.restore(); }
    tube([[x, base + 170], [x + (i - 2) * 30, base + 500], [540 + (i - 2) * 60, 1900]], 12, '#efd9a2');
    const ph = (s * (mis ? 3.5 : .9) + i * .2) % 1; if (!o.damage && (o.signal || mis)) { const q = [lerp(x, 540 + (i - 2) * 60, ph), lerp(base + 170, 1900, ph)]; spark(q[0], q[1], mis ? 90 : 60, mis ? 1 : .8, mis ? '255,120,120' : '255,245,200'); }
    if (mis) { spark(x, 760, 220, .5 + .5 * flash, '255,90,90'); } }
  if (o.misfire) { ctx.textAlign = 'center'; txt('MISFIRE!', 540, 460, 120, '#ff6a6a', '#000', 16, '400', 'Anton'); }
  if (o.damage && dm > .2) { ctx.fillStyle = `rgba(160,20,30,${.18 * dm})`; ctx.fillRect(-2200, -2200, 5600, 6600); }
  if (o.labels) { ctx.textAlign = 'left'; txt('HAIR CELLS', 60, 1000, 56, '#fff', 'rgba(0,0,0,.9)', 10); txt('NERVE', 60, 1560, 50, '#efd9a2', 'rgba(0,0,0,.9)', 10); }
}
function eardrum(u, s) {                                                       // ear canal + eardrum bulging under a pressure change
  bgDeep(s, ['#2a1a1c', '#100a0c']); const b = Math.sin(s * 2.4) * 80;
  ctx.fillStyle = '#c98f72'; ctx.fillRect(-2200, 600, 5600, 160); ctx.fillRect(-2200, 1160, 5600, 160); const cg = ctx.createLinearGradient(0, 760, 0, 1160); cg.addColorStop(0, '#5a2a1c'); cg.addColorStop(.5, '#2a100a'); cg.addColorStop(1, '#5a2a1c'); ctx.fillStyle = cg; ctx.fillRect(-2200, 760, 5600, 400);
  ctx.fillStyle = '#e8dccf'; ctx.beginPath(); ctx.moveTo(700, 760); ctx.quadraticCurveTo(700 + b * 2, 960, 700, 1160); ctx.lineTo(730, 1160); ctx.quadraticCurveTo(730 + b * 2, 960, 730, 760); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 3; i++) { const y = 860 + i * 100, d = b > 0 ? 1 : -1; tube([[300, y], [560, y]], 14, '#ffd23f'); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(580, y); ctx.lineTo(540, y - 24); ctx.lineTo(540, y + 24); ctx.closePath(); ctx.fill(); }
  ctx.textAlign = 'center'; txt('PRESSURE', 540, 520, 120, '#fff', '#000', 16, '400', 'Anton'); txt('EARDRUM', 760, 1420, 56, '#e8dccf', '#000', 10);
}
function speaker(u, s) {
  bgDeep(s, ['#1e1a2a', '#0a080e']); const pump = 1 + .06 * Math.max(0, Math.sin(s * 14));
  ctx.fillStyle = '#16161a'; ctx.beginPath(); ctx.roundRect(240, 520, 600, 900, 50); ctx.fill();
  for (const [y, r] of [[760, 160], [1180, 220]]) { ctx.save(); ctx.translate(540, y); ctx.scale(pump, pump); const g = ctx.createRadialGradient(-20, -20, 10, 0, 0, r); g.addColorStop(0, '#5a5a66'); g.addColorStop(.6, '#2a2a30'); g.addColorStop(1, '#0a0a0c'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#8a8a96'; ctx.beginPath(); ctx.arc(0, 0, r * .25, 0, TAU); ctx.fill(); ctx.restore(); }
  for (let i = 0; i < 6; i++) { const ph = (s * 1.2 + i / 6) % 1; ctx.strokeStyle = `rgba(255,210,63,${.8 * (1 - ph)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(540, 1000, 480 + ph * 600, -.6, .6); ctx.stroke(); ctx.beginPath(); ctx.arc(540, 1000, 480 + ph * 600, Math.PI - .6, Math.PI + .6); ctx.stroke(); }
  ctx.textAlign = 'center'; txt('LOUD NOISE', 540, 470, 120, '#fff', '#8c0e18', 18, '400', 'Anton');
}
function brainGlitch(u, s) {
  brain3d(u, s, { glows: [[150, 40, 260, 0]] }); const gl = (s * 5) % 1 < .25;
  if (gl) { for (let i = 0; i < 8; i++) { const y = 200 + ((i * 137 + Math.floor(s * 20) * 53) % 700); ctx.fillStyle = `rgba(${i % 2 ? 255 : 80},${i % 2 ? 60 : 220},${i % 2 ? 90 : 255},.28)`; ctx.fillRect(300, y, 1320, 14 + i * 3); } }
  ctx.textAlign = 'center'; txt('"RINGING!"', 960, 120, 110, '#ff6a6a', '#000', 16, '400', 'Anton');
}
