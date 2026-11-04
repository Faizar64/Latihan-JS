/**
 * Format number to Indonesian Rupiah currency string
 */
export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format standard number with thousand separator
 */
export function formatNumber(number) {
  if (number === undefined || number === null || isNaN(number)) return '0';
  return new Intl.NumberFormat('id-ID').format(number);
}

/**
 * Format ISO date string into Indonesian readable date (e.g. 04 Nov 2026, 14:30)
 */
export function formatDateTime(isoString) {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Format date only (e.g. 04 Nov 2026)
 */
export function formatDate(isoString) {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Get stock status badge info
 */
export function getStockStatus(stock, minStock) {
  if (stock <= 0) {
    return {
      label: 'Habis (Out of Stock)',
      level: 'danger',
      badgeClass: 'bg-red-50 text-red-700 border-red-200 ring-red-600/10',
      dotClass: 'bg-red-500',
    };
  }
  if (stock <= minStock) {
    return {
      label: 'Menipis (Low Stock)',
      level: 'warning',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
      dotClass: 'bg-amber-500',
    };
  }
  return {
    label: 'Aman (In Stock)',
    level: 'success',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10',
    dotClass: 'bg-emerald-500',
  };
}

