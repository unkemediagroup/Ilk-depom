const SEG = [
  { t: 0, fn: eyeFlutter, o: {}, cam: [540, 960, .95, 540, 960, 1.15, 0, .02], mag: [1, 1], big2: ['EYE TWITCHING?!', 'HERE IS WHY'] },
  { t: 2.8, fn: eyeFlutter, o: {}, cam: [540, 900, 1.6, 540, 880, 1.9, .02, -.02], mag: [2, 4] },
  { t: 3.9, fn: lookers, o: {}, cam: [540, 980, 1.0, 540, 980, 1.1, 0, .01], mag: [1, 1] },
  { t: 6.6, fn: eyeFlutter, o: { text: 'MYOKYMIA' }, cam: [540, 960, 1.1, 540, 960, 1.25, -.02, .02], mag: [1, 2], tag: ['MYOKYMIA', 'a harmless eyelid spasm'] },
  { t: 9.5, fn: lidMuscle, o: {}, cam: [540, 860, 1.2, 540, 960, 1.0, .02, -.02], mag: [400, 300], tag: ['TINY NERVES MISFIRE', 'the eyelid muscle twitches'] },
  { t: 13.9, fn: eye, o: { bl: s => Math.max(0, Math.sin(clamp(((s % 1.1) - .2) / .18) * Math.PI)) }, cam: [540, 960, 1.2, 540, 960, 1.4, 0, .02], mag: [1, 2], tag: ['FASTEST MUSCLES', 'in the human body'] },
  { t: 17.3, fn: neurons, o: {}, cam: [540, 960, 1.0, 600, 900, 1.35, .03, -.03], mag: [300, 800], tag: ['SUPER REACTIVE', 'to even minor imbalances'] },
  { t: 22.6, fn: triggers3, o: {}, cam: [540, 960, 1.0, 540, 960, 1.05, 0, .01], mag: [1, 1], tag: ['3 BIGGEST CULPRITS', ''] },
  { t: 25.6, fn: triggers3, o: {}, cam: [600, 960, 1.15, 540, 960, 1.0, .02, -.01], mag: [1, 1], tag: ['3 BIGGEST CULPRITS', 'sleep · stress · caffeine'] },
  { t: 28.6, fn: axonRace, o: {}, cam: [540, 960, 1.0, 600, 960, 1.3, .03, -.02], mag: [400, 800], tag: ['OVERSTIMULATED', 'nervous system'] },
  { t: 31.0, fn: screenEye, o: {}, cam: [540, 1100, .9, 540, 1050, 1.05, 0, .02], mag: [1, 1], tag: ['DRY EYES', 'from staring at screens'] },
  { t: 35.9, fn: remedies3, o: {}, cam: [540, 960, 1.0, 540, 960, 1.05, 0, .01], mag: [1, 1], tag: ['THE FIX', ''] },
  { t: 39.2, fn: eye, o: { noblink: 1, film: .8 }, cam: [540, 960, 1.3, 540, 960, 1.0, .02, -.02], mag: [2, 1], tag: ['CALMS DOWN', 'within a few days'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
