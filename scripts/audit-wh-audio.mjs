import fs from 'node:fs/promises';
import vm from 'node:vm';
import {voiceBankPlan,voices} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const root=new URL('../',import.meta.url),ctx={window:{}};
for(const file of ['wh-data.js','lesson-audio-plan.js'])vm.runInNewContext(await fs.readFile(new URL('dist/'+file,root),'utf8'),ctx);
const plan=await voiceBankPlan(root),{bank,invalid}=await voiceBankReader(root)();
const rows=Object.keys(voices).flatMap(character=>ctx.window.WhData.stories.map(story=>{
 const texts=ctx.window.LessonAudioPlan.wh(story),missing=texts.filter(text=>!plan.covered(bank,{character:text===story.narration?'narrator':character,text}));
 return{character,story:story.id,level:story.level,narrationReady:plan.covered(bank,{character:'narrator',text:story.narration}),questions:story.questions.map(q=>({type:q.type,questionReady:plan.covered(bank,{character,text:q.text}),hintReady:plan.covered(bank,{character,text:q.evidence+' Şimdi sen söyle.'}),choiceHintReady:plan.covered(bank,{character,text:q.evidence+' Şimdi seç.'})})),total:texts.length,ready:texts.length-missing.length,missing};
}));
const report={time:new Date().toISOString(),invalid,complete:rows.every(row=>row.missing.length===0),rows};
await fs.writeFile(new URL('outputs/wh-audio-audit.json',root),JSON.stringify(report,null,2));
for(const character of Object.keys(voices)){const own=rows.filter(row=>row.character===character);console.log(JSON.stringify({character,completeStories:own.filter(row=>!row.missing.length).length,narrationsReady:own.filter(row=>row.narrationReady).length,questionsReady:own.flatMap(row=>row.questions).filter(q=>q.questionReady).length,hintsReady:own.flatMap(row=>row.questions).filter(q=>q.hintReady&&q.choiceHintReady).length}));}
if(process.argv.includes('--require-complete')&&!report.complete)process.exitCode=1;
