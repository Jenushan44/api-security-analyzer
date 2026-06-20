"use client"
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"
import TotalScansCard from "@/components/scan-history/TotalScansCard"
import AverageScoreCard from "@/components/scan-history/AverageScoreCard";
import { ScanHistoryItem, ScanResult } from "../../types/scan";
import CriticalScansCard from "@/components/scan-history/CriticalScansCard";
import LatestScanCard from "@/components/scan-history/LatestScanCard";
import ScanHistoryTable from '@/components/scan-history/ScanHistoryTable';
import { auth } from "../firebase";
import RequireLogin from "../../components/RequireLogin";

export default function ScanHistory() {

  const [scans, setScans] = useState<ScanHistoryItem[]>([]);

  let average_score: number | null = null;
  let currentSum = 0;
  let critical_count: number | null = null;
  let criticalCount = 0;
  let latest_scan: string | null = null;

  async function fetchScans() {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      setScans([]);
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scans?user_id=${userId}`, { method: "GET", });

    const data = await response.json();

    if (Array.isArray(data)) {
      setScans(data);
    } else {
      console.log(data);
      setScans([]);
    }
  }

  useEffect(() => {
    fetchScans()
  }, []);

  if (scans.length == 0) {
    average_score = null;
    critical_count = null;
    latest_scan = null;
  }
  else {
    for (const savedScan of scans) {
      currentSum += savedScan.risk_score;
      if (savedScan.risk_level === "Critical") {
        criticalCount += 1;
      }
    }
    average_score = currentSum / scans.length;
    critical_count = criticalCount;
    latest_scan = scans[0].created_at;
  }

  return (
    <RequireLogin>
      <div className="flex">
        <Navbar />
        <div className="w-full flex-1">
          <p className="text-white text-[35px] font-semibold ml-6 mt-2">Scan History</p>
          <p className="text-gray-400 text-[16px] ml-6">Review previous scans and track changes over time.</p>
          <div className='grid grid-cols-1 md:grid-cols-4 2xl:grid-cols-4 gap-5 px-6 items-stretch'>
            <TotalScansCard total_scans={scans.length === 0 ? null : scans.length} />
            <AverageScoreCard averageScore={average_score} />
            <CriticalScansCard critical_scans={critical_count} />
            <LatestScanCard latest_scan={latest_scan} />
          </div>
          <ScanHistoryTable scans={scans} />
        </div>

      </div>
    </RequireLogin>
  );
}