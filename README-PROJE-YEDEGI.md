# Dijital Özel Eğitim — Proje Yedeği

Bu klasör sürüm 0.4.0'ın eksiksiz kaynak yedeği ve üzerine yapılan güncellemeleri içerir.

- 0.5.0: "Aynı tip ve aynı renk kartları eşle" (kırmızı) etkinliği oynanabilir hale getirildi (5 deneme, 6 kart, sesli pekiştirme ve hata düzeltmesi).
- 0.6.0: Türkçe ses iyileştirmesi (kız karakterlere Türkçe kadın sesi önceliği, doğal ton), oyun arkadaşına 10 dönüşümlü cümle, üyelik altyapı iskeleti (girişte "Satın al" kutusu ve aylık 300 ₺ plan ekranı) ve ayarlarda "Kullanıcı profili" satırı eklendi. Gerçek ödeme altyapısı henüz bağlı değildir.
- 0.6.1: Kaba değerlendirme butonu iki modlu (ilk girişte "Yöntem seçimine geç", menüden gelince "Tamamla" ve ana menüye dönüş); ayarlardaki açıklama yazıları ve "Diğer ayarlar" uyarısı kaldırıldı; ana menü başlığı sabit "Çalışmalar" oldu; ses seçimi puanlama ile iyileştirildi (nötr ton); oyunlardaki eski fazla şekiller gizlendi.
- 0.7.0: Doğru yanıtta 10 kişilik havuzdan rastgele sözel pekiştireç (Aferin!, Çok güzel!, Bravo! ...); kaba değerlendirme hiçbir beceri işaretlenmeden geçilebilir ve sabit uyarı yazısı gösterilir; plan ekranındaki mavi düğme "Satın al" oldu (ileride sanal POS adresine yönlendirecek); program simgesi küçültüldü.
- 0.7.1: Bilişsel becerilerdeki oyunlar geri geldi; artık yalnızca "Yapıyor" işaretlenen beceri kapanıyor, işaretsiz beceriler de listede ve oynanabilir durumda. Giriş ekranındaki program simgesi yeniden küçültüldü (en çok 380 px / 44 vh) ve kendi alanına sabitlendi; yazıların üstüne binmesi engellendi.

- Uygulamanın çalışan dosyaları `dist` klasöründedir.
- Yaklaşık bir dakikalık döngülü menü müziği `dist/assets` klasöründedir.
- Güncel kararlar `PROJECT_DECISIONS.md` dosyasındadır.
- Sürüm bilgisi `VERSION.txt` dosyasındadır.
- 3B karakterlerle birlikte çalıştırmak için `Baslat.cmd` açılmalı; başka bilgisayara taşıma ve diğer işletim sistemleri için `README-OTHER-COMPUTER.md` kullanılmalıdır. `dist/index.html` dosyasını doğrudan açmak 3B model yüklemesini engelleyebilir.

Sonraki düzenlemeler bu proje üzerine yapılmalı; yeni ve boş bir proje oluşturulmamalıdır.
