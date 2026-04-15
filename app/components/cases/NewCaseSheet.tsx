"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { performConflictCheck } from "@/lib/supabase/queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";


// 1. Define the type clearly at the top (outside the component)
type ConflictResult = {
  hasConflict: boolean;
  matches: any[];
  error: any;
};

export function NewCaseSheet() {
  const [conflict, setConflict] = useState<ConflictResult | null>(null);

  const handleNameSearch = async (name: string) => {
    if (name.length > 3) {
      const result = await performConflictCheck(name);
      setConflict(result);
    } else {
      setConflict(null); // Clear warning if they delete the text
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
            <select className="w-full border p-2 rounded-md bg-white">
              <option value="170.7">Irretrievable Breakdown (No-fault)</option>
              <option value="170.1">Cruel and Inhuman Treatment</option>
              <option value="170.2">Abandonment (1 Year+)</option>
              <option value="170.3">Imprisonment (3 Years+)</option>
            </select>
          </div>

          <button 
            disabled={conflict?.hasConflict}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold disabled:bg-slate-300"
          >
            Open Case File
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}