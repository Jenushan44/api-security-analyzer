"use client";
import { useState } from 'react'
import Navbar from "../components/Navbar"
import { ScanResult } from "../types/scan";
import { Gauge, CircleHelp } from 'lucide-react';

export default function Home() {

  const [apiUrl, setApiUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [riskScoreInfo, setRiskScoreInfo] = useState(false);

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

        <div className='mb-20 flex items-center justify-evenly mt-10 text-center'>

          <div className="w-[260px] border border-gray-100 border-3 rounded-xl bg-white p-5 shadow-lg">
            <div className="flex items-center  gap-2">
              <p className='font-bold'>Risk Score</p>
              <div className='relative'>
                <button onClick={() => { setRiskScoreInfo(!riskScoreInfo) }}>
                  <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
                </button>

                {riskScoreInfo && (
                  <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
                    <p className='text-[13px]'>Risk Score is based on detected finding severities and is capped at 100.</p>
                  </div>
                )}
              </div>

            </div>
            <div className='flex items-center gap-6'>
              {result ? (
                result.risk_score >= 76 ? (
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    < Gauge className="w-10 h-10 text-[#db1414]" />
                  </div>
                ) : result.risk_score >= 51 ? (
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    < Gauge className="w-10 h-10 text-[#C2410C]" />
                  </div>
                ) : result.risk_score >= 26 ? (
                  <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                    < Gauge className="w-10 h-10 text-[#B45309]" />
                  </div>
                ) : result.risk_score >= 1 ? (
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    < Gauge className="w-10 h-10 text-[#047857]" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    < Gauge className="w-10 h-10 text-[#374151]" />
                  </div>
                )) :
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  < Gauge className="w-10 h-10 text-[#374151]" />
                </div>
              }

              <div className='flex flex-col items-center'>
                {result ? (
                  result.risk_score >= 76 ? (
                    <p className='text-[50px] text-[#db1414] font-semibold'>{result.risk_score}</p>
                  ) : result.risk_score >= 51 ? (
                    <p className='text-[50px] text-[#C2410C] font-semibold'>{result.risk_score}</p>
                  ) : result.risk_score >= 26 ? (
                    <p className='text-[50px] text-[#B45309] font-semibold'>{result.risk_score}</p>
                  ) : result.risk_score >= 1 ? (
                    <p className='text-[50px] text-[#047857] font-semibold'>{result.risk_score}</p>
                  ) : <p className='text-[50px] text-[#374151] font-semibold'>0</p>
                ) : <p className='text-[50px] text-[#374151] font-semibold'>-</p>
                }
                <p className='-translate-y-2 translate-x-1'>out of 100</p>
              </div>
            </div>
          </div>

          <div className='border'>
            <div className='w-[200px]'>
              <p>Risk Level</p>
            </div>
            <div>
              {result && (
                <p>{result.risk_level}</p>
              )}
            </div>
          </div>


          <div className='border'>
            <div className='w-[200px]'>
              <p>Total Findings</p>
            </div>
            <div>
              {result && (
                <p></p>
              )}
            </div>
          </div>

          <div className='border'>
            <div className='w-[200px]'>
              <p>Scan Summary</p>
            </div>
            <div>
              {result && (
                <p>{result.risk_summary}</p>
              )}
            </div>
          </div>



        </div>

      </main >
    </div >
  );
}
