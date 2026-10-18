"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, CheckCircle2, XCircle, Eye, Layers } from "lucide-react";
import { FLASHCARD_SEED } from "@/lib/data";

export default function FlashcardsPage(){
  const [cards,setCards]=useState<any[]>(FLASHCARD_SEED as any);
  const decks=useMemo(()=>["All Decks",...Array.from(new Set(cards.map((c:any)=>c.deck)))],[cards]);
  const [deck,setDeck]=useState("All Decks");
  const filtered=useMemo(()=> deck==="All Decks"?cards:cards.filter((c:any)=>c.deck===deck),[cards,deck]);
  const [idx,setIdx]=useState(0); const [flipped,setFlipped]=useState(false);
  const [known,setKnown]=useState<Set<number>>(new Set()); const [review,setReview]=useState<Set<number>>(new Set());
  useEffect(()=>{ fetch("/api/flashcards").then(r=>r.json()).then(d=>{ if(d.flashcards?.length) setCards(d.flashcards); }).catch(()=>{}); },[]);
  useEffect(()=>{ setIdx(0); setFlipped(false); },[deck]);
  const card=filtered[Math.min(idx,Math.max(0,filtered.length-1))];
  function go(n:number){ setFlipped(false); setTimeout(()=>setIdx((idx+n+filtered.length)%filtered.length),120); }
  function shuffle(){ setCards([...cards].sort(()=>Math.random()-0.5)); setIdx(0); setFlipped(false); }
  function mark(type:"known"|"review"){ const globalIdx=cards.indexOf(card); if(type==="known"){ setKnown(new Set([...known,globalIdx])); review.delete(globalIdx); setReview(new Set(review)); } else { setReview(new Set([...review,globalIdx])); known.delete(globalIdx); setKnown(new Set(known)); } go(1); }

  return(
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-3xl bg-[#0F2040] text-white">
        <div className="grid lg:grid-cols-[1.5fr_1fr]">
          <div className="p-6 sm:p-8">
        <p className="text-xs font-bold text-[#5EEAD4]">FLASHCARDS</p><h1 className="mt-2 text-3xl font-extrabold">Rapid recall, cathlab style</h1>
        <p className="mt-2 text-white/70 text-sm leading-relaxed max-w-2xl">24 high-yield cards — formulas, doses, views and emergency call-outs. Click the card to flip. Mark “Know it” or “Review again” to track your session.</p>
        <div className="mt-4 flex gap-3 text-sm font-bold"><span className="rounded-full bg-[#0E9A8B] px-3 py-1.5">✓ Know: {known.size}</span><span className="rounded-full bg-[#E94E3C] px-3 py-1.5">↺ Review: {review.size}</span><span className="rounded-full bg-white/15 px-3 py-1.5">{Math.round(known.size/Math.max(1,cards.length)*100)}% mastered</span></div>
          </div>
          <div className="relative min-h-[160px] hidden lg:block">
            <img src="/images/coronary-anatomy.jpg" alt="Coronary anatomy" className="absolute inset-0 h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-[#0F2040]/30"/>
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
        {decks.map(d=><button key={d} onClick={()=>setDeck(d)} className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap ${deck===d?"bg-[#0E9A8B] text-white":"bg-white border border-slate-200"}`}>{d}</button>)}
        <button onClick={shuffle} className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F2040] text-white text-sm font-bold whitespace-nowrap"><Shuffle className="h-4 w-4"/> Shuffle</button>
      </div>
      {card && <>
        <div className="flip-card cursor-pointer select-none" onClick={()=>setFlipped(!flipped)}>
          <div className={`flip-inner ${flipped?"flipped":""} h-[320px] sm:h-[300px]`}>
            <div className="flip-face absolute inset-0 rounded-3xl bg-white border-2 border-slate-200 shadow-sm p-8 flex flex-col">
              <div className="flex justify-between"><span className="text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1 rounded-full flex items-center gap-1"><Layers className="h-3 w-3"/>{card.deck}</span><span className="text-xs text-slate-400 font-bold">Card {idx+1} / {filtered.length}</span></div>
              <div className="flex-1 grid place-items-center text-center px-2"><h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2040] leading-snug">{card.front}</h2></div>
              {card.hint&&<p className="text-center text-xs text-slate-400">Hint: {card.hint}</p>}
              <p className="text-center text-sm font-bold text-[#0E9A8B] mt-2 flex items-center justify-center gap-2"><Eye className="h-4 w-4"/> Click card to reveal answer</p>
            </div>
            <div className="flip-face flip-back rounded-3xl bg-[#0F2040] text-white shadow-sm p-8 flex flex-col">
              <span className="text-[11px] font-bold bg-[#0E9A8B] px-3 py-1 rounded-full w-fit">ANSWER</span>
              <div className="flex-1 grid place-items-center text-center px-2"><p className="text-xl sm:text-2xl font-semibold leading-relaxed">{card.back}</p></div>
              <p className="text-center text-xs text-white/50">Click to flip back</p>
            </div>
          </div>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#0E9A8B] transition-all" style={{width:`${((idx+1)/filtered.length)*100}%`}}/></div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={()=>go(-1)} className="rounded-full bg-white border px-5 py-3 font-bold text-sm inline-flex items-center gap-1"><ChevronLeft className="h-4 w-4"/> Prev</button>
          <button onClick={()=>mark("review")} className="rounded-full bg-[#E94E3C] text-white px-5 py-3 font-bold text-sm inline-flex items-center gap-2"><XCircle className="h-4 w-4"/> Review Again</button>
          <button onClick={()=>mark("known")} className="rounded-full bg-[#0E9A8B] text-white px-5 py-3 font-bold text-sm inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Know It</button>
          <button onClick={()=>go(1)} className="rounded-full bg-white border px-5 py-3 font-bold text-sm inline-flex items-center gap-1">Next <ChevronRight className="h-4 w-4"/></button>
          <button onClick={()=>{setKnown(new Set());setReview(new Set());setIdx(0);setFlipped(false);}} className="rounded-full bg-slate-100 px-4 py-3 text-sm font-bold inline-flex items-center gap-1"><RotateCcw className="h-4 w-4"/> Reset</button>
        </div>
      </>}
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((c:any,i:number)=>(
          <button key={i} onClick={()=>{setIdx(i);setFlipped(false); window.scrollTo({top:0,behavior:"smooth"});}} className={`text-left rounded-2xl border bg-white p-4 hover:border-teal-300 ${i===idx?"border-[#0E9A8B] ring-1 ring-[#0E9A8B]":""}`}>
            <p className="text-[11px] font-bold text-[#0E9A8B]">{c.deck}</p><p className="text-sm font-semibold text-[#0F2040] mt-1 line-clamp-2">{c.front}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
