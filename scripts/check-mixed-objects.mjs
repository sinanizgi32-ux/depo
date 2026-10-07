import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
let nodes,timers,speeches,dropTarget,state,engine,finished;
function node(){let html='';const classes=new Set();const n={children:[],dataset:{},style:{setProperty(name,value){this[name]=String(value);}},hidden:true,disabled:false,className:'',handlers:{},classList:{add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name)),toggle:(name,on)=>on?classes.add(name):classes.delete(name),contains:name=>classes.has(name)},setAttribute(name,value){this[name]=value;},appendChild(child){this.children.push(child);},addEventListener(name,fn){this.handlers[name]=fn;},querySelectorAll(){return this.children;},insertAdjacentHTML(position,text){html+=text;},setPointerCapture(id){this.pointer=id;},releasePointerCapture(){this.pointer=null;},hasPointerCapture(id){return this.pointer===id;},closest(selector){return this.className===selector.slice(1)?this:null;}};Object.defineProperty(n,'innerHTML',{get:()=>html,set:value=>{html=value;n.children=[];}});return n;}
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

assert.equal(data.stages.length,7);assert.equal(data.pointingStages.length,8);
for(let block=0;block<100;block++){
 const examples=data.mixedBlock();assert.equal(examples.length,5);
 assert.equal(new Set(examples.map(t=>t.item.id)).size,5);
 assert.equal(new Set(examples.map(t=>t.item.category)).size,5);
 for(const t of examples){assert.equal(t.options.length,4);assert.equal(new Set(t.options).size,4);assert(t.options.includes(t.item.id));assert.notEqual(t.source,t.target);assert(fs.existsSync(new URL('../dist/assets/matching/'+t.item.id+'/'+(t.target+1)+'.webp',import.meta.url)));}
}
for(const skill of ['object-match','object-show'])for(const method of ['wait','immediate'])for(let offset=1;offset<=3;offset++){
 reset();engine.stop();speeches=[];state.skill=skill;state.method=method;state.matchLevel=(skill==='object-show'?5:4)+offset;engine.render();
 const ids=[];
 for(let index=0;index<5;index++){
  const t=state.mixedTrials[index];ids.push(t.item.id);assert.equal(targets().length,4);
  assert.equal(speakEnd(),t.item.accusative+(skill==='object-show'?' göster.':' eşle.'));
  if(method==='immediate'){assert(state.hadPrompt);speakEnd();}else assert([...timers].some(t=>t.ms===4000));
  if(index===1&&method==='wait'){
   engine.answer(t.options.find(id=>id!==t.item.id));assert(state.hadPrompt);assert(speakEnd().includes(t.item.accusative));
  }
  if(index===2&&method==='wait'){fire(4000);assert(state.hadPrompt);speakEnd();}
  if(skill==='object-match')source().handlers.click();
  targets().find(button=>button.dataset.object===t.item.id).handlers.click();speakEnd();fire(1000);
 }
 assert.equal(new Set(ids).size,5);assert.equal(finished,1);
 assert.equal(state.stats.independent,method==='wait'?3:0);assert.equal(state.stats.prompted,method==='wait'?2:5);
}
const app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
context.objectData=data;context.eventContent={levels:[]};context.patternLevels=[];context.trials=[];context.pairTrials=[];
context.saveState=()=>{};context.showScreen=name=>state.screen=name;
context.resetActivity=(skill,level)=>{state.skill=skill;state.matchLevel=level;};
vm.runInContext(app.slice(app.indexOf('  function nextPatternLevel()'),app.indexOf('  function goPlatform(')),context);
for(const skill of ['object-match','object-show'])for(let level=1;level<=(skill==='object-show'?8:7);level++){
 reset();state.skill=skill;state.matchLevel=level;context.state=state;context.updateSummary();
 const last=level===(skill==='object-show'?8:7);assert.equal(nodes.summaryNext.hidden,last);
 context.nextPatternLevel();assert.equal(state.matchLevel,last?level:level+1);assert.equal(state.skill,skill);
}
console.log('OK: 3 karma eşleme ve 3 karma gösterme seviyesi; 4 seçenek, 5 farklı hedef/kategori, iki yöntem, hata/yanıtsızlık ve son seviye geçişleri.');
