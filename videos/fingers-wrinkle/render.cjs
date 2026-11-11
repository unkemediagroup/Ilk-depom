// usage: node render.mjs <start> <end> ; writes out/frames/f%05d.jpg (30 fps, 1080x1920)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const HERE = __dirname; const [a, b] = process.argv.slice(2).map(Number);
fs.mkdirSync(path.join(HERE, 'out/frames'), { recursive: true });
(async()=>{const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto('file://' + HERE + '/index.html'); await pg.evaluate(() => document.fonts.ready); await pg.evaluate(() => Promise.all([document.fonts.load('900 40px Montserrat'), document.fonts.load('800 40px Montserrat'), document.fonts.load('40px Anton')]));
for (let i = a; i < b; i++) {
  const d = await pg.evaluate(f => { window.draw(f / 30); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, i);
  fs.writeFileSync(path.join(HERE, 'out/frames', 'f' + String(i).padStart(5, '0') + '.jpg'), Buffer.from(d.split(',')[1], 'base64'));
}
await br.close();
})();
