"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function NewItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    unit: "piece",
    description: "",
    minStock: 10,
    reorderLevel: 20
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert("Item created successfully!");
        router.push("/dashboard/inventory/items");
      } else {
        alert("Failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating item:", error);
      alert("Error creating item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
      </button>

      <div>
        <h2 className="text-3xl font-bold text-foreground">Add New Item</h2>
        <p className="text-muted-foreground">Create a new entry in the master catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-sm border border-taupe p-8 rounded-2xl space-y-6">
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Code</label>
            <input 
              required
              className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
              placeholder="e.g. ITEM-001"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Groceries">Groceries</option>
              <option value="Stationery">Stationery</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
          <input 
            required
            className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
            placeholder="e.g. Dell Latitude 5400"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none h-24 resize-none"
            placeholder="Item specifications..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <select 
              className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
            >
              <option value="piece">Piece</option>
              <option value="kg">Kg</option>
              <option value="ltr">Ltr</option>
              <option value="box">Box</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock</label>
            <input 
              type="number"
              className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
              value={formData.minStock}
              onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
            <input 
              type="number"
              className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({...formData, reorderLevel: Number(e.target.value)})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-foreground text-milk rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Create Item
        </button>
      </form>
    </div>
  );
}