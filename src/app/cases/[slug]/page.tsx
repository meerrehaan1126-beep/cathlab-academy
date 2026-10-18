"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Activity, FlaskConical, History, HeartPulse } from "lucide-react";
import { CASE_SEED } from "@/lib/data";

export default function CaseDetail({ params }: { params: Promise<{ slug: string }> }){
  const { slug }=use(params);
  const [c,setC]=useState<any>(CASE_SEED.find(x=>x.slug===slug)||null);
  const [step,setStep]=useState(0); const [picks,setPicks]=useState<(number|null)[]>([]);
  useEffect(()=>{ fetch(`/api/cases?slug=${slug}`).then(r=>r.json()).then(d=>{ if(d.case) setC(d.case); }).catch(()=>{}); },[slug]);
  if(!c) return <div className="bg-white rounded-3xl border p-12 text-center"><h1 className="text-2xl font-bold">Case not found</h1><Link href="/cases" className="text-[#0E9A8B] font-bold mt-3 inline-block">← All cases</Link></div>;
  const steps=c.steps||[]; const done=picks.filter(p=>p!==null&&p!==undefined).length; const finished=done>=steps.length;
  const score=steps.filter((s:any,i:number)=>picks[i]===s.correctIndex).length;

  return(
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/cases" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0E9A8B]"><ArrowLeft className="h-4 w-4"/> All cases</Link>
      <div className="overflow-hidden rounded-3xl bg-white border">
        <div className="relative h-52"><img src={c.image} alt={c.title} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-[#0F2040]/60 flex items-end"><div className="p-6 text-white"><span className="rounded-full bg-[#E94E3C] px-3 py-1 text-[11px] font-bold">{c.category} • {c.difficulty}</span><h1 className="text-2xl sm:text-3xl font-extrabold mt-2">{c.title}</h1></div></div></div>
        <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold text-slate-500 flex gap-1.5 items-center"><HeartPulse className="h-4 w-4 text-[#E94E3C]"/> PRESENTATION • {c.patient.age}y {c.patient.sex}</p><p className="mt-2 text-sm leading-relaxed">{c.patient.presentation}</p><p className="mt-3 text-sm font-bold bg-white border rounded-xl px-3 py-2">{c.patient.vitals}</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold text-slate-500 flex gap-1.5 items-center"><History className="h-4 w-4 text-[#2563A8]"/> HISTORY</p><p className="mt-2 text-sm leading-relaxed">{c.patient.history}</p></div>
          <div className="rounded-2xl bg-red-50 border border-red-100 p-5"><p className="text-xs font-bold text-red-600 flex gap-1.5 items-center"><Activity className="h-4 w-4"/> ECG FINDINGS</p><p className="mt-2 text-sm leading-relaxed">{c.patient.ecg}</p></div>
          <div className="rounded-2xl bg-teal-50 border border-teal-100 p-5"><p className="text-xs font-bold text-teal-700 flex gap-1.5 items-center"><FlaskConical className="h-4 w-4"/> LABS / IMAGING</p><p className="mt-2 text-sm leading-relaxed">{c.patient.labs}</p></div>
        </div>
      </div>

      <div className="flex items-center gap-3"><div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#0E9A8B] rounded-full transition-all" style={{width:`${steps.length?(done/steps.length)*100:0}%`}}/></div><span className="text-sm font-bold text-slate-600">{done}/{steps.length} decisions</span></div>

      {steps.map((s:any,i:number)=>{
        if(i>step && picks[i]===undefined) return null;
        const pick=picks[i];
        return <div key={i} className="bg-white rounded-3xl border p-6 sm:p-8">
          <p className="text-xs font-bold text-[#0E9A8B]">DECISION {i+1} OF {steps.length}</p>
          <h2 className="mt-2 text-xl font-extrabold text-[#0F2040]">{s.question}</h2>
          <div className="mt-5 space-y-2.5">
            {s.options.map((o:string,oi:number)=>{
              let cls="border-slate-200 bg-white hover:border-teal-300";
              if(pick!==null&&pick!==undefined){ if(oi===s.correctIndex) cls="border-green-500 bg-green-50 ring-1 ring-green-500"; else if(oi===pick) cls="border-red-500 bg-red-50 ring-1 ring-red-500"; }
              return <button key={oi} disabled={pick!==null&&pick!==undefined} onClick={()=>{ const u=[...picks]; u[i]=oi; setPicks(u); if(i===step) setStep(i+1); }} className={`w-full text-left rounded-2xl border-2 p-4 font-medium flex gap-3 items-center ${cls}`}>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs font-bold shrink-0">{["A","B","C","D"][oi]}</span><span className="flex-1">{o}</span>
                {(pick!==null&&pick!==undefined)&&oi===s.correctIndex&&<CheckCircle2 className="h-5 w-5 text-green-600 shrink-0"/>}
                {(pick!==null&&pick!==undefined)&&oi===pick&&oi!==s.correctIndex&&<XCircle className="h-5 w-5 text-red-600 shrink-0"/>}
              </button>;
            })}
          </div>
          {(pick!==null&&pick!==undefined)&&<div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm leading-relaxed"><b>{pick===s.correctIndex?"✓ Correct. ":"Not quite. "}</b>{s.explanation}</div>}
        </div>;
      })}

      {finished&&<div className="space-y-4">
        <div className="rounded-3xl bg-[#0F2040] text-white p-8 text-center"><Trophy className="h-10 w-10 mx-auto text-amber-400"/><p className="text-3xl font-extrabold mt-2">Case Complete — {score}/{steps.length} decisions correct</p><p className="text-white/70 text-sm mt-1">{score===steps.length?"Outstanding clinical reasoning!":score>=1?"Good effort — review the explanations above":"Tough case! Re-read and try again"}</p>
        <button onClick={()=>{setPicks([]);setStep(0);}} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E94E3C] px-6 py-2.5 font-bold text-sm"><RotateCcw className="h-4 w-4"/> Retry Case</button></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border p-6"><h3 className="font-extrabold text-[#0F2040]">Final Diagnosis</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">{c.diagnosis}</p><h3 className="font-extrabold text-[#0F2040] mt-5">Management</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">{c.management}</p></div>
          <div className="rounded-3xl bg-teal-50 border border-teal-200 p-6"><h3 className="font-extrabold text-teal-900">Take-Home Learning Points</h3><ul className="mt-3 space-y-2">{(c.learningPoints||[]).map((l:string)=>(<li key={l} className="flex gap-2 text-sm text-teal-950"><CheckCircle2 className="h-4 w-4 text-[#0E9A8B] shrink-0 mt-0.5"/>{l}</li>))}</ul>
          <div className="mt-5 flex gap-2 flex-wrap"><Link href="/quiz" className="rounded-full bg-[#0F2040] text-white text-xs font-bold px-4 py-2">Practice MCQs →</Link><Link href="/cases" className="rounded-full bg-white border text-xs font-bold px-4 py-2">More Cases</Link></div></div>
        </div>
      </div>}
    </div>
  );
}
