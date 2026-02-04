import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Save, Users, Calendar as CalendarIcon, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useClasses, Class } from "@/hooks/useClasses";
import { useStudents, Student } from "@/hooks/useStudents";
import { useAttendanceByClass, useMarkAttendance, AttendanceRecord } from "@/hooks/useAttendance";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AttendancePage = () => {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [attendanceState, setAttendanceState] = useState<Record<string, "Present" | "Absent">>({});

  const { data: classes = [] } = useClasses();
  const { data: students = [] } = useStudents();
  const { data: existingAttendance = [], isLoading: loadingAttendance } = useAttendanceByClass(selectedClassId);
  const markAttendance = useMarkAttendance();

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // Filter students by department and semester of selected class
  const eligibleStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter(
      (s) => s.department === selectedClass.department && s.semester === selectedClass.semester
    );
  }, [students, selectedClass]);

  // Initialize attendance state when class changes
  useMemo(() => {
    if (!selectedClassId || loadingAttendance) return;

    const initialState: Record<string, "Present" | "Absent"> = {};
    
    // First set all eligible students as not marked
    eligibleStudents.forEach((student) => {
      initialState[student.id] = "Absent";
    });

    // Then override with existing attendance
    existingAttendance.forEach((record) => {
      initialState[record.student_id] = record.status as "Present" | "Absent";
    });

    setAttendanceState(initialState);
  }, [selectedClassId, existingAttendance, eligibleStudents, loadingAttendance]);

  const toggleAttendance = (studentId: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const markAllPresent = () => {
    const newState: Record<string, "Present" | "Absent"> = {};
    eligibleStudents.forEach((s) => {
      newState[s.id] = "Present";
    });
    setAttendanceState(newState);
  };

  const markAllAbsent = () => {
    const newState: Record<string, "Present" | "Absent"> = {};
    eligibleStudents.forEach((s) => {
      newState[s.id] = "Absent";
    });
    setAttendanceState(newState);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) return;

    const records: AttendanceRecord[] = eligibleStudents.map((student) => ({
      student_id: student.id,
      class_id: selectedClass.id,
      status: attendanceState[student.id] || "Absent",
      date: selectedClass.class_date,
    }));

    await markAttendance.mutateAsync(records);
  };

  const presentCount = Object.values(attendanceState).filter((s) => s === "Present").length;
  const totalCount = eligibleStudents.length;

  return (
    <div>
      <DashboardHeader title="Mark Attendance" subtitle="Record daily class attendance" />

      {/* Class Selection */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 space-y-2 w-full sm:w-auto">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Select Class
            </label>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="w-full sm:w-[350px]">
                <SelectValue placeholder="Choose a class to mark attendance" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.subject_name} - {cls.department} (Sem {cls.semester}) - {format(new Date(cls.class_date), "MMM d")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClass && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Students: </span>
                <span className="font-medium">{totalCount}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Present: </span>
                <span className="font-medium text-green-600">{presentCount}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Absent: </span>
                <span className="font-medium text-red-600">{totalCount - presentCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Grid */}
      {selectedClass ? (
        <>
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button variant="outline" size="sm" onClick={markAllPresent}>
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
              Mark All Present
            </Button>
            <Button variant="outline" size="sm" onClick={markAllAbsent}>
              <XCircle className="w-4 h-4 mr-2 text-red-600" />
              Mark All Absent
            </Button>
          </div>

          {eligibleStudents.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">
                No students found for {selectedClass.department}, Semester {selectedClass.semester}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {eligibleStudents.map((student, index) => {
                const isPresent = attendanceState[student.id] === "Present";
                return (
                  <motion.button
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => toggleAttendance(student.id)}
                    className={cn(
                      "glass-card rounded-xl p-4 text-left transition-all hover:shadow-md",
                      isPresent
                        ? "ring-2 ring-green-500 bg-green-50"
                        : "ring-1 ring-border hover:ring-red-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium truncate pr-2">{student.name}</span>
                      {isPresent ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{student.roll_number}</p>
                    <span className={cn(
                      "inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium",
                      isPresent ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {isPresent ? "Present" : "Absent"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Save Button */}
          {eligibleStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 right-6 md:bottom-8 md:right-8"
            >
              <Button
                size="lg"
                onClick={handleSaveAttendance}
                disabled={markAttendance.isPending}
                className="shadow-xl gap-2"
              >
                <Save className="w-5 h-5" />
                Save Attendance
              </Button>
            </motion.div>
          )}
        </>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <ClipboardCheck className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Select a Class</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose a class from the dropdown above to start marking attendance for students.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
