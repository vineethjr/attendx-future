import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  ToggleLeft, 
  ToggleRight, 
  Bell, 
  CheckCircle2, 
  XCircle,
  User,
  AlertTriangle,
  Clock
} from "lucide-react";

const mockStudents = [
  { id: 1, name: "Alex Johnson", class: "10-A", status: "present", attendance: 94 },
  { id: 2, name: "Sarah Williams", class: "10-A", status: "present", attendance: 88 },
  { id: 3, name: "Mike Brown", class: "10-A", status: "absent", attendance: 72 },
  { id: 4, name: "Emily Davis", class: "10-A", status: "present", attendance: 96 },
];

const InteractionPlayground = () => {
  const [students, setStudents] = useState(mockStudents);
  const [showAlert, setShowAlert] = useState(false);
  const [alertStudent, setAlertStudent] = useState<typeof mockStudents[0] | null>(null);
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const toggleAttendance = (id: number) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        const newStatus = s.status === "present" ? "absent" : "present";
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const triggerAlert = (student: typeof mockStudents[0]) => {
    setAlertStudent(student);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6" ref={sectionRef}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/10 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-sm font-medium text-secondary-foreground">Interactive Demo</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Try It{" "}
            <span className="gradient-text">Yourself</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Experience the power of AttendX. Toggle attendance states and see real-time alerts in action.
          </motion.p>
        </div>

        {/* Interactive Demo */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Alert Notification */}
          <motion.div
            className={`fixed top-24 right-4 md:right-8 z-50 max-w-sm ${showAlert ? "pointer-events-auto" : "pointer-events-none"}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: showAlert ? 1 : 0, x: showAlert ? 0 : 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="glass-card rounded-xl p-4 shadow-xl border-l-4 border-orange-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Low Attendance Warning</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alertStudent?.name} has {alertStudent?.attendance}% attendance, below threshold.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Attendance Manager</h3>
                  <p className="text-sm text-muted-foreground">Class 10-A • Today's Session</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">09:00 AM</span>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="divide-y divide-border/50">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  className="p-4 md:p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{student.class}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        <span className={student.attendance < 75 ? "text-orange-600" : ""}>
                          {student.attendance}% Attendance
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Warning button for low attendance */}
                    {student.attendance < 75 && (
                      <motion.button
                        className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => triggerAlert(student)}
                      >
                        <Bell className="w-5 h-5" />
                      </motion.button>
                    )}

                    {/* Toggle button */}
                    <motion.button
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                        student.status === "present"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                      onClick={() => toggleAttendance(student.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {student.status === "present" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Present</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Absent</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Stats */}
            <div className="p-6 bg-muted/30 border-t border-border/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">
                      Present: <strong>{students.filter(s => s.status === "present").length}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">
                      Absent: <strong>{students.filter(s => s.status === "absent").length}</strong>
                    </span>
                  </div>
                </div>
                <motion.button
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Attendance
                </motion.button>
              </div>
            </div>
          </div>

          {/* Hint */}
          <motion.p
            className="text-center text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            💡 Tip: Click the bell icon on students with low attendance to see the alert system
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractionPlayground;
