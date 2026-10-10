(()=>{
 if(!window.speechSynthesis)return;
 const nativeCancel=speechSynthesis.cancel.bind(speechSynthesis),keys=['pofidik','kipir','dila','mina'];
 const praises=new Set(['Aferin!','Çok güzel!','Bravo!','Süpersin!','Harikasın!','Mükemmel!','Muhteşem!','Ne güzel yaptın!','Böyle devam et!','İşte bu, başardın!','Çok iyi yaptın!','Başardın!','Çok başarılısın!','Harika bir cevap!','Çok dikkatliydin!','Tebrik ederim!','Şahane!','Çok güzel ilerliyorsun!','Çok güzel söyledin!','Doğru.']);
 let token=0,player=null,controller=null,activeKey='pofidik',childName='',ready=false,checked=0,recordings={},parts={},manifestChecked=0,rewardCount=0,nextNamed=2+Math.floor(Math.random()*2);
 const names=new Map(),clips=new Map();
 try{const state=JSON.parse(localStorage.getItem('dijitalOzelEgitimStateV2')||'{}');activeKey=state.avatar||activeKey;childName=state.profile?.name?.trim().slice(0,60)||'';}catch{}
 const force=document.currentScript?.dataset.characterVoice;
 function owner(){try{if(parent!==window&&parent.CharacterVoice)return parent.CharacterVoice;}catch{}return window.CharacterVoice;}
 function key(u){const value=u.character||force||owner()?.key()||activeKey;return keys.includes(value)?value:'pofidik';}
 function stop(){token++;controller?.abort();controller=null;if(player){player.pause();player.removeAttribute('src');player.load();player=null;}nativeCancel();}
 async function available(){if(Date.now()-checked<1500)return ready;checked=Date.now();try{const r=await fetch('http://127.0.0.1:4182/api/voice-status',{signal:AbortSignal.timeout(1500)});ready=(await r.json()).ready===true;}catch{ready=false;}return ready;}
 async function refresh(){if(Date.now()-manifestChecked<3000)return;manifestChecked=Date.now();await Promise.all([['manifest.json',v=>recordings=v],['greeting-parts.json',v=>parts=v]].map(async([file,accept])=>{try{const r=await fetch(new URL('./assets/character-voices/ready/'+file,location.href),{cache:'no-cache'});if(r.ok)accept(await r.json());}catch{}}));}
 async function prepared(k,text){await refresh();const bank=recordings[k]||{};if(bank[text])return{text,url:bank[text]};const choices=Object.keys(bank).filter(phrase=>/^(Selam!|Merhaba!) Ben /.test(text)?/^(Selam!|Merhaba!) Ben /.test(phrase):praises.has(text)&&praises.has(phrase));if(choices.length){const selected=choices[Math.floor(Math.random()*choices.length)];return{text:selected,url:bank[selected]};}return null;}
 async function synth(k,text,signal,background=false){const cacheKey=k+'|'+text,root=owner();if(root!==window.CharacterVoice){const shared=root.cached(k,text);if(shared)return shared;}if(clips.has(cacheKey))return clips.get(cacheKey);if(!await available())throw Error('Ses hizmeti hazır değil');const response=await fetch('http://127.0.0.1:4182/api/voice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({character:k,text,background}),signal});if(!response.ok)throw Error('Ses üretilemedi');const url=URL.createObjectURL(await response.blob());clips.set(cacheKey,url);if(clips.size>100){const first=clips.keys().next().value;if(![...names.values()].some(entry=>entry.url===clips.get(first))){URL.revokeObjectURL(clips.get(first));clips.delete(first);}}return url;}
 const warming=new Set();
 async function preload(texts,k=key({})){const root=owner();if(root!==window.CharacterVoice)return root.preload(texts,k);for(const text of new Set(texts)){const id=k+'|'+text;if(warming.has(id)||clips.has(id))continue;warming.add(id);try{if(!await prepared(k,text))await synth(k,text,undefined,true);}catch{}finally{warming.delete(id);}}}
 function warmPage(){const D=window.OppositeTeachingData;if(D)preload([D.instruction('match'),D.instruction('show'),D.question]);else if(window.ColorTeachingData)preload(['Kırmızıyı eşle.','Kırmızıyı göster.','Maviyi eşle.','Maviyi göster.','Sarıyı eşle.','Sarıyı göster.','Yeşili eşle.','Yeşili göster.','Bu hangi renk? Söyle.']);else if(window.LengthTeachingData)preload(['Uzun olanı eşle.','Uzun olanı göster.','Kısa olanı eşle.','Kısa olanı göster.','İşaretli nesne uzun mu, kısa mı? Söyle.']);else if(window.AgeTeachingData)preload(['Genç olanı eşle.','Genç olanı göster.','Yaşlı olanı eşle.','Yaşlı olanı göster.','İşaretli kişi genç mi, yaşlı mı? Söyle.']);else if(window.NamingActivityConfig)preload(['Bu ne? Söyle.']);}
 function prepareName(k=activeKey){const root=owner();if(root!==window.CharacterVoice)return root.prepareName(k);if(!childName)return Promise.resolve(null);const value=childName,cacheKey=k+'|'+value;let entry=names.get(cacheKey);if(!entry){entry={url:null,promise:null};entry.promise=(async()=>{for(let attempt=0;attempt<15;attempt++){try{entry.url=await synth(k,value+'.',undefined,true);return entry.url;}catch{await new Promise(resolve=>setTimeout(resolve,1500));}}return null;})();names.set(cacheKey,entry);}return entry.promise;}
 function nameReady(k){const root=owner();if(root!==window.CharacterVoice)return root.nameReady(k);return names.get(k+'|'+childName)?.url||null;}
 function shouldName(){const root=owner();if(root!==window.CharacterVoice)return root.shouldName();rewardCount++;if(rewardCount<nextNamed)return false;nextNamed=rewardCount+2+Math.floor(Math.random()*2);return !!childName;}
 async function speak(u){stop();const current=token,k=key(u),text=u.text||'',reference=text.replace(/[.,!]/g,'').toLocaleLowerCase('tr').trim()==='selam ben senin yeni oyun arkadaşın',greeting=/^(Selam!|Merhaba!) Ben /.test(text);let sequence=[];
  try{
   if(reference)sequence=[new URL(`./assets/character-voices/${k}-reference.wav`,location.href).href];
   else{const recording=await prepared(k,text);if(recording)sequence=[new URL(recording.url,location.href).href];else{controller=new AbortController();sequence=[await synth(k,text,controller.signal)];}
    if(greeting&&owner().name()){const split=parts[k]?.[recording?.text];const name=await prepareName(k);if(name&&split)sequence=[new URL(split[0],location.href).href,name,new URL(split[1],location.href).href];}
    else if(praises.has(text)&&shouldName()){const name=nameReady(k);if(name)sequence.push(name);else prepareName(k);}
   }
   if(current!==token)return;let index=0,started=false;
   function next(){if(current!==token)return;if(index===sequence.length){player=null;u.onend?.({type:'end',utterance:u});return;}player=new Audio(sequence[index++]);player.onplaying=()=>{if(current===token&&!started){started=true;u.onstart?.({type:'start',utterance:u});}};player.onended=next;player.onerror=()=>fail();player.play().catch(fail);}
   function fail(){if(current===token){player=null;u.onerror?.({type:'error',error:'character-voice-unavailable',utterance:u});}}
   next();
  }catch{if(current===token)u.onerror?.({type:'error',error:'character-voice-unavailable',utterance:u});}
 }
 speechSynthesis.speak=speak;speechSynthesis.cancel=stop;
 window.CharacterVoice={key:()=>activeKey,name:()=>childName,prepareName,nameReady,shouldName,available,preload,cached:(k,text)=>clips.get(k+'|'+text),set:k=>{if(keys.includes(k)){if(k!==activeKey)stop();activeKey=k;prepareName(k);}},setName:value=>{const clean=String(value||'').trim().slice(0,60);if(clean!==childName){stop();childName=clean;names.clear();rewardCount=0;nextNamed=2+Math.floor(Math.random()*2);}keys.forEach(k=>prepareName(k));}};
 if(parent===window&&childName)prepareName(activeKey);
 addEventListener('DOMContentLoaded',warmPage);
 addEventListener('pagehide',()=>{stop();for(const url of clips.values())URL.revokeObjectURL(url);clips.clear();names.clear();});
})();
