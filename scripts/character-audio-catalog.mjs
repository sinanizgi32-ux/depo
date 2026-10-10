import fs from 'node:fs/promises';import vm from 'node:vm';
export async function activityPhrases(root,items){
 const phrases=['Bu ne? Söyle.','Ne yapıyor? Söyle.','Bu hangi renk? Söyle.','Bak dikkat! Burası hangi renk? Söyle.','İşaretli kişi genç mi, yaşlı mı? Söyle.','İşaretli nesne uzun mu, kısa mı? Söyle.','Devam ediyoruz.','Aynı renkte olanı seç.','Aynı olan iki kırmızı kartı bulun.','Sıraya bakalım. Boş kutuya hangisi gelmeli? Doğru olanı seç.','Resimlere bak. Önce olanı, sonra olanı sırala. Önce olan karta dokun.','Şimdi sıradaki olayı seç.'];
 for(const item of items){const name=item.name.toLocaleLowerCase('tr');phrases.push(`Bu ${name}. Şimdi sen söyle: ${name}.`);for(const wrong of [false,true]){
 phrases.push(`${wrong?'Hayır, o değil. ':''}Bu ${name}. Gösterilen resme dokun. ${item.accusative} göster.`);
 phrases.push(`${wrong?'Bu eşleşme olmadı. ':''}Bu ${name}. Yukarıda da ${name} var. Alttaki resmi gösterilen resmin üstüne götür. ${item.accusative} eşle.`);
 }}
 for(const name of ['Genç','Yaşlı','Uzun','Kısa'])for(const verb of ['eşle','göster'])phrases.push(`${name} olanı ${verb}.`);
 for(const [name,cue]of [['Kırmızı','Kırmızıyı'],['Mavi','Maviyi'],['Sarı','Sarıyı'],['Yeşil','Yeşili']])for(const verb of ['eşle','göster'])phrases.push(`${cue} ${verb}.`);
 const source=await fs.readFile(new URL('dist/opposite-teaching-data.js',root),'utf8');
 for(const concept of ['hard','soft','wet','dry','full','empty','new','worn','thin','thick','day','night','inside','outside','big','small','heavy','light','clean','dirty','hot','cold']){
 const ctx={window:{},URLSearchParams,location:{search:'?concept='+concept}};vm.runInNewContext(source,ctx);const D=ctx.window.OppositeTeachingData;phrases.push(D.instruction('match'),D.instruction('show'),D.question,`Bu ${D.concept.name.toLocaleLowerCase('tr')}. Şimdi sen söyle.`);
 }
 const ctx={window:{}};vm.runInNewContext(await fs.readFile(new URL('dist/action-catalog.js',root),'utf8'),ctx);
 for(const item of ctx.window.ActionCatalog){for(const verb of ['eşle','göster'])phrases.push(`${item.instruction} ${verb}.`);phrases.push(`${item.model}. Şimdi sen söyle.`);for(const wrong of [false,true])for(const mode of ['match','show'])phrases.push(`${wrong?'Bu eşleşme olmadı. ':''}${item.model}. ${mode==='match'?'Alttaki videoyu gösterilen eşiyle eşle.':'Gösterilen eyleme dokun.'}`);}
 const wh={window:{}};vm.runInNewContext(await fs.readFile(new URL('dist/wh-data.js',root),'utf8'),wh);
 for(const story of wh.window.WhData.stories){phrases.push(story.narration);for(const question of story.questions){phrases.push(question.text,question.answer,question.evidence+' Şimdi sen söyle.',question.evidence+' Şimdi seç.');}}
 const events={window:{}};vm.runInNewContext(await fs.readFile(new URL('dist/events-data.js',root),'utf8'),events);
 for(const level of events.window.EventSequences.levels)for(const example of level.examples){const story=events.window.EventSequences.stories[example.story];const sequence=example.indices.map((step,index)=>`${index===0?'Önce':index===example.indices.length-1?'En son':'Sonra'} ${story.steps[step]}`).join(' ');for(let next=0;next<example.indices.length;next++)for(const wrong of [false,true])phrases.push(`${wrong?'Hayır, bu kartın yeri farklı. ':''}${sequence} Şimdi gösterilen karta dokun; ${next+1}. yere gelsin.`);}
 const app=await fs.readFile(new URL('dist/app.js',root),'utf8');const pattern={shapeMarkup:()=>''};vm.runInNewContext(app.slice(app.indexOf('  const patternCard'),app.indexOf('  const patternExample'))+';this.items=patternItems;this.levels=patternLevels;',pattern);
 for(const level of pattern.levels)for(const trial of level.examples){const sequence=trial.shown.map(key=>pattern.items[key].name).join(', '),full=[...trial.shown,trial.answer];const period=full.findIndex((_,index)=>index>0&&full.every((key,position)=>key===full[position%index]));const group=full.slice(0,period>0?period:full.length).map(key=>pattern.items[key].name).join(', ');const explanation=period===2?'Bu iki nesne sırayla tekrar ediyor.':`Tekrar eden grup: ${group}. Bu grup aynı sırayla tekrar ediyor.`;for(const wrong of [false,true])phrases.push(`${wrong?'Hayır, o değil. ':''}Bak, ${sequence}. ${explanation} Sırayı devam ettirince buraya ${pattern.items[trial.answer].name} gelmeli. Şimdi gösterilen seçeneğe bas.`);}
 return [...new Set(phrases)];
}
