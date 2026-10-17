(()=>{
 if(!window.speechSynthesis)return;
 const nativeCancel=speechSynthesis.cancel.bind(speechSynthesis),keys=['pofidik','kipir','dila','mina','narrator'];
 const praises=new Set(['Aferin!','Çok güzel!','Bravo!','Süpersin!','Harikasın!','Mükemmel!','Muhteşem!','Ne güzel yaptın!','Böyle devam et!','İşte bu, başardın!','Çok iyi yaptın!','Başardın!','Çok başarılısın!','Harika bir cevap!','Çok dikkatliydin!','Tebrik ederim!','Şahane!','Çok güzel ilerliyorsun!','Çok güzel söyledin!','Doğru.']);
 let token=0,player=null,controller=null,activeKey='pofidik',childName='',ready=false,checked=0,recordings={},parts={},manifestChecked=0,rewardCount=0,nextNamed=2+Math.floor(Math.random()*2);
 const audioElement=new Audio();audioElement.preload='auto';
 // Reuse the element unlocked by the chooser gesture, including later hint sentences.
 addEventListener('pointerdown',()=>{if(player||audioElement.src)return;audioElement.src='data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQIAAACAgA==';audioElement.play().catch(()=>{});},{capture:true});
 const names=new Map(),namedRewards=new Map(),clips=new Map();let privateController=new AbortController(),namedFront=Math.random()<.5;let manifestPending=null,statusPending=null,recordingIndex={},quality={};
 try{const state=JSON.parse(localStorage.getItem('dijitalOzelEgitimStateV2')||'{}');activeKey=state.avatar||activeKey;childName=state.profile?.name?.trim().slice(0,60)||'';}catch{}
 const force=document.currentScript?.dataset.characterVoice;
 function owner(){try{if(parent!==window&&parent.CharacterVoice)return parent.CharacterVoice;}catch{}return window.CharacterVoice;}
 function key(u){const value=u.voiceRole==='narrator'?'narrator':u.character||force||owner()?.key()||activeKey;return keys.includes(value)?value:'pofidik';}
 function stop(){token++;controller?.abort();controller=null;if(player){player.pause();player.removeAttribute('src');player.load();player=null;}nativeCancel();}
 async function available(){if(!['127.0.0.1','localhost'].includes(location.hostname))return false;if(statusPending)return statusPending;if(Date.now()-checked<1500)return ready;statusPending=(async()=>{try{const r=await fetch('http://127.0.0.1:4182/api/voice-status',{signal:AbortSignal.timeout(1500)});ready=(await r.json()).ready===true;}catch{ready=false;}checked=Date.now();return ready;})();try{return await statusPending;}finally{statusPending=null;}}
 const canonical=text=>window.VoiceText?.canonical(text)||text;
 const allowed=(k,text)=>!praises.has(text)||!quality[k]||quality[k].includes(text);
 const recorded=(k,text)=>allowed(k,text)?recordings[k]?.[text]||recordingIndex[k]?.get(canonical(text)):null;
 async function refresh(){if(manifestPending)return manifestPending;if(Date.now()-manifestChecked<3000)return;manifestPending=Promise.all([['quality.json',v=>quality=v],['manifest.json',v=>{recordings=v;recordingIndex=Object.fromEntries(Object.entries(v).map(([k,bank])=>[k,new Map(Object.entries(bank).map(([text,url])=>[canonical(text),url]))]));}],['greeting-parts.json',v=>parts=v]].map(async([file,accept])=>{try{const r=await fetch(new URL('./assets/character-voices/ready/'+file,location.href),{cache:'no-cache',signal:AbortSignal.timeout(10000)});if(r.ok)accept(await r.json());}catch{}}));try{await manifestPending;manifestChecked=Date.now();}finally{manifestPending=null;}}
 function sentences(text){return window.VoiceText?.units(text)||[text];}
 function quickCorrection(text,k=key({})){
  const root=owner();if(root!==window.CharacterVoice&&root.quickCorrection)return root.quickCorrection(text,k);
  const units=sentences(text);
  if(units.length>1&&/^Hayır, (?:bu )?.+ değil\.$/i.test(units[0])&&!root.cached(k,text)&&!recorded(k,text)&&!root.cached(k,units[0])&&!recorded(k,units[0]))return units.slice(1).join(' ');
  return text;
 }
 async function prepared(k,text){const shared=owner()?.cached(k,text);if(shared)return{text,url:shared};await refresh();const bank=recordings[k]||{},direct=recorded(k,text);if(direct)return{text,url:direct};const segments=sentences(text),urls=segments.map(part=>owner()?.cached(k,part)||recorded(k,part));if(segments.length>1&&urls.every(Boolean))return{text,url:urls[0],urls};const choices=Object.keys(bank).filter(phrase=>allowed(k,phrase)).filter(phrase=>/^(Selam!|Merhaba!) Ben /.test(text)?/^(Selam!|Merhaba!) Ben /.test(phrase):praises.has(text)&&praises.has(phrase));if(choices.length){const selected=choices[Math.floor(Math.random()*choices.length)];return{text:selected,url:bank[selected]};}return null;}
 async function synth(k,text,signal,background=false){const cacheKey=k+'|'+canonical(text),root=owner();if(root!==window.CharacterVoice){if(root.produce)return root.produce(k,text,signal,background);const shared=root.cached(k,text);if(shared)return shared;}if(clips.has(cacheKey))return clips.get(cacheKey);if(!await available())throw Error('Hazır ses kaydı bulunamadı');const response=await fetch('http://127.0.0.1:4182/api/voice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({character:k,text,background}),signal});if(!response.ok)throw Error('Ses üretilemedi');const blob=await response.blob();if(clips.has(cacheKey))return clips.get(cacheKey);const url=URL.createObjectURL(blob);clips.set(cacheKey,url);return url;}
 async function warmRecording(k,text,recording,signal){
  const urls=recording.urls||[recording.url],texts=recording.urls?sentences(text):[recording.text];
  for(let i=0;i<urls.length;i++){const id=k+'|'+canonical(texts[i]);if(clips.has(id))continue;if(signal.aborted)return false;
   const url=new URL(urls[i],location.href).href;if(url.startsWith('blob:')){clips.set(id,url);continue;}
   const response=await fetch(url,{signal,cache:'force-cache'});if(!response.ok)throw Error('Hazır ses yüklenemedi');const blob=await response.blob();if(signal.aborted)return false;if(!clips.has(id))clips.set(id,URL.createObjectURL(blob));
  }return true;
 }
 const warming=new Set();let cueWarm=null,backgroundController=new AbortController();
 function cancelPreparation(){const root=owner();if(root!==window.CharacterVoice)return root.cancelPreparation?.();backgroundController.abort();backgroundController=new AbortController();}
 async function prepareCue(text,k=key({})){
  const root=owner();if(root!==window.CharacterVoice)return root.prepareCue?.(text,k)||root.preload([text],k);
  k=keys.includes(k)?k:key({});const id=k+'|'+canonical(text);
  if(cueWarm?.id===id)return cueWarm.promise;
  cueWarm?.controller.abort();const entry={id,controller:new AbortController(),promise:null};cueWarm=entry;
  entry.promise=(async()=>{try{const recording=await prepared(k,text);if(recording)return await warmRecording(k,text,recording,entry.controller.signal);if(entry.controller.signal.aborted)return false;await synth(k,text,entry.controller.signal,false);return true;}catch{return false;}})().then(ok=>{if(!ok&&cueWarm===entry)cueWarm=null;return ok;});
  return entry.promise;
 }
 async function prepareLesson(texts,k=key({}),valid=()=>true){
  k=keys.includes(k)?k:key({});const root=owner();if(root!==window.CharacterVoice)return root.prepareLesson(texts,k,valid);
  // Metadata is bounded; neither audio downloads nor model generation block opening.
  await Promise.race([refresh(),new Promise(resolve=>setTimeout(resolve,500))]);
  document.getElementById('lessonAudioPreparation')?.remove();if(!valid())return false;
  cancelPreparation();
  const unique=[...new Set(texts.filter(Boolean))],bank=recordings[k]||{},hasPraise=Object.keys(bank).some(t=>praises.has(t));
  const missing=unique.filter(text=>!clips.has(k+'|'+canonical(text))&&!recorded(k,text)&&!(praises.has(text)&&hasPraise));
  void preload(unique,k);
  const keep=new Set(unique.flatMap(text=>[text,...sentences(text)]).map(text=>k+'|'+canonical(text)));for(const [cacheKey,url]of clips){if(clips.size<=256)break;if(!keep.has(cacheKey)&&![...names.values(),...namedRewards.values()].some(entry=>entry.url===url)){URL.revokeObjectURL(url);clips.delete(cacheKey);}}
  return valid();
 }
 async function preload(texts,k=key({})){k=keys.includes(k)?k:key({});const root=owner();if(root!==window.CharacterVoice)return root.preload(texts,k);const signal=backgroundController.signal,missing=new Set();
  // Download every available sentence before starting any slow model job.
  for(const text of new Set(texts)){if(signal.aborted)return;const recording=await prepared(k,text);if(recording){try{await warmRecording(k,text,recording,signal);}catch{}continue;}for(const unit of sentences(text)){if(signal.aborted)return;const found=await prepared(k,unit);if(found){try{await warmRecording(k,unit,found,signal);}catch{}}else missing.add(unit);}}
  for(const unit of missing){if(signal.aborted)return;const id=k+'|'+canonical(unit);if(warming.has(id)||clips.has(id))continue;warming.add(id);try{if(!await prepared(k,unit)&&!signal.aborted)await synth(k,unit,signal,true);}catch{}finally{warming.delete(id);}}
 }
 function warmPage(){const D=window.OppositeTeachingData;const mode=new URLSearchParams(location.search).get('mode')||'match';if(D){void prepareCue(mode==='name'?D.question:D.instruction(mode));}else if(window.ColorTeachingData)preload(['Kırmızıyı eşle.','Kırmızıyı göster.','Maviyi eşle.','Maviyi göster.','Sarıyı eşle.','Sarıyı göster.','Yeşili eşle.','Yeşili göster.','Bu hangi renk? Söyle.']);else if(window.LengthTeachingData)preload(['Uzun olanı eşle.','Uzun olanı göster.','Kısa olanı eşle.','Kısa olanı göster.','İşaretli nesne uzun mu, kısa mı? Söyle.']);else if(window.AgeTeachingData)preload(['Genç olanı eşle.','Genç olanı göster.','Yaşlı olanı eşle.','Yaşlı olanı göster.','İşaretli kişi genç mi, yaşlı mı? Söyle.']);else if(window.NamingActivityConfig)preload(['Bu ne? Söyle.']);}
 function namedText(praise,name,front){const stem=praise.replace(/[.!?]+$/,'');return front?`${name} ${stem.toLocaleLowerCase('tr')}!`:`${stem} ${name}!`;}
 async function prepareRewards(k=activeKey){if(!['127.0.0.1','localhost'].includes(location.hostname))return;const root=owner();if(root!==window.CharacterVoice)return root.prepareRewards?.(k);if(!childName)return;const name=childName,signal=privateController.signal;for(const praise of ['Aferin!','Harikasın!','Süpersin!'])for(const front of [true,false]){if(signal.aborted||name!==childName)return;const text=namedText(praise,name,front),id=k+'|'+text;if(namedRewards.has(id))continue;const entry={character:k,name,praise,front,url:null};namedRewards.set(id,entry);try{entry.url=await synth(k,text,signal,true);}catch{namedRewards.delete(id);}}}
 function readyNamedReward(k,praise){const options=[...namedRewards.values()].filter(e=>e.character===k&&e.name===childName&&e.url);if(!options.length)return null;const preferred=options.filter(e=>e.front===namedFront),same=preferred.filter(e=>e.praise===praise),pool=same.length?same:preferred.length?preferred:options;const chosen=pool[Math.floor(Math.random()*pool.length)];namedFront=!chosen.front;return chosen;}
 function prepareName(k=activeKey){if(!['127.0.0.1','localhost'].includes(location.hostname))return Promise.resolve(null);const root=owner();if(root!==window.CharacterVoice)return root.prepareName(k);if(!childName)return Promise.resolve(null);void prepareRewards(k);const value=childName,signal=privateController.signal,cacheKey=k+'|'+value;let entry=names.get(cacheKey);if(!entry){entry={url:null,promise:null};entry.promise=(async()=>{for(let attempt=0;attempt<15&&!signal.aborted;attempt++){try{entry.url=await synth(k,value+'.',signal,true);return entry.url;}catch{if(signal.aborted)break;await new Promise(resolve=>setTimeout(resolve,1500));}}return null;})().then(url=>{if(!url&&names.get(cacheKey)===entry)names.delete(cacheKey);return url;});names.set(cacheKey,entry);}return entry.promise;}
 function nameReady(k){const root=owner();if(root!==window.CharacterVoice)return root.nameReady(k);return names.get(k+'|'+childName)?.url||null;}
 function shouldName(){const root=owner();if(root!==window.CharacterVoice)return root.shouldName();rewardCount++;if(rewardCount<nextNamed)return false;nextNamed=rewardCount+2+Math.floor(Math.random()*2);return !!childName;}
 async function speak(u){stop();const current=token,k=key(u),text=(u.text||'').replace(/^Selam[, .!]*ben senin yeni oyun arkadaşın[.!]?$/i,`Selam! Ben ${{pofidik:'Pofidik Ayı',kipir:'Kıpır Kunduz',dila:'Dila Panda',mina:'Mina Tilki'}[k]||'oyun arkadaşın'}. Beni seçmek ister misin?`),greeting=/^(Selam!|Merhaba!) Ben /.test(text);let sequence=[];
  try{
   { const recording=await prepared(k,text);if(current!==token)return;if(recording)sequence=(recording.urls||[recording.url]).map(url=>new URL(url,location.href).href);else{controller=new AbortController();const signal=controller.signal,segments=sentences(text),urls=segments.map(part=>owner().cached(k,part)||recorded(k,part));sequence=segments.map((part,index)=>urls[index]?new URL(urls[index],location.href).href:synth(k,part,signal).then(url=>({url}),error=>({error})));}
    if(k!=='narrator'&&greeting&&owner().name()){const split=parts[k]?.[recording?.text];const name=nameReady(k);if(name&&split)sequence=[new URL(split[0],location.href).href,name,new URL(split[1],location.href).href];else void prepareName(k);}
    else if(k!=='narrator'&&praises.has(text)&&shouldName()){const named=readyNamedReward(k,text);if(named)sequence=[named.url];else void prepareRewards(k);}
   }
   if(current!==token)return;let index=0,started=false;
   async function next(){if(current!==token)return;if(index===sequence.length){player=null;u.onend?.({type:'end',utterance:u});return;}const entry=await sequence[index++];if(current!==token)return;if(entry?.error){fail();return;}const url=typeof entry==='string'?entry:entry.url;player=audioElement;player.src=url;player.onplaying=()=>{if(current===token&&!started){started=true;u.onstart?.({type:'start',utterance:u});}};player.onended=next;player.onerror=()=>fail();player.play().catch(fail);}
   function fail(){if(current===token){player=null;u.onerror?.({type:'error',error:'character-voice-unavailable',utterance:u});}}
   next();
  }catch{if(current===token)u.onerror?.({type:'error',error:'character-voice-unavailable',utterance:u});}
 }
 speechSynthesis.speak=speak;speechSynthesis.cancel=stop;
 window.CharacterVoice={key:()=>activeKey,name:()=>childName,prepareName,prepareRewards,nameReady,shouldName,available,preload,prepareCue,prepareLesson,cancelPreparation,quickCorrection,ready:(text,k=key({}))=>{const root=owner();if(root!==window.CharacterVoice&&root.ready)return root.ready(text,k);return Boolean(clips.get(k+'|'+canonical(text))||recorded(k,text)||sentences(text).every(t=>clips.get(k+'|'+canonical(t))||recorded(k,t)));},produce:synth,cached:(k,text)=>clips.get(k+'|'+canonical(text)),set:k=>{if(keys.includes(k)){if(k!==activeKey){stop();cancelPreparation();privateController.abort();privateController=new AbortController();cueWarm?.controller.abort();cueWarm=null;}activeKey=k;prepareName(k);}},setName:value=>{const clean=String(value||'').trim().slice(0,60);if(clean!==childName){stop();privateController.abort();privateController=new AbortController();childName=clean;names.clear();namedRewards.clear();rewardCount=0;nextNamed=2+Math.floor(Math.random()*2);}prepareName(activeKey);}};
 window.NarratorVoice={speak:(text,onend,onerror)=>{const u=new SpeechSynthesisUtterance(text);u.voiceRole='narrator';u.lang='tr-TR';u.onend=onend;u.onerror=onerror;speechSynthesis.speak(u);},preload:texts=>preload(texts,'narrator'),ready:text=>window.CharacterVoice.ready(text,'narrator')};
 if(parent===window&&childName)prepareName(activeKey);
 addEventListener('DOMContentLoaded',warmPage);
 addEventListener('pagehide',()=>{stop();cancelPreparation();privateController.abort();cueWarm?.controller.abort();for(const url of clips.values())URL.revokeObjectURL(url);clips.clear();names.clear();});
})();
