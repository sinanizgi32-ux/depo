import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('scripts/pofidik-island-source.js','utf8'),snippet=source.slice(source.indexOf('function speak('),source.indexOf('function tone('));
const buttons=new Map(),spoken=[];
const ctx={phase:'intro',sound:true,generation:1,caption:()=>{},$:id=>{if(!buttons.has(id))buttons.set(id,{});return buttons.get(id);},SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{cancel:()=>{},speak:u=>spoken.push(u)}};
vm.createContext(ctx);vm.runInContext(snippet,ctx);
for(const phase of ['intro','puzzle','reward','finish']){ctx.phase=phase;let ended=false;ctx.speak('Deneme.',()=>ended=true);const u=spoken.at(-1);assert.equal(u.voiceRole,'narrator');u.onerror();assert.equal(ended,false);assert.equal(buttons.get('voice-retry').hidden,false);buttons.get('voice-retry').onclick();spoken.at(-1).onend();assert.equal(ended,true);}
let ended=false;ctx.speak('Eski deneme.',()=>ended=true);const stale=spoken.at(-1);ctx.generation++;stale.onend();assert.equal(ended,false);
assert(source.includes("prepareLesson(texts,'narrator',"));
console.log('OK: all game phases use narrator; audio errors do not advance story; retry restores speech; stale callbacks ignored; preparation uses narrator.');
