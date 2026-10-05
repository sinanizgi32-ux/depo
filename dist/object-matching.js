window.ObjectMatching = (() => {
  const data=window.ObjectMatchingData;
  function create({state,speak,praise,finishBlock}) {
    let run=0,timer,busy=false,selected=false,completed=false,pending=false,gesture=null,ignoreClick=false,current;
    const el=id=>document.getElementById(id);
    const active=()=>state.screen==='activity'&&state.skill==='object-match'&&el('pauseModal').hidden;
    const say=(text,done)=>{const token=run;speak(state.avatar,text,()=>{if(token===run&&active())done?.();});};
    const img=(id,variant)=>`<img src="${data.image(id,variant)}" alt="${data.items[id].name}" draggable="false">`;
    function controls(disabled){el('objectSource').disabled=disabled;el('objectTargets').querySelectorAll('button').forEach(button=>button.disabled=disabled);}
    function stop(){run++;clearTimeout(timer);gesture=null;busy=false;selected=false;}
    function instruction(){busy=true;controls(true);say(`${current.item.accusative} eşle.`,()=>{busy=false;controls(false);if(state.method==='immediate')hint();else timer=setTimeout(hint,4000);});}
    function render(){
      stop();completed=false;pending=false;ignoreClick=false;state.hadPrompt=false;state.attempts=0;
      current=data.trial(state.matchItem,state.matchLevel,state.trial);
      el('gameTitle').textContent=`${current.item.accusative} eşle`;
      document.querySelector('.game-toolbar .step-label').textContent=`Bilişsel beceriler · Nesne eşleme · Seviye ${state.matchLevel}`;
      el('trialLabel').textContent=`${state.trial+1} / 5`;el('progressFill').style.width=`${(state.trial+1)*20}%`;
      el('objectInstruction').textContent=`${current.item.accusative} eşle.`;
      el('objectRoute').hidden=true;el('objectRoute').textContent='↑ Gösterilen resme götür';
      el('feedback').textContent='';el('feedback').className='feedback';
      const options=[...current.options];for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
      const targets=el('objectTargets');targets.innerHTML='';
      options.forEach(id=>{const button=document.createElement('button');button.type='button';button.className='object-target';button.dataset.object=id;button.setAttribute('aria-label',`${data.items[id].name} eşleme yeri`);button.innerHTML=img(id,current.target);button.addEventListener('click',()=>{if(selected)answer(id);});targets.appendChild(button);});
      const source=el('objectSource');source.className='object-source';source.style.transform='';source.hidden=false;source.innerHTML=img(current.item.id,current.source);source.setAttribute('aria-label',`${current.item.name} kartını seç ve eşleme yerine götür`);
      instruction();
    }
    function hint(wrong=false){
      if(!active()||completed)return;clearTimeout(timer);state.hadPrompt=true;busy=true;controls(true);
      el('objectSource').classList.add('is-hint');el('objectRoute').hidden=false;
      el('objectTargets').querySelectorAll('button').forEach(button=>button.classList.toggle('is-hint',button.dataset.object===current.item.id));
      const text=`${wrong?'Bu eşleşme olmadı. ':''}Bu ${current.item.name.toLocaleLowerCase('tr')}. Yukarıda da ${current.item.name.toLocaleLowerCase('tr')} var. Alttaki resmi gösterilen resmin üstüne götür. ${current.item.accusative} eşle.`;
      el('feedback').textContent=text;el('feedback').className='feedback hint-feedback';
      say(text,()=>{busy=false;controls(false);});
    }
    function advance(){
      clearTimeout(timer);const token=run;
      timer=setTimeout(()=>{if(token!==run||!active())return;pending=false;state.trial++;if(state.trial<5)render();else finishBlock();},1000);
    }
    function answer(id){
      if(!active()||busy||completed)return;
      clearTimeout(timer);selected=false;el('objectSource').classList.remove('is-selected');
      if(id!==current.item.id){state.attempts++;if(state.attempts===1)state.stats.incorrect++;hint(true);return;}
      completed=true;pending=true;busy=true;controls(true);
      if(state.hadPrompt||state.attempts)state.stats.prompted++;else state.stats.independent++;
      el('objectSource').hidden=true;el('objectRoute').hidden=true;
      el('objectTargets').querySelectorAll('button').forEach(button=>{button.classList.remove('is-hint');if(button.dataset.object===id){button.classList.add('is-correct');button.insertAdjacentHTML('beforeend','<span class="object-match-done">Eşleşti ✓</span>');}});
      const reward=praise();el('feedback').textContent=reward;el('feedback').className='feedback good';say(reward,advance);
    }
    function rearm(){if(active()&&!busy&&!completed&&!state.hadPrompt&&state.method==='wait'){clearTimeout(timer);timer=setTimeout(hint,4000);}}
    function restoreDrag(){const source=el('objectSource');source.style.transform='';source.classList.remove('is-dragging');}
    const source=el('objectSource');
    source.addEventListener('click',()=>{if(ignoreClick){ignoreClick=false;return;}if(!active()||busy||completed)return;selected=true;source.classList.add('is-selected');});
    source.addEventListener('pointerdown',event=>{if(!active()||busy||completed||event.button>0)return;clearTimeout(timer);source.setPointerCapture(event.pointerId);gesture={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false,run};});
    source.addEventListener('pointermove',event=>{if(!gesture||gesture.id!==event.pointerId)return;const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;if(Math.hypot(dx,dy)>10)gesture.moved=true;if(gesture.moved){source.classList.add('is-dragging');source.style.transform=`translate(${dx}px,${dy}px)`;}});
    source.addEventListener('pointerup',event=>{if(!gesture||gesture.id!==event.pointerId)return;const drag=gesture;gesture=null;restoreDrag();if(source.hasPointerCapture(event.pointerId))source.releasePointerCapture(event.pointerId);if(drag.run!==run)return;if(drag.moved){ignoreClick=true;setTimeout(()=>ignoreClick=false,0);const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.object-target');if(target)answer(target.dataset.object);}rearm();});
    source.addEventListener('pointercancel',()=>{gesture=null;restoreDrag();rearm();});
    function pause(){clearTimeout(timer);run++;gesture=null;restoreDrag();}
    function resume(){if(!active())return;if(pending){busy=true;say(el('feedback').textContent||praise(),advance);}else if(state.hadPrompt||state.method==='immediate')hint();else instruction();}
    return {render,hint,stop,pause,resume,answer};
  }
  return {create};
})();
