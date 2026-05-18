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

export default function Home() {

  const [apiUrl, setApiUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sends the user url to the FastAPI scanner and stores returned report
  async function handleScan() {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/scan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "url": apiUrl })
        })
      const data = await response.json()
      setResult(data)
    }
    catch {
      setError('Error: Response not found')
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex'>
      <Navbar />
      <main className='flex-1'>
        <h1 className="text-center mt-5">API Security Analyzer</h1>
        <input type="text" value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} placeholder="Enter your api url" />
        <button onClick={handleScan}>{loading == true ? "Scanning" : "Scan"}</button>
        {error && <p>{error}</p>}
        {result && (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}

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
