import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema, insertAttendanceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await storage.getEmployeeById(id);
      
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid employee data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create employee" });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(id, validatedData);
      
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      
      res.json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid employee data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update employee" });
    }
  });

  // Analytics routes - must be placed BEFORE the /api/attendance/:id route
  app.get("/api/attendance/stats", async (req, res) => {
    try {
      const { employeeId, startDate, endDate } = req.query;
      const stats = await storage.getAttendanceStats(
        employeeId as string,
        startDate as string,
        endDate as string
      );
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance stats" });
    }
  });

  // Attendance routes
  app.get("/api/attendance", async (req, res) => {
    try {
      const { employeeId, date } = req.query;
      const records = await storage.getAttendanceRecords(
        employeeId as string,
        date as string
      );
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance records" });
    }
  });

  app.get("/api/attendance/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const record = await storage.getAttendanceRecordById(id);
      
      if (!record) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance record" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      const record = await storage.createAttendanceRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid attendance data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create attendance record" });
    }
  });

  app.put("/api/attendance/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertAttendanceSchema.partial().parse(req.body);
      const record = await storage.updateAttendanceRecord(id, validatedData);
      
      if (!record) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      
      res.json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid attendance data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update attendance record" });
    }
  });

  app.delete("/api/attendance/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteAttendanceRecord(id);
      
      if (!success) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      
      res.json({ message: "Attendance record deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete attendance record" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}