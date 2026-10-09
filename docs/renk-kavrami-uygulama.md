# Renk kavramı — uygulama kaydı, 0.21.0

Kaynak: Kullanıcının `renk-kavrami-son-3.docx` belgesi. Renkler kırmızı, mavi, sarı ve yeşil. Oyun açıklamaları öğretim akışından ayrı tutuldu; bölüm sonu oyunları hazırlanmadı ekranına gider.

## Eşleme: dokuz basamak

1. Aynı tip, aynı renk iki kart; birebir eşleme.
2. Aynı renk, farklı şekil ve boyutta kartlar; birebir eşleme.
3. İki hedef arasından aynı tip, aynı renk kartı eşleme.
4. İki hedef arasından farklı tip, aynı renk kartı eşleme.
5. Üç hedef arasından aynı tip, aynı renk kartı eşleme.
6. Üç hedef arasından farklı tip, aynı renk kartı eşleme.
7. Üç farklı nesne resmi arasından aynı rengi eşleme.
8. Dört farklı nesne resmi arasından aynı rengi eşleme.
9. Dört farklı renk ve nesne arasında karma renk eşleme.

Kaynak kart altta, hedefler üsttedir. Sürükleme veya karta ve ardından hedefe dokunma desteklenir. Gerçek nesne aşamalarında kaynak ve doğru hedef farklı nesnelerdir.

## Gösterme: yedi basamak

1. Aynı tip iki renk kartı.
2. Farklı tip iki renk kartı.
3. Üç gerçekçi nesne resmi.
4. Dört gerçekçi nesne resmi.
5. Üç nesneyle karma renkler.
6. Çok renkli bir resim içindeki istenen renk bölgesi.
7. Çok renkli resimlerde karma renk bölgeleri.

## Renk ismi söyleme: yedi basamak

1. Farklı tip tek renk kartları.
2. Aynı tür, farklı tip beş çorap resmi.
3. İki nesne arasından işaretlenen nesnenin rengi.
4. Üç nesne ve günlük ortamda işaretlenen nesnenin rengi.
5. Çok renkli resimde işaretlenen bölgenin rengi; renkler sırayla.
6. Çok renkli resimde karma renk bölgeleri.
7. Üç farklı nesne arasından işaretlenen nesnenin rengi; karma renkler.

Kitap, kalem, dolap ve kapı aşamalarında her nesne için ayrı beş deneme vardır. Sabit renk aşamalarında kırmızı → mavi → sarı → yeşil sırası izlenir. Başlangıç rengi seçilebilir. Karma gösterme/söyleme bölümleri toplam yirmi denemedir; her renk beş kez sorulur, ardışık hedef rengi değişir. Son karma eşleme bölümünde beş deneme vardır. Beş denemelik her bölümün sonunda ilerle / oyuna geç / ana menü seçenekleri görünür; son bölümde ilerle gizlenir.

## Öğretim ve dinleme

Seçilen yöntem ana programdan alınır. Eşzamanlı öğretimde yönerge biter bitmez doğru yanıt açıklanarak vurgulanır. Sabit beklemede dört saniyelik bağımsız yanıt aralığı yönerge sesi bittikten sonra başlar. Yanlışta veya yanıtsızlıkta görsel ve sözel ipucu birlikte verilir. Eşleme/göstermede çocuk tamamlayana kadar ipucu kalır.

Söylemede dinleme yönergeden sonra başlar, program konuşurken kapanır. En çok iki başarısız fırsat verilir; ardından doğru renk modellenip deneme tamamlanmadan geçilir. Bağlantı ve mikrofon hataları çocuğun hatası sayılmaz. Yanlış sözcük güvenliyse hata düzeltmesinde kullanılır; uygunsuz sözcük gizlenir ve seslendirilmez. Türkçe renk adları ve sınırlı yakın söyleyişler kabul edilir; yabancı renk adları kabul edilmez. Konuşma sistemi yalnız bütün dört renk adını içeren görev sözlüğünü alır; sorunun doğru cevabı sunucuya gönderilmez. Ses veya duyulan metin öğrenci kaydına yazılmaz.

