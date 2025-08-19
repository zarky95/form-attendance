import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department").notNull(),
  position: text("position").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendanceRecords = pgTable("attendance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => employees.id),
  date: timestamp("date").notNull(),
  timeIn: time("time_in"),
  timeOut: time("time_out"),
  breakTimeStart: time("break_time_start"),
  breakTimeEnd: time("break_time_end"),
  status: text("status").notNull(), // "present", "absent", "late", "half-day"
  workLocation: text("work_location").notNull().default("office"), // "office", "remote", "field"
  notes: text("notes"),
  totalHours: text("total_hours"),
  overtime: boolean("overtime").notNull().default(false),
  overtimeHours: text("overtime_hours"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  approvedBy: varchar("approved_by").references(() => employees.id),
  approvedAt: timestamp("approved_at"),
  isApproved: boolean("is_approved").notNull().default(false),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendanceRecords).omit({
  id: true,
  submittedAt: true,
  approvedAt: true,
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
