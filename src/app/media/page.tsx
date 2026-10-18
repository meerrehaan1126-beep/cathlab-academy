"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Clapperboard, ImageIcon, Play, BookOpen, Lightbulb } from "lucide-react";
import { LECTURES, GALLERY, IMAGES } from "@/lib/data";
import { LecturePlayer, Lightbox } from "@/components/VideoPlayer";

const CATS = ["All", ...Array.from(new Set(LECTURES.map(l => l.category)))];

export default function MediaPage() {
  const [tab, setTab] = useState<"videos"|"gallery">("videos");
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(LECTURES[0]);
  const [photo, setPhoto] = useState<typeof GALLERY[0] | null>(null);
  const list = useMemo(() => cat === "All" ? LECTURES : LECTURES.filter(l => l.category === cat), [cat]);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-[#0F2040] text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold text-[#5EEAD4]">VIDEO LECTURES & IMAGE LIBRARY</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight">See the lab before you scrub in</h1>
            <p className="mt-2 text-white/70 text-sm leading-relaxed max-w-xl">11 clinical videos and 16 high-yield images — procedure-room footage, ECG monitors, anatomy, team roles and crash-cart readiness. Watch, then read the takeaways like a posting debrief.</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setTab("videos")} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold ${tab==="videos"?"bg-[#E94E3C]":"bg-white/15"}`}><Clapperboard className="h-4 w-4"/> {LECTURES.length} Videos</button>
              <button onClick={() => setTab("gallery")} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold ${tab==="gallery"?"bg-[#0E9A8B]":"bg-white/15"}`}><ImageIcon className="h-4 w-4"/> {GALLERY.length} Images</button>
            </div>
          </div>
          <div className="relative min-h-[220px]">
            <img src={IMAGES.carm} alt="Cathlab C-arm" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#0F2040]/25" />
          </div>
        </div>
      </div>

      {tab === "videos" && (
        <>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {CATS.map(c => <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${cat===c?"bg-[#0E9A8B] text-white":"bg-white border border-slate-200"}`}>{c}</button>)}
          </div>
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
            <div className="space-y-4">
              <LecturePlayer src={active.src} poster={active.poster} title={active.title} />
              <div className="bg-white rounded-3xl border p-6">
                <span className="text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full">{active.category} • {active.duration}</span>
                <h2 className="mt-3 text-2xl font-extrabold text-[#0F2040]">{active.title}</h2>
                <p className="mt-3 text-sm font-bold text-[#0F2040] flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500"/> Watch-with-purpose takeaways</p>
                <ul className="mt-2 space-y-2">{active.takeaways.map(t => <li key={t} className="flex gap-2 text-sm text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#E94E3C] shrink-0"/>{t}</li>)}</ul>
                <Link href={`/modules/${active.moduleSlug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0E9A8B]"><BookOpen className="h-4 w-4"/> Open related learning module →</Link>
              </div>
            </div>
            <div className="space-y-3">
              {list.map(l => (
                <button key={l.id} onClick={() => setActive(l)} className={`w-full text-left rounded-2xl border-2 bg-white overflow-hidden flex gap-3 p-2 ${active.id===l.id?"border-[#E94E3C]":"border-slate-200 hover:border-teal-300"}`}>
                  <div className="relative w-32 h-20 shrink-0 overflow-hidden rounded-xl">
                    <img src={l.poster} alt={l.title} className="h-full w-full object-cover"/>
                    <span className="absolute inset-0 grid place-items-center"><span className="grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white"><Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor"/></span></span>
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">{l.duration}</span>
                  </div>
                  <div className="py-1 pr-2 min-w-0"><p className="text-[11px] font-bold text-[#0E9A8B]">{l.category}</p><p className="text-sm font-bold text-[#0F2040] leading-snug line-clamp-2">{l.title}</p></div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "gallery" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY.map(g => (
            <button key={g.src} onClick={() => setPhoto(g)} className="group text-left bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition">
              <div className="h-40 overflow-hidden"><img src={g.src} alt={g.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/></div>
              <div className="p-4"><p className="font-bold text-[#0F2040] text-sm">{g.title}</p><p className="text-xs text-slate-500 mt-1 leading-relaxed">{g.caption}</p></div>
            </button>
          ))}
        </div>
      )}
      {photo && <Lightbox src={photo.src} alt={photo.title} onClose={() => setPhoto(null)} />}
    </div>
  );
}
