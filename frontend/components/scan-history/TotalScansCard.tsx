"use client"
import { useState } from "react";
import { CircleHelp, Activity } from "lucide-react";
import { ScanResult } from "../../types/scan";

function TotalScansCard({ result }: { result: ScanResult | null }) {

  const [totalScansInfo, setTotalScansInfo] = useState(false);

  return (
    <div className={`w-full min-h-[180px] border border-gray-800 mt-5 border-1 rounded-xl p-5 shadow-lg bg-[#011023]`}>
      <div className="flex items-center gap-2">
        <p className='tracking-wide text-white'>TOTAL SCANS</p>
        <div className='relative'>
          <button onClick={() => { setTotalScansInfo(!totalScansInfo) }}>
            <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
          </button>

          {totalScansInfo && (
            <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
              <p className='text-[13px]'>Total Scans shows the number of API scans saved in scan history. Each completed scan is counted once, including scans across different target URLs and risk levels.</p>
            </div>
          )}
        </div>

      </div>

      <div className='flex items-center gap-6'>
        <div className='flex flex-col items-center'>
          {result ? (
            result.findings ? (
              <p className='text-[50px] text-[#2563EB] font-semibold'>{result.findings.length}</p>
            ) : <p className='text-[50px] text-[#2563EB] font-semibold'>0</p>
          ) : <p className='text-[50px] text-[#374151] font-semibold'>-</p>
          }
          <p className='text-white text-sm text-center'>Across All Targets</p>
        </div>

        {result &&
          result.risk_score >= 0 ? (
          <div className=" border border-blue-800/15 border-3 rounded-3xl text-blue-500 p-3 bg-[#041a3b] flex items-center justify-center">
            <div className="border rounded-full p-1">
              < Activity className="text-blue-500 w-7 h-7" />
            </div>
          </div>

        ) : (
          <div className=" border border-blue-800/15 border-3 rounded-3xl text-blue-500 p-3 bg-[#041a3b] flex items-center justify-center">
            <div className="border rounded-full p-1">
              < Activity className="text-blue-500 w-7 h-7" />
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default TotalScansCard