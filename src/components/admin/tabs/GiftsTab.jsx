import { CreditCard, Gift, Home, Plus, Trash2 } from 'lucide-react';

export const GiftsTab = ({ config, updateSection }) => {
  const gift = config.gift || { accounts: [], physicalGift: {} };
  const accounts = gift.accounts || [];
  const physicalGift = gift.physicalGift || {};

  const handleToggleGift = (enabled) => {
    updateSection('gift', { enabled });
  };

  const handleAccountChange = (index, field, value) => {
    const updated = [...accounts];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('gift', { accounts: updated });
  };

  const handleAddAccount = () => {
    const newAccount = {
      id: `bank-${Date.now()}`,
      bankName: 'BCA',
      accountNumber: '',
      accountHolder: config.bride?.fullName || '',
    };
    updateSection('gift', { accounts: [...accounts, newAccount] });
  };

  const handleDeleteAccount = (index) => {
    const updated = accounts.filter((_, i) => i !== index);
    updateSection('gift', { accounts: updated });
  };

  const handlePhysicalGiftChange = (field, value) => {
    updateSection('gift', {
      physicalGift: {
        ...physicalGift,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <span>Amplop Digital & Kado Pernikahan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola nomor rekening bank, e-wallet, serta alamat tujuan pengiriman
            kado fisik.
          </p>
        </div>

        {/* Saklar Utama Fitur Hadiah */}
        <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <input
            type="checkbox"
            checked={Boolean(gift.enabled)}
            onChange={(e) => handleToggleGift(e.target.checked)}
            className="w-4 h-4 text-gold rounded border-slate-300 focus:ring-gold"
          />
          <span className="text-xs font-bold text-slate-700">
            {gift.enabled ? 'Fitur Hadiah Aktif' : 'Fitur Hadiah Nonaktif'}
          </span>
        </label>
      </div>

      {gift.enabled && (
        <>
          {/* DAFTAR REKENING BANK / E-WALLET */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gold" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Rekening Bank & E-Wallet ({accounts.length})
                </h4>
              </div>

              <button
                type="button"
                onClick={handleAddAccount}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 text-primary hover:bg-gold hover:text-white border border-gold/40 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Rekening</span>
              </button>
            </div>

            {accounts.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                Belum ada rekening yang ditambahkan. Klik tombol "Tambah
                Rekening" di atas.
              </p>
            ) : (
              <div className="space-y-3">
                {accounts.map((acc, idx) => (
                  <div
                    key={acc.id || idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:flex-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Nama Bank / E-Wallet:
                        </label>
                        <input
                          type="text"
                          value={acc.bankName || ''}
                          onChange={(e) =>
                            handleAccountChange(idx, 'bankName', e.target.value)
                          }
                          placeholder="BCA / Mandiri / GoPay"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Nomor Rekening:
                        </label>
                        <input
                          type="text"
                          value={acc.accountNumber || ''}
                          onChange={(e) =>
                            handleAccountChange(
                              idx,
                              'accountNumber',
                              e.target.value,
                            )
                          }
                          placeholder="1234567890"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white text-slate-800 focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Atas Nama (Card Holder):
                        </label>
                        <input
                          type="text"
                          value={acc.accountHolder || ''}
                          onChange={(e) =>
                            handleAccountChange(
                              idx,
                              'accountHolder',
                              e.target.value,
                            )
                          }
                          placeholder="Nama Pemilik Rekening"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAccount(idx)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                      title="Hapus Rekening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KADO FISIK / PENGIRIMAN PAKET */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gold" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Kirim Kado Fisik
                </h4>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(physicalGift.enabled)}
                  onChange={(e) =>
                    handlePhysicalGiftChange('enabled', e.target.checked)
                  }
                  className="w-4 h-4 text-gold rounded border-slate-300 focus:ring-gold"
                />
                <span className="text-xs font-semibold text-slate-600">
                  {physicalGift.enabled ? 'Aktif' : 'Nonaktif'}
                </span>
              </label>
            </div>

            {physicalGift.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Penerima Paket:
                  </label>
                  <input
                    type="text"
                    value={physicalGift.recipientName || ''}
                    onChange={(e) =>
                      handlePhysicalGiftChange('recipientName', e.target.value)
                    }
                    placeholder="Destia & Raka"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Telepon / WhatsApp Penerima:
                  </label>
                  <input
                    type="text"
                    value={physicalGift.phone || ''}
                    onChange={(e) =>
                      handlePhysicalGiftChange('phone', e.target.value)
                    }
                    placeholder="0812-3456-7890"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Pengiriman:
                  </label>
                  <textarea
                    rows={2}
                    value={physicalGift.address || ''}
                    onChange={(e) =>
                      handlePhysicalGiftChange('address', e.target.value)
                    }
                    placeholder="Jl. Kemang Selatan No. 20, RT 05 / RW 02, Jakarta Selatan 12730"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
