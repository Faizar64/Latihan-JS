import React from 'react';
import Modal from './Modal';
import { Printer, Download, Building2 } from 'lucide-react';
import { formatDateTime, formatDate, formatNumber } from '../utils/formatters';
import { triggerPrint } from '../utils/exportUtils';

export default function PrintDocumentModal({ isOpen, onClose, transaction, type = 'in' }) {
  if (!transaction) return null;

  const isIncoming = type === 'in';
  const docTitle = isIncoming
    ? 'BUKTI PENERIMAAN BARANG MASUK (BPPB)'
    : 'SURAT JALAN PENGELUARAN BARANG (SJPB)';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Cetak Dokumen: ${transaction.docNumber}`}
      maxWidth="max-w-3xl"
    >
      <div>
        {/* Printable Paper Area */}
        <div
          id="printable-document"
          className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm text-slate-800 text-sm print:border-none print:shadow-none print:p-0"
        >
          {/* Header & Kop Surat */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-600 text-white rounded-xl">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  PT LOGISTIK GUDANG JAYA NUSANTARA
                </h2>
                <p className="text-xs text-slate-500">
                  Kawasan Industri Terpadu Blok C-12, Bekasi, Jawa Barat
                </p>
                <p className="text-xs text-slate-500">
                  Telp: (021) 8892-0012 • Email: warehouse@gudangjaya.id
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-slate-100 font-mono text-xs font-bold text-slate-700 mb-1">
                {transaction.docNumber}
              </span>
              <div className="text-xs text-slate-500">
                Tanggal: <strong className="text-slate-800">{formatDate(transaction.date)}</strong>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
              {docTitle}
            </h3>
            <p className="text-xs text-slate-500">
              Sistem Informasi Manajemen Pergudangan Terintegrasi
            </p>
          </div>

          {/* Info Details Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
            {isIncoming ? (
              <>
                <div>
                  <span className="text-xs text-slate-500 block">Pemasok / Supplier:</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {transaction.supplier}
                  </span>
                  <span className="text-xs text-slate-500 block mt-2">
                    No. Faktur / Referensi:
                  </span>
                  <span className="font-mono text-xs text-slate-800">
                    {transaction.invoiceNumber}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Petugas Penerima:</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {transaction.receivedBy}
                  </span>
                  <span className="text-xs text-slate-500 block mt-2">Waktu Masuk Sistem:</span>
                  <span className="text-xs text-slate-800">
                    {formatDateTime(transaction.date)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-xs text-slate-500 block">Tujuan / Divisi Peminta:</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {transaction.recipient}
                  </span>
                  <span className="text-xs text-slate-500 block mt-2">Lokasi Distribusi:</span>
                  <span className="text-xs text-slate-800">{transaction.destination}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Petugas Pengeluaran:</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {transaction.issuedBy}
                  </span>
                  <span className="text-xs text-slate-500 block mt-2">
                    No. Dokumen Referensi:
                  </span>
                  <span className="font-mono text-xs text-slate-800">
                    {transaction.referenceDoc}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Table Items */}
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr className="border-y border-slate-300 bg-slate-100 text-xs uppercase font-semibold text-slate-700">
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3">Kode SKU</th>
                <th className="py-2.5 px-3">Deskripsi Barang</th>
                <th className="py-2.5 px-3 text-right">Jumlah</th>
                <th className="py-2.5 px-3">Satuan</th>
                <th className="py-2.5 px-3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              <tr>
                <td className="py-3 px-3 text-center text-slate-500">1</td>
                <td className="py-3 px-3 font-mono font-medium text-slate-800">
                  {transaction.itemSku}
                </td>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  {transaction.itemName}
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">
                  {formatNumber(transaction.qty)}
                </td>
                <td className="py-3 px-3 text-slate-600">{transaction.unit}</td>
                <td className="py-3 px-3 text-xs text-slate-500">{transaction.notes || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Notes Box */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-8">
            <strong>Catatan Tambahan:</strong>{' '}
            {transaction.notes || 'Barang telah diperiksa fisik, kuantitas dan kualitas sesuai.'}
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 text-center text-xs text-slate-700 pt-4">
            <div>
              <p className="font-medium text-slate-500 mb-16">
                {isIncoming ? 'Pengirim / Pemasok' : 'Penerima Barang'}
              </p>
              <div className="border-t border-slate-400 mx-6 pt-1 font-semibold text-slate-800">
                ( {isIncoming ? transaction.supplier : transaction.recipient} )
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-500 mb-16">Petugas Gudang</p>
              <div className="border-t border-slate-400 mx-6 pt-1 font-semibold text-slate-800">
                ( {isIncoming ? transaction.receivedBy : transaction.issuedBy} )
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-500 mb-16">Kepala Bagian Logistik</p>
              <div className="border-t border-slate-400 mx-6 pt-1 font-semibold text-slate-800">
                ( Hendra Gunawan )
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => triggerPrint()}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Cetak Dokumen
          </button>
        </div>
      </div>
    </Modal>
  );
}

