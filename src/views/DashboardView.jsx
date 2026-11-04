import React from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  PackageCheck,
  Plus,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import { formatNumber, formatRupiah, formatDateTime, getStockStatus } from '../utils/formatters';

export default function DashboardView({
  setCurrentTab,
  onOpenAddItem,
  onOpenAddIn,
  onOpenAddOut,
  onQuickAddStock,
}) {
  const { items, transactionsIn, transactionsOut, categories } = useWarehouse();

  // Computations
  const totalItemsCount = items.length;
  const totalPhysicalUnits = items.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);
  const totalInventoryValue = items.reduce(
    (sum, item) => sum + (Number(item.stock) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  const lowStockItems = items.filter((i) => i.stock <= i.minStock);
  const outOfStockItems = items.filter((i) => i.stock === 0);

  const totalInQty = transactionsIn.reduce((sum, tx) => sum + (Number(tx.qty) || 0), 0);
  const totalOutQty = transactionsOut.reduce((sum, tx) => sum + (Number(tx.qty) || 0), 0);

  // Combine recent activity
  const recentActivities = [
    ...transactionsIn.map((t) => ({ ...t, activityType: 'IN', title: 'Barang Masuk' })),
    ...transactionsOut.map((t) => ({ ...t, activityType: 'OUT', title: 'Barang Keluar' })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // Category breakdown
  const categoryStats = categories.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    const catStock = catItems.reduce((sum, i) => sum + i.stock, 0);
    const catValue = catItems.reduce((sum, i) => sum + i.stock * (i.unitPrice || 0), 0);
    return {
      name: cat,
      itemCount: catItems.length,
      totalStock: catStock,
      totalValue: catValue,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert if low stock exists */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-700 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Peringatan Level Persediaan: {lowStockItems.length} barang berada di bawah batas minimum stok!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {outOfStockItems.length > 0 && `${outOfStockItems.length} barang habis total. `}
                Segera buat order pembelian atau catat barang masuk agar operasional tidak terhenti.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('persediaan')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            <span>Tinjau Stok</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Master Barang */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Jenis Barang
            </span>
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{formatNumber(totalItemsCount)}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Terbagi dalam</span>
              <strong className="text-slate-700">{categories.length} kategori</strong>
            </div>
          </div>
        </div>

        {/* Total Unit Stok Fisik */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Kuantitas Stok
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{formatNumber(totalPhysicalUnits)}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Estimasi Nilai:</span>
              <strong className="text-emerald-700">{formatRupiah(totalInventoryValue)}</strong>
            </div>
          </div>
        </div>

        {/* Barang Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Barang Masuk (Inbound)
            </span>
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">+{formatNumber(totalInQty)}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Total</span>
              <strong className="text-sky-700">{transactionsIn.length} Dokumen Penerimaan</strong>
            </div>
          </div>
        </div>

        {/* Barang Keluar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Barang Keluar (Outbound)
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <ArrowUpFromLine className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">-{formatNumber(totalOutQty)}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Total</span>
              <strong className="text-purple-700">{transactionsOut.length} Surat Jalan Terbit</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Low Stock Action Board + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Low Stock Action Center (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Daftar Prioritas Restock Gudang</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Barang yang telah mencapai atau di bawah batas minimum
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('persediaan')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {lowStockItems.length === 0 ? (
              <div className="py-12 text-center">
                <PackageCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-slate-800">Semua Persediaan Gudang Aman</p>
                <p className="text-xs text-slate-400 mt-0.5">Tidak ada barang yang memerlukan restock mendesak.</p>
              </div>
            ) : (
              lowStockItems.slice(0, 5).map((item) => {
                const status = getStockStatus(item.stock, item.minStock);
                return (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 truncate">
                          {item.name}
                        </span>
                        <span className="font-mono text-xs text-slate-400 shrink-0">
                          {item.sku}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Lokasi: <strong className="text-slate-700">{item.location}</strong></span>
                        <span>•</span>
                        <span>Min: {item.minStock} {item.unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className={`text-sm font-bold ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                          {item.stock} {item.unit}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </div>

                      <button
                        onClick={() => onQuickAddStock(item)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                        title="Tambah stok masuk sekarang"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Restock</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Quick Action Hub & Category Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Action Hub */}
          <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg shadow-slate-900/10">
            <h3 className="text-sm font-bold tracking-tight text-white mb-1">
              Aksi Cepat Operasional
            </h3>
            <p className="text-xs text-brand-200/80 mb-4">
              Pintasan transaksi dan penambahan data gudang
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onOpenAddIn}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-start transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 mb-2">
                  <ArrowDownToLine className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Catat Barang Masuk</div>
                <div className="text-[11px] text-slate-300">Input PO/Faktur Supplier</div>
              </button>

              <button
                onClick={onOpenAddOut}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-start transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 mb-2">
                  <ArrowUpFromLine className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Catat Barang Keluar</div>
                <div className="text-[11px] text-slate-300">Terbitkan Surat Jalan</div>
              </button>

              <button
                onClick={onOpenAddItem}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-start transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-brand-500/20 text-brand-300 mb-2">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Tambah Master Barang</div>
                <div className="text-[11px] text-slate-300">Daftarkan SKU baru</div>
              </button>

              <button
                onClick={() => setCurrentTab('laporan')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-start transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 mb-2">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Laporan & Audit</div>
                <div className="text-[11px] text-slate-300">Cetak mutasi & stock card</div>
              </button>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Distribusi Stok per Kategori</span>
              <span className="text-xs font-normal text-slate-500">Unit fisik</span>
            </h3>

            <div className="space-y-3">
              {categoryStats.map((cat) => {
                const percentage =
                  totalPhysicalUnits > 0
                    ? Math.round((cat.totalStock / totalPhysicalUnits) * 100)
                    : 0;

                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 truncate pr-2">
                        {cat.name} ({cat.itemCount} item)
                      </span>
                      <span className="font-semibold text-slate-900 shrink-0">
                        {formatNumber(cat.totalStock)} unit ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Aktivitas & Log Transaksi Terkini</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aliran mutasi fisik barang masuk dan keluar secara langsung
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {recentActivities.map((act) => {
            const isEntry = act.activityType === 'IN';
            return (
              <div
                key={act.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isEntry
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-purple-50 text-purple-600 border border-purple-100'
                    }`}
                  >
                    {isEntry ? (
                      <ArrowDownToLine className="w-4 h-4" />
                    ) : (
                      <ArrowUpFromLine className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          isEntry
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {act.title}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        {act.docNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDateTime(act.date)}
                      </span>
                    </div>

                    <div className="mt-1 text-sm text-slate-800">
                      <strong className="text-slate-900">{act.itemName}</strong> ({act.itemSku})
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      {isEntry ? (
                        <>Supplier: <span className="font-medium text-slate-700">{act.supplier}</span> • Penerima: {act.receivedBy}</>
                      ) : (
                        <>Tujuan: <span className="font-medium text-slate-700">{act.recipient}</span> • Petugas: {act.issuedBy}</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:shrink-0 pl-11 sm:pl-0">
                  <div
                    className={`text-base font-extrabold ${
                      isEntry ? 'text-emerald-600' : 'text-purple-600'
                    }`}
                  >
                    {isEntry ? '+' : '-'}
                    {formatNumber(act.qty)} {act.unit}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isEntry ? 'Penambahan Stok' : 'Pengurangan Stok'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

