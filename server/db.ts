import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, BankSettings, PaymentRequest, RaceDay, VipPlan } from './types.js';

export const VIP_PLANS: VipPlan[] = [
  {
    id: 'daily',
    name: 'Günlük VIP',
    price: 100,
    durationDays: 1,
    badge: 'Hızlı Başlangıç',
    features: [
      '1 Gün (24 Saat) Kesintisiz VIP Erişim',
      'Günün Tüm Hipodrom Koşu Analizleri',
      'Banko ve Sürpriz Tek Önerileri',
      'Özel Altılı Ganyan Şablonları',
    ],
  },
  {
    id: 'weekly',
    name: 'Haftalık VIP',
    price: 600,
    durationDays: 7,
    badge: 'En Çok Tercih Edilen',
    features: [
      '7 Gün Tam VIP Erişim',
      'Tüm Gündüz & Gece Yarışları',
      'Erken Bahis & İdman Pisti Notları',
      'Bomba / Cazip Plase & İkili Tercihleri',
      'Doğrudan WhatsApp İletişim Önceliği',
    ],
  },
  {
    id: 'monthly',
    name: 'Aylık VIP',
    price: 1750,
    durationDays: 30,
    badge: 'Maksimum Avantaj',
    features: [
      '30 Gün Kesintisiz VIP Prestij',
      'Türkiye & Yabancı Hipodrom Analizleri',
      'Grup Koşuları ve Büyük Derbiler Özel Bülteni',
      'Yüksek Kazanç Odaklı Misli Altılı Kuponları',
      '7/24 Kesintisiz Yönetici Desteği',
    ],
  },
];

