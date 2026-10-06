# Dijital Erken Eğitim

Yeni bilişsel etkinlik: **Olay kartlarını oluş sırasına göre sıralama**. 10 seviye, her seviyede 5 deneme; iki karttan beş karta ilerler. 25 günlük olayın toplam 125 ayrı resmi kullanılır. Kartlar üstte karışık, numaralı yerler alttadır; dokunma ve sürüklemeyle sıralanır. Başlangıçta seçilen eşzamanlı / 4 saniye bekleme yöntemi korunur. Kontrol: `node scripts/check-events.mjs --assets`.

Örüntü etkinliğindeki somut nesneler artık 33 ortak, gerçeğe yakın iki boyutlu resimle gösterilir. Şeffaf arka planlı yerel görseller `dist/assets/objects/` içindedir; sayma ve küçük/büyük denemelerinde aynı nesne resmi kullanılır. 15. seviye daha karmaşık dört/beş öğelik tekrar gruplarından oluşur. Beş deneme sonunda oyun, sonraki seviye ve ana menü seçenekleri sunulur; son seviyede sonraki seviye düğmesi gizlenir. Bölüm sonu oyunu henüz hazırlanmadığından oyun seçeneği hazırlık ekranını açar.

Güncel sürüm **0.16.1**. Qoder'da bilgisayarda geliştirilen 0.9.1 çalışması korunmuştur: örüntü etkinliği 15 seviye ve her seviyede 5 deneme içerir. Eşzamanlı ipucu ve 4 saniye sabit bekleme akışları bağlıdır. Eksik yeşil kare tanımı düzeltilmiştir.

Windows'ta tüm klasörü indirin/çıkartın ve **Baslat.cmd** dosyasını açın. Ücretsiz Node.js 22 veya üstü gerekir. Uygulamayı çalıştırmak için `npm install` gerekmez. macOS/Linux'ta proje klasöründe `node scripts/start-with-speech.mjs` çalıştırın; `http://127.0.0.1:4180/` adresini açın.

Pofidik artık seçilebilir, şeffaf 3B oyun arkadaşıdır. Sağ ve sol el selamı çıkarılmıştır; kalan 14 animasyon GLB içinde saklanır. Konuşma hareketi tarayıcı sesinin başladığı/bittiği anlara bağlanır; fonem düzeyinde dudak eşlemesi değildir. Diğer üç karakterin mevcut görselleri korunmuştur.

Pofidik’i sağ-alt köşeden sol fare tuşu veya parmak basılı sürüklemeyle ekran içinde taşıyabilirsin. Satın al ekranında yalnızca aylık 300 ₺ Premium planı bulunur; ödeme ekranı bağlantısı hazırlanmıştır, gerçek ödeme sağlayıcısı henüz bağlanmamıştır.

- Başka bilgisayara taşıma ve GitHub adımları: [README-OTHER-COMPUTER.md](README-OTHER-COMPUTER.md)
- Güncel kararlar: [PROJECT_DECISIONS.md](PROJECT_DECISIONS.md)
- Kontrol: `node scripts/check-project.mjs`
- Kaynak kod: `dist/app.js`, `dist/index.html`, `dist/styles.css`
- 3B görüntüleyici kaynağı: `scripts/pofidik-viewer-source.js`
- Görüntüleyiciyi yeniden derlemek için: `npm install`, sonra `npm run build:viewer`. Hazır `dist/pofidik-viewer.js` her zaman projede tutulmalıdır.

Onaylı animasyonsuz model `source-assets/pofidik-approved.glb` içinde değişmeden korunur. Yeni üretim ve ücretli Tripo çağrısı yapılmamıştır. Model yüksek ayrıntılıdır; ilk yükleme yaklaşık 105 MB ve WebGL gerektirir. Düşük donanımda performans değişebilir. Mevcut kulak, gerinme, göz kırpma ve ağız hareketlerinin önceki denemedeki sınırlamaları yeniden modellenmemiştir.

