"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { performConflictCheck } from "@/lib/supabase/queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { calculateServiceDeadline } from "@/utils/nyLawValidators";
import { toast } from "sonner";
import { createNewNYCase, saveCaseAssets } from "@/lib/supabase/queries";
import { AssetTracker } from "../intake/AssetTracker";


// 1. Define the type clearly at the top (outside the component)
type ConflictResult = {
  hasConflict: boolean;
  matches: any[];
  error: any;
};

export function NewCaseSheet() {
  const [conflict, setConflict] = useState<ConflictResult | null>(null);
  const [dateFiled, setDateFiled] = useState("");
  const [deadlinePreview, setDeadlinePreview] = useState("");
  const [selectedGrounds, setSelectedGrounds] = useState(""); // Add state for selected grounds
  const [assets, setAssets] = useState<any[]>([]);

  const handleNameSearch = async (name: string) => {
    if (name.length > 3) {
      const result = await performConflictCheck(name);
      setConflict(result);
    } else {
      setConflict(null); // Clear warning if they delete the text
    }
  };

  const handleDateChange = (date: string) => {
    setDateFiled(date);
    if (date) {
      const deadline = calculateServiceDeadline(date);
      setDeadlinePreview(deadline);
    }
  }; 

  const handleSaveCase = async () => {
    try {
      const caseData = {
        case_number: `MAT-${Date.now().toString().slice(-6)}`, // Temporary index generator
        grounds: selectedGrounds,
        status: 'intake',
      };
  
      const newCase = await createNewNYCase(caseData, deadlinePreview);
  
      // Save assets if any
      if (assets.length > 0) {
        await saveCaseAssets(newCase.id, assets);
      }
  
      // 1. Success Notification
      toast.success("Case file created successfully.");
  
      // 2. The Legal "Automatic Orders" Warning
      toast.error("Action Required: Automatic Orders", {
        description: "Under NY DRL §236, the plaintiff is now bound by Automatic Orders. You must serve the notice on the defendant immediately.",
        duration: 10000, // Keep it visible for 10 seconds
        action: {
          label: "Download Notice",
          onClick: () => window.open('/templates/ny-automatic-orders.pdf', '_blank'),
        },
      });
  
    } catch (error) {
      toast.error("Failed to create case. Please check database logs.");
    }
  };
  

   

  return (
    <Sheet>
      <SheetTrigger className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
        + New Divorce Case
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Intake: New Matrimonial Matter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Section 1: Adverse Party (Conflict Check First!) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Adverse Party (Spouse) Name</label>
            <input 
              className="w-full border p-2 rounded-md" 
              placeholder="Full Name"
              onChange={(e) => handleNameSearch(e.target.value)}
            />
            {conflict?.hasConflict && (
              <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conflict Warning:</strong> {conflict.matches[0].full_name} was found in Case #{conflict.matches[0].case_id.slice(0,8)}.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Section 2: Grounds */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Grounds for Divorce (NY DRL §170)</label>
            <select className="w-full border p-2 rounded-md bg-white"
              value={selectedGrounds} // Bind to state
              onChange={(e) => setSelectedGrounds(e.target.value)} // Update state on change
            > 
              <option value="170.7">Irretrievable Breakdown (No-fault)</option>
              <option value="170.1">Cruel and Inhuman Treatment</option>
              <option value="170.2">Abandonment (1 Year+)</option>
              <option value="170.3">Imprisonment (3 Years+)</option>
            </select>
          </div>

          {/* Section 3: Marital Assets */}
          <div>
            <AssetTracker onChange={(data) => setAssets(data)} />
          </div>

          <button 
            disabled={conflict?.hasConflict}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold disabled:bg-slate-300"
            onClick={handleSaveCase} // Add onClick to trigger save
          >
            Open Case File
          </button>
        </div>
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Date Filed (Summons with Notice)</label>
            <input 
              type="date" 
              className="w-full border p-2 rounded-md"
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>
        
          {deadlinePreview && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
                CPLR 306-b Deadline
              </p>
              <p className="text-lg font-bold text-amber-900">
                {new Date(deadlinePreview).toLocaleDateString('en-US', { 
                  month: 'long', day: 'numeric', year: 'numeric' 
                })}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Service must be completed and affidavit filed by this date.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}