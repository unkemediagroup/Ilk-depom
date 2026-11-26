const SEG = [
  { t: 0, fn: coldFace, o: {}, cam: [540, 1100, .9, 540, 1080, 1.1, 0, .02], mag: [1, 1], big2: ['WHY DO YOUR TEETH', 'CHATTER WHEN COLD?!'] },
  { t: 2.9, fn: coldFace, o: { fast: 1 }, cam: [540, 1150, 1.25, 540, 1150, 1.45, .02, -.02], mag: [1, 1], tag: ['UNCONTROLLABLE', 'teeth clicking rapidly'] },
  { t: 6.6, fn: coldFace, o: { text: 'NOT JUST ANNOYING', size: 90 }, cam: [540, 960, 1.0, 540, 960, 1.08, -.02, .02], mag: [1, 1], tag: ['NOT A SIDE EFFECT', 'of freezing'] },
  { t: 9.3, fn: heaterOn, o: {}, cam: [540, 900, .95, 540, 920, 1.1, 0, .02], mag: [1, 1], tag: ['EMERGENCY HEATING', 'kicking into gear'] },
  { t: 12.9, fn: coreTemp, o: {}, cam: [600, 960, 1.0, 600, 940, 1.1, 0, .01], mag: [1, 1], tag: ['YOUR BRAIN KEEPS', 'your core at a steady temp'] },
  { t: 18.1, fn: sensors, o: { text: 'DANGEROUS COLD!' }, cam: [540, 900, .95, 540, 880, 1.08, 0, .02], mag: [1, 1], tag: ['SKIN SENSORS', 'detect dangerous cold'] },
  { t: 21.1, fn: sensors, o: { text: 'SHIVER NOW!', col: '#ffd23f' }, cam: [540, 760, 1.05, 540, 720, 1.25, .02, -.02], mag: [1, 1], tag: ['HYPOTHALAMUS', 'triggers shivering'] },
  { t: 23.4, fn: shiverMuscle, o: {}, cam: [540, 960, 1.0, 540, 940, 1.15, 0, .02], mag: [1, 1], tag: ['SHIVERING', 'rapid, involuntary contractions'] },
  { t: 25.7, fn: shiverMuscle, o: { text: 'BURN ENERGY → HEAT' }, cam: [540, 940, 1.1, 560, 940, 1.25, -.02, .02], mag: [1, 1], tag: ['INSTANT HEAT', 'by burning energy'] },
  { t: 29.1, fn: jawSide, o: { text: 'SMALL & PACKED' }, cam: [560, 980, .95, 540, 960, 1.08, 0, .02], mag: [1, 1], tag: ['JAW & FACE MUSCLES', 'small, tightly packed'] },
  { t: 32.7, fn: jawSide, o: { text: 'CLOSE TO THE BRAIN' }, cam: [520, 920, 1.0, 500, 920, 1.12, .02, -.02], mag: [1, 1], tag: ['AMONG THE FIRST', 'to start twitching'] },
  { t: 36.7, fn: coldFace, o: { fast: 1, text: 'WARMING YOUR HEAD', size: 90 }, cam: [540, 960, 1.0, 540, 980, 1.1, 0, .02], mag: [1, 1], tag: ['JAW BOUNCES', 'to warm up your head'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
