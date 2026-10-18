import { NextResponse } from "next/server";
import { ensureSeeded } from "@/lib/seed";
import { db } from "@/db";
import { modules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MODULE_SEED } from "@/lib/data";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    await ensureSeeded();
    const rows = await db.select().from(modules).where(eq(modules.slug, slug));
    if (rows[0]) return NextResponse.json({ module: rows[0] });
  } catch {}
  const mod = MODULE_SEED.find(m => m.slug === slug);
  if (!mod) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ module: mod });
}
