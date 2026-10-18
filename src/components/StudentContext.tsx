"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Student = { id?: string|null; name: string; college: string; course: string; year: string; goal: string };
const DEFAULT: Student = { name: "", college: "", course: "B.Sc Cardiac Technology", year: "2nd Year", goal: "Become a confident Cathlab Technologist" };
const Ctx = createContext<{ student: Student; setStudent: (s: Student)=>void; ready: boolean }>({ student: DEFAULT, setStudent: ()=>{}, ready:false });

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudentState] = useState<Student>(DEFAULT);
  const [ready, setReady] = useState(false);
  useEffect(()=>{ try{ const raw=localStorage.getItem("cathlab_student"); if(raw) setStudentState(JSON.parse(raw)); }catch{} setReady(true); },[]);
  const setStudent = (s: Student) => { setStudentState(s); try{ localStorage.setItem("cathlab_student", JSON.stringify(s)); }catch{} };
  return <Ctx.Provider value={{ student, setStudent, ready }}>{children}</Ctx.Provider>;
}
export function useStudent(){ return useContext(Ctx); }
export function displayName(s: Student){ return s.name?.trim() || "Guest Student"; }
