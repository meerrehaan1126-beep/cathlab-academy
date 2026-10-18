import { NextResponse } from "next/server";
import { ensureSeeded } from "@/lib/seed";
import { db } from "@/db";
import { modules } from "@/db/schema";
import { asc } from "drizzle-orm";
import { MODULE_SEED } from "@/lib/data";

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(modules).orderBy(asc(modules.sortOrder));
    if (rows.length) return NextResponse.json({ modules: rows });
  } catch {}
  return NextResponse.json({ modules: MODULE_SEED });
}
