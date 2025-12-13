"use client";

import React, { useEffect, useState } from "react";

export default function StockReportPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/reports/stock');
      const d = await res.json();
      if (d.success) setRows(d.data || []);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Stock Balance</h2>
      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Total Qty</th>
              <th className="px-6 py-3">Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">
            {rows.map(r => (
              <tr key={r.itemId} className="hover:bg-milk/50">
                <td className="px-6 py-4">{r.itemName}</td>
                <td className="px-6 py-4 font-mono text-xs">{r.itemCode}</td>
                <td className="px-6 py-4">{r.totalQty}</td>
                <td className="px-6 py-4">{r.availableQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
