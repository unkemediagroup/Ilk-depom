const SEG = [
  { t: 0, fn: painFace, o: { glass: 0 }, cam: [540, 1050, .85, 540, 1020, 1.0, 0, .02], mag: [1, 1], big2: ['WHY DO WE GET', 'HEADACHES WHEN DEHYDRATED?!'] },
  { t: 3.0, fn: painFace, o: { glass: 0, text: 'THROBBING!', col: '#ff6a5a' }, cam: [540, 980, 1.0, 540, 980, 1.15, .02, -.02], mag: [1, 1], tag: ['DULL & THROBBING', 'ruins your entire day'] },
  { t: 7.0, fn: headX, o: { noPain: 1, text: 'BRAIN = NO PAIN', ty: 490, size: 84 }, cam: [540, 1000, .95, 540, 1000, 1.03, 0, .02], mag: [1, 1], tag: ['INTERESTINGLY', 'brain tissue has zero pain receptors'] },
  { t: 10.9, fn: headX, o: { labels: 1 }, cam: [540, 1000, 1.0, 560, 1000, 1.06, -.02, .02], mag: [1, 1], tag: ['IT\'S THE LAYERS', 'protecting & surrounding it'] },
  { t: 15.4, fn: waterBrain, o: {}, cam: [540, 960, 1.0, 540, 960, 1.12, 0, .02], mag: [1, 1], tag: ['YOUR BRAIN IS', 'roughly 75% water'] },
  { t: 19.0, fn: fluidDrop, o: {}, cam: [540, 960, 1.0, 540, 980, 1.1, 0, .02], mag: [1, 1], tag: ['DEHYDRATION', 'blood & fluid volume drop'] },
  { t: 22.9, fn: headX, o: { shrink: u => eio(clamp(u * 1.3)), labels: 1, text: 'BRAIN SHRINKS', ty: 490, size: 84 }, cam: [540, 1000, 1.0, 540, 1000, 1.05, .02, -.02], mag: [1, 1], tag: ['FLUID FALLS', 'brain pulls away from the skull'] },
  { t: 30.0, fn: headX, o: { shrink: 1, tension: 1, labels: 1, text: 'TENSION!', ty: 490, size: 84, col: '#ff6a5a' }, cam: [540, 1000, 1.0, 540, 1000, 1.05, 0, .02], mag: [1, 1], tag: ['GENTLE TUGGING', 'tension on the meninges'] },
  { t: 33.5, fn: headX, o: { shrink: 1, tension: 1, labels: 1 }, cam: [540, 960, 1.15, 600, 800, 1.5, -.02, .02], mag: [1, 2], tag: ['MENINGES', 'pain-detecting membranes'] },
  { t: 38.4, fn: painFace, o: { relief: 1, glass: u => clamp(1 - u * .8), text: 'DRINK WATER', col: '#7ad0ff' }, cam: [540, 1000, 1.0, 600, 1050, 1.15, 0, .02], mag: [1, 1], tag: ['A COUPLE OF GLASSES', 'restores fluid volume'] },
  { t: 40.9, fn: headX, o: { shrink: u => 1 - eio(clamp(u * 1.4)), water: 1, labels: 1, text: 'BRAIN EXPANDS BACK', ty: 490, col: '#7aff9a', size: 80 }, cam: [540, 1000, 1.0, 540, 1000, 1.05, 0, .02], mag: [1, 1], tag: ['NO MORE PULLING', 'headache fades'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
