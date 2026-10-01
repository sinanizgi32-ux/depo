# Dijital Özel Eğitim — Kalıcı Proje Kararları

Son güncelleme: 29 Eylül 2026 — Sürüm 0.7.1

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
10. Bölüm sonu oyunu
11. Çalışma özeti ve ana menüye dönüş

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
