import React from 'react';
import { Trophy, Crown, Receipt, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenVip: () => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenMyPayments: () => void;
  onOpenAdmin: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenVip,
  onOpenAuth,
  onOpenAccount,
  onOpenMyPayments,
  onOpenAdmin,
}) => {
  const { user, isAdmin, isVip } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/95 backdrop-blur-xl border-t border-[#D4AF37]/25 safe-pb">
      <div className={`grid ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'} h-16 items-center px-1`}>
        {/* Koşular */}
        <button
          onClick={() => onSelectTab('races')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentTab === 'races' ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Koşular</span>
        </button>

        {/* VIP Satın Al */}
        <button
          onClick={onOpenVip}
          className="flex flex-col items-center justify-center gap-1 relative group"
        >
          <div className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-tr from-[#885A13] via-[#D4AF37] to-[#F3E5AB] p-0.5 shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center transform active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#0E0E10] rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <span className={`text-[10px] font-bold ${isVip ? 'text-amber-300' : 'text-amber-400'}`}>
            VIP Üyelik
          </span>
        </button>

        {/* Ödemelerim / Bildirim */}
        <button
          onClick={() => {
            if (!user) {
              onOpenAuth();
            } else {
              onOpenMyPayments();
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentTab === 'payments' ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Bildirim</span>
        </button>

        {/* Yönetici (SADECE YETKİLİ YÖNETİCİYE GÖRÜNÜR) */}
        {isAdmin && (
          <button
            onClick={onOpenAdmin}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              currentTab === 'admin' ? 'text-[#D4AF37]' : 'text-amber-500 hover:text-amber-400'
            }`}
          >
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300">Yönetim</span>
          </button>
        )}

        {/* Profil / Giriş */}
        <button
          onClick={() => {
            if (user) {
              onOpenAccount();
            } else {
              onOpenAuth();
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            user ? 'text-amber-300' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] font-semibold">
            {user ? 'Hesabım' : 'Giriş'}
          </span>
        </button>
      </div>
    </div>
  );
};
