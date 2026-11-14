// node render.cjs [işçi=4] → out/frames/f%05d.jpg (30 fps, 1080x1920), paralel Chromium sekmeleri
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const HERE = process.cwd(), N = +(process.argv[2] || 4), FPS = 30;
fs.mkdirSync(path.join(HERE, 'out/frames'), { recursive: true });
(async () => {
  const br = await chromium.launch({ args: ['--no-sandbox'] });
  const open = async () => { const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } }); pg.on('pageerror', e => console.log('ERR', e.message));
    await pg.goto('file://' + HERE + '/index.html'); await pg.evaluate(() => Promise.all([document.fonts.load('900 40px Montserrat'), document.fonts.load('800 40px Montserrat'), document.fonts.load('40px Anton')])); return pg; };
  const first = await open(); const DUR = await first.evaluate(() => window.DUR); const total = Math.ceil(DUR * FPS);
  const pages = [first, ...await Promise.all(Array.from({ length: N - 1 }, open))]; let next = 0, done = 0;
  await Promise.all(pages.map(async pg => { while (next < total) { const i = next++;
    const d = await pg.evaluate(f => { window.draw(f / 30); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, i);
    fs.writeFileSync(path.join(HERE, 'out/frames', 'f' + String(i).padStart(5, '0') + '.jpg'), Buffer.from(d.split(',')[1], 'base64'));
    if (++done % 150 === 0) console.log(done + '/' + total); } }));
  await br.close(); console.log('frames', total);
})();
