const SEG = [
  { t: 0, fn: faceFront, o: { dark: 1, sleepy: 1, zz: 1 }, cam: [540, 1050, .85, 540, 1000, 1.05, 0, .02], mag: [1, 1], big2: ['WHY DO WE GET', 'DARK CIRCLES UNDER OUR EYES?!'] },
  { t: 3.1, fn: notBruise, o: {}, cam: [540, 960, .95, 540, 960, 1.05, 0, .02], mag: [1, 1], tag: ['NOT BRUISES', 'not dark pigment either'] },
  { t: 5.9, fn: faceFront, o: { dark: 1, veins: 1, sleepy: 1 }, cam: [540, 980, 1.0, 380, 1000, 1.6, 0, .02], mag: [1, 3], tag: ['IT\'S YOUR VESSELS', 'showing through the skin'] },
  { t: 9.1, fn: skinSection, o: {}, cam: [540, 960, 1.0, 540, 960, 1.05, 0, .01], mag: [1, 1], tag: ['NORMAL SKIN', 'thick, with fat padding'] },
  { t: 11.3, fn: skinSection, o: { thin: 1, text: 'THINNEST SKIN' }, cam: [540, 900, 1.0, 540, 880, 1.15, 0, .02], mag: [1, 1], tag: ['UNDER YOUR EYES', 'less than half a millimeter'] },
  { t: 15.1, fn: skinSection, o: { thin: 1, text: 'ZERO FAT', col: '#ff8a8a' }, cam: [540, 900, 1.1, 540, 900, 1.2, -.02, .02], mag: [1, 1], tag: ['ALMOST NO FAT', 'nothing to hide what\'s below'] },
  { t: 18.2, fn: causes3, o: {}, cam: [540, 840, 1.0, 540, 840, 1.06, 0, .01], mag: [1, 1], tag: ['WHEN YOU ARE…', ''] },
  { t: 21.3, fn: skinSection, o: { thin: 1, pool: u => eio(clamp(u * 1.4)), text: 'BLOOD POOLS' }, cam: [540, 960, 1.0, 540, 1000, 1.2, .02, -.02], mag: [1, 1], tag: ['CIRCULATION SLOWS', 'blood pools in capillaries'] },
  { t: 26.7, fn: faceFront, o: { dark: u => .4 + .6 * clamp(u * 2), veins: 1, sleepy: 1, text: 'BLUISH-PURPLE', col: '#c08aff' }, cam: [540, 960, 1.0, 540, 980, 1.25, -.02, .02], mag: [1, 1], tag: ['DARK COLOR', 'bluish-purple'] },
  { t: 29.6, fn: skinSection, o: { thin: 1, pool: 1, light: 1, text: 'TRANSLUCENT', col: '#e8d0ff' }, cam: [540, 920, 1.0, 540, 940, 1.15, 0, .02], mag: [1, 1], tag: ['PRACTICALLY SEE-THROUGH', 'vessels shine to the surface'] },
  { t: 36.0, fn: fixes3, o: {}, cam: [540, 840, 1.0, 540, 840, 1.06, 0, .01], mag: [1, 1], tag: ['SHRINK THEM BACK', 'sleep · water · cooling'] },
  { t: 39.1, fn: faceFront, o: { dark: u => .5 * (1 - eio(clamp(u * 1.3))), ice: 1, text: 'VESSELS SHRINK', col: '#7aff9a' }, cam: [540, 980, 1.0, 540, 980, 1.15, 0, .02], mag: [1, 1], tag: ['BACK TO NORMAL', ''] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
