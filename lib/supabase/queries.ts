// lib/supabase/queries.ts
import { createClient } from '@/utils/supabase/server'; // Note: Use server client for data fetching
import { cookies } from 'next/headers';

export async function performConflictCheck(name: string) {
  const supabase = createClient(await cookies());
  
  // This calls the SQL function you just saved in Supabase
  const { data, error } = await supabase
    .rpc('check_for_conflict', { search_name: name });

  if (error) {
    console.error("Conflict check failed:", error);
    return { hasConflict: false, matches: [], error };
  }

  // If data has length, we found someone with a similar name!
  return {
    hasConflict: (data?.length ?? 0) > 0,
    matches: data || [],
    error: null
  };
}


export async function getAttorneyDashboardData() {
  const supabase = createClient(await cookies());

  const { data: cases, error } = await supabase
    .from('cases')
    .select(`
      id,
      case_number,
      status,
      grounds,
      date_filed,
      parties (
        first_name,
        last_name,
        role,
        is_client
      ),
      deadlines (
        title,
        due_date,
        completed
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return cases;
}


export async function createNewNYCase(caseData: any, deadlineDate: string) {
  const supabase = createClient(await cookies());

  // 1. Create the Case
  const { data: newCase, error: caseError } = await supabase
    .from('cases')
    .insert([caseData])
    .select()
    .single();

  if (caseError) throw caseError;

  // 2. Automatically create the 120-Day Deadline task
  const { error: deadlineError } = await supabase
    .from('deadlines')
    .insert([{
      case_id: newCase.id,
      title: 'Service of Process (120-Day Rule)',
      due_date: deadlineDate,
      completed: false
    }]);

  if (deadlineError) throw deadlineError;

  return newCase;
}


// lib/supabase/queries.ts

export async function saveCaseAssets(caseId: string, assets: any[]) {
  const supabase = createClient(await cookies());

  // Map the UI state to the database column names
  const assetsToInsert = assets.map(asset => ({
    case_id: caseId,
    asset_type: asset.type,
    description: asset.desc,
    estimated_value: asset.value,
    is_marital_property: true // Default for intake
  }));

  const { data, error } = await supabase
    .from('assets')
    .insert(assetsToInsert)
    .select();

  if (error) throw error;
  return data;
}