const SEG = [
  { t: 0, fn: onionCut, o: { cut: 1 }, cam: [540, 1100, .95, 540, 1150, 1.15, 0, .02], mag: [1, 1], big2: ['WHY DO ONIONS', 'MAKE YOU CRY?!'] },
  { t: 2.4, fn: onionCut, o: { text: 'SELF-DEFENSE!' }, cam: [540, 1150, 1.2, 540, 1150, 1.0, .02, -.02], mag: [1, 1] },
  { t: 5.3, fn: soil, o: {}, cam: [540, 1100, .95, 540, 1200, 1.1, 0, .02], mag: [1, 2], tag: ['GROWING UNDERGROUND', 'onions absorb sulfur'] },
  { t: 8.5, fn: critter, o: {}, cam: [480, 1050, 1.1, 460, 1050, 1.25, 0, .02], mag: [1, 1], tag: ['PROTECTION', 'against hungry animals'] },
  { t: 11.1, fn: onionCut, o: { cut: 1 }, cam: [540, 1100, 1.2, 540, 1150, 1.4, .02, -.02], mag: [1, 1], tag: ['THE KNIFE SLICES IN', ''] },
  { t: 13.2, fn: cellsBurst, o: {}, cam: [540, 960, 1.0, 540, 960, 1.15, 0, .02], mag: [500, 900], tag: ['MILLIONS OF CELLS BURST', ''] },
  { t: 16.0, fn: cellsBurst, o: {}, cam: [600, 800, 1.6, 540, 900, 1.25, .02, -.02], mag: [1500, 1000], tag: ['ENZYMES + SULFUR', 'mix instantly'] },
  { t: 20.1, fn: onionCut, o: { gas: 1, text: 'INVISIBLE GAS' }, cam: [540, 900, 1.0, 540, 800, 1.1, 0, .02], mag: [1, 1], tag: ['SYN-PROPANETHIAL-S-OXIDE', 'a lightweight gas'] },
  { t: 25.1, fn: gasEye, o: { text: 'STRAIGHT INTO YOUR EYES' }, cam: [540, 1100, .95, 540, 1000, 1.15, 0, .02], mag: [1, 2], tag: ['IT FLOATS UP', ''] },
  { t: 27.9, fn: gasEye, o: { acid: 1, squint: 1 }, cam: [540, 960, 1.2, 540, 960, 1.45, .02, -.02], mag: [2, 4], tag: ['ON THE WET EYE SURFACE', 'it becomes a mild acid'] },
  { t: 34.2, fn: gland, o: {}, cam: [540, 900, 1.0, 540, 1200, 1.3, -.03, .03], mag: [200, 500], tag: ['TEAR GLANDS PANIC', 'and flood the eye'] },
  { t: 37.0, fn: tearsFlood, o: {}, cam: [540, 1100, 1.0, 540, 1150, 1.1, 0, .02], mag: [1, 1], tag: ['TEARS', 'wash the chemical away'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
