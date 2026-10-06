# Dijital Özel Eğitim — Kalıcı Proje Kararları

Son güncelleme: 5 Ekim 2026 — Sürüm 0.9.2 üzerinde yerel düzenlemeler

Bu dosya her yeni düzenlemede güncellenir. Yeni sürümler mevcut kararların üzerine yazılır; eski akış yanlışlıkla yeniden kurulmaz.

## Geçerli uygulama akışı

1. Logo ve uygulama adı
2. Çocuk profili: ad, yaş, isteğe bağlı tanı
3. Dört hayvan oyun arkadaşı arasından seçim
4. Oyun arkadaşının sesli tanışması
5. Beceri bazlı kaba değerlendirme
6. Öğretim yöntemini çocuğun veya uygulamacının seçmesi
7. Beceri kategorilerinin bulunduğu ana platform
8. Kaba değerlendirmede çalışılması gereken beceriler
9. Beş denemelik öğretim etkinliği
10. Çalışma özeti: Oyuna geç, sonraki seviye (örüntüde son seviye hariç), ana menüye dön
11. Oyuna geç seçilirse henüz planlanmamış oyun için hazırlık ekranı; otomatik baloncuk oyunu açılmaz

## 5 Ekim 2026 güncel örüntü ve öğretim kararları

Olayları sıralama kazanımı Bilişsel Beceriler'e ve kaba değerlendirmeye eklendi. 25 öğretici günlük olay, her olay için beş ayrı görsel adım ve 10 seviyede toplam 50 deneme bulunur. Seviye 1–2 iki kart, 3–5 üç kart, 6–8 dört kart, 9–10 beş kart kullanır. Üstteki kartlar başlangıçta karışıktır; altta kart sayısı kadar numaralı yer vardır. Dokunmayla sıradaki yere veya sürüklemeyle seçilen doğru yere yerleştirilir. Her yeni kart seçiminde seçili öğretim yöntemi uygulanır. Her doğru kart pekiştirilir; deneme bağımsız doğru sayılması için bütün yerleşimler yardımsız doğru tamamlanmalıdır. Son seviyede sonraki seviye düğmesi gizlenir. Ses tanıma sonraki kapsam fikridir, bu etkinlikte mikrofon kullanılmaz.

Bu bölüm aşağıdaki eski sürüm açıklamalarındaki farklı akışların yerine geçer. Seçilen yöntem tüm öğretim etkinliklerinde korunur. Dört saniyelik yanıt süresi yönerge sesi tamamlandıktan sonra başlar. Bağımsız doğru hemen pekiştirilir; pekiştirme konuşması bitmeden sonraki denemeye geçilmez. Yanıtsızlıkta mantığı anlatan doğru cevap ipucu, ilk yanlışta hemen açıklamalı hata düzeltmesi gösterilir. Eşzamanlı yöntemde yönerge biter bitmez açıklamalı doğru cevap gösterilir.

Örüntü 15 seviye ve her seviyede beş denemeden oluşur. Seçenekler yalnızca o denemede gösterilen nesnelerden seçilir. 14. seviyenin sayılan yıldızları dik ve üst üste gösterilir. 15. seviyede üç farklı şekilli, dört/beş öğelik karmaşık tekrar blokları kullanılır. Sonraki seviye düğmesi sırayla ilerletir ve 15. seviyede gizlenir.

Somut nesneler gerçeğe yakın, iki boyutlu ve çocukların kolay tanıyacağı resimlerle gösterilir. Her nesnenin ortak resmi sayı ve boyut varyantlarında da kullanılır. İleri seviyelerde soyut şekiller uygundur. Yerel, şeffaf arka planlı WebP resimleri `dist/assets/objects/` içinde saklanır.

Kısa oyun içi gözlem / “Hazır mısın?” ekranı kaldırılmıştır. Profilde çalışma süresi seçeneği yoktur. İlk giriş ekranında gizlilik rozetleri veya tanı istenmediği ifadesi gösterilmez.

## Oyun arkadaşları

- Pofidik Ayı — erkek ses profili
- Dila Panda — kız ses profili
- Kıpır Kunduz — erkek ses profili
- Mina Tilki — kız ses profili

