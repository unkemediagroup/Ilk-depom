// node cover.cjs <dir> <out.jpg> [t]  → t verilirse sadece temiz sahne (seçim için), yoksa cover.js kapak
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => { const [dir, out, tt] = process.argv.slice(2); const D = path.resolve(dir);
  const html = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="fonts.css"><style>html,body{margin:0;background:#000}</style><canvas id="c" width="1080" height="1920"></canvas>
<script src="words.js"></script><script src="fin.js"></script><script src="whatif.js"></script><script src="main.js"></script><script src="../_tools/cover-kit.js"></script>${tt ? '' : '<script src="cover.js"></script>'}`;
  fs.writeFileSync(D + '/cover.html', html);
  const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERR', dir, e.message));
  await pg.goto('file://' + D + '/cover.html'); await pg.evaluate(() => Promise.all([document.fonts.load('900 40px Montserrat'), document.fonts.load('40px Anton')]));
  const d = await pg.evaluate(tt => { if (tt) cleanScene(+tt); else window.draw(1); return document.getElementById('c').toDataURL('image/jpeg', .93); }, tt);
  fs.writeFileSync(out, Buffer.from(d.split(',')[1], 'base64')); await br.close(); })();
