import Link from "next/link";
import { House, History } from 'lucide-react';
import Image from "next/image";

function Navbar() {
  return (
    <div className="flex sm:w-[60px] md:w-[260px] lg:w-[320px] min-h-screen bg-[#09172b] border-r border-gray-800">
      <div className="flex flex-col items-center w-full gap-y-5">
        <div className="flex items-center">
          <div className="flex gap-2 mt-5">
            <h1 className="text-[#38BDF8] font-bold text-2xl">API</h1>
            <h1 className="text-[#E5E7EB] font-bold text-2xl">Security</h1>
            <h1 className="text-[#E5E7EB] font-bold text-2xl">Analyzer</h1>
          </div>
        </div>
        <Link className="flex items-center text-lg rounded-md text-gray-300 p-2 py-3 ml-7 w-[90%] text-center flex gap-2 hover:bg-[#102344] hover:text-[#296bd6]" href="/"> <House className="mt-1" /> Dashboard</Link>
        <Link className="flex items-center text-lg rounded-md text-gray-300 p-2 py-3 ml-7 w-[90%] text-center flex gap-2 hover:bg-[#102344] hover:text-[#296bd6]" href="/scans"> <History className="mt-1" /> Scan History</Link>
      </div>
    </div>
  )
}

export default Navbar