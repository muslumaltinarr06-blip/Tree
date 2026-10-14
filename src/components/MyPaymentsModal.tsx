import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, XCircle, RefreshCw, AlertCircle, FileText, Calendar, Plus } from 'lucide-react';
import { PaymentRequest } from '../types';
import { useAuth } from '../context/AuthContext';

interface MyPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewPayment: () => void;
}

export const MyPaymentsModal: React.FC<MyPaymentsModalProps> = ({
  isOpen,
  onClose,
  onNewPayment,
}) => {
  const { token, refreshUser, isVip, getVipCountdownText } = useAuth();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const fetchPayments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/payments/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchPayments();
      refreshUser();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#181613] via-[#0E0E10] to-[#0A0A0B] border border-[#D4AF37]/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-[#D4AF37]/20 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h2 className="cinzel text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Ödeme Bildirimlerim</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              IBAN bildirimleriniz ve VIP onay durumunuz
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchPayments();
                refreshUser();
              }}
              title="Yenile"
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-amber-300"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current VIP status card */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/20 border border-[#D4AF37]/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">Üyelik Durumunuz:</span>
            <span className={`text-sm font-bold ${isVip ? 'text-amber-300' : 'text-gray-300'}`}>
              {isVip ? `👑 Aktif (${getVipCountdownText()})` : '🔒 VIP Üyeliğiniz Bulunmuyor'}
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              onNewPayment();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black text-xs font-bold shadow-md hover:brightness-110"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Ödeme Yap</span>
          </button>
        </div>

        {/* Payments List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading && payments.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Yükleniyor...
            </div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs bg-neutral-900/40 rounded-2xl border border-neutral-800 p-6">
              <FileText className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-300">Henüz bir ödeme bildiriminiz bulunmuyor.</p>
              <p className="text-gray-500 mt-1">
                VIP tahminlerimize erişmek için paket seçip IBAN havale bildirimi yapabilirsiniz.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNewPayment();
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs"
              >
                VIP Paketlerini İncele
              </button>
            </div>
          ) : (
            payments.map(p => {
              const isPending = p.status === 'pending';
              const isApproved = p.status === 'approved';
              const isRejected = p.status === 'rejected';

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{p.planName}</span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/50 text-amber-300 border border-amber-500/20">
                        {p.referenceCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold">
                      {isPending && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          Onay Bekliyor
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Onaylandı (VIP Aktif)
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Reddedildi
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-400 pt-1">
                    <div>
                      <span className="block text-gray-500">Tutar:</span>
                      <span className="font-bold text-white">{p.amount.toLocaleString('tr-TR')} TL</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Gönderen:</span>
                      <span className="font-semibold text-gray-200 truncate block">{p.senderName}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Tarih:</span>
                      <span className="text-gray-300">
                        {new Date(p.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {p.receiptDataUrl && (
                      <div>
                        <span className="block text-gray-500">Dekont:</span>
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(p.receiptDataUrl!)}
                          className="text-amber-400 hover:underline font-semibold"
                        >
                          Görüntüle 🔍
                        </button>
                      </div>
                    )}
                  </div>

                  {p.adminNote && (
                    <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-gray-300">
                      <span className="text-amber-400 font-bold">Yönetici Notu: </span>
                      {p.adminNote}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Receipt Image Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-lg max-h-[85vh] bg-neutral-900 p-2 rounded-2xl border border-neutral-700">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedReceipt}
                alt="Dekont Detayı"
                className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
