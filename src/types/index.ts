export type UserRole = 'admin' | 'user';

export type VipPlanId = 'daily' | 'weekly' | 'monthly';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  vipUntil: number | null;
  vipPlan: VipPlanId | null;
  isVip: boolean;
  remainingVipMs: number;
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
  receiptDataUrl?: string;
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
  legNumber: number;
  raceNumber: number;
  raceTime: string;
  title: string;
  distanceAndTrack: string;
  altiliLeg: boolean;
  isLocked?: boolean;
  horses: HorsePrediction[];
  expertAnalysis: string;
  recommendedPicks: number[];
}

export interface RaceDay {
  id: string;
  date: string;
  displayDate: string;
  hipodrom: string;
  city: string;
  title: string;
  isFeatured?: boolean;
  status: 'upcoming' | 'live' | 'completed';
  isLocked?: boolean;
  altiliGanyanSummary?: {
    programNumber: number;
    estimatedCost: string;
    couponFormula: string;
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
