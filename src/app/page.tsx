"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Brain, Calculator, Activity, ClipboardList, Stethoscope, Layers, ArrowRight, Clock, Target, Trophy, Flame, CheckCircle2, HeartPulse, ShieldCheck, Zap, Users, Play, Star, Clapperboard } from "lucide-react";
import { MODULE_SEED, IMAGES, CASE_SEED, QUESTION_SEED, FLASHCARD_SEED, VIDEOS, LECTURES, GALLERY } from "@/lib/data";
import { AnimatedECGLine } from "@/components/ECGWave";
import { useStudent, displayName } from "@/components/StudentContext";
import { LecturePlayer } from "@/components/VideoPlayer";

export default function HomePage() {
  const { student } = useStudent();
  const [stats, setStats] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const name = displayName(student);

  useEffect(()=>{
    fetch(`/api/dashboard?studentName=${encodeURIComponent(name)}`).then(r=>r.json()).then(d=>{ setStats(d.stats); setProgress(d.progress||[]); }).catch(()=>{});
  },[name]);

  const completedSlugs = new Set(progress.filter(p=>p.completed).map((p:any)=>p.moduleSlug));
  const overall = Math.round((completedSlugs.size / MODULE_SEED.length) * 100);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const QUICK = [
    { href:"/quiz", title:"Quiz Arena", desc:`${QUESTION_SEED.length} MCQs • timed exam mode`, icon:Brain, bg:"#E94E3C" },
    { href:"/flashcards", title:"Flashcards", desc:`${FLASHCARD_SEED.length} rapid-recall cards`, icon:Layers, bg:"#0E9A8B" },
    { href:"/calculators", title:"Calculators", desc:"Fick, Gorlin, PVR, eGFR & more", icon:Calculator, bg:"#2563A8" },
    { href:"/ecg-lab", title:"ECG Lab", desc:"Rhythms & pressure tracings", icon:Activity, bg:"#7A4FA3" },
    { href:"/procedures", title:"Procedure Guides", desc:"CAG, PCI, TAVI, PPI checklists", icon:ClipboardList, bg:"#D98E00" },
    { href:"/cases", title:"Clinical Cases", desc:"Decide like you're in the lab", icon:Stethoscope, bg:"#111827" },
  ];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="overflow-hidden rounded-3xl bg-[#0F2040] text-white shadow-xl">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-10 flex flex-col justify-center relative z-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0E9A8B]/20 border border-[#0E9A8B]/40 px-3 py-1 text-xs font-bold text-[#5EEAD4]"><HeartPulse className="h-3.5 w-3.5"/> ALLIED HEALTH • CARDIAC TECHNOLOGY • CATHLAB</div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.08]">
              {student.name ? `${greeting}, ${student.name.split(" ")[0]}.` : "Your journey to the Cathlab starts here."}
              <span className="block text-[#5EEAD4] mt-1">Learn. Practise. Scrub in with confidence.</span>
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed max-w-xl">
              Built for B.Sc Cardiac Technology, Cathlab Technology & Allied Health students — structured modules, exam-style MCQs, flashcards, live hemodynamic calculators and real clinical cases, all in one place.
            </p>
            <div className="mt-4"><AnimatedECGLine className="h-12 opacity-90" /></div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/modules" className="inline-flex items-center gap-2 rounded-full bg-[#E94E3C] px-6 py-3 font-bold text-sm hover:bg-[#d63f2e]">Start Learning <Play className="h-4 w-4"/></Link>
              <Link href="/quiz" className="inline-flex items-center gap-2 rounded-full bg-white text-[#0F2040] px-6 py-3 font-bold text-sm hover:bg-slate-100">Take a Quiz <ArrowRight className="h-4 w-4"/></Link>
              <Link href="/media" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-sm"><Clapperboard className="h-4 w-4"/> Watch videos</Link>
              {!student.name && <Link href="/profile" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-sm">Set up my profile</Link>}
            </div>
            <div className="mt-7 grid grid-cols-4 gap-3 max-w-lg text-center">
              {[["8","Modules"],["36+","MCQs"],["24","Flashcards"],["4","Cases"]].map(([n,l])=>(
                <div key={l} className="rounded-xl bg-white/[0.07] border border-white/10 py-3"><p className="text-xl font-extrabold">{n}</p><p className="text-[11px] text-white/60">{l}</p></div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[300px] lg:min-h-full">
            <video autoPlay muted loop playsInline poster={IMAGES.hero} className="absolute inset-0 h-full w-full object-cover">
              <source src={VIDEOS.surgery} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[#0F2040]/25" />
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto rounded-2xl bg-white p-4 text-slate-900 shadow-xl sm:max-w-xs">
              <div className="flex items-center justify-between"><p className="text-xs font-bold text-slate-500">YOUR PROGRESS</p><span className="text-xs font-bold text-[#0E9A8B]">{overall}%</span></div>
              <div className="mt-2 h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-[#0E9A8B] transition-all" style={{width:`${overall}%`}}/></div>
              <p className="mt-2 text-sm font-semibold">{completedSlugs.size} of {MODULE_SEED.length} modules completed</p>
              <p className="text-xs text-slate-500">{stats ? `${stats.attempts} quizzes • Avg ${stats.avgScore||0}% • Best ${stats.bestScore||0}%` : "Complete a module & take your first quiz"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label:"Avg Quiz Score", value: stats?`${stats.avgScore||0}%`:"—", sub:"across all attempts", color:"#E94E3C" },
          { icon: Trophy, label:"Best Score", value: stats?`${stats.bestScore||0}%`:"—", sub:"keep pushing higher", color:"#D98E00" },
          { icon: CheckCircle2, label:"Modules Done", value: `${completedSlugs.size}/${MODULE_SEED.length}`, sub:"mark complete inside each module", color:"#0E9A8B" },
          { icon: Flame, label:"Questions Answered", value: stats?`${stats.totalQuestions||0}`:"0", sub:`${stats?.attempts||0} quiz attempts saved`, color:"#2563A8" },
        ].map(s=>(
          <div key={s.label} className="rounded-2xl bg-white border border-slate-200 p-5 flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl shrink-0" style={{background:s.color}}><s.icon className="h-5 w-5 text-white"/></div>
            <div><p className="text-2xl font-extrabold text-[#0F2040]">{s.value}</p><p className="text-sm font-semibold">{s.label}</p><p className="text-xs text-slate-500">{s.sub}</p></div>
          </div>
        ))}
      </section>

      {/* QUICK TOOLS */}
      <section>
        <div className="flex items-end justify-between mb-4"><div><h2 className="text-2xl font-extrabold text-[#0F2040]">Your Cathlab Toolkit</h2><p className="text-sm text-slate-500">Everything a future cathlab technologist needs daily</p></div></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK.map(q=>(
            <Link key={q.href} href={q.href} className="group rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="flex items-center justify-between"><div className="grid h-12 w-12 place-items-center rounded-xl" style={{background:q.bg}}><q.icon className="h-6 w-6 text-white"/></div><ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-[#0E9A8B] group-hover:translate-x-1 transition"/></div>
              <h3 className="mt-4 font-bold text-lg text-[#0F2040]">{q.title}</h3><p className="text-sm text-slate-500">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* MODULES PREVIEW */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div><h2 className="text-2xl font-extrabold text-[#0F2040]">Learning Path — Start Here</h2><p className="text-sm text-slate-500">Foundation → Core cathlab skills → Advanced interventions</p></div>
          <Link href="/modules" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#0E9A8B]">All modules <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULE_SEED.slice(0,4).map((m,i)=>(
            <Link key={m.slug} href={`/modules/${m.slug}`} className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition">
              <div className="relative h-36"><img src={m.image} alt={m.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/>
                <span className="absolute top-3 left-3 rounded-full bg-[#0F2040]/90 text-white text-[11px] font-bold px-2.5 py-1">Module {i+1} • {m.level}</span>
                {completedSlugs.has(m.slug) && <span className="absolute top-3 right-3 rounded-full bg-[#0E9A8B] text-white text-[11px] font-bold px-2.5 py-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Done</span>}
              </div>
              <div className="p-4"><p className="text-[11px] font-bold uppercase tracking-wide" style={{color:m.color}}>{m.category}</p>
              <h3 className="font-bold text-[#0F2040] leading-snug mt-1 line-clamp-2">{m.title}</h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-3"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/>{m.durationMins} min</span><span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5"/>{m.lessons} lessons</span></p></div>
            </Link>
          ))}
        </div>
      </section>

      {/* CASE + CAREER */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-[#0F2040] text-white p-6 sm:p-8 overflow-hidden relative">
          <p className="text-xs font-bold text-[#5EEAD4]">CASE OF THE DAY</p>
          <h3 className="mt-2 text-2xl font-extrabold leading-snug">{CASE_SEED[0].title}</h3>
          <p className="mt-2 text-white/70 text-sm leading-relaxed">{CASE_SEED[0].patient.presentation}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold"><span className="rounded-full bg-white/10 px-3 py-1">{CASE_SEED[0].category}</span><span className="rounded-full bg-[#E94E3C] px-3 py-1">{CASE_SEED[0].difficulty}</span><span className="rounded-full bg-white/10 px-3 py-1">3 decision steps</span></div>
          <Link href={`/cases/${CASE_SEED[0].slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E94E3C] px-5 py-2.5 text-sm font-bold">Solve this case <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8">
          <p className="text-xs font-bold text-[#0E9A8B]">WHO IS A CATHLAB TECHNOLOGIST?</p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#0F2040] leading-snug">The heartbeat of the cathlab team</h3>
          <div className="mt-4 space-y-3">
            {[
              [ShieldCheck,"Scrub role","Sterile assist — catheters, wires, balloons, stents, devices"],
              [Activity,"Monitor role","ECG, invasive pressures, ACT, recording & vital call-outs"],
              [Users,"Circulate role","Patient care, stock, documentation, imaging & safety checks"],
              [Zap,"Specialise","PCI, structural (TAVI), EP/pacing, IVUS/OCT, physiology"],
            ].map(([Icon,t,d]:any)=>(
              <div key={t} className="flex gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 shrink-0"><Icon className="h-4.5 w-4.5 text-[#0E9A8B]"/></div><div><p className="text-sm font-bold text-[#0F2040]">{t}</p><p className="text-xs text-slate-500">{d}</p></div></div>
            ))}
          </div>
          <Link href="/career" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0E9A8B]">See career roadmap, salary & certifications <ArrowRight className="h-4 w-4"/></Link>
        </div>
      </section>

      {/* FEATURED VIDEO */}
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
        <div>
          <div className="flex items-end justify-between mb-4">
            <div><h2 className="text-2xl font-extrabold text-[#0F2040]">Watch the lab in motion</h2><p className="text-sm text-slate-500">{LECTURES.length} clinical videos • {GALLERY.length} teaching images</p></div>
            <Link href="/media" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#0E9A8B]">Full media library <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <LecturePlayer src={LECTURES[0].src} poster={LECTURES[0].poster} title={LECTURES[0].title} />
          <p className="mt-3 text-sm font-bold text-[#0F2040]">{LECTURES[0].title}</p>
          <p className="text-xs text-slate-500">{LECTURES[0].takeaways[0]}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {GALLERY.slice(0,6).map(g => (
            <Link key={g.src} href="/media" className="relative overflow-hidden rounded-2xl h-28 sm:h-32 group">
              <img src={g.src} alt={g.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] font-bold text-white leading-tight">{g.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F2040]">Designed around how cathlab learning actually happens</h2>
            <p className="mt-3 text-slate-600 leading-relaxed text-sm">Textbooks teach theory. The cathlab demands pattern recognition, numbers at your fingertips and calm call-outs during emergencies. CathLab Academy trains all three — read a focused module, flip flashcards on the bus, run a Fick calculation, then test yourself under timed conditions.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Exam + viva + interview oriented content","Indian Allied Health curriculum aligned (B.Sc Cardiac / Cathlab Technology)","Practical checklists you can use during postings","Progress, bookmarks & notes saved to your profile"].map(x=>(
                <li key={x} className="flex gap-2"><CheckCircle2 className="h-4.5 w-4.5 text-[#0E9A8B] shrink-0 mt-0.5"/><span>{x}</span></li>
              ))}
            </ul>
            <Link href="/publish" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#E94E3C]">How to publish this website for your college →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={IMAGES.studentsLocal} alt="Allied health students" className="rounded-2xl h-48 w-full object-cover"/>
            <img src={IMAGES.ecgMonitor} alt="ECG learning" className="rounded-2xl h-48 w-full object-cover mt-6"/>
            <img src={IMAGES.coronary} alt="Coronary anatomy" className="rounded-2xl h-48 w-full object-cover -mt-6"/>
            <div className="rounded-2xl bg-[#E94E3C] text-white p-5 flex flex-col justify-center h-48"><Star className="h-6 w-6"/><p className="mt-2 font-extrabold text-lg leading-snug">“I finally understood hemodynamics — the calculators made formulas click.”</p><p className="text-xs text-white/75 mt-2">— Final-year Cardiac Technology student</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
