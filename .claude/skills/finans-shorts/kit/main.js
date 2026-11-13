// ÖRNEK kurgu: kitin parçalarını gösterir. Yeni videoda bunu kopyala, sahneleri sese göre yeniden yaz.
window.DUR = 10;
const growth = Array.from({ length: 31 }, (_, y) => 1200 * ((Math.pow(1.07, y) - 1) / .07) * 1.05);
const R = RN(11), cs = []; let pr = 100; for (let i = 0; i < 18; i++) { const o = pr, c = o + (R() - .38) * 14; cs.push({ o, c, h: Math.max(o, c) + R() * 6, l: Math.min(o, c) - R() * 6 }); pr = c; }
function sceneA(t) {                    // 0–2.3: para yağmuru + kinetik başlık + sayaç
  bgFinance(t, { tint: 'rgba(34,224,122,.18)' }); moneyRain(t, 22, 5);
  kinetic(['INVEST', '$100', 'A', 'MONTH'], W / 2, 620, 150, t, 0, { hl: { '$100': C.green } });
  coin(W / 2, 1000, 150, t * 5); counter(0, 100, W / 2, 1230, 170, seg(t, .8, 1.5));
}
function sceneB(t) {                    // 2.3–5.2: bileşik faiz eğrisi
  bgFinance(t, { tint: 'rgba(61,165,255,.15)', seed: 2 });
  txt('30 YEARS', W / 2, 330, 120, '#fff', { align: 'center', font: 'Anton', weight: 400 });
  const p = eio(seg(t, 2.4, 4.6)); cam({ zoom: 1 + .08 * p, t, shake: t > 3.9 && t < 4.3 ? 8 : 0 }, () => lineChart(90, 520, 900, 760, growth, p, { label: v => fmtMoney(v) }));
  arrow(930, 520, 260 * seg(t, 4.2, 4.8), true, seg(t, 4.2, 4.7));
}
function sceneC(t) {                    // 5.2–10: istatistik: halka + çubuk + mum
  bgFinance(t, { tint: 'rgba(255,59,78,.14)', seed: 4, dot: '255,120,130' });
  ring(W / 2, 560, 250, 90, seg(t, 5.4, 6.4), { col: C.red, sub: 'NEVER START' });
  hbars(110, 980, 860, 150, [{ label: 'STARTED AT 25', value: 227000, col: C.green }, { label: 'STARTED AT 35', value: 101000, col: C.gold }, { label: 'NEVER', value: 0.01, col: C.red }], seg(t, 6.6, 8.2));
  candles(110, 1560, 860, 230, cs, seg(t, 7.8, 9.6));
}
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const w1 = whip(t, 2.3), w2 = whip(t, 5.2, .3, -1);
  if (t < 2.6) cam({ y: w1.offA }, () => sceneA(t));
  if (t > 2.1 && t < 5.5) cam({ y: t < 3.5 ? w1.offB : w2.offA, zoom: punch(t, 3.9) }, () => sceneB(t));
  if (t > 5) cam({ y: w2.offB }, () => sceneC(t));
  motionStreak(Math.max(w1.blur, w2.blur)); flash(t, 0); flash(t, 5.4, .2, '255,59,78');
  subs(t, 1700);
};
