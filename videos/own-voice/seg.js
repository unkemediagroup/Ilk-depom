const SEG = [
  { t: 0, fn: phoneRec, o: {}, cam: [540, 1050, .9, 540, 1000, 1.1, 0, .02], mag: [1, 1], big2: ['WHY DOES YOUR VOICE', 'SOUND WEIRD ON RECORDINGS?!'] },
  { t: 3.4, fn: phoneRec, o: { text: 'IS THAT ME?!', shake: 1 }, cam: [540, 1000, 1.0, 560, 1000, 1.15, .02, -.03], mag: [1, 1], tag: ['SO WEIRD', 'it barely sounds like you'] },
  { t: 6.0, fn: speakerListener, o: { q: 1 }, cam: [540, 1000, 1.0, 400, 960, 1.15, 0, .02], mag: [1, 1], tag: ['YOUR REAL VOICE', 'you never hear it like others do'] },
  { t: 10.6, fn: speakerListener, o: { waves: 1 }, cam: [540, 1000, 1.0, 640, 980, 1.15, 0, -.02], mag: [1, 1], tag: ['OTHER PEOPLE', 'sound waves through the air'] },
  { t: 16.1, fn: twoPaths, o: { mode: 'both', text: 'TWO PATHWAYS' }, cam: [520, 1040, .95, 520, 1040, 1.05, 0, .02], mag: [1, 1], tag: ['WHEN YOU SPEAK', 'two paths at the same time'] },
  { t: 21.7, fn: twoPaths, o: { mode: 'air', text: 'THROUGH THE AIR' }, cam: [520, 1040, 1.0, 540, 1040, 1.1, -.02, .02], mag: [1, 1], tag: ['PATH 1', 'sound through the air'] },
  { t: 23.3, fn: twoPaths, o: { mode: 'bone', text: 'THROUGH YOUR SKULL', size: 80 }, cam: [480, 1060, 1.0, 440, 1060, 1.12, .02, -.02], mag: [1, 1], tag: ['PATH 2', 'vibrations through bone & tissue'] },
  { t: 28.0, fn: freqBars, o: {}, cam: [540, 1000, 1.0, 540, 980, 1.12, 0, .02], mag: [1, 1], tag: ['DENSE SKULL BONES', 'amplify lower frequencies'] },
  { t: 31.4, fn: compare, o: {}, cam: [540, 960, 1.0, 540, 960, 1.1, -.01, .02], mag: [1, 1], tag: ['INSIDE YOUR HEAD', 'deeper, richer, warmer'] },
  { t: 36.1, fn: twoPaths, o: { mode: 'rec', text: 'NO BONE CONDUCTION' }, cam: [500, 1040, 1.0, 520, 1040, 1.1, 0, .02], mag: [1, 1], tag: ['A RECORDING', 'removes bone conduction'] },
  { t: 38.5, fn: phoneRec, o: { text: 'THE REAL YOU', col: '#7ad0ff' }, cam: [540, 1000, 1.0, 540, 1000, 1.15, -.02, .02], mag: [1, 1], tag: ['HOW YOU TRULY SOUND', 'to the outside world'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
