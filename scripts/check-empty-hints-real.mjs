import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const selected=process.argv.find(a=>a.startsWith('--character='))?.slice(12);
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const reports=[];
try{await Promise.all((selected?[selected]:['pofidik','dila','kipir','mina']).map(async character=>{
 for(const wrong of [false,true]){
  const p=await browser.newPage();let live=0;
  await p.addInitScript(character=>localStorage.setItem('dijitalOzelEgitimStateV2',JSON.stringify({avatar:character,profile:{name:''}})),character);
  await p.route('**/api/voice',r=>{if(!JSON.parse(r.request().postData()).background)live++;return r.abort();});
  await p.goto('http://127.0.0.1:4180/opposite-teaching.html?concept=empty&mode=match&method=wait');
  await p.waitForFunction(()=>!!window.CharacterVoice);
  await p.evaluate(()=>{window.voiceEvents=[];const original=speechSynthesis.speak;speechSynthesis.speak=u=>{const entry={text:u.text,requested:performance.now()};voiceEvents.push(entry);const start=u.onstart,end=u.onend,error=u.onerror;u.onstart=e=>{entry.delay=performance.now()-entry.requested;start?.(e);};u.onend=e=>{entry.ended=true;end?.(e);};u.onerror=e=>{entry.error=true;error?.(e);};original(u);};});
  await p.locator('[data-level="1"]').click();
  await p.waitForFunction(()=>voiceEvents[0]?.ended,{},{timeout:10000});
  if(wrong){await p.locator('#source').click();await p.locator('#targets button:not([data-color="empty"])').first().click();}
  await p.waitForFunction(()=>voiceEvents.some(e=>e.text.includes('Alttaki nesne boş.')&&e.ended),{},{timeout:25000});
  const event=await p.evaluate(()=>voiceEvents.find(e=>e.text.includes('Alttaki nesne boş.')));
  assert(event.text.includes('Üstte işaretlenen nesne de boş. Kabın içinde bir şey yok. Şimdi boş olanı eşle.'));
  assert(event.delay<1000,JSON.stringify(event));assert(!event.error);assert.equal(live,0,'Hint must not generate on demand');
  reports.push({character,wrong,startMs:Math.round(event.delay),complete:true});await p.close();
 }
}));}finally{await browser.close();await fs.writeFile('outputs/empty-hints-real.json',JSON.stringify(reports,null,2));}
console.log(JSON.stringify(reports));
