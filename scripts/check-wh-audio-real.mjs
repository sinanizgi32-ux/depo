import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {voiceBankPlan} from './voice-bank-plan.mjs';
import {voiceBankReader} from './voice-bank-files.mjs';
const ctx={window:{}};for(const file of ['wh-data.js','lesson-audio-plan.js'])vm.runInNewContext(await fs.readFile('dist/'+file,'utf8'),ctx);
const character=process.argv.find(x=>x.startsWith('--voice='))?.slice(8)||'pofidik';
const all=process.argv.includes('--all-stories');const texts=[...new Set((all?ctx.window.WhData.stories:[ctx.window.WhData.stories[0]]).flatMap(s=>ctx.window.LessonAudioPlan.wh(s)))];
const narrations=new Set(ctx.window.WhData.stories.map(s=>s.narration));
const plan=await voiceBankPlan(),{bank}=await voiceBankReader()();
assert(texts.every(text=>plan.covered(bank,{character:narrations.has(text)?'narrator':character,text})),'Every requested story recording must be ready before testing');
const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{const p=await b.newPage(),modelRequests=[];p.on('request',r=>{if(r.url().endsWith('/api/voice'))modelRequests.push(r.url());});
 await p.addInitScript(character=>localStorage.setItem('dijitalOzelEgitimStateV2',JSON.stringify({avatar:character,profile:{}})),character);
 await p.goto('http://127.0.0.1:4180/wh-teaching.html?method=wait');await p.waitForFunction(()=>!!CharacterVoice);
 const results=[];for(const text of texts){const elapsed=await p.evaluate(({text,role})=>new Promise((resolve,reject)=>{const began=performance.now(),u=new SpeechSynthesisUtterance(text);u.voiceRole=role;u.onstart=()=>{const elapsed=performance.now()-began;speechSynthesis.cancel();resolve(elapsed);};u.onerror=()=>reject(Error('Audio failed'));speechSynthesis.speak(u);}),{text,role:narrations.has(text)?'narrator':'companion'});assert(elapsed<1500,`${text}: ${elapsed}`);results.push(elapsed);}
 assert.equal(modelRequests.length,0,'Ready 5N1K speech must not synthesize during playback');console.log(`OK: ${texts.length} ${all?'all-story':'first-story'} narration/question/correction variants play in ${Math.round(Math.max(...results))} ms or less; zero live synthesis requests; companion ${character}.`);
}finally{await b.close();}
