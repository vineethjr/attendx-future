import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Users, BarChart3, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, hsl(220 30% 98%) 0%, hsl(230 40% 96%) 50%, hsl(220 30% 98%) 100%)",
        }}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/10 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-sm font-medium text-secondary-foreground">
                Next-Gen Attendance Management
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="block">AttendX®</span>
              <span className="block mt-2">
                <span className="gradient-text">Smart Attendance,</span>
              </span>
              <span className="block mt-2 text-muted-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium">
                Simplified.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Automate attendance tracking, analytics, and communication for 
              colleges, schools, and training institutes. One platform, endless possibilities.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Button
                size="lg"
                className="magnetic-hover bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 shadow-lg hover:shadow-xl group"
                onClick={() => scrollToSection("#features")}
              >
                Explore Features
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="magnetic-hover text-lg px-8 py-6 group border-2"
                onClick={() => scrollToSection("#dashboard")}
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                View Dashboard
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
            >
              {[
                { value: "98%", label: "Accuracy" },
                { value: "50+", label: "Institutions" },
                { value: "10K+", label: "Students" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="relative perspective-1000">
              <motion.div
                className="glass-card rounded-2xl p-6 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                    <p className="text-sm text-muted-foreground">Today's Summary</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: Users, value: "1,234", label: "Students", color: "text-primary" },
                    { icon: BarChart3, value: "92%", label: "Attendance", color: "text-accent" },
                    { icon: Bell, value: "23", label: "Alerts", color: "text-orange-500" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-muted/50 rounded-xl p-4 text-center"
                      whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--secondary))" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                      <div className="text-xl font-bold">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Attendance Progress */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Weekly Attendance</span>
                    <span className="text-muted-foreground">Mon - Fri</span>
                  </div>
                  <div className="flex gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                      <motion.div
                        key={day}
                        className="flex-1 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <motion.div
                          className="h-20 bg-gradient-to-t from-primary/20 to-primary rounded-lg relative overflow-hidden"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 0.6 + Math.random() * 0.4 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                          style={{ transformOrigin: "bottom" }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-accent/50 to-transparent"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          />
                        </motion.div>
                        <span className="text-xs text-muted-foreground mt-2 block">{day}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating notification cards */}
              <motion.div
                className="absolute -top-6 -right-6 glass-card rounded-xl p-4 shadow-lg max-w-[200px]"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Attendance Marked</p>
                    <p className="text-xs text-muted-foreground">Class 10-A • Just now</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-6 glass-card rounded-xl p-4 shadow-lg max-w-[180px]"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">+12% This Week</p>
                    <p className="text-xs text-muted-foreground">Attendance up</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background decorations */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-radial from-primary/10 via-transparent to-transparent blur-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
