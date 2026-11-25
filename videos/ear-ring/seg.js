const EC = [960, 540];
const SEG = [
  { t: 0, fn: bigEar, o: {}, cam: [560, 980, .95, 580, 1000, 1.12, 0, .02], mag: [1, 1], big2: ['EARS RINGING', 'OUT OF NOWHERE?!'] },
  { t: 2.6, fn: bigEar, o: { ring: 1, at: 0 }, cam: [600, 1000, 1.15, 600, 1010, 1.45, .02, -.02], mag: [1, 2] },
  { t: 4.4, fn: toneWave, o: {}, cam: [540, 960, 1.1, 540, 960, 1.0, -.03, .02], mag: [1, 1] },
  { t: 7.0, fn: bigEar, o: { ring: 1, at: -1 }, cam: [580, 980, 1.0, 600, 1000, 1.2, -.02, .02], mag: [1, 2], tag: ['TRANSIENT EAR NOISE', 'a brief, sudden ringing'] },
  { t: 9.9, fn: crowd, o: {}, cam: [540, 960, 1.0, 540, 960, 1.1, .02, -.01], mag: [1, 1], tag: ['IT HAPPENS', 'to almost everyone'] },
  { t: 12.7, fn: ear, o: { cochlea: 1 }, cam: [600, 560, 1.5, 560, 540, 2.0, 0, .03], mag: [5, 20], tag: ['INNER EAR', 'the snail-shaped cochlea'] },
  { t: 14.4, fn: hairCells, o: { wave: 1, labels: 1 }, cam: [540, 960, 1.0, 540, 940, 1.12, 0, .02], mag: [2000, 3000], tag: ['HAIR CELLS', 'thousands of them'] },
  { t: 17.0, fn: hairCells, o: { wave: 1, signal: 1 }, cam: [540, 1100, 1.25, 540, 1300, 1.0, .02, -.02], mag: [3000, 2000], tag: ['SOUND → ELECTRICITY', 'signals sent to your brain'] },
  { t: 20.6, fn: hairCells, o: { misfire: 1 }, cam: [540, 860, 1.1, 540, 840, 1.45, -.02, .02], mag: [2500, 5000], tag: ['A FEW CELLS MISFIRE', ''] },
  { t: 23.6, fn: eardrum, o: {}, cam: [540, 960, 1.0, 560, 960, 1.15, 0, .02], mag: [10, 20], tag: ['SUDDEN PRESSURE CHANGES', ''] },
  { t: 26.4, fn: speaker, o: {}, cam: [540, 960, 1.1, 540, 960, .95, .02, -.02], mag: [1, 1], tag: ['LOUD NOISES EARLIER', ''] },
  { t: 28.7, fn: eye, o: { bl: s => Math.max(0, Math.sin(clamp((s - .3) / .8) * Math.PI)) * .9 }, cam: [540, 960, 1.2, 540, 960, 1.4, 0, .02], mag: [1, 2], tag: ['OR SIMPLE FATIGUE', ''] },
  { t: 30.3, fn: hairCells, o: { misfire: 1 }, cam: [540, 760, 1.6, 540, 800, 1.3, .03, -.02], mag: [5000, 4000], tag: ['A FALSE SIGNAL', ''] },
  { t: 32.1, fn: brainGlitch, o: {}, cam: [960, 560, .85, 960, 540, 1.0, -.02, .02], mag: [1, 2], tag: ['BRAIN HEARS A TONE', 'a glitch, not a real sound'] },
  { t: 35.4, fn: toneWave, o: { decay: 1 }, cam: [540, 960, 1.0, 540, 960, 1.1, 0, .01], mag: [1, 1], tag: ['RECALIBRATING', 'within seconds'] },
  { t: 38.4, fn: bigEar, o: { ring: 'fade' }, cam: [580, 1000, 1.3, 560, 980, 1.0, .02, 0], mag: [2, 1], tag: ['THE SOUND FADES', ''] },
  { t: 41.4, fn: hairCells, o: { damage: 1 }, cam: [540, 900, 1.0, 540, 880, 1.25, 0, .02], mag: [2000, 3000], tag: ['IF IT NEVER STOPS…', ''] },
  { t: 44.0, fn: bigEar, o: { ring: 1, at: -1, label: 'SEE A DOCTOR' }, cam: [580, 1000, 1.1, 580, 1000, .95, -.02, .02], mag: [1, 1], tag: ['POSSIBLE HAIR CELL DAMAGE', 'get your hearing checked'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
