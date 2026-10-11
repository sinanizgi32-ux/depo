import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const page=await browser.newPage(),audio=[];
 page.on('request',r=>{if(r.url().includes('/ready/narrator-'))audio.push(r.url());});
 await page.goto('http://127.0.0.1:4180/');await page.waitForFunction(()=>!!window.NarratorVoice);
 await page.evaluate(()=>{CharacterVoice.setName('');CharacterVoice.set('dila');});
 const text='Merhaba! Birlikte yeni bir maceraya başlıyoruz.';
 await page.evaluate(text=>CharacterVoice.prepareCue(text,'narrator'),text);
 const outcome=await page.evaluate(text=>new Promise((resolve,reject)=>{const u=new SpeechSynthesisUtterance(text),start=performance.now();let elapsed;u.voiceRole='narrator';u.onstart=()=>elapsed=performance.now()-start;u.onend=()=>resolve({elapsed,key:CharacterVoice.key()});u.onerror=reject;speechSynthesis.speak(u);}),text);
 assert.equal(outcome.key,'dila');assert(outcome.elapsed<1500);assert(audio.length>0,'Narrator WAV was not used');
 console.log(`OK: narrator reference clone played in ${Math.round(outcome.elapsed)} ms; selected companion remains Dila.`);
}finally{await browser.close();}
