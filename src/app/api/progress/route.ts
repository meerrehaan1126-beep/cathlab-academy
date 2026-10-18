import { NextResponse } from "next/server";
import { db } from "@/db";
import { progress } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  try {
    const existing = await db.select().from(progress).where(and(eq(progress.studentName, body.studentName||"Guest Student"), eq(progress.moduleSlug, body.moduleSlug)));
    if (existing[0]) {
      const [row] = await db.update(progress).set({ completed: !!body.completed, percent: Number(body.percent|| (body.completed?100:50)), updatedAt: new Date() }).where(eq(progress.id, existing[0].id)).returning();
      return NextResponse.json({ progress: row });
    }
    const [row] = await db.insert(progress).values({ studentName: body.studentName||"Guest Student", studentId: body.studentId && body.studentId.length>20 ? body.studentId : null, moduleSlug: body.moduleSlug, moduleTitle: body.moduleTitle||"", completed: !!body.completed, percent: Number(body.percent|| (body.completed?100:50)) }).returning();
    return NextResponse.json({ progress: row });
  } catch (e:any) { return NextResponse.json({ progress: body, note: e.message }); }
}
export async function GET(req: Request) {
  const name = new URL(req.url).searchParams.get("studentName") || "Guest Student";
  try { const rows = await db.select().from(progress).where(eq(progress.studentName, name)).orderBy(desc(progress.updatedAt)); return NextResponse.json({ progress: rows }); }
  catch { return NextResponse.json({ progress: [] }); }
}
