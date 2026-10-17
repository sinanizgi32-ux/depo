import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const root=new URL('../dist/',import.meta.url),bank=JSON.parse(fs.readFileSync(new URL('assets/character-voices/ready/manifest.json',root)));
const file=Object.values(bank).flatMap(entries=>Object.values(entries))[0];
const fixture=Object.fromEntries(['pofidik','kipir','dila','mina'].map(key=>[key,{'Aferin!':file,'Harikasın!':file,'Selam! Ben Pofidik Ayı. Beni seçmek ister misin?':file}]));
const wav=fs.readFileSync(new URL(file.replace(/^\.\//,''),root));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage();let generated=[];
 await p.route('**/assets/character-voices/ready/quality.json',r=>r.fulfill({json:{}}));
 await p.route('**/assets/character-voices/ready/manifest.json',route=>route.fulfill({json:fixture}));
 await p.route('**/api/voice-status',route=>route.fulfill({json:{ready:true}}));
 await p.route('**/api/voice',route=>{generated.push(JSON.parse(route.request().postData()));return new Promise(resolve=>setTimeout(()=>route.fulfill({body:wav,contentType:'audio/wav'}).catch(()=>{}).finally(resolve),5000));});
 await p.goto('http://127.0.0.1:4180/');await p.waitForFunction(()=>window.CharacterVoice);
 await p.evaluate(()=>{speechSynthesis.cancel();CharacterVoice.setName('');});
 for(const character of ['pofidik','kipir','dila','mina']){
  const outcome=await p.evaluate(async character=>{const start=performance.now();const ok=await CharacterVoice.prepareLesson(['Aferin!',...Array.from({length:105},(_,n)=>`Henüz hazır olmayan test kaydı ${n}.`)],character);return{ok,elapsed:performance.now()-start};},character);
  assert(outcome.ok);assert(outcome.elapsed<1500,'Missing audio must not block lesson opening');
  assert.equal(await p.locator('#lessonAudioPreparation').count(),0);
  const delay=await p.evaluate(async character=>new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance('Aferin!');u.character=character;u.onstart=()=>{const elapsed=performance.now()-start;speechSynthesis.cancel();resolve(elapsed);};u.onerror=()=>reject(Error('Playback failed'));speechSynthesis.speak(u);}),character);
  assert(delay<1500,'Ready audio still plays immediately');
 }
 assert(generated.every(x=>x.background===true),'Preparation only generates in the background');
 assert(await p.evaluate(()=>CharacterVoice.prepareLesson(['Aferin!'],null)));
 assert.equal(await p.evaluate(()=>CharacterVoice.prepareLesson(['Aferin!'],undefined,()=>false)),false);
 const requestsBefore=generated.length;
 const composedDelay=await p.evaluate(()=>new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance('Aferin! Harikasın!');u.character='pofidik';u.onstart=()=>{speechSynthesis.cancel();resolve(performance.now()-start);};u.onerror=()=>reject(Error('Composed playback failed'));speechSynthesis.speak(u);}));
 assert(composedDelay<1500);assert.equal(generated.length,requestsBefore,'Ready sentence composition must not call the model');
 const greeting=Object.keys(fixture.pofidik).find(text=>text.startsWith('Selam! Ben '));assert(greeting);
 const greetingDelay=await p.evaluate(text=>{CharacterVoice.setName('Yeni test adı');return new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance(text);u.character='pofidik';u.onstart=()=>{speechSynthesis.cancel();resolve(performance.now()-start);};u.onerror=()=>reject(Error('Greeting failed'));speechSynthesis.speak(u);});},greeting);
 assert(greetingDelay<1500,'Unprepared child name must not delay a ready greeting');
 await p.evaluate(()=>CharacterVoice.setName(''));
 const beforePartial=generated.length;
 await p.evaluate(()=>new Promise((resolve,reject)=>{const u=new SpeechSynthesisUtterance('Hayır, bu özel deney değil. Aferin!');u.character='pofidik';u.onstart=()=>{speechSynthesis.cancel();resolve();};u.onerror=()=>reject(Error('Partial reuse failed'));speechSynthesis.speak(u);}));
 const partialRequests=generated.slice(beforePartial).filter(job=>job.background!==true);
 assert.equal(partialRequests.length,1);assert.equal(partialRequests[0].text,'Hayır, bu özel deney değil.','Generate only the new correction, not the ready reward');
 const beforeMultiple=generated.length;
 const partialStart=await p.evaluate(()=>new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance('Aferin! Birinci yeni sınama. İkinci yeni sınama.');u.character='pofidik';u.onstart=()=>{speechSynthesis.cancel();resolve(performance.now()-start);};u.onerror=()=>reject(Error('Multiple missing units failed'));speechSynthesis.speak(u);}));
 assert(partialStart<1500,'Ready first sentence must start without waiting five seconds for later missing sentences');
 const multipleRequests=generated.slice(beforeMultiple).filter(job=>job.background!==true);
 assert.deepEqual(multipleRequests.map(job=>job.text).sort(),['Birinci yeni sınama.','İkinci yeni sınama.'].sort(),'Multiple missing units must reuse the ready prefix and never regenerate the complete hint');
 const beforeCase=generated.length;
 await p.evaluate(()=>new Promise((resolve,reject)=>{const u=new SpeechSynthesisUtterance('AFERİN! HARİKASIN!');u.character='pofidik';u.onstart=()=>{speechSynthesis.cancel();resolve();};u.onerror=()=>reject(Error('Case-insensitive composition failed'));speechSynthesis.speak(u);}));
 assert.equal(generated.slice(beforeCase).filter(job=>job.background!==true).length,0);
 console.log('OK: four voices, 105 missing clips per block do not block opening; ready playback stays fast; no preparation overlay; invalidated lesson does not start.');
}finally{await browser.close();}
