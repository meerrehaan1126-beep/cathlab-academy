"use client";
import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Briefcase, Award, TrendingUp, MapPin, CheckCircle2, IndianRupee, Globe, BookOpen, Zap } from "lucide-react";
import { IMAGES, VIDEOS } from "@/lib/data";

const ROADMAP=[
  { phase:"Class 11–12 (Science, PCB)", duration:"2 years", color:"#2563A8", points:["Biology focus + strong Physics for imaging/radiation concepts","Visit a hospital cathlab if possible; talk to technologists"] },
  { phase:"B.Sc Cardiac Technology / Cathlab Technology", duration:"3–4 years + internship", color:"#0E9A8B", points:["Anatomy, physiology, pathology, pharmacology foundations","Cathlab postings from 2nd year — keep a case logbook from day one","Master ECG, echo basics, hemodynamics & radiation safety"] },
  { phase:"Internship / Clinical Training", duration:"6–12 months", color:"#D98E00", points:["Rotate scrub / monitor / circulate roles under supervision","Target: assist 100+ CAG, 50+ PCI, observe devices & structural cases","Learn your hospital's crash cart, ACT machine & inventory cold"] },
  { phase:"Junior Cathlab Technologist", duration:"Year 1–3", color:"#E94E3C", points:["Independent monitor role; supervised scrub for PCI","ACLS certification; radiation safety refresher","Build device knowledge: wires, balloons, stents, IVUS/OCT"] },
  { phase:"Senior Technologist / Specialist", duration:"Year 3–7", color:"#7A4FA3", points:["Specialise: complex PCI/CTO, structural (TAVI), EP & devices, or physiology/imaging","Mentor juniors; lead inventory, quality & dose audits","Consider M.Sc Cardiac Technology / MBA Hospital Mgmt"] },
  { phase:"Cathlab In-Charge / Educator / Industry", duration:"Year 7+", color:"#111827", points:["Lab management, team training, protocol development","Clinical specialist roles with device companies (proctoring, training)","Teaching faculty in Allied Health colleges; research & publications"] },
];
const SKILLS=["ECG interpretation","Invasive hemodynamics","Sterile technique","Radiation protection (ALARA)","Catheter/wire/balloon/stent knowledge","ACT & anticoagulation","Emergency response (ACLS)","IVUS / OCT / FFR-iFR","Patient communication","Documentation & inventory","Defibrillator & pacing","Contrast safety"];
const INTERVIEW=["Walk me through your role during a primary PCI.","How do you recognise a damped pressure and what do you do?","What ACT target do you aim for in PCI and when do you recheck?","Difference between semi-compliant and NC balloons?","How do you protect yourself and the patient from radiation?","Signs of tamponade after PCI — your first three actions?","TIMI flow grades — explain with an example.","Radial vs femoral access: pros, cons, complications?"];

