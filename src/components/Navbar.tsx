import React from 'react';
import { Crown, Shield, LogIn, User as UserIcon, LogOut, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenVip: () => void;
  onOpenAdmin: () => void;
  onOpenMyPayments: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenAccount,
  onOpenVip,
  onOpenAdmin,
  onOpenMyPayments,
  currentTab,
  onSelectTab,
}) => {
  const { user, isVip, isAdmin, logout, getVipCountdownText } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-[#D4AF37]/20 safe-pt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('races')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#2A2415] via-[#1A1812] to-[#0A0A0B] border border-[#D4AF37]/50 flex items-center justify-center shadow-lg shadow-[#D4AF37]/10 group-hover:border-[#D4AF37] transition-all">
            <span className="text-xl sm:text-2xl transform group-hover:scale-110 transition-transform">🏇</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-black stroke-[3]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="cinzel text-xl sm:text-2xl font-bold tracking-wider gold-gradient-text">
                MÜSLÜM
              </h1>
              <span className="text-[10px] tracking-widest font-extrabold uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black">
                VIP
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-amber-200/60 font-medium tracking-wide">
              At Yarışı & Altılı Tahminleri
            </p>
          </div>
        </div>

        {/* Desktop Navigation / Status */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onSelectTab('races')}
            className={`text-sm font-semibold transition-colors ${
              currentTab === 'races' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-white'
            }`}
          >
            Günün Koşuları
          </button>

          <button
            onClick={onOpenVip}
            className="flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            VIP Paketleri
          </button>

          {user && (
            <button
              onClick={onOpenMyPayments}
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Ödemelerim & Bildirimler
            </button>
          )}

          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'admin'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-600/40 hover:bg-amber-900/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Yönetici Paneli
            </button>
          )}
        </div>

        {/* Right Action / Auth & VIP Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* VIP Badge */}
          {user && (
            <div
              onClick={onOpenVip}
              className={`cursor-pointer px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all ${
                isVip
                  ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-400/10'
                  : 'bg-red-950/40 text-red-300 border border-red-500/30 hover:border-amber-400/50'
              }`}
            >
              {isVip ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">VIP Aktif:</span>
                  <span className="text-amber-200">{getVipCountdownText()}</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>VIP Aktif Değil</span>
                </>
              )}
            </div>
          )}

          {/* User Button / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAccount}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-[#D4AF37]/50 text-left transition-all"
                title="Hesap Bilgilerim"
              >
                <div className="w-6 h-6 rounded-lg bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-200 truncate max-w-[120px]">{user.name}</span>
                  <span className="text-[10px] text-amber-300/80">{user.role === 'admin' ? 'Yönetici' : 'Hesabım'}</span>
                </div>
              </button>
              <button
                onClick={logout}
                title="Çıkış Yap"
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-red-400 hover:border-red-900/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Giriş Yap</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
