import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  UserPlus, 
  Users, 
  Calendar, 
  MessageSquare, 
  AlertTriangle, 
  FileDown,
  ArrowRight,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "Register Student",
    description: "Secure student onboarding with comprehensive profile management",
    details: "Easy enrollment process with photo upload, contact details, and parent information",
    color: "from-primary to-indigo-400",
    bgColor: "bg-primary/5",
  },
  {
    icon: Users,
    title: "View Students",
    description: "Complete student database with advanced search & filtering",
    details: "Search, filter, and manage student records with bulk actions and quick edits",
    color: "from-accent to-teal-400",
    bgColor: "bg-accent/5",
  },
  {
    icon: Calendar,
    title: "Class Schedule",
    description: "Smart timetable & free period management system",
    details: "Visual calendar with drag-drop scheduling, conflict detection, and substitution management",
    color: "from-violet-500 to-purple-400",
    bgColor: "bg-violet-500/5",
  },
  {
    icon: MessageSquare,
    title: "Send Message",
    description: "Broadcast announcements to students and parents instantly",
    details: "SMS, email, and in-app notifications with delivery tracking and templates",
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-500/5",
  },
  {
    icon: AlertTriangle,
    title: "Attendance Warnings",
    description: "Automatic low-attendance detection & alert system",
    details: "Real-time monitoring with customizable thresholds and automated parent notifications",
    color: "from-orange-500 to-amber-400",
    bgColor: "bg-orange-500/5",
  },
  {
    icon: FileDown,
    title: "Export Reports",
    description: "Generate comprehensive Excel reports in one click",
    details: "Custom date ranges, class-wise reports, and scheduled automatic exports",
    color: "from-emerald-500 to-green-400",
    bgColor: "bg-emerald-500/5",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative glass-card rounded-2xl p-6 h-full overflow-hidden cursor-pointer ${feature.bgColor}`}
        whileHover={{ 
          y: -8,
          rotateX: 2,
          rotateY: -2,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Gradient border on hover */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 -z-10`}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotateZ: isHovered ? 5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <feature.icon className="w-7 h-7 text-white" />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>

        {/* Expandable details */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">{feature.details}</p>
            <motion.button
              className={`mt-4 flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
              whileHover={{ x: 5 }}
            >
              Learn more <ArrowRight className="w-4 h-4 text-primary" />
            </motion.button>
          </div>
        </motion.div>

        {/* Hover glow effect */}
        <motion.div
          className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 blur-xl -z-20`}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
};

const Features = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" ref={sectionRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Powerful Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Everything You Need for{" "}
            <span className="gradient-text">Smart Attendance</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Six powerful modules working together to automate your entire attendance workflow
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/5 via-transparent to-transparent -z-10" />
      </div>
    </section>
  );
};

export default Features;
