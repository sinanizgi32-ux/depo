import fs from 'node:fs/promises';
import vm from 'node:vm';
import {voiceBankPlan,voices} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const character=process.argv.find(x=>x.startsWith('--voice='))?.slice(8)||'narrator';
const levels=(process.argv.find(x=>x.startsWith('--levels='))?.slice(9)||'1,2,3,4,5,6,7,8,9,10').split(',').map(Number);
if((!voices[character]&&character!=='narrator')||levels.some(level=>!Number.isInteger(level)||level<1||level>10))throw Error('Invalid opening selection');
const ctx={window:{}};vm.runInNewContext(await fs.readFile('dist/wh-data.js','utf8'),ctx);
const plan=await voiceBankPlan(),read=voiceBankReader();
for(const level of levels){const story=ctx.window.WhData.stories.find(s=>s.id===ctx.window.WhData.levels[level-1].stories[0]);
 for(const text of plan.units(story.narration)){const {bank}=await read();if(plan.recording(bank,character,text))continue;
  const r=await fetch('http://127.0.0.1:4182/api/voice',{method:'POST',headers:{Origin:'http://127.0.0.1:4180','Content-Type':'application/json'},body:JSON.stringify({character,text}),signal:AbortSignal.timeout(180000)});if(!r.ok)throw Error('Opening preparation failed');await r.arrayBuffer();console.log(`${character} level ${level} opening sentence prepared`);
 }
 const {bank}=await read();if(!plan.covered(bank,{character,text:story.narration}))throw Error('Opening missing');console.log(`READY: ${character} level ${level} opening`);
}
