import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  UserPlus, 
  CalendarClock, 
  CheckCircle2, 
  BarChart3, 
  FileDown,
  ArrowRight,
  ChevronRight
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Student Registration",
    description: "Onboard students with complete profiles including photos, contact info, and course enrollment.",
    color: "from-primary to-indigo-400",
  },
  {
    number: "02",
    icon: CalendarClock,
    title: "Class Scheduling",
    description: "Set up timetables, manage free periods, and handle substitutions effortlessly.",
    color: "from-violet-500 to-purple-400",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Attendance Tracking",
    description: "Mark attendance in seconds with bulk actions, QR codes, or biometric integration.",
    color: "from-accent to-teal-400",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Analytics & Alerts",
    description: "Get real-time insights with automatic low-attendance warnings and trend analysis.",
    color: "from-orange-500 to-amber-400",
  },
  {
    number: "05",
    icon: FileDown,
    title: "Reports Export",
    description: "Generate detailed reports in Excel, PDF, or integrate directly with your existing systems.",
    color: "from-emerald-500 to-green-400",
  },
];

const StepCard = ({ step, index, activeStep, setActiveStep }: { 
  step: typeof steps[0]; 
  index: number;
  activeStep: number;
  setActiveStep: (index: number) => void;
}) => {
  const isActive = activeStep === index;
  
  return (
    <motion.div
      className="relative cursor-pointer group"
      onClick={() => setActiveStep(index)}
      onMouseEnter={() => setActiveStep(index)}
    >
      <motion.div
        className={`relative p-6 rounded-2xl transition-all duration-300 ${
          isActive ? "glass-card shadow-lg" : "hover:bg-muted/30"
        }`}
        animate={{
          scale: isActive ? 1.02 : 1,
          backgroundColor: isActive ? "hsl(var(--card))" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-start gap-4">
          {/* Number badge */}
          <motion.div
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                : "bg-muted text-muted-foreground"
            }`}
            animate={{
              scale: isActive ? 1.1 : 1,
            }}
          >
            {step.number}
            {isActive && (
              <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.color} blur-lg opacity-50 -z-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
              />
            )}
          </motion.div>

          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-2 transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
            }`}>
              {step.title}
            </h3>
            
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isActive ? "auto" : 0,
                opacity: isActive ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          </div>

          {/* Arrow indicator */}
          <motion.div
            className={`transition-colors ${isActive ? "text-primary" : "text-muted-foreground/30"}`}
            animate={{ x: isActive ? 5 : 0 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Active indicator line */}
        <motion.div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${step.color}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <div ref={sectionRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/10 mb-6"
            >
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">How It Works</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              From Setup to{" "}
              <span className="gradient-text">Insights</span>{" "}
              in 5 Steps
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-10"
            >
              AttendX streamlines your entire attendance workflow into a simple, 
              intuitive process that saves hours every week.
            </motion.p>

            {/* Steps List */}
            <div className="space-y-2">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <StepCard 
                    step={step} 
                    index={index}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Central icon */}
              <motion.div
                className={`absolute inset-0 flex items-center justify-center`}
                key={activeStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center shadow-2xl`}>
                  {(() => {
                    const IconComponent = steps[activeStep].icon;
                    return <IconComponent className="w-16 h-16 md:w-20 md:h-20 text-white" />;
                  })()}
                </div>
              </motion.div>

              {/* Orbiting elements */}
              {steps.map((step, index) => {
                const angle = (index / steps.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={step.number}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      x: x,
                      y: y,
                      scale: activeStep === index ? 1.2 : 0.8,
                      opacity: activeStep === index ? 1 : 0.4,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <motion.div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-bold cursor-pointer transition-all ${
                        activeStep === index
                          ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                          : "bg-card border border-border text-muted-foreground hover:bg-muted"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setActiveStep(index)}
                    >
                      {step.number}
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 400 400">
                <motion.circle
                  cx="200"
                  cy="200"
                  r="140"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="8 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>

              {/* Background glow */}
              <div className={`absolute inset-0 rounded-full bg-gradient-radial ${
                activeStep === 0 ? "from-primary/10" :
                activeStep === 1 ? "from-violet-500/10" :
                activeStep === 2 ? "from-accent/10" :
                activeStep === 3 ? "from-orange-500/10" :
                "from-emerald-500/10"
              } via-transparent to-transparent blur-2xl -z-20`} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
