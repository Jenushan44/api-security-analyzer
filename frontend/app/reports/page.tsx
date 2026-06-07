"use client"
import Navbar from "../../components/Navbar"
import { ScanHistoryItem } from "../../types/scan";
import { useState, useEffect } from "react";
import { Download, Share2, Pencil, X, Shield, File, ChartColumnIncreasing, ChartPie } from 'lucide-react';


export default function ScanRecordPage() {
  const [selectedReport, setSelectedReport] = useState<ScanHistoryItem | null>(null);
  const [reports, setReports] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [reportTitles, setReportTitles] = useState<Record<number, string>>({});

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

  function saveChangesButton() {
    if (selectedReport) {
      setReportTitles({ ...reportTitles, [selectedReport.id]: modalTitle });
    }
  }

  return (
    <div className="flex">
      <Navbar />
      <div className="w-full flex-1">
        <p className="text-white text-[35px] font-semibold ml-6 mt-2">Scan Reports</p>
        <p className="text-gray-400 ml-6 mt-2">Browse, preview and manage generated reports.</p>
        <div className="w-full bg-[#102034] text-white flex justify-between">
          <p className="ml-2">Search bar</p>
          <p>Date</p>
          <p>All Report Types</p>
          <p className="mr-2">Filters</p>
        </div>


        <div>
          <p className="text-white">Pinned Reports</p>
          <div className="flex gap-4">
            {reports.slice(0, 4).map((report) => (
              <div className="border border-white" key={report.id}>
                <p className="text-white">{report.id} </p>
                <p className="text-white">{report.target_url} </p>
                <p className="text-white">{report.risk_level} </p>
                <p className="text-white">{report.risk_score} </p>
                <p className="text-white">{report.total_findings} </p>
                <p className="text-white">{report.created_at} </p>
              </div>
            ))}
          </div>
          <div className="bg-[#102034] mt-5 mx-5">
            <p className="text-gray-200">All Reports ({reports.length})</p>
            <div className="flex flex-wrap gap-5">

              {reports.map((report) => (
                <div key={report.id} className="border border-white">
                  <p className="text-white">Logo</p>
                  <p className="text-white">{reportTitles[report.id] || `Scan Report #${report.id}`} </p>
                  <div className="flex justify-between">
                    <button className="p-1 text-blue-400 cursor-pointer"> <Download /> </button>
                    <button className="p-1 text-white cursor-pointer"> <Share2 /> </button>
                    <button onClick={() => { setModal(true); setSelectedReport(report); setModalTitle(reportTitles[report.id] || `Scan Report #${report.id}`); }} className="p-1 text-red-800 cursor-pointer"> <Pencil /> </button>
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
                    <button onClick={() => { setSelectedReport(null); setModal(false); setModalTitle(""); }} className="text-white cursor-pointer mr-2 mb-2" ><X /></button>

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
                      <select className="placeholder-white w-full border border-gray-800 rounded-md mr-5 mt-1 pl-1 cursor-pointer py-1 px-2 text-white" >
                        <option>Security Assessment</option>
                        <option>Executive Summary</option>
                        <option>Compliance Review</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="ml-6 text-white mt-6">Report Icon</p>
                    <div className="flex items-center gap-3 ml-6 mt-2">
                      <Shield className="text-white border w-[13%] h-[13%] py-1 px-3 cursor-pointer" />
                      <File className="text-white border w-[13%] h-[13%] py-1 px-3 cursor-pointer " />
                      <ChartColumnIncreasing className="text-white border w-[13%] h-[13%] py-1 px-3 cursor-pointer" />
                      <ChartPie className="border text-white w-[13%] h-[13%] py-1 px-3 cursor-pointer" />
                    </div>
                  </div>

                  <div>
                    <p className="ml-6 text-white mt-6">Notes</p>
                    <input placeholder="Add any optional notes ..." className="placeholder-white h-16 border border-gray-700 w-[90%] ml-6 mr-6 pl-2 pb-8"></input>
                  </div>

                  <div className="flex justify-end gap-3 mr-6 mt-8">
                    <button className="cursor-pointer border text-lg rounded-md text-white px-4 py-2">Cancel</button>
                    <button className="cursor-pointer border-[#2a77f5] rounded-md text-lg text-white px-4 py-2 bg-[#2a77f5]" onClick={saveChangesButton}>Save Changes</button>

                  </div>

                </div>
              </div>
            )}

          </div>
        </div>


      </div>
    </div>
  )
}