Seçilen arkadaş kendisini tanıtır, “Hazırım” yanıtından sonra “Süpersin! Haydi o zaman başlayalım.” der ve sonraki ekranlarda sağ altta küçük biçimde görünür.

Karakter kartlarında “kız sesi / erkek sesi” yazıları gösterilmez. Dila ve Mina pembe-mor aksesuarlarla; Pofidik ve Kıpır mavi-yeşil sportif ayrıntılarla görsel olarak ayrılır.

## Kaba değerlendirme ve platform

İlk kapsam yalnızca eşleme ve renklerdir. Kaba değerlendirmede her beceri “Yapıyor”, “Henüz yapamıyor” veya “Gözlenmedi” olarak işaretlenir. Ana menüde ve kategori sayfasında yalnızca “Yapıyor” işaretlenen beceriler kapanır; “Henüz yapamıyor”, “Gözlenmedi” ve hiç işaretlenmemiş becerilerin tümü çalışılacak beceri olarak listelenir. Değerlendirme hiç yapılmasa bile etkinlikler açık kalır. Liste satırında durum etiketi gösterilir: “Henüz yapamıyor”, “Gözlenmedi” veya “İşaretlenmedi”.

Ana platform kategorileri:

- Bilişsel Beceriler
- Dil ve İletişim
- Sosyal Beceriler
- Günlük Yaşam

İlk sürümde yalnızca bilişsel beceriler içindeki eşleme ve renk etkinlikleri çalışır. Diğer kategoriler sonraki kapsam olarak görünür; içerikleri henüz açılmaz.

Kategori kartları ana menüde yalnızca giriş kapısıdır. Bir kategoriye dokununca ayrı bir kategori sayfası açılır ve ilgili çalışılacak beceriler orada listelenir. Kategori sayfasındaki “Ana menüye dön” düğmesi kategori kartlarının bulunduğu ekrana götürür. Ana menüde “Kaba değerlendirmeyi düzenle” ve “Yöntem seçimini düzenle” düğmeleri bulunur.

## Yöntem tercihi

- Yöntem ekranında “Çocuk seçsin / Uygulamacı seçsin” biçiminde ayrı sekmeler kullanılmaz.
- Tek yöntem ekranının üstünde “Bu seçimi çocuk veya uygulamacı yapabilir.” notu gösterilir.
- “Hemen yardım et” seçimi eşzamanlı öğretim prototipine bağlanır.
- “Önce ben deneyeyim” açıklaması: “Yanıt aralığından sonra yardım alabilirim.”
- Bu seçim 4 saniye sabit bekleme süreli öğretim prototipine bağlanır.
- Yöntem adları bilimsel kaynak ve uzman incelemesi tamamlanana kadar prototip olarak gösterilir.

## İlk çalışan etkinlik

“İki renk arasından doğru olanı eşle” etkinliği beş denemeden oluşur. Kırmızı hedef ile kırmızı ve mavi seçenekler kullanılır. Bağımsız doğru, yardımla doğru ve yanlış deneme ayrı kaydedilir. Beş denemeden sonra hedef cevabı ele vermeyen baloncuk oyunu açılır; sonuç ekranından ana menüye dönülür.

## İkinci çalışan etkinlik (0.5.0)

“Aynı tip ve aynı renk kartları eşle” (kırmızı) etkinliği RENK KAVRAMI kazanım dosyasındaki EŞLEME boyutunun ilk basamağına göre oynanabilir hale getirildi:

- Masada 6 kırmızı kart vardır: aynı tipten 2 kart (doğru çift) ve 4 farklı tip çeldirici. Çocuk aynı iki kırmızı kartı seçerek eşler.
- Beş deneme yapılır; her denemede doğru tip değişir ve kart konumları karışır.
- Doğru eşlemede “Aferin! Doğru eşledin!” sesli pekiştirmesi verilir.
- Yanlış seçimde önce “Birlikte bir daha bakalım.” denemesi ile tekrar şansı tanınır. İkinci yanlışta “Hayır, bu kırmızı değil. Aynı olan kırmızı kartlar birlikte.” uyarısı söylenir ve doğru çift vurgulanır.
- Yöntem prototipleri geçerlidir: eşzamanlı öğretimde ipucu baştan, 4 saniye sabit beklemede yanıt aralığı sonrasında verilir. İpucuyla tamamlanan denemeler bağımsız doğru sayılmaz.
- Beş denemeden sonra baloncuk oyunu ve özet ekranı iki renk etkinliğiyle aynı şekilde kullanılır.

