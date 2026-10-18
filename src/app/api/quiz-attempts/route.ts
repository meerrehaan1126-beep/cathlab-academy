import { NextResponse } from "next/server";
import { db } from "@/db";
import { quizAttempts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  try {
    const [row] = await db.insert(quizAttempts).values({
      studentName: body.studentName || "Guest Student",
      studentId: body.studentId && body.studentId.length > 20 ? body.studentId : null,
      topic: body.topic || "All Topics",
      mode: body.mode || "practice",
      total: Number(body.total||0), correct: Number(body.correct||0),
      scorePercent: Number(body.scorePercent||0),
      timeSpentSec: Number(body.timeSpentSec||0),
      answers: body.answers || [],
    }).returning();
    return NextResponse.json({ attempt: row });
  } catch (e:any) {
    return NextResponse.json({ attempt: { id: "local", ...body }, note: e.message });
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("studentName");
  try {
    const rows = name
      ? await db.select().from(quizAttempts).where(eq(quizAttempts.studentName, name)).orderBy(desc(quizAttempts.createdAt)).limit(30)
      : await db.select().from(quizAttempts).orderBy(desc(quizAttempts.createdAt)).limit(30);
    return NextResponse.json({ attempts: rows });
  } catch { return NextResponse.json({ attempts: [] }); }
}
