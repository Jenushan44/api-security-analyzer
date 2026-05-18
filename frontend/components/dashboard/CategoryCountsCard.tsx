"use client"
import { useState } from "react";
import { CircleHelp, CircleGauge, LayoutGrid, Shield, User, LockKeyhole, Earth, Cookie } from 'lucide-react';
import { ScanResult } from "../../types/scan";


function CategoryCountsCard({ result }: { result: ScanResult | null }) {
  const [categoryCountsInfo, setCategoryCountsInfo] = useState(false);

  return (
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
              <p className='text-[25px] font-semibold ml-5 text-white ml-auto'>{result.category_counts["Security Headers"]}</p>
            ) : <p className='text-[50px] -translate-y-1 font-semibold text-white ml-auto'>-</p>
            }
          </div>

          <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
            <User fill="#004cff" className='w-7 h-7 text-[#004cff] shrink-0 ' />

            <p className='font-semibold text-[15px] text-gray-300'>Authentication <br /> Exposure</p>
            {result ? (
              <p className='text-[25px] font-semibold ml-5 text-white ml-auto'>{result.category_counts["Authentication Exposure"]}</p>
            ) : <p className='text-[50px] -translate-y-1 font-semibold text-white ml-auto'>-</p>
            }
          </div>


          <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
            <LockKeyhole className='w-7 h-7 text-[#822eff] shrink-0' />

            <p className='font-semibold text-[15px] text-gray-300'>Sensitive Data <br /> Exposure</p>
            {result ? (
              <p className='text-[25px] font-semibold ml-5 text-white ml-auto'>{result.category_counts["Sensitive Data Exposure"]}</p>
            ) : <p className='text-[50px] -translate-y-1 font-semibold text-white ml-auto'>-</p>
            }

          </div>

          <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
            <Earth className='w-7 h-7 shrink-0 text-[#06c1ab]' />

            <p className='font-semibold text-[15px] text-gray-300'>CORS <br /> Misconfiguration</p>
            {result ? (
              <p className='text-[25px] font-semibold ml-5 text-white ml-auto'>{result.category_counts["CORS Misconfiguration"]}</p>
            ) : <p className='text-[50px] -translate-y-1 font-semibold text-white ml-auto'>-</p>
            }
          </div>



          <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
            <CircleGauge className='w-7 h-7 text-[#06c1ab] shrink-0' />

            <p className='font-semibold text-[15px] text-gray-300'>Rate Limiting</p>
            {result ? (
              <p className='text-[25px] font-semibold ml-5 text-white ml-auto'>{result.category_counts["Rate Limiting"]}</p>
            ) : <p className='text-[50px] -translate-y-1 font-semibold  text-white ml-auto'>-</p>
            }
          </div>


          <div className='w-full h-[55px] flex items-center border border-gray-800 border-1 py-4 px-5 rounded-md gap-4'>
            <Cookie fill='#822eff' className='w-7 h-7 shrink-0' />

            <p className='font-semibold text-[15px] text-gray-300'>Cookie Security</p>
            {result ? (
              <p className='text-[25px] font-semibold ml-5 text-white ml-auto'>{result.category_counts["Cookie Security"]}</p>
            ) : <p className='text-[50px] -translate-y-1 font-semibold text-white ml-auto'>-</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryCountsCard