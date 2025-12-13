"use client";

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../../components/lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users?page=1&limit=50');
    const d = await res.json();
    if (d.success) setUsers(d.data.users || d.data || []);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="rounded-xl border border-taupe bg-white/60 p-2">
        <table className="w-full text-sm text-left">
          <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/50">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-milk/50">
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{u.email}</td>
                <td className="px-6 py-4">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
