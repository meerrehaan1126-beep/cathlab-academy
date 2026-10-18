import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  college: varchar("college", { length: 200 }).default(""),
  course: varchar("course", { length: 120 }).default("B.Sc Cardiac Technology"),
  year: varchar("year", { length: 40 }).default("1st Year"),
  goal: varchar("goal", { length: 200 }).default("Become a confident Cathlab Technologist"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const modules = pgTable("modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  description: text("description").notNull(),
  level: varchar("level", { length: 40 }).notNull(),
  durationMins: integer("duration_mins").notNull(),
  lessons: integer("lessons").notNull().default(5),
  image: text("image").default(""),
  color: varchar("color", { length: 20 }).default("#0E9A8B"),
  objectives: jsonb("objectives").$type<string[]>().notNull().default([]),
  sections: jsonb("sections").$type<{ heading: string; body: string; bullets?: string[]; pearl?: string }[]>().notNull().default([]),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  topic: varchar("topic", { length: 80 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctIndex: integer("correct_index").notNull(),
  explanation: text("explanation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => students.id),
  studentName: varchar("student_name", { length: 120 }).default("Guest Student"),
  topic: varchar("topic", { length: 80 }).notNull(),
  mode: varchar("mode", { length: 30 }).default("practice"),
  total: integer("total").notNull(),
  correct: integer("correct").notNull(),
  scorePercent: integer("score_percent").notNull(),
  timeSpentSec: integer("time_spent_sec").default(0),
  answers: jsonb("answers").$type<any[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const flashcards = pgTable("flashcards", {
  id: uuid("id").defaultRandom().primaryKey(),
  deck: varchar("deck", { length: 80 }).notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  hint: text("hint").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const casesTable = pgTable("cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  difficulty: varchar("difficulty", { length: 30 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  patient: jsonb("patient").$type<{ age: number; sex: string; presentation: string; vitals: string; history: string; ecg: string; labs: string }>().notNull(),
  steps: jsonb("steps").$type<{ question: string; options: string[]; correctIndex: number; explanation: string }[]>().notNull().default([]),
  diagnosis: text("diagnosis").notNull(),
  management: text("management").notNull(),
  learningPoints: jsonb("learning_points").$type<string[]>().notNull().default([]),
  image: text("image").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const glossary = pgTable("glossary", {
  id: uuid("id").defaultRandom().primaryKey(),
  term: varchar("term", { length: 160 }).notNull(),
  abbreviation: varchar("abbreviation", { length: 30 }).default(""),
  category: varchar("category", { length: 80 }).notNull(),
  definition: text("definition").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progress = pgTable("progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => students.id),
  studentName: varchar("student_name", { length: 120 }).default("Guest Student"),
  moduleSlug: varchar("module_slug", { length: 120 }).notNull(),
  moduleTitle: varchar("module_title", { length: 220 }).default(""),
  completed: boolean("completed").default(false),
  percent: integer("percent").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => students.id),
  studentName: varchar("student_name", { length: 120 }).default("Guest Student"),
  itemType: varchar("item_type", { length: 40 }).notNull(),
  itemSlug: varchar("item_slug", { length: 160 }).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => students.id),
  studentName: varchar("student_name", { length: 120 }).default("Guest Student"),
  moduleSlug: varchar("module_slug", { length: 120 }).notNull(),
  content: text("content").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
