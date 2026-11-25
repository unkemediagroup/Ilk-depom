const SEG = [
  { t: 0, fn: crossLegs, o: { pins: 1 }, cam: [540, 1150, .85, 600, 1150, 1.0, 0, .02], mag: [1, 1], big2: ['WHY DOES YOUR FOOT', 'FALL ASLEEP?!'] },
  { t: 3.1, fn: footClose, o: { dead: 1, words: 1, pins: 1 }, cam: [600, 960, 1.0, 640, 1000, 1.2, .02, -.02], mag: [1, 1], tag: ['PINS AND NEEDLES', 'numb, heavy, buzzing'] },
  { t: 7.6, fn: bloodMyth, o: {}, cam: [540, 980, 1.0, 560, 980, 1.15, 0, .02], mag: [1, 1], tag: ['POPULAR MYTH', 'it\'s not your blood flow'] },
  { t: 12.2, fn: nerve, o: { press: 1, text: 'SQUISHED NERVES' }, cam: [540, 1040, 1.0, 540, 1040, 1.15, -.02, .02], mag: [1, 1], tag: ['THE REAL CAUSE', 'squished nerves'] },
  { t: 14.8, fn: bodyLine, o: {}, cam: [540, 1000, .95, 540, 1000, 1.05, 0, .01], mag: [1, 1], tag: ['NERVES', 'tiny electrical cables'] },
  { t: 17.6, fn: nerve, o: { text: 'CONSTANT MESSAGES', col: '#cfe0ff' }, cam: [540, 1040, 1.0, 600, 1040, 1.15, .02, -.01], mag: [1, 1], tag: ['NERVES', 'brain ↔ toes, nonstop'] },
  { t: 20.4, fn: nerve, o: { press: 1, text: 'SUSTAINED PRESSURE' }, cam: [540, 1020, .95, 540, 1040, 1.15, 0, .02], mag: [1, 1], tag: ['PRESSURE', 'compresses the nerve pathway'] },
  { t: 25.4, fn: nerve, o: { press: 1, block: 1, text: 'SIGNALS BLOCKED', col: '#ff6a6a' }, cam: [540, 1060, 1.0, 540, 1060, 1.1, -.02, .02], mag: [1, 1], tag: ['BLOCKED', 'signals can\'t get through'] },
  { t: 27.3, fn: footClose, o: { dead: 1, text: 'FEELS DEAD', col: '#c8d0e0' }, cam: [600, 1000, 1.0, 620, 1000, 1.15, .02, -.02], mag: [1, 1], tag: ['NUMB FOOT', 'feels completely dead'] },
  { t: 29.7, fn: crossLegs, o: { stand: 1 }, cam: [540, 1100, .9, 560, 1000, 1.05, 0, .01], mag: [1, 1], tag: ['STAND UP', 'release the pressure'] },
  { t: 31.5, fn: nerve, o: { press: 1, release: 1, text: 'RELEASED!' }, cam: [540, 1040, 1.0, 540, 1040, 1.15, 0, .02], mag: [1, 1], tag: ['NERVES WAKE UP', 'suddenly'] },
  { t: 34.5, fn: nerve, o: { chaos: 1 }, cam: [540, 1040, 1.05, 560, 1040, 1.2, .02, -.03], mag: [1, 1], tag: ['CHAOTIC FIRING', 'hyperactive signals, all at once'] },
  { t: 38.2, fn: footClose, o: { dead: u => .5 * (1 - u), pins: 1 }, cam: [620, 1000, 1.05, 600, 980, 1.2, -.02, .02], mag: [1, 1], tag: ['INTENSE TINGLING', ''] },
  { t: 40.4, fn: footClose, o: { text: 'BACK TO NORMAL', col: '#7aff9a', pins: 2 }, cam: [600, 980, 1.0, 560, 960, 1.1, 0, .01], mag: [1, 1], tag: ['NORMAL SIGNALS', 'return'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
