"use client"
import { CircleHelp } from 'lucide-react';
import { useState } from 'react';
import RiskScoreGauge from "./RiskScoreGauge"
import { ScanResult } from "../../types/scan";


function RiskScoreCard({ result }: { result: ScanResult | null }) {

  const [riskScoreInfo, setRiskScoreInfo] = useState(false);
  let riskBorder = "border-gray-800";
  let riskGlow = "from-gray-500/10";
  let riskColor = "#64748B";

  if (result) {
    if (result.risk_score >= 76) {
      riskBorder = "border-red-500";
      riskGlow = "bg-gradient-to-b from-red-500/10 to-[#0B1624]";
      riskColor = "red";
    } else if (result.risk_score >= 51) {
      riskBorder = "border-orange-500";
      riskGlow = "bg-gradient-to-b from-orange-500/10 to-[#0B1624]";
      riskColor = "orange";
    } else if (result.risk_score >= 26) {
      riskBorder = "border-yellow-500";
      riskGlow = "bg-gradient-to-b from-yellow-500/10 to-[#0B1624]";
      riskColor = "yellow";
    } else if (result.risk_score >= 1) {
      riskBorder = "border-green-500";
      riskGlow = "bg-gradient-to-b from-green-500/10 to-[#0B1624]";
      riskColor = "gren";
    } else {
      riskBorder = "border-gray-500";
      riskGlow = "bg-gradient-to-b from-green-500/10 to-[#0B1624]";
      riskColor = "gray";
    }
  }

  return (

    <div className={`w-full min-h-[180px] border rounded-xl p-5 shadow-lg bg-[#0B1624] ${riskBorder}`}>
      <div className="flex items-center gap-2">
        <p className='tracking-wide text-white'>RISK SCORE</p>
        <div className='relative'>
          <button onClick={() => { setRiskScoreInfo(!riskScoreInfo) }}>
            <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
          </button>

          {riskScoreInfo && (
            <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-1 rounded-xl'>
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
  )

}

export default RiskScoreCard