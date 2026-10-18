import { NextResponse } from "next/server";
import { ensureSeeded } from "@/lib/seed";
import { db } from "@/db";
import { glossary } from "@/db/schema";
import { GLOSSARY_SEED } from "@/lib/data";
export async function GET(){ try{ await ensureSeeded(); const rows=await db.select().from(glossary); if(rows.length) return NextResponse.json({terms:rows}); }catch{} return NextResponse.json({terms:GLOSSARY_SEED}); }
