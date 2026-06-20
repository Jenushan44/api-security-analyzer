"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../app/firebase";

export default function RequireLogin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {

        setAllowed(true);
      } else {

        router.push("/auth");

      }

    });
  }, [router]);

  if (!allowed) {
    return <p className="text-white">Loading...</p>;
  }

  return <div>{children}</div>;
}