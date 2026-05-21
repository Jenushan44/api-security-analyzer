"use client"
import { useState } from "react";
import { List, CircleHelp } from "lucide-react"
import { ScanResult } from "../../types/scan";

function LatestFindingsCard({ result }: { result: ScanResult | null }) {

  const [latestFindingsInfo, setLatestFindingsInfo] = useState(false);


  function getSeverityCardStyle(severity: string) {

    if (severity == "Critical") {
      return "border border-red-500/70 bg-red-500/10 text-red-400 px-2 py-1 font-semibold"
    } else if (severity == "High") {
      return "border border-orange-500/70 bg-orange-500/10 text-orange-400 px-2 py-1 font-semibold"
    } else if (severity == "Medium") {
      return "border border-yellow-500/70 bg-yellow-500/10 text-yellow-400 px-2 py-1 font-semibold"
    } else if (severity == "Low") {
      return "border border-green-500/70 bg-green-500/10 text-green-400 px-2 py-1 font-semibold"
    } else {
      return "border border-gray-500/70 bg-gray-500/10 text-gray-400 px-2 py-1 font-semibold"
    }
  }

  return (
    <div className="w-full bg-[#0B1624] min-h-[400px] border border-gray-800 border-1 rounded-xl flex flex-col px-6 gap-8">
      <div className="flex gap-2 mt-5">
        <List className="text-white" />
        <p className="text-white tracking-wide">LATEST FINDINGS</p>
        <div className='relative'>
          <button onClick={() => { setLatestFindingsInfo(!latestFindingsInfo) }}>
            <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
          </button>
          {latestFindingsInfo && (
            <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
              <p className='text-[13px]'>Latest findings shows the most recent security issues found during the scan and helps prioritize what should be reviewed first.</p>
            </div>
          )}
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-white bg-[#102034]">
            <th className="border border-[#1E293B] px-4 py-1 font-normal">#</th>
            <th className="border border-[#1E293B] font-normal">SEVERITY</th>
            <th className="border border-[#1E293B] font-normal">FINDING</th>
            <th className="border border-[#1E293B] font-normal">ENDPOINT</th>
            <th className="border border-[#1E293B] font-normal">CATEGORY</th>
            <th className="border border-[#1E293B] font-normal">STATUS</th>
            <th className="border border-[#1E293B] font-normal">DISCOVERED</th>
          </tr>
        </thead>

        <tbody className="bg-[#08172A]">
          {result && result.findings ? (result.findings.map(((finding, index) => (
            <tr key={index} className="text-gray-300 w-full px-4 py-3 text-sm">
              <td className="border border-[#1E293B] text-center px-4 py-3">{index + 1}</td>
              <td className="border border-[#1E293B] text-center px-4 py-3">
                <span className={getSeverityCardStyle(finding.severity)}>{finding.severity}</span>
              </td>
              <td className="border border-[#1E293B] px-4 py-3">{finding.title}</td>
              <td className="border border-[#1E293B] px-4 py-3 text-blue-400">{result.target_url}</td>
              <td className="border border-[#1E293B] px-4 py-3">{finding.category}</td>
              <td className="border border-[#1E293B] text-center px-4">
                <span className="border border-red-500/70 bg-red-500/10 text-red-400 px-1 py-1 font-semibold">Open</span>
              </td>
              <td className="border border-[#1E293B] px-4 py-2">Latest Scan</td>
            </tr>)
          ))) : (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="text-gray-300">
                <td className="py-3 border border-[#1E293B] text-center">{index + 1}</td>
                <td className="py-3 border border-[#1E293B] text-center"></td>
                <td className="py-3 border border-[#1E293B] text-center"></td>
                <td className="py-3 border border-[#1E293B] text-center"></td>
                <td className="py-3 border border-[#1E293B] text-center"></td>
                <td className="py-3 border border-[#1E293B] text-center"></td>
                <td className="py-3 border border-[#1E293B] text-center"></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default LatestFindingsCard