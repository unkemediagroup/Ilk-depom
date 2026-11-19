const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
(async () => { const dir = __dirname, out = process.argv[2], q = process.argv[3] || ''; const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
  const srv = http.createServer((rq, rs) => { const f = path.join(dir, decodeURIComponent(rq.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { rs.writeHead(404); rs.end(); } else { rs.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); rs.end(d); } }); }).listen(0);
  const b = await chromium.launch(), p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('http://localhost:' + srv.address().port + '/thumbs.html?' + q); await p.waitForFunction('window.READY', { timeout: 20000 });
  for (const id of ['alone']) { const d = await p.evaluate(i => document.getElementById(i).toDataURL('image/png'), id); fs.writeFileSync(path.join(out, id + '.png'), Buffer.from(d.split(',')[1], 'base64')); }
  await b.close(); srv.close(); })();
