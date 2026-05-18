"use client"
import { useState } from "react";
import { CircleHelp, ClipboardList } from 'lucide-react';
import { ScanResult } from "../../types/scan";


function TotalFindingsCard({ result }: { result: ScanResult | null }) {
  const [totalFindingsInfo, setTotalFindingsInfo] = useState(false);

  let riskBorder = "border-gray-800";

  if (result) {
    riskBorder = "border-blue-500";
  } else {
    riskBorder = "border-gray-800";
  }

  return (
    <div className={`w-full min-h-[180px] border border-1 rounded-xl p-5 shadow-lg bg-[#0B1624] ${riskBorder}`}>
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
        {result &&
          result.risk_score >= 0 ? (
          <div className="flex items-center justify-center">
            < ClipboardList className="w-18 h-18 mt-5 text-[#2563EB]" />
          </div>

        ) : (<div className="flex items-center justify-center">
          < ClipboardList className="w-18 h-18 mt-5 text-[#374151] bg-[#0B1624]" />
        </div>
        )}

        <div className='flex flex-col items-center'>
          {result ? (
            <p className='text-[50px] text-[#2563EB] font-semibold'>{result.findings.length}</p>
          ) : <p className='text-[50px] text-[#374151] font-semibold'>-</p>
          }
          <p className='text-white ml-2'>Issues Found</p>
        </div>
      </div>
    </div>
  )
}

export default TotalFindingsCard