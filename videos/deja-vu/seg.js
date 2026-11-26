const SEG = [
  { t: 0, fn: eerie, o: { calm: 1 }, cam: [540, 1050, .95, 540, 1000, 1.1, 0, .02], mag: [1, 1], big2: ['WHY DO WE GET', 'DÉJÀ VU?!'] },
  { t: 3.8, fn: eerie, o: { text: 'I\'VE LIVED THIS BEFORE…', size: 84 }, cam: [540, 1000, 1.1, 540, 960, 1.35, -.03, .03], mag: [1, 1], tag: ['EERIE FEELING', 'this exact moment… again'] },
  { t: 9.6, fn: glitchBrain, o: {}, cam: [960, 600, .85, 1000, 640, 1.05, 0, .02], mag: [1, 1], tag: ['SCIENTISTS BELIEVE', 'a tiny memory glitch'] },
  { t: 15.5, fn: pipeline, o: {}, cam: [540, 860, 1.0, 540, 860, 1.08, 0, .01], mag: [1, 1], tag: ['NORMALLY', 'senses first, then memory check'] },
  { t: 23.7, fn: pipeline, o: { glitch: 1 }, cam: [540, 860, 1.0, 600, 880, 1.1, .02, -.01], mag: [1, 1], tag: ['DURING DÉJÀ VU', 'a brief misfire'] },
  { t: 31.2, fn: pipeline, o: { glitch: 1 }, cam: [600, 940, 1.05, 560, 940, 1.12, -.01, .02], mag: [1, 1], tag: ['BEFORE YOU NOTICE', 'the present is still processing'] },
  { t: 35.5, fn: earlyArrival, o: {}, cam: [540, 960, 1.0, 560, 960, 1.12, 0, .02], mag: [1, 1], tag: ['ARRIVES EARLY', 'from your memory bank'] },
  { t: 39.5, fn: eerie, o: { text: 'RELIVING THE PAST?!' }, cam: [540, 980, 1.05, 540, 960, 1.3, .03, -.03], mag: [1, 1], tag: ['BRAIN TRICKED', 'it feels like the past'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
