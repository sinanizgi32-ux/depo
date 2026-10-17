import fs from 'node:fs';import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const bank=JSON.parse(fs.readFileSync('dist/assets/character-voices/ready/manifest.json','utf8')),wav=fs.readFileSync('dist/'+Object.values(bank).flatMap(entries=>Object.values(entries))[0].replace(/^\.\//,''));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage(),requests=[];
 await p.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;window.rewardAudio=[];HTMLMediaElement.prototype.play=function(){window.rewardAudio.push(this.src);return play.call(this);};});
 await p.route('**/assets/character-voices/ready/quality.json',r=>r.fulfill({json:{}}));
 await p.route('**/assets/character-voices/ready/manifest.json',r=>r.fulfill({json:{pofidik:{'Aferin!':'./assets/character-voices/ready/named-test-fixture.wav'}}}));
 await p.route('**/named-test-fixture.wav',r=>r.fulfill({body:wav,contentType:'audio/wav'}));
 await p.route('**/api/voice-status',r=>r.fulfill({json:{ready:true}}));
 await p.route('**/api/voice',r=>{requests.push(JSON.parse(r.request().postData()));return r.fulfill({body:wav,contentType:'audio/wav'});});
 await p.goto('http://127.0.0.1:4180/');await p.waitForFunction(()=>CharacterVoice?.prepareRewards);
 await p.evaluate(()=>{CharacterVoice.set('pofidik');CharacterVoice.setName('Deniz');});
 await p.waitForFunction(()=>['Deniz aferin!','Aferin Deniz!','Deniz harikasın!','Harikasın Deniz!','Deniz süpersin!','Süpersin Deniz!'].every(t=>CharacterVoice.cached('pofidik',t)));
 const count=requests.length,heard=[];
 for(let n=0;n<12;n++)heard.push(await p.evaluate(()=>new Promise((resolve,reject)=>{window.rewardAudio=[];const start=performance.now(),u=new SpeechSynthesisUtterance('Aferin!');u.onstart=()=>{const sources=[...rewardAudio],named=['Deniz aferin!','Aferin Deniz!','Deniz harikasın!','Harikasın Deniz!','Deniz süpersin!','Süpersin Deniz!'].find(t=>CharacterVoice.cached('pofidik',t)===sources[0]);speechSynthesis.cancel();resolve({ms:performance.now()-start,sources:sources.length,named});};u.onerror=()=>reject(Error('Reward failed'));speechSynthesis.speak(u);})));
 assert(heard.every(x=>x.ms<1500&&x.sources===1),'Reward/name must play as one ready utterance without a second clip or synthesis wait');
 assert(heard.some(x=>x.named?.startsWith('Deniz ')));assert(heard.some(x=>x.named?.endsWith(' Deniz!')));assert.equal(requests.length,count);
 await p.route('**/api/voice',r=>new Promise(resolve=>setTimeout(()=>r.fulfill({body:wav,contentType:'audio/wav'}).catch(()=>{}).finally(resolve),5000)));
 await p.evaluate(()=>CharacterVoice.setName('Henüz hazırlanmayan isim'));
 for(let n=0;n<4;n++){const ms=await p.evaluate(()=>new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance('Aferin!');u.onstart=()=>{speechSynthesis.cancel();resolve(performance.now()-start);};u.onerror=()=>reject(Error('Ready reward failed'));speechSynthesis.speak(u);}));assert(ms<1500,'An unprepared named reward must not delay ordinary reinforcement');}
 await p.evaluate(()=>CharacterVoice.setName(''));
 console.log('OK: named reinforcement uses one coherent cached utterance, alternates name before/after, and never waits for an unprepared name.');
}finally{await browser.close();}
