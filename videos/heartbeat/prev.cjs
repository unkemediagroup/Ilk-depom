const { chromium } = require('playwright'); const fs = require('fs');
(async()=>{const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => console.log('LOG', m.text()));
await pg.goto('file://' + process.cwd() + '/index.html'); await pg.evaluate(() => Promise.all([document.fonts.load('900 40px Montserrat'), document.fonts.load('800 40px Montserrat'), document.fonts.load('40px Anton')]));
fs.mkdirSync('out/prev', { recursive: true });
for (const t of process.argv.slice(2).map(Number)) { const t0 = Date.now(); const d = await pg.evaluate(t => { window.draw(t); return document.getElementById('c').toDataURL('image/jpeg', .8); }, t); fs.writeFileSync(`out/prev/p${t}.jpg`, Buffer.from(d.split(',')[1], 'base64')); console.log(t, Date.now() - t0, 'ms'); }
await br.close();
})();
