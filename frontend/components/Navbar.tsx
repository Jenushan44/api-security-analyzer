"use client";

import Link from "next/link";
import { House, History } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../app/firebase";

function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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

        <Link className="flex items-center text-lg rounded-md text-gray-300 p-2 py-3 ml-7 w-[90%] gap-2 hover:bg-[#102344] hover:text-[#296bd6]" href="/">
          <House className="mt-1" /> Dashboard
        </Link>

        <Link className="flex items-center text-lg rounded-md text-gray-300 p-2 py-3 ml-7 w-[90%] gap-2 hover:bg-[#102344] hover:text-[#296bd6]" href="/scans">
          <History className="mt-1" /> Scan History
        </Link>

        <Link className="flex items-center text-lg rounded-md text-gray-300 p-2 py-3 ml-7 w-[90%] gap-2 hover:bg-[#102344] hover:text-[#296bd6]" href="/reports">
          <History className="mt-1" /> Reports
        </Link>

        <div className="mt-auto mb-6 w-[85%] border-t border-gray-700 pt-4">
          {user ? (
            <div>
              <p className="text-white text-sm truncate">{user.email}</p>
              <button
                onClick={() => signOut(auth)}
                className="text-gray-400 text-sm hover:text-blue-400 mt-2 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-blue-400 text-sm hover:text-blue-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;