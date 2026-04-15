"use client";
import { Plus, Trash2, Home, Landmark, Car } from "lucide-react";
import { useState } from "react";

export function AssetTracker() {
  const [assets, setAssets] = useState([{ type: 'real_estate', desc: '', value: 0 }]);

  const addAsset = () => setAssets([...assets, { type: 'bank_account', desc: '', value: 0 }]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-tight text-slate-500">Marital Assets</h3>
        <button 
          onClick={addAsset}
          className="text-xs flex items-center gap-1 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200"
        >
          <Plus className="h-3 w-3" /> Add Asset
        </button>
      </div>

      {assets.map((asset, index) => (
        <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-200">
          <select className="text-sm border rounded p-1 bg-white">
            <option value="real_estate">🏠 Real Estate</option>
            <option value="bank_account">💰 Bank/Brokerage</option>
            <option value="vehicle">🚗 Vehicle</option>
            <option value="retirement">📈 Retirement/401k</option>
          </select>
          
          <input 
            placeholder="Description (e.g. Chase Savings ...1234)" 
            className="flex-1 text-sm border rounded p-1"
          />

          <div className="relative">
            <span className="absolute left-2 top-1.5 text-slate-400 text-sm">$</span>
            <input 
              type="number" 
              placeholder="Value" 
              className="w-24 text-sm border rounded p-1 pl-5"
            />
          </div>

          <button className="text-slate-400 hover:text-red-500 pt-1">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}