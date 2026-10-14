import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Upload, AlertCircle, ShieldCheck, Clock, ArrowRight, Building, User, FileText, Image as ImageIcon, Lock } from 'lucide-react';
import { VipPlanId } from '../types';
import { useAuth } from '../context/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  planId: VipPlanId;
  onClose: () => void;
  onSuccess: () => void;
  onRequireAuth: () => void;
}

const PLAN_DETAILS: Record<VipPlanId, { name: string; price: number; days: number }> = {
  daily: { name: 'Günlük VIP', price: 100, days: 1 },
  weekly: { name: 'Haftalık VIP', price: 600, days: 7 },
  monthly: { name: 'Aylık VIP', price: 1750, days: 30 },
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  planId,
  onClose,
  onSuccess,
  onRequireAuth,
}) => {
  const { user, token, bankSettings } = useAuth();

  const [senderName, setSenderName] = useState('');
  const [note, setNote] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate a memorable reference code when opened
  useEffect(() => {
    if (isOpen) {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const code = `MSL-${randNum}`;
      setReferenceCode(code);
      setIsSubmitted(false);
      setError(null);
      if (user) {
        setSenderName(user.name);
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const currentPlan = PLAN_DETAILS[planId] || PLAN_DETAILS.weekly;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('Dekont görseli en fazla 8MB olabilir.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      onRequireAuth();
      return;
    }

    if (!senderName.trim()) {
      setError('Lütfen havale/FAST yapan kişinin Adını ve Soyadını yazınız.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/payments/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId,
          senderName: senderName.trim(),
          referenceCode,
          receiptDataUrl: receiptImage || undefined,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ödeme bildirimi gönderilemedi.');
      }

      setIsSubmitted(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const bankName = bankSettings?.bankName || 'Ziraat Bankası';
  const iban = bankSettings?.iban || 'TR33 0001 0000 0000 0000 0000 01';
  const accountHolder = bankSettings?.accountHolder || 'Müslüm Altınar';
  const bankNote = bankSettings?.note || 'Havale/FAST açıklama kısmına referans kodunu yazınız.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#181613] via-[#0E0E10] to-[#0A0A0B] border border-[#D4AF37]/40 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-[#D4AF37]/20 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-neutral-700 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-emerald-400 stroke-[3]" />
            </div>

            <h3 className="cinzel text-2xl font-bold text-white mb-2">
              Ödeme Bildiriminiz Alındı!
            </h3>

            <div className="max-w-md mx-auto bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 text-left my-5 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-gray-400">Paket:</span>
                <span className="font-bold text-amber-300">{currentPlan.name} ({currentPlan.days} Gün)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-gray-400">Tutar:</span>
                <span className="font-bold text-white">{currentPlan.price.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-gray-400">Referans Kodu:</span>
                <span className="font-mono font-bold text-amber-400">{referenceCode}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Durum:</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  Yönetici Kontrolünde ⏳
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed mb-6">
              Ödemeniz yönetici tarafından gerçek banka hesabımızdan teyit edilecektir. Onaylandığı an VIP erişim süreniz başlatılacaktır.
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
            >
              Tamam, Kapat
            </button>
          </div>
        ) : !user ? (
          /* GUEST / NOT LOGGED IN: IBAN IS STRICTLY HIDDEN */
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-bold uppercase mb-2 border border-amber-500/20">
                <Building className="w-3 h-3 text-amber-400" />
                VIP Paket Satın Alımı
              </div>
              <h2 className="cinzel text-xl sm:text-2xl font-bold text-white">
                {currentPlan.name} Seçildi
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-2xl font-extrabold gold-gradient-text cinzel">
                  {currentPlan.price.toLocaleString('tr-TR')} TL
                </span>
                <span className="text-xs text-gray-400">({currentPlan.days} Gün Süre)</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/90 border border-amber-500/30 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="cinzel text-lg sm:text-xl font-bold text-white">
                  IBAN Bilgileri Yalnızca Üyelerimize Açıktır
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                  Banka hesap numarası, IBAN ve ödeme referans kodunu görüntüleyebilmek için lütfen önce üye girişi yapınız.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onRequireAuth}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <User className="w-4 h-4" />
                  <span>Giriş Yap veya Ücretsiz Üye Ol</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-400">
                🔒 Kayıt olmak 10 saniye sürer ve tamamen ücretsizdir.
              </p>
            </div>
          </div>
        ) : (
          /* USER LOGGED IN: SHOW FULL IBAN DETAILS & PAYMENT NOTIFICATION FORM */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-bold uppercase mb-2 border border-amber-500/20">
                <Building className="w-3 h-3 text-amber-400" />
                IBAN ile Havale / FAST Ödemesi
              </div>
              <h2 className="cinzel text-xl sm:text-2xl font-bold text-white">
                {currentPlan.name} Satın Alımı
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold gold-gradient-text cinzel">
                  {currentPlan.price.toLocaleString('tr-TR')} TL
                </span>
                <span className="text-xs text-gray-400">({currentPlan.days} Gün Süre)</span>
              </div>
            </div>

            {/* IBAN DISPLAY CARD */}
            <div className="bg-neutral-900/90 rounded-2xl p-4 sm:p-5 border border-[#D4AF37]/30 space-y-3 mb-6 shadow-inner">
              {/* Bank & Holder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-neutral-800 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px] mb-0.5">Banka Adı</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    {bankName}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[11px] mb-0.5">Hesap Sahibi</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(accountHolder, 'holder')}
                      className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1"
                    >
                      {copiedField === 'holder' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'holder' ? 'Kopyalandı' : 'Kopyala'}
                    </button>
                  </div>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    {accountHolder}
                  </span>
                </div>
              </div>

              {/* IBAN Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-gray-400">IBAN Numarası</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(iban, 'iban')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-neutral-800 px-2 py-0.5 rounded"
                  >
                    {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'iban' ? 'IBAN Kopyalandı' : 'IBAN Kopyala'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-neutral-800 font-mono text-sm sm:text-base font-bold text-amber-200 tracking-wider flex items-center justify-between">
                  <span>{iban}</span>
                </div>
              </div>

              {/* Unique Reference Code */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-amber-400" />
                    Açıklama (Referans) Kodu:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(referenceCode, 'code')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded"
                  >
                    {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'code' ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 font-mono text-base font-black text-amber-400 tracking-widest text-center">
                  {referenceCode}
                </div>
                <p className="text-[10px] text-amber-200/70 mt-1 leading-relaxed">
                  ⚠️ <strong>Önemli:</strong> Banka havalesi yaparken açıklama kısmına yalnızca bu referans kodunu yazınız.
                </p>
              </div>

              {bankNote && (
                <div className="text-[11px] text-gray-400 pt-1 italic">
                  Not: {bankNote}
                </div>
              )}
            </div>

            {/* PAYMENT NOTIFICATION FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Sender Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Havale Yapan Adı Soyadı <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="Banka hesabınızdaki ad ve soyad"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Receipt File Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Dekont Ekran Görüntüsü veya Fotoğrafı <span className="text-gray-400 font-normal">(Önerilir)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-dashed border-neutral-700 hover:border-amber-400/60 transition-colors text-xs text-gray-300">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{receiptImage ? 'Dekont Değiştir' : 'Dekont Seç / Fotoğraf Yükle'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {receiptImage && (
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-amber-400/50 shrink-0">
                      <img src={receiptImage} alt="Dekont" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReceiptImage(null)}
                        className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Ek Açıklama veya İletişim Notu <span className="text-gray-400 font-normal">(Opsiyonel)</span>
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Örn: Saat 15:40'ta Garanti'den gönderildi"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ödeme Bildirimini Gönder</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-gray-400">
                🔒 Bildiriminiz ardından yönetici gerçek banka hesabını inceleyip VIP sürenizi başlatır.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
