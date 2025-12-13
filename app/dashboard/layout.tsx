"use client";

import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  FileText, 
  Users, 
  LogOut, 
  Settings 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "../components/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Handle Logout Logic
  const handleLogout = async () => {
    try {
      // Call backend logout to clear refresh tokens server-side (ensure cookies included)
      const res = await apiFetch('/api/auth/logout', { method: 'POST', credentials: 'include' as RequestCredentials });
      if (!res.ok) {
        const text = await res.text().catch(()=>undefined);
        console.warn('Logout failed:', res.status, text);
      }
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      // Clear client-side cookies and local storage items
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      } catch (e) {
        // ignore
      }

      // Replace history to login page to prevent back navigation
      router.replace('/login');
    }
  };

  // Role-aware navigation links
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    // Prefer localStorage cached role
    const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    if (r) {
      setRole(r);
      return;
    }

    // Fallback to /api/auth/me
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return;
        const d = await res.json();
        setRole(d?.data?.user?.role || null);
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  const links = React.useMemo(() => {
    // Default common links
    const base = [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="text-neutral-700 h-5 w-5 shrink-0" />,
      },
    ];

    // Inventory: visible to most roles
    base.push({ label: "Inventory", href: "/dashboard/inventory/items", icon: <Package className="text-neutral-700 h-5 w-5 shrink-0" /> });

    // Role specific additions
    if (role === 'admin') {
      base.push({ label: "Procurement", href: "/dashboard/procurement/po", icon: <ShoppingCart className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Operations", href: "/dashboard/operations/issues", icon: <Truck className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Reports", href: "/dashboard/reports", icon: <FileText className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Admin Console", href: "/dashboard/admin", icon: <Users className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Admin", href: "/dashboard/admin/users", icon: <Users className="text-neutral-700 h-5 w-5 shrink-0" /> });
      return base;
    }

    if (role === 'storekeeper') {
      base.push({ label: "Procurement (GRN)", href: "/dashboard/procurement/grn/new", icon: <ShoppingCart className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Operations", href: "/dashboard/operations/issues", icon: <Truck className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Reports", href: "/dashboard/reports", icon: <FileText className="text-neutral-700 h-5 w-5 shrink-0" /> });
      return base;
    }

    if (role === 'hod') {
      base.push({ label: "Procurement (PR)", href: "/dashboard/procurement/pr", icon: <ShoppingCart className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Operations", href: "/dashboard/operations/issues", icon: <Truck className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Reports", href: "/dashboard/reports", icon: <FileText className="text-neutral-700 h-5 w-5 shrink-0" /> });
      return base;
    }

    if (role === 'accounts') {
      base.push({ label: "Procurement", href: "/dashboard/procurement/po", icon: <ShoppingCart className="text-neutral-700 h-5 w-5 shrink-0" /> });
      base.push({ label: "Reports", href: "/dashboard/reports", icon: <FileText className="text-neutral-700 h-5 w-5 shrink-0" /> });
      return base;
    }

    // Default fallback for anonymous or unknown roles
    base.push({ label: "Procurement", href: "/dashboard/procurement/po", icon: <ShoppingCart className="text-neutral-700 h-5 w-5 shrink-0" /> });
    base.push({ label: "Operations", href: "/dashboard/operations/issues", icon: <Truck className="text-neutral-700 h-5 w-5 shrink-0" /> });
    base.push({ label: "Reports", href: "/dashboard/reports", icon: <FileText className="text-neutral-700 h-5 w-5 shrink-0" /> });
    return base;
  }, [role]);

  return (
    <div className="flex flex-col md:flex-row bg-background w-full h-screen overflow-hidden font-sans">
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          
          {/* Top Section: Logo + Nav Links */}
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom Section: Settings + Logout */}
          <div>
            <SidebarLink
              link={{
                label: "Settings",
                href: "/dashboard/settings",
                icon: <Settings className="text-neutral-700 h-5 w-5 shrink-0" />,
              }}
            />
            
            {/* Logout Button (Using onClick) */}
            <SidebarLink
              link={{
                label: "Logout",
                href: "#", // Ignored because onClick is present
                icon: <LogOut className="text-neutral-700 h-5 w-5 shrink-0" />,
                onClick: handleLogout, 
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-milk">
        <div className="max-w-7xl mx-auto h-full">
            {children}
        </div>
      </main>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-foreground py-1 relative z-20"
    >
      <Image 
        src="/images/logo.png" 
        alt="Mallu Magic Logo" 
        width={150} 
        height={100} 
        className="shrink-0 w-150 h-50 object-contain"
      />
    </Link>
  );
};
