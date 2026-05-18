"use client"
import { useState } from "react";
import { ScanResult } from "../../types/scan";
import { Globe, Play } from 'lucide-react';

function ScanFormCard({ setResult }: { setResult: (result: ScanResult | null) => void; }) {

  const [apiUrl, setApiUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sends the user url to the FastAPI scanner and stores returned report
  async function handleScan() {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/scan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "url": apiUrl })
        })
      const data = await response.json()
      setResult(data)
    }
    catch {
      setError('Error: Response not found')
    }
    finally {
      setLoading(false);
      setApiUrl('');
    }
  }

  return (
    <div className="w-full bg-[#0B1624] h-25 border border-gray-800 border-1 rounded-xl flex items-center px-6 justify-between gap-8">
      <div className="flex items-center gap-4 shrink-0">
        <div className="border border-gray-800 rounded-full w-14 h-14 flex items-center justify-center">
          <Globe className="text-[#2563EB] w-7 h-7" />
        </div>

        <div>
          <p className="text-white font-semibold text-[15px]">Start a New Scan</p>
          <p className="text-gray-400 text-xs mt-0.5">Enter the base URL of your API to analyze <br />  its security risks.</p>
        </div>
      </div>

      <div className="flex-1 w-full">
        <div>
          <p className="text-gray-400 text-xs mb-1.5 font-medium">Target URL</p>
          <input type="text" value={apiUrl} className="text-white border border-gray-800 bg-transparent p-2 w-full text-sm focus:border-blue-500" onChange={(event) => setApiUrl(event.target.value)} placeholder="Enter your api url" />
        </div>
      </div>

      <button onClick={handleScan} className="cursor-pointer text-white mt-4 border border-gray-800 rounded-lg bg-[#2563EB] px-5 py-2.5 shrink-0 font-medium flex items-center gap-2"> <Play className="w-4 h-4" fill="white" /> {loading == true ? "Scanning" : "Run Scan"}</button>
      {error && <p>{error}</p>}
    </div>
  )
}

export default ScanFormCard