interface DatabaseSchema {
  users: User[];
  bankSettings: BankSettings;
  paymentRequests: PaymentRequest[];
  races: RaceDay[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.resolve(DB_DIR, 'database.json');

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function getInitialData(): DatabaseSchema {
  const adminSalt = generateSalt();
  const adminHash = hashPassword('muslum1234', adminSalt);

  const initialAdmin: User = {
    id: 'user_admin_muslum',
    email: 'muslumaltinarr06@gmail.com',
    name: 'Müslüm Altınar (Yönetici)',
    passwordHash: adminHash,
    salt: adminSalt,
    role: 'admin',
    vipUntil: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
    vipPlan: 'monthly',
    createdAt: Date.now(),
  };

  const initialBankSettings: BankSettings = {
    bankName: 'Ziraat Bankası',
    iban: 'TR33 0001 0000 0000 0000 0000 01',
    accountHolder: 'Müslüm Altınar',
    note: 'Havale / EFT / FAST gönderirken Açıklama kısmına sistem tarafından verilen Referans Kodunu eksiksiz yazınız. Ödemenizi yaptıktan sonra dekont bildirim formunu doldurunuz.',
    updatedAt: Date.now(),
  };

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const dateFormatted = today.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  const initialRaces: RaceDay[] = [
    {
      id: 'race_istanbul_today',
      date: dateStr,
      displayDate: dateFormatted,
      hipodrom: 'İstanbul Veliefendi Hipodromu',
      city: 'İstanbul',
      title: 'İstanbul Veliefendi Altılı Ganyan VIP Analizi',
      isFeatured: true,
      status: 'live',
      altiliGanyanSummary: {
        programNumber: 1,
        estimatedCost: '320,00 TL',
        couponFormula: '3-5-7 // 2 (BANKO) // 1-4-6-8 // 5 (TEK) // 2-3-9 // 1-4-7-11',
        summaryNote: 'Günün en sağlam bankosu 4. Ayaktaki (5) GÜRKANBEY olarak belirlenmiştir. 3. Ayakta sürpriz ihtimali yüksektir.',
      },
      races: [
        {
          id: 'ist_leg_1',
          legNumber: 1,
          raceNumber: 3,
          raceTime: '15:00',
          title: 'Handikap 15 / DHT / Dişi',
          distanceAndTrack: '1400m Sentetik',
          altiliLeg: true,
          horses: [
            {
              number: 3,
              name: 'GÖKÇEKIZ',
              jockey: 'Ahmet Çelik',
              weight: '58 kg',
              form: '1-2-1-4',
              odds: '3.20',
              isBanko: false,
              isSurprise: false,
              notes: 'Pist ve mesafeye son derece uyumlu, düzlük sprinti çok etkili.',
            },
            {
              number: 5,
              name: 'ALTIN DAMLA',
              jockey: 'Gökhan Kocakaya',
              weight: '56 kg',
              form: '3-1-2-2',
              odds: '2.80',
              isBanko: false,
              isSurprise: false,
              notes: 'Son galobunda çok diri göründü, ilk şanslı isim.',
            },
            {
              number: 7,
              name: 'KARA İNCİ',
              jockey: 'Halis Karataş',
              weight: '54.5 kg',
              form: '4-3-6-1',
              odds: '6.50',
              isBanko: false,
              isSurprise: true,
              notes: 'Hafif kilosu ve start avantajı ile günün ilk bombasını patlatabilir.',
            },
          ],
          recommendedPicks: [5, 3, 7],
          expertAnalysis: 'Temponun yüksek başlayacağı bir koşu. Viraj dönülürken ön grupta yerini alacak 5 ALTIN DAMLA ve arkasında sabırlı bekleyecek 3 GÖKÇEKIZ ikilisi ön planda. Geniş kuponlara 7 KARA İNCİ eklenmeli.',
        },
        {
          id: 'ist_leg_2',
          legNumber: 2,
          raceNumber: 4,
          raceTime: '15:30',
          title: 'Şartlı 4 / 3 Yaşlı İngilizler',
          distanceAndTrack: '1600m Çim',
          altiliLeg: true,
          horses: [
            {
              number: 2,
              name: 'LORD OF WAR',
              jockey: 'Özcan Yıldırım',
              weight: '58 kg',
              form: '1-1-2-1',
              odds: '1.60',
              isBanko: true,
              isSurprise: false,
              notes: 'Formunun zirvesinde. Jokeyi ile mükemmel uyumlu, günün sarsılmaz tek adayı.',
            },
            {
              number: 1,
              name: 'THUNDERBOLT',
              jockey: 'Mert Ali Solmaz',
              weight: '60 kg',
              form: '2-3-1-4',
              odds: '4.80',
              isBanko: false,
              isSurprise: false,
              notes: 'Kilo dezavantajı var ancak tabela şansı yüksek.',
            },
          ],
          recommendedPicks: [2],
          expertAnalysis: '2 LORD OF WAR bu gruptan bir gömlek üstün kaliteye sahip. Son işinde adeta kanatlandı. Rakiplerinin sert tempo kuramayacağı bu koşuda viraj üstü hakimiyeti alıp kazanmasını bekliyoruz. GÜNÜN BANKOSU.',
        },
        {
          id: 'ist_leg_3',
          legNumber: 3,
          raceNumber: 5,
          raceTime: '16:00',
          title: 'KV-7 / 4+ Yaşlı Araplar',
          distanceAndTrack: '2100m Sentetik',
          altiliLeg: true,
          horses: [
            {
              number: 1,
              name: 'KAFKAS ŞAHI',
              jockey: 'Halis Karataş',
              weight: '61 kg',
              form: '3-2-1-3',
              odds: '3.40',
              notes: 'Uzun mesafede dayanıklılığı yüksek.',
            },
            {
              number: 4,
              name: 'YILDIRIMBEYİ',
              jockey: 'Gökhan Kocakaya',
              weight: '57.5 kg',
              form: '1-4-2-1',
              odds: '2.90',
              notes: 'İdman pistinde sergilediği dereceler çok tatminkar.',
            },
            {
              number: 6,
              name: 'DOĞAN FIRTINASI',
              jockey: 'Ayhan Kurşun',
              weight: '55 kg',
              form: '5-6-3-2',
              odds: '7.20',
              isSurprise: true,
              notes: 'Boş kilo avantajı ile sonlarda çok sert gelecektir.',
            },
            {
              number: 8,
              name: 'BATUHANBEY',
              jockey: 'Akın Sözen',
              weight: '54 kg',
              form: '6-2-4-1',
              odds: '8.50',
              notes: 'Sürpriz kuponların olmazsa olmazı.',
            },
          ],
          recommendedPicks: [4, 1, 6, 8],
          expertAnalysis: 'Mesafe 2100m ve yarış temposu değişken. 4 YILDIRIMBEYİ ve 1 KAFKAS ŞAHI ana çatıyı oluştursa da 6 ve 8 numaralı safkanlar sürpriz hanesinde mutlaka değerlendirilmelidir.',
        },
        {
          id: 'ist_leg_4',
          legNumber: 4,
          raceNumber: 6,
          raceTime: '16:30',
          title: 'A-3 / 3 Yaşlı Araplar (Günün Koşusu)',
          distanceAndTrack: '1400m Çim',
          altiliLeg: true,
          horses: [
            {
              number: 5,
              name: 'GÜRKANBEY',
              jockey: 'Ahmet Çelik',
              weight: '57 kg',
              form: '1-1-1-1',
              odds: '1.45',
              isBanko: true,
              notes: 'Geçilmezlik unvanını koruyor. Şampiyon adayı safkan.',
            },
            {
              number: 2,
              name: 'DİVRİĞİ ASLANI',
              jockey: 'Özcan Yıldırım',
              weight: '57 kg',
              form: '2-1-2-3',
              odds: '5.10',
              notes: 'Rakip gördüğümüz tek isim.',
            },
          ],
          recommendedPicks: [5],
          expertAnalysis: '5 GÜRKANBEY kariyerine 4 te 4 ile başladı. Tarzı, aksiyonları ve nefesi kusursuz. Ahmet Çelik ile starttan çıktığı gibi aynayı önde geçecektir. MÜSLÜM VIP TEK ÖNERİSİDİR.',
        },
        {
          id: 'ist_leg_5',
          legNumber: 5,
          raceNumber: 7,
          raceTime: '17:00',
          title: 'Şartlı 5 / 4 Yaşlı İngilizler',
          distanceAndTrack: '1900m Çim',
          altiliLeg: true,
          horses: [
            {
              number: 2,
              name: 'GOLDEN RULER',
              jockey: 'Halis Karataş',
              weight: '58 kg',
              form: '2-3-1-1',
              odds: '2.50',
              notes: 'Çim pist performansı üst düzey.',
            },
            {
              number: 3,
              name: 'VALIANT HEART',
              jockey: 'Gökhan Kocakaya',
              weight: '56 kg',
              form: '1-4-2-3',
              odds: '3.10',
              notes: 'Son koşusunu ölçü almayınız.',
            },
            {
              number: 9,
              name: 'BLACK VIPER',
              jockey: 'Vedat Abiş',
              weight: '53 kg',
              form: '7-1-4-2',
              odds: '9.00',
              isSurprise: true,
              notes: 'Günün gizli bombası.',
            },
          ],
          recommendedPicks: [2, 3, 9],
          expertAnalysis: '2 GOLDEN RULER ve 3 VALIANT HEART arasındaki mücadeleye, çok cazip ganyanla koşacak olan 9 BLACK VIPER ortak olabilir. Üç ismi ayırt etmiyoruz.',
        },
        {
          id: 'ist_leg_6',
          legNumber: 6,
          raceNumber: 8,
          raceTime: '17:30',
          title: 'Maiden / 3 Yaşlı İngilizler (Kapanış)',
          distanceAndTrack: '1300m Sentetik',
          altiliLeg: true,
          horses: [
            {
              number: 1,
              name: 'ASLAN YÜREK',
              jockey: 'Akın Sözen',
              weight: '58 kg',
              form: '2-2-3',
              odds: '2.70',
            },
            {
              number: 4,
              name: 'CAPTAIN SPEED',
              jockey: 'Gökhan Kocakaya',
              weight: '58 kg',
              form: '3-4-2',
              odds: '3.30',
            },
            {
              number: 7,
              name: 'LUCKY CHARM',
              jockey: 'Özcan Yıldırım',
              weight: '56 kg',
              form: '4-3-5',
              odds: '5.50',
            },
            {
              number: 11,
              name: 'SILVER SHADOW',
              jockey: 'Ayhan Kurşun',
              weight: '56 kg',
              form: '6-2',
              odds: '8.20',
              isSurprise: true,
            },
          ],
          recommendedPicks: [1, 4, 7, 11],
          expertAnalysis: 'Kapanış ayağında Maiden koşularda hata payını azaltmak için bütçe elverdiğince fazla at yazılması tavsiye edilir. Sıralamamız: 1 - 4 - 7 - 11.',
        },
      ],
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now() - 3600000,
    },
    {
      id: 'race_adana_today',
      date: dateStr,
      displayDate: dateFormatted,
      hipodrom: 'Adana Yeşiloba Hipodromu',
      city: 'Adana',
      title: 'Adana Yeşiloba Gece Yarışları VIP Şablonu',
      isFeatured: false,
      status: 'upcoming',
      altiliGanyanSummary: {
        programNumber: 2,
        estimatedCost: '180,00 TL',
        couponFormula: '1-3-4 // 6 (BANKO) // 2-5 // 1-2-7-9 // 3 // 4-8',
        summaryNote: 'Adana kumunda 2. Ayakta 6 ADANA FIRTINASI tek olarak güven vermektedir.',
      },
      races: [
        {
          id: 'adana_leg_1',
          legNumber: 1,
          raceNumber: 4,
          raceTime: '18:30',
          title: 'Handikap 14 / DHT',
          distanceAndTrack: '1400m Kum',
          altiliLeg: true,
          horses: [
            {
              number: 1,
              name: 'ÇUKUROVA ATEŞİ',
              jockey: 'Ercan Çankaya',
              weight: '60 kg',
              form: '2-1-3-4',
              odds: '3.00',
            },
            {
              number: 3,
              name: 'TOROS RÜZGARI',
              jockey: 'Mehmet Salih Çelik',
              weight: '57 kg',
              form: '1-2-5-1',
              odds: '2.50',
            },
          ],
          recommendedPicks: [3, 1],
          expertAnalysis: 'Kum pistte form durumu çok iyi olan 3 TOROS RÜZGARI ve 1 ÇUKUROVA ATEŞİ koşunun iki favorisidir.',
        },
      ],
      createdAt: Date.now() - 1800000,
      updatedAt: Date.now() - 1800000,
    },
  ];

  return {
    users: [initialAdmin],
    bankSettings: initialBankSettings,
    paymentRequests: [],
    races: initialRaces,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure admin with muslumaltinarr06@gmail.com exists
        const adminFound = this.data.users.find(u => u.email.toLowerCase() === 'muslumaltinarr06@gmail.com');
        if (!adminFound) {
          const adminSalt = generateSalt();
          const adminHash = hashPassword('muslum1234', adminSalt);
          this.data.users.push({
            id: 'user_admin_muslum',
            email: 'muslumaltinarr06@gmail.com',
            name: 'Müslüm Altınar (Yönetici)',
            passwordHash: adminHash,
            salt: adminSalt,
            role: 'admin',
            vipUntil: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10,
            vipPlan: 'monthly',
            createdAt: Date.now(),
          });
          this.save();
        } else if (adminFound.role !== 'admin') {
          adminFound.role = 'admin';
          this.save();
        }
      } catch (err) {
        console.error('Error reading db.json, creating initial data:', err);
        this.data = getInitialData();
        this.save();
      }
    } else {
      this.data = getInitialData();
      this.save();
    }
  }