Çocuk profilleri tarayıcının yerel depolamasındadır. Bu depo öğrenci kaydı içermez, cihazlar arasında profil eşitlemez ve gerçek ödeme altyapısı sağlamaz. Kaynak depo, çalıştırılmış bir internet sitesiyle aynı şey değildir.

Nesne eşleme: Bilişsel becerilerden Nesne eşleme > Kategorileri aç. Onaylı 10 kategoride 100 nesne; her nesne dört seviyede beşer deneme. Aynı resimden farklı görünümlere, bir hedeften üç hedefe ilerler. Nesne adı + eşle yönergesi, sürükleme/dokunma ve seçilen öğretim yöntemi uygulanır. Kontrol: `node scripts/check-object-matching.mjs --assets`.


## Nesne ismi söyleme (0.14.0)
Dil ve İletişim → Nesne ismi söyleme üzerinden aynı 10 kategori ve 100 nesne çalışılır. Üç nesne aşaması (aynı resim, farklı görünüm, günlük ortam) ve dört karma aşama vardır. Her aşama beş denemedir. Seçilen eşzamanlı veya 4 saniye bekleme yöntemi aktarılır. İlk yanlış/yanıtsızlıkta model ve bir tekrar fırsatı verilir; ikinci yanlış/yanıtsızlıkta doğru isim söylenir ve sonraki denemeye geçilir. Net anlaşılamayan ses ve mikrofon hatası çocuk hatası sayılmaz. Kaba değerlendirmede Nesnenin adını söyler seçeneği vardır.

Ses için Python ve `requirements-speech.txt` bağımlılıkları gerekir (`python -m pip install -r requirements-speech.txt`). `node scripts/start-with-speech.mjs --open` veya Baslat.cmd web uygulamasıyla yerel ses hizmetini birlikte başlatır. NAMING_PYTHON ile Python yolu belirtilebilir. Bu bilgisayarda hazır Python/model kullanılır. İlk Whisper model indirmesi internet gerektirir; sonrasında ses yerelde, bellekte işlenir ve ses dosyası kaydedilmez. Öğrenci kaydına yalnızca blok sonuç toplamları eklenir; duyulan metin saklanmaz. Mikrofon için localhost veya HTTPS gerekir. Siteye yayınlandığında ayrıca uygun bir ses sunucusu gerekir; bu sürümün ses hizmeti yerel bilgisayarda çalışır.

Eski bağımsız `naming-prototype.html` deneme sayfası korunur. Ana etkinlik `naming-activity.html` içinde aynı doğrulanmış öğretim motorunu kullanır.

0.14.1: Günlük ortam aşamaları nesne başına beş bütün fotoğraf kullanır. Mikrofon izni Başlayalım sırasında bir kez alınır; izinli uygulama oturumunda etkinlik otomatik başlar. Akış yönerge/mola ve diğer ekranlarda susturulur, uygulamadan çıkınca kapatılır. Kalıcı izin seçeneğini tarayıcı ve cihaz belirler.

## 0.16.1 — Güncel görünüm ve uygulamacı paneli

Programın adı Dijital Erken Eğitim. Dört beceri alanı özgün, soluk arka plan görselleriyle gösterilir. Uygulamacı paneli cihaz tarayıcısına özel 6 haneli PIN ile korunur; çocuk modu değerlendirme/yöntem/profil ayarlarına erişemez. Bu yerel çocuk erişim sınırıdır, sunucu kimlik doğrulaması değildir. Oturum arka plana alınınca kilitlenir.

Müzik seçenekleri Playful Children (AudioCoffee), Fun Game (REDproductions) ve Life of Riley (Kevin MacLeod). Önceki özgün örnekler ayrı bölümde korunur. Eser ve lisans bilgileri `dist/music-credits.html` ve `dist/assets/music/sources.json` içindedir. Pixabay eserleri uygulamanın parçası olarak kullanılır; ham müzikleri ayrı bir ürün olarak dağıtmayın. Kevin MacLeod eseri CC BY 4.0 kapsamında kaynak gösterilerek kullanılır. Otomatik Content ID bildirimlerinin hiç çıkmayacağı garanti edilmez.
