import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {voiceBankPlan} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const checkout=process.argv.find(a=>a.startsWith('--checkout='));if(!checkout)throw Error('GitHub checkout required');
const plan=await voiceBankPlan(),read=voiceBankReader(),run=promisify(execFile);
const initial=JSON.parse(await fs.readFile('outputs/voice-reference-update.json','utf8'));
let published=plan.coverage((await read()).bank).ready,lastPublish=Date.now();
for(;;){
 await new Promise(r=>setTimeout(r,30000));
 const revision=JSON.parse(await fs.readFile('outputs/voice-reference-update.json','utf8'));
 if(revision.revision!==initial.revision)throw Error('Voice references changed; restart the publisher after review.');
 const {bank,invalid}=await read(),coverage=plan.coverage(bank);
 if(invalid.length)throw Error('Invalid bank files need review.');
 const complete=coverage.ready===coverage.total;
 const periodic=coverage.ready>published&&Date.now()-lastPublish>=30*60*1000;
 if(coverage.ready-published<100&&!complete&&!periodic)continue;
 const result=await run(process.execPath,['scripts/sync-prepared-audio.mjs',checkout],{maxBuffer:1048576,timeout:1200000});
 published=coverage.ready;lastPublish=Date.now();
 await fs.writeFile('outputs/audio-publication-progress.json',JSON.stringify({publishedAt:new Date().toISOString(),coverage,complete,result:result.stdout.trim()},null,2));
 console.log(JSON.stringify({published,complete}));if(complete)break;
}
