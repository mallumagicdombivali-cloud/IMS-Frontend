"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SupplierPerformance() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/reports/supplier-performance');
      const d = await res.json();
      if (d.success) setData(d.data || []);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Supplier Performance</h2>
      <div className="p-6 rounded border bg-white/60 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="onTimeDeliveryRate" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
