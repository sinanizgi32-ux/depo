import fs from 'node:fs/promises';
import {voiceBankPlan,voices} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const plan=await voiceBankPlan(),{bank,invalid}=await voiceBankReader()();
const missing=plan.targets.filter(target=>!plan.covered(bank,target));
const report={checkedAt:new Date().toISOString(),audioReady:missing.length===0&&invalid.length===0,coverage:plan.coverage(bank),invalidFiles:invalid.length,missingByVoice:Object.fromEntries([...Object.keys(voices),'narrator'].map(key=>[key,missing.filter(t=>t.character===key).length])),missing};
await fs.writeFile('outputs/release-audio-readiness.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({audioReady:report.audioReady,coverage:report.coverage,invalidFiles:report.invalidFiles,missingByVoice:report.missingByVoice}));
if(!report.audioReady&&!process.argv.includes('--allow-incomplete')){console.error('Release blocked: finite instruction/hint audio must be fully prepared before packaging.');process.exitCode=1;}
