"use client";
import { useState } from "react";
import { CheckCircle2, Copy, HeartPulse, KeyRound, Lock, Mail, MessageCircle } from "lucide-react";

const NEED = [
  {
    n: "1",
    site: "github.com",
    title: "GitHub account + token",
    why: "This stores the website code.",
    how: [
      "Open github.com → Sign up with your email (free).",
      "After login: click your photo (top right) → Settings → Developer settings (very bottom left) → Personal access tokens → Tokens (classic) → Generate new token (classic).",
      "Tick the box called repo. Generate. Copy the token (starts with ghp_). You will not see it again.",
      "Also write down your GitHub username (example: priya-cardiac).",
    ],
    send: "GitHub username + the ghp_ token",
  },
  {
    n: "2",
    site: "vercel.com",
    title: "Vercel account + token",
    why: "This puts the website on the internet with a real link.",
    how: [
      "Open vercel.com → Continue with GitHub (use the same GitHub).",
      "After login: click your name (top right) → Account Settings → Tokens → Create.",
      "Name it cathlab, scope Full Account, create, copy the token.",
    ],
    send: "The Vercel token",
  },
  {
    n: "3",
    site: "neon.tech",
    title: "Neon database URL",
    why: "This saves student profiles, quiz scores and notes.",
    how: [
      "Open neon.tech → Sign up with GitHub or email (free).",
      "Create a project. Any region is fine. Name it cathlab.",
      "On the dashboard you will see a connection string. Click copy. It starts with postgresql://",
    ],
    send: "The postgresql://… connection string",
  },
];

export default function PublishPage() {
  const [copied, setCopied] = useState(false);
  const template = `Please publish CathLab Academy for me.

1) GitHub username: 
GitHub token (ghp_...): 

2) Vercel token: 

3) DATABASE_URL (postgresql://...): 

(Do not send your email password.)`;

  function copyTemplate() {
    navigator.clipboard.writeText(template).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="rounded-3xl bg-[#0F2040] text-white p-6 sm:p-9">
        <p className="text-xs font-bold text-[#5EEAD4]">I WILL PUBLISH IT FOR YOU</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">You don’t need to know coding. You only create 3 free accounts.</h1>
        <p className="mt-3 text-white/75 text-sm leading-relaxed">I cannot press “Sign up” on GitHub / Vercel for you — those sites send an OTP to <b>your</b> phone or email. That part takes about 15 minutes. Then paste 3 items in chat, and I will do the technical publishing.</p>
        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#5EEAD4]"><HeartPulse className="h-4 w-4"/> Free. No credit card needed.</div>
      </div>

      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 text-sm text-amber-950">
        <p className="font-extrabold flex items-center gap-2"><Lock className="h-4 w-4"/> Never send your email password</p>
        <p className="mt-1">Only send the 3 <b>tokens / connection string</b> below. You can delete the GitHub and Vercel tokens after the site is live.</p>
      </div>

      {NEED.map(item => (
        <section key={item.n} className="bg-white rounded-3xl border p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#E94E3C] text-white font-extrabold shrink-0">{item.n}</span>
            <div>
              <p className="text-xs font-bold text-[#0E9A8B]">{item.site}</p>
              <h2 className="text-xl font-extrabold text-[#0F2040]">{item.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{item.why}</p>
            </div>
          </div>
          <ol className="mt-4 space-y-2.5">
            {item.how.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-[11px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                {h}
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 text-sm font-bold text-teal-900 flex gap-2"><KeyRound className="h-4 w-4 shrink-0 mt-0.5"/> Send me: {item.send}</p>
        </section>
      ))}

      <section className="rounded-3xl bg-[#0F2040] text-white p-6 sm:p-8">
        <h2 className="font-extrabold text-xl flex items-center gap-2"><MessageCircle className="h-5 w-5 text-[#5EEAD4]"/> Then paste this in chat</h2>
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-black/30 p-4 text-[13px] leading-relaxed text-[#5EEAD4] font-mono">{template}</pre>
        <button onClick={copyTemplate} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E94E3C] px-5 py-2.5 text-sm font-bold">
          <Copy className="h-4 w-4"/> {copied ? "Copied ✓" : "Copy message template"}
        </button>
        <p className="mt-3 text-xs text-white/55">After I receive those 3 items I will upload the code, connect the database, and send you a live link like https://cathlab-academy.vercel.app — which you can share on WhatsApp.</p>
      </section>

      <section className="bg-white rounded-3xl border p-6">
        <h2 className="font-extrabold text-[#0F2040] flex items-center gap-2"><Mail className="h-5 w-5 text-[#2563A8]"/> What happens after it is live</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {[
            "You get a public link. Students open it on their phones. No app store.",
            "They set a profile, take quizzes, watch videos — scores save in your database.",
            "You can later add your own domain (optional), e.g. cathlabacademy.com.",
            "Delete the GitHub/Vercel tokens from their websites once you confirm the site works.",
          ].map(x => (
            <li key={x} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0E9A8B] shrink-0 mt-0.5"/>{x}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
