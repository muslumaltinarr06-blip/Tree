import React, { useState, useEffect } from 'react';
import {
  Shield,
  CreditCard,
  Trophy,
  Users,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Eye,
  AlertCircle,
  Building,
  Save,
  X,
  Crown,
  Search,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PaymentRequest, RaceDay, RaceLeg, BankSettings, User } from '../types';
import { useAuth } from '../context/AuthContext';

interface AdminPanelProps {
  onBackToApp: () => void;
}

const HIPODROMLAR = [
  'İstanbul Veliefendi Hipodromu',
  'Adana Yeşiloba Hipodromu',
  'Ankara 75. Yıl Hipodromu',
  'İzmir Şirinyer Hipodromu',
  'Bursa Osmangazi Hipodromu',
  'Kocaeli Kartepe Hipodromu',
  'Antalya Hipodromu',
  'Diyarbakır Hipodromu',
  'Elazığ Hipodromu',
  'Şanlıurfa Hipodromu',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToApp }) => {
  const { user, token, isAdmin, refreshBankSettings } = useAuth();

  const [activeTab, setActiveTab] = useState<'payments' | 'races' | 'users' | 'bank'>('payments');
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);

  // Payments State
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Races State
  const [races, setRaces] = useState<RaceDay[]>([]);
  const [editingRace, setEditingRace] = useState<RaceDay | null>(null);
  const [isRaceModalOpen, setIsRaceModalOpen] = useState<boolean>(false);

  // Users State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');
  const [customDateUserId, setCustomDateUserId] = useState<string | null>(null);
  const [customDateValue, setCustomDateValue] = useState<string>('');

  // Bank Settings State
  const [bankForm, setBankForm] = useState<BankSettings>({
    bankName: '',
    iban: '',
    accountHolder: '',
    note: '',
    updatedAt: 0,
  });

  // Notification message
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPayments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRaces = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/races', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRaces(data.races || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBank = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/settings/bank', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBankForm(data.bankSettings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAdmin && token) {
      fetchStats();
      fetchPayments();
      fetchRaces();
      fetchUsers();
      fetchBank();
    }
  }, [isAdmin, token]);

  const { login, logout } = useAuth();
  const [adminEmailInput, setAdminEmailInput] = useState('muslumaltinarr06@gmail.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginError(null);

    const res = await login(adminEmailInput, adminPasswordInput);
    setAdminLoginLoading(false);

    if (!res.success) {
      setAdminLoginError(res.error || 'Geçersiz yönetici bilgileri.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-b from-[#181612] via-[#0E0E10] to-[#080809] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#D4AF37]/20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <Shield className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-bold uppercase mb-2 border border-amber-500/20">
              <Crown className="w-3 h-3 text-amber-400" />
              Özel Yönetici Portalı
            </div>
            <h2 className="cinzel text-xl sm:text-2xl font-bold text-white">
              Müslüm VIP Yönetici Girişi
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Bu alan yalnızca yetkili sistem yöneticisine özeldir.
            </p>
          </div>

          {adminLoginError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Yönetici E-posta
              </label>
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={e => setAdminEmailInput(e.target.value)}
                placeholder="muslumaltinarr06@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Yönetici Şifresi
              </label>
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={e => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {adminLoginLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Yönetici Olarak Giriş Yap</span>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={onBackToApp}
              className="text-xs text-gray-400 hover:text-amber-300 transition-colors"
            >
              ← Kullanıcı / Üye Sayfasına Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Approve Payment
  const handleApprovePayment = async (id: string, days?: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/payments/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customDays: days }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(data.message || 'Ödeme onaylandı ve VIP aktif edildi.');
        fetchPayments();
        fetchStats();
        fetchUsers();
      } else {
        showMsg(data.error || 'Onaylama başarısız', 'error');
      }
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
  };

  // Handle Reject Payment
  const handleRejectPayment = async (id: string) => {
    const reason = window.prompt(
      'Reddetme nedeni (Kullanıcıya gösterilecek):',
      'Banka hesabında eşleşen ödeme tespit edilemedi.'
    );
    if (reason === null) return;

    if (!token) return;
    try {
      const res = await fetch(`/api/admin/payments/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNote: reason }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('Ödeme bildirimi reddedildi.');
        fetchPayments();
        fetchStats();
      } else {
        showMsg(data.error || 'Hata oluştu', 'error');
      }
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
  };

  // Handle Manual User VIP Modify
  const handleUserVip = async (
    userId: string,
    action: 'add' | 'revoke' | 'set_timestamp',
    payload?: number
  ) => {
    if (!token) return;
    try {
      const bodyPayload =
        action === 'set_timestamp'
          ? { action: 'set_timestamp', timestamp: payload }
          : { action, days: payload || 1 };

      const res = await fetch(`/api/admin/users/${userId}/vip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        showMsg('Kullanıcı VIP süresi güncellendi.');
        setCustomDateUserId(null);
        fetchUsers();
        fetchStats();
      }
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
  };

  // Handle Bank Save
  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/settings/bank', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bankForm),
      });
      const data = await res.json();
      if (res.ok) {
        refreshBankSettings();
        showMsg('Banka ve IBAN bilgileri başarıyla güncellendi!');
      } else {
        showMsg(data.error || 'Güncellenemedi', 'error');
      }
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
  };

  // Handle Delete Race
  const handleDeleteRace = async (id: string) => {
    if (!window.confirm('Bu yarış gününü silmek istediğinize emin misiniz?')) return;
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/races/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showMsg('Yarış günü silindi.');
        fetchRaces();
        fetchStats();
      }
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
  };

  const filteredPayments = payments.filter(p => {
    if (paymentFilter === 'all') return true;
    return p.status === paymentFilter;
  });

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  const filteredUsers = usersList.filter(u => {
    if (!userSearch.trim()) return true;
    const query = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900 border border-[#D4AF37]/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="cinzel text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Müslüm Yönetici Paneli</span>
              <span className="text-[10px] bg-[#D4AF37] text-black px-2 py-0.5 rounded-full font-black">
                YÖNETİCİ
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Yarış analizleri, IBAN ödeme onayları ve üyelik yönetimi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden md:flex flex-col text-right mr-2">
            <span className="text-xs font-bold text-amber-300">{user?.name}</span>
            <span className="text-[10px] text-gray-400 font-mono">{user?.email}</span>
          </div>
          <button
            onClick={() => {
              fetchStats();
              fetchPayments();
              fetchRaces();
              fetchUsers();
            }}
            className="p-2.5 rounded-xl bg-neutral-800 text-gray-300 hover:text-white border border-neutral-700"
            title="Verileri Yenile"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onBackToApp}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs hover:brightness-110 shadow-md flex items-center gap-1.5"
          >
            <span>👁️ Kullanıcı Sitesine Geç</span>
          </button>
          <button
            onClick={logout}
            className="px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-red-950 text-gray-300 hover:text-red-300 border border-neutral-700 text-xs font-bold transition-colors"
            title="Oturumu Kapat"
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* Message alert */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/40 text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#121214] border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Onay Bekleyen Ödeme</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {stats ? stats.pendingPaymentsCount : pendingCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121214] border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Aktif VIP Üyeler</span>
            <Crown className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats ? stats.activeVipCount : 0}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121214] border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Toplam Kayıtlı Üye</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats ? stats.totalUsers : usersList.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121214] border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Toplam Tahsilat (TL)</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {stats ? stats.totalRevenue.toLocaleString('tr-TR') : 0} TL
          </div>
        </div>
      </div>

      {/* ADMIN TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('payments')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'payments'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'bg-neutral-900 text-gray-300 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Ödeme Bildirimleri</span>
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-black">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('races')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'races'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'bg-neutral-900 text-gray-300 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Yarış & Tahmin Yönetimi</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-amber-300">
            {races.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'users'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'bg-neutral-900 text-gray-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kullanıcılar & VIP Süreleri</span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'bank'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'bg-neutral-900 text-gray-300 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Banka & IBAN Ayarları</span>
        </button>
      </div>

      {/* TAB 1: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <button
                onClick={() => setPaymentFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  paymentFilter === 'pending'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Onay Bekleyenler ({pendingCount})
              </button>
              <button
                onClick={() => setPaymentFilter('approved')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  paymentFilter === 'approved'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Onaylananlar
              </button>
              <button
                onClick={() => setPaymentFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  paymentFilter === 'rejected'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reddedilenler
              </button>
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  paymentFilter === 'all'
                    ? 'bg-neutral-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tümü ({payments.length})
              </button>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="py-16 text-center text-gray-400 bg-neutral-900/60 rounded-3xl border border-neutral-800">
              <CreditCard className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-300">Bu filtrede ödeme bildirimi bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map(p => {
                const isPending = p.status === 'pending';

                return (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{p.userName}</span>
                        <span className="text-xs text-gray-400">({p.userEmail})</span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black text-amber-300 border border-amber-500/20">
                          {p.referenceCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-amber-300">
                          {p.planName} • {p.amount.toLocaleString('tr-TR')} TL
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            p.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : p.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {p.status === 'pending' ? '⏳ Onay Bekliyor' : p.status === 'approved' ? '✓ Onaylandı' : '✕ Reddedildi'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-300">
                      <div>
                        <span className="text-gray-500 block text-[11px]">Havale Gönderen:</span>
                        <strong className="text-white">{p.senderName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[11px]">Bildirim Tarihi:</span>
                        <span>{new Date(p.createdAt).toLocaleString('tr-TR')}</span>
                      </div>
                      {p.receiptDataUrl && (
                        <div>
                          <span className="text-gray-500 block text-[11px]">Dekont Görseli:</span>
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(p.receiptDataUrl!)}
                            className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Dekontu İncele
                          </button>
                        </div>
                      )}
                    </div>

                    {p.note && (
                      <div className="p-2.5 rounded-xl bg-black/40 text-xs text-gray-400">
                        <span className="text-amber-400 font-semibold">Kullanıcı Notu: </span>
                        {p.note}
                      </div>
                    )}

                    {p.adminNote && (
                      <div className="p-2.5 rounded-xl bg-neutral-950 text-xs text-gray-400">
                        <span className="text-red-400 font-semibold">Yönetici Notu: </span>
                        {p.adminNote}
                      </div>
                    )}

                    {/* Pending Actions */}
                    {isPending && (
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRejectPayment(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-red-950 text-red-300 text-xs font-bold border border-red-500/30 transition-colors"
                        >
                          Reddet
                        </button>
                        <button
                          onClick={() => handleApprovePayment(p.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Dekontu Onayla ve VIP Başlat</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RACES & TIPS MANAGEMENT */}
      {activeTab === 'races' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="cinzel text-lg font-bold text-white">
                Yarış Günleri, Koşular ve VIP Analizleri
              </h3>
              <p className="text-xs text-gray-400">
                Yeni yarış günü ekleyin, atları, bankoları ve tahmin yazılarını düzenleyin.
              </p>
            </div>
            <button
              onClick={() => {
                const today = new Date();
                const dateStr = today.toISOString().split('T')[0];
                const displayDate = today.toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  weekday: 'long',
                });
                setEditingRace({
                  id: '',
                  date: dateStr,
                  displayDate,
                  hipodrom: 'İstanbul Veliefendi Hipodromu',
                  city: 'İstanbul',
                  title: 'İstanbul Veliefendi Altılı Ganyan VIP Analizi',
                  isFeatured: true,
                  status: 'live',
                  altiliGanyanSummary: {
                    programNumber: 1,
                    estimatedCost: '240 TL',
                    couponFormula: '1-3-4 // 2 (BANKO) // 5 // 1-2-6 // 4-7 // 3-8-9',
                    summaryNote: 'Günün en sağlam bankosu 2. ayakta bulunmaktadır.',
                  },
                  races: [
                    {
                      id: `leg_${Date.now()}_1`,
                      legNumber: 1,
                      raceNumber: 3,
                      raceTime: '15:30',
                      title: 'Handikap 16 / Sentetik',
                      distanceAndTrack: '1400m Sentetik',
                      altiliLeg: true,
                      horses: [
                        {
                          number: 1,
                          name: 'RÜZGAR GÜLÜ',
                          jockey: 'Ahmet Çelik',
                          weight: '58 kg',
                          form: '1-2-1',
                          odds: '2.40',
                          isBanko: true,
                          notes: 'Pist ve mesafede çok güçlü.',
                        },
                        {
                          number: 2,
                          name: 'KUZEY YILDIZI',
                          jockey: 'Gökhan Kocakaya',
                          weight: '56 kg',
                          form: '2-1-3',
                          odds: '3.10',
                          isSurprise: false,
                        },
                      ],
                      recommendedPicks: [1, 2],
                      expertAnalysis: 'Bu koşuda 1 RÜZGAR GÜLÜ formunun zirvesindedir. GÜNÜN BANKOSU.',
                    },
                  ],
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                });
                setIsRaceModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs hover:brightness-110 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Yarış Günü Ekle</span>
            </button>
          </div>

          <div className="space-y-3">
            {races.map(race => (
              <div
                key={race.id}
                className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-1">
                    <span>{race.displayDate}</span>
                    <span>•</span>
                    <span>{race.hipodrom}</span>
                  </div>
                  <h4 className="font-bold text-base text-white">{race.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>{race.races.length} Koşu / Ayak</span>
                    <span>•</span>
                    <span>Kupon: {race.altiliGanyanSummary?.estimatedCost || 'Belirtilmedi'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingRace(JSON.parse(JSON.stringify(race)));
                      setIsRaceModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-neutral-800 text-amber-300 text-xs font-bold hover:bg-neutral-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => handleDeleteRace(race.id)}
                    className="p-2 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900/60"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USERS & VIP EXPIRATION MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="cinzel text-lg font-bold text-white">
                Kayıtlı Üyeler ve VIP Süre Yönetimi
              </h3>
              <p className="text-xs text-gray-400">
                Süresi biten üyelerin VIP erişimi otomatik olarak kilitlenir. Dilediğiniz üyeye manuel süre tanımlayabilir veya iptal edebilirsiniz.
              </p>
            </div>

            {/* User Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="İsim veya e-posta ara..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-black/60 text-gray-400 border-b border-neutral-800 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3.5">Kullanıcı</th>
                  <th className="p-3.5">E-posta</th>
                  <th className="p-3.5">Yetki Rolü</th>
                  <th className="p-3.5">VIP Durumu</th>
                  <th className="p-3.5">Bitiş Tarihi & Saati</th>
                  <th className="p-3.5 text-right">VIP Süre Yönetimi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredUsers.map(u => {
                  const vipDateStr = u.vipUntil
                    ? new Date(u.vipUntil).toLocaleString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'VIP Yok';

                  return (
                    <tr key={u.id} className="hover:bg-neutral-800/30">
                      <td className="p-3.5 font-bold text-white">{u.name}</td>
                      <td className="p-3.5 font-mono text-gray-400">{u.email}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-[#D4AF37] text-black'
                              : 'bg-neutral-800 text-gray-300'
                          }`}
                        >
                          {u.role === 'admin' ? 'YÖNETİCİ' : 'Üye'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.isVip
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-neutral-800 text-gray-400'
                          }`}
                        >
                          {u.isVip ? '✓ Aktif VIP' : 'Süresi Doldu / Pasif'}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-amber-300">
                        {u.role === 'admin' ? 'Sınırsız (Admin)' : vipDateStr}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {u.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleUserVip(u.id, 'add', 1)}
                              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-amber-900/60 text-amber-300 text-[10px] font-bold"
                            >
                              +1 Gün
                            </button>
                            <button
                              onClick={() => handleUserVip(u.id, 'add', 7)}
                              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-amber-900/60 text-amber-300 text-[10px] font-bold"
                            >
                              +7 Gün
                            </button>
                            <button
                              onClick={() => handleUserVip(u.id, 'add', 30)}
                              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-amber-900/60 text-amber-300 text-[10px] font-bold"
                            >
                              +30 Gün
                            </button>
                            <button
                              onClick={() => {
                                setCustomDateUserId(u.id);
                                const defaultVal = u.vipUntil
                                  ? new Date(u.vipUntil).toISOString().slice(0, 16)
                                  : new Date(Date.now() + 86400000).toISOString().slice(0, 16);
                                setCustomDateValue(defaultVal);
                              }}
                              className="px-2 py-1 rounded-lg bg-blue-950/60 text-blue-300 hover:bg-blue-900 text-[10px] font-bold"
                            >
                              Özel Tarih
                            </button>
                            {u.isVip && (
                              <button
                                onClick={() => handleUserVip(u.id, 'revoke', 0)}
                                className="px-2 py-1 rounded-lg bg-red-950/60 text-red-300 hover:bg-red-900 text-[10px] font-bold"
                              >
                                İptal Et
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Custom Date Picker Modal */}
          {customDateUserId && (
            <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm">VIP Bitiş Tarihini Ayarlayın</h4>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tarih ve Saat Seçiniz:</label>
                  <input
                    type="datetime-local"
                    value={customDateValue}
                    onChange={e => setCustomDateValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setCustomDateUserId(null)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 text-gray-300 text-xs"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={() => {
                      const ts = new Date(customDateValue).getTime();
                      if (ts) {
                        handleUserVip(customDateUserId, 'set_timestamp', ts);
                      }
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs"
                  >
                    Tarihi Uygula
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BANK & IBAN SETTINGS */}
      {activeTab === 'bank' && (
        <div className="max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-7 space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase mb-2 border border-amber-500/20">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              Banka & IBAN Yapılandırması
            </div>
            <h3 className="cinzel text-xl font-bold text-white">
              Ödeme ve IBAN Bilgilerini Güncelle
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Burada güncelleyeceğiniz IBAN ve hesap bilgileri, tüm kullanıcıların paket satın alma ekranında anında görünür.
            </p>
          </div>

          <form onSubmit={handleSaveBank} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Banka Adı
              </label>
              <input
                type="text"
                required
                value={bankForm.bankName}
                onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })}
                placeholder="Örn: Ziraat Bankası, Garanti BBVA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                IBAN Numarası
              </label>
              <input
                type="text"
                required
                value={bankForm.iban}
                onChange={e => setBankForm({ ...bankForm, iban: e.target.value })}
                placeholder="TR33 0001 0000 0000 0000 0000 01"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 font-mono text-amber-300 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Hesap Sahibi Adı Soyadı
              </label>
              <input
                type="text"
                required
                value={bankForm.accountHolder}
                onChange={e => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                placeholder="Müslüm Altınar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Açıklama / Havale Talimat Notu
              </label>
              <textarea
                rows={3}
                value={bankForm.note}
                onChange={e => setBankForm({ ...bankForm, note: e.target.value })}
                placeholder="Havale yaparken açıklama kısmına referans kodunu yazınız..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Banka Bilgilerini Kaydet</span>
            </button>
          </form>
        </div>
      )}

      {/* FULL RACE & PREDICTIONS EDITOR MODAL */}
      {isRaceModalOpen && editingRace && (
        <FullRaceEditorModal
          race={editingRace}
          onClose={() => setIsRaceModalOpen(false)}
          onSave={async savedRace => {
            if (!token) return;
            try {
              let res;
              if (savedRace.id) {
                res = await fetch(`/api/admin/races/${savedRace.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify(savedRace),
                });
              } else {
                res = await fetch('/api/admin/races', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify(savedRace),
                });
              }

              if (res.ok) {
                showMsg('Yarış günü ve koşu analizleri başarıyla kaydedildi.');
                setIsRaceModalOpen(false);
                fetchRaces();
                fetchStats();
              }
            } catch (e: any) {
              showMsg(e.message, 'error');
            }
          }}
        />
      )}

      {/* Receipt Viewer */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-xl max-h-[85vh] bg-neutral-900 p-2 rounded-2xl border border-neutral-700">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedReceipt}
              alt="Dekont"
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// FULL RACE & PREDICTIONS EDITOR WITH INTERACTIVE HORSE BUILDER
interface FullRaceEditorModalProps {
  race: RaceDay;
  onClose: () => void;
  onSave: (race: RaceDay) => void;
}

const FullRaceEditorModal: React.FC<FullRaceEditorModalProps> = ({ race, onClose, onSave }) => {
  const [formData, setFormData] = useState<RaceDay>({ ...race });
  const [activeLegIndex, setActiveLegIndex] = useState<number>(0);

  const currentLeg = formData.races[activeLegIndex];

  // Add Leg
  const handleAddLeg = () => {
    const nextLegNum = formData.races.length + 1;
    const newLeg: RaceLeg = {
      id: `leg_${Date.now()}_${nextLegNum}`,
      legNumber: nextLegNum,
      raceNumber: nextLegNum + 2,
      raceTime: '16:00',
      title: 'Handikap 15 / Sentetik',
      distanceAndTrack: '1400m Sentetik',
      altiliLeg: true,
      horses: [
        {
          number: 1,
          name: 'YENİ SAFKAN',
          jockey: 'Jokey Adı',
          weight: '58 kg',
          isBanko: false,
          isSurprise: false,
        },
      ],
      recommendedPicks: [1],
      expertAnalysis: '',
    };
    const updated = [...formData.races, newLeg];
    setFormData({ ...formData, races: updated });
    setActiveLegIndex(updated.length - 1);
  };

  // Remove Leg
  const handleRemoveLeg = (idx: number) => {
    if (formData.races.length <= 1) {
      alert('En az 1 koşu bulunmalıdır.');
      return;
    }
    const updated = [...formData.races];
    updated.splice(idx, 1);
    setFormData({ ...formData, races: updated });
    setActiveLegIndex(Math.max(0, idx - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-[#D4AF37]/50 rounded-3xl p-4 sm:p-7 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h3 className="cinzel text-lg sm:text-xl font-bold text-white">
              {formData.id ? 'Yarış Gününü & Analizlerini Düzenle' : 'Yeni Yarış Günü & Bülten Ekle'}
            </h3>
            <p className="text-[11px] text-gray-400">
              Koşuları, ayakları, kupon şablonunu ve VIP analiz yazılarını yönetin.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-neutral-800 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-6 my-4 pr-1">
          {/* Section 1: Main Race Day Info */}
          <div className="p-4 rounded-2xl bg-black/40 border border-neutral-800 space-y-3">
            <span className="text-xs font-bold text-amber-300 block uppercase">1. Yarış Günü ve Hipodrom Bilgileri</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Hipodrom</label>
                <input
                  list="hipodrom-list"
                  type="text"
                  value={formData.hipodrom}
                  onChange={e => setFormData({ ...formData, hipodrom: e.target.value })}
                  placeholder="İstanbul Veliefendi Hipodromu"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
                <datalist id="hipodrom-list">
                  {HIPODROMLAR.map(h => (
                    <option key={h} value={h} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Şehir</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="İstanbul"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Tarih</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => {
                    const d = new Date(e.target.value);
                    const display = d.toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      weekday: 'long',
                    });
                    setFormData({ ...formData, date: e.target.value, displayDate: display });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1">Bülten / Yarış Başlığı</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="İstanbul Veliefendi Altılı Ganyan VIP Analizi"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>

          {/* Section 2: Altılı Ganyan Kupon Şablonu */}
          <div className="p-4 rounded-2xl bg-black/40 border border-neutral-800 space-y-3">
            <span className="text-xs font-bold text-amber-300 block uppercase">2. Altılı Ganyan Kupon Şablonu</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Kupon Şablonu (Ayaklar)</label>
                <input
                  type="text"
                  value={formData.altiliGanyanSummary?.couponFormula || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      altiliGanyanSummary: {
                        programNumber: formData.altiliGanyanSummary?.programNumber || 1,
                        estimatedCost: formData.altiliGanyanSummary?.estimatedCost || '240 TL',
                        summaryNote: formData.altiliGanyanSummary?.summaryNote || '',
                        couponFormula: e.target.value,
                      },
                    })
                  }
                  placeholder="2-4-5 // 1 (BANKO) // 3-7-8 // ..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-amber-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Tahmini Kupon Tutarı</label>
                <input
                  type="text"
                  value={formData.altiliGanyanSummary?.estimatedCost || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      altiliGanyanSummary: {
                        couponFormula: formData.altiliGanyanSummary?.couponFormula || '',
                        programNumber: formData.altiliGanyanSummary?.programNumber || 1,
                        summaryNote: formData.altiliGanyanSummary?.summaryNote || '',
                        estimatedCost: e.target.value,
                      },
                    })
                  }
                  placeholder="320,00 TL"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-gray-400 mb-1">Kupon Strateji ve VIP Notu</label>
              <input
                type="text"
                value={formData.altiliGanyanSummary?.summaryNote || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    altiliGanyanSummary: {
                      couponFormula: formData.altiliGanyanSummary?.couponFormula || '',
                      programNumber: formData.altiliGanyanSummary?.programNumber || 1,
                      estimatedCost: formData.altiliGanyanSummary?.estimatedCost || '240 TL',
                      summaryNote: e.target.value,
                    },
                  })
                }
                placeholder="Günün en sağlam bankosu 4. ayaktaki safkandır..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
              />
            </div>
          </div>

          {/* Section 3: Legs (Koşular) Management */}
          <div className="p-4 rounded-2xl bg-black/40 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase">
                3. Koşular & Ayaklar ({formData.races.length})
              </span>
              <button
                type="button"
                onClick={handleAddLeg}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-amber-300 text-xs font-bold hover:bg-neutral-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Yeni Koşu/Ayak Ekle</span>
              </button>
            </div>

            {/* Legs Nav Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {formData.races.map((leg, lIdx) => {
                const isActive = activeLegIndex === lIdx;
                return (
                  <button
                    key={leg.id || lIdx}
                    type="button"
                    onClick={() => setActiveLegIndex(lIdx)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#D4AF37] text-black shadow-md'
                        : 'bg-neutral-900 border border-neutral-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    {leg.legNumber}. Ayak ({leg.raceNumber}. Koşu)
                  </button>
                );
              })}
            </div>

            {/* Current Active Leg Form */}
            {currentLeg && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="font-bold text-amber-400 text-sm">
                    {currentLeg.legNumber}. Ayak ({currentLeg.raceNumber}. Koşu) Düzenleniyor
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLeg(activeLegIndex)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Koşuyu Sil</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-gray-400 mb-1">Koşu No</label>
                    <input
                      type="number"
                      value={currentLeg.raceNumber}
                      onChange={e => {
                        const updated = [...formData.races];
                        updated[activeLegIndex].raceNumber = Number(e.target.value);
                        setFormData({ ...formData, races: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Saat</label>
                    <input
                      type="text"
                      value={currentLeg.raceTime}
                      onChange={e => {
                        const updated = [...formData.races];
                        updated[activeLegIndex].raceTime = e.target.value;
                        setFormData({ ...formData, races: updated });
                      }}
                      placeholder="15:30"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Mesafe ve Pist</label>
                    <input
                      type="text"
                      value={currentLeg.distanceAndTrack}
                      onChange={e => {
                        const updated = [...formData.races];
                        updated[activeLegIndex].distanceAndTrack = e.target.value;
                        setFormData({ ...formData, races: updated });
                      }}
                      placeholder="1400m Sentetik"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Koşu Başlığı / Şartı</label>
                    <input
                      type="text"
                      value={currentLeg.title}
                      onChange={e => {
                        const updated = [...formData.races];
                        updated[activeLegIndex].title = e.target.value;
                        setFormData({ ...formData, races: updated });
                      }}
                      placeholder="Handikap 16 / DHT"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                </div>

                {/* DETAYLI VIP ANALİZ METNİ */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-amber-300 font-bold text-xs">
                    Koşu Detaylı VIP Analiz Yazısı (Taktik & Tahmin Yorumu)
                  </label>
                  <textarea
                    rows={3}
                    value={currentLeg.expertAnalysis}
                    onChange={e => {
                      const updated = [...formData.races];
                      updated[activeLegIndex].expertAnalysis = e.target.value;
                      setFormData({ ...formData, races: updated });
                    }}
                    placeholder="Temponun yüksek başlayacağı bu koşuda viraj dönülürken ön grupta yerini alacak safkanlar..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400">
            Toplam {formData.races.length} Koşu • {formData.hipodrom}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-gray-300 text-xs font-bold hover:bg-neutral-700"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => onSave(formData)}
              className="px-6 py-2 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs shadow-md hover:brightness-110"
            >
              Yarış ve Analizleri Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
