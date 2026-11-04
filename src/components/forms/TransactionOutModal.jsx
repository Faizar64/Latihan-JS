import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { useWarehouse } from '../../context/WarehouseContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowUpFromLine, AlertCircle, AlertTriangle, Send, Building } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function TransactionOutModal({ isOpen, onClose, defaultItem }) {
  const { items, addTransactionOut } = useWarehouse();
  const { user } = useAuth();

  // Find first item with stock > 0 as default if defaultItem not provided
  const availableItems = items.filter((i) => i.stock > 0);

  const [formData, setFormData] = useState({
    itemId: '',
    docNumber: '',
    qty: 1,
    recipient: '',
    destination: '',
    referenceDoc: '',
    date: new Date().toISOString().slice(0, 16),
    issuedBy: user?.name || 'Petugas Gudang',
    notes: 'Pengeluaran disetujui untuk kebutuhan operasional.',
  });

  useEffect(() => {
    if (isOpen) {
      const selectedId = defaultItem
        ? defaultItem.id
        : availableItems[0]?.id || items[0]?.id || '';

      const autoDoc = `BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(
        100 + Math.random() * 900
      )}`;

      setFormData({
        itemId: selectedId,
        docNumber: autoDoc,
        qty: 1,
        recipient: 'Divisi Produksi & Perakitan',
        destination: 'Area Lini Kerja 02',
        referenceDoc: `REQ-MAT-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().slice(0, 16),
        issuedBy: user?.name || 'Petugas Gudang',
        notes: 'Permintaan material diserahkan dalam kondisi lengkap.',
      });
    }
  }, [isOpen, defaultItem, items, user]);

  const selectedItem = items.find((i) => i.id === formData.itemId);
  const currentStock = selectedItem ? selectedItem.stock : 0;
  const requestedQty = Number(formData.qty) || 0;
  const isOutOfStock = currentStock <= 0;
  const isExceedingStock = requestedQty > currentStock;
  const remainingStock = Math.max(0, currentStock - requestedQty);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.itemId) {
      alert('Pilih barang terlebih dahulu!');
      return;
    }
    if (isExceedingStock) {
      alert(`Stok tidak mencukupi! Sisa stok hanya ${currentStock} ${selectedItem?.unit}`);
      return;
    }

    const res = addTransactionOut({
      ...formData,
      qty: requestedQty,
    });
    if (res?.success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Pengeluaran Barang Keluar (Outbound)"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Number & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              No. Surat Jalan (SJPB)
            </label>
            <input
              type="text"
              name="docNumber"
              required
              value={formData.docNumber}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-purple-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Waktu Pengeluaran
            </label>
            <input
              type="datetime-local"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Item Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Pilih Barang Gudang <span className="text-rose-500">*</span>
          </label>
          <select
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-purple-500 font-medium"
          >
            {items.map((i) => (
              <option key={i.id} value={i.id} disabled={i.stock <= 0}>
                [{i.sku}] {i.name} — Stok: {i.stock} {i.unit} {i.stock <= 0 ? '(STOK KOSONG)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Validation Status Card */}
        {selectedItem && (
          <div
            className={`rounded-xl p-3.5 border flex items-center justify-between text-xs ${
              isExceedingStock
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-purple-50/70 border-purple-200 text-purple-950'
            }`}
          >
            <div>
              <span className="text-slate-500 block">Stok Saat Ini:</span>
              <strong className="text-sm font-bold text-slate-900">
                {currentStock} {selectedItem.unit}
              </strong>
            </div>
            <div className="text-center font-bold text-purple-600 text-base">-</div>
            <div>
              <span className="text-slate-500 block">Jumlah Dikeluarkan:</span>
              <strong
                className={`text-sm font-bold ${
                  isExceedingStock ? 'text-rose-600 animate-pulse' : 'text-purple-700'
                }`}
              >
                {requestedQty} {selectedItem.unit}
              </strong>
            </div>
            <div className="text-center font-bold text-slate-400 text-base">&rarr;</div>
            <div className="text-right">
              <span className="text-slate-500 block">Sisa Stok Nanti:</span>
              <strong
                className={`text-sm font-extrabold ${
                  isExceedingStock ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {isExceedingStock ? 'STOK KURANG!' : `${remainingStock} ${selectedItem.unit}`}
              </strong>
            </div>
          </div>
        )}

        {/* Stock Validation Error Warning */}
        {isExceedingStock && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Peringatan Validasi:</strong> Kuantitas barang keluar ({requestedQty}) melebihi
              stok fisik yang tersedia di gudang ({currentStock} {selectedItem?.unit}). Transaksi tidak dapat diproses.
            </span>
          </div>
        )}

        {/* Quantity & Issued By */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Jumlah Dikeluarkan (Qty) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="qty"
                min="1"
                max={currentStock > 0 ? currentStock : 1}
                required
                value={formData.qty}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm font-extrabold focus:ring-2 ${
                  isExceedingStock
                    ? 'border-rose-400 text-rose-700 focus:ring-rose-500'
                    : 'border-slate-300 text-purple-700 focus:ring-purple-500'
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400 pointer-events-none">
                {selectedItem?.unit || 'Unit'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Petugas Penanggung Jawab
            </label>
            <input
              type="text"
              name="issuedBy"
              required
              value={formData.issuedBy}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Recipient & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Divisi / Pemohon / Penerima
            </label>
            <input
              type="text"
              name="recipient"
              required
              value={formData.recipient}
              onChange={handleChange}
              placeholder="Contoh: Divisi Packing / PT Mitra Logistik"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lokasi Tujuan Pengiriman
            </label>
            <input
              type="text"
              name="destination"
              required
              value={formData.destination}
              onChange={handleChange}
              placeholder="Contoh: Area Mesin Line 2 / Gudang Cabang"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Reference Document */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            No. Referensi Dokumen / Work Order
          </label>
          <input
            type="text"
            name="referenceDoc"
            value={formData.referenceDoc}
            onChange={handleChange}
            placeholder="Contoh: REQ-PROD-26-09 atau SPK-442"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Catatan Keperluan Pengeluaran
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Keterangan tujuan pemakaian atau nomor armada pengangkut..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isExceedingStock || isOutOfStock}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Terbitkan Barang Keluar</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

