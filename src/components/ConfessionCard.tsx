import React, { memo, useContext, forwardRef, useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@nextui-org/tooltip";
import { Avatar } from "@nextui-org/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { CommentForm } from "./CommentForm";
import { Confession, Tag, ReactionType, MoodIcons, formatTimeAgo, validateAvatar } from "@/types/confession";

// Create a context to manage which card has an open reaction panel
interface ReactionContextType {
  activeCardId: string | null;
  setActiveCardId: (id: string | null) => void;
}

export const ReactionContext = React.createContext<ReactionContextType>({
  activeCardId: null,
  setActiveCardId: () => {},
});

interface ConfessionCardProps {
  confession: Confession;
  onToggleReaction?: (confessionId: string, reactionType: ReactionType) => void;
  onAddComment?: (confessionId: string, text: string, username?: string, avatar?: string) => void;
  onTagSelect?: (tag: Tag | null) => void;
}

// Optimize button animations by creating a reusable component
// Use forwardRef to allow PopoverTrigger to attach a ref
const AnimatedButton = memo(forwardRef<HTMLButtonElement, {
  children: React.ReactNode,
  onClick?: (e: React.MouseEvent) => void,
  className?: string,
  title?: string
}>(({ 
  children, 
  onClick, 
  className,
  title
}, ref) => (
  <motion.button 
    ref={ref} // Forward the ref to the motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={className}
    initial={false}
    title={title}
  >
    {children}
  </motion.button>
)));

// Add display name to avoid issues with React DevTools
AnimatedButton.displayName = 'AnimatedButton';

export const ConfessionCard = memo(({ 
  confession, 
  onToggleReaction, 
  onAddComment, 
  onTagSelect 
}: ConfessionCardProps) => {
  // Define 6 reaction types and their emojis
  const reactionTypes: ReactionType[] = ["❤️", "👍", "😂", "🔥", "😢"];

  // Mapping for reaction emoji descriptions
  const reactionDescriptions: Record<ReactionType, string> = {
    "❤️": "Love",
    "👍": "Like",
    "😂": "Haha",
    "🔥": "Fire",
    "😢": "Sad", 
  };

  // State to control comment popover visibility
  const [isCommentPopoverOpen, setIsCommentPopoverOpen] = useState(false);
  const reactionButtonRef = useRef<HTMLButtonElement>(null);
  
  // Use the reaction context to track which card has active reactions
  const { activeCardId, setActiveCardId } = useContext(ReactionContext);
  
  // Determine if this card should show reactions
  const showQuickReactions = activeCardId === confession.id;
  
  // Track screen size for responsive design - with throttled resize handler
  useEffect(() => {
    const checkScreenSize = () => {
      // Remove the setIsMobile call since we're not using isMobile
    }
    checkScreenSize(); // Initial check on mount
    
    // Throttled resize handler for better performance
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout === null) {
        resizeTimeout = window.setTimeout(() => {
          resizeTimeout = null;
          checkScreenSize();
        }, 150); // Throttle to once every 150ms
      }
    };
    
    // Set up event listener for window resize
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
    };
  }, []);
  
  // Handle click on reaction summary area to open panel
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from interfering if other handlers exist higher up
    setActiveCardId(confession.id);
  };
  
  // Close reaction panel
  const handleCloseReactions = (e?: React.MouseEvent) => {
    // Check if event exists before stopping propagation
    if (e) {
      e.stopPropagation();
    }
    setActiveCardId(null);
  };

  // Get the user's current reaction if any
  const getCurrentUserReaction = (): ReactionType | null => {
    if (!confession.reactions) return null;
    
    const userReaction = confession.reactions.find(r => r.userHasReacted);
    return userReaction ? userReaction.type : null;
  };

  // Handle reaction toggle with one reaction per user limitation
  const handleReactionToggle = (reactionType: ReactionType) => {
    if (onToggleReaction) {
      onToggleReaction(confession.id, reactionType);
    }
    
    // Close the reaction panel after selecting a reaction
    handleCloseReactions();
  }

  // Handle click outside of the reaction panel to close it
  const handleClickOutside = (e: MouseEvent) => {
    if (reactionButtonRef.current && !reactionButtonRef.current.contains(e.target as Node)) {
      handleCloseReactions();
    }
  }

  // Add event listener for clicks outside the reaction panel
  useEffect(() => {
    if (showQuickReactions) {
      document.addEventListener("click", handleClickOutside);
    }
    
    // Clean up event listener on unmount or when showQuickReactions changes
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showQuickReactions]);
 
  // Get all active reactions with count > 0 to display on card
  const activeReactions = useMemo(() => {
    if (!confession.reactions) return [];
    return confession.reactions.filter(r => r.count > 0);
  }, [confession.reactions]);



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        // Use performant animations with hardware acceleration
        type: "tween",
        ease: "easeOut"
      }}
      style={{ willChange: "opacity, transform" }}
      layout={false}
      className={`glass-card relative p-5 pb-16 rounded-xl shadow-lg overflow-hidden ${
        confession.isHighlighted
          ? 'bg-gradient-to-br from-violet-700/10 via-indigo-600/10 to-violet-500/10 border-violet-300/30 dark:border-violet-700/30'
          : ''
      } hover:shadow-xl optimize-paint`}
    >
      {/* Enhanced glow effects for highlighted cards - optimized with reduced animations */}
      {confession.isHighlighted && (
        <>
          <div className="absolute -top-5 -left-5 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl pointer-events-none mobile-reduced-animation" 
               style={{ 
                 willChange: "opacity", 
                 transform: "translateZ(0)",
                 opacity: 0.8
               }}
          />
          <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none mobile-reduced-animation"
               style={{ 
                 willChange: "opacity", 
                 transform: "translateZ(0)",
                 opacity: 0.8
               }}
          />
        </>
      )}

      <div className="relative flex justify-between mb-2 z-10">
        <div className="flex items-center">
          {confession.anonymous ? (
            <span className="text-xs text-zinc-500 glass px-2 py-0.5 rounded-full">Anonymous</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <Avatar 
                size="sm" 
                src={validateAvatar(confession.avatar)}
                alt={confession.username || "User avatar"}
                classNames={{
                  base: "border border-zinc-200 dark:border-zinc-700",
                }}
              />
              <span className="text-sm font-medium">{confession.username || `User${confession.id.substring(0, 4)}`}</span>
            </div>
          )}
        </div>
        {confession.mood && (
          <Tooltip content={confession.mood.charAt(0).toUpperCase() + confession.mood.slice(1)}>
            <span className="text-xl">{MoodIcons[confession.mood]}</span>
          </Tooltip>
        )}
      </div>
      
      <p className="text-zinc-800 dark:text-zinc-200 mb-3 relative z-10">{confession.text}</p>
      
      <div className="flex justify-between items-center relative z-10 mb-8">
        <div className="flex flex-wrap gap-1 items-center justify-center">
          {confession.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="text-xs px-2 p-2 rounded-full glass bg-violet-500/10 text-violet-700 dark:text-violet-300 cursor-pointer hover:bg-violet-500/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onTagSelect?.(tag);
              }}
            >
              {tag}
            </span>
          ))}
          {confession.tags.length > 3 && (
            <span className="text-xs px-2 p-1 rounded-full glass text-zinc-500 touch-target">
              +{confession.tags.length - 3}
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-500">{formatTimeAgo(confession.timestamp)}</span>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-zinc-200/30 dark:border-zinc-700/30 flex justify-between items-center z-50 bg-inherit">
        {/* Reaction button with reaction display */}
        <div className="flex items-center">
          <Popover
            isOpen={showQuickReactions} 
            onOpenChange={(open) => {
              setActiveCardId(open ? confession.id : null);
            }}
            placement="bottom"
          >
            {/* Fixed: Properly wrap AnimatedButton with PopoverTrigger */}
            <PopoverTrigger>
              <div 
                className="flex items-center cursor-pointer gap-1 text-zinc-500 hover:text-primary transition-colors px-2 py-1 rounded-full hover:bg-white/20 dark:hover:bg-zinc-800/20 touch-target"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(e); // Open the reaction panel
                }}
              >
                <span className="text-lg">
                  {getCurrentUserReaction() || "❤️"}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="glass-card">
              <div className="p-1 w-full">
                <div className="flex flex-wrap gap-1 justify-center">
                  {reactionTypes.map((reactionType) => (
                    <Tooltip key={reactionType} content={reactionDescriptions[reactionType]}>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className={`flex items-center text-sm p-1 rounded-full hover:bg-white/20 dark:hover:bg-zinc-800/20 touch-target ${getCurrentUserReaction() === reactionType ? 'bg-violet-500/10' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReactionToggle(reactionType);
                        }}
                      >
                        <span>{reactionType}</span>
                      </motion.button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Display reaction counts on card */}
          {activeReactions.length > 0 && (
            <div className="flex items-center ml-2 gap-0.5 bg-white/10 dark:bg-zinc-800/20 rounded-full px-2 py-0.5">
              {activeReactions.map((reaction) => (
                <div key={reaction.type} className="flex items-center gap-0.5 text-sm">
                  <span>{reaction.type}</span>
                  <span className="text-xs font-medium">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment button with improved styling */}
        <Popover 
          isOpen={isCommentPopoverOpen} 
          onOpenChange={(open) => {
            setIsCommentPopoverOpen(open);
          }}
          placement="bottom"
        >
          <PopoverTrigger>
            <div 
              className="flex items-center cursor-pointer gap-1.5 text-zinc-500 hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-white/20 dark:hover:bg-zinc-800/20 touch-target"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span className="text-lg">💬</span>
              {((confession.comments && confession.comments.length > 0) || (confession.commentsCount && confession.commentsCount > 0)) && (
                <span className="text-sm font-medium">{confession.comments?.length || confession.commentsCount}</span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="glass-card">
            <div className="p-3 w-full max-w-[95vw] sm:w-96">
              <h3 className="font-medium mb-3 text-primary">Comments</h3>
              
              {/* Comment form - moved to top for better UX like Instagram */}
              <div className="mb-4">
                <CommentForm 
                  onAddComment={(text, username, avatar) => {
                    if (typeof onAddComment === 'function') {
                      onAddComment(confession.id, text, username, avatar);
                      setIsCommentPopoverOpen(false); // Close popover after adding comment
                    }
                  }}
                />
              </div>
              
              {/* Display existing comments if available */}
              {confession.comments && confession.comments.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {confession.comments.map((comment) => (
                    <div key={comment.id} className="p-3 rounded-lg bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar 
                          size="sm" 
                          src={validateAvatar(comment.avatar)}
                          alt={comment.username || "Comment author"}
                          classNames={{
                            base: "border border-zinc-200 dark:border-zinc-700",
                          }}
                        />
                        <div>
                          <span className="text-sm font-medium">{comment.username}</span>
                          <span className="text-xs text-zinc-500 ml-2">
                            {formatTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 text-center my-4">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  );
});

// Add display name to avoid issues with React DevTools
ConfessionCard.displayName = 'ConfessionCard';