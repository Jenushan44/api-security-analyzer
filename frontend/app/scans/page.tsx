"use client"
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"
import TotalScansCard from "@/components/scan-history/TotalScansCard"
import { ScanResult } from "../../types/scan";

export default function ScanHistory() {

  const [scan, setScan] = useState<ScanResult[]>([]);

  async function fetchScans() {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/scans",
      {
        method: "GET",
      })

    const data = await response.json();
    setScan(data);
  }

  useEffect(() => {
    fetchScans()
  }, []);


  return (
    <div className="flex">
      <Navbar />
      <div>
        <p className="text-white text-[35px] font-semibold ml-6 mt-2">Scan History</p>
        <p className="text-gray-400 text-[16px] ml-6">Review previous scans and track changes over time.</p>
        <div className='grid grid-cols-1 md:grid-cols-4 2xl:grid-cols-4 gap-5 px-6 items-stretch'>
          <TotalScansCard total_scans={scan.length} />
        </div>
      </div>

    </div>
  )
}
