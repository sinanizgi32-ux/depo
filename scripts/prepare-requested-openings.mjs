import fs from 'node:fs/promises';
import {voiceBankPlan,voices} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const plan=await voiceBankPlan(),read=voiceBankReader();
const common=['Sıraya bakalım. Boş kutuya hangisi gelmeli? Doğru olanı seç.','Resimlere bak. Önce olanı, sonra olanı sırala. Önce olan karta dokun.'];
const rows=[];
for(const [character,name]of Object.entries(voices)){
 const introduction=`Merhaba! Ben ${name}. Bundan sonra senin oyun arkadaşınım. Oyunlar oynarken hep yanında olacağım ve ihtiyacın olduğunda sana yardım edeceğim. Hazırsan başlayalım!`;
 for(const text of [...new Set([...plan.units(introduction),...common.flatMap(plan.units)])]){
  let {bank}=await read();if(plan.recording(bank,character,text))continue;
  for(;;){try{
   const response=await fetch('http://127.0.0.1:4182/api/voice',{method:'POST',headers:{Origin:'http://127.0.0.1:4180','Content-Type':'application/json'},body:JSON.stringify({character,text}),signal:AbortSignal.timeout(240000)});
   if(!response.ok)throw Error('Voice generation failed');await response.arrayBuffer();
   bank=(await read()).bank;if(!plan.recording(bank,character,text))throw Error('Recording not saved');break;
  }catch(e){console.log('Retry '+character+' '+text);await new Promise(r=>setTimeout(r,1500));}}
  rows.push({character,text});await fs.writeFile('outputs/requested-opening-progress.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows.at(-1)));
 }
 const finalBank=(await read()).bank;for(const text of [introduction,...common])if(!plan.covered(finalBank,{character,text}))throw Error('Opening incomplete');
}
await fs.writeFile('outputs/requested-openings-complete.json',JSON.stringify({complete:true,finishedAt:new Date().toISOString()}));console.log('REQUESTED OPENINGS READY');
