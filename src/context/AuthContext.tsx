import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, BankSettings } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isVip: boolean;
  isAdmin: boolean;
  loading: boolean;
  bankSettings: BankSettings | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshBankSettings: () => Promise<void>;
  getVipCountdownText: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('muslum_vip_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [bankSettings, setBankSettings] = useState<BankSettings | null>(null);

  const fetchBankSettings = useCallback(async () => {
    const currentToken = localStorage.getItem('muslum_vip_token');
    if (!currentToken) {
      setBankSettings(null);
      return;
    }

    try {
      const res = await fetch('/api/settings/bank', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBankSettings(data.bankSettings);
      } else {
        setBankSettings(null);
      }
    } catch (err) {
      console.error('Failed to fetch bank settings:', err);
      setBankSettings(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('muslum_vip_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          // Token expired
          localStorage.removeItem('muslum_vip_token');
          setToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem('muslum_vip_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Auth refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    fetchBankSettings();
  }, [refreshUser, fetchBankSettings]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Giriş yapılamadı.' };
      }

      localStorage.setItem('muslum_vip_token', data.token);
      setToken(data.token);
      setUser(data.user);
      fetchBankSettings();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Sunucuya bağlanırken hata oluştu.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Kayıt oluşturulamadı.' };
      }

      localStorage.setItem('muslum_vip_token', data.token);
      setToken(data.token);
      setUser(data.user);
      fetchBankSettings();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Sunucuya bağlanırken hata oluştu.' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem('muslum_vip_token');
    setToken(null);
    setUser(null);
  };

  const isVip = Boolean(user && (user.role === 'admin' || (user.vipUntil && user.vipUntil > Date.now())));
  const isAdmin = Boolean(user && user.role === 'admin');

  const getVipCountdownText = (): string => {
    if (!user) return 'Üye Değil';
    if (user.role === 'admin') return '👑 Yönetici (Sınırsız VIP)';
    if (!user.vipUntil || user.vipUntil <= Date.now()) return 'VIP Süresi Doldu';

    const diff = user.vipUntil - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} gün ${hours} saat kaldı`;
    }
    if (hours > 0) {
      return `${hours} saat ${minutes} dk kaldı`;
    }
    return `${minutes} dakika kaldı`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isVip,
        isAdmin,
        loading,
        bankSettings,
        login,
        register,
        logout,
        refreshUser,
        refreshBankSettings: fetchBankSettings,
        getVipCountdownText,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
