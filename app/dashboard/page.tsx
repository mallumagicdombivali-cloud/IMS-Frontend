"use client";

import React, { useEffect, useState } from "react";
import DashboardMetricCard from "../components/DashboardMetricCard";
import { 
  AlertTriangle, 
  Clock, 
  FileText, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";

// Define interfaces for your API data
interface ActivityData {
  dayName: string;
  orders: number;
  received: number;
}

interface StockHealthData {
  name: string;
  value: number;
  color: string;
  [key: string]: any ;
}

interface AuditLog {
  _id: string;
  entity: string; // e.g., "Item", "PR", "PO"
  action: string; // e.g., "CREATE", "UPDATE"
  performedBy: {
    name: string;
  };
  createdAt: string;
  details?: string; // Assuming details might contain item info
}

export default function DashboardPage() {
  // State for Summary Stats
  const [stats, setStats] = useState({
    lowStock: 0,
    expiring: 0,
    pendingPR: 0,
    pendingIssues: 0,
  });

  // State for Charts & Tables
  const [chartData, setChartData] = useState<ActivityData[]>([]);
  const [pieData, setPieData] = useState<StockHealthData[]>([]);
  const [totalSkus, setTotalSkus] = useState(0);
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Summary Stats & Visual Data in parallel
        const [
            reorderRes, 
            expiryRes, 
            prRes, 
            issuesRes,
            activityRes,
            stockHealthRes,
            auditRes
        ] = await Promise.all([
          fetch("/api/system/check-reorder"),
          fetch("/api/system/check-expiry?days=30"),
          fetch("/api/pr?status=pending&limit=5"),
          fetch("/api/issues?status=pending"),
          fetch("/api/reports/activity-history"), // New Endpoint
          fetch("/api/reports/stock-health"),     // New Endpoint
          fetch("/api/audit?limit=5")             // Existing Endpoint for Table
        ]);

        const reorderData = await reorderRes.json();
        const expiryData = await expiryRes.json();
        const prData = await prRes.json();
        const issuesData = await issuesRes.json();
        const activityData = await activityRes.json();
        const stockHealthData = await stockHealthRes.json();
        const auditData = await auditRes.json();

        // 2. Update Stats State
        setStats({
          lowStock: reorderData.data?.count || 0,
          expiring: expiryData.data?.summary?.expiringCount || 0,
          pendingPR: prData.data?.pagination?.total || prData.data?.length || 0,
          pendingIssues: issuesData.data?.pagination?.total || issuesData.data?.length || 0,
        });

        // 3. Update Chart State
        if (activityData.success) {
            setChartData(activityData.data);
        }

        // 4. Update Pie Chart State
        if (stockHealthData.success) {
            setPieData(stockHealthData.data.distribution);
            setTotalSkus(stockHealthData.data.totalSkus);
        }

        // 5. Update Table State (Audit Logs)
        if (auditData.success) {
            setRecentActivity(auditData.data); 
        }

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to format date nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
  };

  // Helper to color code audit actions
  const getActionColor = (action: string) => {
    switch(action.toUpperCase()) {
        case 'CREATE': return 'bg-green-100 text-green-700';
        case 'DELETE': return 'bg-red-100 text-red-700';
        case 'UPDATE': return 'bg-blue-100 text-blue-700';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Overview</h2>
          <p className="text-muted-foreground mt-1">
            Real-time insights into your inventory health.
          </p>
        </div>
        <div className="text-sm text-muted-foreground bg-white/50 px-4 py-2 rounded-lg border border-taupe/50">
           Date: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </div>
      </div>

      {/* 1. Summary Cards Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          loading={loading}
          title="Low Stock Alerts"
          value={stats.lowStock}
          icon={AlertTriangle}
          trendChange={stats.lowStock > 0 ? "Urgent Action" : "Optimal"}
          trendType={stats.lowStock > 0 ? "down" : "up"}
        />
        <DashboardMetricCard
          loading={loading}
          title="Expiring (30 Days)"
          value={stats.expiring}
          icon={Clock}
          trendChange={stats.expiring > 0 ? "Check Batches" : "Safe"}
          trendType={stats.expiring > 0 ? "down" : "neutral"}
        />
        <DashboardMetricCard
          loading={loading}
          title="Pending PRs"
          value={stats.pendingPR}
          icon={FileText}
          trendChange="Awaiting Approval"
          trendType={stats.pendingPR > 0 ? "neutral" : "up"}
        />
        <DashboardMetricCard
          loading={loading}
          title="Issue Requests"
          value={stats.pendingIssues}
          icon={AlertCircle}
          trendChange="Needs Fulfillment"
          trendType={stats.pendingIssues > 0 ? "down" : "neutral"}
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid gap-6 md:grid-cols-3 h-[400px]">
        
        {/* Main Line Chart (Procurement Activity) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 rounded-2xl border border-taupe bg-white/60 backdrop-blur-sm p-6 shadow-sm"
        >
          <Link href="/dashboard/procurement/po">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Procurement Activity</h3>
              <p className="text-sm text-muted-foreground">Orders Placed vs. Received (Last 7 Days)</p>
            </div>
            <div className="p-2 bg-milk rounded-lg border border-taupe">
                <TrendingUp className="w-5 h-5 text-camel" />
            </div>
          </div>
          </Link>
          
        <Link href = "/dashboard/procurement/po">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9B59C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9B59C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="dayName" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="orders" stroke="#C9B59C" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                <Area type="monotone" dataKey="received" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReceived)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </Link>
        </motion.div>

        {/* Donut Chart (Inventory Health) */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="rounded-2xl border border-taupe bg-white/60 backdrop-blur-sm p-6 shadow-sm flex flex-col"
        >
        <Link href="/dashboard/inventory/items">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Stock Health</h3>
            <p className="text-sm text-muted-foreground">Distribution by Status</p>
          </div>
        </Link>

          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
          <Link href="/dashboard/inventory/items"> 
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-bold text-foreground">{totalSkus}</span>
                <span className="text-xs text-muted-foreground">Total SKUs</span>
            </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 3. Recent Activity Table (Using /api/audit) */}
      <div className="rounded-2xl border border-taupe bg-white/60 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="p-6 border-b border-taupe flex justify-between items-center">
             <div>
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest system audit logs</p>
             </div>
             <Link href="/dashboard/reports" className="text-sm text-camel font-medium hover:text-foreground flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
             </Link>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Entity Type</th>
                        <th className="px-6 py-4">Performed By</th>
                        <th className="px-6 py-4">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-taupe/50">
                    {loading ? (
                       <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading recent activity...</td></tr>
                    ) : recentActivity.length === 0 ? (
                       <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No recent activity found.</td></tr>
                    ) : (
                      recentActivity.map((log) => (
                        <tr key={log._id} className="hover:bg-milk/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                #{log._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                    {log.action}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-foreground">
                                {log.entity}
                            </td>
                            <td className="px-6 py-4 text-foreground">
                                {log.performedBy?.name || "System"}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {formatDate(log.createdAt)}
                            </td>
                        </tr>
                      ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}