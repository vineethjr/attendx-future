import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, Filter, Calendar as CalendarIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useStudentAttendanceStats } from "@/hooks/useAttendance";
import { useClasses } from "@/hooks/useClasses";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const departments = ["All", "Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology"];

const ReportsPage = () => {
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const { data: stats = [], isLoading } = useStudentAttendanceStats();
  const { data: classes = [] } = useClasses();

  const filteredStats = stats.filter((s) => {
    if (departmentFilter !== "All" && s.department !== departmentFilter) return false;
    return true;
  });

  const exportToCSV = () => {
    const headers = ["Name", "Roll Number", "Department", "Semester", "Total Classes", "Classes Attended", "Attendance %"];
    const rows = filteredStats.map((s) => [
      s.student_name,
      s.roll_number,
      s.department,
      s.semester,
      s.total_classes,
      s.classes_attended,
      s.attendance_percentage,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // For Excel, we'll create a more detailed CSV that Excel can open
    const headers = ["Student Name", "Roll Number", "Department", "Semester", "Total Classes", "Classes Attended", "Attendance Percentage", "Status"];
    const rows = filteredStats.map((s) => [
      s.student_name,
      s.roll_number,
      s.department,
      s.semester,
      s.total_classes,
      s.classes_attended,
      `${s.attendance_percentage}%`,
      s.attendance_percentage >= 75 ? "Good Standing" : "Low Attendance",
    ]);

    // Add BOM for Excel to recognize UTF-8
    const BOM = "\uFEFF";
    const csvContent = BOM + [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${format(new Date(), "yyyy-MM-dd")}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const averageAttendance = filteredStats.length > 0
    ? (filteredStats.reduce((acc, s) => acc + s.attendance_percentage, 0) / filteredStats.length).toFixed(1)
    : 0;

  const lowAttendanceCount = filteredStats.filter((s) => s.attendance_percentage < 75).length;

  return (
    <div>
      <DashboardHeader title="Reports" subtitle="Export attendance data and analytics" />

      {/* Filters */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="space-y-2 w-full md:w-auto">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Department
            </label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button onClick={exportToExcel} className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4"
        >
          <Users className="w-5 h-5 text-primary mb-2" />
          <div className="text-2xl font-bold">{filteredStats.length}</div>
          <div className="text-sm text-muted-foreground">Total Students</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4"
        >
          <CalendarIcon className="w-5 h-5 text-accent mb-2" />
          <div className="text-2xl font-bold">{classes.length}</div>
          <div className="text-sm text-muted-foreground">Total Classes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <span className="text-xs font-bold text-green-600">%</span>
          </div>
          <div className="text-2xl font-bold">{averageAttendance}%</div>
          <div className="text-sm text-muted-foreground">Average Attendance</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mb-2">
            <span className="text-xs font-bold text-orange-600">!</span>
          </div>
          <div className="text-2xl font-bold">{lowAttendanceCount}</div>
          <div className="text-sm text-muted-foreground">Low Attendance</div>
        </motion.div>
      </div>

      {/* Attendance Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Student</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Department</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Semester</th>
                <th className="text-left p-4 font-medium">Classes</th>
                <th className="text-left p-4 font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-4"><div className="h-5 w-32 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4 hidden md:table-cell"><div className="h-5 w-28 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4 hidden lg:table-cell"><div className="h-5 w-16 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4"><div className="h-5 w-20 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4"><div className="h-5 w-24 bg-muted animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : filteredStats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No attendance data available</p>
                  </td>
                </tr>
              ) : (
                filteredStats.map((student) => (
                  <tr key={student.student_id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{student.student_name}</p>
                        <p className="text-sm text-muted-foreground">{student.roll_number}</p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">{student.department}</td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        Sem {student.semester}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">
                        {student.classes_attended} / {student.total_classes}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <Progress 
                          value={student.attendance_percentage} 
                          className={cn(
                            "h-2 flex-1",
                            student.attendance_percentage < 75 ? "bg-orange-100" : "bg-green-100"
                          )}
                        />
                        <span className={cn(
                          "text-sm font-medium min-w-[45px]",
                          student.attendance_percentage < 75 ? "text-orange-600" : "text-green-600"
                        )}>
                          {student.attendance_percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
