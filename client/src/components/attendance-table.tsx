import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react";
import { AttendanceForm } from "@/components/attendance-form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AttendanceTableProps {
  date: string;
  onDateChange: (date: string) => void;
}

export function AttendanceTable({ date, onDateChange }: AttendanceTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: [`/api/attendance?date=${date}`],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/attendance/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Attendance record deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete attendance record",
        variant: "destructive",
      });
    },
  });

  const getEmployeeName = (employeeId: string) => {
    const employee = Array.isArray(employees) ? employees.find((emp: any) => emp.id === employeeId) : null;
    return employee ? `${employee.name} (${employee.employeeId})` : "Unknown Employee";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { variant: "default" as const, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      late: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      absent: { variant: "destructive" as const, className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      "half-day": { variant: "outline" as const, className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.present;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    );
  };

  const getLocationBadge = (location: string) => {
    const locationConfig = {
      office: { icon: "🏢", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      remote: { icon: "🏠", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
      field: { icon: "🌍", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    };

    const config = locationConfig[location as keyof typeof locationConfig] || locationConfig.office;
    
    return (
      <Badge variant="outline" className={config.className}>
        {config.icon} {location.charAt(0).toUpperCase() + location.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Date Filter */}
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-auto"
          data-testid="input-filter-date"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!Array.isArray(attendanceRecords) || attendanceRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No attendance records found for {format(new Date(date), "MMM dd, yyyy")}
                </TableCell>
              </TableRow>
            ) : (
              attendanceRecords.map((record: any) => (
                <TableRow key={record.id} data-testid={`row-attendance-${record.id}`}>
                  <TableCell className="font-medium">
                    {getEmployeeName(record.employeeId)}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    {record.timeIn || "-"}
                    {record.status === "late" && record.timeIn && (
                      <span className="text-xs text-red-600 ml-1">(Late)</span>
                    )}
                  </TableCell>
                  <TableCell>{record.timeOut || "-"}</TableCell>
                  <TableCell>{getLocationBadge(record.workLocation)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>{record.totalHours || "-"}</span>
                      {record.overtime && (
                        <Badge variant="outline" className="text-xs">
                          +{record.overtimeHours}h OT
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {record.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          data-testid={`button-actions-${record.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingRecord(record)}
                          data-testid={`button-edit-${record.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteMutation.mutate(record.id)}
                          className="text-red-600"
                          data-testid={`button-delete-${record.id}`}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Form Modal */}
      {editingRecord && (
        <AttendanceForm
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          editRecord={editingRecord}
        />
      )}
    </div>
  );
}