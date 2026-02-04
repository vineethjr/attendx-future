import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  total_students: number;
  total_classes: number;
  classes_today: number;
  low_attendance_count: number;
  average_attendance: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_dashboard_stats");

      if (error) throw error;
      return data as unknown as DashboardStats;
    },
  });
}
