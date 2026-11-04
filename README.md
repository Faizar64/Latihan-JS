# 🏢 SIM-Gudang PRO — Warehouse Management System (WMS)

Aplikasi Web Sistem Informasi Manajemen Pergudangan modern berbasis **JavaScript Framework (React 18 + Vite + Tailwind CSS + Express.js)** dengan antarmuka responsif, intuitif, dan fitur pergudangan lengkap untuk kebutuhan logistik industri & retail.

---

## 🚀 Fitur Utama

### 1. 🔐 Sistem Autentikasi & Login Multi-Peran
- **Login Akses**: Keamanan berbasis sesi dengan validasi username & kata sandi.
- **Dukungan Multi-Role**:
  - **Super Administrator (Admin Gudang)**: Akses penuh seluruh master data, transaksi, audit, dan reset data demo.
  - **Staff Gudang (Operator Lapangan)**: Operasional penerimaan barang masuk dan pengeluaran barang keluar.
  - **Supervisor / Kepala Gudang**: Otorisasi pengeluaran, monitoring stok, dan audit laporan.
- **Tombol Demo 1-Klik**: Memudahkan pengujian langsung tanpa perlu mengetik kredensial secara manual:
  - `admin` / `password123`
  - `staff` / `password123`
  - `supervisor` / `password123`

### 2. 📊 Menu Utama (Dashboard Operasional)
- **Kartu Metrik Real-time**:
  - Total Master SKU / Jenis Barang
  - Total Unit Fisik Stok di Rak Gudang
  - Estimasi Total Nilai Valuasi Aset Persediaan (IDR)
  - Akumulasi Barang Masuk (Kuantitas & Jumlah Dokumen)
  - Akumulasi Barang Keluar (Kuantitas & Jumlah Dokumen)
- **Papan Peringatan Dini Stok (Safety Stock Alert)**: Menyoroti barang yang mendekati batas minimum atau habis total dengan tombol aksi cepat *Restock*.
- **Distribusi Stok per Kategori**: Visual progress bar pembagian unit fisik inventaris.
- **Feed Aktivitas Terkini**: Catatan riwayat mutasi masuk/keluar terpusat secara langsung.

### 3. 📦 Data Persediaan (Master Barang & Level Stok)
- **Katalog Master Barang**: Kode SKU, Nama Barang, Kategori, Satuan (Pcs, Box, Roll, Rim, Unit, Kg), Lokasi Rak, Stok Saat Ini, Batas Minimum Stok, dan Harga Satuan.
- **Status Stok Otomatis**:
  - 🟢 **Aman (In Stock)**: Stok berada di atas batas minimum.
  - 🟡 **Menipis (Low Stock)**: Stok berada di bawah atau sama dengan batas minimum.
  - 🔴 **Habis (Out of Stock)**: Stok 0.
- **Fitur CRUD & Manajemen**:
  - Tambah Barang Baru (dengan generator SKU otomatis atau kustom).
  - Edit & Hapus Barang.
  - Cetak Label & Barcode Rak (Code128 simetris & format cetak).
  - Ekspor data persediaan langsung ke file format **CSV/Excel**.
  - Cetak tabel persediaan resmi.

### 4. 📥 Data Barang Masuk (Inbound Logistics)
- **Pencatatan Penerimaan**:
  - Terhubung langsung dengan master persediaan.
  - Form pencatatan nomor dokumen penerimaan (BPPB), tanggal/jam masuk, supplier/pemasok, no faktur/DO, petugas penerima, dan catatan fisik/QC.
- **Otomatisasi Stok**: Saat barang masuk dicatat, kuantitas stok di master persediaan bertambah seketika.
- **Cetak Dokumen Resmi**: Cetak formulir **Bukti Penerimaan Barang Masuk (BPPB)** lengkap dengan kop surat perusahaan dan kolom tanda tangan supplier, petugas gudang, dan kepala logistik.
- **Fitur Ekspor**: Unduh rekaman barang masuk ke file CSV.

### 5. 📤 Data Barang Keluar (Outbound Logistics)
- **Pencatatan Pengeluaran**:
  - Penerbitan nomor Surat Jalan Pengeluaran Barang (SJPB).
  - Pemilihan divisi/tujuan pemohon (Produksi, Ekspedisi, Maintenance, Cabang).
  - No dokumen referensi / Work Order.
