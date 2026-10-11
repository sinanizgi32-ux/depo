import fs from 'node:fs/promises';
import {voiceBankPlan,voices} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const plan=await voiceBankPlan(),{bank,invalid}=await voiceBankReader()();
const report={checkedAt:new Date().toISOString(),invalidFiles:invalid.length,voices:Object.keys(voices).map(character=>{
 const targets=plan.targets.filter(t=>t.character===character&&plan.units(t.text).length>1);
 const missing=targets.filter(t=>!plan.covered(bank,t));
 return {character,total:targets.length,ready:targets.length-missing.length,firstSentenceReady:targets.filter(t=>plan.recording(bank,character,plan.units(t.text)[0])).length,missing:missing.map(t=>({text:t.text,missingUnits:plan.units(t.text).filter(unit=>!plan.recording(bank,character,unit))}))};
})};
await fs.mkdir('outputs',{recursive:true});
await fs.writeFile('outputs/hint-audio-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,voices:report.voices.map(({missing,...v})=>({...v,missing:missing.length}))}));
