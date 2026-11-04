import React, { useState, useMemo } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  ArrowDownToLine,
  Search,
  Plus,
  Download,
  Printer,
  Trash2,
  FileText,
  Truck,
  Building,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  formatNumber,
  formatDateTime,
  formatDate,
} from '../utils/formatters';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';
import PrintDocumentModal from '../components/PrintDocumentModal';

export default function BarangMasukView({ onOpenAddIn }) {
  const { transactionsIn, deleteTransactionIn } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState('');
  const [printTx, setPrintTx] = useState(null);

  // Computations
  const totalInQty = transactionsIn.reduce((sum, tx) => sum + (Number(tx.qty) || 0), 0);
  const uniqueSuppliers = new Set(transactionsIn.map((t) => t.supplier)).size;

  // Filtered transactions
  const filteredList = useMemo(() => {
    return transactionsIn.filter((tx) => {
      const q = searchTerm.toLowerCase();
      return (
        tx.docNumber.toLowerCase().includes(q) ||
        tx.itemName.toLowerCase().includes(q) ||
        tx.itemSku.toLowerCase().includes(q) ||
        tx.supplier.toLowerCase().includes(q) ||
        tx.invoiceNumber.toLowerCase().includes(q) ||
        tx.receivedBy.toLowerCase().includes(q)
      );
    });
  }, [transactionsIn, searchTerm]);

  const handleExportCSV = () => {
    const exportData = filteredList.map((tx, idx) => ({
      No: idx + 1,
      'No Dokumen Masuk': tx.docNumber,
      'Tanggal & Jam': formatDateTime(tx.date),
      'Kode SKU': tx.itemSku,
      'Nama Barang': tx.itemName,
      'Jumlah Diterima': tx.qty,
      Satuan: tx.unit,
      'Pemasok (Supplier)': tx.supplier,
      'No Faktur / Invoice': tx.invoiceNumber,
      'Petugas Penerima': tx.receivedBy,
      Keterangan: tx.notes,
    }));
    exportToCSV('Data_Barang_Masuk', exportData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Penerimaan Masuk
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {transactionsIn.length} Dokumen
            </div>
            <div className="text-xs text-slate-500 mt-1">Tercatat dalam sistem</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowDownToLine className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Kuantitas Diterima
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              +{formatNumber(totalInQty)} Unit
            </div>
            <div className="text-xs text-slate-500 mt-1">Stok masuk bertambah</div>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pemasok / Vendor Aktif
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {uniqueSuppliers} Supplier
            </div>
            <div className="text-xs text-slate-500 mt-1">Mitra logistik pengadaan</div>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari no bukti, nama barang, SKU, supplier, atau invoice..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>

          <button
            onClick={() => triggerPrint()}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button
            onClick={onOpenAddIn}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Barang Masuk</span>
          </button>
        </div>
      </div>

      {/* Table of Incoming Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider font-bold text-slate-600">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">No. Penerimaan</th>
                <th className="py-3.5 px-4">Tanggal & Jam</th>
                <th className="py-3.5 px-4">Barang Diterima</th>
                <th className="py-3.5 px-4 text-right">Jumlah Masuk</th>
                <th className="py-3.5 px-4">Pemasok / Supplier</th>
                <th className="py-3.5 px-4">Faktur / Invoice</th>
                <th className="py-3.5 px-4">Petugas Penerima</th>
                <th className="py-3.5 px-4 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <ArrowDownToLine className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada riwayat barang masuk.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Klik tombol &ldquo;Catat Barang Masuk&rdquo; untuk merekam penerimaan barang baru.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((tx, index) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-xs text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-emerald-800">
                      <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {tx.docNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {formatDateTime(tx.date)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{tx.itemName}</div>
                      <div className="font-mono text-[11px] text-slate-400">{tx.itemSku}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-extrabold text-sm text-emerald-600">
                        +{formatNumber(tx.qty)}
                      </span>{' '}
                      <span className="text-xs text-slate-500">{tx.unit}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 text-xs">{tx.supplier}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {tx.invoiceNumber || '-'}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {tx.receivedBy}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPrintTx(tx)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-medium transition-colors"
                          title="Cetak Bukti Penerimaan Barang (BPPB)"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Cetak BPPB</span>
                        </button>

                        <button
                          onClick={() => deleteTransactionIn(tx.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Batalkan & Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <strong className="text-slate-800">{filteredList.length}</strong> transaksi barang masuk
          </div>
          <div>
            Total Masuk Terfilter:{' '}
            <strong className="text-emerald-700 text-sm font-bold">
              +{formatNumber(filteredList.reduce((acc, t) => acc + (Number(t.qty) || 0), 0))} Unit
            </strong>
          </div>
        </div>
      </div>

      {/* Print Document Modal */}
      <PrintDocumentModal
        isOpen={!!printTx}
        onClose={() => setPrintTx(null)}
        transaction={printTx}
        type="in"
      />
    </div>
  );
}

