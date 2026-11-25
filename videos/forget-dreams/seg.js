const DC = [960, 560];
const SEG = [
  { t: 0, fn: dream, o: {}, cam: [960, 520, .78, 960, 500, .92, 0, .02], mag: [1, 1], big2: ['WHY DO DREAMS', 'VANISH SO FAST?!'] },
  { t: 2.5, fn: countdown, o: {}, cam: [540, 980, 1.0, 540, 980, 1.1, 0, .02], mag: [1, 1], tag: ['WITHIN 60 SECONDS…', ''] },
  { t: 5.0, fn: dream, o: { fade: 1, text: 'GONE.' }, cam: [960, 420, .9, 960, 420, 1.05, .02, -.01], mag: [1, 1], tag: ['EVERY DETAIL VANISHES', ''] },
  { t: 8.0, fn: brain3d, o: { glows: [[-160, -100, 200, 0]] }, cam: [960, 560, .85, 960, 540, 1.0, -.02, .02], mag: [1, 2], tag: ['MEMORY CHEMICALS', 'shut off while you sleep'] },
  { t: 11.6, fn: neurons, o: {}, cam: [540, 960, 1.0, 600, 900, 1.3, .03, -.03], mag: [300, 800], tag: ['LONG-TERM STORAGE', 'practically switched off'] },
  { t: 15.2, fn: dream, o: { text: 'REM SLEEP' }, cam: [1000, 400, 1.0, 1060, 360, 1.25, 0, .02], mag: [1, 2], tag: ['REM SLEEP', 'your most intense dreams'] },
  { t: 18.4, fn: neBar, o: {}, cam: [540, 960, 1.0, 540, 960, 1.05, 0, .01], mag: [1, 1], tag: ['NOREPINEPHRINE', 'almost zero during REM'] },
  { t: 21.5, fn: transfer, o: {}, cam: [540, 900, .95, 540, 900, 1.08, 0, .02], mag: [1, 1], tag: ['NO TRANSFER', 'short-term → permanent'] },
  { t: 24.6, fn: transfer, o: {}, cam: [540, 960, 1.2, 540, 900, 1.0, .02, -.02], mag: [1, 1], tag: ['NO TRANSFER', 'the memory never gets saved'] },
  { t: 27.6, fn: pfcOff, o: {}, cam: [880, 420, 1.0, 860, 420, 1.2, 0, .02], mag: [1, 2], tag: ['MEANWHILE…', ''] },
  { t: 30.6, fn: pfcOff, o: {}, cam: [880, 420, 1.3, 900, 460, 1.05, .02, -.02], mag: [2, 1], tag: ['THE ORGANIZER', 'goes offline'] },
  { t: 33.9, fn: eye, o: { bl: s => 1 - clamp(s * 1.8) }, cam: [540, 960, 1.2, 540, 960, 1.4, 0, .02], mag: [1, 2], tag: ['WAKE UP MID-DREAM?', ''] },
  { t: 36.4, fn: notebook, o: {}, cam: [540, 960, 1.0, 560, 900, 1.15, 0, .02], mag: [1, 1], tag: ['WRITE IT DOWN', 'or say it out loud'] },
  { t: 39.0, fn: slateWipe, o: {}, cam: [540, 960, 1.0, 540, 940, 1.1, 0, .02], mag: [1, 1], tag: ['SLATE WIPED CLEAN', ''] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
