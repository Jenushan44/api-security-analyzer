"use client"
import { useState } from "react";
import { CircleHelp, CalendarDays } from "lucide-react";

function LatestScanCard({ latest_scan }: { latest_scan: string | null }) {

  const [latestScanInfo, setLatestScanInfo] = useState(false);

  function formatScanDate(dateString: string | null) {
    if (dateString === null) {
      return "-";
    }

    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function getTimeAgo(dateString: string | null) {

    if (dateString === null) {
      return "No scans yet";
    }

    const scanDate = new Date(dateString);
    const now = new Date();

    const differenceInMs = Math.max(0, now.getTime() - scanDate.getTime());
    const differenceInSeconds = Math.floor(differenceInMs / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInSeconds < 60) {

      return `${differenceInSeconds} seconds ago`;
    }

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minutes ago`;

    }


    if (differenceInHours < 24) {
      return `${differenceInHours} hours ago`;
    }

    return `${differenceInDays} days ago`;

  }

  return (
    <div className={`w-full min-h-[180px] border border-gray-800 mt-5 border-1 rounded-xl p-5 shadow-lg bg-[#011023]`}>
      <div className="flex items-center gap-2">
        <p className='tracking-wide text-white'>LATEST SCAN</p>
        <div className='relative'>
          <button onClick={() => { setLatestScanInfo(!latestScanInfo) }}>
            <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
          </button>

          {latestScanInfo && (
            <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
              <p className='text-[13px]'>Latest scan shows when the most recent saved API scan was completed.</p>
            </div>
          )}
        </div>

      </div>

      <div className='flex items-center gap-6'>
        <div className='flex flex-col'>
          {(latest_scan == null) ? (
            <p className='text-[50px] text-[#374151] font-semibold'>-</p>
          ) :
            <p className='text-[18px] text-white font-semibold'>{formatScanDate(latest_scan)}</p>
          }
          <p className='text-white text-sm'>{getTimeAgo(latest_scan)}</p>
        </div>

        <div className=" border border-green-500/30 border-3 rounded-3xl p-3 bg-green-500/10 flex items-center justify-center">
          < CalendarDays className="text-green-500 w-8 h-8" />
        </div>



      </div>
    </div>
  )
}

export default LatestScanCard