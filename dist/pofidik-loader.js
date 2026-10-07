// Load the 3D engine only when the selected friend is actually needed.
(()=>{
 let pending, speaking=false;
 const clips=['breathe','nod_yes','shake_no','look_left','look_right','look_up','curious','ears','listen','bow','sway','stretch','blink','talk'];
 const needed=()=>[...document.querySelectorAll('[data-pofidik-viewer]')].some(el=>el.getClientRects().length&&(!el.closest('.avatar-card')||el.closest('.avatar-card').classList.contains('is-selected')));
 function load(){if(window.Pofidik3D!==proxy)return Promise.resolve(window.Pofidik3D);if(pending)return pending;pending=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='./pofidik-viewer.js';script.onload=()=>{const api=window.Pofidik3D;if(api===proxy){pending=null;reject(Error('3D engine unavailable'));return;}api.setSpeaking(speaking);api.refresh();resolve(api);};script.onerror=()=>{pending=null;script.remove();reject(Error('3D engine unavailable'));};document.head.appendChild(script);});return pending;}
 const proxy={availableAnimations:clips,refresh(){if(needed())load().catch(()=>{});},preload:()=>load().catch(()=>{}),async play(...args){if(!needed())return false;try{return(await load()).play(...args);}catch{return false;}},async react(...args){try{return(await load()).react(...args);}catch{return false;}},setSpeaking(value){speaking=!!value;}};
 window.Pofidik3D=proxy;
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))proxy.refresh();});document.querySelectorAll('[data-pofidik-viewer]').forEach(el=>observer.observe(el));
})();
