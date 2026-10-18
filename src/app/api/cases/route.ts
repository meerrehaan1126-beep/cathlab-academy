import { NextResponse } from "next/server";
import { ensureSeeded } from "@/lib/seed";
import { db } from "@/db";
import { casesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CASE_SEED } from "@/lib/data";
export async function GET(req:Request){
  const slug=new URL(req.url).searchParams.get("slug");
  try{ await ensureSeeded(); if(slug){ const r=await db.select().from(casesTable).where(eq(casesTable.slug,slug)); if(r[0]) return NextResponse.json({case:r[0]}); } const rows=await db.select().from(casesTable); if(rows.length) return NextResponse.json({cases:rows}); }catch{}
  if(slug){ const c=CASE_SEED.find(x=>x.slug===slug); return c?NextResponse.json({case:c}):NextResponse.json({error:"not found"},{status:404}); }
  return NextResponse.json({cases:CASE_SEED});
}
