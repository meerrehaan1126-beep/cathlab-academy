"use client";
export default function ECGWave({ path, color = "#E94E3C", height = 70 }: { path: string; color?: string; height?: number }) {
  // Repeat path 3 times for scrolling effect
  const full = `${path} ${path.replace("M -2","L 94")} `;
  return (
    <div className="w-full overflow-hidden rounded-lg bg-[#0B1B33] relative" style={{ height }}>
      <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <svg viewBox="0 0 94 60" preserveAspectRatio="none" className="w-full h-full relative">
        <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export function AnimatedECGLine({ className="" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 80" className={`w-full ${className}`} preserveAspectRatio="none">
      <path d="M0 40 L120 40 L135 40 L145 15 L155 65 L165 40 L220 40 Q235 25 250 40 L300 40 L310 40 L320 10 L330 70 L340 40 L400 40 Q415 25 430 40 L600 40" fill="none" stroke="#E94E3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ecg-dash" />
      <style>{`.ecg-dash{stroke-dasharray:1200;stroke-dashoffset:1200;animation:ecgdraw 3.2s linear infinite}@keyframes ecgdraw{to{stroke-dashoffset:-1200}}`}</style>
    </svg>
  );
}