export default function CareerPage(){
  const [checked,setChecked]=useState<Record<string,boolean>>({});
  const skillPct=Math.round(Object.values(checked).filter(Boolean).length/SKILLS.length*100);
  return(
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-[#0F2040] text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-10">
            <p className="text-xs font-bold text-[#5EEAD4]">CAREER ROADMAP</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">From Allied Health classroom to Cathlab team leader</h1>
            <p className="mt-3 text-white/70 leading-relaxed text-sm">Cathlab technologists are core members of the Heart Team — not helpers. Hospitals across India and the Gulf, UK, Australia & beyond actively recruit skilled cardiac technologists as PCI volumes grow every year.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4"><IndianRupee className="h-5 w-5 text-[#5EEAD4]"/><p className="font-extrabold mt-1">₹2.5–5 LPA</p><p className="text-[11px] text-white/60">Fresher (India, metro hospitals)</p></div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4"><TrendingUp className="h-5 w-5 text-[#5EEAD4]"/><p className="font-extrabold mt-1">₹6–12+ LPA</p><p className="text-[11px] text-white/60">Experienced / specialist</p></div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4"><Globe className="h-5 w-5 text-[#5EEAD4]"/><p className="font-extrabold mt-1">Gulf / UK / AU</p><p className="text-[11px] text-white/60">Strong overseas demand*</p></div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4"><Briefcase className="h-5 w-5 text-[#5EEAD4]"/><p className="font-extrabold mt-1">24×7 Service</p><p className="text-[11px] text-white/60">On-call = core & valued role</p></div>
            </div>
            <p className="text-[10px] text-white/40 mt-3">*Indicative ranges; vary by city, hospital & skill. Overseas roles need licensing/registration per country.</p>
          </div>
          <div className="relative min-h-[280px]">
            <video autoPlay muted loop playsInline poster={IMAGES.studentsLocal} className="absolute inset-0 h-full w-full object-cover">
              <source src={VIDEOS.students} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[#0F2040]/20"/>
          </div>
        </div>
      </div>

      {/* Roadmap timeline */}
      <section>
        <h2 className="text-2xl font-extrabold text-[#0F2040] flex items-center gap-2"><MapPin className="h-6 w-6 text-[#E94E3C]"/> Your Roadmap</h2>
        <div className="mt-5 relative pl-6 sm:pl-0">
          <div className="absolute left-[15px] sm:left-1/2 top-0 bottom-0 w-1 bg-slate-200 rounded hidden sm:block"/>
          <div className="space-y-4">
          {ROADMAP.map((r,i)=>(
            <div key={r.phase} className={`relative sm:w-[calc(50%-28px)] ${i%2?"sm:ml-auto":""}`}>
              <div className="bg-white rounded-3xl border p-5 hover:shadow-lg transition">
                <span className="text-white text-[11px] font-bold px-3 py-1 rounded-full" style={{background:r.color}}>STEP {i+1} • {r.duration}</span>
                <h3 className="font-extrabold text-[#0F2040] text-lg mt-2.5 leading-snug">{r.phase}</h3>
                <ul className="mt-2.5 space-y-1.5">{r.points.map(p=>(<li key={p} className="flex gap-2 text-sm text-slate-600"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{color:r.color}}/>{p}</li>))}</ul>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border p-6">
          <h2 className="font-extrabold text-lg text-[#0F2040] flex items-center gap-2"><Zap className="h-5 w-5 text-[#D98E00]"/> Skills Self-Check</h2>
          <p className="text-xs text-slate-500 mt-1">Honestly tick what you could explain & do today. Aim for 100% before internship ends.</p>
          <div className="mt-3 flex items-center gap-3"><div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#0E9A8B] rounded-full transition-all" style={{width:`${skillPct}%`}}/></div><b className="text-sm">{skillPct}%</b></div>
          <div className="mt-4 grid sm:grid-cols-2 gap-2">{SKILLS.map(s=>(<button key={s} onClick={()=>setChecked({...checked,[s]:!checked[s]})} className={`text-left rounded-xl border-2 px-3.5 py-2.5 text-[13px] font-semibold flex gap-2 items-center ${checked[s]?"border-[#0E9A8B] bg-teal-50/70":"border-slate-200"}`}><span className={`grid h-5 w-5 place-items-center rounded text-white text-[10px] shrink-0 ${checked[s]?"bg-[#0E9A8B]":"bg-slate-300"}`}>{checked[s]?"✓":""}</span>{s}</button>))}</div>
          <Link href="/modules" className="mt-4 inline-block text-sm font-bold text-[#0E9A8B]">Fill the gaps → Learning Modules</Link>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border p-6">
            <h2 className="font-extrabold text-lg text-[#0F2040] flex items-center gap-2"><Award className="h-5 w-5 text-[#7A4FA3]"/> Certifications That Help</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[["ACLS / BLS (AHA)","Essential for cathlab emergencies — renew every 2 years"],["RCIS (CCI, USA)","Registered Cardiovascular Invasive Specialist — gold standard internationally"],["State Allied Health Registration","Register under National Commission for Allied & Healthcare Professions framework"],["Radiation Safety Training","AERB-aligned training strengthens your profile"],["Echo / TMT / Holter skills","Makes you versatile across cardiology department"]].map(([t,d])=>(<li key={t} className="flex gap-3 rounded-xl bg-slate-50 p-3.5"><GraduationCap className="h-5 w-5 text-[#0E9A8B] shrink-0"/><div><b className="text-[#0F2040]">{t}</b><p className="text-xs text-slate-500">{d}</p></div></li>))}
            </ul>
          </div>
          <div className="rounded-3xl bg-[#0F2040] text-white p-6">
            <h2 className="font-extrabold flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#5EEAD4]"/> 8 Interview Questions to Master</h2>
            <ol className="mt-3 space-y-2">{INTERVIEW.map((q,i)=>(<li key={q} className="flex gap-2.5 text-sm"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#E94E3C] text-[11px] font-bold shrink-0">{i+1}</span><span className="text-white/90">{q}</span></li>))}</ol>
            <Link href="/quiz" className="mt-4 inline-block rounded-full bg-[#E94E3C] px-5 py-2.5 text-sm font-bold">Practise in Quiz Arena →</Link>
          </div>
        </div>
      </div>

      <section className="rounded-3xl bg-white border p-6 sm:p-8">
        <h2 className="font-extrabold text-xl text-[#0F2040]">Where Cathlab Technologists Work</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {[["Multi-speciality Hospitals","High-volume PCI & structural programs"],["Dedicated Heart Institutes","Complex PCI, TAVI, EP labs"],["Medical Colleges","Clinical + teaching exposure"],["Device Industry","Clinical specialist, proctor, training roles"],["Government Hospitals","Stable service, high case diversity"],["Diagnostic / Day-care Cathlabs","Elective CAG/PCI focus"],["Research Units","Trials, registries, imaging core labs"],["International Hospitals","Gulf, UK, Australia, Singapore pathways"]].map(([t,d])=>(
            <div key={t} className="rounded-2xl bg-slate-50 border p-4"><p className="font-bold text-sm text-[#0F2040]">{t}</p><p className="text-xs text-slate-500 mt-1">{d}</p></div>
          ))}
        </div>
      </section>
    </div>
  );
}
