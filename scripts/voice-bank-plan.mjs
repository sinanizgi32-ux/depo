import fs from 'node:fs/promises';
import vm from 'node:vm';
import {activityPhrases} from './character-audio-catalog.mjs';
export const voices={pofidik:'Pofidik Ayı',dila:'Dila Panda',kipir:'Kıpır Kunduz',mina:'Mina Tilki'};
export async function voiceBankPlan(root=new URL('../',import.meta.url)){
 const ctx={window:{}};
 vm.runInNewContext(await fs.readFile(new URL('dist/voice-text.js',root),'utf8'),ctx);
 const units=text=>Array.from(ctx.window.VoiceText.units(text));
 const canonical=text=>ctx.window.VoiceText.canonical(text);
 vm.runInNewContext(await fs.readFile(new URL('dist/matching-data.js',root),'utf8'),ctx);
 const items=Object.values(ctx.window.ObjectMatchingData.items);
 const common=['Aferin!','Çok güzel!','Bravo!','Süpersin!','Harikasın!','Mükemmel!','Muhteşem!','Ne güzel yaptın!','Böyle devam et!','İşte bu, başardın!','Çok iyi yaptın!','Başardın!','Çok başarılısın!','Harika bir cevap!','Çok dikkatliydin!','Tebrik ederim!','Şahane!','Çok güzel ilerliyorsun!','Çok güzel söyledin!','Doğru.'];
 const buddy=['Evet, buradayım!','Çok güzel gidiyorsun!','Oynamak ister misin?','Devam edelim mi?','Ben hep yanındayım.','Harikasın, böyle devam!','Bir oyun daha oynayalım mı?','Seninle oynamak çok güzel!','Ne oynayalım, sen söyle!','Bugün çok iyi çalışıyoruz!'];
 const instructions=items.flatMap(item=>[`${item.accusative} eşle.`,`${item.accusative} göster.`]);
 const activity=await activityPhrases(root,items);
 const urgent=new Set(['Gösterilen karta dokun.','Hayır, bu kartın yeri farklı.']);
 const primary=new Set([...urgent,...common,...instructions,...activity.filter(text=>units(text).length===1&&/(?:eşle|göster)[.!?]$/.test(text)),...activity.filter(text=>/^(?:Bu ne\?|Ne yapıyor\?|Bu hangi renk\?|Bak dikkat! Burası|İşaretli )/.test(text)&&text.length<100)]);
 const phrases=[...new Set([...primary,...buddy,...activity])];
 const targets=Object.entries(voices).flatMap(([character,name])=>[...phrases,`Selam! Ben ${name}. Beni seçmek ister misin?`,`Merhaba! Ben ${name}. Benimle oynamak ister misin?`,`Selam! Ben ${name}. Birlikte oyun oynayalım mı?`].map(text=>({character,text})));
 const island=await fs.readFile(new URL('scripts/pofidik-island-source.js',root),'utf8'),storyContext={};
 vm.runInNewContext(island.slice(island.indexOf('const fruits='),island.indexOf('let index='))+island.slice(island.indexOf('const story=['),island.indexOf('function land()'))+';this.stories=story;this.trials=trials;this.fruits=fruits;',storyContext);
 const gameNarration=[...storyContext.stories.map(s=>s.text),'Dikkatli bak. Buraya hangisi gelir?','Sıraya bir daha bakalım.','Harikasın! Son meşale yandı!','Aferin! Bir meşale yandı.','Harika! Bir meşale daha yandı.','Hazineyi bulduk! Pofidik seninle çok mutlu.',...storyContext.trials.map(t=>{const names=t.block.map(id=>storyContext.fruits[id].toLocaleLowerCase('tr')).join(', ');return `Bak, ${names}. Yine ${names}. Buraya ${storyContext.fruits[t.block[t.shown%t.block.length]].toLocaleLowerCase('tr')} gelmeli. Şimdi seç.`;})];
 vm.runInNewContext(await fs.readFile(new URL('dist/wh-data.js',root),'utf8'),ctx);
 const whNarration=ctx.window.WhData.stories.map(story=>story.narration);
 const narration=[...new Set(['Merhaba! Birlikte yeni bir maceraya başlıyoruz.',...gameNarration,...whNarration])];
 targets.push(...narration.map(text=>({character:'narrator',text})));
 const allowed=[...new Set(targets.flatMap(({text})=>[text,...units(text)]))];
 const indexes=new WeakMap();
 function recording(manifest,character,text){let index=indexes.get(manifest);if(!index){index=Object.fromEntries(Object.entries(manifest).map(([key,entries])=>[key,new Map(Object.entries(entries).map(([phrase,url])=>[canonical(phrase),url]))]));indexes.set(manifest,index);}return manifest[character]?.[text]||index[character]?.get(canonical(text));}
 const covered=(manifest,{character,text})=>Boolean(recording(manifest,character,text))||units(text).every(part=>Boolean(recording(manifest,character,part)));
 function production(manifest,selected=null){
  const jobs=new Map();
  for(const target of targets){if(selected&&!selected.has(target.text)||covered(manifest,target))continue;
   const {character,text}=target;
   for(const part of primary.has(text)?[text]:units(text)){
    if(recording(manifest,character,part))continue;
    const rank=character!=='narrator'&&(/^(?:Selam!|Merhaba!|Ben (?:Pofidik|Dila|Kıpır|Mina)|Beni seçmek|Benimle oynamak|Birlikte oyun)/.test(part))?-2:['Aferin!','Harikasın!','Süpersin!'].includes(part)?-1:urgent.has(part)||['Bu ne? Söyle.','Ne yapıyor? Söyle.','Bu hangi renk? Söyle.','İşaretli nesne uzun mu, kısa mı? Söyle.','İşaretli kişi genç mi, yaşlı mı? Söyle.'].includes(part)?0:primary.has(text)&&/(?:eşle|göster)\.$/.test(part)?0:/(?:eşle|göster)[.!?]$/.test(text)?1:/^(?:Şimdi sen söyle|Bu söylediğin sözcük uygun|Bu |Evet, yaklaştın)/.test(part)?2:primary.has(text)?3:4;
    const id=character+'|'+canonical(part),entry=jobs.get(id)||{character,text:part,rank,uses:0};entry.rank=Math.min(entry.rank,rank);entry.uses++;jobs.set(id,entry);
   }
  }
  return [...jobs.values()].sort((a,b)=>a.rank-b.rank||b.uses-a.uses||a.text.length-b.text.length);
 }
 const coverage=manifest=>({ready:targets.filter(target=>covered(manifest,target)).length,total:targets.length,recordings:Object.values(manifest).reduce((n,entries)=>n+Object.keys(entries).length,0)});
 return {targets,allowed,primary,urgent,items,units,recording,covered,production,coverage,narration,gameNarration};
}
