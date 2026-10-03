import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useState } from 'react';
import { useWedding } from '../../../context/WeddingContext';
import { parseDisplayName } from '../../../services/rsvpService';

export const WishesTab = () => {
  const { wishes, isLoadingWishes, loadWishes, deleteWish, clearAllWishes } =
    useWedding();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Perhitungan statistik
  const totalWishes = wishes.length;
  const hadirCount = wishes.filter(
    (w) => w.attendance === 'hadir' || w.attendance === 'yes',
  ).length;
  const tidakHadirCount = wishes.filter(
    (w) => w.attendance === 'tidak_hadir' || w.attendance === 'no',
  ).length;
  const totalPax = wishes.reduce((sum, w) => {
    if (w.attendance === 'hadir' || w.attendance === 'yes') {
      return sum + (Number(w.guestsCount) || 1);
    }
    return sum;
  }, 0);

  const handleDeleteOne = async (wishId) => {
    if (window.confirm('Yakin ingin menghapus ucapan ini?')) {
      setIsDeleting(true);
      try {
        await deleteWish(wishId);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleClearAll = async () => {
    setIsDeleting(true);
    try {
      await clearAllWishes();
      setShowClearConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            <span>Buku Tamu, Doa & Ucapan RSVP</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau konfirmasi kehadiran tamu dan pesan doa secara langsung dari
            database Supabase Cloud.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadWishes}
            disabled={isLoadingWishes}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingWishes ? 'animate-spin text-amber-500' : 'text-slate-500'}`}
            />
            <span>Refresh</span>
          </button>

          {totalWishes > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              disabled={isDeleting}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Semua</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL KONFIRMASI BERSIHKAN SEMUA */}
      {showClearConfirm && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-rose-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              Apakah Anda yakin ingin menghapus{' '}
              <strong>seluruh {totalWishes} ucapan</strong> dari database?
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isDeleting}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              Ya, Hapus Semua
            </button>
          </div>
        </div>
      )}

      {/* KARTU STATISTIK RINGKAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              Total Ucapan
            </span>
            <span className="text-lg font-bold text-slate-800">
              {totalWishes}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              Konfirmasi Hadir
            </span>
            <span className="text-lg font-bold text-emerald-600">
              {hadirCount}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              Tidak Hadir
            </span>
            <span className="text-lg font-bold text-rose-600">
              {tidakHadirCount}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              Estimasi Tamu
            </span>
            <span className="text-lg font-bold text-sky-600">
              {totalPax} Pax
            </span>
          </div>
        </div>
      </div>

      {/* DAFTAR UCAPAN */}
      <div className="space-y-3">
        {isLoadingWishes ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
            <RefreshCw className="w-7 h-7 text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              Memuat data ucapan dari Supabase...
            </p>
          </div>
        ) : totalWishes === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-2.5 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Buku Tamu Bersih & Siap Digunakan
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Semua ucapan contoh/dummy sudah dibersihkan. Setiap ucapan dan
              konfirmasi kehadiran baru yang dikirimkan tamu dari halaman
              undangan akan otomatis masuk ke sini secara real-time.
            </p>
          </div>
        ) : (
          wishes.map((w, idx) => {
            const { personName, groupBadge } = parseDisplayName(w.name);
            return (
              <div
                key={w.id || idx}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {personName}
                    </span>
                    {groupBadge && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <Users className="w-2.5 h-2.5 text-amber-600" />
                        <span>{groupBadge}</span>
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.attendance === 'hadir' || w.attendance === 'yes'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {w.attendance === 'hadir' || w.attendance === 'yes'
                        ? `Hadir (${w.guestsCount || 1} Pax)`
                        : 'Tidak Hadir'}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {w.timestamp || 'Baru saja'}
                    </span>
                  </div>

                  {w.message && (
                    <p className="text-xs text-slate-600 italic whitespace-pre-wrap leading-relaxed">
                      "{w.message}"
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteOne(w.id)}
                  disabled={isDeleting}
                  title="Hapus ucapan ini"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
