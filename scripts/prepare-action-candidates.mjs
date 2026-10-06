import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const ff='C:/Users/sinan/Documents/Codex/2026-10-05/node-scripts-serve-mjs/media-tools/node_modules/ffmpeg-static/ffmpeg.exe';
const rows=JSON.parse(await fs.readFile('source-assets/action-videos/harvest.json','utf8'));
await fs.mkdir('outputs/action-candidates',{recursive:true});
for(const r of rows){
 const id=r.id||r.page.match(/-(\d+)\//)?.[1];const cdn=r.cdn||r.media?.find(m=>m.url.includes('/'+id+'/'))?.url;
 if(!cdn){console.log('No observed video',id);continue;}
 const raw=`source-assets/action-videos/${id}.mp4`,sheet=`outputs/action-candidates/${id}.jpg`;
 if(!await fs.stat(raw).catch(()=>null)){const response=await fetch(cdn);if(!response.ok)throw Error(`${id}: ${response.status}`);await fs.writeFile(raw,Buffer.from(await response.arrayBuffer()));}
 if(!await fs.stat(sheet).catch(()=>null)){const result=spawnSync(ff,['-hide_banner','-loglevel','error','-i',raw,'-vf','fps=1/2,scale=160:-2,tile=8x2','-frames:v','1','-q:v','3',sheet],{encoding:'utf8'});if(result.status)throw Error(result.stderr);}
 console.log(id,r.action);
}
