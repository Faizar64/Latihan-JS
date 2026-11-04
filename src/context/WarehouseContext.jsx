import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ITEMS,
  INITIAL_TRANSACTIONS_IN,
  INITIAL_TRANSACTIONS_OUT,
  INITIAL_CATEGORIES,
  INITIAL_LOCATIONS,
} from '../data/initialData';

const WarehouseContext = createContext(null);

const STORAGE_ITEMS = 'wms_pro_items';
const STORAGE_IN = 'wms_pro_tx_in';
const STORAGE_OUT = 'wms_pro_tx_out';
const STORAGE_CATS = 'wms_pro_categories';
const STORAGE_LOCS = 'wms_pro_locations';

export function WarehouseProvider({ children }) {
  // Load persisted state or initial data
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ITEMS);
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [transactionsIn, setTransactionsIn] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_IN);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS_IN;
    } catch {
      return INITIAL_TRANSACTIONS_IN;
    }
  });

  const [transactionsOut, setTransactionsOut] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_OUT);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS_OUT;
    } catch {
      return INITIAL_TRANSACTIONS_OUT;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CATS);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOCS);
      return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
    } catch {
      return INITIAL_LOCATIONS;
    }
  });

  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_IN, JSON.stringify(transactionsIn));
  }, [transactionsIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_OUT, JSON.stringify(transactionsOut));
  }, [transactionsOut]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CATS, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LOCS, JSON.stringify(locations));
  }, [locations]);

  // Toast notifications helper
  const addToast = (message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Item to Master Persediaan
  const addItem = (itemData) => {
    // Generate SKU if empty
    let sku = itemData.sku?.trim().toUpperCase();
    if (!sku) {
      const prefix = itemData.category?.substring(0, 3).toUpperCase() || 'GEN';
      sku = `BRG-${prefix}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // Check SKU duplicate
    if (items.some((i) => i.sku.toLowerCase() === sku.toLowerCase())) {
      addToast(`SKU '${sku}' sudah terdaftar! Gunakan SKU unik.`, 'error');
      return { success: false, error: 'SKU sudah ada' };
    }

    const newItem = {
      id: `item-${Date.now()}`,
      sku,
      name: itemData.name.trim(),
      category: itemData.category || 'Lainnya',
      unit: itemData.unit || 'Pcs',
      stock: Number(itemData.stock) || 0,
      minStock: Number(itemData.minStock) || 5,
      location: itemData.location || 'Area Gudang Utama',
      unitPrice: Number(itemData.unitPrice) || 0,
      description: itemData.description || '',
      updatedAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
    addToast(`Barang '${newItem.name}' berhasil ditambahkan ke persediaan!`, 'success');
    return { success: true, item: newItem };
  };

  // Update Item
  const updateItem = (id, itemData) => {
    // Check if new SKU clashes with other items
    if (itemData.sku) {
      const clash = items.find(
        (i) => i.id !== id && i.sku.toLowerCase() === itemData.sku.trim().toLowerCase()
      );
      if (clash) {
        addToast(`SKU '${itemData.sku}' sudah digunakan oleh barang lain.`, 'error');
        return { success: false, error: 'SKU duplikat' };
      }
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            ...itemData,
            stock: Number(itemData.stock ?? i.stock),
            minStock: Number(itemData.minStock ?? i.minStock),
            unitPrice: Number(itemData.unitPrice ?? i.unitPrice),
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );
    addToast(`Data barang '${itemData.name || id}' berhasil diperbarui.`, 'success');
    return { success: true };
  };

  // Delete Item
  const deleteItem = (id) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    // Check if there are transactions associated
    const hasIn = transactionsIn.some((t) => t.itemId === id || t.itemSku === target.sku);
    const hasOut = transactionsOut.some((t) => t.itemId === id || t.itemSku === target.sku);

    if (hasIn || hasOut) {
      if (
        !confirm(
          `Peringatan: Barang '${target.name}' memiliki riwayat transaksi masuk/keluar. Apakah Anda yakin tetap ingin menghapusnya?`
        )
      ) {
        return false;
      }
    }

    setItems((prev) => prev.filter((i) => i.id !== id));
    addToast(`Barang '${target.name}' dihapus dari master persediaan.`, 'info');
    return true;
  };

  // Add Barang Masuk
  const addTransactionIn = (txData) => {
    const targetItem = items.find((i) => i.id === txData.itemId);
    if (!targetItem) {
      addToast('Barang tidak ditemukan!', 'error');
      return { success: false, error: 'Barang tidak valid' };
    }

    const qty = Number(txData.qty);
    if (isNaN(qty) || qty <= 0) {
      addToast('Jumlah barang masuk harus lebih besar dari 0!', 'error');
      return { success: false, error: 'Qty tidak valid' };
    }

    const docNumber =
      txData.docNumber?.trim() ||
      `BM-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(
        transactionsIn.length + 1
      ).padStart(3, '0')}`;

    const newTx = {
      id: `tr-in-${Date.now()}`,
      docNumber,
      date: txData.date || new Date().toISOString(),
      itemId: targetItem.id,
      itemSku: targetItem.sku,
      itemName: targetItem.name,
      qty,
      unit: targetItem.unit,
      supplier: txData.supplier?.trim() || 'Supplier Umum',
      invoiceNumber: txData.invoiceNumber?.trim() || '-',
      receivedBy: txData.receivedBy?.trim() || 'Petugas Gudang',
      notes: txData.notes?.trim() || 'Penerimaan barang masuk normal.',
    };

    // Update item stock
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === targetItem.id) {
          return {
            ...i,
            stock: i.stock + qty,
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );

    setTransactionsIn((prev) => [newTx, ...prev]);
    addToast(
      `Berhasil mencatat Barang Masuk: +${qty} ${targetItem.unit} '${targetItem.name}'. Stok diperbarui!`,
      'success'
    );
    return { success: true, transaction: newTx };
  };

  // Add Barang Keluar
  const addTransactionOut = (txData) => {
    const targetItem = items.find((i) => i.id === txData.itemId);
    if (!targetItem) {
      addToast('Barang tidak ditemukan!', 'error');
      return { success: false, error: 'Barang tidak valid' };
    }

    const qty = Number(txData.qty);
    if (isNaN(qty) || qty <= 0) {
      addToast('Jumlah barang keluar harus lebih besar dari 0!', 'error');
      return { success: false, error: 'Qty tidak valid' };
    }

    // Critical stock check!
    if (qty > targetItem.stock) {
      addToast(
        `Gagal! Stok '${targetItem.name}' tidak mencukupi (Tersedia: ${targetItem.stock} ${targetItem.unit}, Diminta: ${qty} ${targetItem.unit}).`,
        'error'
      );
      return { success: false, error: 'Stok tidak mencukupi' };
    }

    const docNumber =
      txData.docNumber?.trim() ||
      `BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(
        transactionsOut.length + 1
      ).padStart(3, '0')}`;

    const newTx = {
      id: `tr-out-${Date.now()}`,
      docNumber,
      date: txData.date || new Date().toISOString(),
      itemId: targetItem.id,
      itemSku: targetItem.sku,
      itemName: targetItem.name,
      qty,
      unit: targetItem.unit,
      recipient: txData.recipient?.trim() || 'Divisi Internal',
      destination: txData.destination?.trim() || 'Operasional Gudang',
      referenceDoc: txData.referenceDoc?.trim() || '-',
      issuedBy: txData.issuedBy?.trim() || 'Petugas Gudang',
      notes: txData.notes?.trim() || 'Pengeluaran barang terverifikasi.',
    };

    // Update item stock
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === targetItem.id) {
          return {
            ...i,
            stock: i.stock - qty,
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );

    setTransactionsOut((prev) => [newTx, ...prev]);
    addToast(
      `Berhasil mencatat Barang Keluar: -${qty} ${targetItem.unit} '${targetItem.name}'. Sisa stok: ${
        targetItem.stock - qty
      }`,
      'warning'
    );
    return { success: true, transaction: newTx };
  };

  // Delete transaction in (reverts addition)
  const deleteTransactionIn = (txId) => {
    const tx = transactionsIn.find((t) => t.id === txId);
    if (!tx) return;

    if (
      !confirm(
        `Batalkan transaksi barang masuk ${tx.docNumber}? Stok ${tx.itemName} akan dikurangi ${tx.qty} ${tx.unit}.`
      )
    ) {
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === tx.itemId) {
          return {
            ...i,
            stock: Math.max(0, i.stock - tx.qty),
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );

    setTransactionsIn((prev) => prev.filter((t) => t.id !== txId));
    addToast(`Transaksi masuk ${tx.docNumber} dibatalkan dan stok telah disesuaikan.`, 'info');
  };

  // Delete transaction out (reverts subtraction)
  const deleteTransactionOut = (txId) => {
    const tx = transactionsOut.find((t) => t.id === txId);
    if (!tx) return;

    if (
      !confirm(
        `Batalkan transaksi barang keluar ${tx.docNumber}? Stok ${tx.itemName} akan dikembalikan sebanyak +${tx.qty} ${tx.unit}.`
      )
    ) {
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === tx.itemId) {
          return {
            ...i,
            stock: i.stock + tx.qty,
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );

    setTransactionsOut((prev) => prev.filter((t) => t.id !== txId));
    addToast(`Transaksi keluar ${tx.docNumber} dibatalkan dan stok telah dikembalikan.`, 'info');
  };

  // Reset all to demo state
  const resetToDefaultData = () => {
    if (confirm('Apakah Anda yakin ingin mereset semua data gudang ke data bawaan demo?')) {
      setItems(INITIAL_ITEMS);
      setTransactionsIn(INITIAL_TRANSACTIONS_IN);
      setTransactionsOut(INITIAL_TRANSACTIONS_OUT);
      setCategories(INITIAL_CATEGORIES);
      setLocations(INITIAL_LOCATIONS);
      localStorage.removeItem(STORAGE_ITEMS);
      localStorage.removeItem(STORAGE_IN);
      localStorage.removeItem(STORAGE_OUT);
      localStorage.removeItem(STORAGE_CATS);
      localStorage.removeItem(STORAGE_LOCS);
      addToast('Data gudang berhasil direset ke pengaturan awal.', 'info');
    }
  };

  return (
    <WarehouseContext.Provider
      value={{
        items,
        transactionsIn,
        transactionsOut,
        categories,
        locations,
        toasts,
        addToast,
        removeToast,
        addItem,
        updateItem,
        deleteItem,
        addTransactionIn,
        addTransactionOut,
        deleteTransactionIn,
        deleteTransactionOut,
        resetToDefaultData,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
}

