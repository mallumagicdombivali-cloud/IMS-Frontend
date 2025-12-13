"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../../components/lib/api";
import { useParams } from "next/navigation";

export default function PRDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [pr, setPr] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPR = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pr/${id}`);
      const data = await res.json();
      if (data.success) setPr(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchPR(); }, [id]);

  const handleApprove = async () => {
    if (!confirm("Approve this requisition?")) return;
    const res = await apiFetch(`/api/pr/${id}/approve`, { method: "POST" });
    if (res.ok) fetchPR();
    else alert("Failed to approve");
  };

  const handleReject = async () => {
    const reason = prompt("Reject reason (optional)", "");
    if (reason === null) return;
    const res = await apiFetch(`/api/pr/${id}/reject`, { method: "POST", body: JSON.stringify({ rejectionReason: reason }) });
    if (res.ok) fetchPR();
    else alert("Failed to reject");
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Purchase Requisition Details</h2>
      {loading ? <div>Loading...</div> : pr ? (
        <div className="space-y-4">
          <div><strong>ID:</strong> {pr._id}</div>
          <div><strong>Status:</strong> {pr.status}</div>
          <div><strong>Department:</strong> {pr.departmentId}</div>
          <div><strong>Items:</strong>
            <ul className="list-disc ml-6">
              {(pr.items || []).map((it:any)=> <li key={it.itemId}>{it.itemId} — {it.quantity}</li>)}
            </ul>
          </div>
          <div className="flex gap-2">
            <button onClick={handleApprove} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
            <button onClick={handleReject} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
          </div>
        </div>
      ) : <div>No PR found.</div>}
    </div>
  );
}
