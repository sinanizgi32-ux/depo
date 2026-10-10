import fs from 'node:fs/promises';import vm from 'node:vm';
export async function activityPhrases(root,items){
 const phrases=['Bu ne? Söyle.','Ne yapıyor? Söyle.','Bu hangi renk? Söyle.','Bak dikkat! Burası hangi renk? Söyle.','İşaretli kişi genç mi, yaşlı mı? Söyle.','İşaretli nesne uzun mu, kısa mı? Söyle.','Devam ediyoruz.'];
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
 return [...new Set(phrases)];
}
