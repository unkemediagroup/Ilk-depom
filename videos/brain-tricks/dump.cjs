const { chromium } = require('playwright');
(async()=>{const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.log('ERR', e.message));
await pg.goto('file://' + process.cwd() + '/index.html');
const r = await pg.evaluate(() => SHOTS.map(s => [s.t.toFixed(1), (s.t1 - s.t).toFixed(1), s.key || (s.card ? 'CARD' + s.o.c.n : 'hook')]));
console.log(r.length); console.log(r.map(x => x.join(' ')).join(' | ')); await br.close();})();
