export type UserRole = 'admin' | 'user';

export type VipPlanId = 'daily' | 'weekly' | 'monthly';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  vipUntil: number | null; // Unix timestamp in ms
  vipPlan: VipPlanId | null;
  createdAt: number;
}

export interface BankSettings {
  bankName: string;
  iban: string;
  accountHolder: string;
  note: string;
  updatedAt: number;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: VipPlanId;
  planName: string;
  amount: number;
  senderName: string;
  referenceCode: string;
  receiptDataUrl?: string; // base64 receipt
  note?: string;
  status: PaymentStatus;
  adminNote?: string;
  createdAt: number;
  processedAt?: number;
  processedBy?: string;
}

export interface HorsePrediction {
  number: number;
  name: string;
  jockey: string;
  weight?: string;
  form?: string;
  odds?: string;
  isBanko?: boolean;
  isSurprise?: boolean;
  isPlase?: boolean;
  notes?: string;
}

export interface RaceLeg {
  id: string;
  legNumber: number; // 1. Ayak, 2. Ayak vb.
  raceNumber: number; // Koşu No
  raceTime: string; // "15:30"
  title: string; // "Handikap 16 / D", "KV-8"
  distanceAndTrack: string; // "1400m Çim", "2000m Sentetik"
  altiliLeg: boolean; // Altılı ganyana dahil mi?
  horses: HorsePrediction[];
  expertAnalysis: string; // Detaylı VIP analizi
  recommendedPicks: number[]; // [1, 4, 7] veya [3] (Banko)
}

export interface RaceDay {
  id: string;
  date: string; // "YYYY-MM-DD"
  displayDate: string; // "14 Ekim 2026 Çarşamba"
  hipodrom: string; // "İstanbul Veliefendi", "Adana Yeşiloba"
  city: string; // "İstanbul", "Adana"
  title: string; // "İstanbul Veliefendi Gündüz Yarışları"
  isFeatured?: boolean;
  status: 'upcoming' | 'live' | 'completed';
  altiliGanyanSummary?: {
    programNumber: number; // 1. Altılı veya 2. Altılı
    estimatedCost: string; // "240 TL"
    couponFormula: string; // "2-4-5 // 1 BANKO // 3-7-8 // ..."
    summaryNote: string;
  };
  races: RaceLeg[];
  createdAt: number;
  updatedAt: number;
}

export interface VipPlan {
  id: VipPlanId;
  name: string;
  price: number;
  durationDays: number;
  badge?: string;
  features: string[];
}
