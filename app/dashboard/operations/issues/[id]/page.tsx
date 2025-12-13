"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function IssueDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) fetchIssue(); }, [id]);

  const fetchIssue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues/${id}`);
      const d = await res.json();
      if (d.success) setIssue(d.data || d);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Issue Request Details</h2>
      {loading ? <div>Loading...</div> : issue ? (
        <div className="space-y-3">
          <div><strong>ID:</strong> {issue._id}</div>
          <div><strong>Status:</strong> {issue.status}</div>
          <div><strong>Items:</strong>
            <ul className="list-disc ml-6">{(issue.items||[]).map((it:any)=> <li key={it.itemId}>{it.itemId} — {it.quantity}</li>)}</ul>
          </div>
        </div>
      ) : <div>No issue found.</div>}
    </div>
  );
}
