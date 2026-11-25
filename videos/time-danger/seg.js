const SEG = [
  { t: 0, fn: carCrash, o: {}, cam: [540, 1200, .9, 600, 1250, 1.15, 0, .02], mag: [1, 1], big2: ['WHY DOES TIME', 'SLOW DOWN IN DANGER?!'] },
  { t: 1.5, fn: cliffFall, o: {}, cam: [540, 960, 1.0, 600, 1100, 1.15, 0, .03], mag: [1, 1] },
  { t: 3.2, fn: carCrash, o: { slow: 1 }, cam: [700, 1250, 1.2, 760, 1250, 1.45, .02, -.02], mag: [1, 1], tag: ['TIME STRETCHES', 'dramatic slow motion'] },
  { t: 6.9, fn: camNo, o: {}, cam: [540, 960, 1.0, 540, 960, 1.1, 0, .02], mag: [1, 1], tag: ['NOT A HIGH-SPEED CAMERA', ''] },
  { t: 12.4, fn: memories, o: { swap: 1, text: 'A MEMORY TRICK' }, cam: [960, 560, .7, 960, 540, .85, 0, .02], mag: [1, 1], tag: ['IT\'S A TRICK', 'on your memory'] },
  { t: 14.7, fn: alarm, o: { text: 'EMERGENCY!' }, cam: [960, 560, .9, 960, 560, 1.05, .02, -.02], mag: [1, 1], tag: ['LIFE-THREATENING', 'emergency mode'] },
  { t: 16.7, fn: amyg, o: {}, cam: [960, 600, .95, 990, 620, 1.3, -.02, .02], mag: [1, 3], tag: ['AMYGDALA', 'kicks into overdrive'] },
  { t: 20.0, fn: shards, o: { focus: 1, text: 'EVERY TINY DETAIL' }, cam: [960, 540, .7, 960, 540, .85, 0, .02], mag: [1, 1], tag: ['RECORDED', 'with extreme intensity'] },
  { t: 25.0, fn: funnel, o: {}, cam: [540, 980, 1.0, 540, 980, 1.05, 0, .01], mag: [1, 1], tag: ['NORMALLY', 'boring details get filtered'] },
  { t: 28.8, fn: funnel, o: { danger: 1 }, cam: [540, 980, 1.05, 540, 1000, 1.15, 0, .02], mag: [1, 1], tag: ['IN DANGER', 'massive, dense information'] },
  { t: 34.2, fn: filmStrip, o: {}, cam: [540, 960, 1.0, 540, 960, 1.05, 0, .01], mag: [1, 1], tag: ['LOOKING BACK…', ''] },
  { t: 36.4, fn: filmStrip, o: { dense: 1 }, cam: [540, 960, 1.05, 540, 980, 1.15, -.02, .02], mag: [1, 1], tag: ['SO MANY MEMORIES', ''] },
  { t: 39.4, fn: clockWarp, o: { slow: 1, text: 'MUCH LONGER TIME' }, cam: [960, 560, .95, 960, 540, 1.1, 0, .02], mag: [1, 1], tag: ['YOUR BRAIN CONCLUDES', 'it took much longer'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
