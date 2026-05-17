"use client";
import { useState } from 'react'
import Navbar from "../components/Navbar"
import { ScanResult } from "../types/scan";
import { Gauge, CircleHelp, CircleCheck, CircleAlert, CircleGauge, ShieldAlert, TriangleAlert, List, OctagonAlert, Circle, ClipboardList, LayoutGrid, ChartNoAxesColumn, Shield, User, LockKeyhole, Earth, Cookie } from 'lucide-react';

function RiskScoreGauge({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100;
  const dashOffset = circumference * (1 - progress);
  return (
    <div className='relative w-28 h-28 flex items-center justify-center'>
      <svg className='-rotate-90 w-28 h-28' viewBox='0 0 100 100'>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1E293B" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#EF4444" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
      </svg>

      <div className='absolute flex flex-col items-center'>
        <p className='text-3xl font-semibold text-white'>{score}</p>
        <p className='text-sm text-gray-400'>/100</p>
      </div>
    </div>
  )
}


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
  const [categoryCountsInfo, setCategoryCountsInfo] = useState(false);

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

          <div className="w-full min-h-[180px] border border-gray-800 border-3 rounded-xl p-5 shadow-lg bg-[#0B1624]">
            <div className="flex items-center gap-2">
              <p className='tracking-wide text-white'>RISK SCORE</p>
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
            <div className='flex flex-col items-center gap-1 mt-2'>
              <RiskScoreGauge score={result ? result.risk_score : 0} />
              <p className='text-gray-400 text-sm text-center'>Overall Security Risk Score</p>
            </div>
          </div>




          <div className="w-full min-h-[180px] border border-gray-800 border-3 rounded-md p-5 shadow-lg bg-[#0B1624]">
            <div className="flex items-center  gap-2">
              <p className='tracking-wide text-white'>RISK LEVEL</p>
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
                  <div className="flex items-center justify-center">
                    < ShieldAlert className="w-18 h-18 mt-5 text-[#db1414]" />
                  </div>
                ) : result.risk_score >= 51 ? (
                  <div className="flex items-center justify-center">
                    < TriangleAlert className="w-18 h-18 mt-5 text-[#C2410C]" />
                  </div>
                ) : result.risk_score >= 26 ? (
                  <div className="flex items-center justify-center">
                    < CircleAlert className="w-18 h-18 mt-5 text-[#B45309]" />
                  </div>
                ) : result.risk_score >= 1 ? (
                  <div className="flex items-center justify-center">
                    < CircleAlert className="w-18 h-18 mt-5 text-[#047857]" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    < CircleCheck className="w-18 h-18 mt-5 text-[#374151]" />
                  </div>
                )) :
                <div className="flex items-center justify-center">
                  < CircleAlert className="w-18 h-18 mt-5 text-[#374151]" />
                </div>
              }

              <div className='flex flex-col items-center'>
                {result ? (
                  result.risk_score >= 76 ? (
                    <p className='text-[40px] text-[#db1414] mt-3 font-semibold'>{result.risk_level}</p>
                  ) : result.risk_score >= 51 ? (
                    <p className='text-[40px] mt-3 text-[#C2410C] font-semibold'>{result.risk_level}</p>
                  ) : result.risk_score >= 26 ? (
                    <p className='text-[40px] mt-3 text-[#B45309] font-semibold'>{result.risk_level}</p>
                  ) : result.risk_score >= 1 ? (
                    <p className='text-[40px] mt-3 text-[#047857] font-semibold'>{result.risk_level}</p>
                  ) : <p className='text-[40px] mt-3 text-[#374151] font-semibold'>-</p>
                ) : <p className='text-[40px] mt-3 text-[#374151] font-semibold'>-</p>

                }
                {result ? (
                  result.risk_score >= 76 ? (
                    <p className='text-white mt-2'>Severe risk detected</p>
                  ) : result.risk_score >= 51 ? (
                    <p className='text-white -translate-y-2 translate-x-1'>Serious risk detected</p>
                  ) : result.risk_score >= 26 ? (
                    <p className='text-white -translate-y-2 translate-x-1'>Moderate risk detected</p>
                  ) : result.risk_score >= 1 ? (
                    <p className='text-white -translate-y-2 translate-x-1'>Minor risk detected</p>
                  ) : <p className='text-white -translate-y-2 translate-x-1'>No risk detected</p>
                ) : <p className='text-white -translate-y-2 translate-x-1'>- risk detected</p>
                }
              </div>
            </div>
          </div>



          <div className="w-full min-h-[180px] border border-gray-800 border-3 rounded-xl p-5 shadow-lg bg-[#0B1624]">
            <div className="flex items-center  gap-2">
              <p className='tracking-wide text-white'>TOTAL FINDINGS</p>
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
                  <div className="flex items-center justify-center">
                    < ClipboardList className="w-18 h-18 mt-5 text-[#2563EB]" />
                  </div>
                ) : (
                  <div className="bg-gray-100 flex items-center justify-center">
                    < ClipboardList className="w-18 h-18 mt-5 text-[#374151]" />
                  </div>
                )
              ) : <div className="bg-gray-100 flex items-center justify-center">
                < ClipboardList className="w-18 h-18 mt-5 text-[#374151]" />
              </div>} {
              }

              <div className='flex flex-col items-center'>
                {result ? (
                  <p className='text-[50px] text-[#2563EB] font-semibold'>{result.findings.length}</p>
                ) : <p className='text-[50px] text-[#374151] font-semibold'>-</p>
                }
                <p className='text-white ml-2'>Issues found</p>
              </div>
            </div>
          </div>


          <div className='w-full min-h-[180px] border border-gray-800 border-1 rounded-xl p-5 shadow-lg bg-[#0B1624]'>
            <div className="flex items-center  gap-2">
              <p className='text-white tracking-wide'>SCAN SUMMARY</p>
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
                <p className='mt-4 text-white'>{result.risk_summary}</p>
              ) : <p className='mt-4'>Run a scan to generate an overall risk summary</p>
              }
            </div>
          </div>
        </div>

        <div className='mb-20 mt-10 grid grid-cols-1 xl:grid-cols-2 gap-6 px-6 items-stretch'>
          <div className='w-full min-h-[180px] rounded-xl border border-3 border-gray-800 p-5 shadow-lg bg-[#0B1624]'>
            <div className="flex gap-2">
              <ChartNoAxesColumn className='text-white' />
              <p className='tracking-wide text-white'>SEVERITY COUNTS</p>
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
            <div className='mt-5 grid grid-cols-4 gap-4'>
              <div className='w-full flex flex-col items-center justify-center bg-gradient-to-b from-red-500/15 via-red-500/5 to-transparent border border-gray-800 border-t-red-500 border-1 border-t-5 border-1 py-4 px-5 rounded-sm gap-3'>
                <OctagonAlert className='w-10 h-10 shrink-0 text-[#db1414]' />

                <div className='flex flex-col items-center'>
                  <p className='text-red-500 font-semibold text-[19px]'>Critical</p>
                  {result ? (
                    <p className='text-[40px] text-red-500 font-semibold'>{result.severity_counts.Critical}</p>
                  ) : <p className='text-[50px] text-[#db1414] -translate-y-5 font-semibold'>-</p>
                  }
                </div>
              </div>


              <div className='w-full flex flex-col items-center justify-center bg-gradient-to-b from-orange-to-b from-orange-500/15 via-orange-500/5 to-transparent border border-gray-800 border-t-orange-500 border-t-5 border-1 py-4 px-5 rounded-sm gap-3'>
                < TriangleAlert className="w-10 h-10 shrink-0 text-[#EA580C]" />

                <div className='flex flex-col items-center'>
                  <p className='text-orange-500 font-semibold text-[19px]'>High</p>
                  {result ? (
                    <p className='text-[40px] text-orange-500 font-semibold'>{result.severity_counts.High}</p>
                  ) : <p className='text-[50px] text-[#EA580C] -translate-y-5 font-semibold'>-</p>
                  }
                </div>

              </div>

              <div className='w-full flex flex-col items-center justify-center bg-gradient-to-b from-yellow-to-b from-yellow-500/15 via-yellow-500/5 to-transparent border border-gray-800 border-t-yellow-500 border-t-5 border-1 py-4 px-5 rounded-sm gap-3'>
                < CircleAlert className="w-10 h-10 shrink-0 text-[#FFBC3B]" />

                <div className='flex flex-col items-center'>
                  <p className='text-yellow-500 font-semibold text-[19px]'>Medium</p>
                  {result ? (
                    <p className='text-[40px] text-yellow-500 font-semibold'>{result.severity_counts.Medium}</p>
                  ) : <p className='text-[50px] text-yellow-500 -translate-y-5 font-semibold'>-</p>
                  }
                </div>

              </div>


              <div className='w-full flex flex-col items-center justify-center bg-gradient-to-b from-green-to-b from-green-500/15 via-green-500/5 to-transparent border border-gray-800 border-t-green-500 border-t-5 border-1 py-4 px-5 rounded-sm gap-3'>
                < CircleCheck className="w-10 h-10 shrink-0 text-[#16A34A]" />

                <div className='flex flex-col items-center'>
                  <p className='text-green-500 font-semibold text-[19px]'>Low</p>
                  {result ? (
                    <p className='text-[40px] text-green-500 font-semibold'>{result.severity_counts.Low}</p>
                  ) : <p className='text-[50px] text-green-500 -translate-y-5 font-semibold'>-</p>
                  }
                </div>

              </div>
            </div>
          </div>

          <div className='w-full min-h-[180px] rounded-xl border border-3 border-gray-800 p-5 shadow-lg bg-[#0B1624]'>
            <div className="flex gap-2">
              <LayoutGrid className='text-white' />
              <p className='tracking-wide text-white'>CATEGORY COUNTS</p>
              <div className='relative'>
                <button onClick={() => { setCategoryCountsInfo(!categoryCountsInfo) }}>
                  <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
                </button>
                {categoryCountsInfo && (
                  <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
                    <p className='text-[13px]'>Category counts show how many findings were detected in each security check area during the scan.</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className='gap-4 mt-5 grid grid-cols-1 md:grid-cols-2'>
                <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
                  <Shield fill="#004cff" className='w-7 h-7 text-[#004cff] shrink-0' />

                  <p className='font-semibold text-[15px] text-gray-300'>Security Headers</p>
                  {result ? (
                    <p className='text-[25px] font-semibold ml-5 text-white'>{result.category_counts["Security Headers"]}</p>
                  ) : <p className='text-[50px] -translate-y-1 font-semibold'>-</p>
                  }
                </div>

                <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
                  <User fill="#004cff" className='w-7 h-7 text-[#004cff] shrink-0 ' />

                  <p className='font-semibold text-[15px] text-gray-300'>Authentication <br /> Exposure</p>
                  {result ? (
                    <p className='text-[25px] font-semibold ml-5 text-white'>{result.category_counts["Authentication Exposure"]}</p>
                  ) : <p className='text-[50px] -translate-y-1 font-semibold'>-</p>
                  }
                </div>


                <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
                  <LockKeyhole className='w-7 h-7 text-[#822eff] shrink-0' />

                  <p className='font-semibold text-[15px] text-gray-300'>Sensitive Data <br /> Exposure</p>
                  {result ? (
                    <p className='text-[25px] font-semibold ml-5 text-white'>{result.category_counts["Sensitive Data Exposure"]}</p>
                  ) : <p className='text-[50px] -translate-y-1 font-semibold'>-</p>
                  }

                </div>

                <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
                  <Earth className='w-7 h-7 shrink-0 text-[#06c1ab]' />

                  <p className='font-semibold text-[15px] text-gray-300'>CORS <br /> Misconfiguration</p>
                  {result ? (
                    <p className='text-[25px] font-semibold ml-5 text-white'>{result.category_counts["CORS Misconfiguration"]}</p>
                  ) : <p className='text-[50px] -translate-y-1 font-semibold'>-</p>
                  }
                </div>



                <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
                  <CircleGauge className='w-7 h-7 text-[#06c1ab] shrink-0' />

                  <p className='font-semibold text-[15px] text-gray-300'>Rate Limiting</p>
                  {result ? (
                    <p className='text-[25px] font-semibold ml-5 text-white'>{result.category_counts["Rate Limiting"]}</p>
                  ) : <p className='text-[50px] -translate-y-1 font-semibold'>-</p>
                  }
                </div>


                <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
                  <Cookie fill='#822eff' className='w-7 h-7 shrink-0' />

                  <p className='font-semibold text-[15px] text-gray-300'>Cookie Security</p>
                  {result ? (
                    <p className='text-[25px] font-semibold ml-5 text-white'>{result.category_counts["Cookie Security"]}</p>
                  ) : <p className='text-[50px] -translate-y-1 font-semibold'>-</p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main >
    </div >
  );
}
