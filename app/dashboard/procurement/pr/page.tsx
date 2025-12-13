"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../components/lib/api";
import Link from "next/link";
import { Check, X, Eye } from "lucide-react";

interface PRItem {
  _id: string;
  departmentId?: string;
  status?: string;
  requestedBy?: string;
  items?: any[];
  createdAt?: string;
}

export default function PRListPage() {
  const [prs, setPrs] = useState<PRItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const fetchPRs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pr?page=1&limit=50&status=pending`);
      const data = await res.json();
      if (data.success) setPrs(data.data.prs || data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRole = async () => {
    try {
      const res = await fetch(`/api/me`);
      if (!res.ok) return;
      const data = await res.json();
      setRole(data?.role || null);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchPRs();
    fetchRole();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Approve this requisition?")) return;
    try {
      const res = await apiFetch(`/api/pr/${id}/approve`, { method: "POST" });
      if (res.ok) fetchPRs();
      else alert("Failed to approve PR");
    } catch (err) {
      console.error(err);
      alert("Failed to approve PR");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Reject reason (optional)", "");
    if (reason === null) return; // cancelled
    try {
      const res = await apiFetch(`/api/pr/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ rejectionReason: reason }),
      });
      if (res.ok) fetchPRs();
      else alert("Failed to reject PR");
    } catch (err) {
      console.error(err);
      alert("Failed to reject PR");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Purchase Requisitions</h2>
          <p className="text-muted-foreground">List of purchase requisitions and pending approvals.</p>
        </div>
        <Link href="/dashboard/procurement/po" className="px-4 py-2 bg-foreground text-milk rounded-lg">View POs</Link>
      </div>

      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">PR #</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Requested By</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : prs.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No requisitions found.</td></tr>
            ) : (
              prs.map((pr) => (
                <tr key={pr._id} className="hover:bg-milk/50">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{pr._id}</td>
                  <td className="px-6 py-4">{pr.departmentId || '-'}</td>
                  <td className="px-6 py-4">{pr.requestedBy || '-'}</td>
                  <td className="px-6 py-4 capitalize">{pr.status}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/procurement/pr/${pr._id}`} className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"><Eye className="w-4 h-4"/></Link>
                      {(role === 'admin' || role === 'hod' || role === 'accounts') && pr.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(pr._id)} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
                          <button onClick={() => handleReject(pr._id)} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
                        </>
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