## Ses ve oyun arkadaşı (0.6.0)

- Tüm konuşmalar tarayıcının Türkçe sesleriyle yapılır. Ses seçiminde öncelik her zaman tr-TR seslerindedir; cihazda Türkçe ses yoksa uygun cihaz sesine düşülür ve İngilizce aksanlı okuma engellenir.
- Kız karakterler (Dila, Mina) için Türkçe kadın sesi, erkek karakterler (Pofidik, Kıpır) için Türkçe erkek sesi aranır. Kadın/erkek ses ayrımı bulunamazsa mevcut Türkçe ses kullanılır.
- Ses tonu ve hız değerleri doğallaştırıldı; robotik ve aşırı incelmiş/ kalın ses etkisi giderildi.
- Sağ alttaki oyun arkadaşı her dokunuşta sırayla 10 farklı cümle söyler ve sonra başa döner. Cümleler çocukla etkileşim amaçlıdır (“Evet, buradayım!”, “Oynamak ister misin?”, “Devam edelim mi?” gibi).

## Üyelik altyapısı iskeleti (0.6.0)

- Giriş ekranının sol üstünde küçük bir “Satın al” kutusu bulunur; tıklanınca aylık 300 ₺ premium plan ekranı açılır.
- Plan ekranında “Ücretsiz” (0 ₺) ve “Premium” (Aylık 300 ₺) seçenekleri gösterilir. Plan durumu (ücretsiz / premium) cihazda saklanır.
- Gerçek ödeme altyapısı (kredi kartı, banka, sanal POS) henüz bağlı DEĞİLDİR. Ekranda kart veya banka bilgisi istenmez. Plan ekranındaki (demo) düğmeler yalnızca plan görünümünü denemek içindir; gerçek tahsilat yapmaz.
- Ödeme sağlayıcısı seçimi ve hukuki metinler (KVKK, mesafeli satış sözleşmesi) tamamlanmadan gerçek tahsilat eklenmez.
- Ayarlar ekranındaki “Kullanıcı profili” satırı mevcut planı gösterir (Ücretsiz / Premium) ve plan ekranına geçiş sağlar. Kullanıcı planını buradan kontrol edebilir.

## Arayüz düzeltmeleri (0.6.1)

- Kaba değerlendirme ekranı iki modludur: İlk giriş akışında buton “Yöntem seçimine geç” yazar ve yöntem ekranına götürür. Ana menüdeki “Kaba değerlendirmeyi düzenle” ile gelindiğinde buton “Tamamla” yazar ve değerlendirme kaydedilip ana menüye dönülür; yöntem ekranına gidilmez.
- Ayarlar ekranı sadeleştirildi: “Giriş ve ana menü müziğini buradan yönetebilirsiniz.” açıklaması, “Arka plan müziği” altındaki küçük not ve “Diğer ayarlar / Yeni ayarlar ilerleyen sürümlerde bu alana eklenecek.” uyarısı kaldırıldı. Yalnızca müzik açma/kapama, ses seviyesi, Kullanıcı profili satırı ve “Önceki ekrana dön” düğmesi kalır. “Önceki ekrana dön” düğmesi korunur.
- Ana menü (platform) başlığı artık çocuk adına bağlı değildir; sabit “Çalışmalar” yazar. “Öğrenme alanı” etiketi korunur.
- Gizli öğeler CSS’te `[hidden]{display:none!important}` kuralıyla kesin gizlenir. Böylece “Aynı tip aynı renk kartları eşle” etkinliğinde eski iki renk şekilleri, “İki renk arasından doğru olanı eşle” etkinliğinde eski eşleme kartları görünmez.
- Ses seçimi puanlama tabanlıdır: tr-TR sesi +100, cinsiyet adı eşleşmesi +10, natural/online ses +5 puandır. Ton ve hız nötr (1.0) tutulur; robotikleştiren perde/hız oynamaları yapılmaz. Kız karakterler (Dila, Mina) kadın sesi, erkek karakterler (Pofidik, Kıpır) erkek sesi arar.

