import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const root=new URL('../dist/',import.meta.url),bank=JSON.parse(fs.readFileSync(new URL('assets/character-voices/ready/manifest.json',root)));
const file=Object.values(bank).flatMap(Object.values)[0],wav=fs.readFileSync(new URL(file.replace(/^\.\//,''),root));
const texts=['Kurşun kalemi göster.','Bu kurşun kalem. Gösterilen resme dokun. Kurşun kalemi göster.','Hayır, o değil. Bu kurşun kalem. Gösterilen resme dokun. Kurşun kalemi göster.'];
// A real playable WAV is used as a fixture; this verifies transport/cache behavior, not bank completeness.
const fixture={pofidik:Object.fromEntries(texts.map(text=>[text,file]))};
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage();let blocked=false,lateDownloads=0,generation=0;
 await p.route('**/assets/character-voices/ready/manifest.json',r=>r.fulfill({json:fixture}));
 await p.route('**/*.wav',r=>{if(blocked){lateDownloads++;return r.abort();}return r.fulfill({body:wav,contentType:'audio/wav'});});
 await p.route('**/api/voice',r=>{generation++;return r.fulfill({status:503});});
 await p.goto('http://127.0.0.1:4180/');await p.waitForFunction(()=>window.CharacterVoice);
 await p.evaluate(async texts=>{speechSynthesis.cancel();CharacterVoice.setName('');for(const text of texts)await CharacterVoice.prepareCue(text,'pofidik');},texts);
 blocked=true;
 for(const text of texts){
  const result=await p.evaluate(text=>new Promise((resolve,reject)=>{const started=performance.now(),u=new SpeechSynthesisUtterance(text);u.character='pofidik';let delay;u.onstart=()=>{delay=performance.now()-started;};u.onend=()=>resolve({delay});u.onerror=()=>reject(Error('Cached hint failed'));speechSynthesis.speak(u);}),text);
  assert(result.delay<1000,JSON.stringify(result));
 }
 assert.equal(lateDownloads,0,'Prepared hints must use downloaded audio');assert.equal(generation,0,'Prepared hints must not synthesize');
 console.log('OK: directive and wrong/no-response hints finish from memory with WAV downloads and synthesis unavailable.');
}finally{await browser.close();}
