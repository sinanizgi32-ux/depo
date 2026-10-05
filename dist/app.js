(() => {
  const screens = [...document.querySelectorAll('[data-screen]')];
  const topbar = document.getElementById('topbar');
  const floatingBuddy = document.getElementById('floatingBuddy');
  const storageKey = 'dijitalOzelEgitimStateV2';
  const audioStorageKey = 'dijitalOzelEgitimAudioV1';
  const backgroundMusic = document.getElementById('backgroundMusic');
  const musicBlockedScreens = new Set(['activity', 'endgame', 'summary']);
  const audioSettings = { enabled: true, volume: .35, lastVolume: .35 };
  const skillNames = {
    'object-match': { title: 'Aynı nesneleri eşle', description: 'Aynı nesneyi seçenekler arasından bulma çalışması.', icon: '🧩' },
    'same-red': { title: 'Aynı tip ve aynı renk kartları eşle', description: 'Aynı tip iki kırmızı kartı dağınık kartlar arasından bulup eşleme. 5 deneme ve bölüm sonu oyunu.', icon: '🟥', playable: true },
    'two-color': { title: 'İki renk arasından doğru olanı eşle', description: 'Kırmızı ve mavi arasından kırmızı olanı eşle. 5 deneme ve bölüm sonu oyunu.', icon: '🎨', playable: true },
    'spoken-color': { title: 'Söylenen rengi göster', description: 'Sözel yönergeye göre doğru rengi seçme çalışması.', icon: '👆' },
    'pattern': { title: 'Örüntü: boş kutuya hangisi gelir?', description: 'Örüntüdeki sırada bir sonraki nesneyi bulma. 15 seviye, giderek zorlaşan örüntüler.', icon: '🔁', playable: true },
    'events': { title: 'Olay kartlarını oluş sırasına göre sıralar', description: 'İki karttan beş karta ilerleyen 10 seviye. Her seviyede 5 olay sıralama denemesi.', icon: '🖼️', playable: true }
  };
  const eventContent = window.EventSequences;
  let eventRun = 0;
  let eventAdvancePending = false;
  const mascots = {
    pofidik: { name: 'Pofidik', fullName: 'Pofidik Ayı', sprite: 'bear', voiceKind: 'male', pitch: 1, rate: 1, voiceIndex: 0, model: 'pofidik' },
    dila: { name: 'Dila', fullName: 'Dila Panda', sprite: 'panda', voiceKind: 'female', pitch: 1, rate: 1, voiceIndex: 0 },
    kipir: { name: 'Kıpır', fullName: 'Kıpır Kunduz', sprite: 'beaver', voiceKind: 'male', pitch: 1, rate: 1, voiceIndex: 1 },
    mina: { name: 'Mina', fullName: 'Mina Tilki', sprite: 'fox', voiceKind: 'female', pitch: 1, rate: 1, voiceIndex: 1 }
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
  let voices = [];
  let promptTimer = null;
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
  function musicCanPlay() { return audioSettings.enabled && !musicBlockedScreens.has(state.screen); }
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

  function loadVoices() { voices = window.speechSynthesis?.getVoices?.() || []; }
  function pickVoice(profile) {
    if (!voices.length) return null;
    const femaleWords = /emel|filiz|aylin|seda|zeynep|selin|dilek|yelda|buket|özlem|merve|esra|ece|kadın|female/i;
    const maleWords = /tolga|ahmet|mehmet|burak|emre|kerem|mustafa|erkek|male/i;
    const matcher = profile.voiceKind === 'female' ? femaleWords : maleWords;
    const scored = voices.map(voice => {
      let score = 0;
      if (/^tr([_-]|$)/i.test(voice.lang)) score += 100;
      if (matcher.test(voice.name)) score += 10;
      if (/natural|online|premium|enhanced/i.test(voice.name)) score += 5;
      if (voice.localService) score += 1;
      return { voice, score };
    }).sort((a, b) => b.score - a.score);
    const pool = scored.filter(item => item.score === scored[0].score).map(item => item.voice);
    return pool[profile.voiceIndex % pool.length];
  }
  function speak(key, text, onComplete) {
    if (!('speechSynthesis' in window)) { onComplete?.(); return; }
    const profile = mascots[key] || mascots.pofidik;
    window.speechSynthesis.cancel();
    window.Pofidik3D?.setSpeaking(false);
    loadVoices();
    const utterance = new SpeechSynthesisUtterance(text || `Merhaba, ben ${profile.name}. Oyun arkadaşın olmaya hazırım.`);
    utterance.lang = 'tr-TR'; utterance.pitch = profile.pitch; utterance.rate = profile.rate;
    const voice = pickVoice(profile); if (voice) utterance.voice = voice;
    const token = ++speechToken;
    utterance.onstart = () => { if (token === speechToken && profile.model === 'pofidik') window.Pofidik3D?.setSpeaking(true); };
    utterance.onend = utterance.onerror = () => { if (token === speechToken) { window.Pofidik3D?.setSpeaking(false); onComplete?.(); } };
    window.speechSynthesis.speak(utterance);
  }

  function showScreen(name, push = true) {
    clearTimeout(promptTimer);
    if (push && state.screen !== name) state.history.push(state.screen);
    state.screen = name;
    screens.forEach(s => s.classList.toggle('is-active', s.dataset.screen === name));
    topbar.hidden = name === 'welcome';
    document.getElementById('backButton').style.visibility = state.history.length ? 'visible' : 'hidden';
    const buddyHiddenScreens = ['welcome', 'profile', 'avatar', 'intro'];
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
  function updateMascotDisplays() {
    const selected = mascot();
    document.querySelectorAll('[data-mascot-display]').forEach(el => {
      el.classList.toggle('is-pofidik', selected.model === 'pofidik');
      el.dataset.sprite = selected.sprite;
    });
    window.Pofidik3D?.refresh();
  }
  function setAvatar(key) {
    state.avatar = key; updateMascotDisplays();
    document.querySelectorAll('.avatar-card').forEach(c => c.classList.toggle('is-selected', c.dataset.avatar === key));
    document.getElementById('avatarContinue').disabled = false;
    if (key === 'pofidik') window.Pofidik3D?.play(document.querySelector('.avatar-card[data-avatar="pofidik"]'), 'curious');
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
    const open = Object.keys(skillNames).filter(key => state.assessment[key] !== 'can');
    document.getElementById('cognitiveCount').textContent = `${open.length} çalışma`;
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
  function renderCategory(category = state.category) {
    state.category = category;
    const list = document.getElementById('skillList');
    if (category !== 'cognitive') {
      const titles = { language: 'Dil ve İletişim', social: 'Sosyal Beceriler', daily: 'Günlük Yaşam' };
      document.getElementById('categoryKicker').textContent = titles[category];
      document.getElementById('categoryTitle').textContent = 'Bu kategori sonraki kapsamda';
      list.innerHTML = '<div class="empty-state"><span>🧭</span><strong>Henüz etkinlik eklenmedi</strong><p>İlk sürümde yalnızca eşleme ve renk becerileri çalışılıyor.</p></div>';
      return;
    }
    document.getElementById('categoryKicker').textContent = 'Bilişsel Beceriler';
    document.getElementById('categoryTitle').textContent = 'Çalışılacak beceriler';
    const open = Object.keys(skillNames).filter(key => state.assessment[key] !== 'can');
    if (!open.length) {
      list.innerHTML = '<div class="empty-state"><span>🌟</span><strong>Bu bölümde çalışılacak beceri görünmüyor</strong><p>Kaba değerlendirmede tüm beceriler “Yapıyor” olarak işaretlendi.</p></div>';
      return;
    }
    const rows = open.map(key => {
      const skill = skillNames[key]; const playable = skill.playable;
      const status = state.assessment[key];
      const label = status === 'needs' ? 'Kaba değerlendirme: Henüz yapamıyor' : status === 'unknown' ? 'Kaba değerlendirme: Gözlenmedi' : 'Kaba değerlendirme: İşaretlenmedi';
      const action = !playable ? '<button class="secondary-button" type="button" disabled>Hazırlanıyor</button>' : key === 'pattern' || key === 'events'
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

  function shapeMarkup(shape, color) { return `<i class="shape ${shape} ${color}" aria-hidden="true"></i>`; }
  function pairCardMarkup(type) { return `<i class="pair-symbol" aria-hidden="true">${pairSymbols[type]}</i>`; }
  function setGameMode(skill) {
    const pairMode = skill === 'same-red';
    const patternMode = skill === 'pattern';
    const eventMode = skill === 'events';
    document.querySelector('.game-stage').classList.toggle('is-events', eventMode);
    document.querySelector('.target-area').hidden = pairMode || patternMode || eventMode;
    document.getElementById('answerArea').hidden = pairMode || patternMode || eventMode;
    document.getElementById('pairArea').hidden = !pairMode;
    document.getElementById('patternArea').hidden = !patternMode;
    document.getElementById('eventArea').hidden = !eventMode;
    document.getElementById('gameTitle').textContent = eventMode ? 'Olay kartlarını sırala' : patternMode ? 'Boş kutuya hangisi gelmeli?' : pairMode ? 'Aynı kırmızı kartları eşle' : 'Aynı renkte olanı seç';
    document.querySelector('.game-toolbar .step-label').textContent = eventMode ? `Bilişsel beceriler · Olayları sıralama · Seviye ${state.eventLevel}` : patternMode ? `Bilişsel beceriler · Örüntü · Seviye ${state.patternLevel}` : pairMode ? 'Bilişsel beceriler · Aynı tip aynı renk eşleme' : 'Bilişsel beceriler · Renk eşleme';
  }
  function resetActivity(skill = 'two-color', level = 1) {
    state.skill = skill; state.trial = 0; state.stats = { independent: 0, prompted: 0, incorrect: 0 };
    if (skill === 'pattern') state.patternLevel = level;
    if (skill === 'events') state.eventLevel = level;
    setGameMode(skill);
    if (skill === 'same-red') renderPairTrial(); else if (skill === 'pattern') renderPatternTrial(); else if (skill === 'events') renderEventTrial(); else renderTrial();
  }
  function giveInstruction(text, hint) {
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
    document.getElementById('summaryNext').hidden = state.skill === 'events' ? state.eventLevel >= eventContent.levels.length : state.skill !== 'pattern' || state.patternLevel >= patternLevels.length;
    const trialCounts = { 'two-color': trials.length, 'same-red': pairTrials.length, 'pattern': 5 };
    document.getElementById('summaryTitle').textContent = state.skill === 'pattern' || state.skill === 'events'
      ? `Seviye ${state.skill === 'events' ? state.eventLevel : state.patternLevel} · 5 deneme tamamlandı`
      : `${trialCounts[state.skill] || 5} deneme tamamlandı`;
    const generalizations = {
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
  function goPlatform(push = true) { state.editingAssessment = false; renderPlatform(); showScreen('platform', push); }
  function finishEarly() { saveState(); document.getElementById('pauseModal').hidden = true; goPlatform(); }

  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.next)));
  document.getElementById('backButton').addEventListener('click', () => { const previous = state.history.pop(); if (previous) showScreen(previous, false); });
  document.getElementById('homeButton').addEventListener('click', () => { state.history = []; if (state.method) goPlatform(false); else showScreen('welcome', false); });
  document.getElementById('settingsButton').addEventListener('click', () => showScreen('settings'));
  document.getElementById('welcomeSettingsButton').addEventListener('click', () => showScreen('settings'));
  document.getElementById('settingsBack').addEventListener('click', () => { const previous = state.history.pop() || 'welcome'; showScreen(previous, false); });
  document.querySelectorAll('#quickMuteTop, #quickMuteWelcome').forEach(button => button.addEventListener('click', toggleMusic));
  document.getElementById('musicToggle').addEventListener('click', toggleMusic);
  document.getElementById('musicVolume').addEventListener('input', event => setMusicVolume(event.target.value));
  document.getElementById('profileForm').addEventListener('submit', event => {
    event.preventDefault(); state.profile.name = document.getElementById('childName').value.trim(); state.profile.age = document.getElementById('childAge').value;
    state.profile.diagnosis = document.getElementById('diagnosis').value.trim(); saveState(); showScreen('avatar');
  });
  document.querySelectorAll('.avatar-card').forEach(card => {
    card.addEventListener('click', event => { if (!event.target.closest('.voice-button')) setAvatar(card.dataset.avatar); });
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setAvatar(card.dataset.avatar); } });
  });
  document.querySelectorAll('[data-speak]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); speak(button.dataset.speak); }));
  document.getElementById('avatarContinue').addEventListener('click', () => { prepareIntro(); saveState(); showScreen('intro'); setTimeout(() => speak(state.avatar, introMessage()), 250); });
  document.getElementById('readyButton').addEventListener('click', () => {
    const button = document.getElementById('readyButton'); button.disabled = true; button.textContent = 'Süpersin!';
    document.getElementById('introText').textContent = 'Süpersin! Haydi o zaman başlayalım.'; speak(state.avatar, 'Süpersin! Haydi o zaman başlayalım.');
    state.buddyActivated = true; state.editingAssessment = false; saveState();
    setTimeout(() => { restoreAssessmentUI(); updateAssessmentMode(); showScreen('assessment'); }, 1100);
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
  document.getElementById('categoryBack').addEventListener('click', () => { if (state.history[state.history.length - 1] === 'platform') state.history.pop(); goPlatform(false); });
  document.getElementById('skillList').addEventListener('click', event => {
    const opener = event.target.closest('[data-open-levels]');
    if (opener) { renderPatternLevels(opener.dataset.openLevels); showScreen('pattern-levels'); return; }
    const starter = event.target.closest('[data-start-skill]');
    if (starter) { showScreen('activity'); resetActivity(starter.dataset.startSkill); }
  });
  document.getElementById('levelList').addEventListener('click', event => {
    const card = event.target.closest('[data-level]');
    if (card) { showScreen('activity'); resetActivity(state.levelSkill || 'pattern', Number(card.dataset.level)); }
  });
  document.getElementById('patternLevelsBack').addEventListener('click', () => { if (state.history[state.history.length - 1] === 'category') state.history.pop(); renderCategory(); showScreen('category', false); });
  document.getElementById('editAssessment').addEventListener('click', () => { state.editingAssessment = true; restoreAssessmentUI(); updateAssessmentMode(); showScreen('assessment'); });
  document.getElementById('editMethod').addEventListener('click', () => { if (state.method) setMethod(state.method); showScreen('method'); });
  document.getElementById('helpButton').addEventListener('click', () => { if (state.skill === 'events') showHintEvent(); else if (state.skill === 'same-red') showHintPair(); else if (state.skill === 'pattern') showHintPattern(); else showHint(); });
  document.getElementById('pauseButton').addEventListener('click', () => { clearTimeout(promptTimer); document.getElementById('pauseModal').hidden = false; if (state.skill === 'events') { window.speechSynthesis?.cancel(); speechToken += 1; window.Pofidik3D?.setSpeaking(false); } });
  document.getElementById('resumeButton').addEventListener('click', () => { document.getElementById('pauseModal').hidden = true; if (state.skill === 'events') { if (eventAdvancePending) { const run = eventRun; speak(state.avatar, document.getElementById('feedback').textContent || praise(), () => scheduleEventAdvance(run)); } else if (eventNextSlot() >= 0) { if (state.hadPrompt || state.method === 'immediate') showHintEvent(); else { state.eventBusy = true; giveInstruction('Şimdi sıradaki olayı seç.', showHintEvent); } } return; } if (state.method === 'wait' && !state.hadPrompt) { if (state.skill === 'same-red') promptTimer = setTimeout(showHintPair, 4000); else if (state.skill === 'pattern') promptTimer = setTimeout(showHintPattern, 4000); else promptTimer = setTimeout(showHint, 4000); } });
  document.getElementById('finishButton').addEventListener('click', finishEarly); document.getElementById('pauseFinish').addEventListener('click', finishEarly);
  document.querySelectorAll('#bubbleZone button').forEach(button => button.addEventListener('click', () => {
    if (button.classList.contains('is-popped')) return; button.classList.add('is-popped'); bubbles -= 1;
    document.getElementById('bubbleStatus').textContent = bubbles ? `${bubbles} baloncuk kaldı` : 'Hepsi tamam!'; if (!bubbles) document.getElementById('endgameContinue').disabled = false;
  }));
  document.getElementById('endgameContinue').addEventListener('click', () => { updateSummary(); showScreen('summary'); });
  document.getElementById('summaryHome').addEventListener('click', () => { state.history = []; goPlatform(false); });
  document.getElementById('summaryNext').addEventListener('click', nextPatternLevel);
  document.getElementById('summaryGame').addEventListener('click', () => showScreen('planned-game'));
  document.getElementById('plannedGameBack').addEventListener('click', () => { state.history = []; updateSummary(); showScreen('summary', false); });
  floatingBuddy.addEventListener('click', () => {
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

  loadState(); loadAudioSettings(); loadVoices(); if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;
  tryStartMusic();
  renderPlanUI();
  document.addEventListener('pointerdown', tryStartMusic, { once: true, capture: true });
  document.addEventListener('keydown', tryStartMusic, { once: true, capture: true });
  document.getElementById('childName').value = state.profile.name; document.getElementById('childAge').value = state.profile.age; document.getElementById('diagnosis').value = state.profile.diagnosis;
  if (state.avatar) setAvatar(state.avatar); restoreAssessmentUI(); updateAssessmentMode(); updateMascotDisplays();
  if (document.modelContext?.registerTool) {
    Promise.resolve(document.modelContext.registerTool({
      name: 'start_two_color_matching', title: 'İki renk arasından eşleme çalışmasını başlat',
      description: 'Seçili öğretim yöntemiyle beş denemelik kırmızı-mavi renk eşleme çalışmasını görünür olarak başlatır.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() { showScreen('activity'); resetActivity(); return { status: 'started', activity: 'two_color_matching', trials: 5, method: state.method }; }
    })).catch(() => {});
  }
})();
