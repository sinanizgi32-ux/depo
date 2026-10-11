import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage(),jobs=[];let statusCalls=0;
 await p.addInitScript(()=>{const NativeAudio=window.Audio;window.voicePreviewPlays=0;window.Audio=class extends NativeAudio{play(){window.voicePreviewPlays++;return super.play();}};});
 await p.route('**/api/voice-status',async r=>{statusCalls++;await new Promise(resolve=>setTimeout(resolve,120));await r.fulfill({json:{ready:true}});});
 await p.route('**/api/voice',r=>{jobs.push(JSON.parse(r.request().postData()));return r.fulfill({status:503});});
 await p.goto('http://127.0.0.1:4180/');await p.waitForFunction(()=>window.CharacterVoice?.prepareCue);
 await p.evaluate(()=>CharacterVoice.setName(''));
 const statuses=await p.evaluate(()=>Promise.all(Array.from({length:8},()=>CharacterVoice.available())));
 assert(statuses.every(Boolean),'Simultaneous requests must await the shared status instead of seeing stale unavailable state');assert.equal(statusCalls,1);
 const playsBefore=await p.evaluate(()=>window.voicePreviewPlays);
 const before=jobs.length;
 assert.equal(await p.evaluate(()=>CharacterVoice.prepareCue('Yeni öncelik sınaması eşle.','dila')),false);
 const job=jobs.slice(before).find(j=>j.text==='Yeni öncelik sınaması eşle.');
 assert(job);assert.equal(job.character,'dila');assert.equal(job.background,false,'Selected cue must pass ahead of bulk background preparation');
 const count=jobs.length;
 await p.evaluate(()=>CharacterVoice.prepareCue('Yeni öncelik sınaması eşle.','dila'));
 assert(jobs.length>count,'Failed preparation must be retried, not permanently memoized');
 await p.route('**/api/voice',r=>{jobs.push(JSON.parse(r.request().postData()));return new Promise(resolve=>setTimeout(()=>r.fulfill({status:503}).catch(()=>{}).finally(resolve),1000));});
 const canceled=await p.evaluate(async()=>{const old=CharacterVoice.prepareCue('Eski seçim sınaması eşle.','pofidik');await new Promise(r=>setTimeout(r,100));const next=CharacterVoice.prepareCue('Yeni seçim sınaması eşle.','mina');const start=performance.now();const oldResult=await old;await next;return{oldResult,elapsed:performance.now()-start};});
 assert.equal(canceled.oldResult,false);assert(canceled.elapsed<2500);
 const obsolete=await p.evaluate(async()=>{const pending=CharacterVoice.preload(['Eski blok ilk sınama.','Eski blok ikinci sınama.'],'pofidik');await new Promise(r=>setTimeout(r,150));const start=performance.now();CharacterVoice.cancelPreparation();await pending;return performance.now()-start;});
 assert(obsolete<500,'Leaving an activity must promptly abort its background generation');assert(!jobs.some(j=>j.text==='Eski blok ikinci sınama.'),'Obsolete lesson must not continue producing later sentences');
 assert.equal(await p.evaluate(()=>window.voicePreviewPlays),playsBefore,'Picker preparation must remain silent');
 console.log('OK: selected cue uses foreground priority, failed cues retry, stale selection is canceled, no audio plays in picker.');
}finally{await browser.close();}
