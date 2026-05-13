"use client";
import { useState } from 'react'


export default function Home() {

  const [apiUrl, setApiUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

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
    <main>
      <div>
        <h1 className="text-center mt-5">API Security Analyzer</h1>
        <input type="text" value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} placeholder="Enter your api url" />
        <button onClick={handleScan}>{loading == true ? "Scanning" : "Scan"}</button>
        {error && <p>{error}</p>}
        {result && (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </main >

  );
}
