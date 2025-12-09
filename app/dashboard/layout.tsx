"use client";

import React, { useState } from "react";
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
  const handleLogout = () => {
    // 1. Clear the auth cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    // 2. Clear local storage
    localStorage.clear();
    
    // 3. Redirect to login
    router.push("/login");
  };

  // Main Navigation Links
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Inventory",
      href: "/dashboard/inventory/items",
      icon: <Package className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Procurement",
      href: "/dashboard/procurement/po",
      icon: <ShoppingCart className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Operations",
      href: "/dashboard/operations/issues",
      icon: <Truck className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: <FileText className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Admin",
      href: "/dashboard/admin/users",
      icon: <Users className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
  ];

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
                icon: <Settings className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
              }}
            />
            
            {/* Logout Button (Using onClick) */}
            <SidebarLink
              link={{
                label: "Logout",
                href: "#", // Ignored because onClick is present
                icon: <LogOut className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
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
        className="flex-shrink-0 w-150 h-50 object-contain"
      />
    </Link>
  );
};
