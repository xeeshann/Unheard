import { useState, useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { motion, AnimatePresence } from "framer-motion";
import DefaultLayout from "@/layouts/default";

import { HeroSection } from "@/components/HeroSection";
import { FeaturedTopics } from "@/components/FeaturedTopics";
import { ConfessionForm } from "@/components/ConfessionForm";
import { ConfessionFeed } from "@/components/ConfessionFeed";
import { Tag, Confession as BaseConfession, ReactionType, Reaction, Topic, Mood } from "@/types/confession";

// Import Appwrite services
import { confessionService, commentService } from "@/lib/appwrite";
import { ID } from "appwrite";

// Extend the Confession type to include additional properties
interface Confession extends BaseConfession {
  username?: string;
  avatar?: string;
}

// Initialize reactions for a confession
function initializeReactions(initialReaction?: ReactionType | null): Reaction[] {
  const reactionTypes: ReactionType[] = ["❤️", "👍", "😂", "😢", "🔥"];
  return reactionTypes.map(type => ({
    type,
    count: initialReaction === type ? 1 : 0,
    userHasReacted: initialReaction === type
  }));
}

// Default topics with placeholder counts
const defaultTopics: Topic[] = [
  { name: "Mental Health", icon: "🧠", count: 0 },
  { name: "Relationships", icon: "❤️", count: 0 },
  { name: "Career Struggles", icon: "💼", count: 0 },
  { name: "Academic Pressure", icon: "📚", count: 0 },
  { name: "Family Issues", icon: "👨‍👩‍👧‍👦", count: 0 },
  { name: "Identity & Self", icon: "🪞", count: 0 },
  { name: "Life Goals", icon: "🎯", count: 0 },
  { name: "Social Anxiety", icon: "😰", count: 0 }
];

export default function IndexPage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [activeFilter, setActiveFilter] = useState<Tag | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [darkGradient, setDarkGradient] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Remove unused userId state variable
  const [topics, setTopics] = useState<Topic[]>(defaultTopics);
  
  // Generate a unique ID for this user session (since we're not using auth)
  useEffect(() => {
    // Generate a unique user ID and store in localStorage
    const storedUserId = localStorage.getItem("unheard_user_id");
    if (!storedUserId) {
      const newUserId = ID.unique();
      localStorage.setItem("unheard_user_id", newUserId);
    }
  }, []);
  
  // Fetch topics and confessions on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch topics first
        const topicStats = await confessionService.getTopicStatistics();
        if (topicStats.length > 0) {
          setTopics(topicStats);
        }
        
        // Then fetch confessions
        const fetchedConfessions = await confessionService.getAllConfessions();
        
        // Process confessions to add reactions
        const processedConfessions = fetchedConfessions.map(confession => {
          // Initialize reactions if they don't exist
          if (!confession.reactions) {
            confession.reactions = initializeReactions();
          }
          return confession;
        });
        
        setConfessions(processedConfessions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlertMessage("Error loading content. Please try again later.");
        setTimeout(() => setAlertMessage(null), 3000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle topic selection for filtering
  const handleTopicSelect = (topic: string) => {
    // Clear tag filter if a topic is selected
    if (activeFilter) {
      setActiveFilter(null);
    }
    
    setActiveTopic(topic || null);
    
    // If a topic is selected, fetch confessions with that topic
    if (topic) {
      setLoading(true);
      confessionService.getConfessionsByTopic(topic)
        .then(topicConfessions => {
          setConfessions(topicConfessions);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching confessions by topic:", error);
          setAlertMessage("Error filtering confessions. Please try again.");
          setTimeout(() => setAlertMessage(null), 3000);
          setLoading(false);
        });
    } else {
      // If no topic is selected, fetch all confessions
      setLoading(true);
      confessionService.getAllConfessions()
        .then(allConfessions => {
          setConfessions(allConfessions);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching all confessions:", error);
          setLoading(false);
        });
    }
  };
  
  const handleSubmitConfession = async (confessionData: {
    text: string;
    tags: Tag[];
    mood: Mood | null;
    username: string;
    avatar?: string;
    initialReaction?: ReactionType | null;
    topic?: string;
  }) => {
    if (confessionData.text.trim().split(" ").length < 10) {
      setAlertMessage("Please write at least 10 words for your confession");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }
    
    try {
      setLoading(true);
      
      // Create the confession in Appwrite
      const response = await confessionService.createConfession(
        confessionData.text,
        confessionData.tags,
        confessionData.username,
        confessionData.mood || undefined,
        !confessionData.username, // anonymous if no username is provided
        confessionData.topic,
        confessionData.avatar // Pass the avatar to the service
      );
      
      // Add initial reaction if provided
      if (confessionData.initialReaction) {
        await confessionService.toggleReaction(
          response.$id,
          confessionData.initialReaction
        );
      }
      
      // Add the new confession to the state
      const newConfession: Confession = {
        id: response.$id,
        text: confessionData.text,
        tags: confessionData.tags,
        timestamp: new Date(),
        likes: 0,
        mood: confessionData.mood || undefined,
        commentsCount: 0,
        username: confessionData.username,
        avatar: confessionData.avatar || response.avatar,
        topic: confessionData.topic,
        reactions: initializeReactions(confessionData.initialReaction),
        comments: []
      };
      
      setConfessions(prev => [newConfession, ...prev]);
      
      // Update topic counts if a topic was specified
      if (confessionData.topic) {
        setTopics(prev => {
          const existingTopic = prev.find(t => t.name === confessionData.topic);
          if (existingTopic) {
            // Update existing topic count
            return prev.map(t => 
              t.name === confessionData.topic
                ? { ...t, count: t.count + 1 }
                : t
            );
          } else {
            // Add new topic
            const topicIcons: Record<string, string> = {
              "Mental Health": "🧠",
              "Relationships": "❤️",
              "Career Struggles": "💼",
              "Academic Pressure": "📚",
              "Family Issues": "👨‍👩‍👧‍👦",
              "Identity & Self": "🪞",
              "Life Goals": "🎯",
              "Social Anxiety": "😰",
              "Personal Growth": "🌱",
              "Dreams & Aspirations": "💭",
              "Health & Wellness": "🏋️‍♂️",
              "Travel & Adventure": "✈️",
              "Hobbies & Interests": "🎨",
              "Other": "📝"
            };
            
            // Add the new topic (safe assertion since we've already checked it exists in the if statement)
            const topicName = confessionData.topic as string;
            const newTopic: Topic = {
              name: topicName,
              icon: topicIcons[topicName] || "📝",
              count: 1
            };
            
            // Add and sort by count
            return [...prev, newTopic].sort((a, b) => b.count - a.count);
          }
        });
      }
      
      // Success message
      setAlertMessage("Your confession has been shared!");
      setTimeout(() => setAlertMessage(null), 3000);
      
      // Refresh topics after adding a new confession
      confessionService.getTopicStatistics()
        .then(updatedTopics => {
          if (updatedTopics.length > 0) {
            setTopics(updatedTopics);
          }
        })
        .catch(error => {
          console.error("Error updating topics:", error);
        });
        
    } catch (error) {
      console.error("Error creating confession:", error);
      setAlertMessage("Error sharing your confession. Please try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleTheme = () => {
    setDarkGradient(!darkGradient);
  };

  // Add or remove a reaction to a confession
  const toggleReaction = async (confessionId: string, reactionType: ReactionType) => {
    try {
      // Call Appwrite to toggle the reaction using our new system
      const result = await confessionService.toggleReaction(
        confessionId,
        reactionType
      );
      
      // Update the UI state
      setConfessions(prevConfessions => 
        prevConfessions.map(confession => {
          if (confession.id !== confessionId) return confession;

          // Get existing reactions or initialize if needed
          const reactions = confession.reactions || initializeReactions();
          
          // Update the reaction that was toggled
          const updatedReactions = reactions.map(reaction => {
            if (reaction.type !== reactionType) return reaction;
            
            // If the reaction was added, increment the count and mark as user-reacted
            // If it was removed, decrement and mark as not user-reacted
            return {
              ...reaction,
              count: result.added ? reaction.count + 1 : Math.max(0, reaction.count - 1),
              userHasReacted: result.added
            };
          });
          
          return { ...confession, reactions: updatedReactions };
        })
      );
    } catch (error) {
      console.error("Error toggling reaction:", error);
      setAlertMessage("Error updating reaction. Please try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  // Add a comment to a confession
  const addComment = async (confessionId: string, commentText: string, username: string = "Anonymous", avatar?: string) => {
    if (!commentText.trim()) {
      return;
    }

    try {
      // Create the comment in Appwrite using our improved authentication
      const newComment = await commentService.addComment(
        confessionId,
        commentText,
        username,
        avatar
      );
      
      // Update the UI state
      setConfessions(prevConfessions => {
        const updatedConfessions = prevConfessions.map(confession => {
          if (confession.id !== confessionId) return confession;

          // Ensure comments array exists before updating
          const currentComments = confession.comments || [];
          const updatedComments = [newComment, ...currentComments];

          // Return updated confession with the new comment
          return {
            ...confession,
            comments: updatedComments,
            commentsCount: updatedComments.length
          };
        });
        return updatedConfessions;
      });

      // Show success notification
      setAlertMessage("Comment added successfully!");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error("Error adding comment:", error);
      setAlertMessage("Error adding comment. Please try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  // Handle tag selection for filtering
  const handleTagSelect = (tag: Tag | null) => {
    // Clear topic filter if a tag is selected
    if (activeTopic) {
      setActiveTopic(null);
    }
    
    setActiveFilter(tag);
    
    // If a tag is selected, fetch confessions with that tag from Appwrite
    if (tag) {
      setLoading(true);
      confessionService.getConfessionsByTag(tag)
        .then(taggedConfessions => {
          setConfessions(taggedConfessions);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching confessions by tag:", error);
          setAlertMessage("Error filtering confessions. Please try again.");
          setTimeout(() => setAlertMessage(null), 3000);
          setLoading(false);
        });
    } else {
      // If no tag is selected, fetch all confessions
      setLoading(true);
      confessionService.getAllConfessions()
        .then(allConfessions => {
          setConfessions(allConfessions);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching all confessions:", error);
          setLoading(false);
        });
    }
  };

  // Clear search and filters
  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilter(null);
    setActiveTopic(null);
    
    // Fetch all confessions again
    setLoading(true);
    confessionService.getAllConfessions()
      .then(allConfessions => {
        setConfessions(allConfessions);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching all confessions:", error);
        setLoading(false);
      });
  };

  return (
    <DefaultLayout>
      {/* Notification/Alert */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 inset-x-0 z-50 flex justify-center"
          >
            <div className="bg-primary text-white px-6 py-3 rounded-full shadow-lg">
              {alertMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <HeroSection darkGradient={darkGradient} onToggleTheme={handleToggleTheme} />

      {/* Main Content */}
      <section className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          {/* Sidebar - Categories and Featured Topics - Hidden on small screens, replaced with tabs */}
          <div className="hidden md:block md:col-span-1 space-y-6">
           
            
            {/* Featured Topics */}
            <FeaturedTopics 
              featuredTopics={topics} 
              onTopicSelect={handleTopicSelect}
              activeTopic={activeTopic}
            />
          </div>
          
          {/* Main Content Area */}
          <div className="md:col-span-3 space-y-4 sm:space-y-8">
           
            
            {/* Active Filters */}
            {(activeFilter || activeTopic) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
              >
                <span>Filtering by:</span>
                {activeFilter && (
                  <span className="px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm">
                    {activeFilter}
                  </span>
                )}
                {activeTopic && (
                  <span className="px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm">
                    Topic: {activeTopic}
                  </span>
                )}
                <button 
                  onClick={clearFilters}
                  className="ml-auto text-primary hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Clear
                </button>
              </motion.div>
            )}
            
            {/* Confession Form */}
            <ConfessionForm 
              onSubmit={handleSubmitConfession} 
              featuredTopics={topics}
            />
          </div>
        </div>

        {/* Category Tabs - Visible on all screens, primary navigation on mobile */}
        <div className="mt-4 mb-6">
          <Tabs 
            aria-label="Confession categories"
            variant="underlined"
            color="primary"
            classNames={{
              tab: "data-[selected=true]:font-semibold",
              tabList: "gap-2 w-full overflow-x-auto",
              cursor: "w-full"
            }}
            selectedKey={selectedCategory}
            onSelectionChange={(key) => {
              setSelectedCategory(key as string);
              
              // Clear any active filters
              setActiveFilter(null);
              setActiveTopic(null);
              
              // Fetch the appropriate confessions based on selected category
              setLoading(true);
              if (key === 'highlighted') {
                confessionService.getHighlightedConfessions()
                  .then(highlightedConfessions => {
                    setConfessions(highlightedConfessions);
                    setLoading(false);
                  })
                  .catch(error => {
                    console.error("Error fetching highlighted confessions:", error);
                    setLoading(false);
                  });
              }
              else {
                // Default to "recent"
                confessionService.getAllConfessions()
                  .then(allConfessions => {
                    setConfessions(allConfessions);
                    setLoading(false);
                  })
                  .catch(error => {
                    console.error("Error fetching all confessions:", error);
                    setLoading(false);
                  });
              }
            }}
          >
            <Tab key="recent" title="Recent" />
            <Tab key="highlighted" title="Highlighted" />
          </Tabs>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Confessions</h2>
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Confessions Feed */}
        {!loading && (
          <ConfessionFeed
            confessions={confessions}
            activeFilter={activeFilter}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onTagSelect={handleTagSelect}
            onToggleReaction={toggleReaction}
            onAddComment={addComment}
          />
        )}
      </section>
    </DefaultLayout>
  );
}

