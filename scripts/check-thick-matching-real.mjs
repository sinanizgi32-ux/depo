import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{for(const character of ['pofidik','dila','kipir','mina']){
 const p=await browser.newPage({viewport:{width:390,height:900}});
 await p.addInitScript(character=>localStorage.setItem('dijitalOzelEgitimStateV2',JSON.stringify({avatar:character,profile:{name:''}})),character);
 await p.goto('http://127.0.0.1:4180/opposite-teaching.html?mode=match&concept=thick&method=wait');
 await p.evaluate(()=>{window.realCues=[];const original=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{const start=performance.now(),onstart=u.onstart;u.onstart=e=>{realCues.push({text:u.text,ms:Math.round(performance.now()-start)});onstart?.(e);};return original(u);};});
 await p.locator('[data-level="1"]').click();await p.waitForFunction(()=>realCues.length>0,null,{timeout:30000});
 const first=await p.evaluate(()=>realCues[0]);assert.equal(first.text,'Kalın olanı eşle.');assert(first.ms<1500,character+' cue was not immediate');
 await p.waitForFunction(()=>!document.getElementById('source').disabled);
 const source=await p.locator('#source').boundingBox(),target=await p.locator('#targets [data-color="thick"]').boundingBox();assert(source&&target);
 await p.mouse.move(source.x+source.width/2,source.y+source.height/2);await p.mouse.down();await p.mouse.move(target.x+target.width/2,target.y+target.height/2,{steps:12});await p.mouse.up();
 await p.waitForFunction(()=>document.getElementById('counter').textContent.includes('2 / 5'),null,{timeout:15000});
 console.log(`${character}: Kalın eşleme ${first.ms} ms; 390px sürükleme, pekiştirme ve ikinci deneme geçti.`);await p.close();
}}finally{await browser.close();}
