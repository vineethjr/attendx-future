import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, User, BookOpen } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLowAttendanceWarnings } from "@/hooks/useAttendance";
import { Progress } from "@/components/ui/progress";

const WarningsPage = () => {
  const { data: warnings = [], isLoading } = useLowAttendanceWarnings();

  return (
    <div>
      <DashboardHeader 
        title="Attendance Warnings" 
        subtitle="Students below 75% attendance threshold"
      />

      {/* Summary Card */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{warnings.length} Students</h3>
            <p className="text-muted-foreground">require attendance improvement</p>
          </div>
        </div>
      </div>

      {/* Warnings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : warnings.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-green-600 rotate-180" />
          </div>
          <h3 className="text-lg font-medium mb-2">All Clear!</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No students are currently below the 75% attendance threshold. Great job!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {warnings.map((warning, index) => (
            <motion.div
              key={warning.student_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl p-6 border-l-4 border-orange-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{warning.student_name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {warning.roll_number} • {warning.department} • Semester {warning.semester}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Attended <strong>{warning.classes_attended}</strong> of <strong>{warning.total_classes}</strong> classes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 min-w-[150px]">
                  <div className="text-right">
                    <span className="text-3xl font-bold text-orange-600">
                      {warning.attendance_percentage}%
                    </span>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                  <Progress 
                    value={warning.attendance_percentage} 
                    className="h-2 w-full bg-orange-100"
                  />
                  <p className="text-xs text-orange-600 font-medium">
                    {(75 - warning.attendance_percentage).toFixed(1)}% below threshold
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WarningsPage;
