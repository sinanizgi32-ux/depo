import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {voiceBankPlan} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const plan=await voiceBankPlan(),{bank,invalid}=await voiceBankReader()();
const entries=Object.entries(bank).flatMap(([character,rows])=>Object.keys(rows).map(text=>({character,text})));
const report={checkedAt:new Date().toISOString(),scope:'All currently prepared recordings; missing teacher phrases are audited, not presented as measured playback.',invalid,missing:plan.targets.filter(t=>!plan.covered(bank,t)),playback:[]};
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{const page=await browser.newPage();let generated=0;page.on('request',r=>{if(r.url().endsWith('/api/voice')&&!r.postDataJSON()?.background)generated++;});await page.addInitScript(()=>localStorage.setItem('dijitalOzelEgitimStateV2',JSON.stringify({avatar:'pofidik',profile:{}})));await page.goto('http://127.0.0.1:4180/');await page.waitForFunction(()=>!!window.CharacterVoice);
for(const entry of entries){const ms=await page.evaluate(({character,text})=>new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance(text);u.character=character;if(character==='narrator')u.voiceRole='narrator';u.onstart=()=>{speechSynthesis.cancel();resolve(performance.now()-start);};u.onerror=()=>reject(Error('Recording failed'));speechSynthesis.speak(u);}),entry);report.playback.push({...entry,startMs:Math.round(ms)});}
report.liveGeneration=generated;report.slow=report.playback.filter(t=>t.startMs>1000);assert.equal(generated,0);assert.equal(report.slow.length,0);assert.equal(invalid.length,0);
}finally{await browser.close();await fs.writeFile('outputs/all-ready-audio-latency.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({preparedRecordingsMeasured:report.playback.length,maxStartMs:Math.max(...report.playback.map(t=>t.startMs)),slow:report.slow.length,missingTeacherPhrases:report.missing.length,liveGeneration:report.liveGeneration}));
