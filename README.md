# Müslüm - VIP At Yarışı Tahminleri Web Uygulaması 🏇👑

Lüks siyah ve altın sarısı tasarımlı, Türkçe at yarışı VIP tahmin ve altılı ganyan analiz platformu.

## 🚀 Özellikler

- **Lüks Tasarım:** Siyah (`#080808`) ve altın sarısı (`#D4AF37`) konsept, iPhone ve mobil cihazlara tam uyumlu.
- **VIP Üyelik Paketleri:**
  - Günlük: 100 TL (1 gün)
  - Haftalık: 600 TL (7 gün)
  - Aylık: 1.750 TL (30 gün)
- **VIP Kilit Koruması:** Ücretsiz tahmin verilmez. Bütün bankolar, bomba safkanlar, koşu taktik analizleri ve altılı şablonları hem arayüzde hem de API seviyesinde aktif VIP üyelerine özeldir.
- **IBAN ile Ödeme ve Dekont Bildirimi:** Otomatik tekil referans kodu, IBAN kopyalama ve dekont yükleme.
- **Güvenli Yönetici Paneli:**
  - Yarış günleri ve hipodrom bültenleri ekleme/düzenleme/silme
  - Koşular, at numaraları, jokeyler, kilo ve oranlar ekleme
  - Banko (Tek), Bomba (Sürpriz) ve Plase rozetleri belirleme
  - Koşu taktik analiz yazılarını yayımlama ve düzenleme
  - Üye bitiş tarihlerini ve VIP sürelerini yönetme (+1 gün, +7 gün, +30 gün, özel tarih)
  - Gelen IBAN dekont bildirimlerini inceleyip manuel olarak VIP başlatma veya reddetme
  - Banka adı, IBAN ve hesap sahibini anında güncelleyebilme
- **Kalıcı Veri Tabanı:** Node.js/Express arka yüzünde `data/database.json` üzerinde PBKDF2/SHA-512 şifreleme ve güvenli HMAC oturum token'ları.

## 💻 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda veya sunucunuzda çalıştırmak için:

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

### Canlıya Alma (Production Build)

```bash
# Derleme
npm run build

# Canlı sunucuyu başlatma
npm start
```

## 👑 Yönetici Girişi

- **Yönetici E-posta:** `muslumaltinarr06@gmail.com`
- **Geçici İlk Şifre:** `muslum1234`
