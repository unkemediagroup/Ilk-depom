const SEG = [
  { t: 0, fn: doorway, o: {}, cam: [540, 1100, .95, 560, 1000, 1.2, 0, .02], mag: [1, 1], big2: ['SUNLIGHT MAKES YOU', 'SNEEZE?!'] },
  { t: 3.1, fn: sneezeFace, o: { at: 2.6 }, cam: [540, 1000, 1.0, 600, 980, 1.2, .02, -.02], mag: [1, 1], tag: ['UNCONTROLLABLE URGE', 'to sneeze'] },
  { t: 7.0, fn: oneInFour, o: {}, cam: [540, 1000, 1.0, 540, 980, 1.1, 0, .01], mag: [1, 1], tag: ['GENETIC TRAIT', 'roughly 1 in 4 people'] },
  { t: 10.2, fn: dnaTrait, o: { text: 'PHOTIC SNEEZE REFLEX' }, cam: [540, 960, 1.0, 540, 940, 1.15, -.02, .02], mag: [1, 1], tag: ['OFFICIAL NAME', 'photic sneeze reflex'] },
  { t: 13.8, fn: headSection, o: { dust: 1, text: 'DUST & GERMS' }, cam: [600, 960, .95, 680, 980, 1.15, 0, .02], mag: [1, 1], tag: ['NORMAL SNEEZE', 'irritated trigeminal nerve'] },
  { t: 19.5, fn: headSection, o: { optic: 1 }, cam: [560, 860, 1.0, 520, 820, 1.2, .02, -.01], mag: [1, 1], tag: ['OPTIC NERVE', 'light signals: eyes → brain'] },
  { t: 24.0, fn: cables, o: {}, cam: [540, 960, 1.0, 560, 960, 1.15, 0, .02], mag: [1, 1], tag: ['SAME NEIGHBORHOOD', 'right next to the trigeminal'] },
  { t: 27.4, fn: sunEye, o: {}, cam: [540, 960, 1.0, 540, 900, 1.3, 0, .02], mag: [1, 1], tag: ['SUNLIGHT FLOODS', 'your eyes'] },
  { t: 30.3, fn: headSection, o: { optic: 1, light: 1 }, cam: [600, 860, 1.0, 560, 840, 1.15, -.02, .01], mag: [1, 1], tag: ['OPTIC NERVE FIRES', 'a massive signal'] },
  { t: 32.9, fn: cables, o: { leak: 1 }, cam: [540, 980, 1.05, 560, 1000, 1.2, .02, -.02], mag: [1, 1], tag: ['IT LEAKS OVER', 'stimulates the sneeze nerve'] },
  { t: 35.2, fn: headSection, o: { optic: 1, light: 1, leak: 1 }, cam: [620, 900, 1.05, 700, 960, 1.25, 0, .02], mag: [1, 1], tag: ['SNEEZE NERVE', 'activated'] },
  { t: 37.0, fn: tickled, o: {}, cam: [960, 600, .85, 960, 580, 1.0, 0, .02], mag: [1, 1], tag: ['BRAIN TRICKED', 'thinks your nose is tickled'] },
  { t: 40.0, fn: sneezeFace, o: { at: .9 }, cam: [560, 1000, 1.05, 640, 960, 1.3, -.02, .03], mag: [1, 1], tag: ['RAPID SNEEZE!', ''] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
