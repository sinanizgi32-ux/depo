# Dijital Erken Eğitim — başka bilgisayarda çalıştırma

Bu klasörün tamamı güncel proje kaydıdır. Çalışan uygulama `dist` içinde; Pofidik modeli, sesler ve görseller de birlikte taşınır. Dosyalarda belirli bir kullanıcı adı veya masaüstü yolu gerekmez.

## Windows

1. Proje ZIP dosyasını yeni bilgisayara kopyalayın ve tamamını bir klasöre çıkarın. ZIP içinden doğrudan başlatmayın.
2. Bilgisayarda Node.js 22 veya daha yeni bir LTS sürümü kurulu olmalı. Yoksa [resmî Node.js sitesinden](https://nodejs.org/) kurun. Node.js ücretsizdir; bu uygulamayı çalıştırmak için Tripo kredisi veya ChatGPT hesabı gerekmez.
3. `Baslat.cmd` dosyasını açın. Tarayıcı otomatik açılır; açılmazsa `http://127.0.0.1:4180/` adresini ziyaret edin.
4. Uygulama açıkken başlatma penceresi de açık kalmalı. Bitirince pencereyi kapatın.

`dist/index.html` dosyasını çift tıklayarak açmayın: tarayıcı güvenliği nedeniyle 3B modelin yüklenmesi için yerel HTTP sunucusu gerekir. Sunucu yalnızca bu bilgisayarda dinler; uygulamayı internete açmaz.

## macOS / Linux

Node.js 22 veya daha yeni LTS sürümü kuruluysa proje klasöründe `npm start` çalıştırın, sonra `http://127.0.0.1:4180/` adresini açın. `npm install` gerekmez; hazır uygulamanın çalışma bağımlılıkları paket içindedir. İsterseniz `npm run start:open` tarayıcıyı da açar.

4180 kullanımdaysa Windows Komut İstemi'nde `set PORT=4181`, macOS/Linux'ta `PORT=4181 npm start` kullanılabilir. Windows'ta aynı pencereden `npm start` çalıştırın; adres bu kez 4181 ile biter.

## GitHub üzerinden aynı projeyle devam etme

Proje deposu: [sinanizgi32-ux/depo](https://github.com/sinanizgi32-ux/depo). İlk yükleme ve erişim durumu ayrıca doğrulanmalıdır; bu belge tek başına dosyaların GitHub'a yüklendiği anlamına gelmez.

Diğer bilgisayarda depodaki proje klasörünü indirin veya Git ile kopyalayın. Masaüstü Codex/ChatGPT uygulamasında bir yerel projeye bu klasörü bağlayın ve yeni düzenlemeleri bunun üzerine yaptırın. Web'deki normal ChatGPT projesinde yerel klasöre doğrudan erişim yoktur; gerekli dosyaları yüklemek veya erişilebilir bir kaynak bağlamak gerekir. Sohbetin eşitlenmesi, yerel proje klasörünü başka bilgisayara kendiliğinden taşımaz; GitHub veya proje ZIP dosyası dosyaları taşır. [Resmî OpenAI proje açıklaması](https://learn.chatgpt.com/docs/projects).

İki bilgisayarda aynı anda farklı değişiklikler yapmayın. Başlamadan önce en güncel dosyaları alın; bitirince değişiklikleri depoya kaydedip gönderin. Depoda başka klasörler varsa bu uygulamanın kendi klasörünü açın. Hesap parolaları, API anahtarları, `.env` dosyaları ve öğrenci/sağlık kayıtları depoya eklenmemeli. Eğitim uygulaması için mümkünse erişimi sınırlı özel depo kullanın.

## Veriler ve sınırlar

- Profil, değerlendirme ve ayarlar tarayıcının yerel depolamasında tutulur; proje ZIP'i/GitHub bunları otomatik kopyalamaz. Başka bilgisayarda veya farklı tarayıcıda profil yeniden kurulabilir. Sunucu adresini/kapısını değiştirmek de ayrı bir tarayıcı depolaması açar.
- Türkçe sesli okuma, işletim sisteminde ve tarayıcıda bulunan seslere bağlıdır. Yeni bilgisayarda Türkçe ses paketi gerekebilir; sesin tonu aynı olmayabilir. Bazı sesler çevrim içi çalışabilir.
- Hazır 3B modeller için internetten bir model üretimi veya kredi harcaması gerekmez. Üretim hesabının anahtarları bu pakete konulmaz.
- Telefon/tablet veya herkesin tek bağlantıdan kullanacağı bir internet yayını için ayrıca bir barındırma ve güvenli kullanıcı/veri sistemi gerekir. Bu yerel paket böyle bir yayın yapmaz.

## Düzenlemeleri koruma

Asıl düzenlenecek dosyalar `dist/app.js`, `dist/index.html`, `dist/styles.css` ve `scripts` altındaki karakter kaynaklarıdır. Hazır Pofidik görüntüleyicisi `dist/pofidik-viewer.js` içindedir. Bu paket eski bir Vite projesi değildir; hazır `dist` klasörünü silmeyin veya boş bir derleme ile değiştirmeyin. Model dosyalarını ve karakter kaynaklarını da yeni bilgisayara taşıyın.

Güncel proje kararları `PROJECT_DECISIONS.md`, sürüm bilgisi `VERSION.txt` içinde tutulur. Yeni bir değişiklikten önce tüm proje klasörünün tarihli ZIP yedeğini alın. Test modelleri, özel anahtarlar ve eski yedek ZIP'leri teslim paketine eklemeyin.
