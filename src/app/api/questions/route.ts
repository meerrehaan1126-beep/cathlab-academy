import { NextResponse } from "next/server";
import { ensureSeeded } from "@/lib/seed";
import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { QUESTION_SEED } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const limit = Number(searchParams.get("limit") || "40");
  try {
    await ensureSeeded();
    const rows = topic && topic !== "All Topics"
      ? await db.select().from(questions).where(eq(questions.topic, topic))
      : await db.select().from(questions);
    if (rows.length) {
      const shuffled = [...rows].sort(() => Math.random() - 0.5).slice(0, limit);
      return NextResponse.json({ questions: shuffled, topics: [...new Set(QUESTION_SEED.map(q=>q.topic))] });
    }
  } catch {}
  let qs = topic && topic !== "All Topics" ? QUESTION_SEED.filter(q=>q.topic===topic) : QUESTION_SEED;
  qs = [...qs].sort(()=>Math.random()-0.5).slice(0, limit);
  return NextResponse.json({ questions: qs, topics: [...new Set(QUESTION_SEED.map(q=>q.topic))] });
}
