window.ObjectMatchingData = (() => {
  const definitions = [
    ['home','Ev eşyaları',[
      ['table','Masa','Masayı','table'],['chair','Sandalye','Sandalyeyi','chair'],['sofa','Koltuk','Koltuğu','sofa'],['bed','Yatak','Yatağı','bed'],['wardrobe','Dolap','Dolabı','wardrobe'],['pillow','Yastık','Yastığı','pillow'],['blanket','Battaniye','Battaniyeyi','folded blanket'],['curtain','Perde','Perdeyi','hanging curtain'],['rug','Halı','Halıyı','rug'],['light','Lamba','Lambayı','table lamp']]],
    ['kitchen','Mutfak eşyaları',[
      ['glass','Bardak','Bardağı','drinking glass'],['plate','Tabak','Tabağı','plate'],['bowl','Kâse','Kâseyi','bowl'],['spoon','Kaşık','Kaşığı','spoon'],['fork','Çatal','Çatalı','fork'],['pot','Tencere','Tencereyi','cooking pot'],['pan','Tava','Tavayı','frying pan'],['jug','Sürahi','Sürahiyi','water jug'],['tray','Tepsi','Tepsiyi','tray'],['teapot','Çaydanlık','Çaydanlığı','Turkish stacked double teapot']]],
    ['clothes','Giysiler',[
      ['tshirt','Tişört','Tişörtü','t-shirt'],['trousers','Pantolon','Pantolonu','trousers'],['dress','Elbise','Elbiseyi','dress'],['skirt','Etek','Eteği','skirt'],['sweater','Kazak','Kazağı','sweater'],['coat','Mont','Montu','winter coat'],['socks','Çorap','Çorabı','pair of socks'],['shoes','Ayakkabı','Ayakkabıyı','pair of shoes'],['hat','Şapka','Şapkayı','hat'],['pyjamas','Pijama','Pijamayı','children pyjamas']]],
    ['care','Temizlik ve kişisel bakım',[
      ['soap','Sabun','Sabunu','bar of soap'],['towel','Havlu','Havluyu','towel'],['toothbrush','Diş fırçası','Diş fırçasını','toothbrush'],['toothpaste','Diş macunu','Diş macununu','toothpaste tube with no readable label'],['comb','Tarak','Tarağı','comb'],['shampoo','Şampuan','Şampuanı','shampoo bottle no readable label'],['toiletpaper','Tuvalet kâğıdı','Tuvalet kâğıdını','toilet paper roll'],['napkin','Peçete','Peçeteyi','paper napkin'],['sponge','Sünger','Süngeri','cleaning sponge'],['broom','Süpürge','Süpürgeyi','broom']]],
    ['toys','Oyuncaklar',[
      ['ball','Top','Topu','play ball'],['doll','Oyuncak bebek','Oyuncak bebeği','toy doll'],['teddybear','Oyuncak ayı','Oyuncak ayıyı','teddy bear'],['toycar','Oyuncak araba','Oyuncak arabayı','small toy car visibly toy with plastic wheels'],['block','Yapı bloğu','Yapı bloğunu','toy building block'],['puzzle','Yapboz','Yapbozu','children jigsaw puzzle on board'],['balloon','Balon','Balonu','inflated balloon with string'],['kite','Uçurtma','Uçurtmayı','kite'],['drum','Oyuncak davul','Oyuncak davulu','toy drum'],['toytrain','Oyuncak tren','Oyuncak treni','small wooden toy train']]],
    ['school','Okul ve etkinlik malzemeleri',[
      ['book','Kitap','Kitabı','closed book'],['notebook','Defter','Defteri','spiral notebook'],['pencil','Kurşun kalem','Kurşun kalemi','graphite pencil'],['crayon','Boya kalemi','Boya kalemini','wax coloring crayon'],['eraser','Silgi','Silgiyi','eraser'],['sharpener','Kalemtıraş','Kalemtıraşı','pencil sharpener'],['schoolbag','Okul çantası','Okul çantasını','school backpack'],['glue','Yapıştırıcı','Yapıştırıcıyı','glue stick without label'],['scissors','Çocuk makası','Çocuk makasını','round blunt safety scissors'],['playdough','Oyun hamuru','Oyun hamurunu','colorful play dough lumps with tub']]],
    ['animals','Hayvanlar',[
      ['cat','Kedi','Kediyi','domestic cat: first tabby cat, second black and white cat, third orange cat'],['dog','Köpek','Köpeği','friendly domestic dog'],['bird','Kuş','Kuşu','small bird'],['fish','Balık','Balığı','fish'],['rabbit','Tavşan','Tavşanı','rabbit'],['cow','İnek','İneği','cow'],['sheep','Koyun','Koyunu','sheep'],['horse','At','Atı','horse'],['chicken','Tavuk','Tavuğu','hen'],['duck','Ördek','Ördeği','duck']]],
    ['vehicles','Taşıtlar',[
      ['car','Araba','Arabayı','real passenger car'],['bus','Otobüs','Otobüsü','full size passenger bus'],['minibus','Minibüs','Minibüsü','passenger minibus'],['truck','Kamyon','Kamyonu','cargo truck'],['bicycle','Bisiklet','Bisikleti','bicycle'],['motorcycle','Motosiklet','Motosikleti','motorcycle'],['train','Tren','Treni','real passenger train'],['plane','Uçak','Uçağı','airplane'],['ship','Gemi','Gemiyi','ship'],['ambulance','Ambulans','Ambulansı','ambulance with medical emblem no text']]],
    ['food','Meyve ve sebzeler',[
      ['apple','Elma','Elmayı','whole apple'],['banana','Muz','Muzu','unpeeled banana'],['orange','Portakal','Portakalı','whole orange fruit'],['strawberry','Çilek','Çileği','strawberry'],['grapes','Üzüm','Üzümü','bunch of grapes'],['tomato','Domates','Domatesi','whole tomato'],['cucumber','Salatalık','Salatalığı','whole cucumber'],['carrot','Havuç','Havucu','whole carrot'],['potato','Patates','Patatesi','whole potato'],['pepper','Biber','Biberi','whole pepper']]],
    ['plants','Bitkiler',[
      ['daisy','Papatya','Papatyayı','white daisy flower with yellow center and stem'],['rose','Gül','Gülü','rose flower with stem'],['tulip','Lale','Laleyi','tulip flower with stem'],['sunflower','Ayçiçeği','Ayçiçeğini','sunflower with stem'],['pine','Çam ağacı','Çam ağacını','pine tree'],['appletree','Elma ağacı','Elma ağacını','apple tree bearing clearly visible red apples'],['grass','Çimen','Çimeni','small patch of green grass'],['mint','Nane','Naneyi','mint sprig with recognizable serrated green leaves'],['basil','Fesleğen','Fesleğeni','basil plant broad smooth rounded leaves'],['cactus','Kaktüs','Kaktüsü','cactus in pot']]]
  ];
  const categories=definitions.map(([id,title,rows])=>({id,title,items:rows.map(([id,name,accusative,visual])=>({id,name,accusative,visual}))}));
  const items=Object.fromEntries(categories.flatMap(category=>category.items.map(item=>[item.id,{...item,category:category.id}])));
  const stages=[{title:'Aynı resimle eşleme',count:1},{title:'Farklı görünümlerle eşleme',count:1},{title:'İki seçenek arasından eşleme',count:2},{title:'Üç seçenek arasından eşleme',count:3}];
  const variantCount=id=>items[id].category==='animals'?9:3;
  const variedAnimal=(stage,index)=>3+((index+stage-2)%6);
  function trial(itemId,stage,index){
    const item=items[itemId],category=categories.find(c=>c.id===item.category),position=category.items.findIndex(i=>i.id===itemId);
    const pairs=[[0,1],[1,2],[2,0],[0,2],[1,0]];
    const [source,target]=stage===1?[0,0]:item.category==='animals'?[variedAnimal(stage,index),3+((index+stage-1)%6)]:pairs[index];
    return {item,source:stage===1?0:source,target:stage===1?0:target,options:[itemId,...Array.from({length:stages[stage-1].count-1},(_,i)=>category.items[(position+index+i+1)%10].id)]};
  }
  function image(id,variant=0){return `./assets/matching/${id}/${variant+1}.webp`;}
  const pointingStages=[{title:'Aynı resim · İki seçenek',count:2},{title:'Farklı görünümler · İki seçenek',count:2},{title:'Farklı görünümler · Üç seçenek',count:3},{title:'Farklı görünümler · Dört seçenek',count:4},{title:'Farklı görünümler · Beş seçenek',count:5}];
  function pointingTrial(itemId,stage,index){
    const item=items[itemId],category=categories.find(c=>c.id===item.category);
    const others=category.items.filter(i=>i.id!==itemId).map(i=>i.id);
    for(let i=others.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[others[i],others[j]]=[others[j],others[i]];}
    return {item,target:stage===1?0:item.category==='animals'?variedAnimal(stage,index):[0,1,2,1,2][index],options:[itemId,...others.slice(0,pointingStages[stage-1].count-1)]};
  }
  const isMixed=(skill,level)=>level>(skill==='object-show'?5:4);
  for(let i=1;i<=3;i++){
    stages.push({title:`Karma nesneler ${i}`,count:4,mixed:true});
    pointingStages.push({title:`Karma nesneler ${i}`,count:4,mixed:true});
  }
  function shuffle(values){const result=[...values];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
  function mixedBlock(){
    return shuffle(categories).slice(0,5).map(category=>{
      const item=items[shuffle(category.items)[0].id];
      const target=Math.floor(Math.random()*variantCount(item.id));
      const source=(target+1+Math.floor(Math.random()*(variantCount(item.id)-1)))%variantCount(item.id);
      const related=shuffle(category.items.filter(i=>i.id!==item.id))[0].id;
      const others=shuffle(Object.keys(items).filter(id=>id!==item.id&&id!==related&&items[id].category!==item.category));
      return {item,target,source,options:[item.id,related,...others.slice(0,2)]};
    });
  }
  return {categories,items,stages,trial,image,pointingStages,pointingTrial,variantCount,isMixed,mixedBlock};
})();
