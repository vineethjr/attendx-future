import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Class {
  id: string;
  subject_name: string;
  department: string;
  semester: number;
  class_date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClassData {
  subject_name: string;
  department: string;
  semester: number;
  class_date: string;
  start_time: string;
  end_time: string;
}

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("class_date", { ascending: false })
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data as Class[];
    },
  });
}

export function useTodaysClasses() {
  return useQuery({
    queryKey: ["classes", "today"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("class_date", today)
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data as Class[];
    },
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classData: CreateClassData) => {
      const { data, error } = await supabase
        .from("classes")
        .insert([classData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Class scheduled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to schedule class");
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Class> & { id: string }) => {
      const { data, error } = await supabase
        .from("classes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update class");
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("classes").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Class deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete class");
    },
  });
}
