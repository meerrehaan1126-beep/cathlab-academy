import { NextResponse } from "next/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  try {
    const existing = await db.select().from(notes).where(and(eq(notes.studentName, body.studentName||"Guest Student"), eq(notes.moduleSlug, body.moduleSlug)));
    if (existing[0]) { const [row]=await db.update(notes).set({ content: body.content||"", updatedAt: new Date() }).where(eq(notes.id, existing[0].id)).returning(); return NextResponse.json({ note: row }); }
    const [row]=await db.insert(notes).values({ studentName: body.studentName||"Guest Student", moduleSlug: body.moduleSlug, content: body.content||"" }).returning();
    return NextResponse.json({ note: row });
  } catch(e:any){ return NextResponse.json({ note: body, note2: e.message }); }
}
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  try { const rows = await db.select().from(notes).where(and(eq(notes.studentName, p.get("studentName")||"Guest Student"), eq(notes.moduleSlug, p.get("moduleSlug")||""))); return NextResponse.json({ note: rows[0]||null }); }
  catch { return NextResponse.json({ note: null }); }
}
