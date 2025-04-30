import { motion } from "framer-motion";
import { Topic } from "@/types/confession";

interface FeaturedTopicsProps {
  featuredTopics: Topic[];
  onTopicSelect?: (topic: string) => void;
  activeTopic?: string | null;
}

export const FeaturedTopics = ({ 
  featuredTopics, 
  onTopicSelect, 
  activeTopic = null 
}: FeaturedTopicsProps) => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  // Handle click on a topic
  const handleTopicClick = (topic: string) => {
    if (onTopicSelect) {
      onTopicSelect(topic);
    }
  };

  return (
    <motion.div 
      variants={fadeIn} 
      initial="hidden" 
      animate="visible"
      transition={{ delay: 0.2 }}
    >
      <div className="glass-card p-6 rounded-xl shadow-lg overflow-hidden relative">
        {/* Subtle glow effect */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold relative z-10">Featured Topics</h3>
          {activeTopic && (
            <button 
              onClick={() => onTopicSelect?.("") }
              className="text-xs text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="space-y-3 relative z-10">
          {featuredTopics.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-2">No topics available yet</p>
          ) : (
            featuredTopics.map((topic) => (
              <div
                key={topic.name}
                onClick={() => handleTopicClick(topic.name)}
                className={`flex items-center justify-between group cursor-pointer p-2 rounded-lg transition-colors
                  ${activeTopic === topic.name 
                    ? 'bg-primary-500/20 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-zinc-100/20 dark:hover:bg-zinc-800/40'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{topic.icon}</span>
                  <span>{topic.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  activeTopic === topic.name
                    ? 'bg-primary-100/30 dark:bg-primary-900/30 text-primary'
                    : 'text-zinc-500 bg-zinc-100/30 dark:bg-zinc-800/50 group-hover:bg-primary-100/30 dark:group-hover:bg-primary-900/30 group-hover:text-primary'
                }`}>
                  {topic.count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};