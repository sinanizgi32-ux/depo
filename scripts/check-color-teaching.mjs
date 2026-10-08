import fs from 'node:fs';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {JSDOM}=await import(process.argv[2]?pathToFileURL(process.argv[2]).href:'jsdom');
const files=['naming-rules.js','color-teaching-data.js','color-teaching.js'];
function harness(mode,method='wait'){
 const dom=new JSDOM(fs.readFileSync('dist/color-teaching.html','utf8'),{url:`http://127.0.0.1:4180/color-teaching.html?mode=${mode}&method=${method}`,runScripts:'outside-only'}),w=dom.window;
 let now=0,id=0,recognition;const tasks=new Map(),speech=[];
 w.setTimeout=(fn,delay)=>{tasks.set(++id,{at:now+delay,fn});return id;};w.clearTimeout=i=>tasks.delete(i);
 w.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};w.speechSynthesis={speak:u=>speech.push(u),cancel:()=>speech.splice(0),getVoices:()=>[]};
 Object.defineProperty(w.HTMLImageElement.prototype,'complete',{get:()=>true});Object.defineProperty(w.HTMLImageElement.prototype,'naturalWidth',{get:()=>250});w.HTMLImageElement.prototype.decode=()=>Promise.resolve();
 w.LocalMicrophone={ensure:async()=>({})};w.fetch=async()=>({ok:true,json:async()=>({ready:true})});w.LocalSpeechRecognition=class{constructor(){recognition=this;}start(){this.onstart?.();}abort(){}};
 for(const file of files)w.eval(fs.readFileSync(`dist/${file}`,'utf8'));
 const h={w,dom,tasks,speech,get recognition(){return recognition;},say(){const u=speech.shift();assert(u,'expected speech');u.onend?.();return u.text;},tick(ms){const until=now+ms;while(true){const due=[...tasks].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;now=due[1].at;tasks.delete(due[0]);due[1].fn();}now=until;},async flush(){for(let i=0;i<25;i++)await Promise.resolve();},async start(level){w.document.querySelector(`[data-level="${level}"]`).click();await h.flush();},color(){const cue=w.document.getElementById('instruction').textContent;return mode==='name'?w.document.querySelector(`${w.document.getElementById('scene').hidden?'#targets':'#scene'} .focus`).dataset.color:w.ColorTeachingData.colors.find(c=>cue.startsWith(c.cue)).id;},answer(){if(mode==='name'){h.recognition.onresult({resultIndex:0,results:[Object.assign([{transcript:w.ColorTeachingData.color(h.color()).name}],{isFinal:true})]});}else{if(mode==='match')w.document.getElementById('source').click();w.document.querySelector(`${w.document.getElementById('scene').hidden?'#targets':'#scene'} button[data-color="${h.color()}"]`).click();}},async finishTrial(){h.say();if(method==='immediate')h.say();h.answer();h.say();h.tick(800);await h.flush();}};
 return h;
}
const data=harness('match').w.ColorTeachingData;let trialCount=0;
for(const mode of ['match','show','name'])for(let level=1;level<=data.stages[mode].length;level++)for(let repeat=0;repeat<12;repeat++){
 const stage=data.stages[mode][level-1],course=data.course(mode,level);assert.equal(course.length,stage.objectBlocks?(stage.mixed?4:16):stage.mixed?(stage.blocks||4):4);
 for(const block of course){assert.equal(block.trials.length,5);for(const t of block.trials){trialCount++;assert.equal(t.options.length,stage.count);assert.equal(t.options.filter(o=>o.color===t.color).length,1);assert.equal(t.correct.color,t.source.color);assert.equal(t.options[t.slot],t.correct);for(const x of [t.source,...t.options]){if(x.src)assert(fs.existsSync('dist/'+x.src.slice(2)),x.src);}if(t.room)assert(fs.existsSync('dist/'+t.room.src.slice(2)));if(mode==='match'&&stage.kind==='object')assert.notEqual(t.source.object,t.correct.object);if(stage.varied&&mode==='match'&&stage.kind==='card')assert.notEqual(t.source.type,t.correct.type);if(mode==='name'&&stage.kind==='sock')assert.equal(new Set(block.trials.map(x=>x.source.src)).size,5);}
  if(!stage.mixed){assert.equal(block.trials[0].slot,block.trials[1].slot);assert.equal(block.trials[2].slot,block.trials[3].slot);if(stage.count>1){assert.notEqual(block.trials[1].slot,block.trials[2].slot);assert.notEqual(block.trials[3].slot,block.trials[4].slot);}}
 }
 if(stage.mixed){const colors=course.flatMap(b=>b.trials.map(t=>t.color));for(let i=1;i<colors.length;i++)assert.notEqual(colors[i-1],colors[i]);if(colors.length===20)for(const c of data.colors)assert.equal(colors.filter(x=>x===c.id).length,5);}
}
for(const mode of ['match','show'])for(const method of ['wait','immediate']){
 const h=harness(mode,method);await h.start(2);assert.equal(h.tasks.size,0,'no response timer during instruction');h.say();if(method==='wait'){h.tick(3999);assert.equal(h.speech.length,0);h.tick(1);assert.equal(h.speech.length,1);}assert.match(h.say(),/kırmızı/);h.answer();h.say();h.tick(800);await h.flush();assert.match(h.w.document.getElementById('counter').textContent,/Deneme 2/);h.dom.window.close();
}
for(const mode of ['match','show']){
 const h=harness(mode);await h.start(3);h.say();const wrong=h.w.document.querySelector('#targets button:not([data-color="red"])');if(mode==='match')h.w.document.getElementById('source').click();wrong.click();assert.match(h.say(),/Hayır, bu kırmızı değil/);assert.equal(h.tasks.size,0,'prompt stays until child completes');h.answer();h.say();h.tick(800);await h.flush();h.dom.window.close();
}
const spoken=harness('name');await spoken.start(1);assert(!spoken.recognition);spoken.say();assert(spoken.recognition);for(let n=0;n<2;n++){spoken.recognition.onresult({resultIndex:0,results:[Object.assign([{transcript:'mavi'}],{isFinal:true})]});const correction=spoken.say();assert.match(correction,/mavi değil.*kırmızı/);assert.equal(correction.includes('Şimdi sen söyle'),n===0);}spoken.tick(800);await spoken.flush();assert.match(spoken.w.document.getElementById('counter').textContent,/Deneme 2/);spoken.dom.window.close();
for(const mode of ['match','show','name'])for(const method of ['wait','immediate']){
 const h=harness(mode,method),last=h.w.ColorTeachingData.stages[mode].length;await h.start(last);let blocks=0;do{for(let n=0;n<5;n++)await h.finishTrial();assert.equal(h.w.document.getElementById('summary').hidden,false);assert.match(h.w.document.getElementById('totals').textContent,method==='wait'?/5 bağımsız/:/5 ipucuyla/);assert(h.w.document.getElementById('game'));blocks++;if(h.w.document.getElementById('next').hidden)break;h.w.document.getElementById('next').click();await h.flush();}while(blocks<5);assert.equal(h.w.document.getElementById('next').hidden,true,'no next button after final block');assert.equal(blocks,mode==='match'?1:4);h.dom.window.close();
}
for(const mode of ['match','show','name'])for(const method of ['wait','immediate'])for(const color of ['red','blue','yellow','green']){
 const h=harness(mode,method);h.w.document.querySelector(`[data-color="${color}"]`).click();await h.start(1);let step={color,level:1,block:0},seen=[],guard=0;
 while(step){
  assert(++guard<100,'progression terminates');const stage=data.stages[mode][step.level-1];seen.push({...step,mixed:!!stage.mixed});
  for(let n=0;n<5;n++){if(!stage.mixed)assert.equal(h.color(),step.color,'all five trials retain the selected color');await h.finishTrial();}
  const next=data.nextStep(mode,step.color,step.level,step.block),button=h.w.document.getElementById('next');assert.equal(button.hidden,!next);
  if(next){button.click();await h.flush();assert.match(h.w.document.getElementById('counter').textContent,new RegExp(`Basamak ${next.level} · Bölüm ${next.block+1}`));}
  step=next;
 }
 const expected=data.stages[mode].flatMap((s,i)=>s.mixed?[]:Array(s.objectBlocks?4:1).fill(i+1));assert.deepEqual(seen.map(s=>s.level),Array.from(expected));assert(seen.every(s=>s.color===color&&!s.mixed),'no automatic switch to another color or mixed stage');assert.match(h.w.document.getElementById('summaryTitle').textContent,/bitirdin, tebrikler/);assert.equal(h.w.document.getElementById('chooseColor').hidden,false);h.w.document.getElementById('chooseColor').click();assert.equal(h.w.document.getElementById('setup').hidden,false);h.w.document.querySelector('[data-color="blue"]').click();await h.start(1);assert.equal(h.color(),'blue','new color starts only after explicit selection');h.dom.window.close();
}
assert.equal(data.judge('kırmızı','red'),'correct');assert.equal(data.judge('kirmizi','red'),'correct');assert.equal(data.judge('mavi','red'),'wrong');assert.equal(data.judge('red','red'),'wrong');assert.equal(data.judge('salak','red'),'inappropriate');assert(!data.correction('red','salak','inappropriate').includes('salak'));
const app=fs.readFileSync('dist/app.js','utf8');for(const key of ['color-match','color-show','color-name'])assert(app.includes(key));assert(app.includes("event.source!==document.getElementById('colorTeachingFrame').contentWindow"));assert(app.includes("state.screen==='color-teaching'&&name!=='color-teaching'"));
console.log(`OK: ${trialCount} curriculum trials and all assets; color order/balancing, every-two-trial positions, both methods after audio, visual correction, two spoken attempts, all final blocks, filtered speech and main integration.`);

