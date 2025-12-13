"use client";

import React from "react";
import Link from "next/link";

export default function ReportsIndex() {
  const cards = [
    { title: 'Stock Balance', href: '/dashboard/reports/stock' },
    { title: 'Valuation', href: '/dashboard/reports/valuation' },
    { title: 'Supplier Performance', href: '/dashboard/reports/supplier-performance' },
    { title: 'Wastage', href: '/dashboard/reports/wastage' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-4">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="p-6 rounded-lg border hover:shadow-md bg-white/60">
            <div className="text-xl font-semibold">{c.title}</div>
            <div className="text-sm text-muted-foreground mt-2">View details</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
