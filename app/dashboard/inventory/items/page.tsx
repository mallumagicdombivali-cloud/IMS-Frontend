"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { apiFetch } from "../../../components/lib/api"; 

interface Item {
  _id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  minStock: number;
  reorderLevel: number;
  currentStock?: number; 
}

export default function ItemsListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", limit: "50" });
      if (search) params.append("search", search);
      if (category) params.append("category", category);

      const res = await fetch(`/api/items?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data.items || data.data);
      }
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchItems(), 500);
    return () => clearTimeout(timer);
  }, [search, category]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
    
    // Optimistic update: Remove from UI immediately
    setItems(prev => prev.filter(item => item._id !== id));

    try {
      const res = await apiFetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.log([id]);
        alert("Failed to delete item on server.");
        fetchItems(); // Revert if failed
      }
    } catch (error) {
      console.error("Delete failed", error);
      fetchItems();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Inventory Items</h2>
          <p className="text-muted-foreground">Manage your master catalog and stock levels.</p>
        </div>
        {/* FIX: Link points to /new */}
        <Link 
          href="/dashboard/inventory/items/new" 
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-milk rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white/50 p-4 rounded-xl border border-taupe">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or code..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-taupe bg-white focus:outline-none focus:ring-2 focus:ring-camel/50"
          />
        </div>
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-taupe bg-white focus:outline-none focus:ring-2 focus:ring-camel/50 appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Groceries">Groceries</option>
            <option value="Stationery">Stationery</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-taupe bg-white/60 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-milk text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Item Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Min Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No items found.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-milk/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{item.code}</td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {item.name}
                      {(item.currentStock || 0) <= item.reorderLevel && (
                        <span className="ml-2 inline-flex items-center text-red-500" title="Low Stock">
                          <AlertTriangle className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-camel/10 text-camel text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.minStock} {item.unit}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* FIX: Explicit View Link */}
                        <Link href={`/dashboard/inventory/items/${item._id}`} className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {/* FIX: Explicit Edit Link */}
                        <Link href={`/dashboard/inventory/items/${item._id}/edit`} className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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