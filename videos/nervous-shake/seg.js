const SEG = [
  { t: 0, fn: stage, o: { shake: 1 }, cam: [540, 1000, .95, 540, 1050, 1.15, 0, .02], mag: [1, 1], big2: ['SHAKY HANDS', 'WHEN YOU\'RE NERVOUS?!'] },
  { t: 2.0, fn: stage, o: { shake: 1 }, cam: [540, 1150, 1.4, 540, 1100, 1.2, .02, -.02], mag: [1, 1] },
  { t: 3.8, fn: handsShake, o: {}, cam: [540, 1100, 1.0, 540, 1100, 1.15, 0, .02], mag: [1, 1], tag: ['TREMBLING HANDS', 'like you\'re freezing cold'] },
  { t: 7.5, fn: brain3d, o: { glows: [[-160, -100, 260, 0], [90, -20, 220, 1.7]] }, cam: [960, 560, .85, 960, 540, 1.0, -.02, .02], mag: [1, 2], tag: ['YOUR BRAIN CAN\'T TELL', 'the difference'] },
  { t: 10.6, fn: stage, o: { text: 'SOCIAL STRESS…' }, cam: [540, 1000, 1.0, 540, 1000, 1.1, 0, .02], mag: [1, 1] },
  { t: 12.4, fn: predator, o: {}, cam: [540, 1000, .95, 540, 960, 1.15, 0, .02], mag: [1, 1], tag: ['…OR A PREDATOR?', 'same alarm'] },
  { t: 14.4, fn: amyg, o: {}, cam: [960, 600, .95, 990, 620, 1.3, -.02, .02], mag: [1, 3], tag: ['AMYGDALA', 'triggers the alarm'] },
  { t: 17.2, fn: alarm, o: { text: 'FIGHT OR FLIGHT!' }, cam: [960, 560, .9, 960, 560, 1.05, .02, -.02], mag: [1, 1], tag: ['AN ANCIENT RESPONSE', ''] },
  { t: 19.4, fn: vesselAdr, o: {}, cam: [540, 960, 1.0, 540, 960, 1.3, 0, .06], mag: [100, 300], tag: ['ADRENALINE FLOOD', 'in your bloodstream'] },
  { t: 22.6, fn: heartFast, o: {}, cam: [540, 960, .9, 540, 960, 1.1, 0, .02], mag: [1, 2], tag: ['HEART RATE ↑', ''] },
  { t: 24.4, fn: vesselAdr, o: { text: 'OXYGEN-RICH BLOOD' }, cam: [540, 960, 1.3, 540, 960, 1.0, .06, 0], mag: [300, 150], tag: ['POWER TO YOUR MUSCLES', ''] },
  { t: 27.6, fn: skeleton, o: { run: 1 }, cam: [540, 960, .95, 540, 960, .85, -.02, .02], mag: [1, 1], tag: ['FIGHT… OR RUN!', ''] },
  { t: 30.0, fn: energy, o: { text: 'BUT YOU JUST STAND THERE' }, cam: [540, 1000, 1.0, 540, 1050, 1.15, 0, .02], mag: [1, 1] },
  { t: 33.4, fn: energy, o: { shake: 1 }, cam: [540, 1050, 1.3, 540, 1000, 1.05, .02, -.02], mag: [1, 1], tag: ['EXCESS ENERGY', '+ muscle tension'] },
  { t: 36.9, fn: handsShake, o: { voice: 1 }, cam: [540, 1000, 1.0, 540, 1000, 1.1, 0, .02], mag: [1, 1], tag: ['HANDS & VOICE SHAKE', ''] },
  { t: 39.2, fn: handsShake, o: { calm: 1 }, cam: [540, 1100, 1.15, 540, 1100, 1.0, -.02, .02], mag: [1, 1], tag: ['UNTIL THE ADRENALINE', 'clears out'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
