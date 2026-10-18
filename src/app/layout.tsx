import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Shell from "@/components/Shell";
import { StudentProvider } from "@/components/StudentContext";

export const metadata: Metadata = {
  title: "CathLab Academy — For Cathlab Technologists & Cardiac Technology Students",
  description: "Learning modules, MCQ quiz arena, flashcards, hemodynamic calculators, ECG lab, procedure guides and clinical cases for Allied Health Science students aspiring to work in the cardiac catheterisation laboratory.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F4F7FA] text-slate-900 antialiased">
        <StudentProvider><Shell>{children}</Shell></StudentProvider>
      </body>
    </html>
  );
}
