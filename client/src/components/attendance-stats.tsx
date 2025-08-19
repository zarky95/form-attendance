import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";

export function AttendanceStats() {
  const currentDate = new Date();
  const monthStart = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(currentDate), "yyyy-MM-dd");

  const { data: stats, isLoading } = useQuery({
    queryKey: [`/api/attendance/stats?startDate=${monthStart}&endDate=${monthEnd}`],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No statistics available</p>
      </div>
    );
  }

  const attendanceRate = parseFloat(stats?.attendanceRate || "0");
  const isGoodAttendance = attendanceRate >= 90;

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        {format(startOfMonth(currentDate), "MMM yyyy")} Statistics
      </div>

      {/* Attendance Rate */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isGoodAttendance ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Attendance Rate</span>
            </div>
            <Badge
              variant={isGoodAttendance ? "default" : "destructive"}
              className={isGoodAttendance ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
              data-testid="badge-attendance-rate"
            >
              {stats?.attendanceRate}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Working Days */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Days</span>
            </div>
            <div className="text-right">
              <div className="font-semibold" data-testid="stat-total-days">{stats?.totalDays || 0}</div>
              <div className="text-xs text-muted-foreground">Working days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Present Days */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              <span className="text-sm font-medium">Present</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600" data-testid="stat-present-days">{stats?.presentDays || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Late Days */}
      {(stats?.lateDays || 0) > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
                <span className="text-sm font-medium">Late</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-yellow-600" data-testid="stat-late-days">{stats?.lateDays || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Absent Days */}
      {(stats?.absentDays || 0) > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                <span className="text-sm font-medium">Absent</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-red-600" data-testid="stat-absent-days">{stats?.absentDays || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Hours */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Total Hours</span>
            </div>
            <div className="text-right">
              <div className="font-semibold" data-testid="stat-total-hours">{stats?.totalHours || 0}h</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overtime Days */}
      {(stats?.overtimeDays || 0) > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm font-medium">Overtime</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-orange-600" data-testid="stat-overtime-days">{stats?.overtimeDays || 0}</div>
                <div className="text-xs text-muted-foreground">Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}