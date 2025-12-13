"use client";

import React, { useEffect, useState } from 'react';

export default function AdminDepartments() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => { fetchDeps(); }, []);
  const fetchDeps = async () => { const res = await fetch('/api/departments?isActive=true'); const d = await res.json(); if (d.success) setRows(d.data.departments || d.data || []); };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Departments</h2>
      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Code</th><th className="px-6 py-3">HOD</th></tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">{rows.map(r=> <tr key={r._id} className="hover:bg-milk/50"><td className="px-6 py-4">{r.name}</td><td className="px-6 py-4">{r.code}</td><td className="px-6 py-4">{r.hodId}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
