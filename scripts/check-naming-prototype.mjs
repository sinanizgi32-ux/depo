import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
let nodes={},timers=new Set(),speeches=[],recognizers=[];
function node(){return {dataset:{},value:'',hidden:false,textContent:'',innerHTML:'',style:{},children:[],classList:{toggle(){}},appendChild(n){this.children.push(n)},replaceChildren(){this.children=[]},click(){this.onclick?.()}};}
const el=id=>nodes[id]??=node();
class Speech{constructor(text){this.text=text;}}
class Recognition{constructor(){recognizers.push(this)}start(){}abort(){this.aborted=true}}
const synthesis={speak:s=>speeches.push(s),cancel(){},getVoices:()=>[]};
const context=vm.createContext({window:{SpeechRecognition:Recognition,speechSynthesis:synthesis,addEventListener(){}},speechSynthesis:synthesis,SpeechSynthesisUtterance:Speech,document:{getElementById:el,createElement:node,addEventListener(){}},setTimeout:(fn,ms)=>{const t={fn,ms};timers.add(t);return t},clearTimeout:t=>timers.delete(t),setInterval:(fn,ms)=>{const t={fn,ms};timers.add(t);return t},clearInterval:t=>timers.delete(t),Date,Math});
for(const file of ['matching-data','naming-scenes','naming-rules'])vm.runInContext(fs.readFileSync(new URL('../dist/'+file+'.js',import.meta.url),'utf8'),context);
const data=context.window.ObjectMatchingData,rules=context.window.NamingRules;
for(const word of ['kedi','KEDİ','edi','kei','gedi','keti','kedi kedi','Bu bir kedi'])assert.equal(rules.judge(word,data.items.cat,data.items),'correct',word);
for(const word of ['cat','dog','köpek','kedi cat','kadı','kadıyı','keki','kekiyi','ke','k','ki'])assert.equal(rules.judge(word,data.items.cat,data.items),'wrong',word);
for(const word of ['','anlaşılmayan uzun yanıt'])assert.equal(rules.judge(word,data.items.cat,data.items),'uncertain',word);
assert.equal(rules.judge('cat',data.items.cat,data.items,['cat']),'wrong');assert.equal(rules.judge('köpek',data.items.cat,data.items,['köpek']),'wrong');
for(const item of Object.values(data.items))for(let level=1;level<=7;level++){
 const examples=rules.block(data,item.id,level);assert.equal(examples.length,5);
 if(level<=3)assert(examples.every(t=>t.item.id===item.id));else assert.equal(new Set(examples.map(t=>t.item.id)).size,5);
 if(level===1)assert(examples.every(t=>t.variant===0));
 if(level===2&&item.category==='animals')assert.equal(new Set(examples.map(t=>t.variant)).size,5);
 assert(examples.every(t=>t.context===(level===3||level===7)));
 for(const t of examples)assert(fs.existsSync(new URL('../dist/assets/matching/'+t.item.id+'/'+(t.variant+1)+'.webp',import.meta.url)));
}
vm.runInContext(fs.readFileSync(new URL('../dist/naming-prototype.js',import.meta.url),'utf8'),context);
const sayEnd=()=>{const s=speeches.shift();assert(s);s.onend?.();return s.text};
const fire=ms=>{for(const t of [...timers])if(t.ms===ms){timers.delete(t);t.fn()}};
const recognizer=()=>recognizers.at(-1);
const result=(text,final=true)=>{const r=[{transcript:text}];r.isFinal=final;recognizer().onresult?.({resultIndex:0,results:[r]})};
function start(method='wait',level='1'){nodes.item.value='cat';el('level').value=level;el('method').value=method;nodes.aliases.value='';nodes.start.onclick();}
start();assert.equal(recognizers.length,0,'Yönerge sırasında mikrofon açılmamalı');assert.equal(sayEnd(),'Bu ne? Söyle.');recognizer().onstart();assert([...timers].some(t=>t.ms===4000));result('edi');assert(['Aferin!','Harikasın!','Çok güzel söyledin!','Bravo!','Süpersin!'].includes(sayEnd()));
fire(1000);sayEnd();recognizer().onstart();fire(4000);assert(sayEnd().includes('Şimdi sen söyle'));recognizer().onstart();result('kedi');sayEnd();fire(1000);sayEnd();recognizer().onstart();result('cat');assert(sayEnd().includes('bu cat değil'));recognizer().onstart();result('kedi');sayEnd();fire(1000);sayEnd();recognizer().onstart();result('belirsiz uzun yanıt');assert(nodes.status.textContent.includes('Yanlış sayılmadı'));nodes.manualCorrect.onclick();sayEnd();fire(1000);sayEnd();recognizer().onstart();result('kedi',false);assert(![...timers].some(t=>t.ms===4000),'Konuşmaya başladıysa model sözü kesmemeli');result('kedi');sayEnd();fire(1000);assert.equal(nodes.summary.hidden,false);assert.equal(nodes.resultRows.children.length,5);assert.equal(nodes.next.hidden,false);
start('immediate','7');sayEnd();assert(sayEnd().includes('Şimdi sen söyle'));recognizer().onstart();assert(![...timers].some(t=>t.ms===4000));nodes.stop.onclick();assert(recognizer().aborted);
start();sayEnd();recognizer().onstart();const stale=recognizer().onresult;nodes.pause.onclick();assert(recognizer().aborted);const length=speeches.length;stale({resultIndex:0,results:[]});assert.equal(speeches.length,length);nodes.pause.onclick();sayEnd();recognizer().onstart();recognizer().onerror({error:'not-allowed'});assert(nodes.status.textContent.includes('izin'));assert.equal(timers.size,0);nodes.stop.onclick();
console.log('OK: 100 nesne, 7 seviye; Türkçe yakın söyleyiş/İngilizce ret; gerçek tanıma arayüzü taklidiyle 4 saniye, model, konuşma başlangıcı, belirsizlik, izin hatası, mola ve eski yanıtlar.');



