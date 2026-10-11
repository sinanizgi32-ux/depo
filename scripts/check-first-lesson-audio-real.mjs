import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{for(const id of ['fish','toothpaste']){
 const p=await b.newPage({viewport:{width:390,height:900}});
 p.on('pageerror',e=>console.log('PAGE ERROR',e.message));p.on('request',r=>{if(r.url().endsWith('/api/voice'))console.log('İlk hazırlıkta eksik ses kaydı üretiliyor.');});await p.goto('http://127.0.0.1:4180/');await p.locator('#guardianEntry').click();await p.locator('#parentPin').fill('123456');await p.locator('#parentPinConfirm').fill('123456');await p.locator('#pinSubmit').click();await p.waitForFunction(()=>ParentGate.role()==='guardian');await p.evaluate(()=>AppEntry.platform());
 await p.locator('[data-category="cognitive"]').click();await p.locator('[data-skill-folder="objects"]').click();await p.locator('[data-open-matching]').click();
 const category=await p.evaluate(id=>ObjectMatchingData.categories.find(c=>c.items.some(i=>i.id===id)).id,id);
 await p.locator(`[data-match-category="${category}"]`).click();await p.locator(`[data-match-item="${id}"]`).click();
 await p.evaluate(()=>{window.cues=[];const original=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{const start=performance.now(),onstart=u.onstart;u.onstart=e=>{cues.push({text:u.text,ms:performance.now()-start});onstart?.(e);};return original(u);};});
 await p.locator('[data-match-stage="1"]').click();try{await p.waitForFunction(()=>cues.length>0,null,{timeout:600000});}catch(e){console.log(await p.evaluate(()=>({dialog:document.getElementById('lessonAudioPreparation')?.textContent,feedback:document.getElementById('feedback').textContent,key:CharacterVoice.key()})));throw e;}const cue=await p.evaluate(()=>cues[0]);assert.equal(cue.text,id==='fish'?'Balığı eşle.':'Diş macununu eşle.');assert(cue.ms<1500);
 await p.waitForFunction(()=>!document.getElementById('objectSource').disabled);
 const source=await p.locator('#objectSource').boundingBox(),target=await p.locator(`.object-target[data-object="${id}"]`).boundingBox();
 await p.mouse.move(source.x+source.width/2,source.y+source.height/2);await p.mouse.down();await p.mouse.move(target.x+target.width/2,target.y+target.height/2,{steps:12});await p.mouse.up();
 await p.waitForFunction(()=>document.getElementById('trialLabel').textContent==='2 / 5',{timeout:10000});
 console.log(id+': gerçek ilk basamak yönergesi '+Math.round(cue.ms)+' ms; sürükleme, pekiştirme ve ikinci deneme geçti.');await p.close();
}}finally{await b.close();}
