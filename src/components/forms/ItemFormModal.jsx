import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { useWarehouse } from '../../context/WarehouseContext';
import { Package, Hash, Tag, MapPin, DollarSign, Layers } from 'lucide-react';

export default function ItemFormModal({ isOpen, onClose, editingItem }) {
  const { addItem, updateItem, categories, locations } = useWarehouse();

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    unit: 'Pcs',
    stock: 0,
    minStock: 10,
    location: '',
    unitPrice: 0,
    description: '',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        sku: editingItem.sku || '',
        name: editingItem.name || '',
        category: editingItem.category || categories[0] || '',
        unit: editingItem.unit || 'Pcs',
        stock: editingItem.stock ?? 0,
        minStock: editingItem.minStock ?? 10,
        location: editingItem.location || locations[0] || '',
        unitPrice: editingItem.unitPrice ?? 0,
        description: editingItem.description || '',
      });
    } else {
      setFormData({
        sku: '',
        name: '',
        category: categories[0] || 'Elektronik & Kelistrikan',
        unit: 'Pcs',
        stock: 0,
        minStock: 10,
        location: locations[0] || 'Rak A-01 (Elektronik)',
        unitPrice: 0,
        description: '',
      });
    }
  }, [editingItem, isOpen, categories, locations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama barang wajib diisi!');
      return;
    }

    if (editingItem) {
      const res = updateItem(editingItem.id, formData);
      if (res?.success) onClose();
    } else {
      const res = addItem(formData);
      if (res?.success) onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Edit Data Barang' : 'Tambah Master Barang Baru'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kode SKU */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kode SKU / Barcode
            </label>
            <div className="relative">
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Contoh: BRG-ELK-099 (Kosongkan utk auto)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Otomatis dihasilkan jika dikosongkan
            </span>
          </div>

          {/* Nama Barang */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Barang <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Kabel Power NYM 3x2.5mm"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kategori Barang
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Satuan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Satuan Unit
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Pcs, Box, Roll, Rim, Unit, Kg, dsb."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Stok Awal (only active on create or adjustment) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {editingItem ? 'Jumlah Stok Saat Ini' : 'Stok Awal'}
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
            />
          </div>

          {/* Minimum Stock */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Batas Minimum (Alert)
            </label>
            <input
              type="number"
              name="minStock"
              min="0"
              value={formData.minStock}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Harga Satuan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Harga Satuan (Rp)
            </label>
            <input
              type="number"
              name="unitPrice"
              min="0"
              step="500"
              value={formData.unitPrice}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Lokasi Rak */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Lokasi Rak / Penyimpanan Gudang
          </label>
          <div className="flex gap-2">
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Spesifikasi & Catatan Barang
          </label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Deskripsi spesifikasi teknis, merek, atau keterangan khusus..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        {/* Footer actions */}
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
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            {editingItem ? 'Simpan Perubahan' : 'Tambah Barang'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

