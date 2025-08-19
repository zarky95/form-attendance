import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, Users, TrendingUp, Plus } from "lucide-react";
import { AttendanceForm } from "@/components/attendance-form";
import { AttendanceTable } from "@/components/attendance-table";
import { EmployeeList } from "@/components/employee-list";
import { AttendanceStats } from "@/components/attendance-stats";
import { useState } from "react";
import { format } from "date-fns";

export default function Dashboard() {
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: todayAttendance, isLoading: attendanceLoading } = useQuery({
    queryKey: [`/api/attendance?date=${selectedDate}`],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/attendance/stats"],
  });

  if (employeesLoading || attendanceLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalEmployees = Array.isArray(employees) ? employees.length : 0;
  const todayPresent = Array.isArray(todayAttendance) ? todayAttendance.filter((record: any) => record.status === "present" || record.status === "late").length : 0;
  const todayAbsent = Array.isArray(todayAttendance) ? todayAttendance.filter((record: any) => record.status === "absent").length : 0;
  const attendanceRate = totalEmployees > 0 ? ((todayPresent / totalEmployees) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="heading-dashboard">
                Daily Attendance Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track and manage employee attendance records
              </p>
            </div>
            <Button 
              onClick={() => setShowAttendanceForm(true)}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-add-attendance"
            >
              <Plus className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-employees">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="stat-present-today">{todayPresent}</div>
              <p className="text-xs text-muted-foreground">Checked in today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <CalendarDays className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" data-testid="stat-absent-today">{todayAbsent}</div>
              <p className="text-xs text-muted-foreground">Not checked in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="stat-attendance-rate">{attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">Today's rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Records */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Attendance</span>
                  <Badge variant="outline">{format(new Date(selectedDate), "MMM dd, yyyy")}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceTable 
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </CardContent>
            </Card>
          </div>

          {/* Employee Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeeList />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceStats />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Attendance Form Modal */}
      {showAttendanceForm && (
        <AttendanceForm 
          isOpen={showAttendanceForm}
          onClose={() => setShowAttendanceForm(false)}
        />
      )}
    </div>
  );
}