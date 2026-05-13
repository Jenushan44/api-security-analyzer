"use client";
import { useState } from 'react'
import Navbar from "../components/Navbar"
import { ScanResult } from "../types/scan";

export default function Home() {

  const [apiUrl, setApiUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

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
    }

  }

  return (
    <div className='flex'>
      <Navbar />
      <main className='flex-1'>
        <h1 className="text-center mt-5">API Security Analyzer</h1>
        <input type="text" value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} placeholder="Enter your api url" />
        <button onClick={handleScan}>{loading == true ? "Scanning" : "Scan"}</button>
        {error && <p>{error}</p>}
        {result && (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
        <div className='flex items-center justify-evenly mt-10 text-center'>
          <div className='border'>
            <div className='w-[200px]'>
              <p className='text-left pl-3 pt-3'>Risk Score</p>
            </div>
            <div>
              {result && (
                <p className='text-[50px]'>{result.risk_score}</p>
              )}
              <p className='text-right pr-5'>out of 100</p>
            </div>
          </div>

          <div className='border'>
            <div className='w-[200px]'>
              <p>Risk Level</p>
            </div>
            <div>
              {result && (
                <p>{result.risk_level}</p>
              )}
            </div>
          </div>


          <div className='border'>
            <div className='w-[200px]'>
              <p>Total Findings</p>
            </div>
            <div>
              {result && (
                <p></p>
              )}
            </div>
          </div>

          <div className='border'>
            <div className='w-[200px]'>
              <p>Scan Summary</p>
            </div>
            <div>
              {result && (
                <p>{result.risk_summary}</p>
              )}
            </div>
          </div>



        </div>

      </main >
    </div >
  );
}
