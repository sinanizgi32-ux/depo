# Karakter sesleri ve hazır kayıt bankası

Dört karakterin sesi kullanıcının verdiği Pofidik, Kıpır Kunduz, Dila ve Mina referanslarından yerel Chatterbox Multilingual V3 ile üretilir. Referans WAV dosyaları değiştirilmez veya dışarı gönderilmez. Eski tarayıcı seslerine otomatik dönüş yoktur. Örnekleme ve kalite ayarları korunur; pekiştirme ifadelerinde anlatım coşkusu .55, yönerge/anlatımda .35 olarak kullanılır.

Sunucu/anlatıcı için kullanıcının sunucu_tam_monolog.wav kaydı narrator-reference.wav olarak kayıpsız kopyalanmıştır (29,92 saniye, 24 kHz, mono). Bu beşinci ses oyun arkadaşı seçimi değildir. Hazine oyununun hikâyesi, soruları, ipuçları ve sonuç konuşmaları sunucu sesini kullanır. Beş denemeli öğretim etkinliklerinin tüm konuşmaları ve 5N1K olay anlatımı seçilen oyun arkadaşının sesini kullanır. Yeni karakter dışı konuşmalar NarratorVoice.speak/preload ile veya SpeechSynthesisUtterance.voiceRole='narrator' üzerinden yapılmalıdır. Anlatıcı konuşması seçili karakteri ve isimli pekiştirme sayacını değiştirmez. Yeni demo narrator-demo.wav, aynı yerel modelden üretilmiştir; kaynak monolog videoların özgün sesini değiştirmez.

## Çalışma akışı

`dist/character-voice.js`, bütün öğretim motorlarının konuşmasını seçilmiş karaktere yönlendirir. Önce aynı karakterin hazır tam kaydı, sonra hazır cümle parçaları kullanılır. Metin karşılaştırması Türkçe büyük/küçük harf ve boşlukları normalize eder. Sıra numarası ve saat içindeki noktalar cümle bölmez. Çok cümleli bir ipucunda yalnız eksik cümleler üretilir; hazır parçalar yeniden üretilmez. Hazır ilk cümle, sonraki eksik cümlelerin üretimi tamamlanmadan başlar; parçalar özgün sırayla oynatılır. Sonraki parça hazır değilse parça arasında bekleme olabilir. Konuşma bitişi son parçadan sonra bildirilir; dört saniye yanıt aralığı o noktada başlar. İptal edilen konuşmanın sonradan hazır olan parçası çalınmaz.

`prepareLesson` etkinlik açılışını model üretimine bağlamaz. Manifest bekleyişi en fazla 500 ms'dir; zorunlu “Etkinlik hazırlanıyor” kapısı kaldırılmıştır. Nesne/eylem seçiminde `prepareCue`, seçili yönergeyi toplu üretimden önce hazırlatır. Seçim değiştirilince eski seçim isteği iptal edilir. `cancelPreparation` yeni blokta, karakter değişiminde ve ekrandan çıkıldığında eski arka plan hazırlıklarını durdurur. Öğretim ekranından ayrılınca bekleyen aktif konuşma da iptal edilir. Aynı yönergeyi bekleyen canlı istekler hizmette mevcut üretime katılır.

Hazır olmayan sesin ilk CPU üretimi hâlâ zaman alır. Hazır kayıtların hızlı çalması, bütün ses bankasının tamamlandığı anlamına gelmez. Kökten ilk-üretim bekleyişini kaldırmak için bütün sabit öğretmen sesleri etkinliklerden önce hazırlanmış olmalıdır.

## Yerel hizmet ve toplu üretim

- Web: 127.0.0.1:4180; karakter sesi: 127.0.0.1:4182; dinleme: 127.0.0.1:4181.
- `scripts/start-with-speech.mjs` hizmetleri ve tek toplu üreticiyi başlatır. Python ortamı `.voice-runtime`, model ve özel önbellek Git dışındadır.
- `scripts/voice-bank-plan.mjs` sonlu öğretmen metnini ve yeniden kullanılabilir cümleleri listeler. Eşle/göster yönergeleri ve kısa olay ipuçları önce, eşleme/gösterme ipucu parçaları sonra hazırlanır. Dört arkadaş ve ayrı anlatıcı toplamında 14.641 söylem 7.507 benzersiz kayıttan oynatılabilir; bunlar plan sayılarıdır, hazır dosya sayısı değildir. Anlatıcının 57 metni ayrı hedeflerdir; öğretim bankası beşinci ses için gereksiz çoğaltılmaz.
- `scripts/prepare-character-audio.mjs` tek işlem kilidiyle eksik kayıtları tamamlar. Python WAV ve manifestin tek yazarıdır; dosyalar atomik yayımlanır. Üretici kesilirse sonraki başlangıç eksiklerden devam eder.
- Hazır dosyalar `dist/assets/character-voices/ready/` altındadır. Manifest ve ilerleme dosyası gerçek durumu gösterir. Kesilmiş/boş WAV geçerli sayılmaz; hizmet yeniden oluşturur.
- Yalnız sessiz başlangıç/son boşlukları kısaltılır. Önceden düzeltilen kayıtların orijinalleri `outputs/voice-bank-original-margins/` içinde saklanır.

