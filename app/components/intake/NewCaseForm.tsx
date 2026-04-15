"use client"; // Always include this for interactive components

import { performConflictCheck } from '@/lib/supabase/queries'; // <--- ADD THIS LINE
import { useState } from 'react';
const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const name = e.target.value;
  if (name.length > 3) { // Only check once they've typed a few letters
    const { hasConflict, matches } = await performConflictCheck(name);
    
    if (hasConflict) {
      alert(`WARNING: Potential conflict found with ${matches[0].full_name} in Case #${matches[0].case_id}`);
    }
  }
};