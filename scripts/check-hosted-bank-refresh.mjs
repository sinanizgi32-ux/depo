import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/sinan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const bank=JSON.parse(await fs.readFile('dist/assets/character-voices/ready/manifest.json','utf8'));
const wav=await fs.readFile('dist/'+Object.values(bank.dila)[0].replace('./',''));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage();let revision=0,loopback=0;
 p.on('request',r=>{if(r.url().includes('127.0.0.1'))loopback++;});
 await p.route('https://lesson-test.invalid/**',async r=>{
  const path=new URL(r.request().url()).pathname;
  if(path==='/')return r.fulfill({contentType:'text/html',body:'<meta charset="utf-8"><button>Başla</button><script src="/voice-text.js"></script><script data-audio-bank="https://bank-test.invalid/site/assets/character-voices/ready/" src="/character-voice.js"></script>'});
  return r.fulfill({contentType:'text/javascript; charset=utf-8',body:await fs.readFile('dist'+path)});
 });
 await p.route('https://bank-test.invalid/**',r=>{
  const name=new URL(r.request().url()).pathname.split('/').at(-1),headers={'access-control-allow-origin':'*'};
  if(name==='manifest.json')return r.fulfill({headers,json:revision?{pofidik:{'Aferin!':'./assets/character-voices/ready/rejected.wav','Harikasın!':'./assets/character-voices/ready/approved.wav'}}:{}});
  if(name==='quality.json')return r.fulfill({headers,json:{pofidik:['Harikasın!']}});
  if(name==='greeting-parts.json')return r.fulfill({headers,json:{}});
  assert(name==='approved.wav','Rejected reward must never be played: '+name);return r.fulfill({headers,body:wav,contentType:'audio/wav'});
 });
 await p.goto('https://lesson-test.invalid/');await p.getByRole('button').click();await p.evaluate(()=>CharacterVoice.prepareLesson(['Aferin!']));
 assert.equal(await p.evaluate(()=>CharacterVoice.ready('Harikasın!')),false);
 revision=1;await p.waitForTimeout(3100);
 await p.evaluate(()=>CharacterVoice.prepareLesson(['Aferin! Harikasın!']));
 const outcome=await p.evaluate(()=>new Promise(resolve=>{const u=new SpeechSynthesisUtterance('Aferin! Harikasın!');u.onend=()=>resolve(true);u.onerror=()=>resolve(false);speechSynthesis.speak(u);}));
 assert(outcome);assert.equal(loopback,0);
 console.log('OK: hosted bank updates without app republish; relative remote audio URLs resolve correctly; rejected rewards use approved same-character audio; no visitor loopback requests.');
}finally{await browser.close();}
