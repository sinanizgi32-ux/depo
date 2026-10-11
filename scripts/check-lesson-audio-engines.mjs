import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const jsdom=process.argv[2];if(!jsdom)throw Error('Pass the JSDOM api.js path.');
fs.mkdirSync('outputs/audio-plan-tests',{recursive:true});
const concepts=['clean','dirty','hot','cold','big','small','heavy','light','thin','thick','day','night','inside','outside','full','empty','new','worn','hard','soft','wet','dry'];
for(const name of ['color','length','short','age','opposite','action']){
 let source=fs.readFileSync(`scripts/check-${name}-teaching.mjs`,'utf8');
 const position=source.indexOf('w.speechSynthesis={');
 if(position<0)throw Error('Audio harness changed: '+name);
 source=source.slice(0,position)+"w.eval(fs.readFileSync('dist/lesson-audio-plan.js','utf8'));let preparedTexts=null;w.CharacterVoice={prepareLesson:async texts=>{preparedTexts=new Set(texts);return true;}};"+source.slice(position);
 // Arbitrary pupil transcripts are private live corrections, outside the finite teacher bank.
 source=source.replace('speak:u=>speech.push(u)',"speak:u=>{if(preparedTexts && !/^Hayır, (bu )?.+ değil\\./.test(u.text))assert(preparedTexts.has(u.text),'Unprepared teacher sentence: '+u.text);speech.push(u);}");
 const file=`outputs/audio-plan-tests/${name}.mjs`;fs.writeFileSync(file,source);
 for(const concept of name==='opposite'?concepts:['']){
  const result=spawnSync(process.execPath,[file,jsdom],{env:{...process.env,OPPOSITE_CONCEPT:concept},encoding:'utf8'});
  process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');if(result.status!==0)process.exit(result.status||1);
 }
}
for(const name of ['object-matching','object-pointing','pattern','events']){
 let source=fs.readFileSync(`scripts/check-${name}.mjs`,'utf8').replaceAll('../dist/','../../dist/');
 const setup="vm.runInContext(fs.readFileSync(new URL('../../dist/lesson-audio-plan.js',import.meta.url),'utf8'),context);let preparedTexts=null;context.window.CharacterVoice={prepareLesson(texts){preparedTexts=new Set(texts);return{then(callback){callback(true);}};}};\n";
 if(name.startsWith('object-')){
  source=source.replace('const data=context.window.ObjectMatchingData;',setup+'const data=context.window.ObjectMatchingData;');
  source=source.replace('speak:(avatar,text,done)=>speeches.push({text,done})',"speak:(avatar,text,done)=>{assert(preparedTexts.has(text),'Unprepared object speech: '+text);speeches.push({text,done});}");
 }else{
  source=source.replace('Object.assign(state, { screen:','Object.assign(state, { audioPrepared:false, screen:');
  const pos=source.indexOf('vm.runInContext(`');source=source.slice(0,pos)+setup+source.slice(pos);
  const helper="source.slice(source.indexOf('  function prepareBlockAudio('),source.indexOf('  function renderPatternTrial()')) + ";
  if(name==='pattern')source=source.replace('const functions = ','const functions = '+helper).replace('speak(key, text, done) { done?.(); }',"speak(key,text,done){assert(preparedTexts.has(text),'Unprepared pattern: '+text);done?.();}");
  else source=source.replace('const instruction = ','const instruction = '+helper).replace('speak: (key, text, done) => speeches.push({ text, done })',"speak:(key,text,done)=>{assert(preparedTexts.has(text),'Unprepared event: '+text);speeches.push({text,done});}");
 }
 const file=`outputs/audio-plan-tests/${name}.mjs`;fs.writeFileSync(file,source);const result=spawnSync(process.execPath,[file],{encoding:'utf8'});
 process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');if(result.status!==0)process.exit(result.status||1);
}
