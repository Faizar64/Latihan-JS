import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWarehouse } from '../context/WarehouseContext';
import {
  LayoutDashboard,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileSpreadsheet,
  LogOut,
  RotateCcw,
  Warehouse,
  AlertTriangle,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, isMobileOpen, setIsMobileOpen }) {
  const { user, logout } = useAuth();
  const { items, resetToDefaultData } = useWarehouse();

  // Count items with low stock or out of stock
  const lowStockCount = items.filter((i) => i.stock <= i.minStock).length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Menu Utama',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Ringkasan & Metrik',
    },
    {
      id: 'persediaan',
      label: 'Data Persediaan',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} Alert` : `${items.length}`,
      badgeType: lowStockCount > 0 ? 'warning' : 'default',
      desc: 'Master Barang & Stok',
    },
    {
      id: 'masuk',
      label: 'Barang Masuk',
      icon: ArrowDownToLine,
      badge: null,
      desc: 'Penerimaan / Inbound',
    },
    {
      id: 'keluar',
      label: 'Barang Keluar',
      icon: ArrowUpFromLine,
      badge: null,
      desc: 'Pengeluaran / Outbound',
    },
    {
      id: 'laporan',
      label: 'Laporan & Mutasi',
      icon: FileSpreadsheet,
      badge: null,
      desc: 'Kartu Stok & Audit',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Warehouse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                WMS GUDANG <span className="text-xs bg-brand-500 text-white px-1.5 py-0.5 rounded font-mono">PRO</span>
              </h1>
              <p className="text-xs text-slate-400">Sistem Inventory Terpadu</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi Utama
          </div>

          {menuItems.map((menu) => {
            const Icon = menu.icon;
            const isActive = currentTab === menu.id;

            return (
              <button
                key={menu.id}
                onClick={() => {
                  setCurrentTab(menu.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'
                    }`}
                  />
                  <div>
                    <div>{menu.label}</div>
                    <div className={`text-[11px] ${isActive ? 'text-brand-100' : 'text-slate-500'}`}>
                      {menu.desc}
                    </div>
                  </div>
                </div>

                {menu.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      menu.badgeType === 'warning'
                        ? isActive
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                        : isActive
                        ? 'bg-brand-700 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {menu.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Manajemen Data
          </div>

          <button
            onClick={resetToDefaultData}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-lg object-cover ring-2 ring-brand-500/50"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
              <div className="text-xs text-brand-400 flex items-center gap-1 truncate">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{user?.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}

