"use client";

import React, { useEffect, useState } from "react";
import { Save, AlertCircle, Loader2 } from "lucide-react";

interface SimpleItem {
  _id: string;
  name: string;
  code: string;
}

interface SimpleBatch {
  _id: string;
  batchNumber: string;
  quantity: number;
}

interface SimpleLocation {
    _id: string;
    name: string;
}

export default function StockAdjustmentPage() {
  // Form State
  const [formData, setFormData] = useState({
    itemId: "",
    batchId: "",
    locationId: "",
    quantity: 0,
    reason: "Physical count adjustment",
    notes: ""
  });

  // Data Lists for Dropdowns
  const [items, setItems] = useState<SimpleItem[]>([]);
  const [batches, setBatches] = useState<SimpleBatch[]>([]);
  const [locations, setLocations] = useState<SimpleLocation[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // 1. Fetch Items & Locations on Load
  useEffect(() => {
    const initData = async () => {
        const [itemsRes, locRes] = await Promise.all([
            fetch('/api/items?limit=100'), // Fetch all items (simplified)
            fetch('/api/locations')
        ]);
        const iData = await itemsRes.json();
        const lData = await locRes.json();
        
        if (iData.success) setItems(iData.data.items || iData.data);
        if (lData.success) setLocations(lData.data);
    };
    initData();
  }, []);

  // 2. Fetch Batches when Item Selected
  useEffect(() => {
    if (!formData.itemId) {
        setBatches([]);
        return;
    }
    const fetchBatches = async () => {
        const res = await fetch(`/api/items/${formData.itemId}/batches`);
        const data = await res.json();
        if (data.success) setBatches(data.data);
    };
    fetchBatches();
  }, [formData.itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
        const res = await fetch("/api/stock/adjust", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        if (data.success) {
            setSuccess("Stock adjusted successfully!");
            // Reset form
            setFormData(prev => ({ ...prev, quantity: 0, notes: "", batchId: "" }));
        } else {
            alert("Failed: " + data.message);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Stock Adjustment</h2>
        <p className="text-muted-foreground">Manually correct stock levels for damage, theft, or audit corrections.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-sm border border-taupe p-8 rounded-2xl space-y-6">
        
        {/* Item Selection */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
            <select 
                required
                className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
                value={formData.itemId}
                onChange={(e) => setFormData({...formData, itemId: e.target.value})}
            >
                <option value="">-- Choose Item --</option>
                {items.map(i => (
                    <option key={i._id} value={i._id}>{i.name} ({i.code})</option>
                ))}
            </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
            {/* Batch Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
                <select 
                    required
                    className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
                    value={formData.batchId}
                    onChange={(e) => setFormData({...formData, batchId: e.target.value})}
                    disabled={!formData.itemId}
                >
                    <option value="">-- Choose Batch --</option>
                    {batches.map(b => (
                        <option key={b._id} value={b._id}>{b.batchNumber} (Qty: {b.quantity})</option>
                    ))}
                </select>
            </div>

             {/* Location Selection */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select 
                    required
                    className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
                    value={formData.locationId}
                    onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                >
                    <option value="">-- Choose Location --</option>
                    {locations.map(l => (
                        <option key={l._id} value={l._id}>{l.name}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Quantity and Reason */}
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adjustment Quantity</label>
                <input 
                    type="number"
                    required
                    className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
                    placeholder="+5 or -5"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground mt-1">Use negative (-) to remove stock.</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <select 
                    className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                >
                    <option value="Physical count adjustment">Physical count adjustment</option>
                    <option value="Damage">Damaged / Broken</option>
                    <option value="Theft">Theft / Loss</option>
                    <option value="Found">Found Extra Item</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea 
                className="w-full p-3 rounded-lg border border-taupe bg-white focus:ring-2 focus:ring-camel/50 outline-none h-24 resize-none"
                placeholder="Any additional details..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
        </div>

        {success && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {success}
            </div>
        )}

        <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-foreground text-milk rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Confirm Adjustment
        </button>

      </form>
    </div>
  );
}