## Pekiştireç, değerlendirme esnekliği ve satın al (0.7.0)

- Doğru yanıtta söylenen sözel pekiştireç 10 kişilik havuzdan rastgele seçilir: “Aferin!”, “Çok güzel!”, “Bravo!”, “Süpersin!”, “Harikasın!”, “Mükemmel!”, “Muhteşem!”, “Ne güzel yaptın!”, “Böyle devam et!”, “İşte bu, başardın!”. Seçilen pekiştireç hem yazılır hem oyun arkadaşının sesiyle söylenir. İki etkinlikte de (iki renk ve aynı tip aynı renk) aynı havuz kullanılır.
- Kaba değerlendirme hiçbir beceri işaretlenmeden geçilebilir; “Yöntem seçimine geç” düğmesi her zaman etkindir. Ekranda sabit uyarı yazısı bulunur: “Öğrencinin yapamadığı becerilerle ilgili etkinlikler açılır; yapabildikleri sistemde açılmaz.”
- Plan ekranındaki mavi düğme artık “Satın al” yazar. Gerçek ödeme henüz bağlı değildir; düğme şimdilik plan görünümünü denemek içindir. İlerleyen sürümde bu düğme sanal POS (dijital POS) üzerinden satın alma adresine yönlendirecektir.
- Program simgesi küçültüldü: üst menü logosu 34 px, giriş ekranı logosu en çok 500 px genişlik ve 56 vh yükseklik. Böylece logonun yazıların üstüne binmesi önlenir.

## Oyun listesinin geri gelmesi ve logo küçültme (0.7.1)

- Bilişsel becerilerdeki oyunlar geri geldi. 0.7.0’daki “değerlendirmeyi işaretsiz geçebilme” özelliği yüzünden hiçbir beceri işaretlenmediğinde liste boş kalıyordu. Artık yalnızca “Yapıyor” işaretlenen beceri kapanır; işaretsiz beceriler de açık sayılır ve “5 denemeyi başlat” düğmesiyle oynanabilir. Ana menüdeki sayaç da aynı açık beceri sayısını gösterir.
- Giriş ekranındaki program simgesi yeniden küçültüldü: en çok 380 px genişlik ve 44 vh yükseklik; görsel alanı 50 vh (dar ekranlarda 34 vh) ve `overflow:hidden` ile sınırlandı. Simgenin yazıların, başlığın veya “Satın al” kutusunun üstüne binmesi fiziksel olarak engellendi. “Satın al” kutusu ve ayar düğmeleri simgeden üst katmanda (z-index 5) durur.

## Müzik ve ayarlar

- Uygulamaya özel üretilmiş, yaklaşık 60 saniyelik neşeli enstrümantal menü müziği döngüde çalar.
- Tarayıcı otomatik sesli oynatmayı engellerse müzik kullanıcının ilk dokunuşuyla başlar.
- Etkinlik başladığında müzik durur; ana menüye dönüldüğünde ayar açıksa yeniden başlar.
- Giriş ekranında ve üst menüde hızlı sessize alma düğmesi bulunur.
- Giriş ekranından ve uygulamanın sağ üstünden Ayarlar ekranına erişilir.
- Ayarlar ekranında müziği açma/kapatma ve ses seviyesini değiştirme bulunur. Tercihler aynı cihazın tarayıcısında saklanır.
- Ayarlar ekranına “Kullanıcı profili” satırı eklenmiştir: plan durumunu gösterir (Ücretsiz / Premium) ve plan ekranına götürür.
- Ayarlar ekranının diğer seçenekleri sonraki sürümlerde genişletilecektir.

## Sürüm koruma kuralı

Kullanıcının son verdiği 0.7.1 yedeği güncel tabandır; 0.4.0 tarihsel ilk sürümdür. Uygulama yeniden oluşturulmaz; mevcut proje açılır ve yalnızca istenen değişiklikler bunun üzerine eklenir. Her değişiklikten sonra bu karar dosyası, sürüm kaydı ve proje birlikte güncellenir.

## Veri ve güvenlik notu

