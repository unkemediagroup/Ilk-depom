const SEG = [
  { t: 0, fn: holdFace, o: { p: u => .2 + .5 * u }, cam: [560, 1100, .85, 560, 1080, 1.0, 0, .02], mag: [1, 1], big2: ['WHAT HAPPENS WHEN YOU', 'HOLD IN A SNEEZE?!'] },
  { t: 2.7, fn: holdFace, o: { p: u => .55 + .2 * u, gauge: 1 }, cam: [560, 960, 1.0, 600, 980, 1.12, .02, -.02], mag: [1, 1], tag: ['PINCH & CLAMP', 'seems polite…'] },
  { t: 5.9, fn: holdFace, o: { p: u => .8 + .2 * u, gauge: 1, bomb: 1 }, cam: [580, 960, 1.05, 580, 960, 1.2, -.02, .02], mag: [1, 1], tag: ['A PRESSURE BOMB', 'inside your head'] },
  { t: 9.5, fn: speedSneeze, o: {}, cam: [540, 980, 1.0, 600, 980, 1.12, 0, .02], mag: [1, 1], tag: ['A NORMAL SNEEZE', 'blasts air at 100+ mph'] },
  { t: 14.6, fn: airHead, o: { mode: 'out', text: 'CLEARS IRRITANTS', ty: 460 }, cam: [600, 960, .95, 620, 960, 1.05, 0, .02], mag: [1, 1], tag: ['NORMALLY', 'air exits nose & mouth'] },
  { t: 16.3, fn: airHead, o: { mode: 'back', text: 'BOTH EXITS BLOCKED', ty: 460, size: 90 }, cam: [600, 960, .95, 600, 960, 1.05, .02, -.02], mag: [1, 1], tag: ['BLOCK BOTH EXITS', 'air is forced backward'] },
  { t: 22.0, fn: airHead, o: { mode: 'back' }, cam: [520, 900, 1.05, 440, 860, 1.25, -.02, .02], mag: [1, 2], tag: ['SINUSES · NASAL CAVITIES', 'and eustachian tubes'] },
  { t: 25.8, fn: holdFace, o: { p: 1, gauge: 1 }, cam: [560, 900, 1.05, 560, 860, 1.2, .02, -.02], mag: [1, 1], tag: ['A SUDDEN SPIKE', 'in internal pressure'] },
  { t: 27.7, fn: risks, o: {}, cam: [540, 820, 1.0, 540, 820, 1.05, 0, .01], mag: [1, 1], tag: ['IT CAN…', ''] },
  { t: 37.5, fn: elbow, o: {}, cam: [560, 1000, 1.0, 560, 1000, 1.1, 0, .02], mag: [1, 1], tag: ['ALWAYS LET IT OUT', 'cover it with your elbow'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
