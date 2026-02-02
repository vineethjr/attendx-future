import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const FloatingBlobs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Parallax transforms for each blob
  const blob1X = useTransform(mouseXSpring, [-500, 500], [-30, 30]);
  const blob1Y = useTransform(mouseYSpring, [-500, 500], [-30, 30]);
  const blob2X = useTransform(mouseXSpring, [-500, 500], [20, -20]);
  const blob2Y = useTransform(mouseYSpring, [-500, 500], [20, -20]);
  const blob3X = useTransform(mouseXSpring, [-500, 500], [-15, 15]);
  const blob3Y = useTransform(mouseYSpring, [-500, 500], [25, -25]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary blob - Large indigo */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl animate-blob"
        style={{
          background: "radial-gradient(circle, hsl(235 85% 55% / 0.4) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          x: blob1X,
          y: blob1Y,
        }}
      />

      {/* Secondary blob - Cyan accent */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-3xl animate-blob"
        style={{
          background: "radial-gradient(circle, hsl(185 85% 45% / 0.4) 0%, transparent 70%)",
          top: "40%",
          right: "5%",
          x: blob2X,
          y: blob2Y,
          animationDelay: "-3s",
        }}
      />

      {/* Tertiary blob - Mixed */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-3xl animate-blob"
        style={{
          background: "radial-gradient(circle, hsl(200 80% 50% / 0.3) 0%, transparent 70%)",
          bottom: "10%",
          left: "30%",
          x: blob3X,
          y: blob3Y,
          animationDelay: "-7s",
        }}
      />

      {/* Small floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(235 85% 55%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(235 85% 55%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

export default FloatingBlobs;