Çocuk verilerinin kendi sunucumuza gönderilmemesi hedeflenir. Tanı alanı uygulamada isteğe bağlıdır. Bu web prototipinde tanı metni yalnızca açık sekme oturumunda tutulur; kalıcı cihaz kaydına yazılmaz. Ürün sürümünde yerel şifreli saklama, KVKK metinleri ve uzman/hukuk incelemesi tamamlanmadan hassas veri akışı kesinleştirilmez.

## 0.8.0 — Pofidik ve başka bilgisayarda çalışma (1 Ekim 2026)

- Mimo seçimden ve çalışma dosyalarından çıkarıldı. Önceki dosyalar ve tüm 0.7.1 proje, bu bilgisayarda ayrı yedeklerde korunuyor.
- Pofidik 3B olarak seçim, tanışma ve sağ-alt oyun arkadaşı alanına eklendi. Sağ alttaki karakter çerçevesiz/arka plansız; dokununca sıradaki tepkiyi oynatır.
- Kullanıcının son kararıyla sağ/sol el-kol selamı (`wave_left`, `wave_right`) modelden ve oynatıcıdan tamamen çıkarıldı. Kalan 14 mevcut V6 klibi korundu; yüz, kulak ve gerinme yeniden modellenmedi.
- Konuşma animasyonu seçili Pofidik'in ses başlama/bitiş olaylarıyla çalışır; gerçek fonem/viseme dudak eşlemesi değildir. Nefes alma, baş/bakış/dinleme/kulak/göz tepkileri ve dokunma tepkileri bağlıdır.
- Onaylı animasyonsuz temel model değişmeden `source-assets/pofidik-approved.glb` içine kondu. Bu sürümde kredi harcanmadı.
- `Baslat.cmd` ve Node yerel sunucusu eklendi. Hazır dosyalarla internetten bağımsız çalışma mümkündür; ses motoru cihazdaki Türkçe sese bağlıdır. Model yüksek ayrıntılıdır (yaklaşık 105 MB); mobil optimizasyon yapılmamıştır.
- GitHub hedefi `sinanizgi32-ux/depo`. Kullanıcı deposunun herkese açık olduğunu öğrendikten sonra yalnızca kaynak/karakter dosyalarının açık depoya yüklenmesini onayladı. Öğrenci/profil verileri tarayıcıda kalır; depo dosya eşitlemesi sağlar, öğrenci verisi eşitlemesi sağlamaz.
- GitHub'a yükleme bir web yayını değildir. Başka bilgisayarda proje indirilip yerel klasör olarak bağlanmalı; `AGENTS.md` yeni çalışmalara kısa bağlam verir.

## 0.9.0 — Örüntü çalışması (2 Ekim 2026)

- Bilişsel Beceriler kategorisine üçüncü oynanabilir çalışma olarak “Örüntü: boş kutuya hangisi gelir?” eklendi.
- Çalışma 15 seviyeden oluşur ve en basitten giderek zorlaşır: seviye 1 `A-B-A-B → ?`, ilerleyen seviyelerde `A-B-A-B-A-B`, `A-A-B-B`, `A-B-B`, `A-B-C`, `A-B-B-A-B-B`, `A-A-B-B-C-C`, uzun `A-B-C`, yalnızca renk örüntüsü, `A-B-A-C`, büyük-küçük boyut örüntüsü, `A-B-C-B`, döner yön (ok) örüntüsü, miktar örüntüsü (1-2-3 şeker) ve son seviyede iki özellikli (renk+şekil: kırmızı yuvarlak / mavi kare) örüntü bulunur.
- Her seviyede nesne dizisinin sonunda soru işaretli kesik çerçeveli boş kutu gösterilir. Kutunun üstünde ve altında birer seçenek kartı bulunur; seçeneklerin üst/alt konumu her denemede rastgele karışır.
- Ekranın başında yönlendirici sunum yapılır: “Sıraya bakalım. Boş kutuya hangisi gelmeli? Doğru olanı seç.” denilir.
- Yöntem prototipleri geçerlidir: eşzamanlı öğretimde (“Hemen yardım et”) ipucu deneme başında, 4 saniye sabit beklemede (“Önce ben deneyeyim”) yanıt aralığı sonrasında verilir. İpucunda doğru seçenek sarı çerçeve ve nabız animasyonuyla belirgin biçimde yanar; oyun arkadaşı “Boş kutuya … gelmeli. Yanan seçenek doğru cevap.” der. Yanlış seçimden sonra da ipucu verilir. İpucuyla tamamlanan denemeler bağımsız doğru sayılmaz.
- Mola ekranından dönünce 4 saniye sabit bekleme yöntemindeki sayaç kaldığı yerden yeniden kurulur; “💡 Yardım göster” düğmesi örüntüde de aynı ipucunu verir.
- Kaba değerlendirme listesine “Örüntüyü sürdürür” maddesi eklendi: “Yapıyor / Henüz yapamıyor / Gözlenmedi” seçenekleriyle bilgi alma amaçlı işaretlenir. “Yapıyor” işaretlenirse örüntü çalışması listede kapanır; diğer işaretlerde açık kalır.
- Çalışma özeti örüntüye uyarlandı: başlıkta deneme sayısı (15) gösterilir, “Evde genelleme” önerisi örüntü kurma etkinliği verir. Bölüm sonu baloncuk oyunu ve pekiştireç havuzu diğer çalışmalardaki gibidir.
- Dosya değişiklikleri: `dist/index.html` (değerlendirme satırı, örüntü alanı, genelleme metni), `dist/app.js` (patternTrials verisi ve örüntü akışı), `dist/styles.css` (örüntü kartları ve ipucu stili).

