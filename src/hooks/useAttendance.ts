import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  status: "Present" | "Absent";
  date: string;
  marked_at: string;
}

export interface AttendanceRecord {
  student_id: string;
  class_id: string;
  status: "Present" | "Absent";
  date: string;
}

export interface StudentAttendanceStats {
  student_id: string;
  student_name: string;
  roll_number: string;
  department: string;
  semester: number;
  total_classes: number;
  classes_attended: number;
  attendance_percentage: number;
}

export interface LowAttendanceWarning {
  student_id: string;
  student_name: string;
  roll_number: string;
  department: string;
  semester: number;
  total_classes: number;
  classes_attended: number;
  attendance_percentage: number;
}

export function useAttendanceByClass(classId: string) {
  return useQuery({
    queryKey: ["attendance", classId],
    queryFn: async () => {
      if (!classId) return [];
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("class_id", classId);

      if (error) throw error;
      return data as Attendance[];
    },
    enabled: !!classId,
  });
}

export function useStudentAttendanceStats() {
  return useQuery({
    queryKey: ["student-attendance-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_attendance_stats")
        .select("*")
        .order("attendance_percentage", { ascending: true });

      if (error) throw error;
      return data as StudentAttendanceStats[];
    },
  });
}

export function useLowAttendanceWarnings() {
  return useQuery({
    queryKey: ["low-attendance-warnings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("low_attendance_warnings")
        .select("*")
        .order("attendance_percentage", { ascending: true });

      if (error) throw error;
      return data as LowAttendanceWarning[];
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (records: AttendanceRecord[]) => {
      // Use upsert to handle duplicates
      const { data, error } = await supabase
        .from("attendance")
        .upsert(records, {
          onConflict: "student_id,class_id,date",
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["student-attendance-stats"] });
      queryClient.invalidateQueries({ queryKey: ["low-attendance-warnings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Attendance marked successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark attendance");
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("attendance").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["student-attendance-stats"] });
      queryClient.invalidateQueries({ queryKey: ["low-attendance-warnings"] });
      toast.success("Attendance record deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete attendance record");
    },
  });
}
