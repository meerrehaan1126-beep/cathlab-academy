"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Save, Trophy, Target, CheckCircle2, Bookmark, Brain, GraduationCap, ArrowRight } from "lucide-react";
import { useStudent, displayName, Student } from "@/components/StudentContext";
import { MODULE_SEED } from "@/lib/data";

const COURSES=["B.Sc Cardiac Technology","B.Sc Cathlab Technology","B.Sc Cardiovascular Technology","B.Sc Allied Health Sciences","Diploma in Cathlab Technology","M.Sc Cardiac Technology","Other Allied Health Course"];
const YEARS=["1st Year","2nd Year","3rd Year","4th Year","Internship","Working Professional","Preparing for Admission"];
export default function ProfilePage(){
  const { student, setStudent }=useStudent();
  const [form,setForm]=useState<Student>(student); const [saved,setSaved]=useState("");
  const [dash,setDash]=useState<any>(null);
  useEffect(()=>{ setForm(student); },[student.name]);
  const name=displayName(student);
  useEffect(()=>{ fetch(`/api/dashboard?studentName=${encodeURIComponent(name)}`).then(r=>r.json()).then(setDash).catch(()=>{}); },[name,saved]);

  async function save(e:React.FormEvent){ e.preventDefault();
    let id=form.id||student.id||null;
    if(form.name.trim() && form.name.trim()!==student.name){
      try{ const d=await fetch("/api/students",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}).then(r=>r.json()); if(d.student?.id) id=d.student.id; }catch{}
    }
    setStudent({...form,id}); setSaved("Profile saved ✓ Your progress now tracks under your name."); setTimeout(()=>setSaved(""),4000);
  }
  const completed=new Set((dash?.progress||[]).filter((p:any)=>p.completed).map((p:any)=>p.moduleSlug));
  const FIELD="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white";
  return(
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="rounded-3xl bg-[#0F2040] text-white p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#E94E3C] text-2xl font-extrabold shrink-0">{name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}</div>
        <div className="flex-1"><h1 className="text-3xl font-extrabold">{name}</h1><p className="text-white/70 text-sm mt-1">{student.course} • {student.year}{student.college?` • ${student.college}`:""}</p>{student.goal&&<p className="text-[#5EEAD4] text-sm font-semibold mt-1">🎯 {student.goal}</p>}</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 rounded-xl px-4 py-3"><p className="text-xl font-extrabold">{dash?.stats?.avgScore||0}%</p><p className="text-[10px] text-white/60">AVG SCORE</p></div>
          <div className="bg-white/10 rounded-xl px-4 py-3"><p className="text-xl font-extrabold">{completed.size}</p><p className="text-[10px] text-white/60">MODULES</p></div>
          <div className="bg-white/10 rounded-xl px-4 py-3"><p className="text-xl font-extrabold">{dash?.stats?.attempts||0}</p><p className="text-[10px] text-white/60">QUIZZES</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <form onSubmit={save} className="bg-white rounded-3xl border p-6 sm:p-8 space-y-4">
          <h2 className="font-extrabold text-lg text-[#0F2040] flex items-center gap-2"><GraduationCap className="h-5 w-5 text-[#0E9A8B]"/> Student Profile</h2>
          <label className="block"><span className="text-xs font-bold text-slate-600">Full Name *</span><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Priya Sharma" className={FIELD}/></label>
          <label className="block"><span className="text-xs font-bold text-slate-600">College / Hospital</span><input value={form.college} onChange={e=>setForm({...form,college:e.target.value})} placeholder="e.g. Govt. Medical College, Kochi" className={FIELD}/></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-xs font-bold text-slate-600">Course</span><select value={form.course} onChange={e=>setForm({...form,course:e.target.value})} className={FIELD}>{COURSES.map(c=><option key={c}>{c}</option>)}</select></label>
            <label className="block"><span className="text-xs font-bold text-slate-600">Year</span><select value={form.year} onChange={e=>setForm({...form,year:e.target.value})} className={FIELD}>{YEARS.map(y=><option key={y}>{y}</option>)}</select></label>
          </div>
          <label className="block"><span className="text-xs font-bold text-slate-600">My Goal</span><input value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} placeholder="e.g. Scrub independently for PCI by internship" className={FIELD}/></label>
          <button className="w-full rounded-full bg-[#E94E3C] text-white font-extrabold py-3.5 flex items-center justify-center gap-2"><Save className="h-4 w-4"/> Save Profile</button>
          {saved&&<p className="text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl p-3">{saved}</p>}
          <p className="text-[11px] text-slate-400">Your quiz scores, module progress, bookmarks & notes are saved under this name in our database.</p>
        </form>

        <div className="space-y-4">
          <div className="bg-white rounded-3xl border p-6">
            <h2 className="font-extrabold text-[#0F2040] flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#0E9A8B]"/> Module Progress</h2>
            <div className="mt-3 flex items-center gap-3"><div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#0E9A8B] rounded-full" style={{width:`${(completed.size/MODULE_SEED.length)*100}%`}}/></div><b className="text-sm">{completed.size}/{MODULE_SEED.length}</b></div>
            <div className="mt-4 space-y-2">{MODULE_SEED.map(m=>(
              <Link key={m.slug} href={`/modules/${m.slug}`} className="flex items-center gap-3 rounded-xl bg-slate-50 hover:bg-teal-50 px-4 py-3 transition">
                <span className={`grid h-7 w-7 place-items-center rounded-full text-white text-xs shrink-0 ${completed.has(m.slug)?"bg-[#0E9A8B]":"bg-slate-300"}`}>{completed.has(m.slug)?"✓":""}</span>
                <span className="flex-1 text-sm font-semibold leading-tight">{m.title}</span><ArrowRight className="h-4 w-4 text-slate-400"/>
              </Link>))}</div>
          </div>
          <div className="bg-white rounded-3xl border p-6">
            <h2 className="font-extrabold text-[#0F2040] flex items-center gap-2"><Brain className="h-5 w-5 text-[#E94E3C]"/> Quiz History</h2>
            {(!dash?.attempts?.length)?<p className="text-sm text-slate-500 mt-2">No quizzes yet. <Link href="/quiz" className="font-bold text-[#0E9A8B]">Take your first quiz →</Link></p>:
            <div className="mt-3 space-y-2">{dash.attempts.map((a:any)=>(<div key={a.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5"><span className={`grid h-10 w-10 place-items-center rounded-full text-white text-xs font-extrabold shrink-0 ${a.scorePercent>=60?"bg-[#0E9A8B]":"bg-[#E94E3C]"}`}>{a.scorePercent}%</span><div className="flex-1"><p className="text-sm font-bold">{a.topic}</p><p className="text-[11px] text-slate-500">{a.correct}/{a.total} • {a.mode} • {new Date(a.createdAt).toLocaleString()}</p></div></div>))}</div>}
            {dash?.stats&&<div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="bg-slate-50 rounded-xl py-2.5"><Trophy className="h-4 w-4 mx-auto text-amber-500"/><b>{dash.stats.bestScore}% best</b></div><div className="bg-slate-50 rounded-xl py-2.5"><Target className="h-4 w-4 mx-auto text-[#0E9A8B]"/><b>{dash.stats.avgScore}% average</b></div><div className="bg-slate-50 rounded-xl py-2.5"><Bookmark className="h-4 w-4 mx-auto text-[#2563A8]"/><b>{dash.stats.bookmarks} bookmarks</b></div></div>}
          </div>
          {(dash?.bookmarks?.length>0)&&<div className="bg-white rounded-3xl border p-6"><h2 className="font-extrabold text-[#0F2040] flex items-center gap-2"><Bookmark className="h-5 w-5 text-amber-500"/> My Bookmarks</h2><div className="mt-3 space-y-2">{dash.bookmarks.map((b:any)=>(<Link key={b.id} href={`/modules/${b.itemSlug}`} className="block rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm font-semibold hover:bg-amber-100">{b.title} →</Link>))}</div></div>}
        </div>
      </div>
    </div>
  );
}
