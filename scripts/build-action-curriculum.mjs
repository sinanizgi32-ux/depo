import fs from 'node:fs';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
const ff='C:/Users/sinan/Documents/Codex/2026-10-05/node-scripts-serve-mjs/media-tools/node_modules/ffmpeg-static/ffmpeg.exe';
const context={window:{}};vm.runInNewContext(fs.readFileSync('dist/action-video-library.js','utf8'),context);
const previous=context.window.ActionVideoLibrary;
const harvest=JSON.parse(fs.readFileSync('source-assets/action-videos/harvest.json','utf8'));
const clip=(id,start=0,length=6.5,crop='')=>({id:String(id),start,length,crop});
// Exact source intervals chosen after reviewing the contact sheets. Short complete
// actions replay at their original speed; there is no still-frame padding.
const definitions=[
 ['drink','Su içmek','Su içmeyi','Su içiyor',['su içmek','su içme','içiyor su'],['içiyor','içmek'],[null,clip(8873016)],'care'],
 ['catch','Topu tutmak','Topu tutmayı','Topu tutuyor',['top tutuyor','topu tutmak','top tutmak','topu yakalıyor','top yakalıyor','topu yakalamak'],['tutuyor','yakalıyor'],[null,clip(7939020,2.5,1.7)],'ball'],
 ['brush-teeth','Diş fırçalamak','Diş fırçalamayı','Dişlerini fırçalıyor',['diş fırçalıyor','dişini fırçalıyor','diş fırçalamak','dişlerini fırçalamak','diş fırçalama'],['fırçalıyor'],[null,clip(8747601)],'care'],
 ['wash-hands','El yıkamak','El yıkamayı','Ellerini yıkıyor',['el yıkıyor','elini yıkıyor','el yıkamak','ellerini yıkamak','el yıkama'],['yıkıyor'],[null,clip(3989320,2)],'care'],
 ['draw','Boyama yapmak','Boyama yapmayı','Boyama yapıyor',['boyuyor','boyama yapmak','boyamak','resim boyuyor','kâğıdı boyuyor','boyama'],[],[null,clip(7354939,0,6.5,'crop=iw:ih*0.62:0:ih*0.38')],'art'],
 ['take','Almak','Almayı','Alıyor',['almak','paketi alıyor','taşı alıyor','taş alıyor','yerden alıyor','kutuyu alıyor'],[],[clip(6994429,0,6.5),clip(8576897,0,5.5)],'transfer'],
 ['give','Vermek','Vermeyi','Veriyor',['vermek','hediye veriyor','hediyeyi veriyor','oyuncağı veriyor','oyuncak veriyor'],[],[clip(7156940,1,6.5,'crop=iw*0.7:ih:iw*0.3:0'),clip(7491440,0,6.5)],'transfer'],
 ['go','Gitmek','Gitmeyi','Gidiyor',['gitmek','uzaklaşıyor','yürüyüp gidiyor','yürüyor','yürümek'],[],[clip(5183521,8),clip(4401558,0,5.8)],'travel'],
 ['come','Gelmek','Gelmeyi','Geliyor',['gelmek','yanına geliyor','annesine geliyor','bize geliyor','yaklaşıyor','koşarak geliyor','yürüyerek geliyor','koşuyor','yürüyor'],[],[clip(6951026,0,4.5),clip(5988809,1,6.5,'crop=iw*0.55:ih:iw*0.225:0')],'travel'],
 ['sit','Oturmak','Oturmayı','Oturuyor',['oturmak','sandalyeye oturuyor','sandalyede oturuyor'],[],[clip(6349208),clip(8157441,0,5.5)],'posture'],
 ['stand','Ayağa kalkmak','Ayağa kalkmayı','Ayağa kalkıyor',['ayağa kalkmak','kalkıyor','kalkmak','ayağa kalktı'],[],[clip(8655721,0,6.5),clip(6935846,3,6.5)],'posture'],
 ['walk','Yürümek','Yürümeyi','Yürüyor',['yürümek','yürüme','gidiyor'],[],[clip(9436821,0,3.8),clip(4401558,0,5.8)],'travel'],
 ['run','Koşmak','Koşmayı','Koşuyor',['koşmak','koşma'],[],[clip(10366715,1,6.5),clip(8208468,0,6.5)],'travel'],
 ['jump','Zıplamak','Zıplamayı','Zıplıyor',['zıplamak','zıplama','atlıyor','atlamak'],[],[clip(7671622),clip(8612624)],'travel'],
 ['throw','Topu atmak','Topu atmayı','Topu atıyor',['top atıyor','topu atmak','top atmak','top fırlatıyor','topu fırlatıyor'],['atıyor'],[clip(7939020,0,2.4),clip(8034229,0,6.5)],'ball'],
 ['eat','Yemek yemek','Yemek yemeyi','Yemek yiyor',['yemek yemek','yiyor','ekmek yiyor','yemek yeme'],[],[clip(7218815,0,6.5),clip(6482055,0,6.5)],'care'],
 ['sleep','Uyumak','Uyumayı','Uyuyor',['uyumak','uyuma'],[],[clip(8375468),clip(7505576)],'care'],
 ['read','Kitap okumak','Kitap okumayı','Kitap okuyor',['kitap okumak','okuyor','kitap okuma'],[],[clip(5182688),clip(8499731)],'art'],
 ['draw-pencil','Resim çizmek','Resim çizmeyi','Resim çiziyor',['resim çizmek','çiziyor','çizmek','resim çizme'],[],[clip(5088348),clip(6996519,0,2.7)],'art'],
 ['cut','Kâğıt kesmek','Kâğıt kesmeyi','Kâğıt kesiyor',['kağıdı kesiyor','kâğıdı kesiyor','kağıt kesiyor','kağıt kesmek','kesiyor','makasla kesiyor'],[],[clip(6977411),clip(6943342)],'art'],
 ['comb','Saç taramak','Saç taramayı','Saç tarıyor',['saçını tarıyor','saçlarını tarıyor','saç taramak','saçını taramak','tarıyor'],[],[clip(4189948,2),clip(7938960,0,6.5)],'care'],
 ['put-shoes','Ayakkabı giymek','Ayakkabı giymeyi','Ayakkabı giyiyor',['ayakkabı giymek','ayakkabısını giyiyor','ayakkabılarını giyiyor'],['giyiyor'],[clip(8994347,0,5.5),clip(8995265,0,4.5)],'care'],
 ['wipe','Masayı silmek','Masayı silmeyi','Masayı siliyor',['masa siliyor','masayı silmek','masa silmek','siliyor'],[],[clip(8638173,3),clip(9462914)],'care'],
 ['clap','Alkış yapmak','Alkış yapmayı','Alkış yapıyor',['alkışlıyor','alkış yapmak','alkışlamak','ellerini çırpıyor','el çırpıyor'],[],[clip(8160020),clip(10565806)],'social'],
 ['blow','Üflemek','Üflemeyi','Üflüyor',['üflemek','köpük üflüyor','baloncuk üflüyor'],[],[clip(8065088,0,6.5),clip(6743324,0,6)],'social'],
 ['water-plant','Bitki sulamak','Bitki sulamayı','Bitkiyi suluyor',['bitki suluyor','bitkiyi sulamak','bitki sulamak','çiçek suluyor','çiçeği suluyor','suluyor'],[],[clip(5689679),clip(12760961)],'care'],
 ['open','Açmak','Açmayı','Açıyor',['açmak','kapıyı açıyor','çantayı açıyor','çanta açıyor','kitabı açıyor'],[],[clip(8747616,0,3.8),clip(7977733,0,5.5)],'open-close'],
 ['close','Kapatmak','Kapatmayı','Kapatıyor',['kapatmak','kapıyı kapatıyor','çantayı kapatıyor','fermuarı kapatıyor'],[],[clip(2110196,3.5,3.5),clip(8108706,4,6.5)],'open-close'],
 ['tidy','Oyuncak toplamak','Oyuncak toplamayı','Oyuncakları topluyor',['oyuncak topluyor','oyuncak toplamak','oyuncakları toplamak','oyuncakları sepete koyuyor','topluyor'],[],[clip(12760321),clip(10555497,22,6.5)],'transfer'],
 ['wave','El sallamak','El sallamayı','El sallıyor',['el sallamak','el sallama','selam veriyor','sallıyor'],[],[clip(8160566),clip(8384633,0,3.5,'crop=iw*0.55:ih:iw*0.2:0')],'social']
];
// Keep exactly 30 foundational actions with two reviewed source examples each.
const actions=definitions.map(([id,name,instruction,model,answers,partial,clips,group])=>({id,name,instruction,model,answers:[model,name,...answers],partial,clips,group}));
if(actions.length!==30)throw Error(`Expected 30 actions, got ${actions.length}`);
const library=[];
for(const action of actions){
 const variants=[];
 for(let n=0;n<action.clips.length;n++){
  const edit=action.clips[n];
  if(!edit){const old=previous.find(x=>x.id===action.id);if(!old)throw Error(action.id);const {variants:ignored,...record}=old;variants.push({...record,poster:old.file.replace('.mp4','.jpg'),environment:'İlk örnek'});continue;}
  const source=harvest.find(r=>(r.id||r.page.match(/-(\d+)\//)?.[1])===edit.id);if(!source)throw Error(`No source ${edit.id}`);
  const file=`${action.id}-${n+1}.mp4`,poster=file.replace('.mp4','.jpg');const out=`dist/assets/actions/videos/${file}`;
  const temp=`outputs/action-candidates/${action.id}-${n+1}-segment.mp4`;
  if(!fs.existsSync(out)||process.argv.includes('--all')||process.argv.slice(2).includes(action.id)){
   const vf=[edit.crop,'scale=960:540:force_original_aspect_ratio=decrease:force_divisible_by=2','setsar=1','fps=30'].filter(Boolean).join(',');
   const result=spawnSync(ff,['-hide_banner','-loglevel','error','-ss',String(edit.start),'-i',`source-assets/action-videos/${edit.id}.mp4`,'-t',String(edit.length),'-an','-vf',vf,'-c:v','libx264','-crf','23','-preset','fast','-threads','2','-movflags','+faststart','-y',temp],{encoding:'utf8'});if(result.status)throw Error(result.stderr);
   const repeat=spawnSync(ff,['-hide_banner','-loglevel','error','-stream_loop','-1','-i',temp,'-t','6.5','-an','-c:v','libx264','-crf','23','-preset','fast','-threads','2','-movflags','+faststart','-y',out],{encoding:'utf8'});if(repeat.status)throw Error(repeat.stderr);
  }
  for(const [destination,filter] of [[`dist/assets/actions/videos/${poster}`,'select=eq(n\\,45)'],[`outputs/action-candidates/${action.id}-${n+1}-final.jpg`,'fps=1,scale=220:-2,tile=7x1']]){const r=spawnSync(ff,['-hide_banner','-loglevel','error','-i',out,'-vf',filter,'-frames:v','1','-q:v','3','-y',destination],{encoding:'utf8'});if(r.status)throw Error(r.stderr);}
  variants.push({file,poster,credit:source.credit||source.links?.find(l=>l.url.includes('pexels.com/@')&&l.text.length>2)?.text,source:source.page,environment:n===0?'İlk ortam':'Farklı kişi / ortam',sourceId:edit.id,edit:`Source ${edit.start}–${edit.start+edit.length}s, original speed; ${edit.length<6.5?'complete action segment repeated to ':''}6.5s; silent; native aspect ratio within 960×540; ${edit.crop||'full frame'}`});
  console.log(action.id,n+1);
 }
 library.push({id:action.id,title:action.name,focus:`${action.model}. Hareketi izle.`,...variants[0],variants});
}
fs.writeFileSync('dist/action-video-library.js','window.ActionVideoLibrary='+JSON.stringify(library,null,2)+';\n');
fs.writeFileSync('dist/action-catalog.js','window.ActionCatalog='+JSON.stringify(actions.map(({clips,...rest})=>rest),null,2)+';\n');
console.log(`Ready: ${library.length} actions, ${library.reduce((n,a)=>n+a.variants.length,0)} videos.`);
