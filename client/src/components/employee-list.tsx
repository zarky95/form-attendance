import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export function EmployeeList() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: todayAttendance } = useQuery({
    queryKey: [`/api/attendance?date=${format(new Date(), "yyyy-MM-dd")}`],
  });

  const getEmployeeStatus = (employeeId: string) => {
    const record = Array.isArray(todayAttendance) ? todayAttendance.find((record: any) => record.employeeId === employeeId) : null;
    return record?.status || "not-marked";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "half-day":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.isArray(employees) ? employees.map((employee: any) => {
        const status = getEmployeeStatus(employee.id);
        const initials = employee.name
          .split(" ")
          .map((name: string) => name[0])
          .join("")
          .toUpperCase();

        return (
          <Card key={employee.id} className="p-0">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3" data-testid={`employee-card-${employee.employeeId}`}>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {employee.name}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(status)}`}
                      data-testid={`status-${employee.employeeId}`}
                    >
                      {status === "not-marked" ? "Not Marked" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {employee.employeeId}
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">
                      {employee.department}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {employee.position}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No employees found</p>
        </div>
      )}
    </div>
  );
}