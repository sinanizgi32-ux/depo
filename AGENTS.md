# Proje çalışma notları

- Olayları sıralama bilişsel kazanımı: `dist/events-data.js` içinde 25 olay ve 10 seviyede 50 deneme vardır. İlk iki seviye iki kart, 3–5. seviyeler üç kart, 6–8. seviyeler dört kart, 9–10. seviyeler beş kart içerir. Üstteki karışık kartlar dokunmayla sıradaki boşluğa veya sürüklemeyle doğru numaralı boşluğa yerleştirilir. Alt boşluk sayısı kart sayısıyla aynıdır. İki kartlı seçimde başlangıç/sonuç görsel olarak ayırt edilebilir olmalıdır. Her kartın doğru yerleşiminde pekiştirme verilir; dört saniyelik yanıt aralığı her yeni kart seçiminde yönerge/pekiştirme bittikten sonra başlar. İlk yanlışta ve yanıtsızlıkta olay sırası açıklanır, sıradaki doğru kart ve boşluk vurgulanır. Beş deneme sonunda üç bitiş seçeneği sunulur; olayların 10. seviyesinde sonraki seviye gizlenir. Ses tanıma fikri henüz uygulanmadı.

- Görsel tercihi: somut nesnelerde iki boyutlu, gerçeğe yakın ve kolay tanınan resimler kullanılır; ileri seviyelerde soyut şekiller uygundur. 33 ortak nesne resmi `dist/assets/objects/*.webp` içinde bulunur; emojiye geri dönülmez. Sayma ve küçük/büyük denemeleri aynı resmi adet ve boyut değiştirerek kullanır. Görsel üretim yönergeleri aynı klasörde `prompts.json` içindedir. 14. seviyenin sayılan yıldızları dik, üst üste ve net gösterilir. 15. seviye beş karmaşık denemeden oluşur: en az üç nesne ve dört/beş öğelik tekrar blokları.

- Örüntü seçeneklerinde yalnızca o denemede gösterilen nesneler bulunur; dışarıdan çeldirici eklenmez. Beş deneme sonunda doğrudan çalışma özeti ve Oyuna geç / Bir sonraki seviyeye geç / Ana menüye dön seçenekleri gösterilir. Son seviyede sonraki seviye gizlenir. Bölüm sonu oyunu henüz planlanmadığından Oyuna geç şimdilik hazırlanmadı ekranına açılır; eski baloncuk oyunu otomatik başlatılmaz.

- Kullanıcının öğretim kuralı tüm mevcut ve yeni öğretim etkinlikleri için geçerlidir: seçilen yöntem korunur. 4 saniye sabit beklemede yönerge sesi bittikten sonra 4 saniye bağımsız yanıt fırsatı verilir. Doğru yanıt hemen mevcut pekiştirme cümlelerinden biriyle ödüllendirilir; konuşma kesilmez. Yanıtsızlıkta açıklamalı doğru yanıt gösterilir ve çocuktan basması istenir. İlk yanlışta beklemeden açıklamalı hata düzeltmesi yapılır. Eşzamanlı yöntemde yönerge biter bitmez açıklamalı doğru yanıt gösterilir. Örüntü ipucunda görünen nesneler ve tekrar eden sıra anlatılır; yalnızca cevap adı söylenmez.

Bu, Dijital Özel Eğitim ana projesidir. 0.8.0 sürümü kullanıcının verdiği 0.7.1 kaynak yedeği üzerine eklenmiştir; yeni boş proje başlatmayın.

- Çalışan kaynaklar `dist/app.js`, `dist/index.html`, `dist/styles.css` içindedir. `dist` ve içindeki varlıklar sürüm kontrolünde tutulmalıdır.
- `node scripts/serve.mjs` ile başlatın; `node scripts/check-project.mjs` ile kontrol edin. Dosyayı doğrudan `file://` ile açmak 3B model yüklemesi için yeterli değildir.
- Pofidik GLB: `dist/assets/avatars/pofidik/model.glb`; manifest aynı klasörde `animations.json`.
- Kullanıcı sağ/sol kol-el selamından vazgeçti: `wave_left` ve `wave_right` animasyonlarını yeniden eklemeyin. Kalan 14 animasyon korunmuştur. Etrafında dönme ve eski Mimo da uygulamada yoktur.
- `source-assets/pofidik-approved.glb` onaylı değişmez temel kayıttır; üzerine yazmayın. Düzeltmelerde yeni sürüm/yedek oluşturun.
- 3B görüntüleyici `scripts/pofidik-viewer-source.js` içinde; `npm install` ve `npm run build:viewer` ile derlenir. Dağıtılan hazır görüntüleyici Node bağımlılığı gerektirmez.
- Küçük oyun arkadaşı sağ altta çerçevesiz ve arka plansızdır. Ses başlayınca konuşma hareketi, bitince nefes alma geri gelir.
- Pofidik, sağ-alt düğmesinden sol fare/parmak basılı sürüklemeyle ekran sınırları içinde taşınabilir. Sürükleme tıklamadan ayrıdır; tıklama tepkisi korunur.
- Üyelik ekranında yalnızca Premium aylık 300 ₺ gösterilir. Ödeme düğmesi şu anda güvenli ödeme sağlayıcısına bağlanacak yer tutucu akıştır; kart/ödeme tahsilatı yapmaz. Gerçek ödeme için sunucu tarafında sağlayıcı hesabı ve webhook gerekir.
- Diğer üç karakter için henüz 3B model yapılmadı. Yüz/kulak/gerinme klipleri önceki V6 prototipidir; kusursuz kalite veya fonem dudak eşlemesi iddiasında bulunmayın.
- Kredi harcayan yeni model, iskelet veya animasyon işlemleri için önce işlem ve maliyet planı gösterin, kullanıcının yeni onayını alın.
- GitHub deposu `https://github.com/sinanizgi32-ux/depo`. Kullanıcı açık depoya yalnızca proje ve karakter dosyalarını yüklemeyi onayladı; öğrenci verilerini, anahtarları ve yerel kimlik bilgilerini asla göndermeyin.

- Olay kartları konum düzeltmesi: rastgele karıştırma doğru sırayı da kapsar; iki kartta ilk olayın hep sağda kalması engellenir. Seviye 2 bitki denemesi solmuş bitki → çocuğun sulamasıdır. Buz ve lamba yerine muzu soyup yeme ve kâğıttan kayık yapma kullanılır. Seviye 3 kahvaltısı boş kâse → süt ekleme → yemek yeme şeklindedir. Zarfın başlangıç resminde resimli kartpostal zarfın dışında yanında açıkça görünür.
