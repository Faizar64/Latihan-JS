import React, { useState, useMemo } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Package,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
} from 'lucide-react';
import {
  formatNumber,
  formatRupiah,
  getStockStatus,
} from '../utils/formatters';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';

export default function LaporanMutasiView() {
  const { items, transactionsIn, transactionsOut, categories } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Compute mutations per item
  const mutationReport = useMemo(() => {
    return items
      .map((item) => {
        const itemIns = transactionsIn.filter((t) => t.itemId === item.id || t.itemSku === item.sku);
        const itemOuts = transactionsOut.filter((t) => t.itemId === item.id || t.itemSku === item.sku);

        const totalIn = itemIns.reduce((sum, t) => sum + (Number(t.qty) || 0), 0);
        const totalOut = itemOuts.reduce((sum, t) => sum + (Number(t.qty) || 0), 0);
        const totalValue = item.stock * (item.unitPrice || 0);

        return {
          ...item,
          totalIn,
          totalOut,
          txCountIn: itemIns.length,
          txCountOut: itemOuts.length,
          totalValue,
        };
      })
      .filter((row) => {
        const q = searchTerm.toLowerCase();
        const matchSearch =
          row.name.toLowerCase().includes(q) ||
          row.sku.toLowerCase().includes(q) ||
          row.category.toLowerCase().includes(q);

        const matchCat = selectedCategory === 'ALL' || row.category === selectedCategory;

        return matchSearch && matchCat;
      });
  }, [items, transactionsIn, transactionsOut, searchTerm, selectedCategory]);

  const totalAllIn = mutationReport.reduce((acc, i) => acc + i.totalIn, 0);
  const totalAllOut = mutationReport.reduce((acc, i) => acc + i.totalOut, 0);
  const totalAllCurrentStock = mutationReport.reduce((acc, i) => acc + i.stock, 0);
  const totalAllValue = mutationReport.reduce((acc, i) => acc + i.totalValue, 0);

  const handleExportCSV = () => {
    const exportData = mutationReport.map((m, idx) => ({
      No: idx + 1,
      'Kode SKU': m.sku,
      'Nama Barang': m.name,
      Kategori: m.category,
      Satuan: m.unit,
      'Total Masuk': m.totalIn,
      'Total Keluar': m.totalOut,
      'Stok Akhir': m.stock,
      'Stok Minimum': m.minStock,
      'Harga Satuan (IDR)': m.unitPrice || 0,
      'Nilai Persediaan (IDR)': m.totalValue,
      Status: m.stock === 0 ? 'Habis' : m.stock <= m.minStock ? 'Menipis' : 'Aman',
    }));
    exportToCSV('Laporan_Mutasi_Stok_Gudang', exportData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-brand-600" />
            <span>Laporan Rekapitulasi & Mutasi Stok Gudang</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Data audit pergerakan akumulatif barang masuk, barang keluar, dan sisa stok fisik saat ini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Unduh Laporan CSV</span>
          </button>
          <button
            onClick={() => triggerPrint()}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan Audit</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold uppercase text-slate-400">Total Akumulasi Masuk</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            +{formatNumber(totalAllIn)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Semua item terfilter</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold uppercase text-slate-400">Total Akumulasi Keluar</div>
          <div className="text-2xl font-black text-purple-600 mt-1">
            -{formatNumber(totalAllOut)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Semua item terfilter</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold uppercase text-slate-400">Sisa Stok Fisik Akhir</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatNumber(totalAllCurrentStock)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Tersedia di rak gudang</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold uppercase text-slate-400">Total Valuasi Aset</div>
          <div className="text-2xl font-black text-brand-700 mt-1">
            {formatRupiah(totalAllValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Nilai perolehan barang</div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Saring nama barang atau SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white text-slate-700 font-medium"
        >
          <option value="ALL">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Main Mutasi Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-600">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Kode SKU</th>
                <th className="py-3 px-4">Nama Barang & Kategori</th>
                <th className="py-3 px-4 text-center">Satuan</th>
                <th className="py-3 px-4 text-right bg-emerald-50/50 text-emerald-800">
                  Total Masuk (+)
                </th>
                <th className="py-3 px-4 text-right bg-purple-50/50 text-purple-800">
                  Total Keluar (-)
                </th>
                <th className="py-3 px-4 text-right bg-slate-100 font-extrabold text-slate-900">
                  Stok Akhir
                </th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Nilai Persediaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {mutationReport.map((m, idx) => {
                const status = getStockStatus(m.stock, m.minStock);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-xs text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800">
                      {m.sku}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-400">{m.category}</div>
                    </td>

                    <td className="py-3 px-4 text-center text-xs text-slate-600">
                      {m.unit}
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-emerald-700 bg-emerald-50/20">
                      +{formatNumber(m.totalIn)}
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-purple-700 bg-purple-50/20">
                      -{formatNumber(m.totalOut)}
                    </td>

                    <td className="py-3 px-4 text-right font-black text-slate-900 bg-slate-50/60">
                      {formatNumber(m.stock)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${status.badgeClass}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatRupiah(m.totalValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-900">
                <td colSpan="4" className="py-3.5 px-4 text-right uppercase tracking-wider">
                  Total Rekapitulasi:
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-700">
                  +{formatNumber(totalAllIn)}
                </td>
                <td className="py-3.5 px-4 text-right text-purple-700">
                  -{formatNumber(totalAllOut)}
                </td>
                <td className="py-3.5 px-4 text-right font-black text-slate-900">
                  {formatNumber(totalAllCurrentStock)}
                </td>
                <td className="py-3.5 px-4"></td>
                <td className="py-3.5 px-4 text-right font-extrabold text-brand-700">
                  {formatRupiah(totalAllValue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

