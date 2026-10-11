import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{for(const character of ['pofidik','dila','kipir','mina']){
 const page=await browser.newPage();
 await page.addInitScript(character=>localStorage.setItem('dijitalOzelEgitimStateV2',JSON.stringify({avatar:character,profile:{name:''}})),character);
 await page.goto('http://127.0.0.1:4180/');
 await page.waitForFunction(()=>!!window.CharacterVoice);
 for(const text of ['Islak olanı eşle.','Islak olanı göster.','Gösterilen karta dokun.','Hayır, bu kartın yeri farklı. Gösterilen karta dokun.']){
  const result=await page.evaluate(async({character,text})=>{
   await CharacterVoice.prepareCue(text,character);
   return await new Promise((resolve,reject)=>{
    const u=new SpeechSynthesisUtterance(text),start=performance.now();let ms;
    u.character=character;
    u.onstart=()=>ms=performance.now()-start;
    u.onend=()=>resolve({ms});u.onerror=e=>reject(new Error(e.error));speechSynthesis.speak(u);
   });
  },{character,text});
  assert(result.ms<1500,`${character}: ${text} delayed ${result.ms}`);
  console.log(`${character}: ${text} ${Math.round(result.ms)} ms`);
 }
 await page.close();
}}finally{await browser.close();}
