// Her olayın beş ayrı görsel adımı vardır. Seviyeler anlamlı alt sıraları kullanır.
window.EventSequences = (() => {
  const definitions = [
    ['apple', 'Elmayı hazırlayıp yeme', ['Çocuk elmayı alıyor.', 'Elmayı suyla yıkıyor.', 'Temiz elmayı kuruluyor.', 'Elmayı tabağa koyuyor.', 'Çocuk elmayı yiyor.']],
    ['hands', 'Ellerini yıkama', ['Çocuğun elleri kirli.', 'Ellerini suyla ıslatıyor.', 'Ellerini sabunla köpürtüyor.', 'Ellerini suyla duruluyor.', 'Temiz ellerini havluyla kuruluyor.']],
    ['drawing', 'Resim yapma', ['Çocuk boş kâğıdı masaya koyuyor.', 'Boya kalemlerini alıyor.', 'Kâğıda bir çiçek çiziyor.', 'Çiçeği boyuyor.', 'Bitirdiği renkli resmi gösteriyor.']],
    ['balloon', 'Balon hazırlama', ['Masanın üzerinde sönük balon var.', 'Yetişkin balonu el pompasına takıyor.', 'Yetişkin pompayla balonu şişiriyor.', 'Yetişkin şişen balonun ağzını bağlıyor.', 'Çocuk hazır balonu tutuyor.']],
    ['book', 'Kitap okuma', ['Çocuk raftan kitabı alıyor.', 'Kitabı masaya koyuyor.', 'Kitabın kapağını açıyor.', 'Açık kitaptaki resimlere bakıyor.', 'Okuduğu kitabı kapatıyor.']],
    ['tower', 'Kule yapma ve yıkılma', ['Yapı blokları masada ayrı duruyor.', 'Çocuk blokları üst üste koyuyor.', 'Çocuk yüksek kuleyi tamamlıyor.', 'Oyuncak araba kuleye çarpıyor.', 'Kule yıkılıyor, bloklar dağılıyor.']],
    ['plant', 'Susamış bitkiyi sulama', ['Saksıdaki bitki susuz, yaprakları sarkmış.', 'Çocuk sulama kabını alıyor.', 'Sulama kabına su dolduruyor.', 'Saksıdaki toprağı suluyor.', 'Daha sonra bitkinin yaprakları dik ve canlı görünüyor.']],
    ['banana', 'Muzu soyup yeme', ['Çocuk kabuğu açılmamış muzu alıyor.', 'Muzun kabuğunu açmaya başlıyor.', 'Muzun kabuğunu soyuyor.', 'Soyduğu muzu yiyor.', 'Muz bitiyor, geriye boş kabuğu kalıyor.']],
    ['shirt', 'Islak tişörtün kuruması', ['Yıkanmış tişört ıslak.', 'Yetişkin ıslak tişörtü çamaşır sepetinden alıyor.', 'Tişörtü ipe asıyor.', 'Tişört güneşte kuruyor.', 'Yetişkin kuru tişörtü katlıyor.']],
    ['paper', 'Kâğıttan kayık yapma', ['Çocuk düz mavi kâğıdı masaya koyuyor.', 'Kâğıdı ikiye katlıyor.', 'Kâğıdın köşelerini katlıyor.', 'Katladığı kâğıdı açıp kayık yapıyor.', 'Hazır kâğıt kayığı suda yüzdürüyor.']],
    ['teeth', 'Dişlerini fırçalama', ['Çocuk diş fırçasını alıyor.', 'Fırçaya diş macunu sıkıyor.', 'Dişlerini fırçalıyor.', 'Ağzını suyla çalkalıyor.', 'Fırçayı yıkayıp yerine koyuyor.']],
    ['shoes', 'Ayakkabı giyme', ['Çocuk çoraplı, ayakkabıları yerde.', 'Çocuk ilk ayakkabısını giyiyor.', 'İkinci ayakkabısını da giyiyor.', 'Ayakkabıların cırtlarını kapatıyor.', 'Ayakkabılarını giyip yürümeye başlıyor.']],
    ['breakfast', 'Kahvaltı hazırlama', ['Masada boş kâse ve kahvaltılık gevrek var.', 'Çocuk kâseye gevrek koyuyor.', 'Kâseye süt ekliyor.', 'Kahvaltısını kaşıkla yiyor.', 'Boş kâseyi mutfak tezgâhına götürüyor.']],
    ['bag', 'Okul çantasını hazırlama', ['Boş okul çantası masada duruyor.', 'Çocuk defterini çantaya koyuyor.', 'Kalem kutusunu çantaya koyuyor.', 'Çantanın fermuarını kapatıyor.', 'Hazır çantasını sırtına takıyor.']],
    ['tidy', 'Oyuncakları toplama', ['Oyuncaklar yerde dağınık.', 'Çocuk oyuncak kutusunu getiriyor.', 'Oyuncak arabaları kutuya koyuyor.', 'Yapı bloklarını da kutuya koyuyor.', 'Oyuncaklar kutuda, yer temiz ve düzenli.']],
    ['seed', 'Tohumdan bitki yetiştirme', ['Çocuk boş saksıya toprak koyuyor.', 'Toprağa bir tohum yerleştiriyor.', 'Tohumun üstünü toprakla kapatıyor.', 'Saksıyı suluyor.', 'Bir süre sonra topraktan yeşil filiz çıkıyor.']],
    ['kite', 'Uçurtma uçurma', ['Çocuk ve yetişkin uçurtmayı parka getiriyor.', 'Yetişkin uçurtmanın ipini hazırlıyor.', 'Yetişkin uçurtmayı havaya kaldırıyor.', 'Çocuk ipi tutup koşuyor, uçurtma yükseliyor.', 'Çocuk ipi tutarken uçurtma gökyüzünde uçuyor.']],
    ['puzzle', 'Yapbozu tamamlama', ['Yapboz parçaları masada ayrı duruyor.', 'Çocuk iki parçayı birleştiriyor.', 'Başka parçaları da ekliyor.', 'Son parçayı boş yere yerleştiriyor.', 'Yapboz tamamlanıyor, bütün resim görünüyor.']],
    ['sand', 'Kumdan kale yapma', ['Çocuk boş kovayı kumun yanına koyuyor.', 'Kovayı kumla dolduruyor.', 'Kovayı ters çevirip yere koyuyor.', 'Kovayı yukarı kaldırıyor, kumdan kale ortaya çıkıyor.', 'Kalenin üstüne küçük bayrak takıyor.']],
    ['butterfly', 'Kelebeğin oluşumu', ['Yeşil yaprağın üzerinde küçük yumurta var.', 'Yumurtadan çıkan tırtıl yaprağı yiyor.', 'Tırtıl dalda koza oluşturuyor.', 'Kelebek kozadan çıkıyor.', 'Kelebek açık kanatlarıyla uçuyor.']],
    ['sandwich', 'Sandviç hazırlama', ['Çocuk tabağa bir dilim ekmek koyuyor.', 'Ekmeğin üzerine peynir koyuyor.', 'Peynirin üzerine domates dilimleri koyuyor.', 'Üzerini ikinci ekmek dilimiyle kapatıyor.', 'Hazır sandviçi yiyor.']],
    ['letter', 'Kartpostal gönderme', ['Masada açık zarf ve zarfın dışında resimli kartpostal duruyor.', 'Çocuk kartpostaldaki resmi boyuyor.', 'Kartpostalı zarfa koyuyor.', 'Yetişkin zarfı kapatıp pul yapıştırıyor.', 'Çocuk yetişkinle zarfı posta kutusuna atıyor.']],
    ['cookies', 'Kurabiye hazırlama', ['Yetişkin kurabiye malzemelerini masaya koyuyor.', 'Yetişkin kâsede hamuru karıştırıyor.', 'Çocuk ve yetişkin hamura şekil veriyor.', 'Yetişkin tepsiyi fırına koyuyor, çocuk uzakta bekliyor.', 'Pişmiş ve soğumuş kurabiyeler tabakta, çocuk birini yiyor.']],
    ['recycle', 'Kâğıdı geri dönüştürme', ['Kullanılmış kâğıtlar masada duruyor.', 'Çocuk kâğıtları diğer çöplerden ayırıyor.', 'Kâğıtları üst üste topluyor.', 'Topladığı kâğıtları geri dönüşüm kutusuna taşıyor.', 'Kâğıtları kutuya atıyor, masa temiz kalıyor.']],
    ['rain', 'Yağmurda şemsiye kullanma', ['Çocuk pencereden yağmuru görüyor.', 'Çocuk kapının yanından kapalı şemsiyeyi alıyor.', 'Yetişkinle dışarı çıkınca şemsiyeyi açıyor.', 'Açık şemsiyeyle yağmurda yürüyor.', 'Kapalı alana girince şemsiyeyi kapatıyor.']]
  ];
  const stories = Object.fromEntries(definitions.map(([id, title, steps]) => [id, { id, title, steps }]));
  const groups = Array.from({ length: 5 }, (_, index) => definitions.slice(index * 5, index * 5 + 5).map(([id]) => id));
  const specs = [
    ['Başlangıç ve sonuç', 0, [0, 4]], ['Basit neden ve sonuç', 1, [0, 4]],
    ['Üç adımlı günlük işler', 2, [0, 2, 4]], ['Üç adımlı oyun ve doğa', 3, [0, 2, 4]],
    ['Üç adımlı hazırlık', 4, [0, 2, 4]], ['Dört adımlı tanıdık olaylar', 0, [0, 1, 2, 4]],
    ['Dört adımlı değişimler', 1, [0, 1, 3, 4]], ['Dört adımlı günlük işler', 2, [0, 1, 3, 4]],
    ['Beş adımlı oyun ve doğa', 3, [0, 1, 2, 3, 4]], ['Beş adımlı hazırlık ve planlama', 4, [0, 1, 2, 3, 4]]
  ];
  const levels = specs.map(([title, group, indices]) => ({ title, tag: `${indices.length} olay kartı`, examples: groups[group].map(story => {
    // İki kartta başlangıç ve sonuç görsel olarak farklı olmalı.
    const steps = group === 1 && indices.length === 2 && story === 'tower' ? [2, 4]
      : group === 1 && indices.length === 2 && story === 'plant' ? [0, 3]
      : group === 2 && indices.length === 3 && story === 'breakfast' ? [0, 2, 3] : [...indices];
    return { story, indices: steps };
  }) }));
  return { stories, levels };
})();
