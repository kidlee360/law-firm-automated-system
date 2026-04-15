// components/intake/ResidencyStep.tsx
import { useForm } from "react-hook-form";

export const ResidencyStep = () => {
  return (
    <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800">NY Residency Requirements</h2>
      <p className="text-slate-500">New York DRL §230 requires specific residency to file.</p>
      
      <div className="grid grid-cols-1 gap-4">
        <label className="flex flex-col">
          <span>How many years have you lived in NY continuously?</span>
          <input type="number" className="border p-2 rounded" placeholder="0" />
        </label>
        
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Were you married in New York State?</span>
        </label>

        <select className="border p-2 rounded">
          <option>Select Grounds for Divorce...</option>
          <option value="170.7">Irretrievable Breakdown (6+ Months)</option>
          <option value="170.1">Cruel and Inhuman Treatment</option>
          <option value="170.2">Abandonment (1+ Year)</option>
        </select>
      </div>
    </div>
  );
};