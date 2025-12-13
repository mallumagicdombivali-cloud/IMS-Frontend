"use client";

import React, { useEffect, useState } from "react";

export default function WastagePage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/reports/wastage');
      const d = await res.json();
      if (d.success) setRows(d.data || []);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Wastage Report</h2>
      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">Period</th>
              <th className="px-6 py-3">Wastage Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">
            {rows.map((r, idx) => (
              <tr key={idx} className="hover:bg-milk/50">
                <td className="px-6 py-4">{r.itemName}</td>
                <td className="px-6 py-4">{r.period}</td>
                <td className="px-6 py-4">{r.wastageQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
