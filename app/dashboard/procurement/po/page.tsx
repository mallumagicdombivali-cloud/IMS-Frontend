"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../components/lib/api";

interface POItem {
  _id: string;
  poNumber?: string;
  supplier?: string;
  status?: string;
  total?: number;
}

export default function POListPage() {
  const [pos, setPos] = useState<POItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPOs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/po?page=1&limit=50`);
      const data = await res.json();
      if (data.success) setPos(data.data.pos || data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  const handleSend = async (id: string) => {
    if (!confirm("Send this PO to supplier?")) return;
    try {
      const res = await apiFetch(`/api/po/${id}/send`, { method: "POST" });
      if (res.ok) fetchPOs();
      else alert("Failed to send PO");
    } catch (err) {
      console.error(err);
      alert("Failed to send PO");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Purchase Orders</h2>
          <p className="text-muted-foreground">List of purchase orders.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/procurement/pr" className="px-4 py-2 bg-foreground text-milk rounded-lg">View PRs</Link>
          <Link href="/dashboard/procurement/grn/new" className="px-4 py-2 bg-camel text-white rounded-lg">Create GRN</Link>
        </div>
      </div>

      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">PO #</th>
              <th className="px-6 py-3">Supplier</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : pos.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No POs found.</td></tr>
            ) : (
              pos.map((po) => (
                <tr key={po._id} className="hover:bg-milk/50">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{po.poNumber || po._id}</td>
                  <td className="px-6 py-4">{po.supplier || '-'}</td>
                  <td className="px-6 py-4 capitalize">{po.status}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/procurement/po/${po._id}`} className="px-3 py-1 rounded bg-gray-100">View</Link>
                      {po.status === 'approved' && (
                        <button onClick={() => handleSend(po._id)} className="px-3 py-1 rounded bg-blue-600 text-white">Send to Supplier</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
