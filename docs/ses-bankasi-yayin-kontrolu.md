# Ses bankasının yayın kontrolü

Sabit yönergeler, yanlış yanıt düzeltmeleri, tepkisizlik ipuçları, pekiştirmeler ve anlatımlar yayın öncesinde WAV olarak hazırlanır. Son kullanıcı cihazında bu metinler için ses üretimi yapılması gerekmez. Dört karakterin güncel referansları ve ana anlatıcının ayrı rolü korunur.

`npm run audio:prepare` kalan bütün kayıtları üretir; kaldığı yerden devam eder. `--priority-items=pencil` kurşun kalemin eşleme/gösterme yönerge ve ipuçlarını öne alır, diğer kayıtları dışlamaz. Tek üretici kilidi vardır. Bilgisayar ve yerel ses hizmeti açık kalmalıdır.

`npm run audio:verify` tüm sonlu öğretmen konuşmalarını doğrular; eksik veya geçersiz dosya varsa başarısız olur. Ayrıntılı rapor outputs/release-audio-readiness.json dosyasına yazılır. Bir konuşma birden fazla hazır cümle kaydıyla karşılanabilir; konuşma sayısı fiziksel WAV sayısıyla aynı değildir.

`npm run package:offline` yalnız tam ses bankasında dağıtılabilir web dosyalarını hazırlar. Kullanılmayan eski WAV ve referans örnekleri pakete alınmaz. Bu komut Android/iOS mağaza paketi oluşturmaz; yerel ses tanıma hizmetinin mobil uyarlaması ayrıca gerekir.

Hazır kayıtlar prepareCue/preload ile belleğe indirilir. check-prepared-hints-offline.mjs indirildikten sonra WAV indirmesini ve üretimi kapatarak yönerge ile yanlış/tepkisiz yanıt ipuçlarının tamamlanmasını doğrular. Testte ses dosyası bir test örneğidir; bütün bankanın tamamlandığı anlamına gelmez.

11 Ekim 2026 kontrolünde banka eksiktir. Üretim outputs/pencil-and-full-audio-preparation.log içinde izlenir. Tamamlanınca çalışan finish-all-audio-checks.mjs kapsam ve gerçek oynatma kontrollerinden sonra outputs/full-audio-completion.json üretir. Bu başarı raporu oluşmadan tüm gecikmeler giderildi veya mağazaya hazır denmez.
