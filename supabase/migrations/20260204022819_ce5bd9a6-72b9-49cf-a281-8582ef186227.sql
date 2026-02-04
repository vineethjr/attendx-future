-- =============================================
-- AttendX Database Schema
-- =============================================

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =============================================
-- 1. User Roles Table (for admin detection)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. Students Table
-- =============================================
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 10),
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. Classes Table
-- =============================================
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_name TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 10),
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. Attendance Table
-- =============================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (student_id, class_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. Messages Table
-- =============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Helper Function: Check if user is admin
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- =============================================
-- Trigger for updated_at timestamps
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- RLS Policies for user_roles
-- =============================================
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin() OR user_id = auth.uid());

CREATE POLICY "Only system can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.is_admin());

-- =============================================
-- RLS Policies for students
-- =============================================
CREATE POLICY "Admins can view all students"
  ON public.students FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert students"
  ON public.students FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update students"
  ON public.students FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete students"
  ON public.students FOR DELETE
  USING (public.is_admin());

-- =============================================
-- RLS Policies for classes
-- =============================================
CREATE POLICY "Admins can view all classes"
  ON public.classes FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert classes"
  ON public.classes FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update classes"
  ON public.classes FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete classes"
  ON public.classes FOR DELETE
  USING (public.is_admin());

-- =============================================
-- RLS Policies for attendance
-- =============================================
CREATE POLICY "Admins can view all attendance"
  ON public.attendance FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update attendance"
  ON public.attendance FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete attendance"
  ON public.attendance FOR DELETE
  USING (public.is_admin());

-- =============================================
-- RLS Policies for messages
-- =============================================
CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update messages"
  ON public.messages FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete messages"
  ON public.messages FOR DELETE
  USING (public.is_admin());

-- =============================================
-- View: Student Attendance Statistics
-- =============================================
CREATE OR REPLACE VIEW public.student_attendance_stats
WITH (security_invoker = on)
AS
SELECT 
  s.id AS student_id,
  s.name AS student_name,
  s.roll_number,
  s.department,
  s.semester,
  COUNT(a.id) AS total_classes,
  COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS classes_attended,
  CASE 
    WHEN COUNT(a.id) > 0 
    THEN ROUND((COUNT(CASE WHEN a.status = 'Present' THEN 1 END)::DECIMAL / COUNT(a.id)::DECIMAL) * 100, 2)
    ELSE 0
  END AS attendance_percentage
FROM public.students s
LEFT JOIN public.attendance a ON s.id = a.student_id
GROUP BY s.id, s.name, s.roll_number, s.department, s.semester;

-- =============================================
-- View: Low Attendance Warnings (below 75%)
-- =============================================
CREATE OR REPLACE VIEW public.low_attendance_warnings
WITH (security_invoker = on)
AS
SELECT 
  student_id,
  student_name,
  roll_number,
  department,
  semester,
  total_classes,
  classes_attended,
  attendance_percentage
FROM public.student_attendance_stats
WHERE attendance_percentage < 75 AND total_classes > 0;

-- =============================================
-- Function to get dashboard stats
-- =============================================
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_students', (SELECT COUNT(*) FROM public.students),
    'total_classes', (SELECT COUNT(*) FROM public.classes),
    'classes_today', (SELECT COUNT(*) FROM public.classes WHERE class_date = CURRENT_DATE),
    'low_attendance_count', (SELECT COUNT(*) FROM public.low_attendance_warnings),
    'average_attendance', (
      SELECT COALESCE(ROUND(AVG(attendance_percentage), 2), 0) 
      FROM public.student_attendance_stats 
      WHERE total_classes > 0
    )
  ) INTO result;
  
  RETURN result;
END;
$$;