"use client"
import Navbar from "../../components/Navbar"
import { ScanHistoryItem } from "../../types/scan";
import { useState, useEffect } from "react";
import { Download, Share2, Pencil, X, Shield, File, ChartColumnIncreasing, ChartPie, Star, Search, Pin } from 'lucide-react';


export default function ScanRecordPage() {
  const [selectedReport, setSelectedReport] = useState<ScanHistoryItem | null>(null);
  const [reports, setReports] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [reportTitles, setReportTitles] = useState<Record<number, string>>({});
  const [modalType, setModalType] = useState("");
  const [reportType, setReportType] = useState<Record<number, string>>({});
  const [modalIcon, setModalIcon] = useState("Shield");
  const [reportIcon, setReportIcon] = useState<Record<number, string>>({});
  const [pinnedReportIds, setPinnedReportIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("All Report Types");

  async function fetchReport() {

    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/scans")
      const data = await response.json();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]);
      }

    } catch {
      setError('Error retrieving report')
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    fetchReport()
  }, [])

  function modalIconHelper(iconName: string) {
    if (iconName == "Shield") {
      return <Shield />
    } else if (iconName == "File") {
      return <File />
    } else if (iconName == "ChartColumnIncreasing") {
      return <ChartColumnIncreasing />
    } else if (iconName == "ChartPie") {
      return <ChartPie />
    } else {
      return <Shield />
    }


  }

  function saveChangesButton() {
    if (selectedReport) {
      setReportTitles({ ...reportTitles, [selectedReport.id]: modalTitle });
      setReportType({ ...reportType, [selectedReport.id]: modalType });
      setReportIcon({ ...reportIcon, [selectedReport.id]: modalIcon });
    }
  }

  function getIconButtonStyle(iconName: string) {
    if (modalIcon == iconName) {
      return "border-blue-400 text-blue-400 bg-blue-500/10"
    }

    return "border-white text-white";
  }

  function togglePinnedReport(reportId: number) {
    if (pinnedReportIds.includes(reportId)) {
      setPinnedReportIds(pinnedReportIds.filter((id) => id !== reportId));
    } else {
      setPinnedReportIds([...pinnedReportIds, reportId])
    }
  }


  const pinnedReports = reports.filter((report) => pinnedReportIds.includes(report.id));

  const filteredReports = reports.filter((report) => {
    const title = reportTitles[report.id] || `Scan Report #${report.id}`;
    const currentReportType = reportType[report.id] || "Report Type";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || report.target_url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReportType = selectedReportType === "All Report Types" || currentReportType === selectedReportType;

    return matchesSearch && matchesReportType;
  });

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 ">
        <p className="text-white text-[35px] font-semibold ml-6 mt-2">Scan Reports</p>
        <p className="text-gray-400 ml-6 mb-5">Browse, preview and manage generated reports.</p>
        <div className="flex gap-5">
          <div className="border border-gray-700 ml-6 rounded-xl overflow-auto w-[540px] shrink-0">
            <div className="w-full bg-[#102034] text-white gap-5 px-4 py-3">
              <div className="relative w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="w-full border border-gray-700 bg-[#071525] text-white rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search reports by name, API target..."></input>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p>Date</p>
                <select value={selectedReportType} onChange={(e) => setSelectedReportType(e.target.value)} className="bg-[#071525] border border-gray-700 text-gray-200 rounded-md py-2 pl-2 px-1 pr-2 text-sm cursor-pointer">
                  <option>All Report Types</option>
                  <option>Security Assessment</option>
                  <option>Executive Summary</option>
                  <option>Compliance Review</option>
                </select>
                <p className="mr-2">Filters</p>
              </div>
            </div>


            <div>
              <p className="text-white mt-4 mb-2 ml-5 flex items-center gap-1.5"><Pin className="rotate-50 text-gray-400 mt-0.5" size={20} /> Pinned Reports</p>
              {pinnedReports.length == 0 ? <p className="text-gray-400 ml-6">No pinned reports yet. Click a star on any report to pin it. </p> :
                <div className="px-5 space-y-2">
                  {pinnedReports.map((report) => (
                    <div key={report.id} onClick={() => setSelectedReport(report)} className={`border bg-[#071525] hover:border-blue-400 hover:bg-[#0b1c31] cursor-pointer p-4 rounded-md transition ${selectedReport?.id === report.id ? "border-blue-400 bg-[#0b1c31]" : "border-gray-700"}`}>
                      <div className="flex items-center">
                        <div className="text-white bg-blue-500/10 p-2 border border-blue-400/30 rounded-md">
                          {modalIconHelper(reportIcon[report.id] || "Shield")}
                        </div>

                        <div className="min-w-0 ml-4">
                          <p className="text-white font-semibold text-sm">{reportTitles[report.id] || `Scan Report #${report.id}`}</p>
                          <p className="text-gray-400 truncate text-sm">{report.target_url}</p>
                        </div>

                        <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-2 py-1 ml-4">
                          {report.risk_level}
                        </span>

                        <p className="text-gray-500 text-xs mt-1 ml-4">
                          {new Date(report.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", })}
                        </p>

                        <button className="ml-4 text-yellow-400 cursor-pointer hover:text-yellow-300 shrink-0" onClick={(e) => { e.stopPropagation(); togglePinnedReport(report.id); }}>
                          <Star fill="yellow" size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              }
              <hr className="text-gray-600 mt-4"></hr>

              <div className="flex mx-5 mt-5 gap-5 pb-5 min-h-[200px]">
                <div className="flex-1">
                  <p className="text-gray-200 mb-5">All Reports ({reports.length})</p>
                  <div className="modal-scrollbar max-h-[calc(100vh-410px)] overflow-y-auto pr-2">
                    {filteredReports.length == 0 ? <p className="text-gray-400">No reports found</p> :
                      filteredReports.map((report) => (
                        <div key={report.id} onClick={() => setSelectedReport(report)} className={`border bg-[#071525] hover:border-blue-400 hover:bg-[#0b1c31] cursor-pointer relative p-4 rounded-md transition ${selectedReport?.id === report.id ? "border-blue-400 bg-[#0b1c31]" : "border-gray-700"}`}>
                          <div className="flex items-center">
                            <div className="text-white bg-blue-500/10 p-2 border border-blue-400/30 rounded-md">
                              {modalIconHelper(reportIcon[report.id] || "Shield")}
                            </div>

                            <div className="min-w-0 ml-4">
                              <p className="text-white font-semibold text-sm">{reportTitles[report.id] || `Scan Report #${report.id}`} </p>
                              <p className="text-gray-400 truncate text-sm">{report.target_url}</p>
                            </div>

                            <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-2 py-1 ml-4">{report.risk_level}</span>

                            <p className="text-gray-500 text-xs mt-1 ml-4"> {new Date(report.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", })}</p>

                            <button className="ml-4 text-gray-400 cursor-pointer hover:text-yellow-400 shrink-0" onClick={(e) => { e.stopPropagation(); togglePinnedReport(report.id); }} > <Star className={pinnedReportIds.includes(report.id) ? "text-yellow-400" : "text-gray-400"} fill={pinnedReportIds.includes(report.id) ? "yellow" : "none"} size={20} /> </button>

                            {/*       <button onClick={(e) => { setModal(true); setSelectedReport(report); setModalTitle(reportTitles[report.id] || `Scan Report #${report.id}`); setModalType(reportType[report.id] || `Report Type`); setModalIcon(reportIcon[report.id] || `Shield`); }} className="p-1 text-red-500 cursor-pointer hover:bg-red-500/10 rounded-md"> <Pencil size={20} /> </button> */}
                          </div>
                        </div>
                      ))
                    }
                  </div>

                  {modal && selectedReport && (
                    <div className="fixed bg-black/60 flex items-center justify-center z-50 inset-0">
                      <div className="bg-[#102034] w-[35%] h-[29%] pb-50 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-xl ml-6 mt-5">Edit Report</p>
                          </div>
                          <button onClick={() => { setSelectedReport(null); setModal(false); setModalTitle(""); setModalType(""); setModalIcon("Shield") }} className="text-white cursor-pointer mr-2 mb-2" ><X /></button>

                        </div>
                        <div>
                          <p className="text-gray-400 ml-6">Update the report title, type and icon.</p>
                        </div>

                        <div className="flex justify-between">
                          <div>
                            <p className="ml-6 text-white mt-6">Report Title</p>
                            <input className="placeholder-white w-full text-gray-300 border border-gray-800 rounded-md ml-5 mt-1 pl-1 cursor-pointer py-1 px-2" value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} placeholder="Report title" ></input>
                          </div>

                          <div className="mr-6">
                            <p className="mr-6 text-white mt-6">Report Type</p>
                            <select className="bg-[#102034] placeholder-white w-full border border-gray-800 rounded-md mr-5 mt-1 pl-1 cursor-pointer py-1 px-2 text-white" value={modalType} onChange={(e) => setModalType(e.target.value)} >
                              <option></option>
                              <option>Security Assessment</option>
                              <option>Executive Summary</option>
                              <option>Compliance Review</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <p className="ml-6 text-white mt-6">Report Icon</p>
                          <div className="flex items-center gap-3 ml-6 mt-2">
                            <Shield onClick={() => setModalIcon("Shield")} className={`text-white border w-[13%] h-[13%] py-1 px-3 hover:border-blue-400 hover:text-blue-400 cursor-pointer ${getIconButtonStyle("Shield")}`} />
                            <File onClick={() => setModalIcon("File")} className={`text-white border w-[13%] h-[13%] py-1 px-3 cursor-pointer hover:border-blue-400 hover:text-blue-400 ${getIconButtonStyle("File")}`} />
                            <ChartColumnIncreasing onClick={() => setModalIcon("ChartColumnIncreasing")} className={`text-white border w-[13%] h-[13%] py-1 px-3 cursor-pointer hover:border-blue-400 hover:text-blue-400 ${getIconButtonStyle("ChartColumnIncreasing")} `} />
                            <ChartPie onClick={() => setModalIcon("ChartPie")} className={`border text-white w-[13%] h-[13%] py-1 px-3 cursor-pointer hover:border-blue-400 hover:text-blue-400 ${getIconButtonStyle("ChartPie")} `} />
                          </div>
                        </div>

                        <div>
                          <p className="ml-6 text-white mt-6">Notes</p>
                          <input placeholder="Add any optional notes ..." className="placeholder-white h-16 border border-gray-700 w-[90%] ml-6 mr-6 pl-2 pb-8"></input>
                        </div>

                        <div className="flex justify-end gap-3 mr-6 mt-8">
                          <button className="cursor-pointer border text-lg rounded-md text-white px-4 py-2" onClick={() => { setSelectedReport(null); setModal(false); setModalTitle(""); setModalType(""); setModalIcon("Shield") }}>Cancel</button>
                          <button className="cursor-pointer border-[#2a77f5] rounded-md text-lg text-white px-4 py-2 bg-[#2a77f5]" onClick={saveChangesButton}>Save Changes</button>

                        </div>

                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
          {filteredReports.length != 0 &&
            <div className="border border-gray-700 bg-[#071525] rounded-md p-4 w-80 h-fit sticky top-5">
              <p className="text-white text-lg font-semibold">Report Preview</p>
              {selectedReport && (
                <div>
                  <p className="text-gray-400 mt-4 text-sm">Title</p>
                  <p className="text-white">{reportTitles[selectedReport.id] || `Scan Report #${selectedReport.id}`}</p>
                  <p className="text-gray-400 text-sm mt-4">Target URL</p>
                  <p className="text-blue-400 text-sm break-all">{selectedReport.target_url}</p>
                  <p className="text-gray-400 mt-4 text-sm">Risk Score</p>
                  <p className="text-white">{selectedReport.risk_score}/100</p>
                  <p className="text-gray-400 mt-4 text-sm">Findings</p>
                  <p className="text-white">{selectedReport.total_findings}</p>
                  <p className="text-gray-400 mt-4 text-sm">Scanned At</p>
                  <p className="text-white text-sm">{new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          }
        </div>
      </div>

    </div >
  )
}