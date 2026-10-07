import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
let nodes,timers,speeches,dropTarget,state,engine,finished;
function node(){let html='';const classes=new Set();const n={children:[],dataset:{},style: {setProperty(name,value){this[name]=String(value);}},hidden:true,disabled:false,className:'',handlers:{},classList:{add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name)),toggle:(name,on)=>on?classes.add(name):classes.delete(name),contains:name=>classes.has(name)},setAttribute(name,value){this[name]=value;},appendChild(child){this.children.push(child);},addEventListener(name,fn){this.handlers[name]=fn;},querySelectorAll(){return this.children;},insertAdjacentHTML(position,text){html+=text;},setPointerCapture(id){this.pointer=id;},releasePointerCapture(){this.pointer=null;},hasPointerCapture(id){return this.pointer===id;},closest(selector){return this.className===selector.slice(1)?this:null;}};Object.defineProperty(n,'innerHTML',{get:()=>html,set:value=>{html=value;n.children=[];}});return n;}
const context=vm.createContext({window:{},document:{getElementById:id=>nodes[id] ||= node(),querySelector:()=>nodes.toolbar ||= node(),createElement:node,elementFromPoint:()=>dropTarget},setTimeout:(fn,ms)=>{const t={fn,ms};timers.add(t);return t;},clearTimeout:t=>timers.delete(t),Math});
for(const file of ['matching-data','object-matching'])vm.runInContext(fs.readFileSync(new URL(`../dist/${file}.js`,import.meta.url),'utf8'),context);
const data=context.window.ObjectMatchingData;
assert.equal(data.categories.length,10);assert.equal(Object.keys(data.items).length,100);assert.equal(new Set(Object.keys(data.items)).size,100);
for(const category of data.categories)assert.equal(category.items.length,10);
function reset(id='cat',level=1,method='wait'){
  nodes={pauseModal:node()};nodes.pauseModal.hidden=true;timers=new Set();speeches=[];finished=0;
  state={screen:'activity',skill:'object-match',avatar:'pofidik',method,matchItem:id,matchLevel:level,trial:0,stats:{independent:0,prompted:0,incorrect:0}};
  engine=context.window.ObjectMatching.create({state,speak:(avatar,text,done)=>speeches.push({text,done}),praise:()=> 'Harikasın!',finishBlock:()=>{finished++;state.screen='summary';engine.stop();}});engine.render();
}
function speakEnd(){const speech=speeches.shift();assert(speech);speech.done?.();return speech.text;}
function fire(ms){for(const timer of [...timers])if(timer.ms===ms){timers.delete(timer);timer.fn();}}
const source=()=>nodes.objectSource;
const targets=()=>nodes.objectTargets.children;
function choose(id){source().handlers.click();targets().find(t=>t.dataset.object===id).handlers.click();}
let count=0;
for(const item of Object.values(data.items))for(let level=1;level<=4;level++){
  reset(item.id,level);
  for(let trial=0;trial<5;trial++){
    const example=data.trial(item.id,level,trial);
    assert.equal(example.options.length,data.stages[level-1].count);assert.equal(new Set(example.options).size,example.options.length);
    assert.equal(targets().filter(t=>t.dataset.object===item.id).length,1);assert.equal(timers.size,0);assert(source().disabled);
    assert.equal(speakEnd(),`${item.accusative} eşle.`);assert([...timers].some(t=>t.ms===4000));
    const correct=targets().find(t=>t.dataset.object===item.id);
    if(level===1)assert.equal(source().innerHTML,correct.innerHTML,'İlk seviye birebir aynı resim');else assert.notEqual(source().innerHTML,correct.innerHTML,'Diğer seviyeler farklı görünüm');
    choose(item.id);assert(source().hidden);assert.equal(timers.size,0,'Pekiştirme bitmeden sonraki deneme başlamamalı');
    engine.answer(item.id);assert.equal(state.stats.independent,trial+1,'Tek eşleme bir kez sayılmalı');
    assert.equal(speakEnd(),'Harikasın!');fire(1000);count++;
  }
  assert.equal(finished,1);assert.equal(state.stats.independent,5);
}
assert.equal(count,2000);
reset('cat',3);speakEnd();choose('dog');assert.equal(state.stats.incorrect,1);assert(state.hadPrompt);assert(source().disabled);assert(speakEnd().includes('Kediyi eşle.'));assert(!source().disabled);choose('cat');speakEnd();assert.equal(state.stats.prompted,1);
reset();assert.equal(timers.size,0);speakEnd();fire(4000);assert(state.hadPrompt);assert(!source().hidden,'İpucu otomatik tamamlamamalı');speakEnd();choose('cat');speakEnd();assert.equal(state.stats.prompted,1);
for(let level=1;level<=4;level++){
  reset('cat',level,'immediate');speakEnd();assert(state.hadPrompt);assert.equal(timers.size,0);speakEnd();choose('cat');speakEnd();assert.equal(state.stats.independent,0);assert.equal(state.stats.prompted,1);
}
function pointer(name,x,y){source().handlers[name]({pointerId:1,button:0,clientX:x,clientY:y});}
reset('cat',3);speakEnd();pointer('pointerdown',10,200);fire(4000);assert(!state.hadPrompt,'Başlamış sürükleme zaman aşımına uğramamalı');pointer('pointermove',10,20);dropTarget=targets().find(t=>t.dataset.object==='cat');pointer('pointerup',10,20);assert.equal(state.stats.independent,1);
reset('cat',3);speakEnd();pointer('pointerdown',10,200);pointer('pointermove',10,20);dropTarget=targets().find(t=>t.dataset.object==='dog');pointer('pointerup',10,20);assert.equal(state.stats.incorrect,1);assert(state.hadPrompt);
reset();speakEnd();pointer('pointerdown',10,200);pointer('pointermove',200,200);dropTarget=null;pointer('pointerup',200,200);assert.equal(state.stats.incorrect,0);assert([...timers].some(t=>t.ms===4000));
reset();speakEnd();pointer('pointerdown',10,200);source().handlers.pointercancel();assert([...timers].some(t=>t.ms===4000));
reset();nodes.pauseModal.hidden=false;engine.pause();speakEnd();assert.equal(timers.size,0);nodes.pauseModal.hidden=true;engine.resume();speakEnd();assert([...timers].some(t=>t.ms===4000));
reset();speakEnd();choose('cat');nodes.pauseModal.hidden=false;engine.pause();speakEnd();assert.equal(timers.size,0);nodes.pauseModal.hidden=true;engine.resume();speakEnd();fire(1000);assert.equal(state.trial,1);
reset();state.screen='platform';engine.stop();speakEnd();assert.equal(timers.size,0,'Ana menüye dönünce eski yönerge ipucu açmamalı');
const app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
context.objectData=data;context.eventContent={levels:[]};context.patternLevels=[];context.trials=[];context.pairTrials=[];
context.saveState=()=>{};context.showScreen=name=>state.screen=name;let nextStarted=0;
context.resetActivity=(skill,level)=>{assert.equal(skill,'object-match');state.matchLevel=level;state.trial=0;nextStarted++;};
vm.runInContext(app.slice(app.indexOf('  function nextPatternLevel()'),app.indexOf('  function goPlatform(')),context);
for(let level=1;level<=4;level++){
  reset('cat',level,'immediate');context.state=state;state.stats={independent:2,prompted:3,incorrect:1};
  context.updateSummary();assert.equal(nodes.summaryNext.hidden,false);assert.equal(nodes.summaryTitle.textContent,`Kedi · Seviye ${level} · 5 deneme tamamlandı`);
  context.nextPatternLevel();assert.equal(state.matchLevel,level+1);assert.equal(state.matchItem,'cat');assert.equal(state.method,'immediate');
}
assert.equal(nextStarted,4);
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert(html.includes('data-skill="object-match"><div><strong>Nesneleri eşler</strong>'));assert(html.indexOf('matching-data.js')<html.indexOf('object-matching.js'));assert(html.indexOf('object-matching.js')<html.indexOf('./app.js'));
if(process.argv.includes('--assets'))for(const id of Object.keys(data.items))for(let variant=1;variant<=data.variantCount(id);variant++)assert(fs.existsSync(new URL(`../dist/assets/matching/${id}/${variant}.webp`,import.meta.url)),`${id}/${variant} görseli eksik`);
console.log('OK: 100 objects, 4 stages, 2000 trials; exact and varied matching, named instructions, independent/prompted responses, speech timing, dragging, pause and stale callbacks.');

