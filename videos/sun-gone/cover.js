// YT Shorts kapak — 10.video (Seri 1) "What If the Sun Disappeared for 24 Hours?"
window.draw = () => coverPage({ t: 25.5, noTxt: true, top: 'WHAT IF THE', big: 'SUN', bot: 'VANISHED?', badge: 'FOR 24 HOURS', y: 1440,
  pre: () => { const g = ctx.createRadialGradient(200, 240, 40, 200, 240, 330); g.addColorStop(0, 'rgba(255,170,60,.35)'); g.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 600, 600);
    ctx.save(); ctx.strokeStyle = 'rgba(255,200,120,.9)'; ctx.lineWidth = 8; ctx.setLineDash([26, 18]); ctx.beginPath(); ctx.arc(200, 240, 130, 0, TAU); ctx.stroke(); ctx.restore(); } });
