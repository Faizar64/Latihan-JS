import React, { useState, useMemo } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import {
  ArrowUpFromLine,
  Search,
  Plus,
  Download,
  Printer,
  Trash2,
  FileText,
  Send,
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

export default function BarangKeluarView({ onOpenAddOut }) {
  const { transactionsOut, deleteTransactionOut } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState('');
  const [printTx, setPrintTx] = useState(null);

  // Computations
  const totalOutQty = transactionsOut.reduce((sum, tx) => sum + (Number(tx.qty) || 0), 0);
  const uniqueRecipients = new Set(transactionsOut.map((t) => t.recipient)).size;

  // Filtered transactions
  const filteredList = useMemo(() => {
    return transactionsOut.filter((tx) => {
      const q = searchTerm.toLowerCase();
      return (
        tx.docNumber.toLowerCase().includes(q) ||
        tx.itemName.toLowerCase().includes(q) ||
        tx.itemSku.toLowerCase().includes(q) ||
        tx.recipient.toLowerCase().includes(q) ||
        tx.destination.toLowerCase().includes(q) ||
        tx.referenceDoc.toLowerCase().includes(q) ||
        tx.issuedBy.toLowerCase().includes(q)
      );
    });
  }, [transactionsOut, searchTerm]);

  const handleExportCSV = () => {
    const exportData = filteredList.map((tx, idx) => ({
      No: idx + 1,
      'No Surat Jalan (Dokumen Keluar)': tx.docNumber,
      'Tanggal & Jam': formatDateTime(tx.date),
      'Kode SKU': tx.itemSku,
      'Nama Barang': tx.itemName,
      'Jumlah Dikeluarkan': tx.qty,
      Satuan: tx.unit,
      'Divisi / Penerima': tx.recipient,
      'Lokasi Tujuan': tx.destination,
      'No. Referensi / Permintaan': tx.referenceDoc,
      'Petugas Pengeluaran': tx.issuedBy,
      Keterangan: tx.notes,
    }));
    exportToCSV('Data_Barang_Keluar', exportData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Surat Jalan Pengeluaran
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {transactionsOut.length} Dokumen
            </div>
            <div className="text-xs text-slate-500 mt-1">Telah diterbitkan & diverifikasi</div>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ArrowUpFromLine className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Kuantitas Dikeluarkan
            </span>
            <div className="text-2xl font-black text-purple-600 mt-1">
              -{formatNumber(totalOutQty)} Unit
            </div>
            <div className="text-xs text-slate-500 mt-1">Didistribusikan ke unit kerja</div>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Divisi / Pemohon Terlayani
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {uniqueRecipients} Divisi
            </div>
            <div className="text-xs text-slate-500 mt-1">Cabang, pabrik, & operasional</div>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Building className="w-6 h-6" />
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
            placeholder="Cari no surat jalan, nama barang, penerima, atau divisi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-slate-50/50 hover:bg-white transition-colors"
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
            onClick={onOpenAddOut}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Barang Keluar</span>
          </button>
        </div>
      </div>

      {/* Table of Outgoing Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider font-bold text-slate-600">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">No. Surat Jalan</th>
                <th className="py-3.5 px-4">Tanggal & Jam</th>
                <th className="py-3.5 px-4">Barang Dikeluarkan</th>
                <th className="py-3.5 px-4 text-right">Jumlah Keluar</th>
                <th className="py-3.5 px-4">Penerima / Tujuan</th>
                <th className="py-3.5 px-4">No. Referensi Permintaan</th>
                <th className="py-3.5 px-4">Petugas Pengeluar</th>
                <th className="py-3.5 px-4 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <ArrowUpFromLine className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada riwayat barang keluar.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Klik tombol &ldquo;Catat Barang Keluar&rdquo; untuk menerbitkan surat jalan pengeluaran stok.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((tx, index) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-xs text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-purple-800">
                      <span className="bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
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
                      <span className="font-extrabold text-sm text-purple-600">
                        -{formatNumber(tx.qty)}
                      </span>{' '}
                      <span className="text-xs text-slate-500">{tx.unit}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 text-xs">{tx.recipient}</div>
                      <div className="text-[11px] text-slate-400">{tx.destination}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {tx.referenceDoc || '-'}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {tx.issuedBy}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPrintTx(tx)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-medium transition-colors"
                          title="Cetak Surat Jalan Pengeluaran Barang (SJPB)"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Cetak Surat Jalan</span>
                        </button>

                        <button
                          onClick={() => deleteTransactionOut(tx.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Batalkan & Kembalikan Stok"
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
            Menampilkan <strong className="text-slate-800">{filteredList.length}</strong> transaksi barang keluar
          </div>
          <div>
            Total Keluar Terfilter:{' '}
            <strong className="text-purple-700 text-sm font-bold">
              -{formatNumber(filteredList.reduce((acc, t) => acc + (Number(t.qty) || 0), 0))} Unit
            </strong>
          </div>
        </div>
      </div>

      {/* Print Document Modal */}
      <PrintDocumentModal
        isOpen={!!printTx}
        onClose={() => setPrintTx(null)}
        transaction={printTx}
        type="out"
      />
    </div>
  );
}

