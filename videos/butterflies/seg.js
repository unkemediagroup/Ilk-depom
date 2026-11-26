const SEG = [
  { t: 0, fn: belly, o: { icons: 1 }, cam: [540, 1000, .8, 540, 1040, .92, 0, .02], mag: [1, 1], big2: ['WHY DO YOU GET', 'BUTTERFLIES IN YOUR STOMACH?!'] },
  { t: 2.9, fn: belly, o: { n: 12 }, cam: [540, 1210, 1.3, 540, 1210, 1.6, .02, -.02], mag: [1, 1], tag: ['FLUTTERING', 'from the inside'] },
  { t: 6.4, fn: bloodRoute, o: {}, cam: [540, 1000, .9, 540, 1000, 1.0, 0, .01], mag: [1, 1], tag: ['YOUR BRAIN', 'steals blood from digestion'] },
  { t: 9.2, fn: bloodRoute, o: { stress: 1 }, cam: [540, 1000, 1.0, 520, 1040, 1.15, 0, .02], mag: [1, 1], tag: ['BLOOD STOLEN', 'away from your stomach'] },
  { t: 12.6, fn: secondBrain, o: {}, cam: [540, 960, 1.0, 540, 960, 1.15, -.02, .02], mag: [1, 1], tag: ['YOUR GUT', 'lined with millions of neurons'] },
  { t: 18.5, fn: alarm, o: { text: 'STRESS RESPONSE!' }, cam: [960, 560, .85, 960, 560, 1.0, .02, -.02], mag: [1, 1], tag: ['NERVOUS OR EXCITED', 'stress response activates'] },
  { t: 22.6, fn: bloodRoute, o: { stress: 1 }, cam: [540, 980, .95, 600, 1000, 1.1, 0, .02], mag: [1, 1], tag: ['BLOOD REDIRECTED', 'to muscles & heart'] },
  { t: 27.3, fn: tightGut, o: { text: 'BLOOD SUPPLY DROPS' }, cam: [540, 1000, .95, 540, 1000, 1.1, 0, .02], mag: [1, 1], tag: ['SUDDEN DROP', 'in blood supply'] },
  { t: 31.3, fn: tightGut, o: { text: 'CONTRACT & TIGHTEN' }, cam: [540, 1000, 1.0, 520, 1000, 1.1, .02, -.02], mag: [1, 1], tag: ['STOMACH LINING', 'vessels & muscles tighten'] },
  { t: 34.9, fn: tightGut, o: { nerve: 1, text: 'TENSION DETECTED' }, cam: [540, 1000, 1.0, 540, 1000, 1.08, -.02, .02], mag: [1, 1], tag: ['GUT NERVES', 'instantly detect the tension'] },
  { t: 37.9, fn: belly, o: { n: 14 }, cam: [540, 1100, .9, 540, 1210, 1.4, 0, .03], mag: [1, 1], tag: ['BUTTERFLIES!', 'that fluttering feeling'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
