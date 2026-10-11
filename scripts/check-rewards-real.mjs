import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage();let requests=0;
 p.on('request',r=>{if(r.url().endsWith('/api/voice'))requests++;});
 await p.goto('http://127.0.0.1:4180/');await p.waitForFunction(()=>window.CharacterVoice);
 await p.evaluate(()=>CharacterVoice.setName(''));
 for(const character of ['pofidik','dila','kipir','mina']){
  for(const text of ['Aferin!','Harikasın!','Süpersin!']){
   const elapsed=await p.evaluate(({character,text})=>new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance(text);let elapsed;u.character=character;u.onstart=()=>elapsed=performance.now()-start;u.onend=()=>resolve(elapsed);u.onerror=reject;speechSynthesis.speak(u);}),{character,text});
   assert(elapsed<1500);console.log(`${character}: ${text} ${Math.round(elapsed)} ms`);
  }
 }
 assert.equal(requests,0,'Ready rewards must not synthesize during playback');
}finally{await browser.close();}