## 0.9.1 — Örüntü seviye listesi ve 4 saniye sistematiği (2 Ekim 2026)

- Örüntü çalışması artık tek seferde 15 deneme olarak akmaz. “Çalışılacak beceriler” listesinde örüntü satırındaki düğme “Seviyeleri aç”tır ve ayrı bir seviye ekranı açılır (Seviye 1 → Seviye 15). Her seviyede 5 farklı deneme vardır; nesneler denemeden denemeye değişir, zorluk seviye numarasına göre artar. Etkinlik araç çubuğunda “Örüntü · Seviye N” etiketi görünür; özet ekranında “Seviye N · 5 deneme tamamlandı” yazılır.
- Seviye verisi `patternLevels` yapısında tutulur: her seviyede `title`, `tag` ve 5 `examples` (`shown`, `answer`, `decoy`) bulunur. 15 seviye toplam 75 farklı deneme içerir. Yeni emoji/nesne öğeleri ve sarı, yeşil, mor şekil renk sınıfları eklendi.
- 4 saniye sabit bekleme prototipi örüntüde sistematik öğretime bağlandı: yönlendirici sunumdan sonra 4 saniye beklenir. Bu süre içinde doğru seçim bağımsız doğru sayılır ve etkili pekiştirme alınır (ipucu verilmez). Süre içinde yanlış seçimde “Hayır, o değil. Boş kutuya … gelmeli.” düzeltmesi söylenir, doğru seçenek belirgin biçimde yanar ve deneme ilerlemez; çocuğun doğruyu seçmesi beklenir, bu durumda deneme yardımla doğru sayılır. Süre içinde hiç yanıt verilmezse doğru seçenek aynı biçimde gösterilir.
- Eşzamanlı öğretim prototipi örüntüde aynı kalır: ipucu deneme başında verilir, yanlış seçimde “Birlikte bir daha bakalım.” denir ve ipucu korunur. İki renk ve aynı tip aynı renk eşleme etkinliklerinin ipucu davranışı bu sürümde değişmedi.
- “💡 Yardım göster” düğmesi ve moladan dönüşteki sayaç kurulumu örüntü için yeni `revealPatternHint` çekirdeği üzerinden çalışır; davranış değişmez.
- Dosya değişiklikleri: `dist/index.html` (seviye ekranı bölümü), `dist/app.js` (patternLevels verisi, seviye akışı, 4 saniye sistematiği), `dist/styles.css` (seviye kartı ızgarası, yeni şekil renk sınıfları).

## 0.9.2 — Yerel Qoder çalışmasını taşıma (2 Ekim 2026)

