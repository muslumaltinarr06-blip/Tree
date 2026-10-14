import React, { useState, useEffect } from 'react';
import { Crown, Lock, MapPin, Calendar, Zap, Ticket } from 'lucide-react';
import { RaceDay } from '../types';
import { useAuth } from '../context/AuthContext';

interface RaceViewProps {
  onOpenVip: () => void;
  onOpenAuth: () => void;
}

export const RaceView: React.FC<RaceViewProps> = ({ onOpenVip, onOpenAuth }) => {
  const { user, isVip } = useAuth();
  const [races, setRaces] = useState<RaceDay[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRaces = async () => {
    try {
      const token = localStorage.getItem('muslum_vip_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/races', { headers });
      if (res.ok) {
        const data = await res.json();
        setRaces(data.races || []);
        if (data.races && data.races.length > 0 && !selectedRaceId) {
          setSelectedRaceId(data.races[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch races:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaces();
  }, [user, isVip]);

  const currentRace = races.find(r => r.id === selectedRaceId) || races[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-r from-[#18150E] via-[#0E0E10] to-[#12110D] p-5 sm:p-8 shadow-2xl shadow-[#D4AF37]/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wider uppercase">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Müslüm VIP At Yarışı Tahminleri
            </div>
            <h1 className="cinzel text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
              Profesyonel <span className="gold-gradient-text">Altılı Ganyan</span> Kuponu & Analizleri
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Titizlikle hazırlanan idman pisti dereceleri, form analizleri ve cazip banko kupon şablonları.
              Tüm bülten ve kupon şablonları yalnızca onaylı VIP üyelerimize açıktır.
            </p>
          </div>

          {/* Action Badge */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isVip ? (
              <button
                onClick={onOpenVip}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>VIP Üyelik Başlat (100 TL'den Başlayan)</span>
              </button>
            ) : (
              <div className="px-4 py-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>VIP Erişiminiz Aktiftir</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RACETRACK / HIPODROM SELECTOR TABS */}
      {races.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {races.map(race => {
            const isSelected = race.id === selectedRaceId;
            return (
              <button
                key={race.id}
                onClick={() => {
                  setSelectedRaceId(race.id);
                }}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900/90 text-gray-300 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                <span>{race.hipodrom}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black font-extrabold' : 'bg-neutral-800 text-amber-300'}`}>
                  {race.city}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-gray-400 text-sm">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Yarış bülteni ve VIP analizler yükleniyor...
        </div>
      ) : !currentRace ? (
        <div className="py-16 text-center text-gray-400 bg-neutral-900/60 rounded-3xl border border-neutral-800">
          <Calendar className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-300">Bugün için planlanmış aktif yarış bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* CURRENT RACE DAY HEADER */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-300/80 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentRace.displayDate}</span>
                <span>•</span>
                <span>{currentRace.city}</span>
              </div>
              <h2 className="cinzel text-xl sm:text-2xl font-bold text-white">
                {currentRace.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Bülten Yayında
              </span>
            </div>
          </div>

          {/* ALTILI GANYAN SUMMARY CARD */}
          {currentRace.altiliGanyanSummary && (
            <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-b from-[#1C180F] via-[#12110D] to-[#0A0A0B] p-5 sm:p-6 shadow-xl shadow-[#D4AF37]/15">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-sm">
                    <Ticket className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="cinzel text-base sm:text-lg font-bold text-white">
                      Müslüm VIP Altılı Ganyan Şablonu
                    </h3>
                    <p className="text-[11px] text-amber-200/70">
                      Günün Tavsiye Edilen Resmi Kuponu ({currentRace.altiliGanyanSummary.programNumber}. Altılı)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Tahmini Kupon Tutarı:</span>
                  <span className="font-mono text-sm font-extrabold text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    {currentRace.altiliGanyanSummary.estimatedCost}
                  </span>
                </div>
              </div>

              {/* TICKET / FORMULA */}
              {isVip ? (
                /* UNLOCKED VIP ALTILI FORMULA */
                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-amber-300 block mb-1.5">
                      Kupon Şablonu & Ayak Sıralamaları:
                    </span>
                    <div className="p-3.5 rounded-2xl bg-black/80 border border-[#D4AF37]/40 font-mono text-xs sm:text-sm font-bold text-amber-200 tracking-wider">
                      {currentRace.altiliGanyanSummary.couponFormula}
                    </div>
                  </div>

                  {currentRace.altiliGanyanSummary.summaryNote && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/30 text-xs text-amber-200/90 leading-relaxed">
                      <strong className="text-amber-300 font-bold">VIP Notu: </strong>
                      {currentRace.altiliGanyanSummary.summaryNote}
                    </div>
                  )}
                </div>
              ) : (
                /* LOCKED VIP OVERLAY */
                <div className="mt-4 p-5 rounded-2xl bg-black/70 border border-amber-500/20 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Bu Kupon Yalnızca VIP Üyelere Özeldir
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Kupon şablonu, ayak dağılımları ve tek banko tercihlerini görmek için VIP üyeliğinizi başlatın.
                  </p>
                  <button
                    onClick={onOpenVip}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
                  >
                    VIP Üyelik Satın Al (100 TL'den Başlayan)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
