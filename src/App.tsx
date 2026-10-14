import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { RaceView } from './components/RaceView';
import { VipModal } from './components/VipModal';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { MyPaymentsModal } from './components/MyPaymentsModal';
import { AdminPanel } from './components/AdminPanel';
import { VipPlanId } from './types';
import { Crown, Shield, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

function AppContent() {
  const { user, isVip, isAdmin } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('races');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMyPaymentsModalOpen, setIsMyPaymentsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<VipPlanId>('weekly');

  const handleSelectPlan = (planId: VipPlanId) => {
    setSelectedPlanId(planId);
    setIsVipModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Listen to hash changes (#admin)
  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setCurrentTab('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // IF ADMIN TAB IS ACTIVE: RENDER ISOLATED EXECUTIVE ADMIN DASHBOARD
  if (currentTab === 'admin') {
    return (
      <div className="min-h-screen bg-[#080808] text-gray-100 flex flex-col">
        <AdminPanel
          onBackToApp={() => {
            setCurrentTab('races');
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
        />
      </div>
    );
  }

  // PUBLIC MEMBER & VISITOR INTERFACE (100% CLEAN OF ADMIN UI)
  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onOpenVip={() => setIsVipModalOpen(true)}
        onOpenAdmin={() => setCurrentTab('admin')}
        onOpenMyPayments={() => setIsMyPaymentsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        <RaceView
          onOpenVip={() => setIsVipModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      </main>

      {/* Floating Admin Switcher Button (ONLY visible to verified administrator) */}
      {isAdmin && (
        <button
          onClick={() => setCurrentTab('admin')}
          className="fixed bottom-20 md:bottom-6 right-4 z-40 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold text-xs shadow-2xl shadow-amber-500/40 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all border border-amber-300"
        >
          <Shield className="w-4 h-4 fill-black" />
          <span>Yönetici Paneline Geç</span>
        </button>
      )}

      {/* Luxury Footer (Clean for public) */}
      <footer className="border-t border-[#D4AF37]/15 bg-[#0A0A0C] py-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏇</span>
            <span className="cinzel font-bold text-sm gold-gradient-text">MÜSLÜM VIP</span>
            <span className="text-[10px] text-gray-500">© 2026 Tüm Hakları Saklıdır.</span>
          </div>

          <div className="flex items-center gap-6 text-gray-400">
            <button onClick={() => setIsVipModalOpen(true)} className="hover:text-amber-300 transition-colors">
              VIP Üyelik Paketleri
            </button>
            <button onClick={() => setIsMyPaymentsModalOpen(true)} className="hover:text-amber-300 transition-colors">
              Ödeme Bildirimi
            </button>
          </div>

          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yalnızca 18 yaş ve üzeri içindir. Bilgilendirme ve analiz amaçlıdır.</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (iPhone ergonomic) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        onOpenVip={() => setIsVipModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onOpenMyPayments={() => setIsMyPaymentsModalOpen(true)}
        onOpenAdmin={() => setCurrentTab('admin')}
      />

      {/* Modals */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        planId={selectedPlanId}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          // Success handled in modal view
        }}
        onRequireAuth={() => {
          setIsPaymentModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          // user logged in
        }}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onOpenVip={() => setIsVipModalOpen(true)}
        onOpenMyPayments={() => setIsMyPaymentsModalOpen(true)}
      />

      <MyPaymentsModal
        isOpen={isMyPaymentsModalOpen}
        onClose={() => setIsMyPaymentsModalOpen(false)}
        onNewPayment={() => setIsVipModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
