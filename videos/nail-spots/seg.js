const SEG = [
  { t: 0, fn: fingerTop, o: { spots: 1 }, cam: [540, 1000, .8, 540, 1000, .92, 0, .02], mag: [1, 1], big2: ['WHY DO YOUR FINGERNAILS', 'HAVE WHITE SPOTS?!'] },
  { t: 2.4, fn: fingerTop, o: { spots: 1, ring: 1 }, cam: [540, 920, 1.2, 555, 900, 1.5, .02, -.02], mag: [1, 2], tag: ['WHITE SPOTS', 'or lines on your nails'] },
  { t: 4.4, fn: calciumMyth, o: {}, cam: [540, 960, 1.0, 540, 960, 1.12, 0, .02], mag: [1, 1], tag: ['WHAT YOU WERE TOLD', '"you lack calcium"'] },
  { t: 9.9, fn: fingerTop, o: { spots: 1, ring: 1, text: 'LEUKONYCHIA', size: 96 }, cam: [540, 980, 1.0, 545, 960, 1.1, -.02, .02], mag: [1, 1], tag: ['PUNCTATE LEUKONYCHIA', 'the official name'] },
  { t: 12.5, fn: pct99, o: {}, cam: [540, 960, 1.0, 540, 960, 1.1, 0, .02], mag: [1, 1], tag: ['99% OF THE TIME', 'just tiny bruises'] },
  { t: 18.1, fn: oops3, o: {}, cam: [540, 840, 1.0, 540, 840, 1.06, 0, .01], mag: [1, 1], tag: ['MINOR BUMPS', 'you didn\'t even notice'] },
  { t: 25.2, fn: nailSide, o: { pocket: 1, grow: u => u * .25, text: 'SLOW GROWTH' }, cam: [540, 960, 1.0, 560, 960, 1.12, 0, .02], mag: [1, 1], tag: ['NAILS GROW', 'very slowly'] },
  { t: 28.0, fn: nailSide, o: { pocket: 1, grow: u => .25 + u * .3, ruler: 1 }, cam: [560, 1040, .95, 560, 1040, 1.05, 0, .01], mag: [1, 1], tag: ['ONLY ~3 MM', 'per month'] },
  { t: 30.2, fn: nailSide, o: { pocket: 1, grow: u => .55 + u * .45, ruler: 1, wk: 2 }, cam: [560, 1040, 1.0, 640, 1040, 1.1, .02, -.02], mag: [1, 2], tag: ['AIR POCKET / DAMAGED CELLS', 'takes weeks to grow out'] },
  { t: 35.6, fn: fingerTop, o: { spots: 1, ring: 1, text: 'WAIT… WHEN?!', size: 110 }, cam: [540, 980, 1.0, 540, 980, 1.05, 0, .02], mag: [1, 1], tag: ['BY THE TIME YOU SPOT IT', 'you\'ve forgotten the bump'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
