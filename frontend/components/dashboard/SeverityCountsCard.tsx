"use client"
import { useState } from "react";
import { ScanResult } from "../../types/scan";
import { CircleHelp, CircleCheck, CircleAlert, TriangleAlert, OctagonAlert, ChartNoAxesColumn } from 'lucide-react';


function SeverityCountsCard({ result }: { result: ScanResult | null }) {

  const [severityCountsInfo, setSeverityCountsInfo] = useState(false);


  return (
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
  )
}

export default SeverityCountsCard