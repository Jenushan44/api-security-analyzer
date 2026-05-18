"use client"
import { useState } from "react";
import { ScanResult } from "../../types/scan";
import { CircleHelp, CircleCheck, CircleAlert, ShieldAlert, TriangleAlert } from 'lucide-react';


function RiskLevelCard({ result }: { result: ScanResult | null }) {

  const [riskLevelInfo, setRiskLevelInfo] = useState(false);
  let riskBorder = "border-gray-800";

  if (result) {
    if (result.risk_score >= 76) {
      riskBorder = "border-red-500";
    } else if (result.risk_score >= 51) {
      riskBorder = "border-orange-500";
    } else if (result.risk_score >= 26) {
      riskBorder = "border-yellow-500";
    } else if (result.risk_score >= 1) {
      riskBorder = "border-green-500";
    } else {
      riskBorder = "border-gray-500";
    }
  }

  return (
    <div className={`w-full min-h-[180px] border border-gray-800 border-1 rounded-xl p-5 shadow-lg bg-[#0B1624] ${riskBorder}`}>
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
              <p className='text-[40px] text-[#db1414] mt-3 font-semibold text-center'>{result.risk_level}</p>
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
              <p className='text-white mt-2 text-center'>Severe risk detected</p>
            ) : result.risk_score >= 51 ? (
              <p className='text-white -translate-y-2 translate-x-1'>Serious risk detected</p>
            ) : result.risk_score >= 26 ? (
              <p className='text-white -translate-y-2 translate-x-1'>Moderate risk detected</p>
            ) : result.risk_score >= 1 ? (
              <p className='text-white -translate-y-2 translate-x-1'>Minor risk detected</p>
            ) : <p className='text-white -translate-y-2 translate-x-1'>No risk detected</p>
          ) : <p className='text-white -translate-y-2 translate-x-1'>Risk Detected</p>
          }
        </div>
      </div>
    </div>
  )
}

export default RiskLevelCard