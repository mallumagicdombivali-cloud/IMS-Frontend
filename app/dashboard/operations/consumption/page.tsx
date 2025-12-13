"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../components/lib/api";

export default function ConsumptionPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [theoreticalQty, setTheoreticalQty] = useState<number | ''>('');
  const [actualQty, setActualQty] = useState<number | ''>('');
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items?page=1&limit=100');
      const d = await res.json();
      if (d.success) setItems(d.data.items || d.data || []);
    } catch (err) { console.error(err); }
  };

  const variance = (theoreticalQty === '' || actualQty === '') ? '' : Number(theoreticalQty) - Number(actualQty);

  const handleSubmit = async () => {
    if (!selectedItem || theoreticalQty === '' || actualQty === '') return alert('Fill required fields');
    setSubmitting(true);
    try {
      const payload = {
        itemId: selectedItem,
        theoreticalQty: Number(theoreticalQty),
        actualQty: Number(actualQty),
        notes,
      };
      const res = await apiFetch('/api/consumption', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) {
        alert('Consumption logged');
        setSelectedItem(''); setTheoreticalQty(''); setActualQty(''); setNotes('');
      } else {
        const err = await res.text();
        alert('Failed: ' + err);
      }
    } catch (err) { console.error(err); alert('Submit failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Consumption Log</h2>
        <p className="text-muted-foreground">Record daily consumption and check variance.</p>
      </div>

      <div className="rounded-xl border border-taupe bg-white/60 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground">Item</label>
            <select value={selectedItem} onChange={(e)=>setSelectedItem(e.target.value)} className="w-full px-2 py-2 rounded border">
              <option value="">Select item</option>
              {items.map(it => <option key={it._id} value={it._id}>{it.name} ({it.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Theoretical Quantity</label>
            <input type="number" value={theoreticalQty as any} onChange={(e)=>setTheoreticalQty(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-2 rounded border" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Actual Quantity</label>
            <input type="number" value={actualQty as any} onChange={(e)=>setActualQty(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-2 rounded border" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-muted-foreground">Notes</label>
            <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full px-2 py-2 rounded border" rows={3}></textarea>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">Variance: <strong>{variance === '' ? '-' : variance}</strong></div>
          <div>
            <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 rounded bg-foreground text-milk">{submitting ? 'Saving...' : 'Save Consumption'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
