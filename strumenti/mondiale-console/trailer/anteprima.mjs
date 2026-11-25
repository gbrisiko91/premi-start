import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/scena.html'); await p.evaluate(()=>window.ready);
const B=60/128;
for (const tb of process.argv.slice(2).map(Number)) { await p.evaluate(t=>window.draw(t), tb*B); await p.waitForTimeout(60);
  await p.screenshot({path:`kf-${tb}.jpg`, type:'jpeg', quality:80}); }
await b.close();
