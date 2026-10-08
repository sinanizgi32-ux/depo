/* Curriculum follows renk-kavrami-son-3.docx. The truncated matching row 7
   continues the progression with three same-type cards before row 8. */
window.ColorTeachingData=(()=>{
 'use strict';
 const colors=[{id:'red',name:'Kırmızı',cue:'Kırmızıyı',hex:'#df292e',aliases:['kirmizi','kirmisi']},{id:'blue',name:'Mavi',cue:'Maviyi',hex:'#1469d4',aliases:['mavi','mabi']},{id:'yellow',name:'Sarı',cue:'Sarıyı',hex:'#f4cd20',aliases:['sari']},{id:'green',name:'Yeşil',cue:'Yeşili',hex:'#299443',aliases:['yesil','yesi']}];
 const stage=(title,count,kind,extra={})=>({title,count,kind,...extra});
 const stages={
  match:[stage('Aynı renk, aynı tip · birebir',1,'card'),stage('Aynı renk, farklı tip · birebir',1,'card',{varied:true}),stage('İki kart · aynı tip',2,'card'),stage('İki kart · farklı tip',2,'card',{varied:true}),stage('Üç kart · aynı tip',3,'card'),stage('Üç kart · farklı tip',3,'card',{varied:true}),stage('Üç gerçek nesne resmi',3,'object',{varied:true}),stage('Dört gerçek nesne resmi',4,'object',{varied:true}),stage('Karma renk ve nesneler',4,'object',{varied:true,mixed:true,blocks:1})],
  show:[stage('İki renk kartı · aynı tip',2,'card'),stage('İki renk kartı · farklı tip',2,'card',{varied:true}),stage('Üç gerçek nesne resmi',3,'object'),stage('Dört gerçek nesne resmi',4,'object'),stage('Karma renkler · üç nesne',3,'object',{mixed:true}),stage('Resmin içindeki rengi göster',4,'region'),stage('Resimde karma renkleri göster',4,'region',{mixed:true})],
  name:[stage('Farklı tip renk kartları',1,'card',{varied:true}),stage('Farklı çorapların rengini söyle',1,'sock'),stage('İki nesne · işaretlenenin rengi',2,'named',{objectBlocks:true}),stage('Üç nesne ve günlük ortam',3,'named',{objectBlocks:true,context:true}),stage('Resimde işaretlenen bölgenin rengi',1,'region'),stage('Resimde karma renkler',1,'region',{mixed:true}),stage('Üç nesne · karma renkler',3,'named',{mixed:true,objectBlocks:true})]
 };
 const shapeNames=['kare','yuvarlak','üçgen','dikdörtgen','yıldız'];
 const objects={sock:'çorap',book:'kitap',pencil:'kalem',wardrobe:'dolap',door:'kapı',car:'araba',notebook:'defter',apple:'elma',cherry:'kiraz',sharpener:'kalemtıraş',cake:'pasta',flower:'çiçek'};
 const banks={red:['car','pencil','notebook','apple','sharpener','cherry'],blue:['car','pencil','notebook','sharpener','cake','flower'],yellow:['car','pencil','notebook','sharpener','flower','cake'],green:['car','pencil','notebook','apple','sharpener','cake']};
 const names=['book','pencil','wardrobe','door'];
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const color=id=>colors.find(c=>c.id===id);
 const card=(c,type=0)=>({color:c,kind:'card',type:type%5,name:`${color(c).name.toLocaleLowerCase('tr')} ${shapeNames[type%5]} kart`});
 const object=(c,obj,variant=0)=>({color:c,kind:'object',object:obj,variant:variant%5,name:objects[obj],src:`./assets/colors/${obj}-${c}-${['sock','book','pencil','wardrobe','door'].includes(obj)?variant%5+1:1}.webp`});
 // Each image has its own anchors, measured inside its actual colored objects.
 const sceneAreas={
  ball:{red:[31,27],blue:[69,27],yellow:[31,65],green:[69,65]},
  cake:{red:[27,29],blue:[73,29],yellow:[27,64],green:[73,64]},
  flower:{red:[25,25],blue:[74,25],yellow:[29,68],green:[75,67]},
  eraser:{red:[26,21],blue:[73,21],yellow:[26,59],green:[73,59]},
  sign:{red:[27,25],blue:[73,25],yellow:[27,57],green:[73,57]},
  shelf:{red:[27,23],blue:[73,23],yellow:[27,64],green:[73,64]},
  child:{red:[50,10],blue:[48,46],yellow:[27,64],green:[57,78]},
  bird:{red:[39,21],blue:[57,42],yellow:[40,45],green:[65,76]},
  garden:{red:[27,20],blue:[75,23],yellow:[28,65],green:[77,67]},
  pencils:{red:[20,62],blue:[40,62],yellow:[60,62],green:[80,62]}
 };
 const scenes=[['ball','top'],['cake','pasta'],['flower','çiçek'],['eraser','silgi'],['sign','tabela'],['shelf','raf'],['child','giyinmiş çocuk'],['bird','kuş'],['garden','doğa resmi'],['pencils','kalemler']].map(([id,name])=>({id,name,src:`./assets/colors/scene-${id}.webp`,areas:sceneAreas[id]}));
 function region(c,n){const scene=scenes[n%scenes.length];return{color:c,kind:'region',name:scene.name,src:scene.src,scene,point:scene.areas[c]};}
 function course(mode,level){
  const s=stages[mode]?.[level-1];if(!s)throw Error('Invalid color stage');
  const mixedColors=[];for(let n=0;n<5;n++){const batch=shuffle(colors.map(c=>c.id));if(batch[0]===mixedColors.at(-1))[batch[0],batch[1]]=[batch[1],batch[0]];mixedColors.push(...batch);}
  const blocks=[];
  for(let ci=0;ci<(s.mixed?1:4);ci++)for(let oi=0;oi<(s.objectBlocks?4:s.mixed?(s.blocks||4):1);oi++){
   const blockIndex=blocks.length;
   let slot=Math.floor(Math.random()*s.count),oldSlot=slot,colorOrder=shuffle(colors.map(c=>c.id));
   const trials=Array.from({length:5},(_,n)=>{
    if(n&&n%2===0&&s.count>1){slot=(oldSlot+1+Math.floor(Math.random()*(s.count-1)))%s.count;oldSlot=slot;colorOrder=shuffle(colors.map(c=>c.id));}
    const c=s.mixed?mixedColors[(blockIndex*5+n)%20]:colors[ci].id;
    const otherColors=colorOrder.filter(x=>x!==c);
    let source,correct,others=[];
    if(s.kind==='card'){
     const type=mode==='show'&&!s.varied?0:n%5;
     source=card(c,type);correct=card(c,mode==='match'&&s.varied?type+1:type);
     others=otherColors.slice(0,s.count-1).map((x,i)=>card(x,s.varied?(mode==='match'&&s.count===2?type:type+i+2):type));
    }else if(s.kind==='sock'){source=correct=object(c,'sock',n);}
    else if(s.kind==='named'){
     source=correct=object(c,names[oi],n);
     others=shuffle(names.filter(x=>x!==names[oi])).slice(0,s.count-1).map((o,i)=>object(otherColors[i],o,n));
    }else if(s.kind==='region'){
     source=correct=region(c,blockIndex*5+n);
     others=otherColors.slice(0,s.count-1).map(x=>({...correct,color:x,point:correct.scene.areas[x]}));
    }else{
     const pool=mode==='show'?['car','pencil',c==='red'||c==='green'?'apple':'flower','notebook','cake']:banks[c];
     const obj=pool[n%pool.length];source=object(c,obj,n);
     const correctObj=mode==='match'?banks[c].find((o,i)=>o!==obj&&i===(n+1)%banks[c].length)||banks[c].find(o=>o!==obj):obj;
     correct=object(c,correctObj,n);
     const used=new Set([correctObj]);
     others=otherColors.slice(0,s.count-1).map((x,i)=>{const o=banks[x].find(y=>!used.has(y)&&y!==obj)||banks[x].find(y=>!used.has(y));used.add(o);return object(x,o,n+i);});
    }
    let options=[...others];options.splice(slot,0,correct);
    const room=s.context&&n===3?{src:`./assets/colors/room-${c}.webp`,object:source.object,point:{wardrobe:[28,28],door:[76,28],book:[27,69],pencil:[73,77]}[source.object]}:null;
    return{color:c,source,correct,options,slot,room};
   });
   blocks.push({color:s.mixed?null:colors[ci].id,object:s.objectBlocks?names[oi]:null,trials});
  }
  return blocks;
 }
 function judge(text,c){if(window.NamingRules.hasInappropriate(text))return'inappropriate';const words=window.NamingRules.normalize(text).split(' ').filter(t=>!['bu','renk','rengi','iste','bir'].includes(t));if(!words.length)return'uncertain';return words.every(word=>color(c).aliases.includes(word))?'correct':'wrong';}
 function correction(c,text,kind,retry=true){const end=retry?' Şimdi sen söyle.':'';const model=`Bu ${color(c).name.toLocaleLowerCase('tr')}.`;if(kind==='inappropriate')return'Bu söylediğin sözcük uygun bir sözcük değil. '+model+end;const safe=window.NamingRules.safeText(text).replace(/[.!?;:"“”]/g,'').trim();return(safe?`Hayır, bu ${safe} değil. `:'')+model+end;}
 function nextStep(mode,id,level,block=0){
  const list=stages[mode],s=list[level-1];
  const count=s.objectBlocks?4:s.mixed?(s.blocks||4):1;
  if(block+1<count)return{color:id,level,block:block+1};
  const levels=list.map((v,i)=>({s:v,level:i+1}));
  if(s.mixed){const next=levels.find(v=>v.s.mixed&&v.level>level);return next?{color:id,level:next.level,block:0}:null;}
  const next=levels.find(v=>!v.s.mixed&&v.level>level);
  if(next)return{color:id,level:next.level,block:0};
  return null;
 }
 return{colors,stages,color,course,judge,correction,scenes,nextStep};
})();
