import {mkdir,writeFile,readFile,access} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const [playwrightPath,edgePath,ffmpegPath]=process.argv.slice(2);
if(!ffmpegPath)throw Error('Playwright, browser and FFmpeg paths are required.');
const {chromium}=await import(playwrightPath);
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const context={window:{}};vm.runInNewContext(await readFile(new URL('../dist/wh-data.js',import.meta.url),'utf8'),context);
const stories=context.window.WhData.stories;
await mkdir(root+'/assets/5n1k/videos',{recursive:true});await mkdir(root+'/assets/5n1k/posters',{recursive:true});
const browser=await chromium.launch({executablePath:edgePath,headless:true});
const page=await browser.newPage({viewport:{width:960,height:540}});
await page.goto('http://127.0.0.1:4180/wh-render.html');
const fps=30,manifest=[];
for(const story of stories){
 await page.evaluate(async story=>{window.film=story;window.background=new Image();background.src=`assets/5n1k/backgrounds/${story.place}.webp`;await background.decode();},story);
 const output=root+'/'+story.video,poster=root+'/'+story.poster;
 const child=spawn(ffmpegPath,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',output],{stdio:['pipe','ignore','pipe'],windowsHide:true});
 let stderr='';child.stderr.on('data',b=>stderr+=b);const exit=once(child,'close');child.stdin.on('error',()=>{});
 const frames=Math.round(story.duration*fps);
 for(let start=0;start<frames;start+=30){
  const batch=await page.evaluate(({start,end,fps})=>{const data=[];for(let f=start;f<end;f++){WhScene.draw(document.querySelector('canvas'),film,f/fps,background);data.push(document.querySelector('canvas').toDataURL('image/jpeg',.92).split(',')[1]);}return data;},{start,end:Math.min(start+30,frames),fps});
  for(const data of batch)if(!child.stdin.write(Buffer.from(data,'base64')))await once(child.stdin,'drain');
 }
 child.stdin.end();const [code]=await exit;if(code!==0)throw Error(stderr);
 const image=await page.evaluate(()=>{WhScene.draw(document.querySelector('canvas'),film,Math.min(4,film.duration/2),background);return document.querySelector('canvas').toDataURL('image/webp',.92).split(',')[1];});await writeFile(poster,Buffer.from(image,'base64'));
 manifest.push({id:story.id,path:story.video,duration:story.duration,fps,frames,width:960,height:540});
 console.log(`${story.id}: ${story.duration}s · ${frames} kare`);
}
await browser.close();await writeFile(root+'/assets/5n1k/video-manifest.json',JSON.stringify(manifest,null,2));