- **Validasi Ketat Anti-Minus (Prevent Stock Below Zero)**:
  - Form memvalidasi sisa stok secara langsung.
  - Menolak dan mengunci pengeluaran apabila jumlah yang diminta melebihi sisa stok di rak.
- **Otomatisasi Stok**: Kuantitas stok berkurang otomatis setelah diverifikasi.
- **Cetak Dokumen Resmi**: Cetak dokumen **Surat Jalan Pengeluaran Barang (SJPB)** format siap cetak printer.

### 6. 📑 Laporan & Rekapitulasi Mutasi Stok (Stock Card & Audit)
- **Kartu Stok Komprehensif**:
  - Rekapitulasi: **Total Masuk (+) | Total Keluar (-) | Sisa Stok Akhir | Valuasi (IDR)**.
  - Filter pencarian dan penyaringan per kategori produk.
  - Total akumulatif seluruh gudang pada baris footer rekapitulasi.
  - Unduh Laporan Mutasi ke CSV dan Cetak Laporan Audit Resmi.

---

## 🛠️ Panduan Instalasi & Menjalankan Aplikasi

### Kebutuhan Sistem:
- **Node.js** versi 18+ (teruji pada Node v26)
- Browser modern (Google Chrome, Microsoft Edge, Mozilla Firefox)

### Langkah Menjalankan Mode Pengembangan (Vite Dev Server):
```bash
# Jalankan Vite server
npm run dev
```
Aplikasi akan aktif di `http://localhost:3000` atau port yang ditampilkan di terminal.

### Langkah Menjalankan Mode Fullstack / Server Express:
```bash
# 1. Build aplikasi Vite menjadi file statis produksi
npm run build

# 2. Jalankan server Node/Express
npm run server
```
Akses di browser melalui `http://localhost:5000`.

---

## 📁 Struktur Direktori Proyek

```
Latihan JS/
├── index.html                     # Template HTML utama
├── package.json                   # Metadata & dependencies NPM
├── vite.config.js                 # Konfigurasi bundler Vite
├── tailwind.config.js             # Konfigurasi Tailwind CSS
├── postcss.config.js              # Konfigurasi PostCSS
├── server.js                      # Backend API & Server Express
├── dist/                          # Hasil bundle produksi
└── src/
    ├── main.jsx                   # Entry point aplikasi React
    ├── App.jsx                    # Komponen root & router navigasi
    ├── index.css                  # Style global & aturan cetak print
    ├── context/
    │   ├── AuthContext.jsx        # State manajemen sesi & login user
    │   └── WarehouseContext.jsx   # State manajemen inventaris & transaksi
    ├── data/
    │   └── initialData.js         # Master data awal & data demo gudang
    ├── utils/
    │   ├── formatters.js          # Format Rupiah, tanggal, status stok
    │   └── exportUtils.js         # Fungsi ekspor CSV & cetak printer
    ├── components/
    │   ├── Navbar.jsx             # Topbar navigasi & indikator alert
    │   ├── Sidebar.jsx            # Menu samping responsif
    │   ├── Modal.jsx              # Modal backdrop reusable
    │   ├── BarcodeModal.jsx       # Modal tampilan barcode & label rak
    │   ├── PrintDocumentModal.jsx # Lembar cetak BPPB & Surat Jalan resmi
    │   ├── NotificationToast.jsx  # Notifikasi toast mengambang
    │   └── forms/
    │       ├── ItemFormModal.jsx      # Modal tambah & edit barang
    │       ├── TransactionInModal.jsx # Modal catat barang masuk
    │       └── TransactionOutModal.jsx# Modal catat barang keluar
    └── views/
        ├── LoginView.jsx          # Tampilan autentikasi & demo login
        ├── DashboardView.jsx      # Menu Utama (Ringkasan & Metrik)
        ├── PersediaanView.jsx     # Master Persediaan Barang
        ├── BarangMasukView.jsx    # Riwayat Barang Masuk
        ├── BarangKeluarView.jsx   # Riwayat Barang Keluar
        └── LaporanMutasiView.jsx  # Laporan Audit & Mutasi Stok
```

---

## 💡 Akun Demo Bawaan

| Role / Jabatan | Username | Password | Keterangan |
|---|---|---|---|
| **Super Admin** | `admin` | `password123` | Akses penuh seluruh modul & kontrol master |
| **Staff Gudang** | `staff` | `password123` | Input barang masuk, keluar, dan lihat stok |
| **Kepala Gudang** | `supervisor` | `password123` | Otorisasi pengeluaran, monitoring, & laporan |

