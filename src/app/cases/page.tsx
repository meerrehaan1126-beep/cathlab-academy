"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Stethoscope } from "lucide-react";
import { CASE_SEED } from "@/lib/data";

export default function CasesPage(){
  const [cases,setCases]=useState<any[]>(CASE_SEED as any);
  useEffect(()=>{ fetch("/api/cases").then(r=>r.json()).then(d=>{ if(d.cases?.length) setCases(d.cases); }).catch(()=>{}); },[]);
  return(
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-[#0F2040] text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold text-[#5EEAD4]">CLINICAL CASE STUDIES</p><h1 className="mt-2 text-3xl font-extrabold">Think like you're already on the team</h1>
            <p className="mt-2 text-white/70 text-sm max-w-2xl leading-relaxed">Each case gives you vitals, ECG and labs, then asks you to make cathlab decisions step by step — with explanations, final diagnosis and take-home learning points.</p>
          </div>
          <div className="relative min-h-[200px]">
            <img src="/images/pci-stent.jpg" alt="PCI stent" className="absolute inset-0 h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-[#0F2040]/35"/>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {cases.map((c:any)=>(
          <Link key={c.slug} href={`/cases/${c.slug}`} className="group bg-white rounded-3xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition flex flex-col">
            <div className="relative h-48"><img src={c.image} alt={c.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/>
              <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#0F2040] flex items-center gap-1"><Stethoscope className="h-3 w-3"/>{c.category}</span>
              <span className={`absolute top-3 right-3 rounded-full px-3 py-1 text-[11px] font-bold text-white ${c.difficulty==="Advanced"?"bg-[#E94E3C]":"bg-[#D98E00]"}`}>{c.difficulty}</span></div>
            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-xl font-extrabold text-[#0F2040] leading-snug">{c.title}</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">{c.patient?.presentation}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-4"><span className="text-xs font-semibold text-slate-500">{c.patient?.age}y {c.patient?.sex} • {(c.steps||[]).length} decision steps</span><span className="inline-flex items-center gap-1 font-bold text-sm text-[#0E9A8B]">Solve Case <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition"/></span></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
