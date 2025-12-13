"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../components/lib/api";
import { Users, FileText, Database, MapPin, Archive, ShieldCheck } from "lucide-react";

const AdminCard = ({ title, description, href, icon }: { title: string; description?: string; href: string; icon: React.ReactNode }) => (
  <Link href={href} className="block p-6 rounded-xl border hover:shadow-lg transition-shadow bg-white/70">
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-md bg-camel/10 text-camel shrink-0">{icon}</div>
      <div>
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  </Link>
);

export default function AdminIndex() {
  const [role, setRole] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({ users: 0, items: 0, suppliers: 0 });

  useEffect(() => {
    const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    if (r) setRole(r);
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const d = await res.json();
          setRole(d?.data?.user?.role || r);
        }
      } catch (err) {}

      // quick stats (best-effort)
      try {
        const [uRes, iRes, sRes] = await Promise.all([
          fetch('/api/users?page=1&limit=1'),
          fetch('/api/items?page=1&limit=1'),
          fetch('/api/suppliers?page=1&limit=1'),
        ]);
        const [u, i, s] = await Promise.all([uRes.json().catch(()=>null), iRes.json().catch(()=>null), sRes.json().catch(()=>null)]);
        setStats({ users: u?.data?.total || 0, items: i?.data?.total || 0, suppliers: s?.data?.total || 0 });
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  if (role !== 'admin') {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold">Admin Area</h2>
        <div className="mt-4 p-6 rounded border bg-white/60">You do not have permission to view this page.</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground">Centralized control panel for administrative tasks.</p>
        </div>
        <div className="flex gap-4">
          <div className="p-4 rounded-lg bg-white/70 border">
            <div className="text-xs text-muted-foreground">Users</div>
            <div className="text-xl font-semibold">{stats.users}</div>
          </div>
          <div className="p-4 rounded-lg bg-white/70 border">
            <div className="text-xs text-muted-foreground">Items</div>
            <div className="text-xl font-semibold">{stats.items}</div>
          </div>
          <div className="p-4 rounded-lg bg-white/70 border">
            <div className="text-xs text-muted-foreground">Suppliers</div>
            <div className="text-xl font-semibold">{stats.suppliers}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminCard title="User Management" description="Create, update and manage users" href="/dashboard/admin/users" icon={<Users className="w-5 h-5" />} />
        <AdminCard title="Departments" description="Manage departments and HODs" href="/dashboard/admin/departments" icon={<ShieldCheck className="w-5 h-5" />} />
        <AdminCard title="Locations" description="Warehouse and storage locations" href="/dashboard/admin/locations" icon={<MapPin className="w-5 h-5" />} />
        <AdminCard title="Suppliers" description="Manage supplier master data" href="/dashboard/admin/suppliers" icon={<Archive className="w-5 h-5" />} />
        <AdminCard title="Audit Logs" description="Review system audit logs" href="/dashboard/admin/audit" icon={<FileText className="w-5 h-5" />} />
        <AdminCard title="Reports" description="Run and cache reports" href="/dashboard/reports" icon={<Database className="w-5 h-5" />} />
      </div>

      <div className="rounded-xl border border-taupe bg-white/60 p-6">
        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={async ()=> { if(!confirm('Generate reports cache?')) return; await apiFetch('/api/system/generate-reports', { method: 'POST' }); alert('Triggered'); }} className="px-4 py-2 rounded bg-camel text-white">Generate Reports Cache</button>
          <button onClick={async ()=> { if(!confirm('Run reorder check?')) return; await apiFetch('/api/system/check-reorder', { method: 'POST' }); alert('Triggered'); }} className="px-4 py-2 rounded bg-foreground text-milk">Check Reorder Levels</button>
        </div>
      </div>
    </div>
  );
}