## Çocuğa özel metinler

Çocuk adı ve dinlenen cevaplar public ses kataloğuna eklenmez; özel sesler bellek önbelleğindedir. Hazır olmayan çocuk adı hazır selamlamayı veya pekiştirmeyi bekletmez. Kullanıcı onayıyla, yanlış sözcüğün hazır kaydı yoksa sözcük tekrar üretilmez; doğru model ve “Şimdi sen söyle” kullanılır. Hazır yanlış-sözcük düzeltmesi varsa kullanılabilir. Uygunsuz sözcükler tekrarlanmaz; kısmi cevap açıklaması ve iki deneme sınırı korunur.

İsimli pekiştirme ayrı isim dosyası eklenerek çalınmaz. Seçilen karakter için Aferin, Harikasın ve Süpersin cümlelerinin isim başta/sonda olan altı özel kaydı arka planda hazırlanır. Hazır bütün cümle tek ses dosyası olarak çalınır; isim konumu dönüşümlüdür, isimli pekiştirme sıklığı iki/üç denemelik rastgele aralıkla korunur. Hazır değilse hazır isimsiz pekiştirme beklemeden kullanılır. İsim/karakter değişimi eski özel üretimi iptal eder.

Olay sıralamada ayrıntılı anlatım hazırsa korunur; hazır değilse doğru kart ve yer görsel olarak işaretlenirken hazır kısa “Gösterilen karta dokun” ipucu çalınır. Yanlış yanıtta hazır “Hayır, bu kartın yeri farklı” eklenir. Bu iki kayıt dört karakterde hazırdır; ayrıntılı anlatım arka planda hazırlanır.

Islak sözcüğündeki s kaybı için yalnız sentez girdisinde hece sınırı belirginleştirilir; ekranda özgün Türkçe metin korunur. Önceden hazırlanmış 13 ıslak kaydı yeniden üretildi; özgün WAV dosyaları outputs/voice-bank-revisions içinde yedeklendi. Yerel transkripsiyon kontrolü outputs/wet-articulation-qa.json içindedir; bu kontrol insan dinleme değerlendirmesinin yerine geçmez.

## Doğrulama

`audit-character-audio.mjs --require-complete` gerçek WAV bütünlüğü ve tam katalog kapsamı eksikse başarısız çıkar. `audit-matching-audio.mjs` eşleme yönergeleri ve ipuçlarını dört ses için ayrı raporlar. `audit-hint-audio.mjs` tüm çok cümleli öğretmen metinlerini, eksik parçaları ve ilk cümlenin hazır olup olmadığını outputs/hint-audio-audit.json içinde raporlar. Tamamlanma iddiası bu gerçek dosya denetimine dayanmalıdır; taklit model testleri üretimin hızlı olduğunu kanıtlamaz.

`check-lesson-audio-engines.mjs` öğretim akışlarını, `check-lesson-audio-browser.mjs` kayıt/parça yeniden kullanımını, `check-picker-audio-priority.mjs` seçim önceliği ve eski hazırlığın iptalini, `check-character-voice-service.py` sunucu önbellek/iptal/bütünlük davranışını denetler. Gerçek sesli mobil ekran denemeleri ayrıca `check-first-lesson-audio-real.mjs` ve `check-thick-matching-real.mjs` ile yapılır.

Mevcut banka tamamlanmamıştır. Değişiklikler yereldir; bu çalışmalar için yeni GitHub/site yayını yapılmadı.

## Pekiştirme akıcılığı

