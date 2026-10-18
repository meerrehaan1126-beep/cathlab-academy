"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Brain, Clock, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Timer, BookOpen, History } from "lucide-react";
import { QUESTION_SEED } from "@/lib/data";
import { useStudent, displayName } from "@/components/StudentContext";

type Phase = "setup"|"playing"|"result";
export default function QuizPage(){
  const { student } = useStudent();
  const name = displayName(student);
  const topics = useMemo(()=>["All Topics",...Array.from(new Set(QUESTION_SEED.map(q=>q.topic)))],[]);
  const [topic,setTopic]=useState("All Topics"); const [count,setCount]=useState(10); const [mode,setMode]=useState<"practice"|"exam">("practice");
  const [phase,setPhase]=useState<Phase>("setup"); const [qs,setQs]=useState<any[]>([]);
  const [idx,setIdx]=useState(0); const [selected,setSelected]=useState<number|null>(null); const [answers,setAnswers]=useState<any[]>([]);
  const [timeLeft,setTimeLeft]=useState(0); const [elapsed,setElapsed]=useState(0);
  const [history,setHistory]=useState<any[]>([]); const [result,setResult]=useState<any>(null);
  const timerRef = useRef<any>(null); const startRef = useRef(0);

  function loadHistory(){ fetch(`/api/quiz-attempts?studentName=${encodeURIComponent(name)}`).then(r=>r.json()).then(d=>setHistory(d.attempts||[])).catch(()=>{}); }
  useEffect(()=>{ loadHistory(); },[name]);
  useEffect(()=>()=>{ if(timerRef.current) clearInterval(timerRef.current); },[]);

  async function start(){
    let data:any=null;
    try{ data=await fetch(`/api/questions?topic=${encodeURIComponent(topic)}&limit=${count}`).then(r=>r.json()); }catch{}
    let list = data?.questions?.length ? data.questions : [...(topic==="All Topics"?QUESTION_SEED:QUESTION_SEED.filter(q=>q.topic===topic))].sort(()=>Math.random()-0.5).slice(0,count);
    if(list.length<count && topic!=="All Topics"){ /* top up */ const extra=[...QUESTION_SEED].filter(q=>!list.includes(q)).sort(()=>Math.random()-0.5); list=[...list,...extra].slice(0,count); }
    setQs(list); setIdx(0); setSelected(null); setAnswers([]); setPhase("playing"); setResult(null);
    startRef.current=Date.now(); setElapsed(0);
    const totalSec = mode==="exam" ? list.length*60 : 0; setTimeLeft(totalSec);
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      setElapsed(Math.floor((Date.now()-startRef.current)/1000));
      if(mode==="exam"){ setTimeLeft(prev=>{ if(prev<=1){ clearInterval(timerRef.current); finish(list, answersRef.current); return 0;} return prev-1; }); }
    },1000);
  }
  const answersRef = useRef<any[]>([]); answersRef.current=answers;

  function choose(i:number){
    if(mode==="practice" && selected!==null) return;
    setSelected(i);
    if(mode==="exam"){
      const updated=[...answers]; updated[idx]={ q: qs[idx].question, chosen:i, correct:qs[idx].correctIndex, topic:qs[idx].topic }; setAnswers(updated);
    }
  }
  function next(){
    let updated=answers;
    if(mode==="practice"){
      updated=[...answers]; updated[idx]={ q:qs[idx].question, chosen:selected, correct:qs[idx].correctIndex, topic:qs[idx].topic, explanation:qs[idx].explanation, options:qs[idx].options }; setAnswers(updated);
    }
    if(idx+1>=qs.length){ finish(qs, mode==="practice"?updated:answers); return; }
    setIdx(idx+1); setSelected(mode==="exam" ? (answers[idx+1]?.chosen ?? null) : null);
  }
  async function finish(list:any[], ans:any[]){
    if(timerRef.current) clearInterval(timerRef.current);
    const filled=list.map((q,i)=> ans[i] || { q:q.question, chosen:-1, correct:q.correctIndex, topic:q.topic, explanation:q.explanation, options:q.options });
    const correct=filled.filter(a=>a.chosen===a.correct).length;
    const pct=list.length?Math.round(correct/list.length*100):0;
    const secs=Math.floor((Date.now()-startRef.current)/1000);
    const payload={ studentName:name, studentId:student.id, topic, mode, total:list.length, correct, scorePercent:pct, timeSpentSec:secs, answers:filled.map((a,i)=>({...a, options:list[i].options, explanation:list[i].explanation})) };
    setResult(payload); setAnswers(payload.answers); setPhase("result");
    try{ await fetch("/api/quiz-attempts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); loadHistory(); }catch{}
  }
  const fmt=(s:number)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const q=qs[idx];

  if(phase==="playing" && q) return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="rounded-3xl bg-[#0F2040] text-white p-5 flex flex-wrap items-center gap-4">
        <span className="font-bold flex items-center gap-2"><Brain className="h-5 w-5 text-[#5EEAD4]"/> {topic} • {mode==="exam"?"Exam Mode":"Practice Mode"}</span>
        <span className="text-white/70 text-sm">Question {idx+1} of {qs.length}</span><div className="flex-1"/>
        <span className={`flex items-center gap-2 font-mono font-bold rounded-full px-4 py-1.5 ${mode==="exam"&&timeLeft<60?"bg-[#E94E3C]":"bg-white/15"}`}><Timer className="h-4 w-4"/> {mode==="exam"?fmt(timeLeft):fmt(elapsed)}</span>
      </div>
      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#0E9A8B] rounded-full transition-all" style={{width:`${((idx)/qs.length)*100}%`}}/></div>
      <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">
        <div className="flex gap-2"><span className="text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full">{q.topic}</span><span className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-full">{q.difficulty}</span></div>
        <h2 className="mt-4 text-xl font-extrabold text-[#0F2040] leading-relaxed">{q.question}</h2>
        <div className="mt-6 space-y-3">
          {q.options.map((opt:string,i:number)=>{
            let cls="border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 bg-white";
            if(selected===i && mode==="exam") cls="border-[#0F2040] bg-[#0F2040]/5 ring-1 ring-[#0F2040]";
            if(mode==="practice"&&selected!==null){ if(i===q.correctIndex) cls="border-green-500 bg-green-50 ring-1 ring-green-500"; else if(i===selected) cls="border-red-500 bg-red-50 ring-1 ring-red-500"; }
            return <button key={i} onClick={()=>choose(i)} className={`w-full text-left rounded-2xl border-2 p-4 font-medium flex items-center gap-3 transition ${cls}`}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 font-bold text-sm shrink-0">{["A","B","C","D"][i]}</span><span className="flex-1">{opt}</span>
              {mode==="practice"&&selected!==null&&i===q.correctIndex&&<CheckCircle2 className="h-5 w-5 text-green-600 shrink-0"/>}
              {mode==="practice"&&selected!==null&&i===selected&&i!==q.correctIndex&&<XCircle className="h-5 w-5 text-red-600 shrink-0"/>}
            </button>;
          })}
        </div>
        {mode==="practice"&&selected!==null&&<div className={`mt-5 rounded-2xl p-4 text-sm leading-relaxed ${selected===q.correctIndex?"bg-green-50 border border-green-200":"bg-amber-50 border border-amber-200"}`}><b>{selected===q.correctIndex?"✓ Correct! ":"Explanation: "}</b>{q.explanation}</div>}
        <div className="mt-6 flex justify-between">
          <button onClick={()=>{ if(timerRef.current)clearInterval(timerRef.current); setPhase("setup"); }} className="text-sm font-bold text-slate-500">Quit quiz</button>
          <button disabled={selected===null} onClick={next} className="inline-flex items-center gap-2 rounded-full bg-[#E94E3C] disabled:opacity-40 text-white font-bold px-6 py-3 text-sm">{idx+1>=qs.length?"Submit & See Result":"Next Question"} <ArrowRight className="h-4 w-4"/></button>
        </div>
      </div>
    </div>
  );

  if(phase==="result" && result) {
    const grade = result.scorePercent>=80?"Excellent — cathlab ready!":result.scorePercent>=60?"Good — keep revising":result.scorePercent>=40?"Fair — review the modules below":"Keep going — every expert started here";
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-3xl bg-[#0F2040] text-white p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto text-amber-400"/>
          <p className="mt-3 text-5xl font-extrabold">{result.scorePercent}%</p>
          <p className="mt-1 font-bold">{grade}</p>
          <p className="text-white/70 text-sm mt-2">{result.correct} of {result.total} correct • {result.topic} • {result.mode} • {fmt(result.timeSpentSec)} • Saved for {name}</p>
          <div className="mt-5 flex justify-center gap-3 flex-wrap">
            <button onClick={()=>setPhase("setup")} className="rounded-full bg-[#E94E3C] px-6 py-2.5 font-bold text-sm inline-flex gap-2 items-center"><RotateCcw className="h-4 w-4"/> New Quiz</button>
            <button onClick={start} className="rounded-full bg-white text-[#0F2040] px-6 py-2.5 font-bold text-sm">Retry Same Topic</button>
          </div>
        </div>
        <h3 className="font-extrabold text-xl text-[#0F2040]">Review Every Question</h3>
        <div className="space-y-3">
          {result.answers.map((a:any,i:number)=>(
            <div key={i} className={`rounded-2xl border-2 bg-white p-5 ${a.chosen===a.correct?"border-green-200":"border-red-200"}`}>
              <p className="font-bold text-[#0F2040]"><span className="text-slate-400">Q{i+1}.</span> {a.q}</p>
              <p className="mt-2 text-sm"><span className={a.chosen===a.correct?"text-green-700 font-semibold":"text-red-700 font-semibold"}>Your answer: {a.chosen>=0?a.options?.[a.chosen]:"Not answered"}</span></p>
              {a.chosen!==a.correct&&<p className="text-sm text-green-700 font-semibold">Correct: {a.options?.[a.correct]}</p>}
              <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-xl p-3">{a.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-[#0F2040] text-white">
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold text-[#5EEAD4]">QUIZ ARENA</p><h1 className="mt-2 text-3xl font-extrabold">Test yourself like it's the viva</h1>
            <p className="mt-2 text-white/70 text-sm max-w-2xl leading-relaxed">36 exam-style MCQs across anatomy, hemodynamics, PCI, ECG, pharmacology, hardware, devices & safety. Practice mode explains instantly; Exam mode is timed (1 min/question) — results are saved to your profile.</p>
          </div>
          <div className="relative min-h-[180px] hidden lg:block">
            <img src="/images/ecg-monitor.jpg" alt="ECG monitor" className="absolute inset-0 h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-[#0F2040]/30"/>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
        <div className="bg-white rounded-3xl border p-6 sm:p-8">
          <h2 className="font-extrabold text-lg text-[#0F2040]">Configure your quiz</h2>
          <label className="block text-sm font-bold mt-5 mb-2">Topic</label>
          <div className="flex flex-wrap gap-2">{topics.map(t=><button key={t} onClick={()=>setTopic(t)} className={`px-3.5 py-2 rounded-full text-[13px] font-semibold ${topic===t?"bg-[#0E9A8B] text-white":"bg-slate-100 hover:bg-slate-200"}`}>{t}</button>)}</div>
          <label className="block text-sm font-bold mt-6 mb-2">Number of questions</label>
          <div className="flex gap-2">{[5,10,15,20].map(n=><button key={n} onClick={()=>setCount(n)} className={`px-5 py-2.5 rounded-full font-bold text-sm ${count===n?"bg-[#0F2040] text-white":"bg-slate-100"}`}>{n}</button>)}</div>
          <label className="block text-sm font-bold mt-6 mb-2">Mode</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <button onClick={()=>setMode("practice")} className={`text-left rounded-2xl border-2 p-4 ${mode==="practice"?"border-[#0E9A8B] bg-teal-50/60":"border-slate-200"}`}><BookOpen className="h-5 w-5 text-[#0E9A8B]"/><p className="font-bold mt-2">Practice Mode</p><p className="text-xs text-slate-500 mt-1">Instant feedback + explanation after each question. Best for learning.</p></button>
            <button onClick={()=>setMode("exam")} className={`text-left rounded-2xl border-2 p-4 ${mode==="exam"?"border-[#E94E3C] bg-red-50/60":"border-slate-200"}`}><Timer className="h-5 w-5 text-[#E94E3C]"/><p className="font-bold mt-2">Exam Mode</p><p className="text-xs text-slate-500 mt-1">Timed, no peeking. Auto-submits when time ends. Best before exams.</p></button>
          </div>
          <button onClick={start} className="mt-7 w-full rounded-full bg-[#E94E3C] text-white font-extrabold py-4 text-base hover:bg-[#d63f2e] flex items-center justify-center gap-2">Start Quiz — {count} Questions <ArrowRight className="h-5 w-5"/></button>
          <p className="text-xs text-slate-400 text-center mt-3">Playing as <b>{name}</b> — scores save automatically. {!student.name&&"Set your name in Profile to personalise."}</p>
        </div>
        <div className="bg-white rounded-3xl border p-6">
          <h2 className="font-extrabold text-[#0F2040] flex items-center gap-2"><History className="h-5 w-5 text-[#0E9A8B]"/> Recent Attempts</h2>
          {history.length===0?<p className="text-sm text-slate-500 mt-3 leading-relaxed">No attempts yet for {name}. Your history, average and best scores will appear here after your first quiz.</p>:
          <div className="mt-4 space-y-2">{history.slice(0,8).map((h:any)=>(
            <div key={h.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className={`grid h-11 w-11 place-items-center rounded-full font-extrabold text-sm text-white shrink-0 ${h.scorePercent>=60?"bg-[#0E9A8B]":"bg-[#E94E3C]"}`}>{h.scorePercent}%</span>
              <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{h.topic}</p><p className="text-[11px] text-slate-500">{h.correct}/{h.total} • {h.mode} • {new Date(h.createdAt).toLocaleDateString()}</p></div>
            </div>))}</div>}
          <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm"><b className="text-amber-800">Exam tip:</b> <span className="text-amber-900">After each quiz, redo only the wrong topics in Flashcards within 24 hours — spaced repetition doubles retention.</span></div>
        </div>
      </div>
    </div>
  );
}
