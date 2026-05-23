import { ScanHistoryItem } from "../../types/scan";

function ScanHistoryTable({ scans }: { scans: ScanHistoryItem[] }) {

  return (
    <div>

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
              <td className="border border-[#1E293B] px-4 py-3">{scan.risk_score}</td>
              <td className="border border-[#1E293B] px-4 py-3 text-blue-400">{scan.risk_level}</td>
              <td className="border border-[#1E293B] px-4 py-3">{scan.total_findings}</td>
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

  )
} export default ScanHistoryTable