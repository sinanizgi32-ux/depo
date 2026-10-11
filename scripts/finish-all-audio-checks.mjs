import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),initial=JSON.parse(await fs.readFile('outputs/voice-reference-update.json','utf8'));
for(;;){const update=JSON.parse(await fs.readFile('outputs/voice-reference-update.json','utf8'));if(update.revision!==initial.revision)throw Error('Voice references changed; this audit no longer applies');if(update.status==='complete')break;await new Promise(resolve=>setTimeout(resolve,30000));}
const checks=[];
for(const args of [['scripts/audit-character-audio.mjs','--require-complete'],['scripts/audit-wh-audio.mjs','--require-complete'],['scripts/check-all-ready-audio-real.mjs']]){const result=await run(process.execPath,args,{timeout:1800000,maxBuffer:1048576});checks.push({args,output:result.stdout.trim()});console.log(result.stdout.trim());}
await fs.writeFile('outputs/full-audio-completion.json',JSON.stringify({complete:true,revision:initial.revision,verifiedAt:new Date().toISOString(),checks},null,2));console.log('All finite teacher speech is prepared and its actual playback latency passed.');
