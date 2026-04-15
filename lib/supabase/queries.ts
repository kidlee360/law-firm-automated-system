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
    return { conflict: false, error };
  }

  // If data has length, we found someone with a similar name!
  return {
    hasConflict: !!data?.length,
    matches: data || []
  };
}


export async function getAttorneyDashboardData() {
  const supabase = await createClient(await cookies());

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