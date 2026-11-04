import React, { useState, useMemo } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  Edit,
  Trash2,
  QrCode,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  PackageCheck,
  PackageX,
  FileSpreadsheet,
} from 'lucide-react';
import {
  formatNumber,
  formatRupiah,
  formatDate,
  getStockStatus,
} from '../utils/formatters';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';
import BarcodeModal from '../components/BarcodeModal';

export default function PersediaanView({
  onOpenAddItem,
  onOpenEditItem,
  onQuickAddStock,
  onQuickIssueStock,
}) {
  const { items, categories, deleteItem } = useWarehouse();

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // ALL, SAFE, LOW, OUT

  // Selected item for barcode preview
  const [barcodeItem, setBarcodeItem] = useState(null);

  // Filtered Items computation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search text match
      const query = searchTerm.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      // Category match
      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      // Status match
      let matchStatus = true;
      if (selectedStatus === 'SAFE') {
        matchStatus = item.stock > item.minStock;
      } else if (selectedStatus === 'LOW') {
        matchStatus = item.stock > 0 && item.stock <= item.minStock;
      } else if (selectedStatus === 'OUT') {
        matchStatus = item.stock === 0;
      }

      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, searchTerm, selectedCategory, selectedStatus]);

  // Statistics counters
  const safeCount = items.filter((i) => i.stock > i.minStock).length;
  const lowCount = items.filter((i) => i.stock > 0 && i.stock <= i.minStock).length;
  const outCount = items.filter((i) => i.stock === 0).length;

  const handleExportCSV = () => {
    const exportData = filteredItems.map((item, idx) => ({
      No: idx + 1,
      'Kode SKU': item.sku,
      'Nama Barang': item.name,
      Kategori: item.category,
      Satuan: item.unit,
      'Stok Saat Ini': item.stock,
      'Stok Minimum': item.minStock,
      'Lokasi Rak': item.location,
      'Harga Satuan (IDR)': item.unitPrice || 0,
      'Total Nilai (IDR)': item.stock * (item.unitPrice || 0),
      Status:
        item.stock === 0
          ? 'Habis'
          : item.stock <= item.minStock
          ? 'Menipis'
          : 'Aman',
    }));
    exportToCSV('Data_Persediaan_Gudang', exportData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedStatus('ALL')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === 'ALL'
              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wider opacity-80">
            Total Semua SKU
          </div>
          <div className="text-xl font-bold mt-1">{items.length} Barang</div>
        </button>

        <button
          onClick={() => setSelectedStatus('SAFE')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === 'SAFE'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wider opacity-80">
            Stok Kondisi Aman
          </div>
          <div className="text-xl font-bold mt-1 text-emerald-600 group-hover:text-white">
            {safeCount} Barang
          </div>
        </button>

        <button
          onClick={() => setSelectedStatus('LOW')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === 'LOW'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wider opacity-80">
            Stok Menipis
          </div>
          <div className="text-xl font-bold mt-1 text-amber-600">
            {lowCount} Barang
          </div>
        </button>

        <button
          onClick={() => setSelectedStatus('OUT')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === 'OUT'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs font-medium uppercase tracking-wider opacity-80">
            Habis (Kosong)
          </div>
          <div className="text-xl font-bold mt-1 text-rose-600">
            {outCount} Barang
          </div>
        </button>
      </div>

      {/* Control Bar: Search, Category Filter, Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama barang, kode SKU, atau lokasi rak..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        {/* Filter Category */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50/50 hover:bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-xs"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>

          <button
            onClick={() => triggerPrint()}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-xs"
            title="Cetak Tabel"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button
            onClick={onOpenAddItem}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Barang</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider font-bold text-slate-600">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Kode SKU</th>
                <th className="py-3.5 px-4">Nama Barang & Kategori</th>
                <th className="py-3.5 px-4">Lokasi Rak</th>
                <th className="py-3.5 px-4 text-center">Stok / Min</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Harga Satuan</th>
                <th className="py-3.5 px-4 text-right">Nilai Total</th>
                <th className="py-3.5 px-4 text-center">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <Boxes className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada data barang yang cocok.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba ganti kata kunci pencarian atau bersihkan filter kategori.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => {
                  const status = getStockStatus(item.stock, item.minStock);
                  const totalValue = item.stock * (item.unitPrice || 0);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center text-xs text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {item.sku}
                          </span>
                          <button
                            onClick={() => setBarcodeItem(item)}
                            className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                            title="Lihat & Cetak Barcode Rak"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                          {item.description && (
                            <span className="text-xs text-slate-400 truncate max-w-xs">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                          {item.location}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="font-extrabold text-sm text-slate-900">
                          {formatNumber(item.stock)}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            {item.unit}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Min: {item.minStock} {item.unit}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                          {status.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right text-xs font-medium text-slate-600">
                        {formatRupiah(item.unitPrice)}
                      </td>

                      <td className="py-3.5 px-4 text-right text-xs font-bold text-slate-900">
                        {formatRupiah(totalValue)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Quick Add In */}
                          <button
                            onClick={() => onQuickAddStock(item)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Tambah Barang Masuk (Restock)"
                          >
                            <ArrowDownToLine className="w-4 h-4" />
                          </button>

                          {/* Quick Issue Out */}
                          <button
                            onClick={() => onQuickIssueStock(item)}
                            disabled={item.stock === 0}
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title={
                              item.stock === 0
                                ? 'Stok kosong, tidak bisa dikeluarkan'
                                : 'Catat Barang Keluar'
                            }
                          >
                            <ArrowUpFromLine className="w-4 h-4" />
                          </button>

                          {/* Edit Item */}
                          <button
                            onClick={() => onOpenEditItem(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Edit Data Barang"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Hapus Barang"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Menampilkan <strong className="text-slate-800">{filteredItems.length}</strong> dari{' '}
            <strong className="text-slate-800">{items.length}</strong> total jenis barang
          </div>
          <div>
            Perkiraan Total Valuasi Persediaan:{' '}
            <strong className="text-slate-900 text-sm font-bold">
              {formatRupiah(
                filteredItems.reduce((acc, i) => acc + i.stock * (i.unitPrice || 0), 0)
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* Barcode & Label Modal */}
      <BarcodeModal
        isOpen={!!barcodeItem}
        onClose={() => setBarcodeItem(null)}
        item={barcodeItem}
      />
    </div>
  );
}

