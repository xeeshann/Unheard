import { useState, useEffect } from "react";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { title, subtitle } from "@/components/primitives";
import { motion } from "framer-motion";
import { confessionService } from "@/lib/appwrite";
import { Topic } from "@/types/confession";

interface HeroSectionProps {
  darkGradient: boolean;
  onToggleTheme: () => void;
}

interface StatsData {
  totalConfessions: number;
  totalUsers: number;
  totalConnections: number;
  anonymityPercentage: number;
  loading: boolean;
}

export const HeroSection = ({ darkGradient }: HeroSectionProps) => {
  const [stats, setStats] = useState<StatsData>({
    totalConfessions: 0,
    totalUsers: 0,
    totalConnections: 0,
    anonymityPercentage: 98,
    loading: true
  });

  // Fetch stats from Appwrite
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all confessions
        const confessions = await confessionService.getAllConfessions();
        
        // Get topic statistics for connection calculation
        const topics: Topic[] = await confessionService.getTopicStatistics();
        
        // Calculate the total of all topic counts for connections
        const totalConnections = topics.reduce((sum, topic) => sum + topic.count, 0);
        
        // Estimate user count as % of confessions (since we don't have device IDs)
        const estimatedUsers = Math.floor(confessions.length * 0.7);
        
        // Calculate anonymous percentage (hardcoded for now, could be dynamic)
        const anonymityPercentage = 98;
        
        setStats({
          totalConfessions: confessions.length,
          totalUsers: estimatedUsers,
          totalConnections: totalConnections || 42000, // Fallback to default if calculation fails
          anonymityPercentage: anonymityPercentage,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to sample data if fetch fails
        setStats({
          totalConfessions: 10000,
          totalUsers: 5000,
          totalConnections: 42000,
          anonymityPercentage: 98,
          loading: false
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-20 isolate">
      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <motion.h1 
                className={`${title({ color: "violet", size: "lg" })} text-shadow-glow`}
                initial={{ letterSpacing: "0.2em" }}
                animate={{ letterSpacing: "0.1em" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                UNHEARD
              </motion.h1>
              <motion.p 
                className={subtitle({ class: "mt-4 mb-8 max-w-2xl mx-auto text-xl" })}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                A safe space where your voice matters and average experiences become extraordinary connections. Unheard is an anonymous confession platform where users can share their thoughts, experiences, and emotions without revealing their identity.
               
              </motion.p>
            </motion.div>
            
            {/* CTA Buttons with hover effects and glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-5"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  className={`${buttonStyles({
                    color: "primary",
                    radius: "full",
                    variant: "shadow",
                    size: "lg",
                  })} backdrop-blur-md bg-primary/80 hover:bg-primary/90 transition-all duration-300`}
                  href="#confess"
                >
                  Share Your Story
                </Link>
              </motion.div>
              
              
            </motion.div>
          </div>
          
          {/* Stats with enhanced glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-20"
          >
            <div className={`glass-card relative p-6 backdrop-blur-lg rounded-2xl overflow-hidden
              ${darkGradient 
                ? 'bg-background/10 border-white/10' 
                : 'bg-white/30 border-white/30'
              }`}>
              {/* Enhanced glow effects */}
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
              
              <div className="grid grid-cols-3 md:grid-cols-3 gap-8 relative z-10">
                <StatCard 
                  value={stats.loading ? "Loading..." : `${formatNumber(stats.totalConfessions)}+`} 
                  label="Confessions" 
                  delay={0.9} 
                />
                <StatCard 
                  value={stats.loading ? "Loading..." : `${formatNumber(stats.totalUsers)}+`} 
                  label="Users" 
                  delay={1.0} 
                />
                <StatCard 
                  value={stats.loading ? "Loading..." : `${stats.anonymityPercentage}%`} 
                  label="Anonymity" 
                  delay={1.2} 
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add text shadow glow class with global styles approach */}
      <style>{`
        .text-shadow-glow {
          text-shadow: 0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3);
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K`; 
  }
  return num.toString();
};

// Animated stat counter component with enhanced glassmorphism
const StatCard = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <motion.p 
        className="text-4xl font-bold text-primary"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3, type: "spring" }}
      >
        {value}
      </motion.p>
      <p className="text-sm text-foreground-500">{label}</p>
    </motion.div>
  );
};