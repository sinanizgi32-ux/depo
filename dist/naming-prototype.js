(()=>{
 const data=window.ObjectMatchingData,rules=window.NamingRules,$=id=>document.getElementById(id);
 const Recognition=window.LocalSpeechRecognition||window.SpeechRecognition||window.webkitSpeechRecognition;
 let run=0,rec=null,timer=null,tick=null,grace=null,phase='idle',examples=[],index=0,prompted=false,speechStarted=false,results=[],deadline=0,lastText='',custom={},paused=false,pendingReward=false,misses=0;
 const embedded=window.NamingActivityConfig;
 const notify=(type,extra={})=>{if(embedded)window.parent.postMessage({type,...extra},window.location.origin);};
 const rewards=['Aferin!','Harikasın!','Çok güzel söyledin!','Bravo!','Süpersin!'];
 $('category').innerHTML=data.categories.map(c=>`<option value="${c.id}">${c.title}</option>`).join('');$('category').value='animals';
 function items(){const c=data.categories.find(c=>c.id===$('category').value);$('item').innerHTML=c.items.map(i=>`<option value="${i.id}">${i.name}</option>`).join('');$('aliases').value='';}
 items();$('category').onchange=items;$('item').onchange=()=>{$('aliases').value='';};
 $('support').textContent=Recognition?'Türkçe konuşma tanıma bu tarayıcıda mevcut. Mikrofonu gerçek bir yanıtla deneyelim.':'Bu tarayıcıda konuşma tanıma bulunmuyor. Chrome veya Edge ile deneyin; uygulamacı kontrolü de kullanılabilir.';
 const current=()=>examples[index];
 function clear(){clearTimeout(timer);clearTimeout(grace);clearInterval(tick);timer=grace=tick=null;}
 function stopRec(){const old=rec;rec=null;if(old){old.onresult=old.onerror=old.onend=old.onstart=old.onspeechstart=old.onprocessing=null;try{old.abort();}catch{}}}
 function cancel(){run++;clear();stopRec();window.speechSynthesis?.cancel();}
 function message(text){$('status').textContent=text;}
 function say(text,done){stopRec();clear();phase='speaking';message(text);const token=run;if(!window.speechSynthesis){phase='review';message(text+' Seslendirme bu tarayıcıda bulunmuyor; yönergeyi okuyup Yeniden dinle düğmesine basın.');return;}const speech=new SpeechSynthesisUtterance(text);speech.lang='tr-TR';speech.onend=()=>{if(token===run&&!paused)done?.();};speech.onerror=()=>{if(token!==run)return;phase='review';message('Yönerge sesi tamamlanamadı. Yeniden dinle düğmesiyle devam edebilirsiniz.');};speechSynthesis.speak(speech);}
 function review(text){clear();stopRec();phase='review';$('clock').textContent='';message(text);}
 function listen(){
  clear();stopRec();if(paused||!current())return;if(!Recognition){review('Konuşma tanıma desteklenmiyor. Uygulamacı kontrolünü kullanın.');return;}
  phase='opening';speechStarted=false;lastText='';$('heard').textContent='';message('Mikrofon açılıyor…');const token=run;
  const instance=new Recognition();rec=instance;instance.lang='tr-TR';instance.continuous=false;instance.interimResults=true;instance.maxAlternatives=1;
  const valid=()=>token===run&&rec===instance&&!paused;
  instance.onprocessing=()=>{if(!valid())return;clear();phase='listening';message('Yanıt bilgisayarında çözümleniyor…');$('clock').textContent='Yanıt alındı';grace=setTimeout(()=>{if(valid())review('Yerel çözümleme uzadı. Yeniden deneyin.');},25000);};
  instance.onstart=()=>{
   if(!valid())return;clear();phase='listening';message(prompted?'Şimdi sen söyle. Dinliyorum…':'Dinliyorum… Bu ne?');
   if(!prompted){deadline=Date.now()+4000;$('clock').textContent='4 saniye';tick=setInterval(()=>{$('clock').textContent=Math.max(0,Math.ceil((deadline-Date.now())/1000))+' saniye';},100);timer=setTimeout(()=>{if(valid()&&!speechStarted)miss(false);},4000);}
   else{$('clock').textContent='İpucuyla yanıt';timer=setTimeout(()=>{if(valid()){if(!speechStarted)miss(false);else review('Yanıtı anlayamadım. Uygulamacı kontrolünden devam edebilirsiniz.');}},12000);}
  };
  instance.onspeechstart=()=>{
   if(!valid()||speechStarted)return;speechStarted=true;clear();$('clock').textContent='Yanıtın tamamlanmasını bekliyorum';
   grace=setTimeout(()=>{if(valid())review('Konuşma algılandı fakat sonuç netleşmedi. Lütfen yanıtı kontrol edin.');},10000);
  };
  instance.onresult=event=>{
   if(!valid())return;for(let i=event.resultIndex;i<event.results.length;i++){
    const result=event.results[i],text=result[0].transcript;lastText=rules.safeText(text);$('heard').textContent='Duyulan: '+lastText;
    if(!result.isFinal){instance.onspeechstart();continue;}
    const outcome=rules.judge(text,current().item,data.items,custom[current().item.id]||[]);
    if(outcome==='correct'){success(text,'otomatik');return;}
    if(['wrong','partial','inappropriate'].includes(outcome)){miss(outcome);return;}
    review('Söyleyiş net anlaşılmadı. Yanlış sayılmadı; uygulamacı kontrolünü kullanın.');return;
   }
  };
  instance.onerror=event=>{if(!valid())return;if(event.error==='no-speech'){miss(false);return;}review(event.error==='not-allowed'?'Mikrofon izni verilmedi. Tarayıcıdan izin verip Yeniden dinle düğmesine basın.':'Dinleme çalışmadı ('+event.error+'). Çocuk için hata kaydedilmedi. Yeniden deneyin veya uygulamacı kontrolünü kullanın.');};
  instance.onend=()=>{if(!valid())return;if(phase==='listening')review('Dinleme sona erdi; net bir yanıt alınamadı. Yeniden dinle veya uygulamacı kontrolünü kullanın.');};
  try{instance.start();timer=setTimeout(()=>{if(valid()&&phase==='opening')review('Mikrofon başlayamadı. İzni ve tarayıcı desteğini kontrol edin.');},10000);}catch{review('Mikrofon başlatılamadı. Yeniden deneyin.');}
 }
 function model(kind=false){if(!current()||phase==='reward'||paused)return;prompted=true;$('clock').textContent='Model ipucu';const text=kind?rules.correction(current().item,lastText,kind===true?'wrong':kind):`Bu ${current().item.name.toLocaleLowerCase('tr')}. Şimdi sen söyle: ${current().item.name.toLocaleLowerCase('tr')}.`;say(text,listen);}
 function advance(){phase='reward';const token=run;timer=setTimeout(()=>{if(token!==run||paused)return;pendingReward=false;index++;index<5?render():summary();},1000);}
 function miss(kind=true){
  if(!current()||phase==='reward'||phase==='speaking'||paused)return;
  misses++;
  if(misses<2){model(kind);return;}
  clear();stopRec();pendingReward=true;
  results.push({name:current().item.name,text:lastText||'Yanıt yok',result:'İki fırsatta tamamlayamadı',via:'düzeltme'});
  $('clock').textContent='İkinci düzeltme · Sonraki denemeye geçiyoruz';
  say(kind?rules.correction(current().item,lastText,kind===true?'wrong':kind,false):`Bu ${current().item.name.toLocaleLowerCase('tr')}.`,advance);
 }
 function success(text,via){
  if(!current()||!['listening','review'].includes(phase))return;
  pendingReward=true;const item=current().item;results.push({name:item.name,text,result:prompted?'İpucuyla doğru':'Bağımsız doğru',via});phase='reward';clear();stopRec();
  const reward=rewards[Math.floor(Math.random()*rewards.length)];say(reward,()=>{phase='reward';const token=run;timer=setTimeout(()=>{if(token!==run||paused)return;pendingReward=false;index++;if(index<5)render();else summary();},1000);});
 }
 function render(){cancel();paused=false;$('pause').textContent='Mola';phase='instruction';prompted=false;misses=0;lastText='';const t=current();$('trialCount').textContent=`Seviye ${$('level').value} · ${index+1} / 5`;$('picture').src=t.context?window.NamingScenes.image(t.item.id,index):data.image(t.item.id,t.variant);$('scene').classList.toggle('context',t.context);$('scene').style.backgroundImage='';$('clock').textContent='';$('heard').textContent='';say('Bu ne? Söyle.',()=>{$('method').value==='immediate'?model():listen();});}
 function start(){if(embedded)$('selection').textContent=data.items[$('item').value].name+' · Seviye '+$('level').value+' · '+($('method').value==='immediate'?'Eşzamanlı öğretim':'4 saniye bekleme süreli öğretim');notify('naming-start',{level:Number($('level').value)});cancel();custom[$('item').value]=$('aliases').value.split(',').map(s=>s.trim()).filter(Boolean);examples=rules.block(data,$('item').value,Number($('level').value));index=0;results=[];pendingReward=false;$('setup').hidden=true;$('work').hidden=false;$('summary').hidden=true;render();}
 function summary(){notify('naming-complete',{level:Number($('level').value),stats:{independent:results.filter(r=>r.result==='Bağımsız doğru').length,prompted:results.filter(r=>r.result==='İpucuyla doğru').length,incorrect:results.filter(r=>r.result==='İki fırsatta tamamlayamadı').length}});cancel();phase='idle';$('work').hidden=true;$('summary').hidden=false;$('next').hidden=Number($('level').value)===7;$('gameNote').hidden=true;$('totals').textContent=`${results.filter(r=>r.result==='Bağımsız doğru').length} bağımsız · ${results.filter(r=>r.result==='İpucuyla doğru').length} ipucuyla doğru`;$('resultRows').replaceChildren();for(const r of results){const tr=document.createElement('tr');for(const value of [r.name,r.text,r.result+' ('+r.via+')']){const td=document.createElement('td');td.textContent=value;tr.appendChild(td);}$('resultRows').appendChild(tr);}}
 $('start').onclick=window.LocalSpeechRecognition?async()=>{
  if($('start').dataset.opening==='true')return;
  $('start').dataset.opening='true';$('support').textContent=window.LocalMicrophone.available()?'Dinleme hazırlanıyor…':'İlk kullanım için mikrofon izni gerekiyor. Açılan pencerede izin verin.';
  try{
   if(!navigator.mediaDevices?.getUserMedia)throw new Error('secure-context');
   await window.LocalMicrophone.ensure();
   $('support').textContent='Mikrofon izni alındı. Dinleme hizmeti kontrol ediliyor…';
   const response=await fetch('/api/status');const info=await response.json();
   if(!info.ready){$('support').textContent='Mikrofon izni alındı. '+info.message;return;}
   $('support').textContent='Mikrofon izni alındı. Yerel dinleme hazır.';
   start();
  }catch(error){$('support').textContent=error.name==='NotAllowedError'?'Mikrofon izni reddedildi. Tarayıcının site izinlerinden mikrofonu açıp yeniden basın.':error.message==='secure-context'?'Mikrofon için güvenli bağlantı gerekiyor. Bu bilgisayarda localhost, telefonda HTTPS adresi kullanın.':'Mikrofon veya dinleme hizmeti açılamadı. Yeniden deneyebilirsiniz.';}
  finally{$('start').dataset.opening='false';}
 }:start;
 $('listen').onclick=()=>{if(phase==='speaking'||phase==='reward'||paused||!current())return;listen();};
 $('hint').onclick=()=>{if(phase==='speaking'||phase==='reward')return;model();};
 $('pause').onclick=()=>{if(!current())return;if(!paused){const reward=pendingReward;cancel();paused=true;phase=reward?'paused-reward':'paused';$('pause').textContent='Devam et';message('Mola. Mikrofon kapalı.');}else{paused=false;$('pause').textContent='Mola';if(phase==='paused-reward'){pendingReward=false;index++;index<5?render():summary();}else prompted?model():say('Bu ne? Söyle.',listen);}};
 $('stop').onclick=()=>{if(embedded){cancel();notify('naming-menu');return;}cancel();paused=false;phase='idle';$('work').hidden=true;$('setup').hidden=false;};
 $('manualCorrect').onclick=()=>{if(['review','listening'].includes(phase))rules.hasInappropriate(lastText)||lastText==='Uygun olmayan sözcük (gizlendi)'?miss('inappropriate'):success(lastText||'Uygulamacı onayı','uygulamacı');};
 $('manualWrong').onclick=()=>{if(['review','listening'].includes(phase))miss(true);};$('manualNone').onclick=()=>{if(['review','listening'].includes(phase))miss(false);};
 $('next').onclick=()=>{if(Number($('level').value)<7){$('level').value=String(Number($('level').value)+1);start();}};$('game').onclick=()=>{$('gameNote').hidden=false;};$('menu').onclick=()=>{if(embedded){cancel();notify('naming-menu');return;}cancel();$('summary').hidden=true;$('setup').hidden=false;};
 $('testButton').onclick=()=>{const item=data.items[$('item').value];const outcome=rules.judge($('testText').value,item,data.items,$('aliases').value.split(','));$('testResult').textContent={correct:'Kabul edildi',wrong:'Kabul edilmedi: nesnenin adına yeterince yakın değil',partial:'Yaklaştın: tam adı '+item.name,inappropriate:'Bu söylediğin sözcük uygun bir sözcük değil.',uncertain:'Net değil: uygulamacı kontrolü gerekir'}[outcome];};
 if(window.LocalSpeechRecognition){$('start').disabled=false;$('start').textContent='Çalışmayı başlat';const ready=async()=>{try{const response=await fetch('/api/status');const info=await response.json();if($('start').dataset.opening!=='true')$('support').textContent=info.message;if(info.ready&&embedded?.autoStart&&phase==='idle'&&$('summary').hidden&&window.LocalMicrophone.available()){embedded.autoStart=false;start();}if(!info.ready)setTimeout(ready,2000);}catch{$('support').textContent='Dinleme hizmetine ulaşılamadı. Düğmeden mikrofon iznini alıp yeniden deneyebilirsiniz.';}};ready();}
 if(embedded){const item=data.items[embedded.item]||data.items.cat;$('category').value=item.category;items();$('item').value=item.id;$('level').value=String(Math.min(7,Math.max(1,embedded.level)));$('method').value=embedded.method==='immediate'?'immediate':'wait';}
 if(embedded&&window.ResizeObserver){const main=document.querySelector('main');new ResizeObserver(()=>notify('naming-size',{height:Math.ceil(main.getBoundingClientRect().height+48)})).observe(main);}
 window.addEventListener('pagehide',()=>{if(embedded)embedded.autoStart=false;cancel();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&!$('work').hidden&&!paused)$('pause').click();});
})();
