"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../components/lib/api";
import Link from "next/link";

interface Issue {
  _id: string;
  departmentId?: string;
  status?: string;
  items?: Array<{ itemId: string; quantity: number }>;
  requestedBy?: string;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchIssues();
    // try get role from localStorage first
    const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    if (r) setRole(r);
    else fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return;
      const d = await res.json();
      setRole(d?.data?.user?.role || null);
    } catch (err) {
      // ignore
    }
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/issues?page=1&limit=50&status=pending');
      const data = await res.json();
      if (data.success) setIssues(data.data.issues || data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (id: string) => {
    if (!confirm('Issue items and deduct FIFO stock?')) return;
    try {
      const res = await apiFetch(`/api/issues/${id}/issue`, { method: 'POST' });
      if (res.ok) fetchIssues();
      else alert('Failed to issue items');
    } catch (err) {
      console.error(err);
      alert('Failed to issue items');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Issue Requests</h2>
          <p className="text-muted-foreground">Department requests awaiting action.</p>
        </div>
        <Link href="/dashboard/operations/consumption" className="px-4 py-2 bg-foreground text-milk rounded-lg">Consumption</Link>
      </div>

      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Request #</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Requested By</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : issues.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No requests found.</td></tr>
            ) : (
              issues.map((it) => (
                <tr key={it._id} className="hover:bg-milk/50">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{it._id}</td>
                  <td className="px-6 py-4">{it.departmentId || '-'}</td>
                  <td className="px-6 py-4">{it.requestedBy || '-'}</td>
                  <td className="px-6 py-4 capitalize">{it.status}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Storekeeper can 'Issue' directly */}
                      {role === 'storekeeper' && it.status === 'pending' && (
                        <button onClick={() => handleIssue(it._id)} className="px-3 py-1 rounded bg-camel text-white">Issue</button>
                      )}
                      <Link href={`/dashboard/operations/issues/${it._id}`} className="px-3 py-1 rounded bg-gray-100">View</Link>
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
