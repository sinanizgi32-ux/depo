import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
for(const [file,global,ids] of [['opposite-teaching-data.js','OppositeTeachingData',['clean','dirty','hot','cold','big','small','heavy','light','thin','thick','day','night','inside','outside','full','empty','new','worn','hard','soft','wet','dry']],['age-teaching-data.js','AgeTeachingData',['young','old']]]){
 for(const concept of ids){
  const w={};vm.runInNewContext(fs.readFileSync('dist/'+file,'utf8'),{window:w,location:{search:'?concept='+concept},URLSearchParams});const D=w[global];
  for(const mode of ['match','show','name'])for(let level=1;level<=11;level++){
   const ts=D.course(mode,level)[0].trials;
   for(const t of ts){
    for(const x of [t.source,...t.options])assert(fs.existsSync('dist/'+x.src.slice(2)));
    if(level<4)assert(t.options.every(x=>!x.visualColor),'initial pictures preserved');
    else{if(t.options.length===2)assert(t.options.some(x=>x!==t.correct&&x.visualColor===t.correct.visualColor),'initial two-choice color control');if(level<9)assert.equal(t.source.visualColor,t.correct.visualColor);}
   }
   if(ts[0].options.length>=3){assert.equal(ts.filter(t=>t.options.some(x=>x!==t.correct&&x.variant===t.correct.variant)).length,1,'one counterpart trial out of five');for(const t of ts)assert.equal(new Set(t.options.map(x=>D.media(x))).size,t.options.length);}
   if(level>=4)assert(new Set(ts.map(t=>t.correct.visualColor)).size>=3,'target hues vary across trials');
  }
 }
}
console.log('OK: twenty-four concepts, all modes and 11 stages; original beginning, varied target hues and varied distractors with one counterpart trial.');