20 sabit pekiştirme dört karakterde repair-reward-audio.py ile yeniden hazırlanır. Islak düzeltmesi gibi önceki kayıtlar outputs/voice-bank-revisions içine yedeklenir. Her aday yerel transkripsiyon, toplam süre ve uzun iç sessizlik kontrolünden geçer; üç adayın hiçbiri geçmezse önceki kayıt geri yüklenir. Sonuçlar outputs/reward-voice-qa.json içinde tutulur. Bunlar nesnel sözcük/duraklama kontrolleridir; doğal, neşeli tonun insan tarafından dinlenerek değerlendirilmesinin yerini almaz. İsimli Aferin/Harikasın/Süpersin kayıtları da aynı coşku ayarını kullanır; özel isimli sesler public bankaya eklenmez.

Hazine oyunundaki 16 tam sunucu kaydı yerel bankada hazırdır. Beş gerçek sahne ve 16 konuşma oynatma testinde canlı üretim isteği yapılmadan başladı (tüm 16 konuşma en fazla 147 ms). 5N1K için eksik kayıtlar prepare-wh-audio.mjs ile olay sırasıyla dört karakterde hazırlanır; kalan sayı outputs/wh-audio-preparation.json içindedir. Hazırlık bitmeden tüm 5N1K konuşmalarının gecikmesiz olduğu iddia edilmemelidir. Ses hatasında Yeniden dinle başarısız anlatımı, ipucunu veya pekiştirmeyi aynı metinle yeniden oynatır.

5N1K anlatımı artık olay açılırken videoyla birlikte başlar; soru ancak video ve anlatım birlikte bittikten sonra açılır. Mikrofon/ASR hazırlığı anlatımın ön koşulu değildir; yanıt aralığı yine dinleme gerçekten başladıktan sonra ölçülür. Seçili Dila sesiyle 10 seviyenin ilk olay anlatımları prepare-wh-openings.mjs ile hazırlandı; gerçek tarayıcıda hepsi 1 saniyenin altında başladı, her cümle sonuna kadar oynatıldı ve cümle arası boşluklar 1 saniyenin altında kaldı. Mikrofonlu açılış da sahte test aygıtıyla 509 ms geçti. Bu sonuçlar 50 olayın bütün soru/ipucu kayıtlarının hazır olduğu anlamına gelmez; tam banka hazırlık ve denetimi devam eder.


2026-10-11: Kullanıcının son talimatı önceki 5N1K ses tercihini değiştirir: olay hikâyeleri ana konuşmacı (narrator), sorular, ipuçları ve pekiştirmeler seçilen oyun arkadaşıdır. Tekrar dinle aynı ses rolünü korur. Ana konuşmacı eksik kayıtlarının hazırlanması sürmektedir; tamamlanmadan tüm olaylar için gecikmesiz ses iddiasında bulunulmaz.


2026-10-11 yeni karakter referansları: kullanıcı long WAV dosyaları dört karakterin önceki referanslarını değiştirir. Orijinaller ve önceki bankanın kayıtları outputs/voice-reference-updates içinde yedeklidir. Ana konuşmacı değişmedi. Karakter bankası yeniden üretilir; WAV dosya adında referans özeti bulunur, eski tarayıcı kaydı yeni ses yerine kullanılamaz. Toplu üretim tamamlanana kadar tüm cümleler hazır değildir.


2026-10-11 exhaustive audio follow-up: finite teacher bank audit remains incomplete after reference replacement. Removed WH story narration and island-only speech from companion catalog to avoid four redundant voice generations; narrator targets remain. Entire teaching audio-plan engine suite passes, plus mixed-object/naming/WH/island flows. All 37 currently ready WAV entries measured in real browser: max70ms, zero foreground model requests; leading-silence scan found none above300ms. These measurements do NOT cover missing recordings. General producer full-audio-regeneration.log prepares remaining bank; finish-all-audio-checks.mjs verifies full coverage and real ready-bank starts only after current reference revision completes, writes full-audio-completion.json on success. No all-latency-solved claim before successful completion report. Local only.


2026-10-11 picker/entry follow-up: avatarContinue invoked speak without text, selecting legacy default comma greeting not present in new bank. App speak default now uses selectionMessage(key); helper also maps legacy comma greeting to named ready selection text. Real visible card clicks in four voices completed all greeting sentences, starts65/26/60/48ms, zero foreground generation. Bank generation priority now prepares three essential rewards then all match/show and generic naming openings before remaining rewards. Missing static speech still requires CPU synthesis; all-delay-fixed claims prohibited before full completion. Producer log first-instruction-priority-preparation.log. User tab refreshed at idle and reopened avatar chooser, retained.
