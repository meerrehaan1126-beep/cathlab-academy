"use client";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, Clock, BookOpen, Target, Lightbulb, Save, ChevronDown } from "lucide-react";
import { MODULE_SEED, MODULE_MEDIA, LECTURES } from "@/lib/data";
import { useStudent, displayName } from "@/components/StudentContext";
import { LecturePlayer } from "@/components/VideoPlayer";

export default function ModuleDetail({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = use(params);
  const { student } = useStudent();
  const fallback = MODULE_SEED.find(m=>m.slug===slug);
  const [mod,setMod]=useState<any>(fallback||null);
  const [note,setNote]=useState(""); const [savedMsg,setSavedMsg]=useState("");
  const [completed,setCompleted]=useState(false); const [bookmarked,setBookmarked]=useState(false);
  const [openSec,setOpenSec]=useState(0);
  const idx = MODULE_SEED.findIndex(m=>m.slug===slug);
  const prev = MODULE_SEED[idx-1]; const next = MODULE_SEED[idx+1];
  const name = displayName(student);

  useEffect(()=>{ fetch(`/api/modules/${slug}`).then(r=>r.json()).then(d=>{ if(d.module) setMod(d.module); }).catch(()=>{}); },[slug]);
  useEffect(()=>{
    fetch(`/api/notes?studentName=${encodeURIComponent(name)}&moduleSlug=${slug}`).then(r=>r.json()).then(d=>{ if(d.note?.content) setNote(d.note.content); }).catch(()=>{});
    fetch(`/api/progress?studentName=${encodeURIComponent(name)}`).then(r=>r.json()).then(d=>{ const p=(d.progress||[]).find((x:any)=>x.moduleSlug===slug); if(p) setCompleted(!!p.completed); }).catch(()=>{});
    fetch(`/api/bookmarks?studentName=${encodeURIComponent(name)}`).then(r=>r.json()).then(d=>{ setBookmarked((d.bookmarks||[]).some((b:any)=>b.itemSlug===slug)); }).catch(()=>{});
  },[slug,name]);

  if(!mod) return <div className="bg-white rounded-3xl border p-12 text-center"><h1 className="text-2xl font-bold">Module not found</h1><Link href="/modules" className="text-[#0E9A8B] font-bold mt-3 inline-block">← Back to modules</Link></div>;

  async function markComplete(){
    const nextVal=!completed; setCompleted(nextVal);
    await fetch("/api/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentName:name,studentId:student.id,moduleSlug:slug,moduleTitle:mod.title,completed:nextVal,percent:nextVal?100:40})}).catch(()=>{});
  }
  async function toggleBookmark(){
    const r=await fetch("/api/bookmarks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentName:name,itemType:"module",itemSlug:slug,title:mod.title})}).then(r=>r.json()).catch(()=>({bookmarked:!bookmarked}));
    setBookmarked(!!r.bookmarked);
  }
  async function saveNote(){
    await fetch("/api/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentName:name,moduleSlug:slug,content:note})}).catch(()=>{});
    setSavedMsg("Notes saved to your profile ✓"); setTimeout(()=>setSavedMsg(""),3000);
  }

  return(
    <div className="space-y-6">
      <Link href="/modules" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0E9A8B]"><ArrowLeft className="h-4 w-4"/> All modules</Link>
      <div className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="relative h-56 sm:h-72"><img src={mod.image} alt={mod.title} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-[#0F2040]/55 flex items-end"><div className="p-6 sm:p-8 text-white max-w-3xl">
          <span className="rounded-full px-3 py-1 text-[11px] font-bold text-white" style={{background:mod.color||"#0E9A8B"}}>{mod.category} • {mod.level}</span>
          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold leading-tight">{mod.title}</h1>
          <p className="mt-2 text-white/85 text-sm sm:text-base">{mod.description}</p>
        </div></div></div>
        <div className="p-5 flex flex-wrap items-center gap-3 border-b">
          <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium"><Clock className="h-4 w-4"/>{mod.durationMins} minutes</span>
          <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium"><BookOpen className="h-4 w-4"/>{mod.lessons} lessons</span>
          <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium"><Target className="h-4 w-4"/>{(mod.objectives||[]).length} objectives</span>
          <div className="flex-1"/>
          <button onClick={toggleBookmark} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border ${bookmarked?"bg-amber-50 border-amber-300 text-amber-700":"bg-white border-slate-300"}`}><Bookmark className="h-4 w-4" fill={bookmarked?"currentColor":"none"}/>{bookmarked?"Bookmarked":"Bookmark"}</button>
          <button onClick={markComplete} className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white ${completed?"bg-[#0E9A8B]":"bg-[#0F2040]"}`}><CheckCircle2 className="h-4 w-4"/>{completed?"Completed ✓":"Mark as complete"}</button>
        </div>
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-0">
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-extrabold text-[#0F2040] flex items-center gap-2"><Target className="h-5 w-5 text-[#0E9A8B]"/> What you will learn</h2>
            <ul className="grid sm:grid-cols-2 gap-2">{(mod.objectives||[]).map((o:string)=>(<li key={o} className="flex gap-2 text-sm bg-teal-50/70 border border-teal-100 rounded-xl p-3"><CheckCircle2 className="h-4 w-4 text-[#0E9A8B] shrink-0 mt-0.5"/>{o}</li>))}</ul>
            {MODULE_MEDIA[slug] && (
              <div className="pt-2">
                <h2 className="text-xl font-extrabold text-[#0F2040] mb-3">Watch this module</h2>
                <LecturePlayer src={MODULE_MEDIA[slug].video} poster={MODULE_MEDIA[slug].poster || mod.image} title={mod.title} />
                {(() => { const lec = LECTURES.find(l => l.id === MODULE_MEDIA[slug].lectureId); return lec ? <ul className="mt-3 space-y-1.5">{lec.takeaways.map(t => <li key={t} className="flex gap-2 text-sm text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#E94E3C] shrink-0"/>{t}</li>)}</ul> : null; })()}
              </div>
            )}
            <h2 className="text-xl font-extrabold text-[#0F2040] pt-4">Module Content</h2>
            {(mod.sections||[]).map((s:any,i:number)=>(
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={()=>setOpenSec(openSec===i?-1:i)} className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 text-left">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0F2040] text-white text-xs font-bold shrink-0">{i+1}</span>
                  <span className="flex-1 font-bold text-[#0F2040]">{s.heading}</span><ChevronDown className={`h-5 w-5 transition ${openSec===i?"rotate-180":""}`}/>
                </button>
                {openSec===i && <div className="p-5">
                  <p className="text-slate-700 leading-relaxed text-[15px]">{s.body}</p>
                  {s.bullets?.length>0 && <ul className="mt-3 space-y-1.5">{s.bullets.map((b:string)=>(<li key={b} className="flex gap-2 text-sm text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0E9A8B] shrink-0"/>{b}</li>))}</ul>}
                  {s.pearl && <div className="mt-4 flex gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4"><Lightbulb className="h-5 w-5 text-amber-600 shrink-0"/><div><p className="text-xs font-bold text-amber-700">CLINICAL PEARL — CATHLAB TIP</p><p className="text-sm text-amber-900 mt-0.5">{s.pearl}</p></div></div>}
                </div>}
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/quiz" className="flex-1 text-center rounded-full bg-[#E94E3C] text-white font-bold py-3 text-sm">Test yourself — Quiz Arena →</Link>
              <Link href="/flashcards" className="flex-1 text-center rounded-full border-2 border-[#0F2040] text-[#0F2040] font-bold py-3 text-sm">Revise with Flashcards</Link>
            </div>
          </div>
          <aside className="p-6 sm:p-8 bg-slate-50 border-l border-slate-200 space-y-5">
            <div>
              <h3 className="font-extrabold text-[#0F2040]">My Notes</h3>
              <p className="text-xs text-slate-500 mt-1">Saved for {name}. Jot viva points, formulas, doubts for your next posting.</p>
              <textarea value={note} onChange={e=>setNote(e.target.value)} rows={9} placeholder={"e.g. Spider view = LAO caudal for LMCA…\nACT target 250–300…\nAsk sir about IVUS MLA cutoffs…"} className="mt-3 w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-teal-500 resize-y"/>
              <button onClick={saveNote} className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#0E9A8B] text-white text-sm font-bold px-5 py-2.5"><Save className="h-4 w-4"/> Save notes</button>
              {savedMsg&&<p className="text-sm text-teal-700 font-semibold mt-2">{savedMsg}</p>}
            </div>
            <div className="rounded-2xl bg-[#0F2040] text-white p-5">
              <p className="font-bold">Posting Tip</p>
              <p className="text-sm text-white/75 mt-1 leading-relaxed">After finishing this module, spend one cathlab posting only observing this topic. Note 3 real cases and compare with what you learned here.</p>
            </div>
            <div className="rounded-2xl bg-white border p-5">
              <p className="font-bold text-[#0F2040] text-sm">Related tools</p>
              <div className="mt-3 space-y-2 text-sm font-semibold">
                <Link href="/media" className="block hover:text-[#0E9A8B]">→ Videos & image library</Link>
                <Link href="/calculators" className="block hover:text-[#0E9A8B]">→ Hemodynamic calculators</Link>
                <Link href="/ecg-lab" className="block hover:text-[#0E9A8B]">→ ECG & pressure tracings</Link>
                <Link href="/glossary" className="block hover:text-[#0E9A8B]">→ Glossary for this topic</Link>
                <Link href="/cases" className="block hover:text-[#0E9A8B]">→ Apply in clinical cases</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="flex justify-between gap-3">
        {prev?<Link href={`/modules/${prev.slug}`} className="rounded-full bg-white border px-5 py-3 text-sm font-bold flex items-center gap-2"><ArrowLeft className="h-4 w-4"/> {prev.title.slice(0,28)}…</Link>:<span/>}
        {next&&<Link href={`/modules/${next.slug}`} className="rounded-full bg-[#0F2040] text-white px-5 py-3 text-sm font-bold flex items-center gap-2">Next: {next.title.slice(0,28)}… <ArrowRight className="h-4 w-4"/></Link>}
      </div>
    </div>
  );
}
