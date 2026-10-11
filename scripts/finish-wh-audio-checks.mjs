import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),root=new URL('../',import.meta.url);
// Wait for the finite preparation job, then verify the actual published files.
for(;;){let progress;try{progress=JSON.parse(await fs.readFile(new URL('outputs/wh-audio-preparation.json',root),'utf8'));}catch{}
 if(progress?.rows?.length===4&&progress.rows.every(row=>row.missingUnits===0))break;
 await new Promise(resolve=>setTimeout(resolve,10000));
}
const checks=[];
async function check(args){const {stdout}=await run(process.execPath,args,{cwd:new URL('..',import.meta.url),timeout:600000,maxBuffer:1024*1024});checks.push({name:args[0],args,result:stdout.trim()});console.log(stdout.trim());}
await check(['scripts/audit-wh-audio.mjs','--require-complete']);
await check(['scripts/check-wh-teaching.mjs','C:/Users/sinan/Documents/Codex/2026-10-05/node-scripts-serve-mjs/media-tools/node_modules/jsdom/lib/api.js']);
for(const character of ['pofidik','dila','kipir','mina'])await check(['scripts/check-wh-audio-real.mjs','--all-stories','--voice='+character]);
await fs.writeFile(new URL('outputs/wh-audio-completion.json',root),JSON.stringify({complete:true,time:new Date().toISOString(),checks},null,2));
console.log('DONE: all 50 stories in all four voices passed audio readiness and actual browser start-latency checks.');
