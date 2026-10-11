import fs from 'node:fs/promises';
import vm from 'node:vm';
import {voiceBankPlan,voices} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const root=new URL('../',import.meta.url),ctx={window:{}};
for(const file of ['wh-data.js','lesson-audio-plan.js'])vm.runInNewContext(await fs.readFile(new URL('dist/'+file,root),'utf8'),ctx);
const plan=await voiceBankPlan(root),read=voiceBankReader(root);
const preferred=process.argv.find(x=>x.startsWith('--voice='))?.slice(8)||'pofidik';
const characters=[preferred,...Object.keys(voices).filter(k=>k!==preferred)];
if(!voices[preferred])throw Error('Unknown companion');
const stories=ctx.window.WhData.stories;
const texts=[...new Set(stories.flatMap(s=>ctx.window.LessonAudioPlan.wh(s).filter(text=>text!==s.narration)))];
const units=[...new Set(texts.flatMap(plan.units))];
const jobs=[
 // Prepare selected companion narration before less urgent isolated answer clips.
 ...[...stories.filter(s=>ctx.window.WhData.levels.some(level=>level.stories[0]===s.id)),...stories].flatMap(story=>plan.units(story.narration).map(text=>({character:'narrator',text}))),
 ...stories.flatMap(story=>characters.flatMap(character=>[...new Set(ctx.window.LessonAudioPlan.wh(story).filter(text=>text!==story.narration).flatMap(plan.units))].map(text=>({character,text}))))
];
const seen=new Set();let completed=0;
async function audit(){const {bank,invalid}=await read();const rows=characters.map(character=>({character,total:texts.length,ready:texts.filter(text=>plan.covered(bank,{character,text})).length,missingUnits:units.filter(text=>!plan.recording(bank,character,text)).length+ [...new Set(stories.flatMap(story=>plan.units(story.narration)))].filter(text=>!plan.recording(bank,'narrator',text)).length}));await fs.writeFile(new URL('outputs/wh-audio-preparation.json',root),JSON.stringify({updated:new Date().toISOString(),rows,invalid:invalid.length},null,2));return rows;}
await audit();
for(const {character,text}of jobs){const id=character+'|'+text;if(seen.has(id))continue;seen.add(id);const {bank}=await read();if(plan.recording(bank,character,text))continue;
 for(let attempt=0;;attempt++){try{const r=await fetch('http://127.0.0.1:4182/api/voice',{method:'POST',headers:{Origin:'http://127.0.0.1:4180','Content-Type':'application/json'},body:JSON.stringify({character,text,background:true}),signal:AbortSignal.timeout(180000)});if(!r.ok)throw Error('Voice preparation failed');await r.arrayBuffer();const {bank}=await read();if(!plan.recording(bank,character,text))throw Error('Recording missing');break;}catch(error){if(attempt%10===9)console.log('Preparation waits for the local voice service; completed recordings are retained.');await new Promise(r=>setTimeout(r,2000));}}
 completed++;if(completed%5===0){console.log(JSON.stringify(await audit()));}
}
const result=await audit();if(result.some(r=>r.missingUnits))throw Error('Incomplete 5N1K bank');console.log('DONE: all 5N1K narration, questions and correction units are ready in all four companion voices.');

if(process.argv.includes('--resume-general'))await import('./prepare-character-audio.mjs');
