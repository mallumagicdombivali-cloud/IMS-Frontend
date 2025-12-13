"use client";

import React, { useEffect, useState } from 'react';

export default function AdminAudit() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ fetchAudit(); }, []);
  const fetchAudit = async () => { const res = await fetch('/api/audit?page=1&limit=50'); const d = await res.json(); if (d.success) setRows(d.data.audit || d.data || []); };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr><th className="px-6 py-3">Time</th><th className="px-6 py-3">User</th><th className="px-6 py-3">Action</th><th className="px-6 py-3">Entity</th></tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">{rows.map(r=> <tr key={r._id} className="hover:bg-milk/50"><td className="px-6 py-4">{new Date(r.createdAt).toLocaleString()}</td><td className="px-6 py-4">{r.user?.name || r.userId}</td><td className="px-6 py-4">{r.action}</td><td className="px-6 py-4">{r.entity}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
