import { AssetTracker } from "@/app/components/intake/AssetTracker";
import { toast } from "sonner";

export default function ClientPortal() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Welcome, [Client Name]</h1>
        <p className="text-slate-600">Please list your marital assets below to help your attorney prepare your Statement of Net Worth.</p>
      </header>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Your Financial Assets</h2>
        <AssetTracker onChange={(assets) => console.log("Assets updated:", assets)} />
        
        <button className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700">
          Submit to Attorney
        </button>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> All information shared here is protected by attorney-client privilege and is encrypted.
        </p>
      </div>
    </div>
  );
}