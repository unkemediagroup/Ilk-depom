// node prev.cjs 0.5 3 7.2 ...  → out/prev/p<t>.jpg (tek kare önizleme)  |  node prev.cjs strip 4 6 0.2 → kare şeridi
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => console.log('LOG', m.text()));
  await pg.goto('file://' + process.cwd() + '/index.html'); await pg.evaluate(() => Promise.all([document.fonts.load('900 40px Montserrat'), document.fonts.load('800 40px Montserrat'), document.fonts.load('40px Anton')]));
  fs.mkdirSync('out/prev', { recursive: true }); let a = process.argv.slice(2), ts;
  if (a[0] === 'strip') { const [s, e, st] = a.slice(1).map(Number); ts = []; for (let t = s; t <= e + 1e-6; t += st) ts.push(+t.toFixed(2)); } else ts = a.map(Number);
  for (const t of ts) { const d = await pg.evaluate(t => { window.draw(t); return document.getElementById('c').toDataURL('image/jpeg', .8); }, t); fs.writeFileSync(`out/prev/p${t}.jpg`, Buffer.from(d.split(',')[1], 'base64')); }
  await br.close(); console.log('ok', ts.length);
})();
