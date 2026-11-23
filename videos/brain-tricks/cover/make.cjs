const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => { const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
  pg.on('pageerror', e => console.log('ERR', e.message)); await pg.goto('file://' + path.join(__dirname, 'cover.html')); await pg.evaluate(() => Promise.all([document.fonts.load('40px Anton'), document.fonts.load('900 40px Montserrat')]));
  const d = await pg.evaluate(() => window.cover()); fs.writeFileSync(path.join(__dirname, 'cover-1920x1080.png'), Buffer.from(d.split(',')[1], 'base64')); await br.close(); })();
