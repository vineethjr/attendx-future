import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Users, Calendar } from "lucide-react";

const analyticsData = [
  { month: "Jan", attendance: 85, target: 90 },
  { month: "Feb", attendance: 88, target: 90 },
  { month: "Mar", attendance: 92, target: 90 },
  { month: "Apr", attendance: 87, target: 90 },
  { month: "May", attendance: 94, target: 90 },
  { month: "Jun", attendance: 91, target: 90 },
];

const classDistribution = [
  { name: "Class 10", percentage: 94, color: "from-primary to-indigo-400" },
  { name: "Class 11", percentage: 88, color: "from-accent to-teal-400" },
  { name: "Class 12", percentage: 92, color: "from-violet-500 to-purple-400" },
  { name: "Class 9", percentage: 86, color: "from-orange-500 to-amber-400" },
];

const insights = [
  { 
    title: "Best Performing Class",
    value: "Class 10-A",
    change: "+5.2%",
    trend: "up",
    icon: TrendingUp,
  },
  { 
    title: "Needs Attention",
    value: "Class 9-B",
    change: "-2.1%",
    trend: "down",
    icon: TrendingDown,
  },
  { 
    title: "Average Attendance",
    value: "91.2%",
    change: "+3.4%",
    trend: "up",
    icon: BarChart3,
  },
  { 
    title: "Total Students",
    value: "1,234",
    change: "+12",
    trend: "up",
    icon: Users,
  },
];

const Analytics = () => {
  const [activeMonth, setActiveMonth] = useState(5);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="analytics" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6" ref={sectionRef}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/10 mb-6"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Analytics & Intelligence</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Data-Driven{" "}
            <span className="gradient-text">Insights</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Transform raw attendance data into actionable intelligence with our advanced analytics engine
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <motion.div
            className="lg:col-span-2 glass-card rounded-2xl p-6 md:p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold">Attendance Trends</h3>
                <p className="text-sm text-muted-foreground">Monthly overview with target comparison</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent" />
                  <span className="text-muted-foreground">Attendance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <span className="text-muted-foreground">Target</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 flex items-end gap-4">
              {analyticsData.map((data, index) => (
                <div 
                  key={data.month} 
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                  onMouseEnter={() => setActiveMonth(index)}
                >
                  <div className="relative w-full h-full flex items-end justify-center">
                    {/* Target line indicator */}
                    <div 
                      className="absolute w-full h-px bg-muted-foreground/20"
                      style={{ bottom: `${data.target}%` }}
                    />
                    
                    {/* Bar */}
                    <motion.div
                      className={`w-full max-w-[40px] rounded-t-lg relative overflow-hidden transition-all ${
                        activeMonth === index 
                          ? "bg-gradient-to-t from-primary to-accent shadow-lg"
                          : "bg-gradient-to-t from-primary/40 to-accent/40"
                      }`}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${data.attendance}%` } : {}}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {activeMonth === index && (
                        <motion.div
                          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {data.attendance}%
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <span className={`text-xs transition-colors ${
                    activeMonth === index ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}>
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Insights Cards */}
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                className="glass-card rounded-xl p-5 cursor-pointer group"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ x: -4, boxShadow: "0 10px 40px hsl(var(--primary) / 0.1)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      insight.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      <insight.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{insight.title}</p>
                      <p className="text-xl font-bold">{insight.value}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    insight.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {insight.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Class Distribution */}
        <motion.div
          className="mt-8 glass-card rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-semibold">Class-wise Distribution</h3>
              <p className="text-sm text-muted-foreground">Attendance percentage by class</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">This Month</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classDistribution.map((cls, index) => (
              <motion.div
                key={cls.name}
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              >
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      {/* Background circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="12"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                        animate={isInView ? { 
                          strokeDashoffset: 2 * Math.PI * 50 * (1 - cls.percentage / 100) 
                        } : {}}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-2xl font-bold"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        {cls.percentage}%
                      </motion.span>
                    </div>
                  </div>
                </div>
                <p className="text-center font-medium">{cls.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Analytics;
