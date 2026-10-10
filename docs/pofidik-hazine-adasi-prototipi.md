# Pofidik — Hazine Adası denemesi

Ayrı önizleme: `/pofidik-island.html`. Ana programın etkinlik listesi, öğrenci kayıtları ve öğretim yöntemleri değiştirilmedi. GitHub veya siteye yayımlanmadı.

Onaylı `dist/assets/avatars/pofidik/model.glb.gz`/`model.glb` kullanılır; karakter dosyası değiştirilmez. Ada, dalgalanan deniz, palmiyeler, taş yol, beş mühür, iki kanatlı kapı ve hazine sandığı Three.js ile yerelde çizilir. Yeni ücretli model, animasyon veya dış görsel servisi kullanılmadı. Mevcut breathe/nod_yes/shake_no/curious/listen/sway klipleri korunur. Kamera hareketi ve sahnedeki karakter konumu başlangıç/sonuç geçişlerinde programlanmıştır; ayrı bir üretilmiş yürüyüş klibi değildir.

Beş örüntü: muz–elma; elma–muz; muz–elma–elma; elma–elma–muz; elma–muz–portakal. Her seçenek yalnızca o örüntüdeki meyvelerden biridir. Yanlış cevap mühür açmaz; tekrar deneme ve sesli/görsel ipucu vardır. Doğru cevap bir mührü yakar. Beş cevap tamamlanmadan kapı açılmaz. Sonrasında kapı, sandık ve ışıklar birlikte açılır. Yeniden oynama tüm mühürleri sıfırlar.

Dokunma/fare, açılışı geçme, sesi kapatma, azaltılmış hareket tercihi ve telefon kadrajı desteklenir. Bu oyun serbest oyun prototipidir; ana öğretim motorunun eşzamanlı/4 saniye yöntemiyle entegrasyonu sonraki karara bırakılmıştır. İlk Pofidik yüklemesi mevcut yüksek kaliteli karakter dosyasını indirir; ilerleme ekranda gösterilir.

Kaynak: `scripts/pofidik-island-source.js`. Derleme: `node scripts/build-island.mjs`. Dağıtım dosyası hazır olduğundan oyun Node/derleyici kurulmadan mevcut web sunucusunda açılır. Yeni uygulama menüsü veya değerlendirme kazanımı eklenmedi.


## Hikâyeli ada sürümü
Gemide haritanın bulunması, büyük adaya yolculuk, taş yolda yürüyüş, gizli geçit ve yardım daveti olmak üzere beş anlatımlı kamera sahnesi eklendi. Sesli anlatım bitmeden sonraki sahne başlamaz. On ekleme uygulanan yerel yürüyüş animasyonu özgün karakter dosyasını değiştirmez. Hazine odası yan duvarlar, arka duvar ve tavanla kapatıldı; taş dokusu, meşaleler ve kıvrımlı palmiye yaprakları eklendi. Beş örüntü denemesi korunur.

## Gemi, kıyı ve bölüm sonu örüntü düzeni
İki yelkenli büyük ahşap gemi, kamara, güverte ve harita eklendi. Açılışta ada gizlidir; gemi açık denizden kıyı dışındaki z=29 konumuna gelir. Ada sinüslü asimetrik kıyı ve daha yüksek kayalıklarla genişletildi. Kapı açılırken Pofidik bekler, sonra geçitten sandığın yanına yürür. Beş örüntü AB, AAB, AABB, ABC ve ABBC sırasındadır; seçeneklerde yalnız o denemenin nesneleri bulunur. Telefonlarda tek satır korunur. İlk, ara ve son mühür seslendirmeleri ayrıdır. Henüz ana programa bağlanmadı ve yayımlanmadı.

## Canlı çevre ve gemi düzeltmeleri
Gövdenin arka yüzü kapatıldı ve ön uç sivri tamamlandı. Gemi -Z yönüne, burnu hareket yönüne bakarak ilerler; kıyı durağı değişmedi. Ada arkaya doğru uzatıldı; 46 ağaç, tepeler, çalılar ve küçük çiçekler eklendi. Yelkenlerin gerçek mesh yüzeyi rüzgârla esner; ağaçlar ve çiçekler hafif sallanır. Anlatım taş yapı/kapıyla uyumludur. Sandık dört duvarlı, içi oyuk olarak oluşturuldu; ahşap üst yüzey yerine altın yığını ve 90 altın vardır. Pofidik sandıktan uzağa, sol tarafta konumlanır ve finalde kollarını geniş sallamaz. Yerel prototiptir.

## Antik meşaleler ve arazi düzeltmesi
Kapı üstündeki küreler beş ahşap/demir meşaleyle değiştirildi. Her doğru cevap bir meşale yakar; yanlışta yakılmaz, yeniden oynarken söner. İkinci ekran ışık sırası gizlenir. Kapı/tavan geometrisinin örtüşmesi giderildi; güneş gölgesine normalBias eklendi. Yeşil kubbe tepeleri yerine kıyı sınırına kırpılmış alçak ve sürekli arazi yüzeyi kullanılır. Taçların biçimleri farklılaştırıldı; mevcut hafif rüzgâr korunur. Önceki sürüm outputs/backups/living-island-v5 altında. Yerel prototip; ana uygulamaya bağlantı/yayınlama yapılmadı.

## Ana programa entegrasyon
Ana ekrana Oyunlar kategorisi, içinde kare Pofidik’in Hazine Şifresi kartı eklendi. Örüntü çalışmasının beş deneme özeti Oyuna geç düğmesi aynı oyunu açar. Oyun ayrı iframe’de çalışır; ana müzik ve ikinci maskot gizlenir. Programa dön mesajı yalnız aynı origin ve oyun iframe kaynağından kabul edilir; geldiği özet/kategoriye döner. Ayrılınca iframe about:blank olur, oyun ve ses kapatılır. Diğer etkinliklerin planlanan bölüm sonu oyunları değişmedi. Simge built-in image_gen ile üretildi; istem source-assets/games/treasure-icon-prompt.md, son varlık dist/assets/games/treasure-icon.png. Yerel entegrasyon; yayınlama/GitHub güncellemesi yapılmadı.
