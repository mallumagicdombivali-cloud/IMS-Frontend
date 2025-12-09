"use client";

import React, { useEffect, useState } from 'react';
import DashboardMetricCard from '../components/DashboardMetricCard';
import { AlertTriangle, Clock, FileText, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    lowStock: 0,
    expiring: 0,
    pendingPR: 0,
    pendingIssues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all 4 endpoints in parallel
        const [reorderRes, expiryRes, prRes, issuesRes] = await Promise.all([
          fetch('/api/system/check-reorder'),
          fetch('/api/system/check-expiry?days=30'),
          fetch('/api/pr?status=pending&limit=5'),
          fetch('/api/issues?status=pending')
        ]);

        const reorderData = await reorderRes.json();
        const expiryData = await expiryRes.json();
        const prData = await prRes.json();
        const issuesData = await issuesRes.json();

        setStats({
          lowStock: reorderData.data?.count || 0,
          expiring: expiryData.data?.summary?.expiringCount || 0,
          pendingPR: prData.data?.pagination?.total || prData.data?.length || 0,
          pendingIssues: issuesData.data?.pagination?.total || issuesData.data?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-camel">Overview</h2>
        <p className="text-gray-500 mt-2">Welcome back. Here is what needs your attention today.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Low Stock Card */}
        <DashboardMetricCard
          loading={loading}
          title="Low Stock Items"
          value={stats.lowStock}
          icon={AlertTriangle}
          trendChange={stats.lowStock > 0 ? "Action Required" : "Healthy"}
          trendType={stats.lowStock > 0 ? "down" : "up"} 
        />

        {/* 2. Expiring Soon Card */}
        <DashboardMetricCard
          loading={loading}
          title="Expiring (30 Days)"
          value={stats.expiring}
          icon={Clock}
          trendChange={stats.expiring > 0 ? "Check Batch" : "No Issues"}
          trendType={stats.expiring > 0 ? "down" : "neutral"}
        />

        {/* 3. Pending PRs Card */}
        <DashboardMetricCard
          loading={loading}
          title="Pending PRs"
          value={stats.pendingPR}
          icon={FileText}
          trendChange="Awaiting Approval"
          trendType="neutral"
        />

        {/* 4. Pending Issues Card */}
        <DashboardMetricCard
          loading={loading}
          title="Pending Issues"
          value={stats.pendingIssues}
          icon={AlertCircle}
          trendChange="Needs Action"
          trendType={stats.pendingIssues > 0 ? "down" : "neutral"}
        />
      </div>

      {/* Placeholders for future Charts/Tables */}
      <div className="grid gap-6 md:grid-cols-2 h-96">
        <div className="rounded-xl border border-taupe bg-white/50 p-6">
            <h3 className="text-lg font-medium text-camel mb-4">Stock Valuation</h3>
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-taupe rounded-lg">
                Chart Placeholder
            </div>
        </div>
        <div className="rounded-xl border border-taupe bg-white/50 p-6">
            <h3 className="text-lg font-medium text-camel mb-4">Recent Activity</h3>
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-taupe rounded-lg">
                List Placeholder
            </div>
        </div>
      </div>
    </div>
  );
}