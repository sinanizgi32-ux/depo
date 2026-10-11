import fs from 'node:fs/promises';
import {voiceBankPlan,voices} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const plan=await voiceBankPlan(),{bank,invalid}=await voiceBankReader()();
const matching=plan.targets.filter(t=>/\beşle[.!?]$/u.test(t.text)||/eşle[.!?]$/.test(t.text));
const report={checkedAt:new Date().toISOString(),invalidFiles:invalid.length,voices:Object.keys(voices).map(character=>{
 const targets=matching.filter(t=>t.character===character),cues=targets.filter(t=>plan.units(t.text).length===1),hints=targets.filter(t=>plan.units(t.text).length>1);
 return{character,cues:{ready:cues.filter(t=>plan.covered(bank,t)).length,total:cues.length,missing:cues.filter(t=>!plan.covered(bank,t)).map(t=>t.text)},hints:{ready:hints.filter(t=>plan.covered(bank,t)).length,total:hints.length}};
})};
await fs.mkdir('outputs',{recursive:true});await fs.writeFile('outputs/matching-audio-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
