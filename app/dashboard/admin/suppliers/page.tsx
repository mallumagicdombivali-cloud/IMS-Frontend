"use client";

import React, { useEffect, useState } from 'react';

export default function AdminSuppliers() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ fetchSuppliers(); }, []);
  const fetchSuppliers = async () => { const res = await fetch('/api/suppliers?isActive=true'); const d = await res.json(); if (d.success) setRows(d.data.suppliers || d.data || []); };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Suppliers</h2>
      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Contact</th><th className="px-6 py-3">Rating</th></tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">{rows.map(r=> <tr key={r._id} className="hover:bg-milk/50"><td className="px-6 py-4">{r.name}</td><td className="px-6 py-4">{r.contactPerson} — {r.phone}</td><td className="px-6 py-4">{r.rating}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
