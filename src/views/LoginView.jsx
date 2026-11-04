import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Warehouse, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginView() {
  const { login, loginAsDemo, authError, setAuthError } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(username, password);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700/30 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Col: Hero Branding */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-400/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-6 shadow-inner">
              <Warehouse className="w-8 h-8 text-sky-300" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/30 text-xs font-semibold text-sky-200 tracking-wider uppercase mb-3">
              Warehouse Management System
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-3">
              SIM Gudang Pro
            </h1>
            <p className="text-sm text-sky-100/90 leading-relaxed">
              Platform modern manajemen pergudangan terintegrasi: pantau stok real-time, catat barang masuk, barang keluar, dan cetak dokumen resmi operasional.
            </p>
          </div>

          <div className="relative z-10 my-8 space-y-3">
            <div className="flex items-center gap-3 text-xs text-sky-100 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Validasi stok otomatis anti-minus barang keluar</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-sky-100 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Notifikasi dini stok menipis & habis (Safety Stock)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-sky-100 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cetak Surat Jalan & Bukti Penerimaan Barang</span>
            </div>
          </div>

          <div className="relative z-10 text-xs text-sky-200/60 font-mono">
            Versi 2.4.0 • Enterprise Edition
          </div>
        </div>

        {/* Right Col: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Masuk ke Sistem</h2>
              <p className="text-sm text-slate-500 mt-1">
                Silakan masukkan kredensial akun Anda untuk mengakses dashboard gudang.
              </p>
            </div>

            {authError && (
              <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{authError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Masukkan username Anda"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/30 transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Login Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
                Pilih Akses Cepat Demo (1-Click)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loginAsDemo('admin')}
                  className="p-2.5 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors group"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                  <span>Admin Gudang</span>
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemo('staff')}
                  className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors group"
                >
                  <User className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Staff Gudang</span>
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemo('supervisor')}
                  className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors group"
                >
                  <Warehouse className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span>Kepala Gudang</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-3">
                Kredensial demo: username <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">admin</code> / password <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">password123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

