import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  try {
    const existing = await db.select().from(bookmarks).where(and(eq(bookmarks.studentName, body.studentName||"Guest Student"), eq(bookmarks.itemSlug, body.itemSlug)));
    if (existing[0]) { await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id)); return NextResponse.json({ bookmarked: false }); }
    const [row] = await db.insert(bookmarks).values({ studentName: body.studentName||"Guest Student", itemType: body.itemType||"module", itemSlug: body.itemSlug, title: body.title||"" }).returning();
    return NextResponse.json({ bookmarked: true, bookmark: row });
  } catch (e:any) { return NextResponse.json({ bookmarked: true, note: e.message }); }
}
export async function GET(req: Request) {
  const name = new URL(req.url).searchParams.get("studentName") || "Guest Student";
  try { const rows = await db.select().from(bookmarks).where(eq(bookmarks.studentName, name)).orderBy(desc(bookmarks.createdAt)); return NextResponse.json({ bookmarks: rows }); }
  catch { return NextResponse.json({ bookmarks: [] }); }
}
