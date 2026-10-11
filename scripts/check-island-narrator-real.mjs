import assert from 'node:assert/strict';
import {voiceBankPlan} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const plan=await voiceBankPlan(),{bank}=await voiceBankReader()();for(const text of plan.gameNarration)assert(plan.recording(bank,'narrator',text),'Missing whole game recording: '+text);
const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await b.newPage({viewport:{width:900,height:700},reducedMotion:'reduce'}),audio=[];
 p.on('request',r=>{if(r.url().includes('/ready/narrator-'))audio.push(r.url());});
 await p.goto('http://127.0.0.1:4180/pofidik-island.html');
 await p.waitForFunction(()=>!document.getElementById('start').disabled,null,{timeout:90000});
 await p.evaluate(()=>{window.cues=[];const speak=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{const start=performance.now(),onstart=u.onstart;u.onstart=e=>{cues.push({role:u.voiceRole,text:u.text,elapsed:performance.now()-start});onstart?.(e);};return speak(u);};});
 await p.locator('#start').click();
 await p.waitForFunction(()=>cues.length===5,null,{timeout:180000});
 const cue=await p.evaluate(()=>cues[0]);assert.equal(cue.role,'narrator');assert(cue.text.startsWith('Pofidik gemisinde'));assert(cue.elapsed<1500);assert(audio.length>0);
 const all=await p.evaluate(()=>cues);for(const c of all){assert.equal(c.role,'narrator');assert(c.elapsed<1500,JSON.stringify(c));}console.log(`OK: all five actual island scenes, including scene three, begin ready narrator playback in ${all.map(c=>Math.round(c.elapsed)).join('/')} ms.`);
 const modelRequests=[];p.on('request',r=>{if(r.url().endsWith('/api/voice'))modelRequests.push(r.url());});const times=[];
 for(const text of plan.gameNarration){const ms=await p.evaluate(text=>new Promise((resolve,reject)=>{const began=performance.now(),u=new SpeechSynthesisUtterance(text);u.voiceRole='narrator';u.onstart=()=>{const ms=performance.now()-began;speechSynthesis.cancel();resolve(ms);};u.onerror=reject;speechSynthesis.speak(u);}),text);assert(ms<1500);times.push(ms);}
 assert.equal(modelRequests.length,0);console.log(`OK: all ${times.length} game narration, puzzle, hint and reward recordings start in ${Math.round(Math.max(...times))} ms or less; zero live model requests.`);
}finally{await b.close();}
