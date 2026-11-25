import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const FPS=30, B=60/128;
const SC=[['s1',0,4],['s2',4,7],['s3',7,15],['s4',15,19],['s6',19,32]];
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/scena-storie.html'); await p.evaluate(()=>window.ready);
for (const [nome,b0,b1] of SC) {
  const f0=Math.round(b0*B*FPS), f1=Math.round(b1*B*FPS);
  const tmp=`storie-${nome}.tmp.mp4`;
  const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-c:v','mjpeg','-framerate',String(FPS),'-i','-',
    '-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p','-r',String(FPS),tmp],{stdio:['pipe','inherit','inherit']});
  for (let f=f0; f<f1; f++) {
    await p.evaluate(t=>window.draw(t), f/FPS);
    const buf = await p.screenshot({type:'jpeg', quality:92});
    if (!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
  }
  ff.stdin.end();
  const code = await new Promise(r=>ff.on('close',r));
  if (code!==0) throw new Error('ffmpeg '+nome+' '+code);
  fs.renameSync(tmp, `storie-${nome}.mp4`); console.log(nome, f1-f0, 'fotogrammi');
}
await b.close();
