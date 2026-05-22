"use client"
import { useState } from "react";
import { CircleHelp, TrendingUp } from "lucide-react";

function AverageScoreCard({ averageScore }: { averageScore: number | null }) {

  const [averageScoreInfo, setAverageScoreInfo] = useState(false);

  let riskLabel = "Across All Targets";
  if (averageScore != null) {


    if (averageScore == 0) {
      riskLabel = "No Risk";
    } else if (averageScore >= 1 && averageScore <= 25) {
      riskLabel = "Low";
    } else if (averageScore >= 26 && averageScore <= 50) {
      riskLabel = "Moderate";
    } else if (averageScore >= 51 && averageScore <= 75) {
      riskLabel = "High";
    } else if (averageScore >= 76 && averageScore <= 100) {
      riskLabel = "Critical";
    }
  }

  return (
    <div className={`w-full min-h-[180px] border border-gray-800 mt-5 border-1 rounded-xl p-5 shadow-lg bg-[#011023]`}>
      <div className="flex items-center gap-2">
        <p className='tracking-wide text-white'>AVERAGE RISK SCORE</p>
        <div className='relative'>
          <button onClick={() => { setAverageScoreInfo(!averageScoreInfo) }}>
            <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
          </button>

          {averageScoreInfo && (
            <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
              <p className='text-[13px]'>Average risk score shows the average security risk score across saved scans. Higher scores indicate more severe or more frequent security findings.</p>
            </div>
          )}
        </div>

      </div>

      <div className='flex items-center gap-6'>
        <div className='flex flex-col items-center'>
          {(averageScore == null) ? (
            <p className='text-[50px] text-[#374151] font-semibold'>-</p>
          ) :
            <div className="flex items-center">
              <p className='text-[45px] text-white font-semibold'>{averageScore}</p>
              <p className="text-[15px] text-gray-400 translate-y-2.5">/100</p>
            </div>
          }
          <p className="text-white text-sm text-center tracking-wide">{riskLabel}</p>
        </div>

        <div className="border border-orange-500/20 rounded-3xl p-3 bg-amber-500/10 flex items-center justify-center">
          <div className="border border-amber-500/60 rounded-full p-1 ">
            < TrendingUp className="text-amber-500 w-7 h-7" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AverageScoreCard