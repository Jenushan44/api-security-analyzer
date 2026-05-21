import Link from "next/link";
import { House, History } from 'lucide-react';

function Navbar() {
  return (
    <div className="flex sm:w-[60px] md:w-[200px] lg:w-[300px] min-h-screen bg-gray-800 ">
      <div className="flex flex-col items-center w-full gap-y-5">
        <h1 className="text-white mt-2">Navbar</h1>
        <Link className="rounded-md text-white p-2 w-[90%] text-center flex gap-2 hover:bg-gradient-to-r from-[#0B1624] via-[#0F2A4A] to-[#123B73] hover:border-r-[#2564EB]" href="/"> <House /> Dashboard</Link>
        <Link className="rounded-md text-white p-2 w-[90%] text-center flex gap-2 hover:bg-gradient-to-r from-[#0B1624] via-[#0F2A4A] to-[#123B73] hover:border-r-[#2564EB]" href="/scans"> <History /> Scan History</Link>
      </div>
    </div>
  )
}

export default Navbar