import React from 'react';
import Modal from './Modal';
import { Printer, QrCode, Tag } from 'lucide-react';
import { triggerPrint } from '../utils/exportUtils';

export default function BarcodeModal({ isOpen, onClose, item }) {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Label & Barcode Rak Barang" maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-full bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 shadow-sm mb-6 print-card">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
            WMS Gudang Pro • Lokasi: {item.location}
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h4>
          <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-4">
            {item.category}
          </span>

          {/* Simulated High-Res Code128 Barcode Display */}
          <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
            <div className="flex items-end justify-center h-16 gap-[3px] mb-2 px-2 overflow-hidden w-full max-w-[280px]">
              {/* Pattern bars */}
              {item.sku.split('').map((char, idx) => {
                const code = char.charCodeAt(0);
                const heights = ['h-16', 'h-14', 'h-12', 'h-16', 'h-10'];
                const widths = ['w-1', 'w-1.5', 'w-0.5', 'w-2'];
                const h = heights[code % heights.length];
                const w = widths[(code + idx) % widths.length];
                return (
                  <React.Fragment key={idx}>
                    <div className={`${h} ${w} bg-black shrink-0`}></div>
                    <div className="h-16 w-0.5 bg-transparent shrink-0"></div>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="font-mono text-sm tracking-widest font-bold text-slate-900">
              *{item.sku}*
            </div>
          </div>

          <div className="grid grid-cols-2 text-left text-xs text-slate-600 gap-2 border-t pt-3">
            <div>
              <span className="text-slate-400 block">Satuan Stok:</span>
              <span className="font-semibold text-slate-800">{item.unit}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Stok Minimum:</span>
              <span className="font-semibold text-slate-800">{item.minStock} {item.unit}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => triggerPrint()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Cetak Label
          </button>
        </div>
      </div>
    </Modal>
  );
}

