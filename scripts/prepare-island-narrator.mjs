import fs from 'node:fs/promises';
import {voiceBankPlan} from './voice-bank-plan.mjs';
const plan=await voiceBankPlan();
for(let attempt=0;;attempt++){
 try{const r=await fetch('http://127.0.0.1:4182/api/voice-status');if((await r.json()).ready)break;}catch{}
 if(attempt>120)throw Error('Narrator service not ready');await new Promise(r=>setTimeout(r,1000));
}
const results=[];
for(const text of plan.gameNarration){
 const began=Date.now(),response=await fetch('http://127.0.0.1:4182/api/voice',{method:'POST',headers:{Origin:'http://127.0.0.1:4180','Content-Type':'application/json'},body:JSON.stringify({character:'narrator',text}),signal:AbortSignal.timeout(180000)});
 if(!response.ok)throw Error('Narrator preparation failed');
 await response.arrayBuffer();results.push({text,elapsed:Date.now()-began});
 await fs.writeFile('outputs/island-narrator-preparation.json',JSON.stringify(results,null,2));
 console.log(`${results.length}/${plan.gameNarration.length} narrator game recordings ready`);
}
console.log('DONE: every island utterance prepared as a complete narrator recording.');
