const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => { const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1280, height: 1920 } });
  pg.on('pageerror', e => console.log('ERR', e.message));
  await pg.goto('file://' + path.join(__dirname, 'cover2.html')); await pg.evaluate(() => Promise.all([document.fonts.load('40px Anton'), document.fonts.load('900 40px Montserrat')]));
  for (const [w, h, n] of [[1080, 1920, 'cover-shorts-1080x1920.png'], [1280, 720, 'cover-youtube-1280x720.png']]) { const d = await pg.evaluate(([w, h]) => window.cover(w, h), [w, h]); fs.writeFileSync(path.join(__dirname, n), Buffer.from(d.split(',')[1], 'base64')); console.log(n); }
  await br.close(); })();
