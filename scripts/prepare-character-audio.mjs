import fs from 'node:fs/promises';
import vm from 'node:vm';
import {voiceBankPlan} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const root=new URL('../',import.meta.url),folder=new URL('dist/assets/character-voices/ready/',root);
const plan=await voiceBankPlan(root);await fs.mkdir(folder,{recursive:true});
const catalog=new URL('static-phrases.json',folder),temporary=new URL(`static-phrases.${process.pid}.tmp`,folder);
await fs.writeFile(temporary,JSON.stringify(plan.allowed));await fs.rename(temporary,catalog);
if(process.argv.includes('--catalog-only')){console.log('Sabit öğretmen metni ve cümle kataloğu hazır.');process.exit(0);}
// Only one producer may use the model. A crashed producer's lock is recoverable.
await fs.mkdir(new URL('outputs/',root),{recursive:true});
const lockFile=new URL('outputs/voice-preparation.lock',root);let lock;
for(let attempt=0;attempt<2;attempt++){
 try{lock=await fs.open(lockFile,'wx');await lock.writeFile(String(process.pid));break;}catch(error){
  if(error.code!=='EEXIST')throw error;
  const pid=Number(await fs.readFile(lockFile,'utf8'));let alive=true;try{process.kill(pid,0);}catch(e){if(e.code==='ESRCH')alive=false;}
  if(alive){console.log('Ses hazırlığı zaten çalışıyor.');process.exit(0);}await fs.unlink(lockFile);
 }
}
if(!lock)throw Error('Ses hazırlığı kilidi alınamadı.');
const progressFile=new URL('progress.json',folder),readBank=voiceBankReader(root);
async function manifest(){return(await readBank()).bank;}
async function progress(m){const tmp=new URL('progress.tmp',folder);await fs.writeFile(tmp,JSON.stringify({...plan.coverage(m),updatedAt:new Date().toISOString()}));await fs.rename(tmp,progressFile);}
try{
 let bank=await manifest();await progress(bank);
 while(true){try{if((await(await fetch('http://127.0.0.1:4182/api/voice-status',{signal:AbortSignal.timeout(1500)})).json()).ready)break;}catch{}await new Promise(resolve=>setTimeout(resolve,1000));}
 const requested=process.argv.find(arg=>arg.startsWith('--items='))?.slice(8).split(',');
 const selected=requested?new Set(plan.items.filter(item=>requested.includes(item.id)).flatMap(item=>[`${item.accusative} eşle.`,`${item.accusative} göster.`])):null;
 const jobs=plan.production(bank,selected);
 const priorityConcepts=process.argv.find(arg=>arg.startsWith('--priority-concepts='))?.slice(20).split(',');
 if(priorityConcepts){const priorityUnits=new Set();for(const id of priorityConcepts){const c={window:{NamingRules:{safeText:value=>value||''}},URLSearchParams,location:{search:'?concept='+id},Math};vm.runInNewContext(await fs.readFile(new URL('dist/lesson-audio-plan.js',root),'utf8'),c);vm.runInNewContext(await fs.readFile(new URL('dist/opposite-teaching-data.js',root),'utf8'),c);const D=c.window.OppositeTeachingData,P=c.window.LessonAudioPlan;for(const mode of ['match','show','name'])for(let level=1;level<=D.stages[mode].length;level++)for(const block of D.course(mode,level))for(const text of P.concept('opposite',D,mode,block.trials,D.stages[mode][level-1]).filter(t=>!P.rewards.includes(t)))for(const unit of plan.units(text))priorityUnits.add(unit);}jobs.sort((a,b)=>Number(priorityUnits.has(b.text))-Number(priorityUnits.has(a.text)));}
 const priorityItems=process.argv.find(arg=>arg.startsWith('--priority-items='))?.slice(17).split(',');
 if(priorityItems){const c={window:{}};vm.runInNewContext(await fs.readFile(new URL('dist/lesson-audio-plan.js',root),'utf8'),c);const trials=plan.items.filter(item=>priorityItems.includes(item.id)).map(item=>({item}));const P=c.window.LessonAudioPlan;const phrases=[...P.object(trials,'match'),...P.object(trials,'show')].filter(text=>!P.rewards.includes(text));const priorityUnits=new Set(phrases.flatMap(plan.units));jobs.sort((a,b)=>Number(priorityUnits.has(b.text))-Number(priorityUnits.has(a.text)));}
 console.log(`${jobs.length} eksik cümle kaydı hazırlanacak; ${plan.coverage(bank).ready}/${plan.targets.length} konuşma hazır.`);
 let count=0;
 for(const {character,text}of jobs){
  bank=await manifest();if(plan.recording(bank,character,text))continue;
  while(true){try{
   const response=await fetch('http://127.0.0.1:4182/api/voice',{method:'POST',headers:{Origin:'http://127.0.0.1:4180','Content-Type':'application/json'},body:JSON.stringify({character,text,background:true})});
   if(!response.ok)throw Error('Ses hizmeti yanıtı '+response.status);
   await response.arrayBuffer();bank=await manifest();
   if(!plan.recording(bank,character,text))throw Error('Sabit ses bankaya kaydedilemedi.');
   // Python publishes the WAV. Never truncate an already playable file here.
   break;
  }catch{await new Promise(resolve=>setTimeout(resolve,1500));}}
  await progress(bank);if(++count%10===0){const c=plan.coverage(bank);console.log(`${c.ready}/${c.total} konuşma hazır · ${count}/${jobs.length} yeni kayıt.`);}
 }
 bank=(await voiceBankReader(root)()).bank;await progress(bank);const c=plan.coverage(bank);
 if(!selected&&c.ready!==c.total)throw Error(`Hazırlık eksik: ${c.ready}/${c.total}`);
 if(!selected){const updateFile=new URL('outputs/voice-reference-update.json',root);try{const update=JSON.parse(await fs.readFile(updateFile,'utf8'));update.status='complete';update.completedAt=new Date().toISOString();await fs.writeFile(updateFile,JSON.stringify(update,null,2));}catch{}}
 console.log(selected?'Seçilen nesne kayıtları hazır.':'Bütün sabit öğretmen konuşmaları dört karakterde hazır.');
}finally{await lock.close();await fs.unlink(lockFile).catch(()=>{});}
