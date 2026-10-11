import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage();await p.goto('http://127.0.0.1:4180/');await p.waitForFunction(()=>window.CharacterVoice?.prepareCue);await p.evaluate(()=>CharacterVoice.setName(''));
 for(const character of ['pofidik','dila','kipir','mina']){
  const preparation=await p.evaluate(async character=>{const start=performance.now();const ok=await CharacterVoice.prepareCue('Soğuk olanı eşle.',character);return{ok,ms:Math.round(performance.now()-start)};},character);
  assert(preparation.ok,'Real cue preparation failed: '+character);
  const latency=await p.evaluate(character=>new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance('Soğuk olanı eşle.');u.character=character;u.onstart=()=>{speechSynthesis.cancel();resolve(Math.round(performance.now()-start));};u.onerror=()=>reject(Error('Real recording failed'));speechSynthesis.speak(u);}),character);
  assert(latency<1500,'Prepared matching cue should play immediately');console.log(`${character}: ilk hazırlık ${preparation.ms} ms; hazır eşleme yönergesi ${latency} ms.`);
 }
}finally{await browser.close();}
