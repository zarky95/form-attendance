import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const attendanceFormSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  date: z.string().min(1, "Date is required"),
  timeIn: z.string().optional(),
  timeOut: z.string().optional(),
  breakTimeStart: z.string().optional(),
  breakTimeEnd: z.string().optional(),
  status: z.enum(["present", "absent", "late", "half-day"]),
  workLocation: z.enum(["office", "remote", "field"]),
  notes: z.string().optional(),
  overtime: z.boolean().default(false),
  overtimeHours: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

interface AttendanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  editRecord?: any;
}

export function AttendanceForm({ isOpen, onClose, editRecord }: AttendanceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      employeeId: editRecord?.employeeId || "",
      date: editRecord?.date ? format(new Date(editRecord.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      timeIn: editRecord?.timeIn || "",
      timeOut: editRecord?.timeOut || "",
      breakTimeStart: editRecord?.breakTimeStart || "",
      breakTimeEnd: editRecord?.breakTimeEnd || "",
      status: editRecord?.status || "present",
      workLocation: editRecord?.workLocation || "office",
      notes: editRecord?.notes || "",
      overtime: editRecord?.overtime || false,
      overtimeHours: editRecord?.overtimeHours || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AttendanceFormData) => apiRequest("/api/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Attendance record created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/stats"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create attendance record",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AttendanceFormData) => apiRequest(`/api/attendance/${editRecord.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Attendance record updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/stats"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update attendance record",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AttendanceFormData) => {
    // Calculate total hours if both timeIn and timeOut are provided
    if (data.timeIn && data.timeOut && data.status !== "absent") {
      const timeIn = new Date(`2000-01-01 ${data.timeIn}`);
      const timeOut = new Date(`2000-01-01 ${data.timeOut}`);
      const breakStart = data.breakTimeStart ? new Date(`2000-01-01 ${data.breakTimeStart}`) : null;
      const breakEnd = data.breakTimeEnd ? new Date(`2000-01-01 ${data.breakTimeEnd}`) : null;
      
      let totalMinutes = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60);
      
      if (breakStart && breakEnd) {
        const breakMinutes = (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60);
        totalMinutes -= breakMinutes;
      }
      
      const totalHours = (totalMinutes / 60).toFixed(1);
      (data as any).totalHours = totalHours;
    }

    // Convert date string to ISO format
    const dateObj = new Date(data.date);
    (data as any).date = dateObj.toISOString();

    if (editRecord) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const watchedStatus = form.watch("status");
  const watchedOvertime = form.watch("overtime");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="dialog-title">
            {editRecord ? "Edit Attendance Record" : "Mark Attendance"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-employee">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(employees) ? employees.map((employee: any) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} ({employee.employeeId})
                          </SelectItem>
                        )) : null}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="half-day">Half Day</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="field">Field Work</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchedStatus !== "absent" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="timeIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time In</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} data-testid="input-time-in" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Out</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} data-testid="input-time-out" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breakTimeStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Break Start</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} data-testid="input-break-start" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breakTimeEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Break End</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} data-testid="input-break-end" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="overtime"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-overtime"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Overtime Work</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {watchedOvertime && (
                <FormField
                  control={form.control}
                  name="overtimeHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overtime Hours</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 2.5"
                          {...field}
                          data-testid="input-overtime-hours"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes..."
                      {...field}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-submit"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editRecord
                  ? "Update Record"
                  : "Mark Attendance"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}