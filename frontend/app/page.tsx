"use client";
import { useState } from 'react'
import Navbar from "../components/Navbar"
import { ScanResult } from "../types/scan";
import { Gauge, CircleHelp, CircleCheck, CircleAlert, ShieldAlert, TriangleAlert, List, OctagonAlert, Circle } from 'lucide-react';

export default function Home() {

  const [apiUrl, setApiUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskScoreInfo, setRiskScoreInfo] = useState(false);
  const [riskLevelInfo, setRiskLevelInfo] = useState(false);
  const [totalFindingsInfo, setTotalFindingsInfo] = useState(false);
  const [scanSummaryInfo, setScanSummaryInfo] = useState(false);
  const [severityCountsInfo, setSeverityCountsInfo] = useState(false);

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

  let scanSummaryStyle = "bg-gray-50 border-gray-200";
  if (result) {
    if (result.risk_score >= 76) {
      scanSummaryStyle = "bg-red-50 border-red-200";
    } else if (result.risk_score >= 51) {
      scanSummaryStyle = "bg-orange-50 border-orange-200";
    } else if (result.risk_score >= 26) {
      scanSummaryStyle = "bg-yellow-50 border-yellow-200";
    } else if (result.risk_score >= 1) {
      scanSummaryStyle = "bg-green-50 border-green-200";
    } else {
      scanSummaryStyle = "bg-gray-50 border-gray-200";
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

        <div className='mb-20 mt-10 grid grid-cols-1 md:grid-cols-4 2xl:grid-cols-4 gap-5 px-6 items-stretch'>

          <div className="w-full min-h-[180px] border border-gray-100 border-3 rounded-xl bg-white p-5 shadow-lg">
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




          <div className="w-full min-h-[180px] border border-gray-100 border-3 rounded-xl bg-white p-5 shadow-lg">
            <div className="flex items-center  gap-2">
              <p className='font-bold'>Risk Level</p>
              <div className='relative'>
                <button onClick={() => { setRiskLevelInfo(!riskLevelInfo) }}>
                  <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
                </button>

                {riskLevelInfo && (
                  <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
                    <p className='text-[13px]'>Risk Level is based on the final risk score. Scores are grouped as None, Low, Medium, High or Critical depending on severity.</p>
                  </div>
                )}
              </div>

            </div>

            <div className='flex items-center gap-6'>
              {result ? (
                result.risk_score >= 76 ? (
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    < ShieldAlert className="w-10 h-10 text-[#db1414]" />
                  </div>
                ) : result.risk_score >= 51 ? (
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    < TriangleAlert className="w-10 h-10 text-[#C2410C]" />
                  </div>
                ) : result.risk_score >= 26 ? (
                  <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                    < CircleAlert className="w-10 h-10 text-[#B45309]" />
                  </div>
                ) : result.risk_score >= 1 ? (
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    < CircleAlert className="w-10 h-10 text-[#047857]" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    < CircleCheck className="w-10 h-10 text-[#374151]" />
                  </div>
                )) :
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  < CircleAlert className="w-10 h-10 text-[#374151]" />
                </div>
              }

              <div className='flex flex-col items-center'>
                {result ? (
                  result.risk_score >= 76 ? (
                    <p className='text-[45px] text-[#db1414] font-semibold'>{result.risk_level}</p>
                  ) : result.risk_score >= 51 ? (
                    <p className='text-[45px] text-[#C2410C] font-semibold'>{result.risk_level}</p>
                  ) : result.risk_score >= 26 ? (
                    <p className='text-[45px] text-[#B45309] font-semibold'>{result.risk_level}</p>
                  ) : result.risk_score >= 1 ? (
                    <p className='text-[45px] text-[#047857] font-semibold'>{result.risk_level}</p>
                  ) : <p className='text-[45px] text-[#374151] font-semibold'>-</p>
                ) : <p className='text-[45px] text-[#374151] font-semibold'>-</p>

                }
                {result ? (
                  result.risk_score >= 76 ? (
                    <p className='-translate-y-2 translate-x-1'>Severe risk detected</p>
                  ) : result.risk_score >= 51 ? (
                    <p className='-translate-y-2 translate-x-1'>Serious risk detected</p>
                  ) : result.risk_score >= 26 ? (
                    <p className='-translate-y-2 translate-x-1'>Moderate risk detected</p>
                  ) : result.risk_score >= 1 ? (
                    <p className='-translate-y-2 translate-x-1'>Minor risk detected</p>
                  ) : <p className='-translate-y-2 translate-x-1'>No risk detected</p>
                ) : <p className='-translate-y-2 translate-x-1'>- risk detected</p>
                }
              </div>
            </div>
          </div>



          <div className="w-full min-h-[180px] border border-gray-100 border-3 rounded-xl bg-white p-5 shadow-lg">
            <div className="flex items-center  gap-2">
              <p className='font-bold'>Total Findings</p>
              <div className='relative'>
                <button onClick={() => { setTotalFindingsInfo(!totalFindingsInfo) }}>
                  <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
                </button>

                {totalFindingsInfo && (
                  <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
                    <p className='text-[13px]'>Total findings counts all detected issues across security headers, sensitive data, rate limiting, authentication exposure, CORS and cookie checks.</p>
                  </div>
                )}
              </div>

            </div>

            <div className='flex items-center gap-6'>
              {result ? (
                result.risk_score >= 0 ? (
                  <div className="w-20 h-20 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                    < List className="w-10 h-10 text-[#2563EB]" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    < List className="w-10 h-10 text-[#374151]" />
                  </div>
                )
              ) : <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                < List className="w-10 h-10 text-[#374151]" />
              </div>} {
              }

              <div className='flex flex-col items-center'>
                {result ? (
                  <p className='text-[50px] text-[#2563EB] font-semibold'>{result.findings.length}</p>
                ) : <p className='text-[50px] text-[#374151] font-semibold'>-</p>
                }
                <p>Issues found</p>
              </div>
            </div>
          </div>


          <div className={`w-full min-h-[180px] border border-1 rounded-xl p-5 shadow-lg ${scanSummaryStyle}`}>
            <div className="flex items-center  gap-2">
              <p className='font-bold'>Scan Summary</p>
              <div className='relative'>
                <button onClick={() => { setScanSummaryInfo(!scanSummaryInfo) }}>
                  <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
                </button>

                {scanSummaryInfo && (
                  <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
                    <p className='text-[13px]'>Scan summary explains the overall result of the scan using the final risk level, risk score and detected findings.</p>
                  </div>
                )}
              </div>

            </div>

            <div className='flex items-center gap-6'>
              {result ? (
                <p className='mt-4'>{result.risk_summary}</p>
              ) : <p className='mt-4'>Run a scan to generate an overall risk summary</p>
              }
            </div>
          </div>
        </div>

        <div className='mb-20 mt-10 grid grid-cols-1 2xl:grid-cols-2 gap-6 px-6 items-stretch'>
          <div className='w-full min-h-[180px] rounded-xl border border-3 border-gray-100 p-5 shadow-lg'>
            <div className="flex gap-2">
              <p className='font-bold'>Severity Counts</p>
              <div className='relative'>
                <button onClick={() => { setSeverityCountsInfo(!severityCountsInfo) }}>
                  <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
                </button>
                {severityCountsInfo && (
                  <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
                    <p className='text-[13px]'>Severity counts group the scan findings by impact level so you can quickly see how many Critical, High, Medium and Low issues were found.</p>
                  </div>
                )}
              </div>
            </div>
            <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4'>
              <div className='w-full flex  2xl:flex-row items-center justify-center bg-red-100 border border-red-400 border-1 py-4 px-5 rounded-xl gap-3'>
                <OctagonAlert className='w-12 h-12 text-[#db1414]' />

                <div className='flex flex-col items-center'>
                  <p className='text-red-600 font-semibold text-[20px]'>Critical</p>
                  {result ? (
                    <p className='text-[35px] text-red-600 font-semibold'>{result.severity_counts.Critical}</p>
                  ) : <p className='text-[50px] text-[#db1414] -translate-y-5 font-semibold'>-</p>
                  }
                </div>

              </div>


              <div className='w-full flex 2xl:flex-row items-center justify-center bg-orange-100 border border-orange-400 border-1 py-4 px-5 rounded-xl gap-3'>
                < TriangleAlert className="w-12 h-12 text-[#EA580C]" />

                <div className='flex flex-col items-center'>
                  <p className='text-orange-600 font-semibold text-[20px]'>High</p>
                  {result ? (
                    <p className='text-[35px] text-orange-600 font-semibold'>{result.severity_counts.High}</p>
                  ) : <p className='text-[50px] text-[#EA580C] -translate-y-5 font-semibold'>-</p>
                  }
                </div>

              </div>

              <div className='w-full flex 2xl:flex-row items-center justify-center bg-yellow-100 border border-yellow-400 border-1 py-4 px-5 rounded-xl gap-3'>
                < CircleAlert className="w-12 h-12 text-[#FFBC3B]" />

                <div className='flex flex-col items-center'>
                  <p className='text-yellow-500 font-semibold text-[20px]'>Medium</p>
                  {result ? (
                    <p className='text-[35px] text-yellow-500 font-semibold'>{result.severity_counts.Medium}</p>
                  ) : <p className='text-[50px] text-yellow-500 -translate-y-5 font-semibold'>-</p>
                  }
                </div>

              </div>


              <div className='w-full flex 2xl:flex-row items-center justify-center bg-green-100 border border-green-400 border-1 py-4 px-5 rounded-xl gap-3'>
                < CircleCheck className="w-12 h-12 text-[#16A34A]" />

                <div className='flex flex-col items-center'>
                  <p className='text-green-500 font-semibold text-[20px]'>Low</p>
                  {result ? (
                    <p className='text-[35px] text-green-500 font-semibold'>{result.severity_counts.Low}</p>
                  ) : <p className='text-[50px] text-green-500 -translate-y-5 font-semibold'>-</p>
                  }
                </div>

              </div>
            </div>
          </div>

          <div className='w-full min-h-[180px] border border-1 rounded-xl p-5 shadowlog'>
            <h1>Category counts</h1>
          </div>
        </div>

      </main >
    </div >
  );
}