- Downloads/depo-main içindeki 0.9.1 çalışması GitHub 0.8.1 tabanına aktarıldı. 15 seviye ve 75 deneme korundu.
- Seviye 7 son denemede kullanılan fakat tanımlanmayan yesilKare eklendi; ilgili denemenin açılmasını engelleyen hata giderildi.
- Sürüm bilgileri eşitlendi. scripts/check-pattern.mjs ile tüm denemelerin öğeleri, bağımsız doğru, yanlış sonrası düzeltme, 4 saniye ipucu, eşzamanlı ipucu ve son deneme geçişi kontrol edilir. npm test iki kontrolü de çalıştırır.
- Öğrenci verileri ve tarayıcı profilleri taşınmadı; yalnızca proje dosyaları aktarıldı.

## Nesne eşleme kazanımı

Kullanıcının onayladığı 10 kategori ve 100 nesne için bilişsel becerilere ayrı bir Nesne eşleme bölümü eklendi. Materyal havuzu `dist/matching-data.js` içindedir. Nesne adı ve eşle yönergesiyle çalışılır; her nesnenin dört seviyesinde beşer deneme vardır. İlk seviyede birebir aynı resim, ikinci seviyede aynı nesnenin farklı görünümüyle tek eş, üçüncüde iki hedef, dördüncüde üç hedef kullanılır. Nesnenin farklı görünümü farklı nesne türü olarak etiketlenmez. Kategori örnekleri başka nesnelerin yerine geçmez.

Kaynak kart altta, hedefler üsttedir. Fare/parmakla sürükleme ve karta ardından hedefine dokunma desteklenir. Dört saniye süreli öğretimde yönerge sesi tamamlandıktan sonra yanıt fırsatı başlar; eşzamanlı yöntemde aynı noktada açıklamalı ipucu açılır. İpucu otomatik olarak eşleme yapmaz; doğru hedef ve kaynak vurgulanır, çocuğun yerleştirmesi beklenir. Yanlış yerleştirme tek hata sayılır ve açıklanır. Ödül konuşması bitmeden deneme değişmez. Duraklatma ve ekran değiştirme eski ses/timer yanıtlarını geçersiz kılar.

Kaba değerlendirmede `object-match` anahtarı korunarak başlık Nesneleri eşler olarak güncellendi. Seviye sonu üç seçenek korunur; 4. seviyede sonraki seviye gizlenir. 2.000 denemenin tamamı ve öğretim/etkileşim akışları `scripts/check-object-matching.mjs` ile kontrol edilir. Görseller beyaz arka planda gerçeğe yakın iki boyutlu nesne resimleridir; üretim yönergeleri görsel klasöründe saklanır.

## 0.11.1 akıcılık entegrasyonu

Yerel denemelerde onaylanan Pofidik yükleme ve eşleme sürükleme düzeltmeleri ana projeye alındı. Otomatik model ön yüklemesi kaldırıldı; gizli karakterler çizilmez. Sıkıştırılmış modelin orijinalle birebir eşitliği proje kontrolüne eklendi. Öğretim yöntemleri, etkinlikler ve modelin 14 hareketi korunur.

## Nesne gösterme

Bilişsel becerilere ayrı Nesne gösterme kazanımı eklendi. Eşlemedeki onaylı 10 kategori ve 100 nesne korunur. İlk seviyede iki seçenekle aynı görsel; diğerlerinde aynı nesnenin farklı görünümleriyle 2, 3, 4, 5 seçenek kullanılır. Her seviyede beş deneme. Çeldiriciler kategori içinden karışık seçilir. Resme dokunulur; kaynak eşleme kartı gösterilmez. Seçilen öğretim yöntemi korunur ve her yönerge sesinin bitiminde öğretim başlar. Beşinci seviyede sonraki seviye düğmesi gizlenir. Oyun düğmesi mevcut hazırlanmadı ekranına gider.

## Hayvan örneklerini genelleme

Renk farkının ötesinde 10 hayvan için altışar yeni iki boyutlu gerçekçi görünüm oluşturuldu. Kedi örnekleri yavru, iri uzun tüylü yetişkin, tombul kısa tüylü, ince yapılı Siyam, hafif çamurlu ve bakımlı İran kedisidir. Diğer hayvanlarda da yaş, boyut, vücut yapısı ve doğal görünüm çeşitliliği vardır. İlk seviye aynı resimle korunur. Yeni örnekler sonraki seviyelere ve eşleme kazanımına bağlandı; hayvan adı/yönergesi ve öğretim yöntemleri korunur.
