import React from 'react';
import { X, Crown, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { VipPlan, VipPlanId } from '../types';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: VipPlanId) => void;
}

const PLANS: VipPlan[] = [
  {
    id: 'daily',
    name: 'Günlük VIP',
    price: 100,
    durationDays: 1,
    badge: 'Hızlı Başlangıç',
    features: [
      '1 Gün (24 Saat) Kesintisiz VIP Erişim',
      'Günün Tüm Hipodrom Koşu Analizleri',
      'Günün Banko ve Sürpriz Tek Önerileri',
      'Özel Altılı Ganyan Şablonları',
    ],
  },
  {
    id: 'weekly',
    name: 'Haftalık VIP',
    price: 600,
    durationDays: 7,
    badge: 'En Çok Tercih Edilen ⭐',
    features: [
      '7 Gün Tam VIP Prestij Erişim',
      'Tüm Gündüz & Gece Yarışları',
      'Erken Bahis & İdman Pisti Notları',
      'Bomba / Cazip Plase & İkili Tercihleri',
      'Doğrudan Yönetici İletişim Önceliği',
    ],
  },
  {
    id: 'monthly',
    name: 'Aylık VIP',
    price: 1750,
    durationDays: 30,
    badge: 'Maksimum Avantaj 👑',
    features: [
      '30 Gün Kesintisiz VIP Prestij',
      'Tüm Türkiye & Yabancı Hipodrom Analizleri',
      'Grup Koşuları ve Büyük Kupalar Özel Bülteni',
      'Yüksek Kazanç Odaklı Misli Altılı Kuponları',
      '7/24 Kesintisiz Yönetici Desteği',
    ],
  },
];

export const VipModal: React.FC<VipModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#161412] via-[#0E0E10] to-[#080809] border border-[#D4AF37]/30 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-[#D4AF37]/20 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 border border-neutral-700 text-gray-400 hover:text-white hover:border-[#D4AF37] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-[#D4AF37]/30 text-amber-300 text-xs font-bold tracking-wider uppercase mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Müslüm VIP Üyelik Paketleri
          </div>
          <h2 className="cinzel text-2xl sm:text-3xl font-extrabold gold-gradient-text tracking-wide mb-2">
            Kazanmaya VIP ile Başlayın
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Ücretsiz tahmin verilmemektedir. Bütün altılı şablonları, günün sarsılmaz bankoları ve idman pisti analizleri yalnızca aktif VIP üyelerimize özeldir.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {PLANS.map(plan => {
            const isFeatured = plan.id === 'weekly';
            const isMonthly = plan.id === 'monthly';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-[#2A2312] via-[#1A160F] to-[#0E0E10] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 scale-100 md:-translate-y-2'
                    : 'bg-[#121214] border border-neutral-800 hover:border-[#D4AF37]/50'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md ${
                        isFeatured
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black'
                          : isMonthly
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white'
                          : 'bg-neutral-800 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mt-2 mb-3">
                    <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-800 text-amber-200">
                      {plan.durationDays} Gün
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold gold-gradient-text cinzel">
                        {plan.price.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-sm font-bold text-amber-200/80">TL</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {plan.durationDays === 1 ? 'Tek seferlik 24 saat erişim' : `${plan.durationDays} gün boyunca geçerli`}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 text-xs text-gray-300">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                    isFeatured
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black hover:brightness-110 shadow-amber-500/25'
                      : 'bg-neutral-900 border border-[#D4AF37]/50 text-amber-300 hover:bg-[#D4AF37] hover:text-black hover:border-transparent'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>IBAN ile Satın Al</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Security & Bank Notice */}
        <div className="mt-8 pt-5 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ödemeler yalnızca resmi IBAN üzerinden havale/FAST ile yapılır.</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300/80">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Yönetici onayı ile VIP süreniz derhal başlatılır.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
