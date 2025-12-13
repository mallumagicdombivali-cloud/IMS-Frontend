"use client";

import React, { useEffect, useState } from 'react';

export default function AdminLocations() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ fetchLocations(); }, []);
  const fetchLocations = async () => { const res = await fetch('/api/locations?isActive=true'); const d = await res.json(); if (d.success) setRows(d.data.locations || d.data || []); };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Locations</h2>
      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Code</th><th className="px-6 py-3">Address</th></tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">{rows.map(r=> <tr key={r._id} className="hover:bg-milk/50"><td className="px-6 py-4">{r.name}</td><td className="px-6 py-4">{r.code}</td><td className="px-6 py-4">{r.address}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
