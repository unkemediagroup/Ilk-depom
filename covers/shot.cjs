// node shot.cjs <name>  → <name>.png (1080x1920) — <name>.js çizim dosyası
const { chromium } = require('playwright'); const fs = require('fs'); const n = process.argv[2];
(async () => { const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERR', e.message));
  fs.writeFileSync(__dirname + '/_c.html', `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="fonts.css"><style>body{margin:0;background:#000}</style><canvas id="c" width="1080" height="1920"></canvas><script>const WORDS=[];</script><script src="fin.js"></script><script src="${n}.js"></script>`);
  await pg.goto('file://' + __dirname + '/_c.html'); await pg.evaluate(() => Promise.all([document.fonts.load('900 40px Montserrat'), document.fonts.load('800 40px Montserrat'), document.fonts.load('40px Anton')]));
  const d = await pg.evaluate(() => { window.drawCover(); return document.getElementById('c').toDataURL('image/png'); }); fs.writeFileSync(__dirname + '/' + n + '.png', Buffer.from(d.split(',')[1], 'base64')); await br.close(); console.log('ok', n); })();
