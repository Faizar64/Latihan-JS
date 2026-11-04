import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { useWarehouse } from '../../context/WarehouseContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowDownToLine, Package, Calendar, User, Truck, FileText } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function TransactionInModal({ isOpen, onClose, defaultItem }) {
  const { items, addTransactionIn } = useWarehouse();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    itemId: '',
    docNumber: '',
    qty: 10,
    supplier: '',
    invoiceNumber: '',
    date: new Date().toISOString().slice(0, 16),
    receivedBy: user?.name || 'Petugas Gudang',
    notes: 'Kondisi barang baik & segel utuh.',
  });

  useEffect(() => {
    if (isOpen) {
      const selectedId = defaultItem ? defaultItem.id : items[0]?.id || '';
      const autoDoc = `BM-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(
        100 + Math.random() * 900
      )}`;

      setFormData({
        itemId: selectedId,
        docNumber: autoDoc,
        qty: 10,
        supplier: 'PT Surya Prima Perkasa',
        invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().slice(0, 16),
        receivedBy: user?.name || 'Petugas Gudang',
        notes: 'Penerimaan barang lolos uji verifikasi fisik.',
      });
    }
  }, [isOpen, defaultItem, items, user]);

  const selectedItem = items.find((i) => i.id === formData.itemId);
  const projectedStock = selectedItem
    ? selectedItem.stock + (Number(formData.qty) || 0)
    : 0;

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
    const res = addTransactionIn({
      ...formData,
      qty: Number(formData.qty),
    });
    if (res?.success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Penerimaan Barang Masuk (Inbound)"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Number & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              No. Bukti Penerimaan (BPPB)
            </label>
            <input
              type="text"
              name="docNumber"
              required
              value={formData.docNumber}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Waktu Penerimaan
            </label>
            <input
              type="datetime-local"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Item Selection & Stock Projection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Pilih Barang Gudang <span className="text-rose-500">*</span>
          </label>
          <select
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                [{i.sku}] {i.name} — Stok Saat Ini: {i.stock} {i.unit} (Rak: {i.location})
              </option>
            ))}
          </select>
        </div>

        {/* Stock Projection Alert Card */}
        {selectedItem && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600 block">Stok Saat Ini:</span>
              <strong className="text-sm font-bold text-slate-900">
                {selectedItem.stock} {selectedItem.unit}
              </strong>
            </div>
            <div className="text-center font-bold text-emerald-600 text-base">+</div>
            <div>
              <span className="text-slate-600 block">Jumlah Masuk:</span>
              <strong className="text-sm font-bold text-emerald-700">
                {formData.qty || 0} {selectedItem.unit}
              </strong>
            </div>
            <div className="text-center font-bold text-slate-400 text-base">&rarr;</div>
            <div className="text-right">
              <span className="text-slate-600 block">Stok Setelah Masuk:</span>
              <strong className="text-sm font-extrabold text-emerald-800">
                {projectedStock} {selectedItem.unit}
              </strong>
            </div>
          </div>
        )}

        {/* Quantity & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Jumlah Diterima (Qty) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="qty"
                min="1"
                required
                value={formData.qty}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-extrabold text-emerald-700 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400 pointer-events-none">
                {selectedItem?.unit || 'Unit'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Petugas Penerima Gudang
            </label>
            <input
              type="text"
              name="receivedBy"
              required
              value={formData.receivedBy}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Supplier & Invoice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Supplier / Pemasok
            </label>
            <input
              type="text"
              name="supplier"
              required
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Contoh: PT Sumber Kimia Abadi"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              No. Faktur / DO Supplier
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              placeholder="Contoh: INV/2026/0912"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Catatan Pemeriksaan Barang
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Catatan kondisi fisik, nomor batch, atau hasil QC..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
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
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Simpan Barang Masuk</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

