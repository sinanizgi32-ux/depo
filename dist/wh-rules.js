window.WhRules=(()=>{'use strict';
 const norm=window.NamingRules.normalize;
 function judge(text,q){if(window.NamingRules.hasInappropriate(text))return 'inappropriate';const value=norm(text).replace(/^(bu|bir|bence|cevap) /,'');if(!value)return 'uncertain';return q.aliases.map(norm).includes(value)?'correct':'wrong';}
 function choices(story,q){const all=WhData.stories.flatMap(s=>s.questions.filter(x=>x.type===q.type).map(x=>({answer:x.answer,story:s.id})));const seen=new Set([q.answer]),others=[];for(const x of all){if(!seen.has(x.answer)){seen.add(x.answer);others.push(x);}}
  const seed=Number(story.id.slice(-2)),count=Math.min(story.level<=2?2:story.level<=6?3:4,others.length+1);
  const list=[{answer:q.answer,story:story.id},...Array.from({length:count-1},(_,i)=>others[(seed+i)%others.length])];
  // Correct position changes by story AND question, never always first.
  const shift=(seed+WhData.types.indexOf(q.type))%count;return list.slice(shift).concat(list.slice(0,shift));
 }
 function totals(records){return WhData.types.map(type=>{const rows=records.filter(r=>r.type===type);return {type,total:rows.length,independent:rows.filter(r=>r.outcome==='independent').length,prompted:rows.filter(r=>r.outcome==='prompted').length,incorrect:rows.filter(r=>r.outcome==='incorrect').length,noResponse:rows.filter(r=>r.outcome==='no-response').length,firstWrong:rows.filter(r=>r.firstResponse==='wrong'||r.firstResponse==='inappropriate').length,firstSilent:rows.filter(r=>r.firstResponse==='no-response').length};});}
 return {judge,choices,totals};
})();
