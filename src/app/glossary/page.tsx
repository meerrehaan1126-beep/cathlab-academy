"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, BookMarked } from "lucide-react";
import { GLOSSARY_SEED } from "@/lib/data";

export default function GlossaryPage(){
  const [terms,setTerms]=useState<any[]>(GLOSSARY_SEED as any);
  const [q,setQ]=useState(""); const [cat,setCat]=useState("All");
  useEffect(()=>{ fetch("/api/glossary").then(r=>r.json()).then(d=>{ if(d.terms?.length) setTerms(d.terms); }).catch(()=>{}); },[]);
  const cats=useMemo(()=>["All",...Array.from(new Set(terms.map((t:any)=>t.category)))],[terms]);
  const letters=useMemo(()=>Array.from(new Set(terms.map((t:any)=>t.term[0].toUpperCase()))).sort(),[terms]);
  const [letter,setLetter]=useState("All");
  const filtered=terms.filter((t:any)=>(cat==="All"||t.category===cat)&&(letter==="All"||t.term.toUpperCase().startsWith(letter))&&(`${t.term} ${t.abbreviation} ${t.definition}`).toLowerCase().includes(q.toLowerCase())).sort((a:any,b:any)=>a.term.localeCompare(b.term));
  return(
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#0F2040] text-white p-6 sm:p-8">
        <p className="text-xs font-bold text-[#5EEAD4]">GLOSSARY & ABBREVIATIONS</p><h1 className="mt-2 text-3xl font-extrabold">Speak cathlab fluently</h1>
        <p className="mt-2 text-white/70 text-sm max-w-2xl leading-relaxed">30 essential terms you'll hear every single day — searchable by full form or abbreviation. Keep this open during postings until it's second nature.</p>
        <label className="mt-5 flex items-center gap-3 bg-white rounded-full px-5 py-3.5 text-slate-900 max-w-xl shadow"><Search className="h-5 w-5 text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search… try ACT, TIMI, IVUS, tamponade, wedge" className="flex-1 outline-none text-sm bg-transparent"/></label>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap ${cat===c?"bg-[#0E9A8B] text-white":"bg-white border border-slate-200"}`}>{c}</button>)}</div>
      <div className="flex gap-1.5 flex-wrap"><button onClick={()=>setLetter("All")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${letter==="All"?"bg-[#0F2040] text-white":"bg-white border"}`}>ALL</button>{letters.map(l=><button key={l} onClick={()=>setLetter(l)} className={`h-8 w-8 rounded-lg text-xs font-bold ${letter===l?"bg-[#0F2040] text-white":"bg-white border"}`}>{l}</button>)}</div>
      <p className="text-sm text-slate-500 font-semibold">{filtered.length} term{filtered.length!==1?"s":""} found</p>
      {filtered.length===0&&<div className="bg-white border rounded-3xl p-10 text-center text-slate-500">No term matches “{q}”. Try the abbreviation (e.g. FFR) or clear filters.</div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t:any,i:number)=>(
          <div key={t.id||i} className="bg-white rounded-2xl border p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0F2040] text-white font-extrabold text-sm shrink-0">{t.abbreviation||t.term.slice(0,2).toUpperCase()}</span><div><h3 className="font-extrabold text-[#0F2040] leading-tight">{t.term}</h3>{t.abbreviation&&<p className="text-[11px] font-bold text-[#E94E3C]">{t.abbreviation}</p>}</div></div><BookMarked className="h-4 w-4 text-slate-300 shrink-0"/></div>
            <span className="inline-block mt-3 text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">{t.category}</span>
            <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{t.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
