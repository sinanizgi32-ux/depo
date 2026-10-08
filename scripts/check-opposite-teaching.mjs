import fs from 'node:fs';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const {JSDOM}=await import(process.argv[2]?pathToFileURL(process.argv[2]).href:'jsdom');
const files=['naming-rules.js','opposite-teaching-data.js','opposite-teaching.js'];
function harness(mode,method='wait'){
 const dom=new JSDOM(fs.readFileSync('dist/opposite-teaching.html','utf8'),{url:`http://127.0.0.1:4180/opposite-teaching.html?mode=${mode}&method=${method}&concept=${process.env.OPPOSITE_CONCEPT||'clean'}`,runScripts:'outside-only'}),w=dom.window;
 let now=0,id=0,recognition;const tasks=new Map(),speech=[];
 w.setTimeout=(fn,delay)=>{tasks.set(++id,{at:now+delay,fn});return id;};w.clearTimeout=i=>tasks.delete(i);
 w.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};w.speechSynthesis={speak:u=>speech.push(u),cancel:()=>speech.splice(0),getVoices:()=>[]};
 Object.defineProperty(w.HTMLImageElement.prototype,'complete',{get:()=>true});Object.defineProperty(w.HTMLImageElement.prototype,'naturalWidth',{get:()=>250});w.HTMLImageElement.prototype.decode=()=>Promise.resolve();
 w.LocalMicrophone={ensure:async()=>({})};w.fetch=async()=>({ok:true,json:async()=>({ready:true})});w.LocalSpeechRecognition=class{constructor(){recognition=this;}start(){this.onstart?.();}abort(){}};
 for(const file of files)w.eval(fs.readFileSync(`dist/${file}`,'utf8'));
 const h={w,dom,tasks,speech,get recognition(){return recognition;},say(){const u=speech.shift();assert(u,'expected speech');u.onend?.();return u.text;},tick(ms){const until=now+ms;while(true){const due=[...tasks].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;now=due[1].at;tasks.delete(due[0]);due[1].fn();}now=until;},async flush(){for(let i=0;i<25;i++)await Promise.resolve();},async start(level){w.document.querySelector(`[data-level="${level}"]`).click();await h.flush();},color(){const cue=w.document.getElementById('instruction').textContent;return mode==='name'?w.document.querySelector(`${w.document.getElementById('scene').hidden?'#targets':'#scene'} .focus`).dataset.color:w.OppositeTeachingData.colors.find(c=>cue.startsWith(c.cue)).id;},answer(){if(mode==='name'){h.recognition.onresult({resultIndex:0,results:[Object.assign([{transcript:w.OppositeTeachingData.color(h.color()).name}],{isFinal:true})]});}else{if(mode==='match')w.document.getElementById('source').click();w.document.querySelector(`${w.document.getElementById('scene').hidden?'#targets':'#scene'} button[data-color="${h.color()}"]`).click();}},async finishTrial(){h.say();if(method==='immediate')h.say();h.answer();h.say();h.tick(800);await h.flush();}};
 return h;
}

let trials=0;
for(const mode of ['match','show','name'])for(const method of ['wait','immediate']){
 const h=harness(mode,method),D=h.w.OppositeTeachingData;await h.start(1);
 for(let level=1;level<=11;level++){
  const c=D.course(mode,level);assert.equal(new Set(c[0].trials.map(t=>t.correct.src)).size,[1,3].includes(level)?1:5);for(const t of c[0].trials){if(level<9)assert.equal(D.media(t.source),D.media(t.correct),'source and matching target geometry');else{assert.notEqual(D.media(t.source),D.media(t.correct),'generalization uses a different source');assert.equal(t.source.color,t.correct.color);if(t.correct.kind==='real')assert.equal(t.source.extent,t.correct.extent);}if(t.correct.kind==='real'){assert.equal(new Set(t.options.map(o=>o.object)).size,t.options.length,'different actual objects');assert(t.options.every(o=>o===t.correct||(o.extent<t.correct.extent)),'only one target length');}assert.equal(t.options.length,D.stages[mode][level-1].count);assert.equal(t.options.filter(o=>o.color===D.colors[0].id).length,1);assert(t.options.every(o=>o===t.correct||o.concept!==t.correct.concept));for(const o of t.options)if(o.src)assert(fs.existsSync('dist/'+o.src.slice(2)));}
  for(let n=0;n<5;n++){assert.equal(h.w.document.getElementById('instruction').textContent,mode==='name'?D.question:D.colors[0].cue+' '+(mode==='match'?'eşle':'göster')+'.');await h.finishTrial();trials++;}
  assert(!h.w.document.getElementById('summary').hidden);assert.equal(h.w.document.getElementById('next').hidden,level===11);if(level<11){h.w.document.getElementById('next').click();await h.flush();}
 }
 assert.match(h.w.document.getElementById('summaryTitle').textContent,/tebrikler/);assert.equal(D.judge(D.colors[0].name),'correct');assert.equal(D.judge(D.color(D.concept.other).name),'wrong');assert.equal(D.judge('salak'),'inappropriate');h.dom.window.close();
}

for(const mode of ['match','show']){
 const h=harness(mode);await h.start(1);const D=h.w.OppositeTeachingData;assert.equal(h.tasks.size,0);h.say();h.tick(3999);assert.equal(h.speech.length,0);h.tick(1);assert(h.say().includes(D.concept.name.toLocaleLowerCase('tr')));h.answer();h.say();h.tick(800);await h.flush();h.say();if(mode==='match')h.w.document.getElementById('source').click();h.w.document.querySelector('button[data-color="'+D.concept.other+'1"]').click();assert(h.say().includes('Hayır'));assert(h.w.document.querySelector('#targets button[data-color="'+D.concept.id+'"]').classList.contains('hint'));h.dom.window.close();
}
const h=harness('name');await h.start(1);h.say();const D=h.w.OppositeTeachingData;assert.equal(h.recognition.domain,'opposites');for(let n=0;n<2;n++){h.recognition.onresult({resultIndex:0,results:[Object.assign([{transcript:D.color(D.concept.other).name}],{isFinal:true})]});const text=h.say();assert(text.includes('değil'));assert.equal(text.includes('Şimdi sen söyle'),n===0);}h.tick(800);await h.flush();assert.match(h.w.document.getElementById('counter').textContent,/Deneme 2/);assert(!D.correction(D.concept.id,'salak','inappropriate').includes('salak'));h.dom.window.close();
const app=fs.readFileSync('dist/app.js','utf8');for(const mode of ['match','show','name'])assert(app.includes(D.concept.id+'-'+mode));assert(app.includes('opposite-teaching-complete'));
console.log(`OK: ${trials} ${D.concept.id} trials, 11 stages, 3 modes, both methods, assets, 4-second interval, correction and two spoken attempts.`);
