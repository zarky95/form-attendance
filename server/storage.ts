import { type Employee, type InsertEmployee, type AttendanceRecord, type InsertAttendance } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Employee methods
  getEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | undefined>;
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  
  // Attendance methods
  getAttendanceRecords(employeeId?: string, date?: string): Promise<AttendanceRecord[]>;
  getAttendanceRecordById(id: string): Promise<AttendanceRecord | undefined>;
  createAttendanceRecord(attendance: InsertAttendance): Promise<AttendanceRecord>;
  updateAttendanceRecord(id: string, attendance: Partial<InsertAttendance>): Promise<AttendanceRecord | undefined>;
  deleteAttendanceRecord(id: string): Promise<boolean>;
  
  // Analytics methods
  getAttendanceStats(employeeId?: string, startDate?: string, endDate?: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private employees: Map<string, Employee> = new Map();
  private attendanceRecords: Map<string, AttendanceRecord> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some initial employee data
    const sampleEmployees: Employee[] = [
      {
        id: "emp1",
        employeeId: "EMP001",
        name: "John Smith",
        email: "john.smith@company.com",
        department: "Engineering",
        position: "Senior Developer",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "emp2",
        employeeId: "EMP002",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        department: "Marketing",
        position: "Marketing Manager",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "emp3",
        employeeId: "EMP003",
        name: "Mike Davis",
        email: "mike.davis@company.com",
        department: "Sales",
        position: "Sales Representative",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "emp4",
        employeeId: "EMP004",
        name: "Emily Chen",
        email: "emily.chen@company.com",
        department: "HR",
        position: "HR Specialist",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sampleAttendanceRecords: AttendanceRecord[] = [
      {
        id: "att1",
        employeeId: "emp1",
        date: today,
        timeIn: "09:00",
        timeOut: "17:30",
        breakTimeStart: "12:00",
        breakTimeEnd: "13:00",
        status: "present",
        workLocation: "office",
        notes: "Regular working day",
        totalHours: "8.5",
        overtime: false,
        overtimeHours: null,
        submittedAt: new Date(),
        approvedBy: null,
        approvedAt: null,
        isApproved: false,
      },
      {
        id: "att2",
        employeeId: "emp2",
        date: today,
        timeIn: "08:30",
        timeOut: "17:00",
        breakTimeStart: "12:30",
        breakTimeEnd: "13:30",
        status: "present",
        workLocation: "remote",
        notes: "Working from home today",
        totalHours: "8.5",
        overtime: false,
        overtimeHours: null,
        submittedAt: new Date(),
        approvedBy: null,
        approvedAt: null,
        isApproved: false,
      },
      {
        id: "att3",
        employeeId: "emp1",
        date: yesterday,
        timeIn: "09:15",
        timeOut: "18:00",
        breakTimeStart: "12:00",
        breakTimeEnd: "13:00",
        status: "late",
        workLocation: "office",
        notes: "Traffic delay",
        totalHours: "8.75",
        overtime: false,
        overtimeHours: null,
        submittedAt: new Date(),
        approvedBy: null,
        approvedAt: null,
        isApproved: false,
      },
    ];

    sampleEmployees.forEach(employee => {
      this.employees.set(employee.id, employee);
    });

    sampleAttendanceRecords.forEach(record => {
      this.attendanceRecords.set(record.id, record);
    });
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(emp => emp.employeeId === employeeId);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = {
      ...insertEmployee,
      id,
      isActive: insertEmployee.isActive ?? true,
      createdAt: new Date(),
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, updateData: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { ...employee, ...updateData };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  // Attendance methods
  async getAttendanceRecords(employeeId?: string, date?: string): Promise<AttendanceRecord[]> {
    let records = Array.from(this.attendanceRecords.values());
    
    if (employeeId) {
      records = records.filter(record => record.employeeId === employeeId);
    }
    
    if (date) {
      const targetDate = new Date(date);
      records = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === targetDate.toDateString();
      });
    }
    
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getAttendanceRecordById(id: string): Promise<AttendanceRecord | undefined> {
    return this.attendanceRecords.get(id);
  }

  async createAttendanceRecord(insertAttendance: InsertAttendance): Promise<AttendanceRecord> {
    const id = randomUUID();
    const record: AttendanceRecord = {
      ...insertAttendance,
      id,
      timeIn: insertAttendance.timeIn || null,
      timeOut: insertAttendance.timeOut || null,
      breakTimeStart: insertAttendance.breakTimeStart || null,
      breakTimeEnd: insertAttendance.breakTimeEnd || null,
      notes: insertAttendance.notes || null,
      totalHours: insertAttendance.totalHours || null,
      overtimeHours: insertAttendance.overtimeHours || null,
      approvedBy: insertAttendance.approvedBy || null,
      submittedAt: new Date(),
      approvedAt: null,
      isApproved: false,
    };
    this.attendanceRecords.set(id, record);
    return record;
  }

  async updateAttendanceRecord(id: string, updateData: Partial<InsertAttendance>): Promise<AttendanceRecord | undefined> {
    const record = this.attendanceRecords.get(id);
    if (!record) return undefined;
    
    const updatedRecord = { ...record, ...updateData };
    this.attendanceRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteAttendanceRecord(id: string): Promise<boolean> {
    return this.attendanceRecords.delete(id);
  }

  async getAttendanceStats(employeeId?: string, startDate?: string, endDate?: string): Promise<any> {
    let records = Array.from(this.attendanceRecords.values());
    
    if (employeeId) {
      records = records.filter(record => record.employeeId === employeeId);
    }
    
    if (startDate) {
      const start = new Date(startDate);
      records = records.filter(record => new Date(record.date) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      records = records.filter(record => new Date(record.date) <= end);
    }
    
    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === "present").length;
    const lateDays = records.filter(r => r.status === "late").length;
    const absentDays = records.filter(r => r.status === "absent").length;
    const overtimeDays = records.filter(r => r.overtime).length;
    
    const totalHours = records.reduce((sum, record) => {
      const hours = parseFloat(record.totalHours || "0");
      return sum + hours;
    }, 0);
    
    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      overtimeDays,
      totalHours: totalHours.toFixed(1),
      attendanceRate: totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(1) : "0",
    };
  }
}

export const storage = new MemStorage();
