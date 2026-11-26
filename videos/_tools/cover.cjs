// usage: node cover.cjs <videoDir> <segIdx> <secIntoSeg> <outPng> "<line1>" "<line2>"
const { chromium } = require('playwright'); const path = require('path');
const [dir, si, ss, out, l1, l2] = process.argv.slice(2);
(async () => { const br = await chromium.launch({ args: ['--no-sandbox'] }); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERR', e.message));
  await pg.goto('file://' + path.resolve(dir) + '/index.html'); await pg.evaluate(() => Promise.all([document.fonts.load('900 40px Montserrat'), document.fonts.load('800 40px Montserrat'), document.fonts.load('40px Anton')]));
  const d = await pg.evaluate(([si, ss, l1, l2]) => {
    const cv = document.getElementById('c'), sg = SEG[+si]; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1080, 1920);
    drawSeg(sg, sg.t + (+ss), 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const g = ctx.createLinearGradient(0, 1150, 0, 1920); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.35, 'rgba(0,0,0,.72)'); g.addColorStop(1, 'rgba(0,0,0,.92)'); ctx.fillStyle = g; ctx.fillRect(0, 1150, 1080, 770);
    const T = (str, y, size, fill, stroke, sw, rot) => { ctx.font = `400 ${size}px Anton`; const w = ctx.measureText(str).width; if (w > 990) size = size * 990 / w; ctx.save(); ctx.translate(540, y); ctx.rotate(rot); ctx.font = `400 ${size}px Anton`; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = sw; ctx.strokeStyle = stroke; ctx.strokeText(str, 0, 0); ctx.fillStyle = fill; ctx.fillText(str, 0, 0); ctx.restore(); };
    T(l1.toUpperCase(), 1520, 120, '#fff', '#000', 20, -.03); T(l2.toUpperCase(), 1710, 170, '#ffd23f', '#8c0e18', 28, -.03);
    ctx.fillStyle = 'rgba(8,4,6,.78)'; ctx.beginPath(); ctx.roundRect(40, 70, 330, 84, 42); ctx.fill(); ctx.font = '400 54px Anton'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('BODY HACKS', 205, 132);
    return cv.toDataURL('image/png');
  }, [si, ss, l1, l2]);
  require('fs').writeFileSync(out, Buffer.from(d.split(',')[1], 'base64')); await br.close(); })();
