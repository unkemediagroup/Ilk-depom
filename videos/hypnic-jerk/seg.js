const SEG = [
  { t: 0, fn: bedJerk, o: {}, cam: [540, 1000, .95, 520, 1060, 1.15, 0, .02], mag: [1, 1], big2: ['WHY DO YOU JOLT', 'RIGHT BEFORE SLEEP?!'] },
  { t: 2.1, fn: bedJerk, o: { jerkAt: 2.0 }, cam: [400, 1080, 1.3, 380, 1060, 1.5, .02, -.02], mag: [1, 1] },
  { t: 5.4, fn: eye, o: { bl: s => 1 - clamp(s * 2.5) }, cam: [540, 960, 1.3, 540, 960, 1.5, 0, .02], mag: [1, 2] },
  { t: 7.2, fn: bedJerk, o: { jerkAt: 1.6 }, cam: [540, 1050, 1.0, 520, 1050, 1.15, -.02, .02], mag: [1, 1], tag: ['HYPNIC JERK', 'a sudden "sleep start"'] },
  { t: 10.1, fn: seventy, o: {}, cam: [540, 1000, 1.0, 540, 1000, .95, 0, .01], mag: [1, 1], tag: ['VERY COMMON', 'roughly 7 in 10 people'] },
  { t: 13.3, fn: heart, o: { night: 1 }, cam: [540, 960, .9, 540, 960, 1.1, 0, .02], mag: [1, 2], tag: ['HEART RATE SLOWS', ''] },
  { t: 15.4, fn: diaphragm, o: { breath: 1, labels: 1 }, cam: [540, 960, .9, 540, 980, 1.0, 0, .02], mag: [1, 1], tag: ['BREATHING DEEPENS', ''] },
  { t: 17.5, fn: muscle, o: { relax: 1 }, cam: [540, 960, 1.2, 560, 960, .95, -.02, .02], mag: [300, 200], tag: ['MUSCLES RELAX', 'completely'] },
  { t: 20.0, fn: brain3d, o: { glows: [[-160, -100, 260, 0], [90, -20, 220, 1.7]] }, cam: [960, 560, .85, 960, 540, 1.0, -.02, .02], mag: [1, 2], tag: ['YOUR BRAIN MISREADS IT', ''] },
  { t: 23.4, fn: cliffFall, o: {}, cam: [540, 960, 1.0, 600, 1100, 1.1, 0, .03], mag: [1, 1], tag: ['FALLING… OR FAINTING?', ''] },
  { t: 26.7, fn: alarm, o: {}, cam: [960, 560, .9, 960, 560, 1.05, .02, -.02], mag: [1, 1], tag: ['IN A SPLIT SECOND', ''] },
  { t: 29.0, fn: axonRace, o: {}, cam: [540, 960, 1.0, 600, 960, 1.3, .03, -.02], mag: [400, 800], tag: ['EMERGENCY SIGNAL', 'nerves fire to your muscles'] },
  { t: 31.4, fn: muscle, o: { twitch: 1, at: .9, nerve: 1 }, cam: [540, 800, 1.3, 540, 960, 1.0, .02, -.02], mag: [600, 400], tag: ['CATCH YOURSELF!', ''] },
  { t: 34.4, fn: triggers3, o: {}, cam: [540, 960, 1.0, 540, 960, 1.05, 0, .01], mag: [1, 1], tag: ['TRIGGERS', 'make it more likely'] },
  { t: 37.2, fn: alarm, o: { text: 'FALSE ALARM!' }, cam: [960, 560, 1.0, 960, 560, .88, -.02, .02], mag: [1, 1], tag: ['A FALSE ALARM', ''] },
  { t: 40.6, fn: bedJerk, o: { jerkAt: 1.9 }, cam: [540, 1050, .95, 420, 1060, 1.35, 0, .02], mag: [1, 1], tag: ['PEACEFUL NIGHT…', ''] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
