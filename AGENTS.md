# Proje çalışma notları

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
