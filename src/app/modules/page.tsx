"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock, BookOpen, CheckCircle2, Search, ArrowRight } from "lucide-react";
import { MODULE_SEED } from "@/lib/data";
import { useStudent, displayName } from "@/components/StudentContext";

const CATS = ["All","Foundations","Cathlab Core","Procedures","Physiology","Patient Safety"];
export default function ModulesPage(){
  const { student } = useStudent();
  const [modules,setModules]=useState<any[]>(MODULE_SEED as any);
  const [cat,setCat]=useState("All"); const [q,setQ]=useState(""); const [level,setLevel]=useState("All");
  const [progress,setProgress]=useState<any[]>([]);
  useEffect(()=>{ fetch("/api/modules").then(r=>r.json()).then(d=>{ if(d.modules?.length) setModules(d.modules); }).catch(()=>{}); },[]);
  useEffect(()=>{ fetch(`/api/progress?studentName=${encodeURIComponent(displayName(student))}`).then(r=>r.json()).then(d=>setProgress(d.progress||[])).catch(()=>{}); },[student]);
  const done=new Set(progress.filter(p=>p.completed).map(p=>p.moduleSlug));
  const filtered=useMemo(()=>modules.filter(m=>(cat==="All"||m.category===cat)&&(level==="All"||m.level===level)&&(m.title+m.description+m.category).toLowerCase().includes(q.toLowerCase())),[modules,cat,q,level]);
  return(
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#0F2040] text-white p-6 sm:p-8">
        <p className="text-xs font-bold text-[#5EEAD4]">LEARNING MODULES</p>
        <h1 className="mt-2 text-3xl font-extrabold">Master the Cathlab, module by module</h1>
        <p className="mt-2 text-white/70 max-w-2xl text-sm leading-relaxed">8 structured modules from coronary anatomy to TAVI and ACLS. Each module has objectives, focused sections, clinical pearls, your personal notes area and a completion tracker.</p>
        <div className="mt-5 flex items-center gap-3 max-w-md"><div className="flex-1 h-3 bg-white/15 rounded-full overflow-hidden"><div className="h-full bg-[#0E9A8B] rounded-full" style={{width:`${(done.size/modules.length)*100}%`}}/></div><span className="text-sm font-bold">{done.size}/{modules.length} complete</span></div>
      </div>
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2.5 flex-1"><Search className="h-4 w-4 text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search modules… e.g. hemodynamics, TAVI, radiation" className="flex-1 outline-none text-sm bg-transparent"/></label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">{["All","Beginner","Intermediate","Advanced"].map(l=><button key={l} onClick={()=>setLevel(l)} className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap ${level===l?"bg-[#0F2040] text-white":"bg-white border border-slate-200"}`}>{l}</button>)}</div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">{CATS.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${cat===c?"bg-[#0E9A8B] text-white":"bg-white border border-slate-200 text-slate-600"}`}>{c}</button>)}</div>
      {filtered.length===0 && <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">No modules match your search. Try another keyword.</div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((m,i)=>(
          <Link key={m.slug} href={`/modules/${m.slug}`} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition flex flex-col">
            <div className="relative h-44 shrink-0"><img src={m.image||MODULE_SEED[i%MODULE_SEED.length].image} alt={m.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/>
              <span className="absolute top-3 left-3 bg-[#0F2040]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">{m.level}</span>
              {done.has(m.slug)&&<span className="absolute top-3 right-3 bg-[#0E9A8B] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Completed</span>}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide" style={{color:m.color||"#0E9A8B"}}>{m.category}</p>
              <h2 className="mt-1.5 font-extrabold text-[#0F2040] text-lg leading-snug">{m.title}</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">{m.description}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="flex gap-3 text-xs text-slate-500 font-medium"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/>{m.durationMins} min</span><span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5"/>{m.lessons} lessons</span></span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[#0E9A8B]">Study <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition"/></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
