"use client";

import { LanguageProvider } from "contexts/LanguageContext";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      {children}
    </LanguageProvider>
  );
}
