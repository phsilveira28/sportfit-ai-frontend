"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import Navbar from "@/components/Navbar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
      </AuthProvider>
    </LocaleProvider>
  );
}
