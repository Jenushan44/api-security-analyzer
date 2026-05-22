"use client"
import { useState } from "react";
import { CircleHelp, TriangleAlert } from "lucide-react";

function CriticalScansCard({ critical_scans }: { critical_scans: number | null }) {

  const [criticalScansInfo, setCriticalScansInfo] = useState(false);

  return (
    <div className={`w-full min-h-[180px] border border-gray-800 mt-5 border-1 rounded-xl p-5 shadow-lg bg-[#011023]`}>
      <div className="flex items-center gap-2">
        <p className='tracking-wide text-white'>CRITICAL SCANS</p>
        <div className='relative'>
          <button onClick={() => { setCriticalScansInfo(!criticalScansInfo) }}>
            <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
          </button>

          {criticalScansInfo && (
            <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
              <p className='text-[13px]'>Critical scans show how many saved scans received a Critical risk level. These scans represent APIs with high-risk findings that should be reviewed first.</p>
            </div>
          )}
        </div>

      </div>

      <div className='flex items-center gap-6'>
        <div className='flex flex-col items-center'>
          {(critical_scans == null) ? (
            <p className='text-[50px] text-[#374151] font-semibold'>-</p>
          ) :
            <p className='text-[45px] text-white font-semibold'>{critical_scans}</p>
          }
          <p className='text-white text-sm text-center'>Across All Targets</p>
        </div>

        <div className=" border border-red-500/30 border-3 rounded-3xl p-3 bg-red-500/10 flex items-center justify-center">
          < TriangleAlert className="text-red-500 w-8 h-8" />
        </div>



      </div>
    </div>
  )
}

export default CriticalScansCard