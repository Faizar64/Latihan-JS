import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Menu,
  Bell,
  Search,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Clock,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

export default function Navbar({
  currentTab,
  setCurrentTab,
  setIsMobileOpen,
  onOpenAddItem,
  onOpenAddIn,
  onOpenAddOut,
}) {
  const { user } = useAuth();
  const { items } = useWarehouse();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lowStockItems = items.filter((i) => i.stock <= i.minStock);

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Menu Utama (Dashboard)', subtitle: 'Ringkasan operasional pergudangan real-time' };
      case 'persediaan':
        return { title: 'Data Persediaan (Master Barang)', subtitle: 'Katalog stok, lokasi rak, dan level inventaris' };
      case 'masuk':
        return { title: 'Barang Masuk (Inbound)', subtitle: 'Penerimaan stok dari supplier dan pencatatan faktur' };
      case 'keluar':
        return { title: 'Barang Keluar (Outbound)', subtitle: 'Pengeluaran stok ke divisi dan penerbitan surat jalan' };
      case 'laporan':
        return { title: 'Laporan & Mutasi Stok', subtitle: 'Audit pergerakan barang dan rekapitulasi inventaris' };
      default:
        return { title: 'Sistem Informasi Pergudangan', subtitle: 'WMS Pro' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Right side: Time, Quick Actions, Alerts, Profile */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full font-mono">
          <Clock className="w-3.5 h-3.5 text-brand-600" />
          <span>
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onOpenAddIn}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Barang Masuk</span>
          </button>
          <button
            onClick={onOpenAddOut}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <ArrowUpFromLine className="w-3.5 h-3.5" />
            <span>Barang Keluar</span>
          </button>
          <button
            onClick={onOpenAddItem}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Barang</span>
          </button>
        </div>

        {/* Low Stock Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsAlertOpen(!isAlertOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200/60 transition-colors"
            title="Peringatan Stok Gudang"
          >
            <Bell className="w-5 h-5" />
            {lowStockItems.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-ping" />
            )}
            {lowStockItems.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Alert Popover */}
          {isAlertOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-slide-down">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-sm text-slate-800">Peringatan Stok Menipis</h4>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {lowStockItems.length} Barang
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto my-2">
                {lowStockItems.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Semua stok barang dalam kondisi aman.
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentTab('persediaan');
                        setIsAlertOpen(false);
                      }}
                      className="py-2.5 px-1 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-xs text-slate-900">{item.name}</span>
                        <span className="font-mono text-[11px] text-slate-400">{item.sku}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-xs">
                        <span className="text-slate-500">Sisa: <strong className={item.stock === 0 ? 'text-red-600' : 'text-amber-600'}>{item.stock} {item.unit}</strong></span>
                        <span className="text-slate-400">Min: {item.minStock} {item.unit}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {lowStockItems.length > 0 && (
                <button
                  onClick={() => {
                    setCurrentTab('persediaan');
                    setIsAlertOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-xl transition-colors"
                >
                  Buka Data Persediaan Lengkap &rarr;
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-none">{user?.name}</div>
            <div className="text-[10px] text-slate-400 font-medium">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

