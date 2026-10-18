import { NextResponse } from "next/server";
import { db } from "@/db";
import { quizAttempts, progress, bookmarks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
export async function GET(req:Request){
  const name=new URL(req.url).searchParams.get("studentName")||"Guest Student";
  try{
    const attempts=await db.select().from(quizAttempts).where(eq(quizAttempts.studentName,name)).orderBy(desc(quizAttempts.createdAt)).limit(50);
    const prog=await db.select().from(progress).where(eq(progress.studentName,name));
    const bms=await db.select().from(bookmarks).where(eq(bookmarks.studentName,name));
    const avg=attempts.length?Math.round(attempts.reduce((a,x)=>a+x.scorePercent,0)/attempts.length):0;
    const totalQ=attempts.reduce((a,x)=>a+x.total,0);
    return NextResponse.json({ stats:{ attempts:attempts.length, avgScore:avg, totalQuestions:totalQ, completedModules:prog.filter(p=>p.completed).length, inProgress:prog.length, bookmarks:bms.length, bestScore: attempts.length?Math.max(...attempts.map(a=>a.scorePercent)):0 }, attempts: attempts.slice(0,8), progress: prog, bookmarks: bms });
  }catch{ return NextResponse.json({ stats:{attempts:0,avgScore:0,totalQuestions:0,completedModules:0,inProgress:0,bookmarks:0,bestScore:0}, attempts:[], progress:[], bookmarks:[] }); }
}
