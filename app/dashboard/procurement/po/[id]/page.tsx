"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../../components/lib/api";
import { useParams } from "next/navigation";

export default function PODetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPO = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/po/${id}`);
      const data = await res.json();
      if (data.success) setPo(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchPO(); }, [id]);

  const handleSend = async () => {
    if (!confirm("Send this PO to supplier?")) return;
    const res = await apiFetch(`/api/po/${id}/send`, { method: "POST" });
    if (res.ok) fetchPO();
    else alert("Failed to send PO");
  };

  const handleApprove = async () => {
    const res = await apiFetch(`/api/po/${id}/approve`, { method: "POST" });
    if (res.ok) fetchPO();
    else alert("Failed to approve PO");
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Purchase Order Details</h2>
      {loading ? <div>Loading...</div> : po ? (
        <div className="space-y-4">
          <div><strong>ID:</strong> {po._id}</div>
          <div><strong>Number:</strong> {po.poNumber}</div>
          <div><strong>Status:</strong> {po.status}</div>
          <div><strong>Supplier:</strong> {po.supplier}</div>
          <div><strong>Items:</strong>
            <ul className="list-disc ml-6">
              {(po.items || []).map((it:any)=> <li key={it.itemId}>{it.itemId} — {it.quantity}</li>)}
            </ul>
          </div>
          <div className="flex gap-2">
            {po.status !== 'approved' && <button onClick={handleApprove} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>}
            {po.status === 'approved' && <button onClick={handleSend} className="px-3 py-1 rounded bg-blue-600 text-white">Send to Supplier</button>}
          </div>
        </div>
      ) : <div>No PO found.</div>}
    </div>
  );
}
