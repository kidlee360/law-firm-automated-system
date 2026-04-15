// utils/nyCalculations2026.ts

const CAPS = {
  MAINTENANCE: 241000,
  CHILD_SUPPORT: 193000,
  SELF_SUPPORT_RESERVE: 21546 // 2026 Update
};

export const calculateMaintenance = (payorIncome: number, payeeIncome: number) => {
  const cappedPayorIncome = Math.min(payorIncome, CAPS.MAINTENANCE);
  
  // Formula A: 20% of payor up to cap - 25% of payee
  const resultA = (cappedPayorIncome * 0.20) - (payeeIncome * 0.25);
  
  // Formula B: 40% of combined income - payee income
  const resultB = ((cappedPayorIncome + payeeIncome) * 0.40) - payeeIncome;

  const annualGuideline = Math.max(0, Math.min(resultA, resultB));
  return annualGuideline.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};