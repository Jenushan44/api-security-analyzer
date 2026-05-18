"use client"
import { useState } from "react";
import { CircleHelp } from 'lucide-react';
import { ScanResult } from "../../types/scan";


function ScanSummaryCard({ result }: { result: ScanResult | null }) {
  const [scanSummaryInfo, setScanSummaryInfo] = useState(false);
  let riskBorder = "border-gray-800";
  let riskGlow = "from-gray-500/10";

  if (result) {
    if (result.risk_score >= 76) {
      riskBorder = "border-red-500";
      riskGlow = "bg-gradient-to-b from-red-500/10 to-[#0B1624]";
    } else if (result.risk_score >= 51) {
      riskBorder = "border-orange-500";
      riskGlow = "bg-gradient-to-b from-orange-500/10 to-[#0B1624]";
    } else if (result.risk_score >= 26) {
      riskBorder = "border-yellow-500";
      riskGlow = "bg-gradient-to-b from-yellow-500/10 to-[#0B1624]";
    } else if (result.risk_score >= 1) {
      riskBorder = "border-green-500";
      riskGlow = "bg-gradient-to-b from-green-500/10 to-[#0B1624]";
    } else {
      riskBorder = "border-gray-500";
      riskGlow = "bg-gradient-to-b from-gray-500/10 to-[#0B1624]";
    }
  }


  return (
    <div className={`w-full min-h-[180px] border border-1 rounded-xl p-5 shadow-lg bg-[#0B1624] ${riskBorder} ${riskGlow}`}>
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
        ) : <p className='mt-5 text-white'>Run a scan to generate an overall risk summary</p>
        }
      </div>
    </div>
  )
}

export default ScanSummaryCard