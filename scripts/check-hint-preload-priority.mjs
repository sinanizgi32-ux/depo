import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const root=new URL('../dist/',import.meta.url),bank=JSON.parse(fs.readFileSync(new URL('assets/character-voices/ready/manifest.json',root)));
const file=Object.values(bank).flatMap(Object.values)[0],wav=fs.readFileSync(new URL(file.replace(/^\.\//,''),root));
const units=['Alttaki nesne boş.','Üstte işaretlenen nesne de boş.','Kabın içinde bir şey yok.','Şimdi boş olanı eşle.'];
const fixture={pofidik:Object.fromEntries(units.map(text=>[text,file]))};
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage();let modelFinished=false,modelStarted=false;
 await p.route('**/assets/character-voices/ready/manifest.json',r=>r.fulfill({json:fixture}));
 await p.route('**/*.wav',r=>r.fulfill({body:wav,contentType:'audio/wav'}));
 await p.route('**/api/voice-status',r=>r.fulfill({json:{ready:true}}));
 await p.route('**/api/voice',async r=>{modelStarted=true;await new Promise(resolve=>setTimeout(resolve,5000));modelFinished=true;await r.fulfill({status:503}).catch(()=>{});});
 await p.goto('http://127.0.0.1:4180/');await p.waitForFunction(()=>window.CharacterVoice);
 await p.evaluate(units=>{speechSynthesis.cancel();CharacterVoice.setName('');void CharacterVoice.preload(['Bu eksik bir ses kaydı.',units.join(' '),'Eksik ön cümle. '+units.join(' ')],'pofidik');},units);
 await p.waitForFunction(units=>units.every(t=>CharacterVoice.cached('pofidik',t)),units,{timeout:1500});
 assert.equal(modelFinished,false,'Ready hints must download before waiting for missing generation');
 await p.waitForTimeout(100);assert(modelStarted);
 const delay=await p.evaluate(text=>new Promise((resolve,reject)=>{const start=performance.now(),u=new SpeechSynthesisUtterance(text);u.character='pofidik';u.onstart=()=>{speechSynthesis.cancel();resolve(performance.now()-start);};u.onerror=()=>reject(Error('Hint did not play'));speechSynthesis.speak(u);}),units.join(' '));
 assert(delay<1000);console.log('OK: complete and partial ready hints are cached before slow missing phrases; ready hint starts in '+Math.round(delay)+'ms.');
}finally{await browser.close();}
