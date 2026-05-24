"use client";
import { useState } from "react";
import { ScanHistoryItem } from "../../types/scan";
import { CircleHelp } from "lucide-react";

function ScanHistoryTable({ scans }: { scans: ScanHistoryItem[] }) {

  const [scanHistoryInfo, setScanHistoryInfo] = useState(false);

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
    <div className="px-6 mt-5">
      <div className="w-full min-h-[180px] border border-gray-800 mt-5 border-1 rounded-xl p-5 shadow-lg bg-[#011023]">
        <div className="flex gap-2">
          <p className="text-white tracking-wide mb-3">LATEST FINDINGS</p>
          <div className='relative'>
            <button onClick={() => { setScanHistoryInfo(!scanHistoryInfo) }}>
              <CircleHelp className='text-gray-400 w-4 h-4 translate-y-1/8 cursor-pointer' />
            </button>

            {scanHistoryInfo && (
              <div className='absolute left-1/2 -translate-x-1/2 p-2 w-50 bottom-full bg-gray-100 border border-gray-300 border-1 rounded-xl'>
                <p className='text-[13px]'>Scan history shows previous API scans and helps you review past results over time.</p>
              </div>
            )}
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-white bg-[#102034]">
              <th className="border border-[#1E293B] px-4 py-1 font-normal">Scan ID</th>
              <th className="border border-[#1E293B] font-normal">Target URL</th>
              <th className="border border-[#1E293B] font-normal">Risk Score</th>
              <th className="border border-[#1E293B] font-normal">Risk Level</th>
              <th className="border border-[#1E293B] font-normal">Findings</th>
              <th className="border border-[#1E293B] font-normal">Status</th>
              <th className="border border-[#1E293B] font-normal">Scanned At</th>
            </tr>
          </thead>

          <tbody className="bg-[#08172A]">
            {scans.length > 0 ? (scans.map(((scan) => (
              <tr key={scan.id} className="text-gray-300 w-full px-4 py-3 text-sm">
                <td className="border border-[#1E293B] text-center px-4 py-3">{scan.id}</td>
                <td className="border border-[#1E293B] text-center px-4 py-3">{scan.target_url}</td>
                <td className="border border-[#1E293B] px-4 py-3 text-center">{scan.risk_score}</td>
                <td className="border border-[#1E293B] px-4 py-3 text-blue-400 text-center">
                  <span className={getSeverityCardStyle(scan.risk_level)}>{scan.risk_level}</span>
                </td>
                <td className="border border-[#1E293B] px-4 py-3 text-center">{scan.total_findings}</td>
                <td className="border border-[#1E293B] text-center px-4">{scan.status_code}</td>
                <td className="border border-[#1E293B] px-4 py-2">{scan.created_at}</td>
              </tr>)
            ))) : (
              Array.from({ length: 5 }).map((_) => (
                <tr className="text-gray-300">
                  <td className="py-3 border border-[#1E293B] text-center"></td>
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
    </div>
  )
} export default ScanHistoryTable