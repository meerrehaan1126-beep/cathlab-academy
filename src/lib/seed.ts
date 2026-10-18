import { db } from "@/db";
import { modules, questions, flashcards, glossary, casesTable } from "@/db/schema";
import { MODULE_SEED, QUESTION_SEED, FLASHCARD_SEED, GLOSSARY_SEED, CASE_SEED } from "./data";
import { sql } from "drizzle-orm";

let seeded = false;
export async function ensureSeeded() {
  if (seeded) return;
  try {
    const existing = await db.select({ c: sql<number>`count(*)::int` }).from(modules);
    if ((existing[0]?.c ?? 0) === 0) {
      await db.insert(modules).values(MODULE_SEED as any);
    }
    const q = await db.select({ c: sql<number>`count(*)::int` }).from(questions);
    if ((q[0]?.c ?? 0) === 0) await db.insert(questions).values(QUESTION_SEED as any);
    const f = await db.select({ c: sql<number>`count(*)::int` }).from(flashcards);
    if ((f[0]?.c ?? 0) === 0) await db.insert(flashcards).values(FLASHCARD_SEED as any);
    const g = await db.select({ c: sql<number>`count(*)::int` }).from(glossary);
    if ((g[0]?.c ?? 0) === 0) await db.insert(glossary).values(GLOSSARY_SEED as any);
    const c = await db.select({ c: sql<number>`count(*)::int` }).from(casesTable);
    if ((c[0]?.c ?? 0) === 0) await db.insert(casesTable).values(CASE_SEED as any);
    seeded = true;
  } catch (e) {
    // DB tables may not exist yet in dev before push; callers will fallback to static data
    console.error("ensureSeeded failed", e);
  }
}
