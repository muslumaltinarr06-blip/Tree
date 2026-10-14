import React from 'react';
import { X, User, Mail, Crown, Clock, Calendar, ShieldCheck, LogOut, Sparkles, ChevronRight, Receipt, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVip: () => void;
  onOpenMyPayments: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onOpenVip,
  onOpenMyPayments,
}) => {
  const { user, isVip, isAdmin, logout, getVipCountdownText } = useAuth();

  if (!isOpen || !user) return null;

  const vipEndDateStr = user.vipUntil
    ? new Date(user.vipUntil).toLocaleString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const planName =
    user.vipPlan === 'monthly'
      ? 'Aylık VIP (30 Gün)'
      : user.vipPlan === 'weekly'
      ? 'Haftalık VIP (7 Gün)'
      : user.vipPlan === 'daily'
      ? 'Günlük VIP (1 Gün)'
      : 'Standart Üyelik';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181613] via-[#0E0E10] to-[#0A0A0B] border border-[#D4AF37]/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-[#D4AF37]/20 my-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-neutral-700 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Avatar Profile */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-neutral-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-[#121214] rounded-2xl flex items-center justify-center font-bold text-xl text-amber-300 cinzel">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="overflow-hidden">
            <h3 className="font-extrabold text-lg text-white truncate">{user.name}</h3>
            <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* VIP Membership Status Card */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            isVip
              ? 'bg-gradient-to-br from-[#241E10] via-[#15130D] to-[#0E0E10] border-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/15'
              : 'bg-neutral-900/90 border-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Üyelik Durumu
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                isVip
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-sm'
                  : 'bg-neutral-800 text-gray-400'
              }`}
            >
              {isVip ? 'VIP AKTİF 👑' : 'VIP DEĞİL'}
            </span>
          </div>

          {isVip ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span className="text-gray-400">Paket:</span>
                <span className="font-bold text-white">{planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span className="text-gray-400">Kalan Süre:</span>
                <span className="font-bold text-amber-300">{getVipCountdownText()}</span>
              </div>
              {vipEndDateStr && !isAdmin && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Bitiş Tarihi:</span>
                  <span className="text-gray-200 font-semibold">{vipEndDateStr}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-300 leading-relaxed">
                VIP tahminlere, günün banko safkanlarına ve altılı kupon şablonlarına erişiminiz şu an kapalıdır.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVip();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>VIP Üyeliği Başlat (100 TL'den Başlayan)</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenVip();
            }}
            className="w-full p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/50 text-left text-xs font-semibold text-gray-200 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>VIP Paketlerini İncele</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-300 transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenMyPayments();
            }}
            className="w-full p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37]/50 text-left text-xs font-semibold text-gray-200 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>Ödeme ve Dekont Bildirimlerim</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-300 transition-colors" />
          </button>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            🔒 Oturumunuz açık kalacaktır
          </span>
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
