window.NamingRules=(()=>{
 const normalize=s=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
 const foreign=new Set(['cat','dog','bird','fish','rabbit','cow','sheep','horse','chicken','duck','skirt','car','banana','apple','table','chair','rose','flower']);
 const aliases={cat:['kedi','edi','kei','gedi','keti'],dog:['kopek','kope'],banana:['muz'],car:['araba','arba'],skirt:['etek','ete']};
 const partials={scissors:['makas'],toothbrush:['firca'],toothpaste:['macun'],pencil:['kalem'],crayon:['kalem'],doll:['bebek'],teddybear:['ayi'],toycar:['araba'],toytrain:['tren'],schoolbag:['canta'],pine:['agac'],appletree:['agac'],playdough:['hamur']};
 const inappropriate=/^(?:pic|pici|picsin|picler\w*|amcik\w*|yavsak\w*|serefsiz\w*|salak\w*|aptal\w*|gerizekali\w*|ahmak\w*|embesil\w*|pislik\w*|pezevenk\w*|orospu\w*|siktir\w*|sik|sikerim|sikeyim|siktim|siktig\w*|yarr?ak\w*|amiyarak|amyarak|am|ami|amina|aminakoy\w*|amk|aq|got|gotu|gotun|gotunu|gotum|gota|gotler\w*|ibne\w*)$/;
 const hasInappropriate=text=>{const clean=normalize(text);return clean.split(' ').some(t=>inappropriate.test(t))||/\bgeri zekali\b/.test(clean);};
 const safeText=text=>hasInappropriate(text)?'Uygun olmayan sözcük (gizlendi)':String(text).replace(/[\u0000-\u001f]/g,' ').slice(0,120);
 function correction(item,text,kind='wrong',retry=true){
  const name=item.name.toLocaleLowerCase('tr'),ending=retry?' Şimdi sen söyle.':'';
  if(kind==='inappropriate'||hasInappropriate(text))return `Bu söylediğin sözcük uygun bir sözcük değil. Bu ${name}.`+ending;
  if(kind==='partial')return `Evet, yaklaştın. Tam adı ${name}.`+ending;
  const spoken=safeText(text).replace(/[.!?;:"“”]/g,'').trim().toLocaleLowerCase('tr');
  return (spoken?`Hayır, bu ${spoken} değil. `:'')+`Bu ${name}.`+ending;
 }
 function judge(text,item,items,custom=[]){
  if(hasInappropriate(text))return 'inappropriate';
  const clean=normalize(text),target=normalize(item.name);if(!clean)return 'uncertain';
  const tokens=clean.split(' ');if(tokens.some(t=>foreign.has(t)))return 'wrong';
  const filler=new Set(['bu','bir','sey','iste']);const answer=tokens.filter(t=>!filler.has(t)).join(' ');
  if(!answer)return 'uncertain';
  if(answer===target)return 'correct';
  if((partials[item.id]||[]).includes(answer))return 'partial';
  if(Object.values(items).some(i=>i.id!==item.id&&normalize(i.name)===answer))return 'wrong';
  const accepted=[target,...(aliases[item.id]||[]),...custom].map(normalize);
  if(accepted.includes(answer)||answer.split(' ').every(t=>accepted.includes(t)))return 'correct';
  // Similar spelling alone is insufficient. Only explicit, vowel-preserving speech approximations qualify.
  return answer.includes(' ')?'uncertain':'wrong';
 }
 function block(data,id,level){
  const varied=(item,i)=>item.category==='animals'?3+(i%6):i%data.variantCount(item.id);
  if(level<=3)return Array.from({length:5},(_,i)=>({item:data.items[id],variant:level===1?0:varied(data.items[id],i),context:level===3}));
  return data.mixedBlock().map((t,i)=>({item:t.item,variant:level===4?0:varied(t.item,i+level),context:level===7}));
 }
 const stages=['Aynı resmin adını söyle','Farklı görünümlerin adını söyle','Günlük ortamda aynı nesne','Karma nesnelerin adını söyle','Karma farklı görünümler','Karma görünüm ve duruşlar','Günlük ortamda karma nesneler'].map(title=>({title}));
 return {normalize,judge,block,stages,hasInappropriate,safeText,correction};
})();
