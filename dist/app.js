(() => {
  const screens = [...document.querySelectorAll('[data-screen]')];
  const topbar = document.getElementById('topbar');
  const floatingBuddy = document.getElementById('floatingBuddy');
  const storageKey = 'dijitalOzelEgitimStateV2';
  const audioStorageKey = 'dijitalOzelEgitimAudioV1';
  const backgroundMusic = document.getElementById('backgroundMusic');
  const musicBlockedScreens = new Set(['activity', 'naming', 'color-teaching', 'endgame', 'summary', 'island-game']);
  const audioSettings = { enabled: true, volume: .35, lastVolume: .35 };
  const skillNames = {
    'wh-questions': {title:'5N1K',description:'Olayları izle, soruları yanıtla.',icon:'💬',playable:true},
 'object-name':{title:'Nesne ismi söyleme',description:'10 kategori, 100 nesne. Üç nesne aşaması ve dört karma aşama; her seviyede beş sesli deneme.',icon:'🎙️',playable:true},
    'object-show': {title:'Nesne gösterme',description:'10 kategori, 100 nesne. Beş nesne seviyesi ve ardından dört seçenekli üç karma seviye.',icon:'👆',playable:true},
    'object-match': { title: 'Nesne eşleme', description: '10 kategori, 100 nesne. Her nesne için dört seviye ve ardından üç karma seviye; her seviyede beş deneme.', icon: '🧩', playable: true },
    'same-red': { title: 'Aynı tip ve aynı renk kartları eşle', description: 'Aynı tip iki kırmızı kartı dağınık kartlar arasından bulup eşleme. 5 deneme ve bölüm sonu oyunu.', icon: '🟥', playable: true },
    'two-color': { title: 'İki renk arasından doğru olanı eşle', description: 'Kırmızı ve mavi arasından kırmızı olanı eşle. 5 deneme ve bölüm sonu oyunu.', icon: '🎨', playable: true },
    'spoken-color': { title: 'Söylenen rengi göster', description: 'Sözel yönergeye göre doğru rengi seçme çalışması.', icon: '👆' },
    'pattern': { title: 'Örüntü: boş kutuya hangisi gelir?', description: 'Örüntüdeki sırada bir sonraki nesneyi bulma. 15 seviye, giderek zorlaşan örüntüler.', icon: '🔁', playable: true },
    'events': { title: 'Olay kartlarını oluş sırasına göre sıralar', description: 'İki karttan beş karta ilerleyen 10 seviye. Her seviyede 5 olay sıralama denemesi.', icon: '🖼️', playable: true }
  };
  Object.assign(skillNames,{"hard-match": {"title": "Sert kavramı · eşle", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "🧩", "playable": true}, "hard-show": {"title": "Sert kavramı · göster", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "👆", "playable": true}, "hard-name": {"title": "Sert kavramı · söyle", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "🎙️", "playable": true}, "soft-match": {"title": "Yumuşak kavramı · eşle", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "🧩", "playable": true}, "soft-show": {"title": "Yumuşak kavramı · göster", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "👆", "playable": true}, "soft-name": {"title": "Yumuşak kavramı · söyle", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "🎙️", "playable": true}, "wet-match": {"title": "Islak kavramı · eşle", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "🧩", "playable": true}, "wet-show": {"title": "Islak kavramı · göster", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "👆", "playable": true}, "wet-name": {"title": "Islak kavramı · söyle", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "🎙️", "playable": true}, "dry-match": {"title": "Kuru kavramı · eşle", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "🧩", "playable": true}, "dry-show": {"title": "Kuru kavramı · göster", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "👆", "playable": true}, "dry-name": {"title": "Kuru kavramı · söyle", "description": "On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.", "icon": "🎙️", "playable": true}});
  Object.assign(skillNames,{"full-match": {"title": "Dolu kavramı · eşle", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "🧩", "playable": true}, "full-show": {"title": "Dolu kavramı · göster", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "👆", "playable": true}, "full-name": {"title": "Dolu kavramı · söyle", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "🎙️", "playable": true}, "empty-match": {"title": "Boş kavramı · eşle", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "🧩", "playable": true}, "empty-show": {"title": "Boş kavramı · göster", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "👆", "playable": true}, "empty-name": {"title": "Boş kavramı · söyle", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "🎙️", "playable": true}, "new-match": {"title": "Yeni kavramı · eşle", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "🧩", "playable": true}, "new-show": {"title": "Yeni kavramı · göster", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "👆", "playable": true}, "new-name": {"title": "Yeni kavramı · söyle", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "🎙️", "playable": true}, "worn-match": {"title": "Eski kavramı · eşle", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "🧩", "playable": true}, "worn-show": {"title": "Eski kavramı · göster", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "👆", "playable": true}, "worn-name": {"title": "Eski kavramı · söyle", "description": "On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.", "icon": "🎙️", "playable": true}});
  Object.assign(skillNames,{
    'thin-match':{title:'İnce kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🧩',playable:true},
    'thin-show':{title:'İnce kavramı · göster',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'👆',playable:true},
    'thin-name':{title:'İnce kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'thick-match':{title:'Kalın kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🧩',playable:true},
    'thick-show':{title:'Kalın kavramı · göster',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'👆',playable:true},
    'thick-name':{title:'Kalın kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'day-match':{title:'Gündüz kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🧩',playable:true},
    'day-show':{title:'Gündüz kavramı · göster',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'👆',playable:true},
    'day-name':{title:'Gündüz kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'night-match':{title:'Gece kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🧩',playable:true},
    'night-show':{title:'Gece kavramı · göster',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'👆',playable:true},
    'night-name':{title:'Gece kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'inside-match':{title:'İçinde kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🧩',playable:true},
    'inside-show':{title:'İçinde kavramı · göster',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'👆',playable:true},
    'inside-name':{title:'İçinde kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'outside-match':{title:'Dışında kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🧩',playable:true},
    'outside-show':{title:'Dışında kavramı · göster',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'👆',playable:true},
    'outside-name':{title:'Dışında kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı örnekler ve günlük ortamlar.',icon:'🎙️',playable:true},

    'big-match':{title:'Büyük kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı nesneler ve boyutlar.',icon:'🧩',playable:true},
    'big-show':{title:'Büyük kavramı · göster',description:'On bir basamak, beşer deneme. Farklı nesneler ve boyutlar.',icon:'👆',playable:true},
    'big-name':{title:'Büyük kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı nesneler ve boyutlar.',icon:'🎙️',playable:true},
    'small-match':{title:'Küçük kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı nesneler ve boyutlar.',icon:'🧩',playable:true},
    'small-show':{title:'Küçük kavramı · göster',description:'On bir basamak, beşer deneme. Farklı nesneler ve boyutlar.',icon:'👆',playable:true},
    'small-name':{title:'Küçük kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı nesneler ve boyutlar.',icon:'🎙️',playable:true},
    'heavy-match':{title:'Ağır kavramı · eşle',description:'On bir basamak, beşer deneme. Tartı üzerinde ağırlık karşılaştırmaları.',icon:'🧩',playable:true},
    'heavy-show':{title:'Ağır kavramı · göster',description:'On bir basamak, beşer deneme. Tartı üzerinde ağırlık karşılaştırmaları.',icon:'👆',playable:true},
    'heavy-name':{title:'Ağır kavramı · söyle',description:'On bir basamak, beşer deneme. Tartı üzerinde ağırlık karşılaştırmaları.',icon:'🎙️',playable:true},
    'light-match':{title:'Hafif kavramı · eşle',description:'On bir basamak, beşer deneme. Tartı üzerinde ağırlık karşılaştırmaları.',icon:'🧩',playable:true},
    'light-show':{title:'Hafif kavramı · göster',description:'On bir basamak, beşer deneme. Tartı üzerinde ağırlık karşılaştırmaları.',icon:'👆',playable:true},
    'light-name':{title:'Hafif kavramı · söyle',description:'On bir basamak, beşer deneme. Tartı üzerinde ağırlık karşılaştırmaları.',icon:'🎙️',playable:true},
    'clean-match':{title:'Temiz kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'🧩',playable:true},
    'clean-show':{title:'Temiz kavramı · göster',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'👆',playable:true},
    'clean-name':{title:'Temiz kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'dirty-match':{title:'Kirli kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'🧩',playable:true},
    'dirty-show':{title:'Kirli kavramı · göster',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'👆',playable:true},
    'dirty-name':{title:'Kirli kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'hot-match':{title:'Sıcak kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'🧩',playable:true},
    'hot-show':{title:'Sıcak kavramı · göster',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'👆',playable:true},
    'hot-name':{title:'Sıcak kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'cold-match':{title:'Soğuk kavramı · eşle',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'🧩',playable:true},
    'cold-show':{title:'Soğuk kavramı · göster',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'👆',playable:true},
    'cold-name':{title:'Soğuk kavramı · söyle',description:'On bir basamak, beşer deneme. Farklı nesneler ve günlük ortamlar.',icon:'🎙️',playable:true},
    'young-match':{title:'Genç kavramı · eşle',description:'On bir basamak, beşer deneme. İki, üç ve dört kişi seçeneği.',icon:'🧩',playable:true},
    'young-show':{title:'Genç kavramı · göster',description:'Genç kişiyi farklı resim ve ortamlarda gösterme.',icon:'👆',playable:true},
    'young-name':{title:'Genç kavramı · söyle',description:'İşaretlenen kişinin genç olduğunu söyleme.',icon:'🎙️',playable:true},
    'old-match':{title:'Yaşlı kavramı · eşle',description:'On bir basamak, beşer deneme. İki, üç ve dört kişi seçeneği.',icon:'🧩',playable:true},
    'old-show':{title:'Yaşlı kavramı · göster',description:'Yaşlı kişiyi farklı resim ve ortamlarda gösterme.',icon:'👆',playable:true},
    'old-name':{title:'Yaşlı kavramı · söyle',description:'İşaretlenen kişinin yaşlı olduğunu söyleme.',icon:'🎙️',playable:true},
    'short-match':{title:'Kısa kavramı · eşle',description:'Şekillerden gerçek nesnelere on bir basamak. İki, üç ve dört seçenek; beşer deneme.',icon:'🧩',playable:true},
    'short-show':{title:'Kısa kavramı · göster',description:'İki, üç ve dört seçenek arasından kısa olanı gösterme.',icon:'👆',playable:true},
    'short-name':{title:'Kısa kavramı · söyle',description:'İşaretlenen nesnenin kısa olduğunu söyleme. On bir basamak, beşer deneme.',icon:'🎙️',playable:true},
    'length-match':{title:'Uzun kavramı · eşle',description:'Şekillerden gerçek nesnelere on bir basamak. İki, üç ve dört seçenek; beşer deneme.',icon:'🧩',playable:true},
    'length-show':{title:'Uzun kavramı · göster',description:'İki, üç ve dört seçenek arasından uzun olanı gösterme.',icon:'👆',playable:true},
    'length-name':{title:'Uzun kavramı · söyle',description:'İşaretlenen nesnenin uzun olduğunu söyleme. On bir basamak, beşer deneme.',icon:'🎙️',playable:true},
    'color-match':{title:'Renk eşleme',description:'Kırmızı, mavi, sarı ve yeşil. Renk kartlarından gerçek nesne resimlerine dokuz basamak.',icon:'🎨',playable:true},
    'color-show':{title:'Renk gösterme',description:'Renk kartları, gerçek nesne resimleri ve resmin içindeki renk bölgeleri. Yedi basamak.',icon:'👆',playable:true},
    'color-name':{title:'Renk ismi söyleme',description:'Kartların, farklı nesnelerin ve günlük ortamda işaretlenen bölgelerin rengini söyleme. Yedi basamak.',icon:'🎙️',playable:true},
    'action-match':{title:'Eylem eşleme',description:'30 eylemi aynı ve farklı video örnekleriyle eşleme. Her seviyede beş deneme.',icon:'🧩',playable:true},
    'action-show':{title:'Eylem gösterme',description:'İki, üç, dört ve beş eylem arasından istenen hareketi gösterme. Her seviyede beş deneme.',icon:'👆',playable:true},
    'action-name':{title:'Eylem ismi söyleme',description:'Videodaki hareketi Türkçe adlandırma. Her seviyede beş sesli deneme.',icon:'🎙️',playable:true}
  });
  const legacyColorSkills=new Set(['same-red','two-color','spoken-color']);
  for(const key of legacyColorSkills)document.querySelector(`.assessment-row[data-skill="${key}"]`)?.remove();
  for(const [key,title,detail] of [["hard-match", "Sert olanları eşler", "Farklı örneklerde sert kavramını çalışır."],["hard-show", "Sert olanı gösterir", "Farklı örneklerde sert kavramını çalışır."],["hard-name", "Sert olduğunu söyler", "Farklı örneklerde sert kavramını çalışır."],["soft-match", "Yumuşak olanları eşler", "Farklı örneklerde yumuşak kavramını çalışır."],["soft-show", "Yumuşak olanı gösterir", "Farklı örneklerde yumuşak kavramını çalışır."],["soft-name", "Yumuşak olduğunu söyler", "Farklı örneklerde yumuşak kavramını çalışır."],["wet-match", "Islak olanları eşler", "Farklı örneklerde islak kavramını çalışır."],["wet-show", "Islak olanı gösterir", "Farklı örneklerde islak kavramını çalışır."],["wet-name", "Islak olduğunu söyler", "Farklı örneklerde islak kavramını çalışır."],["dry-match", "Kuru olanları eşler", "Farklı örneklerde kuru kavramını çalışır."],["dry-show", "Kuru olanı gösterir", "Farklı örneklerde kuru kavramını çalışır."],["dry-name", "Kuru olduğunu söyler", "Farklı örneklerde kuru kavramını çalışır."],["full-match", "Dolu olanları eşler", "Farklı örneklerde dolu kavramını çalışır."],["full-show", "Dolu olanı gösterir", "Farklı örneklerde dolu kavramını çalışır."],["full-name", "Dolu olduğunu söyler", "Farklı örneklerde dolu kavramını çalışır."],["empty-match", "Boş olanları eşler", "Farklı örneklerde boş kavramını çalışır."],["empty-show", "Boş olanı gösterir", "Farklı örneklerde boş kavramını çalışır."],["empty-name", "Boş olduğunu söyler", "Farklı örneklerde boş kavramını çalışır."],["new-match", "Yeni olanları eşler", "Farklı örneklerde yeni kavramını çalışır."],["new-show", "Yeni olanı gösterir", "Farklı örneklerde yeni kavramını çalışır."],["new-name", "Yeni olduğunu söyler", "Farklı örneklerde yeni kavramını çalışır."],["worn-match", "Eski olanları eşler", "Farklı örneklerde eski kavramını çalışır."],["worn-show", "Eski olanı gösterir", "Farklı örneklerde eski kavramını çalışır."],["worn-name", "Eski olduğunu söyler", "Farklı örneklerde eski kavramını çalışır."],["thin-match", "İnce resimlerini eşler", "Farklı örneklerde i̇nce kavramını çalışır."], ["thin-show", "İnce resmini gösterir", "Farklı örneklerde i̇nce kavramını çalışır."], ["thin-name", "İnce olduğunu söyler", "Farklı örneklerde i̇nce kavramını çalışır."], ["thick-match", "Kalın resimlerini eşler", "Farklı örneklerde kalın kavramını çalışır."], ["thick-show", "Kalın resmini gösterir", "Farklı örneklerde kalın kavramını çalışır."], ["thick-name", "Kalın olduğunu söyler", "Farklı örneklerde kalın kavramını çalışır."], ["day-match", "Gündüz resimlerini eşler", "Farklı örneklerde gündüz kavramını çalışır."], ["day-show", "Gündüz resmini gösterir", "Farklı örneklerde gündüz kavramını çalışır."], ["day-name", "Gündüz olduğunu söyler", "Farklı örneklerde gündüz kavramını çalışır."], ["night-match", "Gece resimlerini eşler", "Farklı örneklerde gece kavramını çalışır."], ["night-show", "Gece resmini gösterir", "Farklı örneklerde gece kavramını çalışır."], ["night-name", "Gece olduğunu söyler", "Farklı örneklerde gece kavramını çalışır."], ["inside-match", "İçinde resimlerini eşler", "Farklı örneklerde i̇çinde kavramını çalışır."], ["inside-show", "İçinde resmini gösterir", "Farklı örneklerde i̇çinde kavramını çalışır."], ["inside-name", "İçinde olduğunu söyler", "Farklı örneklerde i̇çinde kavramını çalışır."], ["outside-match", "Dışında resimlerini eşler", "Farklı örneklerde dışında kavramını çalışır."], ["outside-show", "Dışında resmini gösterir", "Farklı örneklerde dışında kavramını çalışır."], ["outside-name", "Dışında olduğunu söyler", "Farklı örneklerde dışında kavramını çalışır."],['big-match','Büyük olanları eşler','Nesnenin büyük olmasını farklı örneklerde çalışır.'],['big-show','Büyük olanı gösterir','Nesnenin büyük olmasını farklı örneklerde çalışır.'],['big-name','Büyük olduğunu söyler','Nesnenin büyük olmasını farklı örneklerde çalışır.'],['small-match','Küçük olanları eşler','Nesnenin küçük olmasını farklı örneklerde çalışır.'],['small-show','Küçük olanı gösterir','Nesnenin küçük olmasını farklı örneklerde çalışır.'],['small-name','Küçük olduğunu söyler','Nesnenin küçük olmasını farklı örneklerde çalışır.'],['heavy-match','Ağır olanları eşler','Nesnenin ağır olmasını farklı örneklerde çalışır.'],['heavy-show','Ağır olanı gösterir','Nesnenin ağır olmasını farklı örneklerde çalışır.'],['heavy-name','Ağır olduğunu söyler','Nesnenin ağır olmasını farklı örneklerde çalışır.'],['light-match','Hafif olanları eşler','Nesnenin hafif olmasını farklı örneklerde çalışır.'],['light-show','Hafif olanı gösterir','Nesnenin hafif olmasını farklı örneklerde çalışır.'],['light-name','Hafif olduğunu söyler','Nesnenin hafif olmasını farklı örneklerde çalışır.'],['clean-match','Temiz olanları eşler','Nesnenin temiz olmasını farklı örneklerde çalışır.'],['clean-show','Temiz olanı gösterir','Nesnenin temiz olmasını farklı örneklerde çalışır.'],['clean-name','Temiz olduğunu söyler','Nesnenin temiz olmasını farklı örneklerde çalışır.'],['dirty-match','Kirli olanları eşler','Nesnenin kirli olmasını farklı örneklerde çalışır.'],['dirty-show','Kirli olanı gösterir','Nesnenin kirli olmasını farklı örneklerde çalışır.'],['dirty-name','Kirli olduğunu söyler','Nesnenin kirli olmasını farklı örneklerde çalışır.'],['hot-match','Sıcak olanları eşler','Nesnenin sıcak olmasını farklı örneklerde çalışır.'],['hot-show','Sıcak olanı gösterir','Nesnenin sıcak olmasını farklı örneklerde çalışır.'],['hot-name','Sıcak olduğunu söyler','Nesnenin sıcak olmasını farklı örneklerde çalışır.'],['cold-match','Soğuk olanları eşler','Nesnenin soğuk olmasını farklı örneklerde çalışır.'],['cold-show','Soğuk olanı gösterir','Nesnenin soğuk olmasını farklı örneklerde çalışır.'],['cold-name','Soğuk olduğunu söyler','Nesnenin soğuk olmasını farklı örneklerde çalışır.'],['young-match','Genç kişileri eşler','Genç kişiyi gösteren resimleri eşler.'],['young-show','Genç kişiyi gösterir','Seçenekler arasından genç kişiyi gösterir.'],['young-name','Genç olduğunu söyler','Kişinin genç olduğunu söyler.'],['old-match','Yaşlı kişileri eşler','Yaşlı kişiyi gösteren resimleri eşler.'],['old-show','Yaşlı kişiyi gösterir','Seçenekler arasından yaşlı kişiyi gösterir.'],['old-name','Yaşlı olduğunu söyler','Kişinin yaşlı olduğunu söyler.'],['short-match','Kısa olanları eşler','Kısa nesneleri şekil ve gerçek nesne resimlerinde eşler.'],['short-show','Kısa olanı gösterir','Seçenekler arasından kısa olanı gösterir.'],['short-name','Kısa olduğunu söyler','İşaretlenen nesnenin kısa olduğunu söyler.'],['length-match','Uzun olanları eşler','Uzun nesneleri şekil ve gerçek nesne resimlerinde eşler.'],['length-show','Uzun olanı gösterir','Seçenekler arasından uzun olanı gösterir.'],['length-name','Uzun olduğunu söyler','İşaretlenen nesnenin uzun olduğunu söyler.'],['color-match','Aynı renkte olanları eşler','Aynı veya farklı tip kart ve nesne resimlerini renklerine göre eşler.'],['color-show','İstenen rengi gösterir','Söylenen rengi kartta, nesnede ve resim içindeki bölgede gösterir.'],['color-name','Rengin adını söyler','Kartın, nesnenin veya işaretlenen bölgenin rengini Türkçe söyler.']]){
    const row=document.createElement('article');row.className='assessment-row';row.dataset.skill=key;row.innerHTML=`<div><strong>${title}</strong><small>${detail}</small></div><div class="status-choice" role="radiogroup" aria-label="${title}"><button type="button" data-status="can">Yapıyor</button><button type="button" data-status="needs">Henüz yapamıyor</button><button type="button" data-status="unknown">Gözlenmedi</button></div>`;document.getElementById('assessmentList').append(row);
  }
  for(const [key,title,detail] of [['action-match','Eylemleri eşler','Aynı eylemi gösteren videoları eşler.'],['action-show','İstenen eylemi gösterir','Eylemin adı söylendiğinde uygun videoyu gösterir.'],['action-name','Eylemin adını söyler','Videoda yapılan eylemi Türkçe adlandırır.']]){
    const row=document.createElement('article');row.className='assessment-row';row.dataset.skill=key;row.innerHTML=`<div><strong>${title}</strong><small>${detail}</small></div><div class="status-choice" role="radiogroup" aria-label="${title}"><button type="button" data-status="can">Yapıyor</button><button type="button" data-status="needs">Henüz yapamıyor</button><button type="button" data-status="unknown">Gözlenmedi</button></div>`;document.getElementById('assessmentList').append(row);
  }
  const eventContent = window.EventSequences;
  for(const type of ['genel','ne','nerede','kim','nasıl','ne zaman','neden']){
    const key=type==='genel'?'wh-questions':'wh-'+type.replace(' ','-');
    const title=type==='genel'?'5N1K sorularını yanıtlar':`“${type}” sorusunu yanıtlar`;
    const row=document.createElement('article');row.className='assessment-row';row.dataset.skill=key;
    row.innerHTML=`<div><strong>${title}</strong><small>İzlediği olayla ilgili yanıt verir.</small></div><div class="status-choice" role="radiogroup" aria-label="${title}"><button type="button" data-status="can">Yapıyor</button><button type="button" data-status="needs">Henüz yapamıyor</button><button type="button" data-status="unknown">Gözlenmedi</button></div>`;
    document.getElementById('assessmentList').append(row);
  }
  let eventRun = 0;
  let eventAdvancePending = false;
  const mascots = {
    pofidik: { name: 'Pofidik', fullName: 'Pofidik Ayı', sprite: 'bear', model: 'pofidik' },
    dila: { name: 'Dila', fullName: 'Dila Panda', sprite: 'panda' },
    kipir: { name: 'Kıpır', fullName: 'Kıpır Kunduz', sprite: 'beaver' },
    mina: { name: 'Mina', fullName: 'Mina Tilki', sprite: 'fox' }
  };
  const buddyPhrases = [
    'Evet, buradayım!',
    'Çok güzel gidiyorsun!',
    'Oynamak ister misin?',
    'Devam edelim mi?',
    'Ben hep yanındayım.',
    'Harikasın, böyle devam!',
    'Bir oyun daha oynayalım mı?',
    'Seninle oynamak çok güzel!',
    'Ne oynayalım, sen söyle!',
    'Bugün çok iyi çalışıyoruz!'
  ];
  const reinforcers = [
    'Aferin!', 'Çok güzel!', 'Bravo!', 'Süpersin!', 'Harikasın!',
    'Mükemmel!', 'Muhteşem!', 'Ne güzel yaptın!', 'Böyle devam et!', 'İşte bu, başardın!'
  ];
  function praise() { return reinforcers[Math.floor(Math.random() * reinforcers.length)]; }
  const trials = [
    { target: ['circle', 'red'], options: [['circle', 'red'], ['circle', 'blue-shape']] },
    { target: ['square', 'red'], options: [['square', 'blue-shape'], ['square', 'red']] },
    { target: ['triangle', 'red'], options: [['triangle', 'red'], ['triangle', 'blue-shape']] },
    { target: ['circle', 'red'], options: [['square', 'blue-shape'], ['triangle', 'red']] },
    { target: ['square', 'red'], options: [['circle', 'red'], ['triangle', 'blue-shape']] }
  ];
  const pairTypes = ['circle', 'square', 'star', 'heart', 'flower', 'diamond'];
  const pairSymbols = { circle: '●', square: '■', star: '★', heart: '♥', flower: '✿', diamond: '◆' };
  const pairTypeNames = { circle: 'yuvarlak', square: 'kare', star: 'yıldız', heart: 'kalp', flower: 'çiçek', diamond: 'baklava' };
  const pairTrials = [
    { correct: 'circle', decoys: ['star', 'heart', 'flower', 'diamond'] },
    { correct: 'star', decoys: ['circle', 'square', 'heart', 'flower'] },
    { correct: 'heart', decoys: ['square', 'star', 'diamond', 'circle'] },
    { correct: 'flower', decoys: ['diamond', 'circle', 'star', 'square'] },
    { correct: 'square', decoys: ['heart', 'flower', 'circle', 'diamond'] }
  ];
  const patternCard = (emoji, name, extraClass = '') => {
    const objects = { '🍎': 'elma', '🍌': 'muz', '🍇': 'uzum', '🐶': 'kopek', '🐱': 'kedi', '🐰': 'tavsan', '🚗': 'araba', '🚌': 'otobus', '🍓': 'cilek', '⚽': 'futbol', '🏀': 'basket', '🎾': 'tenis', '🌸': 'cicek', '🌻': 'aycicegi', '🌷': 'lale', '🐘': 'fil', '🦁': 'aslan', '🐯': 'kaplan', '🚀': 'roket', '🛸': 'uzay', '🚂': 'tren', '🍬': 'seker', '🍊': 'portakal', '🍒': 'kiraz', '🐦': 'kus', '🐟': 'balik', '✈️': 'ucak', '🚢': 'gemi', '🌼': 'papatya', '🌹': 'gul', '🪻': 'menekse', '🏐': 'voleybol', '🎈': 'balon' };
    const symbol = Object.keys(objects).find(symbol => emoji.startsWith(symbol));
    if (!symbol) return { name, html: `<i class="pattern-item${extraClass ? ` ${extraClass}` : ''}">${emoji}</i>` };
    const count = emoji.split(symbol).length - 1;
    return { name, html: `<i class="pattern-item object-pictures${extraClass ? ` ${extraClass}` : ''}" data-count="${count}">${Array.from({ length: count }, () => `<img src="./assets/objects/${objects[symbol]}.webp" alt="" draggable="false" decoding="async">`).join('')}</i>` };
  };
  const patternItems = {
    elma: patternCard('🍎', 'elma'), muz: patternCard('🍌', 'muz'), uzum: patternCard('🍇', 'üzüm'),
    kopek: patternCard('🐶', 'köpek'), kedi: patternCard('🐱', 'kedi'), tavsan: patternCard('🐰', 'tavşan'),
    yildiz: patternCard('⭐', 'yıldız'), ay: patternCard('🌙', 'ay'),
    araba: patternCard('🚗', 'araba'), otobus: patternCard('🚌', 'otobüs'),
    cilek: patternCard('🍓', 'çilek'),
    maviKare: patternCard('🟦', 'mavi kare'), sariKare: patternCard('🟨', 'sarı kare'), kirmiziKare: patternCard('🟥', 'kırmızı kare'), yesilKare: patternCard('🟩', 'yeşil kare'),
    futbol: patternCard('⚽', 'futbol topu'), basket: patternCard('🏀', 'basketbol topu'), tenis: patternCard('🎾', 'tenis topu'),
    cicek: patternCard('🌸', 'pembe çiçek'), aycicegi: patternCard('🌻', 'ayçiçeği'), lale: patternCard('🌷', 'lale'),
    kirmiziDaire: patternCard('🔴', 'kırmızı yuvarlak'), maviDaire: patternCard('🔵', 'mavi yuvarlak'), yesilDaire: patternCard('🟢', 'yeşil yuvarlak'),
    fil: patternCard('🐘', 'fil'), aslan: patternCard('🦁', 'aslan'), kaplan: patternCard('🐯', 'kaplan'),
    kucukTop: patternCard('⚽', 'küçük top', 'is-small'), buyukTop: patternCard('⚽', 'büyük top', 'is-big'),
    roket: patternCard('🚀', 'roket'), uzay: patternCard('🛸', 'uzay gemisi'), tren: patternCard('🚂', 'tren'),
    yukari: patternCard('⬆️', 'yukarı ok'), sag: patternCard('➡️', 'sağ ok'), asagi: patternCard('⬇️', 'aşağı ok'), sol: patternCard('⬅️', 'sol ok'),
    birSeker: patternCard('🍬', 'bir şeker'), ikiSeker: patternCard('🍬🍬', 'iki şeker'), ucSeker: patternCard('🍬🍬🍬', 'üç şeker'),
    kirmiziYuvarlakSekil: { name: 'kırmızı yuvarlak', html: shapeMarkup('circle', 'red') },
    maviKareSekil: { name: 'mavi kare', html: shapeMarkup('square', 'blue-shape') },
    kirmiziKareSekil: { name: 'kırmızı kare', html: shapeMarkup('square', 'red') },
    portakal: patternCard('🍊', 'portakal'), kiraz: patternCard('🍒', 'kiraz'),
    kus: patternCard('🐦', 'kuş'), balik: patternCard('🐟', 'balık'),
    ucak: patternCard('✈️', 'uçak'), gemi: patternCard('🚢', 'gemi'),
    gunes: patternCard('☀️', 'güneş'), bulut: patternCard('☁️', 'bulut'),
    papatya: patternCard('🌼', 'papatya'), gul: patternCard('🌹', 'gül'), menekse: patternCard('🪻', 'mor çiçek'),
    voleybol: patternCard('🏐', 'voleybol'),
    sariDaire: patternCard('🟡', 'sarı yuvarlak'), morDaire: patternCard('🟣', 'mor yuvarlak'), turuncuDaire: patternCard('🟠', 'turuncu yuvarlak'),
    kucukBalon: patternCard('🎈', 'küçük balon', 'is-small'), buyukBalon: patternCard('🎈', 'büyük balon', 'is-big'),
    kucukYildiz: patternCard('⭐', 'küçük yıldız', 'is-small'), buyukYildiz: patternCard('⭐', 'büyük yıldız', 'is-big'),
    kucukKalp: patternCard('❤️', 'küçük kalp', 'is-small'), buyukKalp: patternCard('❤️', 'büyük kalp', 'is-big'),
    kucukCicek: patternCard('🌸', 'küçük çiçek', 'is-small'), buyukCicek: patternCard('🌸', 'büyük çiçek', 'is-big'),
    birElma: patternCard('🍎', 'bir elma'), ikiElma: patternCard('🍎🍎', 'iki elma'), ucElma: patternCard('🍎🍎🍎', 'üç elma'),
    birTop: patternCard('⚽', 'bir top'), ikiTop: patternCard('⚽⚽', 'iki top'), ucTop: patternCard('⚽⚽⚽', 'üç top'),
    birYildiz: { name: 'bir yıldız', html: '<i class="pattern-stars" data-count="1"><span></span></i>' },
    ikiYildiz: { name: 'iki yıldız', html: '<i class="pattern-stars" data-count="2"><span></span><span></span></i>' },
    ucYildiz: { name: 'üç yıldız', html: '<i class="pattern-stars" data-count="3"><span></span><span></span><span></span></i>' },
    birKalp: patternCard('❤️', 'bir kalp'), ikiKalp: patternCard('❤️❤️', 'iki kalp'), ucKalp: patternCard('❤️❤️❤️', 'üç kalp'),
    sariYuvarlakSekil: { name: 'sarı yuvarlak', html: shapeMarkup('circle', 'yellow') },
    morKareSekil: { name: 'mor kare', html: shapeMarkup('square', 'purple') },
    yesilUcgenSekil: { name: 'yeşil üçgen', html: shapeMarkup('triangle', 'green') },
    maviUcgenSekil: { name: 'mavi üçgen', html: shapeMarkup('triangle', 'blue-shape') },
    sariKareSekil: { name: 'sarı kare', html: shapeMarkup('square', 'yellow') },
    yesilYuvarlakSekil: { name: 'yeşil yuvarlak', html: shapeMarkup('circle', 'green') }
  };
  const patternLevels = [
    {
      title: 'İki nesne sırası', tag: 'A-B-A-B',
      examples: [
        { shown: ['elma', 'muz', 'elma', 'muz'], answer: 'elma', decoy: 'muz' },
        { shown: ['kopek', 'kedi', 'kopek', 'kedi'], answer: 'kopek', decoy: 'kedi' },
        { shown: ['araba', 'otobus', 'araba', 'otobus'], answer: 'araba', decoy: 'otobus' },
        { shown: ['yildiz', 'ay', 'yildiz', 'ay'], answer: 'yildiz', decoy: 'ay' },
        { shown: ['futbol', 'basket', 'futbol', 'basket'], answer: 'futbol', decoy: 'basket' }
      ]
    },
    {
      title: 'Uzun iki nesne sırası', tag: 'A-B-A-B-A',
      examples: [
        { shown: ['cilek', 'portakal', 'cilek', 'portakal', 'cilek'], answer: 'portakal', decoy: 'cilek' },
        { shown: ['kus', 'balik', 'kus', 'balik', 'kus'], answer: 'balik', decoy: 'kus' },
        { shown: ['tren', 'ucak', 'tren', 'ucak', 'tren'], answer: 'ucak', decoy: 'tren' },
        { shown: ['gul', 'papatya', 'gul', 'papatya', 'gul'], answer: 'papatya', decoy: 'gul' },
        { shown: ['maviDaire', 'kirmiziDaire', 'maviDaire', 'kirmiziDaire', 'maviDaire'], answer: 'kirmiziDaire', decoy: 'maviDaire' }
      ]
    },
    {
      title: 'İkili gruplar', tag: 'A-A-B-B',
      examples: [
        { shown: ['kopek', 'kopek', 'kedi', 'kedi'], answer: 'kopek', decoy: 'kedi' },
        { shown: ['elma', 'elma', 'muz', 'muz'], answer: 'elma', decoy: 'muz' },
        { shown: ['araba', 'araba', 'otobus', 'otobus'], answer: 'araba', decoy: 'otobus' },
        { shown: ['cicek', 'cicek', 'aycicegi', 'aycicegi'], answer: 'cicek', decoy: 'aycicegi' },
        { shown: ['sariKare', 'sariKare', 'kirmiziKare', 'kirmiziKare'], answer: 'sariKare', decoy: 'kirmiziKare' }
      ]
    },
    {
      title: 'Tek-çift sırası', tag: 'A-B-B-A-B',
      examples: [
        { shown: ['elma', 'muz', 'muz', 'elma', 'muz'], answer: 'muz', decoy: 'elma' },
        { shown: ['kopek', 'kedi', 'kedi', 'kopek', 'kedi'], answer: 'kedi', decoy: 'kopek' },
        { shown: ['araba', 'otobus', 'otobus', 'araba', 'otobus'], answer: 'otobus', decoy: 'araba' },
        { shown: ['yildiz', 'ay', 'ay', 'yildiz', 'ay'], answer: 'ay', decoy: 'yildiz' },
        { shown: ['futbol', 'basket', 'basket', 'futbol', 'basket'], answer: 'basket', decoy: 'futbol' }
      ]
    },
    {
      title: 'Üçlü sıra', tag: 'A-B-C-A-B',
      examples: [
        { shown: ['cilek', 'elma', 'portakal', 'cilek', 'elma'], answer: 'portakal', decoy: 'cilek' },
        { shown: ['kopek', 'kedi', 'tavsan', 'kopek', 'kedi'], answer: 'tavsan', decoy: 'kopek' },
        { shown: ['araba', 'otobus', 'tren', 'araba', 'otobus'], answer: 'tren', decoy: 'araba' },
        { shown: ['cicek', 'aycicegi', 'lale', 'cicek', 'aycicegi'], answer: 'lale', decoy: 'cicek' },
        { shown: ['kirmiziDaire', 'maviDaire', 'sariDaire', 'kirmiziDaire', 'maviDaire'], answer: 'sariDaire', decoy: 'kirmiziDaire' }
      ]
    },
    {
      title: 'Blok sırası', tag: 'A-B-B-A-B-B',
      examples: [
        { shown: ['maviKare', 'sariKare', 'sariKare', 'maviKare', 'sariKare', 'sariKare'], answer: 'maviKare', decoy: 'sariKare' },
        { shown: ['elma', 'muz', 'muz', 'elma', 'muz', 'muz'], answer: 'elma', decoy: 'muz' },
        { shown: ['kopek', 'kedi', 'kedi', 'kopek', 'kedi', 'kedi'], answer: 'kopek', decoy: 'kedi' },
        { shown: ['araba', 'otobus', 'otobus', 'araba', 'otobus', 'otobus'], answer: 'araba', decoy: 'otobus' },
        { shown: ['cicek', 'lale', 'lale', 'cicek', 'lale', 'lale'], answer: 'cicek', decoy: 'lale' }
      ]
    },
    {
      title: 'Üçlü gruplar', tag: 'A-A-B-B-C-C',
      examples: [
        { shown: ['futbol', 'futbol', 'basket', 'basket', 'tenis', 'tenis'], answer: 'futbol', decoy: 'basket' },
        { shown: ['kopek', 'kopek', 'kedi', 'kedi', 'tavsan', 'tavsan'], answer: 'kopek', decoy: 'kedi' },
        { shown: ['elma', 'elma', 'muz', 'muz', 'cilek', 'cilek'], answer: 'elma', decoy: 'muz' },
        { shown: ['araba', 'araba', 'otobus', 'otobus', 'tren', 'tren'], answer: 'araba', decoy: 'otobus' },
        { shown: ['maviKare', 'maviKare', 'sariKare', 'sariKare', 'kirmiziKare', 'kirmiziKare'], answer: 'maviKare', decoy: 'sariKare' }
      ]
    },
    {
      title: 'Uzun üçlü sıra', tag: 'A-B-C-A-B-C-A',
      examples: [
        { shown: ['cicek', 'aycicegi', 'lale', 'cicek', 'aycicegi', 'lale', 'cicek'], answer: 'aycicegi', decoy: 'cicek' },
        { shown: ['kopek', 'kedi', 'tavsan', 'kopek', 'kedi', 'tavsan', 'kopek'], answer: 'kedi', decoy: 'kopek' },
        { shown: ['elma', 'muz', 'cilek', 'elma', 'muz', 'cilek', 'elma'], answer: 'muz', decoy: 'elma' },
        { shown: ['araba', 'tren', 'ucak', 'araba', 'tren', 'ucak', 'araba'], answer: 'tren', decoy: 'araba' },
        { shown: ['yildiz', 'ay', 'gunes', 'yildiz', 'ay', 'gunes', 'yildiz'], answer: 'ay', decoy: 'yildiz' }
      ]
    },
    {
      title: 'Renk sırası', tag: '🔴 🔵 🔴 🔵',
      examples: [
        { shown: ['kirmiziDaire', 'maviDaire', 'kirmiziDaire', 'maviDaire', 'kirmiziDaire'], answer: 'maviDaire', decoy: 'kirmiziDaire' },
        { shown: ['yesilDaire', 'sariDaire', 'yesilDaire', 'sariDaire', 'yesilDaire'], answer: 'sariDaire', decoy: 'yesilDaire' },
        { shown: ['turuncuDaire', 'morDaire', 'turuncuDaire', 'morDaire', 'turuncuDaire'], answer: 'morDaire', decoy: 'turuncuDaire' },
        { shown: ['kirmiziDaire', 'yesilDaire', 'kirmiziDaire', 'yesilDaire', 'kirmiziDaire'], answer: 'yesilDaire', decoy: 'kirmiziDaire' },
        { shown: ['maviDaire', 'sariDaire', 'maviDaire', 'sariDaire', 'maviDaire'], answer: 'sariDaire', decoy: 'maviDaire' }
      ]
    },
    {
      title: 'Karışık sıra', tag: 'A-B-A-C-A-B',
      examples: [
        { shown: ['fil', 'aslan', 'fil', 'kaplan', 'fil', 'aslan'], answer: 'fil', decoy: 'kaplan' },
        { shown: ['kopek', 'kedi', 'kopek', 'tavsan', 'kopek', 'kedi'], answer: 'kopek', decoy: 'kedi' },
        { shown: ['elma', 'muz', 'elma', 'cilek', 'elma', 'muz'], answer: 'elma', decoy: 'muz' },
        { shown: ['araba', 'otobus', 'araba', 'tren', 'araba', 'otobus'], answer: 'araba', decoy: 'otobus' },
        { shown: ['yildiz', 'ay', 'yildiz', 'gunes', 'yildiz', 'ay'], answer: 'yildiz', decoy: 'ay' }
      ]
    },
    {
      title: 'Büyük-küçük sırası', tag: 'Küçük-büyük',
      examples: [
        { shown: ['kucukTop', 'buyukTop', 'kucukTop', 'buyukTop', 'kucukTop'], answer: 'kucukTop', decoy: 'buyukTop' },
        { shown: ['buyukBalon', 'kucukBalon', 'buyukBalon', 'kucukBalon', 'buyukBalon'], answer: 'kucukBalon', decoy: 'buyukBalon' },
        { shown: ['kucukYildiz', 'buyukYildiz', 'kucukYildiz', 'buyukYildiz', 'kucukYildiz'], answer: 'kucukYildiz', decoy: 'buyukYildiz' },
        { shown: ['buyukKalp', 'kucukKalp', 'buyukKalp', 'kucukKalp', 'buyukKalp'], answer: 'kucukKalp', decoy: 'buyukKalp' },
        { shown: ['kucukCicek', 'buyukCicek', 'kucukCicek', 'buyukCicek', 'kucukCicek'], answer: 'kucukCicek', decoy: 'buyukCicek' }
      ]
    },
    {
      title: 'Ortalı sıra', tag: 'A-B-C-B-A-B',
      examples: [
        { shown: ['roket', 'uzay', 'tren', 'uzay', 'roket', 'uzay', 'tren'], answer: 'uzay', decoy: 'roket' },
        { shown: ['elma', 'muz', 'cilek', 'muz', 'elma', 'muz', 'cilek'], answer: 'muz', decoy: 'elma' },
        { shown: ['kopek', 'kedi', 'tavsan', 'kedi', 'kopek', 'kedi', 'tavsan'], answer: 'kedi', decoy: 'kopek' },
        { shown: ['araba', 'otobus', 'tren', 'otobus', 'araba', 'otobus', 'tren'], answer: 'otobus', decoy: 'araba' },
        { shown: ['yildiz', 'ay', 'gunes', 'ay', 'yildiz', 'ay', 'gunes'], answer: 'ay', decoy: 'yildiz' }
      ]
    },
    {
      title: 'Yön sırası', tag: '⬆️ ➡️ ⬇️ dönüşü',
      examples: [
        { shown: ['yukari', 'sag', 'asagi', 'yukari', 'sag'], answer: 'asagi', decoy: 'yukari' },
        { shown: ['sag', 'asagi', 'sol', 'sag', 'asagi'], answer: 'sol', decoy: 'sag' },
        { shown: ['asagi', 'sol', 'yukari', 'asagi', 'sol'], answer: 'yukari', decoy: 'asagi' },
        { shown: ['sol', 'yukari', 'sag', 'sol', 'yukari'], answer: 'sag', decoy: 'sol' },
        { shown: ['yukari', 'sol', 'asagi', 'yukari', 'sol'], answer: 'asagi', decoy: 'yukari' }
      ]
    },
    {
      title: 'Sayı sırası', tag: '🍬 🍬🍬 🍬🍬🍬',
      examples: [
        { shown: ['birSeker', 'ikiSeker', 'ucSeker', 'birSeker', 'ikiSeker'], answer: 'ucSeker', decoy: 'birSeker' },
        { shown: ['birElma', 'ikiElma', 'ucElma', 'birElma', 'ikiElma'], answer: 'ucElma', decoy: 'birElma' },
        { shown: ['birTop', 'ikiTop', 'ucTop', 'birTop', 'ikiTop'], answer: 'ucTop', decoy: 'birTop' },
        { shown: ['birYildiz', 'ikiYildiz', 'ucYildiz', 'birYildiz', 'ikiYildiz'], answer: 'ucYildiz', decoy: 'birYildiz' },
        { shown: ['birKalp', 'ikiKalp', 'ucKalp', 'birKalp', 'ikiKalp'], answer: 'ucKalp', decoy: 'birKalp' }
      ]
    },
    {
      title: 'Karmaşık örüntüler', tag: 'Renk, şekil ve grup sırası',
      examples: [
        { shown: ['kirmiziYuvarlakSekil', 'maviKareSekil', 'maviKareSekil', 'yesilUcgenSekil', 'kirmiziYuvarlakSekil', 'maviKareSekil', 'maviKareSekil', 'yesilUcgenSekil', 'kirmiziYuvarlakSekil', 'maviKareSekil'], answer: 'maviKareSekil', decoy: 'yesilUcgenSekil' },
        { shown: ['sariYuvarlakSekil', 'sariYuvarlakSekil', 'morKareSekil', 'yesilUcgenSekil', 'sariYuvarlakSekil', 'sariYuvarlakSekil', 'morKareSekil', 'yesilUcgenSekil', 'sariYuvarlakSekil', 'sariYuvarlakSekil'], answer: 'morKareSekil', decoy: 'sariYuvarlakSekil' },
        { shown: ['kirmiziYuvarlakSekil', 'maviKareSekil', 'kirmiziYuvarlakSekil', 'yesilUcgenSekil', 'kirmiziYuvarlakSekil', 'maviKareSekil', 'kirmiziYuvarlakSekil', 'yesilUcgenSekil', 'kirmiziYuvarlakSekil'], answer: 'maviKareSekil', decoy: 'yesilUcgenSekil' },
        { shown: ['maviUcgenSekil', 'sariKareSekil', 'morKareSekil', 'sariKareSekil', 'maviUcgenSekil', 'sariKareSekil', 'morKareSekil', 'sariKareSekil', 'maviUcgenSekil', 'sariKareSekil', 'morKareSekil'], answer: 'sariKareSekil', decoy: 'maviUcgenSekil' },
        { shown: ['kirmiziKareSekil', 'yesilYuvarlakSekil', 'yesilYuvarlakSekil', 'maviUcgenSekil', 'maviUcgenSekil', 'kirmiziKareSekil', 'yesilYuvarlakSekil', 'yesilYuvarlakSekil', 'maviUcgenSekil', 'maviUcgenSekil', 'kirmiziKareSekil'], answer: 'yesilYuvarlakSekil', decoy: 'maviUcgenSekil' }
      ]
    }
  ];
  const patternExample = () => patternLevels[state.patternLevel - 1].examples[state.trial];
  const state = {
    screen: 'welcome', history: [], profile: { name: '', age: '', diagnosis: '' }, avatar: null,
    buddyActivated: false, assessment: {}, chooser: 'child', method: null, category: 'cognitive', editingAssessment: false,
    plan: 'free', skill: 'two-color', trial: 0, patternLevel: 1, eventLevel: 1, levelSkill: 'pattern', eventPlaced: [], eventBusy: false, hadPrompt: false, attempts: 0, pairWrongTries: 0, selectedPair: [], stats: { independent: 0, prompted: 0, incorrect: 0 }
  };

  let promptTimer = null;
  const objectData = window.ObjectMatchingData;
  const objectMatching = window.ObjectMatching.create({state, speak, praise, finishBlock});
  state.matchItem = 'cat'; state.matchCategory = 'animals'; state.matchLevel = 1;
  let bubbles = 3;
  let buddyPhraseIndex = -1;
  let speechToken = 0;

  function loadAudioSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(audioStorageKey) || 'null');
      if (saved) {
        audioSettings.enabled = saved.enabled !== false;
        const savedVolume = Number(saved.volume);
        const savedLastVolume = Number(saved.lastVolume);
        if (Number.isFinite(savedVolume)) audioSettings.volume = Math.min(1, Math.max(0, savedVolume));
        if (Number.isFinite(savedLastVolume) && savedLastVolume > 0) audioSettings.lastVolume = Math.min(1, savedLastVolume);
      }
    } catch (_) {}
    backgroundMusic.volume = audioSettings.volume;
    syncAudioUI();
  }
  function saveAudioSettings() {
    localStorage.setItem(audioStorageKey, JSON.stringify(audioSettings));
  }
  function musicCanPlay() { return state.screen!=='action-preview' && !Array.from(document.querySelectorAll('#musicChoices audio')).some(a=>!a.paused) && audioSettings.enabled && !musicBlockedScreens.has(state.screen); }
  function tryStartMusic() {
    if (!musicCanPlay()) { backgroundMusic.pause(); return; }
    backgroundMusic.volume = audioSettings.volume;
    const playAttempt = backgroundMusic.play();
    if (playAttempt?.catch) playAttempt.catch(() => {});
  }
  function syncAudioUI() {
    const audible = audioSettings.enabled && audioSettings.volume > 0;
    document.querySelectorAll('#quickMuteTop, #quickMuteWelcome').forEach(button => {
      button.setAttribute('aria-pressed', String(!audible));
      button.setAttribute('aria-label', audible ? 'Müziği kapat' : 'Müziği aç');
      button.firstChild.textContent = audible ? '🔊 ' : '🔇 ';
    });
    const toggle = document.getElementById('musicToggle');
    if (toggle) { toggle.textContent = audible ? 'Açık' : 'Kapalı'; toggle.setAttribute('aria-pressed', String(audible)); toggle.classList.toggle('is-on', audible); }
    const range = document.getElementById('musicVolume');
    const value = document.getElementById('musicVolumeValue');
    if (range) range.value = String(Math.round(audioSettings.volume * 100));
    if (value) value.textContent = `${Math.round(audioSettings.volume * 100)}%`;
  }
  function toggleMusic() {
    if (audioSettings.enabled && audioSettings.volume > 0) {
      audioSettings.lastVolume = audioSettings.volume;
      audioSettings.enabled = false;
      backgroundMusic.pause();
    } else {
      audioSettings.enabled = true;
      if (audioSettings.volume === 0) audioSettings.volume = audioSettings.lastVolume || .35;
      tryStartMusic();
    }
    saveAudioSettings(); syncAudioUI();
  }
  function setMusicVolume(percent) {
    audioSettings.volume = Math.min(1, Math.max(0, Number(percent) / 100));
    if (audioSettings.volume > 0) { audioSettings.enabled = true; audioSettings.lastVolume = audioSettings.volume; }
    else audioSettings.enabled = false;
    backgroundMusic.volume = audioSettings.volume;
    if (audioSettings.enabled) tryStartMusic(); else backgroundMusic.pause();
    saveAudioSettings(); syncAudioUI();
  }

  function speak(key, text, onComplete) {
    if (!('speechSynthesis' in window)) { onComplete?.(); return; }
    const profile = mascots[key] || mascots.pofidik;
    window.speechSynthesis.cancel();
    window.Pofidik3D?.setSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text || 'Selam, ben senin yeni oyun arkadaşın.');
    utterance.character=key;utterance.lang = 'tr-TR';

    const token = ++speechToken;
    utterance.onstart = () => { if (token === speechToken && profile.model === 'pofidik') window.Pofidik3D?.setSpeaking(true); };
    utterance.onend = () => { if (token === speechToken) { window.Pofidik3D?.setSpeaking(false); onComplete?.(); } };
    utterance.onerror = () => { if (token !== speechToken) return; window.Pofidik3D?.setSpeaking(false); if(state.screen==='activity'){document.getElementById('feedback').textContent='Ses açılamadı. Yardım düğmesiyle yeniden dene.';}else onComplete?.(); };
    window.speechSynthesis.speak(utterance);
  }

  function showScreen(name, push = true) {
    if(state.screen==='island-game'&&name!=='island-game')document.getElementById('islandGameFrame').src='about:blank';
    if(state.screen==='color-teaching'&&name!=='color-teaching')document.getElementById('colorTeachingFrame').src='about:blank';
    if(state.screen==='action-preview'&&name!=='action-preview')document.getElementById('actionPreviewFrame').src='about:blank';
    if(window.ParentGate && !window.ParentGate.allow(name)){window.ParentGate.open(name);return;}
    window.ParentGate?.stopPreviews();
    if(state.screen==='naming'&&name!=='naming')document.getElementById('namingFrame').src='about:blank';
    if (name !== 'activity') objectMatching.stop();
    clearTimeout(promptTimer);
    if (push && state.screen !== name) state.history.push(state.screen);
    state.screen = name;
    screens.forEach(s => s.classList.toggle('is-active', s.dataset.screen === name));
    topbar.hidden = name === 'welcome';
    document.getElementById('backButton').style.visibility = state.history.length ? 'visible' : 'hidden';
    const buddyHiddenScreens = ['welcome', 'pin', 'guardian', 'profile', 'avatar', 'intro','naming','action-preview','color-teaching','island-game'];
    floatingBuddy.hidden = !state.avatar || !state.buddyActivated || buddyHiddenScreens.includes(name);
    if (musicBlockedScreens.has(name)) backgroundMusic.pause(); else tryStartMusic();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function saveState() {
    const safeState = {
      profile: { name: state.profile.name, age: state.profile.age }, avatar: state.avatar,
      buddyActivated: state.buddyActivated, assessment: state.assessment, chooser: state.chooser,
      method: state.method, plan: state.plan, lastStats: state.stats
    };
    localStorage.setItem(storageKey, JSON.stringify(safeState));
    sessionStorage.setItem(`${storageKey}:diagnosis`, state.profile.diagnosis || '');
  }
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved) {
        state.profile = { ...state.profile, ...(saved.profile || {}) };
        state.avatar = saved.avatar === 'mimo' ? 'pofidik' : (mascots[saved.avatar] ? saved.avatar : null); state.buddyActivated = !!saved.buddyActivated;
        state.assessment = saved.assessment || {}; state.chooser = saved.chooser || 'child'; state.method = saved.method || null;
        state.plan = saved.plan === 'premium' ? 'premium' : 'free';
      }
      state.profile.diagnosis = sessionStorage.getItem(`${storageKey}:diagnosis`) || '';
    } catch (_) {}
  }
  function mascot() { return mascots[state.avatar] || mascots.pofidik; }
  function profileName(key){return (mascots[key]||mascots.pofidik).fullName;}
  function selectionMessage(key){const name=profileName(key),messages=[`Selam! Ben ${name}. Beni seçmek ister misin?`,`Merhaba! Ben ${name}. Benimle oynamak ister misin?`,`Selam! Ben ${name}. Birlikte oyun oynayalım mı?`];return messages[Math.floor(Math.random()*messages.length)];}
  function updateMascotDisplays() {
    const selected = mascot();
    document.querySelectorAll('[data-mascot-display]').forEach(el => {
      el.classList.toggle('is-pofidik', selected.model === 'pofidik');
      el.dataset.sprite = selected.sprite;
    });
    window.Pofidik3D?.refresh();
  }
  function setAvatar(key, announce = true) {
    state.avatar = key;window.CharacterVoice?.set(key); updateMascotDisplays();
    document.querySelectorAll('.avatar-card').forEach(c => c.classList.toggle('is-selected', c.dataset.avatar === key));
    document.getElementById('avatarContinue').disabled = false;
    if (key === 'pofidik') window.Pofidik3D?.play(document.querySelector('.avatar-card[data-avatar="pofidik"]'), 'curious');
    if (announce) {
      speak(key,selectionMessage(key));
    }
  }
  function introMessage() {
    const child = state.profile.name ? ` ${state.profile.name}` : '';
    return `Merhaba${child}! Ben ${mascot().name}. Bundan sonra senin oyun arkadaşınım. Oyunlar oynarken hep yanında olacağım ve ihtiyacın olduğunda sana yardım edeceğim. Hazırsan başlayalım!`;
  }
  function prepareIntro() {
    updateMascotDisplays();
    document.getElementById('introTitle').textContent = `Ben ${mascot().name}!`;
    document.getElementById('introText').textContent = introMessage();
    document.getElementById('readyButton').disabled = false;
    document.getElementById('readyButton').textContent = 'Hazırım';
    if (state.avatar === 'pofidik') window.setTimeout(() => window.Pofidik3D?.play(document.querySelector('.intro-mascot'), 'nod_yes'), 120);
  }

  function restoreAssessmentUI() {
    document.querySelectorAll('.assessment-row').forEach(row => {
      const value = state.assessment[row.dataset.skill];
      row.querySelectorAll('[data-status]').forEach(button => {
        const selected = button.dataset.status === value;
        button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected));
      });
    });
  }
  function updateAssessmentMode() {
    document.getElementById('assessmentContinue').textContent = state.editingAssessment ? 'Tamamla' : 'Yöntem seçimine geç';
  }
  function setMethod(method) {
    state.method = method;
    document.querySelectorAll('[data-method]').forEach(c => c.classList.toggle('is-selected', c.dataset.method === method));
    document.getElementById('methodContinue').disabled = false;
    const confirm = document.getElementById('methodConfirm');
    confirm.hidden = false;
    confirm.textContent = method === 'immediate' ? 'Seçilen yöntem: Eşzamanlı öğretim prototipi' : 'Seçilen yöntem: 4 saniye sabit bekleme süreli öğretim prototipi';
  }

  function renderPlatform() {
    const open = Object.keys(skillNames).filter(key => !legacyColorSkills.has(key)&&state.assessment[key] !== 'can');
    document.getElementById('cognitiveCount').textContent = `${open.filter(key=>!['object-name','action-name','color-name','length-name','short-name','young-name','old-name','clean-name','dirty-name','hot-name','cold-name','big-name','small-name','heavy-name','light-name','thin-name','thick-name','day-name','night-name','inside-name','outside-name','full-name','empty-name','new-name','worn-name','hard-name','soft-name','wet-name','dry-name'].includes(key)).length} çalışma`;
    document.getElementById('languageCount').textContent=`${open.filter(key=>['object-name','action-name','color-name','length-name','short-name','young-name','old-name','clean-name','dirty-name','hot-name','cold-name','big-name','small-name','heavy-name','light-name','thin-name','thick-name','day-name','night-name','inside-name','outside-name','full-name','empty-name','new-name','worn-name','hard-name','soft-name','wet-name','dry-name'].includes(key)).length} çalışma`;
  }
  const planInfo = {
    free: { title: 'Premium üyelik', detail: 'Aylık 300 ₺ · Ödeme ekranından üyeliği başlatabilirsin.' },
    premium: { title: 'Premium üyelik', detail: 'Aylık 300 ₺ · Tüm çalışmalar ve gelecek içerikler açık.' }
  };
  function renderPlanUI() {
    const premium = state.plan === 'premium';
    const info = planInfo[premium ? 'premium' : 'free'];
    const status = document.getElementById('planStatus');
    if (status) {
      status.textContent = info.title;
      status.className = `plan-status ${premium ? 'is-premium' : 'is-free'}`;
    }
    const detail = document.getElementById('planStatusDetail');
    if (detail) detail.textContent = info.detail;
    const settingsLabel = document.getElementById('settingsPlanLabel');
    if (settingsLabel) settingsLabel.textContent = info.title;
    const settingsButton = document.getElementById('settingsPlanButton');
    if (settingsButton) settingsButton.textContent = premium ? 'Planı görüntüle' : 'Planı yönet';
    const chip = document.getElementById('welcomePlanButton');
    if (chip) chip.textContent = premium ? '⭐ Premium üye' : '🛒 Satın al';
    const premiumCard = document.getElementById('planPremium');
    if (premiumCard) {
      premiumCard.classList.toggle('is-active', premium);
    }
    const activate = document.getElementById('planActivate');
    if (activate) activate.textContent = premium ? 'Premium aktif' : 'Ödeme ekranına geç';
  }
  let skillFolder=[];
  const skillGroups={
    cognitive:[
      {id:'objects',title:'Nesneler',icon:'🧩',children:['object-show','object-match']},
      'pattern','events','wh-questions',
      {id:'opposites',title:'Zıt kavramlar',icon:'↔️',children:[{id:'length',title:'Uzun–kısa',icon:'📏',children:['length-match','length-show','short-match','short-show']},{id:'age',title:'Genç–yaşlı',icon:'👥',children:['young-match','young-show','old-match','old-show']},{id:'cleanliness',title:'Kirli–temiz',icon:'🫧',children:['dirty-match','dirty-show','clean-match','clean-show']},{id:'temperature',title:'Sıcak–soğuk',icon:'🌡️',children:['hot-match','hot-show','cold-match','cold-show']},{id:'size',title:'Büyük–küçük',icon:'🔎',children:['big-match','big-show','small-match','small-show']},{id:'weight',title:'Ağır–hafif',icon:'⚖️',children:['heavy-match','heavy-show','light-match','light-show']},{id:'thickness',title:'İnce–kalın',icon:'📚',children:["thin-match", "thin-show", "thick-match", "thick-show"]},{id:'time',title:'Gece–gündüz',icon:'🌗',children:["night-match", "night-show", "day-match", "day-show"]},{id:'position',title:'İçinde–dışında',icon:'📦',children:["inside-match", "inside-show", "outside-match", "outside-show"]},{id:'capacity',title:'Dolu–boş',icon:'🫙',children:['full-match','full-show','empty-match','empty-show']},{id:'condition',title:'Yeni–eski',icon:'✨',children:['new-match','new-show','worn-match','worn-show']},{id:'hardness',title:'Sert–yumuşak',icon:'🧽',children:['hard-match','hard-show','soft-match','soft-show']},{id:'moisture',title:'Islak–kuru',icon:'💧',children:['wet-match','wet-show','dry-match','dry-show']}]},
      {id:'colors',title:'Renkler',icon:'🎨',children:['color-match','color-show']},
      {id:'actions',title:'Eylemler',icon:'👋',children:['action-match','action-show']}
    ],
    language:['object-name',{id:'opposites',title:'Zıt kavramlar',icon:'↔️',children:[{id:'length',title:'Uzun–kısa',icon:'📏',children:['length-name','short-name']},{id:'age',title:'Genç–yaşlı',icon:'👥',children:['young-name','old-name']},{id:'cleanliness',title:'Kirli–temiz',icon:'🫧',children:['dirty-name','clean-name']},{id:'temperature',title:'Sıcak–soğuk',icon:'🌡️',children:['hot-name','cold-name']},{id:'size',title:'Büyük–küçük',icon:'🔎',children:['big-name','small-name']},{id:'weight',title:'Ağır–hafif',icon:'⚖️',children:['heavy-name','light-name']},{id:'thickness',title:'İnce–kalın',icon:'📚',children:['thin-name','thick-name']},{id:'time',title:'Gece–gündüz',icon:'🌗',children:['day-name','night-name']},{id:'position',title:'İçinde–dışında',icon:'📦',children:['inside-name','outside-name']},{id:'capacity',title:'Dolu–boş',icon:'🫙',children:['full-name','empty-name']},{id:'condition',title:'Yeni–eski',icon:'✨',children:['new-name','worn-name']},{id:'hardness',title:'Sert–yumuşak',icon:'🧽',children:['hard-name','soft-name']},{id:'moisture',title:'Islak–kuru',icon:'💧',children:['wet-name','dry-name']}]},'color-name','action-name']
  };
  function renderCategory(category = state.category,folder=[]) {
    skillFolder=folder;
    state.category = category;
    const list = document.getElementById('skillList');
    list.classList.toggle('games-grid',category==='games');
    if(category==='games'){document.getElementById('categoryKicker').textContent='Oyunlar';document.getElementById('categoryTitle').textContent='Oyun seç';document.getElementById('categoryBack').textContent='← Ana menüye dön';list.innerHTML='<button class="treasure-game-card" type="button" data-open-island><img src="./assets/games/treasure-icon.png" alt=""><strong>Pofidik’in Hazine Şifresi</strong></button>';return;}
    if (!['cognitive','language'].includes(category)) {
      const titles = { language: 'Dil ve İletişim', social: 'Sosyal Beceriler', daily: 'Günlük Yaşam' };
      document.getElementById('categoryKicker').textContent = titles[category];
      document.getElementById('categoryTitle').textContent = 'Bu kategori sonraki kapsamda';
      list.innerHTML = '<div class="empty-state"><span>🧭</span><strong>Henüz etkinlik eklenmedi</strong><p>İlk sürümde yalnızca eşleme ve renk becerileri çalışılıyor.</p></div>';
      return;
    }
    document.getElementById('categoryKicker').textContent = category==='language'?'Dil ve İletişim':'Bilişsel Beceriler';
    let entries=skillGroups[category],folderTitle='Çalışılacak beceriler';for(const id of folder){const group=entries.find(e=>typeof e==='object'&&e.id===id);if(!group){skillFolder=[];entries=skillGroups[category];break;}entries=group.children;folderTitle=group.title;}
    document.getElementById('categoryTitle').textContent=folderTitle;document.getElementById('categoryBack').textContent=skillFolder.length?'← Geri':'← Ana menüye dön';
    const open = Object.keys(skillNames).filter(key => !legacyColorSkills.has(key)&&state.assessment[key] !== 'can' && (category==='language'?['object-name','action-name','color-name','length-name','short-name','young-name','old-name','clean-name','dirty-name','hot-name','cold-name','big-name','small-name','heavy-name','light-name','thin-name','thick-name','day-name','night-name','inside-name','outside-name','full-name','empty-name','new-name','worn-name','hard-name','soft-name','wet-name','dry-name'].includes(key):!['object-name','action-name','color-name','length-name','short-name','young-name','old-name','clean-name','dirty-name','hot-name','cold-name','big-name','small-name','heavy-name','light-name','thin-name','thick-name','day-name','night-name','inside-name','outside-name','full-name','empty-name','new-name','worn-name','hard-name','soft-name','wet-name','dry-name'].includes(key)));
    if (!open.length) {
      list.innerHTML = '<div class="empty-state"><span>🌟</span><strong>Bu bölümde çalışılacak beceri görünmüyor</strong><p>Kaba değerlendirmede tüm beceriler “Yapıyor” olarak işaretlendi.</p></div>';
      return;
    }
    const visible=entry=>typeof entry==='string'?open.includes(entry):entry.children.some(visible);
    const rows = entries.filter(visible).map(entry => {
      if(typeof entry!=='string')return `<article class="skill-item"><span class="skill-icon">${entry.icon}</span><div><strong>${entry.title}</strong></div><button class="primary-button" type="button" data-skill-folder="${entry.id}">İçine gir</button></article>`;
      const key=entry;
      const skill = skillNames[key]; const playable = skill.playable;
      const status = state.assessment[key];
      const label = status === 'needs' ? 'Kaba değerlendirme: Henüz yapamıyor' : status === 'unknown' ? 'Kaba değerlendirme: Gözlenmedi' : 'Kaba değerlendirme: İşaretlenmedi';
      const action = key==='wh-questions'?'<button class="primary-button" type="button" data-open-wh>Seviyeleri aç</button>':(['length','short','young','old','clean','dirty','hot','cold','big','small','heavy','light','thin','thick','day','night','inside','outside','full','empty','new','worn','hard','soft','wet','dry'].includes(key.split('-')[0]))?`<button class="primary-button" type="button" data-open-color="${key}">Basamakları aç</button>`:key.startsWith('color-')?`<button class="primary-button" type="button" data-open-color="${key}">Renkleri aç</button>`:key.startsWith('action-')?`<button class="primary-button" type="button" data-open-action="${key}">Eylemleri aç</button>`:key==='object-name'?'<button class="primary-button" type="button" data-open-naming>Kategorileri aç</button>':key === 'object-show' ? '<button class="primary-button" type="button" data-open-pointing>Kategorileri aç</button>' : key === 'object-match' ? '<button class="primary-button" type="button" data-open-matching>Kategorileri aç</button>' : !playable ? '<button class="secondary-button" type="button" disabled>Hazırlanıyor</button>' : key === 'pattern' || key === 'events'
        ? `<button class="primary-button" type="button" data-open-levels="${key}">Seviyeleri aç</button>`
        : `<button class="primary-button" type="button" data-start-skill="${key}">5 denemeyi başlat</button>`;
      return `<article class="skill-item"><span class="skill-icon">${skill.icon}</span><div><strong>${skill.title}</strong><small>${skill.description}</small><span class="skill-status">${label}</span></div>${action}</article>`;
    });
    list.innerHTML = rows.join('');
  }
  function renderPatternLevels(skill = 'pattern') {
    state.levelSkill = skill;
    const levels = skill === 'events' ? eventContent.levels : patternLevels;
    document.getElementById('levelsKicker').textContent = skill === 'events' ? 'Bilişsel beceriler · Olayları sıralama' : 'Bilişsel beceriler · Örüntü';
    const list = document.getElementById('levelList');
    list.innerHTML = levels.map((level, index) => `
      <button class="level-card" type="button" data-level="${index + 1}">
        <span class="level-number">Seviye ${index + 1}</span>
        <strong>${level.title}</strong>
        <small>${level.tag}</small>
        <em>5 deneme</em>
      </button>`).join('');
  }

  function renderMatchingPicker() {
    const naming=state.objectPickerSkill==='object-name';
    const pointing=state.objectPickerSkill==='object-show';
    document.getElementById('matchingPickerBack').textContent=naming?'← Dil ve İletişime dön':'← Bilişsel becerilere dön';
    document.getElementById('matchingPickerTitle').textContent=naming?'Nesne ismi söyleme':pointing?'Nesne gösterme':'Nesne eşleme';
    document.querySelector('#matchingPicker .step-label').textContent=(naming?'Dil ve İletişim':'Bilişsel beceriler')+' · '+(naming?'Nesne ismi söyleme':pointing?'Nesne gösterme':'Nesne eşleme');
    document.querySelector('#matchingPicker .section-intro').textContent='Kategoriyi, nesneyi ve seviyeyi seçin. Nesne seviyelerinden sonra farklı kategorilerden karma seviyeler gelir. Her seviyede 5 deneme yapılır.';
    const category = objectData.categories.find(item => item.id === state.matchCategory);
    const item = objectData.items[state.matchItem];
    document.getElementById('matchingCategories').innerHTML = objectData.categories.map(c => `<button class="matching-category ${c.id === category.id ? 'is-selected' : ''}" type="button" data-match-category="${c.id}" aria-pressed="${c.id === category.id}">${c.title}<small>10 nesne</small></button>`).join('');
    document.getElementById('matchingItems').innerHTML = category.items.map(i => `<button class="matching-item ${i.id === item.id ? 'is-selected' : ''}" type="button" data-match-item="${i.id}" aria-pressed="${i.id === item.id}"><img src="${objectData.image(i.id)}" alt="" loading="lazy"><strong>${i.name}</strong></button>`).join('');
    document.getElementById('matchingObjectTitle').textContent = item.name + ' · Seviyeler';
    document.getElementById('matchingStages').innerHTML = (naming?window.NamingRules.stages:pointing?objectData.pointingStages:objectData.stages).map((stage,index) => `<button class="level-card" type="button" data-match-stage="${index + 1}"><span class="level-number">Seviye ${index + 1}</span><strong>${stage.title}</strong><small>${naming?'Tek resim · Sesli yanıt':stage.count+' seçenek'}</small><em>5 deneme</em></button>`).join('');
    window.CharacterVoice?.preload(naming?['Bu ne? Söyle.']:[`${item.accusative} ${pointing?'göster':'eşle'}.`]);
  }
  function startNaming(level){state.skill='object-name';state.matchLevel=level;state.stats={independent:0,prompted:0,incorrect:0};window.speechSynthesis?.cancel();showScreen('naming');document.getElementById('namingFrame').src='./naming-activity.html?'+new URLSearchParams({item:state.matchItem,level:String(level),method:state.method||'wait',autoStart:window.LocalMicrophone?.available()?'1':'0',role:window.ParentGate?.role()||'guardian'});}
 window.addEventListener('message',event=>{const frame=document.getElementById('namingFrame');if(event.origin!==location.origin||event.source!==frame.contentWindow||state.screen!=='naming')return;const msg=event.data;if(msg?.type==='naming-size'&&Number.isFinite(msg.height)){frame.style.height=Math.min(2200,Math.max(400,msg.height))+'px';return;}if(msg?.type==='naming-menu'){goPlatform();return;}if(msg?.type==='naming-start'&&Number.isInteger(msg.level)&&msg.level>=1&&msg.level<=7)state.matchLevel=msg.level;if(msg?.type==='naming-complete'){const counts=msg.stats;if(!counts||!['independent','prompted','incorrect'].every(k=>Number.isInteger(counts[k])&&counts[k]>=0&&counts[k]<=5)||Object.values(counts).reduce((a,b)=>a+b,0)!==5)return;state.stats={independent:counts.independent,prompted:counts.prompted,incorrect:counts.incorrect};saveState();}});
 function shapeMarkup(shape, color) { return `<i class="shape ${shape} ${color}" aria-hidden="true"></i>`; }
  function pairCardMarkup(type) { return `<i class="pair-symbol" aria-hidden="true">${pairSymbols[type]}</i>`; }
  function setGameMode(skill) {
    const pairMode = skill === 'same-red';
    const patternMode = skill === 'pattern';
    const eventMode = skill === 'events';
    const objectMode = ['object-match','object-show'].includes(skill);
    document.querySelector('.game-screen').classList.toggle('is-object-matching', objectMode);
    document.querySelector('.game-stage').classList.toggle('is-object-matching', objectMode);
    document.querySelector('.game-stage').classList.toggle('is-events', eventMode || objectMode);
    document.querySelector('.target-area').hidden = pairMode || patternMode || eventMode || objectMode;
    document.getElementById('answerArea').hidden = pairMode || patternMode || eventMode || objectMode;
    document.getElementById('pairArea').hidden = !pairMode;
    document.getElementById('patternArea').hidden = !patternMode;
    document.getElementById('eventArea').hidden = !eventMode;
    document.getElementById('objectMatchingArea').hidden = !objectMode;
    document.getElementById('gameTitle').textContent = eventMode ? 'Olay sıralama' : patternMode ? 'Örüntü tamamlama' : 'Renk eşleme';
    document.querySelector('.game-toolbar .step-label').textContent = eventMode ? `Bilişsel beceriler · Olayları sıralama · Seviye ${state.eventLevel}` : patternMode ? `Bilişsel beceriler · Örüntü · Seviye ${state.patternLevel}` : pairMode ? 'Bilişsel beceriler · Aynı tip aynı renk eşleme' : 'Bilişsel beceriler · Renk eşleme';
  }
  function resetActivity(skill = 'two-color', level = 1) {
    objectMatching.stop();
    state.skill = skill; state.trial = 0; state.stats = { independent: 0, prompted: 0, incorrect: 0 };
    if (skill === 'pattern') state.patternLevel = level;
    if (skill === 'events') state.eventLevel = level;
    if (['object-match','object-show'].includes(skill)) state.matchLevel = level;
    setGameMode(skill);
    if (['object-match','object-show'].includes(skill)) objectMatching.render(); else if (skill === 'same-red') renderPairTrial(); else if (skill === 'pattern') renderPatternTrial(); else if (skill === 'events') renderEventTrial(); else renderTrial();
  }
  function giveInstruction(text, hint) {
    document.getElementById('feedback').textContent=text;
    const buttons = [...document.querySelectorAll('.answer-card, .pair-card, .pattern-choice, .event-card')];
    buttons.forEach(button => button.disabled = true);
    const trial = state.trial;
    const skill = state.skill;
    speak(state.avatar, text, () => {
      if (state.screen !== 'activity' || state.trial !== trial || state.skill !== skill) return;
      buttons.forEach(button => button.disabled = button.dataset.used === 'true');
      if (skill === 'events') state.eventBusy = false;
      if (!document.getElementById('pauseModal').hidden) return;
      if (state.method === 'immediate') hint(); else promptTimer = setTimeout(hint, 4000);
    });
  }
  function renderTrial() {
    clearTimeout(promptTimer); state.hadPrompt = false; state.attempts = 0;
    const trial = trials[state.trial];
    document.getElementById('trialLabel').textContent = `${state.trial + 1} / ${trials.length}`;
    document.getElementById('progressFill').style.width = `${((state.trial + 1) / trials.length) * 100}%`;
    document.getElementById('targetCard').innerHTML = shapeMarkup(...trial.target);
    const area = document.getElementById('answerArea'); area.innerHTML = '';
    [...trial.options].sort(() => Math.random() - .5).forEach(([shape, color]) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'shape-card answer-card';
      button.dataset.correct = color === 'red' ? 'true' : 'false';
      button.setAttribute('aria-label', `${color === 'red' ? 'Kırmızı' : 'Mavi'} ${shape === 'circle' ? 'daire' : shape === 'square' ? 'kare' : 'üçgen'}`);
      button.innerHTML = shapeMarkup(shape, color); button.addEventListener('click', () => answer(button)); area.appendChild(button);
    });
    const feedback = document.getElementById('feedback'); feedback.textContent = ''; feedback.className = 'feedback';
    giveInstruction('Aynı renkte olanı seç.', showHint);
  }
  function renderPairTrial() {
    clearTimeout(promptTimer); state.hadPrompt = false; state.attempts = 0; state.pairWrongTries = 0; state.selectedPair = [];
    const trial = pairTrials[state.trial];
    document.getElementById('trialLabel').textContent = `${state.trial + 1} / ${pairTrials.length}`;
    document.getElementById('progressFill').style.width = `${((state.trial + 1) / pairTrials.length) * 100}%`;
    const feedback = document.getElementById('feedback'); feedback.textContent = ''; feedback.className = 'feedback';
    const area = document.getElementById('pairArea'); area.innerHTML = '';
    const cards = [{ type: trial.correct }, { type: trial.correct }, ...trial.decoys.map(type => ({ type }))];
    cards.sort(() => Math.random() - .5).forEach(card => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'pair-card';
      button.dataset.type = card.type;
      button.setAttribute('aria-label', `Kırmızı ${pairTypeNames[card.type]} kart`);
      button.innerHTML = pairCardMarkup(card.type); button.addEventListener('click', () => pairAnswer(button)); area.appendChild(button);
    });
    giveInstruction('Aynı olan iki kırmızı kartı bulun.', showHintPair);
  }
  function showHintPair(correction = false) {
    if (state.screen !== 'activity' || state.skill !== 'same-red') return;
    clearTimeout(promptTimer);
    state.hadPrompt = true;
    const trial = pairTrials[state.trial];
    document.querySelectorAll('.pair-card').forEach(b => b.classList.toggle('is-hint', b.dataset.type === trial.correct));
    const message = `${correction ? 'Hayır, bu iki kart aynı değil. ' : ''}Bak, bu iki kart da kırmızı ${pairTypeNames[trial.correct]}. Renkleri ve şekilleri aynı. Şimdi gösterilen iki karta bas.`;
    document.getElementById('feedback').textContent = message;
    speak(state.avatar, message);
  }
  function pairAnswer(button) {
    if (button.disabled || button.classList.contains('is-matched')) return;
    if (button.classList.contains('is-selected')) {
      button.classList.remove('is-selected'); state.selectedPair = state.selectedPair.filter(b => b !== button); return;
    }
    button.classList.add('is-selected'); state.selectedPair.push(button);
    if (state.selectedPair.length < 2) return;
    clearTimeout(promptTimer);
    const [first, second] = state.selectedPair; state.selectedPair = [];
    const feedback = document.getElementById('feedback');
    if (first.dataset.type === second.dataset.type) {
      [first, second].forEach(b => { b.classList.remove('is-selected', 'is-hint'); b.classList.add('is-matched'); b.disabled = true; });
      if (state.hadPrompt || state.attempts) state.stats.prompted += 1; else state.stats.independent += 1;
      feedback.textContent = praise(); feedback.className = 'feedback good';
      speak(state.avatar, feedback.textContent, () => setTimeout(() => { if (state.screen !== 'activity') return; state.trial += 1; if (state.trial < pairTrials.length) renderPairTrial(); else finishBlock(); }, 1200));
    } else {
      state.attempts += 1; state.stats.incorrect += 1; state.pairWrongTries += 1;
      [first, second].forEach(b => b.classList.remove('is-selected'));
      feedback.textContent = 'Birlikte bir daha bakalım.'; feedback.className = 'feedback try';
      showHintPair(true);
    }
  }
  function showHint(correction = false) {
    if (state.screen !== 'activity') return;
    clearTimeout(promptTimer);
    state.hadPrompt = true;
    document.querySelectorAll('.answer-card').forEach(b => b.classList.toggle('is-hint', b.dataset.correct === 'true'));
    const message = `${correction ? 'Hayır, bu aynı renk değil. ' : ''}Bak, örneğin rengi kırmızı. Gösterilen seçenek de kırmızı, renkleri aynı. Şimdi kırmızı seçeneğe bas.`;
    document.getElementById('feedback').textContent = message;
    speak(state.avatar, message);
  }
  function answer(button) {
    if (button.disabled) return;
    clearTimeout(promptTimer);
    const feedback = document.getElementById('feedback');
    if (button.dataset.correct === 'true') {
      document.querySelectorAll('.answer-card').forEach(b => b.disabled = true);
      if (state.hadPrompt || state.attempts) state.stats.prompted += 1; else state.stats.independent += 1;
      feedback.textContent = praise(); feedback.className = 'feedback good';
      speak(state.avatar, feedback.textContent, () => setTimeout(() => { if (state.screen !== 'activity') return; state.trial += 1; if (state.trial < trials.length) renderTrial(); else finishBlock(); }, 950));
    } else {
      state.attempts += 1; state.stats.incorrect += 1; button.disabled = true;
      feedback.className = 'feedback try'; showHint(true);
    }
  }
  function renderPatternTrial() {
    clearTimeout(promptTimer); state.hadPrompt = false; state.attempts = 0;
    const level = patternLevels[state.patternLevel - 1];
    const trial = patternExample();
    document.getElementById('trialLabel').textContent = `${state.trial + 1} / ${level.examples.length}`;
    document.getElementById('progressFill').style.width = `${((state.trial + 1) / level.examples.length) * 100}%`;
    const area = document.getElementById('patternArea');
    area.classList.toggle('is-long', trial.shown.length >= 6);
    area.style.setProperty('--pattern-columns', trial.shown.length + 1);
    area.innerHTML = '';
    trial.shown.forEach(key => {
      const cell = document.createElement('div'); cell.className = 'pattern-cell'; cell.setAttribute('role', 'img'); cell.setAttribute('aria-label', patternItems[key].name); cell.innerHTML = patternItems[key].html; area.appendChild(cell);
    });
    const stack = document.createElement('div'); stack.className = 'pattern-slot-stack';
    const slot = document.createElement('div'); slot.className = 'pattern-slot'; slot.textContent = '?'; slot.setAttribute('aria-label', 'Boş kutu');
    const topFirst = Math.random() < .5;
    const makeChoice = key => {
      const item = patternItems[key];
      const button = document.createElement('button'); button.type = 'button'; button.className = 'pattern-choice';
      button.dataset.correct = key === trial.answer ? 'true' : 'false';
      button.setAttribute('aria-label', `Seçenek: ${item.name}`);
      button.innerHTML = item.html; button.addEventListener('click', () => patternAnswer(button));
      return button;
    };
    stack.appendChild(makeChoice(topFirst ? trial.answer : trial.decoy));
    stack.appendChild(slot);
    stack.appendChild(makeChoice(topFirst ? trial.decoy : trial.answer));
    area.appendChild(stack);
    const feedback = document.getElementById('feedback'); feedback.textContent = ''; feedback.className = 'feedback';
    giveInstruction('Sıraya bakalım. Boş kutuya hangisi gelmeli? Doğru olanı seç.', showHintPattern);
  }
  function revealPatternHint(message) {
    state.hadPrompt = true;
    clearTimeout(promptTimer);
    document.querySelectorAll('.pattern-choice').forEach(b => b.classList.toggle('is-hint', b.dataset.correct === 'true'));
    document.getElementById('feedback').textContent = message.text;
    speak(state.avatar, message.speech);
  }
  function showHintPattern(correction = false) {
    if (state.screen !== 'activity' || state.skill !== 'pattern') return;
    const trial = patternExample();
    const sequence = trial.shown.map(key => patternItems[key].name).join(', ');
    const full = [...trial.shown, trial.answer];
    const period = full.findIndex((_, index) => index > 0 && full.every((key, position) => key === full[position % index]));
    const group = full.slice(0, period > 0 ? period : full.length).map(key => patternItems[key].name).join(', ');
    const explanation = period === 2 ? 'Bu iki nesne sırayla tekrar ediyor.' : `Tekrar eden grup: ${group}. Bu grup aynı sırayla tekrar ediyor.`;
    const message = `${correction ? 'Hayır, o değil. ' : ''}Bak, ${sequence}. ${explanation} Sırayı devam ettirince buraya ${patternItems[trial.answer].name} gelmeli. Şimdi gösterilen seçeneğe bas.`;
    revealPatternHint({ text: message, speech: message });
  }
  function patternAnswer(button) {
    if (button.disabled) return;
    clearTimeout(promptTimer);
    const feedback = document.getElementById('feedback');
    const level = patternLevels[state.patternLevel - 1];
    if (button.dataset.correct === 'true') {
      document.querySelectorAll('.pattern-choice').forEach(b => { b.disabled = true; b.classList.remove('is-hint'); });
      button.classList.add('is-correct');
      if (state.hadPrompt || state.attempts) state.stats.prompted += 1; else state.stats.independent += 1;
      feedback.textContent = praise(); feedback.className = 'feedback good';
      speak(state.avatar, feedback.textContent, () => setTimeout(() => { if (state.screen !== 'activity') return; state.trial += 1; if (state.trial < level.examples.length) renderPatternTrial(); else finishBlock(); }, 1100));
    } else {
      state.attempts += 1; state.stats.incorrect += 1; button.disabled = true;
      feedback.className = 'feedback try'; showHintPattern(true);
    }
  }
  function eventExample() { return eventContent.levels[state.eventLevel - 1].examples[state.trial]; }
  function eventImage(example, step) { return `./assets/events/${example.story}/${step + 1}.webp`; }
  function eventNextSlot() { return state.eventPlaced.findIndex(step => step === null); }
  function renderEventSlots() {
    const example = eventExample();
    const story = eventContent.stories[example.story];
    const slots = document.getElementById('eventSlots'); slots.innerHTML = '';
    state.eventPlaced.forEach((step, index) => {
      const slot = document.createElement('div'); slot.className = 'event-slot';
      slot.dataset.slot = String(index);
      slot.setAttribute('aria-label', `${index + 1}. yer: ${step === null ? 'boş' : story.steps[step]}`);
      const number = document.createElement('span'); number.className = 'event-number'; number.textContent = String(index + 1); slot.appendChild(number);
      if (step !== null) {
        const picture = document.createElement('img'); picture.src = eventImage(example, step); picture.alt = story.steps[step]; picture.draggable = false;
        slot.appendChild(picture); slot.classList.add('is-filled');
      }
      slot.addEventListener('dragover', event => { if (step === null) event.preventDefault(); });
      slot.addEventListener('drop', event => {
        event.preventDefault();
        const card = [...document.querySelectorAll('.event-card')].find(card => card.dataset.step === event.dataTransfer.getData('text/plain'));
        if (card) eventAnswer(card, index);
      });
      slots.appendChild(slot);
    });
  }
  function renderEventTrial() {
    clearTimeout(promptTimer); eventRun += 1;
    eventAdvancePending = false;
    state.hadPrompt = false; state.attempts = 0; state.eventBusy = true;
    const example = eventExample();
    const story = eventContent.stories[example.story];
    state.eventPlaced = Array(example.indices.length).fill(null);
    document.getElementById('trialLabel').textContent = `${state.trial + 1} / 5`;
    document.getElementById('progressFill').style.width = `${((state.trial + 1) / 5) * 100}%`;
    document.getElementById('eventStoryTitle').textContent = story.title;
    const feedback = document.getElementById('feedback'); feedback.textContent = ''; feedback.className = 'feedback';
    const order = [...example.indices];
    for (let index = order.length - 1; index > 0; index--) { const other = Math.floor(Math.random() * (index + 1)); [order[index], order[other]] = [order[other], order[index]]; }
    const source = document.getElementById('eventCards'); source.innerHTML = '';
    order.forEach(step => {
      const card = document.createElement('button'); card.type = 'button'; card.className = 'event-card'; card.dataset.step = String(step); card.dataset.used = 'false'; card.draggable = false;
      card.setAttribute('aria-label', story.steps[step]);
      const picture = document.createElement('img'); picture.src = eventImage(example, step); picture.alt = ''; picture.draggable = false; card.appendChild(picture);
      bindEventCardDrag(card);
      source.appendChild(card);
    });
    renderEventSlots();
    giveInstruction('Resimlere bak. Önce olanı, sonra olanı sırala. Önce olan karta dokun.', showHintEvent);
  }
  function showHintEvent(correction = false) {
    if (state.screen !== 'activity' || state.skill !== 'events' || !document.getElementById('pauseModal').hidden) return;
    const next = eventNextSlot(); if (next < 0) return;
    clearTimeout(promptTimer); state.hadPrompt = true; state.eventBusy = true;
    const run = eventRun; const example = eventExample(); const story = eventContent.stories[example.story];
    const cards = [...document.querySelectorAll('.event-card')];
    cards.forEach(card => { card.disabled = true; card.classList.toggle('is-hint', Number(card.dataset.step) === example.indices[next]); });
    document.querySelectorAll('.event-slot').forEach(slot => slot.classList.toggle('is-hint', Number(slot.dataset.slot) === next));
    const sequence = example.indices.map((step, index) => `${index === 0 ? 'Önce' : index === example.indices.length - 1 ? 'En son' : 'Sonra'} ${story.steps[step]}`).join(' ');
    const message = `${correction ? 'Hayır, bu kartın yeri farklı. ' : ''}${sequence} Şimdi gösterilen karta dokun; ${next + 1}. yere gelsin.`;
    const feedback = document.getElementById('feedback'); feedback.className = correction ? 'feedback try' : 'feedback'; feedback.textContent = message;
    speak(state.avatar, message, () => {
      if (run !== eventRun || state.screen !== 'activity' || state.skill !== 'events') return;
      state.eventBusy = false;
      cards.forEach(card => card.disabled = card.dataset.used === 'true');
    });
    state.eventBusy = false;
    cards.forEach(card => card.disabled = card.dataset.used === 'true');
  }
  function bindEventCardDrag(card) {
    let gesture = null; let ignoreClick = false;
    const reset = () => { gesture = null; card.style.transform = ''; card.classList.remove('is-dragging'); };
    const waitAgain = () => { if (state.screen === 'activity' && state.skill === 'events' && !state.eventBusy && !state.hadPrompt && state.method === 'wait' && document.getElementById('pauseModal').hidden && eventNextSlot() >= 0) { clearTimeout(promptTimer); promptTimer = setTimeout(showHintEvent, 4000); } };
    card.addEventListener('click', () => { if (ignoreClick) { ignoreClick = false; return; } eventAnswer(card); });
    card.addEventListener('pointerdown', event => {
      ignoreClick = false;
      if (card.disabled || state.eventBusy || !document.getElementById('pauseModal').hidden || (event.button !== undefined && event.button !== 0)) return;
      clearTimeout(promptTimer);
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false, run: eventRun };
      card.setPointerCapture(event.pointerId);
    });
    card.addEventListener('pointermove', event => {
      if (!gesture || gesture.id !== event.pointerId || gesture.run !== eventRun) return;
      const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
      if (Math.hypot(dx, dy) > 12) gesture.moved = true;
      if (gesture.moved) { card.classList.add('is-dragging'); card.style.transform = `translate(${dx}px, ${dy}px)`; }
    });
    card.addEventListener('pointerup', event => {
      if (!gesture || gesture.id !== event.pointerId || gesture.run !== eventRun) return;
      const moved = gesture.moved; reset();
      if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
      if (!moved) return;
      ignoreClick = true;
      const slot = document.elementFromPoint(event.clientX, event.clientY)?.closest('.event-slot');
      if (slot) eventAnswer(card, Number(slot.dataset.slot));
      waitAgain();
    });
    card.addEventListener('pointercancel', () => { reset(); waitAgain(); });
  }
  function eventAnswer(card, slotIndex = eventNextSlot()) {
    if (card.disabled || state.eventBusy || state.screen !== 'activity' || state.skill !== 'events' || !document.getElementById('pauseModal').hidden || slotIndex < 0 || state.eventPlaced[slotIndex] !== null) return;
    clearTimeout(promptTimer);
    const example = eventExample(); const step = Number(card.dataset.step);
    if (step !== example.indices[slotIndex]) {
      state.attempts += 1; state.stats.incorrect += 1; showHintEvent(true); return;
    }
    state.eventPlaced[slotIndex] = step;
    card.disabled = true; card.dataset.used = 'true'; card.classList.add('is-used');
    document.querySelectorAll('.event-card').forEach(button => button.classList.remove('is-hint'));
    renderEventSlots();
    const feedback = document.getElementById('feedback'); feedback.textContent = ''; feedback.className = 'feedback';
    state.eventBusy = true;
    if (eventNextSlot() >= 0) {
      giveInstruction(`${praise()} Şimdi sıradaki olayı seç.`, showHintEvent); return;
    }
    if (state.hadPrompt || state.attempts) state.stats.prompted += 1; else state.stats.independent += 1;
    feedback.textContent = praise(); feedback.className = 'feedback good';
    document.querySelectorAll('.event-card').forEach(button => button.disabled = true);
    const run = eventRun; eventAdvancePending = true;
    speak(state.avatar, feedback.textContent, () => scheduleEventAdvance(run));
  }
  function scheduleEventAdvance(run) {
    promptTimer = setTimeout(() => {
      if (run !== eventRun || state.screen !== 'activity' || state.skill !== 'events') return;
      if (!document.getElementById('pauseModal').hidden) return;
      eventAdvancePending = false;
      state.trial += 1;
      if (state.trial < 5) renderEventTrial(); else finishBlock();
    }, 1000);
  }
  function resetEndgame() {
    bubbles = 3; document.querySelectorAll('#bubbleZone button').forEach(b => b.classList.remove('is-popped'));
    document.getElementById('bubbleStatus').textContent = '3 baloncuk kaldı'; document.getElementById('endgameContinue').disabled = true;
  }
  function finishBlock() { saveState(); updateSummary(); state.history = []; showScreen('summary', false); }
  function nextPatternLevel() {
    if (['object-match','object-show'].includes(state.skill)) { if(state.matchLevel >= (state.skill==='object-show'?objectData.pointingStages.length:objectData.stages.length)) return; const next = state.matchLevel + 1; state.history=[]; showScreen('activity',false); resetActivity(state.skill,next); return; }
    if (state.skill === 'events') {
      if (state.eventLevel >= eventContent.levels.length) return;
      const next = state.eventLevel + 1;
      state.history = []; showScreen('activity', false); resetActivity('events', next); saveState(); return;
    }
    if (state.skill !== 'pattern' || state.patternLevel >= patternLevels.length) return;
    const next = state.patternLevel + 1;
    state.history = [];
    showScreen('activity', false);
    resetActivity('pattern', next);
    saveState();
  }
  function updateSummary() {
    document.getElementById('summaryNext').hidden = ['object-match','object-show'].includes(state.skill) ? state.matchLevel >= (state.skill==='object-show'?objectData.pointingStages.length:objectData.stages.length) : state.skill === 'events' ? state.eventLevel >= eventContent.levels.length : state.skill !== 'pattern' || state.patternLevel >= patternLevels.length;
    const trialCounts = { 'two-color': trials.length, 'same-red': pairTrials.length, 'pattern': 5 };
    document.getElementById('summaryTitle').textContent = ['object-match','object-show'].includes(state.skill) ? `${objectData.isMixed(state.skill,state.matchLevel)?"Karma nesneler":objectData.items[state.matchItem].name} · Seviye ${state.matchLevel} · 5 deneme tamamlandı` : state.skill === 'pattern' || state.skill === 'events'
      ? `Seviye ${state.skill === 'events' ? state.eventLevel : state.patternLevel} · 5 deneme tamamlandı`
      : `${trialCounts[state.skill] || 5} deneme tamamlandı`;
    const generalizations = {
      'object-show':'Nesnenin adını söyleyip evdeki farklı örneklerini göstermesini isteyin. Örneğin: Muzu göster.',
      'object-match': 'Öğrendiği nesnenin evdeki farklı örneklerini bulup eşlemesini isteyin. Nesnenin adını söyleyerek eşleme yönergesi verin.',
      'two-color': 'Kırmızı ve mavi iki gerçek nesne arasından kırmızı olanı eşlemesini isteyin.',
      'same-red': 'Evde iki kırmızı eşya bulup aynı olanları birlikte eşlemesini isteyin.',
      'pattern': 'Oyuncaklarla “biri, başkası” şeklinde sıra kurun; sıradaki nesnenin hangisi olduğunu sorun.',
      'events': 'Günlük bir işi yaparken önce ve sonra olanları birlikte konuşun; iki fotoğrafını çekip oluş sırasına koymasını isteyin.'
    };
    document.getElementById('generalizationText').textContent = generalizations[state.skill] || generalizations['two-color'];
    document.getElementById('independentCount').textContent = state.stats.independent;
    document.getElementById('promptedCount').textContent = state.stats.prompted;
    document.getElementById('incorrectCount').textContent = state.stats.incorrect;
  }
  function openIsland(){showScreen('island-game');if(state.screen==='island-game'){document.getElementById('islandGameFrame').src='./pofidik-island.html?embedded=1';window.speechSynthesis?.cancel();}}
  window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==document.getElementById('islandGameFrame').contentWindow||event.data?.type!=='island-exit'||state.screen!=='island-game')return;const previous=state.history.pop();showScreen(previous==='summary'?'summary':'category',false);});
  document.getElementById('skillList').addEventListener('click',e=>{if(e.target.closest('[data-open-island]'))openIsland();});
  function goPlatform(push = true) { state.editingAssessment = false; renderPlatform(); showScreen('platform', push); }
  function finishEarly() { saveState(); document.getElementById('pauseModal').hidden = true; goPlatform(); }

  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => {if(state.screen==='welcome'&&button.dataset.next==='profile')window.LocalMicrophone?.ensure().catch(()=>{});showScreen(button.dataset.next);}));
  document.getElementById('backButton').addEventListener('click', () => { if(state.screen==='category'&&skillFolder.length){renderCategory(state.category,skillFolder.slice(0,-1));return;} const previous = state.history.pop(); if (previous) showScreen(previous, false); });
  document.getElementById('homeButton').addEventListener('click', () => { state.history = []; if (state.method) goPlatform(false); else showScreen('welcome', false); });
  document.getElementById('settingsButton').addEventListener('click', () => showScreen('settings'));
  document.getElementById('welcomeSettingsButton').addEventListener('click', () => showScreen('settings'));
  document.getElementById('settingsBack').addEventListener('click', () => { const previous = state.history.pop() || 'welcome'; showScreen(previous, false); });
  document.querySelectorAll('#quickMuteTop, #quickMuteWelcome').forEach(button => button.addEventListener('click', toggleMusic));
  document.getElementById('musicToggle').addEventListener('click', toggleMusic);
  document.getElementById('musicVolume').addEventListener('input', event => setMusicVolume(event.target.value));
  document.getElementById('profileForm').addEventListener('submit', event => {
    event.preventDefault(); state.profile.name = document.getElementById('childName').value.trim();window.CharacterVoice?.setName(state.profile.name); state.profile.age = document.getElementById('childAge').value;
    state.profile.diagnosis = document.getElementById('diagnosis').value.trim(); saveState(); showScreen('avatar');
  });
  document.querySelectorAll('.avatar-card').forEach(card => {
    card.addEventListener('click', event => { if (!event.target.closest('.voice-button')) setAvatar(card.dataset.avatar); });
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setAvatar(card.dataset.avatar); } });
  });
  document.querySelectorAll('[data-speak]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); speak(button.dataset.speak,selectionMessage(button.dataset.speak)); }));
  document.getElementById('avatarContinue').addEventListener('click', () => { prepareIntro(); saveState(); showScreen('intro'); setTimeout(() => speak(state.avatar), 250); });
  document.getElementById('readyButton').addEventListener('click', () => {
    const button = document.getElementById('readyButton'); button.disabled = true; button.textContent = 'Süpersin!';
    document.getElementById('introText').textContent = 'Süpersin! Haydi o zaman başlayalım.'; speak(state.avatar, 'Süpersin!');
    state.buddyActivated = true; state.editingAssessment = false; saveState();
    setTimeout(() => { if (state.screen !== 'intro') return; if (window.ParentGate?.role()==='child' || (state.method && state.profile.name)) { goPlatform(); return; } restoreAssessmentUI(); updateAssessmentMode(); showScreen('assessment'); }, 1100);
  });
  document.querySelectorAll('.assessment-row [data-status]').forEach(button => button.addEventListener('click', () => {
    const row = button.closest('.assessment-row'); state.assessment[row.dataset.skill] = button.dataset.status;
    row.querySelectorAll('[data-status]').forEach(item => { const selected = item === button; item.classList.toggle('is-selected', selected); item.setAttribute('aria-pressed', String(selected)); });
    saveState();
  }));
  document.getElementById('assessmentContinue').addEventListener('click', () => {
    saveState();
    if (state.editingAssessment) { state.editingAssessment = false; updateAssessmentMode(); goPlatform(); return; }
    showScreen('method'); if (state.method) setMethod(state.method);
  });
  document.querySelectorAll('[data-method]').forEach(button => button.addEventListener('click', () => setMethod(button.dataset.method)));
  document.getElementById('methodContinue').addEventListener('click', () => { saveState(); goPlatform(); });
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { renderCategory(button.dataset.category); showScreen('category'); }));
  document.getElementById('skillList').addEventListener('click',event=>{const button=event.target.closest('[data-skill-folder]');if(button)renderCategory(state.category,[...skillFolder,button.dataset.skillFolder]);});
  document.getElementById('categoryBack').addEventListener('click', () => { if(skillFolder.length){renderCategory(state.category,skillFolder.slice(0,-1));return;} if (state.history[state.history.length - 1] === 'platform') state.history.pop(); goPlatform(false); });
  document.getElementById('skillList').addEventListener('click', event => {
    if(event.target.closest('[data-open-wh]')){state.skill='wh-questions';showScreen('color-teaching');window.speechSynthesis?.cancel();const frame=document.getElementById('colorTeachingFrame');frame.title='5N1K çalışmaları';frame.src='./wh-teaching.html?'+new URLSearchParams({method:state.method||'wait',role:window.ParentGate?.role()||'guardian'});backgroundMusic.pause();return;}
    const colorOpener=event.target.closest('[data-open-color]');if(colorOpener){state.skill=colorOpener.dataset.openColor;showScreen('color-teaching');window.speechSynthesis?.cancel();const frame=document.getElementById('colorTeachingFrame');frame.title=['clean','dirty','hot','cold','big','small','heavy','light','thin','thick','day','night','inside','outside','full','empty','new','worn','hard','soft','wet','dry'].includes(state.skill.split('-')[0])?'Zıt kavram çalışmaları':['young','old'].includes(state.skill.split('-')[0])?'Genç–yaşlı çalışmaları':state.skill.startsWith('short-')?'Kısa kavramı çalışmaları':state.skill.startsWith('length-')?'Uzun kavramı çalışmaları':'Renk kavramı çalışmaları';frame.src=(['clean','dirty','hot','cold','big','small','heavy','light','thin','thick','day','night','inside','outside','full','empty','new','worn','hard','soft','wet','dry'].includes(state.skill.split('-')[0])?'./opposite-teaching.html?':['young','old'].includes(state.skill.split('-')[0])?'./age-teaching.html?':(state.skill.startsWith('length-')||state.skill.startsWith('short-'))?'./length-teaching.html?':'./color-teaching.html?')+new URLSearchParams({mode:state.skill.split('-')[1],concept:['young','old','clean','dirty','hot','cold','big','small','heavy','light','thin','thick','day','night','inside','outside','full','empty','new','worn','hard','soft','wet','dry'].includes(state.skill.split('-')[0])?state.skill.split('-')[0]:state.skill.startsWith('short-')?'short':'length',method:state.method||'wait'});backgroundMusic.pause();return;}
    const actionOpener=event.target.closest('[data-open-action]');if(actionOpener){state.skill=actionOpener.dataset.openAction;showScreen('action-preview');const frame=document.getElementById('actionPreviewFrame');frame.setAttribute('allow','microphone');frame.src='./action-teaching.html?'+new URLSearchParams({mode:state.skill.slice(7),method:state.method||'wait'});backgroundMusic.pause();return;}
    if(event.target.closest('[data-open-naming]')){state.objectPickerSkill='object-name';renderMatchingPicker();showScreen('matching-picker');return;}
    if(event.target.closest('[data-open-pointing]')) { state.objectPickerSkill='object-show';renderMatchingPicker();showScreen('matching-picker');return; }
    if(event.target.closest('[data-open-matching]')) { state.objectPickerSkill='object-match';renderMatchingPicker(); showScreen('matching-picker'); return; }
    const opener = event.target.closest('[data-open-levels]');
    if (opener) { renderPatternLevels(opener.dataset.openLevels); showScreen('pattern-levels'); return; }
    const starter = event.target.closest('[data-start-skill]');
    if (starter) { showScreen('activity'); resetActivity(starter.dataset.startSkill); }
  });
  document.getElementById('matchingPickerBack').addEventListener('click',()=>{renderCategory();showScreen('category');});
  document.getElementById('matchingPicker').addEventListener('click',event=>{
    const category=event.target.closest('[data-match-category]'); if(category){state.matchCategory=category.dataset.matchCategory;state.matchItem=objectData.categories.find(c=>c.id===state.matchCategory).items[0].id;renderMatchingPicker();return;}
    const item=event.target.closest('[data-match-item]');if(item){state.matchItem=item.dataset.matchItem;renderMatchingPicker();return;}
    const stage=event.target.closest('[data-match-stage]');if(stage){if(state.objectPickerSkill==='object-name'){startNaming(Number(stage.dataset.matchStage));return;}showScreen('activity');resetActivity(state.objectPickerSkill||'object-match',Number(stage.dataset.matchStage));}
  });
  document.getElementById('levelList').addEventListener('click', event => {
    const card = event.target.closest('[data-level]');
    if (card) { showScreen('activity'); resetActivity(state.levelSkill || 'pattern', Number(card.dataset.level)); }
  });
  document.getElementById('patternLevelsBack').addEventListener('click', () => { if (state.history[state.history.length - 1] === 'category') state.history.pop(); renderCategory(); showScreen('category', false); });
  document.getElementById('editAssessment').addEventListener('click', () => { state.editingAssessment = true; restoreAssessmentUI(); updateAssessmentMode(); showScreen('assessment'); });
  document.getElementById('editMethod').addEventListener('click', () => { if (state.method) setMethod(state.method); showScreen('method'); });
  document.getElementById('helpButton').addEventListener('click', () => { if (['object-match','object-show'].includes(state.skill)) objectMatching.hint(); else if (state.skill === 'events') showHintEvent(); else if (state.skill === 'same-red') showHintPair(); else if (state.skill === 'pattern') showHintPattern(); else showHint(); });
  document.getElementById('pauseButton').addEventListener('click', () => { clearTimeout(promptTimer); document.getElementById('pauseModal').hidden = false; if (['object-match','object-show'].includes(state.skill)) objectMatching.pause(); if (state.skill === 'events' || ['object-match','object-show'].includes(state.skill)) { window.speechSynthesis?.cancel(); speechToken += 1; window.Pofidik3D?.setSpeaking(false); } });
  document.getElementById('resumeButton').addEventListener('click', () => { document.getElementById('pauseModal').hidden = true; if(['object-match','object-show'].includes(state.skill)){objectMatching.resume();return;} if (state.skill === 'events') { if (eventAdvancePending) { const run = eventRun; speak(state.avatar, document.getElementById('feedback').textContent || praise(), () => scheduleEventAdvance(run)); } else if (eventNextSlot() >= 0) { if (state.hadPrompt || state.method === 'immediate') showHintEvent(); else { state.eventBusy = true; giveInstruction('Şimdi sıradaki olayı seç.', showHintEvent); } } return; } if (state.method === 'wait' && !state.hadPrompt) { if (state.skill === 'same-red') promptTimer = setTimeout(showHintPair, 4000); else if (state.skill === 'pattern') promptTimer = setTimeout(showHintPattern, 4000); else promptTimer = setTimeout(showHint, 4000); } });
  document.getElementById('finishButton').addEventListener('click', finishEarly); document.getElementById('pauseFinish').addEventListener('click', finishEarly);
  document.querySelectorAll('#bubbleZone button').forEach(button => button.addEventListener('click', () => {
    if (button.classList.contains('is-popped')) return; button.classList.add('is-popped'); bubbles -= 1;
    document.getElementById('bubbleStatus').textContent = bubbles ? `${bubbles} baloncuk kaldı` : 'Hepsi tamam!'; if (!bubbles) document.getElementById('endgameContinue').disabled = false;
  }));
  document.getElementById('endgameContinue').addEventListener('click', () => { updateSummary(); showScreen('summary'); });
  document.getElementById('summaryHome').addEventListener('click', () => { state.history = []; goPlatform(false); });
  document.getElementById('summaryNext').addEventListener('click', nextPatternLevel);
  document.getElementById('summaryGame').addEventListener('click', () => state.skill==='pattern'?openIsland():showScreen('planned-game'));
  document.getElementById('plannedGameBack').addEventListener('click', () => { state.history = []; updateSummary(); showScreen('summary', false); });
  floatingBuddy.addEventListener('click', () => {
    floatingBuddy.classList.remove('buddy-react');void floatingBuddy.offsetWidth;floatingBuddy.classList.add('buddy-react');
    buddyPhraseIndex = (buddyPhraseIndex + 1) % buddyPhrases.length;
    speak(state.avatar, buddyPhrases[buddyPhraseIndex]);
    if (state.avatar === 'pofidik') window.Pofidik3D?.react(floatingBuddy);
  });
  let buddyDrag = null;
  let suppressBuddyClick = false;
  floatingBuddy.addEventListener('click', event => {
    if (suppressBuddyClick) { suppressBuddyClick = false; event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  floatingBuddy.addEventListener('pointerdown', event => {
    floatingBuddy.setPointerCapture(event.pointerId);
    const rect = floatingBuddy.getBoundingClientRect();
    buddyDrag = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top, moved: false };
    floatingBuddy.classList.add('is-dragging');
  });
  floatingBuddy.addEventListener('pointermove', event => {
    if (!buddyDrag || buddyDrag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.movementX, event.movementY) > 1) buddyDrag.moved = true;
    const maxX = Math.max(0, window.innerWidth - floatingBuddy.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - floatingBuddy.offsetHeight);
    const left = Math.min(maxX, Math.max(0, event.clientX - buddyDrag.dx));
    const top = Math.min(maxY, Math.max(0, event.clientY - buddyDrag.dy));
    floatingBuddy.style.left = `${left}px`; floatingBuddy.style.top = `${top}px`;
    floatingBuddy.style.right = 'auto'; floatingBuddy.style.bottom = 'auto';
  });
  floatingBuddy.addEventListener('pointerup', event => {
    if (!buddyDrag || buddyDrag.pointerId !== event.pointerId) return;
    floatingBuddy.releasePointerCapture(event.pointerId); floatingBuddy.classList.remove('is-dragging');
    const moved = buddyDrag.moved; buddyDrag = null;
    if (moved) { suppressBuddyClick = true; event.stopImmediatePropagation(); }
  });
  document.getElementById('welcomePlanButton').addEventListener('click', () => { renderPlanUI(); showScreen('plan'); });
  document.getElementById('settingsPlanButton').addEventListener('click', () => { renderPlanUI(); showScreen('plan'); });
  document.getElementById('planBack').addEventListener('click', () => {
    const previous = state.history.pop() || 'welcome';
    showScreen(previous, false);
  });
  document.getElementById('planActivate').addEventListener('click', () => {
    document.getElementById('paymentPanel').hidden = false;
    document.getElementById('planOptions')?.setAttribute('hidden', '');
  });
  document.getElementById('paymentBack').addEventListener('click', () => { document.getElementById('paymentPanel').hidden = true; });
  document.getElementById('paymentContinue').addEventListener('click', () => {
    document.getElementById('planNote').textContent = 'Ödeme sağlayıcısı henüz bağlanmadı. Gerçek ödeme alınmadı; entegrasyon için sağlayıcı hesabı ve sunucu uç noktası gerekir.';
  });

  window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==document.getElementById('actionPreviewFrame').contentWindow)return;const msg=event.data;if(msg?.type==='action-preview-menu'){goPlatform();return;}if(msg?.type==='action-teaching-complete'&&state.screen==='action-preview'&&state.skill===`action-${msg.mode}`){const counts=msg.stats;if(!counts||!['independent','prompted','incorrect'].every(k=>Number.isInteger(counts[k])&&counts[k]>=0&&counts[k]<=5)||counts.independent+counts.prompted+counts.incorrect!==5)return;state.stats={independent:counts.independent,prompted:counts.prompted,incorrect:counts.incorrect};saveState();}});
  window.AppEntry={show:showScreen,platform:goPlatform,ready:()=>!!(state.method&&state.avatar&&state.profile.name),resetHistory:()=>{state.history=[];}};
  window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==document.getElementById('colorTeachingFrame').contentWindow||state.screen!=='color-teaching')return;const msg=event.data;if(['color-teaching-menu','length-teaching-menu','age-teaching-menu','opposite-teaching-menu','wh-teaching-menu'].includes(msg?.type)){goPlatform();return;}if(msg?.type==='wh-teaching-complete'){const counts=msg.stats;if(state.skill!=='wh-questions'||!Number.isInteger(msg.level)||msg.level<1||msg.level>10||!counts||!['independent','prompted','incorrect'].every(k=>Number.isInteger(counts[k])&&counts[k]>=0&&counts[k]<=30)||counts.independent+counts.prompted+counts.incorrect!==30)return;state.stats={independent:counts.independent,prompted:counts.prompted,incorrect:counts.incorrect};saveState();return;}if(!['color-teaching-complete','length-teaching-complete','age-teaching-complete','opposite-teaching-complete'].includes(msg?.type)||state.skill!==`${msg.type.startsWith('opposite-')?(['clean','dirty','hot','cold','big','small','heavy','light','thin','thick','day','night','inside','outside','full','empty','new','worn','hard','soft','wet','dry'].includes(msg.concept)?msg.concept:'invalid'):msg.type.startsWith('age-')?(['young','old'].includes(msg.concept)?msg.concept:'invalid'):msg.type.startsWith('length-')?(msg.concept==='short'?'short':'length'):'color'}-${msg.mode}`)return;const counts=msg.stats;if(!counts||!['independent','prompted','incorrect'].every(k=>Number.isInteger(counts[k])&&counts[k]>=0&&counts[k]<=5)||counts.independent+counts.prompted+counts.incorrect!==5)return;state.stats={independent:counts.independent,prompted:counts.prompted,incorrect:counts.incorrect};saveState();});
  loadState(); loadAudioSettings();
  tryStartMusic();
  renderPlanUI();
  document.addEventListener('pointerdown', tryStartMusic, { once: true, capture: true });
  document.addEventListener('keydown', tryStartMusic, { once: true, capture: true });
  document.getElementById('childName').value = state.profile.name; document.getElementById('childAge').value = state.profile.age; document.getElementById('diagnosis').value = state.profile.diagnosis;
  if (state.avatar) setAvatar(state.avatar, false); restoreAssessmentUI(); updateAssessmentMode(); updateMascotDisplays();
  if (document.modelContext?.registerTool) {
    Promise.resolve(document.modelContext.registerTool({
      name: 'start_two_color_matching', title: 'İki renk arasından eşleme çalışmasını başlat',
      description: 'Seçili öğretim yöntemiyle beş denemelik kırmızı-mavi renk eşleme çalışmasını görünür olarak başlatır.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() { if(window.ParentGate?.role()==='locked')return {status:'locked'}; showScreen('activity'); resetActivity(); return { status: 'started', activity: 'two_color_matching', trials: 5, method: state.method }; }
    })).catch(() => {});
  }
})();
