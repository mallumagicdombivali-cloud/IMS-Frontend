"use client";

import React, { useEffect, useState } from "react";

export default function ValuationPage() {
  const [summary, setSummary] = useState<{ method?:string; totalValuation?: number } | null>(null);

  useEffect(() => { fetchValuation(); }, []);

  const fetchValuation = async () => {
    try {
      const res = await fetch('/api/reports/valuation');
      const d = await res.json();
      if (d.success) setSummary(d.data || null);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Stock Valuation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded border bg-white/60">
          <div className="text-muted-foreground">Method</div>
          <div className="text-xl font-semibold">{summary?.method || '-'}</div>
        </div>
        <div className="p-6 rounded border bg-white/60">
          <div className="text-muted-foreground">Total Valuation</div>
          <div className="text-xl font-semibold">{summary?.totalValuation ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}