  private save(): void {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing db.json:', err);
    }
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  createUser(user: User): User {
    // If user signs up with the administrator email, ensure they get admin role!
    if (user.email.toLowerCase() === 'muslumaltinarr06@gmail.com') {
      user.role = 'admin';
    } else {
      user.role = 'user'; // strict enforcement: normal users cannot give themselves admin
    }
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.getUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // Bank Settings
  getBankSettings(): BankSettings {
    return this.data.bankSettings;
  }

  updateBankSettings(settings: Partial<BankSettings>): BankSettings {
    this.data.bankSettings = {
      ...this.data.bankSettings,
      ...settings,
      updatedAt: Date.now(),
    };
    this.save();
    return this.data.bankSettings;
  }

  // Payment Requests
  getPaymentRequests(): PaymentRequest[] {
    return this.data.paymentRequests;
  }

  getPaymentRequestById(id: string): PaymentRequest | undefined {
    return this.data.paymentRequests.find(p => p.id === id);
  }

  createPaymentRequest(req: PaymentRequest): PaymentRequest {
    this.data.paymentRequests.unshift(req);
    this.save();
    return req;
  }

  updatePaymentRequest(id: string, updates: Partial<PaymentRequest>): PaymentRequest | undefined {
    const p = this.getPaymentRequestById(id);
    if (!p) return undefined;
    Object.assign(p, updates);
    this.save();
    return p;
  }

  // Races
  getRaces(): RaceDay[] {
    return this.data.races;
  }

  getRaceById(id: string): RaceDay | undefined {
    return this.data.races.find(r => r.id === id);
  }

  createRace(race: RaceDay): RaceDay {
    this.data.races.unshift(race);
    this.save();
    return race;
  }

  updateRace(id: string, updates: Partial<RaceDay>): RaceDay | undefined {
    const r = this.getRaceById(id);
    if (!r) return undefined;
    Object.assign(r, updates, { updatedAt: Date.now() });
    this.save();
    return r;
  }

  deleteRace(id: string): boolean {
    const idx = this.data.races.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.data.races.splice(idx, 1);
    this.save();
    return true;
  }
}

export const db = new Database();
