import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const played=[],generated=[];let endings=0;
const ctx={AbortController,AbortSignal,URL,Date,Promise,Map,Set,Math,Error,setTimeout,clearTimeout,
 location:{href:'http://127.0.0.1:4180/'},parent:null,
 localStorage:{getItem:()=>null},document:{currentScript:null,getElementById:()=>null},addEventListener:()=>{},
 speechSynthesis:{cancel:()=>{},speak:()=>{}},
 Audio:class{constructor(src){this.src=src;}play(){played.push(this.src);this.onplaying?.();this.timer=setTimeout(()=>this.onended?.(),5);return Promise.resolve();}pause(){clearTimeout(this.timer);}removeAttribute(){}load(){}},
 fetch:async(url,opts={})=>{
  if(String(url).includes('manifest.json'))return {ok:true,json:async()=>({pofidik:{'Aferin!':'./reward.wav'}})};
  if(String(url).includes('greeting-parts'))return {ok:true,json:async()=>({})};
  if(String(url).includes('voice-status'))return {ok:true,json:async()=>({ready:true})};
  const {text}=JSON.parse(opts.body);generated.push(text);
  await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,text.includes('Birinci')?100:50);opts.signal?.addEventListener('abort',()=>{clearTimeout(timer);reject(Error('aborted'));},{once:true});});
  return {ok:true,blob:async()=>text};
 }
};
ctx.URL=class extends URL{static createObjectURL(text){return 'blob:'+text;}static revokeObjectURL(){}};
ctx.window=ctx;ctx.parent=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('../dist/voice-text.js',import.meta.url),'utf8'),ctx);
vm.runInContext(fs.readFileSync(new URL('../dist/character-voice.js',import.meta.url),'utf8'),ctx);
let startDelay;
const started=Date.now();
await new Promise((resolve,reject)=>ctx.speechSynthesis.speak({text:'Aferin! Birinci yeni ipucu. İkinci yeni ipucu.',onstart:()=>startDelay=Date.now()-started,onend:()=>{endings++;resolve();},onerror:reject}));
assert(startDelay<50,'Ready prefix awaited later synthesis');
assert.deepEqual(played,['http://127.0.0.1:4180/reward.wav','blob:Birinci yeni ipucu.','blob:İkinci yeni ipucu.']);
assert.equal(endings,1);
assert.equal(generated.length,2);
played.length=0;
await new Promise(resolve=>ctx.speechSynthesis.speak({text:'Aferin! Birinci iptal ipucu.',onstart:()=>{ctx.speechSynthesis.cancel();resolve();},onend:()=>endings++}));
await new Promise(resolve=>setTimeout(resolve,130));
assert.deepEqual(played,['http://127.0.0.1:4180/reward.wav']);assert.equal(endings,1);
console.log('OK: ready hint prefix starts immediately; missing sentences play in original order; end waits for last sentence; cancel suppresses later playback/end.');
