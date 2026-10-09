import {writeFile, mkdir} from 'node:fs/promises';
// Each row is an authored story: place, actor, object, actions, manner, purpose.
const rows=[
 ['park','Ela','top','al,kutuya koy','dikkatlice','oyuncakları toplamak'],
 ['kitchen','Ali','bardak','al,iç','yavaşça','susuzluğunu gidermek'],
 ['library','Ece','kitap','al,oku','sakince','öyküyü öğrenmek'],
 ['classroom','Can','kalem','al,çiz','dikkatlice','resim yapmak'],
 ['garden','Ada','sulama kabı','al,sula','yavaşça','çiçeğe su vermek'],
 ['playroom','Mert','araba','al,kutuya koy','dikkatlice','oyuncakları toplamak'],
 ['bedroom','Zeynep','kitap','al,oku','sakince','öyküyü öğrenmek'],
 ['schoolyard','Deniz','top','al,ver','nazikçe','arkadaşıyla oynamak'],
 ['bathroom','Elif','havlu','al,kurula','dikkatlice','ellerini kurulamak'],
 ['classroom','Arda','kitap','al,ver','nazikçe','arkadaşının okumasına yardım etmek'],
 ['kitchen','Ela','elma','al,yıka,ye','dikkatlice','temiz bir meyve yemek'],
 ['park','Ali','top','yürü,al,ver','yavaşça','arkadaşıyla oynamak'],
 ['classroom','Ece','kalem','yürü,al,çiz','dikkatlice','resim yapmak'],
 ['library','Can','kitap','al,oku,kutuya koy','sakince','kitabı yerine kaldırmak'],
 ['garden','Ada','sulama kabı','yürü,al,sula','dikkatlice','çiçeğe su vermek'],
 ['playroom','Mert','araba','yürü,al,kutuya koy','dikkatlice','oyuncakları toplamak'],
 ['kitchen','Zeynep','bardak','yürü,al,iç','yavaşça','susuzluğunu gidermek'],
 ['schoolyard','Deniz','kitap','yürü,al,ver','nazikçe','arkadaşının okumasına yardım etmek'],
 ['bedroom','Elif','kalem','al,çiz,kutuya koy','dikkatlice','resim malzemesini kaldırmak'],
 ['bathroom','Arda','havlu','yürü,al,kurula','yavaşça','ellerini kurulamak'],
 ['park','Ela','top','yürü,al,ver,selamla','nazikçe','arkadaşıyla oynamak'],
 ['classroom','Ali','kitap','yürü,al,oku,kutuya koy','sakince','kitabı yerine kaldırmak'],
 ['kitchen','Ece','elma','yürü,al,yıka,ye','dikkatlice','temiz bir meyve yemek'],
 ['garden','Can','sulama kabı','yürü,al,sula,kutuya koy','yavaşça','çiçeğe su verip kabı kaldırmak'],
 ['playroom','Ada','araba','yürü,al,ver,selamla','nazikçe','oyuncağını paylaşmak'],
 ['schoolyard','Mert','top','al,yürü,ver,selamla','dikkatlice','arkadaşıyla oynamak'],
 ['bedroom','Zeynep','kalem','yürü,al,çiz,kutuya koy','dikkatlice','resim malzemesini kaldırmak'],
 ['library','Deniz','kitap','al,yürü,ver,selamla','nazikçe','arkadaşının okumasına yardım etmek'],
 ['bathroom','Elif','havlu','yürü,al,kurula,kutuya koy','dikkatlice','ellerini kurulayıp havluyu kaldırmak'],
 ['kitchen','Arda','bardak','yürü,al,iç,kutuya koy','yavaşça','susuzluğunu giderip bardağı kaldırmak'],
 ['classroom','Ela','kalem','selamla,yürü,al,çiz,kutuya koy','dikkatlice','resim yapıp malzemesini kaldırmak'],
 ['park','Ali','top','selamla,yürü,al,ver,selamla','nazikçe','arkadaşıyla oynamak'],
 ['kitchen','Ece','elma','selamla,yürü,al,yıka,ye','dikkatlice','temiz bir meyve yemek'],
 ['garden','Can','sulama kabı','selamla,yürü,al,sula,kutuya koy','yavaşça','çiçeğe su verip kabı kaldırmak'],
 ['library','Ada','kitap','selamla,al,yürü,ver,selamla','nazikçe','arkadaşının okumasına yardım etmek'],
 ['playroom','Mert','araba','selamla,yürü,al,ver,selamla','nazikçe','oyuncağını paylaşmak'],
 ['bedroom','Zeynep','kitap','yürü,al,oku,kutuya koy,selamla','sakince','kitabı okuyup yerine kaldırmak'],
 ['bathroom','Deniz','havlu','selamla,yürü,al,kurula,kutuya koy','dikkatlice','ellerini kurulayıp havluyu kaldırmak'],
 ['schoolyard','Elif','top','selamla,al,yürü,ver,selamla','yavaşça','arkadaşıyla oynamak'],
 ['kitchen','Arda','bardak','selamla,yürü,al,iç,kutuya koy','yavaşça','susuzluğunu giderip bardağı kaldırmak'],
 ['park','Ela','top','al,yürü,düşür,al,ver,selamla','nazikçe','yere düşen topu arkadaşına vermek'],
 ['classroom','Ali','kalem','al,çiz,düşür,al,kutuya koy,selamla','dikkatlice','yere düşen kalemi yerine kaldırmak'],
 ['kitchen','Ece','elma','al,yürü,düşür,al,yıka,ye','dikkatlice','yere düşen meyveyi yıkayıp yemek'],
 ['garden','Can','sulama kabı','al,yürü,sula,düşür,al,kutuya koy','yavaşça','çiçeği sulayıp düşen kabı kaldırmak'],
 ['library','Ada','kitap','al,oku,düşür,al,ver,selamla','nazikçe','okuduğu kitabı arkadaşıyla paylaşmak'],
 ['playroom','Mert','araba','al,yürü,düşür,al,kutuya koy,selamla','dikkatlice','yere düşen oyuncağı yerine kaldırmak'],
 ['bedroom','Zeynep','kitap','al,oku,düşür,al,kutuya koy,selamla','sakince','yere düşen kitabı yerine kaldırmak'],
 ['bathroom','Deniz','havlu','al,kurula,düşür,al,kutuya koy,selamla','dikkatlice','düşen havluyu kirli sepetine koymak'],
 ['schoolyard','Elif','kitap','al,yürü,düşür,al,ver,selamla','nazikçe','yere düşen kitabı arkadaşına vermek'],
 ['kitchen','Arda','bardak','al,iç,yürü,ver,selamla,yürü','yavaşça','boş bardağı arkadaşına vermek'],
];
const places={park:['parkta','park'],kitchen:['mutfakta','mutfak'],library:['kütüphanede','kütüphane'],classroom:['sınıfta','sınıf'],garden:['bahçede','bahçe'],playroom:['oyun odasında','oyun odası'],bedroom:['yatak odasında','yatak odası'],schoolyard:['okul bahçesinde','okul bahçesi'],bathroom:['banyoda','banyo']};
const types=['ne','nerede','kim','nasıl','ne zaman','neden'];
const times=['sabah','öğleden sonra','akşam'];
const accusative={'top':'topu','bardak':'bardağı','kitap':'kitabı','kalem':'kalemi','sulama kabı':'sulama kabını','araba':'arabayı','havlu':'havluyu','elma':'elmayı'};
const actionText=(a,obj)=>({al:`${accusative[obj]} aldı`,yürü:'yürüdü','kutuya koy':`${accusative[obj]} ${obj==='havlu'?'sepete':'kutuya'} koydu`,iç:'bardaktaki suyu içti',oku:'kitabı okudu',çiz:'kâğıda resim çizdi',sula:'çiçeği suladı',ver:`${accusative[obj]} arkadaşına verdi`,kurula:'ellerini havluyla kuruladı',yıka:'elmayı yıkadı',ye:'elmayı yedi',selamla:'arkadaşına el salladı',düşür:`${accusative[obj]} yanlışlıkla yere düşürdü`}[a]);
const stories=rows.map(([place,actor,object,seq,manner,purpose],i)=>{
 const actions=seq.split(','),time=times[Math.floor(i/5)%3],id=`story-${String(i+1).padStart(2,'0')}`;
 const sentences=actions.map(a=>`${actor} ${actionText(a,object)}.`);
 const narration=`${time==='öğleden sonra'?'Öğleden sonra':time[0].toUpperCase()+time.slice(1)} ${actor} ${places[place][0]}. ${sentences.join(' ')} ${actor} bunları ${manner} yaptı. ${purpose[0].toUpperCase()+purpose.slice(1)} için böyle yaptı.`;
 const values=[object,places[place][0],actor,manner,time,purpose];
 const labels=[actions.includes('düşür')?`${actor} neyi yere düşürdü?`:`${actor} ne aldı?`,`${actor} neredeydi?`,`Bu olayda bunları kim yaptı?`,`${actor} bunları nasıl yaptı?`,`Bu olay ne zaman oldu?`,`${actor} neden böyle yaptı?`];
 const shortPurpose=purpose.includes('paylaşmak')?'paylaşmak':purpose.includes('oynamak')?'oynamak':purpose.includes('yardım etmek')?'yardım etmek':purpose.includes('susuzluğunu')?'su içmek':purpose.includes('yemek')?'meyve yemek':purpose.includes('resim')?'resim yapmak':purpose.includes('çiçe')?'çiçeği sulamak':purpose.includes('toplamak')?'oyuncakları toplamak':purpose.includes('kurula')?'ellerini kurulamak':purpose;
 const timeAliases=time==='sabah'?['sabah','sabahleyin','sabah vakti']:time==='akşam'?['akşam','akşamleyin','akşam vakti']:['öğleden sonra','öğle sonrası'];
 const aliases=values.map((v,n)=>n===0?[v,accusative[v],`${actor} ${actionText('al',object)}`]:n===1?[v,places[place][1],`${actor} ${v}`]:n===2?[v,`${v} yaptı`]:n===3?[v,{'dikkatlice':'dikkatli','yavaşça':'yavaş','sakince':'sakin','nazikçe':'nazik'}[v]]:n===4?timeAliases:n===5?[v,`${v} için`,shortPurpose,`${shortPurpose} için`]:[v]);
 const questions=types.map((type,n)=>({type,text:labels[n],answer:values[n],aliases:aliases[n],evidence:n===0?`${actor} ${actionText(actions.includes('düşür')?'düşür':'al',object)}.`:n===1?`${actor} ${places[place][0]}.`:n===2?`Bu hareketleri ${actor} yaptı.`:n===3?`${actor} bunları ${manner} yaptı.`:n===4?`Olay ${time} oldu.`:`${actor} ${purpose} için böyle yaptı.`}));
 return {id,level:Math.floor(i/5)+1,title:`${actor} · ${object}`,actor,friend:i%2?'İpek':'Emir',place,object,actions,time,manner,purpose,narration,questions,duration:actions.length*3+1,video:`assets/5n1k/videos/${id}.mp4`,poster:`assets/5n1k/posters/${id}.webp`,palette:i%5};
});
const levels=Array.from({length:10},(_,i)=>({number:i+1,steps:[2,2,3,3,4,4,5,5,6,6][i],title:`${[2,2,3,3,4,4,5,5,6,6][i]} adımlı olaylar`,stories:stories.filter(s=>s.level===i+1).map(s=>s.id)}));
const json=JSON.stringify({types,places,levels,stories},null,2);
await mkdir(new URL('../dist/assets/5n1k/',import.meta.url),{recursive:true});
await writeFile(new URL('../dist/wh-data.js',import.meta.url),`window.WhData=${json};\n`);
await writeFile(new URL('../dist/assets/5n1k/stories.json',import.meta.url),json);
console.log('50 senaryo, 10 seviye, 300 soru oluşturuldu.');
