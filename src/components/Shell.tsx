"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Home, BookOpen, Brain, Layers, Calculator, Activity, ClipboardList, Stethoscope, BookMarked, Briefcase, User, Menu, GraduationCap, Search, Clapperboard, Rocket } from "lucide-react";
import { useState } from "react";
import { useStudent, displayName } from "./StudentContext";

const NAV = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/modules", label: "Learning Modules", icon: BookOpen },
  { href: "/quiz", label: "Quiz Arena", icon: Brain },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/calculators", label: "Clinical Calculators", icon: Calculator },
  { href: "/ecg-lab", label: "ECG & Hemodynamics Lab", icon: Activity },
  { href: "/procedures", label: "Procedure Guides", icon: ClipboardList },
  { href: "/cases", label: "Clinical Cases", icon: Stethoscope },
  { href: "/media", label: "Videos & Image Library", icon: Clapperboard },
  { href: "/glossary", label: "Glossary & Abbreviations", icon: BookMarked },
  { href: "/career", label: "Career Roadmap", icon: Briefcase },
  { href: "/profile", label: "My Profile & Progress", icon: User },
  { href: "/publish", label: "How to Publish", icon: Rocket },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { student } = useStudent();
  const initials = displayName(student).split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();

  const Sidebar = (
    <div className="flex h-full flex-col bg-[#0F2040] text-white">
      <Link href="/" className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#E94E3C] shrink-0"><HeartPulse className="h-6 w-6" /></div>
        <div>
          <p className="font-extrabold leading-none text-[17px]">CathLab Academy</p>
          <p className="text-[11px] text-white/60 mt-1">For Cardiac Technology &<br/>Allied Health Students</p>
        </div>
      </Link>

      <div className="px-4 py-3">
        <div className="rounded-xl bg-white/[0.07] border border-white/10 p-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0E9A8B] font-bold text-sm shrink-0">{student.name ? initials : <GraduationCap className="h-5 w-5"/>}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{displayName(student)}</p>
            <p className="text-[11px] text-white/55 truncate">{student.course} • {student.year}</p>
          </div>
        </div>
        {!student.name && <Link href="/profile" onClick={()=>setOpen(false)} className="mt-2 block text-center text-xs font-semibold bg-[#E94E3C] hover:bg-[#d63f2e] rounded-lg py-2">Set up your profile →</Link>}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {NAV.map(item=>{
          const active = item.href==="/" ? pathname==="/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition ${active ? "bg-[#0E9A8B] text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
              <item.icon className="h-[18px] w-[18px] shrink-0" /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="rounded-xl bg-[#0E9A8B]/15 border border-[#0E9A8B]/30 p-3">
          <p className="text-xs font-bold text-[#5EEAD4]">Daily Pearl</p>
          <p className="text-[12px] text-white/80 mt-1 leading-relaxed">“Announce early, announce clearly — a great monitor technologist speaks before being asked.”</p>
        </div>
        <p className="text-[10px] text-white/35 mt-3 text-center">Made for Allied Health • Cardiac Technology • Cathlab</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FA] lg:flex">
      <aside className="hidden lg:flex lg:w-[280px] lg:fixed lg:inset-y-0 lg:left-0 flex-col z-30 shadow-xl">{Sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[285px]">{Sidebar}</div>
        </div>
      )}
      <div className="flex-1 lg:pl-[280px] min-w-0">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={()=>setOpen(true)}><Menu className="h-5 w-5"/></button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-[#0F2040]">CathLab Academy</span>
              <span>•</span><span className="capitalize">{pathname==="/"?"Dashboard":pathname.split("/")[1]?.replaceAll("-"," ")}</span>
            </div>
            <div className="flex-1" />
            <Link href="/glossary" className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 hover:border-teal-300 w-[280px]"><Search className="h-4 w-4"/> Search terms, e.g. TIMI, FFR, ACT…</Link>
            <Link href="/quiz" className="rounded-full bg-[#E94E3C] text-white text-sm font-semibold px-4 py-2 hover:bg-[#d63f2e]">Take a Quiz</Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">{children}</main>
        <footer className="border-t border-slate-200 bg-white mt-8">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-slate-500">
            <p><b className="text-[#0F2040]">CathLab Academy</b> — Learning platform for B.Sc Cardiac Technology, Cathlab Technology & Allied Health Science students.</p>
            <p>Educational use only • Always follow your hospital protocols & operator guidance.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
