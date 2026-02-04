import { motion } from "framer-motion";
import { Users, BookOpen, AlertTriangle, UserCheck, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useTodaysClasses } from "@/hooks/useClasses";
import { useLowAttendanceWarnings } from "@/hooks/useAttendance";
import { format } from "date-fns";

const statsConfig = [
  { key: "total_students", label: "Total Students", icon: Users, color: "primary" },
  { key: "average_attendance", label: "Avg Attendance", icon: UserCheck, color: "accent", suffix: "%" },
  { key: "classes_today", label: "Classes Today", icon: BookOpen, color: "violet" },
  { key: "low_attendance_count", label: "Low Attendance", icon: AlertTriangle, color: "orange" },
];

const DashboardHome = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: todaysClasses = [] } = useTodaysClasses();
  const { data: warnings = [] } = useLowAttendanceWarnings();

  return (
    <div>
      <DashboardHeader 
        title="Welcome back, Admin 👋" 
        subtitle="Here's what's happening today"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsConfig.map((stat, index) => {
          const value = stats?.[stat.key as keyof typeof stats] ?? 0;
          const isNegative = stat.key === "low_attendance_count" && Number(value) > 0;
          
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === "primary" ? "bg-primary/10 text-primary" :
                  stat.color === "accent" ? "bg-accent/10 text-accent" :
                  stat.color === "violet" ? "bg-violet-500/10 text-violet-500" :
                  "bg-orange-500/10 text-orange-500"
                }`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {!statsLoading && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                    isNegative ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}>
                    {isNegative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {stat.key === "low_attendance_count" ? value : "Active"}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <>
                    {value}{stat.suffix || ""}
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Today's Classes
            </h3>
            <span className="text-xs text-muted-foreground">
              {format(new Date(), "EEEE, MMM d")}
            </span>
          </div>

          {todaysClasses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No classes scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysClasses.slice(0, 5).map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{classItem.subject_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {classItem.department} • Sem {classItem.semester}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {classItem.start_time.slice(0, 5)} - {classItem.end_time.slice(0, 5)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Low Attendance Warnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Low Attendance Alerts
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">
              {warnings.length} students
            </span>
          </div>

          {warnings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>All students have good attendance!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {warnings.slice(0, 5).map((warning) => (
                <div
                  key={warning.student_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-100"
                >
                  <div>
                    <p className="font-medium">{warning.student_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {warning.roll_number} • {warning.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {warning.attendance_percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {warning.classes_attended}/{warning.total_classes} classes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
