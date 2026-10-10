import fs from 'node:fs/promises';import vm from 'node:vm';import crypto from 'node:crypto';
import {activityPhrases} from './character-audio-catalog.mjs';
const root=new URL('../',import.meta.url),folder=new URL('dist/assets/character-voices/ready/',root);await fs.mkdir(folder,{recursive:true});
const ctx={window:{}};vm.runInNewContext(await fs.readFile(new URL('dist/matching-data.js',root),'utf8'),ctx);
const common=['Aferin!','Çok güzel!','Bravo!','Süpersin!','Harikasın!','Mükemmel!','Muhteşem!','Ne güzel yaptın!','Böyle devam et!','İşte bu, başardın!','Çok iyi yaptın!','Başardın!','Çok başarılısın!','Harika bir cevap!','Çok dikkatliydin!','Tebrik ederim!','Şahane!','Çok güzel ilerliyorsun!','Çok güzel söyledin!','Doğru.','Kediyi eşle.','Kediyi göster.'];
const buddy=['Evet, buradayım!','Çok güzel gidiyorsun!','Oynamak ister misin?','Devam edelim mi?','Ben hep yanındayım.','Harikasın, böyle devam!','Bir oyun daha oynayalım mı?','Seninle oynamak çok güzel!','Ne oynayalım, sen söyle!','Bugün çok iyi çalışıyoruz!'];
const items=Object.values(ctx.window.ObjectMatchingData.items);const instructions=items.flatMap(item=>[`${item.accusative} eşle.`,`${item.accusative} göster.`]);
const activity=await activityPhrases(root,items);
const phrases=[...new Set(['Balığı eşle.','Balığı göster.','Diş macununu eşle.','Diş macununu göster.','Çileği eşle.','Çileği göster.','Kediyi eşle.','Kediyi göster.',...common,...instructions,...buddy,...activity.filter(text=>text.length<=110),...activity])];

const names={pofidik:'Pofidik Ayı',dila:'Dila Panda',kipir:'Kıpır Kunduz',mina:'Mina Tilki'};
const jobs=[];for(const [character,name]of Object.entries(names))for(const text of [`Selam! Ben ${name}. Beni seçmek ister misin?`,`Merhaba! Ben ${name}. Benimle oynamak ister misin?`,`Selam! Ben ${name}. Birlikte oyun oynayalım mı?`])jobs.push({character,text});
for(const text of phrases)for(const character of Object.keys(names))jobs.push({character,text});
await fs.writeFile(new URL('static-phrases.json',folder),JSON.stringify([...new Set(jobs.map(job=>job.text))]));
if(process.argv.includes('--catalog-only')){console.log('Sabit ses kataloğu hazır.');process.exit(0);}
const manifestFile=new URL('dist/assets/character-voices/ready/manifest.json',root);let manifest={};try{manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));}catch{}
const progressFile=new URL('progress.json',folder);const progress=async()=>fs.writeFile(progressFile,JSON.stringify({ready:Object.values(manifest).reduce((n,entries)=>n+Object.keys(entries).length,0),total:jobs.length}));await progress();
while(true){try{if((await(await fetch('http://127.0.0.1:4182/api/voice-status')).json()).ready)break;}catch{}await new Promise(resolve=>setTimeout(resolve,1000));}
const requested=process.argv.find(arg=>arg.startsWith('--items='))?.slice(8).split(',');
const selected=requested?new Set(items.filter(item=>requested.includes(item.id)).flatMap(item=>[`${item.accusative} eşle.`,`${item.accusative} göster.`])):null;
let total=0;for(const {text,character} of jobs){
if(selected&&!selected.has(text))continue;
manifest[character]??={};if(manifest[character][text])continue;
const response=await fetch('http://127.0.0.1:4182/api/voice',{method:'POST',headers:{Origin:'http://127.0.0.1:4180','Content-Type':'application/json'},body:JSON.stringify({character,text,background:true})});if(!response.ok)throw Error(`Ses üretilemedi: ${response.status}`);
const name=character+'-'+crypto.createHash('sha256').update(text).digest('hex').slice(0,20)+'.wav';await fs.writeFile(new URL(name,folder),Buffer.from(await response.arrayBuffer()));manifest[character][text]='./assets/character-voices/ready/'+name;
manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));await progress();total++;if(selected||total%25===0)console.log(`${character}: ${text} hazır (${total}).`);
}
console.log(requested?'Seçilen nesnelerin dört karakterde eşle/göster kayıtları hazır.':'Bütün nesne yönergeleri, pekiştirmeler ve arkadaş konuşmaları hazır.');
