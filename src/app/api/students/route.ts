import { NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  if (!body.name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  try {
    const [row] = await db.insert(students).values({
      name: body.name.trim(), college: body.college||"", course: body.course||"B.Sc Cardiac Technology", year: body.year||"1st Year", goal: body.goal||"",
    }).returning();
    return NextResponse.json({ student: row });
  } catch (e:any) {
    return NextResponse.json({ student: { id: null, ...body }, note: e.message });
  }
}
