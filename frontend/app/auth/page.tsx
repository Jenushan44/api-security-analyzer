"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignUp() {
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      console.log(error);
      console.log(error.code);
      console.log(error.message);

      setError(error.code);
    }
  }

  async function handleLogin() {
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch {
      setError("Could not log in. Check your email and password.");
    }
  }

  return (
    <div className="min-h-screen bg-[#070F1B] flex items-center justify-center">

      <Link href="/" className="flex items-center text-[18px] text-gray-400 gap-1 hover:text-blue-400 text-sm fixed top-3 left-3">
        <ArrowLeft className="mt-1" size={25} /> Back to Dashboard
      </Link>

      <div className="bg-[#071525] border border-gray-700 rounded-xl p-8 w-[400px]">
        <h1 className="text-white text-3xl font-semibold mb-2">API Security Analyzer</h1>
        <p className="text-gray-400 mb-6">Log in or create an account.</p>

        <div className="space-y-4">
          <input
            className="w-full bg-[#0b1c31] border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full bg-[#0b1c31] border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-md cursor-pointer">Log In</button>

          <button onClick={handleSignUp} className="w-full border border-gray-700 hover:border-blue-400 text-white py-3 rounded-md cursor-pointer">Create Account</button>
        </div>
      </div>
    </div>
  );
}