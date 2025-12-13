"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Box, Calendar, MapPin, Package } from "lucide-react";
import { apiFetch } from "../../../../components/lib/api";

interface Batch {
  _id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  locationId: string; // Or populated location object
}

interface ItemDetails {
  _id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  minStock: number;
  reorderLevel: number;
}

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Item Details
        const itemRes = await apiFetch(`/api/items/${id}`);
        const itemData = await itemRes.json();
        
        // Fetch Batches
        const batchesRes = await apiFetch(`/api/items/${id}/batches`);
        const batchesData = await batchesRes.json();

        if (itemData.success) setItem(itemData.data);
        if (batchesData.success) setBatches(batchesData.data);
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading details...</div>;
  if (!item) return <div className="p-8 text-center text-red-500">Item not found</div>;

  return (
    <div className="w-full space-y-6">
      {/* Navigation */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Inventory
      </button>

      {/* Item Overview Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl border border-taupe bg-white/60 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{item.name}</h1>
              <p className="text-sm font-mono text-muted-foreground">{item.code}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-camel/10 text-camel text-sm font-medium">
              {item.category}
            </span>
          </div>
          
          <div className="p-4 bg-milk rounded-xl border border-taupe/50 text-sm text-gray-600">
            {item.description || "No description provided."}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <span className="text-xs text-muted-foreground uppercase block">Unit</span>
              <span className="font-medium text-foreground capitalize">{item.unit}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase block">Min Stock</span>
              <span className="font-medium text-foreground">{item.minStock}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase block">Reorder Level</span>
              <span className="font-medium text-foreground">{item.reorderLevel}</span>
            </div>
          </div>
        </div>

        {/* Total Stock Summary (Calculated from batches if not in item object) */}
        <div className="rounded-2xl border border-taupe bg-foreground text-milk p-6 flex flex-col justify-center items-center text-center">
            <Package className="w-8 h-8 mb-2 opacity-80" />
            <span className="text-4xl font-bold">
                {batches.reduce((acc, b) => acc + b.quantity, 0)}
            </span>
            <span className="text-sm opacity-70 uppercase tracking-wider mt-1">Total Current Stock</span>
        </div>
      </div>

      {/* Batches Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Box className="w-5 h-5 text-camel" /> Active Batches
        </h3>
        <div className="rounded-xl border border-taupe bg-white/60 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-milk text-muted-foreground uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Batch Number</th>
                        <th className="px-6 py-4">Expiry Date</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4 text-right">Quantity</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-taupe/50">
                    {batches.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No active batches. Stock is zero.</td></tr>
                    ) : (
                        batches.map((batch) => (
                            <tr key={batch._id} className="hover:bg-milk/50">
                                <td className="px-6 py-4 font-mono font-medium">{batch.batchNumber}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    {new Date(batch.expiryDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-gray-400" />
                                        {/* Assuming locationId is a string, ideally API populates name */}
                                        {batch.locationId || "Main Warehouse"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-foreground">
                                    {batch.quantity}
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