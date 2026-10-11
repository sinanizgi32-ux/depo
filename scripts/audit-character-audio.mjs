import fs from 'node:fs/promises';
import {voiceBankPlan,voices} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const plan=await voiceBankPlan(),{bank,invalid}=await voiceBankReader()(),coverage=plan.coverage(bank);
const missing=plan.targets.filter(target=>!plan.covered(bank,target));
const report={...coverage,complete:coverage.ready===coverage.total&&invalid.length===0,invalidFiles:invalid.length,voices:Object.keys(voices).map(character=>({character,ready:plan.targets.filter(t=>t.character===character&&plan.covered(bank,t)).length,total:plan.targets.filter(t=>t.character===character).length,missingPrimary:plan.targets.filter(t=>t.character===character&&plan.primary.has(t.text)&&!plan.covered(bank,t)).length})),missing};
await fs.mkdir('outputs',{recursive:true});await fs.writeFile('outputs/voice-bank-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...coverage,invalidFiles:invalid.length,complete:report.complete,voices:report.voices}));
if(process.argv.includes('--require-complete')&&!report.complete)process.exitCode=1;
