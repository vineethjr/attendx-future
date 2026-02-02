import CustomCursor from "@/components/AttendX/CustomCursor";
import FloatingBlobs from "@/components/AttendX/FloatingBlobs";
import Navbar from "@/components/AttendX/Navbar";
import Hero from "@/components/AttendX/Hero";
import Features from "@/components/AttendX/Features";
import HowItWorks from "@/components/AttendX/HowItWorks";
import DashboardPreview from "@/components/AttendX/DashboardPreview";
import Analytics from "@/components/AttendX/Analytics";
import InteractionPlayground from "@/components/AttendX/InteractionPlayground";
import Footer from "@/components/AttendX/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden smooth-scroll">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Floating Background Blobs */}
      <FloatingBlobs />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <Features />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Dashboard Preview */}
        <DashboardPreview />
        
        {/* Analytics Section */}
        <Analytics />
        
        {/* Interactive Playground */}
        <InteractionPlayground />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
