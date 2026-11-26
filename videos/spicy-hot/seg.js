const SEG = [
  { t: 0, fn: hotFace, o: { bite: 1 }, cam: [540, 1050, .9, 560, 1050, 1.05, 0, .02], mag: [1, 1], big2: ['WHY DOES SPICY FOOD', 'FEEL HOT?!'] },
  { t: 1.9, fn: hotFace, o: { fire: 1, flush: 1, sweat: 1 }, cam: [540, 1080, 1.05, 540, 1100, 1.3, .02, -.02], mag: [1, 1], tag: ['MOUTH ON FIRE', 'literally burning?'] },
  { t: 4.5, fn: roomTemp, o: {}, cam: [560, 960, 1.0, 600, 960, 1.12, 0, .02], mag: [1, 1], tag: ['BUT THE PEPPER IS…', 'just room temperature'] },
  { t: 6.7, fn: alarm, o: { text: 'YOU\'RE BURNING!' }, cam: [960, 560, .85, 960, 560, 1.0, .02, -.02], mag: [1, 1], tag: ['A TRICK', 'pain receptors fooled'] },
  { t: 12.2, fn: capsaicin, o: {}, cam: [540, 980, 1.0, 540, 940, 1.12, 0, .02], mag: [1, 1], tag: ['CHILI PEPPERS CONTAIN', 'a compound called capsaicin'] },
  { t: 15.6, fn: tongue, o: { bind: 1, text: 'IT BINDS!' }, cam: [540, 980, 1.0, 540, 1000, 1.15, 0, .02], mag: [1, 1], tag: ['TRPV1 RECEPTORS', 'heat sensors on your tongue'] },
  { t: 21.5, fn: threshold, o: {}, cam: [560, 940, 1.0, 560, 940, 1.08, 0, .01], mag: [1, 1], tag: ['NORMALLY', 'they fire only above 109°F'] },
  { t: 27.1, fn: threshold, o: { text: 'TISSUE WARNING' }, cam: [560, 900, 1.05, 560, 880, 1.15, -.02, .02], mag: [1, 1], tag: ['AN EARLY WARNING', 'before tissue gets damaged'] },
  { t: 30.4, fn: threshold, o: { lower: 1 }, cam: [560, 940, 1.0, 580, 960, 1.08, .02, -.02], mag: [1, 1], tag: ['CAPSAICIN', 'lowers that threshold'] },
  { t: 32.4, fn: tongue, o: { open: 1, alarm: 1, text: 'BURN ALARM!', col: '#ff6a5a' }, cam: [540, 1000, 1.05, 540, 1060, 1.2, -.02, .02], mag: [1, 1], tag: ['EMERGENCY', 'burn alarm in your nerves'] },
  { t: 35.6, fn: hotFace, o: { sweat: 1, flush: u => .4 + .6 * clamp(u * 2), text: 'SWEAT & FLUSH', ty: 540 }, cam: [540, 1000, 1.0, 540, 1000, 1.12, 0, .02], mag: [1, 1], tag: ['YOUR BRAIN RESPONDS', 'sweating, flushing'] },
  { t: 38.9, fn: hotFace, o: { sweat: 1, flush: 1, endo: 1, text: 'ENDORPHINS', ty: 540 }, cam: [540, 980, 1.0, 540, 980, 1.15, .02, -.02], mag: [1, 1], tag: ['ENDORPHINS', 'vs. a fire that doesn\'t exist'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
