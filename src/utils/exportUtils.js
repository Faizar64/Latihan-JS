/**
 * Export array of objects to CSV file
 */
export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) {
    alert('Tidak ada data untuk diekspor!');
    return;
  }

  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent = [
    keys.join(separator),
    ...rows.map(row => 
      keys.map(fieldName => {
        let val = row[fieldName] ?? '';
        if (typeof val === 'string') {
          // Escape quotes and commas
          val = val.replace(/"/g, '""');
          if (val.includes(',') || val.includes('\n') || val.includes('"')) {
            val = `"${val}"`;
          }
        }
        return val;
      }).join(separator)
    )
  ].join('\r\n');

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Trigger browser print
 */
export function triggerPrint() {
  window.print();
}

