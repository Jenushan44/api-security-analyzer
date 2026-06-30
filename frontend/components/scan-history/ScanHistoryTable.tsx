"use client";
import { useState } from "react";
import { ScanHistoryItem, ScanReport, Finding } from "../../types/scan";
import { X, ExternalLink, CircleCheck, CircleAlert, TriangleAlert, OctagonAlert, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

function ScanHistoryTable({ scans }: { scans: ScanHistoryItem[] }) {

  const [scanHistoryInfo, setScanHistoryInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ScanHistoryItem | null>(null);
  const [selectedFullReport, setSelectedFullReport] = useState<ScanReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const rowsPerPage = 10;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleScans = scans.slice(startIndex, endIndex);
  const totalPages = Math.ceil(scans.length / rowsPerPage);
  const router = useRouter();

  function getRiskLevelCardStyle(severity: string) {

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

  function getStatusCodeLevelCardStyle(status_code: number) {
    if (status_code == 200) {
      return "border border-green-500/70 bg-green-500/10 text-green-400 px-2 py-1 font-semibold"
    } else if (status_code == 401) {
      return "border border-yellow-500/70 bg-yellow-500/10 text-yellow-400 px-2 py-1 font-semibold"
    } else if (status_code == 403) {
      return "border border-red-500/70 bg-red-500/10 text-red-400 px-2 py-1 font-semibold"
    } else {
      return "border border-gray-500/70 bg-gray-500/10 text-gray-400 px-2 py-1 font-semibold"
    }
  }

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

    const scanDate = new Date(dateString.endsWith("Z") ? dateString : dateString + "Z");
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

  function getRiskScoreGauge({ risk_score }: { risk_score: number }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = risk_score / 100;
    const dashOffset = circumference * (1 - progress);
    return (
      <div className="relative w-15 h-15 flex items-center justify-center">
        <svg className="-rotate-90 w-15 h-15 flex" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1E293B" strokeWidth="8" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#EF4444" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
        </svg>
        <p className="absolute text-md font-semibold text-white">{risk_score}</p>
      </div>
    )
  }

  function previousButton() {
    if (currentPage == 1) {
      return;
    } else {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextButton() {
    if (currentPage == totalPages) {
      return;
    } else {
      setCurrentPage(currentPage + 1);
    }
  }

  async function handleViewDetails(scan: ScanHistoryItem) {
    setModalOpen(true)
    setSelectedReport(scan)
    setSelectedFullReport(null);
    setReportError(null);
    setReportLoading(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/scans/${scan.id}`);
      const data = await response.json();
      setSelectedFullReport(data);
    } catch {
      setReportError('Error');
    } finally {
      setReportLoading(false);
    }

  }

  const topFindingsOrder = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  }

  function severityCounts(findings: Finding[]) {
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    for (let i = 0; i < findings.length; i++) {
      if (findings[i].severity == "Critical") {
        criticalCount += 1;
      } else if (findings[i].severity == "High") {
        highCount += 1;
      } else if (findings[i].severity == "Medium") {
        mediumCount += 1;
      } else if (findings[i].severity == "Low") {
        lowCount += 1;
      }
    }


    return { Critical: criticalCount, High: highCount, Medium: mediumCount, Low: lowCount }
  }

  const counts = selectedFullReport ? severityCounts(selectedFullReport.findings) : { Critical: 0, High: 0, Medium: 0, Low: 0 }



  return (
    <div className="px-6 mt-5 mb-5">
      <div className="border rounded-lg border-gray-800 overflow-hidden">
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
              <th className="border border-[#1E293B] font-normal">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-[#08172A]">
            {scans.length > 0 ? (visibleScans.map(((scan) => (
              <tr key={scan.id} className="text-gray-300 w-full px-4 py-3 text-sm">
                <td className="border border-[#1E293B] text-center px-4 py-3">{scan.id}</td>
                <td className="border border-[#1E293B] text-center px-4 py-3">{scan.target_url}</td>
                <td className="border border-[#1E293B] px-4 py-3 text-center">
                  <div className="flex justify-center">
                    {getRiskScoreGauge({ risk_score: scan.risk_score })}
                  </div>
                </td>
                <td className="border border-[#1E293B] px-4 py-3 text-blue-400 text-center">
                  <span className={getRiskLevelCardStyle(scan.risk_level)}>{scan.risk_level}</span>
                </td>
                <td className="border border-[#1E293B] px-4 py-3 text-center">{scan.total_findings}</td>
                <td className="border border-[#1E293B] text-center px-4">
                  <p className={getStatusCodeLevelCardStyle(scan.status_code)}>{scan.status_code}</p>
                </td>
                <td className="border border-[#1E293B] px-4 py-2">
                  <div className="flex flex-col">
                    <p>{formatScanDate(scan.created_at)}</p>
                    <p className="text-gray-500">{getTimeAgo(scan.created_at)}</p>
                  </div>
                </td>
                <td className="border border-[#1E293B] px-4 py-2 text-center ">
                  <button className="cursor-pointer text-blue-500 border border-gray-800 rounded-md p-2" onClick={() => router.push(`/reports?scanId=${scan.id}`)}>
                    View Details
                  </button>
                </td>
              </tr>)
            ))) : (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="text-gray-300">
                  <td className="py-3 border border-[#1E293B] text-center"></td>
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

        <div className="flex justify-between items-center pt-5 pb-5 w-full bg-[#08172A] border border-gray-800">
          <div className="flex items-center">
            <p className="text-white ml-5">Showing {scans.length === 0 ? 0 : startIndex + 1} to {startIndex + visibleScans.length} of {scans.length} scans</p>
          </div>
          <div className="flex items-center mr-35">
            <button className="cursor-pointer text-white border rounded-md p-2 px-3" onClick={previousButton}>Previous</button>
            <p className="text-white mx-10">Page {currentPage} of {totalPages}</p>
            <button className="cursor-pointer text-white border rounded-md p-2 px-6" onClick={nextButton}>Next</button>
          </div>
          <div>
          </div>
        </div>
      </div>

      {modalOpen && selectedReport && (

        <div className="fixed bg-black/60 flex items-center justify-center z-50 inset-0">
          <div className="bg-[#102034] w-[70%] h-[80%] pb-50 border rounded-lg overflow-y-auto modal-scrollbar">
            <div className="flex items-center justify-between">
              <p className="ml-5 mt-4 text-white text-3xl font-semibold">Scan Report</p>
              <div>
                <button className="cursor-pointer text-white mr-3 mt-2" onClick={() => setModalOpen(false)}> <X /> </button>
              </div>
            </div>

            <div className="border-2 rounded-xl border-gray-700 pb-5 w-[95%] m-auto mt-10">
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-gray-400 ml-10 mt-3">Target URL</p>
                  <p className="text-blue-400 ml-10">{selectedReport.target_url}</p>
                </div>

                <div>
                  <p className="text-gray-400 mt-3">Scan ID</p>
                  <p className="text-blue-400">{selectedReport.id}</p>
                </div>

                <div className="mr-10">
                  <p className="text-gray-400 ml-5 mt-3">Scanned At</p>
                  <p className="text-blue-400 ml-5">{formatScanDate(selectedReport.created_at)}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <hr className="mt-5 w-[95%] text-gray-700"></hr>
              </div>

              <div className="flex justify-between gap-10">
                <div>
                  <p className="text-gray-400 ml-10 mt-3 mb-1">Risk Score</p>
                  <div className="flex items-center">
                    <div className="text-blue-400 ml-10">
                      {getRiskScoreGauge({ risk_score: selectedReport.risk_score })}
                    </div>
                    <p className="text-gray-400 mt-6">/100</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 mt-3 mb-1">Risk Level</p>

                  <div className="mt-3">
                    <p className={getRiskLevelCardStyle(selectedReport.risk_level)}>{selectedReport.risk_level}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 mt-3 mb-1">Status Code</p>
                  <div className="mt-3">
                    <p className={getStatusCodeLevelCardStyle(selectedReport.status_code)} >{selectedReport.status_code}</p>
                  </div>
                </div>

                <div className="">
                  <p className="text-gray-400 mt-3 mb-1">Risk Summary</p>
                  <p className="text-gray-300 max-w-[500] mr-5 mt-2">{selectedReport.risk_summary}</p>
                </div>


              </div>

            </div>

            <div className="flex gap-10 w-[95%] m-auto">

              <div className="border-2 rounded-lg border-gray-700 w-[95%] m-auto mt-10 ">
                <p className="text-lg text-gray-200 ml-4 mt-2">Findings Overview</p>

                <div className="flex flex-col items-center gap-1 py-2">
                  <div className="flex items-center w-[95%] py-2 border border-gray-700/10 rounded-md bg-red-800/10">
                    <OctagonAlert className="text-[#db1414] ml-2 w-8 h-8" />
                    <p className="ml-4 text-2xl text-white">{counts.Critical}</p>
                    <p className="text-gray-400 ml-10">Critical</p>
                  </div>

                  <div className="flex items-center w-[95%] py-2 border border-gray-700/10 rounded-md bg-orange-800/10">
                    <TriangleAlert className="text-[#EA580C] ml-2 w-8 h-8" />
                    <p className="ml-4 text-2xl text-white">{counts.High}</p>
                    <p className="text-gray-400 ml-10">High</p>
                  </div>

                  <div className="flex items-center w-[95%] py-2 border border-gray-700/10 rounded-md bg-yellow-800/10">
                    <CircleAlert className="text-[#FFBC3B] ml-2 w-8 h-8" />
                    <p className="ml-4 text-2xl text-white">{counts.Medium}</p>
                    <p className="text-gray-400 ml-10">Medium</p>
                  </div>

                  <div className="flex items-center w-[95%] py-2 border border-gray-700/10 rounded-md bg-green-800/10">
                    <CircleCheck className="text-[#16A34A] ml-2 w-8 h-8" />
                    <p className="ml-4 text-2xl text-white">{counts.Low}</p>
                    <p className="text-gray-400 ml-10">Low</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <hr className="w-[95%] text-gray-800 mt-2"></hr>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 pb-2 mt-2">
                    <p className="text-gray-400 text-lg ml-4">Total Findings</p>
                    <p className="text-white text-xl">{selectedReport.total_findings}</p>
                  </div>
                  <button className="text-blue-400 flex items-center gap-1 mr-4 cursor-pointer">View all findings <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="border-2 rounded-lg border-gray-700 w-[95%] m-auto mt-10 ">
                <p className="text-lg text-gray-200">Scan vs. Previous Scan</p>
              </div>
            </div>

            <div className="border-2 rounded-xl border-gray-700 w-[95%] m-auto mt-10 ">
              <table className="w-full">
                <thead>
                  <tr className="text-white bg-[#102034]">
                    <th className="border border-[#1E293B] px-4 py-1 font-normal">SEVERITY</th>
                    <th className="border border-[#1E293B] font-normal">FINDING</th>
                    <th className="border border-[#1E293B] font-normal">ENDPOINT</th>
                    <th className="border border-[#1E293B] font-normal">CATEGORY</th>
                  </tr>
                </thead>

                <tbody className="bg-[#08172A]">
                  {reportLoading ? (
                    <tr className="text-gray-300">
                      <td colSpan={4} className="py-4 text-center border border-[#1E293B]">
                        Loading findings...
                      </td>
                    </tr>
                  ) : reportError ? (
                    <tr className="text-gray-300">
                      <td colSpan={4} className="py-4 text-center border border-[#1E293B]">
                        Could not load findings.
                      </td>
                    </tr>
                  ) : selectedFullReport && selectedFullReport.findings.length > 0 ? (
                    selectedFullReport.findings.sort((a, b) => topFindingsOrder[b.severity] - topFindingsOrder[a.severity]).slice(0, 5).map((finding) => (
                      <tr key={finding.id} className="text-gray-300 w-full px-4 py-3 text-sm">
                        <td className="border border-[#1E293B] text-center px-4 py-3">
                          <span className={getRiskLevelCardStyle(finding.severity)}>
                            {finding.severity}
                          </span>
                        </td>

                        <td className="border border-[#1E293B] px-4 py-3 text-center">
                          {finding.title}
                        </td>

                        <td className="border border-[#1E293B] text-center px-4 py-3">
                          {selectedFullReport.scan.target_url}
                        </td>

                        <td className="border border-[#1E293B] px-4 py-3 text-center">
                          {finding.category}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-gray-300">
                      <td colSpan={4} className="py-4 text-center border border-[#1E293B]">
                        No findings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="w-[95%] mt-3 flex justify-start mx-auto mt-4">
              <button className="flex gap-2 rounded-lg text-white border-2 border-gray-700 rounded-sm p-2 cursor-pointer">Open Full Report <ExternalLink className="w-[20px]" /> </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
} export default ScanHistoryTable