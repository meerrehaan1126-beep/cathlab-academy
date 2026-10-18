"use client";
import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, Lightbulb, ClipboardList, RotateCcw } from "lucide-react";
import { PROCEDURES, PROCEDURE_MEDIA } from "@/lib/data";
import { LecturePlayer } from "@/components/VideoPlayer";

export default function ProceduresPage(){
  const [active,setActive]=useState(PROCEDURES[0]);
  const [checked,setChecked]=useState<Record<string,boolean>>({});
  const key=(i:number)=>`${active.slug}-${i}`;
  const doneCount=active.steps.filter((_,i)=>checked[key(i)]).length;
  return(
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#0F2040] text-white p-6 sm:p-8">
        <p className="text-xs font-bold text-[#5EEAD4]">PROCEDURE GUIDES & CHECKLISTS</p><h1 className="mt-2 text-3xl font-extrabold">Know the case before the case knows you</h1>
        <p className="mt-2 text-white/70 text-sm max-w-2xl leading-relaxed">Step-by-step workflows for the six case types you’ll meet most. Tick off steps during observation postings — turn passive watching into active learning.</p>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">{PROCEDURES.map(p=>(<button key={p.slug} onClick={()=>setActive(p)} className={`px-4 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap text-white`} style={{background:active.slug===p.slug?p.color:"#94A3B8"}}>{p.title.split(" — ")[0].split(" (")[0]}</button>))}</div>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
        <div className="bg-white rounded-3xl border overflow-hidden">
          {PROCEDURE_MEDIA[active.slug] && (
            <LecturePlayer src={PROCEDURE_MEDIA[active.slug].video} poster={PROCEDURE_MEDIA[active.slug].poster} title={active.title} />
          )}
          <div className="p-6 text-white" style={{background:active.color}}>
            <h2 className="text-2xl font-extrabold leading-snug">{active.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-black/25 px-3 py-1.5 flex items-center gap-1"><Clock className="h-3.5 w-3.5"/>{active.duration}</span><span className="rounded-full bg-black/25 px-3 py-1.5">Access: {active.access}</span><span className="rounded-full bg-black/25 px-3 py-1.5">{doneCount}/{active.steps.length} steps observed</span></div>
            <div className="mt-4 h-2 bg-black/25 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full transition-all" style={{width:`${(doneCount/active.steps.length)*100}%`}}/></div>
          </div>
          <div className="p-6 space-y-2.5">
            {active.steps.map((s,i)=>(
              <button key={i} onClick={()=>setChecked({...checked,[key(i)]:!checked[key(i)]})} className={`w-full text-left rounded-2xl border-2 p-4 flex gap-3 transition ${checked[key(i)]?"border-[#0E9A8B] bg-teal-50/70":"border-slate-200 hover:border-teal-200 bg-white"}`}>
                <span className={`grid h-8 w-8 place-items-center rounded-full font-bold text-xs shrink-0 text-white ${checked[key(i)]?"bg-[#0E9A8B]":"bg-[#0F2040]"}`}>{checked[key(i)]?<CheckCircle2 className="h-4.5 w-4.5"/>:i+1}</span>
                <span className={`text-[15px] leading-relaxed ${checked[key(i)]?"line-through opacity-60":""}`}>{s}</span>
              </button>
            ))}
            <button onClick={()=>{const u={...checked}; active.steps.forEach((_,i)=>delete u[key(i)]); setChecked(u);}} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 mt-2"><RotateCcw className="h-4 w-4"/> Reset checklist</button>
            {doneCount===active.steps.length&&<div className="rounded-2xl bg-teal-50 border border-teal-200 p-4 font-bold text-teal-800 text-center">🎉 Full case observed! Debrief: write 3 things you’d anticipate next time in your module notes.</div>}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border p-6"><h3 className="font-extrabold text-[#0F2040] flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500"/> Technologist Tips</h3><ul className="mt-3 space-y-2.5">{active.techTips.map(t=>(<li key={t} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-[#0E9A8B] shrink-0 mt-0.5"/>{t}</li>))}</ul></div>
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6"><h3 className="font-extrabold text-red-900 flex items-center gap-2"><AlertTriangle className="h-5 w-5"/> Pitfalls to Avoid</h3><ul className="mt-3 space-y-2.5">{active.pitfalls.map(t=>(<li key={t} className="flex gap-2 text-sm text-red-900"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"/>{t}</li>))}</ul></div>
          <div className="rounded-3xl bg-[#0F2040] text-white p-6"><h3 className="font-extrabold flex items-center gap-2"><ClipboardList className="h-5 w-5 text-[#5EEAD4]"/> Universal Time-Out</h3><p className="text-sm text-white/75 mt-2 leading-relaxed">Before every case, aloud: patient identity (2 identifiers), procedure & site, consent, allergies, antibiotics, anticoagulation, imaging displayed, concerns from any team member. Anyone can stop the line.</p></div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROCEDURES.filter(p=>p.slug!==active.slug).map(p=>(
          <button key={p.slug} onClick={()=>{setActive(p); window.scrollTo({top:0,behavior:"smooth"});}} className="text-left bg-white rounded-2xl border p-5 hover:shadow-lg transition">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{background:p.color}}>{p.duration}</span>
            <h3 className="font-extrabold text-[#0F2040] mt-3 leading-snug">{p.title}</h3><p className="text-xs text-slate-500 mt-1">{p.steps.length} steps • {p.access}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
