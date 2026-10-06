import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
let nodes,timers,speeches,dropTarget,state,engine,finished;
function node(){let html='';const classes=new Set();const n={children:[],dataset:{},style:{},hidden:true,disabled:false,className:'',handlers:{},classList:{add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name)),toggle:(name,on)=>on?classes.add(name):classes.delete(name),contains:name=>classes.has(name)},setAttribute(name,value){this[name]=value;},appendChild(child){this.children.push(child);},addEventListener(name,fn){this.handlers[name]=fn;},querySelectorAll(){return this.children;},insertAdjacentHTML(position,text){html+=text;},setPointerCapture(id){this.pointer=id;},releasePointerCapture(){this.pointer=null;},hasPointerCapture(id){return this.pointer===id;},closest(selector){return this.className===selector.slice(1)?this:null;}};Object.defineProperty(n,'innerHTML',{get:()=>html,set:value=>{html=value;n.children=[];}});return n;}
const context=vm.createContext({window:{},document:{getElementById:id=>nodes[id] ||= node(),querySelector:()=>nodes.toolbar ||= node(),createElement:node,elementFromPoint:()=>dropTarget},setTimeout:(fn,ms)=>{const t={fn,ms};timers.add(t);return t;},clearTimeout:t=>timers.delete(t),Math});
for(const file of ['matching-data','object-matching'])vm.runInContext(fs.readFileSync(new URL(`../dist/${file}.js`,import.meta.url),'utf8'),context);
const data=context.window.ObjectMatchingData;
assert.equal(data.categories.length,10);assert.equal(Object.keys(data.items).length,100);assert.equal(new Set(Object.keys(data.items)).size,100);
for(const category of data.categories)assert.equal(category.items.length,10);
function reset(id='cat',level=1,method='wait'){
  nodes={pauseModal:node()};nodes.pauseModal.hidden=true;timers=new Set();speeches=[];finished=0;
  state={screen:'activity',skill:'object-show',avatar:'pofidik',method,matchItem:id,matchLevel:level,trial:0,stats:{independent:0,prompted:0,incorrect:0}};
  engine=context.window.ObjectMatching.create({state,speak:(avatar,text,done)=>speeches.push({text,done}),praise:()=> 'Harikasın!',finishBlock:()=>{finished++;state.screen='summary';engine.stop();}});engine.render();
}
function speakEnd(){const speech=speeches.shift();assert(speech);speech.done?.();return speech.text;}
function fire(ms){for(const timer of [...timers])if(timer.ms===ms){timers.delete(timer);timer.fn();}}
const source=()=>nodes.objectSource;
const targets=()=>nodes.objectTargets.children;
function choose(id){targets().find(t=>t.dataset.object===id).handlers.click();}

let count=0;
for(const item of Object.values(data.items))for(let level=1;level<=5;level++){
 reset(item.id,level);const variants=new Set();
 for(let trial=0;trial<5;trial++){
  const example=data.pointingTrial(item.id,level,trial);
  assert.equal(example.options.length,[2,2,3,4,5][level-1]);
  assert.equal(new Set(example.options).size,example.options.length);
  assert(example.options.every(id=>data.items[id].category===item.category));
  assert(source().hidden);assert.equal(timers.size,0);
  assert.equal(speakEnd(),item.accusative+' göster.');
  assert([...timers].some(t=>t.ms===4000));
  const correct=targets().find(t=>t.dataset.object===item.id);variants.add(correct.innerHTML);
  choose(item.id);engine.answer(item.id);assert.equal(state.stats.independent,trial+1);
  assert.equal(timers.size,0);speakEnd();fire(1000);count++;
 }
 assert.equal(finished,1);assert.equal(variants.size,level===1?1:3);
}
assert.equal(count,2500);
reset();speakEnd();choose(targets().find(t=>t.dataset.object!=='cat').dataset.object);assert.equal(state.stats.incorrect,1);assert(state.hadPrompt);assert(speakEnd().includes('Kediyi göster.'));choose('cat');speakEnd();assert.equal(state.stats.prompted,1);
reset();speakEnd();fire(4000);assert(state.hadPrompt);assert.equal(state.stats.independent,0);speakEnd();choose('cat');speakEnd();assert.equal(state.stats.prompted,1);
for(let level=1;level<=5;level++){reset('cat',level,'immediate');speakEnd();assert(state.hadPrompt);assert.equal(timers.size,0);speakEnd();choose('cat');speakEnd();assert.equal(state.stats.prompted,1);}
reset();nodes.pauseModal.hidden=false;engine.pause();speakEnd();assert.equal(timers.size,0);nodes.pauseModal.hidden=true;engine.resume();speakEnd();assert([...timers].some(t=>t.ms===4000));
reset();speakEnd();choose('cat');nodes.pauseModal.hidden=false;engine.pause();speakEnd();assert.equal(timers.size,0);nodes.pauseModal.hidden=true;engine.resume();speakEnd();fire(1000);assert.equal(state.trial,1);
reset();state.screen='platform';engine.stop();speakEnd();assert.equal(timers.size,0);
const app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
context.objectData=data;context.eventContent={levels:[]};context.patternLevels=[];context.trials=[];context.pairTrials=[];
context.saveState=()=>{};context.showScreen=name=>state.screen=name;let nextStarted=0;
context.resetActivity=(skill,level)=>{assert.equal(skill,'object-show');state.matchLevel=level;state.trial=0;nextStarted++;};
vm.runInContext(app.slice(app.indexOf('  function nextPatternLevel()'),app.indexOf('  function goPlatform(')),context);
for(let level=1;level<=5;level++){
 reset('cat',level,'immediate');context.state=state;state.stats={independent:2,prompted:3,incorrect:1};
 context.updateSummary();assert.equal(nodes.summaryNext.hidden,level===5);
 context.nextPatternLevel();assert.equal(state.matchLevel,level===5?5:level+1);assert.equal(state.matchItem,'cat');assert.equal(state.method,'immediate');
}
assert.equal(nextStarted,4);
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert(html.includes('data-skill="object-show"><div><strong>İstenen nesneyi gösterir</strong>'));
for(const id of Object.keys(data.items))for(let variant=1;variant<=3;variant++)assert(fs.existsSync(new URL('../dist/assets/matching/'+id+'/'+variant+'.webp',import.meta.url)));
console.log('OK: Nesne gösterme — 100 nesne, 5 seviye, 2500 deneme; iki öğretim yöntemi, yanlış/yanıtsızlık, duraklatma, pekiştirme ve son seviye.');
