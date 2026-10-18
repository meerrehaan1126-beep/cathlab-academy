"use client";
import { Play } from "lucide-react";
import { useState } from "react";

export function VideoHero({ src, poster, className = "", children }: { src: string; poster?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video autoPlay muted loop playsInline poster={poster} className="absolute inset-0 h-full w-full object-cover">
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F2040]/90 via-[#0F2040]/55 to-[#0F2040]/25" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function LecturePlayer({ src, poster, title }: { src: string; poster?: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#0B1B33] shadow-lg">
      <video controls playsInline preload="metadata" poster={poster} className="aspect-video w-full bg-black" title={title}>
        <source src={src} type="video/mp4" />
        Your browser does not support video.
      </video>
    </div>
  );
}

export function VideoThumb({ src, poster, title, duration, onPlay }: { src: string; poster: string; title: string; duration?: string; onPlay: () => void }) {
  return (
    <button onClick={onPlay} className="group relative w-full overflow-hidden rounded-2xl text-left">
      <img src={poster} alt={title} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[#0F2040]/35 group-hover:bg-[#0F2040]/20 transition" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#E94E3C] text-white shadow-xl group-hover:scale-110 transition"><Play className="h-6 w-6 ml-0.5" fill="currentColor" /></span>
      </span>
      {duration && <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white">{duration}</span>}
    </button>
  );
}

export function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] bg-black/85 p-4 sm:p-10 flex items-center justify-center" onClick={onClose}>
      <img src={src} alt={alt} className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl" />
      <button className="absolute top-4 right-4 rounded-full bg-white text-[#0F2040] font-bold px-4 py-2 text-sm">Close</button>
    </div>
  );
}

export function MediaModal({ src, poster, title, onClose }: { src: string; poster?: string; title: string; onClose: () => void }) {
  const [ok] = useState(true);
  if (!ok) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-black/80 p-4 sm:p-10 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-4xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between text-white mb-3">
          <h3 className="font-extrabold text-lg pr-4">{title}</h3>
          <button onClick={onClose} className="rounded-full bg-white text-[#0F2040] font-bold px-4 py-2 text-sm shrink-0">Close</button>
        </div>
        <LecturePlayer src={src} poster={poster} title={title} />
      </div>
    </div>
  );
}
