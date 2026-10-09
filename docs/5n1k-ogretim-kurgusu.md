# 5N1K olay öğretimi — 0.23.0

Bilişsel beceriler altında **5N1K**. Çocuk ekranında tek kısa açıklama: “Olayları izle, soruları yanıtla.”

## Kavram ve içerik analizi

Altı soru türü: ne (nesne/olay), nerede (mekân), kim (kişi), nasıl (yapılış biçimi), ne zaman (zaman), neden (amaç). MEB'in [5N1K soru materyali](https://samsun.meb.gov.tr/meb_iys_dosyalar/2020_11/25153027_3.sYnYflar-sYkYYtYrYldY.pdf) ve [5N1K yanıt çalışması](https://samsun.meb.gov.tr/meb_iys_dosyalar/2021_06/07142024_3.sYnYflar_8.sayY_compressed.pdf) soru türlerinin kapsamı için incelendi. Bu kaynaklar buradaki yaşa özel seviye dizisini doğrulamaz; on seviyeli sıra projenin öğretim tasarımıdır. Öğrencinin dil/anlama düzeyine göre uygulamacı seviyeyi seçer.

Başlangıçta somut, tek kişinin yaptığı iki adım; ilerleyen seviyelerde üç/dört/beş adım, son seviyelerde altı adım ve yanlışlıkla düşen nesneyi kaldırıp işi tamamlama gibi kısa problem çözme zincirleri. Her olayda altı soru korunur; neden ve zaman yanıtları anlatımda açıkça verilir. Zaman yalnızca ortamın renginden çıkarılmaz: sabah/öğleden sonra/akşam işareti ve sesli anlatım vardır. Nasıl yanıtları dikkatlice/yavaşça/sakince/nazikçe; görünmeyen niyet veya duygu tahmin edilmesi beklenmez. İleri olayların güçlüğü adım sayısı ve hatırlanacak olay zincirinin uzamasıdır.

| Seviye | Adım | Olay | Soru |
|---|---:|---:|---:|
| 1–2 | 2 | Her seviyede 5 | Her olayda 6 |
| 3–4 | 3 | Her seviyede 5 | Her olayda 6 |
| 5–6 | 4 | Her seviyede 5 | Her olayda 6 |
| 7–8 | 5 | Her seviyede 5 | Her olayda 6 |
| 9–10 | 6 | Her seviyede 5 | Her olayda 6 |

Toplam 50 yerel MP4 video, 300 soru. Tam senaryolar, anlatımlar ve açık yanıt anahtarları `dist/assets/5n1k/stories.json` içinde. Çocuklara tehlikeli davranış, çıplaklık veya olumsuz sözlü model verilmez. Videolar kitap okuma, su içme, çizim, paylaşma, sulama, toplama ve temizlik gibi gündelik olaylardır. Bölüm sonu oyunları hazırlanmadı; mevcut yer tutucu akış korunur.

## Görsel üretim

Videolar hazır stok veya yapay zekâ video servisinden alınmadı. Sürekli çizilen 2B çocuk karakterleri ve nesnelerle yerelde üretildi: 960×540, H.264, 30 fps, 7/10/13/16/19 saniye. Statik kartların geçişinden oluşan slayt değildir. Arka plan atlası built-in **imagegen** ile üretildi; istemin tamamı `source-assets/5n1k/prompts.json`, orijinal `background-atlas.png`. Ortamlar WebP olarak projeye kopyalandı. Çocuklar, kollar, nesneler, yürüyüş ve nesne hareketleri `dist/wh-scene-renderer.js` ile çizilir; kamera sabittir. Dış video hizmeti, ücretli hesap veya çevrim içi medya bağlantısı gerekmez.

Yeniden üretim: `scripts/build-wh-data.mjs`, `scripts/prepare-wh-backgrounds.py`, `scripts/export-wh-videos.mjs`. Dışarıdan araç yolları verilerek çalışır; kaynak dosyalarda kullanıcıya özel araç yolu veya kimlik bilgisi tutulmaz. `video-manifest.json` süre/kare sayısını kaydeder.

## Öğretim ve sesli yanıt

Video biter, anlatıcı olayı seslendirir, sorular tek tek gelir. Dinleme ve süre sayacı video/anlatım/soru sırasında çalışmaz. Eşzamanlıda sorudan hemen sonra açıklamalı yanıt modeli, sonra çocuğun yanıtı. Sabit beklemede soru sesinin bitişinden ve mikrofonun açılmasından sonra dört saniye bağımsız yanıt fırsatı. Konuşma başladığında dört saniye sayacı durur; çözümleme gecikmesi yanlış sayılmaz. Yanlış veya ilk yanıtsızlıkta açıklamalı doğru model, ikinci fırsat; iki başarısız yanıttan sonra modelle ilerleme. Pekiştirme hem bağımsız hem ipucuyla doğru yanıt için; kayıt bu ikisini ayırır. Mikrofon/bağlantı hatası öğrencinin hatası olarak kaydedilmez. Uygun olmayan sözcük seslendirilmez ve metin/ses kayıtlarına alınmaz.

Türkçe ekli nesne adları ve açık anlamsal eşdeğerler kabul edilir. Gelişigüzel yazım benzerliği veya cevabın cümle içinde geçmesi doğru sayılmaz. Açık uçlu yanıtların tüm eşdeğerlerini otomatik anlayan genel bir dil değerlendirme modeli değildir; yanıt anahtarları denemelerle genişletilebilir.

Sesli yanıt mevcut yerel Whisper hizmetini kullanır. `wh` sözlüğü bütün olayların kişi/nesne/yer/biçim sözcüklerini kapsar; yalnızca o sorunun beklenen yanıtı modele verilmez. Ses RAM'de işlenir, dosyaya kaydedilmez. Statik barındırma bu Python hizmetini kendiliğinden çalıştırmaz; dinleme için yerel hizmet veya ayrıca kurulmuş konuşma sunucusu gerekir. “Seç” yanıt biçimi mikrofon ve sunucu olmadan çalışır. Soru türüne göre seçenekler iki/üç/dörde ilerler; ne-zaman türünde üç gerçek zaman örneği olduğundan en fazla üç seçenek bulunur.

## Değerlendirme ve kayıt

Kaba değerlendirmede genel kazanım ve altı soru türü ayrı satırdır. Otomatik öğretim sonuçları kaba değerlendirmeyi kendiliğinden değiştirmez.

Her soru bir defa kaydedilir: seviye/olay/soru türü, yöntem, sesli/seçerek yanıt biçimi, bağımsız doğru/ipucuyla doğru/yanlış/yanıtsız, ilk tepki, iki yanıtın durumları ve zaman. Çocuğun söyledikleri ve sesi saklanmaz. Kayıtlar aynı tarayıcıda öğrenci profilinden türetilen yerel kimlikle ayrılır. Sonuç tablosu her soru türünün sonucunu ve olay ayrıntılarını gösterir; CSV indirilebilir. Sonuçlar uygulamacı görünümündedir; çocuk girişinde gizlidir. Otomatik çok cihazlı veri eşitleme yoktur; tarayıcı verileri silinirse bu kayıtlar da silinir.

Beş olay/30 soru sonunda oyuna geç, bir sonraki seviyeye geç ve ana menü; 10. seviyede ileri düğmesi yoktur.
