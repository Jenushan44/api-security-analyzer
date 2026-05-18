"use client";
import { useState } from 'react'
import Navbar from "../components/Navbar"
import { ScanResult } from "../types/scan";
import RiskScoreCard from '@/components/dashboard/RiskScoreCard';
import RiskLevelCard from '@/components/dashboard/RiskLevelCard';
import TotalFindingsCard from '@/components/dashboard/TotalFindingsCard';
import ScanSummaryCard from '@/components/dashboard/ScanSummaryCard';
import SeverityCountsCard from '@/components/dashboard/SeverityCountsCard';
import CategoryCountsCard from '@/components/dashboard/CategoryCountsCard';
import ScanFormCard from '@/components/dashboard/ScanFormCard';

export default function Home() {

  const [result, setResult] = useState<ScanResult | null>(null);

  return (
    <div className='flex'>
      <Navbar />
      <main className='flex-1'>
        <h1 className="text-center mt-5">API Security Analyzer</h1>
        <div className='px-6 mb-5'>
          <ScanFormCard setResult={setResult} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 2xl:grid-cols-4 gap-5 px-6 items-stretch'>
          <RiskScoreCard result={result} />
          <RiskLevelCard result={result} />
          <TotalFindingsCard result={result} />
          <ScanSummaryCard result={result} />
        </div>

        <div className='mb-20 mt-5 grid grid-cols-1 xl:grid-cols-2 gap-6 px-6 items-stretch'>
          <SeverityCountsCard result={result} />
          <CategoryCountsCard result={result} />
        </div>
      </main >
    </div >
  );
}