start();sayEnd();recognizer().onstart();result('keki');assert(sayEnd().includes('Şimdi sen söyle'));recognizer().onstart();result('kadı');assert.equal(sayEnd(),'Hayır, bu kadı değil. Bu kedi.');fire(1000);assert(nodes.trialCount.textContent.includes('2 / 5'));sayEnd();recognizer().onstart();result('keki');assert(sayEnd().includes('Şimdi sen söyle'));recognizer().onstart();result('kedi');sayEnd();fire(1000);assert(nodes.trialCount.textContent.includes('3 / 5'));nodes.stop.onclick();


speeches=[];const messages=[];
context.window.NamingActivityConfig={item:'dog',level:7,method:'immediate'};
context.window.location={origin:'http://127.0.0.1:4180'};
context.window.parent={postMessage:(msg,origin)=>{assert.equal(origin,context.window.location.origin);messages.push(msg)}};
vm.runInContext(fs.readFileSync(new URL('../dist/naming-prototype.js',import.meta.url),'utf8'),context);
assert.equal(nodes.item.value,'dog');assert.equal(nodes.level.value,'7');assert.equal(nodes.method.value,'immediate');
nodes.start.onclick();
for(let i=0;i<5;i++){sayEnd();assert(sayEnd().includes('Şimdi sen söyle'));recognizer().onstart();nodes.manualCorrect.onclick();sayEnd();fire(1000);}
assert.equal(nodes.next.hidden,true);
const completed=messages.find(m=>m.type==='naming-complete');assert(completed);assert.equal(completed.stats.prompted,5);assert.equal(completed.stats.independent,0);assert.equal(completed.stats.incorrect,0);assert(!JSON.stringify(completed).includes('text'));
nodes.menu.onclick();assert.equal(messages.at(-1).type,'naming-menu');
console.log('OK: Ana uygulama nesne/seviye/yöntemi aktarır; son aşamada ileri düğmesi gizlenir; yalnız toplam sonuçlar ve menü dönüşü bildirilir.');


let permissionRequests=0;
context.window.LocalSpeechRecognition=Recognition;
context.window.LocalMicrophone={available:()=>true,ensure:async()=>permissionRequests++};
context.navigator={mediaDevices:{getUserMedia:async()=>{throw new Error('must reuse permission')}}};
context.fetch=async()=>({json:async()=>({ready:true,message:'Ready'})});
context.window.NamingActivityConfig={item:'cat',level:1,method:'wait',autoStart:true};
nodes.summary.hidden=true;nodes.setup.hidden=false;speeches=[];
vm.runInContext(fs.readFileSync(new URL('../dist/naming-prototype.js',import.meta.url),'utf8'),context);
await new Promise(resolve=>setImmediate(resolve));
assert.equal(nodes.work.hidden,false,'Authorized session should start automatically');
assert.equal(sayEnd(),'Bu ne? Söyle.');recognizer().onstart();
assert.equal(permissionRequests,0,'No additional permission request for an authorized session');
nodes.stop.onclick();
console.log('OK: Permission-ready activity automatically starts instruction and listening.');


for(const word of ['salak','aptal','göt','amıyarak','piç','siktir','geri zekalı']){
 assert.equal(rules.judge(word,data.items.cat,data.items,[word]),'inappropriate');
 assert(!rules.correction(data.items.cat,word,'inappropriate').includes(word));
}
for(const word of ['salatalık','bisiklet','götür','kitap'])assert.equal(rules.hasInappropriate(word),false,word);
assert.equal(rules.judge('makas',data.items.scissors,data.items),'partial');
assert.equal(rules.judge('çocuk makası',data.items.scissors,data.items),'correct');
assert.equal(rules.judge('diş fırçası',data.items.toothbrush,data.items),'correct');
assert.equal(rules.judge('araba',data.items.toycar,data.items),'partial');
assert.equal(rules.correction(data.items.scissors,'makas','partial'),'Evet, yaklaştın. Tam adı çocuk makası. Şimdi sen söyle.');
assert.equal(rules.correction(data.items.cat,'köpek'),'Hayır, bu köpek değil. Bu kedi. Şimdi sen söyle.');
// Exercise real callbacks: partial noun, precise correction, and filtered speech.
context.window.NamingActivityConfig.autoStart=false;speeches=[];
nodes.item.value='scissors';nodes.level.value='1';nodes.method.value='wait';
await nodes.start.onclick();sayEnd();recognizer().onstart();result('makas');assert(sayEnd().includes('Evet, yaklaştın'));recognizer().onstart();result('çocuk makası');sayEnd();fire(1000);
sayEnd();recognizer().onstart();result('salak',false);assert(!nodes.heard.textContent.includes('salak'));result('salak');const warning=sayEnd();assert(warning.includes('uygun bir sözcük değil'));assert(!warning.includes('salak'));recognizer().onstart();result('aptal');assert(!sayEnd().includes('aptal'));fire(1000);assert(nodes.trialCount.textContent.includes('3 / 5'));nodes.stop.onclick();
console.log('OK: Partial compound names require full model; wrong noun is named; inappropriate speech is hidden and never spoken; two attempts remain bounded.');
