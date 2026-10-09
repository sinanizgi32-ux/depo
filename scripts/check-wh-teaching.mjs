import assert from 'node:assert/strict';import {readFile,access,stat} from 'node:fs/promises';import {createRequire} from 'node:module';import vm from 'node:vm';
const jsdomPath=process.argv[2];if(!jsdomPath)throw Error('JSDOM path required');const {JSDOM}=createRequire(import.meta.url)(jsdomPath),root=new URL('../dist/',import.meta.url);
const dataContext={window:{}};vm.runInNewContext(await readFile(new URL('wh-data.js',root),'utf8'),dataContext);const D=dataContext.window.WhData;
assert.equal(D.stories.length,50);assert.equal(D.levels.length,10);assert.equal(new Set(D.stories.map(s=>s.id)).size,50);
const manifest=JSON.parse(await readFile(new URL('assets/5n1k/video-manifest.json',root),'utf8'));assert.equal(manifest.length,50);
for(const s of D.stories){assert.equal(s.actions.length,D.levels[s.level-1].steps);assert.equal(s.questions.length,6);assert.equal(new Set(s.questions.map(q=>q.type)).size,6);await access(new URL(s.video,root));await access(new URL(s.poster,root));assert((await stat(new URL(s.video,root))).size>10000);const v=manifest.find(x=>x.id===s.id);assert.equal(v.duration,s.duration);assert.equal(v.fps,30);assert.equal(v.frames,v.duration*30);}
async function app(method='wait',voice=false){const dom=new JSDOM(await readFile(new URL('wh-teaching.html',root),'utf8'),{url:`http://127.0.0.1:4180/wh-teaching.html?method=${method}`,runScripts:'outside-only'}),w=dom.window;let now=0,seq=0;const timers=new Map(),speech=[],spoken=[],instances=[];
 w.setTimeout=(f,ms)=>{const id=++seq;timers.set(id,{f,at:now+ms,ms});return id;};w.clearTimeout=id=>timers.delete(id);
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};
 w.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};w.speechSynthesis={getVoices:()=>[],speak:u=>{speech.push(u);spoken.push(u.text);},cancel:()=>speech.splice(0)};
 w.LocalMicrophone={ensure:async()=>({})};w.fetch=async()=>({ok:true,json:async()=>({ready:true})});w.LocalSpeechRecognition=class{constructor(){instances.push(this);}start(){this.onstart?.();}abort(){}};
 for(const f of ['naming-rules.js','wh-data.js','wh-rules.js','wh-scene-renderer.js','wh-teaching.js'])w.eval(await readFile(new URL(f,root),'utf8'));
 const $=id=>w.document.getElementById(id);const flush=()=>{let n=0;while(speech.length){assert(n++<20);speech.shift().onend?.();}};
 const tick=ms=>{now+=ms;let n=0;while([...timers.values()].some(t=>t.at<=now)){assert(n++<50);const [id,t]=[...timers.entries()].find(([,t])=>t.at<=now);timers.delete(id);t.f();}};
 const rows=()=>JSON.parse(w.localStorage.getItem('dijitalErkenEgitim5N1KResultsV1')||'[]');
 const start=async n=>{if(!voice)$('choiceMode').click();await $('levels').children[n-1].onclick();};
 const ended=()=>{$('video').onended();flush();};
 const correct=q=>{if(voice){const r=instances.at(-1);const value=[{transcript:q.answer}];value.isFinal=true;r.onresult({resultIndex:0,results:[value]});}else [...w.document.querySelectorAll('[data-answer]')].find(b=>b.dataset.answer===q.answer).click();flush();tick(700);flush();};
 return {w,dom,$,flush,tick,rows,start,ended,correct,timers,speech,spoken,instances};
}
let checked=0;
for(const method of ['wait','immediate'])for(let level=1;level<=10;level++){const a=await app(method);for(const s of D.stories)for(const q of s.questions){const choices=a.w.WhRules.choices(s,q);assert.equal(new Set(choices.map(c=>c.answer)).size,choices.length);assert.equal(choices.filter(c=>c.answer===q.answer).length,1);assert(choices.length<=4);for(const alias of q.aliases)assert.equal(a.w.WhRules.judge(alias,q),'correct');assert.notEqual(a.w.WhRules.judge('karpuz',q),'correct');}
 await a.start(level);for(let n=0;n<5;n++){const s=D.stories[(level-1)*5+n];a.ended();for(const q of s.questions){a.correct(q);checked++;}if(n<4){assert(!a.$('storyEnd').hidden);a.$('nextStory').click();}}assert(!a.$('levelEnd').hidden);assert.equal(a.rows().length,30);assert(a.rows().every(r=>r.outcome===(method==='wait'?'independent':'prompted')));assert.equal(a.$('nextLevel').hidden,level===10);assert.equal(a.rows().filter(r=>r.type==='neden').length,5);a.dom.window.close();}
{
 const a=await app('wait');await a.start(1);a.$('video').onended();assert(![...a.timers.values()].some(t=>t.ms===4000),'No response clock during narration');a.flush();assert([...a.timers.values()].some(t=>t.ms===4000));a.tick(3999);assert.equal(a.speech.length,0);a.tick(1);assert(a.speech.length>0);a.flush();a.correct(D.stories[0].questions[0]);assert.equal(a.rows()[0].firstResponse,'no-response');assert.equal(a.rows()[0].outcome,'prompted');a.$('reportOpen').click();assert.equal(a.$('reportRows').children.length,6);assert(!a.$('report').hidden);a.dom.window.close();
}
{
 const a=await app('wait');await a.start(1);a.ended();const wrong=()=>[...a.w.document.querySelectorAll('[data-answer]')].find(b=>b.dataset.answer!==D.stories[0].questions[0].answer).click();wrong();a.flush();wrong();a.flush();a.tick(700);a.flush();assert.equal(a.rows().length,1);assert.equal(a.rows()[0].outcome,'incorrect');assert.equal(a.rows()[0].attempts.length,2);a.dom.window.close();
}
{
 const a=await app('wait',true);await a.start(1);a.ended();const r=a.instances.at(-1);assert.equal(r.domain,'wh');r.onspeechstart();assert(![...a.timers.values()].some(t=>t.ms===4000),'Speech start stops the response window');a.correct(D.stories[0].questions[0]);assert.equal(a.rows()[0].input,'voice');const next=a.instances.at(-1);next.onerror();assert.equal(a.rows().length,1,'Technical error is not a child failure');a.$('listenAgain').click();a.flush();const rr=a.instances.at(-1),value=[{transcript:'salak'}];value.isFinal=true;rr.onresult({resultIndex:0,results:[value]});assert(!a.spoken.some(t=>t.includes('salak')));a.flush();assert(a.spoken.some(t=>t.includes('uygun bir sözcük değil')));a.dom.window.close();
}
console.log(`OK: ${checked} soru akışı, 50 video, 300 cevap anahtarı; 4 saniye, eşzamanlı, iki fırsat, teknik hata ve kayıt denetimleri.`);
