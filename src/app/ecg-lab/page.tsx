"use client";
import { useEffect, useRef, useState } from "react";
import { Activity, Play, Pause, HeartPulse, Gauge } from "lucide-react";
import { ECG_RHYTHMS, PRESSURE_TRACINGS, VIDEOS, IMAGES } from "@/lib/data";
import ECGWave from "@/components/ECGWave";
import { LecturePlayer } from "@/components/VideoPlayer";

function LiveMonitor({ rhythm }: { rhythm: typeof ECG_RHYTHMS[0] }){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [playing,setPlaying]=useState(true); const playingRef=useRef(true); playingRef.current=playing;
  const [hr,setHr]=useState(72);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return; const ctx=canvas.getContext("2d"); if(!ctx) return;
    let raf:number; let offset=0;
    const pathCoords: {x:number;y:number}[]=[];
    // Sample SVG path into points via Path2D trick: parse numbers roughly
    // Simpler: generate waveform procedurally per rhythm id
    function waveY(t:number):number {
      const phase=(t%1);
      switch(rhythm.id){
        case "vf": return 0.5+Math.sin(t*23)*0.18+Math.sin(t*47)*0.14+Math.sin(t*11)*0.1;
        case "vt": return 0.5+((phase<0.5)?-0.32:0.32)*(Math.sin(phase*Math.PI*2)*0.3+0.6)*0.5 + Math.sin(phase*Math.PI*2)*0.28;
        case "af": { const base=0.5+Math.sin(t*31)*0.03; const beats=[0,0.7,1.1,1.9,2.4]; const tt=t%3; for(const b of beats){ const d=tt-b; if(Math.abs(d)<0.06) return base-(0.35)*(1-Math.abs(d)/0.06); if(Math.abs(d-0.08)<0.05) return base+(0.18)*(1-Math.abs(d-0.08)/0.05);} return base; }
        case "chb": { const pWave=Math.sin(t*Math.PI*2*1.25)>0.92?-0.08:0; const qrs=(t%1.6)<0.06?-0.35*(1-((t%1.6))/0.06):(t%1.6)<0.1?0.15:0; return 0.52+pWave+qrs; }
        case "svt": { const p=(t*3)%1; if(p<0.08) return 0.52-0.36*(1-p/0.08); if(p<0.14) return 0.52+0.16*(1-(p-0.08)/0.06); return 0.52; }
        case "stemi-ant": case "stemi-inf": { if(phase<0.12) return 0.55-Math.sin(phase/0.12*Math.PI)*0.07; if(phase<0.2) return 0.55-0.38*(1-Math.abs(phase-0.16)/0.04); if(phase<0.26) return 0.55+0.18*(1-Math.abs(phase-0.23)/0.03); if(phase<0.55) return 0.55-0.16*Math.sin((phase-0.26)/0.29*Math.PI); return 0.55; }
        default: { if(phase<0.14) return 0.55-Math.sin(phase/0.14*Math.PI)*0.08; if(phase<0.22) return 0.55-0.38*(1-Math.abs(phase-0.18)/0.04); if(phase<0.28) return 0.55+0.17*(1-Math.abs(phase-0.25)/0.03); if(phase<0.5) return 0.55-Math.sin((phase-0.3)/0.2*Math.PI)*0.1; return 0.55; }
      }
    }
    function draw(now:number){
      const w=canvas!.width, h=canvas!.height; ctx!.clearRect(0,0,w,h);
      ctx!.strokeStyle="rgba(255,255,255,0.08)"; ctx!.lineWidth=1;
      for(let x=0;x<w;x+=24){ctx!.beginPath();ctx!.moveTo(x,0);ctx!.lineTo(x,h);ctx!.stroke();}
      for(let y=0;y<h;y+=24){ctx!.beginPath();ctx!.moveTo(0,y);ctx!.lineTo(w,y);ctx!.stroke();}
      if(playingRef.current) offset=now/900;
      ctx!.strokeStyle=rhythm.color==="#111827"?"#F87171":rhythm.color; ctx!.lineWidth=2.5; ctx!.beginPath();
      for(let x=0;x<w;x++){ const t=offset+(x/w)*4; const y=waveY(t)*h; x===0?ctx!.moveTo(x,y):ctx!.lineTo(x,y); }
      ctx!.stroke();
      raf=requestAnimationFrame(draw);
    }
    raf=requestAnimationFrame(draw);
    const hrMap:Record<string,number>={nsr:72,"stemi-ant":92,"stemi-inf":48,af:128,vt:172,chb:38,svt:182,vf:0};
    setHr(hrMap[rhythm.id]??72);
    return ()=>cancelAnimationFrame(raf);
  },[rhythm]);
  return(
    <div className="rounded-2xl bg-[#0B1B33] p-4">
      <div className="flex items-center justify-between text-white text-xs font-bold"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/> LEAD II — LIVE SIMULATION</span>
      <span className="flex items-center gap-3"><span style={{color:rhythm.color==="#111827"?"#F87171":rhythm.color}} className="text-lg font-extrabold">{hr===0?"---":hr} <span className="text-[10px]">bpm</span></span>
      <button onClick={()=>setPlaying(!playing)} className="rounded-full bg-white/15 p-2">{playing?<Pause className="h-3.5 w-3.5"/>:<Play className="h-3.5 w-3.5"/>}</button></span></div>
      <canvas ref={canvasRef} width={900} height={180} className="w-full h-[150px] mt-2"/>
    </div>
  );
}

