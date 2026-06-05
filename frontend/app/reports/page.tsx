"use client"
import Navbar from "../../components/Navbar"
import { ScanHistoryItem } from "../../types/scan";
import { useState, useEffect } from "react";
import { Download, Share2, Pencil } from 'lucide-react';


export default function ScanRecordPage() {
  const [selectedReport, setSelectedReport] = useState<ScanHistoryItem | null>(null);
  const [reports, setReports] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchReport() {

    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/scans")
      const data = await response.json();
      setReports(data);
      if (data.length() > 0) {
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
                  <p className="text-white">title</p>
                  <div className="flex justify-between">
                    <button className="p-1 text-blue-400 cursor-pointer"> <Download /> </button>
                    <button className="p-1 text-white cursor-pointer"> <Share2 /> </button>
                    <button className="p-1 text-red-800 cursor-pointer"> <Pencil /> </button>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>


      </div>
    </div>
  )
}