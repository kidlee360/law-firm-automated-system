"use client";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { NetWorthPDF } from '../docs/NetWorthPdf';
import { FileDown } from 'lucide-react';

export function DownloadCaseFiles({ caseData, assets }: any) {
  return (
    <PDFDownloadLink
      document={<NetWorthPDF caseData={caseData} assets={assets} />}
      fileName={`NetWorth_${caseData.case_number}.pdf`}
      className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-emerald-700 transition-colors"
    >
      {({ loading }) => (
        <>
          <FileDown className="h-4 w-4" />
          {loading ? 'Preparing PDF...' : 'Download Net Worth'}
        </>
      )}
    </PDFDownloadLink>
  );
}