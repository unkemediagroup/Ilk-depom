const L1 = [['PALATE', 560, 860, '#ffd2d6'], ['BLOOD VESSELS', 340, 800, '#ff8a8a']];
const SEG = [
  { t: 0, fn: iceCream, o: {}, cam: [540, 900, .95, 560, 820, 1.15, 0, .02], mag: [1, 1], big2: ['BRAIN FREEZE?!', 'WHAT REALLY HAPPENS'] },
  { t: 1.2, fn: iceCream, o: { bite: 1 }, cam: [620, 700, 1.4, 600, 760, 1.2, .03, -.02], mag: [1, 1] },
  { t: 2.4, fn: headSide, o: { pain: 1, cold: 1 }, cam: [560, 900, .95, 600, 820, 1.15, -.02, .02], mag: [1, 1] },
  { t: 4.5, fn: headSide, o: { pain: 1, cold: 1 }, cam: [700, 640, 1.8, 720, 620, 2.2, .02, -.02], mag: [2, 4], tag: ['SHARP PAIN', 'straight into your forehead'] },
  { t: 7.2, fn: brain3d, o: { hue: ['#14304a', '#08121e'], glows: [[-40, -40, 300, 0]], text: 'NOT ACTUALLY FREEZING' }, cam: [960, 560, .85, 960, 540, 1.0, -.02, .02], mag: [1, 2], tag: ['DESPITE THE NAME…', ''] },
  { t: 10.6, fn: headSide, o: { cut: 1, cream: 1, labels: L1 }, cam: [620, 940, 1.3, 640, 930, 1.55, 0, .02], mag: [2, 3], tag: ['ROOF OF YOUR MOUTH', 'ice cream hits the palate'] },
  { t: 13.6, fn: headSide, o: { cut: 1, cream: 1, chill: 1, labels: L1 }, cam: [600, 900, 1.9, 580, 890, 2.3, .02, -.02], mag: [4, 8], tag: ['VESSELS CHILL FAST', 'right behind your palate'] },
  { t: 17.6, fn: brain3d, o: { glows: [[-160, -100, 260, 0], [90, -20, 220, 1.7]] }, cam: [960, 560, 1.0, 960, 540, .85, .02, -.02], mag: [2, 1], tag: ['PROTECT THE BRAIN', 'from losing heat'] },
  { t: 19.7, fn: vesselPulse, o: { phase: 'constrict' }, cam: [960, 560, .9, 960, 540, 1.05, 0, .02], mag: [300, 500], tag: ['STEP 1', 'vessels constrict'] },
  { t: 23.2, fn: vesselPulse, o: { phase: 'dilate' }, cam: [960, 560, 1.05, 960, 540, .9, .02, -.02], mag: [500, 300], tag: ['STEP 2', 'warm blood rushes back'] },
  { t: 27.2, fn: vesselPulse, o: { phase: 'dilate', spike: 1 }, cam: [960, 540, 1.2, 960, 540, 1.4, -.02, .02], mag: [600, 900], tag: ['PRESSURE SPIKE', 'pain receptors fire'] },
  { t: 30.6, fn: headSide, o: { cut: 1, nerve: 1, labels: [['TRIGEMINAL NERVE', 300, 760, '#efd9a2']] }, cam: [600, 860, 1.25, 600, 850, 1.45, 0, .02], mag: [2, 3], tag: ['EMERGENCY SIGNAL', 'along the trigeminal nerve'] },
  { t: 33.7, fn: headSide, o: { cut: 1, nerve: 1 }, cam: [640, 820, 1.7, 620, 860, 1.3, .02, -.02], mag: [3, 2], tag: ['FACIAL SENSATIONS', 'forehead · cheek · jaw'] },
  { t: 36.7, fn: brain3d, o: { glows: [[-160, -100, 260, 0]], text: '???' }, cam: [960, 560, .9, 960, 540, 1.05, -.02, .02], mag: [1, 2], tag: ['YOUR BRAIN GETS CONFUSED', 'where is the pain?'] },
  { t: 39.6, fn: headSide, o: { pain: 1, cut: 1, nerve: 1, text: 'PAIN → FOREHEAD', tx: 680, ty: 380, ts: 84 }, cam: [620, 760, 1.2, 700, 660, 1.6, 0, .02], mag: [1, 3] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