export default function ECGLabPage(){
  const [selected,setSelected]=useState(ECG_RHYTHMS[0]);
  const [pressure,setPressure]=useState(PRESSURE_TRACINGS[0]);
  const [quizMode,setQuizMode]=useState(false); const [quizTarget,setQuizTarget]=useState(ECG_RHYTHMS[1]); const [quizPick,setQuizPick]=useState<string|null>(null); const [quizScore,setQuizScore]=useState({c:0,t:0});
  function newQuiz(){ const r=ECG_RHYTHMS[Math.floor(Math.random()*ECG_RHYTHMS.length)]; setQuizTarget(r); setQuizPick(null); setSelected(r); }
  function answerQuiz(id:string){ if(quizPick) return; setQuizPick(id); setQuizScore(s=>({c:s.c+(id===quizTarget.id?1:0),t:s.t+1})); }

  return(
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-[#0F2040] text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold text-[#5EEAD4]">ECG & HEMODYNAMICS LAB</p>
            <h1 className="mt-2 text-3xl font-extrabold">Train your eyes before you face the monitor</h1>
            <p className="mt-2 text-white/70 text-sm max-w-2xl leading-relaxed">Pick a rhythm to see its live tracing, key features and what it means in the cathlab. Then test yourself in “Identify the Rhythm” mode, and master pressure waveforms below.</p>
            <div className="mt-4 flex gap-3 flex-wrap">
              <button onClick={()=>{setQuizMode(false);}} className={`rounded-full px-5 py-2.5 text-sm font-bold ${!quizMode?"bg-[#0E9A8B] text-white":"bg-white/15"}`}>Learn Mode</button>
              <button onClick={()=>{setQuizMode(true); newQuiz();}} className={`rounded-full px-5 py-2.5 text-sm font-bold ${quizMode?"bg-[#E94E3C] text-white":"bg-white/15"}`}>Identify the Rhythm {quizScore.t>0&&`• ${quizScore.c}/${quizScore.t}`}</button>
            </div>
          </div>
          <div className="relative min-h-[220px] p-4 lg:p-6">
            <LecturePlayer src={VIDEOS.ecg} poster={IMAGES.ecgMonitor} title="Live ECG monitor footage" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-5 items-start">
        <div className="space-y-2">
          {ECG_RHYTHMS.map(r=>(
            <button key={r.id} onClick={()=>{ if(quizMode){ answerQuiz(r.id); } else setSelected(r); }} className={`w-full text-left rounded-2xl border-2 bg-white p-3.5 transition ${quizMode&&quizPick?(r.id===quizTarget.id?"border-green-500 bg-green-50":r.id===quizPick?"border-red-500 bg-red-50":"border-slate-200"):(!quizMode&&selected.id===r.id?"border-[#0E9A8B] bg-teal-50/60":"border-slate-200 hover:border-teal-200")}`}>
              <div className="flex items-center justify-between gap-2"><p className="font-bold text-sm text-[#0F2040]">{quizMode&&!quizPick?"❓ Option":r.name}</p><span className="h-2.5 w-2.5 rounded-full shrink-0" style={{background:r.color}}/></div>
              {!quizMode&&<div className="mt-2"><ECGWave path={r.points} color={r.color} height={44}/></div>}
              {quizMode&&<p className="text-xs text-slate-500 mt-1">{r.name} — tap to answer</p>}
            </button>
          ))}
          {quizMode&&quizPick&&<button onClick={newQuiz} className="w-full rounded-full bg-[#E94E3C] text-white font-bold py-3 text-sm">Next Unknown Rhythm →</button>}
        </div>
        <div className="space-y-4">
          <LiveMonitor rhythm={selected}/>
          {(!quizMode||quizPick)&&<div className="bg-white rounded-3xl border p-6">
            <div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-extrabold text-[#0F2040]">{selected.name}</h2><span className="rounded-full text-white text-xs font-bold px-3 py-1" style={{background:selected.color}}>{selected.rate}</span>
            {quizMode&&quizPick&&<span className={`rounded-full text-xs font-bold px-3 py-1 ${quizPick===quizTarget.id?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>{quizPick===quizTarget.id?"✓ Correct identification!":"✗ That was "+quizTarget.name}</span>}</div>
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Activity className="h-3.5 w-3.5"/> KEY FEATURES</p><ul className="mt-2 space-y-1.5">{selected.features.map(f=>(<li key={f} className="text-sm flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{background:selected.color}}/>{f}</li>))}</ul></div>
              <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4"><p className="text-xs font-bold text-teal-700 flex items-center gap-1.5"><HeartPulse className="h-3.5 w-3.5"/> IN THE CATHLAB</p><p className="mt-2 text-sm leading-relaxed text-slate-700">{selected.cathlab}</p></div>
            </div>
          </div>}
          {quizMode&&!quizPick&&<div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center"><p className="font-extrabold text-amber-900 text-lg">What rhythm is this?</p><p className="text-sm text-amber-800 mt-1">Watch the live monitor, then tap your answer in the left panel.</p></div>}
        </div>
      </div>

      {/* Pressure tracings */}
      <section className="space-y-4">
        <div><h2 className="text-2xl font-extrabold text-[#0F2040] flex items-center gap-2"><Gauge className="h-6 w-6 text-[#0E9A8B]"/> Pressure Waveform Atlas</h2><p className="text-sm text-slate-500">Tap each chamber — learn normal values & what abnormal waveforms whisper to you</p></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESSURE_TRACINGS.map(p=>(<button key={p.id} onClick={()=>setPressure(p)} className={`rounded-2xl border-2 p-3 text-left bg-white ${pressure.id===p.id?"border-transparent text-white":"border-slate-200"}`} style={pressure.id===p.id?{background:p.color}:{}}><p className="font-extrabold text-sm">{p.name.split(" (")[0]}</p><p className={`text-[11px] ${pressure.id===p.id?"text-white/85":"text-slate-500"}`}>{p.normal}</p></button>))}
        </div>
        <div className="rounded-3xl text-white p-6 sm:p-8" style={{background:pressure.color}}>
          <p className="text-xs font-bold opacity-80">NORMAL: {pressure.normal.toUpperCase()}</p>
          <h3 className="text-2xl font-extrabold mt-1">{pressure.name}</h3>
          <p className="mt-2 leading-relaxed max-w-3xl text-white/95">{pressure.desc}</p>
          <svg viewBox="0 0 600 90" className="w-full h-20 mt-4" preserveAspectRatio="none">
            {pressure.id==="ra"&&<path d="M0 60 Q30 35 55 58 Q75 45 90 60 Q120 30 150 58 L200 62 Q230 35 255 58 Q275 45 290 60 Q320 30 350 58 L400 62 Q430 35 455 58 Q475 45 490 60 Q520 30 550 58 L600 60" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>}
            {pressure.id==="rv"&&<path d="M0 70 L30 70 L45 20 L110 18 L125 70 L180 70 L195 20 L260 18 L275 70 L330 70 L345 20 L410 18 L425 70 L480 70 L495 20 L560 18 L575 70 L600 70" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"/>}
            {pressure.id==="pa"&&<path d="M0 55 L35 55 Q55 15 80 30 Q88 42 95 32 Q120 50 160 55 L200 55 Q220 15 245 30 Q253 42 260 32 Q285 50 325 55 L365 55 Q385 15 410 30 Q418 42 425 32 Q450 50 490 55 L600 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>}
            {pressure.id==="pcwp"&&<path d="M0 55 Q35 30 65 52 Q95 65 120 40 Q150 25 180 55 L215 58 Q250 30 280 52 Q310 65 335 40 Q365 25 395 55 L430 58 Q465 30 495 52 Q525 65 550 40 Q575 28 600 52" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>}
            {pressure.id==="lv"&&<path d="M0 72 L30 72 L48 12 L130 10 L148 72 L190 72 L208 12 L290 10 L308 72 L350 72 L368 12 L450 10 L468 72 L510 72 L528 12 L600 12" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"/>}
            {pressure.id==="ao"&&<path d="M0 45 L30 45 Q52 8 78 22 Q86 34 94 24 Q125 42 175 45 L205 45 Q227 8 253 22 Q261 34 269 24 Q300 42 350 45 L380 45 Q402 8 428 22 Q436 34 444 24 Q475 42 525 45 L600 45" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>}
          </svg>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-white rounded-2xl border p-4"><b className="text-[#0F2040]">Damping check</b><p className="text-slate-500 mt-1">Flush, remove air/clot, check connections & catheter position. Fast-flush square-wave test.</p></div>
          <div className="bg-white rounded-2xl border p-4"><b className="text-[#0F2040]">Zero & level</b><p className="text-slate-500 mt-1">Transducer at phlebostatic axis (4th ICS, mid-axillary). Re-zero after position change.</p></div>
          <div className="bg-white rounded-2xl border p-4"><b className="text-[#0F2040]">Record smart</b><p className="text-slate-500 mt-1">End-expiration, scale appropriate, label chamber & gain on every saved tracing.</p></div>
        </div>
      </section>
    </div>
  );
}