Belgedeki pekiştireç silikleştirmesi uygulanır: aynı çalışma oturumunda ilk otuz doğru yanıtın her biri güçlü sözel pekiştirme, sonraki yirmi doğru yanıtın ikisinde bir, sonrasında üçünde bir güçlü pekiştirme. Diğer doğrulara “Doğru” geri bildirimi verilir. İpucuyla doğrular bağımsız doğru olarak kaydedilmez.

## Belgedeki belirsizlikler ve dijital uyarlama

- Bazı gösterme satırlarında üç ve beş deneme birlikte yazılıdır. Kullanıcının mevcut beş denemelik düzeni esas alındı.
- Eşleme tablosunun yedinci veri satırının başlangıcı kaynak belgede eksiktir. İki seçenekli basamak ile üç seçenekli farklı tip basamağı arasına üç seçenekli aynı tip basamağı kondu; bu, belgeden birebir okunabilen bir satır değil, sıralamayı tamamlayan yorumdur.
- Üç boyutlu gerçek nesneler ekranda hacmi, dokusu ve gölgesi belirgin gerçekçi nesne resimleriyle temsil edilir; uygulama fiziksel nesne sunmaz.
- Elma/kiraz gibi nesnelerde doğada bulunmayan mavi meyve örnekleri kullanılmaz. Bu renklerde kalem, araba, defter, kalemtıraş, pasta ve çiçek gibi uygun nesneler kullanılır.
- Renk ve soru odağı için sabit çerçeve/işaretçi kullanılır; sürekli yanıp sönme uygulanmaz.

## Kontrol kaydı

`check-color-teaching.mjs`: 6.780 oluşturulmuş deneme, varlıkların varlığı, hedef/çeldirici renklerinin tekilliği, iki denemede bir konum değişimi, karma renk dengesi, iki öğretim yöntemi, yönerge sonrası zamanlama, hata düzeltmesi, söylemede iki fırsat ve son bölüm düğmesi kontrol edildi.

Gerçek tarayıcıda nesne resimleri ve renk bölgeleri görüntülendi. 320 piksel genişlikte dört seçenek aynı satırda, taşma olmadan yüklendi. Mevcut örüntü, nesne söyleme, mikrofon oturumu, ebeveyn kapısı ve ana proje kontrolleri geçti.

Yerel dinleme servisi çalışır durumda. Microsoft Tolga ile hazırlanmış sentetik seslerin kırmızı, mavi, yeşil sonuçları doğru; kısa “sarı” örneği “sırı” olarak çözümlendi ve kabul edilmedi. Bu test gerçek çocuk sesi doğrulaması değildir. Canlı kullanıcı mikrofon denemesiyle söyleyiş başarısı ayrıca kontrol edilmelidir.

Yerel kaynak kaydedildi. Bu çalışma kapsamında GitHub veya genel site yayını yapılmadı. Önceki sürüm kaydı: `outputs/backups/0.20.3-before-colors`.


## Renk bazında ilerleme düzeltmesi

Kullanıcının son isteği doğrultusunda eşle, göster ve söyle çalışmalarının her birinde seçilen rengin bütün sabit renk basamakları tamamlanır. Kırmızı tamamlandıktan sonra mavi, ardından sarı ve yeşil çalışılır. Nesneye göre ayrılan beş denemelik bölümler de aynı renk içinde tamamlanır. Karma renk basamakları bütün tek renk çalışmalarından sonra gelir; son karma bölümde ilerleme düğmesi gizlenir. İki öğretim yöntemiyle üç boyutun tüm ileri düğmesi rotaları kontrol edildi.


### Güncel renk tamamlama davranışı

Son kullanıcı isteği önceki otomatik renk geçişini değiştirir: her öğretim boyutunda seçilen rengin son sabit basamağı sonunda tebrik mesajı ve Yeni renk seç / Oyuna geç / Ana menüye dön seçenekleri gösterilir. Sonraki renge veya karma çalışmaya otomatik geçilmez. Yeni renk seç başlangıç seçim ekranına döner; kullanıcı rengi ve basamağı kendisi seçer. Karma basamaklar seçim ekranından erişilebilir. Üç boyut, dört renk ve iki öğretim yöntemiyle tamamlanma, otomatik geçişin olmaması ve açık seçimden sonra yeni renge başlama kontrol edildi.
