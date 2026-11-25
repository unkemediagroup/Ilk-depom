// ===== 5.video — EYE TWITCH (portrait) =====
const FL = s => .1 + (((s % 1.6) < .9) ? Math.max(0, Math.sin(s * 48)) * .16 : 0);
function eyeFlutter(u, s, o) { eye(u, s, { bl: FL, film: .4 }); const on = (s % 1.6) < .9; if (on) { ctx.strokeStyle = 'rgba(255,210,63,.9)'; ctx.lineWidth = 10; for (let i = 0; i < 4; i++) { const a = -2.6 + i * .5; ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * 560, 960 + Math.sin(a) * 420); ctx.lineTo(540 + Math.cos(a) * 640, 960 + Math.sin(a) * 480); ctx.stroke(); } } if (o.text) { ctx.textAlign = 'center'; txt(o.text, 540, 480, 110, '#ffd23f', '#000', 16, '400', 'Anton'); } }
function lookers(u, s) {
  bgDeep(s, ['#1e2232', '#0c0e16']);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const x = 150 + c * 260 + (r % 2) * 110, y = 760 + r * 320; headSil(x, y, .55, '#05060a'); const look = Math.sin(s * 2 + r + c) > 0 ? 1 : -1; for (const d of [-1, 1]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + d * 26, y - 130, 14, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x + d * 26 + look * 5, y - 130, 7, 0, TAU); ctx.fill(); } }
  ctx.textAlign = 'center'; txt('EVERYONE CAN SEE IT?', 540, 470, 96, '#ffd23f', '#000', 14, '400', 'Anton');
}
function lidMuscle(u, s) { muscle(u, s % 1.3, { twitch: 1, at: .35, nerve: 1 }); }
function screenEye(u, s) {
  eye(u, s, { noblink: 1 }); const k = .5 + .5 * Math.sin(s * 3); ctx.fillStyle = `rgba(80,140,255,${.18 + .06 * k})`; ctx.fillRect(-2200, -2200, 5600, 6600);
  ctx.fillStyle = '#0c0d10'; ctx.beginPath(); ctx.roundRect(340, 1300, 400, 560, 40); ctx.fill(); const sg = ctx.createLinearGradient(0, 1320, 0, 1840); sg.addColorStop(0, '#5a8aff'); sg.addColorStop(1, '#2a4aa0'); ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(360, 1320, 360, 520, 30); ctx.fill(); spark(540, 1500, 400, .4, '120,170,255');
  ctx.textAlign = 'center'; txt('DRY & IRRITATED', 540, 540, 96, '#ffd23f', '#000', 14, '400', 'Anton');
}
function remedies3(u, s) {
  bgDeep(s, ['#14283a', '#08121c']);
  const tile = (y, i, title, draw) => { const k = eo(clamp(u * 3.2 - i * .75)); ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 300, 0); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(90, y - 140, 900, 280, 40); ctx.fill(); draw(280, y); ctx.textAlign = 'left'; txt(title, 450, y + 30, 90, '#fff', '#000', 14, '400', 'Anton'); ctx.restore(); };
  tile(560, 0, 'DRINK WATER', (x, y) => { ctx.fillStyle = 'rgba(200,230,255,.35)'; ctx.beginPath(); ctx.moveTo(x - 80, y - 120); ctx.lineTo(x + 80, y - 120); ctx.lineTo(x + 60, y + 130); ctx.lineTo(x - 60, y + 130); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#5ab0f0'; ctx.beginPath(); ctx.moveTo(x - 72, y - 40 + Math.sin(s * 4) * 6); ctx.lineTo(x + 72, y - 40 - Math.sin(s * 4) * 6); ctx.lineTo(x + 60, y + 130); ctx.lineTo(x - 60, y + 130); ctx.closePath(); ctx.fill(); });
  tile(880, 1, 'REST YOUR EYES', (x, y) => { ctx.strokeStyle = '#f2ece4'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(x - 110, y); ctx.quadraticCurveTo(x, y + 70, x + 110, y); ctx.stroke(); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x - 80 + i * 40, y + 30); ctx.lineTo(x - 90 + i * 45, y + 70); ctx.stroke(); } txt('z', x + 110, y - 60, 70, '#fff', '#000', 8, '400', 'Anton'); });
  tile(1200, 2, 'LESS COFFEE', (x, y) => { ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.roundRect(x - 90, y - 90, 180, 190, [10, 10, 50, 50]); ctx.fill(); ctx.strokeStyle = '#f2ece4'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(x + 100, y, 46, -1.4, 1.4); ctx.stroke(); tube([[x - 120, y - 120], [x + 140, y + 130]], 20, '#ff5a5a'); });
}

// override: tiles kept above the subtitle band
function triggers3(u, s) {
  bgDeep(s, ['#2a1a14', '#100a08']);
  const tile = (y, i, title, draw) => { const k = eo(clamp(u * 3 - i * .7)); ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - k) * 300, 0); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(90, y - 140, 900, 280, 40); ctx.fill(); draw(280, y); ctx.textAlign = 'left'; txt(title, 470, y + 30, 100, '#fff', '#000', 14, '400', 'Anton'); ctx.restore(); };
  tile(560, 0, 'STRESS', (x, y) => { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(x + 20, y - 130); ctx.lineTo(x - 70, y + 20); ctx.lineTo(x, y + 20); ctx.lineTo(x - 30, y + 140); ctx.lineTo(x + 80, y - 20); ctx.lineTo(x + 10, y - 20); ctx.closePath(); ctx.fill(); });
  tile(880, 1, 'CAFFEINE', (x, y) => { ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.roundRect(x - 90, y - 90, 180, 190, [10, 10, 50, 50]); ctx.fill(); ctx.strokeStyle = '#f2ece4'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(x + 100, y, 46, -1.4, 1.4); ctx.stroke(); ctx.fillStyle = '#5a3420'; ctx.beginPath(); ctx.ellipse(x, y - 84, 82, 16, 0, 0, TAU); ctx.fill(); for (let i = 0; i < 3; i++) tube(wavy(x - 40 + i * 40, y - 120, -Math.PI / 2, 90, 10 + Math.sin(s * 3 + i) * 4, 6), 6, 'rgba(255,255,255,.5)'); });
  tile(1200, 2, 'LACK OF SLEEP', (x, y) => { ctx.fillStyle = '#f2ece4'; ctx.beginPath(); ctx.ellipse(x, y, 110, 60, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#5a3a22'; ctx.beginPath(); ctx.arc(x, y + 10, 40, 0, TAU); ctx.fill(); ctx.fillStyle = '#c99478'; ctx.beginPath(); ctx.ellipse(x, y - 30, 120, 50, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(x - 120, y - 32, 240, 30); });
}
