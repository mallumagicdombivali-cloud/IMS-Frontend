"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../../components/lib/api";
import Link from "next/link";

interface POShort {
  _id: string;
  poNumber?: string;
}

interface POFull {
  _id: string;
  items?: Array<{ itemId: string; quantity: number; unitPrice?: number; name?: string }>;
}

export default function NewGRNPage() {
  const [step, setStep] = useState(1);
  const [pos, setPos] = useState<POShort[]>([]);
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [poDetails, setPoDetails] = useState<POFull | null>(null);
  const [locations, setLocations] = useState<Array<{ _id: string; name: string }>>([]);
  const [itemsForm, setItemsForm] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApprovedPOs = async () => {
      const res = await fetch(`/api/po?page=1&limit=50&status=approved`);
      const data = await res.json();
      if (data.success) setPos(data.data.pos || data.data || []);
    };

    const fetchLocations = async () => {
      try {
        const res = await fetch(`/api/locations`);
        const data = await res.json();
        if (data.success) setLocations(data.data.locations || data.data || []);
      } catch (err) {
        // ignore missing endpoint
      }
    };

    fetchApprovedPOs();
    fetchLocations();
  }, []);

  const loadPoDetails = async (id: string) => {
    setSelectedPoId(id);
    setPoDetails(null);
    try {
      const res = await fetch(`/api/po/${id}`);
      const data = await res.json();
      if (data.success) {
        setPoDetails(data.data || data);
        // initialize form for items
        const init = (data.data.items || data.items || []).map((it: any) => ({
          itemId: it.itemId,
          receivedQuantity: it.quantity || 0,
          batchNumber: "",
          unitPrice: it.unitPrice || 0,
          expiryDate: "",
          locationId: locations[0]?._id || "",
        }));
        setItemsForm(init);
        setStep(2);
      } else {
        alert("Failed to load PO details");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load PO details");
    }
  };

  const updateItemForm = (idx: number, patch: any) => {
    setItemsForm((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  };

  const handleSubmit = async () => {
    if (!selectedPoId) return;
    if (!confirm("Create GRN and record received items?")) return;
    setSubmitting(true);
    try {
      const payload = {
        poId: selectedPoId,
        items: itemsForm.map((it) => ({
          itemId: it.itemId,
          batchNumber: it.batchNumber,
          quantity: Number(it.receivedQuantity),
          unitPrice: Number(it.unitPrice),
          expiryDate: it.expiryDate || undefined,
          locationId: it.locationId || undefined,
        })),
        notes: "Received via GRN created from UI",
      };

      const res = await apiFetch(`/api/grn`, { method: "POST", body: JSON.stringify(payload) });
      if (res.ok) {
        alert("GRN created successfully");
        // reset wizard
        setStep(1);
        setSelectedPoId(null);
        setPoDetails(null);
        setItemsForm([]);
      } else {
        const err = await res.text();
        alert("Failed to create GRN: " + err);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create GRN");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">New GRN</h2>
          <p className="text-muted-foreground">Record goods received against an approved PO.</p>
        </div>
        <Link href="/dashboard/procurement/po" className="px-4 py-2 bg-foreground text-milk rounded-lg">Back to POs</Link>
      </div>

      <div className="rounded-xl border border-taupe bg-white/60 p-6">
        {step === 1 && (
          <div>
            <h3 className="font-semibold mb-4">Step 1: Select Approved PO</h3>
            <div className="space-y-2">
              {pos.length === 0 ? (
                <div className="text-muted-foreground">No approved POs available.</div>
              ) : (
                pos.map((p) => (
                  <div key={p._id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="font-medium">{p.poNumber || p._id}</div>
                      <div className="text-sm text-muted-foreground">{p._id}</div>
                    </div>
                    <div>
                      <button onClick={() => loadPoDetails(p._id)} className="px-3 py-1 rounded bg-camel text-white">Select</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {step === 2 && poDetails && (
          <div>
            <h3 className="font-semibold mb-4">Step 2: Enter Batch / Expiry Details</h3>
            <div className="space-y-3">
              {poDetails.items && poDetails.items.length === 0 && (
                <div className="text-muted-foreground">No items found on the selected PO.</div>
              )}
              {(poDetails.items || []).map((it, idx) => (
                <div key={it.itemId} className="border rounded p-3 flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="font-medium">{it.name || it.itemId}</div>
                    <div className="text-sm text-muted-foreground">Ordered: {it.quantity}</div>
                  </div>
                  <div className="w-48">
                    <input value={itemsForm[idx]?.batchNumber || ''} onChange={(e) => updateItemForm(idx, { batchNumber: e.target.value })} placeholder="Batch #" className="w-full px-2 py-1 rounded border" />
                  </div>
                  <div className="w-28">
                    <input type="number" value={itemsForm[idx]?.receivedQuantity || ''} onChange={(e) => updateItemForm(idx, { receivedQuantity: e.target.value })} placeholder="Qty" className="w-full px-2 py-1 rounded border" />
                  </div>
                  <div className="w-28">
                    <input type="number" value={itemsForm[idx]?.unitPrice || ''} onChange={(e) => updateItemForm(idx, { unitPrice: e.target.value })} placeholder="Unit Price" className="w-full px-2 py-1 rounded border" />
                  </div>
                  <div className="w-48">
                    <input type="date" value={itemsForm[idx]?.expiryDate || ''} onChange={(e) => updateItemForm(idx, { expiryDate: e.target.value })} className="w-full px-2 py-1 rounded border" />
                  </div>
                  <div className="w-48">
                    <select value={itemsForm[idx]?.locationId || ''} onChange={(e) => updateItemForm(idx, { locationId: e.target.value })} className="w-full px-2 py-1 rounded border">
                      <option value="">Select location</option>
                      {locations.map((loc) => <option key={loc._id} value={loc._id}>{loc.name}</option>)}
                    </select>
                  </div>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <button onClick={() => { setStep(1); setPoDetails(null); setSelectedPoId(null); }} className="px-4 py-2 rounded bg-gray-200">Back</button>
                <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 rounded bg-foreground text-milk">{submitting ? 'Submitting...' : 'Create GRN'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
