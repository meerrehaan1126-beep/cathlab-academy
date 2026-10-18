import { NextResponse } from "next/server";
import { ensureSeeded } from "@/lib/seed";
import { db } from "@/db";
import { flashcards } from "@/db/schema";
import { FLASHCARD_SEED } from "@/lib/data";
export async function GET(){ try{ await ensureSeeded(); const rows=await db.select().from(flashcards); if(rows.length) return NextResponse.json({flashcards:rows}); }catch{} return NextResponse.json({flashcards:FLASHCARD_SEED}); }
