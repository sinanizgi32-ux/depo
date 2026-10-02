# Dijital Özel Eğitim

Güncel sürüm **0.9.2**. Qoder'da bilgisayarda geliştirilen 0.9.1 çalışması korunmuştur: örüntü etkinliği 15 seviye ve her seviyede 5 deneme içerir. Eşzamanlı ipucu ve 4 saniye sabit bekleme akışları bağlıdır. Eksik yeşil kare tanımı düzeltilmiştir.

Windows'ta tüm klasörü indirin/çıkartın ve **Baslat.cmd** dosyasını açın. Ücretsiz Node.js 22 veya üstü gerekir. Uygulamayı çalıştırmak için `npm install` gerekmez. macOS/Linux'ta proje klasöründe `node scripts/serve.mjs` çalıştırın; `http://127.0.0.1:4180/` adresini açın.

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
