const SEG = [
  { t: 0, fn: stomachOrgan, o: { growl: 1 }, cam: [560, 1000, .9, 560, 1040, 1.08, 0, .02], mag: [1, 1], big2: ['STOMACH GROWLING?', 'IT\'S NOT HUNGER!'] },
  { t: 3.0, fn: stomachOrgan, o: { growl: 1 }, cam: [560, 1100, 1.3, 540, 1080, 1.1, .02, -.02], mag: [1, 1], tag: ['NOT EMPTINESS…', ''] },
  { t: 6.0, fn: stomachOrgan, o: { clean: 1 }, cam: [560, 1050, 1.0, 560, 1050, 1.2, -.02, .02], mag: [1, 2], tag: ['…IT\'S CLEANING HOUSE', ''] },
  { t: 9.2, fn: clockWarp, o: { text: '2 HOURS AFTER EATING' }, cam: [960, 560, .95, 960, 560, 1.1, 0, .02], mag: [1, 1] },
  { t: 11.9, fn: entericWall, o: { labels: 1 }, cam: [540, 1000, .8, 540, 1000, .9, 0, .02], mag: [50, 100], tag: ['GUT SENSORS', 'trigger the wave'] },
  { t: 15.3, fn: stomachOrgan, o: { wave: 1 }, cam: [560, 1000, .95, 560, 1060, 1.1, .02, -.02], mag: [1, 2], tag: ['MIGRATING MOTOR COMPLEX', 'strong muscle contractions'] },
  { t: 17.7, fn: peri, o: {}, cam: [540, 960, 1.0, 560, 960, 1.15, 0, .02], mag: [5, 8], tag: ['A SWEEPING WAVE', 'stomach → small intestine'] },
  { t: 21.3, fn: sweep, o: {}, cam: [540, 960, 1.0, 600, 960, 1.2, -.02, .02], mag: [20, 60], tag: ['CLEARING LEFTOVERS', 'food · mucus · bacteria'] },
  { t: 25.4, fn: stomachOrgan, o: { text: 'NO FOOD TO MUFFLE IT' }, cam: [560, 1050, 1.2, 560, 1050, 1.0, 0, .02], mag: [2, 1] },
  { t: 28.7, fn: stomachOrgan, o: { slosh: 1 }, cam: [540, 1250, 1.4, 540, 1200, 1.7, .02, -.02], mag: [2, 4], tag: ['AIR & FLUIDS SLOSH', ''] },
  { t: 31.4, fn: stomachOrgan, o: { slosh: 1, growl: 1 }, cam: [560, 1050, 1.1, 560, 1050, .92, -.02, .02], mag: [3, 1], tag: ['ECHOING LOUDLY', 'off the stomach walls'] },
  { t: 34.3, fn: stomachOrgan, o: { growl: 1, text: 'NOT BEGGING FOR FOOD' }, cam: [560, 1050, .95, 560, 1080, 1.1, .02, -.02], mag: [1, 2] },
  { t: 37.6, fn: stomachOrgan, o: { clean: 1, wave: 1, text: 'CLEANING CYCLE ✓' }, cam: [560, 1050, 1.1, 560, 1050, .95, -.02, .02], mag: [2, 1], tag: ['READY FOR YOUR', 'next meal'] },
];
SEG.forEach((s, i) => s.t1 = i + 1 < SEG.length ? SEG[i + 1].t : window.DUR);
