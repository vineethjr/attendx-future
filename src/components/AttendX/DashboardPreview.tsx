import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  BookOpen,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Students", active: false },
  { icon: Calendar, label: "Schedule", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: MessageSquare, label: "Messages", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const statsCards = [
  { label: "Total Students", value: "1,234", change: "+12%", icon: Users, color: "primary" },
  { label: "Today's Attendance", value: "92.5%", change: "+2.3%", icon: UserCheck, color: "accent" },
  { label: "Classes Today", value: "24", change: "Active", icon: BookOpen, color: "violet" },
  { label: "Pending Alerts", value: "7", change: "-3", icon: AlertTriangle, color: "orange" },
];

const recentActivity = [
  { type: "attendance", message: "Class 10-A marked present", time: "2 min ago", icon: CheckCircle2 },
  { type: "alert", message: "John Doe below 75% attendance", time: "15 min ago", icon: AlertTriangle },
  { type: "message", message: "Announcement sent to Class 12", time: "1 hour ago", icon: MessageSquare },
];

const DashboardPreview = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="dashboard" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6" ref={sectionRef}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/10 mb-6"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Admin Dashboard</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Powerful Dashboard,{" "}
            <span className="gradient-text">Beautiful Interface</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Everything you need at your fingertips. Monitor, manage, and analyze with our intuitive admin panel.
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="glass-card rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-border/50">
            <div className="flex">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border p-4">
                {/* Logo */}
                <div className="flex items-center gap-3 px-3 py-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold text-lg">X</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sidebar-foreground">AttendX®</h3>
                    <p className="text-xs text-muted-foreground">Admin Panel</p>
                  </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 space-y-1">
                  {sidebarItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                        item.active
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  ))}
                </nav>

                {/* Logout */}
                <motion.div
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-sidebar-accent/50 cursor-pointer transition-all"
                  whileHover={{ x: 4 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-background p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Welcome back, Admin 👋</h2>
                    <p className="text-sm text-muted-foreground">Here's what's happening today</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 text-sm rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none w-full sm:w-auto"
                      />
                    </div>
                    <motion.button
                      className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </motion.button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {statsCards.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="glass-card rounded-xl p-4 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ y: -4, boxShadow: "0 10px 40px hsl(var(--primary) / 0.1)" }}
                      onMouseEnter={() => setHoveredStat(index)}
                      onMouseLeave={() => setHoveredStat(null)}
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
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          stat.change.startsWith("+") ? "bg-green-100 text-green-600" :
                          stat.change.startsWith("-") ? "bg-red-100 text-red-600" :
                          "bg-blue-100 text-blue-600"
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts and Activity */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Chart Area */}
                  <div className="lg:col-span-2 glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold">Weekly Attendance Overview</h3>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        This Week <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="h-48 flex items-end gap-3">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
                        const height = 40 + Math.random() * 60;
                        return (
                          <div key={day} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div
                              className="w-full bg-gradient-to-t from-primary/30 to-primary rounded-t-lg relative overflow-hidden"
                              initial={{ height: 0 }}
                              animate={isInView ? { height: `${height}%` } : {}}
                              transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                              />
                            </motion.div>
                            <span className="text-xs text-muted-foreground">{day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 1 + index * 0.1 }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activity.type === "attendance" ? "bg-green-100 text-green-600" :
                            activity.type === "alert" ? "bg-orange-100 text-orange-600" :
                            "bg-blue-100 text-blue-600"
                          }`}>
                            <activity.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{activity.message}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {activity.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background glow */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-radial from-primary/5 via-transparent to-transparent blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
